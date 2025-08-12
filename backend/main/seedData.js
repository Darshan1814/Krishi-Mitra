const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const connectDB = require('./config/database');

const seedUsers = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing users...'.yellow);
    await User.deleteMany();

    // Create dummy users
    const dummyUsers = [
      {
        name: 'Ramesh Sharma',
        email: 'ramesh.farmer@krishibandhu.com',
        password: 'password123',
        role: 'farmer'
      },
      {
        name: 'Suresh Patil',
        email: 'suresh.farmer@krishibandhu.com',
        password: 'password123',
        role: 'farmer'
      },
      {
        name: 'Anjali Devi',
        email: 'anjali.farmer@krishibandhu.com',
        password: 'password123',
        role: 'farmer'
      },
      {
        name: 'Manoj Agrotech',
        email: 'manoj.vendor@krishibandhu.com',
        password: 'password123',
        role: 'vendor'
      },
      {
        name: 'Priya Agricultural Supplies',
        email: 'priya.vendor@krishibandhu.com',
        password: 'password123',
        role: 'vendor'
      }
    ];

    // Create users (password will be hashed by the pre-save middleware)
    for (let userData of dummyUsers) {
      const user = await User.create(userData);
      console.log(`Created user: ${user.name} (${user.role})`.green);
    }

    console.log('\n✅ Dummy data inserted successfully!'.green.bold);
    console.log('\n📋 Test Accounts:'.cyan.bold);
    console.log('🌾 Farmers:'.yellow);
    console.log('  📧 ramesh.farmer@krishibandhu.com | 🔑 password123');
    console.log('  📧 suresh.farmer@krishibandhu.com | 🔑 password123');
    console.log('  📧 anjali.farmer@krishibandhu.com | 🔑 password123');
    console.log('\n🏪 Vendors:'.blue);
    console.log('  📧 manoj.vendor@krishibandhu.com | 🔑 password123');
    console.log('  📧 priya.vendor@krishibandhu.com | 🔑 password123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`.red);
  process.exit(1);
});

seedUsers();
