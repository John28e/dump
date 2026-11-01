"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ViewToggleProps {
  isListView: boolean;
  onToggle: () => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ isListView, onToggle }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Fade in only while user is inside #work section, or while List View is open
  useEffect(() => {
    if (!buttonRef.current) return;
    const btn = buttonRef.current;

    if (isListView) {
      gsap.to(btn, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
      return;
    }

    // Direct viewport boundary calculation for bulletproof sync across Lenis & native scroll
    const updateVisibility = () => {
      if (isListView) return;
      const workEl = document.getElementById("work");
      if (!workEl) return;
      const rect = workEl.getBoundingClientRect();
      const inView =
        rect.top <= window.innerHeight * 0.8 &&
        rect.bottom >= window.innerHeight * 0.2;
      gsap.to(btn, {
        autoAlpha: inView ? 1 : 0,
        duration: inView ? 0.3 : 0.22,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility, { passive: true });

    const trigger = ScrollTrigger.create({
      trigger: "#work",
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => gsap.to(btn, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }),
      onLeave: () => gsap.to(btn, { autoAlpha: 0, duration: 0.22, ease: "power2.out" }),
      onEnterBack: () => gsap.to(btn, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(btn, { autoAlpha: 0, duration: 0.22, ease: "power2.out" }),
      onUpdate: () => updateVisibility(),
    });

    // Initial check
    updateVisibility();

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      trigger.kill();
    };
  }, [isListView]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      aria-label={isListView ? "Switch to grid view" : "Switch to list view"}
      aria-pressed={isListView}
      style={{ opacity: 0, visibility: "hidden" }}
      className="fixed left-1/2 bottom-[24px] z-[70] h-[54px] w-[102px] -translate-x-1/2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white select-none transition-transform duration-200 active:scale-95"
    >
      <div className="relative h-full w-full">
        {/* Pill Background with subtle border (spec section 6 & 10) */}
        <div className="absolute inset-0 rounded-full bg-black/90 border border-neutral-700/80 shadow-lg backdrop-blur-sm" />

        {/* Inner Content: Left Icon + Right Label */}
        <div className="relative z-10 h-full w-full flex items-center justify-between px-5">
          {/* Morphing Icon: 4 Grid Squares <-> 3 List Lines (spec animation #7) */}
          <div className="relative w-4 h-4 flex items-center justify-center">
            {/* Grid icon (4 squares) */}
            <div
              className={`absolute inset-0 grid grid-cols-2 gap-1 transition-all duration-300 ease-in-out ${
                isListView ? "opacity-0 scale-75 rotate-45 pointer-events-none" : "opacity-100 scale-100 rotate-0"
              }`}
            >
              <span className="w-1.5 h-1.5 bg-white block" />
              <span className="w-1.5 h-1.5 bg-white block" />
              <span className="w-1.5 h-1.5 bg-white block" />
              <span className="w-1.5 h-1.5 bg-white block" />
            </div>

            {/* List icon (3 horizontal lines) */}
            <div
              className={`absolute inset-0 flex flex-col justify-between py-0.5 transition-all duration-300 ease-in-out ${
                isListView ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-45 pointer-events-none"
              }`}
            >
              <span className="w-4 h-[1.5px] bg-white block" />
              <span className="w-4 h-[1.5px] bg-white block" />
              <span className="w-4 h-[1.5px] bg-white block" />
            </div>
          </div>

          {/* Morphing Label: LIST <-> GRID (spec animation #8) */}
          <div className="relative overflow-hidden h-4 w-10 flex items-center justify-center">
            <span
              className={`absolute font-univers font-bold text-label text-white uppercase tracking-wider transition-all duration-300 ease-in-out ${
                isListView ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              LIST
            </span>
            <span
              className={`absolute font-univers font-bold text-label text-white uppercase tracking-wider transition-all duration-300 ease-in-out ${
                isListView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              GRID
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
