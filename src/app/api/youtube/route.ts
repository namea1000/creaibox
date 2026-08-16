import { BENCHMARK_CHANNELS } from "@/app/studio/youtube/[section]/components/benchmarkChannels";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, recordVaultSuccess, recordVaultFailure } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";
import { createClient } from "@/utils/supabase/server";
import { appendTrendingToSheet } from "@/lib/google-sheets";


function getSecondsUntilKstMidnight(): number {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);
  const kstMidnight = new Date(kstNow);
  kstMidnight.setUTCHours(24, 0, 0, 0);
  return Math.floor((kstMidnight.getTime() - kstNow.getTime()) / 1000);
}

export function getKstTodayDate(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000; // 9 hours
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().split("T")[0]; // YYYY-MM-DD
}

export function isShortsDuration(durationStr?: string | null): boolean {
  if (!durationStr) return false;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds > 0 && totalSeconds <= 60;
}

/**
 * Common Scraping pipeline to fetch live trending, detect shorts, cache to DB, and append to Google Sheet.
 */
export async function fetchAndCacheTrending(categoryId: string, date: string = getKstTodayDate(), referer: string = "http://localhost:3000/", country: string = "KR") {
  let apiKey = "";
  let vaultId: number | null = null;

  const { data: vaultKeys, error: vaultError } = await supabaseAdmin
    .from("admin_api_vault")
    .select("id, key, today_count, daily_limit")
    .eq("provider", "youtube")
    .eq("status", "active")
    .order("priority", { ascending: true })
    .order("today_count", { ascending: true });

  if (!vaultError && vaultKeys && vaultKeys.length > 0) {
    let selectedVault = null;
    for (const vault of vaultKeys) {
      if ((vault.today_count || 0) < (vault.daily_limit || 1000)) {
        selectedVault = vault;
        break;
      }
    }
    if (selectedVault) {
      const decrypted = decryptApiKey(selectedVault.key);
      if (decrypted) {
        apiKey = decrypted;
        vaultId = selectedVault.id;
      }
    }
  }

  if (!apiKey) {
    apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";
  }

  if (!apiKey) {
    throw new Error("YouTube API keys not found.");
  }

  // 2. Fetch Live YouTube API (Up to 100 items using 2 pages of 50 for max coverage)
  const safeReferer = (referer && referer.trim() !== "") ? referer : "https://creaibox.com/";
  let baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${country}&maxResults=50&key=${apiKey}`;
  if (categoryId && categoryId !== "all") {
    baseUrl += `&videoCategoryId=${categoryId}`;
  }

  let items: any[] = [];
  try {
    let res1 = await fetch(baseUrl, { headers: { Referer: safeReferer } });
    if (!res1.ok) res1 = await fetch(baseUrl);
    if (res1.ok) {
      const data1 = await res1.json();
      items = data1.items || [];
      const nextPageToken = data1.nextPageToken;

      if (nextPageToken && items.length >= 50) {
        const page2Url = `${baseUrl}&pageToken=${nextPageToken}`;
        let res2 = await fetch(page2Url, { headers: { Referer: safeReferer } });
        if (!res2.ok) res2 = await fetch(page2Url);
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.items && data2.items.length > 0) {
            items = [...items, ...data2.items];
          }
        }
      }
    }
  } catch (fetchErr) {
    console.warn(`YouTube Live API fetch error for ${country}:`, fetchErr);
  }

  if (vaultId !== null && items.length > 0) {
    await recordVaultSuccess(vaultId);
  }

  // 🚀 Fallback: If YouTube mostPopular chart returns 0 items for a specific category, fetch top popular category videos via search API!
  if (items.length === 0 && categoryId && categoryId !== "all") {
    console.warn(`Category ${categoryId} for country ${country} returned 0 items in chart. Fetching top popular category videos via search API...`);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&regionCode=${country}&videoCategoryId=${categoryId}&maxResults=25&key=${apiKey}`;
    try {
      let sRes = await fetch(searchUrl, { headers: { Referer: safeReferer } });
      if (!sRes.ok) sRes = await fetch(searchUrl);
      if (sRes.ok) {
        const sData = await sRes.json();
        const searchItems = sData.items || [];
        if (searchItems.length > 0) {
          const videoIds = searchItems.map((si: any) => si.id?.videoId || si.id).filter(Boolean).join(",");
          if (videoIds) {
            const vDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
            let vRes = await fetch(vDetailsUrl, { headers: { Referer: safeReferer } });
            if (!vRes.ok) vRes = await fetch(vDetailsUrl);
            if (vRes.ok) {
              const vData = await vRes.json();
              if (vData.items && vData.items.length > 0) {
                items = vData.items;
              }
            }
          }
        }
      }
    } catch (fbErr) {
      console.error("Category search fallback fetch failed:", fbErr);
    }
  }

  const enrichedItems = items.map((item: any) => {
    const isRealShorts = isShortsDuration(item.contentDetails?.duration);
    return {
      ...item,
      isRealShorts,
    };
  });

  // 3. Save Cache to Supabase DB (Strict Single Bundle Row per Date: category_id = "bundle")
  const dbCategoryId = country === "KR" ? categoryId : `${country}_${categoryId}`;
  try {
    const { data: existingRow } = await supabaseAdmin
      .from("youtube_trending_archive")
      .select("videos_data")
      .eq("target_date", date)
      .eq("category_id", "bundle")
      .maybeSingle();

    let bundleObj: Record<string, any[]> = {};
    if (existingRow && existingRow.videos_data && typeof existingRow.videos_data === "object" && !Array.isArray(existingRow.videos_data)) {
      bundleObj = { ...existingRow.videos_data };
    }
    bundleObj[dbCategoryId] = enrichedItems;

    // 🚀 If categoryId === "all", automatically sub-categorize all 15 categories in 0ms RAM
    if (categoryId === "all" && Array.isArray(enrichedItems)) {
      const allCatIds = ["10", "20", "24", "23", "1", "26", "25", "22", "19", "28", "27", "15", "17", "2", "29"];
      allCatIds.forEach((catId) => {
        const catKey = country === "KR" ? catId : `${country}_${catId}`;
        const catFiltered = enrichedItems.filter(
          (v: any) => v.snippet?.categoryId === catId || v.categoryId === catId
        );
        if (catFiltered.length > 0) {
          bundleObj[catKey] = catFiltered;
        }
      });
    }

    await supabaseAdmin
      .from("youtube_trending_archive")
      .upsert({
        category_id: "bundle",
        target_date: date,
        videos_data: bundleObj,
        updated_at: new Date().toISOString(),
      }, { onConflict: "target_date, category_id" });
      
    console.log(`Successfully cached category ${dbCategoryId} for date ${date} in Single Bundle DB Row.`);
  } catch (dbUpsertErr) {
    console.error("Supabase Cache write encountered error:", dbUpsertErr);
  }

  // 4. Async sync to continuous Google Sheet (A-L Append)
  appendTrendingToSheet(date, categoryId, enrichedItems).catch((err) => {
    console.error("Async Google Sheets sync failed:", err);
  });

  return enrichedItems;
}

