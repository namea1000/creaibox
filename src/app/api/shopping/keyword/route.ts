import { NextRequest, NextResponse } from "next/server";
import { getShoppingKeywordAnalysis } from "@/lib/server/shopping-keyword-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  const result = getShoppingKeywordAnalysis(query);
  return NextResponse.json(result);
}
