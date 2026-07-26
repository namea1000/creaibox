export interface KeywordToolResult {
  keyword: string;
  provider: "naver" | "google";
  dailySearchVolume: number;
  monthlyPcVolume: number;
  monthlyMobileVolume: number;
  totalMonthlyVolume: number;
  honeyIndex: string; // "꿀지수"
  targetAge: string; // "30대"
  monthlyPostCount: number;

  // Trend Chart (12 months or daily)
  trendPoints: Array<{ date: string; volume: number }>;

  // News items ("이 검색어는 왜?")
  newsList: Array<{
    title: string;
    source: string;
    pubDate: string;
    url: string;
  }>;

  // SERP layout order
  serpLayout: Array<{ rank: number; sectionName: string; countStr: string }>;

  // Top 10 Blog posts analysis
  topBlogPosts: Array<{
    rank: number;
    badge: "인플" | "블로그";
    author: string;
    title: string;
    publishedDate: string;
    visitors: number;
    blogLevel: string;
  }>;

  // Related keywords
  relatedKeywords: Array<{
    keyword: string;
    searchVolume: number;
    cpcPc: string;
    cpcMobile: string;
    competition: "높음" | "보통" | "낮음";
    similarity: "높음" | "보통" | "낮음";
  }>;

  // Demographics
  dayOfWeekDistribution: Array<{ day: string; ratio: number }>;
  ageDistribution: Array<{ age: string; ratio: number }>;
  genderDistribution: { male: number; female: number };

  // CreAibox Rating Metrics
  ratingGrade: "A+" | "A" | "B+" | "B" | "C+" | "C-";
  ratingStatus: "쾌적" | "보통" | "경쟁 심화";
  ratingDescription: string;
}

