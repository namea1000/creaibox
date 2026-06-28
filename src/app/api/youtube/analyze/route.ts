import { NextRequest, NextResponse } from "next/server";
import {
  decryptVaultKey,
  getActiveVaultKeys,
  recordVaultFailure,
  recordVaultSuccess,
  supabaseAdmin,
} from "@/lib/server/get-free-gemini-key";
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
    const { videoId, title, channelTitle, description, tags, statistics } = body;

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

    // 4. Construct Prompt matching 수석 컨설턴트 톤앤매너
    const prompt = `너는 급상승하는 유튜브 트렌드 영상을 날카롭게 분석하는 전문 수석 크리에이터 컨설턴트이다.
다음 유튜브 영상의 상세 메타데이터를 보고, 크리에이터들에게 인사이트를 주는 고품격 분석 보고서를 작성해줘.

[영상 메타데이터]
- 제목: ${title || "제목 없음"}
- 채널명: ${channelTitle || "채널 정보 없음"}
- 태그: ${tags && tags.length > 0 ? tags.join(", ") : "지정된 태그 없음"}
- 조회수: ${Number(statistics?.viewCount || 0).toLocaleString()}회
- 좋아요수: ${Number(statistics?.likeCount || 0).toLocaleString()}개
- 댓글수: ${Number(statistics?.commentCount || 0).toLocaleString()}개
- 본문 설명글 요약:
${description ? description.substring(0, 1500) : "본문 설명 없음"}

[보고서 작성 규칙]
아래 3가지 항목에 대해 명확한 소제목 마크다운 서식을 사용하여 한국어로 구체적이고 전문적으로 분석해줘.
어조는 프로페셔널하며 신뢰감 있는 톤앤매너로 작성하고, 불필요한 서론(인사말이나 "네, 분석해드리겠습니다" 같은 단어)은 완전히 배제하고 즉시 마크다운 소제목으로 내용을 시작해줘.

1. **시청자를 매료한 핵심 바이럴 요인 (Viral Code)**
   - 이 영상이 어떤 대중 심리, 썸네일/제목 어그로 공식, 또는 이슈 타이밍을 파고들어 바이럴 흥행을 일으켰는지 크리에이터 관점에서 그 기획 코드를 날카롭게 짚어줘.

2. **타겟 키워드 및 태그의 알고리즘 유효성 (Keyword & Tag Engine)**
   - 영상의 제목과 태그, 본문 설명글에 기입된 키워드가 유튜브 알고리즘(추천/검색)에 어떻게 매핑되어 노출 가치를 획득했는지 유용성을 분석해줘.

3. **내 채널을 위한 크리에이박스 변형 기획안 (Remix Blueprint)**
   - 일반 크리에이터가 이 대박 기획(영상 구성, 후킹 방법, 앵글 스위칭)을 자신의 채널 테마에 맞춰 안전하고 독창적으로 모방/변형하여 2차 제작할 수 있는 기획 청사진을 구체적 시나리오 예시와 함께 제시해줘.`;

    const modelPath = `models/${DEFAULT_GEMINI_MODEL}`;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
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

    // 5. Store Cache to Memory first (100% reliable fallback)
    memoryCache.set(cleanVideoId, { content: generatedText, timestamp: Date.now() });

    // 6. Store Cache to DB (using upsert to avoid primary key duplicate exceptions)
    let dbUpsertErrorMsg = null;
    try {
      const { error: upsertErr } = await supabaseAdmin.from("youtube_video_analysis").upsert(
        {
          video_id: cleanVideoId,
          analysis_content: generatedText,
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
