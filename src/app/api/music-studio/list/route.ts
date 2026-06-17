import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { listGoogleDriveMusic } from "@/lib/google-drive";
import { createHmac } from "crypto";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
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

    // 2. 구글 드라이브 뮤직 폴더 ID 검증
    const musicFolderId = process.env.GDRIVE_MUSIC_FOLDER_ID;
    if (!musicFolderId) {
      return NextResponse.json(
        { error: "GDRIVE_MUSIC_FOLDER_ID 환경 변수가 설정되지 않았습니다." },
        { status: 400 }
      );
    }

    // 3. 구글 드라이브에서 오디오 파일 리스트 조회
    const files = await listGoogleDriveMusic(musicFolderId);

    const secret = process.env.API_VAULT_ENCRYPTION_KEY || "fallback_secret";
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours expiration

    // 스트리밍 링크를 포함한 트랙 배열 형태로 가공
    const tracks = files.map((file, index) => {
      // Generate signature for authorization token bypass in stream route
      const tokenInput = `${file.id}:${expiresAt}`;
      const signature = createHmac("sha256", secret).update(tokenInput).digest("hex");

      // Internal proxy streaming URL supporting Range bytes requests with signed token
      const streamUrl = `/api/music-studio/stream?id=${file.id}&expires=${expiresAt}&sig=${signature}`;
      return {
        id: file.id || `track-${index}`,
        title: (file.name || "Untitled Track").replace(/\.[^/.]+$/, ""), // 확장자 제거
        fileName: file.name || "Untitled Track",
        mimeType: file.mimeType || "audio/mpeg",
        size: Number(file.size) || 0,
        createdAt: file.createdTime || new Date().toISOString(),
        streamUrl,
      };
    });

    return NextResponse.json({
      success: true,
      album: "Awakening",
      genre: "Vocal Trance",
      tracks,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "음악 목록을 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
