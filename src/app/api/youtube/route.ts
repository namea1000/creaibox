import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, recordVaultSuccess, recordVaultFailure } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";
import { createClient } from "@/utils/supabase/server";

// Unified proxy endpoint for YouTube Data API v3
export async function GET(req: NextRequest) {
  // 0. Verify user session to block unregistered/anonymous access
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const referer = req.headers.get("referer") || "http://localhost:3000/";
  let vaultId: number | null = null;
  
  try {
    // 1. Get active YouTube keys sorted by priority and today_count
    const { data: vaultKeys, error: vaultError } = await supabaseAdmin
      .from("admin_api_vault")
      .select("id, key, today_count, daily_limit")
      .eq("provider", "youtube")
      .eq("status", "active")
      .order("priority", { ascending: true })
      .order("today_count", { ascending: true });

    if (vaultError || !vaultKeys || vaultKeys.length === 0) {
      console.warn("YouTube API keys not found in vault. Falling back to mock data.");
      return NextResponse.json(getMockData(type, searchParams));
    }

    let selectedVault = null;
    for (const vault of vaultKeys) {
      if ((vault.today_count || 0) < (vault.daily_limit || 1000)) {
        selectedVault = vault;
        break;
      }
    }

    if (!selectedVault) {
      console.warn("No active YouTube API key with available quota found in vault. Falling back to mock data.");
      return NextResponse.json(getMockData(type, searchParams));
    }

    const apiKey = decryptApiKey(selectedVault.key);
    if (!apiKey) {
      console.warn("YouTube API key decryption failed. Falling back to mock data.");
      return NextResponse.json(getMockData(type, searchParams));
    }

    vaultId = selectedVault.id;

    // 2. Route request to appropriate Google API calls
    switch (type) {
      case "trending": {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=KR&maxResults=10&key=${apiKey}`;
        const response = await fetch(url, { headers: { Referer: referer } });
        if (!response.ok) throw new Error(`Google API returned ${response.status}`);
        const data = await response.json();
        if (vaultId !== null) {
          await recordVaultSuccess(vaultId);
        }
        return NextResponse.json({ source: "youtube-api", data: data.items || [] });
      }

      case "channel": {
        let query = searchParams.get("query") || "";
        if (!query) return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });

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

        // Step 2b: Get channel statistics and snippet details
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
        const channelRes = await fetch(channelUrl, { headers: { Referer: referer } });
        if (!channelRes.ok) throw new Error("Google channels API call failed");
        const channelData = await channelRes.json();
        const channelStats = channelData.items?.[0];

        // Step 2c: Get channel's recent videos
        const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=5&key=${apiKey}`;
        const videosRes = await fetch(videosUrl, { headers: { Referer: referer } });
        const videosData = videosRes.ok ? await videosRes.json() : { items: [] };

        if (vaultId !== null) {
          await recordVaultSuccess(vaultId);
        }
        return NextResponse.json({
          source: "youtube-api",
          channel: channelStats || null,
          recentVideos: videosData.items || [],
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

// Fallback high-fidelity mock data generator
function getMockData(type: string | null, searchParams: URLSearchParams) {
  console.log(`Serving fallback mock data for action: ${type}`);
  switch (type) {
    case "trending":
      return {
        source: "mock-fallback",
        data: [
          {
            id: "trend-1",
            snippet: {
              title: "Suno AI v4 음악 작곡 레전드 신곡 모음",
              channelTitle: "AI 뮤직 스테이션",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=320&q=80" } },
            },
            statistics: { viewCount: "128450", likeCount: "8540", commentCount: "320" },
          },
          {
            id: "trend-2",
            snippet: {
              title: "유튜브 알고리즘을 지배하는 썸네일 제작 기법 특강",
              channelTitle: "크리에이터 연구소",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=320&q=80" } },
            },
            statistics: { viewCount: "87600", likeCount: "6400", commentCount: "250" },
          },
          {
            id: "trend-3",
            snippet: {
              title: "1인 지식창업자용 필수 AI 업무 자동화 툴 5가지",
              channelTitle: "지식창업 노마드",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=320&q=80" } },
            },
            statistics: { viewCount: "54200", likeCount: "3890", commentCount: "185" },
          },
        ],
      };

    case "channel": {
      const query = searchParams.get("query") || "크리에이박스";
      return {
        source: "mock-fallback",
        channel: {
          id: "mock-channel-id",
          snippet: {
            title: query,
            description: "인공지능을 활용한 앨범 작사, 작곡, 영상 편집 자동화 비즈니스 팁을 공유하는 채널입니다.",
            customUrl: `@${query.replace(/\s+/g, "").toLowerCase()}`,
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&q=80" } },
          },
          statistics: {
            subscriberCount: "124500",
            viewCount: "3540000",
            videoCount: "148",
          },
        },
        recentVideos: [
          {
            id: { videoId: "mock-v-1" },
            snippet: {
              title: `${query}와 함께하는 5분 완성 AI 작곡 가이드`,
              publishedAt: "2026-06-01T12:00:00Z",
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
            },
          },
          {
            id: { videoId: "mock-v-2" },
            snippet: {
              title: "조회수 100만 쇼츠 영상 기획 템플릿 배포",
              publishedAt: "2026-05-25T09:00:00Z",
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=320&q=80" } },
            },
          },
        ],
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
