import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 py-2 text-sm gap-2",
      lg: "h-12 px-6 py-3 text-base gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-[#5145cd] text-white hover:bg-[#4035b3] shadow-sm focus-visible:ring-[#5145cd]",
      secondary:
        "bg-[#f0eded] text-[#171717] hover:bg-[#eae7e7] focus-visible:ring-[#777585]",
      outline:
        "border border-[#e7e7eb] bg-white text-[#171717] hover:bg-[#f7f7f8] hover:border-[#c8c4d6] focus-visible:ring-[#5145cd]",
      ghost:
        "bg-transparent text-[#66666f] hover:text-[#171717] hover:bg-[#f7f7f8]",
      danger:
        "bg-[#c43b3b] text-white hover:bg-[#ba1a1a] shadow-sm focus-visible:ring-[#c43b3b]",
      link: "text-[#5145cd] underline-offset-4 hover:underline p-0 h-auto",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

