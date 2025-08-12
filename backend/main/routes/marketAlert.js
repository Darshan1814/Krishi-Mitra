const express = require('express');
const router = express.Router();
const axios = require('axios');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Get market prices
const getMarketPrices = async () => {
  try {
    const url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=5';
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data && response.data.records) {
      return response.data.records.slice(0, 5);
    }
    return [];
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return [];
  }
};

// Send market prices via WhatsApp
router.post('/send-whatsapp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const prices = await getMarketPrices();
    
    let messageBody;
    if (!prices.length) {
      messageBody = `🌾 KrishiMitra Market Alert

❌ Unable to fetch current market prices.

🔗 Check latest prices: http://localhost:3000/market-prices

📱 Visit KrishiMitra app for real-time updates.`;
    } else {
      messageBody = `🌾 KrishiMitra Market Alert

📊 *Current Market Prices:*

`;
      
      prices.forEach((price, index) => {
        const commodity = price.commodity || 'N/A';
        const market = price.market || 'N/A';
        const modalPrice = price.modal_price || 'N/A';
        const state = price.state || 'N/A';
        
        messageBody += `${index + 1}. *${commodity}*
   💰 Price: ₹${modalPrice}/kg
   📍 Market: ${market}, ${state}

`;
      });
      
      messageBody += `🔗 More prices: http://localhost:3000/market-prices
📱 KrishiMitra - Your Smart Farming Assistant`;
    }

    const message = await client.messages.create({
      from: 'whatsapp:+14155238886',
      body: messageBody,
      to: `whatsapp:${phoneNumber}`
    });

    res.json({
      success: true,
      message: 'Market prices sent successfully',
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

module.exports = router;