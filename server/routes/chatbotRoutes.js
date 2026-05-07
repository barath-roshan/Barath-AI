const express = require('express');
const Groq = require('groq-sdk');
const rateLimit = require('express-rate-limit');
const { getSession, updateSession } = require('../services/conversationManager');
const { detectIntent } = require('../services/intentDetector');
const { extractEntities, detectLanguage } = require('../services/entityExtractor');
const { buildSystemPrompt } = require('../services/promptBuilder');
const { matchSchemes } = require('../services/schemeMatcher');
const Application = require('../models/Application');
const User = require('../models/User');

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const limiter = rateLimit({ windowMs: 60000, max: 30 });
router.use(limiter);

router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ reply: 'Please type a message.', suggestions: [] });
    }

    // Get or create session
    const session = getSession(sessionId);

    // Detect language
    const lang = detectLanguage(message);
    if (lang !== 'en') session.language = lang;

    // Detect intent
    const { intent } = detectIntent(message);
    session.intent = intent;

    // Extract entities from message
    const entities = extractEntities(message);

    // Merge entities into collected profile
    Object.assign(session.collectedProfile, entities);

    // Track which fields came from this message
    Object.keys(entities).forEach(f => {
      if (!session.askedFields.includes(f)) session.askedFields.push(f);
    });

    // If user is logged in, enrich profile from DB
    if (userId && Object.keys(session.collectedProfile).length < 3) {
      try {
        const user = await User.findById(userId).lean();
        if (user) {
          session.collectedProfile = {
            state: user.state,
            category: user.category,
            name: user.name,
            ...session.collectedProfile // user message takes priority
          };
        }
      } catch (err) {
        console.warn('Could not fetch user for enrichment:', err.message);
      }
    }

    // Handle application tracking inline (no Groq needed)
    if (entities.applicationNumber) {
      const app = await Application.findOne({
        applicationNumber: entities.applicationNumber.toUpperCase()
      }).lean();

      if (app) {
        const statusMessages = {
          'Submitted': lang === 'ta'
            ? `உங்கள் விண்ணப்பம் ${app.applicationNumber} பெறப்பட்டது. ஆய்வுக்காக காத்திருக்கிறது.`
            : `Application ${app.applicationNumber} for "${app.schemeName}" has been received and is queued for review.`,
          'Under Review': lang === 'ta'
            ? `உங்கள் ஆவணங்கள் சரிபார்க்கப்படுகின்றன.`
            : `Your application is currently under review. Documents are being verified.`,
          'Approved': lang === 'ta'
            ? `🎉 உங்கள் விண்ணப்பம் அங்கீகரிக்கப்பட்டது!`
            : `🎉 Great news! Your application has been approved.`,
          'Rejected': lang === 'ta'
            ? `துரதிர்ஷ்டவசமாக உங்கள் விண்ணப்பம் நிராகரிக்கப்பட்டது.`
            : `Unfortunately, your application was not approved. ${app.remarks || 'Please contact support for details.'}`
        };
        const reply = statusMessages[app.status] || `Status: ${app.status}`;
        session.history.push({ role: 'user', content: message });
        session.history.push({ role: 'assistant', content: reply });
        updateSession(sessionId, session);
        return res.json({
          reply,
          suggestions: ['Apply another scheme', 'Check other application', 'Find new schemes'],
          applicationData: {
            applicationNumber: app.applicationNumber,
            schemeName: app.schemeName,
            status: app.status,
            submittedAt: app.submittedAt,
            lastUpdated: app.lastUpdated
          }
        });
      } else {
        const reply = lang === 'ta'
          ? `மன்னிக்கவும், ${entities.applicationNumber} எண்ணுடைய விண்ணப்பம் கிடைக்கவில்லை. எண்ணை மீண்டும் சரிபார்க்கவும்.`
          : `I couldn't find application ${entities.applicationNumber}. Please double-check the number — it should look like APP-2025-123456.`;
        return res.json({ reply, suggestions: ['Try again', 'Contact helpline', 'Find schemes'] });
      }
    }

    // Match schemes if we have enough profile data
    let matchedSchemes = [];
    const profile = session.collectedProfile;
    const hasEnoughProfile = profile.occupation || profile.category || profile.state;
    if (hasEnoughProfile && (intent === 'FIND_SCHEMES' || intent === 'PROVIDE_PROFILE_INFO')) {
      matchedSchemes = await matchSchemes(profile);
    }

    // Build focused system prompt
    const systemPrompt = buildSystemPrompt(session, matchedSchemes);

    // Add current message to history
    session.history.push({ role: 'user', content: message });

    // Keep only last 12 messages to prevent context overflow
    const recentHistory = session.history.slice(-12);

    // Call Groq
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentHistory
      ],
      max_tokens: 300,
      temperature: 0.75,
      top_p: 0.9,
      frequency_penalty: 0.6,  // penalize repetition
      presence_penalty: 0.4    // encourage new topics
    });

    let rawReply = completion.choices[0].message.content || '';

    // Extract suggestions
    const suggMatch = rawReply.match(/SUGGESTIONS:\s*(\[.*?\])/s);
    let suggestions = ['Tell me more', 'Find schemes', 'Track application'];
    if (suggMatch) {
      try {
        suggestions = JSON.parse(suggMatch[1]);
      } catch {}
      rawReply = rawReply.replace(/SUGGESTIONS:\s*\[.*?\]/s, '').trim();
    }

    // Add Barath reply to history
    session.history.push({ role: 'assistant', content: rawReply });

    // Update session
    updateSession(sessionId, session);

    return res.json({
      reply: rawReply,
      suggestions,
      matchedSchemes: matchedSchemes.slice(0, 2).map(s => ({
        id: s._id,
        name: s.nameEn,
        nameTamil: s.nameTa,
        benefitAmount: s.benefitEn,
        category: s.categoryEn,
        thumbnailColor: s.badgeColor
      }))
    });

  } catch (err) {
    console.error('CHATBOT ERROR:', err.message);
    const fallback = 'மன்னிக்கவும்! Sorry, I ran into an issue. Please try again in a moment.';
    return res.json({ reply: fallback, suggestions: ['Try again', 'Find schemes', 'Track application'] });
  }
});

module.exports = router;
