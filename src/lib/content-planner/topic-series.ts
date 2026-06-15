import type { IdeaHubSeriesIdea } from "./types";
import { topicSubTopics } from "./topic-categories";

import { aiBusinessFutureSeries } from "./idea-series/ai-business-future";
import { aiTechSeries } from "./idea-series/ai-tech";
import { businessManagementSeries } from "./idea-series/business-management";
import { careerBusinessSeries } from "./idea-series/career-business";
import { cryptoBlockchainSeries } from "./idea-series/crypto-blockchain";
import { designCreativeSeries } from "./idea-series/design-creative";
import { digitalPlatformSeries } from "./idea-series/digital-platform";
import { economyBusinessSeries } from "./idea-series/economy-business";
import { educationCareerSeries } from "./idea-series/education-career";
import { educationKnowledgeSeries } from "./idea-series/education-knowledge";
import { educationLearningSeries } from "./idea-series/education-learning";
import { entertainmentCreativeSeries } from "./idea-series/entertainment-creative";
import { entertainmentCultureSeries } from "./idea-series/entertainment-culture";
import { environmentEsgSeries } from "./idea-series/environment-esg";
import { familyLifeSeries } from "./idea-series/family-life";
import { fashionBeautyStyleSeries } from "./idea-series/fashion-beauty-style";
import { financeInvestingSeries } from "./idea-series/finance-investing";
import { financeInvestmentSeries } from "./idea-series/finance-investment";
import { foodCookingHealthSeries } from "./idea-series/food-cooking-health";
import { foodCookingSeries } from "./idea-series/food-cooking";
import { gameEsportsSeries } from "./idea-series/game-esports";
import { healthMedicalSeries } from "./idea-series/health-medical";
import { hobbiesLifestyleSeries } from "./idea-series/hobbies-lifestyle";
import { homeHobbyDiySeries } from "./idea-series/home-hobby-diy";
import { industryManufacturingSeries } from "./idea-series/industry-manufacturing";
import { itDigitalSeries } from "./idea-series/it-digital";
import { lawGovernmentSocietySeries } from "./idea-series/law-government-society";
import { lawPolicySeries } from "./idea-series/law-policy";
import { lifestyleCultureSeries } from "./idea-series/lifestyle-culture";
import { natureScienceUniverseSeries } from "./idea-series/nature-science-universe";
import { parentingFamilyLifeSeries } from "./idea-series/parenting-family-life";
import { peopleBiographySeries } from "./idea-series/people-biography";
import { petsLifestyleSeries } from "./idea-series/pets-lifestyle";
import { realEstatePropertySeries } from "./idea-series/real-estate-property";
import { religionPhilosophyHumanitiesSeries } from "./idea-series/religion-philosophy-humanities";
import { scienceFutureTechSeries } from "./idea-series/science-future-tech";
import { societyGlobalSeries } from "./idea-series/society-global";
import { sportsAutomobileSeries } from "./idea-series/sports-automobile";
import { sportsOutdoorSeries } from "./idea-series/sports-outdoor";
import { travelLeisureSeries } from "./idea-series/travel-leisure";
import { travelPlaceSeries } from "./idea-series/travel-place";

