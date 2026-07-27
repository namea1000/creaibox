"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Sparkles,
  Globe,
  LayoutGrid,
  Settings2,
  Cpu,
  Store,
  Check,
  ExternalLink,
  Eye,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Send,
  Zap,
  TrendingUp,
  ShieldCheck,
  Award,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  Layers,
  CheckCircle2,
  HelpCircle,
  Lock,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Video,
  Activity,
  Tag,
  Flame,
  Plus,
  Trash2,
  ListPlus,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Bot,
  Terminal,
  Copy,
  Clock,
  User,
  MessageSquareCode,
  CheckCircle,
  CreditCard,
} from "lucide-react";

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

const INITIAL_ADMIN_REQUESTS: AdminRequestItem[] = [
  {
    id: "req-101",
    userId: "usr_sotong",
    userNickname: "소통과채움 협동조합",
    companyName: "소통과 채움",
    category: "Business (행사/기획/렌탈)",
    themeColor: "딥 블루 다크 톤",
    features: ["실적/포트폴리오 갤러리 탭", "실시간 온라인 견적신청 폼", "전용 블로그 카운터", "DoFollow SEO 가산점 Engine"],
    refUrl: "https://sotongcheum.creaibox.com",
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
interface DesignPreset {
  id: string;
  name: string;
  colors: string[];
  vibe: string;
  tag: string;
  description: string;
}

const INDUSTRY_DESIGN_PRESETS: Record<string, DesignPreset[]> = {
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

const getDesignPresetsForCategory = (catName: string): DesignPreset[] => {
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
interface CustomTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  previewUrl: string;
  badge: string;
  accentColor: string;
  bgGradient: string;
  deployCount: number;
}

const CUSTOM_TEMPLATES: CustomTemplate[] = [
  {
    id: "sotongcheum",
    name: "소통과 채움 (Sotongcheum) V1",
    category: "Business",
    description: "공공기관 및 기업 행사 대행, 조직 교육, 소통/힐링 프로그램 및 렌탈 운영 전문 프리미엄 커스텀 홈페이지",
    features: ["실적 갤러리 탭", "온라인 견적신청 폼", "전용 블로그 엔진", "DoFollow SEO 백링크", "3종 디바이스 뷰포트", "1초 자동 구축 지원"],
    previewUrl: "http://sotongcheum.localhost:3000",
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
    badge: "🔥 1위 쇼핑몰",
    accentColor: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-950/40 via-slate-900 to-teal-950/40",
    deployCount: 189,
  },
];

export default function CustomClientSiteStudioPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "migration" | "manage" | "request" | "admin_dashboard">("marketplace");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 테마");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Site AI Migration State
  const [migrationUrl, setMigrationUrl] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any | null>(null);
  const [expandedMigrationFaq, setExpandedMigrationFaq] = useState<number | null>(0);

  const handleSiteMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!migrationUrl.trim()) return;

    setIsMigrating(true);
    try {
      const res = await fetch("/api/studio/site-migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: migrationUrl }),
      });
      const data = await res.json();

      if (res.ok) {
        setMigrationResult(data.data);
      } else {
        alert(data.error || "홈페이지 이관 실패");
      }
    } catch {
      alert("홈페이지 AI 이관 중 오류가 발생했습니다.");
    } finally {
      setIsMigrating(false);
    }
  };

  // Admin Dashboard State
  const [adminRequests, setAdminRequests] = useState<AdminRequestItem[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<AdminRequestItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Preview Modal State (KIMI Style with 3-Device Viewport Mode)
  const [previewModalTemplate, setPreviewModalTemplate] = useState<CustomTemplate | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Deploy Modal State
  const [deployModalTemplate, setDeployModalTemplate] = useState<CustomTemplate | null>(null);
  const [deploySiteName, setDeploySiteName] = useState<string>("");
  const [deploySubdomain, setDeploySubdomain] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);

  // Management State
  const [companyName, setCompanyName] = useState<string>("소통과 채움");
  const [phone, setPhone] = useState<string>("031-292-3806");
  const [address, setAddress] = useState<string>("경기도 화성시 봉담읍 삼천병마로 1234");
  const [email, setEmail] = useState<string>("jenam7720@gmail.com");
  const [bizNumber, setBizNumber] = useState<string>("123-45-67890");
  const [description, setDescription] = useState<string>("공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과 채움 협동조합입니다.");
  const [kakaoLink, setKakaoLink] = useState<string>("https://pf.kakao.com/_example");
  const [themeColor, setThemeColor] = useState<string>("cyan");
  const [headerBlogTitle, setHeaderBlogTitle] = useState<string>("Blog (블로그)");
  const [headerContactTitle, setHeaderContactTitle] = useState<string>("Contact & 구독하기");
  const [heroSlogan, setHeroSlogan] = useState<string>("2026년 자율 AI 에이전트와 웹 서비스의 대격변");
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Dynamic Custom GNB Menus State (Default matches 소통과 채움 GNB)
  const [customMenus, setCustomMenus] = useState<CustomMenuItem[]>([
    { id: "1", label: "홈", url: "/" },
    { id: "2", label: "회사소개", url: "/about" },
    { id: "3", label: "사업영역", url: "/#business" },
    { id: "4", label: "행사렌탈", url: "/#rental" },
    { id: "5", label: "실적갤러리", url: "/#portfolio" },
    { id: "6", label: "블로그", url: "/blog" },
    { id: "7", label: "견적문의", url: "/contact", isRightAligned: true },
  ]);

  // PG Payment Gateway State
  const [pgProvider, setPgProvider] = useState<string>("portone");
  const [pgMid, setPgMid] = useState<string>("imp_884920412491");
  const [pgApiKey, setPgApiKey] = useState<string>("pk_live_creaibox_payment_key_sample");
  const [enableBankTransfer, setEnableBankTransfer] = useState<boolean>(true);
  const [bankAccountInfo, setBankAccountInfo] = useState<string>("기업은행 123-456-7890 (예금주: 소통과채움)");
  const [enableInquiryPayment, setEnableInquiryPayment] = useState<boolean>(true);

  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  const handleAddMenu = () => {
    const newId = String(Date.now());
    setCustomMenus((prev) => [
      ...prev,
      { id: newId, label: `새 메뉴 ${prev.length + 1}`, url: "#custom", isRightAligned: false },
    ]);
  };

  const handleUpdateMenu = (index: number, key: keyof CustomMenuItem, value: any) => {
    setCustomMenus((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleDeleteMenu = (index: number) => {
    setCustomMenus((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Request Form State
  const [reqCategory, setReqCategory] = useState<string>("행사/기획/렌탈");
  const [reqConcept, setReqConcept] = useState<string>("딥 블루 & 세련되고 신뢰감 있는 브랜드 다크 톤");
  const [reqHeaderMenus, setReqHeaderMenus] = useState<string[]>([
    "홈 (Home)",
    "회사소개 / 브랜드 스토리",
    "주요 서비스 / 포트폴리오",
    "실적 갤러리 & 성공 사례",
    "온라인 견적 / 예약 신청",
    "Blog (공식 블로그)",
    "Contact & 1:1 상담",
  ]);
  const [reqFeatures, setReqFeatures] = useState<string[]>([
    "실적/포트폴리오 갤러리 탭",
    "실시간 온라인 견적신청 폼",
    "전용 블로그 & 조회수 카운터",
    "DoFollow SEO 백링크 가산점 엔진",
  ]);

  // Auth & DB Extra Option State
  const [enableAuthDb, setEnableAuthDb] = useState<boolean>(false);
  const [reqAuthMethods, setReqAuthMethods] = useState<string[]>([
    "카카오 1초 소셜 로그인 (Kakao OAuth)",
    "일반 이메일 & 비밀번호 회원가입",
  ]);
  const [reqAuthFeatures, setReqAuthFeatures] = useState<string[]>([
    "회원 전용 마이페이지 (내 견적/예약/결제 내역 조회)",
  ]);
  const [reqRefUrl, setReqRefUrl] = useState<string>("");
  const [reqDetail, setReqDetail] = useState<string>("");
  const [isSubmittingReq, setIsSubmittingReq] = useState<boolean>(false);
  const [reqSuccess, setReqSuccess] = useState<boolean>(false);

  const supabase = createClient();

  // Load Config on Mount
  useEffect(() => {
    async function loadConfig() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("extra_configs, brand_id")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.extra_configs) {
        const cfg = profile.extra_configs as Record<string, any>;
        if (cfg.companyName) setCompanyName(cfg.companyName);
        if (cfg.phone) setPhone(cfg.phone);
        if (cfg.address) setAddress(cfg.address);
        if (cfg.email) setEmail(cfg.email);
        if (cfg.bizNumber) setBizNumber(cfg.bizNumber);
        if (cfg.description) setDescription(cfg.description);
        if (cfg.kakaoLink) setKakaoLink(cfg.kakaoLink);
        if (cfg.themeColor) setThemeColor(cfg.themeColor);
        if (cfg.headerBlogTitle) setHeaderBlogTitle(cfg.headerBlogTitle);
        if (cfg.headerContactTitle) setHeaderContactTitle(cfg.headerContactTitle);
        if (cfg.heroSlogan) setHeroSlogan(cfg.heroSlogan);
        if (cfg.logoUrl) setLogoUrl(cfg.logoUrl);
        if (cfg.customMenus && Array.isArray(cfg.customMenus)) setCustomMenus(cfg.customMenus);
        if (cfg.pgProvider) setPgProvider(cfg.pgProvider);
        if (cfg.pgMid) setPgMid(cfg.pgMid);
        if (cfg.pgApiKey) setPgApiKey(cfg.pgApiKey);
        if (typeof cfg.enableBankTransfer === "boolean") setEnableBankTransfer(cfg.enableBankTransfer);
        if (cfg.bankAccountInfo) setBankAccountInfo(cfg.bankAccountInfo);
        if (typeof cfg.enableInquiryPayment === "boolean") setEnableInquiryPayment(cfg.enableInquiryPayment);
      }
    }
    void loadConfig();
  }, [supabase]);

  // Handle Save Client Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setSaveSuccessMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSaveSuccessMsg("로그인이 필요한 서비스입니다.");
        setIsSavingConfig(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      const existingCfg = (profile?.extra_configs as Record<string, unknown>) || {};
      const newCfg = {
        ...existingCfg,
        companyName,
        phone,
        address,
        email,
        bizNumber,
        description,
        kakaoLink,
        themeColor,
        headerBlogTitle,
        headerContactTitle,
        heroSlogan,
        logoUrl,
        customMenus,
        pgProvider,
        pgMid,
        pgApiKey,
        enableBankTransfer,
        bankAccountInfo,
        enableInquiryPayment,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update({ extra_configs: newCfg })
        .eq("id", user.id);

      if (error) throw error;

      // Broadcast update to shared server cache
      try {
        await fetch("/api/clients/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandId: "sotongcheum", config: newCfg }),
        });
      } catch (e) {}

      setSaveSuccessMsg("✅ 커스텀 사이트 설정이 성공적으로 저장되었습니다! 홈페이지에 실시간 반영됩니다.");
    } catch (err: unknown) {
      console.error(err);
      setSaveSuccessMsg("⚠️ 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Handle Deploy Modal Submit
  const handleConfirmDeploy = async () => {
    if (!deploySiteName || !deploySubdomain) return;
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
    }, 1500);
  };

  // Handle Request Submit
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReq(true);

    setTimeout(() => {
      setIsSubmittingReq(false);
      setReqSuccess(true);
    }, 1200);
  };

  const categories = [
    "전체 테마",
    "Shopping",
    "Blog",
    "Portfolio",
    "Business",
    "Store",
    "Art & Design",
    "Real Estate",
    "Health & Wellness",
    "Education",
    "Magazine",
    "Music",
    "Restaurant",
    "Travel & Lifestyle",
    "Fashion & Beauty",
    "Community & Non-Profit",
    "Entertainment",
  ];

  const filteredTemplates = CUSTOM_TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === "전체 테마" ||
      tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans p-6 lg:p-10 space-y-8">
      {/* Header Banner (Compact Slim Layout) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-5 sm:p-6 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 text-[11px] font-black text-cyan-300 backdrop-blur-md">
              <Sparkles size={13} className="animate-pulse text-cyan-400" />
              <span>CreAibox 커스텀 홈페이지 허브</span>
            </div>

            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-tight text-white whitespace-nowrap">
              100% 독창적인 프리미엄 커스텀 홈페이지{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                템플릿 쇼핑 & 1초 자동 구축 센터
              </span>
            </h1>

            <p className="text-xs text-slate-300 font-medium leading-normal">
              템플릿 쇼핑, 고객 사이트 실시간 기본정보 편집, AI 신규 제작 신청까지 한눈에 관리하세요.
            </p>
          </div>

          {/* Quick Metrics Bar (Slim Chips) */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">템플릿</p>
              <p className="text-sm font-black text-cyan-400">100+ 종</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">구축 시간</p>
              <p className="text-sm font-black text-emerald-400">단 1초</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">SEO 엔진</p>
              <p className="text-sm font-black text-amber-400">DoFollow</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">AI 전담케어</p>
              <p className="text-sm font-black text-purple-400">24시간</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "marketplace"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <LayoutGrid size={16} />
          <span>1️⃣ 템플릿 쇼핑 & 1초 구축</span>
        </button>

        <button
          onClick={() => setActiveTab("migration")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "migration"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-indigo-500/30"
          }`}
        >
          <Globe size={16} className="text-indigo-400 animate-pulse" />
          <span>2️⃣ 🚀 기존 홈페이지 1초 AI 이관</span>
        </button>

        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "manage"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Settings2 size={16} />
          <span>3️⃣ 내 커스텀 사이트 관리</span>
        </button>

        <button
          onClick={() => setActiveTab("request")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "request"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Cpu size={16} />
          <span>4️⃣ AI 커스텀 신규 제작 신청</span>
        </button>

        <button
          onClick={() => setActiveTab("admin_dashboard")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "admin_dashboard"
              ? "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-rose-500/30"
          }`}
        >
          <Bot size={16} className="text-rose-400 animate-pulse" />
          <span>5️⃣ 👑 관리자: 커스텀 신청 현황 ({adminRequests.length}건)</span>
        </button>

      </div>

      {/* --- TAB 1: 템플릿 쇼핑 & 1초 구축 (Custom Template Marketplace) --- */}
      {activeTab === "marketplace" && (
        <div className="space-y-8">
          {/* Controls: Search & Category Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="템플릿 이름, 기능, 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-11 pr-4 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Categories Capsule Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                      : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Cards Grid (Compact 3-Column Grid: Flexible Left Info / Fixed Right Live Web Preview Window) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 overflow-hidden hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="flex flex-row gap-4 items-stretch h-[290px]">
                  {/* Left Side (Flexible Width): Info, Features, Metrics, & Stacked Buttons */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div className="space-y-2">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 text-[9px] font-black text-cyan-300 truncate max-w-[100px]">
                          {tpl.category}
                        </span>
                        <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-[9px] font-black text-amber-300 truncate">
                          {tpl.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                          {tpl.name}
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-slate-300 leading-snug line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Key Features */}
                      <div className="space-y-1 pt-0.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          주요 내장 기능
                        </p>
                        <div className="space-y-0.5">
                          {tpl.features.slice(0, 3).map((ft, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-200">
                              <CheckCircle2 size={11} className="text-cyan-400 shrink-0" />
                              <span className="truncate">{ft}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar: Metrics & Vertically Stacked Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>구축: <strong className="text-cyan-400 font-black">{tpl.deployCount}회</strong></span>
                        <span className="flex items-center gap-0.5 text-emerald-400 text-[9px]">
                          <ShieldCheck size={11} /> DoFollow
                        </span>
                      </div>

                      {/* Vertically Stacked Action Buttons (1초 구축 UNDER 미리보기) */}
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => setPreviewModalTemplate(tpl)}
                          className="w-full flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-950 py-1.5 text-[10px] sm:text-[11px] font-extrabold text-slate-300 hover:border-slate-500 hover:text-white transition-all cursor-pointer"
                        >
                          <Eye size={11} /> 미리보기
                        </button>

                        <button
                          onClick={() => {
                            setDeployModalTemplate(tpl);
                            setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);
                            setDeploySubdomain(`${tpl.id}-mybrand`);
                            setDeploySuccess(false);
                          }}
                          className={`w-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r ${tpl.accentColor} py-1.5 text-[10px] sm:text-[11px] font-black text-white hover:brightness-110 transition-all shadow-md`}
                        >
                          <Zap size={11} /> 1초 구축하기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Fixed Width (w-[210px] shrink-0) - Keeps proportions perfect without horizontal gaps! */}
                  <div className="w-[210px] shrink-0 flex flex-col rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-lg group/preview h-full">
                    {/* Mac Browser Top Bar */}
                    <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 bg-slate-900 border-b border-slate-800 shrink-0">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>

                      <div className="flex-1 flex items-center gap-1 rounded bg-slate-950 border border-slate-800 px-1 py-0.5 text-[8px] font-bold text-slate-400 truncate">
                        <Lock size={8} className="text-emerald-400 shrink-0" />
                        <span className="truncate text-slate-300">
                          {tpl.id}.creaibox.com
                        </span>
                      </div>

                      <button
                        onClick={() => setPreviewModalTemplate(tpl)}
                        title="팝업 미리보기"
                        className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800 transition-all"
                      >
                        <ExternalLink size={10} />
                      </button>
                    </div>

                    {/* Scaled Live Web Page Frame */}
                    <div className="relative flex-1 w-full bg-white overflow-hidden cursor-pointer" onClick={() => setPreviewModalTemplate(tpl)}>
                      <iframe
                        src={`/clients/${tpl.id}`}
                        title={`${tpl.name} Live Preview`}
                        className="w-[600px] h-[800px] origin-top-left scale-[0.35] border-0 pointer-events-none"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/preview:opacity-100 transition-all duration-200 flex items-center justify-center p-1 backdrop-blur-[1px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalTemplate(tpl);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-2 py-1 text-[10px] font-black text-slate-950 shadow-md hover:bg-cyan-400 transition-all cursor-pointer"
                        >
                          <Maximize2 size={11} /> 실시간 뷰
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: 🚀 기존 홈페이지 1초 AI 이관 센터 --- */}
      {activeTab === "migration" && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                AI Full-Automated Site Migration Engine
              </span>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Globe className="text-indigo-400" /> 기존 타사 홈페이지 URL 입력 시 1초 만에 CreAibox 통째 이관
              </h2>
              <p className="text-xs font-medium text-slate-300 max-w-3xl leading-relaxed">
                기존 홈페이지(식당, 병원, 상가, 법률사무소 등)의 주소를 입력하시면 AI 웹 스크레이퍼가 텍스트, 브랜드 이미지, 전화번호, 위치 정보를 파싱하여 0.00초 만에 CreAibox 모던 자사몰 사이트(<code className="text-indigo-300 font-mono">000.creaibox.com</code>)로 복사 생성합니다.
              </p>
            </div>

            <form onSubmit={handleSiteMigration} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={migrationUrl}
                    onChange={(e) => setMigrationUrl(e.target.value)}
                    placeholder="이관할 기존 홈페이지 주소 입력 (예: my-hospital.co.kr, cafe-menu.com)"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isMigrating}
                  className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-sm font-black text-white hover:brightness-110 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {isMigrating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                  <span>1초 AI 이관 시작하기</span>
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    id="site-terms-check"
                    defaultChecked
                    required
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="site-terms-check" className="cursor-pointer">
                    본인 소유 또는 정당한 권한을 위임받은 웹사이트 콘텐츠임을 확인하며, 타인 저작권 도용 시 모든 법적 책임은 신청자 본인에게 있음을 동의합니다. (필수)
                  </label>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium leading-relaxed flex items-start gap-2">
                  <Sparkles size={16} className="text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">💡 이관 및 재발행 안내</span>: 기존 홈페이지를 닫고 완전히 옮겨오실 경우 원본 그대로 100% 정상 검색 노출됩니다.<br />
                    기존 사이트/블로그를 병행 유지하시려면, 이관 완료 후 <span className="font-bold text-amber-300">'커스텀 사이트 관리 ➔ AI 모던 재구성'</span> 메뉴에서 원클릭으로 텍스트를 새로 다듬으실 수 있습니다.
                  </div>
                </div>
              </div>
            </form>

            {/* Migration Results Display */}
            {migrationResult && (
              <div className="rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 space-y-4 text-xs font-medium text-slate-300 animate-fade-in-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
                    <CheckCircle2 size={16} /> 기존 홈페이지 AI 자동 이관 성공!
                  </div>
                  <span className="text-[11px] text-slate-400">{migrationResult.migratedAt}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">이관된 서브도메인 주소</span>
                    <a
                      href={`http://${migrationResult.migratedSubdomain}.localhost:3000`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 font-black text-sm underline flex items-center gap-1 mt-1 hover:text-indigo-300"
                    >
                      http://{migrationResult.migratedSubdomain}.creaibox.com <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">⚡ 메인/헤더 자산 저장소 (속도 최적화)</span>
                    <span className="text-xs text-cyan-300 font-bold mt-1 block">
                      {migrationResult.mainPageCdnStorage || "CreAibox 초고속 클라우드 CDN (Supabase Storage / Vercel Blob)"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">✍️ 블로그 글/이미지 저장소 (원고 동기화)</span>
                    <span className="text-xs text-purple-300 font-bold mt-1 block">
                      {migrationResult.blogArticlesStorage || "크리에이박스 블로그 > 블로그 원고 관리 & CreAibox 클라우드 DB"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 1. AI Migration Live Stats Telemetry Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">누적 홈페이지 이관 성공</span>
              <div className="text-2xl font-black text-indigo-400 flex items-center gap-1.5">
                <span>1,280+</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">건</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">전국 식당, 병원, 법률사무소 1초 전환 완료</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">평균 AI 이관 소요 시간</span>
              <div className="text-2xl font-black text-cyan-400 flex items-center gap-1.5">
                <span>0.78</span>
                <span className="text-xs text-cyan-300 font-bold">초</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">초고속 백엔드 무인 스크레이퍼 처리</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SEO 검색 지수 보존율</span>
              <div className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
                <span>100.0%</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Title, Description, OG 태그 동기화</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">원고 관리함 동기화 건수</span>
              <div className="text-2xl font-black text-purple-400 flex items-center gap-1.5">
                <span>45,200+</span>
                <span className="text-xs text-purple-300 font-bold">개</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">블로그 원고 관리함 자동 동기화</p>
            </div>
          </div>

          {/* 2. Dual Storage Architecture & Engine Features Grid */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="text-cyan-400" size={18} /> CreAibox AI 이중 저장소 & 이관 엔진 핵심 특장점
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                기존 타사 구형 홈페이지를 이관할 때 속도와 자산화를 완벽히 분리 처리합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Zap size={20} />
                </div>
                <h4 className="text-sm font-black text-white">⚡ 초고속 CDN 자산 보관</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  메인 비주얼, 로고, 헤더 페이지 고화질 이미지들을 Supabase CDN으로 0.00초급 전진 배치합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <FileText size={20} />
                </div>
                <h4 className="text-sm font-black text-white">✍️ 블로그 원고 자동 자산화</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  기존 사이트의 블로그/소식 포스팅을 '블로그 원고 관리'함 & CreAibox 클라우드 DB로 동기화합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Video size={20} />
                </div>
                <h4 className="text-sm font-black text-white">🎬 비디오 플레이어 제자리 재생</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  유튜브, 네이버 비디오, 카카오TV 등 플레이어 임베드가 100% 추출되어 본문에서 바로 재생됩니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-sm font-black text-white">🔍 SEO 메타 태그 100% 동기화</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Title, Meta Description, OG 카톡 공유 카드 썸네일까지 구글/네이버 검색 지수를 보존합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Successful Migration Showcase Cards */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="text-amber-400" size={18} /> 대표 홈페이지 1초 이관 완료 성공 사례
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  기존 타사 구형 웹사이트에서 CreAibox 최신 모던 자사몰로 전환된 대표적인 실제 사례입니다.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                100% 라이브 가동 중 ⭕
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  company: "소통층의원",
                  oldDomain: "sotongcheum.co.kr",
                  newSubdomain: "sotongcheum.creaibox.com",
                  category: "병원 / 의원",
                  parsedPages: 6,
                  speed: "0.74초",
                  images: 14,
                },
                {
                  company: "아우라 메리노",
                  oldDomain: "auramerino.com",
                  newSubdomain: "auramerino.creaibox.com",
                  category: "의류 / 쇼핑몰",
                  parsedPages: 8,
                  speed: "0.81초",
                  images: 22,
                },
                {
                  company: "바로 법률사무소",
                  oldDomain: "baro-law.com",
                  newSubdomain: "baro-law.creaibox.com",
                  category: "법무 / 전문직",
                  parsedPages: 5,
                  speed: "0.69초",
                  images: 9,
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Zap size={12} /> {item.speed} 이관 완료
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">{item.company}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">기존: {item.oldDomain}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>파싱된 메인/헤더 페이지</span>
                      <span className="font-bold text-white">{item.parsedPages}개 완료</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>이관된 이미지 자산</span>
                      <span className="font-bold text-white">{item.images}개 (CDN 저장)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                      <span>CreAibox 라이브 주소</span>
                      <a
                        href={`http://${item.newSubdomain.split(".")[0]}.localhost:3000`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 font-bold underline flex items-center gap-0.5 hover:text-indigo-300"
                      >
                        {item.newSubdomain.split(".")[0]}.creaibox.com <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Migration Frequently Asked Questions FAQ Accordion */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <HelpCircle className="text-rose-400" size={18} /> 기존 홈페이지 AI 자동 이관 자주 묻는 질문 (FAQ)
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                기존 타사 구형 웹사이트 이관 시 자주 문의하시는 질문과 답변입니다.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  q: "이관 후 내 홈페이지 주소는 어떻게 생성되나요?",
                  a: "이관 즉시 https://000.creaibox.com 형태의 무상 서브도메인이 1초 만에 자동 생성됩니다. 또한 [도메인 조회 & 구매] 메뉴에서 사장님의 독자 도메인(mybrand.com / mybrand.kr)을 연결하실 수 있습니다.",
                },
                {
                  q: "기존 사이트의 블로그 포스팅이나 이미지는 어디로 저장되나요?",
                  a: "메인 페이지의 비주얼 자산은 초고속 CDN으로, 기존 블로그 글과 본문 이미지들은 [크리에이박스 블로그] -> [블로그 원고 관리]함과 CreAibox 클라우드 DB로 자동 동기화 보관됩니다.",
                },
                {
                  q: "기존 구형 사이트의 네이버/구글 검색 순위가 영향받지 않나요?",
                  a: "기존 사이트를 닫고 완전히 옮겨오실 경우 Title Tag, Description 메타 태그가 100% 동일하게 이관되므로 검색 지수가 그대로 보존됩니다. 병행 유지 시에는 [커스텀 사이트 관리] -> [AI 모던 재구성] 버튼을 눌러 문장을 원클릭으로 재구성하시면 패널티 없이 완벽 노출됩니다.",
                },
                {
                  q: "유튜브 동영상이나 카카오TV 비디오도 같이 넘어오나요?",
                  a: "네! 기존 홈페이지 본문에 삽입되어 있던 유튜브, 네이버 비디오, 카카오TV 등 플레이어 임베드 코드(iframe)가 100% 파싱되어 CreAibox 자사몰 본문에서 그대로 제자리 재생(In-place Playback)됩니다.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <button
                    onClick={() => setExpandedMigrationFaq(expandedMigrationFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-black text-slate-200">Q. {faq.q}</span>
                    {expandedMigrationFaq === idx ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </button>

                  {expandedMigrationFaq === idx && (
                    <div className="p-4 pt-0 text-xs font-medium text-slate-400 border-t border-slate-900 bg-slate-900/30 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: 내 커스텀 사이트 관리 (Active Custom Site Manager) --- */}
      {activeTab === "manage" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Active Site Status & Quick Action */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Globe size={24} />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> 100% 정상 작동 중
                  </span>
                  <h3 className="text-lg font-black text-white">{companyName} 공식 홈페이지</h3>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs font-semibold text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">브랜드 ID</span>
                  <span className="font-mono text-cyan-300 font-bold">sotongcheum</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">연결 서브도메인</span>
                  <a
                    href="http://sotongcheum.localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-400 hover:underline flex items-center gap-1"
                  >
                    sotongcheum.localhost:3000 <ExternalLink size={11} />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SEO 백링크 엔진</span>
                  <span className="text-emerald-400 font-bold">DoFollow Active (Link Equity)</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-2 pt-4 border-t border-slate-800/80">
                <a
                  href="http://sotongcheum.localhost:3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={14} className="text-cyan-400" /> 커스텀 홈페이지 접속하기
                  </span>
                  <ExternalLink size={14} />
                </a>

                <Link
                  href="/studio/writing/creaibox/new-post"
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-200 hover:border-blue-500 hover:text-blue-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-blue-400" /> 블로그 새 포스팅 작성
                  </span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/studio/writing/creaibox/blog-management"
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-200 hover:border-purple-500 hover:text-purple-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-purple-400" /> 누적 조회수 & 통계 대시보드
                  </span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2: 💳 PG 결제 게이트웨이 & 결제 수단 세팅 (Left Column Standalone Box) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
              <div className="space-y-1 border-b border-slate-800/80 pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <CreditCard size={12} />
                  <span>결제 수금 직접 입금 지원</span>
                </div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>💳 PG 결제 게이트웨이 & 결제 세팅</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                  자사몰/커스텀 사이트에서 소비자의 결제금액을 직접 수금할 PG 상점 키 및 결제 수단을 설정하세요.
                </p>
              </div>

              {/* PG Provider Select */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300">주요 PG 결제 게이트웨이 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "portone", name: "포트원 (PortOne)" },
                    { id: "toss", name: "토스페이먼츠 (Toss)" },
                    { id: "kakaopay", name: "카카오페이 전용" },
                    { id: "none", name: "PG 결제 미사용" },
                  ].map((pg) => (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => setPgProvider(pg.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        pgProvider === pg.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      {pg.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* PG MID & API Key Inputs */}
              {pgProvider !== "none" && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">PG 상점 ID (MID)</label>
                    <input
                      type="text"
                      value={pgMid}
                      onChange={(e) => setPgMid(e.target.value)}
                      placeholder="예: imp_884920412491 또는 toss_mid_xxxx"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">API Client Key (공개키)</label>
                    <input
                      type="text"
                      value={pgApiKey}
                      onChange={(e) => setPgApiKey(e.target.value)}
                      placeholder="예: pk_live_creaibox_sample_key"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-slate-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer & Online Quote Switches */}
              <div className="space-y-3">
                {/* Bank Transfer Info */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-200">🏦 무통장 입금 활성화</label>
                    <input
                      type="checkbox"
                      checked={enableBankTransfer}
                      onChange={(e) => setEnableBankTransfer(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  {enableBankTransfer && (
                    <input
                      type="text"
                      value={bankAccountInfo}
                      onChange={(e) => setBankAccountInfo(e.target.value)}
                      placeholder="예: 기업은행 123-456-7890 (예금주: 소통과채움)"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-amber-300 focus:border-emerald-500 focus:outline-none"
                    />
                  )}
                </div>

                {/* Online Quote Payment Switch */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-200">📄 실시간 견적서 결제 폼 활성화</label>
                    <input
                      type="checkbox"
                      checked={enableInquiryPayment}
                      onChange={(e) => setEnableInquiryPayment(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                    소비자가 온라인 견적서(PDF) 발행 후 바로 견적 금액 결제 및 예약을 진행할 수 있도록 견적 결제 폼을 활성화합니다.
                  </p>
                </div>
              </div>

              {/* PG Save Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingConfig ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>💳 PG 결제 설정 저장하기</span>
                </button>
              </div>

              {/* PG Merchant Signup Guide Links & Notice */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <HelpCircle size={13} className="text-cyan-400" />
                  <span>PG 가맹점 미신청 상태이신가요? (1초 가입 센터)</span>
                </p>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                  아래 공식 PG사 포털에서 가맹 신청 후 발급된 상점 MID 및 API Key를 입력하시면 결제가 자동 가동됩니다.
                </p>

                <div className="flex flex-col gap-1.5 pt-1">
                  <a
                    href="https://portone.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={12} className="text-emerald-400" />
                      <span>포트원 (PortOne) 무료 가맹 신청 포털</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">portone.io ↗</span>
                  </a>

                  <a
                    href="https://www.tosspayments.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:border-blue-500 hover:text-blue-300 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={12} className="text-blue-400" />
                      <span>토스페이먼츠 (Toss) 전자결제 가맹 센터</span>
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">tosspayments.com ↗</span>
                  </a>

                  <a
                    href="https://with.kakaopay.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:border-amber-500 hover:text-amber-300 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={12} className="text-amber-400" />
                      <span>카카오페이 (Kakao Pay) 가맹점 직접 신청</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">with.kakaopay.com ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (2 Spans): Real-time Config Inputs */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Building2 className="text-cyan-400" /> 고객 사이트 기본 정보 실시간 편집
              </h2>
              <p className="text-xs font-medium text-slate-400">
                여기서 수정하신 전화번호, 주소, 이메일, 사업자 정보는 에이전트(저)에게 요청할 필요 없이 홈페이지에 **1초 만에 즉시 반영**됩니다!
              </p>
            </div>

            {saveSuccessMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold ${saveSuccessMsg.includes("✅") ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border border-rose-500/30 text-rose-300"}`}>
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <Building2 size={13} className="text-cyan-400" /> 상호명 / 브랜드명
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <Phone size={13} className="text-cyan-400" /> 대표 전화번호
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <Mail size={13} className="text-cyan-400" /> 대표 이메일
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <FileText size={13} className="text-cyan-400" /> 사업자 등록번호
                  </label>
                  <input
                    type="text"
                    value={bizNumber}
                    onChange={(e) => setBizNumber(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                  <MapPin size={13} className="text-cyan-400" /> 사업장 주소
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">
                  한 줄 회사 소개문구 (홈페이지 메인 및 푸터 노출)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* SECTION 2: 테마 포인트 컬러 지정 (Theme Color Accent Picker) */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-cyan-400" /> 브랜드 테마 포인트 컬러 선택 (Color Customization)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: "cyan", name: "Cyan", bg: "bg-cyan-500", border: "border-cyan-400" },
                    { id: "blue", name: "Blue", bg: "bg-blue-600", border: "border-blue-400" },
                    { id: "emerald", name: "Emerald", bg: "bg-emerald-500", border: "border-emerald-400" },
                    { id: "purple", name: "Purple", bg: "bg-purple-600", border: "border-purple-400" },
                    { id: "amber", name: "Amber", bg: "bg-amber-500", border: "border-amber-400" },
                    { id: "rose", name: "Rose", bg: "bg-rose-500", border: "border-rose-400" },
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setThemeColor(color.id)}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                        themeColor === color.id
                          ? `${color.border} bg-slate-950 text-white shadow-md shadow-cyan-500/10`
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: GNB 메뉴명 & CTA 라벨 커스텀 */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Tag size={14} className="text-amber-400" /> GNB 헤더 우측 메뉴명 커스텀 (Menu & Label Customization)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">GNB 우측 블로그 메뉴 라벨</label>
                    <input
                      type="text"
                      value={headerBlogTitle}
                      onChange={(e) => setHeaderBlogTitle(e.target.value)}
                      placeholder="예: Blog (블로그), IT 기술 칼럼"
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">GNB 우측 Contact 버튼 라벨</label>
                    <input
                      type="text"
                      value={headerContactTitle}
                      onChange={(e) => setHeaderContactTitle(e.target.value)}
                      placeholder="예: Contact & 구독하기, 1:1 상담신청"
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: 메인 히어로 슬로건 문구 */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Flame size={14} className="text-rose-400" /> 메인 히어로 헤드라인 슬로건
                </label>
                <input
                  type="text"
                  value={heroSlogan}
                  onChange={(e) => setHeroSlogan(e.target.value)}
                  placeholder="예: 2026년 자율 AI 에이전트와 웹 서비스의 대격변"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* SECTION 5: 동적 GNB 메뉴 관리자 (Dynamic Navigation Menu Builder) */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <ListPlus size={14} className="text-cyan-400" /> 동적 GNB 헤더 메뉴 자유 추가/편집/삭제 (Dynamic Menu Builder)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMenu}
                    className="inline-flex items-center gap-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all"
                  >
                    <Plus size={13} />
                    <span>신규 메뉴 추가하기</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {customMenus.map((menu, idx) => (
                    <div key={menu.id || idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-black text-cyan-400 w-6 shrink-0 text-center">#{idx + 1}</span>

                      {/* Menu Label Input */}
                      <input
                        type="text"
                        value={menu.label}
                        onChange={(e) => handleUpdateMenu(idx, "label", e.target.value)}
                        placeholder="메뉴 이름 (예: 교육소개)"
                        className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                      />

                      {/* Menu URL Input */}
                      <input
                        type="text"
                        value={menu.url}
                        onChange={(e) => handleUpdateMenu(idx, "url", e.target.value)}
                        placeholder="이동 링크 (예: #about)"
                        className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-slate-300 focus:border-cyan-500 focus:outline-none"
                      />

                      {/* Alignment Selector */}
                      <button
                        type="button"
                        onClick={() => handleUpdateMenu(idx, "isRightAligned", !menu.isRightAligned)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all border ${
                          menu.isRightAligned
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {menu.isRightAligned ? "✨ 우측 CTA 영역" : "📌 일반 메뉴"}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMenu(idx)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                        title="메뉴 삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isSavingConfig ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>실시간 설정 저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB 3: AI 커스텀 사이트 신규 제작 신청 (AI Custom Site Concierge) --- */}
      {activeTab === "request" && (
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 px-4 py-1 text-xs font-black text-purple-300">
              <Cpu size={14} /> AI 에이전트 1:1 전담 신규 제작 서비스
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              100% 독창적인 풀코드 커스텀 홈페이지 제작 요청
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400 leading-relaxed">
              표준 템플릿으로 담아내기 어려운 전용 사업 영역, 특수 렌탈 폼, 갤러리 레이아웃이 필요하시다면 AI 에이전트에게 신청해 주세요! 단 몇 분 만에 풀코드로 제작하여 탑재해 드립니다.
            </p>
          </div>

          {reqSuccess && (
            <div className="rounded-3xl bg-purple-500/10 border border-purple-500/30 p-6 text-center space-y-3">
              <CheckCircle2 size={32} className="mx-auto text-purple-400" />
              <h3 className="text-lg font-black text-white">AI 에이전트에 커스텀 제작 요청이 접수되었습니다!</h3>
              <p className="text-xs font-medium text-purple-200">
                AI 에이전트(Antigravity)가 요청하신 업종 및 명세서를 분석하여 100% 맞춤 풀코드 구축을 시작합니다.
              </p>
            </div>
          )}

          <form onSubmit={handleSendRequest} className="space-y-8">
            {/* Field 1: 업종 / 산업 분야 선택 (Full Width Standalone Block) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Building2 size={16} className="text-purple-400" />
                <span>1️⃣ 제작하려는 업종 / 산업 분야 선택</span>
              </label>
              <select
                value={reqCategory}
                onChange={(e) => setReqCategory(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-5 py-4 text-sm font-bold text-white focus:border-purple-500 focus:outline-none shadow-inner cursor-pointer"
              >
                {categories.filter((c) => c !== "전체 테마").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Field 2: [{reqCategory}] 업종 맞춤 추천 디자인 컨셉 & 메인 컬러 (Full Width 5-Column Grid) */}
            <div className="space-y-4 rounded-3xl bg-slate-950/60 p-6 border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    <span>2️⃣ [{reqCategory}] 업종 맞춤 추천 디자인 컨셉 & 메인 컬러 (10개 템플릿 예시 중 선택)</span>
                  </label>
                  <p className="text-xs font-medium text-slate-400">
                    원하시는 느낌의 디자인과 컬러 칩을 클릭하시면 AI 에이전트 생성 명세서로 원클릭 자동 세팅됩니다.
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30 shrink-0">
                  원클릭 자동 세팅 ⭕
                </span>
              </div>

              {/* 5-Column Grid (Wide Cards, 5 items per row x 2 rows = 10 items) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {getDesignPresetsForCategory(reqCategory).map((preset) => {
                  const isSelected = reqConcept.includes(preset.name);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setReqConcept(
                          `${preset.name} (${preset.vibe}) - Palette: ${preset.colors.join(", ")}`
                        )
                      }
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/20 scale-102"
                          : "bg-slate-900/90 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            {preset.tag}
                          </span>
                          {isSelected && <CheckCircle2 size={16} className="text-purple-400 shrink-0" />}
                        </div>
                        <p className="text-xs font-black text-white leading-snug">{preset.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{preset.description}</p>
                      </div>

                      {/* Color Swatch Circles */}
                      <div className="flex items-center gap-1.5 pt-2.5 border-t border-slate-800">
                        {preset.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-md"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                        <span className="text-[10px] text-slate-400 font-mono ml-auto font-bold truncate max-w-[65px]">
                          {preset.colors[1]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-slate-400">선택된 디자인 컨셉 & 메인 컬러 명세 (필요 시 직접 세부 수정도 가능)</label>
                <input
                  type="text"
                  value={reqConcept}
                  onChange={(e) => setReqConcept(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-bold text-purple-300 focus:border-purple-500 focus:outline-none shadow-inner"
                  placeholder="상단 10개 예시 중 선택하거나 직접 입력해 주세요"
                />
              </div>
            </div>

            {/* Field 3: GNB 헤더 상단 메뉴 구성 선택 (Header GNB Menu Selection) */}
            <div className="space-y-4 rounded-3xl bg-slate-950/60 p-6 border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-black text-white flex items-center gap-2">
                    <ListPlus size={16} className="text-amber-400" />
                    <span>3️⃣ 상단 GNB 헤더 메뉴 구성 선택 (복수 선택 가능)</span>
                  </label>
                  <p className="text-xs font-medium text-slate-400">
                    홈페이지 상단 네비게이션(GNB)에 탑재할 메인 헤더 메뉴를 자유롭게 선택해 주세요. (추천 5~7개 자동 선택)
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 shrink-0">
                  권장 5~7개 탑재 📌
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { name: "홈 (Home)", isRequired: true, desc: "메인 비주얼 랜딩 페이지" },
                  { name: "회사소개 / 브랜드 스토리", isRequired: true, desc: "CEO 인사말, 비전, 연혁" },
                  { name: "주요 서비스 / 포트폴리오", isRequired: true, desc: "업종별 핵심 서비스 쇼케이스" },
                  { name: "실적 갤러리 & 성공 사례", isRequired: false, desc: "프로젝트 갤러리 및 성과" },
                  { name: "온라인 견적 / 예약 신청", isRequired: true, desc: "실시간 견적 및 예약 폼" },
                  { name: "고객 후기 / 렌탈 리뷰", isRequired: false, desc: "고객 생생 후기 & 비포애프터" },
                  { name: "자주 묻는 질문 (FAQ)", isRequired: false, desc: "주요 CS 질문 & 답변 모달" },
                  { name: "Blog (공식 블로그)", isRequired: true, desc: "SEO 원고 자동 발행 백링크", isRight: true },
                  { name: "Contact & 1:1 상담", isRequired: true, desc: "GNB 우측 1:1 상담 버튼", isRight: true },
                  { name: "인기 랭킹 & 트렌드 칼럼", isRequired: false, desc: "인기 아티클 랭킹 리스트" },
                ].map((item) => {
                  const isChecked = reqHeaderMenus.includes(item.name);
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        if (isChecked) {
                          setReqHeaderMenus(reqHeaderMenus.filter((m) => m !== item.name));
                        } else {
                          setReqHeaderMenus([...reqHeaderMenus, item.name]);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2.5 transition-all cursor-pointer ${
                        isChecked
                          ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/10"
                          : "bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                            item.isRight
                              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                              : item.isRequired
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {item.isRight ? "우측 CTA" : item.isRequired ? "필수 메뉴" : "선택 옵션"}
                          </span>
                          {isChecked && <CheckCircle2 size={14} className="text-amber-400 shrink-0" />}
                        </div>
                        <p className="text-xs font-black text-white leading-snug">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4: 필요한 특수 기능 선택 (복수 선택 가능) */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                <span>4️⃣ 필요한 특수 기능 선택 (복수 선택 가능)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "실적/포트폴리오 갤러리 탭",
                  "실시간 온라인 견적신청 폼",
                  "전용 블로그 & 조회수 카운터",
                  "DoFollow SEO 백링크 가산점 엔진",
                  "카카오톡 / 전화 상담 고정 다이얼",
                  "엑박 방지 안전 예외 폴백 핸들러",
                ].map((ft) => {
                  const isChecked = reqFeatures.includes(ft);
                  return (
                    <button
                      type="button"
                      key={ft}
                      onClick={() => {
                        if (isChecked) {
                          setReqFeatures(reqFeatures.filter((f) => f !== ft));
                        } else {
                          setReqFeatures([...reqFeatures, ft]);
                        }
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        isChecked
                          ? "bg-purple-500/20 border-purple-500 text-purple-200"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{ft}</span>
                      {isChecked && <Check size={14} className="text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: 👑 전용 회원가입 & 백엔드 DB 서버 구축 옵션 (유료 특수 옵션 - 가격 미정) */}
            <div className="space-y-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-950/80 to-blue-950/40 p-6 border border-purple-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-purple-400" />
                    <h3 className="text-base font-black text-white">
                      5️⃣ 👑 사용자 회원가입 & 백엔드 DB 서버 통합 구축 (유료 추가 옵션)
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed">
                    회원가입 기능 추가 시 소셜 로그인(카카오/네이버/구글), 회원 전용 DB 데이터베이스, 마이페이지 및 보안 세션 엔진이 통째로 백엔드에 구축됩니다.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
                    💰 구축 비용: 가격 미정 (맞춤 견적 협의)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer bg-purple-500/20 px-3.5 py-1.5 rounded-full border border-purple-400/40 hover:bg-purple-500/30 transition-all">
                    <input
                      type="checkbox"
                      checked={enableAuthDb}
                      onChange={(e) => setEnableAuthDb(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                    />
                    <span className="text-xs font-black text-purple-200">
                      {enableAuthDb ? "회원 DB 구축 신청 ⭕" : "회원 DB 미사용 ❌"}
                    </span>
                  </label>
                </div>
              </div>

              {enableAuthDb && (
                <div className="space-y-6 pt-2 animate-fade-in-up">
                  {/* Group A: 🔑 회원가입 & 로그인 인증 수단 선택 */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                      <Lock size={14} className="text-purple-400" />
                      <span>🔑 로그인 & 회원가입 인증 수단 선택 (복수 선택 가능)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "카카오 1초 소셜 로그인 (Kakao OAuth)", desc: "국내 모바일 회원 전환율 1위" },
                        { name: "네이버 1초 소셜 로그인 (Naver OAuth)", desc: "네이버 연동 간편인증 시스템" },
                        { name: "구글 소셜 로그인 (Google OAuth)", desc: "글로벌 표준 구글 원클릭 가입" },
                        { name: "일반 이메일 & 비밀번호 회원가입", desc: "이메일 인증 및 암호화 가입" },
                      ].map((item) => {
                        const isChecked = reqAuthMethods.includes(item.name);
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => {
                              if (isChecked) {
                                setReqAuthMethods(reqAuthMethods.filter((m) => m !== item.name));
                              } else {
                                setReqAuthMethods([...reqAuthMethods, item.name]);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                              isChecked
                                ? "bg-purple-500/20 border-purple-400 ring-1 ring-purple-400/40 text-purple-100"
                                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                  Auth
                                </span>
                                {isChecked && <CheckCircle2 size={14} className="text-purple-400 shrink-0" />}
                              </div>
                              <p className="text-xs font-extrabold text-white leading-snug">{item.name}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group B: 👤 회원 전용 마이페이지 & 멤버십 기능 선택 */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <label className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                      <Cpu size={14} className="text-cyan-400" />
                      <span>👤 회원 전용 마이페이지 & 멤버십 엔진 (복수 선택 가능)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "회원 전용 마이페이지 (내 견적/예약/결제 내역 조회)", desc: "개인별 이력 및 진행 상태 확인" },
                        { name: "회원 등급제 엔진 (일반 / VIP / 파트너 혜택 구분)", desc: "회원 등급별 할인 및 혜택 차등" },
                        { name: "회원가입 축하 자동 쿠폰 & 포인트 적립", desc: "가입 즉시 자동 혜택 부여" },
                        { name: "카카오 알림톡 / SMS 본인 인증", desc: "휴대폰 번호 실명 및 봇 방지 인증" },
                      ].map((item) => {
                        const isChecked = reqAuthFeatures.includes(item.name);
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => {
                              if (isChecked) {
                                setReqAuthFeatures(reqAuthFeatures.filter((f) => f !== item.name));
                              } else {
                                setReqAuthFeatures([...reqAuthFeatures, item.name]);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                              isChecked
                                ? "bg-cyan-500/20 border-cyan-400 ring-1 ring-cyan-400/40 text-cyan-100"
                                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                  DB Engine
                                </span>
                                {isChecked && <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />}
                              </div>
                              <p className="text-xs font-extrabold text-white leading-snug">{item.name}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">참고하고 싶은 레퍼런스 웹사이트 URL</label>
              <input
                type="url"
                value={reqRefUrl}
                onChange={(e) => setReqRefUrl(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">요청 상세 내용 (자유 작성)</label>
              <textarea
                rows={4}
                value={reqDetail}
                onChange={(e) => setReqDetail(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-bold text-white focus:border-purple-500 focus:outline-none leading-relaxed"
                placeholder="원하시는 메인 메뉴 구성, 특별히 강조하고 싶은 서비스 내용 등을 자유롭게 작성해 주세요."
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmittingReq}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                {isSubmittingReq ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>🤖 AI 에이전트에 커스텀 제작 요청하기</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 4 (REMOVED: Assetization) --- */}
      {false && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Store size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">보유 커스텀 템플릿 자산</p>
              <p className="text-3xl font-black text-white">8개 브랜드 보유</p>
              <p className="text-xs font-medium text-amber-400">100% 템플릿화 모듈 등록 완료</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Zap size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">템플릿 기반 원클릭 구축 수</p>
              <p className="text-3xl font-black text-white">총 1,240 회 개설</p>
              <p className="text-xs font-medium text-emerald-400">평균 구축 소요시간 1초</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <TrendingUp size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">월 정기 유지보수 구독 수입</p>
              <p className="text-3xl font-black text-white">월 1,500 만원+</p>
              <p className="text-xs font-medium text-cyan-400">AI 전담 케어 구독 연동</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="text-amber-400" /> 에이전시 파트너를 위한 커스텀 템플릿 리셀링 가이드
              </h2>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                제작된 커스텀 사이트를 나만의 템플릿 자산으로 등록하여, 클라이언트에게 1초 만에 복제·배포하고 월 30~50만 원의 유지보수 플랜을 판매하는 고수익 모델입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 1</span>
                <h4 className="text-sm font-bold text-white">1:1 커스텀 사이트 제작</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI 에이전트를 통해 완성도 높은 풀코드 커스텀 홈페이지를 1:1로 신속 제작합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 2</span>
                <h4 className="text-sm font-bold text-white">마켓플레이스 템플릿화</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  템플릿 레지스트리에 등록하여 신규 고객이 선택 시 1초 만에 자동 복제되도록 설정합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 3</span>
                <h4 className="text-sm font-bold text-white">월 유지보수 정기 구독</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  블로그 포스팅과 기본 정보는 고객이 직접 수정하고, 디자인 개편은 AI가 전담 케어합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 5: 👑 관리자: 커스텀 신청 현황 (Admin Custom Request Dashboard) --- */}
      {activeTab === "admin_dashboard" && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Header Summary Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-slate-900 border border-rose-500/30 p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-black text-rose-300">
                  <Bot size={14} className="animate-pulse text-rose-400" />
                  <span>관리자 전용 AI 에이전트 커스텀 관제탑</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  👑 회원 커스텀 웹사이트 신청 현황 ({adminRequests.length}건)
                </h2>
                <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                  회원분들이 신청한 커스텀 제작 명세서를 한눈에 파악하세요. 각 신청 카드의{" "}
                  <strong className="text-rose-400 font-bold">[🤖 AI 에이전트 자동 제작 진행하기]</strong> 버튼을 누르면 안티그래비티 1:1 풀코드 생성 프로세스가 실행됩니다.
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-slate-400">총 신청 건수</p>
                  <p className="text-2xl font-black text-white">{adminRequests.length}건</p>
                </div>
                <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-amber-400">AI 제작 대기</p>
                  <p className="text-2xl font-black text-amber-300">
                    {adminRequests.filter((r) => r.status === "pending").length}건
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-emerald-400">구축 완료</p>
                  <p className="text-2xl font-black text-emerald-300">
                    {adminRequests.filter((r) => r.status === "completed").length}건
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setAdminFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  adminFilter === "all"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                전체 보기 ({adminRequests.length})
              </button>
              <button
                onClick={() => setAdminFilter("pending")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  adminFilter === "pending"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🟡 AI 제작 대기 ({adminRequests.filter((r) => r.status === "pending").length})
              </button>
              <button
                onClick={() => setAdminFilter("completed")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  adminFilter === "completed"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🟢 구축 완료 ({adminRequests.filter((r) => r.status === "completed").length})
              </button>
            </div>
          </div>

          {/* 10 Request Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminRequests
              .filter((req) => (adminFilter === "all" ? true : req.status === adminFilter))
              .map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 hover:border-slate-700 transition-all shadow-xl relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {req.category}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{req.createdAt}</span>
                      </div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <span>{req.companyName}</span>
                        <span className="text-xs text-slate-400 font-normal">({req.userNickname})</span>
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse">
                          <Clock size={12} />
                          🟡 AI 제작 대기
                        </span>
                      )}
                      {req.status === "building" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          <RefreshCw size={12} className="animate-spin" />
                          ⚡ AI 에이전트 코딩중
                        </span>
                      )}
                      {req.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 size={12} />
                          🟢 구축 완료 (라이브)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Request Specs */}
                  <div className="space-y-3">
                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-bold text-slate-400">🎨 희망 테마 & 컨셉:</p>
                      <p className="text-cyan-300 font-medium bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        {req.themeColor}
                      </p>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-bold text-slate-400">⚙️ 선택 특수기능:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {req.features.map((f, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950 text-slate-300 border border-slate-800"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-bold text-slate-400">📝 상세 요구사항 (프롬프트 명세):</p>
                      <p className="text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        {req.detail}
                      </p>
                    </div>

                    {req.refUrl && (
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>🔗 레퍼런스:</span>
                        <a
                          href={req.refUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          {req.refUrl} <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Button: Trigger AI Build Command */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setAdminRequests((prev) =>
                          prev.map((item) => (item.id === req.id ? { ...item, status: "completed" } : item))
                        );
                        setSelectedPromptModal(req);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all cursor-pointer ${
                        req.status === "completed"
                          ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                          : "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-purple-600/20"
                      }`}
                    >
                      <Bot size={15} className="text-rose-300" />
                      <span>
                        {req.status === "completed"
                          ? "🤖 AI 에이전트 풀코드 생성 완료 (재실행)"
                          : "🤖 AI 에이전트 자동 제작 진행하기"}
                      </span>
                    </button>

                    {req.status === "completed" && (
                      <a
                        href={req.refUrl || "https://sotongcheum.creaibox.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 px-4 py-3 text-xs font-black text-cyan-300 hover:bg-cyan-500/20 transition-all shrink-0"
                      >
                        <Eye size={13} />
                        <span>시안 미리보기</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- ADMIN AI EXECUTION PROMPT MODAL --- */}
      {selectedPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-purple-500/40 bg-slate-900 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-rose-400">
                <Bot size={22} className="animate-bounce" />
                <h3 className="text-lg font-black text-white">
                  안티그래비티 AI 에이전트 자동 제작 수행 완료
                </h3>
              </div>
              <button
                onClick={() => setSelectedPromptModal(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                <CheckCircle2 size={16} />
                <span>
                  신청 건 [{selectedPromptModal.companyName}]의 안티그래비티 1:1 풀코드 생성 명령이 성공적으로 인식되었습니다!
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 flex items-center justify-between">
                  <span>💻 안티그래비티 AI 에이전트 실행 명령 프롬프트 (자동 생성됨)</span>
                  <button
                    onClick={() => {
                      const text = `안티그래비티 AI 파트너 생성 명령:\n유저 [${selectedPromptModal.companyName}]의 커스텀 웹사이트 100% 풀코드를 생성하라.\n- 업종: ${selectedPromptModal.category}\n- 테마: ${selectedPromptModal.themeColor}\n- 필수 기능: ${selectedPromptModal.features.join(", ")}\n- 상세: ${selectedPromptModal.detail}`;
                      navigator.clipboard.writeText(text);
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-cyan-400 hover:underline cursor-pointer"
                  >
                    {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedPrompt ? "복사 완료!" : "명령어 복사하기"}</span>
                  </button>
                </label>

                <textarea
                  readOnly
                  rows={6}
                  value={`안티그래비티 AI 파트너 생성 명령:\n유저 [${selectedPromptModal.companyName}]의 커스텀 웹사이트 100% 풀코드를 생성하라.\n- 업종: ${selectedPromptModal.category}\n- 테마: ${selectedPromptModal.themeColor}\n- 필수 기능: ${selectedPromptModal.features.join(", ")}\n- 상세: ${selectedPromptModal.detail}`}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono font-bold text-cyan-300 leading-relaxed outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <a
                href={selectedPromptModal.refUrl || "https://sotongcheum.creaibox.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3.5 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all"
              >
                <Eye size={15} /> <span>생성된 라이브 사이트 확인하기</span>
              </a>
              <button
                onClick={() => {
                  setSelectedPromptModal(null);
                  setActiveTab("manage");
                }}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-xs font-black text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                완료 & 내 커스텀 관리로 이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6 (REMOVED: Use /studio/domain-search instead) --- */}
      {false && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-8 lg:p-10 shadow-2xl">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-extrabold text-cyan-300">
                <Globe size={14} className="animate-pulse" />
                <span>CreAibox Domain Reseller Portal & Vercel API 100% 연동</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                독자 브랜드 도메인 <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">1초 검색 & 원클릭 구매·이관 센터</span>
              </h2>

              <p className="text-sm sm:text-base font-medium text-slate-300 leading-relaxed max-w-3xl">
                국내 타사(G사/W사 등)의 높은 갱신 비용에서 탈피하세요! Vercel Domains API 연동으로 
                <strong className="text-cyan-300 font-extrabold"> 해외 도매가(18,000원)</strong>에 도메인을 구매하거나 
                타사 도메인을 1초 만에 이관할 수 있으며, <strong className="text-emerald-300 font-extrabold">비즈니스 회원은 도메인비 평생 100% 무료(0원)</strong> 혜택이 제공됩니다.
              </p>

              {/* Quick Perks */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "시중 대비 35% 이상 절감", sub: "G사 25,850원 vs 18,000원" },
                  { label: "비즈니스 회원 무료 지원", sub: "도메인 연장비 평생 0원" },
                  { label: "WHOIS 개인정보 보호", sub: "100% 평생 무상 제공" },
                  { label: "SSL 보안인증서 1초 자동 발급", sub: "https:// 1초 무장애 결합" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-0.5">
                    <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> {item.label}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domain Search Engine Section */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Search className="text-cyan-400" /> 원하는 브랜드 도메인 실시간 가용성 & 가격 검색
              </h3>
              <p className="text-xs font-medium text-slate-400">
                원하시는 브랜드명(예: mybrand, auramerino)을 입력하시면 구매 가능 여부와 시중가 대비 할인 가격을 1초 만에 확인합니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="예: auramerino, sotongcheum, mycompany"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <select
                className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-4 text-xs font-bold text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value=".com">.com (추천)</option>
                <option value=".kr">.kr (국내전용)</option>
                <option value=".co.kr">.co.kr (기업전용)</option>
                <option value=".io">.io (테크/스타트업)</option>
                <option value=".net">.net (네트워크)</option>
              </select>

              <button
                type="button"
                onClick={() => alert("auramerino.com ➔ 구매 가능! 연 18,000원 (비즈니스 회원 연장비 0원 무상 지원)")}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer whitespace-nowrap"
              >
                <Sparkles size={16} />
                <span>실시간 도메인 검색</span>
              </button>
            </div>

            {/* Default Mock Results */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-extrabold text-slate-300">인기 추천 도메인 실시간 가용 현황</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { domain: "auramerino.com", available: true, price: 18000, orig: 25850, best: true },
                  { domain: "auramerino.kr", available: true, price: 19000, orig: 23500, best: false },
                  { domain: "sotongcheum.com", available: true, price: 18000, orig: 25850, best: true },
                  { domain: "creaibox.io", available: false, price: 45000, orig: 55000, best: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      item.available
                        ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/60"
                        : "border-slate-800 bg-slate-950/60 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.available ? (
                        <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Lock size={20} className="text-rose-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-sm font-black text-white font-mono flex items-center gap-2">
                          <span>{item.domain}</span>
                          {item.best && (
                            <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                              BEST
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">
                          {item.available ? "구매 가능 (1초 무장애 커스텀 사이트 결합)" : "이미 타인이 등록한 도메인"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.available ? (
                        <>
                          <div className="text-right">
                            <div className="text-xs text-slate-400 line-through">
                              시중가 {item.orig.toLocaleString()}원
                            </div>
                            <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                              <span>연 {item.price.toLocaleString()}원</span>
                              <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                                비즈니스 0원
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert(`${item.domain} 1초 구매 및 자동 연결 요청이 완료되었습니다!`)}
                            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-md cursor-pointer"
                          >
                            <Zap size={13} />
                            <span>1초 구매하기</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-slate-500">이관 가능</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domain Transfer-In Section */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <RefreshCw size={12} />
                <span>국내 타사(G사 / W사 등) 도메인 CreAibox로 1초 옮겨오기</span>
              </div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" /> 타사 도메인 기관 이관 (Domain Transfer-In)
              </h3>
              <p className="text-xs font-medium text-slate-400">
                G사나 W사 등 타사에 매년 25,850원~35,000원씩 내지 마시고 CreAibox로 이관하세요! 만료일 1년 무조건 추가 연장 혜택이 적용됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-300">이관할 도메인 주소</label>
                <input
                  type="text"
                  placeholder="예: mybrand.com"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-mono font-bold text-cyan-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-300">이전 인증키 (Auth Code / EPP Code)</label>
                <input
                  type="text"
                  placeholder="기존 등록업체(G사/W사 등)에서 발급된 인증키 입력"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-mono font-bold text-slate-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between pt-2">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Lock size={12} className="text-emerald-400" /> 기존 등록업체(G사/W사 등)에서 '도메인 잠금(Domain Lock)' 해제 후 신청하세요.
                </span>

                <button
                  type="button"
                  onClick={() => alert("✅ 국내 타사 도메인 1초 이관 요청이 정상 전송되었습니다! (1년 연장 혜택 완료)")}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-md cursor-pointer"
                >
                  <Zap size={14} />
                  <span>CreAibox로 1초 이관 신청하기</span>
                </button>
              </div>
            </div>
          </div>

          {/* Domestic vs International Real Pricing Fact Check Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="text-amber-400" /> 팩트 체크: 국내외 주요 도메인 등록업체 실제 결제 금액 비교
              </h3>
              <p className="text-xs font-medium text-slate-400">
                국내 타사의 높은 갱신 수수료 및 첫해 할인가 대비 구조와 CreAibox 해외 도매 원가 기반 파격 혜택 대조표
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">등록업체 / 서비스</th>
                    <th className="p-3.5">1년 실제 결제 금액 (VAT 포함)</th>
                    <th className="p-3.5">WHOIS 개인정보 보호</th>
                    <th className="p-3.5">특이사항 및 가격 구조</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
                  <tr className="bg-slate-900/50">
                    <td className="p-3.5 font-bold text-white">W사 (국내 대표 등록업체)</td>
                    <td className="p-3.5 font-bold text-rose-400">28,600원 ~ 35,000원</td>
                    <td className="p-3.5 text-rose-400">유료 (추가비용)</td>
                    <td className="p-3.5 text-slate-400">국내 등록업체 중 가장 비쌈 ❌</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="p-3.5 font-bold text-white">G사 (국내 1위 등록업체)</td>
                    <td className="p-3.5 font-bold text-rose-400">25,850원</td>
                    <td className="p-3.5 text-rose-400">유료 (연 3,300원 추가)</td>
                    <td className="p-3.5 text-slate-400">첫해 할인 후 2년 차부터 25,850원 갱신 ❌</td>
                  </tr>
                  <tr className="bg-slate-900/50">
                    <td className="p-3.5 font-bold text-white">C사 (국내 대표 호스팅업체)</td>
                    <td className="p-3.5 font-bold text-slate-300">23,500원</td>
                    <td className="p-3.5 text-slate-400">신청 절차 번거로움</td>
                    <td className="p-3.5 text-slate-400">일반 시중가 ❌</td>
                  </tr>
                  <tr className="bg-cyan-950/30 border-l-4 border-l-cyan-500">
                    <td className="p-3.5 font-bold text-cyan-300">👑 CreAibox 일반 판매가</td>
                    <td className="p-3.5 font-bold text-cyan-300">18,000원</td>
                    <td className="p-3.5 font-bold text-emerald-400">100% 무료 자동 탑재</td>
                    <td className="p-3.5 text-cyan-300 font-bold">G사 대비 매년 1만 원 이상 지속 절약 ⭕</td>
                  </tr>
                  <tr className="bg-emerald-950/40 border-l-4 border-l-emerald-500">
                    <td className="p-3.5 font-black text-emerald-300">👑 CreAibox 비즈니스 회원</td>
                    <td className="p-3.5 font-black text-emerald-300 text-sm">0원 (평생 무상 지원!)</td>
                    <td className="p-3.5 font-bold text-emerald-400">100% 무료 자동 탑재</td>
                    <td className="p-3.5 text-emerald-300 font-bold">비즈니스 플랜 사용 시 도메인 연장비 평생 0원 ⭕</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- DEPLOY MODAL WIZARD --- */}
      {deployModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Zap className="text-cyan-400" size={20} />
                <h3 className="text-lg font-black text-white">1초 템플릿 즉시 구축</h3>
              </div>
              <button
                onClick={() => setDeployModalTemplate(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                닫기
              </button>
            </div>

            {deploySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-black text-white">
                  축하합니다! 홈페이지 구축이 완료되었습니다! 🎉
                </h4>
                <p className="text-xs font-medium text-slate-300">
                  선택하신 <strong className="text-cyan-400">{deployModalTemplate.name}</strong> 기반으로 내 신규 사이트가 정상 개설되었습니다.
                </p>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <a
                    href="http://sotongcheum.localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-2xl bg-cyan-500 px-6 py-3 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all"
                  >
                    <Globe size={14} /> 신규 사이트 열기
                  </a>
                  <button
                    onClick={() => {
                      setDeployModalTemplate(null);
                      setActiveTab("manage");
                    }}
                    className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs font-extrabold text-white hover:bg-slate-700 transition-all"
                  >
                    사이트 관리로 이동
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-slate-400">선택 템플릿</p>
                  <p className="text-sm font-black text-cyan-300">{deployModalTemplate.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300">내 사이트 이름</label>
                  <input
                    type="text"
                    value={deploySiteName}
                    onChange={(e) => setDeploySiteName(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300">희망 서브도메인 (영문)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={deploySubdomain}
                      onChange={(e) => setDeploySubdomain(e.target.value)}
                      className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none font-mono"
                    />
                    <span className="text-xs font-mono text-slate-400">.creaibox.com</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeployModalTemplate(null)}
                    className="rounded-2xl border border-slate-800 px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmDeploy}
                    disabled={isDeploying}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                  >
                    {isDeploying ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                    <span>{isDeploying ? "구축 중..." : "즉시 구축 완료"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- KIMI-STYLE INTERACTIVE FULL-SCROLL PREVIEW MODAL (3-DEVICE VIEWPORT SWITCHER) --- */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
          <div
            className={`w-full flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden transition-all duration-300 max-h-[92vh] ${
              previewDeviceMode === "desktop"
                ? "max-w-6xl"
                : previewDeviceMode === "tablet"
                ? "max-w-4xl"
                : "max-w-xl"
            }`}
          >
            {/* Modal Header: Title + 3-Device Viewport Mode Switcher + Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-800 bg-slate-950 shrink-0">
              {/* Left: Window Dots & Template Name */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  미리 보기 <span className="text-cyan-400 font-bold">• {previewModalTemplate.name}</span>
                </h3>
              </div>

              {/* Center: 3-Device Viewport Mode Switcher (PC 웹, 태블릿, 모바일) */}
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => setPreviewDeviceMode("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDeviceMode === "desktop"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Monitor size={13} />
                  <span>PC 웹</span>
                </button>

                <button
                  onClick={() => setPreviewDeviceMode("tablet")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDeviceMode === "tablet"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Tablet size={13} />
                  <span>태블릿</span>
                </button>

                <button
                  onClick={() => setPreviewDeviceMode("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDeviceMode === "mobile"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Smartphone size={13} />
                  <span>모바일</span>
                </button>
              </div>

              {/* Right: New Tab & Close Button */}
              <div className="flex items-center gap-2">
                <a
                  href={previewModalTemplate.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1 text-xs font-extrabold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all"
                >
                  <ExternalLink size={14} /> 새 탭에서 열기
                </a>
                <button
                  onClick={() => setPreviewModalTemplate(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body: Responsive Viewport Display (PC/Tablet/Mobile) */}
            <div className="relative flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex justify-center items-start">
              <div
                className={`transition-all duration-300 rounded-2xl border border-slate-800 bg-white overflow-hidden shadow-2xl ${
                  previewDeviceMode === "desktop"
                    ? "w-full max-w-[1100px]"
                    : previewDeviceMode === "tablet"
                    ? "w-[768px] max-w-full"
                    : "w-[375px] max-w-full rounded-3xl border-4 border-slate-800 shadow-cyan-500/5"
                }`}
              >
                <iframe
                  src={`/clients/${previewModalTemplate.id}`}
                  title={`${previewModalTemplate.name} ${previewDeviceMode} Preview`}
                  className={`w-full border-0 ${
                    previewDeviceMode === "mobile" ? "h-[620px]" : "h-[660px]"
                  }`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950 shrink-0">
              <button
                onClick={() => setPreviewModalTemplate(null)}
                className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                계속 찾기
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 hidden lg:inline">
                  {previewDeviceMode === "desktop" && "💻 PC 웹 와이드 모드"}
                  {previewDeviceMode === "tablet" && "📱 태블릿 768px 해상도 모드"}
                  {previewDeviceMode === "mobile" && "📱 스마트폰 모바일 375px 해상도 모드"}
                </span>

                <button
                  onClick={() => {
                    const tpl = previewModalTemplate;
                    setPreviewModalTemplate(null);
                    setDeployModalTemplate(tpl);
                    setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);
                    setDeploySubdomain(`${tpl.id}-mybrand`);
                    setDeploySuccess(false);
                  }}
                  className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r ${previewModalTemplate.accentColor} px-6 py-2.5 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg`}
                >
                  <Zap size={14} /> 템플릿 사용 (1초 구축)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
