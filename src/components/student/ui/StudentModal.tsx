"use client";

import * as React from "react";
import { X } from "lucide-react";

export interface StudentModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function StudentModal({
  open,
  onClose,
  title,
  subtitle,
  maxWidthClass = "max-w-2xl",
  children,
  footer,
}: StudentModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthClass} max-h-[90vh] flex flex-col rounded-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-zinc-200/80 bg-zinc-50/70">
          <div>
            <h2 id="modal-title" className="text-base sm:text-lg font-semibold text-zinc-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs sm:text-sm text-zinc-600">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145cd]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-zinc-200/80 bg-zinc-50/80 flex flex-wrap items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
