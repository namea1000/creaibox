import { NextRequest, NextResponse } from "next/server";
import { getKstTodayDate, isShortsDuration } from "@/app/api/youtube/popular/route";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";
import { ALL_COUNTRIES } from "@/app/studio/youtube/[section]/components/PopularVideos";

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

  console.log("Vercel Cron Triggered: Starting YouTube Daily Popular Videos Ranking Archive Scraper.");

  const date = getKstTodayDate();

  // 1-A. Check if Cron Scheduler is active in system settings
  try {
    const { data: settingRow } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "cron_popular_status")
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

  // 2. Fetch existing single daily bundle row from DB to retain previously stored keys
  const masterBundleObj: Record<string, any[]> = {};
  try {
    const { data: existingRow } = await supabaseAdmin
      .from("youtube_popular_archive")
      .select("videos_data")
      .eq("target_date", date)
      .maybeSingle();

    if (existingRow && existingRow.videos_data && typeof existingRow.videos_data === "object" && !Array.isArray(existingRow.videos_data)) {
      Object.assign(masterBundleObj, existingRow.videos_data);
    }
  } catch (e) {
    console.error("Failed to fetch existing popular bundle row:", e);
  }

  // Helper function to fetch 1 combination from YouTube API with active key rotation
  async function fetchPopularData(countryCode: string, categoryId: string, period: string): Promise<any[]> {
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

    const targetRegionParam = (countryCode === "GLOBAL" || countryCode === "GLOBAL_ALL") ? "" : `&regionCode=${countryCode}`;
    const categoryParam = (categoryId && categoryId !== "all") ? `&videoCategoryId=${categoryId}` : "";

    let rawItems: any[] = [];
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular${targetRegionParam}${categoryParam}&maxResults=50&key=${apiKey}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      rawItems = data.items || [];
    }

    let enrichedItems = rawItems.map((item: any) => ({
      ...item,
      isRealShorts: isShortsDuration(item.contentDetails?.duration),
    }));

    enrichedItems.sort((a, b) => {
      const vA = parseInt(a.statistics?.viewCount || "0", 10);
      const vB = parseInt(b.statistics?.viewCount || "0", 10);
      return vB - vA;
    });

    return enrichedItems;
  }

  const results: Array<{ key: string; success: boolean; error?: string }> = [];
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // 3. Targets: ALL 60 Countries & Core Categories & Periods for Daily Final Snapshot
  const targetCountryCodes = ALL_COUNTRIES.map((c: { code: string }) => c.code);
  if (!targetCountryCodes.includes("GLOBAL")) {
    targetCountryCodes.unshift("GLOBAL");
  }
  const coreCategories = ["all", "10", "20", "24", "23", "1", "26", "25", "22", "28", "15", "17", "2"];
  const periods = ["all_time", "7d", "30d", "1d"];

  for (const countryCode of targetCountryCodes) {
    for (const categoryId of coreCategories) {
      for (const period of periods) {
        const bundleKey = `${countryCode}_${categoryId}_${period}`;
        let attempts = 0;
        let success = false;
        let lastErr = "";

        while (attempts < 2) {
          try {
            console.log(`Cron Popular Scraping: ${bundleKey} (Date: ${date})`);
            const enriched = await fetchPopularData(countryCode, categoryId, period);

            if (enriched.length > 0) {
              masterBundleObj[bundleKey] = enriched;

              // Save immediately to single daily bundle DB row
              const { error: saveError } = await supabaseAdmin
                .from("youtube_popular_archive")
                .upsert({
                  target_date: date,
                  videos_data: masterBundleObj,
                  updated_at: new Date().toISOString(),
                }, { onConflict: "target_date" });

              if (saveError) {
                console.error(`Failed to save key ${bundleKey} to popular bundle row:`, saveError.message);
              } else {
                console.log(`Saved key ${bundleKey} immediately to single daily popular bundle DB row.`);
              }
            }

            success = true;
            results.push({ key: bundleKey, success: true });
            break;
          } catch (err: any) {
            lastErr = err.message || String(err);
            attempts++;
            await delay(200);
          }
        }

        if (!success) {
          results.push({ key: bundleKey, success: false, error: lastErr });
        }
        await delay(50);
      }
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;
  console.log(`Vercel Cron Finished: Scraped ${successCount}/${totalCount} popular keys into single daily bundle row.`);

  return NextResponse.json({
    message: "YouTube daily popular videos ranking cron sync executed into single daily bundle row.",
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
