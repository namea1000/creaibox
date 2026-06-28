import { NextRequest, NextResponse } from "next/server";
import { fetchAndCacheTrending, getKstTodayDate } from "@/app/api/youtube/route";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

// Target 8 categories to collect for CreAibox Studio
const TARGET_CATEGORIES = ["all", "10", "20", "24", "1", "28", "17", "25"];

export async function GET(req: NextRequest) {
  // 1. Verify Vercel Cron authorization header
  const authHeader = req.headers.get("authorization");
  
  if (process.env.NODE_ENV === "production") {
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized Vercel Cron Trigger Attempt blocked.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  console.log("Vercel Cron Triggered: Starting YouTube Trending Daily Archive Scraper.");

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

  const results: Array<{ categoryId: string; success: boolean; error?: string }> = [];

  // 2. Sequentially scrap each category to prevent connection threshold / Google API rate limits
  for (const catId of TARGET_CATEGORIES) {
    try {
      console.log(`Cron Scraping start for category: ${catId} (Date: ${date})`);
      await fetchAndCacheTrending(catId, date, "https://creaibox.com/");
      results.push({ categoryId: catId, success: true });
      console.log(`Cron Scraping success for category: ${catId}`);
    } catch (err: any) {
      const errMsg = err.message || String(err);
      console.error(`Cron Scraping failed for category ${catId}:`, errMsg);
      results.push({ categoryId: catId, success: false, error: errMsg });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(`Vercel Cron Finished: Scraped ${successCount}/${TARGET_CATEGORIES.length} categories successfully.`);

  return NextResponse.json({
    message: "Cron sync executed successfully.",
    date,
    summary: {
      total: TARGET_CATEGORIES.length,
      success: successCount,
      failed: TARGET_CATEGORIES.length - successCount,
    },
    details: results,
  });
}
