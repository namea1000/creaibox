import { NextRequest, NextResponse } from "next/server";
import { analyzeKeywordTool } from "@/lib/server/keyword-tool-engine";
import { archiveDualKeywordReport } from "@/lib/server/keyword-tool-history";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "";
  const provider = (searchParams.get("provider") as "naver" | "google") || "naver";

  if (!keyword.trim()) {
    return NextResponse.json({ error: "Keyword required" }, { status: 400 });
  }

  // ⚡ 네이버와 구글을 동시에 병렬(Promise.all) 정밀 분석
  const [naverResult, googleResult] = await Promise.all([
    analyzeKeywordTool(keyword, "naver"),
    analyzeKeywordTool(keyword, "google"),
  ]);

  // 💾 네이버와 구글 결과를 DB에 '단 1개의 통합 Row(onConflict: keyword)'로 영구 저장
  await archiveDualKeywordReport(naverResult, googleResult);

  const activeResult = provider === "google" ? googleResult : naverResult;

  return NextResponse.json({
    ...activeResult,
    naver: naverResult,
    google: googleResult,
  });
}
