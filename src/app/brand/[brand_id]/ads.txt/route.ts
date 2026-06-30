import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ brand_id: string }> }
) {
  try {
    const { brand_id } = await params;
    const decodedBrandId = decodeURIComponent(brand_id).toLowerCase();

    const supabase = await createAdminClient();

    // Fetch user profile associated with the brand ID
    let profile: any = null;
    const { data: primaryProfile } = await supabase
      .from("profiles")
      .select("id, brand_id, extra_configs")
      .eq("brand_id", decodedBrandId)
      .eq("brand_id_status", "APPROVED")
      .maybeSingle();

    profile = primaryProfile;

    if (!profile) {
      // Fallback search in all profiles extra_configs
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, brand_id, extra_configs")
        .not("extra_configs", "is", null);

      if (profiles) {
        profile = profiles.find((p: any) => {
          const brandIds = p.extra_configs?.brand_ids || [];
          return brandIds.includes(decodedBrandId);
        }) || null;
      }
    }

    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }

    const configs = profile.extra_configs || {};
    const primaryId = profile.brand_id || "";

    // Retrieve adsense_pub_id for the active brand ID
    let adsensePubId = "";
    if (configs[`adsense_pub_id_${decodedBrandId}`]) {
      adsensePubId = configs[`adsense_pub_id_${decodedBrandId}`];
    } else if (decodedBrandId === primaryId.toLowerCase() && configs.adsense_pub_id) {
      adsensePubId = configs.adsense_pub_id;
    }

    if (!adsensePubId) {
      return new Response("ads.txt not configured for this brand", { status: 404 });
    }

    // Standard Adsense ads.txt line
    const cleanPubId = adsensePubId.trim();
    const adsTxtContent = `google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0\n`;

    return new Response(adsTxtContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Failed to generate ads.txt:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
