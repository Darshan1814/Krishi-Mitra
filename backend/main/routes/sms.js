const express = require('express');
const router = express.Router();
const axios = require('axios');

// Twilio setup
const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID || 'AC37947924c4f59732a614729521eaa699';
const authToken = process.env.TWILIO_AUTH_TOKEN || '9f54f7b2dd934f5e07aa5ad10e373fcc';
const client = twilio(accountSid, authToken);

// Get market prices from government API
const getMarketPrices = async () => {
  try {
    const url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=5';
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data && response.data.records) {
      return response.data.records.slice(0, 3); // Get top 3 prices
    }
    return [];
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return [];
  }
};

// Send SMS with market prices
router.post('/send-market-prices', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const prices = await getMarketPrices();
    
    let messageBody;
    if (!prices.length) {
      messageBody = `🌾 KrishiMitra Market Update

Unable to fetch current prices. Please check our website for latest updates.

🔗 Visit: http://localhost:3000/market-prices`;
    } else {
      messageBody = `🌾 KrishiMitra Market Update

📊 Current Market Prices:

`;
      
      prices.forEach(price => {
        const commodity = price.commodity || 'N/A';
        const market = price.market || 'N/A';
        const modalPrice = price.modal_price || 'N/A';
        
        messageBody += `• ${commodity}: ₹${modalPrice}/kg
  Market: ${market}

`;
      });
      
      messageBody += `🔗 Check more prices: http://localhost:3000/market-prices`;
    }

    // Send SMS
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: phoneNumber
    });

    console.log(`Market price SMS sent to ${phoneNumber}. SID: ${message.sid}`);
    
    res.json({
      success: true,
      message: 'Market prices sent successfully',
      sid: message.sid
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({
      error: 'Failed to send SMS',
      message: error.message
    });
  }
});

// Send WhatsApp message with market prices
router.post('/send-whatsapp-prices', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const prices = await getMarketPrices();
    
    let messageBody;
    if (!prices.length) {
      messageBody = `🌾 KrishiMitra Market Update

Unable to fetch current prices. Please check our website for latest updates.

🔗 Visit: http://localhost:3000/market-prices`;
    } else {
      messageBody = `🌾 KrishiMitra Market Update

📊 Current Market Prices:

`;
      
      prices.forEach(price => {
        const commodity = price.commodity || 'N/A';
        const market = price.market || 'N/A';
        const modalPrice = price.modal_price || 'N/A';
        
        messageBody += `• ${commodity}: ₹${modalPrice}/kg
  Market: ${market}

`;
      });
      
      messageBody += `🔗 Check more prices: http://localhost:3000/market-prices`;
    }

    // Send WhatsApp message
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886',
      body: messageBody,
      to: `whatsapp:${phoneNumber}`
    });

    console.log(`Market price WhatsApp sent to ${phoneNumber}. SID: ${message.sid}`);
    
    res.json({
      success: true,
      message: 'Market prices sent via WhatsApp successfully',
      sid: message.sid
    });

  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    res.status(500).json({
      error: 'Failed to send WhatsApp message',
      message: error.message
    });
  }
});

// Get current market prices (API endpoint)
router.get('/market-prices', async (req, res) => {
  try {
    const prices = await getMarketPrices();
    res.json({
      success: true,
      data: prices,
      count: prices.length
    });
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({
      error: 'Failed to fetch market prices',
      message: error.message
    });
  }
});

module.exports = router;