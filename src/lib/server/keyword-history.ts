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

export async function archiveHourlyKeywords(records: HourlyKeywordRecord[]) {
  if (!records || records.length === 0) return;
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
  try {
    const { data, error } = await supabaseAdmin
      .from("keyword_trending_history")
      .select("*")
      .eq("target_date", targetDate)
      .eq("target_hour", targetHour)
      .eq("provider", provider)
      .order("rank", { ascending: true });

    if (error || !data || data.length === 0) {
      return null;
    }
    return data;
  } catch (err) {
    console.error("getHistoricalHourlyKeywords error:", err);
    return null;
  }
}
