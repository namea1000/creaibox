import type {
  ContentKeywordMetric,
  ContentPlannerCampaign,
  ContentPlannerItem,
  ContentPlannerResult,
  OpportunityCardItem,
  RecommendedSeriesItem,
} from "./types";

export const mockOpportunityCards: OpportunityCardItem[] = [
  {
    label: "트렌드 키워드",
    value: "126",
    description: "최근 상승 중인 키워드",
  },
  {
    label: "황금 키워드",
    value: "38",
    description: "낮은 경쟁도 + 높은 검색량",
  },
  {
    label: "돈 되는 키워드",
    value: "17",
    description: "광고 및 구매 의도 키워드",
  },
  {
    label: "급상승 키워드",
    value: "12",
    description: "최근 급증 검색어",
  },
];

export const mockRecommendedSeries: RecommendedSeriesItem[] = [
  {
    title: "AI 자동화 블로그 시리즈",
    score: 94,
    label: "SEO 기회",
    description: "검색 유입 중심 전략",
  },
  {
    title: "쇼츠 성장 전략 시리즈",
    score: 91,
    label: "성장 기회",
    description: "구독자 확보 중심",
  },
  {
    title: "네이버 클립 확장 시리즈",
    score: 88,
    label: "확산 기회",
    description: "국내 숏폼 확장",
  },
  {
    title: "유튜브 롱폼 수익화 시리즈",
    score: 87,
    label: "수익 기회",
    description: "광고 수익 극대화 전략",
  },
  {
    title: "인스타그램 릴스 바이럴 시리즈",
    score: 85,
    label: "바이럴 기회",
    description: "도달율 및 브랜딩 강화",
  },
  {
    title: "지식 베이스 활용 뉴스레터 시리즈",
    score: 83,
    label: "구독 기회",
    description: "뉴스레터 기반 팬덤 확보",
  },
  {
    title: "글로벌 다국어 콘텐츠 시리즈",
    score: 80,
    label: "글로벌 기회",
    description: "번역 및 해외 유입 전략",
  },
];

export const mockTrendKeywords = [
  "AI 콘텐츠 자동화",
  "블로그 수익화",
  "유튜브 쇼츠 알고리즘",
  "네이버 클립 성장",
  "GPT 활용법",
  "AI 에이전트",
  "자동 포스팅",
  "SEO 최적화",
  "구글 검색 상위노출",
  "콘텐츠 캘린더",
];

export const mockGoldenKeywords = [
  "AI 자동 포스팅",
  "AI 블로그 수익화",
  "SEO 글쓰기",
  "네이버 클립 수익",
  "GPT 자동화",
];

export const mockMoneyKeywords = [
  "워드프레스 수익화",
  "블로그 광고 수익",
  "AI SaaS 추천",
  "유튜브 쇼츠 수익",
  "온라인 부업",
];

export const mockKeywordMetrics: ContentKeywordMetric[] = [
  {
    keyword: "AI 콘텐츠 자동화",
    source: "mixed",
    region: "KR",
    period: "30d",
    searchVolume: 5400,
    competitionLevel: "보통",
    cpc: 1.85,
    trendScore: 91,
    monetizationScore: 82,
    opportunityScore: 89,
    relatedKeywords: [
      "AI 블로그",
      "자동 포스팅",
      "콘텐츠 자동화",
    ],
    risingKeywords: [
      "AI 에이전트",
      "GPT 자동화",
      "AI 생산성",
    ],
  },
  {
    keyword: "유튜브 쇼츠 알고리즘",
    source: "google_trends",
    region: "KR",
    period: "30d",
    searchVolume: 8200,
    competitionLevel: "높음",
    cpc: 1.12,
    trendScore: 95,
    monetizationScore: 75,
    opportunityScore: 84,
    relatedKeywords: [
      "쇼츠 조회수",
      "쇼츠 성장",
      "유튜브 추천",
    ],
    risingKeywords: [
      "쇼츠 수익화",
      "쇼츠 전략",
      "쇼츠 훅",
    ],
  },
];

