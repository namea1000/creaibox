import { NextRequest, NextResponse } from "next/server";
import { fetchRealtimeNaverRanks } from "@/app/api/naver/trend/route";
import { fetchOfficialGoogleTrends } from "@/app/api/google/trends/route";
import { archiveHourlyKeywords, HourlyKeywordRecord } from "@/lib/server/keyword-history";
import { getKstTodayDate } from "@/app/api/youtube/route";

function getKstCurrentHour(): number {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kst = new Date(utc + 9 * 60 * 60 * 1000);
  return kst.getHours();
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized Vercel Cron Trigger Attempt blocked for sync-keywords.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const dateStr = getKstTodayDate();
  const currentHour = getKstCurrentHour();

  console.log(`Vercel Cron Triggered: Starting Hourly Keyword Archiving for Date: ${dateStr}, Hour: ${currentHour}`);

  let naverCount = 0;
  let googleCount = 0;

  // 1. Fetch & Archive Naver Realtime TOP 20 Keywords
  try {
    const naverItems = await fetchRealtimeNaverRanks();
    if (Array.isArray(naverItems) && naverItems.length > 0) {
      const records: HourlyKeywordRecord[] = naverItems.slice(0, 20).map((item, idx) => ({
        target_date: dateStr,
        target_hour: currentHour,
        provider: "naver",
        rank: idx + 1,
        keyword: item.title,
        rank_change: item.changeBadge,
        news_title: item.newsTitle,
        news_url: item.newsUrl,
        news_source: item.newsSource,
      }));
      await archiveHourlyKeywords(records);
      naverCount = records.length;
    }
  } catch (err) {
    console.error("Hourly Cron Naver Fetch Error:", err);
  }

  // 2. Fetch & Archive Google Realtime TOP 20 Keywords
  try {
    const googleItems = await fetchOfficialGoogleTrends();
    if (Array.isArray(googleItems) && googleItems.length > 0) {
      const records: HourlyKeywordRecord[] = googleItems.slice(0, 20).map((item, idx) => ({
        target_date: dateStr,
        target_hour: currentHour,
        provider: "google",
        rank: idx + 1,
        keyword: item.title,
        search_volume: item.traffic,
        news_title: item.newsTitle,
        news_url: item.newsUrl,
        news_source: item.newsSource,
      }));
      await archiveHourlyKeywords(records);
      googleCount = records.length;
    }
  } catch (err) {
    console.error("Hourly Cron Google Fetch Error:", err);
  }

  return NextResponse.json({
    message: "Hourly keyword archiving executed successfully.",
    date: dateStr,
    hour: currentHour,
    summary: {
      naverCount,
      googleCount,
    },
  });
}
