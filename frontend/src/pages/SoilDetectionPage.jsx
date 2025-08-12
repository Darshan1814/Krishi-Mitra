import React, { useState } from 'react';
import { Beaker, Droplets, Thermometer, Zap, Leaf, BarChart3, AlertCircle, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const SoilDetectionPage = () => {
  const [soilData, setSoilData] = useState({
    pH: '',
    moisture: '',
    EC: '',
    temperature: '',
    nitrogen: '',
    phosphorus: '',
    potassium: ''
  });
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US');

  const handleInputChange = (field, value) => {
    setSoilData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateInputs = () => {
    const { pH, moisture, EC, temperature, nitrogen, phosphorus, potassium } = soilData;
    
    if (!pH || !moisture || !EC || !temperature || !nitrogen || !phosphorus || !potassium) {
      setError('Please fill in all fields');
      return false;
    }

    if (parseFloat(pH) < 0 || parseFloat(pH) > 14) {
      setError('pH must be between 0 and 14');
      return false;
    }

    if (parseFloat(moisture) < 0 || parseFloat(moisture) > 100) {
      setError('Moisture content must be between 0 and 100%');
      return false;
    }

    if (parseFloat(EC) < 0) {
      setError('EC cannot be negative');
      return false;
    }

    if (parseFloat(nitrogen) < 0 || parseFloat(phosphorus) < 0 || parseFloat(potassium) < 0) {
      setError('NPK values cannot be negative');
      return false;
    }

    return true;
  };

  const getSoilRecommendation = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5004/api/soil-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(soilData),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      const cleanRecommendation = data.recommendation.replace(/\*/g, '');
      setRecommendation(cleanRecommendation);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get soil recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSoilData({
      pH: '',
      moisture: '',
      EC: '',
      temperature: '',
      nitrogen: '',
      phosphorus: '',
      potassium: ''
    });
    setRecommendation('');
    setError('');
  };

  const formatRecommendation = (text) => {
    return text.replace(/(\d+\.)([^\n]+)/g, '<strong>$1$2</strong>');
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (speaking && !paused) {
        window.speechSynthesis.pause();
        setPaused(true);
        return;
      }
      
      if (paused) {
        window.speechSynthesis.resume();
        setPaused(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(recommendation);
      utterance.lang = speechLang;
      utterance.rate = 0.8;
      
      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <Beaker className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <TranslatableText>Soil Analysis & Crop Recommendation</TranslatableText>
            </h1>
            <p className="text-gray-600 mt-2">
              <TranslatableText>Enter your soil parameters to get AI-powered crop recommendations</TranslatableText>
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Soil Parameters Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
          <TranslatableText>Soil Parameters</TranslatableText>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* pH */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Beaker className="w-4 h-4 mr-2 text-blue-500" />
              <TranslatableText>Soil pH</TranslatableText>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g., 6.5"
              value={soilData.pH}
              onChange={(e) => handleInputChange('pH', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">Range: 0-14</p>
          </div>

          {/* Moisture */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Droplets className="w-4 h-4 mr-2 text-blue-500" />
              <TranslatableText>Soil Moisture (%)</TranslatableText>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g., 25.0"
              value={soilData.moisture}
              onChange={(e) => handleInputChange('moisture', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">Range: 0-100%</p>
          </div>

          {/* EC */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              <TranslatableText>Electrical Conductivity (dS/m)</TranslatableText>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 1.2"
              value={soilData.EC}
              onChange={(e) => handleInputChange('EC', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">Minimum: 0</p>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Thermometer className="w-4 h-4 mr-2 text-red-500" />
              <TranslatableText>Soil Temperature (°C)</TranslatableText>
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 22.5"
              value={soilData.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">In Celsius</p>
          </div>

          {/* Nitrogen */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Leaf className="w-4 h-4 mr-2 text-green-500" />
              <TranslatableText>Nitrogen (N) - ppm</TranslatableText>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 70"
              value={soilData.nitrogen}
              onChange={(e) => handleInputChange('nitrogen', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">Parts per million</p>
          </div>

          {/* Phosphorus */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Leaf className="w-4 h-4 mr-2 text-purple-500" />
              <TranslatableText>Phosphorus (P) - ppm</TranslatableText>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 30"
              value={soilData.phosphorus}
              onChange={(e) => handleInputChange('phosphorus', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">Parts per million</p>
          </div>

          {/* Potassium */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Leaf className="w-4 h-4 mr-2 text-orange-500" />
              <TranslatableText>Potassium (K) - ppm</TranslatableText>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 150"
              value={soilData.potassium}
              onChange={(e) => handleInputChange('potassium', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">Parts per million</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={getSoilRecommendation}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Beaker className="w-4 h-4" />
            )}
            <span>
              {loading ? <TranslatableText>Analyzing...</TranslatableText> : <TranslatableText>Get Recommendation</TranslatableText>}
            </span>
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
          >
            <TranslatableText>Reset</TranslatableText>
          </button>
        </div>
      </div>

      {/* Recommendation Results */}
      {recommendation && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Leaf className="w-6 h-6 text-green-600 mr-2" />
            <TranslatableText>Crop Recommendations</TranslatableText>
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={speechLang}
                  onChange={(e) => setSpeechLang(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="en-US">English</option>
                  <option value="hi-IN">Hindi</option>
                </select>
                <button
                  onClick={speakText}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  {speaking && !paused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{speaking && !paused ? 'Pause' : paused ? 'Resume' : 'Speak'}</span>
                </button>
                {speaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>
            <div 
              className="whitespace-pre-wrap text-gray-800"
              dangerouslySetInnerHTML={{ __html: formatRecommendation(recommendation) }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilDetectionPage;