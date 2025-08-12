const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');
const router = express.Router();

// ML API URL
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002/api';

// @desc    Proxy request to ML API for plant identification
// @route   POST /api/ml/identify-plant
// @access  Private
router.post('/identify-plant', protect, async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/identify-plant`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to ML service',
      error: error.message
    });
  }
});

// @desc    Proxy request to ML API for disease detection
// @route   POST /api/ml/disease-detection
// @access  Private
router.post('/disease-detection', protect, async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/disease-detection`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to ML service',
      error: error.message
    });
  }
});

// @desc    Proxy request to ML API for weather advice
// @route   POST /api/ml/weather-advice
// @access  Private
router.post('/weather-advice', protect, async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/weather-advice`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to ML service',
      error: error.message
    });
  }
});

// @desc    Proxy request to ML API for crop recommendation
// @route   POST /api/ml/crop-recommendation
// @access  Private
router.post('/crop-recommendation', protect, async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/crop-recommendation`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to ML service',
      error: error.message
    });
  }
});

// @desc    Proxy request to ML API for AI chat
// @route   POST /api/ml/chat
// @access  Private
router.post('/chat', protect, async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/chat`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to ML service',
      error: error.message
    });
  }
});

module.exports = router;