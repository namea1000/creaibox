import type { IdeaHubSeriesIdea } from "../types";

const CATEGORY_ID = "data-analytics";

function makeSeries(
  prefix: string,
  subTopicId: string,
  titles: string[],
  featuredIndexes: number[] = []
): IdeaHubSeriesIdea[] {
  return titles.map((title, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, "0")}`,
    categoryId: CATEGORY_ID,
    subTopicId,
    title,
    featured: featuredIndexes.includes(index + 1),
  }));
}

export const dataAnalyticsSeries: IdeaHubSeriesIdea[] = [
  ...makeSeries(
    "data-analysis",
    "data-analysis",
    [
      "데이터 분석 입문: 초보자를 위한 엑셀 데이터 분석",
      "비즈니스 데이터 분석으로 의사결정 속도 높이기",
      "파이썬을 활용한 데이터 가공 및 분석 기초",
      "GA4(구글 애널리틱스) 마케팅 데이터 분석법",
      "고객 행동 데이터 분석을 통한 구매 전환율 극대화",
    ],
    [1, 4]
  ),
  ...makeSeries(
    "big-data",
    "big-data",
    [
      "빅데이터란 무엇인가? 개념과 활용 사례 총정리",
      "빅데이터로 예측하는 소셜 미디어 트렌드 분석",
      "빅데이터 플랫폼 구축 시 고려해야 할 인프라",
      "빅데이터 기반 마케팅 개인화 성공 전략",
      "인공지능과 빅데이터 결합이 만드는 미래 비즈니스",
    ],
    [2, 5]
  ),
  ...makeSeries(
    "statistics",
    "statistics",
    [
      "기초 통계 공식으로 비즈니스 지표 제대로 해석하기",
      "A/B 테스트와 가설 검정: 통계적 유의성 판단법",
      "평균의 함정: 통계 왜곡을 피하는 올바른 독해법",
      "상관관계와 인과관계의 차이 분석",
      "데이터 통계 기반 비즈니스 보고서 작성 팁",
    ],
    [2, 3]
  ),
  ...makeSeries(
    "data-visualization",
    "data-visualization",
    [
      "데이터 시각화의 중요성: 차트 하나로 설득하는 법",
      "태블로(Tableau)와 루커 스튜디오 시각화 대시보드 만들기",
      "인포그래픽 디자인 기획 및 실전 제작 가이드",
      "복잡한 데이터를 한눈에 보여주는 그래프 선택 기준",
      "시각적 스토리텔링을 활용한 데이터 리포팅 기법",
    ],
    [1, 2]
  ),
];
