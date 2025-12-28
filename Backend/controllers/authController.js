const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create a unique Cloudinary folder for the user
    const folderPath = `warrantyvault/${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    try {
      // Create main folder
      await cloudinary.api.create_folder(folderPath);
      // Create subfolders for invoices and warranties
      await cloudinary.api.create_folder(`${folderPath}/invoices`);
      await cloudinary.api.create_folder(`${folderPath}/warranties`);
    } catch (cloudErr) {
      // Ignore folder exists error, but fail for other errors
      if (!cloudErr.message.includes('already exists')) {
        return res.status(500).json({ error: 'Cloudinary folder creation failed' });
      }
    }

    const user = await User.create({ name, email, password, userVaultFolder: folderPath });
    res.status(201).json({ message: 'User registered successfully', vaultFolder: folderPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not registered' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Add user info to response for frontend usage
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
