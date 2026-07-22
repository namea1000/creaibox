"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Sparkles,
  Zap,
  Download,
  RefreshCw,
  Wand2,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
  Loader2,
  PanelLeftOpen,
  ChevronDown,
  Search,
  Lightbulb,
  X,
  Flame,
  ArrowRight,
} from "lucide-react";
import { topicCategories, topicSubTopics } from "@/lib/content-planner/topic-categories";
import { ideaHubSeries } from "@/lib/content-planner/topic-series";

const mainGroups = [
  "기술 & 디지털",
  "경제 & 비즈니스",
  "생활 & 문화",
  "건강 & 라이프스타일",
  "교육 & 지식",
  "사회 & 국제",
  "법률 & 정책 & 복지",
  "환경 & 지구과학",
  "크리에이티브 & 예술",
  "산업 & 미래",
];

const groupEmojis: Record<string, string> = {
  "기술 & 디지털": "💻",
  "경제 & 비즈니스": "💼",
  "생활 & 문화": "☕",
  "건강 & 라이프스타일": "🧘",
  "교육 & 지식": "🎓",
  "사회 & 국제": "🌏",
  "법률 & 정책 & 복지": "⚖️",
  "환경 & 지구과학": "🌱",
  "크리에이티브 & 예술": "🎨",
  "산업 & 미래": "🏭",
};


interface CreaiboxAiWritingPanelProps {
  // Tabs
  activeAiTab: "write" | "recreate" | "pdf";
  setActiveAiTab: (tab: "write" | "recreate" | "pdf") => void;
  isListSidebarCollapsed?: boolean;
  onToggleListSidebar?: () => void;

  // States
  aiTargetKeyword: string;
  setAiTargetKeyword: (v: string) => void;
  aiContentType: string;
  setAiContentType: (v: string) => void;
  aiPostType: string;
  setAiPostType: (v: string) => void;
  aiSelectedTone: string;
  setAiSelectedTone: (v: string) => void;
  aiWordCountGoal: string;
  setAiWordCountGoal: (v: string) => void;
  aiStrategyLevel: string;
  setAiStrategyLevel: (v: string) => void;
  aiResultFormat: string;
  setAiResultFormat: (v: string) => void;
  aiLargeCategory: string;
  setAiLargeCategory: (v: string) => void;
  aiMainTopic: string;
  setAiMainTopic: (v: string) => void;
  aiSubTopic: string;
  setAiSubTopic: (v: string) => void;
  aiReferenceNote: string;
  setAiReferenceNote: (v: string) => void;
  aiUseSearch: boolean;
  setAiUseSearch: (v: boolean) => void;

  // Recreate state
  recreateUrl: string;
  setRecreateUrl: (v: string) => void;

  // PDF states
  pdfFile: File | null;
  setPdfFile: (f: File | null) => void;
  pdfFileName: string;
  setPdfFileName: (n: string) => void;
  isPdfDragging: boolean;
  setIsPdfDragging: (b: boolean) => void;

  // Statuses
  isAiGenerating: boolean;
  isFetchingOriginal: boolean;
  isRecreating: boolean;
  isPdfExtracting: boolean;
  aiStatusMessage: string;
  aiErrorMessage: string;

  // Action Triggers
  onGenerate: () => void;
  onFetchOriginalText: () => void;
  onStartRecreation: () => void;
  onPdfExtract: () => void;
  onStartPdfRecreation: () => void;
}

const postTypeOptions = [
  { label: "① 인사이트 & 트렌드", disabled: true },
  { label: "🤖 AI 자동 포스팅", disabled: false },
  { label: "🧠 AI 인사이트 포스팅", disabled: false },
  { label: "📈 트렌드 브리프", disabled: false },
  { label: "📊 시장/기술 분석 리포트", disabled: false },
  { label: "📰 최신 뉴스 및 이슈", disabled: false },
  { label: "📌 오늘의 주요 이슈 정리", disabled: false },

  { label: "② 정보성 콘텐츠", disabled: true },
  { label: "ℹ️ 일반 정보성", disabled: false },
  { label: "💵 생활 정책 및 정부 지원금", disabled: false },
  { label: "🥗 건강 정보 및 영양제 분석", disabled: false },
  { label: "💳 보험/대출/카드 정보", disabled: false },
  { label: "🏠 부동산 정보", disabled: false },

  { label: "③ 금융 & 비즈니스", disabled: true },
  { label: "💰 금융 및 재테크", disabled: false },
  { label: "📈 주식/재테크 분석", disabled: false },
  { label: "🏢 기업 정보 및 주식 정보", disabled: false },
  { label: "🚀 비즈니스/창업 정보", disabled: false },

  { label: "④ 브랜드 & 퍼블리싱", disabled: true },
  { label: "📖 브랜드 스토리 포스팅", disabled: false },
  { label: "📢 서비스 소개형 포스팅", disabled: false },
  { label: "🏢 기업 소개 및 서비스 안내", disabled: false },
  { label: "✉️ 뉴스레터형 콘텐츠", disabled: false },

  { label: "⑤ 도구 & 사용법", disabled: true },
  { label: "📱 앱 설치 및 상세 가이드", disabled: false },
  { label: "🤖 AI 툴 및 웹 서비스 가이드", disabled: false },
  { label: "⚙️ 유틸리티 설치/사용 방법", disabled: false },
  { label: "🔗 바로가기 버튼 생성", disabled: false },
];

