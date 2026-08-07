import { NextRequest, NextResponse } from "next/server";
import { getKstTodayDate, isShortsDuration } from "@/app/api/youtube/route";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";
import { ALL_COUNTRIES } from "@/app/studio/youtube/[section]/components/RisingVideos";

const CORE_CATEGORY_IDS = ["all", "10", "20", "24", "23", "1", "28", "17", "2", "25", "26", "19", "22", "15", "29"];

export const maxDuration = 300; // Allow 5 minutes max duration for Vercel Cron

export async function GET(req: NextRequest) {
  // 1. Verify Vercel Cron authorization header
  const authHeader = req.headers.get("authorization");

  if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized Vercel Cron Trigger Attempt blocked.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  console.log("Vercel Cron Triggered: Starting Top 12-Country & 15-Category YouTube Daily Trending Scraper.");

  const date = getKstTodayDate();

  // 1-A. Check if Cron Scheduler is active in system settings
  try {
    const { data: settingRow } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "cron_trending_status")
      .maybeSingle();

    if (settingRow && settingRow.value && (settingRow.value as any).active === false) {
      console.log("Vercel Cron Bypassed: status is set to INACTIVE by admin.");
      return NextResponse.json({
        message: "Cron execution skipped: status is set to INACTIVE by admin.",
        skipped: true,
        date
      });
    }
  } catch (settingErr) {
    console.error("Failed to fetch cron status setting, continuing by default:", settingErr);
  }

  // 2. Fetch existing single bundle row from DB to retain previously stored countries
  const masterBundleObj: Record<string, any[]> = {};
  try {
    const { data: existingRow } = await supabaseAdmin
      .from("youtube_trending_archive")
      .select("videos_data")
      .eq("target_date", date)
      .eq("category_id", "bundle")
      .maybeSingle();

    if (existingRow && existingRow.videos_data && typeof existingRow.videos_data === "object" && !Array.isArray(existingRow.videos_data)) {
      Object.assign(masterBundleObj, existingRow.videos_data);
    }
  } catch (e) {
    console.error("Failed to fetch existing bundle row:", e);
  }

  // Helper function to fetch 1 country & category combination from YouTube API
  async function fetchTrendingData(countryCode: string, categoryId: string): Promise<any[]> {
    let apiKey = "";
    try {
      const { data: vaultKeys } = await supabaseAdmin
        .from("admin_api_vault")
        .select("id, key, today_count, daily_limit")
        .eq("provider", "youtube")
        .eq("status", "active")
        .order("priority", { ascending: true })
        .order("today_count", { ascending: true });

      if (vaultKeys && vaultKeys.length > 0) {
        for (const vault of vaultKeys) {
          if ((vault.today_count || 0) < (vault.daily_limit || 1000)) {
            const decrypted = decryptApiKey(vault.key);
            if (decrypted) {
              apiKey = decrypted;
              break;
            }
          }
        }
      }
    } catch (e) {}

    if (!apiKey) {
      apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";
    }

    const catParam = categoryId === "all" ? "" : `&videoCategoryId=${categoryId}`;
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${countryCode}${catParam}&maxResults=25&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`YouTube API returned HTTP ${res.status} for country ${countryCode} cat ${categoryId}`);
    }
    const data = await res.json();
    const items = data.items || [];

    return items.map((item: any) => ({
      ...item,
      isRealShorts: isShortsDuration(item.contentDetails?.duration),
    }));
  }

  const results: Array<{ key: string; success: boolean; error?: string }> = [];
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const targetCountries = ALL_COUNTRIES.map((c: { code: string }) => c.code);
  const coreCategoryIds = CORE_CATEGORY_IDS;

  // 3. Ultra-Fast Parallel Scraping (5 countries per chunk) to complete 60 countries in <20s
  const chunkSize = 5;
  for (let i = 0; i < targetCountries.length; i += chunkSize) {
    const chunk = targetCountries.slice(i, i + chunkSize);
    
    await Promise.all(
      chunk.map(async (countryCode) => {
        const categoriesToScrape = (countryCode === "KR" || countryCode === "US" || countryCode === "JP")
          ? coreCategoryIds
          : ["all"];

        for (const catId of categoriesToScrape) {
          const bundleKey = countryCode === "KR" && catId === "all"
            ? "all"
            : (catId === "all" ? `${countryCode}_all` : `${countryCode}_${catId}`);

          try {
            const enriched = await fetchTrendingData(countryCode, catId);
            if (enriched.length > 0) {
              masterBundleObj[bundleKey] = enriched;
              results.push({ key: bundleKey, success: true });
            }
          } catch (err: any) {
            results.push({ key: bundleKey, success: false, error: err.message || String(err) });
          }
        }
      })
    );

    // Batch save bundle to DB after each 5-country chunk
    await supabaseAdmin
      .from("youtube_trending_archive")
      .upsert({
        category_id: "bundle",
        target_date: date,
        videos_data: masterBundleObj,
        updated_at: new Date().toISOString(),
      }, { onConflict: "target_date, category_id" });

    await delay(100);
  }

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;
  console.log(`Vercel Cron Finished: Scraped ${successCount}/${totalCount} trending keys successfully into single bundle row.`);

  return NextResponse.json({
    message: "60-country & 15-category daily trending cron sync executed with immediate DB saves into single bundle row.",
    date,
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount,
      storedKeysCount: Object.keys(masterBundleObj).length
    },
    details: results,
  });
}
