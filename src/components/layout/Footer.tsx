"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Globe, MessageSquare, Video, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // 🌟 원본 레이블 유지 + 실제 이동할 주소(href) 매칭
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Writing Studio", href: "/studio/writing" },
        { label: "Visuals Studio", href: "/studio/visuals" },
        { label: "Music Studio", href: "/studio/music" },
        { label: "Marketplace", href: "/marketplace" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Community", href: "/community" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api-ref" },
        { label: "Help Center", href: "/help" },
        { label: "Status", href: "/status" },
      ]
    }
  ];

  const bgColor = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const borderColor = isDarkMode ? "border-zinc-800/50" : "border-zinc-200";
  const textColor = isDarkMode ? "text-zinc-400" : "text-zinc-500";
  const titleColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";

  return (
    <footer className={`w-full border-t transition-colors duration-500 ${bgColor} ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            {/* 로고 영역 - 원본 디자인 그대로 유지 */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8">
                <Image src="/logobg.webp" alt="Footer Logo" fill className="object-contain" />
              </div>
              <span className={`text-xl font-black italic tracking-tighter ${titleColor}`}>
                AI Contents <span className="text-blue-500">Studio</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-sm ${textColor}`}>
              상상력을 현실로 만드는 가장 빠른 방법. <br />
              최첨단 AI 기술을 활용한 통합 콘텐츠 제작 환경을 경험하세요.
            </p>
            <div className="flex gap-4">
              {/* 안전하게 교체된 아이콘 리스트 유지 */}
              {[Globe, MessageSquare, Video, Mail].map((Icon, idx) => (
                <button key={idx} className={`p-2.5 rounded-xl border transition-all hover:text-blue-500 hover:border-blue-500/50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* 섹션 반복 렌더링 - 원본 구조 보존 */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${titleColor}`}>
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={`text-sm font-medium transition-colors hover:text-blue-500 flex items-center gap-1 group ${textColor}`}>
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 카피라이트 및 법적 고지 - 원본 보존 */}
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${borderColor}`}>
          <div className={`text-xs font-medium ${textColor}`}>
            © {currentYear} <span className="font-bold">AI Contents Studio</span>. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className={`text-xs font-bold transition-colors hover:text-blue-500 ${textColor}`}>Privacy Policy</Link>
            <Link href="/terms" className={`text-xs font-bold transition-colors hover:text-blue-500 ${textColor}`}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}