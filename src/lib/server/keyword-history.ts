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
  const targetDate = first.target_date;
  const targetHourStr = String(first.target_hour);
  const provider = first.provider;
  const cacheKey = `${targetDate}_${targetHourStr}_${provider}`;

  // 1. 메모리 캐시에 저장
  memoryKeywordCache.set(cacheKey, records);

  // 2. Supabase DB 1-Row-Per-Date 번들 구조로 저장 시도
  try {
    const { data: existingRow } = await supabaseAdmin
      .from("keyword_trending_history")
      .select("hourly_data")
      .eq("target_date", targetDate)
      .maybeSingle();

    let hourlyObj: Record<string, Record<string, any[]>> = {};
    if (existingRow && existingRow.hourly_data && typeof existingRow.hourly_data === "object" && !Array.isArray(existingRow.hourly_data)) {
      hourlyObj = existingRow.hourly_data as any;
    }

    if (!hourlyObj[targetHourStr]) {
      hourlyObj[targetHourStr] = {};
    }
    hourlyObj[targetHourStr][provider] = records;

    const { error: upsertErr } = await supabaseAdmin
      .from("keyword_trending_history")
      .upsert(
        {
          target_date: targetDate,
          hourly_data: hourlyObj,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "target_date" }
      );

    if (upsertErr) {
      console.warn("Notice: keyword_trending_history bundle upsert fallback:", upsertErr.message);
      // 레거시 테이블 구조 호환을 위한 폴백
      await supabaseAdmin
        .from("keyword_trending_history")
        .upsert(records, { onConflict: "target_date,target_hour,provider,rank" });
    }
  } catch (err) {
    console.error("archiveHourlyKeywords error:", err);
  }
}

export async function getHistoricalHourlyKeywords(targetDate: string, targetHour: number, provider: "naver" | "google") {
  const targetHourStr = String(targetHour);
  const cacheKey = `${targetDate}_${targetHourStr}_${provider}`;

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

  // 2. Supabase DB 1-Row-Per-Date 번들 조회 시도
  try {
    const { data: bundleRow } = await supabaseAdmin
      .from("keyword_trending_history")
      .select("hourly_data")
      .eq("target_date", targetDate)
      .maybeSingle();

    if (bundleRow && bundleRow.hourly_data && typeof bundleRow.hourly_data === "object" && !Array.isArray(bundleRow.hourly_data)) {
      const hourlyObj = bundleRow.hourly_data as Record<string, Record<string, any[]>>;
      const hourData = hourlyObj[targetHourStr];
      if (hourData && Array.isArray(hourData[provider]) && hourData[provider].length > 0) {
        memoryKeywordCache.set(cacheKey, hourData[provider]);
        return hourData[provider];
      }
    }
  } catch (err) {
    console.error("getHistoricalHourlyKeywords bundle read error:", err);
  }

  // 3. 레거시 개별 Row 구조 폴백 조회
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
