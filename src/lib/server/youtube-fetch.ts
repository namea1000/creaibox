import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

function getKstTodayDateStr(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);
  return kstNow.toISOString().split("T")[0];
}

export async function getServerTrendingBundle(date?: string) {
  const targetDate = date || getKstTodayDateStr();
  try {
    const { data: rows } = await supabaseAdmin
      .from("youtube_trending_archive")
      .select("category_id, videos_data")
      .eq("target_date", targetDate);

    if (rows && rows.length > 0) {
      const bundleObj: Record<string, any[]> = {};
      for (const r of rows) {
        if (r.category_id === "bundle" && r.videos_data && typeof r.videos_data === "object" && !Array.isArray(r.videos_data)) {
          Object.assign(bundleObj, r.videos_data);
        } else if (Array.isArray(r.videos_data)) {
          bundleObj[r.category_id] = r.videos_data;
        }
      }
      return bundleObj;
    }
  } catch (err) {
    console.error("getServerTrendingBundle fetch error:", err);
  }
  return {};
}

export async function getServerRecentReports(type: string = "trending") {
  try {
    let dbQuery = supabaseAdmin
      .from("youtube_video_analysis")
      .select("video_id, analysis_content, video_metadata, report_type, created_at");

    if (type === "channel") {
      dbQuery = dbQuery.eq("report_type", "channel");
    } else {
      dbQuery = dbQuery.or("report_type.eq.trending,report_type.eq.popular,report_type.is.null");
    }

    const { data: analyses, error: analysisError } = await dbQuery.order("created_at", { ascending: false }).limit(30);

    if (analysisError || !analyses || analyses.length === 0) {
      return [];
    }

    const { data: archives } = await supabaseAdmin
      .from("youtube_trending_archive")
      .select("videos_data")
      .order("target_date", { ascending: false })
      .limit(100);

    const videoMap = new Map<string, any>();
    if (archives) {
      for (const archive of archives) {
        const vData = archive.videos_data;
        if (Array.isArray(vData)) {
          for (const v of vData) {
            if (v && v.id) videoMap.set(v.id, v);
          }
        } else if (vData && typeof vData === "object") {
          Object.values(vData).forEach((list: any) => {
            if (Array.isArray(list)) {
              for (const v of list) {
                if (v && v.id) videoMap.set(v.id, v);
              }
            }
          });
        }
      }
    }

    const mergedList = analyses.map((analysis) => {
      const videoId = analysis.video_id;
      const dbMeta = (analysis as any).video_metadata;
      const matchedVideo = dbMeta || videoMap.get(videoId);

      let country = matchedVideo?.country || matchedVideo?.snippet?.country || "";
      if (!country) {
        const title = matchedVideo?.snippet?.title || matchedVideo?.title || "";
        const countryMatch = title.match(/^\[([A-Z]{2})\]/);
        if (countryMatch) {
          country = countryMatch[1];
        } else {
          const channelTitle = matchedVideo?.snippet?.channelTitle || matchedVideo?.channelTitle || "";
          if (channelTitle.startsWith("US ")) country = "US";
          else if (channelTitle.startsWith("JP ")) country = "JP";
          else if (channelTitle.startsWith("GB ")) country = "GB";
          else if (channelTitle.startsWith("VN ")) country = "VN";
          else if (channelTitle.startsWith("IN ")) country = "IN";
          else if (channelTitle.startsWith("BR ")) country = "BR";
          else if (channelTitle.startsWith("CA ")) country = "CA";
          else country = "KR";
        }
      }

      return {
        id: videoId,
        video_id: videoId,
        report_type: analysis.report_type || "trending",
        source: analysis.report_type || "trending",
        created_at: analysis.created_at,
        analysis_content: analysis.analysis_content,
        country: country || "KR",
        title: matchedVideo?.snippet?.title || matchedVideo?.title || `분석된 비디오 (${videoId})`,
        channelTitle: matchedVideo?.snippet?.channelTitle || matchedVideo?.channelTitle || "-",
        thumbnail: matchedVideo?.snippet?.thumbnails?.medium?.url || matchedVideo?.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        snippet: matchedVideo?.snippet || {
          title: matchedVideo?.title || `분석된 비디오 (${videoId})`,
          channelTitle: matchedVideo?.channelTitle || "-",
          thumbnails: {
            medium: { url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` },
          },
        },
      };
    });

    return mergedList;
  } catch (err) {
    console.error("getServerRecentReports fetch error:", err);
    return [];
  }
}
