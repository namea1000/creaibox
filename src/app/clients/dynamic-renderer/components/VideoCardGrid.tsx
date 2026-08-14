"use client";

import React, { useState } from "react";
import { Play, X } from "lucide-react";
import { extractYouTubeId } from "./UniversalVideoModal";

export interface VideoItem {
  title: string;
  thumbnail: string;
  youtubeId?: string;
  videoUrl?: string;
  tag?: string;
  date?: string;
}

export interface VideoCardGridProps {
  videos: VideoItem[];
  title?: string;
  subtitle?: string;
  moreLink?: string;
  moreText?: string;
  className?: string;
}

export default function VideoCardGrid({
  videos,
  title = "광고영상",
  subtitle,
  moreLink = "/news/video",
  moreText = "더보기",
  className = "",
}: VideoCardGridProps) {
  const [activeModalVideo, setActiveModalVideo] = useState<{
    src: string;
    title: string;
  } | null>(null);

  if (!videos || videos.length === 0) return null;

  const handleCardClick = (item: VideoItem) => {
    const ytId = item.youtubeId ? extractYouTubeId(item.youtubeId) : (item.videoUrl ? extractYouTubeId(item.videoUrl) : null);
    
    if (ytId) {
      setActiveModalVideo({
        src: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
        title: item.title,
      });
    } else if (item.videoUrl) {
      setActiveModalVideo({
        src: item.videoUrl,
        title: item.title,
      });
    } else {
      // Fallback: Default brand promotional video embed if no ID found
      setActiveModalVideo({
        src: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        title: item.title,
      });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header with Title and "더보기" link */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          {subtitle && (
            <span className="text-[#D4200C] font-black text-xs md:text-sm tracking-wider uppercase block mb-1">
              {subtitle}
            </span>
          )}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#502314] tracking-tight">
            {title}
          </h2>
        </div>
        {moreLink && (
          <a
            href={moreLink}
            className="text-sm md:text-base font-bold text-[#502314] hover:text-[#D4200C] flex items-center gap-1 transition-colors"
          >
            {moreText} <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </div>

      {/* 3-Column Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {videos.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(item)}
            className="group flex flex-col cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(item);
              }
            }}
          >
            {/* Thumbnail Frame */}
            <div className="relative aspect-[16/9] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-900 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Centered Translucent Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/80 group-hover:bg-white text-[#502314] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                  <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />
                </div>
              </div>

              {/* Optional Tag Badge */}
              {item.tag && (
                <div className="absolute top-3 left-3 bg-[#D4200C] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                  {item.tag}
                </div>
              )}
            </div>

            {/* Title Under Thumbnail */}
            <div className="pt-3.5 text-center md:text-left">
              <h3 className="text-base md:text-lg font-bold text-[#502314] group-hover:text-[#D4200C] transition-colors leading-snug">
                {item.title}
              </h3>
              {item.date && (
                <p className="text-xs text-neutral-500 mt-1">{item.date}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Embedded High-Quality 16:9 Video Modal Popup */}
      {activeModalVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalVideo(null)}
        >
          {/* Modal Card Frame */}
          <div
            className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Close button bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-white/10">
              <h4 className="text-white font-bold text-base md:text-lg truncate pr-4">
                {activeModalVideo.title}
              </h4>
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                aria-label="닫기"
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 16:9 Aspect Player */}
            <div className="relative w-full aspect-video bg-black">
              {activeModalVideo.src.includes("youtube.com") ? (
                <iframe
                  src={activeModalVideo.src}
                  title={activeModalVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeModalVideo.src}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
