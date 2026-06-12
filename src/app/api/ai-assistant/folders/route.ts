import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function buildError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return buildError("로그인이 필요합니다.", 401);
  }

  const { data, error } = await supabase
    .from("ai_assistant_folders")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .order("is_pinned", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return buildError(error.message, 500);
  }

  return NextResponse.json({
    folders: data ?? [],
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return buildError("로그인이 필요합니다.", 401);
  }

  const body = await request.json().catch(() => null);

  const name = String(body?.name ?? "").trim();
  const color = String(body?.color ?? "#06b6d4").trim();
  const icon = String(body?.icon ?? "folder").trim();
  const description = body?.description ? String(body.description).trim() : null;

  if (!name) {
    return buildError("폴더명을 입력해 주세요.");
  }

  const { data: settings } = await supabase
    .from("ai_assistant_user_settings")
    .select("plan_key")
    .eq("user_id", user.id)
    .maybeSingle();

  const planKey = settings?.plan_key ?? "free";

  const { data: planLimit } = await supabase
    .from("ai_assistant_plan_limits")
    .select("max_folders")
    .eq("plan_key", planKey)
    .maybeSingle();

  const maxFolders = planLimit?.max_folders ?? 10;

  const { count, error: countError } = await supabase
    .from("ai_assistant_folders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_deleted", false);

  if (countError) {
    return buildError(countError.message, 500);
  }

  if ((count ?? 0) >= maxFolders) {
    return buildError(`현재 등급에서는 폴더를 최대 ${maxFolders}개까지 만들 수 있습니다.`);
  }

  const { data, error } = await supabase
    .from("ai_assistant_folders")
    .insert({
      user_id: user.id,
      name,
      color,
      icon,
      description,
    })
    .select("*")
    .single();

  if (error) {
    return buildError(error.message, 500);
  }

  return NextResponse.json({
    folder: data,
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return buildError("로그인이 필요합니다.", 401);
  }

  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? "").trim();

  if (!id) {
    return buildError("폴더 ID가 필요합니다.");
  }

  const patch: Record<string, unknown> = {};

  if (typeof body?.name === "string") {
    const name = body.name.trim();
    if (!name) return buildError("폴더명을 입력해 주세요.");
    patch.name = name;
  }

  if (typeof body?.description === "string") {
    patch.description = body.description.trim();
  }

  if (typeof body?.color === "string") {
    patch.color = body.color.trim();
  }

  if (typeof body?.icon === "string") {
    patch.icon = body.icon.trim();
  }

  if (typeof body?.sort_order === "number") {
    patch.sort_order = body.sort_order;
  }

  if (typeof body?.is_pinned === "boolean") {
    patch.is_pinned = body.is_pinned;
  }

  if (typeof body?.is_deleted === "boolean") {
    patch.is_deleted = body.is_deleted;
  }

  if (Object.keys(patch).length === 0) {
    return buildError("수정할 내용이 없습니다.");
  }

  const { data, error } = await supabase
    .from("ai_assistant_folders")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return buildError(error.message, 500);
  }

  return NextResponse.json({
    folder: data,
  });
}