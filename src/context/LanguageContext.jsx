import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

const LOCAL_STORAGE_LANG_KEY = 'NIRVOY_APP_LANGUAGE';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_LANG_KEY) || 'bn';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.bn;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
