"use client";

import React from "react";
import { PLACEHOLDER_DATA } from "@/data/content";
import { CopyEmail } from "./CopyEmail";

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-transparent text-white px-grid-margin py-6 select-none pointer-events-auto">
      {/* Top Dotted Divider Line matching spec section 10 */}
      <div
        className="w-full h-[0.5px] mb-6 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgb(255, 255, 255) 0px, rgb(255, 255, 255) 3px, transparent 3px, transparent 6px)",
          backgroundSize: "100% 0.5px",
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Copyright */}
        <p className="text-label text-white text-center md:text-left">
          {PLACEHOLDER_DATA.footer.copyright}
        </p>

        {/* Center: Email with Click-to-copy */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <CopyEmail
            email={PLACEHOLDER_DATA.footer.email}
            className="text-label text-white hover:text-gray-300 underline underline-offset-4"
          >
            {PLACEHOLDER_DATA.footer.email}
          </CopyEmail>
        </div>

        {/* Right: Credit Line */}
        <p className="text-label text-white text-center md:text-right">
          Website by {PLACEHOLDER_DATA.brand}
        </p>
      </div>
    </footer>
  );
};
