import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

async function checkIsAdmin(adminSupabase: any, email?: string | null) {
  if (!email) return false;
  if (ADMIN_EMAILS.includes(email)) return true;
  const { data, error } = await adminSupabase
    .from("admin_whitelist")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return !error && !!data;
}

// GET: Fetch all profiles requesting brands/domains and reserved brand IDs (bypassing RLS)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !(await checkIsAdmin(adminSupabase, user.email))) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    // 1. Fetch profiles with brand/domain info
    const { data: profiles, error: profilesErr } = await adminSupabase
      .from("profiles")
      .select("id, nickname, email, brand_id, requested_brand_id, brand_id_status, brand_id_rejection_reason, extra_configs, updated_at")
      .order("updated_at", { ascending: false });

    if (profilesErr) throw profilesErr;

    const filteredRequests = (profiles || []).filter((r: any) => {
      const hasBrandId = !!r.brand_id;
      const hasRequestedBrand = !!r.requested_brand_id;
      const hasAdditionalBrands = Array.isArray(r.extra_configs?.brand_ids) && r.extra_configs.brand_ids.length > 0;
      const hasCustomDomain = !!r.extra_configs?.custom_domain || !!r.extra_configs?.requested_custom_domain;
      
      let hasFlatCustomDomain = false;
      if (r.extra_configs) {
        for (const key of Object.keys(r.extra_configs)) {
          if (key.startsWith("custom_domain_") || key.startsWith("requested_custom_domain_")) {
            if (r.extra_configs[key]) {
              hasFlatCustomDomain = true;
              break;
            }
          }
        }
      }

      return hasBrandId || hasRequestedBrand || hasAdditionalBrands || hasCustomDomain || hasFlatCustomDomain;
    });

    // 2. Fetch reserved brand IDs (blacklist)
    const { data: blacklist, error: blacklistErr } = await adminSupabase
      .from("reserved_brand_ids")
      .select("*")
      .order("created_at", { ascending: false });

    if (blacklistErr) throw blacklistErr;

    return NextResponse.json({
      success: true,
      requests: filteredRequests,
      blacklist: blacklist || [],
    });
  } catch (error: any) {
    console.error("GET /api/admin/brands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Manage Blacklist (Add/Delete reserved brand IDs)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !(await checkIsAdmin(adminSupabase, user.email))) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { action, brandId, reason, id } = body;

    if (action === "add_reserved") {
      const cleanId = (brandId || "").trim().toLowerCase();
      if (!cleanId || !/^[a-z0-9]{2,15}$/.test(cleanId)) {
        return NextResponse.json({ error: "유효하지 않은 브랜드 ID입니다. (영문 소문자/숫자 2~15자)" }, { status: 400 });
      }

      const { error } = await adminSupabase
        .from("reserved_brand_ids")
        .insert({
          brand_id: cleanId,
          reason: (reason || "").trim() || "관리자 예약어",
        });

      if (error) throw error;
      return NextResponse.json({ success: true, message: `'${cleanId}' 예약어가 등록되었습니다.` });
    }

    if (action === "delete_reserved") {
      if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
      }

      const { error } = await adminSupabase
        .from("reserved_brand_ids")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "예약어가 삭제되었습니다." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/admin/brands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
