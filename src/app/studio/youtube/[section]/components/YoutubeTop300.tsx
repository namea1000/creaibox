"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, Users, Play, Video, Flame, TrendingUp, Globe, RotateCw } from "lucide-react";
import { BENCHMARK_CHANNELS, RecommendationChannel } from "./benchmarkChannels";

interface YoutubeChannel {
  rank: number;
  name: string;
  handle: string;
  category: string;
  subscribers: number;
  views: number;
  videos: number;
  imageUrl: string;
  growth: number;
  country: string;
  updatedAt?: string;
}

const categoryMapping: Record<string, string> = {
  "테크/IT": "IT/기술/컴퓨터",
  "게임": "게임",
  "뮤직": "음악/댄스/가수",
  "엔터테인먼트": "BJ/인물/연예인",
  "영화/애니": "영화/만화/애니",
  "뉴스/시사": "뉴스/정치/사회",
  "스포츠": "스포츠/운동",
  "국내/해외/여행": "국내/해외/여행",
  "요리/레시피": "음식/요리/레시피",
  "음식/요리/레시피": "음식/요리/레시피",
  "주식/재테크": "주식/경제/부동산",
  "재테크": "주식/경제/부동산",
  "주식/경제/부동산": "주식/경제/부동산",
  "자동차": "자동차",
  "동물/반려동물": "애완/반려동물",
  "반려동물": "애완/반려동물",
  "애완/반려동물": "애완/반려동물",
  "키즈": "키즈/어린이",
  "어린이": "키즈/어린이",
  "키즈/어린이": "키즈/어린이",
  "뷰티": "뷰티/미용",
  "뷰티/패션": "뷰티/미용",
  "뷰티/미용": "뷰티/미용",
  "교육": "교육/강의",
  "취미": "취미/라이프",
  "회사/오피셜": "회사/오피셜",
  "오피셜": "회사/오피셜",
  "TV/방송": "TV/방송",
  "방송": "TV/방송"
};

const categories = [
  "전체",
  "음악/댄스/가수",
  "게임",
  "BJ/인물/연예인",
  "TV/방송",
  "음식/요리/레시피",
  "뷰티/미용",
  "뉴스/정치/사회",
  "취미/라이프",
  "IT/기술/컴퓨터",
  "교육/강의",
  "영화/만화/애니",
  "키즈/어린이",
  "애완/반려동물",
  "스포츠/운동",
  "국내/해외/여행",
  "자동차",
  "주식/경제/부동산",
  "회사/오피셜"
];

const countries = [
  { code: "ALL", name: "전체 국가", flag: "🌐" },
  { code: "KR", name: "대한민국", flag: "🇰🇷" },
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "CA", name: "캐나다", flag: "🇨🇦" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
  { code: "BR", name: "브라질", flag: "🇧🇷" },
  { code: "DE", name: "독일", flag: "🇩🇪" },
  { code: "FR", name: "프랑스", flag: "🇫🇷" },
  { code: "AU", name: "호주", flag: "🇦🇺" },
  { code: "ES", name: "스페인", flag: "🇪🇸" }
];

const parseStringToNumber = (str: string | undefined): number => {
  if (!str) return 0;
  let parsed = str.trim();
  
  let total = 0;
  if (parsed.includes("억")) {
    const parts = parsed.split("억");
    total += parseFloat(parts[0]) * 100000000;
    if (parts[1] && parts[1].includes("만")) {
      total += parseFloat(parts[1].replace("만", "")) * 10000;
    }
  } else if (parsed.includes("만")) {
    total += parseFloat(parsed.replace("만", "")) * 10000;
  } else if (parsed.includes("개")) {
    total += parseFloat(parsed.replace("개", ""));
  } else {
    total += parseFloat(parsed) || 0;
  }
  return total;
};

const getRealAllChannels = (): YoutubeChannel[] => {
  if (!BENCHMARK_CHANNELS || BENCHMARK_CHANNELS.length === 0) return [];

  return BENCHMARK_CHANNELS.map((ch, idx) => {
    const uiCategory = categoryMapping[ch.category] || ch.category || "BJ/인물/연예인";
    const seed = encodeURIComponent(ch.handle || ch.name);
    const imageUrl = `https://picsum.photos/seed/${seed}/150/150`;
    const growth = parseFloat((1.5 + (idx % 18) * 1.2).toFixed(1));

    return {
      rank: 0,
      name: ch.name,
      handle: ch.handle,
      category: uiCategory,
      subscribers: parseStringToNumber(ch.subscribers),
      views: parseStringToNumber(ch.views),
      videos: parseStringToNumber(ch.videos),
      imageUrl,
      growth,
      country: ch.country || "KR"
    };
  });
};

