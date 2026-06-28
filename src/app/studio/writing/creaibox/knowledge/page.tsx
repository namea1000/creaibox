"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Database,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  FileText,
  Tag,
  Info,
  X,
  Sparkles,
  Loader2,
  UserCheck,
} from "lucide-react";

type KnowledgeItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  createdAt: string;
  charCount: number;
  byteSize: number;
};

type PersonaProfile = {
  id: string;
  nickname: string;
  tone: string;
  targetAudience: string;
  category: string;
  bio: string;
  createdAt: string;
};

type PostTypeCategory = {
  key: string;
  name: string;
};

const POST_TYPES: PostTypeCategory[] = [
  { key: "brand-story", name: "📖 브랜드 스토리" },
  { key: "service-intro", name: "✍️ 서비스 소개형" },
  { key: "company-intro", name: "🏢 기업 소개 및 안내" },
  { key: "newsletter", name: "✉️ 뉴스레터형" },
  { key: "app-guide", name: "📱 앱 가이드" },
  { key: "ai-web-guide", name: "🤖 AI & 웹 가이드" },
  { key: "utility-guide", name: "⚙️ 유틸리티 사용법" },
];

const DEFAULT_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "kl-1",
    title: "크리에이박스 서비스 소개 및 핵심 가치",
    description: "올인원 AI 콘텐츠 스튜디오 크리에이박스의 론칭 목적과 주요 핵심 가치 제안입니다.",
    content: "크리에이박스(CreAibox)는 현대 크리에이터, 1인 기업가, 마케팅 부서를 위한 지능형 올인원 AI 콘텐츠 제작 스튜디오입니다. 본 서비스는 기획서 작성(Content Planner)부터 정교한 포스팅 글쓰기(AI Writing), 자동화 발행 워크플로우(Automation Pipeline), 무료 에셋 창고(CreAssetBox)를 단일 웹 플랫폼 안에 집약하여 콘텐츠 딜리버리 공수를 기존 대비 90% 이상 절감시키는 가치를 제공합니다.",
    tags: ["서비스소개", "핵심가치", "가이드"],
    createdAt: "2026-06-28 10:00:00",
    charCount: 260,
    byteSize: 760,
  },
  {
    id: "kl-2",
    title: "인공지능 글쓰기 프롬프트 및 작성 말투 가이드라인",
    description: "블로그 글 작성 시 AI 성능을 극대화하고 어조 일관성을 보장하기 위한 톤앤매너 설정 규칙입니다.",
    content: "AI 작가 엔진 구동 시 다음 어조 매개변수를 참조합니다. 첫째, 전문적 지식 전파형(기술 블로그)은 인과 관계가 명확한 '습니다' 체와 수치 데이터를 근거로 주장을 전개합니다. 둘째, 일상 친근형(네이버 블로그)은 독자의 공감을 이끌어내는 질문형 종결 어미와 이모티콘을 활용하여 가독성을 높입니다. 셋째, 지식 베이스(RAG) 연동 글쓰기 시 사전 지식을 본문 내에 자연스럽게 녹이고 팩트를 위배하지 않도록 통제합니다.",
    tags: ["프롬프트", "말투", "가이드라인"],
    createdAt: "2026-06-28 10:05:00",
    charCount: 290,
    byteSize: 840,
  },
  {
    id: "kl-3",
    title: "네이버 검색 엔진 최적화(SEO) 핵심 알고리즘 및 규칙",
    description: "네이버 검색 로봇의 C-Rank 및 DIA+ 알고리즘에 부합하여 상위 노출을 따내는 글쓰기 전략 문서입니다.",
    content: "네이버 검색 최적화(SEO)를 달성하기 위해 원고 작성 시 다음 3가지 규칙을 엄수해야 합니다. 1) 키워드 밀도: 메인 키워드 주제는 본문 전체 분량(1,500자 기준) 중 5회 내지 8회 사이에 골고루 분포시켜야 합니다. 과도한 중복은 스팸 처리될 수 있습니다. 2) 고유 경험 수록: DIA+ 모델은 타인의 글을 짜깁기한 것보다 본인 고유의 실증 데이터나 사용 사진이 결합된 원고에 더 높은 점수를 부여합니다. 3) 가독성 정렬: H1~H3 태그 구조와 인라인 구분 볼드를 사용해 문단을 슬림하게 유지하십시오.",
    tags: ["SEO", "네이버블로그", "최적화"],
    createdAt: "2026-06-28 10:10:00",
    charCount: 330,
    byteSize: 950,
  },
];