const getContentTypeEmoji = (type: string) => {
  const map: Record<string, string> = {
    "멀티 플랫폼 콘텐츠 기획": "🎯",
    "블로그 글쓰기 콘텐츠": "📝",
    "유튜브 쇼츠 기획": "🎬",
    "유튜브 롱폼 기획": "📹",
    "틱톡 숏폼 기획": "🎵",
    "네이버 클립 기획": "🎞️",
    "인스타그램 릴스 기획": "📸",
    "SNS 카드뉴스 기획": "🖼️",
    "뉴스레터 기획": "✉️",
    "브랜드 캠페인 기획": "🏢",
  };
  return map[type] || "📝";
};

export default function CreaiboxAiWritingPanel({
  activeAiTab,
  setActiveAiTab,
  isListSidebarCollapsed = false,
  onToggleListSidebar,
  aiTargetKeyword,
  setAiTargetKeyword,
  aiContentType,
  setAiContentType,
  aiPostType,
  setAiPostType,
  aiSelectedTone,
  setAiSelectedTone,
  aiWordCountGoal,
  setAiWordCountGoal,
  aiStrategyLevel,
  setAiStrategyLevel,
  aiResultFormat,
  setAiResultFormat,
  aiLargeCategory,
  setAiLargeCategory,
  aiMainTopic,
  setAiMainTopic,
  aiSubTopic,
  setAiSubTopic,
  aiReferenceNote,
  setAiReferenceNote,
  aiUseSearch,
  setAiUseSearch,
  recreateUrl,
  setRecreateUrl,
  pdfFile,
  setPdfFile,
  pdfFileName,
  setPdfFileName,
  isPdfDragging,
  setIsPdfDragging,
  isAiGenerating,
  isFetchingOriginal,
  isRecreating,
  isPdfExtracting,
  aiStatusMessage,
  aiErrorMessage,
  onGenerate,
  onFetchOriginalText,
  onStartRecreation,
  onPdfExtract,
  onStartPdfRecreation,
}: CreaiboxAiWritingPanelProps) {
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const [isPostTypeOpen, setIsPostTypeOpen] = useState(false);
  const postTypeDropdownRef = useRef<HTMLDivElement>(null);
  const [isCustomSubTopic, setIsCustomSubTopic] = useState(false);
  const [isCustomKeyword, setIsCustomKeyword] = useState(false);

  // 🌟 콘텐츠 아이디어 허브 통합 검색 및 모달 상태
  const [ideaSearchQuery, setIdeaSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isIdeaHubModalOpen, setIsIdeaHubModalOpen] = useState(false);
  const [modalGroupFilter, setModalGroupFilter] = useState("ALL");
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (postTypeDropdownRef.current && !postTypeDropdownRef.current.contains(event.target as Node)) {
        setIsPostTypeOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 💡 선택된 검색 결과 항목을 대분류 / 상세분야 / 추천시리즈 / 타겟키워드에 한 번에 적용
  const handleSelectIdeaItem = (item: {
    largeGroup: string;
    categoryName: string;
    subTopicName: string;
    title: string;
  }) => {
    setIsCustomSubTopic(false);
    setIsCustomKeyword(false);
    setAiLargeCategory(item.largeGroup);
    setAiMainTopic(item.categoryName);
    setAiSubTopic(item.subTopicName);
    setAiTargetKeyword(item.title);
    setIdeaSearchQuery("");
    setIsSearchDropdownOpen(false);
    setIsIdeaHubModalOpen(false);
  };

  // 인라인 실시간 검색 결과 (2,189개 시리즈 + 11,148개 키워드 자동 필터링)
  const searchResults = useMemo(() => {
    const query = ideaSearchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: Array<{
      id: string;
      title: string;
      subTopicName: string;
      categoryName: string;
      largeGroup: string;
      emoji: string;
    }> = [];

    for (const idea of ideaHubSeries) {
      if (
        idea.title.toLowerCase().includes(query) ||
        (idea.tags && idea.tags.some((t) => t.toLowerCase().includes(query)))
      ) {
        const sub = topicSubTopics.find((s) => s.id === idea.subTopicId);
        const cat = topicCategories.find((c) => c.id === (sub?.categoryId || idea.categoryId));
        if (cat) {
          results.push({
            id: idea.id,
            title: idea.title,
            subTopicName: sub?.name || "",
            categoryName: cat.name,
            largeGroup: cat.group,
            emoji: cat.emoji || "✨",
          });
        }
        if (results.length >= 25) break;
      }
    }

    if (results.length < 15) {
      for (const sub of topicSubTopics) {
        if (
          sub.name.toLowerCase().includes(query) ||
          (sub.keywords && sub.keywords.some((k) => k.toLowerCase().includes(query)))
        ) {
          const cat = topicCategories.find((c) => c.id === sub.categoryId);
          if (cat) {
            const idea = ideaHubSeries.find((i) => i.subTopicId === sub.id);
            const title = idea ? idea.title : sub.name;
            if (!results.some((r) => r.title === title)) {
              results.push({
                id: sub.id,
                title,
                subTopicName: sub.name,
                categoryName: cat.name,
                largeGroup: cat.group,
                emoji: cat.emoji || "⚡",
              });
            }
          }
          if (results.length >= 25) break;
        }
      }
    }

    return results;
  }, [ideaSearchQuery]);

  // 대형 모달 내 검색/필터링 결과
  const modalFilteredResults = useMemo(() => {
    const query = modalSearchQuery.trim().toLowerCase();
    const list: Array<{
      id: string;
      title: string;
      subTopicName: string;
      categoryName: string;
      largeGroup: string;
      emoji: string;
    }> = [];

    for (const idea of ideaHubSeries) {
      const sub = topicSubTopics.find((s) => s.id === idea.subTopicId);
      const cat = topicCategories.find((c) => c.id === (sub?.categoryId || idea.categoryId));
      if (!cat) continue;

      if (modalGroupFilter !== "ALL" && cat.group !== modalGroupFilter) {
        continue;
      }

      if (
        !query ||
        idea.title.toLowerCase().includes(query) ||
        sub?.name.toLowerCase().includes(query) ||
        cat.name.toLowerCase().includes(query) ||
        (idea.tags && idea.tags.some((t) => t.toLowerCase().includes(query)))
      ) {
        list.push({
          id: idea.id,
          title: idea.title,
          subTopicName: sub?.name || "",
          categoryName: cat.name,
          largeGroup: cat.group,
          emoji: cat.emoji || "✨",
        });
      }
      if (list.length >= 60) break;
    }

    return list;
  }, [modalGroupFilter, modalSearchQuery]);

  // Drag and drop handlers for PDF
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPdfDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setPdfFile(file);
        setPdfFileName(file.name);
      } else {
        alert("PDF 파일만 업로드할 수 있습니다.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f15] text-zinc-300 select-none">
      {/* 1. Header */}
      <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#0d1017] px-4">
        {/* Left slot for collapse/expand button */}
        <div className="w-16 flex items-center justify-start">
          {isListSidebarCollapsed && onToggleListSidebar && (
            <button
              type="button"
              onClick={onToggleListSidebar}
              className="flex h-7 items-center gap-1 px-2 rounded-lg border border-zinc-800 bg-[#0e111a] text-zinc-400 hover:border-violet-500/50 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
              title="목록 펼치기"
            >
              <PanelLeftOpen size={13} />
              <span className="text-[10px] font-black">목록</span>
            </button>
          )}
        </div>

        {/* Center title with same font style as editor title */}
        <div className="flex-1 text-center flex items-center justify-center">
          <span className="truncate text-[0.78rem] font-black uppercase tracking-[0.24em] text-zinc-300">
            AI 자동 글쓰기 및 재창조
          </span>
        </div>

        {/* Right slot spacer for perfect balancing */}
        <div className="w-16" />
      </div>

      {/* 2. Tabs */}
      <div className="sticky top-14 z-20 grid h-14 shrink-0 grid-cols-3 border-b border-white/10 bg-[#0b0f15]">
        {[
          { key: "write", label: "새글 쓰기" },
          { key: "recreate", label: "URL 원문 재창조" },
          { key: "pdf", label: "PDF 원문추출" },
        ].map((tab) => {
          const active = activeAiTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveAiTab(tab.key as any)}
              className={`relative border-r border-white/10 text-center px-1 text-sm font-black transition last:border-r-0 ${
                active
                  ? "bg-violet-500/8 text-violet-200"
                  : "text-white/45 hover:bg-white/[0.025] hover:text-violet-100"
              }`}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        {/* 새글 쓰기 탭 */}
        {activeAiTab === "write" && (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">1. 콘텐츠 유형</label>
              <select
                value={aiContentType}
                onChange={(e) => setAiContentType(e.target.value)}
                disabled={isAiGenerating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  "멀티 플랫폼 콘텐츠 기획",
                  "블로그 글쓰기 콘텐츠",
                  "유튜브 쇼츠 기획",
                  "유튜브 롱폼 기획",
                  "틱톡 숏폼 기획",
                  "네이버 클립 기획",
                  "인스타그램 릴스 기획",
                  "SNS 카드뉴스 기획",
                  "뉴스레터 기획",
                  "브랜드 캠페인 기획",
                ].map((item) => (
                  <option key={item} value={item} className="bg-[#161a23]">
                    {getContentTypeEmoji(item)} {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">2. 포스트 타입</label>
              <div className="relative w-full" ref={postTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsPostTypeOpen(!isPostTypeOpen)}
                  disabled={isAiGenerating}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-800 bg-[#161a23] px-3.5 text-xs text-zinc-300 outline-none focus:border-violet-500 font-bold cursor-pointer"
                >
                  <span className="truncate">{aiPostType || "선택해 주세요"}</span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 shrink-0 ml-1 ${isPostTypeOpen ? "rotate-180" : ""}`} />
                </button>

                {isPostTypeOpen && (
                  <div className="absolute left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-[#121214] p-2 shadow-2xl custom-scrollbar">
                    {postTypeOptions.map((item) => {
                      if (item.disabled) {
                        return (
                          <div
                            key={item.label}
                            className="px-3 py-1.5 text-[10px] font-black text-violet-400 border-b border-zinc-800 mt-2 first:mt-0 bg-zinc-900/40 rounded-md"
                          >
                            {item.label}
                          </div>
                        );
                      }

                      const isSelected = aiPostType === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setAiPostType(item.label);
                            setIsPostTypeOpen(false);
                          }}
                          className={`flex w-full items-center px-4 py-2.5 text-left text-xs transition duration-150 rounded-lg mt-0.5 first:mt-0 cursor-pointer ${
                            isSelected
                              ? "bg-violet-500/20 text-violet-200 font-bold"
                              : "text-zinc-300 hover:bg-[#161a23] hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">3. 말투 선택</label>
              <select
                value={aiSelectedTone}
                onChange={(e) => setAiSelectedTone(e.target.value)}
                disabled={isAiGenerating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
                  "✍️ 친근하고 명확한 실무 설명 (가이드형 포스팅)",
                  "📢 브랜드 중심의 신뢰형 설명 (서비스 소개형)",
                  "📈 인사이트 리포트형 톤 (트렌드 분석)",
                  "✉️ 가볍고 설득력 있는 뉴스레터형 톤",
                ].map((tone) => (
                  <option key={tone} value={tone} className="bg-[#161a23]">
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">4. 목표 글자수</label>
              <select
                value={aiWordCountGoal}
                onChange={(e) => setAiWordCountGoal(e.target.value)}
                disabled={isAiGenerating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  { value: "800", label: "📰 짧게 (약 800자)" },
                  { value: "1500", label: "✍️ 보통 (약 1,500자)" },
                  { value: "3000", label: "🚀 길게 (약 3,000자)" },
                  { value: "5000", label: "📚 아주 길게 (약 5,000자)" },
                  { value: "8000", label: "💰 초장문 (약 8,000자)" },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#161a23]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">5. 전략 수준</label>
              <select
                value={aiStrategyLevel}
                onChange={(e) => setAiStrategyLevel(e.target.value)}
                disabled={isAiGenerating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)",
                  "2. 고급 전략(검색 엔진 최적화 및 사용자 타겟 분석)",
                  "3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)",
                ].map((item) => (
                  <option key={item} value={item} className="bg-[#161a23]">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">6. 결과 구성</label>
              <select
                value={aiResultFormat}
                onChange={(e) => setAiResultFormat(e.target.value)}
                disabled={isAiGenerating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)",
                  "2. 기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상",
                  "3. 2번 + 발행 순서 및 최적의 배포 타이밍 구성",
                ].map((item) => (
                  <option key={item} value={item} className="bg-[#161a23]">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔍 콘텐츠 아이디어 / 키워드 통합 검색 바 */}
            <div className="relative mb-2 flex flex-col gap-1.5 p-3 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-purple-950/40 border border-violet-500/30 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black text-violet-300">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                  아이디어 Hub 키워드 검색
                </span>
                <button
                  type="button"
                  onClick={() => setIsIdeaHubModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-violet-300 hover:text-white transition bg-violet-500/20 hover:bg-violet-500/40 px-2.5 py-1 rounded-lg border border-violet-500/30 cursor-pointer shadow-sm"
                >
                  <Lightbulb className="h-3 w-3 text-amber-300 animate-pulse" />
                  아이디어 허브 팝업
                </button>
              </div>

              <div className="relative flex items-center w-full mt-1">
                <Search className="absolute left-3 h-3.5 w-3.5 text-violet-400 pointer-events-none" />
                <input
                  type="text"
                  value={ideaSearchQuery}
                  onChange={(e) => {
                    setIdeaSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  placeholder="주제/키워드 검색 (예: 삼성전자, AI, 부업...)"
                  className="w-full bg-[#11141c] border border-violet-500/30 text-white text-xs pl-8 pr-7 py-2 rounded-xl font-bold focus:outline-none focus:border-violet-400 placeholder:text-zinc-500"
                />
                {ideaSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setIdeaSearchQuery("");
                      setIsSearchDropdownOpen(false);
                    }}
                    className="absolute right-2.5 text-zinc-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 드롭다운 실시간 연관 검색 결과 */}
              {isSearchDropdownOpen && ideaSearchQuery.trim() !== "" && (
                <div
                  ref={searchDropdownRef}
                  className="absolute left-0 right-0 top-full mt-1 z-50 max-h-64 overflow-y-auto rounded-xl border border-violet-500/40 bg-[#0d1017] shadow-2xl p-1.5 custom-scrollbar"
                >
                  {searchResults.length === 0 ? (
                    <div className="p-3 text-center text-xs font-semibold text-zinc-400">
                      검색 결과가 없습니다. (직접 입력 가능)
                    </div>
                  ) : (
                    searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectIdeaItem(item)}
                        className="w-full text-left p-2 rounded-lg hover:bg-violet-600/20 transition flex flex-col gap-0.5 border-b border-zinc-800/40 last:border-0 cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-white group-hover:text-violet-200">
                          <span>{item.emoji}</span>
                          <span className="truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 group-hover:text-violet-300">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300">{item.largeGroup}</span>
                          <span>›</span>
                          <span>{item.categoryName}</span>
                          <span>›</span>
                          <span className="truncate">{item.subTopicName}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">7. 대분류</label>
              <select
                value={aiLargeCategory}
                onChange={(e) => {
                  const newGroup = e.target.value;
                  setAiLargeCategory(newGroup);
                  setIsCustomSubTopic(false);
                  setIsCustomKeyword(false);

                  const firstCat = topicCategories.find((c) => c.group === newGroup);
                  if (firstCat) {
                    setAiMainTopic(firstCat.name);
                    const firstSub = topicSubTopics.find((s) => s.categoryId === firstCat.id);
                    if (firstSub) {
                      setAiSubTopic(firstSub.name);
                      const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === firstSub.id);
                      setAiTargetKeyword(firstIdea ? firstIdea.title : "");
                    } else {
                      setAiSubTopic("");
                      setAiTargetKeyword("");
                    }
                  } else {
                    setAiMainTopic("");
                    setAiSubTopic("");
                    setAiTargetKeyword("");
                  }
                }}
                disabled={isAiGenerating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" className="bg-[#161a23]">대분류 선택</option>
                {mainGroups.map((group) => (
                  <option key={group} value={group} className="bg-[#161a23]">
                    {groupEmojis[group] || "📁"} {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">8. 상세 분야</label>
              <select
                value={aiMainTopic}
                onChange={(e) => {
                  const newTopicName = e.target.value;
                  setAiMainTopic(newTopicName);
                  setIsCustomSubTopic(false);
                  setIsCustomKeyword(false);

                  const cat = topicCategories.find((c) => c.name === newTopicName);
                  if (cat) {
                    const firstSub = topicSubTopics.find((s) => s.categoryId === cat.id);
                    if (firstSub) {
                      setAiSubTopic(firstSub.name);
                      const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === firstSub.id);
                      setAiTargetKeyword(firstIdea ? firstIdea.title : "");
                    } else {
                      setAiSubTopic("");
                      setAiTargetKeyword("");
                    }
                  } else {
                    setAiSubTopic("");
                    setAiTargetKeyword("");
                  }
                }}
                disabled={isAiGenerating || !aiLargeCategory}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-[#161a23]">
                  {aiLargeCategory ? "상세 분야 선택" : "대분류를 먼저 선택해 주세요"}
                </option>
                {topicCategories
                  .filter((cat) => cat.group === aiLargeCategory)
                  .map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-[#161a23]">
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
              <label className="text-[11px] font-black text-zinc-400 select-none whitespace-nowrap">9. 추천 시리즈</label>
              {(() => {
                const currentCategory = topicCategories.find((c) => c.name === aiMainTopic);
                const filteredSubTopics = currentCategory
                  ? topicSubTopics.filter((sub) => sub.categoryId === currentCategory.id)
                  : [];

                const isPresetSubTopic = filteredSubTopics.some((sub) => sub.name === aiSubTopic);
                const showCustomSubTopic = isCustomSubTopic || (aiSubTopic !== "" && !isPresetSubTopic);

                if (showCustomSubTopic) {
                  return (
                    <div className="relative flex items-center w-full">
                      <input
                        value={aiSubTopic}
                        onChange={(e) => {
                          setAiSubTopic(e.target.value);
                          setAiTargetKeyword("");
                        }}
                        disabled={isAiGenerating}
                        placeholder="추천 시리즈 직접 입력"
                        className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs pl-3 pr-16 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomSubTopic(false);
                          const firstSub = filteredSubTopics[0];
                          if (firstSub) {
                            setAiSubTopic(firstSub.name);
                            const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === firstSub.id);
                            setAiTargetKeyword(firstIdea ? firstIdea.title : "");
                          } else {
                            setAiSubTopic("");
                            setAiTargetKeyword("");
                          }
                        }}
                        className="absolute right-3 text-violet-400 hover:text-violet-300 text-xs font-bold cursor-pointer"
                      >
                        목록 선택
                      </button>
                    </div>
                  );
                }

                return (
                  <select
                    value={aiSubTopic}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__custom__") {
                        setIsCustomSubTopic(true);
                        setAiSubTopic("");
                        setAiTargetKeyword("");
                      } else {
                        setAiSubTopic(val);
                        const sub = topicSubTopics.find((s) => s.name === val);
                        if (sub) {
                          const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === sub.id);
                          setAiTargetKeyword(firstIdea ? firstIdea.title : "");
                        } else {
                          setAiTargetKeyword("");
                        }
                      }
                    }}
                    disabled={isAiGenerating || !aiMainTopic}
                    className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#161a23]">
                      {aiMainTopic ? "추천 시리즈 선택" : "상세 분야를 먼저 선택해 주세요"}
                    </option>
                    {filteredSubTopics.map((sub) => (
                      <option key={sub.id} value={sub.name} className="bg-[#161a23]">
                        ⚡ {sub.name}
                      </option>
                    ))}
                    {aiMainTopic && (
                      <option value="__custom__" className="bg-[#161a23]">
                        📝 직접 입력...
                      </option>
                    )}
                  </select>
                );
              })()}
            </div>

            {/* 10. 타겟 키워드 (2줄 배치) */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-black text-zinc-400 select-none">10. 타겟 키워드</label>
              {(() => {
                const currentSubTopic = topicSubTopics.find((s) => s.name === aiSubTopic);
                const filteredIdeas = currentSubTopic
                  ? ideaHubSeries.filter((idea) => idea.subTopicId === currentSubTopic.id)
                  : [];

                const isPresetKeyword = filteredIdeas.some((idea) => idea.title === aiTargetKeyword);
                const showCustomInput = isCustomKeyword || (aiTargetKeyword !== "" && !isPresetKeyword);

                if (showCustomInput) {
                  return (
                    <div className="relative flex items-center w-full">
                      <input
                        value={aiTargetKeyword}
                        onChange={(e) => setAiTargetKeyword(e.target.value)}
                        disabled={isAiGenerating}
                        placeholder="집중적으로 공략할 키워드 입력"
                        className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs pl-3 pr-16 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomKeyword(false);
                          const firstIdea = filteredIdeas[0];
                          setAiTargetKeyword(firstIdea ? firstIdea.title : "");
                        }}
                        className="absolute right-3 text-violet-400 hover:text-violet-300 text-xs font-bold cursor-pointer"
                      >
                        목록 선택
                      </button>
                    </div>
                  );
                }

                return (
                  <select
                    value={aiTargetKeyword}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__custom__") {
                        setIsCustomKeyword(true);
                        setAiTargetKeyword("");
                      } else {
                        setAiTargetKeyword(val);
                      }
                    }}
                    disabled={isAiGenerating || !aiSubTopic}
                    className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#161a23]">
                      {aiSubTopic ? "타겟 키워드 선택" : "추천 시리즈를 먼저 선택해 주세요"}
                    </option>
                    {aiSubTopic && (
                      <option value="__custom__" className="bg-[#161a23]">
                        📝 직접 입력...
                      </option>
                    )}
                    {filteredIdeas.map((idea) => (
                      <option key={idea.id} value={idea.title} className="bg-[#161a23]">
                        ✨ {idea.title}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>

            {/* 11. 참고 사항 (2줄 배치) */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-black text-zinc-400 select-none">11. 참고 사항</label>
              <textarea
                placeholder="추가 지시사항이나 참고할 내용을 기술해 주세요"
                value={aiReferenceNote}
                onChange={(e) => setAiReferenceNote(e.target.value)}
                disabled={isAiGenerating}
                className="w-full min-h-[70px] bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none resize-none"
              />
            </div>

            {/* 12. 특정 키워드로 글쓰기 (자유 키워드 직접 입력) */}
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-violet-400 select-none flex items-center gap-1">
                  <Sparkles size={12} className="text-violet-400" />
                  <span>12. 특정 키워드로 글쓰기 (자유 입력)</span>
                </label>
                <span className="text-[10px] font-bold text-zinc-500">
                  * 직접 입력 시 7~10번 대신 적용
                </span>
              </div>
              <input
                type="text"
                placeholder="원하시는 타겟 키워드를 직접 입력하세요 (예: 삼성전자 주가 전망, 캠핑용품 추천...)"
                value={aiTargetKeyword}
                onChange={(e) => setAiTargetKeyword(e.target.value)}
                disabled={isAiGenerating}
                className="w-full bg-[#161a23] border border-violet-500/40 text-white text-xs px-3.5 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-500/50 outline-none placeholder:text-zinc-600 transition"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="aiUseSearch"
                checked={aiUseSearch}
                onChange={(e) => setAiUseSearch(e.target.checked)}
                disabled={isAiGenerating}
                className="rounded bg-zinc-900 border border-zinc-800 text-violet-500 focus:ring-violet-500/50 h-3.5 w-3.5 cursor-pointer"
              />
              <label htmlFor="aiUseSearch" className="text-xs font-bold text-zinc-400 cursor-pointer select-none">
                인터넷 실시간 검색 반영 (Google Search)
              </label>
            </div>

            {/* AI 상태 메시지 */}
            {isAiGenerating && (
              <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-3 flex items-start gap-2.5">
                <Loader2 className="text-violet-400 shrink-0 mt-0.5 animate-spin" size={15} />
                <div className="text-[11px] font-bold leading-normal text-violet-200">
                  {aiStatusMessage || "글 작성을 준비하고 있습니다..."}
                </div>
              </div>
            )}

            {aiErrorMessage && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 flex items-start gap-2.5">
                <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={15} />
                <div className="text-[11px] font-bold leading-normal text-rose-300">
                  {aiErrorMessage}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onGenerate}
              disabled={isAiGenerating || !aiTargetKeyword.trim()}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-black text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(124,58,237,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAiGenerating ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>AI 글 생성 진행 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>AI 콘텐츠 생성 시작</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* URL 원문 재창조 탭 */}
        {activeAiTab === "recreate" && (
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black text-zinc-400 mb-1.5">가져올 글의 URL 주소</label>
              <input
                type="text"
                placeholder="네이버 블로그, 뉴스 기사 등 URL 입력"
                value={recreateUrl}
                onChange={(e) => setRecreateUrl(e.target.value)}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 mb-1.5">타겟 키워드 (선택)</label>
              <input
                type="text"
                placeholder="미입력 시 원본 분석 후 자동 선정"
                value={aiTargetKeyword}
                onChange={(e) => setAiTargetKeyword(e.target.value)}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 mb-1.5">말투 선택</label>
              <select
                value={aiSelectedTone}
                onChange={(e) => setAiSelectedTone(e.target.value)}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
                  "✍️ 친근하고 명확한 실무 설명 (가이드형 포스팅)",
                  "📢 브랜드 중심의 신뢰형 설명 (서비스 소개형)",
                  "📈 인사이트 리포트형 톤 (트렌드 분석)",
                  "✉️ 가볍고 설득력 있는 뉴스레터형 톤",
                ].map((item) => (
                  <option key={item} value={item} className="bg-[#161a23]">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 mb-1.5">목표 글자수</label>
              <select
                value={aiWordCountGoal}
                onChange={(e) => setAiWordCountGoal(e.target.value)}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  { value: "same", label: "원본과 비슷한 분량 유지" },
                  { value: "800", label: "짧게 요약 재창조 (약 800자)" },
                  { value: "1500", label: "표준 분량 재창조 (약 1,500자)" },
                  { value: "2500", label: "심층 보강 재창조 (약 2,500자)" },
                ].map((item) => (
                  <option key={item.value} value={item.value} className="bg-[#161a23]">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={onFetchOriginalText}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating || !recreateUrl.trim()}
                className="w-full h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 active:scale-[0.98] text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isFetchingOriginal ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-white" />
                    <span>본문 추출하는 중...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} className="text-white" />
                    <span>URL 원본 글 가져오기</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onStartRecreation}
                disabled={isAiGenerating || isFetchingOriginal || isRecreating || !recreateUrl.trim()}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-black text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(124,58,237,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isRecreating ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>글 재창조 진행 중...</span>
                  </>
                ) : (
                  <>
                    <Zap size={13} />
                    <span>AI 글 재창조 시작</span>
                  </>
                )}
              </button>

              {/* ⚠️ 저작권 방지 및 필수 원문 글 재창조 안내 박스 */}
              <div className="mt-3 p-4 rounded-2xl border border-amber-500/35 bg-amber-950/25 text-amber-200/90 flex flex-col gap-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-black text-amber-400">
                  <AlertTriangle size={16} className="shrink-0 text-amber-400" />
                  <span>필독: 원문 사용 및 저작권 주의 안내</span>
                </div>
                <ul className="space-y-2 list-disc list-inside text-zinc-200 font-medium text-[12.5px] leading-relaxed">
                  <li>
                    <strong className="text-amber-300 font-bold">이미지 미추출:</strong> URL 원문의 이미지는 저작권 침해 위험으로 인해 가져오지 않습니다. (필요 시 직접 사진 등록 또는 AI 이미지를 활용하세요)
                  </li>
                  <li>
                    <strong className="text-amber-300 font-bold">원문 그대로 발행 금지:</strong> 가져온 원본 글을 그대로 발행할 경우 저작권 침해 및 유사문서 제재 대상이 됩니다.
                  </li>
                  <li>
                    <strong className="text-amber-300 font-bold">글 재창조 필수:</strong> 반드시 본문을 직접 대폭 수정하시거나 위 <span className="text-violet-300 font-black">"AI 글 재창조 시작"</span> 또는 에디터 상단 툴바의 <span className="text-emerald-300 font-black">"원문 글 재창조"</span> 버튼을 클릭하여 글을 완전히 재창조한 후 발행하세요!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}


        {/* PDF 원문 추출 탭 */}
        {activeAiTab === "pdf" && (
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black text-zinc-400 mb-1.5">PDF 파일 드롭 또는 업로드</label>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-8 px-4 text-center transition-all ${
                  isPdfDragging
                    ? "bg-violet-600/10 border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                    : "bg-[#161a23] border-zinc-800"
                }`}
              >
                <FileText className="text-zinc-500" size={32} />
                <div className="space-y-1">
                  <p className="text-xs font-black text-white">
                    {pdfFileName || "이곳에 PDF 파일을 드래그 앤 드롭 하세요"}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    (참고 문서를 로드해 재창조 가능)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="text-xs font-black text-violet-300 hover:text-white transition-all bg-violet-600/20 border border-violet-500/30 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  내 컴퓨터에서 선택
                </button>
                <input
                  type="file"
                  ref={pdfInputRef}
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 mb-1.5">대표 타겟 키워드</label>
              <input
                type="text"
                placeholder="글의 집중 공략 타겟 키워드 입력"
                value={aiTargetKeyword}
                onChange={(e) => setAiTargetKeyword(e.target.value)}
                disabled={isAiGenerating || isPdfExtracting || isRecreating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 mb-1.5">말투 선택</label>
              <select
                value={aiSelectedTone}
                onChange={(e) => setAiSelectedTone(e.target.value)}
                disabled={isAiGenerating || isPdfExtracting || isRecreating}
                className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
              >
                <option value="" disabled hidden>선택하세요</option>
                {[
                  "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
                  "✍️ 친근하고 명확한 실무 설명 (가이드형 포스팅)",
                  "📢 브랜드 중심의 신뢰형 설명 (서비스 소개형)",
                  "📈 인사이트 리포트형 톤 (트렌드 분석)",
                  "✉️ 가볍고 설득력 있는 뉴스레터형 톤",
                ].map((item) => (
                  <option key={item} value={item} className="bg-[#161a23]">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={onPdfExtract}
                disabled={isPdfExtracting || isRecreating || !pdfFile}
                className="w-full h-10 rounded-xl border border-zinc-800 bg-[#0e111a] hover:bg-zinc-800 text-zinc-300 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPdfExtracting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>텍스트 추출 중...</span>
                  </>
                ) : (
                  <>
                    <Download size={13} />
                    <span>PDF 텍스트 및 이미지 추출</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onStartPdfRecreation}
                disabled={isPdfExtracting || isRecreating || !pdfFile}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-black text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(124,58,237,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isRecreating ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>글 재창조 진행 중...</span>
                  </>
                ) : (
                  <>
                    <Zap size={13} />
                    <span>AI 글 재창조 시작</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 💡 콘텐츠 아이디어 허브 대형 팝업 모달 */}
      {isIdeaHubModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl border border-violet-500/40 bg-[#0d1017] shadow-2xl text-white overflow-hidden">
            
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#161a27] to-[#10141f] px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
                  <Lightbulb className="h-5 w-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    콘텐츠 아이디어 허브
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold">
                      10개 대분류 · 55개 분야 · 2,189+ 시리즈
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    원하시는 키워드나 시리즈를 검색/탐색 후 [이 주제 적용] 버튼을 누르면 에디터 폼에 자동으로 세팅됩니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIdeaHubModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 모달 검색바 및 카테고리 필터 */}
            <div className="p-5 border-b border-zinc-800 bg-[#0f131d] space-y-3 shrink-0">
              <div className="relative flex items-center w-full">
                <Search className="absolute left-4 h-4 w-4 text-violet-400 pointer-events-none" />
                <input
                  type="text"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  placeholder="관심있는 주제, 키워드, 시리즈를 검색하세요 (예: 삼성전자, AI, 부업, 주식, 영양제...)"
                  className="w-full bg-[#161a24] border border-violet-500/30 text-white text-xs pl-11 pr-10 py-3 rounded-2xl font-bold focus:outline-none focus:border-violet-400 placeholder:text-zinc-500 shadow-inner"
                />
                {modalSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setModalSearchQuery("")}
                    className="absolute right-3.5 text-zinc-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 카테고리 그룹 필터 버튼 */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setModalGroupFilter("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                    modalGroupFilter === "ALL"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  🔥 전체 (All)
                </button>
                {mainGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setModalGroupFilter(group)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                      modalGroupFilter === group
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    {groupEmojis[group] || "📁"} {group}
                  </button>
                ))}
              </div>
            </div>

            {/* 모달 바디: 카드 Grid 목록 */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0a0d13]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modalFilteredResults.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#121622] p-4 transition hover:border-violet-500/50 hover:bg-[#161c2c] hover:shadow-xl cursor-pointer"
                    onClick={() => handleSelectIdeaItem(item)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-violet-500/10 px-2 py-0.5 text-[10px] font-black text-violet-300 border border-violet-500/20">
                          {item.emoji} {item.largeGroup}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500">
                          {item.categoryName}
                        </span>
                      </div>
                      
                      <h3 className="text-xs font-black text-white group-hover:text-violet-200 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-[11px] font-medium text-zinc-400 line-clamp-1">
                        ⚡ 시리즈: {item.subTopicName}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-violet-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                        클릭시 즉시 세팅
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectIdeaItem(item);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 text-xs font-black transition cursor-pointer shadow-md shadow-violet-600/20"
                      >
                        <span>이 주제 적용</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalFilteredResults.length === 0 && (
                <div className="py-16 text-center text-zinc-500 text-xs font-semibold">
                  검색 결과와 일치하는 키워드가 없습니다. 다른 검색어를 입력해 보세요.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
