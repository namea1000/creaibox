"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SiGoogle,
  SiGooglesearchconsole,
  SiGoogleanalytics,
} from "react-icons/si";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Globe,
  Link2,
  ListChecks,
  RefreshCw,
  Search,
  ShieldCheck,
  Network,
} from "lucide-react";

type SeoStatus = {
  searchConsoleReady: boolean;
  sitemapActive: boolean;
  robotsActive: boolean;
  canonicalOk: boolean;
  publishedPosts: number;
  sitemapUrls: number;
  seoReadyPosts: number;
  draftPosts: number;
  canonicalMissing: number;
  metaDescriptionMissing: number;
  slugMissing: number;
  indexingCandidates: number;
  notReadyPosts: number;
  organicClicks: number | null;
  impressions: number | null;
  ctr: number | null;
  averagePosition: number | null;
};

const seoTools = [
  {
    title: "사이트맵 열기",
    href: "https://creaibox.com/sitemap.xml",
    icon: Network,
    description: "현재 생성된 sitemap.xml 확인",
  },
  {
    title: "robots.txt 열기",
    href: "https://creaibox.com/robots.txt",
    icon: ShieldCheck,
    description: "검색 엔진 크롤링 정책 확인",
  },
  {
    title: "Search Console",
    href: "https://search.google.com/search-console",
    icon: SiGooglesearchconsole,
    description: "Google Search Console 관리 화면 이동",
  },
  {
    title: "Google Rich Results",
    href: "https://search.google.com/test/rich-results",
    icon: SiGoogle,
    description: "JSON-LD 구조화 데이터 테스트",
  },
  {
    title: "PageSpeed Insights",
    href: "https://pagespeed.web.dev/",
    icon: Activity,
    description: "Core Web Vitals 및 성능 점검",
  },
  {
    title: "Google Analytics",
    href: "https://analytics.google.com/",
    icon: SiGoogleanalytics,
    description: "방문자 및 유입 데이터 확인",
  },
];

const futureFeatures = [
  "Search Console API 실데이터 연동",
  "클릭수 / 노출수 / CTR / 평균순위 대시보드",
  "상위 검색어 TOP 20 분석",
  "상위 노출 페이지 TOP 20 분석",
  "블로그 글별 색인 상태 확인",
  "발행 글 자동 revalidate",
  "발행 글 자동 sitemap 반영",
  "Google 색인 요청 자동화",
  "메타 제목 / 설명 누락 감지",
  "중복 slug / 중복 canonical 감지",
  "404 페이지 자동 탐지",
  "내부링크 부족 글 탐지",
];

function formatMetric(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("ko-KR");
}

