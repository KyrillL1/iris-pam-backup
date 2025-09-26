import { I18nProvider } from "@refinedev/core";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { defaultNS, fallbackLng, languages } from "./settings";
import { usePathname, useRouter } from "next/navigation";

i18n.use(initReactI18next).init({
    supportedLngs: languages,
    fallbackLng,
    lng: undefined, // let detect the language on client side
    fallbackNS: defaultNS,
});

export function useI18NProvider() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    const i18nProvider: I18nProvider = {
        translate: (key: string, params?: Record<string, unknown>) => {
            const [namespace, innerKey] = key.split(".");
            return t(innerKey, { ns: namespace, ...params });
        },
        changeLocale: (lang: string) => {
            const segments = pathname.split("/");

            segments[1] = lang; // replace old prefix with new
            const newPath = segments.join("/");

            router.replace(newPath);
            i18n.changeLanguage(lang);
        },
        getLocale: () => i18n.language,
    };

    return i18nProvider;
}

export default i18n;
