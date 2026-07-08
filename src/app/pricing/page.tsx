"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Crown,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      desc: "처음 시작하는 개인 크리에이터용",
      icon: Sparkles,
      badge: "Beta 무료",
      href: "/signup",
      features: [
        "AI 콘텐츠 생성 체험",
        "기본 글쓰기 도구",
        "이미지 / 음악 프롬프트 체험",
        "기본 라이브러리 저장",
        "베타 기간 무료 이용",
      ],
    },
    {
      name: "Creator",
      desc: "블로그, 이미지, 음악 작업을 자주 하는 크리에이터용",
      icon: Crown,
      badge: "준비 중",
      href: "/signup",
      features: [
        "AI 글쓰기 확장",
        "네이버 / 워드프레스 작업 지원",
        "음악 / 가사 생성 도구",
        "콘텐츠 라이브러리 확장",
        "트렌드 분석 기능",
      ],
    },
    {
      name: "Pro",
      desc: "전문 콘텐츠 제작자와 운영자를 위한 고급 플랜",
      icon: Crown,
      badge: "준비 중",
      href: "/signup",
      features: [
        "고급 AI 제작 도구",
        "다채널 콘텐츠 리퍼포징",
        "SEO 메타데이터 생성",
        "키워드 / 유튜브 트렌드 분석",
        "우선 기능 업데이트",
      ],
    },
    {
      name: "Business",
      desc: "팀, 기업, 대행사를 위한 맞춤형 플랜",
      icon: Building2,
      badge: "문의 필요",
      href: "/contact",
      features: [
        "기업형 맞춤 제작",
        "팀 단위 사용",
        "브랜드 전용 워크플로우",
        "광고 / 협업 제안",
        "프리미엄 지원",
      ],
    },
  ];

  // 동적으로 가격 정보 연산
  const getPriceDetails = (planName: string) => {
    if (planName === "Free") {
      return { priceText: "무료", subText: "" };
    }

    if (billingCycle === "monthly") {
      if (planName === "Creator") return { priceText: "9,900원", subText: "/ 월" };
      if (planName === "Pro") return { priceText: "19,900원", subText: "/ 월" };
      if (planName === "Business") return { priceText: "29,900원", subText: "/ 월" };
    } else {
      if (planName === "Creator") return { priceText: "7,900원", subText: "/ 월" };
      if (planName === "Pro") return { priceText: "15,900원", subText: "/ 월" };
      if (planName === "Business") return { priceText: "23,900원", subText: "/ 월" };
    }

    return { priceText: "미정", subText: "" };
  };

  const getYearlyTotalText = (planName: string) => {
    if (planName === "Creator") return "연 94,800원 (24,000원 절약)";
    if (planName === "Pro") return "연 190,800원 (48,000원 절약)";
    if (planName === "Business") return "연 286,800원 (72,000원 절약)";
    return "";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 transition-colors duration-300">
      <Header />

      {/* 1페이지 일체화: 단일 배경 위에서 콘텐츠가 수려하게 정렬되는 단일 main 구조 */}
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 lg:px-8">
        
        {/* 상단 타이틀 및 스위치 영역 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-900 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-black text-violet-750 dark:text-violet-400 shadow-sm">
            <Sparkles size={16} />
            CreAibox Pricing
          </div>

          <h1 className="mt-6 break-keep text-4xl font-black tracking-tight text-slate-955 dark:text-white md:text-6xl">
            창작을 가속화하는
            <br />
            <span className="text-violet-650 dark:text-violet-400">
              최적의 플랜을 만나보세요
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl break-keep text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400">
            개인 크리에이터부터 전문 기업 대행사까지, 작업 스타일과 규모에 맞는 합리적인 요금제를 선택하고 AI 멀티미디어 창작의 가능성을 극대화해 보세요.
          </p>

          {/* 베타 안내 배너 */}
          <div className="mt-10 mx-auto max-w-5xl rounded-[24px] border-2 border-amber-400 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-955/20 py-4 px-8 md:px-10 flex flex-col md:flex-row items-center justify-center gap-4 shadow-sm text-center md:text-left transition-all">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="break-keep text-lg md:text-xl font-black text-amber-955 dark:text-amber-200">
                현재 베타 서비스 기간으로 요금이 청구되지 않습니다.
              </p>
              <span className="hidden md:inline text-amber-300 dark:text-amber-800 font-black">|</span>
              <p className="break-keep text-xs md:text-sm font-semibold text-amber-800 dark:text-amber-450">
                정식 결제 기능과 세부 가격은 추후 공지 후 적용할 예정입니다.
              </p>
            </div>
          </div>

          {/* 월간/연간 결제 토글 메뉴 */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer border ${
                billingCycle === "monthly"
                  ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer border flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              연간 결제
              <span className="rounded-full bg-red-100 dark:bg-red-950/60 px-2 py-0.5 text-[10px] font-black text-red-600 dark:text-red-400">
                20% 할인
              </span>
            </button>
          </div>
        </div>

        {/* 요금제 카드 목록 (동일 배경 위에 일체화 형태로 즉각 렌더링) */}
        <div className="mt-20">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isFeatured = index === 1;
              const { priceText, subText } = getPriceDetails(plan.name);

              return (
                <div
                  key={plan.name}
                  className={`rounded-[28px] border p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                    isFeatured
                      ? "border-violet-250 dark:border-violet-850 bg-white dark:bg-slate-900/50"
                      : "border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/20"
                  }`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-black text-slate-655 dark:text-slate-400">
                      {plan.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-955 dark:text-white">
                    {plan.name}
                  </h2>

                  <p className="mt-2 break-keep text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-455 min-h-[40px]">
                    {plan.desc}
                  </p>

                  <div className="mt-6 min-h-[64px]">
                    <div>
                      <span className="text-4xl font-black text-slate-955 dark:text-white">
                        {priceText}
                      </span>
                      {subText && (
                        <span className="ml-1 text-sm font-bold text-slate-400 dark:text-slate-550">
                          {subText}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && plan.name !== "Free" && (
                      <p className="mt-1 text-[11px] font-bold text-violet-600 dark:text-violet-400">
                        {getYearlyTotalText(plan.name)}
                      </p>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition bg-violet-600 hover:bg-violet-700 text-white hover:scale-[1.02] shadow-sm"
                  >
                    {plan.name === "Business" ? "문의하기" : "시작하기"}
                    <ArrowRight size={16} />
                  </Link>

                  <ul className="mt-7 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2 text-sm font-bold text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-violet-500"
                        />
                        <span className="break-keep">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* 환불정책 바로가기 링크 박스 (구분 없이 정돈되어 자연스럽게 안착) */}
          <div className="mt-16 text-center">
            <Link href="/refund-policy" className="inline-flex">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 px-6 py-4.5 text-sm font-bold text-slate-655 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-900 hover:text-violet-600 transition shadow-sm cursor-pointer">
                <span>구매 및 환불에 대한 상세 기준은</span>
                <span className="text-violet-600 dark:text-violet-400 font-black underline decoration-2">환불 정책 규정</span>
                <span>에서 확인하실 수 있습니다.</span>
                <ArrowRight size={15} />
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}