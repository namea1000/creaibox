"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  PlayCircle,
  Globe,
  UploadCloud,
  MessageCircle,
  Sparkles,
  Search,
  PenLine,
  Newspaper,
  Music,
  ArrowRight,
  Database,
  Home,
  Clock,
  Target,
  BookOpen,
  Wand2,
  Save,
  Link2,
  FolderOpen,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ResearchStudioPage() {
  const supabase = createClient();

  const [stats, setStats] = useState({
    projects: 0,
    sources: 0,
    extractions: 0,
    images: 0,
  });

  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    try {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;

      const [
        projectsRes,
        sourcesRes,
        extractionsRes,
        imagesRes,
        recentProjectsRes,
      ] = await Promise.all([
        supabase
          .from("research_projects")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("research_sources")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("research_extractions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("research_images")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("research_projects")
          .select("id, title, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        sources: sourcesRes.count || 0,
        extractions: extractionsRes.count || 0,
        images: imagesRes.count || 0,
      });

      setRecentProjects(recentProjectsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const statItems = [
    { label: "분석 프로젝트", value: stats.projects, icon: FolderOpen },
    { label: "업로드 자료", value: stats.sources, icon: UploadCloud },
    { label: "추출 결과", value: stats.extractions, icon: FileText },
    { label: "저장 이미지", value: stats.images, icon: ImageIcon },
  ];

  const sourceItems = [
    {
      title: "PDF 파일",
      desc: "논문, 보고서, 강의자료 PDF에서 텍스트를 추출합니다.",
      href: "/studio/research/create",
      icon: FileText,
      color: "from-violet-600 to-blue-600",
    },
    {
      title: "Word 문서",
      desc: "DOCX 문서의 본문, 제목, 문단을 추출합니다.",
      href: "/studio/research/create",
      icon: FileText,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "PPT 자료",
      desc: "PPTX 슬라이드의 제목, 본문, 발표자료를 정리합니다.",
      href: "/studio/research/create",
      icon: FileText,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Excel / CSV",
      desc: "표, 키워드 목록, 데이터 파일을 분석용 텍스트로 변환합니다.",
      href: "/studio/research/create",
      icon: FileSpreadsheet,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "이미지 OCR",
      desc: "JPG, PNG, WEBP 이미지 속 글자를 추출합니다.",
      href: "/studio/research/create",
      icon: ImageIcon,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "YouTube 자막",
      desc: "YouTube 주소를 입력해 자막 기반 원고를 추출합니다.",
      href: "/studio/research/create",
      icon: PlayCircle,
      color: "from-red-600 to-rose-600",
    },
    {
      title: "텍스트 붙여넣기",
      desc: "복사한 원고나 자료를 바로 붙여넣고 분석합니다.",
      href: "/studio/research/create",
      icon: PenLine,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "블로그 / 뉴스 / 웹페이지 URL",
      desc: "웹페이지 주소에서 본문, 이미지, 메타 정보를 추출합니다.",
      href: "/studio/research/create",
      icon: Globe,
      color: "from-cyan-600 to-blue-600",
    },
  ];

  const futureItems = [
    "AI 요약",
    "AI 질의응답",
    "블로그 생성",
    "SEO 글 생성",
    "뉴스 분석",
    "PDF 챗봇",
    "유튜브 대본 생성",
    "가사 / 음원 아이디어 생성",
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <Database size={15} />
                Research Studio
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                자료 분석 스튜디오
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                PDF, 문서, 이미지, YouTube, 웹페이지 자료를 업로드하거나 URL로 불러와
                텍스트를 추출하고, AI 요약·질문답변·콘텐츠 생성까지 연결하는 공간입니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/research/library"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 hover:border-violet-500/50"
              >
                <FolderOpen size={17} />
                자료 보관함
              </Link>

              <Link
                href="/studio/research/create"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
              >
                <UploadCloud size={17} />
                새 자료 분석
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
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

        <section className="grid gap-4 lg:grid-cols-2">
          <Link
            href="/studio/research/create"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/40"
          >
            <div className="flex items-center gap-3">
              <Link2 className="text-violet-400" size={20} />
              <h2 className="text-lg font-black">URL로 자료 불러오기</h2>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              블로그, 뉴스, 웹페이지, YouTube 주소를 입력해 자료를 저장합니다.
            </p>
          </Link>

          <Link
            href="/studio/research/create"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-violet-500/40"
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="text-blue-400" size={20} />
              <h2 className="text-lg font-black">파일 업로드</h2>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              파일 선택 또는 드래그 앤 드롭으로 자료를 업로드합니다.
            </p>
          </Link>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">자료 추출 메뉴</h2>
            <p className="mt-1 text-sm text-zinc-500">
              총 8가지 자료 입력 방식을 기준으로 텍스트와 이미지를 추출합니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sourceItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/40"
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
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-violet-400" size={20} />
              <h2 className="text-lg font-black">향후 확장 예정</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {futureItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black">최근 프로젝트</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-500">
              {loading ? (
                <p>불러오는 중...</p>
              ) : recentProjects.length === 0 ? (
                <p>최근 프로젝트가 없습니다.</p>
              ) : (
                recentProjects.map((project) => (
                  <p key={project.id} className="truncate">
                    {project.title || "제목 없음"}
                  </p>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Target className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black">추천 워크플로우</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <UploadCloud size={15} />
                자료 업로드
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={15} />
                텍스트 추출
              </div>

              <div className="flex items-center gap-2">
                <Wand2 size={15} />
                AI 요약 / 질문답변
              </div>

              <div className="flex items-center gap-2">
                <PenLine size={15} />
                블로그 / 대본 생성
              </div>

              <div className="flex items-center gap-2">
                <Save size={15} />
                프로젝트 저장
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <Home className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">현재 연결 상태</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            홈 화면은 research_projects, research_sources, research_extractions,
            research_images의 실제 카운트와 최근 프로젝트를 불러오도록 연결된 상태입니다.
          </p>
        </section>
      </div>
    </div>
  );
}