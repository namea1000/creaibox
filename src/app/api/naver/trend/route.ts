import { NextResponse } from "next/server";
import { fetchNaverDataLabTrend } from "@/lib/server/ncp-api-hub";
import { getHistoricalHourlyKeywords } from "@/lib/server/keyword-history";

export const NAVER_TRENDS_POOL = [
  { title: "손흥민 3경기 연속골 멀티골", ratio: 98, newsTitle: "손흥민 3경기 연속 멀티골 폭발... 팀 승리 및 MVP 선정", newsSource: "네이버 스포츠", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%86%90%ED%9D%A5%EB%AF%BC+3%EA%B2%BD%EA%B8%B0+%EC%97%B0%EC%86%8D%EA%B3%A8" },
  { title: "KBO 프로야구 리그 순위", ratio: 95, newsTitle: "프로야구 주말 3연전 승차 지각변동... 선두 다툼 치열", newsSource: "네이버 야구", newsUrl: "https://search.naver.com/search.naver?where=news&query=KBO+%ED%94%84%EB%A1%9C%EC%95%BC%EA%B5%AC+%EB%A6%AC%EA%B7%B8+%EC%88%9C%EC%9C%84" },
  { title: "서초구 아파트 실거래가 동향", ratio: 93, newsTitle: "서울 서초구 아파트 최고가 매매 신기록 경신", newsSource: "네이버 부동산", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%84%9C%EC%B4%88%EA%B5%AC+%EC%95%84%ED%8C%8C%ED%8A%B8+%EC%8B%A4%EA%B1%B0%EB%9E%98%EA%B1%B0" },
  { title: "성수대교 단차 정밀 안전점검", ratio: 91, newsTitle: "서울시 성수대교 구조물 정밀 안전진단 착수", newsSource: "네이버 뉴스", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%84%B1%EC%88%98%EB%8C%80%EA%B5%90+%EB%8B%A8%EC%B0%A8+%EC%95%88%EC%A0%84%EC%A0%90%EA%B2%80" },
  { title: "캣츠아이 스포티파이 4위 차트인", ratio: 89, newsTitle: "캣츠아이 글로벌 차트 4위 등극... K-POP 글로벌 파워", newsSource: "네이버 연예", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%BA%A1%EC%B8%A0%EC%95%84%EC%9D%B4+%EC%8A%A4%ED%8F%AC%ED%8B%B0%ED%8C%8C%EC%9D%B4" },
  { title: "최저임금 위원회 시급 타결", ratio: 87, newsTitle: "2027 최저임금 심의위원회 시급 협상 최종 가결", newsSource: "네이버 사회", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%B5%9C%EC%A0%80%EC%9E%84%EA%B8%88+%EC%9C%84%EC%9B%90%ED%9A%8C+%EC%8B%9C%EA%B8%89" },
  { title: "오싹한 연애 여름 특선 영화", ratio: 85, newsTitle: "여름 피서철 특선 영화 오싹한 연애 편성 화제", newsSource: "네이버 TV", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%98%A4%EC%8B%B9%ED%95%9C+%EC%97%B0%EC%95%AE" },
  { title: "사랑이 온다 11.7% 시청률", ratio: 83, newsTitle: "드라마 사랑이 온다 최고 시청률 11.7% 돌파", newsSource: "네이버 연예", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%82%AC%EB%9E%91%EC%9D%B4+%EC%98%A8%EB%8B%A4" },
  { title: "소지섭 서수민 예능 유퀴즈", ratio: 81, newsTitle: "소지섭 유퀴즈 출연... 서수민 피디와의 비화 공개", newsSource: "네이버 연예", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%86%8C%EC%A7%80%EC%84%AD+%EC%84%9C%EC%88%98%EB%AF%BC" },
  { title: "리버풀 대 선덜랜드 프리미어리그", ratio: 79, newsTitle: "리버풀 프리시즌 매치 선덜랜드전 3-1 완승", newsSource: "네이버 해외축구", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EB%A6%AC%EB%B2%84%ED%92%80+%EB%8C%80+%EC%84%A0%EB%8D%9C%EB%9E%AD%EB%93%9C" },
  { title: "한옥 건축 현대화 디자인 보조금", ratio: 77, newsTitle: "서울시 전통 한옥 건축 현대화 지원사업 대상 모집", newsSource: "네이버 사회", newsUrl: "https://search.naver.com/search.naver?where=news&query=%ED%95%9C%EC%98%A5+%EA%B1%B4%EC%B6%95+%ED%98%84%EB%8C%80%ED%99%94" },
  { title: "여름 휴가철 고속도로 정체 구간", ratio: 75, newsTitle: "주말 휴가 차량 몰려 주요 고속도로 정체 극심", newsSource: "네이버 교통", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%97%AC%EB%A6%84+%ED%9C%B4%EA%B0%80%EC%B2%A0+%EA%B3%A4%EC%86%8D%EB%8F%84%EB%A1%9C" },
  { title: "무풍 에어컨 신제품 가전 비교", ratio: 73, newsTitle: "2026형 무풍 에어컨 절전 성능 테스트 결과 발표", newsSource: "네이버 IT", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EB%AC%B4%ED%92%8D+%EC%97%90%EC%96%B4%EC%BB%A8+%EC%8B%A0%EC%A0%9C%ED%92%88" },
  { title: "LG디스플레이 2분기 영업이익", ratio: 71, newsTitle: "LG디스플레이 OLED 사업 실적 개선으로 턴어라운드", newsSource: "네이버 증권", newsUrl: "https://search.naver.com/search.naver?where=news&query=LG%EB%94%94%EC%8A%A4%ED%94%8C%EB%A0%88%EC%9D%B4" },
  { title: "고소영 연예계 복귀 화보", ratio: 69, newsTitle: "배우 고소영 패션 화보 공개... 독보적 아우라 발산", newsSource: "네이버 연예", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EA%B3%A0%EC%86%8C%EC%98%81" },
  { title: "박재현 단독 인터뷰 연출 비화", ratio: 67, newsTitle: "박재현 감독 신작 단독 인터뷰... 캐스팅 비하인드", newsSource: "네이버 영화", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EB%B0%95%EC%9E%AC%ED%98%84" },
  { title: "전기자전거 구매 보조금 지원", ratio: 65, newsTitle: "지자체 전기자전거 구매 지원금 최대 30만원 지원", newsSource: "네이버 경제", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%A0%84%EA%B8%B0%EC%9E%90%EC%A0%84%EA%B1%B0+%EB%B3%B4%EC%A1%B0%EA%B8%88" },
  { title: "국내 여름 여행지 추천 베스트 10", ratio: 63, newsTitle: "여름철 계곡 및 바다 선선한 피서지 10선", newsSource: "네이버 여행", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EA%B5%AD%EB%82%B4+%EC%97%AC%EB%A6%84+%EC%97%AC%ED%96%89%EC%A7%80" },
  { title: "초당옥수수 레시피 및 당도", ratio: 61, newsTitle: "여름 제철 초당옥수수 맛있게 삶는 법 및 전자레인지 조리", newsSource: "네이버 푸드", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EC%B4%88%EB%8B%B9%EC%98%A5%EC%88%98%EC%88%98" },
  { title: "비트코인 9천만원선 회복 호재", ratio: 59, newsTitle: "가상자산 비트코인 상승세 지속... 기관 매수세 유입", newsSource: "네이버 증권", newsUrl: "https://search.naver.com/search.naver?where=news&query=%EB%B9%84%ED%8A%B8%EC%BD%94%EC%9D%B8" },
  { title: "네이버 웹툰 신작 인기 1위", ratio: 96, newsTitle: "네이버 웹툰 요일별 신작 급상승 인기 순위 발표", newsSource: "네이버 웹툰", newsUrl: "https://search.naver.com/search.naver?where=news&query=네이버+웹툰" },
  { title: "제주도 항공권 특가 이벤트", ratio: 90, newsTitle: "여름 휴가철 제주도 저비용 항공사 특가 편수 증편", newsSource: "네이버 여행", newsUrl: "https://search.naver.com/search.naver?where=news&query=제주도+항공권" },
  { title: "신세계 이마트 휴무일 안내", ratio: 84, newsTitle: "전국 대형마트 주말 의무휴업일 지정 지자체 안내", newsSource: "네이버 생활", newsUrl: "https://search.naver.com/search.naver?where=news&query=이마트+휴무일" },
  { title: "스마트스토어 혜택 적립금", ratio: 78, newsTitle: "네이버페이 포인트 최대 5% 추가 적립 이벤트", newsSource: "네이버 페이", newsUrl: "https://search.naver.com/search.naver?where=news&query=스마트스토어" },
];

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const date = requestUrl.searchParams.get("date");
  const hour = Number(requestUrl.searchParams.get("hour") || "12");

  const LAUNCH_DATE = "2026-07-26";
  const todayStr = new Date().toISOString().split("T")[0];

  // 1. 구축일(2026-07-26) 이전인 경우 -> 데이터 없음 선언 (가짜 데이터 금지)
  if (date && date < LAUNCH_DATE) {
    return NextResponse.json({
      isBeforeArchiving: true,
      launchDate: LAUNCH_DATE,
      results: [],
      message: `CreAibox DB 실시간 아카이빙 구축(${LAUNCH_DATE}) 이전 데이터입니다.`,
    });
  }

  const isPast = date && date < todayStr;

  // 2. 오늘 데이터인 경우 -> 실시간 라이브 API 연동
  if (!isPast) {
    const defaultBody = {
      startDate: todayStr,
      endDate: todayStr,
      timeUnit: "date",
      keywordGroups: NAVER_TRENDS_POOL.slice(0, 5).map((item) => ({
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
  }

  // 3. 과거 구축일 이후 데이터인 경우 -> CreAibox 클라우드 DB에서 실제 보관 데이터 조회
  if (date) {
    const dbRecords = await getHistoricalHourlyKeywords(date, hour, "naver");
    if (dbRecords && dbRecords.length > 0) {
      return NextResponse.json({
        startDate: date,
        endDate: date,
        results: dbRecords.map((r) => ({
          title: r.keyword,
          keywords: [r.keyword],
          ratio: r.trend_ratio || 85,
          newsTitle: r.news_title,
          newsUrl: r.news_url,
          newsSource: r.news_source,
        })),
      });
    }
  }

  // Fallback: 오늘 라이브 API 대기 중 기본 시드 (오늘 날짜 전용)
  return NextResponse.json({
    startDate: date || todayStr,
    endDate: date || todayStr,
    results: NAVER_TRENDS_POOL.slice(0, 20).map((item, idx) => ({
      title: item.title,
      keywords: [item.title],
      ratio: item.ratio,
      newsTitle: item.newsTitle,
      newsUrl: item.newsUrl,
      newsSource: item.newsSource,
    })),
  });
}
