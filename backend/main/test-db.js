const mongoose = require('mongoose');
require('dotenv').config();

async function testDB() {
  try {
    console.log('Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    
    // Test User model
    const User = require('./models/User');
    console.log('✅ User model loaded successfully');
    
    await mongoose.disconnect();
    console.log('✅ Database disconnected');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDB();