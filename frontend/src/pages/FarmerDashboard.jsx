import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Camera, 
  TrendingUp, 
  MessageCircle, 
  CloudSun, 
  Leaf, 
  DollarSign, 
  Package, 
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Plus,
  Eye,
  Truck,
  X,
  AlertCircle
} from 'lucide-react';
import TranslatableText from '../components/TranslatableText';
import AddCropForm from '../components/AddCropForm';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [crops, setCrops] = useState([
    {
      id: 1,
      name: 'Wheat',
      category: 'Cereals',
      quantity: '500',
      price: '2500',
      status: 'Available',
      harvestDate: '2024-04-15',
      location: 'Nashik, Maharashtra',
      description: 'High quality wheat, ready for sale',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 2,
      name: 'Rice',
      category: 'Cereals',
      quantity: '300',
      price: '2800',
      status: 'Available',
      harvestDate: '2024-03-10',
      location: 'Pune, Maharashtra',
      description: 'Organic basmati rice, premium quality',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ]);
  
  const [showAddCropForm, setShowAddCropForm] = useState(false);

  const [recentTransactions] = useState([
    { id: 1, crop: 'Rice', quantity: '50 quintal', amount: '₹1,40,000', date: '2024-03-12', status: 'Completed' },
    { id: 2, crop: 'Wheat', quantity: '30 quintal', amount: '₹75,000', date: '2024-03-08', status: 'Pending' }
  ]);

  const stats = [
    { title: 'Total Income', value: '₹2,15,000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Crops', value: '2', icon: Leaf, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Area', value: '8 acres', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Pending Orders', value: '3', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  const quickActions = [
    { title: 'Plant Doctor', desc: 'Diagnose plant diseases', icon: Camera, link: '/camera', color: 'bg-green-500' },

    { title: 'Weather Info', desc: 'Weather forecast', icon: CloudSun, link: '/weather', color: 'bg-yellow-500' },
    { title: 'AI Assistant', desc: 'Get farming advice', icon: MessageCircle, link: '/community', color: 'bg-purple-500' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleAddCrop = async (cropData) => {
    try {
      // In a real app, you would send this data to your backend
      // For now, we'll just add it to the local state
      const newCrop = {
        id: crops.length + 1,
        ...cropData
      };
      
      setCrops([...crops, newCrop]);
      setShowAddCropForm(false);
      
      return true;
    } catch (error) {
      console.error('Error adding crop:', error);
      throw new Error('Failed to add crop');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName || 'Farmer'}! 🌾</h1>
        <p className="opacity-90">Here's an overview of your farming activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Crops Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <TranslatableText>My Crops</TranslatableText>
            </h2>
            <button 
              onClick={() => setShowAddCropForm(true)}
              className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              <TranslatableText>Add Crop</TranslatableText>
            </button>
          </div>
          <div className="space-y-3">
            {crops.map((crop) => (
              <div key={crop.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg overflow-hidden">
                    {crop.image ? (
                      <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{crop.name}</h3>
                    <p className="text-sm text-gray-600">{crop.quantity} kg • {crop.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{crop.price}/kg</p>
                  <p className="text-sm text-green-600">{crop.status}</p>
                </div>
              </div>
            ))}
            
            {crops.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  <TranslatableText>No crops added yet</TranslatableText>
                </p>
                <button
                  onClick={() => setShowAddCropForm(true)}
                  className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <TranslatableText>Add Your First Crop</TranslatableText>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.crop}</h3>
                    <p className="text-sm text-gray-600">{transaction.quantity} • {transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{transaction.amount}</p>
                  <p className={`text-sm ${transaction.status === 'Completed' ? 'text-green-600' : 'text-orange-600'}`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Profile Information</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            <Edit2 className="w-4 h-4 mr-1" />
            Edit Profile
          </button>
        </div>
        
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user?.fullName}</h3>
            <p className="text-gray-600">Farmer</p>
            <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{user?.phoneNumber || '+91 9876543210'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{user?.address?.city || 'Mumbai'}, {user?.address?.state || 'Maharashtra'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">KYC Status</p>
                <p className="font-medium text-green-600">{user?.kycStatus || 'Verified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Crop Modal */}
      {showAddCropForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <AddCropForm 
              onAddCrop={handleAddCrop} 
              onCancel={() => setShowAddCropForm(false)} 
            />
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">KrishiMitra</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 mr-8">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>
                <p className="text-gray-600">Settings functionality will be implemented here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
