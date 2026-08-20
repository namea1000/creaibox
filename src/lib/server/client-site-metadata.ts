import { createAdminClient } from "@/utils/supabase/server";
import { cache } from "react";

export function cleanVerificationKey(rawKey: string): string {
  if (!rawKey) return "";
  const clean = rawKey.trim();
  const metaMatch = /content=["']([^"']+)["']/i.exec(clean);
  if (metaMatch && metaMatch[1]) {
    return metaMatch[1].trim();
  }
  if (clean.startsWith("naver-site-verification=")) {
    return clean.replace("naver-site-verification=", "").replace(/["']/g, "").trim();
  }
  if (clean.startsWith("google-site-verification=")) {
    return clean.replace("google-site-verification=", "").replace(/["']/g, "").trim();
  }
  return clean;
}

export const getClientSiteVerificationKeys = cache(async (brandId: string) => {
  try {
    const supabase = await createAdminClient();
    const bKey = brandId.toLowerCase();
    const { data: site } = await supabase
      .from("client_sites")
      .select("extra_configs, user_id")
      .eq("brand_id", bKey)
      .maybeSingle();

    let profileConfigs: any = {};
    if (site?.user_id) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("extra_configs")
        .eq("id", site.user_id)
        .maybeSingle();
      profileConfigs = prof?.extra_configs || {};
    } else {
      const { data: prof } = await supabase
        .from("profiles")
        .select("extra_configs")
        .eq("brand_id", bKey)
        .maybeSingle();
      profileConfigs = prof?.extra_configs || {};
    }

    const naverKey = 
      site?.extra_configs?.naver_advisor_key || 
      profileConfigs[`naver_advisor_key_${bKey}`] || 
      profileConfigs.naver_advisor_key || "";

    const googleKey = 
      site?.extra_configs?.google_search_console_key || 
      profileConfigs[`google_search_console_key_${bKey}`] || 
      profileConfigs.google_search_console_key || "";

    return {
      naverKey: cleanVerificationKey(naverKey),
      googleKey: cleanVerificationKey(googleKey),
    };
  } catch (err) {
    console.error(`Error fetching verification keys for ${brandId}:`, err);
    return { naverKey: "", googleKey: "" };
  }
});
