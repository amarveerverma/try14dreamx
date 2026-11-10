import * as React from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf7ee] text-[#16834a] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DPDP Act 2023 Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#8b8b95]">Digital Personal Data Protection (DPDP) Act 2023 Compliance Policy</p>
      </div>

      <Card className="p-6 sm:p-10 bg-white border-[#e7e7eb] shadow-sm space-y-6 text-sm text-[#66666f] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">1. Data Fiduciary Commitment</h2>
          <p>
            DreamX Technologies India Pvt Ltd acts as a Data Fiduciary under India&apos;s Digital Personal Data Protection Act 2023. We collect personal data strictly for authenticating sessions, delivering career rubrics, and facilitating payments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">2. Data Processing & Consent</h2>
          <p>
            Candidates retain full control over their uploaded resumes, code repositories, and diagnostic scorecards. Resume documents are encrypted at rest with AES-256 and stored on secure cloud storage accessible only to assigned mentors during the service window.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">3. Data Subject Rights</h2>
          <p>
            Under DPDP 2023, you have the right to request access, correction, and erasure of your personal data at any time via your settings or by writing to <a href="mailto:privacy@dreamx.in" className="text-[#5145cd] underline">privacy@dreamx.in</a>.
          </p>
        </section>
      </Card>
    </div>
  );
}

