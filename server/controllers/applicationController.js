const Application = require('../models/Application');
const User = require('../models/User');

exports.submitApplication = async (req, res) => {
  try {
    const { schemeId, schemeName, address, income } = req.body;

    // The auth middleware attaches decoded token to req.user (which contains userId)
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    const applicationNumber = `APP-${year}-${random}`;

    const application = new Application({
      applicationNumber,
      userId: user._id,
      schemeId,
      schemeName,
      applicantName: user.name,
      aadhaar: String(user.aadhaar).slice(-4), // Masked for safety in list
      phone: user.phone,
      address,
      state: user.state,
      income: Number(income),
      status: 'Submitted',
      submittedAt: new Date(),
      lastUpdated: new Date()
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted / விண்ணப்பம் சமர்ப்பிக்கப்பட்டது',
      applicationNumber,
      application
    });

  } catch (err) {
    console.error('APPLICATION ERROR:', err);
    res.status(500).json({ message: 'Server error / சர்வர் பிழை' });
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
      applicantName: app.applicantName,
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
