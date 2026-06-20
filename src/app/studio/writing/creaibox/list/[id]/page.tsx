"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, RotateCcw, Search, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import UniversalBlogEditor from "@/components/writing/editor/UniversalBlogEditor";
import CreaiboxAnalysisTower from "@/components/writing/creaibox/tabs/CreaiboxAnalysisTower";
import CreaiboxContentImagePanel from "@/components/writing/creaibox/tabs/CreaiboxContentImagePanel";
import CreaiboxSchemaPanel from "@/components/writing/creaibox/tabs/CreaiboxSchemaPanel";
import CreaiboxSeoOptimizationPanel from "@/components/writing/creaibox/tabs/CreaiboxSeoOptimizationPanel";
import CreaiboxThumbnailPanel from "@/components/writing/creaibox/tabs/CreaiboxThumbnailPanel";
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

function buildCanonicalUrl(slug: string, role?: string, brandId?: string) {
  if (role === "ADMIN") {
    return `https://creaibox.com/blog/${slug}`;
  }
  if (brandId) {
    return `https://${brandId}.creaibox.com/${slug}`;
  }
  return `https://creaibox.com/blog/${slug}`;
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
  };
}

export default function CreaiboxManuscriptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirectLoading, setIsDirectLoading] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [isEnhancingContent, setIsEnhancingContent] = useState(false);
  const [isEnhancingToc, setIsEnhancingToc] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isChangingPostType, setIsChangingPostType] = useState(false);
  const [isApplyingSearch, setIsApplyingSearch] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState("");
  const [publishingPanelTab, setPublishingPanelTab] = useState<PublishingPanelTab>("seo");

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
  const [data, setData] = useState<StudioManuscriptRecord | null>(null);
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
  const strategyLevelParam = searchParams?.get("strategyLevel") || "";
  const resultFormatParam = searchParams?.get("resultFormat") || "";
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
  const [aiWordCountGoal, setAiWordCountGoal] = useState(wordCountParam);
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
        if (prof?.brand_id) setUserBrandId(prof.brand_id);
        if (prof?.extra_configs) setExtraConfigs(prof.extra_configs);

        const approvedBrands: string[] = [];
        if (prof?.brand_id) {
          approvedBrands.push(prof.brand_id);
        }
        if (prof?.extra_configs?.brand_ids && Array.isArray(prof.extra_configs.brand_ids)) {
          prof.extra_configs.brand_ids.forEach((b: string) => {
            if (b && !approvedBrands.includes(b)) {
              approvedBrands.push(b);
            }
          });
        }
        setUserBrandIds(approvedBrands);
      }
    };
    void getProfile();
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

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

  const fetchDirectDetail = useCallback(async () => {
    if (!activeRouteId || data || isDirectLoading) return;

    setIsDirectLoading(true);

    const isNumeric = /^\d+$/.test(activeRouteId);
    let queryBuilder = supabase.from("writing_creaibox_posts").select("*");

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

  const filteredManuscripts = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) return sidebarList;

    return sidebarList.filter((item) => {
      const title = item.title ?? "";
      const targetKeyword = item.targetKeyword ?? "";

      return title.toLowerCase().includes(lower) || targetKeyword.toLowerCase().includes(lower);
    });
  }, [sidebarList, searchTerm]);

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
      if (userRole !== "ADMIN" && userBrandId) {
        const prefix = `https://${userBrandId}.creaibox.com`;
        if (!canonicalUrl.startsWith(prefix)) {
          canonicalUrl = `${prefix}/${slug}`;
        }
      } else {
        if (!canonicalUrl) {
          canonicalUrl = buildCanonicalUrl(slug, userRole, userBrandId);
        }
      }

      const now = new Date().toISOString();
      const nextStatus = (status ?? safeData.status ?? "draft") as StudioManuscriptRecord["status"];

      const updatePayload = {
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
        category_id: safeData.categoryId ?? null,
        toc_enabled: safeData.tocEnabled ?? true,
      };

      const { error } = await supabase
        .from("writing_creaibox_posts")
        .update(updatePayload)
        .eq("id", safeData.id);

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
        categoryId: safeData.categoryId,
        tocEnabled: safeData.tocEnabled ?? true,
      };

      setData(nextRecord);
      setHasLocalEdits(false);
      persistCaches(nextRecord);

      return true;
    },
    [data, persistCaches, supabase, userRole, userBrandId]
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

      const prompt = `
        당신은 Creaibox의 전문 블로그 콘텐츠 에디터입니다. 
        - 주제: ${targetKeyword}
        - 콘텐츠 유형: ${contentType || "블로그 글쓰기 콘텐츠"}
        - 포스트 타입: ${postType || "🧠 AI 인사이트 포스팅"}
        - 어조: ${selectedTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)"}
        - 길이 규격: ${lengthPrompt.label}
        - 목표 분량: 약 ${finalWordCountGoal}자
        - 길이 작성 지침: ${lengthPrompt.instruction}
        - 전략 수준: ${strategyLevel || "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)"}
        - 결과 구성: ${resultFormat || "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)"}
        - 대분류: ${largeCategory || "미지정"}
        - 상세 분야: ${mainTopic || "미지정"}
        - 추천 시리즈: ${subTopic || "미지정"}
        - 참고 사항: ${referenceNote || "미지정"}
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
        canonicalUrl: buildCanonicalUrl(nextSlug, userRole, userBrandId),
        detailLabel: postType,
      };

      setAiStatusMessage("생성이 완료되었습니다. 아카이브에 자동 저장 중입니다...");
      
      const saveSuccess = await handleSave("saved", true, updatedRecord);
      
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
  }, [data, activeRouteId, manuscriptId, aiItemId, aiCampaignId, userRole, userBrandId, handleSave]);

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

  const updateLocalData = useCallback((patch: Partial<StudioManuscriptRecord>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
    setHasLocalEdits(true);
  }, []);

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
        void handleSave("saved");
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

응답 JSON 구조:
{
  "focusKeyword": "글의 핵심이 되는 타겟 키워드 1개 (예: '골프 스윙 팁')",
  "metaDescription": "검색 결과 페이지(SERP)에 표시될 매력적이고 요약된 설명문 (70자 이상 120자 이하)",
  "seoTags": ["글의 맥락을 보여주는 핵심 키워드 태그 3~5개 배열"],
  "slug": "URL 경로로 사용할 영어 소문자 및 하이픈(-) 조합의 슬러그 (예: 'golf-swing-basic-guide')"
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

      updateLocalData({
        focusKeyword: parsedSeo.focusKeyword || "",
        metaDescription: parsedSeo.metaDescription || "",
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

      if (option.startsWith("expand_")) {
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
        if (option.startsWith("expand_")) {
          if (option.includes("toc_")) {
            const count = option.replace("expand_toc_", "");
            promptInstruction = `현재 본문에 있는 기존 목차(H2 등)들과 긴밀하게 연관되고 이어지는 새로운 목차(H2 또는 H3 태그)를 정확히 ${count}개 생성하여 추가해 주세요. 또한, 새로 추가된 각 목차 하위에는 상세하고 깊이 있는 설명 문단(글 내용)도 함께 작성해서 본문의 마지막 또는 문맥상 적합한 위치에 자연스럽게 덧붙여 전체 원고의 분량을 확장해 주세요. 기존에 존재하던 목차나 본문 내용은 절대로 삭제, 수정, 축소하지 마십시오.`;
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

        const prompt = `당신은 전문 콘텐츠 에디터이자 SEO 작가입니다. 제공된 원고 제목과 본문(HTML 형식)을 기반으로, 지시사항에 따라 본문을 더 완성도 높고 알차게 보강(확장)해 주세요.

