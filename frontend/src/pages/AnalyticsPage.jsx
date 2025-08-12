import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Calendar, Filter, Download, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Leaf, Package } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

// Mock data for charts
const salesData = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 19000 },
  { month: 'Mar', sales: 15000 },
  { month: 'Apr', sales: 22000 },
  { month: 'May', sales: 28000 },
  { month: 'Jun', sales: 32000 },
  { month: 'Jul', sales: 38000 },
  { month: 'Aug', sales: 42000 },
  { month: 'Sep', sales: 35000 },
  { month: 'Oct', sales: 29000 },
  { month: 'Nov', sales: 33000 },
  { month: 'Dec', sales: 40000 }
];

const cropData = [
  { name: 'Wheat', percentage: 35 },
  { name: 'Rice', percentage: 25 },
  { name: 'Tomatoes', percentage: 15 },
  { name: 'Potatoes', percentage: 10 },
  { name: 'Others', percentage: 15 }
];

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [expandedSection, setExpandedSection] = useState('sales');

  const stats = [
    { label: 'Total Revenue', value: '₹2,45,680', change: '+12%', icon: DollarSign, color: 'green' },
    { label: 'Orders', value: '1,245', change: '+8%', icon: ShoppingBag, color: 'blue' },
    { label: 'Active Users', value: '3,456', change: '+15%', icon: Users, color: 'purple' },
    { label: 'Growth Rate', value: '23%', change: '+5%', icon: TrendingUp, color: 'orange' }
  ];

  const recentActivities = [
    { id: 1, text: 'New order received from Vendor ABC', time: '2 hours ago', type: 'order' },
    { id: 2, text: 'Payment of ₹15,000 processed successfully', time: '5 hours ago', type: 'payment' },
    { id: 3, text: 'Crop listing updated: Organic Tomatoes', time: '1 day ago', type: 'listing' },
    { id: 4, text: 'New user registration: Farmer XYZ', time: '2 days ago', type: 'user' },
    { id: 5, text: 'Weather alert: Rain expected in your area', time: '3 days ago', type: 'weather' }
  ];

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'listing':
        return <Leaf className="w-5 h-5 text-green-600" />;
      case 'user':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  // Find the maximum sales value for scaling the chart
  const maxSales = Math.max(...salesData.map(item => item.sales));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <TranslatableText>Analytics & Reports</TranslatableText>
            </h1>
            <p className="text-gray-600">
              <TranslatableText>Monitor your performance with detailed insights and data visualization</TranslatableText>
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="relative">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{dateRange}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {/* Dropdown would go here in a real implementation */}
            </div>
            
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center space-x-2">
              <Download className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                <TranslatableText>Export</TranslatableText>
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">
                <TranslatableText>{stat.label}</TranslatableText>
              </p>
            </div>
          ))}
        </div>

        {/* Sales Analytics Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div 
            className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('sales')}
          >
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                <TranslatableText>Sales Analytics</TranslatableText>
              </h2>
            </div>
            {expandedSection === 'sales' ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedSection === 'sales' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">
                  <TranslatableText>Monthly Sales</TranslatableText>
                </h3>
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-100">
                    <ArrowLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="text-sm text-gray-600">2023</span>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="h-64 flex items-end space-x-2">
                {salesData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t-sm hover:bg-green-600 transition-all"
                      style={{ height: `${(item.sales / maxSales) * 200}px` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600">{item.month}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between">
                <span className="text-sm text-gray-500">
                  <TranslatableText>Total Annual Sales:</TranslatableText> ₹3,45,000
                </span>
                <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
                  <TranslatableText>View Detailed Report</TranslatableText>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Crop Distribution Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div 
            className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('crops')}
          >
            <div className="flex items-center">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                <TranslatableText>Crop Distribution</TranslatableText>
              </h2>
            </div>
            {expandedSection === 'crops' ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedSection === 'crops' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Simple Pie Chart Representation */}
                  <div className="relative w-48 h-48 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {cropData.reduce((acc, item, index) => {
                        const startAngle = acc.angle;
                        const angle = item.percentage * 3.6; // 3.6 degrees per percentage point
                        const endAngle = startAngle + angle;
                        
                        // Calculate the SVG arc path
                        const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f97316', '#64748b'];
                        
                        return {
                          angle: endAngle,
                          paths: [
                            ...acc.paths,
                            <path 
                              key={index}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={colors[index % colors.length]}
                            />
                          ]
                        };
                      }, { angle: 0, paths: [] }).paths}
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    <TranslatableText>Crop Distribution</TranslatableText>
                  </h3>
                  <div className="space-y-3">
                    {cropData.map((crop, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6', '#f97316', '#64748b'][index % 5] }}
                          ></div>
                          <span className="text-gray-700">{crop.name}</span>
                        </div>
                        <span className="font-medium">{crop.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
                      <TranslatableText>View All Crops</TranslatableText>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div 
            className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('activity')}
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                <TranslatableText>Recent Activity</TranslatableText>
              </h2>
            </div>
            {expandedSection === 'activity' ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedSection === 'activity' && (
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="p-2 bg-white rounded-lg shadow-sm mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <TranslatableText>View All Activity</TranslatableText>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;