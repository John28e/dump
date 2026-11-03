"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useAppStore } from "@/lib/store";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import {
  ProgressiveFluxLoader,
  ProgressiveFluxPhase,
} from "@/components/ui/progressive-flux-loader";

const PRELOADER_PHASES: ProgressiveFluxPhase[] = [
  { at: 0, label: "discover" },
  { at: 35, label: "design" },
  { at: 70, label: "develop" },
  { at: 100, label: "deploy" },
];

export const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const setLoaded = useAppStore((s) => s.setLoaded);
  const { stop, start } = useLenisScroll();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const rafId = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const isCompletingRef = useRef(false);

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

    // Lock scroll while preloader is active
    stop();
    document.body.style.overflow = "hidden";

    if (isReducedMotion) {
      progressRef.current = 1;
      displayedProgressRef.current = 100;
      setProgress(100);
      const EXIT_HOLD_MS = 150;
      holdTimer.current = window.setTimeout(() => {
        handleFinish();
      }, EXIT_HOLD_MS);
      return () => {
        if (holdTimer.current) clearTimeout(holdTimer.current);
        start();
        document.body.style.overflow = "";
      };
    }

    progressRef.current = 0;
    displayedProgressRef.current = 0;
    startTime.current = performance.now();
    isCompletingRef.current = false;

    const update = () => {
      const elapsed = (performance.now() - startTime.current) / 1000;
      // Target approaches 1 asymptotically, then snaps to 1 after ~1.4s
      const target = elapsed > 1.2 ? 1 : Math.min(0.85, 0.25 * elapsed + 0.1);
      progressRef.current += (target - progressRef.current) * 0.06;

      if (elapsed > 1.4 && progressRef.current > 0.96) {
        progressRef.current = 1;
      }

      const rawProgress = Math.min(100, Math.max(0, progressRef.current * 100));
      // Stretch displayed value so label sequence lasts at least 1.8 seconds:
      // at any elapsed < 1.8s, progress is capped by (elapsed / 1.8) * 100.
      const timeCappedProgress = (elapsed / 1.8) * 100;
      const candidate = Math.min(rawProgress, timeCappedProgress);
      const nextDisplay = Math.min(
        100,
        Math.max(displayedProgressRef.current, candidate),
      );
      displayedProgressRef.current = nextDisplay;
      setProgress(nextDisplay);

      if (nextDisplay >= 100 && rawProgress >= 100) {
        if (!isCompletingRef.current) {
          isCompletingRef.current = true;
          const EXIT_HOLD_MS = 700;
          holdTimer.current = window.setTimeout(() => {
            handleFinish();
          }, EXIT_HOLD_MS);
        }
      } else {
        rafId.current = requestAnimationFrame(update);
      }
    };

    rafId.current = requestAnimationFrame(update);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (holdTimer.current) clearTimeout(holdTimer.current);
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
      <div
        className="flex w-full h-full items-center justify-center px-6"
        style={
          {
            "--flux-from": "#7d0a1a",
            "--flux-to": "#ff3b55",
          } as React.CSSProperties
        }
      >
        <ProgressiveFluxLoader
          value={progress}
          phases={PRELOADER_PHASES}
          barClassName="bg-black/10"
          textClassName="uppercase font-bold text-black"
        />
      </div>
    </div>
  );
};
