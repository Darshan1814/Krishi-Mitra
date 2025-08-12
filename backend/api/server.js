const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');
const newsRoutes = require('./routes/news');
const coldStorageRoutes = require('./routes/coldStorage');
const marketRoutes = require('./routes/market');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/cold-storage', coldStorageRoutes);
app.use('/api/market', marketRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Backend Running', port: PORT });
});

app.listen(PORT, () => {
  console.log(`API Backend running on port ${PORT}`);
});