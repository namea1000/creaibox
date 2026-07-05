"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Check, Plus, Loader2 } from "lucide-react";
import type { StudioManuscriptRecord } from "@/lib/queries/manuscripts";
import { createClient } from "@/utils/supabase/client";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  user_id: string;
  brand_id?: string | null;
}

interface CreaiboxSeoOptimizationPanelProps {
  data: StudioManuscriptRecord;
  updateLocalData: (patch: Partial<StudioManuscriptRecord>) => void;
  userRole?: string;
  userBrandId?: string;
  userBrandIds?: string[];
  extraConfigs?: any;
  onGenerateSeo?: () => Promise<void>;
  isGeneratingSeo?: boolean;
}

const TITLE_LIMIT = 60;
const SLUG_LIMIT = 75;
const META_DESCRIPTION_LIMIT = 160;

function toTagList(value?: string[] | null) {
  if (!Array.isArray(value)) return [];
  const cleanTags = value.filter(Boolean).map((t) => t.trim());
  return Array.from(new Set(cleanTags));
}

function compactText(value?: string | null, fallback = "") {
  return (value || fallback).replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function buildPreviewUrl(
  data: StudioManuscriptRecord,
  role?: string,
  brandId?: string,
  userBrandIds?: string[],
  extraConfigs?: any
) {
  if (data.canonicalUrl) return data.canonicalUrl;
  
  const defaultBrand = brandId || (userBrandIds && userBrandIds[0]) || "";
  if (!defaultBrand) return `https://creaibox.com/blog/${data.slug || ""}`;
  
  const isPrimary = defaultBrand === brandId;
  const customDom = extraConfigs?.[`custom_domain_${defaultBrand}`] || (isPrimary ? extraConfigs?.custom_domain : "");
  const customDomStatus = extraConfigs?.[`custom_domain_status_${defaultBrand}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
  
  const domainPrefix = (customDomStatus === "APPROVED" && customDom)
    ? `https://${customDom}`
    : `https://${defaultBrand}.creaibox.com`;
    
  if (data.slug) {
    if (role === "ADMIN") return `https://creaibox.com/blog/${data.slug}`;
    return `${domainPrefix}/${data.slug}`;
  }
  if (role === "ADMIN") return "https://creaibox.com/blog";
  return domainPrefix;
}

function buildCanonicalUrlFromSlug(
  slug: string,
  currentCanonical?: string,
  role?: string,
  brandId?: string,
  userBrandIds?: string[],
  extraConfigs?: any
) {
  const cleanSlug = slug.trim().replace(/^\/+/, "");
  
  const defaultBrand = brandId || (userBrandIds && userBrandIds[0]) || "";
  
  const getDomainPrefix = (bid: string) => {
    const isPrimary = bid === brandId;
    const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
    const customDomStatus = extraConfigs?.[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
    return (customDomStatus === "APPROVED" && customDom)
      ? `https://${customDom}`
      : `https://${bid}.creaibox.com`;
  };

  if (currentCanonical) {
    if (currentCanonical.startsWith("https://creaibox.com")) {
      return cleanSlug ? `https://creaibox.com/blog/${cleanSlug}` : "https://creaibox.com/blog";
    }
    const activeBrands = userBrandIds || (brandId ? [brandId] : []);
    for (const bid of activeBrands) {
      const prefix = getDomainPrefix(bid);
      const subPrefix = `https://${bid}.creaibox.com`;
      if (currentCanonical.startsWith(prefix) || currentCanonical.startsWith(subPrefix)) {
        return cleanSlug ? `${prefix}/${cleanSlug}` : prefix;
      }
    }
  }
  
  if (role === "ADMIN") {
    return cleanSlug ? `https://creaibox.com/blog/${cleanSlug}` : "https://creaibox.com/blog";
  }
  if (defaultBrand) {
    const prefix = getDomainPrefix(defaultBrand);
    return cleanSlug ? `${prefix}/${cleanSlug}` : prefix;
  }
  return cleanSlug ? `https://creaibox.com/blog/${cleanSlug}` : "https://creaibox.com/blog";
}

function LengthMeter({
  current,
  max,
  idealMin,
}: {
  current: number;
  max: number;
  idealMin: number;
}) {
  const activeSegments = Math.min(5, Math.max(0, Math.ceil((current / max) * 5)));
  const isOver = current > max;
  const isGood = current >= idealMin && current <= max;
  const colors = isOver
    ? ["bg-rose-500", "bg-rose-500", "bg-rose-500", "bg-rose-500", "bg-rose-500"]
    : ["bg-red-500", "bg-orange-500", "bg-amber-400", "bg-lime-500", "bg-emerald-500"];
  const textColor = isOver ? "text-rose-300" : isGood ? "text-emerald-300" : "text-amber-300";

  return (
    <span className="flex items-center gap-2">
      <span className={`text-xs font-medium ${textColor}`}>
        {current}/{max}
      </span>
      <span className="flex h-1.5 w-24 overflow-hidden rounded-full bg-zinc-700/60">
        {colors.map((color, index) => (
          <span
            key={`${color}-${index}`}
            className={`h-full flex-1 border-r border-black/20 last:border-r-0 ${color} ${index < activeSegments ? "opacity-100" : "opacity-20"
              }`}
          />
        ))}
      </span>
    </span>
  );
}

function SnippetPreview({
  title,
  url,
  description,
  className = "",
}: {
  title: string;
  url: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 truncate text-[13px] font-medium text-zinc-400">
        {truncateText(url, 54)}
      </p>
      <h4 className="line-clamp-2 text-[18px] font-semibold leading-snug text-[#8ab4f8]">
        {truncateText(title, 58)}
      </h4>
      <p className="mt-1 line-clamp-4 text-[13px] leading-relaxed text-zinc-400">
        {truncateText(description, 190)}
      </p>
    </div>
  );
}

export default function CreaiboxSeoOptimizationPanel({
  data,
  updateLocalData,
  userRole,
  userBrandId,
  userBrandIds,
  extraConfigs,
  onGenerateSeo,
  isGeneratingSeo = false,
}: CreaiboxSeoOptimizationPanelProps) {
  const [isSnippetOpen, setIsSnippetOpen] = useState(true);
  const [isBasicSettingsOpen, setIsBasicSettingsOpen] = useState(true);

  // Category list & loading states
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Add category inline states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

  const [tagInputValue, setTagInputValue] = useState("");
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const externalTagsStr = toTagList(data.seoTags).join(", ");
    const currentLocalTagsStr = tagInputValue
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .join(", ");

    if (externalTagsStr !== currentLocalTagsStr) {
      setTagInputValue(externalTagsStr);
    }
  }, [data.seoTags]);

  // Resolve the active brand for this post based on its canonical URL or available brands
  const activeBrandForPost = useMemo(() => {
    const canonical = data.canonicalUrl || "";
    const brands = userBrandIds || (userBrandId ? [userBrandId] : []);
    if (brands.length === 0) return "blog";

    // 1. Try to find if canonical URL matches standard subdomain: https://{brand_id}.creaibox.com
    for (const bid of brands) {
      if (canonical.includes(`://${bid}.creaibox.com`)) {
        return bid;
      }
    }

    // 2. Try to find if canonical URL matches custom domains in extraConfigs
    if (extraConfigs) {
      for (const bid of brands) {
        const isPrimary = bid === userBrandId;
        const customDom = extraConfigs[`custom_domain_${bid}`] || (isPrimary ? extraConfigs.custom_domain : "");
        const customDomStatus = extraConfigs[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs.custom_domain_status : "NONE");
        if (customDomStatus === "APPROVED" && customDom && canonical.includes(`://${customDom}`)) {
          return bid;
        }
      }
    }

    // 3. Fallback to primary brand ID
    return userBrandId || brands[0] || "blog";
  }, [data.canonicalUrl, userBrandId, userBrandIds, extraConfigs]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const { data: cats, error } = await supabase
          .from("blog_categories")
          .select("*")
          .eq("brand_id", activeBrandForPost)
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (cats) {
          setCategories(cats as BlogCategory[]);
        }
      } catch (err) {
        console.error("Failed to load blog categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, [supabase, activeBrandForPost]);

  // Handle category selection
  const handleSelectCategory = (catId: string) => {
    const currentIds = data.categoryIds || (data.categoryId ? [data.categoryId] : []);
    let nextIds: string[];
    if (currentIds.includes(catId)) {
      nextIds = currentIds.filter((id) => id !== catId);
    } else {
      nextIds = [...currentIds, catId];
    }
    updateLocalData({
      categoryIds: nextIds,
      categoryId: nextIds[0] || undefined,
    });
  };

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  // Inline category creation handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;

    let slugVal = newCatSlug.trim().toLowerCase();
    if (!slugVal) {
      slugVal = generateSlugFromName(name);
    }

    if (!slugVal) {
      alert("올바른 카테고리 슬러그를 입력해 주세요.");
      return;
    }

    if (!/^[a-z0-9가-힣_-]{2,30}$/i.test(slugVal)) {
      alert("슬러그는 영문, 한글, 숫자, 하이픈(-), 언더바(_) 조합 2~30자만 가능합니다.");
      return;
    }

    if (categories.some((c) => c.slug === slugVal)) {
      alert("이미 존재하는 슬러그입니다.");
      return;
    }

    setIsAddingCat(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("로그인 세션이 만료되었습니다.");
        return;
      }

      const { data: newCat, error } = await supabase
        .from("blog_categories")
        .insert({
          user_id: user.id,
          brand_id: activeBrandForPost || null,
          name,
          slug: slugVal,
        })
        .select()
        .single();

      if (error) throw error;

      if (newCat) {
        setCategories((prev) => [...prev, newCat as BlogCategory]);
        updateLocalData({ categoryId: newCat.id });
        setNewCatName("");
        setNewCatSlug("");
        setShowAddCategory(false);
      }
    } catch (err: any) {
      alert(`카테고리 추가 실패: ${err.message}`);
    } finally {
      setIsAddingCat(false);
    }
  };

  const previewTitle = compactText(data.title, "제목 없음");
  const previewUrl = buildPreviewUrl(data, userRole, userBrandId, userBrandIds, extraConfigs);
  const previewDescription = compactText(
    data.metaDescription,
    compactText(data.content, "메타 설명을 입력하면 검색 결과 설명으로 표시됩니다.")
  );

  let selectedBrand: string | null = null;
  const currentCanonical = data.canonicalUrl || "";
  if (currentCanonical.startsWith("https://creaibox.com")) {
    selectedBrand = "official";
  } else {
    const activeBrands = userBrandIds || (userBrandId ? [userBrandId] : []);
    for (const bid of activeBrands) {
      const isPrimary = bid === userBrandId;
      const subPrefix = `https://${bid}.creaibox.com`;
      const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
      
      const isSub = currentCanonical.startsWith(subPrefix);
      const isCust = customDom && (currentCanonical.startsWith(`https://${customDom}`) || currentCanonical.startsWith(`http://${customDom}`));
      
      if (isSub || isCust) {
        selectedBrand = bid;
        break;
      }
    }
  }

  if (!selectedBrand) {
    if (userRole === "ADMIN") {
      selectedBrand = "official";
    } else if (userBrandIds && userBrandIds.length > 0) {
      selectedBrand = userBrandIds[0];
    }
  }

  // Statistics calculations
  const contentStr = data.content || "";
  const charCountWithSpaces = contentStr.length;
  const charCountWithoutSpaces = contentStr.replace(/\s+/g, "").length;
  const headingCount = (contentStr.match(/<h[2-4]\b/gi) || []).length + 
                       (contentStr.match(/^#{2,4}\s+.+$/gm) || []).length;
  const blockquoteCount = (contentStr.match(/<blockquote\b/gi) || []).length + 
                          (contentStr.match(/^>\s+.+$/gm) || []).length;
  const imageCount = (contentStr.match(/<img\b/gi) || []).length + 
                     (contentStr.match(/!\[.*?\]\(.*?\)/g) || []).length;

  return (
    <div className="flex flex-col gap-px">
      
      {onGenerateSeo && (
        <div className="p-4 border-b border-zinc-800 bg-[#0c1017]/80 shrink-0">
          <button
            type="button"
            onClick={onGenerateSeo}
            disabled={isGeneratingSeo || !data.title}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:brightness-110 active:scale-[0.99] transition-all text-xs font-black text-white shadow-md shadow-violet-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingSeo ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <span className="text-yellow-400 font-black">✨</span>
            )}
            <span>{isGeneratingSeo ? "SEO 최적화 생성 중..." : "AI SEO최적화 자동 생성"}</span>
          </button>
        </div>
      )}

      {/* 1단: Cre Snippet Editor */}
      <section>
        <button
          type="button"
          onClick={() => setIsSnippetOpen((open) => !open)}
          className="flex h-14 w-full items-center justify-between bg-gradient-to-r from-[#131722] via-[#111827] to-[#0d1117] px-5 text-left transition hover:bg-blue-500/5"
        >
          <span className="text-sm font-black uppercase tracking-[0.12em] text-white">
            Cre Snippet Editor
          </span>
          {isSnippetOpen ? (
            <ChevronUp className="h-4 w-4 text-white/70" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/70" />
          )}
        </button>

        {isSnippetOpen && (
          <div className="space-y-4 px-5 py-4">
            <section className="border-b border-zinc-800 pb-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-black text-white">미리보기</span>
              </div>
              <SnippetPreview
                title={previewTitle}
                url={previewUrl}
                description={previewDescription}
              />
              <p className="mt-2 text-[12px] font-medium leading-relaxed text-zinc-500">
                이 게시물이 검색 결과에 나타날 때 첫 번째 줄에 표시됩니다.
              </p>
            </section>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
                <span>Title</span>
                <LengthMeter
                  current={previewTitle.length}
                  max={TITLE_LIMIT}
                  idealMin={35}
                />
              </div>
              <input
                value={data.title || ""}
                onChange={(event) => updateLocalData({ title: event.target.value })}
                className="w-full rounded-md border border-transparent bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none"
              />
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-zinc-500">
                이 게시물이 검색 결과에 나타날 때 첫 번째 줄에 표시됩니다.
              </p>
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
                <span>Slug (최대 75자까지 가능)</span>
                <LengthMeter
                  current={(data.slug || "").length}
                  max={SLUG_LIMIT}
                  idealMin={20}
                />
              </div>
              <input
                value={data.slug || ""}
                onChange={(event) => {
                  const nextSlug = event.target.value;
                  updateLocalData({
                    slug: nextSlug,
                    canonicalUrl: buildCanonicalUrlFromSlug(nextSlug, data.canonicalUrl, userRole, userBrandId, userBrandIds, extraConfigs),
                  });
                }}
                className="w-full rounded-md border border-transparent bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none"
              />
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-zinc-500">
                검색 결과의 게시물 제목 아래에 표시되는 이 페이지의 고유 URL입니다.
              </p>
            </label>

            <div className="block">
              <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
                <span>Canonical URL (20~45자가 가장 깔끔한 권장 구간)</span>
                <span className="text-xs font-medium text-white/45">
                  {(data.canonicalUrl || "").length}
                </span>
              </div>

              {/* Subdomain selector button bar */}
              {userBrandIds && userBrandIds.length > 0 && (
                <div className="mb-2">
                  <span className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">
                    도메인 선택
                  </span>
                  <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    {userRole === "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => {
                          const cleanSlug = (data.slug || "").trim().replace(/^\/+/, "");
                          updateLocalData({
                            canonicalUrl: cleanSlug ? `https://creaibox.com/blog/${cleanSlug}` : "https://creaibox.com/blog",
                          });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-tight transition-all ${
                          selectedBrand === "official"
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                        }`}
                      >
                        creaibox.com (공식)
                      </button>
                    )}
                    {userBrandIds.map((bid) => {
                      const isPrimary = bid === userBrandId;
                      const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
                      const customDomStatus = extraConfigs?.[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
                      const hasCustom = customDomStatus === "APPROVED" && customDom;
                      
                      const label = hasCustom ? customDom : `${bid}.creaibox.com`;
                      const basePrefix = hasCustom ? `https://${customDom}` : `https://${bid}.creaibox.com`;

                      return (
                        <button
                          key={bid}
                          type="button"
                          onClick={() => {
                            const cleanSlug = (data.slug || "").trim().replace(/^\/+/, "");
                            updateLocalData({
                              canonicalUrl: cleanSlug ? `${basePrefix}/${cleanSlug}` : basePrefix,
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-tight transition-all ${
                            selectedBrand === bid
                              ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <input
                value={data.canonicalUrl || ""}
                onChange={(event) => {
                  let val = event.target.value;
                  if (userRole !== "ADMIN") {
                    const activeBrands = userBrandIds || (userBrandId ? [userBrandId] : []);
                    const matchesAny = activeBrands.some(bid => {
                      const isPrimary = bid === userBrandId;
                      const subPrefix = `https://${bid}.creaibox.com`;
                      const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
                      const customDomStatus = extraConfigs?.[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
                      const hasCustom = customDomStatus === "APPROVED" && customDom;
                      
                      if (val.startsWith(subPrefix)) return true;
                      if (hasCustom && (val.startsWith(`https://${customDom}`) || val.startsWith(`http://${customDom}`))) return true;
                      return false;
                    });

                    if (!matchesAny && activeBrands.length > 0) {
                      const bid = activeBrands[0];
                      const isPrimary = bid === userBrandId;
                      const customDom = extraConfigs?.[`custom_domain_${bid}`] || (isPrimary ? extraConfigs?.custom_domain : "");
                      const customDomStatus = extraConfigs?.[`custom_domain_status_${bid}`] || (isPrimary ? extraConfigs?.custom_domain_status : "NONE");
                      const hasCustom = customDomStatus === "APPROVED" && customDom;
                      
                      const defaultPrefix = hasCustom ? `https://${customDom}` : `https://${bid}.creaibox.com`;
                      if (val.startsWith("https://creaibox.com/blog")) {
                        val = val.replace("https://creaibox.com/blog", defaultPrefix);
                      } else if (val.startsWith("https://creaibox.com")) {
                        val = val.replace("https://creaibox.com", defaultPrefix);
                      } else {
                        const match = val.match(/https?:\/\/[^\/]+(.*)/);
                        const path = match ? match[1] : "";
                        val = `${defaultPrefix}${path.startsWith("/") ? "" : "/"}${path}`;
                      }
                    }
                  }

                  // Canonical URL에서 슬러그를 추출하여 동기화
                  const cleanUrl = val.split("?")[0].split("#")[0].replace(/\/+$/, "");
                  const pathSegments = cleanUrl.split("/");
                  const extractedSlug = pathSegments[pathSegments.length - 1] || "";
                  
                  // 추출한 값이 도메인이거나 프로토콜이 아닌 경우에만 슬러그로 설정
                  const isDomain = 
                    extractedSlug.includes(".") || 
                    extractedSlug.includes(":") || 
                    extractedSlug === "localhost" || 
                    extractedSlug === "blog";

                  updateLocalData({
                    canonicalUrl: val,
                    ...(isDomain ? {} : { slug: extractedSlug }),
                  });
                }}
                className="w-full rounded-md border border-transparent bg-white px-4 py-3 text-sm text-[#111111] outline-none"
              />
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-zinc-500">
                검색엔진에 기준 주소로 전달되는 정식 URL입니다.
              </p>
            </div>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
                <span>Meta Description</span>
                <LengthMeter
                  current={(data.metaDescription || "").length}
                  max={META_DESCRIPTION_LIMIT}
                  idealMin={120}
                />
              </div>
              <textarea
                value={data.metaDescription || ""}
                onChange={(event) => updateLocalData({ metaDescription: event.target.value })}
                maxLength={META_DESCRIPTION_LIMIT}
                className="min-h-[110px] w-full resize-none rounded-md border border-transparent bg-white px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none"
              />
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-zinc-500">
                이 게시물이 검색 결과에 나타날 때 설명으로 표시됩니다.
              </p>
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
                <span>Focus Keyword</span>
                <span className="text-xs font-medium text-white/45">
                  {(data.focusKeyword || "").length}
                </span>
              </div>
              <input
                value={data.focusKeyword || ""}
                onChange={(event) => updateLocalData({ focusKeyword: event.target.value })}
                className="w-full rounded-md border border-transparent bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none"
              />
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-zinc-500">
                SEO 검사 기준이 되는 핵심 키워드입니다.
              </p>
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
                <span>SEO Tags</span>
                <span className="text-xs font-medium text-white/45">
                  {toTagList(data.seoTags).length}
                </span>
              </div>
              <textarea
                value={tagInputValue}
                onChange={(event) => {
                  const val = event.target.value;
                  setTagInputValue(val);

                  const tags = val
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);

                  updateLocalData({ seoTags: tags });
                }}
                onBlur={() => {
                  const cleanTagsStr = toTagList(data.seoTags).join(", ");
                  setTagInputValue(cleanTagsStr);
                }}
                className="min-h-[90px] w-full resize-none rounded-md border border-transparent bg-white px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none"
              />
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-zinc-500">
                콘텐츠와 연결할 SEO 태그를 쉼표로 구분해 입력합니다.
              </p>
            </label>

            <div className="flex flex-wrap gap-2">
              {toTagList(data.seoTags).map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2단: 포스팅 기본 설정 */}
      <section className="border-t border-zinc-800">
        <button
          type="button"
          onClick={() => setIsBasicSettingsOpen((open) => !open)}
          className="flex h-14 w-full items-center justify-between bg-gradient-to-r from-[#131722] via-[#111827] to-[#0d1117] px-5 text-left transition hover:bg-blue-500/5"
        >
          <span className="text-sm font-black uppercase tracking-[0.12em] text-white">
            포스팅 기본 설정
          </span>
          {isBasicSettingsOpen ? (
            <ChevronUp className="h-4 w-4 text-white/70" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/70" />
          )}
        </button>

        {isBasicSettingsOpen && (
          <div className="space-y-5 px-5 py-4">
            {/* 1. 카테고리 지정 */}
            <div>
              <span className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                카테고리 지정
              </span>
              {isLoadingCategories ? (
                <div className="flex items-center gap-2 text-xs text-zinc-500 py-2">
                  <Loader2 size={12} className="animate-spin text-blue-500" />
                  <span>카테고리를 불러오는 중...</span>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-xs text-zinc-600 py-1">등록된 카테고리가 없습니다.</p>
              ) : (
                <div className="space-y-1.5 p-3 rounded-lg border border-zinc-850 bg-zinc-950/40">
                  {categories.map((cat) => {
                    const isChecked = (data.categoryIds || (data.categoryId ? [data.categoryId] : [])).includes(cat.id);
                    return (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-300 hover:text-white select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectCategory(cat.id)}
                          className="h-3.5 w-3.5 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0 accent-blue-500 cursor-pointer"
                        />
                        <span>{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Inline Add Category form */}
              {!showAddCategory ? (
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="mt-2 flex items-center gap-1 text-[11px] font-black text-blue-400 hover:text-blue-300"
                >
                  <Plus size={11} /> 카테고리 추가
                </button>
              ) : (
                <form onSubmit={handleAddCategory} className="mt-3 p-3 rounded-lg border border-zinc-850 bg-zinc-950/20 space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">카테고리명</label>
                    <input
                      type="text"
                      required
                      placeholder="예: AI 소식"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full rounded bg-zinc-900 border border-zinc-850 px-2 py-1 text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">슬러그 (영문/숫자/한글 2~30자)</label>
                    <input
                      type="text"
                      placeholder="예: ai-news (미입력시 자동 생성)"
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      className="w-full rounded bg-zinc-900 border border-zinc-850 px-2 py-1 text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCatName("");
                        setNewCatSlug("");
                      }}
                      className="px-2 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-[10px] font-black text-zinc-400 hover:text-zinc-300"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingCat}
                      className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-[10px] font-black text-white flex items-center gap-1"
                    >
                      {isAddingCat && <Loader2 size={10} className="animate-spin" />}
                      <span>추가</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 2. 목차 생성 설정 */}
            <div className="border-t border-zinc-900 pt-4">
              <div className="flex items-center justify-between">
                <div className="max-w-[75%]">
                  <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    목차 자동 삽입 (TOC)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium mt-0.5 block leading-normal">
                    본문 내 H2, H3, H4 제목을 분석하여 글 서두에 목차를 자동 렌더링합니다.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={data.tocEnabled ?? true}
                    onChange={(e) => updateLocalData({ tocEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 peer-checked:after:bg-white peer-checked:after:border-blue-500"></div>
                </label>
              </div>
            </div>

            {/* 3. 게시 상태 설정 */}
            <div className="border-t border-zinc-900 pt-4">
              <label className="block">
                <span className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  게시 상태
                </span>
                <select
                  value={data.status || "draft"}
                  onChange={(e) => updateLocalData({ status: e.target.value as any })}
                  className="w-full rounded-md border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-300 outline-none focus:border-zinc-700 cursor-pointer"
                >
                  <option value="draft">임시저장 (Draft)</option>
                  <option value="saved">저장됨 (Saved)</option>
                  <option value="published">발행완료 (Published)</option>
                </select>
              </label>
            </div>

            {/* 4. 본문 실시간 통계 */}
            <div className="border-t border-zinc-900 pt-4">
              <span className="block text-xs font-bold text-zinc-400 mb-2.5 uppercase tracking-wider">
                실시간 본문 통계
              </span>
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-zinc-850 bg-zinc-950/40 text-center">
                <div className="border-r border-zinc-900 py-0.5">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">공백 포함 글자수</span>
                  <span className="text-sm font-black text-zinc-200 mt-1 block">{charCountWithSpaces.toLocaleString()}자</span>
                </div>
                <div className="py-0.5">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">공백 제외 글자수</span>
                  <span className="text-sm font-black text-zinc-200 mt-1 block">{charCountWithoutSpaces.toLocaleString()}자</span>
                </div>
                <div className="col-span-2 border-t border-zinc-900 pt-2.5 mt-0.5 grid grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-500">소제목 (H2~H4)</span>
                    <span className="text-xs font-black text-zinc-300 mt-0.5 block">{headingCount}개</span>
                  </div>
                  <div className="border-x border-zinc-900">
                    <span className="block text-[9px] font-bold text-zinc-500">인용구 (Quote)</span>
                    <span className="text-xs font-black text-zinc-300 mt-0.5 block">{blockquoteCount}개</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-500">이미지 (Image)</span>
                    <span className="text-xs font-black text-zinc-300 mt-0.5 block">{imageCount}개</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
