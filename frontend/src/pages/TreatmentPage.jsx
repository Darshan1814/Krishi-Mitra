import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Leaf, AlertCircle, Check, ArrowLeft, Download, Share2, Printer, Droplets, Sun, Wind, ThermometerSun } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const TreatmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [treatment, setTreatment] = useState(null);
  const [error, setError] = useState(null);

  // Get diagnosis data from location state or use sample data
  const diagnosisData = location.state?.diagnosisData || {
    plantName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    disease: 'Early Blight',
    confidence: 0.92,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  };

  // Sample treatment data (in a real app, this would come from the backend)
  const sampleTreatment = {
    overview: "Early Blight is a fungal disease caused by Alternaria solani. It affects tomato plants, causing leaf spots, stem cankers, and fruit rot. The disease can significantly reduce crop yield if not treated promptly.",
    symptoms: [
      "Brown or black spots on leaves with concentric rings (target-like appearance)",
      "Yellowing of leaves around the spots",
      "Spots may merge as disease progresses",
      "Lower/older leaves are affected first",
      "Stems can develop dark, sunken cankers",
      "Fruits may develop dark, leathery spots"
    ],
    treatments: [
      {
        type: "Organic",
        methods: [
          "Remove and destroy infected plant parts",
          "Apply neem oil spray (15ml per liter of water) every 7-10 days",
          "Spray copper-based fungicides like Bordeaux mixture",
          "Apply compost tea as a preventative measure"
        ]
      },
      {
        type: "Chemical",
        methods: [
          "Apply chlorothalonil-based fungicides (follow label instructions)",
          "Use mancozeb fungicides for severe infections",
          "Alternate between different fungicides to prevent resistance"
        ]
      }
    ],
    prevention: [
      "Practice crop rotation (avoid planting tomatoes in the same location for 2-3 years)",
      "Ensure proper spacing between plants for good air circulation",
      "Water at the base of plants, avoiding wetting the foliage",
      "Use mulch to prevent soil splash onto leaves",
      "Choose resistant varieties when available"
    ],
    environmentalFactors: {
      temperature: "Warm (24-29°C)",
      humidity: "High humidity promotes disease development",
      rainfall: "Frequent rain or overhead irrigation increases risk"
    }
  };

  useEffect(() => {
    const fetchTreatment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, you would fetch this from your backend
        // const response = await api.post('/treatment', { disease: diagnosisData.disease });
        // setTreatment(response.data);
        
        // Using sample data for now
        setTimeout(() => {
          setTreatment(sampleTreatment);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching treatment:', err);
        setError('Failed to fetch treatment information. Please try again.');
        setLoading(false);
      }
    };
    
    fetchTreatment();
  }, [diagnosisData.disease]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            <TranslatableText>Treatment Recommendations</TranslatableText>
          </h1>
        </div>

        {/* Diagnosis Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={diagnosisData.image} 
                alt={diagnosisData.disease} 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  <TranslatableText>{diagnosisData.disease}</TranslatableText>
                </h2>
                <p className="text-gray-600">
                  <TranslatableText>Detected on {diagnosisData.plantName}</TranslatableText>
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">
                <TranslatableText>Scientific Name</TranslatableText>
              </p>
              <p className="text-gray-800 italic">{diagnosisData.scientificName}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">
                <TranslatableText>Confidence</TranslatableText>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${diagnosisData.confidence * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">
                {Math.round(diagnosisData.confidence * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              <TranslatableText>Loading treatment recommendations...</TranslatableText>
            </p>
          </div>
        )}

        {/* Error State */}
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

        {/* Treatment Content */}
        {treatment && !loading && (
          <div className="space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <TranslatableText>Disease Overview</TranslatableText>
              </h2>
              <p className="text-gray-600">
                <TranslatableText>{treatment.overview}</TranslatableText>
              </p>
            </div>

            {/* Environmental Factors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <TranslatableText>Environmental Factors</TranslatableText>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <ThermometerSun className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">
                      <TranslatableText>Temperature</TranslatableText>
                    </p>
                    <p className="text-gray-600 text-sm">
                      <TranslatableText>{treatment.environmentalFactors.temperature}</TranslatableText>
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <Droplets className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">
                      <TranslatableText>Humidity</TranslatableText>
                    </p>
                    <p className="text-gray-600 text-sm">
                      <TranslatableText>{treatment.environmentalFactors.humidity}</TranslatableText>
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <Wind className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">
                      <TranslatableText>Rainfall</TranslatableText>
                    </p>
                    <p className="text-gray-600 text-sm">
                      <TranslatableText>{treatment.environmentalFactors.rainfall}</TranslatableText>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <TranslatableText>Symptoms</TranslatableText>
              </h2>
              <ul className="space-y-2">
                {treatment.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">
                      <TranslatableText>{symptom}</TranslatableText>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                <TranslatableText>Treatment Methods</TranslatableText>
              </h2>
              
              <div className="space-y-6">
                {treatment.treatments.map((treatmentMethod, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                      <Leaf className="w-5 h-5 text-green-600 mr-2" />
                      <TranslatableText>{treatmentMethod.type} Treatment</TranslatableText>
                    </h3>
                    <ul className="space-y-2 ml-7">
                      {treatmentMethod.methods.map((method, methodIndex) => (
                        <li key={methodIndex} className="flex items-start">
                          <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-gray-700">
                            <TranslatableText>{method}</TranslatableText>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Prevention */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <TranslatableText>Prevention</TranslatableText>
              </h2>
              <ul className="space-y-2">
                {treatment.prevention.map((prevention, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">
                      <TranslatableText>{prevention}</TranslatableText>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handlePrint}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-5 h-5 mr-2" />
                <TranslatableText>Print Report</TranslatableText>
              </button>
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                <TranslatableText>Download PDF</TranslatableText>
              </button>
              <button className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 mr-2" />
                <TranslatableText>Share</TranslatableText>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <TranslatableText>
                      Disclaimer: This information is provided as general guidance. For severe infestations or uncertain cases, please consult with a local agricultural expert or extension service.
                    </TranslatableText>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPage;