"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SiGoogle,
  SiYoutube,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiGooglecalendar,
  SiGoogledrive,
  SiGoogledocs,
  SiGooglesheets,
} from "react-icons/si";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

type GoogleStatus = {
  oauthClient: boolean;
  youtubeApiKey: boolean;
  enabledApis: number;
  totalUsers: number;
  googleUsers: number;
  publishedPosts: number;
  apiStatus: string;
  services: {
    name: string;
    status: string;
    usage: number;
  }[];
};

type GoogleApiItem = {
  name: string;
  type: "OAuth" | "API Key";
  fallbackStatus: "ACTIVE" | "READY" | "MISSING";
  icon: React.ElementType;
  color: string;
  fallbackUsage: number;
  description: string;
};

const googleApis: GoogleApiItem[] = [
  {
    name: "Google Login",
    type: "OAuth",
    fallbackStatus: "ACTIVE",
    icon: SiGoogle,
    color: "text-blue-400",
    fallbackUsage: 92,
    description: "Supabase Google Provider 연결 완료",
  },
  {
    name: "YouTube Data API v3",
    type: "API Key",
    fallbackStatus: "ACTIVE",
    icon: SiYoutube,
    color: "text-red-500",
    fallbackUsage: 38,
    description: "YouTube 트렌드, 채널, 영상 데이터 분석용",
  },
  {
    name: "Search Console API",
    type: "OAuth",
    fallbackStatus: "READY",
    icon: SiGooglesearchconsole,
    color: "text-emerald-400",
    fallbackUsage: 21,
    description: "검색어, 클릭수, 노출수, CTR, 평균순위 분석",
  },
  {
    name: "Google Analytics API",
    type: "OAuth",
    fallbackStatus: "READY",
    icon: SiGoogleanalytics,
    color: "text-orange-400",
    fallbackUsage: 17,
    description: "방문자, 유입 경로, 페이지 성과 분석",
  },
  {
    name: "Google Drive API",
    type: "OAuth",
    fallbackStatus: "READY",
    icon: SiGoogledrive,
    color: "text-sky-400",
    fallbackUsage: 8,
    description: "이미지, 문서, 결과물 저장 및 백업",
  },
  {
    name: "Google Docs API",
    type: "OAuth",
    fallbackStatus: "READY",
    icon: SiGoogledocs,
    color: "text-blue-300",
    fallbackUsage: 5,
    description: "AI 원고를 Google Docs로 저장",
  },
  {
    name: "Google Sheets API",
    type: "OAuth",
    fallbackStatus: "READY",
    icon: SiGooglesheets,
    color: "text-green-400",
    fallbackUsage: 11,
    description: "분석 결과, 키워드, 콘텐츠 데이터 저장",
  },
  {
    name: "Google Calendar API",
    type: "OAuth",
    fallbackStatus: "READY",
    icon: SiGooglecalendar,
    color: "text-indigo-400",
    fallbackUsage: 4,
    description: "콘텐츠 발행 일정, 업무 일정 연동",
  },
];

const roadmap = [
  "Search Console 연동 대시보드",
  "Analytics 실시간 방문자 분석",
  "YouTube 키워드/채널 분석",
  "Drive 자동 저장",
  "Docs 원고 내보내기",
  "Sheets 분석 리포트 저장",
  "Calendar 발행 일정 연동",
  "사용자별 Google 권한 관리",
];

function getServiceStatus(
  status: GoogleStatus | null,
  name: string,
  fallbackStatus: string
) {
  return (
    status?.services?.find((service) => service.name === name)?.status ||
    fallbackStatus
  );
}

function getServiceUsage(
  status: GoogleStatus | null,
  name: string,
  fallbackUsage: number
) {
  return (
    status?.services?.find((service) => service.name === name)?.usage ??
    fallbackUsage
  );
}

