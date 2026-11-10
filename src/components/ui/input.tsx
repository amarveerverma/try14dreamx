import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
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
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-[#e7e7eb] bg-white px-3.5 py-2 text-sm text-[#171717] placeholder:text-[#8b8b95] transition-colors focus-visible:outline-none focus-visible:border-[#5145cd] focus-visible:ring-2 focus-visible:ring-[#5145cd]/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#c43b3b] focus-visible:ring-[#c43b3b]/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#c43b3b] font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

