import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        disabled={isLoading}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
          {Object.values(LANGUAGES).map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLanguage.code === language.code
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;