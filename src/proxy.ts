import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const isVerified = sessionCookie ? await verifySession(sessionCookie) : null;

    // Route: /admin/login
    if (pathname === "/admin/login") {
      if (isVerified) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Route: /admin/* (other admin pages)
    if (!isVerified) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
