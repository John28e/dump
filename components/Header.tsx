"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/lib/store";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { PLACEHOLDER_DATA } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Data-driven map keyed by section id to text color
const SECTION_COLORS: Record<string, string> = {
  hero: "#000000",
  work: "#ffffff",
  about: "#000000",
  worldwide: "#ffffff",
};

export const Header: React.FC = () => {
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openContact,
  } = useAppStore();

  const { scrollTo } = useLenisScroll();
  const [currentColor, setCurrentColor] = useState(SECTION_COLORS.hero);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Statement (white background) -> text black
      ScrollTrigger.create({
        id: "header-color-hero",
        trigger: "#hero",
        start: "top 60px",
        end: "100svh 60px",
        onEnter: () => setCurrentColor("#000000"),
        onEnterBack: () => setCurrentColor("#000000"),
      });

      // 2. Mosaic track & Work grid (black background) -> text white
      ScrollTrigger.create({
        id: "header-color-mosaic-work",
        trigger: "#hero",
        start: "100svh 60px",
        endTrigger: "#work",
        end: "bottom 60px",
        onEnter: () => setCurrentColor("#ffffff"),
        onEnterBack: () => setCurrentColor("#ffffff"),
      });

      // 3. About section (white background) -> text black
      ScrollTrigger.create({
        id: "header-color-about",
        trigger: "#about",
        start: "top 60px",
        end: "bottom 60px",
        onEnter: () => setCurrentColor("#000000"),
        onEnterBack: () => setCurrentColor("#000000"),
      });

      // 4. Worldwide & Footer (black background) -> text white
      ScrollTrigger.create({
        id: "header-color-worldwide",
        trigger: "#worldwide",
        start: "top 60px",
        end: "bottom bottom",
        onEnter: () => setCurrentColor("#ffffff"),
        onEnterBack: () => setCurrentColor("#ffffff"),
      });
    });

    return () => ctx.revert();
  }, []);

  const activeColor = isMobileMenuOpen ? "#ffffff" : currentColor;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMobileMenuOpen) {
      closeMobileMenu();
      setTimeout(() => scrollTo(0), 350);
    } else {
      scrollTo(0);
    }
  };

  const handleNavClick = (anchor: string) => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
      setTimeout(() => scrollTo(`#${anchor}`), 350);
    } else {
      scrollTo(`#${anchor}`);
    }
  };

  return (
    <header
      style={{ color: activeColor }}
      className={`fixed top-0 right-0 left-0 ${
        isMobileMenuOpen ? "z-[110]" : "z-50"
      } flex items-center justify-between bg-transparent p-grid-margin pt-header-pad-top transition-colors duration-300 pointer-events-auto`}
    >
      {/* Brand text wordmark */}
      <a
        href="#"
        onClick={handleLogoClick}
        aria-label={`${PLACEHOLDER_DATA.brand} — Home`}
        className="block w-header-logo-w transition-opacity duration-300 hover:opacity-80 select-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <span className="font-futura font-bold text-heading-lg tracking-tight uppercase inline-flex items-center gap-1.5">
          <svg
            viewBox="0 0 16 16"
            className="w-3.5 h-3.5 fill-current inline-block flex-shrink-0"
            aria-hidden="true"
          >
            <rect width="7" height="7" x="1" y="1" />
            <rect width="7" height="7" x="8" y="8" />
          </svg>
          <span>{PLACEHOLDER_DATA.brand}</span>
        </span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:block" aria-label="Main Navigation">
        <ul className="flex items-center gap-header-nav-gap">
          <li>
            <button
              type="button"
              onClick={() => handleNavClick("work")}
              className="text-nav cursor-pointer hover:opacity-70 transition-opacity font-bold uppercase rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Work
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleNavClick("about")}
              className="text-nav cursor-pointer hover:opacity-70 transition-opacity font-bold uppercase rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              About
            </button>
          </li>
          <li>
            <button
              id="nav-contact-btn"
              type="button"
              onClick={openContact}
              className="text-nav cursor-pointer hover:opacity-70 transition-opacity font-bold uppercase rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu / Close Trigger */}
      <button
        id="mobile-menu-trigger"
        type="button"
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="flex items-center gap-gap-sm text-menu transition-opacity duration-300 md:hidden cursor-pointer select-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <span>{isMobileMenuOpen ? "Close" : "Menu"}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`block h-auto transition-transform duration-300 ease-out w-header-menu-icon ${
            isMobileMenuOpen ? "-rotate-45" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          {/* Pixelated hamburger / cross icon */}
          <rect x="2" y="5" width="20" height="2" fill="currentColor" />
          <rect x="2" y="11" width="20" height="2" fill="currentColor" />
          <rect x="2" y="17" width="20" height="2" fill="currentColor" />
        </svg>
      </button>
    </header>
  );
};
