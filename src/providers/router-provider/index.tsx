import {
    GoConfig,
    matchResourceFromRoute,
    ParseResponse,
    ResourceContext,
    RouterProvider,
} from "@refinedev/core";
import routerProviderRefine, {
    paramsFromCurrentPath,
    stringifyConfig,
} from "@refinedev/nextjs-router/app";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ComponentProps, useEffect } from "react";
import qs from "qs";
import { useContext } from "react";
import { useLanguageInPath } from "@i18n/use-language-in-path";
import { useLocale } from "@i18n/i18n-provider";
import { useLinkStatus } from "next/link";

function convertToNumberIfPossible(input: string): number | null {
    return isNaN(Number(input)) ? null : Number(input);
}

/**
 * Need to override standard router, so parsing and navigating works with locale prefix in path
 */
export const routerProvider: RouterProvider = {
    go() {
        const { push, replace } = useRouter();
        const searchParamsObj = useSearchParams();
        const { locale } = useLocale();
        const { isPathAlreadyPrefixed } = useLanguageInPath();
        const pathname = usePathname();

        const fn = React.useCallback(
            ({
                to,
                type,
                query,
                options: { keepQuery, keepHash } = {},
                hash,
            }: GoConfig) => {
                let urlHash = "";

                if (keepHash && typeof document !== "undefined") {
                    urlHash = document.location.hash;
                }

                if (hash) {
                    urlHash = `#${hash.replace(/^#/, "")}`;
                }

                const urlQuery = {
                    ...(keepQuery
                        ? qs.parse(searchParamsObj.toString(), {
                            ignoreQueryPrefix: true,
                        })
                        : {}),
                    ...query,
                };

                if (urlQuery.to) {
                    urlQuery.to = encodeURIComponent(`${urlQuery.to}`);
                }

                const cleanPathname = pathname?.split("?")[0].split("#")[0] ??
                    "";

                /**
                 * Need to insert correct locale here too
                 */

                let urlTo = to || cleanPathname;

                if (!isPathAlreadyPrefixed(urlTo)) {
                    urlTo = `/${locale}${urlTo}`;
                }

                /**
                 * Rest as original
                 */

                const hasUrlHash = urlHash.length > 1;
                const hasUrlQuery = Object.keys(urlQuery).length > 0;

                const fullPath = `${urlTo}${
                    hasUrlQuery ? qs.stringify(urlQuery, stringifyConfig) : ""
                }${hasUrlHash ? urlHash : ""}`;

                if (type === "path") {
                    return fullPath;
                }

                if (type === "replace") {
                    replace(fullPath);
                } else {
                    push(fullPath);
                }

                return undefined;
            },
            [searchParamsObj, push, replace, locale, pathname],
        );

        return fn;
    },
    parse() {
        const { pathStartsWithPrefix } = useLanguageInPath();
        const _pathname = usePathname();
        /**
         * We need to override, so it doesnt parse the /loc as well
         */
        let pathname = _pathname || "";
        if (pathStartsWithPrefix) {
            // Remove locale prefix
            pathname = pathname.slice(pathStartsWithPrefix.length + 1) || "/";
        }

        /**
         * Below same as original
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
            pathStartsWithPrefix,
        ]);

        return fn;
    },
};
