const express = require('express');
const router = express.Router();

// Get fertilizer dealers
router.get('/dealers', async (req, res) => {
  try {
    const response = await fetch('https://krushi-backend-1.onrender.com/api/dealers');
    const data = await response.json();
    
    if (response.ok) {
      res.json(data);
    } else {
      res.status(500).json({ error: 'Failed to fetch dealers' });
    }
  } catch (error) {
    res.status(500).json({ error: 'API request failed' });
  }
});



// Get market prices
router.get('/market-prices', async (req, res) => {
  try {
    const response = await fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=100');
    const data = await response.json();
    
    if (response.ok) {
      res.json(data.records || []);
    } else {
      res.status(500).json({ error: 'Failed to fetch market prices' });
    }
  } catch (error) {
    res.status(500).json({ error: 'API request failed' });
  }
});

module.exports = router;