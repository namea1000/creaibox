"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiYoutube, SiGoogle, SiGoogleanalytics } from "react-icons/si";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  FileVideo,
  Hash,
  KeyRound,
  MessageCircle,
  MousePointerClick,
  PlayCircle,
  RefreshCw,
  Search,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";

const apiStatusCards = [
  {
    label: "YouTube API Key",
    value: "READY",
    icon: KeyRound,
    color: "text-red-400",
  },
  {
    label: "API Restriction",
    value: "YouTube",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  {
    label: "Daily Quota",
    value: "-",
    icon: Activity,
    color: "text-blue-400",
  },
  {
    label: "Security",
    value: "SAFE",
    icon: SiGoogle,
    color: "text-purple-400",
  },
];

const youtubeMetrics = [
  {
    label: "Channel Subscribers",
    value: "-",
    description: "채널 구독자 수",
    icon: Users,
    color: "text-red-400",
  },
  {
    label: "Total Views",
    value: "-",
    description: "전체 조회수",
    icon: Eye,
    color: "text-blue-400",
  },
  {
    label: "Uploaded Videos",
    value: "-",
    description: "업로드 영상 수",
    icon: FileVideo,
    color: "text-purple-400",
  },
  {
    label: "Avg Engagement",
    value: "-",
    description: "평균 반응률",
    icon: ThumbsUp,
    color: "text-emerald-400",
  },
];

const analysisModules = [
  {
    title: "채널 분석",
    description: "구독자, 조회수, 업로드 수, 채널 성장률 분석",
    icon: Users,
    status: "PLANNED",
  },
  {
    title: "영상 성과 분석",
    description: "조회수, 좋아요, 댓글, 업로드일 기준 성과 비교",
    icon: PlayCircle,
    status: "PLANNED",
  },
  {
    title: "키워드 트렌드 분석",
    description: "검색 키워드별 인기 영상, 제목 패턴, 조회수 추정",
    icon: Search,
    status: "PLANNED",
  },
  {
    title: "제목 분석",
    description: "상위 영상 제목 키워드, 반복 단어, 클릭 유도 문구 분석",
    icon: Hash,
    status: "PLANNED",
  },
  {
    title: "댓글 분석",
    description: "댓글 반응, 자주 등장하는 단어, 긍정/부정 반응 분석",
    icon: MessageCircle,
    status: "PLANNED",
  },
  {
    title: "썸네일 성과 분석",
    description: "상위 영상 썸네일 구조, 색상, 문구, 얼굴/오브젝트 패턴 분석",
    icon: MousePointerClick,
    status: "PLANNED",
  },
];

const quickTools = [
  {
    title: "YouTube Data API",
    href: "https://console.cloud.google.com/apis/library/youtube.googleapis.com",
    icon: SiYoutube,
    description: "YouTube Data API v3 관리",
  },
  {
    title: "Google Cloud",
    href: "https://console.cloud.google.com/",
    icon: SiGoogle,
    description: "API Key, OAuth, 제한사항 관리",
  },
  {
    title: "YouTube Studio",
    href: "https://studio.youtube.com/",
    icon: SiYoutube,
    description: "공식 YouTube Studio 이동",
  },
  {
    title: "Analytics",
    href: "https://analytics.google.com/",
    icon: SiGoogleanalytics,
    description: "외부 유입 및 방문자 분석",
  },
];

const futureFeatures = [
  "YouTube API Key 실시간 상태 확인",
  "채널 ID 입력 후 채널 기본 정보 조회",
  "구독자 / 조회수 / 영상 수 자동 수집",
  "영상 리스트 자동 수집",
  "영상별 조회수 / 좋아요 / 댓글 수 비교",
  "상위 영상 TOP 20 분석",
  "키워드별 인기 영상 검색",
  "제목 키워드 빈도 분석",
  "썸네일 URL 자동 수집",
  "댓글 자동 수집 및 감정 분석",
  "업로드 시간대별 성과 분석",
  "경쟁 채널 비교 분석",
  "YouTube Shorts 전용 분석",
  "AI 기반 제목 추천",
  "AI 기반 썸네일 문구 추천",
];

export default function YouTubeAdminPage() {
  const [loading, setLoading] = useState(false);

  const trendRows = useMemo(
    () => [
      { label: "조회수 급상승 영상", value: "-", icon: TrendingUp },
      { label: "댓글 반응 많은 영상", value: "-", icon: MessageCircle },
      { label: "좋아요 비율 높은 영상", value: "-", icon: ThumbsUp },
      { label: "최근 업로드 영상", value: "-", icon: Clock3 },
      { label: "분석 대기 키워드", value: "-", icon: Hash },
      { label: "분석 대기 채널", value: "-", icon: Users },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <SiYoutube className="h-10 w-10 text-red-500" />
            YouTube <span className="text-red-500">Control</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            YouTube Data API · 채널 분석 · 영상 성과 · 키워드 트렌드 · 댓글 분석
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:border-red-500/40 hover:text-red-300"
          >
            YouTube API
            <ExternalLink size={14} />
          </Link>

          <button
            type="button"
            onClick={() => setLoading((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            새로고침
          </button>
        </div>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {apiStatusCards.map((card) => {
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

      <section className="mb-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-black italic text-white">
              YouTube 핵심 지표
            </h2>
            <p className="mt-1 text-xs font-bold text-zinc-600">
              현재는 분석 페이지 골격이며, YouTube Data API 연결 후 실데이터로 교체됩니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {youtubeMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 ${metric.color}`}
                  >
                    <Icon size={18} />
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    {metric.label}
                  </p>

                  <p className={`mt-2 text-3xl font-black italic ${metric.color}`}>
                    {metric.value}
                  </p>

                  <p className="mt-2 text-xs font-medium text-zinc-600">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            YouTube 분석 구조
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "API Key → 공개 영상/채널 데이터 조회",
              "OAuth → 내 채널 상세 권한 확장 가능",
              "검색 API → 키워드별 인기 영상 수집",
              "Videos API → 영상별 성과 수집",
              "CommentThreads API → 댓글 분석",
              "PlaylistItems API → 채널 업로드 영상 수집",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm font-bold text-zinc-400"
              >
                <CheckCircle2 size={16} className="text-red-400" />
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            분석 모듈
          </h2>

          <div className="mt-6 grid gap-4">
            {analysisModules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.title}
                  className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-red-400">
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-white">
                          {module.title}
                        </h3>
                        <p className="mt-1 text-xs font-medium leading-6 text-zinc-500">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-zinc-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-zinc-500">
                      {module.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            트렌드 감지 항목
          </h2>

          <div className="mt-6 space-y-4">
            {trendRows.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                    <Icon size={18} className="text-red-400" />
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

      <section className="mb-10 rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-yellow-400" size={22} />
          <div>
            <h2 className="text-lg font-black italic text-yellow-300">
              YouTube API 사용 주의사항
            </h2>
            <p className="mt-2 text-sm leading-7 text-yellow-100/70">
              YouTube Data API는 쿼리별 quota 비용이 다릅니다. 검색 API는 사용량이 빠르게 증가할 수 있으므로
              키워드 분석 기능은 캐싱, 일일 제한, 사용자별 사용량 제한을 함께 적용하는 것이 좋습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-2xl">
          <h2 className="text-xl font-black italic text-white">
            빠른 YouTube 도구
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quickTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  target="_blank"
                  className="group rounded-2xl border border-zinc-800 bg-[#080b11] p-5 transition hover:border-red-500/40 hover:bg-zinc-900"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-red-400">
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
            앞으로 만들 YouTube 기능
          </h2>

          <div className="mt-6 grid gap-3">
            {futureFeatures.map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-xs font-black text-red-400">
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
      </section>
    </div>
  );
}