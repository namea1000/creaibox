import { TemplateConfig } from "../registry";

export const MAGAZINE_TEMPLATES: Record<string, TemplateConfig> = {
  // ==========================================
  // BATCH 1: Tech, Fashion, Architecture, Gourmet, Travel
  // ==========================================
  tech_weekly: {
    templateId: "tech_weekly",
    name: "주간 테크 & 미래 트렌드 매거진",
    category: "Magazine",
    description: "테크니컬한 다크 인디고 배경 위에 강렬한 네온 시안 블루와 레이저 옐로우 액센트를 적용하여 혁신적인 IT 트렌드와 미래 기술을 전문적으로 다루는 디지털 주간지 테마입니다.",
    image: "/templates/tech_weekly.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#06b6d4",     // 네온 일렉트릭 시안 블루
        secondary: "#facc15",   // 혁신 레이저 옐로우
        accent: "#ec4899",      // 사이버 마젠타 핑크
        background: "#090d16",  // 미래적인 다크 나이트 인디고
        surface: "#111827",     // 세련된 아키텍처 차콜 슬레이트
        text: "#f3f4f6"         // 시인성 높은 네온 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "실리콘밸리가 주목하는 자율형 AI 에이전트의 대두와 노동의 종말",
        subtitle: "단순 챗봇을 넘어 인간의 개입 없이 목표를 추적해 완수하는 AI 에이전트 경제학의 기원과 미래 일자리의 거대한 파도에 대해 심층 분석합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 주 커버 스토리 읽기",
          ctaLink: "#contact",
          features: [
            { text: "실리콘밸리 현지 특파원의 빅테크 3사 자율주행 특허 심층 해독 리포트" },
            { text: "양자 컴퓨팅 상용화가 암호화폐 암호학 체계에 가져올 파괴적 영향 분석" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이번 주 에디터 초이스",
        subtitle: "비즈니스와 산업 생태계를 바꿀 가장 뜨거운 테크 리포트를 엄선했습니다.",
        content_data: {
          items: [
            {
              title: "생성형 AI와 저작권의 경계",
              description: "대형 언어 모델(LLM) 학습에 투입되는 저작물 사용료 협상 테이블의 이면과 새로운 공정이용 판례를 다룹니다.",
              icon: "Scale"
            },
            {
              title: "양자 컴퓨터, 어디까지 왔나",
              description: "초전도 방식과 이온트랩 방식의 상용화 대결 구도 및 국내 양자 소부장 생태계의 현주소를 정밀 취재했습니다.",
              icon: "Cpu"
            },
            {
              title: "차세대 전고체 배터리 서밋",
              description: "리튬이온 배터리의 화재 위험을 종식하고 에너지 밀도를 2배로 올리는 꿈의 전고체 배터리 상용화 데드라인을 예측합니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "기술과 인간의 경계에서, 미래의 가장 명확한 신호를 읽어냅니다",
        subtitle: "정보의 복잡한 소음을 걷어내고, 영속성을 가진 진정한 지적 통찰만을 전달합니다.",
        content_data: {
          description: "안녕하십니까. 주간 테크 매거진의 편집장입니다. 매일 쏟아지는 자극적인 기술 뉴스 홍수 속에서 진짜 비즈니스 모델이 될 기술적 혁신을 판별하기란 매우 어렵습니다. 우리는 공학 박사 출신의 수석 IT 전문 기자들과 벤처 캐피탈리스트 심사역진이 상시 공조하여, 유행에 가려진 핵심 기술의 원리를 투명하고 알기 쉽게 해독해 오고 있습니다. 당신의 지적 테크 자산을 한 단계 각성시키십시오.",
          stats: [
            { label: "유료 정기 구독자", value: "35,000명+" },
            { label: "글로벌 테크 특파원", value: "14명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "스페셜 테크 아카이브",
        subtitle: "최고 만족도의 독자 평가를 받은 주간 테크의 명품 기획 특집 컬렉션입니다.",
        content_data: {
          items: [
            { title: "웹3.0과 분산 원장 기술의 침체기 극복 방안", description: "과대광고의 거품이 꺼진 블록체인 업계가 실제 금융 RWA 토큰화를 통해 자생해나가는 과정 정밀 보도", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" },
            { title: "로봇 저널: 휴머노이드 가사 노동의 서막", description: "테슬라 옵티머스가 집안일을 돕고 공장 조립 라인에 투입되는 상용화 가격대 분석 기획 에디션", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "핵융합 발전: 인공태양 프로젝트의 블루프린트", description: "프랑스 ITER 프로젝트와 국내 KSTAR 초고온 플라즈마 300초 유지 달성을 이끈 과학자들의 밀착 인터뷰", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "정기 구독 신청 및 광고 게재 제안",
        subtitle: "개인 정기 우편 배송 신청, 기업형 단체 구독 할인 문의, 혹은 기술 기고/배너 광고 제안은 아래 양식을 채워 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "비즈니스 제안 및 구독 신청"
        }
      }
    ]
  },

  fashion_vogue_modern: {
    templateId: "fashion_vogue_modern",
    name: "보그 모던 패션 & 컬처 매거진",
    category: "Magazine",
    description: "순수 캔버스 화이트 배경 위에 럭셔리 마젠타 로즈 핑크와 카본 블랙 액센트를 적용하여 런웨이 패션과 오트쿠튀르 컬처를 우아하게 다루는 패션 매거진 테마입니다.",
    image: "/templates/fashion_vogue_modern.png",
    theme: {
      fontFamily: "Cormorant Garamond, Montserrat, sans-serif",
      colors: {
        primary: "#be123c",     // 매혹적인 오트쿠튀르 로즈 핑크
        secondary: "#f1f5f9",   // 클린 그레이
        accent: "#111827",      // 런웨이 카본 블랙
        background: "#ffffff",  // 퓨어 화이트 캔버스
        surface: "#fbf8f9",     // 부드러운 패브릭 펄 화이트
        text: "#111827"         // 시인성 높은 다크 초콜릿 차콜
      },
      borderRadius: "rounded-none", // 직선의 세련됨을 강조한 에지 레이아웃
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "밀라노 런웨이에서 부활한 70년대 미니멀리즘과 젠더리스 실루엣",
        subtitle: "화려한 오버 코트와 과장된 패턴을 배제하고, 자연스러운 원단 흘림 드레이핑과 모노톤 미니멀리즘으로 귀환한 이번 시즌 밀라노 패션위크의 파괴적 미학을 심층 취재했습니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
          ctaText: "디렉터스 런웨이 칼럼 읽기",
          ctaLink: "#contact",
          features: [
            { text: "프랑스 샤넬 및 이탈리아 구찌 수석 크리에이티브 디렉터들의 인터뷰 번역 에디션" },
            { text: "친환경 비건 선인장 가죽과 재생 나일론 원사로 빚어내는 지속 가능한 명품 하우스의 태동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 스타일 에센셜",
        subtitle: "패션 에디터가 이번 달 최고의 착장과 액세서리 아이템을 큐레이션해 드립니다.",
        content_data: {
          items: [
            {
              title: "오버사이즈 실크 셋업 매칭",
              description: "스커트와 팬츠의 경계를 허물고 흐르는 듯한 오간자 실크 린넨 혼방 원단으로 완성한 시티 포멀 룩 연출법을 다룹니다.",
              icon: "Sparkles"
            },
            {
              title: "올드머니 룩의 품격: 주얼리 레이어드",
              description: "로고 노출 없이 부티크를 풍기는 골드 펄 링과 볼드한 아날로그 브론즈 체인을 활용해 기품을 더하는 팁입니다.",
              icon: "Award"
            },
            {
              title: "어반 아웃도어 고프코어의 진화",
              description: "기능성 바람막이 고어텍스 재킷을 하이힐 및 슬랙스와 과감히 믹스매치하여 완성하는 시티 하이 테크 웨어 가이드입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "옷을 입는 행위는 단순히 육체를 가리는 것을 넘어, 자아를 표출하는 가장 고귀한 선언입니다",
        subtitle: "진정한 스타일은 유행을 무작정 복제하는 것이 아닌, 나만의 체형적 고독을 존중하는 데서 출발합니다.",
        content_data: {
          description: "안녕하십니까. 보그 모던 패션의 편집 주간입니다. 유행이 2주 단위로 바뀌는 울트라 패스트 패션 시대의 소음 속에서, 우리는 대대로 물려줄 수 있는 영속적인 실루엣과 고급 원단의 내러티브에 주목합니다. 옷감 한 올의 짜임새와 재단사의 섬세한 가위질 속에 깃든 미학적 집념을 포착해 나가는 정직하고 품격 높은 하이패션 평론 저널을 만나보십시오.",
          stats: [
            { label: "연간 발행 부수", value: "120,000부" },
            { label: "런웨이 제휴 브랜드", value: "65개사" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "런웨이 에디터스 아카이브",
        subtitle: "독자들에게 큰 영감을 선사했던 최고의 모델 화보 시각 비주얼 에디션 리스트입니다.",
        content_data: {
          items: [
            { title: "침묵 속의 실크: 사막 위의 드레이핑", description: "이집트 사막 한가운데서 실크 가운이 바람에 날리는 찰나를 렌즈로 포착해낸 시그니처 커버 화보", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" },
            { title: "어반 섀도우: 콘크리트 빌딩과 모노톤 수트", description: "회색 빛 도심 노출 콘크리트 벽면과 매트 블랙 모노톤 수트가 자아내는 강렬하고 날 선 기하학적 앙상블", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "비건 라이프: 천연 선인장 가죽 백 에디션", description: "멕시코 유기농 농장 식물성 선인장 원사 가공 가방과 자연 친화적 보태니컬 의류 컬렉션 스냅 리포트", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "보그 멤버십 가입 및 프레스 문의",
        subtitle: "시그니처 양장본 정기 구독 배송 의뢰, 신진 디자이너 룩북 기고 제안, 브랜드 광고 콜라보레이션 제안은 하단 양식을 이용해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "패션 콜라보 제안하기"
        }
      }
    ]
  },

  architecture_design_digest: {
    templateId: "architecture_design_digest",
    name: "아키텍처 & 공간 디자인 다이제스트",
    category: "Magazine",
    description: "묵직한 매트 블랙 철제 프레임과 세련된 시멘트 그레이 대비가 돋보이며 타협하지 않는 직선의 미학을 전하는 하이엔드 건축 & 인테리어 전문 저널 테마입니다.",
    image: "/templates/architecture_design_digest.png",
    theme: {
      fontFamily: "Montserrat, Noto Serif KR, sans-serif",
      colors: {
        primary: "#78716c",     // 차분한 돌그레이 브라운
        secondary: "#e7e5e4",   // 노출 콘크리트 시멘트 그레이
        accent: "#1c1917",      // 단단한 다크 스틸 블랙
        background: "#f5f5f4",  // 도면 같은 단정한 라이트 스틸
        surface: "#ffffff",     // 맑고 깨끗한 화이트 테이블
        text: "#1c1917"         // 선명한 잉크젯 차콜 블랙
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "대지와 호흡하고 자연 채광을 끌어안는 현대 노출 콘크리트 미학",
        subtitle: "과도한 실내 마감 장식을 모두 걷어내고, 기둥의 본질적인 물성과 시간에 따라 이동하는 자연 채광의 각도를 치밀하게 설계하여 완성한 글로벌 친환경 건축 마스터피스를 다룹니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금월의 공간 블루프린트 보기",
          ctaLink: "#contact",
          features: [
            { text: "세계적인 건축 거장들의 미공개 공간 입체 도면(CAD) 및 3D 스페셜 단독 공개" },
            { text: "협소한 대지 공간의 한계를 극적으로 극복해 낸 미니멀리즘 협소 주택 아이디어" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 공간 기획",
        subtitle: "구조적 안정성과 입체적인 실내 시각적 비례감이 조화된 명작 인테리어를 엄선했습니다.",
        content_data: {
          items: [
            {
              title: "히든 도어와 라인 조명의 결합",
              description: "몰딩과 문틀을 완벽하게 제거하여 벽면과 일체화되는 모노리스 거실 평면 구조의 시공 팁을 취재했습니다.",
              icon: "Layers"
            },
            {
              title: "실내 중정과 유기적 플랜팅",
              description: "도심 빌딩 내부로 자연 하늘을 투과시키고 식물을 심어 미세먼지를 차단하며 호흡하는 실내 정원을 분석합니다.",
              icon: "Compass"
            },
            {
              title: "재생 건축: 와이너리 폐공장의 변신",
              description: "버려진 녹슨 붉은 벽돌과 강철 빔 프레임을 고스란히 노출하여 트렌디한 문화예술 복합 공간으로 부활시킨 사례입니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "건축은 단순히 지붕을 얹는 시공을 넘어, 인간의 삶을 규정하는 거대한 그릇을 직조하는 행위입니다",
        subtitle: "가장 단순하게 구획된 구조 속에서 인간은 진정한 평온과 자유를 획득합니다.",
        content_data: {
          description: "안녕하십니까. 공간 다이제스트 편집장입니다. 우리는 자극적인 트렌드성 가구 배치 뉴스를 지양하고, 대지 위에 영구히 남을 건축물의 뼈대와 철근 물성, 그리고 창문 너머의 빛의 투과율을 정교하게 계측하는 해부학적 건축 평론을 고집합니다. 전 세계의 아름다운 친환경 주택, 박물관, 상업 공간의 심장부를 들여다보십시오.",
          stats: [
            { label: "소속 시니어 아키텍트 필진", value: "18명" },
            { label: "글로벌 제휴 설계 연구소", value: "45개소" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "명품 공간 아카이브 저널",
        subtitle: "독자 평론 투표에서 최고의 영감을 준 최고의 공간 디자인들을 입체적으로 수록했습니다.",
        content_data: {
          items: [
            { title: "더 노드(The Node): 기하학적 미술관", description: "콘크리트 캔틸레버 공중 띄움 공법을 활용하여 지면의 부담을 덜어내고 조형적 아우라를 뿜어내는 공공 건축물", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "모노리스(Monolith) 사색 펜트하우스", description: "천연 대리석 슬랩 마감과 무프레임 전면 유리창을 결합하여 야외 숲 전경을 거실 내부로 투과시킨 하이엔드 인테리어", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" },
            { title: "어반 가든 스틸 타워 셋업 리포트", description: "재생 강철 프레임 전면 유리 도어와 실내 중정 수직 플랜팅 디자인을 결합한 유기적 빌딩 빌드업 기획 취재", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "정기 도서 구독 및 기고 제안",
        subtitle: "시그니처 양장 아카이브북 연간 구독 신청, 신축 프로젝트 3D 도면 기고, 브랜드 제휴는 아래로 편지를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "공간 다이제스트 기고 의뢰"
        }
      }
    ]
  },

  culinary_gourmet_table: {
    templateId: "culinary_gourmet_table",
    name: "고메 & 파인 다이닝 미식 매거진",
    category: "Magazine",
    description: "따뜻하고 고급스러운 미식 다이닝 감성의 다크 초콜릿 차콜 배경과 빈티지 황동 골드 포인트 배합으로 미식을 정교하게 다루는 프리미엄 가스트로노미 테마입니다.",
    image: "/templates/culinary_gourmet_table.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#8c531d",     // 잘 볶은 가니쉬 브라운
        secondary: "#faf6f0",   // 화이트 식탁 린넨
        accent: "#d4af37",      // 프리미엄 빈티지 황동 골드
        background: "#1c1411",  // 은은한 다이닝 조명 다크 브라운 차콜
        surface: "#2a1e1b",     // 묵직한 오크 마루 텍스처
        text: "#f5ebe0"         // 가독성이 탁월한 소프트 베이지 크림
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "0.1도 정밀 저온 조리가 빚어낸 한 점의 예술, 미식의 새로운 지평",
        subtitle: "미쉐린 3스타 셰프들의 독점 주방 비밀 레시피와 스페셜티 와인 마리아주 궁합을 해부학적으로 분석하여, 단순한 먹는 행위를 넘어선 미학적 예술의 영역을 탐험하는 가스트로노미 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 파인 다이닝 리뷰 읽기",
          ctaLink: "#contact",
          features: [
            { text: "세계적인 프렌치/모던 한식 다이닝 헤드 셰프들의 수기 창작 철학 전문 번역" },
            { text: "내추럴 와인 내 미생물 발효와 가니쉬 식재료 풍미 결합 공식 과학적 해독 리포트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "고메 에디토리얼",
        subtitle: "미식 평론가들이 엄선한 최고의 퀴진 레스토랑의 핵심 리뷰 목록입니다.",
        content_data: {
          items: [
            {
              title: "분자 요리학: 젤레이션과 에멀전",
              description: "올리브 오일을 파우더로 만들고 수박 주스를 캐비어 모양의 방울로 성형하는 현대 요리 과학의 정점을 파헤칩니다.",
              icon: "Sparkles"
            },
            {
              title: "스페셜티 에스테틱 페어링 가이드",
              description: "프랑스 보르도 올드 빈티지 카베르네 소비뇽과 메인 디쉬 양갈비 육즙의 탄닌 결합도를 계측해 드립니다.",
              icon: "Award"
            },
            {
              title: "K-Food: 발효와 옹기 묵은지",
              description: "3년간 옹기 속에서 저온 유산균 발효를 거친 묵은지의 젖산 농도가 요리의 깊은 감칠맛을 만드는 과정을 취재했습니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "미식은 단순히 칼로리를 채우는 것을 넘어, 오장육부와 자연의 식재료가 나누는 대화입니다",
        subtitle: "접시 위에 올라간 한 잎의 허브 가니쉬조차 완벽한 시각적 비례감 아래 연출되어야 합니다.",
        content_data: {
          description: "안녕하십니까. 고메 테이블 매거진의 수석 음식 칼럼니스트입니다. 우리는 자극적인 맛집 인플루언서 마케팅 뉴스를 철저히 배제하고, 셰프가 냄비의 열량 전도율을 통제하는 과정과 생두 로스팅, 랍스터 살점의 수축 상태를 정밀 분석하는 과학적 요리 비평을 고집합니다. 음식 속에 담긴 인문학적 기원과 자연의 웅장한 가치를 복원해 드리겠습니다.",
          stats: [
            { label: "미쉐린 협업 평론가", value: "14명" },
            { label: "자체 연구 조리 공식", value: "85가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "명품 가스트로노미 갤러리",
        subtitle: "시각과 침샘을 깊이 자극하는 최고 권위의 다이닝 플레이팅 포토 아카이브입니다.",
        content_data: {
          items: [
            { title: "로즈마리 훈연 수비드 랍스터 테일", description: "참나무 칩 연기를 돔 유리관 속에 가두어 향을 스며들게 한 랍스터와 당근 퓨레 가니쉬", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" },
            { title: "트러플 소스 버섯 아뇰로티 파스타", description: "수제 달걀 노른자 생면 반죽 속에 리코타 치즈와 버섯을 채우고 송로버섯 슬라이스를 토핑한 파인 디쉬", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "옹기 속 저온 숙성 숙성 삼겹 편육 정식", description: "감초와 정향을 넣어 뭉근히 삶아낸 편육과 전통 한지 위에 유기 황동 접시 플레이팅 에디션", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "정기 메거진 구독 및 레스토랑 광고 제안",
        subtitle: "고메 테이블 분기별 고급 양장본 배송 의뢰, 다이닝 오픈 초청 프레스 보도 자료 배포는 아래로 편지를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "파인 다이닝 제안하기"
        }
      }
    ]
  },

  travel_wanderlust_journal: {
    templateId: "travel_wanderlust_journal",
    name: "완더러스트 글로벌 트래블 저널",
    category: "Magazine",
    description: "싱그러운 레몬 시트러스 주황과 투명한 사파이어 블루 배합으로 대자연 탐험의 아날로그 자유와 힐링 감성을 담아낸 여행 전문 매거진 테마입니다.",
    image: "/templates/travel_wanderlust_journal.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 선셋 주황
        secondary: "#e0f2fe",   // 청량한 사파이어 스카이 블루
        accent: "#15803d",      // 싱그러운 포레스트 리프 그린
        background: "#fafcfd",  // 맑고 투명한 만년설 오프화이트
        surface: "#ffffff",     // 맑고 깨끗한 아날로그 엽서 화이트
        text: "#1e293b"         // 시인성 높은 다크 슬레이트 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지도의 경계를 지우고, 지구상의 마지막 숨겨진 비경을 탐험하다",
        subtitle: "가이드북에는 나오지 않는 오지의 웅장한 사구와 밤하늘 오로라 숲, 에메랄드 빙하 협곡의 장엄함을 포착하여 독자의 지친 일상에 깊은 마인드 디톡스와 여행 본능을 심어주는 트래블 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 달 스페셜 트래블 정복",
          ctaLink: "#contact",
          features: [
            { text: "전문 아웃도어 탐험 다큐멘터리 사진가들의 고해상도 미공개 자연 뷰 공개" },
            { text: "단독 전용 캠퍼밴을 타고 즐기는 대자연 로드 트립 스페셜 루트 지도 무상 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 여행 목적지",
        subtitle: "관광객들로 붐비지 않는 조용한 힐링 사색의 아일랜드를 안내합니다.",
        content_data: {
          items: [
            {
              title: "아이슬란드 검은 모래 해변과 폭포",
              description: "콘크리트 현무암 절벽과 빙하 조각들이 파도에 쓸려 다니는 검은 모래 해변 비경을 정교하게 담아냈습니다.",
              icon: "Compass"
            },
            {
              title: "모로코 사하라 사구 별빛 캠핑",
              description: "사막 한가운데서 붉은 모래 언덕을 넘나들며 쏟아지는 밤하늘 은하수를 감상하는 로드 트립 코스입니다.",
              icon: "Zap"
            },
            {
              title: "스위스 라우터브루넨 알프스 트레킹",
              description: "70여 개의 장엄한 폭포수가 흘러내리는 웅장한 빙하 골짜기 절벽 아래 동화 같은 마을을 횡단합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "여행은 공간의 수평적 이동이 아닌, 나 자신의 고정관념을 파괴하는 수직적 성찰입니다",
        subtitle: "낯선 골목길에서 길을 잃을 때 비로소 내면의 숨겨진 목소리가 들려옵니다.",
        content_data: {
          description: "안녕하십니까. 완더러스트 저널의 발행인입니다. 우리는 뻔하고 지루한 맛집 투어 쇼핑 여행 광고를 단호히 배제하고, 원주민의 삶의 기원에 동화되고 대자연의 압도적인 아우라를 마주하며 잃어버린 자아를 발견해 나가는 정통 아날로그 저널리즘을 고집합니다. 당신의 방 한쪽 구석에 잠자고 있던 배낭의 지퍼를 다시 여십시오.",
          stats: [
            { label: "누적 답사 전 세계 도시", value: "340개소" },
            { label: "정기 구독 여행 클럽 회원", value: "8,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "글로벌 탐험 사진 기록",
        subtitle: "사진만으로도 심장의 고동을 요동치게 만드는 완더러스트 크루들의 내추럴 여행 스냅입니다.",
        content_data: {
          items: [
            { title: "파타고니아 피츠로이 만년설 일출", description: "이른 아침 황금빛 붉은 태양이 만년설 봉우리를 불태우는 찰나를 텐트 속에서 포착해낸 마스터피스", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80" },
            { title: "토스카나 노란 사이프러스 가로수길", description: "이탈리아 중부 토스카나의 황금빛 구릉지와 사이프러스 나무 가로수길의 따스한 노을빛 전경", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80" },
            { title: "발리 정글 캐노피 우붓 인피니티풀", description: "야자수 잎사귀가 가득한 정글 한가운데 계곡을 바라보며 아침 요가와 명상을 진행하는 친자연 힐링 리조트", image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "정기 구독 및 아날로그 엽서 신청",
        subtitle: "분기별 트래블 매거진 책자 배송 예약, 웰컴 트래블 아날로그 엽서 무상 배송 신청은 하단에 주소와 메일을 적어주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "트래블 저널 구독 신청"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 2: Indie Music, Contemporary Art, Business Fortune, Health Living, Science Cosmos
  // ==========================================
  indie_music_vibe: {
    templateId: "indie_music_vibe",
    name: "인디 뮤직 & 언더그라운드 바이브",
    category: "Magazine",
    description: "강렬한 레코드 턴테이블 네온 바이올렛과 형광 레몬 엘로우 액센트로 언더그라운드 록 밴드와 테크노 파티 미학을 연출한 음악 매거진 테마입니다.",
    image: "/templates/indie_music_vibe.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#a855f7",     // 몽환적인 일렉트릭 바이올렛
        secondary: "#facc15",   // 레코드판 턴테이블 옐로우
        accent: "#f43f5e",      // 심장 박동 베이스 핑크
        background: "#0c0a0f",  // 언더그라운드 다크 바이올렛
        surface: "#18141f",     // 앰프 그릴 차콜 차콜
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "홍대 지하 클럽에서 베를린 테크노 벙커까지, 날것의 아날로그 비트",
        subtitle: "메이저 차트의 상업용 팝송에 가려진 인디 뮤지션들의 독창적인 자작곡 창작 과정과 빈티지 신디사이저 아날로그 음 합성 미학을 심층 취재하여 록 스피릿을 불태우는 서브컬처 음악지입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 주 추천 인디 앨범 듣기",
          ctaLink: "#contact",
          features: [
            { text: "국내 미공개 펑크 록 밴드들의 지하실 라이브 합주 미학 단독 영상 취재" },
            { text: "아날로그 턴테이블 바이닐 레코드 LP 제작 전과정 매뉴얼 가이드 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이번 주 인디 플레이리스트",
        subtitle: "대형 기획사 필터링 없이 날것의 아날로그 감성을 간직한 마스터피스를 엄선했습니다.",
        content_data: {
          items: [
            {
              title: "사이키델릭 록의 몽환적 노이즈",
              description: "이펙터 페달의 피드백 노이즈를 일부러 유도하여 우주적인 고독과 환각을 표현하는 밴드 사운드를 뜯어봅니다.",
              icon: "Music"
            },
            {
              title: "베를린 지하 벙커 테크노 비트",
              description: "아날로그 신디사이저 Moog 모듈러를 직접 커넥트해 140BPM으로 뇌파를 흔드는 미니멀 테크노 음악사입니다.",
              icon: "Zap"
            },
            {
              title: "어쿠스틱 비건 포크: 기타 한 대의 힘",
              description: "화려한 믹싱 기교를 완전히 빼고, 통기타 한 대와 보컬의 쓸쓸한 숨소리만으로 마이크를 채운 포크 음악을 만납니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "음악은 대중의 환호를 사기 위한 상업 상품이 아닌, 내면의 고독을 비트로 토해내는 해방입니다",
        subtitle: "화려한 오토튠에 가려진 목소리의 떨림 속에 진짜 뮤지션의 영혼이 깃들어 있습니다.",
        content_data: {
          description: "안녕하십니까. 바이브 매거진의 편집장입니다. 대형 음원 사이트의 차트 100위가 매번 똑같은 양산형 아이돌 노래로 채워지는 삭막한 문화 속에서, 우리는 아직도 자기 방 지하실에서 낡은 기타 줄을 갈며 가사를 쓰는 신진 싱어송라이터들의 불꽃을 조명합니다. 우리는 상업적 스폰서십을 거부하고, 100% 독립 필진의 냉철한 앨범 평론만을 발행합니다.",
          stats: [
            { label: "등록 인디 뮤지션 수", value: "650팀" },
            { label: "평론 바이닐 앨범 아카이브", value: "1,200장" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "언더그라운드 라이브 현장 포토",
        subtitle: "뮤지션과 관객이 온전히 하나가 되어 거친 호흡을 뿜어내는 라이브 펍 전경입니다.",
        content_data: {
          items: [
            { title: "홍대 지하 클럽 스웨티 베이스 라이브", description: "강력한 일렉트릭 베이스 앰프 울림과 드럼 스틱 타격이 벽면을 흔드는 거칠고 뜨거운 합주 찰나", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" },
            { title: "모듈러 신디사이저 라이브 퍼포먼스", description: "알록달록한 패치 케이블을 노브에 복잡하게 연결하여 즉흥적으로 테크노 주파수를 뽑아내는 뮤지션 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "어쿠스틱 펍 사색 티 라이트 공연", description: "촛불 하나만 켜둔 고요한 나무 무대 위에서 아날로그 어쿠스틱 통기타 솔로 선율을 들려주는 가수의 모습", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "독립 기고 및 아티스트 제휴",
        subtitle: "자작곡 데모 음원 기고(유튜브/사운드클라우드 링크), 인디 밴드 프로필 인터뷰 요청은 하단에 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "음악 제보 및 구독 신청"
        }
      }
    ]
  },

  art_contemporary_review: {
    templateId: "art_contemporary_review",
    name: "컨템포러리 아트 & 크리에이티브 리뷰",
    category: "Magazine",
    description: "순수하고 깨끗한 캔버스 오프화이트 배경과 시선을 강탈하는 포인트 액센트 레드로 여백의 미학과 시각 미학을 극대화한 현대 예술 평론 매거진 테마입니다.",
    image: "/templates/art_contemporary_review.png",
    theme: {
      fontFamily: "Inter, Noto Serif KR, sans-serif",
      colors: {
        primary: "#111827",     // 깊은 프레임 잉크 블랙
        secondary: "#6b7280",   // 평론가 차분한 그레이
        accent: "#ef4444",      // 시선을 포착하는 포인트 레드 한 방울
        background: "#f9fafb",  // 미술관 벽면의 오프화이트
        surface: "#ffffff",     // 깨끗한 화이트 캔버스
        text: "#111827"         // 선명한 잉크 블랙
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "개념 미술의 진화: 보이지 않는 캔버스를 10억에 낙찰받은 컬렉터의 미학",
        subtitle: "물리적 실체가 없는 아이디어 자체가 예술이 되는 현대 미술의 극단적인 현장과, 미디어 아트가 자아내는 지적 도발의 경계를 날카롭게 파헤치는 크리에이티브 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 비평 에디토리얼 읽기",
          ctaLink: "#contact",
          features: [
            { text: "베니스 비엔날레 한국관 수석 큐레이터의 출품작 해독 해설 단독 수록" },
            { text: "디지털 블록체인 대체불가토큰(NFT) 아트의 거품 뒤에 남은 진정한 메타 미학" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아트 평론 아카이브",
        subtitle: "시각 예술과 사회적 담론을 관통하여 공간 전체에 깊은 울림을 전하는 특집 기사입니다.",
        content_data: {
          items: [
            {
              title: "미니멀 미학 드로잉과 사색",
              description: "불필요한 디테일을 지우고 오직 본질적인 선과 면의 배치만으로 현대인의 소외와 고독을 표현하는 작가들을 다룹니다.",
              icon: "Palette"
            },
            {
              title: "예술 공간 브랜딩과 대지 미술",
              description: "미술관의 백색 벽면을 탈출하여 거대한 사막과 갯벌에 자연 자재로 흔적을 남기는 대지 미술 프로젝트를 정교하게 계측합니다.",
              icon: "Compass"
            },
            {
              title: "체화된 아트: 미디어 설치 미술",
              description: "관객의 심장 박동에 따라 디지털 빔의 파형이 실시간으로 변화하여 완전한 몰입과 소통을 제공하는 미디어 아트를 취재했습니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아트는 사물을 복제하는 스킬이 아닌, 사물 본연의 숨겨진 아우라를 구출하는 지적 철학입니다",
        subtitle: "모든 시각 예술은 감상자가 완성시키는 열린 텍스트 구조를 지니고 있습니다.",
        content_data: {
          description: "안녕하십니까. 현대 예술 평론 매거진의 발행인입니다. 우리는 장식적이고 화려한 상업 갤러리의 홍보 기사를 과감하게 배제하고, 작가의 캔버스 뒤에 숨겨진 철학적 고뇌와 대담한 사회적 도발, 선 하나에 깃든 비례감의 조화를 분석하는 지적 평론을 일관되게 발행해 오고 있습니다. 당신의 심미적 통찰력을 깊이 있게 업그레이드하십시오.",
          stats: [
            { label: "제휴 글로벌 큐레이터", value: "24명" },
            { label: "평론 수록 작가 아카이브", value: "480명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "크리에이티브 아트 초청 갤러리",
        subtitle: "독자들에게 지적 전율을 선사한 컨템포러리 아티스트들의 시그니처 대표작 리스트입니다.",
        content_data: {
          items: [
            { title: "침묵하는 프레임: 빛의 기하학", description: "콘크리트 갤러리 천장 구멍으로 투과되는 자연 채광과 벽면의 각도가 자아내는 흑백 대비 사진", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "선과 여백: 추상 단색화 시리즈", description: "전통 한지 위에 먹의 번짐과 말림을 20회 이상 반복하여 인간의 기원과 소멸의 궤적을 표현한 회화", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" },
            { title: "구조의 변주: 미니멀 세라믹 오브제", description: "유약을 바르지 않고 매트한 점토 본연의 거친 질감과 직선 구멍을 뚫어 완성한 모던 조형 도예 오브제", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "작가 포트폴리오 기고 및 구독 신청",
        subtitle: "전시회 비평 요청, 신진 작가 졸업 작품 기고(PDF 첨부), 미술관 미디어 제휴는 하단에 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "작가 포트폴리오 제출"
        }
      }
    ]
  },

  business_fortune_insights: {
    templateId: "business_fortune_insights",
    name: "비즈니스 마켓 & 글로벌 캐피탈 인사이트",
    category: "Magazine",
    description: "신뢰감 넘치는 옥스퍼드 딥 네이비와 성공을 견인하는 찬란한 선셋 메탈 골드 포인트 조합으로 B2B 비즈니스 리포트의 신뢰도를 극대화한 경제 전문 매거진 테마입니다.",
    image: "/templates/business_fortune_insights.png",
    theme: {
      fontFamily: "Inter, Noto Sans KR, sans-serif",
      colors: {
        primary: "#1e3b8a",     // 지적인 신뢰의 옥스퍼드 블루
        secondary: "#f1f5f9",   // 정갈한 라이트 슬레이트
        accent: "#d97706",      // 영광스러운 메탈 앰버 골드
        background: "#fafbfd",  // 맑고 깨끗한 백그라운드
        surface: "#ffffff",     // 정갈한 화이트보드
        text: "#0f172a"         // 가독성 높은 네이비 슬레이트 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "연준의 금리 인하 카드가 글로벌 메이저 벤처 자본에 미칠 나비효과 해독",
        subtitle: "단순한 시황 속보를 넘어, 글로벌 거시경제 이자율 하향 기조와 빅테크 기업들의 분기별 프리미엄 현금 흐름 아키텍처를 입체적으로 역추적 분석하는 프리미엄 자본 시장 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 주 마켓 다이제스트 다운로드",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 상위 1% 월스트리트 헤지펀드 매니저들의 실시간 투자 포트폴리오 비율 해부" },
            { text: "동아시아 주요 반도체 공급망 지정학적 리스크 분석 및 대체 루트 가동 타임라인 리포트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 비즈니스 오피니언",
        subtitle: "세계적인 석학들이 냉철한 데이터 수치로 산업의 내일을 예측한 핵심 기고문입니다.",
        content_data: {
          items: [
            {
              title: "M&A 리포트: 테크 합병의 명암",
              description: "AI 유니콘 스타트업을 흡수 합병하려는 빅테크 기업들의 반독점법 회피 전략과 인수합병 가치 평가 기법을 해독합니다.",
              icon: "Award"
            },
            {
              title: "탈세계화와 글로벌 공급망 리셋",
              description: "니어쇼어링과 프렌드쇼어링 공장의 멕시코 베트남 이전 비용이 원가 상승에 미치는 미세한 인플레이션 수치를 계측합니다.",
              icon: "Compass"
            },
            {
              title: "자산 토런화(RWA) 금융 혁명",
              description: "실제 강남 부동산과 국채 자산을 디지털 토큰으로 쪼개어 유동성을 극대화하는 증권형 토큰 시장의 미래를 취재했습니다.",
              icon: "TrendingUp"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자본은 거짓말을 하지 않으며, 오직 데이터의 냉철한 뼈대만을 믿습니다",
        subtitle: "장밋빛 희망의 투자 광고를 걷어내고, 재무제표 뒤에 숨겨진 진실된 현금 흐름을 읽어냅니다.",
        content_data: {
          description: "안녕하십니까. 글로벌 캐피탈 인사이트의 발행 주간입니다. 주식 시장의 뜬소문과 찌라시 정보로 소중한 투자 판단을 그르치고 계시진 않나요? 우리는 금융공학 석박사 출신의 수석 애널리스트들과 회계 평론가들이 매 분기마다 대기업들의 부채 비율과 잉여현금흐름(FCF)을 칼같이 분석하여, 거시경제의 폭풍 속에서도 자산을 굳건히 수호하는 나침반을 제공합니다.",
          stats: [
            { label: "제휴 기업 CEO 회원 수", value: "3,500명+" },
            { label: "연간 발행 정밀 분석 리포트", value: "48회" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "비즈니스 기획 분석 아카이브",
        subtitle: "기업 의사 결정자들에게 최고의 찬사를 입증받은 경제학 마스터피스 특집 리포트입니다.",
        content_data: {
          items: [
            { title: "실리콘밸리 뱅크 파산 이면의 리스크 분석", description: "단기 채권 자산의 금리 민감도 매치 실패가 야기한 유동성 뱅크런 사태의 금융공학적 교훈 평론", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
            { title: "가상 자산 규제와 스위스 금융 밸리 수혈", description: "미국 SEC 규제 칼날을 피하려는 글로벌 Web 3 자본들이 스위스 주크 주로 집중되는 지정학적 자본 궤적 취재", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80" },
            { title: "지속 가능한 ESG 경영의 실물 성과 보고서", description: "단순한 친환경 홍보를 넘어 실제 탄소배출권 거래를 통해 영업 이익률을 8% 개선해낸 선도 기업 기획 에디션", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프리미엄 정기 구독 및 기업 제휴 신청",
        subtitle: "PDF 정밀 애널리스트 리포트 메일 정기 구독 의뢰, 기업 C-Level 조찬 세미나 초청권 문의는 아래 양식을 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "B2B 분석 제안 신청"
        }
      }
    ]
  },

  health_wellness_living: {
    templateId: "health_wellness_living",
    name: "홀리스틱 웰빙 & 마인드풀 리빙 매거진",
    category: "Magazine",
    description: "눈이 편안하고 맑은 딥 세이지 그린과 대지의 포근한 모래 베이지 톤 배합으로 바쁜 도심인들에게 차분한 해독과 쉼터를 제공하는 웰빙 전문 매거진 테마입니다.",
    image: "/templates/health_wellness_living.png",
    theme: {
      fontFamily: "Noto Serif KR, Playfair Display, serif",
      colors: {
        primary: "#2d6a4f",     // 맑고 차분한 딥 세이지 그린
        secondary: "#d8f3dc",   // 맑고 시원한 연그린
        accent: "#b7094c",      // 활력을 불태우는 대추 로즈 핑크
        background: "#fcfaf6",  // 부드럽고 따스한 샌드 크림
        surface: "#ffffff",     // 깨끗한 린넨 화이트
        text: "#1b4332"         // 눈이 편안한 포레스트 블랙 차콜
      },
      borderRadius: "rounded-full",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "가공식품의 화학 소음을 끄고, 하루에 1번 내 몸속 장내 미생물과 소통하라",
        subtitle: "무작정 굶는 극단적 칼로리 제한 다이어트는 몸속 세포를 파괴합니다. 뇌와 장의 유기적 신경망(Gut-Brain Axis)을 정상화하여 만성 브레인 포그를 단숨에 씻겨내는 천연 오가닉 식단과 호흡 치유 매뉴얼을 다룹니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 달 웰니스 가이드 읽기",
          ctaLink: "#contact",
          features: [
            { text: "국가공인 임상 영양학 연구원들이 분석한 혈당 스파이크 방지 아침 채소 섭취 꿀팁 수록" },
            { text: "싱잉볼 테라피와 아로마 에센셜 오일의 향취 주파수가 자율신경계 과긴장을 해소하는 작동 과학" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 웰빙 팁",
        subtitle: "바쁜 현대인들이 즉각 실생활에 도입하여 만성 피로를 개선할 수 있는 리셋 솔루션입니다.",
        content_data: {
          items: [
            {
              title: "ABC 딥 클렌즈 식단 설계",
              description: "유기농 사과, 비트, 당근의 7기압 저온 착즙액이 체내 혈액순환과 세포 독소 배출을 극대화하는 과정을 다룹니다.",
              icon: "Droplet"
            },
            {
              title: "수면 위생과 멜라토닌 분비 공식",
              description: "최고의 델타파 숙면을 위해 밤 10시 이후 침실 조도를 30룩스 이하로 조율하는 에어 디렉팅 교정 가이드입니다.",
              icon: "Compass"
            },
            {
              title: "마음챙김 요가와 기립근 복원",
              description: "척추 마디마디를 호흡에 맞춰 부드럽게 이완시키는 하타 요가의 해부학적 관절 이완 원리를 분석합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "진정한 건강은 무리하게 근육을 키우는 것보다, 내 호흡의 평온함을 수호하는 데서 찾아옵니다",
        subtitle: "우리는 대자연이 선물한 깨끗한 생명력만이 가장 안전한 면역 치료제라고 확신합니다.",
        content_data: {
          description: "안녕하십니까. 홀리스틱 웰빙 매거진의 편집 주간입니다. 인위적인 다이어트 보조제와 자극적인 피트니스 광고의 거품 속에서, 우리는 자연의 식물이 지닌 고유의 해독 성분과 마음챙김 명상, 요가를 통한 '스스로 치유되는 힘'의 회복을 고집합니다. 하루에 딱 10분, 나를 괴롭히던 도심의 빌딩 숲 소음을 끄고 묵향 가득한 사색의 웰니스 아틀리에를 호흡해 보십시오.",
          stats: [
            { label: "웰빙 전문 자문단 규모", value: "24명" },
            { label: "정기 구독 오가닉 독자 수", value: "12,000명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "내추럴 웰니스 아카이브 포토",
        subtitle: "바라보는 것만으로도 뇌파가 진정되고 힐링 영감을 충전해주는 웰빙 에디션들입니다.",
        content_data: {
          items: [
            { title: "포레스트 통창 요가 명상 룸 전경", description: "대형 통창 너머의 푸른 사계절 숲을 마주하고 따뜻한 원목 마루 위에서 수련을 이어가는 힐링 홀", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" },
            { title: "오가닉 아보카도 퀴노아 샐러드 보울", description: "무농약 수경재배 케일과 고소한 아보카도, 병아리콩을 올려 식이섬유와 단백질을 극대화한 미식 플레이팅", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80" },
            { title: "천연 아로마 네뷸라이저 디퓨저 패키지", description: "프랑스 프로방스 야생 라벤더 원유를 미세 수분 분사하여 머리를 맑게 정화해주는 숙면 테라피 용품", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "정기 구독 및 웰빙 가이드북 신청",
        subtitle: "오가닉 디독스 가이드북 PDF 무상 배송 신청, 친환경 웰빙 상품 광고 제휴는 아래로 편지를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "웰빙 가이드 신청하기"
        }
      }
    ]
  },

  science_cosmos_quantum: {
    templateId: "science_cosmos_quantum",
    name: "퀀텀 사이언스 & 코스모스 디스커버리",
    category: "Magazine",
    description: "신비롭고 차분한 은하수 딥 네이비 퍼플과 우주적 별빛 네온 라임 그린 배합으로 양자역학 및 최신 천문학 발견의 지적 희열을 선사하는 과학 전문 매거진 테마입니다.",
    image: "/templates/science_cosmos_quantum.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#3b82f6",     // 맑고 차가운 코스모스 블루
        secondary: "#c084fc",   // 몽환적인 성운 퍼플
        accent: "#a3e635",      // 지적인 라이트 라임 그린
        background: "#030712",  // 밤하늘 심연의 블랙 인디고
        surface: "#111827",     // 세련된 관측돔 차콜 슬레이트
        text: "#f9fafb"         // 은하수 별빛 퓨어 화이트
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "제임스 웹 망원경이 포착한 우주 최초의 은하와 양자 얽힘의 신비",
        subtitle: "빅뱅 이후 1억 년이 흐른 시점의 우주 초기 생성 은하들의 산소 분광 데이터를 정밀 분석하고, 시간과 거리를 초월해 실시간 동기화되는 미시 세계 양자 얽힘(Entanglement)의 놀라운 기원을 평론합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 달 과학 리포트 읽기",
          ctaLink: "#contact",
          features: [
            { text: "국내외 권위 있는 천체 물리학 석박사 연구원들의 아인슈타인 상대성이론 오류 추적 특필" },
            { text: "인류의 화성 테라포밍 프로젝트: 실물 거주 기지 건설용 신소재 탄소나노튜브 튜닝 기술" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 과학 에디토리얼",
        subtitle: "인류의 과학 문명을 한 차원 높이는 위대한 발견의 평론 목록입니다.",
        content_data: {
          items: [
            {
              title: "양자 컴퓨터와 나노 입자 물리",
              description: "초미세 규소 기판 위에 나노 큐비트를 안정적으로 구현하여 슈퍼컴퓨터보다 1억 배 빠른 연산을 수행하는 공학입니다.",
              icon: "Cpu"
            },
            {
              title: "외계 행성의 대기 생명체 신호",
              description: "지구로부터 40광년 떨어진 트라피스트-1 행성계의 분광 스펙트럼에서 메탄과 물 분자를 검출해낸 과정을 보도합니다.",
              icon: "Compass"
            },
            {
              title: "유전자 카위 CRISPR의 3세대 진화",
              description: "희귀 난치병을 원천 치료하기 위해 표적 자궁암 세포의 특정 DNA 염기서열만을 0.1nm 오차 없이 도려내는 기술입니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "과학은 모르는 것을 아는 척하지 않고, 철저한 정량적 가설 검증 위에 우주의 비밀을 밝히는 등불입니다",
        subtitle: "미시 세계의 양자 중첩을 이해하는 순간, 세상에 고착된 모든 상식의 벽이 완전히 무너집니다.",
        content_data: {
          description: "안녕하십니까. 코스모스 디스커버리 매거진의 과학 편집 주간입니다. 우리는 미신적 비과학 뉴스나 유행성 가십을 단호하게 차단하고, 스위스 CERN 입자 가속기의 미공개 논문과 NASA의 화성 탐사선 큐리오시티 로버 데이터를 직관적으로 풀이해내는 고품격 학술 저널을 발행합니다. 인류의 지적 경계를 우주의 심연까지 뻗어 나가게 도와드리겠습니다.",
          stats: [
            { label: "협력 국책 연구원 규모", value: "35명" },
            { label: "정기 구독 과학 동문 수", value: "14,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "장엄한 우주 성운 & 나노 광학 사진",
        subtitle: "바라보기만 해도 기하학적 경외감을 선사하는 초정밀 천체 및 나노 광학 현미경 스냅 리포트입니다.",
        content_data: {
          items: [
            { title: "허블 망원경이 촬영한 창조의 기둥 성운", description: "성간 가스와 먼지 기둥 속에서 아기 별들이 뿜어내는 가스 불꽃의 장엄하고 화려한 성운 전경 화보", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" },
            { title: "나노 탄소 그래핀 격자 구조 현미경", description: "0.1나노미터 해상도 초고밀도 전자 현미경으로 탄소 원자 6각형 벌집 격자의 대칭성을 포착한 나노 아트", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "화성 적색 사구와 게일 분화구 전경", description: "나사 탐사 로버가 현지에서 360도 촬영하여 전송해온 붉은 산화철 모래 언덕과 융기된 화산암 암맥", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "정기 구독 및 연구 기고 제안",
        subtitle: "매거진 인쇄판 연간 구독 의뢰, 이달의 우수 과학 학술 기고 제안, 세미나 제휴는 하단에 입력해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "학술 기고 및 구독 신청"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 3: Gaming, Movie, Interior, Literary, Eco
  // ==========================================
  gaming_esports_nexus: {
    templateId: "gaming_esports_nexus",
    name: "넥서스 인터랙티브 게이밍 매거진",
    category: "Magazine",
    description: "사이버 펑크 다크 블랙과 눈부신 네온 라이트 라임 옐로우, 그리고 일렉트릭 퍼플 결합으로 비디오 게임 개발과 e스포츠 문화를 강렬하게 전하는 게임 전문 테마입니다.",
    image: "/templates/gaming_esports_nexus.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#eab308",     // 강렬한 네온 라이징 옐로우
        secondary: "#a855f7",   // 일렉트릭 네온 바이올렛
        accent: "#f43f5e",      // 심장 박동 포스 핑크
        background: "#09090b",  // 러프 매트 차콜 블랙
        surface: "#18181b",     // 컨테이너 러프 텍스처
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "언리얼 엔진 5 기반의 하이퍼 리얼리즘 오픈월드가 불러온 게임플레이 혁명",
        subtitle: "모든 픽셀의 광선 추적(Ray-Tracing)과 인체 근육 수축을 입체적으로 모니터링하여 가상 캐릭터에 투과시키는 차세대 트리플A 타이틀 게임들의 개발 비화와 프로 e스포츠 리그 메타를 심층 보도합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 달 추천 신작 분석 읽기",
          ctaLink: "#contact",
          features: [
            { text: "국내 대형 게임사 수석 테크니컬 디렉터의 차세대 물리 렌더링 노하우 단독 인터뷰" },
            { text: "e스포츠 글로벌 챔피언십 결승전 승률 분석 및 주요 프로팀 전술 매트릭스 리포트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "넥서스 기획 리뷰",
        subtitle: "게이머들의 침샘과 지적 욕구를 완벽 자극하는 고품격 비평 리스트입니다.",
        content_data: {
          items: [
            {
              title: "오픈월드 맵 디자인과 몰입의 심리학",
              description: "유저가 지루함 없이 스스로 모험을 개척해나가게 유도하는 랜드마크 배치 및 레벨 디자인 법칙을 파헤칩니다.",
              icon: "Compass"
            },
            {
              title: "e스포츠의 미래: 모바일과 VR의 도약",
              description: "전통 PC 키보드 마우스 중심 리그에서 가상 가상 현실 헤드셋을 끼고 반응 속도를 시험하는 차세대 e스포츠입니다.",
              icon: "Zap"
            },
            {
              title: "인디 게임의 독창성: 소형 스튜디오 생존",
              description: "화려한 그래픽을 걷어내고, 기발한 게임 메커니즘과 감동적인 도트 그래픽 스토리텔링으로 승부해 대박을 터트린 신작들을 소개합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "게임은 단순한 오락적 시간을 넘어, 인류가 창조해 낸 가장 입체적인 종합 상호작용 예술입니다",
        subtitle: "패드를 쥐고 캐릭터와 눈빛을 나누며 플레이하는 모든 순간은 또 다른 자아의 모험입니다.",
        content_data: {
          description: "안녕하십니까. 넥서스 게이밍 저널의 수석 에디터입니다. 우리는 자극적인 클릭 유도용 낚시 기사나 스폰서 게임 띄워주기 리뷰를 단호히 배제하고, 게임 속 개발자의 메커니즘과 사운드트랙 공명, 물리 엔진 최적화 버그 분석을 날카롭게 해독하는 정직한 IT 저널리즘을 지향합니다. 당신의 지적 게이밍 라이프를 한 차원 업그레이드하십시오.",
          stats: [
            { label: "평론 등록 게임 수", value: "850가지" },
            { label: "액티브 게이머 독자 클루", value: "24,000명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "트리플A 하이퍼 리얼 캡처 화보",
        subtitle: "보기만 해도 그래픽 카드 한계를 시험하는 장엄하고 아름다운 가상 세계의 고해상도 스냅 리포트입니다.",
        content_data: {
          items: [
            { title: "사이버펑크 네온 시티 광선 추적 스냅", description: "빗방울에 반사되는 빌딩 전광판의 화려한 네온 빛과 오토바이 금속 텍스처를 구현해 낸 렌더링 찰나", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80" },
            { title: "알프스 설산 배경 레이싱 모션 캡처", description: "눈부신 만년설 벼랑 끝을 시속 300km로 돌파하며 타이어 뒤로 분사되는 눈가루 물리를 입체 캡처한 포토", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "도트 예술: 2D 사이버 던전 아트", description: "0.1mm의 오차 없는 정밀 픽셀 수작업으로 빚어낸 따뜻하고 기하학적인 SF 언더그라운드 맵 디자인", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "인디 게임 기고 및 광고 제휴 의뢰",
        subtitle: "스튜디오 자작 신작 데모 키 배포, e스포츠 스폰서십 문의, 게임 론칭 보도자료 요청은 아래 양식을 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "게임 기고 제안하기"
        }
      }
    ]
  },

  movie_cinema_chronicle: {
    templateId: "movie_cinema_chronicle",
    name: "인디 시네마 & 시네필 필름 크로니클",
    category: "Magazine",
    description: "고풍스럽고 차분한 영화관 시네마 딥 와인 버건디와 아날로그 필름 오프화이트 톤이 결합하여 영화의 역사와 미학적 가치를 깊이 있게 다루는 영화 평론 매거진 테마입니다.",
    image: "/templates/movie_cinema_chronicle.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4c0519",     // 고풍스러운 영화관 버건디
        secondary: "#fdf8f5",   // 영사막 건반 크림 오프화이트
        accent: "#b8860b",      // 영화관 브론즈 골드
        background: "#0c0a09",  // 묵직한 영사 암막 차콜 블랙
        surface: "#1c1917",     // 낡은 영사기 매트 우드
        text: "#f5f5f4"         // 대사 자막 시인성 화이트
      },
      borderRadius: "rounded-sm",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "누벨바그의 유산: 고다르의 점프 컷이 현대 영화 문법을 리디자인한 궤적",
        subtitle: "의도적인 숏 브레이킹과 사운드 싱크 파괴를 통해 관객의 몰입을 방해하며 역설적으로 영화의 실체와 지적 각성을 일깨우는 누벨바그 거장들의 연출 비밀을 심도 있게 파헤칩니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 주 필름 에디토리얼 읽기",
          ctaLink: "#contact",
          features: [
            { text: "깐느 영화제 심사위원 특별상 수상 감독의 단독 대담 비평 전문 수록" },
            { text: "아날로그 35미리 필름 카메라의 광학적 노이즈가 자아내는 특유의 미학적 아우라 복원 리포트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "크로니클 비평 아카이브",
        subtitle: "상업적 흥행 성적표를 걷어내고, 스크린 너머의 연출적 영혼을 들여다보는 평론입니다.",
        content_data: {
          items: [
            {
              title: "미장센과 조명: 그림자의 비중",
              description: "등장인물의 내면적 파열과 위선 상태를 얼굴에 드리워진 콘트라스트 강한 키라이트 명암 조도로 계측합니다.",
              icon: "Sparkles"
            },
            {
              title: "롱테이크와 실시간 흐름의 미학",
              description: "컷을 자르지 않고 10분간 카메라를 등 뒤에서 우직하게 이동시키며 인간의 지독한 고독감을 렌즈에 담아내는 롱테이크 미학을 평론합니다.",
              icon: "Compass"
            },
            {
              title: "대안 시네마: 신진 감독의 외침",
              description: "제작비 단 1억원으로 완성하여 메이저 배급망에 도전장을 내민 독립 단편 영화들의 뜨거운 현장을 보도합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "영화는 단지 팝콘을 먹으며 2시간을 소비하는 오락이 아닌, 타인의 영혼과 조우하는 거룩한 영사막입니다",
        subtitle: "모든 컷의 전환 타이밍에는 연출자가 의도한 치밀한 무의식의 몽타주 기법이 숨어 있습니다.",
        content_data: {
          description: "안녕하십니까. 필름 크로니클의 수석 영화 평론가입니다. 우리는 멀티플렉스 극장의 독점 마케팅 헐리우드 블록버스터 뉴스를 단호히 배제하고, 은막의 흑백 음영, 사운드 데시벨의 높낮이, 카메라 렌즈 밀리수 초점 거리에 따른 관객의 심리적 왜곡 현상을 정량 계측하는 학술 평론을 추구합니다. 당신의 시네필 안목을 깊이 있게 넓혀 드리겠습니다.",
          stats: [
            { label: "평론 수록 독립 영화 수", value: "480편" },
            { label: "정기 구독 시네필 클럽 수", value: "6,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "영화관 현장 & 필름 모티프",
        subtitle: "자체 소장하고 있는 빈티지 35미리 영사기 및 몽환적인 영화관 프레임 리포트입니다.",
        content_data: {
          items: [
            { title: "빈티지 시네마 그랜드 리허설 룸", description: "아날로그 영사기의 영사 렌즈 빛줄기가 먼지 사이를 뚫고 은막에 닿는 낭만적이고 고풍스러운 무대", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80" },
            { title: "35미리 셀룰로이드 필름 보틀", description: "기계 마찰 열량에 그을린 오리지널 영화 필름 보틀과 아날로그 편집기의 톱니 휠 궤적 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "독립 단편 영화 스태프 메이킹 현장", description: "영하의 엄동설한 속에서 붐 마이크를 쥐고 배우의 거친 대사 입김을 따뜻하게 수록하는 스태프들", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "독립 영화 기고 및 평론 의뢰",
        subtitle: "단편 영화 링크(비메오/유튜브 비공개 비밀번호 포함), 신진 비평가 신춘문예 기고 에세이는 아래 양식을 제출하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "영화 평론 기고하기"
        }
      }
    ]
  },

  interior_home_decor: {
    templateId: "interior_home_decor",
    name: "미니멀 홈 & 모던 인테리어 스타일링",
    category: "Magazine",
    description: "따뜻하고 단정한 리넨 샌드 베이지와 부드러운 올리브 세이지 그린의 유기적인 결합으로 아늑한 주거 공간 가치를 전하는 인테리어 전문 저널 테마입니다.",
    image: "/templates/interior_home_decor.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#854d0e",     // 내추럴 오크 마루 웜 브라운
        secondary: "#fef08a",   // 화사한 아침 햇살 레몬 베이지
        accent: "#166534",      // 싱그러운 실내 플랜테리어 그린
        background: "#faf6f0",  // 포근한 패브릭 라이트 크림 베이지
        surface: "#ffffff",     // 깨끗한 대리석 주방 싱크 화이트
        text: "#451a03"         // 따뜻한 에스프레소 브라운 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "물건을 비워내고, 공간 본연의 호흡과 여백을 빚어내다",
        subtitle: "인위적인 가구 배치 스킬을 넘어, 내추럴 리넨 소파와 내마모성 높은 오크 원목의 유기적인 질감 조화를 바탕으로 복잡한 마음을 위로하고 안락함을 극대화하는 미니멀리즘 홈 스타일링 바이블입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금월의 인테리어 트렌드 보기",
          ctaLink: "#contact",
          features: [
            { text: "전문 실내 스타일리스트들의 가구 비례감 매칭 및 실내 조도 간접등 설치 기법 수록" },
            { text: "좁은 거실을 2배로 넓어 보이게 조율하는 히든 수납장 레이아웃 도면 무상 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 공간 제안",
        subtitle: "단순 가구 교체가 아닌, 거주자의 정서와 완벽히 융합되는 인테리어 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "오가닉 홈 오피스 스타일링",
              description: "재택근무자를 위해 어깨 피로를 덜어주는 인체공학 원목 데스크 배치와 간접 조명 각도를 다룹니다.",
              icon: "Layers"
            },
            {
              title: "보타니컬 가든: 거실 플랜테리어",
              description: "실내 이산화탄소를 강력 정화하고 올리브 화분을 거실 코너에 두어 감성 싱그러움을 채우는 팁입니다.",
              icon: "Compass"
            },
            {
              title: "올드 원목 빈티지 가구 튜닝",
              description: "오래되어 닳은 월넛 수납장 표면을 천연 천연 오일 코팅하여 중후한 아우라를 복원해내는 과정입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "진정한 명품 집은 비싼 소품으로 도배한 집이 아닌, 머무는 이의 정서적 호흡이 편안한 집입니다",
        subtitle: "모든 실내 도어는 문틀을 없앤 히든 구조로 마감될 때 시각적 소음이 극적으로 차단됩니다.",
        content_data: {
          description: "안녕하십니까. 홈 스타일링 매거진의 대표 크리에이티브 디렉터입니다. 우리는 백화점의 값비싼 해외 명품 가구 브랜드 광고를 과감하게 배제하고, 자연에서 얻은 리넨 원사와 무독성 황토 페인트, 그리고 시간의 세월을 고스란히 버텨낸 빈티지 고가구의 조화로운 레이아웃을 코칭합니다. 마음의 안식을 가져다줄 당신만의 따뜻한 보금자리를 디자인해 보세요.",
          stats: [
            { label: "보유 공간 디렉터진", value: "14명 협진" },
            { label: "스타일링 적용 성공 홈", value: "1,200세대" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "명품 공간 스타일링 아카이브",
        subtitle: "거주자의 라이프스타일에 맞춰 완벽하게 복원 및 데코레이션된 거실과 주방 전경입니다.",
        content_data: {
          items: [
            { title: "웜 베이지 미니멀 거실 평면", description: "패브릭 모듈 소파와 원형 월넛 티테이블을 매칭하고 벽면에 실내 올리브 화분을 토핑한 아늑한 거실", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" },
            { title: "아일랜드 세라믹 화이트 주방", description: "몰딩을 없앤 빌트인 냉장고장과 이탈리아 대리석 아일랜드 상판을 적용하여 0.1mm의 오차도 없는 평면 주방", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "빛을 담은 중정 침실 데코레이션", description: "천장에 조명 매립을 배제하고 간접 스폿 전등만으로 은은한 조도를 확보하여 수면 유도력을 높인 침실 침구", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공간 스타일링 상담 및 정기 구독 신청",
        subtitle: "주거 평수, 원하시는 데코레이션 콘셉트(미니멀/앤틱/플랜테리어 등) 및 대략적인 예산 범위를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "스타일링 상담 신청"
        }
      }
    ]
  },

  literary_humanities_salon: {
    templateId: "literary_humanities_salon",
    name: "지적 사색 문학 & 인문학 살롱 매거진",
    category: "Magazine",
    description: "전통적이고 기품 있는 딥 프러시안 네이비와 고풍스러운 양장 북 브라운 배합으로 지적인 사색과 인문학 독서 평론의 깊이를 더한 문학 매거진 테마입니다.",
    image: "/templates/literary_humanities_salon.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#1e293b",     // 깊은 사색의 다크 옥스퍼드 블루
        secondary: "#f1f5f9",   // 눈이 편안한 미색 종이 그레이
        accent: "#78350f",      // 고풍스러운 클래식 북 브라운
        background: "#faf9f6",  // 한지 물결 연베이지
        surface: "#ffffff",     // 맑고 정갈한 서재 책상 화이트
        text: "#1e293b"         // 가독성 극대화 슬레이트 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "상실의 시대에 묻다: 도스토옙스키의 죄와 벌이 던지는 실존적 양심",
        subtitle: "물질 만능과 가벼운 도파민 뉴스 홍수 속에서 인간 영혼의 본질적인 비극과 실존적 고독의 깊이를 파고들며, 고전 문학 지식을 통해 삶의 단단한 지적 나침반을 세워주는 인문학 평론 살롱 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 문학 평론 읽기",
          ctaLink: "#contact",
          features: [
            { text: "국내외 저명한 인문학과 교수진의 니체 초인 사상 해독 정규 기고문 수록" },
            { text: "아날로그 클래식 북클럽 모임 정보 및 정규 독서 큐레이션 도서 가이드 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "살롱 사색 아카이브",
        subtitle: "지식을 머리에 억지로 욱여넣지 않고, 내면의 깊은 생각의 밭을 일구어내는 특집 평론입니다.",
        content_data: {
          items: [
            {
              title: "실존주의 문학의 계보",
              description: "카뮈의 이방인부터 사르트르의 구토까지 부조리한 세계에 맞서 주체적인 자아 정체성을 건립하는 인간상을 뜯어봅니다.",
              icon: "BookOpen"
            },
            {
              title: "동양 철학: 장자의 소요유",
              description: "타인의 시선과 인위적인 제도적 규범을 단호하게 털어내고 바람처럼 자유롭게 삶을 소요하는 비법을 분석합니다.",
              icon: "Compass"
            },
            {
              title: "현대 시인들이 노래하는 상실",
              description: "기형도와 윤동주의 시 구절 속에 담긴 쓸쓸한 고독의 뼈대를 해부하여 영혼을 다정하게 위로합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "배움은 타인의 문장을 외우는 스펙이 아닌, 내 영혼의 크기를 지적으로 증명하는 거룩한 과정입니다",
        subtitle: "한 줄의 시를 깊이 읽는 시간은 하루 중 뇌가 완전한 자유와 침묵을 누리는 쉼터입니다.",
        content_data: {
          description: "안녕하십니까. 인문학 살롱 매거진의 대표 편집장입니다. 우리는 자극적이고 단편적인 인터넷 정보의 소음을 걷어내고, 영속성을 지닌 문학 고전과 철학의 깊은 골짜기를 독자와 함께 천천히 걸어가고자 합니다. 가벼운 스마트폰의 스크롤을 멈추고, 잉크 냄새 가득한 양장본 책장을 한 장 한 장 손끝으로 만지며 마음의 평온을 셋업하십시오.",
          stats: [
            { label: "등록 정규 집필진", value: "32명 석박사" },
            { label: "전국 정기 독서 클럽 수", value: "180개 지부" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "인문학 살롱 서재 & 세미나 현장",
        subtitle: "따뜻한 나무 가구와 은은한 전등 조명 속에 모여 지적인 사색을 깊이 나누는 아날로그 공간입니다.",
        content_data: {
          items: [
            { title: "고풍스러운 아날로그 대도서실 서재", description: "천장 끝까지 책꽂이가 가득 차 있고 앤티크 흔들의자가 세팅된 원내 단독 독서 명상 홀 전경", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80" },
            { title: "인문학 북 세미나 토론 살롱", description: "따뜻한 차를 마시며 현대 철학의 흐름을 자유롭게 발표하고 의견을 교환하는 지적 살롱 현장", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80" },
            { title: "윤동주 시인 헌정 필사 아카이브", description: "수강생들이 정성을 다해 화선지 위에 수제 만년필로 윤동주의 시를 필사해 전시한 문학 갤러리", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오프라인 북클럽 참여 및 구독 신청",
        subtitle: "참여 희망하시는 지역(서울/경기 등), 최근 가장 인상 깊게 읽으신 책 장르를 적어 살롱 예약을 신청하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "인문학 살롱 참여 신청"
        }
      }
    ]
  },

  eco_green_earth: {
    templateId: "eco_green_earth",
    name: "에코 그린 어스 & 지속 가능한 라이프스타일",
    category: "Magazine",
    description: "싱그러운 비타민이 느껴지는 아보카도 잎 그린과 순수한 밀크 아이보리, 크래프트 종이 베이지 조화로 환경 보존과 제로웨이스트 가치를 전하는 매거진 테마입니다.",
    image: "/templates/eco_green_earth.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#166534",     // 싱그러운 숲속 리프 그린
        secondary: "#f0fdf4",   // 맑고 깨끗한 새싹 연그린
        accent: "#d97706",      // 크래프트 상자 황토 베이지
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 깨끗한 유기농 종이 캔버스
        text: "#14532d"         // 눈이 편안한 포레스트 그린 차콜
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "플라스틱 없는 일상, 지구와 인간이 공존하는 아름다운 제로웨이스트 습관",
        subtitle: "매일 버려지는 1회용품 쓰레기 문제에 대안을 제시하고, 친환경 비건 식단과 대나무 칫솔, 탄소 중립을 실현하는 선도적인 에코 라이프스타일 평론 저널 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
          ctaText: "제로웨이스트 가이드북 다운로드",
          ctaLink: "#contact",
          features: [
            { text: "플라스틱을 전혀 쓰지 않고 1주일 살기 챌린지 성공 크루들의 리얼 극복 수기" },
            { text: "버려진 소방 호스와 낙하산 원단을 해체하여 패셔너블한 가방으로 부활시킨 업사이클링 브랜드 인터뷰" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에코 에디터스 리포트",
        subtitle: "지구 온도를 낮추고 자연의 생태계를 안전하게 보존하는 행동하는 웰빙 기사입니다.",
        content_data: {
          items: [
            {
              title: "비건 퀴진과 탄소 중립 공식",
              description: "육류 소비를 단 한 끼 줄임으로써 절약되는 숲 면적과 이산화탄소 절감 수치를 과학적으로 해독합니다.",
              icon: "Droplet"
            },
            {
              title: "제로웨이스트 욕실 리폼 꿀팁",
              description: "화학 계면활성제 가득한 샴푸통 대신 고체 샴푸바와 천연 삼베 수세미를 도입하는 친환경 위생 가이드입니다.",
              icon: "Compass"
            },
            {
              title: "친환경 신재생 태양광 미니 발전",
              description: "아파트 아파트 베란다에 미니 태양광 패널을 설치하여 자가 전력을 15% 충당하는 친환경 전기 가이드를 공유합니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "지구는 조상에게 물려받은 영토가 아닌, 우리 자녀들에게 잠시 빌려 쓴 거울입니다",
        subtitle: "단 하나의 일회용 컵을 덜 쓰는 작은 행동이 수십 년 후 거대한 돌고래의 생명을 살립니다.",
        content_data: {
          description: "안녕하십니까. 에코 그린 저널의 편집 주간입니다. 우리는 대기업들의 위선적인 위장 환경주의 '그린워싱' 광고를 날카롭게 비판하며, 화석 연료 소비를 실제로 차단하고 재생 농법을 도입하는 정직한 농부들과 제로웨이스트 메이커스들의 굵은 땀방울을 지지합니다. 지구를 위한 가볍고 깨끗한 한 걸음을 지금 함께 디디십시오.",
          stats: [
            { label: "참여 탄소절감 액티브 크루", value: "5,800명+" },
            { label: "협력 제로웨이스트 매장", value: "35개소" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "친환경 생태 & 업사이클링 갤러리",
        subtitle: "쓰레기 제어를 위해 철저하게 순환 및 디자인된 오가닉 힐링 포트폴리오입니다.",
        content_data: {
          items: [
            { title: "소방 호스 리폼 메신저 백 에디션", description: "폐기 소방 호스의 고열 차단 특수 방수 패브릭을 수거해 한 땀 한 땀 수제 봉제하여 완성한 패션 가방", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" },
            { title: "도심 속 빗물 재활용 미니 옥상정원", description: "옥상에 떨어지는 빗물을 정화 통에 모아 실내 상추와 방울토마토 재배 용수로 재순환하는 친환경 텃밭", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80" },
            { title: "천연 무농약 수수 껍질 주방 세제 세트", description: "화학 화학 보존제 없이 자연 분해되어 흐르는 계곡물 오염률을 0%로 낮춘 오가닉 설거지 비누 바", image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "그린 크루 가입 및 제휴 제안",
        subtitle: "제로웨이스트 챌린지 100일 참가 희망, 친환경 녹색 제품 매장 기고 의뢰는 아래에 성명과 메일을 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "그린 크루 참여하기"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 4: Luxury Lifestyle, Automotive, Parenting, Photography, Future Careers
  // ==========================================
  luxury_lifestyle_yacht: {
    templateId: "luxury_lifestyle_yacht",
    name: "노블레스 하이엔드 럭셔리 라이프스타일",
    category: "Magazine",
    description: "눈부신 에메랄드 리조트 아쿠아 마린과 품격 있는 샴페인 브론즈 골드가 조화를 이루며 극상의 하이엔드 휴양 라이프스타일을 전달하는 럭셔리 매거진 테마입니다.",
    image: "/templates/luxury_lifestyle_yacht.png",
    theme: {
      fontFamily: "Cormorant Garamond, Inter, sans-serif",
      colors: {
        primary: "#0f766e",     // 하이엔드 지중해 틸 에메랄드
        secondary: "#f4ede2",   // 럭셔리 요트 리넨 아이보리
        accent: "#c5a880",      // 품격 높은 브론즈 샴페인 골드
        background: "#faf6f0",  // 로열 펄 오프화이트
        surface: "#ffffff",     // 스파 대리석 화이트
        text: "#332c25"         // 딥 우드 초콜릿 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지중해의 푸른 바람을 타고 미끄러지는 프라이빗 슈퍼요트 크루즈",
        subtitle: "전 세계 극소수 VIP 고객에게만 허락된 모나코 항구의 프라이빗 정박권 획득 요령과, 크루즈 갑판 위에서 펼쳐지는 럭셔리 리조트 레저 및 맞춤형 수제 가구 크래프트맨십의 가치를 극적으로 보여줍니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "노블레스 멤버십 에디션 보기",
          ctaLink: "#contact",
          features: [
            { text: "스위스 하이엔드 부티크 시계 제작소의 100% 수제 투르비용 무브먼트 조립 비하인드 독점 취재" },
            { text: "세계적인 웰니스 디렉터들이 큐레이션한 지중해 해양 심층수 월풀 스파 및 안티에이징 힐링 아카이브" }
          ]
        }
      },
      {
        section_type: "services",
        title: "노블레스 에센셜",
        subtitle: "삶의 품격과 시각적 조화로움을 최대로 끌어올리는 하이엔드 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "슈퍼요트 선상 스파 & 트리트먼트",
              description: "바다 한가운데서 무중력 요라클 베드에 누워 천연 로즈마리 아로마와 수기 림프 이완 터치를 맛보는 극상의 세션입니다.",
              icon: "Sparkles"
            },
            {
              title: "파인 주얼리와 브론즈 아티잔",
              description: "0.01mm의 결점을 통제하기 위해 프랑스 주얼리 명장들이 다이아몬드를 현미경 아래에서 정교하게 조각하는 철학을 다룹니다.",
              icon: "Award"
            },
            {
              title: "글로벌 하이엔드 리조트 리트릿",
              description: "타인과의 접촉이 완벽히 차단된 스위스 알프스 절벽 위 단독 프라이빗 자쿠지가 완비된 리조트 전경을 분석합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "진정한 럭셔리는 화려한 과시가 아닌, 온전하게 나만의 시간을 누리는 평온한 고독입니다",
        subtitle: "모든 최고급 수제 제품의 이면에는 장인들이 평생을 바쳐 빚어낸 시간의 온기가 서려 있습니다.",
        content_data: {
          description: "안녕하십니까. 노블레스 매거진의 대표 크리에이티브 디렉터입니다. 우리는 자극적이고 단편적인 명품 로고 소비 기사를 지양하고, 재료 본연의 무독성 유기농 린넨, 장인의 100% 수제 목조 마감, 0.1도 정밀 온천 스파 치료 원리가 결합한 정직한 웰빙 럭셔리를 고집합니다. 당신의 고귀한 삶에 지적이고 여유로운 영감을 선물해 드리겠습니다.",
          stats: [
            { label: "글로벌 VIP 정회원", value: "2,500명 독점" },
            { label: "장인 협업 히스토리", value: "35개 하우스" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "럭셔리 보이지 & 리조트 아카이브",
        subtitle: "감상하는 것만으로도 오감이 아늑해지는 최고급 친자연 시설 전경 리포트입니다.",
        content_data: {
          items: [
            { title: "지중해 항해 프라이빗 요트 갑판", description: "천연 오크 나무 패널과 요트 전용 리넨 베드가 완비되어 수평선 일출을 감상하는 선상 라운지", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "대리석 온천 제트 폼 히노끼 스파", description: "스파 테라피실 내 편백나무 향취와 온천수의 음이온 진동을 통해 신경 피로를 씻어내는 리조나토 월풀", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "해안 절벽 위 인피니티 가든 스위트", description: "파도가 발밑에서 부서지는 해안 암벽에 빌트인되어 실내 정원과 중정이 유기적으로 조화된 리조트 스페이스", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "노블레스 멤버십 및 광고 제휴 의뢰",
        subtitle: "프리미엄 프라이빗 구독 신청, 럭셔리 요트 및 명품 부티크 하우스 기고 제안은 아래 양식을 통해 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "멤버십 비공개 신청"
        }
      }
    ]
  },

  automotive_speed_gear: {
    templateId: "automotive_speed_gear",
    name: "하이퍼카 스피드 & 클래식 오토모티브",
    category: "Magazine",
    description: "묵직하고 거친 느낌의 다크 스틸 그레이와 속도감을 대변하는 핫 로드 레이싱 오렌지가 질주 본능을 자극하는 자동차 전문 오토모티브 저널 테마입니다.",
    image: "/templates/automotive_speed_gear.png",
    theme: {
      fontFamily: "Space Grotesk, Montserrat, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 아스팔트 레이싱 오렌지
        secondary: "#3f3f46",   // 타이어 차콜 카본 그레이
        accent: "#ef4444",      // 엔진 RPM 아드레날린 레드
        background: "#09090b",  // 매트 서킷 블랙
        surface: "#18181b",     // 탄소 섬유 카본 파이버 텍스처
        text: "#ffffff"         // 계기판 시인성 극대화 화이트
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "제로백 1.9초 돌파, 하이퍼 전기 슈퍼카의 파괴적 토크 메커니즘",
        subtitle: "내연기관의 배기음을 추월하고 네 바퀴의 독립 모터 제어(Torque Vectoring) 기술을 대입해 중력 가속도의 경계를 뒤흔드는 하이퍼카들의 테크놀로지와 클래식 명차 복원 비화를 다룹니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 주 하이퍼카 드라이브 보러가기",
          ctaLink: "#contact",
          features: [
            { text: "이탈리아 페라리 몬차 현지 테스트 서킷 횡풍 주행 안정성 정량 계측 리포트" },
            { text: "70년대 클래식 머슬카 엔진블록 피스톤 압축비 복원을 위한 수제 정비사 아카이브" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 기어 리포트",
        subtitle: "속도와 미학적 보디 라인의 극점을 달성한 차량들의 심층 비평 목록입니다.",
        content_data: {
          items: [
            {
              title: "액티브 에어로다이내믹스 스포일러",
              description: "시속 200km 주행 시 가변 스포일러가 꺾이는 각도가 차량 리어 서스펜션 다운포스를 잡아내는 물리 법칙을 해독합니다.",
              icon: "Zap"
            },
            {
              title: "카본 파이버 모노코크 섀시 구조",
              description: "F1 레이싱카 기술을 이식하여 강철보다 5배 가벼우면서도 충격을 분쇄 차단하는 탄소 섬유 골격을 뜯어봅니다.",
              icon: "Shield"
            },
            {
              title: "전기차 모터 쿨링 오일 분사",
              description: "분당 회전수 20,000RPM 돌파 시 발생하는 극한의 모터 마찰열을 오일 스프레이 압력으로 제어하는 냉각 공학입니다.",
              icon: "Cpu"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자동차는 이동 수단을 넘어, 인간이 철과 속도를 다스려 질주하는 물리적 해방구입니다",
        subtitle: "스티어링 휠을 쥐고 타이어 접지력을 손끝으로 느끼는 모든 찰나는 질주 예술의 앙상블입니다.",
        content_data: {
          description: "안녕하십니까. 오토모티브 스피드 기어 매거진의 수석 테스트 드라이버이자 평론가입니다. 우리는 제조사의 카달로그 홍보성 스펙 나열 기사를 단호히 거부하고, 뉘르부르크링 서킷에서 타이어의 측면 쏠림 각도와 제동 감쇠력을 장비를 장착해 정밀 실측하는 냉철한 엔지니어링 비평 저널을 고수합니다. 기계의 기백을 만나보십시오.",
          stats: [
            { label: "실측 테스트 슈퍼카 대수", value: "140대 돌파" },
            { label: "정기 엔진 튜너 전문가 수", value: "18명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "하이퍼카 레이싱 & 클래식 복원 갤러리",
        subtitle: "트랙을 가르고 공기 흐름을 불태우는 강렬하고 아름다운 차량들의 시각 리포트입니다.",
        content_data: {
          items: [
            { title: "뉘르부르크링 코너링 스키드 마크", description: "연석을 밟고 시속 180km로 탈출하며 스피릿을 불태우는 붉은색 슈퍼카의 타이어 접지 찰나", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80" },
            { title: "클래식 월넛 우드 스티어링 휠 리폼", description: "70년대 빈티지 포르쉐의 가죽 시트 스티칭과 수제 크래프트 월넛 기어 노브 복원 장인실 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수직 터보 엔진 피스톤 밸브 레이아웃", description: "트윈 터보 과급기가 엔진 헤드 내부로 산소를 밀어 넣어 실린더 불꽃 폭발력을 극대화하는 기어 튜닝 단면", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "시승 의뢰 및 오토모티브 기고",
        subtitle: "튜닝 차량 데모카 테스트 신청, 신차 론칭 보도 기사 배포, 브랜드 배너 광고 제휴는 아래 양식으로 문의주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "시승 및 기고 신청"
        }
      }
    ]
  },

  parenting_child_bloom: {
    templateId: "parenting_child_bloom",
    name: "마일드 패런팅 & 자녀 성장 교육 매거진",
    category: "Magazine",
    description: "아이들에게 무자극적인 파스텔 베이비 스카이와 부드러운 살구색 버터 크림 옐로우로 따뜻한 아동 발달 지식과 감성 소통법을 공유하는 육아 전문 매거진 테마입니다.",
    image: "/templates/parenting_child_bloom.png",
    theme: {
      fontFamily: "Fredoka, Inter, sans-serif",
      colors: {
        primary: "#0ea5e9",     // 맑고 친근한 스카이 라이트 블루
        secondary: "#fef08a",   // 안락한 햇살 크림 옐로우
        accent: "#f43f5e",      // 사랑스러운 베리 로즈 핑크
        background: "#f0f9ff",  // 맑고 투명한 하늘 오프화이트
        surface: "#ffffff",     // 둥글고 모서리 없는 새하얀 테이블
        text: "#0369a1"         // 시인성 높은 깊은 스카이 차콜
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "아이의 떼쓰는 떼쟁이 심리, 윽박지름 대신 정서 거울 치료로 다독이세요",
        subtitle: "뇌 발달 심리학과 감각통합 이론을 기반으로, 떼를 쓰는 아이의 무의식적 공포와 불안 감각 상태를 포착하고, 훈육 시 부모가 건네야 할 올바른 3단계 목소리 톤과 단어 공식을 해독해 주는 소아 육아 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 육아 교육 큐레이션",
          ctaLink: "#contact",
          features: [
            { text: "국가공인 소아 정신건강 임상심리 전문가들의 올바른 자아 존중감 빌드업 기고문 독점 수록" },
            { text: "스마트폰 소음 대신 아이와 오감으로 상호작용하는 친환경 무독성 로컬 숲체험 놀이법 가이드 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "자녀 성장 에디토리얼",
        subtitle: "아이의 신체적 건강과 지적, 정서적 발달을 꼼꼼하게 이끌어주는 웰빙 기사 목록입니다.",
        content_data: {
          items: [
            {
              title: "영유아 애착 형성과 대뇌 피질 발달",
              description: "생후 36개월간 부모의 정서적 교감 스킨십이 아동의 사회성 담당 뇌 전두엽 신경망을 활성화하는 과정을 다룹니다.",
              icon: "Smile"
            },
            {
              title: "소아 아토피와 환경 유해요소 차단",
              description: "원내 미세먼지 수치를 낮추고 화학 보존제 가득한 물티슈 대신 천연 대나무 원사를 도입하는 오가닉 케어를 분석합니다.",
              icon: "Shield"
            },
            {
              title: "초등 자기주도 공부 머리 학습법",
              description: "강제로 문제집을 풀게 하지 않고, 일상생활의 수학적 비례 요소를 요리 놀이를 통해 재미있게 깨닫게 만드는 스팀 교육법입니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "부모의 흔들림 없는 일관적인 사랑이야말로 자녀의 인생 평생의 가장 든든한 방패막이가 됩니다",
        subtitle: "완벽한 부모가 되려 자책하지 마세요. 아이에겐 그저 내 눈을 따뜻하게 맞춰주는 부모가 필요할 뿐입니다.",
        content_data: {
          description: "안녕하십니까. 자녀 성장 매거진의 대표 편집 주간이자 세 자녀의 엄마입니다. 매일 소리를 지르며 훈육하고 뒤돌아 밤마다 우울하게 자책하는 부모님들의 고통을 누구보다 깊이 공감합니다. 육아는 힘든 고행이 아닌, 부모 역시 아이와 함께 자아를 치료하고 성숙해가는 거룩한 동행입니다. 우리는 정량적인 소아 발달 과학 지식으로 당신의 육아 마음을 부드럽게 지탱하겠습니다.",
          stats: [
            { label: "자문 소아 청소년 의학 교수", value: "12명" },
            { label: "정기 구독 패밀리 클럽 회원", value: "14,000명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "어린이 안심 플레이 스케치",
        subtitle: "아이들이 정서적으로 행복하고 안전하게 노는 힐링 가이드를 담은 사진 아카이브입니다.",
        content_data: {
          items: [
            { title: "친환경 원목 블록 놀이 쉼터", description: "독일제 무독성 천연 나무 블록을 쌓으며 공간 감각 지능을 행복하게 발달시키는 어린이 모습 스냅", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
            { title: "엄마와 아기의 요가 이완 힐링", description: "따뜻한 아로마 디퓨징 라운지에서 아기의 다리를 순하게 마사지하며 림프 순환을 돕는 애착 증진 교실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오가닉 식자재 영양 이유식 조리", description: "신선한 국산 단호박과 유기농 현미 가루를 활용해 알레르기 유발 없이 소화가 편안한 수제 영양 죽 에디션", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "부모 상담 솔루션 및 정기 배송 신청",
        subtitle: "자녀의 연령(월령), 현재 겪고 계신 육아 고민(수면 교육, 훈육 법, 영유아 검진 등)을 적어 자문 신청을 넣어주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "육아 전문의 정밀 진단 신청"
        }
      }
    ]
  },

  photography_monochrome: {
    templateId: "photography_monochrome",
    name: "모노크롬 렌즈 & 다큐멘터리 사진 저널",
    category: "Magazine",
    description: "순수한 흑백 콘트라스트의 시각적 명확성을 극대화한 카본 잉크젯 블랙과 깨끗한 은염 화이트 조화의 파인아트 사진 저널 테마입니다.",
    image: "/templates/photography_monochrome.png",
    theme: {
      fontFamily: "Inter, Noto Serif KR, sans-serif",
      colors: {
        primary: "#09090b",     // 깊은 은염 마찰 카본 블랙
        secondary: "#71717a",   // 차분한 아날로그 그레인 그레이
        accent: "#ffffff",      // 인화지 은광 화이트
        background: "#000000",  // 완전한 암실 블랙
        surface: "#18181b",     // 액자 프레임 매트 차콜 블랙
        text: "#e4e4e7"         // 시인성 높은 실버 라이트 그레이
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "색채의 소음을 걷어내고, 그림자와 빛의 앙상블로 본질의 영혼을 현상하다",
        subtitle: "화려한 디지털 보정과 인위적인 색상 채도 조작을 모두 금지하고, 흑백 인화지 위에 번져나가는 입자의 노이즈와 사물 본연의 질감, 인물의 주름살에 서린 삶의 침묵을 포착해 나가는 정통 다큐멘터리 사진 매거진입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이번 달 모노크롬 포토 스토리 보기",
          ctaLink: "#contact",
          features: [
            { text: "세계적인 보도 사진 협회 '매그넘 포토스' 소속 다큐멘터리 사진가들의 단독 기획 평론" },
            { text: "자가 암실 인화: 라이카 흑백 카메라의 은염 필름 현상 화학 레시피 요강 대공개" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 렌즈 에세이",
        subtitle: "빛과 그림자만으로 인간과 사회의 심층을 날카롭게 묘사한 사진 평론입니다.",
        content_data: {
          items: [
            {
              title: "존 시스템(Zone System): 10단계 명암",
              description: "안셀 아담스의 전설적인 노출 분해법을 대입하여 암부의 계조 묘사를 최고조로 살리는 촬영법을 평론합니다.",
              icon: "Camera"
            },
            {
              title: "결정적 순간: 카르티에 브레송의 찰나",
              description: "사물의 움직임과 비례 기하학이 완전한 조화를 이루는 눈 깜짝할 0.01초의 순간을 수동 셔터로 이식하는 원리입니다.",
              icon: "Compass"
            },
            {
              title: "도시의 섀도우: 뒷골목 다큐멘터리",
              description: "도심 빌딩 그림자 아래 소외된 채 땀 흘려 일하는 건설 노동자의 손등을 밀착 촬영하여 보도합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "사진은 세상의 표면을 기계적으로 복제하는 화학 행위가 아닌, 내 자아의 눈빛을 투과시키는 침묵의 거울입니다",
        subtitle: "세상의 수많은 컬러 소음을 지우는 순간, 비로소 사물의 진정한 기하학적 형태가 말을 건넵니다.",
        content_data: {
          description: "안녕하십니까. 모노크롬 렌즈 저널의 수석 사진 평론가이자 암실 마스터입니다. 우리는 자극적이고 단편적인 인스타그램 뷰티 보정 사진에 무뎌진 현대 독자들을 위해, 입자가 거칠게 살아있고 명암의 깊은 고독이 느껴지는 정통 아날로그 은염 흑백 사진의 진정한 아우라를 고집합니다. 빛과 렌즈가 자아내는 아름다운 광학적 명작을 만나보십시오.",
          stats: [
            { label: "평론 수록 소장 사진 수", value: "3,500점" },
            { label: "협력 글로벌 다큐 아티스트", value: "24명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "모노크롬 마스터피스 레코드",
        subtitle: "오직 빛과 그림자의 치밀한 조율만으로 완성되어 강렬한 여운을 선사하는 사진 컬렉션입니다.",
        content_data: {
          items: [
            { title: "바다의 기하학: 거친 침묵 파도 스냅", description: "겨울 동해바다 해안가 바위 장벽과 하얗게 부서지는 포말 대비를 장노출로 포착한 클래식 파인아트 사진", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80" },
            { title: "주름과 응시: 노령 광부의 1인 초상", description: "평생 광산에서 땀 흘린 어르신의 깊은 눈가 주름살과 석탄 입자 하나하나를 은염 계조로 현상한 정교한 다큐 초상", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "어반 리듬: 철도 대칭 흑백 앵글", description: "해 질 무렵 기차 철로의 수평 격자 스틸 레일이 한 점으로 수렴하는 기하학적 원근감 포토 에디션", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "사진 기고 의뢰 및 전시회 제휴",
        subtitle: "개인 흑백 사진 포트폴리오 기고(5장 이내 웹 링크), 원내 암실 렌탈 및 1:1 현상 교육 문의는 아래에 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "사진 포트폴리오 제출"
        }
      }
    ]
  },

  future_careers_ai: {
    templateId: "future_careers_ai",
    name: "피처 캐리어 & 인공지능 트랜스포메이션",
    category: "Magazine",
    description: "사이버 테크 네온 시안 블루와 강렬하고 활기찬 에메랄드 그린 배합으로, 미래 커리어 변화와 AI 트랜스포메이션 해법을 보여주는 미래 전문 저널 테마입니다.",
    image: "/templates/future_careers_ai.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#10b981",     // 사이버 에메랄드 그린
        secondary: "#0ea5e9",   // 지적인 테크 스카이 블루
        accent: "#f43f5e",      // 도전적인 피처 핑크
        background: "#090d16",  // 미래적인 다크 나이트 네이비
        surface: "#111827",     // 세련된 아키텍처 슬레이트 차콜
        text: "#f3f4f6"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "생성형 AI 에이전트와 인간의 지적 협업이 그리는 직무의 미래 지도",
        subtitle: "단순히 인공지능에 일자리를 뺏긴다는 공포를 넘어, AI 프롬프트 엔지니어링과 거대 언어 모델 API를 활용해 내 직무 생산성을 10배로 증폭하고 새로운 커리어 기회를 정복하는 방법을 취재하는 트랜스포메이션 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          ctaText: "미래 직무 트렌드 다운로드",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 IT 리서치 기업 가트너의 10대 미래 테크 트렌드 핵심 해석 리포트 수록" },
            { text: "비전공자 기획자를 위한 노코드(No-Code) 앱 론칭을 통한 1인 비즈니스 구축 가이드 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 테크 커리어 리뷰",
        subtitle: "지식을 빠르게 흡수하고 커리어를 지적으로 업그레이드하기 위한 추천 특집 기사입니다.",
        content_data: {
          items: [
            {
              title: "프롬프트 엔지니어링 마스터 클래스",
              description: "LLM의 환각(Hallucination) 현상을 방지하고, 정확한 비즈니스 코딩 소스를 뽑아내기 위한 맥락적 템플릿 매칭 공식을 해독합니다.",
              icon: "Cpu"
            },
            {
              title: "노코드 앱 제작과 1인 유니콘 창업",
              description: "FlutterFlow와 Supabase 연동을 통해 한 줄의 복잡한 타이핑 코딩 없이 1주일 만에 상업용 앱을 론칭하는 요령입니다.",
              icon: "Layers"
            },
            {
              title: "데이터 사이언티스트와 머신러닝",
              description: "Python 데이터 시각화 라이브러리를 활용해 고객 이탈 경로를 입체적 대시보드로 추출하고 의사결정을 자동화하는 노하우입니다.",
              icon: "TrendingUp"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "미래는 인공지능을 사용하는 인간이, 인공지능을 외면하는 인간을 완벽하게 대체하는 시대입니다",
        subtitle: "지루하고 반복적인 단순 노동은 AI에게 맡기고, 인간은 진정한 창의적 기획과 의사결정에 집중하십시오.",
        content_data: {
          description: "안녕하십니까. 피처 캐리어 저널의 발행 주간입니다. 인공지능의 급속한 발달 소식에 내 밥그릇이 위협받지 않을까 불안하셨나요? 도구의 진화는 역사적으로 언제나 새로운 직업 미학의 탄생을 동반했습니다. 우리는 복잡한 공학 용어를 지우고, 임직원 개개인이 AI를 업무의 강력한 전담 조수(Copilot)로 삼아 몸값을 두 배로 올리는 실무적 디지털 복지 노하우를 제시합니다.",
          stats: [
            { label: "정기 제휴 빅테크 기업", value: "35개사" },
            { label: "구독 커리어 멘토 단원", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강 임직원 실전 AI 응용 리포트",
        subtitle: "당사의 AI 활용 훈련을 마친 후 실제 실무 생산성을 극적으로 올린 임직원들의 우수 사례 리스트입니다.",
        content_data: {
          items: [
            { title: "비전공자 디자이너의 생성형 웹 배너 론칭 작", description: "미드저니 이미지 프롬프트를 조향하여 브랜드 럭셔리 포스터 광고 배너를 1시간 만에 제작 배포한 프로젝트", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" },
            { title: "노코드 개발로 론칭한 반려동물 케어 스마트웹", description: "코딩 한 줄 없이 노코드 툴로 GPS 실시간 돌보미 매칭 및 결제 모듈 연동을 완료해 배포한 우수작", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "인공지능 이력서 자동 진단 매칭 대시보드", description: "OpenAI API를 활용해 이력서의 텍스트 구조를 분석하여 직무 부적합 키워드를 걸러내는 사내 AI 전용 툴", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "기업 출강 및 B2B AI 워크숍 의뢰",
        subtitle: "임직원 총 규모수, 희망하시는 AI 도구 교육(ChatGPT/미드저니 등) 및 예산 범위를 적어 당일 맞춤 제안서를 신청하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "AI B2B 제안서 요청"
        }
      }
    ]
  }
};
