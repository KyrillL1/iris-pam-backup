"use client";

import i18next from "i18next";
import React, { PropsWithChildren } from "react";
import {
    initReactI18next,
    useTranslation as useTranslationi18next,
    UseTranslationOptions,
} from "react-i18next";
import { fallbackLng, languages } from "./settings";
import { usePathname, useRouter } from "next/navigation";
import refineMsgEn from "./refine-messages.en.json";
import refineMsgPt from "./refine-messages.pt.json";

i18next
    .use(initReactI18next)
    .init({
        // debug: true,
        supportedLngs: languages,
        fallbackLng,
        lng: undefined,
        preload: languages,
        resources: {
            en: { refine: refineMsgEn },
            pt: { refine: refineMsgPt },
        },
        defaultNS: "refine",
    });

export const I18NProvider: React.FC<
    PropsWithChildren & { initialLang: string }
> = ({ children, initialLang }) => {
    i18next.language !== initialLang && i18next.changeLanguage(initialLang);

    return children;
};

export function useLocale() {
    const router = useRouter();
    const pathname = usePathname();
    return {
        locale: i18next.language,
        changeLocale: (lang: string) => {
            if (!lang || lang === i18next.language) return;

            // 1. Change i18next language
            i18next.changeLanguage(lang);

            // 2. Update the path prefix
            // Extract current path without old language
            const segments = pathname.split("/").filter(Boolean);

            // Remove old locale prefix if it exists
            if (segments.length && languages.includes(segments[0])) {
                segments.shift();
            }

            // Add new locale prefix
            const newPath = `/${lang}/${segments.join("/")}`;

            // Navigate to the new URL (preserves query params automatically)
            router.replace(newPath);
        },
    };
}

export function useTranslation(
    ns?: string,
    options?: UseTranslationOptions<any>,
) {
    return useTranslationi18next(ns, options);
}

export const myI18n = i18next;
