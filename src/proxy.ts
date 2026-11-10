import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read role from cookies
  const role = request.cookies.get("dreamx_role")?.value;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (role && role !== "admin") {
      // Unauthorized role trying to access admin
      return NextResponse.redirect(new URL("/login?error=unauthorized_admin", request.url));
    }
  }

  // Mentor route protection
  if (pathname.startsWith("/mentor") && !pathname.startsWith("/mentor/onboarding")) {
    if (role && role === "student") {
      // Student trying to enter mentor delivery console
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/mentor/:path*",
    "/admin/:path*",
  ],
};
