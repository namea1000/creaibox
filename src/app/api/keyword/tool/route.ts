import { NextRequest, NextResponse } from "next/server";
import { analyzeKeywordTool } from "@/lib/server/keyword-tool-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "나이키";
  const provider = (searchParams.get("provider") as "naver" | "google") || "naver";

  const result = analyzeKeywordTool(keyword, provider);
  return NextResponse.json(result);
}
