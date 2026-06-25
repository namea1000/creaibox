import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type AssistantMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  agents?: string[];
  actions?: AssistantAction[];
};

type AssistantAction = {
  id: string;
  label: string;
  actionType: string;
  payload?: Record<string, unknown>;
  status?: "pending" | "applied" | "failed" | "cancelled";
};

function buildError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeMessages(value: unknown): AssistantMessage[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is AssistantMessage => {
    return (
      typeof item === "object" &&
      item !== null &&
      "role" in item &&
      "content" in item
    );
  });
}

function detectAgents(prompt: string, studioType: string) {
  const text = `${prompt} ${studioType}`.toLowerCase();
  const agents = new Set<string>(["router"]);

  if (
    studioType === "writing" ||
    text.includes("글") ||
    text.includes("블로그") ||
    text.includes("원고") ||
    text.includes("문장") ||
    text.includes("제목")
  ) {
    agents.add("writing");
  }

  if (
    studioType === "seo" ||
    text.includes("seo") ||
    text.includes("검색") ||
    text.includes("키워드") ||
    text.includes("메타") ||
    text.includes("태그") ||
    text.includes("발행")
  ) {
    agents.add("seo");
  }

  if (
    studioType === "music" ||
    text.includes("suno") ||
    text.includes("가사") ||
    text.includes("노래") ||
    text.includes("음악")
  ) {
    agents.add("music");
  }

  if (
    studioType === "research" ||
    text.includes("자료") ||
    text.includes("리서치") ||
    text.includes("요약") ||
    text.includes("분석") ||
    text.includes("pdf")
  ) {
    agents.add("research");
  }

  if (
    studioType === "thumbnail" ||
    text.includes("썸네일") ||
    text.includes("이미지") ||
    text.includes("프롬프트")
  ) {
    agents.add("thumbnail");
  }

  return Array.from(agents);
}

function buildActions(agents: string[]): AssistantAction[] {
  const actions: AssistantAction[] = [];

  if (agents.includes("writing")) {
    actions.push({
      id: crypto.randomUUID(),
      label: "본문 개선안 복사",
      actionType: "copy_result",
      status: "pending",
    });
  }

  if (agents.includes("seo")) {
    actions.push({
      id: crypto.randomUUID(),
      label: "SEO 점검 결과 복사",
      actionType: "copy_result",
      status: "pending",
    });
  }

  if (agents.includes("music")) {
    actions.push({
      id: crypto.randomUUID(),
      label: "Suno 프롬프트 복사",
      actionType: "copy_result",
      status: "pending",
    });
  }

  if (agents.includes("thumbnail")) {
    actions.push({
      id: crypto.randomUUID(),
      label: "썸네일 프롬프트 복사",
      actionType: "copy_result",
      status: "pending",
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: crypto.randomUUID(),
      label: "결과 복사",
      actionType: "copy_result",
      status: "pending",
    });
  }

  return actions;
}

function buildSystemPrompt({
  studioType,
  pagePath,
  agents,
  contextSummary,
}: {
  studioType: string;
  pagePath: string | null;
  agents: string[];
  contextSummary: string | null;
}) {
  return `
너는 CreAibox의 AI Assistant이자 Multi Agent Hub이다.

현재 작업 정보:
- studio_type: ${studioType}
- page_path: ${pagePath ?? "unknown"}
- active_agents: ${agents.join(", ")}
- context_summary: ${contextSummary ?? "없음"}

역할:
1. 사용자의 현재 작업 맥락을 이해한다.
2. Writing, SEO, Music, Research, Thumbnail Agent 역할을 필요에 따라 수행한다.
3. 답변은 한국어로 한다.
4. 너무 장황하지 않게, 바로 적용 가능한 결과 중심으로 답변한다.
5. 사용자가 개발 중인 CreAibox 프로젝트 맥락을 고려한다.
6. 액션 적용은 아직 직접 실행하지 않고, 적용 가능한 결과를 명확히 제안한다.

출력 형식:
- 먼저 핵심 답변
- 필요하면 개선안 또는 실행 순서
- 마지막에 추천 액션을 짧게 제안
`.trim();
}

function buildFallbackResponse(prompt: string, agents: string[]) {
  return [
    `요청을 확인했습니다.`,
    "",
    `활성 에이전트: ${agents.join(", ")}`,
    "",
    "현재 API 키가 설정되지 않았거나 AI 응답 생성에 실패해서 기본 응답으로 처리했습니다.",
    "",
    "요청 내용:",
    prompt,
  ].join("\n");
}

