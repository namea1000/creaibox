export interface CustomMenuItem {
  id: string;
  label: string;
  url: string;
  isRightAligned?: boolean;
}

export interface AdminRequestItem {
  id: string;
  userId: string;
  userNickname: string;
  companyName: string;
  category: string;
  themeColor: string;
  features: string[];
  refUrl: string;
  detail: string;
  status: "pending" | "building" | "completed";
  createdAt: string;
}

export const INITIAL_ADMIN_REQUESTS: AdminRequestItem[] = [
  {
    id: "req-101",
    userId: "usr_bizhub",
    userNickname: "스마트 비즈니스 코리아",
    companyName: "스마트 비즈니스 허브",
    category: "Business (행사/기획/렌탈)",
    themeColor: "딥 블루 다크 톤",
    features: ["실적/포트폴리오 갤러리 탭", "실시간 온라인 견적신청 폼", "전용 블로그 카운터", "DoFollow SEO 가산점 Engine"],
    refUrl: "https://bizhub.creaibox.com",
    detail: "공공행사 및 지역 축제 기획·렌탈 전문 브랜드사이트입니다. 견적 신청 폼과 갤러리가 강조된 딥 블루 다크 모드로 1:1 풀코드 생성을 요청합니다.",
    status: "completed",
    createdAt: "2026-07-25 21:30",
  },
  {
    id: "req-102",
    userId: "usr_aurashoe",
    userNickname: "아우라 메리노 스토어",
    companyName: "아우라 메리노 (Aura Merino)",
    category: "Shopping",
    themeColor: "에메랄드 티어 & 블랙",
    features: ["메리노 울 상품 그리드", "Quick View 팝업 모달", "신발 사이즈 선택기", "장바구니 & 결제 폼"],
    refUrl: "https://auramerino.creaibox.com",
    detail: "100% 천연 메리노 울 수제 스니커즈 전문 자사몰입니다. 6종 메인 상품 그리드와 1초 원클릭 마이크로 배포 템플릿 연동 부탁드립니다.",
    status: "completed",
    createdAt: "2026-07-25 20:15",
  },
  {
    id: "req-103",
    userId: "usr_wellness",
    userNickname: "더채움 웰니스 메디컬",
    companyName: "더채움 웰니스 센터",
    category: "Health & Wellness",
    themeColor: "민트 그린 & 청결한 웰니스 톤",
    features: ["의료진/강사 프로필", "1:1 진료 상담 예약 폼", "웰니스 케어 카테고리"],
    refUrl: "https://chaeum-wellness.creaibox.com",
    detail: "피부과 및 힐링 센터 전용 사이트입니다. 1:1 상담 예약 폼과 카테고리 탭이 명확히 노출되도록 풀코드 생성을 희망합니다.",
    status: "pending",
    createdAt: "2026-07-25 19:40",
  },
  {
    id: "req-104",
    userId: "usr_realestate",
    userNickname: "스마트 프라임 부동산",
    companyName: "프라임 공인중개사",
    category: "Real Estate",
    themeColor: "다크 슬레이트 & 프리미엄 골드",
    features: ["매물 검색 필터", "상세 지도 매핑", "프라이빗 매물 상담 폼"],
    refUrl: "https://primerealestate.creaibox.com",
    detail: "상가 분양 및 신축 프라이빗 매물 정보 전용 커스텀 사이트입니다. 매물 필터와 매핑 기능 연동 요청드립니다.",
    status: "completed",
    createdAt: "2026-07-25 18:20",
  },
  {
    id: "req-105",
    userId: "usr_edu",
    userNickname: "에듀플러스 아카데미",
    companyName: "에듀플러스 코딩학원",
    category: "Education",
    themeColor: "딥 네이비 & 럭셔리 블루",
    features: ["커리큘럼 안내 탭", "강사진 프로필 모달", "입학 상담 신청 폼"],
    refUrl: "https://eduplus.creaibox.com",
    detail: "AI/SW 코딩 및 수강생 모집을 위한 아카데미 커스텀 웹사이트입니다. 커리큘럼 모듈 구축 부탁드립니다.",
    status: "pending",
    createdAt: "2026-07-25 17:50",
  },
  {
    id: "req-106",
    userId: "usr_magazine",
    userNickname: "더 트렌드 매거진",
    companyName: "더 트렌드 잡지사",
    category: "Magazine",
    themeColor: "네온 시안 & 딥 차콜",
    features: ["주요 기사 헤드라인", "실시간 인기 기사 카운터", "구독 신청 폼"],
    refUrl: "https://trendmagazine.creaibox.com",
    detail: "IT/라이프스타일 매거진 포털입니다. 최신 아티클과 카테고리 기사 생성이 매끄러운 템플릿 연동을 원합니다.",
    status: "completed",
    createdAt: "2026-07-25 16:10",
  },
  {
    id: "req-107",
    userId: "usr_auraart",
    userNickname: "스튜디오 아우라",
    companyName: "아우라 크리에이티브",
    category: "Portfolio",
    themeColor: "딥 바이올렛 & 퍼플",
    features: ["작품 풀스크린 갤러리", "프로젝트 상세 모달", "외주 문의 폼"],
    refUrl: "https://studioaura.creaibox.com",
    detail: "크리에이터 전용 풀스크린 포트폴리오 및 외주 견적 받기 사이트 구축 신청합니다.",
    status: "pending",
    createdAt: "2026-07-25 15:30",
  },
  {
    id: "req-108",
    userId: "usr_gourmet",
    userNickname: "더 맛있는 쉐프",
    companyName: "고메 미식회",
    category: "Restaurant",
    themeColor: "워밍 앰버 & 다크 브라운",
    features: ["시그니처 메뉴판 그리드", "테이블 온라인 예약 폼", "오시는 길 지도"],
    refUrl: "https://gourmetchef.creaibox.com",
    detail: "파인다이닝 카스텀 레스토랑 웹사이트입니다. 테이블 예약 폼과 디너 코스 안내 페이지 제작 요청합니다.",
    status: "pending",
    createdAt: "2026-07-25 14:05",
  },
  {
    id: "req-109",
    userId: "usr_ent",
    userNickname: "스타일 엔터테인먼트",
    companyName: "스타일 엔터",
    category: "Entertainment",
    themeColor: "인디고 & 네온 퍼플",
    features: ["아티스트 라인업", "오디션/캐스팅 신청 폼", "공연 미디어 갤러리"],
    refUrl: "https://styleent.creaibox.com",
    detail: "연예 기획사 및 버스킹 공연 대행 포털 사이트 풀코드 제작 요청입니다.",
    status: "completed",
    createdAt: "2026-07-25 12:45",
  },
  {
    id: "req-110",
    userId: "usr_logistic",
    userNickname: "글로벌 로지스틱스",
    companyName: "글로벌 물류 시스템",
    category: "Business",
    themeColor: "차콜 & 로지스틱 옐로우",
    features: ["국제 물류 견적 신청", "실시간 화물 트래킹 폼", "회사 소개 탭"],
    refUrl: "https://globallogistics.creaibox.com",
    detail: "국제 화물 물류 및 운송 서비스 커스텀 웹사이트 제작 요청입니다.",
    status: "pending",
    createdAt: "2026-07-25 11:15",
  },
];

