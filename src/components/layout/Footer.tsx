import * as React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low shadow-[0_-1px_8px_rgba(0,0,0,0.02)] border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold text-lg font-heading shadow-xs">
                D
              </div>
              <span className="text-xl font-bold text-on-surface tracking-tight font-heading">
                Dream<span className="text-primary">X</span>
              </span>
            </Link>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              High-accountability career transition infrastructure engineered for Indian engineering and management graduates. Bridging capability gaps with verified proof of work.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              <span className="text-xs text-secondary font-bold">48h Readiness SLA &amp; Verification Guarantee</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <span className="text-xs text-outline tracking-wider uppercase font-bold">Platform</span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/how-it-works" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Services &amp; Tracks
                </Link>
              </li>
              <li>
                <Link href="/dashboard/readiness" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  The Readiness Model
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Cohort Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentorship Links */}
          <div className="space-y-3">
            <span className="text-xs text-outline tracking-wider uppercase font-bold">Mentorship</span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/mentors" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Mentors Directory
                </Link>
              </li>
              <li>
                <Link href="/services/s06-technical-mock" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Mock Interviews
                </Link>
              </li>
              <li>
                <Link href="/services/s04-portfolio-review" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Capstones &amp; Code Audits
                </Link>
              </li>
              <li>
                <Link href="/mentor/verification" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Mentor Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance Links */}
          <div className="space-y-3">
            <span className="text-xs text-outline tracking-wider uppercase font-bold">Legal &amp; Governance</span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  48h Audit SLA Protocol
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">
                  Indian Placement Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container/60 rounded-xl p-6 border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
            <p className="text-xs text-on-surface leading-relaxed">
              <strong className="text-on-surface font-bold">India-First Career Infrastructure:</strong> Optimized for Tier-1 to Tier-3 engineering &amp; commerce graduates targeting domestic unicorns, GCCs, and top tech employers.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <span className="text-xs text-outline font-medium">© 2026 DreamX Technologies India Pvt. Ltd.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
