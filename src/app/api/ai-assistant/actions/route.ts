import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function buildError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const allowedTargetTables = new Set([
  "writing_creaibox_posts",
  "music_lyrics_projects",
  "music_generation_batches",
  "research_projects",
  "research_sources",
]);

function buildPatchFromAction(actionType: string, payload: Record<string, unknown>) {
  switch (actionType) {
    case "apply_title":
      return typeof payload.title === "string" ? { title: payload.title } : null;

    case "apply_content":
      return typeof payload.content === "string" ? { content: payload.content } : null;

    case "apply_meta_description":
      return typeof payload.meta_description === "string"
        ? { meta_description: payload.meta_description }
        : null;

    case "apply_focus_keyword":
      return typeof payload.focus_keyword === "string"
        ? { focus_keyword: payload.focus_keyword }
        : null;

    case "apply_seo_tags":
      return Array.isArray(payload.seo_tags)
        ? { seo_tags: payload.seo_tags }
        : null;

    case "apply_lyrics":
      return typeof payload.lyrics === "string" ? { lyrics: payload.lyrics } : null;

    case "apply_suno_prompt":
      return typeof payload.suno_prompt === "string"
        ? { suno_prompt: payload.suno_prompt }
        : null;

    case "apply_thumbnail_prompt":
      return typeof payload.thumbnail_prompt === "string"
        ? { thumbnail_prompt: payload.thumbnail_prompt }
        : null;

    default:
      return null;
  }
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

  const conversationId = String(body?.conversation_id ?? "").trim();
  const actionType = String(body?.action_type ?? "").trim();
  const actionLabel = String(body?.action_label ?? "AI 액션").trim();
  const targetTable = String(body?.target_table ?? "").trim();
  const targetId = String(body?.target_id ?? "").trim();
  const payload =
    body?.payload && typeof body.payload === "object"
      ? (body.payload as Record<string, unknown>)
      : {};

  if (!conversationId) {
    return buildError("conversation_id가 필요합니다.");
  }

  if (!actionType) {
    return buildError("action_type이 필요합니다.");
  }

  if (!targetTable) {
    return buildError("target_table이 필요합니다.");
  }

  if (!targetId) {
    return buildError("target_id가 필요합니다.");
  }

  if (!allowedTargetTables.has(targetTable)) {
    return buildError("허용되지 않은 target_table입니다.");
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("ai_assistant_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .maybeSingle();

  if (conversationError) {
    return buildError(conversationError.message, 500);
  }

  if (!conversation) {
    return buildError("채팅창을 찾을 수 없습니다.", 404);
  }

  const patch = buildPatchFromAction(actionType, payload);

  if (!patch) {
    return buildError("이 액션에 적용할 수 있는 payload가 없습니다.");
  }

  const { data: actionLog, error: actionLogError } = await supabase
    .from("ai_assistant_actions")
    .insert({
      user_id: user.id,
      conversation_id: conversationId,
      action_type: actionType,
      action_label: actionLabel,
      target_table: targetTable,
      target_id: targetId,
      payload,
      status: "pending",
    })
    .select("*")
    .single();

  if (actionLogError) {
    return buildError(actionLogError.message, 500);
  }

  const { data: updatedTarget, error: targetError } = await supabase
    .from(targetTable)
    .update(patch)
    .eq("id", targetId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (targetError) {
    await supabase
      .from("ai_assistant_actions")
      .update({
        status: "failed",
        error_message: targetError.message,
      })
      .eq("id", actionLog.id)
      .eq("user_id", user.id);

    return buildError(targetError.message, 500);
  }

  const { data: updatedAction } = await supabase
    .from("ai_assistant_actions")
    .update({
      status: "applied",
      applied_at: new Date().toISOString(),
    })
    .eq("id", actionLog.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  return NextResponse.json({
    success: true,
    action: updatedAction,
    target: updatedTarget,
  });
}