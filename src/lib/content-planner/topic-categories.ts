import type {
  IdeaHubTopicCategory,
  IdeaHubSubTopic,
} from "./types";

// ======================================================
// Main Categories
// ======================================================

export const topicCategories: IdeaHubTopicCategory[] = [
  {
    id: "ai-tech",
    group: "기술 & 디지털",
    name: "AI & 기술",
    emoji: "🤖",
    description: "인공지능, 생성형 AI, 자동화, AI 비즈니스",
    subTopicCount: 15,
    ideaCount: 1500,
    featured: true,
  },

  {
    id: "it-digital",
    group: "기술 & 디지털",
    name: "IT & 디지털",
    emoji: "💻",
    description: "IT 기기, 앱, 소프트웨어, 디지털 서비스",
    subTopicCount: 15,
    ideaCount: 1200,
    featured: true,
  },

  {
    id: "crypto-blockchain",
    group: "기술 & 디지털",
    name: "가상자산 & 블록체인",
    emoji: "₿",
    description: "비트코인, 이더리움, Web3, NFT",
    subTopicCount: 20,
    ideaCount: 1800,
    featured: true,
  },

  {
    id: "cyber-security",
    group: "기술 & 디지털",
    name: "사이버보안",
    emoji: "🛡️",
    description: "보안, 해킹, 개인정보보호",
    subTopicCount: 12,
    ideaCount: 600,
  },

  {
    id: "data-analytics",
    group: "기술 & 디지털",
    name: "데이터 & 분석",
    emoji: "📊",
    description: "데이터 분석, BI, 통계, 시각화",
    subTopicCount: 12,
    ideaCount: 700,
  },

  // ======================================================
  // 경제 & 비즈니스
  // ======================================================

  {
    id: "economy-finance",
    group: "경제 & 비즈니스",
    name: "경제 & 금융",
    emoji: "💰",
    description: "경제, 투자, 금융, 재테크",
    subTopicCount: 16,
    ideaCount: 1500,
    featured: true,
  },

  {
    id: "business",
    group: "경제 & 비즈니스",
    name: "비즈니스",
    emoji: "📈",
    description: "창업, SaaS, 마케팅, 브랜딩",
    subTopicCount: 12,
    ideaCount: 1200,
  },

  {
    id: "law",
    group: "경제 & 비즈니스",
    name: "법률",
    emoji: "⚖️",
    description: "민법, 형법, 노동법",
    subTopicCount: 10,
    ideaCount: 600,
  },

  {
    id: "career",
    group: "경제 & 비즈니스",
    name: "취업 & 커리어",
    emoji: "💼",
    description: "취업, 이직, 면접, 커리어",
    subTopicCount: 10,
    ideaCount: 700,
  },

  {
    id: "company-brand",
    group: "경제 & 비즈니스",
    name: "기업 & 브랜드",
    emoji: "🏢",
    description: "기업 분석, 브랜드 분석",
    subTopicCount: 10,
    ideaCount: 800,
  },

  {
    id: "shopping",
    group: "경제 & 비즈니스",
    name: "제품 & 쇼핑",
    emoji: "🛒",
    description: "구매 가이드, 제품 리뷰",
    subTopicCount: 12,
    ideaCount: 1000,
  },

  {
    id: "real-estate",
    group: "경제 & 비즈니스",
    name: "부동산",
    emoji: "🏠",
    description: "청약, 아파트, 부동산 투자",
    subTopicCount: 12,
    ideaCount: 1300,
  },

  {
    id: "car",
    group: "생활 & 문화",
    name: "자동차",
    emoji: "🚗",
    description: "자동차, 전기차, 수입차, 중고차",
    subTopicCount: 15,
    ideaCount: 1500,
  },

  {
    id: "travel",
    group: "생활 & 문화",
    name: "여행",
    emoji: "✈️",
    description: "국내외 여행, 항공권, 호텔",
    subTopicCount: 20,
    ideaCount: 1800,
    featured: true,
  },

  {
    id: "sports",
    group: "생활 & 문화",
    name: "스포츠",
    emoji: "⚽",
    description: "축구, 야구, 농구, 골프",
    subTopicCount: 15,
    ideaCount: 1200,
  },

  {
    id: "entertainment",
    group: "생활 & 문화",
    name: "연예 & 문화",
    emoji: "🎬",
    description: "연예, 영화, 드라마, 방송",
    subTopicCount: 15,
    ideaCount: 1400,
  },

  {
    id: "food",
    group: "생활 & 문화",
    name: "음식",
    emoji: "🍜",
    description: "맛집, 요리, 레시피",
    subTopicCount: 15,
    ideaCount: 1200,
  },

  {
    id: "health",
    group: "생활 & 문화",
    name: "건강",
    emoji: "🏥",
    description: "건강관리, 운동, 영양",
    subTopicCount: 18,
    ideaCount: 1500,
    featured: true,
  },

  {
    id: "lifestyle",
    group: "생활 & 문화",
    name: "라이프스타일",
    emoji: "☕",
    description: "생활정보, 취미, 자기계발",
    subTopicCount: 15,
    ideaCount: 1300,
  },

  {
    id: "pets",
    group: "생활 & 문화",
    name: "반려동물",
    emoji: "🐶",
    description: "강아지, 고양이, 반려동물 케어",
    subTopicCount: 12,
    ideaCount: 900,
  },

  // ======================================================
  // 교육 & 지식
  // ======================================================

  {
    id: "education",
    group: "교육 & 지식",
    name: "교육",
    emoji: "🎓",
    description: "교육, 공부법, 자격증, 온라인 학습",
    subTopicCount: 15,
    ideaCount: 1400,
    featured: true,
  },

  {
    id: "people",
    group: "교육 & 지식",
    name: "인물",
    emoji: "👤",
    description: "위인, 기업가, 정치인, 유명 인물",
    subTopicCount: 20,
    ideaCount: 1600,
  },

  {
    id: "history",
    group: "교육 & 지식",
    name: "역사",
    emoji: "🏛️",
    description: "한국사, 세계사, 전쟁사",
    subTopicCount: 20,
    ideaCount: 1500,
  },

  {
    id: "science",
    group: "교육 & 지식",
    name: "과학",
    emoji: "🔬",
    description: "물리학, 화학, 생명과학",
    subTopicCount: 20,
    ideaCount: 1700,
  },

  {
    id: "nature-space",
    group: "교육 & 지식",
    name: "자연 & 우주",
    emoji: "🌎",
    description: "자연, 천문학, 우주탐사",
    subTopicCount: 15,
    ideaCount: 1300,
  },

  {
    id: "philosophy-humanities",
    group: "교육 & 지식",
    name: "철학 & 인문학",
    emoji: "📚",
    description: "철학, 심리학, 인문학",
    subTopicCount: 15,
    ideaCount: 1200,
  },

  {
    id: "religion-spirituality",
    group: "교육 & 지식",
    name: "종교 & 영성",
    emoji: "🙏",
    description: "종교, 명상, 영성",
    subTopicCount: 12,
    ideaCount: 800,
  },

  // ======================================================
  // 사회 & 국제
  // ======================================================

  {
    id: "politics-society",
    group: "사회 & 국제",
    name: "정치 & 사회",
    emoji: "🏛️",
    description: "정치, 사회, 선거, 사회 이슈",
    subTopicCount: 15,
    ideaCount: 1500,
  },

  {
    id: "countries-regions",
    group: "사회 & 국제",
    name: "국가 & 지역",
    emoji: "🌏",
    description: "국가, 도시, 지역 정보",
    subTopicCount: 20,
    ideaCount: 1800,
  },

  {
    id: "government-welfare",
    group: "사회 & 국제",
    name: "정부지원금 & 복지",
    emoji: "💳",
    description: "정부정책, 지원사업, 복지",
    subTopicCount: 15,
    ideaCount: 1300,
  },

  {
    id: "military-security",
    group: "사회 & 국제",
    name: "군사 & 국제안보",
    emoji: "🪖",
    description: "군사, 무기체계, 국제안보",
    subTopicCount: 15,
    ideaCount: 1200,
  },

  // ======================================================
  // 크리에이티브
  // ======================================================

  {
    id: "art-design",
    group: "크리에이티브",
    name: "예술 & 디자인",
    emoji: "🎨",
    description: "예술, 디자인, 사진",
    subTopicCount: 15,
    ideaCount: 1400,
  },

  {
    id: "gaming",
    group: "크리에이티브",
    name: "게임",
    emoji: "🎮",
    description: "게임, 공략, e스포츠",
    subTopicCount: 15,
    ideaCount: 1600,
  },

  // ======================================================
  // 산업 & 미래
  // ======================================================

  {
    id: "manufacturing-industry",
    group: "산업 & 미래",
    name: "제조업 & 산업",
    emoji: "🏭",
    description: "반도체, 배터리, 산업동향",
    subTopicCount: 20,
    ideaCount: 1800,
  },

  {
    id: "environment-esg",
    group: "산업 & 미래",
    name: "환경 & ESG",
    emoji: "🌱",
    description: "환경, ESG, 탄소중립",
    subTopicCount: 15,
    ideaCount: 1200,
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
    name: "ChatGPT",
    description: "OpenAI ChatGPT",
    keywords: ["ChatGPT", "GPT", "OpenAI"],
    ideaCount: 200,
    featured: true,
  },

  {
    id: "gemini",
    categoryId: "ai-tech",
    name: "Gemini",
    description: "Google Gemini",
    keywords: ["Gemini", "Google AI"],
    ideaCount: 180,
  },

  {
    id: "claude",
    categoryId: "ai-tech",
    name: "Claude",
    description: "Anthropic Claude",
    keywords: ["Claude", "Anthropic"],
    ideaCount: 180,
  },

  {
    id: "ai-agents",
    categoryId: "ai-tech",
    name: "AI 에이전트",
    description: "AI Agent",
    keywords: ["AI Agent", "Agent"],
    ideaCount: 150,
  },

  {
    id: "ai-automation",
    categoryId: "ai-tech",
    name: "AI 자동화",
    description: "Automation",
    keywords: ["n8n", "Make", "Zapier"],
    ideaCount: 140,
  },

  {
    id: "ai-coding",
    categoryId: "ai-tech",
    name: "AI 코딩",
    description: "AI Coding",
    keywords: ["Codex", "Cursor"],
    ideaCount: 130,
  },

  {
    id: "ai-image",
    categoryId: "ai-tech",
    name: "AI 이미지 생성",
    description: "Image Generation",
    keywords: ["Flux", "Midjourney"],
    ideaCount: 120,
  },

  {
    id: "ai-video",
    categoryId: "ai-tech",
    name: "AI 영상 생성",
    description: "Video Generation",
    keywords: ["Kling", "Veo"],
    ideaCount: 120,
  },

  {
    id: "ai-voice",
    categoryId: "ai-tech",
    name: "AI 음성 생성",
    description: "Voice Generation",
    keywords: ["ElevenLabs"],
    ideaCount: 100,
  },

  {
    id: "prompt-engineering",
    categoryId: "ai-tech",
    name: "프롬프트 엔지니어링",
    description: "Prompt Engineering",
    keywords: ["Prompt"],
    ideaCount: 100,
  },

  {
    id: "openai",
    categoryId: "ai-tech",
    name: "OpenAI",
    description: "OpenAI",
    keywords: ["OpenAI"],
    ideaCount: 80,
  },

  {
    id: "anthropic",
    categoryId: "ai-tech",
    name: "Anthropic",
    description: "Anthropic",
    keywords: ["Anthropic"],
    ideaCount: 60,
  },

  {
    id: "llm",
    categoryId: "ai-tech",
    name: "대규모 언어모델",
    description: "LLM",
    keywords: ["LLM"],
    ideaCount: 60,
  },

  {
    id: "ai-business",
    categoryId: "ai-tech",
    name: "AI 비즈니스",
    description: "AI Business",
    keywords: ["AI Startup"],
    ideaCount: 80,
  },

  {
    id: "generative-ai",
    categoryId: "ai-tech",
    name: "생성형 AI",
    description: "Generative AI",
    keywords: ["Generative AI"],
    ideaCount: 100,
  },

  // ======================================================
  // IT & 디지털
  // ======================================================

  {
    id: "smartphone",
    categoryId: "it-digital",
    name: "스마트폰",
    description: "Smartphone",
    keywords: ["아이폰", "갤럭시"],
    ideaCount: 120,
  },

  {
    id: "laptop",
    categoryId: "it-digital",
    name: "노트북",
    description: "Laptop",
    keywords: ["맥북", "윈도우"],
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
    name: "소프트웨어",
    description: "Software",
    keywords: ["Software"],
    ideaCount: 90,
  },

  {
    id: "app-recommend",
    categoryId: "it-digital",
    name: "앱 추천",
    description: "Apps",
    keywords: ["앱"],
    ideaCount: 90,
  },

  {
    id: "productivity-tools",
    categoryId: "it-digital",
    name: "생산성 도구",
    description: "Productivity",
    keywords: ["Notion", "Obsidian"],
    ideaCount: 100,
  },

  {
    id: "youtube",
    categoryId: "it-digital",
    name: "유튜브",
    description: "YouTube",
    keywords: ["YouTube"],
    ideaCount: 120,
  },

  {
    id: "instagram",
    categoryId: "it-digital",
    name: "인스타그램",
    description: "Instagram",
    keywords: ["Instagram"],
    ideaCount: 90,
  },

  {
    id: "tiktok",
    categoryId: "it-digital",
    name: "틱톡",
    description: "TikTok",
    keywords: ["TikTok"],
    ideaCount: 90,
  },

  {
    id: "web-services",
    categoryId: "it-digital",
    name: "웹서비스",
    description: "Web Service",
    keywords: ["Web"],
    ideaCount: 100,
  },

  // ======================================================
  // 가상자산 & 블록체인
  // ======================================================

  {
    id: "bitcoin",
    categoryId: "crypto-blockchain",
    name: "비트코인",
    description: "Bitcoin",
    keywords: ["BTC"],
    ideaCount: 200,
    featured: true,
  },

  {
    id: "ethereum",
    categoryId: "crypto-blockchain",
    name: "이더리움",
    description: "Ethereum",
    keywords: ["ETH"],
    ideaCount: 150,
  },

  {
    id: "altcoin",
    categoryId: "crypto-blockchain",
    name: "알트코인",
    description: "Altcoin",
    keywords: ["Altcoin"],
    ideaCount: 150,
  },

  {
    id: "meme-coin",
    categoryId: "crypto-blockchain",
    name: "밈코인",
    description: "Meme Coin",
    keywords: ["DOGE"],
    ideaCount: 120,
  },

  {
    id: "upbit",
    categoryId: "crypto-blockchain",
    name: "업비트",
    description: "Upbit",
    keywords: ["업비트"],
    ideaCount: 100,
  },

  {
    id: "binance",
    categoryId: "crypto-blockchain",
    name: "바이낸스",
    description: "Binance",
    keywords: ["Binance"],
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
    name: "스테이킹",
    description: "Staking",
    keywords: ["Staking"],
    ideaCount: 80,
  },

  // ======================================================
  // 사이버보안
  // ======================================================

  {
    id: "hacking",
    categoryId: "cyber-security",
    name: "해킹",
    description: "Hacking",
    keywords: ["Hacking"],
    ideaCount: 80,
  },

  {
    id: "privacy",
    categoryId: "cyber-security",
    name: "개인정보보호",
    description: "Privacy",
    keywords: ["Privacy"],
    ideaCount: 80,
  },

  {
    id: "ransomware",
    categoryId: "cyber-security",
    name: "랜섬웨어",
    description: "Ransomware",
    keywords: ["Ransomware"],
    ideaCount: 60,
  },

  // ======================================================
  // 데이터 & 분석
  // ======================================================

  {
    id: "data-analysis",
    categoryId: "data-analytics",
    name: "데이터 분석",
    description: "Data Analysis",
    keywords: ["Data"],
    ideaCount: 100,
  },

  {
    id: "big-data",
    categoryId: "data-analytics",
    name: "빅데이터",
    description: "Big Data",
    keywords: ["Big Data"],
    ideaCount: 80,
  },

  {
    id: "statistics",
    categoryId: "data-analytics",
    name: "통계",
    description: "Statistics",
    keywords: ["Statistics"],
    ideaCount: 80,
  },

  {
    id: "data-visualization",
    categoryId: "data-analytics",
    name: "데이터 시각화",
    description: "Visualization",
    keywords: ["Chart"],
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
    name: "금 투자",
    description: "Gold Investment",
    keywords: ["금"],
    ideaCount: 80,
  },

  {
    id: "asset-management",
    categoryId: "economy-finance",
    name: "자산관리",
    description: "Asset Management",
    keywords: ["자산관리"],
    ideaCount: 100,
  },

  {
    id: "retirement",
    categoryId: "economy-finance",
    name: "연금",
    description: "Pension",
    keywords: ["연금"],
    ideaCount: 80,
  },

  {
    id: "insurance",
    categoryId: "economy-finance",
    name: "보험",
    description: "Insurance",
    keywords: ["보험"],
    ideaCount: 80,
  },

  {
    id: "tax-saving",
    categoryId: "economy-finance",
    name: "절세",
    description: "Tax Saving",
    keywords: ["절세"],
    ideaCount: 80,
  },

  // ======================================================
  // 비즈니스
  // ======================================================

  {
    id: "startup",
    categoryId: "business",
    name: "스타트업",
    description: "Startup",
    keywords: ["창업"],
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
    name: "마케팅",
    description: "Marketing",
    keywords: ["마케팅"],
    ideaCount: 120,
  },

  {
    id: "branding",
    categoryId: "business",
    name: "브랜딩",
    description: "Branding",
    keywords: ["브랜드"],
    ideaCount: 100,
  },

  {
    id: "sales",
    categoryId: "business",
    name: "세일즈",
    description: "Sales",
    keywords: ["영업"],
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
    name: "사업전략",
    description: "Business Strategy",
    keywords: ["전략"],
    ideaCount: 100,
  },

  // ======================================================
  // 법률
  // ======================================================

  {
    id: "civil-law",
    categoryId: "law",
    name: "민법",
    description: "Civil Law",
    keywords: ["민법"],
    ideaCount: 80,
  },

  {
    id: "criminal-law",
    categoryId: "law",
    name: "형법",
    description: "Criminal Law",
    keywords: ["형법"],
    ideaCount: 80,
  },

  {
    id: "labor-law",
    categoryId: "law",
    name: "노동법",
    description: "Labor Law",
    keywords: ["노동법"],
    ideaCount: 80,
  },

  {
    id: "copyright",
    categoryId: "law",
    name: "저작권",
    description: "Copyright",
    keywords: ["저작권"],
    ideaCount: 80,
  },

  {
    id: "trademark",
    categoryId: "law",
    name: "상표권",
    description: "Trademark",
    keywords: ["상표"],
    ideaCount: 60,
  },

  {
    id: "contract",
    categoryId: "law",
    name: "계약",
    description: "Contract",
    keywords: ["계약"],
    ideaCount: 60,
  },

  // ======================================================
  // 취업 & 커리어
  // ======================================================

  {
    id: "job-search",
    categoryId: "career",
    name: "취업",
    description: "Employment",
    keywords: ["취업"],
    ideaCount: 100,
  },

  {
    id: "career-change",
    categoryId: "career",
    name: "이직",
    description: "Career Change",
    keywords: ["이직"],
    ideaCount: 100,
  },

  {
    id: "interview",
    categoryId: "career",
    name: "면접",
    description: "Interview",
    keywords: ["면접"],
    ideaCount: 100,
  },

  {
    id: "resume",
    categoryId: "career",
    name: "이력서",
    description: "Resume",
    keywords: ["이력서"],
    ideaCount: 80,
  },

  {
    id: "certificate",
    categoryId: "career",
    name: "자격증",
    description: "Certificate",
    keywords: ["자격증"],
    ideaCount: 80,
  },

  {
    id: "freelancer",
    categoryId: "career",
    name: "프리랜서",
    description: "Freelancer",
    keywords: ["프리랜서"],
    ideaCount: 80,
  },

  // ======================================================
  // 기업 & 브랜드
  // ======================================================

  {
    id: "samsung",
    categoryId: "company-brand",
    name: "삼성",
    description: "Samsung",
    keywords: ["삼성"],
    ideaCount: 80,
  },

  {
    id: "apple",
    categoryId: "company-brand",
    name: "애플",
    description: "Apple",
    keywords: ["애플"],
    ideaCount: 80,
  },

  {
    id: "google",
    categoryId: "company-brand",
    name: "구글",
    description: "Google",
    keywords: ["구글"],
    ideaCount: 80,
  },

  {
    id: "tesla",
    categoryId: "company-brand",
    name: "테슬라",
    description: "Tesla",
    keywords: ["테슬라"],
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
    name: "브랜드 분석",
    description: "Brand Analysis",
    keywords: ["브랜드"],
    ideaCount: 100,
  },

  // ======================================================
  // 제품 & 쇼핑
  // ======================================================

  {
    id: "smartphone-shopping",
    categoryId: "shopping",
    name: "스마트폰",
    description: "Smartphone",
    keywords: ["아이폰", "갤럭시"],
    ideaCount: 120,
  },

  {
    id: "laptop-shopping",
    categoryId: "shopping",
    name: "노트북",
    description: "Laptop",
    keywords: ["맥북"],
    ideaCount: 100,
  },

  {
    id: "camera",
    categoryId: "shopping",
    name: "카메라",
    description: "Camera",
    keywords: ["카메라"],
    ideaCount: 80,
  },

  {
    id: "home-appliance",
    categoryId: "shopping",
    name: "가전제품",
    description: "Home Appliance",
    keywords: ["가전"],
    ideaCount: 100,
  },

  {
    id: "shopping-guide",
    categoryId: "shopping",
    name: "구매 가이드",
    description: "Buying Guide",
    keywords: ["추천"],
    ideaCount: 100,
  },

  {
    id: "product-review",
    categoryId: "shopping",
    name: "제품 리뷰",
    description: "Product Review",
    keywords: ["리뷰"],
    ideaCount: 100,
  },

  // ======================================================
  // 부동산
  // ======================================================

  {
    id: "apartment",
    categoryId: "real-estate",
    name: "아파트",
    description: "Apartment",
    keywords: ["아파트"],
    ideaCount: 150,
  },

  {
    id: "subscription",
    categoryId: "real-estate",
    name: "청약",
    description: "Subscription",
    keywords: ["청약"],
    ideaCount: 120,
  },

  {
    id: "redevelopment",
    categoryId: "real-estate",
    name: "재개발",
    description: "Redevelopment",
    keywords: ["재개발"],
    ideaCount: 100,
  },

  {
    id: "reconstruction",
    categoryId: "real-estate",
    name: "재건축",
    description: "Reconstruction",
    keywords: ["재건축"],
    ideaCount: 100,
  },

  {
    id: "real-estate-investment",
    categoryId: "real-estate",
    name: "부동산 투자",
    description: "Real Estate Investment",
    keywords: ["투자"],
    ideaCount: 120,
  },

  {
    id: "commercial-property",
    categoryId: "real-estate",
    name: "상가",
    description: "Commercial Property",
    keywords: ["상가"],
    ideaCount: 80,
  },

  // ======================================================
  // 자동차
  // ======================================================

  {
    id: "electric-car",
    categoryId: "car",
    name: "전기차",
    description: "Electric Vehicle",
    keywords: ["전기차"],
    ideaCount: 150,
  },

  {
    id: "domestic-car",
    categoryId: "car",
    name: "국산차",
    description: "Korean Cars",
    keywords: ["현대", "기아"],
    ideaCount: 120,
  },

  {
    id: "imported-car",
    categoryId: "car",
    name: "수입차",
    description: "Imported Cars",
    keywords: ["BMW", "벤츠"],
    ideaCount: 120,
  },

  {
    id: "used-car",
    categoryId: "car",
    name: "중고차",
    description: "Used Car",
    keywords: ["중고차"],
    ideaCount: 100,
  },

  {
    id: "car-insurance",
    categoryId: "car",
    name: "자동차보험",
    description: "Car Insurance",
    keywords: ["보험"],
    ideaCount: 80,
  },

  {
    id: "autonomous-driving",
    categoryId: "car",
    name: "자율주행",
    description: "Autonomous Driving",
    keywords: ["자율주행"],
    ideaCount: 100,
  },

  // ======================================================
  // 여행
  // ======================================================

  {
    id: "japan-travel",
    categoryId: "travel",
    name: "일본여행",
    description: "Japan Travel",
    keywords: ["일본"],
    ideaCount: 180,
  },

  {
    id: "australia-travel",
    categoryId: "travel",
    name: "호주여행",
    description: "Australia Travel",
    keywords: ["호주"],
    ideaCount: 120,
  },

  {
    id: "europe-travel",
    categoryId: "travel",
    name: "유럽여행",
    description: "Europe Travel",
    keywords: ["유럽"],
    ideaCount: 150,
  },

  {
    id: "domestic-travel",
    categoryId: "travel",
    name: "국내여행",
    description: "Domestic Travel",
    keywords: ["국내여행"],
    ideaCount: 150,
  },

  {
    id: "air-ticket",
    categoryId: "travel",
    name: "항공권",
    description: "Flight",
    keywords: ["항공권"],
    ideaCount: 120,
  },

  {
    id: "hotel",
    categoryId: "travel",
    name: "호텔",
    description: "Hotel",
    keywords: ["호텔"],
    ideaCount: 120,
  },

  {
    id: "camping",
    categoryId: "travel",
    name: "캠핑",
    description: "Camping",
    keywords: ["캠핑"],
    ideaCount: 100,
  },

  // ======================================================
  // 스포츠
  // ======================================================

  {
    id: "soccer",
    categoryId: "sports",
    name: "축구",
    description: "Football",
    keywords: ["축구"],
    ideaCount: 150,
  },

  {
    id: "baseball",
    categoryId: "sports",
    name: "야구",
    description: "Baseball",
    keywords: ["야구"],
    ideaCount: 120,
  },

  {
    id: "basketball",
    categoryId: "sports",
    name: "농구",
    description: "Basketball",
    keywords: ["농구"],
    ideaCount: 100,
  },

  {
    id: "golf",
    categoryId: "sports",
    name: "골프",
    description: "Golf",
    keywords: ["골프"],
    ideaCount: 120,
  },

  {
    id: "tennis",
    categoryId: "sports",
    name: "테니스",
    description: "Tennis",
    keywords: ["테니스"],
    ideaCount: 100,
  },

  {
    id: "esports",
    categoryId: "sports",
    name: "e스포츠",
    description: "eSports",
    keywords: ["e스포츠"],
    ideaCount: 100,
  },

  // ======================================================
  // 연예 & 문화
  // ======================================================

  {
    id: "movie",
    categoryId: "entertainment",
    name: "영화",
    description: "Movie",
    keywords: ["영화"],
    ideaCount: 150,
  },

  {
    id: "drama",
    categoryId: "entertainment",
    name: "드라마",
    description: "Drama",
    keywords: ["드라마"],
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
    name: "연예인",
    description: "Celebrity",
    keywords: ["연예인"],
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
    name: "맛집",
    description: "Restaurant",
    keywords: ["맛집"],
    ideaCount: 150,
  },

  {
    id: "recipe",
    categoryId: "food",
    name: "레시피",
    description: "Recipe",
    keywords: ["요리"],
    ideaCount: 120,
  },

  {
    id: "coffee",
    categoryId: "food",
    name: "커피",
    description: "Coffee",
    keywords: ["커피"],
    ideaCount: 100,
  },

  {
    id: "diet-food",
    categoryId: "food",
    name: "다이어트 식단",
    description: "Diet Food",
    keywords: ["다이어트"],
    ideaCount: 100,
  },

  // ======================================================
  // 건강
  // ======================================================

  {
    id: "fitness",
    categoryId: "health",
    name: "운동",
    description: "Fitness",
    keywords: ["운동"],
    ideaCount: 150,
  },

  {
    id: "diet",
    categoryId: "health",
    name: "다이어트",
    description: "Diet",
    keywords: ["다이어트"],
    ideaCount: 150,
  },

  {
    id: "nutrition",
    categoryId: "health",
    name: "영양",
    description: "Nutrition",
    keywords: ["영양"],
    ideaCount: 100,
  },

  {
    id: "sleep",
    categoryId: "health",
    name: "수면",
    description: "Sleep",
    keywords: ["수면"],
    ideaCount: 100,
  },

  {
    id: "mental-health",
    categoryId: "health",
    name: "정신건강",
    description: "Mental Health",
    keywords: ["정신건강"],
    ideaCount: 100,
  },

  // ======================================================
  // 라이프스타일
  // ======================================================

  {
    id: "self-development",
    categoryId: "lifestyle",
    name: "자기계발",
    description: "Self Development",
    keywords: ["성장"],
    ideaCount: 150,
  },

  {
    id: "productivity",
    categoryId: "lifestyle",
    name: "생산성",
    description: "Productivity",
    keywords: ["생산성"],
    ideaCount: 120,
  },

  {
    id: "minimalism",
    categoryId: "lifestyle",
    name: "미니멀리즘",
    description: "Minimalism",
    keywords: ["미니멀"],
    ideaCount: 80,
  },

  {
    id: "hobby",
    categoryId: "lifestyle",
    name: "취미",
    description: "Hobby",
    keywords: ["취미"],
    ideaCount: 120,
  },

  // ======================================================
  // 반려동물
  // ======================================================

  {
    id: "dog",
    categoryId: "pets",
    name: "강아지",
    description: "Dog",
    keywords: ["강아지"],
    ideaCount: 150,
  },

  {
    id: "cat",
    categoryId: "pets",
    name: "고양이",
    description: "Cat",
    keywords: ["고양이"],
    ideaCount: 150,
  },

  {
    id: "pet-health",
    categoryId: "pets",
    name: "반려동물 건강",
    description: "Pet Health",
    keywords: ["동물병원"],
    ideaCount: 100,
  },

  {
    id: "pet-food",
    categoryId: "pets",
    name: "반려동물 사료",
    description: "Pet Food",
    keywords: ["사료"],
    ideaCount: 100,
  },

  // ======================================================
  // 교육
  // ======================================================

  {
    id: "study-method",
    categoryId: "education",
    name: "공부법",
    description: "Study Method",
    keywords: ["공부"],
    ideaCount: 150,
  },

  {
    id: "online-course",
    categoryId: "education",
    name: "온라인 강의",
    description: "Online Course",
    keywords: ["강의"],
    ideaCount: 120,
  },

  {
    id: "certificate-education",
    categoryId: "education",
    name: "자격증",
    description: "Certificate",
    keywords: ["자격증"],
    ideaCount: 120,
  },

  {
    id: "language-learning",
    categoryId: "education",
    name: "외국어",
    description: "Language Learning",
    keywords: ["영어"],
    ideaCount: 120,
  },

  {
    id: "university",
    categoryId: "education",
    name: "대학교",
    description: "University",
    keywords: ["대학"],
    ideaCount: 100,
  },

  {
    id: "study-abroad",
    categoryId: "education",
    name: "유학",
    description: "Study Abroad",
    keywords: ["유학"],
    ideaCount: 120,
  },

  // ======================================================
  // 인물
  // ======================================================

  {
    id: "elon-musk",
    categoryId: "people",
    name: "일론 머스크",
    description: "Elon Musk",
    keywords: ["테슬라"],
    ideaCount: 120,
  },

  {
    id: "steve-jobs",
    categoryId: "people",
    name: "스티브 잡스",
    description: "Steve Jobs",
    keywords: ["애플"],
    ideaCount: 100,
  },

  {
    id: "bill-gates",
    categoryId: "people",
    name: "빌 게이츠",
    description: "Bill Gates",
    keywords: ["마이크로소프트"],
    ideaCount: 100,
  },

  {
    id: "sam-altman",
    categoryId: "people",
    name: "샘 알트만",
    description: "Sam Altman",
    keywords: ["OpenAI"],
    ideaCount: 100,
  },

  {
    id: "entrepreneurs",
    categoryId: "people",
    name: "기업가",
    description: "Entrepreneurs",
    keywords: ["창업"],
    ideaCount: 150,
  },

  {
    id: "historical-figures",
    categoryId: "people",
    name: "역사적 인물",
    description: "Historical Figures",
    keywords: ["위인"],
    ideaCount: 150,
  },

  // ======================================================
  // 역사
  // ======================================================

  {
    id: "korean-history",
    categoryId: "history",
    name: "한국사",
    description: "Korean History",
    keywords: ["조선"],
    ideaCount: 150,
  },

  {
    id: "world-history",
    categoryId: "history",
    name: "세계사",
    description: "World History",
    keywords: ["세계사"],
    ideaCount: 150,
  },

  {
    id: "war-history",
    categoryId: "history",
    name: "전쟁사",
    description: "War History",
    keywords: ["전쟁"],
    ideaCount: 120,
  },

  {
    id: "ancient-history",
    categoryId: "history",
    name: "고대사",
    description: "Ancient History",
    keywords: ["고대"],
    ideaCount: 100,
  },

  {
    id: "modern-history",
    categoryId: "history",
    name: "근현대사",
    description: "Modern History",
    keywords: ["근현대"],
    ideaCount: 120,
  },

  // ======================================================
  // 과학
  // ======================================================

  {
    id: "physics",
    categoryId: "science",
    name: "물리학",
    description: "Physics",
    keywords: ["물리"],
    ideaCount: 150,
  },

  {
    id: "chemistry",
    categoryId: "science",
    name: "화학",
    description: "Chemistry",
    keywords: ["화학"],
    ideaCount: 120,
  },

  {
    id: "biology",
    categoryId: "science",
    name: "생명과학",
    description: "Biology",
    keywords: ["생물"],
    ideaCount: 120,
  },

  {
    id: "earth-science",
    categoryId: "science",
    name: "지구과학",
    description: "Earth Science",
    keywords: ["지구"],
    ideaCount: 100,
  },

  {
    id: "technology-science",
    categoryId: "science",
    name: "첨단과학",
    description: "Advanced Science",
    keywords: ["과학기술"],
    ideaCount: 150,
  },

  // ======================================================
  // 자연 & 우주
  // ======================================================

  {
    id: "astronomy",
    categoryId: "nature-space",
    name: "천문학",
    description: "Astronomy",
    keywords: ["우주"],
    ideaCount: 150,
  },

  {
    id: "space-exploration",
    categoryId: "nature-space",
    name: "우주탐사",
    description: "Space Exploration",
    keywords: ["NASA"],
    ideaCount: 120,
  },

  {
    id: "planets",
    categoryId: "nature-space",
    name: "행성",
    description: "Planets",
    keywords: ["행성"],
    ideaCount: 100,
  },

  {
    id: "wildlife",
    categoryId: "nature-space",
    name: "야생동물",
    description: "Wildlife",
    keywords: ["동물"],
    ideaCount: 120,
  },

  {
    id: "natural-disaster",
    categoryId: "nature-space",
    name: "자연재해",
    description: "Natural Disaster",
    keywords: ["지진"],
    ideaCount: 100,
  },

  // ======================================================
  // 철학 & 인문학
  // ======================================================

  {
    id: "philosophy",
    categoryId: "philosophy-humanities",
    name: "철학",
    description: "Philosophy",
    keywords: ["철학"],
    ideaCount: 120,
  },

  {
    id: "psychology",
    categoryId: "philosophy-humanities",
    name: "심리학",
    description: "Psychology",
    keywords: ["심리"],
    ideaCount: 150,
  },

  {
    id: "humanities",
    categoryId: "philosophy-humanities",
    name: "인문학",
    description: "Humanities",
    keywords: ["인문학"],
    ideaCount: 120,
  },

  {
    id: "critical-thinking",
    categoryId: "philosophy-humanities",
    name: "비판적 사고",
    description: "Critical Thinking",
    keywords: ["사고력"],
    ideaCount: 100,
  },

  // ======================================================
  // 종교 & 영성
  // ======================================================

  {
    id: "christianity",
    categoryId: "religion-spirituality",
    name: "기독교",
    description: "Christianity",
    keywords: ["성경"],
    ideaCount: 100,
  },

  {
    id: "buddhism",
    categoryId: "religion-spirituality",
    name: "불교",
    description: "Buddhism",
    keywords: ["불교"],
    ideaCount: 100,
  },

  {
    id: "meditation",
    categoryId: "religion-spirituality",
    name: "명상",
    description: "Meditation",
    keywords: ["명상"],
    ideaCount: 120,
  },

  {
    id: "spiritual-growth",
    categoryId: "religion-spirituality",
    name: "영성",
    description: "Spiritual Growth",
    keywords: ["영성"],
    ideaCount: 100,
  },

  // ======================================================
  // 정치 & 사회
  // ======================================================

  {
    id: "politics",
    categoryId: "politics-society",
    name: "정치",
    description: "Politics",
    keywords: ["정치"],
    ideaCount: 150,
  },

  {
    id: "election",
    categoryId: "politics-society",
    name: "선거",
    description: "Election",
    keywords: ["선거"],
    ideaCount: 120,
  },

  {
    id: "social-issues",
    categoryId: "politics-society",
    name: "사회 이슈",
    description: "Social Issues",
    keywords: ["사회"],
    ideaCount: 150,
  },

  {
    id: "labor",
    categoryId: "politics-society",
    name: "노동",
    description: "Labor",
    keywords: ["노동"],
    ideaCount: 100,
  },

  {
    id: "population",
    categoryId: "politics-society",
    name: "인구문제",
    description: "Population",
    keywords: ["인구"],
    ideaCount: 100,
  },

  // ======================================================
  // 국가 & 지역
  // ======================================================

  {
    id: "korea",
    categoryId: "countries-regions",
    name: "대한민국",
    description: "Korea",
    keywords: ["한국"],
    ideaCount: 150,
  },

  {
    id: "usa",
    categoryId: "countries-regions",
    name: "미국",
    description: "USA",
    keywords: ["미국"],
    ideaCount: 150,
  },

  {
    id: "japan",
    categoryId: "countries-regions",
    name: "일본",
    description: "Japan",
    keywords: ["일본"],
    ideaCount: 150,
  },

  {
    id: "china",
    categoryId: "countries-regions",
    name: "중국",
    description: "China",
    keywords: ["중국"],
    ideaCount: 120,
  },

  {
    id: "australia",
    categoryId: "countries-regions",
    name: "호주",
    description: "Australia",
    keywords: ["호주"],
    ideaCount: 120,
  },

  {
    id: "europe",
    categoryId: "countries-regions",
    name: "유럽",
    description: "Europe",
    keywords: ["유럽"],
    ideaCount: 120,
  },

  // ======================================================
  // 정부지원금 & 복지
  // ======================================================

  {
    id: "government-support",
    categoryId: "government-welfare",
    name: "정부지원금",
    description: "Government Support",
    keywords: ["지원금"],
    ideaCount: 150,
  },

  {
    id: "startup-support",
    categoryId: "government-welfare",
    name: "창업지원",
    description: "Startup Support",
    keywords: ["창업지원"],
    ideaCount: 120,
  },

  {
    id: "youth-policy",
    categoryId: "government-welfare",
    name: "청년정책",
    description: "Youth Policy",
    keywords: ["청년"],
    ideaCount: 120,
  },

  {
    id: "housing-support",
    categoryId: "government-welfare",
    name: "주거지원",
    description: "Housing Support",
    keywords: ["주거"],
    ideaCount: 100,
  },

  {
    id: "welfare",
    categoryId: "government-welfare",
    name: "복지정책",
    description: "Welfare",
    keywords: ["복지"],
    ideaCount: 120,
  },

  // ======================================================
  // 군사 & 국제안보
  // ======================================================

  {
    id: "military",
    categoryId: "military-security",
    name: "군사",
    description: "Military",
    keywords: ["군사"],
    ideaCount: 120,
  },

  {
    id: "weapons",
    categoryId: "military-security",
    name: "무기체계",
    description: "Weapons",
    keywords: ["무기"],
    ideaCount: 100,
  },

  {
    id: "war-analysis",
    categoryId: "military-security",
    name: "전쟁분석",
    description: "War Analysis",
    keywords: ["전쟁"],
    ideaCount: 100,
  },

  {
    id: "international-security",
    categoryId: "military-security",
    name: "국제안보",
    description: "Security",
    keywords: ["안보"],
    ideaCount: 120,
  },

  // ======================================================
  // 예술 & 디자인
  // ======================================================

  {
    id: "design",
    categoryId: "art-design",
    name: "디자인",
    description: "Design",
    keywords: ["디자인"],
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
    name: "그래픽디자인",
    description: "Graphic Design",
    keywords: ["그래픽"],
    ideaCount: 100,
  },

  {
    id: "photography",
    categoryId: "art-design",
    name: "사진",
    description: "Photography",
    keywords: ["사진"],
    ideaCount: 120,
  },

  {
    id: "architecture",
    categoryId: "art-design",
    name: "건축",
    description: "Architecture",
    keywords: ["건축"],
    ideaCount: 100,
  },

  // ======================================================
  // 게임
  // ======================================================

  {
    id: "pc-game",
    categoryId: "gaming",
    name: "PC게임",
    description: "PC Game",
    keywords: ["게임"],
    ideaCount: 150,
  },

  {
    id: "mobile-game",
    categoryId: "gaming",
    name: "모바일게임",
    description: "Mobile Game",
    keywords: ["모바일게임"],
    ideaCount: 150,
  },

  {
    id: "game-review",
    categoryId: "gaming",
    name: "게임 리뷰",
    description: "Game Review",
    keywords: ["리뷰"],
    ideaCount: 120,
  },

  {
    id: "game-guide",
    categoryId: "gaming",
    name: "게임 공략",
    description: "Game Guide",
    keywords: ["공략"],
    ideaCount: 120,
  },

  {
    id: "esports-game",
    categoryId: "gaming",
    name: "e스포츠",
    description: "eSports",
    keywords: ["e스포츠"],
    ideaCount: 120,
  },

  // ======================================================
  // 제조업 & 산업
  // ======================================================

  {
    id: "semiconductor",
    categoryId: "manufacturing-industry",
    name: "반도체",
    description: "Semiconductor",
    keywords: ["반도체"],
    ideaCount: 150,
  },

  {
    id: "battery",
    categoryId: "manufacturing-industry",
    name: "배터리",
    description: "Battery",
    keywords: ["배터리"],
    ideaCount: 150,
  },

  {
    id: "automotive-industry",
    categoryId: "manufacturing-industry",
    name: "자동차산업",
    description: "Automotive",
    keywords: ["자동차산업"],
    ideaCount: 120,
  },

  {
    id: "construction",
    categoryId: "manufacturing-industry",
    name: "건설",
    description: "Construction",
    keywords: ["건설"],
    ideaCount: 120,
  },

  {
    id: "logistics",
    categoryId: "manufacturing-industry",
    name: "물류",
    description: "Logistics",
    keywords: ["물류"],
    ideaCount: 100,
  },

  {
    id: "smart-factory",
    categoryId: "manufacturing-industry",
    name: "스마트팩토리",
    description: "Smart Factory",
    keywords: ["스마트팩토리"],
    ideaCount: 100,
  },

  // ======================================================
  // 환경 & ESG
  // ======================================================

  {
    id: "carbon-neutral",
    categoryId: "environment-esg",
    name: "탄소중립",
    description: "Carbon Neutral",
    keywords: ["탄소중립"],
    ideaCount: 120,
  },

  {
    id: "renewable-energy",
    categoryId: "environment-esg",
    name: "신재생에너지",
    description: "Renewable Energy",
    keywords: ["태양광"],
    ideaCount: 120,
  },

  {
    id: "climate-change",
    categoryId: "environment-esg",
    name: "기후변화",
    description: "Climate Change",
    keywords: ["기후"],
    ideaCount: 120,
  },

  {
    id: "esg-management",
    categoryId: "environment-esg",
    name: "ESG 경영",
    description: "ESG",
    keywords: ["ESG"],
    ideaCount: 120,
  },

  {
    id: "eco-tech",
    categoryId: "environment-esg",
    name: "친환경 기술",
    description: "Eco Technology",
    keywords: ["친환경"],
    ideaCount: 100,
  },
];