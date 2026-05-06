const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    applicationNumber: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    schemeName: { type: String, required: true },
    applicantName: { type: String, required: true },
    aadhaar: { type: String, required: true }, // Store as masked in UI, potentially full in DB
    phone: { type: String, required: true },
    address: { type: String },
    state: { type: String },
    income: { type: Number },
    status: { 
        type: String, 
        enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'], 
        default: 'Submitted' 
    },
    submittedAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    remarks: { type: String }
});

module.exports = mongoose.model('Application', ApplicationSchema);
