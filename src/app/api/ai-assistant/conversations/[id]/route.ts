import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function buildError(message: string, status = 400) {
  return NextResponse.json(
    {
      error: message,
    },
    { status }
  );
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return buildError("로그인이 필요합니다.", 401);
  }

  const { data, error } = await supabase
    .from("ai_assistant_conversations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .maybeSingle();

  if (error) {
    return buildError(error.message, 500);
  }

  if (!data) {
    return buildError("채팅창을 찾을 수 없습니다.", 404);
  }

  return NextResponse.json({
    conversation: data,
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return buildError("로그인이 필요합니다.", 401);
  }

  const body = await request.json().catch(() => null);

  const patch: Record<string, unknown> = {};

  if (typeof body?.title === "string") {
    const title = body.title.trim();

    if (!title) {
      return buildError("채팅창 이름을 입력해 주세요.");
    }

    patch.title = title;
  }

  if (typeof body?.description === "string") {
    patch.description = body.description.trim();
  }

  if (typeof body?.folder_id === "string") {
    patch.folder_id = body.folder_id.trim();
  }

  if (typeof body?.is_pinned === "boolean") {
    patch.is_pinned = body.is_pinned;
  }

  if (typeof body?.is_archived === "boolean") {
    patch.is_archived = body.is_archived;
  }

  if (typeof body?.is_deleted === "boolean") {
    patch.is_deleted = body.is_deleted;
  }

  if (typeof body?.is_closed === "boolean") {
    patch.is_closed = body.is_closed;
  }

  if (typeof body?.context_summary === "string") {
    patch.context_summary = body.context_summary.trim();
  }

  if (typeof body?.closed_reason === "string") {
    patch.closed_reason = body.closed_reason.trim();
  }

  if (body?.is_closed === true) {
    patch.closed_at = new Date().toISOString();
  }

  if (Object.keys(patch).length === 0) {
    return buildError("수정할 내용이 없습니다.");
  }

  if (typeof patch.folder_id === "string" && patch.folder_id) {
    const { data: folder, error: folderError } = await supabase
      .from("ai_assistant_folders")
      .select("id")
      .eq("id", patch.folder_id)
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .maybeSingle();

    if (folderError) {
      return buildError(folderError.message, 500);
    }

    if (!folder) {
      return buildError("대상 폴더를 찾을 수 없습니다.", 404);
    }
  }

  const { data, error } = await supabase
    .from("ai_assistant_conversations")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return buildError(error.message, 500);
  }

  return NextResponse.json({
    conversation: data,
  });
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return buildError("로그인이 필요합니다.", 401);
  }

  const { data, error } = await supabase
    .from("ai_assistant_conversations")
    .update({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    return buildError(error.message, 500);
  }

  return NextResponse.json({
    success: true,
    id: data.id,
  });
}