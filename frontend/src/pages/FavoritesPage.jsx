import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Filter, Search, ShoppingBag, Star, ChevronDown, ChevronUp } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Sample data for favorites
  const sampleFavorites = [
    {
      id: 1,
      type: 'crop',
      name: 'Organic Tomatoes',
      seller: 'Rajesh Kumar',
      price: 45,
      unit: 'kg',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      dateAdded: '2023-10-15'
    },
    {
      id: 2,
      type: 'product',
      name: 'Organic Fertilizer',
      seller: 'Green Earth Co.',
      price: 350,
      unit: 'bag',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      dateAdded: '2023-10-10'
    },
    {
      id: 3,
      type: 'crop',
      name: 'Basmati Rice',
      seller: 'Surender Singh',
      price: 120,
      unit: 'kg',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      dateAdded: '2023-10-05'
    },
    {
      id: 4,
      type: 'tool',
      name: 'Garden Trowel Set',
      seller: 'Farm Tools Inc.',
      price: 250,
      unit: 'set',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      dateAdded: '2023-09-28'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch favorites
    setTimeout(() => {
      setFavorites(sampleFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(item => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.seller.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.dateAdded) - new Date(b.dateAdded)
          : new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <TranslatableText>My Favorites</TranslatableText>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <TranslatableText>
              Manage your favorite crops, products, and tools
            </TranslatableText>
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all"><TranslatableText>All Types</TranslatableText></option>
                  <option value="crop"><TranslatableText>Crops</TranslatableText></option>
                  <option value="product"><TranslatableText>Products</TranslatableText></option>
                  <option value="tool"><TranslatableText>Tools</TranslatableText></option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              <TranslatableText>Loading your favorites...</TranslatableText>
            </p>
          </div>
        ) : (
          <>
            {filteredFavorites.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Item</TranslatableText>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('price')}
                      >
                        <div className="flex items-center">
                          <TranslatableText>Price</TranslatableText>
                          {sortBy === 'price' && (
                            sortOrder === 'asc' ? 
                              <ChevronUp className="w-4 h-4 ml-1" /> : 
                              <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Rating</TranslatableText>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('date')}
                      >
                        <div className="flex items-center">
                          <TranslatableText>Date Added</TranslatableText>
                          {sortBy === 'date' && (
                            sortOrder === 'asc' ? 
                              <ChevronUp className="w-4 h-4 ml-1" /> : 
                              <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Actions</TranslatableText>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFavorites.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-10 w-10 object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.seller}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{item.price}</div>
                          <div className="text-sm text-gray-500">per {item.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.dateAdded)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {}}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  <TranslatableText>No favorites found</TranslatableText>
                </h3>
                <p className="text-gray-500">
                  {searchQuery || filter !== 'all' ? (
                    <TranslatableText>No items match your search criteria</TranslatableText>
                  ) : (
                    <TranslatableText>You haven't added any favorites yet</TranslatableText>
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;