const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get products by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({
      category: { $regex: category, $options: 'i' }
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Initialize sample products
router.post('/init', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const sampleProducts = [
        {
          name: 'Organic Tomatoes',
          price: 45,
          category: 'Vegetables',
          seller: 'Ramesh Patil',
          location: 'Nashik, Maharashtra',
          image: 'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=400',
          quantity: 100,
          unit: 'kg'
        },
        {
          name: 'Fresh Onions',
          price: 25,
          category: 'Vegetables',
          seller: 'Sunita Sharma',
          location: 'Pune, Maharashtra',
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
          quantity: 200,
          unit: 'kg'
        }
      ];
      
      await Product.insertMany(sampleProducts);
      res.json({ success: true, message: 'Sample products created' });
    } else {
      res.json({ success: true, message: 'Products already exist' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;