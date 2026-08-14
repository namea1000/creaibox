"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface TestimonialItem {
  name: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  rating?: number; // 1 ~ 5
  review: string;
  date?: string;
}

export interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
  title?: string;
  subtitle?: string;
  autoPlayInterval?: number; // default 5000ms
  className?: string;
}

export default function TestimonialCarousel({
  testimonials,
  title,
  subtitle,
  autoPlayInterval = 5000,
  className = "",
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length, autoPlayInterval]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto py-12 px-4 md:px-8 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {(title || subtitle) && (
        <div className="text-center mb-12 space-y-3">
          {subtitle && (
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full inline-block">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Main Testimonial Card */}
      <div className="relative bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-100 shadow-xl overflow-hidden flex flex-col justify-between min-h-[360px]">
        {/* Background Quote Mark */}
        <Quote className="absolute top-6 right-8 w-20 h-20 text-slate-100/80 -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Star Rating */}
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, sIdx) => (
              <Star
                key={sIdx}
                className={`w-5 h-5 ${
                  sIdx < (current.rating || 5) ? "fill-amber-400" : "text-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Review Text */}
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-800 leading-relaxed italic">
            "{current.review}"
          </p>
        </div>

        {/* User Info & Controls Footer */}
        <div className="relative z-10 pt-8 mt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {current.avatarUrl ? (
              <img
                src={current.avatarUrl}
                alt={current.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                {current.name.slice(0, 1)}
              </div>
            )}
            <div>
              <h4 className="font-extrabold text-slate-900 text-base md:text-lg">
                {current.name}
              </h4>
              <p className="text-xs md:text-sm text-slate-400">
                {current.role} {current.company && `· ${current.company}`}
              </p>
            </div>
          </div>

          {/* Navigation Arrows & Indicator Dots */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="이전 후기"
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {testimonials.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`후기 ${dotIdx + 1}번`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    dotIdx === currentIndex ? "w-6 bg-slate-900" : "w-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              aria-label="다음 후기"
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
