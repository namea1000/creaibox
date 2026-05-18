"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Globe, MessageSquare, Video, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // 🌟 헤더 파일의 menuItems 명칭과 href 주소를 완벽하게 참조하여 3대 섹션으로 재배치했습니다.
  const footerSections = [
    {
      title: "Core Studio",
      links: [
        { label: "콘텐츠 기획", href: "/studio/planning" },
        { label: "글쓰기", href: "/studio/writing" },
        { label: "이미지", href: "/studio/image" },
        { label: "비디오", href: "/studio/video" },
        { label: "뮤직", href: "/studio/music" },
      ]
    },
    {
      title: "Trends & Tools",
      links: [
        { label: "블로그", href: "/studio/blog" },
        { label: "키워드 트랜드", href: "/studio/keyword" }, // 헤더 원본 오타(트랜드) 일치화
        { label: "유튜브 트랜드", href: "/studio/youtube" }, // 헤더 원본 오타(트랜드) 일치화
        { label: "리포트", href: "/studio/report" },
        { label: "Tools", href: "/studio/tools" },
      ]
    },
    {
      title: "Company & Support",
      links: [
        { label: "About Us", href: "/about" },
        { label: "인포센터", href: "/infocenter" },
        { label: "Help Center", href: "/help" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ]
    }
  ];

  const bgColor = "bg-[#0a0c10]";
  const borderColor = "border-zinc-800/50";
  const textColor = "text-zinc-400";
  const titleColor = "text-zinc-100";

  return (
    <footer className={`w-full border-t transition-all ${bgColor} ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            {/* 로고 영역 - 사장님의 메인 브랜드명 'CreAIbox' 반영 */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8">
                <Image src="/logobg.webp" alt="Footer Logo" fill className="object-contain" />
              </div>
              <span className={`text-xl font-black italic tracking-tighter ${titleColor}`}>
                CreAI<span className="text-blue-500">box</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-sm ${textColor}`}>
              상상력을 현실로 만드는 가장 똑똑한 방법. <br />
              올인원 AI 콘텐츠 생성 플랫폼, 크리에이아이박스입니다.
            </p>
            <div className="flex gap-4">
              {[Globe, MessageSquare, Video, Mail].map((Icon, idx) => (
                <button 
                  key={idx} 
                  className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all hover:text-blue-500 hover:border-blue-500/50"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* 섹션 반복 렌더링 - 헤더 참조 데이터 기반 구조화 */}
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

        {/* 하단 카피라이트 및 법적 고지 - 회사 공식 이름인 'CreAI Labs' 반영 */}
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${borderColor}`}>
          <div className={`text-xs font-medium ${textColor}`}>
            © {currentYear} <span className="font-bold">CreAI Labs</span>. All rights reserved.
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