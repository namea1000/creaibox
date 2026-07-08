import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

// GET: 특정 사용자의 문의 내역 리스트 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "조회할 이메일 주소가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("customer_inquiries")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch inquiries DB error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error("Fetch inquiries API error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST: 신규 1:1 문의 또는 사이트 개선 제안 등록
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, phone, category, title, content } = body;

    if (!userEmail || !category || !title || !content) {
      return NextResponse.json(
        { success: false, error: "필수 입력 항목(이메일, 카테고리, 제목, 내용)이 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("customer_inquiries")
      .insert([
        {
          user_email: userEmail,
          phone: phone || null,
          category,
          title,
          content,
          status: "pending"
        }
      ])
      .select();

    if (error) {
      console.error("Insert inquiry DB error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error("Insert inquiry API error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
