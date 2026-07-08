export interface FAQItem {
  id: string;
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
        question: "크리에이박스는 어떤 서비스인가요?",
        answer: "크리에이박스(CreAibox)는 개인 크리에이터와 비즈니스 운영자를 위한 올인원 AI 마케팅 및 콘텐츠 제작 플랫폼입니다. 인공지능 기반의 홈페이지 제작, SEO 최적화 블로그 원고 작성, 이미지/비디오/음악 생성 도구를 하나의 대시보드에서 편리하게 사용하실 수 있습니다.",
        link: "/about",
        linkLabel: "스튜디오 가이드 보기"
      },
      {
        id: "gen-2",
        question: "요금제 종류와 혜택이 어떻게 되나요?",
        answer: "크리에이박스는 Free, Pro, Creator 요금제를 제공합니다. \n\n* **Free**: 가입 즉시 제공되며, 매월 기본 크레딧 한도 내에서 핵심 AI 빌더 및 글쓰기 도구를 체험해 볼 수 있습니다.\n* **Pro**: 개인 사업자 및 마케터를 위한 플랜으로, 넉넉한 AI 크레딧과 고성능 이미지/비디오 빌더 가용량을 보장합니다.\n* **Creator**: 전문 대행사 및 대규모 브랜드 운영자를 위한 무제한 혹은 최상위 크레딧 팩이 제공됩니다.",
        link: "/pricing",
        linkLabel: "요금제 상세 정보 보기"
      },
      {
        id: "gen-3",
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
        question: "첫 비즈니스 홈페이지는 어떻게 만드나요?",
        answer: "크리에이박스 AI 홈페이지 빌더 마법사를 사용하면 1분 안에 나만의 사이트 뼈대를 만들 수 있습니다. \n\n1. 왼쪽 사이드바에서 [AI 홈페이지 제작 -> AI 홈페이지 빌더] 메뉴를 선택합니다.\n2. 제작하려는 홈페이지의 업종, 선호하는 디자인 무드, 대표 키워드를 입력합니다.\n3. AI가 자동으로 최적화된 컴포넌트 그리드와 문구를 배치하여 사이트를 완성합니다.",
        link: "/studio/client-site-builder/builder",
        linkLabel: "AI 홈페이지 빌더 마법사 실행"
      },
      {
        id: "site-2",
        question: "생성된 홈페이지의 섹션 레이아웃을 바꾸고 싶어요.",
        answer: "빌더로 만든 사이트의 세부 컴포넌트는 자유롭게 수정이 가능합니다. \n\n[AI 홈페이지 제작 -> 섹션 레이아웃 변경] 탭으로 이동하시면 생성된 그리드 블록들의 위치를 마우스 드래그로 조절하거나, 텍스트와 배경 이미지를 실시간으로 편집하여 브랜드에 맞춤 디자인할 수 있습니다.",
        link: "/studio/client-site-builder/sections",
        linkLabel: "섹션 레이아웃 변경 도구로 이동"
      },
      {
        id: "site-3",
        question: "브랜드 서브도메인을 직접 신청해서 연결하려면 어떻게 하나요?",
        answer: "나만의 고유 서브도메인(예: `brand.creaibox.com`)을 만들어 연결할 수 있습니다. \n\n[AI 홈페이지 제작 -> 설정 -> 도메인 신청] 메뉴에서 신청 서류 및 원하는 ID를 작성하여 요청하시면, 관리자가 도메인 중복 여부 및 금지어/예약어 필터링을 검토한 후 즉각 승인 처리해 드립니다.",
        link: "/studio/client-site-builder/settings",
        linkLabel: "도메인 설정 및 신청으로 이동"
      }
    ]
  },
  {
    id: "ai-writer",
    title: "AI 글쓰기 스튜디오",
    icon: "✍️",
    description: "네이버 API 연동 가이드, 네이버 블로그 최적화 노하우 및 문서 작성 요령",
    items: [
      {
        id: "write-1",
        question: "AI 글쓰기 도구로 블로그 글은 어떻게 생성하나요?",
        answer: "원하는 글감 주제와 핵심 키워드를 입력하시면 AI가 네이버 및 구글 SEO 로봇이 선호하는 단락 구조와 정보성 텍스트를 자동으로 생성해 줍니다. 썸네일 자동 매칭 기능도 제공하므로 고화질 사진을 함께 배치할 수 있습니다.",
        link: "/studio/writing/creaibox/new-post",
        linkLabel: "새 원고 작성하러 가기"
      },
      {
        id: "write-2",
        question: "네이버 블로그 API 연동은 어떻게 하나요?",
        answer: "작성한 원고를 내 네이버 블로그에 마우스 클릭 한 번으로 자동 발행하려면 최초 1회의 API 연동이 필요합니다. \n\n1. [네이버 글쓰기 -> API 설정] 메뉴로 이동합니다.\n2. 네이버 아이디와 블로그 비밀번호, 그리고 네이버 글쓰기 API 고유 Key값을 복사하여 입력합니다.\n3. 연동 검증이 성공하면 이후 작성된 글을 즉시 네이버 블로그의 '임시저장' 또는 '발행' 상태로 다이렉트 전송할 수 있습니다.",
        link: "/studio/writing/naver/api",
        linkLabel: "네이버 API 설정 페이지 바로가기"
      },
      {
        id: "write-3",
        question: "블로그 최적화 진단 도구는 무엇인가요?",
        answer: "글을 발행하기 전에 제목과 본문에 키워드가 너무 과도하게 중복되지는 않았는지, 검색 노출에 불리한 유사 문서 유포 위험이 있는지 인공지능이 사전에 검사해 주는 안심 도구입니다. 발행 직전 [최적화 진단 받기]를 활용하여 노출 지수를 최대로 끌어올려 보세요.",
        link: "/studio/writing/naver/diagnosis",
        linkLabel: "네이버 포스트 진단 도구로 이동"
      }
    ]
  },
  {
    id: "media-studio",
    title: "미디어 크리에이티브",
    icon: "🎬",
    description: "이미지 편집(배경 제거/크기 조절), 비디오 제작, Suno 음악 및 가사 빌더 가이드",
    items: [
      {
        id: "media-1",
        question: "누끼 따기(이미지 배경 제거) 도구는 어디 있나요?",
        answer: "인물이나 상품 이미지에서 배경을 단 2초 만에 깨끗하게 투명 배경(PNG)으로 날려주는 누끼 제거 도구는 [이미지 스튜디오 -> 배경 제거(Bg Remover)]에 있습니다. 고해상도 아웃풋 다운로드를 완벽 지원합니다.",
        link: "/studio/image/bg-remover",
        linkLabel: "AI 배경 제거 도구 실행"
      },
      {
        id: "media-2",
        question: "AI 비디오 편집기로 유튜브 쇼츠 대본과 영상을 만들려면 어떻게 하나요?",
        answer: "영상으로 변환하고 싶은 텍스트 스크립트나 주제를 [비디오 스튜디오 -> 에디터]에 입력합니다. AI가 문장을 음성으로 변환(TTS)하고 어울리는 스톡 영상 클립과 멋진 자막을 자동 싱크하여 렌더링된 쇼츠 완성본을 만들어 냅니다.",
        link: "/studio/video/editor",
        linkLabel: "비디오 에디터 실행"
      },
      {
        id: "media-3",
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
        question: "조회수가 잘 나오는 키워드는 어떻게 발굴하나요?",
        answer: "트렌드 분석 스튜디오에서는 매일 네이버와 구글의 실시간 인기 검색어, 검색 강도, 문서 대비 조회수 비율을 데이터화하여 제공합니다. [키워드 트렌드 -> 섹션 분석]에서 타겟 단어를 검색하여 블루오션 키워드를 미리 선점해 보세요.",
        link: "/studio/keyword",
        linkLabel: "키워드 트렌드 스튜디오로 이동"
      },
      {
        id: "anal-2",
        question: "유튜브 트렌드 분석 기능은 어떻게 쓰나요?",
        answer: "내 채널과 동종 카테고리에 있는 인기 채널들의 최근 조회수 추이, 시청 반응이 폭발한 급상승 영상 주제, 인기 해시태그를 대시보드에서 일목요연하게 크롤링 분석하여 보여줍니다. 이를 통해 어떤 주제로 다음 영상을 기획할지 즉각적인 힌트를 얻을 수 있습니다.",
        link: "/studio/youtube/reports",
        linkLabel: "유튜브 성과 분석 보고서 이동"
      },
      {
        id: "anal-3",
        question: "자료 분석 스튜디오(PDF 요약)는 어떤 기능인가요?",
        answer: "해외 마케팅 트렌드 보고서나 수십 장짜리 비즈니스 기획서 PDF 파일을 업로드하면, AI가 단 몇 초 만에 핵심 아젠다와 요약 테이블을 추출해 주는 헬퍼 기능입니다. 번역 및 정보 추출 용도로 업무 시간을 획기적으로 줄여줍니다.",
        link: "/studio/research/chat",
        linkLabel: "리서치 분석 스튜디오로 이동"
      }
    ]
  },
  {
    id: "marketing",
    title: "온라인 마케팅 컨설팅",
    icon: "🚀",
    description: "초기 비즈니스 트래픽 유입 확보 전략 및 크리에이터 홍보 팁",
    items: [
      {
        id: "market-1",
        question: "신규 개설한 홈페이지에 어떻게 방문자를 모을 수 있나요?",
        answer: "초기 트래픽 확보를 위해 3가지 우선 실천 팁을 제안합니다. \n\n1. **네이버/구글 서치콘솔 색인 등록**: 크리에이박스 [SEO 관리] 메뉴에서 사이트맵을 연동하여 검색 노출 확률을 높입니다.\n2. **AI 블로그 콘텐츠 연동**: 내 홈페이지 업종과 관련된 꿀팁 정보글을 [AI 글쓰기]로 작성해 꾸준히 연재합니다.\n3. **SNS 숏폼 마케팅**: [비디오 스튜디오]로 제작한 15초짜리 홍보 쇼츠/릴스를 업로드하여 링크 유입을 유도합니다.",
        link: "/studio/content-planner/trends",
        linkLabel: "콘텐츠 플래너 트렌드 분석 이동"
      },
      {
        id: "market-2",
        question: "검색엔진 최적화(SEO)를 극대화하는 규칙은 무엇인가요?",
        answer: "포털 로봇이 좋아하는 글은 '전문성'과 '가독성'을 고루 갖춘 글입니다. 제목에는 타겟 키워드를 1회만 자연스럽게 넣고, 본문 상단 200자 이내에 키워드를 녹여내며, 소제목(h2, h3) 구조로 문단을 쪼개어 정갈하게 편집하는 것이 유리합니다. 크리에이박스 AI 편집기를 활용하시면 이 구조가 자동으로 보정됩니다.",
        link: "/studio/client-site-builder/themes",
        linkLabel: "디자인 테마 및 레이아웃 설정 이동"
      }
    ]
  }
];
