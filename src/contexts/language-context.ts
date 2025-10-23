import { createContext } from 'react';

export interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);
