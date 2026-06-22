import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getGoogleDriveBuffer } from "@/lib/google-drive";
import { Readable } from "stream";
import { createHmac } from "crypto";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    // 1. 파일 ID 및 서명 파라미터 파싱
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");
    const expires = searchParams.get("expires");
    const sig = searchParams.get("sig");

    if (!fileId) {
      return new Response("파일 ID(id) 파라미터가 필요합니다.", { status: 400 });
    }

    // 2. URL 토큰 서명 유효성 검사 (쿠키 없는 브라우저/오디오 엔진용 우회)
    let isAuthorized = false;
    if (expires && sig) {
      const expiresTime = parseInt(expires, 10);
      if (expiresTime > Date.now()) {
        const secret = process.env.API_VAULT_ENCRYPTION_KEY || "fallback_secret";
        const tokenInput = `${fileId}:${expires}`;
        const expectedSig = createHmac("sha256", secret).update(tokenInput).digest("hex");
        if (sig === expectedSig) {
          isAuthorized = true;
        }
      }
    }

    // 3. 토큰 서명이 없거나 유효하지 않으면 일반 쿠키 세션 검증 진행
    if (!isAuthorized) {
      const supabase = await createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        return new Response("로그인 세션을 확인할 수 없습니다.", { status: 401 });
      }

      // 테스터 화이트리스트 검증
      const allowedEmails = (process.env.ALLOWED_TESTER_EMAILS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

      if (allowedEmails.length > 0 && !allowedEmails.includes(user.email.toLowerCase())) {
        return new Response("클로즈 베타 테스터 권한이 없습니다.", { status: 403 });
      }
    }

    // 3. Range 헤더 파싱 및 전달
    const rangeHeader = req.headers.get("range") || undefined;

    // 4. Google Drive 버퍼 가져오기
    const res = await getGoogleDriveBuffer(fileId, rangeHeader);

    // Helper to get headers safely regardless of whether it's a plain object or Headers instance
    const getHeader = (h: any, key: string): string | undefined => {
      if (!h) return undefined;
      if (typeof h.get === "function") {
        return h.get(key) || undefined;
      }
      return h[key] || h[key.toLowerCase()] || h[key.toUpperCase()] || undefined;
    };

    // 5. 응답 헤더 구성
    const contentType = getHeader(res.headers, "Content-Type") || "audio/mpeg";
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600",
    };

    const contentLength = getHeader(res.headers, "Content-Length");
    if (contentLength) {
      headers["Content-Length"] = String(contentLength);
    }
    const contentRange = getHeader(res.headers, "Content-Range");
    if (contentRange) {
      headers["Content-Range"] = String(contentRange);
    }

    return new NextResponse(new Uint8Array(res.data) as any, {
      status: res.status,
      headers,
    });
  } catch (error: any) {
    console.error("Stream route error:", error);
    return new Response(error.message || "스트리밍 오류가 발생했습니다.", {
      status: 500,
    });
  }
}
