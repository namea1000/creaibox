import { NextResponse } from "next/server";
import { fetchNaverDataLabTrend } from "@/lib/server/ncp-api-hub";
import { getHistoricalHourlyKeywords, archiveHourlyKeywords } from "@/lib/server/keyword-history";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const date = requestUrl.searchParams.get("date");
  const hour = Number(requestUrl.searchParams.get("hour") || new Date().getHours());

  const todayStr = new Date().toISOString().split("T")[0];
  const targetDate = date || todayStr;
  const isPast = targetDate < todayStr;

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
        newsTitle: r.news_title,
        newsUrl: r.news_url,
        newsSource: r.news_source,
      })),
    });
  }

  // 2. 과거 날짜인데 DB 기록이 없는 경우 -> 가짜 데이터 생성 없이 엠프티 반환
  if (isPast) {
    return NextResponse.json({
      startDate: targetDate,
      endDate: targetDate,
      results: [],
      message: `선택하신 일시(${targetDate} ${hour}시)의 네이버 실시간 수집 기록이 CreAibox DB에 보관되어 있지 않습니다.`,
    });
  }

  // 3. 오늘 날짜 요청 시 -> 네이버 실시간 데이터 수집 API 호출
  let liveResults: any[] = [];
  const defaultBody = {
    startDate: targetDate,
    endDate: targetDate,
    timeUnit: "date",
    keywordGroups: [
      { groupName: "주요 이슈", keywords: ["이슈", "뉴스"] },
    ],
  };

  try {
    const data = await fetchNaverDataLabTrend(defaultBody);
    if (data && data.results && Array.isArray(data.results)) {
      liveResults = data.results;
    }
  } catch (err) {
    console.error("Naver DataLab Live API Error:", err);
  }

  // 4. 수집된 라이브 결과가 있으면 CreAibox 클라우드 DB에 즉시 아카이빙 저장
  if (liveResults.length > 0) {
    const archiveRecords = liveResults.map((item: any, idx: number) => ({
      target_date: todayStr,
      target_hour: hour,
      provider: "naver" as const,
      rank: idx + 1,
      keyword: item.title,
      trend_ratio: item.ratio || 90 - idx * 2,
      news_title: item.newsTitle || `${item.title} 관련 네이버 뉴스`,
      news_url: item.newsUrl || `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(item.title)}`,
      news_source: item.newsSource || "네이버 뉴스",
    }));
    await archiveHourlyKeywords(archiveRecords);
  }

  return NextResponse.json({
    startDate: targetDate,
    endDate: targetDate,
    results: liveResults,
  });
}
