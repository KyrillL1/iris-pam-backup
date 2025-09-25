import { updateSession } from "@/utils/supabase/middleware";
import {
  cookieName,
  fallbackLng,
  headerName,
  languages,
} from "@providers/i18n-provider/settings";
import { type NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";

/**
 * Middleware to handle:
 * 1. Supabase session update
 * 2. Language detection (cookie, header, referer)
 * 3. Language redirect
 */
export async function middleware(req: NextRequest) {
  // Start with a single NextResponse instance
  let response = NextResponse.next({
    request: { headers: req.headers },
  });

  // 1️⃣ Supabase session update, pass the same response
  response = await updateSession(req, response);

  // 2️⃣ Ignore static assets
  const path = req.nextUrl.pathname;
  if (path.includes("icon") || path.includes("chrome")) {
    return response;
  }

  // 3️⃣ Detect language
  let lng: string | undefined | null;

  // Try cookie
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }

  // Fallback to Accept-Language header
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get("Accept-Language") ?? "");
  }

  // Default fallback
  if (!lng) lng = fallbackLng;

  // 4️⃣ Check if language is already in the path
  const lngInPath = languages.find((loc) => path.startsWith(`/${loc}`));

  // Add language header
  response.headers.set(headerName, lngInPath || lng);

  // 5️⃣ Redirect if language missing in path
  if (!lngInPath && !path.startsWith("/_next")) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url),
    );
  }

  return response;
}

// Middleware config
export const config = {
  matcher: [
    // Match all routes except _next static/image and favicons or common images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
