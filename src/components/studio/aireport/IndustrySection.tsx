"use client";

import React, { useState } from "react";
import { Building2, Sparkles, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";

interface IndustryItem {
  id: string;
  name: string;
  adoptionRate: number; // percentage
  status: string;
  cases: string[];
  description: string;
  color: string;
}

export default function IndustrySection() {
  const industries: IndustryItem[] = [
    {
      id: "healthcare",
      name: "의료 및 헬스케어",
      adoptionRate: 64,
      status: "성장기",
      color: "from-blue-600 to-cyan-500",
      description: "AI 신약 개발 기간 단축, MRI/CT 영상 판독 진단 정밀화, 의료 빅데이터 차트 자동 기록 솔루션 도입이 급성장 중입니다.",
      cases: ["AI 영상 판독 어시스턴트", "단백질 구조 시뮬레이션 기반 신약 스크리닝", "의료 기록 전사용 음성 AI 비서"],
    },
    {
      id: "finance",
      name: "금융 및 자산 관리",
      adoptionRate: 78,
      status: "성숙기",
      color: "from-emerald-600 to-teal-500",
      description: "인공지능 기반의 고도화된 트레이딩 알고리즘, 실시간 이상금융거래(FDS) 탐지, 초개인화 자산관리 상담용 AI 챗봇이 보편화되고 있습니다.",
      cases: ["실시간 이상거래 탐지 시스템(FDS)", "로보어드바이저 포트폴리오 관리", "금융 약관 질의응답 규제 준수 RAG"],
    },
    {
      id: "manufacturing",
      name: "제조 및 공급망",
      adoptionRate: 52,
      status: "확장기",
      color: "from-amber-600 to-orange-500",
      description: "공장 설비의 예측 보전(Predictive Maintenance), 컴퓨터 비전을 이용한 실시간 불량 진단, 수요 기반 재고 최적화에 적용되고 있습니다.",
      cases: ["진동 센서 기반 기기 고장 예지 보전", "카메라 검사 품질 보증(QA) 비전 모형", "물류 수요 동적 매칭 최적화"],
    },
    {
      id: "retail",
      name: "유통 및 이커머스",
      adoptionRate: 72,
      status: "성숙기",
      color: "from-purple-600 to-pink-500",
      description: "사용자 시청/구매 기록 기반 실시간 개인 추천, AI 자동 상세 페이지 제작, 가상 시착(Virtual Try-on) 및 동적 가격 결정(Dynamic Pricing)을 수행합니다.",
      cases: ["초개인화 추천 랭킹 알고리즘", "생성형 AI 패션 화보 및 상세 피드 제작", "동적 마진 가격 조정 시뮬레이터"],
    },
  ];

  const [activeIndustryId, setActiveIndustryId] = useState("healthcare");
  const selectedIndustry = industries.find((i) => i.id === activeIndustryId) || industries[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">산업별 AI 분석</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              각 핵심 산업군별 인공지능 기술의 적용 방식, 시장 성숙도 및 성공 사례를 실시간 분석합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 산업 선택 그리드 */}
        <div className="lg:col-span-1 space-y-3">
          {industries.map((ind) => {
            const isActive = ind.id === activeIndustryId;

            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActiveIndustryId(ind.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-emerald-500/60 bg-emerald-500/10 text-white"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 text-zinc-400 hover:border-zinc-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-base font-black ${isActive ? "text-emerald-400" : "text-zinc-900 dark:text-zinc-150"}`}>
                    {ind.name}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                    {ind.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500">
                    <span>AI 도입 성숙도</span>
                    <span>{ind.adoptionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${ind.color} rounded-full`}
                      style={{ width: `${ind.adoptionRate}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 산업 상세 현황 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">{selectedIndustry.name} 분석 리포트</h3>
              <p className="text-xs font-bold text-zinc-500 mt-1">현 상태: {selectedIndustry.status}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-400">
              <TrendingUp size={14} />
              연평균 도입률 +12.8%
            </span>
          </div>

          <div className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-300">
            {selectedIndustry.description}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              주요 AI 적용 유즈케이스
            </h4>
            <div className="space-y-2">
              {selectedIndustry.cases.map((cs, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-zinc-250 dark:border-zinc-850/80 bg-zinc-50 dark:bg-zinc-950/20 p-3 text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{cs}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 transition mt-4">
            상세 {selectedIndustry.name} PDF 리포트 다운로드
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
