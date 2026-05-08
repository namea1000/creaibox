"use client";

import React, { useState, useEffect, useRef } from 'react';
// ✅ 경로 수정: components가 src 안으로 들어갔으므로 이제 올바르게 인식됩니다.
import StudioLayout from '@/components/layout/StudioLayout';
import { ChevronDown, User as UserIcon, Settings, LogOut, Sparkles, Zap, ArrowRight, MousePointer2 } from 'lucide-react';
// ✅ 경로 수정: utils도 src 안으로 이동됨
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      
      {/* --- 전역 헤더 --- */}
      <header className="h-25 border-b border-zinc-800/50 bg-black/80 backdrop-blur-md flex items-center px-12 z-[100] relative shrink-0">
        <div className="absolute left-10 h-full flex items-center">
          <div 
            className="flex items-center gap-5 cursor-pointer group transition-all duration-500 hover:brightness-125"
            onClick={() => {
              setIsStudioActive(false);
              setStudioViewMode('Studio');
            }}
          >
            <div className="relative w-50 h-50 overflow-visible flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500" />
              <Image 
                src="/logobg.webp" 
                alt="Creaibox Logo"
                fill
                className="object-contain relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-110"
                priority
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <nav className="flex space-x-12">
            {menuItems.map((item) => (
              <button 
                key={item.value} 
                onClick={() => { 
                  setActiveMenu(item.value); 
                  setStudioViewMode('Studio'); 
                  setIsStudioActive(true); 
                }} 
                className={`text-2xl font-black uppercase tracking-tighter transition-all duration-300 relative py-1 ${
                  isStudioActive && activeMenu === item.value && studioViewMode === 'Studio' 
                    ? 'text-blue-500 scale-110' 
                    : 'text-white hover:text-blue-400 hover:scale-105'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute right-8 h-full flex items-center gap-4">
          {user ? (
<div className="relative" ref={dropdownRef}>
  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800/50 transition-all group">
    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform">
      {user.email?.[0].toUpperCase()}
    </div>
    {/* 🌟 [수정 1] 아이디만 보여주던 split 부분을 지우고 이메일 전체 표시 */}
    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">{user.email}</span>
    <ChevronDown size={18} className={`text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
  </button>
  
  {isProfileOpen && (
    <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110]">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
        <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-tighter">Member Identity</p>
        {/* 🌟 [수정 2] 드롭다운 안에서도 이메일 전체 표시 */}
        <p className="text-xs font-bold truncate text-white">{user.email}</p>
      </div>
                  
                  <button 
                    onClick={() => { 
                      setIsProfileOpen(false); 
                      setIsStudioActive(true); 
                      setStudioViewMode('MyPage'); 
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <UserIcon size={16} />내 프로필
                  </button>
                  
                  <button 
                    onClick={() => { 
                      setIsProfileOpen(false); 
                      setIsStudioActive(true); 
                      setStudioViewMode('Vault'); 
                    }} 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Settings size={16} />API 키 관리
                  </button>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all border-t border-zinc-800 mt-1">
                    <LogOut size={16} />로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-all">로그인</Link>
              <Link href="/signup">
                <button className="px-6 py-2.5 bg-[#F6962F] hover:bg-[#E0851F] text-white text-sm font-black rounded-lg shadow-lg active:scale-95 transition-transform">회원가입</button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* --- 메인 콘텐츠 영역 --- */}
      <div className="flex-1 flex overflow-hidden">
        {isStudioActive ? (
          <StudioLayout activeMenu={activeMenu} initialViewMode={studioViewMode} />
        ) : (
          <div className="flex-1 overflow-y-auto bg-[#05070a] custom-scrollbar relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-8 pt-20 pb-24 flex flex-col items-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold mb-10 shadow-sm animate-fade-in">
                <Sparkles size={14} /> All-in-One AI Creative Platform
              </div>

              <div className="relative mb-12 group cursor-default">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px] group-hover:bg-blue-500/30 transition-all duration-1000 scale-150" />
                <div className="relative overflow-visible">
                  <Image 
                    src="/logobg.webp" 
                    alt="Creaibox Hero Logo"
                    width={750} 
                    height={280}
                    className="object-contain drop-shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-transform duration-700 hover:scale-[1.03]"
                    priority
                  />
                </div>
              </div>

              <p className="text-zinc-400 text-xl font-medium text-center max-w-2xl leading-relaxed mb-12 animate-fade-in opacity-80">
                최첨단 AI 모델로 상상하는 모든 것을 생성하세요. <br />
                단 한 곳에서 제어하는 완벽한 크리에이티브 환경.
              </p>

              <div className="flex gap-5 mb-20">
                <button 
                  onClick={() => { setActiveMenu('Writing'); setIsStudioActive(true); setStudioViewMode('Studio'); }}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-3 group text-base active:scale-95"
                >
                  Start Creating <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
                <button className="px-10 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-black rounded-2xl text-base transition-all active:scale-95 shadow-lg">
                  Explore Tools
                </button>
              </div>

              <div className="w-full text-left">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-800/50 pb-5">
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                     <MousePointer2 size={24} className="text-blue-500" /> POPULAR STUDIOS
                   </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {menuItems.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => { setActiveMenu(item.value); setIsStudioActive(true); setStudioViewMode('Studio'); }}
                      className="group bg-zinc-900/40 border border-zinc-800 p-8 rounded-[32px] hover:border-blue-500/50 hover:bg-zinc-900/60 transition-all cursor-pointer relative overflow-hidden shadow-sm"
                    >
                      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 border border-zinc-700 group-hover:scale-110 transition-all duration-500 shadow-inner">
                        <Zap size={22} className="text-blue-400 group-hover:text-blue-300" />
                      </div>
                      <h4 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors uppercase italic tracking-tight">{item.label}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed font-medium opacity-80">{item.desc}</p>
                      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
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