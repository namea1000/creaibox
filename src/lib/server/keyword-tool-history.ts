import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { KeywordToolResult } from "@/lib/server/keyword-tool-engine";

export interface KeywordToolReportItem {
  id: string;
  keyword: string;
  provider: "naver" | "google";
  providers: Array<"naver" | "google">;
  totalMonthlyVolume: number;
  ratingGrade: string;
  ratingStatus: string;
  createdAt: string;
  resultJson: KeywordToolResult;
  naverResultJson?: KeywordToolResult;
  googleResultJson?: KeywordToolResult;
  historyJson?: any[];
}

// In-Memory Fallback Cache for Reports
const memoryReports: KeywordToolReportItem[] = [];

export async function archiveDualKeywordReport(naverRes: KeywordToolResult, googleRes: KeywordToolResult) {
  if (!naverRes && !googleRes) return;
  const kw = naverRes?.keyword || googleRes?.keyword;
  if (!kw) return;

  const now = new Date().toISOString();
  const kwLower = kw.trim().toLowerCase();

  // 1. 기존 DB row에서 history_json 읽어와 날짜별 이력 누적 배열 생성
  let existingHistory: any[] = [];
  try {
    const { data: existingRow } = await supabaseAdmin
      .from("keyword_tool_reports")
      .select("history_json")
      .eq("keyword", kw)
      .maybeSingle();

    if (existingRow && Array.isArray(existingRow.history_json)) {
      existingHistory = existingRow.history_json;
    }
  } catch (e) {
    // history fetch fallback
  }

  const newSnapshot = {
    date: now,
    dateStr: new Date(now).toLocaleDateString("ko-KR"),
    naver: naverRes,
    google: googleRes,
  };

  const updatedHistory = [newSnapshot, ...existingHistory];

  const combinedItem: KeywordToolReportItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    keyword: kw,
    provider: "naver",
    providers: ["naver", "google"],
    totalMonthlyVolume: naverRes?.totalMonthlyVolume || googleRes?.totalMonthlyVolume || 0,
    ratingGrade: naverRes?.ratingGrade || googleRes?.ratingGrade || "A",
    ratingStatus: naverRes?.ratingStatus || googleRes?.ratingStatus || "쾌적",
    createdAt: now,
    resultJson: naverRes || googleRes,
    naverResultJson: naverRes,
    googleResultJson: googleRes,
    historyJson: updatedHistory,
  };

  const existingIdx = memoryReports.findIndex((x) => x.keyword.toLowerCase() === kwLower);
  if (existingIdx !== -1) {
    memoryReports.splice(existingIdx, 1);
  }
  memoryReports.unshift(combinedItem);

  // 2. Supabase DB 저장 시도 (Option C: 1 키워드 = 1 Row 내 history_json 날짜별 이력 누적 영구 저장)
  try {
    const { error } = await supabaseAdmin.from("keyword_tool_reports").upsert(
      {
        keyword: kw,
        total_search_volume: combinedItem.totalMonthlyVolume,
        rating_grade: combinedItem.ratingGrade,
        rating_status: combinedItem.ratingStatus,
        naver_json: naverRes,
        google_json: googleRes,
        result_json: { naver: naverRes, google: googleRes },
        history_json: updatedHistory,
        updated_at: now,
      },
      { onConflict: "keyword" }
    );
    if (error) {
      console.warn("Notice: keyword_tool_reports upsert message:", error.message);
    }
  } catch (err) {
    console.error("archiveDualKeywordReport error:", err);
  }
}

