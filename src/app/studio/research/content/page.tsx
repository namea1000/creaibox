"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Wand2,
  Database,
  FileText,
  Newspaper,
  PlayCircle,
  Mail,
  Music,
  Sparkles,
  Search,
  PenLine,
  FolderOpen,
  Plus,
  ArrowRight,
  Loader2,
  Save,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Project = {
  id: string;
  title: string | null;
};

type Source = {
  id: string;
  project_id: string | null;
  title: string | null;
  file_name: string | null;
  source_type: string | null;
};

type GeneratedContent = {
  id: string;
  project_id: string | null;
  source_id: string | null;
  content_type: string | null;
  title: string | null;
  content: string | null;
  created_at: string | null;
};

const contentTypes = [
  {
    id: "blog_post",
    title: "블로그 글 생성",
    desc: "분석 자료를 바탕으로 블로그 초안을 생성합니다.",
    icon: PenLine,
    color: "from-violet-600 to-blue-600",
  },
  {
    id: "seo_article",
    title: "SEO 글 생성",
    desc: "키워드, 제목, 메타 설명까지 포함한 SEO 글을 만듭니다.",
    icon: Search,
    color: "from-indigo-600 to-violet-600",
  },
  {
    id: "news_summary",
    title: "뉴스 정리",
    desc: "뉴스 자료를 핵심 이슈, 요약, 관점별로 정리합니다.",
    icon: Newspaper,
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "youtube_script",
    title: "유튜브 대본",
    desc: "자료를 기반으로 영상 대본과 설명문을 생성합니다.",
    icon: PlayCircle,
    color: "from-red-600 to-rose-600",
  },
  {
    id: "shorts_script",
    title: "쇼츠 대본",
    desc: "짧은 영상용 후킹 문장과 대본을 생성합니다.",
    icon: Sparkles,
    color: "from-pink-600 to-rose-600",
  },
  {
    id: "newsletter",
    title: "뉴스레터",
    desc: "자료를 이메일 뉴스레터 형식으로 재구성합니다.",
    icon: Mail,
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "music_idea",
    title: "가사 / 음원 아이디어",
    desc: "자료 내용을 음악 콘셉트, 가사, Suno 프롬프트로 변환합니다.",
    icon: Music,
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "prompt",
    title: "프롬프트 생성",
    desc: "자료 기반 이미지, 영상, 글쓰기 프롬프트를 생성합니다.",
    icon: Wand2,
    color: "from-cyan-600 to-blue-600",
  },
];

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

