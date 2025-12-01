import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en from '../i18n/en.json';
import kn from '../i18n/kn.json';

const translations = { en, kn };

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  t: (key: string, params?: Record<string, string>) => string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'en' || saved === 'kn') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'kn' : 'en');
  };

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') return key;

    if (params) {
      Object.keys(params).forEach(k => {
        value = value.replace(`{{${k}}}`, params[k]);
      });
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};