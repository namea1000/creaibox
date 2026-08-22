"use client";

import React, { useState, useEffect } from "react";
import Link from "@/components/common/SmartIntentLink";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "미래를 보는 마음", href: "/" },
  { label: "WE WORK", href: "/work" },
  { label: "협회 소개", href: "/#association" },
  { label: "교육", href: "/education" },
  { label: "기획", href: "/planning" },
  { label: "개발", href: "/development" },
  { label: "홍보", href: "/marketing" },
];

export default function FuturemindCyanHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-neutral-950/95 backdrop-blur-md border-b border-cyan-900/30 shadow-xl"
          : "bg-neutral-950 border-b border-neutral-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo (Exact Original futuremind.kr Logo with Transparent Background) */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <img
            src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/logo-transparent.png"
            alt="futuremind"
            className="h-10 sm:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
          <span className="hidden sm:inline-block text-xs sm:text-sm font-bold text-neutral-300 border-l border-neutral-700 pl-3.5 tracking-tight">
            미래교육문화협회
          </span>
        </Link>

        {/* Desktop Navigation (6 Original Menus) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold tracking-tight transition-colors py-1 ${
                  isActive
                    ? "text-cyan-400 font-black border-b-2 border-cyan-400"
                    : "text-neutral-300 hover:text-cyan-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Right CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#contact"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>AI 컨설팅 시작하기</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-neutral-200 hover:text-cyan-400 py-2.5 border-b border-neutral-900 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ArrowRight size={14} className="text-neutral-600" />
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-lg bg-cyan-500 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg"
            >
              <span>AI 컨설팅 시작하기</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
