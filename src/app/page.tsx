"use client";

import React, { useState, useEffect, useRef } from 'react';
import StudioLayout from '@/components/layout/StudioLayout';
import { 
  ChevronDown, User as UserIcon, Settings, LogOut, Sparkles, 
  Zap, ArrowRight, MousePointer2, Moon, Sun, Menu, X 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

export default function MainLandingPage() {
  const [isStudioActive, setIsStudioActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Writing');
  const [studioViewMode, setStudioViewMode] = useState<'Studio' | 'Vault' | 'MyPage'>('Studio');
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // 🌟 다크모드 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🌟 모바일 햄버거 상태
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // 테마 설정 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 테마 변경 로직
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const menuItems = [
    { label: 'Writing Studio', value: 'Writing', desc: 'AI 글쓰기 & SEO 최적화 전문 엔진' },
    { label: 'Visuals Studio', value: 'Visuals', desc: '고퀄리티 이미지 및 비디오 생성' },
    { label: 'Music Studio', value: 'Music', desc: '텍스트 기반 AI 작곡 및 사운드 디자인' },
    { label: 'Script Studio', value: 'Script', desc: '유튜브, 광고, 시나리오 대본' },
    { label: 'Tools', value: 'Tools', desc: '크리에이터 마케팅 분석 도구' }
  ];

  // 🌟 세련된 다크/라이트 색상 정의 (너무 블랙하지 않은 딥그레이)
  const themeClasses = isDarkMode 
    ? "bg-[#0a0c10] text-zinc-100 border-zinc-800/50" // 딥 네이비 블랙
    : "bg-zinc-50 text-zinc-900 border-zinc-200";

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-hidden transition-colors duration-500 ${themeClasses}`}>
      
      {/* --- 전역 헤더 --- */}
      <header className={`h-20 border-b flex items-center px-6 lg:px-12 z-[100] relative shrink-0 transition-all ${
        isDarkMode ? 'bg-[#0a0c10]/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'
      }`}>
        
        {/* 로고 영역 */}
        <div className="flex items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group transition-all duration-500"
            onClick={() => { setIsStudioActive(false); setIsMobileMenuOpen(false); }}
          >
            <div className="relative w-50 h-50 overflow-visible">
              <Image src="/logobg.webp" alt="Logo" fill className="object-contain relative z-10" priority />
            </div>
            <span className={`text-xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>AI Contents Studio</span>
          </div>
        </div>
        
        {/* 중앙 메뉴 (데스크톱) - 🌟 폰트 크기 25% 축소 (text-lg) */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <nav className="flex space-x-8">
            {menuItems.map((item) => (
              <button 
                key={item.value} 
                onClick={() => { setActiveMenu(item.value); setIsStudioActive(true); }} 
                className={`text-[15px] font-black uppercase tracking-tight transition-all duration-300 relative py-1 ${
                  isStudioActive && activeMenu === item.value 
                    ? 'text-blue-500 scale-105' 
                    : (isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900')
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 우측 컨트롤 영역 */}
        <div className="flex items-center gap-3 ml-auto">
          {/* 🌟 다크/라이트 전환 버튼 (다운허브스 스타일) */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all active:scale-90 ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-yellow-400 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-blue-600 hover:bg-zinc-100 shadow-sm'
            }`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800/10 transition-all group border border-transparent hover:border-zinc-800/30">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold truncate max-w-[120px]">{user.email}</span>
                <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110] border ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                }`}>
                  <button onClick={() => { setIsProfileOpen(false); setIsStudioActive(true); setStudioViewMode('MyPage'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-blue-500/10 transition-all">
                    <UserIcon size={14} />내 프로필
                  </button>
                  <button onClick={() => { setIsProfileOpen(false); setIsStudioActive(true); setStudioViewMode('Vault'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-blue-500/10 transition-all">
                    <Settings size={14} />API 키 관리
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all border-t mt-1">
                    <LogOut size={14} />로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login" className="text-xs font-bold opacity-70 hover:opacity-100">로그인</Link>
              <Link href="/signup">
                <button className="px-5 py-2 bg-[#F6962F] text-white text-xs font-black rounded-lg shadow-md active:scale-95">회원가입</button>
              </Link>
            </div>
          )}

          {/* 🌟 모바일 햄버거 버튼 */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-500 hover:text-blue-500 transition-all"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 🌟 모바일 메뉴 레이어 */}
        {isMobileMenuOpen && (
          <div className={`fixed inset-0 top-20 z-[120] p-6 lg:hidden ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-white'}`}>
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button 
                  key={item.value} 
                  onClick={() => { setActiveMenu(item.value); setIsStudioActive(true); setIsMobileMenuOpen(false); }} 
                  className="text-2xl font-black text-left border-b border-zinc-800/30 py-4 uppercase italic"
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <div className="mt-6 flex flex-col gap-4">
                  <Link href="/login" className="text-center font-bold py-4 bg-zinc-800 rounded-xl">로그인</Link>
                  <Link href="/signup" className="text-center font-bold py-4 bg-blue-600 rounded-xl">회원가입</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

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
                <Image src="/logobg.webp" alt="Hero Logo" width={600} height={220} className="object-contain drop-shadow-2xl" priority />
              </div>

              <p className={`text-center max-w-2xl leading-relaxed mb-10 text-lg font-medium opacity-70 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                최첨단 AI 모델로 상상하는 모든 것을 생성하세요. <br />
                단 한 곳에서 제어하는 완벽한 크리에이티브 환경.
              </p>

              <div className="flex gap-4 mb-16">
                <button onClick={() => { setActiveMenu('Writing'); setIsStudioActive(true); }} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 group active:scale-95">
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
                      onClick={() => { setActiveMenu(item.value); setIsStudioActive(true); }}
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
          </div>
        )}
      </div>
    </div>
  );
}