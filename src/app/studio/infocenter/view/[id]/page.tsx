"use client";

import React, { Suspense } from 'react'; // 🌟 Suspense 추가
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import InfoViewTab from "@/components/infocenter/tabs/InfoViewTab";

export default function InfoDetailViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // 주소창의 ID 가로채기

  return (
    // 🌟 useSearchParams나 동적 파라미터를 사용하는 페이지는 Suspense로 감싸는 것이 빌드 시 안전합니다.
    <Suspense fallback={
      <div className="flex min-h-[600px] w-full items-center justify-center bg-[#0a0c10]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-black text-blue-500 tracking-widest text-[10px] uppercase italic animate-pulse">
            Creaibox Engine Loading...
          </span>
        </div>
      </div>
    }>
      <div className="max-w-5xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
        
        {/* 상단 네비게이션 바 */}
        <div className="flex items-center justify-between mb-8 px-2 text-left">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest italic text-zinc-400">Back to List</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            <span>Infocenter</span>
            <ChevronRight size={12} className="text-zinc-700" />
            <span className="text-blue-500">View Post</span>
          </div>
        </div>

        {/* 🌟 알맹이 컴포넌트 호출 */}
        <div className="min-h-[600px]">
          <InfoViewTab postId={id} />
        </div>

        <div className="h-32" />
      </div>
    </Suspense>
  );
}