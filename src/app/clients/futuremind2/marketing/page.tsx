"use client";

import React, { useState } from "react";
import type { Metadata } from "next";
import Link from "@/components/common/SmartIntentLink";
import { Megaphone, HelpCircle, ChevronDown, ChevronUp, Check } from "lucide-react";

const ROADMAP_STEPS = [
  {
    day: "Day 30",
    title: "1단계: 채널 분석 & 인플루언서 매칭",
    badge: "기반 구축",
    items: [
      "타겟 오디언스 정밀 프로파일 완성",
      "브랜드 핏 최적 인플루언서 3~5명 선정",
      "콘텐츠 캘린더 1차 작성 및 시나리오 기획",
      "캠페인 예산 및 주간 일정 확정",
    ],
  },
  {
    day: "Day 60",
    title: "2단계: 첫 캠페인 런칭 & 전환율 최적화",
    badge: "실전 집행",
    items: [
      "제휴 숏폼 및 롱폼 콘텐츠 첫 배포",
      "초기 반응 데이터 실시간 수집 및 분석",
      "상세페이지 전환율(CVR) 분석 및 개선",
      "소재별 A/B 테스트 진행 및 타겟팅 고도화",
    ],
  },
  {
    day: "Day 90",
    title: "3단계: 목표 매출 달성 & 지속 확장",
    badge: "매출 폭발",
    items: [
      "목표 매출 100% 달성 및 성공 패턴 분석",
      "고효율 인플루언서 장기 제휴 계약 체결",
      "2차 후속 캠페인 및 시즌별 프로모션 기획",
      "자사몰 정기 구독 및 재구매 루프 완성",
    ],
  },
];

const INDUSTRY_MATRIX = [
  {
    industry: "뷰티 (Beauty)",
    channel: "인스타그램 릴스 · 메이크업 튜토리얼 · 전후 리뷰",
    period: "2-3개월",
    roi: "+320%",
    caseStudy: "120만 인플루언서 제휴 ➔ 3개월 매출 2.3억 달성",
  },
  {
    industry: "테크 / AI (Tech)",
    channel: "유튜브 언박싱 · AI 데모 영상 · 실사용 가이드",
    period: "3개월",
    roi: "+280%",
    caseStudy: "85만 IT 테크 유튜버 ➔ 입소문 전환 매출 1.8억",
  },
  {
    industry: "육아 (Baby & Kids)",
    channel: "틱톡 챌린지 · 맘카페 브이로그 · 실사용 육아 팁",
    period: "1-2개월",
    roi: "+350%",
    caseStudy: "60만 맘 인플루언서 ➔ 2주 만에 초도 물량 100% 완판",
  },
  {
    industry: "패션 (Fashion)",
    channel: "인스타그램 룩북 · 숏폼 스타일링 OOTD · 라이브",
    period: "2개월",
    roi: "+250%",
    caseStudy: "패션 인플루언서 협업 ➔ 브랜드 검색량 450% 상승",
  },
  {
    industry: "식품 (Food & F&B)",
    channel: "유튜브 먹방 · 틱톡 쿡방 레시피 · 맛집 스토리",
    period: "2-3개월",
    roi: "+300%",
    caseStudy: "틱톡 레시피 챌린지 ➔ 스마트스토어 주문 폭증",
  },
];

