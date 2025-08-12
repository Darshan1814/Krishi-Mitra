import React, { useState } from 'react';
import { X, Play, BookOpen, Volume2, Globe } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const LearnPage = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [modalLanguage, setModalLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const farmingTechniques = [
    {
      id: 1,
      title: 'Drip Irrigation',
      description: 'A method that saves water and nutrients by delivering them directly to plant roots.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      videoId: 'Jj9fGl-IMOU',
      details: {
        en: [
          'A method that delivers water directly to the roots.',
          'Saves water and reduces weed growth.',
          'Improves crop yield with minimal water use.',
          'Ideal for areas with water scarcity.',
          'Delivers fertilizers via pipes (fertigation).',
          'Prevents soil erosion and runoff.'
        ],
        hi: [
          'एक विधि जिसमें पानी सीधे जड़ों तक पहुँचाया जाता है।',
          'पानी की बचत होती है और खरपतवार कम होते हैं।',
          'कम पानी में बेहतर फसल उत्पादन संभव है।',
          'जल की कमी वाले क्षेत्रों के लिए उपयुक्त।',
          'फर्टिगेशन द्वारा उर्वरक भी दिए जाते हैं।',
          'मिट्टी का कटाव और बहाव रोका जा सकता है।'
        ],
        mr: [
          'पाणी थेट मुळांपर्यंत पोहोचवण्याची पद्धत.',
          'पाण्याची बचत होते आणि तण कमी होतात.',
          'कमी पाण्यात चांगले पीक उत्पादन शक्य.',
          'पाण्याची कमतरता असलेल्या भागासाठी योग्य.',
          'फर्टिगेशनद्वारे खत देखील दिले जाते.',
          'मातीची धूप आणि वाहून जाणे थांबवता येते.'
        ]
      }
    },
    {
      id: 2,
      title: 'Crop Rotation',
      description: 'A technique to improve soil health and prevent pests by rotating crops seasonally.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop',
      videoId: 'XeNA6XdMoF8',
      details: {
        en: [
          'Growing different crops in sequence.',
          'Maintains soil nutrients and structure.',
          'Reduces pests and disease buildup.',
          'Improves long-term soil health.',
          'Enhances biodiversity naturally.',
          'Supports sustainable farming.'
        ],
        hi: [
          'विभिन्न फसलें क्रम से उगाने की विधि।',
          'मिट्टी की उर्वरता और संरचना बनी रहती है।',
          'कीट और रोगों की समस्या कम होती है।',
          'दीर्घकालीन मिट्टी स्वास्थ्य सुधरता है।',
          'जैव विविधता को बढ़ावा मिलता है।',
          'यह टिकाऊ खेती में मददगार है।'
        ],
        mr: [
          'वेगवेगळी पिके क्रमाने लावण्याची पद्धत.',
          'मातीची सुपीकता आणि रचना कायम राहते.',
          'कीड आणि रोगांची समस्या कमी होते.',
          'दीर्घकालीन माती आरोग्य सुधारते.',
          'जैव विविधतेला चालना मिळते.',
          'हे टिकाऊ शेतीसाठी उपयुक्त आहे.'
        ]
      }
    },
    {
      id: 3,
      title: 'Hydroponics',
      description: 'Soil-less farming method using nutrient-rich water solutions to grow plants.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      videoId: 'V0BrgBF9IQM',
      details: {
        en: [
          'Farming without soil using water solutions.',
          'Nutrient-rich water feeds plant roots.',
          'Saves space and grows faster crops.',
          'Used in urban and indoor setups.',
          'Requires monitoring of pH and nutrients.',
          'Efficient and clean method.'
        ],
        hi: [
          'मिट्टी के बिना पोषणयुक्त पानी से खेती।',
          'पौधों की जड़ों को सीधे पोषण मिलता है।',
          'कम जगह में तेजी से फसल उत्पादन।',
          'शहरी और इनडोर खेती में उपयोगी।',
          'पीएच और पोषक तत्वों की निगरानी जरूरी।',
          'साफ-सुथरी और कुशल प्रणाली।'
        ]
      }
    },
    {
      id: 4,
      title: 'Vertical Farming',
      description: 'Farming that uses stacked layers to maximize space in urban environments.',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
      videoId: 'goAgDkX1n_I',
      details: {
        en: [
          'Farming in stacked layers to save space.',
          'Commonly done indoors or in greenhouses.',
          'Uses LED lighting and controlled climate.',
          'Ideal for cities and small spaces.',
          'Reduces land use and increases output.',
          'Clean, efficient, and year-round farming.'
        ],
        hi: [
          'परतों में फसल उगाने की तकनीक।',
          'अधिकतर इनडोर या ग्रीनहाउस में होती है।',
          'एलईडी लाइट और नियंत्रित वातावरण उपयोगी।',
          'शहरों और कम जगहों के लिए आदर्श।',
          'भूमि की जरूरत कम और उत्पादन अधिक।',
          'साफ और सालभर खेती करने योग्य।'
        ]
      }
    },
    {
      id: 5,
      title: 'Aeroponics',
      description: 'Growing plants in air using nutrient-rich mist rather than soil.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      videoId: 'JmGJz2McrLk',
      details: {
        en: [
          'Plants grow in air with nutrient mist.',
          'No soil or water tanks needed.',
          'Roots are suspended and sprayed regularly.',
          'Provides high oxygen and nutrient uptake.',
          'Saves 90% more water than soil farming.',
          'Clean, high-tech method.'
        ],
        hi: [
          'पौधे हवा में पोषणयुक्त फुहार से बढ़ते हैं।',
          'मिट्टी या पानी की टंकी की जरूरत नहीं।',
          'जड़ें हवा में लटकती हैं और छिड़काव होता है।',
          'ऑक्सीजन और पोषण का बेहतर अवशोषण।',
          'मिट्टी से 90% अधिक पानी की बचत।',
          'स्वच्छ और उन्नत तकनीक।'
        ]
      }
    },
    {
      id: 6,
      title: 'Aquaponics',
      description: 'A combination of aquaculture (fish farming) and hydroponics to create a symbiotic system.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
      videoId: '1VX0ZVrbWOA',
      details: {
        en: [
          'Combines fish farming and hydroponics.',
          'Fish waste fertilizes the plants.',
          'Plants purify water for the fish.',
          'Creates a natural ecosystem cycle.',
          'No chemical fertilizers are used.',
          'Eco-friendly and productive method.'
        ],
        hi: [
          'मछली पालन और हायड्रोपोनिक्स का मेल।',
          'मछलियों का अपशिष्ट पौधों को पोषण देता है।',
          'पौधे पानी को शुद्ध कर मछलियों को लौटाते हैं।',
          'प्राकृतिक पारिस्थितिकी चक्र बनता है।',
          'रासायनिक उर्वरकों की जरूरत नहीं।',
          'पर्यावरण के अनुकूल और लाभदायक विधि।'
        ]
      }
    },
    {
      id: 7,
      title: 'Mulching',
      description: 'Covering soil to retain moisture, reduce weed growth, and enhance soil quality.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      videoId: 'K6Axeh-1OT8',
      details: {
        en: [
          'Covering soil with organic or plastic layers.',
          'Retains moisture and regulates temperature.',
          'Reduces weeds and prevents erosion.',
          'Improves soil fertility over time.',
          'Common in vegetable farming.',
          'Saves water and labor.'
        ],
        hi: [
          'मिट्टी को प्लास्टिक या जैविक पदार्थ से ढंकना।',
          'नमी बनी रहती है और तापमान नियंत्रित होता है।',
          'खरपतवार कम होते हैं और अपरदन रुकता है।',
          'समय के साथ मिट्टी की उर्वरता बढ़ती है।',
          'सब्जी की खेती में आमतौर पर प्रयोग होता है।',
          'पानी और श्रम दोनों की बचत होती है।'
        ]
      }
    },
    {
      id: 8,
      title: 'Greenhouse Farming',
      description: 'Growing crops in a controlled environment with temperature and humidity regulation.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      videoId: 'RWIo3xdo64g',
      details: {
        en: [
          'Growing crops in protected environments.',
          'Controlled humidity, light, and temperature.',
          'Reduces pests and weather-related damage.',
          'Allows off-season farming.',
          'Used for high-value crops and flowers.',
          'Boosts productivity and consistency.'
        ],
        hi: [
          'संरक्षित वातावरण में फसलें उगाना।',
          'नमी, प्रकाश और तापमान का नियंत्रण।',
          'कीटों और मौसम से नुकसान कम होता है।',
          'मौसम से बाहर भी खेती संभव होती है।',
          'महंगी फसलों और फूलों में उपयोगी।',
          'उत्पादन स्थिर और उच्च होता है।'
        ]
      }
    },
    {
      id: 9,
      title: 'Precision Farming',
      description: 'Using technology like GPS and AI to optimize agricultural decisions and yields.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop',
      videoId: 'nK-xBhqg__M',
      details: {
        en: [
          'Technology-based farming using data.',
          'Uses GPS, sensors, and AI tools.',
          'Optimizes water, fertilizer, and pesticide use.',
          'Reduces waste and maximizes yield.',
          'Real-time monitoring of crops.',
          'Saves money and improves quality.'
        ],
        hi: [
          'डेटा आधारित आधुनिक खेती।',
          'जीपीएस, सेंसर और एआई तकनीक का उपयोग।',
          'पानी, खाद, कीटनाशकों का सही उपयोग।',
          'बर्बादी कम और उत्पादन अधिक।',
          'फसलों की रीयल-टाइम निगरानी होती है।',
          'लागत कम और गुणवत्ता बेहतर होती है।'
        ]
      }
    },
    {
      id: 10,
      title: 'Agroforestry',
      description: 'Integrating trees with crops to enhance biodiversity, reduce erosion, and improve climate resilience.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      videoId: 'q3fCnsN9-84',
      details: {
        en: [
          'Combining agriculture with tree planting.',
          'Improves biodiversity and ecosystem health.',
          'Reduces erosion and restores soil.',
          'Provides wood, fruits, and shade.',
          'Sequesters carbon and combats climate change.',
          'Sustainable land-use model.'
        ],
        hi: [
          'खेती और पेड़ लगाना एक साथ।',
          'जैव विविधता और पर्यावरण को लाभ।',
          'मृदा अपरदन कम और सुधार होता है।',
          'लकड़ी, फल और छाया भी मिलती है।',
          'कार्बन अवशोषण से जलवायु बदलाव से लड़ाई।',
          'टिकाऊ भूमि उपयोग प्रणाली।'
        ]
      }
    },
    {
      id: 11,
      title: 'Permaculture Farming',
      description: 'Sustainable agriculture mimicking natural ecosystems for long-term benefits.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop',
      videoId: 'ZQKaFJ8FgSY',
      details: {
        en: [
          'Farming inspired by natural ecosystems.',
          'Mimics forests and nature for food systems.',
          'Requires low input, high sustainability.',
          'Focuses on soil, water, and biodiversity.',
          'Creates self-sufficient farm designs.',
          'Long-term ecological balance.'
        ],
        hi: [
          'प्राकृतिक पारिस्थितिक तंत्र से प्रेरित खेती।',
          'जंगलों जैसे पर्यावरण को अनुकरण करती है।',
          'कम संसाधनों में अधिक स्थायित्व।',
          'मिट्टी, जल और जैव विविधता पर ध्यान।',
          'स्वनिर्भर खेत की रचना की जाती है।',
          'दीर्घकालिक पर्यावरण संतुलन संभव।'
        ]
      }
    }
  ];

  const openModal = (technique) => {
    setSelectedTechnique(technique);
    setModalLanguage('en');
  };

  const closeModal = () => {
    setSelectedTechnique(null);
  };

  const speakText = (text, language = modalLanguage) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && !isPaused) {
        speechSynthesis.pause();
        setIsPaused(true);
        return;
      }
      
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (language === 'mr') {
        utterance.lang = 'mr-IN';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const speakCardText = (technique) => {
    const text = `${technique.title}. ${technique.description}`;
    speakText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-green-800 text-center mb-4">
            <TranslatableText>Modern Farming Techniques</TranslatableText>
          </h1>
          <p className="text-gray-600 text-center">
            <TranslatableText>Discover innovative farming methods to improve productivity, sustainability, and crop yields</TranslatableText>
          </p>
        </div>

        {/* Techniques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmingTechniques.map((technique) => (
            <div key={technique.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img 
                  src={technique.image} 
                  alt={technique.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  <TranslatableText>{technique.title}</TranslatableText>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  <TranslatableText>{technique.description}</TranslatableText>
                </p>
                
                <div className="flex gap-2">
                  <div className="relative group">
                    <button
                      onClick={() => speakCardText(technique)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Listen'}
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(technique)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    <TranslatableText>Read More</TranslatableText>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTechnique && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  <TranslatableText>{selectedTechnique.title}</TranslatableText>
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <select
                      value={modalLanguage}
                      onChange={(e) => setModalLanguage(e.target.value)}
                      className="bg-white border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी</option>
                      <option value="mr">मराठी</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <button
                      onClick={() => speakText(selectedTechnique.details[modalLanguage].join('. '))}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Listen'} in {modalLanguage === 'hi' ? 'Hindi' : modalLanguage === 'mr' ? 'Marathi' : 'English'}
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  {selectedTechnique.details[modalLanguage].map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                {/* YouTube Video */}
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedTechnique.videoId}`}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg"
                    title={selectedTechnique.title}
                  ></iframe>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    <TranslatableText>Close</TranslatableText>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnPage;