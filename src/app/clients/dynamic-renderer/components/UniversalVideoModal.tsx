"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

/**
 * Extracts standard YouTube Video ID from various URL formats
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  
  // If already clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }

  const match = urlOrId.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function UniversalVideoModal() {
  const [activeVideo, setActiveVideo] = useState<{
    type: "youtube" | "direct";
    src: string;
    title?: string;
  } | null>(null);

  const closeModal = useCallback(() => {
    setActiveVideo(null);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  // Global Event Delegation for all video triggers in the DOM
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find nearest video trigger element
      const trigger = target.closest<HTMLElement>(
        "[data-youtube-id], [data-video-url], [data-video-trigger], a[href*='youtube.com/watch'], a[href*='youtu.be']"
      );

      if (!trigger) return;

      const rawYoutubeId = trigger.getAttribute("data-youtube-id");
      const rawVideoUrl = trigger.getAttribute("data-video-url") || (trigger instanceof HTMLAnchorElement ? trigger.href : "");
      const videoMode = trigger.getAttribute("data-video-mode") || "modal"; // "modal" | "inline"
      const videoTitle = trigger.getAttribute("data-video-title") || trigger.querySelector("img")?.alt || "광고 영상";

      const ytId = rawYoutubeId ? extractYouTubeId(rawYoutubeId) : (rawVideoUrl ? extractYouTubeId(rawVideoUrl) : null);

      // Prevent default page navigation if it's a video trigger
      e.preventDefault();
      e.stopPropagation();

      // Case 1: Inline mode (replace container content in-place)
      if (videoMode === "inline") {
        const container = trigger.closest<HTMLElement>(".video-container, .aspect-video, [data-video-container]") || trigger;
        if (ytId) {
          container.innerHTML = `
            <iframe 
              src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1" 
              class="w-full h-full rounded-2xl" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          `;
        } else if (rawVideoUrl) {
          container.innerHTML = `
            <video 
              src="${rawVideoUrl}" 
              class="w-full h-full rounded-2xl" 
              controls 
              autoplay 
              playsinline
            ></video>
          `;
        }
        return;
      }

      // Case 2: Modal mode (open popup modal)
      if (ytId) {
        setActiveVideo({
          type: "youtube",
          src: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
          title: videoTitle,
        });
      } else if (rawVideoUrl && /\.(mp4|webm|ogg)$/i.test(rawVideoUrl)) {
        setActiveVideo({
          type: "direct",
          src: rawVideoUrl,
          title: videoTitle,
        });
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  if (!activeVideo) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 md:p-10 animate-fade-in"
      onClick={closeModal}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Title & Close Button */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] text-white">
          <h4 className="font-bold text-sm sm:text-base text-gray-200 truncate pr-4">
            {activeVideo.title || "동영상 재생"}
          </h4>
          <button
            onClick={closeModal}
            aria-label="닫기"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Box (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black">
          {activeVideo.type === "youtube" ? (
            <iframe
              src={activeVideo.src}
              title={activeVideo.title || "YouTube Video"}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={activeVideo.src}
              className="absolute inset-0 w-full h-full"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
      </div>
    </div>
  );
}
