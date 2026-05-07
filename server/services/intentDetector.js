const intents = {
  TRACK_APPLICATION: {
    patterns: [
      /app[-\s]?\d{4}[-\s]?\d{6}/i,
      /track/i, /status/i, /application number/i,
      /விண்ணப்ப எண்/i, /நிலை/i, /கண்காணி/i
    ],
    priority: 10
  },
  FIND_SCHEMES: {
    patterns: [
      /find.*scheme/i, /which scheme/i, /eligible/i, /qualify/i,
      /suggest.*scheme/i, /what scheme/i, /scheme for me/i,
      /திட்டம்/i, /தகுதி/i, /எனக்கு/i, /என்னுக்கு/i
    ],
    priority: 9
  },
  SCHEME_INFO: {
    patterns: [
      /pm.?kisan/i, /ayushman/i, /pm.?awas/i, /pmegp/i,
      /startup india/i, /mudra/i, /ujjwala/i, /bbbp/i,
      /what is.*scheme/i, /tell me about/i, /explain/i,
      /பற்றி/i, /என்ன/i
    ],
    priority: 8
  },
  PROVIDE_PROFILE_INFO: {
    patterns: [
      /i am a/i, /i'm a/i, /my income/i, /i earn/i,
      /i have.*card/i, /i live in/i, /my age/i, /years old/i,
      /farmer/i, /student/i, /business/i, /நான்/i, /என்/i,
      /விவசாயி/i, /மாணவன்/i, /வருமானம்/i
    ],
    priority: 7
  },
  APPLY_SCHEME: {
    patterns: [
      /apply/i, /how to apply/i, /application/i, /documents/i,
      /விண்ணப்பி/i, /ஆவணங்கள்/i
    ],
    priority: 6
  },
  GREETING: {
    patterns: [
      /^(hi|hello|hey|vanakkam|வணக்கம்|hai|helo|good morning|good evening)$/i
    ],
    priority: 5
  },
  THANKS: {
    patterns: [
      /thank/i, /thanks/i, /nandri/i, /நன்றி/i, /helpful/i
    ],
    priority: 4
  }
};

function detectIntent(message) {
  let detected = { intent: 'GENERAL', confidence: 0 };
  for (const [intent, config] of Object.entries(intents)) {
    for (const pattern of config.patterns) {
      if (pattern.test(message)) {
        if (config.priority > detected.confidence) {
          detected = { intent, confidence: config.priority };
        }
      }
    }
  }
  return detected;
}

module.exports = {
  detectIntent
};