export const mockCampaign: ContentPlannerCampaign = {
  id: "campaign-demo-001",

  title: "AI 콘텐츠 자동화 멀티 플랫폼 시리즈",

  description:
    "검색 유입과 숏폼 확산을 동시에 노리는 콘텐츠 시리즈",

  strategySummary:
    "하나의 주제를 블로그, 네이버, 쇼츠, SNS까지 확장하는 전략",

  goals: [
    "SEO 검색 유입",
    "트래픽 증가",
  ],

  platforms: [
    "Creaibox 블로그",
    "네이버 블로그",
    "YouTube Shorts",
  ],

  contentType: "멀티 플랫폼 콘텐츠 기획",

  itemCount: 10,

  mainKeyword: "AI 콘텐츠 자동화",

  subKeywords: [
    "AI 블로그",
    "자동 포스팅",
    "콘텐츠 생산성",
  ],

  trendKeywords: mockTrendKeywords,

  goldenKeywords: mockGoldenKeywords,

  moneyKeywords: mockMoneyKeywords,

  targetAudience:
    "1인 기업, 블로거, 콘텐츠 크리에이터",

  brandTone:
    "전문적이면서도 실전 중심",

  status: "generated",
};

export const mockPlannerItems: ContentPlannerItem[] = [
  {
    id: "item-001",
    campaignId: "campaign-demo-001",

    itemOrder: 1,

    title:
      "AI 콘텐츠 자동화로 블로그와 쇼츠를 동시에 운영하는 방법",

    contentType: "멀티 플랫폼 콘텐츠 기획",

    primaryPlatform: "Creaibox 블로그",

    targetPlatforms: [
      "Creaibox 블로그",
      "네이버 블로그",
      "YouTube Shorts",
    ],

    mainKeyword: "AI 콘텐츠 자동화",

    subKeywords: [
      "AI 블로그",
      "자동 포스팅",
    ],

    searchIntent:
      "정보 탐색",

    targetAudience:
      "블로거",

    contentAngle:
      "실전 적용",

    hook:
      "하루 10분으로 콘텐츠 생산량을 10배 늘리는 방법",

    keyPoints: [
      "AI 기획",
      "AI 작성",
      "멀티채널 배포",
    ],

    outline: [
      "문제 제기",
      "AI 활용",
      "실전 사례",
      "실행 방법",
    ],

    cta:
      "콘텐츠 자동화 시스템 구축",

    trendScore: 92,
    seoScore: 95,
    monetizationScore: 82,
    difficultyScore: 45,
    opportunityScore: 92,

    status: "planned",
  },

  {
    id: "item-002",
    campaignId: "campaign-demo-001",

    itemOrder: 2,

    title:
      "초보자가 네이버 블로그에서 놓치는 검색 노출 체크리스트",

    contentType: "블로그 글쓰기 콘텐츠",

    primaryPlatform: "네이버 블로그",

    targetPlatforms: [
      "네이버 블로그",
    ],

    mainKeyword:
      "네이버 블로그 SEO",

    subKeywords: [
      "검색 노출",
      "블로그 최적화",
    ],

    searchIntent:
      "문제 해결",

    targetAudience:
      "초보 블로거",

    contentAngle:
      "체크리스트",

    hook:
      "검색이 안 되는 이유는 대부분 이것 때문입니다",

    keyPoints: [
      "제목",
      "키워드",
      "체류시간",
    ],

    outline: [
      "실수 사례",
      "체크리스트",
      "개선 방법",
    ],

    cta:
      "블로그 진단",

    trendScore: 88,
    seoScore: 91,
    monetizationScore: 72,
    difficultyScore: 30,
    opportunityScore: 87,

    status: "planned",
  },

  {
    id: "item-003",
    campaignId: "campaign-demo-001",

    itemOrder: 3,

    title:
      "15초 안에 시청자를 붙잡는 쇼츠 첫 문장 공식",

    contentType: "유튜브 쇼츠 기획",

    primaryPlatform: "YouTube Shorts",

    targetPlatforms: [
      "YouTube Shorts",
      "TikTok",
      "Instagram Reels",
    ],

    mainKeyword:
      "쇼츠 훅",

    subKeywords: [
      "쇼츠 알고리즘",
      "시청 유지율",
    ],

    searchIntent:
      "실전 활용",

    targetAudience:
      "영상 크리에이터",

    contentAngle:
      "성장 전략",

    hook:
      "조회수는 첫 3초에 결정됩니다",

    keyPoints: [
      "후킹",
      "전개",
      "CTA",
    ],

    outline: [
      "첫 문장",
      "예시",
      "응용",
    ],

    cta:
      "쇼츠 제작",

    trendScore: 95,
    seoScore: 70,
    monetizationScore: 80,
    difficultyScore: 50,
    opportunityScore: 89,

    status: "planned",
  },
];

export const mockPlannerResult: ContentPlannerResult = {
  campaign: mockCampaign,
  items: mockPlannerItems,
  outputs: [],
};