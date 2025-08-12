import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

const MarketPricePage = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [states, setStates] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=100');
        const data = await response.json();
        
        if (isMounted) {
          if (response.ok) {
            const priceData = data.records || [];
            setPrices(priceData);
            setFilteredPrices(priceData);
            
            // Extract unique values for filters
            const uniqueStates = [...new Set(priceData.map(p => p.state).filter(Boolean))];
            const uniqueMarkets = [...new Set(priceData.map(p => p.market).filter(Boolean))];
            const uniqueCrops = [...new Set(priceData.map(p => p.commodity).filter(Boolean))];
            
            setStates(uniqueStates.sort());
            setMarkets(uniqueMarkets.sort());
            setCrops(uniqueCrops.sort());
          } else {
            setError('Failed to fetch market prices');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Error fetching market prices');
          setLoading(false);
        }
      }
    };

    fetchPrices();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = prices;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(price => 
        (price.commodity || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (price.market || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (price.state || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // State filter
    if (selectedState) {
      filtered = filtered.filter(price => price.state === selectedState);
    }
    
    // Market filter
    if (selectedMarket) {
      filtered = filtered.filter(price => price.market === selectedMarket);
    }
    
    // Crop filter
    if (selectedCrop) {
      filtered = filtered.filter(price => price.commodity === selectedCrop);
    }
    
    // Sort
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'state') return (a.state || '').localeCompare(b.state || '');
        if (sortBy === 'market') return (a.market || '').localeCompare(b.market || '');
        if (sortBy === 'commodity') return (a.commodity || '').localeCompare(b.commodity || '');
        if (sortBy === 'arrival_date') return (a.arrival_date || '').localeCompare(b.arrival_date || '');
        return 0;
      });
    }
    
    setFilteredPrices(filtered);
  }, [searchQuery, selectedState, selectedMarket, selectedCrop, sortBy, prices]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Market Prices</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search Commodity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Market</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Markets</option>
              {markets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Crops</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Default</option>
              <option value="state">State</option>
              <option value="market">Market</option>
              <option value="commodity">Commodity</option>
              <option value="arrival_date">Arrival Date</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedState('');
                setSelectedMarket('');
                setSelectedCrop('');
                setSortBy('');
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-green-600">
              <tr>
                <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-white border-r border-green-500">State</th>
                <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-white border-r border-green-500">Market</th>
                <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-white border-r border-green-500">Commodity</th>
                <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-white border-r border-green-500">Arrival Date</th>
                <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-white border-r border-green-500">Min Price (₹)</th>
                <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-white border-r border-green-500">Max Price (₹)</th>
                <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-white">Modal Price (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredPrices.map((price, index) => {
                const state = price.state || 'N/A';
                const market = price.market || 'N/A';
                const commodity = price.commodity || 'N/A';
                const arrivalDate = price.arrival_date || 'N/A';
                const minPrice = price.min_price || '0';
                const maxPrice = price.max_price || '0';
                const modalPrice = price.modal_price || '0';
                
                return (
                  <tr key={`price-${index}`} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 truncate" title={state}>
                      {state}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 truncate" title={market}>
                      {market}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 truncate" title={commodity}>
                      {commodity}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 truncate" title={arrivalDate}>
                      {arrivalDate}
                    </td>
                    <td className="px-3 py-3 text-sm text-red-600 font-semibold border-r border-gray-200 truncate">
                      {minPrice}
                    </td>
                    <td className="px-3 py-3 text-sm text-green-600 font-semibold border-r border-gray-200 truncate">
                      {maxPrice}
                    </td>
                    <td className="px-3 py-3 text-sm text-blue-600 font-semibold truncate">
                      {modalPrice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPrices.length === 0 && prices.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No prices found for selected filters</p>
        </div>
      )}
      
      {prices.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No market prices found</p>
        </div>
      )}
    </div>
  );
};

export default MarketPricePage;