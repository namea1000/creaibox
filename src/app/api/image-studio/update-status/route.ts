import { createClient, createAdminClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userClient = await createClient();
    const adminClient = await createAdminClient();

    // 1. 쿠키 기반 세션 인증
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
    }

    const { action, imageId, sourceType, sourceId, imageRole } = await req.json();

    if (!action || !imageId) {
      return NextResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
    }

    if (action === "unlink") {
      // 2. 관리자 권한을 사용하여 이미지 포스트 연결 해제 (RLS 제약 우회)
      const { error } = await adminClient
        .from("generated_images")
        .update({
          source_type: null,
          source_id: null,
          is_primary: false,
          image_role: "generated"
        })
        .eq("id", imageId);

      if (error) {
        console.error("Unlink image error:", error);
        return NextResponse.json({ error: `연결 해제 실패: ${error.message}` }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else if (action === "set-primary") {
      if (!sourceType || !sourceId || !imageRole) {
        return NextResponse.json({ error: "대표 설정용 필수 파라미터가 누락되었습니다." }, { status: 400 });
      }

      // 1. 기존 모든 대표 설정 해제 (RLS 우회)
      const { error: clearError } = await adminClient
        .from("generated_images")
        .update({ is_primary: false })
        .eq("source_type", sourceType)
        .eq("source_id", String(sourceId))
        .eq("image_role", imageRole);

      if (clearError) {
        console.error("Clear primary error:", clearError);
        return NextResponse.json({ error: `기존 대표 이미지 해제 실패: ${clearError.message}` }, { status: 500 });
      }

      // 2. 현재 이미지를 대표로 설정 (RLS 우회)
      const { error: setError } = await adminClient
        .from("generated_images")
        .update({ is_primary: true })
        .eq("id", imageId);

      if (setError) {
        console.error("Set primary error:", setError);
        return NextResponse.json({ error: `대표 이미지 지정 실패: ${setError.message}` }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "지원하지 않는 액션입니다." }, { status: 400 });
    }
  } catch (err: any) {
    console.error("update-status API error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
