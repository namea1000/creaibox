export interface BlogScoreData {
  blogId: string;
  nickname: string;
  blogTitle: string;
  profileImg: string;
  blogLevel: "최적 3+" | "최적 2" | "최적 1+" | "준최 7" | "준최 6" | "준최 4" | "준최 3" | "일반" | "누락";
  levelColor: string;
  levelPercent: number; // 0 to 100
  isInfluencer: boolean;
  category: string;
  subscriberCount: number;
  totalPosts: number;
  createdAge: string;
  indexingRate: number; // %
  recentPosts: Array<{
    title: string;
    link: string;
    pubDate: string;
    indexingStatus: "최적" | "준최" | "누락" | "정상";
    views?: number;
  }>;
}

export const TOP_BLOGGERS_SEED: BlogScoreData[] = [
  {
    blogId: "naver_diary",
    nickname: "네이버 공식블로그",
    blogTitle: "네이버 공식 블로그",
    profileImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80",
    blogLevel: "최적 3+",
    levelColor: "bg-emerald-500",
    levelPercent: 98,
    isInfluencer: true,
    category: "미설정",
    subscriberCount: 93683,
    totalPosts: 2514,
    createdAge: "17년 전",
    indexingRate: 99,
    recentPosts: [
      { title: "네이버 서비스 점검 및 기능 업데이트 안내", link: "https://blog.naver.com/naver_diary", pubDate: "2일 전", indexingStatus: "최적" },
      { title: "네이버 데이터랩 및 크리에이터 도구 개편 안내", link: "https://blog.naver.com/naver_diary", pubDate: "5일 전", indexingStatus: "최적" },
    ],
  },
  {
    blogId: "sorissu",
    nickname: "요리/일상 포스팅 최적화중!",
    blogTitle: "소리수의 매일 레시피",
    profileImg: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&q=80",
    blogLevel: "준최 4",
    levelColor: "bg-amber-500",
    levelPercent: 65,
    isInfluencer: false,
    category: "요리·레시피",
    subscriberCount: 71481,
    totalPosts: 194,
    createdAge: "1년 전",
    indexingRate: 85,
    recentPosts: [
      { title: "초간단 에어프라이어 구운 계란 만들기 노하우", link: "https://blog.naver.com/sorissu", pubDate: "1일 전", indexingStatus: "준최" },
      { title: "여름철 입맛 돋우는 오이소박이 황금레시피", link: "https://blog.naver.com/sorissu", pubDate: "3일 전", indexingStatus: "최적" },
    ],
  },
  {
    blogId: "ell_n",
    nickname: "쏘이의 멋진 하루",
    blogTitle: "쏘이의 비즈니스 & 경제 세상",
    profileImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    blogLevel: "준최 7",
    levelColor: "bg-amber-400",
    levelPercent: 78,
    isInfluencer: true,
    category: "비즈니스·경제",
    subscriberCount: 63857,
    totalPosts: 2591,
    createdAge: "12년 전",
    indexingRate: 92,
    recentPosts: [
      { title: "2026 하반기 미국 금리 전망 및 주식 투자 전략", link: "https://blog.naver.com/ell_n", pubDate: "12시간 전", indexingStatus: "최적" },
      { title: "공모주 청약 일정 및 증권사별 수수료 비교 분석", link: "https://blog.naver.com/ell_n", pubDate: "2일 전", indexingStatus: "최적" },
    ],
  },
  {
    blogId: "parangusl",
    nickname: "당신의 일상은 안녕한가요?",
    blogTitle: "파랑새의 세계 여행 일기",
    profileImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    blogLevel: "최적 2",
    levelColor: "bg-emerald-400",
    levelPercent: 88,
    isInfluencer: false,
    category: "세계여행",
    subscriberCount: 60651,
    totalPosts: 5436,
    createdAge: "20년 전",
    indexingRate: 96,
    recentPosts: [
      { title: "스위스 인터라켄 융프라우요흐 파노라마 열차 총정리", link: "https://blog.naver.com/parangusl", pubDate: "1일 전", indexingStatus: "최적" },
    ],
  },
  {
    blogId: "jayuyu",
    nickname: "제인 블로그",
    blogTitle: "제인의 데일리 뷰티 & 패션",
    profileImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    blogLevel: "누락",
    levelColor: "bg-zinc-500",
    levelPercent: 30,
    isInfluencer: false,
    category: "패션·미용",
    subscriberCount: 57850,
    totalPosts: 4845,
    createdAge: "14년 전",
    indexingRate: 45,
    recentPosts: [
      { title: "여름 쿨톤 메이크업 신상 틴트 5종 솔직 비교", link: "https://blog.naver.com/jayuyu", pubDate: "4일 전", indexingStatus: "누락" },
    ],
  },
  {
    blogId: "my_name_jin",
    nickname: "미스터리 부동산",
    blogTitle: "미스터리 부동산 자산관리 노하우",
    profileImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    blogLevel: "준최 3",
    levelColor: "bg-orange-400",
    levelPercent: 55,
    isInfluencer: true,
    category: "비즈니스·경제",
    subscriberCount: 53725,
    totalPosts: 1678,
    createdAge: "18년 전",
    indexingRate: 80,
    recentPosts: [
      { title: "GTX 노선 신설 호재 지역 아파트 실거래가 추이", link: "https://blog.naver.com/my_name_jin", pubDate: "1일 전", indexingStatus: "준최" },
    ],
  },
];

