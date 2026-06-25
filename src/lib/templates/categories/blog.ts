import { TemplateConfig } from "../registry";

export const BLOG_TEMPLATES: Record<string, TemplateConfig> = {
  tech_insight_dark: {
    templateId: "tech_insight_dark",
    name: "테크 인사이트 다크 매거진",
    category: "Blog",
    description: "최신 IT 트렌드와 인공지능(AI) 기술 동향을 깊이 있게 다루는 슬릭하고 미래지향적인 다크 모드 전문 블로그 테마입니다.",
    image: "/templates/tech_insight_dark.png",
    theme: {
      fontFamily: "Inter, system-ui, sans-serif",
      colors: {
        primary: "#3b82f6",     // 선명한 테크 블루
        secondary: "#10b981",   // 미래지향적인 에메랄드 그린
        accent: "#8b5cf6",      // 혁신적인 퍼플 포인트
        background: "#0b0f19",  // 깊이감 있는 딥 네이비 블랙
        surface: "#1e293b",     // 정돈된 슬레이트 그레이 카드
        text: "#f8fafc"         // 시인성 높은 오프화이트 본문
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "기술과 인간의 미래를 연결하는 테크 매거진",
        subtitle: "급변하는 AI 생태계와 글로벌 IT 비즈니스의 핵심 트렌드를 매주 가장 먼저 전달합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
          ctaText: "인사이트 구독하기",
          ctaLink: "#contact",
          features: [
            { text: "심층적인 인공지능 및 빅데이터 분석 아티클" },
            { text: "글로벌 빅테크 기업 동향 및 시장 예측" }
          ]
        }
      },
      {
        section_type: "services",
        title: "핵심 연재 카테고리",
        subtitle: "독자 여러분의 기술적 지평을 넓혀줄 전문 아카이브 섹션입니다.",
        content_data: {
          items: [
            {
              title: "인공지능 & 딥러닝 트렌드",
              description: "LLM 모델의 발전과 생성형 AI 비즈니스의 현재, 그리고 실무 적용 혁신 사례를 정밀하게 분석합니다.",
              icon: "Cpu"
            },
            {
              title: "소프트웨어 아키텍처",
              description: "현업 프론트엔드/백엔드 개발자를 위한 클라우드 네이티브 설계와 확장 가능한 웹 표준 트렌드를 다룹니다.",
              icon: "Code"
            },
            {
              title: "글로벌 테크 마켓 이슈",
              description: "실리콘밸리를 중심으로 한 주요 테크 기업들의 비즈니스 피벗과 주목해야 할 스타트업 투자 동향을 분석합니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "필자 및 채널 소개",
        subtitle: "기술을 통해 세상을 분석하는 Tech Insight를 소개합니다.",
        content_data: {
          description: "안녕하세요. 현업 프론트엔드 아키텍트이자 기술 전문 필진으로 활동 중인 Tech Insight입니다. 복잡하게 얽혀 있는 글로벌 IT 생태계의 실타래를 풀고, 누구나 쉽게 이해할 수 있으면서도 깊이 있는 기술 아티클을 정기 연재하고 있습니다. 실무 인사이트와 트렌드 변화의 파도를 가장 먼저 확인해 보세요.",
          stats: [
            { label: "정기 구독자 수", value: "24,500+" },
            { label: "누적 연재 아티클", value: "420+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 테크 뉴스레터 구독",
        subtitle: "매주 목요일 아침, 편안하게 메일함에서 최신 기술 동향과 트렌드 리포트를 받아보세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  travel_nature_green: {
    templateId: "travel_nature_green",
    name: "포레스트 라이프 트래블러",
    category: "Blog",
    description: "지속 가능한 여행, 자연 속의 캠핑, 그리고 친환경 라이프스타일의 기록을 담아내는 따뜻하고 싱그러운 네이처 그린 테마입니다.",
    image: "/templates/travel_nature_green.png",
    theme: {
      fontFamily: "Pretendard, system-ui, sans-serif",
      colors: {
        primary: "#2f5233",     // 깊은 숲의 Forest Green
        secondary: "#76a035",   // 싱그러운 봄의 Leaf Green
        accent: "#d4a373",      // 따뜻한 감성의 모래빛 샌드 베이지
        background: "#f4f7f4",  // 편안한 느낌의 내추럴 오프화이트
        surface: "#ffffff",     // 깨끗한 순백색 카드
        text: "#1c2e24"         // 가독성이 뛰어난 다크 그린 그레이
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "자연을 닮은 걸음, 지속 가능한 여행의 기록",
        subtitle: "회색 도심을 벗어나 초록빛 자연 속으로 떠나는 아웃도어 캠핑 라이프와 친환경 에세이를 만납니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "소식 구독하기",
          ctaLink: "#contact",
          features: [
            { text: "국내외 친환경 숨은 캠핑 스팟 가이드" },
            { text: "제로 웨이스트를 실천하는 그린 라이프스타일 노하우" }
          ]
        }
      },
      {
        section_type: "services",
        title: "숲속 아카이브 연재 코너",
        subtitle: "자연 속에서 온전한 쉼을 찾는 여정을 카테고리별로 모아두었습니다.",
        content_data: {
          items: [
            {
              title: "아웃도어 캠핑 가이드",
              description: "사계절을 온전히 느끼는 미니멀 캠핑 기어 리뷰부터 자연을 훼손하지 않는 친환경 LNT 캠핑 팁을 공유합니다.",
              icon: "Compass"
            },
            {
              title: "국내 로컬 트래블",
              description: "대중적인 관광지를 벗어나 숨겨진 로컬의 소박한 숲길, 고요한 어촌 마을, 힐링 트레킹 코스를 제안합니다.",
              icon: "Map"
            },
            {
              title: "그린 라이프 에세이",
              description: "일상에서 쉽게 실천할 수 있는 텀블러 사용기부터 플로깅 기록까지, 지구를 생각하는 지속 가능한 일상 에세이입니다.",
              icon: "Leaf"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "초록빛 삶을 기록하는 그린 트래블러",
        subtitle: "지구와 나를 모두 치유하는 자연 친화적 발자국을 지향합니다.",
        content_data: {
          description: "안녕하세요! 카메라와 텐트 한 동을 매고 자연의 고요함을 찾아 떠나는 여행 작가입니다. 자연이 주는 거대한 위로를 글로 담아내며, 머문 자리에 흔적을 남기지 않는 지속 가능한 아웃도어 문화의 확산을 위해 블로그를 운영하고 있습니다. 초록빛 영감을 함께 나누고 소통할 수 있기를 기대합니다.",
          stats: [
            { label: "누적 방문자 수", value: "85,000+" },
            { label: "탐방한 캠핑장", value: "120+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "그린 레터 정기 구독",
        subtitle: "지구를 아끼는 여행 가이드와 자연의 향기가 담긴 소식을 월 2회 메일로 보내드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  culinary_recipe_warm: {
    templateId: "culinary_recipe_warm",
    name: "웜 오가닉 키친",
    category: "Blog",
    description: "향긋한 홈베이킹, 제철 식재료를 활용한 요리 레시피 및 미식 가이드를 포근하고 따뜻한 오렌지/옐로우 감성으로 연출한 블로그 테마입니다.",
    image: "/templates/culinary_recipe_warm.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#d97706",     // 맛있게 구워진 베이킹 느낌의 오렌지 브라운
        secondary: "#f59e0b",   // 생기를 불어넣는 따뜻한 진노랑
        accent: "#9a3412",      // 깊은 미식의 향을 품은 러스트 레드
        background: "#fdfbfc",  // 부드럽고 포근한 크림 오프화이트
        surface: "#fffbeb",     // 버터빛이 감도는 소프트 옐로우 카드
        text: "#451a03"         // 다크 초콜릿 같은 깊은 브라운 본문색
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "식탁 위에 피어나는 따뜻한 미식 이야기",
        subtitle: "정성스럽게 구워낸 홈베이킹 빵 냄새와 자연에서 온 제철 식재료로 완성하는 건강한 패밀리 레시피 아카이브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "레시피 구독하기",
          ctaLink: "#contact",
          features: [
            { text: "초보자도 100% 성공하는 친절한 홈베이킹 클래스" },
            { text: "사계절 제철 재료 본연의 맛을 살린 건강 건강식" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오늘의 추천 연재 테마",
        subtitle: "주방의 기쁨을 더해줄 전문 홈쿡 및 베이킹 콘텐츠입니다.",
        content_data: {
          items: [
            {
              title: "오븐 속의 행복, 홈베이킹",
              description: "천연 발효종 식빵부터 달콤한 디저트 타르트까지, 베이킹 스튜디오의 비밀 노하우를 계량부터 상세히 기록합니다.",
              icon: "Croissant"
            },
            {
              title: "사계절 제철 테이블",
              description: "자연의 흐름에 맞춰 몸을 치유하는 봄나물 요리, 여름 보양식, 가을 수확 테이블, 겨울 워밍 가이드 레시피를 소개합니다.",
              icon: "Salad"
            },
            {
              title: "글로벌 홈스토랑 스토리",
              description: "어렵게 느껴졌던 정통 이탈리안 파스타, 프렌치 스튜, 이국적인 아시안 푸드를 집에서 간편하게 요리하는 가이드입니다.",
              icon: "ChefHat"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "요리하는 기록가, 웜키친을 소개합니다",
        subtitle: "음식이 주는 온기가 우리 삶을 치유한다고 믿습니다.",
        content_data: {
          description: "안녕하세요. 베이킹 향기와 지글지글 찌개 끓는 소리에서 가장 큰 위로를 얻는 푸드 크리에이터 웜키친입니다. 거창하고 복잡한 일류 셰프의 요리 대신, 매일 우리 식탁 위를 건강하고 맛있게 채울 수 있는 따뜻한 집밥과 오가닉 레시피를 기록하고 있습니다. 저의 작은 주방 속 이야기들이 여러분의 매일의 식사 시간에 작은 행복이 되길 바랍니다.",
          stats: [
            { label: "월간 아티클 조회수", value: "50,000+" },
            { label: "공개된 요리 레시피", value: "250개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "쿠킹 뉴스레터 구독",
        subtitle: "매주 엄선된 주간 추천 제철 메뉴와 요리 꿀팁 캘린더를 무료로 가장 먼저 메일로 받아보세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  finance_market_navy: {
    templateId: "finance_market_navy",
    name: "파이낸셜 마켓 레포트",
    category: "Blog",
    description: "재테크 전략, 거시 경제 이슈 분석 및 주식 투자 전략을 논리적이고 깊이 있게 전달하는 비즈니스 무드의 네이비/블루 뉴스레터형 블로그 테마입니다.",
    image: "/templates/finance_market_navy.png",
    theme: {
      fontFamily: "Pretendard, system-ui, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 높은 신뢰감의 클래식 딥 네이비
        secondary: "#0284c7",   // 분석적이고 세련된 스카이 블루
        accent: "#f59e0b",      // 기회와 수익을 상징하는 골드/앰버
        background: "#f8fafc",  // 깔끔하고 신뢰도 높은 아주 연한 그레이 화이트
        surface: "#ffffff",     // 명확하게 구획을 나눠주는 화이트 컨테이너
        text: "#0f172a"         // 완벽한 가독성을 제공하는 슬레이트 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "흔들리는 시장 속, 명쾌한 투자 이정표",
        subtitle: "복잡한 글로벌 거시 경제 흐름과 국내외 자산 시장의 트렌드를 숫자와 데이터 기반으로 쉽고 명확하게 정밀 진단합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "주간 리포트 구독",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 매크로 지표 분석 및 주간 증시 핵심 요약" },
            { text: "초보 투자자를 위한 올바른 자산 배분 전략 가이드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마켓 포커스 연재 섹션",
        subtitle: "자산 성장을 가속화할 시장 정보와 거시적 분석을 제공합니다.",
        content_data: {
          items: [
            {
              title: "거시 경제 & 자산 배분",
              description: "글로벌 금리 기조, 인플레이션 동향 등 거시 경제 매크로 지표가 개인 자산 시장에 미치는 영향을 알기 쉽게 풀어냅니다.",
              icon: "Globe"
            },
            {
              title: "주식 마켓 트렌드",
              description: "반도체, AI, 2차전지 등 핵심 유망 산업 트렌드를 추적하고, 상장 기업의 재무제표와 펀더멘털을 기반으로 기업을 분석합니다.",
              icon: "TrendingUp"
            },
            {
              title: "스마트한 재테크 전략",
              description: "사회초년생부터 은퇴 준비자까지, 리스크를 최소화하는 포트폴리오 다각화 공식을 전수합니다.",
              icon: "Coins"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "파이낸셜 마켓 애널리스트 아카이브",
        subtitle: "검증된 데이터와 차가운 이성으로 투자의 안개를 걷어냅니다.",
        content_data: {
          description: "증권사 리서치 센터 및 자산운용사 경험을 바탕으로, 감정에 휘둘리지 않는 객관적인 시장 분석을 지향하는 금융 경제 필진입니다. 단기적인 시세 급등락에 일희일비하기보다는 복리 효과와 거시적 패러다임의 변화에 주목하여, 독자 여러분이 장기적으로 승리할 수 있는 현명한 파이낸셜 인사이트를 구축하도록 돕고 있습니다.",
          stats: [
            { label: "뉴스레터 유료 구독자", value: "12,000+" },
            { label: "경제 분석 보고서", value: "550회+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "VIP 위클리 리포트 무료 구독 신청",
        subtitle: "매주 월요일 장 시작 전, 글로벌 증시 핵심 리포트와 금주 주목해야 할 주요 경제 이벤트 일정을 보내드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  art_design_minimal: {
    templateId: "art_design_minimal",
    name: "모노 미니멀 디자인 랩",
    category: "Blog",
    description: "현대 예술, 모던 건축 및 가구 디자인을 아카이빙하는 모노톤 중심의 여백의 미가 돋보이는 미니멀리스트 블로그 테마입니다.",
    image: "/templates/art_design_minimal.png",
    theme: {
      fontFamily: "Inter, Montserrat, sans-serif",
      colors: {
        primary: "#111111",     // 매트하고 깊은 순수한 블랙
        secondary: "#666666",   // 차분함을 주는 미드 톤 그레이
        accent: "#e11d48",      // 시선을 사로잡는 모던한 크림슨 레드 한 방울
        background: "#fafafa",  // 극도의 정갈함을 표현한 화이트 스페이스
        surface: "#ffffff",     // 캔버스를 닮은 순백색 표면
        text: "#1a1a1a"         // 눈이 편안하면서도 선명한 먹색
      },
      borderRadius: "rounded-none", // 완벽한 직선 미학을 반영한 제로 라운딩
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "간결함 속에서 발견하는 구조적 미학",
        subtitle: "본질에 집중하기 위해 비워둔 여백 속에서, 현대 건축과 하이엔드 인테리어 디자인의 진정한 가치를 아카이빙합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "아카이브 구독",
          ctaLink: "#contact",
          features: [
            { text: "시대를 초월하는 미니멀리즘 가구 및 공간 분석" },
            { text: "글로벌 현대 미술 및 디자인 거장들의 철학 조명" }
          ]
        }
      },
      {
        section_type: "services",
        title: "큐레이션 카테고리",
        subtitle: "정교하게 엄선된 시각적 예술과 디자인의 핵심 테마 컬렉션입니다.",
        content_data: {
          items: [
            {
              title: "모던 스페이스 아키텍처",
              description: "콘크리트와 유리, 그리고 여백의 유기적 배치를 보여주는 전 세계의 독창적인 미니멀 하우스와 건축 예술을 평론합니다.",
              icon: "Component"
            },
            {
              title: "마스터피스 퍼니처",
              description: "바우하우스부터 미드센추리 모던까지, 단순한 기능성을 넘어 공간의 오브제가 되는 프리미엄 가구 명작을 심층 큐레이션합니다.",
              icon: "Layers"
            },
            {
              title: "비주얼 아트 & 트렌드",
              description: "장식적 요소를 배제하고 본질적인 선, 면, 색으로 승부하는 모던 갤러리의 기획 전시 소식과 그래픽 디자인 트렌드를 전달합니다.",
              icon: "Eye"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "비움의 철학을 지향하는 크리에이티브 디렉터",
        subtitle: "가장 미니멀한 것이 가장 맥시멀한 감동을 준다고 믿습니다.",
        content_data: {
          description: "반갑습니다. 디자인 랩의 디렉터입니다. 저는 세상의 수많은 복잡한 소음 속에서 시각적 공해를 덜어내고, 사물과 공간이 가진 본질의 형태와 비례감에 깊이 몰두하고 있습니다. 본 블로그는 불필요한 수식어를 뺀 정제된 텍스트와 깊이 있는 시각 자료로 공간과 사물의 이야기를 영구히 기록해 나가는 아카이빙 캔버스입니다.",
          stats: [
            { label: "구독 멤버십 수", value: "8,900+" },
            { label: "큐레이션 아카이브", value: "180개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "디자인 에센셜 진 정기 구독",
        subtitle: "화려한 수식어 없이 본질적인 인사이트만 담은 디자인 레터를 월 1회 엄숙하게 발행합니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  fashion_editorial_rose: {
    templateId: "fashion_editorial_rose",
    name: "패션 에디토리얼 로즈",
    category: "Blog",
    description: "우아하고 화려한 럭셔리 패션 매거진 및 개인 스타일 다이어리를 위한 템플릿입니다. 소프트 로즈 골드와 연한 살구빛 핑크 파스텔 무드가 차콜 블랙 포인트와 결합되어 감각적인 비주얼을 선사합니다.",
    image: "/templates/fashion_editorial_rose.png",
    theme: {
      fontFamily: "Playfair Display, serif",
      colors: {
        primary: "#e7a99a",     // 소프트 로즈 골드
        secondary: "#fbeee6",   // 연한 살구빛 핑크 파스텔
        accent: "#1c1917",      // 차콜 블랙 포인트
        background: "#fffaf8",  // 포근하고 부드러운 화이트 브라운
        surface: "#ffffff",     // 순백색 컨테이너
        text: "#292524"         // 가독성을 위한 다크 웜그레이
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "당신의 고유한 취향을 완성하는 패션 다이어리",
        subtitle: "트렌드를 넘어 자신만의 아이덴티티를 찾는 여정, 최신 런웨이 소식과 감각적인 스타일 큐레이션을 매주 만나보세요.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "에디션 구독하기",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 패션 위크 하이라이트 및 트렌드 분석" },
            { text: "체형과 무드에 맞춘 퍼스널 스타일링 가이드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에디토리얼 연재 코너",
        subtitle: "시대를 초월하는 아름다움과 트렌디한 감각을 담아낸 전문 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "런웨이 & 트렌드 리포트",
              description: "파리, 밀라노, 뉴욕 패션위크의 핵심 컬렉션을 분석하고 일상으로 가져올 수 있는 키 아이템을 소개합니다.",
              icon: "Sparkles"
            },
            {
              title: "퍼스널 룩북 디렉토리",
              description: "계절별 캡슐 워드롭 구성법부터 작은 디테일로 전체 분위기를 바꾸는 액세서리 매칭 매뉴얼을 제안합니다.",
              icon: "Heart"
            },
            {
              title: "디자이너 브랜드 스토리",
              description: "하우스 브랜드의 유구한 역사와 현대적인 크리에이티브 디렉터들이 풀어내는 브랜드 철학을 조명합니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "로즈 에디토리얼 디렉터",
        subtitle: "시각적 영감과 패션 이면의 이야기를 기록하는 공간입니다.",
        content_data: {
          description: "안녕하세요. 패션 매거진 에디터 출신의 크리에이티브 디렉터 로즈입니다. 화려한 옷장 속 이야기뿐만 아니라, 옷을 입는 사람의 태도와 철학이 묻어나는 진정한 스타일에 대해 이야기하고자 합니다. 단순한 소비를 넘어 하나의 예술로서 패션을 바라보는 시각을 여러분과 아낌없이 공유하고 소통하겠습니다.",
          stats: [
            { label: "정기 구독자 수", value: "18,500+" },
            { label: "발행 스타일북", value: "240개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "디바인 매거진 레터 신청",
        subtitle: "매월 가장 감각적인 스타일 트렌드와 프라이빗 팝업 스토어 소식을 메일함으로 직접 전달해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 구독하기"
        }
      }
    ]
  },

  mindful_living_lavender: {
    templateId: "mindful_living_lavender",
    name: "마인드풀 리빙 라벤더",
    category: "Blog",
    description: "마음 챙김, 명상, 셀프케어 및 멘탈 헬스를 다루는 고요하고 치유적인 감성의 웰빙 블로그입니다. 연한 라벤더 보랏빛과 파스텔 바이올렛이 심신에 깊은 안정감을 제공합니다.",
    image: "/templates/mindful_living_lavender.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#8b5cf6",     // 파스텔 바이올렛
        secondary: "#ddd6fe",   // 연한 라벤더 보랏빛
        accent: "#10b981",      // 내추럴 에메랄드 그린
        background: "#faf9fe",  // 고요하고 깨끗한 라벤더 틴트 화이트
        surface: "#ffffff",     // 깨끗한 아이보리 화이트 표면
        text: "#374151"         // 부드러운 차콜 그레이 본문색
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "온전한 나를 만나는 시간, 마인드풀 라이프",
        subtitle: "도심의 소음에서 벗어나 내면의 고요함을 찾고, 몸과 마음의 균형을 맞추는 데 도움이 되는 일상 치유 에세이와 명상 가이드입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "하루 일기 구독",
          ctaLink: "#contact",
          features: [
            { text: "바쁜 하루 속 10분 자가 치유 명상 오디오 가이드" },
            { text: "스트레스를 낮추는 식단과 웰빙 라이프 팁 자료" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마음 챙김 라운지",
        subtitle: "지친 일상에 작은 쉼표를 찍어줄 수 있는 치유 연재 코너입니다.",
        content_data: {
          items: [
            {
              title: "데일리 명상 & 호흡법",
              description: "아침을 깨우는 정위치 호흡부터 숙면을 유도하는 딥 슬립 바디스캔까지, 누구나 쉽게 따라 할 수 있는 명상법을 나눕니다.",
              icon: "Smile"
            },
            {
              title: "멘탈 케어 & 심리 테라피",
              description: "감정의 번아웃을 예방하고, 내면의 불안과 마주하는 올바른 인지 심리학 기반의 마음 다스림 글을 연재합니다.",
              icon: "Heart"
            },
            {
              title: "웰니스 리추얼",
              description: "아로마 테라피, 싱잉볼 활용법, 나만의 온전한 아침을 만드는 소박하고 단단한 리추얼 루틴을 제안합니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "평온한 일상을 가꾸는 마인드 가이드",
        subtitle: "스스로를 안아주는 법을 함께 배워나가는 따뜻한 웰빙 아카이브입니다.",
        content_data: {
          description: "안녕하세요. 마인드풀 리빙 블로그를 운영하는 웰니스 코치입니다. 오랜 시간 번아웃을 겪으며 깨달은 명상과 셀프케어의 가치를 더 많은 분들과 나누고자 이 공간을 열었습니다. 거창한 수련이 아니더라도, 하루 한 장의 글과 한 번의 깊은 호흡을 통해 내면의 단단한 평화를 찾으실 수 있도록 든든한 페이스메이커가 되어 드리겠습니다.",
          stats: [
            { label: "함께하는 명상 커뮤니티", value: "14,000+" },
            { label: "기록된 치유 에세이", value: "310편+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "라벤더 마인드 레터 신청",
        subtitle: "복잡한 생각을 비워내고 평온함을 채워줄 주간 마인드풀니스 팁과 요가 가이드를 메일로 보내드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 구독하기"
        }
      }
    ]
  },

  fitness_vitality_orange: {
    templateId: "fitness_vitality_orange",
    name: "비탈리티 피트니스 오렌지",
    category: "Blog",
    description: "액티브 라이프스타일, 바디 프로필, 홈트레이닝 및 러닝 전문 스포츠 블로그 테마입니다. 어두운 딥 차콜 백그라운드에 강렬한 네온 애슬레틱 오렌지 포인트를 가미하여 폭발적인 에너지를 전달합니다.",
    image: "/templates/fitness_vitality_orange.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#ea580c",     // 네온 애슬레틱 오렌지
        secondary: "#f97316",   // 라이트 에너지 오렌지
        accent: "#ffffff",      // 가시성을 돕는 화이트
        background: "#0f172a",  // 어두운 딥 차콜 오프블랙
        surface: "#1e293b",     // 정돈된 테크니컬 슬레이트 그레이
        text: "#f8fafc"         // 시인성이 뛰어난 오프화이트 글자
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "한계를 넘어 진정한 나를 증명하라",
        subtitle: "체계적인 웨이트 트레이닝 루틴, 과학적인 식단 가이드, 그리고 한계를 극복하는 러닝 크루의 다이내믹한 여정을 아카이빙합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
          ctaText: "트레이닝 챌린지 참여",
          ctaLink: "#contact",
          features: [
            { text: "스트렝스 향상을 위한 부위별 정밀 운동 시퀀스" },
            { text: "지속 가능한 다이어트 및 벌크업 매크로 영양학" }
          ]
        }
      },
      {
        section_type: "services",
        title: "프로페셔널 트레이닝 존",
        subtitle: "강력한 퍼포먼스 향상과 완벽한 바디 라인을 위한 전문 아카이브 섹션입니다.",
        content_data: {
          items: [
            {
              title: "웨이트 트레이닝 매뉴얼",
              description: "스쿼트, 데드리프트, 벤치프레스 3대 운동의 올바른 역학적 자세와 점진적 과부하 루틴 공식을 공유합니다.",
              icon: "Flame"
            },
            {
              title: "애슬레틱 러닝 & 유산소",
              description: "심폐 지구력을 극대화하는 인터벌 러닝 프로그램과 마라톤 완주를 위한 부상 방지 러닝 폼 트레이닝을 다룹니다.",
              icon: "Activity"
            },
            {
              title: "스포츠 뉴트리션 랩",
              description: "단백질 섭취 타이밍, 근성장을 돕는 부스터 활용법 및 직장인을 위한 현실적인 린매스업 식단을 처방합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "에너지 리더, 비탈리티 크루",
        subtitle: "매일 1%의 성장이 만드는 강력한 변화를 신뢰합니다.",
        content_data: {
          description: "안녕하세요! 전직 보디빌딩 선수이자 스포츠 영양학 코치로 활동 중인 비탈리티입니다. 가짜 정보가 넘치는 피트니스 시장에서, 오직 과학적인 논문과 실전 임상으로 검증된 트레이닝 정석만을 고집합니다. 스스로 한계를 깨부수고 더 나은 신체와 정신을 얻고자 하는 모든 러너와 헬스 고수들을 위한 가이드가 되겠습니다.",
          stats: [
            { label: "챌린지 누적 수료생", value: "9,500+" },
            { label: "분석된 피트니스 리포트", value: "480개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "주간 피트니스 리포트 무료 신청",
        subtitle: "매주 일요일 저녁, 다음 주의 운동 스케줄러와 근성장을 촉진하는 영양학 레시피를 메일함으로 바로 쏘아 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 구독하기"
        }
      }
    ]
  },

  retro_analog_sepia: {
    templateId: "retro_analog_sepia",
    name: "레트로 아날로그 세피아",
    category: "Blog",
    description: "필름 사진, LP 레코드 수집, 독립 서적을 평론하는 빈티지 감성 블로그 테마입니다. 따뜻한 세피아와 머스터드 톤, LP 바이널 블랙이 바랜 크림 종이 질감의 배경과 어우러져 노스탤지어를 자극합니다.",
    image: "/templates/retro_analog_sepia.png",
    theme: {
      fontFamily: "Georgia, serif",
      colors: {
        primary: "#78350f",     // 따뜻한 딥 세피아 브라운
        secondary: "#b45309",   // 레트로 빈티지 머스터드
        accent: "#1c1917",      // LP 바이널 블랙
        background: "#fefaf3",  // 바랜 크림 종이 질감의 웜베이지
        surface: "#fbf3e6",     // 앤티크 크림 옐로우 카드
        text: "#292524"         // 타자기 먹색을 닮은 다크 브라운
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "빛바랜 필름과 음악이 머무는 기록 보관소",
        subtitle: "느리게 흘러가는 아날로그 시선의 미학, 35mm 필름 카메라의 셔터음과 턴테이블 위에서 회전하는 LP의 따뜻한 지직거림을 텍스트로 담아냅니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "아카이브 입장하기",
          ctaLink: "#contact",
          features: [
            { text: "국내외 희귀 수입 바이널 및 빈티지 명반 리뷰" },
            { text: "수동 필름 카메라 기종별 촬영 매뉴얼 및 현상 팁" }
          ]
        }
      },
      {
        section_type: "services",
        title: "시간이 멈춘 서재",
        subtitle: "취향이 깊어지는 밤, 아날로그 감성을 자극하는 연재 아카이브입니다.",
        content_data: {
          items: [
            {
              title: "35mm 필름 다이어리",
              description: "라이카, 캐논 오토보이 등 빈티지 카메라로 담아낸 골목길 풍경과 감성적인 필름 현상액별 색감 차이를 분석합니다.",
              icon: "Camera"
            },
            {
              title: "턴테이블과 골든 디스크",
              description: "재즈 명반부터 시티팝, 올드 락까지 먼지 쌓인 레코드 숍에서 찾아낸 보석 같은 음악과 하이파이 오디오 시스템 가이드입니다.",
              icon: "Flame"
            },
            {
              title: "독립 서적 & 심야 서평",
              description: "대형 서점에서는 찾기 힘든 독립 출판물과 시대를 풍미한 고전 문학 속 문장들을 미니멀한 시선으로 해설합니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아날로그 아키비스트",
        subtitle: "빠르게 변하는 세상에서 느림의 가치를 붙잡아 둡니다.",
        content_data: {
          description: "안녕하세요. 오래된 물건이 주는 손때 묻은 온기를 사랑하는 아날로그 아키비스트입니다. 디지털의 편리함 대신 필름을 감고 레코드판의 먼지를 털어내는 수고로움 속에서 삶의 진짜 낭만을 발견하곤 합니다. 이 블로그는 저와 같은 취향을 가진 분들이 잠시 쉬어갈 수 있는 아늑한 골목길 심야 다방이 되기를 희망합니다.",
          stats: [
            { label: "공유된 바이널 컬렉션", value: "450장+" },
            { label: "기록된 도시 인화 기록", value: "1,200장+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "주간 세피아 에세이 정기 구독",
        subtitle: "매주 금요일 밤, 가을밤의 감성을 닮은 추천 음악 리스트와 아날로그 수필 한 편을 편지로 배달해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 구독하기"
        }
      }
    ]
  },

  parenting_happy_pastel: {
    templateId: "parenting_happy_pastel",
    name: "해피 패밀리 파스텔",
    category: "Blog",
    description: "다정한 육아 일기와 친근한 베이비 케어 정보를 공유하는 따뜻하고 포근한 패밀리 블로그입니다. 부드러운 스카이 블루, 행복한 파스텔 옐로우, 피치 핑크가 눈부신 조화를 이룹니다.",
    image: "/templates/parenting_happy_pastel.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#0ea5e9",     // 부드러운 스카이 블루
        secondary: "#fef08a",   // 행복한 파스텔 옐로우
        accent: "#f43f5e",      // 따뜻한 피치 핑크
        background: "#f0fdf4",  // 눈이 편안한 파스텔 그린 틴트
        surface: "#ffffff",     // 둥글고 부드러운 화이트 컨테이너
        text: "#334155"         // 친근하고 부드러운 슬레이트 그레이
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "아이의 눈으로 본 세상, 우리 집 육아 일기",
        subtitle: "매일 조금씩 성장하는 아이의 순수한 미소와 초보 부모를 위한 가장 친절한 베이비 케어 상식 및 오가닉 교육 정보 스페이스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
          ctaText: "성장 스토리 보기",
          ctaLink: "#contact",
          features: [
            { text: "소아과 전문의 자문 기반 월령별 성장 발달 체크리스트" },
            { text: "엄마 아빠가 직접 만드는 친환경 유기농 이유식 레시피" }
          ]
        }
      },
      {
        section_type: "services",
        title: "맘 앤 대디 러브 하우스",
        subtitle: "행복한 가정을 가꾸기 위한 실천적인 팁이 가득한 테마 섹션입니다.",
        content_data: {
          items: [
            {
              title: "월령별 베이비 케어",
              description: "신생아 수면 교육(퍼버법)의 핵심 노하우부터 예방접종 스케줄, 갑작스러운 열 대처법까지 실전 육아 꿀팁을 전수합니다.",
              icon: "Heart"
            },
            {
              title: "오가닉 홈스쿨링 플레이",
              description: "집에서 쉽게 구하는 재료로 오감을 자극하는 창의력 촉진 촉감 놀이와 몬테소리 교구 활용법을 공유합니다.",
              icon: "Smile"
            },
            {
              title: "부모 심리 & 부부 에세이",
              description: "육아 동지인 남편, 아내와의 올바른 대화법과 아이를 키우며 부모로서 함께 내면이 성숙해지는 솔직한 에세이입니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "다정한 세 남매의 엄마, 해피 맘",
        subtitle: "아이와 함께 자라는 부모들의 따뜻한 쉼터가 되길 원합니다.",
        content_data: {
          description: "안녕하세요! 세 아이를 키우며 매일 전쟁 같은 감동의 일상을 기록하고 있는 해피 맘입니다. 첫째를 키울 때의 막막함을 알기에, 지금 이 순간에도 밤을 지새우며 고군분투하고 계실 전국의 초보 부모님들에게 조금이라도 힘이 되고자 육아 아카이브를 구축했습니다. 따뜻한 위로와 유용한 정보로 여러분의 독박 육아를 응원하겠습니다.",
          stats: [
            { label: "함께 소통하는 이웃", value: "32,000+" },
            { label: "직접 검증한 육아 템", value: "190개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "달콤한 파스텔 홈레터 구독",
        subtitle: "매주 화요일 아침, 이번 주에 아이와 함께 가기 좋은 전국의 예스 키즈존 핫플레이스 리스트를 무료로 메일함에 쏙 넣어 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 구독하기"
        }
      }
    ]
  },
  gourmet_travel_teal: {
    templateId: "gourmet_travel_teal",
    name: "로컬 고메 트래블",
    category: "Blog",
    description: "감각적인 카페 투어, 숨겨진 로컬 맛집 탐방, 그리고 미식 여행기를 전문으로 다루는 트렌디한 블로그 템플릿입니다. 세련된 딥 틸 색상과 화사한 소프트 코랄 핑크 액센트가 어우러져 시각적 즐거움을 선사합니다.",
    image: "/templates/gourmet_travel_teal.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#0d9488",     // 세련된 딥 틸 (Teal)
        secondary: "#fca5a5",   // 화사한 소프트 코랄 핑크
        accent: "#f59e0b",      // 미식의 생기를 더하는 골드 옐로우
        background: "#fefaf6",  // 아늑하고 부드러운 딥 아이보리
        surface: "#ffffff",     // 깔끔한 화이트 컨테이너
        text: "#1f2937"         // 가독성이 뛰어난 차콜 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "입안 가득 퍼지는 로컬의 숨은 이야기",
        subtitle: "화려한 레스토랑부터 골목길 구석의 오랜 노포까지, 전 세계 도시의 고유한 향기와 맛을 찾아 떠나는 미식 탐험가의 리얼 로드 트래블 가이드입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
          ctaText: "미식 지도 구독하기",
          ctaLink: "#contact",
          features: [
            { text: "광고 없이 직접 발로 뛰어 찾은 100% 리얼 로컬 맛집 리스트" },
            { text: "감각적인 인테리어와 시그니처 메뉴가 있는 숨은 카페 큐레이션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "고메 에디션 연재 코너",
        subtitle: "독자 여러분의 주말을 더 맛있고 특별하게 만들어 줄 전문 미식 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "숨은 로컬 노포 탐방",
              description: "수십 년간 한 자리를 지켜온 장인들의 손맛과 그 골목길 고유의 역사, 그리고 숨겨진 대표 메뉴를 생생하게 기록합니다.",
              icon: "Map"
            },
            {
              title: "트렌디 카페 & 디저트 투어",
              description: "에스프레소 바의 깊은 향부터 화려한 파티스리 숍까지, 공간의 미학과 맛을 동시에 잡은 핫플레이스를 큐레이션합니다.",
              icon: "Coffee"
            },
            {
              title: "글로벌 테이스트 저널",
              description: "해외 여행지에서 반드시 맛봐야 할 이국적인 스트리트 푸드부터 정통 파인 다이닝까지의 미식 여정을 에세이로 풀어냅니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "맛과 멋을 기록하는 푸드 트래블러",
        subtitle: "음식을 통해 그 지역의 문화를 가장 깊숙이 들여다봅니다.",
        content_data: {
          description: "안녕하세요. 전 세계의 맛있는 냄새를 따라 여행하는 매거진 에디터 출신의 고메 트래블러입니다. 단순한 식사를 넘어 한 접시의 요리에 담긴 셰프의 철학과 지역의 이야기를 발굴하는 데 깊은 매력을 느낍니다. 광고성 정보에 지친 분들을 위해 엄선된 미식 가이드와 감각적인 공간 리뷰를 아낌없이 공유해 드리겠습니다.",
          stats: [
            { label: "월간 아티클 조회수", value: "65,000+" },
            { label: "직접 탐방한 로컬 스팟", value: "380곳+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "주간 고메 레터 신청하기",
        subtitle: "매주 금요일 아침, 이번 주말에 당장 떠나기 좋은 시크릿 맛집 리스트와 특별 할인 쿠폰 정보를 메일함으로 바로 보내드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 구독하기"
        }
      }
    ]
  },

  literary_essay_emerald: {
    templateId: "literary_essay_emerald",
    name: "에메랄드 아카이브",
    category: "Blog",
    description: "깊이 있는 고전 문학 비평, 창작 에세이, 인문학 평론을 차분하게 기록해 나가는 지적인 무드의 블로그입니다. 깊은 에메랄드 그린과 차분한 세이지 그린, 고결한 골드 옐로우 포인트가 격조 높은 서재의 분위기를 완성합니다.",
    image: "/templates/literary_essay_emerald.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#065f46",     // 깊은 에메랄드 그린
        secondary: "#a7f3d0",   // 차분한 세이지 그린
        accent: "#eab308",      // 고결한 골드 옐로우 포인트
        background: "#f4f6f4",  // 눈이 편안하고 차분한 오프화이트
        surface: "#ffffff",     // 단정한 순백색 카드
        text: "#111827"         // 클래식하고 명확한 잉크 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "텍스트의 숲에서 길을 찾다",
        subtitle: "시대를 관통하는 고전 문학의 숨은 문장들을 재해석하고, 일상의 철학적 사유를 묵직한 잉크로 기록해 나가는 인문학 아카이브 공간입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
          ctaText: "아카이브 정독하기",
          ctaLink: "#contact",
          features: [
            { text: "매월 엄선하는 고전 및 현대 문학 심층 비평 리포트" },
            { text: "삶의 본질을 탐구하는 인문학 및 철학 에세이 연재" }
          ]
        }
      },
      {
        section_type: "services",
        title: "서재의 연재 목록",
        subtitle: "사유의 깊이를 더하고 영혼을 채워줄 문학적 카테고리 컬렉션입니다.",
        content_data: {
          items: [
            {
              title: "심야 고전 비평",
              description: "도스토옙스키부터 카뮈까지, 시대를 초월하여 인류에게 질문을 던지는 명작들을 현대적인 시선으로 다시 읽고 분석합니다.",
              icon: "BookOpen"
            },
            {
              title: "새벽녘 창작 에세이",
              description: "도심의 소음이 가라앉은 시간, 일상의 사소한 단편들에서 포착해 낸 삶과 죽음, 사랑과 고독에 관한 단상들을 글로 나눕니다.",
              icon: "Sparkles"
            },
            {
              title: "현대 사회와 인문학",
              description: "급변하는 디지털 테크 사회 속에서 우리가 잃어버리지 말아야 할 인간 존엄성과 아날로그적 사유의 가치를 평론합니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "글을 쓰고 문장을 읽는 문학 평론가",
        subtitle: "유행처럼 소비되는 말 대신, 영원히 남을 글을 지향합니다.",
        content_data: {
          description: "안녕하세요. 에메랄드 아카이브를 이끌어가는 문학 연구자이자 수필가입니다. 정보의 홍수 속에서 자극적인 콘텐츠에 지친 분들을 위해, 한 문장을 읽더라도 깊은 울림을 줄 수 있는 밀도 높은 텍스트를 생산하고 있습니다. 이 정적이고 깊은 공간이 여러분의 지친 지성과 마음을 평온하게 채워주는 밤샘 서재가 되길 바랍니다.",
          stats: [
            { label: "서재 단골 정기 독자", value: "11,500+" },
            { label: "집필된 평론 및 에세이", value: "290편+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "에메랄드 서신 구독 신청",
        subtitle: "격주 보름달이 뜨는 날 밤, 필자가 엄선한 이달의 문장과 깊이 있는 인문학 비평 리포트를 메일로 정중히 보내드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  gadget_review_purple: {
    templateId: "gadget_review_purple",
    name: "일렉트릭 가젯 랩",
    category: "Blog",
    description: "최신 스마트폰 언박싱, 웨어러블 디바이스 및 하이테크 하드웨어 벤치마크 리뷰 전문 테마입니다. 미래지향적 일렉트릭 바이올렛/퍼플과 네온 옐로우의 하이 콘트라스트가 테크니컬한 감성을 극대화합니다.",
    image: "/templates/gadget_review_purple.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#6d28d9",     // 일렉트릭 바이올렛/퍼플
        secondary: "#facc15",   // 개성 넘치는 네온 옐로우
        accent: "#a855f7",      // 미래지향적인 사이버 라벤더
        background: "#090d16",  // 다크 카본 슬레이트 딥 블랙
        surface: "#1e1b4b",     // 깊이감 있는 하이테크 인디고 퍼플 카드
        text: "#f8fafc"         // 광채가 느껴지는 밝은 오프화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "하드웨어의 한계를 측정하는 테크 오디세이",
        subtitle: "스펙 시트 너머의 리얼 퍼포먼스 체크! 최신 스마트 디바이스, 커스텀 PC 기어, 미래형 테크 가젯들을 얼리어답터의 시선으로 날카롭게 해부합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "연구소 입장하기",
          ctaLink: "#contact",
          features: [
            { text: "성능 한계점까지 밀어붙이는 극한의 벤치마크 테스트 리포트" },
            { text: "광고 협찬 배제, 철저한 내돈내산 하이테크 장단점 분석" }
          ]
        }
      },
      {
        section_type: "services",
        title: "가젯 테스트 매트릭스",
        subtitle: "스마트 컨슈머들을 위해 준비된 완벽한 하드웨어 분석 데이터베이스입니다.",
        content_data: {
          items: [
            {
              title: "스마트폰 & 모바일 랩",
              description: "플래그십 스마트폰의 AP 프로세서 스로틀링 테스트부터 실사용 배터리 타임, 전문가용 카메라 센서 성능을 비교 분석합니다.",
              icon: "Tv"
            },
            {
              title: "데스크테리어 & 커스텀 기어",
              description: "작업 능률을 극대화하는 고주사율 모니터, 기계식 키보드 축별 타건 샵 리뷰 및 미니멀 하이테크 데스크 셋업을 제안합니다.",
              icon: "Flame"
            },
            {
              title: "퓨처 웨어러블 테크",
              description: "스마트 워치, AR 글래스, 차세대 무선 이어폰의 노이즈 캔슬링 음향 성능 등 몸에 닿는 모든 테크 기기를 측정합니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "하드웨어를 해부하는 칩 아키텍트",
        subtitle: "마케팅 거품을 걷어내고 숫자가 말하는 진짜 성능만 보여줍니다.",
        content_data: {
          description: "안녕하세요. 전자공학을 전공하고 테크 하드웨어 전문 리뷰어로 활동 중인 가젯 랩 디렉터입니다. 화려한 광고 문구에 속아 후회하는 소비자가 없도록, 오직 객관적인 벤치마크 툴 데이터와 실사용 피드백만을 바탕으로 독설에 가까운 솔직한 평론을 연재합니다. 가장 트렌디하고 정확한 하이테크 카탈로그를 경험해 보세요.",
          stats: [
            { label: "채널 정기 구독자", value: "48,000+" },
            { label: "벤치마크 장비 리뷰", value: "620개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "얼리어답터 가젯 뉴스 알림",
        subtitle: "글로벌 테크 기업들의 신제품 출시 키노트 요약본과 하이테크 가젯 최저가 핫딜 정보를 누구보다 빠르게 스마트폰 알림처럼 받아보세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 구독하기"
        }
      }
    ]
  },

  visual_gallery_gray: {
    templateId: "visual_gallery_gray",
    name: "모노크롬 포토 저널",
    category: "Blog",
    description: "거리 사진, 미니멀 그래픽 디자인, 시각 예술가의 에세이를 액자식으로 전시하는 포토 저널 블로그입니다. 웜 그레이와 무채색 블랙/화이트 대비가 완벽한 미니멀리즘 갤러리 감성을 완성합니다.",
    image: "/templates/visual_gallery_gray.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#111827",     // 잉크젯 블랙
        secondary: "#4b5563",   // 세련된 웜 그레이
        accent: "#ef4444",      // 강렬한 프레임 레드 포인트
        background: "#f9fafb",  // 정갈한 미술관 벽면 같은 화이트 스페이스
        surface: "#ffffff",     // 작품을 돋보이게 하는 화이트 캔버스
        text: "#111827"         // 선명한 가독성의 다크 그레이 블랙
      },
      borderRadius: "rounded-none", // 직선의 미학을 극대화한 제로 라운딩
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "선과 면, 그리고 빛이 머무는 찰나의 프레임",
        subtitle: "장식적 요소를 모두 배제한 극도의 미니멀리즘 시선. 전 세계 도시의 길거리에서 포착한 빛과 그림자의 앙상블을 흑백 비주얼과 짧은 문장으로 전시합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
          ctaText: "갤러리 입장",
          ctaLink: "#contact",
          features: [
            { text: "도시 아키텍처와 인간의 상호작용을 다룬 포토 에세이" },
            { text: "현대 그래픽 디자인 거장들의 레이아웃 및 타이포그래피 분석" }
          ]
        }
      },
      {
        section_type: "services",
        title: "전시실 안내 (Exhibition)",
        subtitle: "시각적 영감을 정제된 감각으로 큐레이션한 세 가지 아카이브 전시 공간입니다.",
        content_data: {
          items: [
            {
              title: "스트리트 포토 저널",
              description: "필터 없는 라이카 카메라이기에 가능했던 찰나의 순간들, 도시의 외로움과 고독, 일상의 따스함을 모노톤 사진으로 기록합니다.",
              icon: "Camera"
            },
            {
              title: "그래픽 & 타이포 미학",
              description: "스위스 인터내셔널 스타일부터 바우하우스까지, 현대 시각 디자인의 뼈대를 이루는 그리드 시스템과 폰트 디자인을 탐구합니다.",
              icon: "Sparkles"
            },
            {
              title: "현대 시각 예술 평론",
              description: "현대 미술 비엔날레와 신진 미니멀리즘 아티스트들의 전시 감상평을 공유하고 시각 예술의 미래를 예측합니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "프레임을 설계하는 시각 예술가",
        subtitle: "화려한 색채를 지울 때 비로소 사물의 본질이 드러납니다.",
        content_data: {
          description: "안녕하세요. 모노크롬 포토 저널을 운영하는 비주얼 아티스트이자 스트리트 포토그래퍼입니다. 과도한 색상과 수식어로 가득 찬 세상에서, 저는 흑백의 대비와 정갈한 선의 배치만으로 깊은 울림을 전하는 작업을 하고 있습니다. 이 저널은 저의 개인적인 시각적 실험실이자, 복잡한 세상 속에서 시각적 휴식을 갈망하는 모든 예술 애호가들을 위한 디지털 미술관입니다.",
          stats: [
            { label: "누적 아카이빙 프레임", value: "1,500+" },
            { label: "기획 전시 리뷰", value: "140회+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "위클리 비주얼 아트 저널 구독",
        subtitle: "매주 일요일 밤, 도심의 소음이 멈추는 시간, 영감을 자극하는 한 장의 사진과 타이포그래피 에세이를 메일함 캔버스에 띄워 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  urban_garden_olive: {
    templateId: "urban_garden_olive",
    name: "올리브 어반 가드닝",
    category: "Blog",
    description: "도심 속 베란다 정원, 반려식물 인테리어, 초록빛 느린 일상(Slow Life)을 기록하는 홈 가드닝 블로그 테마입니다. 따뜻한 올리브 그린과 자연을 닮은 샌드 베이지가 마음의 휴식을 선사합니다.",
    image: "/templates/urban_garden_olive.png",
    theme: {
      fontFamily: "Pretendard, Quicksand, sans-serif",
      colors: {
        primary: "#556b2f",     // 따뜻한 올리브 그린
        secondary: "#f5ebe0",   // 자연을 닮은 샌드 베이지
        accent: "#10b981",      // 싱그러운 민트 초록 포인트
        background: "#f4f7f4",  // 편안한 내추럴 그린 틴트 오프화이트
        surface: "#ffffff",     // 깨끗하고 오가닉한 화이트 컨테이너
        text: "#2f3e1b"         // 깊은 이끼색을 닮은 다크 올리브 본문색
      },
      borderRadius: "rounded-3xl", // 식물의 유기적인 선을 반영한 곡률
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "콘크리트 숲속에서 나만의 작은 정원을 가꾸다",
        subtitle: "도심 속 작은 베란다를 초록빛 싱그러움으로 가득 채우는 플랜테리어 노하우와 반려식물이 싹을 틔우고 자라나는 경이로운 슬로우 라이프의 기록입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "가드닝 캘린더 받기",
          ctaLink: "#contact",
          features: [
            { text: "초보 식집사도 절대 죽이지 않는 사계절 실내 식물 케어 매뉴얼" },
            { text: "공간의 분위기를 완전히 바꾸는 감각적인 플랜테리어 인테리어 팁" }
          ]
        }
      },
      {
        section_type: "services",
        title: "가드너의 일상 가이드",
        subtitle: "지구와 나를 모두 치유하는 도심 속 홈 가드닝 콘텐츠 모음입니다.",
        content_data: {
          items: [
            {
              title: "초보 식집사 성장 백과",
              description: "몬스테라, 올리브나무 등 인기 반려식물의 올바른 물주기 365일 법칙, 과습 예방법, 분갈이와 흙 배합의 정석을 전수합니다.",
              icon: "Smile"
            },
            {
              title: "그린 플랜테리어 팁",
              description: "거실, 침실, 주방 등 채광과 통풍 조건에 맞는 완벽한 식물 배치 기법과 토분 선택법을 감각적인 사진과 함께 공유합니다.",
              icon: "Map"
            },
            {
              title: "어반 가든 에세이",
              description: "아침마다 새로 돋아나는 연둣빛 새순을 바라보며 느끼는 경이로움, 느리지만 단단하게 흘러가는 가드너의 치유 에세이입니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "초록빛 위로를 전하는 어반 가드너",
        subtitle: "식물을 키우는 행위는 결국 내 마음을 돌보는 일입니다.",
        content_data: {
          description: "안녕하세요. 회색빛 아파트 베란다에서 80여 종의 반려식물과 함께 숨 쉬고 있는 홈 가드너 올리브입니다. 삭막한 도심 일상에서 번아웃을 겪었을 때, 말없이 초록빛 위로를 건네준 식물들의 힘을 믿습니다. 화려하진 않지만 흙을 만지고 물을 주며 배우는 자연의 순리와, 삶의 속도를 늦추는 슬로우 라이프의 기쁨을 여러분과 나누고 싶습니다.",
          stats: [
            { label: "함께 숨 쉬는 식집사 이웃", value: "19,500+" },
            { label: "반려식물 치유 기록", value: "340편+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "그린 가드닝 레터 정기 구독",
        subtitle: "매달 절기 변화에 맞춘 식물 물주기 알림, 계절별 분갈이 타이밍 및 희귀 식물 마켓 정보를 메일로 향긋하게 배달해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },
  developer_log_cyan: {
    templateId: "developer_log_cyan",
    name: "디벨로퍼 시안 로그",
    category: "Blog",
    description: "프론트엔드/백엔드 개발 스택 연구, 디버깅 기록, 오픈소스 기고 등을 세련되게 공유하는 개발자 전문 기술 블로그입니다. 어두운 딥 그레이/블랙 기반 코딩 테마에 가독성이 뛰어난 네온 시안 블루가 더해져 몰입감을 극대화합니다.",
    image: "/templates/developer_log_cyan.png",
    theme: {
      fontFamily: "Fira Code, SF Mono, monospace",
      colors: {
        primary: "#22d3ee",     // 네온 시안 블루
        secondary: "#475569",   // 포인트 그레이
        accent: "#818cf8",      // 코드 하이라이팅 인디고
        background: "#0f172a",  // 어두운 딥 슬레이트 블랙
        surface: "#1e293b",     // 정돈된 코드 블록 스타일 카드
        text: "#e2e8f0"         // 가독성이 뛰어난 소프트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "로그를 통해 성장하는 개발자의 아카이브",
        subtitle: "단순한 코드 한 줄을 넘어, 완벽한 소프트웨어 아키텍처와 지속 가능한 엔지니어링 생태계를 위한 디버깅 및 오픈소스 트래킹 기록입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80",
          ctaText: "기술 로그 구독",
          ctaLink: "#contact",
          features: [
            { text: "최신 웹 인프라 및 Next.js 풀스택 최적화 실무 전략" },
            { text: "대규모 트래픽을 견디는 확장 가능한 마이크로서비스 설계" }
          ]
        }
      },
      {
        section_type: "services",
        title: "기술 연구 스택",
        subtitle: "견고한 소프트웨어를 빌드하기 위해 깊이 있게 연구하는 핵심 기술 분야입니다.",
        content_data: {
          items: [
            {
              title: "프론트엔드 엔지니어링",
              description: "런타임 성능 최적화, 최신 렌더링 프레임워크 패러다임 분석, 컴포넌트 주도 개발 패턴을 심도 있게 다룹니다.",
              icon: "Terminal"
            },
            {
              title: "시스템 아키텍처",
              description: "복잡한 도메인 모델 설계, 클라우드 네이티브 배포 자동화 인프라 및 분산 데이터베이스 동기화 이슈를 해부합니다.",
              icon: "Flame"
            },
            {
              title: "디버깅 & 오픈소스",
              description: "프로덕션 레벨에서 마주한 치명적인 장애 복구 회고록과 오픈소스 라이브러리 메인터너 참여 경험을 공유합니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "코드의 본질을 탐구하는 아키텍트",
        subtitle: "모든 복잡성 뒤에는 명쾌하고 단순한 솔루션이 존재한다고 믿습니다.",
        content_data: {
          description: "안녕하세요. 웹 생태계의 발전과 견고한 엔지니어링 문화를 지향하는 프론트엔드 아키텍트입니다. 반복되는 트러블슈팅과 아키텍처의 한계를 깨부수는 과정에서 배운 실무 인사이트를 기록하고 있습니다. 누구나 신뢰할 수 있고, 읽기 쉽지만 깊은 통찰력을 제공하는 기술적 이정표가 될 수 있도록 밀도 높은 연재를 이어갑니다.",
          stats: [
            { label: "정기 구독 엔지니어", value: "15,600+" },
            { label: "누적 기술 리포트", value: "380편+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "주간 개발자 로그 알림",
        subtitle: "매주 월요일 출근길, 실무에 즉시 적용 가능한 오픈소스 핵심 업데이트 리포트와 프론트엔드 트렌드 요약본을 안전하게 배달해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  diy_craft_sand: {
    templateId: "diy_craft_sand",
    name: "아티산 크래프트",
    category: "Blog",
    description: "가죽 공예, 목공예, 수제 도자기, 홈 인테리어 DIY 등 아티산 크리에이터의 정교한 창작 공방 블로그입니다. 따뜻하고 부드러운 샌드 베이지와 테라코타 클레이 오렌지가 수공예 고유의 온기를 표현합니다.",
    image: "/templates/diy_craft_sand.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#c2410c",     // 테라코타 클레이 오렌지
        secondary: "#f5ebe0",   // 부드러운 샌드 베이지
        accent: "#451a03",      // 빈티지 차콜 브라운
        background: "#fffbf7",  // 포근한 오가닉 화이트
        surface: "#fbf3ea",     // 따뜻함이 감도는 클레이 서페이스
        text: "#292524"         // 눈이 편안한 다크 스톤
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "손끝에서 피어나는 아티산의 아틀리에",
        subtitle: "기계식 대량 생산이 줄 수 없는 느림의 미학, 한 땀의 바느질과 한 번의 대패질로 무에서 유를 창조해 내는 핸드크래프트와 인테리어 DIY 제작기입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공방 소식 받기",
          ctaLink: "#contact",
          features: [
            { text: "초보 가드너 및 크래프터를 위한 수공예 기본 가이드" },
            { text: "지속 가능한 원목 및 천연 가죽 소재 고르는 법" }
          ]
        }
      },
      {
        section_type: "services",
        title: "워크숍 카테고리",
        subtitle: "장인 정신의 가치를 한 조각씩 모아둔 오가닉 핸드메이드 스튜디오 연재 섹션입니다.",
        content_data: {
          items: [
            {
              title: "새들 스티치 가죽 공예",
              description: "천연 베지터블 가죽의 에이징 매력부터 패턴 설계, 정교한 마감 기법까지 나만의 시그니처 소품 제작 팁을 나눕니다.",
              icon: "Scissors"
            },
            {
              title: "내추럴 목공 & 인테리어",
              description: "집안의 가구를 내 손으로 직접 고치고 짜는 아날로그 DIY, 친환경 천연 오일 스테인 마감 가이드를 연재합니다.",
              icon: "HeartHandshake"
            },
            {
              title: "슬로우 라이프 아틀리에",
              description: "손으로 무언가를 만드는 몰입의 시간 속에서 정서적 위로와 일상의 평온을 찾는 라이프스타일 에세이입니다.",
              icon: "Coffee"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "작은 공방을 이끄는 마스터 아티산",
        subtitle: "시간의 흐름이 멋스럽게 쌓이는 가치 있는 물건을 만듭니다.",
        content_data: {
          description: "안녕하세요. 핸드크래프트 전문 블로그를 운영하는 공방장 아티산입니다. 빠르게 소비되는 트렌드 속에서 오랜 시간 곁에 두고 쓸 수 있는 수공예 가구와 가죽 소품을 만드는 매력에 빠져 살고 있습니다. 이 공간은 손수 물건을 만드는 과정을 통해 일상의 소음을 비워내고 나만의 취향을 직조해 나가는 모든 크리에이터들을 위한 쉼터입니다.",
          stats: [
            { label: "함께하는 크래프터", value: "8,900+" },
            { label: "오픈된 무료 도안 레시피", value: "120개+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "아티산 아틀리에 레터 신청",
        subtitle: "매월 초, 한정판 무료 공예 패턴 도안과 계절별 홈 인테리어 DIY 소품 제작 팁 캘린더를 정기적으로 전달해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  cozy_cafe_cream: {
    templateId: "cozy_cafe_cream",
    name: "모카 에스프레소 일기",
    category: "Blog",
    description: "매일 마시는 드립 커피, 홈바리스타 추출 레시피, 조용한 주말 아침의 생각 정리를 공유하는 평온한 데일리 에세이 블로그 테마입니다. 모카 크림색과 에스프레소 브라운이 부드러운 카페 무드를 자아냅니다.",
    image: "/templates/cozy_cafe_cream.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#4b382a",     // 깊은 에스프레소 브라운
        secondary: "#fdfaf7",   // 부드러운 모카 크림색
        accent: "#d4a373",      // 따뜻한 카푸치노 스킨 톤
        background: "#faf6f0",  // 은은한 우유 빛깔 웜 화이트
        surface: "#ffffff",     // 깨끗한 도자기 잔을 닮은 표면
        text: "#3c2f2f"         // 다크 원두 빛의 따뜻한 브라운 블랙
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "따뜻한 커피 한 잔에 녹여낸 일상의 숨표",
        subtitle: "원두 향이 가득한 아침의 시작, 완벽한 에스프레소 한 잔을 위한 바리스타 추출 변수 가이드와 조용히 생각에 잠기는 잔잔한 주말 에세이 아카이브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
          ctaText: "커피 일기 정독하기",
          ctaLink: "#contact",
          features: [
            { text: "싱글 오리진 원두 노트별 핸드드립 미세 정밀 가이드" },
            { text: "아늑한 도심 속 숨은 로스터리 카페 탐방 및 공간 리뷰" }
          ]
        }
      },
      {
        section_type: "services",
        title: "바리스타 노트 목록",
        subtitle: "커피 한 잔과 함께 깊어지는 취향과 일상의 다정한 이야기들입니다.",
        content_data: {
          items: [
            {
              title: "홈바리스타 브루잉 랩",
              description: "원두 분쇄도, 물의 온도, 추출 시간의 황금 비율을 찾아 집에서도 카페 퀄리티의 스페셜티 커피를 내리는 방법을 연구합니다.",
              icon: "Coffee"
            },
            {
              title: "글로벌 로스터리 큐레이션",
              description: "장인정신으로 원두를 볶아내는 전국 및 해외의 숨겨진 로스터리 샵을 탐방하고 그곳만의 브랜드 스토리를 나눕니다.",
              icon: "Sparkles"
            },
            {
              title: "주말 오전의 모카 에세이",
              description: "잔잔한 재즈 음악과 함께 퍼지는 커피 향 속에서, 바쁜 한 주 동안 잊고 지냈던 내면의 단상들을 기록합니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "매일 아침 원두를 내리는 홈바리스타",
        subtitle: "커피를 내리는 짧은 침묵 속에서 삶의 위로를 얻습니다.",
        content_data: {
          description: "안녕하세요. 따뜻한 한 잔의 커피로 하루를 시작하고 마감하는 홈바리스타 에세이스트입니다. 복잡하고 바쁜 디지털 세상이지만, 물이 원두를 통과하는 그 몇 분의 시간만큼은 완벽한 아날로그 쉼표가 되어 줍니다. 저의 공간에 머무시는 동안, 은은한 원두 향기와 포근한 문장들이 독자 여러분의 마음을 따스하게 채워줄 수 있기를 바랍니다.",
          stats: [
            { label: "함께 커피를 마시는 이웃", value: "11,200+" },
            { label: "테이스팅한 스페셜티 원두", value: "260종+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프라이빗 모카 레터 신청",
        subtitle: "매월 둘째 주 목요일, 이달의 추천 원두 패키지 정보와 홈카페 분위기를 한층 올려줄 재즈 플레이리스트를 선물로 발송해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  pet_companion_yellow: {
    templateId: "pet_companion_yellow",
    name: "마이 펫 컴패니언",
    category: "Blog",
    description: "반려동물 건강 정보, 올바른 훈련법, 유기동물 보호 캠페인을 다정한 감성으로 공유하는 반려인 블로그입니다. 긍정적인 에너지를 주는 따뜻한 옐로우와 부드러운 오프화이트가 행복한 패밀리 무드를 형성합니다.",
    image: "/templates/pet_companion_yellow.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#eab308",     // 따뜻한 해피 옐로우
        secondary: "#fef9c3",   // 소프트 파스텔 옐로우
        accent: "#f43f5e",      // 사랑스러운 하트 핑크
        background: "#fefef9",  // 정갈한 아이보리 오프화이트
        surface: "#ffffff",     // 부드러운 라운딩 컨테이너
        text: "#451a03"         // 친근하면서도 또렷한 딥 브라운
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "반려동물과 함께 걷는 더 행복한 발걸음",
        subtitle: "강아지, 고양이의 마음을 읽는 행동학 가이드부터 오가닉 건강 수제 간식 레시피까지, 평생을 함께할 우리 아이를 위한 친절한 전문 아카이브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "반려 캘린더 정독",
          ctaLink: "#contact",
          features: [
            { text: "행동 교정 전문가가 제안하는 올바른 분리불안 완화 훈련법" },
            { text: "수의사 자문 기반 연령별 필수 영양소 및 건강 검진 리포트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "해피 펫 큐레이션",
        subtitle: "사랑하는 나의 아이와 오래도록 건강하게 동행하기 위한 핵심 연재 세션입니다.",
        content_data: {
          items: [
            {
              title: "댕냥이 긍정 강화 교육",
              description: "강압적인 통제 대신 아이의 심리를 이해하고 교감하는 카밍 시그널 해설 및 매너 워킹 산책 훈련법을 세밀하게 나눕니다.",
              icon: "Smile"
            },
            {
              title: "오가닉 펫 다이어트",
              description: "인공 보존제 없는 건강한 수제 영양식 만들기, 알레르기를 유발하지 않는 연령별 맞춤 식단 다이어리를 기록합니다.",
              icon: "Heart"
            },
            {
              title: "사지 말고 입양하세요",
              description: "유기동물 보호소의 따뜻한 입양 비하인드 스토리와 성숙한 반려 문화 정착을 위한 다정한 캠페인을 진행합니다.",
              icon: "HeartHandshake"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "반려동물의 행복을 연구하는 패밀리 디렉터",
        subtitle: "아이들의 눈높이에서 세상을 바라보며 올바른 상식을 공유합니다.",
        content_data: {
          description: "안녕하세요. 반려견 두 마리, 반려묘 한 마리와 함께 동거동락 중인 펫 라이프 크리에이터입니다. 아이들을 키우며 겪었던 수많은 시행착오와 수의학적 데이터를 바탕으로 동네 이웃처럼 친근하면서도 확실한 전문 정보를 나누고자 합니다. 모든 반려동물이 사랑받고 행복하게 뛰어놀 수 있는 세상을 위해 다정하게 소통하겠습니다.",
          stats: [
            { label: "함께하는 동반 식구", value: "22,500+" },
            { label: "해결된 행동 교정 상담", value: "410건+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "달콤한 펫 컴패니언 레터 정기 구독",
        subtitle: "매주 목요일, 계절별 심장사상충 예방 관리 데드라인 알림과 반려동물 동반이 가능한 전국 감성 동반 여행지 지도를 무료로 보내드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  },

  creative_poetry_purple: {
    templateId: "creative_poetry_purple",
    name: "뮤즈 라이팅 스페이스",
    category: "Blog",
    description: "소설, 시, 시나리오 스크립트 및 몽환적인 상상력이 가득한 크리에이티브 라이팅 독립 문학 블로그 테마입니다. 신비로운 플럼 바이올렛과 부드러운 살구빛 크림 배경이 예술적 영감을 극대화합니다.",
    image: "/templates/creative_poetry_purple.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#4c1d95",     // 신비로운 플럼 바이올렛
        secondary: "#fce7f3",   // 부드러운 파스텔 핑크 그라데이션
        accent: "#db2777",      // 감각적인 크림슨 핑크
        background: "#fffaf6",  // 부드러운 살구빛 크림 배경
        surface: "#ffffff",     // 원고지를 닮은 순백색 카드
        text: "#1e1b4b"         // 깊은 한밤중의 미드나잇 퍼플 블랙
      },
      borderRadius: "rounded-none", // 원고지의 엄격하고 정갈한 선을 담은 직선 미학
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "한밤중의 서제, 단 하나의 문장을 잉크로 채우다",
        subtitle: "현실의 경계를 허무는 몽환적인 소설 아카이브와 마음의 심연을 정밀하게 묘사하는 창작 시, 스크립트 라이팅을 위한 완전하고 프라이빗한 순수 문학 공간입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
          ctaText: "문학 아카이브 구독",
          ctaLink: "#contact",
          features: [
            { text: "매주 정기적으로 업데이트되는 단편 소설 및 판타지 시나리오" },
            { text: "창작 작가들을 위한 스토리텔링 플롯 빌딩 및 묘사법 노트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "뮤즈의 창작실",
        subtitle: "영혼의 심연에서 길어 올린 이야기와 은유 가득한 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "창작 시 & 조각 에세이",
              description: "일상의 사소한 사물과 기억에서 영감을 받아 운율 있는 언어로 빚어낸 오리지널 창작 시와 감성 조각 글을 연재합니다.",
              icon: "Feather"
            },
            {
              title: "단편 문학 및 시나리오",
              description: "인간의 입체적인 내면을 다룬 현대 문학 단편 소설과 극적인 긴장감이 살아 숨 쉬는 웹 스크립트 시놉시스를 아카이빙합니다.",
              icon: "BookOpen"
            },
            {
              title: "스토리 라이팅 워크숍",
              description: "매력적인 캐릭터를 입체적으로 설정하는 법, 독자를 매료시키는 플롯 배치 공식 등 글쓰기 꿀팁과 창작 도구를 나눕니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "영혼을 받아적는 독립 문학 작가",
        subtitle: "가장 개인적인 이야기 속에 가장 거대한 보편적 영감이 존재합니다.",
        content_data: {
          description: "안녕하세요. 하얀 원고지 위에 영혼의 궤적을 잉크로 새겨나가는 크리에이티브 라이터 뮤즈입니다. 세상이 강요하는 정답 대신, 마음의 심연에 일렁이는 불안과 사랑, 몽환적인 환상들을 활자로 붙잡아두는 작업을 하고 있습니다. 자극적인 숏폼의 시대이지만, 이곳에서만큼은 단 한 줄의 정제된 문장이 주는 묵직한 울림을 함께 호흡할 수 있기를 진심으로 바랍니다.",
          stats: [
            { label: "함께 숨 쉬는 독자층", value: "9,800+" },
            { label: "연재된 독립 문학 수", value: "210편+" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "심야 서신 (Midnight Letter) 신청",
        subtitle: "새벽 두 시, 감성이 가장 짙어지는 시간에 필자가 직접 쓴 미공개 단편 조각 글과 아로마 향이 배어 나오는 큐레이션 메일을 배달해 드립니다.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 신청하기"
        }
      }
    ]
  }
};
