import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { checkStaticReservedBrand } from "@/lib/constants/reservedBrandsStatic";

export const runtime = "nodejs";

/**
 * GET /api/brands/check?brand_id=xxx
 *
 * 브랜드 ID 사용 가능 여부 확인 (하이브리드 방식)
 *
 * 1단계: 정적 상수 Set 확인 (SYSTEM, ABUSE, ADULT_GAMBLING, GEOGRAPHY 등 13,396개)
 *        → DB 조회 없이 수 μs 내 차단 판정
 * 2단계: 정적에 없으면 DB reserved_brand_ids 조회 (나머지 ~59,000개)
 * 3단계: 실제 사용 중인 brand_id 중복 체크 (profiles 테이블)
 *
 * Egress 절감: 기존 DB 72K rows → 정적 hit 시 DB 조회 0회
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brandId = (searchParams.get("brand_id") || "").trim().toLowerCase();

  if (!brandId || !/^[a-z0-9]{2,15}$/.test(brandId)) {
    return NextResponse.json({
      available: false,
      blocked: true,
      category: null,
      message: "❌ 브랜드 ID 형식이 올바르지 않습니다. (영문 소문자·숫자 2~15자)",
    });
  }

  // ─── 1단계: 정적 상수 확인 (DB 조회 없음) ──────────────────────────────
  const staticResult = checkStaticReservedBrand(brandId);
  if (staticResult.blocked) {
    return NextResponse.json({
      available: false,
      blocked: true,
      category: staticResult.category,
      message: staticResult.message,
      source: "static", // 디버깅용
    });
  }

  // ─── 2단계: DB reserved_brand_ids 조회 (동적 카테고리만 남아있음) ────────
  const supabase = await createClient();

  const { data: reservedData, error: reservedError } = await supabase
    .from("reserved_brand_ids")
    .select("id, category")
    .eq("brand_id", brandId)
    .maybeSingle();

  if (reservedError) {
    console.error("[brands/check] reserved_brand_ids 조회 오류:", reservedError);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }

  if (reservedData) {
    const categoryMessages: Record<string, string> = {
      GOVERNMENT: "❌ 정부 기관, 공공기관 및 지자체 사칭 방지를 위해 사용할 수 없습니다.",
      MEDIA: "❌ 뉴스 및 언론 매체 사칭 예방을 위해 사용할 수 없는 브랜드 ID입니다.",
      FINANCE: "❌ 금융기관 사칭 및 피싱 사기 예방을 위해 사용할 수 없는 브랜드 ID입니다.",
      COMPANY: "❌ 해당 기업체 상표권 보호를 위해 사용할 수 없는 브랜드 ID입니다.",
      IT_SERVICE: "❌ 주요 글로벌 IT 서비스 및 플랫폼 명칭 보호를 위해 사용할 수 없습니다.",
      INFLUENCER: "❌ 유명 크리에이터/인플루언서 사칭 방지를 위해 사용할 수 없습니다.",
      EDUCATION: "❌ 대학 및 교육기관 사칭 예방을 위해 사용할 수 없는 브랜드 ID입니다.",
      COMMON_SERVICE: "❌ 공용 서비스 및 상업적 일반 명사 선점 방지를 위해 사용할 수 없습니다.",
      TRADEMARK: "❌ 상표권 또는 제품명 보호를 위해 사용할 수 없는 브랜드 ID입니다.",
      PAYMENT_SECURITY: "❌ 결제, 보안 및 금융인증 피싱 방지를 위해 사용할 수 없습니다.",
      CRYPTO: "❌ 가상자산 및 암호화폐 거래소 사칭 예방을 위해 사용할 수 없습니다.",
      HEALTHCARE: "❌ 의료기관 및 의약품 브랜드 사칭 방지를 위해 사용할 수 없습니다.",
      INFRASTRUCTURE: "❌ 시스템 인프라 예약어로 사용할 수 없는 브랜드 ID입니다.",
      DOMAIN_BRAND: "❌ 도메인/인증서 사업자 사칭 방지를 위해 사용할 수 없습니다.",
      PUBLIC_SERVICE: "❌ 공공 행정 서비스 사칭 방지를 위해 사용할 수 없습니다.",
      HIGH_RISK_COMMERCE: "❌ 고위험 상거래(상품권/리셀/명품/투자) 사기 방지를 위해 사용할 수 없습니다.",
      RELIGION_POLITICS: "❌ 종교/정당/선거 사칭 방지를 위해 사용할 수 없습니다.",
      MILITARY_SECURITY: "❌ 군사/안보기관 사칭 방지를 위해 사용할 수 없습니다.",
    };

    return NextResponse.json({
      available: false,
      blocked: true,
      category: reservedData.category,
      message:
        categoryMessages[reservedData.category] ??
        "❌ 시스템 예약어 또는 사용이 금지된 브랜드 ID입니다.",
      source: "db",
    });
  }

  // ─── 3단계: 실제 사용 중인 브랜드 중복 확인 ─────────────────────────────
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("brand_id", brandId)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.json({
      available: false,
      blocked: false,
      category: null,
      message: "❌ 이미 사용 중인 브랜드 ID입니다.",
    });
  }

  return NextResponse.json({
    available: true,
    blocked: false,
    category: null,
    message: "✅ 사용 가능한 브랜드 ID입니다.",
  });
}
