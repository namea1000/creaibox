"use client";

import React, { useState } from 'react';
import { 
  Megaphone, MessageSquare, HelpCircle, BookOpenCheck, Lightbulb, 
  Users, Hash, Search, TrendingUp 
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';
import Footer from '@/components/layout/Footer';

export default function InfoCenterIntegratedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const tabs = [
    { id: 'all', label: '전체글', icon: Hash, href: '/infocenter/list/all' },
    { id: 'notice', label: '공지사항', icon: Megaphone, href: '/infocenter/list/notice' },
    { id: 'free', label: '자유게시판', icon: MessageSquare, href: '/infocenter/list/free' },
    { id: 'qna', label: 'Q&A 질문', icon: HelpCircle, href: '/infocenter/list/qna' },
    { id: 'faq', label: 'FAQ', icon: BookOpenCheck, href: '/infocenter/list/faq' },
    { id: 'tips', label: '꿀팁/노하우', icon: Lightbulb, href: '/infocenter/list/tips' },
    { id: 'showcase', label: '작품공유', icon: Users, href: '/infocenter/list/showcase' },
  ];

  return (
    /* 🌟 1. 전체를 flex-col로 감싸서 헤더-본문-푸터 순서로 층을 쌓습니다. */
    <div className="flex flex-col min-h-screen w-full bg-[#0a0c10] text-zinc-100 font-sans">

      {/* 🌟 2. 중앙 영역: 사이드바 + 메인 + 어사이드 */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        
        <Sidebar 
          activeMenu="InfoCenter" 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 flex flex-col min-w-0 border-l border-zinc-800/50 bg-[#05070a] overflow-y-auto custom-scrollbar">
          
          {/* 상단 탭 메뉴 (고정 느낌을 위해 shrink-0) */}
          <div className="sticky top-0 z-20 flex items-center px-6 border-b shrink-0 bg-[#05070a]/80 backdrop-blur-md border-zinc-800/50">
            <div className="pr-4 mr-2 border-r border-zinc-800/50 py-4">
              <Link href="/infocenter" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 transition-all">
                <span className="text-[11px] font-black uppercase tracking-widest italic">인포센터 홈</span>
              </Link>
            </div>
            <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link key={tab.id} href={tab.href} className={`flex items-center gap-2 px-6 py-5 text-[13px] font-black uppercase tracking-tighter transition-all relative shrink-0 ${isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}>
                    <tab.icon size={15} />
                    {tab.label}
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.6)]" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 🌟 실제 게시글 내용이 나오는 곳 */}
          <div className="flex-1 max-w-6xl w-full mx-auto p-8 lg:p-12">
            {children}
          </div>
        </main>

        <aside className="w-80 border-l border-zinc-800/50 flex flex-col shrink-0 hidden lg:flex bg-[#05070a] overflow-y-auto custom-scrollbar">
          <div className="p-6 border-b border-zinc-800/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input type="text" placeholder="커뮤니티 검색" className="w-full border border-zinc-700/50 bg-zinc-800/50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-zinc-100 focus:outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="flex-1 p-6 space-y-8">
            <div>
              <h3 className="flex items-center gap-2 text-[11px] font-black text-blue-500 uppercase tracking-widest mb-4"><TrendingUp size={14} /> Hot Topics</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-blue-500/30 transition-all cursor-pointer group">
                    <p className="text-xs font-bold leading-relaxed line-clamp-2 text-zinc-300 group-hover:text-white transition-colors">AI 트렌드와 수익화 전략 공유 #{i}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-800/50"><Aside /></div>
          </div>
        </aside>

      </div>

      {/* 🌟 3. 푸터를 바깥으로 뺐습니다! 이제 화면 전체 너비를 차지하며 바닥에 고정됩니다. */}
      <div className="w-full border-t border-zinc-800/50 bg-[#0a0c10] z-30">
        <Footer />
      </div>
    </div>
  );
}