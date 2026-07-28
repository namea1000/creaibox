import { NextRequest, NextResponse } from "next/server";
import { triggerUnifiedSeoIndexingPing } from "@/lib/server/unified-indexing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, urls } = body;

    if (!url && (!urls || urls.length === 0)) {
      return NextResponse.json(
        { error: "인덱싱할 URL이 지정되지 않았습니다." },
        { status: 400 }
      );
    }

    const result = await triggerUnifiedSeoIndexingPing({ url, urls });

    return NextResponse.json({
      message: "통합 SEO 색인 핑(Google, Bing, Yandex, Naver IndexNow) 전송이 완료되었습니다.",
      result,
    });
  } catch (err: any) {
    console.error("Unified Indexing API Error:", err);
    return NextResponse.json(
      { error: err.message || "SEO 핑 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
