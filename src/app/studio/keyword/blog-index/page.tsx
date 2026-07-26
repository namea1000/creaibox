"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  ShieldAlert,
  Award,
  Users,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Flame,
} from "lucide-react";
import { BlogScoreData } from "@/lib/server/naver-blog-score";

export default function NaverBlogScorePage() {
  const [inputBlogId, setInputBlogId] = useState("");
  const [searchedId, setSearchedId] = useState("naver_diary");
  const [blogData, setBlogData] = useState<BlogScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  // Leaderboard list & pagination
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [leaderboard, setLeaderboard] = useState<BlogScoreData[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // 기본 50개 보기

  const fetchBlogScore = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/naver/blog-score?blogId=${encodeURIComponent(id)}`);
      const data = await res.json();
      setBlogData(data);
    } catch (err) {
      console.error("Blog score fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (cat: string) => {
    try {
      const res = await fetch(`/api/naver/blog-score?category=${encodeURIComponent(cat)}`);
      const data = await res.json();
      if (data.bloggers) {
        setLeaderboard(data.bloggers);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBlogScore(searchedId);
  }, [searchedId]);

  useEffect(() => {
    setPage(1);
    fetchLeaderboard(selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBlogId.trim()) {
      setSearchedId(inputBlogId.trim());
    }
  };

  const totalPages = Math.ceil(leaderboard.length / itemsPerPage) || 1;
  const paginatedLeaderboard = leaderboard.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* 🚀 상단 헤더 & 블로그 아이디 입력 바 */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-purple-950/40 border border-emerald-500/20 p-5 md:p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
            Naver Blog Score Analyzer
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            네이버 블로그 지수 진단
          </h1>
          <p className="text-zinc-400 text-xs font-medium">
            블로그 지수 확인(최적/준최), 썸네일 누락 여부 지수를 한 번에 실시간 진단합니다.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputBlogId}
              onChange={(e) => setInputBlogId(e.target.value)}
              placeholder="네이버 블로그 아이디를 입력하세요. 예) naver_diary, sorissu"
              className="w-full bg-black/80 border border-zinc-700 focus:border-emerald-500 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-2xl outline-none transition-all pr-24"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
              진단하기
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
          <span className="font-bold text-[11px]">빠른 진단 아이디:</span>
          {["@naver_diary", "@sorissu", "@ell_n", "@parangusl", "@jayuyu"].map((id) => (
            <button
              key={id}
              onClick={() => {
                const clean = id.replace("@", "");
                setInputBlogId(clean);
                setSearchedId(clean);
              }}
              className="px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-mono text-[11px]"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 2분할 (좌: 프로필+4대 메트릭스 / 우: 측정 지수 + 녹색 게이지 바 + 최근 포스팅 검수) */}
      {loading && (
        <div className="p-10 text-center text-zinc-400 space-y-2">
          <RefreshCw className="animate-spin text-emerald-400 mx-auto" size={24} />
          <p className="text-xs font-bold text-zinc-300">네이버 블로그 데이터를 분석 중입니다...</p>
        </div>
      )}

      {!loading && blogData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 🟢 좌측 패널: 블로그 프로필 + 4대 메트릭스 */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
            {/* 상단 프로필 정보 */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-zinc-800">
              <img
                src={blogData.profileImg}
                alt={blogData.nickname}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0 shadow-md"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-black text-white">{blogData.nickname}</h2>
                  <span className="text-xs text-zinc-400 font-mono">({blogData.blogId})</span>
                  {blogData.isInfluencer && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[10px]">
                      인플루언서
                    </span>
                  )}
                  <a
                    href={`https://blog.naver.com/${blogData.blogId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-auto"
                    title="블로그 바로가기"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <p className="text-xs text-zinc-400 truncate max-w-xs md:max-w-sm">{blogData.blogTitle}</p>
              </div>
            </div>

            {/* 4대 메트릭스 2x2 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-black/60 border border-zinc-800/80 p-3 rounded-2xl">
                <span className="text-xs text-zinc-400 font-bold block mb-1">카테고리</span>
                <span className="text-sm font-black text-white truncate block">{blogData.category}</span>
              </div>
              <div className="bg-black/60 border border-zinc-800/80 p-3 rounded-2xl">
                <span className="text-xs text-zinc-400 font-bold block mb-1">구독자수</span>
                <span className="text-sm font-black text-emerald-400 font-mono block truncate">
                  {blogData.subscriberCount.toLocaleString()}명
                </span>
              </div>
              <div className="bg-black/60 border border-zinc-800/80 p-3 rounded-2xl">
                <span className="text-xs text-zinc-400 font-bold block mb-1">총 포스팅</span>
                <span className="text-sm font-black text-blue-400 font-mono block truncate">
                  {blogData.totalPosts.toLocaleString()}개
                </span>
              </div>
              <div className="bg-black/60 border border-zinc-800/80 p-3 rounded-2xl">
                <span className="text-xs text-zinc-400 font-bold block mb-1">생성 연차</span>
                <span className="text-sm font-black text-purple-400 block truncate">{blogData.createdAge}</span>
              </div>
            </div>
          </div>

          {/* 🟢 우측 패널: [측정 블로그 지수 + 녹색 신뢰도 게이지 바] + 최근 발행 포스팅 검색 노출 검수 */}
          <div className="bg-zinc-900/80 border border-emerald-500/20 p-5 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
            {/* 🎯 상단: 측정 블로그 지수 + 녹색 게이지 바 (오른쪽 패널 위치) */}
            <div className="bg-black/50 p-3 rounded-2xl border border-zinc-800/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400">측정 블로그 지수:</span>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                    <strong className="text-base font-black text-emerald-400">{blogData.blogLevel}</strong>
                    <span className={`w-2.5 h-2.5 rounded-full ${blogData.levelColor} animate-pulse ml-0.5`} />
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">신뢰도 게이지 {blogData.levelPercent}%</span>
              </div>

              {/* 녹색 게이지 바 */}
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${blogData.levelPercent}%` }}
                  className={`h-full ${blogData.levelColor} transition-all duration-500`}
                />
              </div>
            </div>

            {/* 하단: 최근 발행 포스팅 검색 노출 및 지수 검수 목록 */}
            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                  <FileText size={16} className="text-emerald-400" />
                  최근 발행 포스팅 검색 노출 및 지수 검수
                </h3>
                <span className="text-[11px] font-bold text-zinc-400 font-mono">실시간 검수</span>
              </div>

              <div className="space-y-2">
                {blogData.recentPosts.map((post, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-black/60 border border-zinc-800/80 rounded-2xl text-xs gap-3 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1 text-xs md:text-sm flex items-center gap-1.5"
                      >
                        <span className="truncate">{post.title}</span>
                        <ExternalLink size={11} className="text-zinc-500 shrink-0" />
                      </a>
                      <span className="text-[11px] text-zinc-400 font-mono block">발행일: {post.pubDate}</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-black text-xs shrink-0 ${
                        post.indexingStatus === "최적"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : post.indexingStatus === "준최"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      ● {post.indexingStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏆 전체 네이버 블로거 순위를 알아보세요 (50개+ 리더보드) */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="text-amber-400" size={22} />
              전체 네이버 블로거 순위를 알아보세요 (총 {leaderboard.length}개 블로그)
            </h3>
            <p className="text-xs text-zinc-400">카테고리별 대한민국 상위 랭커 블로그 지수 및 이웃 수 리더보드</p>
          </div>

          <div className="flex items-center gap-3">
            {/* 노출 개수 선택 */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold bg-black/60 p-1.5 rounded-xl border border-zinc-800">
              <span className="px-2">표시 개수:</span>
              {[20, 50, 100].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setItemsPerPage(num);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    itemsPerPage === num ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {num}개씩
                </button>
              ))}
            </div>

            {/* 페이지 넘김 버튼 */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 font-mono text-xs text-zinc-400">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 font-bold text-white">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🏷️ 외부 노출 카테고리 탭 버튼들 */}
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-1 border-b border-zinc-800/80">
          <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1">
            <Flame size={14} className="text-amber-400" /> 카테고리 바로 선택:
          </span>
          {[
            "전체",
            "요리·레시피",
            "비즈니스·경제",
            "세계여행",
            "패션·미용",
            "IT·컴퓨터",
            "인테리어·DIY",
            "육아·결혼",
            "스포츠·레저",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold">
                <th className="py-3 px-4">랭킹</th>
                <th className="py-3 px-4">블로그명</th>
                <th className="py-3 px-4">생성일</th>
                <th className="py-3 px-4">카테고리</th>
                <th className="py-3 px-4">구독자수</th>
                <th className="py-3 px-4">포스팅 수</th>
                <th className="py-3 px-4">블로그지수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {paginatedLeaderboard.map((lb, idx) => {
                const rankNum = (page - 1) * itemsPerPage + idx + 1;
                return (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-black font-mono text-zinc-400">{rankNum}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          setInputBlogId(lb.blogId);
                          setSearchedId(lb.blogId);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex items-center gap-2 hover:text-emerald-400 transition-colors text-left"
                      >
                        <img src={lb.profileImg} className="w-7 h-7 rounded-lg object-cover" />
                        <div>
                          <span className="font-bold text-white block">{lb.nickname}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">({lb.blogId})</span>
                        </div>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{lb.createdAge}</td>
                    <td className="py-3.5 px-4 font-bold text-zinc-300">{lb.category}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-mono font-bold">{lb.subscriberCount.toLocaleString()} 명</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-mono">{lb.totalPosts.toLocaleString()} 포스팅</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-black text-[11px]">
                        {lb.blogLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