export default function ResearchContentPage() {
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [generated, setGenerated] = useState<GeneratedContent[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedType, setSelectedType] = useState("blog_post");
  const [customTitle, setCustomTitle] = useState("");
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((item) => item.id === selectedProjectId),
    [projects, selectedProjectId]
  );

  const selectedSource = useMemo(
    () => sources.find((item) => item.id === selectedSourceId),
    [sources, selectedSourceId]
  );

  const selectedContentType = useMemo(
    () => contentTypes.find((item) => item.id === selectedType),
    [selectedType]
  );

  const projectSources = useMemo(
    () => sources.filter((item) => item.project_id === selectedProjectId),
    [sources, selectedProjectId]
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadGeneratedContents(selectedProjectId);
    }
  }, [selectedProjectId]);

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
        .select("id, project_id, title, file_name, source_type")
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
      alert("콘텐츠 생성 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function loadGeneratedContents(projectId: string) {
    const { data, error } = await supabase
      .from("research_generated_contents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setGenerated(data || []);
  }

  async function handleGenerate() {
    if (!userId || !selectedProjectId) {
      alert("프로젝트를 먼저 선택하세요.");
      return;
    }

    try {
      setGenerating(true);

      const title =
        customTitle.trim() ||
        `${selectedProject?.title || "자료"} - ${selectedContentType?.title || "콘텐츠"
        }`;

      const content = makeTemporaryContent(title);

      const { data, error } = await supabase
        .from("research_generated_contents")
        .insert({
          user_id: userId,
          project_id: selectedProjectId,
          source_id: selectedSourceId || null,
          content_type: selectedType,
          title,
          content,
          meta: {
            project_title: selectedProject?.title || "",
            source_title:
              selectedSource?.title || selectedSource?.file_name || "",
            note: "AI API 연결 전 임시 생성 콘텐츠입니다.",
          },
        })
        .select()
        .single();

      if (error) throw error;

      setPreview(content);
      setGenerated((prev) => [data, ...prev]);
    } catch (error) {
      console.error(error);
      alert("콘텐츠 저장 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  }

  function makeTemporaryContent(title: string) {
    return [
      `# ${title}`,
      ``,
      `현재는 AI API 연결 전 단계라 임시 콘텐츠입니다.`,
      ``,
      `## 선택 정보`,
      `- 프로젝트: ${selectedProject?.title || "없음"}`,
      `- 자료: ${selectedSource?.title || selectedSource?.file_name || "전체 자료"
      }`,
      `- 생성 유형: ${selectedContentType?.title || selectedType}`,
      ``,
      `## 예시 구성`,
      `1. 핵심 요약`,
      `2. 주요 내용 정리`,
      `3. 콘텐츠용 제목 후보`,
      `4. 본문 초안`,
      `5. 마무리 문장`,
      ``,
      `다음 단계에서 research_extractions의 추출 텍스트와 API Vault의 기본 AI 모델을 연결하면 실제 자료 기반 콘텐츠가 생성됩니다.`,
    ].join("\n");
  }

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <Wand2 size={15} />
                Content Generator
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                콘텐츠 생성
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                저장된 자료를 기반으로 블로그 글, SEO 글, 뉴스 정리, 유튜브 대본,
                쇼츠 대본, 프롬프트를 생성하고 DB에 저장합니다.
              </p>
            </div>

            <a
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              자료 추가
            </a>
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
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedSourceId("");
                  setPreview("");
                }}
                className="mt-4 h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm font-bold text-zinc-300 outline-none focus:border-violet-500/50"
              >
                <option value="">프로젝트 선택</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title || "제목 없음"}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <Database className="text-blue-400" size={20} />
                <h2 className="text-lg font-black">자료 선택</h2>
              </div>

              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="mt-4 h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm font-bold text-zinc-300 outline-none focus:border-violet-500/50"
              >
                <option value="">전체 자료 사용</option>
                {projectSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.title || source.file_name || "제목 없음"}
                  </option>
                ))}
              </select>

              <p className="mt-3 text-xs leading-5 text-zinc-500">
                현재는 선택 정보 기반 임시 생성입니다. 다음 단계에서 추출 텍스트와 AI 모델을 연결합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <FileText className="text-emerald-400" size={20} />
                <h2 className="text-lg font-black">제목</h2>
              </div>

              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="생성 콘텐츠 제목"
                className="mt-4 h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm font-bold text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>
          </aside>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-black">생성 유형 선택</h2>
              <p className="mt-1 text-sm text-zinc-500">
                자료 분석 결과를 원하는 콘텐츠 형식으로 변환합니다.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {contentTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedType(item.id)}
                    className={`group rounded-2xl border p-5 text-left transition hover:-translate-y-1 ${selectedType === item.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-zinc-800 bg-zinc-900/70 hover:border-violet-500/40"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
                        >
                          <Icon size={22} />
                        </div>

                        <div>
                          <h3 className="font-black">{item.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !selectedProjectId}
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {generating ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              생성 후 저장
            </button>
          </section>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="flex items-center gap-3">
            <FileText className="text-violet-400" size={20} />
            <h2 className="text-lg font-black">생성 결과 미리보기</h2>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            {preview ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-zinc-300">
                {preview}
              </pre>
            ) : (
              <p className="text-sm text-zinc-500">
                프로젝트와 생성 유형을 선택한 뒤 생성하면 결과가 여기에 표시됩니다.
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">저장된 생성 콘텐츠</h2>
            <p className="mt-1 text-sm text-zinc-500">
              research_generated_contents 테이블에 저장된 결과입니다.
            </p>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
                불러오는 중...
              </div>
            ) : generated.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
                저장된 생성 콘텐츠가 없습니다.
              </div>
            ) : (
              generated.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <h3 className="font-black">{item.title || "제목 없음"}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span>유형: {item.content_type || "-"}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                    {item.content || ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">현재 연결 상태</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            현재는 콘텐츠 생성 결과를 research_generated_contents에 저장하는 단계입니다.
            다음 단계에서 AI API와 research_extractions의 추출 텍스트를 연결하면 실제 자료 기반 콘텐츠 생성이 가능합니다.
          </p>
        </section>
      </div>
    </div>
  );
}