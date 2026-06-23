"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import {
  Archive,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Folder,
  LayoutGrid,
  Library,
  ListChecks,
  Search,
  Settings,
  Sparkles,
  Target,
  Video,
  Wand2,
} from "lucide-react";

type StudioArea = "library" | "video" | "music" | "creaibox" | "planner";

type SectionConfig = {
  title: string;
  eyebrow: string;
  description: string;
  accent: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  stats: Array<{ label: string; value: string; tone: string }>;
  actions: Array<{ label: string; href: string; icon: ComponentType<{ size?: number }> }>;
  items: Array<{ title: string; type: string; status: string; meta: string }>;
  checklist: string[];
  filters: string[];
};

const accentClasses: Record<string, { box: string; text: string }> = {
  sky: { box: "border-sky-500/30 bg-sky-500/10", text: "text-sky-300" },
  teal: { box: "border-teal-500/30 bg-teal-500/10", text: "text-teal-300" },
  rose: { box: "border-rose-500/30 bg-rose-500/10", text: "text-rose-300" },
  violet: { box: "border-violet-500/30 bg-violet-500/10", text: "text-violet-300" },
  cyan: { box: "border-cyan-500/30 bg-cyan-500/10", text: "text-cyan-300" },
};

const fallbackActions = [
  { label: "스튜디오 홈", href: "/studio", icon: LayoutGrid },
  { label: "최근 작업물", href: "/studio/library/recent", icon: Clock },
  { label: "설정", href: "/studio/dashboard", icon: Settings },
];

