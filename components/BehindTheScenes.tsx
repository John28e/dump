"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { PLACEHOLDER_BTS, BtsCardItem } from "@/data/content";

export const BehindTheScenes: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    loop: true,
    align: "start",
  });

  // Track Embla scroll progress for top progress bar (spec animation #17)
  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
    };
  }, [emblaApi, onScroll]);

  return (
    <div className="pt-ww-carousel-top pb-12 w-full overflow-hidden select-none">
      {/* Carousel Header with Title and Linear Progress Indicator Bar */}
      <div className="flex items-center gap-gap-lg px-grid-margin mb-gap-lg">
        <h3 className="text-heading-md font-bold uppercase tracking-tight text-black">
          How we work
        </h3>
        <div
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="How we work carousel scroll progress"
          className="relative w-32 h-[2px] bg-gray-200 overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-black will-change-transform"
            style={{
              transform: `translate3d(${-100 + scrollProgress * 100}%, 0, 0)`,
              transition: "transform 0.05s linear",
            }}
          />
        </div>
      </div>

      {/* Embla Carousel Viewport */}
      <div
        ref={emblaRef}
        className="w-full overflow-hidden cursor-grab active:cursor-grabbing px-grid-margin"
      >
        <div className="flex gap-gap-md">
          {PLACEHOLDER_BTS.map((item) => (
            <BtsCard key={item.id} item={item} emblaApi={emblaApi} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface BtsCardProps {
  item: BtsCardItem;
  emblaApi: ReturnType<typeof useEmblaCarousel>[1];
}

const BtsCard: React.FC<BtsCardProps> = ({ item, emblaApi }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const innerMediaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Inner image / media horizontal parallax on drag & scroll (spec animation #18)
  const updateParallax = useCallback(() => {
    if (!cardRef.current || !innerMediaRef.current) return;
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReducedMotion) {
      innerMediaRef.current.style.transform = "none";
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    // Calculate distance from center of viewport (-1 to +1)
    const cardCenter = rect.left + rect.width / 2;
    const offsetRatio = (cardCenter - viewportWidth / 2) / (viewportWidth / 2);
    // Subtle inner parallax shift (-15px to +15px)
    const parallaxX = -offsetRatio * 15;
    innerMediaRef.current.style.transform = `translateX(${parallaxX}px) scale(1.08)`;
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    updateParallax();
    emblaApi.on("scroll", updateParallax);
    emblaApi.on("reInit", updateParallax);
    return () => {
      emblaApi.off("scroll", updateParallax);
      emblaApi.off("reInit", updateParallax);
    };
  }, [emblaApi, updateParallax]);

  // Video autoplay on hover (spec animation #19)
  const handlePointerEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handlePointerLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // 3D Flip on click on DESKTOP ONLY (spec animation #20, disabled on mobile and on reduced motion)
  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!isReducedMotion) {
        setIsFlipped((prev) => !prev);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      ref={cardRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      aria-label={`${item.title} — ${item.category}`}
      className="group flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] select-none cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      style={{ perspective: "1000px" }}
    >
      {/* Responsive Aspect Ratio: mobile 305/402, desktop/tablet 400/527 */}
      <div className="relative aspect-[305/402] md:aspect-[400/527] w-full">
        <div
          className="relative w-full h-full transition-transform duration-600"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 overflow-hidden bg-black p-gap-md flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Parallax Inner Media Frame */}
            <div
              ref={innerMediaRef}
              className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
              style={{
                background: item.posterBg,
                transition: "transform 0.1s linear",
              }}
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.alt || item.title}
                  width={1000}
                  height={1316}
                  sizes="(min-width: 768px) 380px, 320px"
                  className="w-full h-full object-cover"
                />
              )}
              {item.videoUrl && (
                <video
                  ref={videoRef}
                  poster={item.imageUrl}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {item.webmUrl && <source src={item.webmUrl} type="video/webm" />}
                  <source src={item.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

            {/* Card Front Top Metadata: Category & Plus icon */}
            <div className="relative z-10 flex justify-between items-start pointer-events-none">
              <span className="text-label text-white font-bold bg-black/60 px-2 py-1 uppercase tracking-wider">
                {item.category}
              </span>
              <button
                type="button"
                tabIndex={isFlipped ? -1 : 0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="text-white text-xs bg-black/60 p-1 hidden md:block rounded-sm pointer-events-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`View details for ${item.title}`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            {/* Card Front Title */}
            <div className="relative z-10 pointer-events-none">
              <h4 className="text-heading-md font-bold text-white tracking-tight uppercase">
                {item.title}
              </h4>
            </div>
          </div>

          {/* Back Face (180deg flipped, spec color #171717) */}
          <div
            className="absolute inset-0 bg-neutral-900 text-white p-gap-lg flex flex-col justify-between border border-neutral-800"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Top Row: Category + Close/Cross Icon */}
            <div className="flex justify-between items-center">
              <span className="text-label text-gray-400 font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <button
                type="button"
                tabIndex={isFlipped ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-white/60 hover:text-white cursor-pointer p-2.5 -m-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`Close details for ${item.title}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="rotate-45"
                >
                  <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            {/* Back Face Title & Description */}
            <div className="flex-1 flex flex-col justify-center my-4">
              <h5 className="text-heading-md font-bold uppercase tracking-tight text-white mb-3">
                {item.backTitle}
              </h5>
              <p className="text-body-card text-gray-300 leading-relaxed">
                {item.backText}
              </p>
            </div>

            {/* Bottom Meta */}
            <div className="pt-2 border-t border-neutral-800">
              <span className="text-label text-gray-400 uppercase tracking-wider">
                STUDIO NOTES // IDENTITY
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
