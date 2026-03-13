import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en/common.json";
import ro from "@/locales/ro/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,

    resources: {
      en: {
        common: en,
      },
      ro: {
        common: ro,
      },
    },

    ns: ["common"],
    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
