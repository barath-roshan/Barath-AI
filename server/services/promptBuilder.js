function buildSystemPrompt(session, matchedSchemes = []) {
  const lang = session.language;
  const profile = session.collectedProfile;
  const intent = session.intent;

  // Base persona — SHORT
  let prompt = `You are Barath, a friendly Indian government scheme assistant.
Reply in ${lang === 'ta' ? 'Tamil' : lang === 'mixed' ? 'Tamil and English mixed' : 'English'}.
Keep replies SHORT — max 3 sentences. Be warm and conversational.
Never repeat yourself. Never say the same thing twice in a conversation.
You are NOT ChatGPT or Claude. You are Barath.

`;

  // Add current profile context
  if (Object.keys(profile).length > 0) {
    prompt += `USER PROFILE SO FAR: ${JSON.stringify(profile)}\n`;
  }

  // Add fields still needed
  const needed = getNeededFields(profile, session.askedFields);
  if (needed.length > 0 && intent === 'FIND_SCHEMES') {
    prompt += `STILL NEED FROM USER (ask ONE at a time, naturally): ${needed.join(', ')}\n`;
  }

  // Add matched schemes if available
  if (matchedSchemes.length > 0) {
    prompt += `\nMATCHED SCHEMES FOR THIS USER:\n`;
    matchedSchemes.forEach((s, i) => {
      const name = lang === 'ta' ? s.nameTa : s.nameEn;
      const benefit = lang === 'ta' ? s.benefitTa : s.benefitEn;
      const desc = lang === 'ta' ? s.benefitDescTa : s.benefitDescEn;
      prompt += `${i+1}. ${name}: ${benefit} — ${desc?.slice(0,80)}\n`;
    });
    prompt += `Present these naturally. Don't list all at once — recommend the top 2 first.\n`;
  }

  // Intent-specific instructions
  const intentInstructions = {
    TRACK_APPLICATION: 'User wants to track an application. If they gave an app number, report its status. If not, ask for it.',
    FIND_SCHEMES: 'User wants scheme recommendations. Ask ONE missing profile question naturally, then recommend when you have enough info.',
    SCHEME_INFO: 'User wants info about a specific scheme. Give benefit amount, eligibility, and how to apply in 3 sentences.',
    APPLY_SCHEME: 'User wants to apply. Tell them to click Apply on the scheme card or guide them to the application form.',
    GREETING: 'Greet warmly and ask how you can help. Mention you can find schemes or track applications.',
    THANKS: 'Respond warmly. Offer to help with anything else.',
    GENERAL: 'Answer helpfully and concisely.'
  };

  prompt += `\nCURRENT TASK: ${intentInstructions[intent] || intentInstructions.GENERAL}\n`;

  // Suggestions instruction — VERY short
  prompt += `\nEnd with exactly: SUGGESTIONS:["3-word option 1","3-word option 2","3-word option 3"]\n`;
  prompt += `Suggestions must be relevant to what user would say NEXT based on this conversation.\n`;

  return prompt;
}

function getNeededFields(profile, askedFields) {
  const allFields = ['occupation', 'annualIncome', 'category', 'state', 'age', 'gender'];
  return allFields.filter(f => !profile[f] && !askedFields.includes(f));
}

module.exports = {
  buildSystemPrompt
};
