import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import TranslatableText from '../components/TranslatableText';
import MainLayout from '../components/MainLayout';
import weatherIcon from '../assets/weather.png';
import ecommerceIcon from '../assets/ecommerce.png';
import diseasesIcon from '../assets/diseases.png';
import coldStorageIcon from '../assets/Cold Storage.png';
import learningsIcon from '../assets/learnings.png';
import loanIcon from '../assets/loan.png';
import newsIcon from '../assets/Latest news.png';
import homeIcon from '../assets/home.png';
import Ramesh from '../assets/Ramesh.png';
import Kalpana from '../assets/Kalpana.png';
import Jayesh from '../assets/Jayesh.png';
import Bhavna from '../assets/Bhavna.png';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const [currentLang, setCurrentLang] = useState('en');

  const getText = (en, hi, mr) => {
    if (currentLang === 'hi') return hi;
    if (currentLang === 'mr') return mr;
    return en;
  };

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    changeLanguage(lang);
  };

  const keyFeatures = [
    {
      icon: weatherIcon,
      title: getText('Weather Forecast', 'मौसम पूर्वानुमान', 'हवामान अंदाज'),
      description: getText(
        'Stay updated with real-time weather alerts',
        'वास्तविक समय के मौसम अलर्ट के साथ अपडेट रहें',
        'वास्तविक वेळेच्या हवामान सूचनांसह अपडेट रहा'
      ),
      path: '/weather'
    },
    {
      icon: ecommerceIcon,
      title: getText('E-commerce', 'ई-कॉमर्स', 'ई-कॉमर्स'),
      description: getText(
        'Buy seeds, fertilizers or sell your produce',
        'बीज, उर्वरक खरीदें या अपनी उपज बेचें',
        'बियाणे, खते खरेदी करा किंवा तुमची उत्पादने विका'
      ),
      path: '/ecommerce'
    },
    {
      icon: diseasesIcon,
      title: getText('Disease Detection', 'रोग निदान', 'रोग निदान'),
      description: getText(
        'Identify plant diseases with AI',
        'AI के साथ पौधों की बीमारियों की पहचान करें',
        'AI सह वनस्पतींच्या रोगांची ओळख करा'
      ),
      path: '/diagnosis'
    },
    {
      icon: coldStorageIcon,
      title: getText('Cold Storage', 'कोल्ड स्टोरेज', 'कोल्ड स्टोरेज'),
      description: getText(
        'Find nearby cold storage facilities',
        'नजदीकी कोल्ड स्टोरेज सुविधाएं खोजें',
        'जवळपासच्या कोल्ड स्टोरेज सुविधा शोधा'
      ),
      path: '/cold-storage'
    },
    {
      icon: learningsIcon,
      title: getText('Learning Hub', 'शिक्षा केंद्र', 'शिक्षण केंद्र'),
      description: getText(
        'Learn agricultural techniques and best practices',
        'कृषि तकनीकों और सर्वोत्तम प्रथाओं को सीखें',
        'कृषी तंत्रे आणि सर्वोत्तम पद्धती शिका'
      ),
      path: '/learn'
    },
    {
      icon: loanIcon,
      title: getText('Agricultural Loans', 'कृषि ऋण', 'कृषी कर्ज'),
      description: getText(
        'Apply for agricultural loans at low interest rates',
        'कम ब्याज दरों पर कृषि ऋण के लिए आवेदन करें',
        'कमी व्याजदरांवर कृषी कर्जासाठी अर्ज करा'
      ),
      path: '/loans'
    },
    {
      icon: newsIcon,
      title: getText('Agricultural News', 'कृषि समाचार', 'कृषी बातम्या'),
      description: getText(
        'Get latest agricultural news and market updates',
        'नवीनतम कृषि समाचार और बाजार अपडेट प्राप्त करें',
        'नवीनतम कृषी बातम्या आणि बाजार अपडेट मिळवा'
      ),
      path: '/news'
    },
    {
      icon: homeIcon,
      title: getText('Expert Consultation', 'विशेषज्ञ सलाह', 'तज्ञ सल्ला'),
      description: getText(
        'Connect with agricultural experts via video call',
        'वीडियो कॉल के माध्यम से कृषि विशेषज्ञों से जुड़ें',
        'व्हिडिओ कॉलद्वारे कृषी तज्ञांशी संपर्क साधा'
      ),
      path: '/expert'
    }
  ];

  const successStories = [
    {
      name: getText('Ramesh Patel', 'रमेश पटेल', 'रमेश पटेल'),
      image: Ramesh,
      story: getText(
        'Increased crop yield by 30% using weather forecasting',
        'मौसम पूर्वानुमान का उपयोग करके फसल की पैदावार में 30% की वृद्धि हुई',
        'हवामान अंदाजाचा वापर करून पिकाचे उत्पादन 30% वाढवले'
      )
    },
    {
      name: getText('Kalpana Sharma', 'कल्पना शर्मा', 'कल्पना शर्मा'),
      image: Kalpana,
      story: getText(
        'Increased income by 40% through e-commerce platform',
        'ई-कॉमर्स प्लेटफॉर्म के माध्यम से आय में 40% की वृद्धि हुई',
        'ई-कॉमर्स प्लॅटफॉर्मद्वारे उत्पन्नात 40% वाढ झाली'
      )
    },
    {
      name: getText('Jayesh Patil', 'जयेश पाटील', 'जयेश पाटील'),
      image: Jayesh,
      story: getText(
        'Reduced crop loss by 50% using AI disease detection',
        'AI रोग निदान का उपयोग करके फसल के नुकसान को 50% तक कम किया',
        'AI रोग निदानाचा वापर करून पिकाचे नुकसान 50% कमी केले'
      )
    },
    {
      name: getText('Bhavna Desai', 'भावना देसाई', 'भावना देसाई'),
      image: Bhavna,
      story: getText(
        'Reduced crop wastage by 60% using cold storage facilities',
        'कोल्ड स्टोरेज सुविधाओं का उपयोग करके फसल की बर्बादी को 60% तक कम किया',
        'कोल्ड स्टोरेज सुविधांचा वापर करून पिकाचा अपव्यय 60% कमी केला'
      )
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-green-800">
              {getText('Welcome to KrishiMitra', 'कृषिमित्र में आपका स्वागत है', 'कृषिमित्रात तुमचे स्वागत आहे')}
            </h1>
            
            {/* Language Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-white border-2 border-green-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
          </div>
          <p className="text-gray-600 text-center">
            {getText(
              'Empowering farmers with technology and knowledge',
              'प्रौद्योगिकी और ज्ञान के साथ किसानों को सशक्त बनाना',
              'तंत्रज्ञान आणि ज्ञानाने शेतकऱ्यांना सशक्त करणे'
            )}
          </p>
        </div>

        {/* Key Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            {getText('Our Features', 'हमारी सुविधाएं', 'आमची वैशिष्ट्ये')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => (
              <div 
                key={index}
                onClick={() => {
                  console.log('Navigating to:', feature.path);
                  navigate(feature.path);
                }}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-green-100"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <img src={feature.icon} alt={feature.title} className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-center text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            {getText('Success Stories', 'सफलता की कहानियां', 'यशोगाथा')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">{story.name}</h3>
                <p className="text-gray-600 text-center text-sm">{story.story}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {getText(
              'Ready to Transform Your Farming?',
              'अपनी खेती को बदलने के लिए तैयार हैं?',
              'तुमची शेती बदलण्यासाठी तयार आहात?'
            )}
          </h2>
          <p className="text-gray-600 mb-6">
            {getText(
              'Join thousands of farmers who are already using KrishiBandhu to improve their agricultural practices.',
              'हजारों किसानों के साथ जुड़ें जो पहले से ही अपनी कृषि प्रथाओं को बेहतर बनाने के लिए कृषिबंधु का उपयोग कर रहे हैं।',
              'हजारो शेतकऱ्यांसोबत सामील व्हा जे आधीच त्यांच्या कृषी पद्धती सुधारण्यासाठी कृषिमित्राचा वापर करत आहेत।'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {getText('Start Free Trial', 'मुफ्त परीक्षण शुरू करें', 'मोफत चाचणी सुरू करा')}
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-transparent border-2 border-green-600 hover:bg-green-600 hover:text-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              {getText('Contact Us', 'संपर्क करें', 'संपर्क साधा')}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;