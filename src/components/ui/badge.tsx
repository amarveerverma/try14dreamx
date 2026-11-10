import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "verified";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#eef2ff] text-[#5145cd] border border-[#e0e7ff]",
    success: "bg-[#ebf7ee] text-[#16834a] border border-[#78db98]/40",
    warning: "bg-[#fef6e7] text-[#a7670b] border border-[#fef6e7]",
    danger: "bg-[#fdf2f2] text-[#c43b3b] border border-[#ffdad6]",
    info: "bg-[#eef4fd] text-[#2864c5] border border-[#c1d3ff]",
    neutral: "bg-[#f7f7f8] text-[#66666f] border border-[#e7e7eb]",
    verified: "bg-[#94f7b2]/20 text-[#006d3a] border border-[#94f7b2]/50 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {variant === "verified" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#006d3a]" />
      )}
      {children}
    </span>
  );
}

