import type { IdeaHubSeriesIdea } from "../types";

const CATEGORY_ID = "military-security";

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

export const militarySecuritySeries: IdeaHubSeriesIdea[] = [
  ...makeSeries(
    "military",
    "military",
    [
      "한국 국방 전력 순위와 동아시아 군사력 지형 분석",
      "미래형 스마트 군대: AI와 무인 전투 로봇 도입 현황",
      "군 복무 단축과 모병제 전환 논란의 핵심 팩트 체크",
    ],
    [1]
  ),
  ...makeSeries(
    "weapons",
    "weapons",
    [
      "글로벌 방산 수출 강자 K-방산 주요 명품 무기 체계",
      "차세대 5세대 스텔스 전투기 개발 전쟁과 성능 비교",
      "미사일 방어 체계(사드, L-SAM) 작동 원리와 전력 분석",
    ],
    [2]
  ),
  ...makeSeries(
    "war-analysis",
    "war-analysis",
    [
      "현대 하이브리드 전쟁: 사이버 해킹과 심리전의 결합",
      "우크라이나 전쟁과 가자지구 갈등의 군사 전략적 시사점",
      "드론 전술이 바꾼 보병 작전 형태와 무기 체계 변화",
    ],
    [1]
  ),
  ...makeSeries(
    "international-security",
    "international-security",
    [
      "동북아 지정학적 긴장과 한미일 군사 동맹 강화 전망",
      "글로벌 해상 교역로(호르무즈, 말라카 해협) 보안 위기",
      "사이버 안보와 핵심 정보 인프라 보호 국가 보안 전략",
    ],
    [1, 3]
  ),
];
