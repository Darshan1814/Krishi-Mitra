const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to the database
(async () => {
  try {
    await connectDB();
    console.log('Database connection established successfully'.green.bold);
  } catch (err) {
    console.error('Failed to connect to database - continuing without DB'.red.bold, err);
    // Don't exit process, continue without database
  }
})();

// Route files
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const chatRoutes = require('./routes/chat');
const mlRoutes = require('./routes/ml');
const productRoutes = require('./routes/products');
const collaborationRoutes = require('./routes/collaboration');
const soilRoutes = require('./routes/soil');



const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS with specific options
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/products', productRoutes);
app.use('/api/fertilizer', require('./routes/fertilizer'));
app.use('/api/expert', require('./routes/expert'));
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/sms', require('./routes/sms'));
app.use('/api/market-alert', require('./routes/marketAlert'));



// Error handler
app.use(errorHandler);

// Static folder
global.__basedir = __dirname;
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
