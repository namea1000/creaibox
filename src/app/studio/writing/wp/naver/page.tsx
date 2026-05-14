"use client";

import React from 'react';
import NaverSearchTab from "@/components/writing/wp/tabs/NaverSearchTab";

export default function WpNaverSearchPage() {
  return (
    // activeMenu="Writing"으로 설정하여 좌측 사이드바와 상단 탭이 유지되게 합니다.
      <div className="h-[calc(100vh-160px)]"> 
        <NaverSearchTab />
      </div>
  );
}