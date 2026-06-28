import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, recordVaultSuccess, recordVaultFailure } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";
import { createClient } from "@/utils/supabase/server";
import { appendTrendingToSheet } from "@/lib/google-sheets";

export function getKstTodayDate(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000; // 9 hours
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().split("T")[0]; // YYYY-MM-DD
}

function isShortsDuration(durationStr?: string | null): boolean {
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
export async function fetchAndCacheTrending(categoryId: string, date: string = getKstTodayDate(), referer: string = "http://localhost:3000/") {
  // 1. Get API Keys from Vault
  const { data: vaultKeys, error: vaultError } = await supabaseAdmin
    .from("admin_api_vault")
    .select("id, key, today_count, daily_limit")
    .eq("provider", "youtube")
    .eq("status", "active")
    .order("priority", { ascending: true })
    .order("today_count", { ascending: true });

  if (vaultError || !vaultKeys || vaultKeys.length === 0) {
    throw new Error("YouTube API keys not found in vault.");
  }

  let selectedVault = null;
  for (const vault of vaultKeys) {
    if ((vault.today_count || 0) < (vault.daily_limit || 1000)) {
      selectedVault = vault;
      break;
    }
  }

  if (!selectedVault) {
    throw new Error("No active YouTube API key with available quota found in vault.");
  }

  const apiKey = decryptApiKey(selectedVault.key);
  if (!apiKey) {
    throw new Error("YouTube API key decryption failed.");
  }

  const vaultId = selectedVault.id;

  // 2. Fetch Live YouTube API
  let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=KR&maxResults=12&key=${apiKey}`;
  if (categoryId && categoryId !== "all") {
    url += `&videoCategoryId=${categoryId}`;
  }
  const response = await fetch(url, { headers: { Referer: referer } });
  if (!response.ok) throw new Error(`Google API returned ${response.status}`);
  const data = await response.json();
  
  if (vaultId !== null) {
    await recordVaultSuccess(vaultId);
  }

  const items = data.items || [];
  const enrichedItems = await Promise.all(
    items.map(async (item: any) => {
      const videoId = item.id;
      let isRealShorts = false;
      try {
        const isUnderOneMinute = isShortsDuration(item.contentDetails?.duration);
        if (isUnderOneMinute) {
          const checkRes = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
            method: "HEAD",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
          });
          isRealShorts = checkRes.url.includes("/shorts/");
        }
      } catch (e) {
        isRealShorts = isShortsDuration(item.contentDetails?.duration);
      }
      return {
        ...item,
        isRealShorts,
      };
    })
  );

  // 3. Save Cache to Supabase DB (Upsert)
  try {
    const { error: upsertError } = await supabaseAdmin
      .from("youtube_trending_archive")
      .upsert({
        category_id: categoryId,
        target_date: date,
        videos_data: enrichedItems,
        updated_at: new Date().toISOString(),
      }, { onConflict: "target_date, category_id" });

    if (upsertError) {
      console.error("Failed to write to Supabase Cache:", upsertError.message);
    } else {
      console.log(`Successfully cached category ${categoryId} for date ${date} in DB.`);
    }
  } catch (dbUpsertErr) {
    console.error("Supabase Cache write encountered error:", dbUpsertErr);
  }

  // 4. Async sync to continuous Google Sheet (A-L Append)
  appendTrendingToSheet(date, categoryId, enrichedItems).catch((err) => {
    console.error("Async Google Sheets sync failed:", err);
  });

  return enrichedItems;
}

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
  } catch (keyErr) {
    console.error("YouTube key load failed inside GET:", keyErr);
  }

  try {
    // 1. Route request to appropriate Google API calls
    switch (type) {
      case "trending": {
        const categoryId = searchParams.get("categoryId") || "all";
        const date = searchParams.get("date") || getKstTodayDate();

        // 1. Try to read from Supabase Cache
        try {
          const { data: cachedRow, error: cacheError } = await supabaseAdmin
            .from("youtube_trending_archive")
            .select("videos_data")
            .eq("target_date", date)
            .eq("category_id", categoryId)
            .maybeSingle();

          if (!cacheError && cachedRow && cachedRow.videos_data) {
            console.log(`Cache Hit: Serving trending category ${categoryId} for date ${date} from DB.`);
            
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

            return NextResponse.json({ source: "supabase-db", data: cachedRow.videos_data, analyzedVideoIds });
          }
        } catch (dbErr) {
          console.error("Supabase Cache read failed, trying live fallback:", dbErr);
        }

        // 2. Cache Miss - Live API call is ONLY allowed if requested date is today
        const todayDate = getKstTodayDate();
        if (date !== todayDate) {
          console.warn(`Cache Miss on historical date ${date}. YouTube API call is blocked to preserve quota.`);
          return NextResponse.json({ source: "supabase-db-empty", data: [] });
        }

        try {
          // Get active key ONLY for fallback vault error recording
          const { data: vaultKeys } = await supabaseAdmin
            .from("admin_api_vault")
            .select("id")
            .eq("provider", "youtube")
            .eq("status", "active")
            .limit(1);
          if (vaultKeys && vaultKeys.length > 0) {
            vaultId = vaultKeys[0].id;
          }

          const enrichedItems = await fetchAndCacheTrending(categoryId, date, referer);
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
          return NextResponse.json({ source: "youtube-api", data: enrichedItems, analyzedVideoIds });
        } catch (err: any) {
          console.error("Cache Miss Scraper failed:", err);
          if (vaultId !== null) {
            await recordVaultFailure(vaultId, err.message || String(err));
          }
          console.warn("Falling back to mock data due to sync error.");
          return NextResponse.json(getMockData(type, searchParams));
        }
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
    case "trending": {
      const categoryId = searchParams.get("categoryId") || "all";
      let mockList = [
        {
          id: "trend-all-1",
          snippet: {
            title: "Suno AI v4 음악 작곡 레전드 신곡 모음",
            channelTitle: "AI 뮤직 스테이션",
            publishedAt: new Date().toISOString(),
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=320&q=80" } },
          },
          contentDetails: { duration: "PT15M30S" },
          isRealShorts: false,
          statistics: { viewCount: "128450", likeCount: "8540", commentCount: "320" },
        },
        {
          id: "trend-all-2",
          snippet: {
            title: "유튜브 알고리즘을 지배하는 썸네일 제작 기법 특강",
            channelTitle: "크리에이터 연구소",
            publishedAt: new Date().toISOString(),
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=320&q=80" } },
          },
          contentDetails: { duration: "PT45M12S" },
          isRealShorts: false,
          statistics: { viewCount: "87600", likeCount: "6400", commentCount: "250" },
        },
        {
          id: "trend-all-3",
          snippet: {
            title: "1인 지식창업자용 필수 AI 업무 자동화 툴 5가지",
            channelTitle: "지식창업 노마드",
            publishedAt: new Date().toISOString(),
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=320&q=80" } },
          },
          contentDetails: { duration: "PT45S" },
          isRealShorts: true,
          statistics: { viewCount: "54200", likeCount: "3890", commentCount: "185" },
        },
      ];

      if (categoryId === "10") {
        mockList = [
          {
            id: "trend-music-1",
            snippet: {
              title: "AESPA (에스파) - 'Supernova' Official Music Video",
              channelTitle: "SMTOWN",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80" } },
            },
            contentDetails: { duration: "PT3M15S" },
            isRealShorts: false,
            statistics: { viewCount: "4820000", likeCount: "354000", commentCount: "28400" },
          },
          {
            id: "trend-music-2",
            snippet: {
              title: "NewJeans (뉴진스) - 'How Sweet' Official MV",
              channelTitle: "HYBE LABELS",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
            },
            contentDetails: { duration: "PT3M32S" },
            isRealShorts: false,
            statistics: { viewCount: "3295000", likeCount: "294000", commentCount: "19200" },
          },
        ];
      } else if (categoryId === "20") {
        mockList = [
          {
            id: "trend-game-1",
            snippet: {
              title: "LCK 2026 Summer Finals - T1 vs GEN.G 5세트 하이라이트",
              channelTitle: "LCK",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&q=80" } },
            },
            contentDetails: { duration: "PT18M45S" },
            isRealShorts: false,
            statistics: { viewCount: "840000", likeCount: "12800", commentCount: "5400" },
          },
          {
            id: "trend-game-2",
            snippet: {
              title: "마인크래프트 하드코어 100일 생존 생중계 하이라이트",
              channelTitle: "잠뜰 TV",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?w=320&q=80" } },
            },
            contentDetails: { duration: "PT48S" },
            isRealShorts: true,
            statistics: { viewCount: "420000", likeCount: "9400", commentCount: "1280" },
          },
        ];
      } else if (categoryId === "24") {
        mockList = [
          {
            id: "trend-ent-1",
            snippet: {
              title: "[출장 십오야] 하이브(HYBE) 야유회 대망의 댄스 신고식 1부",
              channelTitle: "채널 십오야",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=320&q=80" } },
            },
            contentDetails: { duration: "PT35M12S" },
            isRealShorts: false,
            statistics: { viewCount: "1920000", likeCount: "68000", commentCount: "7400" },
          },
          {
            id: "trend-ent-2",
            snippet: {
              title: "런닝맨 - 소름 돋는 마피아 게임 심리전 역대급 명장면 요약",
              channelTitle: "SBS Entertainment",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=320&q=80" } },
            },
            contentDetails: { duration: "PT58S" },
            isRealShorts: true,
            statistics: { viewCount: "980000", likeCount: "24500", commentCount: "3890" },
          },
        ];
      } else if (categoryId === "1") {
        mockList = [
          {
            id: "trend-film-1",
            snippet: {
              title: "어벤져스 시크릿 워즈 첫 공식 예고편 분석 및 이스터에그 32선",
              channelTitle: "영화 돋보기",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&q=80" } },
            },
            contentDetails: { duration: "PT8M24S" },
            isRealShorts: false,
            statistics: { viewCount: "540000", likeCount: "19200", commentCount: "3100" },
          },
          {
            id: "trend-film-2",
            snippet: {
              title: "주토피아 2 공식 티저 예고편 - 나무늘보 플래시의 컴백",
              channelTitle: "디즈니 코리아",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=320&q=80" } },
            },
            contentDetails: { duration: "PT1M05S" },
            isRealShorts: false,
            statistics: { viewCount: "1250000", likeCount: "78000", commentCount: "6200" },
          },
        ];
      } else if (categoryId === "28") {
        mockList = [
          {
            id: "trend-tech-1",
            snippet: {
              title: "GPT-5 전격 공개! 현존 인공지능 종결자가 가져올 미래 생태계",
              channelTitle: "테크 잇(Tech It)",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=320&q=80" } },
            },
            contentDetails: { duration: "PT14M10S" },
            isRealShorts: false,
            statistics: { viewCount: "680000", likeCount: "34000", commentCount: "8200" },
          },
          {
            id: "trend-tech-2",
            snippet: {
              title: "갤럭시 S27 울트라 2달 실사용기 - 100배 줌 폴디드 렌즈의 한계",
              channelTitle: "it섭",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&q=80" } },
            },
            contentDetails: { duration: "PT55S" },
            isRealShorts: true,
            statistics: { viewCount: "950000", likeCount: "28400", commentCount: "4320" },
          },
        ];
      } else if (categoryId === "17") {
        mockList = [
          {
            id: "trend-sport-1",
            snippet: {
              title: "손흥민 멀티골 작렬! 2026 프리미어리그 토트넘 vs 첼시 전술 하이라이트",
              channelTitle: "SPOTV",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=320&q=80" } },
            },
            contentDetails: { duration: "PT9M12S" },
            isRealShorts: false,
            statistics: { viewCount: "2500000", likeCount: "148000", commentCount: "15400" },
          },
          {
            id: "trend-sport-2",
            snippet: {
              title: "집에서 15분 만에 지방 불태우는 전신 타바타 홈트레이닝 루틴",
              channelTitle: "핏블리 FITVELY",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=320&q=80" } },
            },
            contentDetails: { duration: "PT15M00S" },
            isRealShorts: false,
            statistics: { viewCount: "340000", likeCount: "12500", commentCount: "980" },
          },
        ];
      } else if (categoryId === "25") {
        mockList = [
          {
            id: "trend-news-1",
            snippet: {
              title: "미국 연준, 기준 금리 기습 인하 발표 - 금융권 충격 및 아시아 증시 폭등 뉴스",
              channelTitle: "MBC 뉴스",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=320&q=80" } },
            },
            contentDetails: { duration: "PT2M45S" },
            isRealShorts: false,
            statistics: { viewCount: "720000", likeCount: "14200", commentCount: "3480" },
          },
          {
            id: "trend-news-2",
            snippet: {
              title: "수도권 GTX 노선 조기 개통 현장 긴급 점검 - 출퇴근 교통망 어떻게 바뀌나",
              channelTitle: "KBS 뉴스",
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=320&q=80" } },
            },
            contentDetails: { duration: "PT50S" },
            isRealShorts: true,
            statistics: { viewCount: "380000", likeCount: "8900", commentCount: "2100" },
          },
        ];
      }

      return {
        source: "mock-fallback",
        data: mockList,
      };
    }

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