export async function archiveKeywordToolReport(result: KeywordToolResult) {
  if (!result || !result.keyword) return;

  const now = new Date().toISOString();
  const kwLower = result.keyword.trim().toLowerCase();

  const existingIdx = memoryReports.findIndex((x) => x.keyword.toLowerCase() === kwLower);
  let existingItem: KeywordToolReportItem | undefined = existingIdx !== -1 ? memoryReports[existingIdx] : undefined;

  const providersSet = new Set<"naver" | "google">(existingItem?.providers || [result.provider]);
  providersSet.add(result.provider);

  const newItem: KeywordToolReportItem = {
    id: existingItem?.id || `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    keyword: result.keyword,
    provider: result.provider,
    providers: Array.from(providersSet),
    totalMonthlyVolume: result.totalMonthlyVolume,
    ratingGrade: result.ratingGrade,
    ratingStatus: result.ratingStatus,
    createdAt: now,
    resultJson: result,
    naverResultJson: result.provider === "naver" ? result : existingItem?.naverResultJson,
    googleResultJson: result.provider === "google" ? result : existingItem?.googleResultJson,
  };

  if (existingIdx !== -1) {
    memoryReports.splice(existingIdx, 1);
  }
  memoryReports.unshift(newItem);

  try {
    const { error } = await supabaseAdmin.from("keyword_tool_reports").upsert(
      {
        keyword: result.keyword,
        total_search_volume: result.totalMonthlyVolume,
        rating_grade: result.ratingGrade,
        rating_status: result.ratingStatus,
        naver_json: result.provider === "naver" ? result : undefined,
        google_json: result.provider === "google" ? result : undefined,
        result_json: result,
        updated_at: now,
      },
      { onConflict: "keyword" }
    );
    if (error) {
      console.warn("Notice: keyword_tool_reports upsert message:", error.message);
    }
  } catch (err) {
    console.error("archiveKeywordToolReport error:", err);
  }
}

export async function getKeywordToolReports(page: number = 1, limit: number = 10, search?: string) {
  let rawItems: KeywordToolReportItem[] = [...memoryReports];

  try {
    const { data, error } = await supabaseAdmin
      .from("keyword_tool_reports")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const dbItems: KeywordToolReportItem[] = data.map((row: any) => {
        const hasNaver = !!row.naver_json;
        const hasGoogle = !!row.google_json;
        const pList: Array<"naver" | "google"> = [];
        if (hasNaver) pList.push("naver");
        if (hasGoogle) pList.push("google");
        if (pList.length === 0) pList.push(row.provider || "naver");

        const resJson = row.naver_json || row.google_json || row.result_json?.naver || row.result_json?.google || row.result_json;

        return {
          id: row.id || `${row.created_at}_${row.keyword}`,
          keyword: row.keyword,
          provider: pList[0],
          providers: pList,
          totalMonthlyVolume: row.total_search_volume || 0,
          ratingGrade: row.rating_grade || "A",
          ratingStatus: row.rating_status || "쾌적",
          createdAt: row.updated_at || row.created_at,
          resultJson: resJson,
          naverResultJson: row.naver_json || row.result_json?.naver,
          googleResultJson: row.google_json || row.result_json?.google,
          historyJson: row.history_json || [],
        };
      });

      rawItems = [...dbItems, ...memoryReports];
    }
  } catch (err) {
    console.error("getKeywordToolReports DB error:", err);
  }

  // 키워드명 기준 1개 Row 단일 통합 병합
  const groupedMap = new Map<string, KeywordToolReportItem>();

  rawItems.forEach((item) => {
    const key = item.keyword.trim().toLowerCase();
    const existing = groupedMap.get(key);

    if (!existing) {
      groupedMap.set(key, {
        ...item,
        providers: item.providers || [item.provider],
      });
    } else {
      const pSet = new Set<"naver" | "google">([...existing.providers, ...(item.providers || [item.provider])]);
      const isNewer = new Date(item.createdAt).getTime() > new Date(existing.createdAt).getTime();

      groupedMap.set(key, {
        id: isNewer ? item.id : existing.id,
        keyword: existing.keyword,
        provider: isNewer ? item.provider : existing.provider,
        providers: Array.from(pSet),
        totalMonthlyVolume: isNewer ? item.totalMonthlyVolume : existing.totalMonthlyVolume,
        ratingGrade: isNewer ? item.ratingGrade : existing.ratingGrade,
        ratingStatus: isNewer ? item.ratingStatus : existing.ratingStatus,
        createdAt: isNewer ? item.createdAt : existing.createdAt,
        resultJson: isNewer ? item.resultJson : existing.resultJson,
        naverResultJson: item.naverResultJson || existing.naverResultJson,
        googleResultJson: item.googleResultJson || existing.googleResultJson,
        historyJson: item.historyJson || existing.historyJson,
      });
    }
  });

  let list = Array.from(groupedMap.values());

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
