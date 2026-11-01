"use client";

import { useEffect, useCallback } from "react";
import { initLenis, getLenis } from "@/lib/lenis";

export function useLenisScroll() {
  useEffect(() => {
    initLenis();
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, options?: Record<string, unknown>) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, options);
    } else if (typeof window !== "undefined") {
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const stop = useCallback(() => {
    const lenis = getLenis();
    if (lenis) lenis.stop();
  }, []);

  const start = useCallback(() => {
    const lenis = getLenis();
    if (lenis) lenis.start();
  }, []);

  return { scrollTo, stop, start, lenis: getLenis() };
}

