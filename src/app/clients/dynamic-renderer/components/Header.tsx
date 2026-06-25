"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  companyName: string;
  phone?: string;
  hasPortfolio: boolean;
  hasRental: boolean;
}

export default function Header({ companyName, phone, hasPortfolio, hasRental }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "홈", href: "#" },
    { name: "서비스 안내", href: "#services" },
    { name: "소개", href: "#about" },
    ...(hasPortfolio ? [{ name: "주요 실적", href: "#portfolio" }] : []),
    ...(hasRental ? [{ name: "공간/대관", href: "#rental" }] : []),
    { name: "상담 신청", href: "#contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-white/80 border-b border-slate-200/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo / Company Name */}
          <a href="#" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-[var(--primary)] select-none">
              {companyName}
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-[var(--primary)] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[var(--primary)] transition-colors"
              >
                <Phone size={14} />
                <span>{phone}</span>
              </a>
            )}
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 transition-all shadow-sm active:scale-95"
              style={{ borderRadius: "var(--border-radius)" }}
            >
              상담 예약
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100/50 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 border-t border-slate-200/50 bg-white/95 backdrop-blur-lg shadow-xl animate-fade-in">
          <div className="px-6 py-8 flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-bold text-slate-800 hover:text-[var(--primary)] transition-colors"
              >
                {link.name}
              </a>
            ))}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 mt-4 border-t border-slate-100 pt-4"
              >
                <Phone size={16} />
                <span>전화 문의: {phone}</span>
              </a>
            )}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="inline-flex w-full items-center justify-center px-5 py-3 text-base font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 transition-all shadow-md mt-2"
              style={{ borderRadius: "var(--border-radius)" }}
            >
              온라인 무료 상담 신청
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
