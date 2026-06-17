import type {
  IdeaHubTopicCategory,
  IdeaHubSubTopic,
} from "./types";

// ======================================================
// Main Categories
// ======================================================

export const topicCategories: IdeaHubTopicCategory[] = [
  // ======================================================
  // 1. 기술 & 디지털 (Tech & Digital)
  // ======================================================
  {
    id: "ai-tech",
    group: "기술 & 디지털",
    name: "AI & 기술(AI & Tech)",
    emoji: "🤖",
    description: "인공지능, 생성형 AI, 자동화, AI 비즈니스",
    subTopicCount: 15,
    ideaCount: 1500,
    featured: true,
  },
  {
    id: "it-digital",
    group: "기술 & 디지털",
    name: "IT & 디지털(IT & Digital)",
    emoji: "💻",
    description: "IT 기기, 앱, 소프트웨어, 디지털 서비스",
    subTopicCount: 15,
    ideaCount: 1200,
    featured: true,
  },
  {
    id: "crypto-blockchain",
    group: "기술 & 디지털",
    name: "가상자산 & 블록체인(Crypto & Blockchain)",
    emoji: "₿",
    description: "비트코인, 이더리움, Web3, NFT",
    subTopicCount: 20,
    ideaCount: 1800,
    featured: true,
  },
  {
    id: "cyber-security",
    group: "기술 & 디지털",
    name: "사이버보안(Cyber Security)",
    emoji: "🛡️",
    description: "보안, 해킹, 개인정보보호",
    subTopicCount: 12,
    ideaCount: 600,
  },
  {
    id: "data-analytics",
    group: "기술 & 디지털",
    name: "데이터 & 분석(Data & Analytics)",
    emoji: "📊",
    description: "데이터 분석, BI, 통계, 시각화",
    subTopicCount: 12,
    ideaCount: 700,
  },

  // ======================================================
  // 2. 경제 & 비즈니스 (Economy & Business)
  // ======================================================
  {
    id: "economy-finance",
    group: "경제 & 비즈니스",
    name: "경제 & 금융(Economy & Finance)",
    emoji: "💰",
    description: "경제, 투자, 금융, 재테크",
    subTopicCount: 16,
    ideaCount: 1500,
    featured: true,
  },
  {
    id: "business",
    group: "경제 & 비즈니스",
    name: "비즈니스 & 창업(Business & Startup)",
    emoji: "📈",
    description: "창업, SaaS, 마케팅, 브랜딩",
    subTopicCount: 12,
    ideaCount: 1200,
  },
  {
    id: "career",
    group: "경제 & 비즈니스",
    name: "취업 & 커리어(Career)",
    emoji: "💼",
    description: "취업, 이직, 면접, 커리어",
    subTopicCount: 10,
    ideaCount: 700,
  },
  {
    id: "company-brand",
    group: "경제 & 비즈니스",
    name: "기업 & 브랜드(Company & Brand)",
    emoji: "🏢",
    description: "기업 분석, 브랜드 분석",
    subTopicCount: 10,
    ideaCount: 800,
  },
  {
    id: "shopping",
    group: "경제 & 비즈니스",
    name: "제품 & 쇼핑(Shopping)",
    emoji: "🛒",
    description: "구매 가이드, 제품 리뷰",
    subTopicCount: 12,
    ideaCount: 1000,
  },
  {
    id: "real-estate",
    group: "경제 & 비즈니스",
    name: "부동산(Real Estate)",
    emoji: "🏠",
    description: "청약, 아파트, 부동산 투자",
    subTopicCount: 12,
    ideaCount: 1300,
  },
  {
    id: "startup-venture",
    group: "경제 & 비즈니스",
    name: "스타트업 & 벤처(Startup & Venture)",
    emoji: "🚀",
    description: "스타트업 트렌드, 피치덱, 투자 유치 전략",
    subTopicCount: 10,
    ideaCount: 200,
  },

  // ======================================================
  // 3. 생활 & 문화 (Life & Culture)
  // ======================================================
  {
    id: "car",
    group: "생활 & 문화",
    name: "자동차(Car)",
    emoji: "🚗",
    description: "자동차, 전기차, 수입차, 중고차",
    subTopicCount: 15,
    ideaCount: 1500,
  },
  {
    id: "travel",
    group: "생활 & 문화",
    name: "여행(Travel)",
    emoji: "✈️",
    description: "국내외 여행, 항공권, 호텔",
    subTopicCount: 20,
    ideaCount: 1800,
    featured: true,
  },
  {
    id: "sports",
    group: "생활 & 문화",
    name: "스포츠(Sports)",
    emoji: "⚽",
    description: "축구, 야구, 농구, 골프, 배드민턴 등 20선",
    subTopicCount: 15,
    ideaCount: 1200,
  },
  {
    id: "food",
    group: "생활 & 문화",
    name: "음식(Food)",
    emoji: "🍜",
    description: "맛집, 요리, 레시피",
    subTopicCount: 15,
    ideaCount: 1200,
  },
  {
    id: "lifestyle",
    group: "생활 & 문화",
    name: "라이프스타일(Lifestyle)",
    emoji: "☕",
    description: "생활정보, 취미, 자기계발",
    subTopicCount: 15,
    ideaCount: 1300,
  },
  {
    id: "fortune-telling",
    group: "생활 & 문화",
    name: "사주 & 운세(Saju & Fortune)",
    emoji: "🔮",
    description: "사주명리학, 별자리, 신년 운세, 타로 카드",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "hobbies-leisure",
    group: "생활 & 문화",
    name: "취미 & 레저(Hobbies & Leisure)",
    emoji: "⛺",
    description: "캠핑, 차박, 등산, 낚시, DIY 취미 활동",
    subTopicCount: 2,
    ideaCount: 20,
  },

  // ======================================================
  // 4. 건강 & 라이프스타일 (Health & Lifestyle)
  // ======================================================
  {
    id: "health",
    group: "건강 & 라이프스타일",
    name: "건강(Health)",
    emoji: "🏥",
    description: "건강관리, 운동, 영양",
    subTopicCount: 18,
    ideaCount: 1500,
    featured: true,
  },
  {
    id: "pets",
    group: "건강 & 라이프스타일",
    name: "반려동물(Pets)",
    emoji: "🐶",
    description: "강아지, 고양이, 반려동물 케어",
    subTopicCount: 12,
    ideaCount: 900,
  },
  {
    id: "wellness-mindfulness",
    group: "건강 & 라이프스타일",
    name: "웰니스 & 마음챙김(Wellness & Mindfulness)",
    emoji: "🧘",
    description: "명상, 요가, 수면 위생, 정신 건강 관리",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "interior-homedecor",
    group: "건강 & 라이프스타일",
    name: "인테리어 & 홈데코(Interior & Homedecor)",
    emoji: "🛋️",
    description: "방 꾸미기, 가구 배치, 셀프 인테리어 정보",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "silver-life",
    group: "건강 & 라이프스타일",
    name: "실버 라이프(Silver Life)",
    emoji: "👴",
    description: "액티브 시니어 라이프, 노후 준비, 시니어 건강",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "fashion-beauty",
    group: "건강 & 라이프스타일",
    name: "패션 & 뷰티(Fashion & Beauty)",
    emoji: "💄",
    description: "스타일링 가이드, 스킨케어, 패션 트렌드 분석",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "parenting-childcare",
    group: "건강 & 라이프스타일",
    name: "임신 & 육아(Parenting & Childcare)",
    emoji: "👶",
    description: "임신 준비, 출산, 영유아 발달, 훈육 꿀팁",
    subTopicCount: 3,
    ideaCount: 30,
  },

  // ======================================================
  // 5. 교육 & 지식 (Education & Knowledge)
  // ======================================================
  {
    id: "education",
    group: "교육 & 지식",
    name: "교육(Education)",
    emoji: "🎓",
    description: "교육, 공부법, 자격증, 온라인 학습",
    subTopicCount: 15,
    ideaCount: 1400,
    featured: true,
  },
  {
    id: "people",
    group: "교육 & 지식",
    name: "인물(People)",
    emoji: "👤",
    description: "위인, 기업가, 정치인, 유명 인물",
    subTopicCount: 20,
    ideaCount: 1600,
  },
  {
    id: "history",
    group: "교육 & 지식",
    name: "역사(History)",
    emoji: "🏛️",
    description: "한국사, 세계사, 전쟁사",
    subTopicCount: 20,
    ideaCount: 1500,
  },
  {
    id: "philosophy-humanities",
    group: "교육 & 지식",
    name: "철학 & 인문학(Philosophy)",
    emoji: "📚",
    description: "철학, 심리학, 인문학",
    subTopicCount: 15,
    ideaCount: 1200,
  },
  {
    id: "religion-spirituality",
    group: "교육 & 지식",
    name: "종교 & 영성(Religion)",
    emoji: "🙏",
    description: "종교, 교리, 영성 및 역사",
    subTopicCount: 12,
    ideaCount: 800,
  },
  {
    id: "chinese-characters",
    group: "교육 & 지식",
    name: "한자(Chinese Characters)",
    emoji: "✍️",
    description: "급수 한자, 고사성어, 한자 교육 및 일상 한자",
    subTopicCount: 2,
    ideaCount: 20,
  },

  // ======================================================
  // 6. 사회 & 국제 (Society & Global)
  // ======================================================
  {
    id: "politics-society",
    group: "사회 & 국제",
    name: "정치 & 사회(Politics & Society)",
    emoji: "🏛️",
    description: "정치, 사회, 선거, 사회 이슈",
    subTopicCount: 15,
    ideaCount: 1500,
  },
  {
    id: "countries-regions",
    group: "사회 & 국제",
    name: "국가 & 지역(Countries & Regions)",
    emoji: "🌏",
    description: "국가, 도시, 지역 정보",
    subTopicCount: 20,
    ideaCount: 1800,
  },
  {
    id: "military-security",
    group: "사회 & 국제",
    name: "군사 & 국제안보(Military & Security)",
    emoji: "🪖",
    description: "군사, 무기체계, 국제안보",
    subTopicCount: 15,
    ideaCount: 1200,
  },

  // ======================================================
  // 7. 법률 & 정책 & 복지 (Law, Policy & Welfare)
  // ======================================================
  {
    id: "law",
    group: "법률 & 정책 & 복지",
    name: "법률(Law)",
    emoji: "⚖️",
    description: "민법, 형법, 노동법, 상속/계약",
    subTopicCount: 10,
    ideaCount: 600,
  },
  {
    id: "government-welfare",
    group: "법률 & 정책 & 복지",
    name: "정부지원금 & 복지(Welfare)",
    emoji: "💳",
    description: "정부정책, 지원사업, 복지 혜택",
    subTopicCount: 15,
    ideaCount: 1300,
  },
  {
    id: "tax-strategy",
    group: "법률 & 정책 & 복지",
    name: "세금 & 세무 전략(Tax Strategy)",
    emoji: "💵",
    description: "소득세, 부가가치세, 절세 및 세무 상식",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "rights-remedy",
    group: "법률 & 정책 & 복지",
    name: "권리 구제(Rights Remedy)",
    emoji: "⚖️",
    description: "노동 권리 보호, 소비자 피해 구제, 법적 구제 절차",
    subTopicCount: 10,
    ideaCount: 200,
  },

  // ======================================================
  // 8. 환경 & 지구과학 (Environment & Earth Science)
  // ======================================================
  {
    id: "science",
    group: "환경 & 지구과학",
    name: "과학(Science)",
    emoji: "🔬",
    description: "물리학, 화학, 생명과학, 지구과학",
    subTopicCount: 20,
    ideaCount: 1700,
  },
  {
    id: "nature-space",
    group: "환경 & 지구과학",
    name: "자연 & 우주(Nature & Space)",
    emoji: "🌎",
    description: "자연 현상, 천문학, 우주탐사",
    subTopicCount: 15,
    ideaCount: 1300,
  },
  {
    id: "environment-esg",
    group: "환경 & 지구과학",
    name: "환경 & ESG(Environment & ESG)",
    emoji: "🌱",
    description: "환경, ESG, 탄소중립",
    subTopicCount: 15,
    ideaCount: 1200,
  },
  {
    id: "climate-eco-tech",
    group: "환경 & 지구과학",
    name: "기후 & 친환경 기술(Climate & Eco Tech)",
    emoji: "⚡",
    description: "탄소 감축, 대체 에너지, 친환경 하이테크 연구",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "space-industry",
    group: "환경 & 지구과학",
    name: "우주 산업 & 탐사(Space Industry)",
    emoji: "🚀",
    description: "민간 우주선, 위성 비즈니스, 우주 탐사선 동향",
    subTopicCount: 10,
    ideaCount: 200,
  },

  // ======================================================
  // 9. 크리에이티브 & 예술 (Creative & Art)
  // ======================================================
  {
    id: "art-design",
    group: "크리에이티브 & 예술",
    name: "예술 & 디자인(Art & Design)",
    emoji: "🎨",
    description: "예술, 디자인, 사진",
    subTopicCount: 15,
    ideaCount: 1400,
  },
  {
    id: "entertainment",
    group: "크리에이티브 & 예술",
    name: "연예 & 문화(Entertainment)",
    emoji: "🎬",
    description: "연예, 영화, 드라마, 방송",
    subTopicCount: 15,
    ideaCount: 1400,
  },
  {
    id: "gaming",
    group: "크리에이티브 & 예술",
    name: "게임(Gaming)",
    emoji: "🎮",
    description: "게임, 공략, e스포츠",
    subTopicCount: 15,
    ideaCount: 1600,
  },
  {
    id: "video-production",
    group: "크리에이티브 & 예술",
    name: "영상 제작(Video Production)",
    emoji: "📹",
    description: "숏폼/롱폼 촬영 기법, 조명, 비디오 에디팅 팁",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "content-planning",
    group: "크리에이티브 & 예술",
    name: "콘텐츠 기획(Content Planning)",
    emoji: "📝",
    description: "스토리텔링 공식, 시놉시스 구성, 연출 기획",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "music-audio",
    group: "크리에이티브 & 예술",
    name: "음악 & 오디오(Music & Audio)",
    emoji: "🎵",
    description: "작곡, 사운드 엔지니어링, 보이스 레코딩 팁",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "creator-platform",
    group: "크리에이티브 & 예술",
    name: "창작 플랫폼(Creator Platform)",
    emoji: "📢",
    description: "유튜브, 틱톡, 인스타 등 플랫폼 알고리즘 공략",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "youtube-production",
    group: "크리에이티브 & 예술",
    name: "유튜브 영상제작(YouTube Production)",
    emoji: "🎬",
    description: "유튜브 기획, 편집 기법, 촬영 장비, 썸네일 디자인",
    subTopicCount: 3,
    ideaCount: 30,
  },

  // ======================================================
  // 10. 산업 & 미래 (Industry & Future)
  // ======================================================
  {
    id: "manufacturing-industry",
    group: "산업 & 미래",
    name: "제조업 & 산업(Manufacturing)",
    emoji: "🏭",
    description: "반도체, 배터리, 산업동향",
    subTopicCount: 20,
    ideaCount: 1800,
  },
  {
    id: "future-mobility",
    group: "산업 & 미래",
    name: "미래 모빌리티(Future Mobility)",
    emoji: "🛸",
    description: "자율주행, UAM, 전기차 배터리 혁신 산업",
    subTopicCount: 10,
    ideaCount: 200,
  },
  {
    id: "bio-healthcare",
    group: "산업 & 미래",
    name: "바이오 & 헬스케어 산업(Bio & Healthcare)",
    emoji: "🧬",
    description: "제약 바이오, 유전자 편집 기술, 원격 의료 미래",
    subTopicCount: 10,
    ideaCount: 200,
  },
];



