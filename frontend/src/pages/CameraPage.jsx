import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Loader, Volume2 } from 'lucide-react';
import { identifyPlant } from '../services/mlService';
import TranslatableText from '../components/TranslatableText';

const CameraPage = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Start camera when showCamera becomes true
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [showCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      setActiveImage(imageDataUrl);
      setShowCamera(false);
      setResult(null);
      setError(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setActiveImage(reader.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setActiveImage(reader.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setActiveImage(null);
    setCapturedImage(null);
    setUploadedImage(null);
    setResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!activeImage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert base64 to blob for upload
      const response = await identifyPlant(activeImage);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to analyze image');
      }
    } catch (err) {
      setError('Error analyzing image. Please try again.');
      console.error('Plant identification error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const speakHealthAssessment = (plantData) => {
    if (!plantData || !('speechSynthesis' in window)) return;
    
    let text = '';
    
    if (language === 'hi') {
      // Hindi text
      text = `पौधे की पहचान: ${translateToHindi(plantData.identification?.common_name || 'अज्ञात')}। `;
      
      if (plantData.health_assessment?.status === 'Disease Detected') {
        text += `स्वास्थ्य स्थिति: बीमारी मिली। `;
        if (plantData.health_assessment?.diseases?.length > 0) {
          text += `बीमारी: ${translateToHindi(plantData.health_assessment.diseases[0])}। `;
        }
        if (plantData.health_assessment?.treatment) {
          text += `इलाज: ${translateToHindi(plantData.health_assessment.treatment)}। `;
        }
      } else {
        text += `स्वास्थ्य स्थिति: अच्छी। पौधा स्वस्थ है। नियमित देखभाल जारी रखें।`;
      }
    } else {
      // English text
      text = `Plant identified: ${plantData.identification?.common_name || 'Unknown'}. `;
      
      if (plantData.health_assessment?.status === 'Disease Detected') {
        text += `Health status: Disease detected. `;
        if (plantData.health_assessment?.diseases?.length > 0) {
          text += `Disease found: ${plantData.health_assessment.diseases[0]}. `;
        }
        if (plantData.health_assessment?.treatment) {
          text += `Treatment: ${plantData.health_assessment.treatment}. `;
        }
      } else {
        text += `Health status: Good. Plant appears healthy. Continue regular care.`;
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.8;
    
    speechSynthesis.speak(utterance);
  };
  
  const translateToHindi = (text) => {
    const translations = {
      'Rice': 'चावल',
      'Wheat': 'गेहूं',
      'Corn': 'मक्का',
      'Tomato': 'टमाटर',
      'Potato': 'आलू',
      'Unknown': 'अज्ञात',
      'Good': 'अच्छी',
      'Disease Detected': 'बीमारी मिली',
      'Healthy': 'स्वस्थ',
      'disease': 'बीमारी',
      'treatment': 'इलाज',
      'leaf': 'पत्ती',
      'spot': 'धब्बा',
      'fungal': 'फंगल',
      'bacterial': 'बैक्टीरियल',
      'spray': 'छिड़काव',
      'water': 'पानी',
      'fertilizer': 'खाद',
      'Apply': 'लगाएं',
      'Use': 'उपयोग करें',
      'Monitor': 'निगरानी करें'
    };
    
    let translatedText = text;
    Object.entries(translations).forEach(([eng, hindi]) => {
      translatedText = translatedText.replace(new RegExp(eng, 'gi'), hindi);
    });
    
    return translatedText;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            <TranslatableText>Plant Camera</TranslatableText>
          </h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border-2 border-green-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
        <p className="text-gray-600">
          <TranslatableText>Take a photo or upload an image of your plant for identification</TranslatableText>
        </p>
      </div>

      {showCamera ? (
        <div className="bg-black rounded-lg overflow-hidden mb-6">
          <div className="relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto"
            />
            <button
              onClick={() => setShowCamera(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className="bg-black p-4 flex justify-center">
            <button
              onClick={captureImage}
              className="bg-white rounded-full p-4"
            >
              <Camera className="w-8 h-8 text-gray-800" />
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Camera Button */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowCamera(true)}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              <TranslatableText>Take Photo</TranslatableText>
            </h2>
            <p className="text-gray-600 text-center">
              <TranslatableText>Use your camera to take a photo of your plant</TranslatableText>
            </p>
          </div>

          {/* Upload Button */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              <TranslatableText>Upload Image</TranslatableText>
            </h2>
            <p className="text-gray-600 text-center">
              <TranslatableText>Upload an image from your device or drag and drop</TranslatableText>
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </div>
        </div>
      )}

      {activeImage && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              <TranslatableText>Preview</TranslatableText>
            </h2>
            <button
              onClick={clearImage}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              <X className="w-5 h-5 mr-1" />
              <TranslatableText>Clear</TranslatableText>
            </button>
          </div>
          
          <div className="flex justify-center mb-6">
            <img 
              src={activeImage} 
              alt="Plant preview" 
              className="max-h-96 rounded-lg" 
            />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={analyzeImage}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  <TranslatableText>Analyzing...</TranslatableText>
                </div>
              ) : (
                <div className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  <TranslatableText>Identify Plant</TranslatableText>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
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

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              <TranslatableText>Plant Identified</TranslatableText>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                <TranslatableText>Plant Information</TranslatableText>
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <span className="font-medium"><TranslatableText>Common Name:</TranslatableText></span> {result.identification?.common_name || 'Unknown'}
                </p>
                <p className="mb-2">
                  <span className="font-medium"><TranslatableText>Scientific Name:</TranslatableText></span> {result.identification?.scientific_name || 'Unknown'}
                </p>
                <p className="mb-2">
                  <span className="font-medium"><TranslatableText>Type:</TranslatableText></span> {result.identification?.type || 'Unknown'}
                </p>
                <p>
                  <span className="font-medium"><TranslatableText>Confidence:</TranslatableText></span> {Math.round((result.identification?.confidence || 0) * 100)}%
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  <TranslatableText>Health Assessment</TranslatableText>
                </h3>
                <button
                  onClick={() => speakHealthAssessment(result)}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  title={`Listen in ${language === 'hi' ? 'Hindi' : 'English'}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <span className="font-medium"><TranslatableText>Status:</TranslatableText></span> 
                  <span className={`ml-1 font-semibold ${
                    result.health_assessment?.status === 'Good' ? 'text-green-600' : 
                    result.health_assessment?.status === 'Disease Detected' ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
                    {result.health_assessment?.status || 'Unknown'}
                  </span>
                </p>
                {result.health_assessment?.diseases && result.health_assessment.diseases.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium text-red-700"><TranslatableText>Disease Found:</TranslatableText></span>
                    <ul className="list-disc list-inside ml-2">
                      {result.health_assessment.diseases.map((disease, index) => (
                        <li key={index} className="text-red-600 font-medium">{disease}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.health_assessment?.treatment && result.health_assessment.treatment !== 'No treatment needed' && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <span className="font-medium text-blue-800"><TranslatableText>Treatment:</TranslatableText></span>
                    <p className="text-sm text-blue-700 mt-1">{result.health_assessment.treatment}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              <TranslatableText>Care Recommendations</TranslatableText>
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">
                <span className="font-medium"><TranslatableText>Watering:</TranslatableText></span> {result.care_recommendations?.watering || 'Regular watering as needed'}
              </p>
              <p className="mb-2">
                <span className="font-medium"><TranslatableText>Fertilizer:</TranslatableText></span> {result.care_recommendations?.fertilizer || 'Standard fertilizer appropriate for plant type'}
              </p>
              <p>
                <span className="font-medium"><TranslatableText>Pest Control:</TranslatableText></span> {result.care_recommendations?.pest_control || 'Monitor regularly for pests'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <TranslatableText>
                For more accurate results, ensure your photo is clear, well-lit, and focuses on the plant. 
                You can also use the Disease Detection feature for specific plant health issues.
              </TranslatableText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;