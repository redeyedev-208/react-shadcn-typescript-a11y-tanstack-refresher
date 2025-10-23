import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from './language-context';

// Languages that use RTL (Right-to-Left) writing
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isRTL, setIsRTL] = useState(RTL_LANGUAGES.includes(i18n.language));

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      setIsRTL(RTL_LANGUAGES.includes(lang));
    } catch (error) {
      console.error('LanguageContext: Error changing language:', error);
    }
  };

  useEffect(() => {
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
