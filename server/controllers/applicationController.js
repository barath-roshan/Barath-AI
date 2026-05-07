const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { checkEligibility } = require('../services/eligibilityService');

exports.submitApplication = async (req, res) => {
  try {
    const {
      schemeId, schemeName, schemeCategory, ministry,
      personalDetails, identityDetails, contactDetails,
      financialDetails, occupationDetails, familyDetails,
      schemeSpecificAnswers, declaration
    } = req.body;

    // Validate required top-level fields
    const required = { schemeId, personalDetails, contactDetails, financialDetails };
    const missing = Object.keys(required).filter(k => !required[k]);

    if (missing.length > 0) {
      console.log('MISSING FIELDS:', missing);
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(', ')} / தேவையான புலங்கள் இல்லை`,
        missing
      });
    }

    // Verify user exists
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(401).json({ message: 'Session expired. Please login again.' });

    // Verify scheme exists
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

    // Use scheme info if not provided in body
    const finalSchemeName = schemeName || scheme.nameEn;
    const finalCategory = schemeCategory || scheme.categoryEn;
    const finalMinistry = ministry || scheme.ministryEn;

    // Check duplicate
    const duplicate = await Application.findOne({
      userId: user._id,
      schemeId,
      status: { $nin: ['Rejected', 'Draft'] }
    });
    if (duplicate) {
      return res.status(409).json({
        message: `Already applied. Your application number: ${duplicate.applicationNumber}`,
        applicationNumber: duplicate.applicationNumber
      });
    }

    // Run eligibility check and snapshot it
    const userProfile = {
      age: personalDetails.age,
      gender: personalDetails.gender,
      category: personalDetails.category,
      state: contactDetails.currentAddress?.state,
      annualIncome: financialDetails.annualIncome,
      occupation: occupationDetails?.occupation,
      hasBplCard: identityDetails?.hasBplCard
    };
    const eligResult = checkEligibility(scheme, userProfile);

    // Mask Aadhaar — store only last 4
    const aadhaarLast4 = String(identityDetails.aadhaarNumber || '').slice(-4);

    // Create application
    const application = new Application({
      userId: user._id,
      schemeId: scheme._id,
      schemeName: finalSchemeName,
      schemeCategory: finalCategory,
      ministry: finalMinistry,
      personalDetails,
      identityDetails: {
        ...identityDetails,
        aadhaarNumber: `XXXX-XXXX-${aadhaarLast4}`,
        aadhaarFull: undefined // never store full aadhaar
      },
      contactDetails,
      financialDetails,
      occupationDetails,
      familyDetails,
      schemeSpecificAnswers,
      declaration: {
        ...declaration,
        declarationDate: new Date(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      },
      eligibilitySnapshot: {
        score: eligResult.score,
        passed: eligResult.passed,
        failed: eligResult.reasons,
        checkedAt: new Date()
      },
      statusHistory: [{
        status: 'Submitted',
        changedAt: new Date(),
        remarks: 'Application submitted by citizen'
      }]
    });

    await application.save();

    // Increment scheme application count (if field exists)
    try {
        await Scheme.findByIdAndUpdate(schemeId, { $inc: { applicationCount: 1 } });
    } catch (e) {
        console.warn('Could not increment application count:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully / விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது',
      applicationNumber: application.applicationNumber,
      eligibilityScore: eligResult.score,
      submittedAt: application.submittedAt
    });

  } catch (err) {
    console.error('APPLICATION SUBMIT ERROR:', err);
    if (err.name === 'ValidationError') {
      const fields = Object.keys(err.errors).join(', ');
      return res.status(400).json({
        message: `Validation failed: ${fields} / சரிபார்ப்பு தோல்வி`,
        errors: err.errors
      });
    }
    res.status(500).json({ message: 'Server error. Please try again. / சர்வர் பிழை' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId }).sort({ submittedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('FETCH APPS ERROR:', err);
    res.status(500).json({ message: 'Server error / சர்வர் பிழை' });
  }
};

exports.trackApplication = async (req, res) => {
  try {
    const app = await Application.findOne({
      applicationNumber: req.params.applicationNumber.toUpperCase()
    });

    if (!app) {
      return res.status(404).json({
        message: 'Application not found / விண்ணப்பம் கிடைக்கவில்லை'
      });
    }

    res.json({
      applicationNumber: app.applicationNumber,
      schemeName: app.schemeName,
      status: app.status,
      submittedAt: app.submittedAt,
      lastUpdated: app.lastUpdated,
      remarks: app.remarks || null
    });

  } catch (err) {
    console.error('TRACK ERROR:', err);
    res.status(500).json({ message: 'Server error / சர்வர் பிழை' });
  }
};
