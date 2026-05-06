const Groq = require('groq-sdk');
const Application = require('../models/Application');
const User = require('../models/User');
const Scheme = require('../models/Scheme');

// Initialize Groq only if key is provided and not placeholder
const isApiKeySet = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_actual_key');
let groq = null;
if (isApiKeySet) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}
const MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

// Fallback logic for basic responses if Groq fails or is not configured
const getLocalResponse = (message, userName, schemes) => {
    const msg = message.toLowerCase();
    let reply = "";
    let suggestions = [];

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("வணக்கம்")) {
        reply = `வணக்கம்${userName ? ' ' + userName : ''}! I'm Barath. I can help you find government schemes or track your application. How can I assist you today?`;
        suggestions = ["Find schemes", "Track application", "Help"];
    } else if (msg.includes("track") || msg.includes("application") || msg.includes("app-")) {
        reply = "நிச்சயமாக! To track your application, please provide your application number (APP-YYYY-XXXXXX). I'll check its status for you.";
        suggestions = ["APP-2025-123456", "I lost my ID"];
    } else if (msg.includes("scheme") || msg.includes("list") || msg.includes("category")) {
        const schemeNames = schemes.slice(0, 3).map(s => s.nameEn).join(", ");
        reply = `We have various schemes like Agriculture and Health. Some popular ones: ${schemeNames}. எந்தத் திட்டம் பற்றி அறிய விரும்புகிறீர்கள்? (Which scheme would you like to know about?)`;
        suggestions = ["Agriculture schemes", "Health schemes", "Education schemes"];
    } else {
        reply = "மன்னிக்கவும், என்னால் இதைப் புரிந்துகொள்ள முடியவில்லை. I'm still learning. Could you please ask about a scheme or track an application?";
        suggestions = ["Search schemes", "Eligibility checker", "Contact support"];
    }


    return { reply, suggestions };
};

exports.processMessage = async (req, res) => {
    try {
        const { message, userId, conversationHistory } = req.body;
        
        // 1. Fetch data for context
        let contextAddition = "";
        let userName = "";
        const allSchemes = await Scheme.find().limit(10);
        
        if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findById(userId);
            if (user) {
                userName = user.name;
                contextAddition += ` The user's name is ${user.name}. Address them by name occasionally. User category: ${user.category}. User state: ${user.state || 'Tamil Nadu'}.`;
            }
        }

        // 2. Application Tracking
        const appNumMatch = message.match(/APP-\d{4}-\d{6}/i);
        if (appNumMatch) {
            const appNum = appNumMatch[0].toUpperCase();
            const app = await Application.findOne({ applicationNumber: appNum });
            if (app) {
                contextAddition += ` CRITICAL DATA - Application ${appNum} status: ${app.status}, Scheme: ${app.schemeName}, Submitted: ${app.submittedAt.toDateString()}, Remarks: ${app.remarks || 'None'}.`;
            } else {
                contextAddition += ` INFO: Application ${appNum} not found.`;
            }
        }

        // 3. Inject Actual Schemes from Database
        if (allSchemes.length > 0) {
            const schemeContext = allSchemes.map(s => `${s.nameEn} (${s.benefitEn})`).join(", ");
            contextAddition += ` Current live schemes in portal: ${schemeContext}.`;
        }

        // 4. Case: Groq not configured
        if (!groq) {
            console.warn("GROQ_API_KEY not set or placeholder. Using local fallback.");
            const local = getLocalResponse(message, userName, allSchemes);
            return res.json(local);
        }

        // 5. System Prompt
        const systemPrompt = `You are Barath, a premium AI Assistant for the Indian Government Scheme Portal. 
${contextAddition}
Personality: professional, warm, bilingual (English/Tamil).
Goal: Help citizens find schemes, explain eligibility, and track applications.
Language: Respond in the user's language (English/Tamil/Hinglish).
Constraints: Max 3 paragraphs. Be concise.

At the very end of your response, you MUST MUST MUST add suggestions in this EXACT format:
SUGGESTIONS:["suggestion 1", "suggestion 2", "suggestion 3"]
Keep suggestions under 5 words each.`;

        // 6. Map History
        const messages = [
            { role: "system", content: systemPrompt },
            ...(conversationHistory || []).slice(-8).map(msg => ({
                role: msg.role === 'barath' ? 'assistant' : 'user',
                content: msg.text || ""
            })),
            { role: "user", content: message }
        ];

        // 7. Call Groq
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: messages,
            max_tokens: 500,
            temperature: 0.6,
        });

        const fullContent = completion.choices[0].message.content;

        // 8. Robust parsing of suggestions
        let reply = fullContent;
        let suggestions = [];
        
        // Match SUGGESTIONS:[...] anywhere in the last 100 chars or at end
        const suggMatch = fullContent.match(/SUGGESTIONS:\s*(\[.*?\])\s*$/s);
        if (suggMatch) {
            try {
                suggestions = JSON.parse(suggMatch[1]);
                reply = fullContent.replace(/SUGGESTIONS:\s*\[.*?\]\s*$/s, '').trim();
            } catch (e) {
                console.error("Failed to parse suggestions JSON", e);
            }
        } else {
            // Fallback suggestions if AI forgets
            suggestions = ["Tell me more", "Track application", "Schemes for farmers"];
        }

        res.json({ reply, suggestions });

    } catch (err) {
        console.error("Chatbot Controller Error:", err);
        // Fallback response instead of erroring out
        res.json({ 
            reply: "I'm having a brief connection issue. However, I can still help with general info: are you looking for Agriculture, Health or Education schemes?", 
            suggestions: ["Agriculture", "Health", "Education"] 
        });
    }
};

