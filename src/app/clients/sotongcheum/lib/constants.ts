import { RentalItem, BusinessItem, PortfolioItem } from "./types";

export const COMPANY_INFO = {
  name: "소통과채움 협동조합",
  brandName: "소통과 채움",
  ceo: "김정화",
  address: "경기도 화성시 봉담읍 동화길 51, 401호",
  phone: "031-292-3995",
  fax: "031-292-3994",
  email: "sotongcheum@naver.com",
  licenseNumber: "693-88-00815",
  greetings: `안녕하십니까? 소통과채움 협동조합을 찾아주셔서 진심으로 감사드립니다.\n\n저희 소통과채움은 공동체의 신뢰를 회복하고 개인의 마음을 따뜻하게 채워나가는 사회적 경제 기업입니다. 공공행사, 마을 축제 등의 행사기획 및 전문 장비 렌탈 사업과 더불어, 힐링·소통·공감을 바탕으로 한 수준 높은 체험 교육 서비스를 제공하고 있습니다.\n\n'처음부터 끝까지, 깔끔하게!'라는 신념 아래 현장 경험이 풍부한 전문 인력들이 정성을 다해 고객이 만족하는 최고의 행사와 감동적인 교육을 만들어 드립니다. 단순한 대행을 넘어 사람과 사람을 잇는 따뜻한 소통의 가치를 전하기 위해 앞으로도 끊임없이 노력하겠습니다.\n\n감사합니다.`,
};

export const RENTAL_ITEMS: RentalItem[] = [
  {
    id: "sound-system",
    name: "음향 시스템",
    engName: "Sound System",
    description: "행사의 규모와 장소에 최적화된 고출력 앰프, 스피커, 무선 마이크, 콘솔 일체형 패키지 렌탈",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    category: "sound",
  },
  {
    id: "lighting-effect",
    name: "조명 & 특수효과",
    engName: "Lighting & Effects",
    description: "무대를 화려하게 연출해 줄 LED 무대 조명, 핀조명, 스모그 머신 및 에어샷 특수효과 렌탈",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    category: "lighting",
  },
  {
    id: "stage-system",
    name: "무대 제작 & 대형 트러스",
    engName: "Stage & Truss",
    description: "행사장 규모에 맞춘 안전하고 견고한 조립식 무대 단상, 백드롭 트러스 아치 구조물 렌탈",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
    category: "stage",
  },
  {
    id: "video-system",
    name: "영상 & LED 전광판",
    engName: "Video & LED Screen",
    description: "대형 야외 행사용 고휘도 LED 전광판 스크린, 중계 카메라 촬영 및 빔 프로젝터 대여",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    category: "video",
  },
  {
    id: "canopy-tent",
    name: "캐노피 & 몽골천막",
    engName: "Tents & Canopies",
    description: "야외 축제와 행사에서 필수적인 방수 캐노피 천막, 고급 몽골천막 설치 및 철수 일체 대행",
    imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80",
    category: "tent",
  },
  {
    id: "furniture-rent",
    name: "테이블 & 의자 렌탈",
    engName: "Tables & Chairs",
    description: "듀라테이블, 플라스틱 의자, 오리의자, 파라솔 세트 등 행사의 성격에 맞춘 다양한 편의 집기 렌탈",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    category: "furniture",
  },
];

export const BUSINESS_ITEMS: BusinessItem[] = [
  {
    id: "emotional-edu",
    title: "감성 체험 교육 서비스",
    description: "마음을 치유하고 일상에 활력을 불어넣는 체험 중심의 맞춤형 감성 힐링 교육 프로그램입니다.",
    details: [
      "나만의 감성을 담는 캘리그라피 소품 및 액자 제작",
      "반려식물과 함께 마음을 보듬는 원예 테라피 수업",
      "천연 아로마 향을 조합하는 감성 디퓨저 & 향수 클래스",
      "어린이 및 청소년 대상 창의적 메이커 체험 교실",
    ],
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "family-camp",
    title: "소통과 채움의 가족 캠프",
    description: "부모와 자녀가 눈을 맞추고 깊이 소통하며 가족 공동체의 유대를 단단히 채워가는 야외 캠프 프로그램입니다.",
    details: [
      "야외 캠핑 감성을 담은 힐링 야외 가족 소통 캠프",
      "세대 격차를 해소하고 친밀감을 키우는 레크리에이션 프로그램",
      "미션을 완수하며 단결력을 높이는 아웃도어 챌린지 투어",
      "감사의 마음을 편지와 공예로 전달하는 가족 감동 프로그램",
    ],
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "organizational-edu",
    title: "조직 활성화 & 임직원 역량 강화",
    description: "기업 및 공공기관 구성원 간의 파트너십을 높이고, 감정 노동을 겪는 직원들의 마음을 돌보는 힐링 교육입니다.",
    details: [
      "서로 협력하며 소통 시너지를 체감하는 팀빌딩 액티비티",
      "긍정적인 관계 형성을 돕는 협력적 커뮤니케이션 & 리더십 교육",
      "스트레스 대처와 마인드 컨트롤을 돕는 감정 노동 힐링 솔루션",
      "직장 내 힐링 토크 콘서트 및 테라피 프로그램",
    ],
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "event-planning",
    title: "공공행사 & 마을 축제 기획/대행",
    description: "지역 공동체의 매력을 발굴하는 마을 축제부터 공공기관의 신뢰도 높은 기념행사까지 완성도 높게 실행합니다.",
    details: [
      "주민이 주인공이 되어 화합하는 마을 공동체 주민 축제 대행",
      "개소식, 준공식, 창립기념식 등 공공기관 및 기업 공식 행사 기획",
      "행사장 조성 및 무대, 음향, 조명, 특수효과 연출 및 운영 일체",
      "문화 예술 공연 기획 및 버스킹, 클래식, 전통 예술 전문 강사/공연단 섭외",
    ],
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "pf-1",
    title: "화성시 봉담 공동체 주민 화합 축제 기획 및 시스템 총괄 대행",
    date: "2026-05",
    imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
    category: "행사대행",
  },
  {
    id: "pf-2",
    title: "공공기관 임직원 협력 역량 강화를 위한 팀빌딩 레크리에이션 진행",
    date: "2026-04",
    imageUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80",
    category: "교육서비스",
  },
  {
    id: "pf-3",
    title: "화성시 사회적경제 한마음 가족 힐링 캠핑 프로그램 캠프 운영",
    date: "2026-03",
    imageUrl: "https://images.unsplash.com/photo-1478135047287-f941774fda62?auto=format&fit=crop&w=800&q=80",
    category: "가족캠프",
  },
  {
    id: "pf-4",
    title: "지역 기업체 한마음 명랑 체육대회 행사 기획 및 렌탈 집기 총괄",
    date: "2025-10",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    category: "행사대행",
  },
  {
    id: "pf-5",
    title: "종합사회복지관 대상 힐링 감성 체험 교실 - 반려식물 원예 테라피",
    date: "2025-09",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    category: "교육서비스",
  },
  {
    id: "pf-6",
    title: "화성시 청소년 소통 역량 강화 캠프 진행 및 레크리에이션 대행",
    date: "2025-07",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    category: "가족캠프",
  },
];
