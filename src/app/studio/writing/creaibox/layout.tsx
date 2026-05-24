"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutGrid, FileEdit, Zap, BarChart3, Image, 
  Settings, Bot, History, Sparkles, Database
} from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';
import Footer from '@/components/layout/Footer';

export default function CreaiboxBlogLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🌟 Creaibox 블로그 전용 핵심 메뉴 (지식 생산성 최적화)
  const tabs = [
    { id: 'home', label: 'CreAIbox 블로그 홈', icon: LayoutGrid, color: 'text-blue-400', href: '/studio/writing/creaibox' },
    { id: 'create', label: 'AI 포스팅 글쓰기', icon: FileEdit, color: 'text-indigo-400', href: '/studio/writing/creaibox/create' },
    { id: 'editor', label: 'AI 포스팅 에디터', icon: FileEdit, color: 'text-indigo-400', href: '/studio/writing/creaibox/editor' },
    { id: 'archive', label: '발행 콘텐츠 아카이브', icon: History, color: 'text-purple-400', href: '/studio/writing/creaibox/list' },
    { id: 'smart-gen', label: '아이디어 제너레이터', icon: Zap, color: 'text-yellow-400', href: '/studio/writing/creaibox/ideagenerator' },
    { id: 'analytics', label: '트렌드 대시보드', icon: BarChart3, color: 'text-emerald-400', href: '/studio/writing/creaibox/analytics' },
    { id: 'media', label: 'AI 이미지 워크샵', icon: Image, color: 'text-pink-400', href: '/studio/writing/creaibox/media' },
    { id: 'knowledge', label: '지식 베이스', icon: Database, color: 'text-cyan-400', href: '/studio/writing/creaibox/knowledge' },
    { id: 'engine', label: '엔진 커스텀 세팅', icon: Settings, color: 'text-zinc-400', href: '/studio/writing/creaibox/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#050505] text-zinc-100 font-sans">

      <div className="flex flex-1 pt-20 overflow-hidden">
        
        <Sidebar 
          activeMenu="Writing" 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 flex flex-col min-w-0 border-l border-zinc-800 bg-[#050505] overflow-y-auto custom-scrollbar">
          
          {/* 🌟 Creaibox 전용 프리미엄 네비게이션 바 */}
          <div className="sticky top-0 z-20 flex items-stretch px-4 border-b shrink-0 bg-[rgba(31,58,147,0.96)] backdrop-blur-xl border-indigo-300/20 shadow-[0_10px_30px_rgba(31,58,147,0.28)]">
            <div className="flex overflow-x-auto no-scrollbar w-full gap-2 items-stretch">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all relative shrink-0 ${
                      isActive 
                        ? 'text-indigo-700 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.14)]' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon size={16} className={isActive ? 'text-indigo-600' : tab.color} />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex-1 w-full mx-auto px-0 pb-0 pt-0">
            {children}
          </div>
        </main>

        <div className="hidden xl:flex shrink-0 border-l border-zinc-800 bg-[#050505] overflow-y-auto custom-scrollbar">
          <Aside />
        </div>
      </div>

      <div className="w-full border-t border-zinc-800 bg-[#050505] z-[110]">
        <Footer />
      </div>
    </div>
  );
}
