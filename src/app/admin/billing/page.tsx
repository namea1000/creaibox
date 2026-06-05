"use client";

import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  WalletCards,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Crown,
  Activity,
  BarChart3,
} from "lucide-react";
import { SiStripe } from "react-icons/si";

const billingStats = [
  {
    label: "MRR",
    value: "$0",
    icon: DollarSign,
    color: "text-emerald-400",
  },
  {
    label: "ARR",
    value: "$0",
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    label: "Paid Users",
    value: "0",
    icon: Crown,
    color: "text-yellow-400",
  },
  {
    label: "Active Plans",
    value: "0",
    icon: CreditCard,
    color: "text-purple-400",
  },
];

const plans = [
  {
    name: "FREE",
    price: "$0",
    users: "-",
    color: "text-zinc-400",
  },
  {
    name: "STARTER",
    price: "$9",
    users: "-",
    color: "text-blue-400",
  },
  {
    name: "PRO",
    price: "$29",
    users: "-",
    color: "text-purple-400",
  },
  {
    name: "BUSINESS",
    price: "$99",
    users: "-",
    color: "text-yellow-400",
  },
];

const revenueModules = [
  "Stripe 결제 현황",
  "구독 관리",
  "요금제 관리",
  "환불 관리",
  "매출 분석",
  "API 사용량 과금",
  "무료 체험 제한",
  "사용자별 플랜",
  "결제 실패 관리",
];

export default function BillingAdminPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <SiStripe className="h-10 w-10 text-violet-400" />
            Revenue <span className="text-violet-400">Center</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Stripe · 구독 · 매출 · 환불 · 요금제 통합 관리
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="https://dashboard.stripe.com/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:border-violet-500/40 hover:text-violet-300"
          >
            Stripe Dashboard
            <ExternalLink size={14} />
          </Link>

          <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:text-white">
            <RefreshCw size={14} />
            새로고침
          </button>
        </div>
      </header>

      {/* KPI */}
      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {billingStats.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[24px] border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800/80 ${card.color}`}
              >
                <Icon size={20} />
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {card.label}
              </p>

              <p className={`mt-2 text-3xl font-black italic ${card.color}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Revenue Overview */}
      <section className="mb-10 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <h2 className="text-xl font-black italic text-white">
            결제 현황
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "오늘 매출",
              "이번주 매출",
              "이번달 매출",
              "결제 성공률",
              "환불률",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
              >
                <span className="text-sm font-bold text-zinc-400">
                  {item}
                </span>

                <span className="text-lg font-black italic text-white">
                  -
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <h2 className="text-xl font-black italic text-white">
            사용자 구독 상태
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "무료 사용자",
              "유료 사용자",
              "구독 취소 사용자",
              "체험판 사용자",
              "업그레이드 대기",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
              >
                <span className="text-sm font-bold text-zinc-400">
                  {item}
                </span>

                <span className="text-lg font-black italic text-white">
                  -
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="mb-10 rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
        <h2 className="text-xl font-black italic text-white">
          요금제 현황
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
            >
              <p
                className={`text-lg font-black italic ${plan.color}`}
              >
                {plan.name}
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {plan.price}
              </p>

              <p className="mt-3 text-sm text-zinc-500">
                Users: {plan.users}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Billing Modules */}
      <section className="mb-10 rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
        <h2 className="text-xl font-black italic text-white">
          결제 운영 모듈
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {revenueModules.map((module) => (
            <div
              key={module}
              className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-violet-400">
                <WalletCards size={18} />
              </div>

              <h3 className="text-sm font-black text-white">
                {module}
              </h3>

              <p className="mt-2 text-xs text-zinc-600">
                Stripe 연결 후 활성화 예정
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue Analytics */}
      <section className="mb-10 grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "MRR Growth",
            icon: TrendingUp,
          },
          {
            title: "Payment Success",
            icon: Activity,
          },
          {
            title: "Revenue Forecast",
            icon: BarChart3,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-violet-400">
                <Icon size={18} />
              </div>

              <h3 className="text-lg font-black italic text-white">
                {item.title}
              </h3>

              <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm font-bold text-zinc-600">
                Stripe 데이터 연결 예정
              </div>
            </div>
          );
        })}
      </section>

      {/* AI Insight */}
      <section className="rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-yellow-400" size={22} />

          <div>
            <h2 className="text-lg font-black italic text-yellow-300">
              Revenue AI Insight
            </h2>

            <div className="mt-4 space-y-3">
              {[
                "업그레이드 가능성이 높은 사용자",
                "이탈 위험 사용자",
                "가장 많이 사용하는 기능",
                "수익 기여도가 높은 기능",
                "추천 요금제 정책",
                "AI 기반 매출 예측",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-yellow-100/70"
                >
                  <CheckCircle2
                    size={16}
                    className="text-yellow-400"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}