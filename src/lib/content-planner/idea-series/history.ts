import type { IdeaHubSeriesIdea } from "../types";

const CATEGORY_ID = "history";

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

export const historySeries: IdeaHubSeriesIdea[] = [
  ...makeSeries(
    "korean-history",
    "korean-history",
    [
      "조선 왕조 실록에서 배우는 흥미진진한 인물사",
      "삼국시대 영웅들의 전략과 영토 확장 이야기",
      "고려시대 무역 교류와 벽란도 번영의 역사",
    ],
    [1]
  ),
  ...makeSeries(
    "world-history",
    "world-history",
    [
      "대항해시대가 바꾼 세계 경제의 흐름과 역사",
      "로마 제국의 부흥과 몰락이 현대 사회에 준 교훈",
      "산업혁명이 초래한 전 세계 기술과 노동의 변화",
    ],
    [2]
  ),
  ...makeSeries(
    "war-history",
    "war-history",
    [
      "세계대전의 원인과 결과를 정리한 한눈에 보는 역사",
      "인류 역사를 바꾼 10대 결정적 전쟁과 그 전술",
      "지정학적 리스크의 유래를 찾는 분쟁과 정전의 역사",
    ],
    [1]
  ),
  ...makeSeries(
    "ancient-history",
    "ancient-history",
    [
      "고대 이집트 문명과 피라미드 건설의 미스터리",
      "메소포타미아와 그리스 문명 비교 분석",
      "황하 문명이 동아시아 문화에 미친 영향",
    ],
    [1, 2]
  ),
  ...makeSeries(
    "modern-history",
    "modern-history",
    [
      "냉전 시대 강대국 간의 군비 경쟁과 과학 기술 발전사",
      "IMF 외환위기가 한국 경제 구조에 미친 영향 분석",
      "IT 혁명과 모바일 시대 개막의 근현대 발전사",
    ],
    [3]
  ),
];
