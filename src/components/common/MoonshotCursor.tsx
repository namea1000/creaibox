"use client";

import React, { useEffect, useRef } from "react";

export default function MoonshotCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const isVisibleRef = useRef(false);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only initialize on desktop / fine pointer devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let lastClosestCheck = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (ringRef.current) {
          ringRef.current.style.opacity = "1";
        }
      }

      // Throttle closest interactive element check to max 20 times/sec (every 50ms)
      const now = performance.now();
      if (now - lastClosestCheck > 50) {
        lastClosestCheck = now;
        const target = e.target as HTMLElement | null;
        if (target) {
          isHoveredRef.current = Boolean(
            target.closest(
              'a, button, input, select, textarea, [role="button"], [tabindex="0"], label, summary, .cursor-pointer, .group'
            )
          );
        }
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
    };
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };
    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (ringRef.current) {
        ringRef.current.style.opacity = "0";
      }
    };
    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      if (ringRef.current) {
        ringRef.current.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    // 60FPS LERP Loop for ultra-fast, smooth tracking with 0 React re-renders
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const renderLoop = () => {
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.38);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.38);

      if (ringRef.current) {
        const scale = isMouseDownRef.current ? 0.85 : isHoveredRef.current ? 1.5 : 1;
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
  }, []);

  return (
    <div
      ref={ringRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full opacity-0 transition-opacity duration-150 will-change-transform w-9 h-9 border-[1.8px] border-zinc-700/80 dark:border-white/80 bg-transparent"
      style={{
        transform: "translate3d(-100px, -100px, 0px) translate(-50%, -50%)",
      }}
    />
  );
}
