"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiStripe,
  SiGoogle,
  SiYoutube,
} from "react-icons/si";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Clock3,
  ExternalLink,
  FileText,
  Globe,
  MousePointerClick,
  RefreshCw,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

type AnalyticsStatus = {
  totalUsers: number;
  todayUsers: number;
  sevenDayUsers: number;
  thirtyDayUsers: number;
  paidUsers: number;
  googleUsers: number;
  publishedPosts: number;
  draftPosts: number;
  conversionRate: number;
  googleAnalyticsReady: boolean;
  searchConsoleReady: boolean;
  stripeReady: boolean;
  traffic: {
    todayVisitors: number | null;
    yesterdayVisitors: number | null;
    sevenDayVisitors: number | null;
    thirtyDayVisitors: number | null;
    realtimeUsers: number | null;
    pageViews?: number | null;
  };
  channels: { name: string; value: number }[];
  countries?: { name: string; value: number }[];
  devices?: { name: string; value: number }[];
  browsers?: { name: string; value: number }[];
  hourlyTrend?: { hour: string; visitors: number; views: number }[];
  analyticsError?: string | null;
  topPages?: { page: string; views: number; users: number }[];
  dailyTrend?: { date: string; visitors: number; views?: number; users?: number; posts?: number }[];
};

function formatValue(value?: number | null) {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("ko-KR");
}

const quickLinks = [
  {
    title: "Google Analytics",
    href: "https://analytics.google.com/",
    icon: SiGoogleanalytics,
    description: "GA4 방문자 및 유입 데이터 확인",
  },
  {
    title: "Search Console",
    href: "https://search.google.com/search-console",
    icon: SiGooglesearchconsole,
    description: "검색어, 노출수, 클릭수 분석",
  },
  {
    title: "Google Cloud",
    href: "https://console.cloud.google.com/",
    icon: SiGoogle,
    description: "OAuth, API, 사용자 인증 정보 관리",
  },
  {
    title: "Stripe Dashboard",
    href: "https://dashboard.stripe.com/",
    icon: SiStripe,
    description: "결제, 구독, 매출 관리",
  },
];