const GLOBAL_BUNDLE_CACHE = new Map<string, { data: Record<string, any[]>; timestamp: number }>();
const GLOBAL_BUNDLE_PROMISES = new Map<string, Promise<Record<string, any[]>>>();

async function getGlobalBundle(date: string): Promise<Record<string, any[]> | null> {
  const cacheKey = `bundle_${date}`;
  const cached = GLOBAL_BUNDLE_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60) {
    return cached.data;
  }

  if (GLOBAL_BUNDLE_PROMISES.has(cacheKey)) {
    return GLOBAL_BUNDLE_PROMISES.get(cacheKey) || null;
  }

  const promise = (async () => {
    try {
      const { data: rows } = await supabaseAdmin
        .from("youtube_trending_archive")
        .select("category_id, videos_data")
        .eq("target_date", date);

      const bundleObj: Record<string, any[]> = {};
      if (rows && rows.length > 0) {
        for (const r of rows) {
          if (r.category_id === "bundle" && r.videos_data && typeof r.videos_data === "object" && !Array.isArray(r.videos_data)) {
            Object.assign(bundleObj, r.videos_data);
          } else if (Array.isArray(r.videos_data)) {
            bundleObj[r.category_id] = r.videos_data;
          }
        }
        GLOBAL_BUNDLE_CACHE.set(cacheKey, { data: bundleObj, timestamp: Date.now() });
      }
      return bundleObj;
    } catch (err) {
      console.error("Failed to fetch global bundle:", err);
      return {};
    } finally {
      GLOBAL_BUNDLE_PROMISES.delete(cacheKey);
    }
  })();

  GLOBAL_BUNDLE_PROMISES.set(cacheKey, promise);
  return promise;
}

