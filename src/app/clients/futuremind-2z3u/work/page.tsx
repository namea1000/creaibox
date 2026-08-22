import React from "react";
import type { Metadata } from "next";
import Link from "@/components/common/SmartIntentLink";
import { ArrowRight, ShieldCheck, Zap, Users, CheckCircle2, Check, Building2, Rocket, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "WE WORK - 퓨처마인드 | 미래교육문화협회",
  description: "비즈니스의 모든 분야에 걸친 어제의 지혜와 내일의 가능성을 잇습니다.",
};

export default function WorkPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-24">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          OUR MISSION & SEGMENTS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          WE WORK
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-medium">
          비즈니스의 모든 분야에 걸친 <strong>어제의 지혜와 내일의 가능성</strong>을 잇습니다.<br />
          대기업과 관공서의 조직 혁신부터 예비·초기 창업자의 도약, 모든 세대의 삶을 위해 존재합니다.
        </p>
      </div>

      {/* 3 Core Target Segments Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. 대기업 / 관공서 */}
        <div className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
              <Building2 size={28} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">SEGMENT 01</span>
              <h2 className="text-xl font-bold text-white">대기업 · 관공서</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              조직의 혁신은 지나온 길의 축적입니다. 기관과 기업의 업무 효율을 극대화하는 AI 솔루션, 디지털 전환 플랫폼 및 경영 자동화 시스템을 제공합니다.
            </p>
            <ul className="space-y-2.5 pt-3 border-t border-neutral-800 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 기관 맞춤형 AI 솔루션 및 SW 기능 구현</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 정부·공공기관 입찰 100% 전문 제안 기획</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 임직원 생성형 AI 실무 역량 강화 워크숍</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 사내 데이터 보안 RAG 챗봇 구축</li>
            </ul>
          </div>
          <Link
            href="/development"
            className="inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 hover:bg-cyan-500 hover:text-neutral-950 border border-neutral-800 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
          >
            <span>기업 맞춤 개발 솔루션 보기</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 2. 예비 / 초기 창업자 */}
        <div className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
              <Rocket size={28} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">SEGMENT 02</span>
              <h2 className="text-xl font-bold text-white">예비 · 초기 창업자</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              도약은 새로운 시작의 설렘입니다. 브랜드 기획부터 IP 로드맵, 특허 출원, 정부 바우처 지원사업 획득 및 인플루언서 제휴 마케팅까지 원스톱으로 지원합니다.
            </p>
            <ul className="space-y-2.5 pt-3 border-t border-neutral-800 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> IP 디딤돌 지원사업 & 특허 출원 컨설팅</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 창업자를 위한 원스톱 바우처 제안서 작성</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 90일 실전 매출 전환 인플루언서 제휴</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 전환율 3.2배 고효율 랜딩/퍼널 설계</li>
            </ul>
          </div>
          <Link
            href="/planning"
            className="inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 hover:bg-cyan-500 hover:text-neutral-950 border border-neutral-800 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
          >
            <span>창업 바우처 기획 보기</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3. 모든 세대 (대학·청소년·신중년) */}
        <div className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
              <HeartHandshake size={28} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">SEGMENT 03</span>
              <h2 className="text-xl font-bold text-white">대학 · 청소년 · 신중년</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              모든 여정은 삶을 위해 존재합니다. 대학생의 취업 역량, 청소년의 창의 융합 체험, 신중년의 인생 2막 디지털 리터러시까지 미래 사회를 위한 교육을 펼칩니다.
            </p>
            <ul className="space-y-2.5 pt-3 border-t border-neutral-800 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 대학생 AI 포트폴리오 & 취업 부트캠프</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 청소년 창의 융합 및 미래 기술 체험</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 신중년 맞춤형 노코드 & 매장 자동화</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400 shrink-0" /> 4차산업 실감 체험 힐링캠프 운영</li>
            </ul>
          </div>
          <Link
            href="/education"
            className="inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 hover:bg-cyan-500 hover:text-neutral-950 border border-neutral-800 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
          >
            <span>생애전주기 교육과정 보기</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 5대 사회적 가치 */}
      <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-8 sm:p-10 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 size={20} className="text-cyan-400" /> 미래교육문화협회의 5대 사회적 핵심 가치
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-neutral-300">
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
            <h4 className="font-bold text-white">1. 4차 산업 체험 교육 프로그램</h4>
            <p className="text-neutral-400">드론, 로봇, VR/AR 기술을 직접 체험하며 창의적 문제 해결력을 키웁니다.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
            <h4 className="font-bold text-white">2. 지역사회 교육 활성화</h4>
            <p className="text-neutral-400">전국 지역사회와 협력하여 찾아가는 이동형 4차 산업 체험 캠프를 운영합니다.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
            <h4 className="font-bold text-white">3. 미래 인재 양성</h4>
            <p className="text-neutral-400">어린이부터 청소년, 성인까지 전 연령대 맞춤형 커리큘럼을 지원합니다.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
            <h4 className="font-bold text-white">4. 문화와 기술의 융합</h4>
            <p className="text-neutral-400">교육과 문화가 결합된 창의적 콘텐츠를 기획하여 새로운 시각을 제공합니다.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
            <h4 className="font-bold text-white">5. 사회문제 해결 실감형 교육</h4>
            <p className="text-neutral-400">환경, 안전, 보건 등 사회적 문제를 기술을 통해 해결하는 실습을 진행합니다.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
            <h4 className="font-bold text-white">6. 찾아가는 방문 서비스</h4>
            <p className="text-neutral-400">지역 행사, 축제, 학교 운동장 어디든 첨단 체험 부스를 직접 설치 운영합니다.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
