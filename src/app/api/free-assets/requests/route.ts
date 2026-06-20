import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 1. GET: 이미지 제작 요청 전체 목록 조회
export async function GET() {
  try {
    const supabase = await createClient();

    // free_asset_requests 테이블에서 최신순으로 정렬하여 조회
    const { data: requests, error } = await supabase
      .from("free_asset_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Database select error: ${error.message}`);
    }

    return NextResponse.json({ success: true, data: requests || [] });
  } catch (error: any) {
    console.error("Failed to fetch free asset requests:", error);
    return NextResponse.json(
      { success: false, error: "Database query error", details: error.message },
      { status: 500 }
    );
  }
}

// 2. POST: 일반 회원의 신규 이미지 제작 요청 등록
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 사용자 인증 정보 획득
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

    // Request Body 파싱
    const body = await request.json();
    const { mediaType, description } = body;

    if (!mediaType || !description || String(description).trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "미디어 대분류 및 5자 이상의 구체적인 요청 내용을 작성해주세요." },
        { status: 400 }
      );
    }

    // profiles 테이블에서 사용자의 nickname 획득
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();

    const userNickname = profile?.nickname || user.email?.split("@")[0] || "익명";

    // free_asset_requests에 신규 요청 건 삽입
    const { data, error: insertError } = await supabase
      .from("free_asset_requests")
      .insert({
        user_id: user.id,
        user_email: user.email,
        user_nickname: userNickname,
        media_type: mediaType,
        description: description,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert error: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "이미지 제작 요청이 성공적으로 등록되었습니다.",
      data,
    });
  } catch (error: any) {
    console.error("Failed to create free asset request:", error);
    return NextResponse.json(
      { success: false, error: "요청 등록 중 에러가 발생했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
