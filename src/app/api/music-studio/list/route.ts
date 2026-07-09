import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { listR2Music } from "@/lib/r2";

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

    // 2. Cloudflare R2에서 오디오 파일 리스트 조회
    const files = await listR2Music();

    const r2PublicUrl = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/$/, "");

    // 스트리밍 링크를 포함한 트랙 배열 형태로 가공
    const tracks = files.map((file, index) => {
      // Direct Cloudflare R2 Public CDN streaming URL bypassing Vercel Proxy
      const streamUrl = `${r2PublicUrl}/${file.key}`;
      
      return {
        id: file.key, // Use R2 Object Key as unique ID
        title: file.name.replace(/\.[^/.]+$/, ""), // Strip extension for title
        fileName: file.name,
        mimeType: file.name.toLowerCase().endsWith(".wav") ? "audio/wav" : "audio/mpeg",
        size: file.size,
        createdAt: file.lastModified.toISOString(),
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
