"use client";

import React, { useState, useEffect } from "react";

export interface SmartphoneMockupProps {
  imageSrc?: string;
  images?: string[];
  imageAlt?: string;
  autoPlayInterval?: number; // default 3500ms
  children?: React.ReactNode;
  className?: string;
  maxHeight?: string; // e.g. "max-h-[520px]"
}

export default function SmartphoneMockup({
  imageSrc,
  images,
  imageAlt = "모바일 앱 화면",
  autoPlayInterval = 3500,
  children,
  className = "",
  maxHeight = "max-h-[520px]",
}: SmartphoneMockupProps) {
  // Normalize to image array
  const rawList: string[] = images && images.length > 0 
    ? images 
    : imageSrc 
    ? [imageSrc] 
    : [];
  const imageList = rawList.filter((src) => typeof src === "string" && src.trim() !== "");

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [imageList.length, autoPlayInterval]);

  return (
    <div className={`relative mx-auto flex items-center justify-center ${className}`}>
      {/* Outer Phone Device Frame */}
      <div 
        className={`relative w-[280px] sm:w-[310px] md:w-[330px] aspect-[9/18.5] rounded-[44px] sm:rounded-[48px] border-[8px] sm:border-[9px] border-[#262626] bg-[#1a1a1a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-white/20 overflow-hidden ${maxHeight}`}
      >
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-4 sm:h-4.5 bg-black rounded-full z-30 flex items-center justify-end px-2 shadow-inner">
          {/* Subtle Lens Reflection */}
          <div className="w-2 h-2 rounded-full bg-[#111] border border-blue-900/40" />
        </div>

        {/* Top Speaker Mic Slit */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#333] rounded-full z-30" />

        {/* Screen Content Container */}
        <div className="relative w-full h-full bg-[#f8f6f2] overflow-hidden flex flex-col justify-start">
          {imageList.length > 0 ? (
            <div className="relative w-full h-full">
              {imageList.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`${imageAlt} ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                />
              ))}

              {/* Bottom Carousel Indicator Dots for Phone Screen */}
              {imageList.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs">
                  {imageList.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentIndex(dotIdx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        dotIdx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                      }`}
                      aria-label={`슬라이드 ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            children
          )}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/60 rounded-full z-30 pointer-events-none" />

        {/* Subtle Glass Glare Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/15 rounded-[36px]" />
      </div>
    </div>
  );
}
