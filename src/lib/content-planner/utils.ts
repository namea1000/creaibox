import type {
  ContentKeywordMetric,
  ContentPlatform,
  ContentPlannerCampaign,
  ContentPlannerItem,
} from "./types";

/* ---------------------------------------
 * 날짜 포맷
 * ------------------------------------- */

export function formatDisplayDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${date.getFullYear()}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

/* ---------------------------------------
 * 숫자
 * ------------------------------------- */

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

/* ---------------------------------------
 * 점수
 * ------------------------------------- */

export function calculateOpportunityScore(
  trendScore: number,
  monetizationScore: number,
  seoScore: number,
  difficultyScore: number
) {
  const result =
    trendScore * 0.35 +
    monetizationScore * 0.25 +
    seoScore * 0.3 +
    (100 - difficultyScore) * 0.1;

  return Math.round(clamp(result));
}

export function calculateSeoScore(
  searchVolume: number,
  competitionLevel: "낮음" | "보통" | "높음"
) {
  let competitionPenalty = 0;

  if (competitionLevel === "보통") {
    competitionPenalty = 10;
  }

  if (competitionLevel === "높음") {
    competitionPenalty = 25;
  }

  const score =
    Math.min(searchVolume / 100, 100) -
    competitionPenalty;

  return Math.round(clamp(score));
}

export function calculateMonetizationScore(
  cpc: number,
  searchIntent: string
) {
  let intentBonus = 0;

  if (
    searchIntent.includes("구매") ||
    searchIntent.includes("비교")
  ) {
    intentBonus = 20;
  }

  if (
    searchIntent.includes("수익") ||
    searchIntent.includes("비즈니스")
  ) {
    intentBonus = 15;
  }

  const score =
    Math.min(cpc * 20, 80) + intentBonus;

  return Math.round(clamp(score));
}

/* ---------------------------------------
 * 기회등급
 * ------------------------------------- */

export function getOpportunityLabel(score: number) {
  if (score >= 90) {
    return "매우 높음";
  }

  if (score >= 80) {
    return "높음";
  }

  if (score >= 70) {
    return "좋음";
  }

  if (score >= 60) {
    return "보통";
  }

  return "낮음";
}

export function getOpportunityColor(score: number) {
  if (score >= 90) {
    return "text-emerald-400";
  }

  if (score >= 80) {
    return "text-cyan-400";
  }

  if (score >= 70) {
    return "text-amber-400";
  }

  return "text-red-400";
}

/* ---------------------------------------
 * 평균 계산
 * ------------------------------------- */

export function getAverageScore(
  items: ContentPlannerItem[],
  field:
    | "trendScore"
    | "seoScore"
    | "monetizationScore"
    | "difficultyScore"
    | "opportunityScore"
) {
  if (items.length === 0) {
    return 0;
  }

  const total = items.reduce(
    (sum, item) => sum + item[field],
    0
  );

  return Math.round(total / items.length);
}

/* ---------------------------------------
 * 캠페인 통계
 * ------------------------------------- */

export function buildCampaignStats(
  campaign: ContentPlannerCampaign,
  items: ContentPlannerItem[]
) {
  return {
    totalItems: items.length,

    avgTrendScore: getAverageScore(
      items,
      "trendScore"
    ),

    avgSeoScore: getAverageScore(
      items,
      "seoScore"
    ),

    avgMonetizationScore: getAverageScore(
      items,
      "monetizationScore"
    ),

    avgOpportunityScore: getAverageScore(
      items,
      "opportunityScore"
    ),

    keywordCount:
      campaign.trendKeywords.length,

    platformCount:
      campaign.platforms.length,
  };
}

/* ---------------------------------------
 * 플랫폼 추천
 * ------------------------------------- */

export function recommendPlatforms(
  keyword: ContentKeywordMetric
): ContentPlatform[] {
  const result: ContentPlatform[] = [];

  if (keyword.trendScore >= 85) {
    result.push("YouTube Shorts");
    result.push("TikTok");
  }

  if (keyword.opportunityScore >= 80) {
    result.push("Creaibox 블로그");
    result.push("네이버 블로그");
  }

  if (keyword.monetizationScore >= 80) {
    result.push("뉴스레터");
  }

  return [...new Set(result)];
}

/* ---------------------------------------
 * 슬러그
 * ------------------------------------- */

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

/* ---------------------------------------
 * 키워드 파싱
 * ------------------------------------- */

export function parseKeywords(
  value: string
): string[] {
  return value
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/* ---------------------------------------
 * 제목 생성
 * ------------------------------------- */

export function buildSeoTitle(
  keyword: string,
  title: string
) {
  return `${title} | ${keyword}`;
}

export function buildMetaDescription(
  title: string,
  keyword: string
) {
  return `${keyword}와 관련된 핵심 내용을 정리한 콘텐츠입니다. ${title}`;
}

/* ---------------------------------------
 * 제작 버튼 이동 경로
 * ------------------------------------- */

export function buildOutputRoute(
  platform: ContentPlatform
) {
  switch (platform) {
    case "Creaibox 블로그":
      return "/studio/writing/creaibox/create";

    case "네이버 블로그":
      return "/studio/writing/naver/list";

    case "YouTube Shorts":
      return "/studio/youtube/shorts";

    case "YouTube 롱폼":
      return "/studio/youtube/longform";

    default:
      return "/studio/content-planner";
  }
}

/* ---------------------------------------
 * 콘텐츠 캘린더
 * ------------------------------------- */

export function buildCalendarDates(
  count: number
) {
  const dates: string[] = [];

  const today = new Date();

  for (let i = 0; i < count; i++) {
    const next = new Date(today);

    next.setDate(today.getDate() + i);

    dates.push(
      next.toISOString().split("T")[0]
    );
  }

  return dates;
}