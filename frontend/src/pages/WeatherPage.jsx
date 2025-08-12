import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Thermometer, Sun, Search, MapPin, AlertCircle } from 'lucide-react';
import { getWeatherAdvice } from '../services/mlService';
import TranslatableText from '../components/TranslatableText';
import axios from 'axios';

const WeatherPage = () => {
  const [location, setLocation] = useState('');
  const [cropType, setCropType] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common crop types in India
  const cropTypes = [
    'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 
    'Pulses', 'Soybeans', 'Groundnut', 'Mustard', 'Potato',
    'Tomato', 'Onion', 'Chilli', 'Mango', 'Banana'
  ];

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enter it manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Don't use cached location
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  }, []);

  // Fetch weather data by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=a8e71c9932b20c4ceb0aed183e6a83bb&_=${Date.now()}`);
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeatherData(data);
        setLocation(data.name);
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data by city name
  const fetchWeatherByCity = async (city) => {
    if (!city) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a8e71c9932b20c4ceb0aed183e6a83bb&_=${Date.now()}`);
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        setError('Location not found. Please check the spelling and try again.');
      }
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get farming advice based on weather and crop
  const getFarmingAdvice = async () => {
    if (!location || !cropType) {
      setError('Please select both location and crop type');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate basic farming advice based on weather conditions
      let adviceText = `Farming advice for ${cropType} in ${location}:\n\n`;
      
      if (weatherData) {
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const condition = weatherData.weather[0].main.toLowerCase();
        
        // Temperature advice
        if (temp > 35) {
          adviceText += `🌡️ High temperature (${temp}°C): Ensure adequate irrigation and consider shade nets for sensitive crops.\n\n`;
        } else if (temp < 15) {
          adviceText += `❄️ Low temperature (${temp}°C): Protect crops from cold damage and consider frost protection measures.\n\n`;
        } else {
          adviceText += `🌡️ Optimal temperature (${temp}°C): Good conditions for most farming activities.\n\n`;
        }
        
        // Humidity advice
        if (humidity > 80) {
          adviceText += `💧 High humidity (${humidity}%): Monitor for fungal diseases and ensure good air circulation.\n\n`;
        } else if (humidity < 40) {
          adviceText += `🏜️ Low humidity (${humidity}%): Increase irrigation frequency and consider mulching.\n\n`;
        }
        
        // Weather condition advice
        if (condition.includes('rain')) {
          adviceText += `🌧️ Rainy conditions: Good for water-loving crops. Ensure proper drainage to prevent waterlogging.\n\n`;
        } else if (condition.includes('clear')) {
          adviceText += `☀️ Clear weather: Ideal for harvesting and field operations. Monitor soil moisture levels.\n\n`;
        }
        
        // Crop-specific advice
        const cropAdvice = {
          'Rice': 'Maintain water levels in fields. Monitor for pests like stem borers.',
          'Wheat': 'Ensure adequate moisture during grain filling stage.',
          'Maize': 'Provide support to prevent lodging in windy conditions.',
          'Cotton': 'Monitor for bollworm and maintain soil moisture.',
          'Sugarcane': 'Ensure consistent irrigation and weed management.',
          'Tomato': 'Provide support stakes and monitor for blight diseases.',
          'Potato': 'Hill up soil around plants and monitor for late blight.',
          'Onion': 'Reduce watering as bulbs mature to prevent rot.'
        };
        
        if (cropAdvice[cropType]) {
          adviceText += `🌾 ${cropType} specific advice: ${cropAdvice[cropType]}\n\n`;
        }
        
        const lastUpdated = new Date(weatherData.dt * 1000).toLocaleString();
        adviceText += `📊 Current conditions summary (${lastUpdated}):\n- Temperature: ${temp}°C\n- Humidity: ${humidity}%\n- Weather: ${weatherData.weather[0].description}\n- Wind: ${Math.round(weatherData.wind.speed * 3.6)} km/h`;
      } else {
        adviceText += 'Please get weather data first to receive detailed farming advice.';
      }
      
      setAdvice(adviceText);
    } catch (err) {
      setError('Error generating farming advice. Please try again.');
      console.error('Farming advice error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search for location suggestions using simple Indian cities list
  const searchLocationSuggestions = (query) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const indianCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
      'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
      'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
      'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
      'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
      'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
      'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad',
      'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli',
      'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur',
      'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad',
      'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela',
      'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni',
      'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore',
      'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur'
    ];

    const filtered = indianCities
      .filter(city => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map(city => ({ name: city, coordinates: null }));
    
    setLocationSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    searchLocationSuggestions(value);
  };

  const selectLocation = (suggestion) => {
    setLocation(suggestion.name);
    setShowSuggestions(false);
    setLocationSuggestions([]);
    fetchWeatherByCity(suggestion.name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    fetchWeatherByCity(location);
  };

  const handleGetAdvice = (e) => {
    e.preventDefault();
    getFarmingAdvice();
  };

  // Weather condition icons
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <Sun className="w-12 h-12 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-12 h-12 text-gray-500" />;
      case 'rain':
        return <Droplets className="w-12 h-12 text-blue-500" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <TranslatableText>Weather & Farming Advice</TranslatableText>
        </h1>
        <p className="text-gray-600">
          <TranslatableText>Get personalized farming recommendations based on weather conditions</TranslatableText>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Search */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              <TranslatableText>Location</TranslatableText>
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Enter City/Village</TranslatableText>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={handleLocationChange}
                    onFocus={() => location.length >= 3 && setShowSuggestions(true)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Mumbai, Pune, Delhi"
                    autoComplete="off"
                  />
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => selectLocation(suggestion)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-800">{suggestion.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Search className="w-5 h-5 mr-2" />
                <TranslatableText>Get Weather</TranslatableText>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              <TranslatableText>Crop Selection</TranslatableText>
            </h2>
            <form onSubmit={handleGetAdvice} className="space-y-4">
              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Select Crop</TranslatableText>
                </label>
                <select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select Crop --</option>
                  {cropTypes.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={!weatherData || !cropType || loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <TranslatableText>Loading...</TranslatableText>
                ) : (
                  <TranslatableText>Get Farming Advice</TranslatableText>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Weather Display and Advice */}
        <div className="md:col-span-2">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {weatherData && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    <TranslatableText>Updated: {new Date(weatherData.dt * 1000).toLocaleString()}</TranslatableText>
                  </p>
                </div>
                <div>
                  {getWeatherIcon(weatherData.weather[0].main)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      <TranslatableText>Temperature</TranslatableText>
                    </span>
                  </div>
                  <p className="text-xl font-semibold">{Math.round(weatherData.main.temp)}°C</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      <TranslatableText>Humidity</TranslatableText>
                    </span>
                  </div>
                  <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Wind className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      <TranslatableText>Wind</TranslatableText>
                    </span>
                  </div>
                  <p className="text-xl font-semibold">{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Cloud className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      <TranslatableText>Condition</TranslatableText>
                    </span>
                  </div>
                  <p className="text-xl font-semibold capitalize">{weatherData.weather[0].description}</p>
                </div>
              </div>
            </div>
          )}

          {advice && (
            <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <TranslatableText>Farming Advice for {cropType}</TranslatableText>
              </h2>
              <div className="prose max-w-none">
                <div className="bg-green-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap">
                  {advice}
                </div>
              </div>
            </div>
          )}

          {!weatherData && !error && (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
              <div className="text-center py-8">
                <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  <TranslatableText>Enter a location to see weather information</TranslatableText>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;