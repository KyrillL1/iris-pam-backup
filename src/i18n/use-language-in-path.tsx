import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { languages } from "./settings";

export function useLanguageInPath() {
    const pathname = usePathname();

    const pathStartsWithPrefix = useMemo(() => {
        return languages.find((l) => pathname.startsWith(`/${l}`));
    }, [pathname]);

    return {
        pathStartsWithPrefix,
    };
}
