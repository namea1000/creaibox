"use client";

import React from "react";

export interface LogoItem {
  name: string;
  logoUrl: string;
  linkUrl?: string;
}

export interface InfiniteLogoMarqueeProps {
  logos: (LogoItem | string)[];
  title?: string;
  speedSeconds?: number; // default 25s
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export default function InfiniteLogoMarquee({
  logos,
  title,
  speedSeconds = 25,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: InfiniteLogoMarqueeProps) {
  if (!logos || logos.length === 0) return null;

  // Normalize logos to array of objects
  const normalizedLogos: LogoItem[] = logos.map((item, idx) =>
    typeof item === "string"
      ? { name: `Partner ${idx + 1}`, logoUrl: item }
      : item
  );

  // Duplicate list 3 times to ensure smooth infinite looping
  const displayLogos = [...normalizedLogos, ...normalizedLogos, ...normalizedLogos];

  return (
    <div className={`w-full py-10 overflow-hidden ${className}`}>
      {title && (
        <div className="text-center mb-8">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">
            {title}
          </p>
        </div>
      )}

      {/* Marquee Outer Container with Gradient Mask */}
      <div 
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div
          className={`flex w-max items-center gap-12 sm:gap-16 md:gap-20 ${
            direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
          } ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
          style={{
            animationDuration: `${speedSeconds}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {displayLogos.map((logo, idx) => {
            const content = (
              <div
                key={idx}
                className="flex items-center justify-center h-12 md:h-16 px-4 py-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="max-h-full max-w-[140px] md:max-w-[180px] object-contain"
                  loading="lazy"
                />
              </div>
            );

            return logo.linkUrl ? (
              <a
                key={idx}
                href={logo.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              content
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-left {
          animation-name: marquee-left;
        }
        .animate-marquee-right {
          animation-name: marquee-right;
        }
      `}</style>
    </div>
  );
}