// New Series Data
import { cyberSecuritySeries } from "./idea-series/cyber-security";
import { dataAnalyticsSeries } from "./idea-series/data-analytics";
import { companyBrandSeries } from "./idea-series/company-brand";
import { shoppingSeries } from "./idea-series/shopping";
import { historySeries } from "./idea-series/history";
import { governmentWelfareSeries } from "./idea-series/government-welfare";
import { militarySecuritySeries } from "./idea-series/military-security";
import { additionalSubtopicsSeries } from "./idea-series/additional-subtopics";
import { newCategorySubtopicsSeries } from "./idea-series/new-subtopics";
const startupCustomSeries: IdeaHubSeriesIdea[] = [
  // 1인 창업 / 소자본 창업
  {
    id: "solo-1",
    categoryId: "business",
    subTopicId: "solo-startup",
    title: "직장인 부업으로 시작하는 1인 지식창업 가이드",
    description: "직장을 다니면서 부업으로 안정적으로 시작할 수 있는 1인 지식창업 단계별 전략",
    tags: ["1인 창업", "부업", "지식창업", "직장인 부업"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 85,
    featured: true,
  },
  {
    id: "solo-2",
    categoryId: "business",
    subTopicId: "solo-startup",
    title: "소자본으로 시작할 수 있는 무자본 창업 아이템 5가지",
    description: "초기 자본 부담 없이 시작하여 빠르게 수익을 낼 수 있는 5가지 디지털 창업 아이템",
    tags: ["무자본 창업", "소자본 창업", "창업 아이템", "디지털 창업"],
    estimatedPosts: 6,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 90,
  },
  {
    id: "solo-3",
    categoryId: "business",
    subTopicId: "solo-startup",
    title: "1인 지식창업을 위한 개인 브랜딩 및 수익화 로드맵",
    description: "개인의 전문 지식을 바탕으로 브랜드를 구축하고 다양한 채널로 수익화하는 로드맵",
    tags: ["개인 브랜딩", "지식 창업", "수익화", "포트폴리오"],
    estimatedPosts: 10,
    difficulty: "어려움",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 80,
  },
  {
    id: "solo-4",
    categoryId: "business",
    subTopicId: "solo-startup",
    title: "실패 없는 1인 소자본 창업 아이디어 및 실행 프로세스",
    description: "안정적인 아이디어 검증을 통해 위험을 줄이고 성공 확률을 높이는 실행 프로세스",
    tags: ["소자본 창업", "아이디어 검증", "창업 프로세스"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 88,
  },
  {
    id: "solo-5",
    categoryId: "business",
    subTopicId: "solo-startup",
    title: "1인 크리에이터를 위한 소자본 비즈니스 모델 설계법",
    description: "구독자 기반 비즈니스에서 벗어나 자체 콘텐츠 상품을 설계하고 판매하는 법",
    tags: ["크리에이터 경제", "비즈니스 모델", "소자본 비즈니스"],
    estimatedPosts: 7,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 82,
  },
  {
    id: "solo-6",
    categoryId: "business",
    subTopicId: "solo-startup",
    title: "무자본 창업가들을 위한 디지털 마케팅 기초 전략",
    description: "블로그, SNS 등 돈 들이지 않고 트래픽을 모을 수 있는 유기적 마케팅 전략",
    tags: ["디지털 마케팅", "무자본 창업", "블로그 마케팅", "SNS 마케팅"],
    estimatedPosts: 9,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 92,
  },

  // 온라인 비즈니스 창업
  {
    id: "online-1",
    categoryId: "business",
    subTopicId: "online-business",
    title: "스마트스토어로 무자본 위탁판매 쇼핑몰 시작하기",
    description: "재고 리스크 없이 도매사이트 상품을 등록하여 판매하는 위탁판매 실전 방법",
    tags: ["스마트스토어", "위탁판매", "쇼핑몰 창업", "무자본 창업"],
    estimatedPosts: 8,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 92,
    featured: true,
  },
  {
    id: "online-2",
    categoryId: "business",
    subTopicId: "online-business",
    title: "해외 구매대행 쇼핑몰 창업 A to Z 실전 가이드",
    description: "해외 유명 플랫폼의 가성비 상품을 국내 소비자에게 배송해주는 구매대행 실전 단계",
    tags: ["해외구매대행", "구매대행 창업", "글로벌 소싱", "쇼핑몰 운영"],
    estimatedPosts: 10,
    difficulty: "어려움",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 88,
  },
  {
    id: "online-3",
    categoryId: "business",
    subTopicId: "online-business",
    title: "온라인 쇼핑몰 창업자를 위한 마케팅 및 노출 최적화 전략",
    description: "내 상품이 쇼핑 포털 검색 결과 상위에 노출되게 하는 상세페이지와 키워드 최적화법",
    tags: ["쇼핑몰 마케팅", "검색 노출 최적화", "SEO", "상세페이지"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "높음",
    trendScore: 90,
  },
  {
    id: "online-4",
    categoryId: "business",
    subTopicId: "online-business",
    title: "직장인을 위한 온라인 쇼핑몰 부업 시작하는 방법",
    description: "하루 2시간 투자로 꾸준한 파이프라인을 구축하는 쇼핑몰 부업 노하우",
    tags: ["쇼핑몰 부업", "직장인 부업", "파이프라인", "온라인 부업"],
    estimatedPosts: 6,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 86,
  },
  {
    id: "online-5",
    categoryId: "business",
    subTopicId: "online-business",
    title: "온라인 쇼핑몰 상품 소싱과 단골 고객 유치 방법",
    description: "경쟁력 있는 도매처를 발굴하고 리뷰 활성화를 통해 단골을 만드는 실전 팁",
    tags: ["상품 소싱", "단골 고객", "리뷰 마케팅", "고객 유치"],
    estimatedPosts: 7,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 84,
  },
  {
    id: "online-6",
    categoryId: "business",
    subTopicId: "online-business",
    title: "스마트스토어로 첫 달 매출 100만원 만들기 전략",
    description: "초기 진입 장벽을 넘기 위해 가성비 광고와 SNS 이벤트를 활용해 매출을 내는 비법",
    tags: ["스마트스토어", "첫 매출", "매출 전략", "초기 창업"],
    estimatedPosts: 9,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 89,
  },

  // 프랜차이즈 창업
  {
    id: "franchise-1",
    categoryId: "business",
    subTopicId: "franchise-startup",
    title: "실패율 줄이는 프랜차이즈 가맹점 계약 핵심 체크리스트",
    description: "프랜차이즈 창업 시 계약서 작성 요령과 필수 확인 사항",
    tags: ["프랜차이즈 창업", "가맹 계약", "창업 가이드", "초기 창업"],
    estimatedPosts: 6,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 87,
  },
  {
    id: "franchise-2",
    categoryId: "business",
    subTopicId: "franchise-startup",
    title: "2026년 유망 프랜차이즈 창업 트렌드 및 비용 분석",
    description: "성장세에 있는 외식, 서비스 등 유망 프랜차이즈 비용 상세 비교",
    tags: ["프랜차이즈 트렌드", "창업 비용", "업종 비교"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 92,
  },
  {
    id: "franchise-3",
    categoryId: "business",
    subTopicId: "franchise-startup",
    title: "프랜차이즈 창업 vs 개인 창업 장단점 완벽 비교",
    description: "초기 예산, 마진율, 브랜딩 관점에서 본 두 창업 방식의 특징",
    tags: ["프랜차이즈 비교", "개인 브랜드 창업", "창업 비교"],
    estimatedPosts: 7,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 85,
  },

  // 외식 & 식당 창업
  {
    id: "restaurant-1",
    categoryId: "business",
    subTopicId: "restaurant-startup",
    title: "외식 초보자를 위한 식당 창업 상권 분석 및 입지 선정 방법",
    description: "유동인구 분석과 경쟁 매장 조사를 통한 똑똑한 상권 입지 선정법",
    tags: ["식당 창업", "상권 분석", "입지 선정", "창업 분석"],
    estimatedPosts: 8,
    difficulty: "어려움",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 89,
  },
  {
    id: "restaurant-2",
    categoryId: "business",
    subTopicId: "restaurant-startup",
    title: "식당 창업 시 초기 주방 설비 및 인테리어 비용 절감 팁",
    description: "중고 설비 활용과 반셀프 인테리어를 통한 초기 인테리어 절약 팁",
    tags: ["식당 창업 비용", "설비 절감", "인테리어 비용"],
    estimatedPosts: 6,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 84,
  },
  {
    id: "restaurant-3",
    categoryId: "business",
    subTopicId: "restaurant-startup",
    title: "소규모 배달 전문 음식점 창업 실전 성공 노하우",
    description: "배달 어플 깃발 꽂기 전략 및 리뷰 관리를 통한 단골 유치 프로세스",
    tags: ["배달 창업", "배달 전문점", "리뷰 관리", "단골 유치"],
    estimatedPosts: 8,
    difficulty: "쉬움",
    monetizationLevel: "높음",
    seoPotential: "높음",
    trendScore: 91,
  },

  // 요즘 뜨는 트렌드 창업
  {
    id: "trending-1",
    categoryId: "business",
    subTopicId: "trending-startup",
    title: "2026년 가장 주목받는 유망 창업 아이템 5가지",
    description: "최신 소비 트렌드를 반영한 차세대 5가지 창업 아이템 소개",
    tags: ["유망 창업", "창업 아이템", "2026 트렌드"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "높음",
    trendScore: 95,
  },
  {
    id: "trending-2",
    categoryId: "business",
    subTopicId: "trending-startup",
    title: "요즘 뜨는 실버 세대 타깃 실버 케어 서비스 창업 가이드",
    description: "초고령화 시대에 맞춰 성장하는 시니어 매칭 및 케어 서비스 비즈니스",
    tags: ["실버 창업", "시니어 비즈니스", "헬스케어"],
    estimatedPosts: 7,
    difficulty: "어려움",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 93,
  },
  {
    id: "trending-3",
    categoryId: "business",
    subTopicId: "trending-startup",
    title: "친환경 및 리사이클링 트렌드 비즈니스 창업 아이디어",
    description: "업사이클링 제품 제작 및 제로웨이스트 매장 창업을 위한 실전 매뉴얼",
    tags: ["친환경 창업", "업사이클링", "ESG 비즈니스"],
    estimatedPosts: 6,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 86,
  },

  // 소자본 & 무자본 창업
  {
    id: "capital-1",
    categoryId: "business",
    subTopicId: "capital-efficient-startup",
    title: "500만원 소자본으로 시작하는 동네 밀착형 서비스 창업",
    description: "소규모 장비만으로 동네 주민 대상 홈서비스(수리, 케어 등) 창업 방법",
    tags: ["소자본 창업", "소규모 창업", "동네 서비스"],
    estimatedPosts: 6,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 88,
  },
  {
    id: "capital-2",
    categoryId: "business",
    subTopicId: "capital-efficient-startup",
    title: "디지털 파일 판매로 무자본 무재고 온라인 창업하기",
    description: "노션 템플릿, PDF 전자책 등 마진율 100% 디지털 콘텐츠 유통 방법",
    tags: ["무자본 창업", "디지털 파일 판매", "노션 템플릿", "전자책"],
    estimatedPosts: 8,
    difficulty: "쉬움",
    monetizationLevel: "높음",
    seoPotential: "높음",
    trendScore: 94,
  },
  {
    id: "capital-3",
    categoryId: "business",
    subTopicId: "capital-efficient-startup",
    title: "소자본 청소 대행 및 홈케어 서비스 창업 가이드",
    description: "에어컨 세척, 입주 청소 등 기술 기반 1인 홈케어 비즈니스 창업 프로세스",
    tags: ["청소 대행", "홈케어 창업", "1인 기술 창업"],
    estimatedPosts: 7,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 83,
  },

  // 유튜브 크리에이터 창업
  {
    id: "youtube-c-1",
    categoryId: "business",
    subTopicId: "youtube-creator-startup",
    title: "유튜브 채널을 1인 기업으로 운영하는 수익 다각화 전략",
    description: "조회수 광고 수익을 넘어 공동구매, 비즈니스 협업으로 채널의 비즈니스 가치 키우기",
    tags: ["유튜브 창업", "1인 크리에이터", "채널 수익화", "유튜브 부업"],
    estimatedPosts: 9,
    difficulty: "어려움",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 91,
  },
  {
    id: "youtube-c-2",
    categoryId: "business",
    subTopicId: "youtube-creator-startup",
    title: "초보 유튜버를 위한 채널 기획 및 빠른 수익화 3단계",
    description: "타깃 독자 프로파일링 and 썸네일 분석으로 구독자 1,000명 달성 전략",
    tags: ["초보 유튜버", "구독자 늘리기", "수익화 전략"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 87,
  },
  {
    id: "youtube-c-3",
    categoryId: "business",
    subTopicId: "youtube-creator-startup",
    title: "얼굴 공개 없이 목소리와 이미지로 유튜브 채널 창업하기",
    description: "AI TTS 성우 및 스톡 미디어를 활용한 얼굴 없는 채널 기획과 실행법",
    tags: ["얼굴 없는 유튜버", "AI 콘텐츠", "자동화 채널"],
    estimatedPosts: 7,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 93,
  },

  // 블로그 미디어 창업
  {
    id: "blog-m-1",
    categoryId: "business",
    subTopicId: "blog-monetization-startup",
    title: "티스토리와 워드프레스로 수익형 미디어 블로그 창업하기",
    description: "서버 구축과 웹 호스팅을 통한 구글 애드센스 승인 및 노출 최적화 노하우",
    tags: ["워드프레스 창업", "구글 애드센스", "수익형 블로그", "애드센스 승인"],
    estimatedPosts: 10,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "높음",
    trendScore: 90,
  },
  {
    id: "blog-m-2",
    categoryId: "business",
    subTopicId: "blog-monetization-startup",
    title: "블로그 이웃 늘리기와 네이버 애드포스트 수익 극대화 전략",
    description: "네이버 인플루언서 선정 조건 분석 및 프리미엄 광고 획득 비결",
    tags: ["네이버 블로그", "애드포스트", "네이버 인플루언서"],
    estimatedPosts: 8,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 86,
  },
  {
    id: "blog-m-3",
    categoryId: "business",
    subTopicId: "blog-monetization-startup",
    title: "쿠팡 파트너스와 제휴 마케팅으로 블로그 부업 자동화 구축",
    description: "구매 전환율을 높이는 추천 글 작성 요령과 수익형 제휴 자동화 포스팅법",
    tags: ["쿠팡 파트너스", "제휴 마케팅", "자동 수익", "블로그 부업"],
    estimatedPosts: 7,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 88,
  },

  // 카페 & 디저트 창업
  {
    id: "cafe-1",
    categoryId: "business",
    subTopicId: "cafe-startup",
    title: "개인 카페 창업 시 디저트 메뉴 구성 및 시그니처 제조 비법",
    description: "사이드 메뉴 개발 및 브랜딩을 통한 디저트 마진 극대화 전략",
    tags: ["카페 창업", "디저트 메뉴", "개인 카페 브랜딩"],
    estimatedPosts: 7,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 85,
  },
  {
    id: "cafe-2",
    categoryId: "business",
    subTopicId: "cafe-startup",
    title: "테이크아웃 전문 저가 커피 프랜차이즈 창업 비용 및 마진율",
    description: "입지 분석과 가맹본사 비교를 통한 실질 마진 계산 전략",
    tags: ["커피 프랜차이즈", "저가 커피 창업", "커피 창업 비용"],
    estimatedPosts: 6,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 90,
  },
  {
    id: "cafe-3",
    categoryId: "business",
    subTopicId: "cafe-startup",
    title: "감성 개인 카페 인테리어 셀프 시공으로 예산 반으로 줄이기",
    description: "페인팅, 조명 설치 등 직영 시공을 통한 예산 최적화 성공 가이드",
    tags: ["카페 셀프 인테리어", "카페 창업 예산", "인테리어 셀프"],
    estimatedPosts: 8,
    difficulty: "어려움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 81,
  },

  // 공간 대여 창업
  {
    id: "space-1",
    categoryId: "business",
    subTopicId: "space-rental-startup",
    title: "공실 상가를 활용한 파티룸 및 렌탈 스튜디오 창업 가이드",
    description: "공간을 시간제로 대여하여 마진을 내는 공간 대여 비즈니스 런칭 프로세스",
    tags: ["파티룸 창업", "렌탈 스튜디오", "공간 대여", "공실 활용"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 88,
  },
  {
    id: "space-2",
    categoryId: "business",
    subTopicId: "space-rental-startup",
    title: "공유 오피스와 비상주 사무실 공간 대여 비즈니스 모델 설계",
    description: "주소지 대여 서비스(비상주)와 무인 워크스테이션을 통한 고부가가치 창업",
    tags: ["공유 오피스", "비상주 사무실", "비즈니스 센터"],
    estimatedPosts: 7,
    difficulty: "어려움",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 86,
  },
  {
    id: "space-3",
    categoryId: "business",
    subTopicId: "space-rental-startup",
    title: "스터디 카페 및 스터디룸 무인 시스템 도입 창업 전략",
    description: "키오스크 및 IoT 연동을 통한 인건비 제로 무인 매장 자동 관리 방법",
    tags: ["스터디 카페", "무인 스터디룸", "키오스크 무인"],
    estimatedPosts: 6,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 83,
  },

  // 무인 매장 창업
  {
    id: "unmanned-1",
    categoryId: "business",
    subTopicId: "unmanned-store-startup",
    title: "직장인 투잡으로 최적인 무인 아이스크림 편의점 창업 가이드",
    description: "CCTV 및 상권 분석을 활용한 직장인 부업형 무인 편의점 창업 매뉴얼",
    tags: ["무인 편의점", "무인 아이스크림", "직장인 투잡", "무인 매장"],
    estimatedPosts: 8,
    difficulty: "쉬움",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 92,
  },
  {
    id: "unmanned-2",
    categoryId: "business",
    subTopicId: "unmanned-store-startup",
    title: "무인 스튜디오 및 무인 셀프 사진관 창업 비용 및 운영 팁",
    description: "인생네컷류 셀프 스튜디오 사진관 기기 렌탈 비용 및 마진율 상세 조사",
    tags: ["무인 사진관", "셀프 스튜디오", "셀프 사진관 창업"],
    estimatedPosts: 7,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 89,
  },
  {
    id: "unmanned-3",
    categoryId: "business",
    subTopicId: "unmanned-store-startup",
    title: "무인 빨래방 창업 시 입지 조건 및 장비 렌탈 비용 비교",
    description: "동네 세탁 수요 파악 및 세탁 장비 리스 비용 최적화 설계 방법",
    tags: ["무인 빨래방", "빨래방 창업", "세탁 전문 매장"],
    estimatedPosts: 6,
    difficulty: "보통",
    monetizationLevel: "보통",
    seoPotential: "높음",
    trendScore: 82,
  },

  // 컨설팅 & 교육 창업
  {
    id: "consulting-1",
    categoryId: "business",
    subTopicId: "consulting-startup",
    title: "내 전문 지식을 활용한 1인 컨설팅 및 코칭 창업 가이드",
    description: "자문, 멘토링, 코칭 등 지식 자산을 활용한 무자본 1인 지식 컨설팅 창업",
    tags: ["1인 컨설팅", "코칭 창업", "지식 자산", "무자본 창업"],
    estimatedPosts: 8,
    difficulty: "보통",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 86,
  },
  {
    id: "consulting-2",
    categoryId: "business",
    subTopicId: "consulting-startup",
    title: "줌(Zoom) 라이브 강의와 전자책 판매로 온라인 교육 창업하기",
    description: "자체 교육 커리큘럼을 설계하고 라이브 세션과 PDF 판매로 수익화하는 노하우",
    tags: ["온라인 교육", "전자책 창업", "줌 강의"],
    estimatedPosts: 7,
    difficulty: "쉬움",
    monetizationLevel: "높음",
    seoPotential: "높음",
    trendScore: 90,
  },
  {
    id: "consulting-3",
    categoryId: "business",
    subTopicId: "consulting-startup",
    title: "기업 강의 및 비즈니스 컨설턴트 포지셔닝 및 영업 노하우",
    description: "B2B 영업 제안서 작성 요령과 강사 매니지먼트 에이전시 등록 전략",
    tags: ["기업 강의", "B2B 제안", "비즈니스 컨설턴트", "강사 영업"],
    estimatedPosts: 8,
    difficulty: "어려움",
    monetizationLevel: "높음",
    seoPotential: "보통",
    trendScore: 83,
  },
];

const rawIdeaHubSeries: IdeaHubSeriesIdea[] = [
  ...startupCustomSeries,
  ...aiBusinessFutureSeries,
  ...aiTechSeries,
  ...businessManagementSeries,
  ...careerBusinessSeries,
  ...cryptoBlockchainSeries,
  ...designCreativeSeries,
  ...digitalPlatformSeries,
  ...economyBusinessSeries,
  ...educationCareerSeries,
  ...educationKnowledgeSeries,
  ...educationLearningSeries,
  ...entertainmentCreativeSeries,
  ...entertainmentCultureSeries,
  ...environmentEsgSeries,
  ...familyLifeSeries,
  ...fashionBeautyStyleSeries,
  ...financeInvestingSeries,
  ...financeInvestmentSeries,
  ...foodCookingHealthSeries,
  ...foodCookingSeries,
  ...gameEsportsSeries,
  ...healthMedicalSeries,
  ...hobbiesLifestyleSeries,
  ...homeHobbyDiySeries,
  ...industryManufacturingSeries,
  ...itDigitalSeries,
  ...lawGovernmentSocietySeries,
  ...lawPolicySeries,
  ...lifestyleCultureSeries,
  ...natureScienceUniverseSeries,
  ...parentingFamilyLifeSeries,
  ...peopleBiographySeries,
  ...petsLifestyleSeries,
  ...realEstatePropertySeries,
  ...religionPhilosophyHumanitiesSeries,
  ...scienceFutureTechSeries,
  ...societyGlobalSeries,
  ...sportsAutomobileSeries,
  ...sportsOutdoorSeries,
  ...travelLeisureSeries,
  ...travelPlaceSeries,

  // New registered series arrays
  ...cyberSecuritySeries,
  ...dataAnalyticsSeries,
  ...companyBrandSeries,
  ...shoppingSeries,
  ...historySeries,
  ...governmentWelfareSeries,
  ...militarySecuritySeries,
  ...additionalSubtopicsSeries,
  ...newCategorySubtopicsSeries,
];

const compoundTranslations: Record<string, string> = {
  // 골프 (Golf)
  "골프 클럽": "Golf Club",
  "골프 스윙": "Golf Swing",
  "골프 자세": "Golf Posture",
  "골프웨어": "Golf Wear",
  "골프화": "Golf Shoes",
  "골프장": "Golf Course",
  "골프 레슨": "Golf Lesson",
  "골프 선수": "Golf Player",
  "스크린골프": "Screen Golf",
  
  // 축구 (Football)
  "축구 전술": "Football Tactics",
  "축구 훈련": "Football Training",
  "축구 경기": "Football Match",
  "축구 리그": "Football League",
  "축구장": "Football Stadium",
  "축구화": "Football Boots",
  "축구공": "Football",
  "축구 레슨": "Football Lesson",
  "축구 역사": "Football History",
  "축구 예능": "Football Variety Show",
  
  // 야구 (Baseball)
  "야구 역사": "Baseball History",
  "야구 규칙": "Baseball Rules",
  "야구 장비": "Baseball Equipment",
  "야구 배트": "Baseball Bat",
  "야구 글러브": "Baseball Glove",
  "야구장": "Baseball Stadium",
  "야구 직관": "Baseball Stadium Visit",
  "야구 응원": "Baseball Cheering",
  "야구 분석": "Baseball Analysis",
  "야구 레슨": "Baseball Lesson",
  
  // 농구 (Basketball)
  "농구 역사": "Basketball History",
  "농구 규칙": "Basketball Rules",
  "농구 전술": "Basketball Tactics",
  "농구 기술": "Basketball Skills",
  "농구화": "Basketball Shoes",
  "농구장": "Basketball Court",
  "농구 훈련": "Basketball Training",
  "농구 분석": "Basketball Analysis",
  "농구 레슨": "Basketball Lesson",
  
  // 테니스 (Tennis)
  "테니스 라켓": "Tennis Racket",
  "테니스 코트": "Tennis Court",
  "테니스웨어": "Tennis Wear",
  "테니스화": "Tennis Shoes",
  "테니스 레슨": "Tennis Lesson",
  "테니스 서브": "Tennis Serve",
  "테니스 스윙": "Tennis Swing",
  "테니스 동호회": "Tennis Club",
  "테니스 대회": "Tennis Tournament",
  
  // 배드민턴 (Badminton)
  "배드민턴 라켓": "Badminton Racket",
  "배드민턴 셔틀콕": "Shuttlecock",
  "배드민턴 코트": "Badminton Court",
  "배드민턴 레슨": "Badminton Lesson",
  "배드민턴 그립": "Badminton Grip",
  "배드민턴 동호회": "Badminton Club",
  "배드민턴 전술": "Badminton Tactics",
  
  // 탁구 (Table Tennis)
  "탁구 라켓": "Table Tennis Racket",
  "탁구 러버": "Table Tennis Rubber",
  "탁구대": "Table Tennis Table",
  "탁구 레슨": "Table Tennis Lesson",
  "탁구 동호회": "Table Tennis Club",
  "탁구 기술": "Table Tennis Skills",
  
  // 수영 (Swimming)
  "수영장": "Swimming Pool",
  "수영복": "Swimsuit",
  "수경": "Goggles",
  "수영 레슨": "Swimming Lesson",
  "수영 영법": "Swimming Strokes",
  
  // 러닝/달리기 (Running)
  "러닝 자세": "Running Form",
  "러닝화": "Running Shoes",
  "러닝 코스": "Running Course",
  "러닝 동호회": "Running Club",
  "러닝 앱": "Running App",
  "달리기 자세": "Running Form",
  "달리기 코스": "Running Course",
  "달리기 스케줄": "Running Schedule",
  
  // 등산 (Hiking)
  "등산 코스": "Hiking Course",
  "등산 장비": "Hiking Gear",
  "등산 스틱": "Hiking Pole",
  "등산화": "Hiking Boots",
  "등산 배낭": "Hiking Backpack",
  "등산 매너": "Hiking Etiquette",
  "등산 동호회": "Hiking Club",
  
  // 부동산 (Real Estate)
  "부동산 투자": "Real Estate Investment",
  "부동산 정책": "Real Estate Policy",
  "부동산 시장": "Real Estate Market",
  "부동산 전망": "Real Estate Outlook",
  "부동산 세금": "Real Estate Tax",
  "부동산 계약": "Real Estate Contract",
  "부동산 중개": "Real Estate Agency",
  
  // 주식 (Stock)
  "주식 투자": "Stock Investment",
  "주식 초보": "Stock Beginner",
  "주식 시장": "Stock Market",
  "주식 전망": "Stock Outlook",
  
  // 비즈니스 (Business)
  "비즈니스 모델": "Business Model",
  "창업 아이템": "Startup Item",
  "마케팅 전략": "Marketing Strategy",
  "브랜드 마케팅": "Brand Marketing",
  
  // 여행 (Travel)
  "여행 코스": "Travel Itinerary",
  "여행지": "Travel Destination",
  "여행 준비물": "Travel Checklist",
  "여행 꿀팁": "Travel Tips",
  
  // 건강 (Health)
  "건강 관리": "Health Care",
  "건강 식품": "Health Food",
  "건강 습관": "Health Habits",
  
  // AI 관련
  "AI 에이전트": "AI Agent",
  "AI 자동화": "AI Automation",
  "AI 코딩": "AI Coding",
  "AI 이미지": "AI Image",
  "AI 영상": "AI Video",
  "AI 음성": "AI Voice",
  "생성형 AI": "Generative AI",
  "대규모 언어모델": "LLM",
  "프롬프트 엔지니어링": "Prompt Engineering",
  
  // New category-specific translations
  "스타트업": "Startup",
  "명상": "Meditation",
  "마음챙김": "Mindfulness",
  "수면 위생": "Sleep Hygiene",
  "인테리어": "Interior",
  "홈데코": "Home Decor",
  "실버 라이프": "Silver Life",
  "패션": "Fashion",
  "뷰티": "Beauty",
  "절세": "Tax Saving",
  "근로기준법": "Labor Standards Act",
  "피치덱": "Pitch Deck",
  "자율주행": "Autonomous Driving",
  "기후변화": "Climate Change",
  "신약 개발": "Drug Development"
};

const sortedCompoundKeys = Object.keys(compoundTranslations).sort((a, b) => b.length - a.length);

function getBilingualTitle(title: string, subTopicId: string): string {
  // Strip 4-digit years (e.g. 2026, 2025, 2024) and any trailing/leading extra spaces
  let newTitle = title.replace(/\b20\d{2}\b\s?/g, "").trim();

  const sub = topicSubTopics.find(s => s.id === subTopicId);
  let subK = "";
  let subE = "";
  let isEnglishFirst = false;

  if (sub) {
    const match = sub.name.match(/^([^(]+)\(([^)]+)\)$/);
    if (match) {
      subK = match[1].trim();
      subE = match[2].trim();
    } else {
      subK = sub.name;
      subE = sub.description || "";
    }
    // Check if English is first (like Gemini (제미나이))
    if (/[a-zA-Z]/.test(subK) && !/[a-zA-Z]/.test(subE)) {
      isEnglishFirst = true;
      const temp = subK;
      subK = subE;
      subE = temp;
    }
  }

  let replaced = false;
  for (const key of sortedCompoundKeys) {
    if (newTitle.includes(key)) {
      const regex = new RegExp(`${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\([^)]+\\)`);
      if (!regex.test(newTitle)) {
        newTitle = newTitle.replace(key, `${key}(${compoundTranslations[key]})`);
        replaced = true;
        break;
      }
    }
  }

  if (!replaced && subK && subE) {
    // subK is Korean name (e.g. "클로드" or "골프")
    // subE is English name (e.g. "Claude" or "Golf")
    
    // Scenario A: Title contains English name (e.g. "Claude")
    if (newTitle.includes(subE)) {
      const regex = new RegExp(`${subE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\([^)]+\\)`);
      if (!regex.test(newTitle)) {
        newTitle = newTitle.replace(subE, isEnglishFirst ? `${subE}(${subK})` : `${subE}(${subK})`);
        replaced = true;
      }
    }
    
    // Scenario B: Title contains Korean name (e.g. "클로드" or "골프")
    if (!replaced && newTitle.includes(subK)) {
      const regex = new RegExp(`${subK.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\([^)]+\\)`);
      if (!regex.test(newTitle)) {
        newTitle = newTitle.replace(subK, isEnglishFirst ? `${subE}(${subK})` : `${subK}(${subE})`);
      }
    }
  }

  return newTitle;
}

// Ensure unique IDs across all loaded series data to prevent React key collisions and display issues
export const ideaHubSeries: IdeaHubSeriesIdea[] = rawIdeaHubSeries.map((item) => ({
  ...item,
  title: getBilingualTitle(item.title, item.subTopicId),
  id: `${item.categoryId}-${item.subTopicId}-${item.id}`,
}));


// ======================================================
// Helpers
// ======================================================

export function getSeriesByCategory(
  categoryId: string
): IdeaHubSeriesIdea[] {
  return ideaHubSeries.filter((item) => item.categoryId === categoryId);
}

export function getSeriesBySubTopic(
  subTopicId: string
): IdeaHubSeriesIdea[] {
  return ideaHubSeries.filter((item) => item.subTopicId === subTopicId);
}

export function getFeaturedSeries(): IdeaHubSeriesIdea[] {
  return ideaHubSeries.filter((item) => item.featured);
}

export function searchSeriesIdeas(keyword: string): IdeaHubSeriesIdea[] {
  const normalized = keyword.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return ideaHubSeries.filter((item) => {
    return (
      item.title.toLowerCase().includes(normalized) ||
      item.description?.toLowerCase().includes(normalized) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
}

export const topicSeriesIdeas = ideaHubSeries;
export const topicSeries = ideaHubSeries;