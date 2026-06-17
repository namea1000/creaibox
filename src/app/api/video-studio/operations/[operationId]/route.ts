import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getActiveVaultKeys, decryptVaultKey } from "@/lib/server/get-free-gemini-key";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ operationId: string }> }
) {
  try {
    const { operationId } = await params;
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get("apiKey");

    if (!operationId) {
      return NextResponse.json(
        { error: "작업 ID(Operation ID)가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
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

    // 3. Google Long Running Operation 조회
    // operationId가 전체 경로(operations/...) 형태일 수 있으므로 포맷 통일
    const operationName = operationId.startsWith("operations/")
      ? operationId
      : `operations/${operationId}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${finalApiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": finalApiKey,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "작업 상태 조회 실패");
    }

    // 작업이 완료되지 않은 경우 상태만 반환
    if (!data.done) {
      return NextResponse.json({
        done: false,
        status: "processing",
      });
    }

    // 작업 실패 처리
    if (data.error) {
      throw new Error(data.error.message || "비디오 생성 중 구글 API 내부 오류 발생");
    }

    // 작업 완료 처리 - 생성된 비디오 파일 정보 추출
    const fileUri = data.response?.generatedVideos?.[0]?.video?.uri;
    if (!fileUri) {
      throw new Error("생성 결과 비디오 파일 URI를 찾을 수 없습니다.");
    }

    // 4. 비디오 파일 메타데이터(downloadUri) 획득
    const metaRes = await fetch(`${fileUri}?key=${finalApiKey}`, {
      headers: {
        "x-goog-api-key": finalApiKey,
      },
    });
    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      throw new Error(metaData.error?.message || "비디오 메타데이터 조회 실패");
    }

    const downloadUri = metaData.downloadUri;
    if (!downloadUri) {
      throw new Error("비디오 다운로드 주소(downloadUri)를 획득하지 못했습니다.");
    }

    // 5. 다운로드 및 Supabase Storage 업로드
    const videoFileRes = await fetch(downloadUri);
    if (!videoFileRes.ok) {
      throw new Error("구글 CDN 서버로부터 비디오 바이너리를 내려받지 못했습니다.");
    }

    const videoBuffer = Buffer.from(await videoFileRes.arrayBuffer());
    const fileName = `${Date.now()}-veo.mp4`;
    const filePath = `${user.id}/video-studio/${fileName}`;

    // community 버킷을 사용하여 외부 공개 링크 획득
    const { error: uploadError } = await supabase.storage
      .from("community")
      .upload(filePath, videoBuffer, {
        contentType: "video/mp4",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Supabase Storage 업로드 실패: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("community")
      .getPublicUrl(filePath);

    return NextResponse.json({
      done: true,
      status: "completed",
      videoUrl: publicUrlData.publicUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "작업 조회 실패",
      },
      { status: 500 }
    );
  }
}
