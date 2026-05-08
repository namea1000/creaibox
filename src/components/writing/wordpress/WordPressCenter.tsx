"use client";

import React, { useState } from 'react';
import { PenLine, FileText, ImageIcon, ImagePlus, CalendarCheck, Settings2, Search, MessageSquare, ExternalLink } from 'lucide-react';
import CreateTab from './tabs/CreateTab';
import PostListTab from './tabs/PostListTab'; // 🌟 정확히 임포트 완료!
import GoogleSearchTab from './tabs/GoogleSearchTab';
import NaverSearchTab from './tabs/NaverSearchTab';
import { MessageSquareText } from 'lucide-react'; // 아이콘 추가
import AIChatTab from './tabs/AIChatTab';

export default function WordPressCenter(props: any) {
  // props에는 topic, content, user, handleGenerate 등이 들어있습니다.
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

  return (
    <div className="flex h-full bg-[#05070a] overflow-hidden text-white font-sans">
      {/* --- 메인 작업 영역 --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 탭 네비게이션 (사장님 원본 스타일 반영) */}
        <div className="flex items-center px-6 bg-zinc-900/30 border-b border-zinc-800/50 shrink-0">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-4px_12px_rgba(59,130,246,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden">
          {/* 🌟 기존 CreateTab 유지 */}
          {activeTab === 'create' && <CreateTab {...props} />}
          
          {/* 2. 🌟 글 관리 탭: 여기가 문제입니다! 빈손으로 보내지 말고 보따리를 쥐여주세요. */}
  {/* 수정 전: {activeTab === 'manage' && <PostListTab />} */}
  {activeTab === 'manage' && <PostListTab {...props} />}
  {activeTab === 'google-search' && <GoogleSearchTab />} {/* 🌟 구글 연결! */}
  {activeTab === 'naver-search' && <NaverSearchTab />} {/* 🌟 네이버 탭 연결! */}
  {activeTab === 'ai-chat' && <AIChatTab />}
          {/* 🌟 나머지 기능들만 Coming Soon 유지 (id에서 manage 삭제) */}
          {['thumbnail', 'image-insert', 'publish', 'api-config'].includes(activeTab) && (
            <div className="flex items-center justify-center h-full text-zinc-600 font-black italic uppercase tracking-widest">
              {activeTab} Content Coming Soon...
            </div>
          )}
        </div>
      </div>

      {/* --- 오른쪽 상시 고정 사이드바 --- */}
      <div className="w-72 border-l border-zinc-800/50 bg-zinc-900/10 flex flex-col shrink-0">
        <div className="p-5 border-b border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="검색 하기" 
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500 transition-all text-zinc-300"
            />
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col gap-4">
          <button className="flex items-center justify-center gap-3 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl transition-all active:scale-[0.95]">
            <MessageSquare size={18} /> AI CHATTING
          </button>
        </div>
      </div>
    </div>
  );
}