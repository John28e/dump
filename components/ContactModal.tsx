"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useAppStore } from "@/lib/store";
import { CopyEmail } from "./CopyEmail";

const CONTACT_EMAILS = [
  { label: "Projects", email: "projects@dump.example" },
  { label: "Partnerships", email: "partnerships@dump.example" },
  { label: "General", email: "general@dump.example" },
  { label: "Invoicing", email: "invoicing@dump.example" },
];

export const ContactModal: React.FC = () => {
  const { isContactOpen, closeContact } = useAppStore();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const blurVal = useRef({ value: 0 });
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Focus restoration & initial focus
  const handleClose = useCallback(() => {
    closeContact();
    if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, [closeContact]);

  // Track trigger element when opening & manage focus trapping
  useEffect(() => {
    if (isContactOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }
  }, [isContactOpen]);

  // Escape key and Focus Trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isContactOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [isContactOpen, handleClose]);

  // GSAP 3D Open / Close Animations (#28-31) with prefers-reduced-motion check
  useEffect(() => {
    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) return;

    const isDesktop = window.innerWidth >= 768;
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isContactOpen) {
      document.body.style.overflow = "hidden";
      overlay.style.display = "flex";

      if (isReducedMotion) {
        gsap.to(overlay, { opacity: 1, duration: 0.1 });
        gsap.to(card, { opacity: 1, duration: 0.1 });
        return;
      }

      const tl = gsap.timeline();

      // #28: Backdrop fade (0.4s linear) + backdrop blur (0 -> 30px, 0.6s none)
      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.4,
          ease: "linear",
        },
        0
      );

      tl.to(
        blurVal.current,
        {
          value: 30,
          duration: 0.6,
          ease: "none",
          onUpdate: () => {
            const blur = `blur(${blurVal.current.value}px)`;
            overlay.style.backdropFilter = blur;
            (overlay.style as unknown as Record<string, string>)["webkitBackdropFilter"] = blur;
          },
        },
        0
      );

      // #29: Desktop Card 3D Flip from Left
      if (isDesktop) {
        tl.fromTo(
          card,
          {
            rotateY: -60,
            x: -300,
            z: 300,
            scale: 0.5,
            skewX: -40,
            opacity: 1,
          },
          {
            rotateY: 0,
            x: 0,
            z: 0,
            scale: 1,
            skewX: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          0
        );
      } else {
        // #31: Mobile Card Fade In
        tl.fromTo(
          card,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          0.1
        );
      }
    } else {
      document.body.style.overflow = "";

      if (isReducedMotion) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.05,
          onComplete: () => {
            if (overlay) overlay.style.display = "none";
          },
        });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (overlay) {
            overlay.style.display = "none";
          }
        },
      });

      // #28: Backdrop fade out (0.3s linear) + blur to 0 (0.6s power1.out)
      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.3,
          ease: "linear",
        },
        0.1
      );

      tl.to(
        blurVal.current,
        {
          value: 0,
          duration: 0.6,
          ease: "power1.out",
          onUpdate: () => {
            const blur = `blur(${blurVal.current.value}px)`;
            overlay.style.backdropFilter = blur;
            (overlay.style as unknown as Record<string, string>)["webkitBackdropFilter"] = blur;
          },
        },
        0.1
      );

      // #30: Desktop Card 3D Flip to Right
      if (isDesktop) {
        tl.to(
          card,
          {
            rotateY: 75,
            x: 300,
            z: 300,
            scale: 0.5,
            skewX: 30,
            duration: 0.5,
            ease: "power2.in",
          },
          0
        );
      } else {
        // #31: Mobile Card Fade Out
        tl.to(
          card,
          { opacity: 0, duration: 0.3, ease: "power2.in" },
          0
        );
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isContactOpen]);

  // #32: Close button hover animation
  const handleCloseEnter = () => {
    if (closeBtnRef.current) {
      gsap.to(closeBtnRef.current, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    }
  };
  const handleCloseLeave = () => {
    if (closeBtnRef.current) {
      gsap.to(closeBtnRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Contact card modal"
      aria-hidden={!isContactOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{ opacity: 0, display: "none" }}
      className="fixed inset-0 z-[100] items-center justify-center bg-black/30 p-[12px] select-none"
    >
      {/* 3D Perspective Context (800px) */}
      <div
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
        className="w-full max-w-4xl h-auto max-h-[92vh] flex items-center justify-center pointer-events-auto"
      >
        <div
          ref={cardRef}
          className="relative w-full max-w-full h-full md:h-auto bg-white text-black p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[88vh] hide-scrollbar [backface-visibility:hidden]"
        >
          {/* Close button with pixel dashed border and hover animation (#32) */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            onMouseEnter={handleCloseEnter}
            onMouseLeave={handleCloseLeave}
            aria-label="Close contact dialog"
            className="absolute top-[1.2rem] right-[1.2rem] md:top-[2.4rem] md:right-[2.4rem] cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <svg
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Close"
              className="block"
            >
              <rect
                x="1.5"
                y="1.5"
                width="51"
                height="51"
                fill="white"
                stroke="black"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              <path d="M18 18L36 36M36 18L18 36" stroke="black" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Headline */}
          <h2 className="text-heading-xl text-black leading-[0.8em] mt-[3rem] md:mt-0 mb-8 md:mb-10 text-left">
            Open for new <br /> projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 items-end">
            {/* Simple original architectural graphic (not copying original sign.svg) */}
            <div className="md:col-span-2 flex flex-col justify-end">
              <svg
                width="80"
                height="122"
                viewBox="0 0 80 122"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-auto text-black"
                aria-hidden="true"
              >
                {/* Original geometric architectural totem */}
                <rect x="37" y="0" width="6" height="122" fill="currentColor" />
                <rect x="6" y="16" width="68" height="24" fill="currentColor" />
                <line x1="6" y1="28" x2="74" y2="28" stroke="white" strokeWidth="2" />
                <polygon points="40,56 72,76 8,76" fill="currentColor" />
                <circle cx="40" cy="102" r="10" fill="currentColor" />
                <circle cx="40" cy="102" r="5" fill="white" />
              </svg>
            </div>

            {/* Studio Address & Socials */}
            <div className="md:col-span-2 flex flex-col justify-between gap-6 text-left">
              <div className="text-body-md text-black leading-relaxed">
                <p className="font-bold tracking-tight uppercase">STUDIO DUMP</p>
                <p>BY APPOINTMENT</p>
                <p>KOCHI, KERALA</p>
                <p className="font-bold text-xs text-gray-500 mt-1 uppercase">INDIA</p>
              </div>

              {/* Social links (Instagram, LinkedIn, Behance) with href="#" */}
              <div className="flex flex-col gap-1">
                {["Instagram", "LinkedIn", "Behance"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-heading-md text-black hover:opacity-70 transition-opacity font-bold uppercase rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* 4 Email Rows with CopyEmail (#33) */}
            <div className="md:col-span-2 flex flex-col gap-5 text-left">
              {CONTACT_EMAILS.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <p className="text-heading-md text-black font-bold uppercase mb-0.5">
                    {item.label}
                  </p>
                  <CopyEmail
                    email={item.email}
                    className="text-body-md text-black underline underline-offset-4 hover:opacity-75 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    {item.email}
                  </CopyEmail>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
