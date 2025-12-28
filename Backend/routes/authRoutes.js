// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // You’ll need a User model later
const ResetToken = require('../models/ResetToken');
const { sendPasswordResetEmail } = require('../utils/mailer');
const authController = require('../controllers/authController');
router.post('/register', authController.register);         // 👈 Register route
router.post('/login', authController.login);               // 👈 Login route
// POST: Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('📧 Step 1: Email received:', email);

    const user = await User.findOne({ email });
    if (!user) {
      // Simulate success (security best practice)
      return res.json({ message: 'If your email is registered, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    console.log('🔑 Step 2: Token generated:', token);

    await ResetToken.create({
      email,
      token,
      expiresAt: new Date(Date.now() + 3600000)
    });
    console.log('💾 Step 3: Token saved in DB');

    // 🔥 This is where it used to fail if email sending broke
    console.log('📨 Step 4: Attempting to send email...');
    let emailSent = true;
    let emailError = null;
    try {
      await sendPasswordResetEmail(email, token);
      console.log('✅ Email sent successfully!');
    } catch (mailErr) {
      emailSent = false;
      emailError = mailErr && mailErr.message ? mailErr.message : 'Failed to send email';
      console.error('❌ Email send failed:', mailErr);
    }

    // Always respond 200 so the frontend doesn't get a 500 error,
    // but include whether the email was actually sent.
    return res.json({
      message: 'If your email is registered, a reset link has been generated.',
      emailSent,
      emailError
    });

  } catch (err) {
    console.error('❌ FULL ERROR:', err); // 👈 This shows everything
    console.error('❌ ERROR MESSAGE:', err.message);
    console.error('❌ ERROR CODE:', err.code); // e.g., 'EAUTH', 'ECONNREFUSED'
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const tokenRecord = await ResetToken.findOne({ token });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Find the user associated with this reset token
    const user = await User.findOne({ email: tokenRecord.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found for this token' });
    }

    // Update password; pre('save') hook on User will hash it
    user.password = password;
    await user.save();

    // Invalidate this token so it can't be reused
    await ResetToken.findOneAndDelete({ token });

    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: Get user profile
router.get('/profile', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email }, 'name email mobileNumber address profileCompleted');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Update profile
router.post('/update-profile', async (req, res) => {
  const { email, name, mobileNumber, address } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim();
    }

    user.mobileNumber = mobileNumber;
    user.address = address;
    user.profileCompleted = true;

    await user.save();

    res.json({ message: 'Profile updated successfully', profileCompleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

