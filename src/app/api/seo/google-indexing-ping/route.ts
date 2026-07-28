import { NextResponse } from "next/server";
import {
  sendGoogleIndexingPing,
  sendThrottledGoogleIndexingPing,
} from "@/lib/server/google-indexing";
import { sendIndexNowPing, sendThrottledIndexNowPing } from "@/lib/server/indexnow";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url, type = "URL_UPDATED", force = false } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "유효한 URL 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    if (force) {
      const result = await sendGoogleIndexingPing({ url, type });
      // Simultaneously trigger Bing, Yandex, and Naver IndexNow ping
      sendIndexNowPing({ url }).catch((e) => console.warn("IndexNow ping background error:", e));
      return NextResponse.json(result);
    } else {
      const throttledResult = await sendThrottledGoogleIndexingPing({
        url,
        type,
      });
      // Simultaneously trigger Bing, Yandex, and Naver IndexNow ping (with 1h smart cooldown)
      sendThrottledIndexNowPing({ url }).catch((e) => console.warn("IndexNow ping background error:", e));
      return NextResponse.json({
        success: true,
        url,
        type,
        status: throttledResult.status,
        message:
          throttledResult.status === "SENT"
            ? "구글 실시간 색인 핑 즉시 전송 완료"
            : "쿨다운 이내 요청: 1시간 후 최종 핑이 자동 예약되었습니다.",
        result: throttledResult.result,
      });
    }
  } catch (error) {
    console.error("[Google Indexing Route Error]", error);
    return NextResponse.json(
      {
        error: "Google Indexing API 처리 중 서버 오류가 발생했습니다.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
