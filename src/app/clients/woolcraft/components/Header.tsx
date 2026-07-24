"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Search,
  Menu,
  X,
  ShieldCheck,
  Globe,
  Leaf,
  Mail,
  Heart,
} from "lucide-react";

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Header({ cartCount = 0, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#2C2C2C] text-[#F5F1E8] px-4 py-2 text-xs font-bold border-b border-[#333]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#A8B5A0]/20 border border-[#A8B5A0]/40 px-2.5 py-0.5 text-[10px] font-black text-[#A8B5A0]">
              <Leaf size={10} /> 100% ECO WOOL
            </span>
            <span className="truncate text-xs font-medium">
              🌿 100% 천연 메리노 울 스니커즈 | 전 상품 무료 배송 & 30일 무상 교환/반품 혜택
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-[11px] text-[#A8B5A0]">
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> DoFollow SEO Ready</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Globe size={12} /> CreAibox Shopping Template</span>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-40 bg-[#FEFCF8]/90 backdrop-blur-md border-b border-[#E8E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/clients/woolcraft" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#A8B5A0] flex items-center justify-center text-white font-black shadow-md group-hover:scale-105 transition-all">
                <Leaf size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif tracking-tight text-[#2C2C2C] font-semibold group-hover:text-[#A8B5A0] transition-colors">
                  Aura Merino
                </span>
                <span className="text-[10px] font-bold text-[#888] tracking-widest uppercase">
                  Eco Merino Footwear
                </span>
              </div>
            </Link>

            {/* Center GNB Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-wide text-[#2C2C2C]">
              <Link href="/clients/woolcraft" className="text-[#A8B5A0] font-black">
                Home
              </Link>
              <a href="#products" className="hover:text-[#A8B5A0] transition-colors">
                Products
              </a>
              <a href="#story" className="hover:text-[#A8B5A0] transition-colors">
                Brand Story
              </a>
              <a href="#benefits" className="hover:text-[#A8B5A0] transition-colors">
                Why Wool
              </a>
              <a href="#blog" className="hover:text-[#A8B5A0] transition-colors">
                Blog
              </a>
            </nav>

            {/* Right-Side CTA Header Area: Cart Button */}
            <div className="flex items-center gap-3">

              {/* Shopping Cart Button (Right Aligned) */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 rounded-xl bg-[#2C2C2C] px-4 py-2.5 text-xs font-black text-white hover:bg-[#3C3C3C] transition-all shadow-md"
              >
                <ShoppingBag size={15} />
                <span>Cart</span>
                <span className="w-5 h-5 rounded-full bg-[#A8B5A0] text-white text-[11px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#2C2C2C] hover:bg-[#F5F1E8] transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#E8E5E0] bg-[#FEFCF8] px-6 py-4 space-y-3">
            <Link
              href="/clients/woolcraft"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#A8B5A0]"
            >
              Home
            </Link>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#2C2C2C] hover:text-[#A8B5A0]"
            >
              Products (컬렉션)
            </a>
            <a
              href="#story"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#2C2C2C] hover:text-[#A8B5A0]"
            >
              Brand Story (브랜드 스토리)
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#A8B5A0]"
            >
              Blog
            </a>
          </div>
        )}
      </header>
    </>
  );
}
