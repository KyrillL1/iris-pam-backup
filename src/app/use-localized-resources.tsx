import { useLocale } from "@i18n/i18n-provider";
import { useMemo } from "react";
import { getResources } from "./resources";

export function useLocalizedResources() {
    const { locale } = useLocale();

    const localizedResources = useMemo(() => {
        const res = getResources();

        const resWithCorrectPaths = res.map((r) => {
            return {
                ...r,
                list: `/${locale}${r.list}`,
                create: `/${locale}${r.create}`,
                edit: `/${locale}${r.edit}`,
                show: `/${locale}${r.show}`,
            };
        });
        return resWithCorrectPaths;
    }, [locale]);

    return {
        localizedResources,
    };
}
