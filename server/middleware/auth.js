const jwt = require('jsonwebtoken');

const auth = function(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    // Check if no token
    if (!token) {
        return res.status(401).json({ 
            message: "No token, authorization denied / டோக்கன் இல்லை, அனுமதி மறுக்கப்பட்டது" 
        });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ 
            message: "Token is not valid / டோக்கன் செல்லுபடியாகாது" 
        });
    }
};

const isAdmin = function(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            message: "Access denied. Admin only / அனுமதி மறுக்கப்பட்டது. நிர்வாகிகள் மட்டும்" 
        });
    }
};

module.exports = { auth, isAdmin };
