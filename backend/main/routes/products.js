const express = require('express');
const router = express.Router();
const productScraper = require('../services/productScraper');

// Search products across platforms
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const products = await productScraper.searchProducts(query);
    
    res.json({
      query,
      products,
      total: products.length
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

module.exports = router;