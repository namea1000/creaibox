"use client";

import React from 'react';
import { 
  BookOpen, Sparkles, CheckCircle2, ChevronRight, 
  ArrowUpRight, Users, Zap, Layout, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlogStudioPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 1. 히어로 섹션: 블로그 서비스 소개 */}
        <section className="relative mb-24 overflow-hidden rounded-[48px] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 lg:p-16">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-blue-500 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                Premium Blog Service
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
              Creaibox <span className="text-blue-500">Notes</span>
            </h1>
            <p className="text-zinc-400 text-lg lg:text-xl font-medium leading-relaxed italic pl-1">
              단순한 기록을 넘어 당신의 생각이 브랜드가 되는 공간. <br/>
              지능형 에디터와 고유 도메인으로 나만의 미디어를 구축하세요.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2 uppercase italic tracking-tighter active:scale-95">
                나만의 브랜드 블로그 신청하기 <ArrowUpRight size={20} />
              </button>
              <button className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black rounded-2xl border border-zinc-700 transition-all uppercase italic tracking-tighter">
                서비스 상세 보기
              </button>
            </div>
          </div>
        </section>

        {/* 2. 블로그 브랜드 핵심 가치 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: <Zap className="text-blue-500" />, title: "AI-Powered", desc: "생각의 흐름을 분석하여 목차와 내용을 제안하는 지능형 글쓰기" },
            { icon: <Layout className="text-emerald-500" />, title: "Unique Domain", desc: "사장님성함.creaibox.com 고유 주소로 완성되는 퍼스널 브랜딩" },
            { icon: <Users className="text-purple-500" />, title: "Network", desc: "검색 최적화는 물론 Creaibox 유저들과의 강력한 콘텐츠 연동" },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[32px] space-y-4">
              <div className="p-3 bg-black/40 w-fit rounded-xl border border-zinc-800">{item.icon}</div>
              <h3 className="text-xl font-black uppercase italic text-white">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. 최근 블로그 포스트 (매거진 스타일) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
          {/* 공식 블로그 섹션 */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Creaibox <span className="text-blue-500">Official</span></h2>
              <button className="text-[10px] font-black text-zinc-600 uppercase hover:text-blue-500 transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              {[1, 2].map((_, i) => (
                <div key={i} className="group flex gap-6 p-4 rounded-[32px] hover:bg-zinc-900/30 transition-all cursor-pointer border border-transparent hover:border-zinc-800">
                  <div className="w-48 h-32 bg-zinc-800 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-zinc-700 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="space-y-2 py-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Update</span>
                    <h4 className="text-xl font-black text-zinc-200 group-hover:text-white transition-colors">새로운 AI 시나리오 라이브러리 업데이트 안내</h4>
                    <p className="text-zinc-500 text-xs line-clamp-2">Creaibox Notes가 더 강력해졌습니다. 이번 업데이트에서는 글쓰기 스타일 분석 기능이 추가되어...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우수 사용자 섹션 */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Best <span className="text-purple-500">Creators</span></h2>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[40px] p-8 space-y-6">
              {[
                { name: "Digital Nomad", title: "수익형 워드프레스 자동화 전략 2024" },
                { name: "AI Visionary", title: "LLM 모델별 프롬프트 엔지니어링 비교 분석" },
                { name: "Content King", title: "1인 미디어가 살아남는 법에 대하여" },
              ].map((post, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer border-b border-zinc-800/50 pb-4 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[1px]">
                    <div className="w-full h-full bg-[#05070a] rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">
                      {post.name[0]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">{post.name}</p>
                    <h5 className="text-sm font-bold text-zinc-300 group-hover:text-blue-400 transition-colors truncate">{post.title}</h5>
                  </div>
                  <Star size={14} className="text-zinc-800 group-hover:text-amber-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🌟 개발 진행중 문구 (가장 하단 크게 강조) */}
        <div className="py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-blue-500" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-800 flex items-center gap-4">
              Coming <span className="text-blue-900/30">Soon</span>
            </h2>
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
          <p className="text-blue-500/40 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse">
            현재 개발 진행 중입니다. 곧 오픈 예정입니다.
          </p>
        </div>

        {/* 푸터 */}
        <footer className="mt-12 text-center">
          <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
            Creaibox Blog Studio Identity System
          </div>
        </footer>
      </div>
    </div>
  );
}