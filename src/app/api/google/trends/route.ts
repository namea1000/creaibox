import { NextResponse } from "next/server";
import { getHistoricalHourlyKeywords, archiveHourlyKeywords } from "@/lib/server/keyword-history";

export async function fetchOfficialGoogleTrends() {
  const url = "https://trends.google.com/trending?geo=KR&hours=4";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const html = await res.text();
    const callbacks = html.match(/AF_initDataCallback\s*\(\s*\{[\s\S]*?\}\s*\)/g);
    if (!callbacks) return [];

    for (const cb of callbacks) {
      const dataMatch = cb.match(/data:\s*([\s\S]*?)\s*,\s*sideChannel/);
      if (dataMatch) {
        try {
          const parsed = JSON.parse(dataMatch[1]);
          if (Array.isArray(parsed) && parsed[1] && Array.isArray(parsed[1])) {
            const list = parsed[1];
            const items = list
              .map((item: any) => {
                if (!Array.isArray(item) || typeof item[0] !== "string") return null;
                const keyword = item[0];
                const trafficVal = item[6] || 1000;
                const formattedTraffic = trafficVal >= 10000 ? `${Math.floor(trafficVal / 10000)}만+` : `${trafficVal.toLocaleString()}+`;
                return {
                  title: keyword,
                  traffic: formattedTraffic,
                  pubDate: "실시간 인기",
                  newsTitle: `${keyword} 관련 구글 실시간 급상승 트렌드 이슈`,
                  newsUrl: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
                  newsSource: "구글 트렌드",
                };
              })
              .filter(Boolean);

            if (items.length >= 5) {
              return items;
            }
          }
        } catch (e) {
          // continue
        }
      }
    }
  } catch (err) {
    console.error("fetchOfficialGoogleTrends Error:", err);
  }
  return [];
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const geo = requestUrl.searchParams.get("geo") || "KR";
  const date = requestUrl.searchParams.get("date");
  const hour = Number(requestUrl.searchParams.get("hour") || new Date().getHours());

  const todayStr = new Date().toISOString().split("T")[0];
  const targetDate = date || todayStr;

  // 1. CreAibox 클라우드 DB 보관 기록 우선 조회
  const dbRecords = await getHistoricalHourlyKeywords(targetDate, hour, "google");
  if (dbRecords && dbRecords.length > 0) {
    return NextResponse.json({
      geo,
      total: dbRecords.length,
      items: dbRecords.map((r) => ({
        title: r.keyword,
        traffic: r.search_volume || "1K+",
        pubDate: `${targetDate} ${hour}:00 DB 아카이빙`,
        newsTitle: r.news_title,
        newsUrl: r.news_url,
        newsSource: r.news_source,
      })),
    });
  }

  // 2. 구글 공식 트렌드 웹페이지 실시간 데이터 직접 연동 (Google Trends Realtime API)
  let liveItems: any[] = await fetchOfficialGoogleTrends();

  // 3. 라이브 데이터가 존재하면 CreAibox 클라우드 DB에 즉시 아카이빙 적재
  if (liveItems.length > 0) {
    const archiveRecords = liveItems.slice(0, 20).map((item, idx) => ({
      target_date: targetDate,
      target_hour: hour,
      provider: "google" as const,
      rank: idx + 1,
      keyword: item.title,
      search_volume: item.traffic,
      news_title: item.newsTitle,
      news_url: item.newsUrl,
      news_source: item.newsSource,
    }));
    await archiveHourlyKeywords(archiveRecords);
  }

  return NextResponse.json({
    geo,
    total: liveItems.slice(0, 20).length,
    items: liveItems.slice(0, 20),
  });
}