export default function AdminAnalyticsPage() {
  const [status, setStatus] = useState<AnalyticsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const connectAnalytics = async () => {
    await supabase.auth.signOut();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/analytics`,
        scopes: [
          "openid",
          "email",
          "profile",
          "https://www.googleapis.com/auth/analytics.readonly",
        ].join(" "),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
          include_granted_scopes: "true",
        },
      },
    });
  };

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/analytics/status", {
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("API 응답이 JSON이 아닙니다. route.ts 경로를 확인하세요.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analytics 상태 조회 실패");
      }

      setStatus(data);
    } catch (error) {
      console.error(error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  const overviewCards = useMemo(
    () => [
      {
        label: "Total Users",
        value: formatValue(status?.totalUsers),
        icon: Users,
        color: "text-blue-400",
        description: "전체 가입 회원",
      },
      {
        label: "Today Signups",
        value: formatValue(status?.todayUsers),
        icon: ArrowUpRight,
        color: "text-emerald-400",
        description: "오늘 신규 가입",
      },
      {
        label: "Paid Users",
        value: formatValue(status?.paidUsers),
        icon: WalletCards,
        color: "text-yellow-400",
        description: "유료 회원",
      },
      {
        label: "Conversion",
        value:
          status?.conversionRate !== undefined
            ? `${status.conversionRate}%`
            : "-",
        icon: TrendingUp,
        color: "text-purple-400",
        description: "무료 → 유료 전환율",
      },
    ],
    [status]
  );

  const trafficCards = useMemo(
    () => [
      {
        label: "Realtime Users",
        value: formatValue(status?.traffic.realtimeUsers),
        icon: Activity,
        color: "text-emerald-400",
      },
      {
        label: "Today Visitors",
        value: formatValue(status?.traffic.todayVisitors),
        icon: MousePointerClick,
        color: "text-blue-400",
      },
      {
        label: "7D Visitors",
        value: formatValue(status?.traffic.sevenDayVisitors),
        icon: BarChart3,
        color: "text-orange-400",
      },
      {
        label: "30D Visitors",
        value: formatValue(status?.traffic.thirtyDayVisitors),
        icon: Globe,
        color: "text-cyan-400",
      },
    ],
    [status]
  );

  const serviceCards = useMemo(
    () => [
      {
        label: "Google Analytics API",
        value: status?.googleAnalyticsReady ? "READY" : "MISSING",
        icon: SiGoogleanalytics,
        color: status?.googleAnalyticsReady
          ? "text-orange-400"
          : "text-yellow-400",
      },
      {
        label: "Search Console API",
        value: status?.searchConsoleReady ? "READY" : "MISSING",
        icon: SiGooglesearchconsole,
        color: status?.searchConsoleReady
          ? "text-emerald-400"
          : "text-yellow-400",
      },
      {
        label: "Stripe",
        value: status?.stripeReady ? "READY" : "LATER",
        icon: SiStripe,
        color: status?.stripeReady ? "text-violet-400" : "text-zinc-500",
      },
      {
        label: "YouTube Data",
        value: "READY",
        icon: SiYoutube,
        color: "text-red-500",
      },
    ],
    [status]
  );

  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <SiGoogleanalytics className="h-10 w-10 text-orange-400" />
            Analytics <span className="text-orange-400">Center</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            GA4 실데이터 · 유입 경로 · 회원 전환 · 콘텐츠 성과 통합 분석
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="https://analytics.google.com/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:border-orange-500/40 hover:text-orange-300"
          >
            Google Analytics
            <ExternalLink size={14} />
          </Link>

          <button
            type="button"
            onClick={() => void connectAnalytics()}
            className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-xs font-black text-orange-300 hover:bg-orange-500/20"
          >
            Analytics 연결
          </button>

          <button
            type="button"
            onClick={() => void fetchStatus()}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            새로고침
          </button>
        </div>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
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

              <p className="mt-2 text-xs font-bold text-zinc-600">
                {card.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-black italic text-white">
              GA4 트래픽 핵심 지표
            </h2>
            <p className="mt-1 text-xs font-bold text-zinc-600">
              Google Analytics Data API 기준 실데이터 표시 영역입니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {trafficCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 ${card.color}`}
                  >
                    <Icon size={18} />
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    {card.label}
                  </p>

                  <p className={`mt-2 text-3xl font-black italic ${card.color}`}>
                    {card.value}
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{
                        width:
                          card.value === "-" ? "0%" : "65%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            분석 API 상태
          </h2>

          <div className="mt-6 space-y-4">
            {serviceCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                    <Icon size={18} className={item.color} />
                    {item.label}
                  </div>

                  <span className={`text-xs font-black italic ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            회원 성장 분석
          </h2>

          <div className="mt-6 space-y-4">
            {[
              {
                label: "최근 7일 신규 가입",
                value: formatValue(status?.sevenDayUsers),
                icon: Users,
              },
              {
                label: "최근 30일 신규 가입",
                value: formatValue(status?.thirtyDayUsers),
                icon: TrendingUp,
              },
              {
                label: "Google 로그인 회원",
                value: formatValue(status?.googleUsers),
                icon: SiGoogle,
              },
              {
                label: "발행된 콘텐츠",
                value: formatValue(status?.publishedPosts),
                icon: FileText,
              },
              {
                label: "작성/저장 중 콘텐츠",
                value: formatValue(status?.draftPosts),
                icon: Clock3,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                    <Icon size={18} className="text-orange-400" />
                    {item.label}
                  </div>

                  <span className="text-lg font-black italic text-white">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            유입 채널 분석
          </h2>

          <div className="mt-6 space-y-4">
            {(status?.channels ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-sm font-bold text-zinc-600">
                GA4 채널 데이터가 아직 없습니다.
              </div>
            ) : (
              status?.channels.map((channel) => (
                <div
                  key={channel.name}
                  className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
                >
                  <div className="mb-2 flex items-center justify-between text-sm font-black">
                    <span className="text-zinc-300">{channel.name}</span>
                    <span className="text-zinc-500">
                      {formatValue(channel.value)}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${Math.min(channel.value * 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">상위 페이지</h2>

          <div className="mt-6 space-y-4">
            {(status?.topPages ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-sm font-bold text-zinc-600">
                페이지 데이터 없음
              </div>
            ) : (
              status?.topPages?.map((page) => (
                <div
                  key={`${page.page}-${page.views}`}
                  className="rounded-2xl border border-zinc-800 bg-[#080b11] p-4"
                >
                  <p className="line-clamp-1 text-sm font-black text-zinc-200">
                    {page.page}
                  </p>
                  <p className="mt-2 text-xs font-bold text-zinc-600">
                    Views {formatValue(page.views)} · Users {formatValue(page.users)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">국가별 방문자</h2>

          <div className="mt-6 space-y-4">
            {(status?.countries ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-sm font-bold text-zinc-600">
                국가 데이터 없음
              </div>
            ) : (
              status?.countries?.map((country) => (
                <div
                  key={country.name}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <span className="text-sm font-bold text-zinc-400">
                    {country.name}
                  </span>
                  <span className="text-lg font-black italic text-white">
                    {formatValue(country.value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">디바이스</h2>

          <div className="mt-6 space-y-4">
            {(status?.devices ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-sm font-bold text-zinc-600">
                디바이스 데이터 없음
              </div>
            ) : (
              status?.devices?.map((device) => (
                <div
                  key={device.name}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <span className="text-sm font-bold text-zinc-400">
                    {device.name}
                  </span>
                  <span className="text-lg font-black italic text-white">
                    {formatValue(device.value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-yellow-400" size={22} />
          <div>
            <h2 className="text-lg font-black italic text-yellow-300">
              GA4 데이터 안내
            </h2>
            <p className="mt-2 text-sm leading-7 text-yellow-100/70">
              GA4 데이터는 실시간 화면에는 바로 표시되지만, Data API 보고서에는 수 분에서 수 시간 지연되어 반영될 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            빠른 분석 도구
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quickLinks.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  target="_blank"
                  className="group rounded-2xl border border-zinc-800 bg-[#080b11] p-5 transition hover:border-orange-500/40 hover:bg-zinc-900"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-orange-400">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-sm font-black text-white">
                    {tool.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-6 text-zinc-500">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            7일 방문 추이
          </h2>

          <div className="mt-6 space-y-4">
            {(status?.dailyTrend ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-sm font-bold text-zinc-600">
                추이 데이터 없음
              </div>
            ) : (
              status?.dailyTrend?.map((row) => (
                <div
                  key={row.date}
                  className="rounded-2xl border border-zinc-800 bg-[#080b11] p-4"
                >
                  <div className="mb-2 flex justify-between text-xs font-black text-zinc-400">
                    <span>{row.date}</span>
                    <span>{formatValue(row.visitors)} users</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{
                        width: `${Math.min(row.visitors * 20, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}