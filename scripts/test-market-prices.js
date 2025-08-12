const axios = require('axios');

// Test market prices API
const testMarketPrices = async () => {
  try {
    console.log('🔍 Testing market prices API...');
    
    const url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=5';
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data && response.data.records) {
      const prices = response.data.records.slice(0, 5);
      
      console.log('✅ Market prices fetched successfully!');
      console.log(`📊 Found ${prices.length} price records:`);
      
      prices.forEach((price, index) => {
        console.log(`${index + 1}. ${price.commodity || 'N/A'} - ₹${price.modal_price || 'N/A'}/kg`);
        console.log(`   Market: ${price.market || 'N/A'}, ${price.state || 'N/A'}`);
      });
      
      // Generate WhatsApp message format
      let messageBody = `🌾 KrishiMitra Market Alert

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
      
      console.log('\n📱 WhatsApp Message Preview:');
      console.log('=' .repeat(50));
      console.log(messageBody);
      console.log('=' .repeat(50));
      
    } else {
      console.log('❌ No market data found');
    }
    
  } catch (error) {
    console.error('❌ Error fetching market prices:', error.message);
  }
};

testMarketPrices();