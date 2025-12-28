const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: String,
  model: String,
  serialNumber: String,
  purchaseDate: Date,
  warrantyPeriodMonths: Number,
  expiryDate: Date,
  invoiceUrl: String,           // Cloudinary URL
  productImageUrl: String,      // Cloudinary URL
  warrantyUrl: String,          // e.g., https://brand.com/warranty
  userId: {                     // for later multi-user
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});



module.exports = mongoose.model('Product', productSchema);