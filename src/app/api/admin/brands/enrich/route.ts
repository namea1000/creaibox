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

/**
 * POST /api/admin/brands/enrich
 *
 * 초창기 사유가 단순하거나 `[` 대괄호 기관명이 빠진 예전 예약어들을
 * Gemini 3.1 Flash Lite / Vertex AI로 자동 분석하여
 * `[구체적 기관/상표명] 상세 차단 사유` 규격으로 DB 사유(reason) 컬럼 일괄 보강 API
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    // 1. `[` 대괄호가 없는 기존 데이터 최대 100개 조회
    const { data: targets, error: fetchErr } = await adminSupabase
      .from("reserved_brand_ids")
      .select("id, brand_id, category, reason")
      .not("reason", "ilike", "[%]")
      .limit(80);

    if (fetchErr) throw fetchErr;

    if (!targets || targets.length === 0) {
      return NextResponse.json({
        success: true,
        updatedCount: 0,
        message: "✅ 모든 예약어에 Target Entity 기관명 서식이 이미 완성되어 있습니다!",
      });
    }

    // 2. Gemini AI 에 배치 요청
    const promptList = targets.map(t => ({
      id: t.id,
      brand_id: t.brand_id,
      category: t.category ?? "TRADEMARK",
    }));

    const prompt = `Analyze these ${promptList.length} Korean subdomain reserved brand IDs and identify their exact target organization, company, trademark, or entity name in Korean.
Input JSON list:
${JSON.stringify(promptList)}

Output ONLY a valid JSON array of objects:
[
  {
    "id": 123,
    "brand_id": "bluehouse",
    "entity_name": "대한민국 청와대 (대통령실)",
    "reason": "[대한민국 청와대] 국가/대통령실 사칭 방지"
  }
]
Rules: 'reason' MUST start with '[Entity Name in Korean]' followed by a clear 1-sentence explanation. Respond ONLY with valid JSON.`;

    const rawResult = await generateBrandAiJson(prompt);
    let parsed: Array<{ id: number; brand_id: string; entity_name: string; reason: string }> = [];

    try {
      const json = JSON.parse(rawResult);
      if (Array.isArray(json)) parsed = json;
      else if (Array.isArray(json.items)) parsed = json.items;
      else {
        const firstArr = Object.values(json).find(v => Array.isArray(v));
        if (firstArr) parsed = firstArr as typeof parsed;
      }
    } catch (parseErr) {
      console.error("[enrich] AI response JSON parse error:", parseErr);
      return NextResponse.json({ error: "AI 응답 파싱 중 오류가 발생했습니다." }, { status: 500 });
    }

    // 3. DB 일괄 갱신 (Update)
    let updatedCount = 0;
    for (const item of parsed) {
      if (item.id && item.reason && item.reason.startsWith("[")) {
        const { error: updateErr } = await adminSupabase
          .from("reserved_brand_ids")
          .update({ reason: item.reason })
          .eq("id", item.id);

        if (!updateErr) updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      totalTargets: targets.length,
      message: `🎉 ${updatedCount}개의 초창기 예약어 사유가 Gemini/Vertex AI를 통해 Target Entity [기관/상표명] 서식으로 자동 보강되었습니다!`,
    });
  } catch (error: any) {
    console.error("POST /api/admin/brands/enrich error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