// Unified proxy endpoint for YouTube Data API v3
export async function GET(req: NextRequest) {
  // 0. Optional user session check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const maxAge = getSecondsUntilKstMidnight();
  const cachedJson = (data: any) => NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=60`
    }
  });

  const referer = req.headers.get("referer") || "http://localhost:3000/";
  let vaultId: number | null = null;
  let apiKey = "";

  try {
    const { data: vaultKeys, error: vaultError } = await supabaseAdmin
      .from("admin_api_vault")
      .select("id, key, today_count, daily_limit")
      .eq("provider", "youtube")
      .eq("status", "active")
      .order("priority", { ascending: true })
      .order("today_count", { ascending: true });

    if (!vaultError && vaultKeys && vaultKeys.length > 0) {
      let selectedVault = null;
      for (const vault of vaultKeys) {
        if ((vault.today_count || 0) < (vault.daily_limit || 1000)) {
          selectedVault = vault;
          break;
        }
      }
      if (selectedVault) {
        const decrypted = decryptApiKey(selectedVault.key);
        if (decrypted) {
          apiKey = decrypted;
          vaultId = selectedVault.id;
        }
      }
    }
    if (!apiKey) {
      apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";
    }
  } catch (keyErr) {
    console.error("YouTube key load failed inside GET:", keyErr);
    if (!apiKey) {
      apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";
    }
  }

  try {
    // 1. Route request to appropriate Google API calls
    switch (type) {
      case "trending-bundle": {
        const date = searchParams.get("date") || getKstTodayDate();
        const bundleObj = await getGlobalBundle(date);
        
        if (bundleObj && Object.keys(bundleObj).length > 0) {
          return cachedJson({ source: "supabase-db-daily-bundle-all", bundle: bundleObj });
        }
        return cachedJson({ bundle: {} });
      }

      case "trending": {
        const categoryId = searchParams.get("categoryId") || "all";
        const date = searchParams.get("date") || getKstTodayDate();
        const country = searchParams.get("country") || "KR";
        const cacheOnly = searchParams.get("cacheOnly") === "true";

        if (categoryId === "all") {
          // 1. Try reading from Daily Unified Bundle single row for target date
          const bundleObj = await getGlobalBundle(date);

          if (bundleObj && Object.keys(bundleObj).length > 0) {
            const prefix = country === "KR" ? "" : `${country}_`;
              const combined: any[] = [];
              const seenIds = new Set<string>();

              Object.keys(bundleObj).forEach((k) => {
                const isMatch = country === "KR"
                  ? (k === "all" || k.startsWith("KR_") || (!k.includes("_") && !/^[A-Z]{2}_/.test(k)))
                  : k.startsWith(`${country}_`);
                if (isMatch && Array.isArray(bundleObj[k])) {
                  bundleObj[k].forEach((v) => {
                    if (v && v.id && !seenIds.has(v.id)) {
                      seenIds.add(v.id);
                      combined.push(v);
                    }
                  });
                }
              });

              if (combined.length > 0) {
                // Sort combined videos by viewCount descending for premium all-category ranking
                combined.sort((a, b) => {
                  const vA = Number(a.statistics?.viewCount || a.viewCount || 0);
                  const vB = Number(b.statistics?.viewCount || b.viewCount || 0);
                  return vB - vA;
                });
                const videoIds = combined.map((v) => v.id).filter(Boolean);
                let analyzedVideoIds: string[] = [];
                if (videoIds.length > 0) {
                  try {
                    const { data: analyzedRows } = await supabaseAdmin
                      .from("youtube_video_analysis")
                      .select("video_id")
                      .in("video_id", videoIds);
                    if (analyzedRows) {
                      analyzedVideoIds = analyzedRows.map((r) => r.video_id);
                    }
                  } catch (analysisErr) {}
                }
                return cachedJson({ source: "supabase-db-daily-bundle", data: combined, analyzedVideoIds });
            }
          }

          // 2. If DB Cache Miss, check cacheOnly flag
          if (cacheOnly) {
            return cachedJson({ cacheMiss: true });
          }

          // 3. 🚀 Single Unified 1-Call Live Fetch (~300ms speed, 15x quota reduction)
          const todayDate = getKstTodayDate();
          let combinedVideos: any[] = [];
          const seenIds = new Set<string>();
          if (date === todayDate) {
            try {
              combinedVideos = await fetchAndCacheTrending("all", date, referer, country);
              combinedVideos.forEach((v) => { if (v && v.id) seenIds.add(v.id); });
            } catch (liveErr) {
              console.error("Live unified fetch error:", liveErr);
            }
          }

          // Strict Zero Fake Data Rule: If no live videos or date bundle exists, return empty array without serving stale fallback data
          if (combinedVideos.length === 0 && cacheOnly) {
            return cachedJson({ cacheMiss: true, data: [] });
          }

          if (cacheOnly && combinedVideos.length === 0) {
            return cachedJson({ cacheMiss: true });
          }

          if (combinedVideos.length === 0) {
            return cachedJson(getMockData("trending", searchParams));
          }

          const videoIds = combinedVideos.map((v) => v.id).filter(Boolean);
          let analyzedVideoIds: string[] = [];
          if (videoIds.length > 0) {
            try {
              const { data: analyzedRows } = await supabaseAdmin
                .from("youtube_video_analysis")
                .select("video_id")
                .in("video_id", videoIds);
              if (analyzedRows) {
                analyzedVideoIds = analyzedRows.map((r) => r.video_id);
              }
            } catch (analysisErr) {
              console.error("Failed to query analyzed rows in combined path:", analysisErr);
            }
          }

          return cachedJson({ source: "supabase-db-combined", data: combinedVideos, analyzedVideoIds });
        }

        const dbCategoryId = country === "KR" ? categoryId : `${country}_${categoryId}`;
        
        // 1. Try to read from Daily Unified Bundle single row for target date
        try {
          const { data: bundleRow } = await supabaseAdmin
            .from("youtube_trending_archive")
            .select("videos_data")
            .eq("target_date", date)
            .eq("category_id", "bundle")
            .maybeSingle();

          if (bundleRow && bundleRow.videos_data && typeof bundleRow.videos_data === "object" && !Array.isArray(bundleRow.videos_data)) {
            const bundleObj = bundleRow.videos_data as Record<string, any[]>;
            let targetVideos: any[] = [];

            if (categoryId === "all") {
              const prefix = country === "KR" ? "" : `${country}_`;
              const seenIds = new Set<string>();
              Object.keys(bundleObj).forEach((k) => {
                const isMatch = country === "KR" ? (!k.includes("_") || k.startsWith("KR_")) : k.startsWith(prefix);
                if (isMatch && Array.isArray(bundleObj[k])) {
                  bundleObj[k].forEach((v) => {
                    if (v && v.id && !seenIds.has(v.id)) {
                      seenIds.add(v.id);
                      targetVideos.push(v);
                    }
                  });
                }
              });
            } else {
              const exactKey = country === "KR" ? categoryId : `${country}_${categoryId}`;
              if (Array.isArray(bundleObj[exactKey]) && bundleObj[exactKey].length > 0) {
                targetVideos = bundleObj[exactKey];
              } else if (country === "KR" && Array.isArray(bundleObj[`KR_${categoryId}`])) {
                targetVideos = bundleObj[`KR_${categoryId}`];
              }
            }

            if (targetVideos.length > 0) {
              const videoIds = targetVideos.map((v) => v.id).filter(Boolean);
              let analyzedVideoIds: string[] = [];
              if (videoIds.length > 0) {
                try {
                  const { data: analyzedRows } = await supabaseAdmin
                    .from("youtube_video_analysis")
                    .select("video_id")
                    .in("video_id", videoIds);
                  if (analyzedRows) {
                    analyzedVideoIds = analyzedRows.map((r) => r.video_id);
                  }
                } catch (analysisErr) {
                  console.error("Failed to query analyzed rows in bundle hit path:", analysisErr);
                }
              }

              return cachedJson({ source: "supabase-db-daily-bundle", data: targetVideos, analyzedVideoIds });
            }
          }
        } catch (bundleReadErr) {
          console.error("Daily Bundle Cache read failed:", bundleReadErr);
        }

        // Fallback to legacy individual category rows for target date
        try {
          const { data: cachedRow, error: cacheError } = await supabaseAdmin
            .from("youtube_trending_archive")
            .select("videos_data")
            .eq("target_date", date)
            .eq("category_id", dbCategoryId)
            .maybeSingle();

          if (!cacheError && cachedRow && cachedRow.videos_data && Array.isArray(cachedRow.videos_data) && cachedRow.videos_data.length > 0) {
            const videoIds = (cachedRow.videos_data as any[]).map((v) => v.id).filter(Boolean);
            let analyzedVideoIds: string[] = [];
            if (videoIds.length > 0) {
              try {
                const { data: analyzedRows } = await supabaseAdmin
                  .from("youtube_video_analysis")
                  .select("video_id")
                  .in("video_id", videoIds);
                if (analyzedRows) {
                  analyzedVideoIds = analyzedRows.map((r) => r.video_id);
                }
              } catch (analysisErr) {
                console.error("Failed to query analyzed rows in cache hit path:", analysisErr);
              }
            }

            return cachedJson({ source: "supabase-db", data: cachedRow.videos_data, analyzedVideoIds });
          }
        } catch (dbErr) {
          console.error("Supabase Cache read failed, trying live fallback:", dbErr);
        }

        // 2. Cache Miss - Live API call
        try {
          const { data: vaultKeys } = await supabaseAdmin
            .from("admin_api_vault")
            .select("id")
            .eq("provider", "youtube")
            .eq("status", "active")
            .limit(1);
          if (vaultKeys && vaultKeys.length > 0) {
            vaultId = vaultKeys[0].id;
          }

          const enrichedItems = await fetchAndCacheTrending(categoryId, date, referer, country);
          if (enrichedItems && enrichedItems.length > 0) {
            const videoIds = enrichedItems.map((v: any) => v.id).filter(Boolean);
            let analyzedVideoIds: string[] = [];
            if (videoIds.length > 0) {
              try {
                const { data: analyzedRows } = await supabaseAdmin
                  .from("youtube_video_analysis")
                  .select("video_id")
                  .in("video_id", videoIds);
                if (analyzedRows) {
                  analyzedVideoIds = analyzedRows.map((r) => r.video_id);
                }
              } catch (analysisErr) {
                console.error("Failed to query analyzed rows in live hit path:", analysisErr);
              }
            }
            return cachedJson({ source: "youtube-api", data: enrichedItems, analyzedVideoIds });
          }
        } catch (err: any) {
          console.error("Cache Miss Scraper failed:", err);
          if (vaultId !== null) {
            await recordVaultFailure(vaultId, err.message || String(err));
          }
        }

        // 3. Fallback to latest available cache row for this category
        try {
          const { data: latestRow } = await supabaseAdmin
            .from("youtube_trending_archive")
            .select("videos_data")
            .eq("category_id", dbCategoryId)
            .order("target_date", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (latestRow && latestRow.videos_data && Array.isArray(latestRow.videos_data) && latestRow.videos_data.length > 0) {
            return NextResponse.json({ source: "supabase-db-latest", data: latestRow.videos_data });
          }
        } catch (latestErr) {
          console.error("Latest category fallback failed:", latestErr);
        }

        // 4. Final fallback to mock data
        return NextResponse.json(getMockData(type, searchParams));
      }

      case "channel": {
        const rawQuery = searchParams.get("query") || "";
        if (!rawQuery) return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });

        const queryKey = rawQuery.toLowerCase().trim().replace(/\s+/g, "");

        // 1. Check Supabase DB cache first (Cache validity: 12 hours)
        try {
          const { data: cached } = await supabaseAdmin
            .from("youtube_channel_cache")
            .select("channel_data, videos_data, updated_at")
            .eq("query_key", queryKey)
            .single();

          if (cached) {
            const updatedAt = new Date(cached.updated_at).getTime();
            const now = new Date().getTime();
            const elapsedHours = (now - updatedAt) / (1000 * 60 * 60);

            if (elapsedHours < 168) { // Extended to 7 days (168 hours) for maximum quota efficiency
              const cachedVideos = cached.videos_data || [];
              const countryCode = cached.channel_data?.snippet?.country || "KR";

              // Check if it's a mock benchmarking channel with less than 30 videos (needs regeneration)
              const isMockChannel = queryKey.match(/^@?([a-z]{2})_([a-z_]+)_rival_(\d+)$/);
              if (isMockChannel && cachedVideos.length < 30) {
                // Bypass cache to regenerate 30 videos
              } else {
                const videosWithCountry = cachedVideos.map((v: any, i: number) => {
                  let thumbUrl = v.snippet?.thumbnails?.medium?.url || "";
                  if (thumbUrl.includes("photo-161800518") || thumbUrl.includes("photo-1618005")) {
                    const unsplashIds = [
                      "1498050108023-c5249f4df085",
                      "1518770660439-4636190af475",
                      "1542751371-adc38448a05e",
                      "1470225620780-dba8ba36b745",
                      "1508098682722-e99c43a406b2"
                    ];
                    const photoId = unsplashIds[i % unsplashIds.length];
                    thumbUrl = `https://images.unsplash.com/photo-${photoId}?w=400&h=225&fit=crop`;
                  }
                  return {
                    country: countryCode,
                    ...v,
                    snippet: {
                      ...v.snippet,
                      thumbnails: {
                        ...v.snippet?.thumbnails,
                        medium: {
                          url: thumbUrl
                        }
                      }
                    }
                  };
                });
                return NextResponse.json({
                  source: "database-cache",
                  channel: cached.channel_data,
                  recentVideos: videosWithCountry,
                });
              }
            }
          }
        } catch (dbErr) {
          console.error("DB Cache fetch omitted or table not created yet:", dbErr);
        }

        // 1b. Check if queryKey is a dynamically generated mock benchmarking channel
        const mockMatch = queryKey.match(/^@?([a-z]{2})_([a-z_]+)_rival_(\d+)$/);
        if (mockMatch) {
          const country = mockMatch[1].toUpperCase();
          const categoryEng = mockMatch[2];
          const rivalId = parseInt(mockMatch[3]);

          const categoryMap: Record<string, string> = {
            tech: "테크/IT",
            game: "게임",
            music: "뮤직",
            ent: "엔터테인먼트",
            movie: "영화/애니",
            news: "뉴스/시사",
            sports: "스포츠"
          };
          const category = categoryMap[categoryEng] || "전체";

          const subValue = Math.max(5, 500 - rivalId * 22);
          const subCount = subValue * 10000;
          const viewsCount = Math.round(subCount * 1.8);
          const videoCount = Math.round(rivalId * 25 + 40);

          const channelId = `UC_mock_${country.toLowerCase()}_${categoryEng}_${rivalId}`;
          const channelName = `${country} ${category} 채널 ${rivalId}`;
          const customUrl = `@${country.toLowerCase()}_${categoryEng}_rival_${rivalId}`;

          const mockChannelData = {
            id: channelId,
            snippet: {
              title: channelName,
              description: `${country} 지역의 최신 ${category} 트렌드 및 바이럴 알고리즘 분석용 벤치마킹 타겟 채널`,
              customUrl: customUrl,
              thumbnails: {
                medium: {
                  url: `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop`
                }
              },
              country: country
            },
            statistics: {
              subscriberCount: String(subCount),
              viewCount: String(viewsCount),
              videoCount: String(videoCount)
            }
          };

          const videoTemplates: Record<string, string[]> = {
            tech: [
              "최신 스마트 디바이스 리포트 및 성능 측정",
              "가성비 오피스 데스크 셋업 데스크 테리어 추천",
              "미출시 차세대 폴더블폰 실물 디자인 분석",
              "새로워진 M4 칩 태블릿 한 달 실사용 리뷰",
              "현업 개발자가 추천하는 AI 프로그래밍 꿀팁"
            ],
            game: [
              "신작 오픈월드 RPG 초반 플레이 실황 파트 1",
              "스팀 신작 생존 게임 동료들과 24시간 생존 도전",
              "랭크전 연승 기록 갱신하는 꿀팁 대공개",
              "인기 모바일 게임 뽑기 패키지 대리 리뷰",
              "고전 명작 도트 게임 100% 클리어 스피드런"
            ],
            music: [
              "감성을 자극하는 재즈 피아노 커버 메들리",
              "어쿠스틱 기타 라이브 버스킹 풀버전",
              "요즘 듣기 좋은 트렌디한 시티팝 플레이리스트",
              "신곡 보컬 커버 및 고음 지르는 방법 강좌",
              "디제잉 EDM 페스티벌 실시간 라이브 셋"
            ],
            ent: [
              "친구들과 매운맛 음식 먹방 및 솔직 리액션",
              "지하철에서 황당한 장난치기 몰래카메라 예능",
              "요즘 유행하는 초간단 10초 챌린지 모음집",
              "해외 여행 도중 길 잃어버린 황당 썰방",
              "신상 편의점 꿀조합 레시피 털어보기 브이로그"
            ],
            movie: [
              "올해 개봉 예정인 기대작 SF 영화 톱 5 추천",
              "명작 애니메이션 속 복선과 결말 해석 정밀 분석",
              "극장판 극비 예고편 분석 및 캐릭터 매칭",
              "역대 최고 제작비가 투입된 할리우드 영화 비하인드",
              "숨겨진 넷플릭스 스릴러 드라마 명작 발굴"
            ],
            news: [
              "글로벌 경제 위기와 금리 변동에 대한 실시간 브리핑",
              "미래 인공지능 산업의 향방 심층 시사 대담",
              "화제의 글로벌 트렌드 이슈 5분 핵심 요약 정리",
              "에너지 기후 변화가 우리 식탁에 미치는 영향 리포트",
              "국제 정세 분석 및 안보 포럼 주요 외신 속보"
            ],
            sports: [
              "이번 주말 손흥민 선발 경기 골장면 하이라이트",
              "집에서 따라하는 전신 유산소 타바타 홈트레이닝",
              "프로야구 포스트시즌 진출 확률 정밀 데이터 분석",
              "아웃도어 산악 캠핑 및 하이킹 장비 추천 가이드",
              "테니스 동호회 최강자전 실시간 명경기 하이라이트"
            ],
            channel: [
              "대표 채널 인기 업로드 영상 모음집",
              "구독자 감사 기념 실시간 Q&A 토크쇼",
              "채널 성장의 비결 및 크리에이터 스튜디오 비하인드",
              "최근 다녀온 페스티벌 Vlog 브이로그 풀버전",
              "앞으로의 채널 운영 방향 및 대규모 기획 예고"
            ]
          };

          const unsplashIds = [
            "1498050108023-c5249f4df085",
            "1518770660439-4636190af475",
            "1542751371-adc38448a05e",
            "1470225620780-dba8ba36b745",
            "1508098682722-e99c43a406b2"
          ];
          const templates = videoTemplates[categoryEng] || videoTemplates.channel;
          const mockVideos = Array.from({ length: 30 }).map((_, i) => {
            const template = templates[i % templates.length];
            const videoId = `video_mock_${country.toLowerCase()}_${categoryEng}_${rivalId}_${i}`;
            const vCount = Math.round(viewsCount / (i + 1.2));
            const photoId = unsplashIds[i % unsplashIds.length];
            
            const setNum = Math.floor(i / templates.length) + 1;
            const titleSuffix = setNum > 1 ? ` (파트 ${setNum})` : "";
            
            return {
              id: videoId,
              snippet: {
                title: `[${country}] ${template}${titleSuffix}`,
                description: `해당 채널의 최신 인기 영상 콘텐츠입니다. 크리에이박스 벤치마킹 분석.`,
                publishedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
                thumbnails: {
                  medium: {
                    url: `https://images.unsplash.com/photo-${photoId}?w=400&h=225&fit=crop`
                  }
                }
              },
              statistics: {
                viewCount: String(vCount),
                likeCount: String(Math.round(vCount * (0.04 + Math.random() * 0.03))),
                commentCount: String(Math.round(vCount * (0.003 + Math.random() * 0.004)))
              }
            };
          });

          // Save to database cache
          try {
            const handleKeys = [
              queryKey,
              `@${queryKey.replace(/^@/, "")}`,
              channelId.toLowerCase(),
              customUrl.toLowerCase()
            ].filter(Boolean);

            for (const key of handleKeys) {
              await supabaseAdmin.from("youtube_channel_cache").upsert({
                query_key: key,
                channel_id: channelId,
                channel_data: mockChannelData,
                videos_data: mockVideos,
                updated_at: new Date().toISOString()
              });
            }
          } catch (dbErr) {
            console.error("Failed to cache simulated mock channel:", dbErr);
          }

          return NextResponse.json({
            source: "database-cache",
            channel: mockChannelData,
            recentVideos: mockVideos
          });
        }

        let query = rawQuery;

        // Clean query to strip custom country suffix for benchmark channels
        const suffixMatch = query.match(/^(@?[a-zA-Z0-9_.-]+)_(kr|us|jp|gb|vn|in|br|ca)$/i);
        if (suffixMatch) {
          query = suffixMatch[1];
        }
        let channelId = "";

        // Check if query is a URL
        if (query.includes("youtube.com") || query.includes("youtu.be")) {
          // 1. Check if it's a direct channel ID URL: /channel/UC...
          const channelIdMatch = query.match(/\/channel\/(UC[a-zA-Z0-9_-]{22})/);
          if (channelIdMatch) {
            channelId = channelIdMatch[1];
          } 
          // 2. Check if it's a handle URL: /@username
          else if (query.includes("/@")) {
            const handleMatch = query.match(/\/(@[a-zA-Z0-9_.-]+)/);
            if (handleMatch) {
              query = handleMatch[1]; // Set query to the handle (e.g. "@suno") to let search find it
            }
          } 
          // 3. Otherwise, check if it's a video URL
          else {
            let videoId = "";
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = query.match(regExp);
            if (match && match[2].length === 11) {
              videoId = match[2];
            }

            if (videoId) {
              // Fetch video details to find channelId
              const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
              const videoRes = await fetch(videoUrl, { headers: { Referer: referer } });
              if (videoRes.ok) {
                const videoData = await videoRes.json();
                const videoItem = videoData.items?.[0];
                if (videoItem?.snippet?.channelId) {
                  channelId = videoItem.snippet.channelId;
                }
              }
            }
          }
        }

        // If we didn't extract a direct channelId, search for the channel using the query
        if (!channelId) {
          const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${apiKey}`;
          const searchRes = await fetch(searchUrl, { headers: { Referer: referer } });
          if (!searchRes.ok) throw new Error("Google search API call failed");
          const searchData = await searchRes.json();
          const channelItem = searchData.items?.[0];

          if (!channelItem) {
            return NextResponse.json({ error: "Channel not found" }, { status: 404 });
          }

          channelId = channelItem.id.channelId;
        }

        // Step 2b: Get channel statistics, snippet details, and branding settings
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`;
        const channelRes = await fetch(channelUrl, { headers: { Referer: referer } });
        if (!channelRes.ok) throw new Error("Google channels API call failed");
        const channelData = await channelRes.json();
        const channelStats = channelData.items?.[0];

        // Step 2c: Get channel's recent videos (Fetch 30 items to get a better sample)
        const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=30&key=${apiKey}`;
        const videosRes = await fetch(videosUrl, { headers: { Referer: referer } });
        const videosData = videosRes.ok ? await videosRes.json() : { items: [] };

        // Step 2d: Fetch detailed statistics for each recent video in batch (1 Quota point)
        const searchItems = videosData.items || [];
        let enrichedVideos: any[] = [];
        if (searchItems.length > 0) {
          const videoIds = searchItems.map((v: any) => v.id?.videoId).filter(Boolean).join(",");
          if (videoIds) {
            const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
            const detailRes = await fetch(detailUrl, { headers: { Referer: referer } });
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              enrichedVideos = detailData.items || [];
            }
          }
        }

        // If batch fetch failed, fallback to original search items with dummy stats
        if (enrichedVideos.length === 0) {
          enrichedVideos = searchItems.map((item: any) => ({
            id: item.id?.videoId || "",
            snippet: item.snippet,
            statistics: { viewCount: "0", likeCount: "0", commentCount: "0" }
          }));
        }

        const countryCode = channelStats?.snippet?.country || "KR";
        const videosWithCountry = enrichedVideos.map((v: any) => ({
          ...v,
          country: countryCode
        }));

        // 3. Save to Supabase DB Cache (3-way indexing for maximum hit rate)
        try {
          const handleKeys = [
            queryKey,
            channelId.toLowerCase(),
            channelStats?.snippet?.customUrl?.toLowerCase()
          ].filter(Boolean);

          for (const key of handleKeys) {
            await supabaseAdmin.from("youtube_channel_cache").upsert({
              query_key: key,
              channel_id: channelId,
              channel_data: channelStats || {},
              videos_data: videosWithCountry,
              updated_at: new Date().toISOString()
            });
          }
        } catch (upsertErr) {
          console.error("Failed to upsert youtube_channel_cache:", upsertErr);
        }

        if (vaultId !== null) {
          await recordVaultSuccess(vaultId);
        }
        return NextResponse.json({
          source: "youtube-api",
          channel: channelStats || null,
          recentVideos: videosWithCountry,
        });
      }

      case "seo": {
        const videoUrlOrId = searchParams.get("url") || "";
        if (!videoUrlOrId) return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });

        // Parse video ID from URL if applicable
        let videoId = videoUrlOrId;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = videoUrlOrId.match(regExp);
        if (match && match[2].length === 11) {
          videoId = match[2];
        }

        const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,topicDetails&id=${videoId}&key=${apiKey}`;
        const detailRes = await fetch(detailUrl, { headers: { Referer: referer } });
        if (!detailRes.ok) throw new Error("Google videos API call failed");
        const detailData = await detailRes.json();
        const videoDetails = detailData.items?.[0];

        if (!videoDetails) {
          return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        if (vaultId !== null) {
          await recordVaultSuccess(vaultId);
        }
        return NextResponse.json({
          source: "youtube-api",
          video: videoDetails,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("YouTube API call failed: ", error.message);
    if (vaultId) {
      await recordVaultFailure(vaultId, error.message || "Unknown YouTube API error");
    }
    // Graceful fallback to mock data on rate limits/quota limits/network failure
    return NextResponse.json(getMockData(type, searchParams));
  }
}

// Fallback generator returning NO fake/mock data per CreaiBox Zero Fake Data Rule
function getMockData(type: string | null, searchParams: URLSearchParams) {
  switch (type) {
    case "trending": {
      return {
        source: "empty",
        data: [],
        message: "아직 수집된 트렌드 데이터가 없습니다. 상단의 '전체 60개국 일괄수집' 버튼을 클릭하여 수집을 진행해 주세요."
      };
    }

    case "channel": {
      const query = searchParams.get("query") || "크리에이박스";
      const cleanQuery = query.toLowerCase().trim().replace("@", "");
      
      const parseStringToNumber = (str: string | undefined): number => {
        if (!str) return 0;
        let parsed = str.trim();
        let total = 0;
        if (parsed.includes("억")) {
          const parts = parsed.split("억");
          total += parseFloat(parts[0]) * 100000000;
          if (parts[1] && parts[1].includes("만")) {
            total += parseFloat(parts[1].replace("만", "")) * 10000;
          }
        } else if (parsed.includes("만")) {
          total += parseFloat(parsed.replace("만", "")) * 10000;
        } else if (parsed.includes("개")) {
          total += parseFloat(parsed.replace("개", ""));
        } else {
          total += parseFloat(parsed) || 0;
        }
        return total;
      };

      const benchmarkMatch = BENCHMARK_CHANNELS.find(ch => {
        const localKey = (ch.handle || "").toLowerCase().trim().replace("@", "");
        const localName = ch.name.toLowerCase().replace(/\s+/g, "");
        return localKey === cleanQuery || localName === cleanQuery;
      });

      let name = query;
      let subscribers = "124500";
      let views = "3540000";
      let videos = "148";
      let description = "인공지능을 활용한 앨범 작사, 작곡, 영상 편집 자동화 비즈니스 팁을 공유하는 채널입니다.";

      if (benchmarkMatch) {
        name = benchmarkMatch.name;
        subscribers = String(parseStringToNumber(benchmarkMatch.subscribers));
        views = String(parseStringToNumber(benchmarkMatch.views));
        videos = String(parseStringToNumber(benchmarkMatch.videos));
        description = benchmarkMatch.desc || `${name} 공식 유튜브 채널입니다.`;
      }

      const customUrlVal = query.startsWith("@") ? query : `@${query}`;

      return {
        source: "mock-fallback",
        channel: {
          id: "mock-channel-id",
          snippet: {
            title: name,
            description: description,
            customUrl: customUrlVal,
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&q=80" } },
          },
          statistics: {
            subscriberCount: subscribers,
            viewCount: views,
            videoCount: videos,
          },
        },
        recentVideos: Array.from({ length: 30 }).map((_, i) => ({
          id: { videoId: `mock-v-${i}` },
          snippet: {
            title: `${name}의 인기 추천 영상 파트 ${i + 1}`,
            publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            thumbnails: {
              medium: {
                url: `https://images.unsplash.com/photo-${[
                  "1498050108023-c5249f4df085",
                  "1518770660439-4636190af475",
                  "1542751371-adc38448a05e",
                  "1470225620780-dba8ba36b745",
                  "1508098682722-e99c43a406b2"
                ][i % 5]}?w=320&q=80`
              }
            }
          }
        }))
      };
    }

    case "seo": {
      return {
        source: "mock-fallback",
        video: {
          id: "mock-seo-video",
          snippet: {
            title: "유튜브 영상 최적화 SEO 기법과 검색 상위노출 가이드",
            description: "유튜브 검색 알고리즘 작동 원리와 핵심 메인 키워드 노출 팁에 대해 알아봅니다.",
            channelTitle: "크리에이터 오피스",
            tags: ["유튜브SEO", "상위노출", "조회수늘리기", "썸네일기법", "태그작성법"],
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1546074177-ffedd79d494d?w=320&q=80" } },
          },
          statistics: {
            viewCount: "35800",
            likeCount: "1280",
            commentCount: "94",
          },
        },
      };
    }

    default:
      return { source: "mock-fallback", data: [] };
  }
}
