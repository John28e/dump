"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLACEHOLDER_DATA } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const WhatWeDo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll-scrubbed opacity + rotate -6 to 0 (trigger top 90% to 45%) & corner dots 0.15s stagger
  useEffect(() => {
    if (!containerRef.current) return;

    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const boxes = gsap.utils.toArray<HTMLElement>(".whatwedo-box", containerRef.current);

    if (isReducedMotion) {
      boxes.forEach((box) => {
        gsap.set(box, { opacity: 1, rotate: 0 });
        const dots = box.querySelectorAll<HTMLElement>("[data-dot]");
        dots.forEach((dot) => gsap.set(dot, { opacity: 1, scale: 1 }));
      });
      return;
    }

    const ctx = gsap.context(() => {
      boxes.forEach((box) => {
        // Spec animation #21: Scroll Enter (top 90% -> 45%) | GSAP FromTo Opacity (0 -> 1) & Rotate (-6deg -> 0deg)
        gsap.fromTo(
          box,
          { opacity: 0, rotate: -6, transformOrigin: "top right" },
          {
            opacity: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: box,
              start: "top 90%",
              end: "top 45%",
              scrub: true,
            },
          }
        );

        // Spec animation #22: Corner dots (data-dot) staggered opacity fade in (0.15s stagger)
        const dots = box.querySelectorAll<HTMLElement>("[data-dot]");
        if (dots.length > 0) {
          gsap.fromTo(
            dots,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: box,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full bg-background text-foreground pt-section pb-whatwedo-top select-none overflow-hidden"
    >
      {/* Section Title */}
      <div className="grid-layout mb-whatwedo-top">
        <h2 className="col-span-5 md:col-start-3 md:col-span-8 text-left text-heading-xl text-foreground font-bold uppercase tracking-tight">
          {PLACEHOLDER_DATA.whatWeDo.title}
        </h2>
      </div>

      {/* Row 1: Services & Clients (spec section 3: row 1 has 2 boxes w: 50%/50% on desktop/tablet; stacked on mobile) */}
      <div className="grid-layout mb-gap-lg">
        <div className="relative z-10 col-span-5 md:col-start-3 md:col-span-8 flex flex-col md:flex-row gap-gap-md md:gap-4">
          {/* Services Box (tumble-deck oklab surface theme) */}
          <div className="whatwedo-box relative w-full md:w-1/2 rounded-[3px] bg-[color-mix(in_oklab,var(--color-foreground)_4%,var(--color-background))] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)] p-whatwedo-box-p flex flex-col justify-between transition-colors">
            {/* 4 Corner Dots (data-dot, 0.15s stagger) */}
            <span
              data-dot="true"
              className="absolute top-0 left-0 w-[4px] h-[4px] bg-foreground -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute top-0 right-0 w-[4px] h-[4px] bg-foreground translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute bottom-0 left-0 w-[4px] h-[4px] bg-foreground -translate-x-1/2 translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute bottom-0 right-0 w-[4px] h-[4px] bg-foreground translate-x-1/2 translate-y-1/2 pointer-events-none rounded-[1px]"
            />

            <div>
              <p className="text-label text-[color-mix(in_oklab,var(--color-foreground)_65%,transparent)] font-mono font-bold uppercase tracking-wider mb-2">
                01 / SERVICES
              </p>
              <h3 className="text-heading-lg font-bold uppercase tracking-tight text-foreground mb-6">
                Disciplines
              </h3>
            </div>

            <ul className="flex flex-col gap-2.5">
              {PLACEHOLDER_DATA.whatWeDo.services.map((srv) => (
                <li
                  key={srv}
                  className="text-body-md font-bold uppercase tracking-tight text-foreground border-b border-[color-mix(in_oklab,var(--color-foreground)_10%,transparent)] pb-1.5 last:border-none"
                >
                  {srv}
                </li>
              ))}
            </ul>
          </div>

          {/* Clients Box (tumble-deck oklab surface theme) */}
          <div className="whatwedo-box relative w-full md:w-1/2 rounded-[3px] bg-[color-mix(in_oklab,var(--color-foreground)_7%,var(--color-background))] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)] p-whatwedo-box-p flex flex-col justify-between transition-colors">
            {/* 4 Corner Dots (data-dot, 0.15s stagger) */}
            <span
              data-dot="true"
              className="absolute top-0 left-0 w-[4px] h-[4px] bg-foreground -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute top-0 right-0 w-[4px] h-[4px] bg-foreground translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute bottom-0 left-0 w-[4px] h-[4px] bg-foreground -translate-x-1/2 translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute bottom-0 right-0 w-[4px] h-[4px] bg-foreground translate-x-1/2 translate-y-1/2 pointer-events-none rounded-[1px]"
            />

            <div>
              <p className="text-label text-[color-mix(in_oklab,var(--color-foreground)_65%,transparent)] font-mono font-bold uppercase tracking-wider mb-2">
                02 / CLIENTS
              </p>
              <h3 className="text-heading-lg font-bold uppercase tracking-tight text-foreground mb-6">
                Clients
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {PLACEHOLDER_DATA.whatWeDo.clients.map((client) => (
                <span
                  key={client}
                  className="text-body-sm font-bold uppercase tracking-tight text-foreground truncate"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Sectors Box (tumble-deck oklab surface theme) */}
      <div className="grid-layout">
        <div className="col-span-5 md:col-start-3 md:col-span-8">
          <div className="whatwedo-box relative w-full rounded-[3px] bg-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)] p-whatwedo-box-p flex flex-col justify-between transition-colors">
            {/* 4 Corner Dots (data-dot, 0.15s stagger) */}
            <span
              data-dot="true"
              className="absolute top-0 left-0 w-[4px] h-[4px] bg-foreground -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute top-0 right-0 w-[4px] h-[4px] bg-foreground translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute bottom-0 left-0 w-[4px] h-[4px] bg-foreground -translate-x-1/2 translate-y-1/2 pointer-events-none rounded-[1px]"
            />
            <span
              data-dot="true"
              className="absolute bottom-0 right-0 w-[4px] h-[4px] bg-foreground translate-x-1/2 translate-y-1/2 pointer-events-none rounded-[1px]"
            />

            <div className="mb-4">
              <p className="text-label text-[color-mix(in_oklab,var(--color-foreground)_65%,transparent)] font-mono font-bold uppercase tracking-wider mb-2">
                03 / SECTORS
              </p>
              <h3 className="text-heading-lg font-bold uppercase tracking-tight text-foreground mb-4">
                Industries
              </h3>
            </div>

            <p className="text-body-md text-foreground leading-relaxed font-medium uppercase tracking-tight">
              {PLACEHOLDER_DATA.whatWeDo.sectors}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
