"use client";

import React from 'react';
import { 
  Handshake, Building2, LayoutTemplate, Send, 
  BellRing, AlertTriangle, ArrowRight, MessageCircle 
} from 'lucide-react';

interface AsideProps {
  isDarkMode: boolean;
}

export default function Aside({ isDarkMode }: AsideProps) {
  const asideBg = isDarkMode ? "bg-[#0d1117] border-zinc-800/50" : "bg-white border-zinc-200";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const subTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-400";

  return (
    <aside className={`w-72 border-l flex flex-col transition-all duration-300 shrink-0 hidden xl:flex ${asideBg}`}>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* 1. 비즈니스 제안 섹션 (상단 강조) */}
        <section className="space-y-4">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
            Business Hub
          </p>
          
          <div className="space-y-3">
            {/* 협업/광고 제안 */}
            <button className="w-full group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3">
                <Handshake size={20} />
                <span className="text-sm font-bold">협업 / 광고 제안</span>
              </div>
              <ArrowRight size={16} className="opacity-50 group-hover:opacity-100" />
            </button>

            {/* 기업형 맞춤 제작 */}
            <button className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all hover:border-blue-500/50 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-blue-500" />
                <span className={`text-sm font-bold ${textColor}`}>기업형 맞춤 제작</span>
              </div>
              <ArrowRight size={16} className={subTextColor} />
            </button>

            {/* 홈페이지 제작 */}
            <button className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all hover:border-blue-500/50 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="flex items-center gap-3">
                <LayoutTemplate size={20} className="text-emerald-500" />
                <span className={`text-sm font-bold ${textColor}`}>홈페이지 제작</span>
              </div>
              <ArrowRight size={16} className={subTextColor} />
            </button>
          </div>
        </section>

        {/* 2. 서포트 & 채팅 섹션 */}
        <section className="space-y-4 pt-4">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${subTextColor}`}>
            Real-time Support
          </p>
          <div className={`p-4 rounded-2xl border border-dashed ${isDarkMode ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-zinc-50/50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={16} className="text-blue-500" />
              <span className={`text-xs font-bold ${textColor}`}>AI 실시간 채팅</span>
            </div>
            <p className={`text-[11px] leading-relaxed mb-3 ${subTextColor}`}>
              작업 중 궁금한 점이 있으신가요? AI 서포터에게 물어보세요.
            </p>
            <button className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-bold rounded-lg transition-all">
              채팅 시작하기
            </button>
          </div>
        </section>

        {/* 3. 뉴스레터 & 신고 (하단) */}
        <section className="space-y-5 pt-4">
          {/* 뉴스레터 신청 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <BellRing size={16} className="text-yellow-500" />
              <span className={`text-xs font-bold ${textColor}`}>AI 트렌드 뉴스레터</span>
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="email@example.com"
                className={`w-full px-4 py-3 rounded-xl text-xs outline-none border transition-all ${
                  isDarkMode 
                  ? 'bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white' 
                  : 'bg-white border-zinc-200 focus:border-blue-500 text-black'
                }`}
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all">
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* 신고하기 */}
          <button className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 group`}>
            <AlertTriangle size={16} className="text-red-500 opacity-70 group-hover:opacity-100" />
            <span className={`text-xs font-medium transition-colors group-hover:text-red-500 ${subTextColor}`}>부적절한 콘텐츠 신고하기</span>
          </button>
        </section>
      </div>
                  {/* 푸터 정보 (Aside 내부에 작게) */}
      <div className={`p-6 border-t ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-200'}`}>
        <p className={`text-[10px] text-center ${subTextColor}`}>
          © CreAIbox - AI Contents Studio <br />
          v1.0.4 - Premium Support
        </p>
      </div>
    </aside>
  );
}

