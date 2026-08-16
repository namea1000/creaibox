import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, recordVaultSuccess, recordVaultFailure } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";

const GLOBAL_POPULAR_CACHE = new Map<string, { data: any; timestamp: number }>();
const GLOBAL_POPULAR_PROMISES = new Map<string, Promise<any>>();

async function getCachedPopularBundle(date: string, force: boolean): Promise<any> {
  if (!force) {
    const cached = GLOBAL_POPULAR_CACHE.get(date);
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 24) {
      return cached.data;
    }
    if (GLOBAL_POPULAR_PROMISES.has(date)) {
      return GLOBAL_POPULAR_PROMISES.get(date);
    }
  }

  const promise = (async () => {
    try {
      let { data: cachedRow } = await supabaseAdmin
        .from("youtube_popular_archive")
        .select("videos_data, target_date")
        .eq("target_date", date)
        .maybeSingle();

      if (!cachedRow || !cachedRow.videos_data) {
        const { data: latestRow } = await supabaseAdmin
          .from("youtube_popular_archive")
          .select("videos_data, target_date")
          .order("target_date", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestRow && latestRow.videos_data) {
          cachedRow = latestRow;
        }
      }

      if (cachedRow) {
        GLOBAL_POPULAR_CACHE.set(date, { data: cachedRow, timestamp: Date.now() });
        return cachedRow;
      }
      return null;
    } catch (e) {
      console.error("popular bundle cache error:", e);
      return null;
    } finally {
      GLOBAL_POPULAR_PROMISES.delete(date);
    }
  })();

  GLOBAL_POPULAR_PROMISES.set(date, promise);
  return promise;
}

