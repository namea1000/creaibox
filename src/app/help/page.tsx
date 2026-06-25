"use client";

import React, { useState } from 'react';
import { 
  Search, MessageSquare, Mail, FileText, 
  ChevronDown, HelpCircle, ArrowRight, Sparkles 
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // 🌟 사용자들이 가장 많이 묻는 FAQ 데이터 리스트
  const faqList = [
    {
      question: "크리에이아이박스는 어떤 서비스인가요?",
      answer: "크리에이아이박스(CreAibox)는 글쓰기, 이미지, 비디오, 뮤직 생성 및 트렌드 분석까지 하나의 스튜디오 안에서 모두 해결할 수 있는 올인원 인공지능 콘텐츠 생성 플랫폼입니다."
    },
    {
      question: "생성된 콘텐츠의 저작권은 누구에게 있나요?",
      answer: "크리에이아이박스 플랫폼을 통해 생성된 모든 텍스트, 이미지, 영상, 음악 콘텐츠의 저작권은 출처 표기 의무 없이 전적으로 생성하신 유저(회원)님에게 귀속되며, 상업적 이용이 전면 허용됩니다."
    },
    {
      question: "카카오 소셜 로그인 연동 시 이메일 제공은 필수인가요?",
      answer: "최초 가입 시에는 선택 동의로 진행되나, 계정 분실 방지 및 주요 서비스 알림(결제, 리포트 완료 안내 등)을 정상적으로 수신하시려면 프로필 설정에서 이메일 연동을 완료해 주시는 것을 권장합니다."
    },
    {
      question: "무료 크레딧은 어떻게 충전되나요?",
      answer: "신규 회원가입 시 기본 창작 체험을 위한 웰컴 크레딧이 즉시 지급됩니다. 이후 크레딧을 모두 소진하시면 이용 가이드라인에 따라 충전 및 구독 요금제를 통해 추가 이용이 가능합니다."
    }
  ];

  // 🌟 검색 필터링 로직
  const filteredFaqs = faqList.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-zinc-100 pt-20 overflow-hidden relative">
      
      {/* 🌌 배경 은은한 오버레이 그라데이션 */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* 🔍 SECTION 1: HERO & SEARCH (상단 타이틀 및 통합 검색바) */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-xs font-bold tracking-widest uppercase">
            <HelpCircle size={12} /> Help Center
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
            무엇을 도와드릴까요?
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto font-medium">
            크리에이아이박스 이용 중 궁금한 점이 있으시다면 아래 검색창이나 자주 묻는 질문을 확인해 보세요.
          </p>
          
          {/* 대형 검색창 */}
          <div className="max-w-xl mx-auto relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="궁금한 키워드를 입력해 보세요 (예: 저작권, 크레딧)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-sm font-medium text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* 📱 SECTION 2: DIRECT CHANNELS (카카오톡 및 이메일 다이렉트 창구) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          
          {/* 카카오톡 채널 연동 카드 */}
          <a 
            href="https://pf.kakao.com/_RxdxmsX/chat" // 🌟 사장님이 방금 만드신 크리에이아이박스 카카오 채널 주소 대입하는 곳!
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700/80 transition-all flex items-start gap-4 group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare size={22} fill="currentColor" className="stroke-none" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-zinc-200 flex items-center gap-1">
                카카오톡 1:1 상담 <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed">
                가장 빠르게 답변을 받는 방법! <br />
                카카오톡 플러스친구로 평일 실시간 1:1 채팅 상담을 지원합니다.
              </p>
            </div>
          </a>

          {/* 구글 워크스페이스 대표메일 연동 카드 */}
          <a 
            href="mailto:contact@creaibox.com" // 🌟 우리가 설계한 구글 대표메일 주소 연결!
            className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700/80 transition-all flex items-start gap-4 group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail size={20} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-zinc-200 flex items-center gap-1">
                이메일 문의하기 <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed">
                제휴 및 대량 구매, 계정 오류 등 <br />
                서류 첨부가 필요한 복잡한 문의는 대표 메일로 접수해 주세요.
              </p>
            </div>
          </a>

        </div>

        {/* ❓ SECTION 3: FAQ ACCORDION (자주 묻는 질문 아코디언) */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-4">
            <FileText size={18} className="text-blue-500" /> 자주 묻는 질문 (FAQ)
          </h2>
          
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <details 
                  key={idx} 
                  className="group p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/10 open:bg-zinc-900/30 open:border-zinc-700/60 transition-all"
                >
                  <summary className="list-none flex justify-between items-center font-bold text-sm md:text-base text-zinc-300 cursor-pointer select-none group-open:text-white group-hover:text-zinc-100">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500 font-black">Q.</span> {faq.question}
                    </span>
                    <ChevronDown size={16} className="text-zinc-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 pt-4 border-t border-zinc-800/60 text-xs md:text-sm text-zinc-400 leading-relaxed font-medium pl-5 relative">
                    <span className="absolute left-0 top-4 text-emerald-400 font-black">A.</span>
                    {faq.answer}
                  </p>
                </details>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm font-medium">
                검색 결과와 일치하는 자주 묻는 질문이 없습니다.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}