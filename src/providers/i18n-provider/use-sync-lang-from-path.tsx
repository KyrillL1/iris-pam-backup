import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fallbackLng, languages } from "@providers/i18n-provider/settings";

export function useSyncLangFromPath() {
    const pathname = usePathname();
    const { i18n } = useTranslation();

    useEffect(() => {
        if (!pathname) return;

        const segments = pathname.split("/");
        const prefix = segments[1]; // /en/employees → "en"

        if (languages.includes(prefix) && i18n.language !== prefix) {
            i18n.changeLanguage(prefix);
        } else if (!languages.includes(prefix)) {
            i18n.changeLanguage(fallbackLng);
        }
    }, []);
}
