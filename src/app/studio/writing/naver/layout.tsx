"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, PenLine, RefreshCw, FileText, ImageIcon, 
  Search, Eye, HelpCircle, Settings2, Sliders
} from 'lucide-react';

// 공통 부품들 불러오기 (기존 인프라 완전 보존)
import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';
import Footer from '@/components/layout/Footer';

export default function NaverWritingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🌟 홈 화면과 완전 싱크되는 컬러 아이콘 세트
  const tabs = [
    { id: 'home', label: '네이버 글쓰기 홈', icon: Home, color: 'text-emerald-400', href: '/studio/writing/naver' },
    { id: 'create', label: 'AI 스마트 글쓰기', icon: PenLine, color: 'text-emerald-300', href: '/studio/writing/naver/create' },
    { id: 'recreate', label: 'AI 글 재창조', icon: RefreshCw, color: 'text-blue-400', href: '/studio/writing/naver/recreate' },
    { id: 'list', label: '발행 원고 관리', icon: FileText, color: 'text-purple-400', href: '/studio/writing/naver/list' },
    { id: 'thumbnail', label: '네이버용 썸네일', icon: ImageIcon, color: 'text-amber-400', href: '/studio/writing/naver/thumbnail' },
    { id: 'keyword', label: '네이버 키워드 분석', icon: Search, color: 'text-cyan-400', href: '/studio/writing/naver/keyword' },
    { id: 'rank-check', label: '실시간 노출 진단', icon: Eye, color: 'text-rose-400', href: '/studio/writing/naver/diagnosis' },
    { id: 'blog-guide', label: 'C-Rank 가이드', icon: HelpCircle, color: 'text-yellow-400', href: '/studio/writing/naver/guide' },
    { id: 'api-config', label: '엔진 최적화 세팅', icon: Settings2, color: 'text-zinc-400', href: '/studio/writing/naver/api' },
  ];

  return (
    /* 🌟 구조 규칙 준수: 헤더-본문-푸터 3단 구조 */
    <div className="flex flex-col min-h-screen w-full bg-[#0a0c10] text-zinc-100 font-sans">

      {/* 중앙 영역: 사이드바 + 메인 + 어사이드 */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        
        {/* 좌측 사이드바 - Writing 메뉴 활성화 인프라 유지 */}
        <Sidebar 
          activeMenu="Writing" 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* 중앙 작업 영역: 독립 스크롤 적용 */}
        <main className="flex-1 flex flex-col min-w-0 border-l border-zinc-800/50 bg-[#05070a] overflow-y-auto custom-scrollbar">
          
          <div className="sticky top-0 z-20 flex items-center px-4 border-b shrink-0 bg-[#04b85a] border-[#03964a] shadow-[0_8px_24px_rgba(4,184,90,0.22)]">
            <div className="flex overflow-x-auto no-scrollbar py-1.5 w-full gap-2">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-bold tracking-tight transition-all relative shrink-0 rounded-xl my-1 border ${
                      isActive 
                        ? 'text-[#04b85a] bg-white border-white shadow-[0_4px_15px_rgba(0,0,0,0.14)]' 
                        : 'text-white/92 hover:text-white hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <tab.icon 
                      size={18} 
                      className={`shrink-0 transition-transform ${
                        isActive ? 'text-[#04b85a]' : `${tab.color} drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]`
                      }`} 
                    />
                    
                    <span className={isActive ? 'font-black' : 'font-semibold'}>
                      {tab.label}
                    </span>

                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-zinc-200/20" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 🌟 실제 페이지 내용 영역 (하위 메뉴 컴포넌트가 꼽히는 구역) */}
          <div className="flex-1 w-full mx-auto">
            {children}
          </div>
        </main>

        {/* 우측 Aside 정보창 (독립 스크롤 완전 유지) */}
        <div className="hidden xl:flex shrink-0 border-l border-zinc-800/50 bg-[#05070a] overflow-y-auto custom-scrollbar">
          <Aside />
        </div>
      </div>

      {/* 푸터: 화면 전체 너비 바닥 고정 구조 보존 */}
      <div className="w-full border-t border-zinc-800/50 bg-[#0a0c10] z-[110]">
        <Footer />
      </div>
    </div>
  );
}
