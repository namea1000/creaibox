"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdvancedMediaCarouselProps {
  mediaUrls: string[];
  desktopAspectRatio?: string;
}

export default function AdvancedMediaCarousel({ mediaUrls, desktopAspectRatio }: AdvancedMediaCarouselProps) {
  const validMediaUrls = (mediaUrls || []).filter((url) => typeof url === "string" && url.trim() !== "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progresses, setProgresses] = useState<number[]>(new Array(validMediaUrls.length).fill(0));
  const [isHovering, setIsHovering] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // If there's no media, just return null
  if (validMediaUrls.length === 0) return null;

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validMediaUrls.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? validMediaUrls.length - 1 : prev - 1));
  };

  useEffect(() => {
    // Reset progresses when changing index
    setProgresses(prev => prev.map((p, i) => (i < currentIndex ? 100 : i === currentIndex ? 0 : 0)));
    startTimeRef.current = performance.now();

    const currentUrl = mediaUrls[currentIndex];
    const isVid = isVideo(currentUrl);
    const videoEl = videoRefs.current[currentIndex];

    if (isVid && videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(e => console.log("Autoplay prevented", e));
    }

    const updateProgress = (timestamp: number) => {
      let progress = 0;

      if (isVid && videoEl && videoEl.duration) {
        progress = (videoEl.currentTime / videoEl.duration) * 100;
        if (videoEl.ended || progress >= 100) {
          goToNext();
          return;
        }
      } else if (!isVid) {
        // Image duration is 5 seconds
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        progress = (elapsed / 5000) * 100;
        if (progress >= 100) {
          goToNext();
          return;
        }
      }

      setProgresses(prev => {
        const newP = [...prev];
        newP[currentIndex] = progress || 0;
        return newP;
      });

      animationRef.current = requestAnimationFrame(updateProgress);
    };

    animationRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex, mediaUrls]);

  // Use provided aspect ratio or fallback to 21/9 for desktop
  const customStyle = desktopAspectRatio ? { '--desktop-aspect': desktopAspectRatio } as React.CSSProperties : {};

  return (
    <div 
      style={customStyle}
      className={`relative w-full aspect-[4/3] md:aspect-[16/9] ${desktopAspectRatio ? 'lg:aspect-[var(--desktop-aspect)]' : 'lg:aspect-[21/9]'} bg-black overflow-hidden group`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {validMediaUrls.map((url, index) => {
        const active = index === currentIndex;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${active ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            {isVideo(url) ? (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={url}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={url}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
              />
            )}
            {/* Overlay gradient for better text/bar visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={goToNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Progress Bars */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2 px-4">
        {mediaUrls.map((_, index) => (
          <div 
            key={index} 
            className="h-1 bg-white/30 rounded-full cursor-pointer relative overflow-hidden transition-all"
            style={{ width: `min(80px, ${100 / mediaUrls.length}vw)` }}
            onClick={() => setCurrentIndex(index)}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-white transition-all duration-75 ease-linear"
              style={{ width: `${progresses[index]}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
