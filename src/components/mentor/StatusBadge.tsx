"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { StatusBadgeProps, Tone } from "./types";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-emerald-50/95 text-emerald-800 border-emerald-200/90",
  warning: "bg-amber-50/95 text-amber-800 border-amber-200/90",
  danger: "bg-rose-50/95 text-rose-800 border-rose-200/90",
  info: "bg-sky-50/95 text-sky-800 border-sky-200/90",
  primary: "bg-indigo-50/95 text-[#4035b3] border-indigo-200/90",
  neutral: "bg-zinc-100/95 text-zinc-700 border-zinc-200/90",
};

export function StatusBadge({
  label,
  tone,
  size = "sm",
  showIcon = true,
}: StatusBadgeProps) {
  const Icon =
    tone === "success"
      ? CheckCircle2
      : tone === "warning"
      ? AlertTriangle
      : tone === "danger"
      ? AlertCircle
      : tone === "info" || tone === "primary"
      ? Info
      : Clock;

  const sizeClass =
    size === "sm"
      ? "px-2.5 py-0.5 text-xs gap-1.5"
      : "px-3 py-1 text-xs font-semibold gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium leading-tight whitespace-nowrap ${TONE_CLASSES[tone]} ${sizeClass}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
}
