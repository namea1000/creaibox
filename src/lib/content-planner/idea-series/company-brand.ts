import type { IdeaHubSeriesIdea } from "../types";

const CATEGORY_ID = "company-brand";

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

export const companyBrandSeries: IdeaHubSeriesIdea[] = [
  ...makeSeries(
    "samsung",
    "samsung",
    [
      "삼성 갤럭시 플래그십 신제품 및 미래 전략 분석",
      "글로벌 반도체 트렌드 속 삼성전자의 기술 격차",
      "삼성 브랜드 가치와 글로벌 마케팅 성공 요인",
    ],
    [1]
  ),
  ...makeSeries(
    "apple",
    "apple",
    [
      "애플 아이폰 성능 향상과 독자적 칩셋(M시리즈) 생태계",
      "애플의 서비스 매출 다변화 및 구독 모델 분석",
      "감성 마케팅의 끝판왕: 애플의 패키징과 브랜드 신뢰도",
    ],
    [2]
  ),
  ...makeSeries(
    "google",
    "google",
    [
      "구글 검색 알고리즘 변화와 디지털 생태계 영향 분석",
      "유튜브 플랫폼 비즈니스와 크리에이터 이코노미 전망",
      "구글 안드로이드 OS 플랫폼 확장 전략",
    ],
    [1, 2]
  ),
  ...makeSeries(
    "tesla",
    "tesla",
    [
      "테슬라 전기차 가격 전략과 기가팩토리 혁신 분석",
      "테슬라 FSD(자율주행) 시스템 개발 현황과 로봇택시 전망",
      "테슬라 에너지 사업: 메가팩과 태양광 생태계 분석",
    ],
    [2]
  ),
  ...makeSeries(
    "openai-company",
    "openai-company",
    [
      "OpenAI의 최신 대규모 언어모델 출시 및 업계 반응",
      "OpenAI의 상업화 전략과 비영리 이사회 간의 갈등사",
      "OpenAI API 비즈니스 에코시스템 분석",
    ],
    [1]
  ),
  ...makeSeries(
    "brand-analysis",
    "brand-analysis",
    [
      "MZ세대를 사로잡는 차별화된 퍼스널 브랜딩 구축법",
      "잘나가는 로컬 브랜드의 오프라인 공간 마케팅 전략",
      "성공적인 리브랜딩 사례로 배우는 기업 이미지 개선법",
      "감성 브랜딩과 데이터 기반 마케팅의 완벽한 결합",
      "기업의 ESG 경영 전략과 브랜드 평판 상승 요인",
    ],
    [1, 3]
  ),
];
