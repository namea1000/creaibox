import { TemplateConfig } from "../registry";

export const EDUCATION_TEMPLATES: Record<string, TemplateConfig> = {
  // Existing template
  academy_navy: {
    templateId: "academy_navy",
    name: "스마트 아카데미",
    category: "Education",
    description: "신뢰감과 지적인 세련미를 제공하는 수학·과학 학원 전용 템플릿",
    image: "/templates/academy_navy.png",
    theme: {
      fontFamily: "Outfit, Noto Sans KR, sans-serif",
      colors: {
        primary: "#1e3a8a",     // Navy
        secondary: "#0369a1",   // Sky Blue
        accent: "#3b82f6",      // Blue
        background: "#ffffff",  // White
        surface: "#f0f9ff",     // Light Sky
        text: "#0f172a"         // Slate 900
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "생각의 힘을 기르고 성과로 증명합니다",
        subtitle: "초등 영재부터 대입 수능까지, 수준 높은 수학·과학 밀착 관리 프로그램",
        content_data: {
          backgroundImage: "",
          ctaText: "교육 과정 안내",
          ctaLink: "#services",
          features: [
            { text: "단계별 철저한 피드백" },
            { text: "소수 정예 맞춤형 수업" },
            { text: "최신 입시 분석 리포트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "집중 교육 프로그램",
        subtitle: "과목별 기초 다지기부터 최고난도 입시 준비까지 아우르는 과정",
        content_data: {
          items: [
            {
              title: "초/중등 영재 수학",
              description: "서술형 문장제 완벽 분석 및 창의적 문제해결력 극대화",
              icon: "BookOpen"
            },
            {
              title: "내신 만점 집중반",
              description: "학교별 출제 경향 완벽 대입 및 핵심 개념 반복 클리닉",
              icon: "Award"
            },
            {
              title: "고등 수능/입시 과학",
              description: "물화생지 전과목 수능 1등급 달성을 위한 명품 강사진 클래스",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "명예의 전당 (합격 실적)",
        subtitle: "꾸준한 노력과 명품 지도가 일궈낸 빛나는 결실들입니다.",
        content_data: {
          items: [
            {
              title: "서울대 컴퓨터공학과 합격",
              description: "김*우 (고등학교 3학년)",
              image: ""
            },
            {
              title: "경기과학고등학교 합격",
              description: "이*민 (중학교 3학년)",
              image: ""
            },
            {
              title: "카이스트 무학과 최종 합격",
              description: "박*아 (고등학교 3학년)",
              image: ""
            }
          ]
        }
      },
      {
        section_type: "contact",
        title: "입학 상담 및 예약",
        subtitle: "소중한 자녀의 공부 고민, 성심껏 상담해 드립니다.",
        content_data: {
          fields: ["name", "phone", "grade", "subject", "message"],
          buttonText: "상담 신청하기"
        }
      }
    ]
  },

  // ==========================================
  // NEW TEMPLATES (1~20)
  // ==========================================
  coding_academy_dark: {
    templateId: "coding_academy_dark",
    name: "스마트 코딩 아카데미 & 부트캠프",
    category: "Education",
    description: "테크니컬하고 트렌디한 사이버 펑크 스타일의 코딩 부트캠프 및 IT 교육 학원 전용 다크 테마입니다.",
    image: "/templates/coding_academy_dark.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#10b981",     // 사이버 터쿼이즈 에메랄드 그린
        secondary: "#3b82f6",   // 일렉트릭 테크 블루
        accent: "#ec4899",      // 핫 핑크 네온
        background: "#090d16",  // 하이퍼 다크 스페이스
        surface: "#111827",     // 코드 에디터 차콜 그레이
        text: "#f3f4f6"         // 시인성 높은 네온 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "비전공자에서 네카라쿠배 테크 기업 개발자까지 6개월의 혁명",
        subtitle: "단순한 암기식 타이핑 공부가 아닌, 아키텍처 원천 설계와 풀스택 팀 프로젝트 구현을 통해 현업 수준의 코딩 감각을 이식하는 실무 부트캠프입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 커리어 상담 신청",
          ctaLink: "#contact",
          features: [
            { text: "현업 시니어 테크 리드 출신들의 1:1 코드 정밀 리뷰 및 리팩토링 지도" },
            { text: "실전 모의 코딩 테스트 및 기술 면접 자소서 무제한 무료 교정 서비스" }
          ]
        }
      },
      {
        section_type: "services",
        title: "실무 풀스택 커리큘럼",
        subtitle: "웹 및 앱 개발 트렌드를 관통하는 핵심 기술 스택 집중 훈련 트랙입니다.",
        content_data: {
          items: [
            {
              title: "프론트엔드 React & Next.js 마스터",
              description: "컴포넌트 설계 최적화 및 상태 관리 라이브러리, SSR 기반의 고효율 UI 직조를 연마합니다.",
              icon: "Layers"
            },
            {
              title: "백엔드 Node.js & Spring Boot",
              description: "데이터베이스 RDBMS 구조적 튜닝, 대용량 트래픽 대비 분산 캐싱 서버 아키텍처를 구현합니다.",
              icon: "Cpu"
            },
            {
              title: "AI 및 데이터 사이언스 트랙",
              description: "Python 기반 머신러닝 라이브러리와 딥러닝 텐서플로우를 활용한 실전 예측 모델을 개발합니다.",
              icon: "TrendingUp"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "지루한 이론 공부는 가라, 100% 실무 프로젝트로 실력을 증명합니다",
        subtitle: "우리는 코드를 외우지 않습니다. 문제를 해결하는 방법을 스스로 찾아내도록 교육합니다.",
        content_data: {
          description: "안녕하십니까. 스마트 코딩 대표 디렉터입니다. 온라인 강의만 결제해두고 진도를 못 나가며 자책하고 계셨나요? 코딩은 눈이 아닌 손과 뇌의 활발한 상호작용으로 익히는 기술적 감각입니다. 우리는 아침 9시부터 밤 10시까지 타이트하게 운영되는 온/오프라인 집중 상주 환경에서, 동료들과 밤새 머리를 맞대고 오류를 해결해나가는 집단지성 훈련 문화를 구축합니다. 당신의 미래 테크 자산을 업그레이드하십시오.",
          stats: [
            { label: "누적 취업 성공률", value: "89.4%" },
            { label: "현업 멘토진 규모", value: "24명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 실전 론칭 포트폴리오",
        subtitle: "협업을 통해 실제로 배포 및 론칭되어 사용자 반응을 이끌어낸 앱 프로젝트들입니다.",
        content_data: {
          items: [
            { title: "위드펫: 실시간 반려동물 돌봄 매칭 앱", description: "Socket.io를 이용한 1:1 채팅 및 내 주변 위치 GPS 기반 돌보미 추천 서비스 웹앱", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" },
            { title: "셰어그라운드: 중고 장비 공유 구독 플랫폼", description: "안전 결제 PG사 모듈 연동 및 Next.js SSR 기술을 도입하여 SEO 검색 노출을 극대화한 서비스", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "핏커리어: 개발자 이력서 자동 AI 분석툴", description: "OpenAI API 연동 및 이력서 PDF 파일 파싱 매칭을 통한 직무 적합성 퍼센트 계산 대시보드", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "부트캠프 입학 전형 의뢰",
        subtitle: "비전공자 여부, 희망 트랙(프론트/백엔드), 그리고 현재 노트북 보유 여부를 체크해 상담 신청을 넣어주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "코딩 부트캠프 신청하기"
        }
      }
    ]
  },

  kindergarten_joyful: {
    templateId: "kindergarten_joyful",
    name: "해피키즈 프리미엄 영어유치원",
    category: "Education",
    description: "아이들의 동심과 맑고 깨끗한 마음을 사로잡는 파스텔 버터 크림 옐로우와 부드러운 아기 솜사탕 핑크 조화의 프리미엄 영유 테마입니다.",
    image: "/templates/kindergarten_joyful.png",
    theme: {
      fontFamily: "Fredoka, Inter, sans-serif",
      colors: {
        primary: "#fca5a5",     // 소프트 베이비 핑크
        secondary: "#fef08a",   // 안락한 버터 옐로우
        accent: "#38bdf8",      // 맑고 깨끗한 베이비 블루
        background: "#fefaf6",  // 무자극 오가닉 라이트 베이지
        surface: "#ffffff",     // 둥근 모서리의 새하얀 책상
        text: "#b91c1c"         // 시인성 높은 사랑스러운 로즈 레드
      },
      borderRadius: "rounded-3xl", // 어필을 위해 둥글둥글한 라운딩
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "억지로 공부하는 영어가 아닌, 놀이처럼 매일 호흡하는 글로벌 놀이터",
        subtitle: "영국 및 미국 명문대 자격증 소지 원어민 강사진과 친환경 안전 인증 먹거리, 다채로운 자연 친화적 예체능 융합 놀이 프로그램으로 내 아이의 글로벌 자아를 우아하게 키워냅니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "입학 설명회 우선 신청",
          ctaLink: "#contact",
          features: [
            { text: "아기 피부에 안전한 친환경 무독성 원목 교구 및 실내 매트 100% 매립 시공" },
            { text: "식품의약품안전처 해썹(HACCP) 인증 유기농 오가닉 급식 및 알레르기 케어 식단" }
          ]
        }
      },
      {
        section_type: "services",
        title: "해피키즈 플레이그라운드",
        subtitle: "영어 발음 교정부터 인지 정서 발달까지 완벽 케어하는 연령별 프리미엄 프로그램입니다.",
        content_data: {
          items: [
            {
              title: "원어민 자연 발음 포닉스",
              description: "알파벳 글자와 소리의 유기적 관계를 즐거운 노래와 인형극 놀이 교구를 통해 순하게 체득합니다.",
              icon: "Smile"
            },
            {
              title: "글로벌 융합 아트 & 뮤직",
              description: "영어로 소통하며 명화 모작 페인팅과 악기 연주를 진행하여 오감 자극과 창의 지능을 이끌어냅니다.",
              icon: "Sparkles"
            },
            {
              title: "친환경 숲속 생태 야외 학습",
              description: "주 1회 단독 전용 버스를 가동하여 청정 자연 숲속에서 나무의 나이테를 만지고 영어를 매칭하는 생태 교육입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "사랑을 듬뿍 받은 아이가 가장 높고 우아한 자아를 형성합니다",
        subtitle: "모든 어린이의 입학 축하 가방에는 철저한 담임 강사 알림장 피드백이 동봉됩니다.",
        content_data: {
          description: "안녕하세요. 해피키즈 원장입니다. 맞벌이로 바쁜 일상 속에서 우리 아이가 오늘 밥은 잘 먹었는지, 영어 수업에는 주눅 들지 않고 적극적으로 소통했는지 걱정이 많으셨죠? 우리는 학급당 원어민 강사와 한국인 이중언어 강사 2인을 철저히 동시 배치하여 틈새 없는 개별 보살핌을 지향합니다. 아이들의 맑은 미소와 글로벌 자긍심을 행복하게 지켜드리겠습니다.",
          stats: [
            { label: "원어민 정교사 비율", value: "100% 학위 소지" },
            { label: "원내 실내 공기 정화기", value: "18대 상시 가동" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아이들이 꿈꾸는 해피키즈 인프라",
        subtitle: "어린이의 안전 동선을 최우선으로 고려하여 둥글둥글 모서리를 없앤 친환경 전경입니다.",
        content_data: {
          items: [
            { title: "원목 교구가 가득한 잉글리시 북 룸", description: "전 세계 프리미엄 원서 동화책과 입체 팝업북이 배치된 안전 매트 책 읽기 놀이방", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
            { title: "사계절 실내 온수 키즈 풀장", description: "안전 요원이 배치된 상태에서 유아 발달에 맞춘 적온의 해수 온수풀 물놀이 및 체육 수업실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오가닉 다이닝 룸 & 셰프 주방", description: "전문 영양사가 유기농 식자재로 매일 점심과 2회 간식을 아기 그릇에 아기자기하게 조리하는 전용 식당", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원서 입학 문의 및 방문 견학 신청",
        subtitle: "자녀의 생년월일과 현재 거주 아파트 단지명, 그리고 차량 셔틀 이용 여부를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "방문 예약 신청서 전송"
        }
      }
    ]
  },

  cooking_school_chef: {
    templateId: "cooking_school_chef",
    name: "라셰프 요리·제과제빵 학원",
    category: "Education",
    description: "따뜻하고 품격 있는 클래식 올리브 골드와 부드러운 에이프런 크림 베이지 배합으로 미식 조리와 전문가 자격증 취득을 돋보이게 하는 요리 아카데미 테마입니다.",
    image: "/templates/cooking_school_chef.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#8b5a2b",     // 갓 구운 바게트 웜 브라운
        secondary: "#f5ebe0",   // 밀가루 반죽 크림 아이보리
        accent: "#2f5233",      // 프레시 허브 올리브 그린
        background: "#faf6f0",  // 따스한 다이닝 조명 웜화이트
        surface: "#ffffff",     // 깨끗한 위생 세라믹 요리대
        text: "#3e2723"         // 에스프레소 초콜릿 다크 차콜
      },
      borderRadius: "rounded-lg",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "칼을 잡는 올바른 각도부터, 나만의 시그니처 마스터피스 플레이팅까지",
        subtitle: "호텔 수석 조리장 출신 강사진의 밀착 피드백 아래 한식·양식·일식 조리기능사 자격증 단기 합격부터 트렌디한 프렌치 다이닝 쿠킹 클래스까지 조리의 품격을 높입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 레시피 맛보기 신청",
          ctaLink: "#contact",
          features: [
            { text: "국내 유일의 1인 1구 개별 조리대 및 최신 위생 빌트인 오븐 시스템 완비" },
            { text: "조리기능사 합격률 91.2% 보장하는 요약 오답 강의 노트 무상 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "라셰프 쿠킹 클래스",
        subtitle: "요리 초보의 취미 클래스부터 레스토랑 창업을 위한 하이엔드 메뉴 개발 코스입니다.",
        content_data: {
          items: [
            {
              title: "조리기능사 자격증 대비반",
              description: "한식, 양식, 중식, 일식 규격 시험 요령과 0.1mm 칼질 채썰기 위생 규정을 단기에 완전 정복합니다.",
              icon: "Award"
            },
            {
              title: "트렌디 유러피안 홈파티 쿡",
              description: "바질 파스타, 수비드 스테이크, 감바스 알 아히요 등 손님 상에 즉각 내놓을 수 있는 미학적 홈파티 요리입니다.",
              icon: "Compass"
            },
            {
              title: "프리미엄 제과제빵 & 베이킹",
              description: "이스트 발효 온도 제어 및 천연 르방을 이용한 크루아상, 마카롱의 풍부한 식감 완성 비법을 전수합니다.",
              icon: "Sun"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "맛있는 음식은 머리가 아닌, 식재료를 존중하는 정직한 손끝에서 탄생합니다",
        subtitle: "모든 레시피는 시각적 아름다움과 최상의 질감을 극대화하도록 치밀하게 연구됩니다.",
        content_data: {
          description: "안녕하십니까. 라셰프 조리 학원 대표 원장입니다. 칼질조차 무섭고 두려웠던 왕초보 주부님도, 레레스토랑 창업 단가 조절로 골머리를 앓으시는 예비 창업주님도, 우리 아카데미에 오시면 식재료의 수분율과 마찰열을 다스리는 과학적 조리 원리를 쉽게 이해하게 됩니다. 우리는 타협하지 않는 청결과 1인 1재료 엄수 원칙을 지키며, 미식의 새로운 기준을 제시합니다.",
          stats: [
            { label: "누적 자격증 합격생", value: "4,200명+" },
            { label: "호텔 셰프 강사진 경력", value: "평균 15년" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 시그니처 플레이팅 갤러리",
        subtitle: "라셰프 실무 교육을 통해 완성된 수강생들의 품격 높은 실제 졸업 조리 작품입니다.",
        content_data: {
          items: [
            { title: "로즈마리 갈릭 양갈비 스테이크", description: "시어링 온도를 맞춰 육즙을 가두고 민트 젤리 소스와 구운 샬롯을 곁들인 양식 메인 작품", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" },
            { title: "바닐라 빈 생크림 슈 & 딸기 타르트", description: "바삭한 타르트 시트의 굽기 온도를 맞추고 천연 바닐라빈 생크림을 올린 고급 제과 마스터피스", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 한방 떡갈비와 전복 조림 정식", description: "대추 즙으로 단맛을 내고 석쇠에 직화로 구워내어 한식 규격의 우아함을 입증한 전통 한식 플레이팅", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "수업 시간표 조회 및 상담 신청",
        subtitle: "희망 과목(요리/베이킹), 수강 목적(취미/자격증/창업), 평일/주말반 희망 여부를 선택해 예약을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "요리 클래스 문의하기"
        }
      }
    ]
  },

  music_school_classic: {
    templateId: "music_school_classic",
    name: "칸타빌레 클래식 음악학원",
    category: "Education",
    description: "중후하고 고풍스러운 콘서트 흑장미 마호가니 레드와 차분한 아이보리 대리석 톤이 음악적 감성과 선율의 아름다움을 극대화하는 음악학원 테마입니다.",
    image: "/templates/music_school_classic.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#5c0618",     // 중후한 마호가니 와인 레드
        secondary: "#fdf8f5",   // 우아한 건반 크림 아이보리
        accent: "#b8860b",      // 고급스러운 클래식 골드
        background: "#faf6f5",  // 무자극 감성 연베이지
        surface: "#ffffff",     // 맑고 깨끗한 악보 화이트
        text: "#2c1a1d"         // 딥 우드 초콜릿 차콜
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "가슴을 울리는 선율의 깊이, 나만의 첫 마스터피스를 연주하다",
        subtitle: "모스크바 차이코프스키 국립음악원 출신 시니어 피아니스트들의 1:1 맞춤형 밀착 터치 클래스로, 계이름을 전혀 모르는 초보자부터 심도 높은 예원/예고 예체능 입시생까지 음악적 자아를 완벽 코칭합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 피아노 청음 레슨 신청",
          ctaLink: "#contact",
          features: [
            { text: "매달 완벽 조율되는 독일 야마하, 가와이 그랜드 피아노 단독 연습실 20실 가동" },
            { text: "연 1회 강남 아트홀을 대관하여 주최하는 프리미엄 수강생 하우스 콘서트 리사이틀 기회 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "음학 클래스 포트폴리오",
        subtitle: "피아노, 바이올린, 플루트 등 선율의 기초 호흡부터 무대 표현력까지 기르는 코스입니다.",
        content_data: {
          items: [
            {
              title: "1:1 정밀 피아노 레슨",
              description: "손모양 아치 형성, 페달 링 조절법, 타건 압력 조절을 정밀 피드백하여 나만의 인생 연주곡을 마스터합니다.",
              icon: "Layers"
            },
            {
              title: "클래식 바이올린 & 첼로 반",
              description: "활 긋는 궤적과 정확한 하이포지션 운지법을 귀로 확인하며 섬세한 현악기 피치 조율을 완성합니다.",
              icon: "Compass"
            },
            {
              title: "예체능 명문 입시 마스터 클래스",
              description: "실기 고사 당일의 긴장감 극복 모의 연주 평가 및 작곡가별 해석(바흐, 베토벤, 쇼팽)을 심층 마스터합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "음악은 영혼의 소리를 건반과 현을 빌려 투명하게 토해내는 미학입니다",
        subtitle: "잘못된 타건 습관은 손목 통증을 유발합니다. 시작부터 해부학적으로 안전하게 훈련하세요.",
        content_data: {
          description: "안녕하십니까. 칸타빌레 클래식 대표원장입니다. 우리는 단순히 바이엘, 체르니 진도 책장만 넘기는 기계적인 레슨을 지양합니다. 한 마디를 치더라도 곡이 가진 역사적 배경과 작곡가의 슬픔을 이해하고, 내 손가락의 뼈마디 근육을 이완시켜 풍성한 배음을 자아내도록 돕습니다. 도심 속 방음 완벽한 칸타빌레 살롱에서 당신만의 은은한 선율을 퍼뜨리십시오.",
          stats: [
            { label: "그랜드 피아노 전용 홀", value: "3개소 세팅" },
            { label: "예고/음대 누적 합격생", value: "150명+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "스튜디오 그랜드 홀 & 연습실 전경",
        subtitle: "언제나 자유롭게 오픈되어 연습에만 몰입할 수 있도록 쾌적하게 유지되는 쉼터입니다.",
        content_data: {
          items: [
            { title: "스타인웨이 그랜드 피아노 리허설 홀", description: "천장 돔 아키텍처 공명이 탁월하여 풍부한 배음 잔향을 즉각 선사하는 원내 메인 리사이틀 무대", image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80" },
            { title: "개인 방음 악기 연습룸", description: "더블 차음 방음 도어와 야마하 업라이트 피아노, 공기정화 필터가 빌트인된 아늑한 단독 연습실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "현악 앙상블 합주 라운지", description: "앙상블 트리오 및 콰르텟 단원들이 모여 파트를 맞추고 음악적 지식을 교류하는 감성 패브릭 홀", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "악기 무료 청음 및 레슨 예약 신청",
        subtitle: "원하시는 악기(피아노/바이올린/플루트 등), 희망 요일 및 시간, 그리고 악기 보유 유무를 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "무료 청음 신청하기"
        }
      }
    ]
  },

  art_academy_creative: {
    templateId: "art_academy_creative",
    name: "그림그리는 아뜰리에 미술학원",
    category: "Education",
    description: "생생하고 예술적 영감을 자극하는 화이트 캔버스 배경 위 에메랄드 그린과 비비드 크림 옐로우 조합의 창의 미술 교육 아카데미 테마입니다.",
    image: "/templates/art_academy_creative.png",
    theme: {
      fontFamily: "Inter, Noto Serif KR, sans-serif",
      colors: {
        primary: "#0f766e",     // 깊은 아뜰리에 틸 그린
        secondary: "#fef08a",   // 비타민 가득한 캔버스 레몬 옐로우
        accent: "#f43f5e",      // 시선을 사로잡는 오리지널 크랜베리 로즈
        background: "#fafaf9",  // 순수한 리넨 화이트 오프화이트
        surface: "#ffffff",     // 깨끗한 나무 이젤 화이트
        text: "#1c1917"         // 스케치 연필 카본 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "정형화된 입시 스킬을 넘어, 나만의 독창적인 예술 세계를 화폭에 담다",
        subtitle: "화려한 묘사 기법 이전에 사물과 빛이 자아내는 고유의 실루엣을 깊이 관찰하는 힘을 기르고, 수채화·유화·드로잉·아크릴화 등 나만의 감성을 투명하게 캔버스에 표현하는 힐링 미술 학원입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 재료 1일 레슨 신청",
          ctaLink: "#contact",
          features: [
            { text: "물감, 이젤, 브러시, 캔버스 등 명품 아티스트 재료비 추가 결제 없이 무제한 무료 대여" },
            { text: "홍익대 및 파리 국립미술학교 출신 우수 아티스트 강사진의 1:1 맞춤 선 두께 밀착 피드백" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아뜰리에 미술 커리큘럼",
        subtitle: "선의 미학부터 묵직한 유화의 질감까지 단계별로 차분하게 풀어나가는 미술 테래피입니다.",
        content_data: {
          items: [
            {
              title: "감성 아크릴 & 유화 정규반",
              description: "나이프를 활용한 두터운 임파스토 기법부터 정교한 글레이징 유화 레이어링을 차분하게 마스터합니다.",
              icon: "Palette"
            },
            {
              title: "초정밀 연필 데생 & 드로잉",
              description: "사물의 기하학적 형태, 명암의 10단계 분해, 3차원 투시 원근법의 튼튼한 데생 기초 체력을 기릅니다.",
              icon: "PenTool"
            },
            {
              title: "창의 융합 현대 키즈 미술",
              description: "아이들의 손끝 촉각 발달과 자아 표현을 위해 점토 조소, 혼합 매체 콜라주 놀이 영어를 병행합니다.",
              icon: "Smile"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "새하얀 캔버스는 내면의 숨겨진 모든 고독과 열정을 허락하는 유일한 방입니다",
        subtitle: "미술은 손재주가 아닌, 대상을 주의 깊게 사랑하고 관찰하는 마음의 태도에서 출발합니다.",
        content_data: {
          description: "반갑습니다. 그림그리는 아뜰리에 대표원장입니다. '나는 똥손이라 그림을 전혀 못 그려'라며 선 하나 긋는 것을 망설이셨나요? 그림에는 정답이 없습니다. 단지 당신이 바라본 대상의 형태와 그 순간의 호흡이 있을 뿐입니다. 우리는 복잡한 이론을 지우고, 흐르는 아크릴 물감의 선명함에 온전히 몰입해 지친 뇌파를 맑게 정화하는 진정한 휴식을 드립니다.",
          stats: [
            { label: "창작 아크릴 캔버스 수", value: "3,800점+" },
            { label: "보유 전문 이젤 규모", value: "25세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아뜰리에 창작 갤러리",
        subtitle: "왕초보 수강생들이 3개월간의 집중 수기 터치 끝에 완성해낸 뿌듯한 회화 작품 리스트입니다.",
        content_data: {
          items: [
            { title: "고독한 바다의 모네 아크릴화", description: "나이프로 아크릴 물감을 거칠게 얹어 파도의 역동적인 포말과 노을빛 윤슬을 연출한 풍경 유화풍 캔버스", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80" },
            { title: "인체 석고상 데생 앤 연필 드로잉", description: "빛의 굴절 각도를 치밀하게 포착하여 입체적인 양감과 섬세한 석고 질감을 훌륭하게 모작한 스케치", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "유기농 보타니컬 식물 수채화", description: "수채화 전용지에 물 번짐 기법을 자연스럽게 활용하여 몬스테라 잎맥의 초록 비타민을 머금은 일러스트", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1일 아뜰리에 무료 이젤 체험 예약",
        subtitle: "선호하시는 회화 장르(수채화/유화/드로잉 등), 기존 미술 경험 유무 및 방문 일정을 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아뜰리에 1일 레슨 예약"
        }
      }
    ]
  },

  language_school_english: {
    templateId: "language_school_english",
    name: "글로벌 링크 어학원",
    category: "Education",
    description: "스마트하고 이지적인 클래식 브리티시 네이비와 세련된 클린 오렌지 액센트 조화로 비즈니스 회화 및 어학 스펙 취득 신뢰도를 높인 어학원 테마입니다.",
    image: "/templates/language_school_english.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#1e293b",     // 세련된 브리티시 차콜 네이비
        secondary: "#fdba74",   // 산뜻한 탠저린 주황
        accent: "#0284c7",      // 신뢰도 높은 스마트 블루
        background: "#f8fafc",  // 깨끗한 에어 오프화이트
        surface: "#ffffff",     // 잉크젯 시험지 화이트
        text: "#0f172a"         // 눈이 편안한 네이비 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "문법 암기를 넘어, 원어민처럼 자유롭고 지적으로 생각하고 말하라",
        subtitle: "미국 아이비리그 출신 원어민 강사진과 자체 특허 스피킹 쉐도잉 피드백 시스템으로 토익, 토플, 비즈니스 영어 프레젠테이션 스킬까지 단 3개월 만에 원어민 혀 감각을 완성합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 원어민 레벨 테스팅",
          ctaLink: "#contact",
          features: [
            { text: "외국계 기업 영어 면접 및 글로벌 컨퍼런스 발표 대비 밀착 스크립트 첨삭 코칭" },
            { text: "소수 정예 4:1 토론식 액티브 스피킹 라운지 주 7회 상시 개방 시스템" }
          ]
        }
      },
      {
        section_type: "services",
        title: "글로벌 어학 솔루션",
        subtitle: "단기간 내 실력 점프와 어학 성적의 명확한 취득을 보장하는 특화 트랙입니다.",
        content_data: {
          items: [
            {
              title: "1:1 비즈니스 영어 회화",
              description: "이메일 영작 매너, 해외 바이어 협상, 주도적인 프리젠테이션 슬라이드 스피킹 스킬을 전담 교정합니다.",
              icon: "Users"
            },
            {
              title: "토익 & 토플 고득점 단기 완성",
              description: "LC 파트별 함정 단어 소거 요령 및 RC 핵심 5초 컷 영문법 공식을 대입하여 최고 성적을 돌파합니다.",
              icon: "Award"
            },
            {
              title: "영어 프레젠테이션 & 토론",
              description: "시사 이슈를 바탕으로 논리적인 뼈대를 잡고 글로벌 표준 발음과 위트 있는 표현 방식을 연마합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "영어는 공부하는 대상이 아닌, 내 가치를 두 배로 증폭시키는 매개체입니다",
        subtitle: "틀릴까 봐 두려운 마음을 지우고, 자신감 있게 리듬을 타며 스피킹을 시작하십시오.",
        content_data: {
          description: "안녕하십니까. 글로벌 링크 어학원의 학술 원장입니다. 중고등학교 10년 동안 영어를 공부하고도 왜 막상 외국인 앞에 서면 머릿속이 하얘지며 입이 굳을까요? 머리로 외운 문장은 뇌의 번역 과정을 거쳐 한계가 찾아오기 때문입니다. 우리는 원어민의 입 모양 근육과 호흡 쉐도잉 훈련을 통해, 단어를 소리 내어 뱉는 동물적 습관을 이식하여 귀가 즉각 뚫리는 회화를 지향합니다.",
          stats: [
            { label: "보유 원어민 석사 강사", value: "14명" },
            { label: "수강생 성적 돌파 누적", value: "5,500건+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "원어민 라운지 & 토론 스페이스",
        subtitle: "자연스러운 대화와 소통을 위해 세련되게 설계된 카페형 액티브 교육 환경입니다.",
        content_data: {
          items: [
            { title: "비즈니스 회화 토론 라운지", description: "스타벅스 카페 감성의 통창과 아늑한 라운지에서 커피를 마시며 원어민 강사와 프리토킹을 하는 쉼터", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" },
            { title: "개인 인공지능 발음 정밀 분석실", description: "모니터의 발음 파형 그래프를 보며 연음과 강세 인토네이션을 0.1초 만에 인공지능 진단하는 실습실", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80" },
            { title: "어학 고시장 규격 컴퓨터실", description: "토플 및 토익스피킹 실제 모의고사를 실제 화면 규격으로 헤드셋을 끼고 응시하는 모의 테스트 룸", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1:1 원어민 레벨 매핑 & 교재 상담",
        subtitle: "현재 대략적인 공인 영어 점수(있는 경우), 영어를 배우려는 주 목적(승진/이민/시험 등)을 적어 예약을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "1:1 무료 진단 신청"
        }
      }
    ]
  },

  foreign_study_consulting: {
    templateId: "foreign_study_consulting",
    name: "프레시맨 해외 유학 & 아이비리그 컨설팅",
    category: "Education",
    description: "지적이고 신뢰감 넘치는 옥스퍼드 크림슨 레드와 품격 높은 다크 네이비 배합으로 명문대 합격률과 컨설팅의 프리미엄 품격을 높인 유학원 테마입니다.",
    image: "/templates/foreign_study_consulting.png",
    theme: {
      fontFamily: "Cormorant Garamond, Noto Serif KR, serif",
      colors: {
        primary: "#7f1d1d",     // 명문대 상징 크림슨 레드
        secondary: "#1e3a8a",   // 신뢰를 약속하는 옥스퍼드 블루
        accent: "#d97706",      // 영광스러운 브라스 골드
        background: "#fafaf6",  // 고풍스러운 양장 도서관 연베이지
        surface: "#ffffff",     // 맑고 깨끗한 영문 성적표 화이트
        text: "#111827"         // 지적이고 선명한 다크 그레이
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "글로벌 무대를 향한 당신의 찬란한 꿈, 완벽한 합격 증명서로 답합니다",
        subtitle: "하버드, 예일, 콜롬비아 등 미국 아이비리그 및 영국 옥스브릿지 명문대 입학 사정관의 관점을 관통하는 맞춤 에세이 첨삭과 특별활동(E.C.) 포트폴리오를 독점으로 완성하는 VIP 유학 컨설팅입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "1:1 명문대 로드맵 문의",
          ctaLink: "#contact",
          features: [
            { text: "아이비리그 출신 전문 컨설턴트들의 정밀 자소서 대필 없는 오리지널 논리 뼈대 첨삭" },
            { text: "미국 상위 30위 명문 대학 입학 합격 통지서 누적 840장 돌파 검증 완료" }
          ]
        }
      },
      {
        section_type: "services",
        title: "프리미엄 입학 컨설팅",
        subtitle: "단순 성적 매칭이 아닌, 학생 고유의 내러티브를 만들어내는 입체적인 진학 코스입니다.",
        content_data: {
          items: [
            {
              title: "아이비리그 독점 올인원 케어",
              description: "9학년부터 12학년까지 GPA 내신 관리, SAT 목표 성취, 학생회장 등 차별화된 과외 특별활동을 올인원 빌드업합니다.",
              icon: "Award"
            },
            {
              title: "명품 합격 에세이 (Common App) 스튜디오",
              description: "학생의 평범한 일상을 인생의 위대한 성찰로 각색하여 입학사정관의 눈물과 감동을 이끌어내는 명품 첨삭입니다.",
              icon: "BookOpen"
            },
            {
              title: "보딩스쿨 및 교환학생 매치",
              description: "미국 탑 보딩스쿨(필립스 아카데미 등) 입학 인터뷰 시뮬레이션 및 에세이 준비를 완벽 지원합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "우리는 단지 유학 원서 접수 대행사가 아닌, 인생의 방향을 디자인하는 멘토입니다",
        subtitle: "모든 에세이는 단 한 문장도 타인의 글을 도용하지 않고 100% 학생의 스토리로 빚어집니다.",
        content_data: {
          description: "안녕하십니까. 프레시맨 유학 홀딩스 대표입니다. 수많은 학원가에서 천편일률적인 스펙 끼워맞추기 에세이로 학생들의 소중한 잠재력을 낭비하는 모습을 보며 큰 책임감을 느낍니다. 입학사정관은 똑같은 봉사활동 이력을 지루해합니다. 우리는 학생의 내면에 숨겨진 독특한 취미와 지적 호기심의 불씨를 발견하여, 세상에 단 하나뿐인 독창적인 학술 보고서로 포장해 승부합니다.",
          stats: [
            { label: "아이비리그 누적 합격률", value: "92.4% 도달" },
            { label: "소속 전임 컨설턴트", value: "12명 전원 동문" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "영광의 명문대 합격 기록 (Letters of Admission)",
        subtitle: "수많은 고민과 치밀한 전략 끝에 마침내 획득한 글로벌 명문 대학들의 오리지널 합격 오퍼들입니다.",
        content_data: {
          items: [
            { title: "하버드 대학교 정치외교학과 최종 합격", description: "교내 토론 동아리 설립 및 로컬 시의원 인턴십 E.C.를 독창적으로 어필하여 장학생 전형 합격", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80" },
            { title: "콜롬비아 대학교 뇌과학부 합격", description: "지역 노인 복지관 치매 봉사 활동과 연계된 3D 뇌파 정밀 코딩 논문 발표 이력을 에세이에 투명하게 녹여낸 성공작", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80" },
            { title: "스탠퍼드 대학교 컴퓨터공학과 오퍼 취득", description: "자체 유기견 분양 웹사이트 개발 및 깃허브 오픈소스 기여 스토리를 입학 사정관에게 강력 피력한 합격 레코드", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "글로벌 합격 로드맵 정밀 상담 예약",
        subtitle: "학생의 현재 학년, 현재 대략적인 GPA 등급 및 SAT/ACT 성적 범위, 희망 국가 및 대학명을 적어 제출하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프리미엄 1:1 진학 상담 신청"
        }
      }
    ]
  },

  essay_writing_academy: {
    templateId: "essay_writing_academy",
    name: "논리와 지혜 독서논술 학원",
    category: "Education",
    description: "고풍스러운 올드 페이퍼 브라운과 신뢰도 높은 전통 잉크 네이비의 배합으로 문장 분석력과 대입 논술 합격 실적을 차분하게 연출한 논술 전용 테마입니다.",
    image: "/templates/essay_writing_academy.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#334155",     // 깊이 있는 사색의 슬레이트 블루
        secondary: "#f1f5f9",   // 눈이 편안한 라이트 슬레이트
        accent: "#9a3412",      // 논리의 칼날을 세우는 테라코타 레드
        background: "#faf9f6",  // 고요한 서재 한지 연황토
        surface: "#ffffff",     // 정갈한 원목 책상 화이트
        text: "#1e293b"         // 가독성 극대화 슬레이트 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "문장의 논리를 바로 세우고, 깊이 있는 생각으로 세상을 바꾼다",
        subtitle: "초등 독서 습관 형성부터 대입 수시 논술 전형 합격까지, 어휘력·독해력·비판적 문장 분석력을 해부학적으로 훈련시키는 대한민국 최고 권위의 명품 글쓰기 아카데미입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
          ctaText: "글쓰기 수준 진단 받기",
          ctaLink: "#contact",
          features: [
            { text: "15년 경력 메이저 신문 기자 및 국어국문학 석박사 집필진의 1:1 대면 첨삭 피드백" },
            { text: "철학, 경제, 과학을 아우르는 학년별 교과 연계 정규 독서 큐레이션 도서 무상 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "독서논술 커리큘럼",
        subtitle: "생각의 틀을 짜고 설득력 있는 문장을 정교하게 배치하는 글쓰기 코스입니다.",
        content_data: {
          items: [
            {
              title: "초등 문해력 & 독서 토론",
              description: "스마트폰 유혹을 이기고 매주 1권의 책을 깊이 읽으며 줄거리를 논리적으로 요약 발표하는 기초 다지기입니다.",
              icon: "BookOpen"
            },
            {
              title: "중등 시사 에세이 & 수행평가 대비",
              description: "사회적 이슈에 대해 찬성과 반대의 입장을 균형 있게 서술하고 원고지 작성 양식에 맞춰 문장을 정제합니다.",
              icon: "PenTool"
            },
            {
              title: "고등 대입 수시 논술 집중반",
              description: "주요 대학별(연세대, 한양대 등) 출제 문항을 예리하게 해독하고 출제 위원을 설득하는 서술 공식을 체화합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "생각이 가난한 아이는 세련된 문장을 쓸 수 없기에, 우리는 먼저 사색의 밭을 일굽니다",
        subtitle: "글을 쓰는 모든 시간은 나 자신의 생각의 크기를 증명하는 거룩한 과정입니다.",
        content_data: {
          description: "반갑습니다. 논리와 지혜 학원의 원장입니다. 우리 아이들이 하루 종일 스마트폰의 짧은 숏폼 콘텐츠에만 노출되어, 세 문장 이상의 긴 글을 읽고 핵심 주제를 요약하지 못하는 심각한 문해력 저하를 겪고 있습니다. 우리는 지식을 억지로 머리에 구겨 넣는 주입식 교육을 단호히 거부합니다. 책의 행간에 숨겨진 진짜 메시지를 스스로 유추해내고, 논리적 타당성 위에 나만의 독창적인 비판을 얹어 글을 짓는 진정한 인문학 교육을 선사합니다.",
          stats: [
            { label: "대입 논술 누적 합격생", value: "680명+" },
            { label: "원내 보유 큐레이션 도서", value: "4,500권" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "자랑스러운 수강생 우수 원고 아카이브",
        subtitle: "치열하게 고민하고 첨삭을 거쳐 완성도를 높여낸 수강생들의 고품격 논술 작성 예시입니다.",
        content_data: {
          items: [
            { title: "현대 과학 기술과 소외에 대한 비판적 평론", description: "인공지능의 윤리적 딜레마를 주제로 삼아 주체적인 인간 존엄을 차분하게 피력한 중학교 3학년 우수 장원작", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80" },
            { title: "연세대학교 수시 인문논술 합격 복기안", description: "제시문 간의 유기적 모순 관계를 날카롭게 짚어내어 실제 채점관의 극찬을 이끌어낸 고등학교 3학년 논술 복기본", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80" },
            { title: "지구 온난화와 탄소세의 경제학적 사색", description: "환경 규제가 기업 경쟁력에 미치는 명암을 경제적 수치 지표와 결합하여 짜임새 있게 작성한 토론 정식 에세이", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 문해력 수준 평가 신청",
        subtitle: "자녀의 학년 및 현재 가장 큰 공부 고민(어휘력 부족, 서술형 평가 대비 등)을 작성해 진단 예약을 확정받으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "정밀 진단 테스트 예약"
        }
      }
    ]
  },

  math_special_clinic: {
    templateId: "math_special_clinic",
    name: "에이블 1등급 수학 전문학원",
    category: "Education",
    description: "이지적이고 명확한 다크 네이비와 차가운 딥 그레이, 형광 레몬 엘로우 액센트로 수능 수학 만점의 날카로움을 강조한 고등 수학 전문 테마입니다.",
    image: "/templates/math_special_clinic.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 명확하고 신뢰도 높은 수학 네이비
        secondary: "#f1f5f9",   // 단정한 오프화이트 그레이
        accent: "#d9f99d",      // 오답 노트를 짚어내는 형광 라임 그린
        background: "#fafbfd",  // 청결하고 집중도가 높은 백그라운드
        surface: "#ffffff",     // 화이트보드 퓨어 화이트
        text: "#0f172a"         // 눈이 아프지 않은 잉크 블랙 슬레이트
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "단순 공식 대입은 가라, 수학적 기하학적 본질의 메커니즘을 꿰뚫다",
        subtitle: "킬러 문항 22번, 30번을 직관적으로 돌파할 수 있도록 조건 해석력을 훈련하고, 매주 원장이 직접 출제하는 서술형 오답 추적 메커니즘으로 수학을 1등급 만점으로 안내합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
          ctaText: "입학 수학 진단 의뢰",
          ctaLink: "#contact",
          features: [
            { text: "대치동 일타 강사진 출신들의 킬러 3점/4점 조건 해석 비법 비공개 요약본 배포" },
            { text: "매 수업 직후 당일 오답을 완벽히 해결해야만 퇴실 가능한 '지옥의 오답 피드백 클리닉' 상시 개동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에이블 수학 트랙",
        subtitle: "모의고사 원점수 100점을 목표로 개념과 발상을 치밀하게 단련하는 커리큘럼입니다.",
        content_data: {
          items: [
            {
              title: "고1/고2 내신 극대화 집중반",
              description: "학교별 부교재, 교육청 모의고사 기출 변형 문항을 5개년 이상 이 잡듯 샅샅이 뒤져 서술형 만점을 직조합니다.",
              icon: "Award"
            },
            {
              title: "수능 수학 1등급 킬러 돌파반",
              description: "미적분, 기하, 확률과 통계의 킬러 조건식을 함수 그래프의 대칭성과 주기성을 이용해 스피디하게 해독하는 발상 훈련입니다.",
              icon: "Compass"
            },
            {
              title: "1:3 밀착 개별 클리닉 스페이스",
              description: "대형 판서 수업을 따라가기 벅찬 학생을 위해 질문 제한 없이 맞춤 진도와 과외식 솔루션을 공급합니다.",
              icon: "Users"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "수학은 암기하는 과목이 아닌, 주어진 단서를 통해 완벽한 논리를 축조하는 퍼즐입니다",
        subtitle: "틀린 오답을 스스로 남에게 100% 논리적으로 말로 설명할 수 있을 때 진짜 내 지식이 됩니다.",
        content_data: {
          description: "안녕하십니까. 에이블 수학 전문학원 대표원장입니다. 많은 학생들이 수학 문제집만 10권 이상 양치기하듯 풀고도 모의고사 점수가 50점대에 머무는 억울함을 겪습니다. 풀이 과정의 발상 원리를 모른 채 해설지의 풀이를 눈으로 외웠기 때문입니다. 우리는 조건식의 콤마 하나 뒤에 숨겨진 출제자의 출제 의도를 집요하게 분석하여, 처음 마주하는 수능 4점 킬러 문제도 침착하게 쪼개어 풀도록 만듭니다.",
          stats: [
            { label: "수능 수학 1등급 달성 비중", value: "48.2% 입증" },
            { label: "자체 보유 변형 기출 문항", value: "12,500문항" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수능 만점 & 1등급 합격수기 아카이브",
        subtitle: "에이블의 치밀한 1:1 오답 역추적 훈련을 통해 수학의 패러다임을 바꾼 선배들의 수기 리스트입니다.",
        content_data: {
          items: [
            { title: "만년 4등급에서 수능 수학 원점수 96점 달성기", description: "공식 암기 대신 조건식의 기하학적 시각화 훈련을 통해 킬러 2문항 제외 전부 정답을 획득한 기적의 극복 수기", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80" },
            { title: "의대 최종 합격을 만든 에이블 킬러 공략법", description: "평소 킬러 오답노트를 말로 설명하는 원내 스피킹 테스트를 거치며 빈틈없는 만점 100점을 입증한 합격 수기", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80" },
            { title: "내신 전교 1등을 사수한 고2 수학 변형 노트 활용법", description: "대진고 부교재 기출 변형 8차 패키지를 완벽 분석하여 내신 서술형 부분 감점 0.1점도 없이 100점 만점을 이뤄낸 사례", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "입학 수학 진단 평가 예약 의뢰",
        subtitle: "학생의 현재 학년, 가장 취약한 수학 파트(기하/수2/미적분 등), 그리고 직전 모의고사 점수대를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "정밀 수학 레벨 검사 예약"
        }
      }
    ]
  },

  online_courses_modern: {
    templateId: "online_courses_modern",
    name: "스마트런 온/오프 강의 플랫폼",
    category: "Education",
    description: "트렌디한 테크 바이올렛과 루미너스 핑크, 글래스모피즘 효과가 결합한 세련된 모던 E-러닝 및 인터넷 강의 플랫폼 테마입니다.",
    image: "/templates/online_courses_modern.png",
    theme: {
      fontFamily: "Plus Jakarta Sans, Inter, sans-serif",
      colors: {
        primary: "#6366f1",     // 트렌디한 테크 인디고 바이올렛
        secondary: "#f43f5e",   // 시선을 사로잡는 마젠타 핑크
        accent: "#10b981",      // 완강률을 돕는 에메랄드 그린
        background: "#0f172a",  // 깊고 차분한 다크 나이트 블루 슬레이트
        surface: "#1e293b",     // 세련된 반투명 글래스 차콜 슬레이트
        text: "#f8fafc"         // 가독성 높은 네온 화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "장소의 한계를 넘어, 업계 최고 일타 마스터의 지식을 내 방에서 호흡한다",
        subtitle: "고해상도 4K 스트리밍 기술과 실시간 질의응답 AI 자동 노트 생성 인프라를 바탕으로, 코딩·디자인·마케팅·외국어 등 업계 최정상 강사들의 실전 지식을 저렴하고 편리하게 완강합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          ctaText: "인기 완강 강의 7일 체험",
          ctaLink: "#contact",
          features: [
            { text: "질문 즉시 3초 만에 챕터별 답변을 해주는 인공지능 '스마트 런 봇' 탑재" },
            { text: "강의 교안 PDF 교재 및 실습용 코드 소스 파일 무료 다운로드 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스마트런 추천 강의 대시보드",
        subtitle: "누적 수강평 별점 4.9점 이상을 획득한 검증된 베스트셀러 클래스 리스트입니다.",
        content_data: {
          items: [
            {
              title: "Next.js 14 실전 대형 커머스 제작",
              description: "실제 PG 결제사 모듈 연동 및 Supabase 백엔드 데이터 동기화를 다루는 35시간 풀 패키지 코스입니다.",
              icon: "Cpu"
            },
            {
              title: "AI 활용 생성형 미드저니 디자인",
              description: "프롬프트 마술사가 되는 실전 키워드 조합 비법과 상업적 웹 광고 배너 디자인 론칭 스킬을 공유합니다.",
              icon: "Palette"
            },
            {
              title: "퍼포먼스 페이스북 광고 마케팅",
              description: "타겟 오디언스 AB 테스트 공식과 광고비 대비 수익률(ROAS) 800% 돌파를 만드는 실전 카피 셋업입니다.",
              icon: "TrendingUp"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "배움은 더 이상 비싼 비용이 아닌, 매일 15분씩 나를 업그레이드하는 똑똑한 습관입니다",
        subtitle: "모든 인터넷 강의에는 수강 후 포트폴리오를 제출 시 100% 환급되는 장학 혜택이 적용됩니다.",
        content_data: {
          description: "반갑습니다. 스마트런 온라인 플랫폼의 최고 교육 관리 책임자입니다. 시중에 비싸게 결제만 해두고 완강하지 못한 채 버려진 강의들이 참 많습니다. 우리는 게이미피케이션 요소를 접목하여 수강 진도율에 따라 가상 네온 포인트를 지급하고 기프티콘으로 교환해주는 '동기부여 완강 리워드 시스템'을 가동합니다. 지루하지 않은 배움의 축제를 지금 경험하세요.",
          stats: [
            { label: "평균 수강생 완강 비율", value: "82.4% 업계 최고" },
            { label: "누적 등록 강의 개수", value: "480개 세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 완강 후기 & 리얼 포트폴리오",
        subtitle: "스마트런의 정교한 로드맵 강의를 완강한 선배들의 자랑스러운 결과물 리포트입니다.",
        content_data: {
          items: [
            { title: "비전공자 웹 마케터의 3D 웹 인터랙티브 포트폴리오", description: "Three.js 라이브러리를 강의를 수강하며 3D 자동차 그래픽을 브라우저에 가볍게 구현해 취업에 성공한 우수작", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" },
            { title: "미드저니 활용 디자인 외주 2천만원 달성기", description: "AI 그래픽 생성 팁을 마스터해 실제로 크몽 등 플랫폼에서 럭셔리 포스터 외주를 주도하여 매출을 올린 성공 수기", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "구글 애널리틱스 4 데이터 대시보드 구축작", description: "자사 쇼핑몰에 GA4 태그 매니저를 직접 심어 고객의 상세 이탈 경로를 시각화 보고서로 도출해낸 마스터 클래스 수강작", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "맞춤형 교육 로드맵 1일 무료 열람권 신청",
        subtitle: "관심 있는 강의 분야(코딩/디자인/마케팅 등), 현재 나의 실력 상태(입문/초보/실무자)를 작성해 보내주십시오.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "무료 맛보기 수강권 발송"
        }
      }
    ]
  },

  flight_attendant_school: {
    templateId: "flight_attendant_school",
    name: "스카이엔젤 승무원 아카데미",
    category: "Education",
    description: "우아하고 깨끗한 분위기의 스카이 블루와 신뢰감을 주는 골든 베이지 배합으로 메이저 항공사 승무원 합격을 돕는 전문 아카데미 테마입니다.",
    image: "/templates/flight_attendant_school.png",
    theme: {
      fontFamily: "Inter, Noto Serif KR, sans-serif",
      colors: {
        primary: "#0284c7",     // 맑고 깨끗한 아시아나 스카이 블루
        secondary: "#f1f5f9",   // 위생적인 클라우드 라이트 그레이
        accent: "#d97706",      // 우아한 제복 골든 브론즈
        background: "#fafcfd",  // 투명한 비행 고도 백그라운드
        surface: "#ffffff",     // 맑고 정갈한 면접 테이블 화이트
        text: "#0f172a"         // 지적인 카본 차콜 네이비
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "하늘을 날며 세계를 마주할 당신의 꿈, 우아한 제복으로 피어납니다",
        subtitle: "메이저 국내외 항공사(대한항공, 아시아나, 에미레이트) 사무장 및 면접관 출신 수석 강사진이 미세한 미소 각도부터 면접 스피치, 기내 영작문까지 1:1로 밀착 관리하여 승무원 합격 문을 엽니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 이미지 매핑 신청",
          ctaLink: "#contact",
          features: [
            { text: "최신 메이저 항공사 기출 면접 질문 500제 완전 분석 바이블 교재 배포" },
            { text: "워킹, 헤어, 메이크업 피드백을 실시간 카메라로 정밀 분석해 교정해주는 피드백 룸 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "캐빈 크루 정복 코스",
        subtitle: "서류 합격부터 최종 임원진 면접까지 빈틈없이 품격을 빌드업하는 전문 교육 라인입니다.",
        content_data: {
          items: [
            {
              title: "국내 메이저 항공사 올패스",
              description: "대한항공, 아시아나항공의 인재상 맞춤형 면접 스크립트 작성 및 롤플레잉 위기 대처 답변을 연마합니다.",
              icon: "Award"
            },
            {
              title: "외항사 영어 면접 & 디스커션",
              description: "싱가포르항공, 에미레이트 등 외항사 특유의 영어 압박 질문과 자유로운 그룹 토론 면접을 마스터합니다.",
              icon: "Compass"
            },
            {
              title: "프리미엄 승무원 이미지 메이킹",
              description: "정갈한 승무원 번(Hair bun) 헤어 세팅, 진주 귀걸이 매칭, 허리를 곧게 세운 워킹의 품격을 완성합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "승무원은 단순히 서빙하는 직업이 아닌, 승객의 생명과 안전을 지키는 전문 캐빈 크루입니다",
        subtitle: "당신의 따뜻한 미소 속에는 고도로 숙련된 서비스 지성이 깃들어 있어야 합니다.",
        content_data: {
          description: "안녕하십니까. 스카이엔젤 승무원 학원 원장입니다. 수많은 면접 탈락 원인은 바로 '연출된 듯한 가식적인 미소와 앵무새 같은 기계적 답변' 때문입니다. 실제 항공사 임원 면접관들은 자연스러운 대화에서 풍겨 나오는 자연스러운 매너와 위기 대처 지성을 주의 깊게 봅니다. 우리는 개개인의 성격적 특장점을 매력적인 스토리텔링 자소서로 각색하여, 면접실 문을 열고 들어가는 첫 3초의 아우라를 합격으로 바꿉니다.",
          stats: [
            { label: "누적 항공사 합격생", value: "380명 돌파" },
            { label: "전직 항공사 강사진", value: "10명 상주" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "기내 모의 훈련 실습실 (Mock-up) & 메이크업 실",
        subtitle: "실제 비행기 내부와 동일한 인프라를 원내에 이식하여 실전 적응력을 극대화한 실습실 전경입니다.",
        content_data: {
          items: [
            { title: "비행기 내부 목업(Mock-up)실", description: "실제 기내 카트와 기내 방송용 송수신기를 장착하여 승객 대응 롤플레이를 연습하는 실무 훈련장", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "프리미엄 이미지 메이킹 파우더룸", description: "항공사 제복을 착용해보고 조명 거울 앞에서 화사한 합격 메이크업과 헤어 뽕을 세팅하는 뷰티 공간", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "외항사 대비 비디오 카메라 분석실", description: "카메라 렌즈 앞에서 서서 답변하는 내 표정과 비뚤어진 어깨 각도를 0.1초 단위 모니터링 모니터실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 이미지 매핑 & 스피치 테스트 신청",
        subtitle: "나의 키, 전공, 희망하는 메인 항공사를 적어 비공개 무료 승무원 적합성 자문 검사를 예약해 보세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "무료 이미지 자문 신청"
        }
      }
    ]
  },

  barista_coffee_school: {
    templateId: "barista_coffee_school",
    name: "더브루 커피 바리스타 랩",
    category: "Education",
    description: "은은하고 향긋한 에스프레소 브라운과 크래프트 종이 베이지 컬러 배합으로 국제 바리스타 자격증 및 라떼아트 기술을 정교하게 보여주는 커피 학원 테마입니다.",
    image: "/templates/barista_coffee_school.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#6f4e37",     // 고소한 에스프레소 로스트 브라운
        secondary: "#e6ccb2",   // 부드러운 카페라떼 크림 베이지
        accent: "#7f5539",      // 진한 마호가니 모카 브라운
        background: "#faf6f0",  // 아늑한 카페 조명 오프화이트
        surface: "#ffffff",     // 깨끗한 위생 대리석 컵받침
        text: "#463f3a"         // 로스팅 카본 블랙 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "원두 로스팅의 미세한 온도 차이부터, 완벽한 5색 라떼아트의 푸어링까지",
        subtitle: "유럽 SCA(Specialty Coffee Association) 공식 국제 바리스타 자격증 취득부터, 카페 창업을 위한 시그니처 에이드 메뉴 개발까지, 커피의 모든 미학을 고해상도로 완벽 전수합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
          ctaText: "바리스타 1일 에스프레소 체험 신청",
          ctaLink: "#contact",
          features: [
            { text: "국내 최고급 달라코르테, 시네소 하이엔드 상업용 머신 1인 1머신 독점 사용 연습 환경 보장" },
            { text: "로스팅 팩토리 직송 스페셜티 생두를 활용한 커핑(Cupping) 센서리 영양 무료 아카이브 교육" }
          ]
        }
      },
      {
        section_type: "services",
        title: "바리스타 전문 커리큘럼",
        subtitle: "원두 감별사부터 프로 바리스타까지 성장시키는 완벽한 커피 교육 솔루션입니다.",
        content_data: {
          items: [
            {
              title: "SCA 국제 바리스타 자격증반",
              description: "에스프레소의 완벽한 25초 추출 시간 매칭, 분쇄도 입자 조절, 우유 스팀 밀크 벨벳 폼 생성을 집중 훈련합니다.",
              icon: "Award"
            },
            {
              title: "시그니처 라떼 아트 디자인",
              description: "안정적인 하트, 로제타, 튤립의 붓는 낙차 조절과 0.1초 푸어링 유량 조작 핸들링을 전수합니다.",
              icon: "Sparkles"
            },
            {
              title: "카페 창업 실무 & 메뉴 컨설팅",
              description: "계절별 에이드 청 제조 비법, 시그니처 원두 블렌딩 매칭, 커피 머신 위생 자가 청소 관리 정비를 교육합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "커피는 단순한 기호 음료를 넘어, 생두의 산미와 물의 온도가 만드는 과학적 예술입니다",
        subtitle: "모든 에스프레소 추출 원리는 생두의 수분율과 습도에 맞춰 과학적으로 역계산되어야 합니다.",
        content_data: {
          description: "안녕하십니까. 더브루 바리스타 아카데미 대표 디렉터입니다. 카페 창업을 꿈꾸지만 어디서부터 어떤 기계를 사야 할지, 왜 내가 내린 에스프레소는 쓰거나 지나치게 신맛만 나는지 답답하셨죠? 에스프레소는 기온과 습도, 그리고 그라인더 날의 마찰 열량에 따라 매일 달라집니다. 우리는 단순히 버튼만 누르는 바리스타가 아닌, 커피의 성분을 통제하는 진정한 스페셜티 마스터를 직조해 냅니다.",
          stats: [
            { label: "바리스타 자격증 합격생", value: "3,200명+" },
            { label: "원내 상업용 에스프레소 머신", value: "12대 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 라떼아트 & 커핑 갤러리",
        subtitle: "더브루 바리스타 랩에서 수강생들이 직접 푸어링하여 연출해 낸 실제 벨벳 폼 라떼아트들입니다.",
        content_data: {
          items: [
            { title: "5단 튤립 레이어드 벨벳 라떼아트", description: "미세 스팀 밀크 폼의 대칭성과 낙차를 칼같이 맞춰 커피 표면에 선명하게 띄워낸 수강 2개월 차 걸작", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" },
            { title: "로스팅 팩토리와 에스프레소 기어", description: "로스팅 머신의 드럼 회전 속도와 온도 센서를 활용해 다크 로스팅 생두의 단맛을 극대화한 원내 실습 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "스페셜티 커피 센서리 커핑룸", description: "전 세계 아라비카 원두의 향미(아로마, 산미, 바디)를 스푼으로 청음 흡입하며 테이스팅 노트를 작성하는 훈련실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1일 에스프레소 & 라떼아트 체험 클래스 신청",
        subtitle: "수강하고자 하는 목적(취미/국제자격증/카페창업), 그리고 선호하는 커피 타입(산미/고소함)을 적어 예약을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "바리스타 클래스 문의하기"
        }
      }
    ]
  },

  beauty_hair_academy: {
    templateId: "beauty_hair_academy",
    name: "뮤즈 뷰티 헤어·메이크업 미용학원",
    category: "Education",
    description: "화사하고 세련된 살구 빛 파스텔 로즈 핑크와 세련된 카본 블랙, 골드 액센트로 뷰티 라이프스타일과 국가미용자격증 합격을 보여주는 미용학원 테마입니다.",
    image: "/templates/beauty_hair_academy.png",
    theme: {
      fontFamily: "Inter, Montserrat, sans-serif",
      colors: {
        primary: "#e11d48",     // 강렬하고 화사한 뷰티 마젠타 로즈
        secondary: "#ffe4e6",   // 소프트 파스텔 핑크
        accent: "#fbbf24",      // 럭셔리 헤어 브론즈 골드
        background: "#fafaf9",  // 정갈한 대리석 오프화이트
        surface: "#ffffff",     // 깨끗한 미용실 메이크업 거울 화이트
        text: "#1c1917"         // 시인성 높은 다크 초콜릿 카본
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "트렌디한 케이뷰티(K-Beauty)의 중심, 글로벌 뷰티 아티스트로 비상하다",
        subtitle: "국가미용자격증(헤어, 메이크업, 네일아트, 피부미용) 최단기 프리패스 합격 공식과 청담동 메이저 샵 실장급 강사진의 맞춤 손끝 각도 코칭으로 뷰티의 가치를 바꿉니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 미용 자격증 모의 고사 신청",
          ctaLink: "#contact",
          features: [
            { text: "시험장 규격과 100% 동일한 개인 거울 세팅 및 헤어 샴푸 실습실 인프라 완비" },
            { text: "졸업 즉시 강남 및 청담동 메이저 뷰티 샵 취업 연계 핫라인 인프라 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "뷰티 아티스트 트랙",
        subtitle: "취미 미용부터 최고 난도 특수 메이크업 자격 취득까지 완벽 케어하는 실무 영역입니다.",
        content_data: {
          items: [
            {
              title: "헤어 디자인 & 커트 마스터",
              description: "국가 실기 시험 5대 커트(이사도라, 그라데이션 등)와 와인딩 롤 피드백을 단기에 완수합니다.",
              icon: "Layers"
            },
            {
              title: "트렌디 메이크업 & 네일아트",
              description: "웨딩, 방송 화보 메이크업부터 젤 네일 오버레이 기법, 위생적인 프렌치 팁 장착 요령을 전수합니다.",
              icon: "Sparkles"
            },
            {
              title: "피부 미용 및 에스테틱 실무",
              description: "피부 타입별 정밀 문진 매니지먼트, 수기 림프 마사지 테크닉, 스킨 스크러버 기기 사용법을 정교하게 교육합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아름다움은 단순히 가리는 것이 아닌, 본연의 숨겨진 윤곽과 색채를 찾아 해방하는 과정입니다",
        subtitle: "미용 자격증 실기 고사의 합격 비밀은 손의 위생 자세와 한 결 같은 빗질에 있습니다.",
        content_data: {
          description: "안녕하십니까. 뮤즈 뷰티 아카데미 대표원장입니다. 미용 학원에 값비싼 재료 박스만 사두고 정작 피드백을 받지 못해 시간만 낭비하셨나요? 미용은 손끝의 정교한 텐션과 가위의 날 선 각도가 만드는 감각 기술입니다. 우리는 실기 고사 당일의 긴장감 극복을 위해 매주 실제 시험 감독관 채점 기준표를 도입한 '가상 실기 시뮬레이션 고사'를 전원 무료 가동합니다.",
          stats: [
            { label: "국가 자격증 누적 합격생", value: "5,800명+" },
            { label: "청담동 샵 취업 연계율", value: "94.2%" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 헤어 & 메이크업 실습 갤러리",
        subtitle: "뮤즈 뷰티의 정밀 수기 훈련을 통해 수강생들이 모델의 두상에 직접 시술해 낸 실제 헤어 작품들입니다.",
        content_data: {
          items: [
            { title: "그라데이션 보브 헤어 커트와 롤 세팅", description: "두상 각도를 45도로 칼같이 유지하여 모발 끝의 단차 그라데이션을 우아하게 연출해 낸 헤어 실기 작품", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 웨딩 스위트 메이크업", description: "신부의 피부 투명도를 투명하게 살리고 골드 펄 섀도우와 코랄 치크를 조화롭게 얹어낸 정갈한 웨딩 메이크업", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "무균 네일아트 익스텐션 & 팁 위생", description: "아크릴 폼을 이용해 깨끗하고 부러지지 않게 손톱 연장을 성형하고 스톤 파츠를 토핑한 네일 아트 에디션", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 미용 진로 컨설팅 & 시설 견학 의뢰",
        subtitle: "관심 분야(헤어/메이크업/네일/피부), 수강 목적(취업/창업/대학진학), 희망 수강 시간대를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "미용 자격증 상담 신청"
        }
      }
    ]
  },

  actor_acting_academy: {
    templateId: "actor_acting_academy",
    name: "라온 연기·스피치 트레이닝 랩",
    category: "Education",
    description: "무대의 묵직한 막을 연상시키는 딥 와인 버건디와 시선을 사로잡는 스포트라이트 오렌지 골드가 배우의 존재감을 발산하는 연기·연극영화과 학원 테마입니다.",
    image: "/templates/actor_acting_academy.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4c0519",     // 무대 암막 버건디
        secondary: "#fef3c7",   // 조명 노을 오렌지 골드
        accent: "#f43f5e",      // 심장 박동 로즈 핑크
        background: "#0c0a09",  // 묵직한 극장 다크 브라운 블랙
        surface: "#1c1917",     // 대기실 러프 우드 스퀘어
        text: "#f5f5f4"         // 대사 대본 시인성 화이트
      },
      borderRadius: "rounded-sm",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "카메라 렌즈 앞에서도 흔들림 없는 진짜 나만의 호흡과 감성을 찾다",
        subtitle: "한양대 및 중앙대 연극영화과 시니어 동문 출신의 독점 입시 노하우와 실제 방송사 공채 오디션 캐스팅 핫라인을 바탕으로, 연기 기초 호흡부터 보컬 신체 훈련까지 배우의 존재감을 완성합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
          ctaText: "1일 모의 연기 진단 신청",
          ctaLink: "#contact",
          features: [
            { text: "카메라에 찍힌 내 얼굴의 좌우 비대칭성과 발성 파형을 보여주는 특수 캠 모니터실 완비" },
            { text: "자유 연기, 독백 대본, 특기(뮤지컬 보컬/현대무용) 1인 3특기 합격 전략 매칭 시스템" }
          ]
        }
      },
      {
        section_type: "services",
        title: "배우 육성 커리큘럼",
        subtitle: "신체 이완부터 내면의 깊은 감정 연기, 발성 사운드를 설계하는 핵심 코스입니다.",
        content_data: {
          items: [
            {
              title: "연극영화과 대학 진학 입시반",
              description: "올해의 주요 대학 수시/정시 지정 희곡을 예리하게 해독하고, 매력적인 인물 창조 및 질의응답을 훈련합니다.",
              icon: "Award"
            },
            {
              title: "실전 영화/드라마 오디션반",
              description: "0.1초 만에 감독의 눈길을 사로잡는 카메라 앵글 맞춤형 자유 독백과 눈빛 클로즈업 감정 제어를 연마합니다.",
              icon: "Compass"
            },
            {
              title: "보이스 발성 & 스피치 아카데미",
              description: "복식 호흡을 기반으로 웅얼거리는 아나운싱 발음과 쉰 목소리를 바로잡아 설득력 있는 중저음 톤을 셋업합니다.",
              icon: "Volume2"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "연기는 지어내는 거짓 감정이 아닌, 텍스트 속에 진짜 나를 이식하는 정직한 예술입니다",
        subtitle: "발성이 좋아지려면 먼저 복강의 횡격막을 내리고 목뼈와 어깨를 완전히 이완시켜야 합니다.",
        content_data: {
          description: "안녕하십니까. 라온 연기 트레이닝 랩 대표입니다. 대본을 손에 쥐고 국어책 읽듯 평범하고 딱딱한 대사만 내뱉고 계셨나요? 연기는 머리로 분석하는 지적 유희가 아니라, 온몸의 신체 감각을 열어 대사 뒤에 숨겨진 서브 텍스트를 눈빛과 호흡으로 뿜어내는 입체적 에너지입니다. 우리는 기계적 테크닉을 걷어내고, 카메라 렌즈 앞에서 학생 본연의 날것의 독창성이 빛나도록 유도합니다.",
          stats: [
            { label: "연극영화과 수시 합격생", value: "180명 돌파" },
            { label: "원내 단독 소극장 규모", value: "80석 보유" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "오디션 프로필 & 극장 훈련실",
        subtitle: "수강생들이 굵은 땀방울을 흘리며 실제 무대 연기를 훈련하는 독점 예술 인프라입니다.",
        content_data: {
          items: [
            { title: "블랙박스 전용 소극장 스테이지", description: "현직 연극 무대와 동일한 조명 딤머 콘솔과 방음 음향 시스템이 가동되는 원내 연습 소극장 무대", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" },
            { title: "개인 프로필 카메라 스튜디오", description: "프로필 전용 조명과 고성능 DSLR 카메라로 상시 내 연기 영상을 모니터링 및 인코딩하는 촬영실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "신체 트레이닝 & 무용 연습룸", description: "벽면 전면 거울 및 충격 흡수 충격 방지 댄스 플로어가 완비되어 뮤지컬과 현대무용 특기를 연습하는 실습실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1:1 연기 진단 및 무료 카메라 오디션 예약",
        subtitle: "지원 분야(연기입시/스피치/성인오디션), 연기 경험 유무, 가장 존경하는 배우나 희망 대본 스타일을 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "연기 카메라 진단 신청"
        }
      }
    ]
  },

  sports_soccer_school: {
    templateId: "sports_soccer_school",
    name: "주니어 스타즈 스포츠 클럽",
    category: "Education",
    description: "잔디밭의 싱그러움이 느껴지는 맑은 필드 그린과 활기찬 선셋 오렌지, 청량한 하늘 블루 조화로 아동 신체 발달과 단합력을 강조한 스포츠 학원 테마입니다.",
    image: "/templates/sports_soccer_school.png",
    theme: {
      fontFamily: "Cabinet Grotesk, Inter, sans-serif",
      colors: {
        primary: "#15803d",     // 잔디밭 필드 그린
        secondary: "#f97316",   // 에너지 선셋 주황
        accent: "#0ea5e9",      // 액티브 스카이 블루
        background: "#f0fdf4",  // 싱그러운 클로버 오프화이트
        surface: "#ffffff",     // 깨끗한 라인마킹 화이트
        text: "#14532d"         // 눈이 편안한 다크 포레스트
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "넓은 잔디밭 위를 달리며 몸도 마음도 씩씩하고 건강하게 성장합니다",
        subtitle: "대한축구협회 공인 지도자 및 전직 프로선수 출신 코치진이 이끄는 주니어 전문 축구·체육 클럽으로, 신나게 땀 흘리며 기초 체력을 기르고 배려하는 협동 스포츠 정신을 배웁니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 축구 트라이얼 참가 신청",
          ctaLink: "#contact",
          features: [
            { text: "날씨 걱정 없이 연중 가동되는 친환경 무독성 최고급 실내 인조잔디 돔 구장 완비" },
            { text: "어린이 통학 버스 동승 보호자 탑승 의무화 안전 픽업 및 실시간 GPS 경로 알림" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스타즈 스포츠 아카데미",
        subtitle: "신체 성장판 자극부터 팀 전술 훈련까지 아이들을 위한 안전한 스포츠 코스입니다.",
        content_data: {
          items: [
            {
              title: "영유아 성장 축구 놀이반",
              description: "5세~7세 아이들을 위해 축구공과 친해지는 드리블 게임 놀이를 통해 균형 감각과 성장판을 자극합니다.",
              icon: "Smile"
            },
            {
              title: "초/중등 축구 엘리트 심화반",
              description: "정확한 인사이드 패스, 슈팅 파워 각도 제어, 기본기 트래핑과 포지션별 전술 축구를 연마합니다.",
              icon: "Award"
            },
            {
              title: "체육 인성 & 협동 스포츠",
              description: "축구뿐만 아니라 농구, 피구 등 단체 구기 종목을 통해 승패를 인정하고 동료를 배려하는 스포츠맨십을 함양합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "축구는 발로만 하는 운동이 아닌, 친구의 눈빛을 읽고 소통하는 단합의 지혜입니다",
        subtitle: "안전이 최우선입니다. 우리는 무리한 몸싸움 대신 재미있는 규칙 준수를 가르칩니다.",
        content_data: {
          description: "안녕하십니까. 주니어 스타즈 스포츠 클럽 감독입니다. 스마트폰과 컴퓨터 게임에 빠져 밖에서 전혀 뛰어놀지 않고 소극적으로 변해가는 자녀 때문에 걱정이 깊으셨죠? 스포츠는 성격의 소심함을 극복하고 팀워크의 가치를 배울 수 있는 가장 훌륭한 사회성 교육입니다. 우리는 안전 보호장구 100% 착용 의무화를 바탕으로, 아이들이 땀 흘리는 기쁨과 성취감을 맛보도록 성심껏 지도합니다.",
          stats: [
            { label: "정식 등록 아동 단원 수", value: "480명+" },
            { label: "전임 코치 및 차량 안전원", value: "8명 상주" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "주니어 훈련 경기장 및 전용 셔틀",
        subtitle: "어린이들의 안전과 쾌적함을 최우선으로 관리하는 스포츠 아카데미 인프라입니다.",
        content_data: {
          items: [
            { title: "친환경 실내 인조잔디 돔 구장", description: "쿠션감이 뛰어나 무릎 관절을 완벽 보호하고 미세먼지 필터 공조 시스템이 가동되는 쾌적 구장 전경", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80" },
            { title: "옐로우 안전 픽업 전용 버스", description: "친절한 정속 주행 및 정류장 하차 시 강사가 직접 부모님께 인계하는 노랑 셔틀 라인업", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "친환경 실외 미니 천연잔디 필드", description: "화창한 날 자연광을 받으며 단원들이 미니 리그전 친선 경기를 치르는 야외 축구장 잔디밭", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 축구 트라이얼 수업 예약",
        subtitle: "아이의 이름, 나이(학년), 축구 경험 유무, 희망 등원 요일을 기재하여 무료 체험 스케줄을 조율하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "무료 체험 수업 신청"
        }
      }
    ]
  },

  robotics_steam_lab: {
    templateId: "robotics_steam_lab",
    name: "메이커스 로봇 스팀 교육 센터",
    category: "Education",
    description: "테크니컬한 일렉트릭 블루와 네온 옐로우, 메탈 그레이 톤으로 미래 과학 및 로봇 코딩 설계의 즐거움을 극대화한 스팀 교육 전문 테마입니다.",
    image: "/templates/robotics_steam_lab.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#0284c7",     // 미래지향 터쿼이즈 사이언 블루
        secondary: "#fef08a",   // 호기심을 자극하는 테크 옐로우
        accent: "#f43f5e",      // 도전적인 메이커스 핑크
        background: "#0f172a",  // 묵직한 하이퍼 다크 네이비
        surface: "#1e293b",     // 세련된 회로판 차콜 슬레이트
        text: "#f8fafc"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "상상 속의 로봇을 내 손으로 직접 조립하고 코딩하여 움직여라",
        subtitle: "단순히 설명서 조립 장난감을 만드는 것을 넘어, 아두이노 회로 설계와 C언어 제어 코딩, 3D 프린터 모델링까지 입체적으로 마스터하여 미래의 지적 메이커스를 양성하는 과학 영재 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
          ctaText: "로봇 코딩 무료 체험 워크숍",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 공인 레고 에듀케이션(LEGO Education) 공식 커리큘럼 라이선스 획득 지부" },
            { text: "전국 청소년 로봇 경진대회 및 발명 대회 최우수 대상 다수 배출 검증 완료" }
          ]
        }
      },
      {
        section_type: "services",
        title: "STEAM 로보틱스 트랙",
        subtitle: "수학, 과학, 공학의 기초 지식을 물리 기어 조작을 통해 즐겁게 배우는 트랙입니다.",
        content_data: {
          items: [
            {
              title: "레고 스파이크 에센셜 로봇",
              description: "초등 저학년을 위해 모터와 스마트 센서, 드래그 앤 드롭 블록 코딩을 통해 유쾌하게 메커니즘을 배웁니다.",
              icon: "Smile"
            },
            {
              title: "아두이노 하드웨어 회로 설계",
              description: "중고등 학생들을 위해 실제 저항, 커패시터를 빵판에 꽂아 브레드보드 회로를 만들고 C++ 텍스트 코딩을 마스터합니다.",
              icon: "Cpu"
            },
            {
              title: "3D 프린팅 & 메이커스 모델링",
              description: "컴퓨터 그래픽 캐드로 나만의 로봇 부품 구조를 설계하고 3D 프린터로 실제 출력하는 하이테크 융합입니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "로봇 교육은 부품 조립 기술이 아닌, 내 머릿속 알고리즘을 물리 공간에 실현하는 창의력입니다",
        subtitle: "모든 코딩 오류는 좌절의 원인이 아니라, 로봇을 더 영리하게 진화시키는 최고의 단서입니다.",
        content_data: {
          description: "안녕하십니까. 메이커스 로봇 스팀 랩의 센터장입니다. 4차 산업혁명 시대라며 주입식 코딩 암기만 시키는 유행에 답답하셨죠? 로봇 공학은 모터의 회전축 각도, 기어비 비례 등 기하학적 물리 원리를 손끝으로 체득하며 즐겁게 깨닫는 최상의 융합 학문입니다. 우리는 에러가 났을 때 스스로 회로를 고쳐나가며 논리적 문제해결력과 지적 끈기를 지닌 진짜 미래 인재를 길러냅니다.",
          stats: [
            { label: "로봇 경진대회 수상 실적", value: "85건 돌파" },
            { label: "1인 단독 3D 프린터 보유", value: "8대 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 메이커스 론칭 작품 & 대회 수상작",
        subtitle: "원내 학생들이 직접 설계한 하이테크 창작 로봇들의 정교한 작동 포트폴리오입니다.",
        content_data: {
          items: [
            { title: "인공지능 자율주행 라인트레이서 카", description: "적외선 센서로 선을 인지하고 모터 속도를 PID 제어로 정밀 조작해 트랙을 돌파하는 AI 미니 자율주행 차", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린팅 스마트 스마트 스마트 팜 돔", description: "토양의 수분량을 감지하여 건조할 때만 워터 펌프를 자동으로 가동하는 온습도 센서 자동 스마트 온실 셋업", image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80" },
            { title: "전국 로봇대회 대상 수상 휴머노이드 로봇", description: "자이로 센서로 경사로에서도 넘어지지 않고 스스로 2족 보행 균형을 조율하는 고성능 특수 관절 로봇", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 메이커스 체험 워크숍 참가 신청",
        subtitle: "자녀의 나이(학년), 기존 피지컬 컴퓨팅(로봇/아두이노) 경험 유무 및 참가 일정을 선택해 예약을 신청하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "로봇 워크숍 무료 예약"
        }
      }
    ]
  },

  public_exam_pass: {
    templateId: "public_exam_pass",
    name: "패스파인더 공무원·자격증 고시학원",
    category: "Education",
    description: "신뢰감 넘치는 딥 오션 네이비와 집중력을 돋우는 스마트 엠버 브론즈 조합의 성인 공무원 및 공인중개사 국가 전문 고시학원 테마입니다.",
    image: "/templates/public_exam_pass.png",
    theme: {
      fontFamily: "Inter, Noto Sans KR, sans-serif",
      colors: {
        primary: "#0f172a",     // 딥 오션 슬레이트 차콜
        secondary: "#d97706",   // 성공을 견인하는 스마트 엠버 골드
        accent: "#2563eb",      // 합격을 보장하는 트러스트 블루
        background: "#f8fafc",  // 눈 피로를 차단하는 위생 슬레이트 화이트
        surface: "#ffffff",     // 정갈한 단독 독서실 책상 화이트
        text: "#1e293b"         // 가독성 높은 네이비 슬레이트 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "방대한 시험 범위, 핵심 기출 족보로 뚫어 최단기 합격을 보장한다",
        subtitle: "수강평 만족도 99.8% 일타 강사진의 암기 분량 70% 단축 요령과 스파르타식 강제 자습 감시 관리 시스템을 가동하여, 9급 공무원 및 공인중개사 자격시험을 압도적으로 단기에 격파합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 합격 모의 고사 다운로드",
          ctaLink: "#contact",
          features: [
            { text: "5개년 공무원 국가직/지방직 출제 경향 빈출 개념 100제 요약 핸드북 무상 배포" },
            { text: "아침 출석 체크부터 스마트폰 제출 의무화, 졸음 감시 강제 독서실 시스템 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "패스파인더 합격 트랙",
        subtitle: "흔들림 없이 합격 원점수에 안전하게 도달하도록 돕는 체계적인 고시 강좌입니다.",
        content_data: {
          items: [
            {
              title: "9급/7급 행정직 공무원 합격반",
              description: "국어, 영어, 한국사, 행정법, 행정학의 출제 핵심 위주 반복 회독 공식을 체화하여 고득점을 견인합니다.",
              icon: "Award"
            },
            {
              title: "공인중개사 1차/2차 원패스",
              description: "민법, 부동산학개론의 까다로운 판례 암기법과 공법 요점 정리를 대입하여 직장인도 1년 만에 동차 합격시킵니다.",
              icon: "Compass"
            },
            {
              title: "스파르타식 강제 관리 독서실",
              description: "교시별 화이트 노이즈 차음 벨 시스템과 멘토 강사의 1:1 오답 문진 피드백으로 집중력을 최고조로 통제합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "고시 공부는 장기전이 아닌, 시간의 밀도를 극한으로 끌어올리는 몰입의 단기 승부입니다",
        subtitle: "양치기 문제 풀이 전에, 핵심 기출 지문의 Ox 오답 판독력을 0.5초 만에 끄집어내야 합니다.",
        content_data: {
          description: "안녕하십니까. 패스파인더 고시 아카데미 원장입니다. 수많은 수험생들이 노량진에서 수년간 아까운 청춘과 비용을 낭비하는 안타까운 굴레에 갇혀 있습니다. 방대한 교재를 처음부터 끝까지 다 외우려 하기 때문입니다. 시험에 나오는 것은 오직 30%의 빈출 족보뿐입니다. 우리는 덜어내고 또 덜어내어, 합격 커트라인을 가장 영리하게 뚫는 기출 Ox 회독 솔루션을 제시합니다.",
          stats: [
            { label: "최단기 수험 기간 합격 비율", value: "평균 8.4개월" },
            { label: "독점 엠버 기출 모의고사", value: "35회 분량" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "합격 수기 명예의 전당 & 스터디 존",
        subtitle: "패스파인더의 무서운 강제 통제와 기출 공식으로 마침내 합격증을 거머쥔 수험생들의 리얼 기록입니다.",
        content_data: {
          items: [
            { title: "비전공자 직장인의 공인중개사 동차 합격 수기", description: "평일 3시간, 주말 10시간 스파르타 인터넷 강의 플래너대로 수행하여 1년 만에 고득점 합격을 이뤄낸 사례", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80" },
            { title: "행정법 만점으로 9급 지방직 공무원 수석 합격", description: "기출 지문 5회독 Ox 오답 분석법으로 시험 고사장에서 행정법 과목을 7분 만에 풀고 수석 영예를 입증한 수기", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80" },
            { title: "원내 백색소음 집중 독서실 전경", description: "모든 칸막이 책상에 무선 고속 충전 포트와 자율신경계 긴장 이완 전용 램프가 빌트인된 쾌적한 전용 독서실 시설", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "합격 패키지 무료 모의고사 신청",
        subtitle: "준비하시는 직렬 및 시험 종류, 수험 기간 이력 유무를 적어 당일 합격 정밀 자문 전화 예약을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "기출 요약북 받기"
        }
      }
    ]
  },

  calligraphy_craft: {
    templateId: "calligraphy_craft",
    name: "연서 서예 & 전통 공방 아카데미",
    category: "Education",
    description: "전통 한지의 숨결이 느껴지는 먹색 차콜과 기품 있는 대나무 잎 세이지 그린 배합으로 글씨의 깊은 미학과 사색을 전하는 공방 테마입니다.",
    image: "/templates/calligraphy_craft.png",
    theme: {
      fontFamily: "Noto Serif KR, East Sea Dokdo, serif",
      colors: {
        primary: "#2d312e",     // 벼루에 갓 간 묵직한 먹 잉크색
        secondary: "#e2e8e5",   // 맑고 정갈한 대나무 세이지 그린
        accent: "#7c2d12",      // 고풍스러운 붉은 낙관 인장 레드
        background: "#f6f3ed",  // 한지 물결 웜 베이지 백그라운드
        surface: "#ffffff",     // 새하얀 서예 전용 화선지
        text: "#1c1e1d"         // 선명한 먹빛 블랙 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "붓끝에 마음을 싣고, 화선지 위로 번져나가는 묵향의 치유",
        subtitle: "컴퓨터 타이핑 글씨에 무뎌진 손끝의 세포를 깨우고, 벼루에 묵을 갈며 깊은 내면의 침묵 속에서 나만의 단단한 한글 서예와 현대 캘리그라피 서체를 빚어내는 아날로그 예술 공방입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "1일 붓글씨 사색 레슨 신청",
          ctaLink: "#contact",
          features: [
            { text: "정통 서예 국전 초대 작가 및 캘리그라피 서체 개발자 1:1 맞춤형 피드백 레슨" },
            { text: "천연 대나무 붓, 최고급 벼루, 아날로그 수제 먹 등 서예 도구 무상 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "서예 공방 강좌 요강",
        subtitle: "붓을 쥐는 완력 조절부터 한지 번짐 기법까지 차분하게 연마하는 정통 예술 교육입니다.",
        content_data: {
          items: [
            {
              title: "전통 서예 & 문인화 정규반",
              description: "한글 궁체, 한문 행서의 필법 뼈대를 튼튼히 다지고 대나무, 매화 그림을 그리는 전통 강좌입니다.",
              icon: "Palette"
            },
            {
              title: "현대 캘리그라피 & 손글씨",
              description: "수채화 붓펜과 만년필을 활용해 인테리어 엽서, 캘리 로고 디자인에 즉각 활용 가능한 한글 서체를 만듭니다.",
              icon: "PenTool"
            },
            {
              title: "아날로그 전통 한지 수공예",
              description: "한지에 붓글씨를 담아 한지 등(燈), 전통 부채, 낙관 도장을 수제로 새겨 완성하는 융합 창작입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "속도가 미덕이 된 세상에서, 가장 느리게 벼루를 갈며 마음의 중심을 바로 세웁니다",
        subtitle: "화선지 위에 떨어지는 먹 한 방울은 내 내면의 복잡한 감정을 정화하는 눈물과 같습니다.",
        content_data: {
          description: "반갑습니다. 연서 서예 공방의 수석 훈장입니다. 매일 키보드를 두드리고 스마트폰으로 활자를 치는 동안, 사각거리는 손글씨의 아날로그 쾌감을 잊은 채 지내오진 않으셨나요? 붓글씨는 온몸의 척추를 바로 세우고 아랫배에 단단한 호흡을 가득 실어 붓끝으로 기운을 분출하는 고귀한 마음 운동입니다. 묵향 가득한 서실에서 나 자신에게 온전히 몰입하는 평온함을 만나십시오.",
          stats: [
            { label: "공방 누적 정규 수강생", value: "1,200명+" },
            { label: "원내 보유 전통 명품 벼루", value: "35세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 묵향 창작 갤러리",
        subtitle: "수강생들이 벼루를 갈며 마음의 중심을 담아 화선지에 빚어낸 실제 아름다운 글귀 서예들입니다.",
        content_data: {
          items: [
            { title: "한글 궁체 흘림서 서예 액자", description: "화선지에 붓끝의 강약 텐션을 칼같이 맞추어 한글 궁체의 우아한 흘림 미학을 훌륭하게 축조한 장원작", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80" },
            { title: "현대 캘리그라피 캔버스 조명등", description: "따뜻한 한지 조명 표면에 위로가 되는 한글 시 구절을 붓펜으로 정밀하게 담아내어 완성한 공예품", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "사군자 대나무 묵죽 묵화 족자", description: "화선지 번짐 농담 조절만으로 거친 대나무 마디의 굳건한 기백을 시원하게 그려낸 수강 6개월 차 마스터피스", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1일 서예 사색 클래스 예약 의뢰",
        subtitle: "희망 강좌 장르(전통서예/캘리그라피/도장새김), 서예 붓글씨 유무 및 동반 참가 인원을 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "서실 사색 레슨 예약"
        }
      }
    ]
  },

  special_education_center: {
    templateId: "special_education_center",
    name: "행복한 발달·특수교육 센터",
    category: "Education",
    description: "아이들에게 정서적 안정감을 주는 파스텔 스카이 그린과 온화한 허니 골드 배합으로 감각통합 치료 및 인지 언어 교정 신뢰도를 높인 특수 교육 테마입니다.",
    image: "/templates/special_education_center.png",
    theme: {
      fontFamily: "Noto Serif KR, Nanum Gothic, sans-serif",
      colors: {
        primary: "#065f46",     // 심리 안정을 돕는 숲속 스카이 에메랄드
        secondary: "#fef3c7",   // 온화한 햇살 살구색
        accent: "#d97706",      // 자존감을 세우는 앰버 골드
        background: "#f7fbf9",  // 무자극 오가닉 크림 오프화이트
        surface: "#ffffff",     // 둥글고 모서리 없는 새하얀 매트
        text: "#064e3b"         // 편안하게 가독성 높은 다크 포레스트
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "아이의 성장은 속도가 아닌 방향입니다, 손을 잡고 함께 걷습니다",
        subtitle: "국가공인 언어재활사, 감각통합치료사, 놀이치료 전문가 분과 협진을 바탕으로, 느린 발달 아동이나 자폐 스펙트럼, ADHD를 겪는 소중한 자녀의 언어 장벽과 정서 과긴장을 순하게 완화합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "아동 발달 정밀 자문 예약",
          ctaLink: "#contact",
          features: [
            { text: "보건복지부 발달재활바우처 공식 지정 기관 및 안심 아동 보호 방음 차음 시스템 가동" },
            { text: "감각통합 치료를 위해 100% 매주 친환경 피톤치드 살균 스팀 소독 관리되는 전문 교구실 완비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "희망 아동 발달 센터",
        subtitle: "아동의 인지 기능과 감각 자극 수용력을 체계적으로 보완하는 맞춤 치료입니다.",
        content_data: {
          items: [
            {
              title: "1:1 언어 재활 & 언어 치료",
              description: "단어의 정확한 조음 조절 요령부터 사회적 상황 맥락에 맞는 위트 있는 대화 소통 기법을 연마합니다.",
              icon: "Smile"
            },
            {
              title: "감각 통합 (Sensory Integration)",
              description: "전정감각, 고유수용성 감각을 골고루 자극하여 몸의 균형을 유지하고 뇌의 신경망 조율을 발달시킵니다.",
              icon: "Activity"
            },
            {
              title: "정서 놀이 및 모래치료",
              description: "놀이 과정을 통해 억압된 우울감과 과잉 충동성을 자연스럽게 털어내고 또래 소통을 유도합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상에 틀린 아이는 없습니다. 단지 저마다 세상을 배우는 속도와 통로가 다를 뿐입니다",
        subtitle: "모든 놀이와 치료 후에는 어머니와의 15분 심층 부모 교육 피드백이 성실히 수행됩니다.",
        content_data: {
          description: "안녕하십니까. 행복한 발달 특수교육 센터의 대표원장입니다. 또래보다 유독 말이 늦되거나 잦은 충동성으로 단체 생활에서 겉돌아 홀로 남몰래 눈물 흘리며 자책하던 어머니들의 아픈 심정을 잘 알고 있습니다. 발달 지연은 부모의 양육 잘못이 아니라, 뇌 신경계의 섬세한 감각 통합 자극이 필요하다는 신호일 뿐입니다. 우리는 단 한 명의 아동도 낙오 없이 자아의 가능성을 끝까지 믿고 따뜻하게 동행하겠습니다.",
          stats: [
            { label: "소속 공인 치료사 규모", value: "12명 협진" },
            { label: "누적 아동 정서 개선률", value: "91.8%" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아늑한 감각통합실 & 언어치료실 전경",
        subtitle: "아이들이 신나게 뛰어놀면서 치료를 체득할 수 있도록 철저하게 안전 설계된 아뜰리에 시설입니다.",
        content_data: {
          items: [
            { title: "안전 그네와 트램펄린 감각통합실", description: "모든 기둥에 초고밀도 쿠션 매트를 매립하고 스윙 그네가 완비된 최신 감각통합 치료 전용 홀", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
            { title: "방음 설계 완료된 1인 언어치료룸", description: "외부 소음이 완벽 차단되어 담임 언어재활사와 카드 맞추기를 통해 소리에 오롯이 몰입하는 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "가족 심리 위로 테라스 라운지", description: "대기 시간 동안 부모님들이 마음 따뜻한 커피를 마시며 발달 서적 교안을 읽는 고급 북 라운지", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "발달 바우처 적용 및 초진 상담 신청",
        subtitle: "아동의 대략적인 연령, 현재 가장 큰 고민 부위(조음 장애, 과잉 충동성, 학습 지연)를 비공개로 적어 제출하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아동 발달 자문 예약"
        }
      }
    ]
  },

  senior_digital_school: {
    templateId: "senior_digital_school",
    name: "은빛 스마트 라이프 & 디지털 배움터",
    category: "Education",
    description: "시인성이 탁월한 클래식 다크 네이비와 눈의 피로를 최소화하는 소프트 엠버 오렌지 조화로 시니어 어르신들의 스마트폰 및 키오스크 배움을 돕는 디지털 교실 테마입니다.",
    image: "/templates/senior_digital_school.png",
    theme: {
      fontFamily: "Noto Sans KR, Malgun Gothic, sans-serif",
      colors: {
        primary: "#14532d",     // 따뜻한 은빛 포레스트 그린
        secondary: "#fef3c7",   // 눈이 편안한 아늑한 크림 옐로우
        accent: "#ea580c",      // 시인성이 가장 높은 보행 유도 주황
        background: "#fafaf6",  // 무자극 오가닉 연황토 백그라운드
        surface: "#ffffff",     // 정갈하고 깨끗한 화이트보드
        text: "#1c1917"         // 고대비 극대화 잉크젯 차콜 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "스마트폰 카카오톡 사진 전송부터 기차표 예매까지 꼼꼼히 가르쳐 드립니다",
        subtitle: "자식에게 매번 묻기도 눈치 보였던 복잡한 스마트폰 사용법과 은행 뱅킹 이체, 병원 진료 예약 키오스크 주문 요령을 어르신들의 눈높이에 맞춰 큰 글씨로 천천히 반복하여 완벽 전수하는 실버 디지털 교육원입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 키오스크 체험 교실 신청",
          ctaLink: "#contact",
          features: [
            { text: "국가 디지털 소외 계층 지원 정보 교육 사업 공식 우수 지정 지부 획득" },
            { text: "전담 대학생 서포터즈들이 어르신 1인당 옆에 1명씩 달라붙어 반복 친절 코칭" }
          ]
        }
      },
      {
        section_type: "services",
        title: "은빛 스마트폰 클래스",
        subtitle: "어르신들의 스마트한 디지털 노년과 활기찬 소통을 돕는 눈높이 과정입니다.",
        content_data: {
          items: [
            {
              title: "카카오톡 & 유튜브 정복반",
              description: "친구에게 예쁜 꽃잎 사진 보내기, 유튜브 돋보기로 트로트 노래 검색하는 비법을 큰 그림 카드로 배웁니다.",
              icon: "Smile"
            },
            {
              title: "기차표 예매 & 스마트 뱅킹",
              description: "명절에 역전에서 줄 서지 않고 스마트폰으로 손쉽게 고속철도 코레일을 예매하고 자녀에게 용돈 송금하기를 마스터합니다.",
              icon: "Compass"
            },
            {
              title: "패스트푸드 키오스크 체험 훈련",
              description: "햄버거 가게, 병원의 기계 화면을 만지며 터치하는 방법과 신용카드 투입 결제 요령을 반복 실습합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "나이가 든다는 것은 배움을 멈추는 것이 아닌, 새로운 문명을 가장 품격 있게 배우는 과정입니다",
        subtitle: "눈이 침침하셔도 괜찮습니다. 폰 글씨 크기 3단계 키우기 서비스부터 무료로 적용해 드립니다.",
        content_data: {
          description: "안녕하십니까. 은빛 스마트 배움터의 수석 훈장입니다. 매번 자녀나 손주들에게 스마트폰 물어보다가 '아까 가르쳐 줬는데 왜 또 모르냐'며 핀잔 섞인 목소리에 서러우셨던 적이 있으시지요? 배우면 누구나 할 수 있습니다. 단지 기계 화면의 글자가 너무 작고 용어가 낯설었을 뿐입니다. 우리는 어르신들이 10번, 100번을 똑같이 물어보셔도 세상에서 가장 친절하게 웃으며 끝까지 안내해 드리겠습니다.",
          stats: [
            { label: "완강 졸업 어르신 수", value: "1,500명 돌파" },
            { label: "원내 실물 키오스크 연습 장비", value: "6대 보유" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "즐거운 어르신 스마트폰 수업 현장",
        subtitle: "스스로 기차표 예매를 성공하고 환한 보름달 미소를 지으시는 자랑스러운 수강생 어르신들의 전경입니다.",
        content_data: {
          items: [
            { title: "햄버거 키오스크 실물 연습 존", description: "맥도날드 기계와 똑같이 생긴 원내 전용 체험 기기로 카드를 넣고 음료수를 주문해보는 리얼 실습실", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" },
            { title: "1:1 눈높이 스마트폰 과외실", description: "대학생 강사가 어르신의 손가락 터치 압력을 직접 봐주며 카카오톡 프로필 바꾸기를 알려주는 다정다감 교실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
            { title: "수강 완료 어르신들 우수 소감회", description: "디지털 문맹을 탈출하여 직접 스마트폰으로 손글씨 감사 편지를 작성해 빔 프로젝터로 발표하는 졸업식 현장", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "은빛 교실 입학 및 수강 일정 문의",
        subtitle: "배우고 싶으신 스마트폰 기능 또는 자녀분이 부모님을 대리하여 입학을 신청하시는 경우 내용을 적어 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "친절 상담 전화 신청"
        }
      }
    ]
  }
};
