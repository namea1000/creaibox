"use client";

import React from 'react';
import { Scale, FileText, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-zinc-100 pt-20 overflow-hidden relative">
      
      {/* 🌌 배경 은은한 법적 권위감 그라데이션 */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* ⚖️ SECTION 1: HEADER (상단 타이틀) */}
        <div className="border-b border-zinc-800 pb-8 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/5 text-zinc-400 text-xs font-bold tracking-widest uppercase">
            <Scale size={12} className="text-blue-500" /> Terms & Conditions
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
            서비스 이용약관
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 font-medium">
            본 약관은 <span className="text-zinc-400 font-bold">2026년 05월 18일</span>부터 적용됩니다. 크리에이아이박스 서비스를 이용하시기 전에 본 약관을 주의 깊게 읽어주시기 바랍니다.
          </p>
        </div>

        {/* 📜 SECTION 2: LEGAL ARTICLES (이용약관 조항 목록) */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed text-zinc-300 font-medium">
          
          {/* 제 1조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">01.</span> 목적 및 정의
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              본 약관은 <span className="text-zinc-200 font-bold">크리에이아이랩스</span>(이하 '회사')가 제공하는 올인원 AI 콘텐츠 생성 플랫폼 <span className="text-zinc-200 font-bold">'크리에이아이박스(CreAIbox)'</span> 서비스(이하 '서비스')의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>

          {/* 제 2조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">02.</span> 약관의 명시와 개정
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면 또는 연결 화면에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 약관이 변경되는 경우 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 내에 최소 적용 7일 전(회원에게 불리한 변경은 30일 전)부터 공지합니다.
            </p>
          </div>

          {/* 제 3조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">03.</span> 회원가입 및 계약 성립
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              이용계약은 이용자가 회사가 제공하는 소셜 로그인(구글, 카카오, 네이버 등) 연동을 통해 본 약관에 동의하고 가입 신청을 완료한 후, 회사가 이를 승인함으로써 성립합니다. 회사는 타인의 명의를 도용하거나 허위 정보를 기재한 신청에 대해서는 승인을 거절하거나 사후에 계약을 해지할 수 있습니다.
            </p>
          </div>

          {/* 제 4조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">04.</span> 서비스의 제공 및 인공지능 생성물의 저작권
            </h3>
            <div className="text-zinc-400 text-xs md:text-sm pl-6 space-y-2">
              <p>회사는 회원에게 글쓰기, 이미지, 비디오, 뮤직 콘텐츠 생성 및 분석 리포트 등 인공지능 기반의 다양한 도구를 제공합니다. 생성물의 저작권 정책은 다음과 같습니다.</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>회원이 서비스를 통해 독립적으로 생성한 모든 콘텐츠(텍스트, 이미지, 영상, 오디오 등)의 저작권 및 소유권은 전적으로 <span className="text-zinc-200 font-bold">해당 콘텐츠를 생성한 회원</span>에게 귀속됩니다.</li>
                <li>회원은 생성된 콘텐츠를 상업적 목적을 포함하여 자유롭게 복제, 배포, 전시할 수 있습니다. 단, 생성물이 제3자의 상표권, 저작권 등 독점적 권리를 침해하여 발생하는 모든 법적 책임은 회원 본인에게 있습니다.</li>
              </ul>
            </div>
          </div>

          {/* 제 5조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">05.</span> 서비스 이용 요금 및 환불 규정
            </h3>
            <div className="text-zinc-400 text-xs md:text-sm pl-6 space-y-2">
              <p>회사는 유료 서비스 및 크레딧 충전 서비스를 제공할 수 있으며, 환불 및 청약철회 조건은 전자상거래법 및 콘텐츠산업 진흥법을 준수합니다.</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>회원이 충전한 크레딧을 <span className="text-zinc-300 font-bold">전혀 사용하지 않은 상태</span>에서 결제일로부터 7일 이내에 환불을 요청하는 경우, 전액 환불이 가능합니다.</li>
                <li>인공지능 서비스 특성상, 결제 이후 <span className="text-zinc-300 font-bold">1회 이상의 콘텐츠 생성 또는 크레딧 차감</span>이 발생한 경우, 해당 구매 건에 대한 청약철회 및 환불은 제한됩니다.</li>
              </ul>
            </div>
          </div>

          {/* 제 6조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">06.</span> 회원의 의무 및 금지사항
            </h3>
            <div className="text-zinc-400 text-xs md:text-sm pl-6 space-y-2">
              <p>회원은 서비스 이용 시 아래 각 호의 행위를 하여서는 안 되며, 적발 시 회사는 사전 통보 없이 이용 제한, 콘텐츠 삭제, 계정 해지 조치를 취할 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>매크로, 봇(Bot), 크롤러 등을 이용해 회사의 인프라 및 API 서버에 비정상적인 과부하를 주는 행위</li>
                <li>음란물, 딥페이크 악용, 불법 도박 유도, 혐오 표현 등 사회적 불법 콘텐츠를 생성하거나 유포하는 행위</li>
                <li>회사의 서비스를 무단으로 리버스 엔지니어링하거나 소스코드를 복제 및 해킹하는 행위</li>
              </ul>
            </div>
          </div>

          {/* 제 7조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">07.</span> 면책 조항 (Disclaimers)
            </h3>
            <ul className="list-disc pl-11 text-zinc-400 text-xs md:text-sm space-y-1">
              <li>회사는 천재지변, 전시, 디도스(DDoS) 공격, 기간통신사업자의 회선 장애, 인공지능 오픈소스 연동 서버의 갑작스러운 장애 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</li>
              <li>회사는 서비스를 통해 생성된 AI 결과물의 무결성, 절대적인 정확성 및 특정 목적에 대한 적합성을 보장하지 않으며, 결과물 신뢰 및 활용으로 인해 발생한 회원의 유무형적 손해에 대해 책임을 면합니다.</li>
            </ul>
          </div>

          {/* 제 8조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">08.</span> 관할 법원
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              회사와 회원 간에 발생한 서비스 이용에 관한 분쟁에 대하여 소송이 제기될 경우, 회사의 본사 소재지(충청남도 천안시 관할 법원)를 관할 법원으로 합니다.
            </p>
          </div>

        </div>

        {/* 🏁 SECTION 3: FOOTER */}
        <div className="mt-16 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600 font-medium">
          © {currentYear} CreAI Labs. All rights reserved. 본 이용약관의 저작권은 크리에이아이랩스에 있으며 무단 복제를 금합니다.
        </div>

      </div>
    </div>
  );
}