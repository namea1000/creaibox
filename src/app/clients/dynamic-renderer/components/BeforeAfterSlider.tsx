"use client";

import React, { useState, useRef, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

export interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: string; // default "aspect-[16/10]"
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  title,
  subtitle,
  aspectRatio = "aspect-[16/10]",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50); // 0 ~ 100%
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const onMouseDown = () => {
    isDragging.current = true;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className={`w-full max-w-4xl mx-auto py-12 px-4 md:px-8 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-10 space-y-3">
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

      {/* Comparison Frame */}
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        className={`relative w-full ${aspectRatio} rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize border border-slate-200/60`}
      >
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 pointer-events-none">
          {afterLabel}
        </span>

        {/* Before Image (Foreground Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
          />
          <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
            {beforeLabel}
          </span>
        </div>

        {/* Draggable Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center border-2 border-slate-200">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
