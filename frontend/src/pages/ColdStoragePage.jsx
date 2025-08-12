import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, MapPin, Package, Search, Filter, Loader, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyYW54YSIsImEiOiJjbWRmb3R5ZmIwZHQwMmpxeGh1dGRkcjJwIn0.QgzAWXMc3YAvSeXSF-Yymg';

const ColdStoragePage = () => {
  const [storages, setStorages] = useState([]);
  const [filteredStorages, setFilteredStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [selectedStorage, setSelectedStorage] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    fetchStorages();
  }, []);

  useEffect(() => {
    filterStorages();
  }, [storages, searchTerm, capacityFilter]);

  useEffect(() => {
    if (map.current || !mapContainer.current || storages.length === 0) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [74.8520, 18.5204],
      zoom: 8
    });
    
    map.current.addControl(new mapboxgl.NavigationControl());
  }, [storages]);

  useEffect(() => {
    if (!map.current || filteredStorages.length === 0) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add markers for filtered storages
    filteredStorages.forEach(storage => {
      const lng = parseFloat(storage.Longitude);
      const lat = parseFloat(storage.Latitude);
      
      if (!isNaN(lng) && !isNaN(lat)) {
        const marker = new mapboxgl.Marker({ color: '#059669' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-sm mb-1">${storage['Storage name']}</h3>
              <p class="text-xs text-gray-600 mb-1">${storage.Address}</p>
              <p class="text-xs font-medium">Capacity: ${storage['Capacity in MT']} MT</p>
            </div>
          `))
          .addTo(map.current);
        
        markers.current.push(marker);
      }
    });
  }, [filteredStorages]);

  const fetchStorages = async () => {
    try {
      const response = await fetch('https://innoverse.avishkar.digital/api/cold-stores');
      const data = await response.json();
      
      if (response.ok) {
        setStorages(data);
        setFilteredStorages(data);
      } else {
        setError('Failed to fetch cold storages');
      }
    } catch (err) {
      setError('Error fetching cold storages');
    } finally {
      setLoading(false);
    }
  };

  const filterStorages = () => {
    let filtered = storages;

    if (searchTerm) {
      filtered = filtered.filter(storage =>
        storage['Storage name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        storage.Address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (capacityFilter) {
      filtered = filtered.filter(storage => {
        const capacity = parseFloat(storage['Capacity in MT']);
        switch (capacityFilter) {
          case 'small': return capacity < 1000;
          case 'medium': return capacity >= 1000 && capacity < 5000;
          case 'large': return capacity >= 5000;
          default: return true;
        }
      });
    }

    setFilteredStorages(filtered);
  };

  const locateOnMap = (storage) => {
    if (!map.current) return;
    
    const lng = parseFloat(storage.Longitude);
    const lat = parseFloat(storage.Latitude);
    
    map.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 2000
    });
    
    setSelectedStorage(storage);
  };

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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Cold Storage Facilities</h1>
      
      {/* Map */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div 
          ref={mapContainer} 
          className="h-96 w-full"
          style={{ position: 'relative' }}
        />
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Capacities</option>
            <option value="small">Small (&lt; 1000 MT)</option>
            <option value="medium">Medium (1000-5000 MT)</option>
            <option value="large">Large (&gt; 5000 MT)</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-1" />
            {filteredStorages.length} of {storages.length} storages
          </div>
        </div>
      </div>

      {/* Storage Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStorages.map((storage, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {storage['Storage name']}
              </h2>
              <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
                <Thermometer className="w-3 h-3 mr-1" />
                {storage.Type}
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start text-gray-600">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm">{storage.Address}</p>
                  <p className="text-xs text-gray-500">{storage.District}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Package className="w-4 h-4 mr-2 text-orange-600" />
                <span className="text-sm">
                  Capacity: <span className="font-medium">{storage['Capacity in MT']} MT</span>
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-xs text-gray-500">Serial No: {storage['Serial No']}</span>
              <button
                onClick={() => locateOnMap(storage)}
                className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors"
              >
                <Navigation className="w-3 h-3 mr-1" />
                Locate
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStorages.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No cold storages found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ColdStoragePage;