// ======================================================
// Sub Topics
// ======================================================

export const topicSubTopics: IdeaHubSubTopic[] = [
  // ======================================================
  // AI & 기술
  // ======================================================

  {
    id: "chatgpt",
    categoryId: "ai-tech",
    name: "ChatGPT (챗지피티)",
    description: "OpenAI ChatGPT",
    keywords: ["ChatGPT", "GPT", "OpenAI", "챗지피티", "챗gpt"],
    ideaCount: 200,
    featured: true,
  },

  {
    id: "gemini",
    categoryId: "ai-tech",
    name: "Gemini (제미나이)",
    description: "Google Gemini",
    keywords: ["Gemini", "Google AI", "제미나이"],
    ideaCount: 180,
  },

  {
    id: "claude",
    categoryId: "ai-tech",
    name: "Claude (클로드)",
    description: "Anthropic Claude",
    keywords: ["Claude", "Anthropic", "클로드"],
    ideaCount: 180,
  },

  {
    id: "ai-agents",
    categoryId: "ai-tech",
    name: "AI 에이전트(AI Agent)",
    description: "AI Agent",
    keywords: ["AI Agent", "Agent", "AI 에이전트"],
    ideaCount: 150,
  },

  {
    id: "ai-automation",
    categoryId: "ai-tech",
    name: "AI 자동화(Automation)",
    description: "Automation",
    keywords: ["n8n", "Make", "Zapier", "AI 자동화", "Automation"],
    ideaCount: 140,
  },

  {
    id: "ai-coding",
    categoryId: "ai-tech",
    name: "AI 코딩(AI Coding)",
    description: "AI Coding",
    keywords: ["Codex", "Cursor", "AI 코딩", "AI Coding"],
    ideaCount: 130,
  },

  {
    id: "ai-image",
    categoryId: "ai-tech",
    name: "AI 이미지 생성(Image Generation)",
    description: "Image Generation",
    keywords: ["Flux", "Midjourney", "AI 이미지 생성", "Image Generation"],
    ideaCount: 120,
  },

  {
    id: "ai-video",
    categoryId: "ai-tech",
    name: "AI 영상 생성(Video Generation)",
    description: "Video Generation",
    keywords: ["Kling", "Veo", "AI 영상 생성", "Video Generation"],
    ideaCount: 120,
  },

  {
    id: "ai-voice",
    categoryId: "ai-tech",
    name: "AI 음성 생성(Voice Generation)",
    description: "Voice Generation",
    keywords: ["ElevenLabs", "AI 음성 생성", "Voice Generation"],
    ideaCount: 100,
  },

  {
    id: "prompt-engineering",
    categoryId: "ai-tech",
    name: "프롬프트 엔지니어링(Prompt Engineering)",
    description: "Prompt Engineering",
    keywords: ["Prompt", "프롬프트 엔지니어링", "Prompt Engineering"],
    ideaCount: 100,
  },

  {
    id: "openai",
    categoryId: "ai-tech",
    name: "OpenAI (오픈AI)",
    description: "OpenAI",
    keywords: ["OpenAI", "오픈AI"],
    ideaCount: 80,
  },

  {
    id: "anthropic",
    categoryId: "ai-tech",
    name: "Anthropic (앤트로픽)",
    description: "Anthropic",
    keywords: ["Anthropic", "앤트로픽"],
    ideaCount: 60,
  },

  {
    id: "llm",
    categoryId: "ai-tech",
    name: "대규모 언어모델(LLM)",
    description: "LLM",
    keywords: ["LLM", "대규모 언어모델"],
    ideaCount: 60,
  },

  {
    id: "ai-business",
    categoryId: "ai-tech",
    name: "AI 비즈니스(AI Business)",
    description: "AI Business",
    keywords: ["AI Startup", "AI 비즈니스", "AI Business"],
    ideaCount: 80,
  },

  {
    id: "generative-ai",
    categoryId: "ai-tech",
    name: "생성형 AI(Generative AI)",
    description: "Generative AI",
    keywords: ["Generative AI", "생성형 AI"],
    ideaCount: 100,
  },

  // ======================================================
  // IT & 디지털
  // ======================================================

  {
    id: "smartphone",
    categoryId: "it-digital",
    name: "스마트폰(Smartphone)",
    description: "Smartphone",
    keywords: ["아이폰", "갤럭시", "스마트폰", "Smartphone"],
    ideaCount: 120,
  },

  {
    id: "laptop",
    categoryId: "it-digital",
    name: "노트북(Laptop)",
    description: "Laptop",
    keywords: ["맥북", "윈도우", "노트북", "Laptop"],
    ideaCount: 100,
  },

  {
    id: "pc",
    categoryId: "it-digital",
    name: "PC",
    description: "Desktop",
    keywords: ["PC"],
    ideaCount: 80,
  },

  {
    id: "software",
    categoryId: "it-digital",
    name: "소프트웨어(Software)",
    description: "Software",
    keywords: ["Software", "소프트웨어"],
    ideaCount: 90,
  },

  {
    id: "app-recommend",
    categoryId: "it-digital",
    name: "앱 추천(Apps)",
    description: "Apps",
    keywords: ["앱", "앱 추천", "Apps"],
    ideaCount: 90,
  },

  {
    id: "productivity-tools",
    categoryId: "it-digital",
    name: "생산성 도구(Productivity)",
    description: "Productivity",
    keywords: ["Notion", "Obsidian", "생산성 도구", "Productivity"],
    ideaCount: 100,
  },

  {
    id: "youtube",
    categoryId: "it-digital",
    name: "유튜브(YouTube)",
    description: "YouTube",
    keywords: ["YouTube", "유튜브"],
    ideaCount: 120,
  },

  {
    id: "instagram",
    categoryId: "it-digital",
    name: "인스타그램(Instagram)",
    description: "Instagram",
    keywords: ["Instagram", "인스타그램"],
    ideaCount: 90,
  },

  {
    id: "tiktok",
    categoryId: "it-digital",
    name: "틱톡(TikTok)",
    description: "TikTok",
    keywords: ["TikTok", "틱톡"],
    ideaCount: 90,
  },

  {
    id: "web-services",
    categoryId: "it-digital",
    name: "웹서비스(Web Service)",
    description: "Web Service",
    keywords: ["Web", "웹서비스", "Web Service"],
    ideaCount: 100,
  },

  // ======================================================
  // 가상자산 & 블록체인
  // ======================================================

  {
    id: "bitcoin",
    categoryId: "crypto-blockchain",
    name: "비트코인(Bitcoin)",
    description: "Bitcoin",
    keywords: ["BTC", "비트코인", "Bitcoin"],
    ideaCount: 200,
    featured: true,
  },

  {
    id: "ethereum",
    categoryId: "crypto-blockchain",
    name: "이더리움(Ethereum)",
    description: "Ethereum",
    keywords: ["ETH", "이더리움", "Ethereum"],
    ideaCount: 150,
  },

  {
    id: "altcoin",
    categoryId: "crypto-blockchain",
    name: "알트코인(Altcoin)",
    description: "Altcoin",
    keywords: ["Altcoin", "알트코인"],
    ideaCount: 150,
  },

  {
    id: "meme-coin",
    categoryId: "crypto-blockchain",
    name: "밈코인(Meme Coin)",
    description: "Meme Coin",
    keywords: ["DOGE", "밈코인", "Meme Coin"],
    ideaCount: 120,
  },

  {
    id: "upbit",
    categoryId: "crypto-blockchain",
    name: "업비트(Upbit)",
    description: "Upbit",
    keywords: ["업비트", "Upbit"],
    ideaCount: 100,
  },

  {
    id: "binance",
    categoryId: "crypto-blockchain",
    name: "바이낸스(Binance)",
    description: "Binance",
    keywords: ["Binance", "바이낸스"],
    ideaCount: 100,
  },

  {
    id: "defi",
    categoryId: "crypto-blockchain",
    name: "DeFi",
    description: "Decentralized Finance",
    keywords: ["DeFi"],
    ideaCount: 100,
  },

  {
    id: "nft",
    categoryId: "crypto-blockchain",
    name: "NFT",
    description: "NFT",
    keywords: ["NFT"],
    ideaCount: 100,
  },

  {
    id: "web3",
    categoryId: "crypto-blockchain",
    name: "Web3",
    description: "Web3",
    keywords: ["Web3"],
    ideaCount: 100,
  },

  {
    id: "staking",
    categoryId: "crypto-blockchain",
    name: "스테이킹(Staking)",
    description: "Staking",
    keywords: ["Staking", "스테이킹"],
    ideaCount: 80,
  },

  // ======================================================
  // 사이버보안
  // ======================================================

  {
    id: "hacking",
    categoryId: "cyber-security",
    name: "해킹(Hacking)",
    description: "Hacking",
    keywords: ["Hacking", "해킹"],
    ideaCount: 80,
  },

  {
    id: "privacy",
    categoryId: "cyber-security",
    name: "개인정보보호(Privacy)",
    description: "Privacy",
    keywords: ["Privacy", "개인정보보호"],
    ideaCount: 80,
  },

  {
    id: "ransomware",
    categoryId: "cyber-security",
    name: "랜섬웨어(Ransomware)",
    description: "Ransomware",
    keywords: ["Ransomware", "랜섬웨어"],
    ideaCount: 60,
  },

  // ======================================================
  // 데이터 & 분석
  // ======================================================

  {
    id: "data-analysis",
    categoryId: "data-analytics",
    name: "데이터 분석(Data Analysis)",
    description: "Data Analysis",
    keywords: ["Data", "데이터 분석", "Data Analysis"],
    ideaCount: 100,
  },

  {
    id: "big-data",
    categoryId: "data-analytics",
    name: "빅데이터(Big Data)",
    description: "Big Data",
    keywords: ["Big Data", "빅데이터"],
    ideaCount: 80,
  },

  {
    id: "statistics",
    categoryId: "data-analytics",
    name: "통계(Statistics)",
    description: "Statistics",
    keywords: ["Statistics", "통계"],
    ideaCount: 80,
  },

  {
    id: "data-visualization",
    categoryId: "data-analytics",
    name: "데이터 시각화(Visualization)",
    description: "Visualization",
    keywords: ["Chart", "데이터 시각화", "Visualization"],
    ideaCount: 80,
  },

  // ======================================================
  // 경제 & 금융
  // ======================================================

  {
    id: "economy-news",
    categoryId: "economy-finance",
    name: "경제 뉴스",
    description: "경제 이슈 및 시장 동향",
    keywords: ["경제", "시장"],
    ideaCount: 120,
  },

  {
    id: "interest-rate",
    categoryId: "economy-finance",
    name: "금리",
    description: "기준금리 및 금융정책",
    keywords: ["금리"],
    ideaCount: 100,
  },

  {
    id: "exchange-rate",
    categoryId: "economy-finance",
    name: "환율",
    description: "달러 및 주요 통화",
    keywords: ["환율", "달러"],
    ideaCount: 100,
  },

  {
    id: "inflation",
    categoryId: "economy-finance",
    name: "인플레이션",
    description: "물가 상승과 경제 영향",
    keywords: ["인플레이션"],
    ideaCount: 80,
  },

  {
    id: "stock",
    categoryId: "economy-finance",
    name: "주식",
    description: "주식 투자",
    keywords: ["주식"],
    ideaCount: 150,
  },

  {
    id: "etf",
    categoryId: "economy-finance",
    name: "ETF",
    description: "ETF 투자",
    keywords: ["ETF"],
    ideaCount: 120,
  },

  {
    id: "bond",
    categoryId: "economy-finance",
    name: "채권",
    description: "채권 투자",
    keywords: ["채권"],
    ideaCount: 80,
  },

  {
    id: "gold-investment",
    categoryId: "economy-finance",
    name: "금 투자(Gold Investment)",
    description: "Gold Investment",
    keywords: ["금", "금 투자", "Gold Investment"],
    ideaCount: 80,
  },

  {
    id: "asset-management",
    categoryId: "economy-finance",
    name: "자산관리(Asset Management)",
    description: "Asset Management",
    keywords: ["자산관리", "Asset Management"],
    ideaCount: 100,
  },

  {
    id: "retirement",
    categoryId: "economy-finance",
    name: "연금(Pension)",
    description: "Pension",
    keywords: ["연금", "Pension"],
    ideaCount: 80,
  },

  {
    id: "insurance",
    categoryId: "economy-finance",
    name: "보험(Insurance)",
    description: "Insurance",
    keywords: ["보험", "Insurance"],
    ideaCount: 80,
  },

  {
    id: "tax-saving",
    categoryId: "economy-finance",
    name: "절세(Tax Saving)",
    description: "Tax Saving",
    keywords: ["절세", "Tax Saving"],
    ideaCount: 80,
  },

  // ======================================================
  // 비즈니스
  // ======================================================

  {
    id: "startup",
    categoryId: "business",
    name: "스타트업(Startup)",
    description: "Startup",
    keywords: ["창업", "스타트업", "Startup"],
    ideaCount: 120,
  },

  {
    id: "saas",
    categoryId: "business",
    name: "SaaS",
    description: "Software as a Service",
    keywords: ["SaaS"],
    ideaCount: 120,
  },

  {
    id: "marketing",
    categoryId: "business",
    name: "마케팅(Marketing)",
    description: "Marketing",
    keywords: ["마케팅", "Marketing"],
    ideaCount: 120,
  },

  {
    id: "branding",
    categoryId: "business",
    name: "브랜딩(Branding)",
    description: "Branding",
    keywords: ["브랜드", "브랜딩", "Branding"],
    ideaCount: 100,
  },

  {
    id: "sales",
    categoryId: "business",
    name: "세일즈(Sales)",
    description: "Sales",
    keywords: ["영업", "세일즈", "Sales"],
    ideaCount: 80,
  },

  {
    id: "crm",
    categoryId: "business",
    name: "CRM",
    description: "Customer Relationship Management",
    keywords: ["CRM"],
    ideaCount: 60,
  },

  {
    id: "business-strategy",
    categoryId: "business",
    name: "사업전략(Business Strategy)",
    description: "Business Strategy",
    keywords: ["전략", "사업전략", "Business Strategy"],
    ideaCount: 100,
  },

  {
    id: "solo-startup",
    categoryId: "business",
    name: "1인 창업(Solo Startup)",
    description: "Solo Startup & Micro Business",
    keywords: ["1인 창업", "소자본 창업", "무자본 창업", "부업"],
    ideaCount: 80,
  },

  {
    id: "online-business",
    categoryId: "business",
    name: "온라인 비즈니스 창업(Online Business)",
    description: "Online Business Startup",
    keywords: ["온라인 창업", "쇼핑몰 창업", "스마트스토어", "해외구매대행"],
    ideaCount: 80,
  },

  {
    id: "franchise-startup",
    categoryId: "business",
    name: "프랜차이즈 창업(Franchise)",
    description: "Franchise Startup Guidelines",
    keywords: ["프랜차이즈 창업", "가맹점", "소상공인", "체인점"],
    ideaCount: 80,
  },

  {
    id: "restaurant-startup",
    categoryId: "business",
    name: "외식 & 식당 창업(Restaurant)",
    description: "Restaurant & Food Service Startup",
    keywords: ["식당 창업", "외식 창업", "음식점 창업", "F&B"],
    ideaCount: 80,
  },

  {
    id: "trending-startup",
    categoryId: "business",
    name: "요즘 뜨는 트렌드 창업(Trending)",
    description: "Trending Business & Startup Items",
    keywords: ["요즘 뜨는 창업", "트렌드 창업", "이색 창업", "신규 사업"],
    ideaCount: 80,
  },

  {
    id: "capital-efficient-startup",
    categoryId: "business",
    name: "소자본 & 무자본 창업(Low Capital)",
    description: "Low Capital & Budget Startup",
    keywords: ["소자본 창업", "무자본 창업", "소규모 창업", "소자본 창업 아이템"],
    ideaCount: 80,
  },

  {
    id: "youtube-creator-startup",
    categoryId: "business",
    name: "유튜브 크리에이터 창업(Creator)",
    description: "YouTube Channel & Creator Business",
    keywords: ["유튜브 창업", "크리에이터 창업", "유튜버 부업", "채널 수익화"],
    ideaCount: 80,
  },

  {
    id: "blog-monetization-startup",
    categoryId: "business",
    name: "블로그 미디어 창업(Blogger)",
    description: "Blog Media & Affiliate Business",
    keywords: ["블로그 창업", "블로거 부업", "제휴 마케팅", "수익형 블로그"],
    ideaCount: 80,
  },

  {
    id: "cafe-startup",
    categoryId: "business",
    name: "카페 & 디저트 창업(Cafe)",
    description: "Cafe & Dessert Shop Startup",
    keywords: ["카페 창업", "디저트 창업", "커피 전문점", "개인 카페"],
    ideaCount: 80,
  },

  {
    id: "space-rental-startup",
    categoryId: "business",
    name: "공간 대여 창업(Space Rental)",
    description: "Space Rental & Share Space Startup",
    keywords: ["공간 대여", "공유 오피스", "파티룸 창업", "스터디룸 창업"],
    ideaCount: 80,
  },

  {
    id: "unmanned-store-startup",
    categoryId: "business",
    name: "무인 매장 창업(Unmanned)",
    description: "Unmanned Store & Automated Shop Startup",
    keywords: ["무인 매장", "무인 창업", "무인 아이스크림", "무인 카페"],
    ideaCount: 80,
  },

  {
    id: "consulting-startup",
    categoryId: "business",
    name: "컨설팅 & 교육 창업(Consulting)",
    description: "Knowledge Consulting & Coaching Business",
    keywords: ["컨설팅 창업", "교육 창업", "전문 강사", "1인 컨설팅"],
    ideaCount: 80,
  },

  // ======================================================
  // 법률
  // ======================================================

  {
    id: "civil-law",
    categoryId: "law",
    name: "민법(Civil Law)",
    description: "Civil Law",
    keywords: ["민법", "Civil Law"],
    ideaCount: 80,
  },

  {
    id: "criminal-law",
    categoryId: "law",
    name: "형법(Criminal Law)",
    description: "Criminal Law",
    keywords: ["형법", "Criminal Law"],
    ideaCount: 80,
  },

  {
    id: "labor-law",
    categoryId: "law",
    name: "노동법(Labor Law)",
    description: "Labor Law",
    keywords: ["노동법", "Labor Law"],
    ideaCount: 80,
  },

  {
    id: "copyright",
    categoryId: "law",
    name: "저작권(Copyright)",
    description: "Copyright",
    keywords: ["저작권", "Copyright"],
    ideaCount: 80,
  },

  {
    id: "trademark",
    categoryId: "law",
    name: "상표권(Trademark)",
    description: "Trademark",
    keywords: ["상표", "상표권", "Trademark"],
    ideaCount: 60,
  },

  {
    id: "contract",
    categoryId: "law",
    name: "계약(Contract)",
    description: "Contract",
    keywords: ["계약", "Contract"],
    ideaCount: 60,
  },

  // ======================================================
  // 취업 & 커리어
  // ======================================================

  {
    id: "job-search",
    categoryId: "career",
    name: "취업(Employment)",
    description: "Employment",
    keywords: ["취업", "Employment"],
    ideaCount: 100,
  },

  {
    id: "career-change",
    categoryId: "career",
    name: "이직(Career Change)",
    description: "Career Change",
    keywords: ["이직", "Career Change"],
    ideaCount: 100,
  },

  {
    id: "interview",
    categoryId: "career",
    name: "면접(Interview)",
    description: "Interview",
    keywords: ["면접", "Interview"],
    ideaCount: 100,
  },

  {
    id: "resume",
    categoryId: "career",
    name: "이력서(Resume)",
    description: "Resume",
    keywords: ["이력서", "Resume"],
    ideaCount: 80,
  },

  {
    id: "certificate",
    categoryId: "career",
    name: "자격증(Certificate)",
    description: "Certificate",
    keywords: ["자격증", "Certificate"],
    ideaCount: 80,
  },

  {
    id: "freelancer",
    categoryId: "career",
    name: "프리랜서(Freelancer)",
    description: "Freelancer",
    keywords: ["프리랜서", "Freelancer"],
    ideaCount: 80,
  },

  // ======================================================
  // 기업 & 브랜드
  // ======================================================

  {
    id: "samsung",
    categoryId: "company-brand",
    name: "삼성(Samsung)",
    description: "Samsung",
    keywords: ["삼성", "Samsung"],
    ideaCount: 80,
  },

  {
    id: "apple",
    categoryId: "company-brand",
    name: "애플(Apple)",
    description: "Apple",
    keywords: ["애플", "Apple"],
    ideaCount: 80,
  },

  {
    id: "google",
    categoryId: "company-brand",
    name: "구글(Google)",
    description: "Google",
    keywords: ["구글", "Google"],
    ideaCount: 80,
  },

  {
    id: "tesla",
    categoryId: "company-brand",
    name: "테슬라(Tesla)",
    description: "Tesla",
    keywords: ["테슬라", "Tesla"],
    ideaCount: 80,
  },

  {
    id: "openai-company",
    categoryId: "company-brand",
    name: "OpenAI",
    description: "OpenAI",
    keywords: ["OpenAI"],
    ideaCount: 80,
  },

  {
    id: "brand-analysis",
    categoryId: "company-brand",
    name: "브랜드 분석(Brand Analysis)",
    description: "Brand Analysis",
    keywords: ["브랜드", "브랜드 분석", "Brand Analysis"],
    ideaCount: 100,
  },

  // ======================================================
  // 제품 & 쇼핑
  // ======================================================

  {
    id: "smartphone-shopping",
    categoryId: "shopping",
    name: "스마트폰(Smartphone)",
    description: "Smartphone",
    keywords: ["아이폰", "갤럭시", "스마트폰", "Smartphone"],
    ideaCount: 120,
  },

  {
    id: "laptop-shopping",
    categoryId: "shopping",
    name: "노트북(Laptop)",
    description: "Laptop",
    keywords: ["맥북", "노트북", "Laptop"],
    ideaCount: 100,
  },

  {
    id: "camera",
    categoryId: "shopping",
    name: "카메라(Camera)",
    description: "Camera",
    keywords: ["카메라", "Camera"],
    ideaCount: 80,
  },

  {
    id: "home-appliance",
    categoryId: "shopping",
    name: "가전제품(Home Appliance)",
    description: "Home Appliance",
    keywords: ["가전", "가전제품", "Home Appliance"],
    ideaCount: 100,
  },

  {
    id: "shopping-guide",
    categoryId: "shopping",
    name: "구매 가이드(Buying Guide)",
    description: "Buying Guide",
    keywords: ["추천", "구매 가이드", "Buying Guide"],
    ideaCount: 100,
  },

  {
    id: "product-review",
    categoryId: "shopping",
    name: "제품 리뷰(Product Review)",
    description: "Product Review",
    keywords: ["리뷰", "제품 리뷰", "Product Review"],
    ideaCount: 100,
  },

  // ======================================================
  // 부동산
  // ======================================================

  {
    id: "apartment",
    categoryId: "real-estate",
    name: "아파트(Apartment)",
    description: "Apartment",
    keywords: ["아파트", "Apartment"],
    ideaCount: 150,
  },

  {
    id: "subscription",
    categoryId: "real-estate",
    name: "청약(Subscription)",
    description: "Subscription",
    keywords: ["청약", "Subscription"],
    ideaCount: 120,
  },

  {
    id: "redevelopment",
    categoryId: "real-estate",
    name: "재개발(Redevelopment)",
    description: "Redevelopment",
    keywords: ["재개발", "Redevelopment"],
    ideaCount: 100,
  },

  {
    id: "reconstruction",
    categoryId: "real-estate",
    name: "재건축(Reconstruction)",
    description: "Reconstruction",
    keywords: ["재건축", "Reconstruction"],
    ideaCount: 100,
  },

  {
    id: "real-estate-investment",
    categoryId: "real-estate",
    name: "부동산 투자(Real Estate Investment)",
    description: "Real Estate Investment",
    keywords: ["투자", "부동산 투자", "Real Estate Investment"],
    ideaCount: 120,
  },

  {
    id: "commercial-property",
    categoryId: "real-estate",
    name: "상가(Commercial Property)",
    description: "Commercial Property",
    keywords: ["상가", "Commercial Property"],
    ideaCount: 80,
  },

  // ======================================================
  // 자동차
  // ======================================================

  {
    id: "electric-car",
    categoryId: "car",
    name: "전기차(Electric Vehicle)",
    description: "Electric Vehicle",
    keywords: ["전기차", "Electric Vehicle"],
    ideaCount: 150,
  },

  {
    id: "domestic-car",
    categoryId: "car",
    name: "국산차(Korean Cars)",
    description: "Korean Cars",
    keywords: ["현대", "기아", "국산차", "Korean Cars"],
    ideaCount: 120,
  },

  {
    id: "imported-car",
    categoryId: "car",
    name: "수입차(Imported Cars)",
    description: "Imported Cars",
    keywords: ["BMW", "벤츠", "수입차", "Imported Cars"],
    ideaCount: 120,
  },

  {
    id: "used-car",
    categoryId: "car",
    name: "중고차(Used Car)",
    description: "Used Car",
    keywords: ["중고차", "Used Car"],
    ideaCount: 100,
  },

  {
    id: "car-insurance",
    categoryId: "car",
    name: "자동차보험(Car Insurance)",
    description: "Car Insurance",
    keywords: ["보험", "자동차보험", "Car Insurance"],
    ideaCount: 80,
  },

  {
    id: "autonomous-driving",
    categoryId: "car",
    name: "자율주행(Autonomous Driving)",
    description: "Autonomous Driving",
    keywords: ["자율주행", "Autonomous Driving"],
    ideaCount: 100,
  },

  // ======================================================
  // 여행
  // ======================================================

  {
    id: "japan-travel",
    categoryId: "travel",
    name: "일본여행(Japan Travel)",
    description: "Japan Travel",
    keywords: ["일본", "일본여행", "Japan Travel"],
    ideaCount: 180,
  },

  {
    id: "australia-travel",
    categoryId: "travel",
    name: "호주여행(Australia Travel)",
    description: "Australia Travel",
    keywords: ["호주", "호주여행", "Australia Travel"],
    ideaCount: 120,
  },

  {
    id: "europe-travel",
    categoryId: "travel",
    name: "유럽여행(Europe Travel)",
    description: "Europe Travel",
    keywords: ["유럽", "유럽여행", "Europe Travel"],
    ideaCount: 150,
  },

  {
    id: "domestic-travel",
    categoryId: "travel",
    name: "국내여행(Domestic Travel)",
    description: "Domestic Travel",
    keywords: ["국내여행", "Domestic Travel"],
    ideaCount: 150,
  },

  {
    id: "air-ticket",
    categoryId: "travel",
    name: "항공권(Flight)",
    description: "Flight",
    keywords: ["항공권", "Flight"],
    ideaCount: 120,
  },

  {
    id: "hotel",
    categoryId: "travel",
    name: "호텔(Hotel)",
    description: "Hotel",
    keywords: ["호텔", "Hotel"],
    ideaCount: 120,
  },

  {
    id: "camping",
    categoryId: "travel",
    name: "캠핑(Camping)",
    description: "Camping",
    keywords: ["캠핑", "Camping"],
    ideaCount: 100,
  },

  // ======================================================
  // 스포츠
  // ======================================================

  {
    id: "soccer",
    categoryId: "sports",
    name: "축구(Football)",
    description: "Football",
    keywords: ["축구", "Football"],
    ideaCount: 20,
  },

  {
    id: "baseball",
    categoryId: "sports",
    name: "야구(Baseball)",
    description: "Baseball",
    keywords: ["야구", "Baseball"],
    ideaCount: 20,
  },

  {
    id: "basketball",
    categoryId: "sports",
    name: "농구(Basketball)",
    description: "Basketball",
    keywords: ["농구", "Basketball"],
    ideaCount: 20,
  },

  {
    id: "golf",
    categoryId: "sports",
    name: "골프(Golf)",
    description: "Golf",
    keywords: ["골프", "Golf"],
    ideaCount: 20,
  },

  {
    id: "tennis",
    categoryId: "sports",
    name: "테니스(Tennis)",
    description: "Tennis",
    keywords: ["테니스", "Tennis"],
    ideaCount: 20,
  },

  {
    id: "badminton",
    categoryId: "sports",
    name: "배드민턴(Badminton)",
    description: "Badminton",
    keywords: ["배드민턴", "Badminton"],
    ideaCount: 20,
  },

  {
    id: "table-tennis",
    categoryId: "sports",
    name: "탁구(Table Tennis)",
    description: "Table Tennis",
    keywords: ["탁구", "Table Tennis"],
    ideaCount: 20,
  },

  {
    id: "swimming",
    categoryId: "sports",
    name: "수영(Swimming)",
    description: "Swimming",
    keywords: ["수영", "Swimming"],
    ideaCount: 20,
  },

  {
    id: "volleyball",
    categoryId: "sports",
    name: "배구(Volleyball)",
    description: "Volleyball",
    keywords: ["배구", "Volleyball"],
    ideaCount: 20,
  },

  {
    id: "bowling",
    categoryId: "sports",
    name: "볼링(Bowling)",
    description: "Bowling",
    keywords: ["볼링", "Bowling"],
    ideaCount: 20,
  },

  {
    id: "billiards",
    categoryId: "sports",
    name: "당구(Billiards)",
    description: "Billiards",
    keywords: ["당구", "Billiards"],
    ideaCount: 20,
  },

  {
    id: "squash",
    categoryId: "sports",
    name: "스쿼시(Squash)",
    description: "Squash",
    keywords: ["스쿼시", "Squash"],
    ideaCount: 20,
  },

  {
    id: "yoga-pilates",
    categoryId: "sports",
    name: "요가 & 필라테스(Yoga & Pilates)",
    description: "Yoga & Pilates",
    keywords: ["요가", "필라테스", "요가 & 필라테스", "Yoga & Pilates"],
    ideaCount: 20,
  },

  {
    id: "climbing",
    categoryId: "sports",
    name: "클라이밍(Climbing)",
    description: "Climbing",
    keywords: ["클라이밍", "Climbing"],
    ideaCount: 20,
  },

  {
    id: "surfing",
    categoryId: "sports",
    name: "서핑(Surfing)",
    description: "Surfing",
    keywords: ["서핑", "Surfing"],
    ideaCount: 20,
  },

  {
    id: "ski-snowboard",
    categoryId: "sports",
    name: "스키 & 스노보드(Ski & Snowboard)",
    description: "Ski & Snowboard",
    keywords: ["스키", "스노보드", "스키 & 스노보드", "Ski & Snowboard"],
    ideaCount: 20,
  },

  {
    id: "running",
    categoryId: "sports",
    name: "달리기 (러닝)",
    description: "Running",
    keywords: ["달리기", "러닝", "마라톤"],
    ideaCount: 20,
  },

  {
    id: "cycling",
    categoryId: "sports",
    name: "자전거 & 바이크(Cycling)",
    description: "Cycling",
    keywords: ["자전거", "사이클", "자전거 & 바이크", "Cycling"],
    ideaCount: 20,
  },

  {
    id: "martial-arts",
    categoryId: "sports",
    name: "주짓수 & 격투기(Martial Arts)",
    description: "Martial Arts",
    keywords: ["주짓수", "복싱", "격투기", "주짓수 & 격투기", "Martial Arts"],
    ideaCount: 20,
  },

  {
    id: "esports",
    categoryId: "sports",
    name: "e스포츠(eSports)",
    description: "eSports",
    keywords: ["e스포츠", "eSports"],
    ideaCount: 20,
  },

  // ======================================================
  // 연예 & 문화
  // ======================================================

  {
    id: "movie",
    categoryId: "entertainment",
    name: "영화(Movie)",
    description: "Movie",
    keywords: ["영화", "Movie"],
    ideaCount: 150,
  },

  {
    id: "drama",
    categoryId: "entertainment",
    name: "드라마(Drama)",
    description: "Drama",
    keywords: ["드라마", "Drama"],
    ideaCount: 150,
  },

  {
    id: "kpop",
    categoryId: "entertainment",
    name: "K-POP",
    description: "KPOP",
    keywords: ["아이돌"],
    ideaCount: 120,
  },

  {
    id: "celebrity",
    categoryId: "entertainment",
    name: "연예인(Celebrity)",
    description: "Celebrity",
    keywords: ["연예인", "Celebrity"],
    ideaCount: 120,
  },

  {
    id: "ott",
    categoryId: "entertainment",
    name: "OTT",
    description: "OTT",
    keywords: ["넷플릭스"],
    ideaCount: 120,
  },

  // ======================================================
  // 음식
  // ======================================================

  {
    id: "restaurant",
    categoryId: "food",
    name: "맛집(Restaurant)",
    description: "Restaurant",
    keywords: ["맛집", "Restaurant"],
    ideaCount: 150,
  },

  {
    id: "recipe",
    categoryId: "food",
    name: "레시피(Recipe)",
    description: "Recipe",
    keywords: ["요리", "레시피", "Recipe"],
    ideaCount: 120,
  },

  {
    id: "coffee",
    categoryId: "food",
    name: "커피(Coffee)",
    description: "Coffee",
    keywords: ["커피", "Coffee"],
    ideaCount: 100,
  },

  {
    id: "diet-food",
    categoryId: "food",
    name: "다이어트 식단(Diet Food)",
    description: "Diet Food",
    keywords: ["다이어트", "다이어트 식단", "Diet Food"],
    ideaCount: 100,
  },

  // ======================================================
  // 건강
  // ======================================================

  {
    id: "fitness",
    categoryId: "health",
    name: "운동(Fitness)",
    description: "Fitness",
    keywords: ["운동", "Fitness"],
    ideaCount: 150,
  },

  {
    id: "diet",
    categoryId: "health",
    name: "다이어트(Diet)",
    description: "Diet",
    keywords: ["다이어트", "Diet"],
    ideaCount: 150,
  },

  {
    id: "nutrition",
    categoryId: "health",
    name: "영양(Nutrition)",
    description: "Nutrition",
    keywords: ["영양", "Nutrition"],
    ideaCount: 100,
  },

  {
    id: "sleep",
    categoryId: "health",
    name: "수면(Sleep)",
    description: "Sleep",
    keywords: ["수면", "Sleep"],
    ideaCount: 100,
  },

  {
    id: "mental-health",
    categoryId: "health",
    name: "정신건강(Mental Health)",
    description: "Mental Health",
    keywords: ["정신건강", "Mental Health"],
    ideaCount: 100,
  },

  // ======================================================
  // 라이프스타일
  // ======================================================

  {
    id: "self-development",
    categoryId: "lifestyle",
    name: "자기계발(Self Development)",
    description: "Self Development",
    keywords: ["성장", "자기계발", "Self Development"],
    ideaCount: 150,
  },

  {
    id: "productivity",
    categoryId: "lifestyle",
    name: "생산성(Productivity)",
    description: "Productivity",
    keywords: ["생산성", "Productivity"],
    ideaCount: 120,
  },

  {
    id: "minimalism",
    categoryId: "lifestyle",
    name: "미니멀리즘(Minimalism)",
    description: "Minimalism",
    keywords: ["미니멀", "미니멀리즘", "Minimalism"],
    ideaCount: 80,
  },

  {
    id: "hobby",
    categoryId: "lifestyle",
    name: "취미(Hobby)",
    description: "Hobby",
    keywords: ["취미", "Hobby"],
    ideaCount: 120,
  },

  // ======================================================
  // 반려동물
  // ======================================================

  {
    id: "dog",
    categoryId: "pets",
    name: "강아지(Dog)",
    description: "Dog",
    keywords: ["강아지", "Dog"],
    ideaCount: 150,
  },

  {
    id: "cat",
    categoryId: "pets",
    name: "고양이(Cat)",
    description: "Cat",
    keywords: ["고양이", "Cat"],
    ideaCount: 150,
  },

  {
    id: "pet-health",
    categoryId: "pets",
    name: "반려동물 건강(Pet Health)",
    description: "Pet Health",
    keywords: ["동물병원", "반려동물 건강", "Pet Health"],
    ideaCount: 100,
  },

  {
    id: "pet-food",
    categoryId: "pets",
    name: "반려동물 사료(Pet Food)",
    description: "Pet Food",
    keywords: ["사료", "반려동물 사료", "Pet Food"],
    ideaCount: 100,
  },

  // ======================================================
  // 교육
  // ======================================================

  {
    id: "study-method",
    categoryId: "education",
    name: "공부법(Study Method)",
    description: "Study Method",
    keywords: ["공부", "공부법", "Study Method"],
    ideaCount: 150,
  },

  {
    id: "online-course",
    categoryId: "education",
    name: "온라인 강의(Online Course)",
    description: "Online Course",
    keywords: ["강의", "온라인 강의", "Online Course"],
    ideaCount: 120,
  },

  {
    id: "certificate-education",
    categoryId: "education",
    name: "자격증(Certificate)",
    description: "Certificate",
    keywords: ["자격증", "Certificate"],
    ideaCount: 120,
  },

  {
    id: "language-learning",
    categoryId: "education",
    name: "외국어(Language Learning)",
    description: "Language Learning",
    keywords: ["영어", "외국어", "Language Learning"],
    ideaCount: 120,
  },

  {
    id: "university",
    categoryId: "education",
    name: "대학교(University)",
    description: "University",
    keywords: ["대학", "대학교", "University"],
    ideaCount: 100,
  },

  {
    id: "study-abroad",
    categoryId: "education",
    name: "유학(Study Abroad)",
    description: "Study Abroad",
    keywords: ["유학", "Study Abroad"],
    ideaCount: 120,
  },

  // ======================================================
  // 인물
  // ======================================================

  {
    id: "elon-musk",
    categoryId: "people",
    name: "일론 머스크(Elon Musk)",
    description: "Elon Musk",
    keywords: ["테슬라", "일론 머스크", "Elon Musk"],
    ideaCount: 120,
  },

  {
    id: "steve-jobs",
    categoryId: "people",
    name: "스티브 잡스(Steve Jobs)",
    description: "Steve Jobs",
    keywords: ["애플", "스티브 잡스", "Steve Jobs"],
    ideaCount: 100,
  },

  {
    id: "bill-gates",
    categoryId: "people",
    name: "빌 게이츠(Bill Gates)",
    description: "Bill Gates",
    keywords: ["마이크로소프트", "빌 게이츠", "Bill Gates"],
    ideaCount: 100,
  },

  {
    id: "sam-altman",
    categoryId: "people",
    name: "샘 알트만(Sam Altman)",
    description: "Sam Altman",
    keywords: ["OpenAI", "샘 알트만", "Sam Altman"],
    ideaCount: 100,
  },

  {
    id: "entrepreneurs",
    categoryId: "people",
    name: "기업가(Entrepreneurs)",
    description: "Entrepreneurs",
    keywords: ["창업", "기업가", "Entrepreneurs"],
    ideaCount: 150,
  },

  {
    id: "historical-figures",
    categoryId: "people",
    name: "역사적 인물(Historical Figures)",
    description: "Historical Figures",
    keywords: ["위인", "역사적 인물", "Historical Figures"],
    ideaCount: 150,
  },

  // ======================================================
  // 역사
  // ======================================================

  {
    id: "korean-history",
    categoryId: "history",
    name: "한국사(Korean History)",
    description: "Korean History",
    keywords: ["조선", "한국사", "Korean History"],
    ideaCount: 150,
  },

  {
    id: "world-history",
    categoryId: "history",
    name: "세계사(World History)",
    description: "World History",
    keywords: ["세계사", "World History"],
    ideaCount: 150,
  },

  {
    id: "war-history",
    categoryId: "history",
    name: "전쟁사(War History)",
    description: "War History",
    keywords: ["전쟁", "전쟁사", "War History"],
    ideaCount: 120,
  },

  {
    id: "ancient-history",
    categoryId: "history",
    name: "고대사(Ancient History)",
    description: "Ancient History",
    keywords: ["고대", "고대사", "Ancient History"],
    ideaCount: 100,
  },

  {
    id: "modern-history",
    categoryId: "history",
    name: "근현대사(Modern History)",
    description: "Modern History",
    keywords: ["근현대", "근현대사", "Modern History"],
    ideaCount: 120,
  },

  // ======================================================
  // 과학
  // ======================================================

  {
    id: "physics",
    categoryId: "science",
    name: "물리학(Physics)",
    description: "Physics",
    keywords: ["물리", "물리학", "Physics"],
    ideaCount: 150,
  },

  {
    id: "chemistry",
    categoryId: "science",
    name: "화학(Chemistry)",
    description: "Chemistry",
    keywords: ["화학", "Chemistry"],
    ideaCount: 120,
  },

  {
    id: "biology",
    categoryId: "science",
    name: "생명과학(Biology)",
    description: "Biology",
    keywords: ["생물", "생명과학", "Biology"],
    ideaCount: 120,
  },

  {
    id: "earth-science",
    categoryId: "science",
    name: "지구과학(Earth Science)",
    description: "Earth Science",
    keywords: ["지구", "지구과학", "Earth Science"],
    ideaCount: 100,
  },

  {
    id: "technology-science",
    categoryId: "science",
    name: "첨단과학(Advanced Science)",
    description: "Advanced Science",
    keywords: ["과학기술", "첨단과학", "Advanced Science"],
    ideaCount: 150,
  },

  // ======================================================
  // 자연 & 우주
  // ======================================================

  {
    id: "astronomy",
    categoryId: "nature-space",
    name: "천문학(Astronomy)",
    description: "Astronomy",
    keywords: ["우주", "천문학", "Astronomy"],
    ideaCount: 150,
  },

  {
    id: "space-exploration",
    categoryId: "nature-space",
    name: "우주탐사(Space Exploration)",
    description: "Space Exploration",
    keywords: ["NASA", "우주탐사", "Space Exploration"],
    ideaCount: 120,
  },

  {
    id: "planets",
    categoryId: "nature-space",
    name: "행성(Planets)",
    description: "Planets",
    keywords: ["행성", "Planets"],
    ideaCount: 100,
  },

  {
    id: "wildlife",
    categoryId: "nature-space",
    name: "야생동물(Wildlife)",
    description: "Wildlife",
    keywords: ["동물", "야생동물", "Wildlife"],
    ideaCount: 120,
  },

  {
    id: "natural-disaster",
    categoryId: "nature-space",
    name: "자연재해(Natural Disaster)",
    description: "Natural Disaster",
    keywords: ["지진", "자연재해", "Natural Disaster"],
    ideaCount: 100,
  },

  // ======================================================
  // 철학 & 인문학
  // ======================================================

  {
    id: "philosophy",
    categoryId: "philosophy-humanities",
    name: "철학(Philosophy)",
    description: "Philosophy",
    keywords: ["철학", "Philosophy"],
    ideaCount: 120,
  },

  {
    id: "psychology",
    categoryId: "philosophy-humanities",
    name: "심리학(Psychology)",
    description: "Psychology",
    keywords: ["심리", "심리학", "Psychology"],
    ideaCount: 150,
  },

  {
    id: "humanities",
    categoryId: "philosophy-humanities",
    name: "인문학(Humanities)",
    description: "Humanities",
    keywords: ["인문학", "Humanities"],
    ideaCount: 120,
  },

  {
    id: "critical-thinking",
    categoryId: "philosophy-humanities",
    name: "비판적 사고(Critical Thinking)",
    description: "Critical Thinking",
    keywords: ["사고력", "비판적 사고", "Critical Thinking"],
    ideaCount: 100,
  },

  // ======================================================
  // 종교 & 영성
  // ======================================================

  {
    id: "christianity",
    categoryId: "religion-spirituality",
    name: "기독교(Christianity)",
    description: "Christianity",
    keywords: ["성경", "기독교", "Christianity"],
    ideaCount: 100,
  },

  {
    id: "buddhism",
    categoryId: "religion-spirituality",
    name: "불교(Buddhism)",
    description: "Buddhism",
    keywords: ["불교", "Buddhism"],
    ideaCount: 100,
  },

  {
    id: "meditation",
    categoryId: "wellness-mindfulness",
    name: "명상(Meditation)",
    description: "Meditation",
    keywords: ["명상", "Meditation"],
    ideaCount: 150,
  },

  {
    id: "spiritual-growth",
    categoryId: "religion-spirituality",
    name: "영성(Spiritual Growth)",
    description: "Spiritual Growth",
    keywords: ["영성", "Spiritual Growth"],
    ideaCount: 100,
  },

  // ======================================================
  // 정치 & 사회
  // ======================================================

  {
    id: "politics",
    categoryId: "politics-society",
    name: "정치(Politics)",
    description: "Politics",
    keywords: ["정치", "Politics"],
    ideaCount: 150,
  },

  {
    id: "election",
    categoryId: "politics-society",
    name: "선거(Election)",
    description: "Election",
    keywords: ["선거", "Election"],
    ideaCount: 120,
  },

  {
    id: "social-issues",
    categoryId: "politics-society",
    name: "사회 이슈(Social Issues)",
    description: "Social Issues",
    keywords: ["사회", "사회 이슈", "Social Issues"],
    ideaCount: 150,
  },

  {
    id: "labor",
    categoryId: "politics-society",
    name: "노동(Labor)",
    description: "Labor",
    keywords: ["노동", "Labor"],
    ideaCount: 100,
  },

  {
    id: "population",
    categoryId: "politics-society",
    name: "인구문제(Population)",
    description: "Population",
    keywords: ["인구", "인구문제", "Population"],
    ideaCount: 100,
  },

  // ======================================================
  // 국가 & 지역
  // ======================================================

  {
    id: "korea",
    categoryId: "countries-regions",
    name: "대한민국(Korea)",
    description: "Korea",
    keywords: ["한국", "대한민국", "Korea"],
    ideaCount: 150,
  },

  {
    id: "usa",
    categoryId: "countries-regions",
    name: "미국(USA)",
    description: "USA",
    keywords: ["미국", "USA"],
    ideaCount: 150,
  },

  {
    id: "japan",
    categoryId: "countries-regions",
    name: "일본(Japan)",
    description: "Japan",
    keywords: ["일본", "Japan"],
    ideaCount: 150,
  },

  {
    id: "china",
    categoryId: "countries-regions",
    name: "중국(China)",
    description: "China",
    keywords: ["중국", "China"],
    ideaCount: 120,
  },

  {
    id: "australia",
    categoryId: "countries-regions",
    name: "호주(Australia)",
    description: "Australia",
    keywords: ["호주", "Australia"],
    ideaCount: 120,
  },

  {
    id: "europe",
    categoryId: "countries-regions",
    name: "유럽(Europe)",
    description: "Europe",
    keywords: ["유럽", "Europe"],
    ideaCount: 120,
  },

  // ======================================================
  // 정부지원금 & 복지
  // ======================================================

  {
    id: "government-support",
    categoryId: "government-welfare",
    name: "정부지원금(Government Support)",
    description: "Government Support",
    keywords: ["지원금", "정부지원금", "Government Support"],
    ideaCount: 150,
  },

  {
    id: "startup-support",
    categoryId: "government-welfare",
    name: "창업지원(Startup Support)",
    description: "Startup Support",
    keywords: ["창업지원", "Startup Support"],
    ideaCount: 120,
  },

  {
    id: "youth-policy",
    categoryId: "government-welfare",
    name: "청년정책(Youth Policy)",
    description: "Youth Policy",
    keywords: ["청년", "청년정책", "Youth Policy"],
    ideaCount: 120,
  },

  {
    id: "housing-support",
    categoryId: "government-welfare",
    name: "주거지원(Housing Support)",
    description: "Housing Support",
    keywords: ["주거", "주거지원", "Housing Support"],
    ideaCount: 100,
  },

  {
    id: "welfare",
    categoryId: "government-welfare",
    name: "복지정책(Welfare)",
    description: "Welfare",
    keywords: ["복지", "복지정책", "Welfare"],
    ideaCount: 120,
  },

  // ======================================================
  // 군사 & 국제안보
  // ======================================================

  {
    id: "military",
    categoryId: "military-security",
    name: "군사(Military)",
    description: "Military",
    keywords: ["군사", "Military"],
    ideaCount: 120,
  },

  {
    id: "weapons",
    categoryId: "military-security",
    name: "무기체계(Weapons)",
    description: "Weapons",
    keywords: ["무기", "무기체계", "Weapons"],
    ideaCount: 100,
  },

  {
    id: "war-analysis",
    categoryId: "military-security",
    name: "전쟁분석(War Analysis)",
    description: "War Analysis",
    keywords: ["전쟁", "전쟁분석", "War Analysis"],
    ideaCount: 100,
  },

  {
    id: "international-security",
    categoryId: "military-security",
    name: "국제안보(Security)",
    description: "Security",
    keywords: ["안보", "국제안보", "Security"],
    ideaCount: 120,
  },

  // ======================================================
  // 예술 & 디자인
  // ======================================================

  {
    id: "design",
    categoryId: "art-design",
    name: "디자인(Design)",
    description: "Design",
    keywords: ["디자인", "Design"],
    ideaCount: 150,
  },

  {
    id: "uiux",
    categoryId: "art-design",
    name: "UI/UX",
    description: "UI UX",
    keywords: ["UI", "UX"],
    ideaCount: 120,
  },

  {
    id: "graphic-design",
    categoryId: "art-design",
    name: "그래픽디자인(Graphic Design)",
    description: "Graphic Design",
    keywords: ["그래픽", "그래픽디자인", "Graphic Design"],
    ideaCount: 100,
  },

  {
    id: "photography",
    categoryId: "art-design",
    name: "사진(Photography)",
    description: "Photography",
    keywords: ["사진", "Photography"],
    ideaCount: 120,
  },

  {
    id: "architecture",
    categoryId: "art-design",
    name: "건축(Architecture)",
    description: "Architecture",
    keywords: ["건축", "Architecture"],
    ideaCount: 100,
  },

  // ======================================================
  // 게임
  // ======================================================

  {
    id: "pc-game",
    categoryId: "gaming",
    name: "PC게임(PC Game)",
    description: "PC Game",
    keywords: ["게임", "PC게임", "PC Game"],
    ideaCount: 150,
  },

  {
    id: "mobile-game",
    categoryId: "gaming",
    name: "모바일게임(Mobile Game)",
    description: "Mobile Game",
    keywords: ["모바일게임", "Mobile Game"],
    ideaCount: 150,
  },

  {
    id: "game-review",
    categoryId: "gaming",
    name: "게임 리뷰(Game Review)",
    description: "Game Review",
    keywords: ["리뷰", "게임 리뷰", "Game Review"],
    ideaCount: 120,
  },

  {
    id: "game-guide",
    categoryId: "gaming",
    name: "게임 공략(Game Guide)",
    description: "Game Guide",
    keywords: ["공략", "게임 공략", "Game Guide"],
    ideaCount: 120,
  },

  {
    id: "esports-game",
    categoryId: "gaming",
    name: "e스포츠(eSports)",
    description: "eSports",
    keywords: ["e스포츠", "eSports"],
    ideaCount: 120,
  },

  // ======================================================
  // 제조업 & 산업
  // ======================================================

  {
    id: "semiconductor",
    categoryId: "manufacturing-industry",
    name: "반도체(Semiconductor)",
    description: "Semiconductor",
    keywords: ["반도체", "Semiconductor"],
    ideaCount: 150,
  },

  {
    id: "battery",
    categoryId: "manufacturing-industry",
    name: "배터리(Battery)",
    description: "Battery",
    keywords: ["배터리", "Battery"],
    ideaCount: 150,
  },

  {
    id: "automotive-industry",
    categoryId: "manufacturing-industry",
    name: "자동차산업(Automotive)",
    description: "Automotive",
    keywords: ["자동차산업", "Automotive"],
    ideaCount: 120,
  },

  {
    id: "construction",
    categoryId: "manufacturing-industry",
    name: "건설(Construction)",
    description: "Construction",
    keywords: ["건설", "Construction"],
    ideaCount: 120,
  },

  {
    id: "logistics",
    categoryId: "manufacturing-industry",
    name: "물류(Logistics)",
    description: "Logistics",
    keywords: ["물류", "Logistics"],
    ideaCount: 100,
  },

  {
    id: "smart-factory",
    categoryId: "manufacturing-industry",
    name: "스마트팩토리(Smart Factory)",
    description: "Smart Factory",
    keywords: ["스마트팩토리", "Smart Factory"],
    ideaCount: 100,
  },

  // ======================================================
  // 환경 & ESG
  // ======================================================

  {
    id: "carbon-neutral",
    categoryId: "environment-esg",
    name: "탄소중립(Carbon Neutral)",
    description: "Carbon Neutral",
    keywords: ["탄소중립", "Carbon Neutral"],
    ideaCount: 120,
  },

  {
    id: "renewable-energy",
    categoryId: "environment-esg",
    name: "신재생에너지(Renewable Energy)",
    description: "Renewable Energy",
    keywords: ["태양광", "신재생에너지", "Renewable Energy"],
    ideaCount: 120,
  },

  {
    id: "climate-change",
    categoryId: "environment-esg",
    name: "기후변화(Climate Change)",
    description: "Climate Change",
    keywords: ["기후", "기후변화", "Climate Change"],
    ideaCount: 120,
  },

  {
    id: "esg-management",
    categoryId: "environment-esg",
    name: "ESG 경영(ESG)",
    description: "ESG",
    keywords: ["ESG", "ESG 경영"],
    ideaCount: 120,
  },

  {
    id: "eco-tech",
    categoryId: "environment-esg",
    name: "친환경 기술(Eco Technology)",
    description: "Eco Technology",
    keywords: ["친환경", "친환경 기술", "Eco Technology"],
    ideaCount: 100,
  },

  // ======================================================
  // 1. 스타트업 & 벤처
  // ======================================================
  {
    id: "startup-trend",
    categoryId: "startup-venture",
    name: "스타트업 트렌드(Startup Trend)",
    description: "Startup Trend",
    keywords: ["스타트업", "벤처", "트렌드", "창업 트렌드"],
    ideaCount: 100,
  },
  {
    id: "pitch-deck",
    categoryId: "startup-venture",
    name: "피치덱 작성법(Pitch Deck)",
    description: "Pitch Deck",
    keywords: ["피치덱", "투자 유치", "IR", "사업계획서"],
    ideaCount: 100,
  },

  // ======================================================
  // 2. 웰니스 & 마음챙김
  // ======================================================
  {
    id: "meditation-mindfulness",
    categoryId: "wellness-mindfulness",
    name: "명상 & 마음챙김(Meditation)",
    description: "Meditation & Mindfulness",
    keywords: ["명상", "마음챙김", "스트레스 해소", "정신 건강"],
    ideaCount: 100,
  },
  {
    id: "sleep-hygiene",
    categoryId: "wellness-mindfulness",
    name: "수면 위생(Sleep Hygiene)",
    description: "Sleep Hygiene",
    keywords: ["수면", "불면증", "수면 위생", "숙면"],
    ideaCount: 100,
  },

  // ======================================================
  // 3. 인테리어 & 홈데코
  // ======================================================
  {
    id: "interior-styling",
    categoryId: "interior-homedecor",
    name: "인테리어 스타일링(Interior Styling)",
    description: "Interior Styling",
    keywords: ["인테리어", "홈데코", "방꾸미기", "소품"],
    ideaCount: 100,
  },
  {
    id: "self-diy-interior",
    categoryId: "interior-homedecor",
    name: "셀프 인테리어(Self Interior)",
    description: "Self DIY Interior",
    keywords: ["셀프 인테리어", "DIY", "가구 배치", "리폼"],
    ideaCount: 100,
  },

  // ======================================================
  // 4. 실버 라이프
  // ======================================================
  {
    id: "senior-lifestyle",
    categoryId: "silver-life",
    name: "시니어 라이프(Senior Life)",
    description: "Senior Lifestyle",
    keywords: ["시니어", "노후", "실버 라이프", "액티브 시니어"],
    ideaCount: 100,
  },
  {
    id: "retirement-plan",
    categoryId: "silver-life",
    name: "노후 준비 & 재테크(Retirement Plan)",
    description: "Retirement Plan",
    keywords: ["노후 준비", "은퇴", "연금", "재테크"],
    ideaCount: 100,
  },

  // ======================================================
  // 5. 패션 & 뷰티
  // ======================================================
  {
    id: "fashion-styling",
    categoryId: "fashion-beauty",
    name: "패션 스타일링(Fashion Styling)",
    description: "Fashion Styling",
    keywords: ["패션", "스타일링", "코디", "데일리룩"],
    ideaCount: 100,
  },
  {
    id: "skincare-beauty",
    categoryId: "fashion-beauty",
    name: "스킨케어 & 뷰티(Skincare & Beauty)",
    description: "Skincare & Beauty",
    keywords: ["스킨케어", "뷰티", "화장품", "메이크업"],
    ideaCount: 100,
  },

  // ======================================================
  // 6. 세금 & 세무 전략
  // ======================================================
  {
    id: "tax-saving",
    categoryId: "tax-strategy",
    name: "절세 가이드(Tax Saving)",
    description: "Tax Saving",
    keywords: ["절세", "세금", "소득세", "절세 팁"],
    ideaCount: 100,
  },
  {
    id: "corporate-tax",
    categoryId: "tax-strategy",
    name: "법인세 & 사업자 세무(Corporate Tax)",
    description: "Corporate Tax",
    keywords: ["법인세", "종합소득세", "세무", "개인사업자"],
    ideaCount: 100,
  },

  // ======================================================
  // 7. 권리 구제
  // ======================================================
  {
    id: "labor-rights",
    categoryId: "rights-remedy",
    name: "노동 권리 보호(Labor Rights)",
    description: "Labor Rights",
    keywords: ["근로기준법", "주휴수당", "노동 권리", "부당해고"],
    ideaCount: 100,
  },
  {
    id: "consumer-protection",
    categoryId: "rights-remedy",
    name: "소비자 권리 구제(Consumer Protection)",
    description: "Consumer Protection",
    keywords: ["소비자 피해", "환불", "피해 구제", "소비자원"],
    ideaCount: 100,
  },

  // ======================================================
  // 8. 기후 & 친환경 기술
  // ======================================================
  {
    id: "climate-change-tech",
    categoryId: "climate-eco-tech",
    name: "기후변화 대응 기술(Climate Tech)",
    description: "Climate Tech",
    keywords: ["탄소중립", "기후변화", "기후 기술", "탄소 포집"],
    ideaCount: 100,
  },
  {
    id: "alternative-energy",
    categoryId: "climate-eco-tech",
    name: "대체 에너지 연구(Alternative Energy)",
    description: "Alternative Energy",
    keywords: ["태양광", "수소", "대체 에너지", "풍력"],
    ideaCount: 100,
  },

  // ======================================================
  // 9. 우주 산업 & 탐사
  // ======================================================
  {
    id: "space-business",
    categoryId: "space-industry",
    name: "민간 우주 비즈니스(Space Business)",
    description: "Space Business",
    keywords: ["스페이스X", "위성", "우주 산업", "뉴스페이스"],
    ideaCount: 100,
  },
  {
    id: "space-exploration-trend",
    categoryId: "space-industry",
    name: "우주 탐사 동향(Space Exploration)",
    description: "Space Exploration",
    keywords: ["우주선", "화성", "우주 탐사", "나사"],
    ideaCount: 100,
  },

  // ======================================================
  // 10. 영상 제작
  // ======================================================
  {
    id: "shortform-production",
    categoryId: "video-production",
    name: "숏폼 제작 기법(Shortform Video)",
    description: "Short-form Video Production",
    keywords: ["숏폼", "릴스", "쇼츠", "틱톡", "촬영"],
    ideaCount: 100,
  },
  {
    id: "video-editing",
    categoryId: "video-production",
    name: "비디오 에디팅 팁(Video Editing)",
    description: "Video Editing Tips",
    keywords: ["컷편집", "자막", "프리미어", "캡컷", "편집"],
    ideaCount: 100,
  },

  // ======================================================
  // 11. 콘텐츠 기획
  // ======================================================
  {
    id: "storytelling-formula",
    categoryId: "content-planning",
    name: "스토리텔링 공식(Storytelling)",
    description: "Storytelling Formula",
    keywords: ["스토리텔링", "시놉시스", "대본", "구성"],
    ideaCount: 100,
  },
  {
    id: "concept-ideation",
    categoryId: "content-planning",
    name: "콘텐츠 컨셉 기획(Concept Planning)",
    description: "Concept Ideation",
    keywords: ["기획안", "아이데이션", "컨셉", "기획 공식"],
    ideaCount: 100,
  },

  // ======================================================
  // 12. 음악 & 오디오
  // ======================================================
  {
    id: "song-writing",
    categoryId: "music-audio",
    name: "작사 & 작곡 기법(Songwriting)",
    description: "Song & Lyrics Writing",
    keywords: ["작사", "작곡", "멜로디", "화성학"],
    ideaCount: 100,
  },
  {
    id: "voice-recording",
    categoryId: "music-audio",
    name: "보이스 레코딩 팁(Voice Recording)",
    description: "Voice Recording Tips",
    keywords: ["레코딩", "오디오", "마이크", "음향"],
    ideaCount: 100,
  },

  // ======================================================
  // 13. 창작 플랫폼
  // ======================================================
  {
    id: "youtube-algorithm",
    categoryId: "creator-platform",
    name: "유튜브 알고리즘 공략(YouTube Algorithm)",
    description: "YouTube Algorithm Strategy",
    keywords: ["유튜브 알고리즘", "노출", "클릭률", "시청 시간"],
    ideaCount: 100,
  },
  {
    id: "sns-growth-strategy",
    categoryId: "creator-platform",
    name: "SNS 채널 성장 전략(SNS Growth)",
    description: "SNS Growth Strategy",
    keywords: ["인스타그램 성장", "틱톡 알고리즘", "채널 키우기", "팔로워"],
    ideaCount: 100,
  },

  // ======================================================
  // 14. 미래 모빌리티
  // ======================================================
  {
    id: "autonomous-driving",
    categoryId: "future-mobility",
    name: "자율주행 기술(Autonomous Driving)",
    description: "Autonomous Driving",
    keywords: ["자율주행", "로보택시", "ADAS", "자율주행차"],
    ideaCount: 100,
  },
  {
    id: "uam-mobility",
    categoryId: "future-mobility",
    name: "도심항공교통(UAM)",
    description: "UAM Mobility",
    keywords: ["UAM", "드론택시", "모빌리티", "항공교통"],
    ideaCount: 100,
  },

  // ======================================================
  // 15. 바이오 & 헬스케어 산업
  // ======================================================
  {
    id: "bio-pharmaceutical",
    categoryId: "bio-healthcare",
    name: "제약 바이오 트렌드(Biotech)",
    description: "Bio & Pharmaceutical Trend",
    keywords: ["신약 개발", "제약 바이오", "임상", "바이오텍"],
    ideaCount: 100,
  },
  {
    id: "digital-healthcare",
    categoryId: "bio-healthcare",
    name: "디지털 헬스케어(Digital Healthcare)",
    description: "Digital Healthcare",
    keywords: ["원격 의료", "웨어러블", "디지털 치료제", "헬스케어"],
    ideaCount: 100,
  },

  // ======================================================
  // 사주 & 운세 (fortune-telling)
  // ======================================================
  {
    id: "saju-basics",
    categoryId: "fortune-telling",
    name: "사주명리 입문",
    description: "사주팔자와 만세력, 오행의 기초 분석법",
    keywords: ["사주", "명리학", "만세력", "오행", "사주팔자"],
    ideaCount: 20,
    featured: true,
  },
  {
    id: "tarot-reading",
    categoryId: "fortune-telling",
    name: "타로 카드 해석",
    description: "타로 카드의 의미와 실전 배열법 리딩",
    keywords: ["타로", "타로카드", "메이저 아르카나", "타로점"],
    ideaCount: 20,
    featured: true,
  },
  {
    id: "zodiac-fortune",
    categoryId: "fortune-telling",
    name: "신년 띠별 운세",
    description: "12지신 띠별로 알아보는 올해의 총체적 흐름",
    keywords: ["띠별 운세", "신년운세", "12지신", "신년 운세"],
    ideaCount: 20,
  },
  {
    id: "horoscope",
    categoryId: "fortune-telling",
    name: "별자리 운세",
    description: "황도12궁 점성술로 알아보는 나의 성격과 주간/월간 운세",
    keywords: ["별자리", "점성술", "황도12궁", "별자리 운세"],
    ideaCount: 20,
  },
  {
    id: "compatibility",
    categoryId: "fortune-telling",
    name: "궁합 & 연애운",
    description: "상대방과의 사주적 조화와 연애/결혼 타이밍 분석",
    keywords: ["궁합", "속궁합", "연애운", "애정운", "결혼운"],
    ideaCount: 20,
  },
  {
    id: "feng-shui-living",
    categoryId: "fortune-telling",
    name: "풍수지리 인테리어",
    description: "재물과 건강을 부르는 공간 인테리어와 가구 배치 꿀팁",
    keywords: ["풍수지리", "풍수", "인테리어", "가구 배치"],
    ideaCount: 20,
  },
  {
    id: "naming-saju",
    categoryId: "fortune-telling",
    name: "성명학 & 작명 가이드",
    description: "사주 오행에 기반한 아기 이름 짓기 및 개명 가이드",
    keywords: ["작명", "이름풀이", "성명학", "아기이름", "개명"],
    ideaCount: 20,
  },
  {
    id: "wealth-business-saju",
    categoryId: "fortune-telling",
    name: "재물운 & 사업운 분석",
    description: "사주로 풀어보는 재물의 흐름과 성공적인 창업/직업 선택",
    keywords: ["재물운", "금전운", "사업운", "직업운", "사주 성공"],
    ideaCount: 20,
  },
  {
    id: "dream-meaning",
    categoryId: "fortune-telling",
    name: "꿈해몽 대사전",
    description: "상황별 꿈의 상징성과 길몽, 흉몽, 태몽 등 직관적 분석",
    keywords: ["꿈해몽", "길몽", "흉몽", "태몽", "꿈 분석"],
    ideaCount: 20,
  },
  {
    id: "fortune-app-guide",
    categoryId: "fortune-telling",
    name: "운세 앱 활용 가이드",
    description: "스마트폰으로 사주와 타로를 간편하게 즐기는 인기 플랫폼 리뷰",
    keywords: ["점신", "운세 앱", "포스텔러", "모바일 운세"],
    ideaCount: 20,
  },

  // ======================================================
  // 유튜브 영상제작 (youtube-production)
  // ======================================================
  {
    id: "youtube-planning",
    categoryId: "youtube-production",
    name: "유튜브 기획 & 대본",
    description: "채널 컨셉 기획, 매력적인 영상 시나리오 및 대본 작성 전략",
    keywords: ["유튜브 기획", "대본", "시나리오", "채널 브랜딩"],
    ideaCount: 10,
    featured: true,
  },
  {
    id: "youtube-shooting",
    categoryId: "youtube-production",
    name: "유튜브 촬영 & 장비",
    description: "고품질 스마트폰 촬영 요령 및 조명, 마이크 가성비 장비 세팅법",
    keywords: ["촬영 장비", "조명", "마이크", "카메라 세팅"],
    ideaCount: 10,
  },
  {
    id: "youtube-editing",
    categoryId: "youtube-production",
    name: "유튜브 편집 기술",
    description: "프리미어 프로, 캡컷을 활용한 컷편집, 음향 및 자막 연출 기법",
    keywords: ["컷편집", "자막 폰트", "프리미어 프로", "캡컷"],
    ideaCount: 10,
  },

  // ======================================================
  // 한자 (chinese-characters)
  // ======================================================
  {
    id: "idioms-study",
    categoryId: "chinese-characters",
    name: "고사성어 & 사자성어",
    description: "역사적 배경이 깃든 고사성어의 유래와 실생활 활용",
    keywords: ["사자성어", "고사성어", "한자 성어"],
    ideaCount: 10,
    featured: true,
  },
  {
    id: "chinese-exam",
    categoryId: "chinese-characters",
    name: "급수 한자 & 한문 기초",
    description: "한자검정능력시험 대비 핵심 급수 한자 및 훈음 암기 비결",
    keywords: ["한자 시험", "급수한자", "부수", "훈음"],
    ideaCount: 10,
  },

  // ======================================================
  // 임신 & 육아 (parenting-childcare)
  // ======================================================
  {
    id: "pregnancy-birth",
    categoryId: "parenting-childcare",
    name: "임신 준비 & 출산",
    description: "계획 임신부터 태교, 건강 관리, 안전한 분만 과정 가이드",
    keywords: ["임산부", "태교", "출산 준비", "제왕절개", "자연분만"],
    ideaCount: 10,
    featured: true,
  },
  {
    id: "baby-development",
    categoryId: "parenting-childcare",
    name: "영유아 성장 & 발달",
    description: "시기별 신생아 및 영아 건강 관리, 이유식 식단 및 수면 교육법",
    keywords: ["신생아", "이유식", "수면 교육", "아동 발달"],
    ideaCount: 10,
  },
  {
    id: "child-discipline",
    categoryId: "parenting-childcare",
    name: "아동 심리 & 훈육법",
    description: "우리 아이의 심리 상태 이해와 현명한 훈육 및 긍정적 대화법",
    keywords: ["훈육", "오은영", "아동심리", "감정 코칭"],
    ideaCount: 10,
  },

  // ======================================================
  // 취미 & 레저 (hobbies-leisure)
  // ======================================================
  {
    id: "camping-lifestyle",
    categoryId: "hobbies-leisure",
    name: "캠핑 & 차박 가이드",
    description: "초보 캠퍼를 위한 감성 텐트 장비 추천 및 전국 숨은 차박 명소",
    keywords: ["캠핑 장비", "차박", "캠핑장 추천", "불멍"],
    ideaCount: 10,
    featured: true,
  },
  {
    id: "leisure-sports",
    categoryId: "hobbies-leisure",
    name: "등산 & 아웃도어",
    description: "안전 등산 장비 체크리스트와 난이도별 한국 명산 등반 코스",
    keywords: ["등산 코스", "아웃도어", "하이킹", "트레킹"],
    ideaCount: 10,
  },
];