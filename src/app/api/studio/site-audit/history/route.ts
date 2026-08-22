import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from("site_audits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("GET /api/studio/site-audit/history DB note:", error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: any) {
    console.error("GET /api/studio/site-audit/history error:", err);
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "삭제할 진단 ID가 누락되었습니다." }, { status: 400 });
    }

    const { error } = await supabase
      .from("site_audits")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: "진단 기록이 삭제되었습니다." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "삭제 실패" }, { status: 500 });
  }
}
