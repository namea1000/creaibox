import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { getMatchedEnglishBrandTerms } from "@/lib/constants/knownEntityMap";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

async function checkIsAdmin(adminSupabase: any, email?: string | null) {
  if (!email) return false;
  if (ADMIN_EMAILS.includes(email)) return true;
  const { data, error } = await adminSupabase
    .from("admin_whitelist")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return !error && !!data;
}

// GET: Fetch all profiles requesting brands/domains and reserved brand IDs (bypassing RLS)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !(await checkIsAdmin(adminSupabase, user.email))) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") ?? "50", 10)));
    const start = page * limit;
    const end = start + limit - 1;

    // 검색, 정렬, 카테고리, 날짜 필터 파라미터
    const sort = searchParams.get("sort") ?? "desc"; // 기본: 최신순 (desc)
    const dateFilter = searchParams.get("dateFilter") ?? "all";
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    const category = searchParams.get("category") ?? "ALL";

    // 1. Fetch profiles with brand/domain info
    const { data: profiles, error: profilesErr } = await adminSupabase
      .from("profiles")
      .select("id, nickname, email, brand_id, requested_brand_id, brand_id_status, brand_id_rejection_reason, extra_configs, updated_at")
      .order("updated_at", { ascending: false });

    if (profilesErr) throw profilesErr;

    const filteredRequests = (profiles || []).filter((r: any) => {
      const hasBrandId = !!r.brand_id;
      const hasRequestedBrand = !!r.requested_brand_id;
      const hasAdditionalBrands = Array.isArray(r.extra_configs?.brand_ids) && r.extra_configs.brand_ids.length > 0;
      const hasCustomDomain = !!r.extra_configs?.custom_domain || !!r.extra_configs?.requested_custom_domain;
      
      let hasFlatCustomDomain = false;
      if (r.extra_configs) {
        for (const key of Object.keys(r.extra_configs)) {
          if (key.startsWith("custom_domain_") || key.startsWith("requested_custom_domain_")) {
            if (r.extra_configs[key]) {
              hasFlatCustomDomain = true;
              break;
            }
          }
        }
      }

      return hasBrandId || hasRequestedBrand || hasAdditionalBrands || hasCustomDomain || hasFlatCustomDomain;
    });

    // 2. Fetch reserved brand IDs (blacklist) - ✅ 동적 쿼리 (정렬, 날짜필터, 검색어, 카테고리)
    let query = adminSupabase
      .from("reserved_brand_ids")
      .select("*", { count: "exact" });

    // 카테고리 필터
    if (category !== "ALL") {
      query = query.eq("category", category);
    }

    // 검색어 필터 (brand_id, reason, 또는 한글 키워드 영문 ilike 매칭)
    if (q) {
      const engTerms = getMatchedEnglishBrandTerms(q);
      if (engTerms.length > 0) {
        // 매칭된 영문 키워드들(예: samsung, coupang)에 대해 brand_id.ilike.%term% 조건 추가
        const termConditions = engTerms.map(term => `brand_id.ilike.%${term}%`).join(",");
        query = query.or(`brand_id.ilike.%${q}%,reason.ilike.%${q}%,${termConditions}`);
      } else {
        query = query.or(`brand_id.ilike.%${q}%,reason.ilike.%${q}%`);
      }
    }

    // 날짜 필터
    if (dateFilter === "today") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      query = query.gte("created_at", todayStart.toISOString());
    } else if (dateFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte("created_at", sevenDaysAgo.toISOString());
    } else if (dateFilter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte("created_at", thirtyDaysAgo.toISOString());
    }

    // 정렬 (created_at desc / asc)
    query = query.order("created_at", { ascending: sort === "asc" }).range(start, end);

    const { data: blacklist, error: blacklistErr, count } = await query;

    if (blacklistErr) throw blacklistErr;

    return NextResponse.json({
      success: true,
      requests: filteredRequests,
      blacklist: blacklist || [],
      blacklistTotal: count ?? 0,
      blacklistPage: page,
      blacklistLimit: limit,
    });
  } catch (error: any) {
    console.error("GET /api/admin/brands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// POST: Manage Blacklist (Add/Delete reserved brand IDs)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !(await checkIsAdmin(adminSupabase, user.email))) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { action, brandId, reason, id } = body;

    if (action === "add_reserved") {
      const cleanId = (brandId || "").trim().toLowerCase();
      if (!cleanId || !/^[a-z0-9]{2,15}$/.test(cleanId)) {
        return NextResponse.json({ error: "유효하지 않은 브랜드 ID입니다. (영문 소문자/숫자 2~15자)" }, { status: 400 });
      }

      const { error } = await adminSupabase
        .from("reserved_brand_ids")
        .insert({
          brand_id: cleanId,
          reason: (reason || "").trim() || "관리자 예약어",
        });

      if (error) throw error;
      return NextResponse.json({ success: true, message: `'${cleanId}' 예약어가 등록되었습니다.` });
    }

    if (action === "delete_reserved") {
      if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
      }

      const { error } = await adminSupabase
        .from("reserved_brand_ids")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "예약어가 삭제되었습니다." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/admin/brands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
