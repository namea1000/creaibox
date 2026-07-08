"use client";

import React from "react";
import { Cookie, ShieldAlert, Settings, Eye, Info } from "lucide-react";
import Header from "@/components/layout/Header";

export default function CookiePolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pt-20 overflow-hidden relative">
      <Header />

      {/* 🌌 배경 은은한 따뜻한 골드빛 그라데이션 */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* 🍪 SECTION 1: HEADER (상단 타이틀) */}
        <div className="border-b border-slate-200 pb-8 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold tracking-widest uppercase shadow-sm">
            <Cookie size={12} className="text-amber-600" /> Legal & Cookies
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-950">
            쿠키 정책 (Cookie Policy)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            본 정책은 <span className="text-slate-900 font-bold">2026년 07월 07일</span>부터 시행됩니다. 크리에이박스(CreAibox)는 이용자 여러분에게 투명하고 신뢰성 높은 서비스를 제공하고자 쿠키 수집 기준 및 이용 목적을 상세히 안내해 드립니다.
          </p>
        </div>

        {/* 📄 SECTION 2: ARTICLES (쿠키 세부 설명 조항) */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed text-slate-700 font-medium">
          
          {/* 제 1조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-slate-950 flex items-center gap-2">
              <span className="text-amber-600 font-mono">01.</span> 쿠키(Cookie)란 무엇인가요?
            </h3>
            <p className="text-slate-600 text-xs md:text-sm pl-6">
              쿠키는 이용자가 웹사이트를 방문할 때, 이용자의 컴퓨터나 모바일 기기(브라우저)에 자동으로 저장되는 작은 텍스트 파일입니다. 쿠키를 통해 웹사이트는 이용자가 선호하는 설정 정보(언어, 다크 모드 테마, 동의 여부 등)를 기억하여 이용자에게 훨씬 빠르고 최적화된 맞춤형 브라우징 환경을 제공할 수 있습니다.
            </p>
          </div>

          {/* 제 2조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-slate-950 flex items-center gap-2">
              <span className="text-amber-600 font-mono">02.</span> 회사가 사용하는 쿠키의 종류 및 수집 목적
            </h3>
            <div className="text-slate-600 text-xs md:text-sm pl-6 space-y-4">
              <p>회사는 안정적인 서비스 제공과 원활한 사용자 경험 개선을 위해 아래와 같은 종류의 쿠키를 활용하고 있습니다.</p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-2">
                {/* 필수 쿠키 */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-950 font-bold">
                    <ShieldAlert size={16} className="text-red-500" />
                    <span>필수 및 세션 쿠키 (Essential)</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    회원가입 후 로그인 상태를 유지하고 본인 인증을 지속하기 위한 필수 쿠키입니다. 이 쿠키가 차단되면 스튜디오 글쓰기, 비디오 편집 등 계정 기반 기능을 전혀 사용하실 수 없습니다.
                  </p>
                </div>

                {/* 기능설정 쿠키 */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-950 font-bold">
                    <Settings size={16} className="text-amber-500" />
                    <span>환경 설정 쿠키 (Preferences)</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    다크 모드/라이트 모드 화면 설정 상태를 유지하거나, 하단 쿠키 동의 팝업 창의 하루 보이지 않기 상태(`cookie-consent`)를 기억하여 불필요한 번거로움을 줄여 줍니다.
                  </p>
                </div>

                {/* 분석용 쿠키 */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-slate-950 font-bold">
                    <Eye size={16} className="text-blue-500" />
                    <span>성능 및 분석 쿠키 (Analytics)</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    구글 애널리틱스(GA4) 분석 도구를 통해 방문자의 이용 패턴, 주요 접속 경로, 시스템 로드 병목 현상 등을 통계적으로 집계하여 인프라 성능을 쾌적하게 개선하기 위해 사용됩니다. (개인 식별이 불가능한 비식별 정보로 수집됩니다.)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 제 3조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-slate-955 flex items-center gap-2">
              <span className="text-amber-600 font-mono">03.</span> 쿠키의 보유 및 사용 기간
            </h3>
            <p className="text-slate-600 text-xs md:text-sm pl-6">
              웹 브라우저를 종료하는 순간 자동으로 파기되는 **임시 세션 쿠키**와, 이용자가 수동으로 삭제하거나 지정된 보존 기한이 만료될 때까지 브라우저에 남아 보존되는 **영속성 쿠키**가 존재합니다. 크리에이박스의 사용자 설정용 쿠키는 최대 <span className="text-slate-900 font-bold">1년</span> 동안 유지된 후 자동으로 안전하게 소멸합니다.
            </p>
          </div>

          {/* 제 4조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-slate-950 flex items-center gap-2">
              <span className="text-amber-600 font-mono">04.</span> 쿠키 수집을 거부하거나 설정하는 방법
            </h3>
            <div className="text-slate-600 text-xs md:text-sm pl-6 space-y-2">
              <p>이용자는 웹 브라우저 설정을 통해 언제든지 쿠키 수집을 전면 허용하거나, 개별 확인 절차를 거치거나, 모든 쿠키 수집을 일괄 거부할 수 있습니다. 각 브라우저별 설정 메뉴 경로는 다음과 같습니다.</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-650">
                <li><span className="text-slate-900 font-bold">구글 크롬 (Chrome):</span> 설정 ➔ 개인정보 보호 및 보안 ➔ 서드파티 쿠키 설정 제어</li>
                <li><span className="text-slate-900 font-bold">애플 사파리 (Safari):</span> 환경설정 ➔ 개인정보 보호 ➔ 모든 쿠키 차단 / 추적 해제</li>
                <li><span className="text-slate-900 font-bold">마이크로소프트 엣지 (Edge):</span> 설정 ➔ 쿠키 및 사이트 권한 ➔ 쿠키 및 사이트 데이터 관리</li>
              </ul>
              <p className="mt-2 text-amber-600 font-semibold flex items-start gap-1">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>주의: 모든 쿠키 수집을 거부하시는 경우, 로그인 및 회원 기반의 스튜디오 핵심 도구 서비스 이용에 일부 제약이 발생할 수 있습니다.</span>
              </p>
            </div>
          </div>

          {/* 제 5조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-slate-955 flex items-center gap-2">
              <span className="text-amber-600 font-mono">05.</span> 문의 사항 및 보호 담당 부서
            </h3>
            <div className="text-slate-600 text-xs md:text-sm pl-6 space-y-2">
              <p>쿠키 정책 또는 개인정보 취급 위탁과 관련된 추가 문의 사항은 당사의 고객지원 창구 혹은 대표 메일로 연락해 주시면 성심성의껏 신속하게 답변해 드리겠습니다.</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-650 space-y-1 max-w-md shadow-sm">
                <p>• <span className="text-slate-900 font-bold">대표 이메일:</span> <a href="mailto:creaiboxofficial@gmail.com" className="text-blue-600 hover:underline">creaiboxofficial@gmail.com</a></p>
                <p>• <span className="text-slate-900 font-bold">카카오톡 채널:</span> '크리에이박스'</p>
              </div>
            </div>
          </div>

        </div>

        {/* 🏁 SECTION 3: FOOTER (하단 카피라이트 고정) */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
          © {currentYear} 크리에이박스(CreAibox). All rights reserved. 본 쿠키 정책의 모든 저작권은 크리에이박스(CreAibox)에 있으며, 무단 복제 및 전재를 금합니다.
        </div>

      </div>
    </div>
  );
}
