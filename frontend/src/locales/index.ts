import en from './en.json';
import vi from './vi.json';

export const translations = {
  en,
  vi,
};

export type Language = keyof typeof translations;
export type TranslationKey = string;

export const defaultLanguage: Language = 'en';
export const supportedLanguages: Language[] = ['en', 'vi'];