import { NextRequest, NextResponse } from "next/server";
import { encryptApiKey, maskApiKey } from "@/lib/server/api-vault-crypto";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

const ADMIN_EMAILS = ["jenam7720@gmail.com", "namjjang7720@gmail.com"];

function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email));
}

function getAdminEmail(req: NextRequest) {
  return req.headers.get("x-admin-email");
}

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  return fallback;
}

function buildVaultPayload(body: any, shouldEncryptKey: boolean) {
  const payload: Record<string, any> = {
    provider_type: body.provider_type || "ai",
    provider: body.provider || "gemini",
    model: body.model || "gemini-3-flash-preview",

    label: body.label,
    display_name: body.display_name,
    status: body.status || "active",

    allowed_plan: body.allowed_plan || "free",
    priority: toNumber(body.priority, 100),

    daily_limit: toNumber(body.daily_limit, 1000),
    monthly_limit: toNumber(body.monthly_limit, 30000),

    cost_weight: toNumber(body.cost_weight, 1),
    quality_score: toNumber(body.quality_score, 80),

    supports_search: toBoolean(body.supports_search, true),
    supports_streaming: toBoolean(body.supports_streaming, false),
    is_fallback: toBoolean(body.is_fallback, true),

    api_base_url: body.api_base_url || null,
    usage_unit: body.usage_unit || "request",
    note: body.note || null,

    updated_at: new Date().toISOString(),
  };

  if (shouldEncryptKey && body.key && String(body.key).trim()) {
    payload.key = encryptApiKey(String(body.key).trim());
  }

  return payload;
}

export async function GET(req: NextRequest) {
  const email = getAdminEmail(req);

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("admin_api_vault")
    .select("*")
    .order("provider_type", { ascending: true })
    .order("provider", { ascending: true })
    .order("priority", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const safeData = (data || []).map((item) => ({
    ...item,
    key: maskApiKey(),
  }));

  return NextResponse.json(safeData);
}

export async function POST(req: NextRequest) {
  const email = getAdminEmail(req);

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.key || !body.label || !body.display_name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const payload = {
    ...buildVaultPayload(body, true),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("admin_api_vault")
    .insert([payload]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const email = getAdminEmail(req);

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (!body.label || !body.display_name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const shouldEncryptKey = Boolean(body.key && String(body.key).trim());
  const payload = buildVaultPayload(body, shouldEncryptKey);

  const { error } = await supabaseAdmin
    .from("admin_api_vault")
    .update(payload)
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const email = getAdminEmail(req);

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("admin_api_vault")
    .delete()
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}