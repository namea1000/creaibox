export type PlannerStatus =
  | "draft"
  | "saved"
  | "generated"
  | "archived"
  | "trash";

export type PlannerItemStatus =
  | "planned"
  | "generating"
  | "generated"
  | "failed"
  | "skipped"
  | "trash";

export type ContentGoal =
  | "트래픽 증가"
  | "SEO 검색 유입"
  | "브랜드 인지도"
  | "구독자 증가"
  | "수익화"
  | "리드 수집"
  | "제품 판매"
  | "커뮤니티 성장";

export type ContentPlatform =
  | "Creaibox 블로그"
  | "네이버 블로그"
  | "YouTube Shorts"
  | "YouTube 롱폼"
  | "TikTok"
  | "네이버 클립"
  | "Instagram Reels"
  | "SNS 카드뉴스"
  | "뉴스레터"
  | "멀티 플랫폼";

export type ContentType =
  | "멀티 플랫폼 콘텐츠 기획"
  | "블로그 글쓰기 콘텐츠"
  | "유튜브 쇼츠 기획"
  | "유튜브 롱폼 기획"
  | "틱톡 숏폼 기획"
  | "네이버 클립 기획"
  | "인스타그램 릴스 기획"
  | "SNS 카드뉴스 기획"
  | "뉴스레터 기획"
  | "브랜드 캠페인 기획";

export type KeywordSource =
  | "manual"
  | "google_search"
  | "google_trends"
  | "naver_trends"
  | "youtube_trends"
  | "internal"
  | "mixed";

export type OutputType =
  | "creaibox_blog"
  | "naver_blog"
  | "youtube_shorts"
  | "youtube_longform"
  | "tiktok"
  | "naver_clip"
  | "instagram_reels"
  | "sns_post"
  | "newsletter"
  | "multi_platform";

export type ContentPlannerFormState = {
  goals: ContentGoal[];
  platforms: ContentPlatform[];
  contentType: ContentType;
  itemCount: number;
  mainKeyword: string;
  referenceNote: string;
  strategyLevel:
    | "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)"
    | "2. 고급 전략(검색 엔진 최적화 및 사용자 타겟 분석)"
    | "3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)";
  resultFormat:
    | "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)"
    | "2. 기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상"
    | "3. 2번 + 발행 순서 및 최적의 배포 타이밍 구성";
  keywordSource: KeywordSource;
  trendPeriod: "7d" | "30d" | "90d" | "12m";
  trendRegion: "KR" | "GLOBAL";
};

export type ContentPlannerCampaign = {
  id?: string;
  title: string;
  description: string;
  strategySummary: string;
  goals: ContentGoal[];
  platforms: ContentPlatform[];
  contentType: ContentType;
  contentCategory?: string;
  campaignType?: string;
  itemCount: number;
  mainKeyword: string;
  subKeywords: string[];
  trendKeywords: string[];
  goldenKeywords: string[];
  moneyKeywords: string[];
  targetAudience: string;
  brandTone: string;
  status: PlannerStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ContentPlannerItem = {
  id?: string;
  campaignId?: string;
  itemOrder: number;
  title: string;
  contentType: ContentType | string;
  primaryPlatform: ContentPlatform | string;
  targetPlatforms: ContentPlatform[];
  mainKeyword: string;
  subKeywords: string[];
  searchIntent: string;
  targetAudience: string;
  contentAngle: string;
  hook: string;
  keyPoints: string[];
  outline: string[];
  cta: string;
  trendScore: number;
  seoScore: number;
  monetizationScore: number;
  difficultyScore: number;
  opportunityScore: number;
  status: PlannerItemStatus;
  metaDescription?: string;
  seoTags?: string[];
};

export type ContentPlannerOutput = {
  id?: string;
  campaignId?: string;
  itemId?: string;
  outputType: OutputType;
  platform: ContentPlatform;
  targetRoute: string;
  title: string;
  status: "planned" | "generating" | "generated" | "failed";
  generatedPostId?: string | null;
  generatedProjectId?: string | null;
  externalUrl?: string | null;
  metadata?: Record<string, unknown>;
};

export type ContentKeywordMetric = {
  keyword: string;
  source: KeywordSource;
  region: "KR" | "GLOBAL";
  period: string;
  searchVolume?: number | null;
  competitionLevel?: "낮음" | "보통" | "높음" | null;
  cpc?: number | null;
  trendScore: number;
  monetizationScore: number;
  opportunityScore: number;
  relatedKeywords: string[];
  risingKeywords: string[];
};

export type ContentPlannerResult = {
  campaign: ContentPlannerCampaign;
  items: ContentPlannerItem[];
  outputs?: ContentPlannerOutput[];
};

export type OpportunityCardItem = {
  label: string;
  value: string;
  description?: string;
};

export type RecommendedSeriesItem = {
  title: string;
  score: number;
  label: string;
  description?: string;
};

export type IdeaHubMainGroup =
  | "기술 & 디지털"
  | "경제 & 비즈니스"
  | "생활 & 문화"
  | "건강 & 라이프스타일"
  | "교육 & 지식"
  | "사회 & 국제"
  | "법률 & 정책 & 복지"
  | "환경 & 지구과학"
  | "크리에이티브 & 예술"
  | "산업 & 미래";

export type IdeaHubDifficulty =
  | "쉬움"
  | "보통"
  | "어려움";

export type IdeaHubMonetizationLevel =
  | "낮음"
  | "보통"
  | "높음";

export type IdeaHubSeoPotential =
  | "낮음"
  | "보통"
  | "높음";

export type IdeaHubTopicCategory = {
  id: string;
  name: string;
  group: IdeaHubMainGroup;
  description: string;
  emoji: string;
  color?: string;
  icon?: string;
  subTopicCount: number;
  ideaCount: number;
  featured?: boolean;
  subTopics?: IdeaHubSubTopic[];
};

export type IdeaHubSubTopic = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  keywords: string[];
  ideaCount: number;
  featured?: boolean;
};

export type IdeaHubSeriesIdea = {
  id: string;
  categoryId: string;
  subTopicId: string;
  title: string;
  description?: string;
  tags?: string[];
  estimatedPosts?: number;
  difficulty?: IdeaHubDifficulty;
  monetizationLevel?: IdeaHubMonetizationLevel;
  seoPotential?: IdeaHubSeoPotential;
  trendScore?: number;
  targetPlatform?: ContentPlatform;
  recommendedFormat?: string;
  featured?: boolean;
};

export type IdeaHubTrendingIdea = {
  id: string;
  title: string;
  categoryName: string;
  subTopicName: string;
  score: number;
  reason?: string;
};

export type IdeaHubQuickFilter = {
  id: string;
  label: string;
  keyword: string;
};

export type IdeaHubSearchResult = {
  categories: IdeaHubTopicCategory[];
  subTopics: IdeaHubSubTopic[];
  seriesIdeas: IdeaHubSeriesIdea[];
};

export type IdeaHubStatistics = {
  categoryCount: number;
  subTopicCount: number;
  seriesCount: number;
};