const Product = require('../models/Product');

exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { status, color } = calculateStatus(product.expiryDate);

    res.json({
      ...product._doc,
      status,
      color
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};