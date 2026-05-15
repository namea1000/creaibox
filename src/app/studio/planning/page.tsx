"use client";

import React, { useState } from 'react';
import { 
  Lightbulb, Search, MessageSquare, Target, Compass, 
  BarChart3, ArrowRight, Sparkles, Send, Zap, BrainCircuit
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlanningStudioPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleConsulting = () => {
    if (!query) return alert("어떤 콘텐츠를 고민 중이신지 알려주세요!");
    alert(`'${query}'에 대한 AI 에이전트 컨설팅을 시작합니다.`);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 1. 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-600/10 rounded-lg border border-amber-500/20">
              <BrainCircuit className="text-amber-500" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 italic">Strategic Core</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
            Planning <span className="text-amber-500">Studio</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            모든 위대한 콘텐츠는 정교한 기획에서 시작됩니다. 
            AI 전문 에이전트가 당신의 아이디어를 수익화 시나리오로 변환해 드립니다.
          </p>
        </header>

        {/* 2. AI 에이전트 컨설팅 입력창 (핵심) */}
        <section className="mb-24 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-[40px] blur-xl opacity-50 group-hover:opacity-100 transition-all" />
          <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-[40px] p-8 lg:p-12 shadow-2xl">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} />
                <h2 className="text-xl font-black italic uppercase text-white">AI Strategy Agent</h2>
              </div>
              
              <div className="relative">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='예: "유튜브로 돈을 벌고 싶어", "IT 블로그 주제 추천해줘", "인스타그램 마케팅 방향 잡아줘"'
                  className="w-full bg-black/60 border border-zinc-800 rounded-[32px] p-8 pt-10 text-lg lg:text-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all resize-none h-48 custom-scrollbar font-bold"
                />
                <button 
                  onClick={handleConsulting}
                  className="absolute bottom-6 right-6 flex items-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-black italic rounded-2xl transition-all shadow-xl active:scale-95 group"
                >
                  START CONSULTING
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {["수익화 방향", "주제 선정", "마케팅 전략", "채널 가이드"].map((tag) => (
                  <span key={tag} className="text-[10px] font-black text-zinc-500 border border-zinc-800 px-4 py-1.5 rounded-full uppercase tracking-widest">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. 기획 세부 단계 박스 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { 
              icon: <Compass className="text-blue-500" />, 
              title: "Trend Analysis", 
              desc: "현재 시장에서 가장 반응이 좋은 키워드와 트렌드 분석" 
            },
            { 
              icon: <MessageSquare className="text-emerald-500" />, 
              title: "Niche Scouting", 
              desc: "경쟁은 적고 수요는 확실한 나만의 블루오션 주제 탐색" 
            },
            { 
              icon: <Target className="text-purple-500" />, 
              title: "Marketing Roadmap", 
              desc: "타겟 설정부터 확산 전략까지 포함된 마케팅 지도 설계" 
            },
            { 
              icon: <BarChart3 className="text-pink-500" />, 
              title: "Monetization", 
              desc: "콘텐츠를 실제 수익으로 연결하는 구체적인 비즈니스 모델링" 
            },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-zinc-900/20 border border-zinc-800 rounded-[32px] space-y-4 hover:bg-zinc-900/40 transition-all border-dashed group">
              <div className="p-3 bg-black/40 w-fit rounded-xl border border-zinc-800 group-hover:border-amber-500/50 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg font-black uppercase italic text-white">{item.title}</h3>
              <p className="text-zinc-600 text-xs font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 4. 피날레 문구 */}
        <div className="py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
              AGENT <span className="text-amber-900/20">UNDER CONSTRUCTION</span>
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
          <p className="text-amber-500/40 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse">
            현재 AI 에이전트 정밀 튜닝 중입니다. 곧 오픈 예정입니다.
          </p>
        </div>

        <footer className="mt-12 text-center">
            <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
                Creaibox Strategic Studio — Consulting Engine v1.0
            </div>
        </footer>
      </div>
    </div>
  );
}