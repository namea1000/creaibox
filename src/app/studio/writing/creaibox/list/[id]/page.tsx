"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowLeft, Check, ChevronDown, Globe, PanelLeftClose, PanelLeftOpen, RotateCcw, Search, Send } from "lucide-react";

function getManuscriptDomainLabel(
  manuscript: StudioManuscriptRecord,
  clientSiteBrandIds?: Set<string>
) {
  if (manuscript.canonicalUrl) {
    try {
      const url = new URL(manuscript.canonicalUrl);
      const host = url.hostname.toLowerCase();

      if (host === "creaibox.com" || host === "www.creaibox.com") {
        return "⭐ creaibox.com (공식)";
      }

      if (host.endsWith(".creaibox.com") || host.endsWith(".localhost")) {
        const sub = host.split(".")[0];
        if (sub === "creaibox" || sub === "www") {
          return "⭐ creaibox.com (공식)";
        }
        if (clientSiteBrandIds && clientSiteBrandIds.has(sub)) {
          return `🏢 ${host}`;
        }
        return `📝 ${host}`;
      }

      return `🌐 ${host}`;
    } catch {
      if (manuscript.canonicalUrl.includes("creaibox.com")) {
        const parts = manuscript.canonicalUrl.replace("https://", "").replace("http://", "").split("/");
        const domain = parts[0] || manuscript.canonicalUrl;
        if (domain.endsWith(".creaibox.com")) {
          const sub = domain.split(".")[0];
          if (clientSiteBrandIds && clientSiteBrandIds.has(sub)) {
            return `🏢 ${domain}`;
          }
          return `📝 ${domain}`;
        }
        return `🌐 ${domain}`;
      }
    }
  }
  return "📁 미지정 (미발행)";
}
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import UniversalBlogEditor from "@/components/writing/editor/UniversalBlogEditor";
import CreaiboxAnalysisTower from "@/components/writing/creaibox/tabs/CreaiboxAnalysisTower";
import CreaiboxContentImagePanel from "@/components/writing/creaibox/tabs/CreaiboxContentImagePanel";
import CreaiboxSchemaPanel from "@/components/writing/creaibox/tabs/CreaiboxSchemaPanel";
import CreaiboxSeoOptimizationPanel from "@/components/writing/creaibox/tabs/CreaiboxSeoOptimizationPanel";
import CreaiboxThumbnailPanel from "@/components/writing/creaibox/tabs/CreaiboxThumbnailPanel";
import CreaiboxAiWritingPanel from "@/components/writing/creaibox/tabs/CreaiboxAiWritingPanel";
import {
  creaiboxManuscriptKeys,
  type StudioManuscriptRecord,
  useCreaiboxManuscriptDetailQuery,
  useCreaiboxManuscriptsQuery,
} from "@/lib/queries/manuscripts";
import {
  generateGeminiContentWithFallback,
  getUserAiVaultConfig,
} from "@/lib/client/api-vault";
import { robustParseJson } from "@/lib/utils";
import {
  createContentPlannerOutput,
  updateContentPlannerItemStatus,
} from "@/lib/content-planner/supabase";

const CREAIBOX_LIST_CACHE_KEY = "creaibox:manuscripts:list:v1";

type StudioManuscriptRecordWithOptionalFields = StudioManuscriptRecord & {
  useSearch?: boolean;
};

type CreaiboxRow = Record<string, unknown>;

type PublishingPanelTab = "seo" | "thumbnail" | "contentImage" | "schema";

function buildPublicBlogSlug(title?: string, focusKeyword?: string, targetKeyword?: string) {
  const base = (focusKeyword || targetKeyword || title || "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");

  return base || `creaibox-post-${Date.now()}`;
}

const STANDARD_TONE_OPTIONS = [
  "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
  "✍️ 친근하고 명확한 실무 설명 (가이드형 포스팅)",
  "📢 브랜드 중심의 신뢰형 설명 (서비스 소개형)",
  "📈 인사이트 리포트형 톤 (트렌드 분석)",
  "✉️ 가볍고 설득력 있는 뉴스레터형 톤",
];

function cleanToneString(str: string): string {
  return str.replace(/^[^\w\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]+/u, "").trim();
}

function getToneLabel(value?: string | null): string {
  const raw = (value || "").trim();
  if (!raw) return "말투 설정 없음";

  const cleanRaw = cleanToneString(raw);
  const rawNoBracket = cleanRaw.split("(")[0].trim();

  const matched = STANDARD_TONE_OPTIONS.find((opt) => {
    if (opt === raw) return true;
    const cleanOpt = cleanToneString(opt);
    const optNoBracket = cleanOpt.split("(")[0].trim();

    if (cleanOpt === cleanRaw) return true;
    if (optNoBracket === rawNoBracket) return true;
    if (cleanOpt.startsWith(rawNoBracket) || cleanRaw.startsWith(optNoBracket)) return true;
    return false;
  });

  return matched || raw;
}

const STANDARD_TYPE_OPTIONS = [
  "🤖 AI 자동 포스팅",
  "🧠 AI 인사이트 포스팅",
  "📈 트렌드 브리프",
  "📊 시장/기술 분석 리포트",
  "📰 최신 뉴스 및 이슈",
  "📌 오늘의 주요 이슈 정리",
  "ℹ️ 일반 정보성",
  "💵 생활 정책 및 정부 지원금",
  "🥗 건강 정보 및 영양제 분석",
  "💳 보험/대출/카드 정보",
  "🏠 부동산 정보",
  "💰 금융 및 재테크",
  "📈 주식/재테크 분석",
  "🏢 기업 정보 및 주식 정보",
  "🚀 비즈니스/창업 정보",
  "📖 브랜드 스토리 포스팅",
  "📢 서비스 소개형 포스팅",
  "🏢 기업 소개 및 서비스 안내",
  "✉️ 뉴스레터형 콘텐츠",
  "📱 앱 설치 및 상세 가이드",
  "🤖 AI 툴 및 웹 서비스 가이드",
  "⚙️ 유틸리티 설치/사용 방법",
  "🔗 바로가기 버튼 생성",
  "🌐 URL 원문 재창조",
  "📝 텍스트 원문 재창조",
  "📄 PDF 원문 추출",
];

function cleanTypeString(str: string): string {
  return str.replace(/^[^\w\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]+/u, "").trim();
}

function getContentTypeLabel(manuscript: StudioManuscriptRecord): string {
  let raw = "";

  if (manuscript.sourceMode === "url") raw = "URL 원문 재창조";
  else if (manuscript.sourceMode === "text") raw = "텍스트 원문 재창조";
  else if (manuscript.sourceMode === "pdf") raw = "PDF 원문 추출";
  else if (manuscript.detailLabel && manuscript.detailLabel !== "create" && manuscript.detailLabel !== "recreate") {
    raw = manuscript.detailLabel;
  } else if (manuscript.postType === "recreate") {
    raw = "AI 재창조";
  } else {
    raw = "AI 인사이트 포스팅";
  }

  const cleanRaw = cleanTypeString(raw);

  const matched = STANDARD_TYPE_OPTIONS.find((opt) => {
    if (opt === raw) return true;
    const cleanOpt = cleanTypeString(opt);
    if (cleanOpt === cleanRaw) return true;
    if (cleanOpt.startsWith(cleanRaw) || cleanRaw.startsWith(cleanOpt)) return true;
    return false;
  });

  return matched || raw;
}

