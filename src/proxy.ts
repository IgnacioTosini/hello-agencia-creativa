import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isAuthenticated = verifyAdminSessionToken(session);

    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", request.nextUrl.pathname);

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
