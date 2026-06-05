import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email));
}

export async function GET(req: NextRequest) {
  const email = req.headers.get("x-admin-email");

  if (!isAdminEmail(email)) {
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = usersData.users.map((user) => {
    const profile = profiles?.find((p) => p.id === user.id);

    const logs =
      usageLogs?.filter((log) => log.user_id === user.id) || [];

    const todayUsage = logs.filter(
      (log) => new Date(log.created_at) >= today
    ).length;

    return {
      id: user.id,
      email: profile?.email || user.email || "-",
      name:
        profile?.nickname ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Unknown",
      role: profile?.role || "FREE",
      status: profile?.status || "ACTIVE",
      todayUsage,
      totalUsage: logs.length,
      joinedAt: profile?.created_at || user.created_at,
      lastLogin: profile?.last_login_at || user.last_sign_in_at || null,
    };
  });

  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest) {
  const email = req.headers.get("x-admin-email");

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("profiles").upsert(
    {
      id: body.id,
      role: body.role,
      status: body.status,
      membership_level:
        body.role === "PAID"
          ? "pro"
          : body.role === "ADMIN"
            ? "admin"
            : body.role === "MANAGER"
              ? "manager"
              : "free",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}