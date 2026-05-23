"use client";

import React, { useState } from 'react';
import { Layout, User, Mail, MessageSquare, Send, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

export default function CreaiboxBlogHome() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* 헤더 섹션 */}
      <nav className="border-b border-zinc-800 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Sparkles size={18} className="text-white" /></div>
            <span className="font-black tracking-tight text-lg">CREAIBOX<span className="text-blue-500">.BLOG</span></span>
          </div>
          <button className="text-sm font-bold bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-all">대시보드</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        {/* 히어로 섹션 */}
        <section className="text-center space-y-6 pt-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">AI와 함께하는<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">지능적 창작 여정</span></h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            매일 새로운 아이디어를 논리적이고 매혹적인 글로 재탄생시킵니다. 
            Creaibox를 통해 최적화된 콘텐츠를 만나보세요.
          </p>
        </section>

        {/* 블로그 소개 및 최근 포스트 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-2xl font-black flex items-center gap-2"><BookOpen size={24} className="text-blue-500" /> 최신 에디션</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:border-blue-500/50 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">AI Writing #{i}</span>
                  <span className="text-zinc-600 text-xs">2026.05.23</span>
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">AI가 재창조한 완벽한 문장의 구조화 방법</h4>
                <p className="text-zinc-400 text-sm">데이터 중심의 논리 체계를 감성적인 필치로 바꾸는 법에 대한 심층 분석 리포트입니다.</p>
              </div>
            ))}
          </div>

          {/* 신청 폼 섹션 */}
          <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800 h-fit sticky top-24">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><MessageSquare size={20} className="text-indigo-400" /> 협업 및 서비스 문의</h3>
            <div className="space-y-4">
              <input placeholder="이름" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" />
              <input placeholder="이메일" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-blue-500 outline-none transition-all" />
              <textarea placeholder="메시지를 입력하세요" rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-blue-500 outline-none transition-all resize-none" />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                신청하기 <Send size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-zinc-900 py-12 mt-12 text-center text-zinc-600 text-sm">
        © 2026 Creaibox Blog - All rights reserved.
      </footer>
    </div>
  );
}