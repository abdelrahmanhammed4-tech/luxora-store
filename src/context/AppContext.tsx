import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, Language, Currency, TranslationKeys } from '../types';
import { en } from '../locales/en';
import { ar } from '../locales/ar';

interface AppContextProps {
  theme: Theme;
  language: Language;
  t: TranslationKeys;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  isLoading: boolean;
  triggerWelcomeReset: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('luxora_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Luxe default is dark mode
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('luxora_lang');
    if (saved === 'en' || saved === 'ar') return saved;
    return 'en';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('luxora_currency');
    if (saved === 'USD' || saved === 'EUR' || saved === 'AED') return saved;
    return 'USD';
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync theme with document class and local storage
  useEffect(() => {
    localStorage.setItem('luxora_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Sync language with document lang, dir and local storage
  useEffect(() => {
    localStorage.setItem('luxora_lang', language);
    const root = window.document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  // Sync currency with local storage
  useEffect(() => {
    localStorage.setItem('luxora_currency', currency);
  }, [currency]);

  // Handle fake/realistic initial loading progress
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 4200); // Exquisite, smooth 4.2-second transition time for cinematic luxury reveal
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
  };

  const formatPrice = (price: number) => {
    switch (currency) {
      case 'EUR':
        return `€${(price * 0.92).toFixed(2)}`;
      case 'AED':
        return `د.إ${(price * 3.67).toFixed(2)}`;
      case 'USD':
      default:
        return `$${price.toLocaleString()}`;
    }
  };

  const triggerWelcomeReset = () => {
    setIsLoading(true);
  };

  const t = language === 'ar' ? ar : en;

  return (
    <AppContext.Provider
      value={{
        theme,
        language,
        t,
        toggleTheme,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        isLoading,
        triggerWelcomeReset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
