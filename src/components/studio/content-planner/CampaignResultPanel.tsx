"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Library, Calendar, Wand2, Pencil, Trash2, Eye, X } from "lucide-react";
import { SiNaver, SiYoutube } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { createContentPlannerOutput, updateContentPlannerItemStatus } from "@/lib/content-planner/supabase";

interface CampaignResultPanelProps {
  campaign: any | null;
  items: any[];
  outputs?: any[];
  isLoading: boolean;
  campaignPage: number;
  totalCampaigns: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onOpenPicker: () => void;
  onCampaignAction?: (action: string) => void;
  onUpdateItem?: (itemId: string, updates: { title: string; metaDescription: string }) => Promise<boolean>;
  onDeleteItem?: (itemId: string) => Promise<boolean>;
  onExpandCampaign?: (count: number) => Promise<void>;
}

export default function CampaignResultPanel({
  campaign,
  items,
  outputs = [],
  isLoading,
  campaignPage,
  totalCampaigns,
  onPrevPage,
  onNextPage,
  onOpenPicker,
  onCampaignAction,
  onUpdateItem,
  onDeleteItem,
  onExpandCampaign,
}: CampaignResultPanelProps) {
  const [itemsPage, setItemsPage] = useState(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMeta, setEditMeta] = useState("");
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [isExpandMenuOpen, setIsExpandMenuOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [isGeneratingBlog, setIsGeneratingBlog] = useState<string | null>(null);

  const handleCreateBlog = async (item: any) => {
    if (isGeneratingBlog) return;
    setIsGeneratingBlog(item.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.alert("로그인 정보를 확인할 수 없습니다.");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .single();

      const userNicename = prof?.nickname || user.email?.split("@")[0] || "User";

      // 1. 임시 포스트 생성
      const payload = {
        user_id: user.id,
        user_nicename: userNicename,
        title: item.title || "직접 작성한 새 글",
        content: "",
        status: "draft",
        post_type: "create",
        target_keyword: item.main_keyword || item.mainKeyword || "",
        selected_tone: item.selectedTone || item.raw_ai_response?.selectedTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
        slug: null,
        meta_description: item.meta_description || item.metaDescription || "",
        focus_keyword: item.main_keyword || item.mainKeyword || "",
        canonical_url: null,
        seo_tags: item.seoTags || item.seo_tags || [],
        word_count_goal: item.wordCountGoal || item.raw_ai_response?.wordCountGoal || "1500",
        source_mode: "content-planner",
      };

      const { data: insertedPost, error: insertError } = await supabase
        .from("writing_creaibox_posts")
        .insert([payload])
        .select("*")
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const routeId = insertedPost.display_id || insertedPost.id;

      // 2. planner output 생성 및 아이템 상태 변경
      try {
        const outputPayload = {
          campaignId: item.campaign_id || item.campaignId || "",
          itemId: item.id || "",
          outputType: "creaibox_blog" as const,
          platform: "Creaibox 블로그" as const,
          targetRoute: `/studio/writing/creaibox/list/${routeId}`,
          title: item.title,
          status: "generated" as const,
          generatedPostId: insertedPost.id,
          metadata: { display_id: routeId }
        };
        await createContentPlannerOutput(outputPayload);
        await updateContentPlannerItemStatus(item.id, "generated");
      } catch (linkErr) {
        console.error("Failed to link planner output:", linkErr);
      }

      // 3. 에디터 리스트/[id] 로 기획 쿼리 파라미터를 달아서 리다이렉트
      let largeCategory = "";
      let mainTopic = "";
      const contentCat = campaign?.content_category || campaign?.contentCategory || "";
      if (contentCat.includes(" > ")) {
        const parts = contentCat.split(" > ");
        largeCategory = parts[0]?.trim() || "";
        mainTopic = parts[1]?.trim() || "";
      } else {
        largeCategory = contentCat?.trim() || "";
      }

      const query = new URLSearchParams({
        source: "content-planner",
        autoGenerate: "true",
        itemId: item.id || "",
        campaignId: item.campaign_id || item.campaignId || "",
        title: item.title || "",
        keyword: item.main_keyword || item.mainKeyword || "",
        contentType: campaign?.content_type || campaign?.contentType || "블로그 글쓰기 콘텐츠",
        postType: item.postType || item.raw_ai_response?.postType || campaign?.post_type || campaign?.postType || "🧠 AI 인사이트 포스팅",
        selectedTone: item.selectedTone || item.raw_ai_response?.selectedTone || campaign?.brand_tone || campaign?.brandTone || "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
        wordCountGoal: item.wordCountGoal || item.raw_ai_response?.wordCountGoal || "1500",
        strategyLevel: campaign?.strategy_level || campaign?.strategyLevel || "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)",
        resultFormat: campaign?.result_format || campaign?.resultFormat || "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)",
        largeCategory,
        mainTopic,
        subTopic: campaign?.campaign_type || campaign?.campaignType || "",
        referenceNote: campaign?.reference_note || campaign?.referenceNote || "",
      }).toString();

      router.push(`/studio/writing/creaibox/list/${routeId}?${query}`);
    } catch (err: any) {
      window.alert(`블로그 글 생성 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsGeneratingBlog(null);
    }
  };

  const handleSaveClick = async (itemId: string) => {
    if (!editTitle.trim()) {
      window.alert("제목을 입력해 주세요.");
      return;
    }
    setIsSavingItem(true);
    try {
      if (onUpdateItem) {
        const success = await onUpdateItem(itemId, {
          title: editTitle,
          metaDescription: editMeta,
        });
        if (success) {
          setEditingItemId(null);
        }
      }
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteClick = async (itemId: string) => {
    if (window.confirm("이 콘텐츠 기획 아이템을 삭제하시겠습니까?")) {
      if (onDeleteItem) {
        await onDeleteItem(itemId);
      }
    }
  };

  // Reset items page when campaign changes
  useEffect(() => {
    setItemsPage(1);
    setEditingItemId(null);
  }, [campaign?.id]);

  // Automatically navigate to the last page when items are appended
  const prevItemsLength = useRef(items.length);
  useEffect(() => {
    if (items.length > prevItemsLength.current) {
      const newTotalPages = Math.ceil(items.length / itemsPerPage);
      setItemsPage(newTotalPages);
    }
    prevItemsLength.current = items.length;
  }, [items.length]);

  const itemsPerPage = 10;
  const totalItemsPages = Math.ceil(items.length / itemsPerPage);
  const displayedItems = items.slice(
    (itemsPage - 1) * itemsPerPage,
    itemsPage * itemsPerPage
  );

  const generatedCount = items.filter(
    (item) =>
      item.status === "generated" ||
      item.status === "published" ||
      item.status === "completed"
  ).length;

  const metadataItems = campaign
    ? [
        campaign.created_at
          ? new Date(campaign.created_at)
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\. /g, ".")
              .replace(/\.$/, "")
          : "",
        campaign.mainKeyword || campaign.main_keyword,
        campaign.contentType || campaign.content_type,
        campaign.postType ||
          campaign.post_type ||
          campaign.raw_ai_response?.campaign?.postType,
        campaign.strategyLevel ||
          campaign.strategy_level ||
          campaign.raw_ai_response?.campaign?.strategyLevel ||
          "3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)",
        campaign.resultFormat ||
          campaign.result_format ||
          campaign.raw_ai_response?.campaign?.resultFormat ||
          "2. 기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상",
      ].filter(Boolean)
    : [];

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-black text-white">
              생성된 콘텐츠 기획 리스트
            </h2>
            <p className="text-sm text-zinc-500">
              각 콘텐츠의 제작 버튼을 누르면 상세 제작 메뉴로 이동하여 콘텐츠 생성을 진행할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenPicker}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 text-sm font-black text-cyan-200 hover:bg-cyan-400/20"
            >
              <Library size={16} />
              생성한 기획 불러오기
            </button>

            <div className="inline-flex h-11 items-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <button
                type="button"
                onClick={onPrevPage}
                disabled={campaignPage <= 1 || totalCampaigns === 0}
                className="inline-flex h-full w-11 items-center justify-center text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-700"
                aria-label="이전 기획안"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex h-full min-w-[76px] items-center justify-center border-x border-white/10 px-3 text-sm font-black text-white">
                {totalCampaigns === 0 ? 0 : campaignPage}
                <span className="mx-1 text-zinc-500">/</span>
                {totalCampaigns}
              </div>

              <button
                type="button"
                onClick={onNextPage}
                disabled={campaignPage >= totalCampaigns || totalCampaigns === 0}
                className="inline-flex h-full w-11 items-center justify-center text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-700"
                aria-label="다음 기획안"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-10 text-center text-slate-500">
          기획 내용을 불러오는 중입니다...
        </div>
      ) : !campaign ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d0d12] p-12 text-center text-slate-500">
          아직 생성된 콘텐츠 기획안이 없습니다.
          <br />
          조건 설정 후 기획 생성을 진행해 주세요.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12]">
            <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-fuchsia-500/10 to-black p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                    {metadataItems.join(" · ")}
                  </div>

                  <h3 className="text-3xl font-black text-white">
                    {campaign.title}
                  </h3>

                  <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-400">
                    {campaign.description || campaign.strategy_summary || "캠페인 설명이 없습니다."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                    {items.length} Items
                  </span>
                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                    제작 {generatedCount}/{items.length}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onCampaignAction?.("블로그 전체 제작")}
                  className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-xl bg-cyan-400 text-xs font-black text-black hover:bg-cyan-300"
                >
                  <Wand2 size={15} />
                  블로그 전체 제작
                </button>
                <button
                  type="button"
                  onClick={() => onCampaignAction?.("쇼츠 전체 제작")}
                  className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 text-xs font-black text-zinc-300 hover:border-cyan-400/40 hover:text-cyan-200"
                >
                  <SiYoutube size={14} className="text-[#FF0000]" />
                  쇼츠 전체 제작
                </button>
                <Link
                  href="/studio/content-planner/calendar"
                  className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-xl border border-indigo-400/35 bg-indigo-500/15 text-xs font-black text-indigo-100 hover:border-indigo-300 hover:bg-indigo-500/25"
                >
                  <Calendar size={15} />
                  콘텐츠 캘린더 등록
                </Link>
                <Link
                  href="/studio/content-planner/library"
                  className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/15 text-xs font-black text-emerald-100 hover:border-emerald-300 hover:bg-emerald-500/25"
                >
                  <Library size={15} />
                  라이브러리 이동
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsExpandMenuOpen(!isExpandMenuOpen)}
                    className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-500/15 text-xs font-black text-cyan-100 hover:border-cyan-300 hover:bg-cyan-500/25"
                  >
                    <Sparkles size={15} className="text-cyan-300" />
                    콘텐츠 확장
                  </button>
                  {isExpandMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 z-50 w-44 rounded-xl border border-white/10 bg-[#101014]/95 backdrop-blur-md p-2 shadow-2xl">
                      <div className="px-2.5 py-1.5 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">
                        추가할 개수 선택
                      </div>
                      <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              setIsExpandMenuOpen(false);
                              if (onExpandCampaign) {
                                void onExpandCampaign(num);
                              }
                            }}
                            className="flex w-full items-center px-2.5 py-2 text-xs font-bold rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                          >
                            {num}개 추가
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-amber-300/30 bg-amber-400/15 text-[14px] font-black uppercase tracking-wider text-amber-100">
                    <th className="w-14 px-4 py-3.5 text-center">No</th>
                    <th className="px-4 py-3.5">메인 키워드 주제</th>
                    <th className="w-40 px-4 py-3.5">콘텐츠 유형</th>
                    <th className="w-24 px-4 py-3.5 text-center">기회점수</th>
                    <th className="w-36 px-4 py-3.5 text-center">제작</th>
                    <th className="w-36 px-4 py-3.5 text-center">콘텐츠 수정</th>
                    <th className="w-28 px-4 py-3.5 text-center">관리</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedItems.map((item, index) => {
                    const itemOutputs = (outputs || []).filter((out: any) => out.item_id === item.id);
                    const cbOutput = itemOutputs.find((out: any) => out.output_type === "creaibox_blog" && out.status === "generated");
                    const nvOutput = itemOutputs.find((out: any) => out.output_type === "naver_blog" && out.status === "generated");

                    return (
                      <tr
                        key={item.id || item.title}
                        className="border-b border-white/5 hover:bg-white/[0.03]"
                      >
                        <td className="px-4 py-4 text-center text-sm font-black text-zinc-500">
                          {String((itemsPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                        </td>

                        <td className="px-4 py-4">
                          {editingItemId === item.id ? (
                            <div className="flex flex-col gap-2 max-w-2xl">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                disabled={isSavingItem}
                                className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-1.5 text-sm font-bold text-white outline-none focus:border-cyan-400"
                                placeholder="메인 키워드 주제"
                              />
                              <textarea
                                value={editMeta}
                                onChange={(e) => setEditMeta(e.target.value)}
                                disabled={isSavingItem}
                                className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-cyan-400 min-h-[60px] resize-y"
                                placeholder="메타 설명"
                              />
                            </div>
                          ) : (
                            <div className="max-w-2xl">
                              <h4 className="font-bold text-white text-base leading-6">{item.title}</h4>
                              <p className="mt-2 text-xs leading-5 text-zinc-400 whitespace-pre-wrap">
                                {item.meta_description || item.metaDescription || "메타 설명이 제공되지 않았습니다."}
                              </p>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-300">
                          <p className="font-bold">{item.content_type || item.contentType}</p>
                          <p className="mt-1 text-xs font-semibold text-zinc-500">
                            {item.content_angle || item.contentAngle || ""}
                          </p>
                          
                          {((item.seo_tags && item.seo_tags.length > 0) || (item.seoTags && item.seoTags.length > 0)) ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {(item.seo_tags || item.seoTags).slice(0, 5).map((tag: string) => (
                                <span key={tag} className="text-[11px] font-bold text-cyan-300">
                                  #{tag.startsWith("#") ? tag.slice(1) : tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            (item.main_keyword || item.mainKeyword) && (
                              <div className="mt-2">
                                <span className="text-[11px] font-bold text-cyan-300">
                                  #{item.main_keyword || item.mainKeyword}
                                </span>
                              </div>
                            )
                          )}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                            {item.opportunity_score || item.opportunityScore || 0}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5 items-center justify-center">
                            <ActionButton
                              label="블로그 글 생성"
                              onClick={() => void handleCreateBlog(item)}
                              isLoading={isGeneratingBlog === item.id}
                            />
                            <ActionButton
                              label="쇼츠 제작"
                              href={`/studio/content-planner/shorts?source=content-planner&itemId=${item.id || ""}&campaignId=${item.campaign_id || item.campaignId || ""}&title=${encodeURIComponent(item.title)}&keyword=${encodeURIComponent(item.main_keyword || item.mainKeyword || "")}&contentType=${encodeURIComponent(item.content_type || item.contentType || "")}`}
                            />
                            <ActionButton
                              label="SNS 제작"
                              href={`/studio/content-planner/sns?source=content-planner&itemId=${item.id || ""}&campaignId=${item.campaign_id || item.campaignId || ""}&title=${encodeURIComponent(item.title)}&keyword=${encodeURIComponent(item.main_keyword || item.mainKeyword || "")}&contentType=${encodeURIComponent(item.content_type || item.contentType || "")}`}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5 items-center justify-center">
                            {cbOutput ? (
                              <Link
                                href={cbOutput.target_route || `/studio/writing/creaibox/list/${cbOutput.metadata?.display_id || cbOutput.generated_post_id}`}
                                className="inline-flex items-center justify-center w-28 rounded-full border border-emerald-500 bg-emerald-500/10 py-1.5 text-[11px] font-bold text-emerald-200 hover:bg-emerald-500/20 transition-all duration-200 text-center"
                              >
                                블로그 글 수정
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="inline-flex items-center justify-center w-28 rounded-full border border-white/5 bg-white/[0.01] py-1.5 text-[11px] font-bold text-zinc-600 cursor-not-allowed text-center"
                              >
                                블로그 글 수정
                              </button>
                            )}

                            {nvOutput ? (
                              <Link
                                href={nvOutput.target_route || `/studio/writing/naver/list/${nvOutput.generated_post_id}`}
                                className="inline-flex items-center justify-center w-28 rounded-full border border-emerald-500 bg-emerald-500/10 py-1.5 text-[11px] font-bold text-emerald-200 hover:bg-emerald-500/20 transition-all duration-200 text-center"
                              >
                                네이버 글 수정
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="inline-flex items-center justify-center w-28 rounded-full border border-white/5 bg-white/[0.01] py-1.5 text-[11px] font-bold text-zinc-600 cursor-not-allowed text-center"
                              >
                                네이버 글 수정
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5 items-center justify-center">
                            {editingItemId === item.id ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSaveClick(item.id)}
                                  disabled={isSavingItem}
                                  className="inline-flex items-center justify-center w-20 rounded-lg bg-cyan-400 py-1 text-xs font-bold text-black hover:bg-cyan-300 transition-colors disabled:opacity-50"
                                >
                                  {isSavingItem ? "저장 중" : "저장"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingItemId(null)}
                                  disabled={isSavingItem}
                                  className="inline-flex items-center justify-center w-20 rounded-lg border border-white/10 bg-white/[0.04] py-1 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                  취소
                                </button>
                              </>
                            ) : (
                              <div className="flex gap-1.5 items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => setPreviewItem(item)}
                                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all duration-200"
                                  title="미리보기"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingItemId(item.id);
                                    setEditTitle(item.title);
                                    setEditMeta(item.meta_description || item.metaDescription || "");
                                  }}
                                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all duration-200"
                                  title="수정"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClick(item.id)}
                                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 hover:border-rose-400/30 transition-all duration-200"
                                  title="삭제"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalItemsPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setItemsPage((prev) => Math.max(1, prev - 1))}
                disabled={itemsPage <= 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-700"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-black text-white">
                {itemsPage} / {totalItemsPages}
              </span>
              <button
                type="button"
                onClick={() => setItemsPage((prev) => Math.min(totalItemsPages, prev + 1))}
                disabled={itemsPage >= totalItemsPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {previewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl flex flex-col text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-gradient-to-r from-cyan-500/10 to-transparent">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-black text-cyan-300">
                    {previewItem.content_type || previewItem.contentType || "기획 아이템"}
                  </span>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">
                    기회 점수: {previewItem.opportunity_score || previewItem.opportunityScore || 0}
                  </span>
                </div>
                <h3 className="mt-2 text-2xl font-black text-white leading-8">
                  {previewItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-xl border border-white/10 bg-black/30 p-2.5 text-zinc-400 hover:text-white transition-colors"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">메인 키워드 주제</div>
                  <div className="mt-1 text-sm font-semibold text-white">{previewItem.main_keyword || previewItem.mainKeyword || "-"}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">서브 키워드</div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {Array.isArray(previewItem.sub_keywords || previewItem.subKeywords) 
                      ? (previewItem.sub_keywords || previewItem.subKeywords).join(", ") 
                      : (previewItem.sub_keywords || previewItem.subKeywords || "-")}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">대표 플랫폼</div>
                  <div className="mt-1 text-sm font-semibold text-white">{previewItem.primary_platform || previewItem.primaryPlatform || "-"}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">대상 플랫폼</div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {Array.isArray(previewItem.target_platforms || previewItem.targetPlatforms)
                      ? (previewItem.target_platforms || previewItem.targetPlatforms).join(", ")
                      : (previewItem.target_platforms || previewItem.targetPlatforms || "-")}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">검색 의도</div>
                  <div className="mt-1 text-sm font-semibold text-white">{previewItem.search_intent || previewItem.searchIntent || "-"}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">접근 방향</div>
                  <div className="mt-1 text-sm font-semibold text-white">{previewItem.content_angle || previewItem.contentAngle || "-"}</div>
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wider">메타 설명 (Meta Description)</h4>
                <div className="rounded-xl border border-white/5 bg-[#14141a] p-4 text-sm leading-6 text-zinc-300">
                  {previewItem.meta_description || previewItem.metaDescription || "설명이 없습니다."}
                </div>
              </div>

              {/* Hook */}
              {previewItem.hook && (
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wider">후킹 카피 (Hook)</h4>
                  <div className="rounded-xl border border-white/5 bg-[#14141a] p-4 text-sm leading-6 text-zinc-300 italic">
                    "{previewItem.hook}"
                  </div>
                </div>
              )}

              {/* Outline */}
              {((previewItem.outline && previewItem.outline.length > 0) || (previewItem.key_points && previewItem.key_points.length > 0)) && (
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wider">콘텐츠 아웃라인</h4>
                  <div className="rounded-xl border border-white/5 bg-[#14141a] p-5">
                    <ul className="space-y-3">
                      {(previewItem.outline || previewItem.key_points).map((step: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-sm text-zinc-300">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-[11px] font-black text-cyan-300">
                            {idx + 1}
                          </span>
                          <span className="leading-5">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* CTA */}
              {previewItem.cta && (
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wider">행동 유도 문구 (CTA)</h4>
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm font-semibold leading-6 text-indigo-200">
                    {previewItem.cta}
                  </div>
                </div>
              )}

              {/* SEO Tags */}
              {((previewItem.seo_tags && previewItem.seo_tags.length > 0) || (previewItem.seoTags && previewItem.seoTags.length > 0)) && (
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wider">SEO 핵심 태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {(previewItem.seo_tags || previewItem.seoTags).map((tag: string) => (
                      <span key={tag} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-zinc-300">
                        #{tag.startsWith("#") ? tag.slice(1) : tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActionButton({
  label,
  href,
  onClick,
  disabled,
  isLoading,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const className =
    "inline-flex items-center justify-center w-28 rounded-full border border-white/10 bg-white/[0.04] py-1.5 text-[11px] font-bold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200 transition-all duration-200 hover:bg-white/10 text-center disabled:opacity-40 disabled:cursor-not-allowed";

  if (isLoading) {
    return (
      <button disabled className={className}>
        <span className="mr-1 h-2.5 w-2.5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></span>
        준비중...
      </button>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} className={className}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={className}>
      {label}
    </Link>
  );
}