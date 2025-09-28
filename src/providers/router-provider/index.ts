import {
    matchResourceFromRoute,
    ParseResponse,
    ResourceContext,
    RouterProvider,
} from "@refinedev/core";
import routerProviderRefine, {
    paramsFromCurrentPath,
} from "@refinedev/nextjs-router/app";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { useContext } from "react";
import qs from "qs";
import { languages } from "@i18n/settings";

function convertToNumberIfPossible(input: string): number | null {
    return isNaN(Number(input)) ? null : Number(input);
}

export const routerProvider: RouterProvider = {
    ...routerProviderRefine,
    parse: () => {
        /**
         * As we use internal rewrites in next middleware to "ignore"
         * the locale prefix, we need to make sure that refine fetches resources properly too
         */
        let pathname = usePathname();

        const pathHasLocalePrefix = languages.find((loc) =>
            pathname.startsWith(`/${loc}`)
        );
        if (pathHasLocalePrefix) {
            pathname = pathname.replace(`/${pathHasLocalePrefix}`, "");
        }

        /**
         * Rest below here stays the same
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