// --- Industry Tailored Design & Color Presets Definition (10 per Industry) ---
export interface DesignPreset {
  id: string;
  name: string;
  colors: string[];
  vibe: string;
  tag: string;
  description: string;
}

export const INDUSTRY_DESIGN_PRESETS: Record<string, DesignPreset[]> = {
  "Shopping": [
    { id: "s1", name: "럭셔리 다크 & 골드", colors: ["#09090b", "#d4af37", "#f59e0b"], vibe: "명품/럭셔리 패션 브랜드", tag: "명품/패션", description: "고급스러운 딥 다크와 골드 포인트 메인 톤" },
    { id: "s2", name: "네온 바이올렛 & 핑크", colors: ["#0f172a", "#8b5cf6", "#ec4899"], vibe: "트렌디 스트릿 패션", tag: "MZ/스트릿", description: "비비드 네온과 딥 퍼플의 감각적 조화" },
    { id: "s3", name: "클린 미니멀 화이트 & 스노우", colors: ["#ffffff", "#64748b", "#0f172a"], vibe: "애플 스타일 여백 모던", tag: "미니멀리즘", description: "여백과 또렷한 가독성 중심 산뜻함" },
    { id: "s4", name: "오가닉 베이지 & 포레스트", colors: ["#fef3c7", "#15803d", "#78350f"], vibe: "친환경 웰빙 비건 뷰티", tag: "오가닉/뷰티", description: "자연 친화적인 따뜻한 베이지와 차분 그린" },
    { id: "s5", name: "파스텔 로즈 & 크림", colors: ["#fff1f2", "#f43f5e", "#fb7185"], vibe: "사랑스러운 라이프스타일", tag: "화장품/코스메틱", description: "여성스럽고 포근한 파스텔 핑크 감성" },
    { id: "s6", name: "다크 슬레이트 & 오렌지 팝", colors: ["#1e293b", "#ea580c", "#ffedd5"], vibe: "스포티 아웃도어 가전", tag: "스포츠/아웃도어", description: "역동적인 활동성과 강력한 포인트" },
    { id: "s7", name: "시안 블루 & 오션 브리즈", colors: ["#06b6d4", "#0284c7", "#ecfeff"], vibe: "청량한 여름 리빙 용품", tag: "리빙/생활용품", description: "시원하고 깨끗한 아쿠아 블루 감성" },
    { id: "s8", name: "에스프레소 우드 & 샌드", colors: ["#451a03", "#d97706", "#fef3c7"], vibe: "핸드메이드 원목 수제품", tag: "가구/수공예", description: "클래식하고 아날로그적인 감성 브라운" },
    { id: "s9", name: "티타늄 메탈 & 일렉트릭 블루", colors: ["#0f172a", "#3b82f6", "#94a3b8"], vibe: "테크니컬 디지털 스마트기기", tag: "디지털/IT가전", description: "첨단 신뢰감과 기술력이 돋보이는 블루" },
    { id: "s10", name: "코랄 핑크 & 차콜 팝", colors: ["#334155", "#ff6b6b", "#f8fafc"], vibe: "디자이너 수제 굿즈", tag: "굿즈/아트", description: "차분한 쿨그레이에 코랄 팝 포인트" },
  ],
  "Medical": [
    { id: "m1", name: "대학병원 세린 블루 & 틸", colors: ["#0284c7", "#0d9488", "#f0f9ff"], vibe: "신뢰 높은 전문 의학 톤", tag: "종합병원/내과", description: "환자에게 깊은 안도감을 주는 의학 블루" },
    { id: "m2", name: "로즈 골드 & 에스테틱", colors: ["#fda4af", "#e11d48", "#fff1f2"], vibe: "프리미엄 성형 피부 뷰티", tag: "성형외과/피부과", description: "매끄럽고 고급스러운 피부 뷰티 톤" },
    { id: "m3", name: "에메랄드 케어 & 민트", colors: ["#059669", "#34d399", "#ecfdf5"], vibe: "편안한 힐링 치과 안과", tag: "치과/안과", description: "치료 두려움을 완화하는 자연 민트" },
    { id: "m4", name: "전통 한방 딥브라운 & 샌드", colors: ["#78350f", "#b45309", "#fef3c7"], vibe: "온화한 전통 한의원 힐링", tag: "한의원/한방병원", description: "자연 친화적이고 기운을 돋우는 한방 톤" },
    { id: "m5", name: "하이테크 시안 & 정밀 퓨처", colors: ["#06b6d4", "#0f172a", "#38bdf8"], vibe: "첨단 수술 정형 외과", tag: "정형외과/첨단수술", description: "최신 의료장비와 정밀 수술의 하이테크" },
    { id: "m6", name: "웜 옐로우 & 패밀리 케어", colors: ["#d97706", "#f59e0b", "#fffbeb"], vibe: "친근한 소아과 가정의학", tag: "소아과/가정의학", description: "아이와 부모가 함께 편안한 웜 톤" },
    { id: "m7", name: "시그니처 바이올렛 & 검진", colors: ["#7e22ce", "#a855f7", "#faf5ff"], vibe: "고급 줄기세포 건강검진", tag: "검진센터/안티에이징", description: "세련되고 권위 있는 시그니처 퍼플" },
    { id: "m8", name: "투명한 스카이 & 크리스탈", colors: ["#38bdf8", "#e0f2fe", "#ffffff"], vibe: "맑고 깨끗한 라식 검진", tag: "안과/시력교정", description: "맑고 또렷한 시야를 상징하는 라식 스카이" },
    { id: "m9", name: "딥 사파이어 & 도수 통증", colors: ["#1e3a8a", "#2563eb", "#eff6ff"], vibe: "해부학적 전문 도수 치료", tag: "재활/통증의학과", description: "체계적인 해부학 신뢰의 사파이어" },
    { id: "m10", name: "라벤더 밸런스 & 멘탈", colors: ["#6b21a8", "#c084fc", "#f3e8ff"], vibe: "마음 편한 멘탈케어 수면", tag: "신경정신/수면클리닉", description: "마음의 평온을 불러오는 은은한 라벤더" },
  ],
  "Corporate": [
    { id: "c1", name: "네이비 실버 & 사파이어", colors: ["#0f172a", "#1e40af", "#94a3b8"], vibe: "글로벌 B2B 대기업 신뢰", tag: "대기업/B2B", description: "전 세계적으로 검증된 정통 비즈니스" },
    { id: "c2", name: "네온 틸 & 실리콘 블랙", colors: ["#09090b", "#14b8a6", "#22d3ee"], vibe: "혁신 IT 스타트업 다크", tag: "IT/스타트업", description: "미래지향적이고 감각적인 딥 다크 테크" },
    { id: "c3", name: "포레스트 그린 & ESG", colors: ["#064e3b", "#047857", "#f0fdf4"], vibe: "지속가능 친환경 신재생", tag: "ESG/신재생에너지", description: "지속가능경영을 강조하는 신뢰 그린" },
    { id: "c4", name: "프라이빗 브론즈 & 골드", colors: ["#450a0a", "#b45309", "#78350f"], vibe: "프라이빗 금융 자산관리", tag: "금융/투투자산", description: "견고한 자산 수호와 프리미엄 골드" },
    { id: "c5", name: "쿨 그레이 & 블루 칩", colors: ["#1e293b", "#475569", "#e2e8f0"], vibe: "정교한 엔지니어링 제조", tag: "제조/건설/엔지니어링", description: "오차 없는 품질 보증 쿨그레이" },
    { id: "c6", name: "버건디 와인 & 경영 자문", colors: ["#881337", "#be123c", "#fff1f2"], vibe: "권위 있는 전문 컨설팅", tag: "회계/경영자문", description: "깊이 있는 지식과 인사이트 톤" },
    { id: "c7", name: "바이올렛 & AI 데이터", colors: ["#581c87", "#7c3aed", "#1e1b4b"], vibe: "차세대 AI 딥테크 기업", tag: "AI/데이터/클라우드", description: "지능형 알고리즘을 지칭하는 퍼플" },
    { id: "c8", name: "에너제틱 오렌지 & 물류", colors: ["#c2410c", "#ea580c", "#fff7ed"], vibe: "모빌리티 글로벌 물류", tag: "물류/해운/유통", description: "속도감과 강렬한 물류 커넥션" },
    { id: "c9", name: "인디고 & 스마트 오피스", colors: ["#312e81", "#4338ca", "#e0e7ff"], vibe: "스마트 업무 SaaS 솔루션", tag: "SaaS/소프트웨어", description: "스마트 워크 자동화를 대표하는 인디고" },
    { id: "c10", name: "샌드 스톤 & 에이전시", colors: ["#78716c", "#a8a29e", "#f5f5f4"], vibe: "감각적인 크리에이티브 집단", tag: "기획/에이전시", description: "감각적이고 미니멀한 디자인 하우스" },
  ],
  "Law": [
    { id: "l1", name: "정의의 딥 네이비 & 메이저 골드", colors: ["#020617", "#1e293b", "#d4af37"], vibe: "100% 승소 신뢰 메이저 로펌", tag: "로펌/변호사", description: "법률의 엄중함과 독보적 승소 신뢰감" },
    { id: "l2", name: "차콜 블랙 & 보르도 와인", colors: ["#18181b", "#881337", "#f43f5e"], vibe: "품격 있는 형사 이혼 전문", tag: "형사/이혼전문", description: "승부를 가르는 강인하고 명확한 톤" },
    { id: "l3", name: "포레스트 딥그린 & 브라스", colors: ["#064e3b", "#065f46", "#fef3c7"], vibe: "세무 회계법인 절세 전문", tag: "세무사/회계사", description: "성실과 정직한 절세를 상징하는 딥그린" },
    { id: "l4", name: "스마트 인디고 & IP 블루", colors: ["#1e1b4b", "#3730a3", "#e0e7ff"], vibe: "특허 지식재산권 변리사", tag: "변리사/IP", description: "기술 가치를 수호하는 지식 인디고" },
    { id: "l5", name: "미드나잇 차콜 & 머스터드", colors: ["#0f172a", "#d97706", "#fbbf24"], vibe: "노동 법무 인사 전문가", tag: "노무사/기업법무", description: "공정함과 명확한 솔루션의 머스터드" },
    { id: "l6", name: "사파이어 딥 & 실버 쉴드", colors: ["#1e3a8a", "#3b82f6", "#f8fafc"], vibe: "법무사 행정사 안심 등기", tag: "법무사/행정사", description: "등기 및 인허가 절차의 완벽한 보증" },
    { id: "l7", name: "로얄 셰도우 & 샴페인", colors: ["#111827", "#ca8a04", "#fef08a"], vibe: "기업 M&A 소송 자문", tag: "기업소송/M&A", description: "거대한 분쟁을 결단하는 로얄 골드" },
    { id: "l8", name: "웜 에스프레소 & 샌드", colors: ["#451a03", "#78350f", "#fef3c7"], vibe: "가사 상속 경청 법률", tag: "상속/가사전문", description: "의뢰인의 마음을 보듬는 따뜻한 톤" },
    { id: "l9", name: "쿨그레이 & 티타늄", colors: ["#334155", "#64748b", "#f1f5f9"], vibe: "손해사정 정확 산정", tag: "손해사정사", description: "객관적이고 명확한 손해 산정 티타늄" },
    { id: "l10", name: "포레스트 블랙 & 에메랄드", colors: ["#022c22", "#059669", "#ecfdf5"], vibe: "부동산 자산 수호 전문", tag: "부동산변호사", description: "부동산 자산 보호와 안정을 주는 톤" },
  ],
  "Education": [
    { id: "e1", name: "스마트 네이비 & 옐로우", colors: ["#1e3a8a", "#eab308", "#fef9c3"], vibe: "수능 입시 전문 명문 학원", tag: "입시/보습학원", description: "합격의 성취감과 고도의 몰입감" },
    { id: "e2", name: "소프트 스카이 & 파스텔 그린", colors: ["#0284c7", "#10b981", "#e0f2fe"], vibe: "유치원 어린이 영유 학원", tag: "유아/어린이", description: "밝고 안전한 파스텔 커뮤니케이션" },
    { id: "e3", name: "코딩 네온 & 다크 코딩", colors: ["#09090b", "#06b6d4", "#a855f7"], vibe: "IT 부트캠프 소프웨어", tag: "코딩/컴퓨터", description: "미래 개발자를 양성하는 네온 톤" },
    { id: "e4", name: "아카데믹 딥레드 & 아이보리", colors: ["#7f1d1d", "#991b1b", "#fef2f2"], vibe: "전통 어학원 토플 유학", tag: "어학원/유학", description: "학문의 깊이와 글로벌 감성의 딥레드" },
    { id: "e5", name: "버건디 & 아이비 골드", colors: ["#4c0519", "#881337", "#fef08a"], vibe: "국제학교 명문 유학원", tag: "국제학교/유학", description: "아이비리그 명문의 전통과 품격" },
    { id: "e6", name: "바이올렛 드림 & 코랄", colors: ["#6b21a8", "#ec4899", "#fdf2f8"], vibe: "예체능 미술 음악 무용", tag: "미술/음악/무용", description: "창의력과 예술적 영감을 부여하는 톤" },
    { id: "e7", name: "포레스트 그린 & 몰입", colors: ["#14532d", "#854d0e", "#fef3c7"], vibe: "스터디카페 프리미엄 독서실", tag: "스터디카페", description: "눈이 편안하고 고도의 집중력을 발휘" },
    { id: "e8", name: "오렌지 펄스 & 체대 입시", colors: ["#c2410c", "#0d9488", "#ffedd5"], vibe: "체대입시 스포츠 아카데미", tag: "체육/스포츠", description: "열정과 승부욕을 불러일으키는 톤" },
    { id: "e9", name: "샌드 오가닉 & 제과 바리스타", colors: ["#78350f", "#d97706", "#fffbeb"], vibe: "직업전문 요리 바리스타", tag: "직업전문/요리", description: "실용 기술과 따뜻한 노하우 전수" },
    { id: "e10", name: "쿨그레이 & 일렉트릭 블루", colors: ["#334155", "#2563eb", "#eff6ff"], vibe: "온라인 VOD 인강 클래스", tag: "인강/VOD플랫폼", description: "언제 어디서나 학습하는 디지털 가독성" },
  ],
  "General": [
    { id: "g1", name: "모던 딥 블루 & 시안 액센트", colors: ["#0f172a", "#0284c7", "#38bdf8"], vibe: "가장 인기 있는 모던 비즈니스", tag: "기본 범용 추천", description: "모든 업종에 무난하고 완성도 높은 블루" },
    { id: "g2", name: "럭셔리 딥 차콜 & 샴페인 골드", colors: ["#18181b", "#d4af37", "#fef08a"], vibe: "고급스러운 럭셔리 다크 톤", tag: "고급 브랜드", description: "시선을 사로잡는 프리미엄 명품 브랜드 톤" },
    { id: "g3", name: "내추럴 에메랄드 & 샌드", colors: ["#065f46", "#10b981", "#f0fdf4"], vibe: "자연 친화적이고 눈이 편안한 톤", tag: "친환경/라이프", description: "신선함과 신뢰를 선사하는 생태계 그린" },
    { id: "g4", name: "크리스탈 클린 화이트 & 쿨 그레이", colors: ["#ffffff", "#64748b", "#0f172a"], vibe: "미니멀리즘 산뜻한 백그라운드", tag: "심플 미니멀", description: "깔끔하고 또렷한 글자 가독성 중심" },
    { id: "g5", name: "네온 퍼플 & 사이버 미드나잇", colors: ["#020617", "#7c3aed", "#e879f9"], vibe: "감각적인 최신 웹 3.0 트렌드", tag: "트렌디/미디어", description: "젊은 세대를 사로잡는 보라빛 트렌디 톤" },
    { id: "g6", name: "웜 버건디 & 로즈 페탈", colors: ["#881337", "#f43f5e", "#fff1f2"], vibe: "따뜻하고 우아한 감성 톤", tag: "감성/라이프", description: "마음을 여는 따스한 로즈 보르도 레어 톤" },
    { id: "g7", name: "에너제틱 오렌지 & 딥 스카이", colors: ["#ea580c", "#0284c7", "#ffedd5"], vibe: "생동감 넘치는 비즈니스 스파크", tag: "활력/서비스", description: "고객 유입과 구매 전환율을 극대화" },
    { id: "g8", name: "클래식 우드 & 코지 베이지", colors: ["#451a03", "#b45309", "#fef3c7"], vibe: "아늑하고 포근한 가구/카페 톤", tag: "아날로그/코지", description: "오랜 전통과 안정감을 전달하는 우드" },
    { id: "g9", name: "티타늄 쿨 메탈 & 틸", colors: ["#1e293b", "#0d9488", "#ccfbf1"], vibe: "차갑고 날카로운 엔지니어링", tag: "기술/제조", description: "오차 없는 품질 보증 테크" },
    { id: "g10", name: "파스텔 옐로우 & 소프트 바이올렛", colors: ["#fef08a", "#a855f7", "#faf5ff"], vibe: "친근하고 밝은 소통 톤", tag: "커뮤니티/모임", description: "경계심을 풀고 친근함을 전하는 유채색" },
  ],
};

