const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();

const productRoutes = require('./routes/productRoutes');

const authRoutes = require('./routes/authRoutes');


// Models
const Product = require('./models/Product');
const User = require('./models/User');

const cron = require('node-cron');
const nodemailer = require('nodemailer');



// Redirect root to login page
// Redirect root to login page
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve dashboard

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});
// Routes

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/dashboard', (req, res) => {
  const isLoggedIn = req.headers['x-auth'] === 'true' || /* simulate */ true;
  // For now, rely on frontend flag
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log('❌ DB Error:', err));

// =======================
// Warranty Reminder Job
// =======================

// Setup transporter (reuse your Gmail / Nodemailer config)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Run every day at 4 PM
cron.schedule("0 16 * * *", async () => {
  console.log("🔔 Running warranty reminder job...");

  const today = new Date();
  const next15Days = new Date();
  next15Days.setDate(today.getDate() + 15);

  try {
    // Find products expiring within the next 15 days
    const expiringProducts = await Product.find({
      expiryDate: { $gte: today, $lte: next15Days }
    });

    console.log(`Found ${expiringProducts.length} expiring products.`);
    for (const product of expiringProducts) {
      console.log(`Checking product: ${product.name}, expiry: ${product.expiryDate}`);
      const user = await User.findById(product.userId);
      if (!user || !user.email) {
        console.log(`No user or email for product: ${product.name}`);
        continue;
      }

      // Send email reminder
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Warranty Expiry Reminder: ${product.name}`,
        text: `Hello ${user.name},\n\nYour product "${product.name}" (Model: ${product.model}) is expiring on ${product.expiryDate.toDateString()}.\n\nPlease take necessary action before the warranty expires.`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Reminder sent to ${user.email} for product ${product.name}`);
      } catch (mailErr) {
        console.error(`❌ Failed to send mail to ${user.email}:`, mailErr);
      }
    }
  } catch (err) {
    console.error("❌ Error in reminder job:", err);
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});