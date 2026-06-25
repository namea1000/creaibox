import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const RESERVED_SUBDOMAINS = ["www", "admin", "api", "studio", "assets", "creaibox", "blog", "main", "test", "demo", "localhost"];

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 2. Validate Business Membership Level
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_level, role")
      .eq("id", user.id)
      .maybeSingle();

    const mLevel = (profile?.membership_level || "").toLowerCase();
    const role = (profile?.role || "").toUpperCase();
    const isBusiness =
      mLevel === "business" ||
      mLevel === "enterprise" ||
      mLevel === "admin" ||
      role === "ADMIN" ||
      role === "SUPER_ADMIN";

    if (!isBusiness) {
      return NextResponse.json(
        { error: "홈페이지 제작 권한이 없습니다. Business 요금제로 업그레이드해 주세요." },
        { status: 403 }
      );
    }

    // 3. Parse input
    const { brandId, templateId, companyName, phone, address, extraConfigs = {}, sections = [] } = await req.json();

    if (!brandId || !companyName || !templateId) {
      return NextResponse.json(
        { error: "필수 입력 항목(브랜드명, 회사명, 템플릿 코드)이 누락되었습니다." },
        { status: 400 }
      );
    }

    const cleanBrandId = brandId.trim().toLowerCase();

    // 4. Validate brandId format
    const brandIdRegex = /^[a-z0-9-]+$/;
    if (!brandIdRegex.test(cleanBrandId)) {
      return NextResponse.json(
        { error: "브랜드 아이디는 영문 소문자, 숫자, 하이픈(-)만 사용하여 2자 이상 입력할 수 있습니다." },
        { status: 400 }
      );
    }

    if (RESERVED_SUBDOMAINS.includes(cleanBrandId)) {
      return NextResponse.json(
        { error: "사용할 수 없는 예약된 브랜드 아이디입니다. 다른 이름을 선택해 주세요." },
        { status: 400 }
      );
    }

    // 5. Check if brandId already exists in client_sites or profiles (as a default brand_id)
    const { data: existingSite } = await supabase
      .from("client_sites")
      .select("id")
      .eq("brand_id", cleanBrandId)
      .maybeSingle();

    if (existingSite) {
      return NextResponse.json(
        { error: "이미 사용 중인 브랜드 아이디(서브도메인)입니다. 다른 이름을 입력해 주세요." },
        { status: 409 }
      );
    }

    // 6. Insert client_sites
    const { data: newSite, error: siteInsertError } = await supabase
      .from("client_sites")
      .insert({
        profile_id: user.id,
        brand_id: cleanBrandId,
        template_id: templateId,
        company_name: companyName,
        phone: phone || null,
        address: address || null,
        extra_configs: extraConfigs,
        status: "ACTIVE"
      })
      .select("id, brand_id, company_name")
      .single();

    if (siteInsertError) {
      console.error("Site insert error:", siteInsertError);
      return NextResponse.json(
        { error: `홈페이지 메타데이터 저장 실패: ${siteInsertError.message}` },
        { status: 500 }
      );
    }

    // 7. Insert site_sections in bulk
    if (sections && sections.length > 0) {
      const sectionsToInsert = sections.map((sect: any, idx: number) => ({
        site_id: newSite.id,
        section_type: sect.section_type,
        sort_order: idx,
        title: sect.title || null,
        subtitle: sect.subtitle || null,
        content_data: sect.content_data || {}
      }));

      const { error: sectionsInsertError } = await supabase
        .from("site_sections")
        .insert(sectionsToInsert);

      if (sectionsInsertError) {
        console.error("Sections insert error, rolling back site:", sectionsInsertError);
        // Rollback site creation if sections fail to keep DB clean
        await supabase.from("client_sites").delete().eq("id", newSite.id);
        return NextResponse.json(
          { error: `홈페이지 섹션 데이터 적재 실패: ${sectionsInsertError.message}` },
          { status: 500 }
        );
      }
    }

    // 8. Auto-approve brand_id on profile if relevant (to sync subdomains in the main platform profiles)
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("extra_configs")
        .eq("id", user.id)
        .single();
        
      const currentConfigs = profileData?.extra_configs || {};
      const currentBrandIds = currentConfigs.brand_ids || [];
      
      if (!currentBrandIds.includes(cleanBrandId)) {
        await supabase
          .from("profiles")
          .update({
            extra_configs: {
              ...currentConfigs,
              brand_ids: [...currentBrandIds, cleanBrandId]
            }
          })
          .eq("id", user.id);
      }
    } catch (profileErr) {
      console.error("Profile extra_configs brand_id sync failed:", profileErr);
    }

    return NextResponse.json({
      success: true,
      siteId: newSite.id,
      brandId: newSite.brand_id,
      companyName: newSite.company_name
    });
  } catch (error: any) {
    console.error("Build API route error:", error);
    return NextResponse.json(
      { error: error.message || "홈페이지 빌드 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
