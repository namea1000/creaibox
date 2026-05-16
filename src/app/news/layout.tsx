"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, Globe, Landmark, Scale, Monitor, 
  HeartPulse, Tv, Compass, MessageSquareText, TrendingUp,
  LayoutGrid // 🌟 뉴스 홈을 위한 아이콘 추가
} from 'lucide-react';

// 공통 부품들 불러오기
import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';
import Footer from '@/components/layout/Footer';

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🌟 맨 앞에 '뉴스 홈(/news)'을 추가한 럭셔리 탭 네비게이션 배열
  const tabs = [
    { id: 'news-home', label: '뉴스 홈', icon: LayoutGrid, href: '/news' }, // 🚀 1순위 홈 버튼 배치!
    { id: 'headline', label: '헤드라인', icon: Building2, href: '/news/headline' },
    { id: 'politics', label: '정치', icon: Landmark, href: '/news/politics' },
    { id: 'economy', label: '경제', icon: TrendingUp, href: '/news/economy' },
    { id: 'society', label: '사회', icon: Scale, href: '/news/society' },
    { id: 'life', label: '생활/문화', icon: HeartPulse, href: '/news/life' },
    { id: 'it', label: 'IT/과학', icon: Monitor, href: '/news/it' },
    { id: 'world', label: '세계', icon: Globe, href: '/news/world' },
    { id: 'ranking', label: '랭킹', icon: Tv, href: '/news/ranking' },
    { id: 'discovery', label: '신문보기', icon: Compass, href: '/news/discovery' },
    { id: 'opinion', label: '오피니언', icon: MessageSquareText, href: '/news/opinion' },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0c10] text-zinc-100 font-sans">
      <div className="flex flex-1 pt-20 overflow-hidden">
        
        {/* 좌측 사이드바 */}
        <Sidebar 
          activeMenu="News" 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen} // 필요시 기존 Sidebar 스펙에 맞춰 유지
        />

        {/* 중앙 작업 영역 */}
        <main className="flex-1 flex flex-col min-w-0 border-l border-zinc-800/50 bg-[#05070a] overflow-y-auto custom-scrollbar">
          
          {/* 네이버 뉴스 스타일 탭 네비게이션 */}
          <div className="sticky top-0 z-20 flex items-center px-6 border-b shrink-0 bg-[#05070a]/90 backdrop-blur-md border-zinc-800/50">
            <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                // 🌟 현재 주소와 정확히 일치할 때 활성화 불빛이 들어옵니다.
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex items-center gap-2 px-5 py-5 text-[12px] font-black uppercase tracking-tighter transition-all relative shrink-0 ${
                      isActive ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_-2px_10px_rgba(16,185,129,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 실제 뉴스 내용 영역 */}
          <div className="flex-1 w-full mx-auto">
            {children}
          </div>
        </main>

        {/* 우측 Aside 정보창 */}
        <div className="hidden xl:flex shrink-0 border-l border-zinc-800/50 bg-[#05070a] overflow-y-auto custom-scrollbar">
          <Aside />
        </div>
      </div>

      {/* 푸터 */}
      <div className="w-full border-t border-zinc-800/50 bg-[#0a0c10] z-[110]">
        <Footer />
      </div>
    </div>
  );
}