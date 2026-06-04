export const IMAGE_BUCKET = "generated-images";
export const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image";

export const SESSION_TIMEOUT_MS = 4000;
export const AUTH_RETRY_DELAY_MS = 700;
export const AUTH_RETRY_ATTEMPTS = 3;

export const modelOptions = [
  { label: "⭐ OpenAI", value: "openai" },
  { label: "⭐ Gemini Nano Banana - 2.5 Flash", value: "gemini-2.5-flash-image" },
  { label: "⭐ Gemini Nano Banana2 - 3.1 Flash", value: "gemini-3.1-flash-image-preview" },
  { label: "⭐ Gemini Nano Banana Pro - 3 Pro image", value: "gemini-3-pro-image-preview" },
  { label: "⭐ Imagen 4 - Gemini imagen-4", value: "imagen-4.0-generate-001" },
];

export const styleOptions = [
  {
    label: "⭐ 하이퍼 리얼리즘 실사",
    value: "hyper-realistic-photo",
    details: ["⭐ 인물 실사", "⭐ 제품 사진", "⭐ 블로그 썸네일", "⭐ 시네마틱 실사"],
  },
  {
    label: "⭐ 애니메이션",
    value: "anime",
    details: ["⭐ 재패니즈 애니", "⭐ 웹툰 스타일", "⭐ 픽사풍 3D", "⭐ 사이버펑크 애니"],
  },
  {
    label: "⭐ 네이버 블로그용 일러스트",
    value: "naver-blog-vector",
    details: [
      "⭐ 미니멀 벡터",
      "⭐ 파스텔톤",
      "⭐ 정보성 비주얼",
      "⭐ 아이콘 중심",
      "⭐ 뉴스 분석형",
      "⭐ 주식 차트형",
      "⭐ 제품 리뷰형",
      "⭐ 가이드/방법론형",
      "⭐ 비교 분석형",
      "⭐ 체크리스트형",
      "⭐ 트렌드 리포트형",
    ],
  },
  {
    label: "⭐ 웅장한 3D 입체 팝아트",
    value: "cinematic-3d-pop",
    details: ["3D 팝아트", "제품 광고 3D", "시네마틱 3D", "고급 렌더링"],
  },
];

export const aspectRatioOptions = [
  { value: "4:3", label: "⭐ 4:3 일반 웹, 블로그 이미지" },
  { value: "3:2", label: "⭐ 3:2 네이버 블로그 썸네일" },
  { value: "16:9", label: "⭐ 16:9 유튜브 썸네일" },
  { value: "1:1", label: "⭐ 1:1 SNS 게시물" },
  { value: "4:5", label: "⭐ 4:5 인스타그램 피드" },
  { value: "9:16", label: "⭐ 9:16 쇼츠 / 릴스 / 틱톡" },
  { value: "5:4", label: "⭐ 5:4 기사 / 블로그 대표 이미지" },
  { value: "3:4", label: "⭐ 3:4 카드뉴스" },
  { value: "2:3", label: "⭐ 2:3 포스터" },
  { value: "21:9", label: "⭐ 21:9 시네마틱 와이드" },
];

