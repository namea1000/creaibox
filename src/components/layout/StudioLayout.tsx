"use client";

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';
import Footer from '@/components/layout/Footer'; 
import Header from '@/components/layout/Header';
import WordPressLayout from '@/components/layout/studios/writing/WordPressLayout'; // 🌟 상단 탭 메뉴를 품은 레이아웃

interface StudioLayoutProps {
  activeMenu: string;
  isDarkMode: boolean;
  children: React.ReactNode;
}

export default function StudioLayout({ 
  activeMenu, 
  isDarkMode,
  children
}: StudioLayoutProps) {
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const supabase = createClient();

  const mainBg = isDarkMode ? "bg-[#0a0c10]" : "bg-zinc-50";

  return (
    <div className={`relative flex h-screen w-full transition-colors duration-500 overflow-hidden font-sans ${mainBg}`}>
      
      {/* 1. 상단 공통 헤더 (Z-index 50으로 최상단 고정) */}
      <div className="fixed top-0 left-0 right-0 z-[50]">
        <Header isDarkMode={isDarkMode} />
      </div>

      {/* 2. 사이드바 영역 (상단 헤더 높이만큼 pt-20 추가) */}
      <div className="pt-20 flex shrink-0">
        <Sidebar 
          activeMenu={activeMenu}
          isDarkMode={isDarkMode}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>

      {/* 3. 중앙 본문 영역 (헤더 높이 pt-20 + 추가 여백) */}
      <main className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 pt-20`}>
        
        {/* 🌟 핵심 포인트: 
            Writing 메뉴일 때는 '글생성, 글관리' 탭이 있는 WordPressLayout으로 감싸서 줍니다. */}
        {activeMenu === 'Writing' ? (
          <WordPressLayout isDarkMode={isDarkMode}>
            {children} 
          </WordPressLayout>
        ) : (
          <div className="max-w-7xl mx-auto p-10">
            {children}
          </div>
        )}

        <Footer isDarkMode={isDarkMode} />
      </main>

      {/* 4. 우측 사이드바 (Aside) */}
      <div className="pt-20 hidden xl:flex shrink-0">
        <Aside isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}