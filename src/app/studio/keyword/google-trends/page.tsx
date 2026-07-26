"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  TrendingUp,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Copy,
  CheckCircle2,
  Zap,
  Newspaper,
  Flame,
  Search,
} from "lucide-react";

interface GoogleTrendItem {
  title: string;
  traffic: string;
  pubDate: string;
  newsTitle: string;
  newsUrl: string;
  newsSource: string;
}

export default function GoogleTrendsPage() {
  const [geo, setGeo] = useState("KR");
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<GoogleTrendItem[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchGoogleTrends = async (countryGeo: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/google/trends?geo=${countryGeo}`);
      const data = await res.json();
      if (data.items) {
        setTrends(data.items);
      }
    } catch (err) {
      console.error("Google Trends fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoogleTrends(geo);
  }, [geo]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 엠블럼 헤더 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-zinc-900/40 border border-blue-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Google Trends 공식 RSS 연동됨
            </span>
            <span className="text-xs text-zinc-400 font-mono">Live Google Search Trends</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Globe className="text-blue-400" size={32} />
            구글 트렌드 (Google Trends) 실시간 분석
          </h1>

          <p className="text-zinc-400 text-sm max-w-2xl font-medium leading-relaxed">
            구글 포털 실시간 급상승 키워드를 실시간 추적하여 100,000+ 급상승 검색어와 연관 이슈 뉴스를 시각화 분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* 국가 선택 파서 */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-zinc-800">
            {[
              { label: "🇰🇷 대한민국", geo: "KR" },
              { label: "🇺🇸 미국", geo: "US" },
              { label: "🇯🇵 일본", geo: "JP" },
              { label: "🇬🇧 영국", geo: "GB" },
            ].map((country) => (
              <button
                key={country.geo}
                onClick={() => setGeo(country.geo)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  geo === country.geo
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                }`}
              >
                {country.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchGoogleTrends(geo)}
            disabled={loading}
            className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl transition-all disabled:opacity-50"
            title="새로고침"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
          </button>
        </div>
      </div>

      {/* 실시간 핫 키워드 카드 리스트 */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Flame size={20} className="text-orange-500 animate-bounce" />
              구글 실시간 급상승 키워드 TOP 20 ({geo === "KR" ? "대한민국" : geo})
            </h3>
            <p className="text-xs text-zinc-400">구글 검색량(Search Traffic) 및 관련 실시간 주요 뉴스 이슈</p>
          </div>

          <span className="text-xs text-blue-400 font-mono font-bold flex items-center gap-1">
            <Zap size={14} /> 5분 단위 캐시 동기화
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-zinc-400 text-sm font-bold flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-blue-400" size={22} />
            구글 트렌드 서버에서 실시간 핫 키워드를 수집하는 중입니다...
          </div>
        ) : trends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.map((item, idx) => (
              <div
                key={idx}
                className="bg-black/50 border border-zinc-800/60 hover:border-blue-500/50 p-5 rounded-2xl space-y-3 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <span className="text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full font-mono">
                      🔥 {item.traffic}
                    </span>
                  </div>

                  {item.newsTitle && (
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl space-y-1.5 text-xs">
                      <span className="text-zinc-500 font-bold flex items-center gap-1 text-[11px]">
                        <Newspaper size={12} className="text-blue-400" />
                        관련 뉴스 ({item.newsSource || "Google News"})
                      </span>
                      <a
                        href={item.newsUrl || `https://www.google.com/search?q=${encodeURIComponent(item.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-zinc-300 hover:text-blue-400 transition-colors line-clamp-1 flex items-center gap-1"
                      >
                        {item.newsTitle}
                        <ExternalLink size={10} className="shrink-0 text-zinc-500" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono truncate">{item.pubDate}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item.title)}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all flex items-center gap-1"
                      title="키워드 복사"
                    >
                      {copiedText === item.title ? (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-400" /> 복사됨
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> 키워드 복사
                        </>
                      )}
                    </button>

                    <Link
                      href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(item.title)}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-md shadow-blue-500/20 flex items-center gap-1"
                    >
                      <Sparkles size={12} /> AI 글쓰기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-500 text-xs">
            수집된 구글 트렌드가 없습니다. [새로고침] 버튼을 눌러보세요.
          </div>
        )}
      </div>

      {/* 🔗 구글 트렌드 공식 링크 */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="text-blue-400" size={24} />
          <div>
            <h4 className="text-sm font-bold text-white">Google Trends 공식 데이터 센터 바로가기</h4>
            <p className="text-xs text-zinc-400">구글 트렌드 포털에서 더 자세한 국가별 실시간 검색 지수를 확인하세요.</p>
          </div>
        </div>

        <a
          href="https://trends.google.com/trends/trendingsearches/daily?geo=KR"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all"
        >
          trends.google.com 방문 <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
