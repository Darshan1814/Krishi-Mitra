import React from 'react';

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-md transition-colors ${
          language === 'en'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-4 py-2 rounded-md transition-colors ${
          language === 'hi'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageToggle;