"use client";

import React, { useState } from 'react';
import { 
  Search, TrendingUp, BarChart3, Hash, ListFilter, 
  Zap, PieChart, LineChart, Globe, ArrowUpRight, 
  ChevronRight, RefreshCw, Layers, Database
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function KeywordStudioPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return alert("분석할 키워드를 입력해주세요!");
    alert(`'${keyword}' 키워드 정밀 분석을 시작합니다.`);
  };

  const keywordTools = [
    {
      id: 'bulk-search',
      title: '키워드 대량 조회',
      description: '수백 개의 키워드를 한 번에 검색하여 검색량, 경쟁 정도를 광속으로 파악.',
      icon: <Database className="text-blue-500" size={32} />,
      tag: 'Big Data'
    },
    {
      id: 'discovery',
      title: '연관 키워드 발굴',
      description: '메인 키워드 하나로 꼬리에 꼬리를 무는 황금 키워드 리스트 자동 추출.',
      icon: <Layers className="text-emerald-500" size={32} />,
      tag: 'Mining'
    },
    {
      id: 'morphology',
      title: '형태소 분석기',
      description: '상위 노출된 문서를 분석하여 핵심 형태소와 빈도수를 정밀하게 추출.',
      icon: <PieChart className="text-purple-500" size={32} />,
      tag: 'NLP'
    },
    {
      id: 'rank-tracker',
      title: '실시간 순위 추적',
      description: '내 포스팅이 타겟 키워드에서 몇 위에 위치하는지 24시간 자동 모니터링.',
      icon: <LineChart className="text-amber-500" size={32} />,
      tag: 'Tracking'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
              <Hash className="text-blue-500" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 italic">Semantic Intelligence</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
            Keyword <span className="text-blue-500">Analytics</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            승리하는 콘텐츠의 시작은 키워드입니다. 로워드(Roword)를 뛰어넘는 
            Creaibox만의 정밀 엔진으로 검색의 의도를 파악하고 시장을 선점하세요.
          </p>
        </header>

        {/* 🌟 1. 메인 검색 섹션 (Roword 스타일) */}
        <section className="mb-24 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-[40px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-[40px] p-8 lg:p-16 shadow-2xl overflow-hidden text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-black italic uppercase text-white">Keyword Discovery Engine</h2>
                <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">검색량, 발행량, 경쟁지수를 즉시 확인하세요</p>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input 
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="분석할 키워드를 입력하세요"
                      className="w-full bg-black/60 border border-zinc-800 rounded-2xl py-6 pl-16 pr-6 text-lg font-bold text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <button className="px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black italic rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 uppercase tracking-tighter">
                    Analyze <ArrowUpRight size={20} />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap justify-center gap-4 text-[11px] font-black text-zinc-600">
                <span>인기 급상승:</span>
                {["AI 마케팅", "유튜브 자동화", "워드프레스 수익", "부업 추천"].map((tag) => (
                  <button key={tag} className="text-zinc-400 hover:text-blue-500 transition-colors uppercase italic tracking-tighter">#{tag}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 2. 분석 도구 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {keywordTools.map((tool) => (
            <div 
              key={tool.id}
              className="group bg-zinc-900/20 border border-zinc-800 rounded-[32px] p-8 transition-all duration-500 hover:bg-zinc-900/40 hover:-translate-y-2 cursor-pointer flex flex-col justify-between border-dashed"
            >
              <div className="space-y-6">
                <div className="p-4 bg-black/40 w-fit rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <div className="space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-800/50 px-2 py-0.5 rounded-full italic">{tool.tag}</span>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-blue-500 transition-colors">{tool.title}</h3>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed">{tool.description}</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight size={20} className="text-zinc-800 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* 🌟 3. 하단 실시간 급상승 키워드 리스트 */}
        <section className="bg-zinc-900/10 border border-zinc-900 rounded-[40px] p-8 lg:p-12 mb-32">
          <div className="flex justify-between items-center mb-10 border-b border-zinc-800/50 pb-6">
            <h2 className="text-2xl font-black italic uppercase text-white flex items-center gap-3">
              <TrendingUp className="text-emerald-500" size={24} /> Rising Search Trend
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase italic">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Updating
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-zinc-900/40 transition-all cursor-pointer border border-transparent hover:border-zinc-800 group">
                <span className="text-xl font-black italic text-zinc-800 group-hover:text-blue-500 transition-colors w-8">0{i}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-zinc-300">핵심 연관 키워드 데이터 {i}</h4>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Search: 24,500</span>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">Competition: Low</span>
                  </div>
                </div>
                <button className="p-2 bg-zinc-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-blue-500" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 🌟 4. 피날레 문구 */}
        <div className="py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
              Indexing <span className="text-blue-950/20">The World</span>
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
          <p className="text-blue-500/40 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse italic">
            현재 실시간 포털 키워드 데이터 동기화 중입니다. 곧 오픈 예정입니다.
          </p>
        </div>

        <footer className="mt-12 text-center">
            <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
                Creaibox Keyword Intelligence v1.0
            </div>
        </footer>
      </div>
    </div>
  );
}