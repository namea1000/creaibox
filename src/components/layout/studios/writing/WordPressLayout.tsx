"use client";

import React from 'react';
import { PenLine, FileText, ImageIcon, ImagePlus, CalendarCheck, Settings2, Search, ExternalLink, MessageSquareText } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function WordPressLayout({ children, isDarkMode }: any) {
  const router = useRouter();
  const pathname = usePathname(); // 현재 어떤 주소에 있는지 확인

  // 🌟 주소 기반으로 탭 리스트 정의
  const tabs = [
    { id: 'create', label: '글 생성', icon: PenLine, href: '/studio/writing/wp/create' },
    { id: 'manage', label: '글 관리', icon: FileText, href: '/studio/writing/wp/manage' },
    { id: 'thumbnail', label: 'Ai 썸네일', icon: ImageIcon, href: '/studio/writing/wp/thumbnail' },
    { id: 'image-insert', label: '이미지 삽입', icon: ImagePlus, href: '/studio/writing/wp/image-insert' },
    { id: 'publish', label: '예약 발행', icon: CalendarCheck, href: '/studio/writing/wp/publish' },
    { id: 'api-config', label: 'API 선택', icon: Settings2, href: '/studio/writing/wp/api-config' },
    { id: 'google-search', label: '구글 검색', icon: Search, href: '/studio/writing/wp/google-search' },
    { id: 'naver-search', label: '네이버 검색', icon: ExternalLink, href: '/studio/writing/wp/naver-search' },
    { id: 'ai-chat', label: 'AI 채팅', icon: MessageSquareText, href: '/studio/writing/wp/chat' },
  ];

  const themeBg = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const headerBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-zinc-50 border-zinc-200";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const tabInactiveColor = isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900";

  return (
    <div className={`flex h-full transition-colors duration-500 overflow-hidden font-sans ${themeBg} ${textColor}`}>
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 탭 네비게이션 - 원본 디자인 100% 유지 */}
        <div className={`flex items-center px-6 border-b shrink-0 transition-all ${headerBg}`}>
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href; // 주소가 일치하면 활성화
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.href)} // 🌟 이제 함수가 아니라 '주소'로 이동합니다
                  className={`flex items-center gap-2 px-6 py-5 text-[13px] font-black uppercase tracking-tighter transition-all relative shrink-0 ${
                    isActive ? 'text-blue-500' : tabInactiveColor
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.6)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 핵심 알맹이가 들어가는 곳 */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}