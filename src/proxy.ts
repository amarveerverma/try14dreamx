import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Detect Supabase or DreamX auth cookies
  const allCookies = request.cookies.getAll();
  const hasAuthToken = allCookies.some(
    (c) =>
      c.name.includes("-auth-token") ||
      c.name.startsWith("sb-") ||
      c.name === "dreamx_auth"
  );
  const role = request.cookies.get("dreamx_role")?.value;

  // 1. Admin route protection
  if (pathname.startsWith("/admin")) {
    // Dedicated login page is always accessible
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    // If not authenticated or role is explicitly not admin
    if (!hasAuthToken || (role && role !== "admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 2. Mentor Delivery Console protection (/mentor, /mentor/earnings, /mentor/sessions, etc.)
  if (pathname.startsWith("/mentor") && pathname !== "/mentor/onboarding") {
    if (!hasAuthToken) {
      return NextResponse.redirect(
        new URL(`/login?role=mentor&redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    if (role === "student") {
      return NextResponse.redirect(
        new URL("/mentor/onboarding?notice=apply_as_mentor", request.url)
      );
    }
  }

  // 3. Mentor Onboarding protection (/mentor/onboarding)
  if (pathname === "/mentor/onboarding") {
    if (!hasAuthToken) {
      return NextResponse.redirect(
        new URL("/signup?role=mentor&redirect=/mentor/onboarding", request.url)
      );
    }
  }

  // 4. Candidate Dashboard protection (/dashboard, /dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!hasAuthToken) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
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
