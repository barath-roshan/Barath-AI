# Indian Government Scheme Portal

A modern, bilingual (English + Tamil) portal for discovering and applying for government schemes.

## Features
- **Dynamic Scheme Discovery**: Search and filter schemes by category and state.
- **Smart Eligibility Check**: Interactive modal to verify criteria before applying.
- **User Authentication**: Secure registration and login with JWT.
- **Persistent Tracking**: Track your applications using unique IDs.
- **Barath AI Chatbot**: A local AI assistant powered by Ollama to help you find schemes and track applications.

## Barath AI Chatbot Setup (Groq)
The Barath chatbot runs on a high-speed Groq LLM for optimized performance and multi-language support.

1. **Groq API Key**: Get a free API key at [console.groq.com](https://console.groq.com) (no credit card needed).
2. **Configure .env**: Add your key to the backend `.env` file:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama3-8b-8192
   ```
3. **Free Tier Info**: Supports up to 14,400 requests/day on the `llama3-8b-8192` model.

## Local Development Setup

### Backend
1. Go to `server/` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gov_portal
   JWT_SECRET=your_secret_key
   OLLAMA_MODEL=llama3
   ```
4. Start server: `npm run dev`.

### Frontend
1. Go to `client/` directory.
2. Install dependencies: `npm install`.
3. Start client: `npm run dev`.

### Auto-concurrent Launch
From the root directory:
```bash
npm run dev
```

## Technologies
- **Frontend**: React, React Router, Axios.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI**: Ollama (Local LLM), llama3.
- **Authentication**: JWT, bcryptjs.
