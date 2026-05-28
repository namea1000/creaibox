"use client";

import React from "react";
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
  const plans = [
    {
      name: "Free",
      price: "무료",
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
      price: "미정",
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
      price: "미정",
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
      price: "미정",
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

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="pt-20">
        <section className="bg-gradient-to-b from-violet-50 via-white to-white px-6 py-24">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-black text-violet-700 shadow-sm">
              <Sparkles size={16} />
              CreAIbox Pricing
            </div>

            <h1 className="mt-6 break-keep text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              지금은 베타 기간,
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                가격 정책은 준비 중입니다
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl break-keep text-lg font-medium leading-relaxed text-slate-600">
              CreAIbox는 현재 베타 서비스로 운영 중입니다. 정식 요금제는 추후
              공개 예정이며, 현재는 주요 스튜디오 기능을 무료로 체험할 수
              있습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isFeatured = index === 1;

              return (
                <div
                  key={plan.name}
                  className={`rounded-[28px] border p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${isFeatured
                      ? "border-violet-200 bg-gradient-to-b from-violet-50 to-white"
                      : "border-slate-200 bg-white"
                    }`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {plan.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-950">
                    {plan.name}
                  </h2>

                  <p className="mt-2 break-keep text-sm font-medium leading-relaxed text-slate-500">
                    {plan.desc}
                  </p>

                  <div className="mt-6">
                    <span className="text-4xl font-black text-slate-950">
                      {plan.price}
                    </span>
                    {plan.price !== "무료" && (
                      <span className="ml-1 text-sm font-bold text-slate-400">
                        / 예정
                      </span>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${isFeatured
                        ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/20 hover:scale-[1.02]"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                  >
                    {plan.name === "Business" ? "문의하기" : "시작하기"}
                    <ArrowRight size={16} />
                  </Link>

                  <ul className="mt-7 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2 text-sm font-bold text-slate-600"
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

          <div className="mt-12 rounded-[28px] border border-blue-100 bg-blue-50 p-8 text-center">
            <p className="break-keep text-lg font-black text-slate-900">
              베타 서비스 기간에는 요금이 청구되지 않습니다.
            </p>
            <p className="mt-2 break-keep text-sm font-medium text-slate-600">
              정식 결제 기능과 세부 가격은 추후 공지 후 적용할 예정입니다.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}