export const getDesignPresetsForCategory = (catName: string): DesignPreset[] => {
  const c = (catName || "").toLowerCase();
  if (c.includes("shopping") || c.includes("store") || c.includes("외식") || c.includes("패션") || c.includes("뷰티")) {
    return INDUSTRY_DESIGN_PRESETS["Shopping"];
  }
  if (c.includes("health") || c.includes("medical") || c.includes("병원") || c.includes("의원")) {
    return INDUSTRY_DESIGN_PRESETS["Medical"];
  }
  if (c.includes("business") || c.includes("corporate") || c.includes("기획") || c.includes("렌탈") || c.includes("행사")) {
    return INDUSTRY_DESIGN_PRESETS["Corporate"];
  }
  if (c.includes("law") || c.includes("real estate") || c.includes("법무") || c.includes("세무") || c.includes("전문직")) {
    return INDUSTRY_DESIGN_PRESETS["Law"];
  }
  if (c.includes("education") || c.includes("교육") || c.includes("학원")) {
    return INDUSTRY_DESIGN_PRESETS["Education"];
  }
  return INDUSTRY_DESIGN_PRESETS["General"];
};

// --- Template Items Definition ---
export interface CustomTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  previewUrl: string;
  thumbnailUrl: string | null;       // R2 CDN: creaibox-assets/templates/{id}/thumbnail.webp (9:16, WebP)
  badge: string;
  accentColor: string;
  bgGradient: string;
  deployCount: number;
}

