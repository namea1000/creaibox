import { NextRequest, NextResponse } from "next/server";
import { fetchAndCacheTrending, getKstTodayDate } from "@/app/api/youtube/route";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { ALL_COUNTRIES } from "@/app/studio/youtube/[section]/components/RisingVideos";

export async function GET(req: NextRequest) {
  // 1. Verify Vercel Cron authorization header
  const authHeader = req.headers.get("authorization");
  
  if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized Vercel Cron Trigger Attempt blocked.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  console.log("Vercel Cron Triggered: Starting 60-Country YouTube Daily Trending Archive Scraper.");

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

  const results: Array<{ country: string; categoryId: string; success: boolean; error?: string }> = [];
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // 2. Parallel chunked scraping with 3x retry mechanism for 100% reliable collection
  const targetCountries = ALL_COUNTRIES.map((c: { code: string }) => c.code);
  const chunkSize = 10;

  for (let i = 0; i < targetCountries.length; i += chunkSize) {
    const chunk = targetCountries.slice(i, i + chunkSize);
    const promises = chunk.map(async (countryCode) => {
      let attempts = 0;
      let lastErr = "";
      while (attempts < 3) {
        try {
          console.log(`Cron Scraping start for country: ${countryCode} (Date: ${date}, Attempt: ${attempts + 1})`);
          await fetchAndCacheTrending("all", date, "https://creaibox.com/", countryCode);
          return { country: countryCode, categoryId: "all", success: true };
        } catch (err: any) {
          lastErr = err.message || String(err);
          attempts++;
          await delay(200);
        }
      }
      console.error(`Cron Scraping failed for country ${countryCode} after 3 attempts:`, lastErr);
      return { country: countryCode, categoryId: "all", success: false, error: lastErr };
    });

    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
    await delay(100);
  }

  const successCount = results.filter((r) => r.success).length;
  const totalCount = targetCountries.length;
  console.log(`Vercel Cron Finished: Scraped ${successCount}/${totalCount} countries successfully.`);

  return NextResponse.json({
    message: "60-country daily cron sync executed successfully.",
    date,
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount,
    },
    details: results,
  });
}
