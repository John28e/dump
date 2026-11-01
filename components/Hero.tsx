"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLACEHOLDER_DATA } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    const ctx = gsap.context(() => {
      // Fade out the hero typography & light aperture mask on initial scroll
      gsap.to(overlayRef.current, {
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "45% top",
          scrub: true,
        },
      });
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative w-full bg-transparent text-black select-none">
      {/* Fixed typography and aperture overlay (fades out into dark mosaic on scroll) */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-10 grid-layout items-end pb-grid-margin pointer-events-none transition-opacity bg-transparent"
      >
        <h1
          className="c-hero_text col-span-4 md:col-span-6 text-heading-lg leading-[0.9] tracking-[-0.01em] text-black"
          dangerouslySetInnerHTML={{ __html: PLACEHOLDER_DATA.hero.tagline }}
        />
        <div className="col-start-[-2] col-span-1 text-label text-black text-right uppercase font-bold tracking-wider">
          {PLACEHOLDER_DATA.hero.hint}
        </div>
      </div>

      {/* Hero & Mosaic scroll tracks: h-svh plus 200svh scroll track per Requirement 3 */}
      <div className="h-[100svh] w-full pointer-events-none" />
      <div className="h-[200svh] w-full pointer-events-none" />
    </section>
  );
};
