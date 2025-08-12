const express = require('express');
const axios = require('axios');
const router = express.Router();

// @desc    Get current weather data
// @route   GET /api/weather/current
// @access  Public
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Weather API key not configured'
      });
    }

    let weatherUrl;
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either coordinates (lat, lon) or city name'
      });
    }

    const response = await axios.get(weatherUrl);
    const weatherData = response.data;

    const formattedData = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        coordinates: {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon
        }
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : null,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: weatherData.wind.deg,
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      },
      sun: {
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch weather data'
    });
  }
});

// @desc    Get weather forecast
// @route   GET /api/weather/forecast
// @access  Public
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, city, days = 5 } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Weather API key not configured'
      });
    }

    let forecastUrl;
    if (lat && lon) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else if (city) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either coordinates (lat, lon) or city name'
      });
    }

    const response = await axios.get(forecastUrl);
    const forecastData = response.data;

    // Group forecast by days
    const dailyForecasts = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // Process daily forecasts
    const formattedForecast = Object.keys(dailyForecasts)
      .slice(0, parseInt(days))
      .map(date => {
        const dayData = dailyForecasts[date];
        const temps = dayData.map(item => item.main.temp);
        const conditions = dayData.map(item => item.weather[0].main);
        
        // Get the most common condition
        const conditionCounts = conditions.reduce((acc, condition) => {
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
        }, {});
        const mostCommonCondition = Object.keys(conditionCounts).reduce((a, b) => 
          conditionCounts[a] > conditionCounts[b] ? a : b
        );

        return {
          date: date,
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
          high: Math.round(Math.max(...temps)),
          low: Math.round(Math.min(...temps)),
          condition: mostCommonCondition,
          description: dayData[0].weather[0].description,
          icon: dayData[0].weather[0].icon,
          humidity: Math.round(dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length),
          windSpeed: Math.round(dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length * 3.6)
        };
      });

    res.json({
      success: true,
      data: {
        location: {
          name: forecastData.city.name,
          country: forecastData.city.country,
          coordinates: {
            lat: forecastData.city.coord.lat,
            lon: forecastData.city.coord.lon
          }
        },
        forecast: formattedForecast
      }
    });

  } catch (error) {
    console.error('Weather Forecast API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch weather forecast'
    });
  }
});

// @desc    Search cities for weather
// @route   GET /api/weather/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; // search query
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const searchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`;
    const response = await axios.get(searchUrl);
    
    const cities = response.data.map(city => ({
      name: city.name,
      state: city.state,
      country: city.country,
      coordinates: {
        lat: city.lat,
        lon: city.lon
      },
      displayName: `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`
    }));

    res.json({
      success: true,
      data: cities
    });

  } catch (error) {
    console.error('City Search API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search cities'
    });
  }
});

module.exports = router;
