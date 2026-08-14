"use client";

import React, { useEffect, useRef, useState } from "react";

export interface CounterStatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface AnimatedCounterProps {
  stats: CounterStatItem[];
  title?: string;
  subtitle?: string;
  durationMs?: number;
  className?: string;
}

export default function AnimatedCounter({
  stats,
  title,
  subtitle,
  durationMs = 2000,
  className = "",
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounting();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, stats]);

  const startCounting = () => {
    const startTime = performance.now();

    const updateCounts = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth easeOutExpo transition
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts(
        stats.map((stat) => Math.floor(stat.value * easeProgress))
      );

      if (progress < 1) {
        requestAnimationFrame(updateCounts);
      } else {
        setCounts(stats.map((stat) => stat.value));
      }
    };

    requestAnimationFrame(updateCounts);
  };

  if (!stats || stats.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto py-12 px-4 md:px-8 ${className}`}
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

      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8`}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 md:p-8 text-center border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center group"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2 flex items-center justify-center font-mono">
              {stat.prefix && <span className="text-primary mr-1">{stat.prefix}</span>}
              <span>{counts[idx].toLocaleString()}</span>
              {stat.suffix && <span className="text-primary ml-1">{stat.suffix}</span>}
            </div>
            <h4 className="font-bold text-base md:text-lg text-slate-800 mb-1 group-hover:text-primary transition-colors">
              {stat.label}
            </h4>
            {stat.description && (
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
