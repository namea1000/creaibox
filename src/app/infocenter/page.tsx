"use client";

import React, { useState } from 'react';
import InfoCenterLayout from "@/components/layout/infocenter/InfoCenterLayout";
import { Zap, TrendingUp, Bell } from 'lucide-react';
import Link from 'next/link';

export default function InfoCenterHome() {
  // 🌟 나중에 전역 상태(Context)와 연결하면 자동으로 동기화됩니다.
  const [isDarkMode] = useState(true);

  return (
    // 🌟 1. 이 Layout이 헤더, 사이드바, 푸터의 '뼈대'를 다 가지고 있습니다.
    <InfoCenterLayout isDarkMode={isDarkMode}>
      
      {/* 🌟 2. 여기서부터는 Layout 중앙에 들어갈 '대문 콘텐츠'입니다. */}
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
        
        {/* 히어로 섹션 (디자인 유지) */}
        <div className="relative overflow-hidden rounded-[40px] p-12 bg-gradient-to-br from-blue-600 to-indigo-950 text-white shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">
              CreAIbox <span className="text-blue-300">Hub</span>
            </h2>
            <p className="text-lg font-bold text-blue-100 opacity-80 uppercase tracking-widest">
              최신 AI 트렌드와 크리에이터들의 노하우가 모이는 곳
            </p>
          </div>
          <Zap className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10" />
        </div>

        {/* 게시판 요약 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NOTICE 섹션 */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2 italic text-white">
                <Bell className="text-yellow-400" size={20} /> NOTICE
              </h3>
              <Link href="/infocenter/list/notice" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
                View All +
              </Link>
            </div>
            <ul className="space-y-4">
              <li className="text-sm font-medium text-zinc-400 hover:text-blue-400 cursor-pointer truncate">● AI 콘텐츠 스튜디오 v1.0.4 업데이트 안내</li>
              <li className="text-sm font-medium text-zinc-400 hover:text-blue-400 cursor-pointer truncate">● 커뮤니티 이용 가이드 및 매너 수칙</li>
            </ul>
          </section>

          {/* HOT TREND 섹션 */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2 italic text-white">
                <TrendingUp className="text-emerald-400" size={20} /> HOT TREND
              </h3>
              <Link href="/infocenter/list/all" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
                View All +
              </Link>
            </div>
            <ul className="space-y-4">
              <li className="text-sm font-medium text-zinc-400 hover:text-blue-400 cursor-pointer truncate">● 워드프레스 자동 포스팅으로 수익화 하는 꿀팁</li>
              <li className="text-sm font-medium text-zinc-400 hover:text-blue-400 cursor-pointer truncate">● 이번 주 최고의 AI 생성 이미지 작품집</li>
            </ul>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center pt-4">
          <Link href="/infocenter/write" className="px-14 py-5 bg-white text-black font-black text-xs rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 uppercase tracking-[0.3em]">
            지금 나의 노하우 공유하기
          </Link>
        </div>

      </div>
    </InfoCenterLayout>
  );
}