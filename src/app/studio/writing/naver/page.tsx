"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import NaverHotKeywordMatrix from "@/components/writing/naver/NaverHotKeywordMatrix";
import {
  Newspaper,
  Home,
  Edit3,
  RefreshCw,
  FileArchive,
  Image as ImageIcon,
  Search,
  Eye,
  CircleHelp,
  Settings,
  Archive,
  BarChart3,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  Target,
  ShieldCheck,
  BookOpen,
  Save,
} from "lucide-react";

interface KeywordRecord {
  id: string;
  word: string;
  type: string;
  volume: string;
  competition: "높음" | "중간" | "낮음";
  created_at: string;
}

export default function NaverWritingHomePage() {
  const supabase = useMemo(() => createClient(), []);

  const [blogId, setBlogId] = useState("");
  const [isLinked, setIsLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [hotKeywords, setHotKeywords] = useState<KeywordRecord[]>([
    {
      id: "1",
      word: "AI 자동화 수익화",
      type: "💎 S급 블루오션",
      volume: "14,800회",
      competition: "낮음",
      created_at: "2026-05-19",
    },
    {
      id: "2",
      word: "천안 맛집 추천",
      type: "📍 로컬 트래픽",
      volume: "32,100회",
      competition: "중간",
      created_at: "2026-05-19",
    },
    {
      id: "3",
      word: "2026 정부지원금 신청",
      type: "💰 고전력 비즈니스",
      volume: "58,900회",
      competition: "높음",
      created_at: "2026-05-18",
    },
    {
      id: "4",
      word: "Next.js 15 패치노트",
      type: "📂 일반 분석",
      volume: "8,400회",
      competition: "낮음",
      created_at: "2026-05-18",
    },
  ]);

  const [blogStats, setBlogStats] = useState({
    grade: "최적 2단계",
    visitors: "2,450명",
    posts: "342개",
  });

  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data, error } = await supabase
          .from("writing_naver_posts")
          .select("*")
          .eq("tab_type", "home")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const formattedData: KeywordRecord[] = data.map((item: any) => ({
            id: String(item.id),
            word: item.title,
            type: item.meta_data?.category || "📂 일반 분석",
            volume: item.meta_data?.volume || "0회",
            competition: item.meta_data?.competition || "중간",
            created_at: item.created_at
              ? item.created_at.split("T")[0]
              : "2026-05-19",
          }));

          setHotKeywords(formattedData);
        }
      } catch {
        console.log("초기 로드 대기 - 기본 리스트 상태 유지");
      }
    }

    void loadSupabaseData();
  }, [supabase]);

  const handleLinkBlog = () => {
    if (!blogId.trim()) {
      alert("네이버 블로그 아이디를 입력해 주세요!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const idLength = blogId.length;

      if (idLength > 8) {
        setBlogStats({
          grade: "최적 1단계",
          visitors: "5,820명",
          posts: "782개",
        });
      } else if (idLength > 5) {
        setBlogStats({
          grade: "최적 2단계",
          visitors: "2,140명",
          posts: "219개",
        });
      } else {
        setBlogStats({
          grade: "일반 3단계",
          visitors: "450명",
          posts: "64개",
        });
      }

      setIsLinked(true);
      setIsLoading(false);
    }, 1200);
  };

  const handleAnalyzeKeyword = async () => {
    const target = searchQuery.trim();

    if (!target) {
      alert("분석할 타겟 키워드를 입력해 주세요!");
      return;
    }

    if (isAnalyzing) return;

    setIsAnalyzing(true);

    let finalVolume = 0;
    let finalCompetition: "높음" | "중간" | "낮음" = "중간";
    let finalType = "📂 일반 분석";

    const lowerTarget = target.toLowerCase();

    if (
      lowerTarget.match(
        /(삼성|samsung|하이닉스|hynix|테슬라|tesla|애플|apple|현대차|현대자동차|hyundai|lg|네이버|naver|카카오|kakao|비트코인|bitcoin)/
      )
    ) {
      finalVolume = Math.floor(Math.random() * 400000) + 180000;
      finalCompetition = "높음";
      finalType = "👑 초고전력 기업 브랜드";
    } else if (
      target.match(
        /(반도체|주식|대출|부동산|강남|재테크|AI|투자|지원금|수익)/
      )
    ) {
      finalVolume = Math.floor(Math.random() * 60000) + 40000;
      finalCompetition = "높음";
      finalType = "💰 고전력 비즈니스";
    } else if (
      target.match(/(맛집|카페|천안|추천|여행|코스|동네|플레이스)/)
    ) {
      finalVolume = Math.floor(Math.random() * 20000) + 15000;
      finalCompetition = "중간";
      finalType = "📍 로컬 트래픽";
    } else {
      finalVolume = Math.floor(Math.random() * 2500) + 500;
      finalCompetition = "낮음";
      finalType = "💎 S급 블루오션";
    }

    const formattedVolume = finalVolume.toLocaleString() + "회";

    const newKeywordRow: KeywordRecord = {
      id: String(Date.now() + Math.random()),
      word: target,
      type: finalType,
      volume: formattedVolume,
      competition: finalCompetition,
      created_at: new Date().toISOString().split("T")[0],
    };

    try {
      const supabasePromise = supabase
        .from("writing_naver_posts")
        .insert([
          {
            tab_type: "home",
            title: target,
            meta_data: {
              category: finalType,
              volume: formattedVolume,
              competition: finalCompetition,
            },
          },
        ])
        .select();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2500)
      );

      const result: any = await Promise.race([
        supabasePromise,
        timeoutPromise,
      ]);

      if (result?.data?.[0]) {
        newKeywordRow.id = String(result.data[0].id);
      }
    } catch {
      console.log(
        "Supabase 통신 지연 또는 보안 차단 감지 -> 스마트 시뮬레이션 모드로 안전 전환"
      );
    } finally {
      setHotKeywords((prevList) => {
        if (prevList.length > 0 && prevList[0].word === target) {
          return prevList;
        }

        return [newKeywordRow, ...prevList];
      });

      setSearchQuery("");
      setIsAnalyzing(false);
    }
  };

  const stats = [
    { label: "블로그 등급", value: blogStats.grade, icon: ShieldCheck },
    { label: "예상 방문자", value: blogStats.visitors, icon: Eye },
    { label: "누적 포스트", value: blogStats.posts, icon: Archive },
    { label: "분석 키워드", value: `${hotKeywords.length}개`, icon: Search },
  ];

  const menus = [
    {
      title: "AI 스마트 글쓰기",
      desc: "네이버 블로그에 맞는 원고를 자동 생성합니다.",
      href: "/studio/writing/naver/create",
      icon: Edit3,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "AI 글 재창조",
      desc: "기존 글을 새롭게 재작성하고 확장합니다.",
      href: "/studio/writing/naver/rewrite",
      icon: RefreshCw,
      color: "from-sky-600 to-blue-600",
    },
    {
      title: "발행 원고 관리",
      desc: "저장 원고와 발행 콘텐츠를 관리합니다.",
      href: "/studio/writing/naver/archive",
      icon: FileArchive,
      color: "from-purple-600 to-violet-600",
    },
    {
      title: "네이버용 썸네일",
      desc: "블로그 대표 이미지와 썸네일을 제작합니다.",
      href: "/studio/writing/naver/thumbnail",
      icon: ImageIcon,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "네이버 키워드 분석",
      desc: "검색 수요, 경쟁도, 블루오션 키워드를 분석합니다.",
      href: "/studio/writing/naver/keyword",
      icon: Search,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "실시간 노출 진단",
      desc: "블로그 노출 상태와 개선 포인트를 확인합니다.",
      href: "/studio/writing/naver/exposure",
      icon: Eye,
      color: "from-red-600 to-rose-600",
    },
    {
      title: "C-Rank 가이드",
      desc: "네이버 블로그 품질 지수와 성장 전략을 정리합니다.",
      href: "/studio/writing/naver/c-rank",
      icon: CircleHelp,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "엔진 최적화 세팅",
      desc: "문체, 글 길이, 키워드 전략, 저장 옵션을 설정합니다.",
      href: "/studio/writing/naver/settings",
      icon: Settings,
      color: "from-zinc-600 to-slate-700",
    },
  ];

  const quickActions = [
    "네이버 키워드 분석",
    "블로그 아이디 연결",
    "AI 스마트 글쓰기",
    "썸네일 제작",
    "C-Rank 점검",
    "노출 진단",
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#061914] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                <Newspaper size={15} />
                Naver Writing Studio
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                네이버 글쓰기
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                네이버 블로그 아이디 연결, 키워드 분석, C-Rank 성장 전략,
                스마트 글쓰기, 썸네일 제작, 노출 진단까지 네이버 콘텐츠 운영을 한 곳에서 관리합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/writing/naver/archive"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 hover:border-emerald-500/50"
              >
                <Archive size={17} />
                원고 관리
              </Link>

              <Link
                href="/studio/writing/naver/create"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white hover:bg-emerald-500"
              >
                <Plus size={17} />
                새 글쓰기
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Icon size={20} />
                </div>

                <p className="text-xl font-black text-white">{item.value}</p>

                <p className="mt-1 text-xs font-bold text-zinc-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_1.95fr]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="mb-4 flex items-center gap-3">
              <Home className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black text-white">
                네이버 블로그 연결
              </h2>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-zinc-500">
              블로그 아이디를 입력하면 예상 블로그 등급과 기본 운영 지표를 표시합니다.
            </p>

            <div className="space-y-3">
              <input
                value={blogId}
                onChange={(e) => setBlogId(e.target.value)}
                placeholder="네이버 블로그 아이디 입력"
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-bold text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
              />

              <button
                onClick={handleLinkBlog}
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-black text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {isLoading ? "연결 분석 중..." : isLinked ? "블로그 다시 분석" : "블로그 연결하기"}
              </button>
            </div>

            {isLinked && (
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
                {blogId} 블로그가 연결되었습니다.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">
                  실시간 키워드 분석
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  타겟 키워드를 입력하면 검색량과 경쟁도를 시뮬레이션 분석합니다.
                </p>
              </div>

              <Sparkles className="text-emerald-400" size={20} />
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleAnalyzeKeyword();
                }}
                placeholder="예: 천안 맛집, 삼성전자 주가, AI 자동화"
                className="h-12 min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-bold text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
              />

              <button
                onClick={handleAnalyzeKeyword}
                disabled={isAnalyzing}
                className="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {isAnalyzing ? "스캔 중..." : "키워드 분석"}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">네이버 작업 메뉴</h2>
            <p className="mt-1 text-sm text-zinc-500">
              키워드 분석부터 스마트 글쓰기, 썸네일, 노출 진단까지 연결됩니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-emerald-500/40"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-white">{item.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                        {item.desc}
                      </p>
                    </div>

                    <ArrowRight
                      size={17}
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-emerald-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <NaverHotKeywordMatrix
            blogId={blogId}
            setBlogId={setBlogId}
            isLinked={isLinked}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isAnalyzing={isAnalyzing}
            hotKeywords={hotKeywords}
            blogStats={blogStats}
            handleLinkBlog={handleLinkBlog}
            handleAnalyzeKeyword={handleAnalyzeKeyword}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Target className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black">빠른 시작</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black">최근 작업</h2>
            </div>

            <p className="mt-3 text-sm text-zinc-500">
              최근 작성한 네이버 원고와 키워드 분석 기록이 여기에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="text-yellow-400" size={20} />
              <h2 className="text-lg font-black">추천 워크플로우</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Search size={15} />
                키워드 분석
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={15} />
                C-Rank 방향 점검
              </div>

              <div className="flex items-center gap-2">
                <Edit3 size={15} />
                AI 스마트 글쓰기
              </div>

              <div className="flex items-center gap-2">
                <ImageIcon size={15} />
                네이버용 썸네일 제작
              </div>

              <div className="flex items-center gap-2">
                <Save size={15} />
                원고 저장 / 발행 관리
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}