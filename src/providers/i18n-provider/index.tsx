import { I18nProvider } from "@refinedev/core";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export function usei18NProvider() {
    const t = useTranslations();
    const l = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const i18nProvider: I18nProvider = {
        translate: (key: string, params?: Record<string, unknown>) => {
            return t(key);
        },
        changeLocale: (lang: string) => {
            // Remove the old locale prefix and replace with new one
            const segments = pathname.split("/");
            segments[1] = lang; // assumes your first path segment is locale
            const newPath = segments.join("/") || "/";
            router.replace(newPath);
        },
        getLocale: () => {
            return l;
        },
    };

    return {
        i18nProvider,
    };
}
