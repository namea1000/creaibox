"use client";

import React, { useState } from 'react';
import { 
  Megaphone, MessageSquare, HelpCircle, Lightbulb, 
  Users, Hash, ArrowLeft, Search, TrendingUp 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CommunityCenter from '@/components/community/CommunityCenter'; // 분리한 컴포넌트 임포트

export default function CommunityLayout({ isDarkMode, user }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // 테마 설정
  const themeBg = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const headerBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-zinc-50 border-zinc-200";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const tabInactiveColor = isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900";

  const tabs = [
    { id: 'all', label: '전체글', icon: Hash },
    { id: 'notice', label: '공지사항', icon: Megaphone },
    { id: 'free', label: '자유게시판', icon: MessageSquare },
    { id: 'qna', label: 'Q&A 질문', icon: HelpCircle },
    { id: 'tips', label: '꿀팁/노하우', icon: Lightbulb },
    { id: 'showcase', label: '작품공유', icon: Users },
  ];

  return (
    <div className={`flex-1 flex flex-col min-w-0 transition-colors duration-500 overflow-hidden font-sans ${themeBg} ${textColor}`}>
    <div className="flex-1 flex min-w-0 overflow-hidden"> {/* 내부 컨테이너 추가 */}
        
        {/* 1. 상단 네비게이션 바 */}
        <div className={`flex items-center px-6 border-b shrink-0 transition-all ${headerBg}`}>
          <div className="pr-4 mr-2 border-r border-zinc-800/50 py-4">
            <button 
              onClick={() => router.push('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 group ${
                isDarkMode ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <ArrowLeft size={16} className="text-blue-500 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-widest italic">커뮤니티홈</span>
            </button>
          </div>

          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[13px] font-black uppercase tracking-tighter transition-all relative shrink-0 ${
                  activeTab === tab.id ? 'text-blue-500' : tabInactiveColor
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

        {/* 2. 게시판 실제 콘텐츠 (메인 로직 컴포넌트) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-6xl mx-auto">
             <CommunityCenter 
                isDarkMode={isDarkMode} 
                user={user} 
                activeTab={activeTab} 
                tabLabel={tabs.find(t => t.id === activeTab)?.label}
             />
          </div>
        </div>
      </div>

      {/* 3. 오른쪽 사이드바 */}
      <div className={`w-80 border-l flex flex-col shrink-0 hidden lg:flex ${isDarkMode ? 'bg-zinc-900/10 border-zinc-800/50' : 'bg-zinc-100/50 border-zinc-200'}`}>
        <div className="p-6 border-b border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input type="text" placeholder="커뮤니티 검색" className={`w-full border rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none ${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/50 text-zinc-100' : 'bg-white border-zinc-200'}`} />
          </div>
        </div>
        <div className="flex-1 p-6">
          <h3 className="flex items-center gap-2 text-[11px] font-black text-blue-500 uppercase tracking-widest mb-4">
            <TrendingUp size={14} /> Hot Topics
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <p className="text-xs font-bold leading-relaxed line-clamp-2">AI 트렌드와 수익화 전략 공유</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}