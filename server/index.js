const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const schemeRoutes = require('./routes/schemeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Environment Variable Validation
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnv.forEach(key => {
    if (!process.env[key]) {
        console.error(`FATAL: Missing env variable ${key}`);
        process.exit(1);
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB connected successfully');
        
        // Auto-seed schemes if none exist
        const Scheme = require('./models/Scheme');
        const count = await Scheme.countDocuments();
        if (count === 0) {
            console.log('Seed database: Schemes collection is empty. Seeding...');
            const { seedSchemesLocal } = require('./controllers/schemeController');
            await seedSchemesLocal();
        }
    })
    .catch(err => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Routes
app.use('/api/schemes', schemeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Government Scheme Portal API is running...');
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

