"use client";

import React from 'react';
import { Newspaper, Flame, Bell, ArrowUpRight } from 'lucide-react';

export default function NewsHomePage() {
  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1200px]">
      
      {/* 뉴스 상단 헤더 */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
            <Bell size={12} className="animate-bounce" /> Live News Update
          </div>
          <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            News <span className="text-emerald-500">Center</span>
          </h2>
        </div>
        <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest italic">
          Total 1,420 articles curated today
        </div>
      </div>

      {/* 헤드라인 & 주요 뉴스 섹션 (네이버 스타일) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 메인 헤드라인 카드 */}
        <div className="lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-[32px] border border-zinc-800 aspect-video">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-zinc-900 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 p-8 z-20 space-y-3">
            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg">Headline</span>
            <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight">
              AI 기술의 진화, 이제 뉴스를 넘어 <br/>실시간 데이터 분석 포털로의 도약
            </h3>
            <p className="text-zinc-400 text-sm font-medium line-clamp-1 italic">
              크레아이박스가 선보이는 새로운 뉴스 인터페이스, 사용자 맞춤형 큐레이션 엔진 탑재...
            </p>
          </div>
        </div>

        {/* 속보/급상승 리스트 */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
            <Flame size={18} className="text-orange-500" />
            <h3 className="text-lg font-black italic uppercase text-white tracking-tighter">Breaking News</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer border-b border-zinc-800/50 pb-4 last:border-0">
                <span className="text-emerald-500 font-black italic text-lg">{i}</span>
                <p className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors truncate">
                  {i === 1 ? "연준, 금리 동결 발표... 시장의 반응은?" : "신규 AI 모델 공개, 성능 측정 결과 놀라워"}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest italic">
            View All Trends
          </button>
        </div>
      </div>

      {/* 섹션 하단: 개발 진행 중 안내 */}
      <div className="py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
          News <span className="text-emerald-950/20">Aggregator</span>
        </h2>
        <p className="text-emerald-500/30 text-xs lg:text-sm font-black uppercase tracking-[0.5em] animate-pulse italic">
          현재 네이버 뉴스 API 및 크롤링 엔진 최적화 진행 중입니다. 곧 오픈 예정입니다.
        </p>
      </div>

    </div>
  );
}