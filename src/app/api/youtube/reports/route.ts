import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  // 1. Verify user session
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") || "trending";

  try {
    // 2. Fetch rows from youtube_video_analysis with report_type filter
    let dbQuery = supabaseAdmin
      .from("youtube_video_analysis")
      .select("video_id, analysis_content, video_metadata, report_type, created_at");

    if (type === "channel") {
      dbQuery = dbQuery.eq("report_type", "channel");
    } else {
      dbQuery = dbQuery.or("report_type.eq.trending,report_type.is.null");
    }

    const { data: analyses, error: analysisError } = await dbQuery.order("created_at", { ascending: false });

    if (analysisError) {
      return NextResponse.json({ error: analysisError.message }, { status: 500 });
    }

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 3. Load latest archive records to map full video metadata (only as backup fallback)
    const { data: archives } = await supabaseAdmin
      .from("youtube_trending_archive")
      .select("videos_data")
      .order("target_date", { ascending: false })
      .limit(100);

    const videoMap = new Map<string, any>();
    if (archives) {
      for (const archive of archives) {
        const videos = archive.videos_data || [];
        for (const v of videos) {
          if (v && v.id) {
            videoMap.set(v.id, v);
          }
        }
      }
    }

    // 4. Merge analysis and video details (Using direct video_metadata or trending archive)
    const mergedList = analyses.map((analysis) => {
      const videoId = analysis.video_id;
      const dbMeta = (analysis as any).video_metadata;
      const matchedVideo = dbMeta || videoMap.get(videoId);

      // Extract country from dbMeta or default to KR
      let country = matchedVideo?.country || matchedVideo?.snippet?.country || "";
      if (!country) {
        // Fallback: try parsing title if it starts with [US], [GB], etc.
        const title = matchedVideo?.snippet?.title || "";
        const countryMatch = title.match(/^\[([A-Z]{2})\]/);
        if (countryMatch) {
          country = countryMatch[1];
        } else {
          // If channel Title contains country name or handle has country prefix
          const channelTitle = matchedVideo?.snippet?.channelTitle || "";
          if (channelTitle.startsWith("US ")) country = "US";
          else if (channelTitle.startsWith("JP ")) country = "JP";
          else if (channelTitle.startsWith("GB ")) country = "GB";
          else if (channelTitle.startsWith("VN ")) country = "VN";
          else if (channelTitle.startsWith("IN ")) country = "IN";
          else if (channelTitle.startsWith("BR ")) country = "BR";
          else if (channelTitle.startsWith("CA ")) country = "CA";
          else country = "KR"; // Default to South Korea
        }
      }

      return {
        id: videoId,
        video_id: videoId,
        created_at: analysis.created_at,
        analysis_content: analysis.analysis_content,
        country: country || "KR",
        // Fallback structures if the original metadata is aged out
        snippet: matchedVideo?.snippet || {
          title: `분석된 비디오 (${videoId})`,
          channelTitle: "-",
          thumbnails: {
            medium: { url: "/placeholder.jpg" },
            default: { url: "/placeholder.jpg" }
          }
        },
        statistics: matchedVideo?.statistics || {
          viewCount: "0",
          likeCount: "0",
          commentCount: "0"
        }
      };
    });

    return NextResponse.json({ data: mergedList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
