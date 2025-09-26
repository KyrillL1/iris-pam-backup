// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultNS, fallbackLng, languages } from "./settings";

export const initI18n = (lang: string) => {
    if (!i18n.isInitialized) {
        i18n.use(initReactI18next).init({
            supportedLngs: languages,
            fallbackLng,
            lng: lang, // <- initial language
            fallbackNS: defaultNS,
        });
    }
    return i18n;
};
