import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

// GET: 모든 접수된 1:1 문의 및 사이트 개선 건의 목록 로드
export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customer_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch admin inquiries DB error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error("Fetch admin inquiries API error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PATCH: 특정 문의에 관리자 답변 등록 및 완료 상태 변경
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, adminReply } = body;

    if (!id || adminReply === undefined) {
      return NextResponse.json(
        { success: false, error: "식별 번호(id) 또는 답변 내용이 유실되었습니다." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("customer_inquiries")
      .update({
        admin_reply: adminReply || null,
        status: adminReply ? "replied" : "pending",
        replied_at: adminReply ? new Date().toISOString() : null
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Patch admin reply DB error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error("Patch admin reply API error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
