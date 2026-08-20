import { createAdminClient } from "@/utils/supabase/server";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface BrandPageProps {
  params: Promise<{ brand_id: string }>;
}

async function getProfileByBrandId(supabase: any, brandId: string) {
  try {
    let { data: profile } = await supabase
      .from("profiles")
      .select("id, brand_id, extra_configs")
      .eq("brand_id", brandId)
      .eq("brand_id_status", "APPROVED")
      .maybeSingle();

    if (!profile) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, brand_id, extra_configs")
        .not("extra_configs", "is", null);

      if (profiles) {
        profile = profiles.find((p: any) => {
          const brandIds = p.extra_configs?.brand_ids || [];
          return brandIds.includes(brandId);
        }) || null;
      }
    }
    return profile;
  } catch (err) {
    console.error("getProfileByBrandId exception in robots route:", err);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: BrandPageProps
) {
  const { brand_id } = await params;
  const decodedBrandId = decodeURIComponent(brand_id).toLowerCase();
  const supabase = await createAdminClient();

  const profile = await getProfileByBrandId(supabase, decodedBrandId);

  const configs = profile?.extra_configs || {};
  const customDomain = configs[`custom_domain_${decodedBrandId}`] || 
    (decodedBrandId === profile?.brand_id ? configs.custom_domain : "");
  const customDomainStatus = configs[`custom_domain_status_${decodedBrandId}`] || 
    (decodedBrandId === profile?.brand_id ? configs.custom_domain_status : "NONE");

  const baseUrl = (customDomain && customDomainStatus === "APPROVED")
    ? `https://${customDomain}`
    : `https://${decodedBrandId}.creaibox.com`;

  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
