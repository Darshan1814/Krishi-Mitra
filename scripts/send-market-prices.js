const axios = require('axios');
const twilio = require('twilio');

// Twilio configuration
const accountSid = process.env.TWILIO_SID || 'your_twilio_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token';
const client = twilio(accountSid, authToken);

// Get current market prices
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

// Send WhatsApp message with current market prices
const sendMarketPricesWhatsApp = async (phoneNumber) => {
  try {
    console.log('Fetching current market prices...');
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

    // Send WhatsApp message
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886',
      body: messageBody,
      to: `whatsapp:${phoneNumber}`
    });

    console.log(`✅ Market prices sent to ${phoneNumber}`);
    console.log(`📱 Message SID: ${message.sid}`);
    return true;

  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.message);
    return false;
  }
};

// Main function
const main = async () => {
  const phoneNumber = process.argv[2] || '+919405442242'; // Default number or from command line
  
  console.log('🚀 Starting market price notification...');
  console.log(`📞 Sending to: ${phoneNumber}`);
  
  const success = await sendMarketPricesWhatsApp(phoneNumber);
  
  if (success) {
    console.log('✨ Market price notification sent successfully!');
  } else {
    console.log('💥 Failed to send market price notification');
  }
  
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { sendMarketPricesWhatsApp, getMarketPrices };