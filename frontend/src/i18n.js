import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './i18n/en.json';
import es from './i18n/es.json';

const STORAGE_KEY = 'lunatierra-language';
const LEGACY_STORAGE_KEY = 'i18nextLng';
const SUPPORTED_LANGUAGES = ['en', 'es'];

function detectInitialLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    return savedLanguage;
  }

  return 'es';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

i18n.changeLanguage(detectInitialLanguage());

i18n.on('languageChanged', (language) => {
  localStorage.setItem(STORAGE_KEY, language);
  localStorage.setItem(LEGACY_STORAGE_KEY, language);
});

export default i18n;
