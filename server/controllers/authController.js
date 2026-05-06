const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, aadhaar, password, dateOfBirth, state, category } = req.body;

    if (!name || !email || !phone || !aadhaar || !password || !dateOfBirth || !state || !category) {
      return res.status(400).json({ message: 'All fields are required / அனைத்து புலங்களும் அவசியம்' });
    }

    if (String(aadhaar).length !== 12) {
      return res.status(400).json({ message: 'Aadhaar must be 12 digits / ஆதார் 12 இலக்கங்கள் இருக்க வேண்டும்' });
    }

    if (String(phone).length !== 10) {
      return res.status(400).json({ message: 'Phone must be 10 digits / தொலைபேசி 10 இலக்கங்கள் இருக்க வேண்டும்' });
    }

    // Date validation
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ message: 'Invalid birth date / தவறான பிறந்த தேதி' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: String(phone).trim(),
      aadhaar: String(aadhaar).trim(),
      password: hashedPassword,
      dateOfBirth: dob,
      state,
      category
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful / பதிவு வெற்றிகரமாக முடிந்தது',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state,
        category: user.category,
        role: user.role
      }
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: field === 'email'
          ? 'Email already registered / மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டது'
          : 'Aadhaar already registered / ஆதார் ஏற்கனவே பதிவு செய்யப்பட்டது'
      });
    }
    res.status(500).json({ message: 'Server error / சர்வர் பிழை. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required / மின்னஞ்சல் மற்றும் கடவுச்சொல் அவசியம்' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password / தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password / தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful / உள்நுழைவு வெற்றிகரமாக முடிந்தது',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state,
        category: user.category,
        role: user.role,
        aadhaar: `XXXX-XXXX-${String(user.aadhaar).slice(-4)}`
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error / சர்வர் பிழை. Please try again.' });
  }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const userObj = user.toObject();
        userObj.aadhaar = `XXXX-XXXX-${String(userObj.aadhaar).slice(-4)}`;
        res.json(userObj);
    } catch (err) {
        res.status(500).json({ message: "Server error / சர்வர் பிழை" });
    }
};
