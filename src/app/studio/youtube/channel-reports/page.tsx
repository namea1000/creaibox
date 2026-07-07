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
  Clock,
  Globe
} from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import VideoAnalysisModal from "../[section]/components/VideoAnalysisModal";

const PAGE_SIZE = 12;

type ReportRow = {
  id: string;
  video_id: string;
  created_at: string;
  analysis_content: string;
  country?: string;
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

const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
  KR: { name: "대한민국", flag: "🇰🇷" },
  US: { name: "미국", flag: "🇺🇸" },
  JP: { name: "일본", flag: "🇯🇵" },
  GB: { name: "영국", flag: "🇬🇧" },
  VN: { name: "베트남", flag: "🇻🇳" },
  IN: { name: "인도", flag: "🇮🇳" },
  BR: { name: "브라질", flag: "🇧🇷" },
  CA: { name: "캐나다", flag: "🇨🇦" }
};

const COUNTRIES_LIST = [
  { code: "KR", name: "대한민국", flag: "🇰🇷" },
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
  { code: "BR", name: "브라질", flag: "🇧🇷" },
  { code: "CA", name: "캐나다", flag: "🇨🇦" }
];

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

export default function YoutubeChannelReportsPage() {
  const { data: reports = [], isLoading, error } = useQuery<ReportRow[]>({
    queryKey: ["youtubeReports", "channel"],
    queryFn: async () => {
      const res = await fetch("/api/youtube/reports?type=channel");
      if (!res.ok) throw new Error("분석 리포트를 불러오는데 실패했습니다.");
      const result = await res.json();
      return result.data || [];
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state matching music library format
  const [filters, setFilters] = useState({
    country: "all",
    category: "all",
    views: "all",
    likes: "all",
    dateRange: "all"
  });

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      // 1.5 Country Filter
      if (filters.country !== "all") {
        if (row.country !== filters.country) return false;
      }

      // 2. Category Filter
      if (filters.category !== "all") {
        const catId = row.snippet?.categoryId || "";
        const categoryName = CATEGORY_MAP[catId] || catId || "기타";
        if (categoryName !== filters.category) return false;
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
          <span className="inline-flex items-center gap-1.5 border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-400 rounded-full mb-3">
            <Sparkles size={11} className="text-cyan-500 animate-pulse" />
            YOUTUBE CHANNEL REPORTS
          </span>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <FileText className="text-cyan-500" size={28} />
            인기 채널 영상분석 리포트
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl font-medium leading-relaxed">
            인기 채널 분석 레이더를 기동하여 정밀 AI 데이터 분석을 완료한 라이벌 영상들의 리포트 보관함입니다.
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
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/10 bg-[#0d0d12] text-[13px] text-zinc-200 placeholder-zinc-500 focus:border-cyan-500/40 focus:outline-none transition font-bold"
          />
        </div>
      </div>

      {/* Filter Options Area - Matched with Music Library Page */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[14px]">
        {/* Country Option */}
        <label className="flex items-center gap-2 border border-white/10 bg-[#0d0d12] px-3 py-2 text-zinc-355 font-bold rounded-lg">
          <Globe className="h-4 w-4 text-cyan-500" />
          <span>국가</span>
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="bg-[#0d0d12] text-zinc-100 outline-none cursor-pointer font-black"
          >
            <option value="all">전체 선택</option>
            {COUNTRIES_LIST.map((ct) => (
              <option key={ct.code} value={ct.code}>
                {ct.flag} {ct.name}
              </option>
            ))}
          </select>
        </label>

        {/* Category Option */}
        <label className="flex items-center gap-2 border border-white/10 bg-[#0d0d12] px-3 py-2 text-zinc-355 font-bold rounded-lg">
          <Layers className="h-4 w-4 text-cyan-500" />
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
          <Eye className="h-4 w-4 text-cyan-500" />
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
          <ThumbsUp className="h-4 w-4 text-cyan-500" />
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
          <Clock className="h-4 w-4 text-cyan-500" />
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
          <span className="text-cyan-400 font-black">{filteredReports.length}개</span> 중{" "}
          {filteredReports.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1} -{" "}
          {Math.min(safeCurrentPage * PAGE_SIZE, filteredReports.length)} 표시
        </div>
        {paginationControls}
      </div>

      {/* Main Table Layout */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl shadow-black/30">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-cyan-300/30 bg-cyan-400/15 text-left text-[14px] font-black uppercase tracking-wider text-cyan-100">
              <th className="w-16 px-4 py-3.5 text-center">번호</th>
              <th className="w-24 px-4 py-3.5 text-center">썸네일</th>
              <th className="min-w-[280px] px-4 py-3.5">영상 제목</th>
              <th className="w-28 px-4 py-3.5 text-center">국가</th>
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
                <td colSpan={11} className="h-48 text-center text-zinc-500 py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
                    <span className="text-xs font-bold mt-1 text-zinc-400">분석 리포트를 불러오는 중입니다.</span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && paginatedReports.length === 0 && (
              <tr>
                <td colSpan={11} className="h-48 text-center text-zinc-500 font-bold py-8">
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
              const categoryName = CATEGORY_MAP[catId] || catId || "기타";
              const thumbnail = report.snippet?.thumbnails?.medium?.url || report.snippet?.thumbnails?.default?.url || "/placeholder.jpg";
              const viewCount = report.statistics?.viewCount || "0";
              const likeCount = report.statistics?.likeCount || "0";
              const commentCount = report.statistics?.commentCount || "0";

              return (
                <tr
                  key={report.id}
                  onClick={() => handleOpenReport(report)}
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition"
                >
                  <td className="px-4 py-3 text-center text-zinc-500 font-bold">{rowNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="relative mx-auto h-10 w-16 overflow-hidden rounded border border-white/15 bg-zinc-900">
                      <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-100 max-w-[340px] truncate" title={title}>
                    {title}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded-full bg-zinc-800 border border-zinc-700/60 px-2 py-0.5 text-[11px] font-black text-zinc-300 gap-1 items-center">
                      <span className="text-xs leading-none">{COUNTRY_MAP[report.country || "KR"]?.flag || "🇰🇷"}</span>
                      <span>{COUNTRY_MAP[report.country || "KR"]?.name || "대한민국"}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded-full bg-cyan-950/40 border border-cyan-900/40 px-2.5 py-0.5 text-[11px] font-black text-cyan-400">
                      {categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-zinc-300 max-w-[150px] truncate" title={channel}>
                    {channel}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-300 font-bold">{formatNumber(viewCount)}</td>
                  <td className="px-4 py-3 text-center text-zinc-300 font-bold">{formatNumber(likeCount)}</td>
                  <td className="px-4 py-3 text-center text-zinc-300 font-bold">{formatNumber(commentCount)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded bg-[#20202d] px-2 py-0.5 text-[10px] font-black text-[#58ad7a] border border-[#2b2b3d]">
                      AI 분석 완료
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-400 font-bold text-xs">
                    {formatDisplayDate(report.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Video Analysis Modal */}
      {isModalOpen && selectedVideo && (
        <VideoAnalysisModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
          onVideoSelect={setSelectedVideo}
          reportType="channel"
        />
      )}
    </div>
  );
}
