import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enLang from "./locales/en/en.json";
import esLang from "./locales/es/es.json";

const resources = {
  en: {
    translation: enLang
  },
  es: {
    translation: esLang
  }
};

i18n
  .use(LanguageDetector) // Usa el detector de idioma del navegador
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // Idioma de respaldo

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;