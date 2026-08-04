import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { generateBrandAiJson } from "@/lib/ai/brandScannerAi";
import { checkStaticReservedBrand, STATIC_BRAND_CATEGORIES } from "@/lib/constants/reservedBrandsStatic";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

const STATIC_CAT_SET = new Set<string>(STATIC_BRAND_CATEGORIES);

// 카테고리별 스캔 프롬프트 설정 (16개 전체 동적 카테고리)
const SCAN_CONFIGS: Record<string, { label: string; prompt: string }> = {
  IT_SERVICE: {
    label: "🤖 AI 서비스 / IT 플랫폼 (KIMI, Grok, Cursor, Perplexity 등)",
    prompt: `You are a brand protection specialist for a Korean web platform.
List 100 recently launched or trending AI tools, SaaS platforms, and tech services (especially 2023-2026)
that should be blocked as subdomain brand IDs to prevent impersonation.
Include: AI assistants, LLM services, coding tools, productivity apps, cloud services.
Examples: kimi, grok, perplexity, mistral, claude, notion, figma, vercel, cursor, bolt, v0, lovable, devv

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"IT_SERVICE"}]

Rules:
- brand_id MUST match ^[a-z0-9]{2,15}$ exactly (lowercase letters and numbers only, 2-15 chars)
- reason must be in Korean`,
  },
  FINANCE: {
    label: "💳 핀테크 / 금융 서비스 (토스, 핀다, 주식, 암호화폐 결제)",
    prompt: `List 100 fintech companies, neobanks, payment gateways, stock trading apps, and financial platforms (2022-2026)
that should be blocked as subdomain brand IDs to prevent phishing/impersonation.
Include: Korean & global fintech, payment gateways, neobanks, brokers.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"FINANCE"}]`,
  },
  TRADEMARK: {
    label: "🏷️ 제품 / 상표명 보호 (글로벌 핫 브랜드 및 신제품)",
    prompt: `List 100 new consumer tech brands, product names, and popular consumer brands (2022-2026)
that should be blocked as subdomain brand IDs to prevent brand impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"TRADEMARK"}]`,
  },
  INFLUENCER: {
    label: "🎬 크리에이터 / 인플루언서 / 버튜버 / K-pop",
    prompt: `List 100 famous YouTube creators, streamers, K-pop idol groups/artists, and influencers
whose names/brands should be blocked to prevent impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"INFLUENCER"}]`,
  },
  COMPANY: {
    label: "🏢 기업 / 신규 스타트업 / 테크 유니콘",
    prompt: `List 100 notable startups, tech unicorns, and famous global/Korean companies (2022-2026)
that should be blocked to prevent corporate impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"COMPANY"}]`,
  },
  CRYPTO: {
    label: "🪙 가상자산 / 거래소 / 블록체인 프로토콜",
    prompt: `List 100 crypto exchanges, token projects, DeFi protocols, and Web3 platforms (2022-2026)
that should be blocked as subdomain brand IDs to prevent crypto scams.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"CRYPTO"}]`,
  },
  HEALTHCARE: {
    label: "🏥 의료 / 헬스케어 / 의약품 / 웰니스",
    prompt: `List 100 major healthcare platforms, telehealth apps, pharma brands, and wellness services (2022-2026)
that should be blocked to prevent medical/health impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"HEALTHCARE"}]`,
  },
  COMMON_SERVICE: {
    label: "💡 프리미엄 일반 명사 / 서비스 키워드",
    prompt: `List 100 high-value general service keywords, business terms, and popular Korean/English words
that should be reserved by system rather than claimed by users (e.g. shop, store, blog, news, deals, VIP).

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"COMMON_SERVICE"}]`,
  },
  GOVERNMENT: {
    label: "🏛️ 공공기관 / 지자체 / 정부행정",
    prompt: `List 100 government agencies, public services, and municipal brand terms (Korean and English)
that should be blocked to prevent public sector impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"GOVERNMENT"}]`,
  },
  MEDIA: {
    label: "📰 언론사 / 방송사 / 미디어 매체",
    prompt: `List 100 major news outlets, broadcasting networks, digital media brands, and magazines
that should be blocked to prevent news/media impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"MEDIA"}]`,
  },
  EDUCATION: {
    label: "🎓 대학 / 교육기관 / 에듀테크",
    prompt: `List 100 famous universities, online education platforms, edtech startups, and academic brands
that should be blocked to prevent educational impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"EDUCATION"}]`,
  },
  PAYMENT_SECURITY: {
    label: "🔒 결제 / 인증 / 보안 피싱 방지",
    prompt: `List 100 terms related to authentication, security, password reset, payment verification, and 2FA
that scammers might abuse in subdomains for phishing attacks.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"PAYMENT_SECURITY"}]`,
  },
  INFRASTRUCTURE: {
    label: "⚙️ 시스템 인프라 / 호스팅 / 서버 키워드",
    prompt: `List 100 technical infrastructure terms (DNS, CDN, SSL, proxy, gateway, metrics, telemetry, staging)
that could conflict with web infrastructure.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"INFRASTRUCTURE"}]`,
  },
  DOMAIN_BRAND: {
    label: "🌐 도메인 / 호스팅 / 인증서 사업자",
    prompt: `List 100 domain registrars, hosting providers, cloud DNS services, and SSL cert authorities
that should be blocked to prevent infrastructure provider impersonation.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"DOMAIN_BRAND"}]`,
  },
  PUBLIC_SERVICE: {
    label: "🛂 공공 행정 / 비자 / 민원 서비스",
    prompt: `List 100 public administration terms, passport/visa services, civil complaint keywords, and social welfare terms
that should be blocked to prevent administrative phishing.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"PUBLIC_SERVICE"}]`,
  },
  HIGH_RISK_COMMERCE: {
    label: "🛍️ 고위험 상거래 / 리셀 / 상품권 / 명품",
    prompt: `List 100 high-risk commerce keywords (giftcards, luxury resale, ticket trading, investment offers)
that are frequently abused for commercial fraud.

Output ONLY a valid JSON array. Format:
[{"brand_id":"lowercase2to15chars","reason":"한국어로 차단 이유","category":"HIGH_RISK_COMMERCE"}]`,
  },
};

