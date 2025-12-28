const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterUserId = req.body.userId;

    if (!requesterUserId || !mongoose.Types.ObjectId.isValid(requesterUserId)) {
      return res.status(400).json({ error: 'Valid User ID is required' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership
    if (product.userId.toString() !== requesterUserId) {
      return res.status(403).json({ error: 'Access denied: Cannot delete another user’s product' });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get product details by ID
exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterUserId = req.query.userId;

    if (!requesterUserId || !mongoose.Types.ObjectId.isValid(requesterUserId)) {
      return res.status(400).json({ error: 'Valid User ID is required' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership
    if (product.userId.toString() !== requesterUserId) {
      return res.status(403).json({ error: 'Access denied: You do not own this product' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  try {
    let invoiceUrl = null;
    let productImageUrl = null;

    // Extract and validate user ID
    const userId = req.body.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const invoiceFolder = `warranty-vault/${userId}/invoices`;
    const productImageFolder = `warranty-vault/${userId}/product-images`;

    if (req.files) {
      if (req.files.invoice) {
        try {
          const result = await cloudinary.uploader.upload(req.files.invoice[0].path, {
            folder: invoiceFolder,
            resource_type: 'auto'
          });
          invoiceUrl = result.secure_url;
          console.log('✅ Invoice uploaded to:', invoiceFolder);
        } catch (err) {
          console.error('❌ Upload failed (invoice):', err.message);
        }
      }

      if (req.files.productImage) {
        try {
          const result = await cloudinary.uploader.upload(req.files.productImage[0].path, {
            folder: productImageFolder,
            resource_type: 'image'
          });
          productImageUrl = result.secure_url;
          console.log('✅ Product image uploaded to:', productImageFolder);
        } catch (err) {
          console.error('❌ Upload failed (image):', err.message);
        }
      }
    }

    const { name, model, serialNumber, purchaseDate, warrantyPeriodMonths, warrantyUrl, email } = req.body;

    const purchaseDateObj = new Date(purchaseDate);
    if (isNaN(purchaseDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid purchase date' });
    }

    const expiryDate = new Date(purchaseDateObj);
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(warrantyPeriodMonths));

    const product = await Product.create({
      name,
      model,
      serialNumber,
      purchaseDate: purchaseDateObj,
      warrantyPeriodMonths: parseInt(warrantyPeriodMonths),
      expiryDate,
      invoiceUrl,
      productImageUrl,
      warrantyUrl,
      userId: new mongoose.Types.ObjectId(userId),
      email: email || null
    });

    console.log('💾 Product saved:', product._id);
    res.status(201).json(product);

  } catch (err) {
    console.error('❌ Add product error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
