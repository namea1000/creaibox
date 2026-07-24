import { BENCHMARK_CHANNELS } from "@/app/studio/youtube/[section]/components/benchmarkChannels";
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
export async function fetchAndCacheTrending(categoryId: string, date: string = getKstTodayDate(), referer: string = "http://localhost:3000/", country: string = "KR") {
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
  const safeReferer = (referer && referer.trim() !== "") ? referer : "https://creaibox.com/";
  let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${country}&maxResults=20&key=${apiKey}`;
  if (categoryId && categoryId !== "all") {
    url += `&videoCategoryId=${categoryId}`;
  }
  const response = await fetch(url, { headers: { Referer: safeReferer } });
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
  const dbCategoryId = country === "KR" ? categoryId : `${country}_${categoryId}`;
  try {
    const { error: upsertError } = await supabaseAdmin
      .from("youtube_trending_archive")
      .upsert({
        category_id: dbCategoryId,
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
        const country = searchParams.get("country") || "KR";

        if (categoryId === "all") {
          const TARGET_CATEGORIES = ["all", "10", "20", "24", "1", "28", "17", "25"];
          const promises = TARGET_CATEGORIES.map(async (catId) => {
            const dbCategoryId = country === "KR" ? catId : `${country}_${catId}`;
            try {
              const { data: cachedRow } = await supabaseAdmin
                .from("youtube_trending_archive")
                .select("videos_data")
                .eq("target_date", date)
                .eq("category_id", dbCategoryId)
                .maybeSingle();

              if (cachedRow && cachedRow.videos_data && Array.isArray(cachedRow.videos_data) && cachedRow.videos_data.length > 0) {
                return cachedRow.videos_data as any[];
              }
            } catch (e) {
              console.error(`Failed to load category ${catId} from cache:`, e);
            }

            const todayDate = getKstTodayDate();
            if (date === todayDate) {
              try {
                const enriched = await fetchAndCacheTrending(catId, date, referer, country);
                if (enriched && enriched.length > 0) return enriched;
              } catch (e) {
                console.error(`Failed to fetch live category ${catId}:`, e);
              }
            }
            return [];
          });

          const results = await Promise.all(promises);
          const combinedVideos: any[] = [];
          const seenIds = new Set<string>();

          for (const list of results) {
            if (Array.isArray(list)) {
              for (const video of list) {
                if (video && video.id && !seenIds.has(video.id)) {
                  seenIds.add(video.id);
                  combinedVideos.push(video);
                }
              }
            }
          }

          // Fallback to recent DB cache if combinedVideos is empty
          if (combinedVideos.length === 0) {
            try {
              const { data: fallbackRows } = await supabaseAdmin
                .from("youtube_trending_archive")
                .select("videos_data")
                .like("category_id", country === "KR" ? "%" : `${country}_%`)
                .order("target_date", { ascending: false })
                .limit(10);

              if (fallbackRows && fallbackRows.length > 0) {
                for (const row of fallbackRows) {
                  if (Array.isArray(row.videos_data)) {
                    for (const video of row.videos_data) {
                      if (video && video.id && !seenIds.has(video.id)) {
                        seenIds.add(video.id);
                        combinedVideos.push(video);
                      }
                    }
                  }
                }
              }
            } catch (fallbackErr) {
              console.error("Failed to query fallback archive rows:", fallbackErr);
            }
          }

          if (combinedVideos.length === 0) {
            return NextResponse.json(getMockData("trending", searchParams));
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

          return NextResponse.json({ source: "supabase-db-combined", data: combinedVideos, analyzedVideoIds });
        }

        const dbCategoryId = country === "KR" ? categoryId : `${country}_${categoryId}`;
        
        // 1. Try to read from Supabase Cache for exact target date
        try {
          const { data: cachedRow, error: cacheError } = await supabaseAdmin
            .from("youtube_trending_archive")
            .select("videos_data")
            .eq("target_date", date)
            .eq("category_id", dbCategoryId)
            .maybeSingle();

          if (!cacheError && cachedRow && cachedRow.videos_data && Array.isArray(cachedRow.videos_data) && cachedRow.videos_data.length > 0) {
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
            return NextResponse.json({ source: "youtube-api", data: enrichedItems, analyzedVideoIds });
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

// Fallback high-fidelity mock data generator
function getMockData(type: string | null, searchParams: URLSearchParams) {
  console.log(`Serving fallback mock data for action: ${type}`);
  switch (type) {
    case "trending": {
      const categoryId = searchParams.get("categoryId") || "all";
      const country = (searchParams.get("country") || "KR").toUpperCase();
      
      let mockList = [
        {
          id: `trend-all-1-${country}`,
          snippet: {
            title: `[${country}] Suno AI v4 음악 작곡 레전드 신곡 모음`,
            channelTitle: `AI 뮤직 스테이션 (${country})`,
            publishedAt: new Date().toISOString(),
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=320&q=80" } },
          },
          contentDetails: { duration: "PT15M30S" },
          isRealShorts: false,
          statistics: { viewCount: "128450", likeCount: "8540", commentCount: "320" },
        },
        {
          id: `trend-all-2-${country}`,
          snippet: {
            title: `[${country}] 유튜브 알고리즘을 지배하는 썸네일 제작 기법 특강`,
            channelTitle: `크리에이터 연구소 (${country})`,
            publishedAt: new Date().toISOString(),
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=320&q=80" } },
          },
          contentDetails: { duration: "PT45M12S" },
          isRealShorts: false,
          statistics: { viewCount: "87600", likeCount: "6400", commentCount: "250" },
        },
        {
          id: `trend-all-3-${country}`,
          snippet: {
            title: `[${country}] 1인 지식창업자용 필수 AI 업무 자동화 툴 5가지`,
            channelTitle: `지식창업 노마드 (${country})`,
            publishedAt: new Date().toISOString(),
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=320&q=80" } },
          },
          contentDetails: { duration: "PT45S" },
          isRealShorts: true,
          statistics: { viewCount: "54200", likeCount: "3890", commentCount: "185" },
        },
      ];

      if (categoryId === "10") {
        if (country === "KR") {
          mockList = [
            {
              id: "trend-music-kr-1",
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
              id: "trend-music-kr-2",
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
        } else if (country === "US") {
          mockList = [
            {
              id: "trend-music-us-1",
              snippet: {
                title: "Taylor Swift - 'Fortnight' (feat. Post Malone) Official MV",
                channelTitle: "Taylor Swift",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M50S" },
              isRealShorts: false,
              statistics: { viewCount: "12400000", likeCount: "850000", commentCount: "54000" },
            },
            {
              id: "trend-music-us-2",
              snippet: {
                title: "Billie Eilish - 'LUNCH' Official Music Video",
                channelTitle: "BillieEilishVEVO",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M00S" },
              isRealShorts: false,
              statistics: { viewCount: "8950000", likeCount: "680000", commentCount: "32000" },
            },
          ];
        } else if (country === "JP") {
          mockList = [
            {
              id: "trend-music-jp-1",
              snippet: {
                title: "YOASOBI - 'Idol' (アイドル) Official Music Video",
                channelTitle: "Ayase / YOASOBI",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M33S" },
              isRealShorts: false,
              statistics: { viewCount: "9800000", likeCount: "740000", commentCount: "42000" },
            },
            {
              id: "trend-music-jp-2",
              snippet: {
                title: "Kenshi Yonezu (米津玄師) - 'Chuchu Lovely' Live Performance",
                channelTitle: "Kenshi Yonezu",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
              },
              contentDetails: { duration: "PT4M12S" },
              isRealShorts: false,
              statistics: { viewCount: "4320000", likeCount: "390000", commentCount: "21000" },
            },
          ];
        } else if (country === "GB") {
          mockList = [
            {
              id: "trend-music-gb-1",
              snippet: {
                title: "Coldplay - 'feelslikeimfallinginlove' Official Video",
                channelTitle: "Coldplay",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
              },
              contentDetails: { duration: "PT4M02S" },
              isRealShorts: false,
              statistics: { viewCount: "5420000", likeCount: "410000", commentCount: "18500" },
            },
            {
              id: "trend-music-gb-2",
              snippet: {
                title: "Adele - 'Easy On Me' Official MV",
                channelTitle: "AdeleVEVO",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M44S" },
              isRealShorts: false,
              statistics: { viewCount: "8720000", likeCount: "620000", commentCount: "29400" },
            },
          ];
        } else if (country === "VN") {
          mockList = [
            {
              id: "trend-music-vn-1",
              snippet: {
                title: "Sơn Tùng M-TP - 'Đừng Làm Trái Tim Anh Đau' | Official MV",
                channelTitle: "Sơn Tùng M-TP Official",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80" } },
              },
              contentDetails: { duration: "PT4M15S" },
              isRealShorts: false,
              statistics: { viewCount: "7820000", likeCount: "580000", commentCount: "34000" },
            },
            {
              id: "trend-music-vn-2",
              snippet: {
                title: "tlinh - 'nếu lúc đó' (feat. 2pillz) | Official MV",
                channelTitle: "tlinh Official",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M50S" },
              isRealShorts: false,
              statistics: { viewCount: "3120000", likeCount: "210000", commentCount: "12800" },
            },
          ];
        } else if (country === "IN") {
          mockList = [
            {
              id: "trend-music-in-1",
              snippet: {
                title: "Tauba Tauba - Bad Newz | Vicky Kaushal | Karan Aujla | Official Video",
                channelTitle: "Saregama Music",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M28S" },
              isRealShorts: false,
              statistics: { viewCount: "15800000", likeCount: "940000", commentCount: "48000" },
            },
            {
              id: "trend-music-in-2",
              snippet: {
                title: "O Sajna - Badshah | Divya Khossla | Payal Dev | Official Music Video",
                channelTitle: "T-Series",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M12S" },
              isRealShorts: false,
              statistics: { viewCount: "11200000", likeCount: "680000", commentCount: "32000" },
            },
          ];
        } else if (country === "BR") {
          mockList = [
            {
              id: "trend-music-br-1",
              snippet: {
                title: "Luísa Sonza - 'SAGRADO' Official Music Video",
                channelTitle: "Luísa Sonza",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80" } },
              },
              contentDetails: { duration: "PT2M55S" },
              isRealShorts: false,
              statistics: { viewCount: "3400000", likeCount: "280000", commentCount: "14800" },
            },
            {
              id: "trend-music-br-2",
              snippet: {
                title: "Anitta - 'Joga Pra Lua' (feat. Dennis & Pedro Sampaio) | MV",
                channelTitle: "Anitta",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M05S" },
              isRealShorts: false,
              statistics: { viewCount: "5800000", likeCount: "420000", commentCount: "22000" },
            },
          ];
        } else {
          mockList = [
            {
              id: "trend-music-global-1",
              snippet: {
                title: "The Weeknd - 'Dancing In the Flames' (Official MV)",
                channelTitle: "The Weeknd",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M40S" },
              isRealShorts: false,
              statistics: { viewCount: "14800000", likeCount: "1100000", commentCount: "68000" },
            },
            {
              id: "trend-music-global-2",
              snippet: {
                title: "Drake - 'Wah Gwan Delilah' (Official Audio)",
                channelTitle: "OVO Sound",
                publishedAt: new Date().toISOString(),
                thumbnails: { medium: { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=320&q=80" } },
              },
              contentDetails: { duration: "PT3M05S" },
              isRealShorts: false,
              statistics: { viewCount: "4200000", likeCount: "280000", commentCount: "19800" },
            },
          ];
        }
      } else if (categoryId === "20") {
        mockList = [
          {
            id: `trend-game-1-${country}`,
            snippet: {
              title: `[${country}] LCK Summer Finals - T1 vs GEN.G 5세트 하이라이트`,
              channelTitle: `LCK (${country})`,
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&q=80" } },
            },
            contentDetails: { duration: "PT18M45S" },
            isRealShorts: false,
            statistics: { viewCount: "840000", likeCount: "12800", commentCount: "5400" },
          },
          {
            id: `trend-game-2-${country}`,
            snippet: {
              title: `[${country}] 마인크래프트 하드코어 100일 생존 하이라이트`,
              channelTitle: `잠뜰 TV (${country})`,
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
            id: `trend-ent-1-${country}`,
            snippet: {
              title: `[${country}] 아는 형님 - 레전드 전학생들의 미친 춤 대결 모음집`,
              channelTitle: `JTBC Entertainment (${country})`,
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=320&q=80" } },
            },
            contentDetails: { duration: "PT12M30S" },
            isRealShorts: false,
            statistics: { viewCount: "1250000", likeCount: "45000", commentCount: "2890" },
          },
          {
            id: `trend-ent-2-${country}`,
            snippet: {
              title: `[${country}] 런닝맨 - 소름 돋는 마피아 게임 심리전 역대급 명장면 요약`,
              channelTitle: `SBS Entertainment (${country})`,
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
            id: `trend-film-1-${country}`,
            snippet: {
              title: `[${country}] 어벤져스 시크릿 워즈 첫 공식 예고편 분석 및 이스터에그 32선`,
              channelTitle: `영화 돋보기 (${country})`,
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&q=80" } },
            },
            contentDetails: { duration: "PT8M24S" },
            isRealShorts: false,
            statistics: { viewCount: "540000", likeCount: "19200", commentCount: "3100" },
          },
          {
            id: `trend-film-2-${country}`,
            snippet: {
              title: `[${country}] 주토피아 2 공식 티저 예고편 - 나무늘보 플래시의 컴백`,
              channelTitle: `디즈니 코리아 (${country})`,
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
            id: `trend-tech-1-${country}`,
            snippet: {
              title: `[${country}] GPT-5 전격 공개! 현존 인공지능 종결자가 가져올 미래 생태계`,
              channelTitle: `테크 잇 (${country})`,
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=320&q=80" } },
            },
            contentDetails: { duration: "PT14M10S" },
            isRealShorts: false,
            statistics: { viewCount: "680000", likeCount: "34000", commentCount: "8200" },
          },
          {
            id: `trend-tech-2-${country}`,
            snippet: {
              title: `[${country}] 갤럭시 S27 울트라 2달 실사용기 - 100배 줌 폴디드 렌즈의 한계`,
              channelTitle: `it섭 (${country})`,
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
            id: `trend-sport-1-${country}`,
            snippet: {
              title: `[${country}] 손흥민 멀티골 작렬! 2026 프리미어리그 토트넘 vs 첼시 전술 하이라이트`,
              channelTitle: `SPOTV (${country})`,
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=320&q=80" } },
            },
            contentDetails: { duration: "PT9M12S" },
            isRealShorts: false,
            statistics: { viewCount: "2500000", likeCount: "148000", commentCount: "15400" },
          },
          {
            id: `trend-sport-2-${country}`,
            snippet: {
              title: `[${country}] 집에서 15분 만에 지방 불태우는 전신 타바타 홈트레이닝 루틴`,
              channelTitle: `핏블리 FITVELY (${country})`,
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
            id: `trend-news-1-${country}`,
            snippet: {
              title: `[${country}] 미국 연준, 기준 금리 기습 인하 발표 - 금융권 충격 및 아시아 증시 폭등 뉴스`,
              channelTitle: `MBC 뉴스 (${country})`,
              publishedAt: new Date().toISOString(),
              thumbnails: { medium: { url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=320&q=80" } },
            },
            contentDetails: { duration: "PT2M45S" },
            isRealShorts: false,
            statistics: { viewCount: "720000", likeCount: "14200", commentCount: "3480" },
          },
          {
            id: `trend-news-2-${country}`,
            snippet: {
              title: `[${country}] 수도권 GTX 노선 조기 개통 현장 긴급 점검 - 출퇴근 교통망 어떻게 바뀌나`,
              channelTitle: `KBS 뉴스 (${country})`,
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
