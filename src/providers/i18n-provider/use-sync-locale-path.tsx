import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { languages } from "./settings";
import { useTranslation } from "react-i18next";

export function useSyncLocalePath() {
    const { i18n } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams()?.toString() ?? "";

    useEffect(() => {
        if (!pathname) return;

        const currentPrefix = languages.find((l) =>
            pathname.startsWith(`/${l}`)
        );

        // Only update if the user actively changed the locale
        if (i18n.language && currentPrefix && currentPrefix !== i18n.language) {
            const cleanPath = pathname.replace(`/${currentPrefix}`, "");
            const newPath = `/${i18n.language}${cleanPath}${
                search ? `?${search}` : ""
            }`;
            router.replace(newPath);
        }
    }, [i18n.language, pathname, search, router]);
}
