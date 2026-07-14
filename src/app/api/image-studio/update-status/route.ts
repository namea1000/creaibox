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

      // 1. 지정하려는 이미지의 원본 소유 정보 조회
      const { data: targetImage, error: selectImgError } = await adminClient
        .from("generated_images")
        .select("*")
        .eq("id", imageId)
        .single();

      if (selectImgError || !targetImage) {
        console.error("Select image error:", selectImgError);
        return NextResponse.json({ error: "대상 이미지를 찾을 수 없습니다." }, { status: 404 });
      }

      const targetSourceId = targetImage.source_id ? String(targetImage.source_id) : "";
      const currentSourceId = String(sourceId);

      // 2. 현재 글(sourceId)의 기존 모든 대표 설정 해제 (RLS 우회)
      const { error: clearError } = await adminClient
        .from("generated_images")
        .update({ is_primary: false })
        .eq("source_type", sourceType)
        .eq("source_id", currentSourceId)
        .eq("image_role", imageRole);

      if (clearError) {
        console.error("Clear primary error:", clearError);
        return NextResponse.json({ error: `기존 대표 이미지 해제 실패: ${clearError.message}` }, { status: 500 });
      }

      // 3. 만약 다른 소유글(source_id)에 엮여 있는 레코드인 경우, 이전 글의 대표 이미지를 뺏지 않고 현재 글 소속으로 "안전 복제 등록" 처리
      if (targetSourceId && targetSourceId !== currentSourceId) {
        const { error: cloneError } = await adminClient
          .from("generated_images")
          .insert({
            user_id: targetImage.user_id || user.id,
            prompt: targetImage.prompt || "복제된 대표 이미지 설정",
            image_url: targetImage.image_url,
            style: targetImage.style || "manual",
            aspect_ratio: targetImage.aspect_ratio || "content",
            provider: targetImage.provider || "upload",
            source_type: sourceType,
            source_id: currentSourceId,
            image_role: imageRole,
            is_primary: true,
            title: targetImage.title || "대표 이미지",
            caption: targetImage.caption || "",
            description: targetImage.description || "",
            alt_text: targetImage.alt_text || "",
          });

        if (cloneError) {
          console.error("Clone and set primary error:", cloneError);
          return NextResponse.json({ error: `대표 이미지 안전 복제 실패: ${cloneError.message}` }, { status: 500 });
        }
      } else {
        // 소유주가 없거나 현재 글과 같으면 소유 관계 업데이트 및 대표 설정 적용
        const { error: setError } = await adminClient
          .from("generated_images")
          .update({
            is_primary: true,
            source_type: sourceType,
            source_id: currentSourceId,
            image_role: imageRole
          })
          .eq("id", imageId);

        if (setError) {
          console.error("Set primary error:", setError);
          return NextResponse.json({ error: `대표 이미지 지정 실패: ${setError.message}` }, { status: 500 });
        }
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
