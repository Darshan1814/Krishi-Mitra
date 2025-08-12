import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText } from '../utils/translationService';
import { useAuth } from './AuthContext';

// Language options
export const LANGUAGES = {
  ENGLISH: { code: 'en', name: 'English' },
  HINDI: { code: 'hi', name: 'हिंदी' }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { user, updateLanguage } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.ENGLISH);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize language from user preferences
  useEffect(() => {
    if (user?.languagePreference) {
      const userLang = Object.values(LANGUAGES).find(lang => lang.code === user.languagePreference);
      if (userLang) {
        setCurrentLanguage(userLang);
      }
    }
  }, [user]);

  // Change language function
  const changeLanguage = async (language) => {
    setIsLoading(true);
    setCurrentLanguage(language);
    
    // Update user preference if logged in
    if (user) {
      await updateLanguage(language.code);
    }
    
    // Store in local storage for persistence
    localStorage.setItem('preferredLanguage', language.code);
    
    setIsLoading(false);
  };

  // Translate function
  const translate = async (text, targetLang = currentLanguage.code) => {
    // Return original text if it's English and target is English
    if (targetLang === 'en') return text;
    
    // Check if translation already exists in cache
    const cacheKey = `${text}_${targetLang}`;
    if (translations[cacheKey]) return translations[cacheKey];
    
    try {
      const translated = await translateText(text, targetLang);
      
      // Update cache
      setTranslations(prev => ({
        ...prev,
        [cacheKey]: translated
      }));
      
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    isLoading,
    LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;