import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { createClient } from "@/utils/supabase/server";

/**
 * GET: Retrieve active system settings by key
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") || "cron_trending_status";

  try {
    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("key, value")
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;

    // Return default fallback if row doesn't exist yet
    if (!data) {
      return NextResponse.json({ key, value: { active: true } });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Failed to fetch system settings:", err);
    return NextResponse.json({ error: err.message || "설정 조회 실패" }, { status: 500 });
  }
}

/**
 * POST: Create or Update (upsert) system setting values
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "key 혹은 value 파라미터가 누락되었습니다." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("system_settings")
      .upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true, key, value });
  } catch (err: any) {
    console.error("Failed to update system settings:", err);
    return NextResponse.json({ error: err.message || "설정 갱신 실패" }, { status: 500 });
  }
}
