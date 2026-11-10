"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
            <span>Secure Password Replacement</span>
          </div>
        </div>

        <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#eef2ff] text-[#5145cd] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight">
              Create New Password
            </h1>
            <p className="text-xs text-[#66666f] max-w-xs mx-auto">
              Please enter a strong new password for your DreamX account.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-[#ebf7ee] border border-[#94f7b2]/50 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#006d3a]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Password Reset Complete</span>
              </div>
              <p className="text-xs text-[#66666f] leading-relaxed">
                Your password has been securely updated. You can now log in with your new credentials.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button size="md" className="w-full">
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-[#fdf2f2] border border-[#ffdad6] text-xs text-[#c43b3b] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                type="password"
                label="New Password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />

              <Input
                type="password"
                label="Confirm New Password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full shadow-md"
                isLoading={isLoading}
              >
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

