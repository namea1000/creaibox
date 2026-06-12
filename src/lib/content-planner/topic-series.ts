import type { IdeaHubSeriesIdea } from "./types";

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
];

// Ensure unique IDs across all loaded series data to prevent React key collisions and display issues
export const ideaHubSeries: IdeaHubSeriesIdea[] = rawIdeaHubSeries.map((item) => ({
  ...item,
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