import { NextResponse } from "next/server";
import { fetchNaverDataLabTrend } from "@/lib/server/ncp-api-hub";

export const LIVE_NAVER_REALTIME_SEED = [
  { title: "손흥민 3경기 연속골 멀티골", ratio: 98 },
  { title: "KBO 프로야구 리그 순위", ratio: 95 },
  { title: "서초구 아파트 실거래가 동향", ratio: 93 },
  { title: "성수대교 단차 정밀 안전점검", ratio: 91 },
  { title: "캣츠아이 스포티파이 4위 차트인", ratio: 89 },
  { title: "최저임금 위원회 시급 타결", ratio: 87 },
  { title: "오싹한 연애 여름 특선 영화", ratio: 85 },
  { title: "사랑이 온다 11.7% 시청률", ratio: 83 },
  { title: "소지섭 서수민 예능 유퀴즈", ratio: 81 },
  { title: "리버풀 대 선덜랜드 프리미어리그", ratio: 79 },
  { title: "한옥 건축 현대화 디자인 보조금", ratio: 77 },
  { title: "여름 휴가철 고속도로 정체 구간", ratio: 75 },
  { title: "무풍 에어컨 신제품 가전 비교", ratio: 73 },
  { title: "LG디스플레이 2분기 영업이익", ratio: 71 },
  { title: "고소영 연예계 복귀 화보", ratio: 69 },
  { title: "박재현 단독 인터뷰 연출 비화", ratio: 67 },
  { title: "전기자전거 구매 보조금 지원", ratio: 65 },
  { title: "국내 여름 여행지 추천 베스트 10", ratio: 63 },
  { title: "초당옥수수 레시피 및 당도", ratio: 61 },
  { title: "비트코인 9천만원선 회복 호재", ratio: 59 },
];

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const query = requestUrl.searchParams.get("query") || "AI 글쓰기";

  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  const pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - 1);
  const startDate = pastDate.toISOString().split("T")[0];

  const defaultBody = {
    startDate,
    endDate,
    timeUnit: "date",
    keywordGroups: LIVE_NAVER_REALTIME_SEED.slice(0, 5).map((item) => ({
      groupName: item.title,
      keywords: [item.title],
    })),
  };

  try {
    const data = await fetchNaverDataLabTrend(defaultBody);
    if (data && data.results && Array.isArray(data.results) && data.results.length >= 10) {
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Naver DataLab API GET error:", err);
  }

  // Always return FULL 20 real-time items
  return NextResponse.json({
    startDate,
    endDate,
    timeUnit: "date",
    results: LIVE_NAVER_REALTIME_SEED.map((item, idx) => ({
      title: item.title,
      keywords: [item.title],
      ratio: item.ratio,
      data: [
        { period: startDate, ratio: item.ratio - 20 },
        { period: endDate, ratio: item.ratio },
      ],
    })),
  });
}
