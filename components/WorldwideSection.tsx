"use client";

import React, { useRef } from "react";
import { PLACEHOLDER_DATA } from "@/data/content";
import { useAppStore } from "@/lib/store";
import { Footer } from "@/components/Footer";

export const WorldwideSection: React.FC = () => {
  const { openContact } = useAppStore();
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).tagName === "BUTTON" || (e.target as HTMLElement).tagName === "A") {
      return;
    }
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("globe-drag-start"));
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("globe-drag", { detail: { dx, dy } }));
    }
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("globe-drag-end"));
      }
    }
  };

  return (
    <section
      id="worldwide"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative z-10 w-full h-lvh min-h-lvh bg-transparent text-white flex flex-col justify-between select-none overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* Upper spacing / Philosophy side texts & central CTA */}
      <div className="relative z-10 grid-layout flex-1 items-center pt-section pb-8 pointer-events-none">
        {/* Left side text: hidden below 1280px per spec */}
        <p className="font-univers text-footer-side text-gray-200 col-span-2 hidden min-[1280px]:block max-w-[260px] leading-relaxed uppercase pointer-events-auto">
          {PLACEHOLDER_DATA.worldwide.sideLeft}
        </p>

        {/* Center column: Globe interactive container + CTA button */}
        <div className="col-span-5 min-[1280px]:col-span-8 flex flex-col items-center justify-center relative py-12">
          {/* Globe interactive viewport target (centered behind the CTA, spec animation #23) */}
          <div
            id="globe-placeholder"
            data-globe-placeholder="true"
            role="img"
            aria-label="Interactive 3D points globe showing worldwide studio reach"
            className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[440px] md:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto mb-8"
          />

          {/* Closing CTA ("Work with us" opens Contact modal, spec animation #24) */}
          <button
            id="cta-work-with-us"
            type="button"
            onClick={openContact}
            className="text-footer-tagline text-white underline underline-offset-8 cursor-pointer hover:opacity-80 transition-opacity font-bold uppercase tracking-tight z-20 pointer-events-auto rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {PLACEHOLDER_DATA.worldwide.cta}
          </button>
        </div>

        {/* Right side text: hidden below 1280px per spec */}
        <p className="font-univers text-footer-side text-gray-200 col-span-2 text-right hidden min-[1280px]:block leading-relaxed uppercase pointer-events-auto">
          {PLACEHOLDER_DATA.worldwide.sideRight}
        </p>
      </div>

      {/* Footer bottom bar */}
      <Footer />
    </section>
  );
};
