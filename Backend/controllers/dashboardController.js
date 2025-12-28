const Product = require('../models/Product');
const calculateStatus = require('../utils/calculateStatus');

exports.getDashboardStats = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // ✅ Only fetch products for this user
    const products = await Product.find({ userId });
    const total = products.length;
    const active = products.filter(p => calculateStatus(p.expiryDate).status === 'Active').length;
    const expiringSoon = products.filter(p => calculateStatus(p.expiryDate).status === 'Expiring Soon').length;
    const expired = products.filter(p => calculateStatus(p.expiryDate).status === 'Expired').length;

    res.json({ total, active, expiringSoon, expired });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductList = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // ✅ Only fetch products for this user
    const products = await Product.find({ userId }).select('name purchaseDate expiryDate invoiceUrl productImageUrl warrantyUrl');
    const productsWithStatus = products.map(p => {
      const { status, color } = calculateStatus(p.expiryDate);
      return {
        id: p._id,
        name: p.name,
        purchaseDate: p.purchaseDate.toISOString().split('T')[0],
        expiryDate: p.expiryDate.toISOString().split('T')[0],
        status,
        color,
        warrantyUrl: p.warrantyUrl
      };
    });
    res.json(productsWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};