const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const chatbotController = require('../controllers/chatbotController');

// Rate limiting for chatbot
const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 requests per minute
    message: { reply: "Too many messages. Please wait a minute.", suggestions: [] }
});

router.post('/message', chatLimiter, chatbotController.processMessage);

module.exports = router;