export function getKstTodayDate(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().split("T")[0];
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

function getPublishedAfterISO(period: string): string | null {
  const nowMs = Date.now();
  if (period === "1d") {
    const d = new Date(nowMs - 24 * 60 * 60 * 1000);
    return d.toISOString();
  }
  if (period === "7d") {
    const d = new Date(nowMs - 7 * 24 * 60 * 60 * 1000);
    return d.toISOString();
  }
  if (period === "30d") {
    const d = new Date(nowMs - 30 * 24 * 60 * 60 * 1000);
    return d.toISOString();
  }
  return null; // all_time
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const country = searchParams.get("country") || "KR";
  const categoryId = searchParams.get("categoryId") || "all";
  const period = searchParams.get("period") || "all_time"; // '7d', '30d', 'all_time'
  const date = searchParams.get("date") || getKstTodayDate();
  const cacheOnly = searchParams.get("cacheOnly") === "true";
  const force = searchParams.get("force") === "true";
  const referer = req.headers.get("referer") || "https://creaibox.com/";

  // 🚀 Fast Track 1: Return entire Daily Bundle for date pre-warming (0ms RAM Cache)
  if (type === "popular-bundle") {
    try {
      const row = await getCachedPopularBundle(date, force);
      return NextResponse.json({
        date,
        bundle: (row && row.videos_data && typeof row.videos_data === "object") ? row.videos_data : {}
      });
    } catch (err) {
      return NextResponse.json({ date, bundle: {} });
    }
  }

  const bundleKey = `${country}_${categoryId}_${period}`;

  // 1. Try reading from Supabase DB `youtube_popular_archive` Single Daily Bundle Row
  if (!force) {
    try {
      const cachedRow = await getCachedPopularBundle(date, force);

      if (cachedRow && cachedRow.videos_data && typeof cachedRow.videos_data === "object") {
        const bundleObj = cachedRow.videos_data as Record<string, any>;

        // Extract all category lists for this country & period from DB bundle row
        const categoriesBundle: Record<string, any[]> = {};
        Object.entries(bundleObj).forEach(([k, list]) => {
          if (Array.isArray(list)) {
            if (k.startsWith(`${country}_`)) {
              const parts = k.split("_");
              const catId = parts[1]; // e.g. "all", "10", "20", "19"
              const keyPeriod = parts[2] || "all_time";
              if (keyPeriod === period || (!parts[2] && period === "all_time")) {
                categoriesBundle[catId] = list;
              }
            } else if (k === "all" && country === "KR" && period === "all_time") {
              categoriesBundle["all"] = list;
            }
          }
        });

        const cachedVideos = categoriesBundle[categoryId] !== undefined ? categoriesBundle[categoryId] : (bundleObj[bundleKey] || []);
        if (Array.isArray(cachedVideos) && cachedVideos.length > 0) {
          const videoIds = cachedVideos.map((v: any) => v.id).filter(Boolean);
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
          return NextResponse.json({
            source: "supabase-db-popular-bundle",
            data: cachedVideos,
            categoriesBundle,
            analyzedVideoIds,
            servedDate: cachedRow.target_date || date
          });
        }
      }
    } catch (dbReadErr) {
      console.error("Popular DB Cache read failed:", dbReadErr);
    }
  }

  // 2. If DB Cache Miss and cacheOnly is true, return cacheMiss flag in ~50ms
  if (cacheOnly && !force) {
    return NextResponse.json({ cacheMiss: true });
  }

  // 2b. If requested date is in the past and key missed, do NOT fetch live API to overwrite past date!
  const todayStr = getKstTodayDate();
  if (date < todayStr && !force) {
    console.log(`Past date ${date} requested for ${bundleKey} but no DB snapshot exists. Returning empty past date result.`);
    return NextResponse.json({ source: "past-date-miss", data: [], analyzedVideoIds: [] });
  }

  // 3. Live Fetch via YouTube API Vault Key
  let apiKey = "";
  let vaultId: number | null = null;

  try {
    const { data: vaultKeys } = await supabaseAdmin
      .from("admin_api_vault")
      .select("id, key, today_count, daily_limit")
      .eq("provider", "youtube")
      .eq("status", "active")
      .order("priority", { ascending: true })
      .order("today_count", { ascending: true });

    if (vaultKeys && vaultKeys.length > 0) {
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
    console.error("API Key load failed in popular API:", keyErr);
    apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";
  }

  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key not found." }, { status: 500 });
  }

  try {
    const safeReferer = (referer && referer.trim() !== "") ? referer : "https://creaibox.com/";

    // 🚀 Helper to live-fetch 1 category for country
    async function liveFetchCategoryData(catId: string): Promise<any[]> {
      const targetRegionParam = (country === "GLOBAL" || country === "GLOBAL_ALL") ? "" : `&regionCode=${country}`;
      const catParam = catId === "all" ? "" : `&videoCategoryId=${catId}`;
      const publishedAfter = getPublishedAfterISO(period);
      let items: any[] = [];

      if (!publishedAfter) {
        let popUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular${targetRegionParam}${catParam}&maxResults=50&key=${apiKey}`;
        try {
          let pRes = await fetch(popUrl, { headers: { Referer: safeReferer } });
          if (!pRes.ok) pRes = await fetch(popUrl);
          if (pRes.ok) {
            const pData = await pRes.json();
            items = pData.items || [];

            // If "all" category, fetch Page 2 (items 51~100) for TOP 100
            if (catId === "all" && pData.nextPageToken) {
              const p2Url = `${popUrl}&pageToken=${pData.nextPageToken}`;
              try {
                let p2Res = await fetch(p2Url, { headers: { Referer: safeReferer } });
                if (!p2Res.ok) p2Res = await fetch(p2Url);
                if (p2Res.ok) {
                  const p2Data = await p2Res.json();
                  if (p2Data.items && Array.isArray(p2Data.items)) {
                    items = [...items, ...p2Data.items];
                  }
                }
              } catch (e) {}
            }
          }
        } catch (e) {}
      }

      if ((items.length === 0 && period !== "recent_all_time") || period === "all_time") {
        let sUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount${targetRegionParam}${catParam}&maxResults=50&key=${apiKey}`;
        if (publishedAfter) sUrl += `&publishedAfter=${encodeURIComponent(publishedAfter)}`;
        if (period === "all_time" && (catId === "all" || catId === "10")) {
          sUrl += `&q=${encodeURIComponent("official music video|gangnam|despacito|song|mv")}`;
        }
        try {
          let sRes = await fetch(sUrl, { headers: { Referer: safeReferer } });
          if (!sRes.ok) sRes = await fetch(sUrl);
          if (sRes.ok) {
            const sData = await sRes.json();
            const sItems = sData.items || [];
            const vIds = sItems.map((si: any) => si.id?.videoId || si.id).filter((id: any) => typeof id === "string" && id.length === 11).join(",");
            if (vIds) {
              const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${vIds}&key=${apiKey}`;
              let vRes = await fetch(vUrl, { headers: { Referer: safeReferer } });
              if (!vRes.ok) vRes = await fetch(vUrl);
              if (vRes.ok) {
                const vData = await vRes.json();
                if (vData.items && Array.isArray(vData.items)) {
                  const existingIds = new Set(items.map((it: any) => it.id));
                  for (const hit of vData.items) {
                    if (hit && hit.id && !existingIds.has(hit.id)) {
                      items.push(hit);
                    }
                  }
                }
              }
            }
          }
        } catch (e) {}
      }

      const enriched = items.map((item: any) => ({
        ...item,
        isRealShorts: isShortsDuration(item.contentDetails?.duration),
      }));

      enriched.sort((a, b) => {
        const vA = parseInt(a.statistics?.viewCount || "0", 10);
        const vB = parseInt(b.statistics?.viewCount || "0", 10);
        return vB - vA;
      });

      return enriched;
    }

    // 🚀 Execute live-fetch ONLY for the requested category to save API Quota!
    const ALL_CAT_IDS = [categoryId];
    const categoriesBundle: Record<string, any[]> = {};

    // 1. Fetch requested category and all core categories in parallel
    const fetchedResults = await Promise.all(
      ALL_CAT_IDS.map(async (cId) => {
        const data = await liveFetchCategoryData(cId);
        return { cId, data };
      })
    );

    let currentBundle: Record<string, any> = {};
    try {
      const { data: latestRow } = await supabaseAdmin
        .from("youtube_popular_archive")
        .select("videos_data")
        .eq("target_date", date)
        .maybeSingle();

      if (latestRow && latestRow.videos_data && typeof latestRow.videos_data === "object") {
        currentBundle = latestRow.videos_data as Record<string, any>;
      }
    } catch (e) {}

    fetchedResults.forEach(({ cId, data }) => {
      if (data && data.length > 0) {
        categoriesBundle[cId] = data;
        const bKey = `${country}_${cId}_${period}`;
        currentBundle[bKey] = data;
      }
    });

    if (vaultId !== null) {
      await recordVaultSuccess(vaultId);
    }

    // 2. Save full country bundle immediately to single DB row
    if (Object.keys(categoriesBundle).length > 0) {
      try {
        await supabaseAdmin.from("youtube_popular_archive").upsert(
          {
            target_date: date,
            videos_data: currentBundle,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "target_date" }
        );
        console.log(`Live On-Demand Bundle: Saved all categories for ${country}_${period} to DB row ${date}.`);
      } catch (upsertErr) {
        console.error("Failed to upsert Live On-Demand Bundle to DB:", upsertErr);
      }
    }

    const targetList = categoriesBundle[categoryId] !== undefined ? categoriesBundle[categoryId] : (categoriesBundle["all"] || []);
    const videoIds = targetList.map((v: any) => v.id).filter(Boolean);
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

    return NextResponse.json({
      source: "youtube-api-popular-bundle",
      data: targetList,
      categoriesBundle,
      analyzedVideoIds
    });
  } catch (err: any) {
    console.error("Popular API error:", err);
    if (vaultId !== null) {
      await recordVaultFailure(vaultId, err.message || String(err));
    }
    return NextResponse.json({ error: err.message || "Failed to fetch popular videos" }, { status: 500 });
  }
}
