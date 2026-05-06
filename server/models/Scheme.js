const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
    nameEn: { type: String, required: true },
    nameTa: { type: String, required: true },
    ministryEn: { type: String, required: true },
    ministryTa: { type: String, required: true },
    benefitEn: { type: String, required: true },
    benefitTa: { type: String, required: true },
    benefitDescEn: { type: String, required: true },
    benefitDescTa: { type: String, required: true },
    categoryEn: { type: String, required: true },
    categoryTa: { type: String, required: true },
    badgeChar: { type: String, required: true },
    badgeColor: { type: String, required: true },
    tags: [
        {
            en: String,
            ta: String,
            class: String
        }
    ],
    eligibility: {
        ageMin: { type: Number, default: 0 },
        ageMax: { type: Number, default: 100 },
        gender: { type: String, enum: ['All', 'Male', 'Female', 'Transgender'], default: 'All' },
        occupation: { type: String, default: 'All' },
        incomeMax: { type: Number, default: 10000000 },
        category: { type: [String], default: ['General', 'OBC', 'SC', 'ST', 'EWS'] }
    }
});

module.exports = mongoose.model('Scheme', SchemeSchema);
