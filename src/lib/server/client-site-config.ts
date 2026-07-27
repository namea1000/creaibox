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

// Default fallback configuration for sotongcheum
const DEFAULT_SOTONGCHEUM_CONFIG: ClientSiteConfig = {
  companyName: "소통과 채움",
  phone: "031-292-3806",
  address: "경기도 화성시 봉담읍 동화길 51, 401호",
  email: "sotongcheum@naver.com",
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

    // Try finding any profile with extra_configs containing companyName
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("extra_configs")
      .not("extra_configs", "is", null)
      .limit(10);

    if (profiles && profiles.length > 0) {
      for (const p of profiles) {
        const cfg = p.extra_configs as ClientSiteConfig;
        if (cfg && (cfg.companyName || cfg.customMenus)) {
          clientConfigCache.set(cleanBrand, cfg);
          return cfg;
        }
      }
    }
  } catch (err) {
    console.error("getClientSiteConfig error:", err);
  }

  return cleanBrand === "sotongcheum" ? DEFAULT_SOTONGCHEUM_CONFIG : {};
}
