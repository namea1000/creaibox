import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    const adminSupabase = await createAdminClient();

    // Fetch client_sites for this user
    let query = adminSupabase
      .from("client_sites")
      .select("id, brand_id, company_name, created_at, status, extra_configs")
      .eq("profile_id", user.id);

    if (source) {
      query = query.eq("creation_source", source);
    }

    const { data: sites, error: dbError } = await query.order("created_at", { ascending: false });

    if (dbError) {
      console.error("Failed to fetch migration history:", dbError);
      return NextResponse.json({ error: "히스토리 조회 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: sites || [] });
  } catch (err: any) {
    console.error("History GET error:", err);
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId } = await request.json();

    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    // Verify ownership before deleting
    const { data: existingSite } = await adminSupabase
      .from("client_sites")
      .select("id")
      .eq("id", siteId)
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!existingSite) {
      return NextResponse.json({ error: "권한이 없거나 존재하지 않는 사이트입니다." }, { status: 403 });
    }

    const { error: deleteError } = await adminSupabase
      .from("client_sites")
      .delete()
      .eq("id", siteId);

    if (deleteError) {
      console.error("Failed to delete client_site:", deleteError);
      return NextResponse.json({ error: "사이트 삭제 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "사이트가 성공적으로 삭제되었습니다." });
  } catch (err: any) {
    console.error("History DELETE error:", err);
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