// [NEW] 7대 포스트 타입별 각 5개씩 총 35종의 정교한 페르소나 데이터 셋업
const POST_TYPE_PERSONA_SAMPLES: (PersonaProfile & { typeKey: string })[] = [
  // 1. 브랜드 스토리 포스팅 (brand-story)
  {
    id: "smp-bs-1",
    typeKey: "brand-story",
    nickname: "창업자 헤리티지 태준",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "브랜드 철학과 진정성에 반응하는 가치 소망 컨슈머",
    category: "브랜드 역사, 창업기, 장인 정신 인터뷰",
    bio: "창업 당시의 좌절과 극복 과정을 독자와 1대 1로 대화하듯 잔잔한 경어체 수필 톤으로 서술하며, 브랜드의 고유 철학을 마음 깊이 이식합니다.",
    createdAt: "2026-06-28 10:00:00",
  },
  {
    id: "smp-bs-2",
    typeKey: "brand-story",
    nickname: "ESG 가치 큐레이터 혜린",
    tone: "격식 있고 객관적인 신문 기사/논평체",
    targetAudience: "친환경 소비와 공정 무역에 관심 있는 에코 슈머",
    category: "업사이클링 스토리, 탄소 중립, 지속 가능 경영",
    bio: "제품 제작 과정에서 소요된 유기농 재료의 추적 경로와 사회 기여 지표를 신뢰도 높은 사실 조사를 가미해 격식 있고 이성적인 어조로 설명합니다.",
    createdAt: "2026-06-28 10:01:00",
  },
  {
    id: "smp-bs-3",
    typeKey: "brand-story",
    nickname: "페르소나 브랜드 디자이너 윤우",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "시각적 디테일과 공간 미학을 중시하는 디자인 애호가",
    category: "타이포그래피 스토리, 패키지 디자인 비하인드",
    bio: "색체 조합과 서체의 비례적 조화를 미술 평론가와 같은 유려하고 풍성한 어휘로 해부하여, 브랜드 로고 하나에 깃든 심미적 배치를 규명합니다.",
    createdAt: "2026-06-28 10:02:00",
  },
  {
    id: "smp-bs-4",
    typeKey: "brand-story",
    nickname: "로컬 크래프트 방랑자 길현",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "숨겨진 전통 명소와 장인의 명품을 쫓는 마니아",
    category: "수공예 가죽공방, 도자기 장인, 로컬 콘텐츠 브랜딩",
    bio: "가죽 냄새와 흙의 촉감을 날것 그대로 묘사하며, 공장제 대량생산이 주지 못하는 인간미 넘치는 장인의 하루를 다큐멘터리식 구어체로 전합니다.",
    createdAt: "2026-06-28 10:03:00",
  },
  {
    id: "smp-bs-5",
    typeKey: "brand-story",
    nickname: "감성 브랜드 카피라이터 소희",
    tone: "간결하고 호소력 있는 SNS 요약 포스팅체",
    targetAudience: "한 줄의 문장에서 위로와 울림을 얻는 감성 네티즌",
    category: "감성 카피, 일상 단상 에세이, 가치 소구",
    bio: "군더더기 없는 은유적 단문을 적극 활용하며, 상업적 판매 유도 대신 삶의 가치를 일깨우는 따스하고 세련된 목소리로 브랜드를 자연스럽게 노출합니다.",
    createdAt: "2026-06-28 10:04:00",
  },

  // 2. 서비스 소개형 포스팅 (service-intro)
  {
    id: "smp-si-1",
    typeKey: "service-intro",
    nickname: "서비스 기획 디렉터 민호",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "업무 효율화를 꾀하는 기업 실무자 및 의사결정권자",
    category: "SaaS 기능 분석, 업무 자동화, 클라우드 협업",
    bio: "서비스 도입 전후의 정량적 효율 상승 비율을 도표 데이터로 상세히 검증하고, 군더더기 없는 논리적 문장으로 기술합니다.",
    createdAt: "2026-06-28 10:05:00",
  },
  {
    id: "smp-si-2",
    typeKey: "service-intro",
    nickname: "CX 고객 경험 컨설턴트 유진",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "복잡한 프로그램 사용을 꺼려 하는 일반 고객군",
    category: "고객 온보딩 가이드, 서비스 UX 분석",
    bio: "고객 입장에서 가장 흔히 겪는 Pain Point 3가지를 공감 어린 조언과 함께 짚어주며, 과외를 해주듯 단계별 경어체로 서술합니다.",
    createdAt: "2026-06-28 10:06:00",
  },
  {
    id: "smp-si-3",
    typeKey: "service-intro",
    nickname: "가성비 솔루션 리뷰어 도윤",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "가장 저렴하고 성능 좋은 툴을 선택하려는 스마트 소비자",
    category: "구독형 서비스 비용 비교, 혜택 분석",
    bio: "무료 플랜과 유료 플랜의 기능 격차를 가감 없이 비판적으로 평가하고, 광고성 미사여구를 철저히 걸러낸 실용주의 어조를 전개합니다.",
    createdAt: "2026-06-28 10:07:00",
  },
  {
    id: "smp-si-4",
    typeKey: "service-intro",
    nickname: "B2B 마케팅 전략가 성민",
    tone: "간결하고 호소력 있는 SNS 요약 포스팅체",
    targetAudience: "매출 증진을 위해 외부 협력 툴을 찾는 소상공인/마케터",
    category: "성과 도출 마케팅 툴, 리드 수집 솔루션",
    bio: "비용 대비 투자 수익률(ROI) 성과 사례를 굵직하게 제시하며, 카드뉴스 형태의 명확하고 힘 있는 종결어미를 사용해 핵심만 빠르게 요약합니다.",
    createdAt: "2026-06-28 10:08:00",
  },
  {
    id: "smp-si-5",
    typeKey: "service-intro",
    nickname: "보안 솔루션 아키텍트 지훈",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "개인 정보 및 데이터 보안 유출을 우려하는 엔지니어",
    category: "데이터 암호화, 개인정보 가이드라인, 인프라 보안",
    bio: "보안 취약점 침투 경로를 시스템 측면에서 심층 분석하여, 서비스 내 방화벽과 이중 암호화 아키텍처를 전문가 수준의 용어로 입증해 줍니다.",
    createdAt: "2026-06-28 10:09:00",
  },

  // 3. 기업 소개 및 서비스 안내 (company-intro)
  {
    id: "smp-ci-1",
    typeKey: "company-intro",
    nickname: "IR 투자 유치 전략가 영호",
    tone: "격식 있고 객관적인 신문 기사/논평체",
    targetAudience: "기업의 재무 건전성과 미래 가치를 평가하려는 엔젤 투자자",
    category: "기업 연혁 브리핑, 핵심 기술 자산 안내",
    bio: "재무제표 지표와 특허 출원 현황을 팩트 위주로 차분히 명세하고, 과장 없는 비즈니스 공식 언어를 구사하여 격조 높은 기업 이미지를 구축합니다.",
    createdAt: "2026-06-28 10:10:00",
  },
  {
    id: "smp-ci-2",
    typeKey: "company-intro",
    nickname: "인재 영입 채용 파트너 지수",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "수평적 복지와 성장을 열망하는 취업 준비생/이직러",
    category: "기업 문화 안내, 조직원 인터뷰, 복지 혜택",
    bio: "사내 카페테리아, 유연 근무제 등 생생한 오피스 라이프를 밝고 따사로운 문체로 서술해 구직자에게 호감을 얻습니다.",
    createdAt: "2026-06-28 10:11:00",
  },
  {
    id: "smp-ci-3",
    typeKey: "company-intro",
    nickname: "고객 서비스 총괄 실장 수진",
    tone: "격식 있고 객관적인 신문 기사/논평체",
    targetAudience: "하자 보증 및 계약 조건에 민감한 신규 제휴 바이어",
    category: "무상 AS 요령, 이용 약관 해설, 제휴 절차 안내",
    bio: "책임 소재와 보증 기한을 명확하게 한정하여 공식 답변을 하듯 존대어 평서문으로 문장을 엮어 기업의 법적 정당성을 나타냅니다.",
    createdAt: "2026-06-28 10:12:00",
  },
  {
    id: "smp-ci-4",
    typeKey: "company-intro",
    nickname: "기업 기술 브랜딩 리더 태경",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "기업이 소유한 기술 인프라의 확장성에 호기심이 있는 마니아",
    category: "사내 아키텍처 로드맵, 핵심 인프라 스펙",
    bio: "핵심 특허와 연구 개발(R&D) 역사의 발자취를 상세 성능 명세서 형태로 해부하여, 동종 업계 기술 초격차 우위를 입증합니다.",
    createdAt: "2026-06-28 10:13:00",
  },
  {
    id: "smp-ci-5",
    typeKey: "company-intro",
    nickname: "글로벌 파트너십 디렉터 희선",
    tone: "격식 있고 객관적인 신문 기사/논평체",
    targetAudience: "해외 지사 협력 및 글로벌 진출을 엿보는 경제 투자층",
    category: "해외 지사 네트워킹, 글로벌 서비스 확장",
    bio: "공식 외교 문서에 준하는 수준으로 다국적 제휴 성과와 글로벌 규제 준수 이력을 나열하여 거시적 관점의 비즈니스 안정성을 통찰합니다.",
    createdAt: "2026-06-28 10:14:00",
  },

  // 4. 뉴스레터형 콘텐츠 (newsletter)
  {
    id: "smp-nl-1",
    typeKey: "newsletter",
    nickname: "트렌드 레터 에디터 수아",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "매일 아침 가벼운 사회 경제 유행을 파악하고픈 구독자",
    category: "이 주의 시사 핫이슈, 라이프스타일 밈",
    bio: "구독자에게 건네는 아침 편지처럼 'OO님'이라는 지칭을 혼용해 정답고 사교적인 말투로 시사 상식을 조밀하게 엮어 배달합니다.",
    createdAt: "2026-06-28 10:15:00",
  },
  {
    id: "smp-nl-2",
    typeKey: "newsletter",
    nickname: "북 큐레이팅 라이터 동혁",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "책 한 권의 가치를 삶에 적용해보고픈 지성 구독자",
    category: "명저 에센셜, 인생 문장 필사 가이드",
    bio: "책의 강렬한 구절로 서두를 열어 삶의 애환에 대입하고, 위로를 건네는 잔잔하고 차분한 어휘의 독백체 형태를 취합니다.",
    createdAt: "2026-06-28 10:16:00",
  },
  {
    id: "smp-nl-3",
    typeKey: "newsletter",
    nickname: "재테크 위클리 분석가 성호",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "경제 신문을 읽기 싫어하는 왕초보 주식 투자자",
    category: "금주의 증시 핵심 이슈, 환율 상식 1분 요약",
    bio: "금리 인상 소식 등을 아주 알기 쉬운 실생활 비유를 들어 과외받는 느낌의 상냥한 대화문 형태로 차근차근 해설합니다.",
    createdAt: "2026-06-28 10:17:00",
  },
  {
    id: "smp-nl-4",
    typeKey: "newsletter",
    nickname: "마케팅 인사이트 리더 지은",
    tone: "간결하고 호소력 있는 SNS 요약 포스팅체",
    targetAudience: "브랜드 성장 공식과 바이럴 꿀팁을 갈망하는 마케터",
    category: "해외 마케팅 사례 분석, 그로스 해킹 공식",
    bio: "최근 성공한 브랜드 팝업스토어 사례를 3줄 핵심 포인트로 선 요약하고, 즉각 내 브랜드에 카피해볼 수 있는 적용 전략을 명료하게 던져줍니다.",
    createdAt: "2026-06-28 10:18:00",
  },
  {
    id: "smp-nl-5",
    typeKey: "newsletter",
    nickname: "멘탈 웰니스 치유사 지수",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "바쁜 번아웃 일상 속 마음 정돈을 소망하는 구독층",
    category: "명상 요령, 심리학 산책, 감정 일기 작성 팁",
    bio: "따뜻하고 다정한 목소리로 독자의 아픔을 위로하며, 호흡법이나 가벼운 산책 코스를 독백 수필 형식의 정적인 문장으로 인도합니다.",
    createdAt: "2026-06-28 10:19:00",
  },

  // 5. 앱 가이드 (app-guide)
  {
    id: "smp-ag-1",
    typeKey: "app-guide",
    nickname: "앱 가이드 유튜버 경민",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "신규 모바일 앱 설치와 첫 세팅에 장벽을 느끼는 세대",
    category: "모바일 앱 설치 절차, 초기 회원 가입 가이드",
    bio: "구글 플레이와 앱스토어 검색 단계부터 프로필 설정까지 한 단계도 빠짐없이 스크린샷 위치를 짚어주며 친근한 구어체로 설명합니다.",
    createdAt: "2026-06-28 10:20:00",
  },
  {
    id: "smp-ag-2",
    typeKey: "app-guide",
    nickname: "생산성 앱 튜터 태호",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "메모 앱이나 업무용 앱의 고급 설정을 다루고픈 실무자",
    category: "노션 템플릿, 업무 스케줄러 연동 가이드",
    bio: "외부 서비스 API 연동 단계와 단축키 활용 설정을 구조적인 코드 블록과 화살표 표식을 동원해 논리정연하게 작성합니다.",
    createdAt: "2026-06-28 10:21:00",
  },
  {
    id: "smp-ag-3",
    typeKey: "app-guide",
    nickname: "실용 앱 사냥꾼 다솜",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "유료 결제 없이 최고의 무료 앱을 찾고픈 알뜰 모바일족",
    category: "무료 가계부 앱, 습관 타이머 추천",
    bio: "실제 다운로드 후 한 달간 가동하며 발견한 데이터 자동 백업 에러 등의 실증적 단점 위주로 팩트를 명료하게 리뷰해 줍니다.",
    createdAt: "2026-06-28 10:22:00",
  },
  {
    id: "smp-ag-4",
    typeKey: "app-guide",
    nickname: "스마트홈 연동 마스터 창우",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "가전제품 앱을 스마트싱스나 IoT 기기와 허브 연동하려는 층",
    category: "스마트 가전 페어링, 기기 공유 가이드",
    bio: "블루투스 페어링 해제 현상이나 와이파이 주파수(2.4GHz) 대역 충돌 시의 트러블슈팅 매뉴얼을 공학적 인과 관계로 명쾌히 서술합니다.",
    createdAt: "2026-06-28 10:23:00",
  },
  {
    id: "smp-ag-5",
    typeKey: "app-guide",
    nickname: "어르신 쉬운 앱 도우미 정원",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "모바일 금융 뱅킹이나 KTX 예매 앱이 너무 낯선 노령층",
    category: "쉬운 모바일 예매, 뱅킹 송금 가이드",
    bio: "전문적인 테크 언어를 철저히 한글 순화어(예: 클릭 -> 누르기, 페어링 -> 연결하기)로 순화하여 친절하게 차근차근 일러줍니다.",
    createdAt: "2026-06-28 10:24:00",
  },

  // 6. AI & 웹 가이드 (ai-web-guide)
  {
    id: "smp-awg-1",
    typeKey: "ai-web-guide",
    nickname: "ChatGPT 프롬프트 엔지니어 수민",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "LLM 활용 업무 생산성 10배 달성을 소망하는 전문가",
    category: "Few-Shot 프롬프트 튜닝, 역할 지정 명령어",
    bio: "입력값(Input)과 기대 출력값(Output)을 비교 코드 형태로 명확히 서술하여, 할루시네이션(환각)을 제거하는 구체적 명령어를 공식처럼 제시합니다.",
    createdAt: "2026-06-28 10:25:00",
  },
  {
    id: "smp-awg-2",
    typeKey: "ai-web-guide",
    nickname: "미드저니 이미지 크리에이터 유하",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "AI 이미지 생성으로 디자이너 없이 썸네일을 뽑으려는 자",
    category: "미드저니 파라미터 제어, 스타일 참조(sref) 활용",
    bio: "빛의 각도, 카메라 렌즈 화각 설정, 시드 번호 배치를 갤러리 도록 설명하듯 흥미진진한 구어체로 전개해 줍니다.",
    createdAt: "2026-06-28 10:26:00",
  },
  {
    id: "smp-awg-3",
    typeKey: "ai-web-guide",
    nickname: "노코드 AI 에이전트 빌더 성현",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "업무 프로세스에 AI 상담 챗봇을 내장하려는 스타트업",
    category: "웹 서비스 빌드, AI 챗봇 외부 사이트 임베딩",
    bio: "API 키 생성 보안 설정과 Webhook 응답 수신 구조를 시스템 관점에서 세밀하게 해부해 단계별 테크 가이드를 빌드합니다.",
    createdAt: "2026-06-28 10:27:00",
  },
  {
    id: "smp-awg-4",
    typeKey: "ai-web-guide",
    nickname: "AI 글쓰기 톤 보정 교사 아름",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "AI 초안 원고의 기계적인 어투를 교정하고 싶은 작가",
    category: "문체 보정, 이모티콘 적정성 체크",
    bio: "기계적인 어색함이 흐르는 문장과 인간미 넘치게 교정된 문장의 Before/After를 명시하고, 자연스러운 한국어 구문 팁을 차근히 알려줍니다.",
    createdAt: "2026-06-28 10:28:00",
  },
  {
    id: "smp-awg-5",
    typeKey: "ai-web-guide",
    nickname: "웹 빌더 노코드 마스터 종윤",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "개발자 없이 10분 만에 랜딩 페이지를 론칭하려는 기획자",
    category: "웹 빌더 컴포넌트 세팅, 커스텀 도메인 매핑",
    bio: "DNS 레코드(CNAME, A레코드) 입력 등 일반인이 가장 헷갈리는 설정 파트를 표식 이미지 설명과 함께 오류 없이 안내합니다.",
    createdAt: "2026-06-28 10:29:00",
  },

  // 7. 유틸리티 사용법 (utility-guide)
  {
    id: "smp-ug-1",
    typeKey: "utility-guide",
    nickname: "PC 운영체제 트러블슈터 상훈",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "윈도우/맥OS 업그레이드 후 블루스크린이나 먹통 에러를 겪는 자",
    category: "레지스트리 복구, 터미널 명령어 조치",
    bio: "커맨드 라인 명령어와 에러 코드명별 발생 원인을 공학적 논리에 입각해 짚어주며 즉각적인 명령어 해결책을 제시합니다.",
    createdAt: "2026-06-28 10:30:00",
  },
  {
    id: "smp-ug-2",
    typeKey: "utility-guide",
    nickname: "크롬 확장 프로그램 사냥꾼 민주",
    tone: "친근하고 설득력 있는 어조 (네이버 블로그)",
    targetAudience: "브라우저 유틸리티 꿀템으로 웹서핑 속도를 높이려는 직장인",
    category: "웹 스크랩 유틸리티, 마우스 제스처 세팅",
    bio: "설치 및 백그라운드 리소스 점유 단점(메모리 릭 유발 방지 등)을 세련되게 평가하며 실용 가치가 높은 툴 조합을 짚어 줍니다.",
    createdAt: "2026-06-28 10:31:00",
  },
  {
    id: "smp-ug-3",
    typeKey: "utility-guide",
    nickname: "가정용 홈 네트워크 마스터 동진",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "공유기 교체 후 와이파이 끊김이나 NAS 연동 장벽을 겪는 층",
    category: "포트포워딩 설정, 공유기 멀티캐스트 제어",
    bio: "내부 IP 할당 개념과 DDNS 연결 주소 매핑 설정을 망 아키텍처 수준에서 정확한 기술 용어를 섞어 명쾌하게 가이드합니다.",
    createdAt: "2026-06-28 10:32:00",
  },
  {
    id: "smp-ug-4",
    typeKey: "utility-guide",
    nickname: "포토샵 액션 생산성 튜터 예원",
    tone: "스토리텔링 중심의 흥미진진한 구어체",
    targetAudience: "단순 반복 그래픽 작업을 일괄 단축키로 끝내고픈 디자이너",
    category: "그래픽 배치 액션 녹화, 일괄 리사이징 유틸리티",
    bio: "자주 쓰이는 액션 레코딩 셋업 순서를 흥미진진하게 풀어내며, 오류가 나는 병목 지점을 미리 예방하는 꿀팁을 전수합니다.",
    createdAt: "2026-06-28 10:33:00",
  },
  {
    id: "smp-ug-5",
    typeKey: "utility-guide",
    nickname: "노션 포뮬러 수식 설계자 철우",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "관계형 롤업과 포뮬러 2.0 수식을 설계하려는 파워 유저",
    category: "수식 문법 오류 해결, 다크모드 대시보드 정렬",
    bio: "조건문 분기 괄호 짝 맞추기 에러 트러블슈팅과 관계형 매핑 문법을 안전한 코드 형식으로 검증해 전수합니다.",
    createdAt: "2026-06-28 10:34:00",
  },
];

