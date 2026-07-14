"use client";

import React, { useState } from "react";
import { 
  Search, Mail, FileText, ChevronDown, 
  HelpCircle, ArrowRight, ClipboardList
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// 🌟 FAQ 카테고리 정의
const CATEGORIES = [
  { id: "all", label: "전체 FAQ" },
  { id: "service", label: "서비스 시작 & 계정" },
  { id: "video", label: "비디오 스튜디오" },
  { id: "ai", label: "AI 생성 스튜디오" },
  { id: "storage", label: "클라우드 저장소" },
  { id: "troubleshoot", label: "시스템 및 오류 해결" },
] as const;

// 🌟 바둑판식 "카테고리별로 찾아보세요" 데이터 정의 (그라데이션 불허)
const QUICK_CATEGORIES = [
  { label: "시작/관리하기", targetId: "service", keyword: "가입" },
  { label: "계정/보안", targetId: "service", keyword: "로그인" },
  { label: "비즈멤버십", targetId: "service", keyword: "구독" },
  { label: "요금/결제", targetId: "service", keyword: "결제" },
  { label: "비디오 컷편집", targetId: "video", keyword: "타임라인" },
  { label: "자막/텍스트 속성", targetId: "video", keyword: "자막" },
  { label: "영상 역재생/배속", targetId: "video", keyword: "역재생" },
  { label: "렌더링/멀티태스크", targetId: "video", keyword: "렌더링" },
  { label: "WAV/MP3 오디오", targetId: "video", keyword: "음악" },
  { label: "AI 고품질 이미지", targetId: "ai", keyword: "이미지" },
  { label: "AI 오디오 생성", targetId: "ai", keyword: "음악" },
  { label: "클라우드 저장소", targetId: "storage", keyword: "저장" },
  { label: "시스템 오류 해결", targetId: "troubleshoot", keyword: "브라우저" }
] as const;

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 🌟 고도화된 FAQ 데이터 베이스 리스트
  const faqList = [
    // 1. 서비스 시작 및 계정 (service)
    {
      category: "service",
      question: "크리에이박스는 어떤 서비스인가요?",
      answer: "크리에이박스(CreAibox)는 글쓰기, 이미지, 비디오, 뮤직 생성 및 트렌드 분석까지 하나의 스튜디오 안에서 모두 해결할 수 있는 올인원 인공지능 콘텐츠 생성 플랫폼입니다."
    },
    {
      category: "service",
      question: "회원가입 및 로그인은 어떻게 진행하나요?",
      answer: "우측 상단의 로그인 버튼을 통해 카카오, 네이버, 구글 등 편리한 소셜 로그인 계정으로 3초 만에 간편 가입 및 로그인을 완료하실 수 있습니다."
    },
    {
      category: "service",
      question: "무료 회원과 유료 구독 요금제의 혜택 차이는 무엇인가요?",
      answer: "무료 회원은 기본 체험용 웰컴 크레딧이 제공되어 모든 스튜디오를 맛보기용으로 체험해 볼 수 있습니다. 유료 구독 요금제를 이용하시면 풍부한 매월 생성 크레딧, 초고속 전용 생성 망, 클라우드 전용 격리 저장소 확보 등 비즈니스 및 전문 크리에이터 작업을 위한 모든 프리미엄 기능이 제한 없이 해제됩니다."
    },
    {
      category: "service",
      question: "구독 결제 수단을 변경하거나 해지하고 싶을 때는 어떻게 하나요?",
      answer: "마이페이지 > 프로필 설정 및 '구독 관리' 메뉴에서 현재 결제 카드를 변경하시거나 언제든지 원클릭으로 구독을 해지하실 수 있습니다. 해지하시더라도 이번 달 결제 주기의 남은 기간 동안은 유료 혜택이 그대로 유지됩니다."
    },

    // 2. 비디오 스튜디오 사용법 (video)
    {
      category: "video",
      question: "동영상 클립을 자르고, 붙이고, 타임라인에서 위치를 이동하는 방법은 무엇인가요?",
      answer: "비디오 스튜디오 진입 후 원하는 비디오 클립을 타임라인에 드래그하거나 '+' 버튼으로 추가합니다. 타임라인 위에 정렬된 클립을 선택한 뒤 툴바의 '분할(컷)' 버튼을 누르면 정밀하게 자를 수 있으며, 클립의 양끝을 늘리거나 줄여 길이를 편집할 수 있습니다. 마우스로 클립을 잡고 드래그하면 원하는 위치나 다른 트랙으로 간편하게 이동시킬 수 있습니다."
    },
    {
      category: "video",
      question: "자막이나 텍스트 요소를 추가하고 글꼴, 색상, 배경 등 스타일을 변경하려면 어떻게 하나요?",
      answer: "왼쪽 메뉴에서 '텍스트/자막' 탭을 선택하고 '텍스트 추가' 또는 '자막 추가'를 누르면 타임라인에 자막 클립이 생성됩니다. 자막 클립을 선택하면 우측에 '속성 편집기(Inspector)'가 노출되며, 이 영역에서 텍스트 문구 입력, 글꼴 크기, 텍스트 색상, 배경색 투명도, 위치 좌표(X, Y) 등을 실시간으로 편리하게 편집하실 수 있습니다."
    },
    {
      category: "video",
      question: "동영상의 특정 구간을 배속 조절하거나 역재생(Reverse)으로 변환하는 방법은 무엇인가요?",
      answer: "역재생하고 싶은 영상 클립을 타임라인에서 마우스로 클릭하여 선택한 후, 타임라인 상단 툴바의 '역재생' 버튼을 누르면 FFmpeg 인코더가 동작하여 영상을 역방향으로 인코딩하여 미디어 라이브러리에 자동 등록 및 타임라인 클립을 즉시 대체해 줍니다."
    },
    {
      category: "video",
      question: "완성된 프로젝트의 화면 비율(16:9 가로, 9:16 세로 등)을 편집 중간에 변경해도 안전한가요?",
      answer: "네, 안전합니다. 캔버스 툴바 상단의 '가로세로 비율' 버튼을 통해 언제든지 16:9, 9:16, 1:1, 4:5 등 다양한 규격으로 실시간 변경하실 수 있으며, 변경된 비율에 맞추어 프리뷰 화면이 자동으로 맞춰집니다. 내보내기 시에도 선택된 최종 화면 비율에 맞춰 영상 파일이 정상 인코딩됩니다."
    },
    {
      category: "video",
      question: "비디오 렌더링(내보내기) 중에 다른 메뉴(예: 글쓰기)를 사용하면 렌더링이 멈추나요?",
      answer: "네, 같은 브라우저 탭 내에서 다른 메뉴로 이동하면 Next.js SPA 특성상 기존 에디터가 언마운트되어 작업이 차단됩니다. 멀티태스킹을 위해서는 내보내기 진행 탭을 유지한 상태에서 마우스 우클릭을 통해 '새 탭으로 열기'로 다른 작업을 기획해 주세요. 백그라운드 탭으로 두어도 최고 성능으로 안정적인 렌더링 동기화를 마감해 드립니다."
    },

    // 3. AI 이미지 & 음악 생성 (ai)
    {
      category: "ai",
      question: "AI 음악 및 이미지 생성 시 원하는 고품질 결과물을 얻기 위한 프롬프트 작성 팁이 있나요?",
      answer: "구체적이고 상세한 형용사를 많이 사용하는 것이 좋습니다. 이미지의 경우 원하는 화풍(예: 3D Render, Cinematic Light, Anime style)이나 조명 상태를 명시하면 효과적입니다. 음악의 경우 장르(Lofi, Acoustic, Cinematic), 템포(Slow, Upbeat), 악기 구성(Piano, Synth, Electric Guitar)을 명시하면 AI가 키워드를 조합하여 높은 완성도의 오디오 트랙을 생성해 줍니다."
    },
    {
      category: "ai",
      question: "크리에이박스에서 생성한 음악과 이미지는 상업적 용도로 사용해도 법적 문제가 없나요?",
      answer: "네, 완전히 안전합니다. 유료 구독 요금제뿐만 아니라 무료 크레딧으로 생성하신 모든 콘텐츠도 상업적 이용 권한이 100% 보장됩니다. 출처 표기 의무가 없으며 유튜브 수익 창출, 기업 홍보 영상 제작, SNS 광고 등 모든 상업적 비즈니스에 저작권 걱정 없이 자유롭게 사용하실 수 있습니다."
    },
    {
      category: "ai",
      question: "크리에이박스 글쓰기 스튜디오의 '구조화 스키마(Schema)' 기능은 무엇이며 어떻게 작동하나요?",
      answer: "구조화 스키마(JSON-LD)는 구글, 네이버 등 검색 엔진의 크롤링 로봇에게 블로그 글의 성격(일반 기사, 자주 묻는 질문(FAQ), 가이드 등)을 기계용 데이터로 정확하게 알려주는 글로벌 SEO 표준 마크업입니다.\n\n[작동 원리 및 사용법]\n1. 스튜디오 글쓰기 우측 '스키마' 탭에서 AI 엔진과 스키마 유형(추천/Article/FAQPage 등)을 선택한 후 [AI 스키마 자동 생성]을 누릅니다.\n2. 생성된 코드를 확인하고 [본문에 적용하기]를 클릭하면, 원고 본문 맨 하단에 눈에 보이지 않는 HTML 주석(Comment) 래퍼 형태로 자동 주입됩니다.\n3. 저장 후 발행(Publish)하면, 시스템이 이 주석을 실시간으로 감지하고 추출하여 기사 페이지의 HTML <head> 내부에 검색엔진용 스크립트로 안전하게 꽂아 넣습니다.\n\n일반 독자가 읽는 본문 영역의 가독성은 티 없이 깨끗하게 보존하면서, 검색 엔진 로봇에게만 스키마 데이터를 전달하여 구글 및 네이버 검색 결과 영역에 풍부한 Rich Snippet(접이식 FAQ 메뉴 등)이 노출되도록 랭킹 점수를 최적화해 주는 고급 기능입니다."
    },
    {
      category: "ai",
      question: "내 브랜드 블로그에 구글 애널리틱스(GA4)와 구글 서치콘솔은 어떻게 연동하나요?",
      answer: "크리에이박스는 번거로운 수동 분석 셋팅 작업을 100% 자동화했습니다.\n\n1. 구글 애널리틱스(GA4) 자동 연동: 브랜드 신청 후 관리자가 승인(도메인 연결)하는 즉시, 크리에이박스 백엔드 서버가 Google Analytics Admin API를 직접 호출하여 해당 도메인 전용 분석 프로퍼티를 자동 개설하고 측정 ID(G-XXXXXX)를 주입합니다. 사용자는 별도의 삽입 작업을 하실 필요가 없습니다.\n2. 구글 서치콘솔 연동: 구글 서치콘솔 등록 화면에서 'URL 접두사' 방식을 선택해 도메인 주소(https://도메인)를 입력한 후 'HTML 태그(메타태그)' 인증 방식을 선택하십시오. 여기서 발급받은 'google-site-verification' 키값을 [공식 블로그 관리 > SEO 및 연동 관리] 탭의 '구글 서치콘솔 연동 키' 입력란에 붙여넣고 저장만 하시면 구글이 사이트 헤더를 자동으로 인식하여 1초 만에 소유권 인증이 완료됩니다."
    },

    // 4. 클라우드 저장소 (storage)
    {
      category: "storage",
      question: "업로드한 동영상 소스나 음악 에셋의 용량 제한이 있나요?",
      answer: "무료 등급 회원은 전체 1GB의 미디어 저장 공간을 사용할 수 있으며, 프로 등급 이상은 최대 50GB의 개인 전용 격리형 클라우드 스토리지가 지급됩니다."
    },
    {
      category: "storage",
      question: "IndexedDB 캐시란 무엇이며 왜 디스크 용량이 증가하나요?",
      answer: "IndexedDB는 동영상 스튜디오에서 고용량 비디오 에셋의 실시간 편집, 자막 렌더링, 역재생 변환 등을 끊김 없이 부드럽게 가공하기 위해 웹 브라우저 자체 하드디스크 공간에 미디어를 미리 임시 보관해두는 로컬 데이터베이스 캐시입니다. 다양한 영상 클립이나 무료 공유 에셋을 타임라인에 자주 올릴수록 캐싱되는 파일 개수와 용량이 늘어나 디스크를 점유할 수 있습니다."
    },
    {
      category: "storage",
      question: "브라우저에 누적된 IndexedDB 캐시 용량을 정리하는 방법은 무엇인가요?",
      answer: "동영상 편집기(비디오 스튜디오)의 좌측 미디어/에셋 메뉴 하단에 있는 빨간색 [IndexedDB 용량 정리] 버튼을 클릭하시면 기기 내 임시 미디어 캐시가 단번에 안전하게 비워집니다. 혹은 사용하시는 브라우저 설정에서 쿠키 및 사이트 임시 보관 데이터를 직접 지우셔도 함께 초기화됩니다."
    },

    // 5. 시스템 및 오류 해결 (troubleshoot)
    {
      category: "troubleshoot",
      question: "비디오 생성 또는 내보내기(렌더링) 도중 브라우저가 강제로 멈추거나 튕겨요.",
      answer: "이 현상은 대개 컴퓨터의 가용 메모리(RAM)가 일시적으로 고갈되어 브라우저 탭이 강제 종료(OOM)되는 현상입니다. 렌더링 시작 전에 사용하지 않는 크롬 탭을 모두 닫아주시고, 가급적 WAV 대신 가벼운 MP3 음원 소스를 사용하여 점유율을 줄인 뒤 다시 시도해 주시기 바랍니다."
    },
    {
      category: "troubleshoot",
      question: "IndexedDB 캐시 용량을 비우면 기존에 제작하던 동영상 프로젝트나 클라우드 업로드 파일도 사라지나요?",
      answer: "아니요, 절대 사라지지 않으니 안심하셔도 됩니다. 캐시 용량 정리는 브라우저 기기 안에만 임시로 풀려있던 연산용 미디어 본체 복사본을 소멸시키는 조치일 뿐입니다. 회원님의 컷 편집 타임라인 정보, 자막 내용, 생성된 마이라이브러리 및 클라우드 업로드 리스트는 크리에이박스 데이터베이스 서버에 영구히 격리 저장되어 있어, 언제든 편집기를 재오픈하면 다시 동기화하여 안전하게 편집을 재개하실 수 있습니다."
    }
  ];

  // 🌟 FAQ 필터링 로직
  const filteredFaqs = faqList.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    return faq.category === selectedCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* 🏢 SECTION 1: HERO HEADER */}
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-10 mb-16 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-400 text-xs font-black tracking-widest uppercase shadow-sm">
            <HelpCircle size={12} className="text-blue-600" /> CreAibox Support Center
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-tight">
            무엇을 도와드릴까요?
          </h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-bold max-w-3xl leading-relaxed">
            자주 접수되는 사용 관련 핵심 질문과 오류 해결책을 카테고리별로 검색해 보세요. <br className="hidden md:inline" />
            도움말로 문제가 해결되지 않는 경우 1:1 접수를 진행하실 수 있습니다.
          </p>
        </div>

        {/* 🔍 SECTION 2: SEARCH CONSOLE */}
        <div className="mb-16">
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="max-w-2xl mx-auto flex items-center gap-2.5 bg-white dark:bg-[#0b0f19]/80 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl shadow-sm transition-all focus-within:border-blue-500"
          >
            <Search size={20} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="궁금한 기능이나 키워드를 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-855 dark:text-white text-xs md:text-sm font-semibold outline-none placeholder-slate-400"
            />
          </form>
        </div>

        {/* 📂 SECTION 3: 카테고리별로 찾아보세요 (바둑판식 플랫 그리드) */}
        <div className="mb-16 space-y-6">
          <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-600" />
            카테고리별로 찾아보세요
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {QUICK_CATEGORIES.map((qCat) => (
              <button
                key={qCat.label}
                onClick={() => {
                  setSelectedCategory(qCat.targetId);
                  setSearchQuery(qCat.keyword);
                  document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="p-4.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-white dark:bg-[#0b0f19]/40 text-center hover:bg-slate-550/5 dark:hover:bg-slate-900/60 hover:border-slate-350 dark:hover:border-slate-700 transition cursor-pointer shadow-sm text-xs md:text-sm font-black text-slate-800 dark:text-slate-300"
              >
                {qCat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🏷️ SECTION 4: CATEGORY TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-200 dark:border-slate-850 pb-8 shrink-0">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-black border transition-all duration-200 outline-none select-none cursor-pointer ${
                  active
                    ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                    : "border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900/30 text-slate-655 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ❓ SECTION 5: FAQ ACCORDION */}
        <div id="faq-section" className="space-y-6 scroll-mt-24">
          <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-blue-505" />
            {CATEGORIES.find(c => c.id === selectedCategory)?.label || "자주 묻는 질문"} 목록
          </h2>
          
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <details 
                  key={faq.question} 
                  className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 open:bg-slate-50/50 dark:open:bg-slate-950/20 open:border-slate-300/80 dark:open:border-slate-750 transition-all shadow-sm"
                >
                  <summary className="list-none flex justify-between items-center font-bold text-xs md:text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none group-open:text-slate-950 dark:group-open:text-white group-hover:text-slate-855 dark:group-hover:text-white">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500 font-black">Q.</span> {faq.question}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-xs md:text-sm text-slate-600 dark:text-slate-455 leading-relaxed font-semibold pl-5 relative">
                    <span className="absolute left-0 top-4 text-emerald-500 font-black">A.</span>
                    {faq.answer.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </details>
              ))
            ) : (
              <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl text-slate-455 dark:text-slate-500 bg-white dark:bg-slate-900/10 text-sm font-medium">
                일치하는 자주 묻는 질문이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 📬 SECTION 5: 카카오스타일 문의/내역 퀵 배너 */}
        <div className="mt-20 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]/80 text-center space-y-4 shadow-sm relative overflow-hidden">
          <h3 className="text-base md:text-lg font-black text-slate-950 dark:text-white">
            도움말을 통해 문제를 해결하지 못하셨나요?
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold max-w-2xl mx-auto">
            1:1 문의 접수 또는 크리에이박스를 위한 기능 개선 및 개발 제안 사항을 등록해 주시면 <br className="hidden md:inline" />
            담당 AI 지원팀이 신속히 확인하여 자세한 답변 및 업데이트 일정을 피드백해 드립니다.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link 
              href="/help/inquiry" 
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs md:text-sm transition-all cursor-pointer shadow-sm flex items-center"
            >
              문의 접수하기 ➔
            </Link>
            <Link 
              href="/help/my-qna" 
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs md:text-sm transition-all cursor-pointer shadow-sm hover:bg-slate-200 dark:hover:bg-slate-850 flex items-center"
            >
              내 문의/답변 확인 ➔
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}