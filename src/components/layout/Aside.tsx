"use client";

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { 
  Handshake, Building2, LayoutTemplate, Send, 
  BellRing, AlertTriangle, ArrowRight, MessageCircle 
} from 'lucide-react';

// 🌟 [빨간 줄 파괴 광선] window 객체에 Kakao가 존재함을 타입스크립트에게 강제로 인지시킵니다.
declare global {
  interface Window {
    Kakao?: any;
    kakaoAsyncInit?: () => void;
  }
}

export default function Aside() {
  const asideBg = "bg-[#0d1117] border-zinc-800/50";
  const textColor = "text-zinc-100";
  const subTextColor = "text-zinc-500";

  return (
    <aside className={`w-72 border-l flex flex-col transition-all duration-300 shrink-0 hidden xl:flex ${asideBg}`}>
      
      {/* 📡 카카오톡 채널 SDK 안전 비동기 로딩 파이프라인 */}
      <Script
        id="kakao-js-sdk"
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.channel.min.js"
        integrity="sha384-8oNFBbAHWVovcMLgR+mLbxqwoucixezSAzniBcjnEoumhfIbMIg4DrVsoiPEtlnt"
        crossOrigin="anonymous"
        onLoad={() => {
          if (window.Kakao) {
            window.Kakao.Channel.createAddChannelButton({
              container: '#kakao-talk-channel-add-button',
            });
          }
        }}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* 1. 비즈니스 제안 섹션 */}
        <section className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-blue-500">
            Business Hub
          </p>
          
          <div className="space-y-3">
            <Link href="/business/ads" className="w-full group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3">
                <Handshake size={20} />
                <span className="text-sm font-bold">협업 / 광고 제안</span>
              </div>
              <ArrowRight size={16} className="opacity-50 group-hover:opacity-100" />
            </Link>

            <Link href="/business/enterprise" className="w-full group flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-blue-500/50">
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-blue-500" />
                <span className={`text-sm font-bold ${textColor}`}>기업형 맞춤 제작</span>
              </div>
              <ArrowRight size={16} className={subTextColor} />
            </Link>

            <Link href="/business/web-dev" className="w-full group flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-blue-500/50">
              <div className="flex items-center gap-3">
                <LayoutTemplate size={20} className="text-emerald-500" />
                <span className={`text-sm font-bold ${textColor}`}>홈페이지 제작</span>
              </div>
              <ArrowRight size={16} className={subTextColor} />
            </Link>
          </div>
        </section>

        {/* 2. 서포트 & 채팅 섹션 */}
        <section className="space-y-4 pt-4">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${subTextColor}`}>
            Real-time Support
          </p>
          <div className="p-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={16} className="text-blue-500" />
              <span className={`text-xs font-bold ${textColor}`}>AI 실시간 채팅</span>
            </div>
            <p className={`text-[11px] leading-relaxed mb-3 ${subTextColor}`}>
              작업 중 궁금한 점이 있으신가요? AI 서포터에게 물어보세요.
            </p>
            <Link href="/support/chat" className="block w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-bold rounded-lg transition-all text-center">
              채팅 시작하기
            </Link>
          </div>
        </section>

        {/* 3. 뉴스레터 & 신고 (하단) */}
        <section className="space-y-5 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <BellRing size={16} className="text-yellow-500" />
              <span className={`text-xs font-black ${textColor}`}>AI 트렌드 뉴스레터</span>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl text-xs outline-none border border-zinc-800 bg-zinc-900 focus:border-blue-500 text-white transition-all"
              />
              <button type="submit" className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all">
                <Send size={14} />
              </button>
            </form>
          </div>

          <Link href="/report" className="w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 group">
            <AlertTriangle size={16} className="text-red-500 opacity-70 group-hover:opacity-100" />
            <span className={`text-xs font-medium transition-colors group-hover:text-red-500 ${subTextColor}`}>부적절한 콘텐츠 신고하기</span>
          </Link>
        </section>

{/* 🌟 [최종 완공] 렉 없고 크기 조절 자유로운 직격 링크 카카오 배너 */}
        <section className="pt-5 border-t border-zinc-800/40 flex flex-col items-center justify-center gap-3">
          <p className={`text-[14px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>
            CreAIbox 카카오톡 채널
          </p>
          
          {/* 사장님 채널 링크 주소 장착 / 클릭 시 새 창으로 직격 이동 */}
          <a 
            href="http://pf.kakao.com/_RxdxmsX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full max-w-[90%] flex items-center justify-center gap-2.5 py-3 px-4 bg-[#FEE500] text-[#191919] text-sm font-black rounded-xl shadow-lg shadow-yellow-500/5 hover:scale-[1.03] active:scale-[0.98] transition-all text-center"
          >
            {/* 카카오 심볼 역할을 해줄 말풍선 아이콘 (lucide-react 기본 장착 활용) */}
            <MessageCircle size={16} className="fill-[#191919] text-[#191919]" />
            <span>CreAIbox 채널 추가하기</span>
          </a>
        </section>

      </div>

      {/* 푸터 정보 */}
      <div className="p-6 border-t border-zinc-800/50">
        <p className={`text-[10px] text-center ${subTextColor} font-bold`}>
          © CreAIbox - AI Contents Studio <br />
          <span className="opacity-50">v1.0.4 - Premium Support</span>
        </p>
      </div>
    </aside>
  );
}