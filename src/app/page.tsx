"use client";

import React, { useState, useEffect } from 'react';
import StudioLayout from '@/components/layout/StudioLayout';
import Header from '@/components/layout/Header'; // 🌟 분리한 헤더 컴포넌트 불러오기
import Footer from '@/components/layout/Footer'; // 🌟 분리한 푸터 컴포넌트 불러오기
import { Sparkles, Zap, ArrowRight, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MainLandingPage() {
  const [isStudioActive, setIsStudioActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Writing');
  const [studioViewMode, setStudioViewMode] = useState<'Studio' | 'Vault' | 'MyPage' | 'Community'>('Studio');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // 초기 테마 설정 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  // 테마 변경 로직 (헤더에 전달용)
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // 헤더 메뉴 클릭 시 스튜디오 활성화 로직
  const handleMenuClick = (menuValue: string) => {
    setActiveMenu(menuValue);
    setIsStudioActive(true);
  };

  const menuItems = [
    { label: 'Writing Studio', value: 'Writing', desc: 'AI 글쓰기 & SEO 최적화 전문 엔진' },
    { label: 'Visuals Studio', value: 'Visuals', desc: '고퀄리티 이미지 및 비디오 생성' },
    { label: 'Music Studio', value: 'Music', desc: '텍스트 기반 AI 작곡 및 사운드 디자인' },
    { label: 'Script Studio', value: 'Script', desc: '유튜브, 광고, 시나리오 대본' },
    { label: 'Tools', value: 'Tools', desc: '크리에이터 마케팅 분석 도구' }
  ];

  const themeClasses = isDarkMode 
    ? "bg-[#0a0c10] text-zinc-100" 
    : "bg-zinc-50 text-zinc-900";

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-hidden transition-colors duration-500 ${themeClasses}`}>
      
      {/* --- 전역 헤더 --- */}
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onMenuClick={handleMenuClick} 
      />

      {/* --- 메인 콘텐츠 영역 --- */}
      <div className="flex-1 flex overflow-hidden">
        {isStudioActive ? (
          <StudioLayout 
            activeMenu={activeMenu} 
            initialViewMode={studioViewMode} 
            isDarkMode={isDarkMode} 
          />
        ) : (
          <div className={`flex-1 overflow-y-auto custom-scrollbar relative ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-zinc-50'}`}>
            {/* 배경 블러 효과 */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-400'
            }`} />

            <div className="max-w-6xl mx-auto px-8 pt-16 pb-24 flex flex-col items-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black mb-8 uppercase tracking-widest">
                <Sparkles size={12} /> AI Creative Platform
              </div>

              <div className="relative mb-10 group">
                <Image 
                  src="/logobg.webp" 
                  alt="Hero Logo" 
                  width={600} 
                  height={220} 
                  className="object-contain drop-shadow-2xl" 
                  priority 
                  onClick={() => setIsStudioActive(false)}
                />
              </div>

              <p className={`text-center max-w-2xl leading-relaxed mb-10 text-lg font-medium opacity-70 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                최첨단 AI 모델로 상상하는 모든 것을 생성하세요. <br />
                단 한 곳에서 제어하는 완벽한 크리에이티브 환경.
              </p>

              <div className="flex gap-4 mb-16">
                <button onClick={() => handleMenuClick('Writing')} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 group active:scale-95">
                  Start Creating <ArrowRight size={18} />
                </button>
                <button className={`px-8 py-3.5 border font-black rounded-xl transition-all active:scale-95 ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-100'
                }`}>
                  Explore Tools
                </button>
              </div>

              <div className="w-full">
                <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 mb-8">
                   <MousePointer2 size={20} className="text-blue-500" /> POPULAR STUDIOS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleMenuClick(item.value)}
                      className={`group p-8 rounded-[24px] border transition-all cursor-pointer relative overflow-hidden ${
                        isDarkMode ? 'bg-zinc-900/40 border-zinc-800 hover:border-blue-500/50' : 'bg-white border-zinc-200 hover:border-blue-500 shadow-sm'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        <Zap size={20} className="text-blue-500" />
                      </div>
                      <h4 className="text-lg font-black mb-2 uppercase italic tracking-tight">{item.label}</h4>
                      <p className="text-sm leading-relaxed font-medium opacity-60">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🌟 수술 완료: 메인 콘텐츠가 끝나는 지점에 푸터 삽입 */}
            <Footer isDarkMode={isDarkMode} />
          </div>
        )}
      </div>
    </div>
  );
}