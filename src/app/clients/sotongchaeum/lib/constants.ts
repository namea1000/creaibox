import { RentalItem, BusinessItem, PortfolioItem } from "./types";

export const COMPANY_INFO = {
  name: "소통과채움 협동조합",
  brandName: "소통과 채움",
  ceo: "김정화",
  address: "경기도 화성시 봉담읍 동화길 51, 401호",
  phone: "031-292-3995",
  fax: "031-292-3994",
  email: "sotongchaeum@naver.com",
  licenseNumber: "693-88-00815",
  naverMapUrl: "https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%ED%99%94%EC%84%B1%EC%8B%9C%20%EB%B4%89%EB%8B%B4%EC%9D%8D%20%EB%8F%99%ED%99%94%EA%B8%B8%2051/address/3zgIAB,2Axt47,%EA%B2%BD%EA%B8%B0%EB%8F%84%20%ED%99%94%EC%84%B1%EC%8B%9C%20%ED%9A%A8%ED%96%89%EA%B5%AC%20%EB%B4%89%EB%8B%B4%EC%9D%8D%20%EB%8F%99%ED%99%94%EA%B8%B8%2051?isCorrectAnswer=true&c=15.00,0,0,0,dh",
  greetings: `안녕하십니까?\n소통과채움을 찾아주셔서 진심으로 감사드립니다.\n\n소통과채움은 화성특례시를 기반으로 지역사회와 함께 성장하는 행사 전문기업입니다.\n\n우리는 행사를 단순한 이벤트가 아닌 사람과 사람을 연결하는 '소통'의 장이자, 지역과 공동체에 새로운 가치와 행복을 '채우는' 과정이라고 생각합니다. 주민과 지역사회가 함께 참여하고 공감하며 성장할 수 있는 공동체 문화를 만들어가는 것이 소통과채움의 가장 중요한 가치입니다.\n\n기념식, 주민자치 사업, 문화축제, 체육대회, 성과공유회, 워크숍 등 다양한 현장 경험을 바탕으로 기획부터 운영, 홍보까지 체계적인 서비스를 제공합니다. 행사 하나하나에 지역의 이야기와 사람들의 참여를 담아 모두가 함께 즐기고 기억할 수 있는 특별한 순간을 만들어가고 있습니다.\n\n앞으로도 소통과채움은 사람과 지역을 잇는 소통의 가교가 되고, 공동체의 가치와 문화를 채워가는 든든한 파트너로서 함께 성장해 나가겠습니다.\n\n감사합니다.`,
};

import { getCustomClientAssetUrl } from "@/lib/r2-client-assets";

export const RENTAL_ITEMS: RentalItem[] = [
  {
    id: "sound-system",
    name: "음향 시스템",
    engName: "Sound System",
    description: "행사의 규모와 장소에 최적화된 고출력 앰프, 스피커, 무선 마이크, 콘솔 일체형 패키지 렌탈",
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "rental-sound-system.webp"),
    category: "sound",
  },
  {
    id: "lighting-effect",
    name: "조명 & 특수효과",
    engName: "Lighting & Effects",
    description: "무대를 화려하게 연출해 줄 LED 무대 조명, 핀조명, 스모그 머신 및 에어샷 특수효과 렌탈",
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "rental-lighting-effects.webp"),
    category: "lighting",
  },
  {
    id: "stage-system",
    name: "무대 제작 & 대형 트러스",
    engName: "Stage & Truss",
    description: "행사장 규모에 맞춘 안전하고 견고한 조립식 무대 단상, 백드롭 트러스 아치 구조물 렌탈",
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "rental-stage-truss.webp"),
    category: "stage",
  },
  {
    id: "video-system",
    name: "영상 & LED 전광판",
    engName: "Video & LED Screen",
    description: "대형 야외 행사용 고휘도 LED 전광판 스크린, 중계 카메라 촬영 및 빔 프로젝터 대여",
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "rental-video-led.webp"),
    category: "video",
  },
  {
    id: "canopy-tent",
    name: "캐노피 & 몽골천막",
    engName: "Tents & Canopies",
    description: "야외 축제와 행사에서 필수적인 방수 캐노피 천막, 고급 몽골천막 설치 및 철수 일체 대행",
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "rental-canopy-tents.webp"),
    category: "tent",
  },
  {
    id: "furniture-rent",
    name: "테이블 & 의자 렌탈",
    engName: "Tables & Chairs",
    description: "듀라테이블, 플라스틱 의자, 오리의자, 파라솔 세트 등 행사의 성격에 맞춘 다양한 편의 집기 렌탈",
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "rental-tables-chairs.webp"),
    category: "furniture",
  },
];

