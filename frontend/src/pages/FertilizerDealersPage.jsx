import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader, Sprout } from 'lucide-react';

const FertilizerDealersPage = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchDealers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://krushi-backend-1.onrender.com/api/dealers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dealers');
        }
        
        const data = await response.json();
        
        if (isMounted) {
          const dealerData = Array.isArray(data) ? data : (data.dealers || []);
          setDealers(dealerData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error fetching dealers');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDealers();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const states = useMemo(() => {
    const uniqueStates = [...new Set(dealers.map(d => d.state || d.State || d.location).filter(Boolean))];
    return uniqueStates.sort();
  }, [dealers]);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(dealers.map(d => d.city || d.City || d.district).filter(Boolean))];
    return uniqueCities.sort();
  }, [dealers]);

  const filteredDealers = useMemo(() => {
    let filtered = dealers;
    
    if (selectedState) {
      filtered = filtered.filter(dealer => {
        const state = dealer.state || dealer.State || dealer.location || '';
        return state.toLowerCase().includes(selectedState.toLowerCase());
      });
    }
    
    if (selectedCity) {
      filtered = filtered.filter(dealer => {
        const city = dealer.city || dealer.City || dealer.district || '';
        return city.toLowerCase().includes(selectedCity.toLowerCase());
      });
    }
    
    return filtered;
  }, [dealers, selectedState, selectedCity]);

  const clearFilters = useCallback(() => {
    setSelectedState('');
    setSelectedCity('');
  }, []);

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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Fertilizer Dealers</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-green-600">
              <tr>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white border-r border-green-500">State</th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white border-r border-green-500">City</th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white border-r border-green-500">Dealer Name</th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white border-r border-green-500">Mobile Number</th>
                <th className="w-2/6 px-4 py-4 text-left text-sm font-semibold text-white">Address</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredDealers.map((dealer, index) => {
                const dealerId = dealer.id || dealer._id || `dealer-${index}`;
                const state = dealer.state || dealer.State || dealer.location || 'N/A';
                const city = dealer.city || dealer.City || dealer.district || 'N/A';
                const name = dealer['Dealer Name'] || dealer.name || dealer.dealerName || 'N/A';
                const mobile = dealer.mobileno || dealer.mobile || dealer.phone || dealer.contact || dealer.phoneNumber || dealer.mobileNumber || dealer['Mobile No'] || dealer['mobile no'] || dealer['Phone Number'] || dealer.tel || dealer.telephone || 'N/A';
                const address = dealer.address || dealer.Address || dealer.addr || dealer.Addr || dealer['Full Address'] || dealer.fullAddress || dealer.place || dealer.Place || 'N/A';
                
                return (
                  <tr key={dealerId} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 truncate" title={state}>
                      {state}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 truncate" title={city}>
                      {city}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 truncate" title={name}>
                      {name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 truncate" title={mobile}>
                      {mobile}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900" title={address}>
                      <div className="break-words line-clamp-2">
                        {address}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDealers.length === 0 && dealers.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No dealers found for selected filters</p>
        </div>
      )}
      
      {dealers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Sprout className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500">No fertilizer dealers found</p>
        </div>
      )}
    </div>
  );
};

export default FertilizerDealersPage;