/**
 * POST /api/admin/brands/scan
 * Body: { category: "IT_SERVICE" | "FINANCE" | ... }
 *
 * Groq LLaMA 3.3 70B를 사용해 해당 카테고리의 신규 예약어 후보를 생성.
 * - 정적 상수 Set과 교차 확인
 * - DB reserved_brand_ids와 교차 확인
 * - 두 곳 다 없는 NEW 항목만 반환
 */
export async function POST(req: NextRequest) {
  try {
    // 관리자 권한 확인
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

    const body = await req.json();
    const { category } = body as { category: string };

    const config = SCAN_CONFIGS[category];
    if (!config) {
      return NextResponse.json(
        { error: `지원되지 않는 카테고리입니다: ${category}` },
        { status: 400 }
      );
    }

    // ─── Gemini 1.5 Flash / Groq AI 호출 ───────────────────────────────────
    const rawContent = await generateBrandAiJson(config.prompt);

    // JSON 파싱
    let candidates: Array<{ brand_id: string; reason: string; category: string }> = [];
    try {
      const parsed = JSON.parse(rawContent);
      // 배열이거나 { items: [...] } 또는 { brands: [...] } 형태 처리
      if (Array.isArray(parsed)) {
        candidates = parsed;
      } else if (Array.isArray(parsed.items)) {
        candidates = parsed.items;
      } else if (Array.isArray(parsed.brands)) {
        candidates = parsed.brands;
      } else {
        // 첫 번째 배열 값 찾기
        const firstArray = Object.values(parsed).find(v => Array.isArray(v));
        if (firstArray) candidates = firstArray as typeof candidates;
      }
    } catch {
      return NextResponse.json({ error: "AI 응답 파싱 실패. 다시 시도해주세요." }, { status: 500 });
    }

    // ─── 형식 검증 및 자체 중복 제거 필터 ───────────────────────────────────
    const BRAND_ID_REGEX = /^[a-z0-9]{2,15}$/;
    const seenLocal = new Set<string>();

    const valid = candidates.filter((item) => {
      if (!item.brand_id) return false;
      const cleanId = item.brand_id.toLowerCase().trim();
      if (!BRAND_ID_REGEX.test(cleanId)) return false;
      if (!item.reason) return false;
      if (seenLocal.has(cleanId)) return false; // 자체 중복 제거
      seenLocal.add(cleanId);

      // 정적 상수에 이미 있는 것 제외
      if (checkStaticReservedBrand(cleanId).blocked) return false;
      return true;
    });

    if (valid.length === 0) {
      return NextResponse.json({ suggestions: [], total: 0, already_blocked: 0, static_filtered: candidates.length });
    }

    // ─── DB 교차 확인 (이미 등록된 것 제외) ──────────────────────────────────
    const brandIds = valid.map(v => v.brand_id);

    const { data: existing } = await adminSupabase
      .from("reserved_brand_ids")
      .select("brand_id")
      .in("brand_id", brandIds);

    const existingSet = new Set((existing ?? []).map((e: { brand_id: string }) => e.brand_id));

    const newOnes = valid
      .filter(item => !existingSet.has(item.brand_id))
      .map(item => ({
        ...item,
        category, // DB check constraint를 100% 통과하도록 선택된 카테고리로 강제 지정
      }));
    const alreadyBlocked = valid.length - newOnes.length;

    return NextResponse.json({
      suggestions: newOnes,
      total: newOnes.length,
      already_blocked: alreadyBlocked,
      static_filtered: candidates.length - valid.length,
      category,
      category_label: config.label,
    });
  } catch (error: any) {
    console.error("[admin/brands/scan] 오류:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/admin/brands/scan
 * 스캔 가능한 카테고리 목록 반환
 */
export async function GET() {
  return NextResponse.json({
    categories: Object.entries(SCAN_CONFIGS).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  });
}
