import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GLOBAL_REPORTS_CACHE = new Map<string, { data: any; timestamp: number }>();
const GLOBAL_REPORTS_PROMISES = new Map<string, Promise<any>>();

async function getCachedReports(type: string): Promise<any> {
  const cacheKey = type;
  const cached = GLOBAL_REPORTS_CACHE.get(cacheKey);
  // TTL: 15 minutes (1000 * 60 * 15)
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 15) {
    return cached.data;
  }

  if (GLOBAL_REPORTS_PROMISES.has(cacheKey)) {
    return GLOBAL_REPORTS_PROMISES.get(cacheKey);
  }

  const promise = (async () => {
    try {
      // 1. Fetch rows from youtube_video_analysis
      let dbQuery = supabaseAdmin
        .from("youtube_video_analysis")
        .select("video_id, analysis_content, video_metadata, report_type, created_at");

      if (type === "channel") {
        dbQuery = dbQuery.eq("report_type", "channel");
      } else {
        dbQuery = dbQuery.or("report_type.eq.trending,report_type.eq.popular,report_type.is.null");
      }

      const { data: analyses, error: analysisError } = await dbQuery.order("created_at", { ascending: false }).limit(30);

      if (analysisError) {
        throw new Error(analysisError.message);
      }

      if (!analyses || analyses.length === 0) {
        return [];
      }

      // 2. Load latest archive records ONLY if there are missing metadata
      const missingMetadataIds = analyses
        .filter((a) => !(a as any).video_metadata)
        .map((a) => a.video_id);

      const videoMap = new Map<string, any>();

      if (missingMetadataIds.length > 0) {
        const { data: archives } = await supabaseAdmin
          .from("youtube_trending_archive")
          .select("videos_data")
          .order("target_date", { ascending: false })
          .limit(10);

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
      }

      // 3. Merge analysis and video details
      const mergedList = analyses.map((analysis) => {
        const videoId = analysis.video_id;
        const dbMeta = (analysis as any).video_metadata;
        const matchedVideo = dbMeta || videoMap.get(videoId);

        // Extract country from dbMeta or default to KR
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
              default: { url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }
            }
          },
          statistics: matchedVideo?.statistics || {
            viewCount: matchedVideo?.viewCount || "0",
            likeCount: matchedVideo?.likeCount || "0",
            commentCount: matchedVideo?.commentCount || "0"
          }
        };
      });

      GLOBAL_REPORTS_CACHE.set(cacheKey, { data: mergedList, timestamp: Date.now() });
      return mergedList;
    } catch (e: any) {
      console.error("Reports API cache error:", e);
      throw e;
    } finally {
      GLOBAL_REPORTS_PROMISES.delete(cacheKey);
    }
  })();

  GLOBAL_REPORTS_PROMISES.set(cacheKey, promise);
  return promise;
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "trending";

  try {
    const mergedList = await getCachedReports(type);
    return NextResponse.json({ data: mergedList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
