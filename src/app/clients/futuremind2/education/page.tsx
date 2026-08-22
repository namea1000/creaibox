import React from "react";
import type { Metadata } from "next";
import Link from "@/components/common/SmartIntentLink";
import { Sparkles, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "교육 (Education) - 퓨처마인드 | 미래교육문화협회",
  description: "미래를 준비하는 실전 AI 교육, 생성형 AI 실무 워크숍 및 세대별 맞춤형 커리큘럼",
};

const EDUCATION_TABLE = [
  {
    target: "소상공인 · 예비창업자",
    content: "창업로드맵 수립, AI 비즈니스 모델, 정부 바우처 신청서 작성, IR 피칭 덱",
    period: "4주 (주 2회, 3시간)",
    outcome: "완성형 사업계획서 1부, 정부지원금 신청 대행 지원",
    badge: "바우처 100% 연계",
  },
  {
    target: "마케터 · 중소벤처",
    content: "인스타그램 운영, 메이저 인플루언서 제휴 매칭, 전환율 퍼널 설계 및 광고 최적화",
    period: "4주 실전 실습",
    outcome: "실제 광고 집행 50만 원 예산 지원 및 실전 매출 데이터 확보",
    badge: "실전 광고비 지원",
  },
  {
    target: "신중년 · 시니어",
    content: "노코드 웹제작(아노이두), 생성형 AI 업무 자동화, 매장 24/7 AI 챗봇 구축",
    period: "6주 완성 과정",
    outcome: "나만의 고유 랜딩페이지 1개 완성, 카카오톡 챗봇 매장 배포",
    badge: "인생 2막 디지털",
  },
  {
    target: "수출 기업 · 글로벌 진출",
    content: "AI 비즈니스 번역, 실전 글로벌 IR 피칭, 해외 바이어 화상 미팅 실습",
    period: "4주 집중 과정",
    outcome: "GPT-4o 1개월 무료 이용권 및 영문 IR 피치 덱 완성",
    badge: "글로벌 수출 특화",
  },
  {
    target: "청소년 · 초중고생",
    content: "드론 조종 및 코딩, VR/AR 실감형 체험, 로봇 풋살, 미래 진로 탐색",
    period: "1박 2일 / 당일 캠프",
    outcome: "어울림 메이커스 공식 수료증 발급 및 창의융합 포트폴리오",
    badge: "체험형 캠프",
  },
];

const EXPERIENTIAL_PROGRAMS = [
  {
    title: "🛸 드론 경기장 & 스마트 물류",
    target: "초등 · 중등 · 가족",
    desc: "드론 직접 조종 및 블록코딩을 활용한 스마트 물류 자동 배송 미션 수행",
  },
  {
    title: "👓 AR 서바이벌 & 가상 방탈출",
    target: "청소년 · 성인 · 군장병",
    desc: "증강현실(AR) 글래스를 착용하고 팀원과 협력하여 해결하는 안전/역사 미션",
  },
  {
    title: "🤖 로봇 풋살 & 자율주행 레이싱",
    target: "전 연령 · 가족 단위",
    desc: "모바일 컨트롤러로 로봇을 제어하고 센서 기반 자율주행 알고리즘 체험",
  },
  {
    title: "🚌 찾아가는 이동형 4차산업 버스",
    target: "전국 지자체 · 축제 · 학교",
    desc: "학교 운동장, 마을회관 어디든 출동하여 드론·VR·로봇 30분 순환 체험 부스 가동",
  },
];

export default function EducationPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-24">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold text-[#f95700] uppercase tracking-wider bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          COMPREHENSIVE CURRICULUM
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          미래를 준비하는 교육
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-medium">
          이론에 그치지 않고 <strong>실제 비즈니스와 일상에서 즉시 활용 가능한 실전 AI 교육</strong>을 제공합니다.<br />
          충남창업보육협회, 백석메이커스, 유수 대학 및 지자체와 함께 검증된 커리큘럼을 운영합니다.
        </p>
      </div>

      {/* 1. 교육 과정 상세 표 */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono text-[#f95700] font-bold uppercase">TARGETED PROGRAMS</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">대상별 맞춤형 AI 실전 교육 커리큘럼</h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">실습률 80% 이상 · 전 과정 1:1 멘토링</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#141414] shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-xs">
                <th className="py-4 px-6 font-bold">대상</th>
                <th className="py-4 px-6 font-bold">주요 교육 내용</th>
                <th className="py-4 px-6 font-bold">기간 / 시수</th>
                <th className="py-4 px-6 font-bold">수료 후 결과물 및 특전</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
              {EDUCATION_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white whitespace-nowrap">
                    <span className="block">{row.target}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-orange-500/10 text-[#f95700] text-[10px] font-mono border border-orange-500/20">
                      {row.badge}
                    </span>
                  </td>
                  <td className="py-4 px-6 leading-relaxed">{row.content}</td>
                  <td className="py-4 px-6 font-mono text-[#f95700] whitespace-nowrap">{row.period}</td>
                  <td className="py-4 px-6 font-medium text-emerald-400">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. 체험교육 & 어울림 메이커스 힐링캠프 */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono text-[#f95700] font-bold uppercase">MAKER EXPERIENCE</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">4차산업 실감체험 힐링캠프 (어울림 메이커스)</h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">천안 백석대학로 1, 3층 실습장 가동</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERIENTIAL_PROGRAMS.map((prog, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-3 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{prog.title}</h3>
                  <span className="text-[11px] font-mono text-[#f95700] px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                    {prog.target}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{prog.desc}</p>
              </div>
              <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>지자체 지원 시 무료 참가 가능</span>
                <span className="text-[#f95700] font-bold">체험 예약 접수 중</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CTA Box */}
      <div className="text-center pt-4">
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#f95700] hover:bg-[#ea4e00] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/20"
        >
          <Sparkles size={16} />
          <span>기업 출강 및 교육 수강 신청하기</span>
        </Link>
      </div>

    </div>
  );
}
