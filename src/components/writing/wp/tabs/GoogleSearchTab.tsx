import React, { useEffect } from 'react';

export default function GoogleSearchTab() {
useEffect(() => {
  // 1. 스크립트 로드 부분 (기존과 동일)
  const script = document.createElement('script');
  script.id = 'google-cse-script';
  script.src = "https://cse.google.com/cse.js?cx=a513827edada84097";
  script.async = true;
  document.body.appendChild(script);

  // 🌟 핵심: 탭을 나갈 때(cleanup) 주소창에서 구글 흔적(#gsc...)을 지웁니다.
  return () => {
    const scriptToRemove = document.getElementById('google-cse-script');
    if (scriptToRemove && scriptToRemove.parentNode === document.body) {
      document.body.removeChild(scriptToRemove);
    }

    // 주소창에서 #으로 시작하는 구글 파라미터 강제 제거
    if (window.location.hash.includes('gsc.')) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };
}, []);

  return (
    <div className="flex-1 h-full flex flex-col bg-[#05070a] p-8 overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">
          Search Engine
        </h2>
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
          새 페이지로 결과가 열리며, 홈페이지는 유지됩니다.
        </p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-4 min-h-[500px]">
        {/* 🌟 data-resultsurl 를 소문자로 수정했습니다! */}
        <div 
          className="gcse-search" 
          data-linktarget="_blank" 
          data-resultsurl="" 
          data-newwindow="true"
        ></div>
      </div>
    </div>
  );
}