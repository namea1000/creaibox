import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/server";

// System Reserved Slugs that can never be registered by users
export const SYSTEM_RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "studio",
  "dashboard",
  "auth",
  "login",
  "signup",
  "signout",
  "app",
  "blog",
  "help",
  "support",
  "billing",
  "pay",
  "payment",
  "mail",
  "email",
  "cdn",
  "static",
  "assets",
  "media",
  "www",
  "root",
  "creaibox",
  "creaicode",
  "internal",
  "dev",
  "test",
  "staging",
  "prod",
  "production",
  "system",
  "null",
  "undefined",
  "status",
  "terms",
  "privacy",
  "docs",
  "webhook",
  "webhooks",
]);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const { siteId, newSlug, action = "promote" } = await request.json();

    if (!siteId) {
      return NextResponse.json({ error: "사이트 ID가 누락되었습니다." }, { status: 400 });
    }

    const cleanSlug = (newSlug || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "");

    if (!cleanSlug || cleanSlug.length < 2 || cleanSlug.length > 30) {
      return NextResponse.json(
        { error: "도메인은 영문 소문자, 숫자, 하이픈(-) 조합 2~30자 이내여야 합니다." },
        { status: 400 }
      );
    }

    // 1. Check System Reserved Slugs
    if (SYSTEM_RESERVED_SLUGS.has(cleanSlug)) {
      return NextResponse.json(
        {
          success: false,
          code: "RESERVED_WORD",
          error: `'${cleanSlug}'은(는) CreaiBox 시스템 핵심 보호 예약어이므로 등록할 수 없습니다. (추천: my-${cleanSlug}, ${cleanSlug}-official 등)`,
        },
        { status: 400 }
      );
    }

    const adminSupabase = await createAdminClient();

    // 2. Fetch the target site that wants to be promoted
    const { data: targetSite, error: targetError } = await adminSupabase
      .from("client_sites")
      .select("*")
      .eq("id", siteId)
      .single();

    if (targetError || !targetSite) {
      return NextResponse.json({ error: "대상 사이트를 찾을 수 없습니다." }, { status: 404 });
    }

    // Verify ownership
    if (targetSite.profile_id !== user.id) {
      return NextResponse.json({ error: "본인이 생성한 사이트만 도메인을 변경할 수 있습니다." }, { status: 403 });
    }

    // If target site already has this exact brand_id
    if (targetSite.brand_id === cleanSlug) {
      // Just promote to PUBLISHED
      await adminSupabase
        .from("client_sites")
        .update({
          status: "PUBLISHED",
          extra_configs: {
            ...(targetSite.extra_configs || {}),
            is_draft: false,
            published_at: new Date().toISOString(),
          },
        })
        .eq("id", siteId);

      return NextResponse.json({
        success: true,
        code: "PROMOTED",
        message: `'${cleanSlug}.creaibox.com' 정식 라이브 배포가 완료되었습니다!`,
        brandId: cleanSlug,
        status: "PUBLISHED",
      });
    }

    // 3. Check if cleanSlug is already taken in DB
    const { data: existingSite } = await adminSupabase
      .from("client_sites")
      .select("id, profile_id, brand_id, company_name")
      .eq("brand_id", cleanSlug)
      .maybeSingle();

    if (existingSite) {
      // Case A: Owned by another user -> Strict Block
      if (existingSite.profile_id !== user.id) {
        return NextResponse.json(
          {
            success: false,
            code: "OWNED_BY_ANOTHER",
            error: `'${cleanSlug}'은(는) 이미 다른 회원이 사용 중인 도메인입니다. 다른 도메인을 선택해 주세요.`,
          },
          { status: 409 }
        );
      }

      // Case B: Owned by current user -> Conflict resolution
      if (action === "check") {
        return NextResponse.json({
          success: true,
          code: "OWNED_BY_ME_CONFLICT",
          conflictSiteId: existingSite.id,
          conflictSiteName: existingSite.company_name,
          message: `이전에 만드신 내 테스트 사이트('${existingSite.company_name || cleanSlug}')가 이미 사용 중입니다. 기존 사이트를 임시 주소로 스왑하고 이 사이트를 승격할까요?`,
        });
      }

      // Action is "promote" or "swap": Rename existing old site to random preview slug
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const swappedOldSlug = `${cleanSlug}-${randomSuffix}`;

      await adminSupabase
        .from("client_sites")
        .update({
          brand_id: swappedOldSlug,
          status: "DRAFT",
          extra_configs: {
            is_draft: true,
            swapped_at: new Date().toISOString(),
          },
        })
        .eq("id", existingSite.id);
    }

    // 4. Update Target Site with new brand_id and PUBLISHED status
    const { error: updateError } = await adminSupabase
      .from("client_sites")
      .update({
        brand_id: cleanSlug,
        status: "PUBLISHED",
        extra_configs: {
          ...(targetSite.extra_configs || {}),
          is_draft: false,
          published_at: new Date().toISOString(),
        },
      })
      .eq("id", siteId);

    if (updateError) {
      console.error("Failed to promote domain:", updateError);
      return NextResponse.json({ error: "도메인 승격 중 DB 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      code: "PROMOTED",
      message: `🎉 축하합니다! '${cleanSlug}.creaibox.com' 정식 라이브 배포가 완료되었습니다!`,
      brandId: cleanSlug,
      status: "PUBLISHED",
    });
  } catch (error: any) {
    console.error("Error promoting domain:", error);
    return NextResponse.json({ error: error.message || "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
