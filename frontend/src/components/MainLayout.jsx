import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Cloud, 
  ShoppingBag, 
  Newspaper, 
  DollarSign, 
  Thermometer, 
  BookOpen, 
  Leaf, 
  MessageCircle,
  CreditCard,
  Menu,
  X,
  Sun,
  Droplets,
  Wind,
  ChevronRight,
  LogIn,
  LogOut,
  UserPlus,
  Package,
  Users,
  Beaker
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TranslatableText from './TranslatableText';
import PlantixChatbot from './PlantixChatbot';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Navigation items
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Cloud, label: 'Weather', path: '/weather' },
    { icon: ShoppingBag, label: 'E-commerce', path: '/ecommerce' },
    { icon: Package, label: 'Fertilizer Store', path: '/fertilizer-store' },
    { icon: CreditCard, label: 'Loans', path: '/loans' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: Thermometer, label: 'Cold Storages', path: '/cold-storage' },
    { icon: BookOpen, label: 'Learning Hub', path: '/learn' },
    { icon: Leaf, label: 'Plant Disease', path: '/camera' },
    { icon: MessageCircle, label: 'Expert Consultation', path: '/expert' },
    { icon: Package, label: 'Fertilizer Dealers', path: '/fertilizer-dealers' },
    { icon: ShoppingBag, label: 'Market Prices', path: '/market-prices' },
    { icon: Users, label: 'Collaboration', path: '/collaboration' },
    { icon: Beaker, label: 'Soil Detection', path: '/soil-detection' }
  ];

  // Quick access icons for top panel
  const quickAccessIcons = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Cloud, label: 'Weather', path: '/weather' },
    { icon: ShoppingBag, label: 'E-commerce', path: '/ecommerce' },
    { icon: Package, label: 'Fertilizer Store', path: '/fertilizer-store' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: DollarSign, label: 'Loans', path: '/loans' },
    { icon: Thermometer, label: 'Cold Storage', path: '/cold-storage' },
    { icon: BookOpen, label: 'Learning', path: '/learn' },
    { icon: Leaf, label: 'Diseases', path: '/camera' },
    { icon: MessageCircle, label: 'Expert', path: '/expert' },
    { icon: Package, label: 'Dealers', path: '/fertilizer-dealers' },
    { icon: ShoppingBag, label: 'Prices', path: '/market-prices' },
    { icon: Users, label: 'Collaborate', path: '/collaboration' },
    { icon: Beaker, label: 'Soil', path: '/soil-detection' }
  ];

  // Sample weather data (would be fetched from API)
  useEffect(() => {
    // Simulate API call to weather service
    setTimeout(() => {
      setWeather({
        date: 'Thursday, Jul 24',
        temperature: '27.6°C',
        humidity: '74.4%',
        windSpeed: '2.6 m/s',
        status: 'Rain'
      });
      setLoading(false);
    }, 1000);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:w-64 overflow-y-auto`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-xl font-bold">KrishiMitra</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-green-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-4 px-2 flex-1 overflow-y-auto">
          <ul className="space-y-1 pb-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span><TranslatableText>{item.label}</TranslatableText></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {user ? `Hello, ${user.fullName || 'Farmer'} 👋` : 'Welcome to KrishiMitra'}
                </h2>
                <p className="text-sm text-gray-500">
                  <TranslatableText>Your smart farming assistant</TranslatableText>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">
                    Welcome, {user.name || user.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Icons */}
          <div className="px-4 py-3 border-t border-gray-200 overflow-x-auto">
            <div className="flex space-x-6 min-w-max">
              {quickAccessIcons.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex flex-col items-center"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive(item.path) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                  } transition-colors`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="mt-1 text-xs text-gray-600">
                    <TranslatableText>{item.label}</TranslatableText>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Weather Widget */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <TranslatableText>Weather</TranslatableText>
              </h3>
              
              {loading ? (
                <div className="animate-pulse flex flex-col space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ) : weather ? (
                <div>
                  <p className="text-sm text-gray-500 mb-2">{weather.date}</p>
                  <div className="flex items-center mb-4">
                    <Cloud className="w-10 h-10 text-blue-500 mr-3" />
                    <span className="text-2xl font-bold text-gray-800">{weather.temperature}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <TranslatableText>Humidity:</TranslatableText> {weather.humidity}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <TranslatableText>Wind:</TranslatableText> {weather.windSpeed}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <TranslatableText>Status:</TranslatableText> {weather.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  <TranslatableText>Weather data unavailable</TranslatableText>
                </p>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/weather" className="text-green-600 hover:text-green-700 text-sm flex items-center">
                  <TranslatableText>View detailed forecast</TranslatableText>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Chatbot */}
      <PlantixChatbot />
    </div>
  );
};

export default MainLayout;