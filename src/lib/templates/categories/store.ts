import { TemplateConfig } from "../registry";

export const STORE_TEMPLATES: Record<string, TemplateConfig> = {
  fashion_modern_store: {
    templateId: "fashion_modern_store",
    name: "모던 미니멀 디자이너 패션 숍",
    category: "Store",
    description: "시대를 초월하는 우아함과 직선의 세련미를 반영한 현대적인 디자이너 편집숍 테마입니다. 시크한 모노크롬의 차분함 속에 빛나는 골드 엑센트를 조화롭게 구성하여 하이엔드 브랜드의 정체성을 한층 높여줍니다.",
    image: "/templates/fashion_modern_store.png",
    theme: {
      fontFamily: "Inter, sans-serif",
      colors: {
        primary: "#111827",     // 시크한 매트 블랙
        secondary: "#6b7280",   // 모던 슬레이트 그레이
        accent: "#d97706",      // 하이엔드 골드 브라운 엑센트
        background: "#fafafa",  // 정갈한 미술관 벽면 같은 오프화이트
        surface: "#ffffff",     // 깨끗한 화이트 서페이스
        text: "#1a1a1a"         // 완벽한 가독성을 제공하는 다크 차콜
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "단순함 속에서 직조해 낸 완벽한 실루엣",
        subtitle: "트렌드를 넘어 고유한 아이덴티티를 확립하는 디자이너 브랜드의 뉴 시즌 컬렉션입니다. 엄선된 텍스처와 형태의 미학을 경험하세요.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "컬렉션 쇼핑하기",
          ctaLink: "#contact",
          features: [
            { text: "천연 패브릭과 하이엔드 테일러링이 선사하는 가치" },
            { text: "전 제품 한정 수량 제작으로 컬렉터의 희소성 보장" }
          ]
        }
      },
      {
        section_type: "services",
        title: "시그니처 디렉토리",
        subtitle: "당신의 일상에 특별한 영감을 불어넣을 고품격 가치 중심 카테고리 라인업입니다.",
        content_data: {
          items: [
            {
              title: "레디 투 웨어 에디션",
              description: "인체 공학적 패턴 설계와 매트한 무채색 계열의 자재를 조합하여 매일 편안하면서도 압도적인 시크함을 완성하는 의류 라인입니다.",
              icon: "ShoppingBag"
            },
            {
              title: "레더 메탈 악세서리",
              description: "이탈리아 베지터블 천연 가죽과 골드 링크 엑센트가 정교하게 조화를 이루어 공간과 착장에서 시선을 사로잡는 마스터피스 소품입니다.",
              icon: "Sparkles"
            },
            {
              title: "에센셜 캡슐 컬렉션",
              description: "불필요한 디테일을 전면 제거하고 오직 실루엣과 직선의 미학에만 집중하여 유행을 타지 않는 영속적인 베이직 아이템 모음입니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "형태와 본질을 탐구하는 아티산 정신",
        subtitle: "우리는 옷을 파는 것을 넘어 사람의 내면을 표현하는 침묵의 언어를 빚어냅니다.",
        content_data: {
          description: "안녕하세요. 모던 디자이너 스튜디오의 크리에이티브 디렉터입니다. 세상의 수많은 시각적 소음 속에서 장식적 요소를 과감하게 비워내고, 사물이 가진 본질적인 형태와 완벽한 비례감에 깊이 몰두하고 있습니다. 엄선된 하이엔드 원사와 숙련된 장인의 손끝에서 탄생한 당사의 프로덕트들은 당신의 옷장 속에서 시대를 초월하는 영속적인 작품으로 존재할 것입니다.",
          stats: [
            { label: "누적 VIP 회원수", value: "32,000+" },
            { label: "함께하는 장인 아틀리에", value: "45+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "이달의 익스클루시브 에셋",
        subtitle: "독자적인 감각과 정교한 마감 공정으로 높은 소장 가치를 지닌 인기 프로덕트입니다.",
        content_data: {
          items: [
            { title: "미니멀리스트 울 블렌드 매트 코트", description: "라인 공정이 히든 처리되어 완벽한 수평 그리드를 구현한 롱 코트 / 485,000원", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80" },
            { title: "아방가르드 릴렉스드 핏 리넨 셔츠", description: "천연 리넨의 자연스러운 구김과 스톤 그레이 무드가 조화를 이룬 시그니처 셔츠 / 185,000원", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
            { title: "골드 클래스프 카프스킨 숄더 백", description: "매트 블랙 무결점 천연 가죽 위에 은은한 미드톤 골드 잠금장치로 마감한 스퀘어 백 / 620,000원", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프라이빗 프레임 숍 입점 및 구매 제휴 문의",
        subtitle: "브랜드 컬래버레이션 브리프 제안, 대량 주문 단가 조율, 혹은 맞춤형 커스텀 테일러링 예약은 아래 채널을 채워 신호를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "입점/구매/제휴 문의하기"
        }
      }
    ]
  },

  organic_beauty_store: {
    templateId: "organic_beauty_store",
    name: "에코 세이지 클린 뷰티숍",
    category: "Store",
    description: "비건 화장품과 친환경 라이프스타일 브랜드를 위한 내추럴 오가닉 스토어 테마입니다. 깊은 숲을 닮은 에코 세이지 그린과 포근한 웜 크림 베이스가 식물의 싱그러운 에너지를 온전히 전합니다.",
    image: "/templates/organic_beauty_store.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#2d4a36",     // 에코 세이지 그린
        secondary: "#769e35",   // 싱그러운 민트 초록
        accent: "#d4a373",      // 따뜻한 오가닉 베이지
        background: "#f4f7f4",  // 편안한 그린 틴트 오프화이트
        surface: "#ffffff",     // 깨끗한 컨테이너 화이트
        text: "#1c2e24"         // 다크 올리브 브라운
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "피부 본연의 숨결을 깨우는 순수 식물성 오가닉 테라피",
        subtitle: "인위적인 화학 방부제와 독성 성분을 과감히 덜어내고, 유기농 제철 허브 추출물 본연의 치유력으로 맑고 투명한 피부 광채를 선사하는 클린 비전입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=1200&q=80",
          ctaText: "비건 비전 탐색",
          ctaLink: "#contact",
          features: [
            { text: "프랑스 에코서트 유기농 인증 식물성 성분 100% 배합" },
            { text: "지구를 지키는 생분해성 용기 및 콩기름 인쇄 패키지 전면 도입" }
          ]
        }
      },
      {
        section_type: "services",
        title: "그린 에코 랩",
        subtitle: "지구 환경을 보호하고 당신의 피부 장벽을 단단하게 복원하는 오가닉 라인업입니다.",
        content_data: {
          items: [
            {
              title: "보태니컬 스킨 수딩 젤",
              description: "피부 과습을 막고 풍부한 수분막을 형성하는 세이지 잎 추출물 기반의 촉촉한 저자극 기초 토너 및 수분 크림 에센스 라인입니다.",
              icon: "Heart"
            },
            {
              title: "비건 고영양 앰플 세럼",
              description: "천연 항산화 원료인 유기농 오일을 급속 추출 배합하여 느리지만 건강하게 피부 노화 방지를 리드하는 고농축 영양 오일입니다.",
              icon: "Sparkles"
            },
            {
              title: "제로 웨이스트 리추얼 바",
              description: "정제수를 줄이고 자연 유래 에센셜 수로 가득 채워 세안 후에도 당김 없는 온전한 휴식을 선사하는 핸드메이드 약산성 고체 뷰티 바입니다.",
              icon: "ShoppingBag"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자연의 정직함을 연구하는 세이지 크루",
        subtitle: "피부를 돌보는 행위는 결국 내 마음의 밭을 다정하게 돌보는 일과 같습니다.",
        content_data: {
          description: "안녕하세요! 지치고 삭막한 콘크리트 도심 일상 속에서 식물이 건네는 맑은 에너지를 투명하게 병에 담아내는 클린 뷰티 크리에이터 세이지입니다. 우리는 동물을 해치지 않는 완전한 비건 포뮬러만을 고집하며, 피부 과학적 임상 데이터와 오가닉 허브의 자연적 순리를 결합하여 민감성 피부도 안심하고 숨 쉴 수 있는 정직한 뷰티 생태계를 가꾸어 나가고 있습니다.",
          stats: [
            { label: "함께 숨 쉬는 식집사 독자", value: "65,000+" },
            { label: "원료 성분 천연 인증률", value: "100%" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "이달의 내추럴 오가닉 픽",
        subtitle: "사계절 생기와 평온함을 선사하여 수많은 식집사 독자들의 찬사를 얻은 시그니처 아이템입니다.",
        content_data: {
          items: [
            { title: "에코 세이지 하이드레이팅 세럼", description: "예민해진 피부 장벽을 편안하게 진정시키는 유기농 허브 수분 앰플 50ml / 38,000원", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80" },
            { title: "비건 카밍 로즈 히프 훼이셜 오일", description: "자연에서 온 비타민 유효 성분으로 피부에 투명한 수분 윤기를 공급하는 오일 30ml / 45,000원", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
            { title: "제로 클레이 티트리 딥 클렌징 바", description: "모공 속 노폐물을 자극 없이 무결점으로 흡착 세안하는 생분해 약산성 클렌저 100g / 18,000원", image: "https://images.unsplash.com/photo-1607006342456-ba275cd3475f?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "초록빛 위로를 당신의 비즈니스에 들여놓으세요",
        subtitle: "오프라인 드럭스토어 입점 제안, 친환경 친환경 패키징 대량 커스텀 발주, 혹은 소셜 벤처 컬래버레이션은 하단에 다정하게 연락처를 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "입점/구매/제휴 문의하기"
        }
      }
    ]
  },

  gourmet_bakery_store: {
    templateId: "gourmet_bakery_store",
    name: "웜 베이지 수제 베이커리숍",
    category: "Store",
    description: "매일 아침 온 정성을 다해 구워내는 유기농 천연 발효 빵과 스페셜티 커피를 위한 포근한 감성 테마입니다. 부드러운 버터빛 웜 베이지와 묵직한 리치 코코아 브라운의 조화가 매장 가득 퍼지는 구수한 오븐 향기를 연출합니다.",
    image: "/templates/gourmet_bakery_store.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4a2c11",     // 리치 코코아 브라운
        secondary: "#b45309",   // 잘 구워진 오렌지 브라운
        accent: "#d97706",      // 허니 골드 엑센트
        background: "#fffbf5",  // 포근한 버터 크림 오프화이트
        surface: "#fbf3e6",     // 앤티크 웜 크림 서페이스
        text: "#3c2f2f"         // 따뜻한 원두 빛 브라운 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오븐 속에서 구워지는 따뜻한 주방의 행복",
        subtitle: "화학 첨가물과 인공 이스트를 전면 배제하고, 장인이 직접 배양한 천연 호밀 발효종을 사용하여 매일 새벽 정직하게 밀어내는 겉바속촉 수제 오가닉 테이블입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘의 빵 라인업",
          ctaLink: "#contact",
          features: [
            { text: "72시간 저온 숙성 공정으로 속이 편안하고 구수한 유기농 천연 발효 빵" },
            { text: "AOP 인증 프랑스 최고급 고메 버터와 사계절 제철 식재료 본연의 풍미" }
          ]
        }
      },
      {
        section_type: "services",
        title: "웜 키친 아카이브",
        subtitle: "당신의 아침 식탁을 건강하고 향긋하게 채워줄 시그니처 메뉴 셀렉션입니다.",
        content_data: {
          items: [
            {
              title: "아티산 사워도우 & 깜파뉴",
              description: "호밀 천연 발효종 고유의 그윽한 산미와 묵직한 크러스트의 바삭함이 어우러져 씹을수록 고소함이 터지는 식사 대용 전문 빵입니다.",
              icon: "Cookie"
            },
            {
              title: "페이스트리 & 시그니처 케이크",
              description: "겹겹이 살아 숨 쉬는 크루아상의 바삭한 결, 신선한 동물성 유크림과 유기농 설탕만으로 달콤한 온기를 빚어낸 프리미엄 디저트입니다.",
              icon: "Sparkles"
            },
            {
              title: "스페셜티 바리스타 드립 커피",
              description: "원두 분쇄도와 물 온도의 황금 비율을 계산하여 드립한 싱글 오리진 커피로, 달콤한 빵의 미식을 한층 더 부드럽게 감싸 안아줍니다.",
              icon: "ShoppingBag"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "주방의 소리 속에서 진심을 빚는 마스터 베이커",
        subtitle: "음식이 주는 온기가 우리 일상을 치유한다고 굳건히 신뢰합니다.",
        content_data: {
          description: "안녕하세요! 지글지글 오븐 굽는 소리와 달콤한 카푸치노 스팀 소리에서 삶의 진짜 낭만을 포착하는 수제 베이커리숍 대표 웜바리스타입니다. 우리는 거창하고 기교적인 화려함 대신 매일 우리 가족의 식탁 위에 올릴 수 있는 건강하고 정직한 밀가루 반죽만을 고집합니다. 물과 소금, 그리고 시간의 기다림이 만들어내는 정직한 미식을 여러분의 편안한 메일함과 식탁으로 전달하겠습니다.",
          stats: [
            { label: "월간 단골 독자 평점", value: "4.9 / 5.0" },
            { label: "공개된 마스터 레시피", value: "150개+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "오늘 새벽 구워낸 명작들",
        subtitle: "오전 중 전량 매진을 기록하는 수제 베이커리숍의 가장 사랑받는 대표 오리지널 아카이브입니다.",
        content_data: {
          items: [
            { title: "72시간 숙성 천연 호밀 사워도우", description: "맷돌로 제분한 유기농 통밀의 구수한 풍미가 가득한 정통 식사 빵 / 9,500원", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80" },
            { title: "프리미엄 레스큐어 버터 크루아상", description: "프랑스 최고급 버터의 풍부한 육즙 향과 겹겹이 바삭한 페이스트리의 결 / 4,800원", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80" },
            { title: "사계절 생딸기 오가닉 마스카포네 케이크", description: "인공 보존제 없이 100% 순수 우유 생크림과 제철 생딸기를 가득 채운 프리미엄 디저트 / 42,000원", image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "향긋한 온기를 배달해 드립니다",
        subtitle: "카페 원두 및 베이커리 생지 정기 납품 단가 조율, 기업 프라이빗 케이터링 단체 주문, 혹은 쿠킹 클래스 대관 제안은 아래를 채워 서신을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "입점/구매/제휴 문의하기"
        }
      }
    ]
  },

  smart_gadget_store: {
    templateId: "smart_gadget_store",
    name: "하이테크 일렉트릭 가젯 랩",
    category: "Store",
    description: "최신 스마트 워치, 고성능 웨어러블 디바이스, 하이테크 인프라 하드웨어를 취급하는 미래지향적 편집숍 테마입니다. 슬릭한 다크 모드 카본 블랙 배경 위에 형광 시안 블루 액센트가 배치되어 압도적인 몰입감을 제공합니다.",
    image: "/templates/smart_gadget_store.png",
    theme: {
      fontFamily: "Montserrat, sans-serif",
      colors: {
        primary: "#22d3ee",     // 형광 일렉트릭 시안 블루
        secondary: "#a855f7",   // 가상현실 사이버 퍼플
        accent: "#f43f5e",      // 경고창 레이저 핑크
        background: "#090d16",  // 다크 카본 슬레이트 블랙
        surface: "#111827",     // 코드 블록 테크니컬 다크 그레이 카드
        text: "#f8fafc"         // 광채가 느껴지는 라이트 화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "스펙 시트를 넘어 하드웨어 퍼포먼스를 마스터하라",
        subtitle: "마케팅의 거품을 원천 제거하고 숫자가 입증하는 하이테크 가젯 시스템! 얼리어답터 디렉터가 극한의 벤치마크 툴로 검증한 프로덕트 라인업을 공개합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "테스트 룸 입장",
          ctaLink: "#contact",
          features: [
            { text: "광고 협찬 배제, 철저한 내돈내산 하이테크 하드웨어 장단점 분석" },
            { text: "초단위 인터랙션 최적화 및 4K 스트리밍 가속 기기 코어 라인업" }
          ]
        }
      },
      {
        section_type: "services",
        title: "가젯 테스트 매트릭스",
        subtitle: "스마트 컨슈머 엔지니어들을 위해 정교하게 엄선된 차세대 디바이스 허브입니다.",
        content_data: {
          items: [
            {
              title: "차세대 차세대 모바일 기어",
              description: "최신 플래그십 프로세서 AP 스로틀링을 정밀 측정하고 실사용 전력 효율과 카메라 센서 한계점을 돌파하는 하드웨어를 보급합니다.",
              icon: "Cpu"
            },
            {
              title: "데스크테리어 하이테크 인프라",
              description: "작업 효율을 극한으로 가속화하는 고주사율 모니터 셋업, 무선 고성능 질화갈륨 충전 시스템 및 미니멀 기계식 커스텀 키보드를 취급합니다.",
              icon: "Layers"
            },
            {
              title: "퓨처 웨어러블 바이오 스페이스",
              description: "심폐 지구력과 생체 신호를 실시간 정밀 추적하고 액티브 라이프스타일에 방화벽을 세워줄 지능형 웨어러블 디바이스 세트입니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "터미널 콘솔 뒤에서 가치를 해부하는 칩 아키텍트",
        subtitle: "모든 기계식 복잡성 뒤에는 명쾌하고 정직한 숫자의 솔루션이 존재합니다.",
        content_data: {
          description: "안녕하세요. 전자공학 연구소 아키텍처 출신의 하이테크 가젯 랩 대표 디렉터 사이언입니다. 우리는 자극적인 마케팅 문구에 속아 후회하는 얼리어답터가 발생하지 않도록 오직 직접 구동한 벤치마크 툴 데이터와 가혹한 극한 테스트 피드백만을 바탕으로 선별된 하드웨어 편집숍을 운영하고 있습니다. 소리가 파형을 바꾸고 코드가 웹 규격을 바꾸듯 당신의 작업 공간을 바꿀 테크니컬 무기를 만나보세요.",
          stats: [
            { label: "실시간 하드웨어 벤치마크", value: "620회 이상" },
            { label: "연구소 전담 테크 마스터", value: "15명 상주" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "프로덕션 레벨 고성능 리포트",
        subtitle: "엔지니어 크루들이 전력 최적화 및 구동 호환성 테스트를 무결점으로 통과시킨 시그니처 가젯입니다.",
        content_data: {
          items: [
            { title: "GaN 140W 멀티 고성능 초고속 충전기", description: "질화갈륨 신소재 칩 탑재로 발열을 제어하고 3개 기기 동시 풀스택 가속 충전 / 89,000원", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80" },
            { title: "바이탈 사이언 테크 크로노 스마트 워치", description: "산소포화도 및 가혹 조건 유기적 방수 기능을 지원하는 티타늄 프레임 웨어러블 / 345,000원", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80" },
            { title: "커스텀 기계식 가스켓 마운트 키보드", description: "알루미늄 아키텍처 바디와 공장 윤활 처리된 저소음 선명한 리니어 축 키보드 / 210,000원", image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "사이버네틱 비즈니스 제휴 제안",
        subtitle: "하드웨어 대량 비공개 B2B 발주 조율, 유수 IT 기업 사무 인프라 토탈 셋업 컨설팅, 혹은 테크니컬 하이테크 외주 제휴 문의는 아래 쉘 창을 채워 핑을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "입점/구매/제휴 문의하기"
        }
      }
    ]
  },

  pet_cozy_store: {
    templateId: "pet_cozy_store",
    name: "해피 펫 컴패니언 감성 반려용품숍",
    category: "Store",
    description: "반려동물의 건강한 삶을 위한 프리미엄 수제 사료, 친환경 의류 및 감성 용품 편집숍 테마입니다. 긍정적인 에너지를 채워주는 부드러운 해피 옐로우와 차분한 소프트 그레이가 다정하고 사랑스러운 패밀리 무드를 완성합니다.",
    image: "/templates/pet_cozy_store.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#ea580c",     // 따뜻한 오렌지 텍스트 포인트
        secondary: "#fef9c3",   // 소프트 파스텔 옐로우 표면
        accent: "#f43f5e",      // 사랑스러운 하트 핑크 엑센트
        background: "#f8fafc",  // 눈이 편안한 소프트 그레이 오프화이트
        surface: "#ffffff",     // 부드러운 라운딩의 화이트 캔버스
        text: "#451a03"         // 친근하면서도 명확한 딥 브라운 폰트
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "사랑하는 우리 아이와 동행하는 가장 다정한 발걸음",
        subtitle: "강아지와 고양이의 카밍 시그널 행동학을 깊이 이해하고, 소아과 수의사 자문 기반의 유기농 영양 설계를 반영하여 평생 가족의 행복한 라이프사이클을 서포트합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "러브 홈레터 보러가기",
          ctaLink: "#contact",
          features: [
            { text: "인공 보존제 및 알레르기 유발 밀가루 원료를 원천 배제한 100% 휴먼그레이드 간식" },
            { text: "민감성 피부를 가진 댕냥이들을 위한 천연 오가닉 코튼 리커버리 의류" }
          ]
        }
      },
      {
        section_type: "services",
        title: "해피 펫 패밀리 케어",
        subtitle: "반려동물이 말을 건네듯 몸과 마음을 온전히 안아주는 감성 용품 라인업입니다.",
        content_data: {
          items: [
            {
              title: "오가닉 펫 뉴트리션 수제 식단",
              description: "신선한 무항생제 연어와 제철 야채를 계량 오븐 찜기로 조리하여 풍부한 아미노산과 소화 흡수율을 보장하는 자연 화식 사료 시리즈입니다.",
              icon: "Heart"
            },
            {
              title: "내추럴 홈 오가닉 인테리어 방석",
              description: "아이들의 관절 무리를 예방하는 메모리폼 코어 아키텍처와 분리 세탁이 간편해 위생적인 파스텔 옐로우 감성 펫 배드 서페이스입니다.",
              icon: "ShoppingBag"
            },
            {
              title: "교감형 긍정 강화 트레이닝 토이",
              description: "분리불안 완화와 창의적 인지 감각 발달을 위해 유기농 천연 유해성분 제로 패브릭으로 특수 제작된 바스락 노즈워크 장난감 세트입니다.",
              icon: "Smile"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "반려동물의 시선으로 동행하는 해피 맘",
        subtitle: "우리 아이들의 작은 미소가 우리 가정을 가장 행복한 파스텔 빛으로 가득 채워줍니다.",
        content_data: {
          description: "안녕하세요! 세 마리의 다정한 삼남매 댕냥이들과 독박 육아 같은 전쟁 속에서 감동의 하루하루를 아카이빙하고 있는 반려생활 크리에이터 해피 맘입니다. 처음 아이를 입양했을 때의 막막함을 너무나 잘 알기에 전국의 초보 반려인들이 이웃집처럼 친근하게 소통하며 수의학적 올바른 상식을 공유할 수 있도록 다정한 스페이스를 구축했습니다. 아이들의 눈높이에서 가장 깨끗하고 올바른 상식만 약속드립니다.",
          stats: [
            { label: "함께 교감하는 반려 가구", value: "32,000+" },
            { label: "안전 진단 통과 수제 간식", value: "190종+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "댕냥이들 평점 극찬 베스트 셀러",
        subtitle: "사랑하는 반려동물에게 직접 입히고 먹여보며 견고한 만족도를 입증한 시그니처 큐레이션입니다.",
        content_data: {
          items: [
            { title: "휴먼그레이드 무항생제 연어 화식 사료", description: "피부 모질 개선과 면역력을 가속화하는 영양 만점 슬로우 수제 사료 1kg / 28,000원", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80" },
            { title: "관절 케어 펫 고밀도 메모리폼 배드", description: "아이들의 체형 곡선에 맞춰 척추 무리를 예방하는 소프트 옐로우 방석 / 85,000원", image: "https://images.unsplash.com/photo-1541599540903-216a46cc1ad6?auto=format&fit=crop&w=600&q=80" },
            { title: "오가닉 코튼 컴포트 반려견 맨투맨", description: "천연 염색 가공으로 피부 발적 걱정 없이 편안하게 입히는 산책용 패브릭 의류 / 32,000원", image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "다정한 펫 패밀리의 문을 열어보세요",
        subtitle: "전국 유명 동물 병원 및 펫 숍 단량 대량 납품 계약 자문, 반려동물 동반 복합 문화 공간 입점 제휴, 혹은 커스텀 이모티콘 굿즈 컬래버레이션은 하단에 서신을 띄워주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "입점/구매/제휴 문의하기"
        }
      }
    ]
  },
  active_sports_store: {
    templateId: "active_sports_store",
    name: "액티브 애슬레틱 스포츠 기어",
    category: "Store",
    description: "고기능성 스포츠 웨어와 액티브 아웃도어 기어를 취급하는 스토어를 위한 역동적인 테마입니다. 에너제틱한 다이내믹 로열 블루와 네온 오렌지 컬러 칩의 하이 콘트라스트 조화가 브랜드의 강력한 퍼포먼스를 효과적으로 전달합니다.",
    image: "/templates/active_sports_store.png",
    theme: {
      fontFamily: "Montserrat, Pretendard, sans-serif",
      colors: {
        primary: "#1d4ed8",     // 다이내믹 로열 블루
        secondary: "#ea580c",   // 네온 오렌지
        accent: "#f43f5e",      // 레이저 핑크 포인트
        background: "#0f172a",  // 딥 슬레이트 블랙 배경
        surface: "#1e293b",     // 테크니컬 슬레이트 그레이 카드
        text: "#f8fafc"         // 선명한 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "한계를 파괴하는 완벽한 움직임의 시작",
        subtitle: "최상의 고기능성 원사와 고밀도 인체공학 설계를 통해 당신의 신체 능력을 극한으로 끌어올릴 프리미엄 액티브 아웃도어 컬렉션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
          ctaText: "액티브 기어 쇼핑하기",
          ctaLink: "#contact",
          features: [
            { text: "땀을 빠르게 흡수하고 방출하는 흡한속건 특수 테크니컬 패브릭" },
            { text: "격렬한 트레이닝 중에도 부상을 방지하는 점진적 압박 지지 시스템" }
          ]
        }
      },
      {
        section_type: "services",
        title: "퍼포먼스 카테고리",
        subtitle: "당신의 액티브 라이프스타일을 더욱 강인하게 완성해 줄 에센셜 라인업입니다.",
        content_data: {
          items: [
            {
              title: "컴프레션 웨어 에디션",
              description: "근육의 미세한 떨림을 차단하고 혈류 흐름을 가속화하여 고강도 웨이트 트레이닝 시 근지구력을 극대화하는 전문 의류입니다.",
              icon: "Flame"
            },
            {
              title: "액티브 아웃도어 기어",
              description: "사계절 러닝 및 하이킹 조건에 대응하여 초경량 마찰 방지 자재와 유기적인 수분 방어막 공정을 반영한 전천후 스포츠 기구입니다.",
              icon: "Compass"
            },
            {
              title: "엘리트 애슬레틱 소품",
              description: "땀 흡수 헤드밴드부터 고탄성 리프팅 스트랩까지 미끄러짐 없는 완벽한 그립감으로 안전한 신체 단련을 보증하는 소품 모음입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "강력한 에너지를 전파하는 피트니스 리더",
        subtitle: "매일 한계를 돌파하는 1%의 변화가 당신의 신체와 정신을 혁신합니다.",
        content_data: {
          description: "안녕하세요. 스포츠 공학 연구원들과 국가대표 피트니스 코치진이 합심하여 런칭한 프리미엄 스포츠 기어 스토어입니다. 우리는 기교적인 마케팅 거품을 원천 제거하고 오직 숫자가 증명하는 해부학적 데이터와 가혹한 극한 환경 테스트 피드백만을 바탕으로 선별된 프로덕트만을 보급합니다. 한계를 두려워하지 않는 모든 러너와 헬스 고수들을 위한 확실한 애슬레틱 파트너가 되어 드리겠습니다.",
          stats: [
            { label: "만족도", value: "99%" },
            { label: "배송 건수", value: "100k+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "이달의 베스트 퍼포먼스 픽",
        subtitle: "강력한 기능성과 무결점 만족도로 크루들의 극찬을 이끌어낸 베스트셀러 리스트입니다.",
        content_data: {
          items: [
            { title: "테크니컬 카본 고탄성 러닝화", description: "지면 충격을 흡수하고 강력한 반발력으로 페이스를 가속화하는 전문 레이싱화 / 249,000원", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
            { title: "고밀도 머슬 서포트 컴프레션 타이츠", description: "허벅지와 종아리 근육 부상을 선제 차단하는 하이테크 압박 레깅스 / 89,000원", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80" },
            { title: "초경량 방수 윈드브레이커 자켓", description: "갑작스러운 기후 변화 속에서도 체온을 유지해 주는 투습 방수 가벼운 자켓 / 165,000원", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "B2B 단체 주문 및 파트너십 제휴 문의",
        subtitle: "스포츠 구단 및 러닝 크루 단체 유니폼 커스텀 제작, 오프라인 피트니스 센터 대량 납품 조율, 혹은 마케팅 제휴 제안은 하단 양식을 채워 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의하기"
        }
      }
    ]
  },

  living_interior_store: {
    templateId: "living_interior_store",
    name: "스칸디나비안 리빙 인테리어 스토어",
    category: "Store",
    description: "북유럽풍 미니멀 가구, 최고급 패브릭 및 감각적인 리빙 소품을 취급하는 정갈한 가치 중심의 스토어 테마입니다. 따뜻하고 차분한 샌드 베이지 배경과 슬레이트 차콜 그레이의 조합이 여백의 미와 포근함을 완성합니다.",
    image: "/templates/living_interior_store.png",
    theme: {
      fontFamily: "Pretendard, Inter, sans-serif",
      colors: {
        primary: "#4b5563",     // 차분한 슬레이트 차콜 그레이
        secondary: "#f5ebe0",   // 은은한 샌드 베이지 베이스
        accent: "#b45309",      // 따뜻한 앤티크 오렌지 브라운
        background: "#faf8f5",  // 자연광을 닮은 퓨어 크림 화이트
        surface: "#ffffff",     // 깨끗한 캔버스 표면 카드
        text: "#1c1917"         // 타자기 먹색 스톤 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "비움 속에서 발견하는 아늑한 삶의 온기",
        subtitle: "불필요한 몰딩과 장식을 과감하게 배제하고, 천연 원목의 텍스처와 빛의 흐름을 조율하여 머무는 것만으로도 위로가 되는 미니멀 리빙 스페이스를 제안합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
          ctaText: "인테리어 쇼룸 가기",
          ctaLink: "#contact",
          features: [
            { text: "시대를 초월하여 오래도록 곁에 두고 쓸 수 있는 명품 원목 퍼니처" },
            { text: "피부에 자극이 없는 유기농 오가닉 리넨 및 천연 모달 패브릭 컬렉션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "리빙 디자인 스튜디오",
        subtitle: "회색빛 아파트 공간에 정갈한 자연의 숨결을 불어넣는 홈 데코레이션 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "내추럴 원목 퍼니처",
              description: "북미산 월넛과 화이트 오크 원목의 결을 그대로 살리고 친환경 천연 오일 마감으로 숨결을 유지한 프리미엄 가구 라인입니다.",
              icon: "Home"
            },
            {
              title: "오가닉 홈 패브릭",
              description: "창가로 부드럽게 쏟아지는 채광의 조도를 정밀하게 조율하는 시그니처 커튼 및 사계절 포근한 베딩 웨어 세트입니다.",
              icon: "Heart"
            },
            {
              title: "미니멀리즘 오브제 소품",
              description: "과도한 수식어를 배제하고 단순한 선과 면의 비례감만으로 공간에 은은한 포인트 매력을 더해주는 세라믹 화기 큐레이션입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "슬로우 라이프를 설계하는 공간 스타일리스트",
        subtitle: "진정한 하이엔드 하우스는 값비싼 가구의 나열이 아니라, 바람과 빛이 머물 자리를 비워두는 것입니다.",
        content_data: {
          description: "안녕하세요! 미니멀한 북유럽 가구와 내추럴 식물의 조화를 통해 마음의 영구적 휴식처를 연출하는 리빙 스타일리스트 샌드입니다. 우리는 유행에 따라 쉽게 소모되는 인스턴트 소품을 지양하며, 세월이 흐를수록 손때가 묻어 멋스러운 헤리티지를 발산하는 오가닉 자재만을 고집합니다. 당신의 라이프스타일과 동선에 최적화된 단단하고 평온한 가치를 만나보세요.",
          stats: [
            { label: "만족도", value: "99%" },
            { label: "배송 건수", value: "100k+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "스페이스 시그니처 컬렉션",
        subtitle: "완벽한 수평 그리드와 포근한 감각으로 공간의 공기를 완전히 바꿔놓은 베스트 가구입니다.",
        content_data: {
          items: [
            { title: "덴마크풍 내추럴 화이트 오크 소파", description: "천연 모달 패브릭 쿠션과 견고한 오크 원목 프레임이 결합된 3인용 힐링 소파 / 1,450,000원", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" },
            { title: "미니멀리즘 월넛 히든 원형 다이닝 테이블", description: "장식적 요소를 배제하고 상판의 우아한 곡선미를 극대화한 프리미엄 4인 식탁 / 890,000원", image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80" },
            { title: "비움의 미학: 무광 무결점 세라믹 도자기 화기", description: "여백의 미를 채워주며 한 송이의 꽃만으로 시각적 오브제가 되는 백자빛 꽃병 / 45,000원", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프리미엄 공간 컨설팅 및 제휴 문의",
        subtitle: "신축 아파트 전체 홈 스타일링 비공개 자문 요청, 카페 및 공유 오피스 가구 대량 B2B 발주, 혹은 디렉터 컬래버레이션은 하단에 서신을 띄워주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의하기"
        }
      }
    ]
  },

  handmade_craft_store: {
    templateId: "handmade_craft_store",
    name: "아티산 클래식 핸드메이드 공방",
    category: "Store",
    description: "독창적인 핸드메이드 주얼리와 가죽 공예품을 선보이는 장인 정신 기반의 스토어 테마입니다. 따뜻한 러스트 테라코타 오렌지와 부드러운 소프트 아이보리 서페이스가 손때 묻은 아날로그의 가치를 고스란히 담아냅니다.",
    image: "/templates/handmade_craft_store.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#c2410c",     // 내추럴 러스트 테라코타 오렌지
        secondary: "#fbf5ee",   // 포근한 소프트 아이보리 서페이스
        accent: "#431407",      // 깊이감 있는 빈티지 번트 차콜 브라운
        background: "#fffbf7",  // 포근한 한지 화이트 배경
        surface: "#ffffff",     // 깨끗한 화이트 캔버스 표면
        text: "#292524"         // 눈이 편안한 다크 스톤 그레이
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "손끝에서 피어나는 단 하나뿐인 아티산의 영혼",
        subtitle: "기계식 대량 생산이 결코 모사할 수 없는 느림의 미학, 한 땀의 정교한 바느질과 망치질로 무에서 유를 창조해 내는 오리지널 핸드크래프트 에디션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공방 아카이브 입장",
          ctaLink: "#contact",
          features: [
            { text: "시간이 흐를수록 깊은 멋을 내는 천연 베지터블 레더 에이징 가공" },
            { text: "디테일 정밀 세공법으로 소장 가치를 극대화한 수제 실버 주얼리" }
          ]
        }
      },
      {
        section_type: "services",
        title: "장인의 워크숍",
        subtitle: "시간의 기다림 속에서 정성스럽게 직조된 프리미엄 수공예 라인업입니다.",
        content_data: {
          items: [
            {
              title: "새들 스티치 천연 가죽 공예",
              description: "천연 베지터블 레더의 패턴 설계부터 단면 마감, 이중 바느질 공정을 거쳐 견고함과 앤티크한 질감을 완벽하게 구현한 가죽 가방 및 소품입니다.",
              icon: "Layers"
            },
            {
              title: "핸드카빙 실버 주얼리",
              description: "왁스 카빙 기법과 금속 고온 소성 과정을 거쳐 정형화되지 않은 자연스러운 은빛 비례와 텍스처를 구현한 디자이너 주얼리입니다.",
              icon: "Sparkles"
            },
            {
              title: "아날로그 아틀리에 클래스",
              description: "일상의 소음을 비워내고 천연 원료와 도구의 감각에 몰입하며 나만의 취향이 담긴 오브제를 직접 만들어가는 치유 워크숍입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "시간을 아카이빙하는 크래프트 마스터",
        subtitle: "손으로 만지고 다듬은 시간만이 물건에 진짜 생명력을 부여한다고 믿습니다.",
        content_data: {
          description: "안녕하세요. 거친 가죽 가공 냄새와 금속 톱질 소리 속에서 삶의 가장 정직한 온기를 발견하는 마스터 아티산입니다. 우리는 쉽게 소비되고 지워질 인스턴트 공산품 대신 평생을 곁에 두고 쓸수록 멋스러운 가치를 지닌 공방 소품들을 제작하고 있습니다. 기계의 완벽한 수치 너머에 깃든 인간의 정성과 장인 정신의 아름다움을 여러분의 매일의 식탁과 착장 위에 전해드리겠습니다.",
          stats: [
            { label: "만족도", value: "99%" },
            { label: "배송 건수", value: "100k+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "공방 가마에서 태어난 마스터피스",
        subtitle: "독자적인 금속 세공과 새들 스티치 기법을 거쳐 높은 평점을 갱신하고 있는 시그니처 큐레이션입니다.",
        content_data: {
          items: [
            { title: "클래식 이탈리안 가죽 브리프케이스", description: "시간이 흐를수록 짙은 태닝 브라운 빛을 발산하는 최고급 베지터블 가죽 서류가방 / 420,000원", image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80" },
            { title: "핸드카빙 노출 실버 925 빈티지 링", description: "은 표면을 망치로 미세하게 두드려 빛의 굴절과 묵직한 조형미를 살린 반지 / 85,000원", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" },
            { title: "테라코타 흙빛 핸드메이드 세라믹 머그", description: "물레 위에서 자연스러운 손자국 질감을 남겨 구워낸 세상에 하나뿐인 오가닉 컵 / 32,000원", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "수공예 맞춤 오더 및 단체 클래스 문의",
        subtitle: "브랜드 VIP 기프트 대량 수제 오더 제작, 카페 인테리어용 수공예 패널 제휴, 혹은 주말 정기 아틀리에 단체 예약 예약은 하단에 서신을 띄워주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의하기"
        }
      }
    ]
  },

  kids_toy_store: {
    templateId: "kids_toy_store",
    name: "해피 안심 키즈 파스텔 숍",
    category: "Store",
    description: "자연 친화적인 안심 목재 완구와 100% 유기농 소재 아동 의류를 전하는 다정한 패밀리 스토어 테마입니다. 밝고 긍정적인 파스텔 옐로우와 청량한 소프트 스카이 블루의 조화가 아이들의 무한한 상상력을 자극합니다.",
    image: "/templates/kids_toy_store.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#0ea5e9",     // 청량한 소프트 스카이 블루
        secondary: "#fef08a",   // 행복한 파스텔 옐로우 표면
        accent: "#f43f5e",      // 따뜻한 피치 핑크 포인트
        background: "#f0fdf4",  // 눈이 편안한 오가닉 민트 틴트 화이트
        surface: "#ffffff",     // 동글동글하고 깨끗한 화이트 카드
        text: "#334155"         // 친근하고 부드러운 슬레이트 그레이
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "아이의 눈으로 본 세상, 가장 다정한 놀이터",
        subtitle: "구강기 아이가 입에 넣고 빨아도 100% 무해한 천연 원목 완구와 화학 유해 성분 제로 인증의 부드러운 오가닉 베이비 웨어 가이드입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
          ctaText: "안심 완구 쇼핑하기",
          ctaLink: "#contact",
          features: [
            { text: "유럽 안전 표준 CE 및 국내 자율안전인증 KC를 무결점 통과한 제품군" },
            { text: "천연 식물성 염료 가공으로 아토피 걱정 없는 유기농 코튼 아동복" }
          ]
        }
      },
      {
        section_type: "services",
        title: "러브 키즈 스튜디오",
        subtitle: "우리 소중한 아이들의 오감 발달과 창의력 성장을 가속화할 패밀리 세션입니다.",
        content_data: {
          items: [
            {
              title: "몬테소리 교구 & 원목 완구",
              description: "독일산 프리미엄 단풍나무와 비취우드 원목을 정교하게 둥글림 샌딩 가공하여 만든 지능 발달 교구 세트입니다.",
              icon: "Smile"
            },
            {
              title: "오가닉 베이비 웨어",
              description: "인공 보존제나 형광 증백제를 전면 배제하고 민감한 아기 피부를 포근하게 감싸주는 파스텔 빛깔 린넨 및 코튼 의류 라인입니다.",
              icon: "Heart"
            },
            {
              title: "상상력 촉감 놀이 가이드",
              description: "집에서도 엄마 아빠와 함께 안전한 천연 점토 및 친환경 패브릭 굿즈를 활용해 창의력을 확장하는 오감 플레이 키트입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "세 남매의 일상을 기록하는 해피 맘 디렉터",
        subtitle: "아이를 키우는 부모들의 막막한 심정을 알기에 오직 올바른 상식과 안전함만 약속합니다.",
        content_data: {
          description: "안녕하세요! 세 아이를 키우며 매일 전쟁 같은 감동의 일상을 아카이빙하고 있는 육아 라이프스타일 크리에이터 해피 맘입니다. 저는 내 아이가 매일 살을 맞대고 입에 넣는 물건이기에 단 0.1%의 화학 유해 우려 성분도 용납할 수 없다는 엄마의 철학으로 엄격하게 검증된 안심 완구와 오가닉 아동 의류만 엄선하여 숍을 운영하고 있습니다. 전국의 모든 육아 동지 부모님들에게 든든한 힐링 쉼터가 되어 드리겠습니다.",
          stats: [
            { label: "만족도", value: "99%" },
            { label: "배송 건수", value: "100k+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "엄마 아빠들의 평점 극찬 맘스 픽",
        subtitle: "성장 발달 체크리스트를 기반으로 실사용 반려 부모들의 무결점 만족도를 영구 갱신 중인 베스트셀러입니다.",
        content_data: {
          items: [
            { title: "프리미엄 100피스 천연 원목 블록 세트", description: "모든 모서리가 둥글게 스퀘어 히든 라운딩 처리된 무독성 창의력 목재 블록 / 125,000원", image: "https://images.unsplash.com/photo-1515488047-dfb367046420?auto=format&fit=crop&w=600&q=80" },
            { title: "오가닉 무형광 코튼 우주복 세트", description: "세탁 후에도 변형 없이 아기 피부 발적 걱정 없이 편안하게 입히는 파스텔 옐로우 내의 / 38,000원", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80" },
            { title: "친환경 식물성 염료 감각 촉감 인형", description: "부드러운 타월 텍스처로 정서적 안정을 유도하는 세탁 가능한 오가닉 토이 / 29,000원", image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "유치원/단체 대량 주문 및 제휴 문의",
        subtitle: "전국 영유아 교육 기관 단체 교구 교구 대량 납품 계약 자문, 친환경 키즈 카페 편집숍 입점 제휴, 혹은 육아맘 서포터즈 지원은 하단에 서신을 띄워주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의하기"
        }
      }
    ]
  },

  green_garden_store: {
    templateId: "green_garden_store",
    name: "올리브 보태니컬 가든숍",
    category: "Store",
    description: "실내 공기정화 식물, 감각적인 천연 수제 토분 및 프로페셔널 가드닝 용품 전문 숍 테마입니다. 묵직하고 격조 높은 보태니컬 다크 그린 바탕과 싱그러운 민트 그린 포인트가 도심 속 베란다 정원의 평온함을 선사합니다.",
    image: "/templates/green_garden_store.png",
    theme: {
      fontFamily: "Pretendard, Quicksand, sans-serif",
      colors: {
        primary: "#14532d",     // 보태니컬 다크 그린
        secondary: "#10b981",   // 민트 그린 포인트
        accent: "#f59e0b",      // 노을빛 토분 오렌지 골드
        background: "#f4f7f4",  // 차분한 내추럴 그린 틴트 오프화이트
        surface: "#ffffff",     // 맑은 채광을 닮은 순백색 카드
        text: "#14532d"         // 숲의 중심 중심 다크 올리브 브라운
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "콘크리트 회색 아파트에 들여놓는 싱그러운 초록빛 숨결",
        subtitle: "초보 식집사도 절대 죽이지 않는 사계절 실내 식물 케어 매뉴얼과 공간의 조도를 극대화하여 플랜테리어 미학을 완성하는 가든숍 큐레이션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "그린 가이드 받기",
          ctaLink: "#contact",
          features: [
            { text: "실내 미세먼지와 포름알데히드를 완벽 흡착 차단하는 공기정화 식물" },
            { text: "통기성과 배수력이 우수한 이탈리아 전통 오리지널 이끼 방지 토분" }
          ]
        }
      },
      {
        section_type: "services",
        title: "그린 플랜트 디렉토리",
        subtitle: "지구와 내 마음에 온전한 안식을 선물하는 친환경 홈 가드닝 라인업입니다.",
        content_data: {
          items: [
            {
              title: "공기정화 및 반려식물",
              description: "몬스테라, 올리브나무 등 실내 채광과 통풍 동선에 맞춰 엄선되어 분갈이 공정을 무결점 마친 안심 식물 세트입니다.",
              icon: "Leaf"
            },
            {
              title: "수제 토분 & 오가닉 배양토",
              description: "식물 뿌리의 과습을 선제 예방하고 숨 쉴 수 있는 통기성을 보장하는 천연 점토 화분 및 무해 유기농 프리미엄 흙 배합 가이드입니다.",
              icon: "Compass"
            },
            {
              title: "전문 가드너 툴 에센셜",
              description: "정밀 물뿌리개부터 전정 가위, 영양제 스프레이까지 식물 가꾸기의 몰입도를 높이고 삶의 속도를 늦추는 전문 도구 모음입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자연의 다정함을 선물하는 가든 디렉터",
        subtitle: "흙을 만지고 물을 주며 새로 돋아나는 연둣빛 새순에서 삶의 진짜 치유를 경험합니다.",
        content_data: {
          description: "안녕하세요! 회색빛 아파트 베란다를 100여 종의 푸른 반려식물 컬렉션으로 가득 채워 숨 쉬고 있는 어반 가드너 올리브입니다. 우리는 인위적인 화학 비료를 배제하고 오직 자연 본연의 유기적 생명력을 지탱하는 가드닝 솔루션만을 공급합니다. 식물을 키우는 행위는 결국 나의 메마른 마음의 밭에 물을 주는 일과 같습니다. 저의 향긋한 가든 스페이스에서 초록빛 영감을 온전히 누려보세요.",
          stats: [
            { label: "만족도", value: "99%" },
            { label: "배송 건수", value: "100k+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "식집사들이 평점 찬사한 이달의 식물",
        subtitle: "집안의 공기를 바꾸고 세련된 인테리어 오브제가 되어 줄 베스트셀러 식물 라인입니다.",
        content_data: {
          items: [
            { title: "공기정화 1위 프리미엄 몬스테라", description: "이탈리아 오리지널 토분에 이끼 방지 분갈이 공정을 마친 감각적인 플랜테리어 / 65,000원", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80" },
            { title: "지중해 감성 올리브나무 내추럴 세트", description: "모래빛 베이지 실내 톤에 어울리는 은은한 잎새 선이 아름다운 중형 나무 / 120,000원", image: "https://images.unsplash.com/photo-1501004318641-729e49f643e8?auto=format&fit=crop&w=600&q=80" },
            { title: "전문가용 황동 가드닝 물뿌리개", description: "미세 보정 노즐을 탑재하여 부드러운 물안개를 분사하는 스틸 프리미엄 툴 / 48,000원", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공간 플랜테리어 및 대량 납품 문의",
        subtitle: "상업 공간 및 카페 인테리어 식물 큐레이션 의뢰, 관공서 및 공유 오피스 가드닝 정기 관리 B2B 계약, 플라워 숍 입점 제휴 제안은 아래로 신호를 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의하기"
        }
      }
    ]
  },
  luxury_watch_store: {
    templateId: "luxury_watch_store",
    name: "하이엔드 프리미엄 리갈 워치 부티크",
    category: "Store",
    description: "최고의 가치와 장인 정신이 깃든 하이엔드 명품 시계 및 럭셔리 주얼리 전문 부티크 테마입니다. 국왕의 권위를 닮은 리갈 딥 차콜 배경 위에 은은하게 빛나는 샴페인 골드 포인트를 매칭하여 최상위 클래스의 격조와 품격을 보여줍니다.",
    image: "/templates/luxury_watch_store.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#d4af37",     // 찬란한 샴페인 골드
        secondary: "#6b7280",   // 미드톤 슬레이트 그레이
        accent: "#b45309",      // 럭셔리 앤티크 브라운
        background: "#0f1115",  // 리갈 딥 차콜 블랙
        surface: "#1a1d24",     // 정교한 스틸 메탈 서페이스 카드
        text: "#f8fafc"         // 시인성이 뛰어난 오프화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시간을 초월하는 영속적 예술, 손끝에 머무는 헤리티지",
        subtitle: "수백 년을 이어온 스위스 전통 오토매틱 매커니즘과 타협하지 않는 최고급 자재의 융합을 통해 당신의 인생에 가장 위대한 명작을 큐레이션합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
          ctaText: "컬렉션 컬렉션 보기",
          ctaLink: "#contact",
          features: [
            { text: "정밀 뚜르비옹 기술 및 무결점 크로노미터 공식 인증 완료" },
            { text: "18K 리갈 골드 프레임과 최상급 천연 다이아몬드 세공의 미학" }
          ]
        }
      },
      {
        section_type: "services",
        title: "럭셔리 헤리티지 존",
        subtitle: "단순한 시간 측정을 넘어 성공과 권위의 정체성을 부여하는 마스터피스 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "오토매틱 마스터피스 컬렉션",
              description: "중력의 오차를 극대화하여 극복하는 하이엔드 복잡 무브먼트 무결점 라인업으로 인생의 역사적인 순간을 함께 영원히 기록합니다.",
              icon: "Award"
            },
            {
              title: "하이클래스 파인 주얼리 큐레이션",
              description: "글로벌 보석 감정 센터의 철저한 엄선을 통과한 최고 등급의 원석과 정교한 인체공학 밴드 설계를 조화시킨 명품 주얼리 세트입니다.",
              icon: "Sparkles"
            },
            {
              title: "글로벌 익스클루시브 트래킹 부티크",
              description: "전 세계적으로 한정 수량 제작되어 소장 가치를 영구히 갱신하는 프라이빗 단독 한정판 및 올드 빈티지 아카이브 영역입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "장인정신의 본질적 본질을 수호하는 마스터 가이드",
        subtitle: "우리는 단지 시계를 파는 것이 아니라 대를 이어 물려줄 유산의 역사를 기록합니다.",
        content_data: {
          description: "안녕하세요. 하이엔드 파인 워치 시장의 글로벌 트렌드를 선도하는 수석 큐레이터이자 부티크 디렉터 리갈입니다. 우리는 유행에 따라 쉽게 소모되는 패션 소품을 배제하며, 가마 속에서 탄생한 도자기처럼 수작업의 정교함과 이성적인 데이터가 완벽한 조형미를 이뤄내는 마스터피스만을 엄선합니다. 당신의 라이프스타일과 권위에 명확한 격조를 더해줄 확실한 자산의 이정표를 만나보세요.",
          stats: [
            { label: "브랜드 수", value: "80+" },
            { label: "누적 리뷰", value: "15,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "시간이 빚어낸 명작 에디션",
        subtitle: "전 세계 컬렉터들의 찬사를 받으며 매달 가치를 영구히 갱신하고 있는 시그니처 아이템입니다.",
        content_data: {
          items: [
            { title: "크로노그래프 플래티넘 오토매틱 워치", description: "사파이어 크리스탈 글래스와 72시간 파워리저브 무브먼트를 탑재한 스틸 명작 / 24,500,000원", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80" },
            { title: "18K 샴페인 골드 다이아몬드 베젤 링", description: "은은한 골드 프레임 위에 브릴리언트 컷 다이아몬드를 입체 배치한 하이클래스 반지 / 12,800,000원", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80" },
            { title: "헤리티지 마린 투톤 메탈 오디세이", description: "심해 300m 완벽 수분 방어막 공정과 야광 시안 인덱스를 반영한 다이버 익스클루시브 워치 / 18,900,000원", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프라이빗 VIP 컨설팅 및 쇼룸 부킹 신청",
        subtitle: "한정판 리미티드 에디션 선제 대기 예약, 기업 법인 임직원 특별 기프트 수량 조율, 혹은 명품 자산 밸류업 제휴 제안은 아래를 채워 서신을 띄워주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 신청하기"
        }
      }
    ]
  },

  vintage_book_store: {
    templateId: "vintage_book_store",
    name: "앤티크 빈티지 서재 & 북 아카이브",
    category: "Store",
    description: "양장본 고서, 영문 빈티지 서적 및 최고급 클래식 문구를 다루는 지적 감성의 편집숍 테마입니다. 노스탤지어를 자극하는 따뜻한 웜 세피아와 엄숙하고 격조 높은 클래식 버건디 포인트가 고결한 서재의 공기를 재현합니다.",
    image: "/templates/vintage_book_store.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#881337",     // 클래식 버건디
        secondary: "#78350f",   // 앤티크 딥 세피아 브라운
        accent: "#b45309",      // 노을빛 타자기 머스터드
        background: "#fdfaf4",  // 세월이 바랜 크림 종이 질감 배경
        surface: "#fbf3e6",     // 포근한 양장본 크림 서페이스 카드
        text: "#1c1917"         // 타자기 먹색 스톤 블랙 본문색
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "빛바랜 한 장의 종이 위에서 사유의 숲을 거닐다",
        subtitle: "수십 년의 세월을 견뎌온 희귀 양장본 고서부터 가죽 수공예 만년필 파우치까지, 삭막한 디지털 도심 속에서 지적이고 단단한 아날로그 낭만을 큐레이션합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "비밀의 서재 입장",
          ctaLink: "#contact",
          features: [
            { text: "국내외 독립 출판 및 역사적 보존 가치를 지닌 희귀 수입 고서" },
            { text: "천연 이끼 가공 잉크와 타자기 질감을 구현한 클래식 프리미엄 지류 문구" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아날로그 리딩 룸",
        subtitle: "취향이 깊어지는 밤, 영혼을 묵직한 활자로 가득 채워줄 전문 아카이브 목록입니다.",
        content_data: {
          items: [
            {
              title: "희귀 양장 고서 & 클래식 문학",
              description: "도스토옙스키부터 카뮈까지, 시대를 초월해 인류에게 질문을 던지는 명작들의 초판본 가이드를 수집하고 수필의 정취를 해설 평론합니다.",
              icon: "Compass"
            },
            {
              title: "클래식 만년필 & 프리미엄 문구",
              description: "손끝에 닿는 필기감을 극대화하기 위해 천연 원목 배럴로 수제 제작된 만년필과 잉크 번짐이 없는 무독성 중성 지류 노트를 취급합니다.",
              icon: "Sparkles"
            },
            {
              title: "심야 서평 및 문학 워크숍",
              description: "대형 서점에서는 찾기 힘든 독립 출판 작가들을 초청하여 은유 가득한 문장에 몰입하며 내면을 치유하는 리추얼 클래스를 운영합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상을 천천히 받아 적는 클래식 아키비스트",
        subtitle: "유행처럼 소비되고 사라질 말 대신 영원히 남을 종이 위의 가치를 지향합니다.",
        content_data: {
          description: "안녕하세요. 오래된 물건이 주는 손때 묻은 온기와 지독한 책 냄새를 사랑하는 서재 디렉터 세피아입니다. 우리는 디지털의 무조건적인 편리함 대신 한 장의 필름을 감고 타자기를 두드리는 수고로움 속에서 삶의 진짜 낭만과 깊이를 발견하곤 합니다. 저의 정적이고 고요한 공간이 자극적인 숏폼 콘텐츠에 지친 여러분의 지성을 평온하게 채워주는 심야 소통 다방이 되기를 진심으로 갈망합니다.",
          stats: [
            { label: "브랜드 수", value: "80+" },
            { label: "누적 리뷰", value: "15,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "시간이 멈춘 책장 베스트",
        subtitle: "지적인 영감과 앤티크한 조형 미학을 모두 충족하여 단골 독자들의 찬사를 독차지한 마스터피스입니다.",
        content_data: {
          items: [
            { title: "1950년대 영문 고전 문학 양장본 에디션", description: "천연 가죽 커버와 골드 엠보싱 타이포 기법으로 마감된 컬렉터 필수 소장 도서 / 165,000원", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80" },
            { title: "독일 장인 수제 웰넛 원목 배럴 만년필", description: "장시간 필기 시에도 손목 피로도가 없도록 무게 중심을 정밀 밸런싱한 필기구 / 280,000원", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80" },
            { title: "바랜 크림 종이 질감의 격조 높은 하드커버 저널", description: "잉크젯 만년필을 사용해도 번짐과 비침이 제로인 이탈리아 수입 지류 노트 / 35,000원", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "지적인 무대 컬래버레이션 노크",
        subtitle: "도서관 독립 출판 서적 특별 납품 제안, 북 카페 가구가 결합된 공간 브랜딩 제휴, 혹은 문화 기고문 의뢰는 아래 빈 페이지에 성함을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 신청하기"
        }
      }
    ]
  },

  coffee_roasters_store: {
    templateId: "coffee_roasters_store",
    name: "에스프레소 브루잉 가든 & 로스터리",
    category: "Store",
    description: "직수입 스페셜티 원두 로스팅 및 프리미엄 브루잉 기어를 파는 스토어 테마입니다. 묵직하고 깊은 딥 에스프레소 브라운과 부드러운 우유빛 소프트 크림 서페이스가 주방 위에 온전한 미식 바를 실현해 줍니다.",
    image: "/templates/coffee_roasters_store.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#3c2f2f",     // 딥 에스프레소 브라운
        secondary: "#fca5a5",   // 크림슨 피치 한 스푼 포인트
        accent: "#d4a373",      // 따뜻한 카푸치노 스킨 톤
        background: "#faf6f0",  // 은은한 우유 빛깔 웜 화이트
        surface: "#ffffff",     // 깨끗한 도자기 잔을 닮은 카드
        text: "#4b382a"         // 원두 빛깔의 초콜릿 브라운 본문색
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "단 한 잔의 원두 추출 속에서 마주하는 온전한 안식",
        subtitle: "산지의 기후가 숨겨둔 시트러스 과일 향부터 초콜릿의 묵직한 바디감까지, 생두 감별사가 직수입하여 정밀 로스팅 기법으로 제어한 스페셜티 생명력을 전달합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1200&q=80",
          ctaText: "원두 라인업 쇼핑",
          ctaLink: "#contact",
          features: [
            { text: "생두의 잠재력을 극한으로 가속화하는 당일 로스팅 당일 배송 원칙" },
            { text: "물 조절과 온도의 미세 변수 오차를 차단하는 전문 브루잉 기어 세트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "바리스타 랩 포커스",
        subtitle: "당신의 홈카페를 하이엔드 로스터리 숍 스튜디오로 업그레이드해 줄 시그니처 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "다이렉트 싱글 오리진 원두",
              description: "에티오피아 게이샤, 콜롬비아 수프리모 등 전 세계 소규모 오가닉 유기농 농가와 직거래하여 원산지의 매력을 투명하게 품은 원두 라인업입니다.",
              icon: "Heart"
            },
            {
              title: "하이엔드 핸드드립 가젯",
              description: "추출 속도를 균일하게 보정하는 세라믹 드리퍼, 정밀 온도계 케틀, 세련된 무광 그라인더 등 스마트 브루잉 도구 모음입니다.",
              icon: "Award"
            },
            {
              title: "프라이빗 테이스팅 클래스",
              description: "원두 커핑(Cupping) 노하우부터 라떼 아트 기초, 나만의 주말 홈바리스타 리추얼을 단단히 가꾸어 나가는 커뮤니티 공간입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "생두의 파형을 설계하는 마스터 바리스타",
        subtitle: "물이 원두를 통과하는 그 짧은 침묵 속에서 삶의 위로와 진짜 미식을 경험합니다.",
        content_data: {
          description: "안녕하세요. 매일 아침 주방 오븐 옆에서 신선한 원두를 볶고 드립하며 은은한 원두 향기로 하루를 시작하는 홈카페 디렉터 모카입니다. 우리는 거창하고 자극적인 가짜 마케팅을 지워내고 오직 원두 본연의 노트를 숫자가 증명하는 데이터 기반 추출 공식으로만 해설합니다. 저의 아늑한 크림빛 서재에 머무시는 동안 단 한 잔의 소박하지만 밀도 높은 행복을 안전하게 누리시길 바랍니다.",
          stats: [
            { label: "브랜드 수", value: "80+" },
            { label: "누적 리뷰", value: "15,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "이달의 스페셜티 에디션",
        subtitle: "커핑 스코어 최고점을 갱신하며 수많은 식집사 홈바리스타들의 만족도를 확보한 원두 리스트입니다.",
        content_data: {
          items: [
            { title: "에티오피아 예가체프 G1 내추럴 비건 원두", description: "향긋한 자스민의 은은한 아로마와 베리류의 청량한 산미가 가득한 스페셜티 200g / 18,000원", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" },
            { title: "과테말라 안티구아 딥 에스프레소 블렌드", description: "다크 초콜릿의 달콤 쌉싸름함과 묵직한 스모키 바디감을 조화시킨 홈카페 시그니처 500g / 32,000원", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" },
            { title: "무광 매트 카본 프리미엄 황동 드립 케틀", description: "미세 물줄기 조율에 최적화된 구스넥 노즐을 탑재한 하이엔드 브루잉 주전자 600ml / 65,000원", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원두 정기 납품 및 커스텀 제휴 문의",
        subtitle: "전국 감성 카페 생두/원두 대량 B2B 정기 배송 계약 조율, 사내 오피스 라운지 홈카페 무상 인프라 구축, 혹은 브랜드 협업은 아래로 문장을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 신청하기"
        }
      }
    ]
  },

  office_workspace_store: {
    templateId: "office_workspace_store",
    name: "슬릭 슬레이트 홈오피스 모션 데스크 가구숍",
    category: "Store",
    description: "현대적인 모션 데스크 및 디자이너 워크스페이스 가구를 전문으로 취급하는 하이테크 가구숍 테마입니다. 세련된 슬레이트 그레이와 미니멀 화이트의 구획이 완벽한 직선 미학과 공간적 정갈함을 가속화합니다.",
    image: "/templates/office_workspace_store.png",
    theme: {
      fontFamily: "Inter, Pretendard, sans-serif",
      colors: {
        primary: "#0ea5e9",     // 스마트 시안 블루
        secondary: "#6b7280",   // 슬레이트 그레이
        accent: "#6366f1",      // 테크니컬 인디고 블루
        background: "#f8fafc",  // 넓고 탁 트인 슬레이트 화이트 배경
        surface: "#ffffff",     // 도면처럼 명확한 순백색 카드 서페이스
        text: "#0f172a"         // 가독성을 극대화한 다크 차콜 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "작업 효율을 극한으로 최적화하는 하이테크 데스크테리어",
        subtitle: "체형 곡선에 맞춰 초단위 0.1mm 높낮이를 자동 보정하는 지능형 모션 데스크와 인체공학적 피지컬 의자를 통해 프리랜서 엔지니어의 생산성을 가속화합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스마트 스마트 워크스페이스 구축",
          ctaLink: "#contact",
          features: [
            { text: "안정적인 듀얼 모터를 탑재하여 흔들림 없는 점진적 저소음 구동" },
            { text: "복잡한 모니터 배선을 원천 히든 처리하는 하이테크 배선 홀 매니지먼트" }
          ]
        }
      },
      {
        section_type: "services",
        title: "엔지니어링 퍼니처 스택",
        subtitle: "회색빛 홈오피스 공간을 완벽한 지능형 시스템 연구실로 빌드업해 줄 코어 라인업입니다.",
        content_data: {
          items: [
            {
              title: "인텔리전트 모션 데스크",
              description: "메모리 프리셋 기능을 연동하여 좌식과 스탠딩 업무의 유기적 피벗을 유도하고 스트레스를 선제 방어하는 프리미엄 스마트 책상 라인입니다.",
              icon: "Compass"
            },
            {
              title: "피지컬 인체공학 태스크 체어",
              description: "요추 불균형과 거북목을 예방하도록 고탄성 메쉬 소재와 3D 다차원 암레스트 조율 시스템을 반영한 시그니처 의자입니다.",
              icon: "Shield"
            },
            {
              title: "모듈러 스틸 스페이스 파츠",
              description: "자석형 타공판, 언더 데스크 선반 등 불필요한 노이즈를 비워내고 오직 코드와 작업 몰입도만 남겨주는 하이테크 인테리어 소품 모음입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "터미널 뒤의 가치를 공간으로 직조하는 디렉터",
        subtitle: "모든 크리에이티브 성장은 최적화된 작업 장비의 그리드 설계에서 시작됩니다.",
        content_data: {
          description: "안녕하세요. 정보 보호 시스템 엔지니어 출신의 워크스페이스 디렉터 슬레이트입니다. 우리는 마케팅의 과장된 연출 대신 오직 역학적 무게 지지 데이터와 가혹한 내구성 테스트 피드백만을 바탕으로 선별된 하이테크 가구 편집숍을 운영합니다. 하루에 10시간 이상 모니터 쉘 창을 마주하는 모든 프로그래머와 디자이너들의 피지컬 안전을 지켜줄 가장 직관적이고 견고한 솔루션을 약속드립니다.",
          stats: [
            { label: "브랜드 수", value: "80+" },
            { label: "누적 리뷰", value: "15,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "엔지니어 크루들의 평점 극찬 셋업",
        subtitle: "웹 표준 그리드처럼 명확하게 구획되어 작업 공간의 공기를 완전히 바꿔놓은 베스트 셀러입니다.",
        content_data: {
          items: [
            { title: "스마트 듀얼 모터 저소음 모션 데스크", description: "화이트 자작나무 상판과 슬레이트 그레이 스틸 다리가 조화를 이룬 1600 가로 책상 / 680,000원", image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80" },
            { title: "싱크로 틸팅 에르고 고탄성 매쉬 체어", description: "체중의 하중 분산 기술을 적용하여 장시간 코딩 시에도 요추를 견고히 지지하는 의자 / 450,000원", image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80" },
            { title: "매트 카본 블랙 듀얼 모니터 암", description: "상하좌우 회전 굴절률 보정 노즐을 탑재하여 완벽한 시야각을 제공하는 알루미늄 스틸 암 / 125,000원", image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "스마트 사옥 토탈 가구 컨설팅 문의",
        subtitle: "유수 IT 테크 스타트업 임직원 사무 인프라 풀스택 단체 도입, 공유 오피스 공간 브랜딩 대량 시공 제휴, 혹은 비즈니스 외주 협업은 아래로 편지 쓰기를 해주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 신청하기"
        }
      }
    ]
  },

  healthy_nutrition_store: {
    templateId: "healthy_nutrition_store",
    name: "에메랄드 퓨어 웰빙 헬스 영양제 스토어",
    category: "Store",
    description: "유기농 천연 영양제 및 프리미엄 헬스 보조제를 전문 공급하는 클린 바이오 숍 테마입니다. 청결하고 지적인 순백색 배경 위에 지탱력을 주는 에메랄드 그린 포인트가 의학적 데이터 신뢰도와 치유의 온기를 처방합니다.",
    image: "/templates/healthy_nutrition_store.png",
    theme: {
      fontFamily: "Pretendard, sans-serif",
      colors: {
        primary: "#065f46",     // 클린 에메랄드 그린
        secondary: "#10b981",   // 민트 그린 에너지
        accent: "#f43f5e",      // 사랑스러운 활력 하트 핑크
        background: "#ffffff",  // 무결점의 순백색 스페이스 배경
        surface: "#f0fdf4",     // 눈이 편안한 그린 틴트 카드 서페이스
        text: "#111827"         // 명학한 가독성의 슬레이트 다크 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "자연 추출물 유전 공학으로 완성하는 라이프스타일 밸런스",
        subtitle: "합성 화학 첨가물과 유전자가공 원료를 원천 배제하고, 소아과 약학 연구진의 자문 기반 정밀 배합 공정을 거쳐 몸속 세포 본연의 활력을 가속화하는 웰빙 솔루션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "맞춤형 영양제 탐색",
          ctaLink: "#contact",
          features: [
            { text: "국제 우수 의약품 제조 품질 관리 기준(GMP) 무결점 승인 완료 정밀 포뮬러" },
            { text: "인위적인 과장광고 없이 오직 수치와 객관적인 임상 논문이 입증하는 순수 비건 성분" }
          ]
        }
      },
      {
        section_type: "services",
        title: "바이오 뉴트리션 매트릭스",
        subtitle: "신체 에너지 효율을 극대화하고 생체 방화벽을 세워줄 올인원 건강 보조 파이프라인입니다.",
        content_data: {
          items: [
            {
              title: "오가닉 멀티 비타민 미네랄",
              description: "제철 유기농 과일과 허브 식물 성분을 급속 저온 동결 건조하여 하루 한 알만으로 신진대사 혈류 흐름을 유기적으로 촉진하는 기초 에센스입니다.",
              icon: "Leaf"
            },
            {
              title: "고농축 오메가3 & 유산균 랩",
              description: "심해 청정 정제 기술을 적용해 중금속 우려 리스크를 완전 제로(0)로 묶은 오일 캡슐 및 장벽 생태계를 단단하게 가꾸어 주는 생유산균 라인입니다.",
              icon: "Shield"
            },
            {
              title: "액티브 헬스 부스터 영양식",
              description: "직장인의 만성 피로 감정 번아웃을 완화하고 세포 노화 방지 항산화 작용을 가속화하도록 정교하게 계량 설계된 식물성 단백질 파우더 세트입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "생명 존엄성의 건강 가치를 치유하는 그린 크루",
        subtitle: "철저히 계량된 과학적 데이터와 이성적인 팩트만을 신뢰하며 건강의 이정표를 세웁니다.",
        content_data: {
          description: "안녕하세요. 생명공학 연구소 전문 약학 디렉터들과 헬스 케어 플래너들이 상생의 가치 아래 의기투합하여 런칭한 프리미엄 비건 웰빙 숍 에메랄드입니다. 우리는 현대 사회의 독성 인공 화학 원료의 무분별한 섭취에 경종을 울리고, 자연 본연의 유기적 생명 촉진 원료를 현대인의 체질에 최적화하여 보급하는 일에 깊은 정체성을 투영해 오고 있습니다. 무결점 치유를 경험해 보세요.",
          stats: [
            { label: "브랜드 수", value: "80+" },
            { label: "누적 리뷰", value: "15,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "신체 활력 촉진 베스트 에디션",
        subtitle: "소비자 장벽 평점 최고점을 영구 갱신 중인 수많은 반려인들의 평생 건강 지휘소 제품군입니다.",
        content_data: {
          items: [
            { title: "비건 오가닉 프리미엄 멀티비타민 90정", description: "유기농 야채 유효 성분 가공으로 식후 속 쓰림 걱정 없이 편안하게 흡수되는 필수 비타민 / 49,000원", image: "https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=600&q=80" },
            { title: "초순도 rTG 오메가3 프리미엄 맥스", description: "중금속 리스크 차단 통관 가이드라인을 통과한 레시피로 혈행 개선에 탁월한 오일 가젯 / 58,000원", image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80" },
            { title: "100억 생유산균 포스트바이오틱스 카밍 바", description: "위산에 죽지 않고 장벽까지 무결점 도달하여 소화 촉진을 유도하는 생유산균 / 35,000원", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프리미엄 헬스 웰빙 비즈니스 입점 노크",
        subtitle: "전국 약국 및 피트니스 메디컬 센터 대량 B2B 독점 유통 무역 계약 자문, 친환경 헬스 브랜드 패키징 커스텀 제휴, 혹은 국책 과제 문의는 아래 서면 양식에 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 신청하기"
        }
      }
    ]
  },
  perfume_atelier_store: {
    templateId: "perfume_atelier_store",
    name: "프레그런스 아틀리에 센트",
    category: "Store",
    description: "감각적인 니치 향수, 센티드 캔들 및 디퓨저를 다루는 프리미엄 조향 공방 편집숍 테마입니다. 신비롭고 몽환적인 분위기를 자아내는 글래스모피즘 바이올렛과 소프트 화이트 표면이 결합하여 향기가 지닌 예술적 아우라를 공간에 투영합니다.",
    image: "/templates/perfume_atelier_store.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#8b5cf6",     // 몽환적인 바이올렛
        secondary: "#f3e8ff",   // 연한 파스텔 라벤더
        accent: "#ec4899",      // 감각적인 크림슨 핑크
        background: "#fffbfd",  // 포근하고 부드러운 살구빛 화이트
        surface: "#ffffff",     // 깨끗한 도자기 잔을 닮은 표면
        text: "#1e1b4b"         // 깊은 한밤중의 미드나잇 퍼플 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "보이지 않는 기억의 조각, 나만의 향기를 조각하다",
        subtitle: "인위적인 인공 향료를 배제하고 자연에서 온 스페셜티 천연 에센셜 오일의 섬세한 탑노트부터 깊고 그윽한 베이스노트까지 완벽하게 조율한 프레그런스 큐레이션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
          ctaText: "시그니처 향수 쇼핑",
          ctaLink: "#contact",
          features: [
            { text: "프랑스 그라스 장인들과의 협업으로 탄생한 100% 핸드메이드 수제 공정" },
            { text: "공간의 분위기를 완전히 바꾸는 고농축 천연 디퓨저 오일 에셋" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아틀리에 마스터피스",
        subtitle: "당신의 눈에 보이지 않는 감각을 일상의 공간 속에 가장 우아한 실루엣으로 채워줄 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "익스클루시브 니치 아로마",
              description: "체온과 만나는 순간 세상에 단 하나뿐인 고유의 향으로 피어나는 최고 등급의 원료 배합 수제 향수 라인업입니다.",
              icon: "Sparkles"
            },
            {
              title: "센티드 소이 캔들 & 디퓨저",
              description: "천연 대두 왁스와 우드 심지가 타들어 가며 따스한 소리를 내는 인테리어 소품 겸 프리미엄 에센셜 홈 프레그런스입니다.",
              icon: "ShoppingBag"
            },
            {
              title: "조향 비주얼 클래스",
              description: "숨을 고르고 나만의 감정과 기억을 향조 캘린더에 맞춰 직접 블렌딩하여 치유의 평온을 얻는 프라이빗 워크숍 공간입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "향기의 보이지 않는 서사를 설계하는 아키비스트",
        subtitle: "단순히 좋은 냄새를 넘어 한 인간의 기억과 영혼을 표현하는 예술을 지향합니다.",
        content_data: {
          description: "안녕하세요. 프레그런스 아틀리에를 이끌어가는 수석 조향사이자 비주얼 크리에이터 센트입니다. 우리는 유행에 따라 빠르게 소모되는 자극적인 향을 배제하며, 오랜 시간 벼루에 먹을 갈듯 숙련된 장인의 섬세한 감각이 녹아든 명작만을 선별하여 제공합니다. 이 정적이고 몽환적인 공간이 디지털의 소음에 지친 여러분의 마음을 평온하게 채워주는 심야의 아늑한 정원이 되기를 희망합니다.",
          stats: [
            { label: "오프라인 쇼룸", value: "3개 지점" },
            { label: "단골 고객수", value: "20,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아틀리에 베스트 아카이브",
        subtitle: "독창적인 프레그런스 노트와 화려한 보틀 디자인으로 단골 독자들의 평점 극찬을 갱신 중인 아이템입니다.",
        content_data: {
          items: [
            { title: "블러썸 바이올렛 오 드 퍼퓸 50ml", description: "향긋한 자스민과 은은한 라벤더 보랏빛 노트를 매칭하여 깊은 잔향을 주는 시그니처 향수 / 145,000원", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" },
            { title: "스모키 우드 천연 소이 캔들 250g", description: "새벽녘 대나무 숲속의 이끼 향과 타오르는 장작 소리를 담아낸 핸드메이드 프리미엄 캔들 / 48,000원", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80" },
            { title: "오가닉 오트밀 크림 디퓨저 세트", description: "공간의 조도를 극대화하는 세라믹 보틀과 섬세한 섬유 리드 스틱 구성 홈 프레그런스 / 62,000원", image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프라이빗 비즈니스 입점 및 조향 문의 신청",
        subtitle: "셀렉숍 오프라인 팝업 입점 제안, 기업 임직원 특별 답례품 대량 오더 조율, 혹은 맞춤형 시그니처 향 개발 제휴 제안은 아래를 채워 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 발송"
        }
      }
    ]
  },

  camping_outdoor_store: {
    templateId: "camping_outdoor_store",
    name: "헤비듀티 와일드 캠핑 아웃도어 기어",
    category: "Store",
    description: "고기능성 헤비듀티 캠핑, 백패킹 및 와일드 아웃도어 기어를 전문 공급하는 터프한 감성의 편집숍 테마입니다. 숲을 닮은 러프한 포레스트 올리브 드랩과 안전 신호를 상징하는 해저드 오렌지의 하이 콘트라스트 배치가 액티브한 활력을 극대화합니다.",
    image: "/templates/camping_outdoor_store.png",
    theme: {
      fontFamily: "Montserrat, Pretendard, sans-serif",
      colors: {
        primary: "#556b2f",     // 포레스트 올리브 드랩
        secondary: "#ea580c",   // 해저드 오렌지
        accent: "#111827",      // 구조적 차콜 블랙
        background: "#1e293b",  // 매트한 슬레이트 다크 그레이 배경
        surface: "#0f172a",     // 인프라 테크니컬 오프블랙 카드
        text: "#f8fafc"         // 시인성이 뛰어난 오프화이트 글자
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "거친 대자연 속에서 나만의 완벽한 요새를 빌드하라",
        subtitle: "기교적인 연출을 배제하고 오직 가혹한 기후와 험난한 지형 특성을 견뎌내도록 정밀 설계된 스트렝스 아웃도어 가젯 및 텐트 인프라 컬렉션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "와일드 기어 쇼핑",
          ctaLink: "#contact",
          features: [
            { text: "폭풍우 속에서도 신체를 완벽 차단 방어하는 초경량 투습 방수 자재" },
            { text: "마찰 스크래치를 방지하는 카본 복합재 및 항공 알루미늄 스틸 가공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "익스페디션 테크 스택",
        subtitle: "당신의 모험에 지체 없는 기동력과 절대적인 안전망을 보증할 전문 장비 라인업입니다.",
        content_data: {
          items: [
            {
              title: "백패킹 쉘터 & 서포트 텐트",
              description: "바람의 역학 동선을 역추적 설계하여 강풍 앞에서도 흔들림 없는 듀얼 알루미늄 폴 구조의 무결점 전문가용 텐트 세트입니다.",
              icon: "Shield"
            },
            {
              title: "헤비듀티 부시크래프트 나이프 툴",
              description: "혹독한 오지 캠핑 환경에서 원목을 대패질하고 불꽃을 일으킬 수 있는 극한 내구성의 고탄소 스틸 가공 멀티 툴입니다.",
              icon: "Award"
            },
            {
              title: "어반 가드닝 서바이벌 기어",
              description: "미세 위치 위성 항법을 보정하는 나침반 나침반, 고광도 방수 랜턴 등 야간 트레킹 시 완벽한 시야와 동선을 확보해 주는 소품입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "길 위에서 생존을 설계하는 아웃도어 페이스메이커",
        subtitle: "차가운 이성의 하드웨어 데이터와 대지를 향한 정직한 태도로 야생을 개척합니다.",
        content_data: {
          description: "안녕하세요. 전 세계의 숨겨진 로컬 캠핑 스팟을 유랑하며 생존에 필요한 올바른 정석 장비만을 큐레이션하는 와일드 가이드 올리브입니다. 우리는 광고성 거품 문구를 지워내고 오직 필드 임상 테스트와 물리적인 복합 내구성 수치로만 성능을 증명하며, 머문 자리에 흔적을 남기지 않는 올바른 LNT(Leave No Trace) 캠핑 생태계를 가꾸어 나가고 있습니다.",
          stats: [
            { label: "오프라인 쇼룸", value: "3개 지점" },
            { label: "단골 고객수", value: "20,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "오지 크루들의 평점 극찬 장비",
        subtitle: "수많은 극한 익스페디션 여정 속에서 단 한 번의 에러 없이 안전성을 입증한 베스트 큐레이션입니다.",
        content_data: {
          items: [
            { title: "초경량 카본 4시즌 백패킹 텐트", description: "강풍 방어막 공정과 올리브 드랩 틴트를 레이아웃에 매칭하여 몰입감을 높인 2인용 쉘터 / 580,000원", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80" },
            { title: "해저드 네온 고광도 전술 방수 랜턴", description: "안전 신호를 뿜어내며 미세 먼지 속에서도 완벽한 야간 가시성을 제공하는 충전식 랜턴 / 125,000원", image: "https://images.unsplash.com/photo-1516575150278-771d1a5f50b0?auto=format&fit=crop&w=600&q=80" },
            { title: "티타늄 초경량 오가닉 쿠킹 시스템", description: "부피를 줄이는 네스팅 폴딩 구조와 빠른 열전도율로 원가를 절감한 아웃도어 식기 세트 / 89,000원", image: "https://images.unsplash.com/photo-1537815749002-d63b55225488?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "B2B 대량 도매 계약 및 기어 커스텀 노크",
        subtitle: "산악 구조대 및 서바이벌 크루 군수 대량 납품 계약 단가 조율, 아웃도어 편집숍 입점 제휴, 혹은 마케팅 제휴 제안은 아래 콘솔 창에 입력을 해주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 발송"
        }
      }
    ]
  },

  art_supplies_store: {
    templateId: "art_supplies_store",
    name: "크리에이티브 크래프트 화방 아틀리에",
    category: "Store",
    description: "프리미엄 캘리그라피 펜, 유화 물감 및 디자이너 노트를 엄선 큐레이션한 지적 감성의 문구 화방 스토어 테마입니다. 상상력을 자극하는 세련된 딥 네이비와 부드러운 파스텔 라벤더 포인트가 캔버스 위의 예술적 영감을 완성합니다.",
    image: "/templates/art_supplies_store.png",
    theme: {
      fontFamily: "Inter, Noto Serif KR, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 크리에이티브 딥 네이비
        secondary: "#ddd6fe",   // 소프트 파스텔 라벤더
        accent: "#f43f5e",      // 시선을 사로잡는 하트 핑크 엑센트
        background: "#f8fafc",  // 깨끗하고 눈이 편안한 슬레이트 화이트
        surface: "#ffffff",     // 원고지를 닮은 순백색 카드 표면
        text: "#0f172a"         // 완벽한 시인성의 슬레이트 다크 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "단 한 줄의 선과 컬러로 나만의 우주를 직조하다",
        subtitle: "화려한 수식어를 배제하고 필기감의 본질을 꿰뚫는 수제 아티산 만년필부터, 한지 질감 위에 번짐 없는 고품격 수입 유화 물감까지 창작가를 위한 도구 리포트입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "예술 도구 탐색",
          ctaLink: "#contact",
          features: [
            { text: "장시간 집필 시에도 손목 피로도가 없도록 정밀 무게 밸런싱된 필기구" },
            { text: "천연 광물 성분을 고농축 배합하여 시대를 초월하는 영속적 발색력" }
          ]
        }
      },
      {
        section_type: "services",
        title: "창작가의 라이브러리",
        subtitle: "손끝에 닿는 촉감을 극대화하여 당신의 예술적 주파수를 자극할 코어 라인업입니다.",
        content_data: {
          items: [
            {
              title: "아티산 캘리그라피 & 만년필",
              description: "천연 원목 배럴과 독일산 닙을 탑재하여 서예체의 묵직한 서사적 형태감과 타자기 먹색의 감성을 필기구로 구현해 냅니다.",
              icon: "Sparkles"
            },
            {
              title: "하이엔드 유화 & 아크릴 컬러",
              description: "빛의 굴절과 텍스처를 캔버스 위에 입체적으로 표현해 주며 시간이 흘러도 바램과 균열이 제로인 명품 물감 시리즈입니다.",
              icon: "ShoppingBag"
            },
            {
              title: "디자이너 하드커버 저널 노트",
              description: "만년필 마니아들을 위해 잉크 비침과 번짐 현상을 완벽 차단하는 이탈리아 수입 프리미엄 지류 문구 세트입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "비움의 여백 속에 예술의 뼈대를 새기는 디렉터",
        subtitle: "가장 단순한 도구가 가장 강력하고 위대한 메시지를 창조해 낸다고 확신합니다.",
        content_data: {
          description: "안녕하세요. 시각적 예술 소음 속에서 불필요한 장식을 덜어내고 사물과 사유의 본질 형태에 몰두하는 화방 아틀리에 디렉터 라벤더입니다. 우리는 단순한 문구 판매 단가 처리를 배제하고 작가의 예술 세계관을 깊이 이해하여 영감을 더해줄 진짜 도구만을 매칭합니다. 이 정갈한 순백색 공간이 여러분의 지친 지성과 사유의 깊이를 평온하게 채워주는 서재가 되길 바랍니다.",
          stats: [
            { label: "오프라인 쇼룸", value: "3개 지점" },
            { label: "단골 고객수", value: "20,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "디자이너 크루들의 평점 극찬 픽",
        subtitle: "웹 표준 그리드처럼 명확한 선의 미학과 소장 가치를 입증한 대표 베스트셀러입니다.",
        content_data: {
          items: [
            { title: "독일 수제 월넛 원목 배럴 만년필 세트", description: "천연 원목의 그윽한 그립감과 하이테크 피스톤 흡입 메커니즘을 내장한 만년필 / 280,000원", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80" },
            { title: "아티스트 등급 천연 광물 유화 물감 24색", description: "프랑스 그라스 제조 공정 공조로 은은한 오가닉 향과 선명한 발색을 보증하는 물감 패키지 / 185,000원", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80" },
            { title: "만년필 전용 하드커버 양장 크림 저널", description: "바랜 크림 종이 질감의 텍스처로 비침과 잉크 번짐을 제로로 묶은 노트 / 35,000원", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프리미엄 화방 외주 및 아트 워크숍 제휴 문의",
        subtitle: "예술 대학 도서관 단체 교구 대량 납품 계약, 문화 예술 독립 출판 협업 제안, 혹은 공간 브랜딩 제휴는 아래 빈 원고지에 글을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 발송"
        }
      }
    ]
  },

  sweet_candy_store: {
    templateId: "sweet_candy_store",
    name: "플레이풀 스위츠 디저트 편집숍",
    category: "Store",
    description: "형형색색의 수제 젤리, 유기농 캔디 및 전 세계에서 직수입한 수제 스위츠 전문 편집숍 테마입니다. 사랑스럽고 긍정적인 플레이풀 스위트 핑크와 청량한 소프트 민트 블루가 솜사탕처럼 어우러져 동심의 행복을 선물합니다.",
    image: "/templates/sweet_candy_store.png",
    theme: {
      fontFamily: "Quicksand, Pretendard, sans-serif",
      colors: {
        primary: "#f472b6",     // 플레이풀 스위트 핑크
        secondary: "#ccfbf1",   // 소프트 민트 블루 표면
        accent: "#facc15",      // 해피 허니 골드 옐로우
        background: "#fdf8ff",  // 솜사탕 빛 틴트 화이트 배경
        surface: "#ffffff",     // 동글동글하고 깨끗한 화이트 카드
        text: "#4c1d95"         // 은은한 슬로우 플럼 퍼플 본문
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "파스텔 솜사탕 구름 위에서 터지는 달콤한 마법",
        subtitle: "인공 액상과당과 화학 유해 합성 보존제를 전면 배제하고, 100% 천연 과일 과즙과 천연 자일리톨 성분만을 계량해 정성스럽게 졸여낸 유기농 수제 수입 스위츠 아카이브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "달콤한 디저트 쇼핑",
          ctaLink: "#contact",
          features: [
            { text: "아토피 및 충치 걱정을 줄여주는 안심 비건 천연 유래 원료 가공" },
            { text: "Z세대의 키치하고 인스타그래머블한 감성을 저격하는 독창적인 패키지 셋업" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스위트 디자인 아틀리에",
        subtitle: "지루하고 단조로운 미식 일상에 눈부신 설렘을 한 스푼 한 스푼 채워줄 디저트 라인업입니다.",
        content_data: {
          items: [
            {
              title: "아티산 수제 레인보우 젤리",
              description: "천연 천연 한천 가공 공정을 거쳐 몽글몽글한 식감과 과일 본연의 새콤달콤함을 큐레이션한 프리미엄 수제 젤리 세트입니다.",
              icon: "Sparkles"
            },
            {
              title: "유기농 과즙 캔디 & 스위츠",
              description: "인공 색소 없이 천연 식물성 스펙트럼 광원 추출물로 색을 내어 아이들이 입에 넣어도 안심인 프랑스 수입 기프트 캔디입니다.",
              icon: "ShoppingBag"
            },
            {
              title: "프라이빗 파티 케이터링 클래스",
              description: "달콤한 초콜릿과 슈가 아트를 마스터 바리스타 드립 커피와 매칭하여 나만의 디저트 테이블 리추얼을 만드는 커뮤니티 공간입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "세상을 핑크빛 꿈으로 물들이는 디저트 디렉터",
        subtitle: "작은 한 조각의 달콤함이 사람들의 마음에 거대한 위로와 동심을 배달한다고 믿습니다.",
        content_data: {
          description: "안녕하세요! 회색빛 도심 빌딩 숲 속에서 솜사탕 구름 같은 마법을 전파하는 디저트 아티스트이자 편집숍 대표 민트맘입니다. 우리는 아이의 건강을 해치지 않는 깨끗한 오가닉 성분만을 고집하며, 눈과 입이 동시에 즐거운 키치하고 러블리한 비주얼 시스템을 결합하여 지친 이웃들의 매일매일의 식사 식사 시간에 작은 마법 같은 행복을 선물해 오고 있습니다.",
          stats: [
            { label: "오프라인 쇼룸", value: "3개 지점" },
            { label: "단골 고객수", value: "20,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아이들이 평점 극찬한 베스트 스위츠",
        subtitle: "정교한 위생 안전 검사를 무결점 통과하여 수많은 반려 부모들의 만족도를 확보한 대표작입니다.",
        content_data: {
          items: [
            { title: "프리미엄 천연 과즙 레인보우 곰돌이 젤리", description: "천연 딸기, 망고 오일 배합으로 자극 없이 부드러운 오가닉 촉감 수제 젤리 200g / 12,000원", image: "https://images.unsplash.com/photo-1582041204799-0af8f3ced408?auto=format&fit=crop&w=600&q=80" },
            { title: "프랑스 수입 18K 허니 골드 수제 사탕", description: "유기농 비정제 사탕수수당만으로 고급스러운 달콤함을 빚어낸 유리병 기프트 캔디 / 24,000원", image: "https://images.unsplash.com/photo-1534080355125-27b2c045efd7?auto=format&fit=crop&w=600&q=80" },
            { title: "키치 믹스 솜사탕 마블 머랭 쿠키 세트", description: "오븐 속에서 입안에 넣는 순간 사르르 녹아내리는 핑크 민트 블루 빛의 스위츠 / 15,000원", image: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "달콤한 단체 오더 및 기업 팝업 제휴 신청",
        subtitle: "어린이집 및 영유아 교육 기관 단체 굿즈 대량 납품 계약 자문, 뷰티 브랜드 브랜드 오픈 팝업 스토어 케이터링 제휴 문의는 아래로 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 발송"
        }
      }
    ]
  },

  smart_home_store: {
    templateId: "smart_home_store",
    name: "하이테크 인텔리전트 스마트 홈 디바이스 스토어",
    category: "Store",
    description: "인공지능 IoT 스피커, 스마트 무드 조명 등 미래형 홈 네트워크 디바이스 전문 스토어 테마입니다. 슬릭한 다크 슬레이트 그레이 표면과 미래지향적 일렉트릭 퍼플 액센트의 결합이 하이테크 인프라 연구실의 몰입감을 연출합니다.",
    image: "/templates/smart_home_store.png",
    theme: {
      fontFamily: "Inter, Montserrat, sans-serif",
      colors: {
        primary: "#6d28d9",     // 일렉트릭 하이테크 퍼플
        secondary: "#22d3ee",   // 미래지향 네온 시안 블루
        accent: "#f43f5e",      // 보안 방화벽 레이저 네온 핑크
        background: "#090d16",  // 미래형 카본 블랙 배경
        surface: "#1e1b4b",     // 깊이감 있는 하이테크 인디고 카드
        text: "#f8fafc"         // 광채가 느껴지는 라이트 화이트 폰트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "코드를 통해 나의 주거 공간을 지능형으로 최적화하다",
        subtitle: "사용자의 바이탈 생체 신호와 생활 동선을 AI 알고리즘 엔진이 실시간 추적하여, 조명 조도 조절부터 가전 전력 제어까지 원스톱 완전 자동화 홈 아키텍처를 가동합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스마트 시스템 체험",
          ctaLink: "#contact",
          features: [
            { text: "가동 전력 소모 비용을 원천 제어하는 제로 트러스트 하이테크 인프라" },
            { text: "사이버 제로 데이 해킹 공격을 원천 차단하는 지능형 암호화 보안 방화벽 패치" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스마트 홈 인프라 스택",
        subtitle: "주거의 편리함을 단순함으로 바꾸고 일상에 몰입도를 높여줄 차세대 디바이스 허브입니다.",
        content_data: {
          items: [
            {
              title: "인공지능 IoT 센서 스피커",
              description: "음성 마이크로 캡처 분석 기술을 연동하여 집안 모든 스마트 가전 허브를 터미널 콘솔처럼 중앙 지휘하는 코어 디바이스입니다.",
              icon: "Cpu"
            },
            {
              title: "스마트 생체 신호 바이오 무드등",
              description: "학습자의 수면 교육 및 업무 모드 전환 타이밍에 대응하여, 눈이 편안한 스펙트럼 굴절률과 시안 블루 조도를 자동 보정하는 라인 조명 기기입니다.",
              icon: "Activity"
            },
            {
              title: "엔터프라이즈 홈 가드 보안 카메라",
              description: "외부의 물리적 마찰 침입 전조 증상을 무결점으로 탐지하고 실시간 모바일 암호화 알림을 전송해 자산을 안전하게 수호하는 카메라 세트입니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "터미널 뒤에서 주거의 미래를 연산하는 칩 아키텍트",
        subtitle: "마케팅의 거품을 걷어내고 숫자가 말하는 무중단 인프라 하드웨어의 성능만 보여줍니다.",
        content_data: {
          description: "저희 스마트 홈 테크 랩은 하드웨어 연산 제어 연구소 출신의 시니어 소프트웨어 엔지니어들과 홈 네트워크 아키텍트들이 의기투합해 설립한 스마트 주거 혁신 기술 기업입니다. 우리는 불필요한 노이즈와 복잡한 배선 동선을 원천 히든 처리하고, 오직 데이터가 입증하는 지능형 알고리즘을 설계 기저에 두어 프로그래머와 스마트 컨슈머의 삶의 만족도를 비약적으로 가속화해 오고 있습니다.",
          stats: [
            { label: "오프라인 쇼룸", value: "3개 지점" },
            { label: "단골 고객수", value: "20,000+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "하이테크 프로덕션 아티팩트",
        subtitle: "엔지니어 크루들이 전력 효율 및 서버 호환성 테스트를 무결점으로 통과시킨 시그니처 디바이스입니다.",
        content_data: {
          items: [
            { title: "인공지능 실시간 음성 제어 스마트 스피커", description: "양방향 분산 컴퓨팅 칩 탑재로 스마트폰 연동 딜레이를 제로로 제어한 홈 코어 / 189,000원", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=600&q=80" },
            { title: "시네마틱 굴절 광원 스마트 LED 라인 조명", description: "1,600만 펄스 네온 핑크 및 일렉트릭 바이올렛 그라데이션 가이드 자동 연동 조명 / 95,000원", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80" },
            { title: "양자 암호화 분산 가드 생체 인식 도어락", description: "외부 침입 차단 가이드라인을 통과한 알루미늄 메탈 스틸 아키텍처 보안 잠금장치 / 260,000원", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "스마트 빌딩 B2B 대량 발주 및 제휴 문의",
        subtitle: "신축 주거 단지 홈 네트워크 인프라 풀스택 단체 시공 도입 자문, 하이엔드 인테리어 디자인 빌드 전문 법인 공동 제휴, 혹은 기술 외주 협업 제안은 아래로 신호를 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문의 발송"
        }
      }
    ]
  }
};
