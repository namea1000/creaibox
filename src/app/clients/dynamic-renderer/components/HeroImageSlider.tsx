"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export interface HeroImageSliderProps {
  images: string[];
  desktopAspectRatio?: string;
  autoPlayInterval?: number; // default 3000ms (3 seconds)
  className?: string;
  rounded?: string; // e.g. "rounded-3xl"
}

export default function HeroImageSlider({
  images,
  desktopAspectRatio,
  autoPlayInterval = 3000,
  className = "",
  rounded = "rounded-2xl md:rounded-3xl",
}: HeroImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!images || images.length === 0) return null;

  const total = images.length;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPlaying && total > 1) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying, total, autoPlayInterval]);

  const customStyle = desktopAspectRatio
    ? ({ "--desktop-aspect": desktopAspectRatio } as React.CSSProperties)
    : {};

  return (
    <div
      style={customStyle}
      className={`relative w-full overflow-hidden select-none group ${rounded} ${
        desktopAspectRatio
          ? "aspect-[4/3] md:aspect-[16/9] lg:aspect-[var(--desktop-aspect)]"
          : "aspect-[16/9] md:aspect-[21/10]"
      } ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slides */}
      {images.map((src, idx) => {
        const active = idx === currentIndex;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              active ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}

      {/* Navigation Arrows (Show on hover) */}
      {total > 1 && (
        <>
          <button
            onClick={goToPrev}
            aria-label="Previous Slide"
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/70 hover:scale-110 active:scale-95 cursor-pointer ${
              isHovering ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            aria-label="Next Slide"
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/70 hover:scale-110 active:scale-95 cursor-pointer ${
              isHovering ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Burger King Style Dot Pagination + Play/Pause Button */}
      {total > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-1.5 px-4 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
            {images.map((_, dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-6 bg-white shadow-sm"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              );
            })}

            {/* Play / Pause Toggle */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              className="ml-1.5 text-white/80 hover:text-white transition-colors cursor-pointer p-0.5"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
