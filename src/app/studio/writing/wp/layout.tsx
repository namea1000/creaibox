"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  PenLine, FileText, ImageIcon, ImagePlus, 
  CalendarCheck, Settings2, Search, ExternalLink, MessageSquareText 
} from 'lucide-react';

// 공통 부품들 불러오기
import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';
import Footer from '@/components/layout/Footer';

export default function WordPressLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🌟 워드프레스 전용 탭 리스트 (사장님 원본 그대로 보전)
  const tabs = [
    { id: 'create', label: '글 생성', icon: PenLine, href: '/studio/writing/wp/create' },
    { id: 'list', label: '글 관리', icon: FileText, href: '/studio/writing/wp/list' },
    { id: 'thumbnail', label: 'Ai 썸네일', icon: ImageIcon, href: '/studio/writing/wp/thumbnail' },
    { id: 'image-insert', label: '이미지 삽입', icon: ImagePlus, href: '/studio/writing/wp/image' },
    { id: 'publish', label: '예약 발행', icon: CalendarCheck, href: '/studio/writing/wp/publish' },
    { id: 'api-config', label: 'API 선택', icon: Settings2, href: '/studio/writing/wp/api' },
    { id: 'google-search', label: '구글 검색', icon: Search, href: '/studio/writing/wp/google' },
    { id: 'naver-search', label: '네이버 검색', icon: ExternalLink, href: '/studio/writing/wp/naver' },
    { id: 'ai-chat', label: 'AI 채팅', icon: MessageSquareText, href: '/studio/writing/wp/chat' },
  ];

  return (
    /* 🌟 1. 전체를 flex-col로 감싸서 헤더-본문-푸터 3단 구조로 층을 쌓습니다. */
    <div className="flex flex-col min-h-screen w-full bg-[#0a0c10] text-zinc-100 font-sans">

      {/* 🌟 2. 중앙 영역: 사이드바 + 메인 + 어사이드 (푸터 위쪽 층) */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        
        {/* 좌측 사이드바 */}
        <Sidebar 
          activeMenu="Writing" 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* 중앙 작업 영역: 푸터 밖으로 뺐으므로 독립 스크롤 적용 */}
        <main className="flex-1 flex flex-col min-w-0 border-l border-zinc-800/50 bg-[#05070a] overflow-y-auto custom-scrollbar">
          
          {/* 상단 탭 네비게이션 (스크롤 시에도 상단 고정을 위해 sticky 적용) */}
          <div className="sticky top-0 z-20 flex items-center px-6 border-b shrink-0 bg-[#05070a]/80 backdrop-blur-md border-zinc-800/50">
            <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex items-center gap-2 px-6 py-5 text-[13px] font-black uppercase tracking-tighter transition-all relative shrink-0 ${
                      isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <tab.icon size={15} />
                    {tab.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 🌟 실제 페이지 내용 영역 */}
          <div className="flex-1 w-full mx-auto">
            {children}
          </div>
        </main>

        {/* 우측 Aside 정보창 (독립 스크롤) */}
        <div className="hidden xl:flex shrink-0 border-l border-zinc-800/50 bg-[#05070a] overflow-y-auto custom-scrollbar">
          <Aside />
        </div>
      </div>

      {/* 🌟 3. 푸터: 가장 바깥층으로 배치하여 화면 전체 너비를 가로지릅니다. */}
      <div className="w-full border-t border-zinc-800/50 bg-[#0a0c10] z-[110]">
        <Footer />
      </div>
    </div>
  );
}