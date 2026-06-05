"use client";

import React from 'react';
import { Shield, FileText, Lock, EyeOff, Scale } from 'lucide-react';

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-zinc-100 pt-20 overflow-hidden relative">

      {/* 🌌 배경 은은한 법적 신뢰감 그라데이션 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">

        {/* 🛡️ SECTION 1: HEADER (상단 타이틀) */}
        <div className="border-b border-zinc-800 pb-8 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/5 text-zinc-400 text-xs font-bold tracking-widest uppercase">
            <Shield size={12} className="text-blue-500" /> Legal & Privacy
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
            개인정보처리방침
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 font-medium">
            본 방침은 <span className="text-zinc-400 font-bold">2026년 05월 18일</span>부터 시행됩니다. 크리에이아이랩스는 정보주체의 개인정보를 보호하고 이와 관련된 고충을 신속하고 원활하게 처리할 수 있도록 최선을 다하고 있습니다.
          </p>
        </div>

        {/* 📄 SECTION 2: LEGAL ARTICLES (법적 조항 목록) */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed text-zinc-300 font-medium">

          {/* 제 1조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">01.</span> 개인정보의 처리 목적
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              <span className="text-zinc-200 font-bold">크리에이아이랩스</span>(이하 '회사')는 회사가 운영하는 인공지능 콘텐츠 생성 플랫폼 <span className="text-zinc-200 font-bold">'크리에이박스(CreAibox)'</span>의 회원가입 의사 확인, 이용자 식별, 서비스 제공에 따른 본인 인증, 서비스 원활한 운영 및 주요 공지사항 전달, 인공지능 기반 분석 리포트 발행 등의 목적으로 개인정보를 처리합니다. 처리하고 있는 개인정보는 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
          </div>

          {/* 제 2조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">02.</span> 처리하는 개인정보의 항목
            </h3>
            <div className="text-zinc-400 text-xs md:text-sm pl-6 space-y-2">
              <p>회사는 소셜 로그인 회원가입 및 서비스 이용 과정에서 아래와 같은 개인정보 항목을 수집하고 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><span className="text-zinc-300 font-bold">수집 항목 (소셜 연동 시):</span> 이메일 주소, 카카오 식별 고유 ID, 프로필 닉네임, 프로필 이미지</li>
                <li><span className="text-zinc-300 font-bold">자동 수집 항목:</span> 서비스 이용 기록, 접속 로그, 쿠키, IP 주소, 결제 기록 (유료 서비스 이용 시)</li>
              </ul>
            </div>
          </div>

          {/* 제 3조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">03.</span> 개인정보의 처리 및 보유 기간
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              회사는 이용자로부터 개인정보를 수집할 때 동의받은 개인정보 보유 및 이용 기간 또는 법령에 따른 개인정보 보유 및 이용 기간 내에서 개인정보를 처리하고 보유합니다. 원칙적으로 <span className="text-zinc-200 font-bold">회원 탈퇴 즉시</span> 이용자의 개인정보는 파기됩니다. 단, 관계 법령(전자상거래법 등)의 규정에 의하여 보존할 필요가 있는 경우, 계약 또는 청약철회 등에 관한 기록은 5년, 대금결제 및 재화 등의 공급에 관한 기록은 5년간 보관됩니다.
            </p>
          </div>

          {/* 제 4조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">04.</span> 개인정보의 제3자 제공 및 위탁에 관한 사항
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              회사는 이용자의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 이용자의 사전 동의 없이는 원칙적으로 회사의 서비스와 무관한 제3자에게 제공하지 않습니다. 단, 안정적인 클라우드 인프라 및 인증 생태계 운영을 위해 글로벌 클라우드 백엔드 인프라 서비스인 <span className="text-zinc-200 font-bold">Supabase (수파베이스)</span> 시스템에 데이터베이스 관리를 위탁하여 엄격하게 암호화 보관하고 있습니다.
            </p>
          </div>

          {/* 제 5조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">05.</span> 정보주체의 권리·의무 및 그 행사방법
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              이용자는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 플랫폼 내 [내 프로필/마이페이지] 혹은 고객센터(카카오톡 채널 상담 및 대표 메일)를 통해 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
          </div>

          {/* 제 6조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">06.</span> 개인정보의 안전성 확보 조치
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm pl-6">
              회사는 개인정보의 안전성 확보를 위해 해킹 등에 대비한 기술적 대책(SSL 암호화 통신 등), 개인정보 취급 직원의 최소화 및 정기적 교육, 개인정보처리시스템의 접근 권한 관리 등 엄격한 물리적·기술적 방어 시스템을 이행하고 있습니다.
            </p>
          </div>

          {/* 제 7조 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-zinc-100 flex items-center gap-2">
              <span className="text-blue-500 font-mono">07.</span> 개인정보 보호책임자 및 고충처리 창구
            </h3>
            <div className="text-zinc-400 text-xs md:text-sm pl-6 space-y-2">
              <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 고충처리 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 font-medium text-zinc-400 space-y-1 max-w-md">
                <p>• <span className="text-zinc-300 font-bold">개인정보 보호책임자:</span> 크리에이아이랩스 대표</p>
                <p>• <span className="text-zinc-300 font-bold">연락처 / 대표 메일:</span> <a href="mailto:creaiboxofficial@gmail.com" className="text-blue-400 hover:underline">creaiboxofficial@gmail.com</a></p>
                <p>• <span className="text-zinc-300 font-bold">고객지원 창구:</span> 카카오톡 채널 '크리에이아이박스'</p>
              </div>
            </div>
          </div>

        </div>

        {/* 🏁 SECTION 3: FOOTER (하단 카피라이트 고정) */}
        <div className="mt-16 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600 font-medium">
          © {currentYear} CreAI Labs. All rights reserved. 본 개인정보처리방침의 저작권은 크리에이아이랩스에 있으며, 무단 복제를 금합니다.
        </div>

      </div>
    </div>
  );
}