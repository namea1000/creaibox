"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";

interface InteractiveLocationMagnifierProps {
  mapImage: string;
  zoomImage?: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  linkUrl?: string;
  linkText?: string;
  zoomFactor?: number;
}

export default function InteractiveLocationMagnifier({
  mapImage,
  zoomImage,
  badgeText = "CENTRAL LOCATION PREMIUM • ",
  title = "누리는 프리미엄의 클래스가 다른 세상, 천안 동문 디 이스트 파크시티가 시작합니다!",
  subtitle = "Central Location",
  description = "사통팔달 쾌속 교통망과 풍부한 생활 인프라, 자연을 품은 힐링 프리미엄 단지의 중심 라이프를 누려보세요.",
  linkUrl = "#",
  linkText = "입지 프리미엄 자세히보기",
  zoomFactor = 2,
}: InteractiveLocationMagnifierProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, bgX: 50, bgY: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // 1. Intersection Observer for Scroll-triggered entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Mouse Move Tracker for real-time 2x Magnifier Lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain lens within bounds
    const boundedX = Math.max(0, Math.min(x, rect.width));
    const boundedY = Math.max(0, Math.min(y, rect.height));

    const bgX = (boundedX / rect.width) * 100;
    const bgY = (boundedY / rect.height) * 100;

    setLensPos({ x: boundedX, y: boundedY, bgX, bgY });
  };

  const highResImage = zoomImage || mapImage;

  return (
    <div ref={containerRef} className="w-full py-16 md:py-24 px-4 md:px-8 xl:px-12 max-w-screen-2xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Interactive Map & Magnifier Container */}
        <div className="lg:col-span-7 relative flex justify-center items-center">
          <div
            ref={mapRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-50 cursor-crosshair transition-all duration-1000 select-none ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ width: "100%", maxWidth: "760px", aspectRatio: "4/3" }}
          >
            {/* 1. Base Map Image */}
            <img
              src={mapImage}
              alt={title || "입지 안내도"}
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                isVisible ? "scale-100" : "scale-105"
              }`}
            />

            {/* 2. Highlight Circle Zoom Image (Emerges smoothly with scale animation) */}
            {zoomImage && (
              <div
                className={`absolute inset-0 pointer-events-none transition-all duration-1000 delay-500 flex items-center justify-center ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              >
                <img
                  src={zoomImage}
                  alt="Location Zoom"
                  className="w-full h-full object-contain filter drop-shadow-xl"
                />
              </div>
            )}

            {/* 3. Interactive Magnifying Glass Lens (Tracks Mouse) */}
            {isHovered && (
              <div
                className="absolute pointer-events-none rounded-full border-4 border-white shadow-2xl z-30 transition-opacity duration-200"
                style={{
                  width: "240px",
                  height: "240px",
                  left: `${lensPos.x - 120}px`,
                  top: `${lensPos.y - 120}px`,
                  backgroundImage: `url(${highResImage})`,
                  backgroundSize: `${zoomFactor * 100}%`,
                  backgroundPosition: `${lensPos.bgX}% ${lensPos.bgY}%`,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.15)",
                }}
              >
                {/* Crosshair Center Reticle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-6 h-0.5 bg-red-500"></div>
                  <div className="w-0.5 h-6 bg-red-500 absolute"></div>
                </div>
              </div>
            )}

            {/* Magnifier Tip Helper Tag */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 pointer-events-none shadow-md z-10">
              <Search size={14} className="text-amber-400" />
              <span>마우스를 올리면 2배 확대됩니다</span>
            </div>
          </div>
        </div>

        {/* Right Info Section with 360-degree Infinite Rotating Badge */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Subtitle Badge */}
            {subtitle && (
              <div
                className={`transition-all duration-700 delay-300 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#9b8371]/15 text-[#9b8371] text-xs md:text-sm font-black rounded-full uppercase tracking-wider">
                  <MapPin size={14} />
                  {subtitle}
                </span>
              </div>
            )}

            {/* Main Title */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight transition-all duration-700 delay-500 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p
                className={`text-base md:text-lg text-slate-600 font-medium leading-relaxed transition-all duration-700 delay-700 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                {description}
              </p>
            )}
          </div>

          {/* 360-Degree Circular Rotating Text Badge & Action Button */}
          <div
            className={`flex flex-wrap items-center gap-8 pt-4 transition-all duration-700 delay-900 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Rotating Badge Anchor */}
            <a
              href={linkUrl}
              className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center group cursor-pointer"
            >
              {/* Circular SVG Text Path Spinning 360° Infinitely */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-[spin_10s_linear_infinite] text-[#9b8371] fill-current"
              >
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[9.5px] font-bold tracking-[0.22em] uppercase">
                  <textPath href="#circlePath" startOffset="0%">
                    {badgeText}
                  </textPath>
                </text>
              </svg>

              {/* Center Circle Button with Arrow */}
              <div className="absolute w-16 h-16 md:w-18 md:h-18 rounded-full bg-[#9b8371] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#856e5d] transition-all duration-300">
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </a>

            {/* Standard Text Action Button */}
            {linkText && (
              <a
                href={linkUrl}
                className="px-7 py-4 bg-[#2f2f4c] hover:bg-[#1e1e33] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 flex items-center gap-3 text-base group cursor-pointer"
              >
                <span>{linkText}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
