"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Database,
  Plus,
  Search,
  Clock,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Wand2,
  ArrowRight,
  LayoutGrid,
  Trash2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Project = {
  id: string;
  title: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Source = {
  id: string;
  project_id: string | null;
};

type Chat = {
  id: string;
  project_id: string | null;
};

type GeneratedContent = {
  id: string;
  project_id: string | null;
};

type ResearchImage = {
  id: string;
  project_id: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

export default function ResearchProjectsPage() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [images, setImages] = useState<ResearchImage[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) return;

      const { data: projectData, error: projectError } = await supabase
        .from("research_projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (projectError) throw projectError;

      const { data: sourceData, error: sourceError } = await supabase
        .from("research_sources")
        .select("id, project_id")
        .eq("user_id", userId);

      if (sourceError) throw sourceError;

      const { data: chatData, error: chatError } = await supabase
        .from("research_chats")
        .select("id, project_id")
        .eq("user_id", userId);

      if (chatError) throw chatError;

      const { data: contentData, error: contentError } = await supabase
        .from("research_generated_contents")
        .select("id, project_id")
        .eq("user_id", userId);

      if (contentError) throw contentError;

      const { data: imageData, error: imageError } = await supabase
        .from("research_images")
        .select("id, project_id")
        .eq("user_id", userId);

      if (imageError) throw imageError;

      setProjects(projectData || []);
      setSources(sourceData || []);
      setChats(chatData || []);
      setContents(contentData || []);
      setImages(imageData || []);
    } catch (error) {
      console.error(error);
      alert("프로젝트 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject(projectId: string) {
    if (!confirm("이 프로젝트를 삭제할까요? 연결된 자료도 함께 삭제됩니다.")) {
      return;
    }

    const { error } = await supabase
      .from("research_projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error(error);
      alert("프로젝트 삭제 중 오류가 발생했습니다.");
      return;
    }

    await loadData();
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      `${project.title || ""} ${project.description || ""}`
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
  }, [projects, keyword]);

  function countByProject<T extends { project_id: string | null }>(
    list: T[],
    projectId: string
  ) {
    return list.filter((item) => item.project_id === projectId).length;
  }

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <FolderOpen size={15} />
                Research Projects
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                프로젝트 관리
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                자료, AI 채팅, 생성 콘텐츠, 추출 이미지를 프로젝트 단위로 관리합니다.
              </p>
            </div>

            <Link
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              새 프로젝트
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="프로젝트 검색..."
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
            />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">내 프로젝트</h2>
            <p className="mt-1 text-sm text-zinc-500">
              저장된 자료 분석 프로젝트 목록입니다.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
              불러오는 중...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
              저장된 프로젝트가 없습니다.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => {
                const sourceCount = countByProject(sources, project.id);
                const chatCount = countByProject(chats, project.id);
                const contentCount = countByProject(contents, project.id);
                const imageCount = countByProject(images, project.id);

                return (
                  <div
                    key={project.id}
                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <FolderOpen size={22} />
                      </div>

                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="rounded-lg border border-zinc-800 p-2 text-zinc-600 hover:border-red-500/40 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="mt-4 font-black">
                      {project.title || "제목 없음"}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                      {project.description || "설명 없음"}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Database size={14} />
                        자료 {sourceCount}개
                      </div>

                      <div className="flex items-center gap-2">
                        <MessageCircle size={14} />
                        AI 채팅 {chatCount}개
                      </div>

                      <div className="flex items-center gap-2">
                        <Wand2 size={14} />
                        생성 콘텐츠 {contentCount}개
                      </div>

                      <div className="flex items-center gap-2">
                        <ImageIcon size={14} />
                        추출 이미지 {imageCount}개
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {formatDate(project.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <Database className="mb-3 text-violet-400" size={20} />
            <h3 className="font-black">자료</h3>
            <p className="mt-2 text-sm text-zinc-500">
              PDF, URL, YouTube, OCR 자료
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <MessageCircle className="mb-3 text-blue-400" size={20} />
            <h3 className="font-black">AI 채팅</h3>
            <p className="mt-2 text-sm text-zinc-500">
              프로젝트별 대화 기록
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <FileText className="mb-3 text-emerald-400" size={20} />
            <h3 className="font-black">생성 글</h3>
            <p className="mt-2 text-sm text-zinc-500">
              블로그 · SEO · 대본
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <ImageIcon className="mb-3 text-pink-400" size={20} />
            <h3 className="font-black">추출 이미지</h3>
            <p className="mt-2 text-sm text-zinc-500">
              저장된 WebP 이미지
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">현재 연결 상태</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            현재는 프로젝트 목록, 자료 수, 채팅 수, 생성 콘텐츠 수, 이미지 수 조회까지 연결된 상태입니다.
          </p>
        </section>
      </div>
    </div>
  );
}