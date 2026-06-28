"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Eye,
  Edit2,
  FileText,
  Layers3,
  Library,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  fetchContentPlannerCampaigns,
  fetchContentPlannerCampaignDetail,
  moveContentPlannerCampaignToTrash,
} from "@/lib/content-planner/supabase";

type CampaignRow = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  title: string;
  description: string | null;
  strategy_summary: string | null;
  content_type: string | null;
  content_category: string | null;
  campaign_type: string | null;
  goals: string[] | null;
  primary_platform: string | null;
  target_platforms: string[] | null;
  main_keyword: string | null;
  item_count: number | null;
  generated_count: number | null;
  status: string | null;
  is_favorite: boolean | null;
  brand_tone: string | null;
  raw_ai_response: any;
};

type CampaignItemRow = {
  id: string;
  item_order: number | null;
  title: string;
  content_type: string | null;
  primary_platform: string | null;
  main_keyword: string | null;
  opportunity_score: number | null;
  status: string | null;
  selectedTone?: string;
  wordCountGoal?: string;
  raw_ai_response?: any;
};

function formatDisplayDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function ContentPlannerLibraryPage() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<CampaignItemRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await fetchContentPlannerCampaigns();

      if (error) {
        throw error;
      }

      setCampaigns((data ?? []) as CampaignRow[]);
    } catch (error) {
      console.error(error);
      setErrorMessage("콘텐츠 기획 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCampaigns();
  }, [fetchCampaigns]);

  const filteredCampaigns = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      if (campaign.status === "trash") return false;
      if (!keyword) return true;

      return (
        campaign.title.toLowerCase().includes(keyword) ||
        (campaign.description || "").toLowerCase().includes(keyword) ||
        (campaign.strategy_summary || "").toLowerCase().includes(keyword) ||
        (campaign.main_keyword || "").toLowerCase().includes(keyword) ||
        (campaign.content_type || "").toLowerCase().includes(keyword)
      );
    });
  }, [campaigns, searchTerm]);

  const stats = useMemo(() => {
    const totalCampaigns = filteredCampaigns.length;
    const totalItems = filteredCampaigns.reduce(
      (sum, campaign) => sum + (campaign.generated_count || campaign.item_count || 0),
      0
    );
    const platformCount = new Set(
      filteredCampaigns.flatMap((campaign) => campaign.target_platforms || [])
    ).size;

    return {
      totalCampaigns,
      totalItems,
      platformCount,
    };
  }, [filteredCampaigns]);

  const handleOpenCampaign = useCallback(async (campaign: CampaignRow) => {
    try {
      setSelectedCampaign(campaign);
      setSelectedItems([]);
      setIsDetailLoading(true);

      const detail = await fetchContentPlannerCampaignDetail(campaign.id);

      setSelectedItems((detail.items ?? []) as CampaignItemRow[]);
    } catch (error) {
      console.error(error);
      window.alert("콘텐츠 기획 상세를 불러오지 못했습니다.");
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (filteredCampaigns.length > 0) {
        const isStillValid = selectedCampaign && filteredCampaigns.some((c) => c.id === selectedCampaign.id);
        if (!isStillValid) {
          void handleOpenCampaign(filteredCampaigns[0]);
        }
      } else {
        setSelectedCampaign(null);
        setSelectedItems([]);
      }
    }
  }, [isLoading, filteredCampaigns, selectedCampaign, handleOpenCampaign]);

  const handleMoveToTrash = async (campaign: CampaignRow) => {
    if (!window.confirm("이 콘텐츠 기획을 삭제할까요?")) return;

    try {
      const { error } = await moveContentPlannerCampaignToTrash(campaign.id);

      if (error) {
        throw error;
      }

      setCampaigns((prev) =>
        prev.map((item) =>
          item.id === campaign.id ? { ...item, status: "trash" } : item
        )
      );

      if (selectedCampaign?.id === campaign.id) {
        setSelectedCampaign(null);
        setSelectedItems([]);
      }
    } catch (error) {
      console.error(error);
      window.alert("콘텐츠 기획 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-full w-full bg-[#050816] px-4 pb-12 pt-6 text-white sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[24px] border border-zinc-800 bg-gradient-to-br from-slate-950 via-[#0b1020] to-black p-8 shadow-2xl shadow-black/40">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-20 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              <Library size={15} />
              Content Planner Library
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl">
              콘텐츠 기획 라이브러리
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
              저장된 콘텐츠 캠페인과 시리즈를 관리합니다. 하나의 기획에서
              블로그, 네이버, 쇼츠, 롱폼, SNS 제작으로 이어갈 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/studio/content-planner"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-slate-200 hover:border-cyan-300/50"
            >
              <ArrowLeft size={17} />
              플래너로 돌아가기
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  저장된 콘텐츠 기획
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider">
                  <span className="rounded bg-cyan-900/30 px-1.5 py-0.5 text-cyan-300">
                    기획 {stats.totalCampaigns}
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                    아이템 {stats.totalItems}
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                    플랫폼 {stats.platformCount}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                캠페인, 키워드, 플랫폼 기준으로 검색할 수 있습니다.
              </p>
            </div>

            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="기획명, 키워드, 플랫폼 검색"
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              <AlertCircle className="h-5 w-5" />
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <EmptyState text="콘텐츠 기획을 불러오는 중입니다." />
          ) : filteredCampaigns.length === 0 ? (
            <EmptyState text="저장된 콘텐츠 기획이 없습니다." />
          ) : (
            <div className="grid gap-3">
              {filteredCampaigns.map((campaign) => (
                <article
                  key={campaign.id}
                  onClick={() => void handleOpenCampaign(campaign)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition ${selectedCampaign?.id === campaign.id
                    ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-950/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-black text-cyan-200">
                          {campaign.content_type || "기획"}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          {campaign.primary_platform || "멀티"}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          {campaign.generated_count || campaign.item_count || 0}개 아이템
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                        {campaign.title}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-xs text-slate-400 leading-normal">
                        {campaign.description ||
                          campaign.strategy_summary ||
                          "기획 설명이 없습니다."}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[10px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={12} />
                          {formatDisplayDate(campaign.created_at)}
                        </span>
                        <span className="text-slate-700">•</span>
                        <span><strong className="text-slate-400">콘텐츠 유형:</strong> {campaign.content_type || "-"}</span>
                        <span className="text-slate-700">•</span>
                        <span><strong className="text-slate-400">포스트 타입:</strong> {campaign.raw_ai_response?.campaign?.postType || campaign.raw_ai_response?.postType || "-"}</span>
                        <span className="text-slate-700">•</span>
                        <span className="truncate max-w-[150px]" title={campaign.brand_tone || campaign.raw_ai_response?.campaign?.brandTone || "-"}><strong className="text-slate-400">말투:</strong> {campaign.brand_tone || campaign.raw_ai_response?.campaign?.brandTone || "-"}</span>
                        <span className="text-slate-700">•</span>
                        <span><strong className="text-slate-400">대분류:</strong> {campaign.content_category || "-"}</span>
                        <span className="text-slate-700">•</span>
                        <span><strong className="text-slate-400">상세 분야:</strong> {campaign.campaign_type || "-"}</span>
                        <span className="text-slate-700">•</span>
                        <span><strong className="text-slate-400">메인 키워드 주제:</strong> #{campaign.main_keyword || "키워드 없음"}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleMoveToTrash(campaign);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-slate-400 hover:border-red-400/40 hover:text-red-300 transition shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            {!selectedCampaign ? (
              <>
                <h2 className="text-sm font-black text-white">선택한 기획 상세</h2>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  왼쪽 목록에서 콘텐츠 기획을 선택하면 개별 주제와 제작 액션을
                  확인할 수 있습니다.
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-xl font-black tracking-tight text-white leading-snug">
                    {selectedCampaign.title}
                  </h2>
                </div>

                <div>
                  <p className="mb-2.5 text-xs font-bold text-slate-500">
                    기획 아이템
                  </p>

                  <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-bold text-slate-500 border-b border-white/5 pb-2 mt-4">
                    <div>기획 주제 및 키워드</div>
                    <div className="flex items-center gap-10">
                      <div className="w-[260px] text-center">AI 글 생성</div>
                      <div className="w-[60px] text-center">관리</div>
                    </div>
                  </div>

                  {isDetailLoading ? (
                    <p className="text-sm text-slate-500">
                      아이템을 불러오는 중입니다.
                    </p>
                  ) : selectedItems.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      연결된 아이템이 없습니다.
                    </p>
                  ) : (
                    <div className="max-h-[640px] divide-y divide-white/5 overflow-y-auto pr-1">
                      {selectedItems.map((item) => {
                        const isCompleted = item.status === "completed" || item.status === "published";

                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-cyan-400 shrink-0">
                                  #{item.item_order || "-"}
                                </span>
                                <span className="rounded bg-cyan-900/30 px-1 py-0.5 text-[9px] font-bold text-cyan-300 shrink-0">
                                  {item.primary_platform || "플랫폼"}
                                </span>
                                <h4 className="truncate text-sm font-bold text-slate-100">
                                  {item.title}
                                </h4>
                                <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black text-emerald-400 shrink-0">
                                  ★{item.opportunity_score || 0}
                                </span>
                              </div>
                              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                키워드: {item.main_keyword || "없음"}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                              <div className="flex flex-col gap-1 w-[260px] justify-center shrink-0">
                                <div className="flex gap-1 w-full">
                                  <div className="flex-1">
                                    <ActionButton
                                      label="블로그 글 생성"
                                      disabled={isCompleted}
                                      href={`/studio/writing/creaibox/create?source=content-planner&itemId=${item.id}&title=${encodeURIComponent(item.title)}&keyword=${encodeURIComponent(item.main_keyword || "")}&contentType=${encodeURIComponent(item.content_type || "")}&selectedTone=${encodeURIComponent(item.selectedTone || item.raw_ai_response?.selectedTone || "전문적이고 통찰력 있는 분석 (기술 블로그)")}&wordCountGoal=${encodeURIComponent(item.wordCountGoal || item.raw_ai_response?.wordCountGoal || "1500")}`}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <ActionButton
                                      label="네이버 글 생성"
                                      disabled={isCompleted}
                                      href={`/studio/writing/naver/create?source=content-planner&itemId=${item.id}&title=${encodeURIComponent(item.title)}&keyword=${encodeURIComponent(item.main_keyword || "")}&contentType=${encodeURIComponent(item.content_type || "")}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-1 w-full">
                                  <div className="flex-1">
                                    <ActionButton
                                      label="쇼츠 제작"
                                      disabled={isCompleted}
                                      href={`/studio/content-planner/shorts?source=content-planner&itemId=${item.id}&title=${encodeURIComponent(item.title)}&keyword=${encodeURIComponent(item.main_keyword || "")}&contentType=${encodeURIComponent(item.content_type || "")}`}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <ActionButton
                                      label="SNS 제작"
                                      disabled={isCompleted}
                                      href={`/studio/content-planner/sns?source=content-planner&itemId=${item.id}&title=${encodeURIComponent(item.title)}&keyword=${encodeURIComponent(item.main_keyword || "")}&contentType=${encodeURIComponent(item.content_type || "")}`}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 w-[60px] justify-center">
                                <button
                                  type="button"
                                  onClick={() => window.alert(`${item.title} 상세보기`)}
                                  title="보기"
                                  className="text-slate-400 hover:text-cyan-300 transition"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => window.alert(`${item.title} 수정하기`)}
                                  title="수정"
                                  className="text-slate-400 hover:text-cyan-300 transition"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => window.alert(`${item.title} 삭제`)}
                                  title="삭제"
                                  className="text-slate-400 hover:text-red-400 transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <Icon className="mb-4 text-cyan-300" size={22} />
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-bold text-slate-500">{label}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-16 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

function ActionButton({ label, href, disabled }: { label: string; href: string; disabled?: boolean }) {
  return (
    <Link
      href={disabled ? "#" : href}
      className={`w-full text-center flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 text-[10px] font-bold transition shrink-0 ${
        disabled
          ? "opacity-30 pointer-events-none text-slate-600 border-none bg-transparent"
          : "text-slate-355 hover:border-cyan-300/40 hover:bg-cyan-950/20 hover:text-cyan-200"
      }`}
    >
      {label}
    </Link>
  );
}