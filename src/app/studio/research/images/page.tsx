"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Database,
  Search,
  Download,
  Copy,
  Globe,
  FileText,
  Plus,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Project = {
  id: string;
  title: string | null;
};

type ResearchImage = {
  id: string;
  project_id: string | null;
  source_id: string | null;
  user_id: string | null;
  image_type: string | null;
  original_url: string | null;
  storage_path: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  created_at: string | null;
};

function formatSize(size: number | null) {
  if (!size) return "-";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

export default function ResearchImagesPage() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [images, setImages] = useState<ResearchImage[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
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
        .select("id, title")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (projectError) throw projectError;

      const { data: imageData, error: imageError } = await supabase
        .from("research_images")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (imageError) throw imageError;

      setProjects(projectData || []);
      setImages(imageData || []);
    } catch (error) {
      console.error(error);
      alert("추출 이미지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function getSignedUrlPlaceholder(path: string | null) {
    if (!path) return "";
    return path;
  }

  async function handleCopy(text: string | null) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    alert("복사되었습니다.");
  }

  const filteredImages = useMemo(() => {
    return images.filter((item) => {
      const matchProject = selectedProjectId
        ? item.project_id === selectedProjectId
        : true;

      const target = `${item.image_type || ""} ${item.original_url || ""} ${item.storage_path || ""
        }`.toLowerCase();

      const matchKeyword = target.includes(keyword.toLowerCase());

      return matchProject && matchKeyword;
    });
  }, [images, selectedProjectId, keyword]);

  const totalSize = images.reduce((sum, item) => sum + (item.file_size || 0), 0);
  const ogCount = images.filter((item) => item.image_type === "og-image").length;
  const contentCount = images.filter(
    (item) => item.image_type === "content-image"
  ).length;

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#12091f] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <ImageIcon size={15} />
                Extracted Images
              </div>

              <h1 className="text-3xl font-black md:text-5xl">추출 이미지</h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                웹페이지, 뉴스, 블로그, OCR 자료에서 추출한 이미지를 WebP 형식으로 저장하고 관리합니다.
              </p>
            </div>

            <Link
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              새 이미지 추출
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "전체 이미지", value: String(images.length), icon: ImageIcon },
            { label: "대표 이미지", value: String(ogCount), icon: Globe },
            { label: "본문 이미지", value: String(contentCount), icon: FileText },
            { label: "저장 용량", value: formatSize(totalSize), icon: Database },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm dark:shadow-none transition-colors duration-300"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={20} />
                </div>

                <p className="text-2xl font-black">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <FolderOpen className="text-violet-400" size={20} />
              <h2 className="text-lg font-black">프로젝트 필터</h2>
            </div>

            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="mt-4 h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm font-bold text-zinc-300 outline-none focus:border-violet-500/50"
            >
              <option value="">전체 프로젝트</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title || "제목 없음"}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="이미지 유형, 원본 URL, 저장 경로 검색..."
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">이미지 목록</h2>
            <p className="mt-1 text-sm text-zinc-500">
              저장 경로: research-assets / user_id / project_id / source_id / images
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
              불러오는 중...
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-500">
              저장된 이미지가 없습니다.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredImages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm dark:shadow-none transition-colors duration-300"
                >
                  <div className="flex h-44 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
                    <ImageIcon size={42} className="text-zinc-700" />
                  </div>

                  <div className="mt-4">
                    <h3 className="font-black">
                      {item.image_type || "이미지"}
                    </h3>

                    <div className="mt-2 space-y-1 text-xs text-zinc-500">
                      <p>형식: WebP</p>
                      <p>용량: {formatSize(item.file_size)}</p>
                      <p>
                        크기: {item.width || "-"} x {item.height || "-"}
                      </p>
                      <p>생성일: {formatDate(item.created_at)}</p>
                      <p className="truncate">
                        경로: {getSignedUrlPlaceholder(item.storage_path)}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleCopy(item.storage_path)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-300 hover:border-violet-500/40"
                      >
                        <Copy size={14} />
                        경로 복사
                      </button>

                      <button
                        onClick={() => handleCopy(item.original_url)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-500"
                      >
                        <Download size={14} />
                        원본 URL
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <ImageIcon className="mb-3 text-violet-400" size={20} />
            <h3 className="font-black">저장 형식</h3>
            <p className="mt-2 text-sm text-zinc-500">
              모든 이미지는 WebP로 변환 후 저장합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <Database className="mb-3 text-blue-400" size={20} />
            <h3 className="font-black">최적화 기준</h3>
            <p className="mt-2 text-sm text-zinc-500">
              최대 1600px, 품질 80, 목표 용량 1MB 이하.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <FolderOpen className="mb-3 text-emerald-400" size={20} />
            <h3 className="font-black">프로젝트 연결</h3>
            <p className="mt-2 text-sm text-zinc-500">
              이미지는 프로젝트와 원본 자료 단위로 묶어 관리합니다.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">현재 연결 상태</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            현재는 research_images 테이블 조회와 목록 표시까지 연결된 상태입니다.
            다음 단계에서 URL 이미지 추출, WebP 변환, Supabase Storage 저장 로직을 연결하면 실제 이미지가 표시됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}