export default function GoogleAdminPage() {
  const [status, setStatus] = useState<GoogleStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/google/status", {
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("API 응답이 JSON이 아닙니다. route.ts 경로를 확인하세요.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "상태 조회 실패");
      }

      setStatus(data);
    } catch (err) {
      console.error(err);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  const summaryCards = useMemo(
    () => [
      {
        label: "OAuth Client",
        value: loading
          ? "CHECKING"
          : status?.oauthClient
            ? "ACTIVE"
            : "MISSING",
        icon: ShieldCheck,
        color: status?.oauthClient ? "text-emerald-400" : "text-yellow-400",
      },
      {
        label: "API Key",
        value: loading
          ? "CHECKING"
          : status?.youtubeApiKey
            ? "YOUTUBE"
            : "MISSING",
        icon: KeyRound,
        color: status?.youtubeApiKey ? "text-red-400" : "text-yellow-400",
      },
      {
        label: "Enabled APIs",
        value: loading ? "-" : String(status?.enabledApis ?? 8),
        icon: Activity,
        color: "text-blue-400",
      },
      {
        label: "Security",
        value: loading ? "CHECKING" : status?.apiStatus ?? "NORMAL",
        icon: Lock,
        color: "text-purple-400",
      },
    ],
    [loading, status]
  );

  const usageCards = useMemo(
    () => [
      {
        label: "YouTube Requests",
        value: status?.youtubeApiKey ? "READY" : "MISSING",
        rate: getServiceUsage(status, "YouTube Data API v3", 38),
      },
      {
        label: "Search Queries",
        value: "OAUTH",
        rate: getServiceUsage(status, "Search Console API", 21),
      },
      {
        label: "Analytics Reports",
        value: "OAUTH",
        rate: getServiceUsage(status, "Google Analytics API", 17),
      },
      {
        label: "Productivity Calls",
        value: "OAUTH",
        rate: Math.max(
          getServiceUsage(status, "Google Drive API", 8),
          getServiceUsage(status, "Google Docs API", 5),
          getServiceUsage(status, "Google Sheets API", 11),
          getServiceUsage(status, "Google Calendar API", 4)
        ),
      },
    ],
    [status]
  );

  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <SiGoogle className="h-10 w-10 text-blue-500" />
            Google <span className="text-blue-500">Control</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            OAuth · API Key · Google Cloud · Search Console · Analytics · YouTube
            통합 관리
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="https://console.cloud.google.com/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:border-blue-500/40 hover:text-blue-300"
          >
            Google Cloud
            <ExternalLink size={14} />
          </Link>

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
        {summaryCards.map((card) => {
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
              <p className={`mt-2 text-2xl font-black italic ${card.color}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black italic text-white">
                Google API 연결 현황
              </h2>
              <p className="mt-1 text-xs font-bold text-zinc-600">
                OAuth 전용 API와 YouTube API Key 상태를 통합 모니터링합니다.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {googleApis.map((api) => {
              const Icon = api.icon;
              const apiStatus = getServiceStatus(
                status,
                api.name,
                api.fallbackStatus
              );
              const apiUsage = getServiceUsage(
                status,
                api.name,
                api.fallbackUsage
              );

              return (
                <div
                  key={api.name}
                  className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 ${api.color}`}
                      >
                        <Icon size={24} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-black text-white">
                            {api.name}
                          </h3>
                          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[9px] font-black uppercase text-zinc-400">
                            {api.type}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${apiStatus === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : apiStatus === "MISSING"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-blue-500/10 text-blue-400"
                              }`}
                          >
                            {apiStatus}
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-medium text-zinc-500">
                          {api.description}
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-48">
                      <div className="mb-1 flex justify-between text-[9px] font-black uppercase text-zinc-600">
                        <span>Usage</span>
                        <span>{apiUsage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.7)]"
                          style={{ width: `${apiUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
            <h2 className="text-xl font-black italic text-white">인증 구조</h2>

            <div className="mt-6 space-y-4">
              {[
                "Google Login → Supabase Auth",
                "Drive / Docs / Sheets / Calendar → OAuth",
                "Analytics / Search Console → OAuth",
                "YouTube Data API → API Key",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-zinc-400"
                >
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7 shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 text-yellow-400" size={22} />
              <div>
                <h2 className="text-lg font-black italic text-yellow-300">
                  보안 체크
                </h2>
                <p className="mt-2 text-sm leading-7 text-yellow-100/70">
                  YouTube API Key는 웹사이트 제한과 API 제한을 유지하세요.
                  OAuth Client Secret은 절대 프론트 코드에 노출하면 안 됩니다.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mb-10 rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
        <h2 className="text-xl font-black italic text-white">API 사용량 분석</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {usageCards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-black italic text-white">
                {item.value}
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${item.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            앞으로 만들 기능
          </h2>

          <div className="mt-6 grid gap-3">
            {roadmap.map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-xs font-black text-blue-400">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-zinc-300">
                    {item}
                  </span>
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  Planned
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            사용자 Google 연결 관리
          </h2>

          <div className="mt-6 space-y-4">
            {[
              {
                label: "Google 계정 로그인 사용자",
                value: loading ? "-" : status?.googleUsers ?? 0,
                icon: Users,
              },
              {
                label: "Drive 권한 연결 사용자",
                value: "-",
                icon: SiGoogledrive,
              },
              {
                label: "Calendar 권한 연결 사용자",
                value: "-",
                icon: SiGooglecalendar,
              },
              {
                label: "Search Console 연결 사용자",
                value: "-",
                icon: SiGooglesearchconsole,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                    <Icon size={18} className="text-blue-400" />
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
      </section>
    </div>
  );
}