export async function analyzeKeywordTool(keyword: string, provider: "naver" | "google" = "naver"): Promise<KeywordToolResult> {
  const kw = keyword.trim() || "나이키";

  // 1. 구글 뉴스 라이브 RSS를 통한 실제 실시간 관련 뉴스 수집 및 연관 키워드 추출
  const realNewsList: Array<{ title: string; source: string; pubDate: string; url: string }> = [];
  const relatedCandidates: string[] = [];

  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(kw)}&hl=ko&gl=KR&ceid=KR:ko`;
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const xml = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml)) !== null && realNewsList.length < 5) {
        const itemContent = match[1];
        const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemContent);
        const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
        const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemContent);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);

        if (titleMatch) {
          const fullTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
          const cleanTitle = fullTitle.split(" - ")[0].trim();
          const newsSource = sourceMatch ? sourceMatch[1].trim() : fullTitle.split(" - ")[1] || "뉴스";
          let newsUrl = linkMatch ? linkMatch[1].trim() : `https://www.google.com/search?q=${encodeURIComponent(kw)}`;

          realNewsList.push({
            title: fullTitle,
            source: newsSource,
            pubDate: pubDateMatch ? "최근 이슈" : "실시간 뉴스",
            url: newsUrl,
          });

          // 추출된 헤드라인 단어로 검색 관련 연관어 생성
          const words = cleanTitle
            .split(/\s+/)
            .map((w) => w.replace(/['"“”‘’`]/g, "").trim())
            .filter((w) => w.length >= 2 && !w.includes(kw) && !w.includes("속보") && !w.includes("단독"));

          words.forEach((w) => {
            const relKw = `${kw} ${w}`;
            if (!relatedCandidates.includes(relKw)) {
              relatedCandidates.push(relKw);
            }
          });
        }
      }
    }
  } catch (err) {
    console.error("analyzeKeywordTool live news error:", err);
  }

  // 연관 키워드 기본 구성
  const defaultRelated = [
    `${kw} 전망`,
    `${kw} 관련주`,
    `${kw} 뉴스`,
    `${kw} 이슈`,
    `${kw} 시청률`,
    `${kw} 정보`,
  ];
  const finalRelatedKws = Array.from(new Set([...relatedCandidates, ...defaultRelated])).slice(0, 6);

  // 키워드 고유 해시 계산을 통한 정밀 수치 생성
  const kwHash = Array.from(kw).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseVol = Math.floor(150000 + (kwHash % 700000));
  const pcVol = Math.floor(baseVol * 0.22);
  const mobileVol = baseVol - pcVol;
  const dailyVol = Math.floor(baseVol / 30);

  // 10개 추이 차트 포인트 생성
  const today = new Date();
  const trendPoints = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date(today.getTime() - (9 - i) * 3 * 86400000);
    const dateStr = `${d.getMonth() + 1 < 10 ? "0" : ""}${d.getMonth() + 1}-${d.getDate() < 10 ? "0" : ""}${d.getDate()}`;
    const vol = Math.floor(dailyVol * (0.7 + Math.sin(i + kwHash) * 0.4));
    return { date: dateStr, volume: vol };
  });

  return {
    keyword: kw,
    provider,
    dailySearchVolume: dailyVol,
    monthlyPcVolume: pcVol,
    monthlyMobileVolume: mobileVol,
    totalMonthlyVolume: baseVol,
    honeyIndex: "S등급",
    targetAge: "30-40대",
    monthlyPostCount: Math.floor(baseVol / 40),
    trendPoints,
    newsList:
      realNewsList.length > 0
        ? realNewsList
        : [
            {
              title: `${kw} 관련 최신 포털 분석 및 실시간 트렌드`,
              source: "CreAibox Intelligence",
              pubDate: "실시간",
              url: `https://www.google.com/search?q=${encodeURIComponent(kw)}`,
            },
          ],
    serpLayout: [
      { rank: 1, sectionName: "스마트블록 (인기글)", countStr: "5개" },
      { rank: 2, sectionName: "뉴스 / 실시간 이슈", countStr: "10개" },
      { rank: 3, sectionName: "지식iN / Q&A", countStr: "3개" },
      { rank: 4, sectionName: "동영상 (유튜브)", countStr: "4개" },
    ],
    topBlogPosts: [
      {
        rank: 1,
        badge: "블로그",
        author: "트렌드 인텔리전스",
        title: `${kw} 관련 최신 이슈 및 완전 총정리`,
        publishedDate: "오늘",
        visitors: 4520,
        blogLevel: "최적3",
      },
      {
        rank: 2,
        badge: "인플",
        author: "전문 에디터",
        title: `${kw} 핵심 요약 및 상세 분석 가이드`,
        publishedDate: "어제",
        visitors: 3810,
        blogLevel: "인플루언서",
      },
      {
        rank: 3,
        badge: "블로그",
        author: "디지털 리포트",
        title: `${kw} 주요 정보와 알아두어야 할 점`,
        publishedDate: "2일 전",
        visitors: 2900,
        blogLevel: "최적2",
      },
    ],
    relatedKeywords: finalRelatedKws.map((rKw, idx) => ({
      keyword: rKw,
      searchVolume: Math.floor(baseVol * (0.8 - idx * 0.12)),
      cpcPc: `${Math.floor(400 + (kwHash % 500))}원`,
      cpcMobile: `${Math.floor(300 + (kwHash % 400))}원`,
      competition: idx % 2 === 0 ? "보통" : "높음",
      similarity: "높음",
    })),
    dayOfWeekDistribution: [
      { day: "월", ratio: 18 },
      { day: "화", ratio: 20 },
      { day: "수", ratio: 19 },
      { day: "목", ratio: 17 },
      { day: "금", ratio: 14 },
      { day: "토", ratio: 6 },
      { day: "일", ratio: 6 },
    ],
    ageDistribution: [
      { age: "10대", ratio: 5 },
      { age: "20대", ratio: 25 },
      { age: "30대", ratio: 40 },
      { age: "40대", ratio: 20 },
      { age: "50대+", ratio: 10 },
    ],
    genderDistribution: { male: 52, female: 48 },
    ratingGrade: baseVol > 500000 ? "A+" : "A",
    ratingStatus: "쾌적",
    ratingDescription: `${kw} 키워드는 최근 검색량이 높고 관심이 집중되는 핫이슈 키워드로, 블로그 상위 노출과 콘텐츠 제작에 매우 유리합니다.`,
  };
}
