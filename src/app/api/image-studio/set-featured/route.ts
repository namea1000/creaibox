import { createClient, createAdminClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userClient = await createClient();
    const adminClient = await createAdminClient();

    // 쿠키 기반으로 유저 세션 획득
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
    }

    const {
      imageUrl,
      prompt,
      style,
      aspectRatio,
      provider,
      sourceType,
      sourceId,
      imageRole,
      title,
      caption,
      description,
      altText,
    } = await req.json();

    if (!sourceType || !sourceId || !imageRole || !imageUrl) {
      return NextResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
    }

    // 1. 기존 모든 대표 설정 해제 (어드민 클라이언트를 사용하여 RLS 제약 없이 일괄 해제)
    const { error: clearError } = await adminClient
      .from("generated_images")
      .update({ is_primary: false })
      .eq("source_type", sourceType)
      .eq("source_id", String(sourceId))
      .eq("image_role", imageRole);

    if (clearError) {
      console.error("Set featured image - clear error:", clearError);
      return NextResponse.json({ error: `기존 대표 이미지 해제 실패: ${clearError.message}` }, { status: 500 });
    }

    // 2. 선택된 이미지 정보를 현재 유저 소유로 안전 복제하여 대표 설정
    const { data: inserted, error: insertError } = await adminClient
      .from("generated_images")
      .insert({
        user_id: user.id,
        prompt: prompt || "대표 이미지 설정",
        image_url: imageUrl,
        style: style || "manual",
        aspect_ratio: aspectRatio || "content",
        provider: provider || "upload",
        source_type: sourceType,
        source_id: String(sourceId),
        image_role: imageRole,
        is_primary: true,
        title: title || "대표 이미지",
        caption: caption || "",
        description: description || "",
        alt_text: altText || "",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Set featured image - insert error:", insertError);
      return NextResponse.json({ error: `대표 이미지 등록 실패: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (err: any) {
    console.error("Set featured image API error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