const areaDefaults: Record<StudioArea, Omit<SectionConfig, "title">> = {
  library: {
    eyebrow: "콘텐츠 라이브러리",
    description: "콘텐츠, 프롬프트, 템플릿, 발행 상태를 한 화면에서 정리합니다.",
    accent: "sky",
    icon: Library,
    stats: [
      { label: "정리 대기", value: "24", tone: "text-sky-300" },
      { label: "발행 준비", value: "8", tone: "text-emerald-300" },
      { label: "보관함", value: "156", tone: "text-violet-300" },
    ],
    actions: [
      { label: "무료 에셋", href: "/studio/library/free-assets", icon: Archive },
      { label: "전체 콘텐츠", href: "/studio/library/all", icon: Library },
      { label: "최근 작업물", href: "/studio/library/recent", icon: Clock },
    ],
    items: [
      { title: "브랜드 블로그 초안 묶음", type: "문서", status: "정리 필요", meta: "7개 항목" },
      { title: "썸네일 후보 이미지", type: "이미지", status: "검토 중", meta: "12개 파일" },
      { title: "SEO 프롬프트 세트", type: "프롬프트", status: "사용 가능", meta: "4개 템플릿" },
    ],
    checklist: ["중복 콘텐츠 병합", "대표 썸네일 지정", "발행 채널 태그 정리"],
    filters: ["전체", "문서", "이미지", "프롬프트", "발행"],
  },
  video: {
    eyebrow: "비디오 스튜디오",
    description: "쇼츠, 자막, 템플릿, 렌더 작업을 캠페인 단위로 정리합니다.",
    accent: "teal",
    icon: Video,
    stats: [
      { label: "편집 큐", value: "6", tone: "text-teal-300" },
      { label: "자막 작업", value: "11", tone: "text-amber-300" },
      { label: "렌더 완료", value: "3", tone: "text-emerald-300" },
    ],
    actions: [
      { label: "영상 편집기", href: "/studio/video/editor", icon: Video },
      { label: "프로젝트", href: "/studio/video/projects", icon: Folder },
      { label: "렌더 관리", href: "/studio/video/render", icon: Archive },
    ],
    items: [
      { title: "15초 후킹 쇼츠", type: "쇼츠", status: "컷 편집", meta: "9:16" },
      { title: "블로그 요약 릴스", type: "릴스", status: "자막 필요", meta: "42초" },
      { title: "제품 소개 템플릿", type: "템플릿", status: "사용 가능", meta: "3 scene" },
    ],
    checklist: ["첫 3초 후킹 확인", "자막 가독성 점검", "썸네일 연결"],
    filters: ["전체", "쇼츠", "자막", "템플릿", "렌더"],
  },
  music: {
    eyebrow: "뮤직 스튜디오",
    description: "가사, 스타일 포맷, 앨범 구성, 영상 프롬프트를 하나의 릴리즈로 묶습니다.",
    accent: "rose",
    icon: Sparkles,
    stats: [
      { label: "앨범 기획", value: "5", tone: "text-rose-300" },
      { label: "가사 초안", value: "18", tone: "text-violet-300" },
      { label: "커버 후보", value: "9", tone: "text-amber-300" },
    ],
    actions: [
      { label: "AI 앨범 기획", href: "/studio/music/planning", icon: Sparkles },
      { label: "가사 & SUNO", href: "/studio/music/lyrics", icon: ListChecks },
      { label: "앨범 관리", href: "/studio/music/albums", icon: Archive },
    ],
    items: [
      { title: "새벽 드라이브 EP", type: "앨범", status: "트랙 구성", meta: "5 tracks" },
      { title: "시티팝 스타일 포맷", type: "스타일", status: "검토 중", meta: "128 BPM" },
      { title: "커버 이미지 프롬프트", type: "비주얼", status: "생성 준비", meta: "3안" },
    ],
    checklist: ["장르 태그 정리", "SUNO 프롬프트 다듬기", "유튜브 설명문 연결"],
    filters: ["전체", "앨범", "가사", "커버", "영상"],
  },
  creaibox: {
    eyebrow: "크리아이박스 글쓰기",
    description: "지식 베이스, 이미지 워크샵, 엔진 설정을 포스팅 제작 흐름에 연결합니다.",
    accent: "violet",
    icon: Wand2,
    stats: [
      { label: "지식 노트", value: "32", tone: "text-violet-300" },
      { label: "이미지 큐", value: "14", tone: "text-sky-300" },
      { label: "엔진 프로필", value: "4", tone: "text-emerald-300" },
    ],
    actions: [
      { label: "AI 글쓰기", href: "/studio/writing/creaibox/create", icon: Sparkles },
      { label: "원고 관리", href: "/studio/writing/creaibox/list", icon: Archive },
      { label: "블로그 관리", href: "/studio/writing/creaibox/blog-management", icon: Settings },
    ],
    items: [
      { title: "브랜드 보이스 지식 묶음", type: "지식", status: "활성", meta: "12 notes" },
      { title: "본문 삽입 이미지", type: "이미지", status: "생성 대기", meta: "6 prompts" },
      { title: "전문가형 글쓰기 엔진", type: "설정", status: "기본값", meta: "1,500자" },
    ],
    checklist: ["브랜드 말투 고정", "참고 자료 연결", "본문 이미지 비율 확인"],
    filters: ["전체", "지식", "이미지", "엔진", "원고"],
  },
  planner: {
    eyebrow: "AI 콘텐츠 플래너",
    description: "캘린더, 트렌드, 타겟 전략, 자동화 규칙을 캠페인 단위로 관리합니다.",
    accent: "cyan",
    icon: Target,
    stats: [
      { label: "이번 주 슬롯", value: "12", tone: "text-cyan-300" },
      { label: "트렌드 후보", value: "27", tone: "text-amber-300" },
      { label: "자동화 규칙", value: "6", tone: "text-emerald-300" },
    ],
    actions: [
      { label: "아이디어 허브", href: "/studio/content-planner/idea-hub", icon: Sparkles },
      { label: "AI 콘텐츠 기획", href: "/studio/content-planner/planning", icon: ListChecks },
      { label: "기획 라이브러리", href: "/studio/content-planner/library", icon: Library },
    ],
    items: [
      { title: "월간 브랜드 캠페인", type: "캘린더", status: "편성 중", meta: "4주" },
      { title: "상승 키워드 묶음", type: "트렌드", status: "선별", meta: "27개" },
      { title: "블로그 자동 연결", type: "워크플로우", status: "활성", meta: "3 steps" },
    ],
    checklist: ["타겟 페르소나 확인", "발행 빈도 균형", "채널별 CTA 지정"],
    filters: ["전체", "캘린더", "트렌드", "전략", "자동화"],
  },
};

