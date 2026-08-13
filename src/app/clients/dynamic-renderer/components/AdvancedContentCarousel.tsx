"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdvancedContentCarouselProps {
  slides: string[];
}

export default function AdvancedContentCarousel({ slides }: AdvancedContentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // If there are no slides, render nothing
  if (!slides || slides.length === 0) return null;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play logic (every 5 seconds)
  useEffect(() => {
    if (!isHovering) {
      timerRef.current = setInterval(goToNext, 5000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, isHovering, slides.length]);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center">
      <div 
        className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-lg lg:rounded-xl shadow-xl bg-[var(--surface)] group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((htmlStr, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
            >
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: htmlStr.replace(/max-h-40/g, "max-h-72 md:max-h-80 w-auto") }} 
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 dark:bg-black/70 text-slate-800 dark:text-white backdrop-blur-md shadow-lg transition-all duration-300 ${
            isHovering ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={goToNext}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 dark:bg-black/70 text-slate-800 dark:text-white backdrop-blur-md shadow-lg transition-all duration-300 ${
            isHovering ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          }`}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Pagination Dots (Outside the carousel box) */}
      <div className="mt-8 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ring-1 ring-slate-300 dark:ring-slate-600 ${
              index === currentIndex 
                ? "bg-slate-400 dark:bg-slate-300 scale-110" 
                : "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
