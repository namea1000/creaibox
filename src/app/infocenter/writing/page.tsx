"use client";

import React from 'react';
import InfoWritingTab from "@/components/infocenter/tabs/InfoWritingTab";

/**
 * 🌟 [수정 보고]
 * 1. 중복 레이아웃 제거: 상위 /app/infocenter/layout.tsx가 헤더/탭/사이드바를 책임집니다.
 * 2. 빨간 줄 삭제: 컴포넌트 호출 시 isDarkMode={...} 줄을 모두 제거했습니다.
 * 3. 디자인 유지: 사장님이 만드신 헤더 텍스트와 웅장한 라운드 박스 디자인은 그대로 보전했습니다.
 */
export default function InfoWritingPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 페이지 헤더 섹션 (사장님 원본 디자인) */}
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Create <span className="text-blue-500">New Post</span>
        </h1>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em]">
          나만 아는 꿀팁과 소중한 정보를 커뮤니티에 공유해 보세요.
        </p>
      </div>

      {/* 🌟 글쓰기 알맹이 안착 (isDarkMode={isDarkMode} 삭제 완료) */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-1 shadow-2xl">
        <InfoWritingTab />
      </div>

    </div>
  );
}