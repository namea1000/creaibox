"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HeartHandshake, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "../lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "회사소개", href: "/about" },
    { name: "사업영역", href: "/#business" },
    { name: "행사렌탈", href: "/#rental" },
    { name: "실적갤러리", href: "/#portfolio" },
    { name: "견적문의", href: "/contact" },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm py-4"
          : "bg-white border-b border-slate-50 py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-300 shadow-sm">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
              {COMPANY_INFO.brandName}
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">
              Sotong & Cheum
            </span>
          </div>
        </Link>

        {/* Desktop GNB */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${
                  isActive ? "text-blue-600 after:scale-x-100" : "hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Call button & Contact button */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="text-xs font-black text-slate-500 hover:text-slate-800 transition-colors hidden lg:block"
          >
            Tel. {COMPANY_INFO.phone}
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-black tracking-wide text-white transition-all hover:shadow-lg hover:shadow-blue-600/15 active:scale-95 duration-200"
          >
            무료 견적 신청
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 transition-all"
          aria-label="메뉴 열기"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-6 px-6 animate-fade-in duration-300 z-50">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`text-base font-bold py-2 border-b border-slate-50 ${
                    isActive ? "text-blue-600" : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700"
              >
                전화문의 {COMPANY_INFO.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/10"
              >
                무료 견적 신청
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
