import { I18nProvider } from "@refinedev/core";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function usei18NProvider() {
    const router = useRouter();
    const pathname = usePathname();
    const [locale, setLocale] = useState<string>();

    const i18nProvider: I18nProvider = {
        translate: (key: string, params?: Record<string, unknown> | string) => {
            const fallback = typeof params === "string" ? params : key;

            return fallback;
        },
        changeLocale: (lang: string) => {
            // Remove the old locale prefix and replace with new one
            const segments = pathname.split("/");
            segments[1] = lang; // assumes your first path segment is locale
            const newPath = segments.join("/") || "/";
            router.replace(newPath);
            setLocale(lang);
        },
        getLocale: () => {
            return locale || "?";
        },
    };

    return {
        i18nProvider,
    };
}
