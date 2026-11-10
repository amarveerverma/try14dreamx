import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building,
  Lock,
  FileText,
} from "lucide-react";

export function Footer() {
  const serviceLinks = [
    { name: "S01 Resume Review", href: "/services/s01-resume-review" },
    { name: "S02 ATS Resume Optimization", href: "/services/s02-ats-optimization" },
    { name: "S03 LinkedIn Profile Review", href: "/services/s03-linkedin-review" },
    { name: "S04 Portfolio Review", href: "/services/s04-portfolio-review" },
    { name: "S05 Behavioral Mock Interview", href: "/services/s05-behavioral-mock" },
    { name: "S06 Technical Mock Interview", href: "/services/s06-technical-mock" },
    { name: "S07 Career Consultation", href: "/services/s07-career-consultation" },
    { name: "S08 Salary Negotiation", href: "/services/s08-salary-negotiation" },
  ];

  const platformLinks = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Services Catalogue", href: "/services" },
    { name: "Verified Mentors", href: "/mentors" },
    { name: "Readiness Model", href: "/how-it-works#readiness" },
    { name: "DreamX Club (Membership)", href: "/membership" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy (DPDP 2023)", href: "/privacy" },
    { name: "Cancellation & Refund Policy", href: "/refunds" },
    { name: "Mentor Code of Conduct", href: "/conduct" },
    { name: "Grievance Redressal Mechanism", href: "/grievance" },
  ];

  return (
    <footer
      aria-label="Global Site Footer"
      className="w-full bg-[#f0eded] border-t border-[#e7e7eb] pt-14 pb-12 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand & Trust Column (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5145cd] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-[#171717]">
                    Dream<span className="text-[#5145cd]">X</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#94f7b2]/40 text-[#006d3a]">
                    India Alpha
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#66666f]">
                  Outcome-Accountable Career Network
                </p>
              </div>
            </div>

            <p className="text-xs text-[#66666f] leading-relaxed max-w-sm">
              Connecting Tier-1, Tier-2, and Tier-3 engineering and product talent with high-growth roles through verifiable 1:1 mentorship, rubric diagnostics, and 48-hour deliverable SLAs.
            </p>

            {/* Operating Live Beacon */}
            <div className="p-3 rounded-xl bg-white border border-[#e7e7eb] flex items-center gap-2.5 text-xs">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16834a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16834a]"></span>
              </span>
              <span className="text-[#171717] font-medium">
                <strong className="text-[#16834a]">Live Nodes:</strong> Bengaluru, Hyderabad, Pune, Gurugram • Asia/Kolkata (IST)
              </span>
            </div>

            {/* Accreditations Badges */}
            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-[#66666f]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#e7e7eb]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5145cd]" /> ISO 27001
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#e7e7eb]">
                <FileText className="w-3.5 h-3.5 text-[#16834a]" /> DPDP Act 2023
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#e7e7eb]">
                <Lock className="w-3.5 h-3.5 text-[#2864c5]" /> PCI-DSS Compliant
              </span>
            </div>

            {/* Regional Currency & Tax Disclosure */}
            <div className="text-[11px] text-[#8b8b95] leading-normal pt-1">
              All marketplace fees listed in INR (₹) inclusive of 18% GST (Goods & Services Tax) pursuant to Indian commercial regulations.
            </div>
          </div>

          {/* Directory Columns (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Column 1: Services */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Services
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#eef2ff] text-[#5145cd] font-bold">
                  S01–S08
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#66666f]">
                {serviceLinks.map((s) => (
                  <li key={s.name}>
                    <Link href={s.href} className="hover:text-[#5145cd] transition-colors">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Platform */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-3.5">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-[#66666f]">
                {platformLinks.map((p) => (
                  <li key={p.name}>
                    <Link href={p.href} className="hover:text-[#5145cd] transition-colors">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Compliance & Grievance Officer */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-3.5">
                  Legal & Trust
                </h4>
                <ul className="space-y-2 text-xs text-[#66666f]">
                  {legalLinks.map((l) => (
                    <li key={l.name}>
                      <Link href={l.href} className="hover:text-[#5145cd] transition-colors">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Grievance Officer Box (Mandatory per Indian IT Rules 2021) */}
              <div className="p-3 rounded-xl bg-white border border-[#e7e7eb] text-[11px] space-y-1">
                <div className="font-bold text-[#171717] flex items-center gap-1">
                  <Building className="w-3 h-3 text-[#5145cd]" />
                  <span>Grievance Officer (IT Rules)</span>
                </div>
                <p className="text-[#66666f]">DreamX Technologies India Pvt Ltd</p>
                <p className="text-[#8b8b95]">SLA: 24h acknowledgement, 15-day redressal</p>
                <a
                  href="mailto:grievance@dreamx.in"
                  className="text-[#5145cd] font-semibold hover:underline block pt-0.5"
                >
                  grievance@dreamx.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 border-t border-[#e7e7eb] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8b8b95]">
          <div>
            © 2026 DreamX Technologies India Pvt Ltd. All rights reserved. Registered under MCA (India).
          </div>
          <div className="flex items-center gap-4">
            <span>Operating in Asia/Kolkata timezone</span>
            <span>•</span>
            <span className="text-[#16834a] font-semibold">100% Escrow Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
