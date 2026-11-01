"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectItem, PLACEHOLDER_PROJECTS } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const WorkGrid: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Per-column GSAP scrub parallax matching 1440_work_grid.png (spec animations #15)
  useEffect(() => {
    if (!sectionRef.current) return;

    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReducedMotion) {
      // In reduced motion, ensure cards remain at baseline without drift
      const cards = gsap.utils.toArray<HTMLElement>(".project-card", sectionRef.current);
      cards.forEach((card) => gsap.set(card, { y: 0 }));
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop (>= 1280px): 4 columns
      mm.add("(min-width: 1280px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card", sectionRef.current!);
        const fluidFactor = window.innerWidth / 151.2;
        // max drift 20 units (calc(100vw / 151.2 * 20))
        const drifts = [0, fluidFactor * 12, fluidFactor * -4, fluidFactor * 16];

        cards.forEach((card, idx) => {
          const col = idx % 4;
          const driftVal = drifts[col];
          if (driftVal !== 0) {
            gsap.to(card, {
              y: driftVal,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          }
        });
      });

      // Tablet (768px - 1279px): 3 columns
      mm.add("(min-width: 768px) and (max-width: 1279.98px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card", sectionRef.current!);
        const fluidFactor = window.innerWidth / 151.2;
        const drifts = [0, fluidFactor * 10, fluidFactor * -6];

        cards.forEach((card, idx) => {
          const col = idx % 3;
          const driftVal = drifts[col];
          if (driftVal !== 0) {
            gsap.to(card, {
              y: driftVal,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          }
        });
      });

      // Mobile (< 768px): 1 column -> No parallax drift per spec
      mm.add("(max-width: 767.98px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card", sectionRef.current!);
        cards.forEach((card) => {
          gsap.set(card, { y: 0 });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-10 w-full bg-black text-white px-grid-margin pt-section pb-[calc(var(--spacing-section)+var(--spacing-grid-drift))] grid grid-cols-1 gap-y-gap-xl min-[768px]:grid-cols-3 min-[1280px]:grid-cols-4 min-[768px]:gap-x-grid-gutter"
    >
      {PLACEHOLDER_PROJECTS.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
};

interface ProjectCardProps {
  project: ProjectItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const [haloPos, setHaloPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handlePointerEnter = useCallback(() => {
    setHaloPos((prev) => ({ ...prev, active: true }));
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHaloPos((prev) => ({ ...prev, active: false }));
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!mediaRef.current) return;
    const rect = mediaRef.current.getBoundingClientRect();
    setHaloPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  }, []);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card group block select-none cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {/* Media container: aspect ratio 348 / 259 */}
      <div
        ref={mediaRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        className="relative w-full aspect-[348/259] overflow-hidden bg-black"
        style={{ background: project.posterBg }}
      >
        {/* Real photographic poster asset via next/image */}
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.alt || `${project.title} - ${project.client}`}
            width={1600}
            height={1191}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
            priority={project.id === "proj-1" || project.id === "proj-2"}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
            <span className="text-label text-white/60 uppercase font-bold tracking-wider">
              {project.client}
            </span>
            <div className="w-12 h-1 bg-white/20" />
          </div>
        )}

        {/* Video stream overlay (autoplays on hover with Safari #t=0.001 fix) */}
        {project.videoUrl && (
          <video
            ref={videoRef}
            poster={project.imageUrl}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none opacity-0 group-hover:opacity-100"
          >
            {project.webmUrl && <source src={project.webmUrl} type="video/webm" />}
            <source src={project.videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Spotlight halo cursor tracker (radius ratio 0.7 per spec) */}
        {haloPos.active && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 210px at ${haloPos.x}px ${haloPos.y}px, rgba(255, 255, 255, 0.2), transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* Project Card Metadata Layout */}
      <div
        className="grid mt-gap-sm items-start"
        style={{
          gridTemplateColumns: "73% 1fr",
          gap: "var(--spacing-gap-lg)",
        }}
      >
        <h3 className="text-heading-lg uppercase mt-[-0.2rem] text-white tracking-tight group-hover:text-gray-200 transition-colors">
          {project.title}
        </h3>
        <div className="text-right">
          <p className="text-label text-card-year">{project.year}</p>
          <p className="text-body-sm text-white">{project.client}</p>
        </div>
      </div>
    </Link>
  );
};
