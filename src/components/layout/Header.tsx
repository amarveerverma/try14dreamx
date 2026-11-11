"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Services", href: "/services" },
    { name: "Mentors", href: "/mentors" },
    { name: "Readiness Model", href: "/dashboard/readiness" },
    { name: "Membership", href: "/membership" },
  ];

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
            {user ? (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex text-xs font-bold text-on-surface hover:text-primary transition-colors px-2.5 py-2"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors px-2.5 py-2"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-primary text-on-primary text-xs font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-[0_1px_3px_0_rgba(23,23,23,0.04)] hover:bg-primary-container hover:text-on-primary-container transition-colors whitespace-nowrap"
            >
              Get Started
            </Link>

            <Link
              href={user ? "/dashboard" : "/login"}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary"
              title={user?.name || "Account"}
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">person</span>
            </Link>

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

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-surface-container space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block py-2.5 text-center text-xs font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block py-2.5 text-center text-xs font-bold text-on-primary bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-xs"
              >
                Get Started — Free Check
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
