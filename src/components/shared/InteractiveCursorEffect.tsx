"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  decay: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  color: string;
  lineWidth: number;
}

export default function InteractiveCursorEffect() {
  const pathname = usePathname();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const delayMouseRef = useRef({ x: 0, y: 0 }); // Smooth lag glow blob
  const lastEmitRef = useRef(0);

  useEffect(() => {
    // 1. Instantly detect touch/mobile devices or viewport widths < 1024px
    const isTouchOrMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isTouchOrMobile) {
      setIsMobileDevice(true);
      return; // Do not initialize canvas logic on mobile/touch screens
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = false;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Color palettes for Dark theme (translucent pastel neon glow)
    const darkNeonColors = [
      "rgba(59, 130, 246, ",  // Blue
      "rgba(16, 185, 129, ",  // Emerald
      "rgba(139, 92, 246, ",  // Purple
      "rgba(245, 158, 11, ",  // Amber
    ];

    // Color palettes for Light theme (rich high-contrast colors)
    const lightRichColors = [
      "rgba(37, 99, 235, ",   // Deep Blue
      "rgba(5, 150, 105, ",   // Emerald Green
      "rgba(124, 58, 237, ",  // Deep Purple
      "rgba(217, 119, 6, ",   // Dark Amber/Orange
    ];

    const getRandomColor = (alpha = 1) => {
      const isDark = document.documentElement.classList.contains("dark");
      const activeColors = isDark ? darkNeonColors : lightRichColors;
      const idx = Math.floor(Math.random() * activeColors.length);
      return `${activeColors[idx]}${alpha})`;
    };

    // Main Loop
    const render = () => {
      // If everything is idle, stop the loop to save CPU and boost PageSpeed Score
      if (particles.length === 0 && ripples.length === 0 && !mouseRef.current.active) {
        isRunning = false;
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains("dark");

      // Smooth lag target for mouse glow spot
      if (mouseRef.current.active) {
        delayMouseRef.current.x += (mouseRef.current.x - delayMouseRef.current.x) * 0.1;
        delayMouseRef.current.y += (mouseRef.current.y - delayMouseRef.current.y) * 0.1;

        // Draw dynamic glow light follow (glowing orb behind contents)
        const gradient = ctx.createRadialGradient(
          delayMouseRef.current.x,
          delayMouseRef.current.y,
          0,
          delayMouseRef.current.x,
          delayMouseRef.current.y,
          180
        );

        // Adjust opacity for Light vs Dark background
        if (isDark) {
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.08)");
          gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.03)");
        } else {
          // Subtle darker contrast glow for white background
          gradient.addColorStop(0, "rgba(37, 99, 235, 0.05)");
          gradient.addColorStop(0.5, "rgba(124, 58, 237, 0.02)");
        }
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(delayMouseRef.current.x, delayMouseRef.current.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render & Update Ripples (Circular waves expanding outward)
      ctx.shadowBlur = 0; // Reset shadow for ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += ripple.speed;
        ripple.alpha = 1 - (ripple.radius / ripple.maxRadius);

        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        
        // Dynamic gradient for the ripple line
        const rColor = ripple.color.replace(/[\d.]+\)$/, `${ripple.alpha})`);
        ctx.strokeStyle = rColor;
        ctx.lineWidth = ripple.lineWidth;
        ctx.stroke();

        // Optional: Draw a tiny concentric secondary ring for added details
        if (ripple.radius > 15) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius - 12, 0, Math.PI * 2);
          ctx.strokeStyle = ripple.color.replace(/[\d.]+\)$/, `${ripple.alpha * 0.4})`);
          ctx.lineWidth = ripple.lineWidth * 0.6;
          ctx.stroke();
        }
      }

      // Render & Update Particles (Sparkling dust drifting behind cursor)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Add neon glow to particles
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.alpha})`);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const startLoopIfNeeded = () => {
      if (!isRunning) {
        isRunning = true;
        render();
      }
    };

    // Track Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      startLoopIfNeeded();

      const now = Date.now();
      // Emit ripple ring and trace particles on movement with slight throttle
      if (now - lastEmitRef.current > 60) {
        lastEmitRef.current = now;

        // 1. Create a Ripple ring at mouse coordinates (circular expansion)
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 2,
          maxRadius: Math.random() * 100 + 80,
          alpha: 0.7,
          speed: Math.random() * 0.8 + 1.0, // 2x slower expansion speed
          color: getRandomColor(),
          lineWidth: Math.random() * 1.2 + 0.6,
        });

        // 2. Create sparkle particles
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.3,
            radius: Math.random() * 2 + 1,
            alpha: 0.8,
            color: getRandomColor(),
            decay: Math.random() * 0.008 + 0.006, // 2x slower decay
          });
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Initial render trigger
    startLoopIfNeeded();

    // Cleanups
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Return null immediately on mobile/tablet viewport or root mismatch
  if (isMobileDevice || pathname !== "/") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80 mix-blend-normal dark:mix-blend-screen"
      style={{ pointerEvents: "none" }}
    />
  );
}
