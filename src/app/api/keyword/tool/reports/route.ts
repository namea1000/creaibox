import { NextRequest, NextResponse } from "next/server";
import { getKeywordToolReports } from "@/lib/server/keyword-tool-history";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const data = await getKeywordToolReports(page, limit, search);
  return NextResponse.json(data);
}
