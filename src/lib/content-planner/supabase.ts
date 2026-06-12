import { createClient } from "@/utils/supabase/client";

import type {
  ContentKeywordMetric,
  ContentPlannerCampaign,
  ContentPlannerItem,
  ContentPlannerOutput,
  ContentPlannerResult,
} from "./types";

const supabase = createClient();

export async function getContentPlannerUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("로그인 정보가 없습니다.");

  return user;
}

export async function saveContentPlannerResult(result: ContentPlannerResult) {
  const user = await getContentPlannerUser();

  const campaignPayload = {
    user_id: user.id,
    user_email: user.email,
    user_nicename:
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Creator",

    title: result.campaign.title,
    description: result.campaign.description,
    strategy_summary: result.campaign.strategySummary,

    content_category: result.campaign.contentCategory || null,
    campaign_type: result.campaign.campaignType || null,
    content_type: result.campaign.contentType,
    goals: result.campaign.goals,
    primary_platform: result.campaign.platforms[0] || null,
    target_platforms: result.campaign.platforms,

    target_audience: result.campaign.targetAudience,
    brand_tone: result.campaign.brandTone,
    item_count: result.campaign.itemCount,

    main_keyword: result.campaign.mainKeyword,
    sub_keywords: result.campaign.subKeywords,
    trend_keywords: result.campaign.trendKeywords,
    golden_keywords: result.campaign.goldenKeywords,
    money_keywords: result.campaign.moneyKeywords,

    status: "generated",
    generated_count: result.items.length,
    raw_ai_response: result,
  };

  const { data: campaign, error: campaignError } = await supabase
    .from("content_planner_campaigns")
    .insert([campaignPayload])
    .select("*")
    .single();

  if (campaignError) throw campaignError;

  const itemPayloads = result.items.map((item) => ({
    campaign_id: campaign.id,
    user_id: user.id,

    item_order: item.itemOrder,
    title: item.title,

    content_type: item.contentType,
    primary_platform: item.primaryPlatform,
    target_platforms: item.targetPlatforms,

    main_keyword: item.mainKeyword,
    sub_keywords: item.subKeywords,
    search_intent: item.searchIntent,
    target_audience: item.targetAudience,
    content_angle: item.contentAngle,
    hook: item.hook,

    key_points: item.keyPoints,
    outline: item.outline,
    cta: item.cta,

    meta_description: item.metaDescription || null,
    seo_tags: item.seoTags ?? [],

    trend_score: item.trendScore,
    seo_score: item.seoScore,
    monetization_score: item.monetizationScore,
    difficulty_score: item.difficultyScore,
    opportunity_score: item.opportunityScore,

    status: item.status,
    raw_ai_response: item,
  }));

  const { data: items, error: itemsError } = await supabase
    .from("content_planner_items")
    .insert(itemPayloads)
    .select("*");

  if (itemsError) throw itemsError;

  return {
    campaign,
    items: items ?? [],
  };
}

export async function fetchContentPlannerCampaigns() {
  return supabase
    .from("content_planner_campaigns")
    .select("*")
    .neq("status", "trash")
    .order("created_at", { ascending: false });
}

export async function fetchContentPlannerCampaignDetail(campaignId: string) {
  const [campaignResult, itemsResult, outputsResult] = await Promise.all([
    supabase
      .from("content_planner_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single(),

    supabase
      .from("content_planner_items")
      .select("*")
      .eq("campaign_id", campaignId)
      .neq("status", "trash")
      .order("item_order", { ascending: true }),

    supabase
      .from("content_planner_outputs")
      .select("*")
      .eq("campaign_id", campaignId)
      .neq("status", "trash")
      .order("created_at", { ascending: false }),
  ]);

  if (campaignResult.error) throw campaignResult.error;
  if (itemsResult.error) throw itemsResult.error;
  if (outputsResult.error) throw outputsResult.error;

  return {
    campaign: campaignResult.data,
    items: itemsResult.data ?? [],
    outputs: outputsResult.data ?? [],
  };
}

export async function moveContentPlannerCampaignToTrash(campaignId: string) {
  return supabase
    .from("content_planner_campaigns")
    .update({ status: "trash" })
    .eq("id", campaignId);
}

export async function updateContentPlannerItemStatus(
  itemId: string,
  status: "planned" | "generating" | "generated" | "failed" | "skipped" | "trash"
) {
  return supabase
    .from("content_planner_items")
    .update({ status })
    .eq("id", itemId)
    .select("*")
    .single();
}

export async function createContentPlannerOutput(
  payload: Omit<ContentPlannerOutput, "id">
) {
  const user = await getContentPlannerUser();

  const { data, error } = await supabase
    .from("content_planner_outputs")
    .insert([
      {
        user_id: user.id,
        campaign_id: payload.campaignId,
        item_id: payload.itemId,
        output_type: payload.outputType,
        platform: payload.platform,
        target_route: payload.targetRoute,
        title: payload.title,
        status: payload.status,
        generated_post_id: payload.generatedPostId ?? null,
        generated_project_id: payload.generatedProjectId ?? null,
        external_url: payload.externalUrl ?? null,
        metadata: payload.metadata ?? {},
      },
    ])
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function saveKeywordSnapshots(
  campaignId: string,
  keywords: ContentKeywordMetric[]
) {
  const user = await getContentPlannerUser();

  const payloads = keywords.map((item) => ({
    user_id: user.id,
    campaign_id: campaignId,

    source: item.source,
    keyword: item.keyword,
    region: item.region,
    period: item.period,

    search_volume: item.searchVolume ?? null,
    competition_level: item.competitionLevel ?? null,
    cpc: item.cpc ?? null,

    trend_score: item.trendScore,
    monetization_score: item.monetizationScore,
    opportunity_score: item.opportunityScore,

    related_keywords: item.relatedKeywords,
    rising_keywords: item.risingKeywords,
    raw_data: item,
  }));

  const { data, error } = await supabase
    .from("content_planner_keyword_snapshots")
    .insert(payloads)
    .select("*");

  if (error) throw error;
  return data ?? [];
}

export async function fetchContentPlannerStats() {
  const user = await getContentPlannerUser();

  const [campaigns, items, outputs] = await Promise.all([
    supabase
      .from("content_planner_campaigns")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "trash"),

    supabase
      .from("content_planner_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "trash"),

    supabase
      .from("content_planner_outputs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "trash"),
  ]);

  return {
    campaignCount: campaigns.count ?? 0,
    itemCount: items.count ?? 0,
    outputCount: outputs.count ?? 0,
  };
}