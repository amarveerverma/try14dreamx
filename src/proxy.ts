import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isRsc = request.headers.get("rsc") === "1" || request.headers.has("next-router-state-tree");

  // Detect Supabase or DreamX auth cookies
  const allCookies = request.cookies.getAll();
  const hasAuthToken = allCookies.some(
    (c) =>
      c.name.includes("-auth-token") ||
      c.name.startsWith("sb-") ||
      c.name === "dreamx_auth"
  );
  const role = request.cookies.get("dreamx_role")?.value;
  const onboarded = request.cookies.get("dreamx_onboarded")?.value;

  // For internal RSC router fetches, avoid abrupt 307 redirects that cause client navigation faults
  if (isRsc) {
    return NextResponse.next();
  }

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
  if (pathname.startsWith("/mentor") && pathname !== "/mentor/onboarding" && pathname !== "/mentor/login") {
    if (!hasAuthToken) {
      return NextResponse.redirect(
        new URL(`/mentor/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    if (role === "student") {
      return NextResponse.redirect(
        new URL("/mentor/onboarding?notice=apply_as_mentor", request.url)
      );
    }
    if (role === "mentor" && onboarded === "false") {
      return NextResponse.redirect(
        new URL("/mentor/onboarding", request.url)
      );
    }
  }

  // 3. Mentor Onboarding protection (/mentor/onboarding)
  // If already an onboarded mentor, forward directly to the delivery console
  if (pathname === "/mentor/onboarding" && role === "mentor" && onboarded === "true") {
    return NextResponse.redirect(new URL("/mentor", request.url));
  }

  // 4. Candidate Dashboard protection (/dashboard, /dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!hasAuthToken) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    if (role === "mentor") {
      return NextResponse.redirect(
        new URL(onboarded === "true" ? "/mentor" : "/mentor/onboarding", request.url)
      );
    }
    if (pathname !== "/dashboard/onboarding" && onboarded === "false") {
      return NextResponse.redirect(
        new URL("/dashboard/onboarding", request.url)
      );
    }
    if (pathname === "/dashboard/onboarding" && onboarded === "true") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
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
