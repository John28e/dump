"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/Header";
import { MobileMenu } from "@/components/MobileMenu";
import { Hero } from "@/components/Hero";
import { WorkGrid } from "@/components/WorkGrid";
import { ViewToggle } from "@/components/ViewToggle";
import { ProjectListView } from "@/components/ProjectListView";
import { AboutStatement } from "@/components/AboutStatement";
import { HowWeWork } from "@/components/HowWeWork";
import { WhatWeDo } from "@/components/WhatWeDo";
import { WorldwideSection } from "@/components/WorldwideSection";
import { ContactModal } from "@/components/ContactModal";

// Client-only dynamic WebGL layer (Requirement 1)
const GlobalCanvas = dynamic(
  () => import("@/components/GlobalCanvas").then((mod) => mod.GlobalCanvas),
  { ssr: false }
);

export default function Home() {
  // Initialize Lenis connected to GSAP ScrollTrigger on single ticker
  useLenisScroll();

  // Floating View Toggle: Switch between Grid View and List View
  const [isListView, setIsListView] = useState(false);

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 0. Fixed fullscreen WebGL canvas (#global-canvas, animations #4, #23) */}
      <GlobalCanvas />

      {/* 1. Preloader curtain & counter (animations #1-2) */}
      <Preloader />

      {/* 2. Header (fixed navbar with ScrollTrigger color switcher) */}
      <Header />

      {/* 3. Mobile Menu Overlay (animations #26-27) */}
      <MobileMenu />

      {/* 4. Hero Statement Overlay (#hero) */}
      <Hero />

      {/* 5. Work Section (#work): 8 projects, 4/3/1 cols, parallax drift, hover video/spotlight */}
      <WorkGrid />

      {/* Floating View Toggle Button (102x54px, visible only in #work, animations #5-8) */}
      <ViewToggle
        isListView={isListView}
        onToggle={() => setIsListView((prev) => !prev)}
      />

      {/* Project List View Overlay (animations #9-11, row anatomy, hover poster) */}
      <ProjectListView
        isOpen={isListView}
        onClose={() => setIsListView(false)}
      />

      {/* 6. About Section (#about): About Statement, Behind the Scenes (Embla), What We Do */}
      <section
        id="about"
        className="relative z-10 w-full bg-white text-black overflow-hidden"
      >
        {/* About Statement (#about overline + justified statement) */}
        <AboutStatement />

        {/* How We Work Curved Row (replaces Behind the Scenes carousel) */}
        <HowWeWork />

        {/* What We Do (3 boxes: Services, Clients, Sectors, corner dots, scrubbed rotate -6 to 0) */}
        <WhatWeDo />
      </section>

      {/* 7. Worldwide Section (#worldwide): 100lvh, side texts, globe placeholder, closing CTA, footer */}
      <WorldwideSection />

      {/* 8. Contact Modal ("Available worldwide" 3D card, animations #28-32) */}
      <ContactModal />
    </main>
  );
}
