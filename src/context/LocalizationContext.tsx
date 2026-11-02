import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type CurrencyCode,
  type LanguageCode,
  SUPPORTED_LANGUAGES,
} from '../types/i18n';
import {
  getStoredCurrency,
  setStoredCurrency,
  getStoredLanguage,
  setStoredLanguage,
  formatCurrency,
  convertPriceString,
  TRANSLATIONS,
} from '../services/localization';

interface LocalizationContextType {
  currency: CurrencyCode;
  language: LanguageCode;
  setCurrency: (c: CurrencyCode) => void;
  setLanguage: (l: LanguageCode) => void;
  formatPrice: (amountUSD: number) => string;
  convertPrice: (priceStr: string) => string;
  t: (key: string, fallback?: string) => string;
  dir: 'ltr' | 'rtl';
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => getStoredCurrency());
  const [language, setLanguageState] = useState<LanguageCode>(() => getStoredLanguage());

  useEffect(() => {
    // Sync initial HTML document attributes
    const langCfg = SUPPORTED_LANGUAGES[language];
    if (langCfg) {
      document.documentElement.setAttribute('dir', langCfg.dir);
      document.documentElement.setAttribute('lang', langCfg.code);
    }

    const handleCurrencyChange = () => {
      setCurrencyState(getStoredCurrency());
    };
    const handleLanguageChange = () => {
      const nextLang = getStoredLanguage();
      setLanguageState(nextLang);
      const nextCfg = SUPPORTED_LANGUAGES[nextLang];
      if (nextCfg) {
        document.documentElement.setAttribute('dir', nextCfg.dir);
        document.documentElement.setAttribute('lang', nextCfg.code);
      }
    };

    window.addEventListener('diamond_trim_currency_change', handleCurrencyChange);
    window.addEventListener('diamond_trim_language_change', handleLanguageChange);
    window.addEventListener('storage', handleCurrencyChange);
    window.addEventListener('storage', handleLanguageChange);

    return () => {
      window.removeEventListener('diamond_trim_currency_change', handleCurrencyChange);
      window.removeEventListener('diamond_trim_language_change', handleLanguageChange);
      window.removeEventListener('storage', handleCurrencyChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, [language]);

  const changeCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    setStoredCurrency(c);
  };

  const changeLanguage = (l: LanguageCode) => {
    setLanguageState(l);
    setStoredLanguage(l);
  };

  const formatPrice = (amountUSD: number) => {
    return formatCurrency(amountUSD, currency);
  };

  const convertPrice = (priceStr: string) => {
    return convertPriceString(priceStr, currency);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const dir = SUPPORTED_LANGUAGES[language]?.dir || 'ltr';

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        language,
        setCurrency: changeCurrency,
        setLanguage: changeLanguage,
        formatPrice,
        convertPrice,
        t,
        dir,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
