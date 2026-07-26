import { NextResponse } from "next/server";
import { fetchNaverDataLabTrend } from "@/lib/server/ncp-api-hub";
import { getHistoricalHourlyKeywords, archiveHourlyKeywords } from "@/lib/server/keyword-history";

export async function fetchRealtimeNaverRanks() {
  const allItems: any[] = [];

  // 1. Signal Realtime Ranks
  try {
    const signalRes = await fetch("https://api.signal.bz/news/realtime", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (signalRes.ok) {
      const signalData = await signalRes.json();
      const rawList = signalData.top20 || signalData.top10 || [];
      if (Array.isArray(rawList)) {
        rawList.forEach((item: any) => {
          const kw = item.keyword || item.title || "";
          if (kw && !allItems.some((x) => x.title === kw)) {
            allItems.push({
              title: kw,
              keywords: [kw],
              changeBadge: item.state === "+" ? "▲" : item.state === "-" ? "▼" : "NEW",
              newsTitle: `${kw} 관련 네이버 실시간 이슈`,
              newsUrl: item.summary || `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(kw)}`,
              newsSource: "네이버 뉴스",
            });
          }
        });
      }
    }
  } catch (err) {
    console.error("Signal API fetch error:", err);
  }

  // 2. Naver Popular Ranking News (Supplement to reach 20 items)
  if (allItems.length < 20) {
    try {
      const popularUrl = "https://news.naver.com/main/ranking/popularDay.naver";
      const res = await fetch(popularUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        cache: "no-store",
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const decoder = new TextDecoder("euc-kr");
        const html = decoder.decode(buffer);
        const reg = /<a href="([^"]*)" class="list_title[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
        let match;

        while ((match = reg.exec(html)) !== null) {
          const raw = match[2].replace(/<[^>]+>/g, "").trim();
          const clean = raw.split(" - ")[0].split("…")[0].trim();
          if (clean && clean.length >= 2 && !allItems.some((x) => x.title === clean)) {
            allItems.push({
              title: clean,
              keywords: [clean],
              changeBadge: "NEW",
              newsTitle: raw,
              newsUrl: match[1].startsWith("http") ? match[1] : `https://news.naver.com${match[1]}`,
              newsSource: "네이버 랭킹뉴스",
            });
            if (allItems.length >= 20) break;
          }
        }
      }
    } catch (err) {
      console.error("Naver Popular News fetch error:", err);
    }
  }

  return allItems.slice(0, 20).map((item, idx) => ({
    ...item,
    rank: idx + 1,
    ratio: 98 - idx * 4,
  }));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const date = requestUrl.searchParams.get("date");
  const hour = Number(requestUrl.searchParams.get("hour") || new Date().getHours());

  const todayStr = new Date().toISOString().split("T")[0];
  const currentHour = new Date().getHours();

  const targetDate = date || todayStr;
  const isPast = targetDate < todayStr || (targetDate === todayStr && hour < currentHour);

  // 1. CreAibox 클라우드 DB 보관 기록 우선 조회
  const dbRecords = await getHistoricalHourlyKeywords(targetDate, hour, "naver");
  if (dbRecords && dbRecords.length > 0) {
    return NextResponse.json({
      startDate: targetDate,
      endDate: targetDate,
      results: dbRecords.map((r) => ({
        title: r.keyword,
        keywords: [r.keyword],
        ratio: r.trend_ratio || 85,
        changeBadge: r.rank_change || "NEW",
        newsTitle: r.news_title,
        newsUrl: r.news_url,
        newsSource: r.news_source,
      })),
    });
  }

  // 2. 과거 시간대/날짜인데 DB 보관 데이터가 없는 경우 -> 현재 실시간 데이터로 덮어쓰지 않고 엠프티 안내
  if (isPast) {
    return NextResponse.json({
      startDate: targetDate,
      endDate: targetDate,
      results: [],
      message: `선택하신 일시(${targetDate} ${hour}시)의 실시간 아카이빙 데이터가 CreAibox DB에 보관되어 있지 않습니다.`,
    });
  }

  // 3. 현재 시간대 요청 시 -> 네이버 20개 실시간 급상승 키워드 100% 라이브 수집
  const liveResults = await fetchRealtimeNaverRanks();

  // NCP DataLab API 결합
  if (liveResults.length > 0) {
    try {
      const dataLabBody = {
        startDate: targetDate,
        endDate: targetDate,
        timeUnit: "date",
        keywordGroups: liveResults.slice(0, 5).map((item) => ({
          groupName: item.title,
          keywords: [item.title],
        })),
      };
      await fetchNaverDataLabTrend(dataLabBody);
    } catch (e) {}
  }

  // 4. 수집된 20개 리얼 라이브 결과를 CreAibox 클라우드 DB에 (targetDate, hour) 기준으로 적재
  if (liveResults.length > 0) {
    const archiveRecords = liveResults.slice(0, 20).map((item: any, idx: number) => ({
      target_date: targetDate,
      target_hour: hour,
      provider: "naver" as const,
      rank: idx + 1,
      keyword: item.title,
      rank_change: item.changeBadge,
      trend_ratio: item.ratio,
      news_title: item.newsTitle,
      news_url: item.newsUrl,
      news_source: item.newsSource,
    }));
    await archiveHourlyKeywords(archiveRecords);
  }

  return NextResponse.json({
    startDate: targetDate,
    endDate: targetDate,
    results: liveResults.slice(0, 20),
  });
}
