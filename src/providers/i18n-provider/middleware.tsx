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

    // 3️⃣ Detect language
    let lng: string | undefined | null;

    // Try cookie
    if (req.cookies.has(cookieName)) {
        lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
    }

    // Try Accept Language Header
    if (!lng) {
        lng = acceptLanguage.get(req.headers.get("Accept-Language") ?? "");
    }

    // Default fallback
    if (!lng) lng = fallbackLng;

    // Add language header
    response.headers.set(headerName, lng);

    // 3️⃣ Check if language is already in the path
    const lngInPath = languages.find((loc) =>
        req.nextUrl.pathname.startsWith(`/${loc}`)
    );

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

    return NextResponse.next();
}
