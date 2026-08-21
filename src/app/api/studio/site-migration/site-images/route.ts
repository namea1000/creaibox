import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

/**
 * 🔍 [GET] 사이트 내의 모든 이미지 목록 및 문맥 정보 조회 API
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json({ error: "siteId 파라미터가 필요합니다." }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    const { data: site, error: siteError } = await adminSupabase
      .from("client_sites")
      .select("id, brand_id, company_name, extra_configs")
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json({ error: "사이트를 찾을 수 없습니다." }, { status: 404 });
    }

    const { data: sections } = await adminSupabase
      .from("site_sections")
      .select("id, section_type, sort_order, title, content_data")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true });

    const imageList: Array<{
      url: string;
      sectionTitle: string;
      sectionType: string;
      isLogo: boolean;
      purpose: "hero" | "card" | "icon" | "general";
    }> = [];

    const seenUrls = new Set<string>();

    function extractUrls(html: string, sectionTitle: string, sectionType: string, isHeader: boolean) {
      if (!html) return;
      const matches = html.matchAll(/src=["'](https?:\/\/[^"']+)["']/gi);
      for (const m of matches) {
        const url = m[1];
        if (!seenUrls.has(url) && !url.includes("data:")) {
          seenUrls.add(url);
          const isLogo = isHeader || url.toLowerCase().includes("logo") || sectionTitle.toLowerCase().includes("logo");
          const isHero = sectionType === "hero" || sectionType === "hero_image_slider";
          imageList.push({
            url,
            sectionTitle,
            sectionType,
            isLogo,
            purpose: isLogo ? "icon" : isHero ? "hero" : "card",
          });
        }
      }
    }

    // Header & Footer
    const headerHtml = site.extra_configs?.header_html || "";
    const footerHtml = site.extra_configs?.footer_html || "";
    if (headerHtml) extractUrls(headerHtml, "상단 헤더 & 로고", "header", true);
    if (footerHtml) extractUrls(footerHtml, "하단 푸터 & 로고", "footer", true);

    // Sections
    (sections || []).forEach((sec, idx) => {
      const isHero = sec.section_type === "hero" || sec.section_type === "hero_image_slider" || idx === 0;
      const title = sec.title || `섹션 ${idx + 1}`;

      if (sec.content_data?.html) {
        extractUrls(sec.content_data.html, title, sec.section_type, false);
      }
      if (sec.content_data?.image && !seenUrls.has(sec.content_data.image)) {
        seenUrls.add(sec.content_data.image);
        imageList.push({
          url: sec.content_data.image,
          sectionTitle: `${title} (메인 배너)`,
          sectionType: sec.section_type,
          isLogo: false,
          purpose: isHero ? "hero" : "card",
        });
      }
      if (Array.isArray(sec.content_data?.media_urls)) {
        sec.content_data.media_urls.forEach((u: string) => {
          if (typeof u === "string" && u.startsWith("http") && !seenUrls.has(u)) {
            seenUrls.add(u);
            imageList.push({
              url: u,
              sectionTitle: `${title} (갤러리 미디어)`,
              sectionType: sec.section_type,
              isLogo: false,
              purpose: "card",
            });
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        siteId: site.id,
        brandId: site.brand_id,
        companyName: site.company_name,
        images: imageList,
        totalCount: imageList.length,
      },
    });
  } catch (err: any) {
    console.error("[Site Images API] Error:", err);
    return NextResponse.json({ error: err.message || "이미지 목록 조회 중 오류 발생" }, { status: 500 });
  }
}
