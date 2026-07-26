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

export function analyzeKeywordTool(keyword: string, provider: "naver" | "google" = "naver"): KeywordToolResult {
  const kw = keyword.trim() || "나이키";
  const seed = kw.length * 12345;
  const baseVol = Math.floor(800000 + (seed % 500000));
  const pcVol = Math.floor(baseVol * 0.22);
  const mobileVol = baseVol - pcVol;
  const dailyVol = Math.floor(baseVol / 25);

  const months = ["05-25", "05-28", "05-31", "06-03", "06-06", "06-09", "06-12", "06-15", "06-18", "06-21", "06-24"];
  const trendPoints = months.map((date, idx) => ({
    date,
    volume: Math.floor(15000 + Math.sin(idx + seed) * 8000 + (idx === 0 ? 30000 : 5000)),
  }));

  return {
    keyword: kw,
    provider,
    dailySearchVolume: dailyVol,
    monthlyPcVolume: pcVol,
    monthlyMobileVolume: mobileVol,
    totalMonthlyVolume: baseVol,
    honeyIndex: "멤버십",
    targetAge: "30대",
    monthlyPostCount: 18131,
    trendPoints,
    newsList: [
      {
        title: `신세계백화점, 여름 정기 세일 '${kw}' 용품 50% 할인...`,
        source: "미코노리뷰",
        pubDate: "1년 전",
        url: `https://search.naver.com/search.naver?query=${encodeURIComponent(kw)}`,
      },
      {
        title: `스마일프로가 적합한 사람의 3가지 공통점? '${kw}' 피트니스`,
        source: "헬스조선",
        pubDate: "1년 전",
        url: `https://search.naver.com/search.naver?query=${encodeURIComponent(kw)}`,
      },
      {
        title: `시원한 혜택 총집합... 롯데백화점, 정기세일 진행`,
        source: "서울와이어",
        pubDate: "1년 전",
        url: `https://search.naver.com/search.naver?query=${encodeURIComponent(kw)}`,
      },
    ],
    serpLayout: [
      { rank: 1, sectionName: "브랜드 광고", countStr: "1개" },
      { rank: 2, sectionName: "파워링크", countStr: "10개의 콘텐츠" },
      { rank: 3, sectionName: "플레이스", countStr: "4개 지도" },
      { rank: 4, sectionName: "웹문서", countStr: "2개의 콘텐츠" },
      { rank: 5, sectionName: "블로그/VIEW 탭", countStr: "상위 노출 10개" },
    ],
    topBlogPosts: [
      { rank: 1, badge: "인플", author: "호떡", title: `${kw}가 한국 한정판으로 출시한 레전드 신상 언박싱`, publishedDate: "9일 전", visitors: 5811, blogLevel: "최적 3+" },
      { rank: 2, badge: "인플", author: "초로", title: `${kw} 에어포스1 로우 컬러웨이 착샷 및 사이즈 팁`, publishedDate: "2일 전", visitors: 2022, blogLevel: "최적 2" },
      { rank: 3, badge: "인플", author: "마성훈", title: `${kw} 운동화 추천 킬샷2 코디법 총정리`, publishedDate: "16일 전", visitors: 5208, blogLevel: "준최 4" },
      { rank: 4, badge: "블로그", author: "뚱뚱한 바나나", title: `${kw} 에어리프트 여성 여름 운동화 솔직후기`, publishedDate: "2일 전", visitors: 1072, blogLevel: "준최 7" },
      { rank: 5, badge: "인플", author: "빠티", title: `${kw} 에어맥스 시로 슬리퍼 실물 리뷰`, publishedDate: "32일 전", visitors: 6538, blogLevel: "최적 1+" },
    ],
    relatedKeywords: [
      { keyword: `${kw} 운동화`, searchVolume: 211600, cpcPc: "870원", cpcMobile: "540원", competition: "보통", similarity: "높음" },
      { keyword: `${kw} 런닝화`, searchVolume: 87100, cpcPc: "920원", cpcMobile: "610원", competition: "보통", similarity: "높음" },
      { keyword: `${kw} 슬리퍼`, searchVolume: 86470, cpcPc: "650원", cpcMobile: "420원", competition: "높음", similarity: "높음" },
      { keyword: `${kw} 샌들`, searchVolume: 66300, cpcPc: "780원", cpcMobile: "510원", competition: "높음", similarity: "보통" },
      { keyword: `${kw} 에어포스`, searchVolume: 59040, cpcPc: "1120원", cpcMobile: "890원", competition: "보통", similarity: "높음" },
      { keyword: `${kw} 반바지`, searchVolume: 58790, cpcPc: "450원", cpcMobile: "310원", competition: "보통", similarity: "보통" },
    ],
    dayOfWeekDistribution: [
      { day: "일", ratio: 12 },
      { day: "월", ratio: 15 },
      { day: "화", ratio: 16 },
      { day: "수", ratio: 18 },
      { day: "목", ratio: 22 },
      { day: "금", ratio: 10 },
      { day: "토", ratio: 7 },
    ],
    ageDistribution: [
      { age: "10대", ratio: 8 },
      { age: "20대", ratio: 28 },
      { age: "30대", ratio: 42 },
      { age: "40대", ratio: 16 },
      { age: "50대", ratio: 6 },
    ],
    genderDistribution: { male: 44, female: 56 },
    ratingGrade: "C-",
    ratingStatus: "경쟁 심화",
    ratingDescription: `'${kw}' 키워드는 검색 노출 상위 경쟁 강도가 높은 대표 키워드입니다. 서브 롱테일 키워드를 적극 활용하여 블로그 포스팅을 작성하시는 것을 추천합니다.`,
  };
}
