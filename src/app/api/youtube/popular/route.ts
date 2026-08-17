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

export function isShortsDuration(durationStr?: string | null, item?: any): boolean {
  if (!durationStr) return false;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  if (totalSeconds <= 0 || totalSeconds > 180) return false;

  const title = (item?.snippet?.title || item?.title || "").toLowerCase();
  const description = (item?.snippet?.description || item?.description || "").toLowerCase();
  const channel = (item?.snippet?.channelTitle || item?.channelTitle || "").toLowerCase();

  const hasShortsKeyword = 
    title.includes("#shorts") || 
    title.includes("#short") || 
    title.includes("shorts") || 
    title.includes("쇼츠") || 
    title.includes("#숏") ||
    title.includes("#shortvideo") ||
    title.includes("#shortsfeed") ||
    description.includes("#shorts") || 
    description.includes("#short") || 
    description.includes("쇼츠");

  const isTopicChannel = channel.includes("- topic") || channel.includes("- 주제") || channel.endsWith("topic") || channel.endsWith("주제");
  const isOfficialArtist = (channel.includes("official") || channel.includes("공식")) && (title.includes(" - ") || title.includes(" – "));
  
  const isMv = 
    title.includes("music video") ||
    title.includes("official video") ||
    title.includes("video oficial") ||
    title.includes("clip oficial") ||
    title.includes("lyric video") ||
    title.includes("official audio") ||
    title.includes("official song") ||
    title.includes("official track") ||
    title.includes("song") ||
    title.includes(" mv") || 
    title.includes("mv ") || 
    title.includes("[mv]") || 
    title.includes("(mv)") || 
    title.includes("'mv'") || 
    title.includes('"mv"') || 
    title.endsWith("mv") ||
    title.includes("m/v") || 
    title.includes("뮤직비디오") || 
    title.includes("뮤비") || 
    title.includes("visualizer") || 
    title.includes("audio") || 
    title.includes("음원");

  const isAnimationOrCinematic = 
    title.includes("animation") || 
    title.includes("animated") || 
    title.includes("cinematic") || 
    title.includes("애니메이션") || 
    title.includes("origin story") || 
    title.includes("short film") || 
    title.includes("단편영화");

  const isNewsOrBroadcast = 
    title.includes("news") || 
    title.includes("뉴스") || 
    title.includes("interview") || 
    title.includes("인터뷰") || 
    channel.includes("news") || 
    channel.includes("뉴스") || 
    title.includes("episode") || 
    title.includes("ep.") || 
    title.includes("에피소드");

  const isLiveOrStage = 
    title.includes("live clip") || 
    title.includes("라이브") || 
    title.includes("on the spot") || 
    title.includes("온더스팟") || 
    title.includes("stage") || 
    title.includes("스페셜") || 
    title.includes("special clip") || 
    title.includes("performance video") || 
    title.includes("퍼포먼스");

  const isTeaserOrTrailer = 
    title.includes("예고편") || 
    title.includes("teaser") || 
    title.includes("trailer") || 
    title.includes("풀버전") || 
    title.includes("full ver") || 
    title.includes("풀영상") || 
    title.includes("하이라이트") || 
    title.includes("highlight");

  const isExplicitLongform = (isTopicChannel || isOfficialArtist || isMv || isAnimationOrCinematic || isNewsOrBroadcast || isLiveOrStage || isTeaserOrTrailer) && !hasShortsKeyword;

  if (isExplicitLongform) return false;
  return true;
}

