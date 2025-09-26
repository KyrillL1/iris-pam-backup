import { I18nProvider } from "@refinedev/core";
import { usePathname, useRouter } from "next/navigation";
import { initReactI18next, useTranslation } from "react-i18next";
import { fallbackLng, languages } from "./settings";
import i18n from "i18next";

i18n.init({
    resources: {},
    lng: fallbackLng,
    supportedLngs: languages,
});
i18n.use(initReactI18next);

export function usei18NProvider(initialLang: string) {
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();

    i18n.changeLanguage(initialLang);

    const i18nProvider: I18nProvider = {
        translate: (key: string, params?: Record<string, unknown> | string) => {
            const fallback = typeof params === "string" ? params : key;

            return t(key, { defaultValue: fallback }); // TODO: Fix
            /**
             * react-i18next:: useTranslation: You will need to pass in an i18next instance by using initReactI18next
             */
        },
        changeLocale: (lang: string) => {
            if (!languages.includes(lang)) {
                console.error("Missing lang: ", lang);
                return;
            }

            // Remove the old locale prefix and replace with new one
            const segments = pathname.split("/");
            segments[1] = lang; // assumes your first path segment is locale
            const newPath = segments.join("/") || "/";
            router.replace(newPath);
            i18n.changeLanguage(lang);
        },
        getLocale: () => {
            return i18n.language;
        },
    };

    return {
        i18nProvider,
    };
}
