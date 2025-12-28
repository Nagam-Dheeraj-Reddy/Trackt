// models/ResetToken.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  email: String,
  token: String,
  expiresAt: {
    type: Date,
    expires: 3600 // Auto-delete after 1 hour
  }
});

module.exports = mongoose.model('ResetToken', tokenSchema);