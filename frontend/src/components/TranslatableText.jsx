import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TranslatableText = ({ children, className = '' }) => {
  const { translate, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    const translateText = async () => {
      if (typeof children === 'string' && currentLanguage.code !== 'en') {
        const result = await translate(children);
        setTranslatedText(result);
      } else {
        setTranslatedText(children);
      }
    };

    translateText();
  }, [children, currentLanguage, translate]);

  return <span className={className}>{translatedText}</span>;
};

export default TranslatableText;