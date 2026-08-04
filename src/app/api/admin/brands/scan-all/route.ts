import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { generateBrandAiJson } from "@/lib/ai/brandScannerAi";
import { checkStaticReservedBrand } from "@/lib/constants/reservedBrandsStatic";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

// 16개 동적 카테고리 키 목록
const ALL_DYNAMIC_CATEGORIES = [
  "IT_SERVICE",
  "FINANCE",
  "TRADEMARK",
  "INFLUENCER",
  "COMPANY",
  "CRYPTO",
  "HEALTHCARE",
  "COMMON_SERVICE",
  "GOVERNMENT",
  "MEDIA",
  "EDUCATION",
  "PAYMENT_SECURITY",
  "INFRASTRUCTURE",
  "DOMAIN_BRAND",
  "PUBLIC_SERVICE",
  "HIGH_RISK_COMMERCE",
];

/**
 * POST /api/admin/brands/scan-all
 *
 * 관리자가 버튼 한 번 클릭 시:
 * 16개 전체 동적 카테고리를 순차적으로 AI 스캔 후
 * 미등록 신규 브랜드 예약어를 DB에 자동 upsert 일괄 등록하는 무인 자동 스캔 API
 */
export async function POST(req: NextRequest) {
  try {
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

    const BRAND_ID_REGEX = /^[a-z0-9]{2,15}$/;

    let totalNewlyAdded = 0;
    const categoryReports: Array<{ category: string; count: number }> = [];

    // 16개 카테고리 순차 스캔 및 DB 자동 등록
    for (const category of ALL_DYNAMIC_CATEGORIES) {
      try {
        const prompt = `List 100 recently launched, popular, or high-risk subdomain terms for category '${category}' (2023-2026).
Output ONLY a valid JSON array of objects:
[{"brand_id":"lowercase2to15chars","reason":"[한글기관/상표명] 차단사유","category":"${category}"}]
Rules: brand_id MUST match ^[a-z0-9]{2,15}$ exactly. Reason MUST start with Korean Entity Name in brackets like '[한국전력공사] 사칭 방지'.`;

        const rawContent = await generateBrandAiJson(prompt);
        let candidates: Array<{ brand_id: string; reason: string; category: string }> = [];

        try {
          const parsed = JSON.parse(rawContent);
          if (Array.isArray(parsed)) candidates = parsed;
          else if (Array.isArray(parsed.items)) candidates = parsed.items;
          else if (Array.isArray(parsed.brands)) candidates = parsed.brands;
          else {
            const firstArray = Object.values(parsed).find(v => Array.isArray(v));
            if (firstArray) candidates = firstArray as typeof candidates;
          }
        } catch {
          continue;
        }

        // 자체 중복 제거 & 검증
        const seenLocal = new Set<string>();
        const valid = candidates.filter((item) => {
          if (!item.brand_id) return false;
          const cleanId = item.brand_id.toLowerCase().trim();
          if (!BRAND_ID_REGEX.test(cleanId)) return false;
          if (!item.reason) return false;
          if (seenLocal.has(cleanId)) return false;
          seenLocal.add(cleanId);

          if (checkStaticReservedBrand(cleanId).blocked) return false;
          return true;
        });

        if (valid.length === 0) {
          categoryReports.push({ category, count: 0 });
          continue;
        }

        // DB 기존 등록 여부 확인
        const brandIds = valid.map(v => v.brand_id.toLowerCase().trim());
        const { data: existing } = await adminSupabase
          .from("reserved_brand_ids")
          .select("brand_id")
          .in("brand_id", brandIds);

        const existingSet = new Set((existing ?? []).map((e: { brand_id: string }) => e.brand_id));

        const payload = valid
          .filter(item => !existingSet.has(item.brand_id.toLowerCase().trim()))
          .map(item => ({
            brand_id: item.brand_id.toLowerCase().trim(),
            category,
            reason: item.reason,
          }));

        if (payload.length > 0) {
          const { error: upsertErr } = await adminSupabase
            .from("reserved_brand_ids")
            .upsert(payload, { onConflict: "brand_id", ignoreDuplicates: true });

          if (!upsertErr) {
            totalNewlyAdded += payload.length;
            categoryReports.push({ category, count: payload.length });
          } else {
            categoryReports.push({ category, count: 0 });
          }
        } else {
          categoryReports.push({ category, count: 0 });
        }
      } catch (catErr) {
        console.error(`[scan-all] ${category} 스캔 오류:`, catErr);
        categoryReports.push({ category, count: 0 });
      }
    }

    return NextResponse.json({
      success: true,
      total_added: totalNewlyAdded,
      reports: categoryReports,
      message: `🎉 16개 전체 카테고리 자율 스캔 완료! 총 ${totalNewlyAdded}개의 신규 예약어가 DB에 자동 추가되었습니다.`,
    });
  } catch (error: any) {
    console.error("POST /api/admin/brands/scan-all error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
