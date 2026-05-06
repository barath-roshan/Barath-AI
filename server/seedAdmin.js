const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for admin seeding...');

        const adminEmail = 'admin@gov.in';
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists. No seeding needed.');
            process.exit(0);
        }

        // Create new admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        const adminUser = new User({
            name: 'System Administrator',
            email: adminEmail,
            phone: '9876543210',
            aadhaar: '123456789012',
            password: hashedPassword,
            dateOfBirth: new Date('1990-01-01'),
            state: 'Delhi',
            category: 'General',
            role: 'admin'
        });

        await adminUser.save();
        console.log('-----------------------------------------------');
        console.log('ADMIN ACCOUNT CREATED SUCCESSFULLY');
        console.log(`Email: ${adminEmail}`);
        console.log('Password: Admin@123');
        console.log('-----------------------------------------------');
        
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
