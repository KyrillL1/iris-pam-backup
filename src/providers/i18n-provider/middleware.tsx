import { NextRequest, NextResponse } from "next/server";
import { cookieName, fallbackLng, headerName, languages } from "./settings";
import acceptLanguage from "accept-language";

export async function i18nMiddleware(
    req: NextRequest,
    response?: NextResponse,
): Promise<NextResponse> {
    response = response ?? NextResponse.next({
        request: { headers: req.headers },
    });

    // 1. Detect Language
    let lng: string | undefined | null;

    if (!lng) {
        lng = acceptLanguage.get(req.headers.get("Accept-Language") ?? "");
    }

    const lngInPath = languages.find((loc) =>
        req.nextUrl.pathname.startsWith(`/${loc}`)
    );

    if (!lng) lng = lngInPath || fallbackLng;

    // 2. Add header for next time
    // Add language header
    response.headers.set(headerName, lng);

    /**
     * Now that we have parsed the language, we:
     * A) if the path is already including a lng prefix, we rewrite internally so
     * our app directory doesn't need to be updated
     * B) if the path is not already including a lng prefix, we redirect so
     * the user includes the lang prefix
     */
    // If language is not in path, rewrite internally
    if (
        !lngInPath &&
        !req.nextUrl.pathname.startsWith("/_next")
    ) {
        return NextResponse.redirect(
            new URL(
                `/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`,
                req.url,
            ),
        );
    }

    if (lngInPath) {
        // Remove the first path segment (language)
        const internalPath =
            req.nextUrl.pathname.replace(`/${lngInPath}`, "") || "/";

        const rewriteUrl = new URL(
            `${internalPath}${req.nextUrl.search}`,
            req.url,
        );

        return NextResponse.rewrite(rewriteUrl);
    }

    return response;
}
