import { NextResponse } from "next/server";
import { getHistoricalHourlyKeywords, archiveHourlyKeywords } from "@/lib/server/keyword-history";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const geo = requestUrl.searchParams.get("geo") || "KR";
  const date = requestUrl.searchParams.get("date");
  const hour = Number(requestUrl.searchParams.get("hour") || new Date().getHours());

  const todayStr = new Date().toISOString().split("T")[0];
  const targetDate = date || todayStr;
  const isPast = targetDate < todayStr;

  // 1. CreAibox 클라우드 DB 보관 기록 우선 조회
  const dbRecords = await getHistoricalHourlyKeywords(targetDate, hour, "google");
  if (dbRecords && dbRecords.length > 0) {
    return NextResponse.json({
      geo,
      total: dbRecords.length,
      items: dbRecords.map((r) => ({
        title: r.keyword,
        traffic: r.search_volume || "100K+",
        pubDate: `${targetDate} ${hour}:00 DB 아카이빙`,
        newsTitle: r.news_title,
        newsUrl: r.news_url,
        newsSource: r.news_source,
      })),
    });
  }

  // 2. 과거 날짜인데 DB 기록이 없는 경우 -> 가짜 데이터 생성 없이 엠프티 반환
  if (isPast) {
    return NextResponse.json({
      geo,
      total: 0,
      items: [],
      message: `선택하신 일시(${targetDate} ${hour}시)의 구글 실시간 수집 기록이 CreAibox DB에 보관되어 있지 않습니다.`,
    });
  }

  // 3. 오늘 날짜 요청 시 -> 구글 트렌드 실시간 RSS API 호출
  const liveItems: any[] = [];
  try {
    const rssUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`;
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const xmlText = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemContent = match[1];
        const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemContent);
        const trafficMatch = /<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/.exec(itemContent);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
        const newsTitleMatch = /<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>/.exec(itemContent);
        const newsUrlMatch = /<ht:news_item_url>([\s\S]*?)<\/ht:news_item_url>/.exec(itemContent);
        const newsSourceMatch = /<ht:news_item_source>([\s\S]*?)<\/ht:news_item_source>/.exec(itemContent);

        if (titleMatch) {
          const title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
          const traffic = trafficMatch ? trafficMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "50,000+";
          const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
          const newsTitle = newsTitleMatch ? newsTitleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
          let newsUrl = newsUrlMatch ? newsUrlMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
          const newsSource = newsSourceMatch ? newsSourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";

          if (!newsUrl || newsUrl.endsWith("news.google.com") || newsUrl.endsWith("news.google.com/")) {
            newsUrl = `https://www.google.com/search?q=${encodeURIComponent(title + " " + (newsTitle || "뉴스"))}&tbm=nws`;
          }

          liveItems.push({
            title,
            traffic,
            pubDate,
            newsTitle,
            newsUrl,
            newsSource,
          });
        }
      }
    }
  } catch (err: any) {
    console.error("Google Trends Live RSS Error:", err);
  }

  // 4. 실시간 수집 성공 시 CreAibox 클라우드 DB에 즉시 아카이빙 저장
  if (liveItems.length > 0) {
    const archiveRecords = liveItems.slice(0, 20).map((item, idx) => ({
      target_date: todayStr,
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
    total: liveItems.length,
    items: liveItems,
  });
}