function getPublishedAfterISO(period: string): string | null {
  const nowMs = Date.now();
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
  const period = searchParams.get("period") || "all_time"; // 'all_time', '30d'
  const date = searchParams.get("date") || getKstTodayDate();
  const cacheOnly = searchParams.get("cacheOnly") === "true";
  const force = searchParams.get("force") === "true";
  const referer = req.headers.get("referer") || "https://creaibox.com/";

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

  const ALL_CORE_CAT_IDS = ["10", "27", "24", "20", "23", "1", "26", "19", "25", "22", "28", "15", "17", "2"];
  const bundleKey = `${country}_${categoryId}_${period}`;

  if (!force) {
    try {
      const cachedRow = await getCachedPopularBundle(date, force);

      if (cachedRow && cachedRow.videos_data && typeof cachedRow.videos_data === "object") {
        const bundleObj = cachedRow.videos_data as Record<string, any>;
        
        const categoriesBundle: Record<string, any[]> = {};
        let hasCoreData = true;

        ALL_CORE_CAT_IDS.forEach((cId) => {
          const k = `${country}_${cId}_${period}`;
          if (Array.isArray(bundleObj[k]) && bundleObj[k].length > 0) {
            categoriesBundle[cId] = bundleObj[k];
          } else {
            hasCoreData = false;
          }
        });

        const allKey = `${country}_all_${period}`;
        if (Array.isArray(bundleObj[allKey]) && bundleObj[allKey].length > 0) {
          categoriesBundle["all"] = bundleObj[allKey];
        } else if (hasCoreData) {
          const allVideosMap = new Map<string, any>();
          Object.values(categoriesBundle).forEach((list) => {
            list.forEach((v) => {
              if (v?.id && !allVideosMap.has(v.id)) {
                allVideosMap.set(v.id, v);
              }
            });
          });
          const unified = Array.from(allVideosMap.values());
          unified.sort((a, b) => {
            const vA = parseInt(a.statistics?.viewCount || "0", 10);
            const vB = parseInt(b.statistics?.viewCount || "0", 10);
            return vB - vA;
          });
          categoriesBundle["all"] = unified.slice(0, 100);
        }

        const targetData = categoriesBundle[categoryId] || (categoryId === "all" ? categoriesBundle["all"] : null);

        if (Array.isArray(targetData) && targetData.length > 0) {
          const videoIds = targetData.map((v: any) => v.id).filter(Boolean);
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
            data: targetData,
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

  const todayStr = getKstTodayDate();
  if (date < todayStr && !force) {
    return NextResponse.json({ source: "past-date-miss", data: [], analyzedVideoIds: [] });
  }

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

    async function liveFetchCategoryData(catId: string): Promise<any[]> {
      const isGlobal = country === "GLOBAL" || country === "GLOBAL_ALL";
      const targetRegionParam = isGlobal ? "" : `&regionCode=${country}`;
      const catParam = `&videoCategoryId=${catId}`;
      const publishedAfter = getPublishedAfterISO(period);
      const pubParam = publishedAfter ? `&publishedAfter=${encodeURIComponent(publishedAfter)}` : "";

      let videoIdSet = new Set<string>();

      let qLong = "";
      let qShort = "";
      if (period === "all_time") {
        if (catId === "27") {
          qLong = isGlobal ? "baby shark|cocomelon|kids song|nursery rhymes|education" : "아기상어|동요|코코멜론|키즈|어린이";
          qShort = isGlobal ? "kids #shorts|nursery rhymes #shorts" : "키즈 쇼츠|동요 쇼츠";
        } else if (catId === "10") {
          qLong = isGlobal ? "official video|music video|mv|gangnam style|song" : "MV|뮤직비디오|싸이|강남스타일|BTS|블랙핑크|노래";
          qShort = "#shorts|shorts";
        } else if (catId === "19") {
          qLong = isGlobal ? "travel guide|explore|tour|visit" : "여행|투어|관광|명소";
          qShort = "#shorts|shorts";
        } else if (isGlobal) {
          qLong = "official video|music video|mv|song";
          qShort = "#shorts|shorts";
        } else if (country === "KR") {
          qLong = "MV|뮤직비디오|공식|노래";
          qShort = "#shorts|쇼츠";
        } else {
          qLong = "official|music|video|song";
          qShort = "#shorts|shorts";
        }
      }

      const qLongParam = qLong ? `&q=${encodeURIComponent(qLong)}` : "";
      const qShortParam = qShort ? `&q=${encodeURIComponent(qShort)}` : "";

      try {
        const sLongUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&videoDuration=medium${targetRegionParam}${catParam}${pubParam}${qLongParam}&maxResults=50&key=${apiKey}`;
        let res = await fetch(sLongUrl, { headers: { Referer: safeReferer } });
        if (!res.ok) res = await fetch(sLongUrl);
        if (res.ok) {
          const sData = await res.json();
          (sData.items || []).forEach((item: any) => {
            const vid = item.id?.videoId || item.id;
            if (typeof vid === "string" && vid.length === 11) videoIdSet.add(vid);
          });
        }
      } catch (e) {
        console.error("Long-form search error:", e);
      }

      try {
        const sShortUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&videoDuration=short${targetRegionParam}${catParam}${pubParam}${qShortParam}&maxResults=50&key=${apiKey}`;
        let res = await fetch(sShortUrl, { headers: { Referer: safeReferer } });
        if (!res.ok) res = await fetch(sShortUrl);
        if (res.ok) {
          const sData = await res.json();
          (sData.items || []).forEach((item: any) => {
            const vid = item.id?.videoId || item.id;
            if (typeof vid === "string" && vid.length === 11) videoIdSet.add(vid);
          });
        }
      } catch (e) {
        console.error("Shorts search error:", e);
      }

      if (videoIdSet.size === 0) {
        try {
          const popUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular${targetRegionParam}${catParam}&maxResults=50&key=${apiKey}`;
          let pRes = await fetch(popUrl, { headers: { Referer: safeReferer } });
          if (!pRes.ok) pRes = await fetch(popUrl);
          if (pRes.ok) {
            const pData = await pRes.json();
            (pData.items || []).forEach((item: any) => {
              if (item?.id) videoIdSet.add(item.id);
            });
          }
        } catch (e) {}
      }

      const allIds = Array.from(videoIdSet);
      if (allIds.length === 0) return [];

      let items: any[] = [];
      for (let i = 0; i < allIds.length; i += 50) {
        const chunk = allIds.slice(i, i + 50).join(",");
        const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${chunk}&key=${apiKey}`;
        try {
          let vRes = await fetch(vUrl, { headers: { Referer: safeReferer } });
          if (!vRes.ok) vRes = await fetch(vUrl);
          if (vRes.ok) {
            const vData = await vRes.json();
            if (vData.items && Array.isArray(vData.items)) {
              items = [...items, ...vData.items];
            }
          }
        } catch (e) {
          console.error("Videos.list batch fetch error:", e);
        }
      }

      const enriched = items.map((item: any) => ({
        ...item,
        isRealShorts: isShortsDuration(item.contentDetails?.duration, item),
      }));

      enriched.sort((a, b) => {
        const vA = parseInt(a.statistics?.viewCount || "0", 10);
        const vB = parseInt(b.statistics?.viewCount || "0", 10);
        return vB - vA;
      });

      return enriched;
    }

    const categoriesBundle: Record<string, any[]> = {};
    const fetchedResults = await Promise.all(
      ALL_CORE_CAT_IDS.map(async (cId) => {
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

    const allVideosMap = new Map<string, any>();

    fetchedResults.forEach(({ cId, data }) => {
      if (data && data.length > 0) {
        categoriesBundle[cId] = data;
        const bKey = `${country}_${cId}_${period}`;
        currentBundle[bKey] = data;

        data.forEach((v) => {
          if (v?.id && !allVideosMap.has(v.id)) {
            allVideosMap.set(v.id, v);
          }
        });
      }
    });

    const unifiedAllList = Array.from(allVideosMap.values());
    unifiedAllList.sort((a, b) => {
      const vA = parseInt(a.statistics?.viewCount || "0", 10);
      const vB = parseInt(b.statistics?.viewCount || "0", 10);
      return vB - vA;
    });

    categoriesBundle["all"] = unifiedAllList.slice(0, 100);
    currentBundle[`${country}_all_${period}`] = categoriesBundle["all"];

    if (vaultId !== null) {
      await recordVaultSuccess(vaultId);
    }

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
        console.log(`Live On-Demand Batch Bundle: Saved all 12 categories for ${country}_${period} to DB row ${date}.`);
      } catch (upsertErr) {
        console.error("Failed to upsert Live On-Demand Bundle to DB:", upsertErr);
      }
    }

    const targetList = categoryId === "all" ? categoriesBundle["all"] : (categoriesBundle[categoryId] || categoriesBundle["all"] || []);
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
      analyzedVideoIds,
      servedDate: date
    });
  } catch (err: any) {
    if (vaultId !== null) {
      await recordVaultFailure(vaultId, err.message || String(err));
    }
    console.error("Popular API error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch popular videos" }, { status: 500 });
  }
}
