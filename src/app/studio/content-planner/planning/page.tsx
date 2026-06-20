"use client";

import React, { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { ArrowLeft, Clapperboard, Compass, FileText, Megaphone, Newspaper, X, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiInstagram, SiNaver, SiTiktok, SiYoutube } from "react-icons/si";

import type {
  ContentGoal,
  ContentPlatform,
  ContentPlannerFormState,
  ContentType,
} from "@/lib/content-planner/types";

import {
  contentGoals,
  contentTypes,
  itemCountOptions,
} from "@/lib/content-planner/options";

import { createClient } from "@/utils/supabase/client";
import { extractJsonString, robustParseJson } from "@/lib/utils";
import {
  generateGeminiContentWithFallback,
  getPublicGeminiFallbackNotice,
  getUserAiVaultConfig,
} from "@/lib/client/api-vault";
import {
  saveContentPlannerResult,
  fetchContentPlannerCampaigns,
  fetchContentPlannerCampaignDetail,
} from "@/lib/content-planner/supabase";

import {
  ContentGoalPanel,
  ContentPlatformPanel,
  ContentConditionPanel,
  CampaignResultPanel,
} from "@/components/studio/content-planner";

const platforms: {
  label: ContentPlatform;
  icon: React.ElementType;
}[] = [
    { label: "Creaibox 블로그", icon: FileText },
    { label: "네이버 블로그", icon: SiNaver },
    { label: "YouTube Shorts", icon: SiYoutube },
    { label: "YouTube 롱폼", icon: SiYoutube },
    { label: "TikTok", icon: SiTiktok },
    { label: "네이버 클립", icon: Clapperboard },
    { label: "Instagram Reels", icon: SiInstagram },
    { label: "SNS 카드뉴스", icon: Megaphone },
    { label: "뉴스레터", icon: Newspaper },
    { label: "멀티 플랫폼", icon: Compass },
  ];

function ContentPlannerPlanningPageContent() {
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignPage, setCampaignPage] = useState(1);
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [currentOutputs, setCurrentOutputs] = useState<any[]>([]);
  const [isCampaignPickerOpen, setIsCampaignPickerOpen] = useState(false);
  const [campaignSearchTerm, setCampaignSearchTerm] = useState("");

  const filteredPickerCampaigns = useMemo(() => {
    const term = campaignSearchTerm.trim().toLowerCase();
    if (!term) return campaigns;
    return campaigns.filter(
      (c) =>
        c.title?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.main_keyword?.toLowerCase().includes(term)
    );
  }, [campaigns, campaignSearchTerm]);

  const handleSelectCampaignFromPicker = (campaignId: string) => {
    const idx = campaigns.findIndex((c) => c.id === campaignId);
    if (idx >= 0) {
      setCampaignPage(idx + 1);
    }
    setIsCampaignPickerOpen(false);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedGoals, setSelectedGoals] = useState<ContentGoal[]>([
    "SEO 검색 유입",
  ]);

  const [selectedPlatforms, setSelectedPlatforms] = useState<ContentPlatform[]>([
    "Creaibox 블로그",
    "네이버 블로그",
  ]);

  const [contentType, setContentType] = useState<ContentType>(
    "멀티 플랫폼 콘텐츠 기획"
  );
  const [postType, setPostType] = useState("🧠 AI 인사이트 포스팅");

  const [itemCount, setItemCount] = useState(10);
  const [mainKeyword, setMainKeyword] = useState("");
  const [referenceNote, setReferenceNote] = useState("");

  const [selectedTone, setSelectedTone] = useState(
    "💻 전문적이고 통찰력 있는 분석 (기술 블로그)"
  );
  const [wordCountGoal, setWordCountGoal] = useState("1500");

  const [largeCategory, setLargeCategory] = useState("");
  const [mainTopic, setMainTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");

  useEffect(() => {
    if (!searchParams) return;
    const titleParam = searchParams.get("mainKeywordTopic") || searchParams.get("title");
    const largeCategoryParam = searchParams.get("largeCategory");
    const detailedAreaParam = searchParams.get("detailedArea") || searchParams.get("mainTopic");
    const recommendedSeriesParam = searchParams.get("recommendedSeries") || searchParams.get("subTopic");

    if (titleParam) {
      setMainKeyword(titleParam);
    }
    if (largeCategoryParam) {
      setLargeCategory(largeCategoryParam);
    }
    if (detailedAreaParam) {
      setMainTopic(detailedAreaParam);
    }
    if (recommendedSeriesParam) {
      setSubTopic(recommendedSeriesParam);
    }
  }, [searchParams]);
  const [strategyLevel, setStrategyLevel] =
    useState<ContentPlannerFormState["strategyLevel"]>("3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)");

  const [resultFormat, setResultFormat] =
    useState<ContentPlannerFormState["resultFormat"]>(
      "2. 기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상"
    );

  const selectedPlatformSummary = useMemo(
    () => selectedPlatforms.join(", "),
    [selectedPlatforms]
  );

  const selectedGoalSummary = useMemo(
    () => selectedGoals.join(", "),
    [selectedGoals]
  );

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { data, error } = await fetchContentPlannerCampaigns();
      if (error) throw error;
      setCampaigns(data ?? []);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "기획 캠페인을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchItems = useCallback(async (campaignId: string) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const detail = await fetchContentPlannerCampaignDetail(campaignId);
      setCurrentItems(detail.items ?? []);
      setCurrentOutputs(detail.outputs ?? []);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "기획 아이템을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    if (campaigns.length > 0 && campaigns[campaignPage - 1]) {
      const activeCamp = campaigns[campaignPage - 1];
      const cat = activeCamp.content_category || "";
      if (cat.includes(" > ")) {
        const parts = cat.split(" > ");
        setLargeCategory(parts[0].trim());
        setMainTopic(parts[1].trim());
      } else {
        setLargeCategory("");
        setMainTopic(cat);
      }
      setSubTopic(activeCamp.campaign_type || "");
      setMainKeyword(activeCamp.main_keyword || "");
      void fetchItems(activeCamp.id);
    } else {
      setCurrentItems([]);
      setCurrentOutputs([]);
    }
  }, [campaigns, campaignPage, fetchItems]);

  const toggleGoal = (goal: ContentGoal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((item) => item !== goal)
        : [...prev, goal]
    );
  };

  const togglePlatform = (platform: ContentPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
  };

  const handleGeneratePlanner = async () => {
    if (!mainKeyword.trim()) {
      window.alert("대표 키워드를 입력해 주세요.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.alert("로그인 정보를 확인할 수 없습니다.");
        return;
      }

      const vaultConfig = getUserAiVaultConfig();

      if (!vaultConfig) {
        window.alert(getPublicGeminiFallbackNotice());
      }

      const pureGoals = selectedGoals.join(", ");
      const purePlatforms = selectedPlatforms.join(", ");

      const prompt = `
너는 전문 콘텐츠 디렉터이자 마케팅 전략가다.

아래 조건으로 블로그, SNS, 유튜브 등 다양한 채널에 배포할 콘텐츠 시리즈 기획안을 생성하라.

[기획 조건]
- 기획 목표: ${pureGoals}
- 배포 플랫폼: ${purePlatforms}
- 콘텐츠 유형: ${contentType}
- 포스트 타입: ${postType}
- 말투: ${selectedTone}
- 글자 수 목표: 약 ${wordCountGoal}자
- 목표 콘텐츠 수: ${itemCount}개
- 대분류: ${largeCategory || "없음"}
- 상세 분야: ${mainTopic || "없음"}
- 추천 시리즈: ${subTopic || "없음"}
- 메인 키워드 주제: ${mainKeyword}
- 참고 사항: ${referenceNote || "없음"}
- 전략 수준: ${strategyLevel}
- 출력 구성: ${resultFormat}

[출력 방향]
1. 캠페인 제목(title)과 설명을 매력적이고 구체적으로 자동 생성하라.
2. 캠페인 전략 요약(strategySummary)을 작성하라.
3. 콘텐츠 아이템은 반드시 정확히 ${itemCount}개를 기획하라.
4. 각 콘텐츠 아이템은 제목(title), 콘텐츠 유형(contentType), 대표 플랫폼(primaryPlatform), 확장/대상 플랫폼(targetPlatforms - 문자열 배열), 대표 키워드(mainKeyword), 서브 키워드(subKeywords - 문자열 배열), 검색 의도(searchIntent), 콘텐츠 접근 방향(contentAngle), 후킹 문구(hook), 아웃라인(outline - 문자열 배열), 행동 유도 문구(cta), 기회 점수(opportunityScore - 70~100 사이 숫자), 난이도 점수(difficultyScore - 10~90 사이), 메타 설명(metaDescription - 150자~160자 사이의 검색 포털 노출용 본문 요약 글), SEO 태그(seoTags - 5가지 핵심 검색 태그 문자열 배열)를 포함해야 한다.
5. 대표 플랫폼은 배포 플랫폼 중 가장 어울리는 하나를 지정한다.
6. 모든 데이터는 JSON 형식이어야 하며 마크다운 포맷은 제외한다.

반드시 아래 구조의 JSON 객체만 반환하라.
{
  "title": "캠페인 제목",
  "description": "캠페인 설명",
  "strategySummary": "전략 요약",
  "items": [
    {
      "itemOrder": 1,
      "title": "콘텐츠 제목",
      "contentType": "블로그 포스팅 / 숏폼 대본 등",
      "primaryPlatform": "Creaibox 블로그 등",
      "targetPlatforms": ["Creaibox 블로그", "네이버 블로그"],
      "mainKeyword": "대표 키워드",
      "subKeywords": ["서브 키워드 1", "서브 키워드 2"],
      "searchIntent": "정보 탐색 / 문제 해결 등",
      "contentAngle": "실전 가이드 / 체크리스트 등",
      "hook": "후킹 카피라이팅",
      "outline": ["도입부", "본문 1", "본문 2", "결론"],
      "cta": "클릭 유도 문구",
      "metaDescription": "여기에 150~160자 사이의 본문 내용 요약과 클릭을 유도하는 매력적인 메타 설명을 작성합니다.",
      "seoTags": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
      "trendScore": 85,
      "seoScore": 90,
      "monetizationScore": 75,
      "difficultyScore": 30,
      "opportunityScore": 88
    }
  ]
}
      `;

      const generationResult = await generateGeminiContentWithFallback({
        modelName: vaultConfig?.model || "gemini-3.1-flash-lite",
        prompt,
        responseMimeType: "application/json",
        type: "content_planning",
        userId: user.id,
        userEmail: user.email || null,
      });

      const text = generationResult.text;
      const parsed = robustParseJson(text);

      const campaignPayload = {
        campaign: {
          title: parsed.title || `${mainKeyword} 관련 콘텐츠 기획`,
          description: parsed.description || "",
          strategySummary: parsed.strategySummary || "",
          goals: selectedGoals,
          platforms: selectedPlatforms,
          contentType: contentType,
          contentCategory: largeCategory ? `${largeCategory} > ${mainTopic}` : mainTopic,
          campaignType: subTopic,
          itemCount: itemCount,
          mainKeyword: mainKeyword,
          subKeywords: parsed.items?.flatMap((i: any) => i.subKeywords || []) || [],
          trendKeywords: [],
          goldenKeywords: [],
          moneyKeywords: [],
          targetAudience: "Creator",
          brandTone: "전문적",
          status: "generated" as const,
          selectedTone: selectedTone,
          wordCountGoal: wordCountGoal
        },
        items: (parsed.items || []).map((item: any, idx: number) => ({
          itemOrder: item.itemOrder || idx + 1,
          title: item.title || `기획 주제 ${idx + 1}`,
          contentType: item.contentType || contentType,
          primaryPlatform: item.primaryPlatform || selectedPlatforms[0],
          targetPlatforms: item.targetPlatforms || selectedPlatforms,
          mainKeyword: item.mainKeyword || mainKeyword,
          subKeywords: item.subKeywords || [],
          searchIntent: item.searchIntent || "정보 탐색",
          targetAudience: "Creator",
          contentAngle: item.contentAngle || "",
          hook: item.hook || "",
          keyPoints: item.keyPoints || item.outline || [],
          outline: item.outline || [],
          cta: item.cta || "",
          metaDescription: item.metaDescription || "",
          seoTags: item.seoTags || [],
          trendScore: item.trendScore || 85,
          seoScore: item.seoScore || 85,
          monetizationScore: item.monetizationScore || 80,
          difficultyScore: item.difficultyScore || 40,
          opportunityScore: item.opportunityScore || 85,
          status: "planned" as const,
          selectedTone: selectedTone,
          wordCountGoal: wordCountGoal
        })),
        outputs: []
      };

      const saveResult = await saveContentPlannerResult(campaignPayload);

      setCampaigns((prev) => [saveResult.campaign, ...prev]);
      setCampaignPage(1);
      setCurrentItems(saveResult.items);
      setCurrentOutputs([]);
      window.alert("✅ 콘텐츠 기획안이 생성되어 저장되었습니다.");
    } catch (error: any) {
      console.error(error);
      const message = error.message || "콘텐츠 기획 생성 중 오류가 발생했습니다.";
      setErrorMessage(message);
      window.alert(`❌ 생성 실패: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlannerAction = (label: string) => {
    window.alert(`${label} 기능은 다음 단계에서 연결합니다.`);
  };

  const handleUpdateItem = async (itemId: string, updates: { title: string; metaDescription: string }) => {
    try {
      const { data, error } = await supabase
        .from("content_planner_items")
        .update({
          title: updates.title,
          meta_description: updates.metaDescription || null,
        })
        .eq("id", itemId)
        .select("*")
        .single();

      if (error) throw error;

      setCurrentItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                title: data.title,
                meta_description: data.meta_description,
                metaDescription: data.meta_description,
              }
            : item
        )
      );
      return true;
    } catch (err: any) {
      console.error(err);
      window.alert("아이템 수정에 실패했습니다: " + (err.message || "알 수 없는 오류"));
      return false;
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("content_planner_items")
        .update({ status: "trash" })
        .eq("id", itemId);

      if (error) throw error;

      setCurrentItems((prev) => prev.filter((item) => item.id !== itemId));
      return true;
    } catch (err: any) {
      console.error(err);
      window.alert("아이템 삭제에 실패했습니다: " + (err.message || "알 수 없는 오류"));
      return false;
    }
  };

  const handleExpandCampaign = async (count: number) => {
    const activeCampaign = campaigns[campaignPage - 1];
    if (!activeCampaign) {
      window.alert("활성화된 캠페인이 없습니다.");
      return;
    }

    setIsGenerating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.alert("로그인 정보를 확인할 수 없습니다.");
        return;
      }

      const vaultConfig = getUserAiVaultConfig();
      if (!vaultConfig) {
        window.alert(getPublicGeminiFallbackNotice());
      }

      const existingItemsText = currentItems
        .map((item, idx) => `${idx + 1}. 제목: ${item.title}\n   설명: ${item.meta_description || item.metaDescription || ""}`)
        .join("\n\n");

      const prompt = `
너는 전문 콘텐츠 디렉터이자 마케팅 전략가다.

현재 아래의 콘텐츠 기획 캠페인에 새로운 기획 아이템을 추가하고자 한다.
아래에 제공된 기존 기획 아이템들과 주제가 중복되지 않으면서도, 대표 키워드와 긴밀하게 연결되는 새로운 콘텐츠 아이템을 정확히 ${count}개 기획하여 JSON 형식으로 반환하라.

[기존 캠페인 정보]
- 대표 키워드: ${activeCampaign.main_keyword || activeCampaign.mainKeyword}
- 기획 목표: ${activeCampaign.goals?.join(", ") || ""}
- 배포 플랫폼: ${activeCampaign.target_platforms?.join(", ") || activeCampaign.platforms?.join(", ") || ""}
- 콘텐츠 유형: ${activeCampaign.content_type || ""}
- 포스트 타입: ${activeCampaign.raw_ai_response?.campaign?.postType || ""}
- 말투: ${activeCampaign.raw_ai_response?.campaign?.selectedTone || "전문적이고 통찰력 있는 분석 (기술 블로그)"}
- 글자 수 목표: 약 ${activeCampaign.raw_ai_response?.campaign?.wordCountGoal || "1500"}자
- 전략 수준: ${activeCampaign.strategy_level || activeCampaign.strategyLevel || "전문가 전략"}

[이미 생성된 기존 아이템 리스트 (중복 회피 대상)]
${existingItemsText}

[출력 요구사항]
1. 기존 아이템들과 제목이나 접근 방식이 겹치지 않는 완전하고 매력적인 새로운 아이템을 정확히 ${count}개 생성하라.
2. 각 새 아이템은 기존 아이템의 다음 순서 번호(itemOrder)를 부여받는다. (현재 개수: ${currentItems.length})
3. 각 콘텐츠 아이템은 제목(title), 콘텐츠 유형(contentType), 대표 플랫폼(primaryPlatform), 확장/대상 플랫폼(targetPlatforms - 문자열 배열), 대표 키워드(mainKeyword), 서브 키워드(subKeywords - 문자열 배열), 검색 의도(searchIntent), 콘텐츠 접근 방향(contentAngle), 후킹 문구(hook), 아웃라인(outline - 문자열 배열), 행동 유도 문구(cta), 기회 점수(opportunityScore - 70~100 사이 숫자), 난이도 점수(difficultyScore - 10~90 사이), 메타 설명(metaDescription - 150자~160자 사이의 검색 포털 노출용 매력적인 본문 요약 글), SEO 태그(seoTags - 5가지 핵심 검색 태그 문자열 배열)를 포함해야 한다.
4. 모든 데이터는 JSON 형식이어야 하며 마크다운 포맷은 제외한다.

반드시 아래 구조의 JSON 객체만 반환하라.
{
  "items": [
    {
      "itemOrder": ${currentItems.length + 1},
      "title": "새로운 콘텐츠 제목",
      "contentType": "블로그 포스팅 / 숏폼 대본 등",
      "primaryPlatform": "Creaibox 블로그 등",
      "targetPlatforms": ["Creaibox 블로그", "네이버 블로그"],
      "mainKeyword": "대표 키워드",
      "subKeywords": ["서브 키워드 1", "서브 키워드 2"],
      "searchIntent": "정보 탐색 / 문제 해결 등",
      "contentAngle": "실전 가이드 / 체크리스트 등",
      "hook": "후킹 카피라이팅",
      "outline": ["도입부", "본문 1", "본문 2", "결론"],
      "cta": "클릭 유도 문구",
      "metaDescription": "여기에 150~160자 사이의 본문 내용 요약과 클릭을 유도하는 매력적인 메타 설명을 작성합니다.",
      "seoTags": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
      "trendScore": 85,
      "seoScore": 90,
      "monetizationScore": 75,
      "difficultyScore": 30,
      "opportunityScore": 88
    }
  ]
}
      `;

      const generationResult = await generateGeminiContentWithFallback({
        modelName: vaultConfig?.model || "gemini-3.1-flash-lite",
        prompt,
        responseMimeType: "application/json",
        type: "content_planning",
        userId: user.id,
        userEmail: user.email || null,
      });

      const text = generationResult.text;
      const parsed = robustParseJson(text);

      const newItemsPayload = (parsed.items || []).map((item: any, idx: number) => ({
        campaign_id: activeCampaign.id,
        user_id: user.id,
        item_order: currentItems.length + idx + 1,
        title: item.title || `새 기획 주제 ${idx + 1}`,
        content_type: item.contentType || activeCampaign.content_type,
        primary_platform: item.primaryPlatform || activeCampaign.primary_platform || "",
        target_platforms: item.targetPlatforms || activeCampaign.target_platforms || [],
        main_keyword: item.mainKeyword || activeCampaign.main_keyword,
        sub_keywords: item.subKeywords || [],
        search_intent: item.searchIntent || "정보 탐색",
        target_audience: "Creator",
        content_angle: item.contentAngle || "",
        hook: item.hook || "",
        key_points: item.outline || [],
        outline: item.outline || [],
        cta: item.cta || "",
        meta_description: item.metaDescription || "",
        seo_tags: item.seoTags || [],
        trend_score: item.trendScore || 85,
        seo_score: item.seoScore || 85,
        monetization_score: item.monetizationScore || 80,
        difficulty_score: item.difficultyScore || 40,
        opportunity_score: item.opportunityScore || 85,
        status: "planned" as const,
        raw_ai_response: {
          ...item,
          selectedTone: activeCampaign.raw_ai_response?.campaign?.selectedTone || "전문적이고 통찰력 있는 분석 (기술 블로그)",
          wordCountGoal: activeCampaign.raw_ai_response?.campaign?.wordCountGoal || "1500"
        },
      }));

      const { data: insertedItems, error: insertError } = await supabase
        .from("content_planner_items")
        .insert(newItemsPayload)
        .select("*");

      if (insertError) throw insertError;

      const nextItemCount = (activeCampaign.generated_count || activeCampaign.item_count || currentItems.length) + count;
      const { error: campaignError } = await supabase
        .from("content_planner_campaigns")
        .update({
          // Do not update item_count because of the (5, 10, 20, 30, 50, 100) check constraint.
          // Update generated_count only.
          generated_count: nextItemCount,
        })
        .eq("id", activeCampaign.id);

      if (campaignError) throw campaignError;

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === activeCampaign.id
            ? { ...c, generated_count: nextItemCount }
            : c
        )
      );

      setCurrentItems((prev) => [...prev, ...insertedItems]);
      window.alert(`✅ 콘텐츠 기획안이 ${count}개 확장되었습니다.`);
    } catch (err: any) {
      console.error(err);
      window.alert("콘텐츠 확장에 실패했습니다: " + (err.message || "알 수 없는 오류"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-[#050816] px-4 pb-12 pt-6 text-white sm:px-6 lg:px-8">
      <section className="rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-950 via-[#0b1020] to-black p-7 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              AI CONTENT PLANNING
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              AI 콘텐츠 기획
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              콘텐츠 목표, 플랫폼, 키워드를 선택하면 AI가 콘텐츠 시리즈와 개별 주제를 기획합니다.
              생성된 기획은 라이브러리에 저장되고 각 제작 스튜디오로 연결됩니다.
            </p>
          </div>

          <Link
            href="/studio/content-planner"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200"
          >
            <ArrowLeft size={16} />
            플래너 홈
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[180px_420px_1fr]">
        {/* Column 1: Strategy Goals & Channels (30-40% narrower width) */}
        <aside className="space-y-6">
          <ContentGoalPanel
            goals={contentGoals}
            selectedGoals={selectedGoals}
            onToggleGoal={toggleGoal}
          />

          <ContentPlatformPanel
            platforms={platforms}
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={togglePlatform}
          />
        </aside>

        {/* Column 2: Creation Conditions & Execution (merged layout) */}
        <aside className="space-y-6">
          <ContentConditionPanel
            contentTypes={contentTypes}
            itemCountOptions={itemCountOptions}
            contentType={contentType}
            itemCount={itemCount}
            mainKeyword={mainKeyword}
            referenceNote={referenceNote}
            onChangeContentType={setContentType}
            onChangeItemCount={setItemCount}
            onChangeMainKeyword={setMainKeyword}
            onChangeReferenceNote={setReferenceNote}
            postType={postType}
            onChangePostType={setPostType}
            selectedTone={selectedTone}
            onChangeSelectedTone={setSelectedTone}
            wordCountGoal={wordCountGoal}
            onChangeWordCountGoal={setWordCountGoal}
            strategyLevel={strategyLevel}
            resultFormat={resultFormat}
            onChangeStrategyLevel={setStrategyLevel}
            onChangeResultFormat={setResultFormat}
            onGenerate={handleGeneratePlanner}
            isGenerating={isGenerating}
            largeCategory={largeCategory}
            onChangeLargeCategory={setLargeCategory}
            mainTopic={mainTopic}
            onChangeMainTopic={setMainTopic}
            subTopic={subTopic}
            onChangeSubTopic={setSubTopic}
          />

          {(isGenerating || isLoading) && (
            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-sm font-bold text-cyan-200">
              {isGenerating ? "AI 콘텐츠 기획을 생성 중입니다..." : "기획 데이터를 불러오는 중입니다..."}
            </div>
          )}
        </aside>

        {/* Column 3: Generated Content Series Preview */}
        <section className="space-y-6">
          <CampaignResultPanel
            campaign={campaigns[campaignPage - 1] || null}
            items={currentItems}
            outputs={currentOutputs}
            isLoading={isLoading || isGenerating}
            campaignPage={campaignPage}
            totalCampaigns={campaigns.length}
            onPrevPage={() => setCampaignPage((prev) => Math.max(1, prev - 1))}
            onNextPage={() => setCampaignPage((prev) => Math.min(campaigns.length, prev + 1))}
            onOpenPicker={() => setIsCampaignPickerOpen(true)}
            onCampaignAction={handlePlannerAction}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onExpandCampaign={handleExpandCampaign}
          />
        </section>

      </section>

      {isCampaignPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white">생성한 콘텐츠 기획 불러오기</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  기획 라이브러리에 저장된 콘텐츠 기획안을 불러와 상세 내용 및 채널별 제작 상태를 확인합니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCampaignPickerOpen(false)}
                className="rounded-xl border border-white/10 bg-black/30 p-2 text-zinc-400 hover:text-white"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-white/10 px-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={campaignSearchTerm}
                  onChange={(event) => setCampaignSearchTerm(event.target.value)}
                  placeholder="기획명, 키워드, 설명 검색"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="max-h-[calc(88vh-190px)] overflow-y-auto px-6 py-5 space-y-3">
              {filteredPickerCampaigns.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] px-5 py-12 text-center text-zinc-500">
                  검색 결과 또는 불러올 기획안이 없습니다.
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredPickerCampaigns.map((campaign) => {
                    const isSelected = campaigns[campaignPage - 1]?.id === campaign.id;

                    return (
                      <button
                        key={campaign.id}
                        type="button"
                        onClick={() => handleSelectCampaignFromPicker(campaign.id)}
                        className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-white/10 bg-black/30 hover:border-cyan-400/50"
                        }`}
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-cyan-600/30 to-fuchsia-700/30 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-cyan-300" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate font-black text-white text-base">
                            {campaign.title}
                          </div>
                          <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
                            {campaign.description || "기획 설명 없음"}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-[10px] text-cyan-200">
                              {campaign.content_type || "멀티 플랫폼"}
                            </span>
                            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                              #{campaign.main_keyword}
                            </span>
                            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                              아이템 {campaign.generated_count || campaign.item_count || 0}개
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentPlannerPlanningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">Loading...</div>}>
      <ContentPlannerPlanningPageContent />
    </Suspense>
  );
}