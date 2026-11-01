import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;

  if (lenisInstance) return lenisInstance;

  gsap.registerPlugin(ScrollTrigger);

  lenisInstance = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.15,
    autoRaf: false, // We drive Lenis from GSAP's single ticker!
  });

  // Connect Lenis scroll to ScrollTrigger
  lenisInstance.on("scroll", ScrollTrigger.update);

  // Drive Lenis from GSAP single ticker
  gsap.ticker.add((time: number) => {
    if (lenisInstance) {
      lenisInstance.raf(time * 1000);
    }
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

