"use client";

import React, { useState } from 'react';
import InfoCenterLayout from "@/components/layout/infocenter/InfoCenterLayout";
import InfoWritingTab from "@/components/infocenter/tabs/InfoWritingTab"; // 아까 만든 알맹이

export default function InfoWritePage() {
  // 테마 상태 (나중에 전역 Context로 연결 권장)
  const [isDarkMode] = useState(true);

  return (
    <InfoCenterLayout isDarkMode={isDarkMode}>
      <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* 페이지 헤더 섹션 */}
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Create <span className="text-blue-500">New Post</span>
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em]">
            나만 아는 꿀팁과 소중한 정보를 커뮤니티에 공유해 보세요.
          </p>
        </div>

        {/* 🌟 사장님이 만든 글쓰기 알맹이 안착! */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-1 shadow-2xl">
          <InfoWritingTab isDarkMode={isDarkMode} />
        </div>

      </div>
    </InfoCenterLayout>
  );
}