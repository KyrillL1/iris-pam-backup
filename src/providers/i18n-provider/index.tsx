import { I18nProvider } from "@refinedev/core";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { defaultNS, fallbackLng, languages } from "./settings";
import { useParams, usePathname } from "next/navigation";

i18n.use(initReactI18next).init({
    supportedLngs: languages,
    fallbackLng,
    lng: undefined, // let detect the language on client side
    fallbackNS: defaultNS,
});

export function useI18NProvider() {
    const { t, i18n } = useTranslation();

    const i18nProvider: I18nProvider = {
        translate: (key: string, params?: Record<string, unknown>) => {
            const [namespace, innerKey] = key.split(".");
            return t(innerKey, { ns: namespace, ...params });
        },
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    // FIx: So url is synced with language switching

    return i18nProvider;
}

export default i18n;
