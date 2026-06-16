"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { StudioManuscriptRecord } from "@/lib/queries/manuscripts";

interface CreaiboxSeoOptimizationPanelProps {
  data: StudioManuscriptRecord;
  updateLocalData: (patch: Partial<StudioManuscriptRecord>) => void;
  userRole?: string;
  userBrandId?: string;
  userBrandIds?: string[];
  extraConfigs?: any;
}

const TITLE_LIMIT = 60;
const SLUG_LIMIT = 75;
const META_DESCRIPTION_LIMIT = 160;

function toTagList(value?: string[] | null) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
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
}: CreaiboxSeoOptimizationPanelProps) {
  const [isSnippetOpen, setIsSnippetOpen] = useState(true);
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

  return (
    <div>
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
                updateLocalData({ canonicalUrl: val });
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
              value={toTagList(data.seoTags).join(", ")}
              onChange={(event) =>
                updateLocalData({
                  seoTags: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              className="min-h-[90px] w-full resize-none rounded-md border border-transparent bg-white px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none"
            />
            <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-zinc-500">
              콘텐츠와 연결할 SEO 태그를 쉼표로 구분해 입력합니다.
            </p>
          </label>

          <div className="flex flex-wrap gap-2">
            {toTagList(data.seoTags).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
