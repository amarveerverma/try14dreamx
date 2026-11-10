"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Briefcase,
  AlertCircle,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<"student" | "mentor">("student");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Route to email verification step
      router.push(`/verify-email?email=${encodeURIComponent(email)}&role=${role}`);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-[#5145cd]/10 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e7e7eb] text-xs font-semibold text-[#16834a] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Compliant Onboarding</span>
          </div>
        </div>

        <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight">
              Create Your DreamX Account
            </h1>
            <p className="text-xs text-[#66666f]">
              Join India&apos;s verified outcome-accountable career marketplace
            </p>
          </div>

          {/* Role Segmented Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#fafafc] border border-[#e7e7eb]">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === "student"
                  ? "bg-white text-[#5145cd] shadow-xs"
                  : "text-[#66666f] hover:text-[#171717]"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>I&apos;m a Student / Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("mentor")}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === "mentor"
                  ? "bg-white text-[#5145cd] shadow-xs"
                  : "text-[#66666f] hover:text-[#171717]"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Apply as Mentor</span>
            </button>
          </div>

          {/* Social Google OAuth Button */}
          <div>
            <button
              type="button"
              className="w-full h-11 px-4 rounded-xl border border-[#e7e7eb] bg-white hover:bg-[#fafafc] text-xs font-bold text-[#171717] flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853" />
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-[#e7e7eb]" />
            <span className="absolute px-3 bg-white text-[11px] font-bold uppercase tracking-wider text-[#8b8b95]">
              or with email & phone
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[#fdf2f2] border border-[#ffdad6] text-xs text-[#c43b3b] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              type="text"
              label="Full Name"
              placeholder="Aditya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="aditya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PhoneInput
              label="Mobile Number (India)"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password (min 8 characters)"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-[#e7e7eb] text-[#5145cd] focus:ring-[#5145cd] mt-0.5"
                required
              />
              <label htmlFor="terms" className="text-xs text-[#66666f] leading-normal select-none">
                I agree to the{" "}
                <Link href="/terms" className="text-[#5145cd] underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#5145cd] underline">Privacy Policy</Link>
                {" "}(DPDP 2023).
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full shadow-md"
              isLoading={isLoading}
            >
              <span>{role === "mentor" ? "Continue to Mentor Audit" : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2 text-xs text-[#66666f]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#5145cd] hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
