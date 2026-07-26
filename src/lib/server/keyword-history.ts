import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

export interface HourlyKeywordRecord {
  target_date: string; // YYYY-MM-DD
  target_hour: number; // 0-23
  provider: "naver" | "google";
  rank: number;
  keyword: string;
  search_volume?: string;
  rank_change?: string;
  trend_ratio?: number;
  news_title?: string;
  news_url?: string;
  news_source?: string;
}

// 서버 메모리 캐시
const memoryKeywordCache = new Map<string, HourlyKeywordRecord[]>();

export function clearMemoryCacheForProvider(provider: "google" | "naver") {
  for (const key of memoryKeywordCache.keys()) {
    if (key.endsWith(`_${provider}`)) {
      memoryKeywordCache.delete(key);
    }
  }
}

export async function archiveHourlyKeywords(records: HourlyKeywordRecord[]) {
  if (!records || records.length === 0) return;
  const first = records[0];
  const cacheKey = `${first.target_date}_${first.target_hour}_${first.provider}`;

  // 1. 메모리 캐시에 저장
  memoryKeywordCache.set(cacheKey, records);

  // 2. Supabase DB 저장 시도
  try {
    const { error } = await supabaseAdmin
      .from("keyword_trending_history")
      .upsert(records, { onConflict: "target_date,target_hour,provider,rank" });
    if (error) {
      console.warn("Notice: keyword_trending_history upsert message:", error.message);
    }
  } catch (err) {
    console.error("archiveHourlyKeywords error:", err);
  }
}

export async function getHistoricalHourlyKeywords(targetDate: string, targetHour: number, provider: "naver" | "google") {
  const cacheKey = `${targetDate}_${targetHour}_${provider}`;

  // 구글 과거 날짜 데이터 요청 시 구형 무한캐시 비우기
  const todayStr = new Date().toISOString().split("T")[0];
  if (provider === "google" && targetDate < todayStr) {
    memoryKeywordCache.delete(cacheKey);
    return null;
  }

  // 1. 메모리 캐시 확인
  if (memoryKeywordCache.has(cacheKey)) {
    return memoryKeywordCache.get(cacheKey) || null;
  }

  // 2. Supabase DB 조회 시도
  try {
    const { data, error } = await supabaseAdmin
      .from("keyword_trending_history")
      .select("*")
      .eq("target_date", targetDate)
      .eq("target_hour", targetHour)
      .eq("provider", provider)
      .order("rank", { ascending: true });

    if (!error && data && data.length > 0) {
      memoryKeywordCache.set(cacheKey, data);
      return data;
    }
  } catch (err) {
    console.error("getHistoricalHourlyKeywords error:", err);
  }

  return null;
}
