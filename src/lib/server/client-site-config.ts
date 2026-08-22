import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

export interface CustomMenuItem {
  id: string;
  label: string;
  url: string;
  isRightAligned?: boolean;
}

export interface ClientSiteConfig {
  companyName?: string;
  phone?: string;
  address?: string;
  email?: string;
  bizNumber?: string;
  description?: string;
  kakaoLink?: string;
  themeColor?: string;
  headerBlogTitle?: string;
  headerContactTitle?: string;
  heroSlogan?: string;
  logoUrl?: string;
  customMenus?: CustomMenuItem[];
  pgProvider?: string;
  pgMid?: string;
  pgApiKey?: string;
  enableBankTransfer?: boolean;
  bankAccountInfo?: string;
  enableInquiryPayment?: boolean;
}

// In-Memory Shared Cache
const clientConfigCache = new Map<string, ClientSiteConfig>();

// Default fallback configuration for sotongchaeum
const DEFAULT_SOTONGCHAEUM_CONFIG: ClientSiteConfig = {
  companyName: "소통과 채움",
  phone: "031-292-3806",
  address: "경기도 화성시 봉담읍 동화길 51, 401호",
  email: "sotongchaeum@naver.com",
  bizNumber: "693-88-00815",
  description: "공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과 채움 협동조합입니다.",
  customMenus: [
    { id: "1", label: "홈", url: "/" },
    { id: "2", label: "회사소개", url: "/about" },
    { id: "3", label: "사업영역", url: "/#business" },
    { id: "4", label: "행사렌탈", url: "/#rental" },
    { id: "5", label: "실적갤러리", url: "/#portfolio" },
    { id: "6", label: "블로그", url: "/blog" },
    { id: "7", label: "견적문의", url: "/contact", isRightAligned: true },
  ],
};

// Default configuration for futuremind
const DEFAULT_FUTUREMIND_CONFIG: ClientSiteConfig = {
  companyName: "미래교육문화협회 (퓨처마인드)",
  phone: "02-1588-0000",
  email: "contact@futuremind.kr",
  description: "AI라는 경계 없는 마음 하나로, 시간과 공간을 넘어 모든 것을 연결시킵니다. 미래교육문화협회(퓨처마인드)",
  customMenus: [
    { id: "1", label: "미래를 보는 마음", url: "/" },
    { id: "2", label: "WE WORK", url: "/work" },
    { id: "3", label: "교육", url: "/education" },
    { id: "4", label: "기획", url: "/planning" },
    { id: "5", label: "개발", url: "/development" },
    { id: "6", label: "홍보", url: "/marketing" },
    { id: "7", label: "상담 신청하기", url: "/#contact", isRightAligned: true },
  ],
};

export async function saveClientSiteConfig(brandId: string, config: ClientSiteConfig) {
  const cleanBrand = brandId.toLowerCase().trim();
  clientConfigCache.set(cleanBrand, config);

  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ extra_configs: config as any })
      .eq("brand_id", cleanBrand);

    if (error) {
      console.warn("saveClientSiteConfig profiles update message:", error.message);
    }
  } catch (err) {
    console.error("saveClientSiteConfig error:", err);
  }
}

export async function getClientSiteConfig(brandId: string): Promise<ClientSiteConfig> {
  const cleanBrand = brandId.toLowerCase().trim();

  // 1. Check in-memory shared cache
  if (clientConfigCache.has(cleanBrand)) {
    return clientConfigCache.get(cleanBrand)!;
  }

  // 2. Query Supabase DB by brand_id or profiles extra_configs
  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("extra_configs")
      .eq("brand_id", cleanBrand)
      .maybeSingle();

    if (profile?.extra_configs) {
      const cfg = profile.extra_configs as ClientSiteConfig;
      clientConfigCache.set(cleanBrand, cfg);
      return cfg;
    }
  } catch (err) {
    console.error("getClientSiteConfig error:", err);
  }

  if (cleanBrand === "futuremind" || cleanBrand === "futuremind2" || cleanBrand === "futuremind-2z3u") return DEFAULT_FUTUREMIND_CONFIG;
  if (cleanBrand === "sotongchaeum" || cleanBrand === "sotongcheum" || cleanBrand === "commufill") {
    return DEFAULT_SOTONGCHAEUM_CONFIG;
  }
  
  return {};
}
