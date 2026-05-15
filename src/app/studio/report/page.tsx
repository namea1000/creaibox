"use client";

import React, { useState } from 'react';
import { 
  FileText, TrendingUp, DollarSign, BrainCircuit, Mail, 
  ChevronRight, ArrowRight, BookOpen, Newspaper, Star, Sparkles, Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReportHubPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("이메일 주소를 입력해주세요!");
    alert(`${email} 주소로 뉴스레터 구독이 신청되었습니다. 감사합니다!`);
    setEmail("");
  };

  const categories = [
    { id: 'stock', title: '주식 리포트', icon: <TrendingUp className="text-blue-500" />, count: '12 Posts' },
    { id: 'finance', title: '금융 & 경제', icon: <DollarSign className="text-emerald-500" />, count: '08 Posts' },
    { id: 'ai-trend', title: 'AI 트렌드 리포트', icon: <BrainCircuit className="text-purple-500" />, count: '24 Posts' },
    { id: 'industry', title: '산업 분석', icon: <FileText className="text-orange-500" />, count: '05 Posts' },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 상단 헤더 섹션 */}
        <header className="mb-20 space-y-4 text-left border-b border-zinc-800 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
              <Newspaper className="text-blue-500" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 italic">Intelligence Archive</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
            Report <span className="text-blue-500">Hub</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            데이터 속에서 진실을 발견하는 통찰력. AI가 분석하고 전문가가 큐레이션한 
            고품격 지식 리포트로 내일의 비즈니스를 준비하세요.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 🌟 좌측: 메인 리포트 피드 (전문 지식 매거진) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-black italic uppercase text-white tracking-tight flex items-center gap-3">
                <BookOpen size={20} className="text-blue-500" /> Latest Insights
              </h2>
            </div>
            
            <div className="space-y-10">
              {[1, 2, 3].map((_, i) => (
                <article key={i} className="group cursor-pointer">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-64 aspect-[4/3] bg-zinc-900 rounded-[24px] overflow-hidden border border-zinc-800 shadow-2xl shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="space-y-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">AI Trend</span>
                        <span className="text-[10px] font-bold text-zinc-600">2026.05.15</span>
                      </div>
                      <h3 className="text-2xl font-black text-zinc-200 group-hover:text-blue-400 transition-colors leading-snug">
                        생성형 AI 모델의 멀티모달 진화: 비즈니스 현장의 실제 도입 사례 분석
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 italic">
                        이번 리포트에서는 단순히 텍스트를 넘어 이미지와 영상, 그리고 음성까지 통합적으로 처리하는 최신 AI 모델들이 주식 및 금융 시장에 미치는 영향을 심도 있게 다룹니다.
                      </p>
                      <button className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white transition-all">
                        Read Report <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* 🌟 우측: 카테고리 & 뉴스레터 사이드바 */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* 뉴스레터 구독 박스 */}
            <section className="bg-gradient-to-br from-blue-900/20 to-zinc-900/40 border border-blue-500/20 rounded-[40px] p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Mail size={80} className="text-blue-500 rotate-12" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-blue-500" size={18} />
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tight">Newsletter</h3>
                </div>
                <p className="text-zinc-400 text-xs font-bold leading-relaxed">
                  매주 월요일 아침, 관리자가 엄선한 전문 분석 리포트를 이메일로 받아보세요.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address" 
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-5 py-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all shadow-inner"
                  />
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all shadow-xl shadow-blue-900/20 uppercase italic tracking-widest flex items-center justify-center gap-2">
                    Subscribe Now <Send size={14} />
                  </button>
                </form>
              </div>
            </section>

            {/* 전문 분야 카테고리 */}
            <section className="space-y-6">
              <h3 className="text-sm font-black italic uppercase text-zinc-500 tracking-[0.2em] px-2">Expert Categories</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="group flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl hover:bg-zinc-900/40 hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-black/40 rounded-lg group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </div>
                      <span className="text-sm font-black text-zinc-300 group-hover:text-white transition-colors">{cat.title}</span>
                    </div>
                    <span className="text-[10px] font-black text-zinc-700 italic group-hover:text-blue-500 transition-colors">{cat.count}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* 🌟 하단 개발 진행중 문구 */}
        <div className="mt-32 py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
              Curating <span className="text-blue-900/20">Knowledge</span>
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
          <p className="text-blue-500/40 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse italic">
            현재 전문 분석 리포트 집필 및 뉴스레터 시스템 구축 중입니다.
          </p>
        </div>

        <footer className="mt-12 text-center">
            <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
                Creaibox Intelligence Network v1.0
            </div>
        </footer>
      </div>
    </div>
  );
}