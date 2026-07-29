import { NextRequest, NextResponse } from "next/server";
import { getKstTodayDate, isShortsDuration } from "@/app/api/youtube/route";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";
import { ALL_COUNTRIES } from "@/app/studio/youtube/[section]/components/RisingVideos";

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

  console.log("Vercel Cron Triggered: Starting Sequential 60-Country YouTube Daily Trending Archive Scraper.");

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

  // Helper function to fetch 1 country from YouTube API with active key rotation
  async function fetchCountryTrendingData(countryCode: string): Promise<any[]> {
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

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${countryCode}&maxResults=20&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`YouTube API returned HTTP ${res.status} for country ${countryCode}`);
    }
    const data = await res.json();
    const items = data.items || [];

    return items.map((item: any) => ({
      ...item,
      isRealShorts: isShortsDuration(item.contentDetails?.duration),
    }));
  }

  const results: Array<{ country: string; success: boolean; error?: string }> = [];
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // 3. Sequential Country-by-Country Scraping with Immediate DB Save per Country
  const targetCountries = ALL_COUNTRIES.map((c: { code: string }) => c.code);

  for (const countryCode of targetCountries) {
    let attempts = 0;
    let success = false;
    let lastErr = "";

    while (attempts < 3) {
      try {
        console.log(`Cron Sequential Scraping start: ${countryCode} (Date: ${date}, Attempt: ${attempts + 1})`);
        const enriched = await fetchCountryTrendingData(countryCode);
        const bundleKey = countryCode === "KR" ? "all" : `${countryCode}_all`;

        // Update master bundle object in memory
        masterBundleObj[bundleKey] = enriched;

        // Save immediately to single bundle DB row after each country
        const { error: saveError } = await supabaseAdmin
          .from("youtube_trending_archive")
          .upsert({
            category_id: "bundle",
            target_date: date,
            videos_data: masterBundleObj,
            updated_at: new Date().toISOString(),
          }, { onConflict: "target_date, category_id" });

        if (saveError) {
          console.error(`Failed to save country ${countryCode} to bundle row:`, saveError.message);
        } else {
          console.log(`Saved country ${countryCode} immediately to single bundle DB row.`);
        }

        success = true;
        results.push({ country: countryCode, success: true });
        break;
      } catch (err: any) {
        lastErr = err.message || String(err);
        attempts++;
        await delay(300);
      }
    }

    if (!success) {
      console.error(`Cron Scraping failed for country ${countryCode} after 3 attempts:`, lastErr);
      results.push({ country: countryCode, success: false, error: lastErr });
    }

    // Short delay between country requests
    await delay(100);
  }

  const successCount = results.filter((r) => r.success).length;
  const totalCount = targetCountries.length;
  console.log(`Vercel Cron Finished: Sequentially scraped ${successCount}/${totalCount} countries successfully.`);

  return NextResponse.json({
    message: "60-country daily cron sync executed sequentially with immediate per-country DB saves into single bundle row.",
    date,
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount,
      cachedCountryKeys: Object.keys(masterBundleObj).length
    },
    details: results,
  });
}
