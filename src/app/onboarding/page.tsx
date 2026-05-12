"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header'; 
import Footer from '@/components/layout/Footer'; 
import { 
  Sparkles, Zap, ArrowRight, Gift, Rocket, Key, PlayCircle, 
  Star, MessageSquare, StickyNote, BookOpen, Newspaper, Construction
} from 'lucide-react';
import Image from 'next/image';

export default function MainLandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const themeClasses = isDarkMode ? "bg-[#05070a] text-white" : "bg-white text-zinc-900";

  const studioItems = [
    { title: 'Writing', icon: <Zap size={18}/>, color: 'text-blue-400', border: 'hover:border-blue-500/50', bg: 'group-hover:bg-blue-600' },
    { title: 'Visuals', icon: <Star size={18}/>, color: 'text-purple-400', border: 'hover:border-purple-500/50', bg: 'group-hover:bg-purple-600' },
    { title: 'Music', icon: <Rocket size={18}/>, color: 'text-rose-400', border: 'hover:border-rose-500/50', bg: 'group-hover:bg-rose-600' },
    { title: 'AI Chating', icon: <MessageSquare size={18}/>, color: 'text-emerald-400', border: 'hover:border-emerald-500/50', bg: 'group-hover:bg-emerald-600' },
    { title: 'Cre Note', icon: <StickyNote size={18}/>, color: 'text-amber-400', border: 'hover:border-amber-500/50', bg: 'group-hover:bg-amber-600' },
    { title: 'Cre Blog', icon: <BookOpen size={18}/>, color: 'text-indigo-400', border: 'hover:border-indigo-500/50', bg: 'group-hover:bg-indigo-600' },
    { title: 'Reporter', icon: <Newspaper size={18}/>, color: 'text-orange-400', border: 'hover:border-orange-500/50', bg: 'group-hover:bg-orange-600' }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${themeClasses}`}>
      
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} onMenuClick={() => {}} setViewMode={() => {}} />

      <main className="flex-1 overflow-y-auto pt-12 pb-20">
        
        {/* 1. 히어로 섹션 */}
        <section className="relative max-w-7xl mx-auto px-6 pt-6 pb-12 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-6 w-full max-w-5xl">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 text-[15px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/5">
              <Gift size={18} /> Beta Version: Unlimited Free Access
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[68px] font-black italic uppercase tracking-tighter leading-[1.15] px-6 break-keep">
              차세대 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400">AI 콘텐츠 스튜디오</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg font-medium opacity-75 leading-relaxed break-keep px-6">
              구글 제미나이, 쳇 GPT, 클로드, SUNO AI 를 모두 품은 <br className="hidden md:block" />
              하나의 플랫폼에서 펼쳐지는 무한한 창작의 가능성. <br />
              CreAibox가 당신의 상상력에 엔진을 달아드립니다.
            </p>
          </div>

          <div className="mt-10 relative group">
            <Image 
              src="/logobg.webp" 
              alt="Creaibox Hero" 
              width={540} 
              height={200} 
              className="relative object-contain drop-shadow-[0_0_50px_rgba(37,99,235,0.25)]" 
            />
          </div>
        </section>

        {/* 2. 핵심 선택 박스 */}
        <section className="max-w-6xl mx-auto px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group p-10 bg-gradient-to-br from-indigo-600/25 to-blue-600/20 border-2 border-indigo-500/40 rounded-[40px] hover:scale-[1.02] transition-all shadow-2xl cursor-pointer">
              <div className="space-y-5">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
                  <Key className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tight">나의 API 연결하기</h3>
                <p className="text-zinc-400 text-sm font-semibold leading-relaxed break-keep">
                  제미나이, 쳇 GPT, 클로드, Suno 등 <br />
                  개인 API 키를 활용한 고성능 맞춤형 제작 모드
                </p>
                <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-xs tracking-widest">
                  API 연결 가이드 보기 <ArrowRight size={18} />
                </div>
              </div>
            </div>

            <div className="group p-10 bg-gradient-to-br from-emerald-600/20 to-teal-600/15 border-2 border-emerald-500/30 rounded-[40px] hover:scale-[1.02] transition-all shadow-2xl cursor-pointer">
              <div className="space-y-5">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <PlayCircle className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tight">체험 API로 맛보기</h3>
                <p className="text-zinc-400 text-sm font-semibold leading-relaxed break-keep">
                  설정 없이 즉시 시작하는 <br />
                  크리에이박스 기본 체험 모드
                </p>
                <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-xs tracking-widest">
                  스튜디오 즉시 시작 <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* 공지사항 섹션 (Notice) */}
          <div className="mt-10 p-8 bg-gradient-to-r from-blue-600/20 via-blue-600/10 to-blue-600/20 border-2 border-blue-500/30 rounded-[24px] text-center shadow-lg">
             <p className="text-xl md:text-2xl font-black text-white tracking-tight">
               <span className="text-blue-400 mr-3 underline decoration-blue-500 underline-offset-8 uppercase italic">Notice:</span> 
               베타 서비스 기간 동안 모든 스튜디오 기능을 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 underline decoration-orange-500">무제한 무료</span>로 이용하실 수 있습니다.
             </p>
          </div>
        </section>

        {/* 3. 스튜디오 라인업 */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-12 text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 flex items-center justify-center gap-4">
               <Construction className="text-blue-500" size={24} />
               CreAibox AI Studio Line-up 
               <span className="text-blue-500 animate-pulse text-sm ml-2 font-black">(실시간 개발 중!)</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {studioItems.map((item, idx) => (
                <div key={idx} className={`group flex flex-col items-center p-6 bg-zinc-900/60 border-2 border-zinc-800 rounded-[28px] transition-all cursor-pointer ${item.border} hover:-translate-y-2`}>
                  <div className={`w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center ${item.color} mb-4 transition-all duration-300 ${item.bg} group-hover:text-white group-hover:shadow-lg`}>
                    {item.icon}
                  </div>
                  <h4 className="text-[12px] font-black uppercase tracking-tight text-zinc-300 group-hover:text-white">{item.title}</h4>
                </div>
              ))}
            </div>
            
            {/* --- 슬로건 박스 강화 (사장님 요청 사항) --- */}
            <div className="mt-20 p-10 bg-gradient-to-b from-zinc-900/50 to-black border-2 border-zinc-800/80 rounded-[32px] shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={150} />
                </div>
                
                <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-snug">
                    All Your <span className="text-blue-500">Creative AI Tools</span> in One Workspace, <br />
                    The Creator’s <span className="text-emerald-400">Ai Toolbox</span>
                </h2>
                
                <div className="mt-6 flex justify-center items-center gap-4">
                    <div className="h-[1px] w-12 bg-zinc-800" />
                    <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">CreAibox Philosophy</p>
                    <div className="h-[1px] w-12 bg-zinc-800" />
                </div>
            </div>
          </div>
        </section>

      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}