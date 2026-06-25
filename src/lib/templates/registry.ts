import { BUSINESS_TEMPLATES } from "./categories/business";
import { EDUCATION_TEMPLATES } from "./categories/education";
import { RESTAURANT_TEMPLATES } from "./categories/restaurant";
import { PORTFOLIO_TEMPLATES } from "./categories/portfolio";
import { BLOG_TEMPLATES } from "./categories/blog";
import { STORE_TEMPLATES } from "./categories/store";
import { ART_DESIGN_TEMPLATES } from "./categories/art-design";
import { REAL_ESTATE_TEMPLATES } from "./categories/real-estate";
import { HEALTH_WELLNESS_TEMPLATES } from "./categories/health-wellness";
import { MAGAZINE_TEMPLATES } from "./categories/magazine";
import { MUSIC_TEMPLATES } from "./categories/music";
import { TRAVEL_LIFESTYLE_TEMPLATES } from "./categories/travel-lifestyle";
import { FASHION_BEAUTY_TEMPLATES } from "./categories/fashion-beauty";
import { COMMUNITY_NONPROFIT_TEMPLATES } from "./categories/community-nonprofit";
import { ENTERTAINMENT_TEMPLATES } from "./categories/entertainment";

export interface ThemeConfig {
  fontFamily: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  borderRadius: string;
  glassmorphism: boolean;
}

export interface SectionTemplate {
  section_type: string;
  title: string;
  subtitle: string;
  content_data: any;
}

export interface TemplateConfig {
  templateId: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  theme: ThemeConfig;
  defaultSections: SectionTemplate[];
}

export const TEMPLATE_CATEGORIES = [
  "All",
  "Blog",
  "Portfolio",
  "Business",
  "Store",
  "Art & Design",
  "Real Estate",
  "Health & Wellness",
  "Education",
  "Magazine",
  "Music",
  "Restaurant",
  "Travel & Lifestyle",
  "Fashion & Beauty",
  "Community & Non-Profit",
  "Entertainment"
];

// Merge all category templates modularly
export const TEMPLATE_REGISTRY: Record<string, TemplateConfig> = {
  ...BUSINESS_TEMPLATES,
  ...EDUCATION_TEMPLATES,
  ...RESTAURANT_TEMPLATES,
  ...PORTFOLIO_TEMPLATES,
  ...BLOG_TEMPLATES,
  ...STORE_TEMPLATES,
  ...ART_DESIGN_TEMPLATES,
  ...REAL_ESTATE_TEMPLATES,
  ...HEALTH_WELLNESS_TEMPLATES,
  ...MAGAZINE_TEMPLATES,
  ...MUSIC_TEMPLATES,
  ...TRAVEL_LIFESTYLE_TEMPLATES,
  ...FASHION_BEAUTY_TEMPLATES,
  ...COMMUNITY_NONPROFIT_TEMPLATES,
  ...ENTERTAINMENT_TEMPLATES
};

