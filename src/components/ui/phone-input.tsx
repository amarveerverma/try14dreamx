import * as React from "react";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#171717]"
          >
            {label}
          </label>
        )}
        <div className="relative flex rounded-lg border border-[#e7e7eb] bg-white transition-colors focus-within:border-[#5145cd] focus-within:ring-2 focus-within:ring-[#5145cd]/20">
          <div className="flex items-center gap-1.5 px-3 border-r border-[#e7e7eb] bg-[#f7f7f8] text-xs font-semibold text-[#171717] rounded-l-lg select-none">
            <span>🇮🇳</span>
            <span>+91</span>
          </div>
          <input
            id={inputId}
            type="tel"
            maxLength={10}
            className={cn(
              "flex h-11 w-full bg-transparent px-3 py-2 text-sm text-[#171717] placeholder:text-[#8b8b95] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            placeholder="98765 43210"
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[#c43b3b] font-medium">{error}</p>
        )}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

