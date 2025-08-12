import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  TrendingUp, 
  Truck,
  DollarSign, 
  ShoppingBag,
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
  Leaf
} from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Fertilizer A',
      category: 'Fertilizer',
      price: '₹1,200/bag',
      stock: 45,
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Pesticide X',
      category: 'Pesticide',
      price: '₹850/bottle',
      stock: 28,
      status: 'In Stock'
    },
    {
      id: 3,
      name: 'Wheat Seeds',
      category: 'Seeds',
      price: '₹450/kg',
      stock: 5,
      status: 'Low Stock'
    }
  ]);

  const [recentOrders] = useState([
    { id: 1, farmer: 'Ramesh Patil', product: 'Fertilizer A', quantity: '5 bags', amount: '₹6,000', date: '2024-03-15', status: 'Delivered' },
    { id: 2, farmer: 'Suresh Kumar', product: 'Pesticide X', quantity: '3 bottles', amount: '₹2,550', date: '2024-03-14', status: 'Processing' },
    { id: 3, farmer: 'Mahesh Singh', product: 'Wheat Seeds', quantity: '10 kg', amount: '₹4,500', date: '2024-03-12', status: 'Shipped' }
  ]);

  const stats = [
    { title: 'Total Sales', value: '₹1,25,000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Products', value: '24', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Customers', value: '48', icon: User, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Pending Orders', value: '7', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  const quickActions = [
    { title: 'Add Product', desc: 'Add new inventory', icon: Plus, link: '/inventory/add', color: 'bg-green-500' },
    { title: 'Market Trends', desc: 'Check market rates', icon: TrendingUp, link: '/market', color: 'bg-blue-500' },
    { title: 'Process Orders', desc: 'Manage orders', icon: ShoppingBag, link: '/orders', color: 'bg-yellow-500' },
    { title: 'View Reports', desc: 'Sales analytics', icon: BarChart3, link: '/reports', color: 'bg-purple-500' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          <TranslatableText>Welcome back, {user?.fullName || 'Vendor'}! 🏪</TranslatableText>
        </h1>
        <p className="opacity-90">
          <TranslatableText>Here's an overview of your business</TranslatableText>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  <TranslatableText>{stat.title}</TranslatableText>
                </p>
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
        <h2 className="text-lg font-semibold mb-4">
          <TranslatableText>Quick Actions</TranslatableText>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                <TranslatableText>{action.title}</TranslatableText>
              </h3>
              <p className="text-sm text-gray-600">
                <TranslatableText>{action.desc}</TranslatableText>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <TranslatableText>Inventory</TranslatableText>
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              <TranslatableText>Add Product</TranslatableText>
            </button>
          </div>
          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category} • {item.stock} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{item.price}</p>
                  <p className={`text-sm ${item.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <TranslatableText>Recent Orders</TranslatableText>
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <TranslatableText>View All</TranslatableText>
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{order.farmer}</h3>
                    <p className="text-sm text-gray-600">{order.product} • {order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.amount}</p>
                  <p className={`text-sm ${
                    order.status === 'Delivered' 
                      ? 'text-green-600' 
                      : order.status === 'Processing' 
                        ? 'text-blue-600' 
                        : 'text-orange-600'
                  }`}>
                    {order.status}
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
          <h2 className="text-lg font-semibold">
            <TranslatableText>Profile Information</TranslatableText>
          </h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            <Edit2 className="w-4 h-4 mr-1" />
            <TranslatableText>Edit Profile</TranslatableText>
          </button>
        </div>
        
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user?.fullName}</h3>
            <p className="text-gray-600">
              <TranslatableText>Vendor</TranslatableText>
            </p>
            <p className="text-sm text-gray-500">
              <TranslatableText>Member since {new Date().getFullYear()}</TranslatableText>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  <TranslatableText>Email</TranslatableText>
                </p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  <TranslatableText>Phone</TranslatableText>
                </p>
                <p className="font-medium">{user?.phoneNumber || '+91 9876543210'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  <TranslatableText>Location</TranslatableText>
                </p>
                <p className="font-medium">{user?.address?.village || 'Mumbai'}, {user?.address?.state || 'Maharashtra'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  <TranslatableText>KYC Status</TranslatableText>
                </p>
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
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
                <span>
                  <TranslatableText>Logout</TranslatableText>
                </span>
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
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>
                    <TranslatableText>{item.label}</TranslatableText>
                  </span>
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
                <h2 className="text-lg font-semibold mb-4">
                  <TranslatableText>Settings</TranslatableText>
                </h2>
                <p className="text-gray-600">
                  <TranslatableText>Settings functionality will be implemented here.</TranslatableText>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;