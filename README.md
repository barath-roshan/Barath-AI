# Indian Government Scheme Portal 🏛️

A premium, full-stack government scheme discovery and application portal. Built with the MERN stack, featuring a bilingual AI assistant "Barath" and a powerful administrative dashboard.

## 🚀 Key Features

- **Premium UI/UX**: Modern, responsive design with smooth animations and a tricolor Indian theme.
- **Bilingual Support**: Full support for both **English** and **Tamil** languages.
- **Admin Panel**: Comprehensive dashboard for:
    - **Scheme Management**: CRUD operations for government schemes with detailed eligibility rules.
    - **Application Review**: Process, approve, or reject citizen applications with custom remarks.
    - **User Monitoring**: View all registered users and their application progress.
    - **Analytics**: Real-time stats on total users, schemes, and applications.
- **Smart Eligibility Checker**: Enhanced verification system that checks age, gender, and income before allowing applications.
- **Barath AI Chatbot**: Intelligent assistant powered by **Groq (Llama 3)** to help users find schemes and track statuses in their local language.
- **Application Tracking**: Secure tracking using unique IDs (e.g., APP-2025-XXXXXX).

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Vanilla CSS, React Router, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI Engine**: Groq Cloud API (Llama 3-8B).
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).

## ⚙️ Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### 1. Backend Configuration
Navigate to the `server/` directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gov_portal
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
```

### 2. Frontend Configuration
Navigate to the `client/` directory and install dependencies:
```bash
cd client
npm install
```

### 3. Initialize Admin Account
To access the admin panel, run the seeding script:
```bash
cd server
node seedAdmin.js
```
*Default Credentials: Email: `admin@gov.in` | Password: `Admin@123`*

### 4. Run the Application
From the root directory, run both server and client simultaneously:
```bash
npm run dev
```

## 📄 License
This project is for educational and public service purposes.
