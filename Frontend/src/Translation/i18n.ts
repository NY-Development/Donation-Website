import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import am from './locales/am.json';

const savedLanguage = localStorage.getItem('impact:lang') ?? 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am }
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  returnNull: false
});

export default i18n;
