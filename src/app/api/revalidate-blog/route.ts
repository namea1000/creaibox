import { NextResponse } from "next/server";
import { revalidateAndWarmUpPost } from "@/lib/server/cache-warmup";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { slug, brandId, categoryIds } = await request.json();

    let customDomain: string | null = null;
    if (brandId) {
      try {
        const supabase = await createAdminClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("extra_configs")
          .eq("brand_id", brandId.toLowerCase())
          .maybeSingle();

        const cDom = profile?.extra_configs?.custom_domain || profile?.extra_configs?.[`custom_domain_${brandId.toLowerCase()}`];
        const cDomStatus = profile?.extra_configs?.custom_domain_status || profile?.extra_configs?.[`custom_domain_status_${brandId.toLowerCase()}`];
        if (cDom && cDomStatus === "APPROVED") {
          customDomain = cDom;
        }
      } catch (e) {}
    }

    const { ok, warmedUrls } = await revalidateAndWarmUpPost({
      brandId,
      slug,
      categoryIds,
      customDomain,
    });

    return NextResponse.json({
      ok,
      message: "Blog pages successfully revalidated and warmed up in Edge CDN.",
      warmedCount: warmedUrls.length,
      warmedUrls,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to revalidate blog pages" },
      { status: 500 }
    );
  }
}