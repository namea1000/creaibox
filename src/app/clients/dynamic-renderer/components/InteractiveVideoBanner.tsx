"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause } from "lucide-react";

interface VideoSource {
  src: string;
  type?: string;
}

interface InteractiveVideoBannerProps {
  videoUrl?: string;
  videoSources?: VideoSource[];
  poster?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: string; // e.g. "16/9", "21/9"
}

export default function InteractiveVideoBanner({
  videoUrl,
  videoSources = [],
  poster,
  title,
  subtitle,
  aspectRatio = "16/9",
}: InteractiveVideoBannerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sources = videoSources.length > 0 
    ? videoSources 
    : videoUrl 
    ? [{ src: videoUrl, type: videoUrl.endsWith(".webm") ? "video/webm" : "video/mp4" }] 
    : [];

  // Reset 1-second auto-hide timer on mouse activity
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    // Only auto-hide after 1s when video is actively playing
    if (videoRef.current && !videoRef.current.paused) {
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        resetHideTimer();
      }).catch((err) => {
        console.warn("Video play error:", err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  if (sources.length === 0) return null;

  return (
    <section 
      className="relative w-full aspect-video md:aspect-[16/9] min-h-[500px] max-h-[90vh] bg-black overflow-hidden flex items-center justify-center cursor-pointer select-none"
      onClick={togglePlay}
      onMouseMove={resetHideTimer}
      onMouseEnter={resetHideTimer}
      onMouseLeave={() => {
        if (isPlaying) {
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          setShowControls(false);
        }
      }}
      suppressHydrationWarning={true}
    >
      {/* 1. Background Full-Bleed Video Element (Absolute Inset-0) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={poster}
        preload="metadata"
        playsInline
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        }}
      >
        {sources.map((s, idx) => (
          <source key={idx} src={s.src} type={s.type || "video/mp4"} />
        ))}
      </video>

      {/* 2. Dark Dimmer Gradient on Pause or Hover (Smooth Transition) */}
      <div 
        className={`absolute inset-0 bg-black/35 transition-opacity duration-500 pointer-events-none ${
          !isPlaying || showControls ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 3. Center Interactive Glass Play / Pause Button (Auto-hides after 3s during playback) */}
      <div 
        className={`relative z-20 flex items-center justify-center transition-all duration-400 ease-out transform ${
          !isPlaying || showControls
            ? "opacity-100 scale-100 pointer-events-auto" 
            : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label={isPlaying ? "일시정지" : "동영상 재생"}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/50 shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          {isPlaying ? (
            <Pause size={38} className="text-white fill-white drop-shadow-lg" />
          ) : (
            <Play size={38} className="text-white fill-white ml-1.5 drop-shadow-lg" />
          )}
        </button>
      </div>

      {/* 4. Optional Title / Subtitle Overlay */}
      {(title || subtitle) && !isPlaying && (
        <div className="absolute bottom-8 left-8 right-8 z-20 text-white pointer-events-none animate-fade-in">
          {title && <h3 className="text-2xl md:text-3xl font-black drop-shadow-lg mb-2">{title}</h3>}
          {subtitle && <p className="text-sm md:text-base text-slate-200 drop-shadow-md font-medium">{subtitle}</p>}
        </div>
      )}
    </section>
  );
}
