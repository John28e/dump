"use client";

import React, { useState, useRef, useCallback } from "react";

interface CopyEmailProps {
  email: string;
  className?: string;
  children?: React.ReactNode;
}

export const CopyEmail: React.FC<CopyEmailProps> = ({ email, className = "", children }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // Fallback / silent catch
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setCopied(true);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1200);
    },
    [email]
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy email ${email}`}
      className={`relative inline-block cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 ${className}`}
    >
      <span
        className="transition-opacity duration-200 block"
        style={{ opacity: copied ? 0 : 1 }}
      >
        {children || email}
      </span>
      <span
        role="status"
        aria-live="polite"
        className="absolute inset-0 text-left transition-opacity duration-200 pointer-events-none select-none font-bold"
        style={{ opacity: copied ? 1 : 0 }}
      >
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
};
