// utils/mailer.js
const nodemailer = require('nodemailer');

const sendPasswordResetEmail = (email, token) => {
  const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link expires in 1 hour.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };