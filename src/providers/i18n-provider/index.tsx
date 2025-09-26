import { I18nProvider } from "@refinedev/core";
import { usePathname, useRouter } from "next/navigation";

export const i18nProvider: I18nProvider = {
    translate: (key: string, params?: Record<string, unknown>) => {
        const [namespace, innerKey] = key.split(".");
        // TODO
        return "hi";
    },
    changeLocale: (lang: string) => {
        // TODO:
    },
    getLocale: () => {
        // TODO
        return "en";
    },
};
