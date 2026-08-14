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
        answer: "크리에이박스(CreaiBox)는 개인 크리에이터와 비즈니스 운영자를 위한 올인원 AI 마케팅 및 콘텐츠 제작 플랫폼입니다. 인공지능 기반의 홈페이지 제작, SEO 최적화 블로그 원고 작성, 이미지/비디오/음악 생성 도구를 하나의 대시보드에서 편리하게 사용하실 수 있습니다.",
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
        question: "크리에이박스에서 쓴 글은 구글/네이버/Bing 검색에 얼마나 빠르게 노출되나요?",
        answer: "크리에이박스는 **4대 글로벌 검색엔진 실시간 핑(Google Indexing API + IndexNow)** 시스템이 100% 무설정 자동 탑재되어 있습니다.\n\n* **구글 (Google)**: Google Indexing API를 통해 0.1초 만에 Googlebot으로 직접 전송\n* **네이버 / Bing / Yandex**: IndexNow 오픈 프로토콜을 통해 실시간 수집 핑 전송\n\n* **본사 메인 블로그** (`creaibox.com/blog/...`)\n* **유저 서브도메인 블로그** (`myblog.creaibox.com/...`)\n* **비즈니스 / 커스텀 웹사이트** (`biz.creaibox.com/...`)\n* **개인 연결 독자 커스텀 도메인** (`mycompany.com/...`)\n\n위 4가지 어떤 도메인 유형이든 발행 즉시 검색 로봇으로 핑을 발송하여 최단 시간 실시간 색인(Indexing) 처리가 완료됩니다.",
        link: "/help",
        linkLabel: "SEO 가이드 및 매뉴얼 확인"
      },
      {
        id: "write-5",
        category: "ai-writer",
        question: "크리에이박스의 24시간 무인 자동 수집(Cron) 시스템은 어떻게 작동하나요?",
        answer: "사용자가 사이트에 접속해 있지 않아도 Vercel Cron 및 Supabase 백그라운드 로봇이 24시간 365일 무인 작동합니다.\n\n1. **전세계 60개국 유튜브 트렌드 수집**: 매일 아침 06:00 (KST)에 60+개국 13개 카테고리 급상승 트렌드를 무인 수집하여 DB에 적재합니다.\n2. **실시간 검색어 24시간 아카이빙**: 매시간 정각(00~23시) 네이버 TOP 20 & 구글 TOP 20 검색어를 자동 수집하여 24시간 타임머신 이력으로 저장합니다.\n3. **SEO 자동 색인 핑**: 글이 생성되는 즉시 4대 검색엔진(Google, Bing, Yandex, Naver)으로 0.1초 핑을 쏩니다.",
        link: "/help",
        linkLabel: "도움말 센터 매뉴얼 보기"
      },
      {
        id: "write-6",
        category: "ai-writer",
        question: "글을 수정하거나 재발행할 때도 구글/Bing에 실시간 핑이 전송되나요?",
        answer: "네, 글 수정 및 재발행 시에도 Googlebot 및 Bing/Yandex/Naver IndexNow 핑이 자동 전송됩니다.\n\n특히 무분별한 핑 남발 및 쿼터 낭비를 방지하기 위해 **1시간 스마트 쿨다운(Cooldown) 및 Trailing Edge Ping 알고리즘**이 적용되어 있어, 짧은 시간 내 연속 수정 시에도 1시간 후 최종 완성본 원고가 100% 수집 반영되도록 보장합니다.",
        link: "/studio/writing/creaibox/blog-management",
        linkLabel: "블로그 설정 및 관리 이동"
      },
      {
        id: "write-7",
        category: "ai-writer",
        question: "네이버 서치어드바이저(웹마스터 도구) 사이트 소유권 확인 및 등록 방법이 궁금해요.",
        answer: "네이버 검색 결과에 내 블로그/홈페이지를 노출하고 수집 현황 및 클릭수를 직접 확인하시려면 네이버 서치어드바이저 소유권 확인이 필요합니다.\n\n[네이버 소유권 확인 4단계 가이드]\n1. 네이버 서치어드바이저(searchadvisor.naver.com)에 로그인 후 [웹마스터 도구]로 이동하여 내 블로그 주소(https://내브랜드.creaibox.com)를 입력합니다.\n2. 사이트 소유확인 방법 중 'HTML 태그'를 선택하고 제공되는 메타태그(예: <meta name=\"naver-site-verification\" content=\"...\" />)를 복사합니다.\n3. 크리에이박스 스튜디오 [크리에이박스 블로그 -> 블로그 설정 및 관리 -> SEO 및 연동 관리] 탭으로 이동합니다.\n4. '네이버 서치어드바이저 메타태그' 입력란에 복사한 코드를 붙여넣고 저장합니다.\n5. 네이버 서치어드바이저 화면으로 돌아와 [소유확인] 버튼을 누르면 즉시 인정됩니다.\n6. 소유확인 완료 후 [요청 -> 사이트맵 제출] 메뉴에서 sitemap.xml 을 제출하고, [요청 -> RSS 제출] 메뉴에서 전체 피드 주소(https://내브랜드.creaibox.com/feed)를 등록해 주시면 네이버 검색 로봇 수집이 대폭 빨라집니다.",
        link: "/studio/writing/creaibox/blog-management",
        linkLabel: "SEO 및 연동 관리 페이지로 이동"
      },
      {
        id: "write-8",
        category: "ai-writer",
        question: "구글 서치콘솔(Google Search Console) 사이트 소유권 확인 및 등록 가이드",
        answer: "구글 검색 노출 키워드와 포스팅별 클릭수/조회수 분석을 위해 본인의 구글 계정으로 서치콘솔 소유권을 인증하실 수 있습니다.\n\n[구글 서치콘솔 등록 4단계 가이드]\n1. 구글 서치콘솔(search.google.com/search-console) 접속 후 로그인합니다.\n2. 속성 유형 선택 화면에서 'URL 접두사' 방식을 선택하고 내 블로그 주소(https://내브랜드.creaibox.com)를 입력합니다.\n3. 소유권 확인 방법으로 'HTML 태그' 방식을 선택하고 제공되는 메타태그(예: <meta name=\"google-site-verification\" content=\"...\" />)를 복사합니다.\n4. 크리에이박스 스튜디오 [크리에이박스 블로그 -> 블로그 설정 및 관리 -> SEO 및 연동 관리] 탭의 '구글 서치콘솔 메타태그' 입력란에 붙여넣고 저장합니다.\n5. 구글 서치콘솔 화면에서 [확인] 버튼을 클릭하면 소유권 검증이 즉시 완료됩니다.\n6. 인증 완료 후 서치콘솔 [Sitemaps] 메뉴에서 sitemap.xml 과 feed (RSS 피드 주소)를 각각 입력하여 제출해 주시면 구글 크롤링 로봇이 신규 포스팅을 실시간 감지합니다.",
        link: "/studio/writing/creaibox/blog-management",
        linkLabel: "SEO 및 연동 관리 페이지로 이동"
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
        id: "anal-4",
        category: "analytics",
        question: "유튜브 '👑 인기 영상 조회수 랭킹'과 '🔥 급상승 영상 트렌드'의 차이점은 무엇인가요?",
        answer: "두 메뉴는 분석 목적과 알고리즘이 명확히 다릅니다.\n\n1. 🔥 **급상승 영상 트렌드 (Trending)**: 유튜브 알고리즘이 선정한 실시간 이슈/급상승 랭킹입니다. 조회수가 10만 뷰라도 방금 업로드되어 시청 유입 속도가 폭발적인 영상을 분석할 때 유용합니다.\n2. 👑 **인기 영상 조회수 랭킹 (Most-Viewed)**: 실제 누적 조회수(Total View Count) 최상위 랭킹입니다. 수백만~수억 뷰 이상의 압도적 조회수를 기록한 장르별 1위~50위 통산 대박 영상과 스테디셀러를 벤치마킹할 때 활용합니다.",
        link: "/youtube-trend/popular",
        linkLabel: "인기 영상 조회수 랭킹 바로가기"
      },
      {
        id: "anal-5",
        category: "analytics",
        question: "유튜브 인기 랭킹에서 과거 날짜 조회가 가능한 원리가 무엇인가요? (유튜브 API 제한사항)",
        answer: "YouTube Data API v3 공식 스펙상 과거 특정 날짜 시점의 조회수를 소급 조회하는 파라미터는 존재하지 않습니다.\n\n따라서 크리에이박스는 **매일매일 그날 당시에 수집된 랭킹 데이터를 CreAiBox 클라우드 DB(youtube_popular_archive)에 100% 실전 스냅샷으로 영구 보존**합니다.\n\n달력에서 과거 날짜를 선택하시면 해당 당일에 CreAiBox DB 보관함에 축적된 100% 진짜 과거 스냅샷이 즉시 로딩되며, DB 구축 이전이나 미수집 날짜의 경우 가짜 데이터를 임의로 합성하지 않고 솔직하게 안내합니다.",
        link: "/youtube-trend/popular",
        linkLabel: "과거 랭킹 히스토리 보관함 보기"
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

