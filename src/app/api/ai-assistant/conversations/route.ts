import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function buildError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function getDefaultTitle(studioType: string) {
  const map: Record<string, string> = {
    general: "새 AI 채팅",
    writing: "글쓰기 채팅",
    seo: "SEO 점검 채팅",
    music: "음악 / Suno 채팅",
    research: "리서치 채팅",
    thumbnail: "썸네일 채팅",
  };

  return map[studioType] ?? "새 AI 채팅";
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const url = new URL(request.url);

  const folderId = url.searchParams.get("folder_id");
  const search = url.searchParams.get("search")?.trim();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return buildError("로그인이 필요합니다.", 401);
  }

  let query = supabase
    .from("ai_assistant_conversations")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (folderId && folderId !== "all" && folderId !== "pinned" && folderId !== "archived") {
    query = query.eq("folder_id", folderId);
  }

  if (folderId === "pinned") {
    query = query.eq("is_pinned", true);
  }

  if (folderId === "archived") {
    query = query.eq("is_archived", true);
  } else {
    query = query.eq("is_archived", false);
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,search_text.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return buildError(error.message, 500);
  }

  return NextResponse.json({
    conversations: data ?? [],
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

  const studioType = String(body?.studio_type ?? "general").trim();
  const title = String(body?.title ?? getDefaultTitle(studioType)).trim();
  const folderId = body?.folder_id ? String(body.folder_id).trim() : null;
  const pagePath = body?.page_path ? String(body.page_path).trim() : null;
  const description = body?.description ? String(body.description).trim() : null;

  if (!title) {
    return buildError("채팅창 이름을 입력해 주세요.");
  }

  const { data: settings } = await supabase
    .from("ai_assistant_user_settings")
    .select("plan_key")
    .eq("user_id", user.id)
    .maybeSingle();

  const planKey = settings?.plan_key ?? "free";

  const { data: planLimit } = await supabase
    .from("ai_assistant_plan_limits")
    .select("max_chars_per_conversation, max_conversations")
    .eq("plan_key", planKey)
    .maybeSingle();

  const maxCharsLimit = planLimit?.max_chars_per_conversation ?? 300000;
  const maxConversations = planLimit?.max_conversations ?? 20;

  const { count, error: countError } = await supabase
    .from("ai_assistant_conversations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_deleted", false);

  if (countError) {
    return buildError(countError.message, 500);
  }

  if ((count ?? 0) >= maxConversations) {
    return buildError(
      `현재 등급에서는 채팅창을 최대 ${maxConversations}개까지 만들 수 있습니다.`
    );
  }

  if (folderId) {
    const { data: folder, error: folderError } = await supabase
      .from("ai_assistant_folders")
      .select("id")
      .eq("id", folderId)
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .maybeSingle();

    if (folderError) {
      return buildError(folderError.message, 500);
    }

    if (!folder) {
      return buildError("선택한 폴더를 찾을 수 없습니다.", 404);
    }
  }

  const welcomeMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "새 채팅창입니다. 글쓰기, SEO, 음악, 리서치, 썸네일 작업을 요청할 수 있습니다.",
    created_at: new Date().toISOString(),
    agents: ["router"],
  };

  const { data, error } = await supabase
    .from("ai_assistant_conversations")
    .insert({
      user_id: user.id,
      folder_id: folderId,
      title,
      description,
      studio_type: studioType,
      page_path: pagePath,
      plan_key: planKey,
      max_chars_limit: maxCharsLimit,
      total_chars: welcomeMessage.content.length,
      conversation_count: 0,
      message_count: 1,
      messages: [welcomeMessage],
      agents_used: ["router"],
      search_text: `${title} ${description ?? ""} ${welcomeMessage.content}`,
    })
    .select("*")
    .single();

  if (error) {
    return buildError(error.message, 500);
  }

  await supabase
    .from("ai_assistant_user_settings")
    .upsert({
      user_id: user.id,
      plan_key: planKey,
      last_conversation_id: data.id,
    })
    .select("id")
    .maybeSingle();

  return NextResponse.json({
    conversation: data,
  });
}