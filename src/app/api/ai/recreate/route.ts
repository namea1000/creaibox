import { NextRequest, NextResponse } from "next/server";
import {
  decryptVaultKey,
  getActiveVaultKeys,
  recordVaultFailure,
  recordVaultSuccess,
  checkAndResetDailyCounts,
} from "@/lib/server/get-free-gemini-key";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

function extractGeminiText(data: GeminiGenerateResponse) {
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(data.error?.message || "Gemini 응답 본문이 비어 있습니다.");
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { originalTitle, originalContent, tone = "friendly", targetChannel = "naver" } = body;

    if (!originalContent) {
      return NextResponse.json(
        { error: "재창조할 원본 글 내용이 입력되지 않았습니다." },
        { status: 400 }
      );
    }

    const toneDescriptions: Record<string, string> = {
      friendly: "네이버 블로그 특유의 매우 친근하고 가독성 높은 대화체/구어체 (~해요, ~했답니다, ~해볼게요)",
      summary: "핵심 요약 중심의 명확하고 임팩트 있는 숏폼형 정리체",
      story: "개인 경험담 및 실제 후기 형태의 몰입감 넘치는 스토리텔링체 (~했는데요, ~추천해요)",
      info: "전문성 높은 지식 전달용 체계적 정보 전달체 (~합니다, ~입니다)",
    };

    const toneStyle = toneDescriptions[tone] || toneDescriptions.friendly;

    const systemPrompt = `
당신은 네이버 블로그 C-Rank 및 DIA+ 검색 알고리즘 상위 노출에 최적화된 국내 최고 수준의 전문 AI 콘텐츠 에디터입니다.
주어진 원본 글(크리에이박스 블로그 글)을 바탕으로, 검색 엔진의 유사 문서(Duplicate Content) 검출 시스템을 100% 통과할 수 있는 독창적인 "네이버 블로그 맞춤형 재창조 원고"를 작성하세요.

[네이버용 4대 재창조 핵심 메커니즘]
1. 문장 구조 및 어휘 재설계: 단순 단어 치환이 아니라 문장의 주어, 목적어, 서술어 구조를 완전히 다르게 재배치하여 100% 새로운 독립 문장으로 재구성하세요.
2. 어조 및 톤앤매너 변환: ${toneStyle}를 엄격히 적용하세요.
3. 도입부 및 마무리 창작: 네이버 블로그 이웃과 친근하게 소통할 수 있는 새로운 서론 인사말과 독자의 댓글/공감을 유도하는 친근한 결론을 새로 창작하세요.
4. 네이버 검색 키워드 & 소제목 최적화: 네이버 C-Rank / DIA+ 알고리즘이 선호하는 가독성 높은 소제목(##, ###)과 자연스러운 키워드 배치를 적용하세요.

[출력 가이드]
- 마크다운(Markdown) 포맷으로 작성하세요.
- 네이버 스마트에디터 3.0에 그대로 복사해서 붙여넣었을 때 시각적으로 시원하고 읽기 편하게 단락을 적절히 구성하세요.
- 불필요한 사족이나 인사말(예: "네이버용 글입니다") 없이 실제 블로그 포스팅 원고 본문만 출력하세요.
`;

    const userPrompt = `
[원본 글 제목]: ${originalTitle || "제목 없음"}

[원본 글 본문]:
${originalContent}
`;

    // 🌟 Vault key fallback processing
    await checkAndResetDailyCounts();
    const vaultKeys = await getActiveVaultKeys();

    if (!vaultKeys || vaultKeys.length === 0) {
      // Fallback to process.env.GEMINI_API_KEY if vault has no keys
      const envKey = process.env.GEMINI_API_KEY;
      if (!envKey) {
        return NextResponse.json(
          { error: "사용 가능한 Gemini API 키가 존재하지 않습니다." },
          { status: 500 }
        );
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${envKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const resultText = extractGeminiText(data);
      return NextResponse.json({ resultText });
    }

    let lastError: any = null;
    for (const keyRow of vaultKeys) {
      const apiKey = decryptVaultKey(keyRow);
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
                },
              ],
            }),
          }
        );

        const data = await res.json();
        if (!res.ok || data.error) {
          await recordVaultFailure(keyRow.id, data.error?.message || "Gemini API 오류");
          continue;
        }

        const resultText = extractGeminiText(data);
        await recordVaultSuccess(keyRow.id);
        return NextResponse.json({ resultText });
      } catch (err: any) {
        lastError = err;
        await recordVaultFailure(keyRow.id, err.message || "Gemini호출 실패");
      }
    }

    return NextResponse.json(
      { error: lastError?.message || "모든 Gemini API 키 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("AI Recreate API Error:", error);
    return NextResponse.json({ error: error.message || "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
