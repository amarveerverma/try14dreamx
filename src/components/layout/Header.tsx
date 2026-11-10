"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Services", href: "/services", badge: "10" },
    { name: "Mentors", href: "/mentors" },
    { name: "Membership", href: "/membership" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e7e7eb] py-2.5"
            : "bg-white/80 backdrop-blur-sm border-b border-[#e7e7eb] py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#5145cd] text-white flex items-center justify-center font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
              D
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#171717]">
                  Dream<span className="text-[#5145cd]">X</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#eef2ff] text-[#5145cd] text-[10px] font-bold tracking-wider uppercase">
                  India
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#66666f] tracking-normal hidden sm:block">
                Outcome-Accountable Career Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#5145cd]"
                      : "text-[#66666f] hover:text-[#171717]"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#ebf7ee] text-[#16834a] text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* India Region Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f7f7f8] border border-[#e7e7eb] text-xs font-semibold text-[#171717]">
              <span>🇮🇳</span>
              <span className="tnum">INR (₹)</span>
            </div>

            {/* Sign In */}
            <Link
              href="/login"
              className="text-sm font-semibold text-[#171717] hover:text-[#5145cd] px-2 transition-colors hidden sm:inline-block"
            >
              Sign In
            </Link>

            {/* Primary CTA */}
            <Link href="/signup">
              <Button size="sm" className="hidden sm:inline-flex">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#66666f] hover:text-[#171717] hover:bg-[#f7f7f8] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e7e7eb]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5145cd] text-white flex items-center justify-center font-bold">
                    D
                  </div>
                  <span className="font-bold text-lg text-[#171717]">
                    Dream<span className="text-[#5145cd]">X</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-[#66666f] hover:bg-[#f7f7f8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-[#171717] hover:bg-[#f7f7f8]"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ebf7ee] text-[#16834a] text-xs font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Region & Trust Note */}
              <div className="p-3.5 rounded-xl bg-[#f7f7f8] border border-[#e7e7eb] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#171717]">
                  <span>Currency: INR (₹)</span>
                  <span className="text-[#16834a] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> India Alpha
                  </span>
                </div>
                <p className="text-[11px] text-[#66666f] leading-normal">
                  All fees inclusive of 18% GST. Standardized 48h report turnaround SLA.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-6 border-t border-[#e7e7eb]">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full block">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full block">
                <Button variant="primary" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
