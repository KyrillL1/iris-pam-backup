import { NextRequest, NextResponse } from "next/server";
import { fallbackLng, headerName, languages } from "./settings";
import acceptLanguage from "accept-language";

export async function checkLangPrefix(
    request: NextRequest,
    response: NextResponse,
) {
    let pathname = request.nextUrl.pathname;

    const lngInPath = languages.find((loc) => pathname.startsWith(`/${loc}`));

    /**
     * If user prefixed path with language we actually serve
     * Rewrite internally, so next knows to serve
     * /employee instead of /en/employee
     */
    if (lngInPath) {
        const internalPath = pathname.replace(`/${lngInPath}`, "") || "/";

        const rewriteUrl = new URL(
            `${internalPath}${request.nextUrl.search}`,
            request.url,
        );

        response.headers.set(headerName, lngInPath);

        return NextResponse.rewrite(rewriteUrl, { headers: response.headers });
    }

    const possibleOtherLng = pathname.split("/").filter(Boolean)[0] || "";
    const wantsUnsupportedLang = possibleOtherLng.length === 2;
    if (wantsUnsupportedLang) {
        pathname = pathname.replace(`/${possibleOtherLng}`, "");
    }

    /**
     * Else, we need to check what language the user actually wants
     */
    const userRequestsLang = acceptLanguage.get(
        request.headers.get("Accept-Language"),
    ) || fallbackLng;

    /**
     * And redirect to be coming back into this middleware, but leave above at the rewrite
     */
    return NextResponse.redirect(
        new URL(
            `/${userRequestsLang}${pathname}${request.nextUrl.search}`,
            request.url,
        ),
    );
}