function buildCanonicalUrl(
  slug: string,
  role?: string,
  brandId?: string,
  userBrandIds?: string[],
  extraConfigs?: any,
  currentCanonical?: string
) {
  const cleanSlug = slug.trim().replace(/^\/+/, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const getDomainPrefix = (bid: string) => {
    const isPrimary = bid === brandId;
    const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
    const customDomStatus = extraConfigs?.[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
    return (customDomStatus === "APPROVED" && customDom)
      ? `https://${customDom}`
      : `https://${bid}.creaibox.com`;
  };

  // If currentCanonical exists and belongs to one of user's approved domains/brands, preserve its domain prefix
  if (currentCanonical) {
    if (role === "ADMIN" && currentCanonical.startsWith("https://creaibox.com")) {
      return cleanSlug ? `https://creaibox.com/blog/${cleanSlug}` : "https://creaibox.com/blog";
    }

    const activeBrands = Array.from(new Set([brandId, ...(userBrandIds || [])].filter(Boolean) as string[]));
    for (const bid of activeBrands) {
      const prefix = getDomainPrefix(bid);
      const subPrefix = `https://${bid}.creaibox.com`;
      if (currentCanonical.startsWith(prefix) || currentCanonical.startsWith(subPrefix)) {
        return cleanSlug ? `${prefix}/blog/${cleanSlug}` : `${prefix}/blog`;
      }
    }
  }

  // Fallback default brand
  const defaultBrand = brandId || (userBrandIds && userBrandIds[0]) || "";

  if (role === "ADMIN" && !defaultBrand) {
    return cleanSlug ? `https://creaibox.com/blog/${cleanSlug}` : "https://creaibox.com/blog";
  }
  if (defaultBrand) {
    const prefix = getDomainPrefix(defaultBrand);
    return cleanSlug ? `${prefix}/blog/${cleanSlug}` : `${prefix}/blog`;
  }
  return cleanSlug ? `https://creaibox.com/blog/${cleanSlug}` : "https://creaibox.com/blog";
}

function getLengthPrompt(wordCountGoal: string) {
  switch (wordCountGoal) {
    case "800":
      return {
        label: "📰 짧게 (약 800자)",
        instruction:
          "뉴스형 / 핵심 정보 빠른 전달. 짧은 요약, 속보, 트렌드 소개에 적합한 구조로 작성하고 군더더기 없이 핵심만 빠르게 전달하십시오.",
      };
    case "1500":
      return {
        label: "✍️ 보통 (약 1,500자)",
        instruction:
          "일반 정보성 블로그형. 가장 많이 사용하는 표준 콘텐츠 구성으로, 도입-핵심 설명-정리 흐름을 안정적으로 유지하십시오.",
      };
    case "3000":
      return {
        label: "🚀 길게 (약 3,000자)",
        instruction:
          "SEO 최적화형 / 상위 노출 공략. 검색 유입과 키워드 최적화 중심으로 소제목을 충분히 쓰고, 문단 전개를 풍부하게 구성하십시오.",
      };
    case "5000":
      return {
        label: "📚 아주 길게 (약 5,000자)",
        instruction:
          "전문 가이드형 / 심층 분석 콘텐츠. 비교, 설명, 활용법까지 자세히 정리하고 사례와 맥락 설명을 충분히 포함하십시오.",
      };
    case "8000":
      return {
        label: "💰 초장문 (약 8,000자)",
        instruction:
          "애드센스 수익형 / 체류시간 극대화. SEO + FAQ + 사례 + 확장 정보를 포함한 전문 아티클형으로 작성하고, 검색자가 오래 머무를 수 있도록 매우 촘촘하게 구성하십시오.",
      };
    default:
      return {
        label: "✍️ 보통 (약 1,500자)",
        instruction:
          "일반 정보성 블로그형으로 자연스럽고 안정적인 표준 콘텐츠 구조를 유지하십시오.",
      };
  }
}

function sanitizeGeneratedTitle(rawTitle: string, fallbackKeyword: string) {
  const cleaned = rawTitle
    .replace(/\[(.*?)AI(.*?)\]/gi, "[$1$2]")
    .replace(/\[\s*Creaibox\s+Insight\s*\]/gi, "[Creaibox Insight]")
    .replace(/\[\s*Creaibox\s+AI\s+Insight\s*\]/gi, "[Creaibox Insight]")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned || `[Creaibox Insight] ${fallbackKeyword} 핵심 분석`;
}

function stripHorizontalRules(markdown: string) {
  return markdown
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/^\s*\*\*\*+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeFocusKeyword(
  rawValue: string | undefined,
  fallbackKeyword: string,
  fallbackTitle: string
) {
  const cleaned = (rawValue || "")
    .replace(/[\[\]#*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length >= 2) return cleaned;
  if (fallbackKeyword.trim().length >= 2) return fallbackKeyword.trim();

  return fallbackTitle
    .replace(/\[[^\]]+\]/g, " ")
    .split(/[\s,:·|/]+/)
    .filter((token) => token.trim().length >= 2)
    .slice(0, 2)
    .join(" ")
    .trim();
}

function normalizeSeoTags(rawTags: unknown, focusKeyword: string) {
  const parsedTags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === "string"
      ? rawTags.split(",")
      : [];

  const cleaned = parsedTags
    .map((tag) =>
      String(tag)
        .replace(/[#\[\]]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((tag) => tag.length >= 2);

  const fallback = focusKeyword
    ? [
      focusKeyword,
      `${focusKeyword} 전망`,
      `${focusKeyword} 분석`,
      `${focusKeyword} 핵심 정리`,
      `${focusKeyword} 투자 포인트`,
    ]
    : [];

  return [...new Set(cleaned.length > 0 ? cleaned : fallback)].slice(0, 5);
}

function buildSeoSlug(title: string, focusKeyword: string) {
  const titleTokens = title
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/[^a-zA-Z0-9가-힣\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  const focusTokens = focusKeyword
    .replace(/[^a-zA-Z0-9가-힣\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  return [...new Set([...focusTokens, ...titleTokens])]
    .slice(0, 6)
    .join("-")
    .toLowerCase()
    .slice(0, 60);
}

function isHighDemandError(error: unknown) {
  const message = (error instanceof Error ? error.message : String(error || "")).toLowerCase();
  return (
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("try again later")
  );
}

function isSearchToolError(error: unknown) {
  const message = (error instanceof Error ? error.message : String(error || "")).toLowerCase();
  return (
    message.includes("googlesearch") ||
    message.includes("google_search") ||
    message.includes("search grounding") ||
    message.includes("grounding") ||
    message.includes("billing") ||
    message.includes("permission") ||
    message.includes("not enabled")
  );
}

function getFriendlyAiErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const lowerMessage = message.toLowerCase();

  if (isHighDemandError(error)) {
    return "AI 서버가 현재 혼잡합니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 자동으로 다른 모델을 시도합니다.";
  }

  if (
    lowerMessage.includes("groq") &&
    (lowerMessage.includes("tokens per minute") ||
      lowerMessage.includes("tpm") ||
      lowerMessage.includes("request too large") ||
      lowerMessage.includes("토큰 제한"))
  ) {
    return "Groq API 토큰 제한에 걸렸습니다. 글 길이를 줄이거나 /apivault에서 Gemini Tier 1 또는 다른 모델을 선택해 다시 시도해 주세요.";
  }

  if (isSearchToolError(error)) {
    return "최신 정보 검색 도구 연결에 문제가 있어 생성에 실패했습니다. 검색 옵션을 끄고 다시 시도하거나 API 키의 검색/결제 설정을 확인해 주세요.";
  }

  return "AI 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

function toTagList(value?: string[] | null) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function readCachedList(): StudioManuscriptRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(CREAIBOX_LIST_CACHE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedList(records: StudioManuscriptRecord[]) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CREAIBOX_LIST_CACHE_KEY, JSON.stringify(records));
  } catch {
    // 캐시 저장 실패는 화면 동작을 막지 않음
  }
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toNumberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeCreaiboxRecord(row: CreaiboxRow): StudioManuscriptRecord {
  const id = String(row.id ?? "");
  const content = toStringValue(row.content);
  const displayId = toNumberValue(row.display_id ?? row.displayId);
  const targetKeyword = toStringValue(row.target_keyword ?? row.targetKeyword, "일반 원고");
  const wordCountGoal = row.word_count_goal ?? row.wordCountGoal;
  const postType =
    row.post_type === "recreate" || row.postType === "recreate" ? "recreate" : "create";
  const status =
    row.status === "saved" || row.status === "published" || row.status === "trash"
      ? row.status
      : "draft";

  return {
    id,
    displayId,
    title: toStringValue(row.title, "제목 없음"),
    content,
    keyword: targetKeyword,
    targetKeyword,
    type: postType,
    postType,
    detailLabel: postType === "recreate" ? "글 재창조" : "AI 인사이트 포스팅",
    selectedTone: toStringValue(row.selected_tone ?? row.selectedTone),
    status,
    sourceMode: toStringValue(row.source_mode ?? row.sourceMode),
    createdAt: toStringValue(row.created_at ?? row.createdAt) || undefined,
    updatedAt: toStringValue(row.updated_at ?? row.updatedAt),
    slug: toStringValue(row.slug),
    metaDescription: toStringValue(row.meta_description ?? row.metaDescription),
    focusKeyword: toStringValue(row.focus_keyword ?? row.focusKeyword),
    canonicalUrl: toStringValue(row.canonical_url ?? row.canonicalUrl),
    seoTags: Array.isArray(row.seo_tags)
      ? row.seo_tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    wordCount: toNumberValue(row.word_count ?? row.wordCount) ?? content.replace(/\s+/g, "").length,
    wordCountGoal:
      typeof wordCountGoal === "string" || typeof wordCountGoal === "number"
        ? wordCountGoal
        : undefined,
    images: [],
    publishedSnapshot: row.published_snapshot || undefined,
    categoryId: toStringValue(row.category_id),
    categoryIds: Array.isArray(row.category_ids)
      ? row.category_ids.filter((id): id is string => typeof id === "string")
      : (row.category_id ? [toStringValue(row.category_id)] : []),
  };
}

export default function CreaiboxManuscriptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const manuscriptId = params?.id || "";
  const [activeRouteId, setActiveRouteId] = useState(manuscriptId);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const manuscriptListRef = useRef<HTMLDivElement | null>(null);
  const saveFeedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: queryList = [], refetch: refetchList } = useCreaiboxManuscriptsQuery();

  const [cachedList, setCachedList] = useState<StudioManuscriptRecord[]>(() => readCachedList());
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"domain" | "search">("domain");
  const [sidebarDomainFilter, setSidebarDomainFilter] = useState("all");
  const [clientSiteBrandIds, setClientSiteBrandIds] = useState<Set<string>>(new Set());
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirectLoading, setIsDirectLoading] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [isEnhancingContent, setIsEnhancingContent] = useState(false);
  const [isEnhancingToc, setIsEnhancingToc] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isChangingPostType, setIsChangingPostType] = useState(false);
  const [isApplyingSearch, setIsApplyingSearch] = useState(false);
  const [isSpinRecreating, setIsSpinRecreating] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState("");
  const [publishingPanelTab, setPublishingPanelTab] = useState<PublishingPanelTab>("seo");

  // AI 자동 글쓰기 및 재창조 패널을 위한 상태 및 변수 선언
  const [activeAiTab, setActiveAiTab] = useState<"write" | "recreate" | "pdf">("write");
  const [recreateUrl, setRecreateUrl] = useState("");
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [isRecreating, setIsRecreating] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [isPdfExtracting, setIsPdfExtracting] = useState(false);
  const [extractedPdfText, setExtractedPdfText] = useState("");
  const [isPdfDragging, setIsPdfDragging] = useState(false);

  const sidebarList = useMemo(() => {
    if (queryList.length > 0) return queryList;
    return cachedList;
  }, [cachedList, queryList]);

  const selectedFromList = useMemo(
    () =>
      sidebarList.find(
        (item) =>
          String(item.displayId) === activeRouteId || String(item.id) === activeRouteId
      ),
    [activeRouteId, sidebarList]
  );

  const cachedDetail = useMemo(() => {
    const cachedFromQuery = queryClient.getQueryData<StudioManuscriptRecord | null>(
      creaiboxManuscriptKeys.detail(activeRouteId)
    );

    if (cachedFromQuery) return cachedFromQuery;
    if (selectedFromList) return selectedFromList;

    return cachedList.find(
      (item) => String(item.displayId) === activeRouteId || String(item.id) === activeRouteId
    );
  }, [activeRouteId, cachedList, queryClient, selectedFromList]);

  const { data: detail, isLoading: isDetailLoading } = useCreaiboxManuscriptDetailQuery(
    activeRouteId,
    cachedDetail ?? selectedFromList
  );

  const [isMounted, setIsMounted] = useState(false);
  const [isListSidebarCollapsed, setIsListSidebarCollapsed] = useState(true);
  const [data, setData] = useState<StudioManuscriptRecord | null>(null);

  const updateLocalData = useCallback((patch: Partial<StudioManuscriptRecord>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
    setHasLocalEdits(true);
  }, []);

  const hasUnpublishedChanges = useMemo(() => {
    if (!data || data.status !== "published") return false;
    const snap = data.publishedSnapshot;
    if (!snap) return true;

    if ((data.title || "제목 없음") !== (snap.title || "제목 없음")) return true;
    if ((data.content || "") !== (snap.content || "")) return true;
    if ((data.slug || "") !== (snap.slug || "")) return true;
    if ((data.metaDescription || "") !== (snap.meta_description || "")) return true;
    if ((data.focusKeyword || "") !== (snap.focus_keyword || "")) return true;
    if ((data.tocEnabled ?? true) !== (snap.toc_enabled ?? true)) return true;

    const currentTags = data.seoTags || [];
    const snapTags = snap.seo_tags || [];
    if (currentTags.length !== snapTags.length) return true;
    for (let i = 0; i < currentTags.length; i++) {
      if (currentTags[i] !== snapTags[i]) return true;
    }

    const currentCats = data.categoryIds || [];
    const snapCats = snap.category_ids || [];
    if (currentCats.length !== snapCats.length) return true;
    for (let i = 0; i < currentCats.length; i++) {
      if (currentCats[i] !== snapCats[i]) return true;
    }

    return false;
  }, [data]);

  const [userRole, setUserRole] = useState<string>("");
  const [userBrandId, setUserBrandId] = useState<string>("");
  const [userBrandIds, setUserBrandIds] = useState<string[]>([]);
  const [extraConfigs, setExtraConfigs] = useState<any>(null);

  const searchParams = useSearchParams();
  const source = searchParams?.get("source");
  const keywordParam = searchParams?.get("keyword") || "";
  const titleParam = searchParams?.get("title") || "";
  const contentTypeParam = searchParams?.get("contentType") || "";
  const postTypeParam = searchParams?.get("postType") || "";
  const toneParam = searchParams?.get("selectedTone") || "";
  const wordCountParam = searchParams?.get("wordCountGoal") || "";
  const strategyLevelParam = searchParams?.get("strategyLevel") || "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)";
  const resultFormatParam = searchParams?.get("resultFormat") || "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)";
  const largeCategoryParam = searchParams?.get("largeCategory") || "";
  const mainTopicParam = searchParams?.get("mainTopic") || "";
  const subTopicParam = searchParams?.get("subTopic") || "";
  const referenceNoteParam = searchParams?.get("referenceNote") || "";
  const itemIdParam = searchParams?.get("itemId") || "";
  const campaignIdParam = searchParams?.get("campaignId") || "";

  const [aiTargetKeyword, setAiTargetKeyword] = useState(keywordParam);
  const [aiContentType, setAiContentType] = useState(contentTypeParam);
  const [aiPostType, setAiPostType] = useState(postTypeParam);
  const [aiSelectedTone, setAiSelectedTone] = useState(toneParam);
  const [aiWordCountGoal, setAiWordCountGoal] = useState(wordCountParam || "same");
  const [aiStrategyLevel, setAiStrategyLevel] = useState(strategyLevelParam);
  const [aiResultFormat, setAiResultFormat] = useState(resultFormatParam);
  const [aiLargeCategory, setAiLargeCategory] = useState(largeCategoryParam);
  const [aiMainTopic, setAiMainTopic] = useState(mainTopicParam);
  const [aiSubTopic, setAiSubTopic] = useState(subTopicParam);
  const [aiReferenceNote, setAiReferenceNote] = useState(referenceNoteParam);

  const [aiUseSearch, setAiUseSearch] = useState(false);
  const [aiItemId, setAiItemId] = useState(itemIdParam);
  const [aiCampaignId, setAiCampaignId] = useState(campaignIdParam);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const [aiErrorMessage, setAiErrorMessage] = useState("");

  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedPersonaId(localStorage.getItem("creaibox_editor_selected_persona_id"));
      setSelectedKnowledgeId(localStorage.getItem("creaibox_editor_selected_knowledge_id"));
    }
  }, []);

  const handleSelectPersona = (id: string | null) => {
    setSelectedPersonaId(id);
    if (id) {
      localStorage.setItem("creaibox_editor_selected_persona_id", id);
    } else {
      localStorage.removeItem("creaibox_editor_selected_persona_id");
    }
  };

  const handleSelectKnowledge = (id: string | null) => {
    setSelectedKnowledgeId(id);
    if (id) {
      localStorage.setItem("creaibox_editor_selected_knowledge_id", id);
    } else {
      localStorage.removeItem("creaibox_editor_selected_knowledge_id");
    }
  };

  useEffect(() => {
    if (source === "content-planner") {
      if (keywordParam) setAiTargetKeyword(keywordParam);
      if (contentTypeParam) setAiContentType(contentTypeParam);
      if (postTypeParam) setAiPostType(postTypeParam);
      if (toneParam) setAiSelectedTone(toneParam);
      if (wordCountParam) setAiWordCountGoal(wordCountParam);
      if (strategyLevelParam) setAiStrategyLevel(strategyLevelParam);
      if (resultFormatParam) setAiResultFormat(resultFormatParam);
      if (largeCategoryParam) setAiLargeCategory(largeCategoryParam);
      if (mainTopicParam) setAiMainTopic(mainTopicParam);
      if (subTopicParam) setAiSubTopic(subTopicParam);
      if (referenceNoteParam) setAiReferenceNote(referenceNoteParam);
      if (itemIdParam) setAiItemId(itemIdParam);
      if (campaignIdParam) setAiCampaignId(campaignIdParam);
    }
  }, [
    source,
    keywordParam,
    contentTypeParam,
    postTypeParam,
    toneParam,
    wordCountParam,
    strategyLevelParam,
    resultFormatParam,
    largeCategoryParam,
    mainTopicParam,
    subTopicParam,
    referenceNoteParam,
    itemIdParam,
    campaignIdParam,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const preferredProvider = localStorage.getItem("preferred_ai_provider");
      setAiUseSearch(preferredProvider === "gemini_postpay");
    }
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("role, brand_id, extra_configs")
          .eq("id", user.id)
          .single();
        if (prof?.role) setUserRole(prof.role);
        if (prof?.extra_configs) setExtraConfigs(prof.extra_configs);

        const approvedBrands: string[] = [];

        // 1. Add user-requested approved brand IDs from extra_configs first
        if (prof?.extra_configs?.brand_ids && Array.isArray(prof.extra_configs.brand_ids)) {
          prof.extra_configs.brand_ids.forEach((b: string) => {
            if (b && !approvedBrands.includes(b)) {
              approvedBrands.push(b);
            }
          });
        }

        // 2. Add prof.brand_id if not present
        if (prof?.brand_id && !approvedBrands.includes(prof.brand_id)) {
          approvedBrands.push(prof.brand_id);
        }

        // 🌟 기업용 홈페이지(client_sites)의 brand_id도 도메인 선택 목록에 추가
        const { data: clientSites } = await supabase
          .from("client_sites")
          .select("brand_id")
          .eq("profile_id", user.id);

        if (clientSites) {
          const brandSet = new Set<string>(clientSites.map((cs: any) => String(cs.brand_id || "").toLowerCase()));
          setClientSiteBrandIds(brandSet);
          clientSites.forEach((cs: any) => {
            if (cs.brand_id && !approvedBrands.includes(cs.brand_id.toLowerCase())) {
              approvedBrands.push(cs.brand_id.toLowerCase());
            }
          });
        }

        const primaryBrand = approvedBrands[0] || prof?.brand_id || "";
        setUserBrandId(primaryBrand);
        setUserBrandIds(approvedBrands);
      }
    };
    void getProfile();
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
      setIsListSidebarCollapsed(true);
    });
  }, [searchParams]);

  useEffect(() => {
    if (!isMounted) return;
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.alert("로그인을 하셔야 사용할 수 있는 메뉴입니다.");
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    };
    void checkAuth();
  }, [isMounted, pathname, router, supabase.auth]);

  useEffect(() => {
    queueMicrotask(() => {
      setActiveRouteId(manuscriptId);
    });
  }, [manuscriptId]);

  useEffect(() => {
    const cached = readCachedList();
    if (cached.length > 0) {
      queueMicrotask(() => {
        setCachedList(cached);
        queryClient.setQueryData(creaiboxManuscriptKeys.list, cached);
      });
    }
  }, [queryClient]);

  useEffect(() => {
    if (queryList.length > 0) {
      queueMicrotask(() => {
        setCachedList(queryList);
        writeCachedList(queryList);
      });
    }
  }, [queryList]);

  useEffect(() => {
    if (!cachedDetail) return;

    if (
      !data ||
      (String(data.displayId) !== activeRouteId && String(data.id) !== activeRouteId)
    ) {
      queueMicrotask(() => {
        setData(cachedDetail);
      });
    }
  }, [activeRouteId, cachedDetail, data]);

  useEffect(() => {
    if (!detail) return;

    if (!hasLocalEdits || detail.id !== data?.id) {
      queueMicrotask(() => {
        setData(detail);
        setHasLocalEdits(false);

        queryClient.setQueryData(creaiboxManuscriptKeys.detail(activeRouteId), detail);
      });
    }
  }, [activeRouteId, data?.id, detail, hasLocalEdits, queryClient]);

  // 🌟 포스트 선택 변경 시 좌측 AI 설정 폼(콘텐츠 유형, 포스트 타입, 말투 선택 등) 자동 동기화
  useEffect(() => {
    if (!data) return;
    if (data.selectedTone) {
      setAiSelectedTone(getToneLabel(data.selectedTone));
    } else {
      setAiSelectedTone("💻 전문적이고 통찰력 있는 분석 (기술 블로그)");
    }
    if (data.targetKeyword && data.targetKeyword !== "일반 원고") {
      setAiTargetKeyword(data.targetKeyword);
    }
    setAiPostType(getContentTypeLabel(data));
    if (data.sourceMode === "url") {
      setAiContentType("URL 원문 재창조");
    } else if (data.sourceMode === "text") {
      setAiContentType("텍스트 재창조");
    } else if (data.sourceMode === "pdf") {
      setAiContentType("PDF 원문추출");
    } else {
      setAiContentType("블로그 글쓰기 콘텐츠");
    }
    if (data.wordCountGoal) {
      setAiWordCountGoal(String(data.wordCountGoal));
    }
  }, [data?.id]);

  const fetchDirectDetail = useCallback(async () => {
    if (!activeRouteId || data || isDirectLoading) return;

    setIsDirectLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsDirectLoading(false);
      return;
    }

    const isNumeric = /^\d+$/.test(activeRouteId);
    let queryBuilder = supabase.from("writing_creaibox_posts").select("*").eq("user_id", user.id);

    if (isNumeric) {
      queryBuilder = queryBuilder.eq("display_id", parseInt(activeRouteId, 10));
    } else {
      queryBuilder = queryBuilder.eq("id", activeRouteId);
    }

    const { data: row, error } = await queryBuilder.maybeSingle();

    setIsDirectLoading(false);

    if (error || !row) return;

    const normalized = normalizeCreaiboxRecord(row);

    setData(normalized);
    setHasLocalEdits(false);

    queryClient.setQueryData(creaiboxManuscriptKeys.detail(activeRouteId), normalized);

    const nextList = (() => {
      const exists = sidebarList.some((item) => item.id === normalized.id);
      if (exists) {
        return sidebarList.map((item) => (item.id === normalized.id ? normalized : item));
      }
      return [normalized, ...sidebarList];
    })();

    setCachedList(nextList);
    writeCachedList(nextList);
    queryClient.setQueryData(creaiboxManuscriptKeys.list, nextList);
  }, [activeRouteId, data, isDirectLoading, queryClient, sidebarList, supabase]);

  useEffect(() => {
    if (!data && !isDetailLoading) {
      queueMicrotask(() => {
        void fetchDirectDetail();
      });
    }
  }, [data, fetchDirectDetail, isDetailLoading]);

  useEffect(() => {
    void refetchList();
  }, [refetchList]);

  useEffect(() => {
    return () => {
      if (saveFeedbackTimeoutRef.current) {
        clearTimeout(saveFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const sidebarDomainOptions = useMemo(() => {
    const domains = new Set<string>();
    sidebarList.forEach((item) => {
      domains.add(getManuscriptDomainLabel(item, clientSiteBrandIds));
    });
    return Array.from(domains);
  }, [clientSiteBrandIds, sidebarList]);

  const filteredManuscripts = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();

    return sidebarList.filter((item) => {
      if (sidebarDomainFilter !== "all") {
        const itemDomain = getManuscriptDomainLabel(item, clientSiteBrandIds);
        if (itemDomain !== sidebarDomainFilter) return false;
      }

      if (lower) {
        const title = (item.title || "").toLowerCase();
        const targetKeyword = (item.targetKeyword || "").toLowerCase();
        if (!title.includes(lower) && !targetKeyword.includes(lower)) return false;
      }

      return true;
    });
  }, [clientSiteBrandIds, sidebarDomainFilter, sidebarList, searchTerm]);

  const persistCaches = useCallback(
    (nextRecord: StudioManuscriptRecord) => {
      const routeId = nextRecord.displayId ?? nextRecord.id;

      queryClient.setQueryData<StudioManuscriptRecord | null>(
        creaiboxManuscriptKeys.detail(routeId),
        nextRecord
      );

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        (prev = []) => {
          const exists = prev.some((item) => item.id === nextRecord.id);
          const nextList = exists
            ? prev.map((item) => (item.id === nextRecord.id ? nextRecord : item))
            : [nextRecord, ...prev];

          writeCachedList(nextList);
          setCachedList(nextList);

          return nextList;
        }
      );
    },
    [queryClient]
  );

  const handleSave = useCallback(
    async (status?: StudioManuscriptRecord["status"], isAutoSave = false, overrideRecord?: StudioManuscriptRecord) => {
      const activeRecord = overrideRecord || data;
      if (!activeRecord) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!isAutoSave) {
          window.alert("로그인을 하셔야 사용할 수 있는 메뉴입니다.");
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
        return false;
      }

      setIsSaving(true);

      const safeData = activeRecord as StudioManuscriptRecordWithOptionalFields;

      const slug = safeData.slug?.trim()
        ? safeData.slug.trim()
        : buildPublicBlogSlug(
            safeData.title,
            safeData.focusKeyword,
            safeData.targetKeyword
          );

      let canonicalUrl = safeData.canonicalUrl || "";
      const allApprovedBrands = Array.from(new Set([userBrandId, ...(userBrandIds || [])].filter(Boolean)));
      
      let matchedPrefix: string | null = null;

      if (userRole === "ADMIN" && canonicalUrl.startsWith("https://creaibox.com/blog")) {
        matchedPrefix = "https://creaibox.com/blog";
      } else {
        for (const bid of allApprovedBrands) {
          const isPrimary = bid === userBrandId;
          const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
          const customDomStatus = extraConfigs?.[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
          
          const subPrefix = `https://${bid}.creaibox.com/blog`;
          const customPrefix = (customDomStatus === "APPROVED" && customDom) ? `https://${customDom}/blog` : null;

          if (customPrefix && canonicalUrl.startsWith(customPrefix)) {
            matchedPrefix = customPrefix;
            break;
          }
          if (canonicalUrl.startsWith(subPrefix)) {
            matchedPrefix = subPrefix;
            break;
          }
        }
      }

      if (matchedPrefix) {
        canonicalUrl = slug ? `${matchedPrefix}/${slug}` : matchedPrefix;
      } else {
        canonicalUrl = buildCanonicalUrl(slug, userRole, userBrandId, userBrandIds, extraConfigs, safeData.canonicalUrl);
      }

      const now = new Date().toISOString();
      const nextStatus = (status ?? safeData.status ?? "draft") as StudioManuscriptRecord["status"];

      let publishedSnapshotToSave = safeData.publishedSnapshot;
      const updatePayload: Record<string, any> = {
        title: safeData.title ?? "",
        content: safeData.content ?? "",
        target_keyword: safeData.targetKeyword ?? "",
        selected_tone: safeData.selectedTone ?? "",
        status: nextStatus,
        slug,
        meta_description: safeData.metaDescription ?? "",
        focus_keyword: safeData.focusKeyword ?? "",
        canonical_url: canonicalUrl,
        seo_tags: toTagList(safeData.seoTags),
        word_count_goal: safeData.wordCountGoal ?? null,
        use_search: safeData.useSearch ?? false,
        post_type: safeData.detailLabel ?? safeData.postType ?? "",
        category_id: safeData.categoryIds?.[0] || safeData.categoryId || null,
        category_ids: safeData.categoryIds || (safeData.categoryId ? [safeData.categoryId] : []),
        toc_enabled: safeData.tocEnabled ?? true,
      };

      if (status === "published") {
        const snapshot = {
          title: safeData.title ?? "",
          content: safeData.content ?? "",
          slug,
          meta_description: safeData.metaDescription ?? "",
          focus_keyword: safeData.focusKeyword ?? "",
          canonical_url: canonicalUrl,
          seo_tags: toTagList(safeData.seoTags),
          category_id: safeData.categoryIds?.[0] || safeData.categoryId || null,
          category_ids: safeData.categoryIds || (safeData.categoryId ? [safeData.categoryId] : []),
          toc_enabled: safeData.tocEnabled ?? true,
        };
        updatePayload.published_snapshot = snapshot;
        publishedSnapshotToSave = snapshot;
      } else if (status === "saved") {
        updatePayload.published_snapshot = null;
        publishedSnapshotToSave = undefined;
      }

      const { error } = await supabase
        .from("writing_creaibox_posts")
        .update(updatePayload)
        .eq("id", safeData.id)
        .eq("user_id", user.id);

      setIsSaving(false);

      if (error) {
        if (!isAutoSave) {
          window.alert(`저장 실패: ${error.message}`);
        } else {
          console.error("Creaibox 자동 저장 실패:", error);
        }
        return false;
      }

      const nextRecord: StudioManuscriptRecord = {
        ...safeData,
        slug,
        canonicalUrl,
        status: nextStatus,
        updatedAt: now,
        displayId: safeData.displayId,
        wordCount: (safeData.content ?? "").replace(/\s+/g, "").length,
        categoryId: safeData.categoryIds?.[0] || safeData.categoryId,
        categoryIds: safeData.categoryIds || (safeData.categoryId ? [safeData.categoryId] : []),
        tocEnabled: safeData.tocEnabled ?? true,
        publishedSnapshot: publishedSnapshotToSave,
      };

      setData(nextRecord);
      setHasLocalEdits(false);
      persistCaches(nextRecord);

      return true;
    },
    [data, persistCaches, supabase, userRole, userBrandId, pathname, router]
  );
  const handleAiGenerateInEditor = useCallback(async (
    targetKeyword: string,
    contentType: string,
    postType: string,
    selectedTone: string,
    wordCountGoal: string,
    strategyLevel: string,
    resultFormat: string,
    largeCategory: string,
    mainTopic: string,
    subTopic: string,
    referenceNote: string,
    useSearch: boolean
  ) => {
    if (!targetKeyword.trim()) {
      window.alert("타겟 키워드를 입력해 주세요.");
      return;
    }

    setIsAiGenerating(true);
    setAiStatusMessage("Gemini 모델로 글을 생성하고 있습니다...");
    setAiErrorMessage("");

    try {
      const vaultConfig = getUserAiVaultConfig();
      const finalWordCountGoal = wordCountGoal || "1500";
      const lengthPrompt = getLengthPrompt(finalWordCountGoal);

      // Load selected persona and knowledge details from localStorage
      let personaPrompt = "";
      let knowledgePrompt = "";

      try {
        const storedPersonas = localStorage.getItem("creaibox_persona_list");
        if (storedPersonas && selectedPersonaId) {
          const personas: any[] = JSON.parse(storedPersonas);
          const persona = personas.find((p) => p.id === selectedPersonaId);
          if (persona) {
            personaPrompt = `
        [작가 페르소나 지침]
        귀하는 다음 페르소나의 집필 정체성과 캐릭터를 완벽히 모사하여 본문 작성을 해야 합니다:
        - 이름/필명/역할: ${persona.nickname}
        - 주 말투/어조: ${persona.tone || selectedTone}
        - 목표 독자층: ${persona.targetAudience}
        - 집필 특징 및 배경설명 (Bio): ${persona.bio}
            `;
          }
        }

        const storedKnowledge = localStorage.getItem("creaibox_knowledge_base");
        if (storedKnowledge && selectedKnowledgeId) {
          const knowledges: any[] = JSON.parse(storedKnowledge);
          const knowledge = knowledges.find((k) => k.id === selectedKnowledgeId);
          if (knowledge) {
            knowledgePrompt = `
        [참조 지식 아카이브 데이터]
        글 작성에 있어 다음 전문 지식을 정확하게 인용하고 반영하여 작성하십시오:
        - 참조 주제: ${knowledge.title}
        - 요약 정보: ${knowledge.description}
        - 본문에 상세히 녹여낼 지식 본문내용:
        ${knowledge.content}
            `;
          }
        }
      } catch (e) {
        console.error("Error loading selected persona/knowledge", e);
      }

      const prompt = `
        당신은 Creaibox의 전문 블로그 콘텐츠 에디터입니다. 
        ${personaPrompt}
        ${knowledgePrompt}
        - 주제: ${targetKeyword}
        - 콘텐츠 유형: ${contentType || "블로그 글쓰기 콘텐츠"}
        - 포스트 타입: ${postType || "🧠 AI 인사이트 포스팅"}
        - 어조: ${personaPrompt ? "(위의 작가 페르소나 지침의 말투/어조 최우선 준수)" : (selectedTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)")}
        - 길이 규격: ${lengthPrompt.label}
        - 목표 분량: 약 ${finalWordCountGoal}자
        - 길이 작성 지침: ${lengthPrompt.instruction}
        - 전략 수준: ${strategyLevel || "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)"}
        - 결과 구성: ${resultFormat || "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)"}
        - 대분류: ${largeCategory || "미지정"}
        - 상세 분야: ${mainTopic || "미정"}
        - 추천 시리즈: ${subTopic || "미정"}
        - 참고 사항: ${referenceNote || "미정"}
        - ${useSearch ? "Google Search를 활용해" : "내부 지식과 논리 전개를 활용해"} 2026년 최신 기술 트렌드와 인사이트를 반영하여 작성하십시오.
        - 제목은 클릭하고 싶게 만들되 과장하지 말고, 첫 문단에서 글의 핵심 가치를 빠르게 전달하십시오.
        - 본문은 마크다운 형식으로 작성하고, 길이 규격에 맞게 문단 수와 정보 밀도를 조절하십시오.
        - 짧은 글은 압축적으로, 긴 글은 소제목/사례/FAQ/실행 팁을 충분히 포함해 깊이 있게 작성하십시오.
        - 제목에는 "[Creaibox AI Insight]" 같은 AI 표기를 넣지 말고, 본문에도 가로 구분선(---, ***)을 넣지 마십시오.
        - SEO 최적화 관점에서 이 글의 핵심 Focus Keyword 1개를 뽑으십시오.
        - SEO Tags 는 Focus Keyword를 중심으로 한 롱테일 검색어 5개를 생성하십시오.
        - Meta Description 은 정확히 160자에 가깝게 작성하고, 문장 끝은 "알아보겠습니다", "확인해보겠습니다", "분석해보겠습니다"처럼 마무리되는 자연스러운 안내형 문장으로 끝내십시오.
        - Slug 는 Focus Keyword가 반드시 포함되도록 너무 길지 않게 SEO 친화적으로 작성하십시오.
        - JSON 형식으로만 반환하십시오:
          {
            "title": "제목",
            "content": "마크다운 본문",
            "focusKeyword": "핵심 키워드",
            "seoTags": ["롱테일1", "롱테일2", "롱테일3", "롱테일4", "롱테일5"],
            "metaDescription": "160자 설명",
            "slug": "seo-friendly-slug"
          }
      `;

      let text = "";
      let lastError: unknown = null;
      let generationUsedSearch = false;

      const uniqueModelNames = [
        ...new Set(
          vaultConfig?.provider === "groq"
            ? [vaultConfig.model]
            : [vaultConfig?.model || "gemini-3.1-flash-lite", "gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"]
        ),
      ];
      const searchModes = useSearch ? [true, false] : [false];

      for (const modelName of uniqueModelNames) {
        for (const shouldUseSearch of searchModes) {
          for (let attempt = 1; attempt <= 3; attempt += 1) {
            try {
              setAiStatusMessage(
                attempt === 1
                  ? shouldUseSearch
                    ? `${modelName} 모델과 최신 검색으로 글을 생성하고 있습니다...`
                    : `${modelName} 모델로 글을 생성하고 있습니다...`
                  : `${modelName} 모델 재시도 중입니다. (${attempt}/3)`
              );

              const generationResult = await generateGeminiContentWithFallback({
                modelName,
                prompt,
                useSearch: shouldUseSearch,
                responseMimeType: "application/json",
                type: "creaibox_create",
                userId: null,
                userEmail: null,
              });

              const responseText = generationResult.text;

              try {
                robustParseJson(responseText);
              } catch (parseError: unknown) {
                lastError = parseError;
                if (attempt < 3) {
                  setAiStatusMessage("AI 응답 형식이 맞지 않아 자동으로 다시 시도하고 있습니다...");
                  await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
                  continue;
                }
                break;
              }

              text = responseText;
              generationUsedSearch = generationResult.usedSearch;
              lastError = null;
              setAiStatusMessage("AI 응답을 정리하는 중입니다...");
              break;
            } catch (error: unknown) {
              lastError = error;
              if (attempt < 3 && isHighDemandError(error)) {
                setAiStatusMessage("AI 서버가 혼잡하여 자동으로 다시 시도하고 있습니다...");
                await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
                continue;
              }
              break;
            }
          }
          if (text) break;
        }
        if (text) break;
      }

      if (!text) {
        throw lastError || new Error("AI 응답을 받지 못했습니다.");
      }

      const parsed = robustParseJson(text);
      const finalTitle = sanitizeGeneratedTitle(parsed.title || "", targetKeyword);
      const finalContent = stripHorizontalRules(parsed.content || "");
      const nextFocusKeyword = normalizeFocusKeyword(parsed.focusKeyword, targetKeyword, finalTitle);
      const nextSeoTags = normalizeSeoTags(parsed.seoTags, nextFocusKeyword);
      const nextSlug = buildSeoSlug(parsed.slug || finalTitle, nextFocusKeyword);
      const nextMetaDescription = (parsed.metaDescription || "").trim();

      if (!data) return;

      const updatedRecord: StudioManuscriptRecord = {
        ...data,
        title: finalTitle,
        content: finalContent,
        focusKeyword: nextFocusKeyword,
        seoTags: nextSeoTags,
        slug: nextSlug,
        metaDescription: nextMetaDescription,
        targetKeyword: targetKeyword,
        selectedTone: selectedTone,
        wordCountGoal: wordCountGoal,
        canonicalUrl: buildCanonicalUrl(nextSlug, userRole, userBrandId, userBrandIds, extraConfigs, data.canonicalUrl),
        detailLabel: postType,
      };

      setAiStatusMessage("생성이 완료되었습니다. 아카이브에 자동 저장 중입니다...");
      
      const saveSuccess = await handleSave(undefined, true, updatedRecord);
      
      if (saveSuccess) {
        if (aiItemId && aiCampaignId) {
          try {
            const outputPayload = {
              campaignId: aiCampaignId,
              itemId: aiItemId,
              outputType: "creaibox_blog" as const,
              platform: "Creaibox 블로그" as const,
              targetRoute: `/studio/writing/creaibox/list/${activeRouteId}`,
              title: finalTitle,
              status: "generated" as const,
              generatedPostId: manuscriptId,
              metadata: { display_id: activeRouteId }
            };
            await createContentPlannerOutput(outputPayload);
            await updateContentPlannerItemStatus(aiItemId, "generated");
          } catch (linkErr) {
            console.error("Planner map failed:", linkErr);
          }
        }
        window.alert("AI 생성이 완료되어 아카이브에 자동 저장되었습니다.");
      } else {
        window.alert("AI 생성은 완료되었으나 자동 저장에 실패했습니다.");
      }

    } catch (error: unknown) {
      const friendlyMessage = getFriendlyAiErrorMessage(error);
      setAiErrorMessage(friendlyMessage);
      setAiStatusMessage("");
      window.alert(friendlyMessage);
    } finally {
      setIsAiGenerating(false);
    }
  }, [data, activeRouteId, manuscriptId, aiItemId, aiCampaignId, userRole, userBrandId, handleSave, selectedPersonaId, selectedKnowledgeId]);
  const handleAiGenerateTrigger = useCallback(() => {
    void handleAiGenerateInEditor(
      aiTargetKeyword,
      aiContentType,
      aiPostType,
      aiSelectedTone,
      aiWordCountGoal,
      aiStrategyLevel,
      aiResultFormat,
      aiLargeCategory,
      aiMainTopic,
      aiSubTopic,
      aiReferenceNote,
      aiUseSearch
    );
  }, [
    handleAiGenerateInEditor,
    aiTargetKeyword,
    aiContentType,
    aiPostType,
    aiSelectedTone,
    aiWordCountGoal,
    aiStrategyLevel,
    aiResultFormat,
    aiLargeCategory,
    aiMainTopic,
    aiSubTopic,
    aiReferenceNote,
    aiUseSearch,
  ]);

  const handleFetchOriginalText = useCallback(async () => {
    if (!recreateUrl.trim()) {
      window.alert("가져올 글의 URL 주소를 입력해 주세요 사장님!");
      return;
    }
    setIsFetchingOriginal(true);
    try {
      const extractResponse = await fetch(
        `/api/naver-extract?url=${encodeURIComponent(recreateUrl.trim())}`
      );
      const extractedResult = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractedResult?.error || "본문 추출에 실패했습니다.");
      }

      const { title: extTitle, content: extContent } = extractedResult;
      
      updateLocalData({
        title: extTitle || "추출된 제목",
        content: extContent || "",
      });
      
      window.alert("원글 제목과 본문을 성공적으로 가져왔습니다!");
    } catch (error: any) {
      console.error(error);
      window.alert(error.message || "원글을 가져오는 도중 오류가 발생했습니다.");
    } finally {
      setIsFetchingOriginal(false);
    }
  }, [recreateUrl, updateLocalData]);

  const handleStartRecreation = useCallback(async () => {
    if (!data) return;
    let textToRecreate = data.content || "";
    let titleToRecreate = data.title || "";

    const plainText = textToRecreate.replace(/<[^>]*>/g, "").trim();
    if (!plainText && recreateUrl.trim()) {
      setIsFetchingOriginal(true);
      try {
        const extractResponse = await fetch(
          `/api/naver-extract?url=${encodeURIComponent(recreateUrl.trim())}`
        );
        const extractedResult = await extractResponse.json();

        if (!extractResponse.ok) {
          throw new Error(extractedResult?.error || "본문 추출에 실패했습니다.");
        }

        titleToRecreate = extractedResult.title || "추출된 제목";
        textToRecreate = extractedResult.content || "";
        
        updateLocalData({
          title: titleToRecreate,
          content: textToRecreate,
        });
      } catch (error: any) {
        console.error(error);
        window.alert(error.message || "원글을 가져오는 도중 오류가 발생했습니다.");
        setIsFetchingOriginal(false);
        return;
      } finally {
        setIsFetchingOriginal(false);
      }
    }

    if (!textToRecreate.replace(/<[^>]*>/g, "").trim()) {
      window.alert("재창조할 본문 내용이 없습니다. 먼저 타겟 글 주소를 입력하거나 본문을 작성해 주세요.");
      return;
    }

    setIsRecreating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const selectedTone = aiSelectedTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)";
      
      const keywordInstruction = aiTargetKeyword?.trim()
        ? `새로 탄생할 원고의 집중 공략 타겟 키워드는 '${aiTargetKeyword.trim()}'이며, 반드시 이 키워드를 중심으로 최적화하라.`
        : `원본 글을 분석해 검색성과 문맥 적합성이 가장 높은 대표 타겟 키워드 1개를 스스로 선정하고, 그 키워드로 최적화하라.`;

      const lengthInstruction =
        !aiWordCountGoal || aiWordCountGoal === "same"
          ? `본문 길이는 원본과 대략 같은 길이로 맞추되, 정보량과 문단 구조는 유지하라.`
          : `본문 길이는 공백 포함 약 ${aiWordCountGoal}자 수준으로 충분히 길고 풍부하게 작성하라.`;

      const rawInputContext = `
        [실제 추출된 원본 제목]: ${titleToRecreate}
        [실제 추출된 원본 본문]
        ${textToRecreate}
      `;

      // Load selected persona and knowledge details from localStorage
      let personaPrompt = "";
      let knowledgePrompt = "";

      try {
        const storedPersonas = localStorage.getItem("creaibox_persona_list");
        if (storedPersonas && selectedPersonaId) {
          const personas: any[] = JSON.parse(storedPersonas);
          const persona = personas.find((p) => p.id === selectedPersonaId);
          if (persona) {
            personaPrompt = `
        [작가 페르소나 지침]
        귀하는 다음 페르소나의 집필 정체성과 캐릭터를 완벽히 모사하여 본문 작성을 해야 합니다:
        - 이름/필명/역할: ${persona.nickname}
        - 주 말투/어조: ${persona.tone || selectedTone}
        - 목표 독자층: ${persona.targetAudience}
        - 집필 특징 및 배경설명 (Bio): ${persona.bio}
            `;
          }
        }

        const storedKnowledge = localStorage.getItem("creaibox_knowledge_base");
        if (storedKnowledge && selectedKnowledgeId) {
          const knowledges: any[] = JSON.parse(storedKnowledge);
          const knowledge = knowledges.find((k) => k.id === selectedKnowledgeId);
          if (knowledge) {
            knowledgePrompt = `
        [참조 지식 아카이브 데이터]
        글 작성에 있어 다음 전문 지식을 정확하게 인용하고 반영하여 작성하십시오:
        - 참조 주제: ${knowledge.title}
        - 요약 정보: ${knowledge.description}
        - 본문에 상세히 녹여낼 지식 본문내용:
        ${knowledge.content}
            `;
          }
        }
      } catch (e) {
        console.error("Error loading selected persona/knowledge for recreation", e);
      }

      const prompt = `
        너는 네이버 스마트블록 C-Rank 및 DIA+ 로봇의 문서 유사도 카피캣 탐지기 필터를 완벽하게 우회 분쇄하는 원고 재창조 엔진이다.
        주어진 [기반 정보 영역]의 데이터 가치와 핵심 정보는 고스란히 계승하되, 문장의 어순, 형태소 수식 관계, 단어 배열을 180도 전면 파괴하여 완전히 최초로 창작된 오리지널 문서처럼 보이게 가공하라.
        ${personaPrompt}
        ${knowledgePrompt}

        [기반 정보 영역]
        ${rawInputContext}

        [빌드 조건 마스트 공정]
        1. ${keywordInstruction}
        2. 최종 선정한 타겟 키워드를 본문 안에 3회~5회 내외로 자연스럽게 배치하라.
        3. 말투는 반드시 '${personaPrompt ? "위 작가 페르소나 지침의 말투/어조" : selectedTone}'에 맞춰 유지하라.
        4. ${lengthInstruction}
        5. 마크다운의 대제목 및 소제목 구조(##, ###)를 반드시 3개 이상 쪼개어 가독성 벨트를 형성하라.
        6. 동시에 원본 글의 핵심 키워드, 핵심 주제, 핵심 내용을 사람이 한눈에 파악할 수 있게 별도 분석하라.
        7. 결과물은 부연설명이나 마크다운 코드 블록 선언부 기호 없이 오직 순수한 JSON 형식 데이터 규격으로만 정확하게 배출하라.
        
        [JSON 반환 양식 필수 규격]
        { "targetKeyword": "최종 선정된 대표 타겟 키워드 1개", "title": "유사도를 회피하고 시선을 강탈하는 고품질 새 제목", "content": "새로 전면 재창조된 풍부한 내용의 마크다운 본문", "sourceAnalysis": { "keywords": ["원본 핵심 키워드1", "원본 핵심 키워드2", "원본 핵심 키워드3"], "topic": "원본 글의 핵심 주제를 한 문장으로 정리한 결과", "summaryPoints": ["원본 핵심 내용 요약 1", "원본 핵심 내용 요약 2", "원본 핵심 내용 요약 3"] } }
      `;

      const generationResult = await generateGeminiContentWithFallback({
        prompt,
        responseMimeType: "application/json",
        type: "naver_recreate",
        userId: user?.id || null,
        userEmail: user?.email || null,
      });

      const parsedData = robustParseJson(generationResult.text);
      const finalTitle = parsedData.title || `[오리지널] ${parsedData.targetKeyword || "핵심 키워드"} 최적화 보고서`;
      const finalContent = parsedData.content || "";

      updateLocalData({
        title: finalTitle,
        content: finalContent,
        targetKeyword: parsedData.targetKeyword || aiTargetKeyword,
        focusKeyword: parsedData.targetKeyword || aiTargetKeyword,
      });

      if (parsedData.targetKeyword) {
        setAiTargetKeyword(parsedData.targetKeyword);
      }

      window.alert("AI 글 재창조가 완료되었습니다!");
    } catch (error: any) {
      console.error(error);
      window.alert(error.message || "AI 글 재창조 가동 도중 오류가 발생했습니다.");
    } finally {
      setIsRecreating(false);
    }
  }, [data, recreateUrl, aiTargetKeyword, aiSelectedTone, aiWordCountGoal, supabase, updateLocalData, setAiTargetKeyword, selectedPersonaId, selectedKnowledgeId]);

  const handlePdfExtract = useCallback(async () => {
    if (!pdfFile) {
      window.alert("추출할 PDF 파일을 먼저 첨부해 주세요 사장님!");
      return;
    }
    setIsPdfExtracting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const titleWithoutExt = pdfFileName.replace(/\.[^/.]+$/, "");
      const mockTitle = `[PDF 요약] ${titleWithoutExt}`;
      const mockContent = `
        <h3>[PDF 추출 보고서 원문]</h3>
        <p>글로벌 반도체 공급망 고도화에 따른 시장 변화 보고서 요약본입니다. 최근 SK하이닉스의 HBM 공급 계약과 엔비디아의 신규 플랫폼 출시로 시장 점유율이 급변하고 있습니다.</p>
        <p>이에 따라 차세대 AI 메모리 반도체 부문의 성장 잠재력이 부각되고 있으며, 향후 5개 분기 연속 영업이익 흑자가 예상되는 시점입니다.</p>
        <p>디바이스 기기별 도입량 증가로 AI 반도체 매출 포트폴리오 다각화가 이루어지고 있습니다.</p>
      `;

      updateLocalData({
        title: mockTitle,
        content: mockContent,
      });
      setExtractedPdfText(mockContent.replace(/<[^>]*>/g, ""));

      window.alert("PDF 문서에서 텍스트와 이미지 요소를 성공적으로 추출하여 에디터에 로드했습니다!");
    } catch (err) {
      window.alert("PDF 추출 도중 오류가 발생했습니다.");
    } finally {
      setIsPdfExtracting(false);
    }
  }, [pdfFile, pdfFileName, updateLocalData]);

  const handleStartPdfRecreation = useCallback(async () => {
    const sourceText = extractedPdfText.trim() || (data?.content ? data.content.replace(/<[^>]*>/g, "").trim() : "");
    if (!sourceText) {
      window.alert("재창조할 PDF 추출 텍스트가 없습니다. 먼저 PDF를 추출해 주세요.");
      return;
    }

    setIsRecreating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const selectedTone = aiSelectedTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)";
      
      // Load selected persona and knowledge details from localStorage
      let personaPrompt = "";
      let knowledgePrompt = "";

      try {
        const storedPersonas = localStorage.getItem("creaibox_persona_list");
        if (storedPersonas && selectedPersonaId) {
          const personas: any[] = JSON.parse(storedPersonas);
          const persona = personas.find((p) => p.id === selectedPersonaId);
          if (persona) {
            personaPrompt = `
        [작가 페르소나 지침]
        귀하는 다음 페르소나의 집필 정체성과 캐릭터를 완벽히 모사하여 본문 작성을 해야 합니다:
        - 이름/필명/역할: ${persona.nickname}
        - 주 말투/어조: ${persona.tone || selectedTone}
        - 목표 독자층: ${persona.targetAudience}
        - 집필 특징 및 배경설명 (Bio): ${persona.bio}
            `;
          }
        }

        const storedKnowledge = localStorage.getItem("creaibox_knowledge_base");
        if (storedKnowledge && selectedKnowledgeId) {
          const knowledges: any[] = JSON.parse(storedKnowledge);
          const knowledge = knowledges.find((k) => k.id === selectedKnowledgeId);
          if (knowledge) {
            knowledgePrompt = `
        [참조 지식 아카이브 데이터]
        글 작성에 있어 다음 전문 지식을 정확하게 인용하고 반영하여 작성하십시오:
        - 참조 주제: ${knowledge.title}
        - 요약 정보: ${knowledge.description}
        - 본문에 상세히 녹여낼 지식 본문내용:
        ${knowledge.content}
            `;
          }
        }
      } catch (e) {
        console.error("Error loading selected persona/knowledge for PDF recreation", e);
      }

      const prompt = `
        너는 업로드된 PDF 원본 자료를 바탕으로 카피캣 필터를 완벽 우회하는 고품질 블로그 원고를 창작하는 AI 재창조 엔진이다.
        아래의 [PDF 추출 자료 영역] 데이터를 정밀 계승하되, 가독성 높은 소제목 구조를 갖춘 완전한 블로그 포스팅으로 재창조하라.
        ${personaPrompt}
        ${knowledgePrompt}

        [PDF 추출 자료 영역]
        ${sourceText}

        [빌드 조건]
        1. 말투는 반드시 '${personaPrompt ? "위 작가 페르소나 지침의 말투/어조" : selectedTone}'에 맞추어 작성하라.
        2. 집중 공략 타겟 키워드 '${aiTargetKeyword || "AI 반도체 시장"}'를 중심으로 작성하고 본문에 자연스럽게 4회 이상 노출하라.
        3. 분량은 공백 포함 1,500자 이상으로 문단을 구체화하여 서술하라.
        4. 대제목(##)과 소제목(###) 구조를 마크다운 양식으로 명확히 구분하라.
        5. 결과물은 부연설명이나 마크다운 코드 블록 선언부 기호 없이 오직 순수한 JSON 형식 데이터 규격으로만 정확하게 배출하라.

        [JSON 반환 양식 필수 규격]
        { "title": "새로 창조된 블로그 제목", "content": "새로 창조된 마크다운 본문", "targetKeyword": "최종 선정된 대표 타겟 키워드 1개" }
      `;

      const generationResult = await generateGeminiContentWithFallback({
        prompt,
        responseMimeType: "application/json",
        type: "naver_recreate",
        userId: user?.id || null,
        userEmail: user?.email || null,
      });

      const parsedData = robustParseJson(generationResult.text);
      const finalTitle = parsedData.title || `[AI 재창조] ${aiTargetKeyword || "PDF 요약"} 보고서`;
      const finalContent = parsedData.content || "";

      updateLocalData({
        title: finalTitle,
        content: finalContent,
        targetKeyword: parsedData.targetKeyword || aiTargetKeyword,
        focusKeyword: parsedData.targetKeyword || aiTargetKeyword,
      });

      if (parsedData.targetKeyword) {
        setAiTargetKeyword(parsedData.targetKeyword);
      }

      window.alert("PDF 기반 AI 글 재창조가 성공적으로 완료되었습니다!");
    } catch (error: any) {
      console.error(error);
      window.alert(error.message || "AI 글 재창조 중 오류가 발생했습니다.");
    } finally {
      setIsRecreating(false);
    }
  }, [data, extractedPdfText, aiSelectedTone, aiTargetKeyword, supabase, updateLocalData, setAiTargetKeyword, selectedPersonaId, selectedKnowledgeId]);

  const syncSelectedManuscript = useCallback(
    (routeId: string) => {
      const matched = sidebarList.find(
        (item) => String(item.displayId) === routeId || String(item.id) === routeId
      );

      setActiveRouteId(routeId);

      if (!matched) return;

      setData(matched);
      setHasLocalEdits(false);
      queryClient.setQueryData(creaiboxManuscriptKeys.detail(routeId), matched);
      queryClient.setQueryData(creaiboxManuscriptKeys.detail(matched.id), matched);
    },
    [queryClient, sidebarList]
  );

  useEffect(() => {
    const handlePopState = () => {
      const routeId = window.location.pathname.split("/").filter(Boolean).at(-1) || "";
      if (routeId) syncSelectedManuscript(routeId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncSelectedManuscript]);



  const showPublishFeedback = useCallback((message: string) => {
    if (saveFeedbackTimeoutRef.current) {
      clearTimeout(saveFeedbackTimeoutRef.current);
    }

    setPublishFeedback(message);
    saveFeedbackTimeoutRef.current = setTimeout(() => {
      setPublishFeedback("");
      saveFeedbackTimeoutRef.current = null;
    }, 3000);
  }, []);

  const handleOpenManuscript = useCallback(
    (manuscript: StudioManuscriptRecord) => {
      const routeId = String(manuscript.displayId ?? manuscript.id);
      const nextPath = `/studio/writing/creaibox/list/${routeId}`;

      if (hasLocalEdits) {
        void handleSave();
      }

      setData(manuscript);
      setHasLocalEdits(false);
      queryClient.setQueryData(creaiboxManuscriptKeys.detail(routeId), manuscript);
      queryClient.setQueryData(creaiboxManuscriptKeys.detail(manuscript.id), manuscript);
      setActiveRouteId(routeId);

      if (window.location.pathname !== nextPath) {
        window.history.pushState({ creaiboxManuscriptId: routeId }, "", nextPath);
      }
    },
    [queryClient, hasLocalEdits, handleSave]
  );

  const navigateByOffset = useCallback(
    (offset: number) => {
      if (!isMounted || filteredManuscripts.length === 0) return;

      const currentIndex = Math.max(
        0,
        filteredManuscripts.findIndex((item) => {
          const routeId = String(item.displayId ?? item.id);
          return routeId === activeRouteId || String(item.id) === activeRouteId;
        })
      );
      const nextIndex = Math.min(Math.max(currentIndex + offset, 0), filteredManuscripts.length - 1);
      const nextItem = filteredManuscripts[nextIndex];

      if (nextItem) {
        const nextRouteId = String(nextItem.displayId ?? nextItem.id);

        if (nextRouteId !== activeRouteId && String(nextItem.id) !== activeRouteId) {
          handleOpenManuscript(nextItem);
        }
      }
    },
    [activeRouteId, filteredManuscripts, handleOpenManuscript, isMounted]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();

      if (
        target?.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
      ) {
        return;
      }

      event.preventDefault();
      navigateByOffset(event.key === "ArrowDown" ? 1 : -1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateByOffset]);

  useEffect(() => {
    if (!activeRouteId) return;

    const activeButton = manuscriptListRef.current?.querySelector<HTMLElement>(
      `[data-manuscript-id="${CSS.escape(activeRouteId)}"]`
    );

    activeButton?.scrollIntoView({ block: "nearest" });
  }, [activeRouteId]);

  const handleGenerateSeo = useCallback(async () => {
    if (!data) return;

    if (!data.title && !data.content) {
      window.alert("제목 또는 본문 내용이 있어야 SEO 최적화 데이터를 생성할 수 있습니다.");
      return;
    }

    setIsGeneratingSeo(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const plainContent = (data.content ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const prompt = `당신은 최고의 SEO 전문가입니다. 아래 제공된 원고 제목과 본문 내용을 분석하여, 검색엔진 최적화(SEO)를 위한 핵심 필드값들을 생성해 주세요.
반드시 아래 정의된 JSON 구조로만 응답해야 하며, 그 외의 텍스트(예: markdown code block 백틱)는 절대 포함하지 말고 순수 JSON만 반환해야 합니다.

중요 제약 조건:
- "metaDescription"은 공백을 포함하여 반드시 최소 150자 이상이어야 하며, '절대로' 160자를 단 한 자라도 초과해서는 안 됩니다. (150자 ~ 160자 범위 필수 준수)
- 문장이 중간에 끊기지 않도록 완결된 문장 형태로 온점('.')으로 안전하게 끝맺어 주세요.

응답 JSON 구조:
{
  "focusKeyword": "글의 핵심이 되는 타겟 키워드 1개 (예: '골프 스윙 팁')",
  "metaDescription": "매력적이고 구체적인 설명문 (반드시 150자 이상 160자 이하 규격 준수)",
  "seoTags": ["글의 맥락을 보여주는 핵심 키워드 태그 3~5개 배열"],
  "slug": "URL 경로로 사용할 영어 소문자 및 하이픈(-) 조합 of 슬러그 (예: 'golf-swing-basic-guide')"
}

작성된 원고 정보:
- 제목: ${data.title}
- 본문 요약: ${plainContent.slice(0, 3000)}`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "seo_optimization",
          prompt,
          responseMimeType: "application/json",
          userId: user?.id,
          userEmail: user?.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "SEO 생성 API 호출에 실패했습니다.");
      }

      const parsedSeo = JSON.parse(result.text);
      
      let finalMetaDesc = (parsedSeo.metaDescription || "").trim();
      if (finalMetaDesc.length > 160) {
        finalMetaDesc = finalMetaDesc.slice(0, 160);
      }

      updateLocalData({
        focusKeyword: parsedSeo.focusKeyword || "",
        metaDescription: finalMetaDesc,
        seoTags: Array.isArray(parsedSeo.seoTags) ? parsedSeo.seoTags : [],
        slug: parsedSeo.slug || "",
      });

      // SEO 탭으로 전환
      setPublishingPanelTab("seo");
      window.alert("AI SEO 최적화 데이터가 생성되어 적용되었습니다.");
    } catch (error: any) {
      console.error("SEO 생성 실패:", error);
      window.alert(`SEO 최적화 생성 실패: ${error.message}`);
    } finally {
      setIsGeneratingSeo(false);
    }
  }, [data, supabase, updateLocalData]);

  const handleEnhanceContent = useCallback(
    async (option: string) => {
      if (!data) return;

      if (option === "recreate_spin") {
        const rawTitle = (data.title || "").trim();
        const rawContent = (data.content || "").replace(/<[^>]*>/g, "").trim();
        const isTitleEmpty = !rawTitle || rawTitle === "새글 제목을 수정해 주세요";
        const isContentEmpty = !rawContent;

        if (isTitleEmpty || isContentEmpty) {
          window.alert("제목과 본문에 재창조 할 원본 글을 입력해 주세요");
          return;
        }

        setIsSpinRecreating(true);
      } else if (option.startsWith("expand_")) {
        if (option.includes("toc_")) {
          setIsEnhancingToc(true);
        } else {
          setIsEnhancingContent(true);
        }
      } else if (option === "correct" || option === "polish") {
        setIsPolishing(true);
      } else if (option.startsWith("change_post_type:")) {
        setIsChangingPostType(true);
      } else if (option === "apply_google_search") {
        setIsApplyingSearch(true);
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();

        let promptInstruction = "";
        if (option === "recreate_spin") {
          promptInstruction = `[Spin-Rewriting Engine 가동 지침]:
당신은 고성능 AI 원문 글 재창조 엔진입니다.
제공된 원본 원고의 제목과 본문(HTML)을 바탕으로, 원본의 핵심 팩트, 유용한 지식, 주요 쟁점 데이터는 완벽하게 보존하되, 문장 표현, 어휘 선택, 단락 구조 및 전개 흐름을 완전히 새롭게 재구성(Spin-Rewriting)하여 매력적이고 가독성 높은 새로운 글로 재창조해 주십시오.

[필수 출력 형식]:
반드시 아래 JSON 포맷만을 반환해야 합니다 (다른 부연 설명이나 마크다운 백틱 등은 절대로 포함하지 마십시오):
{
  "title": "재창조된 감각적인 새 제목",
  "content": "<p>재창조된 새로운 본문 통합 HTML 내용</p>"
}`;
        } else if (option.startsWith("expand_")) {
          if (option.includes("toc_")) {
            const count = option.replace("expand_toc_", "");
            promptInstruction = `현재 본문에 있는 기존 목차(H2 등)들과 긴밀하게 연관되고 이어지는 새로운 목차(H2 또는 H3 태그)를 정확히 ${count}개 생성하여 추가해 주세요. 또한, 새로 추가된 각 목차 하위에는 상세하고 깊이 있는 설명 문단(글 내용)도 함께 작성해서 본문의 마지막 또는 문맥상 적합한 위치에 자연스럽게 덧붙여 전체 원고의 분량을 확장해 주세요.

[중요 지시사항]:
1. 기존에 존재하던 모든 목차와 본문 내용은 절대로 삭제, 수정, 축소하지 말고 그대로 유지해야 합니다.
2. 출력 시, 기존 본문 내용과 새로 추가된 목차/내용을 모두 하나로 합친 '전체 원고 통합본 HTML'을 처음부터 끝까지 생략 없이 완벽하게 출력하세요. 절대 새로 생긴 5번, 6번 등 신규 추가된 부분만 단독으로 출력해서는 안 됩니다.`;
          } else {
            const percent = option.replace("expand_", "");
            promptInstruction = `기존의 흐름, 맥락, 구조(HTML 태그)를 최대한 유지하면서 문장을 더 구체화하고 관련 유용한 정보를 덧붙여서 원고의 전체적인 분량이 대략 ${percent}% 정도 더 풍성하고 알차게 늘어나도록 내용을 확장하여 보강해 주세요. 절대 기존 내용을 누락하거나 마음대로 생략하여 아예 새로운 글로 대체하지 마세요.`;
          }
        } else if (option === "correct") {
          promptInstruction = `기존 내용의 흐름과 맥락을 완벽히 유지하면서 맞춤법, 띄어쓰기, 문맥에 어색한 비문 등을 깔끔하게 수정해 주세요. 기존 문단의 내용이나 전체적인 분량을 마음대로 축소하거나 생략해서는 안 됩니다.`;
        } else if (option === "polish") {
          promptInstruction = `작성자가 초안으로 작성한 기존 본문을 완성도 높은 완결성 있는 고품질 글로 다듬어 완성해 주세요. 전체적인 맥락과 핵심 주제, 주요 팩트는 온전히 보존하되, 문장의 표현력을 풍부하고 매끄럽게 가다듬고 오탈자를 교정하며, 논리적 구조와 가독성을 대폭 개선하여 하나의 완결성 높은 고품질의 글로 전체 재작성해 주셔야 합니다. 절대 기존의 유용한 지식 정보나 핵심 주장을 축소, 생략하거나 아예 상관없는 새로운 이야기로 덮어씌우지 마십시오.`;
        } else if (option.startsWith("change_post_type:")) {
          const targetType = option.replace("change_post_type:", "");
          promptInstruction = `작성자가 입력한 기존 본문의 전체적인 핵심 주제와 팩트 정보, 전체 흐름은 동일하게 유지하되, 전체 글의 포스트 타입(글 작성 양식 및 어조)을 [${targetType}] 스타일로 새롭게 재구성하여 재작성해 주세요. 포스트 타입별 글쓰기 특징에 맞춰 제목과의 연계성, 목차 구조, 설명하는 방식, 서론/본론/결론의 논리 구성 방식을 해당 포스트 타입 스타일에 맞춤 최적화해야 합니다. 절대 기존 정보나 중요한 주장을 누락시키지 마십시오.`;
        } else if (option === "apply_google_search") {
          promptInstruction = `현재 본문에 기재된 수치, 통계, 주식 현황, 뉴스 등의 정보가 최신 현실 정보와 일치하는지 Google Search를 활용하여 실시간 검색하고 분석해 주세요. 만약 기존 본문에 적힌 수치나 데이터(예: 주가, 통계치, 특정 정책 내용 등)가 현재 시점의 실시간 정보와 다르거나 오래되었다면, 최신 실시간 검색 결과에 기반하여 본문의 수치와 관련 문맥 정보를 올바르게 수정하고 내용을 업데이트해 주세요. 전체 글의 주요 핵심 주제나 기존 맥락 흐름은 그대로 유지하되, 정보의 사실성과 최신성(팩트)만 실시간 데이터로 교체하고 관련 설명을 보강해야 합니다.`;
        }

        // Load selected persona and knowledge details from localStorage
        let personaPrompt = "";
        let knowledgePrompt = "";

        try {
          const storedPersonas = localStorage.getItem("creaibox_persona_list");
          if (storedPersonas && selectedPersonaId) {
            const personas: any[] = JSON.parse(storedPersonas);
            const persona = personas.find((p) => p.id === selectedPersonaId);
            if (persona) {
              personaPrompt = `
        [작가 페르소나 지침]
        귀하는 다음 페르소나의 집필 정체성과 캐릭터를 완벽히 모사하여 본문 작성을 해야 합니다:
        - 이름/필명/역할: ${persona.nickname}
        - 주 말투/어조: ${persona.tone}
        - 목표 독자층: ${persona.targetAudience}
        - 집필 특징 및 배경설명 (Bio): ${persona.bio}
              `;
            }
          }

          const storedKnowledge = localStorage.getItem("creaibox_knowledge_base");
          if (storedKnowledge && selectedKnowledgeId) {
            const knowledges: any[] = JSON.parse(storedKnowledge);
            const knowledge = knowledges.find((k) => k.id === selectedKnowledgeId);
            if (knowledge) {
              knowledgePrompt = `
        [참조 지식 아카이브 데이터]
        글 작성에 있어 다음 전문 지식을 정확하게 인용하고 반영하여 작성하십시오:
        - 참조 주제: ${knowledge.title}
        - 요약 정보: ${knowledge.description}
        - 본문에 상세히 녹여낼 지식 본문내용:
        ${knowledge.content}
              `;
            }
          }
        } catch (e) {
          console.error("Error loading selected persona/knowledge for content enhancement", e);
        }

        const prompt = `당신은 전문 콘텐츠 에디터이자 SEO 작가입니다. 제공된 원고 제목과 본문(HTML 형식)을 기반으로, 지시사항에 따라 본문을 더 완성도 높고 알차게 보강(확장)해 주세요.
        ${personaPrompt}
        ${knowledgePrompt}

        [원고 제목]: ${data.title}
        [원고 태그/키워드]: ${data.targetKeyword ?? ""}
        [기존 본문 (HTML)]:
        ${data.content ?? ""}

        [지시사항]:
        ${promptInstruction}

[출력 형식 및 제약 조건]:
1. 반드시 기존 본문 내용의 맥락을 누락하지 말고, 내용을 더 풍성하게 다듬거나 확장해야 합니다.
2. 마크다운 기호(예: ** 혹은 * 등)가 아닌 기존 본문에 맞춰 <h2>, <h3>, <p>, <ul>, <li>, <strong> 등 적합한 HTML 태그 형태로 결과를 작성해야 합니다.
3. 지시사항 외의 다른 부연 설명이나 마크다운 백틱(예: \`\`\`html 등)은 절대 포함하지 말고, 결과를 명확히 출력하세요.`;

        const useSearch = option === "apply_google_search";
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: useSearch ? "google_search_reflection" : "content_enhancement",
            prompt,
            useSearch,
            userId: user?.id,
            userEmail: user?.email,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "AI 보강 호출에 실패했습니다.");
        }

        let enhancedHtml = result.text || "";
        enhancedHtml = enhancedHtml.replace(/^```html\s*/i, "").replace(/^```json\s*/i, "").replace(/```$/, "").trim();

        if (option === "recreate_spin") {
          let parsed: { title?: string; content?: string } | null = null;
          try {
            parsed = robustParseJson(enhancedHtml);
          } catch {
            parsed = null;
          }

          if (parsed && (parsed.title || parsed.content)) {
            updateLocalData({
              ...(parsed.title ? { title: parsed.title } : {}),
              ...(parsed.content ? { content: parsed.content } : {}),
            });
          } else if (enhancedHtml) {
            updateLocalData({ content: enhancedHtml });
          }
          window.alert("Spin-Rewriting Engine에 의해 제목과 본문 원문 글 재창조가 완료되었습니다!");
        } else if (enhancedHtml) {
          // 포스트 타입 변경 성공 시, 데이터 모델의 post_type도 함께 갱신 처리
          if (option.startsWith("change_post_type:")) {
            const targetType = option.replace("change_post_type:", "");
            updateLocalData({
              content: enhancedHtml,
              detailLabel: targetType,
            });
          } else {
            updateLocalData({ content: enhancedHtml });
          }
          window.alert("AI 처리 및 본문 반영이 완료되었습니다.");
        }
      } catch (error: any) {
        console.error("Content enhancement failed:", error);
        window.alert(`AI 보강 실패: ${error.message}`);
      } finally {
        setIsEnhancingContent(false);
        setIsEnhancingToc(false);
        setIsPolishing(false);
        setIsChangingPostType(false);
        setIsApplyingSearch(false);
        setIsSpinRecreating(false);
      }
    },
    [data, supabase, updateLocalData, selectedPersonaId, selectedKnowledgeId]
  );

  useEffect(() => {
    if (!hasLocalEdits || !data || isSaving) return;

    const timer = setTimeout(() => {
      console.log("Creaibox 자동 저장 실행 중...");
      void handleSave(undefined, true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [data?.title, data?.content, hasLocalEdits, isSaving, handleSave]);

  const publishingStatus = useMemo(() => {
    if (!data) return "대기 중";

    if (data.status === "published") {
      return hasUnpublishedChanges ? "수정 중 (미반영)" : "발행 완료";
    }
    if (data.status === "trash") return "휴지통";
    return "저장 완료";
  }, [data, hasUnpublishedChanges]);

  const publishingStatusClass = useMemo(() => {
    if (data?.status === "published") {
      return hasUnpublishedChanges
        ? "bg-amber-500/10 text-amber-300 border border-amber-500/25"
        : "bg-emerald-500/10 text-emerald-300";
    }
    if (data?.status === "trash") return "bg-rose-500/10 text-rose-300";
    return "bg-sky-500/10 text-sky-300";
  }, [data?.status, hasUnpublishedChanges]);

  const triggerRevalidation = useCallback(async (targetSlug: string) => {
    if (!data) return;
    const targetBrandId = (() => {
      if (data?.canonicalUrl) {
        for (const b of [userBrandId, ...(userBrandIds || [])].filter(Boolean)) {
          if (data.canonicalUrl.includes(`://${b}.creaibox.com`) || (extraConfigs?.[`custom_domain_${b}`] && data.canonicalUrl.includes(`://${extraConfigs[`custom_domain_${b}`]}`))) {
            return b;
          }
        }
      }
      return userBrandId || (userBrandIds && userBrandIds[0]) || "";
    })();
    if (!targetBrandId) return;

    const catIds = data.categoryIds || (data.categoryId ? [data.categoryId] : []);
    
    try {
      await fetch("/api/revalidate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: targetSlug,
          brandId: targetBrandId,
          categoryIds: catIds,
        }),
      });
    } catch (error) {
      console.error("Revalidation trigger failed:", error);
    }
  }, [data, userBrandId]);

  const handlePublish = useCallback(async () => {
    const isCurrentlyPublished = data?.status === "published";

    const publishedSlug = buildPublicBlogSlug(
      data?.title,
      data?.focusKeyword,
      data?.targetKeyword
    );

    const published = await handleSave("published");

    if (published) {
      await triggerRevalidation(publishedSlug);

      if (isCurrentlyPublished) {
        showPublishFeedback("블로그 재발행(업데이트)이 완료되었습니다.");
      } else {
        showPublishFeedback("블로그 발행이 완료되었습니다.");
      }
    }
  }, [data, handleSave, showPublishFeedback, triggerRevalidation]);

  const handleCancelPublish = useCallback(async () => {
    const targetSlug = data?.slug || buildPublicBlogSlug(
      data?.title,
      data?.focusKeyword,
      data?.targetKeyword
    );

    const canceled = await handleSave("saved");

    if (canceled) {
      await triggerRevalidation(targetSlug);
      showPublishFeedback("발행이 취소되었습니다.");
    }
  }, [data, handleSave, showPublishFeedback, triggerRevalidation]);

  if (!isMounted || (!data && (isDetailLoading || isDirectLoading))) {
    return (
      <div className="min-h-screen bg-[#0a0d12] text-white">
        <div className="mx-auto grid max-w-[1880px] grid-cols-[360px_minmax(0,1.2fr)_420px] gap-0 px-0">
          <aside className="min-h-screen border-r border-white/10 bg-[#0b0f15] p-4" />
          <div className="relative min-h-screen bg-white">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              원고 데이터를 불러오는 중입니다...
            </div>
          </div>
          <aside className="min-h-screen border-l border-white/10 bg-[#0b0f15] p-6" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0d12] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-xl font-bold">원고를 찾지 못했습니다.</p>
          <Link
            href="/studio/writing/creaibox/list"
            className="mt-5 rounded-2xl bg-white px-5 py-3 font-bold text-black"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-[#0a0d12] text-white">
      <div 
        className={`grid h-full w-full transition-all duration-300 ${
          isListSidebarCollapsed 
            ? "grid-cols-[0px_360px_minmax(0,1fr)_420px]" 
            : "grid-cols-[360px_360px_minmax(0,1fr)_420px]"
        }`}
      >

        {/* 왼쪽 글 목록 */}
        <aside 
          className={`h-full overflow-hidden border-r border-violet-500/20 bg-[#0b0f15] text-[13px] transition-all duration-300 ${
            isListSidebarCollapsed 
              ? "w-0 border-r-0" 
              : "w-[360px]"
          }`}
        >
          <div className="flex h-full w-[360px] flex-col overflow-hidden">
            {/* 목록으로 돌아가기 Header (옆 에디터 "Creaibox Tiptap Blog Editor" 제목 있는 라인에 맞춰 라인을 쳐 주고, 박스 없이 텍스트만) */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#0c1017] px-4">
              <button
                type="button"
                onClick={() => {
                  if (hasLocalEdits) {
                    void handleSave();
                  }
                  router.push("/studio/writing/creaibox/list");
                }}
                className="flex items-center gap-2 text-[13px] font-black text-white/80 transition hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 text-violet-300" />
                목록으로 돌아가기
              </button>
              <button
                type="button"
                onClick={() => setIsListSidebarCollapsed(true)}
                className="flex h-8.5 items-center gap-1.5 px-3 rounded-xl border border-violet-500/40 bg-violet-950/30 text-violet-300 hover:bg-violet-600 hover:border-violet-400 hover:text-white transition-all shadow-sm cursor-pointer"
                title="원고 목록 접기"
              >
                <PanelLeftClose size={16} />
                <span className="text-xs font-black tracking-wide">목록 접기</span>
              </button>
            </div>

            {/* 원고 도메인 / 원고 검색 2탭 분리 컨트롤 */}
            <div className="p-4 pb-0 shrink-0">
              <div className="flex rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-1 mb-3">
                <button
                  type="button"
                  onClick={() => setSidebarTab("domain")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-bold transition cursor-pointer ${
                    sidebarTab === "domain"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-950/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  도메인
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab("search")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-bold transition cursor-pointer ${
                    sidebarTab === "search"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-950/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Search className="h-3.5 w-3.5" />
                  원고 검색
                </button>
              </div>

              {/* 탭 1: 도메인 선택 드롭다운 */}
              {sidebarTab === "domain" && (
                <div className="relative mb-3">
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300/70" />
                  <select
                    value={sidebarDomainFilter}
                    onChange={(event) => setSidebarDomainFilter(event.target.value)}
                    className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/40 py-2.5 pl-10 pr-8 text-[13px] font-semibold text-white outline-none transition focus:border-violet-500/50 appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#0b0f15] text-white">📑 전체 글목록 보기</option>
                    {sidebarDomainOptions.map((domain) => (
                      <option key={domain} value={domain} className="bg-[#0b0f15] text-white">
                        {domain}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </div>
              )}

              {/* 탭 2: 원고 검색 입력창 */}
              {sidebarTab === "search" && (
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300/60" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="원고 제목 또는 검색 키워드 입력..."
                    className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/30 py-2.5 pl-10 pr-4 text-[13px] font-medium text-white outline-none transition placeholder:text-white/30 focus:border-violet-500/50"
                  />
                </div>
              )}
            </div>

            {/* 스크롤 가능한 원고 리스트 본문 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-0">
              <div ref={manuscriptListRef} className="space-y-2">
                {filteredManuscripts.map((manuscript) => {
                  const active = manuscript.id === data.id;
                  const routeId = String(manuscript.displayId ?? manuscript.id);

                  return (
                    <button
                      key={manuscript.id}
                      data-manuscript-id={routeId}
                      onClick={() => handleOpenManuscript(manuscript)}
                      className={`w-full rounded-xl border p-3.5 text-left transition ${active
                        ? "border-violet-500/60 bg-violet-950/15"
                        : "border-zinc-800/80 bg-zinc-950/30 hover:border-violet-500/35 hover:bg-zinc-900/40"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className={`line-clamp-2 text-[13px] font-black leading-tight ${active ? "text-violet-300" : "text-zinc-100"}`}>
                          {manuscript.title}
                        </div>
                        {active && <Check className="mt-0.5 h-3 w-3 shrink-0 text-violet-300" />}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-flex rounded-md border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[13px] font-black uppercase tracking-[0.16em] text-violet-300">
                          {manuscript.postType === "recreate" ? "RECREATE" : "CREATE"}
                        </span>
                        <span className="line-clamp-1 text-[13px] font-medium text-zinc-500">
                          #{manuscript.targetKeyword || "키워드 없음"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* AI 자동 글쓰기 및 재창조 패널 (Column 2) */}
        <aside className="h-full w-[360px] overflow-hidden border-r border-white/10 bg-[#0b0f15] shrink-0">
          <CreaiboxAiWritingPanel
            activeAiTab={activeAiTab}
            setActiveAiTab={setActiveAiTab}
            isListSidebarCollapsed={isListSidebarCollapsed}
            onToggleListSidebar={() => setIsListSidebarCollapsed(!isListSidebarCollapsed)}
            aiTargetKeyword={aiTargetKeyword}
            setAiTargetKeyword={setAiTargetKeyword}
            aiContentType={aiContentType}
            setAiContentType={setAiContentType}
            aiPostType={aiPostType}
            setAiPostType={setAiPostType}
            aiSelectedTone={aiSelectedTone}
            setAiSelectedTone={setAiSelectedTone}
            aiWordCountGoal={aiWordCountGoal}
            setAiWordCountGoal={setAiWordCountGoal}
            aiStrategyLevel={aiStrategyLevel}
            setAiStrategyLevel={setAiStrategyLevel}
            aiResultFormat={aiResultFormat}
            setAiResultFormat={setAiResultFormat}
            aiLargeCategory={aiLargeCategory}
            setAiLargeCategory={setAiLargeCategory}
            aiMainTopic={aiMainTopic}
            setAiMainTopic={setAiMainTopic}
            aiSubTopic={aiSubTopic}
            setAiSubTopic={setAiSubTopic}
            aiReferenceNote={aiReferenceNote}
            setAiReferenceNote={setAiReferenceNote}
            aiUseSearch={aiUseSearch}
            setAiUseSearch={setAiUseSearch}
            recreateUrl={recreateUrl}
            setRecreateUrl={setRecreateUrl}
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            pdfFileName={pdfFileName}
            setPdfFileName={setPdfFileName}
            isPdfDragging={isPdfDragging}
            setIsPdfDragging={setIsPdfDragging}
            isAiGenerating={isAiGenerating}
            isFetchingOriginal={isFetchingOriginal}
            isRecreating={isRecreating}
            isPdfExtracting={isPdfExtracting}
            aiStatusMessage={aiStatusMessage}
            aiErrorMessage={aiErrorMessage}
            onGenerate={handleAiGenerateTrigger}
            onFetchOriginalText={handleFetchOriginalText}
            onStartRecreation={handleStartRecreation}
            onPdfExtract={handlePdfExtract}
            onStartPdfRecreation={handleStartPdfRecreation}
          />
        </aside>

        {/* 가운데 에디터 - 유동 영역 */}
        <main className="h-full min-w-0 overflow-hidden bg-white">
          <UniversalBlogEditor
            title={data.title ?? ""}
            setTitle={(value) => updateLocalData({ title: value })}
            content={data.content ?? ""}
            setContent={(value) =>
              updateLocalData({
                content: value,
                wordCount: value.replace(/\s+/g, "").length,
              })
            }
            charCount={(data.content ?? "").length}
            images={[]}
            fileInputRef={fileInputRef}
            isSaving={isSaving}
            isEnhancing={false}
            isEnhancingContent={isEnhancingContent}
            isEnhancingToc={isEnhancingToc}
            isPolishing={isPolishing}
            isChangingPostType={isChangingPostType}
            isApplyingSearch={isApplyingSearch}
            isSpinRecreating={isSpinRecreating}
            handleImageUploadClick={() => { }}
            handleImageChange={() => { }}
            handleUpdateCaption={() => { }}
            handleDeleteImage={() => { }}
            handleEnhanceContent={handleEnhanceContent}
            handleSavePostToSupabase={() => handleSave()}
            isDetailMode
            targetKeyword={data.targetKeyword ?? ""}
            manuscriptId={data.id}
            contentImageSourceType="writing_creaibox_posts"
            isListSidebarCollapsed={isListSidebarCollapsed}
            onToggleListSidebar={() => setIsListSidebarCollapsed(!isListSidebarCollapsed)}
            selectedPersonaId={selectedPersonaId}
            setSelectedPersonaId={handleSelectPersona}
            selectedKnowledgeId={selectedKnowledgeId}
            setSelectedKnowledgeId={handleSelectKnowledge}
            userRole={userRole}
            userBrandId={userBrandId}
            userBrandIds={userBrandIds}
            extraConfigs={extraConfigs}
          />
        </main>

        {/* 오른쪽 발행 정보 */}
        <aside className="h-full overflow-y-auto custom-scrollbar border-l border-white/10 bg-[#0b0f15]">
          <div className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#141926] to-[#10141f] px-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => void handlePublish()}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#ec4899] px-3.5 py-2 text-xs font-black text-white shadow-[0_8px_18px_rgba(124,58,237,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                {isSaving ? "처리 중..." : data?.status === "published" ? "블로그 재발행" : "블로그 발행"}
              </button>
              <button
                onClick={() => void handleCancelPublish()}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 transition hover:border-rose-400/35 hover:bg-rose-500/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                발행 취소
              </button>
            </div>
            <span
              className={`inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${publishingStatusClass}`}
            >
              {publishingStatus}
            </span>
            {publishFeedback && (
              <div className="absolute left-0 top-full z-20 mt-3 rounded-2xl border border-violet-400/30 bg-[#18121f] px-4 py-3 text-sm font-bold text-violet-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                {publishFeedback}
              </div>
            )}
          </div>

          <section className="border-b border-zinc-800 text-white">
            <div className="sticky top-14 z-20 grid h-14 grid-cols-4 border-b border-white/10 bg-[#0b0f15]">
              {[
                { key: "seo", label: "SEO 최적화" },
                { key: "thumbnail", label: "썸네일" },
                { key: "contentImage", label: "본문 이미지" },
                { key: "schema", label: "스키마" },
              ].map((tab) => {
                const active = publishingPanelTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setPublishingPanelTab(tab.key as PublishingPanelTab)}
                    className={`relative border-r border-white/10 text-sm font-black transition last:border-r-0 ${active
                      ? "bg-blue-500/8 text-blue-200"
                      : "text-white/45 hover:bg-white/[0.025] hover:text-blue-100"
                      }`}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {publishingPanelTab === "seo" && (
              <CreaiboxSeoOptimizationPanel
                data={data}
                updateLocalData={updateLocalData}
                userRole={userRole}
                userBrandId={userBrandId}
                userBrandIds={userBrandIds}
                extraConfigs={extraConfigs}
                onGenerateSeo={handleGenerateSeo}
                isGeneratingSeo={isGeneratingSeo}
              />
            )}
            {publishingPanelTab === "thumbnail" && (
              <CreaiboxThumbnailPanel data={data} />
            )}
            {publishingPanelTab === "contentImage" && <CreaiboxContentImagePanel data={data} />}
            {publishingPanelTab === "schema" && (
              <CreaiboxSchemaPanel data={data} updateLocalData={updateLocalData} />
            )}
          </section>

          {publishingPanelTab === "seo" && (
            <div>
              <CreaiboxAnalysisTower
                seoScore={0}
                seoChecks={{
                  titleKeyword: false,
                  contentDensity: false,
                  duplicateSafe: true,
                  lengthCheck: false,
                  structureCheck: false,
                  subHeadingCheck: false,
                }}
                posRatio={{
                  noun: 0,
                  verb: 0,
                  other: 0,
                }}
                frequencies={[]}
                content={data.content ?? ""}
                title={data.title ?? ""}
                focusKeyword={data.focusKeyword ?? data.targetKeyword ?? ""}
                metaDescription={data.metaDescription ?? ""}
                slug={data.slug ?? ""}
                canonicalUrl={data.canonicalUrl ?? ""}
                seoTags={data.seoTags ?? []}
                crawlabilityScore={0}
                isDensitySafe={true}
                isDetailMode
                updateLocalData={updateLocalData}
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
