"use client";

import React, { useState } from 'react';
import { 
  Search, MessageSquare, Mail, FileText, 
  ChevronDown, HelpCircle, ArrowRight, Database
} from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// 🌟 FAQ 카테고리 정의
const CATEGORIES = [
  { id: "all", label: "전체 FAQ" },
  { id: "service", label: "서비스 시작 & 계정" },
  { id: "video", label: "비디오 스튜디오" },
  { id: "ai", label: "AI 생성 스튜디오" },
  { id: "storage", label: "클라우드 저장소" },
  { id: "troubleshoot", label: "시스템 및 오류 해결" },
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
      question: "비디오 렌더링(내보내기) 중에 다른 메뉴(예: 글쓰기)를 사용하면 렌더링이 멈추나요? 멀티태스킹은 어떻게 하나요?",
      answer: "네, 같은 브라우저 탭 내에서 다른 메뉴로 이동하면 Next.js SPA 특성상 기존 비디오 에디터 컴포넌트가 언마운트(소멸)되어 렌더링 작업이 중단됩니다. 이를 예방하고 멀티태스킹을 하려면, 내보내기를 시작한 후 이동하고 싶은 메뉴(예: '글쓰기 스튜디오')를 마우스 우클릭하여 '새 탭으로 열기'(또는 Command + 클릭)로 열어 작업하시면 됩니다. 크리에이박스의 렌더링 루프는 백그라운드 스로틀링 해제 기술(MessageChannel)이 내장되어 있어, 탭을 전환하거나 다른 화면으로 가더라도 백그라운드에서 최고 속도로 무결하게 렌더링을 끝마치고 완료 팝업을 띄워줍니다."
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
      question: "요금제별로 제공되는 일일 생성 한도(크레딧)는 어떻게 차감되고 갱신되나요?",
      answer: "AI 이미지 1회 생성, AI 오디오 1곡 생성 등 작업마다 고유한 크레딧이 차감됩니다. 구독 요금제 등급에 따라 매월 또는 매일 정해진 크레딧이 갱신되어 제공되며, 마이페이지의 계정 정보 탭에서 잔여 크레딧 현황을 실시간으로 확인하실 수 있습니다."
    },
    {
      category: "ai",
      question: "내가 생성한 에셋 결과물은 어디서 확인하고 컴퓨터로 다운로드받나요?",
      answer: "각 이미지/뮤직 스튜디오의 '내 생성 기록' 패널 또는 크리에이박스 '개인 라이브러리(Library)' 메뉴로 진입하시면 지금까지 생성한 모든 소스 목록이 영구히 보존되어 있습니다. 각 자산의 상세 카드에서 즉각 컴퓨터 로컬 드라이브로 고화질 파일 다운로드가 가능합니다."
    },

    // 4. 클라우드 저장소 및 라이브러리 연동 (storage)
    {
      category: "storage",
      question: "클라우드 저장소와 내 미디어 목록은 어떻게 안전하게 연동 및 보존되나요?",
      answer: "크리에이박스는 구글 워크스페이스 등과의 연동을 통해 각 사용자만을 위한 '클라이언트 격리 저장소' 인프라를 서빙합니다. 업로드하신 원본 파일은 제3자에게 유출되지 않도록 엄격한 토큰 보안 통신망 및 독립된 클라우드 폴더 트리를 경유하므로 유출 우려 없이 완벽히 격리 보존됩니다."
    },
    {
      category: "storage",
      question: "외부 라이브러리 주소로 가져온 자산이 에디터에서 엑박(이미지 깨짐)으로 보일 때는 어떻게 하나요?",
      answer: "브라우저의 보안 통신 CORP 및 CORS 차단 정책으로 인해 발생하는 현상입니다. 크리에이박스는 이를 예방하기 위해 구글 드라이브나 CDN 자산을 파악하여 자동으로 초고속 'Next.js 캐싱 프록시 서버' 주소로 가공하여 서빙해 줍니다. 만약 일반 개인 외부 링크를 직접 삽입하여 엑박이 발생할 경우, 해당 미디어를 클라우드에 직접 업로드하여 사용하시는 것을 권장합니다."
    },
    {
      category: "storage",
      question: "내가 업로드하거나 보관 중인 개인 영상/이미지 파일의 보안 및 개인정보는 어떻게 보호되나요?",
      answer: "크리에이박스는 개인정보 처리방침에 근거하여 유저가 업로드한 개인 미디어를 AI 학습용 데이터로 절대 무단 수집하거나 이용하지 않습니다. 업로드된 모든 파일 데이터는 고도의 보안 암호화 프로토콜(SSL/TLS)로 암호화 전송되며 백업 및 저장 시에도 최고 수준의 클라우드 암호화 보안 표준을 엄격히 준수합니다."
    },

    // 5. 시스템 최적화 및 문제 해결 (troubleshoot)
    {
      category: "troubleshoot",
      question: "크리에이박스를 쓰다 보니 갑자기 컴퓨터 하드디스크(C드라이브 등) 용량이 꽉 찼습니다. 어떻게 해결해야 하나요?",
      answer: "비디오 에디터는 끊김 없는 편집 성능과 속도를 보장하기 위해 브라우저 격리 저장소(IndexedDB)에 미디어 파일을 임시 캐싱해 둡니다. 이 과정에서 보이지 않는 디스크 용량이 크게 누적될 수 있습니다. 이를 해결하려면 비디오 에디터 왼쪽 사이드바 미디어 탭 가장 하단에 있는 'IndexedDB 용량 정리' 버튼을 클릭해 주시면 즉시 수십 GB의 디스크 공간을 완벽하게 회수할 수 있습니다. 현재 타임라인 영상에 영향을 주지 않는 '스마트 정리(추천)'와 완전히 디스크를 비우는 '전체 비우기' 중 상황에 맞게 선택하시면 됩니다."
    },
    {
      category: "troubleshoot",
      question: "작업하던 타임라인의 영상 클립들에 '재연결이 필요합니다'라는 경고나 빈 화면이 표시됩니다. 파일이 지워진 것인가요?",
      answer: "아닙니다. 브라우저 보안 정책상 페이지를 새로고침하거나 일정 시간이 흐르면 로컬 원본 파일에 대한 일시적인 접근 링크(Object URL) 권한이 안전을 위해 자동 만료됩니다. 미디어 목록 혹은 해당 클립의 우클릭 메뉴에서 '미디어 파일 재연결'을 누르신 뒤 PC 내에 보관 중인 원래의 원본 파일만 다시 클릭해 지정해 주시면, 자르고 편집해 둔 모든 상태 그대로 100% 즉시 복구됩니다."
    },
    {
      category: "troubleshoot",
      question: "고화질 가로 영상을 역재생하거나 내보내기(Export)할 때 렌더링 에러가 발생하거나 브라우저가 멈춥니다. 어떻게 조치하나요?",
      answer: "브라우저 기반 FFmpeg WASM 엔진의 메모리(RAM) 한계(1.5GB ~ 2GB)를 초과하여 발생하는 물리적 현상입니다. 크리에이박스는 이를 감지하면 자동으로 해상도를 720p 등으로 한 단계 스케일 다운하여 작업을 완수하는 지능형 자동 복구 엔진이 탑재되어 있습니다. 만약 무음 변환 등에도 에러가 지속된다면 시스템 메모리 확보를 위해 사용 중이지 않은 크롬 브라우저의 다른 탭들을 닫고 진행하시는 것을 권장합니다."
    },
    {
      category: "troubleshoot",
      question: "구글 애드센스(Google AdSense) 연동 및 ads.txt 설정은 어떻게 하나요?",
      answer: "개인 브랜드 블로그에 구글 애드센스 광고를 연동하려면, 먼저 구글 애드센스 대시보드에서 본인의 도메인을 사이트로 추가하고 고유 게시자 ID(예: pub-XXXXXXXXXXXXXXXX)를 복사합니다. 그 후 스튜디오 블로그 관리 화면의 'SEO 및 애널리틱스 연동' 탭에서 복사한 게시자 ID를 입력하고 저장해 주시면 됩니다. 입력이 완료되면 구글 크롤러 검증을 위한 ads.txt 파일이 사용자의 연결 도메인 루트 경로(예: domain.com/ads.txt)에 자동으로 생성 및 동적 서비스되어 광고 권한이 활성화됩니다."
    },
    {
      category: "troubleshoot",
      question: "기존 기본 주소(예: apple.creaibox.com)로 애드센스 승인을 받았는데, 새로운 독립 도메인(예: apple10.com)을 연결하면 애드센스 승인을 다시 받아야 하나요?",
      answer: "네, 구글 애드센스 정책상 새로운 독립 도메인을 연결하면 신규 검토(재승인)를 받으셔야 합니다. 애드센스는 '루트 도메인' 단위로 개별 심사하기 때문입니다. 애드센스 대시보드에서 [사이트 추가]를 통해 새 도메인을 등록해 주세요. 이 과정에서 크리에이박스의 미들웨어가 기존 주소 트래픽을 새 독립 도메인으로 자동 리다이렉트해 주고, ads.txt 파일 또한 새 독립 도메인 경로 상에 자동으로 실시간 가공 서빙해주므로 번거로운 설정 없이 즉시 빠른 소유권 인증 및 패스를 받으실 수 있습니다."
    }
  ];

  // 🌟 카테고리 필터 및 검색 필터링 로직
  const filteredFaqs = faqList.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pt-20 overflow-hidden relative">
      <Header />
      
      {/* 🌌 배경 은은한 오버레이 그라데이션 */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* 🔍 SECTION 1: HERO & SEARCH (상단 타이틀 및 통합 검색바) */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-650 text-xs font-bold tracking-widest uppercase">
            <HelpCircle size={12} /> Help Center
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">
            무엇을 도와드릴까요?
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
            크리에이박스 이용 중 궁금한 점이 있으시다면 검색창이나 카테고리별 FAQ를 확인해 보세요.
          </p>
          
          {/* 대형 검색창 */}
          <div className="max-w-xl mx-auto relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="궁금한 키워드를 입력해 보세요 (예: 용량, 재연결, 저작권)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 📱 SECTION 2: DIRECT CHANNELS (카카오톡 및 이메일 다이렉트 창구) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          
          {/* 카카오톡 채널 연동 카드 */}
          <a 
            href="https://pf.kakao.com/_RxdxmsX/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/50 hover:border-slate-300 transition-all flex items-start gap-4 group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-650 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare size={22} fill="currentColor" className="stroke-none" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1">
                카카오톡 1:1 상담 <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                가장 빠르게 답변을 받는 방법! <br />
                카카오톡 플러스친구로 평일 실시간 1:1 채팅 상담을 지원합니다.
              </p>
            </div>
          </a>

          {/* 구글 워스페이스 대표메일 연동 카드 */}
          <a 
            href="mailto:contact@creaibox.com"
            className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/50 hover:border-slate-300 transition-all flex items-start gap-4 group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail size={20} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1">
                이메일 문의하기 <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                제휴 및 대량 구매, 계정 오류 등 <br />
                서류 첨부가 필요한 복잡한 문의는 대표 메일로 접수해 주세요.
              </p>
            </div>
          </a>

        </div>

        {/* 🏷️ SECTION 3: CATEGORY TABS (카테고리 선택 탭 필터) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-200 pb-8 shrink-0">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-black border transition-all duration-200 outline-none select-none ${
                  active
                    ? "bg-blue-500/10 border-blue-500 text-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.1)] font-black"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ❓ SECTION 4: FAQ ACCORDION (자주 묻는 질문 아코디언) */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-500" />
            {CATEGORIES.find(c => c.id === selectedCategory)?.label || "자주 묻는 질문"} 목록
          </h2>
          
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <details 
                  key={faq.question} // 🌟 고유 키로 설정하여 카테고리 전환 시 아코디언 열림 상태가 초기화되도록 유도
                  className="group p-5 rounded-xl border border-slate-200 bg-white open:bg-slate-50/50 open:border-slate-300/80 transition-all shadow-sm"
                >
                  <summary className="list-none flex justify-between items-center font-bold text-sm md:text-base text-slate-700 cursor-pointer select-none group-open:text-slate-950 group-hover:text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500 font-black">Q.</span> {faq.question}
                    </span>
                    <ChevronDown size={16} className="text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed font-medium pl-5 relative">
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
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl text-slate-500 bg-white text-sm font-medium">
                선택한 카테고리 및 검색어와 일치하는 자주 묻는 질문이 없습니다.
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}