const sectionOverrides: Record<string, Partial<SectionConfig>> = {
  calendar: { title: "콘텐츠 캘린더", icon: CalendarDays },
  trends: { title: "트렌드 키워드", icon: BarChart3 },
  strategy: { title: "전략 및 타겟 분석", icon: Target },
  workflow: { title: "자동화 워크플로우", icon: Sparkles },
  settings: { title: "설정", icon: Settings },
  shorts: { title: "쇼츠 & 릴스 제작" },
  prompts: { title: "프롬프트 보관함" },
  subtitle: { title: "자막 & 음성" },
  templates: { title: "템플릿 라이브러리" },
  thumbnail: { title: "썸네일 메이커" },
  projects: { title: "프로젝트 관리", icon: Folder },
  render: { title: "렌더 / 저장 관리" },
  "style-format": { title: "스타일 포맷" },
  "cover-image": { title: "커버 이미지" },
  "video-prompt": { title: "영상 프롬프트" },
  translate: { title: "번역" },
  "youtube-seo": { title: "유튜브 최적화" },
  tags: { title: "태그 관리" },
  playlist: { title: "플레이리스트" },
  history: { title: "작업 내역", icon: Clock },
  knowledge: { title: "지식 베이스" },
  image: { title: "AI 이미지 워크샵" },
  all: { title: "전체 콘텐츠" },
  naver: { title: "네이버 콘텐츠" },
  news: { title: "뉴스 콘텐츠" },
  music: { title: "음악 / 가사 콘텐츠" },
  video: { title: "비디오 콘텐츠" },
  favorites: { title: "즐겨찾기" },
  recent: { title: "최근 작업물", icon: Clock },
  drafts: { title: "임시저장" },
  published: { title: "발행 완료" },
  analytics: { title: "사용량 통계", icon: BarChart3 },
  trash: { title: "휴지통" },
};

function buildConfig(area: StudioArea, section: string, title?: string): SectionConfig {
  const base = areaDefaults[area];
  const override = sectionOverrides[section] || {};
  return {
    ...base,
    ...override,
    title: title || override.title || section || base.eyebrow,
    stats: override.stats || base.stats,
    actions: override.actions || base.actions || fallbackActions,
    items: override.items || base.items,
    checklist: override.checklist || base.checklist,
    filters: override.filters || base.filters,
  };
}

export default function StudioOperationalSectionPage({
  area,
  section,
  title,
}: {
  area: StudioArea;
  section: string;
  title?: string;
}) {
  const config = useMemo(() => buildConfig(area, section, title), [area, section, title]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(config.filters[0]);
  const Icon = config.icon;

  const visibleItems = config.items.filter((item) => {
    const matchesFilter = activeFilter === "전체" || item.type.includes(activeFilter) || item.status.includes(activeFilter);
    const matchesQuery = `${item.title} ${item.type} ${item.status} ${item.meta}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
  const accent = accentClasses[config.accent] || accentClasses.sky;

  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-8 text-zinc-100 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="flex flex-col gap-5 border-b border-zinc-900 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${accent.box}`}>
                <Icon size={20} className={accent.text} />
              </div>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${accent.text}`}>{config.eyebrow}</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-white md:text-4xl">{config.title}</h1>
              </div>
            </div>
            <p className="max-w-2xl text-sm font-medium leading-6 text-zinc-400">{config.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:min-w-[420px]">
            {config.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-[11px] font-bold text-zinc-500">{stat.label}</p>
                <p className={`mt-2 text-2xl font-black ${stat.tone}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="검색"
                  className="h-11 w-full rounded-lg border border-zinc-800 bg-black/40 pl-9 pr-3 text-sm font-semibold text-white outline-none transition focus:border-zinc-600"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter size={15} className="shrink-0 text-zinc-500" />
                {config.filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`h-9 shrink-0 rounded-lg px-3 text-xs font-black transition ${
                      activeFilter === filter
                        ? "bg-white text-black"
                        : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {visibleItems.map((item) => (
                <article key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-zinc-700">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-black text-zinc-400">{item.type}</span>
                        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-black text-emerald-300">{item.status}</span>
                      </div>
                      <h2 className="mt-3 text-lg font-black text-white">{item.title}</h2>
                      <p className="mt-1 text-sm font-medium text-zinc-500">{item.meta}</p>
                    </div>
                    <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 text-xs font-black text-zinc-300 transition hover:border-zinc-600 hover:text-white">
                      열기 <ChevronRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-5">
              <h2 className="text-sm font-black text-white">빠른 액션</h2>
              <div className="mt-4 space-y-2">
                {config.actions.map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex h-11 items-center justify-between rounded-lg border border-zinc-800 bg-black/30 px-3 text-sm font-bold text-zinc-300 transition hover:border-zinc-700 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <ActionIcon size={15} />
                        {action.label}
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-5">
              <h2 className="text-sm font-black text-white">작업 체크</h2>
              <div className="mt-4 space-y-3">
                {config.checklist.map((task, index) => (
                  <label key={task} className="flex items-center gap-3 text-sm font-semibold text-zinc-400">
                    <input type="checkbox" defaultChecked={index === 0} className="h-4 w-4 accent-white" />
                    <span>{task}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={16} />
                <h2 className="text-sm font-black">운영 상태</h2>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-zinc-400">
                화면 골격과 작업 관리 흐름이 연결되어 있습니다. 실제 저장 API가 붙으면 현재 항목 구조를 그대로 데이터 소스로 교체할 수 있습니다.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
