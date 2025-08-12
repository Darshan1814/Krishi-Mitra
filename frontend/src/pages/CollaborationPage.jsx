import React, { useState, useEffect } from 'react';
import { Users, Plus, ShoppingCart, Package, MapPin, User } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const CollaborationPage = () => {
  const [teams, setTeams] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamOrders, setTeamOrders] = useState([]);
  const [farmerName, setFarmerName] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:5003/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchTeams(),
        fetchProducts(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    const response = await fetch(`${API_BASE}/teams`);
    const data = await response.json();
    setTeams(data);
  };

  const fetchProducts = async () => {
    const response = await fetch(`${API_BASE}/products`);
    const data = await response.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const response = await fetch(`${API_BASE}/categories`);
    const data = await response.json();
    setCategories(data);
  };

  const fetchTeamOrders = async (teamId) => {
    const response = await fetch(`${API_BASE}/teams/${teamId}/orders`);
    const data = await response.json();
    setTeamOrders(data);
  };

  const createTeam = async (teamData) => {
    const response = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    });
    if (response.ok) {
      fetchTeams();
      setShowCreateTeam(false);
    }
  };

  const joinTeam = async (teamId) => {
    if (!farmerName) {
      alert('Please enter your name first');
      return;
    }
    const response = await fetch(`${API_BASE}/teams/${teamId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmer_name: farmerName })
    });
    if (response.ok) {
      fetchTeams();
    }
  };

  const placeOrder = async (teamId, productId, quantity) => {
    if (!farmerName) {
      alert('Please enter your name first');
      return;
    }
    const response = await fetch(`${API_BASE}/teams/${teamId}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity, farmer: farmerName })
    });
    if (response.ok) {
      fetchTeams();
      fetchTeamOrders(teamId);
      alert('Order placed successfully!');
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 text-green-600 mr-3" />
              <TranslatableText>Farmer Collaboration Platform</TranslatableText>
            </h1>
            <p className="text-gray-600 mt-2">
              <TranslatableText>Join teams and make bulk orders to save money</TranslatableText>
            </p>
          </div>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span><TranslatableText>Create Team</TranslatableText></span>
          </button>
        </div>

        {/* Farmer Name Input */}
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Enter your name"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <CreateTeamForm 
          onSubmit={createTeam} 
          onCancel={() => setShowCreateTeam(false)} 
        />
      )}

      {/* Teams Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          <TranslatableText>Available Teams</TranslatableText>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{team.city}, {team.state}</span>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  <TranslatableText>Members</TranslatableText> ({team.members.length}): {team.members.join(', ')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <TranslatableText>Orders</TranslatableText>: {team.orders?.length || 0}
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => joinTeam(team.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  <TranslatableText>Join Team</TranslatableText>
                </button>
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    fetchTeamOrders(team.id);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  <TranslatableText>View Orders</TranslatableText>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Orders Section */}
      {selectedTeam && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              <TranslatableText>Bulk Orders for</TranslatableText> {selectedTeam.name}
            </h2>
            <button
              onClick={() => setSelectedTeam(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all"><TranslatableText>All Categories</TranslatableText></option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Regular</TranslatableText>: ₹{product.price} | <TranslatableText>Bulk</TranslatableText>: ₹{product.bulk_price}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    <TranslatableText>Save</TranslatableText> ₹{product.price - product.bulk_price} <TranslatableText>per unit!</TranslatableText>
                  </p>
                </div>
                <button
                  onClick={() => {
                    const quantity = prompt('Enter quantity:');
                    if (quantity) placeOrder(selectedTeam.id, product.id, parseInt(quantity));
                  }}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span><TranslatableText>Order</TranslatableText></span>
                </button>
              </div>
            ))}
          </div>

          {/* Team Orders List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              <TranslatableText>Team Orders</TranslatableText>
            </h3>
            {teamOrders.length > 0 ? (
              <div className="space-y-2">
                {teamOrders.map(order => {
                  const product = products.find(p => p.id === order.product_id);
                  return (
                    <div key={order.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-gray-900">
                        {product?.name} - <TranslatableText>Qty</TranslatableText>: {order.quantity} - <TranslatableText>By</TranslatableText>: {order.farmer}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500"><TranslatableText>No orders yet</TranslatableText></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CreateTeamForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    creator: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <TranslatableText>Create New Team</TranslatableText>
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Team Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Your Name"
            value={formData.creator}
            onChange={(e) => setFormData({...formData, creator: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              <TranslatableText>Create</TranslatableText>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg"
            >
              <TranslatableText>Cancel</TranslatableText>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaborationPage;