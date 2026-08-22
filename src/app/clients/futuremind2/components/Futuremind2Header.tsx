"use client";

import React, { useState, useEffect } from "react";
import Link from "@/components/common/SmartIntentLink";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles, Flame } from "lucide-react";

const NAV_ITEMS = [
  { label: "미래를 보는 마음", href: "/" },
  { label: "WE WORK", href: "/work" },
  { label: "교육", href: "/education" },
  { label: "기획", href: "/planning" },
  { label: "개발", href: "/development" },
  { label: "홍보", href: "/marketing" },
];

export default function Futuremind2Header() {
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
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#262626] shadow-xl"
          : "bg-[#0a0a0a] border-b border-[#262626]/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Blazity-style Flame Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#f95700] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame size={18} className="fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white group-hover:text-[#f95700] transition-colors">
              futuremind
            </span>
            <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase -mt-1 font-mono">
              미래교육문화협회
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold tracking-tight transition-colors py-1 ${
                  isActive
                    ? "text-[#f95700] font-black"
                    : "text-neutral-300 hover:text-[#f95700]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Right CTA - Blazity Solid Orange Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#contact"
            className="px-5 py-2.5 bg-[#f95700] hover:bg-[#ea4e00] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-md shadow-orange-500/20 flex items-center gap-1.5"
          >
            <span>TALK TO AN ARCHITECT</span>
            <ArrowRight size={13} />
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
        <div className="md:hidden bg-[#0a0a0a] border-b border-neutral-800 px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-neutral-200 hover:text-[#f95700] py-2.5 border-b border-neutral-900 transition-colors flex items-center justify-between"
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
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-lg bg-[#f95700] text-white font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <span>TALK TO AN ARCHITECT (상담 신청)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
