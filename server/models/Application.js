const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    unique: true,
    default: () => `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  schemeName: { type: String, required: true },
  schemeCategory: { type: String },
  ministry: { type: String },

  personalDetails: {
    fullName: { type: String, required: true },
    fullNameTamil: { type: String },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male','Female','Transgender'], required: true },
    maritalStatus: { type: String, enum: ['Single','Married','Widowed','Divorced'] }, // Optional
    religion: { type: String },
    category: { type: String, enum: ['General','OBC','SC','ST','EWS'], required: true },
    nationality: { type: String, default: 'Indian' },
    disability: { type: Boolean, default: false },
    disabilityType: { type: String },
    disabilityPercentage: { type: Number }
  },

  identityDetails: {
    aadhaarNumber: { type: String, required: true },
    aadhaarFull: { type: String },
    panNumber: { type: String },
    voterId: { type: String },
    rationCardNumber: { type: String },
    rationCardType: { type: String, default: 'None' },
    hasBplCard: { type: Boolean, default: false }
  },

  contactDetails: {
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    email: { type: String },
    currentAddress: {
      street: { type: String, required: true },
      village: { type: String },
      taluk: { type: String },
      district: { type: String, required: true },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: { type: String, required: true }
    }
  },

  financialDetails: {
    annualIncome: { type: Number, required: true },
    incomeSource: { type: String },
    bankName: { type: String, required: true },
    bankAccountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankBranch: { type: String },
    isJanDhanAccount: { type: Boolean, default: false }
  },

  occupationDetails: {
    occupation: { type: String, default: 'General' },
    employerName: { type: String },
    educationLevel: { type: String }
  },

  familyDetails: {
    fatherName: { type: String },
    motherName: { type: String },
    numberOfChildren: { type: Number, default: 0 }
  },

  schemeSpecificAnswers: { type: Map, of: String },

  declaration: {
    agreedToTerms: { type: Boolean, required: true },
    declarationDate: { type: Date, default: Date.now }
  },

  eligibilitySnapshot: {
    score: { type: Number },
    passed: [String],
    failed: [String],
    checkedAt: { type: Date, default: Date.now }
  },

  status: {
    type: String,
    enum: ['Draft','Submitted','Under Review','Approved','Rejected'],
    default: 'Submitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
