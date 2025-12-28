// Delete product by ID
const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const dashboardController = require('../controllers/dashboardController');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Must exist!
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage }).fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'invoice', maxCount: 1 }
]);


// API routes
router.post('/add', upload, productController.addProduct); // Add Product
router.get('/stats', dashboardController.getDashboardStats);
router.get('/list', dashboardController.getProductList);
router.delete('/:id', productController.deleteProduct); // Delete Product
router.get('/product/:id', productController.getProductDetails); // Get Product JSON




// Explicit 404 for unmatched API routes (prevents HTML on DELETE)
router.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/products')) {
    return res.status(404).json({ error: 'Not found' });
  }
  next();
});

module.exports = router;