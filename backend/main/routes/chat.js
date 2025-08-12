const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{
          parts: [{
            text: `You are KrishiMitra AI, an expert agricultural assistant for Indian farmers. Provide helpful, practical advice about farming, crops, diseases, weather, and agricultural practices in India. Keep responses concise and actionable. User question: ${message}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );
    
    if (response.data.candidates && response.data.candidates[0]) {
      res.json({
        success: true,
        response: response.data.candidates[0].content.parts[0].text,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No response from AI');
    }
    
  } catch (error) {
    console.error('Chat error:', error.message);
    console.error('Full error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat request',
      response: 'I apologize, but I am currently experiencing technical difficulties. Please try again later or contact support for assistance with your farming questions.',
      debug: error.message
    });
  }
});

module.exports = router;