"use client";

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🌟 분리된 사이드바와 알맹이 컴포넌트들
import Sidebar from '@/components/layout/Sidebar';
import WordPressContent from '@/components/writing/wordpress/WordPressCenter';
import APIVaultContent from '@/components/vault/APIVaultContent'; 
import MyPageContent from '@/components/mypage/MyPageContent'; 
import CommunityCenter from '@/components/community/CommunityCenter';
import Aside from '@/components/layout/Aside';
import Footer from '@/components/layout/Footer'; // 🌟 분리한 푸터 컴포넌트 불러오기

interface StudioLayoutProps {
  activeMenu: string;
  initialViewMode?: 'Studio' | 'Vault' | 'MyPage' | 'Community';
  isDarkMode: boolean;
}

export default function StudioLayout({ 
  activeMenu, 
  initialViewMode = 'Studio',
  isDarkMode
}: StudioLayoutProps) {
  
  // --- 상태 관리 (사이드바 제어 및 뷰 모드) ---
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<any>(initialViewMode);
  const [activeSubMenu, setActiveSubMenu] = useState('워드프레스 글쓰기');

  // --- 글쓰기 관련 상태 및 로직 (알맹이 데이터) ---
  const [apiKey, setApiKey] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [tone, setTone] = useState("전문적이고 분석적인 말투 (경제, 기술, 정보전달)");
  const [length, setLength] = useState("보통 (약 1,500자): 표준 블로그형 (일반적인 정보성 포스팅)");
  const [user, setUser] = useState<any>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    fetchUser();
    
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  // AI 생성 및 핸들러 로직 (WordPressContent 전달용)
  const handleGenerate = async () => {
    if (!apiKey) return alert("Gemini API 키를 입력해주세요!");
    if (!topic) return alert("작성할 주제를 입력해주세요!");

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const dateString = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

      const prompt = `[SYSTEM: PROFESSIONAL CONTENT CREATOR] 오늘 날짜는 ${dateString}입니다. 주제: "${topic}" 말투: "${tone}" 길이: "${length}"...`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      const response = await result.response;
      setContent(response.text());
    } catch (error: any) {
      console.error("AI 생성 에러:", error);
      alert("에러가 발생했습니다.");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!content) return alert("내용이 없습니다.");
    await navigator.clipboard.writeText(content);
    alert("복사되었습니다!");
  };

  const handleDownload = () => {
    if (!content) return alert("내용이 없습니다.");
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${topic || 'content'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const mainBg = isDarkMode ? "bg-[#0a0c10]" : "bg-zinc-50";

  return (
    <div className={`relative flex h-full w-full transition-colors duration-500 overflow-hidden font-sans ${mainBg}`}>
      
      {/* 📱 모바일 상단 바 */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b z-[40] flex items-center justify-between px-5 transition-all ${
        isDarkMode ? 'bg-[#0d1117] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <button onClick={() => setIsMobileOpen(true)} className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          <Menu size={24} />
        </button>
        <h1 className={`font-black italic text-lg tracking-tighter ${isDarkMode ? 'text-yellow-400' : 'text-blue-600'}`}>AI Contents Studio</h1>
        <div className="w-10"></div>
      </div>

      {/* 🌟 1. 분리된 사이드바 컴포넌트 조립 */}
      <Sidebar 
        activeMenu={activeMenu}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={setActiveSubMenu}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDarkMode={isDarkMode}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 🌟 2. 메인 콘텐츠 영역 (알맹이) */}
      <main className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${isMobileOpen ? 'blur-sm pointer-events-none' : ''} lg:p-10 p-5 pt-20 lg:pt-10`}>
        {viewMode === 'Studio' ? (
          activeMenu === 'Writing' && activeSubMenu === '워드프레스 글쓰기' ? (
            <WordPressContent 
              isDarkMode={isDarkMode} 
              isDark={isDarkMode} 
              topic={topic} setTopic={setTopic} 
              handleGenerate={handleGenerate} 
              loading={loading} 
              content={content} 
              useSearch={useSearch} setUseSearch={setUseSearch} 
              handleCopy={handleCopy} 
              handleDownload={handleDownload} 
              tone={tone} setTone={setTone} 
              length={length} setLength={setLength} 
              user={user}
            />
          ) : (
            <div className={`flex flex-col items-center justify-center h-full opacity-30 italic font-bold text-2xl ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {activeSubMenu} 준비 중...
            </div>
          )
        ) : viewMode === 'Vault' ? (
          <APIVaultContent />
        ) : viewMode === 'MyPage' ? (
          <MyPageContent />
        ) : viewMode === 'Community' ? (
          <CommunityCenter isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center h-full opacity-20 font-black text-2xl">READY</div>
        )}
        <Footer isDarkMode={isDarkMode} />
      </main>
      <Aside isDarkMode={isDarkMode} />
    </div>
  );
}