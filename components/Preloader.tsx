"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useAppStore } from "@/lib/store";
import { useLenisScroll } from "@/hooks/useLenisScroll";

export const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const setLoaded = useAppStore((s) => s.setLoaded);
  const { stop, start } = useLenisScroll();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const percentRef = useRef<HTMLSpanElement | null>(null);
  const progressRef = useRef(0);
  const rafId = useRef<number | null>(null);
  const startTime = useRef<number>(0);

  const handleFinish = useCallback(() => {
    if (!containerRef.current) return;
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: isReducedMotion ? 0.05 : 0.4,
      ease: "power2.out",
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
        setVisible(false);
        setLoaded(true);
        start();
        document.body.style.overflow = "";
      },
    });
  }, [setLoaded, start]);

  useEffect(() => {
    // Check if user prefers reduced motion
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReducedMotion) {
      if (percentRef.current) percentRef.current.textContent = "100%";
      progressRef.current = 1;
      handleFinish();
      return;
    }

    // Lock scroll while preloader is active
    stop();
    document.body.style.overflow = "hidden";

    progressRef.current = 0;
    startTime.current = performance.now();

    const update = () => {
      const elapsed = (performance.now() - startTime.current) / 1000;
      // Target approaches 1 asymptotically, then snaps to 1 after ~1.4s
      const target = elapsed > 1.2 ? 1 : Math.min(0.85, 0.25 * elapsed + 0.1);
      progressRef.current += (target - progressRef.current) * 0.06;

      if (elapsed > 1.4 && progressRef.current > 0.96) {
        progressRef.current = 1;
      }

      if (percentRef.current) {
        percentRef.current.textContent = `${Math.floor(100 * progressRef.current)}%`;
      }

      if (progressRef.current >= 1) {
        handleFinish();
      } else {
        rafId.current = requestAnimationFrame(update);
      }
    };

    rafId.current = requestAnimationFrame(update);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      start();
      document.body.style.overflow = "";
    };
  }, [handleFinish, start, stop]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading site"
      className="fixed inset-0 z-[10000] flex h-screen w-full items-center justify-center bg-white pointer-events-none select-none transition-none"
    >
      {/* Centered black circle */}
      <div className="w-[2.38vh] h-[2.38vh] rounded-full bg-black" />

      {/* 0-100% counter positioned at top-right */}
      <span
        ref={percentRef}
        className="absolute top-grid-margin right-grid-margin text-heading-md text-black font-bold tracking-tight"
      >
        0%
      </span>
    </div>
  );
};