[원고 제목]: ${data.title}
[원고 태그/키워드]: ${data.targetKeyword ?? ""}
[기존 본문 (HTML)]:
${data.content ?? ""}

[지시사항]:
${promptInstruction}

[출력 형식 및 제약 조건]:
1. 반드시 기존 본문 내용의 맥락을 누락하지 말고, 내용을 더 풍성하게 다듬거나 확장해야 합니다.
2. 마크다운 기호(예: ** 혹은 * 등)가 아닌 기존 본문에 맞춰 <h2>, <h3>, <p>, <ul>, <li>, <strong> 등 적합한 HTML 태그 형태로 결과를 작성해야 합니다.
3. 지시사항 외의 다른 부연 설명이나 마크다운 백틱(예: \`\`\`html 등)은 절대 포함하지 말고, 브라우저에서 바로 사용할 수 있는 순수한 HTML 본문 코드만 출력하세요.`;

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
        enhancedHtml = enhancedHtml.replace(/^```html\s*/i, "").replace(/```$/, "").trim();

        if (enhancedHtml) {
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
      }
    },
    [data, supabase, updateLocalData]
  );

  useEffect(() => {
    if (!hasLocalEdits || !data || isSaving) return;

    const timer = setTimeout(() => {
      console.log("Creaibox 자동 저장 실행 중...");
      void handleSave("saved", true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [data?.title, data?.content, hasLocalEdits, isSaving, handleSave]);

  const publishingStatus = useMemo(() => {
    if (!data) return "대기 중";

    if (data.status === "published") return "발행 완료";
    if (data.status === "trash") return "휴지통";
    return "저장 완료";
  }, [data]);

  const publishingStatusClass = useMemo(() => {
    if (data?.status === "published") return "bg-emerald-500/10 text-emerald-300";
    if (data?.status === "trash") return "bg-rose-500/10 text-rose-300";
    return "bg-sky-500/10 text-sky-300";
  }, [data?.status]);

  const handlePublish = useCallback(async () => {
    if (data?.status === "published") {
      showPublishFeedback("이미 발행이 완료된 글입니다.");
      return;
    }

    const publishedSlug = buildPublicBlogSlug(
      data?.title,
      data?.focusKeyword,
      data?.targetKeyword
    );

    const published = await handleSave("published");

    if (published) {
      try {
        await fetch("/api/revalidate-blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: publishedSlug,
          }),
        });
      } catch {
        // revalidate 실패는 발행 자체를 막지 않음
      }

      showPublishFeedback("블로그 발행이 완료되었습니다.");
    }
  }, [data, handleSave, showPublishFeedback]);

  const handleCancelPublish = useCallback(async () => {
    const canceled = await handleSave("saved");

    if (canceled) {
      showPublishFeedback("발행이 취소되었습니다.");
    }
  }, [handleSave, showPublishFeedback]);

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
      <div className="grid h-full w-full grid-cols-[360px_minmax(0,1fr)_420px]">

        {/* 왼쪽 글 목록 */}
        <aside className="h-full overflow-y-auto custom-scrollbar border-r border-violet-500/20 bg-[#0b0f15] p-4 text-[13px]">
          <button
            type="button"
            onClick={() => {
              if (hasLocalEdits) {
                void handleSave("saved");
              }
              router.push("/studio/writing/creaibox/list");
            }}
            className="mb-5 flex w-full items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-left text-[13px] font-bold text-white/80 transition hover:border-violet-400/40 hover:bg-violet-500/10"
          >
            <ArrowLeft className="h-4 w-4 text-violet-300" />
            목록으로 돌아가기
          </button>

          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300/60" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="원고 검색..."
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/30 py-3 pl-11 pr-4 text-[13px] font-medium text-white outline-none transition placeholder:text-white/30 focus:border-violet-500/50"
            />
          </div>

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
            handleImageUploadClick={() => { }}
            handleImageChange={() => { }}
            handleUpdateCaption={() => { }}
            handleDeleteImage={() => { }}
            handleEnhanceContent={handleEnhanceContent}
            handleSavePostToSupabase={() => handleSave("saved")}
            isDetailMode
            targetKeyword={data.targetKeyword ?? ""}
            manuscriptId={data.id}
            contentImageSourceType="writing_creaibox_posts"
            onGenerateSeo={handleGenerateSeo}
            isGeneratingSeo={isGeneratingSeo}
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
            isAiGenerating={isAiGenerating}
            aiStatusMessage={aiStatusMessage}
            aiErrorMessage={aiErrorMessage}
            handleAiGenerateInEditor={handleAiGenerateInEditor}
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
                {isSaving ? "처리 중..." : "블로그 발행"}
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
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
