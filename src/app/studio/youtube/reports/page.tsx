"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  Eye,
  ThumbsUp,
  MessageSquare,
  Layers,
  Clock
} from "lucide-react";
import Image from "next/image";
import VideoAnalysisModal from "../[section]/components/VideoAnalysisModal";

const PAGE_SIZE = 12;

type ReportRow = {
  id: string;
  video_id: string;
  created_at: string;
  analysis_content: string;
  snippet: {
    title: string;
    channelTitle: string;
    categoryId?: string;
    thumbnails: {
      medium: { url: string };
      default: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
};

const CATEGORY_MAP: Record<string, string> = {
  "10": "뮤직",
  "20": "게임",
  "24": "엔터테인먼트",
  "1": "영화/애니",
  "28": "테크/IT",
  "17": "스포츠",
  "25": "뉴스/시사"
};

function formatNumber(value?: string | number) {
  if (!value) return "0";
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}천`;
  }
  return num.toLocaleString();
}

function formatDisplayDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

export default function YoutubeReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state matching music library format
  const [filters, setFilters] = useState({
    category: "all",
    views: "all",
    likes: "all",
    dateRange: "all"
  });

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/youtube/reports");
        if (!res.ok) throw new Error("분석 리포트를 불러오는데 실패했습니다.");
        const result = await res.json();
        setReports(result.data || []);
      } catch (err: any) {
        setError(err.message || "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    void loadReports();
  }, []);

  // Filter handlers
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Main Filtering Logic
  const filteredReports = useMemo(() => {
    return reports.filter((row) => {
      // 1. Text Search query (title, channel)
      const title = row.snippet?.title || "";
      const channel = row.snippet?.channelTitle || "";
      const query = searchQuery.toLowerCase();
      const matchesSearch = title.toLowerCase().includes(query) || channel.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Category Filter
      if (filters.category !== "all") {
        const catId = row.snippet?.categoryId || "";
        const catName = CATEGORY_MAP[catId] || "기타";
        if (catName !== filters.category) return false;
      }

      // 3. Views Filter
      if (filters.views !== "all") {
        const viewNum = Number(row.statistics?.viewCount || 0);
        if (filters.views === "1만 이하" && viewNum > 10000) return false;
        if (filters.views === "5만 이하" && viewNum > 50000) return false;
        if (filters.views === "10만 이하" && viewNum > 100000) return false;
        if (filters.views === "100만 이하" && viewNum > 1000000) return false;
        if (filters.views === "100만 이상" && viewNum < 1000000) return false;
      }

      // 4. Likes Filter
      if (filters.likes !== "all") {
        const likeNum = Number(row.statistics?.likeCount || 0);
        if (filters.likes === "1천 이하" && likeNum > 1000) return false;
        if (filters.likes === "5천 이하" && likeNum > 5000) return false;
        if (filters.likes === "1만 이하" && likeNum > 10000) return false;
        if (filters.likes === "10만 이하" && likeNum > 100000) return false;
        if (filters.likes === "10만 이상" && likeNum < 100000) return false;
      }

      // 5. Date Filter (Analysis date)
      if (filters.dateRange !== "all") {
        const createdAtTime = Date.parse(row.created_at);
        const timeDiff = Date.now() - createdAtTime;
        if (filters.dateRange === "오늘") {
          const todayKst = new Date().toISOString().split("T")[0];
          const analysisKst = new Date(createdAtTime).toISOString().split("T")[0];
          if (todayKst !== analysisKst) return false;
        }
        if (filters.dateRange === "최근 7일" && timeDiff > 7 * 24 * 60 * 60 * 1000) return false;
        if (filters.dateRange === "최근 30일" && timeDiff > 30 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    });
  }, [reports, searchQuery, filters]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedReports = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, safeCurrentPage]);

  // Adjust page number if it goes out of bounds during search
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [searchQuery, totalPages, currentPage]);

  const handleOpenReport = (report: ReportRow) => {
    setSelectedVideo(report);
    setIsModalOpen(true);
  };

  // Pagination UI controls
  const paginationControls = (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={safeCurrentPage === 1}
        className="flex h-8 w-8 items-center justify-center border border-white/10 bg-[#0d0d12] text-zinc-400 transition hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="px-3 text-[13px] font-bold text-zinc-300">
        {safeCurrentPage} / {totalPages}
      </span>

      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={safeCurrentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center border border-white/10 bg-[#0d0d12] text-zinc-400 transition hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060608] px-6 py-8 text-zinc-100">
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-orange-400 rounded-full mb-3">
            <Sparkles size={11} className="text-orange-500 animate-pulse" />
            YOUTUBE TREND REPORTS
          </span>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <FileText className="text-orange-500" size={28} />
            급상승 영상 분석 리포트
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl font-medium leading-relaxed">
            Gemini AI가 정밀 분석한 대한민국 유튜브 급상승 영상의 흥행 코드와 Remix 기획안 히스토리를 제공합니다.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="영상 제목, 채널명 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/10 bg-[#0d0d12] text-[13px] text-zinc-200 placeholder-zinc-500 focus:border-orange-500/40 focus:outline-none transition font-bold"
          />
        </div>
      </div>

      {/* Filter Options Area - Matched with Music Library Page */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[14px]">
        {/* Category Option */}
        <label className="flex items-center gap-2 border border-white/10 bg-[#0d0d12] px-3 py-2 text-zinc-350 font-bold rounded-lg">
          <Layers className="h-4 w-4 text-orange-500 animate-pulse" />
          <span>카테고리</span>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="bg-[#0d0d12] text-zinc-100 outline-none cursor-pointer font-black"
          >
            <option value="all">전체 선택</option>
            <option value="뮤직">뮤직</option>
            <option value="게임">게임</option>
            <option value="엔터테인먼트">엔터테인먼트</option>
            <option value="영화/애니">영화/애니</option>
            <option value="테크/IT">테크/IT</option>
            <option value="스포츠">스포츠</option>
            <option value="뉴스/시사">뉴스/시사</option>
            <option value="기타">기타</option>
          </select>
        </label>

        {/* Views Option */}
        <label className="flex items-center gap-2 border border-white/10 bg-[#0d0d12] px-3 py-2 text-zinc-355 font-bold rounded-lg">
          <Eye className="h-4 w-4 text-orange-500" />
          <span>조회수</span>
          <select
            value={filters.views}
            onChange={(e) => handleFilterChange("views", e.target.value)}
            className="bg-[#0d0d12] text-zinc-100 outline-none cursor-pointer font-black"
          >
            <option value="all">전체 선택</option>
            <option value="1만 이하">1만 이하</option>
            <option value="5만 이하">5만 이하</option>
            <option value="10만 이하">10만 이하</option>
            <option value="100만 이하">100만 이하</option>
            <option value="100만 이상">100만 이상</option>
          </select>
        </label>

        {/* Likes Option */}
        <label className="flex items-center gap-2 border border-white/10 bg-[#0d0d12] px-3 py-2 text-zinc-355 font-bold rounded-lg">
          <ThumbsUp className="h-4 w-4 text-orange-500" />
          <span>좋아요수</span>
          <select
            value={filters.likes}
            onChange={(e) => handleFilterChange("likes", e.target.value)}
            className="bg-[#0d0d12] text-zinc-100 outline-none cursor-pointer font-black"
          >
            <option value="all">전체 선택</option>
            <option value="1천 이하">1천 이하</option>
            <option value="5천 이하">5천 이하</option>
            <option value="1만 이하">1만 이하</option>
            <option value="10만 이하">10만 이하</option>
            <option value="10만 이상">10만 이상</option>
          </select>
        </label>

        {/* Date Range Option */}
        <label className="flex items-center gap-2 border border-white/10 bg-[#0d0d12] px-3 py-2 text-zinc-355 font-bold rounded-lg">
          <Clock className="h-4 w-4 text-orange-500" />
          <span>분석 기간</span>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            className="bg-[#0d0d12] text-zinc-100 outline-none cursor-pointer font-black"
          >
            <option value="all">전체 선택</option>
            <option value="오늘">오늘</option>
            <option value="최근 7일">최근 7일</option>
            <option value="최근 30일">최근 30일</option>
          </select>
        </label>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-[13px] text-zinc-400 font-bold">
          검색 결과: 총{" "}
          <span className="text-orange-400 font-black">{filteredReports.length}개</span> 중{" "}
          {filteredReports.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1} -{" "}
          {Math.min(safeCurrentPage * PAGE_SIZE, filteredReports.length)} 표시
        </div>
        {paginationControls}
      </div>

      {/* Main Table Layout */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl shadow-black/30">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-amber-300/30 bg-amber-400/15 text-left text-[14px] font-black uppercase tracking-wider text-amber-100">
              <th className="w-16 px-4 py-3.5 text-center">번호</th>
              <th className="w-24 px-4 py-3.5 text-center">썸네일</th>
              <th className="min-w-[280px] px-4 py-3.5">영상 제목</th>
              <th className="w-32 px-4 py-3.5 text-center">카테고리</th>
              <th className="w-44 px-4 py-3.5 text-center">채널명</th>
              <th className="w-28 px-4 py-3.5 text-center">조회수</th>
              <th className="w-28 px-4 py-3.5 text-center">좋아요수</th>
              <th className="w-28 px-4 py-3.5 text-center">댓글수</th>
              <th className="w-32 px-4 py-3.5 text-center">상태</th>
              <th className="w-44 px-4 py-3.5 text-center">분석일</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={10} className="h-48 text-center text-zinc-500 py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                    <span className="text-xs font-bold mt-1 text-zinc-400">분석 리포트를 불러오는 중입니다.</span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && paginatedReports.length === 0 && (
              <tr>
                <td colSpan={10} className="h-48 text-center text-zinc-500 font-bold py-8">
                  조건에 일치하는 분석 AI 리포트 내역이 없습니다.
                </td>
              </tr>
            )}

            {paginatedReports.map((report, index) => {
              const absoluteIndex = (safeCurrentPage - 1) * PAGE_SIZE + index;
              const rowNumber = filteredReports.length - absoluteIndex;

              const title = report.snippet?.title || "제목 없음";
              const channel = report.snippet?.channelTitle || "채널 정보 없음";
              const catId = report.snippet?.categoryId || "";
              const categoryName = CATEGORY_MAP[catId] || "기타";
              const thumbnail = report.snippet?.thumbnails?.medium?.url || report.snippet?.thumbnails?.default?.url || "/placeholder.jpg";
              const viewCount = report.statistics?.viewCount || "0";
              const likeCount = report.statistics?.likeCount || "0";
              const commentCount = report.statistics?.commentCount || "0";

              return (
                <tr
                  key={report.id}
                  onClick={() => handleOpenReport(report)}
                  className="group cursor-pointer border-b border-white/5 align-middle transition odd:bg-white/[0.01] even:bg-white/[0.02] hover:bg-orange-500/10"
                >
                  {/* Number */}
                  <td className="px-4 py-3.5 text-center text-zinc-400 font-bold">{rowNumber}</td>

                  {/* Thumbnail */}
                  <td className="px-4 py-3.5 text-center align-middle">
                    <div className="relative inline-block h-12 w-20 overflow-hidden rounded bg-zinc-950 border border-zinc-800">
                      <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3.5 align-middle">
                    <button
                      type="button"
                      className="text-left font-black leading-snug text-orange-200 transition hover:text-orange-100 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenReport(report);
                      }}
                    >
                      {title}
                    </button>
                  </td>

                  {/* Category Name (NEW Column) */}
                  <td className="px-4 py-3.5 text-center align-middle">
                    <span className="inline-flex border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-zinc-300 rounded">
                      {categoryName}
                    </span>
                  </td>

                  {/* Channel Title */}
                  <td className="px-4 py-3.5 text-center text-zinc-300 font-bold align-middle">
                    {channel}
                  </td>

                  {/* Stats */}
                  <td className="px-4 py-3.5 text-center text-zinc-400 font-bold align-middle">
                    <span className="flex items-center justify-center gap-1">
                      <Eye size={12} className="text-zinc-500" />
                      {formatNumber(viewCount)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-zinc-400 font-bold align-middle">
                    <span className="flex items-center justify-center gap-1">
                      <ThumbsUp size={12} className="text-zinc-500" />
                      {formatNumber(likeCount)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-zinc-400 font-bold align-middle">
                    <span className="flex items-center justify-center gap-1">
                      <MessageSquare size={12} className="text-zinc-500" />
                      {formatNumber(commentCount)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5 text-center align-middle">
                    <span className="inline-flex border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-black text-orange-300 rounded">
                      AI 분석 완료
                    </span>
                  </td>

                  {/* Creation Date */}
                  <td className="px-4 py-3.5 text-center text-zinc-400 font-bold align-middle">
                    {formatDisplayDate(report.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-[13px] text-zinc-400">
        <div className="font-bold text-zinc-500">
          검색 결과: 총{" "}
          <span className="text-orange-400 font-black">{filteredReports.length}개</span> 중{" "}
          {filteredReports.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1} -{" "}
          {Math.min(safeCurrentPage * PAGE_SIZE, filteredReports.length)} 표시
        </div>
        {paginationControls}
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-3 border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-xs text-rose-200 font-bold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          분석 리포트를 불러오지 못했습니다: {error}
        </div>
      )}

      {/* Reused Video Analysis Modal with Left/Right navigation and hotkeys */}
      {isModalOpen && selectedVideo && (
        <VideoAnalysisModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
          videos={filteredReports}
          onVideoSelect={setSelectedVideo}
        />
      )}
    </div>
  );
}
