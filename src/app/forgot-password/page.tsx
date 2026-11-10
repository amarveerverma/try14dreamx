"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  KeyRound,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e7e7eb] text-xs font-semibold text-[#16834a] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Password Recovery</span>
          </div>
        </div>

        <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#eef2ff] text-[#5145cd] flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-[#66666f] max-w-xs mx-auto">
              Enter the email associated with your DreamX account and we&apos;ll send you a recovery link.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-[#ebf7ee] border border-[#94f7b2]/50 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#006d3a]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Recovery Link Sent</span>
              </div>
              <p className="text-xs text-[#66666f] leading-relaxed">
                If an account exists for <strong className="text-[#171717]">{email}</strong>, you will receive password reset instructions within 2 minutes.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Registered Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                size="lg"
                className="w-full shadow-md"
                isLoading={isLoading}
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}

          <div className="text-center pt-2 text-xs text-[#66666f]">
            <Link href="/login" className="font-semibold text-[#5145cd] hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

