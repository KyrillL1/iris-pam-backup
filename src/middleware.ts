import { updateSession } from "@/utils/supabase/middleware";
import { checkLangPrefix } from "@providers/i18n-provider/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Start with a single NextResponse instance
  let response = NextResponse.next({
    request: { headers: req.headers },
  });

  response = await updateSession(req, response);

  response = await checkLangPrefix(req, response);

  return response;
}

// Middleware config
export const config = {
  matcher: [
    // Match all routes except _next static/image and favicons or common images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
