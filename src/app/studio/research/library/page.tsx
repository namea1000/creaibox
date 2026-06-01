"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Globe,
  PlayCircle,
  Clock,
  Search,
  Database,
  Plus,
  Archive,
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
  source_type: string | null;
  title: string | null;
  original_url: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: string | null;
  created_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

function getSourceIcon(type: string | null) {
  if (type === "youtube") return PlayCircle;
  if (type === "web_url") return Globe;
  if (type === "image") return ImageIcon;
  return FileText;
}

function getTypeLabel(type: string | null) {
  if (type === "pdf") return "PDF";
  if (type === "docx") return "Word";
  if (type === "pptx") return "PPT";
  if (type === "spreadsheet") return "Excel / CSV";
  if (type === "image") return "이미지 OCR";
  if (type === "youtube") return "YouTube";
  if (type === "web_url") return "웹페이지 URL";
  if (type === "text") return "텍스트";
  return "자료";
}

export default function ResearchLibraryPage() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    try {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        setProjects([]);
        setSources([]);
        return;
      }

      const { data: projectData, error: projectError } = await supabase
        .from("research_projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (projectError) throw projectError;

      const { data: sourceData, error: sourceError } = await supabase
        .from("research_sources")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (sourceError) throw sourceError;

      setProjects(projectData || []);
      setSources(sourceData || []);
    } catch (error) {
      console.error(error);
      alert("자료 보관함을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((item) =>
    (item.title || "").toLowerCase().includes(keyword.toLowerCase())
  );

  const filteredSources = sources.filter((item) => {
    const target = `${item.title || ""} ${item.file_name || ""} ${item.original_url || ""
      }`;
    return target.toLowerCase().includes(keyword.toLowerCase());
  });

  const countByType = {
    pdf: sources.filter((s) => s.source_type === "pdf").length,
    docx: sources.filter((s) => s.source_type === "docx").length,
    pptx: sources.filter((s) => s.source_type === "pptx").length,
    spreadsheet: sources.filter((s) => s.source_type === "spreadsheet").length,
    image: sources.filter((s) => s.source_type === "image").length,
    youtube: sources.filter((s) => s.source_type === "youtube").length,
    web_url: sources.filter((s) => s.source_type === "web_url").length,
    text: sources.filter((s) => s.source_type === "text").length,
  };

  const sourceTypes = [
    { title: "PDF 자료", count: countByType.pdf, icon: FileText },
    { title: "Word 문서", count: countByType.docx, icon: FileText },
    { title: "PPT 자료", count: countByType.pptx, icon: FileText },
    { title: "Excel / CSV", count: countByType.spreadsheet, icon: FileText },
    { title: "이미지 OCR", count: countByType.image, icon: ImageIcon },
    { title: "YouTube", count: countByType.youtube, icon: PlayCircle },
    { title: "웹페이지 URL", count: countByType.web_url, icon: Globe },
    { title: "텍스트", count: countByType.text, icon: Archive },
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <Database size={15} />
                Research Library
              </div>

              <h1 className="text-3xl font-black md:text-5xl">자료 보관함</h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                업로드한 PDF, 문서, 이미지, YouTube, 웹페이지 자료를 프로젝트 단위로 저장하고 관리합니다.
              </p>
            </div>

            <Link
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              새 자료 추가
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
              placeholder="프로젝트 또는 자료 검색..."
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
            />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">자료 유형</h2>
            <p className="mt-1 text-sm text-zinc-500">
              저장된 자료를 유형별로 확인합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {sourceTypes.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    저장 자료 {item.count}개
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">프로젝트</h2>
            <p className="mt-1 text-sm text-zinc-500">
              자료 분석 프로젝트 목록입니다.
            </p>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
                불러오는 중...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
                저장된 프로젝트가 없습니다.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <FolderOpen size={22} />
                    </div>

                    <div>
                      <h3 className="font-black">{project.title || "제목 없음"}</h3>
                      <div className="mt-1 flex items-center gap-4 text-xs text-zinc-500">
                        <span>
                          자료{" "}
                          {
                            sources.filter((s) => s.project_id === project.id)
                              .length
                          }
                          개
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(project.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">최근 저장 자료</h2>
            <p className="mt-1 text-sm text-zinc-500">
              create 페이지에서 저장한 자료가 여기에 표시됩니다.
            </p>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
                불러오는 중...
              </div>
            ) : filteredSources.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
                저장된 자료가 없습니다.
              </div>
            ) : (
              filteredSources.map((source) => {
                const Icon = getSourceIcon(source.source_type);

                return (
                  <div
                    key={source.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black">
                          {source.title || source.file_name || "제목 없음"}
                        </h3>

                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">
                          <span>{getTypeLabel(source.source_type)}</span>
                          <span>상태: {source.status || "-"}</span>
                          <span>{formatDate(source.created_at)}</span>
                        </div>

                        {source.original_url && (
                          <p className="mt-2 truncate text-xs text-zinc-600">
                            {source.original_url}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}