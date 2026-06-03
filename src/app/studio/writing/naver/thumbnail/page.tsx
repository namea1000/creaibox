"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  Search,
  Copy,
  RefreshCw,
  Wand2,
  Grid,
  ArrowDownToLine,
  Globe,
  Tag,
  FileText,
  Check,
  Star,
  UploadCloud,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  styleDetail?: string;
  prompt: string;
  type: "ai" | "stock";
  aspectRatio?: string;
  provider?: string;
  sourceType?: string;
  sourceId?: string;
  imageRole?: string;
  isPrimary?: boolean;
}

interface MockPost {
  id: string;
  title: string;
  keyword: string;
  content: string;
  type: "create" | "recreate";
}

interface WritingNaverPostRecord {
  id: string | number;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  target_keyword?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

interface GeneratedImageRecord {
  id: string;
  image_url: string;
  prompt: string;
  style?: string | null;
  aspect_ratio?: string | null;
  provider?: string | null;
  source_type?: string | null;
  source_id?: string | null;
  image_role?: string | null;
  is_primary?: boolean | null;
  created_at?: string | null;
}

interface ThumbnailPreset {
  selectedProvider: string;
  selectedStyle: string;
  selectedStyleDetail: string;
  selectedAspectRatio: string;
  selectedThumbnailType: string;
  selectedTextIntensity: string;
  selectedLayout: string;
  selectedColorTone: string;
  selectedTextLanguage: string;
}

const GENERATED_IMAGE_SOURCE_TYPE = "writing_naver_posts";
const GENERATED_IMAGE_ROLE = "thumbnail";
const THUMBNAIL_PRESET_STORAGE_KEY = "naver:thumbnail:preset:v1";

const SESSION_TIMEOUT_MS = 4000;
const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;

const styleOptions = [
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

const aspectRatioOptions = [
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

const modelOptions = [
  { label: "⭐ OpenAI", value: "openai" },
  { label: "⭐ Gemini Nano Banana - 2.5 Flash", value: "gemini-2.5-flash-image" },
  { label: "⭐ Gemini Nano Banana2 - 3.1 Flash", value: "gemini-3.1-flash-image-preview" },
  { label: "⭐ Gemini Nano Banana Pro - 3 Pro image", value: "gemini-3-pro-image-preview" },
  { label: "⭐ Imagen 4 - Gemini imagen-4", value: "imagen-4.0-generate-001" },
];

const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image";

function normalizeImageModel(value?: string | null) {
  if (!value || value === "gemini") return DEFAULT_IMAGE_MODEL;
  return value;
}

function getImageProviderFromModel(value: string) {
  return value === "openai" ? "openai" : "gemini";
}

type ThumbnailTypeOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

const thumbnailTypeOptions: ThumbnailTypeOption[] = [
  // 1. 인사이트 & 트렌드
  { label: "① 인사이트 & 트렌드", value: "group-insight", disabled: true },
  { label: "⭐ AI 인사이트 포스팅", value: "ai-insight-posting" },
  { label: "⭐ 트렌드 브리프", value: "trend-brief" },
  { label: "⭐ 시장/기술 분석 리포트", value: "market-tech-analysis" },
  { label: "⭐ 최신 뉴스 및 이슈", value: "latest-news-issue" },
  { label: "⭐ 오늘의 주요 이슈 정리", value: "today-issue-summary" },

  // 2. 브랜드 & 퍼블리싱
  { label: "② 브랜드 & 퍼블리싱", value: "group-brand", disabled: true },
  { label: "⭐ 브랜드 스토리 포스팅", value: "brand-story-posting" },
  { label: "⭐ 서비스 소개형 포스팅", value: "service-intro-posting" },
  { label: "⭐ 뉴스레터형 콘텐츠", value: "newsletter-content" },
  { label: "⭐ 기업 소개 및 서비스 안내", value: "company-service-guide" },

  // 3. 기본 및 도구
  { label: "③ 기본 및 도구", value: "group-basic", disabled: true },
  { label: "⭐ 앱 설치 및 상세 가이드", value: "app-install-guide" },
  { label: "⭐ AI 툴 및 웹 서비스 가이드", value: "ai-tool-web-service-guide" },
  { label: "⭐ 유틸리티 설치/사용 방법", value: "utility-how-to" },
  { label: "⭐ AI 자동 포스팅", value: "ai-auto-posting" },
  { label: "⭐ 일반 정보성", value: "general-informational" },
  { label: "⭐ 바로가기 버튼 생성", value: "shortcut-button-generation" },

  // 4. 실무형 가이드
  { label: "④ 실무형 가이드", value: "group-practical-guide", disabled: true },
  { label: "⭐ 실전 가이드 아티클", value: "practical-guide-article" },
  { label: "⭐ SEO 최적화 포스팅", value: "seo-optimized-posting" },
  { label: "⭐ 튜토리얼 & 워크플로우", value: "tutorial-workflow" },
  { label: "⭐ 체크리스트형 콘텐츠", value: "checklist-content" },
  { label: "⭐ 비교 분석형 콘텐츠", value: "comparison-analysis" },
  { label: "⭐ 문제 해결형 콘텐츠", value: "problem-solving-content" },

  // 5. 수익형 핵심
  { label: "⑤ 수익형 핵심", value: "group-profit", disabled: true },
  { label: "⭐ 생활 정책 및 정부 지원금", value: "policy-subsidy" },
  { label: "⭐ 금융 및 재테크", value: "finance-investment" },
  { label: "⭐ 기업 정보 및 주식 정보", value: "company-stock-info" },
  { label: "⭐ 건강 정보 및 영양제 분석", value: "health-supplement-analysis" },
  { label: "⭐ 보험/대출/카드 정보", value: "insurance-loan-card" },
  { label: "⭐ 부동산 정보", value: "real-estate-info" },

  // 6. 리뷰 및 라이프스타일
  { label: "⑥ 리뷰 및 라이프스타일", value: "group-review-lifestyle", disabled: true },
  { label: "⭐ 일반 제품 리뷰", value: "general-product-review" },
  { label: "⭐ 자동차 모델 리뷰", value: "car-model-review" },
  { label: "⭐ 게임 리뷰 및 공략", value: "game-review-guide" },
  { label: "⭐ IT 기기 사용 후기", value: "it-device-review" },
  { label: "⭐ 맛집 리뷰", value: "restaurant-review" },
  { label: "⭐ 국내 여행 정보", value: "domestic-travel-info" },
  { label: "⭐ 영화/드라마 정보 및 리뷰", value: "movie-drama-review" },
  { label: "⭐ 유명 연예인 인물 정보", value: "celebrity-profile" },

  // 7. 교육 & 자기계발
  { label: "⑦ 교육 & 자기계발", value: "group-education", disabled: true },
  { label: "⭐ 교육/가이드형", value: "education-guide" },
  { label: "⭐ 자기계발 포스팅", value: "self-improvement-posting" },
  { label: "⭐ 공부법/학습법", value: "study-method" },
  { label: "⭐ 강의/커리큘럼 소개", value: "course-curriculum-intro" },

  // 8. 기존 핵심 옵션
  { label: "⑧ 기존 핵심 옵션", value: "group-core", disabled: true },
  { label: "⭐ 정보형 썸네일", value: "informational" },
  { label: "⭐ 뉴스/이슈 분석형", value: "news-analysis" },
  { label: "⭐ 주식/재테크 분석형", value: "stock-finance" },
  { label: "⭐ 제품 리뷰형", value: "product-review" },
  { label: "⭐ 맛집/여행 후기형", value: "review-travel" },
];

const textIntensityOptions = [
  { label: "⭐ 텍스트 없음", value: "none" },
  { label: "⭐ 제목만 크게", value: "title-only" },
  { label: "⭐ 제목 + 핵심 포인트", value: "title-points" },
  { label: "⭐ 제목 + 핵심 포인트 + 데이터 박스", value: "title-points-data" },
];

const layoutOptions = [
  { label: "⭐ 좌측 제목 / 우측 비주얼", value: "left-title-right-visual" },
  { label: "⭐ 상단 제목 / 하단 포인트 박스", value: "top-title-bottom-boxes" },
  { label: "⭐ 중앙 대형 제목", value: "center-big-title" },
  { label: "⭐ 카드 3~4개 인포그래픽", value: "card-infographic" },
  { label: "⭐ 차트 강조형", value: "chart-focused" },
];

const colorToneOptions = [
  { label: "⭐ 블루/옐로우 뉴스형", value: "blue-yellow-news" },
  { label: "⭐ 네온 테크", value: "neon-tech" },
  { label: "⭐ 다크 프리미엄", value: "dark-premium" },
  { label: "⭐ 화이트 클린", value: "white-clean" },
  { label: "⭐ 파스텔 블로그형", value: "pastel-blog" },
];

const textLanguageOptions = [
  { label: "⭐ 텍스트 최소화", value: "minimal" },
  { label: "⭐ 한국어", value: "ko" },
  { label: "⭐ 영어", value: "en" },
  { label: "⭐ 일본어", value: "ja" },
  { label: "⭐ 중국어 (간체)", value: "zh-CN" },
  { label: "⭐ 중국어 (번체)", value: "zh-TW" },
  { label: "⭐ 스페인어", value: "es" },
  { label: "⭐ 프랑스어", value: "fr" },
  { label: "⭐ 독일어", value: "de" },
  { label: "⭐ 포르투갈어", value: "pt" }, // 브라질 포함
  { label: "⭐ 이탈리아어", value: "it" },
  { label: "⭐ 러시아어", value: "ru" },
  { label: "⭐ 아랍어", value: "ar" },
  { label: "⭐ 힌디어", value: "hi" },
];

export default function NaverThumbnailPage() {
  const supabase = useMemo(() => createClient(), []);

  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("naver-blog-vector");
  const [selectedStyleDetail, setSelectedStyleDetail] = useState("정보성 썸네일");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("3:2");
  const [selectedProvider, setSelectedProvider] = useState(DEFAULT_IMAGE_MODEL);
  const [selectedThumbnailType, setSelectedThumbnailType] = useState("informational");
  const [selectedTextIntensity, setSelectedTextIntensity] = useState("title-points-data");
  const [selectedLayout, setSelectedLayout] = useState("card-infographic");
  const [selectedColorTone, setSelectedColorTone] = useState("blue-yellow-news");
  const [selectedTextLanguage, setSelectedTextLanguage] = useState("ko");
  const [openSaveMenuId, setOpenSaveMenuId] = useState<string | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [isPresetPanelOpen, setIsPresetPanelOpen] = useState(true);
  const [activePresetSlot, setActivePresetSlot] = useState<string | null>(null);
  const [thumbnailPresets, setThumbnailPresets] = useState<Record<string, ThumbnailPreset | null>>({
    recent: null,
    option1: null,
    option2: null,
    option3: null,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>("tech");
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [isPostListLoading, setIsPostListLoading] = useState(true);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingUpload, setIsDraggingUpload] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const selectedStyleData = styleOptions.find((style) => style.value === selectedStyle);

  const [posts, setPosts] = useState<MockPost[]>([
    {
      id: "1",
      title: "AI 자동화 수익화의 비밀",
      keyword: "AI 자동화",
      content: "AI 자동화를 통한 수익 시스템은 노동의 한계를 뛰어넘습니다...",
      type: "create",
    },
    {
      id: "2",
      title: "천안 맛집 TOP 5 추천",
      keyword: "천안 맛집",
      content: "제주도 바다 배경의 횟집 테이블 위...",
      type: "recreate",
    },
  ]);

  const [gallery, setGallery] = useState<GeneratedImage[]>([]);

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  const getCurrentPreset = useCallback(
    (): ThumbnailPreset => ({
      selectedProvider,
      selectedStyle,
      selectedStyleDetail,
      selectedAspectRatio,
      selectedThumbnailType,
      selectedTextIntensity,
      selectedLayout,
      selectedColorTone,
      selectedTextLanguage,
    }),
    [
      selectedProvider,
      selectedStyle,
      selectedStyleDetail,
      selectedAspectRatio,
      selectedThumbnailType,
      selectedTextIntensity,
      selectedLayout,
      selectedColorTone,
      selectedTextLanguage,
    ]
  );

  const savePresetMap = useCallback((nextPresets: Record<string, ThumbnailPreset | null>) => {
    setThumbnailPresets(nextPresets);

    if (typeof window !== "undefined") {
      localStorage.setItem(THUMBNAIL_PRESET_STORAGE_KEY, JSON.stringify(nextPresets));
    }
  }, []);

  const applyPreset = useCallback((preset: ThumbnailPreset) => {
    setSelectedProvider(normalizeImageModel(preset.selectedProvider));
    setSelectedStyle(preset.selectedStyle);
    setSelectedStyleDetail(preset.selectedStyleDetail);
    setSelectedAspectRatio(preset.selectedAspectRatio);
    setSelectedThumbnailType(preset.selectedThumbnailType);
    setSelectedTextIntensity(preset.selectedTextIntensity);
    setSelectedLayout(preset.selectedLayout);
    setSelectedColorTone(preset.selectedColorTone);
    setSelectedTextLanguage(preset.selectedTextLanguage);
  }, []);

  const getAutoPreset = useCallback((): ThumbnailPreset => {
    const contentSummary = selectedPost?.content.replace(/\s+/g, " ").trim().slice(0, 500) || "";
    const text = `${selectedPost?.title || ""} ${selectedPost?.keyword || ""} ${contentSummary}`.toLowerCase();
    const base = getCurrentPreset();

    if (/주가|주식|증권|금리|투자|재테크|반도체|삼성전자|하이닉스|시장|전망/.test(text)) {
      return {
        ...base,
        selectedStyle: "naver-blog-vector",
        selectedStyleDetail: "주식 차트형",
        selectedThumbnailType: "stock-finance",
        selectedTextIntensity: "title-points-data",
        selectedLayout: "chart-focused",
        selectedColorTone: "blue-yellow-news",
        selectedAspectRatio: "3:2",
      };
    }

    if (/뉴스|이슈|트렌드|전망|분석|리포트/.test(text)) {
      return {
        ...base,
        selectedStyle: "naver-blog-vector",
        selectedStyleDetail: "뉴스 분석형",
        selectedThumbnailType: "news-analysis",
        selectedTextIntensity: "title-points-data",
        selectedLayout: "card-infographic",
        selectedColorTone: "blue-yellow-news",
        selectedAspectRatio: "3:2",
      };
    }

    if (/방법|가이드|사용법|팁|상식|교육|정리|체크|체크리스트|비교|차이|단계|목록|요약/.test(text)) {
      return {
        ...base,
        selectedStyle: "naver-blog-vector",
        selectedStyleDetail: /비교|차이/.test(text)
          ? "비교 분석형"
          : /체크|체크리스트|목록/.test(text)
            ? "체크리스트형"
            : "가이드/방법론형",
        selectedThumbnailType: "education-guide",
        selectedTextIntensity: "title-points",
        selectedLayout: "card-infographic",
        selectedColorTone: "white-clean",
        selectedAspectRatio: "3:2",
      };
    }

    if (/리뷰|후기|맛집|여행|제품|추천/.test(text)) {
      return {
        ...base,
        selectedStyle: "naver-blog-vector",
        selectedStyleDetail: /제품/.test(text) ? "제품 리뷰형" : "정보성 썸네일",
        selectedThumbnailType: /맛집|여행/.test(text) ? "review-travel" : "product-review",
        selectedTextIntensity: "title-points",
        selectedLayout: "left-title-right-visual",
        selectedColorTone: "pastel-blog",
        selectedAspectRatio: "3:2",
      };
    }

    return {
      ...base,
      selectedStyle: "naver-blog-vector",
      selectedStyleDetail: "정보성 썸네일",
      selectedThumbnailType: "informational",
      selectedTextIntensity: "title-points-data",
      selectedLayout: "card-infographic",
      selectedColorTone: "blue-yellow-news",
      selectedAspectRatio: "3:2",
    };
  }, [getCurrentPreset, selectedPost]);

  const promptTemplates: Record<string, { categoryLabel: string; items: string[] }> = {
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

  const resolveUserId = useCallback(async () => {
    for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
      const timeout = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), SESSION_TIMEOUT_MS);
      });

      const sessionUserIdPromise = supabase.auth
        .getSession()
        .then(({ data: { session } }) => session?.user?.id || null)
        .catch(() => null);

      const sessionUserId = await Promise.race([sessionUserIdPromise, timeout]);
      if (sessionUserId) return sessionUserId;

      const userPromise = supabase.auth
        .getUser()
        .then(({ data: { user } }) => user?.id || null)
        .catch(() => null);

      const userId = await Promise.race([userPromise, timeout]);
      if (userId) return userId;

      if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
      }
    }

    return null;
  }, [supabase]);

  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem(THUMBNAIL_PRESET_STORAGE_KEY);
      if (!savedPresets) return;

      const parsed = JSON.parse(savedPresets) as Record<string, ThumbnailPreset | null>;
      const normalizePreset = (preset: ThumbnailPreset | null) =>
        preset
          ? {
            ...preset,
            selectedProvider: normalizeImageModel(preset.selectedProvider),
          }
          : null;

      setThumbnailPresets({
        recent: normalizePreset(parsed.recent || null),
        option1: normalizePreset(parsed.option1 || null),
        option2: normalizePreset(parsed.option2 || null),
        option3: normalizePreset(parsed.option3 || null),
      });
    } catch (error) {
      console.error("썸네일 프리셋 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    if (!activePresetSlot || !["option1", "option2", "option3"].includes(activePresetSlot)) return;

    const nextPresets = {
      ...thumbnailPresets,
      [activePresetSlot]: getCurrentPreset(),
    };

    savePresetMap(nextPresets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activePresetSlot,
    selectedProvider,
    selectedStyle,
    selectedStyleDetail,
    selectedAspectRatio,
    selectedThumbnailType,
    selectedTextIntensity,
    selectedLayout,
    selectedColorTone,
    selectedTextLanguage,
  ]);

  const handlePresetClick = (slot: "recent" | "auto" | "option1" | "option2" | "option3") => {
    if (slot === "auto") {
      applyPreset(getAutoPreset());
      setActivePresetSlot("auto");
      return;
    }

    const savedPreset = thumbnailPresets[slot];

    if (savedPreset) {
      applyPreset(savedPreset);
      setActivePresetSlot(slot);
      return;
    }

    if (slot === "recent") {
      alert("아직 최근 생성 프리셋이 없습니다.");
      return;
    }

    const nextPresets = {
      ...thumbnailPresets,
      [slot]: getCurrentPreset(),
    };

    savePresetMap(nextPresets);
    setActivePresetSlot(slot);
  };

  useEffect(() => {
    const loadPosts = async () => {
      setIsPostListLoading(true);

      try {
        const userId = await resolveUserId();
        if (!userId) return;

        const { data, error } = await supabase
          .from("writing_naver_posts")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        const formattedPosts = ((data || []) as WritingNaverPostRecord[]).map((item) => {
          const fallbackKeyword =
            (item.categories && item.categories[0]) ||
            (item.tags && item.tags[0]) ||
            "일반 원고";

          const normalizedType: "create" | "recreate" =
            item.post_type === "recreate" ? "recreate" : "create";

          return {
            id: String(item.id),
            title: item.title || "제목 없음",
            keyword: item.target_keyword || fallbackKeyword,
            content: item.content || "",
            type: normalizedType,
          };
        });

        if (formattedPosts.length > 0) {
          setPosts(formattedPosts);

          const preferredPost = formattedPosts[0];
          setSelectedPostId(preferredPost.id);
          setStockSearchQuery(preferredPost.keyword);
        } else {
          setPosts([]);
          setSelectedPostId("");
        }
      } catch (error) {
        console.error("썸네일 원고 목록 로드 실패:", error);
      } finally {
        setIsPostListLoading(false);
      }
    };

    void loadPosts();
  }, [resolveUserId, supabase]);

  useEffect(() => {
    const loadGeneratedImages = async () => {
      setIsGalleryLoading(true);

      try {
        if (!selectedPostId) {
          setGallery([]);
          return;
        }

        const userId = await resolveUserId();
        if (!userId) {
          setGallery([]);
          return;
        }

        const { data, error } = await supabase
          .from("generated_images")
          .select("id, image_url, prompt, style, aspect_ratio, provider, source_type, source_id, image_role, is_primary, created_at")
          .eq("user_id", userId)
          .eq("source_type", GENERATED_IMAGE_SOURCE_TYPE)
          .eq("source_id", selectedPostId)
          .eq("image_role", GENERATED_IMAGE_ROLE)
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(60);

        if (error) throw error;

        const savedImages: GeneratedImage[] = ((data || []) as GeneratedImageRecord[]).map((img) => ({
          id: img.id,
          url: img.image_url,
          style: img.style || "AI 썸네일",
          prompt: img.prompt || "",
          type: "ai",
          aspectRatio: img.aspect_ratio || "3:2",
          provider: img.provider || "gemini",
          sourceType: img.source_type || GENERATED_IMAGE_SOURCE_TYPE,
          sourceId: img.source_id || selectedPostId,
          imageRole: img.image_role || GENERATED_IMAGE_ROLE,
          isPrimary: Boolean(img.is_primary),
        }));

        setGallery(savedImages);
      } catch (error) {
        console.error("저장 이미지 로드 실패:", error);
      } finally {
        setIsGalleryLoading(false);
      }
    };

    void loadGeneratedImages();
  }, [resolveUserId, selectedPostId, supabase]);

  const buildPostPromptBase = (post: MockPost | null) => {
    if (!post) {
      return [
        "[원고 제목] 네이버 블로그용 정보형 썸네일",
        "[핵심 키워드] 블로그 썸네일",
        "[본문 요약] 선택된 원고가 없으므로, 검색자가 한눈에 주제를 이해할 수 있는 정보형 썸네일로 구성한다.",
      ].join("\n");
    }

    const contentSnippet = post.content.replace(/\s+/g, " ").trim().slice(0, 220);

    return [
      `[원고 제목] ${post.title}`,
      `[핵심 키워드] ${post.keyword}`,
      `[본문 요약] ${contentSnippet || "본문 내용을 바탕으로 핵심 메시지를 3~4개 포인트로 요약한다."}`,
    ].join("\n");
  };

  const handleSelectPostLink = (post: MockPost) => {
    setSelectedPostId(post.id);
    setIsSyncLoading(true);

    setTimeout(() => {
      setStockSearchQuery(post.keyword);
      setIsSyncLoading(false);
    }, 400);
  };

  const buildImagePrompt = (
    basePrompt: string,
    style: string,
    styleDetail: string,
    aspectRatio: string,
    thumbnailType: string,
    textIntensity: string,
    layout: string,
    colorTone: string,
    textLanguage: string,
    post: MockPost | null
  ) => {
    const styleLabel = styleOptions.find((item) => item.value === style)?.label || style;
    const aspectRatioLabel =
      aspectRatioOptions.find((item) => item.value === aspectRatio)?.label || aspectRatio;
    const thumbnailTypeLabel =
      thumbnailTypeOptions.find((item) => item.value === thumbnailType)?.label || thumbnailType;
    const textIntensityLabel =
      textIntensityOptions.find((item) => item.value === textIntensity)?.label || textIntensity;
    const layoutLabel = layoutOptions.find((item) => item.value === layout)?.label || layout;
    const colorToneLabel = colorToneOptions.find((item) => item.value === colorTone)?.label || colorTone;
    const textLanguageLabel =
      textLanguageOptions.find((item) => item.value === textLanguage)?.label || textLanguage;

    const postContext = post
      ? `주제는 "${post.title}" 이고 핵심 키워드는 "${post.keyword}" 이다. 제목을 한글 대형 타이포그래피로 강조하고, 본문 맥락을 3~4개의 짧은 한글 핵심 포인트로 요약한 정보형 썸네일을 구성하라.`
      : "네이버 블로그에 적합한 한글 정보형 썸네일을 구성하라.";

    return [
      "아래 조건을 정확히 반영해서 네이버 블로그 썸네일 이미지를 만들어줘.",
      "",
      "## 원고 정보",
      basePrompt,
      "",
      "## 선택 옵션",
      `- 이미지 스타일: ${styleLabel}`,
      `- 비주얼 표현 방식: ${styleDetail}`,
      `- 썸네일 유형: ${thumbnailTypeLabel}`,
      `- 텍스트 강도: ${textIntensityLabel}`,
      `- 레이아웃: ${layoutLabel}`,
      `- 컬러 톤: ${colorToneLabel}`,
      `- 텍스트 언어: ${textLanguageLabel}`,
      `- 비율 / 사이즈: ${aspectRatioLabel} (${aspectRatio})`,
      "",
      "## 디자인 지시",
      postContext,
      [
        "예시 이미지처럼 어두운 배경, 파란색/노란색/흰색 대비, 굵은 한글 제목, 뉴스 분석형 인포그래픽 분위기로 디자인하라.",
        "큰 제목은 화면 왼쪽 또는 중앙에 배치하고, 아래에는 핵심 포인트 3~4개를 작은 박스와 아이콘으로 정리하라.",
        "차트, 상승 화살표, 데이터 패널, 산업/주식/트렌드 관련 시각 요소를 주제에 맞게 사용하라.",
        "캔버스 전체를 썸네일 디자인으로 꽉 채워라.",
        "이미지 외곽과 내부 정보 박스는 둥근 모서리 없이 각진 네모 형태로 구성하라.",
        "흰 테두리, 여백, 하단 설명 박스, 3:2 표기, sample 라벨, 불필요한 영어, 무관한 로고, 워터마크, SNS 카드 UI는 절대 넣지 마라.",
        "텍스트는 제목과 핵심 포인트에 필요한 자연스러운 한국어만 사용하라.",
      ].join(" "),
      "",
      "완성 결과물은 설명용 이미지나 목업이 아니라, 바로 블로그 대표 썸네일로 사용할 수 있는 단일 이미지여야 한다.",
    ].join("\n");
  };

  useEffect(() => {
    const generatedPrompt = buildImagePrompt(
      buildPostPromptBase(selectedPost),
      selectedStyle,
      selectedStyleDetail,
      selectedAspectRatio,
      selectedThumbnailType,
      selectedTextIntensity,
      selectedLayout,
      selectedColorTone,
      selectedTextLanguage,
      selectedPost
    );

    setImagePrompt(generatedPrompt);
  }, [
    selectedPost,
    selectedStyle,
    selectedStyleDetail,
    selectedAspectRatio,
    selectedThumbnailType,
    selectedTextIntensity,
    selectedLayout,
    selectedColorTone,
    selectedTextLanguage,
  ]);

  const handleCopyThumbnailPrompt = async () => {
    if (!imagePrompt.trim()) {
      alert("복사할 프롬프트가 없습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(imagePrompt);
      setIsPromptCopied(true);
      setTimeout(() => setIsPromptCopied(false), 1500);
    } catch (error) {
      console.error("프롬프트 복사 실패:", error);
      alert("프롬프트 복사에 실패했습니다.");
    }
  };

  const getUserApiConfig = () => {
    if (selectedProvider === "openai") {
      return {
        provider: "openai",
        apiKey: localStorage.getItem("openai_api_key") || "",
        model:
          localStorage.getItem("openai_model") ||
          "gpt-image-1",
      };
    }

    return {
      provider: "gemini",
      apiKey:
        localStorage.getItem("gemini_postpay_api_key") ||
        localStorage.getItem("gemini_api_key") ||
        "",
      model: normalizeImageModel(selectedProvider),
    };
  };

  const handleAiGenerateImage = async () => {
    if (!imagePrompt.trim()) return alert("프롬프트를 입력해 주세요!");

    const userApiConfig = getUserApiConfig();

    if (!userApiConfig.apiKey) {
      alert(
        "APIVault에서 API Key를 먼저 입력해주세요."
      );
      return;
    }

    setIsGenerating(true);

    try {
      const styleLabel = styleOptions.find((item) => item.value === selectedStyle)?.label || selectedStyle;
      const finalPrompt = imagePrompt.trim();

      const response = await fetch("/api/image-studio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          count: 1,
          aspectRatio: selectedAspectRatio,
          provider: userApiConfig.provider,
          model: userApiConfig.model,
          apiKey: userApiConfig.apiKey,
          style: selectedStyle,
          styleDetail: selectedStyleDetail,
          sourceType: GENERATED_IMAGE_SOURCE_TYPE,
          sourceId: selectedPost?.id || selectedPostId || null,
          imageRole: GENERATED_IMAGE_ROLE,
          markAsPrimary: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const rawMessage = data?.rawError ? `\n\n상세: ${data.rawError}` : "";
        throw new Error(`${data?.error || "이미지 생성에 실패했습니다."}${rawMessage}`);
      }

      const newImages: GeneratedImage[] = (data.images || []).map((img: any, i: number) => ({
        id: String(img.id || `${selectedProvider}-${Date.now()}-${i}`),
        url: img.image_url || img.url,
        style: img.style || styleLabel,
        styleDetail: img.style_detail || selectedStyleDetail,
        prompt: img.prompt || finalPrompt,
        type: "ai",
        aspectRatio: img.aspect_ratio || selectedAspectRatio,
        provider: img.provider || selectedProvider,
        sourceType: img.source_type || GENERATED_IMAGE_SOURCE_TYPE,
        sourceId: img.source_id || selectedPost?.id || selectedPostId,
        imageRole: img.image_role || GENERATED_IMAGE_ROLE,
        isPrimary: Boolean(img.is_primary),
      }));

      if (newImages.length === 0) {
        throw new Error("생성된 썸네일이 없습니다.");
      }

      savePresetMap({
        ...thumbnailPresets,
        recent: getCurrentPreset(),
      });
      setActivePresetSlot("recent");
      setGallery((prev) => [
        ...newImages,
        ...prev.map((image) => ({ ...image, isPrimary: false })),
      ]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "이미지 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchStockImages = () => {
    if (!stockSearchQuery) return alert("키워드를 입력하세요!");

    setIsStockLoading(true);

    setTimeout(() => {
      const stockImages: GeneratedImage[] = [
        {
          id: `stock-${Date.now()}-1`,
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
          style: "무료 스톡 이미지",
          styleDetail: "Unsplash",
          prompt: stockSearchQuery,
          type: "stock",
          aspectRatio: selectedAspectRatio,
          provider: "stock",
        },
      ];

      setGallery((prev) => [...stockImages, ...prev]);
      setIsStockLoading(false);
    }, 1000);
  };

  const convertImageFileToWebp = async (file: File) =>
    new Promise<Blob>((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        const maxWidth = 1600;
        const scale = Math.min(1, maxWidth / image.width);
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("이미지 변환 캔버스를 생성할 수 없습니다."));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              reject(new Error("WebP 이미지 변환에 실패했습니다."));
              return;
            }

            resolve(blob);
          },
          "image/webp",
          0.78
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("이미지를 불러올 수 없습니다."));
      };

      image.src = objectUrl;
    });

  const handleUploadThumbnailFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (files.length === 0) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (!selectedPostId) {
      alert("먼저 왼쪽 원고 목록에서 연결할 글을 선택해 주세요.");
      return;
    }

    setIsUploading(true);

    try {
      const userId = await resolveUserId();

      if (!userId) {
        alert("로그인 세션을 확인할 수 없습니다.");
        return;
      }

      const uploadedImages: GeneratedImage[] = [];

      for (const [index, file] of files.entries()) {
        const webpBlob = await convertImageFileToWebp(file);
        const imageId =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${index}`;
        const filePath = `${userId}/image-studio/${Date.now()}-${imageId}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("generated-images")
          .upload(filePath, webpBlob, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("generated-images")
          .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;
        const { data, error: insertError } = await supabase
          .from("generated_images")
          .insert({
            user_id: userId,
            prompt: [
              `PC 업로드 썸네일 - ${selectedPost?.title || "선택 원고"}`,
              `원본 파일명: ${file.name}`,
              imagePrompt.trim(),
            ]
              .filter(Boolean)
              .join("\n\n"),
            image_url: publicUrl,
            style: selectedStyle,
            aspect_ratio: selectedAspectRatio,
            provider: selectedProvider,
            source_type: GENERATED_IMAGE_SOURCE_TYPE,
            source_id: selectedPostId,
            image_role: GENERATED_IMAGE_ROLE,
            is_primary: false,
          })
          .select("id, image_url, prompt, style, aspect_ratio, provider, source_type, source_id, image_role, is_primary")
          .single();

        if (insertError) {
          throw new Error(`DB 저장 실패: ${insertError.message}`);
        }

        uploadedImages.push({
          id: String(data.id),
          url: data.image_url,
          style: data.style || selectedStyle,
          prompt: data.prompt || "",
          type: "ai",
          aspectRatio: data.aspect_ratio || selectedAspectRatio,
          provider: data.provider || selectedProvider,
          sourceType: data.source_type || GENERATED_IMAGE_SOURCE_TYPE,
          sourceId: data.source_id || selectedPostId,
          imageRole: data.image_role || GENERATED_IMAGE_ROLE,
          isPrimary: false,
        });
      }

      setGallery((prev) => [...uploadedImages, ...prev]);
    } catch (error) {
      console.error("썸네일 업로드 실패:", error);
      alert(error instanceof Error ? error.message : "썸네일 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      setIsDraggingUpload(false);

      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    }
  };

  const handleSetPrimaryThumbnail = async (image: GeneratedImage) => {
    if (!selectedPostId) return;

    try {
      const userId = await resolveUserId();
      if (!userId) {
        alert("로그인 세션을 확인할 수 없습니다.");
        return;
      }

      const { error: clearError } = await supabase
        .from("generated_images")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .eq("source_type", GENERATED_IMAGE_SOURCE_TYPE)
        .eq("source_id", selectedPostId);

      if (clearError) throw clearError;

      const { error: setError } = await supabase
        .from("generated_images")
        .update({ is_primary: true })
        .eq("user_id", userId)
        .eq("id", image.id);

      if (setError) throw setError;

      setGallery((prev) =>
        prev
          .map((item) => ({ ...item, isPrimary: item.id === image.id }))
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      );
    } catch (error) {
      console.error("대표 썸네일 지정 실패:", error);
      alert("대표 썸네일 지정에 실패했습니다.");
    }
  };

  const downloadImage = async (image: GeneratedImage, format: "png" | "webp") => {
    try {
      const response = await fetch(
        `/api/image-studio/download?url=${encodeURIComponent(image.url)}&format=${format}`
      );

      if (!response.ok) {
        throw new Error("이미지 다운로드 변환에 실패했습니다.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `creaibox-thumbnail-${image.id}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      alert("이미지 다운로드에 실패했습니다.");
    }
  };

  const presetButtons = [
    {
      id: "recent" as const,
      label: "최근생성",
      description: thumbnailPresets.recent ? "마지막 생성 조합" : "생성 후 저장",
    },
    {
      id: "auto" as const,
      label: "자동선택",
      description: "원고 기반 추천",
    },
    {
      id: "option1" as const,
      label: "옵션1",
      description: thumbnailPresets.option1 ? "저장됨" : "현재값 저장",
    },
    {
      id: "option2" as const,
      label: "옵션2",
      description: thumbnailPresets.option2 ? "저장됨" : "현재값 저장",
    },
    {
      id: "option3" as const,
      label: "옵션3",
      description: thumbnailPresets.option3 ? "저장됨" : "현재값 저장",
    },
  ];

  return (
    <div className="grid h-[calc(100vh-100px)] w-full grid-cols-1 gap-0 overflow-hidden text-[13px] text-zinc-100 xl:[grid-template-columns:320px_430px_minmax(0,1fr)]">
      <div className="flex h-full flex-col overflow-hidden border-r border-zinc-800/60">
        <h3 className="flex h-14 shrink-0 items-center gap-1.5 border-b border-zinc-800/60 bg-slate-950/40 px-4 text-[13px] font-black uppercase tracking-[0.15em] text-emerald-400">
          <FileText size={13} /> Manuscript Inventory
        </h3>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 px-4 py-4">
          {isPostListLoading ? (
            <div className="h-full flex items-center justify-center text-[13px] text-zinc-500 font-bold">
              원고 목록 불러오는 중...
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handleSelectPostLink(post)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative group ${selectedPostId === post.id
                  ? "bg-emerald-950/10 border-emerald-700/50"
                  : "bg-zinc-950/30 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40"
                  }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span
                    className={`text-[13px] font-black leading-tight ${selectedPostId === post.id ? "text-emerald-400" : "text-zinc-200"
                      }`}
                  >
                    {post.title}
                  </span>
                  {selectedPostId === post.id && <Check size={12} className="text-emerald-400 shrink-0" />}
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`text-[13px] font-black px-1.5 py-0.5 rounded-md border ${post.type === "recreate"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                  >
                    {post.type === "recreate" ? "RECREATE" : "CREATE"}
                  </span>
                  <p className="text-[13px] text-zinc-500 font-medium">#{post.keyword}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-[13px] text-zinc-500 font-bold text-center px-3">
              썸네일에 연결할 저장 원고가 아직 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="flex h-full flex-col overflow-y-auto border-r border-zinc-800/60 custom-scrollbar">
        <div className="shrink-0 pb-4">
          <div className="flex h-14 items-center justify-between gap-3 border-b border-zinc-800/60 bg-slate-950/40 px-4">
            <h3 className="flex items-center gap-1.5 text-[13px] font-black uppercase tracking-[0.15em] text-blue-400">
              <Wand2 size={13} /> AI Thumbnail Engine
            </h3>

            <button
              type="button"
              onClick={() => void handleCopyThumbnailPrompt()}
              className="flex shrink-0 items-center gap-1.5 border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-[13px] font-black text-blue-300 transition hover:bg-blue-500/20"
            >
              <Copy size={13} />
              {isPromptCopied ? "복사 완료" : "프롬프트 복사하기"}
            </button>
          </div>

          <div className="space-y-4 px-4 py-4 text-[13px]">
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="원고와 선택 옵션을 바탕으로 외부 AI 채팅창에 붙여 넣을 썸네일 생성 프롬프트가 자동으로 채워집니다."
              className="h-44 w-full resize-none bg-zinc-950 p-3 text-[13px] leading-relaxed text-zinc-300 placeholder-zinc-700 focus:outline-none"
            />

            <div className="-mx-4 border-y border-zinc-800/80 bg-zinc-950/30">
              <button
                type="button"
                onClick={() => setIsPresetPanelOpen((current) => !current)}
                className="flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-slate-950/70 px-4 text-left text-[13px] font-black text-zinc-100 transition hover:bg-blue-950/20"
              >
                <span className="flex items-center gap-2">
                  <Grid size={14} className="text-blue-400" />
                  썸네일 스타일 세부 옵션
                </span>
                {isPresetPanelOpen ? (
                  <ChevronUp size={17} className="text-zinc-300" />
                ) : (
                  <ChevronDown size={17} className="text-zinc-300" />
                )}
              </button>

              {isPresetPanelOpen && (
                <div>
                  <div className="grid grid-cols-5">
                    {presetButtons.map((preset) => {
                      const isActive = activePresetSlot === preset.id;
                      const isSaved =
                        preset.id === "auto" ||
                        Boolean(thumbnailPresets[preset.id as keyof typeof thumbnailPresets]);

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePresetClick(preset.id)}
                          className={`min-w-0 border-r border-zinc-800/70 px-2 py-2.5 text-center transition last:border-r-0 ${isActive
                            ? "bg-blue-500/15 text-blue-200"
                            : "bg-zinc-950 text-zinc-400 hover:bg-blue-950/20 hover:text-blue-200"
                            }`}
                        >
                          <span className="block truncate text-[13px] font-black">{preset.label}</span>
                          <span
                            className={`mt-0.5 block truncate text-[11px] font-bold ${isSaved ? "text-emerald-400/80" : "text-zinc-600"
                              }`}
                          >
                            {preset.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-zinc-800/80">
                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">1. 이미지 생성 모델</label>
                      <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {modelOptions.map((model) => (
                          <option key={model.value} value={model.value}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">2. 스타일 선택</label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => {
                          const nextStyle = e.target.value;
                          const nextStyleData = styleOptions.find((style) => style.value === nextStyle);

                          setSelectedStyle(nextStyle);
                          setSelectedStyleDetail(nextStyleData?.details[0] || "");
                        }}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {styleOptions.map((style) => (
                          <option key={style.value} value={style.value}>
                            {style.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">3. 비주얼 표현 방식</label>
                      <select
                        value={selectedStyleDetail}
                        onChange={(e) => setSelectedStyleDetail(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {selectedStyleData?.details.map((detail) => (
                          <option key={detail} value={detail}>
                            {detail}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">4. 비율 사이즈 선택</label>
                      <select
                        value={selectedAspectRatio}
                        onChange={(e) => setSelectedAspectRatio(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {aspectRatioOptions.map((ratio) => (
                          <option key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">5. 썸네일 유형</label>
                      <select
                        value={selectedThumbnailType}
                        onChange={(e) => setSelectedThumbnailType(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {thumbnailTypeOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">6. 텍스트 강도</label>
                      <select
                        value={selectedTextIntensity}
                        onChange={(e) => setSelectedTextIntensity(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {textIntensityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">7. 레이아웃</label>
                      <select
                        value={selectedLayout}
                        onChange={(e) => setSelectedLayout(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {layoutOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">8. 컬러 톤</label>
                      <select
                        value={selectedColorTone}
                        onChange={(e) => setSelectedColorTone(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {colorToneOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center transition hover:bg-blue-950/10">
                      <label className="px-4 py-2.5 text-zinc-100 font-bold">9. 텍스트 언어</label>
                      <select
                        value={selectedTextLanguage}
                        onChange={(e) => setSelectedTextLanguage(e.target.value)}
                        className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 text-zinc-100 font-bold outline-none transition hover:bg-blue-950/20"
                      >
                        {textLanguageOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleAiGenerateImage()}
            disabled={isGenerating || isSyncLoading}
            className="w-full py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[13px] font-black rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isGenerating ? "이미지 생성 및 저장 중..." : "AI 썸네일 디자인 시작"}
          </button>
        </div>

        <div className="space-y-3 shrink-0 border-t border-zinc-800/50 px-4 pt-4">
          <h3 className="flex h-10 items-center gap-1.5 border-b border-zinc-800/60 text-[13px] font-black uppercase tracking-[0.15em] text-emerald-400">
            <Globe size={13} /> Free Stock Finder
          </h3>

          <div className="relative text-[13px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input
              type="text"
              value={stockSearchQuery}
              onChange={(e) => setStockSearchQuery(e.target.value)}
              placeholder="무료 실사 이미지 검색"
              className="w-full pl-10 pr-16 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200"
            />
            <button
              onClick={handleSearchStockImages}
              disabled={isStockLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-zinc-800 text-emerald-400 font-black rounded-lg text-[13px]"
            >
              {isStockLoading ? "조회중" : "찾기"}
            </button>
          </div>
        </div>

        <div className="flex min-h-[520px] flex-1 flex-col space-y-3 border-t border-zinc-800/50 pt-4">
          <h3 className="flex h-10 shrink-0 items-center gap-1.5 border-b border-zinc-800/60 text-[13px] font-black uppercase tracking-[0.15em] text-amber-400">
            <Tag size={13} /> Prompt Blueprint Hub
          </h3>

          <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
            {Object.entries(promptTemplates).map(([key, value]) => {
              const isActive = activeCategory === key;

              return (
                <div key={key} className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/30">
                  <button
                    onClick={() => setActiveCategory((current) => (current === key ? null : key))}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-black transition-all ${isActive
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-zinc-500 hover:bg-zinc-900/70 hover:text-zinc-300"
                      }`}
                  >
                    <span>{value.categoryLabel}</span>
                    <span className="text-[13px]">{isActive ? "접기" : "펼치기"}</span>
                  </button>

                  {isActive && (
                    <div className="space-y-1.5 border-t border-zinc-800/70 p-2">
                      {value.items.map((template, idx) => (
                        <div
                          key={idx}
                          onClick={() => setImagePrompt(template)}
                          className="grid cursor-pointer grid-cols-[48px_minmax(0,1fr)] items-start rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3 text-left text-[13px] font-medium leading-relaxed text-zinc-400 transition-all hover:border-amber-500/20 hover:bg-zinc-900/50 hover:text-zinc-200"
                        >
                          <span className="mt-0.5 block font-mono text-[13px] font-bold text-amber-500/50">
                            {String(idx + 1).padStart(2, "0")}.
                          </span>
                          <span className="flex-1 text-zinc-400 leading-tight">{template}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex h-full min-w-0 flex-col overflow-hidden">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/60 bg-slate-950/40 px-4">
          <h2 className="text-[13px] font-black text-zinc-300 flex items-center gap-2">
            <Grid size={16} className="text-blue-400" /> MEDIA LIBRARY
          </h2>

          <div className="flex items-center gap-2">
            {isSyncLoading && (
              <span className="text-[13px] font-black text-emerald-400 animate-pulse bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                원고 분석 연동 중
              </span>
            )}

            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  void handleUploadThumbnailFiles(event.target.files);
                }
              }}
            />

            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[13px] font-black text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-60"
            >
              {isUploading ? <RefreshCw size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              파일 첨부
            </button>
          </div>
        </div>

        <div
          className="flex-1 p-5 overflow-y-auto custom-scrollbar"
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDraggingUpload(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDraggingUpload(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDraggingUpload(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDraggingUpload(false);
            void handleUploadThumbnailFiles(event.dataTransfer.files);
          }}
        >
          {isGalleryLoading ? (
            <div className="flex h-full items-center justify-center text-[13px] font-bold text-zinc-500">
              저장된 썸네일 불러오는 중...
            </div>
          ) : gallery.length === 0 ? (
            <div
              className={`flex h-full flex-col items-center justify-center gap-3 border border-dashed text-center text-[13px] font-bold transition ${isDraggingUpload
                ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                : "border-zinc-800/80 text-zinc-500"
                }`}
            >
              <UploadCloud size={28} className={isDraggingUpload ? "text-emerald-300" : "text-zinc-600"} />
              <div>
                <p>선택한 원고에 저장된 썸네일이 없습니다.</p>
                <p className="mt-1 text-zinc-600">PC 이미지 파일을 드래그하거나 파일 첨부로 업로드하세요.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                disabled={isUploading}
                className={`flex w-full items-center justify-center gap-2 border border-dashed px-4 py-4 text-[13px] font-black transition ${isDraggingUpload
                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:border-emerald-500/40 hover:text-emerald-300"
                  }`}
              >
                {isUploading ? <RefreshCw size={15} className="animate-spin" /> : <UploadCloud size={15} />}
                {isUploading ? "이미지 업로드 중..." : "PC 이미지 파일 첨부 또는 드래그 업로드"}
              </button>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,320px))] gap-5">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="group relative flex flex-col space-y-3 overflow-visible border border-zinc-800/80 bg-zinc-950 p-3 text-[13px]"
                  >
                    <div className="relative w-full aspect-[3/2] overflow-hidden bg-zinc-900 border border-zinc-900 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt="Asset"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {img.isPrimary && (
                          <span className="text-[13px] font-black px-2 py-0.5 bg-amber-500/95 text-zinc-950 shadow-lg shadow-amber-500/20">
                            대표 썸네일
                          </span>
                        )}
                        <span className="text-[13px] font-black px-2 py-0.5 bg-blue-600/90 text-white">
                          {img.type === "ai" ? "AI" : "STOCK"}
                        </span>
                        <span className="text-[13px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 text-zinc-300 backdrop-blur-sm">
                          {img.provider || "-"}
                        </span>
                        <span className="text-[13px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 text-zinc-300 backdrop-blur-sm">
                          {img.aspectRatio || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[13px] text-zinc-500 font-bold leading-normal">
                          {img.style}
                          {img.styleDetail ? ` / ${img.styleDetail}` : ""}
                        </p>
                        <p className="text-[13px] text-zinc-400 leading-normal line-clamp-2">
                          <span className="text-zinc-500 font-bold">Prompt:</span> {img.prompt}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => void handleSetPrimaryThumbnail(img)}
                          disabled={img.isPrimary}
                          className={`py-2 border text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 disabled:cursor-default ${img.isPrimary
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                            : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                            }`}
                        >
                          <Star size={13} /> {img.isPrimary ? "대표" : "대표 지정"}
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(img.url);
                            alert("링크 복사됨!");
                          }}
                          className="py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 hover:bg-zinc-800"
                        >
                          <Copy size={13} /> 링크 복사
                        </button>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenSaveMenuId((current) => (current === img.id ? null : img.id))
                            }
                            className="flex w-full items-center justify-center gap-1.5 border border-zinc-700 bg-zinc-800 py-2 text-[13px] font-black text-emerald-400 transition-all hover:bg-zinc-700"
                          >
                            <ArrowDownToLine size={13} /> 이미지 저장
                          </button>

                          {openSaveMenuId === img.id && (
                            <div className="absolute bottom-full right-0 z-30 mb-2 w-32 border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/40">
                              <button
                                onClick={() => {
                                  setOpenSaveMenuId(null);
                                  void downloadImage(img, "png");
                                }}
                                className="block w-full px-3 py-2 text-left text-[13px] font-bold text-zinc-200 transition hover:bg-zinc-800"
                              >
                                PNG로 저장
                              </button>
                              <button
                                onClick={() => {
                                  setOpenSaveMenuId(null);
                                  void downloadImage(img, "webp");
                                }}
                                className="block w-full border-t border-zinc-800 px-3 py-2 text-left text-[13px] font-bold text-zinc-200 transition hover:bg-zinc-800"
                              >
                                WebP로 저장
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
