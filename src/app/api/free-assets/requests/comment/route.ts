import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. 사용자 로그인 인증 정보 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 2. Request Body 파싱
    const body = await request.json();
    const { requestId, comment } = body;

    if (!requestId || !comment || String(comment).trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "요청 ID와 댓글 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    // 3. 관리자 권한 검증 (Double-Check)
    // A. profiles 테이블 role 체크
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // B. admin_whitelist 테이블 이메일 존재 체크
    const { data: whitelistUser } = await supabase
      .from("admin_whitelist")
      .select("email")
      .eq("email", user.email)
      .maybeSingle();

    const isAuthorized =
      profile?.role === "ADMIN" ||
      profile?.role === "STAFF" ||
      profile?.role === "SUPER_ADMIN" ||
      !!whitelistUser;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "관리자 또는 스태프 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // 4. 요청 테이블 업데이트 (status를 completed로 변경하고 코멘트 및 관련 필드 기록)
    const { data: updatedData, error: updateError } = await supabase
      .from("free_asset_requests")
      .update({
        status: "completed",
        comment: comment,
        commenter_email: user.email,
        commented_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "코멘트 등록 및 완료 처리가 완료되었습니다.",
      data: updatedData,
    });
  } catch (error: any) {
    console.error("Failed to post comment and complete free asset request:", error);
    return NextResponse.json(
      { success: false, error: "작업 수행 중 에러가 발생했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
