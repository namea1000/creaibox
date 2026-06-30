import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

async function checkIsAdminEmail(email?: string | null) {
  if (!email) return false;
  const { data, error } = await supabaseAdmin
    .from("admin_whitelist")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return !error && !!data;
}

export async function GET(req: NextRequest) {
  const email = req.headers.get("x-admin-email");

  if (!(await checkIsAdminEmail(email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: usersData, error: usersError } =
    await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  const userIds = usersData.users.map((user) => user.id);

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .in("id", userIds);

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  const { data: usageLogs } = await supabaseAdmin
    .from("ai_generation_usage_logs")
    .select("user_id, created_at")
    .in("user_id", userIds);

  // 화이트리스트에 등록된 전체 이메일 조회
  const userEmails = usersData.users.map((u) => u.email).filter(Boolean) as string[];
  const { data: whitelist } = await supabaseAdmin
    .from("admin_whitelist")
    .select("email")
    .in("email", userEmails);

  const whitelistedEmails = new Set(whitelist?.map((w) => w.email) || []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = usersData.users.map((user) => {
    const profile = profiles?.find((p) => p.id === user.id);
    const emailStr = profile?.email || user.email || "";

    const logs =
      usageLogs?.filter((log) => log.user_id === user.id) || [];

    const todayUsage = logs.filter(
      (log) => new Date(log.created_at) >= today
    ).length;

    return {
      id: user.id,
      email: emailStr || "-",
      name:
        profile?.nickname ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Unknown",
      nickname: profile?.nickname || null,
      brandId: profile?.brand_id || null,
      role: profile?.role || "FREE",
      membershipLevel: profile?.membership_level || "free",
      status: profile?.status || "ACTIVE",
      todayUsage,
      totalUsage: logs.length,
      joinedAt: profile?.created_at || user.created_at,
      lastLogin: profile?.last_login_at || user.last_sign_in_at || null,
      adminMemo: profile?.admin_memo || "",
      isWhitelisted: whitelistedEmails.has(emailStr),
    };
  });

  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest) {
  const email = req.headers.get("x-admin-email");

  if (!(await checkIsAdminEmail(email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  // 화이트리스트 개별 추가/제거 동작 처리
  if (body.addToWhitelist && body.email) {
    const { error: insertError } = await supabaseAdmin
      .from("admin_whitelist")
      .upsert({ email: body.email }, { onConflict: "email" });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.removeFromWhitelist && body.email) {
    const { error: deleteError } = await supabaseAdmin
      .from("admin_whitelist")
      .delete()
      .eq("email", body.email);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // 역할이 ADMIN에서 다른 권한으로 강제 강등될 때, 화이트리스트에서도 자동 탈락시킴 (안전장치)
  if (body.membershipLevel !== undefined && body.membershipLevel.toLowerCase() !== "admin") {
    const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(body.id);
    const targetEmail = targetUser?.user?.email;
    if (targetEmail) {
      await supabaseAdmin.from("admin_whitelist").delete().eq("email", targetEmail);
    }
  }

  const updateData: any = {
    id: body.id,
    updated_at: new Date().toISOString(),
  };

  if (body.membershipLevel !== undefined) {
    const ml = body.membershipLevel.toLowerCase();
    updateData.membership_level = ml;
    updateData.role =
      ml === "admin"
        ? "ADMIN"
        : ml === "free"
          ? "FREE"
          : "PAID";
  }

  if (body.status !== undefined) {
    updateData.status = body.status;
  }

  if (body.adminMemo !== undefined) {
    updateData.admin_memo = body.adminMemo;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert(updateData, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}