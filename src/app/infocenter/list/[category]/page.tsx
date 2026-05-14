"use client";

import React from 'react';
import { useParams } from 'next/navigation'; 
import InfoListTab from "@/components/infocenter/tabs/InfoListTab";

/**
 * 🌟 [수정 보고]
 * 1. 기존 InfoCenterLayout 감싸기 제거: 상위 layout.tsx에서 자동으로 렌더링됩니다.
 * 2. 다크모드 고정: 전등 스위치를 떼버렸으므로 항상 true 상태로 동작합니다.
 * 3. 구조적 보전: InfoListTab에 카테고리를 전달하는 핵심 로직은 100% 유지했습니다.
 */
export default function CategoryListPage() {
  const params = useParams();
  const category = params.category as string; // 'notice', 'free', 'all' 등
  const isDarkMode = true; // 무조건 다크모드 고정

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* 이미 상위 layout.tsx에서 max-w-6xl과 padding을 잡아주고 있으므로, 
          여기서는 게시판 리스트 본체인 InfoListTab만 깔끔하게 호출합니다.
      */}
      <InfoListTab 
        activeTab={category} 
      />
    </div>
  );
}