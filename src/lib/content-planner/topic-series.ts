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


const rawIdeaHubSeries: IdeaHubSeriesIdea[] = [
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