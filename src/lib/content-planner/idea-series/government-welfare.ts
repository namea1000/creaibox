import type { IdeaHubSeriesIdea } from "../types";

const CATEGORY_ID = "government-welfare";

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

export const governmentWelfareSeries: IdeaHubSeriesIdea[] = [
  ...makeSeries(
    "government-support",
    "government-support",
    [
      "내가 받을 수 있는 2026 정부 지원금 종류 한눈에 확인하기",
      "소상공인 및 자영업자를 위한 긴급 자금 지원 혜택 정리",
      "근로장려금과 자녀장려금 조건 및 신청 방법 완전 가이드",
    ],
    [1]
  ),
  ...makeSeries(
    "startup-support",
    "startup-support",
    [
      "예비창업패키지 합격 계획서 작성 요령과 준비물",
      "기술창업팀을 위한 지자체 R&D 지원사업 연계 팁",
      "무상 청년 전용 창업자금 대출 자격 요건 분석",
    ],
    [2]
  ),
  ...makeSeries(
    "youth-policy",
    "youth-policy",
    [
      "청년도약계좌와 청년우대형 주택청약 복합 혜택 가이드",
      "지자체별 청년 교통비 및 월세 지원 정책 비교",
      "내일배움카드로 국비지원 교육 신청하고 취직하는 법",
    ],
    [1]
  ),
  ...makeSeries(
    "housing-support",
    "housing-support",
    [
      "청년 버팀목 전세자금 대출 조건 및 필요 서류 요약",
      "디딤돌 대출과 신생아 특례 대출 주택 금융 가이드",
      "행복주택 및 LH 국민임대주택 자격 조건 총정리",
    ],
    [2]
  ),
  ...makeSeries(
    "welfare",
    "welfare",
    [
      "기초생활보장 수급자 및 차상위계층 혜택 변화 요약",
      "맞춤형 급여안내(복지멤버십) 가입하고 알림 받는 법",
      "국민연금 조기 수령 및 연기 연금 비교 분석 가이드",
    ],
    [1]
  ),
];
