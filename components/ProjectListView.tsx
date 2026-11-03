"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ProjectItem, PLACEHOLDER_PROJECTS } from "@/data/content";

interface ProjectListViewProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // GSAP open / close animations (spec animation #9 & #10)
  useEffect(() => {
    if (!panelRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // Panel: Overlay AutoAlpha + Container ScaleX & Slide (0.58s, power2.inOut)
      tl.to(panelRef.current, {
        autoAlpha: 1,
        duration: 0.58,
        ease: "power2.inOut",
      });

      // Rows: Staggered Y-Percent Slide & Fade In (0.46s, power3.out)
      tl.fromTo(
        ".project-list-row",
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.46,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Focus first project row for keyboard users
      setTimeout(() => {
        const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a");
        firstLink?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      gsap.to(panelRef.current, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
      setHoveredIdx(null);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key and focus trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
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
  }, [isOpen, onClose]);

  // Hover poster with 160ms delay (spec animation #11)
  const handleRowEnter = useCallback((index: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setHoveredIdx(index);
    }, 160);
  }, []);

  const handleRowLeave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setHoveredIdx(null);
    }, 100);
  }, []);

  const activeProject =
    hoveredIdx !== null ? PLACEHOLDER_PROJECTS[hoveredIdx] : null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Project list view"
      aria-hidden={!isOpen}
      style={{ opacity: 0, visibility: "hidden" }}
      className={`fixed inset-0 z-[60] bg-black text-white ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Background Hover Poster on Desktop (spec animation #11, col-start-4 col-span-6) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden md:grid grid-layout items-center justify-center"
      >
        <div className="relative col-start-4 col-span-6 aspect-[348/259] w-full max-w-[560px] overflow-hidden transition-opacity duration-300">
          {activeProject && (
            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-300"
              style={{
                background: activeProject.posterBg,
                opacity: 0.95,
              }}
            >
              {activeProject.imageUrl && (
                <Image
                  src={activeProject.imageUrl}
                  alt={activeProject.alt || activeProject.title}
                  width={1600}
                  height={1191}
                  sizes="560px"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {activeProject.videoUrl && (
                <video
                  key={activeProject.id}
                  poster={activeProject.imageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                >
                  {activeProject.webmUrl && <source src={activeProject.webmUrl} type="video/webm" />}
                  <source src={activeProject.videoUrl} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Project Index (spec section 10: cols 3-10 on desktop, full width on mobile/tablet) */}
      <div className="relative z-10 h-full w-full overflow-y-auto px-grid-margin pt-project-list-top pb-project-list-bottom hide-scrollbar">
        <div className="grid-layout">
          <div className="col-span-5 md:col-start-3 md:col-span-8">
            <ul ref={listRef} className="flex flex-col">
              {PLACEHOLDER_PROJECTS.map((project, idx) => (
                <li
                  key={project.id}
                  onMouseEnter={() => handleRowEnter(idx)}
                  onMouseLeave={handleRowLeave}
                  onPointerEnter={() => handleRowEnter(idx)}
                  onPointerLeave={handleRowLeave}
                  className="project-list-row group relative py-project-list-row cursor-pointer transition-colors duration-200"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    onClick={() => {
                      if (onSelectProject) onSelectProject(project);
                      if (onClose) onClose();
                    }}
                    onFocus={() => handleRowEnter(idx)}
                    onBlur={handleRowLeave}
                    className="block w-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {/* Row Content */}
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-heading-xl font-bold uppercase transition-transform duration-200 group-hover:translate-x-2 text-white">
                        {project.title}
                      </span>
                      <div className="flex items-baseline gap-6 text-right flex-shrink-0">
                        <span className="text-label text-white">
                          {project.client}
                        </span>
                        <span className="text-label text-white">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Animated Dashed Pixel Dividers (span[data-project-list-pixel], span[data-project-list-line]) */}
                    <div className="mt-4 flex items-center w-full">
                      <span
                        data-project-list-pixel="left"
                        className="w-[4px] h-[4px] bg-pixel-dot"
                      />
                      <span
                        data-project-list-line="true"
                        className="flex-1 h-[0.5px] bg-whatwedo-sector mx-1"
                      />
                      <span
                        data-project-list-pixel="right"
                        className="w-[4px] h-[4px] bg-pixel-dot"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-black via-black/80 to-transparent" />
    </div>
  );
};
