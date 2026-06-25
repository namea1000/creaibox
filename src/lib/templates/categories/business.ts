import { TemplateConfig } from "../registry";

export const BUSINESS_TEMPLATES: Record<string, TemplateConfig> = {
  business_standard: {
    templateId: "business_standard",
    name: "비즈니스 스탠다드",
    category: "Business",
    description: "신뢰감 있는 파란색 톤과 정갈한 레이아웃의 기업형 표준 템플릿",
    image: "/templates/business_standard.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#2563eb",     // Royal Blue
        secondary: "#1e293b",   // Dark Slate
        accent: "#3b82f6",      // Blue
        background: "#ffffff",  // White
        surface: "#f8fafc",     // Slate 50
        text: "#0f172a"         // Slate 900
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "혁신을 만드는 최고의 비즈니스 파트너",
        subtitle: "우리는 최고의 기술과 전략으로 귀사의 비즈니스 성장을 지원합니다.",
        content_data: {
          backgroundImage: "",
          ctaText: "서비스 안내",
          ctaLink: "#services",
          features: [
            { text: "전문성 기반 컨설팅" },
            { text: "실시간 성과 추적" },
            { text: "24/7 밀착 지원" }
          ]
        }
      },
      {
        section_type: "services",
        title: "제공하는 서비스",
        subtitle: "비즈니스 목표를 실현하기 위한 핵심 역량입니다.",
        content_data: {
          items: [
            {
              title: "전략적 기획",
              description: "성공적인 포지셔닝을 위한 체계적인 비즈니스 로드맵 설계",
              icon: "Layout"
            },
            {
              title: "마케팅 액셀러레이팅",
              description: "디지털 광고 및 SEO 최적화를 통한 유기적 고객 유치 극대화",
              icon: "TrendingUp"
            },
            {
              title: "인프라 최적화",
              description: "안정적이고 유연한 IT 시스템 및 클라우드 아키텍처 도입 지원",
              icon: "Cpu"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "회사 소개",
        subtitle: "지속 가능한 성장을 함께 만드는 사람들",
        content_data: {
          description: "저희 회사는 업계 리더로서 다년간 축적된 노하우와 우수한 파트너십을 바탕으로 차별화된 결과를 만들어내고 있습니다. 단순한 외주사가 아닌, 파트너로서 함께 고민하고 동반 성장해 나갑니다.",
          stats: [
            { label: "누적 프로젝트", value: "150+" },
            { label: "전문가 팀원", value: "30명+" },
            { label: "고객 만족도", value: "98%" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 상담 및 제휴 문의",
        subtitle: "비즈니스 성장, 지금 바로 시작하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 신청하기"
        }
      }
    ]
  },
  business_tech_dark: {
    templateId: "business_tech_dark",
    name: "IT/테크 엔터프라이즈 다크",
    category: "Business",
    description: "인공지능(AI) 솔루션, SaaS 소프트웨어, 클라우드 시스템 전문 기술 기업을 위한 미래지향적 다크 테마입니다. 딥 인디고 블랙 배경 위에 네온 시안 블루와 일렉트릭 퍼플 액센트를 조합하여 사이버네틱한 테크 감성을 선사합니다.",
    image: "/templates/business_tech_dark.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#22d3ee",     // 형광 시안 블루
        secondary: "#a855f7",   // 일렉트릭 퍼플
        accent: "#3b82f6",      // 테크 블루
        background: "#090d16",  // 미래지향적 딥 블랙
        surface: "#111827",     // 테크니컬 다크 그레이 카드
        text: "#e2e8f0"         // 가독성이 뛰어난 소프트 화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "인공지능과 클라우드로 글로벌 엔터프라이즈를 혁신하다",
        subtitle: "데이터 마이그레이션부터 실시간 대규모 AI 추론 인프라까지, 엔터프라이즈의 비즈니스 효율을 극대화하는 최상위 SaaS 테크놀로지 파이프라인을 공급합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
          ctaText: "기술 데모 신청하기",
          ctaLink: "#contact",
          features: [
            { text: "초당 수만 개의 데이터 패킷을 실시간 처리하는 확장형 인프라" },
            { text: "엔터프라이즈 보안 표준을 완벽히 충족하는 고가용성 솔루션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "혁신 기술 솔루션",
        subtitle: "엔터프라이즈 비즈니스의 디지털 전환과 가치 창출을 위해 설계된 차세대 코어 테크 스택입니다.",
        content_data: {
          items: [
            {
              title: "엔터프라이즈 AI 연산 인프라",
              description: "거대 언어 모델(LLM) 인프라 최적화 및 분산 컴퓨팅 엔진 아키텍처를 도입하여 복잡한 비즈니스 지표의 자동 예측 엔진을 빌드합니다.",
              icon: "Cpu"
            },
            {
              title: "차세대 SaaS 클라우드 매니지먼트",
              description: "쿠버네티스 기반의 멀티 클라우드 오케스트레이션 툴을 제공하여 가동 인프라 비용을 낮추고 가용성을 극한으로 끌어올립니다.",
              icon: "Layers"
            },
            {
              title: "사이버 제로 트러스트 보안 관제",
              description: "실시간 패킷 심층 분석 기법과 하이테크 차단 알고리즘을 활용하여 외부 자극과 데이터 유출 리스크를 원천 차단합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "디지털 유니버스를 리드하는 테크 파트너",
        subtitle: "마케팅 버블을 걷어내고 숫자가 입증하는 완벽한 하드웨어 성능만 증명합니다.",
        content_data: {
          description: "저희 테크 랩은 글로벌 테크 기업 및 연구소 출신의 시니어 엔지니어들이 의기투합하여 설립한 글로벌 클라우드 SaaS 전문 기업입니다. 복잡한 비즈니스 로직을 지능형 알고리즘으로 구조화하고 시스템 성능을 극한까지 최적화하는 데 깊은 아키텍처 정체성을 두고 있습니다. 글로벌 대기업과 유니콘 스타트업이 신뢰하는 고성능 원스톱 인프라 생태계를 만나보세요.",
          stats: [
            { label: "실시간 트래픽 가동율", value: "99.99%" },
            { label: "오픈소스 기여 아티팩트", value: "350개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "글로벌 기술 파트너십 구축",
        subtitle: "난이도 높은 인프라 마이그레이션, AI 솔루션 맞춤 연동, 혹은 엔터프라이즈 도입 비용 컨설팅이 필요하시다면 개발 연구소로 신호를 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "기술 엔지니어와 상담하기"
        }
      }
    ]
  },

  business_consulting_navy: {
    templateId: "business_consulting_navy",
    name: "경영 컨설팅 & 금융 파이낸셜",
    category: "Business",
    description: "자산 운용사, 법률 사무소, 글로벌 전문 경영 컨설팅 기업을 위한 고품격 비즈니스 템플릿입니다. 신뢰감을 선사하는 클래식 딥 네이비와 차분한 골드 옐로우 액센트가 정교하고 높은 시인성의 레이아웃을 제공합니다.",
    image: "/templates/business_consulting_navy.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 클래식 딥 네이비
        secondary: "#eab308",   // 차분한 골드 옐로우
        accent: "#0384c7",      // 신뢰의 스카이 블루
        background: "#fdfbf7",  // 아늑하고 고급스러운 아이보리 화이트
        surface: "#ffffff",     // 깨끗한 서페이스 컨테이너
        text: "#0f172a"         // 완벽한 가독성을 제공하는 슬레이트 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "명쾌한 데이터 분석과 통찰력으로 자산의 미래를 설계하다",
        subtitle: "복잡하게 요동치는 글로벌 거시 경제 리스크 속에서, 정밀한 재무 지표 시뮬레이션과 장기적 자산 배분 전략을 구축하여 지속 가능한 비즈니스 성장을 견인합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
          ctaText: "컨설팅 리포트 신청",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 매크로 금융 지표 추적 및 주간 경제 핵심 동향 정밀 진단" },
            { text: "기업 인수 합병(M&A) 리스크 예측 및 자산 포트폴리오 다각화 공식" }
          ]
        }
      },
      {
        section_type: "services",
        title: "전문 프리미엄 서비스",
        subtitle: "자산 성장 가속화와 리스크 최소화를 위한 글로벌 비즈니스 솔루션 라인업입니다.",
        content_data: {
          items: [
            {
              title: "글로벌 거시 경제 및 경영 전략 설계",
              description: "각 기업의 재무제표와 비즈니스 펀더멘털을 정밀 실사하여 시장 변화에 유기적으로 피벗할 수 있는 최적의 스케일업 전략을 제안합니다.",
              icon: "TrendingUp"
            },
            {
              title: "하이엔드 자산 포트폴리오 자문",
              description: "사회적 신뢰를 바탕으로 자산 배분 다각화 모델을 적용하여 단기 변동성을 헤지하고 장기적으로 복리 효과를 창출하도록 리드합니다.",
              icon: "BarChart"
            },
            {
              title: "M&A 및 법률 실사 리스크 관리",
              description: "국내외 규제 장벽과 자금 조달 리스크를 법률 센터와 공조해 꼼꼼하게 입체 분석함으로써 딜의 성사율과 안전성을 극대화합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "이성과 신뢰의 파이낸셜 파트너",
        subtitle: "감정에 휘둘리지 않는 냉철한 분석으로 투자의 안개를 걷어냅니다.",
        content_data: {
          description: "저희 경영 파이낸셜 그룹은 증권사 리서치 센터, 자산운용사, 글로벌 컨설팅 펌 경력을 지닌 업계 최고의 스페셜리스트들로 구성되어 있습니다. 고객과의 흔들리지 않는 신뢰를 최우선으로 여기며, 단순한 정성적 예측을 넘어 계량화된 정밀 데이터로만 자산의 흐름을 분석합니다. 기업과 자산가가 승리할 수 있는 올바른 파이낸셜 패러다임을 처방해 드립니다.",
          stats: [
            { label: "누적 운용 자산 규모", value: "2.5조 원+" },
            { label: "기업 컨설팅 만족도", value: "98.7%" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프리미엄 위클리 인사이더 리포트 신청",
        subtitle: "매주 월요일 장 시작 전, 글로벌 경영 전략 핵심 요약본과 금융 자산 배분 가이드라인을 메일함으로 가장 먼저 전달해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "파트너십 문의하기"
        }
      }
    ]
  },

  business_agency_creative: {
    templateId: "business_agency_creative",
    name: "크리에이티브 디지털 광고 대행사",
    category: "Business",
    description: "마케팅 에이전시, 브랜드 기획사, 디자인 종합 스튜디오를 위한 트렌디 감성의 테마입니다. 대담한 딥 플럼 바이올렛과 솜사탕 핑크가 글래스모피즘 효과와 조화를 이루어 세련된 글로벌 룩을 보여줍니다.",
    image: "/templates/business_agency_creative.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#4c1d95",     // 딥 플럼 바이올렛
        secondary: "#f472b6",   // 솜사탕 핑크
        accent: "#22d3ee",      // 네온 시안
        background: "#fdf8ff",  // 몽환적인 파스텔 틴트 화이트
        surface: "#ffffff",     // 아트웍을 부각시키는 순백색 표면
        text: "#1e1b4b"         // 미드나잇 퍼플 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시선을 압도하고 마음을 움직이는 크리에이티브 마케팅",
        subtitle: "틀에 박힌 수식어 대신, 유니크한 스토리텔링과 감각적인 시각 에셋 디자인으로 소비자의 취향과 트렌드를 단숨에 장악하는 브랜드 캠페인을 설계합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프로젝트 포트폴리오",
          ctaLink: "#services",
          features: [
            { text: "MZ세대의 디지털 바이럴을 폭발시키는 키치하고 러블리한 아트 디렉션" },
            { text: "브랜드 아이덴티티 수립부터 종합 미디어 매체 집행까지의 풀스택 솔루션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "크리에이티브 스튜디오 영역",
        subtitle: "지루하고 단조로운 비즈니스에 생생한 영감의 파도를 불어넣는 브랜드 마케팅 서비스입니다.",
        content_data: {
          items: [
            {
              title: "디지털 광고 캠페인 & 바이럴 마케팅",
              description: "데이터 분석 기반의 타겟팅 툴과 기발한 상상력을 결합하여, 주요 숏폼 플랫폼과 SNS 채널에서 수백만 뷰의 유기적 확산을 유도합니다.",
              icon: "Award"
            },
            {
              title: "하이엔드 브랜드 아이덴티티 및 디자인",
              description: "로고, 패키지, 인터페이스 비주얼 시스템을 감각적인 무드 보드로 설계하여 브랜드 고유의 아우라와 소장 가치를 극대화합니다.",
              icon: "Paintbrush"
            },
            {
              title: "인터랙티브 미디어 & 영상 프로덕션",
              description: "2D/3D 모션 그래픽과 시네마틱 4K 영상을 조합하여 소비자가 광고를 스킵하지 않고 온전히 몰입하는 미디어 아트를 선보입니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "영감의 한계를 확장하는 브랜드 크리에이터",
        subtitle: "장식적 요소를 뛰어넘어 사람들의 감정선을 터치하는 예술적 브랜딩을 지향합니다.",
        content_data: {
          description: "저희 크리에이티브 대행사는 전 세계를 무대로 활동하는 아트 디렉터, 광고 카피라이터, UI/UX 디자이너들이 모여 탄생한 트렌디 디자인 랩입니다. 우리는 수많은 데이터 사이에서 번뜩이는 감성 주파수를 찾아내고, 그것을 누구나 열광하는 시각 언어로 번역하는 작업에 순수한 희열을 느낍니다. 우리만의 키치하고 감각적인 감각으로 당신의 브랜드를 세상의 중심에 세워드리겠습니다.",
          stats: [
            { label: "총 프로젝트 누적 조회수", value: "5,000만 뷰+" },
            { label: "글로벌 디자인 어워드 수", value: "14회 달성" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "세상을 흔들 대담한 아이디어를 시작하세요",
        subtitle: "감각적인 바이럴 광고 기획, 신규 브랜드 디자인 리브랜딩, 팝업 스토어 비주얼 콜라보레이션 문의는 아래 양식을 통해 마음 편히 연락해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "대행사와 협업 예약하기"
        }
      }
    ]
  },

  business_nature_eco: {
    templateId: "business_nature_eco",
    name: "그린 에너지 & 오가닉 에코",
    category: "Business",
    description: "친환경 에너지 솔루션, 천연 화장품 브랜드, 친환경 바이오 라이프스타일 기업을 위한 자연 친화적 테마입니다. 포레스트 그린과 샌드 베이지 배경에 민트 그린 포인트가 어우러져 오가닉하고 편안한 무드를 전합니다.",
    image: "/templates/business_nature_eco.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#556b2f",     // 포레스트 그린
        secondary: "#f5ebe0",   // 모래빛 샌드 베이지
        accent: "#10b981",      // 싱그러운 민트 그린
        background: "#f4f7f4",  // 편안한 그린 틴트 오프화이트
        surface: "#ffffff",     // 깨끗하고 내추럴한 화이트 카드
        text: "#2f3e1b"         // 이끼색을 닮은 다크 그린 브라운
      },
      borderRadius: "rounded-3xl", // 식물의 유기적인 모서리 곡률
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지구와 인간이 공존하는 지속 가능한 내일",
        subtitle: "인위적인 화학 원료와 탄소 배출을 덜어내고, 자연 본연의 유기적 생명력과 청정 에너지를 통해 삶의 질을 복원하는 친환경 바이오 인프라 솔루션을 구축합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
          ctaText: "그린 인프라 확인",
          ctaLink: "#about",
          features: [
            { text: "탄소 제로를 실천하는 고효율 친환경 재생 에너지 파이프라인 설계" },
            { text: "100% 천연 식물성 추출물 기반의 오가닉 스킨케어 패케징 랩" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에코 바이오 비즈니스",
        subtitle: "환경을 보호하고 몸과 마음에 온전한 안식을 선물하는 친환경 제품군 및 기술 가이드입니다.",
        content_data: {
          items: [
            {
              title: "지속 가능한 재생 에너지 솔루션",
              description: "도시 인프라와 상업 시설에 최적화된 저탄소 청정 태양광 및 친환경 바이오매스 연동 에너지 시스템을 보급합니다.",
              icon: "Leaf"
            },
            {
              title: "오가닉 코스메틱 & 라이프 굿즈",
              description: "유해 화학 성분을 배제하고 에코서트 인증 제철 식물 성분만을 추출하여, 피부 자극 없는 비건 뷰티 정체성을 실현합니다.",
              icon: "Compass"
            },
            {
              title: "친환경 패키징 및 소재 마스터",
              description: "플라스틱을 대체하는 100% 생분해성 천연 용기 및 콩기름 인쇄 패키지를 전 프로덕트에 도입하여 제로 웨이스트 문화를 선도합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자연의 정직함을 담아내는 그린 에코 랩",
        subtitle: "자연의 속도에 발맞춰 느리지만 단단한 본질을 회복해 나갑니다.",
        content_data: {
          description: "저희 오가닉 에코 그룹은 지구 환경 보존과 인류의 안전한 삶을 연구하는 바이오 사이언티스트들과 친환경 플래너들이 상생의 가치 아래 설립한 혁신 기업입니다. 우리는 기계식 대량 생산과 독성 인공 원료에 지친 도심 생태계에 숲 속의 은은한 온기를 복원하는 일에 모든 비즈니스 역량을 쏟고 있습니다. 머문 자리에 흔적을 남기지 않는 정직한 그린 솔루션을 경험해 보세요.",
          stats: [
            { label: "절감한 연간 탄소량", value: "12,000톤+" },
            { label: "원데이 천연 원료 인증", value: "100% 비건 성분" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "초록빛 위로를 비즈니스에 들여놓으세요",
        subtitle: "친환경 신재생 에너지 설계 자문, 비건 뷰티 브랜드 대량 커스텀 패키징 발주, 혹은 에코 라이프스타일 제휴 제안은 아래 양식에 다정하게 남겨주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "에코 매니저와 소통하기"
        }
      }
    ]
  },

  business_startup_modern: {
    templateId: "business_startup_modern",
    name: "이노베이션 스마트 스타트업",
    category: "Business",
    description: "차세대 플랫폼 서비스, 모바일 물류 서비스, 에듀테크 스타트업을 위한 경쾌한 감성의 테마입니다. 긍정적인 앰버 오렌지와 소프트 인디고 블루 포인트가 깨끗하고 넓은 스페이스의 오프화이트 배경과 어우러집니다.",
    image: "/templates/business_startup_modern.png",
    theme: {
      fontFamily: "Inter, Pretendard, sans-serif",
      colors: {
        primary: "#f97316",     // 활동적인 앰버 오렌지
        secondary: "#6366f1",   // 소프트 인디고 블루
        accent: "#10b981",      // 성장 신호 민트 그린
        background: "#f8fafc",  // 넓고 탁 트인 화이트 스페이스
        surface: "#ffffff",     // 직관적인 순백색 서페이스 카드
        text: "#334155"         // 모던하고 부드러운 슬레이트 그레이
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "세상을 연결하는 가장 똑똑하고 편리한 모바일 플랫폼",
        subtitle: "단 몇 번의 탭만으로 물류 배송, 커리어 교육, 일상의 고충을 실시간 매칭하는 AI 알고리즘 시스템을 구축하여 복잡한 라이프사이클의 패러다임을 바꿉니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "앱 무료로 다운로드",
          ctaLink: "#contact",
          features: [
            { text: "사용자 빅데이터 기반 하이퍼 로컬 매칭 알고리즘 탑재" },
            { text: "직관적 UI/UX 설계로 사회초년생부터 시니어까지 1분 마스터" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스마트 서비스 피처",
        subtitle: "모바일 화면 하나로 모든 복잡성을 해결하는 스타트업만의 핵심 서비스 파이프라인입니다.",
        content_data: {
          items: [
            {
              title: "하이퍼 하이 테크 에듀테크 플랫폼",
              description: "개인의 학습 진행도와 역량을 AI가 실시간 측정하고 최적의 커리어 로드맵 및 매칭 채널을 다이내믹하게 선사합니다.",
              icon: "Cpu"
            },
            {
              title: "지능형 실시간 물류 매칭 허브",
              description: "위치 기반 트래킹 엔진을 연동하여 도심 속 라이더와 배송 화물을 최단 동선으로 묶어 최저 물류 단가를 보장합니다.",
              icon: "Activity"
            },
            {
              title: "성공적인 커뮤니티 네트워킹",
              description: "동일한 비즈니스 목표를 공유하는 유저들이 피드형 레이아웃에서 자유롭게 정보를 주고받는 스마트 라운지를 개설합니다.",
              icon: "Users"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "혁신을 멈추지 않는 글로벌 스타트업 빌더",
        subtitle: "매일 1%의 변화와 애자일 스프린트 루틴이 세상을 바꾸는 동력이 된다고 신뢰합니다.",
        content_data: {
          description: "저희 이노베이션 컴퍼니는 연쇄 창업자들과 유니콘 출신의 테크 리더, 글로벌 프로덕트 디자이너들이 의기투합하여 설립한 초고속 성장 테크 스타트업입니다. 우리는 기존 비즈니스가 해결하지 못했던 소외된 사용자들의 고충을 포착하고, 이를 가장 세련되고 경쾌한 앱 인터페이스 환경으로 구현하여 해결하는 데 깊은 보람을 느낍니다. 우리와 함께 세상을 뒤바꿀 마법 같은 여정을 경험해 보세요.",
          stats: [
            { label: "월간 활성 유저수(MAU)", value: "150만 돌파" },
            { label: "시리즈 B 투자 유치", value: "350억 원+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "새로운 라운드의 파트너십과 채용 오픈",
        subtitle: "서비스 제휴 문의, 엔젤 투자 및 벤처 캐피탈 라운딩 미팅 요청, 혹은 우리 팀에 합류할 열정 넘치는 팀원 지원은 아래로 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "크루에게 편지 보내기"
        }
      }
    ]
  },
  business_medical_blue: {
    templateId: "business_medical_blue",
    name: "스마트 메디컬 & 바이오 헬스케어",
    category: "Business",
    description: "첨단 종합 병원과 디지털 바이오 진단 의학 기업을 위한 신뢰도 높은 테마입니다. 청결한 화이트와 연그레이 베이스 위에 소프트 딥 블루와 라이트 시안 그린 포인트를 매칭하여 환자에게 편안함과 전문성을 동시에 전달합니다.",
    image: "/templates/business_medical_blue.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#1e40af",     // 신뢰를 주는 소프트 딥 블루
        secondary: "#14b8a6",   // 안정을 주는 라이트 시안 그린
        accent: "#3b82f6",      // 첨단 메디컬 블루
        background: "#f8fafc",  // 깨끗하고 청결한 연그레이 화이트
        surface: "#ffffff",     // 순백색 카드 서페이스
        text: "#1e293b"         // 시인성이 뛰어난 슬레이트 다크 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "생명 과학 기술로 인류의 건강한 내일을 구현하다",
        subtitle: "차세대 빅데이터 진단 인프라와 정밀 의료 기술의 융합을 통해 한 차원 높은 수준의 맞춤형 스마트 바이오 헬스케어 솔루션을 제공합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=1200&q=80",
          ctaText: "진단 가이드 신청",
          ctaLink: "#contact",
          features: [
            { text: "AI 정밀 유전자 스크리닝 분석 및 예방 의학 기술" },
            { text: "글로벌 의료 정보 표준 보안 규격을 100% 충족하는 클라우드 시스템" }
          ]
        }
      },
      {
        section_type: "services",
        title: "첨단 바이오 메디컬 케어",
        subtitle: "인류의 생명 자산 가치를 보존하기 위해 세분화된 지능형 헬스케어 파이프라인입니다.",
        content_data: {
          items: [
            {
              title: "지능형 원격 진단 솔루션",
              description: "임상 빅데이터 엔진을 기반으로 환자의 바이탈 변화를 실시간 정밀 추적하고 잠재적 리스크를 조기 판단하는 예방 솔루션입니다.",
              icon: "Activity"
            },
            {
              title: "차세대 바이오 진단 의학",
              description: "글로벌 표준 연구실과의 실시간 동기화를 통해 고난도 분자 진단 및 세포 분석 리포트를 빠르고 명학하게 도출합니다.",
              icon: "Heart"
            },
            {
              title: "메디컬 정보 보안 라이브러리",
              description: "환자의 소중한 전자의무기록(EMR)을 철저히 다각화된 암호화 분산 시스템 기술로 방어하여 원천 노출을 방지합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "생명을 연구하는 프로페셔널 메디컬 그룹",
        subtitle: "철저히 검증된 임상 데이터와 과학적 신뢰만을 기반으로 건강의 이정표를 세웁니다.",
        content_data: {
          description: "저희 스마트 바이오 헬스케어 메디컬 그룹은 전 세계 저명한 대학 병원 및 글로벌 연구소 출신의 시니어 전문의와 바이오 아키텍트들이 상생의 가치 아래 의기투합하여 설립한 혁신 생명공학 기업입니다. 인위적인 과장광고를 지워내고 오직 수치와 객관적인 임상 논문으로만 성능을 증명하며, 전국의 거점 종합 병원 시스템과의 원스톱 인프라 협업 연동을 통해 인류를 치유해 나가고 있습니다.",
          stats: [
            { label: "국내외 특허 보유 건수", value: "85건 달성" },
            { label: "연간 정밀 진단 수료", value: "24,000+ 케이스" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "스마트 헬스케어 솔루션 도입 문의",
        subtitle: "종합 의료 기관의 디지털 전환, 스마트 검진 파트너십 구축, 혹은 정밀 바이오 연산 장비 커스텀 단가 컨설팅이 필요하시다면 연구소로 신호를 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "수석 연구원과 상담하기"
        }
      }
    ]
  },

  business_realestate_luxury: {
    templateId: "business_realestate_luxury",
    name: "럭셔리 자산 디벨로퍼 & 부동산",
    category: "Business",
    description: "하이엔드 아파트 브랜드, 상업 빌딩 자산 관리, 프리미엄 리조트 개발사를 위한 하이클래스 템플릿입니다. 카푸치노 스킨 톤 골드 브라운과 깊은 차콜 웜 스톤 블랙이 유기적인 균형을 이루며 공간의 가치를 극대화합니다.",
    image: "/templates/business_realestate_luxury.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#b45309",     // 카푸치노 골드 브라운
        secondary: "#1c1917",   // 차콜 웜 스톤 블랙
        accent: "#78350f",      // 번트 앰버 골드 포인트
        background: "#fffbf7",  // 포근하고 고급스러운 샌드 오프화이트
        surface: "#fbf5ee",     // 앤티크 크림 베이지 서페이스
        text: "#1c1917"         // 스톤 다크 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시간이 흐를수록 기품을 더하는 하이엔드 자산 가치",
        subtitle: "단순한 건축적 구조물 구축을 넘어, 글로벌 상위 크리에이터들의 주거 라이프스타일을 심층 분석하여 영속적인 예술적 자산과 럭셔리 라운지 스페이스를 설계합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프라이빗 컬렉션 입장",
          ctaLink: "#contact",
          features: [
            { text: "시대를 초월하는 영속적 가치의 프리미엄 레지던스 시행" },
            { text: "상업 빌딩의 수익률을 극대화하는 자산 포트폴리오 밸런싱 자문" }
          ]
        }
      },
      {
        section_type: "services",
        title: "프리미엄 자산 디벨로핑",
        subtitle: "토지 매입부터 기획, 시공 디렉션, 하이클래스 임대 관리까지 이루어지는 원스톱 자산 성장 캘린더입니다.",
        content_data: {
          items: [
            {
              title: "하이엔드 레지던스 시행 및 개발",
              description: "도시의 스카이라인을 바꾸는 상징적인 랜드마크 주거 공간을 기획하고, 최고급 자재와 완벽한 조도 매칭으로 기품 있는 삶의 무대를 선사합니다.",
              icon: "Building"
            },
            {
              title: "상업 빌딩 자산 밸류업 컨설팅",
              description: "노후화된 자산의 레이아웃을 전면 리브랜딩하고 미니멀리즘 인테리어를 도입하여 공실률을 제어하고 건물의 본질적인 가치를 증폭시킵니다.",
              icon: "Layers"
            },
            {
              title: "프리미엄 리조트 공간 브랜딩",
              description: "지형적 자연 경관과 유기적인 곡선미가 어우러진 독창적인 휴양 스페이스를 설계하여 투자가치와 예술성을 동시에 만족시킵니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "공간의 미래를 제시하는 프리미엄 디벨로퍼 그룹",
        subtitle: "화려하기만 한 장식을 배제하고 대지를 관통하는 구조적 철학만을 고수합니다.",
        content_data: {
          description: "저희 럭셔리 자산 개발 그룹은 글로벌 부동산 금융 그룹 및 명문 건축사 사무소 출신의 최고 전문가들이 주축이 되어 설립한 하이클래스 디벨로퍼 컴퍼니입니다. 단순한 부동산 매매를 넘어, 사람과 자연 그리고 건축물이 유기적인 하모니를 이루는 명작을 빚어내는 데 깊은 비즈니스 아이덴티티를 두고 있습니다. 소수만을 위한 안전하고 품격 있는 영속적 자산의 지평을 경험해 보세요.",
          stats: [
            { label: "총 프로젝트 시행 누적액", value: "3.8조 원 돌파" },
            { label: "우수 자산 밸류업 성공률", value: "100% 달성" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "VIP 프라이빗 컨설팅 및 쇼룸 예약 신청",
        subtitle: "최고급 레지던스 분양 정보 브리프 공유, 상업용 빌딩 리모델링 자문, 혹은 프라이빗 개발 파트너십 미팅은 하단 양식을 채워 정중히 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "전문 컨설턴트와 연결하기"
        }
      }
    ]
  },

  business_legal_classic: {
    templateId: "business_legal_classic",
    name: "전통 로펌 & 특허 법률 법인",
    category: "Business",
    description: "종합 합동 법률 사무소, 특허법인, 노무/세무 전문 법인을 위한 진중한 무드의 템플릿입니다. 깊은 붓먹색과 바랜 한지 크림 화이트 바탕에 엄숙한 딥 버건디 레드가 타협하지 않는 원칙과 신뢰를 대변합니다.",
    image: "/templates/business_legal_classic.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#1c1917",     // 깊은 붓먹색 (Charcoal Ink)
        secondary: "#fafaf9",   // 바랜 한지 크림 화이트
        accent: "#881337",      // 엄숙하고 격조 높은 딥 버건디 레드
        background: "#fdfcfa",  // 정갈하고 진중한 오프화이트
        surface: "#ffffff",     // 화이트 캔버스 표면
        text: "#292524"         // 타자기 먹색의 다크 웜브라운
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "차가운 이성과 타협하지 않는 원칙으로 권익을 방어하다",
        subtitle: "철저한 판례 빅데이터 전수 조사와 정교한 법리 분석을 결합하여, 기업 경영 중 마주하는 치명적인 복잡성과 특허 소송 리스크를 가장 안전하게 선제 해결합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "법률 변론 진단 신청",
          ctaLink: "#contact",
          features: [
            { text: "대형 로펌 출신 분야별 전담 변호사 특별 태스크포스(TF) 가동" },
            { text: "글로벌 비즈니스 특허 보호 및 세무/노무 통합 선제 리스크 헤징 모델" }
          ]
        }
      },
      {
        section_type: "services",
        title: "종합 법률 리스크 솔루션",
        subtitle: "고객의 소중한 지식 자산과 비즈니스의 안전을 영원히 보존하기 위한 올인원 법리 매트릭스입니다.",
        content_data: {
          items: [
            {
              title: "기업 형사 및 종합 송무 방어",
              description: "검찰, 법원 경력의 판례 연구원들과 공조해 기소 전 단계부터 완벽한 논리 구조의 변론서를 작성하여 승소율과 방어율을 비약적으로 가속화합니다.",
              icon: "Shield"
            },
            {
              title: "글로벌 지식재산권(IP) 및 특허 심판",
              description: "하이테크 신기술과 디자인 저작권을 국내외 특허 시스템에 완벽 동기화 등록하고, 무단 침해에 대해 날카로운 법적 제재 조치를 집행합니다.",
              icon: "Layers"
            },
            {
              title: "노무 · 세무 세이프 브리프 캘린더",
              description: "급변하는 노동 법령과 복잡한 세제 개편안을 실시간 추적 진단하여 경영 효율성을 높이고 잠재적 우발 채무 리스크를 원천 진단합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "정의와 진정성을 증명하는 법률 전문가 그룹",
        subtitle: "화려한 수식어가 아닌 오직 승소 리포트의 숫자로만 신뢰를 확보합니다.",
        content_data: {
          description: "저희 법률 법인은 법조계 전반에서 묵직한 발자취를 남겨온 판검사 출신 변호사들과 변리사, 공인노무사, 세무사들이 유기적인 원팀 시스템으로 협력하는 종합 합동 법률 네트워크 그룹입니다. 우리는 타협 없는 원칙과 벼루에 먹을 갈듯 숨을 고르는 아날로그의 진중한 태도로 의뢰인의 억울함을 풀고 권익을 견고히 수호해 왔습니다. 승리의 확실한 블루프린트를 경험해 보세요.",
          stats: [
            { label: "누적 사건 종합 승소율", value: "92.4% 달성" },
            { label: "전담 자문 전문 위원", value: "150명 돌파" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프라이빗 법률 자문 및 긴급 노크 신청",
        subtitle: "치명적인 경영 소송 방어 의뢰, 글로벌 특허 심판 긴급 진단, 기업 세무조사 선제 방어 자문은 아래 서면 양식을 통해 정중히 전달해 주시기 바랍니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "법률 대리인과 소통하기"
        }
      }
    ]
  },

  business_global_logistics: {
    templateId: "business_global_logistics",
    name: "스마트 글로벌 물류 & 무역",
    category: "Business",
    description: "항공/해운 물류 운송사와 스마트 3PL 유통 기업을 위한 테크니컬 디자인 템플릿입니다. 딥 오션 블루와 에너제틱한 피닉스 오렌지가 속도와 효율이 살아있는 기동력을 대변합니다.",
    image: "/templates/business_global_logistics.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 광활한 딥 오션 블루
        secondary: "#ea580c",   // 에너제틱 피닉스 오렌지
        accent: "#f97316",      // 혁신의 라이트 오렌지
        background: "#f1f5f9",  // 정밀하고 깨끗한 슬레이트 블루 그레이
        surface: "#ffffff",     // 직관적인 순백색 서페이스 카드
        text: "#0f172a"         // 완벽한 가독성의 다크 그레이 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지구의 전 스페이스를 초고속 데이터로 연결하는 글로벌 유통 허브",
        subtitle: "항공, 해운, 육상 루트를 융합한 AI 스마트 라우팅 알고리즘 엔진을 통해 글로벌 공급망 병목 현상을 원천 제거하고 최저 운송 비용 단가 공식을 처방합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
          ctaText: "화물 실시간 트래킹",
          ctaLink: "#contact",
          features: [
            { text: "초단위 하이퍼 로컬 입출고 자동화 3PL 풀필먼트 센터 가동" },
            { text: "글로벌 통관 장벽 및 수출입 관세 리스크 원스톱 행정 대행 솔루션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "지능형 종합 물류 체인",
        subtitle: "지체 없는 기동력과 완벽한 정밀함으로 전 세계 무역의 동선을 장악하는 핵심 비즈니스 파이프라인입니다.",
        content_data: {
          items: [
            {
              title: "스마트 글로벌 풀필먼트 3PL",
              description: "빅데이터 AI 재고 예측 시스템을 연동하여 도심 속 거점 창고의 입출고 적체 현상을 제로(0)로 묶어 유통 회전율을 비약적으로 가속화합니다.",
              icon: "Truck"
            },
            {
              title: "해운 · 항공 종합 복합 운송 디렉션",
              description: "글로벌 대형 선사들과의 굳건한 파트너십을 통해 화물 선복을 선제 확보하고, 기후 변화를 우회하는 최적의 시네마틱 루트로 배송을 보장합니다.",
              icon: "Globe"
            },
            {
              title: "수출입 종합 무역 통관 컨설팅",
              description: "각 국가별 복잡한 관세법과 검역 규제 장벽을 관세사 전담 센터가 무결점으로 실시간 처리하여 무역 리스크를 원천 헤징합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상의 모든 동선을 설계하는 글로벌 로지스틱스 파트너",
        subtitle: "속도보다는 정확함을, 지체 없는 무중단 배송 아키텍처만을 추구합니다.",
        content_data: {
          description: "저희 스마트 글로벌 물류 그룹은 해운 대기업, 글로벌 무역 상사 출신의 공급망 관리(SCM) 스페셜리스트들과 하이테크 인프라 엔지니어들이 의기투합하여 설립한 초고속 유통 성장 기업입니다. 전 세계 주요 거점 항구와 항공 터미널을 인접 연결하는 완전 자동화 허브를 운영하며 물류의 복잡성을 단순함으로 바꾸는 코딩 장인 정신의 가치를 실현해 나가고 있습니다.",
          stats: [
            { label: "연간 화물 물동량 처리", value: "4,500만 톤+" },
            { label: "정시 정밀 배송 완료율", value: "99.87%" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "글로벌 공급망 최적화 및 무료 견적 신청",
        subtitle: "대규모 컨테이너 선복 예약, 스마트 풀필먼트 센터 입점 단가 자문, 혹은 수출입 종합 대행 협업 문의는 하단 콘솔 창을 채워 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "물류 마스터와 상담하기"
        }
      }
    ]
  },

  business_architect_premium: {
    templateId: "business_architect_premium",
    name: "프리미엄 건축 설계 & 디자인 빌드",
    category: "Business",
    description: "하이엔드 건축사 사무소와 종합 건설 시공 그룹을 위한 미니멀리즘 테마입니다. 세련된 노출 콘크리트 그레이와 매트 스틸 블랙 스페이싱 위에 대담한 브릭 레드가 더해져 구조적이고 강인한 정체성을 완성합니다.",
    image: "/templates/business_architect_premium.png",
    theme: {
      fontFamily: "Inter, Montserrat, sans-serif",
      colors: {
        primary: "#9a3412",     // 대담한 브릭 레드
        secondary: "#6b7280",   // 노출 콘크리트 그레이
        accent: "#111827",      // 매트 스틸 블랙
        background: "#f9fafb",  // 정갈한 라이트 스틸 화이트
        surface: "#ffffff",     // 도면처럼 명확히 구획된 화이트 표면
        text: "#111827"         // 선명하고 강인한 잉크 블랙
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "선과 구조적 콘크리트로 도시에 영속적 가치를 각인하다",
        subtitle: "단순한 공간 건설을 넘어, 빛의 투과율과 친환경 마감 자재의 물성을 치밀하게 계산하여 자연과 건축물이 동화되는 하이엔드 랜드마크 마스터피스를 빌드합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "아키텍쳐 포트폴리오",
          ctaLink: "#services",
          features: [
            { text: "구조적 안정성 평론 어워드를 석권한 고품격 토탈 디자인 빌드" },
            { text: "3D VR 워크스루 기술을 적용한 사전 조도 시뮬레이션 인프라" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디자인 빌드 매트릭스",
        subtitle: "한 조각의 블루프린트 스케치부터 최종 시공 마감까지 무결점으로 제어하는 마스터 엔지니어링 영역입니다.",
        content_data: {
          items: [
            {
              title: "프리미엄 공간 기획 및 설계",
              description: "대지가 지닌 인문학적 역사와 지형적 고도를 입체 해석하고, 동선의 레이아웃을 극대화한 독창적인 상업/주거 평면도 설계를 공급합니다.",
              icon: "Layers"
            },
            {
              title: "종합 건설 토탈 시공 빌딩",
              description: "노출 콘크리트, 하이엔드 스틸 프레임의 완벽한 0.1mm 오차 없는 히든 마감 기법을 통해 가구와 건물이 완벽히 일체화되는 시공을 완성합니다.",
              icon: "Building"
            },
            {
              title: "보태니컬 플랜테리어 디렉션",
              description: "실내 중정과 외벽 테라스 공간의 자연 채광을 조율하고, 사계절 생기가 감도는 하이엔드 어반 가든 플랜팅 디자인을 제안합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "직선의 아름다움을 신뢰하는 마스터 아키텍처 그룹",
        subtitle: "비움의 철학을 통해 가 장 미니멀한 공간이 가장 맥시멀한 울림을 전달하도록 설계합니다.",
        content_data: {
          description: "저희 프리미엄 건축 시공 그룹은 국내외 명문 아키텍처 대상을 수상한 스타 건축가들과 하이엔드 종합 시공 테크니션들이 의기투합하여 설립한 프리미엄 스페이스 디자인 빌드 전문 법인입니다. 우리는 기교적인 화려함에 가려진 공간의 숨은 면적을 구출하고, 재료 본연의 질감을 투명하게 노출하는 정직한 미니멀리즘 건축 문화 확산에 모든 비즈니스 철학을 투영해 오고 있습니다.",
          stats: [
            { label: "누적 시공 준공 면적", value: "180,000㎡+" },
            { label: "글로벌 건축 디자인상 수상", value: "12회 기록" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "상상 속의 청사진을 완벽한 공간으로 구현할 시간",
        subtitle: "하이엔드 단독 주택 시공 브리프 제안, 상업 빌딩 자산 리모델링 단가 자문, 혹은 프리미엄 디자인 빌드 팝업 컬래버레이션은 아래로 신호를 남겨주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "아키텍트에게 설계 의뢰하기"
        }
      }
    ]
  },
  business_cooperative_pastel: {
    templateId: "business_cooperative_pastel",
    name: "상생 사회적 기업 & 협동조합",
    category: "Business",
    description: "상생 협력 사회적 기업, 지역 공동체 협동조합, 소셜 벤처 임팩트 기업을 위한 다정하고 따뜻한 무드의 템플릿입니다. 눈이 편안한 파스텔 그린 틴트 베이스에 피치 핑크와 파스텔 옐로우 포인트를 더해 공동체의 온기를 전합니다.",
    image: "/templates/business_cooperative_pastel.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#f472b6",     // 다정한 피치 핑크
        secondary: "#fef08a",   // 포근한 파스텔 옐로우
        accent: "#10b981",      // 사회적 가치를 상징하는 에메랄드 그린
        background: "#f0fdf4",  // 눈이 편안한 파스텔 그린 틴트 베이스
        surface: "#ffffff",     // 깨끗하고 친근한 화이트 카드
        text: "#334155"         // 친근하고 부드러운 슬레이트 그레이
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "함께 나누는 연대와 가치, 따뜻한 사회적 임팩트",
        subtitle: "지역 공동체의 행복한 자립과 지속 가능한 상생 협력을 기획하며, 소외된 이웃들과 발맞추어 따뜻하고 공정한 경제 생태계를 빌드해 나갑니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80",
          ctaText: "상생 프로젝트 참여",
          ctaLink: "#contact",
          features: [
            { text: "지역 농가 및 취약 계층의 일자리 창출을 돕는 로컬 네트워크" },
            { text: "수익의 일부를 사회적 가치에 환원하는 투명한 소셜 벤처 루틴" }
          ]
        }
      },
      {
        section_type: "services",
        title: "공동체 상생 솔루션",
        subtitle: "서로의 손을 맞잡고 선한 영향력을 확장하기 위한 협동조합 핵심 비즈니스 모델입니다.",
        content_data: {
          items: [
            {
              title: "지역 공동체 인큐베이팅",
              description: "마을 주민들이 주체적으로 로컬 비즈니스를 개척하고 경제적 자립을 달성할 수 있도록 다정하고 체계적인 창업 워크숍 가이드를 지원합니다.",
              icon: "Users"
            },
            {
              title: "착한 공정 무역 큐레이션",
              description: "생산자에게 정당한 대가를 지불하는 윤리적 공정 무역 네트워크 시스템을 도입하여 건강하고 깨끗한 로컬 푸드 유통망을 구축합니다.",
              icon: "Smile"
            },
            {
              title: "소셜 임팩트 문화 캠페인",
              description: "일상 속 작은 기부와 연대의 미학을 확산시키는 사회 공헌 콘텐츠를 기획하여 따뜻한 공동체 의식을 확산시킵니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "다정함으로 세상을 치유하는 사회적 파트너",
        subtitle: "이윤의 극대화보다 사람과 환경의 가치를 가장 최우선으로 존중합니다.",
        content_data: {
          description: "저희 소셜 협동조합은 지역 공동체의 상생과 지속 가능한 발전을 목표로 열정적인 액티비스트들과 사회적 기업가들이 뜻을 모아 설립한 임팩트 벤처 기업입니다. 숫자로만 평가되는 냉정한 자본 시장에서 비움과 연대의 철학을 실천하고 있으며, 취약 계층의 단단한 자립을 위한 공정한 일터 생태계를 구축해 오고 있습니다. 저희와 함께 세상을 따뜻하게 변화시킬 가치 있는 동행에 동참해 보세요.",
          stats: [
            { label: "창출된 지속 가능 일자리", value: "150개 돌파" },
            { label: "지역 사회 기부 누적액", value: "5억 원+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "선한 영향력을 넓히는 다정한 연결",
        subtitle: "사회적 기업 물품 대량 구매 문의, 취약 계층 자립 교육 지원 제휴, 혹은 소셜 벤처 임팩트 투자 라운딩 협업은 아래로 다정하게 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "협동조합 크루와 소통하기"
        }
      }
    ]
  },

  business_space_aerospace: {
    templateId: "business_space_aerospace",
    name: "차세대 항공 우주 테크",
    category: "Business",
    description: "민간 우주 개발 스타트업, 정밀 드론 및 인공위성 제조사를 위한 하이테크 미래형 템플릿입니다. 딥 카본 슬레이트 블랙 배경 위에 시안 블루와 사이버 라벤더 포인트를 배치하여 우주의 신비로움과 테크니컬한 정밀성을 완벽하게 시각화합니다.",
    image: "/templates/business_space_aerospace.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#22d3ee",     // 네온 시안 블루
        secondary: "#c084fc",   // 미래지향적 사이버 라벤더
        accent: "#6366f1",      // 딥 스페이스 바이올렛 블루
        background: "#0b0c10",  // 광활한 딥 카본 슬레이트 블랙
        surface: "#1f2128",     // 하이테크 관제소 컴포넌트 카드
        text: "#f3f4f6"         // 은하수처럼 눈부신 폰트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지구를 넘어 뉴스페이스 시대를 개척하는 우주 기술 아키텍처",
        subtitle: "독창적인 저궤도 인공위성 자세 제어 알고리즘부터 친환경 무인 항공 드론 추진체 엔지니어링까지, 차세대 우주 개척 비즈니스를 위한 최상위 테크 파이프라인을 가동합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
          ctaText: "기술 백서 열람",
          ctaLink: "#contact",
          features: [
            { text: "실시간 대규모 비행 궤적 데이터를 연산하는 AI 예측 제어 인프라" },
            { text: "극한의 기계적 스트레스를 견뎌내는 카본 복합재 초정밀 가공 솔루션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "뉴스페이스 엔진 스택",
        subtitle: "미지의 미디어 우주 영역을 탐사하고 혁신적 가치를 창출하기 위한 최첨단 항공 기계 공학 라인업입니다.",
        content_data: {
          items: [
            {
              title: "저궤도 초소형 인공위성 마스터 시스템",
              description: "빅데이터 딥러닝 연산 칩을 기판에 정밀 탑재하여 우주 기후 변화와 지형 매핑 정보를 오차 없이 송수신하는 초경량 인공위성을 설계합니다.",
              icon: "Cpu"
            },
            {
              title: "글로벌 초정밀 비행 제어 라우팅",
              description: "고성능 드론 및 무인 항공 플랫폼의 GPS 위치 위성 항법 보정 시스템을 연동하여 도심 속에서도 정밀한 자율 비행 아키텍처를 구현합니다.",
              icon: "Globe"
            },
            {
              title: "제로 디펙트 우주 방어 엔지니어링",
              description: "항공 우주 하드웨어 오작동 리스크를 완전 제로(0)로 묶기 위해 멀티 가상 시뮬레이터 시스템과 진동 충격 흡수 센서 기술을 적용합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "대기권을 넘어 미래를 설계하는 하이테크 기술 그룹",
        subtitle: "불가능에 도전하는 과학적 논리와 숫자가 입증하는 하드웨어 퍼포먼스만 신뢰합니다.",
        content_data: {
          description: "저희 차세대 항공 우주 테크 랩은 글로벌 우주 기지 및 명문 항공 공학 연구소 경력을 지닌 탑클래스 시니어 엔지니어들과 테크니컬 아키텍트들이 뉴스페이스 시대의 지평을 열기 위해 의기투합해 설립한 첨단 정밀 제조 기술 기업입니다. 데이터가 증명하는 극한의 시스템 최적화와 탄탄한 물리 엔진을 설계 기저에 두고 있으며 글로벌 우주 스타트업들과 견고한 위스크 파트너십을 맺고 동반 질주하고 있습니다.",
          stats: [
            { label: "성공적 궤도 진입 위성", value: "14기 달성" },
            { label: "항공 테크 원천 특허", value: "120개 돌파" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "우주 테크놀로지 파트너십 구축",
        subtitle: "정밀 방산 부품 제작 발주, 드론 자율 주행 소프트웨어 라이브러리 라이선싱 도입, 혹은 인공위성 프로젝트 협업 문의는 하단 터미널 양식으로 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "수석 하드웨어 설계팀과 소통하기"
        }
      }
    ]
  },

  business_energy_solar: {
    templateId: "business_energy_solar",
    name: "넷제로 태양광 & 신재생 에너지",
    category: "Business",
    description: "친환경 태양광 시공 기업과 넷제로 환경 에너지 공학사를 위한 내추럴 오가닉 비즈니스 테마입니다. 에너지와 활력을 주는 앰버 오렌지/골드와 네추럴 세이지 그린, 포근한 크림 오프화이트가 세련되게 조화를 이룹니다.",
    image: "/templates/business_energy_solar.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#f97316",     // 활기찬 앰버 오렌지
        secondary: "#556b2f",   // 내추럴 세이지 그린
        accent: "#f59e0b",      // 태양의 광채를 닮은 앰버 골드
        background: "#fffdf9",  // 포근한 크림 오프화이트
        surface: "#fbf6ee",     // 오가닉 웜 크림 서페이스
        text: "#2f3e1b"         // 깊은 이끼색 다크 그린 브라운
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "태양광 테크놀로지로 완성하는 지속 가능한 넷제로의 내일",
        subtitle: "유해 탄소 배출을 덜어내고, 무한한 태양광 인프라와 고효율 전력 그리드 에너지 공학 시스템을 결합하여 친환경 스마트 에너지 패러다임을 구축합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "에너지 진단 신청",
          ctaLink: "#contact",
          features: [
            { text: "국내 최고 광전 변환 효율을 자랑하는 프리미엄 태양광 패널 시공" },
            { text: "탄소 제로 RE100 가이드라인을 완벽히 충족하는 기업 맞춤 전력 인프라" }
          ]
        }
      },
      {
        section_type: "services",
        title: "친환경 클린 에코 체인",
        subtitle: "지구를 구하고 기업의 장기적 전기 운영 단가 비용을 효율적으로 제어하는 스마트 그리드 파이프라인입니다.",
        content_data: {
          items: [
            {
              title: "상업 및 산업용 태양광 인프라 구축",
              description: "대형 제조 공장과 빌딩 옥상의 일조량, 풍속 지형 특성을 정밀 분석하여 전력 생산량을 극대화하는 맞춤형 태양광 패널 각도를 설계 시공합니다.",
              icon: "Leaf"
            },
            {
              title: "ESS 에너지 저장 장치 엔지니어링",
              description: "낮 동안 생산된 과잉 청정 전력을 손실 없이 밀도 높게 보관하고 필요한 시간대에 지능형 분배하는 스마트 저장 배터리 팩을 보급합니다.",
              icon: "Layers"
            },
            {
              title: "넷제로 RE100 종합 기업 컨설팅",
              description: "기후 위기 대응 세제 개편안과 글로벌 탄소 국경세를 철저히 시뮬레이션 진단하여 기업의 에너지 구조적 완전 전환을 리드합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "지구의 푸른 숨결을 보존하는 신재생 에너지 리더",
        subtitle: "자연의 순리에 최첨단 기술을 더해 지체 없는 저탄소 미래를 개척합니다.",
        content_data: {
          description: "저희 넷제로 신재생 에너지 공학 그룹은 친환경 에너지 공학 박사들과 대규모 발전소 시공 테크니션들이 상생의 가치 아래 의기투합해 설립한 기후 기술 혁신 법인입니다. 우리는 기계식 화석 연료 가동으로 지친 도심 생태계에 태양의 싱그러운 온기를 전기 에너지로 변환하는 비즈니스에 깊은 정체성을 투영하고 있으며, 자연을 훼손하지 않는 무결점 그린 빌드를 실현해 가고 있습니다.",
          stats: [
            { label: "연간 탄소 저감량", value: "35,000톤+" },
            { label: "신재생 시공 만족도", value: "99.2% 달성" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "가장 정직하고 깨끗한 광원을 비즈니스에 들여놓으세요",
        subtitle: "공장 지붕 태양광 무료 견적 실사 요청, 기업 RE100 선제 대응 자문, 혹은 에너지 마스터 플랜 제휴 제안은 아래 서면 양식에 다정하게 남겨주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "에너지 마스터와 상담하기"
        }
      }
    ]
  },

  business_hr_recruiting: {
    templateId: "business_hr_recruiting",
    name: "글로벌 헤드헌팅 & 채용 HR 파트너",
    category: "Business",
    description: "전문 헤드헌팅 법인, 인사이트 매칭 플랫폼, 인재 개발 아웃소싱 파트너사를 위한 신뢰도 높은 템플릿입니다. 신뢰를 상징하는 클래식 딥 블루와 성장을 나타내는 내추럴 에메랄드 그린 액센트가 프로페셔널한 기업 무드를 연출합니다.",
    image: "/templates/business_hr_recruiting.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 클래식 딥 블루
        secondary: "#10b981",   // 내추럴 에메랄드 그린
        accent: "#0284c7",      // 비즈니스 스카이 블루
        background: "#f8fafc",  // 깨끗하고 눈이 편안한 슬레이트 화이트
        surface: "#ffffff",     // 정돈된 순백색 서페이스 카드
        text: "#0f172a"         // 가독성을 극대화한 슬레이트 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "기업의 미래를 리드할 최상위 인재를 정교하게 링크하다",
        subtitle: "정형화된 이력서 필터링을 넘어, 핵심 인재의 정성적 역량 지표와 기업 고유의 조직 문화를 심층 입체 매칭하는 하이엔드 글로벌 HR 서칭 리포트입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "인재 매칭 의뢰",
          ctaLink: "#contact",
          features: [
            { text: "시니어 임원 및 테크 핵심 아키텍트 전담 헤드헌팅 서치펌 태스크포스(TF) 가동" },
            { text: "글로벌 비즈니스 스케일업을 지원하는 다국적 인재 소싱 솔루션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "종합 전문 HR 매트릭스",
        subtitle: "적재적소에 핵심 인재를 배치하여 기업의 성장을 폭발시키는 프로페셔널 파트너십 서비스 라인입니다.",
        content_data: {
          items: [
            {
              title: "시니어 임원 및 C-Level 헤드헌팅",
              description: "기업의 피벗과 미래 생존 전략을 이끌 수 있는 검증된 역량의 경영진 및 시니어 아키텍트 풀을 비공개 실사 인터뷰를 거쳐 안전하게 추천합니다.",
              icon: "Award"
            },
            {
              title: "인사이트 매칭 플랫폼 아웃소싱",
              description: "급변하는 디지털 테크 인력 수요에 유연하게 대응하도록 빅데이터 역량 스코어링 시스템을 적용한 단기/장기 스페셜리스트 파견 솔루션을 공급합니다.",
              icon: "Users"
            },
            {
              title: "인재 개발 및 조직 정체성 컨설팅",
              description: "구성원들의 업무 번아웃을 예방하고 조직의 가치를 극대화할 수 있도록 인사 평가 시스템과 사내 커리어 패스 구조를 리빌딩합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "비즈니스의 성장을 인재로 증명하는 가치 파트너",
        subtitle: "결국 모든 위대한 비즈니스의 시작과 끝은 올바른 사람의 배치에서 결정됩니다.",
        content_data: {
          description: "저희 글로벌 HR 리크루팅 그룹은 유수 대기업 인사팀, 글로벌 헤드헌팅 서치펌 출신의 베테랑 커리어 전문 위원들로 구성된 프리미엄 헤드헌팅 법인입니다. 우리는 단순한 채용 알선 단가 처리를 배제하고 의뢰 기업의 비즈니스 로직을 날카롭게 이해하여 가치를 높여줄 진짜 적격자를 찾아냅니다. 기업과 인재가 서로 상생하며 동반 폭발하는 확실한 커리어 시너지를 선사해 드립니다.",
          stats: [
            { label: "C-Level 매칭 성공률", value: "94.8% 기록" },
            { label: "보유 전문 인재 풀", value: "45,000명 이상" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "최고의 팀을 빌드할 확실한 블루프린트",
        subtitle: "치명적인 핵심 엔지니어 긴급 헤드헌팅 의뢰, 전사 인사 채용 시스템 아웃소싱 자문, 혹은 인사이트 매칭 제휴 제안은 아래를 통해 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "컨설턴트와 채용 상담하기"
        }
      }
    ]
  },

  business_bio_lab: {
    templateId: "business_bio_lab",
    name: "정밀 바이오 제약 & 생명과학 랩",
    category: "Business",
    description: "혁신 신약 약학 연구소, 정밀 유전자 분석 랩을 위한 첨단 메디컬 테마입니다. 극도로 청결하고 지적인 라벤더 틴트 화이트 배경 위에 선명한 플럼 바이올렛과 치유적인 민트 초록 포인트가 정밀 데이터와 의학적 신뢰도를 동시에 충족합니다.",
    image: "/templates/business_bio_lab.png",
    theme: {
      fontFamily: "Fira Code, Pretendard, sans-serif",
      colors: {
        primary: "#4c1d95",     // 선명한 플럼 바이올렛
        secondary: "#10b981",   // 치유적인 민트 초록
        accent: "#6d28d9",      // 테크니컬 퍼플
        background: "#faf9fe",  // 정갈한 라벤더 틴트 화이트 배경
        surface: "#ffffff",     // 무결점의 순백색 연구실 서페이스
        text: "#1e1b4b"         // 깊이감 있는 미드나잇 인디고 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "분자 유전자 연산 기술로 생명공학의 미래를 진단하다",
        subtitle: "가짜 데이터 마케팅을 지워내고 오직 검증된 임상 논문과 세포 분석 파이프라인을 도입하여, 난치성 질환의 원인을 치료하는 혁신 바이오 제약 신약 물질을 발굴합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1532187863486-abf9d39d6618?auto=format&fit=crop&w=1200&q=80",
          ctaText: "연구 데이터 요청",
          ctaLink: "#contact",
          features: [
            { text: "AI 딥러닝 분자 시뮬레이션 기반의 초고속 신약 후보 물질 스크리닝" },
            { text: "국제 바이오 의약품 제조 품질 관리 기준(cGMP)을 100% 충족하는 무결점 정밀 시설" }
          ]
        }
      },
      {
        section_type: "services",
        title: "차세대 생명공학 파이프라인",
        subtitle: "인류의 건강 자산을 영원히 수호하기 위해 정교하게 설계된 바이오 테크 솔루션입니다.",
        content_data: {
          items: [
            {
              title: "정밀 유전자 스크리닝 분석",
              description: "차세대 염기서열 분석(NGS) 기술과 고성능 연산 컴퓨터 엔진을 연동하여, 개인의 희귀 유전체 변이 지표를 정밀 해독하고 예방 처방 솔루션을 도출합니다.",
              icon: "Cpu"
            },
            {
              title: "혁신 신약 세포 면역학 연구",
              description: "인체 본연의 면역 메커니즘과 세포 활성화를 극대화하는 바이오 에셋 분자 구조를 합성하여 부작용을 최소화한 항암 및 항바이러스 코어를 빌드합니다.",
              icon: "Activity"
            },
            {
              title: "바이오 의약품 수탁 개발 및 제조",
              description: "초청정 클린룸 인프라에서 배양부터 정제, 최종 포장까지 원스톱 공정 자동화를 구축하여 고품질 바이오 시밀러 시제품을 무결점으로 위탁 생산합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "생명 존엄성의 영속적 가치를 탐구하는 사이언스 랩",
        subtitle: "차가운 이성의 숫자와 뜨거운 생명 치유의 진정성으로 인류에게 기여합니다.",
        content_data: {
          description: "저희 정밀 바이오 생명과학 연구소는 글로벌 저명 의과 대학 및 글로벌 다국적 제약사 수석 연구원 경력의 스페셜리스트들이 인류를 치유하겠다는 일념 아래 의기투합하여 설립한 첨단 바이오 테크 기업입니다. 마케팅의 거품을 배제하고 철저히 수치화된 임상 데이터와 과학적 팩트만을 신뢰하며 전 세계 거점 대학 연구소들과의 실시간 동기화 인프라를 통해 인류의 수명을 단단하게 확장해 가고 있습니다.",
          stats: [
            { label: "국제 학술지(SCI) 등재 논문", value: "85편 달성" },
            { label: "파이프라인 승인 후보 물질", value: "12개 완료" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "인류의 내일을 바꿀 바이오 이노베이션",
        subtitle: "신약 후보 물질 공동 라이선스인 의뢰, 정밀 세포 분석 분석 의학 수탁 위탁 문의, 혹은 바이오 제약 국책 과제 제휴 제안은 아래 서면 양식으로 신호를 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "수석 연구 위원과 상담하기"
        }
      }
    ]
  },
  business_space_interior: {
    templateId: "business_space_interior",
    name: "하이엔드 오피스 공간 브랜딩",
    category: "Business",
    description: "상업 공간 인테리어 디자인 빌드 및 프리미엄 공유 오피스 기획 전문 기업을 위한 테마입니다. 극도의 정갈함을 표현하는 화이트 캔버스 배경 위에 차분한 슬레이트 웜그레이와 크리에이티브 오렌지 포인트를 가미하여 단단한 구조적 미학과 직선 미학을 보여줍니다.",
    image: "/templates/business_space_interior.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#ea580c",     // 크리에이티브 오렌지
        secondary: "#6b7280",   // 슬레이트 웜그레이
        accent: "#111827",      // 구조적 매트 블랙
        background: "#fafafa",  // 화이트 캔버스 배경
        surface: "#ffffff",     // 정갈한 순백색 표면
        text: "#1a1a1a"         // 선명한 먹색
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "공간의 가치를 바꾸는 하이엔드 상업 공간 인테리어 빌드",
        subtitle: "단순한 가구 배치를 넘어 기업의 브랜드 아이덴티티와 구성원의 업무 동선을 치밀하게 계산하여 일과 성장이 유기적으로 동화되는 프리미엄 오피스를 건축합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공간 포트폴리오",
          ctaLink: "#contact",
          features: [
            { text: "구조적 안정성과 극도의 미니멀리즘이 조화된 오피스 설계" },
            { text: "업무 생산성과 크리에이티브 영감을 자극하는 스마트 라운지 셋업" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오피스 공간 브랜딩 솔루션",
        subtitle: "선의 미학과 정교한 마감으로 기업의 정체성을 공간에 구현하는 핵심 서비스 영역입니다.",
        content_data: {
          items: [
            {
              title: "상업 공간 기획 및 레이아웃 설계",
              description: "기업의 조직 문화와 소통 방식을 면밀히 큐레이션하여 부서간 시너지를 극대화하고 유연하게 피벗 가능한 모듈형 워크스페이스를 설계합니다.",
              icon: "Landmark"
            },
            {
              title: "프리미엄 인테리어 시공 및 빌드",
              description: "히든 도어, 라인 조명, 친환경 천연 자재의 완벽한 0.1mm 오차 없는 마감을 통해 자산의 가치와 공간의 품격을 최고 수준으로 끌어올립니다.",
              icon: "Paintbrush"
            },
            {
              title: "스마트 라운지 & 가구 디렉팅",
              description: "자연 채광의 동선에 맞춰 유기적인 가구를 배치하고 구성원에게 영감을 불어넣는 오렌지 컬러 칩 오브제를 배치하는 하이엔드 데코레이션을 제안합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "도시의 워크스페이스를 혁신하는 공간 아키텍트 그룹",
        subtitle: "불필요한 장식을 배제하고 대지와 건물이 가진 본질의 형태에 몰두합니다.",
        content_data: {
          description: "저희 오피스 공간 브랜딩 그룹은 국내외 명문 건축사 사무소 및 대형 에이전시 출신의 최고 전문가들이 의기투합하여 설립한 프리미엄 스페이스 디자인 빌드 전문 기업입니다. 우리는 시각적 소음이 가득한 현대 도심 속에서 비움과 직선의 미학을 실천하고 있으며, 구성원이 온전히 업무에 몰입하면서도 정서적 휴식을 취할 수 있는 정갈한 공유 오피스와 상업 건축의 블루프린트를 실현해 오고 있습니다.",
          stats: [
            { label: "누적 준공 오피스 면적", value: "85,000㎡+" },
            { label: "클라이언트 공간 만족도", value: "99.4%" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "성공적인 비즈니스 공간의 첫 도면을 그리다",
        subtitle: "신규 사옥 인테리어 시공 브리프 제안, 공유 오피스 기획 단가 자문, 혹은 프리미엄 빌드 컬래버레이션은 아래를 통해 제안해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "디렉터에게 설계 의뢰하기"
        }
      }
    ]
  },

  business_agricultural_tech: {
    templateId: "business_agricultural_tech",
    name: "스마트 농업 & 애그리테크",
    category: "Business",
    description: "첨단 유리온실 스마트팜 제조 및 수직 정밀 농업 벤처 기업을 위한 오가닉 지성 테마입니다. 부드러운 대지 흙빛의 샌드 베이지 배경 위에 친환경 생기를 더하는 에너제틱 오렌지와 포레스트 이끼색 포인트가 정교하게 조화를 이룹니다.",
    image: "/templates/business_agricultural_tech.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#ea580c",     // 에너제틱 오렌지
        secondary: "#556b2f",   // 포레스트 이끼색
        accent: "#10b981",      // 내추럴 그린 포인트
        background: "#f5ebe0",  // 대지 흙빛의 샌드 베이지 배경
        surface: "#ffffff",     // 깨끗한 화이트 컨테이너 표면
        text: "#2f3e1b"         // 다크 그린 브라운 본문색
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "빅데이터와 정밀 인프라로 인류의 먹거리 미래를 혁신하다",
        subtitle: "날씨와 계절의 한계를 벗어나 탄소 제로를 실천하는 첨단 수직 농장 하드웨어와 실시간 환경 제어 AI 솔루션을 결합하여 지속 가능한 미래 농업 생태계를 선도합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스마트팜 도입 문의",
          ctaLink: "#contact",
          features: [
            { text: "광전 변환 및 생장 촉진 LED를 탑재한 초정밀 수직 농업 솔루션" },
            { text: "농작물 수확량과 최적 양액 배합률을 실시간 예측하는 빅데이터 분석 엔진" }
          ]
        }
      },
      {
        section_type: "services",
        title: "차세대 애그리테크 파이프라인",
        subtitle: "농업 비즈니스의 디지털 전환과 식량 자산 보존을 위해 설계된 하이테크 농업 공학 스택입니다.",
        content_data: {
          items: [
            {
              title: "첨단 유리온실 하드웨어 제조",
              description: "외부 기후 변화 요소를 원천 헤징하고 실내 온습도, 이산화탄소 농도를 자동 조율하는 지능형 모듈러 스마트팜 인프라를 공급 시공합니다.",
              icon: "Landmark"
            },
            {
              title: "농업 빅데이터 AI 솔루션",
              description: "병해충 발생 확률을 인공지능 영상 캡처 기술로 조기 진단하고 토양 수분 센서와 실시간 동기화하여 수확 효율을 비약적으로 가속화합니다.",
              icon: "Cpu"
            },
            {
              title: "친환경 넷제로 가드닝 자동화",
              description: "순환식 양액 여유 시스템과 태양광 에너지 저장 장치를 연동하여 물과 전기 리소스 소비를 제로(0)에 가깝게 묶는 오가닉 공학을 실현합니다.",
              icon: "Leaf"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "대지의 가치에 최첨단 기술을 더하는 농업 혁신 랩",
        subtitle: "장식적인 과장광고를 배제하고 오직 데이터와 평당 작물 수확량 수치로만 신뢰를 증명합니다.",
        content_data: {
          description: "저희 애그리테크 연구소는 농업 생명과학 박사들과 자동화 설비 제어 부문의 시니어 하이테크 엔지니어들이 의기투합하여 설립한 차세대 스마트팜 혁신 벤처 기업입니다. 우리는 기계식 대량 생산으로 황폐해져 가는 농촌 생태계에 정밀한 인공지능 기술의 온기를 심어 미래 식량 위기를 해결하는 비즈니스에 깊은 정체성을 투영하고 있으며, 자연 친화적인 무결점 농업 인프라 보급에 앞장서고 있습니다.",
          stats: [
            { label: "원천 기술 특허 보유", value: "45건 등록" },
            { label: "스마트팜 평균 수확 증가율", value: "300% 가속" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "가장 정직하고 스마트한 정원을 비즈니스에 들이세요",
        subtitle: "첨단 수직 농장 도입 단가 자문, 대형 농업 빅데이터 솔루션 라이선싱 라이프플랜, 혹은 스마트팜 국책 과제 제휴 제안은 아래 서면 양식에 남겨주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "수석 연구원과 상담하기"
        }
      }
    ]
  },

  business_sports_center: {
    templateId: "business_sports_center",
    name: "프리미엄 애슬레틱 스포츠 센터",
    category: "Business",
    description: "스포츠 컴플렉스 및 프리미엄 헬스/필라테스 프랜차이즈 기업을 위한 역동적 고대비 테마입니다. 어두운 딥 차콜 오프블랙 배경 위에 강렬한 애슬레틱 네온 오렌지와 순백색 포인트를 배치하여 강인한 신체 단련과 퍼포먼스 속도감을 전합니다.",
    image: "/templates/business_sports_center.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#ea580c",     // 강렬한 애슬레틱 네온 오렌지
        secondary: "#ffffff",   // 대비를 극대화하는 순백색
        accent: "#3b82f6",      // 에너지 테크 파란색
        background: "#0f172a",  // 어두운 딥 차콜 오프블랙
        surface: "#1e293b",     // 정돈된 테크니컬 슬레이트 그레이 카드
        text: "#f8fafc"         // 시인성이 뛰어난 밝은 화이트 글자
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "한계를 파괴하고 신체의 완벽한 능력을 증명하라",
        subtitle: "과학적인 바디 메커니즘 분석, 일대일 프라이빗 정밀 트레이닝 시퀀스, 그리고 한계를 극복하는 하이엔드 피트니스 스포츠 클럽의 다이내믹한 크루 여정입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
          ctaText: "멤버십 프로그램 확인",
          ctaLink: "#contact",
          features: [
            { text: "국가대표 출신 수석 트레이너팀의 체계적인 부상 방지 스트렝스 루틴" },
            { text: "생체 데이터 기반 1:1 맞춤형 피트니스 뉴트리션 처방 가이드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "엘리트 애슬레틱 솔루션",
        subtitle: "폭발적인 체력 성장과 완벽한 신체 밸런스를 목표로 구획된 전문 트레이닝 매트릭스입니다.",
        content_data: {
          items: [
            {
              title: "하이엔드 퍼스널 웨이트 트레이닝",
              description: "스쿼트, 데드리프트 등 다관절 운동의 올바른 생체역학 자세를 정밀 교정하고 점진적 과부하 루틴 공식을 적용해 운동 수행 능력을 가속화합니다.",
              icon: "Flame"
            },
            {
              title: "메디컬 재활 필라테스 & 컨디셔닝",
              description: "척추 불균형과 거북목 등 고질적인 체형 통증 유발 원인을 근본적으로 분석하고 코어 근육을 단단하게 복원하는 재활 솔루션을 공급합니다.",
              icon: "Activity"
            },
            {
              title: "스포츠 과학 뉴트리션 랩",
              description: "인바디 체성분 정밀 측정과 활동 매크로 칼로리 추적을 결합하여 직장인 피로 회복과 체지방 컷팅을 동시에 잡는 식단을 처방합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "매일 1%의 신체 기적을 리드하는 애슬레틱 크루",
        subtitle: "타협 없는 정석 트레이닝 문화를 바탕으로 신체 변화의 혁신을 이끕니다.",
        content_data: {
          description: "저희 프리미엄 애슬레틱 스포츠 센터는 전직 국가대표 및 피트니스 메디컬 코치 자격이 검증된 최고 수준의 시니어 트레이너들이 의기투합하여 설립한 스포츠 브랜드 컴플렉스입니다. 우리는 가짜 정보와 자극적인 연출이 난무하는 시장에서 해부학적 근거와 과학적인 임상 실전 데이터만을 고집하며, 고객 한 분 한 분의 근육 움직임과 심폐 지구력 변화를 기록해 건강한 신체 자산을 선사해 오고 있습니다.",
          stats: [
            { label: "VIP 회원 바디 프로필 달성", value: "1,200명 돌파" },
            { label: "소속 프로페셔널 코치진", value: "35명 상주" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "가장 강력한 신체 변화를 위한 첫 걸음",
        subtitle: "프라이빗 1:1 레슨 무료 체험 혜택 신청, 기업 법인 파트너십 멤버십 단가 조율, 혹은 강사 초빙 콜라보레이션 제안은 아래 콘솔 창을 채워 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "수석 코치와 상담하기"
        }
      }
    ]
  },

  business_cyber_security: {
    templateId: "business_cyber_security",
    name: "엔터프라이즈 정보 보호 및 보안",
    category: "Business",
    description: "지능형 사이버 보안 솔루션, 데이터 암호화 및 방화벽 전문 기술 기업을 위한 하이테크 터미널 무드의 템플릿입니다. 강인한 딥 블랙 터미널 백그라운드 위에 빛나는 네온 핑크와 사이버 라벤더 퍼플 포인트가 철저한 보안 통제 무드를 전합니다.",
    image: "/templates/business_cyber_security.png",
    theme: {
      fontFamily: "Fira Code, SF Mono, monospace",
      colors: {
        primary: "#ec4899",     // 네온 핑크
        secondary: "#c084fc",   // 사이버 라벤더 퍼플
        accent: "#22d3ee",      // 형광 시안 블루
        background: "#030712",  // 터미널 딥 블랙
        surface: "#111827",     // 보안 관제 쉘 다크 카드
        text: "#38bdf8"         // 콘솔 창 라이트 시안 블루 글자색
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "엔터프라이즈 자산과 핵심 데이터를 철통 방어하는 제로 트러스트 보안",
        subtitle: "지능형 지속 위협(APT)과 실시간 고도화되는 랜섬웨어 외부 자극을 차단하기 위해 차세대 가상 방화벽 시스템과 AI 패킷 심층 분석 엔진 인프라를 가동합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "보안 취약점 무료 진단",
          ctaLink: "#contact",
          features: [
            { text: "초당 수만 개의 네트워크 패킷을 무중단 전수 추적하는 실시간 관제 허브" },
            { text: "국제 정보보호 표준 및 엔터프라이즈 보안 규격을 100% 충족하는 완전 암호화 아키텍처" }
          ]
        }
      },
      {
        section_type: "services",
        title: "하이테크 사이버 디펜스",
        subtitle: "기업의 데이터 핵심 기밀과 인프라의 마이그레이션 리스크를 원천 원천 차단하기 위한 하드웨어 연산 매트릭스입니다.",
        content_data: {
          items: [
            {
              title: "지능형 실시간 네트워크 관제 솔루션",
              description: "인공지능 딥러닝 우회 침입 탑재 알고리즘을 연동하여 분산 서비스 거부(DDoS) 공격과 악성코드 트래픽의 전조 증상을 무결점으로 탐지 분쇄합니다.",
              icon: "Shield"
            },
            {
              title: "엔터프라이즈 데이터 완전 암호화",
              description: "양자 암호 키 분배 기술을 선제 도입하여 사내 기밀 보고서와 개인 전자 서명 데이터 유출 리스크를 완전히 제로(0)에 수렴하게 만듭니다.",
              icon: "Layers"
            },
            {
              title: "사이버 모의 해킹 및 취약점 진단",
              description: "화이트 해커 연합 센터 출신의 화이트 해커팀이 시스템 서버 아키텍처 인프라를 공격 테스트하여 선제적 방화벽 패치를 처방합니다.",
              icon: "Eye"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "디지털 정보의 본질적 가치를 수호하는 보안 전문가 그룹",
        subtitle: "모든 시스템 복잡성 속에서 한치의 오차도 없는 철저한 보안 통제만을 고수합니다.",
        content_data: {
          description: "저희 엔터프라이즈 정보 보호 법인은 사이버 정보 작전 사령부, 글로벌 정보 보안 대기업 출신의 탑클래스 시니어 시큐리티 아키텍트와 화이트 해커들이 의기투합해 설립한 최고 수준의 디지털 기술 기업입니다. 우리는 마케팅의 과장된 수식어 대신 오직 수치와 객관적인 위협 분석 로그 데이터로만 성능을 증명하며 금융권과 글로벌 대기업이 신뢰하는 철통 보안 생태계를 직조해 오고 있습니다.",
          stats: [
            { label: "실시간 해킹 탐지 방어율", value: "99.99%" },
            { label: "자문 기업 누적 보안 사고", value: "0건 기록" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "가장 단단하고 빈틈없는 방화벽을 푸시하세요",
        subtitle: "치명적인 랜섬웨어 긴급 방어 의뢰, 사내 클라우드 인프라 무결점 보안 진단 자문, 혹은 보안 시스템 빌드 컬래버레이션은 하단 터미널 양식으로 신호를 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "보안 아키텍트에게 핑 보내기"
        }
      }
    ]
  },

  business_learning_edu: {
    templateId: "business_learning_edu",
    name: "스마트 에듀테크 & 러닝 플랫폼",
    category: "Business",
    description: "이러닝 콘텐츠 교육 플랫폼, 코딩 및 실무 직무 교육 기업을 위한 지적인 무드의 프리미엄 템플릿입니다. 논리적인 이성을 자극하는 순백색 배경 위에 정통적 신뢰를 주는 로열 블루와 생기 넘치는 밝은 골드 옐로우 액센트가 시인성을 부여합니다.",
    image: "/templates/business_learning_edu.png",
    theme: {
      fontFamily: "Pretendard, Inter, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 정통 신뢰의 로열 블루
        secondary: "#facc15",   // 생기 넘치는 밝은 골드 옐로우
        accent: "#6366f1",      // 스마트 인디고 블루
        background: "#ffffff",  // 논리적인 깨끗한 순백색
        surface: "#f8fafc",     // 정돈된 슬레이트 화이트 카드 표면
        text: "#0f172a"         // 완벽한 가독성의 슬레이트 다크 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지능형 AI 튜터와 함께 커리어의 한계를 넘어서다",
        subtitle: "단순한 동영상 주입식 교육을 탈피하고 학습자의 현재 역량 지표를 정밀 분석하여, 실무 현업에서 즉시 사용 가능한 프로페셔널 직무 로드맵과 1:1 밀착 코칭 솔루션을 제공합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
          ctaText: "클래스 무료 탐색",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 대기업 시니어 멘토단이 직접 집필한 실무 마스터 커리큘럼" },
            { text: "학습 몰입도를 높이고 부족한 개념을 실시간 보완하는 AI 개인화 오디오 튜터링" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이노베이션 에듀케이션 스택",
        subtitle: "수강생의 성장을 가속화하고 목표 달성을 확실하게 리드하는 미래형 이러닝 파이프라인입니다.",
        content_data: {
          items: [
            {
              title: "하이테크 실무 직무 & 코딩 캠프",
              description: "Next.js 풀스택 아키텍처, 데이터 영양학, AI 자동화 툴 등 산업 현장에서 가장 목말라하는 핵심 실무 역량을 0부터 1까지 빌드합니다.",
              icon: "Laptop"
            },
            {
              title: "지능형 개인화 학습 대시보드",
              description: "수강생의 강의 완독률, 과제 피드백 점수 빅데이터를 계량 측정하여 취약점을 보완하는 오답노트 문장을 다이내믹하게 선사합니다.",
              icon: "BookOpen"
            },
            {
              title: "글로벌 커리어 커뮤니티 매칭",
              description: "동일한 비즈니스 목표를 향해 달리는 전국의 수강생들이 스터디 조를 편성하고 기업 채용 채널과 다이렉트로 연동되는 스마트 허브를 운영합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "지식의 공유로 인류의 가능성을 확장하는 에듀테크 리더",
        subtitle: "체계적인 교육 공학 설계의 힘이 개인의 커리어 패스를 바꾸는 동력이 된다고 신뢰합니다.",
        content_data: {
          description: "저희 스마트 이러닝 플랫폼 그룹은 글로벌 에듀테크 기업 출신의 교육 공학 전문가들과 풀스택 소프트웨어 엔지니어, 그리고 각 산업 분야별 탑티어 시니어 멘토들이 뜻을 모아 설립한 지식 혁신 기업입니다. 우리는 지루한 인스턴트식 강의의 나열을 배제하고 수강생 한 분 한 분이 완벽히 개념을 내재화하여 실무에서 독립적으로 솔루션을 도출할 수 있는 단단한 인재로 성장하도록 돕고 있습니다.",
          stats: [
            { label: "누적 활성 수강생 수", value: "35만 명 돌파" },
            { label: "과정 수료 후 취업 성공률", value: "91.2% 기록" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "당신의 비즈니스 가치를 스케일업할 시간",
        subtitle: "기업 임직원 맞춤형 위탁 교육 의뢰, 지능형 AI 튜터 솔루션 도입 단가 자문, 혹은 교육 콘텐츠 제휴 제안은 아래를 통해 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "교육 교육 매니저와 상담하기"
        }
      }
    ]
  }
};