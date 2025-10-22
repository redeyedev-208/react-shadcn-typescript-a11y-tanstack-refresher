import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Languages that use RTL (Right-to-Left) writing
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isRTL, setIsRTL] = useState(RTL_LANGUAGES.includes(i18n.language));

  console.log('LanguageProvider: Current language is', currentLanguage);

  const changeLanguage = async (lang: string) => {
    console.log('LanguageContext: Changing language from', currentLanguage, 'to', lang);
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      setIsRTL(RTL_LANGUAGES.includes(lang));
      console.log('LanguageContext: Language changed to', lang);
    } catch (error) {
      console.error('LanguageContext: Error changing language:', error);
    }
  };

  useEffect(() => {
    console.log('LanguageProvider: Effect running for language', currentLanguage, 'RTL:', isRTL);
    // Update document direction and language attributes
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Update body class for styling
    document.body.className = document.body.className
      .replace(/\b(rtl|ltr)\b/g, '')
      .trim();
    document.body.classList.add(isRTL ? 'rtl' : 'ltr');
  }, [currentLanguage, isRTL]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};