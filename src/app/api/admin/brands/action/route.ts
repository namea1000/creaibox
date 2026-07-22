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
    const { action, userId, brandId, requestedDomain, reason } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing required parameters: userId, action" }, { status: 400 });
    }

    // 1. Fetch current profile
    const { data: profile, error: fetchErr } = await adminSupabase
      .from("profiles")
      .select("brand_id, brand_id_status, requested_brand_id, extra_configs")
      .eq("id", userId)
      .single();

    if (fetchErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // --- Action Handlers ---

    // 1. Reject Subdomain Request
    if (action === "reject-subdomain") {
      if (!reason || !reason.trim()) {
        return NextResponse.json({ error: "반려 사유를 입력해 주세요." }, { status: 400 });
      }

      const { error } = await adminSupabase
        .from("profiles")
        .update({
          brand_id_status: "REJECTED",
          brand_id_rejection_reason: reason.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `'${brandId}' 브랜드 ID 신청이 반려되었습니다.` });
    }

    // 2. Cancel Subdomain Approval (Reset to PENDING)
    if (action === "cancel-approve-subdomain") {
      let primary_brand_id = profile.brand_id || "";
      let brand_ids = profile.extra_configs?.brand_ids || [];

      if (primary_brand_id === brandId) {
        if (brand_ids.length > 0) {
          primary_brand_id = brand_ids[0];
          brand_ids = brand_ids.slice(1);
        } else {
          primary_brand_id = "";
        }
      } else {
        brand_ids = brand_ids.filter((bid: string) => bid !== brandId);
      }

      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        brand_ids: brand_ids,
      };

      const { error } = await adminSupabase
        .from("profiles")
        .update({
          brand_id: primary_brand_id || null,
          brand_id_status: "PENDING",
          requested_brand_id: brandId,
          brand_id_rejection_reason: null,
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `'${brandId}' 브랜드 ID 승인이 취소되어 대기 상태로 변경되었습니다.` });
    }

    // 3. Approve Custom Domain
    if (action === "approve-custom-domain") {
      if (!requestedDomain) {
        return NextResponse.json({ error: "Missing requestedDomain" }, { status: 400 });
      }

      const isPrimary = profile.brand_id === brandId;
      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        [`custom_domain_${brandId}`]: requestedDomain,
        [`requested_custom_domain_${brandId}`]: null,
        [`custom_domain_status_${brandId}`]: "APPROVED",
        [`custom_domain_rejection_reason_${brandId}`]: null,
      };

      if (isPrimary) {
        nextExtraConfigs.custom_domain = requestedDomain;
        nextExtraConfigs.requested_custom_domain = null;
        nextExtraConfigs.custom_domain_status = "APPROVED";
        nextExtraConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await adminSupabase
        .from("profiles")
        .update({
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `'${requestedDomain}' 독립 도메인 연결 승인이 완료되었습니다.` });
    }

    // 4. Reject Custom Domain
    if (action === "reject-custom-domain") {
      if (!reason || !reason.trim()) {
        return NextResponse.json({ error: "반려 사유를 입력해 주세요." }, { status: 400 });
      }

      const isPrimary = profile.brand_id === brandId;
      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        [`custom_domain_status_${brandId}`]: "REJECTED",
        [`custom_domain_rejection_reason_${brandId}`]: reason.trim(),
      };

      if (isPrimary) {
        nextExtraConfigs.custom_domain_status = "REJECTED";
        nextExtraConfigs.custom_domain_rejection_reason = reason.trim();
      }

      const { error } = await adminSupabase
        .from("profiles")
        .update({
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `'${requestedDomain || brandId}' 독립 도메인 신청이 반려되었습니다.` });
    }

    // 5. Cancel Custom Domain Approval (Reset to PENDING)
    if (action === "cancel-custom-domain") {
      const isPrimary = profile.brand_id === brandId;
      const domain = requestedDomain || profile.extra_configs?.[`custom_domain_${brandId}`] || profile.extra_configs?.custom_domain || "";

      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        [`custom_domain_${brandId}`]: null,
        [`requested_custom_domain_${brandId}`]: domain,
        [`custom_domain_status_${brandId}`]: "PENDING",
        [`custom_domain_rejection_reason_${brandId}`]: null,
      };

      if (isPrimary) {
        nextExtraConfigs.custom_domain = null;
        nextExtraConfigs.requested_custom_domain = domain;
        nextExtraConfigs.custom_domain_status = "PENDING";
        nextExtraConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await adminSupabase
        .from("profiles")
        .update({
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `'${domain}' 독립 도메인 승인이 취소되어 대기 상태로 변경되었습니다.` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/admin/brands/action error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
