import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enLang from './locales/en/translation.json';
import hiLang from './locales/hi/translation.json';
import frLang from './locales/fr/translation.json';
import grLang from './locales/gr/translation.json';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enLang
            },
            hi: {
                translation: hiLang
            },
            fr: {
                translation: frLang
            },
            gr: {
                translation: grLang
            }
        },
        fallbackLng: 'en',
        debug: false
    });

export default i18n;
