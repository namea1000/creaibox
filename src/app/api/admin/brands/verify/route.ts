import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { generateBrandAiJson } from "@/lib/ai/brandScannerAi";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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
        return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
      }
    }

    const { brand_id } = await req.json();
    const cleanBrand = (brand_id || "").trim().toLowerCase();

    if (!cleanBrand) {
      return NextResponse.json({ error: "brand_id가 필요합니다." }, { status: 400 });
    }

    // ─── Gemini 1.5 Flash / Groq AI 정밀 검증 ──────────────────────────────
    const prompt = `You are a trademark, legal compliance, and brand security auditor for a Korean web platform (creaibox.com).
The user wants to claim the subdomain brand ID: "${cleanBrand}".

Analyze whether "${cleanBrand}" has trademark risks, impersonation issues, or security threats.
Check against:
1. Famous global & Korean companies/trademarks (e.g. samsung, apple, kakao, toss, naver, hyundai, lg, kimi, grok, etc.)
2. Korean government agencies, municipalities, public organizations, schools, media outlets
3. High-risk terms (phishing, financial fraud, gambling, adult content, illegal resale, scam keywords)
4. Famous influencers, celebrities, K-pop groups, sports stars

Return ONLY a single valid JSON object (no markdown formatting, no extra text):
{
  "brand_id": "${cleanBrand}",
  "safety_level": "SAFE" | "WARNING" | "DANGER",
  "risk_score": 0 to 100,
  "entity_match": "매칭된 대표 상표/기관/인물명 또는 '없음'",
  "analysis_report": "한국어로 작성된 상세 심사 의견 및 위험요소 설명 (2~3문장)",
  "category_recommendation": "TRADEMARK | GOVERNMENT | IT_SERVICE | FINANCE | ABUSE | COMMON_SERVICE | NONE 중 1개",
  "recommendation": "APPROVE" | "REJECT_AND_BLOCK"
}`;

    const rawContent = await generateBrandAiJson(prompt);
    let auditResult: any = {};

    try {
      auditResult = JSON.parse(rawContent);
    } catch {
      auditResult = {
        brand_id: cleanBrand,
        safety_level: "WARNING",
        risk_score: 50,
        entity_match: "분석 미확정",
        analysis_report: "AI 응답 형식 파싱 중 오류가 발생했습니다. 직접 확인이 필요합니다.",
        category_recommendation: "TRADEMARK",
        recommendation: "REJECT_AND_BLOCK",
      };
    }

    const encodedBrand = encodeURIComponent(cleanBrand);

    return NextResponse.json({
      success: true,
      result: {
        brand_id: cleanBrand,
        safety_level: auditResult.safety_level ?? "SAFE",
        risk_score: auditResult.risk_score ?? 0,
        entity_match: auditResult.entity_match ?? "없음",
        analysis_report: auditResult.analysis_report ?? "특이사항이 발견되지 않은 아이디입니다.",
        category_recommendation: auditResult.category_recommendation ?? "TRADEMARK",
        recommendation: auditResult.recommendation ?? "APPROVE",
        google_search_url: `https://www.google.com/search?q=${encodedBrand}`,
        naver_search_url: `https://search.naver.com/search.naver?query=${encodedBrand}`,
      },
    });
  } catch (error: any) {
    console.error("POST /api/admin/brands/verify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
