import routerProviderOriginal, {
    paramsFromCurrentPath,
} from "@refinedev/nextjs-router";
import { languages } from "@providers/i18n-provider/settings";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext } from "react";
import {
    matchResourceFromRoute,
    ParseResponse,
    ResourceContext,
} from "@refinedev/core";
import React from "react";
import qs from "qs";

function convertToNumberIfPossible(input: string): number | undefined {
    return isNaN(parseInt(input)) ? undefined : parseInt(input);
}

const routerProvider = {
    ...routerProviderOriginal,
    parse: () => {
        /**
         * We need to override the parse to make sure Refine
         * is parsing our pathname without our language prefix
         */
        let pathname = usePathname();
        const lngPrefix = languages.find((l) => pathname?.startsWith(`/${l}`));
        if (lngPrefix) {
            pathname = pathname?.replace(`/${lngPrefix}`, "") || "/";
        }

        /**
         * Swizzled function. Below as original
         */
        const searchParamsObj = useSearchParams();
        const { resources } = useContext(ResourceContext);

        const { resource, action, matchedRoute } = React.useMemo(() => {
            if (!pathname) return { found: false };
            return matchResourceFromRoute(pathname, resources);
        }, [pathname, resources]);

        const inferredParams = matchedRoute && pathname
            ? paramsFromCurrentPath(pathname, matchedRoute)
            : {};

        const inferredId = inferredParams.id;

        const parsedParams = React.useMemo(() => {
            const searchParams = searchParamsObj.toString();
            return qs.parse(searchParams, { ignoreQueryPrefix: true });
        }, [searchParamsObj]);

        const fn = React.useCallback(() => {
            const combinedParams = {
                ...inferredParams,
                ...parsedParams,
            };

            const response: ParseResponse = {
                ...(resource && { resource }),
                ...(action && { action }),
                ...(inferredId && { id: decodeURIComponent(inferredId) }),
                pathname: pathname ? pathname : undefined,
                params: {
                    ...combinedParams,
                    current: convertToNumberIfPossible(
                        combinedParams.current as string,
                    ) as number | undefined,
                    pageSize: convertToNumberIfPossible(
                        combinedParams.pageSize as string,
                    ) as number | undefined,
                    to: combinedParams.to
                        ? decodeURIComponent(combinedParams.to as string)
                        : undefined,
                },
            };

            return response;
        }, [
            pathname,
            parsedParams,
            inferredParams,
            inferredId,
            resource,
            action,
        ]);

        return fn;
    },
};

export default routerProvider;