export const BUSINESS_ITEMS: BusinessItem[] = [
  {
    id: "cultural-events",
    title: "1. 문화행사",
    description: "지역의 문화와 이야기를 담은 축제와 문화행사를 통해 사람과 사람을 연결하고 공동체 문화를 만들어갑니다. 소통과채움은 지역의 특성과 참여자의 니즈를 반영한 차별화된 콘텐츠로 모두가 함께 즐기고 공감하는 문화행사를 제공합니다.",
    details: [
      "지역 특색 문화축제 및 행사 기획·운영",
      "주민 참여형 체험 및 문화예술 콘텐츠 개발",
      "버스킹, 클래식, 전통/대중 공연 기획",
      "축제 콘셉트, 공간 연출 및 부스 조성",
      "문화예술 전문 강사 및 공연단 섭외",
      "온·오프라인 홍보 콘텐츠 제작 지원",
    ],
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "biz-cultural-event.webp"),
  },
  {
    id: "ceremonies",
    title: "2. 기념식",
    description: "공공기관과 기업의 중요한 순간을 더욱 의미 있고 품격 있게 만들어드립니다. 행사 목적과 메시지가 효과적으로 전달될 수 있도록 체계적인 기획과 안정적인 운영을 제공합니다.",
    details: [
      "개소식·준공식·창립기념식 등 공식행사 대행",
      "위촉식, 선포식 및 정책 홍보행사 운영",
      "의전 계획 수립 및 행사 시나리오 구성",
      "무대·음향·조명·특수효과 연출 및 운영",
      "현수막, 홍보물 및 관련 영상 제작 지원",
      "안전관리 및 현장 운영 전반 총괄 지원",
    ],
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "biz-ceremony.webp"),
  },
  {
    id: "local-autonomy",
    title: "3. 주민자치 사업",
    description: "주민이 주체가 되어 참여하고 성장하는 주민자치 사업을 지원합니다. 주민 간 소통과 협력을 바탕으로 지속가능한 공동체 문화를 만들어갑니다.",
    details: [
      "주민총회 및 주민자치회 사업 기획·운영",
      "마을축제 및 마을공동체 사업 지원",
      "주민 참여 프로그램 및 공론장 운영",
      "마을 의제 발굴 및 주민 의견 수렴 기획",
      "성과공유 및 주민자치 활성화 행사 운영",
      "홍보물 제작 및 사업 성과 기록 지원",
    ],
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "biz-local-autonomy.webp"),
  },
  {
    id: "sports-festival",
    title: "4. 한마음 체육대회",
    description: "함께 뛰고 함께 웃으며 화합하는 시간을 만들어드립니다. 세대와 계층이 함께 참여할 수 있는 안전하고 즐거운 체육행사를 제공합니다.",
    details: [
      "주민화합 체육대회 및 명랑운동회 기획",
      "기업 및 단체 한마음 체육대회 운영",
      "레크리에이션 및 참여형 프로그램 구성",
      "경기 종목 개발 및 행사 시나리오 기획",
      "무대·음향·진행 인력 및 안전관리 지원",
      "시상식 및 맞춤형 부대행사 운영",
    ],
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "biz-sports-day.webp"),
  },
  {
    id: "performance-sharing",
    title: "5. 성과공유회",
    description: "사업의 성과를 공유하고 미래의 비전을 함께 나누는 자리를 만들어갑니다. 참여자 간 공감과 소통이 이루어질 수 있도록 차별화된 콘텐츠를 제공합니다.",
    details: [
      "사업 성과공유회 및 성과발표회 기획",
      "우수사례 발표 및 토크콘서트 운영",
      "포럼, 세미나, 컨퍼런스 기획·운영",
      "성과 전시 및 홍보 콘텐츠 제작",
      "홍보 영상 및 사업 기록물 제작 지원",
      "행사 운영 전반 및 참여자 관리 지원",
    ],
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "biz-performance-sharing.webp"),
  },
  {
    id: "workshop",
    title: "6. 워크숍",
    description: "배움과 소통, 힐링이 함께하는 워크숍을 기획합니다. 조직의 성장과 구성원 간 유대감 형성을 위한 맞춤형 프로그램을 제공합니다.",
    details: [
      "공공기관 및 단체 맞춤 워크숍 기획",
      "조직문화 및 역량강화 프로그램 운영",
      "팀빌딩 및 조직 소통 프로그램 기획",
      "힐링, 체험, 문화예술 프로그램 운영",
      "전문 강사 및 교육 콘텐츠 섭외",
      "숙박, 식사, 차량 등 행사진행 전반 지원",
    ],
    imageUrl: getCustomClientAssetUrl("sotongchaeum", "biz-workshop.webp"),
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
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
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

export interface ClientPartnerCategory {
  category: string;
  items: string[];
}

export const CLIENT_PARTNERS: ClientPartnerCategory[] = [
  {
    category: "지자체 & 주민자치회",
    items: [
      "화성특례시",
      "동탄1동 주민자치회",
      "동탄4동 주민자치회",
      "동탄9동 주민자치회",
      "병점2동 주민자치회",
      "양감면 주민자치회",
      "화산동 주민자치회",
      "마도면 주민자치회",
      "매송면 주민자치회",
      "금천구 시흥1동 주민자치회",
      "경기도",
      "과천시",
      "용인시",
      "남양주시",
      "천안시",
      "부여군",
      "청양군",
      "대전 유성구",
      "장수군",
      "대구 중구",
    ],
  },
  {
    category: "공공기관 & 주요 단체",
    items: [
      "화성시마을공동체지원센터",
      "화성시협동조합협의회",
      "화성시 가치이룸연합회",
      "화성시보훈단체협의회",
      "화성시노사민정협의회",
      "화성시문화관광재단",
      "팔탄면 체육진흥회",
      "월남전참전자회 화성시지회",
      "특수임무유공자회 화성시지회",
      "경기도협동조합협의회",
      "평창군 농업기술센터",
      "부여군 농업기술센터",
      "한국국토정보공사",
      "현대자동차 노조",
    ],
  },
  {
    category: "교육기관 & 기업/협력사",
    items: [
      "단국대학교",
      "유원대학교",
      "문일고등학교",
      "상봉초등학교",
      "X-월드 코리아",
      "인성코리아",
      "유답",
      "다은컨설팅",
      "공감컨설팅",
      "이지프로덕션",
    ],
  },
];
