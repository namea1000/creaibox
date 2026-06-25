import { TemplateConfig } from "../registry";

export const ART_DESIGN_TEMPLATES: Record<string, TemplateConfig> = {
  gallery_minimal_art: {
    templateId: "gallery_minimal_art",
    name: "현대 미술 미니멀 갤러리",
    category: "Art & Design",
    description: "순수한 미술관 벽면을 연상시키는 정갈한 오프화이트와 깊이 있는 카본 슬레이트가 조화를 이루는 테마입니다. 여백의 미를 극대화하여 작가의 작품과 시각 예술 본연의 아우라에 온전히 몰입할 수 있도록 설계되었습니다.",
    image: "/templates/gallery_minimal_art.png",
    theme: {
      fontFamily: "Inter, Noto Serif KR, sans-serif",
      colors: {
        primary: "#111827",     // 깊은 카본 슬레이트 블랙
        secondary: "#6b7280",   // 차분한 뮤지엄 그레이
        accent: "#ef4444",      // 시선을 사로잡는 프레임 레드 한 방울
        background: "#f9fafb",  // 순수한 미술관 오프화이트
        surface: "#ffffff",     // 깨끗한 화이트 캔버스 표면
        text: "#111827"         // 명확한 잉크 블랙
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "선과 그림자, 그리고 비워둔 여백의 유기적 앙상블",
        subtitle: "화려한 수식어와 복잡한 장식을 걷어내고, 사물과 공간이 가진 본질의 형태와 빛의 각도를 치밀하게 포착해 나가는 현대 예술의 독립 캔버스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "전시 관람하기",
          ctaLink: "#contact",
          features: [
            { text: "빛의 굴절과 흑백의 대비를 극대화한 미니멀리즘 시각 평론" },
            { text: "장식적 요소를 배제하고 본질적인 비례감으로 승부하는 모던 갤러리" }
          ]
        }
      },
      {
        section_type: "services",
        title: "큐레이션 아카이브",
        subtitle: "정교하게 엄선된 시각적 예술과 미학적 인사이트의 핵심 작업 분야입니다.",
        content_data: {
          items: [
            {
              title: "현대 시각 미술 기획",
              description: "작가의 내면 세계와 사회적 담론을 관통하여 공간 전체에 깊은 울림을 전하는 지적 전시 큐레이션을 제공합니다.",
              icon: "Eye"
            },
            {
              title: "미니멀 미학 드로잉",
              description: "불필요한 디테일을 지우고 오직 본질적인 선과 면의 배치만으로 깊은 고독과 사색을 직조해 냅니다.",
              icon: "Palette"
            },
            {
              title: "예술 공간 브랜딩 디자인",
              description: "미술관의 조도와 동선 아키텍처를 치밀하게 계산하여 감상자가 작품과 완전하게 소통하도록 돕습니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "비움의 철학을 새기는 예술가",
        subtitle: "가장 미니멀한 것이 가장 맥시멀한 예술적 영감과 감동을 전달합니다.",
        content_data: {
          description: "안녕하세요. 여백과 빛을 캔버스 삼아 세상의 복잡한 소음을 정제해 나가는 시각 디렉터입니다. 저는 인위적인 색채적 기교보다 사물이 가진 본질적인 구조와 비례에 집중할 때 비로소 영원히 남을 진정한 아우라가 피어난다고 확신합니다. 본 아틀리에는 불필요한 장식을 배제하고 정제된 활자와 작품만으로 채워나가는 영속적인 지적 갤러리입니다.",
          stats: [
            { label: "개최 전시", value: "25회" },
            { label: "글로벌 파트너", value: "40+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "기획 에센셜 에디션",
        subtitle: "선의 미학과 정갈한 비례감으로 높은 평론가 평점 찬사를 입증한 마스터피스 리스트입니다.",
        content_data: {
          items: [
            { title: "침묵하는 프레임: 빛의 기하학", description: "콘크리트 공간 벽면과 투과되는 자연 채광의 상호작용을 포착한 흑백 사진 프로젝트", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" },
            { title: "선과 여백: 추상 단색화 시리즈", description: "한지 위에 붓먹색 농담 조절만으로 인간의 탄생과 소멸을 함축해 연출한 오리지널 캔버스 아트", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" },
            { title: "구조의 변주: 미니멀 세라믹 오브제", description: "장식을 배제하고 흙 본연의 매트한 질감과 우아한 곡선미를 극대화한 조형 도예 아틀리에 컬렉션", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "지적인 예술 협업의 문을 열며",
        subtitle: "독창적인 기획전 의뢰, 아트 콜라보레이션 제안, 혹은 작품 소장 자문은 하단 양식을 채워 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  architect_studio_art: {
    templateId: "architect_studio_art",
    name: "모던 건축 설계 & 디자인 빌드 랩",
    category: "Art & Design",
    description: "묵직하고 강렬한 매트 구조적 다크 스틸 블랙과 세련된 노출 콘크리트 그레이 대비가 돋보이는 테마입니다. 타협하지 않는 직선의 미학을 바탕으로 프리미엄 공간과 인테리어의 명확한 구획을 완성도 높게 보여줍니다.",
    image: "/templates/architect_studio_art.png",
    theme: {
      fontFamily: "Montserrat, Inter, sans-serif",
      colors: {
        primary: "#9a3412",     // 대담한 브릭 브라운 레드
        secondary: "#6b7280",   // 노출 콘크리트 그레이
        accent: "#111827",      // 구조적 다크 스틸 블랙
        background: "#f3f4f6",  // 단정한 라이트 스틸 그레이
        surface: "#ffffff",     // 도면처럼 명학한 화이트 표면
        text: "#111827"         // 선명하고 강인한 잉크 블랙
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "선과 구조로 도시의 스카이라인을 리디자인하다",
        subtitle: "단순한 빌딩 시공을 넘어, 자재의 원천적인 물성과 빛의 투과율을 정교하게 계산하여 인간과 대지가 조화롭게 호흡하는 프리미엄 하이엔드 공간을 직조합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "블루프린트 열람",
          ctaLink: "#contact",
          features: [
            { text: "구조적 안정성과 입체적 미니멀리즘이 조화된 독창적 건축 설계" },
            { text: "3D VR 테크놀로지를 적용한 정밀 공간 조도 시뮬레이션 인프라" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디자인 빌드 매트릭스",
        subtitle: "청사진 스케치부터 오차 없는 최종 마감까지 완벽 제어하는 프로페셔널 공간 영역입니다.",
        content_data: {
          items: [
            {
              title: "하이엔드 건축 설계 및 감리",
              description: "도시 법규와 대지 고도를 날카롭게 분석하여 형태의 아름다움과 기능성을 극대화한 주거 및 상업 시설 마스터 플랜을 공급합니다.",
              icon: "Compass"
            },
            {
              title: "프리미엄 인테리어 디렉션",
              description: "0.1mm의 오차도 허용하지 않는 히든 도어와 라인 조명 세팅을 통해 가구와 공간이 완전히 일체화되는 미니멀 홈을 시공합니다.",
              icon: "Layers"
            },
            {
              title: "공간 가치 밸류업 기획",
              description: "노후화된 자산의 아키텍처를 전면 리브랜딩하여 공실률을 제어하고 건물의 본질적인 예술적 자산 가치를 증폭시킵니다.",
              icon: "PenTool"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "도시에 직선을 새기는 공간 엔지니어링 그룹",
        subtitle: "가장 단순한 형태 구조가 가장 강력하고 거대한 메시지를 담아낸다고 확신합니다.",
        content_data: {
          description: "저희 건축 디자인 빌드 랩은 국내외 권위 있는 아키텍처 대상을 수상한 시니어 건축가들과 시공 테크니션들이 상생의 가치 아래 의기투합한 스페이스 스튜디오입니다. 우리는 과장된 장식에 가려진 공간의 숨은 면적을 구출하고, 재료 본연의 질감을 투명하게 노출하는 정직한 인테리어 문화를 고수해 오고 있습니다. 당신의 철학이 담길 단단한 공간의 미래를 만나보세요.",
          stats: [
            { label: "개최 전시", value: "25회" },
            { label: "글로벌 파트너", value: "40+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "준공 마스터피스 레코드",
        subtitle: "수평 그리드와 노출 콘크리트 미학을 통해 영속성을 입증해 낸 대표 건축 프로젝트입니다.",
        content_data: {
          items: [
            { title: "더 노드(The Node): 복합문화 미술관", description: "기하학적 캔틸레버 구조와 자연 채광 동선 설계로 조형적 깊이감을 준 상업 건축", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "모노리스(Monolith) 펜트하우스 인테리어", description: "몰딩과 프레임을 제거하고 매트 블랙 스틸과 대리석 자재로 마감한 하이엔드 주거 레지던스", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" },
            { title: "어반 가든 스틸 타워 셋업", description: "스틸 프레임 전면 유리 도어와 실내 중정 플랜팅 디자인을 결합한 유기적 빌딩 빌드업", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "상상 속의 블루프린트를 실현할 시간",
        subtitle: "신축 단독주택 기획, 상업 빌딩 리모델링 견적 단가 문의, 혹은 공간 디렉션 제휴 제안은 아래로 신호를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  ceramic_atelier_art: {
    templateId: "ceramic_atelier_art",
    name: "내추럴 테라코타 도예 아틀리에",
    category: "Art & Design",
    description: "흙과 빛의 자연스러운 결을 빚어내는 오가닉 감성의 도예 공방 테마입니다. 따뜻한 대지 흙빛의 샌드 베이지와 부드러운 테라코타 오렌지가 유기적인 곡선미를 형성하며 일상에 포근한 마음 치유를 선물합니다.",
    image: "/templates/ceramic_atelier_art.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#c2410c",     // 흙빛 테라코타 오렌지
        secondary: "#f5ebe0",   // 자연을 닮은 샌드 베이지
        accent: "#7c2d12",      // 깊은 가마 불꽃 번트 시엔나 브라운
        background: "#fffbf7",  // 포근한 오가닉 웜 크림 화이트
        surface: "#fbf5ee",     // 백자빛 부드러운 크림 서페이스 Card
        text: "#431407"         // 원두 및 옹기 빛의 초콜릿 브라운 본문색
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "물레 위에서 느리게 깨어나는 대지의 숨결",
        subtitle: "인위적인 화학 유약을 전면 배제하고, 순수한 천연 흙과 가마 속 뜨거운 불꽃의 기다림 끝에 빚어내는 단 하나뿐인 아날로그 수제 도자기 아트웍 컬렉션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1565192647048-f997ed87f5e2?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공방 작품집 열기",
          ctaLink: "#contact",
          features: [
            { text: "사계절 일상을 다정하게 채워줄 저저극 유기농 생활 자기" },
            { text: "공간에 묵직한 오브제가 되어 줄 대형 조형 도예 마스터피스" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아틀리에 공정",
        subtitle: "흙을 만지고 숨을 고르며 자연의 순리에 스며드는 힐링 예술 리추얼 분야입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 핸드메이드 식기 제작",
              description: "백자토와 분청토 고유의 성질을 분석하고 손성형 기법을 활용하여 손때 묻은 은은한 가치를 지닌 생활 백자를 빚어냅니다.",
              icon: "Palette"
            },
            {
              title: "전통 장작 가마 소성 디렉션",
              description: "1250도 고온 가마 속에서 산화염과 환원염의 화학적 변화를 조율하여 그윽한 옹기 빛깔과 텍스처를 구현해 냅니다.",
              icon: "Layers"
            },
            {
              title: "프라이빗 세라믹 워크숍",
              description: "도심의 소음에서 벗어나 흙의 포근한 촉감에 몰입하며 나만의 내면 감정을 그릇 형태로 직조해 나가는 치유 클래스입니다.",
              icon: "PenTool"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "흙의 정직한 온기를 전하는 도예 작가",
        subtitle: "손으로 만지고 오랜 시간 기다린 것에는 결코 지워지지 않을 생명력이 깃듭니다.",
        content_data: {
          description: "안녕하세요. 조용한 산자락 아래 주방 옆 아틀리에에서 매일 아침 물레를 돌리는 세라믹 아티스트입니다. 저는 기계가 찍어내는 자로 잰 듯한 완벽함보다, 손끝의 압력과 그날의 조도 날씨에 따라 미세하게 뒤틀리는 그릇 고유의 따뜻한 일그러짐을 신뢰합니다. 저의 소박한 도자기들이 여러분의 매일의 식사 시간 속에 잔잔한 슬로우 라이프의 기쁨이 되길 희망합니다.",
          stats: [
            { label: "개최 전시", value: "25회" },
            { label: "글로벌 파트너", value: "40+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "가마에서 막 태어난 명작들",
        subtitle: "단골 독자들의 평점 찬사를 얻으며 높은 예술적 소장 가치를 입증한 도예 아카이브입니다.",
        content_data: {
          items: [
            { title: "비움의 형태: 백자 달항아리 은유", description: "조선 전통 백자의 은은한 우유 빛깔 곡선미를 현대적인 무드로 리디자인한 시그니처 조형물", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80" },
            { title: "테라코타 가든 오브제 화기 세트", description: "거친 모래 입자 분청토를 구워내어 자연 그대로의 통기성과 거친 질감을 살린 내추럴 화분", image: "https://images.unsplash.com/photo-112196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80" },
            { title: "스틸 결합 세라믹 추상 융합물", description: "차가운 금속 뼈대와 따뜻한 도자 조각들을 결합해 인간 관계의 복잡성을 표현한 설치 예술", image: "https://images.unsplash.com/photo-1535557142533-b5e1cc6e2a5d?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "다정한 세라믹 오더 및 클래스 상담",
        subtitle: "카페 브랜드 커스텀 식기 대량 발주, 개인 전시 컬래버레이션 브리프 제안, 프라이빗 공방 단체 예약은 하단에 서신을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  "3d_motion_art": {
    templateId: "3d_motion_art",
    name: "일렉트릭 3D 모션 그래픽스 스튜디오",
    category: "Art & Design",
    description: "미래지향적 3D 모델링, VR/AR 콘텐츠 및 가상현실 그래픽스를 전문 연출하는 하이테크 디지털 아트 테마입니다. 사이버네틱 일렉트릭 바이올렛과 형광 네온 그린 포인트, 정교한 글래스모피즘 효과가 미래 기술의 몰입감을 극대화합니다.",
    image: "/templates/3d_motion_art.png",
    theme: {
      fontFamily: "Inter, Montserrat, sans-serif",
      colors: {
        primary: "#6d28d9",     // 일렉트릭 퍼플 바이올렛
        secondary: "#22c55e",   // 형광 네온 그린 액센트
        accent: "#22d3ee",      // 형광 사이버 시안 블루
        background: "#09061a",  // 깊이감 있는 우주빛 테크 다크 블랙
        surface: "#1e1b4b",     // 코드 블록을 닮은 딥 인디고 카드
        text: "#fafafa"         // 광채가 도는 라이트 화이트
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "평면을 초월하여 실시간 가상 차원을 렌더링하다",
        subtitle: "모니터 프레임 한계를 깨부수는 초단위 마이크로 마이크로 인터랙션! 픽셀에 부피를 부여하는 하드서페이스 모델링과 3D 디지털 아티팩트의 신세계가 펼쳐집니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "디지털 쇼릴 감상",
          ctaLink: "#contact",
          features: [
            { text: "언리얼 엔진 5 시스템 기반 시네마틱 하이폴리곤 환경 디자인" },
            { text: "GPU 연산 한계점 최적화 호환성을 통과한 메타버스 인터랙션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디지털 코딩 엔지니어링",
        subtitle: "가상 공간의 주파수를 컴퓨터 그래픽스로 시각화하는 미래형 테크 아카이브 영역입니다.",
        content_data: {
          items: [
            {
              title: "3D 콘셉트 캐릭터 & 크리처 스케치",
              description: "Blender와 ZBrush 마스터 툴을 활용하여 가상 비즈니스 마스코트 및 게임 엔진용 로우폴리곤 스프라이트 시퀀스를 추출합니다.",
              icon: "Cpu"
            },
            {
              title: "실시간 라이팅 & 리얼 VFX",
              description: "레이트레이싱 기술을 극대화한 글래스모피즘 굴절률과 액체 유체의 역학적 흐름을 시네마틱 특수 효과로 완벽 모사합니다.",
              icon: "Layers"
            },
            {
              title: "인터랙티브 가상 쇼룸 아키텍처",
              description: "웨어러블 디바이스 및 웹 환경에서 프레임 드랍 없이 심리스 구동되는 메타버스 디지털 시티 전시를 설계합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "디지털 주파수를 직조하는 가상 가상 현실 아티스트",
        subtitle: "마케팅의 거품 문구를 지워내고 오직 숫자가 말하는 무중단 그래픽 연산 성능만 보여줍니다.",
        content_data: {
          description: "안녕하세요! 컴퓨터 터미널 쉘 창 뒤에서 무한한 3차원 공간 좌표 시스템을 찍어나가는 테크니컬 크리에이터 바이올렛입니다. 저는 단순한 정지 화면을 넘어 감상자가 직접 유영하고 움직이는 다차원 비주얼 시퀀스를 빌드하는 일에 깊은 정체성을 두고 있습니다. 하이테크 신기술 인프라와 몽환적인 핑크 바이올렛 스펙트럼 광원이 결합된 하이 콘트라스트 디렉션을 확인해 보세요.",
          stats: [
            { label: "개최 전시", value: "25회" },
            { label: "글로벌 파트너", value: "40+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "렌더링 마스터피스 에셋",
        subtitle: "실시간 물리 쉐이더 시스템과 정교한 입체감 테스트를 무결점 통과한 오리지널 아트웍입니다.",
        content_data: {
          items: [
            { title: "사이버 크롬 시티: 메가스캔 2099", description: "네온 시안 블루와 바이올렛 광원을 매칭하여 미래 도시의 고독을 묘사한 메타버스 환경 레이아웃", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80" },
            { title: "가상 휴먼 메커니즘: 나라(Nara)", description: "마이크로 스킨 텍스처와 모션 캡처 가이드를 반영하여 실물과 구분이 힘든 하이퍼 리얼리즘 3D 아바타", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
            { title: "추상 스펙트럼 크리스탈 NFT 굿즈", description: "반투명 글래스 굴절률과 솜사탕 핑크 광원의 앙상블을 살려낸 소장 가치 높은 디지털 토이 디자인", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "차원이 다른 디지털 비즈니스를 향해",
        subtitle: "AAA급 대형 게임 그래픽 외주, VR 플랫폼 공동 기획, 글로벌 브랜드 비주얼 팝업 의뢰는 아래로 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  graphic_agency_art: {
    templateId: "graphic_agency_art",
    name: "시각 디자인 대담한 대행사 에이전시",
    category: "Art & Design",
    description: "강렬한 레이아웃과 대담한 타이포그래피의 파괴력을 선사하는 마케팅 디자인 종합 스튜디오 테마입니다. 이성적인 높은 신뢰의 로열 블루와 생기 넘치는 밝은 네온 일렉트릭 워닝 옐로우 포인트가 글로벌 비즈니스의 정체성을 단숨에 각인시킵니다.",
    image: "/templates/graphic_agency_art.png",
    theme: {
      fontFamily: "Montserrat, Pretendard, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 정통 신뢰의 로열 블루
        secondary: "#facc15",   // 생기 넘치는 워닝 옐로우
        accent: "#ea580c",      // 활동적인 앰버 오렌지
        background: "#ffffff",  // 탁 트인 넓은 오프화이트 스페이스
        surface: "#f8fafc",     // 정돈된 슬레이트 그레이 표면 카드
        text: "#0f172a"         // 가독성을 극대화한 슬레이트 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "소비자의 취향과 트렌드를 단숨에 장악하는 브랜드 카피",
        subtitle: "지루하고 단조로운 수식어를 과감하게 비워내고, 대담한 그리드 시스템과 감각적인 그래픽 언어로 매출 성장을 견인하는 차세대 디지털 광고 캠페인을 전개합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "에이전시 포트폴리오",
          ctaLink: "#contact",
          features: [
            { text: "사용자 빅데이터 기반 하이퍼 로컬 마케팅 종합 슬로건 개발" },
            { text: "로고 패키지부터 미디어 매체 집행까지의 풀스택 크리에이티브" }
          ]
        }
      },
      {
        section_type: "services",
        title: "크리에이티브 스튜디오 코어",
        subtitle: "소비자의 마음을 움직이고 기업의 페르소나를 완벽하게 빌드하는 디자인 가이드입니다.",
        content_data: {
          items: [
            {
              title: "종합 브랜드 슬로건 & 카피라이팅",
              description: "행동 심리학을 자극하여 귀를 즐겁게 하는 말장난을 배제하고 사람의 행동을 바꾸는 논리적 핵심 문장을 추출합니다.",
              icon: "PenTool"
            },
            {
              title: "하이엔드 비주얼 아이덴티티 시스템",
              description: "타이포그래피의 수직적 비례감과 옐로우 컬러 칩의 보정을 거쳐 브랜드 고유의 아우라와 시인성을 극대화합니다.",
              icon: "Palette"
            },
            {
              title: "2D/3D 모션 그래픽 광고 CF",
              description: "영상의 감정선을 폭발시키는 시네마틱 효과와 마이크로 무브먼트를 조화시켜 스킵 없는 몰입형 비디오를 프로덕션합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "영감의 한계를 확장하는 브랜드 크리에이터 그룹",
        subtitle: "매일 애자일 스프린트 루틴과 1%의 혁신이 세상을 바꾸는 동력이 된다고 신뢰합니다.",
        content_data: {
          description: "저희 시각 디자인 대행사는 글로벌 디자인 어워드를 석권한 아트 디렉터, 카피 디렉터, UI/UX 디자이너들이 의기투합하여 설립한 초고속 성장 마케팅 컴퍼니입니다. 우리는 복잡한 비즈니스 로직을 명쾌하게 단순함으로 번역하는 작업에 깊은 정체성을 두고 있으며, 데이터가 증명하는 임팩트 있는 비주얼 에셋을 처방합니다. 우리와 함께 세상을 흔들 대담한 아이디어의 첫 단추를 채워보세요.",
          stats: [
            { label: "개최 전시", value: "25회" },
            { label: "글로벌 파트너", value: "40+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "성과를 증명해 낸 아티팩트",
        subtitle: "독창적인 스토리텔링 기법으로 브랜드 가치를 가속화한 대표 파트너십 프로젝트입니다.",
        content_data: {
          items: [
            { title: "친환경 리빙 벤처 토탈 리브랜딩 캠페인", description: "로열 블루와 앰버 오렌지의 대비로 청량감을 주어 크라우드 펀딩 500%를 달성한 패키지 디자인", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 에듀테크 플랫폼 뉴스레터 리빌딩", description: "가독성이 뛰어난 그리드 시스템과 밝은 골드 옐로우 위젯 배치로 구독 오픈율 45%를 달성한 저널", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" },
            { title: "F&B 스타트업 시그니처 시네마틱 광고 영상", description: "Z세대의 키치한 감성을 저격하는 팝업 무션 애니메이션 기법으로 수백만 유기적 바이럴을 유도한 CF", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "귀사의 아이덴티티를 더 견고하게 수호할 파트너십",
        subtitle: "신규 브랜드 슬로건 리포트 의뢰, 대량 상업 카탈로그 외주 제작, 혹은 프로젝트 팝업 컬래버레이션은 하단에 서신을 띄워주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },
  fashion_stylist_art: {
    templateId: "fashion_stylist_art",
    name: "아방가르드 크림슨 패션 디렉션",
    category: "Art & Design",
    description: "실험적이고 과감한 드레이핑과 독창적인 실루엣을 아카이빙하는 패션 디렉터 및 스타일리스트 포트폴리오 테마입니다. 매트한 딥 블랙 배경 위에 타오르는 아방가르드 크림슨 레드의 하이 콘트라스트 조화가 강렬하고 예술적인 패션 에디토리얼을 완성합니다.",
    image: "/templates/fashion_stylist_art.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#dc2626",     // 아방가르드 크림슨 레드
        secondary: "#f5ebe0",   // 은은하고 차분한 베이지
        accent: "#111827",      // 시크한 매트 딥 블랙
        background: "#0b0c10",  // 묵직한 하이엔드 오프블랙
        surface: "#1f2128",     // 에디토리얼 슬레이트 그레이 카드
        text: "#fafafa"         // 시인성을 극대화한 라이트 화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "패브릭의 역학적 곡선으로 새로운 페르소나를 조각하다",
        subtitle: "정형화된 디자인 패러다임을 해체하고, 옷감 본연의 텍스처와 과감한 드레이핑 기법을 활용하여 시대를 관통하는 독창적인 비주얼 서사를 전개합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "에디션 런웨이 감상",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 패션위크 하이엔드 컬렉션 메인 캠페인 크리에이티브 디렉션" },
            { text: "시각적 소음을 덜어내고 옷 본연의 형태감에 몰입한 오리지널 화보" }
          ]
        }
      },
      {
        section_type: "services",
        title: "크리에이티브 아카이브 코어",
        subtitle: "패션 브랜드의 가치를 온몸으로 표현하고 시각 언어를 수립하는 핵심 작업 분야입니다.",
        content_data: {
          items: [
            {
              title: "패션 위크 런웨이 디렉션",
              description: "디자이너가 직조한 원사의 물성을 분석하고 무대 조명, 사운드, 워킹 동선을 치밀하게 설계하여 컬렉션의 찬사를 이끌어냅니다.",
              icon: "Sparkles"
            },
            {
              title: "에디토리얼 매거진 스타일링",
              description: "카메라 프레임 너머로 브랜드의 스토리텔링을 구현합니다. 과감한 비주얼 밸런스와 정교한 패브릭 튜닝으로 마스터피스 화보를 만듭니다.",
              icon: "Paintbrush"
            },
            {
              title: "비주얼 비주얼 레이아웃 브랜딩",
              description: "디지털 채널과 미디어를 아우르는 감각적인 룩북 기획, 컬러 그레이딩 정체성 및 비주얼 브랜딩 방향성을 제시합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "침묵 속에서 몸짓으로 서사를 새기는 뮤즈",
        subtitle: "스타일링은 입는 옷의 나열이 아니라, 한 인간의 예술적 가치관을 증명하는 태도입니다.",
        content_data: {
          description: "안녕하세요. 글로벌 하이엔드 패션 매거진의 수석 에디터를 거쳐 현재 독창적인 비주얼 디렉션을 지휘하고 있는 스타일리스트입니다. 저는 빠르게 소모되는 인스턴트 트렌드 대신, 옷을 입는 사람의 내면과 패브릭이 만나 이루는 유기적인 선의 미학에 깊이 몰두해 왔습니다. 렌즈 너머로 펼쳐지는 찰나의 순간을 지워지지 않을 예술적 영원으로 박제하는 독보적인 포트폴리오를 약속드립니다.",
          stats: [
            { label: "콜라보레이션", value: "15회" },
            { label: "소장 전시관", value: "8개소" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "시즌 시그니처 포트폴리오",
        subtitle: "빛과 그림자, 그리고 해체주의 실루엣으로 예술적 성과를 입증해 낸 대표 화보 컬렉션입니다.",
        content_data: {
          items: [
            { title: "크림슨의 심연: S/S 컬렉션 화보", description: "강렬한 레드 조명과 딥 블랙 비대칭 드레이핑 의상의 하모니로 인간의 원초적 사유를 묘사한 에디토리얼", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
            { title: "아방가르드 오디세이: 파리 런웨이", description: "리넨과 레더 자재의 이색적인 유기적 결합으로 글로벌 패션 위크 현장에서 찬사를 이끌어낸 런웨이 스냅", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80" },
            { title: "해체된 그리드: 캡슐 룩북 저널", description: "선의 비례를 파괴하여 옷을 입는 사람의 태도와 독창성을 입체적으로 극대화한 브랜드 매거진 협업 컷", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "독창적인 크리에이티브의 첫 단추를 채우다",
        subtitle: "신규 시즌 룩북 총괄 디렉션 의뢰, 하이엔드 광고 캠페인 콜라보레이션, 혹은 프라이빗 스타일링 자문은 아래 양식에 신호를 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  editorial_magazine_art: {
    templateId: "editorial_magazine_art",
    name: "프리미엄 에디토리얼 북 아카이브",
    category: "Art & Design",
    description: "현대 미술 평론, 사진 비평 및 타이포그래피 논평을 차분하고 묵직하게 기록해 나가는 독립 출판 테마입니다. 세월의 흔적이 감도는 따뜻한 뉴스페이퍼 세피아와 깊고 선명한 리치 잉크 블랙의 가독성 밸런스가 격조 높은 서재의 공기를 전달합니다.",
    image: "/templates/editorial_magazine_art.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#78350f",     // 앤티크 딥 세피아 브라운
        secondary: "#1c1917",   // 리치 잉크 블랙 포인트
        accent: "#b45309",      // 타자기 오렌지 머스터드
        background: "#fffbf5",  // 빛바랜 뉴스페이퍼 세피아 크림 배경
        surface: "#fbf3e6",     // 앤티크 양장본 크림 서페이스 카드
        text: "#292524"         // 타자기 먹색을 닮은 스톤 블랙 본문색
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "활자의 여백 속에서 인문학적 사유를 조각하다",
        subtitle: "빠르게 소모되는 디지털 콘텐츠 홍수에서 벗어나, 종이 질감 위에 묵직한 잉크로 새겨진 고전 문학 평론과 현대 비주얼 아트를 정독하는 지적인 심야 서재 공간입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "독립 저널 정독",
          ctaLink: "#contact",
          features: [
            { text: "시대를 초월해 영혼에 질문을 던지는 시각 예술 및 타이포그래피 비평 리포트" },
            { text: "만년필의 필기감과 아날로그 감성을 보존하는 프리미엄 양장 출판 가이드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "지적 탐구 영역",
        subtitle: "사유의 밀도를 높이고 텍스트의 미학을 전파하는 에디토리얼 종합 스튜디오 영역입니다.",
        content_data: {
          items: [
            {
              title: "현대 문학 및 사진 비평문 집필",
              description: "예술가의 세계관과 작품의 아우라를 날카롭고 입체적으로 해석하여 누구나 깊이 공감하면서도 깊이를 잃지 않는 서평을 생산합니다.",
              icon: "BookOpen"
            },
            {
              title: "타이포그래피 그리드 시스템 설계",
              description: "바우하우스 철학을 계승하여 본문 활자의 크기, 수평 비례, 행간의 여백을 치밀하게 계산하여 극도의 가독성을 자랑하는 레이아웃을 디자인합니다.",
              icon: "Layers"
            },
            {
              title: "독립 출판 저널 큐레이션",
              description: "대형 출판 유통망에서는 찾기 힘든 신진 작가들의 조각 글과 비주얼 아트웍을 한 권의 단단한 양장 서신집으로 기획 큐레이션합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상을 천천히 받아 적는 독립 북 아키비스트",
        subtitle: "말은 바람을 타고 날아가 버리지만, 종이 위에 새긴 문장은 천 년의 세월을 버텨 영혼을 울립니다.",
        content_data: {
          description: "안녕하세요. 오래된 물건이 주는 손때 묻은 온기와 지독한 책 냄새를 사랑하는 저널리스트이자 독립 출판 디렉터입니다. 저는 무조건적인 디지털 편리함 대신 가죽 만년필 파우치를 열고 타자기를 두드리는 수고로움 속에서 삶의 진짜 깊이와 지적 자산을 포착하곤 합니다. 이 정적이고 깊은 공간이 자극적인 소음에 지친 여러분의 마음을 치유하는 심야의 아늑한 책방 서재가 되길 바랍니다.",
          stats: [
            { label: "콜라보레이션", value: "15회" },
            { label: "소장 전시관", value: "8개소" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "빛바랜 텍스트 아카이브",
        subtitle: "정교한 그리드 시스템과 묵직한 내러티브가 결합되어 지적 성과를 증명해 낸 대표 양장 저널입니다.",
        content_data: {
          items: [
            { title: "1950년대 클래식 타이포 복원 리포트", description: "전통 활자 서체의 비례를 추적 복원하여 현대 웹 레이아웃 매칭 가이드로 풀어낸 시각 평론서", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80" },
            { title: "침묵하는 도시의 잔상들: 포토 에세이", description: "파리와 교토의 새벽녘 골목길을 라이카 수동 카메라 흑백 프레임에 박제해 낸 독립 출판물집", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" },
            { title: "F&B 장인정신 스토리텔링 저널 호", description: "수십 년간 한 자리를 지켜온 장인들의 역사와 철학을 인터뷰 수필 형식으로 구성해 호평을 받은 잡지", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "영원히 남을 문장의 기록을 함께 시작하세요",
        subtitle: "종합 정기 뉴스레터 기고문 의뢰, 독립 출판 디자인 룩북 마감 자문, 혹은 예술 서평 제휴 제안은 아래 빈 종이에 글을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  visual_illustrator_art: {
    templateId: "visual_illustrator_art",
    name: "드림 팝 비주얼 일러스트 스튜디오",
    category: "Art & Design",
    description: "꿈과 무의식의 세계를 몽환적인 파스텔 화풍으로 담아내는 비주얼 일러스트레이터 포트폴리오 테마입니다. 솜사탕 같은 에테리얼 파스텔 라벤더와 부드러운 소프트 미스트 크림이 융합되어 마음을 몽글몽글하게 만듭니다.",
    image: "/templates/visual_illustrator_art.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#f472b6",     // 솜사탕 핑크
        secondary: "#c084fc",   // 에테리얼 파스텔 라벤더
        accent: "#38bdf8",      // 청량한 파스텔 스카이 블루
        background: "#fdf8ff",  // 몽환적인 틴트 미스트 크림 배경
        surface: "#ffffff",     // 동글동글하고 깨끗한 화이트 캔버스
        text: "#4c1d95"         // 분위기를 조화롭게 잡아주는 딥 플럼
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "파스텔 솜사탕 구름 위에서 펼쳐지는 마법 같은 상상력",
        subtitle: "단조롭고 지루한 회색빛 일상에 감성 한 스푼! 사랑스러운 오리지널 캐릭터들과 초현실적 무의식 세계를 그리는 일러스트 아틀리에에 오신 것을 환영합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "그림책 페이지 열기",
          ctaLink: "#contact",
          features: [
            { text: "독창적인 서사적 감성이 숨 쉬는 2D/3D 캐릭터 콘셉트 아트 디자인" },
            { text: "글로벌 뷰티 랜드마크 및 애니메이션 콜라보레이션 메인 비주얼 에셋" }
          ]
        }
      },
      {
        section_type: "services",
        title: "드림 아트 스펙트럼",
        subtitle: "보는 순간 행복을 선물하고 마음의 동심을 깨워줄 아티스트의 작업 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 콘셉트 아트 & 마스코트",
              description: "모바일 게임, 브랜드 이모티콘, 기업 마스코트에 즉시 연동 가능한 입체적이고 사랑스러운 페르소나 캐릭터 디자인을 설계합니다.",
              icon: "Sparkles"
            },
            {
              title: "동화책 삽화 & 디지털 포스터",
              description: "따뜻한 아날로그 질감의 수제 브러시 표현과 몽환적인 파스텔 색채 그라데이션 가이드를 반영한 출판 도서 일러스트를 제작합니다.",
              icon: "Paintbrush"
            },
            {
              title: "스페셜 패키지 및 아트토이 디자인",
              description: "2D 평면 일러스트 아트웍을 키링, 폰케이스, 콘셉트 피규어 등 소장 가치가 풍부한 하이엔드 브랜드 굿즈 상품으로 입체 모델링합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상을 핑크빛 꿈으로 물들이는 비주얼 비주얼 메이커",
        subtitle: "가장 개인적인 무의식 속 이야기 속에 누구나 공감하는 보편적 영감이 존재합니다.",
        content_data: {
          description: "안녕하세요! 지치고 메마른 도심의 소음 속에 몽글몽글한 파스텔 파도를 퍼트리는 비주얼 일러스트레이터 드림입니다. 저는 어린 시절 꿈속 은하수에서 보았던 신비로운 색채와 온기를 캔버스 표면 위에 구현해 오고 있습니다. 제 그림을 감상하시는 그 짧은 몇 분의 순간만큼은 무거운 걱정을 모두 내려놓고 마법 같은 치유의 행복을 누려보시길 바랍니다.",
          stats: [
            { label: "콜라보레이션", value: "15회" },
            { label: "소장 전시관", value: "8개소" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "꿈결 같은 은하수 아카이브",
        subtitle: "상상 속의 내러티브들이 몽환적인 파스텔 빛깔로 피어난 대표 아트웍 에디션입니다.",
        content_data: {
          items: [
            { title: "달빛 아래 유영하는 분홍 고래의 밤", description: "스카이 블루와 핑크 그라데이션 기법으로 우주 밤하늘을 헤엄치는 고래를 묘사한 시그니처 일러스트", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80" },
            { title: "미지의 숲속, 솜사탕 요정 마을의 속삭임", description: "포근한 클레이 텍스처 브러시와 라벤더 틴트 광원을 매칭하여 몽환적 깊이감을 준 판타지 동화 삽화", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 코스메틱 팝업 비주얼 디자인", description: "Z세대의 키치하고 러블리한 감각을 저격하여 완판 트렌드를 달성한 프리미엄 아트 패키지 셋업", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "다정한 동화 속 세계로 당신을 초대합니다",
        subtitle: "독창적인 외주 커스텀 삽화 의뢰, 전시회 콜라보레이션 브리프 공유, 혹은 기분 좋은 팬레터는 언제든 하단 스튜디오 창으로 편지를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  fine_art_painter: {
    templateId: "fine_art_painter",
    name: "파인 아트 아날로그 현대 회화 갤러리",
    category: "Art & Design",
    description: "거친 브러시 질감이 살아 숨 쉬는 아날로그 유화 및 현대 추상 회화 작가의 아카이빙 테마입니다. 세련된 뮤지엄 차콜과 따뜻한 이보리 화이트가 만나 실제 오프라인 미술관 벽면의 격식과 아우라를 구현합니다.",
    image: "/templates/fine_art_painter.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#262626",     // 묵직한 하이엔드 뮤지엄 차콜
        secondary: "#d4a373",   // 내추럴 오가닉 스킨 톤
        accent: "#881337",      // 격조 높은 버건디 레드 낙관
        background: "#fffdf9",  // 정갈한 한지 웜 아이보리
        surface: "#fbf5ee",     // 백자빛 부드러운 서페이스 카드
        text: "#171717"         // 선명한 먹색 잉크 블랙
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "나이프와 물감의 텍스처로 캔버스에 영혼을 새기다",
        subtitle: "디지털 그래픽 픽셀의 차가움을 지워내고, 여러 번 덧칠한 오일 물감의 두터운 마티에르와 자연 유래 광원의 앙상블로 순수 회화의 엄숙한 깊이를 전합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
          ctaText: "도록 정독하기",
          ctaLink: "#contact",
          features: [
            { text: "국내외 공인 미술 비엔날레 입선 및 소장 가치를 입증한 순수 미술" },
            { text: "인위적인 정형성을 파괴하고 인간의 내면 사유를 투영한 추상 캔버스" }
          ]
        }
      },
      {
        section_type: "services",
        title: "회화 아틀리에 마스터 피스",
        subtitle: "장인정신의 한계점까지 밀어붙여 무결점 순수 예술의 가치를 보존하는 작업 영역입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 대형 유화 및 캔버스 작화",
              description: "린시드 오일과 최고급 천연 광물 물감 자재를 활용하여 거친 나이프 질감(Matiere)의 생명력이 꿈틀거리는 회화 작품을 빌드합니다.",
              icon: "Palette"
            },
            {
              title: "현대 추상 및 벽면 설치 평론",
              description: "대지가 가진 역사와 공간의 여백, 동선 아키텍처를 치밀하게 계산하여 감상자가 압도적인 예술적 몰입감을 느끼도록 대형 캔버스를 인하우스 스타일링합니다.",
              icon: "Eye"
            },
            {
              title: "프라이빗 파인 아트 도슨트 숍",
              description: "미술 시장의 매크로 데이터를 기반으로 개인 컬렉터의 취향과 영속적 자산 소장 가치를 모두 충족하는 명작 매칭 컨설팅을 진행합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "본질을 그리는 순수 파인 아티스트",
        subtitle: "훌륭한 그림은 눈을 즐겁게 하는 기교가 아니라, 영혼의 심연에 침묵의 울림을 던지는 일입니다.",
        content_data: {
          description: "안녕하세요. 하얀 원고지 같은 캔버스 표면 위에 나이프로 묵직한 삶의 궤적을 덧칠해 나가는 현대 회화 작가입니다. 저는 모니터의 차가운 픽셀 대신, 직접 흙과 물감을 개어내고 캔버스를 짜는 아날로그의 진중한 수고로움 속에서 삶의 본질적 평온을 구출해 오고 있습니다. 저의 묵직한 뮤지엄 서재에 머무시는 동안, 두고두고 보아도 가슴이 먹먹해지는 영원한 예술적 아우라를 호흡해 보시길 진심으로 바랍니다.",
          stats: [
            { label: "개최 전시", value: "25회" },
            { label: "글로벌 파트너", value: "40+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "가마와 작업실에서 태어난 명작",
        subtitle: "평론가들의 극찬 속에서 갤러리 상설 전시 소장 완료를 기록한 대표 오리지널 아카이브입니다.",
        content_data: {
          items: [
            { title: "비움의 형태 제1장: 달항아리 은유", description: "조선 전통 백자의 은은한 우유 빛깔과 흙의 질감을 현대 추상 기법의 캔버스로 리디자인한 대형 유화", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80" },
            { title: "대지의 숨결: 테라코타 클레이 추상화", description: "거친 모래 입자가 섞인 옹기 빛 브라운 톤 물감을 나이프로 두터우며 투명하게 겹쳐 올린 융합 예술", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80" },
            { title: "시간의 영속성: 혼합 매체 설치 레코드", description: "매트한 뮤지엄 차콜 철골 구조물과 캔버스를 유기적으로 결합하여 사회적 관계를 형상화한 설치 미술", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "영원히 남을 예술적 자산의 가치를 들여놓으세요",
        subtitle: "개인 및 기업 사옥 커스텀 대형 회화 주문 제작, 미술관 기획전 특별 초청 제안, 혹은 아트 컬렉팅 컨설팅 의뢰는 아래 서면 폼으로 마음을 건네주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  craft_woodwork_atelier: {
    templateId: "craft_woodwork_atelier",
    name: "리치 티크 퍼니처 인더스트리얼 아틀리에",
    category: "Art & Design",
    description: "나무 고유의 결을 다듬어 가구를 제작하는 수제 원목 공예 및 인더스트리얼 디자인 공방 테마입니다. 묵직하고 깊은 리치 티크 우드 브라운과 차분한 슬레이트 그레이의 유기적인 조화가 장인 정신의 가치를 선사합니다.",
    image: "/templates/craft_woodwork_atelier.png",
    theme: {
      fontFamily: "Pretendard, Montserrat, sans-serif",
      colors: {
        primary: "#78350f",     // 리치 티크 우드 브라운
        secondary: "#6b7280",   // 차분한 슬레이트 그레이
        accent: "#c2410c",      // 활력을 불어넣는 테라코타 오렌지
        background: "#fffbf7",  // 오가닉 내추럴 웜 오프화이트
        surface: "#fbeee6",     // 따뜻한 오트밀 크림 서페이스 카드
        text: "#292524"         // 타자기 먹색 스톤 블랙
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "손끝의 대패질로 나만의 견고한 요새를 빌드하다",
        subtitle: "수백 년의 시간의 궤적을 품은 북미산 월넛과 화이트 오크 원목의 숨결을 그대로 유지하고, 수공예 친환경 천연 오일 마감 공정을 통해 영속적인 명품 가구를 창조합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공방 도안 확인",
          ctaLink: "#contact",
          features: [
            { text: "짜임 구조 아키텍처를 도입하여 못 없이 견고하게 조립되는 가구 시공" },
            { text: "실내 온습도 변화에 유기적으로 호흡하며 뒤틀림 없는 원목 분갈이 밸런싱" }
          ]
        }
      },
      {
        section_type: "services",
        title: "인더스트리얼 크래프트 랩",
        subtitle: "공간의 분위기를 완전히 바꾸고 삶의 속도를 늦추는 핸드메이드 소목장 영역입니다.",
        content_data: {
          items: [
            {
              title: "하이엔드 가구 설계 및 수공예",
              description: "원목 가구의 결을 해부하고 손성형(Hand-building) 기법을 거쳐 대를 이어 두고두고 쓸 수 있는 시그니처 다이닝 식탁과 소파를 제작합니다.",
              icon: "Layers"
            },
            {
              title: "공방 가구 마감 및 에이징 디렉션",
              description: "천연 오일 스테인과 가마 소성 가이드를 통과한 천연 왁스를 덧발라 원목 고유의 그윽한 브라운 빛깔과 방화벽 성능을 극대화합니다.",
              icon: "Paintbrush"
            },
            {
              title: "프라이빗 소목 워크숍 클래스",
              description: "나무 톱질 소리와 대패 냄새가 가득한 시간 속에서, 일상의 노이즈를 비워내고 스스로 그릇 소품을 직조해 나가는 치유 리추얼입니다.",
              icon: "PenTool"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "나무의 정직한 결을 쫓는 마스터 아티산",
        subtitle: "손으로 만지고 오랜 시간 기다린 물건만이 일상에 위대한 온기를 선물합니다.",
        content_data: {
          description: "안녕하세요. 회색빛 도심 아파트 공간을 원목의 소박한 싱그러움으로 채워나가는 아티산 공방장입니다. 우리는 유행에 따라 쉽게 쓰고 버려질 인스턴트 가공 합판을 거부하며, 시간의 흐름이 고스란히 멋스러운 헤리티지로 남는 천연 통원목 원자재만을 고집합니다. 장인정신의 뼈대 위에 인더스트리얼 슬레이트 그레이 스틸 자재를 정교하게 융합한 명작 가구를 약속드립니다.",
          stats: [
            { label: "개최 전시", value: "25회" },
            { label: "글로벌 파트너", value: "40+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "공방에서 완성된 명작들",
        subtitle: "정교한 수평 그리드와 완벽한 마감으로 높은 평점 만족도를 영구 갱신 중인 시그니처 큐레이션입니다.",
        content_data: {
          items: [
            { title: "미니멀리즘 북미산 월넛 6인용 다이닝 탁자", description: "상판의 유기적인 곡선미를 살리고 히든 짜임 공법으로 흔들림을 제로로 제어한 명품 식탁 / 2,100,000원", image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80" },
            { title: "티크 우드 앤 인더스트리얼 스틸 소파 배드", description: "묵직한 티크 원목 베이스 프레임에 차분한 패브릭 쿠션을 매칭한 다목적 힐링 가구 / 1,650,000원", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" },
            { title: "천연 오일 마감 원목 서재 북케이스 오브제", description: "책 보관 시 습도 조절과 공기 정화가 유기적으로 연동되는 친환경 하드커버 전용 책장 / 850,000원", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "당신의 거실과 서재에 나무의 온기를",
        subtitle: "카페 브랜드 커스텀 테이블 대량 B2B 독점 계약, 사옥 라운지 공간 가구 스타일링 컨설팅 자문, 프라이빗 워크숍 신청은 아래로 문장을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },
  perfume_design_studio: {
    templateId: "perfume_design_studio",
    name: "센트 브랜딩 디자인 스튜디오",
    category: "Art & Design",
    description: "후각적 감각을 정교한 패키지와 그래픽 디자인으로 시각화하는 조향 및 센트 브랜딩 전문 디자인 스튜디오 테마입니다. 몽환적인 파스텔 라벤더와 세련된 실버 컬러가 글래스모피즘 효과와 어우러져 향기가 지닌 영속적인 비주얼 정체성을 완성합니다.",
    image: "/templates/perfume_design_studio.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#8b5cf6",     // 몽환적인 파스텔 라벤더
        secondary: "#e2e8f0",   // 세련된 크리스프 실버
        accent: "#ec4899",      // 감각적인 뷰티 크림슨 핑크
        background: "#fffbfd",  // 은은한 살구빛 오프화이트
        surface: "#ffffff",     // 유리잔을 닮은 화이트 캔버스 표면
        text: "#1e1b4b"         // 깊은 한밤중의 미드나잇 인디고 퍼플
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "보이지 않는 향기의 서사를 완벽한 비주얼로 조각하다",
        subtitle: "감각적인 니치 향수 오일의 탑노트부터 베이스노트까지의 흐름을 정교하게 분석하여, 브랜드의 품격을 높이는 패키지와 아이덴티티 시스템을 마스터 디렉팅합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스튜디오 프로젝트 보기",
          ctaLink: "#contact",
          features: [
            { text: "프랑스 그라스 향수 하우스와의 협업으로 입증된 하이엔드 브랜딩" },
            { text: "글래스모피즘 굴절률과 선의 비례감을 반영한 예술적 패키지 디자인" }
          ]
        }
      },
      {
        section_type: "services",
        title: "센트 브랜딩 카테고리",
        subtitle: "후각의 가치를 캔버스와 오브제 위에 완벽하게 구체화하는 전문 디자인 영역입니다.",
        content_data: {
          items: [
            {
              title: "시그니처 패키지 디자인",
              description: "보틀의 유기적인 곡선미와 향조 캘린더의 무드를 매칭하여 소장 가치가 풍부한 마스터피스 코스메틱 에셋을 개발합니다.",
              icon: "Layers"
            },
            {
              title: "비주얼 비주얼 정체성(BI) 수립",
              description: "브랜드가 지닌 고유의 은유적 내러티브를 타이포그래피의 수직적 비례감과 라벤더 컬러 칩으로 형상화하여 전달력을 높입니다.",
              icon: "Palette"
            },
            {
              title: "공간 프레그런스 큐레이션",
              description: "미술관이나 럭셔리 라운지 전시실의 조도와 동선을 분석해 소이 캔들 및 디퓨저의 발산 향을 최적으로 조율하는 브랜딩을 제공합니다.",
              icon: "Eye"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "눈에 보이지 않는 감각을 설계하는 디렉터",
        subtitle: "가장 단순한 선과 여백이 향기가 가진 거대한 예술적 가치를 대변한다고 확신합니다.",
        content_data: {
          description: "안녕하세요. 향기의 보이지 않는 주파수를 포착하여 세련된 픽셀과 패키지 형태로 받아 적는 디자인 랩 디렉터 라벤더입니다. 우리는 단순한 장식 위주의 화려함을 지워내고 사물과 사유의 본질적인 형태에 몰두합니다. 이 정적이고 몽환적인 아틀리에 스페이스가 자극적인 소음에 지친 크리에이터들의 감각을 다정하게 채워주는 영감의 서재가 되길 희망합니다.",
          stats: [
            { label: "글로벌 어워드", value: "12회" },
            { label: "누적 수강생", value: "2,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "프리미엄 렌더 아카이브",
        subtitle: "세련된 무드 보드와 정교한 마감 공정을 통해 높은 성과와 만족도를 갱신 중인 대표작입니다.",
        content_data: {
          items: [
            { title: "블러썸 바이올렛 럭셔리 향수 패키징", description: "라벤더 틴트 유리의 투명한 굴절률과 매트 차콜 캡의 조화로 낭만적 깊이감을 준 패키지 디자인", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" },
            { title: "에센셜 소이 캔들 오가닉 마블 저널", description: "대나무 숲의 이끼 향과 타오르는 장작 소리에서 포착한 서사를 타자기 질감으로 레이아웃한 브랜딩", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 코스메틱 팝업 비주얼 디렉션", description: "Z세대의 키치하면서도 하이엔드적인 무드를 저격하여 완판 트렌드를 달성한 팝업 스토어 스페이스", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "세상을 바꿀 감각적 협업의 문을 열며",
        subtitle: "신규 니치 브랜드 런칭 기획, 디자인 외주 의뢰, 혹은 프라이빗 마스터 클래스 제휴 제안은 아래로 신호를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  typography_type_foundry: {
    templateId: "typography_type_foundry",
    name: "실험적 타이포그래피 & 폰트 파운드리",
    category: "Art & Design",
    description: "글자의 해부학적 비례와 조형성을 탐구하고 독창적인 디지털 서체를 공급하는 파운드리 테마입니다. 무채색 블랙과 화이트의 극한 고대비 속에 빛나는 형광 네온 블루 그리드 시스템이 정밀하고 이성적인 디자인 미학을 극대화합니다.",
    image: "/templates/typography_type_foundry.png",
    theme: {
      fontFamily: "Fira Code, Montserrat, sans-serif",
      colors: {
        primary: "#06b6d4",     // 형광 네온 시안 블루
        secondary: "#6b7280",   // 정밀한 포인트 슬레이트 그레이
        accent: "#3b82f6",      // 테크니컬 일렉트릭 블루
        background: "#030712",  // 깊이감 있는 딥 블랙
        surface: "#111827",     // 터미널 콘솔 무드의 다크 카드
        text: "#ffffff"         // 광채를 뿜어내는 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "선과 픽셀의 경계에서 글자의 조형 언어를 연산하다",
        subtitle: "단순한 텍스트 배열을 넘어, 세리프의 굴절 각도와 가독성 그리드를 0.01px 단위로 정밀 조율하여 비즈니스의 메시지를 가장 강인하고 선명한 활자로 박제합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오리지널 서체 테스트",
          ctaLink: "#contact",
          features: [
            { text: "현대 바우하우스 그리드 철학을 계승한 가변형 배리어블 폰트 빌딩" },
            { text: "다양한 웹 브라우저 환경에서 프레임 드랍 없이 심리스하게 렌더링되는 웹 표준 서체" }
          ]
        }
      },
      {
        section_type: "services",
        title: "폰트 엔지니어링 매트릭스",
        subtitle: "텍스트의 파괴력과 시각 정체성을 최고 수준으로 마스터 빌드하는 전문 분야입니다.",
        content_data: {
          items: [
            {
              title: "전사 전용 폰트(Custom Font) 개발",
              description: "기업의 핵심 핵심 가치를 자형의 비례와 선의 두께에 정교하게 녹여내어 브랜드 고유의 사내 언어 규격을 구축합니다.",
              icon: "Cpu"
            },
            {
              title: "디지털 타이포그래피 레이아웃",
              description: "SaaS 대시보드 및 복잡한 데이터 웹 환경을 위한 본문 활자 가독성을 극한으로 최적화하는 그리드 시스템을 디자인합니다.",
              icon: "Layers"
            },
            {
              title: "실험적 비주얼 타이포 평론",
              description: "장식적 요소를 파괴하고 글씨 자체를 하나의 독립적인 추상 조형 예술 오브제로 전환시키는 시각 마스터 클래스를 리드합니다.",
              icon: "PenTool"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "터미널 뒤에서 활자의 뼈대를 깎는 아키텍트",
        subtitle: "모든 커뮤니케이션의 한계는 정교하게 설계된 서체의 완성도로 극복할 수 있습니다.",
        content_data: {
          description: "안녕하세요. 웹 생태계의 비주얼 표준과 견고한 엔지니어링 문화를 지향하는 폰트 디렉터 겸 타이포 아키텍트입니다. 우리는 마케팅의 과장된 연출 대신, 오직 기하학적 폰트 데이터와 가혹한 환경 구동 테스트 피드백만을 바탕으로 무결점 타이포그래피 숍을 운영합니다. 메시지를 단순함으로 바꾸는 활자 장인 정신을 확인해 보세요.",
          stats: [
            { label: "글로벌 어워드", value: "12회" },
            { label: "누적 수강생", value: "2,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "렌더링 마스터피스 아티팩트",
        subtitle: "글로벌 엔지니어 크루들의 엄격한 가독성 테스트를 무결점 통과시킨 배리어블 서체입니다.",
        content_data: {
          items: [
            { title: "네오 사이버(Neo Cyber) 고대비 가변 고딕", description: "네온 시안 블루 폰트 인프라에 맞춰 개발된 테크니컬 개발자 전용 코딩 서체 시스템", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" },
            { title: "헤리티지 보그: 명조 레이아웃 복원", description: "전통 조선 활자의 우아한 세리프 각도를 0.01px 단위로 추적 복원한 프리미엄 명조 폰트", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80" },
            { title: "이노베이션 플랫폼 반응형 UI 폰트", description: "모바일 화면 크기에 맞춰 두께와 자간이 유기적으로 자동 변환되는 가변형 웹 배리어블 서체", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "성공적인 커밋 코드를 함께 빌드해 보세요",
        subtitle: "전사 전용 서체 제작 외주 의뢰, 대규모 SaaS 제품 가독성 진단 컨설팅, 혹은 폰트 제휴 제안은 아래 터미널 창을 채워 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  calligraphy_ink_studio: {
    templateId: "calligrapher_ink_studio",
    name: "수묵 문학 캘리그래피 아틀리에",
    category: "Art & Design",
    description: "전통 벼루에 갈아낸 깊은 먹의 정취와 현대적 서체의 율동감을 유기적으로 결합한 동양풍 캘리그래피 스튜디오 테마입니다. 물기를 머금은 정갈한 뽕나무 한지 화이트 배경 위에 스며드는 은은한 붓먹색이 극도의 절제미를 선사합니다.",
    image: "/templates/calligraphy_ink_studio.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#1c1917",     // 붓먹색 (Charcoal Ink Black)
        secondary: "#f5f5f4",   // 뽕나무 한지 화이트
        accent: "#b91c1c",      // 전통 낙관의 딥 버건디 스칼렛
        background: "#fafaf9",  // 정갈하고 차분한 오프화이트
        surface: "#ffffff",     // 원고지를 닮은 순백색 카드 표면
        text: "#292524"         // 타자기 먹색 다크 브라운
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "숨을 고르고 붓끝으로 한지 위에 삶을 받아적다",
        subtitle: "획의 굵기와 속도, 먹의 번짐 속에 번뇌와 일상의 평온을 함께 담아내며 말은 바람을 타고 날아가 버리지만 잉크로 새긴 활자는 영원히 영혼을 울립니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
          ctaText: "묵적(墨跡) 도록 감상",
          ctaLink: "#contact",
          features: [
            { text: "전통 서예 기법을 현대 마케팅 마인드와 접목한 타이포 브랜딩" },
            { text: "한 장의 종이 위 여백의 미를 살려 삶의 기적을 은유하는 수묵 아트웍" }
          ]
        }
      },
      {
        section_type: "services",
        title: "수묵 서사 아카이브",
        subtitle: "속도를 늦추고 온전히 필력의 깊이를 전하는 아날로그 독립 디자인 영역입니다.",
        content_data: {
          items: [
            {
              title: "전통 패키지 & 대형 영화 타이틀 BI",
              description: "사극 영화 제목, 명인 F&B 패키지의 핵심 정체성을 붓글씨 고유의 묵직한 서사적 형태감과 낙관 포인트로 디자인합니다.",
              icon: "PenTool"
            },
            {
              title: "여백의 미 현대 설치 미술",
              description: "미술관 벽면이나 대형 한지 패널에 여백의 미를 극대화한 붓먹 아트를 작화하여 공간 전체에 깊은 동양풍 아우라를 부여합니다.",
              icon: "Palette"
            },
            {
              title: "심야 서평 및 치유 라이팅 클래스",
              description: "바쁜 소음 속에서 스스로 벼루에 먹을 갈며 내면의 감정을 정제된 선으로 직조해 나가는 마인드 웰빙 테라피 워크숍을 이끕니다.",
              icon: "BookOpen"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "글씨 속에 영혼의 주파수를 빚는 서예가",
        subtitle: "화려하게 소비되는 디지털 픽셀 대신 영원히 남을 먹향 가득한 글을 짓습니다.",
        content_data: {
          description: "안녕하세요. 전통 서예의 정통성을 현대 시각 디자인 에이전시 문맥으로 리브랜딩하는 서화 아티스트입니다. 저는 벼루에 먹을 가는 고요한 시간 속에서 삶의 진짜 평온을 구출해 오고 있습니다. 불필요한 수식어를 제거하고 오직 선의 힘과 먹의 농담, 그리고 비워둔 여백만으로 독자의 가슴을 뒤흔드는 밀도 높은 텍스트 캔버스를 펼쳐 보입니다.",
          stats: [
            { label: "글로벌 어워드", value: "12회" },
            { label: "누적 수강생", value: "2,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "벼루에서 태어난 묵적",
        subtitle: "독자적인 필력과 철학으로 평론가들의 찬사를 독차지한 오리지널 타이포그래피 기록입니다.",
        content_data: {
          items: [
            { title: "비움의 노래: 현대 수묵 추상전", description: "Charcoal Ink의 농담 조절만으로 인간의 고독과 연대를 함축해 묘사한 대형 캔버스 아트웍", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "사극 대작 영화 '일월' 메인 타이틀", description: "강인한 붓바람의 획 속에 버건디 스칼렛 낙관을 찍어 시대의 비장미를 선명하게 박제한 타이틀 디자인", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80" },
            { title: "명인 한과 패키지 브랜드 로고 브랜딩", description: "수십 년간 전통을 지켜온 명인의 철학을 부드러운 붓글씨 질감으로 세련되게 담아낸 패키지 외주 컷", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "먹향 가득한 서재로 당신을 초대합니다",
        subtitle: "대형 타이틀 디자인 외주 의뢰, 인테리어용 수묵 캘리그래피 작품 구매, 문화 예술 제휴 제안은 아래 원고지 양식에 글을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  fine_art_photography: {
    templateId: "fine_art_photography",
    name: "실버 젤라틴 흑백 파인아트 사진관",
    category: "Art & Design",
    description: "빛과 그림자, 그리고 거친 입자(Grain)의 질감만으로 피사체의 영혼을 프레임에 박제하는 파인 아트 사진 포트폴리오 테마입니다. 세련된 실버 젤라틴 그레이와 클래식 차콜 블랙의 대비가 갤러리 미술관의 정적 몰입감을 재현합니다.",
    image: "/templates/fine_art_photography.png",
    theme: {
      fontFamily: "Inter, Georgia, sans-serif",
      colors: {
        primary: "#111827",     // 클래식 차콜 블랙
        secondary: "#6b7280",   // 실버 젤라틴 그레이
        accent: "#ef4444",      // 프레임 레드 한 방울 포인트
        background: "#f9fafb",  // 깨끗한 미술관 백색 벽면
        surface: "#ffffff",     // 액자를 닮은 화이트 컨테이너
        text: "#111827"         // 타자기 인크 블랙
      },
      borderRadius: "rounded-none", // 완벽한 수평 그리드를 위한 제로 곡률
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "화려한 색채를 지울 때 비로소 사물의 본질이 눈을 뜬다",
        subtitle: "인위적인 디지털 필터를 지워내고, 35mm 수동 필름 카메라의 정교한 셔터 소리와 암실 속 현상액 냄새가 빚어낸 찰나의 순간을 영원한 비주얼 에세이로 전시합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
          ctaText: "갤러리 룸 입장",
          ctaLink: "#contact",
          features: [
            { text: "도시 아키텍처와 인간의 고독을 포착한 다큐멘터리 사진집" },
            { text: "자연광 조도를 치밀하게 조율해 인물의 내면 서사를 끌어낸 포트레이트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "비주얼 비주얼 저널리즘",
        subtitle: "빠르게 소모되는 그래픽 시대 속에서 영속적인 예술적 자산 가치를 기록하는 핵심 스펙트럼입니다.",
        content_data: {
          items: [
            {
              title: "에디토리얼 & 패션 룩북 촬영",
              description: "브랜드가 지닌 고유한 헤리티지를 흑백 필름 고유의 입자감으로 녹여내어 독창적인 매거진 컷을 디렉팅합니다.",
              icon: "Camera"
            },
            {
              title: "도시 아카이브 로케이션 저널",
              description: "파리, 교토 등 전 세계 소도시의 새벽녘 골목길을 렌즈 프레임에 담아 공간의 시간성을 영구히 박제합니다.",
              icon: "Compass"
            },
            {
              title: "파인아트 프린트 컬렉팅 컨설팅",
              description: "실제 아날로그 젤라틴 실버 프린트 공정을 거쳐 높은 희소성을 자랑하는 작품 소장 가치를 큐레이션합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "빛의 궤적을 추적하는 포토그래퍼",
        subtitle: "기교보다는 정직함을, 화려한 스펙터클 대신 오래도록 꺼내 볼 낭만을 인화합니다.",
        content_data: {
          description: "안녕하세요. 흑백의 극단적인 명암 대비 속에서 피사체의 숨겨진 영혼을 발굴해 내는 파인 아트 사진작가 모노크롬입니다. 저는 도심의 소음이 가라앉은 새벽, 수동 카메라를 목에 걸고 대지와 인간의 상호작용을 포착해 오고 있습니다. 저의 정갈한 화이트 스페이스에 머무시는 동안, 화려한 색채 뒤에 비워둔 여백의 아름다움과 시네마틱 무드를 온전히 누려보시길 진심으로 바랍니다.",
          stats: [
            { label: "글로벌 어워드", value: "12회" },
            { label: "누적 수강생", value: "2,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "빛과 그림자의 잔상들",
        subtitle: "오직 이성적인 빛의 통제와 필름 고유의 텍스처만으로 예술적 만족도를 입증한 작품집입니다.",
        content_data: {
          items: [
            { title: "고요한 앙상블: 리스본의 트램", description: "노을빛 세피아 그림자가 비치는 유럽 골목길 속 외로움을 프레임 레이아웃에 새긴 대표 에세이", image: "https://images.unsplash.com/photo-1510921229595-e4176145a8c?auto=format&fit=crop&w=600&q=80" },
            { title: "시간의 유영: 인물 초상 포트레이트", description: "인위적 플래시 조명을 배제하고 오직 창가의 자연광 조도만으로 인물의 심리를 정밀 묘사한 컷", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
            { title: "콘크리트 미학: 침묵하는 건축 구조물", description: "현대 모던 건축물의 직선과 곡선의 조형미를 극도의 가독성 높은 모노톤으로 아카이빙한 사진", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "지워지지 않을 비주얼의 첫 프레임을 새기다",
        subtitle: "하이엔드 브랜드 광고 화보 촬영 의뢰, 사진전 단독 콜라보레이션 제안, 혹은 오리지널 흑백 프린트 소장 문의는 아래 창을 통해 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  uxui_design_lab: {
    templateId: "uxui_design_lab",
    name: "퓨처리스틱 디지털 프로덕트 UX/UI 랩",
    category: "Art & Design",
    description: "하이엔드 테크 스타트업과 디지털 제품을 위한 직관적이고 세련된 디지털 프로덕트 및 UX/UI 디자인 랩 테마입니다. 미래지향적인 카본 블랙 배경 위에 찬란하게 광채를 뿜어내는 네온 시안 블루가 몰입감을 극대화합니다.",
    image: "/templates/uxui_design_lab.png",
    theme: {
      fontFamily: "Inter, Pretendard, sans-serif",
      colors: {
        primary: "#22d3ee",     // 미래형 네온 시안 블루
        secondary: "#a855f7",   // 가상현실 일렉트릭 퍼플
        accent: "#10b981",      // 데이터 성장 그린 포인트
        background: "#090d16",  // 미래지향 카본 블랙
        surface: "#111827",     // 코드 블록 테크니컬 다크 그레이 카드
        text: "#e2e8f0"         // 시인성 높은 소프트 화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "비즈니스를 확장하고 사용자 경험을 혁신하는 디지털 설계",
        subtitle: "논리적인 가설 검증과 시각적 영감을 통해 복잡한 대시보드를 명쾌하게 단순함으로 번역하고 사용자의 마음에 닿는 차세대 UI/UX 컴포넌트 시스템을 구축합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80",
          ctaText: "디자인 프로토타입 체험",
          ctaLink: "#contact",
          features: [
            { text: "사용자 실시간 동선 데이터를 분석한 초단위 마이크로 인터랙션 구현" },
            { text: "개발팀과의 완벽한 협업 및 일관된 확장을 보장하는 피그마 디자인 시스템" }
          ]
        }
      },
      {
        section_type: "services",
        title: "인텔리전트 디자인 스택",
        subtitle: "가장 현대적이고 효율적인 오픈소스 기술 파이프라인과 융합되는 디자인 설계 가이드입니다.",
        content_data: {
          items: [
            {
              title: "모바일 앱 & 웹 GUI 프로덕트 디자인",
              description: "인체 공학적 레이아웃과 트렌디한 다크모드 무드를 조율하여 비즈니스의 성장 신호를 견인하는 완성도 높은 스크린을 연출합니다.",
              icon: "MousePointer"
            },
            {
              title: "고도화된 모듈형 디자인 시스템 구축",
              description: "인라인 공정이 시스템화된 UI 가이드라인을 수립하여 개발 생산성을 비약적으로 가속화하고 프로덕트의 일관성을 유지합니다.",
              icon: "Layers"
            },
            {
              title: "인터랙티브 3D 웹 비주얼 컨설팅",
              description: "Three.js 아키텍처와 결합되는 하이테크 그래픽 에셋을 디자인하여 화면 속에서 생명력이 꿈틀거리는 인터페이스를 완성합니다.",
              icon: "Cpu"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "비즈니스 지표를 성장시키는 프로덕트 아키텍트",
        subtitle: "화려하기만 한 연출을 배제하고 오직 사용자가 증명하는 데이터의 이정표만 신뢰합니다.",
        content_data: {
          description: "안녕하세요. 하이엔드 테크 스타트업 솔루션의 핵심 본질을 꿰뚫고 이를 감각적인 비주얼로 풀어내는 디지털 프로덕트 디자이너 시안입니다. 우리는 다수의 엔터프라이즈 SaaS 대시보드 리브랜딩 프로젝트를 주도하며 시스템 한계를 극복하는 디자인 패턴을 정립해 왔습니다. 복잡성을 단순함으로 바꾸는 코딩 장인 정신의 가치를 공간과 화면에 새겨넣겠습니다.",
          stats: [
            { label: "글로벌 어워드", value: "12회" },
            { label: "누적 수강생", value: "2,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "프로덕션 레벨 아티팩트",
        subtitle: "실시간 데이터 연산과 사용자 행동 흐름을 성공적으로 리드해 낸 대표 프로젝트 갤러리입니다.",
        content_data: {
          items: [
            { title: "차세대 차세대 핀테크 자산관리 플랫폼 앱", description: "복잡한 금융 주가 지표를 유저 위젯 중심으로 간소화하여 오픈율 45%를 견인한 스마트 UI/UX", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80" },
            { title: "AI 기반 지능형 협업 툴 SaaS 대시보드", description: "모듈형 수평 그리드 시스템과 시안 블루 그라데이션 가이드를 반영한 대규모 인프라 인터페이스", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" },
            { title: "가상자산 거래소 실시간 트래킹 차트 UI", description: "초당 수만 개의 네트워크 패킷 변동을 딜레이 제로로 무결점 시각화해 낸 하이테크 그래픽 셋업", image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "혁신적인 디지털 프로덕트를 함께 빌드하세요",
        subtitle: "고성능 풀스택 웹 디자인 아웃소싱, 모바일 제품 리브랜딩 브리프 공유, 혹은 디자인 시스템 자문 의뢰는 하단에 핑을 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },
  interior_scenography: {
    templateId: "interior_scenography",
    name: "하이엔드 인테리어 시노그래피",
    category: "Art & Design",
    description: "무대 미술과 연출적 조명, 공간의 유기적인 결합을 통해 묵직한 내러티브를 전달하는 하이엔드 인테리어 디자인 스튜디오 테마입니다. 따뜻한 웜 브론즈 골드와 깊고 은은한 딥 벨벳 그린 컬러가 감각적으로 조화를 이루며 드라마틱한 몰입감을 연출합니다.",
    image: "/templates/interior_scenography.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#c2410c",     // 웜 브론즈 골드 엑센트
        secondary: "#14532d",   // 깊은 딥 벨벳 그린
        accent: "#f59e0b",      // 스포트라이트 허니 옐로우
        background: "#fffbf7",  // 포근한 오가닉 크림 화이트
        surface: "#fbf5ee",     // 아늑한 무드의 스킨 베이지 카드
        text: "#1c1917"         // 타자기 먹색 다크 브라운
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "공간이라는 한 편의 연극 위에 일상의 내러티브를 연출하다",
        subtitle: "단순한 가구와 벽면 마감재의 나열을 배제하고, 조명 조도와 시각 동선을 치밀하게 계산하여 들어서는 순간 깊은 서사적 울림을 느끼는 예술 스페이스를 아키텍처링합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무대 미술 컬렉션",
          ctaLink: "#contact",
          features: [
            { text: "빛과 어둠의 하모니를 계산한 하이엔드 시네마틱 공간 디렉션" },
            { text: "재료 본연의 숨결과 텍스처를 노출하는 독창적인 인테리어 빌드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "시노그래피 디자인 영역",
        subtitle: "공간이 가진 고유한 레이아웃을 해부하여 한 조각의 예술 오브제로 승화시키는 작업 스펙트럼입니다.",
        content_data: {
          items: [
            {
              title: "상업 및 무대 공간 토탈 연출",
              description: "브랜드가 지닌 고유한 스토리텔링과 가치를 연출적 조명과 입체 조형물의 유기적 배치를 통해 극적으로 극대화합니다.",
              icon: "Eye"
            },
            {
              title: "하이엔드 주거 시노그래피",
              description: "히든 몰딩, 라인 조명, 벨벳 그린 패브릭의 따스한 조화로 시대를 초월하는 영속적인 주거 인테리어를 시공 마감합니다.",
              icon: "Layers"
            },
            {
              title: "비주얼 비주얼 조명 컨설팅",
              description: "사계절 및 낮과 밤의 자연광 투과율을 정밀 추적하여, 감상자의 정서적 안정을 유도하는 스마트 조도 시스템을 기획합니다.",
              icon: "PenTool"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "빛과 여백으로 이야기를 직조하는 공간 아티스트",
        subtitle: "진정한 하이엔드 디자인은 화려한 치장이 아니라 가치 있는 비움에서 완성됩니다.",
        content_data: {
          description: "안녕하세요! 물성과 공간의 유기적인 조화를 바탕으로 한 편의 시 같은 주거 무대를 연출하는 시노그래퍼입니다. 저는 세상의 수많은 시각 공해 속에서 장식적 낭비를 덜어내고, 사물이 가진 본질적인 비율과 묵직한 콘크리트 질감 속에 생명력을 심어주는 일에 몰두하고 있습니다. 저의 정갈한 서재 스페이스에서 당신의 라이프스타일이 예술이 되는 기적을 경험해 보세요.",
          stats: [
            { label: "프로젝트 수", value: "50+" },
            { label: "해외 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "준공 마스터피스 저널",
        subtitle: "선과 그림자의 극대화된 대비를 통하여 가치를 증명해 낸 대표 기획 공간 기록입니다.",
        content_data: {
          items: [
            { title: "고요한 침묵: 프리미엄 티 라운지", description: "딥 벨벳 그린 컬러 칩과 웜 브론즈 조명을 매칭하여 정적 몰입감을 유도한 독창적 상업 공간", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80" },
            { title: "그리드 해체: 미니멀 펜트하우스", description: "불필요한 몰딩을 제거하고 천연 대리석과 매트 스틸 프레임으로 마감한 하이엔드 하우스 인테리어", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" },
            { title: "빛의 궤적: 모던 아키텍처 빌딩 셋업", description: "통유리 전면 도어와 실내 중정 보태니컬 식물 배치를 결합하여 자연 친화성을 극대화한 건축 빌드업", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "상상 속 청사진을 완전한 공간으로",
        subtitle: "하이엔드 단독 주택 기획, 상업 빌딩 공간 브랜딩 견적 자문, 혹은 팝업 스토어 콜라보레이션 제안은 하단 양식을 채워 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  floral_botanical_design: {
    templateId: "floral_botanical_design",
    name: "보태니컬 아트 & 플로럴 디자인 스튜디오",
    category: "Art & Design",
    description: "식물의 구조와 꽃의 유기적 선을 건축적으로 재해석하여 공간을 장식하는 보태니컬 아트 스튜디오 테마입니다. 싱그러운 보태니컬 올리브 그린 바탕과 포근한 소프트 코랄 로즈 액센트가 어우러져 식물이 지닌 자연의 생명력을 선사합니다.",
    image: "/templates/floral_botanical_design.png",
    theme: {
      fontFamily: "Pretendard, Quicksand, sans-serif",
      colors: {
        primary: "#14532d",     // 보태니컬 올리브 그린
        secondary: "#fca5a5",   // 소프트 코랄 로즈
        accent: "#8b5cf6",      // 우아한 라벤더 바이올렛 포인트
        background: "#f4f7f4",  // 눈이 편안한 민트 그린 틴트 오프화이트
        surface: "#ffffff",     // 정갈한 화이트 캔버스 카드
        text: "#1f2937"         // 슬레이트 다크 차콜
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "풀잎의 곡선과 꽃의 얼굴을 공간의 언어로 엮다",
        subtitle: "단순한 일회성 꽃꽂이 장식을 탈피하고 대지의 숨결과 사계절 생기가 유지되는 플랜테리어 시스템 아키텍처를 도입하여 일상 속에 자연주의 영감을 선물합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "그린 아카이브 가기",
          ctaLink: "#contact",
          features: [
            { text: "소비자 안심을 보증하는 친환경 유기농 식물성 식물성 큐레이션" },
            { text: "생애 가장 눈부신 순간을 완성하는 글로벌 가든 웨딩 디자인" }
          ]
        }
      },
      {
        section_type: "services",
        title: "보태니컬 크리에이티브",
        subtitle: "초록빛 영감으로 공간의 가치를 높이고 마음에 위로를 전하는 전문 플로럴 라인업입니다.",
        content_data: {
          items: [
            {
              title: "가든 웨딩 & 공간 디렉션",
              description: "신랑 신부의 비공개 스토리를 은유적인 꽃 조형물의 비례감과 라벤더 빛 스펙트럼 광원을 매칭해 한 편의 동화로 연출합니다.",
              icon: "Compass"
            },
            {
              title: "맞춤형 인하우스 플랜테리어",
              description: "실내 채광 조도와 통풍 조건 매커니즘을 정밀 정밀 분석하여, 가구와 식물이 한 몸처럼 호흡하는 친환경 홈스타일링을 완성합니다.",
              icon: "Layers"
            },
            {
              title: "프리미엄 플로럴 마스터 워크숍",
              description: "식물의 줄기를 다듬고 흙을 만지는 몰입의 침묵 속에서 일상의 번아웃을 비워내고 치유 루틴을 확립하는 클래스입니다.",
              icon: "PenTool"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자연의 다정함을 화폭에 채우는 플로럴 디렉터",
        subtitle: "식물을 돌보는 행위는 결국 나의 메마른 마음의 밭에 물을 주는 치유의 과정입니다.",
        content_data: {
          description: "안녕하세요! 회색빛 아파트 아파트 베란다를 싱그러운 숲 속 스튜디오로 리디자인하는 가든 아티스트 세이지입니다. 우리는 장식적 화려함에 가려진 식물 고유의 실루엣과 선의 미학을 복원하는 데 깊은 철학을 두고 있으며, 자연을 훼손하지 않는 지속 가능한 제로 웨이스트 조형 아트를 약속드립니다. 제 향긋한 가든에서 온전한 안식을 누려보세요.",
          stats: [
            { label: "프로젝트 수", value: "50+" },
            { label: "해외 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "잎새 사이에 피어난 기적들",
        subtitle: "식물의 자연적인 조형 미학과 꽃의 화사함을 감각적으로 매칭해 낸 대표 프로젝트 갤러리입니다.",
        content_data: {
          items: [
            { title: "비밀의 정원: 하우스 야외 웨딩", description: "올리브 그린 배경에 포근한 코랄 로즈 장미를 대량 큐레이션하여 로맨틱한 파라다이스를 연출한 총괄 디렉션", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
            { title: "성수동 플랜테리어 로스터리 카페 공간", description: "콘크리트 벽면 레이아웃 속에 대형 대나무 숲길 스페이스와 히든 라인 조명을 결합하여 깊은 공간감을 준 연출", image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80" },
            { title: "비주얼 아트 보태니컬 패키지 셋업", description: "Z세대의 감성을 자극하도록 키치하고 러블리한 파스텔 플라워 패턴을 가미해 완판을 기록한 브랜드 컬래버레이션", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "일상 속에 향긋한 초록빛 바람을 들여놓으세요",
        subtitle: "야외 결혼식 공간 브랜딩 의뢰, 대규모 기업 단체 원데이 가드닝 워크숍 신청, 혹은 정기 플라워 배송 제휴는 하단 양식으로 제안해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  glass_blowing_studio: {
    templateId: "glass_blowing_studio",
    name: "글래스모피즘 수제 유리 공예 아틀리에",
    category: "Art & Design",
    description: "뜨거운 열과 중력, 그리고 장인의 호흡을 조율하여 차가운 유리 조형물을 빚어내는 유리 공예 공방 테마입니다. 신비롭고 투명한 글래스모피즘 시안 블루 배경 위에 가마 속 불꽃을 닮은 웜 앰버 글로우 포인트가 조화를 이룹니다.",
    image: "/templates/glass_blowing_studio.png",
    theme: {
      fontFamily: "Inter, Montserrat, sans-serif",
      colors: {
        primary: "#22d3ee",     // 투명한 네온 시안 블루
        secondary: "#f59e0b",   // 가마 불꽃 웜 앰버 글로우
        accent: "#8b5cf6",      // 미래지향적 일렉트릭 바이올렛
        background: "#090d16",  // 미래형 카본 다크 그레이 블랙 배경
        surface: "#1e1b4b",     // 깊이감 있는 하이테크 인디고 카드
        text: "#f8fafc"         // 광채가 느껴지는 밝은 오프화이트
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "찰나의 흐름 속에서 유리의 투명한 숨결을 포착하다",
        subtitle: "1200도 고온 가마 속에서 붉게 타오르는 유리 액체를 물레 위 수작업 블로잉 공정으로 제어하여, 빛의 굴절률과 두께의 비례감이 완벽한 유리 오브제를 창조합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "유리 오브제 감상",
          ctaLink: "#contact",
          features: [
            { text: "빛의 각도에 따라 무지갯빛 스펙트럼 광원을 뿜어내는 정교한 세공" },
            { text: "기계 공산품이 결코 모사할 수 없는 손자국 질감의 정직한 일그러짐" }
          ]
        }
      },
      {
        section_type: "services",
        title: "글래스 엔지니어링",
        subtitle: "뜨거운 불꽃과 장인 정신의 수고로움 속에서 투명한 아름다움을 빚어내는 핵심 영역입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 블로잉 화기 & 세라믹",
              description: "파이프 끝의 미세 숨결 압력을 정밀 제어하여, 꽃 한 송이만으로 시각적 오브제가 되는 백자빛 투명 유리병을 제작합니다.",
              icon: "Palette"
            },
            {
              title: "글래스모피즘 인테리어 조명",
              description: "빛의 굴절과 그림자의 선을 추적 설계하여, 실내 주방과 거실 공간 전체에 아늑한 카푸치노 온기를 선사하는 펜던트 기구를 만듭니다.",
              icon: "Layers"
            },
            {
              title: "아날로그 유리 공방 클래스",
              description: "일상의 소음을 비워내고 녹아내리는 유리의 유기적인 움직임에 몰입하며 나만의 취향 그릇을 직조해 나가는 리추얼 워크숍입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "불꽃과 숨결로 좌표 시스템을 새기는 아티산",
        subtitle: "형태가 굳어지기 전 그 짧은 찰나의 순간에 유리의 영혼이 결정됩니다.",
        content_data: {
          description: "안녕하세요. 붉은 가마 불꽃 뒤에서 투명한 유리의 파형을 설계하는 수제 공예가 앰버입니다. 저는 디지털 픽셀의 차가움 대신, 1200도 고온 속에서 재료와 내가 한 몸처럼 반응하는 정직한 아날로그 공정에 깊은 정체성을 두고 있습니다. 화려하게 조작된 가짜 마케팅 문구를 지워내고, 오직 빛의 투과율과 물성 본연의 텍스처만으로 당신의 옷장과 서재에 영원히 영감의 파도를 전하겠습니다.",
          stats: [
            { label: "프로젝트 수", value: "50+" },
            { label: "해외 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "가마에서 갓 인화된 크리스탈",
        subtitle: "수많은 기계식 정밀 내구성 테스트를 무결점 통과해 높은 평점 만족도를 영구 갱신 중인 대표작입니다.",
        content_data: {
          items: [
            { title: "스펙트럼 굴절 오리지널 달항아리 유리 화기", description: "조선 백자의 우아한 비례를 투명 크리스탈 자재로 리디자인해 극찬을 받은 하이엔드 오브제", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80" },
            { title: "웜 앰버 글로우 가스켓 무드 조명 세트", description: "은은한 노을빛 광원과 시안 블루 그라데이션 가이드 래커를 매칭해 안정을 주는 수제 조명", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80" },
            { title: "비움의 미학: 무광 샌딩 글래스 보틀", description: "유리 표면을 미세 마찰 샌딩 가공해 눈이 편안한 반투명 우유 빛깔 텍스처를 구현한 화병", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "투명한 예술적 자산을 귀사의 비즈니스에",
        subtitle: "카페 브랜드 커스텀 유리 식기 대량 B2B 독점 공급 계약 자문, 호텔 라운지 거대 조형물 위탁 시공, 혹은 공방 워크숍 제휴는 아래로 연락해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  independent_cinema_studio: {
    templateId: "independent_cinema_studio",
    name: "독립 시네마토그래피 필름 아카이브",
    category: "Art & Design",
    description: "독자적인 시선과 장인 정신으로 인간의 심연을 탐구하는 영화 감독 및 비디오 비주얼 프로덕션을 위한 테마입니다. 21:9 시네마 와이드스크린 블랙 배경과 시선을 집중시키는 스포트라이트 앰버 옐로우 포인트가 한 편의 영화를 감상하는 극장식 포트폴리오를 구성합니다.",
    image: "/templates/independent_cinema_studio.png",
    theme: {
      fontFamily: "Montserrat, Noto Serif KR, sans-serif",
      colors: {
        primary: "#f59e0b",     // 스포트라이트 앰버 옐로우
        secondary: "#fbbf24",   // 찬란한 시네마 앰버 골드
        accent: "#dc2626",      // 긴장감을 자극하는 필름 레드
        background: "#07080b",  // 시네마 와이드스크린 블랙
        surface: "#171921",     // 필름 슬레이트 그레이 카드
        text: "#f3f4f6"         // 시인성이 확보된 밝은 화이트 그레이
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "프레임 속 어둠을 헤집고 인간의 본질을 촬영하다",
        subtitle: "자극적인 숏폼의 소음을 과감히 비워내고, 감각적인 컷 전환, 정교한 4K 컬러 그레이딩, 깊은 침묵의 사운드 엔지니어링을 통해 영원히 회고될 독립 영상의 신세계를 직조합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "시네마 쇼릴 상영",
          ctaLink: "#contact",
          features: [
            { text: "국내외 공인 독립 영화제 평론가 극찬 스코어링 총괄 디렉션" },
            { text: "브랜드 철학과 역사적 인문학 서사를 압축해 낸 하이엔드 무비 컷" }
          ]
        }
      },
      {
        section_type: "services",
        title: "시네마토그래피 스택",
        subtitle: "단 한 컷의 타이밍만으로 사용자의 감정선을 완벽 터치하는 영상 마스터 빌드 라인업입니다.",
        content_data: {
          items: [
            {
              title: "독립 단편 영화 기획 및 프로덕션",
              description: "인간의 입체적인 심리 묘사를 위해 스토리보드 구성부터 시네마 카메라 로케이션 촬영, 최종 편집 마스터링까지 원스톱 책임집니다.",
              icon: "Video"
            },
            {
              title: "시네마틱 브랜드 필름 연출",
              description: "기업의 가치를 예술 화보처럼 카메라 렌즈 너머로 포착하고 다빈치 디졸브 컬러 그레이딩 시스템을 적용해 할리우드 색감을 처방합니다.",
              icon: "Eye"
            },
            {
              title: "오디오 사운드 주파수 믹싱",
              description: "영상 속 긴장감과 몰입도를 극대화하도록 정밀 마이크로 효과음(Foley)과 웅장한 오케스트라 스코어를 입체 엔지니어링합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "필름 위에 내러티브를 각인하는 차콜 감독",
        subtitle: "화려하기만 한 이펙트 뒤에 숨겨진 인간의 정직한 눈빛 하나가 백 마디 말보다 거대한 울림을 줍니다.",
        content_data: {
          description: "안녕하세요. 컴퓨터 쉘 창처럼 어두운 원고지 위에서 소리와 빛을 믹싱하여 마법 같은 시간을 인화해 내는 독립 영화 감독 앰버입니다. 저는 유행에 따라 쉽게 쓰고 버려질 인스턴트 비디오를 배제하며, 사색의 시간과 시간의 기다림이 이뤄내는 밀도 높은 순수 영상 예술만을 고집합니다. 제 21:9 프레임 서재에 머무시는 동안, 마음을 터치하는 시네마틱 무드를 온전히 누려보시길 바랍니다.",
          stats: [
            { label: "프로젝트 수", value: "50+" },
            { label: "해외 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "상영 중인 룸 갤러리",
        subtitle: "메시지 전달과 예술 본연의 가치 구현을 무결점 통과시킨 시그니처 영상 아카이브입니다.",
        content_data: {
          items: [
            { title: "공각의 잔상: 다큐멘터리 필름 리포트", description: "도시의 화려한 네온 소음 속 인간의 외로움을 슬로우 무브먼트로 큐레이션한 베스트 쇼릴 영상", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 자동차 테크 런칭 하이테크 CF", description: "기계 메탈릭 질감과 속도감을 다이내믹 컷 편집 기술과 3D 모션 그래픽으로 구현해 낸 커머셜 필름", image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80" },
            { title: "심야 서재 인디 밴드 뮤직비디오", description: "바랜 크림 종이 질감 배경과 노을빛 앰버 골드 조도를 조율해 곡의 처연함을 시각화한 비주얼 뮤직비디오", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "시선을 사로잡는 마법 같은 협업의 첫 프레임",
        subtitle: "신규 무비 스토리보드 외주 의뢰, 고품격 광고 영상 제작 파트너십 브리프 제안, 혹은 시네마틱 기고문 의뢰는 하단 양식으로 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  },

  interactive_media_lab: {
    templateId: "interactive_media_lab",
    name: "인텔리전트 제너레이티브 미디어 설치 예술 랩",
    category: "Art & Design",
    description: "실시간 센서 인터랙션, 코딩 아트 및 관객 참여형 디지털 설치 예술을 연구하는 미래형 미디어 랩 테마입니다. 테크 중심의 일렉트릭 다크 바이올렛 배경 위에 홀로그래픽 네온 블루 글자가 광채를 내며 지적 몰입감을 가속화합니다.",
    image: "/templates/interactive_media_lab.png",
    theme: {
      fontFamily: "Fira Code, Inter, sans-serif",
      colors: {
        primary: "#06b6d4",     // 홀로그래픽 네온 블루
        secondary: "#c084fc",   // 사이버 바이올렛 퍼플 표면
        accent: "#ec4899",      // 데이터 가속 레이저 네온 핑크
        background: "#04020d",  // 하이테크 일렉트릭 다크 바이올렛
        surface: "#110c26",     // 관제 쉘 터미널 무드의 다크 카드
        text: "#38bdf8"         // 라이트 시안 블루 모니터 글자색
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "코드를 통해 시각 예술에 물리적 생명력을 연산하다",
        subtitle: "관객의 심박 변화와 움직임 동선 빅데이터를 센서 인터페이스가 실시간 스크리닝 추적하여, 3D 그래픽 파형과 홀로그래픽 입체 비주얼로 무결점 표현하는 차세대 미디어 스페이스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "미디어 매트릭스 실행",
          ctaLink: "#contact",
          features: [
            { text: "Three.js 및 언리얼 엔진 기반 하드웨어 가속 실시간 융합 렌더링 기술" },
            { text: "해킹 공격을 원천 암호화 차단하는 엔터프라이즈 제로 트러스트 보안 방화벽 데이터 인프라" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디지털 디멘션 엔진",
        subtitle: "상상 속에만 존재하던 초현실 비주얼을 하드웨어 연산으로 무결점 구체화하는 하이테크 스튜디오 스택입니다.",
        content_data: {
          items: [
            {
              title: "관객 참여형 실시간 프로젝션 맵핑",
              description: "미술관 벽면이나 거대 건축물 외벽 대지에 레이트레이싱 기술을 투사하고, 관객 반응에 동기화되어 유기적으로 요동치는 코딩 아트를 작화합니다.",
              icon: "Cpu"
            },
            {
              title: "스파셜 입체 오디오 주파수 설계",
              description: "돌비 애트모스 시스템 가이드라인을 통과한 분산 사운드 제어로 관객이 소리의 중심에 서 있는 듯한 다차원 음향을 엔지니어링합니다.",
              icon: "Layers"
            },
            {
              title: "VR/AR 가상 현실 인터랙션 개발",
              description: "웨어러블 디바이스 및 웹 환경에서 프레임 드랍 없이 심리스 구동되는 모듈형 디지털 시티 가상 전시 공간 아키텍처를 빌드합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "픽셀에 부피를 부여하는 미디어 아키텍트",
        subtitle: "가상과 현실의 경계가 무너지는 그 찰나의 몰입 속에서 인간 지성의 미래를 봅니다.",
        content_data: {
          description: "안녕하세요. 컴퓨터 터미널 뒤에서 무한한 3차원 공간의 좌표 시스템을 찍어나가는 크리에이티브 미디어 엔지니어 겸 디지털 아티스트입니다. 우리는 자극적인 가짜 정보와 복잡한 배선 노이즈를 원천 히든 처리하고, 오직 데이터가 입증하는 지능형 인공지능 알고리즘을 설계 기저에 두어 감상자가 압도적인 청각적, 시각적 카타르시스를 느끼는 전시를 마스터 디렉팅해 오고 있습니다.",
          stats: [
            { label: "프로젝트 수", value: "50+" },
            { label: "해외 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "배포된 가상 아티팩트",
        subtitle: "실시간 연산 성능과 호환성 테스트를 완벽 통과하여 글로벌 갤러리에 소장된 대표작입니다.",
        content_data: {
          items: [
            { title: "공간의 메아리: 센서 동기화 프로젝션", description: "1,600만 펄스 네온 핑크와 시안 블루 그라데이션 광원을 통해 인간의 뇌파 변화를 무결점 시각화한 미디어 설치 아트", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
            { title: "디지털 아우라의 미래: VR 오디세이", description: "양자 암호화 분산 가이드 기술을 연동해 해킹 사고 우려를 제로로 묶은 가상 현실 헤드셋 전용 인터랙티브 월드", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80" },
            { title: "스마트 스마트 시티 매핑: 데이터 시각화", description: "도심 속 실시간 트래픽 패킷 변동을 딜레이 제로로 캔버스에 큐레이션하여 호평을 받은 초대형 미디어 파사드", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "성공적인 디지털 이노베이션을 향해",
        subtitle: "지능형 미디어 파사드 외주 수탁 의뢰, 전시회 팝업 공간 브랜딩 테크 자문, 국책 과제 융합 예술 협업 파트너십 문의는 아래 터미널로 핑을 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프로젝트 제안하기"
        }
      }
    ]
  }
};