export default function SeoAdminPage() {
  const [status, setStatus] = useState<SeoStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/seo/status", {
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("API 응답이 JSON이 아닙니다. route.ts 경로를 확인하세요.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "SEO 상태 조회 실패");
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

  const seoStatusCards = useMemo(
    () => [
      {
        label: "Search Console",
        value: loading
          ? "CHECKING"
          : status?.searchConsoleReady
            ? "READY"
            : "MISSING",
        icon: SiGooglesearchconsole,
        color: status?.searchConsoleReady
          ? "text-emerald-400"
          : "text-yellow-400",
      },
      {
        label: "Sitemap",
        value: loading
          ? "CHECKING"
          : status?.sitemapActive
            ? "ACTIVE"
            : "MISSING",
        icon: Network,
        color: status?.sitemapActive ? "text-blue-400" : "text-yellow-400",
      },
      {
        label: "Robots.txt",
        value: loading
          ? "CHECKING"
          : status?.robotsActive
            ? "ACTIVE"
            : "MISSING",
        icon: ShieldCheck,
        color: status?.robotsActive ? "text-purple-400" : "text-yellow-400",
      },
      {
        label: "Canonical",
        value: loading
          ? "CHECKING"
          : status?.canonicalOk
            ? "OK"
            : "CHECK",
        icon: Link2,
        color: status?.canonicalOk ? "text-cyan-400" : "text-yellow-400",
      },
    ],
    [loading, status]
  );

  const seoMetrics = useMemo(
    () => [
      {
        label: "Published Posts",
        value: formatMetric(status?.publishedPosts),
        description: "현재 발행된 공개 블로그 글",
        rate: Math.min((status?.publishedPosts ?? 0) * 10, 100),
      },
      {
        label: "Sitemap URLs",
        value: formatMetric(status?.sitemapUrls),
        description: "사이트맵에 포함되는 URL",
        rate: Math.min((status?.sitemapUrls ?? 0) * 8, 100),
      },
      {
        label: "SEO Ready Posts",
        value: formatMetric(status?.seoReadyPosts),
        description: "slug, canonical, description이 준비된 글",
        rate:
          status?.publishedPosts && status.publishedPosts > 0
            ? Math.round((status.seoReadyPosts / status.publishedPosts) * 100)
            : 0,
      },
      {
        label: "Need Fix",
        value: formatMetric(status?.notReadyPosts),
        description: "SEO 필수값 점검이 필요한 항목",
        rate: Math.min((status?.notReadyPosts ?? 0) * 20, 100),
      },
    ],
    [status]
  );

  const seoChecklist = useMemo(
    () => [
      {
        title: "도메인 속성 인증",
        status: "DONE",
        description: "creaibox.com 도메인 속성 Search Console 인증 완료",
      },
      {
        title: "Sitemap 제출",
        status: status?.sitemapActive ? "DONE" : "CHECK",
        description: "https://creaibox.com/sitemap.xml 제출 완료",
      },
      {
        title: "robots.txt 등록",
        status: status?.robotsActive ? "DONE" : "CHECK",
        description: "검색 엔진 크롤링 허용 및 sitemap 위치 명시",
      },
      {
        title: "Canonical URL 통일",
        status: status?.canonicalOk ? "DONE" : "CHECK",
        description: "www → non-www 기준 URL 구조 통일",
      },
      {
        title: "JSON-LD 스키마",
        status: "READY",
        description: "블로그 상세 페이지 Article 스키마 적용 준비",
      },
      {
        title: "자동 색인 요청",
        status: "PLANNED",
        description: "발행 시 Google Indexing API 또는 URL Inspection 기반 워크플로 예정",
      },
    ],
    [status]
  );

  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <SiGooglesearchconsole className="h-10 w-10 text-emerald-400" />
            SEO <span className="text-emerald-400">Control</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Search Console · Sitemap · Robots.txt · Canonical · Indexing 통합 관리
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="https://search.google.com/search-console"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Search Console
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
        {seoStatusCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[24px] border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800/80 ${card.color}`}
              >
                <Icon size={22} />
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

      <section className="mb-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-black italic text-white">
              SEO 핵심 지표
            </h2>
            <p className="mt-1 text-xs font-bold text-zinc-600">
              현재는 DB 기반 SEO 준비 상태를 표시하고, Search Console 실데이터는 다음 단계에서 연결합니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {seoMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  {metric.label}
                </p>

                <p className="mt-2 text-3xl font-black italic text-white">
                  {metric.value}
                </p>

                <p className="mt-2 text-xs font-medium text-zinc-600">
                  {metric.description}
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${metric.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            현재 SEO 구조
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "도메인 속성: creaibox.com",
              "대표 URL: https://creaibox.com",
              "Sitemap: /sitemap.xml",
              "Robots: /robots.txt",
              "Blog URL: /blog/[slug]",
              "Published 글만 sitemap 반영",
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
        </aside>
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            SEO 체크리스트
          </h2>

          <div className="mt-6 space-y-4">
            {seoChecklist.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black text-white">
                    {item.title}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${item.status === "DONE"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : item.status === "READY"
                        ? "bg-blue-500/10 text-blue-400"
                        : item.status === "CHECK"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-zinc-500/10 text-zinc-400"
                      }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium leading-6 text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            빠른 SEO 도구
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {seoTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  target="_blank"
                  className="group rounded-2xl border border-zinc-800 bg-[#080b11] p-5 transition hover:border-emerald-500/40 hover:bg-zinc-900"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-emerald-400">
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
      </section>

      <section className="mb-10 rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-yellow-400" size={22} />
          <div>
            <h2 className="text-lg font-black italic text-yellow-300">
              색인 관련 주의사항
            </h2>
            <p className="mt-2 text-sm leading-7 text-yellow-100/70">
              Sitemap에 URL이 있다고 해서 Google 색인이 즉시 완료되는 것은 아닙니다.
              Search Console에서 수집 후 Google이 품질, 중복성, 표준 URL, 내부링크,
              콘텐츠 상태를 판단해 색인을 결정합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            앞으로 만들 SEO 기능
          </h2>

          <div className="mt-6 grid gap-3">
            {futureFeatures.map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-black text-emerald-400">
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
            색인/콘텐츠 진단 항목
          </h2>

          <div className="mt-6 space-y-4">
            {[
              {
                label: "발행 글 색인 후보",
                value: formatMetric(status?.indexingCandidates),
                icon: FileSearch,
              },
              {
                label: "sitemap 포함 URL",
                value: formatMetric(status?.sitemapUrls),
                icon: Network,
              },
              {
                label: "canonical 누락 글",
                value: formatMetric(status?.canonicalMissing),
                icon: Link2,
              },
              {
                label: "SEO 설명 누락 글",
                value: formatMetric(status?.metaDescriptionMissing),
                icon: ListChecks,
              },
              {
                label: "slug 누락 글",
                value: formatMetric(status?.slugMissing),
                icon: Globe,
              },
              {
                label: "키워드 분석 필요 글",
                value: "-",
                icon: Search,
              },
              {
                label: "성과 분석 필요 글",
                value: "-",
                icon: BarChart3,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                    <Icon size={18} className="text-emerald-400" />
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