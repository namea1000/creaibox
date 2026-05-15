"use client";

import React, { useState } from 'react';
import { 
  Search, Play, TrendingUp, Users, BarChart3, 
  Video, Globe, ChevronRight, ArrowUpRight, 
  Filter, Sparkles, Database
} from 'lucide-react'; // 🌟 Youtube를 Play로 교체했습니다.
import { useRouter } from 'next/navigation';

export default function YoutubeAnalyticsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return alert("채널명 또는 영상 URL을 입력해주세요!");
    alert(`'${searchQuery}' 데이터 분석을 시작합니다.`);
  };

  const stats = [
    { label: "Analyzed Channels", value: "1.2M+", icon: <Users size={16} /> },
    { label: "Daily Video Track", value: "450K+", icon: <Video size={16} /> },
    { label: "Trend Accuracy", value: "98.2%", icon: <TrendingUp size={16} /> },
  ];

  const analysisTools = [
    {
      id: 'channel-search',
      title: '채널 상세 분석',
      description: '구독자 추이, 예상 수익, 시청자 성별/연령대 등 채널의 모든 지표 분석.',
      icon: <Users className="text-red-500" size={32} />,
      tag: 'Insight'
    },
    {
      id: 'video-trend',
      title: '급상승 영상 트렌드',
      description: '지금 이 시간 가장 빠르게 조회수가 오르는 영상과 키워드 실시간 추적.',
      icon: <TrendingUp className="text-emerald-500" size={32} />,
      tag: 'Real-time'
    },
    {
      id: 'competitor',
      title: '경쟁 채널 비교',
      description: '내 채널과 경쟁 채널의 성장 지표를 1:1로 정밀 비교 분석.',
      icon: <BarChart3 className="text-blue-500" size={32} />,
      tag: 'Strategy'
    },
    {
      id: 'ad-calculator',
      title: '광고 단가 계산기',
      description: '채널 영향력을 기반으로 한 적정 광고 단가 및 마케팅 효율 산출.',
      icon: <Database className="text-purple-500" size={32} />,
      tag: 'Marketing'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600/10 rounded-lg border border-red-500/20">
              <Play className="text-red-500" size={24} fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 italic">Data Intelligence</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
            YouTube <span className="text-red-600">Analytics</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            데이터로 읽는 알고리즘의 법칙. Vling 그 이상의 정밀한 분석을 통해 
            당신의 채널 성장을 위한 가장 과학적인 로드맵을 제시합니다.
          </p>
        </header>

        {/* 1. 메인 검색 스테이션 */}
        <section className="mb-24 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-zinc-900/0 rounded-[40px] blur-xl opacity-30" />
          <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-[40px] p-8 lg:p-12 shadow-2xl">
            <form onSubmit={handleSearch} className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="채널명 또는 영상 URL을 입력하여 데이터 추적 시작"
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl py-6 pl-16 pr-6 text-lg font-bold text-white focus:border-red-500 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
                <button className="px-12 py-6 bg-red-600 hover:bg-red-500 text-white font-black italic rounded-2xl transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 uppercase tracking-tighter">
                  Analyze Data <ArrowUpRight size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-8 pt-4 border-t border-zinc-800/50">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg text-red-500">{stat.icon}</div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-lg font-black text-zinc-200">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </section>

        {/* 2. 분석 도구 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {analysisTools.map((tool) => (
            <div 
              key={tool.id}
              className="group bg-zinc-900/20 border border-zinc-800 rounded-[32px] p-8 transition-all duration-500 hover:bg-zinc-900/40 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="p-4 bg-black/40 w-fit rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded">{tool.tag}</span>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-red-500 transition-colors">{tool.title}</h3>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed">{tool.description}</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight size={20} className="text-zinc-800 group-hover:text-red-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* 3. 하단 트렌드 랭킹 맛보기 */}
        <section className="bg-zinc-900/10 border border-zinc-900 rounded-[40px] p-8 lg:p-12 mb-32">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black italic uppercase text-white flex items-center gap-3">
              <TrendingUp className="text-red-500" size={24} /> Top Rising Creators
            </h2>
            <button className="text-[10px] font-black text-zinc-600 hover:text-red-500 transition-colors uppercase tracking-[0.2em]">View Full Ranking</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-zinc-900/40 transition-all cursor-pointer border border-transparent hover:border-zinc-800">
                <span className="text-2xl font-black italic text-zinc-800 w-8">0{i}</span>
                <div className="w-12 h-12 bg-zinc-800 rounded-full shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-zinc-700" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-zinc-200">데이터분석 크리에이터 {i}</h4>
                  <p className="text-[10px] font-bold text-zinc-600">IT / Technology</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-500">▲ 24.5%</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase">Weekly Growth</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 피날레 문구 */}
        <div className="py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-red-500" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
              Tracking <span className="text-red-950/20">Growth</span>
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-red-500" />
          </div>
          <p className="text-red-500/40 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse italic pl-2">
            현재 유튜브 데이터 엔진 동기화 중입니다. 곧 오픈 예정입니다.
          </p>
        </div>

        <footer className="mt-12 text-center">
            <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
                Creaibox Youtube Intelligence v1.0
            </div>
        </footer>
      </div>
    </div>
  );
}