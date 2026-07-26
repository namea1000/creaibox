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

  // Leaderboard list
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [leaderboard, setLeaderboard] = useState<BlogScoreData[]>([]);

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
    fetchLeaderboard(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBlogId.trim()) {
      setSearchedId(inputBlogId.trim());
    }
  };

  return (
    <div className="space-y-8">
      {/* 🚀 상단 헤더 & 블로그 아이디 검진 검색바 */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-teal-950/40 border border-emerald-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase">
            CreAibox Blog Audit Engine
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            네이버 블로그 지수 진단
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            블로그 지수 확인(최적/준최), 발행글 누락 여부 검수까지 한 번에 실시간 진단합니다.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputBlogId}
              onChange={(e) => setInputBlogId(e.target.value)}
              placeholder="네이버 블로그 아이디를 입력하세요. 예) naver_diary, sorissu"
              className="w-full bg-black/80 border border-zinc-700/80 focus:border-emerald-500 text-white font-bold text-sm px-5 py-3.5 rounded-2xl outline-none transition-all pr-24"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
              진단하기
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
          <span className="font-bold">빠른 진단 아이디:</span>
          {["naver_diary", "sorissu", "ell_n", "parangusl", "jayuyu"].map((id) => (
            <button
              key={id}
              onClick={() => {
                setInputBlogId(id);
                setSearchedId(id);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              @{id}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 진단 결과 카드 리포트 */}
      {blogData && (
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <img src={blogData.profileImg} alt={blogData.nickname} className="w-16 h-16 rounded-2xl border-2 border-emerald-500/30 object-cover" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{blogData.nickname}</h2>
                  <span className="text-xs text-zinc-400 font-mono">(@{blogData.blogId})</span>
                  {blogData.isInfluencer && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                      인플루언서
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 font-medium">{blogData.blogTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right space-y-1">
                <span className="text-xs text-zinc-400 font-bold">측정 블로그 지수</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-emerald-400">{blogData.blogLevel}</span>
                  <span className={`w-3 h-3 rounded-full ${blogData.levelColor} animate-pulse`} />
                </div>
              </div>

              <a
                href={`https://blog.naver.com/${blogData.blogId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl transition-all"
                title="네이버 블로그 방문"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* 블로그 레벨 게이지 바 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-400">지수 신뢰도 게이지</span>
              <span className="text-emerald-400 font-mono">{blogData.levelPercent}%</span>
            </div>
            <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-zinc-800">
              <div
                style={{ width: `${blogData.levelPercent}%` }}
                className={`h-full ${blogData.levelColor} transition-all duration-500`}
              />
            </div>
          </div>

          {/* 4대 메트릭스 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-black/50 border border-zinc-800 p-4 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold block mb-1">카테고리</span>
              <span className="text-sm font-black text-white">{blogData.category}</span>
            </div>
            <div className="bg-black/50 border border-zinc-800 p-4 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold block mb-1">이웃 / 구독자 수</span>
              <span className="text-sm font-black text-emerald-400 font-mono">{blogData.subscriberCount.toLocaleString()} 명</span>
            </div>
            <div className="bg-black/50 border border-zinc-800 p-4 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold block mb-1">총 포스팅 수</span>
              <span className="text-sm font-black text-blue-400 font-mono">{blogData.totalPosts.toLocaleString()} 개</span>
            </div>
            <div className="bg-black/50 border border-zinc-800 p-4 rounded-2xl">
              <span className="text-xs text-zinc-400 font-bold block mb-1">생성 연차</span>
              <span className="text-sm font-black text-purple-400">{blogData.createdAge}</span>
            </div>
          </div>

          {/* 최근 발행 포스팅 누락 검수 테이블 */}
          <div className="space-y-3 pt-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileText size={18} className="text-emerald-400" />
              최근 발행 포스팅 검색 노출 및 지수 검수
            </h3>

            <div className="space-y-2">
              {blogData.recentPosts.map((post, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-black/40 border border-zinc-800 rounded-2xl text-xs">
                  <div className="space-y-1 max-w-xl">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1 flex items-center gap-1"
                    >
                      {post.title}
                      <ExternalLink size={10} className="text-zinc-500 shrink-0" />
                    </a>
                    <span className="text-[10px] text-zinc-500 font-mono">발행일: {post.pubDate}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-black text-[10px] ${
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
      )}

      {/* 🏆 전체 네이버 블로거 순위를 알아보세요 (리더보드) */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="text-amber-400" size={22} />
              전체 네이버 블로거 순위를 알아보세요
            </h3>
            <p className="text-xs text-zinc-400">카테고리별 상위 랭커 블로그 지수 및 이웃 수 리더보드</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400">카테고리:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white font-bold text-xs px-3 py-2 rounded-xl outline-none"
            >
              {["전체", "요리·레시피", "비즈니스·경제", "세계여행", "패션·미용"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
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
              {leaderboard.map((lb, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-black font-mono text-zinc-400">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        setInputBlogId(lb.blogId);
                        setSearchedId(lb.blogId);
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
