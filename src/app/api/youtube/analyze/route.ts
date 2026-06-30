import { NextRequest, NextResponse } from "next/server";
import {
  decryptVaultKey,
  getActiveVaultKeys,
  recordVaultFailure,
  recordVaultSuccess,
  supabaseAdmin,
} from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";
import { createClient } from "@/utils/supabase/server";

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";

// 2중 In-Memory 캐시 레이어 (서버 메모리 상에 24시간 보관)
const memoryCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Extract text from Gemini generateContent API response.
 */
function extractGeminiText(data: any): string {
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part: any) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(data.error?.message || "Gemini API 응답 본문이 비어 있습니다.");
  }

  return text;
}

export async function POST(req: NextRequest) {
  // 1. Verify authenticated session to prevent public abuse
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { videoId, title, channelTitle, description, tags, statistics, reportType, videoMetadata } = body;

    if (!videoId) {
      return NextResponse.json({ error: "videoId 파라미터가 누락되었습니다." }, { status: 400 });
    }

    const cleanVideoId = String(videoId).trim();

    // 2-A. Scan In-Memory Cache first (0.001s response)
    const memCached = memoryCache.get(cleanVideoId);
    if (memCached && (Date.now() - memCached.timestamp < CACHE_TTL)) {
      console.log(`Memory Cache Hit: Serving AI analysis for video ID ${cleanVideoId} from Memory.`);
      return NextResponse.json({ cached: true, content: memCached.content, source: "memory" });
    }

    // 2-B. Scan Supabase Cache Table
    const { data: cachedRow, error: dbError } = await supabaseAdmin
      .from("youtube_video_analysis")
      .select("analysis_content")
      .eq("video_id", cleanVideoId)
      .maybeSingle();

    if (!dbError && cachedRow && cachedRow.analysis_content) {
      console.log(`DB Cache Hit: Serving AI analysis for video ID ${cleanVideoId} from DB.`);
      // Sync to Memory Cache for subsequent requests
      memoryCache.set(cleanVideoId, { content: cachedRow.analysis_content, timestamp: Date.now() });
      return NextResponse.json({ cached: true, content: cachedRow.analysis_content, source: "db" });
    }

    // 3. Cache Miss - Fetch Available API key from Vault or Env fallback
    let apiKey = "";
    let vaultId: number | null = null;

    try {
      const vaultKeys = await getActiveVaultKeys("gemini");
      if (vaultKeys && vaultKeys.length > 0) {
        const selectedVault = vaultKeys[0];
        apiKey = decryptVaultKey(selectedVault);
        vaultId = selectedVault.id;
      }
    } catch (vaultErr) {
      console.warn("Failed to retrieve Gemini key from vault, trying env fallback:", vaultErr);
    }

    if (!apiKey) {
      apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    }

    if (!apiKey) {
      throw new Error("가용한 Gemini API 키가 존재하지 않습니다. (관리자 금고 또는 로컬 환경변수 확인 필요)");
    }

    // 4. Retrieve YouTube Key from Vault to fetch Channel Info and Comments
    let youtubeApiKey = "";
    try {
      const { data: vaultKeys, error: vaultError } = await supabaseAdmin
        .from("admin_api_vault")
        .select("key")
        .eq("provider", "youtube")
        .eq("status", "active")
        .order("priority", { ascending: true })
        .order("today_count", { ascending: true })
        .limit(1);

      if (!vaultError && vaultKeys && vaultKeys.length > 0) {
        youtubeApiKey = decryptApiKey(vaultKeys[0].key);
      }
    } catch (err) {
      console.warn("Failed to retrieve YouTube key from vault for additional analysis:", err);
    }

    // 5. Fetch Channel Statistics
    let channelStats: any = null;
    const channelId = videoMetadata?.snippet?.channelId;
    if (youtubeApiKey && channelId) {
      try {
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${youtubeApiKey}`;
        const channelRes = await fetch(channelUrl);
        if (channelRes.ok) {
          const channelData = await channelRes.json();
          channelStats = channelData.items?.[0]?.statistics || null;
        }
      } catch (err) {
        console.warn("Failed to fetch channel statistics for analysis:", err);
      }
    }

    // 6. Download and convert the video's thumbnail image to Base64 in-memory for Multimodal Vision Analysis
    let base64Image = "";
    const thumbnailUrl = videoMetadata?.snippet?.thumbnails?.high?.url || videoMetadata?.snippet?.thumbnails?.medium?.url || videoMetadata?.snippet?.thumbnails?.default?.url;
    if (thumbnailUrl) {
      try {
        const imgRes = await fetch(thumbnailUrl);
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          base64Image = Buffer.from(buffer).toString("base64");
        }
      } catch (err) {
        console.warn("Failed to convert thumbnail image for multimodal analysis:", err);
      }
    }

    // 7. Calculate Statistics & Outlier Ratio
    const viewCount = Number(statistics?.viewCount || 0);
    const likeCount = Number(statistics?.likeCount || 0);
    const commentCount = Number(statistics?.commentCount || 0);
    const subscriberCount = channelStats ? Number(channelStats.subscriberCount || 0) : 0;

    let outlierRatioStr = "계산 불가 (채널 데이터 부족)";
    if (subscriberCount > 0) {
      const ratio = viewCount / subscriberCount;
      outlierRatioStr = `${ratio.toFixed(1)}배 (${viewCount.toLocaleString()}회 조회 / 구독자 ${subscriberCount.toLocaleString()}명)`;
    }

    // 8. Build Prompt with rich statistics and instructions
    const prompt = `너는 유튜브 알고리즘과 크리에이터 기획 분석 전문가이자 수석 컨설턴트이다.
다음 유튜브 트렌드 영상의 메타데이터, 채널 통계, 그리고 전달된 썸네일 이미지(멀티모달)를 종합적으로 분석하여 최고의 인사이트를 제공하는 보고서를 작성하라.

[1. 영상 기본 정보]
- 제목: ${title || "제목 없음"}
- 채널명: ${channelTitle || "채널 정보 없음"}
- 태그: ${tags && tags.length > 0 ? tags.join(", ") : "지정된 태그 없음"}
- 조회수: ${viewCount.toLocaleString()}회
- 좋아요수: ${likeCount.toLocaleString()}개
- 댓글수: ${commentCount.toLocaleString()}개
- 설명글 요약:
${description ? description.substring(0, 800) : "본문 설명 없음"}

[2. 채널 성과 & 아웃라이어 파워]
- 채널 구독자 수: ${subscriberCount > 0 ? subscriberCount.toLocaleString() + "명" : "정보 없음"}
- 총 업로드 동영상 수: ${channelStats?.videoCount ? Number(channelStats.videoCount).toLocaleString() + "개" : "정보 없음"}
- 구독자 대비 조회수 배수 (Outlier Ratio): ${outlierRatioStr}
* 분석 가이드: 배수가 1.0배 미만이면 일반적인 기존 팬층(구독자) 기반의 노출이며, 3배~10배 이상일 경우 채널 파워보다 '영상 기획 및 썸네일'이 압도적이어서 외부 탐색 홈피드 알고리즘의 대폭 추천을 받아 떡상한 '순수 기획 흥행작'입니다.

[보고서 작성 규칙]
소제목 마크다운 서식을 사용하여 한국어로 구체적이고 전문적으로 분석해줘.
인사말이나 "네, 분석해 드리겠습니다" 같은 서론은 완전히 배제하고 즉시 1번 항목 소제목으로 보고서를 바로 시작하라.

아래 3가지 항목을 깊이 있게 다뤄라:

1. **시청자를 매료한 핵심 바이럴 요인 (Viral Code)**
   - 영상의 전체적인 바이럴 코드 및 흥행 기획 요소를 분석하라.
   - 특히, 함께 전달된 썸네일 이미지의 시각적 요소(구도, 캐릭터 표정, 강조 텍스트, 색 대비 등)가 클릭율(CTR)을 높이는데 어떻게 기여했는지 멀티모달(시각 분석) 관점에서 전문적으로 평가하라.

2. **타겟 키워드 및 태그의 알고리즘 유효성 (Keyword & Tag Engine)**
   - 검색 노출 및 추천 피드(Home Feed) 선점을 이끈 키워드 전략 분석.
   - 위에서 계산된 **구독자 대비 조회수 배수 (Outlier Ratio)**를 토대로 이 영상의 '순수 기획 파괴력'을 정밀 진단하라.

3. **내 채널을 위한 크리에이박스 변형 기획안 (Remix Blueprint)**
   - 이 영상의 흥행 공식을 벤치마킹하여 일반 크리에이터가 자신의 채널 성격에 맞게 2차 변형/Remix하여 안전하게 제작할 수 있는 기획 청사진 및 구체적 오프닝/후킹 스크립트 시나리오 예시 제시.`;

    const promptParts: any[] = [{ text: prompt }];
    if (base64Image) {
      promptParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      });
    }

    const modelPath = `models/${DEFAULT_GEMINI_MODEL}`;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: promptParts,
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      if (vaultId) await recordVaultFailure(vaultId, `HTTP ${geminiRes.status}`);
      throw new Error(`Gemini API returned HTTP ${geminiRes.status}`);
    }

    const resData = await geminiRes.json();
    const generatedText = extractGeminiText(resData);

    if (vaultId) {
      await recordVaultSuccess(vaultId);
    }

    // 10. Store Cache to Memory first (100% reliable fallback)
    memoryCache.set(cleanVideoId, { content: generatedText, timestamp: Date.now() });

    // 11. Store Cache to DB (using upsert to avoid primary key duplicate exceptions)
    let dbUpsertErrorMsg = null;
    try {
      const { error: upsertErr } = await supabaseAdmin.from("youtube_video_analysis").upsert(
        {
          video_id: cleanVideoId,
          analysis_content: generatedText,
          video_metadata: videoMetadata || null,
          report_type: reportType || "trending",
          created_at: new Date().toISOString(),
        },
        { onConflict: "video_id" }
      );

      if (upsertErr) {
        dbUpsertErrorMsg = upsertErr.message;
        console.error(`Failed to write AI analysis to DB for video ID ${cleanVideoId}:`, upsertErr.message);
      } else {
        console.log(`Successfully cached AI analysis for video ID ${cleanVideoId} in DB.`);
      }
    } catch (upsertErr: any) {
      dbUpsertErrorMsg = upsertErr.message || String(upsertErr);
      console.error("Failed to write AI analysis to DB due to runtime exception:", dbUpsertErrorMsg);
    }

    return NextResponse.json({ cached: false, content: generatedText, dbErrorMsg: dbUpsertErrorMsg });
  } catch (err: any) {
    console.error("AI Video Analysis failed:", err);
    return NextResponse.json({ error: err.message || "영상 분석을 처리하지 못했습니다." }, { status: 500 });
  }
}
