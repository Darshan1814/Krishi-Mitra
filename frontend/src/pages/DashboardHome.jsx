import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  ShoppingBag, 
  BookOpen, 
  TrendingUp, 
  Users, 
  FileText, 
  ArrowRight,
  Camera,
  MessageCircle,
  Thermometer
} from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const DashboardHome = () => {
  // Key features cards
  const keyFeatures = [
    {
      icon: Leaf,
      title: 'Crop Advisor',
      description: 'Get personalized crop recommendations based on soil and weather',
      color: 'from-green-500 to-green-600',
      path: '/crop-advisor'
    },
    {
      icon: ShoppingBag,
      title: 'E-commerce',
      description: 'Buy and sell crops, seeds, and equipment in our marketplace',
      color: 'from-blue-500 to-blue-600',
      path: '/marketplace'
    },
    {
      icon: BookOpen,
      title: 'Learning Hub',
      description: 'Access tutorials and modern farming techniques',
      color: 'from-purple-500 to-purple-600',
      path: '/learning'
    }
  ];

  // Quick stats
  const stats = [
    { label: 'Active Farmers', value: '10,000+', color: 'text-green-600' },
    { label: 'Crops Listed', value: '5,000+', color: 'text-blue-600' },
    { label: 'Transactions', value: '₹2Cr+', color: 'text-purple-600' },
    { label: 'Success Rate', value: '95%', color: 'text-orange-600' }
  ];

  // Recent activities
  const recentActivities = [
    { icon: Camera, text: 'Disease detected in tomato crop', time: '2 hours ago' },
    { icon: MessageCircle, text: 'Expert consultation booked', time: '1 day ago' },
    { icon: FileText, text: 'New farming guide available', time: '2 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          <TranslatableText>Welcome to KrishiMitra Dashboard</TranslatableText>
        </h1>
        <p className="text-green-100">
          <TranslatableText>Your one-stop solution for smart farming and agricultural success</TranslatableText>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600">
              <TranslatableText>{stat.label}</TranslatableText>
            </div>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          <TranslatableText>Key Features</TranslatableText>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {keyFeatures.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                <TranslatableText>{feature.title}</TranslatableText>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                <TranslatableText>{feature.description}</TranslatableText>
              </p>
              <div className="flex items-center text-green-600 group-hover:text-green-700">
                <span className="text-sm font-medium">
                  <TranslatableText>Explore</TranslatableText>
                </span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <TranslatableText>Recent Activities</TranslatableText>
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <activity.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <TranslatableText>Quick Actions</TranslatableText>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/camera"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                <TranslatableText>Scan Plant</TranslatableText>
              </span>
            </Link>
            <Link
              to="/marketplace"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                <TranslatableText>Marketplace</TranslatableText>
              </span>
            </Link>
            <Link
              to="/weather"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                <TranslatableText>Weather</TranslatableText>
              </span>
            </Link>
            <Link
              to="/cold-storage"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Thermometer className="w-8 h-8 text-cyan-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                <TranslatableText>Cold Storage</TranslatableText>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <TranslatableText>Today's Farming Tips</TranslatableText>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              <TranslatableText>Weather Alert</TranslatableText>
            </h4>
            <p className="text-sm text-green-700">
              <TranslatableText>Rain expected in the next 24 hours. Consider covering sensitive crops.</TranslatableText>
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              <TranslatableText>Market Insight</TranslatableText>
            </h4>
            <p className="text-sm text-blue-700">
              <TranslatableText>Tomato prices are rising. Good time to sell your harvest.</TranslatableText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;