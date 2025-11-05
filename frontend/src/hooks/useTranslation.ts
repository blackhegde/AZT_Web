import { useState, useEffect, useCallback } from 'react';
import { translations, Language, TranslationKey } from '../locales';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');

  // Lấy ngôn ngữ từ localStorage khi khởi tạo
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Hàm dịch
  const t = useCallback((key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key; // Trả về key gốc nếu không tìm thấy
  }, [language]);

  // Đổi ngôn ngữ
  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  }, []);

  return {
    t,
    language,
    changeLanguage,
  };
};