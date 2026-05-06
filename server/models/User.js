const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    aadhaar: { type: String, required: true, unique: true }, // Masked or full hashed
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    state: { type: String },
    category: { 
        type: String, 
        enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
        default: 'General'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: { type: Date, default: Date.now }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
