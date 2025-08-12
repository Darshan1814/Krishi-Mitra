import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, Loader, Volume2, Lightbulb } from 'lucide-react';
import { detectDisease, getSolution } from '../services/mlService';

const DiagnosisPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [language, setLanguage] = useState('en');
  const fileInputRef = useRef(null);

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setResult(null);
      setSolution(null);
      setShowSolution(false);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    
    try {
      const response = await detectDisease(image);
      if (response.success) {
        setResult(response);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSolutionHandler = async () => {
    if (!result) return;
    
    setSolutionLoading(true);
    
    try {
      const data = await getSolution(result.data?.disease_name || result.prediction);
      if (data.success) {
        setSolution(data.solution);
        setShowSolution(true);
      }
    } catch (error) {
      console.error('Solution error:', error);
    } finally {
      setSolutionLoading(false);
    }
  };

  const speakText = (text, lang = 'en') => {
    if (!('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const speakDiagnosis = () => {
    if (!result) return;
    
    let text = '';
    if (language === 'hi') {
      text = `पौधे की जांच पूरी हुई। ${result.data?.disease_detected ? 'बीमारी मिली' : 'पौधा स्वस्थ है'}। ${result.data?.disease_name || result.prediction}। ${result.data?.treatment_solution || ''}`;
    } else {
      text = `Plant diagnosis completed. ${result.data?.disease_detected ? 'Disease detected' : 'Plant appears healthy'}. ${result.data?.disease_name || result.prediction}. ${result.data?.treatment_solution || ''}`;
    }
    
    speakText(text, language);
  };

  const speakSolution = () => {
    if (!solution) return;
    speakText(solution, language);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Plant Disease Diagnosis</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border-2 border-green-300 px-4 py-2 rounded-lg"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
        <p className="text-gray-600">Upload a photo of your plant to identify diseases and get treatment recommendations</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          {preview ? (
            <div className="mb-4">
              <img src={preview} alt="Plant preview" className="max-h-64 mx-auto rounded-lg" />
            </div>
          ) : (
            <div className="py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-2">Click to select or drag and drop an image</p>
              <p className="text-sm text-gray-500">Supported: JPG, PNG, JPEG</p>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageCapture}
            className="hidden"
          />
        </div>

        {preview && (
          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Plant
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">🌱 Plant Analysis Results</h2>
            </div>
            <button
              onClick={speakDiagnosis}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
              title={`Listen in ${language === 'hi' ? 'Hindi' : 'English'}`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className={`mb-6 p-6 rounded-lg border-2 ${
            result.data?.disease_detected ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <h3 className={`font-bold text-xl mb-3 ${
              result.data?.disease_detected ? 'text-red-800' : 'text-green-800'
            }`}>
              🔍 Disease Identification:
            </h3>
            <p className={`text-lg font-semibold ${
              result.data?.disease_detected ? 'text-red-700' : 'text-green-700'
            }`}>
              {result.data?.disease_name || result.prediction}
            </p>
            {result.confidence && (
              <p className="text-sm text-gray-600 mt-2">
                Confidence: {Math.round(result.confidence * 100)}%
              </p>
            )}
          </div>

          {result.data?.symptoms && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">👁️ Symptoms Observed:</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-gray-700">{result.data.symptoms}</p>
              </div>
            </div>
          )}

          {result.data?.treatment_solution && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">💊 Treatment Solution:</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">{result.data.treatment_solution}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={getSolutionHandler}
              disabled={solutionLoading}
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              {solutionLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Getting Solution...
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Get Solution
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showSolution && solution && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">💡 Treatment Solution</h2>
            <button
              onClick={speakSolution}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
              title={`Listen in ${language === 'hi' ? 'Hindi' : 'English'}`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="whitespace-pre-line text-gray-700">{solution}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisPage;