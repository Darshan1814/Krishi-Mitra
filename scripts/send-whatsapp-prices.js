// Simple WhatsApp market price sender
// Usage: node send-whatsapp-prices.js [phone_number]

const { sendMarketPricesWhatsApp } = require('./send-market-prices');

const main = async () => {
  const phoneNumber = process.argv[2] || '+919405442242';
  
  console.log('📱 Sending market prices via WhatsApp...');
  console.log(`📞 To: ${phoneNumber}`);
  
  const success = await sendMarketPricesWhatsApp(phoneNumber);
  
  if (success) {
    console.log('✅ Message sent successfully!');
  } else {
    console.log('❌ Failed to send message');
  }
};

main();