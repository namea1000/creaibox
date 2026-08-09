import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { fetchRealtimeNaverRanks } from "@/app/api/naver/trend/route";
import { fetchOfficialGoogleTrends } from "@/app/api/google/trends/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GLOBAL_KEYWORDS_CACHE = new Map<string, { data: any; timestamp: number }>();
const GLOBAL_KEYWORDS_PROMISES = new Map<string, Promise<any>>();

export async function GET() {
  const cacheKey = "latest_quick_keywords";
  const cached = GLOBAL_KEYWORDS_CACHE.get(cacheKey);
  // TTL: 1 hour (1000 * 60 * 60)
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60) {
    return NextResponse.json(cached.data);
  }

  if (GLOBAL_KEYWORDS_PROMISES.has(cacheKey)) {
    const data = await GLOBAL_KEYWORDS_PROMISES.get(cacheKey);
    return NextResponse.json(data);
  }

  const promise = (async () => {
    try {
      const data = await generateKeywords();
      GLOBAL_KEYWORDS_CACHE.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      GLOBAL_KEYWORDS_PROMISES.delete(cacheKey);
    }
  })();

  GLOBAL_KEYWORDS_PROMISES.set(cacheKey, promise);
  
  try {
    const data = await promise;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

async function generateKeywords() {
  const todayStr = new Date().toISOString().split("T")[0];
  const currentHour = new Date().getHours();

  let naverList: Array<{ keyword: string; provider: "naver" }> = [];
  let googleList: Array<{ keyword: string; provider: "google" }> = [];

  try {
    // 1. CreAibox 클라우드 DB에서 가장 최근 수집된 실시간 키워드 번들 조회
    const { data: bundleRow } = await supabaseAdmin
      .from("keyword_trending_history")
      .select("hourly_data")
      .eq("target_date", todayStr)
      .maybeSingle();

    if (bundleRow && bundleRow.hourly_data && typeof bundleRow.hourly_data === "object") {
      const hourlyObj = bundleRow.hourly_data as Record<string, Record<string, any[]>>;
      for (let h = currentHour; h >= 0; h--) {
        const hourData = hourlyObj[String(h)];
        if (hourData) {
          if (naverList.length === 0 && Array.isArray(hourData.naver) && hourData.naver.length > 0) {
            naverList = hourData.naver.slice(0, 5).map((item) => ({
              keyword: item.keyword || item.title,
              provider: "naver" as const,
            }));
          }
          if (googleList.length === 0 && Array.isArray(hourData.google) && hourData.google.length > 0) {
            googleList = hourData.google.slice(0, 5).map((item) => ({
              keyword: item.keyword || item.title,
              provider: "google" as const,
            }));
          }
        }
        if (naverList.length >= 5 && googleList.length >= 5) break;
      }
    }
  } catch (e) {
    console.error("latest-quick DB read error:", e);
  }

  // 2. DB가 비어있는 경우 라이브 엔진에서 실시간 최신 수집
  if (naverList.length < 5) {
    try {
      const liveNaver = await fetchRealtimeNaverRanks();
      naverList = liveNaver.slice(0, 5).map((n: any) => ({
        keyword: n.title,
        provider: "naver" as const,
      }));
    } catch (e) {}
  }

  if (googleList.length < 5) {
    try {
      const liveGoogle = await fetchOfficialGoogleTrends();
      googleList = liveGoogle.slice(0, 5).map((g: any) => ({
        keyword: g.title,
        provider: "google" as const,
      }));
    } catch (e) {}
  }

  return {
    items: [...naverList, ...googleList],
  };
}
