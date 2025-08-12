const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');


const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/krishibandhu')
.then(() => {
  console.log('Auth Backend - MongoDB connected');
  // Create initial data if database is empty
  initializeDatabase();
  initializeProducts();
})
.catch(err => console.log('MongoDB connection error:', err));

// Initialize database with sample data
const initializeDatabase = async () => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('Creating sample users...');
      await User.create([
        {
          name: 'Ramesh Patil',
          email: 'ramesh@example.com',
          password: 'password123',
          role: 'farmer',
          phone: '+91 98765 43210',
          location: 'Nashik, Maharashtra'
        },
        {
          name: 'Sunita Sharma',
          email: 'sunita@example.com', 
          password: 'password123',
          role: 'vendor',
          phone: '+91 87654 32109',
          location: 'Pune, Maharashtra'
        }
      ]);
      console.log('Sample users created successfully');
    }
  } catch (error) {
    console.log('Database initialization error:', error);
  }
};

// Initialize products
const initializeProducts = async () => {
  try {
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('Creating sample products...');
      await Product.create([
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
      ]);
      console.log('Sample products created successfully');
    }
  } catch (error) {
    console.log('Product initialization error:', error);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth Backend Running', port: PORT });
});

app.listen(PORT, () => {
  console.log(`Auth Backend running on port ${PORT}`);
});