const DEFAULT_PERSONAS: PersonaProfile[] = POST_TYPE_PERSONA_SAMPLES.slice(0, 2);

export default function KnowledgePersonaPage() {
  const [activeTab, setActiveTab] = useState<"persona" | "knowledge">("persona");
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [personaList, setPersonaList] = useState<PersonaProfile[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // [NEW] 좌측 라이브러리용 포스트 타입 선택 State
  const [activePostType, setActivePostType] = useState("brand-story");

  // 지식 탭 모달
  const [isKnowledgePanelOpen, setIsKnowledgePanelOpen] = useState(false);
  const [editingKnowledgeId, setEditingKnowledgeId] = useState<string | null>(null);
  const [knowledgeFormData, setKnowledgeFormData] = useState({
    title: "",
    description: "",
    content: "",
    tagsInput: "",
  });

  // 페르소나 탭 모달
  const [isPersonaPanelOpen, setIsPersonaPanelOpen] = useState(false);
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [personaFormData, setPersonaFormData] = useState({
    nickname: "",
    tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
    targetAudience: "",
    category: "",
    bio: "",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 로컬 스토리지 연동 로드
  useEffect(() => {
    try {
      const storedKnowledge = localStorage.getItem("creaibox_knowledge_base");
      if (storedKnowledge) {
        setKnowledgeList(JSON.parse(storedKnowledge));
      } else {
        setKnowledgeList(DEFAULT_KNOWLEDGE);
        localStorage.setItem("creaibox_knowledge_base", JSON.stringify(DEFAULT_KNOWLEDGE));
      }

      const storedPersonaList = localStorage.getItem("creaibox_persona_list");
      if (storedPersonaList) {
        setPersonaList(JSON.parse(storedPersonaList));
      } else {
        const oldSinglePersona = localStorage.getItem("creaibox_persona_profile");
        if (oldSinglePersona) {
          try {
            const parsedOld = JSON.parse(oldSinglePersona);
            const migrated: PersonaProfile = {
              id: `ps-${Date.now()}`,
              nickname: parsedOld.nickname || "기존 페르소나",
              tone: parsedOld.tone || "전문적이고 통찰력 있는 분석 (기술 블로그)",
              targetAudience: parsedOld.targetAudience || "타겟층 미정",
              category: parsedOld.category || "미분류",
              bio: parsedOld.bio || "",
              createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
            };
            setPersonaList([migrated]);
            localStorage.setItem("creaibox_persona_list", JSON.stringify([migrated]));
          } catch {
            setPersonaList(DEFAULT_PERSONAS);
            localStorage.setItem("creaibox_persona_list", JSON.stringify(DEFAULT_PERSONAS));
          }
        } else {
          setPersonaList(DEFAULT_PERSONAS);
          localStorage.setItem("creaibox_persona_list", JSON.stringify(DEFAULT_PERSONAS));
        }
      }
    } catch (e) {
      console.error("스토리지 로드 실패:", e);
      setKnowledgeList(DEFAULT_KNOWLEDGE);
      setPersonaList(DEFAULT_PERSONAS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 토스트 타이머
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 검색 및 태그 필터링 처리 (지식)
  const filteredKnowledgeList = useMemo(() => {
    return knowledgeList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [knowledgeList, searchQuery, selectedTag]);

  // 유니크 태그 추출
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    knowledgeList.forEach((item) => {
      item.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [knowledgeList]);

  // 바이트 크기 도출
  const getByteSize = (str: string) => {
    return new Blob([str]).size;
  };

  // 포스트 타입 필터링 적용된 좌측 라이브러리 샘플 리스트
  const filteredPostTypeSamples = useMemo(() => {
    return POST_TYPE_PERSONA_SAMPLES.filter((s) => s.typeKey === activePostType);
  }, [activePostType]);

  // 페르소나 패널 열기
  const openPersonaPanel = (item?: PersonaProfile) => {
    if (item) {
      setEditingPersonaId(item.id);
      setPersonaFormData({
        nickname: item.nickname,
        tone: item.tone,
        targetAudience: item.targetAudience,
        category: item.category,
        bio: item.bio,
      });
    } else {
      setEditingPersonaId(null);
      setPersonaFormData({
        nickname: "",
        tone: "전문적이고 통찰력 있는 분석 (기술 블로그)",
        targetAudience: "",
        category: "",
        bio: "",
      });
    }
    setIsPersonaPanelOpen(true);
  };

  // [NEW] 좌측 라이브러리에서 샘플 통째로 가져와 폼에 채우기 핸들러
  const handleImportSample = (sample: PersonaProfile) => {
    setEditingPersonaId(null); // 신규 등록 모드로 설정
    setPersonaFormData({
      nickname: sample.nickname,
      tone: sample.tone,
      targetAudience: sample.targetAudience,
      category: sample.category,
      bio: sample.bio,
    });
    setIsPersonaPanelOpen(true);
    setToastMessage(`'${sample.nickname}' 페르소나 스펙을 가져왔습니다. 내용을 조율한 뒤 저장하십시오.`);
  };

  // 페르소나 저장
  const handleSavePersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personaFormData.nickname.trim()) {
      alert("작가명을 입력해 주세요.");
      return;
    }

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    let updatedList: PersonaProfile[] = [];

    if (editingPersonaId) {
      updatedList = personaList.map((item) => {
        if (item.id === editingPersonaId) {
          return {
            ...item,
            nickname: personaFormData.nickname.trim(),
            tone: personaFormData.tone,
            targetAudience: personaFormData.targetAudience.trim(),
            category: personaFormData.category.trim(),
            bio: personaFormData.bio,
          };
        }
        return item;
      });
      setToastMessage("작가 페르소나가 갱신되었습니다.");
    } else {
      const newItem: PersonaProfile = {
        id: `ps-${Date.now()}`,
        nickname: personaFormData.nickname.trim(),
        tone: personaFormData.tone,
        targetAudience: personaFormData.targetAudience.trim(),
        category: personaFormData.category.trim(),
        bio: personaFormData.bio,
        createdAt: nowStr,
      };
      updatedList = [newItem, ...personaList];
      setToastMessage("새 작가 페르소나가 목록에 추가되었습니다.");
    }

    setPersonaList(updatedList);
    localStorage.setItem("creaibox_persona_list", JSON.stringify(updatedList));
    setIsPersonaPanelOpen(false);
  };

  // 페르소나 삭제
  const handleDeletePersona = (id: string, name: string) => {
    if (!confirm(`'${name}' 페르소나 프로필을 삭제하시겠습니까?`)) return;

    const updatedList = personaList.filter((item) => item.id !== id);
    setPersonaList(updatedList);
    localStorage.setItem("creaibox_persona_list", JSON.stringify(updatedList));
    setToastMessage("페르소나가 삭제되었습니다.");
  };

  // 지식 패널 열기
  const openKnowledgePanel = (item?: KnowledgeItem) => {
    if (item) {
      setEditingKnowledgeId(item.id);
      setKnowledgeFormData({
        title: item.title,
        description: item.description,
        content: item.content,
        tagsInput: item.tags.join(", "),
      });
    } else {
      setEditingKnowledgeId(null);
      setKnowledgeFormData({
        title: "",
        description: "",
        content: "",
        tagsInput: "",
      });
    }
    setIsKnowledgePanelOpen(true);
  };

  // 지식 저장
  const handleSaveKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledgeFormData.title.trim()) {
      alert("지식명을 입력해 주세요.");
      return;
    }

    const tagsArray = knowledgeFormData.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    let updatedList: KnowledgeItem[] = [];

    if (editingKnowledgeId) {
      updatedList = knowledgeList.map((item) => {
        if (item.id === editingKnowledgeId) {
          return {
            ...item,
            title: knowledgeFormData.title.trim(),
            description: knowledgeFormData.description.trim(),
            content: knowledgeFormData.content,
            tags: tagsArray,
            charCount: knowledgeFormData.content.length,
            byteSize: getByteSize(knowledgeFormData.content),
          };
        }
        return item;
      });
      setToastMessage("지식 아카이브 정보가 갱신되었습니다.");
    } else {
      const newItem: KnowledgeItem = {
        id: `kl-${Date.now()}`,
        title: knowledgeFormData.title.trim(),
        description: knowledgeFormData.description.trim(),
        content: knowledgeFormData.content,
        tags: tagsArray,
        createdAt: nowStr,
        charCount: knowledgeFormData.content.length,
        byteSize: getByteSize(knowledgeFormData.content),
      };
      updatedList = [newItem, ...knowledgeList];
      setToastMessage("지식 보관함에 새 지식 카드가 추가되었습니다.");
    }

    setKnowledgeList(updatedList);
    localStorage.setItem("creaibox_knowledge_base", JSON.stringify(updatedList));
    setIsKnowledgePanelOpen(false);
  };

  // 지식 삭제
  const handleDeleteKnowledge = (id: string, name: string) => {
    if (!confirm(`'${name}' 지식을 영구 삭제하시겠습니까?`)) return;

    const updatedList = knowledgeList.filter((item) => item.id !== id);
    setKnowledgeList(updatedList);
    localStorage.setItem("creaibox_knowledge_base", JSON.stringify(updatedList));
    setToastMessage("지식 카드가 정상 제거되었습니다.");
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 p-6 md:p-10 space-y-6 relative overflow-x-hidden">
      
      {/* 상단 타이틀 바 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-400">
            <Database size={18} />
            <span className="text-xs font-black tracking-wider uppercase">Creaibox Studio</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            지식 & 페르소나
          </h1>
          <p className="text-sm text-slate-400">
            여러 개 블로그 채널에 대응하는 작가 정체성(How)과 각 채널 글쓰기에 인용할 팩트 지식(What)을 효율적으로 다중 제어합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/studio"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-slate-200 hover:border-violet-400/40 transition"
          >
            <ArrowLeft size={14} />
            스튜디오 나가기
          </Link>
          {activeTab === "persona" ? (
            <button
              onClick={() => openPersonaPanel()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-4 text-xs font-black text-white transition shadow-lg shadow-violet-950/20"
            >
              <Plus size={14} />
              새 페르소나 등록
            </button>
          ) : (
            <button
              onClick={() => openKnowledgePanel()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-4 text-xs font-black text-white transition shadow-lg shadow-violet-950/20"
            >
              <Plus size={14} />
              새 지식 등록
            </button>
          )}
        </div>
      </div>

      {/* 2대 상단 탭 스위처 */}
      <div className="flex border-b border-white/10 bg-white/[0.01] rounded-2xl p-1 max-w-md">
        <button
          onClick={() => setActiveTab("persona")}
          className={`flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-black transition-all ${
            activeTab === "persona"
              ? "bg-violet-500 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <UserCheck size={14} />
          작가 페르소나 설정 ({personaList.length})
        </button>
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-black transition-all ${
            activeTab === "knowledge"
              ? "bg-violet-500 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Database size={14} />
          참조 지식 아카이브 ({knowledgeList.length})
        </button>
      </div>

      {/* 로딩 표시 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-white/10 bg-white/[0.02]">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
          <p className="mt-4 text-sm text-slate-400 font-bold">프로필 및 아카이브 정보를 불러오는 중입니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* [NEW/REFACTORED] 탭 1: 작가 페르소나 설정 (좌우 2분할 레이아웃) */}
          {activeTab === "persona" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
              
              {/* [좌측 - 2열] 포스트 타입 연동 페르소나 샘플 라이브러리 */}
              <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.01] p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-violet-400">
                    <Sparkles size={13} className="animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-wider">포스트 타입 라이브러리</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-normal">
                    AI 콘텐츠 플래너 장르 규격에 맞게 설계된 페르소나 세팅입니다. 이 템플릿 사용을 누르면 우측에 즉시 입력됩니다.
                  </p>
                </div>

                {/* 7대 포스트 타입 카테고리 세로/가로 배치 */}
                <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-4">
                  {POST_TYPES.map((type) => (
                    <button
                      key={type.key}
                      onClick={() => setActivePostType(type.key)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                        activePostType === type.key
                          ? "bg-violet-500 text-white shadow-sm"
                          : "border border-white/10 bg-black/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>

                {/* 해당 포스트 타입별 5개 카드 나열 (max-h 제거하여 자연스럽게 전체 다 보이게 함) */}
                <div className="space-y-4">
                  {filteredPostTypeSamples.map((sample) => (
                    <div
                      key={sample.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.01] hover:border-violet-500/20 p-5 space-y-4 transition flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-lg font-black text-white">{sample.nickname}</span>
                          <span className="text-xs font-black text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded-xl bg-violet-500/5">
                            {sample.category}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-200 leading-normal">
                          <span className="text-xs text-slate-500 block uppercase font-bold mb-0.5">대표 말투</span>
                          {sample.tone}
                        </div>
                        <div className="text-sm font-bold text-slate-350 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/5">
                          {sample.bio}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleImportSample(sample)}
                        className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-white/[0.04] hover:bg-violet-500 hover:text-white text-xs font-black text-slate-200 border border-white/10 hover:border-violet-500/30 transition-all mt-2"
                      >
                        <UserCheck size={13} />
                        이 페르소나 가져오기
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* [우측 - 3열] 내가 커스터마이징해 생성한 페르소나 목록 */}
              <div className="xl:col-span-3 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    내가 생성한 작가 페르소나 ({personaList.length})
                  </h3>
                  <button
                    onClick={() => openPersonaPanel()}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 text-[10px] font-black text-violet-300 hover:bg-violet-500 hover:text-white transition"
                  >
                    <Plus size={11} />
                    직접 페르소나 생성
                  </button>
                </div>

                {personaList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-white/10 bg-white/[0.02] text-center px-4">
                    <UserCheck size={36} className="text-slate-650 mb-3" />
                    <p className="text-sm font-bold text-slate-450">활성화된 내 페르소나 정보가 존재하지 않습니다.</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      왼쪽 라이브러리에서 샘플을 가져오거나, 직접 페르소나 생성 단추를 눌러 프로필을 셋업하십시오.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personaList.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-white/10 bg-zinc-950 p-5 flex flex-col justify-between min-h-[240px] hover:border-white/20 transition-all"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-300 font-black text-sm">
                                {item.nickname.substring(0, 1)}
                              </div>
                              <h3 className="text-lg font-black text-white">{item.nickname}</h3>
                            </div>
                            <span className="text-xs font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-xl">
                              {item.category || "카테고리 미정"}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm font-bold text-slate-200 border-t border-white/5 pt-3">
                            <div>
                              <span className="text-xs text-slate-500 block uppercase font-bold">대변 말투</span>
                              <span className="text-slate-200 mt-0.5 block">{item.tone}</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block uppercase font-bold">주요 타겟 독자</span>
                              <span className="text-slate-200 mt-0.5 block">{item.targetAudience}</span>
                            </div>
                          </div>

                          {item.bio && (
                            <p className="text-sm text-slate-350 leading-relaxed font-bold bg-black/40 p-3.5 rounded-2xl border border-white/5">
                              {item.bio}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 border-t border-white/5 pt-3 flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => openPersonaPanel(item)}
                            className="inline-flex h-8 px-3 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white text-xs font-bold transition"
                          >
                            <Edit size={11} />
                            수정
                          </button>
                          <button
                            onClick={() => handleDeletePersona(item.id, item.nickname)}
                            className="inline-flex h-8 px-3 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:border-red-400/40 hover:text-red-300 text-xs font-bold transition"
                          >
                            <Trash2 size={11} />
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 탭 2: 참조 지식 아카이브 */}
          {activeTab === "knowledge" && (
            <div className="space-y-6">
              {/* 검색 및 필터 패널 */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                <div className="w-full md:max-w-md relative">
                  <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="지식명, 설명 또는 본문 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 pl-9 pr-4 text-xs font-bold text-slate-200 outline-none focus:border-violet-500/50 transition"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 justify-end w-full md:w-auto">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      selectedTag === null
                        ? "bg-violet-500 text-white font-black"
                        : "border border-white/10 bg-black/40 text-slate-400 hover:text-white"
                    }`}
                  >
                    전체 태그
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                        selectedTag === tag
                          ? "bg-violet-500 text-white font-black"
                          : "border border-white/10 bg-black/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Tag size={8} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 지식 리스트 */}
              {filteredKnowledgeList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-white/10 bg-white/[0.02] text-center px-4">
                  <Database size={36} className="text-slate-650 mb-3" />
                  <p className="text-sm font-bold text-slate-400">등록된 지식 데이터가 없습니다.</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    새 지식 등록 버튼을 클릭하여 나만의 백과사전 노트를 작성해 보세요.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredKnowledgeList.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition p-5 flex flex-col justify-between min-h-[220px]"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-black text-white leading-snug line-clamp-1">
                            {item.title}
                          </h3>
                          <span className="text-[9px] font-black text-slate-500 border border-white/5 px-1.5 py-0.5 rounded uppercase">
                            {(item.byteSize / 1024).toFixed(2)} KB
                          </span>
                        </div>

                        <p className="text-xs text-slate-450 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>

                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-3">
                          {item.content}
                        </div>
                      </div>

                      <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 text-[8px] font-black"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openKnowledgePanel(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white transition"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteKnowledge(item.id, item.title)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 hover:border-red-400/40 hover:text-red-300 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 우측 슬라이드인 패널 (페르소나 등록/수정용) */}
      {isPersonaPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="flex-1" onClick={() => setIsPersonaPanelOpen(false)}></div>
          <div className="w-full max-w-lg bg-zinc-950 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-slide-in overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-violet-400" />
                  <h3 className="text-sm font-black text-white">
                    {editingPersonaId ? "작가 페르소나 수정" : "새 페르소나 등록"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsPersonaPanelOpen(false)}
                  className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSavePersona} className="space-y-4 text-xs font-bold text-slate-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">작가명 / 필명</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 테크 마케터 지우, 뷰티 리뷰어 나영"
                    value={personaFormData.nickname}
                    onChange={(e) => setPersonaFormData({ ...personaFormData, nickname: e.target.value })}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 px-3 outline-none focus:border-violet-500/50 text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">대표 전문 분야 (카테고리)</label>
                  <input
                    type="text"
                    placeholder="예: IT 디바이스 리뷰, 맛집 및 감성 카페 큐레이션"
                    value={personaFormData.category}
                    onChange={(e) => setPersonaFormData({ ...personaFormData, category: e.target.value })}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 px-3 outline-none focus:border-violet-500/50 text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">주요 타겟 독자</label>
                  <input
                    type="text"
                    placeholder="예: 2030 직장인 트렌드 세터, 알뜰 캠핑족"
                    value={personaFormData.targetAudience}
                    onChange={(e) => setPersonaFormData({ ...personaFormData, targetAudience: e.target.value })}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 px-3 outline-none focus:border-violet-500/50 text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">대표 어조 (Tone & Manner)</label>
                  <select
                    value={personaFormData.tone}
                    onChange={(e) => setPersonaFormData({ ...personaFormData, tone: e.target.value })}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 px-3 outline-none focus:border-violet-500/50 text-slate-200 cursor-pointer"
                  >
                    <option>전문적이고 통찰력 있는 분석 (기술 블로그)</option>
                    <option>친근하고 설득력 있는 어조 (네이버 블로그)</option>
                    <option>스토리텔링 중심의 흥미진진한 구어체</option>
                    <option>격식 있고 객관적인 신문 기사/논평체</option>
                    <option>간결하고 호소력 있는 SNS 요약 포스팅체</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">세부 인격 지침 (Bio)</label>
                  <textarea
                    placeholder="글을 쓸 때 반영할 세부 성격이나 강조사항을 자유롭게 서술해 주십시오..."
                    value={personaFormData.bio}
                    onChange={(e) => setPersonaFormData({ ...personaFormData, bio: e.target.value })}
                    rows={5}
                    className="w-full rounded-xl bg-black border border-white/10 p-3 outline-none focus:border-violet-500/50 text-slate-200 leading-relaxed font-bold resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-xs font-black text-white transition shadow-lg shadow-violet-950/20"
                  >
                    <Save size={13} />
                    저장하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPersonaPanelOpen(false)}
                    className="flex-1 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-300 hover:bg-white/[0.08] transition"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
            
            <div className="border-t border-white/5 pt-4 text-[10px] text-slate-500 font-bold flex items-center gap-1.5 leading-relaxed mt-6">
              <Info size={12} className="text-violet-400" />
              <span>등록한 프로필은 글쓰기 파트너의 인격으로 유기적으로 바인딩됩니다.</span>
            </div>
          </div>
        </div>
      )}

      {/* 우측 슬라이드인 패널 (지식 등록/수정용) */}
      {isKnowledgePanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="flex-1" onClick={() => setIsKnowledgePanelOpen(false)}></div>
          <div className="w-full max-w-lg bg-zinc-950 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-slide-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-violet-400" />
                  <h3 className="text-sm font-black text-white">
                    {editingKnowledgeId ? "지식 정보 수정" : "새 지식 등록"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsKnowledgePanelOpen(false)}
                  className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveKnowledge} className="space-y-4 text-xs font-bold text-slate-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">지식명</label>
                  <input
                    type="text"
                    required
                    placeholder="지식을 구분할 수 있는 이름을 적어주세요..."
                    value={knowledgeFormData.title}
                    onChange={(e) => setKnowledgeFormData({ ...knowledgeFormData, title: e.target.value })}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 px-3 outline-none focus:border-violet-500/50 text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">설명 / 요약</label>
                  <input
                    type="text"
                    placeholder="이 지식이 어떤 영역을 설명하는지 요약해 주세요..."
                    value={knowledgeFormData.description}
                    onChange={(e) => setKnowledgeFormData({ ...knowledgeFormData, description: e.target.value })}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 px-3 outline-none focus:border-violet-500/50 text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">본문 내용</label>
                  <textarea
                    placeholder="회사 설명글, 마케팅 원천 소스 등 AI가 글을 쓸 때 활용할 실제 내용을 상세하게 적어주세요..."
                    value={knowledgeFormData.content}
                    onChange={(e) => setKnowledgeFormData({ ...knowledgeFormData, content: e.target.value })}
                    rows={8}
                    className="w-full rounded-xl bg-black border border-white/10 p-3 outline-none focus:border-violet-500/50 text-slate-200 leading-relaxed font-bold resize-none"
                  />
                  <div className="flex justify-end text-[10px] text-slate-500 font-bold">
                    <span>{knowledgeFormData.content.length} 자 • {getByteSize(knowledgeFormData.content)} Bytes</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">검색 태그</label>
                  <input
                    type="text"
                    placeholder="쉼표(,)로 구분하여 등록해 주세요. 예: 서비스, 소개, 회사"
                    value={knowledgeFormData.tagsInput}
                    onChange={(e) => setKnowledgeFormData({ ...knowledgeFormData, tagsInput: e.target.value })}
                    className="w-full h-10 rounded-xl bg-black border border-white/10 px-3 outline-none focus:border-violet-500/50 text-slate-200"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-xs font-black text-white transition shadow-lg shadow-violet-950/20"
                  >
                    <Save size={13} />
                    저장하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsKnowledgePanelOpen(false)}
                    className="flex-1 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-300 hover:bg-white/[0.08] transition"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
            
            <div className="border-t border-white/5 pt-4 text-[10px] text-slate-500 font-bold flex items-center gap-1.5 leading-relaxed">
              <Info size={12} className="text-violet-400" />
              <span>작성된 고유 데이터는 크리에이박스 AI 작가 엔진과 실시간 클라우드로 유기적으로 싱크됩니다.</span>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 푸시 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-violet-500/30 bg-zinc-950 p-4 shadow-2xl max-w-md animate-fade-in flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-violet-450 uppercase tracking-wider">
              Profile & Knowledge Base Sync
            </span>
            <p className="text-xs text-slate-300 font-bold leading-normal">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
