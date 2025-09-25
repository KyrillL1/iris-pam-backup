import { I18nProvider } from "@refinedev/core";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

i18n.use(initReactI18next).init({
    lng: "en",
    resources: {},
    supportedLngs: ["en", "pt"],
    fallbackLng: ["en", "pt"],
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

    return i18nProvider;
}

export default i18n;