const FAQS = [
  {
    q: "최소 예산은 얼마인가요?",
    a: "프로젝트 규모와 목표에 따라 다르지만, 일반적으로 월 300만원부터 시작 가능합니다. 초기 상담을 통해 귀사의 예산과 마진율에 가장 적합한 플랜을 맞춤 제안해 드립니다.",
  },
  {
    q: "캠페인 기간은 얼마나 걸리나요?",
    a: "평균 90일(3개월) 프로그램을 진행하며, 30일 단위로 성과를 투명하게 점검합니다. 업종과 목표에 따라 2개월부터 6개월까지 유연하게 조정 가능합니다.",
  },
  {
    q: "어떤 인플루언서와 매칭되나요?",
    a: "단순 팔로워 수가 아닌 실제 참여율(Engagement Rate)과 귀사의 브랜드 핏을 최우선으로 분석합니다. 마이크로(1~10만)부터 메가(100만+)까지 검증된 인플루언서 풀을 보유하고 있습니다.",
  },
  {
    q: "성과는 어떻게 측정하나요?",
    a: "도달률, 참여율, 클릭률, 전환율, 실매출액 등 구체적인 KPI를 설정하고 주간/월간 정밀 리포트를 제공합니다. 실시간 대시보드를 통해 언제든 성과를 투명하게 확인하실 수 있습니다.",
  },
  {
    q: "계약 후 바로 시작할 수 있나요?",
    a: "계약 체결 후 7~10일 이내에 프로젝트를 시작합니다. 이 기간 동안 인플루언서 매칭, 콘텐츠 기획, 일정 조율 등 사전 준비를 완벽히 마칩니다.",
  },
  {
    q: "중간에 전략을 변경할 수 있나요?",
    a: "물론입니다. 매주 성과 데이터를 기반으로 전략을 유연하게 조정합니다. 더 나은 결과를 위해 채널, 콘텐츠 형식, 타겟 오디언스를 실시간 최적화합니다.",
  },
];

export default function MarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-24">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold text-[#f95700] uppercase tracking-wider bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          GROWTH MARKETING & INFLUENCERS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          실전으로 매출을 키우다
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-medium">
          실제 창업에 성공한 마케터들의 노하우를 그대로 이식합니다.<br />
          단순 컨설팅이 아닌, <strong>실제 인플루언서와 함께하는 제휴 상품 개발 및 광고 실행까지 논스톱</strong>으로 진행됩니다.
        </p>
      </div>

      {/* 1. 90일 실전 매출 육성 로드맵 */}
      <div className="space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <span className="text-xs font-mono text-[#f95700] font-bold uppercase">SUCCESS PROCESS</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">90일 실전 매출 육성 3단계 로드맵</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROADMAP_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#f95700] px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                    {step.day}
                  </span>
                  <span className="text-xs text-neutral-500 font-bold">{step.badge}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{step.title}</h3>

                <ul className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
                  {step.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-2">
                      <Check size={13} className="text-[#f95700]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 5대 업종별 추천 채널 및 예상 ROI 비교표 */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono text-[#f95700] font-bold uppercase">INDUSTRY MATRIX</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">5대 업종별 최적화 채널 및 예상 ROI 지표</h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">실제 데이터 기반 평균 성과</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#141414] shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-xs">
                <th className="py-4 px-6 font-bold">비즈니스 업종</th>
                <th className="py-4 px-6 font-bold">최적화 추천 채널 및 콘텐츠</th>
                <th className="py-4 px-6 font-bold">진행 기간</th>
                <th className="py-4 px-6 font-bold">예상 ROI</th>
                <th className="py-4 px-6 font-bold">실제 성공 사례</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
              {INDUSTRY_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white whitespace-nowrap">{row.industry}</td>
                  <td className="py-4 px-6 leading-relaxed">{row.channel}</td>
                  <td className="py-4 px-6 font-mono text-neutral-400 whitespace-nowrap">{row.period}</td>
                  <td className="py-4 px-6 font-mono text-[#f95700] font-bold text-base whitespace-nowrap">{row.roi}</td>
                  <td className="py-4 px-6 font-medium text-orange-200">{row.caseStudy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 6대 FAQ */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-[#f95700] uppercase">FAQ</span>
          <h2 className="text-2xl font-black text-white">홍보 및 인플루언서 제휴 자주 묻는 질문</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-800 bg-[#141414] overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-[#f95700] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm">
                    <HelpCircle size={16} className="text-[#f95700] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#f95700] hover:bg-[#ea4e00] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/20"
        >
          <Megaphone size={16} />
          <span>내 비즈니스 맞춤 홍보 및 인플루언서 매칭 신청하기</span>
        </Link>
      </div>

    </div>
  );
}
