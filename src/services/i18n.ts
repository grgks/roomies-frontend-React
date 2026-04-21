import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import el from '../locales/el.json';
import en from '../locales/en.json';

i18n
    .use(LanguageDetector) // auto detects browser default language
    .use(initReactI18next)
    .init({
        resources: {
            el: { translation: el },
            en: { translation: en },
        },
        fallbackLng: 'el', // if don't find language picks el(greek)
        interpolation: {
            escapeValue: false, //  React already  escapes values
        },
    });

export default i18n;