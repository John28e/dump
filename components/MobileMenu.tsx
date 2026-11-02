"use client";

import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { PLACEHOLDER_DATA } from "@/data/content";

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu, openContact } = useAppStore();
  const { scrollTo } = useLenisScroll();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);

  // Return focus to mobile-menu-trigger on close
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Focus first item when opened
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 50);
    }
  }, [isMobileMenuOpen]);

  // Handle ESC key and Focus Trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobileMenuOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu();
        const trigger = document.getElementById("mobile-menu-trigger");
        trigger?.focus();
        return;
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusables = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  const handleNav = (anchor: string) => {
    closeMobileMenu();
    setTimeout(() => {
      scrollTo(`#${anchor}`);
    }, 350);
  };

  const handleContact = () => {
    closeMobileMenu();
    setTimeout(() => {
      openContact();
    }, 350);
  };

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      aria-hidden={!isMobileMenuOpen}
      inert={!isMobileMenuOpen || undefined}
      className={`fixed inset-0 z-[100] flex flex-col items-end justify-center bg-black px-grid-margin text-white transition-opacity duration-300 ease-out md:hidden select-none ${
        isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ul className="text-right flex flex-col gap-3">
        <li>
          <button
            ref={firstFocusableRef}
            type="button"
            onClick={() => handleNav("work")}
            className="text-display cursor-pointer hover:opacity-75 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ fontSize: "7.5vh", lineHeight: 1 }}
          >
            Work
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => handleNav("about")}
            className="text-display cursor-pointer hover:opacity-75 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ fontSize: "7.5vh", lineHeight: 1 }}
          >
            About
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={handleContact}
            className="text-display cursor-pointer hover:opacity-75 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ fontSize: "7.5vh", lineHeight: 1 }}
          >
            Contact
          </button>
        </li>
      </ul>

      {/* Social links at bottom right */}
      <ul className="absolute right-grid-margin bottom-[20px] text-right flex flex-col gap-1.5">
        {PLACEHOLDER_DATA.contact.socials.map((s) => (
          <li key={s.name}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-menu hover:opacity-70 transition-opacity font-bold uppercase rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ fontSize: "2.35vh" }}
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
