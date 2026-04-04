import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from './constants/appConstants';
import { STORAGE_KEYS } from './constants/storageKeys';
import en from './i18n/en.json';
import es from './i18n/es.json';

const {
  LANGUAGE: STORAGE_KEY,
  LEGACY_LANGUAGE: LEGACY_STORAGE_KEY
} = STORAGE_KEYS;
const SUPPORTED_LANGUAGES = ['en', 'es'];

function detectInitialLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    return savedLanguage;
  }

  return DEFAULT_LANGUAGE;
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    lng: detectInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

i18n.on('languageChanged', (language) => {
  localStorage.setItem(STORAGE_KEY, language);
  localStorage.setItem(LEGACY_STORAGE_KEY, language);
});

export default i18n;
