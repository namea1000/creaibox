"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Database,
  Send,
  FileText,
  FolderOpen,
  Sparkles,
  Search,
  BookOpen,
  Wand2,
  Plus,
  Loader2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Project = {
  id: string;
  title: string | null;
};

type Source = {
  id: string;
  project_id: string | null;
  source_type: string | null;
  title: string | null;
  file_name: string | null;
  original_url: string | null;
  status: string | null;
};

type Chat = {
  id: string;
  project_id: string | null;
  user_id: string | null;
  title: string | null;
  created_at: string | null;
};

type ChatMessage = {
  id: string;
  chat_id: string | null;
  role: string | null;
  content: string | null;
  created_at: string | null;
};

export default function ResearchChatPage() {
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const sampleQuestions = [
    "이 자료 핵심만 요약해줘",
    "중요한 키워드 10개 뽑아줘",
    "블로그 글 목차로 정리해줘",
    "A 자료와 B 자료를 비교해줘",
    "유튜브 대본으로 바꿔줘",
    "SEO 글쓰기용으로 재구성해줘",
  ];

  const selectedProject = useMemo(
    () => projects.find((item) => item.id === selectedProjectId),
    [projects, selectedProjectId]
  );

  const selectedSources = useMemo(
    () => sources.filter((item) => item.project_id === selectedProjectId),
    [sources, selectedProjectId]
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadProjectChats(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  async function loadInitialData() {
    try {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData.user?.id;

      if (!currentUserId) return;

      setUserId(currentUserId);

      const { data: projectData, error: projectError } = await supabase
        .from("research_projects")
        .select("id, title")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (projectError) throw projectError;

      const { data: sourceData, error: sourceError } = await supabase
        .from("research_sources")
        .select("id, project_id, source_type, title, file_name, original_url, status")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (sourceError) throw sourceError;

      setProjects(projectData || []);
      setSources(sourceData || []);

      if (projectData?.[0]?.id) {
        setSelectedProjectId(projectData[0].id);
      }
    } catch (error) {
      console.error(error);
      alert("AI 채팅 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProjectChats(projectId: string) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("research_chats")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setChats(data || []);
    setSelectedChatId(data?.[0]?.id || "");
  }

  async function loadMessages(chatId: string) {
    const { data, error } = await supabase
      .from("research_chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setMessages(data || []);
  }

  async function createNewChat() {
    if (!userId || !selectedProjectId) {
      alert("프로젝트를 먼저 선택하세요.");
      return;
    }

    const title = selectedProject?.title
      ? `${selectedProject.title} AI 채팅`
      : "새 AI 채팅";

    const { data, error } = await supabase
      .from("research_chats")
      .insert({
        user_id: userId,
        project_id: selectedProjectId,
        title,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
      return;
    }

    setChats((prev) => [data, ...prev]);
    setSelectedChatId(data.id);
    setMessages([]);
  }

  async function handleSend(customText?: string) {
    const content = (customText || input).trim();

    if (!content) return;

    try {
      setSending(true);

      let chatId = selectedChatId;

      if (!chatId) {
        if (!userId || !selectedProjectId) {
          alert("프로젝트를 먼저 선택하세요.");
          return;
        }

        const { data: newChat, error: chatError } = await supabase
          .from("research_chats")
          .insert({
            user_id: userId,
            project_id: selectedProjectId,
            title: content.slice(0, 30),
          })
          .select()
          .single();

        if (chatError) throw chatError;

        chatId = newChat.id;
        setChats((prev) => [newChat, ...prev]);
        setSelectedChatId(chatId);
      }

      const { error: userMessageError } = await supabase
        .from("research_chat_messages")
        .insert({
          chat_id: chatId,
          role: "user",
          content,
        });

      if (userMessageError) throw userMessageError;

      const tempAnswer = makeTemporaryAnswer(content);

      const { error: assistantMessageError } = await supabase
        .from("research_chat_messages")
        .insert({
          chat_id: chatId,
          role: "assistant",
          content: tempAnswer,
        });

      if (assistantMessageError) throw assistantMessageError;

      setInput("");
      await loadMessages(chatId);
    } catch (error) {
      console.error(error);
      alert("메시지 저장 중 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  }

  function makeTemporaryAnswer(question: string) {
    const sourceCount = selectedSources.length;

    return [
      `현재는 AI API 연결 전 단계라 임시 답변입니다.`,
      ``,
      `선택 프로젝트: ${selectedProject?.title || "없음"}`,
      `연결 자료 수: ${sourceCount}개`,
      `질문: ${question}`,
      ``,
      `다음 단계에서 research_extractions의 추출 텍스트와 API Vault의 기본 AI 모델을 연결하면 실제 자료 기반 답변이 생성됩니다.`,
    ].join("\n");
  }

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <MessageCircle size={15} />
                Research Chat
              </div>

              <h1 className="text-3xl font-black md:text-5xl">AI 채팅</h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                업로드한 자료를 기반으로 질문하고 답변을 저장하는 자료 기반 AI 대화 공간입니다.
              </p>
            </div>

            <Link
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              자료 추가
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <FolderOpen className="text-violet-400" size={20} />
                <h2 className="text-lg font-black">프로젝트 선택</h2>
              </div>

              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="mt-4 h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm font-bold text-zinc-300 outline-none focus:border-violet-500/50"
              >
                <option value="">프로젝트 선택</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title || "제목 없음"}
                  </option>
                ))}
              </select>

              <button
                onClick={createNewChat}
                disabled={!selectedProjectId}
                className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white hover:bg-violet-500 disabled:opacity-40"
              >
                새 채팅 만들기
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <Database className="text-blue-400" size={20} />
                <h2 className="text-lg font-black">참고 자료</h2>
              </div>

              <div className="mt-4 space-y-3">
                {selectedSources.length === 0 ? (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-500">
                    선택한 프로젝트에 저장된 자료가 없습니다.
                  </div>
                ) : (
                  selectedSources.map((source) => (
                    <div
                      key={source.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-500"
                    >
                      <p className="font-black text-zinc-300">
                        {source.title || source.file_name || "제목 없음"}
                      </p>
                      <p className="mt-1">유형: {source.source_type || "-"}</p>
                      <p>상태: {source.status || "-"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <Search className="text-emerald-400" size={20} />
                <h2 className="text-lg font-black">채팅 목록</h2>
              </div>

              <div className="mt-4 space-y-2">
                {chats.length === 0 ? (
                  <p className="text-xs text-zinc-500">아직 채팅이 없습니다.</p>
                ) : (
                  chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-bold ${selectedChatId === chat.id
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-violet-500/40"
                        }`}
                    >
                      {chat.title || "새 채팅"}
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="flex min-h-[620px] flex-col">
              <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    불러오는 중...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                      <MessageCircle size={28} />
                    </div>

                    <h2 className="text-xl font-black">자료 기반으로 질문하세요</h2>

                    <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                      프로젝트를 선택하고 질문을 입력하면 대화가 DB에 저장됩니다.
                    </p>

                    <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                      {sampleQuestions.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSend(item)}
                          className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-violet-500/40 hover:text-violet-400"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-2xl border p-4 text-sm leading-relaxed ${message.role === "user"
                            ? "ml-auto max-w-[80%] border-violet-500/30 bg-violet-500/10 text-zinc-100"
                            : "mr-auto max-w-[85%] border-zinc-800 bg-zinc-900 text-zinc-300"
                          }`}
                      >
                        <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                          {message.role === "user" ? "User" : "Assistant"}
                        </p>
                        <pre className="whitespace-pre-wrap font-sans">
                          {message.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="자료에 대해 질문해보세요..."
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={sending}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}
                  전송
                </button>
              </div>
            </div>
          </section>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "요약 질문",
              desc: "긴 자료를 핵심 요약, 상세 요약, 목차 요약으로 정리합니다.",
              icon: Sparkles,
            },
            {
              title: "자료 검색",
              desc: "업로드한 자료 안에서 특정 문장, 키워드, 근거를 찾습니다.",
              icon: BookOpen,
            },
            {
              title: "콘텐츠 변환",
              desc: "답변 결과를 블로그, 대본, SEO 글로 바로 확장합니다.",
              icon: Wand2,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-violet-400" size={20} />
                  <h2 className="text-lg font-black">{item.title}</h2>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <FileText className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">현재 연결 상태</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            현재는 research_chats, research_chat_messages에 대화 저장까지 연결된 상태입니다.
            다음 단계에서 API Vault의 기본 AI 모델과 research_extractions의 추출 텍스트를 연결하면 실제 자료 기반 답변이 가능합니다.
          </p>
        </section>
      </div>
    </div>
  );
}