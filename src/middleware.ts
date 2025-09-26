import { updateSession } from "@/utils/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { i18nMiddleware } from "@providers/i18n-provider/middleware";

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
