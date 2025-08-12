const express = require('express');
const router = express.Router();
const axios = require('axios');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDrYXOmHqiChayrg_yC0i-aGi-OqeJw1v4';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

const callGeminiAPI = async (payload, maxRetries = 5, initialDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.post(GEMINI_API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        console.log(`Attempt ${attempt + 1}: Unexpected API response structure. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, attempt)));
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      
      if (error.response?.status === 429 || error.response?.status >= 500) {
        // Rate limit or server error - retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, attempt)));
      } else {
        // Other errors - don't retry
        break;
      }
    }
  }
  
  return "Could not get a crop recommendation at this time. Please try again later.";
};

// Soil recommendation endpoint
router.post('/soil-recommendation', async (req, res) => {
  try {
    const { pH, moisture, EC, temperature, nitrogen, phosphorus, potassium } = req.body;

    // Validate input data
    if (!pH || !moisture || !EC || !temperature || !nitrogen || !phosphorus || !potassium) {
      return res.status(400).json({ error: 'All soil parameters are required' });
    }

    // Validate ranges
    if (parseFloat(pH) < 0 || parseFloat(pH) > 14) {
      return res.status(400).json({ error: 'pH must be between 0 and 14' });
    }

    if (parseFloat(moisture) < 0 || parseFloat(moisture) > 100) {
      return res.status(400).json({ error: 'Moisture content must be between 0 and 100%' });
    }

    if (parseFloat(EC) < 0) {
      return res.status(400).json({ error: 'EC cannot be negative' });
    }

    if (parseFloat(nitrogen) < 0 || parseFloat(phosphorus) < 0 || parseFloat(potassium) < 0) {
      return res.status(400).json({ error: 'NPK values cannot be negative' });
    }

    // Create prompt for Gemini API
    const prompt = `
    Based on the following soil parameters, please recommend the best 3 crops to plant.
    Consider general agricultural knowledge about crop requirements for these conditions.

    Soil pH: ${pH}
    Soil Moisture: ${moisture}%
    Soil EC: ${EC} dS/m
    Soil Temperature: ${temperature} °C
    Nitrogen (N): ${nitrogen} ppm
    Phosphorus (P): ${phosphorus} ppm
    Potassium (K): ${potassium} ppm

    Please list 3 suitable crops and briefly explain why each is a good fit based on the provided data.
    If the conditions are severely limiting for most common crops, please mention that.
    Format your response as a numbered list with clear explanations.
    `;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    console.log('Analyzing soil data with Gemini AI...');
    const recommendation = await callGeminiAPI(payload);

    res.json({ 
      success: true,
      recommendation,
      soilData: {
        pH: parseFloat(pH),
        moisture: parseFloat(moisture),
        EC: parseFloat(EC),
        temperature: parseFloat(temperature),
        nitrogen: parseFloat(nitrogen),
        phosphorus: parseFloat(phosphorus),
        potassium: parseFloat(potassium)
      }
    });

  } catch (error) {
    console.error('Error in soil recommendation:', error);
    res.status(500).json({ 
      error: 'Failed to get soil recommendation',
      message: error.message 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Soil Detection API' });
});

module.exports = router;