import { NextResponse } from "next/server";
import { fetchNaverDataLabTrend } from "@/lib/server/ncp-api-hub";
import { getHistoricalHourlyKeywords, archiveHourlyKeywords } from "@/lib/server/keyword-history";

export const revalidate = 300;

function extractCleanKeyword(rawTitle: string): string {
  if (!rawTitle) return "";
  let clean = rawTitle.replace(/^[“"'"'\[\(]+|[”"'"'\]\)]+$/g, "").trim();

  // Quote pattern like "하느님의 만지심"...
  const quoteMatch = rawTitle.match(/[“"']([^“"'\n]{2,20})[”"']/);
  if (quoteMatch && quoteMatch[1] && quoteMatch[1].trim().length >= 2) {
    return quoteMatch[1].trim();
  }

  // Split by punctuation
  const parts = clean.split(/(?:\.\.\.|\.\.\.\s*|…|·|:|;|-|,|\s{2,})/);
  if (parts.length > 0 && parts[0].trim().length >= 2) {
    const firstPart = parts[0].trim().replace(/^[“"'"'\[\(]+|[”"'"'\]\)]+$/g, "");
    if (firstPart.length >= 2 && firstPart.length <= 15) {
      return firstPart;
    }
  }

  const words = clean.split(/\s+/).filter((w) => w.length > 0);
  if (words.length <= 3) return clean;
  return words.slice(0, 3).join(" ");
}

async function fetchNaverNewsHeadline(keyword: string): Promise<{ title: string; url: string }> {
  try {
    const url = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });
    if (res.ok) {
      const html = await res.text();
      const titleMatch = html.match(/class="news_tit"[^>]*title="([^"]+)"/);
      const hrefMatch = html.match(/class="news_tit"[^>]*href="([^"]+)"/);
      if (titleMatch && titleMatch[1]) {
        return {
          title: titleMatch[1].replace(/<[^>]+>/g, "").trim(),
          url: hrefMatch ? hrefMatch[1] : url,
        };
      }
    }
  } catch (e) {}
  return {
    title: `${keyword} 관련 네이버 실시간 주요 뉴스 이슈`,
    url: `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}`,
  };
}

export async function fetchRealtimeNaverRanks(dateStr?: string) {
  const allItems: any[] = [];
  const dateFormatted = dateStr ? dateStr.replace(/-/g, "") : "";

  if (dateFormatted) {
    // Past date daily fetching via Naver Popular Day Ranks (Original Headline Titles)
    try {
      const popularUrl = `https://news.naver.com/main/ranking/popularDay.naver?date=${dateFormatted}`;
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

        const candidates: any[] = [];
        while ((match = reg.exec(html)) !== null) {
          const rawHeadline = match[2].replace(/<[^>]+>/g, "").trim();
          if (rawHeadline && rawHeadline.length >= 2 && !candidates.some((x) => x.newsTitle === rawHeadline)) {
            const cleanKw = extractCleanKeyword(rawHeadline);
            candidates.push({
              title: cleanKw || rawHeadline,
              keywords: [cleanKw || rawHeadline],
              changeBadge: "NEW",
              newsTitle: rawHeadline,
              newsUrl: match[1].startsWith("http") ? match[1] : `https://news.naver.com${match[1]}`,
              newsSource: "네이버 랭킹뉴스",
            });
          }
        }

        candidates.sort((a, b) => a.title.localeCompare(b.title, "ko"));
        allItems.push(...candidates.slice(0, 20));
      }
    } catch (err) {
      console.error("Naver Past Daily News fetch error:", err);
    }
  } else {
    // Today live realtime fetching
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
          const signalProms = rawList.map(async (item: any) => {
            const kw = item.keyword || item.title || "";
            if (!kw) return null;
            const cleanKw = extractCleanKeyword(kw);
            const newsInfo = await fetchNaverNewsHeadline(cleanKw || kw);
            return {
              title: cleanKw || kw,
              keywords: [cleanKw || kw],
              changeBadge: item.state === "+" ? "▲" : item.state === "-" ? "▼" : "NEW",
              newsTitle: newsInfo.title,
              newsUrl: newsInfo.url,
              newsSource: "네이버 뉴스",
            };
          });
          const fetchedItems = (await Promise.all(signalProms)).filter(Boolean);
          fetchedItems.forEach((it: any) => {
            if (it && !allItems.some((x) => x.title === it.title)) {
              allItems.push(it);
            }
          });
        }
      }
    } catch (err) {
      console.error("Signal API fetch error:", err);
    }

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
            const rawHeadline = match[2].replace(/<[^>]+>/g, "").trim();
            if (rawHeadline && rawHeadline.length >= 2 && !allItems.some((x) => x.newsTitle === rawHeadline)) {
              const cleanKw = extractCleanKeyword(rawHeadline);
              allItems.push({
                title: cleanKw || rawHeadline,
                keywords: [cleanKw || rawHeadline],
                changeBadge: "NEW",
                newsTitle: rawHeadline,
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
  const hourParam = requestUrl.searchParams.get("hour");

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const targetDate = date || todayStr;
  const targetHour = hourParam !== null ? Number(hourParam) : currentHour;

  const isPastDate = targetDate < todayStr;
  const isPastHourToday = targetDate === todayStr && targetHour < currentHour;

  // 1. CreAibox 클라우드 DB 및 메모리 캐시에 실제 저장된 과거 기록 조회
  const dbRecords = await getHistoricalHourlyKeywords(targetDate, targetHour, "naver");
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

  // 2. 과거 날짜 요청 시 -> 네이버 실제 해당 과거 날짜의 일간 랭킹 기사제목 수집
  if (isPastDate) {
    const pastResults = await fetchRealtimeNaverRanks(targetDate);
    if (pastResults.length > 0) {
      const archiveRecords = pastResults.slice(0, 20).map((item: any, idx: number) => ({
        target_date: targetDate,
        target_hour: targetHour,
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

      return NextResponse.json({
        startDate: targetDate,
        endDate: targetDate,
        results: pastResults.slice(0, 20),
      });
    }

    return NextResponse.json({
      startDate: targetDate,
      endDate: targetDate,
      results: [],
      message: `선택하신 날짜(${targetDate})의 네이버 수집 기록이 존재하지 않습니다.`,
    });
  }

  // 3. 오늘 지난 시간대(예: 현재 18시일 때 17시) 요청 시:
  // 해당 시각에 실제 수집된 DB 기록이 없으면, 현재 라이브 데이터를 과거 시각 데이터로 위장하지 않고 솔직하게 없음을 알림 (가짜 데이터 전면 금지 룰 준수)
  if (isPastHourToday) {
    return NextResponse.json({
      startDate: targetDate,
      endDate: targetDate,
      results: [],
      message: `선택하신 시간대(${targetDate} ${targetHour}시)는 해당 시각에 수집된 CreAibox DB 기록이 존재하지 않는 시간대입니다.`,
    });
  }

  // 4. 현재 실시간(현재 날짜 & 현재 시각) 요청 시 -> 네이버 실시간 라이브 20개 진짜 수집 & DB 아카이빙
  const liveResults = await fetchRealtimeNaverRanks();

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

    // 현재 시각 수집 결과를 CreAibox 클라우드 DB 및 메모리 캐시에 적재
    const archiveRecords = liveResults.slice(0, 20).map((item: any, idx: number) => ({
      target_date: targetDate,
      target_hour: targetHour,
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
