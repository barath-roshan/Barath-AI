const sessions = new Map();

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      createdAt: Date.now(),
      lastActive: Date.now(),
      intent: null,          // current detected intent
      stage: 'greeting',     // conversation stage
      collectedProfile: {},  // profile built through conversation
      askedFields: [],       // which fields Barath already asked
      recommendedSchemes: [],// schemes already shown to user
      language: 'en',        // detected language: 'en' | 'ta' | 'mixed'
      history: []            // full message history for this session
    });
  }
  const session = sessions.get(sessionId);
  session.lastActive = Date.now();
  return session;
}

function updateSession(sessionId, updates) {
  const session = getSession(sessionId);
  Object.assign(session, updates);
  sessions.set(sessionId, session);
}

// Clean up sessions older than 2 hours
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActive > 7200000) sessions.delete(id);
  }
}, 300000);

module.exports = {
  getSession,
  updateSession
};
