import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, ShoppingCart, Plus, Star, MapPin, Calendar } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const KrishiBandhuDashboard = () => {
  const [activeSection, setActiveSection] = useState('farmer-to-farmer');
  
  const farmerToFarmerItems = [
    { id: 1, name: 'Organic Wheat Seeds', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300', location: 'Nashik, Maharashtra', date: '24 July 2025', price: '₹45/kg' },
    { id: 2, name: 'Fresh Tomatoes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300', location: 'Pune, Maharashtra', date: '24 July 2025', price: '₹30/kg' },
    { id: 3, name: 'Basmati Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', location: 'Aurangabad, Maharashtra', date: '24 July 2025', price: '₹80/kg' },
    { id: 4, name: 'Green Chillies', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=300', location: 'Solapur, Maharashtra', date: '24 July 2025', price: '₹60/kg' },
    { id: 5, name: 'Onions', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300', location: 'Satara, Maharashtra', date: '24 July 2025', price: '₹25/kg' },
    { id: 6, name: 'Sugarcane', image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=300', location: 'Kolhapur, Maharashtra', date: '24 July 2025', price: '₹35/kg' },
    { id: 7, name: 'Cotton Seeds', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300', location: 'Nagpur, Maharashtra', date: '24 July 2025', price: '₹120/kg' },
    { id: 8, name: 'Grapes', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300', location: 'Sangli, Maharashtra', date: '24 July 2025', price: '₹90/kg' },
    { id: 9, name: 'Soybean', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300', location: 'Latur, Maharashtra', date: '24 July 2025', price: '₹55/kg' },
    { id: 10, name: 'Maize', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300', location: 'Ahmednagar, Maharashtra', date: '24 July 2025', price: '₹28/kg' }
  ];
  
  const farmerToBusinessItems = [
    { id: 1, name: 'Bulk Wheat Supply', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300', location: 'Nashik, Maharashtra', date: '24 July 2025', price: '₹2200/quintal' },
    { id: 2, name: 'Premium Rice Export', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', location: 'Pune, Maharashtra', date: '24 July 2025', price: '₹4500/quintal' },
    { id: 3, name: 'Organic Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300', location: 'Aurangabad, Maharashtra', date: '24 July 2025', price: '₹3500/quintal' },
    { id: 4, name: 'Spice Collection', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', location: 'Solapur, Maharashtra', date: '24 July 2025', price: '₹8500/quintal' },
    { id: 5, name: 'Fresh Fruits Bulk', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300', location: 'Satara, Maharashtra', date: '24 July 2025', price: '₹5500/quintal' },
    { id: 6, name: 'Dairy Products', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', location: 'Kolhapur, Maharashtra', date: '24 July 2025', price: '₹6500/quintal' },
    { id: 7, name: 'Pulses Variety', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300', location: 'Nagpur, Maharashtra', date: '24 July 2025', price: '₹7500/quintal' },
    { id: 8, name: 'Oil Seeds', image: 'https://images.unsplash.com/photo-1628191081676-8f40d4ce6c44?w=300', location: 'Sangli, Maharashtra', date: '24 July 2025', price: '₹9500/quintal' },
    { id: 9, name: 'Medicinal Plants', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300', location: 'Latur, Maharashtra', date: '24 July 2025', price: '₹12500/quintal' },
    { id: 10, name: 'Flower Cultivation', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300', location: 'Ahmednagar, Maharashtra', date: '24 July 2025', price: '₹4500/quintal' }
  ];
  
  const businessToFarmerItems = [
    { id: 1, name: 'Tractor - Mahindra 575', image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300', location: 'Nashik, Maharashtra', date: '24 July 2025', price: '₹8,50,000' },
    { id: 2, name: 'Harvester Machine', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300', location: 'Pune, Maharashtra', date: '24 July 2025', price: '₹15,50,000' },
    { id: 3, name: 'Irrigation System', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300', location: 'Aurangabad, Maharashtra', date: '24 July 2025', price: '₹2,25,000' },
    { id: 4, name: 'Fertilizer Spreader', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300', location: 'Solapur, Maharashtra', date: '24 July 2025', price: '₹85,000' },
    { id: 5, name: 'Seed Drill Machine', image: 'https://images.unsplash.com/photo-1592982736920-1b0d8b3c8c7c?w=300', location: 'Satara, Maharashtra', date: '24 July 2025', price: '₹1,25,000' },
    { id: 6, name: 'Pesticide Sprayer', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300', location: 'Kolhapur, Maharashtra', date: '24 July 2025', price: '₹45,000' },
    { id: 7, name: 'Threshing Machine', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300', location: 'Nagpur, Maharashtra', date: '24 July 2025', price: '₹3,75,000' },
    { id: 8, name: 'Water Pump Set', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300', location: 'Sangli, Maharashtra', date: '24 July 2025', price: '₹65,000' },
    { id: 9, name: 'Solar Panel Kit', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300', location: 'Latur, Maharashtra', date: '24 July 2025', price: '₹2,85,000' },
    { id: 10, name: 'Greenhouse Setup', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300', location: 'Ahmednagar, Maharashtra', date: '24 July 2025', price: '₹5,50,000' }
  ];
  
  const reviews = [
    { id: 1, name: 'Ramesh Patil', rating: 5, comment: 'Krishi-Bandhu has transformed my farming business. Direct connection with buyers increased my profits by 40%.', location: 'Nashik, Maharashtra' },
    { id: 2, name: 'Sunita Sharma', rating: 5, comment: 'Amazing platform! Found the best quality seeds and equipment. The community support is incredible.', location: 'Pune, Maharashtra' },
    { id: 3, name: 'Vijay Kumar', rating: 4, comment: 'Great experience selling my produce directly to businesses. No middlemen, better prices!', location: 'Aurangabad, Maharashtra' },
    { id: 4, name: 'Priya Desai', rating: 5, comment: 'The equipment section helped me find affordable farming tools. Highly recommended for all farmers.', location: 'Solapur, Maharashtra' },
    { id: 5, name: 'Anil Jadhav', rating: 4, comment: 'User-friendly platform with genuine sellers. Made my agricultural business more profitable.', location: 'Satara, Maharashtra' }
  ];
  
  const getCurrentItems = () => {
    switch(activeSection) {
      case 'farmer-to-business': return farmerToBusinessItems;
      case 'business-to-farmer': return businessToFarmerItems;
      default: return farmerToFarmerItems;
    }
  };
  
  const userFlows = [
    {
      id: 1,
      title: 'Farmer to Farmer',
      description: 'Connect with fellow farmers to share knowledge, resources, and trade directly',
      icon: Users,
      buttonText: 'Explore Options',
      path: '/farmer-to-farmer',
      bgColor: 'from-green-500 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400'
    },
    {
      id: 2,
      title: 'Farmer to Business',
      description: 'Sell your crops directly to businesses and get better prices for your produce',
      icon: Building,
      buttonText: 'Sell Your Crops',
      path: '/farmer-to-business',
      bgColor: 'from-blue-500 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400'
    },
    {
      id: 3,
      title: 'Business to Farmer',
      description: 'Shop for agricultural equipment, seeds, fertilizers, and farming tools',
      icon: ShoppingCart,
      buttonText: 'Shop Equipment',
      path: '/business-to-farmer',
      bgColor: 'from-purple-500 to-violet-600',
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            <TranslatableText>Welcome to Krishi-Bandhu</TranslatableText>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <TranslatableText>Your comprehensive agricultural marketplace connecting farmers, businesses, and communities</TranslatableText>
          </p>
        </div>

        {/* User Flow Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {userFlows.map((flow) => (
            <div key={flow.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-48 overflow-hidden">
                <img 
                  src={flow.image} 
                  alt={flow.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${flow.bgColor} flex items-center justify-center mr-4`}>
                    <flow.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    <TranslatableText>{flow.title}</TranslatableText>
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  <TranslatableText>{flow.description}</TranslatableText>
                </p>
                
                <button
                  onClick={() => setActiveSection(flow.id === 1 ? 'farmer-to-farmer' : flow.id === 2 ? 'farmer-to-business' : 'business-to-farmer')}
                  className={`w-full bg-gradient-to-r ${flow.bgColor} text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center font-semibold text-lg`}
                >
                  <TranslatableText>{flow.buttonText}</TranslatableText>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              <TranslatableText>{activeSection === 'farmer-to-farmer' ? 'Farmer to Farmer Products' : activeSection === 'farmer-to-business' ? 'Farmer to Business Products' : 'Business to Farmer Products'}</TranslatableText>
            </h2>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              <TranslatableText>Add Product</TranslatableText>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {getCurrentItems().map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{item.date}</span>
                </div>
                <div className="text-lg font-bold text-green-600">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            <TranslatableText>What Our Users Say</TranslatableText>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{review.comment}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{review.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KrishiBandhuDashboard;