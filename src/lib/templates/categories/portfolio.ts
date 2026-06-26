import { TemplateConfig } from "../registry";

export const PORTFOLIO_TEMPLATES: Record<string, TemplateConfig> = {
  portfolio_minimal: {
    templateId: "portfolio_minimal",
    name: "미니멀 포트폴리오",
    category: "Portfolio",
    description: "흑백 대비와 갤러리 그리드가 강조된 크리에이터 및 작가 전용 템플릿",
    image: "/templates/portfolio_minimal.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#111827",     // Charcoal Black
        secondary: "#4b5563",   // Gray 600
        accent: "#000000",      // Pure Black
        background: "#fafafa",  // Light White
        surface: "#ffffff",     // Pure White
        text: "#111827"         // Black
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "디자인과 기능의 본질을 연구합니다",
        subtitle: "불필요한 요소를 걷어내고 사용자 경험을 극대화하는 미니멀리스트 크리에이터",
        content_data: {
          backgroundImage: "",
          ctaText: "작품 구경하기",
          ctaLink: "#services",
          features: [
            { text: "UI/UX & 브랜드 디자인" },
            { text: "인터랙션 디자인 엔지니어링" },
            { text: "디지털 아키텍처 자문" }
          ]
        }
      },
      {
        section_type: "services",
        title: "나의 전문 분야",
        subtitle: "단순함 속에 깊이를 더하는 크리에이티브 워크 플로우",
        content_data: {
          items: [
            {
              title: "웹 인터랙션 디자인",
              description: "사용자가 몰입할 수 있도록 자연스러운 스크롤 트랜지션 및 모션 구현",
              icon: "MousePointer"
            },
            {
              title: "브랜드 아이덴티티",
              description: "기업의 브랜드 스토리와 비전을 일관성 있는 로고와 컬러 시스템으로 정교화",
              icon: "Compass"
            },
            {
              title: "디지털 제품 엔지니어링",
              description: "Next.js 및 Tailwind 기반의 빠른 반응형 고해상도 웹 서비스 구현",
              icon: "Code2"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "선택된 프로젝트",
        subtitle: "사용자 중심의 경험을 최우선으로 제작한 대표작 목록",
        content_data: {
          items: [
            {
              title: "핀테크 대시보드 리디자인",
              description: "UX 분석을 통해 결제 완료율 24% 개선",
              image: ""
            },
            {
              title: "친환경 브랜드 패키지 디자인",
              description: "자연 분해 재질을 활용한 미니멀 에코 팩 패키징",
              image: ""
            },
            {
              title: "건축 회사 매거진 웹사이트",
              description: "뷰 트랜지션 API를 사용한 고품격 온라인 화보집 개발",
              image: ""
            }
          ]
        }
      },
      {
        section_type: "contact",
        title: "작업 의뢰 및 협업 제안",
        subtitle: "새로운 가치를 더할 크리에이티브 파트너를 찾고 계시다면 편하게 연락해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "협업 메시지 보내기"
        }
      }
    ]
  },
  uiux_designer_neon: {
    templateId: "uiux_designer_neon",
    name: "네온 테크 UI/UX 디자이너",
    category: "Portfolio",
    description: "다이내믹하고 트렌디한 디지털 프로덕트 디자이너를 위한 템플릿입니다. 딥 차콜과 퍼플 백그라운드 위에 형광 라임 그린 포인트 컬러를 매칭하여 미래지향적이고 감각적인 인터페이스를 연출합니다.",
    image: "/templates/uiux_designer_neon.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#a3e635",     // 네온 라임 그린
        secondary: "#22d3ee",   // 테크 사이언 민트
        accent: "#a855f7",      // 일렉트릭 퍼플
        background: "#0f111a",  // 사이버 딥 차콜
        surface: "#1e2030",     // 세련된 슬레이트 퍼플 카드
        text: "#f8fafc"         // 시인성 높은 화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "사용자의 경험을 혁신하는 디지털 프로덕트 디자인",
        subtitle: "미래지향적인 인터랙션과 정교한 데이터 설계를 바탕으로 비즈니스를 확장하고 사용자의 마음에 닿는 최상의 UI/UX 솔루션을 구축합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프로젝트 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "사용자 중심의 인터랙티브 프로토타이핑 설계" },
            { text: "복잡한 대시보드를 명쾌하게 풀어내는 디자인 시스템" }
          ]
        }
      },
      {
        section_type: "services",
        title: "전문 디자인 디자인 솔루션",
        subtitle: "아이디어 스케치부터 프로덕트 출시까지 제공하는 전문 크리에이티브 서비스 영역입니다.",
        content_data: {
          items: [
            {
              title: "UI/UX & GUI 프로덕트 디자인",
              description: "모바일 앱과 반응형 웹 환경을 아우르는 최신 트렌드의 인터페이스 비주얼을 기획하고 사용성을 극대화하는 설계를 제공합니다.",
              icon: "MousePointer"
            },
            {
              title: "고도화된 모듈형 디자인 시스템",
              description: "개발팀과의 완벽한 협업 및 프로덕트의 일관된 스케일을 위해 피그마 기반의 컴포넌트 유기적 시스템 아키텍처를 빌드합니다.",
              icon: "Layers"
            },
            {
              title: "브랜드 아이덴티티 및 모션 가이드",
              description: "브랜드가 추구하는 핵심 가치를 디지털 화면 속 마이크로 인터랙션과 세련된 그래픽 언어로 전환하여 전달력을 높입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "엄선된 크리에이티브 프로젝트",
        subtitle: "형태와 기능의 완벽한 조화를 추구한 대표 프로덕트 쇼케이스입니다.",
        content_data: {
          items: [
            { title: "차세대 핀테크 자산관리 모바일 앱", description: "복잡한 금융 지표를 위젯 중심으로 간소화한 사용자 중심 UI/UX 프로젝트", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80" },
            { title: "AI 기반의 스마트 협업 툴 대시보드", description: "모듈형 레이아웃과 다크모드에 최적화된 엔터프라이즈 SaaS 디자인 시스템", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 스트리밍 플랫폼 커스텀 UI", description: "개인화 추천 알고리즘과 몰입형 카드 뷰 인터랙션을 극대화한 비주얼 룩앤필", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "비즈니스를 성장시키는 프로덕트 디렉터",
        subtitle: "논리적인 가설 검증과 시각적 영감을 통해 사용자 경험을 혁신합니다.",
        content_data: {
          description: "안녕하세요. 디지털 프로덕트의 핵심 본질을 꿰뚫고 이를 감각적인 비주얼로 풀어내는 UI/UX 디자이너 네온입니다. 글로벌 IT 스타트업과 에이전시를 거치며 수많은 서비스의 0부터 1까지의 빌딩 과정을 주도했습니다. 화려하기만 한 디자인을 넘어 데이터가 증명하는 심리스한 인터랙션과 사용자의 행동 흐름을 유도하는 디자인 철학을 고수합니다.",
          stats: [
            { label: "런칭 성공 프로덕트", value: "24개+" },
            { label: "디자인 시스템 컨트리뷰션", value: "10,000+ Components" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "혁신적인 프로젝트를 시작해 보세요",
        subtitle: "새로운 비즈니스 아이디어를 멋진 제품으로 구현할 준비가 되셨다면 언제든 편하게 메시지를 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "프로젝트 의뢰하기"
        }
      }
    ]
  },

  photographer_aesthetic_sand: {
    templateId: "photographer_aesthetic_sand",
    name: "아날로그 샌드 포토그래퍼",
    category: "Portfolio",
    description: "필름 사진작가와 패션 비주얼 아티스트를 위한 프리미엄 아카이브 템플릿입니다. 따뜻하고 부드러운 모래 빛깔의 샌드 베이지 배경과 여백의 미를 극대화한 우아한 명조 계열 레이아웃이 돋보입니다.",
    image: "/templates/photographer_aesthetic_sand.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#b45309",     // 소프트 테라코타 클레이 오렌지
        secondary: "#d4a373",   // 내추럴 샌드 골드
        accent: "#78350f",      // 깊이감 있는 딥 번트 앰버
        background: "#fdfbf7",  // 포근하고 바랜 느낌의 모래빛 샌드 베이지
        surface: "#f5ebe0",     // 은은한 오가닉 웜 스킨 톤
        text: "#1c1917"         // 타자기 먹색을 닮은 스톤 다크 브라운
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "빛과 그림자가 머무는 순간의 노스탤지어",
        subtitle: "인위적인 연출을 배제하고 35mm 필름 카메라의 텍스처와 자연광이 만들어내는 찰나의 순간을 우아한 비주얼 아카이브로 온전히 전시합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "갤러리 둘러보기",
          ctaLink: "#portfolio",
          features: [
            { text: "아날로그 필름 감성의 패션 룩북 및 브랜드 캠페인 샷" },
            { text: "자연의 숭고함과 일상의 온기를 포착한 스트리트 포토그래피" }
          ]
        }
      },
      {
        section_type: "services",
        title: "비주얼 비주얼 비즈니스",
        subtitle: "오랜 시간 축적된 아날로그 감각으로 브랜드와 개인의 가치를 가장 아름다운 정지화면으로 큐레이션합니다.",
        content_data: {
          items: [
            {
              title: "에디토리얼 & 패션 룩북 촬영",
              description: "브랜드가 지닌 고유한 스토리와 아방가르드한 무드를 정교한 자연광 조율과 필름 카메라로 포착하여 독창적인 매거진 컷을 연출합니다.",
              icon: "Camera"
            },
            {
              title: "미술 전시 및 로케이션 저널",
              description: "공간이 가진 역사와 텍스처, 계절의 변화에 따른 빛의 각도를 치밀하게 분석하여 영속적인 예술 아카이브 사진을 제작합니다.",
              icon: "Compass"
            },
            {
              title: "비주얼 아트 디렉션 컨설팅",
              description: "단순한 셔터 클릭을 넘어 프로젝트 전반의 무드 보드 기획, 컬러 그레이딩 정체성 및 비주얼 브랜딩 방향성을 제시합니다.",
              icon: "Paintbrush"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "빛바랜 기억의 조각들",
        subtitle: "시간이 흐를수록 깊이를 더해가는 오리지널 비주얼 에디션입니다.",
        content_data: {
          items: [
            { title: "고요한 앙상블: 가을의 룩북", description: "자연 가죽과 리넨의 텍스처를 아날로그 필름 고유의 입자감으로 녹여낸 브랜드 화보", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80" },
            { title: "침묵하는 도시의 잔상들", description: "파리와 교토의 새벽녘 골목길에서 포착한 빛과 그림자의 조형적 미학", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" },
            { title: "기억의 유영: 인물 초상", description: "스튜디오 자연 채광만을 활용하여 인물의 내면과 깊은 서사를 끌어낸 포트레이트", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "빛의 궤적을 쫓는 아날로그 아티스트",
        subtitle: "기교보다는 진정성을, 화려함보다는 지워지지 않을 낭만을 렌즈에 담습니다.",
        content_data: {
          description: "안녕하세요. 세피아 톤의 따스함과 필름의 굵은 입자감을 사랑하는 시각 예술가 샌드입니다. 찰나의 순간이 영원이 되는 사진의 매력에 이끌려 10년이 넘는 시간 동안 전 세계의 고요한 풍경과 인물의 내면을 포착해 왔습니다. 유행에 맞춰 빠르게 소모되는 디지털 그래픽 속에서, 두고두고 꺼내 보아도 가슴이 먹먹해지는 단 한 장의 사진을 빚어내기 위해 셔터를 누릅니다.",
          stats: [
            { label: "단독 사진 전시회", value: "6회 개최" },
            { label: "협업 글로벌 매거진", value: "15+ 파트너" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "새로운 영감의 셔터를 누를 시간",
        subtitle: "동일한 취향의 시각적 프로젝트나 룩북 콜라보레이션, 프린트 소장 문의는 아래 창을 통해 편안히 건네주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "아티스트와 연결하기"
        }
      }
    ]
  },

  architect_mono_bold: {
    templateId: "architect_mono_bold",
    name: "볼드 모노톤 공간 아키텍트",
    category: "Portfolio",
    description: "프리랜서 건축가와 인테리어 디자인 디렉터를 위한 볼드 미니멀리즘 템플릿입니다. 강렬한 매트 블랙과 스톤 그레이의 대비 속에 크림슨 레드 포인트를 주어 단단한 직선의 미학을 완성합니다.",
    image: "/templates/architect_mono_bold.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#dc2626",     // 시선을 사로잡는 크림슨 레드
        secondary: "#4b5563",   // 매트한 묵직한 스톤 그레이
        accent: "#111827",      // 구조적 중심을 잡는 매트 블랙
        background: "#f9fafb",  // 콘크리트 벽면을 연상시키는 정갈한 연그레이
        surface: "#ffffff",     // 명확하게 구획을 나눠주는 화이트 컨테이너
        text: "#111827"         // 선명하고 강인한 잉크 블랙
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "비움으로 완성되는 선과 구조적 공간 미학",
        subtitle: "단순한 구조물 구축을 넘어, 콘크리트와 스틸 그리고 빛의 투과율을 정교하게 계산하여 도시의 스카이라인을 바꾸는 미니멀 라이프스페이스를 설계합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "블루프린트 감상",
          ctaLink: "#portfolio",
          features: [
            { text: "구조적 안정성과 극도의 미니멀리즘이 조화된 모던 건축" },
            { text: "빛의 동선을 추적하여 설계된 하이엔드 주거 인테리어" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스페이스 디자인 엔지니어링",
        subtitle: "선과 가치가 살아 숨 쉬는 공간을 창조하기 위한 프로페셔널 아키텍처 아웃라인입니다.",
        content_data: {
          items: [
            {
              title: "현대 건축 설계 및 감리",
              description: "도시 법규와 지형적 특성을 날카롭게 분석하고, 구조적 미학을 극대화한 독창적인 상업 시설 및 단독 주택 디자인 설계를 제공합니다.",
              icon: "Layers"
            },
            {
              title: "하이엔드 인테리어 디렉션",
              description: "모노톤의 자재 큐레이션, 히든 도어와 라인 조명의 완벽한 마감을 통해 가구와 공간이 일체화되는 미니멀 홈 스타일링을 완성합니다.",
              icon: "Paintbrush"
            },
            {
              title: "공간 브랜딩 및 프리비즈",
              description: "3D 그래픽 시뮬레이션과 VR 워크스루 기술을 도입하여 시공 전 건물의 외형과 조도를 정밀하게 검증하는 비주얼 컨설팅을 진행합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "선과 공간의 오브제",
        subtitle: "모노톤의 비움 속에서 탄생한 마스터피스 건축 프로젝트 아카이브입니다.",
        content_data: {
          items: [
            { title: "더 노드(The Node): 노출콘크리트 갤러리", description: "빛의 기하학적 궤적을 실내로 유입하여 정적 몰입감을 유도한 복합 문화 공간 설계", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "미니멀리스트 펜트하우스 인테리어", description: "불필요한 몰딩과 장식을 제거하고 천연 대리석과 매트 블랙 스틸로 마감한 주거 프로젝트", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" },
            { title: "모노리스(Monolith) 오피스 타워 빌딩", description: "직선의 수직성을 강조하여 도심 속에서 압도적인 존재감을 뿜어내는 빌딩 전면 디자인", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "도시에 직선을 새기는 공간 아키텍트",
        subtitle: "가장 단순한 형태가 가장 강력한 기능과 메시지를 담아낸다고 확신합니다.",
        content_data: {
          description: "안녕하세요. 볼드한 모노톤의 미학을 바탕으로 공간의 본질적인 뼈대를 설계하는 프리랜서 건축가이자 인테리어 디렉터입니다. 저는 장식적인 화려함에 가려진 공간의 숨은 가치를 복원하는 일에 몰두하고 있습니다. 재료 본연의 질감을 살린 매트 블랙과 콘크리트 텍스처의 정교한 매칭, 완벽한 수평과 수직의 그리드를 통해 시대를 초월하는 모던한 공간을 지향합니다.",
          stats: [
            { label: "총 설계 시공 면적", value: "45,000㎡+" },
            { label: "국내외 건축상 수상", value: "4회 수상" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "이상적인 공간의 첫 설계도를 그리다",
        subtitle: "당신의 가치관과 라이프스타일이 반영된 프리미엄 주거 및 상업 공간 시공을 원하신다면 브리프를 전달해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "건축 상담 신청하기"
        }
      }
    ]
  },

  developer_cyber_cyan: {
    templateId: "developer_cyber_cyan",
    name: "사이버 펑크 풀스택 개발자",
    category: "Portfolio",
    description: "크리에이티브 코더와 프론트엔드 엔지니어를 위한 하이테크 터미널 무드의 템플릿입니다. 딥 인디고 블랙 바탕에 형광 시안 블루와 보랏빛 네온 액센트를 주어 개발자 정체성을 극대화합니다.",
    image: "/templates/developer_cyber_cyan.png",
    theme: {
      fontFamily: "Fira Code, SF Mono, monospace",
      colors: {
        primary: "#22d3ee",     // 형광 시안 블루
        secondary: "#c084fc",   // 보랏빛 네온 바이올렛
        accent: "#f43f5e",      // 경고창처럼 강렬한 네온 핑크
        background: "#030712",  // 터미널 콘솔 무드의 딥 인디고 블랙
        surface: "#111827",     // 코드 블록을 닮은 다크 그레이 표면
        text: "#38bdf8"         // 시안 블루 계열의 라이트 블루 폰트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "코드를 통해 상상을 현실로 빌드하는 풀스택 엔지니어",
        subtitle: "단순한 기능 구현을 넘어 초단위 인터랙션 최적화, 확장 가능한 클라우드 인프라 설계, 오픈소스 기여를 통해 더 나은 웹 표준 인터페이스를 구축합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80",
          ctaText: "클론 리포지토리 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "Next.js 인프라 아키텍처 및 런타임 성능 극한 튜닝" },
            { text: "실시간 분산 시스템 웹소켓 서버 및 데이터 파이프라인" }
          ]
        }
      },
      {
        section_type: "services",
        title: "엔지니어링 테크 스택",
        subtitle: "가장 현대적이고 안정적인 오픈소스 기술 파이프라인을 다룹니다.",
        content_data: {
          items: [
            {
              title: "인터랙티브 프론트엔드 빌딩",
              description: "React, Next.js, Three.js 기반의 고성능 3D 웹 렌더링 및 하드웨어 가속을 활용한 화려하면서도 부드러운 웹 인터페이스를 구현합니다.",
              icon: "Code2"
            },
            {
              title: "고성능 풀스택 아키텍처",
              description: "Node.js, Go 언어를 활용한 고가용성 API 게이트웨이 및 분산 캐시 시스템을 구축하여 병목 현상 없는 서버 환경을 책임집니다.",
              icon: "Terminal"
            },
            {
              title: "데브옵스 인프라 자동화",
              description: "Docker, Kubernetes, AWS 기반의 완전 자동화된 CI/CD 파이프라인을 구축하여 무중단 클라우드 배포 시스템을 완성합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "프로덕션 레벨 아티팩트",
        subtitle: "직접 설계하고 오픈소스 진영에 기여한 핵심 엔지니어링 프로젝트입니다.",
        content_data: {
          items: [
            { title: "초고속 미디어 스트리밍 대시보드", description: "웹RTC 기반의 실시간 다원 스트리밍 및 초당 10만 개 패킷 데이터 시각화 웹 애플리케이션", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" },
            { title: "오픈소스 캔버스 차트 엔진 라이브러리", description: "경량화 알고리즘을 탑재하여 모바일 기기에서도 메모리 누수 없이 구동되는 오픈소스 차트 엔진 고도화", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" },
            { title: "가상자산 실시간 거래소 백엔드 모듈", description: "대규모 동시 요청 처리를 위해 인메모리 아키텍처와 분산 트랜잭션 설계를 반영한 백엔드 코어", image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "터미널 뒤에서 디지털 세계를 직조하는 크리에이티브 코더",
        subtitle: "모든 아키텍처의 한계는 논리적 생각의 깊이로 극복할 수 있다고 믿습니다.",
        content_data: {
          description: "안녕하세요. 사이버 펑크 감성의 하이 테크놀로지를 추구하는 풀스택 엔지니어 사이언입니다. 화려한 인터랙션 이면의 완벽하게 짜인 알고리즘과 메모리 최적화 구조에서 짜릿함을 느낍니다. 다수의 글로벌 서비스 마이그레이션 프로젝트를 성공적으로 이끌었으며, 오픈소스 라이브러리 메인터너로도 활발히 기여하고 있습니다. 복잡성을 단순함으로 바꾸는 코딩 장인 정신을 확인해 보세요.",
          stats: [
            { label: "깃허브 누적 커밋 수", value: "3,500+ Commits" },
            { label: "오픈소스 스타 개수", value: "1.2k+ Stars" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "성공적인 커밋 코드를 함께 푸시해 보세요",
        subtitle: "난이도 높은 기술적 문제의 해결사 또는 고성능 풀스택 협업 어플리케이션 개발 파트너가 필요하시다면 터미널 신호를 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "엔지니어에게 핑 보내기"
        }
      }
    ]
  },

  illustrator_pastel_dream: {
    templateId: "illustrator_pastel_dream",
    name: "드림 팝 일러스트레이터",
    category: "Portfolio",
    description: "2D/3D 캐릭터 일러스트레이터와 동화 비주얼 디자이너를 위한 몽환적이고 귀여운 무드의 파스텔 테마 템플릿입니다. 솜사탕 같은 핑크, 바이올렛, 스카이 블루가 사랑스럽게 어우러집니다.",
    image: "/templates/illustrator_pastel_dream.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#f472b6",     // 소프트 파스텔 핑크
        secondary: "#c084fc",   // 몽환적인 파스텔 바이올렛
        accent: "#38bdf8",      // 청량한 파스텔 스카이 블루
        background: "#fdf8ff",  // 솜사탕 빛 팅크 화이트 브라운
        surface: "#ffffff",     // 동글동글하고 깨끗한 화이트 서페이스
        text: "#4c1d95"         // 조화를 이루는 소프트 플럼 퍼플
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "파스텔 솜사탕 구름 위에서 펼쳐지는 상상력의 세계",
        subtitle: "지루하고 단조로운 일상에 따뜻한 색감 한 스푼! 사랑스러운 오리지널 캐릭터들과 몽환적인 동화 속 풍경을 그리는 파스텔 드림 스튜디오에 오신 것을 환영합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "그림책 열어보기",
          ctaLink: "#portfolio",
          features: [
            { text: "독창적인 스토리텔링이 담긴 감성 2D/3D 캐릭터 디자인" },
            { text: "글로벌 브랜드 및 애니메이션 콜라보레이션 비주얼 에셋" }
          ]
        }
      },
      {
        section_type: "services",
        title: "드림 크리에이티브 아트",
        subtitle: "마음을 몽글몽글하게 만드는 다정한 일러스트 및 아트웍 서비스 세션입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 캐릭터 콘셉트 아트",
              description: "모바일 게임, 브랜드 마스코트, 이모티콘 등에 즉시 적용 가능한 입체적이고 사랑스러운 성격을 가진 캐릭터 디자인 컬렉션을 제안합니다.",
              icon: "Sparkles"
            },
            {
              title: "동화 및 삽화 북 일러스트",
              description: "따뜻한 질감의 브러시 표현과 포근한 스토리텔링 문장들이 조화를 이루는 소설 책 표지 및 유아용 동화책 메인 삽화를 제작합니다.",
              icon: "Paintbrush"
            },
            {
              title: "굿즈 & 콘셉트 토이 디자인",
              description: "2D 평면 일러스트 아트웍을 키링, 봉제 인형, 피규어 등 소장 가치가 높은 프리미엄 브랜드 굿즈 상품으로 입체 설계합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "꿈결 같은 은하수 아카이브",
        subtitle: "상상 속의 이야기들이 몽환적인 파스텔 빛깔로 피어난 대표작들입니다.",
        content_data: {
          items: [
            { title: "달빛 아래 춤추는 분홍 고래의 여정", description: "스카이 블루와 핑크 그라데이션 기법으로 밤하늘을 헤엄치는 고래를 표현한 메인 아트웍", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80" },
            { title: "미지의 숲속, 솜사탕 요정 마을", description: "독창적인 판타지 동화책 삽화를 위해 따뜻한 3D 클레이 텍스처 느낌으로 렌더링한 캐릭터 디자인", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 뷰티 브랜드 패키지 일러스트", description: "Z세대의 감성을 자극하는 키치하고 러블리한 무드의 콜라보레이션 일러스트레이션 아트 패키지", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상을 핑크빛 꿈으로 물들이는 일러스트레이터",
        subtitle: "모든 사람들의 마음속에 숨어있는 순수한 동심을 화폭에 채웁니다.",
        content_data: {
          description: "안녕하세요! 지치고 삭막한 회색 도심 속에 몽환적이고 따뜻한 파스텔 파도를 퍼트리는 일러스트레이터 드림입니다. 저는 구름 위를 걷는 듯한 몽글몽글한 상상력과 어린 시절 꿈속에서 보았던 신비로운 색채들을 현실 세계의 캔버스에 구현하고 있습니다. 제 그림을 보시는 짧은 순간만큼은 모든 걱정을 내려놓고 마법 같은 행복을 느끼실 수 있기를 바랍니다.",
          stats: [
            { label: "누적 굿즈 판매 수량", value: "50,000개+" },
            { label: "아트웍 콜라보레이션", value: "30+ 브랜드" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "다정한 동화 속 세계로의 초대",
        subtitle: "나만의 맞춤형 외주 삽화 의뢰, 전시 콜라보레이션 혹은 기분 좋은 러브레터는 언제나 대환영입니다. 아래로 신호를 남겨주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "꿈의 스튜디오에 편지 쓰기"
        }
      }
    ]
  },
  fashion_director_rose: {
    templateId: "fashion_director_rose",
    name: "클래식 로즈 패션 디렉터",
    category: "Portfolio",
    description: "글로벌 패션 위크 및 개인 브랜드 비주얼을 다루는 디렉터를 위한 프리미엄 테마입니다. 소프트 로즈 골드와 피치 베이지 베이스에 세련된 차콜 블랙이 더해져 한층 더 우아하고 감각적인 브랜드 아이덴티티를 연출합니다.",
    image: "/templates/fashion_director_rose.png",
    theme: {
      fontFamily: "Playfair Display, serif",
      colors: {
        primary: "#e7a99a",     // 소프트 로즈 골드
        secondary: "#fbeee6",   // 은은한 피치 베이지
        accent: "#1c1917",      // 세련된 차콜 블랙 포인트
        background: "#fffbf9",  // 퓨어 웜 오프화이트
        surface: "#ffffff",     // 깨끗한 컨테이너 배경
        text: "#292524"         // 가독성을 극대화한 다크 브라운 그레이
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시대를 초월하는 우아함, 런웨이의 비주얼을 설계하다",
        subtitle: "글로벌 패션 트렌드를 선도하는 독창적인 무드 보드 기획과 브랜드 아이덴티티 수립을 통해 에디토리얼의 가치를 최고 수준으로 끌어올립니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "컬렉션 컬렉션 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "시즌별 하이엔드 브랜드 패션 위크 총괄 디렉션" },
            { text: "독창적인 스토리텔링 기반의 퍼스널 비주얼 룩북 브랜딩" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에디토리얼 비주얼 비즈니스",
        subtitle: "브랜드가 지닌 고유한 예술적 가치를 시각적인 언어로 완전하게 전환하는 마스터 클래스 서비스입니다.",
        content_data: {
          items: [
            {
              title: "패션 위크 총괄 크리에이티브 디렉션",
              description: "런웨이 콘셉트 스케치부터 무대 조명, 사운드, 모델 큐레이션까지 브랜드 컬렉션의 첫 공개 순간을 완벽하게 설계합니다.",
              icon: "Sparkles"
            },
            {
              title: "퍼스널 스타일리스트 & 브랜드 룩북",
              description: "아티스트와 하이엔드 브랜드를 위한 맞춤형 무드 보드를 개발하고, 에디토리얼 매거진 컷의 소장 가치를 높입니다.",
              icon: "Paintbrush"
            },
            {
              title: "글로벌 패션 미디어 캠페인",
              description: "디지털 채널과 피지컬 미디어를 아우르는 감각적인 그래픽 아트워크 및 브랜드 필름의 비주얼 정체성을 조율합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "시즌 마스터피스 컬렉션",
        subtitle: "형태와 패브릭, 그리고 빛의 앙상블을 조화롭게 이끌어낸 대표 디렉션 쇼케이스입니다.",
        content_data: {
          items: [
            { title: "헤리티지 로즈: 파리 S/S 컬렉션", description: "클래식 실크 소재와 현대적인 테일러링 기법을 결합하여 극찬을 받은 오트쿠튀르 무대", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80" },
            { title: "아방가르드 모노: 에디토리얼 룩북", description: "대비적인 흑백 레이아웃 속에 소프트 로즈 컬러 칩을 배치하여 정교함을 강조한 패션 화보", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
            { title: "뉴에이지 이클립스 캠페인", description: "MZ 세대의 키치함을 럭셔리 무드로 재해석하여 디지털 바이럴을 이끌어낸 프라이빗 팝업 비주얼", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "트렌드 이면의 철학을 그리는 로즈 디렉터",
        subtitle: "패션은 입는 옷이 아니라, 한 인간의 내면을 표현하는 예술적 태도입니다.",
        content_data: {
          description: "안녕하세요. 하이엔드 패션 매거진의 수석 에디터를 거쳐 현재 글로벌 브랜드들의 크리에이티브 지휘봉을 잡고 있는 비주얼 디렉터 로즈입니다. 저는 단순히 빠르게 소비되고 사라질 화려한 옷을 만드는 것이 아닌, 한 벌의 의상 속에 담긴 역사와 디자이너의 고뇌, 그리고 그것을 입는 사람의 우아한 태도를 시각 프레임에 영원히 각인시키는 작업을 지향합니다.",
          stats: [
            { label: "총괄 진행 컬렉션", value: "45회+" },
            { label: "협업 글로벌 하우스", value: "20+ 파트너" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "감각적인 브랜드의 여정을 함께 시작하세요",
        subtitle: "새로운 시즌 룩북 기획, 크리에이티브 디렉션 콜라보레이션, 프라이빗 커스텀 스타일링 문의는 아래 채널로 제안해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "디렉터와 연결하기"
        }
      }
    ]
  },

  video_creator_charcoal: {
    templateId: "video_creator_charcoal",
    name: "시네마틱 딥 차콜 비디오 크리에이터",
    category: "Portfolio",
    description: "영상 편집감독, 콘텐츠 디렉터 및 모션 그래픽 디자이너를 위한 극장식 포트폴리오 테마입니다. 딥 차콜 블랙 배경과 시선을 강렬하게 모으는 메탈릭 브론즈/골드 액센트가 시네마틱 무드를 연출합니다.",
    image: "/templates/video_creator_charcoal.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#d97706",     // 메탈릭 브론즈
        secondary: "#fbbf24",   // 골드 액센트
        accent: "#ffffff",      // 가시성을 확보하는 오프화이트
        background: "#0b0c10",  // 시네마틱 딥 차콜 블랙
        surface: "#1f2128",     // 필름 슬레이트 그레이 카드
        text: "#f3f4f6"         // 시인성이 뛰어난 밝은 그레이 폰트
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "프레임 속에 숨겨진 이야기를 해부하는 영상 아키텍처",
        subtitle: "감각적인 컷 전환, 정교한 4K 컬러 그레이딩, 그리고 스토리의 몰입감을 극대화하는 사운드 디자인을 통해 독창적인 미디어 콘텐츠의 패러다임을 제시합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "쇼릴 감상하기",
          ctaLink: "#portfolio",
          features: [
            { text: "시선을 사로잡는 하이엔드 상업 광고 및 브랜드 필름 제작" },
            { text: "복잡한 3D 데이터의 본질을 풀어내는 모션 그래픽 솔루션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디지털 비디오 프로덕션",
        subtitle: "기획부터 편집, 최종 마스터링까지 원스톱으로 이루어지는 하이엔드 영상 제작 시스템 파이낸셜 라인업입니다.",
        content_data: {
          items: [
            {
              title: "시네마틱 브랜드 필름 제작",
              description: "브랜드의 가치를 한 편의 영화처럼 연출합니다. 스토리보드 구성부터 시네마 카메라 촬영, 감각적인 편집으로 몰입감을 부여합니다.",
              icon: "Film"
            },
            {
              title: "하이엔드 컬러 그레이딩",
              description: "다빈치 디졸브 시스템을 기반으로 영상이 가진 고유의 무드와 감정선을 조율하여 할리우드 영화 수준의 완성도 높은 색감을 처방합니다.",
              icon: "Paintbrush"
            },
            {
              title: "2D/3D 모션 그래픽 디렉션",
              description: "텍스트와 그래픽에 생명력을 불어넣는 인트로 애니메이션, 화려한 이펙트 튜닝을 통해 메시지의 전달력을 배가시킵니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "엄선된 시네마틱 레코드",
        subtitle: "모든 프레임에 정성을 다해 연출한 대표 영상 포트폴리오 아카이브입니다.",
        content_data: {
          items: [
            { title: "네오 시티(Neo City): 타임랩스 다큐", description: "도시의 화려한 야경과 인간의 소외감을 감각적인 사운드와 슬로우 모션으로 큐레이션한 영상", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 자동차 테크 런칭 CF", description: "메탈릭한 기계의 질감과 속도감을 다이내믹한 컷 편집 및 모션 그래픽으로 극대화한 커머셜 필름", image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80" },
            { title: "인디 밴드 뮤직비디오 디렉션", description: "몽환적인 조명과 필터 효과를 활용하여 곡이 가진 처연한 서사를 시각적으로 직조해 낸 뮤직비디오", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "프레임 위의 내러티브를 설계하는 차콜 디렉터",
        subtitle: "완벽한 타이밍에 전환되는 한 컷이 백 마디 말보다 더 깊은 울림을 줍니다.",
        content_data: {
          description: "안녕하세요! 컴퓨터 화면이라는 어두운 캔버스 위에서 빛과 소리를 조합해 마법 같은 시간을 빚어내는 영상 편집감독이자 콘텐츠 디렉터 차콜입니다. 화려하기만 한 연출 대신, 영상의 주 목적인 '메시지 전달'과 '감정의 공명'에 가장 집중합니다. 대규모 유튜브 채널의 아트 디렉팅부터 글로벌 대기업의 커머셜 CF까지, 데이터와 트렌드가 입증하는 임팩트 있는 시각 에셋을 약속드립니다.",
          stats: [
            { label: "총 프로젝트 조회수", value: "3,500만 뷰+" },
            { label: "마스터링 비디오 에셋", value: "520개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "시선을 사로잡는 영상을 빌드할 준비",
        subtitle: "스토리보드가 필요한 신규 브랜드 광고, 모션 그래픽 아웃소싱 및 콘텐츠 협업 문의는 언제든 하단 폼을 채워 신호를 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "프로젝트 의뢰하기"
        }
      }
    ]
  },

  art_curator_emerald: {
    templateId: "art_curator_emerald",
    name: "에메랄드 갤러리 아트 큐레이터",
    category: "Portfolio",
    description: "현대 미술 기획자와 문화 예술 평론가를 위한 지적인 무드의 프리미엄 템플릿입니다. 격조 높은 딥 에메랄드 그린과 세이지 그린 바탕에 고결한 골드 옐로우 포인트가 격식 있는 오프라인 갤러리 환경을 완벽하게 재현합니다.",
    image: "/templates/art_curator_emerald.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#065f46",     // 깊은 에메랄드 그린
        secondary: "#a7f3d0",   // 차분한 세이지 그린
        accent: "#eab308",      // 고결한 골드 옐로우
        background: "#f4f6f4",  // 미술관 벽면 같은 오프화이트
        surface: "#ffffff",     // 캔버스를 닮은 순백색 카드
        text: "#111827"         // 선명하고 명학한 인크 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "예술과 대중을 연결하는 지적 공간 큐레이션",
        subtitle: "단순한 작품 배치를 넘어 시대를 관통하는 예술가들의 철학적 담론을 정교하게 분석하고, 공간의 여백 속에 감동의 서사를 직조해 나갑니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "기획 전시회 입장",
          ctaLink: "#portfolio",
          features: [
            { text: "국내외 신진 현대 미술 아티스트 발굴 및 특별 전시 기획" },
            { text: "시각 예술 이면의 메커니즘을 파헤치는 밀도 높은 문학 평론" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아트 디렉션 아카이브",
        subtitle: "미술 시장의 흐름을 읽고 예술 본연의 가치를 보존하는 전문 큐레이터 서비스 영역입니다.",
        content_data: {
          items: [
            {
              title: "현대 기획 전시 스페이스 연출",
              description: "갤러리와 미술관의 동선 아키텍처를 분석하여 작품의 아우라가 극대화되는 조도, 조형물 배치, 공간 브랜딩을 제공합니다.",
              icon: "Compass"
            },
            {
              title: "전문 미술 평론 및 비평문 집필",
              description: "예술가의 창작 세계와 사회적 메시지를 통찰력 있게 분석하고, 누구나 쉽게 공감하면서도 깊이를 잃지 않는 서평을 생산합니다.",
              icon: "Feather"
            },
            {
              title: "아트 컬렉팅 및 자산 컨설팅",
              description: "글로벌 미술 시장의 데이터를 기반으로 개인 및 기업 컬렉터의 취향과 투자 가치를 모두 충족하는 하이엔드 작품 매칭을 선사합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "엄선된 큐레이션 저널",
        subtitle: "시대를 조명하는 철학적 질문들을 공간과 작품으로 풀어낸 대표 기획 전시 기록입니다.",
        content_data: {
          items: [
            { title: "비움의 형태: 침묵하는 미술전", description: "한국 단색화 거장들의 미공개 작품을 여백의 미가 살아있는 에메랄드 홀에 매칭한 정기 기획전", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "디지털 아우라의 미래: 뉴미디어 아트", description: "가상 현실 기술과 미디어 파사드를 활용해 현대 사회의 인지적 불안을 은유한 크리에이티브 시각 전시", image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=80" },
            { title: "로컬의 재발견: 숨은 손끝의 예술", description: "전국 각지의 독립 도예 및 전통 조형 예술가들을 초청하여 공예의 현대적 가치를 조명한 예술 프로젝트", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "사유의 깊이를 서재에 새기는 에메랄드 큐레이터",
        subtitle: "훌륭한 전시회는 미술관 문을 나서는 순간부터 진짜 관객의 마음에서 시작됩니다.",
        content_data: {
          description: "안녕하세요. 예술이라는 거대한 숲 속에서 가치 있는 문장과 작품을 선별하여 대중에게 소개하는 독립 큐레이터이자 미술 평론가 에메랄드입니다. 자극적인 텍스트가 넘쳐나는 인스턴트 시대이지만, 저는 미술관이 주는 고결한 침묵과 작품 하나가 인간의 영혼에 던지는 깊은 파동을 신뢰합니다. 시공을 초월해 예술가들이 건네는 시각적 신호를 지적으로 해설하는 안내자가 되겠습니다.",
          stats: [
            { label: "총괄 기획 전시", value: "32회 오픈" },
            { label: "아카이빙 비평문", value: "180편 이상" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "지적인 예술 협업의 문을 열며",
        subtitle: "미술 전시 기획 요청, 아티스트 컬래버레이션 브리프 제안, 혹은 예술 기고문 의뢰는 하단 양식을 통해 정중히 전달해 주시기 바랍니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "큐레이터에게 서신 보내기"
        }
      }
    ]
  },

  "3d_artist_violet": {
    templateId: "3d_artist_violet",
    name: "네온 바이올렛 3D 그래픽 아티스트",
    category: "Portfolio",
    description: "3D 모델러, VR/AR 콘텐츠 개발자 및 콘셉트 아티스트를 위한 테크니컬 프리미엄 템플릿입니다. 몽환적인 일렉트릭 바이올렛과 솜사탕 핑크 포인트가 화려한 글래스모피즘 효과와 어우러져 입체적인 디지털 세계를 구성합니다.",
    image: "/templates/3d_artist_violet.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#8b5cf6",     // 일렉트릭 바이올렛
        secondary: "#f472b6",   // 솜사탕 핑크
        accent: "#22d3ee",      // 형광 네온 시안
        background: "#0c0a1a",  // 사이버 네온 딥 퍼플 블랙
        surface: "#1e1b4b",     // 투명도가 있는 미드나잇 인디고 카드
        text: "#fafafa"         // 광채를 뿜어내는 오프화이트
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "차원 유영, 메타버스의 가상 현실을 렌더링하다",
        subtitle: "모니터라는 평면적 한계를 초월하여, 시각적 몰입감을 주는 정교한 3D 하드서페이스 모델링과 인터랙티브 가상공간을 실시간 그래픽 테크놀로지로 구축합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "메시 데이터 확인",
          ctaLink: "#portfolio",
          features: [
            { text: "언리얼 엔진 기반 시네마틱 퀄리티의 고해상도 환경 에셋" },
            { text: "메타버스 플랫폼 및 AR/VR 웨어러블 최적화 3D 가젯 설계" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디지털 디멘션 엔지니어링",
        subtitle: "상상 속에만 존재하던 초현실적 비주얼을 완전한 입체 오브제로 구체화하는 하이테크 스튜디오 연재 라인입니다.",
        content_data: {
          items: [
            {
              title: "3D 콘셉트 캐릭터 및 매니폴드 모델링",
              description: "Blender와 ZBrush 마스터 툴을 활용하여, 게임 및 영화 산업용 하이폴리곤 크리처 디자인부터 리깅 기술이 완비된 로우폴리곤 에셋을 추출합니다.",
              icon: "Box"
            },
            {
              title: "인터랙티브 가상 공간 가이드 설계",
              description: "VR 기기와 스마트 디바이스 환경에서 프레임 드랍 없이 심리스하게 연동되는 인터랙티브 쇼룸 및 디지털 시티 메타버스 공간 아키텍처를 빌드합니다.",
              icon: "Sparkles"
            },
            {
              title: "실시간 라이팅 & 리얼리스틱 VFX",
              description: "레이트레이싱 기술을 극대화한 정교한 쉐이더 제작, 물과 불 같은 자연 유체의 역학적 흐름을 완벽하게 모사하는 3D 시네마틱 특수 효과를 구현합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "가상 자산 렌더 에디션",
        subtitle: "사이버 스페이스의 미학을 최신 그래픽 파이프라인으로 구현한 마스터피스 3D 갤러리입니다.",
        content_data: {
          items: [
            { title: "사이버펑크 크롬 시티: 2099", description: "언리얼엔진 5 메가스캔 소스를 커스텀 튜닝하여 렌더링한 미래형 가상 도시 환경 디자인 프로젝트", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80" },
            { title: "가상 휴먼 오디세이: 나래(Narae)", description: "정교한 피부 텍스처와 마이크로 모션 캡처 가이드를 반영하여 실물과 구분이 불가능한 하이퍼 리얼리즘 3D 아바타", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
            { title: "추상 공간 속의 크리스탈 토이", description: "글래스모피즘 굴절률과 핑크 바이올렛 스펙트럼 광원을 결합한 감각적인 시각 예술 3D 디지털 NFT 굿즈", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "픽셀에 부피를 부여하는 테크니컬 3D 아티스트",
        subtitle: "가상과 현실의 경계가 무너지는 그 찰나의 몰입 속에서 기술의 미래를 봅니다.",
        content_data: {
          description: "안녕하세요. 네온 빛깔의 일렉트릭 소음 속에서 무한한 3차원 공간의 좌표를 찍어나가는 그래픽 아티스트 겸 메타버스 엔지니어 바이올렛입니다. 저는 단순한 이미지를 넘어 사용자가 직접 유영하고 만질 수 있는 고차원 디지털 아티팩트를 만드는 일에 순수한 열정을 가지고 있습니다. GPU의 한계를 밀어붙이는 최적화 노하우와 감각적인 컬러 매칭을 경험해 보세요.",
          stats: [
            { label: "배포된 디지털 에셋", value: "2,400+ 파일" },
            { label: "해외 아트스테이션 수상", value: "3회 기록" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "차원이 다른 디지털 비즈니스를 향해",
        subtitle: "AAA급 대형 게임 그래픽 외주, VR 프로젝트 공동 기획, 혹은 하이테크 3D 아트웍 컨설팅을 원하시면 하단의 디지털 신호를 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "사이버 아티스트와 소통하기"
        }
      }
    ]
  },

  ceramic_art_terracotta: {
    templateId: "ceramic_art_terracotta",
    name: "내추럴 테라코타 도예 작가",
    category: "Portfolio",
    description: "도자기 공예가와 아날로그 공방 크리에이터를 위한 오가닉 템플릿입니다. 따뜻하고 부드러운 흙빛 테라코타 오렌지와 내추럴 오트밀 베이지 베이스가 흙 특유의 유기적인 편안함을 전달합니다.",
    image: "/templates/ceramic_art_terracotta.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#c2410c",     // 흙빛 테라코타 오렌지
        secondary: "#f5ebe0",   // 내추럴 오트밀 베이지
        accent: "#7c2d12",      // 가마 속 불꽃을 닮은 번트 시엔나 브라운
        background: "#fffcf9",  // 정갈하고 깨끗한 한지 화이트
        surface: "#fbf5ee",     // 포근한 느낌의 백자빛 크림 서페이스
        text: "#431407"         // 따뜻한 옹기 빛의 초콜릿 브라운 본문색
      },
      borderRadius: "rounded-3xl", // 흙의 부드러운 곡선을 투영한 와이드 둥근 마감
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "물레 위에서 피어나는 부드러운 흙의 영혼",
        subtitle: "인위적인 화학 유약을 배제하고 고유한 자연의 흙과 가마 속 뜨거운 불꽃이 오랜 기다림 끝에 빚어내는 단 하나뿐인 아날로그 도자기 공예 포트폴리오입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1565192647048-f997ed87f5e2?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공방 가이드 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "사계절 일상을 따스하게 채워줄 친환경 생활 자기 라인업" },
            { text: "공간에 묵직한 오브제가 되어 줄 대형 조형 도예 평론 컬렉션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아틀리에 마스터 피스",
        subtitle: "흙을 만지고 숨을 고르며 자연의 순리에 스며드는 공방의 전문 예술 영역입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 세라믹 오브제 제작",
              description: "백자토, 분청토 등 다양한 천연 흙의 성질을 분석하고 손성형(Hand-building) 기법을 활용하여 세상에 단 하나뿐인 프리미엄 식기와 화기를 제작합니다.",
              icon: "Paintbrush"
            },
            {
              title: "전통 및 현대 가마 소성 가이드",
              description: "1250도 고온의 불가마 속에서 환원염과 산화염의 미세한 화학 변화를 제어하여 깊고 그윽한 테라코타 특유의 자연 빛깔을 추출해 냅니다.",
              icon: "Layers"
            },
            {
              title: "프라이빗 공방 도예 워크숍",
              description: "일상의 소음에서 벗어나 흙의 포근한 촉감에 온전히 몰입하며 나만의 내면을 그릇의 형태로 직조해 나가는 치유 클래스를 운영합니다.",
              icon: "Smile"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "가마에서 태어난 자연의 숨결",
        subtitle: "정성과 오랜 기다림의 시간이 빚어낸 순수 오가닉 세라믹 아트웍 아카이브입니다.",
        content_data: {
          items: [
            { title: "비움의 미학: 백자 달항아리", description: "전통 조선 백자의 형태미를 현대적으로 재해석하여 은은한 우유 빛깔의 곡선미를 극대화한 대표작", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80" },
            { title: "테라코타 가든 화기 시리즈", description: "거친 모래 입자가 섞인 토종 흙을 구워내어 자연 그대로의 통기성과 내추럴한 오렌지 질감을 살린 가드닝 오브제", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80" },
            { title: "스틸 & 세라믹 융합 조형물", description: "차가운 금속 구조물과 따뜻한 질감의 도자 조각들을 결합하여 현대 사회의 유기적 관계성을 표현한 거대 조형 예술", image: "https://images.unsplash.com/photo-1535557142533-b5e1cc6e2a5d?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "흙의 정직함을 사랑하는 아날로그 도예 작가 테라코타",
        subtitle: "손으로 직접 만져보지 않은 것에는 결코 진짜 영혼이 깃들 수 없다고 믿습니다.",
        content_data: {
          description: "안녕하세요. 조용한 산자락 아래 공방에서 매일 아침 물레를 돌리며 흙과 깊은 대화를 나누는 도예 작가 테라코타입니다. 기계가 찍어내는 자로 잰 듯한 완벽함 대신, 손끝의 압력과 그날의 날씨에 따라 미세하게 달라지는 도자기 고유의 정직한 일그러짐을 사랑합니다. 바쁜 삶 속에서 제 그릇을 사용하시는 순간만큼은 따뜻한 흙의 온기를 온전히 누리실 수 있기를 바랍니다.",
          stats: [
            { label: "국제 도자 비엔날레", value: "입선 및 소장 완료" },
            { label: "공방 배출 수료생", value: "350명 돌파" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "주방과 거실에 흙의 소박한 온기를",
        subtitle: "개인 소장용 오리지널 오브제 구매 문의, 카페 브랜드 대량 커스텀 식기 식기 발주 및 프라이빗 워크숍 신청은 아래로 다정하게 연락해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "공방에 서신 남기기"
        }
      }
    ]
  },
  copywriter_editorial_navy: {
    templateId: "copywriter_editorial_navy",
    name: "에디토리얼 카피라이터",
    category: "Portfolio",
    description: "브랜드 스토리텔러와 광고 카피라이터를 위한 서재 무드의 템플릿입니다. 신뢰감을 주는 딥 네이비와 세련된 스카이 블루 대비 속에 핵심 텍스트를 밝혀주는 골드 옐로우 액센트로 지적인 설득력을 더합니다.",
    image: "/templates/copywriter_editorial_navy.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#1e3a8a",     // 신뢰감 주는 딥 네이비
        secondary: "#38bdf8",   // 세련된 스카이 블루
        accent: "#eab308",      // 핵심을 짚는 골드 옐로우
        background: "#f8fafc",  // 깨끗하고 눈이 편안한 슬레이트 화이트
        surface: "#ffffff",     // 텍스트 정돈을 위한 순백색 카드
        text: "#0f172a"         // 완벽한 시인성의 슬레이트 다크 블랙
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "소비자의 마음을 움직이는 단 하나의 문장",
        subtitle: "화려한 수식어를 배제하고 브랜드의 본질을 꿰뚫는 날카로운 카피라이팅과 진정성 있는 큐레이션을 통해 비즈니스의 페르소나를 완벽하게 정립합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
          ctaText: "포트폴리오 읽기",
          ctaLink: "#portfolio",
          features: [
            { text: "소비자 행동 심리를 자극하는 커머셜 광고 카피라이팅" },
            { text: "브랜드 고유의 철학을 심어주는 장문 톤앤매너 스토리텔링" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스토리텔링 텍스트 솔루션",
        subtitle: "단어의 배열만으로 기업의 브랜드 가치와 가시적 매출 성장을 견인하는 전문 라이팅 스펙트럼입니다.",
        content_data: {
          items: [
            {
              title: "브랜드 슬로건 및 캠페인 카피",
              description: "기업의 아이덴티티를 명확하게 관통하여 소비자의 뇌리에 각인되는 한 줄의 메인 키프레이즈와 광고 슬로건을 개발합니다.",
              icon: "Type"
            },
            {
              title: "디지털 저널 및 롱폼 콘텐츠",
              description: "뉴스레터, 브랜드 블로그 아티클 등 구독자의 지적 호기심을 유도하고 깊은 공감대를 이끌어내는 고품격 텍스트 가이드를 제공합니다.",
              icon: "Edit3"
            },
            {
              title: "콘텐츠 톤앤매너 매뉴얼 구축",
              description: "전사 커뮤니케이션 및 마케팅 채널에서 일관성 있는 메시지를 전송할 수 있도록 브랜드 고유의 페르소나와 언어 규격을 설계합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "기록된 텍스트 아카이브",
        subtitle: "논리적 구조와 감성적 언어가 결합되어 성과를 증명해 낸 주요 프로젝트 리포트입니다.",
        content_data: {
          items: [
            { title: "친환경 리빙 브랜드 런칭 캠페인 슬로건", description: "소비자의 환경적 가치 소비를 독려하여 전년 대비 매출 200% 증가를 견인한 메인 카피", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 테크 기업 뉴스레터 리브랜딩", description: "어려운 기술 전문 용어를 일상의 언어로 친근하게 풀어내어 오픈율 45%를 달성한 위클리 에디션", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" },
            { title: "F&B 스타트업 메인 브랜드 스토리 빌딩", description: "창업자의 철학과 장인정신을 한 편의 서사로 구성하여 크라우드 펀딩 500%를 달성한 롱폼 라이팅", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "단어로 세계를 직조하는 크리에이티브 라이터",
        subtitle: "좋은 카피는 귀를 즐겁게 하는 말장난이 아니라, 사람의 행동을 바꾸는 논리적 설계입니다.",
        content_data: {
          description: "안녕하세요. 브랜드의 숨겨진 가치를 가장 선명한 언어로 번역해 내는 에디토리얼 카피라이터 네이비입니다. 글로벌 종합 광고 대행사의 카피 디렉터를 거치며 수많은 대기업과 스타트업의 메인 캠페인을 이끌었습니다. 저는 유행하는 밈에 의존하기보다 시대를 관통하는 인간의 본질적인 심리와 브랜드의 고유 자산을 연결하는 깊이 있는 텍스트의 힘을 믿습니다.",
          stats: [
            { label: "총괄 참여 캠페인", value: "80개+" },
            { label: "뉴스레터 평균 구독률", value: "45% 유지" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "브랜드의 언어를 더 단단하게",
        subtitle: "신규 브랜드 슬로건 개발, 웹사이트 카피라이팅 진단, 정기 저널 기고 의뢰는 아래 양식을 통해 편안하게 전달해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "작가와 협업 시작하기"
        }
      }
    ]
  },

  makeup_artist_pastel: {
    templateId: "makeup_artist_pastel",
    name: "블러썸 뷰티 메이크업 아티스트",
    category: "Portfolio",
    description: "뷰티 크리에이티브 디렉터와 퍼스널 컬러 컨설턴트를 위한 다정한 파스텔 톤 템플릿입니다. 소프트 살구빛 핑크 파스텔 배경 위에 로즈 골드와 소프트 바이올렛 포인트를 더해 포근함을 줍니다.",
    image: "/templates/makeup_artist_pastel.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#e7a99a",     // 고급스러운 로즈 골드
        secondary: "#ddd6fe",   // 소프트 파스텔 바이올렛
        accent: "#f43f5e",      // 생기를 주는 블러썸 핑크
        background: "#fff8f6",  // 부드러운 소프트 살구빛 파스텔 화이트
        surface: "#ffffff",     // 맑은 피부 톤을 연상시키는 순백색 카드
        text: "#4c1d95"         // 분위기를 차분하게 잡아주는 딥 플럼
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "본연의 고유한 아름다움을 피워내다",
        subtitle: "트렌디한 뷰티 메커니즘과 정교한 퍼스널 메이크업 분석을 결합하여, 가려져 있던 본연의 화사함과 가장 어울리는 고품격 비주얼 스펙트럼을 디자인합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스타일링 북 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "트렌디 매거진 및 패션 런웨이 하이엔드 뷰티 디렉션" },
            { text: "1:1 정밀 골격 분석 맞춤형 커스텀 웨딩 메이크업" }
          ]
        }
      },
      {
        section_type: "services",
        title: "크리에이티브 뷰티 케어",
        subtitle: "단순한 메이크업을 넘어 개인이 가진 퍼스널 아이덴티티를 극대화하는 프리미엄 서비스 코너입니다.",
        content_data: {
          items: [
            {
              title: "에디토리얼 & 광고 뷰티 디렉션",
              description: "광고, 화보 촬영의 메인 컨셉에 발맞추어 고해상도 카메라 렌즈 아래에서도 완벽한 텍스처와 독창적인 컬러 조합을 연출합니다.",
              icon: "Sparkles"
            },
            {
              title: "퍼스널 웨딩 메이크업 스타일링",
              description: "생애 가장 빛나는 순간을 위해 신부의 피부 톤, 드레스 텍스처, 식장 조도까지 정밀하게 계산한 프라이빗 스타일링을 완성합니다.",
              icon: "Heart"
            },
            {
              title: "1:1 퍼스널 마스터 클래스",
              description: "개인의 이목구비와 이미지에 최적화된 메이크업 테크닉, 데일리 스킨케어 루틴 및 파우치 진단 컨설팅을 제공합니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "블러썸 비주얼 쇼케이스",
        subtitle: "빛과 컬러의 완벽한 밸런스로 섬세하게 연출된 대표 아티스트리 컷입니다.",
        content_data: {
          items: [
            { title: "스프링 블러썸: 패션 매거진 화보", description: "살구빛 파스텔 톤과 로즈 골드 하이라이터를 매칭하여 봄의 생동감을 표현한 에디토리얼 컷", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 글로우: 프라이빗 웨딩", description: "피부 본연의 투명한 광채를 살리고 소프트 바이올렛 포인트로 우아함을 극대화한 신부 스타일링", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
            { title: "네오 모던: 컨셉 아방가르드 뷰티", description: "볼드한 아이라인과 크림슨 컬러 칩의 조화로 강렬한 입체감을 부여한 크리에이티브 아트웍", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "빛을 설계하는 비주얼 메이크업 디렉터",
        subtitle: "가장 아름다운 메이크업은 단점을 감추는 것이 아니라, 당신의 장점을 드러내는 것입니다.",
        content_data: {
          description: "안녕하세요. 사람마다 가진 고유한 매력의 주파수를 찾아 화사한 컬러로 표현해 내는 뷰티 디렉터 블러썸입니다. 글로벌 코스메틱 브랜드의 수석 스타일리스트 및 패션위크 백스테이지 메인 아티스트로 활동하며 정형화되지 않은 아름다움의 가치를 탐구해 왔습니다. 얼굴이라는 섬세한 캔버스 위에 독창적인 온기와 생기를 불어넣는 아트를 지향합니다.",
          stats: [
            { label: "스타일링 매칭 횟수", value: "3,200회+" },
            { label: "협업 뷰티 브랜드", value: "25+ 파트너" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "나만의 화사한 빛을 피워낼 시간",
        subtitle: "중요한 촬영을 위한 디렉팅 의뢰, 프라이빗 퍼스널 컨설팅 예약, 브랜드 클래스 제안은 하단 창을 통해 마음을 건네주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "아티스트와 상담하기"
        }
      }
    ]
  },

  sound_designer_carbon: {
    templateId: "sound_designer_carbon",
    name: "하이테크 카본 사운드 디자이너",
    category: "Portfolio",
    description: "오디오 믹싱 엔지니어와 미디어 아트 음악 감독을 위한 테크니컬 다크 테마입니다. 다크 카본 슬레이트 블랙 배경 위에 일렉트릭 네온 옐로우/오렌지 포인트를 가미하여 프로페셔널 장비의 무드를 연출합니다.",
    image: "/templates/sound_designer_carbon.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#eab308",     // 강렬한 네온 옐로우
        secondary: "#f97316",   // 일렉트릭 오렌지
        accent: "#22d3ee",      // 테크니컬 시안 블루
        background: "#090b0e",  // 깊이감 있는 다크 카본 블랙
        surface: "#171a21",     // 음향 디바이스 슬레이트 그레이 카드
        text: "#f3f4f6"         // 시인성이 확보된 오프화이트 폰트
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "공간의 주파수를 바꾸는 완벽한 음향 아키텍처",
        subtitle: "귀로 듣는 순간 완벽한 서사가 펼쳐지는 4K 입체 오디오 공간 음향 설계, 미디어 아트 총괄 사운드 트랙 제작 및 정교한 폴리 효과 마스터링 리포트입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오디오 쇼릴 듣기",
          ctaLink: "#portfolio",
          features: [
            { text: "글로벌 게임 및 영화 스튜디오 시네마틱 사운드 총괄" },
            { text: "인터랙티브 미디어 아트 공간 음향 스파셜 오디오 마스터링" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오디오 사운드 엔지니어링",
        subtitle: "소리의 질감을 미세하게 조율하여 청각적 몰입감을 최고 수준으로 구축하는 전문 기술 라인업입니다.",
        content_data: {
          items: [
            {
              title: "시네마틱 음악 감독 & 작곡",
              description: "영상 및 게임 미디어의 감정선을 폭발시키는 오케스트라 사운드부터 하이테크 신시사이저 전자음악까지 맞춤형 스코어링을 제공합니다.",
              icon: "Music"
            },
            {
              title: "정밀 입체 오디오 믹싱 & 마스터링",
              description: "돌비 애트모스 등 최신 스파셜 사운드 규격을 완벽히 지원하여, 관객이 소리의 공간 중심에 서 있는 듯한 다차원 음향을 엔지니어링합니다.",
              icon: "Volume2"
            },
            {
              title: "오리지널 폴리(Foley) 효과음 디자인",
              description: "현실 세계의 소리를 마이크로 캡처하고 플러그인 튜닝을 거쳐 세상에 존재하지 않는 크리처 음향 및 고해상도 게임 임팩트 사운드를 창조합니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "소리의 궤적 아카이브",
        subtitle: "청각적 주파수를 설계하여 작품의 완성도를 보증한 마스터피스 소리 기록입니다.",
        content_data: {
          items: [
            { title: "SF 단편 영화 '공각의 잔상' 사운드 디자인", description: "미래 지향적 사이버 공간을 연출하기 위해 신시사이저 노이즈와 폴리 효과음을 믹싱한 음향 아카이브", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80" },
            { title: "인터랙티브 미디어 아트 전시 '공간의 메아리'", description: "관객의 움직임에 동기화되어 실시간으로 주파수가 변화하는 스파셜 8D 오디오 마스터링 프로젝트", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80" },
            { title: "AAA급 대형 RPG 게임 메인 오디오 트랙", description: "광활한 오픈월드의 몰입감을 더하기 위해 60인조 오케스트라 사운드로 녹음 마스터링한 시네마틱 스코어", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "소리의 질감을 해부하는 사운드 아키텍트",
        subtitle: "디자인된 소리는 보이지 않는 거대한 가상현실을 구축하는 가장 강력한 힘입니다.",
        content_data: {
          description: "안녕하세요. 소리의 파형 속에 숨겨진 드라마를 디자인하는 오디오 엔지니어이자 음악 감독 카본입니다. 저는 소리를 단순히 듣는 자극이 아니라, 공간의 부피를 정의하고 사용자의 감정을 자극하는 시각적 아티팩트의 연장선으로 취향을 저격합니다. 첨단 디지털 장비의 정밀함과 아날로그 모듈러 신스의 따뜻함을 결합하여 차원이 다른 청각적 임팩트를 약속드립니다.",
          stats: [
            { label: "참여 미디어 프로젝트", value: "120개 이상" },
            { label: "오리지널 보유 오디오 에셋", value: "5,000+ 클립" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "완벽한 음향의 주파수를 믹싱하세요",
        subtitle: "시네마틱 영상 스코어링 외주, 게임 효과음 사운드 구축, 공간 음향 믹싱/마스터링 기술 자문 문의는 하단 콘솔 창을 채워 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "엔지니어에게 신호 보내기"
        }
      }
    ]
  },

  interior_stylist_olive: {
    templateId: "interior_stylist_olive",
    name: "어반 가든 인테리어 스타일리스트",
    category: "Portfolio",
    description: "공간 데코레이터와 플랜테리어 아티스트를 위한 내추럴 오가닉 테마입니다. 따뜻한 올리브 그린과 모래빛 샌드 베이지 베이스에 민트 초록 포인트가 조화를 이루며 식물의 유기적인 선을 담아냅니다.",
    image: "/templates/interior_stylist_olive.png",
    theme: {
      fontFamily: "Pretendard, Quicksand, sans-serif",
      colors: {
        primary: "#556b2f",     // 따뜻한 올리브 그린
        secondary: "#f5ebe0",   // 모래빛 샌드 베이지
        accent: "#10b981",      // 싱그러운 민트 초록
        background: "#faf8f5",  // 내추럴 크림 오프화이트
        surface: "#ffffff",     // 정갈한 자연광을 닮은 화이트 카드
        text: "#2f3e1b"         // 단단한 이끼색의 딥 그린 브라운
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "도심 속 회색 벽에 불어넣는 싱그러운 초록빛 쉼표",
        subtitle: "구조적 가구의 배치, 패브릭의 따스한 텍스처, 그리고 반려식물의 생명력을 유기적으로 결합하여 머무는 것만으로도 치유가 되는 완벽한 플랜테리어 하우스를 연출합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스타일링 공간 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "사계절 생기가 유지되는 맞춤형 반려식물 플랜테리어" },
            { text: "공간의 가치를 극대화하는 하이엔드 가구 큐레이션 및 배치" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오가닉 스페이스 테라피",
        subtitle: "공간이 가진 고유한 레이아웃을 분석하여 가장 편안하고 감각적인 자연 친화적 리빙 정원을 선사합니다.",
        content_data: {
          items: [
            {
              title: "주거 및 상업 공간 토탈 스타일링",
              description: "클라이언트의 라이프스타일과 동선을 추적하여 조명, 패브릭, 가구, 월페이퍼의 완벽한 톤앤매너 밸런스를 컨설팅합니다.",
              icon: "Home"
            },
            {
              title: "맞춤형 플랜테리어 아키텍처",
              description: "실내 채광, 통풍 가이드라인을 면밀히 분석하고, 인테리어 무드와 조화를 이루는 프리미엄 식물 큐레이션 및 플랜트 플래닝을 진행합니다.",
              icon: "Compass"
            },
            {
              title: "가구 디자인 및 소품 디렉팅",
              description: "공간의 아이덴티티에 최적화된 맞춤형 월넛 원목 가구 설계부터 유니크한 앤티크 세라믹 소품 배치까지 세밀하게 세팅합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "초록빛 정원 컬렉션",
        subtitle: "인간과 자연이 공존하는 단단한 일상의 평온을 담아낸 대표 공간 데코레이션 기록입니다.",
        content_data: {
          items: [
            { title: "성수동 보태니컬 카페 공간 디자인", description: "노출 콘크리트 인테리어 속에 대형 올리브나무와 민트 빛 조명을 매칭하여 숲속 같은 편안함을 준 프로젝트", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80" },
            { title: "어반 가든 30평형 아파트 플랜테리어", description: "모래빛 베이지 가구와 린넨 소재, 그리고 통기성을 극대화한 토분 위주의 반려식물로 가꾼 힐링 주거 인테리어", image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 원목 스튜디오 쇼룸 데코레이션", description: "자연 채광의 슬라이딩 동선에 맞춰 유기적인 곡선형 월넛 소파와 식물의 배치를 극대화한 시그니처 커스텀 셋업", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "공간에 쉼을 새기는 홈 디렉터 올리브",
        subtitle: "진정한 하이엔드 인테리어는 값비싼 가구의 나열이 아니라, 자연의 빛과 숨결이 들어설 자리를 비워두는 것입니다.",
        content_data: {
          description: "안녕하세요. 회색빛 도심 빌딩 숲 속에서 삶의 속도를 늦추는 초록빛 슬로우 하우스를 설계하는 공간 디렉터 올리브입니다. 저는 인위적으로 꽉 채워진 인테리어보다 바람이 통하고 흙의 온기가 느껴지는 내추럴 샌드 텍스처와 올리브그린 식물과의 앙상블에서 진정한 안식을 발견합니다. 당신만을 위해 정교하게 연출된 자연주의 홈 스타일링을 경험해 보세요.",
          stats: [
            { label: "플랜테리어 시공 횟수", value: "140세대+" },
            { label: "보유 맞춤형 도안 디자인", value: "95건+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "초록빛 위로를 일상에 들여놓으세요",
        subtitle: "신규 아파트 입주 스타일링, 상업 공간 플랜테리어 브리프 제안, 홈카페 커스텀 가구 매칭 상담은 아래 양식을 통해 마음 편히 연락해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "스타일리스와 연결하기"
        }
      }
    ]
  },

  travel_writer_sepia: {
    templateId: "travel_writer_sepia",
    name: "아날로그 세피아 여행 작가",
    category: "Portfolio",
    description: "여행 저널리스트와 다큐멘터리 사진작가를 위한 빈티지 감성 테마입니다. 세월의 흔적이 묻은 바랜 크림 종이 질감의 배경과 딥 세피아 브라운, LP 바이널 블랙 포인트가 오래된 타자기의 아날로그 감성을 전합니다.",
    image: "/templates/travel_writer_sepia.png",
    theme: {
      fontFamily: "Georgia, serif",
      colors: {
        primary: "#78350f",     // 딥 세피아 브라운
        secondary: "#1c1917",   // LP 바이널 블랙
        accent: "#b45309",      // 타오르는 노을빛 세피아
        background: "#fffbf5",  // 세월이 바랜 크림 종이 질감
        surface: "#fbf3e6",     // 앤티크 양장본을 닮은 웜 크림 서페이스
        text: "#292524"         // 타자기 먹색을 구현한 스톤 블랙
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "길 위에서 써 내려간 한 줌의 아날로그 기록들",
        subtitle: "빠르게 스쳐 지나가는 디지털 관광지를 벗어나, 35mm 수동 카메라 프레임에 담아낸 낯선 도시의 새벽안개와 고독, 그리고 오래된 골목길 사람들의 냄새를 텍스트로 박제합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
          ctaText: "여정 아카이브 입장",
          ctaLink: "#portfolio",
          features: [
            { text: "국내외 숨겨진 로컬 마을의 깊이 있는 문화 인문학 저널" },
            { text: "현상액 냄새가 묻어나는 오리지널 흑백 다큐멘터리 사진집" }
          ]
        }
      },
      {
        section_type: "services",
        title: "여행 저널리즘 에디션",
        subtitle: "방랑의 여정 속에서 포착해 낸 묵직한 삶의 흔적들을 아카이빙하는 세 가지 서재 섹션입니다.",
        content_data: {
          items: [
            {
              title: "로컬 다큐멘터리 저널",
              description: "관광 안내 책자에는 없는 지구 반대편 소도시의 소박한 전통과 삶의 방식을 취재하여 깊이 있는 인문학 보고서로 발간합니다.",
              icon: "Compass"
            },
            {
              title: "35mm 필름 포토 다이어리",
              description: "빛이 바랜 크림 색감 속에 담아낸 도시의 잔상들, 수동 카메라 라이카 기종으로 스냅 촬영한 노스탤지어 프레임을 공유합니다.",
              icon: "Edit3"
            },
            {
              title: "독립 출판 및 심야 서평",
              description: "직접 발로 뛰며 인화한 사진과 정제된 문장들을 한 권의 독립 에세이집으로 직조해 나가는 창작 과정을 기록합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "빛바랜 방랑의 발자국",
        subtitle: "속도를 늦추고 온전히 영혼으로 마주했던 전 세계 도시들의 정취를 엮은 아카이브입니다.",
        content_data: {
          items: [
            { title: "리스본의 낡은 노란 트램: 흑백 사진전", description: "세피아 노을빛과 바이널 블랙의 조화로 낭만적이고 쓸쓸한 유럽 골목을 묘사한 대표 포토 에세이", image: "https://images.unsplash.com/photo-1510921229595-e4176145a8c?auto=format&fit=crop&w=600&q=80" },
            { title: "쿠바 아바나, 멈춰버린 시간 속의 멜로디", description: "오래된 클래식 카와 올드 재즈바의 열기를 타자기 질감의 묵직한 활자로 담아낸 독립 저널 보고서", image: "https://images.unsplash.com/photo-1518005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
            { title: "교토 철학의 길, 고요한 겨울 산책", description: "눈 덮인 대나무 숲길을 걸으며 사색했던 내면의 침묵과 동양적 여백을 담아낸 감성 포토 에세이", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상을 천천히 받아 적는 아날로그 저널리스트",
        subtitle: "진정한 여행은 새로운 풍경을 보는 것이 아니라, 낯선 환경 속에서 새로운 시선을 얻는 것입니다.",
        content_data: {
          description: "안녕하세요. 노트북 대신 빛바랜 노트를 매고, 스마트폰 대신 필름 수동 카메라를 목에 건 채 전 세계의 한적한 구석을 유랑하는 여행 작가 세피아입니다. 저는 화려한 인플루언서의 여행지 자랑 대신, 그 도시가 품은 유구한 헤리티지와 소박한 사람들의 손때 묻은 역사에 카메라 핀트를 맞춥니다. 제 글과 사진이 여러분의 메마른 일상에 잔잔한 서사적 영감이 되기를 바랍니다.",
          stats: [
            { label: "탐방한 글로벌 소도시", value: "140개 지역" },
            { label: "출간된 독립 에세이집", value: "8권 발행" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "방랑의 길 위에서 보내는 편지",
        subtitle: "외주 여행 저널 기고 의뢰, 오리지널 다큐멘터리 사진 프린트 구매, 독립 출판 협업 제안은 아래 빈 종이에 글을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },
  model_editorial_crimson: {
    templateId: "model_editorial_crimson",
    name: "크림슨 에디토리얼 모델",
    category: "Portfolio",
    description: "패션 전문 모델, 룩북 아티스트, 비주얼 아트 인플루언서를 위한 하이엔드 포트폴리오 테마입니다. 강렬하고 깊은 크림슨 레드 포인트와 세련된 샌드 베이지 배경, 시크한 매트 블랙 포인트가 결합되어 한 편의 패션 매거진을 펼친 듯한 감각적인 시각적 몰입감을 제공합니다.",
    image: "/templates/model_editorial_crimson.png",
    theme: {
      fontFamily: "Playfair Display, serif",
      colors: {
        primary: "#dc2626",     // 강렬한 크림슨 레드
        secondary: "#f5ebe0",   // 세련된 샌드 베이지
        accent: "#111827",      // 시크한 매트 블랙
        background: "#fffbf9",  // 부드러운 오프화이트
        surface: "#ffffff",     // 순백색 컨테이너
        text: "#1c1917"         // 스톤 다크 브라운
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "렌즈 너머로 무한한 페르소나를 투영하다",
        subtitle: "정형화된 틀을 깨부수고, 옷과 공간의 서사를 완벽하게 표현하는 하이엔드 패션 모델이자 비주얼 아티스트의 프리미엄 포트폴리오 스페이스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "컴필레이션 뷰",
          ctaLink: "#portfolio",
          features: [
            { text: "글로벌 패션위크 런웨이 및 하이엔드 브랜드 메인 캠페인 모델" },
            { text: "예술적 아우라를 담은 커머셜 및 독립 에디토리얼 매거진 화보" }
          ]
        }
      },
      {
        section_type: "services",
        title: "비주얼 퍼포먼스 영역",
        subtitle: "단순한 촬영을 넘어 브랜드의 가치를 온몸으로 표현하는 아트 에디션 서비스입니다.",
        content_data: {
          items: [
            {
              title: "하이엔드 런웨이 및 패션쇼",
              description: "디자이너가 직조한 텍스처와 형태의 무드를 무대 위 워킹과 시선 처리로 완벽하게 표현하여 컬렉션의 찬사를 이끌어냅니다.",
              icon: "Sparkles"
            },
            {
              title: "에디토리얼 & 매거진 룩북",
              description: "고해상도 카메라 프레임 아래에서 빛과 조명을 조율하며 브랜드의 페르소나를 날카롭고 입체적으로 연출하는 화보 아카이빙입니다.",
              icon: "Eye"
            },
            {
              title: "비주얼 아트 디렉션 협업",
              description: "인플루언서이자 아티스트의 안목으로 디지털 미디어 피드 구성, 무드 보드 기획 및 크리에이티브 브랜딩 방향성을 공동 기획합니다.",
              icon: "Paintbrush"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "크림슨 프레임 레코드",
        subtitle: "빛과 그림자 속에서 강렬한 아이덴티티를 드러낸 대표작 컬렉션입니다.",
        content_data: {
          items: [
            { title: "붉은 심연: 글로벌 브랜드 S/S 메인 화보", description: "크림슨 레드 조명과 매트 블랙 슈트의 강렬한 대비 속에서 인간의 고독을 묘사한 대표 에디토리얼 컷", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
            { title: "클래식 보그: 밀라노 런웨이 하이라이트", description: "전통적 실루엣과 감각적인 현대 워킹의 조화로 밀라노 패션위크 현장을 매료시킨 실시간 런웨이 아카이브", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80" },
            { title: "샌드 앤 섀도우: 캡슐 워드롭 내추럴 스냅", description: "샌드 베이지 톤의 자연광 스튜디오에서 소재 본연의 부드러움을 극대화하여 연출한 퍼스널 라이프스타일 룩북", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "몸짓으로 서사를 새기는 비주얼 뮤즈",
        subtitle: "패션은 단순한 옷이 아닌, 한 시대의 공기와 인간의 내면을 표현하는 침묵의 언어입니다.",
        content_data: {
          description: "안녕하세요. 렌즈 앞에 서는 순간부터 셔터가 멈출 때까지, 오직 몸짓과 눈빛 하나로 브랜드의 거대한 세계관을 직조해 내는 에디토리얼 모델이자 비주얼 아티스트 크림슨입니다. 수많은 글로벌 런웨이와 하이엔드 매거진 화보를 거치며 형태와 빛을 다루는 감각을 단단하게 다져왔습니다. 유행을 선도하는 화려함 이면에 깊은 사유와 예술적 태도가 깃든 진짜 비주얼 포트폴리오를 지향합니다.",
          stats: [
            { label: "총 프로젝트 런웨이", value: "60회 이상" },
            { label: "협업 하이엔드 매거진", value: "35+ 브랜드" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "단 하나의 독창적인 비주얼을 함께 완성하세요",
        subtitle: "새로운 시즌 브랜드 룩북 촬영, 매거진 에디토리얼 협업 및 크리에이티브 비주얼 디렉션 제안은 아래를 통해 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "아티스트 부킹하기"
        }
      }
    ]
  },

  calligrapher_ink_mono: {
    templateId: "calligrapher_ink_mono",
    name: "수묵 캘리그래퍼",
    category: "Portfolio",
    description: "전통 서예가, 한글 타이포 아티스트, 동양풍 크리에이터를 위한 정갈한 지성 무드의 테마입니다. 물기를 머금은 연화이트 한지 질감 배경에 은은한 붓먹색과 붉은 낙관을 상징하는 스칼렛 레드 한 방울 포인트가 만나 극도의 절제미를 담은 직선의 미학을 선사합니다.",
    image: "/templates/calligrapher_ink_mono.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#1c1917",     // 붓먹색 (Charcoal Ink Black)
        secondary: "#f5f5f4",   // 연화이트 한지 질감
        accent: "#dc2626",      // 낙관을 상징하는 스칼렛 레드
        background: "#fafaf9",  // 정갈한 오프화이트
        surface: "#ffffff",     // 화이트 캔버스 표면
        text: "#292524"         // 타자기 먹색 다크 브라운
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "붓끝에서 일어나는 먹의 호흡과 글씨의 서사",
        subtitle: "획의 굵기와 속도, 먹의 번짐 속에 번뇌와 일상의 평온을 함께 담아내는 전통 서예와 현대 타이포그래피가 융합된 아날로그 동양풍 아카이브 공간입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
          ctaText: "묵적(墨跡) 감상하기",
          ctaLink: "#portfolio",
          features: [
            { text: "전통 서예 기법을 현대적으로 리브랜딩한 타이포 아트웍" },
            { text: "정갈한 한지 위에 먹과 여백으로 표현한 수묵 크리에이티브" }
          ]
        }
      },
      {
        section_type: "services",
        title: "수묵 타이포 솔루션",
        subtitle: "오랜 수련의 붓끝으로 브랜드의 격조와 영혼을 선명하게 새겨넣는 예술 작업 영역입니다.",
        content_data: {
          items: [
            {
              title: "현대 한글 타이포그래피 & BI 디자인",
              description: "영화 타이틀, 전통 F&B 패키지, 대형 브랜드 로고의 정체성을 붓글씨 고유의 묵직한 서사적 형태감으로 디자인합니다.",
              icon: "Feather"
            },
            {
              title: "수묵 오브제 및 공간 캘리그래피",
              description: "대형 한지 슬라이드 패널이나 미술관 벽면에 여백의 미를 살린 붓먹 아트를 작화하여 깊은 공간감을 부여합니다.",
              icon: "Palette"
            },
            {
              title: "프라이빗 집필 워크숍 & 소통",
              description: "숨을 고르고 붓을 들어 벼루에 먹을 가는 고요한 시간 속에서, 내면의 감정을 선으로 직조해 나가는 마인드 테라피를 제안합니다.",
              icon: "Smile"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "먹으로 번진 사유의 흔적들",
        subtitle: "바쁜 세상에서 속도를 늦추고 온전히 필력으로 밀도 높게 빌드해 낸 오리지널 수묵 작품집입니다.",
        content_data: {
          items: [
            { title: "비움의 노래: 현대 수묵 캘리전", description: "Charcoal Ink Black의 농담 조절만으로 한지 위에 인간의 탄생과 소멸을 함축하여 연출한 메인 아트웍", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "정통 사극 영화 '일월' 메인 타이틀 디자인", description: "강인한 획의 굵기 대비 속에 스칼렛 레드 낙관 포인트를 주어 시대의 비장함과 비극적 서사를 표현한 타이포 타이틀", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80" },
            { title: "헤리티지 F&B 브랜드 패키지 캘리", description: "수십 년간 전통을 지켜온 명인의 한과 패키지에 부드러운 붓바람의 결을 새겨 완성한 감각적인 전통 로고 브랜딩", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "붓과 여백으로 한지 위의 삶을 받아적다",
        subtitle: "말은 바람을 타고 날아가지만, 먹으로 새긴 글씨는 천 년의 시간을 견뎌 마음을 흔듭니다.",
        content_data: {
          description: "안녕하세요. 전통 서예의 정통성을 현대적인 그래픽 언어로 리브랜딩하는 서예가이자 타이포 아티스트 잉크모노입니다. 저는 디지털 픽셀의 차가움 대신, 벼루에 먹을 갈며 숨을 고르는 찰나의 아날로그 침묵 속에서 삶의 깊은 이치를 깨닫곤 합니다. 불필요한 장식적 수식어를 배제하고, 오직 선의 힘과 먹의 농담, 그리고 비워둔 여백만으로 심장을 관통하는 단 하나의 서사를 빚어냅니다.",
          stats: [
            { label: "국내외 초청 전시회", value: "18회 참여" },
            { label: "소장 완료된 서화", value: "240점 돌파" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "먹향 가득한 서재로의 다정한 초대",
        subtitle: "대형 타이틀 캘리그래피 외주 의뢰, 인테리어용 수묵화 프린트 구매, 혹은 독립 문화 예술 컬래버레이션은 하단에 고결한 문장으로 건네주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "서예가에게 신호 보내기"
        }
      }
    ]
  },

  culinary_chef_warm: {
    templateId: "culinary_chef_warm",
    name: "오가닉 셰프 다이닝",
    category: "Portfolio",
    description: "푸드 스타일리스트, 프리랜서 셰프, 미식 기획 및 컨설턴트를 위한 크리에이티브 홈키친 테마입니다. 노릇하게 구워진 오렌지 브라운과 버터빛이 도는 웜 옐로우 표면, 다크 초콜릿 같은 깊은 브라운 본문색이 식탁 위의 온기를 포근하게 전합니다.",
    image: "/templates/culinary_chef_warm.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#d97706",     // 오렌지 브라운
        secondary: "#fffbeb",   // 버터빛 웜 옐로우
        accent: "#9a3412",      // 러스트 딥 브라운
        background: "#fdfbfc",  // 부드러운 크림 브라운 오프화이트
        surface: "#fffbeb",     // 소프트 웜 옐로우 카드
        text: "#451a03"         // 다크 초콜릿 브라운 본문
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "식탁 위에 피어나는 가장 다정한 미식 가이드",
        subtitle: "자연에서 온 신선한 제철 식재료와 장인의 노하우가 조화를 이루는 고품격 홈쿡 오가닉 다이닝 클래스 및 푸드 브랜딩 비주얼 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "레시피 아카이브",
          ctaLink: "#portfolio",
          features: [
            { text: "식재료 본연의 맛과 영양을 극대화하는 슬로우 라이프 쿡" },
            { text: "트렌디한 레스토랑의 메뉴 개발 및 F&B 크리에이티브 브랜딩" }
          ]
        }
      },
      {
        section_type: "services",
        title: "테이스티 디자인 스튜디오",
        subtitle: "주방의 기쁨을 더하고 건강한 미식 생태계를 구축하기 위한 전문 셰프 서비스 세션입니다.",
        content_data: {
          items: [
            {
              title: "스페셜티 푸드 스타일링 & 촬영",
              description: "광고, 요리책 룩북의 가치를 위해 플레이팅 계량부터 식기 매칭, 컬러 감각 밸런스까지 명품 푸드 비주얼을 연출합니다.",
              icon: "Palette"
            },
            {
              title: "F&B 비즈니스 메뉴 컨설팅",
              description: "트렌디한 레스토랑의 아이덴티티에 최적화된 시그니처 제철 레시피를 개발하고 주방 원가 절감 효율 시퀀스를 처방합니다.",
              icon: "Award"
            },
            {
              title: "프라이빗 다이닝 & 쿠킹 클래스",
              description: "아늑한 주방에서 도심의 소음을 비워내고 맛있는 빵 냄새 속에서 함께 치유되는 프라이빗 홈베이킹 마스터 클래스를 이끕니다.",
              icon: "Coffee"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "식탁 위에 차려진 미식 이야기",
        subtitle: "음식의 온기와 제철 식재료의 조형미가 완벽한 조화를 이룬 대표 푸드 아카이브입니다.",
        content_data: {
          items: [
            { title: "자연을 담은 제철 가든 테이블", description: "봄나물과 천연 발효 오일을 배합하여 재료 본연의 파스텔 연둣빛을 극대화한 파인 다이닝 플레이팅 프로젝트", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
            { title: "오븐 속의 행복: 유기농 베이킹 북", description: "노릇한 오렌지 브라운의 빵 결이 살아 숨 쉬는 과정을 카메라 프레임에 입체적으로 담아낸 출판 일러스트 가이드", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" },
            { title: "모던 프렌치 비스트로 팝업 디렉션", description: "다크 초콜릿 색상의 테이블웨어와 미니멀한 플레이팅 기법으로 젊은 층의 바이럴을 이끈 시그니처 팝업 메뉴 컨설팅", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "주방의 소리 속에서 진심을 빚는 푸드 아키텍트",
        subtitle: "요리는 한 인간의 사랑과 정성을 다른 이의 몸과 마음에 전달하는 가장 온전한 예술적 태도입니다.",
        content_data: {
          description: "안녕하세요. 보글보글 찌개 끓는 소리와 달콤한 버터 향 속에서 세상을 더 맛있게 변화시켜 나가는 오가닉 프리랜서 셰프이자 푸드 디렉터 웜셰프입니다. 화려한 분자 요리나 자극적인 인스턴트 소스 대신, 우리 땅에서 정직하게 자라난 제철 식재료 본연의 은은한 맛을 복원하는 일에 몰두해 왔습니다. 저의 식탁에 머무시는 동안 미식의 감동을 느껴보세요.",
          stats: [
            { label: "컨설팅 성공 F&B 브랜드", value: "45곳 돌파" },
            { label: "창작 보유 오가닉 레시피", value: "320개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "주방의 향긋한 문을 열어보세요",
        subtitle: "신규 레스토랑 메뉴 개발 의뢰, 매력적인 매거진 푸드 스타일링 룩북 촬영, 혹은 프라이빗 쿠킹 마스터 클래스 신청은 아래를 통해 제안해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "셰프와 다이닝 예약하기"
        }
      }
    ]
  },

  game_designer_neon: {
    templateId: "game_designer_neon",
    name: "레트로 게임 디자이너",
    category: "Portfolio",
    description: "인디 게임 개발자, 레트로 도트 아티스트, 픽셀 크리에이터를 위한 테크니컬 경쾌 무드의 테마입니다. 밤하늘을 닮은 딥 인디고 블랙 배경에 빛나는 사이버 퍼플과 펄스 네온 그린 액센트가 결합되어 오락실의 향수를 세련되게 재현합니다.",
    image: "/templates/game_designer_neon.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#a855f7",     // 사이버 퍼플
        secondary: "#22c55e",   // 펄스 네온 그린
        accent: "#ec4899",      // 일렉트릭 네온 핑크
        background: "#030712",  // 딥 인디고 블랙
        surface: "#111827",     // 테크니컬 다크 그레이 카드
        text: "#f9fafb"         // 광채가 도는 라이트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "8비트 픽셀 너머로 무한한 모험의 세계를 구현하다",
        subtitle: "레트로 오락실의 하이 콘트라스트 감성과 현대적 인터랙티브 시스템의 결합! 유저들을 단숨에 매료시키는 독창적인 인디 게임 루틴과 테크니컬 아트웍 스페이스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "플레이 데모 테스트",
          ctaLink: "#portfolio",
          features: [
            { text: "향수를 자극하는 정교한 수작업 2D/3D 픽셀 도트 아트웍" },
            { text: "중독성 높은 게임 매커니즘 및 크로스 플랫폼 최적화 코딩" }
          ]
        }
      },
      {
        section_type: "services",
        title: "크리에이티브 코딩 매트릭스",
        subtitle: "아이디어 기획부터 레벨 디자인, 최종 빌드까지 올인원으로 컨트롤하는 하이테크 개발 엔진 영역입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 인디 게임 개발",
              description: "유니티 및 커스텀 엔진을 활용하여, 모바일과 PC 환경에서 심리스하게 구동되는 액션 알피지 및 퍼즐 게임 백엔드 아키텍처를 마스터 빌드합니다.",
              icon: "Sparkles"
            },
            {
              title: "레트로 도트 아트 & 캐릭터 디자인",
              description: "선과 점의 제한된 규격 속에서 개성 넘치는 애니메이션 생명력을 불어넣는 도트 그래픽 캐릭터 스프라이트 시퀀스를 제작합니다.",
              icon: "Scissors"
            },
            {
              title: "인터랙티브 레벨 & UI/UX 설계",
              description: "유저가 지루할 틈 없이 몰입하도록 치밀하게 보스 동선을 설계하고, 사이버 펑크 무드의 네온 UI 컴포넌트 시스템을 구축합니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "배포된 디지털 유니버스",
        subtitle: "마케팅 버블을 걷어내고 숫자가 입증하는 유저 평점 극찬의 오리지널 게임 타이틀입니다.",
        content_data: {
          items: [
            { title: "네온 나이트(Neon Knight): 사이버 플래터", description: "펄스 네온 그린과 퍼플 스펙트럼 광원을 레이아웃에 매칭하여 스피드감을 극대화한 레트로 횡스크롤 게임", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" },
            { title: "도트 오디세이: 가상 픽셀 RPG", description: "추억의 향수를 자극하는 수작업 도트 그래픽과 방대한 오픈월드 퀘스트 구조를 융합하여 호평을 받은 타이틀", image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80" },
            { title: "픽셀 던전 브레이커: 실시간 퍼즐", description: "Z세대의 키치함을 저격하는 화려한 이펙트 튜닝과 중독성 높은 매커니즘 설계로 인기를 끈 모바일 퍼즐 게임", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "터미널 뒤에서 새로운 가상 세계를 직조하는 코더",
        subtitle: "가장 훌륭한 게임은 화려한 그래픽이 아니라, 패드에서 손을 뗄 수 없게 만드는 치밀한 규칙 설계에서 나옵니다.",
        content_data: {
          description: "안녕하세요! 네온 빛 오락실 브라운관 뒤에서 자라나 현재는 글로벌 유저들을 매료시키는 인디 게임 개발자 겸 레트로 도트 아티스트 네온입니다. 저는 단순한 코딩을 넘어, 유저가 게임 속 아바타와 완벽하게 동화되어 짜릿한 카타르시스를 느낄 수 있는 하이테크 레벨 디자인과 사운드 싱크에 몰두하고 있습니다. 저의 디지털 연구소에서 펼쳐지는 기발한 모험을 함께 플레이해 보세요.",
          stats: [
            { label: "글로벌 다운로드 수", value: "250,000+ Downloads" },
            { label: "보유 도트 캐릭터 소스", value: "1,200개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "새로운 라운드의 게임을 스타트하세요",
        subtitle: "외주 퍼블리싱 제안, 도트 아트웍 아웃소싱 브리프 공유, 혹은 기발한 게임 아이디어 테스팅 협업 문의는 언제든 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "개발자에게 코인 넣기"
        }
      }
    ]
  },

  florist_botanical_sage: {
    templateId: "florist_botanical_sage",
    name: "보태니컬 플로리스트",
    category: "Portfolio",
    description: "가든 웨딩 디렉터와 플라워 샵 오너를 위한 다정하고 화사한 무드의 파스텔 테마 템플릿입니다. 차분한 세이지 그린 바탕과 크림 화이트 표면 위에 우아한 라벤더 보랏빛 포인트가 조화를 이루며 식물의 싱그러운 곡선미를 전합니다.",
    image: "/templates/florist_botanical_sage.png",
    theme: {
      fontFamily: "Pretendard, Quicksand, sans-serif",
      colors: {
        primary: "#10b981",     // 민트 초록 (식물의 싱그러움)
        secondary: "#f5f5f4",   // 크림 화이트 표면
        accent: "#8b5cf6",      // 우우한 라벤더 보랏빛
        background: "#f0fdf4",  // 차분한 세이지 그린 바탕
        surface: "#ffffff",     // 정갈한 컨테이너 카드
        text: "#1f2937"         // 다크 그레이 블랙
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "꽃의 화사함과 자연의 숨결을 일상에 엮다",
        subtitle: "생애 한 번뿐인 아름다운 야외 가든 웨딩 총괄 디렉션부터, 계절의 변화에 맞춰 나만의 소박한 쉼표를 만드는 내추럴 플라워 브랜딩 오브제 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "플라워 아카이브",
          ctaLink: "#portfolio",
          features: [
            { text: "꽃 본연의 색감과 실루엣을 살린 하이엔드 프렌치 스타일링" },
            { text: "공간의 아우라를 완전히 바꾸는 세련된 보태니컬 플랜테리어" }
          ]
        }
      },
      {
        section_type: "services",
        title: "보태니컬 아트 디자인",
        subtitle: "자연이 주는 가장 우아한 선물로 사람의 마음에 울림을 전하는 플로리스트 서비스 영역입니다.",
        content_data: {
          items: [
            {
              title: "가든 웨딩 & 공간 디렉션",
              description: "신랑 신부의 아름다운 로맨스를 한 편의 동화처럼 시각화합니다. 버진 로드 조형물 설계부터 테이블 꽃 배치까지 완벽하게 총괄합니다.",
              icon: "Heart"
            },
            {
              title: "커스텀 플라워 부케 & 기프트",
              description: "라벤더 보랏빛과 크림 화이트 패브릭의 세련된 조화를 바탕으로, 소중한 기념일을 영원히 추억할 수 있는 프리미엄 꽃다발을 큐레이션합니다.",
              icon: "Sparkles"
            },
            {
              title: "프라이빗 보태니컬 마스터 클래스",
              description: "꽃의 얼굴을 마주하고 줄기를 다듬는 몰입의 시간 속에서, 일상의 번아웃을 비워내고 힐링하는 아로마 가드닝 수업을 이끕니다.",
              icon: "Smile"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "풀잎 사이에 피어난 기적들",
        subtitle: "식물의 유기적인 실루엣과 꽃의 화사함을 감각적으로 배치한 대표 아트웍 갤러리입니다.",
        content_data: {
          items: [
            { title: "비밀의 정원: 야외 하우스 웨딩", description: "세이지 그린의 숲속 배경에 생기 넘치는 꽃들을 큐레이션하여 로맨틱한 파라다이스를 연출한 총괄 디렉션 프로젝트", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
            { title: "라벤더 드림: 하이엔드 플라워 박스", description: "우아한 보랏빛 장미와 수국을 세련된 라운드 패키지에 담아내어 감동의 시각적 선물을 선사한 커스텀 패키지", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80" },
            { title: "어반 가든 스튜디오 쇼룸 가이드", description: "민트 초록 식물들과 정갈한 크림 화이트 가구를 융합하여 조도를 극대화한 보태니컬 리빙 윈도우 인테리어", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "자연의 다정함을 선물하는 플로리스트 세이지",
        subtitle: "식물을 돌보는 행위는 결국 나의 메마른 마음의 밭에 물을 주는 일과 같습니다.",
        content_data: {
          description: "안녕하세요. 콘크리트 도심 속 빌딩 숲에서 싱그러운 꽃 향기로 위로를 전하는 보태니컬 아티스트 겸 플라워 숍 오너 세이지입니다. 저는 인위적으로 꽉 채워진 조화 디자인보다 잎새 고유의 유기적인 곡선미와 꽃이 피고 지는 자연의 순리 속에서 가장 우아한 형태의 예술을 발견하곤 합니다. 저의 아틀리에에 머무시는 동안 향긋한 힐링을 온전히 누려보세요.",
          stats: [
            { label: "웨딩 스타일링 수료", value: "180커플 돌파" },
            { label: "원데이 클래스 수강생", value: "1,500명 돌파" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "일상에 화사한 꽃바람을 들여놓으세요",
        subtitle: "야외 결혼식 공간 디렉팅 의뢰, 프라이빗 단체 원데이 가드닝 클래스 신청, 혹은 소중한 부케 정기 발주는 아래 양식을 채워 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "플로리스트와 향긋하게 소통하기"
        }
      }
    ]
  },

  architect_space_portfolio: {
    templateId: "architect_space_portfolio",
    name: "스페이스아치 건축 공간 포트폴리오",
    category: "Portfolio",
    description: "묵직한 매트 현무암 차콜 그레이와 거친 콘크리트 실버, 그리고 따뜻한 점토 토기 테라코타 오렌지 포인트 배합이 구조물과 입체 공간의 깊이를 전하는 건축가 포트폴리오 테마입니다.",
    image: "/templates/architect_space_portfolio.png",
    theme: {
      fontFamily: "Space Grotesk, Noto Serif KR, sans-serif",
      colors: {
        primary: "#27272a",     // 매트한 질감의 스톤 차콜
        secondary: "#f4f4f5",   // 매끄러운 아노다이징 알루미늄 그레이
        accent: "#d97706",      // 점토 오렌지 테라코타
        background: "#fafaf9",  // 정갈한 석고 보드 오프화이트
        surface: "#ffffff",     // 정돈된 백색 아크릴 도판
        text: "#18181b"         // 가독성 높은 다크 슬레이트 차콜
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "선과 면의 정밀한 비례 속에 자연의 햇살을 채워 넣는 입체 공간 포트폴리오",
        subtitle: "장식적 가식을 제거한 미니멀리즘 건축 아키텍처입니다. 대지의 성격 분석부터 노출 콘크리트, 황동, 유리의 본연의 물성을 드러내어 시간의 흐름에 따라 변화하는 빛의 그림자 궤적을 기록한 건축가의 엄선된 작품집입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "설계 준공 프로젝트 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "빛과 바람의 통로를 과학적으로 추적 시뮬레이션한 입체 3D BIM 설계 기술" },
            { text: "수령 100년 전통 한옥 한옥 고목재와 현대 콘크리트의 조화로운 오가닉 매칭" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스파셜 디자인 영역",
        subtitle: "인간이 머무는 자리를 가장 정직하고 풍요로운 사색의 아우라로 채우는 설계 범주입니다.",
        content_data: {
          items: [
            {
              title: "하이엔드 주거 단독주택 설계",
              description: "도시 소음을 차단하고 정원을 내부로 품은 모노리스 단독주택의 평면 비례와 입면을 구성합니다.",
              icon: "Compass"
            },
            {
              title: "친환경 패시브 빌딩 디자인",
              description: "외벽 삼중단열과 열교환 공조 시스템을 융합하여 화석 연료 없이 사계절 쾌적함을 사수하는 에너지 설계입니다.",
              icon: "Zap"
            },
            {
              title: "재생 한옥 및 공간 리노베이션",
              description: "오래된 구옥의 서까래와 철골 H빔을 세련되게 크로스 매칭하여 아날로그 카페/갤러리 공간으로 튜닝합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "콘크리트와 빛의 이중주",
        subtitle: "형태는 기능을 따르며 여백 속에서 기품을 품는 아키텍트 준공작 목록입니다.",
        content_data: {
          items: [
            { title: "숲속 미니멀 노출 콘크리트 빌라", description: "하얀 화강암 옹벽 사이로 대형 통유리창을 내어 사계절 숲속 수목이 한 폭의 그림처럼 실내에 투영되는 단독주택", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
            { title: "종로 가옥 한옥 서까래 재생 갤러리", description: "낡은 나무 대들보 아래 검은 실버 메탈 테이블을 매칭하여 고풍스럽고 모던한 아우라를 뿜는 상업 공간 쇼룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "테라코타 파사드 빌딩 외관 스케치", description: "황토 벽돌 타일이 햇살의 각도에 따라 온화한 주황색과 짙은 브라운 색상의 그라데이션 음영을 자아내는 건물 파사드", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "건축은 형태의 사치가 아닌, 인간의 존엄을 보호하며 머무는 이에게 침묵의 휴식을 선물하는 물리적 주춧돌입니다",
        subtitle: "모든 설계는 대지 고유의 정령과 바람 소리를 방해하지 않는 흐름의 미학을 엄수합니다.",
        content_data: {
          description: "안녕하세요. 스페이스아치 건축 공간 포트폴리오의 파트너 건축가입니다. 저는 벽지를 두껍게 발라 공간의 정직한 물성을 숨기는 기성 인테리어를 지양합니다. 돌, 철, 콘크리트, 유리가 지닌 본래의 거칠고 매끄러운 텍스처를 그대로 노출하여, 매일 아침 거실 깊숙이 들어오는 아침 햇살과 긴 그림자가 만드는 시간의 아름다움을 정직하게 담아내고 있습니다.",
          stats: [
            { label: "시공 준공 완료 작품 수", value: "24개 건축물" },
            { label: "공간 디자인 수상 경력", value: "6회 골드메달" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "건축 설계 및 공간 자문 신청",
        subtitle: "신축 예정 대지의 지번, 주 용도(단독주택/상업 빌딩/카페 리뉴얼), 원하시는 공간 설계 방향을 남겨주시면 조용히 노크하겠습니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "건축가와 직접 상담하기"
        }
      }
    ]
  },

  fashion_lookbook_portfolio: {
    templateId: "fashion_lookbook_portfolio",
    name: "보그핏 하이엔드 패션 디렉터 포트폴리오",
    category: "Portfolio",
    description: "압도적인 스튜디오 보그 블랙과 세련된 오키드 핑크, 그리고 강렬한 벨벳 레드 포인트 조화로 런웨이 하이 패션 화보와 컬렉션 디렉팅을 대담하게 전하는 템플릿입니다.",
    image: "/templates/fashion_lookbook_portfolio.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#111827",     // 하이패션 보그 다크 블랙
        secondary: "#fae8ff",   // 시크한 오키드 라이트 핑크
        accent: "#b91c1c",      // 관능적인 벨벳 로즈 레드
        background: "#fafaf9",  // 정갈한 스튜디오 석고 오프화이트
        surface: "#ffffff",     // 맑은 아크릴 캔버스 화이트
        text: "#1f2937"         // 시인성 높은 스톤 슬레이트 차콜
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "획일화된 의류 룩북의 구도를 단호히 탈피하고, 옷의 실루엣이 쓰는 전율의 무대 페르소나",
        subtitle: "공장에서 찍어내듯 가볍게 소비되는 쇼핑몰 사진을 혐오합니다. 우리는 패션 디렉터로서의 대담한 연출 기획과, 벨벳 실크 실크 질감 극대화 조명 컨트롤, 그리고 모델의 강렬한 눈빛이 조화를 이루어 브랜드를 동경의 아이콘으로 끌어올리는 하이엔드 런웨이 아카이브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "컬렉션 포트폴리오 열람",
          ctaLink: "#portfolio",
          features: [
            { text: "글로벌 패션위크 런웨이 및 하이패션 화보집 총괄 메이저 룩북 기획 시뮬레이션 탑재" },
            { text: "패브릭 원단 고유의 유기적인 드레이핑 텍스처를 고대비 조명으로 살려내는 특수 포토 촬영" }
          ]
        }
      },
      {
        section_type: "services",
        title: "패션 디렉션 에센셜",
        subtitle: "패션 브랜드의 아이덴티티를 동경의 아이콘으로 가꾸어내는 연출 프로그램입니다.",
        content_data: {
          items: [
            {
              title: "시즌 런웨이 콘셉트 큐레이팅",
              description: "브랜드 철학에 맞는 시즌 스토리를 시각화합니다. 모델 캐스팅부터 런웨이 동선, 무대 샹들리에 음영까지 총괄 설계합니다.",
              icon: "Sparkles"
            },
            {
              title: "하이패션 브랜드 화보 룩북",
              description: "오키드 핑크 톤과 벨벳 레드의 보색 조화를 활용하여, 잡지 지면에 수록될 강렬하고 매혹적인 아트 화보를 디렉팅합니다.",
              icon: "Heart"
            },
            {
              title: "비주얼 아이덴티티 브랜드 컨설팅",
              description: "신진 패션 디자이너 브랜드의 클래식 가치를 조명하고 로고 디자인, 패키지 백, 폰트 규격을 통합 제안합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "런웨이 화보 & 아티스틱 컷",
        subtitle: "시각적 소음을 완벽 차단하고 오직 의상의 강렬한 아우라에만 집중하게 돕는 갤러리입니다.",
        content_data: {
          items: [
            { title: "벨벳 드레스를 입은 모델의 동선", description: "어두운 스튜디오 음영 속에서 선홍빛 롱 드레스 자락이 나비 날개처럼 휘날리는 관능적이고 대담한 스틸 샷", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" },
            { title: "해체주의적 실크 재킷 피팅 전경", description: "화이트 행거 위에 불규칙한 드레이핑의 네이비 실크 셔츠와 실버 금속 장식 단추들이 클로즈업된 작업실 무드 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "패션 비엔날레 쇼룸 디렉팅 전경", description: "하얀 석고 조각상 옆에 대담하게 비대칭 핏의 블랙 모직 코트를 마네킹에 코디하여 공간의 예술성을 살려낸 전시 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "패션은 몸을 가리는 단순한 직물의 조각이 아닌, 나라는 인간의 고유한 철학과 선언을 대외적으로 선포하는 가장 강력하고 우아한 시각적 무기입니다",
        subtitle: "모든 기획 화보는 단순한 유행을 거부하고, 10년 뒤에 꺼내 보아도 기품이 훼손되지 않는 오리지널 가치를 지향합니다.",
        content_data: {
          description: "안녕하세요. 하이엔드 패션 디렉터이자 비주얼 아티스트입니다. 저는 싼 티가 나는 기성 트렌드 상품의 단순한 나열을 혐오합니다. 의상은 인간의 신체를 매개로 완성되는 입체적인 조각 예술입니다. 저는 원단의 작은 주름 하나, 단추 하나의 유기적인 비례, 그리고 모델이 뿜어내는 깊은 아우라를 조화롭게 연출하여 브랜드 고유의 동경과 신화를 대중의 뇌리에 깊숙이 각인시키고 있습니다.",
          stats: [
            { label: "디렉팅 완료 패션 브랜드", value: "18개 브랜드" },
            { label: "총괄 참여 글로벌 패션쇼", value: "35회 개최" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "룩북 촬영 기획 및 비주얼 제휴 문의",
        subtitle: "브랜드명 및 콘셉트 설명, 시즌 화보 촬영 희망 일정, 혹은 패션쇼 총괄 연출 의뢰 신청서를 보내주시면 정중히 상담하겠습니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "디렉터와 기품 있게 소통하기"
        }
      }
    ]
  },

  "3d_motion_graphic_portfolio": {
    templateId: "3d_motion_graphic_portfolio",
    name: "네온웨이브 3D 모션 아티스트 포트폴리오",
    category: "Portfolio",
    description: "가상 우주의 딥 옵시디언 블랙과 발광 마젠타 핑크, 그리고 가상 레이저 네온 사이언 배합이 화려한 CGI 애니메이션과 3D 그래픽 렌더링 웍스를 전하는 테마입니다.",
    image: "/templates/3d_motion_graphic_portfolio.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ec4899",     // 발광 마젠타 핑크
        secondary: "#a78bfa",   // 사이버 바이올렛 퍼플
        accent: "#06b6d4",      // 가상 네온 레이저 시안
        background: "#050508",  // 딥 가상 우주 블랙
        surface: "#0e0e16",     // 슬레이트 퓨처 메탈 실버
        text: "#f8fafc"         // 시인성 높은 은빛 오프화이트
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "현실의 차원과 중력의 족쇄를 완전히 벗어나, 무한한 상상이 빚어내는 가상 공간의 3D 역동성",
        subtitle: "밋밋한 2D 플랫 그래픽의 지루함을 거부합니다. Blender와 Cinema4D 툴을 극단으로 다루어, 미세한 유리 질감의 굴절부터 액체의 유동성 크래쉬, 그리고 메탈의 찬란한 크롬 광원 효과를 동기화하여 초현실적인 몰입감을 극대화하는 3D 모션 그래픽 아티스트의 작업 아카이브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
          ctaText: "쇼릴 영상 및 3D 렌더스",
          ctaLink: "#portfolio",
          features: [
            { text: "물리 엔진 기반 0.01초 단위의 리얼한 액체 크래쉬 시뮬레이션 및 다이내믹 중력 모션 그래픽" },
            { text: "크롬 메탈 반사 질감과 광선 추적(Ray-Tracing) 옥테인 렌더러 기반 8K 초고화질 출력" }
          ]
        }
      },
      {
        section_type: "services",
        title: "CGI & 모션 디자인 스택",
        subtitle: "지상의 물리적 중력을 무시하고 시각적 전율을 가상 공간에 빚어내는 크리에이티브 파이프라인입니다.",
        content_data: {
          items: [
            {
              title: "3D 시그니처 옥테인 렌더링",
              description: "크롬 금속 질감, 투명한 글래스 굴절, 모래 입자 폭풍 등 하이엔드 물성 셰이딩 데이터를 정밀 렌더링합니다.",
              icon: "Zap"
            },
            {
              title: "브랜드 시네마틱 모션 쇼릴",
              description: "마젠타 핑크와 네온 시안 레이저의 세련된 아우라 조화를 활용하여, 브랜드의 오프닝 로고 타이틀과 시네마틱 트레일러 영상을 연출합니다.",
              icon: "Compass"
            },
            {
              title: "메타버스 스파셜 룸 디자인",
              description: "VR 공간이나 가상 전시 플랫폼에 사용될 초현실적인 유기적 곡선 건축 구조와 홀로그램 샹들리에 셋업을 설계합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "가상 차원의 크롬 렌더스",
        subtitle: "모든 렌더링 샷은 마젠타 핑크와 시안 레이저 조명이 역동적으로 교차하는 사이버 아우라 갤러리입니다.",
        content_data: {
          items: [
            { title: "유기적으로 회전하는 크롬 메탈 구체", description: "블랙 홀 공간 위에 핑크빛 홀로그램 레이저를 반사하며 미끄러지듯 팽창 수축하는 미래형 추상 모션 그래픽", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
            { title: "글래스 조각들이 폭발하며 굴절하는 찰나", description: "투명한 강화유리 파편 속으로 네온 시안 불빛이 산란 굴절되어 만화경처럼 영롱한 광원을 뿜는 정밀 렌더링 컷", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "사이버펑크 네온 로드 자율 질주 씬", description: "옵시디언 블랙 메탈 차량이 젖은 아스팔트 위 핑크색 웅덩이를 가르며 스피드 꼬리를 남기고 질주하는 가상 영상 샷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "about",
        title: "3D 모션 그래픽은 가상의 좌표 위에 뼈대를 세우고 텍스처를 이식하여, 존재하지 않던 꿈의 시각적 파편을 대중의 뇌리에 강렬히 폭발시키는 미래의 시각 마술입니다",
        subtitle: "모든 모션 연출은 옥테인/레드시프트 등 최고 사양 GPU 렌더 팜을 통해 딜레이 없이 8K로 추출됩니다.",
        content_data: {
          description: "안녕하세요. 네온웨이브 3D 모션 아티스트입니다. 저는 2차원 화면의 평범함과 제한에 타협하지 않습니다. 3차원 가상 엔진은 상상력의 경계를 무한대로 무너뜨리는 훌륭한 해방의 도구입니다. 저는 차가운 크롬 금속에 다정한 핑크빛 온기를 불어넣고, 투명한 유리에 레이저 시안 빛을 굴절시켜 눈이 시리도록 상쾌한 비주얼 임팩트를 설계합니다. 당신의 브랜드 스토리를 다이내믹한 미래의 영상으로 가치 상승시키겠습니다.",
          stats: [
            { label: "총괄 참여 상업 광고 영상", value: "48편 제작" },
            { label: "비핸스 베스트 크리에이티브 선정", value: "12회 수상" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "3D 모션 웍스 의뢰 및 콜라보레이션",
        subtitle: "의뢰하고자 하시는 브랜드 로고 오프닝/홍보 영상 타겟 기간, 연출 콘셉트 레퍼런스 링크, 예산 규모를 적어 전송해 주십시오.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아티스트와 미래형 소통하기"
        }
      }
    ]
  }
};