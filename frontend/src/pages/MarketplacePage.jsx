import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, MapPin, Phone, Star, Heart, Eye, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TranslatableText from '../components/TranslatableText';
import ProductSearchCard from '../components/ProductSearchCard';
import ProductSearchBar from '../components/ProductSearchBar';
import axios from 'axios';

const MarketplacePage = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('crops');

  // Sample crop data
  const sampleCrops = [
    {
      id: 1,
      name: 'Organic Tomatoes',
      farmer: 'Ramesh Kumar',
      farmerId: 'farmer123',
      location: 'Pune, Maharashtra',
      price: 45,
      unit: 'kg',
      quantity: 500,
      category: 'vegetables',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      rating: 4.5,
      description: 'Fresh organic tomatoes grown without pesticides',
      phone: '+91 9876543210'
    },
    {
      id: 2,
      name: 'Premium Basmati Rice',
      farmer: 'Surender Singh',
      farmerId: 'farmer456',
      location: 'Haryana',
      price: 120,
      unit: 'kg',
      quantity: 1000,
      category: 'grains',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      rating: 4.8,
      description: 'High-quality basmati rice with excellent aroma',
      phone: '+91 9876543211'
    },
    {
      id: 3,
      name: 'Fresh Wheat',
      farmer: 'Kiran Patel',
      farmerId: 'farmer789',
      location: 'Gujarat',
      price: 25,
      unit: 'kg',
      quantity: 50,
      category: 'grains',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      rating: 4.3,
      description: 'Freshly harvested wheat, ideal for milling',
      phone: '+91 9876543212'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCrops(sampleCrops);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setProductLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/products/search?q=${encodeURIComponent(searchTerm)}`);
      setProducts(response.data.products);
      setActiveTab('products');
    } catch (error) {
      console.error('Product search error:', error);
      alert('Error searching products. Please try again.');
    } finally {
      setProductLoading(false);
    }
  };

  const handleOrderClick = (crop) => {
    setSelectedCrop(crop);
    setOrderQuantity(1);
    setShowOrderModal(true);
    setOrderSuccess(false);
  };

  const handleOrderSubmit = () => {
    // In a real app, you would send this to your backend
    console.log('Order submitted:', {
      cropId: selectedCrop.id,
      quantity: orderQuantity,
      totalPrice: selectedCrop.price * orderQuantity,
      buyer: user?.id || 'guest',
      seller: selectedCrop.farmerId
    });
    
    // Show success message
    setOrderSuccess(true);
    
    // Close modal after 2 seconds
    setTimeout(() => {
      setShowOrderModal(false);
      setSelectedCrop(null);
    }, 2000);
  };



  const CropCard = ({ crop }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-green-100">
      <div className="relative">
        <img 
          src={crop.image} 
          alt={crop.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors">
          <Heart size={20} className="text-gray-400 hover:text-red-500" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800">{crop.name}</h3>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <TranslatableText>{crop.category}</TranslatableText>
          </span>
        </div>
        
        <div className="flex items-center mb-2">
          <Star className="text-yellow-400 fill-current" size={16} />
          <span className="ml-1 text-gray-600 text-sm">{crop.rating}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{crop.description}</p>
        
        <div className="flex items-center mb-3 text-gray-600">
          <MapPin size={16} className="mr-2" />
          <span className="text-sm">{crop.location}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-green-600">₹{crop.price}</span>
            <span className="text-gray-500 ml-1">/{crop.unit}</span>
          </div>
          <span className="text-sm text-gray-500">{crop.quantity} {crop.unit} <TranslatableText>available</TranslatableText></span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Phone size={16} className="mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">{crop.farmer}</span>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm">
              <Eye size={16} />
              <span><TranslatableText>View</TranslatableText></span>
            </button>
            <button 
              onClick={() => handleOrderClick(crop)}
              className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <ShoppingBag size={16} />
              <span><TranslatableText>Order</TranslatableText></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <TranslatableText>Crop Marketplace</TranslatableText>
          </h1>
          <p className="text-gray-600 text-lg">
            <TranslatableText>Connect with farmers and discover fresh crops or find agricultural products</TranslatableText>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('crops')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'crops' ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-green-500'
              }`}
            >
              <TranslatableText>Local Crops</TranslatableText>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'products' ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-green-500'
              }`}
            >
              <TranslatableText>Agricultural Products</TranslatableText>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        {activeTab === 'crops' ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search crops, farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all"><TranslatableText>All Categories</TranslatableText></option>
                  <option value="vegetables"><TranslatableText>Vegetables</TranslatableText></option>
                  <option value="grains"><TranslatableText>Grains</TranslatableText></option>
                  <option value="fruits"><TranslatableText>Fruits</TranslatableText></option>
                  <option value="pulses"><TranslatableText>Pulses</TranslatableText></option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <ProductSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleProductSearch}
            loading={productLoading}
          />
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {activeTab === 'crops' ? (
              <><TranslatableText>Showing</TranslatableText> {filteredCrops.length} <TranslatableText>of</TranslatableText> {crops.length} <TranslatableText>crops</TranslatableText></>
            ) : (
              <><TranslatableText>Showing</TranslatableText> {products.length} <TranslatableText>products</TranslatableText></>
            )}
          </p>
        </div>

        {/* Content Grid */}
        {activeTab === 'crops' ? (
          loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map(crop => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          )
        ) : (
          productLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">Searching products...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductSearchCard key={product.id} product={product} />
              ))}
            </div>
          )
        )}

        {/* No Results */}
        {((activeTab === 'crops' && filteredCrops.length === 0 && !loading) || 
          (activeTab === 'products' && products.length === 0 && !productLoading && searchTerm)) && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              <TranslatableText>{activeTab === 'crops' ? 'No crops found' : 'No products found'}</TranslatableText>
            </h3>
            <p className="text-gray-500">
              <TranslatableText>{activeTab === 'crops' ? 'Try adjusting your search criteria' : 'Try searching for fertilizers, pesticides, or seeds'}</TranslatableText>
            </p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {orderSuccess ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  <TranslatableText>Order Placed Successfully!</TranslatableText>
                </h3>
                <p className="text-gray-600 mb-6">
                  <TranslatableText>Your order has been placed. The farmer will contact you soon.</TranslatableText>
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-800">
                    <TranslatableText>Place Order</TranslatableText>
                  </h3>
                  <button 
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 rounded-lg overflow-hidden mr-4">
                      <img 
                        src={selectedCrop.image} 
                        alt={selectedCrop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedCrop.name}</h4>
                      <p className="text-gray-600 text-sm">{selectedCrop.farmer}</p>
                      <p className="text-green-600 font-medium">₹{selectedCrop.price}/{selectedCrop.unit}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <TranslatableText>Quantity ({selectedCrop.unit})</TranslatableText>
                    </label>
                    <div className="flex items-center">
                      <button 
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        min="1"
                        max={selectedCrop.quantity}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Math.min(selectedCrop.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-20 text-center py-1 border-t border-b border-gray-300"
                      />
                      <button 
                        onClick={() => setOrderQuantity(Math.min(selectedCrop.quantity, orderQuantity + 1))}
                        className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        <TranslatableText>Price</TranslatableText>
                      </span>
                      <span>₹{selectedCrop.price} × {orderQuantity}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-800">
                        <TranslatableText>Total</TranslatableText>
                      </span>
                      <span className="text-green-600">₹{selectedCrop.price * orderQuantity}</span>
                    </div>
                  </div>
                  
                  {!user && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                        <p className="text-sm text-yellow-700">
                          <TranslatableText>Please log in to place an order</TranslatableText>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <TranslatableText>Cancel</TranslatableText>
                    </button>
                    <button
                      onClick={handleOrderSubmit}
                      disabled={!user}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TranslatableText>Confirm Order</TranslatableText>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;