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

function getAdminEmail(req: NextRequest) {
  return req.headers.get("x-admin-email");
}

export async function GET(req: NextRequest) {
  const email = getAdminEmail(req);

  if (!(await checkIsAdminEmail(email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("admin_api_vault")
    .select("note")
    .eq("provider", "system")
    .eq("model", "plan_limits")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const defaultLimits = {
    free: 20,
    creator: 50,
    pro: 100,
    business: 200,
    admin: 1000,
  };

  if (data?.note) {
    try {
      return NextResponse.json(JSON.parse(data.note));
    } catch {
      return NextResponse.json(defaultLimits);
    }
  }

  return NextResponse.json(defaultLimits);
}

export async function POST(req: NextRequest) {
  const email = getAdminEmail(req);

  if (!(await checkIsAdminEmail(email))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data: existing, error: findError } = await supabaseAdmin
    .from("admin_api_vault")
    .select("id")
    .eq("provider", "system")
    .eq("model", "plan_limits")
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  let error;
  if (existing?.id) {
    const { error: updateErr } = await supabaseAdmin
      .from("admin_api_vault")
      .update({
        note: JSON.stringify(body),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    error = updateErr;
  } else {
    const { error: insertErr } = await supabaseAdmin
      .from("admin_api_vault")
      .insert([
        {
          key: "system_placeholder",
          label: "System Plan Limits Config",
          display_name: "Plan Limits Config",
          provider_type: "system",
          provider: "system",
          model: "plan_limits",
          status: "active",
          note: JSON.stringify(body),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    error = insertErr;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
