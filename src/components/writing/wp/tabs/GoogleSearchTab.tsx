"use client";

import React, { useEffect } from 'react';

// 🌟 [전등 스위치 철거] 이제 Props 없이도 독립적으로 다크모드로 작동합니다.
export default function GoogleSearchTab() {
  useEffect(() => {
    // 1. 구글 검색 스크립트 로드 (원본 보전)
    const script = document.createElement('script');
    script.id = 'google-cse-script';
    script.src = "https://cse.google.com/cse.js?cx=a513827edada84097";
    script.async = true;
    document.body.appendChild(script);

    // 🌟 [배포 에러 방지/클린업] 탭을 나갈 때 주소창의 구글 파라미터(#gsc...)를 강제 제거합니다.
    return () => {
      const scriptToRemove = document.getElementById('google-cse-script');
      if (scriptToRemove && scriptToRemove.parentNode === document.body) {
        document.body.removeChild(scriptToRemove);
      }

      if (window.location.hash.includes('gsc.')) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
  }, []);

  return (
    // 🌟 배경색(#05070a)과 패딩을 보전하며 다크모드 고정
    <div className="flex-1 h-full flex flex-col bg-[#05070a] p-8 overflow-y-auto custom-scrollbar font-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">
          Google <span className="text-blue-500">Search</span> Engine
        </h2>
        <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest italic">
          검색 결과는 새 창으로 열리며, 현재 작업실 환경은 그대로 유지됩니다.
        </p>
      </div>

      {/* 🌟 구글 검색창이 들어갈 영역 (다크 디자인 박스 보전) */}
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[32px] p-6 min-h-[500px] shadow-2xl backdrop-blur-xl">
        <div 
          className="gcse-search" 
          data-linktarget="_blank" 
          data-resultsurl="" 
          data-newwindow="true"
        ></div>
      </div>

      <footer className="mt-8 text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em] text-center italic">
        Global Data Intelligence Unit — CreAIbox Studio
      </footer>
    </div>
  );
}