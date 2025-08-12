import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Camera, 
  Home, 
  Cloud, 
  Users, 
  User, 
  Settings, 
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Leaf,
  Bug,
  Stethoscope,
  Globe,
  DollarSign,
  Gift,
  Zap,
  Award,
  Percent,
  ShoppingBag,
  FileText,
  Package,
  BarChart,
  Heart,
  MessageSquare,
  Mail,
  Info,
  HelpCircle,
  TrendingUp,
  ExternalLink,
  Thermometer
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import PlantixChatbot from './PlantixChatbot';
import LanguageSwitcher from './LanguageSwitcher';
import TranslatableText from './TranslatableText';


const PlantixLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle auth context
  let user = null;
  let logout = null;
  
  try {
    const auth = useAuth();
    user = auth?.user;
    logout = auth?.logout;
  } catch (error) {
    console.warn('Auth context not available:', error.message);
  }

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/login');
    }
  };

  // Plantix navigation items
  const navItems = [
    { name: 'Diagnose', icon: Stethoscope, path: '/', color: 'bg-green-500' },
    { name: 'Camera', icon: Camera, path: '/camera', color: 'bg-blue-500' },
    { name: 'Weather', icon: Cloud, path: '/weather', color: 'bg-sky-500' },
    { name: 'Community', icon: Users, path: '/community', color: 'bg-purple-500' },
    { name: 'Profile', icon: User, path: '/profile', color: 'bg-orange-500' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center animate-pulse-slow">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">KrishiMitra</h1>
                <p className="text-xs text-gray-500"><TranslatableText>AI Farming Assistant</TranslatableText></p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`font-medium ${isActive('/') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}>
                <TranslatableText>Home</TranslatableText>
              </Link>
              <Link to="/dashboard" className={`font-medium ${isActive('/dashboard') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}>
                <TranslatableText>Dashboard</TranslatableText>
              </Link>
              <Link to="/marketplace" className={`font-medium ${isActive('/marketplace') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}>
                <TranslatableText>Marketplace</TranslatableText>
              </Link>
              <Link to="/contact" className={`font-medium ${isActive('/contact') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}>
                <TranslatableText>Contact</TranslatableText>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <TranslatableText>Login</TranslatableText>
                  </Link>
                  <Link 
                    to="/register"
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors hidden md:block"
                  >
                    <TranslatableText>Sign Up</TranslatableText>
                  </Link>
                </div>
              )}
              
              {/* Hamburger Menu Button */}
              <button 
                onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                className="p-2 rounded-full hover:bg-green-100 border border-green-200 flex items-center space-x-1"
                aria-label="Menu"
              >
                {isHamburgerOpen ? (
                  <X className="w-6 h-6 text-green-600" />
                ) : (
                  <>
                    <Menu className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-green-600 hidden sm:inline">Menu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {/* Hamburger Menu */}
      {isHamburgerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsHamburgerOpen(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">KrishiMitra Menu</h2>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                <TranslatableText>MAIN MENU</TranslatableText>
              </h3>
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                <li>
                  <Link to="/" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Home className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Home</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Dashboard</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/camera" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Camera className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Plant Doctor</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/diagnosis" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Stethoscope className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Diagnosis</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/treatment" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Leaf className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Treatment</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/weather" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Cloud className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Weather</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Users className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Community</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <ShoppingBag className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Marketplace</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/fertilizer-store" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Package className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Fertilizer Store</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/cold-storage" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Thermometer className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Cold Storage</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/inventory" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Package className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Inventory</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/invoices" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <FileText className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Invoices</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/financial-reports" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <BarChart className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Financial Reports</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Heart className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Favorites</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <MessageSquare className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Feedback</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <User className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Profile</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Settings className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Settings</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <HelpCircle className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Help</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Mail className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>Contact</TranslatableText>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Info className="w-5 h-5 text-green-600 mr-3" />
                    <TranslatableText>About</TranslatableText>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                <TranslatableText>SPECIAL OFFERS</TranslatableText>
              </h3>
              <ul className="space-y-3">
                <li>
                  <div className="flex items-center p-2 bg-yellow-50 rounded-lg">
                    <Percent className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800"><TranslatableText>20% Off Seeds</TranslatableText></p>
                      <p className="text-xs text-gray-600"><TranslatableText>Use code: SEED20</TranslatableText></p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                    <Gift className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800"><TranslatableText>Free Soil Testing</TranslatableText></p>
                      <p className="text-xs text-gray-600"><TranslatableText>For premium members</TranslatableText></p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 bg-green-50 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800"><TranslatableText>Flash Sale</TranslatableText></p>
                      <p className="text-xs text-gray-600"><TranslatableText>50% off fertilizers today</TranslatableText></p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* No bottom navigation - removed as requested */}


      
      {/* Chatbot */}
      <PlantixChatbot />
    </div>
  );
};

export default PlantixLayout;