async function generateAssistantResponse({
  prompt,
  messages,
  studioType,
  pagePath,
  agents,
  contextSummary,
}: {
  prompt: string;
  messages: AssistantMessage[];
  studioType: string;
  pagePath: string | null;
  agents: string[];
  contextSummary: string | null;
}) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    "";

  if (!apiKey) {
    return buildFallbackResponse(prompt, agents);
  }

  const recentMessages = messages.slice(-12);

  const historyText = recentMessages
    .map((message) => {
      const role = message.role === "assistant" ? "AI" : message.role;
      return `${role}: ${message.content}`;
    })
    .join("\n\n");

  const systemPrompt = buildSystemPrompt({
    studioType,
    pagePath,
    agents,
    contextSummary,
  });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent(`
${systemPrompt}

최근 대화:
${historyText || "없음"}

사용자 요청:
${prompt}
`);

    const text = result.response.text();

    return text?.trim() || buildFallbackResponse(prompt, agents);
  } catch {
    return buildFallbackResponse(prompt, agents);
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
  const prompt = String(body?.message ?? "").trim();

  if (!conversationId) {
    return buildError("conversation_id가 필요합니다.");
  }

  if (!prompt) {
    return buildError("메시지를 입력해 주세요.");
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("ai_assistant_conversations")
    .select("*")
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

  if (conversation.is_closed) {
    return buildError("이미 종료된 채팅창입니다. 새 채팅창을 생성해 주세요.");
  }

  const messages = normalizeMessages(conversation.messages);
  const agents = detectAgents(prompt, conversation.studio_type ?? "general");

  const estimatedChars = prompt.length + 6000;
  const maxCharsLimit = conversation.max_chars_limit ?? 300000;
  const currentChars = conversation.total_chars ?? 0;

  if (currentChars + estimatedChars >= maxCharsLimit) {
    const { data: closedConversation } = await supabase
      .from("ai_assistant_conversations")
      .update({
        is_closed: true,
        closed_reason: "max_chars_limit_reached",
        closed_at: new Date().toISOString(),
      })
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .select("*")
      .single();

    return NextResponse.json(
      {
        error:
          "이 채팅창은 최대 저장 글자수에 가까워졌습니다. 새 채팅창을 생성해 주세요.",
        conversation: closedConversation,
      },
      { status: 409 }
    );
  }

  const userMessage: AssistantMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content: prompt,
    created_at: new Date().toISOString(),
  };

  const assistantContent = await generateAssistantResponse({
    prompt,
    messages,
    studioType: conversation.studio_type ?? "general",
    pagePath: conversation.page_path ?? null,
    agents,
    contextSummary: conversation.context_summary ?? null,
  });

  const assistantMessage: AssistantMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: assistantContent,
    created_at: new Date().toISOString(),
    agents,
    actions: buildActions(agents),
  };

  const nextMessages = [...messages, userMessage, assistantMessage];
  const addedChars = prompt.length + assistantContent.length;
  const nextTotalChars = currentChars + addedChars;
  const isClosed = nextTotalChars >= maxCharsLimit;

  const previousAgents = Array.isArray(conversation.agents_used)
    ? conversation.agents_used
    : [];

  const nextAgentsUsed = Array.from(new Set([...previousAgents, ...agents]));

  const nextSearchText = [
    conversation.title,
    conversation.description,
    conversation.search_text,
    prompt,
    assistantContent.slice(0, 2000),
  ]
    .filter(Boolean)
    .join(" ")
    .slice(-200000);

  const { data: updatedConversation, error: updateError } = await supabase
    .from("ai_assistant_conversations")
    .update({
      messages: nextMessages,
      total_chars: nextTotalChars,
      conversation_count: (conversation.conversation_count ?? 0) + 1,
      message_count: (conversation.message_count ?? 0) + 2,
      agents_used: nextAgentsUsed,
      search_text: nextSearchText,
      is_closed: isClosed,
      closed_reason: isClosed ? "max_chars_limit_reached" : conversation.closed_reason,
      closed_at: isClosed ? new Date().toISOString() : conversation.closed_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateError) {
    return buildError(updateError.message, 500);
  }

  await supabase.from("ai_assistant_agent_runs").insert(
    agents.map((agent) => ({
      user_id: user.id,
      conversation_id: conversationId,
      agent_key: agent,
      agent_name: agent,
      input_summary: prompt.slice(0, 500),
      output_summary: assistantContent.slice(0, 500),
      model_provider: process.env.GEMINI_API_KEY ? "gemini" : "fallback",
      model_name: process.env.GEMINI_API_KEY
        ? "gemini-3-flash-preview"
        : "fallback",
      status: "success",
    }))
  );

  await supabase
    .from("ai_assistant_user_settings")
    .upsert({
      user_id: user.id,
      plan_key: conversation.plan_key ?? "free",
      last_conversation_id: conversationId,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .maybeSingle();

  return NextResponse.json({
    conversation: updatedConversation,
    message: assistantMessage,
    agents,
  });
}