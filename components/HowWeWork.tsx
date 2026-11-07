"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLACEHOLDER_BTS } from "@/data/content";
import type { TiltedGridImage } from "@/components/ui/tilted-grid-hero";

// Lazy-mount TiltedGridHero without SSR
const TiltedGridHero = dynamic(
  () => import("@/components/ui/tilted-grid-hero").then((mod) => mod.TiltedGridHero),
  { ssr: false }
);

// Module-level image definition so preload effect never re-runs on re-renders
const BTS_IMAGES: TiltedGridImage[] = PLACEHOLDER_BTS.map((item) => ({
  src: item.imageUrl || "",
  alt: item.alt || item.title,
}));

// Tuned named constants matching site specifications
const ASPECT_RATIO = 400 / 527; // Portrait tiles matching 1000x1316 source ratio
const TILE_HEIGHT = 58;         // Percentage of container height
const GAP = 8;                 // Gap percentage
const AXIS = 50;                // Vertical center percentage
const CURVE = 78;               // Cylinder bend in degrees
const FADE = 14;                // End fade width percentage
const SPEED = 5;                // Seconds per tile advancement

// Five development stages defined in content categories
const STAGES = [
  "01 STRATEGY",
  "02 IDENTITY",
  "03 DESIGN",
  "04 DEVELOPMENT",
  "05 LAUNCH",
];

export const HowWeWork: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver gate: only load images when within 600px of viewport
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Active visibility tracking for pausing animation when offscreen or tab hidden
  const [isPaused, setIsPaused] = useState(false);

  // Fallback check for browser container queries support
  const [supportsContainerQueries, setSupportsContainerQueries] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.CSS && window.CSS.supports) {
      const hasCQ =
        window.CSS.supports("container-type", "size") &&
        window.CSS.supports("width", "10cqw");
      setSupportsContainerQueries(hasCQ);
    }
  }, []);

  // Near-viewport lazy-mount trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    nearObserver.observe(el);
    return () => nearObserver.disconnect();
  }, []);

  // Pause animation when off-screen or tab is backgrounded
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    viewObserver.observe(el);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else if (el) {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsPaused(!inView);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Refresh ScrollTrigger positions after lazy mounting
  useEffect(() => {
    if (isNearViewport && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isNearViewport]);

  return (
    <div
      ref={sectionRef}
      className={`pt-ww-carousel-top pb-12 w-full overflow-hidden select-none ${
        isPaused ? "tgh-paused" : ""
      }`}
    >
      {/* Global pause rule for tiles inside this wrapper and reduced-motion handling */}
      <style>{`
        .tgh-paused [class*="tgh-t-"] {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="tgh-t-"] {
            animation-play-state: paused !important;
          }
        }
      `}</style>

      {/* Heading Block */}
      <div className="flex items-center gap-gap-lg px-grid-margin mb-gap-lg">
        <h3 className="text-heading-md font-bold uppercase tracking-tight text-black">
          How we work
        </h3>
      </div>

      {/* Visually hidden ordered list for screen readers and search engines */}
      <div className="sr-only">
        <h4>Our 12-Step Process and Methodology</h4>
        <ol>
          {PLACEHOLDER_BTS.map((item, idx) => (
            <li key={item.id}>
              <h5>
                Step {idx + 1}: {item.title} ({item.category})
              </h5>
              <p>{item.backTitle}</p>
              <p>{item.backText}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Curved Row Band with Definite Reserved Height */}
      <div className="relative w-full h-[62svh] md:h-[min(78svh,780px)] min-h-[420px] md:min-h-[520px] overflow-hidden">
        {isNearViewport ? (
          supportsContainerQueries ? (
            <TiltedGridHero
              images={BTS_IMAGES}
              speed={SPEED}
              tileHeight={TILE_HEIGHT}
              aspectRatio={ASPECT_RATIO}
              gap={GAP}
              axis={AXIS}
              curve={CURVE}
              fade={FADE}
              className="w-full h-full"
            />
          ) : (
            /* Fallback for browsers without container queries */
            <div
              className="w-full h-full flex items-center justify-center gap-4 overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
              }}
            >
              {BTS_IMAGES.slice(0, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative h-[58%] aspect-[400/527] flex-shrink-0 bg-black/10 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          /* Reserved height placeholder before near-viewport trigger to prevent CLS */
          <div className="w-full h-full" aria-hidden="true" />
        )}
      </div>

      {/* Visible Stage Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2 mt-8 px-grid-margin select-none">
        {STAGES.map((stage, idx) => (
          <React.Fragment key={stage}>
            <span className="text-label text-black font-bold uppercase tracking-wider">
              {stage}
            </span>
            {idx < STAGES.length - 1 && (
              <span aria-hidden="true" className="text-black/30 font-bold select-none">
                ·
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HowWeWork;

