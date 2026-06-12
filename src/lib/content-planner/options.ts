import type {
  ContentGoal,
  ContentPlatform,
  ContentPlannerFormState,
  ContentType,
  KeywordSource,
  OutputType,
} from "./types";

export const contentGoals: ContentGoal[] = [
  "트래픽 증가",
  "SEO 검색 유입",
  "브랜드 인지도",
  "구독자 증가",
  "수익화",
  "리드 수집",
  "제품 판매",
  "커뮤니티 성장",
];

export const contentPlatforms: ContentPlatform[] = [
  "Creaibox 블로그",
  "네이버 블로그",
  "YouTube Shorts",
  "YouTube 롱폼",
  "TikTok",
  "네이버 클립",
  "Instagram Reels",
  "SNS 카드뉴스",
  "뉴스레터",
  "멀티 플랫폼",
];

export const contentTypes: ContentType[] = [
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
];

export const itemCountOptions = [5, 10, 20, 30, 50, 100];

export const strategyLevelOptions: ContentPlannerFormState["strategyLevel"][] = [
  "기본 전략",
  "고급 전략",
  "전문가 전략",
];

export const resultFormatOptions: ContentPlannerFormState["resultFormat"][] = [
  "시리즈만",
  "시리즈 + 채널별 제작안",
  "콘텐츠 캘린더 포함",
];

export const keywordSourceOptions: {
  label: string;
  value: KeywordSource;
  description: string;
}[] = [
    {
      label: "직접 입력",
      value: "manual",
      description: "사용자가 입력한 키워드를 중심으로 기획합니다.",
    },
    {
      label: "구글 검색",
      value: "google_search",
      description: "검색량, 관련 검색어, 경쟁 흐름을 반영합니다.",
    },
    {
      label: "구글 트렌드",
      value: "google_trends",
      description: "최근 상승 흐름과 계절성을 반영합니다.",
    },
    {
      label: "네이버 트렌드",
      value: "naver_trends",
      description: "국내 검색 흐름과 블로그/클립 주제를 반영합니다.",
    },
    {
      label: "유튜브 트렌드",
      value: "youtube_trends",
      description: "영상 콘텐츠와 쇼츠 주제 흐름을 반영합니다.",
    },
    {
      label: "통합 추천",
      value: "mixed",
      description: "검색, 트렌드, 내부 추천을 통합합니다.",
    },
  ];

export const trendPeriodOptions = [
  { label: "최근 7일", value: "7d" },
  { label: "최근 30일", value: "30d" },
  { label: "최근 90일", value: "90d" },
  { label: "최근 12개월", value: "12m" },
] as const;

export const trendRegionOptions = [
  { label: "대한민국", value: "KR" },
  { label: "글로벌", value: "GLOBAL" },
] as const;

export const defaultContentPlannerForm: ContentPlannerFormState = {
  goals: ["SEO 검색 유입"],
  platforms: ["Creaibox 블로그", "네이버 블로그"],
  contentType: "멀티 플랫폼 콘텐츠 기획",
  itemCount: 10,
  mainKeyword: "",
  referenceNote: "",
  strategyLevel: "전문가 전략",
  resultFormat: "시리즈 + 채널별 제작안",
  keywordSource: "mixed",
  trendPeriod: "30d",
  trendRegion: "KR",
};

export const platformOutputMap: Record<ContentPlatform, OutputType> = {
  "Creaibox 블로그": "creaibox_blog",
  "네이버 블로그": "naver_blog",
  "YouTube Shorts": "youtube_shorts",
  "YouTube 롱폼": "youtube_longform",
  TikTok: "tiktok",
  "네이버 클립": "naver_clip",
  "Instagram Reels": "instagram_reels",
  "SNS 카드뉴스": "sns_post",
  뉴스레터: "newsletter",
  "멀티 플랫폼": "multi_platform",
};

export const outputRouteMap: Record<OutputType, string> = {
  creaibox_blog: "/studio/writing/creaibox/create",
  naver_blog: "/studio/writing/naver/list",
  youtube_shorts: "/studio/youtube/shorts",
  youtube_longform: "/studio/youtube/longform",
  tiktok: "/studio/content-planner/tiktok",
  naver_clip: "/studio/content-planner/naver-clip",
  instagram_reels: "/studio/content-planner/instagram-reels",
  sns_post: "/studio/content-planner/sns",
  newsletter: "/studio/content-planner/newsletter",
  multi_platform: "/studio/content-planner",
};

export const contentTypePresets = [
  {
    title: "검색 유입 블로그 시리즈",
    contentType: "블로그 글쓰기 콘텐츠" as ContentType,
    goals: ["SEO 검색 유입", "트래픽 증가"] as ContentGoal[],
    platforms: ["Creaibox 블로그", "네이버 블로그"] as ContentPlatform[],
    description: "검색 노출과 장문 블로그 콘텐츠 생산에 최적화된 기획입니다.",
  },
  {
    title: "숏폼 확산 시리즈",
    contentType: "유튜브 쇼츠 기획" as ContentType,
    goals: ["구독자 증가", "브랜드 인지도"] as ContentGoal[],
    platforms: ["YouTube Shorts", "TikTok", "Instagram Reels"] as ContentPlatform[],
    description: "짧은 훅, 빠른 전개, 반복 제작에 적합한 숏폼 콘텐츠 기획입니다.",
  },
  {
    title: "수익형 콘텐츠 시리즈",
    contentType: "멀티 플랫폼 콘텐츠 기획" as ContentType,
    goals: ["수익화", "제품 판매"] as ContentGoal[],
    platforms: ["Creaibox 블로그", "YouTube Shorts", "SNS 카드뉴스"] as ContentPlatform[],
    description: "광고, 제휴, 상품 판매로 이어질 수 있는 콘텐츠 묶음입니다.",
  },
  {
    title: "브랜드 캠페인 시리즈",
    contentType: "브랜드 캠페인 기획" as ContentType,
    goals: ["브랜드 인지도", "커뮤니티 성장"] as ContentGoal[],
    platforms: ["네이버 블로그", "Instagram Reels", "뉴스레터"] as ContentPlatform[],
    description: "브랜드 메시지를 여러 채널에 일관되게 배포하는 전략입니다.",
  },
];

export const ideaHubQuickFilters = [
  { id: "ai", label: "AI", keyword: "AI" },
  { id: "chatgpt", label: "ChatGPT", keyword: "ChatGPT" },
  { id: "crypto", label: "코인", keyword: "비트코인" },
  { id: "real-estate", label: "부동산", keyword: "부동산" },
  { id: "travel", label: "여행", keyword: "여행" },
  { id: "car", label: "자동차", keyword: "전기차" },
  { id: "health", label: "건강", keyword: "건강" },
  { id: "sports", label: "스포츠", keyword: "스포츠" },
  { id: "business", label: "비즈니스", keyword: "창업" },
  { id: "shopping", label: "쇼핑", keyword: "제품 추천" },
];