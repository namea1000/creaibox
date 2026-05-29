"use client";

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation'; 
import InfoListTab from "@/components/infocenter/tabs/InfoListTab";

export default function CategoryListPage() {
  const params = useParams();
  const category = params.category as string; 
  const isDarkMode = true; 

  return (
    // 🌟 params를 사용하는 클라이언트 페이지는 Suspense로 감싸는 것이 Next.js 표준입니다.
    <Suspense fallback={
      <div className="flex min-h-[400px] w-full items-center justify-center bg-[#0a0c10]">
        <div className="text-blue-500 animate-pulse font-black italic uppercase tracking-widest text-xs">
          Loading List...
        </div>
      </div>
    }>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        <InfoListTab 
          activeTab={category} 
        />
      </div>
    </Suspense>
  );
}