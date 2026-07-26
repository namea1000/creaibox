import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { KeywordToolResult } from "@/lib/server/keyword-tool-engine";

export interface KeywordToolReportItem {
  id: string;
  keyword: string;
  provider: "naver" | "google";
  totalMonthlyVolume: number;
  ratingGrade: string;
  ratingStatus: string;
  createdAt: string;
  resultJson: KeywordToolResult;
}

// In-Memory Fallback Cache for Reports
const memoryReports: KeywordToolReportItem[] = [];

export async function archiveKeywordToolReport(result: KeywordToolResult) {
  if (!result || !result.keyword) return;

  const now = new Date().toISOString();
  const newItem: KeywordToolReportItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    keyword: result.keyword,
    provider: result.provider,
    totalMonthlyVolume: result.totalMonthlyVolume,
    ratingGrade: result.ratingGrade,
    ratingStatus: result.ratingStatus,
    createdAt: now,
    resultJson: result,
  };

  // 1. 메모리 캐시 맨 앞에 삽입 (중복 키워드 시 최신 데이터로 업데이트)
  const existingIdx = memoryReports.findIndex(
    (x) => x.keyword.toLowerCase() === result.keyword.toLowerCase() && x.provider === result.provider
  );
  if (existingIdx !== -1) {
    memoryReports.splice(existingIdx, 1);
  }
  memoryReports.unshift(newItem);

  // 2. Supabase DB 저장 시도
  try {
    const { error } = await supabaseAdmin.from("keyword_tool_reports").upsert(
      {
        keyword: result.keyword,
        provider: result.provider,
        total_search_volume: result.totalMonthlyVolume,
        rating_grade: result.ratingGrade,
        rating_status: result.ratingStatus,
        result_json: result,
        created_at: now,
      },
      { onConflict: "keyword,provider" }
    );
    if (error) {
      console.warn("Notice: keyword_tool_reports upsert message:", error.message);
    }
  } catch (err) {
    console.error("archiveKeywordToolReport error:", err);
  }
}

export async function getKeywordToolReports(page: number = 1, limit: number = 10, search?: string) {
  let list: KeywordToolReportItem[] = [...memoryReports];

  // 1. DB에서 조회 시도
  try {
    const { data, error } = await supabaseAdmin
      .from("keyword_tool_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const dbItems: KeywordToolReportItem[] = data.map((row: any) => ({
        id: row.id || `${row.created_at}_${row.keyword}`,
        keyword: row.keyword,
        provider: row.provider || "naver",
        totalMonthlyVolume: row.total_search_volume || 10000,
        ratingGrade: row.rating_grade || "A",
        ratingStatus: row.rating_status || "쾌적",
        createdAt: row.created_at,
        resultJson: row.result_json,
      }));

      // Merge DB items with memory items
      const mergedMap = new Map<string, KeywordToolReportItem>();
      [...dbItems, ...memoryReports].forEach((item) => {
        const key = `${item.keyword.toLowerCase()}_${item.provider}`;
        if (!mergedMap.has(key)) {
          mergedMap.set(key, item);
        }
      });
      list = Array.from(mergedMap.values());
    }
  } catch (err) {
    console.error("getKeywordToolReports DB error:", err);
  }

  // Filter if search keyword provided
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((item) => item.keyword.toLowerCase().includes(q));
  }

  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (safePage - 1) * limit;
  const paginatedItems = list.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    total,
    page: safePage,
    totalPages,
    limit,
  };
}
