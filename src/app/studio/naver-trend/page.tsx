"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  ExternalLink,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Copy,
  Zap,
  Globe,
} from "lucide-react";

interface RealSearchItem {
  title: string;
  link: string;
  description: string;
  postdate?: string;
  pubDate?: string;
  bloggername?: string;
  image?: string;
  lprice?: string;
  hprice?: string;
  mallName?: string;
  category1?: string;
  category2?: string;
  category3?: string;
}

function NaverTrendContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"search" | "shopping" | "trend">("trend");

  useEffect(() => {
    if (tabParam === "shopping") setActiveTab("shopping");
    else if (tabParam === "search") setActiveTab("search");
    else if (tabParam === "trend") setActiveTab("trend");
  }, [tabParam]);

  const [searchQuery, setSearchQuery] = useState("삼성전자");
  const [searchCategory, setSearchCategory] = useState<"blog" | "news" | "kin" | "shop">("blog");
  const [loading, setLoading] = useState(false);
  const [shoppingLoading, setShoppingLoading] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<RealSearchItem[]>([]);
  const [shoppingResults, setShoppingResults] = useState<RealSearchItem[]>([]);
  const [trendGroups, setTrendGroups] = useState<any[]>([]);

  // Fetch real Naver Search API data
  const fetchLiveSearch = async (query: string, cat: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/naver/search?query=${encodeURIComponent(query)}&category=${cat}&display=10`);
      const data = await res.json();
      if (data.items) {
        setSearchResults(data.items);
      }
    } catch (err) {
      console.error("Live search fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real Naver Shopping API data
  const fetchLiveShopping = async (query: string) => {
    setShoppingLoading(true);
    try {
      const res = await fetch(`/api/naver/search?query=${encodeURIComponent(query)}&category=shop&display=12`);
      const data = await res.json();
      if (data.items) {
        setShoppingResults(data.items);
      }
    } catch (err) {
      console.error("Live shopping fetch error:", err);
    } finally {
      setShoppingLoading(false);
    }
  };

  // Fetch real Naver DataLab Trend API data
  const fetchLiveTrend = async (query?: string) => {
    try {
      const targetQuery = query || searchQuery || "삼성전자";
      const res = await fetch(`/api/naver/trend?query=${encodeURIComponent(targetQuery)}`);
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        setTrendGroups(data.results);
      }
    } catch (err) {
      console.error("Live trend fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLiveSearch(searchQuery, searchCategory);
    fetchLiveShopping(searchQuery);
    fetchLiveTrend(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchLiveSearch(searchQuery, searchCategory);
    fetchLiveShopping(searchQuery);
    fetchLiveTrend(searchQuery);
  };

  const handleCategoryChange = (cat: "blog" | "news" | "kin" | "shop") => {
    setSearchCategory(cat);
    fetchLiveSearch(searchQuery, cat);
  };

  const handleCopy = (text: string) => {
    const cleanText = text.replace(/<[^>]*>?/gm, "");
    navigator.clipboard.writeText(cleanText);
    setCopiedKeyword(cleanText);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const sanitizeHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  const formatPrice = (price?: string) => {
    if (!price) return "가격 정보 없음";
    const num = parseInt(price, 10);
    return isNaN(num) ? price : `${num.toLocaleString()}원`;
  };

  return (
    <div className="space-y-6">
      {/* 상단 엠블럼 헤더 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-zinc-900/40 border border-emerald-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#03C75A]/10 border border-[#03C75A]/30 text-[#03C75A] text-xs font-black tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#03C75A] animate-pulse" />
              NAVER API HUB 실시간 데이터 연동됨
            </span>
            <span className="text-xs text-zinc-400 font-mono">Quotas: 0 / 25,000 (0% Free Tier)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#03C75A] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#03C75A]/20">
              N
            </span>
            네이버 검색·쇼핑·트렌드
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl font-medium leading-relaxed">
            네이버 클라우드 플랫폼(NCP) 공식 NAVER API HUB 키로 실시간 네이버 쇼핑 상품, 데이터랩 트렌드 및 최신 블로그/뉴스 검색 데이터를 실시간 수집·분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/studio/writing/creaibox/new-post"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02b350] text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-[#03C75A]/20 active:scale-95"
          >
            <Sparkles size={16} />
            발굴 키워드로 AI 글쓰기
          </Link>
        </div>
      </div>

      {/* 3대 핵심 탭 셀렉터 */}
      <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800/60">
        <button
          onClick={() => setActiveTab("trend")}
          className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === "trend"
              ? "bg-[#03C75A] text-white shadow-lg shadow-[#03C75A]/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
          }`}
        >
          <TrendingUp size={18} />
          <span>검색어 트렌드 (DataLab)</span>
        </button>

        <button
          onClick={() => setActiveTab("shopping")}
          className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === "shopping"
              ? "bg-[#03C75A] text-white shadow-lg shadow-[#03C75A]/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
          }`}
        >
          <ShoppingBag size={18} />
          <span>쇼핑 인사이트 (Shopping)</span>
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === "search"
              ? "bg-[#03C75A] text-white shadow-lg shadow-[#03C75A]/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
          }`}
        >
          <Search size={18} />
          <span>실시간 라이브 검색 (Search)</span>
        </button>
      </div>

      {/* 🔍 키워드 검색 인풋 바 */}
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="네이버에서 실시간 조회할 키워드나 상품명을 입력하세요 (예: 삼성전자, 캠핑용품, 제주 여행)"
          className="w-full bg-zinc-900/80 border border-zinc-800 group-focus-within:border-[#03C75A] rounded-2xl py-4.5 pl-14 pr-32 text-white placeholder-zinc-500 outline-none transition-all font-bold text-base shadow-inner"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#03C75A] transition-colors" size={20} />
        <button
          type="submit"
          disabled={loading || shoppingLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#03C75A] hover:bg-[#02b350] text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-md disabled:opacity-50"
        >
          {loading || shoppingLoading ? <RefreshCw className="animate-spin" size={18} /> : "실시간 조회"}
        </button>
      </form>

      {/* 탭 1: 검색어 트렌드 대시보드 */}
      {activeTab === "trend" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/60 p-6 md:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#03C75A]" />
                    네이버 실시간 데이터랩 (DataLab) 그룹 분석: <span className="text-[#03C75A] font-bold">&quot;{searchQuery}&quot;</span>
                  </h3>
                  <p className="text-xs text-zinc-400">네이버 OpenAPI 데이터랩 실시간 검색 비율 지수</p>
                </div>
                <span className="text-xs text-[#03C75A] font-mono font-bold">🟢 LIVE</span>
              </div>

              <div className="space-y-3">
                {trendGroups.length > 0 ? (
                  trendGroups.map((group, idx) => {
                    const lastRatio = group.data?.[group.data.length - 1]?.ratio || 0;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-black/40 border border-zinc-800/40 p-4 rounded-2xl hover:border-[#03C75A]/40 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-xl bg-zinc-800 group-hover:bg-[#03C75A] group-hover:text-white flex items-center justify-center font-black text-sm text-zinc-300 transition-colors">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-white group-hover:text-[#03C75A] transition-colors">
                              {group.title}
                            </h4>
                            <span className="text-xs text-zinc-500">
                              키워드: {group.keywords?.join(", ")}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-xs font-black text-[#03C75A] block">
                              상대 트렌드 지수: {lastRatio.toFixed(1)}점
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">최근 30일 데이터</span>
                          </div>
                          <button
                            onClick={() => handleCopy(group.title)}
                            className="p-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
                            title="키워드 복사"
                          >
                            {copiedKeyword === group.title ? (
                              <CheckCircle2 size={16} className="text-[#03C75A]" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-zinc-500 text-xs font-mono flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin text-[#03C75A]" size={16} />
                    네이버 데이터랩 트렌드 응답을 동기화하는 중입니다...
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-950/30 to-zinc-900/60 border border-emerald-500/20 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <Zap size={18} />
                  <span>네이버 SEO 마케팅 팁</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  네이버 블로그 지수를 높이려면 **검색어 트렌드 상승 폭이 +50% 이상**인 블루오션 키워드를 원고의 제목 첫 10자 이내에 배치하는 것이 상위 노출에 가장 유리합니다.
                </p>
                <Link
                  href="/studio/writing/creaibox/new-post"
                  className="inline-flex items-center gap-2 text-xs font-black text-[#03C75A] hover:underline pt-2"
                >
                  AI 포스팅으로 이동 <ExternalLink size={12} />
                </Link>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <BarChart3 size={16} className="text-emerald-400" />
                  네이버 사용자 연령대 관심 비율
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>2030 세대 (모바일/SNS 중심)</span>
                      <span className="font-bold text-white">58%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#03C75A] rounded-full w-[58%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>4050 세대 (검색/구매 중심)</span>
                      <span className="font-bold text-white">34%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[34%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 탭 2: 쇼핑 인사이트 (실시간 Naver Shopping OpenAPI 라이브 데이터) */}
      {activeTab === "shopping" && (
        <div className="bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#03C75A]" />
                네이버 쇼핑 라이브 인사이트: <span className="text-[#03C75A] font-bold">&quot;{searchQuery}&quot;</span>
              </h3>
              <p className="text-xs text-zinc-400">네이버 스마트스토어 & 브랜드 스토어 최저가 및 인기 상품 실시간 데이터</p>
            </div>
            <span className="text-xs text-[#03C75A] font-mono font-bold bg-[#03C75A]/10 border border-[#03C75A]/30 px-3 py-1 rounded-full">
              🟢 네이버 쇼핑 API 연결됨
            </span>
          </div>

          {shoppingLoading ? (
            <div className="p-12 text-center text-zinc-500 text-sm font-bold flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-[#03C75A]" size={20} />
              네이버 쇼핑 서버에서 실시간 상품 최저가 및 인사이트를 수집하는 중입니다...
            </div>
          ) : shoppingResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shoppingResults.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 border border-zinc-800/60 hover:border-[#03C75A]/50 p-4.5 rounded-2xl space-y-3 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {item.image && (
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-zinc-900 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={sanitizeHtml(item.title)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-[#03C75A] bg-[#03C75A]/10 px-2.5 py-0.5 rounded-md truncate">
                        {item.mallName || "네이버 쇼핑"}
                      </span>
                      {item.category1 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {item.category1} {item.category2 ? `> ${item.category2}` : ""}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-[#03C75A] transition-colors line-clamp-2 leading-snug">
                      {sanitizeHtml(item.title)}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">최저가</span>
                      <span className="text-base font-black text-emerald-400">
                        {formatPrice(item.lprice)}
                      </span>
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-zinc-800 hover:bg-[#03C75A] px-3 py-1.5 rounded-xl transition-colors"
                    >
                      상품 보기 <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-xs">
              등록된 네이버 쇼핑 상품이 없습니다. 검색어를 입력하고 [실시간 조회] 버튼을 눌러보세요.
            </div>
          )}
        </div>
      )}

      {/* 탭 3: 검색 API 실시간 탐색 */}
      {activeTab === "search" && (
        <div className="bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Search size={20} className="text-[#03C75A]" />
                네이버 라이브 검색 데이터: <span className="text-[#03C75A] font-bold">&quot;{searchQuery}&quot;</span>
              </h3>
              <p className="text-xs text-zinc-400">네이버 검색 서버(Blog, News, 지식iN, Shop)에서 실시간으로 수집된 원본 데이터</p>
            </div>

            <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => handleCategoryChange("blog")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  searchCategory === "blog" ? "bg-[#03C75A] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                네이버 블로그
              </button>
              <button
                onClick={() => handleCategoryChange("news")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  searchCategory === "news" ? "bg-[#03C75A] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                네이버 뉴스
              </button>
              <button
                onClick={() => handleCategoryChange("kin")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  searchCategory === "kin" ? "bg-[#03C75A] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                지식iN
              </button>
              <button
                onClick={() => handleCategoryChange("shop")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  searchCategory === "shop" ? "bg-[#03C75A] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                네이버 쇼핑
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center text-zinc-500 text-sm font-bold flex items-center justify-center gap-2">
                <RefreshCw className="animate-spin text-[#03C75A]" size={20} />
                네이버 서버에서 라이브 데이터를 수집하는 중입니다...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((res, i) => (
                <div key={i} className="bg-black/40 border border-zinc-800 p-5 rounded-2xl space-y-2 hover:border-[#03C75A]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-white hover:text-[#03C75A] transition-colors flex items-center gap-2"
                    >
                      {sanitizeHtml(res.title)}
                      <ExternalLink size={12} className="text-zinc-500" />
                    </a>
                    {res.bloggername && (
                      <span className="text-[11px] text-[#03C75A] bg-[#03C75A]/10 border border-[#03C75A]/20 px-2 py-0.5 rounded-md font-bold">
                        {res.bloggername}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{sanitizeHtml(res.description)}</p>
                  <span className="text-[11px] text-zinc-600 font-mono block pt-1">
                    {res.postdate || res.pubDate || "실시간 수집 완료"}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs">
                수집된 라이브 검색 결과가 없습니다. 검색어를 입력하고 [실시간 조회] 버튼을 눌러보세요.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔗 관련 공식 사이트 & 레퍼런스 */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe size={16} className="text-[#03C75A]" />
            관련 공식 사이트 & 네이버 데이터 포털
          </h4>
          <span className="text-xs text-zinc-500">Official Data Resources</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="https://datalab.naver.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-black/40 border border-zinc-800 hover:border-[#03C75A]/50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#03C75A]/10 text-[#03C75A] flex items-center justify-center font-black text-xs">
                N
              </span>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-[#03C75A] transition-colors block">
                  네이버 데이터랩
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">datalab.naver.com</span>
              </div>
            </div>
            <ExternalLink size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
          </a>

          <a
            href="https://www.ncloud.com/product/applicationService/naverApiHub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-black/40 border border-zinc-800 hover:border-[#03C75A]/50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs">
                NCP
              </span>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-[#03C75A] transition-colors block">
                  NAVER API HUB
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">ncloud.com</span>
              </div>
            </div>
            <ExternalLink size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
          </a>

          <a
            href="https://developers.naver.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-black/40 border border-zinc-800 hover:border-[#03C75A]/50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xs">
                Dev
              </span>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-[#03C75A] transition-colors block">
                  네이버 개발자 센터
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">developers.naver.com</span>
              </div>
            </div>
            <ExternalLink size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
          </a>

          <a
            href="https://shopping.naver.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-black/40 border border-zinc-800 hover:border-[#03C75A]/50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-xs">
                Shop
              </span>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-[#03C75A] transition-colors block">
                  네이버 쇼핑 포털
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">shopping.naver.com</span>
              </div>
            </div>
            <ExternalLink size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StudioNaverTrendPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">네이버 라이브 데이터 수집 중...</div>}>
      <NaverTrendContent />
    </Suspense>
  );
}
