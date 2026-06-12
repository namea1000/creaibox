import type { IdeaHubSeriesIdea } from "../types";

const CATEGORY_ID = "shopping";

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

export const shoppingSeries: IdeaHubSeriesIdea[] = [
  ...makeSeries(
    "smartphone-shopping",
    "smartphone-shopping",
    [
      "가성비 스마트폰 구매 가이드: 가격대별 최고의 선택",
      "자급제 폰과 통신사 요금제 결합 꿀팁 비교",
      "중고 스마트폰 거래 시 반드시 체크해야 할 주의점",
    ],
    [1]
  ),
  ...makeSeries(
    "laptop-shopping",
    "laptop-shopping",
    [
      "대학생 & 직장인 용도별 노트북 고르는 명확한 기준",
      "맥북 vs 윈도우 노트북 생산성 및 가치 분석",
      "가성비 사무용 노트북 추천 모델 및 성능 비교",
    ],
    [2]
  ),
  ...makeSeries(
    "camera",
    "camera",
    [
      "유튜브 입문자용 미러리스 카메라 추천 TOP 5",
      "풀프레임 vs 크롭바디 센서 차이와 선택 방법",
      "스마트폰 카메라로 전문가처럼 사진 촬영하는 법",
    ],
    [1]
  ),
  ...makeSeries(
    "home-appliance",
    "home-appliance",
    [
      "신혼 가전 졸업 가이드: 패키지 구매 요령과 팁",
      "로봇청소기 3대 이모 가전 솔직 비교 및 추천",
      "스마트 홈 IoT 가전 구축 가이드",
    ],
    [2]
  ),
  ...makeSeries(
    "shopping-guide",
    "shopping-guide",
    [
      "해외 직구 초보자를 위한 개인통관고유부호 사용법",
      "알리/테무 직구 시 피해 예방을 위한 체크리스트",
      "카드사 할인 및 포인트 적립 극대화하는 소비 요령",
    ],
    [1]
  ),
  ...makeSeries(
    "product-review",
    "product-review",
    [
      "요즘 뜨는 IT 테크 신제품 솔직 사용 후기 리포트",
      "삶의 질을 높여주는 내돈내산 꿀템 가성비 리뷰",
      "스마트 가전 6개월 실사용 장단점 요약 비교",
    ],
    [1, 3]
  ),
];