export const thumbnailTypeOptions = [
  { label: "① 인사이트 & 트렌드", value: "group-insight", disabled: true },
  { label: "⭐ AI 인사이트 포스팅", value: "ai-insight-posting" },
  { label: "⭐ 트렌드 브리프", value: "trend-brief" },
  { label: "⭐ 시장/기술 분석 리포트", value: "market-tech-analysis" },
  { label: "⭐ 최신 뉴스 및 이슈", value: "latest-news-issue" },
  { label: "⭐ 오늘의 주요 이슈 정리", value: "today-issue-summary" },

  { label: "② 정보성 콘텐츠", value: "group-informational", disabled: true },
  { label: "⭐ 일반 정보성", value: "general-informational" },
  { label: "⭐ 생활 정책 및 정부 지원금", value: "policy-subsidy" },
  { label: "⭐ 건강 정보 및 영양제 분석", value: "health-supplement-analysis" },
  { label: "⭐ 보험/대출/카드 정보", value: "insurance-loan-card" },
  { label: "⭐ 부동산 정보", value: "real-estate-info" },

  { label: "③ 금융 & 비즈니스", value: "group-finance-business", disabled: true },
  { label: "⭐ 금융 및 재테크", value: "finance-investment" },
  { label: "⭐ 주식/재테크 분석", value: "stock-finance-analysis" },
  { label: "⭐ 기업 정보 및 주식 정보", value: "company-stock-info" },
  { label: "⭐ 비즈니스/창업 정보", value: "business-startup-info" },

  { label: "④ 브랜드 & 퍼블리싱", value: "group-brand", disabled: true },
  { label: "⭐ 브랜드 스토리 포스팅", value: "brand-story-posting" },
  { label: "⭐ 서비스 소개형 포스팅", value: "service-intro-posting" },
  { label: "⭐ 기업 소개 및 서비스 안내", value: "company-service-guide" },
  { label: "⭐ 뉴스레터형 콘텐츠", value: "newsletter-content" },

  { label: "⑤ 도구 & 사용법", value: "group-tools-guide", disabled: true },
  { label: "⭐ 앱 설치 및 상세 가이드", value: "app-install-guide" },
  { label: "⭐ AI 툴 및 웹 서비스 가이드", value: "ai-tool-web-service-guide" },
  { label: "⭐ 유틸리티 설치/사용 방법", value: "utility-how-to" },
  { label: "⭐ AI 자동 포스팅", value: "ai-auto-posting" },
  { label: "⭐ 바로가기 버튼 생성", value: "shortcut-button-generation" },

  { label: "⑥ 실무형 가이드", value: "group-practical-guide", disabled: true },
  { label: "⭐ 실전 가이드 아티클", value: "practical-guide-article" },
  { label: "⭐ SEO 최적화 포스팅", value: "seo-optimized-posting" },
  { label: "⭐ 튜토리얼 & 워크플로우", value: "tutorial-workflow" },
  { label: "⭐ 체크리스트형 콘텐츠", value: "checklist-content" },
  { label: "⭐ 비교 분석형 콘텐츠", value: "comparison-analysis" },
  { label: "⭐ 문제 해결형 콘텐츠", value: "problem-solving-content" },

  { label: "⑦ 리뷰 & 라이프스타일", value: "group-review-lifestyle", disabled: true },
  { label: "⭐ 일반 제품 리뷰", value: "general-product-review" },
  { label: "⭐ 제품 비교 리뷰", value: "product-comparison-review" },
  { label: "⭐ IT 기기 사용 후기", value: "it-device-review" },
  { label: "⭐ 자동차 모델 리뷰", value: "car-model-review" },
  { label: "⭐ 게임 리뷰 및 공략", value: "game-review-guide" },
  { label: "⭐ 맛집 리뷰", value: "restaurant-review" },
  { label: "⭐ 국내 여행 정보", value: "domestic-travel-info" },
  { label: "⭐ 영화/드라마 정보 및 리뷰", value: "movie-drama-review" },
  { label: "⭐ 유명 연예인 인물 정보", value: "celebrity-profile" },

  { label: "⑧ 교육 & 자기계발", value: "group-education", disabled: true },
  { label: "⭐ 교육/가이드형", value: "education-guide" },
  { label: "⭐ 자기계발 포스팅", value: "self-improvement-posting" },
  { label: "⭐ 공부법/학습법", value: "study-method" },
  { label: "⭐ 강의/커리큘럼 소개", value: "course-curriculum-intro" },
];

export const textIntensityOptions = [
  { label: "⭐ 텍스트 없음", value: "none" },
  { label: "⭐ 제목만 크게", value: "title-only" },
  { label: "⭐ 제목 + 핵심 포인트", value: "title-points" },
  { label: "⭐ 제목 + 핵심 포인트 + 데이터 박스", value: "title-points-data" },
];

export const layoutOptions = [
  { label: "⭐ 좌측 제목 / 우측 비주얼", value: "left-title-right-visual" },
  { label: "⭐ 상단 제목 / 하단 포인트 박스", value: "top-title-bottom-boxes" },
  { label: "⭐ 중앙 대형 제목", value: "center-big-title" },
  { label: "⭐ 카드 3~4개 인포그래픽", value: "card-infographic" },
  { label: "⭐ 차트 강조형", value: "chart-focused" },
];

export const colorToneOptions = [
  { label: "⭐ 블루/옐로우 뉴스형", value: "blue-yellow-news" },
  { label: "⭐ 네온 테크", value: "neon-tech" },
  { label: "⭐ 다크 프리미엄", value: "dark-premium" },
  { label: "⭐ 화이트 클린", value: "white-clean" },
  { label: "⭐ 파스텔 블로그형", value: "pastel-blog" },
];

