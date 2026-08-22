"use client";

import React, { useState, useEffect } from "react";
import Link from "@/components/common/SmartIntentLink";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const NAV_ITEMS = [
  { label: "미래를 보는 마음", href: "/" },
  { label: "WE WORK", href: "/work" },
  { label: "교육", href: "/education" },
  { label: "기획", href: "/planning" },
  { label: "개발", href: "/development" },
  { label: "홍보", href: "/marketing" },
];

export default function FuturemindHeader() {
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#06080e]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-950/20"
          : "bg-gradient-to-b from-[#06080e]/95 via-[#06080e]/60 to-transparent border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Blazity Glow */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-xl blur-xs opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-slate-950 border border-white/20 flex items-center justify-center shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-indigo-300 font-black text-sm tracking-tighter">
                MI
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              futuremind
            </span>
            <span className="text-[10px] font-bold text-cyan-400/90 tracking-wider uppercase -mt-1 font-mono">
              미래교육문화협회
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold tracking-tight transition-all duration-200 relative py-1.5 ${
                  isActive
                    ? "text-cyan-400 font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-500 rounded-full shadow-sm shadow-cyan-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#contact"
            className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 overflow-hidden transition-all shadow-lg hover:shadow-cyan-500/30"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 group-hover:opacity-95 transition-opacity" />
            <span className="relative flex items-center gap-1.5 z-10">
              <Sparkles size={13} className="text-slate-950" />
              <span>상담 신청하기</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070a12]/98 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-6 space-y-4 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-slate-200 hover:text-cyan-400 py-2.5 border-b border-white/5 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ArrowRight size={14} className="text-slate-600" />
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-xl"
            >
              <Sparkles size={16} />
              <span>무료 상담 신청하기</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
