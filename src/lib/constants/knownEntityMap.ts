// 공공기관, 대기업, 대학, 플랫폼 영문 brand_id ↔ 한글 Target Entity 스마트 매핑 테이블

export const KNOWN_ENTITY_MAP: Record<string, string> = {
  bluehouse: "🏛️ 청와대 (대통령실)",
  police: "🚔 경찰청 / 경찰",
  rok: "🇰🇷 대한민국 육군/정부",
  president: "👑 대한민국 대통령실",
  assembly: "🏛️ 대한민국 국회",
  supcourt: "⚖️ 대한민국 대법원",
  gov: "🏛️ 대한민국 정부",
  korea: "🇰🇷 대한민국 국호",
  korean: "🇰🇷 대한민국 국호",
  samsung: "🏢 삼성그룹",
  samsungfire: "🏢 삼성화재",
  samsungbio: "🏢 삼성바이오로직스",
  samsunglife: "🏢 삼성생명",
  samsunghealth: "🏥 삼성 헬스",
  samsungsds: "🏢 삼성SDS",
  samsungsec: "🏦 삼성증권",
  samsungcard: "💳 삼성카드",
  samsungpay: "💳 삼성페이",
  google: "🌐 구글 (Google)",
  news: "📰 뉴스/언론 종합",
  syuka: "🎙️ 크리에이터 슈카월드",
  court: "⚖️ 대한민국 법원",
  snu: "🎓 서울대학교",
  seoul: "🏛️ 서울특별시",
  bnk: "🏦 BNK 금융지주 / 부산은행",
  government: "🏛️ 대한민국 정부",
  store: "🛒 쇼핑몰 / 스토어 공용어",
  prosecution: "⚖️ 대한민국 검찰청",
  kakao: "💬 카카오 (Kakao)",
  kakaopay: "💳 카카오페이",
  kakaotalk: "💬 카카오톡",
  kakaogames: "🎮 카카오게임즈",
  naver: "🟢 네이버 (Naver)",
  naverpay: "💳 네이버페이",
  navertv: "📺 네이버TV",
  naverblog: "📝 네이버블로그",
  toss: "💙 토스 (Viva Republica)",
  tosspay: "💳 토스페이",
  tossbank: "🏦 토스뱅크",
  tosssec: "📈 토스증권",
  coupang: "🚀 쿠팡 (Coupang)",
  coupangpay: "💳 쿠팡페이",
  coupangplay: "🎬 쿠팡플레이",
  coupangeats: "🛵 쿠팡이츠",
  baemin: "🛵 배달의민족",
  daum: "🌐 다음 (Daum)",
  daangn: "🥕 당근 (당근마켓)",
  lotte: "🏢 롯데그룹",
  lg: "🏢 LG그룹",
  sk: "🏢 SK그룹",
  hyundai: "🚗 현대자동차그룹",
  posco: "🏭 포스코",
  kt: "📡 KT (한국통신)",
  shinhan: "🏦 신한금융그룹",
  woori: "🏦 우리금융그룹",
  hana: "🏦 하나금융그룹",
  kb: "🏦 KB국민금융그룹",
  nh: "🌾 농협 (NH농협금융)",
  cj: "🍷 CJ그룹",
  koreaelec: "⚡ 한국전력공사",
  koreatrans: "🛣️ 한국도로공사",
  koreasea: "⚓ 한국해양교통안전공단",
  koreaoption: "📈 한국옵션거래소",
  koreapost: "📮 우정사업본부 (우체국)",
  koreagas: "🔥 한국가스공사",
  koreawater: "💧 한국수자원공사",
  korealand: "🏠 LH 한국토지주택공사",
  korearail: "🚆 한국철도공사 (KORAIL)",
  koreaairport: "✈️ 한국공항공사",
};

// 한글 단어 ➡️ 영문 키워드 패턴 매핑 사설 (부분 검색용)
const KOREAN_TO_ENGLISH_PATTERNS: Array<{ kor: string; eng: string }> = [
  { kor: "삼성", eng: "samsung" },
  { kor: "쿠팡", eng: "coupang" },
  { kor: "네이버", eng: "naver" },
  { kor: "카카오", eng: "kakao" },
  { kor: "토스", eng: "toss" },
  { kor: "현대", eng: "hyundai" },
  { kor: "청와대", eng: "bluehouse" },
  { kor: "경찰", eng: "police" },
  { kor: "대통령", eng: "president" },
  { kor: "국회", eng: "assembly" },
  { kor: "대법원", eng: "supcourt" },
  { kor: "법원", eng: "court" },
  { kor: "검찰", eng: "prosecution" },
  { kor: "정부", eng: "gov" },
  { kor: "서울대", eng: "snu" },
  { kor: "서울", eng: "seoul" },
  { kor: "롯데", eng: "lotte" },
  { kor: "신한", eng: "shinhan" },
  { kor: "우리", eng: "woori" },
  { kor: "하나", eng: "hana" },
  { kor: "국민", eng: "kb" },
  { kor: "농협", eng: "nh" },
  { kor: "배민", eng: "baemin" },
  { kor: "배달의민족", eng: "baemin" },
  { kor: "당근", eng: "daangn" },
  { kor: "구글", eng: "google" },
  { kor: "뉴스", eng: "news" },
];

/**
 * 한글 검색어(예: "삼성", "청와대", "쿠팡")가 들어오면
 * 매칭되는 대표 영문 브랜드 키워드(예: ["samsung"], ["bluehouse"], ["coupang"])를 반환합니다.
 */
export function getMatchedEnglishBrandTerms(searchTerm: string): string[] {
  if (!searchTerm || !searchTerm.trim()) return [];
  const clean = searchTerm.trim().toLowerCase();

  const engTerms = new Set<string>();

  // 1) 영한 패턴 테이블 검사
  for (const item of KOREAN_TO_ENGLISH_PATTERNS) {
    if (clean.includes(item.kor) || item.kor.includes(clean)) {
      engTerms.add(item.eng);
    }
  }

  // 2) KNOWN_ENTITY_MAP 검사
  for (const [brandId, koreanEntity] of Object.entries(KNOWN_ENTITY_MAP)) {
    if (koreanEntity.toLowerCase().includes(clean)) {
      engTerms.add(brandId);
    }
  }

  return Array.from(engTerms);
}

/**
 * 한글 검색어 매칭 brand_id 목록 반환 (하위 호환)
 */
export function getMatchedBrandIdsByKoreanEntity(searchTerm: string): string[] {
  return getMatchedEnglishBrandTerms(searchTerm);
}