export const textLanguageOptions = [
  { label: "⭐ 텍스트 최소화", value: "minimal" },
  { label: "⭐ 한국어", value: "ko" },
  { label: "⭐ 영어", value: "en" },
  { label: "⭐ 일본어", value: "ja" },
  { label: "⭐ 중국어 (간체)", value: "zh-CN" },
  { label: "⭐ 중국어 (번체)", value: "zh-TW" },
  { label: "⭐ 스페인어", value: "es" },
  { label: "⭐ 프랑스어", value: "fr" },
  { label: "⭐ 독일어", value: "de" },
  { label: "⭐ 포르투갈어", value: "pt" },
  { label: "⭐ 이탈리아어", value: "it" },
  { label: "⭐ 러시아어", value: "ru" },
  { label: "⭐ 아랍어", value: "ar" },
  { label: "⭐ 힌디어", value: "hi" },
];

export const promptTemplates: Record<string, { categoryLabel: string; items: string[] }> = {
  tech: {
    categoryLabel: "💻 IT / 테크",
    items: [
      "네온 블루 조명이 흐르는 미래형 인공지능 로봇",
      "어두운 방안에서 노트북 화면을 보며 열광하는 개발자",
      "3D 메타버스 그래픽이 팝업으로 뿜어져 나오는 비주얼",
      "데이터 센터 내부의 서버 랙과 에메랄드빛 LED 라인",
      "스마트워치 화면에서 실시간 주식 차트가 투사되는 모습",
      "VR 기기를 착용하고 데이터를 조작하는 인물",
      "양자 컴퓨터 코어 내부의 테크니컬 아트",
      "전 세계 지도를 연결하는 클라우드 네트워크망",
      "블랙 데스크 위의 맥북, 키보드 데스크테리어",
      "AI 음성 인식 인터페이스의 부드러운 파동",
    ],
  },
  food: {
    categoryLabel: "🍕 맛집 / 요리",
    items: [
      "치즈가 폭포처럼 늘어나는 화덕 피자 실사",
      "육즙 가득한 미디엄 레어 스테이크 미식 탑뷰",
      "제주도 바다 배경의 정갈한 참돔 회 세팅",
      "루프탑 카페의 햇살 가득한 아이스 아메리카노",
      "무쇠 냄비에서 끓고 있는 매콤한 국물 떡볶이",
      "돈코츠 국물과 차슈가 어우러진 일본 라멘",
      "셰프의 칼날 옆 신선한 연어와 아보카도",
      "철판에서 노릇하게 익어가는 삼겹살과 김치",
      "말차 크림이 흘러내리는 3단 수플레 팬케이크",
      "웅장한 항공샷으로 담은 전통 한정식 상차림",
    ],
  },
  finance: {
    categoryLabel: "💵 금융 / 재테크",
    items: [
      "비트코인 주화와 우상향 주식 차트 연출",
      "디지털 캔들 차트의 폭발적인 상승 곡선",
      "지갑 안의 새 5만원권 지폐 다발",
      "만년필과 함께 놓인 자산 포트폴리오 리포트",
      "글로벌 통화 기호들이 떠다니는 홀로그램",
      "금화가 나무 열매처럼 열린 복리 이자 형상화",
      "금융 앱을 보며 미소 짓는 자신감 넘치는 인물",
      "동전이 황금 모래로 변하는 저금통 마법 뷰",
      "실시간 환율 데이터가 구동되는 트레이더 룸",
      "대리석 위의 주택 청약 통장과 신축 키",
    ],
  },
  travel: {
    categoryLabel: "✈️ 여행 / 레저",
    items: [
      "몰디브 바다 위 수상 방갈로 힐링 뷰",
      "에펠탑 배경의 여행 크리에이터 스냅",
      "스위스 알프스 설산을 지나는 붉은 기차 드론샷",
      "우붓 정글이 보이는 인피니티 풀의 아침",
      "은하수 아래 모닥불 타오르는 감성 캠핑",
      "교토 대나무 숲을 기모노 입고 걷는 뒷모습",
      "그랜드 캐니언 절벽 끝 모험가의 구도",
      "밤하늘 초록 오로라와 작은 텐트 한 동",
      "뉴욕 타임스퀘어를 활보하는 포토그래퍼",
      "방콕 야시장의 화려한 네온사인과 툭툭이",
    ],
  },
  beauty: {
    categoryLabel: "💄 뷰티 / 패션",
    items: [
      "대리석 위 스포이드 파운데이션 클로즈업",
      "오버핏 가죽 자켓을 입은 패션 모델",
      "장미 꽃잎이 수놓아진 천연 오가닉 향수",
      "시크한 매트 블랙 립스틱과 골드 케이스",
      "섀도우를 바르는 모델의 보석 같은 눈동자",
      "화이트 파우더가 날리는 감성 스튜디오 뷰",
      "코트와 선글라스를 매칭한 시티 가이 스트릿",
      "홀로그램 네일과 크리스탈 보틀 손 스냅",
      "비건 수분 크림과 물방울 맺힌 나뭇잎",
      "런웨이 무대 위 화려한 모델 실루엣",
    ],
  },
  biz: {
    categoryLabel: "📈 마케팅 / 비즈",
    items: [
      "포스트잇이 가득한 스타트업 회의실",
      "마케팅 깔대기 그래프와 전환율 지표 분석",
      "정장을 입은 두 대표의 신뢰감 넘치는 악수",
      "카페 창가 노트북과 1인 기업가의 손",
      "대형 LED 화면 앞 열정적인 프레젠테이션",
      "천안 테크노파크 인프라가 보이는 공유 오피스",
      "아이패드로 광고 시안을 그리는 디자이너",
      "SUCCESS 문구를 적는 만년필 클로즈업",
      "세련된 타이포와 CEO 인물 프로필 사진",
      "유기적으로 맞물려 돌아가는 체인 기어 협업",
    ],
  },
  edu: {
    categoryLabel: "📚 교육 / 자기계발",
    items: [
      "은은한 조명 아래 책이 가득한 서재",
      "새벽 4시 독서실 스탠드 아래 전공 서적",
      "하늘 위로 던져지는 졸업 학사모 순간",
      "영어 단어와 수학 공식 홀로그램 입자",
      "온라인 명사 특강 강의를 듣는 학생 시선",
      "정교한 물리 방정식을 쓰는 교수님의 칠판",
      "다이어리 첫 페이지 2026년 버킷리스트",
      "산 정상에서 태양을 마주한 자기계발 러너",
      "도서관 창틀 사이 아침 햇살과 백과사전",
      "부모와 아이가 함께 조립하는 우주 교구",
    ],
  },
  health: {
    categoryLabel: "🏋️ 건강 / 운동",
    items: [
      "필라테스 기구 위 유연한 스트레칭 실루엣",
      "땀방울 흘리며 바벨을 드는 피트니스 컷",
      "닭가슴살 샐러드와 단백질 쉐이크 식단",
      "강변을 따라 질주하는 러너의 다리 근육",
      "숲속 요가 매트 위 차분한 명상 힐링",
      "실내 수영장을 가르는 역동적인 접영 물보라",
      "스마트워치 1만보 달성 축하 메달 팝업",
      "요가 매트와 폼롤러 홈트레이닝 정물",
      "가파른 산악 도로를 코너링하는 사이클 선수",
      "믹서기 안에서 갈려나가는 초록 건강 주스",
    ],
  },
  estate: {
    categoryLabel: "🏠 부동산 / 인테리어",
    items: [
      "통유리창 시티뷰 펜트하우스 화이트 거실",
      "분수대가 흐르는 신축 아파트 단지 조감도",
      "북유럽풍 미니멀 주방과 아일랜드 식탁",
      "도면 청사진 위 주택 입체 미니어처 모형",
      "벽난로 장작불 앞 두꺼운 러그와 안락의자",
      "세련된 철제 계단의 복층 오피스텔 내부",
      "호텔식 새하얀 구스 이불 마스터 침실",
      "석양을 받아 반짝이는 강남 빌딩 외관",
      "개인 정원과 수영장이 연결된 타운하우스",
      "입주 축하 꽃바구니와 골드 도어락 열쇠",
    ],
  },
  culture: {
    categoryLabel: "🎬 문화 / 예술 / 취미",
    items: [
      "레이저 조명 속 일렉 기타를 멘 록 보컬",
      "영화관 어둠 속 팝콘과 몰입한 관객들",
      "캔버스 유화 질감을 그리는 작가의 붓",
      "LP 판이 회전하는 레트로 LP 바 인테리어",
      "건반 위 조명이 반사되는 피아노 연주자",
      "뮤지컬 무대 드레스를 입은 여배우 솔로",
      "신티크 위 웹툰 캐릭터 드로잉 과정",
      "가죽 지갑 구멍을 뚫는 공방 장인의 손길",
      "물레 위에서 빚어지는 도자기 호리병",
      "미술품 전시 액자와 사색하는 관람객",
    ],
  },
};