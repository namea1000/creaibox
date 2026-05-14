"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import InfoViewTab from "@/components/infocenter/tabs/InfoViewTab";

export default function InfoDetailViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // 주소창의 ID 가로채기

  return (
    <div className="max-w-5xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
      
      {/* 상단 네비게이션 바 */}
      <div className="flex items-center justify-between mb-8 px-2">
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

      {/* 🌟 방법 2: postId라는 이름표를 붙여서 알맹이에게 던져줍니다! */}
      <div className="min-h-[600px]">
        <InfoViewTab postId={id} />
      </div>

      <div className="h-32" />
    </div>
  );
}