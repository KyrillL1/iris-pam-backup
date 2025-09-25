import { updateSession } from "@/utils/supabase/middleware";
import {
  cookieName,
  fallbackLng,
  headerName,
  languages,
} from "@providers/i18n-provider/settings";
import { type NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { i18nMiddleware } from "@providers/i18n-provider/middleware";

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

  response = await i18nMiddleware(req, response);

  return response;
}

// Middleware config
export const config = {
  matcher: [
    // Match all routes except _next static/image and favicons or common images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
