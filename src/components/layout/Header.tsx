"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, role, isLoading, logout } = useAuth();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-email" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  const isAdminPage = pathname?.startsWith("/admin");
  const isOnboardingPage =
    pathname === "/dashboard/onboarding" || pathname === "/mentor/onboarding";

  // Hide the global consumer header on dedicated auth, admin, and full-screen onboarding flows
  if (isAuthPage || isAdminPage || isOnboardingPage) {
    return null;
  }

  const navLinks = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Services", href: "/services" },
    { name: "Mentors", href: "/mentors" },
    { name: "Readiness Model", href: "/dashboard/readiness" },
    { name: "Membership", href: "/membership" },
  ];

  const dashboardRoute =
    role === "admin" ? "/admin" : role === "mentor" ? "/mentor" : "/dashboard";
  const userDisplayName = user?.name || "Account";
  const userInitials = userDisplayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold text-base sm:text-lg font-heading shadow-xs">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg text-on-surface tracking-tight leading-none font-heading">
                Dream<span className="text-primary">X</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-outline tracking-wider uppercase scale-90 origin-left mt-0.5 font-semibold">
                Career Acceleration
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs xl:text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-on-surface font-bold"
                      : "text-on-surface-variant hover:text-on-surface font-medium"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {isLoading ? (
              <div className="h-8 w-24 bg-surface-container rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2">
                  <Link
                    href={dashboardRoute}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-lg border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">dashboard</span>
                    <span className="hidden sm:inline">
                      {role === "mentor" ? "Mentor Console" : role === "admin" ? "Admin" : "Dashboard"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-surface-container transition-colors border border-outline-variant/30 cursor-pointer"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                      {userInitials || "DX"}
                    </div>
                    <span className="text-xs font-bold text-on-surface hidden md:inline max-w-[100px] truncate">
                      {user.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      {profileDropdownOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                </div>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-surface rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-surface-container">
                      <div className="font-bold text-xs text-on-surface truncate">
                        {user.name || "Candidate"}
                      </div>
                      <div className="text-[11px] text-on-surface-variant truncate font-mono mt-0.5">
                        {user.email}
                      </div>
                      <span className="inline-block px-2 py-0.5 mt-1.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">
                        {role === "mentor" ? "Accredited Mentor" : role === "admin" ? "Admin" : "Job Seeker"}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={dashboardRoute}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                        <span>Workspace Overview</span>
                      </Link>
                      <Link
                        href="/dashboard/bookings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">calendar_today</span>
                        <span>My Bookings &amp; Sessions</span>
                      </Link>
                      <Link
                        href="/dashboard/readiness"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">verified_user</span>
                        <span>8-Dimension Readiness</span>
                      </Link>
                      <Link
                        href="/dashboard/journey"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">trending_up</span>
                        <span>Career Acceleration Roadmap</span>
                      </Link>
                      <Link
                        href="/membership"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">military_tech</span>
                        <span>Membership &amp; Savings</span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">settings</span>
                        <span>Account Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-surface-container">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-error hover:bg-error-container/20 transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Sign Out Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors px-2.5 py-2"
                >
                  Candidate Sign In
                </Link>

                <Link
                  href="/mentor/login"
                  className="hidden lg:inline-flex text-xs font-bold text-[#5145cd] hover:text-[#3828b5] transition-colors px-2.5 py-2"
                >
                  Mentor Sign In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center bg-primary text-on-primary text-xs font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-[0_1px_3px_0_rgba(23,23,23,0.04)] hover:bg-primary-container hover:text-on-primary-container transition-colors whitespace-nowrap"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-sm bg-surface h-full shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
                    D
                  </div>
                  <span className="font-bold text-lg text-on-surface font-heading">
                    Dream<span className="text-primary">X</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Mobile Identity Card if Signed In */}
              {user && (
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {userInitials || "DX"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-on-surface block truncate">
                      {user.name || "Candidate"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant block truncate font-mono">
                      {user.email}
                    </span>
                    <span className="inline-block px-1.5 py-0.2 rounded bg-secondary-container/40 text-on-secondary-container text-[9px] font-bold uppercase mt-0.5">
                      {role === "mentor" ? "Mentor" : "Candidate"}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-outline font-mono">
                      Workspace Quick Links
                    </div>
                    <Link
                      href={dashboardRoute}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">dashboard</span>
                      <span>Portal Overview</span>
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>My Bookings &amp; Sessions</span>
                    </Link>
                    <Link
                      href="/dashboard/readiness"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      <span>8-Dimension Readiness</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="pt-6 border-t border-surface-container space-y-3">
              {isLoading ? (
                <div className="h-10 w-full bg-surface-container rounded-lg animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    href={dashboardRoute}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block py-2.5 text-center text-xs font-bold text-on-primary bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-xs"
                  >
                    Open {role === "mentor" ? "Mentor Console" : role === "admin" ? "Admin Workspace" : "Student Portal"} →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full block py-2.5 text-center text-xs font-bold text-error bg-error-container/20 hover:bg-error-container/40 rounded-lg transition-colors cursor-pointer"
                  >
                    Sign Out Session
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block py-2.5 text-center text-xs font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-lg transition-colors"
                  >
                    Candidate Sign In
                  </Link>
                  <Link
                    href="/mentor/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block py-2.5 text-center text-xs font-bold text-[#5145cd] bg-surface-container hover:bg-surface-container-high rounded-lg transition-colors"
                  >
                    Mentor Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block py-2.5 text-center text-xs font-bold text-on-primary bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-xs"
                  >
                    Get Started — Candidate
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from slipping under fixed header */}
      <div className="h-16 sm:h-20 shrink-0" aria-hidden="true" />
    </>
  );
}
