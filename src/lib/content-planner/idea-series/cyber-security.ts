import type { IdeaHubSeriesIdea } from "../types";

const CATEGORY_ID = "cyber-security";

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

export const cyberSecuritySeries: IdeaHubSeriesIdea[] = [
  ...makeSeries(
    "hacking",
    "hacking",
    [
      "사이버 해킹 위협과 개인 방화벽 구축 방법",
      "해킹 사고 사례로 보는 정보 보안 필수 수칙",
      "피싱 메일 구별법 및 악성코드 차단 가이드",
      "공공 와이파이 해킹 방지 및 안전 사용법",
      "모바일 스마트폰 해킹 징후와 예방 체크리스트",
    ],
    [1, 3]
  ),
  ...makeSeries(
    "privacy",
    "privacy",
    [
      "개인정보 유출 예방을 위한 비밀번호 관리법",
      "SNS 개인정보 설정 및 노출 차단 방법",
      "2차 인증(2FA) 설정 가이드 및 중요성",
      "인터넷 쿠키와 개인정보 추적 차단 설정법",
      "다크웹 개인정보 유출 확인 및 대처 방안",
    ],
    [2, 4]
  ),
  ...makeSeries(
    "ransomware",
    "ransomware",
    [
      "랜섬웨어 감염 경로 및 예방 백업 가이드",
      "중소기업을 위한 랜섬웨어 보안 솔루션",
      "랜섬웨어 복구 불가능한 이유와 예방법",
      "중요 파일 암호화 및 백업 시스템 구축법",
      "최신 랜섬웨어 트렌드 및 유포 기법 분석",
    ],
    [1, 5]
  ),
];