// R2 CDN Base URL for template thumbnails
export const TEMPLATE_THUMBNAIL_CDN = process.env.NEXT_PUBLIC_R2_CDN_URL
  ? `${process.env.NEXT_PUBLIC_R2_CDN_URL}/templates`
  : null;

/** Helper: build full thumbnail URL for a template ID */
export function getTemplateThumbnailUrl(templateId: string): string | null {
  if (!TEMPLATE_THUMBNAIL_CDN) return null;
  return `${TEMPLATE_THUMBNAIL_CDN}/${templateId}/thumbnail.webp`;
}

export const CUSTOM_TEMPLATES: CustomTemplate[] = [
  {
    id: "sotongcheum",
    name: "스마트 비즈니스 (Smart Business Hub) V1",
    category: "Business",
    description: "공공기관 및 기업 행사 대행, 조직 교육, 소통/힐링 프로그램 및 렌탈 운영 전문 프리미엄 커스텀 홈페이지",
    features: ["실적 갤러리 탭", "온라인 견적신청 폼", "전용 블로그 엔진", "DoFollow SEO 백링크", "3종 디바이스 뷰포트", "1초 자동 구축 지원"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: getTemplateThumbnailUrl("sotongcheum"),
    badge: "BEST 템플릿",
    accentColor: "from-blue-600 to-indigo-600",
    bgGradient: "from-blue-950/40 via-slate-900 to-indigo-950/40",
    deployCount: 142,
  },
  {
    id: "commufill",
    name: "커뮤필 (Commufill) V1",
    category: "Community & Non-Profit",
    description: "지역 모임, 비영리 단체, 동호회 및 협동조합 소통 활성화를 위한 맞춤 커스텀 홈페이지",
    features: ["모임 라이브러리", "멤버십 안내", "실시간 소통 폼", "전용 블로그 탭", "DoFollow SEO 엔진", "반응형 멀티 디바이스"],
    previewUrl: "http://commufill.localhost:3000",
    thumbnailUrl: getTemplateThumbnailUrl("commufill"),
    badge: "인기 템플릿",
    accentColor: "from-indigo-600 to-purple-600",
    bgGradient: "from-indigo-950/40 via-slate-900 to-purple-950/40",
    deployCount: 98,
  },
  {
    id: "creative-media-blog",
    name: "크리에이티브 미디어 블로그 V1",
    category: "Blog",
    description: "IT, 테크, 마케팅 전문 미디어 브랜드 및 트렌드 뉴스레터 중심의 포털 커스텀 블로그",
    features: ["카테고리 아카이브", "뉴스레터 구독 폼", "인기글 랭킹", "전용 블로그 엔진", "DoFollow SEO 백링크", "실시간 읽기 모달 팝업"],
    previewUrl: "http://creative-media-blog.localhost:3000",
    thumbnailUrl: getTemplateThumbnailUrl("creative-media-blog"),
    badge: "추천 템플릿",
    accentColor: "from-cyan-600 to-blue-600",
    bgGradient: "from-cyan-950/40 via-slate-900 to-blue-950/40",
    deployCount: 88,
  },
  {
    id: "aura-portfolio",
    name: "스튜디오 아우라 포트폴리오 V1",
    category: "Portfolio",
    description: "디자이너, 포토그래퍼, 크리에이터 전용 풀스크린 포트폴리오 및 프로젝트 쇼케이스",
    features: ["작품 풀스크린 갤러리", "프로젝트 모달", "외주 문의 폼", "전용 블로그 탭", "DoFollow SEO 백링크", "3종 디바이스 지원"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 템플릿 완성 시 getTemplateThumbnailUrl("aura-portfolio")로 변경
    badge: "크리에이티브",
    accentColor: "from-violet-600 to-purple-600",
    bgGradient: "from-violet-950/40 via-slate-900 to-purple-950/40",
    deployCount: 75,
  },
  {
    id: "next-commerce",
    name: "넥스트 럭셔리 스토어 V1",
    category: "Store",
    description: "프리미엄 굿즈, 브랜드 셀렉트숍 및 라이프스타일 브랜드 전용 커스텀 쇼룸",
    features: ["상품 쇼케이스", "카테고리 필터", "구매 문의 폼", "브랜드 스토리", "전용 블로그 엔진", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 템플릿 완성 시 변경
    badge: "프리미엄",
    accentColor: "from-amber-600 to-yellow-600",
    bgGradient: "from-amber-950/40 via-slate-900 to-yellow-950/40",
    deployCount: 110,
  },
  {
    id: "art-gallery",
    name: "갤러리 아트앤디자인 V1",
    category: "Art & Design",
    description: "전시회, 미술관, 갤러리 및 디자인 에이전시 전용 전시 가이드 & 비주얼 포털",
    features: ["전시 일정 캘린더", "작가 프로필", "작품 도록", "티켓 예약 폼", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "감성 아트",
    accentColor: "from-rose-600 to-pink-600",
    bgGradient: "from-rose-950/40 via-slate-900 to-pink-950/40",
    deployCount: 62,
  },
  {
    id: "prime-realestate",
    name: "스마트 프라임 부동산 V1",
    category: "Real Estate",
    description: "상가, 분양, 신축 빌라 및 프라이빗 매물 정보 전용 커스텀 부동산 사이트",
    features: ["매물 검색 필터", "상세 지도 매핑", "매물 상담 폼", "시세 인사이트", "전용 블로그 탭", "DoFollow SEO 백링크"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "신뢰 100%",
    accentColor: "from-slate-600 to-zinc-700",
    bgGradient: "from-slate-900 via-zinc-900 to-stone-900",
    deployCount: 54,
  },
  {
    id: "chaeum-wellness",
    name: "더채움 웰니스 메디컬 V1",
    category: "Health & Wellness",
    description: "피부과, 한의원, 피트니스 및 힐링 센터 전용 맞춤 커스텀 케어 사이트",
    features: ["의료진/강사 프로필", "진료/운동 카테고리", "1:1 상담 예약", "전용 블로그 엔진", "DoFollow SEO", "반응형 뷰포트"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "웰니스 추천",
    accentColor: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-950/40 via-slate-900 to-teal-950/40",
    deployCount: 92,
  },
  {
    id: "eduplus-academy",
    name: "에듀플러스 아카데미 V1",
    category: "Education",
    description: "입시 학원, 어학원, AI/SW 코딩 아카데미 및 수강생 관리 커스텀 교육 사이트",
    features: ["커리큘럼 안내", "강사진 프로필", "입학 상담 신청", "수강 후기", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "교육 전문",
    accentColor: "from-blue-600 to-cyan-600",
    bgGradient: "from-blue-950/40 via-slate-900 to-cyan-950/40",
    deployCount: 81,
  },
  {
    id: "trend-magazine",
    name: "더 트렌드 매거진 V1",
    category: "Magazine",
    description: "패션, 라이프스타일, 컬처 종합 매거진 및 웹진 형태의 고품격 미디어 사이트",
    features: ["헤드라인 그리드", "트렌드 이슈", "동영상 커버", "전용 매거진 블로그", "DoFollow SEO 백링크", "3종 디바이스 스위처"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "트렌디",
    accentColor: "from-purple-600 to-pink-600",
    bgGradient: "from-purple-950/40 via-slate-900 to-pink-950/40",
    deployCount: 68,
  },
  {
    id: "soundwave-music",
    name: "사운드웨이브 뮤직 V1",
    category: "Music",
    description: "음반 기획사, 아티스트, SUNO/AI 뮤직 플레이어 연동 음악 전용 커스텀 포털",
    features: ["음원 스트리밍 플레이어", "앨범 디스코그래피", "공연 일정", "팬 방명록", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "AI 뮤직",
    accentColor: "from-rose-600 to-orange-600",
    bgGradient: "from-rose-950/40 via-slate-900 to-orange-950/40",
    deployCount: 71,
  },
  {
    id: "aura-finedining",
    name: "아우라 파인다이닝 V1",
    category: "Restaurant",
    description: "파인다이닝, 프라이빗 레스토랑, 베이커리 카페 전용 시그니처 커스텀 웹사이트",
    features: ["시그니처 코스 메뉴판", "테이블 예약 폼", "매장 오시는길", "인스타그램 피드", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "핫플레이스",
    accentColor: "from-yellow-600 to-amber-600",
    bgGradient: "from-yellow-950/40 via-slate-900 to-amber-950/40",
    deployCount: 59,
  },
  {
    id: "travel-stay",
    name: "트래블 힐링 스테이 V1",
    category: "Travel & Lifestyle",
    description: "감성 펜션, 리조트, 공간 대여 및 해외 투어 전문 여행 라이프스타일 사이트",
    features: ["객실/투어 상품", "실시간 예약 문의", "주변 관광 가이드", "방문 후기", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "힐링 여행",
    accentColor: "from-teal-600 to-emerald-600",
    bgGradient: "from-teal-950/40 via-slate-900 to-emerald-950/40",
    deployCount: 84,
  },
  {
    id: "fashion-beauty-lookbook",
    name: "더채움 뷰티 & 룩북 V1",
    category: "Fashion & Beauty",
    description: "패션 브랜드 룩북, 뷰티 에스테틱 및 헤어샵 전용 감성 뷰티 포털",
    features: ["시술/스타일 룩북", "1:1 예약 상담", "리뷰 카러셀", "전용 블로그 탭", "DoFollow SEO 엔진", "3종 디바이스 최적화"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "스타일리시",
    accentColor: "from-fuchsia-600 to-pink-600",
    bgGradient: "from-fuchsia-950/40 via-slate-900 to-pink-950/40",
    deployCount: 79,
  },
  {
    id: "starlight-ent",
    name: "스타라이트 엔터테인먼트 V1",
    category: "Entertainment",
    description: "연예 기획사, 캐스팅 에이전시, 버스킹 및 공연 대행 전문 엔터테인먼트 포털",
    features: ["아티스트 라인업", "오디션/캐스팅 신청", "공연 영상 갤러리", "언론 보도", "전용 블로그 탭", "DoFollow SEO 백링크"],
    previewUrl: "http://sotongcheum.localhost:3000",
    thumbnailUrl: null, // 실제 사이트 미구축 — 향후 변경
    badge: "엔터 전문",
    accentColor: "from-indigo-600 to-blue-600",
    bgGradient: "from-indigo-950/40 via-slate-900 to-blue-950/40",
    deployCount: 66,
  },
  {
    id: "aura-merino",
    name: "아우라 메리노 (Aura Merino) 스니커즈 쇼핑몰 V1",
    category: "Shopping",
    description: "100% 천연 메리노 울 & 캐시미어 수제 스니커즈 전문 이커머스 스토어 (Aura Merino 시그니처 템플릿)",
    features: ["메리노 울 상품 6종 그리드", "Quick View 팝업 모달", "신발 사이즈 선택기", "장바구니 드로어 & 결제", "DoFollow SEO 전용 블로그", "1초 원클릭 마이크로 배포"],
    previewUrl: "https://auramerino.creaibox.com",
    thumbnailUrl: getTemplateThumbnailUrl("aura-merino"),
    badge: "🔥 1위 쇼핑몰",
    accentColor: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-950/40 via-slate-900 to-teal-950/40",
    deployCount: 189,
  },
];
