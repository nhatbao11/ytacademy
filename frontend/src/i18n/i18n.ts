import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import vi from './locales/vi.json'
import en from './locales/en.json'

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null
const initialLanguage = savedLanguage && ['vi', 'en'].includes(savedLanguage) ? savedLanguage : 'vi'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    lng: initialLanguage,
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
