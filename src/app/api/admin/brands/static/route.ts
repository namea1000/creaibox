import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import reservedBrandsData from "@/lib/constants/reservedBrandsData.json";
import { STATIC_BRAND_CATEGORIES } from "@/lib/constants/reservedBrandsStatic";
import { getMatchedBrandIdsByKoreanEntity } from "@/lib/constants/knownEntityMap";

export const runtime = "nodejs";

// 정적 카테고리 Set (빠른 조회용)
const STATIC_SET = new Set<string>(STATIC_BRAND_CATEGORIES);

// 관리자 권한 이메일
const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

type BrandEntry = { brand_id: string; category: string; reason: string };
const ALL_DATA = reservedBrandsData as BrandEntry[];

/**
 * GET /api/admin/brands/static?category=SYSTEM&page=0&limit=20&q=검색어
 *
 * 정적 카테고리(코드 상수로 관리되는 것들)를 JSON 원천 데이터에서 조회.
 * DB에는 없으므로 JSON 파일을 서버에서 직접 읽어 반환.
 */
export async function GET(req: NextRequest) {
  try {
    // 관리자 권한 확인
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdminEmail = ADMIN_EMAILS.includes(user.email ?? "");
    if (!isAdminEmail) {
      const { data: adminData } = await adminSupabase
        .from("admin_whitelist")
        .select("email")
        .eq("email", user.email)
        .maybeSingle();
      if (!adminData) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? "";
    const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") ?? "20", 10)));
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();

    // 정적 카테고리인지 확인
    if (category && !STATIC_SET.has(category)) {
      return NextResponse.json(
        { error: `'${category}'는 정적 카테고리가 아닙니다.` },
        { status: 400 }
      );
    }

    const matchedIds = q ? getMatchedBrandIdsByKoreanEntity(q) : [];

    // JSON 원천 데이터 필터링
    let filtered = ALL_DATA.filter((item) => {
      if (category && item.category !== category) return false;
      if (!STATIC_SET.has(item.category)) return false; // 정적 카테고리만
      if (q) {
        const matchesBrandId = item.brand_id.includes(q);
        const matchesReason = item.reason.toLowerCase().includes(q);
        const matchesMapped = matchedIds.includes(item.brand_id.toLowerCase());
        return matchesBrandId || matchesReason || matchesMapped;
      }
      return true;
    });

    const total = filtered.length;

    // 페이지네이션
    const start = page * limit;
    const paginated = filtered.slice(start, start + limit);

    // 관리자 화면 호환 형식으로 변환 (id는 가상값 - 정적이므로 DB id 없음)
    const items = paginated.map((item, idx) => ({
      id: `static_${item.brand_id}`, // 가상 ID (DB에 없음)
      brand_id: item.brand_id,
      category: item.category,
      reason: item.reason,
      created_at: null, // 정적 항목은 생성일 없음
      is_static: true,
    }));

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      is_static_source: true,
    });
  } catch (error: any) {
    console.error("[admin/brands/static] 오류:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
