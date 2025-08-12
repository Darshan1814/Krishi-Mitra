const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Simple file-based storage
const DATA_FILE = path.join(__dirname, 'collaboration-data.json');

const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data:', error);
    }
  }
  return { teams: [], products: [] };
};

const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Routes
app.get('/api/teams', (req, res) => {
  const data = loadData();
  res.json(data.teams);
});

app.post('/api/teams', (req, res) => {
  const data = loadData();
  const teamData = req.body;
  const teamId = data.teams.length + 1;
  const team = {
    id: teamId,
    name: teamData.name,
    city: teamData.city,
    state: teamData.state,
    members: [teamData.creator],
    orders: []
  };
  data.teams.push(team);
  saveData(data);
  res.status(201).json(team);
});

app.post('/api/teams/:teamId/join', (req, res) => {
  const data = loadData();
  const teamId = parseInt(req.params.teamId);
  const { farmer_name } = req.body;
  
  const team = data.teams.find(t => t.id === teamId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  if (!team.members.includes(farmer_name)) {
    team.members.push(farmer_name);
    saveData(data);
  }
  
  res.json(team);
});

app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Organic Pesticide', price: 120, bulk_price: 95, category: 'Pesticides' },
    { id: 2, name: 'Chemical Pesticide', price: 80, bulk_price: 65, category: 'Pesticides' },
    { id: 3, name: 'NPK Fertilizer', price: 150, bulk_price: 120, category: 'Fertilizers' },
    { id: 4, name: 'Organic Compost', price: 100, bulk_price: 80, category: 'Fertilizers' },
    { id: 5, name: 'Wheat Seeds', price: 60, bulk_price: 48, category: 'Seeds' },
    { id: 6, name: 'Rice Seeds', price: 70, bulk_price: 56, category: 'Seeds' },
    { id: 7, name: 'Corn Seeds', price: 55, bulk_price: 44, category: 'Seeds' },
    { id: 8, name: 'Irrigation Pipes', price: 200, bulk_price: 160, category: 'Equipment' },
    { id: 9, name: 'Sprinkler System', price: 300, bulk_price: 240, category: 'Equipment' },
    { id: 10, name: 'Farm Tools Set', price: 180, bulk_price: 144, category: 'Tools' },
    { id: 11, name: 'Soil Testing Kit', price: 90, bulk_price: 72, category: 'Testing' },
    { id: 12, name: 'Weather Monitor', price: 250, bulk_price: 200, category: 'Technology' }
  ];
  res.json(products);
});

app.post('/api/teams/:teamId/order', (req, res) => {
  const data = loadData();
  const teamId = parseInt(req.params.teamId);
  const orderData = req.body;
  
  const team = data.teams.find(t => t.id === teamId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  const order = {
    id: team.orders.length + 1,
    product_id: orderData.product_id,
    quantity: orderData.quantity,
    farmer: orderData.farmer,
    status: 'pending'
  };
  
  team.orders.push(order);
  saveData(data);
  res.status(201).json(order);
});

app.get('/api/categories', (req, res) => {
  const categories = ['Pesticides', 'Fertilizers', 'Seeds', 'Equipment', 'Tools', 'Testing', 'Technology'];
  res.json(categories);
});

app.get('/api/teams/:teamId/orders', (req, res) => {
  const data = loadData();
  const teamId = parseInt(req.params.teamId);
  
  const team = data.teams.find(t => t.id === teamId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  res.json(team.orders);
});

app.listen(PORT, () => {
  console.log(`Collaboration server running on port ${PORT}`);
});