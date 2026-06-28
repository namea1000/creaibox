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

  try {
    // 2. Fetch all rows from youtube_video_analysis
    const { data: analyses, error: analysisError } = await supabaseAdmin
      .from("youtube_video_analysis")
      .select("video_id, analysis_content, created_at")
      .order("created_at", { ascending: false });

    if (analysisError) {
      return NextResponse.json({ error: analysisError.message }, { status: 500 });
    }

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 3. Load latest archive records to map full video metadata
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

    // 4. Merge analysis and video details
    const mergedList = analyses.map((analysis) => {
      const videoId = analysis.video_id;
      const matchedVideo = videoMap.get(videoId);

      return {
        id: videoId,
        video_id: videoId,
        created_at: analysis.created_at,
        analysis_content: analysis.analysis_content,
        // Fallback structures if the original metadata is aged out of the 100 cache records
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
