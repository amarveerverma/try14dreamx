"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const role = searchParams.get("role") || "student";

  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = React.useState(59);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length <= 1) {
      const nextOtp = [...otp];
      nextOtp[index] = val;
      setOtp(nextOtp);

      // Auto focus next input
      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e7e7eb] text-xs font-semibold text-[#16834a] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Verification Step</span>
          </div>
        </div>

        <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#eef2ff] text-[#5145cd] flex items-center justify-center mx-auto shadow-sm">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-xs text-[#66666f] max-w-xs mx-auto">
              We sent a 6-digit verification code to <br />
              <strong className="text-[#171717]">{email}</strong>
            </p>
          </div>

          {verified ? (
            <div className="p-5 rounded-2xl bg-[#ebf7ee] border border-[#94f7b2]/50 space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#006d3a]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Email Successfully Verified!</span>
              </div>
              <p className="text-xs text-[#66666f]">
                Your account is authenticated. Let&apos;s personalize your career experience.
              </p>
              <Link href={role === "mentor" ? "/mentor/onboarding" : "/dashboard/onboarding"}>
                <Button size="md" className="w-full mt-2">
                  <span>Continue to {role === "mentor" ? "Mentor Verification" : "Career Intake Wizard"}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-[#e7e7eb] bg-[#fafafc] focus:outline-none focus:border-[#5145cd] focus:bg-white text-[#171717] shadow-xs"
                    required
                  />
                ))}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full shadow-md"
                isLoading={isVerifying}
              >
                <span>Confirm & Activate Account</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="flex items-center justify-between text-xs text-[#66666f] pt-2">
                <span>Didn&apos;t receive code?</span>
                {timer > 0 ? (
                  <span className="text-[#8b8b95]">Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimer(59)}
                    className="font-bold text-[#5145cd] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-[#f7f7f8] text-xs text-[#8b8b95]">
            Need to change your email?{" "}
            <Link href="/signup" className="text-[#5145cd] font-semibold hover:underline">
              Back to Sign Up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12">
          <div className="text-sm text-[#8b8b95]">Loading verification details...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </React.Suspense>
  );
}
