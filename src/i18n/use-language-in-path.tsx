import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { languages } from "./settings";

export function useLanguageInPath() {
    const pathname = usePathname();

    const pathStartsWithPrefix = useMemo(() => {
        return languages.find((l) => pathname.startsWith(`/${l}`));
    }, [pathname]);

    const isPathAlreadyPrefixed = useCallback((path: string) => {
        if (languages.find((l) => path.startsWith(`/${l}`))) {
            return true;
        }
        return false;
    }, []);

    return {
        pathStartsWithPrefix,
        isPathAlreadyPrefixed,
    };
}
