import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getActiveVaultKeys, decryptVaultKey } from "@/lib/server/get-free-gemini-key";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      prompt,
      aspectRatio = "16:9",
      apiKey,
      model = "veo-3.1-generate-preview",
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "프롬프트가 없습니다." },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return NextResponse.json(
        { error: "로그인 세션을 확인할 수 없습니다." },
        { status: 401 }
      );
    }

    // 1. 테스터 화이트리스트 검증
    const allowedEmails = (process.env.ALLOWED_TESTER_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (allowedEmails.length > 0 && !allowedEmails.includes(user.email.toLowerCase())) {
      return NextResponse.json(
        { error: "클로즈 베타 테스터 권한이 없습니다. 등록된 이메일 계정으로 로그인해주세요." },
        { status: 403 }
      );
    }

    // 2. API Key 확인 (전달받은 키 -> env -> admin_api_vault 순서)
    let finalApiKey = apiKey || process.env.GEMINI_API_KEY;
    if (!finalApiKey) {
      try {
        const vaultKeys = await getActiveVaultKeys("gemini");
        if (vaultKeys.length > 0) {
          finalApiKey = decryptVaultKey(vaultKeys[0]);
        }
      } catch (err) {
        console.error("Failed to fetch API key from vault:", err);
      }
    }

    if (!finalApiKey) {
      return NextResponse.json(
        { error: "사용 가능한 Gemini API Key가 없습니다." },
        { status: 400 }
      );
    }

    // 3. Google Veo predictLongRunning REST API 호출
    const targetModel = model || "veo-3.1-generate-preview";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:predictLongRunning?key=${finalApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": finalApiKey,
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt,
            },
          ],
          parameters: {
            sampleCount: 1,
            resolution: "720p",
            aspectRatio: aspectRatio || "16:9",
            durationSeconds: 5,
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Veo 비디오 생성 요청 실패");
    }

    // Response structure should contain the operation name:
    // e.g. { "name": "operations/abc123xyz", ... }
    const operationName = data.name;

    if (!operationName) {
      throw new Error("비디오 생성 작업 이름(Operation Name)을 받지 못했습니다.");
    }

    // operationId만 추출해서 전달 (operations/ 부분을 파싱)
    const operationId = operationName.startsWith("operations/")
      ? operationName.replace("operations/", "")
      : operationName;

    return NextResponse.json({
      success: true,
      operationId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "비디오 생성 시작 실패",
      },
      { status: 500 }
    );
  }
}
