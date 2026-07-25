"use client";

import React, { useEffect, useState, useRef } from "react";

export default function MoonshotCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Position references for smooth LERP (Linear Interpolation)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only initialize on desktop / fine pointer devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Detect interactive elements under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, input, select, textarea, [role="button"], [tabindex="0"], label, summary, .cursor-pointer, .group'
          )
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // 60FPS LERP Loop for Moonshot AI style smooth magnetic tracking
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const renderLoop = () => {
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.16);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.16);

      if (ringRef.current) {
        // Hover only expands scale (no color change)
        const scale = isMouseDown ? 0.85 : isHovered ? 1.65 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0px) translate(-50%, -50%) scale(${scale})`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible, isHovered, isMouseDown]);

  if (!isVisible) return null;

  return (
    <div
      ref={ringRef}
      className={`fixed top-0 left-0 pointer-events-none z-[99999] rounded-full transition-transform duration-300 ease-out will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      } w-10 h-10 border-[1.8px] border-zinc-700/80 dark:border-white/80 bg-transparent`}
      style={{
        transform: `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0px) translate(-50%, -50%)`,
      }}
    />
  );
}