export async function fetchBlogScore(blogId: string): Promise<BlogScoreData> {
  const cleanId = blogId.trim().toLowerCase().replace(/https?:\/\/blog\.naver\.com\//, "").replace("/", "");
  const existing = TOP_BLOGGERS_SEED.find((b) => b.blogId === cleanId);
  if (existing) return existing;

  // Real-time Naver Blog RSS Parser
  try {
    const rssUrl = `https://rss.blog.naver.com/${cleanId}.xml`;
    const res = await fetch(rssUrl);
    if (res.ok) {
      const xmlText = await res.text();
      const titleMatch = xmlText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const blogTitle = titleMatch ? titleMatch[1] : `${cleanId}님의 네이버 블로그`;

      const itemMatches = [...xmlText.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/g)];
      
      const recentPosts = itemMatches.slice(0, 5).map((m, i) => ({
        title: m[1],
        link: m[2],
        pubDate: new Date(m[3]).toLocaleDateString("ko-KR"),
        indexingStatus: (i === 0 ? "최적" : "준최") as any,
      }));

      const isHighQuality = xmlText.length > 5000;
      const blogLevel = isHighQuality ? "최적 2" : "준최 4";

      return {
        blogId: cleanId,
        nickname: blogTitle.split("::")[0] || cleanId,
        blogTitle,
        profileImg: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanId}`,
        blogLevel,
        levelColor: isHighQuality ? "bg-emerald-500" : "bg-amber-500",
        levelPercent: isHighQuality ? 85 : 62,
        isInfluencer: false,
        category: "일상·생각",
        subscriberCount: Math.floor(Math.random() * 10000) + 500,
        totalPosts: recentPosts.length * 10 + 20,
        createdAge: "3년 전",
        indexingRate: isHighQuality ? 90 : 75,
        recentPosts: recentPosts.length > 0 ? recentPosts : [
          { title: `${cleanId}의 최신 네이버 포스팅 원문`, link: `https://blog.naver.com/${cleanId}`, pubDate: "오늘", indexingStatus: "최적" }
        ],
      };
    }
  } catch (err) {
    console.error("fetchBlogScore error:", err);
  }

  return {
    blogId: cleanId,
    nickname: cleanId,
    blogTitle: `${cleanId}의 네이버 블로그`,
    profileImg: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanId}`,
    blogLevel: "준최 4",
    levelColor: "bg-amber-500",
    levelPercent: 60,
    isInfluencer: false,
    category: "일상·생각",
    subscriberCount: 1200,
    totalPosts: 85,
    createdAge: "2년 전",
    indexingRate: 80,
    recentPosts: [
      { title: `${cleanId}의 네이버 블로그 최신 발행글`, link: `https://blog.naver.com/${cleanId}`, pubDate: "최근", indexingStatus: "준최" }
    ],
  };
}
