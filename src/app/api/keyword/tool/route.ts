import { NextRequest, NextResponse } from "next/server";
import { analyzeKeywordTool } from "@/lib/server/keyword-tool-engine";
import { archiveKeywordToolReport } from "@/lib/server/keyword-tool-history";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") || "나이키";
  const provider = (searchParams.get("provider") as "naver" | "google") || "naver";

  const result = await analyzeKeywordTool(keyword, provider);
  await archiveKeywordToolReport(result);
  return NextResponse.json(result);
}
