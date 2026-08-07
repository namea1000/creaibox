import { NextRequest, NextResponse } from "next/server";
import { getKstTodayDate, isShortsDuration } from "@/app/api/youtube/route";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";

const TARGET_COUNTRIES = [
  { code: "KR", name: "대한민국" },
  { code: "US", name: "미국" },
  { code: "JP", name: "일본" },
  { code: "GB", name: "영국" },
  { code: "DE", name: "독일" },
  { code: "FR", name: "프랑스" },
  { code: "CA", name: "캐나다" },
  { code: "ES", name: "스페인" },
  { code: "AU", name: "호주" },
  { code: "BR", name: "브라질" },
  { code: "IN", name: "인도" },
  { code: "TH", name: "태국" },
];

// Exact 13 UI categories: all + 12 categories
const CORE_CATEGORY_IDS = [
  "all", // 전체
  "10",  // 음악/댄스/가수
  "20",  // 게임
  "24",  // 엔터테인먼트/방송
  "23",  // 코미디/유머
  "1",   // 영화/만화/애니
  "26",  // 음식/요리/뷰티
  "25",  // 뉴스/정치/경제
  "22",  // 취미/일상
  "28",  // IT/기술/컴퓨터
  "15",  // 애완/반려동물
  "17",  // 스포츠/운동
  "2"    // 자동차
];

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
            try {
              const rawKey = decryptApiKey(vault.key);
              if (rawKey && rawKey.trim() !== "") {
                apiKey = rawKey;
                break;
              }
            } catch (decErr) {
              console.error("Vault Key Decrypt Error:", decErr);
            }
          }
        }
      }
    } catch (e) {}

    if (!apiKey) {
      apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";
    }

    if (!apiKey) {
      throw new Error("가용한 YouTube API 키가 존재하지 않습니다.");
    }

    const catParam = categoryId === "all" ? "" : `&videoCategoryId=${categoryId}`;
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${countryCode}${catParam}&maxResults=25&key=${apiKey}`;
    const safeReferer = req.headers.get("referer") || "http://localhost:3000/";
    const res = await fetch(url, { headers: { Referer: safeReferer } });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`YouTube API returned HTTP ${res.status}: ${errBody}`);
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

  const targetCountries = TARGET_COUNTRIES.map((c: { code: string }) => c.code);
  const coreCategoryIds = CORE_CATEGORY_IDS;

  // 3. Smart 2-Phase Scraping: Phase 1 (Fetch 'all' 100 items & auto-subcategorize) -> Phase 2 (Pinpoint fetch missing categories)
  const categoryListExceptAll = CORE_CATEGORY_IDS.filter((c) => c !== "all");

  for (const countryCode of targetCountries) {
    // ----------------------------------------------------
    // Phase 1: Fetch 100 items of 'all' feed for country
    // ----------------------------------------------------
    const allBundleKey = countryCode === "KR" ? "all" : `${countryCode}_all`;
    let allItems: any[] = [];
    try {
      allItems = await fetchTrendingData(countryCode, "all");
      if (allItems.length > 0) {
        masterBundleObj[allBundleKey] = allItems;
        results.push({ key: allBundleKey, success: true });

        // Auto-subcategorize all 14 categories in-memory (0 extra API calls!)
        categoryListExceptAll.forEach((catId) => {
          const subKey = countryCode === "KR" ? catId : `${countryCode}_${catId}`;
          const catFiltered = allItems.filter(
            (v: any) => v.snippet?.categoryId === catId || v.categoryId === catId
          );
          if (catFiltered.length > 0) {
            masterBundleObj[subKey] = catFiltered;
          }
        });
      }
    } catch (err: any) {
      results.push({ key: allBundleKey, success: false, error: err.message || String(err) });
    }

    // ----------------------------------------------------
    // Phase 2: Pinpoint fetch ONLY categories with < 5 items
    // ----------------------------------------------------
    for (const catId of categoryListExceptAll) {
      const subKey = countryCode === "KR" ? catId : `${countryCode}_${catId}`;
      const currentItems = masterBundleObj[subKey] || [];

      if (currentItems.length < 20) {
        try {
          const fetched = await fetchTrendingData(countryCode, catId);
          if (fetched.length > 0) {
            // Merge & deduplicate
            const existingIds = new Set(currentItems.map((v) => v.id));
            const merged = [...currentItems];
            fetched.forEach((v) => {
              if (v.id && !existingIds.has(v.id)) {
                existingIds.add(v.id);
                merged.push(v);
              }
            });
            masterBundleObj[subKey] = merged;
            results.push({ key: subKey, success: true });
          }
        } catch (subErr: any) {
          results.push({ key: subKey, success: false, error: subErr.message || String(subErr) });
        }
      }
    }

    // Save DB after each country completes sequentially
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
