const Scheme = require('../models/Scheme');
const Application = require('../models/Application');
const User = require('../models/User');

// --- USER OPERATIONS ---

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users / பயனர்களைப் பெறுவதில் பிழை' });
    }
};

// --- APPLICATION OPERATIONS ---

exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('userId', 'name email phone aadhaar')
            .populate('schemeId', 'nameEn nameTa')
            .sort({ submittedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching applications / விண்ணப்பங்களைப் பெறுவதில் பிழை' });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status, remarks, lastUpdated: Date.now() },
            { new: true }
        );
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Error updating status / நிலையைப் புதுப்பிப்பதில் பிழை' });
    }
};

// --- SCHEME OPERATIONS (CRUD) ---

exports.createScheme = async (req, res) => {
    try {
        const scheme = new Scheme(req.body);
        await scheme.save();
        res.status(201).json(scheme);
    } catch (err) {
        res.status(500).json({ message: 'Error creating scheme / திட்டத்தை உருவாக்குவதில் பிழை' });
    }
};

exports.updateScheme = async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.json(scheme);
    } catch (err) {
        res.status(500).json({ message: 'Error updating scheme / திட்டத்தைப் புதுப்பிப்பதில் பிழை' });
    }
};

exports.deleteScheme = async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndDelete(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.json({ message: 'Scheme deleted successfully / திட்டம் வெற்றிகரமாக நீக்கப்பட்டது' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting scheme / திட்டத்தை நீக்குவதில் பிழை' });
    }
};

// --- ANALYTICS / PROGRESS ---

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const schemeCount = await Scheme.countDocuments();
        const applicationCount = await Application.countDocuments();
        const pendingCount = await Application.countDocuments({ status: 'Submitted' });
        
        const statusBreakdown = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers: userCount,
            totalSchemes: schemeCount,
            totalApplications: applicationCount,
            pendingApplications: pendingCount,
            statusBreakdown
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
