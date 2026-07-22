export interface FAQItem {
  id: string;
  category: string; // Category key matching (general, site-builder, ai-writer, media-studio, analytics, marketing, storage, troubleshoot)
  question: string;
  answer: string;
  link?: string;
  linkLabel?: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: FAQItem[];
}

export const faqData: FAQCategory[] = [
  {
    id: "general",
    title: "회원 및 결제",
    icon: "💳",
    description: "계정 가입, 로그인, 멤버십 플랜 구독 및 Stripe 안전 결제 안내",
    items: [
      {
        id: "gen-1",
        category: "general",
        question: "크리에이박스는 어떤 서비스인가요?",
        answer: "크리에이박스(CreAibox)는 개인 크리에이터와 비즈니스 운영자를 위한 올인원 AI 마케팅 및 콘텐츠 제작 플랫폼입니다. 인공지능 기반의 홈페이지 제작, SEO 최적화 블로그 원고 작성, 이미지/비디오/음악 생성 도구를 하나의 대시보드에서 편리하게 사용하실 수 있습니다.",
        link: "/about",
        linkLabel: "스튜디오 소개 가이드 보기"
      },
      {
        id: "gen-2",
        category: "general",
        question: "회원가입 및 로그인은 어떻게 진행하나요?",
        answer: "우측 상단의 로그인 버튼을 통해 카카오, 네이버, 구글 등 편리한 소셜 로그인 계정으로 3초 만에 간편 가입 및 로그인을 완료하실 수 있습니다.",
        link: "/login",
        linkLabel: "소셜 로그인 바로가기"
      },
      {
        id: "gen-3",
        category: "general",
        question: "요금제 종류와 혜택이 어떻게 되나요?",
        answer: "크리에이박스는 Free, Pro, Creator 요금제를 제공합니다. \n\n* **Free**: 가입 즉시 제공되며, 매월 기본 크레딧 한도 내에서 핵심 AI 빌더 및 글쓰기 도구를 체험해 볼 수 있습니다.\n* **Pro**: 개인 사업자 및 마케터를 위한 플랜으로, 넉넉한 AI 크레딧과 고성능 이미지/비디오 빌더 가용량을 보장합니다.\n* **Creator**: 전문 대행사 및 대규모 브랜드 운영자를 위한 무제한 혹은 최상위 크레딧 팩이 제공됩니다.",
        link: "/pricing",
        linkLabel: "요금제 및 혜택 보기"
      },
      {
        id: "gen-4",
        category: "general",
        question: "구독 결제 수단을 변경하거나 해지하고 싶을 때는 어떻게 하나요?",
        answer: "마이페이지 > 프로필 설정 및 '구독 관리' 메뉴에서 현재 결제 카드를 변경하시거나 언제든지 원클릭으로 구독을 해지하실 수 있습니다. 해지하시더라도 이번 달 결제 주기의 남은 기간 동안은 유료 혜택이 그대로 유지됩니다.",
        link: "/mypage",
        linkLabel: "마이페이지 결제 관리로 이동"
      },
      {
        id: "gen-5",
        category: "general",
        question: "결제 취소 및 환불 정책이 궁금해요.",
        answer: "결제는 글로벌 보안 표준 결제 게이트웨이인 Stripe를 통해 안전하게 진행됩니다. 구독 취소는 [마이페이지 -> 결제 관리]에서 언제든지 자유롭게 처리할 수 있으며, 결제 후 크레딧 사용 이력이 없는 상태에서 7일 이내에 고객지원으로 신청하시면 전액 환불 처리가 가능합니다.",
        link: "/mypage",
        linkLabel: "마이페이지 결제 관리로 이동"
      }
    ]
  },
  {
    id: "site-builder",
    title: "AI 홈페이지 빌더",
    icon: "🌐",
    description: "홈페이지 제작, 섹션 레이아웃 변경, 브랜드 도메인 승인 및 디자인 테마 설정",
    items: [
      {
        id: "site-1",
        category: "site-builder",
        question: "첫 비즈니스 홈페이지는 어떻게 만드나요?",
        answer: "크리에이박스 AI 홈페이지 빌더 마법사를 사용하면 1분 안에 나만의 사이트 뼈대를 만들 수 있습니다. \n\n1. 왼쪽 사이드바에서 [AI 홈페이지 제작 -> AI 홈페이지 빌더] 메뉴를 선택합니다.\n2. 제작하려는 홈페이지의 업종, 선호하는 디자인 무드, 대표 키워드를 입력합니다.\n3. AI가 자동으로 최적화된 컴포넌트 그리드와 문구를 배치하여 사이트를 완성합니다.",
        link: "/studio/client-site-builder/builder",
        linkLabel: "AI 홈페이지 빌더 마법사 실행"
      },
      {
        id: "site-2",
        category: "site-builder",
        question: "생성된 홈페이지의 섹션 레이아웃을 바꾸고 싶어요.",
        answer: "빌더로 만든 사이트의 세부 컴포넌트는 자유롭게 수정이 가능합니다. \n\n[AI 홈페이지 제작 -> 섹션 레이아웃 변경] 탭으로 이동하시면 생성된 그리드 블록들의 위치를 마우스 드래그로 조절하거나, 텍스트와 배경 이미지를 실시간으로 편집하여 브랜드에 맞춤 디자인할 수 있습니다.",
        link: "/studio/client-site-builder/sections",
        linkLabel: "섹션 레이아웃 변경 도구로 이동"
      },
      {
        id: "site-3",
        category: "site-builder",
        question: "브랜드 서브도메인을 직접 신청해서 연결하려면 어떻게 하나요?",
        answer: "나만의 고유 서브도메인(예: `brand.creaibox.com`)을 만들어 연결할 수 있습니다. \n\n[AI 홈페이지 제작 -> 설정 -> 도메인 신청] 메뉴에서 신청 서류 및 원하는 ID를 작성하여 요청하시면, 관리자가 도메인 중복 여부 및 금지어/예약어 필터링을 검토한 후 즉각 승인 처리해 드립니다.",
        link: "/studio/client-site-builder/settings",
        linkLabel: "도메인 설정 및 신청으로 이동"
      }
    ]
  },
  {
    id: "ai-writer",
    title: "AI 글쓰기 & SEO 스튜디오",
    icon: "✍️",
    description: "네이버 API 연동 가이드, SEO 스키마 자동주입, 서치콘솔/GA4 연동 및 문서 작성 요령",
    items: [
      {
        id: "write-1",
        category: "ai-writer",
        question: "AI 글쓰기 도구로 블로그 글은 어떻게 생성하나요?",
        answer: "원하는 글감 주제와 핵심 키워드를 입력하시면 AI가 네이버 및 구글 SEO 로봇이 선호하는 단락 구조와 정보성 텍스트를 자동으로 생성해 줍니다. 썸네일 자동 매칭 기능도 제공하므로 고화질 사진을 함께 배치할 수 있습니다.",
        link: "/studio/writing/creaibox/new-post",
        linkLabel: "새 원고 작성하러 가기"
      },
      {
        id: "write-2",
        category: "ai-writer",
        question: "네이버 블로그 API 연동은 어떻게 하나요?",
        answer: "작성한 원고를 내 네이버 블로그에 마우스 클릭 한 번으로 자동 발행하려면 최초 1회의 API 연동이 필요합니다. \n\n1. [네이버 글쓰기 -> API 설정] 메뉴로 이동합니다.\n2. 네이버 아이디와 블로그 비밀번호, 그리고 네이버 글쓰기 API 고유 Key값을 복사하여 입력합니다.\n3. 연동 검증이 성공하면 이후 작성된 글을 즉시 네이버 블로그의 '임시저장' 또는 '발행' 상태로 다이렉트 전송할 수 있습니다.",
        link: "/studio/writing/naver/api",
        linkLabel: "네이버 API 설정 페이지 바로가기"
      },
      {
        id: "write-3",
        category: "ai-writer",
        question: "블로그 최적화 진단 도구는 무엇인가요?",
        answer: "글을 발행하기 전에 제목과 본문에 키워드가 너무 과도하게 중복되지는 않았는지, 검색 노출에 불리한 유사 문서 유포 위험이 있는지 인공지능이 사전에 검사해 주는 안심 도구입니다. 발행 직전 [최적화 진단 받기]를 활용하여 노출 지수를 최대로 끌어올려 보세요.",
        link: "/studio/writing/naver/diagnosis",
        linkLabel: "네이버 포스트 진단 도구로 이동"
      },
      {
        id: "write-4",
        category: "ai-writer",
        question: "크리에이박스 글쓰기 스튜디오의 '구조화 스키마(Schema)' 기능은 무엇이며 어떻게 작동하나요?",
        answer: "구조화 스키마(JSON-LD)는 구글, 네이버 등 검색 엔진의 크롤링 로봇에게 블로그 글의 성격(일반 기사, 자주 묻는 질문(FAQ), 가이드 등)을 기계용 데이터로 정확하게 알려주는 글로벌 SEO 표준 마크업입니다.\n\n[작동 원리 및 사용법]\n1. 스튜디오 글쓰기 우측 '스키마' 탭에서 AI 엔진과 스키마 유형(추천/Article/FAQPage 등)을 선택한 후 [AI 스키마 자동 생성]을 누릅니다.\n2. 생성된 코드를 확인하고 [본문에 적용하기]를 클릭하면, 원고 본문 맨 하단에 눈에 보이지 않는 HTML 주석(Comment) 래퍼 형태로 자동 주입됩니다.\n3. 저장 후 발행(Publish)하면, 시스템이 이 주석을 실시간으로 감지하고 추출하여 기사 페이지의 HTML <head> 내부에 검색엔진용 스크립트로 안전하게 꽂아 넣습니다.",
        link: "/studio/writing/creaibox/new-post",
        linkLabel: "글쓰기 스튜디오 스키마 탭 바로가기"
      },
      {
        id: "write-5",
        category: "ai-writer",
        question: "내 브랜드 블로그에 구글 애널리틱스(GA4)와 구글 서치콘솔은 어떻게 연동하나요?",
        answer: "크리에이박스는 번거로운 수동 분석 셋팅 작업을 100% 자동화했습니다.\n\n1. 구글 애널리틱스(GA4) 자동 연동: 브랜드 신청 후 관리자가 승인(도메인 연결)하는 즉시, 크리에이박스 백엔드 서버가 Google Analytics Admin API를 직접 호출하여 해당 도메인 전용 분석 프로퍼티를 자동 개설하고 측정 ID(G-XXXXXX)를 주입합니다. 사용자는 별도의 삽입 작업을 하실 필요가 없습니다.\n2. 구글 서치콘솔 연동: 구글 서치콘솔 등록 화면에서 'URL 접두사' 방식을 선택해 도메인 주소(https://도메인)를 입력한 후 'HTML 태그(메타태그)' 인증 방식을 선택하십시오. 발급받은 키값을 [공식 블로그 관리 > SEO 및 연동 관리] 탭의 입력란에 붙여넣고 저장하시면 1초 만에 소유권 인증이 완료됩니다.",
        link: "/studio/writing/creaibox/blog-management",
        linkLabel: "SEO 및 연동 관리 페이지로 이동"
      },
      {
        id: "write-6",
        category: "ai-writer",
        question: "내 블로그의 사이트맵(sitemap.xml)과 RSS 피드(/feed)를 왜 직접 검색엔진에 제출해야 하나요?",
        answer: "구글 서치콘솔과 네이버 서치어드바이저는 보안 및 실소유자 확인을 위해 반드시 본인의 계정으로 사이트맵을 등록받습니다.\n\n[주소 확인 및 제출 방법]\n- 사이트맵 주소: https://[내블로그도메인]/sitemap.xml\n- RSS 피드 주소: https://[내블로그도메인]/feed\n구글 서치콘솔 [Sitemaps] 메뉴 및 네이버 서치어드바이저 [요청] 메뉴에서 위 주소를 복사해서 등록해 주시면 구글/네이버 색인 속도가 수 시간 이내로 대폭 상승합니다.",
        link: "/studio/writing/creaibox/blog-management",
        linkLabel: "사이트맵 및 피드 주소 확인하기"
      }
    ]
  },
  {
    id: "media-studio",
    title: "미디어 & 비디오 스튜디오",
    icon: "🎬",
    description: "비디오 자막/컷편집, 타임라인 조절, 이미지 누끼 제거, Suno 음악 생성 가이드",
    items: [
      {
        id: "media-1",
        category: "media-studio",
        question: "동영상 클립을 자르고, 붙이고, 타임라인에서 위치를 이동하는 방법은 무엇인가요?",
        answer: "비디오 스튜디오 진입 후 원하는 비디오 클립을 타임라인에 드래그하거나 '+' 버튼으로 추가합니다. 타임라인 위에 정렬된 클립을 선택한 뒤 툴바의 '분할(컷)' 버튼을 누르면 정밀하게 자를 수 있으며, 마우스로 클립을 잡고 드래그하면 원하는 위치나 다른 트랙으로 간편하게 이동시킬 수 있습니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 에디터 실행"
      },
      {
        id: "media-2",
        category: "media-studio",
        question: "자막이나 텍스트 요소를 추가하고 글꼴, 색상, 배경 등 스타일을 변경하려면 어떻게 하나요?",
        answer: "왼쪽 메뉴에서 '텍스트/자막' 탭을 선택하고 '텍스트 추가' 또는 '자막 추가'를 누르면 타임라인에 자막 클립이 생성됩니다. 자막 클립을 선택하면 우측에 '속성 편집기(Inspector)'가 노출되며, 이 영역에서 텍스트 문구 입력, 글꼴 크기, 텍스트 색상, 배경색 투명도, 위치 좌표(X, Y) 등을 실시간으로 편집하실 수 있습니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 에디터 실행"
      },
      {
        id: "media-3",
        category: "media-studio",
        question: "동영상의 특정 구간을 배속 조절하거나 역재생(Reverse)으로 변환하는 방법은 무엇인가요?",
        answer: "역재생하고 싶은 영상 클립을 타임라인에서 마우스로 클릭하여 선택한 후, 타임라인 상단 툴바의 '역재생' 버튼을 누르면 인코더가 동작하여 영상을 역방향으로 인코딩하여 타임라인 클립을 즉시 대체해 줍니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 에디터 실행"
      },
      {
        id: "media-4",
        category: "media-studio",
        question: "완성된 프로젝트의 화면 비율(16:9 가로, 9:16 세로 등)을 편집 중간에 변경해도 안전한가요?",
        answer: "네, 안전합니다. 캔버스 툴바 상단의 '가로세로 비율' 버튼을 통해 언제든지 16:9, 9:16, 1:1, 4:5 등 다양한 규격으로 실시간 변경하실 수 있으며, 프리뷰 화면이 자동으로 맞춰집니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 에디터 실행"
      },
      {
        id: "media-5",
        category: "media-studio",
        question: "누끼 따기(이미지 배경 제거) 도구는 어디 있나요?",
        answer: "인물이나 상품 이미지에서 배경을 단 2초 만에 깨끗하게 투명 배경(PNG)으로 날려주는 누끼 제거 도구는 [이미지 스튜디오 -> 배경 제거(Bg Remover)]에 있습니다. 고해상도 다운로드를 지원합니다.",
        link: "/studio/image/bg-remover",
        linkLabel: "AI 배경 제거 도구 실행"
      },
      {
        id: "media-6",
        category: "media-studio",
        question: "Suno AI를 활용하여 음악과 노래 가사는 어떻게 제작하나요?",
        answer: "곡의 분위기와 원하는 주제(예: '스타트업의 아침을 응원하는 시티팝')를 [음악 스튜디오 -> 가사 작사]에 적으시면 풍성한 가사 초안이 생성됩니다. 이 가사를 기반으로 [노래 생성] 버튼을 누르면 멜로디와 보컬이 입혀진 실제 음원 파일이 앨범 형태로 탄생합니다.",
        link: "/studio/music/lyrics",
        linkLabel: "음악 가사 빌더 바로가기"
      }
    ]
  },
  {
    id: "analytics",
    title: "분석 & 트렌드",
    icon: "📈",
    description: "실시간 네이버 키워드 순위 발굴, 유튜브 인기 트렌드 분석 및 PDF 요약 리서치",
    items: [
      {
        id: "anal-1",
        category: "analytics",
        question: "조회수가 잘 나오는 키워드는 어떻게 발굴하나요?",
        answer: "트렌드 분석 스튜디오에서는 매일 네이버와 구글의 실시간 인기 검색어, 검색 강도, 문서 대비 조회수 비율을 데이터화하여 제공합니다. [키워드 트렌드 -> 섹션 분석]에서 타겟 단어를 검색하여 블루오션 키워드를 미리 선점해 보세요.",
        link: "/studio/keyword",
        linkLabel: "키워드 트렌드 스튜디오로 이동"
      },
      {
        id: "anal-2",
        category: "analytics",
        question: "유튜브 트렌드 분석 기능은 어떻게 쓰나요?",
        answer: "내 채널과 동종 카테고리에 있는 인기 채널들의 최근 조회수 추이, 시청 반응이 폭발한 급상승 영상 주제, 인기 해시태그를 대시보드에서 일목요연하게 크롤링 분석하여 보여줍니다. 이를 통해 어떤 주제로 다음 영상을 기획할지 즉각적인 힌트를 얻을 수 있습니다.",
        link: "/studio/youtube/reports",
        linkLabel: "유튜브 성과 분석 보고서 이동"
      },
      {
        id: "anal-3",
        category: "analytics",
        question: "자료 분석 스튜디오(PDF 요약)는 어떤 기능인가요?",
        answer: "해외 마케팅 트렌드 보고서나 수십 장짜리 비즈니스 기획서 PDF 파일을 업로드하면, AI가 단 몇 초 만에 핵심 아젠다와 요약 테이블을 추출해 주는 헬퍼 기능입니다. 번역 및 정보 추출 용도로 업무 시간을 획기적으로 줄여줍니다.",
        link: "/studio/research/chat",
        linkLabel: "리서치 분석 스튜디오로 이동"
      }
    ]
  },
  {
    id: "storage",
    title: "클라우드 저장소 & 시스템 캐시",
    icon: "💾",
    description: "미디어 저장 용량 관리 및 브라우저 IndexedDB 캐시 정리 방법",
    items: [
      {
        id: "stor-1",
        category: "storage",
        question: "업로드한 동영상 소스나 음악 에셋의 용량 제한이 있나요?",
        answer: "무료 등급 회원은 전체 1GB의 미디어 저장 공간을 사용할 수 있으며, 프로 등급 이상은 최대 50GB의 개인 전용 격리형 클라우드 스토리지가 지급됩니다.",
        link: "/mypage",
        linkLabel: "마이페이지 용량 확인"
      },
      {
        id: "stor-2",
        category: "storage",
        question: "IndexedDB 캐시란 무엇이며 왜 디스크 용량이 증가하나요?",
        answer: "IndexedDB는 동영상 스튜디오에서 고용량 비디오 에셋의 실시간 편집, 자막 렌더링, 역재생 변환 등을 끊김 없이 부드럽게 가공하기 위해 웹 브라우저 자체 하드디스크 공간에 미디어를 미리 임시 보관해두는 로컬 데이터베이스 캐시입니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 에디터 캐시 관리 이동"
      },
      {
        id: "stor-3",
        category: "storage",
        question: "브라우저에 누적된 IndexedDB 캐시 용량을 정리하는 방법은 무엇인가요?",
        answer: "동영상 편집기(비디오 스튜디오)의 좌측 미디어/에셋 메뉴 하단에 있는 빨간색 [IndexedDB 용량 정리] 버튼을 클릭하시면 기기 내 임시 미디어 캐시가 단번에 안전하게 비워집니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 에디터 캐시 정리 이동"
      }
    ]
  },
  {
    id: "troubleshoot",
    title: "시스템 및 오류 해결",
    icon: "🛠️",
    description: "브라우저 권장 환경, 렌더링 동기화 및 크레딧 소진 에러 조치 안내",
    items: [
      {
        id: "trbl-1",
        category: "troubleshoot",
        question: "비디오 스튜디오에서 영상 재생이 끊기거나 프리뷰 렌더링이 느릴 때는 어떻게 하나요?",
        answer: "고화질 멀티트랙 영상 편집 시 크롬(Chrome) 또는 엣지(Edge) 브라우저 사용을 권장합니다. 브라우저 설정에서 '가능한 경우 하드웨어 가속 사용'을 켜 두시면 렌더링 속도가 향상됩니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 스튜디오 이동"
      },
      {
        id: "trbl-2",
        category: "troubleshoot",
        question: "AI 이미지/음악 생성 중 '크레딧 부족'이나 '요청 제한' 에러가 발생합니다.",
        answer: "월간 크레딧이 소진된 경우 마이페이지 또는 요금제 페이지에서 플랜 업그레이드 또는 크레딧 충전을 통해 즉시 이용 한도를 해제하실 수 있습니다.",
        link: "/pricing",
        linkLabel: "요금제 및 크레딧 충전 이동"
      }
    ]
  }
];

