"use client";

import React, { useState } from 'react';
import { PenLine, FileText, ImageIcon, ImagePlus, CalendarCheck, Settings2, Search, MessageSquare, ExternalLink } from 'lucide-react';
import CreateTab from './tabs/CreateTab';
import PostListTab from './tabs/PostListTab'; 
import GoogleSearchTab from './tabs/GoogleSearchTab';
import NaverSearchTab from './tabs/NaverSearchTab';
import { MessageSquareText } from 'lucide-react'; 
import AIChatTab from './tabs/AIChatTab';

export default function WordPressCenter(props: any) {
  // 🌟 props에서 전달받은 isDarkMode를 사용합니다.
  const { isDarkMode } = props;
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { id: 'create', label: '글 생성', icon: PenLine },
    { id: 'manage', label: '글 관리', icon: FileText },
    { id: 'thumbnail', label: 'Ai 썸네일', icon: ImageIcon },
    { id: 'image-insert', label: '이미지 삽입', icon: ImagePlus },
    { id: 'publish', label: '예약 발행', icon: CalendarCheck },
    { id: 'api-config', label: 'API 선택', icon: Settings2 },
    { id: 'google-search', label: '구글 검색', icon: Search },
    { id: 'naver-search', label: '네이버 검색', icon: ExternalLink },
    { id: 'ai-chat', label: 'AI 채팅', icon: MessageSquareText },
  ];

  // 🎨 테마별 스타일 정의 (다크 모드 가시성 대폭 강화)
  const themeBg = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const headerBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-zinc-50 border-zinc-200";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900"; // 🌟 다크 모드에서 선명한 화이트
  const tabInactiveColor = isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900";

  return (
    <div className={`flex h-full transition-colors duration-500 overflow-hidden font-sans ${themeBg} ${textColor}`}>
      {/* --- 메인 작업 영역 --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 탭 네비게이션 */}
        <div className={`flex items-center px-6 border-b shrink-0 transition-all ${headerBg}`}>
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[13px] font-black uppercase tracking-tighter transition-all relative shrink-0 ${
                  activeTab === tab.id 
                    ? 'text-blue-500' 
                    : tabInactiveColor
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.6)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'create' && <CreateTab {...props} />}
          {activeTab === 'manage' && <PostListTab {...props} />}
          {activeTab === 'google-search' && <GoogleSearchTab />}
          {activeTab === 'naver-search' && <NaverSearchTab />}
          {activeTab === 'ai-chat' && <AIChatTab />}
          
          {['thumbnail', 'image-insert', 'publish', 'api-config'].includes(activeTab) && (
            <div className={`flex items-center justify-center h-full font-black italic uppercase tracking-[0.2em] opacity-20 text-2xl`}>
              {activeTab} Content Ready
            </div>
          )}
        </div>
      </div>
    </div>
  );
}