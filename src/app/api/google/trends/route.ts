import { NextResponse } from "next/server";
import { getHistoricalHourlyKeywords, archiveHourlyKeywords } from "@/lib/server/keyword-history";

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
        traffic: r.search_volume || "100K+",
        pubDate: `${targetDate} ${hour}:00 DB 아카이빙`,
        newsTitle: r.news_title,
        newsUrl: r.news_url,
        newsSource: r.news_source,
      })),
    });
  }

  // 2. 구글 뉴스/트렌드 라이브 RSS 통신 수집
  const liveItems: any[] = [];
  try {
    const googleNewsUrl = `https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko`;
    const res = await fetch(googleNewsUrl, {
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
        const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
        const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemContent);

        if (titleMatch) {
          const fullTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
          const cleanTitle = fullTitle.split(" - ")[0].trim();
          const newsSource = sourceMatch ? sourceMatch[1].trim() : fullTitle.split(" - ")[1] || "구글 뉴스";
          let newsUrl = linkMatch ? linkMatch[1].trim() : "";
          const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";

          if (!newsUrl || newsUrl.endsWith("news.google.com") || newsUrl.endsWith("news.google.com/")) {
            newsUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanTitle)}&tbm=nws`;
          }

          liveItems.push({
            title: cleanTitle,
            traffic: "100K+",
            pubDate,
            newsTitle: fullTitle,
            newsUrl,
            newsSource,
          });
        }
      }
    }
  } catch (err: any) {
    console.error("Google News Live RSS Error:", err);
  }

  // 3. 수집된 라이브 결과를 CreAibox 클라우드 DB에 (targetDate, hour) 기준으로 자동 아카이빙 저장
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
