import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "trending";

  try {
    // 1. Fetch rows from youtube_video_analysis with report_type filter (Publicly accessible to incognito & all users)
    let dbQuery = supabaseAdmin
      .from("youtube_video_analysis")
      .select("video_id, analysis_content, video_metadata, report_type, created_at");

    if (type === "channel") {
      dbQuery = dbQuery.eq("report_type", "channel");
    } else {
      dbQuery = dbQuery.or("report_type.eq.trending,report_type.is.null");
    }

    const { data: analyses, error: analysisError } = await dbQuery.order("created_at", { ascending: false }).limit(30);

    if (analysisError) {
      return NextResponse.json({ error: analysisError.message }, { status: 500 });
    }

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 2. Load latest archive records to map full video metadata (supporting both array and bundle object)
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

    // 3. Merge analysis and video details (Using direct video_metadata or trending archive)
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

    return NextResponse.json({ data: mergedList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