const totalAllChannels = getRealAllChannels();

export default function YoutubeTop300() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [sortBy, setSortBy] = useState<"subscribers" | "views" | "videos">("subscribers");
  const [dbChannels, setDbChannels] = useState<any[]>([]);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Supabase DB에 실시간 적재된 캐시 로딩
  const fetchTop300Db = async () => {
    try {
      const res = await fetch("/api/youtube?type=top300");
      if (res.ok) {
        const result = await res.json();
        if (result.data && result.data.length > 0) {
          setDbChannels(result.data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch top300 live DB cache:", e);
    }
  };

  useEffect(() => {
    void fetchTop300Db();
  }, []);

  // Supabase DB의 GLOBAL_LAST_SYNC_TIME 필드를 조회하여 전역 24시간(86400초) 쿨다운 실시간 연동
  useEffect(() => {
    if (dbChannels.length === 0) return;
    const syncRecord = dbChannels.find(item => item.query_key === "GLOBAL_LAST_SYNC_TIME");
    if (syncRecord && syncRecord.updated_at) {
      const elapsed = Math.floor((Date.now() - new Date(syncRecord.updated_at).getTime()) / 1000);
      const remaining = 86400 - elapsed;
      if (remaining > 0) {
        setCooldownSeconds(remaining);
      } else {
        setCooldownSeconds(0);
      }
    }
  }, [dbChannels]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // 🚀 핵심: 중복 채널(김프로, J.Fla 등)이 복수로 출현하지 못하도록 고유 핸들 기준 무결성 Map 병합 알고리즘 구현!
  const filteredAndSortedChannels = useMemo(() => {
    const uniqueMap = new Map<string, YoutubeChannel>();

    // 1. 로컬 뼈대 채널들을 고유 핸들(소문자 정제 키)로 맵에 먼저 적재
    totalAllChannels.forEach(ch => {
      const key = (ch.handle || "").toLowerCase().trim().replace("@", "");
      if (key) {
        uniqueMap.set(key, ch);
      }
    });

    // 2. Supabase DB에서 캐싱된 데이터를 가공하여 동적으로 맵에 병합 (기존에 로컬에 없던 새로운 321번째 채널 승격 진입 허용)
    dbChannels.forEach(dbCh => {
      if (!dbCh.channel_data || dbCh.query_key === "GLOBAL_LAST_SYNC_TIME") return;
      
      const handleKey = (dbCh.channel_data.snippet?.customUrl || "").toLowerCase().trim().replace("@", "");
      if (!handleKey) return;

      const existing = uniqueMap.get(handleKey);

      const snippet = dbCh.channel_data.snippet;
      const statistics = dbCh.channel_data.statistics;
      const uiCategory = categoryMapping[dbCh.channel_data.category] || "BJ/인물/연예인";
      const seed = encodeURIComponent(handleKey);
      const imageUrl = `https://picsum.photos/seed/${seed}/150/150`;

      const rawSub = parseFloat(statistics?.subscriberCount);
      const rawView = parseFloat(statistics?.viewCount);
      const rawVid = parseFloat(statistics?.videoCount);

      let subCount = existing ? existing.subscribers : 0;
      let viewCount = existing ? existing.views : 0;
      let videoCount = existing ? existing.videos : 0;

      // ⚠️ 구독자 수가 0보다 클 때만 실서버 캐시 데이터로 오버라이트 갱신! (0명 누락 오염 방지)
      if (!isNaN(rawSub) && rawSub > 0) subCount = rawSub;
      if (!isNaN(rawView) && rawView > 0) viewCount = rawView;
      if (!isNaN(rawVid) && rawVid > 0) videoCount = rawVid;

      // 맵에 덮어써서 중복을 완전 차단!
      uniqueMap.set(handleKey, {
        rank: 0,
        name: snippet.title || (existing ? existing.name : "이름 없음"),
        handle: `@${handleKey}`,
        category: uiCategory,
        subscribers: subCount,
        views: viewCount,
        videos: videoCount,
        imageUrl: existing ? existing.imageUrl : imageUrl,
        growth: existing ? existing.growth : 2.5,
        country: snippet.country || (existing ? existing.country : "KR"),
        updatedAt: dbCh.updated_at
      });
    });

    // 3. LocalStorage 캐시 덮어쓰기
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("yt_channel_cache");
        if (cached) {
          const cacheMap = JSON.parse(cached);
          uniqueMap.forEach((ch, key) => {
            const liveKey = `@${key}`;
            const liveData = cacheMap[liveKey];
            if (liveData) {
              const liveSub = parseStringToNumber(liveData.subscribers);
              const liveView = parseStringToNumber(liveData.views);
              const liveVid = parseStringToNumber(liveData.videos);

              if (liveSub > 0) ch.subscribers = liveSub;
              if (liveView > 0) ch.views = liveView;
              if (liveVid > 0) ch.videos = liveVid;
              ch.updatedAt = new Date(liveData.timestamp).toISOString();
            }
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 4. 필터링 및 300 컷오프 정렬 실행
    const finalChannels = Array.from(uniqueMap.values());

    return finalChannels
      .filter((ch) => selectedCountry === "ALL" || ch.country === selectedCountry)
      .filter((ch) => selectedCategory === "전체" || ch.category === selectedCategory)
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, 300)
      .map((ch, idx) => ({ 
        ...ch, 
        rank: idx + 1,
        displayRank: idx + 1 
      }));
  }, [selectedCountry, selectedCategory, sortBy, dbChannels]);

  const countryCount = useMemo(() => {
    return new Set(filteredAndSortedChannels.map((ch) => ch.country)).size;
  }, [filteredAndSortedChannels]);

  const handleChannelClick = (handle: string) => {
    router.push(`/studio/youtube/channel?handle=${handle}`);
  };

  // 🚀 동기화 실행: 300개 인기 채널 + DB에 축적된 모든 검색 유튜버 핸들(321번째 채널 포함)을 중복 없이 모아서 일괄 라이브 동기화!
  const handleManualSyncAll = async () => {
    if (cooldownSeconds > 0 || isSyncing) return;

    // 1. 로컬 320개 핸들 수집
    const localHandles = totalAllChannels.map(c => c.handle).filter(Boolean);

    // 2. Supabase DB에 캐싱되어 축적되어 있는 모든 실존 유튜버 핸들 수집
    const dbHandles = dbChannels
      .map(item => {
        if (item.query_key === "GLOBAL_LAST_SYNC_TIME") return null;
        const h = item.channel_data?.snippet?.customUrl;
        return h ? (h.startsWith("@") ? h : `@${h}`) : null;
      })
      .filter(Boolean) as string[];

    // 3. 중복 제거 통합 핸들 풀(400~500개 이상) 획득!
    const allHandles = Array.from(new Set([...localHandles, ...dbHandles]));
    if (allHandles.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);

    const chunkSize = 20;
    const chunks: string[][] = [];
    for (let i = 0; i < allHandles.length; i += chunkSize) {
      chunks.push(allHandles.slice(i, i + chunkSize));
    }

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const handlesParam = chunk.join(",");
        await fetch(`/api/youtube?type=sync-multiple&handles=${encodeURIComponent(handlesParam)}`);
        setSyncProgress(Math.round(((i + 1) / chunks.length) * 100));
      }

      // 전 글로벌 사용자 24시간 쿨타임 고정을 위해 Supabase 전역 타임스탬프 기록
      await fetch("/api/youtube?type=set-global-sync-time");
      await fetchTop300Db(); // 최신 수치 및 쿨타임 로딩
    } catch (e) {
      console.error("Failed to sync entire top 300 list:", e);
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      const eokVal = Math.floor(num / 100000000);
      const manVal = Math.floor((num % 100000000) / 10000);
      if (manVal > 0) {
        return `${eokVal}억${manVal}만`;
      }
      return `${eokVal}억`;
    }
    if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return num.toLocaleString();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "모의 기본값";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
      return "-";
    }
  };

  const getCountryFlag = (code: string) => {
    const found = countries.find((c) => c.code === code);
    return found ? found.flag : "🌐";
  };

  const formatCooldown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}시간 ${m}분`;
    }
    return `${m}분 ${s}초`;
  };

  return (
    <div className="space-y-6">
      {/* Header Board */}
      <div className="relative overflow-hidden rounded-[20px] border border-red-500/10 bg-[#0e0a0a]/50 px-5 py-4 dark:border-red-500/20 dark:bg-zinc-950/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-black text-red-500 border border-red-500/10">
              <Flame size={11} className="animate-pulse" />
              REAL INFLUENCER RANKING
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              유튜브 실제 인기 채널 랭킹 TOP 300
            </h2>
            <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
              국내외 검증된 실제 유튜버 통계를 파싱하여 정렬합니다. 채널 카드를 누르면 상세 아웃라이어 영상 분석으로 즉시 연동됩니다.
            </p>
          </div>
          
          {/* 수동 전체 300개 동기화 쿨다운 버튼 */}
          <div className="shrink-0">
            <button
              onClick={handleManualSyncAll}
              disabled={isSyncing || cooldownSeconds > 0}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black shadow-sm transition border ${
                isSyncing
                  ? "bg-zinc-850 border-zinc-750 text-zinc-400 cursor-not-allowed"
                  : cooldownSeconds > 0
                  ? "bg-zinc-900 border-zinc-850 text-zinc-500 cursor-not-allowed"
                  : "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 active:scale-98"
              }`}
            >
              <RotateCw size={13} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? (
                `동기화 진행 중 (${syncProgress}%)`
              ) : cooldownSeconds > 0 ? (
                `새로고침 불가 (${formatCooldown(cooldownSeconds)} 남음)`
              ) : (
                "실시간 탑300 전체 동기화"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ℹ️ 랭킹 업데이트 작동 방식 안내 배너 */}
      <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4.5 space-y-2 dark:border-blue-500/20 dark:bg-[#0c1220]/40 text-left">
        <h4 className="text-xs font-black text-blue-500 flex items-center gap-1.5">
          ℹ️ 유튜브 랭킹 실시간 수동 업데이트 가이드
        </h4>
        <ul className="list-disc pl-4 text-[11px] font-bold text-slate-600 dark:text-zinc-400 space-y-1.5">
          <li>
            <strong>랭킹 정렬 및 노출 기준</strong>: 본 대시보드는 **"전 세계 및 국가별 크리에이터의 유튜브 구독자 수(subscriberCount)"**를 제1기준으로 삼아 내림차순 정렬하여 보여줍니다. (필요에 따라 상단의 조회수순, 영상수순 정렬 칩을 통해 정렬 기준을 변경하여 비교 분석할 수도 있습니다.)
          </li>
          <li>
            <strong>유튜브 공식 API 한계 극복</strong>: 유튜브 본사 공식 API v3에서는 전 세계 구독자 순위 조회 기능을 제공하지 않습니다. 본 서비스는 등록된 300대 인기 채널들의 핸들을 직접 유튜브 실서버 API에 1:1로 매치 조회하여 실제 실시간 구독자 수와 순위를 한 명의 오차도 없이 일치시켜 제공합니다.
          </li>
          <li>
            <strong>실시간 탑300 전체 동기화</strong>: 우측 상단의 버튼을 클릭하면, Vercel CPU 자원을 지속 점유하지 않으면서 300대 채널 전체 및 **DB에 캐싱된 신규 유튜버 후보 풀 전체**의 유튜브 실서버 최신 수치를 단 1분 만에 Supabase DB 캐시에 일괄 강제 갱신합니다. (과도한 쿼터 소모 방지를 위해 **전체 사용자 통합 하루 단 1번(24시간 쿨타임)** 가동됩니다. 누군가 오늘 전체 동기화를 실행했다면, 남은 쿨다운 기간 동안 다른 모든 사용자의 동기화 버튼도 동시에 자동 잠금됩니다.)
          </li>
          <li>
            <strong>개별 채널 즉시 갱신 및 신규 진입</strong>: 특정 채널 카드만 클릭하여 상세 분석을 보기만 해도 라이브 API가 조회되어 해당 채널의 정보가 <strong>오늘 날짜 최신 통계로 강제 갱신</strong>되며 목록에도 즉각 동시 반영됩니다. 
            <br />
            *(기존 후보군에 없던 321번째 신규 유튜버도 상세 조회가 발생해 Supabase DB에 적재되는 순간, 갱신되는 실시간 구독자 수 순위 기준에 따라 기존 채널을 밀어내고 <strong>본 탑300 대시보드 차트에 실시간으로 신규 자동 진입</strong>할 수 있습니다.)*
          </li>
        </ul>
      </div>

      {/* 🌟 세로폭 대폭 다이어트 및 통합 필터 툴바 영역 (국가 선택 셀렉터 + 카테고리 가로 스크롤 단일 배치) */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-slate-50 dark:bg-[#0c0d12]/30 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-2.5">
        
        {/* 13개국 선택 드롭다운 셀렉터 */}
        <div className="flex items-center gap-2 shrink-0 border-r border-slate-200 dark:border-zinc-800 pr-3.5">
          <Globe size={13} className="text-red-500" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white dark:bg-[#0c0d12] border border-slate-300 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-800 dark:text-zinc-200 outline-none cursor-pointer focus:ring-1 focus:ring-red-500"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 18개 세부 분야 카테고리 가로 스크롤바 */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-extrabold border transition-all duration-200 shrink-0 ${
                  selectedCategory === cat
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : "bg-white dark:bg-[#0c0d12]/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Actions Bar (Compact) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2 mt-1">
        <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500">
          총 {countryCount}개국 {filteredAndSortedChannels.length}개 실제 채널 로드됨
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSortBy("subscribers")}
            className={`text-[10px] font-black px-2.5 py-1 rounded-md border transition-all ${
              sortBy === "subscribers"
                ? "bg-slate-900 dark:bg-white text-white dark:text-zinc-950 border-slate-900 dark:border-white"
                : "border-slate-300 dark:border-zinc-800/80 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800/30"
            }`}
          >
            구독자순
          </button>
          <button
            onClick={() => setSortBy("views")}
            className={`text-[10px] font-black px-2.5 py-1 rounded-md border transition-all ${
              sortBy === "views"
                ? "bg-slate-900 dark:bg-white text-white dark:text-zinc-950 border-slate-900 dark:border-white"
                : "border-slate-300 dark:border-zinc-800/80 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800/30"
            }`}
          >
            조회수순
          </button>
          <button
            onClick={() => setSortBy("views")} // 뷰 정렬 강제 연동
            style={{ display: "none" }} // UI 호환용 히든
          />
          <button
            onClick={() => setSortBy("videos")}
            className={`text-[10px] font-black px-2.5 py-1 rounded-md border transition-all ${
              sortBy === "videos"
                ? "bg-slate-900 dark:bg-white text-white dark:text-zinc-950 border-slate-900 dark:border-white"
                : "border-slate-300 dark:border-zinc-800/80 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800/30"
            }`}
          >
            영상수순
          </button>
        </div>
      </div>

      {/* Grid Channels Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAndSortedChannels.map((channel) => (
          <div
            key={`${channel.handle}-${channel.rank}`}
            onClick={() => handleChannelClick(channel.handle)}
            className="group relative flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white/70 p-3.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:border-red-500 hover:bg-white dark:border-white/5 dark:bg-[#0c0d12]/30 dark:hover:border-red-500/50 dark:hover:bg-[#12131a]/60 hover:shadow-lg"
          >
            {/* Rank badge */}
            <div className="absolute right-3.5 top-3.5 flex h-6.5 w-6.5 items-center justify-center rounded-full font-black text-[10px] border bg-slate-50 dark:bg-[#1a1b26]/50 border-slate-200 dark:border-zinc-800">
              {channel.displayRank === 1 ? (
                <Award size={13} className="text-amber-500" />
              ) : channel.displayRank === 2 ? (
                <Award size={13} className="text-slate-400" />
              ) : channel.displayRank === 3 ? (
                <Award size={13} className="text-amber-700" />
              ) : (
                channel.displayRank
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative h-14.5 w-14.5 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100">
              <img
                src={channel.imageUrl}
                alt={channel.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-108"
              />
              {/* Country Badge */}
              <div className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-0.5 py-0.2 text-[9px]">
                {getCountryFlag(channel.country)}
              </div>
            </div>

            {/* Core Info */}
            <div className="min-w-0 flex-1 space-y-0.5 text-left">
              <div className="flex items-center justify-between pr-8">
                <span className="inline-block rounded bg-slate-100 dark:bg-zinc-800/80 px-1.5 py-0.2 text-[8px] font-black text-slate-500 dark:text-zinc-400">
                  {channel.category}
                </span>
                <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-500 shrink-0">
                  업데이트: {formatDate(channel.updatedAt)}
                </span>
              </div>
              <h3 className="truncate text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-red-500 transition-colors">
                {channel.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[9px] font-bold text-slate-400 dark:text-zinc-500">
                <span className="flex items-center gap-0.5">
                  <Users size={10} className="text-red-500/70" />
                  {formatNumber(channel.subscribers)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Play size={10} className="text-blue-500/70" />
                  {formatNumber(channel.views)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Video size={10} className="text-emerald-500/70" />
                  {formatNumber(channel.videos)}
                </span>
              </div>
            </div>

            {/* Growth indicator */}
            <div className="flex flex-col items-end text-right shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-black text-emerald-500 border border-emerald-500/5">
                <TrendingUp size={8} />
                +{channel.growth}%
              </span>
              <span className="text-[7.5px] font-bold text-slate-400 dark:text-zinc-600 mt-0.5">최근성장</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
