import { TemplateConfig } from "../registry";

export const RESTAURANT_TEMPLATES: Record<string, TemplateConfig> = {
  // Existing template
  restaurant_warm: {
    templateId: "restaurant_warm",
    name: "웜 레스토랑 & 푸프",
    category: "Restaurant",
    description: "식욕을 돋우는 오렌지 컬러와 비주얼 중심의 F&B 맞춤형 템플릿",
    image: "/templates/restaurant_warm.png",
    theme: {
      fontFamily: "Outfit, Noto Sans KR, sans-serif",
      colors: {
        primary: "#ea580c",     // Dark Orange
        secondary: "#7c2d12",   // Brownish Orange
        accent: "#f97316",      // Orange
        background: "#ffffff",  // White
        surface: "#fff7ed",     // Orange 50
        text: "#1c1917"         // Warm Charcoal
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "가장 신선한 재료로 요리하는 특별한 미식 경험",
        subtitle: "자연에서 온 최상의 오가닉 식재료와 장인의 정성을 담은 다이닝 공간",
        content_data: {
          backgroundImage: "",
          ctaText: "메뉴 보러가기",
          ctaLink: "#services",
          features: [
            { text: "당일 도축 및 직배송 야채" },
            { text: "전담 셰프의 시그니처 레시피" },
            { text: "아늑하고 현대적인 인테리어" }
          ]
        }
      },
      {
        section_type: "services",
        title: "대표 메뉴 안내",
        subtitle: "저희 매장에서만 맛볼 수 있는 시그니처 메뉴 라인업",
        content_data: {
          items: [
            {
              title: "그릴드 랍스터 테일",
              description: "버터 허브 소스로 풍미를 더해 참나무 장작에 구워낸 최고급 요리",
              icon: "Flame"
            },
            {
              title: "오가닉 아보카도 샐러드",
              description: "신선한 리코타 치즈와 엑스트라 버진 올리브유를 듬뿍 얹은 건강식",
              icon: "Leaf"
            },
            {
              title: "수제 크렘 브륄레",
              description: "진한 커스터드 크림 위에 달콤하고 바삭한 캐러멜 토핑을 얹은 디저트",
              icon: "Cookie"
            }
          ]
        }
      },
      {
        section_type: "rental",
        title: "매장 갤러리 및 프라이빗 룸 대관",
        subtitle: "모임, 단체 행사, 비즈니스 미팅을 위한 편안한 공간 대여 서비스를 제공합니다.",
        content_data: {
          description: "저희 다이닝 룸은 최대 40인까지 프라이빗하게 이용하실 수 있으며, 모임 성격에 맞는 빔프로젝터, 음향 장비 및 스페셜 코스 음식을 사전에 맞춤 설계해 드립니다.",
          stats: [
            { label: "단체석 수용 인원", value: "최대 40석" },
            { label: "최소 예약 기간", value: "3일 전" },
            { label: "예약 만족도", value: "99.2%" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "테이블 예약 및 대관 신청",
        subtitle: "소중한 사람과의 약속, 최고의 테이블을 준비해 두겠습니다.",
        content_data: {
          fields: ["name", "phone", "date", "guests", "message"],
          buttonText: "예약 접수하기"
        }
      }
    ]
  },

  // ==========================================
  // NEW TEMPLATES (1~20)
  // ==========================================
  sushi_zen_minimal: {
    templateId: "sushi_zen_minimal",
    name: "스시 젠 하이엔드 일식 오마카세",
    category: "Restaurant",
    description: "정갈하고 맑은 편백나무 베이지와 잉크 차콜 블랙 배합으로 여백의 미학을 전하는 하이엔드 스시 오마카세 전용 테마입니다.",
    image: "/templates/sushi_zen_minimal.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#1c1917",     // 중후한 기포 차콜 블랙
        secondary: "#ede0d4",   // 맑고 깨끗한 히노끼 편백나무 베이지
        accent: "#9a3412",      // 고소한 우니 황토 오렌지
        background: "#faf7f2",  // 차분한 도자 미색
        surface: "#ffffff",     // 정갈한 단독 셰프 카운터 다찌 화이트
        text: "#292524"         // 먹묵빛 슬레이트 차콜
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "손끝의 온도로 전하는 바다의 찰나, 정직한 스시 오마카세",
        subtitle: "수령 300년 편백나무 다찌 카운터 앞에서 당일 아침 노량진 산지 직송 최고 등급 생선과 셰프의 고밀도 수기 터치로 빚어내는 정갈하고 깊이 있는 일식 파인 다이닝입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "캐치테이블 실시간 예약",
          ctaLink: "#contact",
          features: [
            { text: "엄격하게 엄선된 국산 스페셜티 우니, 참다랑어 오도로 등 당일 한정 식재료만을 사용" },
            { text: "소수 정예 하루 오직 8명의 귀한 고객님만을 예약제로 맞이하는 완벽한 프라이빗 카운터" }
          ]
        }
      },
      {
        section_type: "services",
        title: "젠 오마카세 코스 요강",
        subtitle: "생선의 기름기와 초대리의 산도가 완벽하게 공명하는 셰프의 시그니처 라인업입니다.",
        content_data: {
          items: [
            {
              title: "츠마미: 제철 사시미 플레이트",
              description: "코스의 시작을 알리는 잘 숙성된 자연산 참돔과 전복 찜, 그리고 고소한 게우 소스 앙상블입니다.",
              icon: "Compass"
            },
            {
              title: "시그니처: 참다랑어 대뱃살 스시",
              description: "참다랑어 오도로의 풍성한 마블링과 소금 터치가 혀끝에서 부드럽게 용해되는 스시의 꽃입니다.",
              icon: "Award"
            },
            {
              title: "디저트: 수제 교쿠 & 녹차 모나카",
              description: "새우살과 달걀만으로 오븐에서 2시간 구워낸 밀가루 제로 폭신한 교쿠와 유기농 말차 디저트입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스시는 기술이 아닌, 밥알 사이의 공기량과 생선의 숙성 시간이 빚는 과학적 대화입니다",
        subtitle: "초대리의 온도 36.5도는 인간의 체온과 동일할 때 최고의 감칠맛을 폭발시킵니다.",
        content_data: {
          description: "안녕하십니까. 스시 젠의 오너 셰프입니다. 우리는 일반 양산형 프랜차이즈 스시의 설탕물 가득한 밥을 단호히 거부합니다. 적초(붉은 식초)를 사용하여 밥의 산도를 높이고, 생선의 두께와 칼집의 깊이를 0.1mm 단위로 조절하여 씹는 맛의 유동성을 극대화합니다. 묵향 가득한 도심 속 히노끼 방음 카운터에서 당신만의 기품 있는 미식의 침묵을 호흡해 보십시오.",
          stats: [
            { label: "셰프 경력", value: "22년 정통 일식" },
            { label: "동시 수용 인원", value: "최대 8석" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "정숙한 다찌 카운터 & 사케 셀러",
        subtitle: "은은한 대나무와 히노끼 나무 향취가 머무는 품격 높은 친자연 갤러리 인테리어입니다.",
        content_data: {
          items: [
            { title: "편백나무 단독 카운터 테이블", description: "셰프가 스시를 쥐는 손끝의 미세한 움직임을 눈앞에서 감상하는 쾌적하고 청결한 다찌 좌석", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80" },
            { title: "고급 프리미엄 사케 쇼케이스", description: "닷사이 23, 주욘다이 등 셰프 오마카세와 완벽 조화를 이루는 프리미엄 일본 청주 보존실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "적초 샤리와 숙성 생선 네타", description: "편백 통 안에서 적정한 온도를 유지하는 붉은 샤리 밥과 정교하게 썰어둔 자연산 참돔 필렛 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오마카세 예약 및 문의 신청",
        subtitle: "방문 일시, 예약 런치/디너 세션 선택, 동반 인원수 및 알레르기 기피 식재료를 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "오마카세 예약 신청"
        }
      }
    ]
  },

  italian_trattoria_rustic: {
    templateId: "italian_trattoria_rustic",
    name: "트라토리아 베네토 정통 이탈리안",
    category: "Restaurant",
    description: "따뜻하고 편안한 이탈리아 토스카나 감성의 올리브 그린과 토마토 레드 액센트 조화로 손맛 가득한 파스타와 화덕 피자를 정교하게 보여주는 트라토리아 테마입니다.",
    image: "/templates/italian_trattoria_rustic.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#15803d",     // 싱그러운 이탈리안 올리브 그린
        secondary: "#fef08a",   // 화사한 레몬 베이지
        accent: "#dc2626",      // 타오르는 포모도로 토마토 레드
        background: "#faf6f0",  // 따스한 토스카나 연황토 오프화이트
        surface: "#ffffff",     // 깨끗한 위생 세라믹 요리대
        text: "#451a03"         // 에스프레소 초콜릿 다크 차콜
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "밀가루와 달걀노른자만으로 매일 아침 직접 미는 수제 생면 파스타",
        subtitle: "이탈리아 시칠리아산 엑스트라 버진 올리브유와 수입 캄파니아 토마토 소스를 곁들여, 장작 화덕 내부 온도 480도에서 1분 만에 구워내는 나폴리 정통 마르게리타 피자의 정수를 다룹니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80",
          ctaText: "시그니처 메뉴판 보기",
          ctaLink: "#services",
          features: [
            { text: "수입 카푸토(Caputo) 밀가루 100% 사용 24시간 도우 저온 발효 공법으로 쫄깃한 식감 보장" },
            { text: "이탈리아 소믈리에 자격증 보유 와인 컨설턴트 추천 데일리 하우스 와인 무제한 콜키지 프리 프리" }
          ]
        }
      },
      {
        section_type: "services",
        title: "베네토 대표 메뉴",
        subtitle: "인공 조미료 전혀 없이 자연 식재료 풍미만으로 빚어낸 이탈리아 정식 목록입니다.",
        content_data: {
          items: [
            {
              title: "생바질 페스토 수제 뇨끼",
              description: "강원도 햇감자로 반죽해 쫀득한 감자 뇨끼 위에 홈메이드 바질 페스토와 구운 피스타치오를 토핑했습니다.",
              icon: "Leaf"
            },
            {
              title: "트러플 생면 따야린 파스타",
              description: "물 한 방울 섞지 않고 노른자로만 반죽한 이탈리아 피에몬테식 얇은 생면 위에 이탈리아산 생 트러플을 강판에 갈아 올렸습니다.",
              icon: "Sparkles"
            },
            {
              title: "참나무 화덕 마르게리타 도우 피자",
              description: "캄파니아 버팔로 모짜렐라 치즈와 토마토 소스, 생바질을 올려 참나무 장작 화덕에서 순식간에 구워냈습니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "이탈리아 요리는 기교적인 소스의 화려함이 아닌, 식재료 본연의 정직함을 증명하는 식탁입니다",
        subtitle: "모든 파스타 소스는 셰프가 아침마다 통마늘을 올리브유에 뭉근히 끓여내는 마늘오일 베이스입니다.",
        content_data: {
          description: "반갑습니다. 트라토리아 베네토의 헤드 셰프입니다. 우리는 공장제 건면 파스타의 툭 끊어지는 밋밋한 식감을 거부합니다. 파스타 생면 반죽기 롤링 회수를 조절해 쫄깃하면서도 소스가 면발 틈새로 착 감기도록 면의 표면 텍스처를 까슬하게 성형합니다. 사랑하는 연인과 가족의 대화가 음악처럼 이어지는 따스한 이탈리안 식탁을 만나보십시오.",
          stats: [
            { label: "누적 파스타 출고 그릇 수", value: "12,000그릇" },
            { label: "수입 참나무 장작 보유", value: "3.5톤 분량" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "토스카나 풍 매장 & 참나무 화덕",
        subtitle: "식사하는 모든 순간 오감이 아늑해지도록 친자연 자재와 황토 벽돌로 마감된 인프라입니다.",
        content_data: {
          items: [
            { title: "이탈리아 황토 화덕 오븐 코너", description: "장작불 불꽃이 활활 타오르며 피자가 부풀어 오르는 모습을 테이블에서 실시간 구경하는 화덕 존", image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 빈티지 우드 다이닝 룸", description: "따뜻한 사이프러스 나무 테이블 위에 촛불 조명과 와인 잔이 세련되게 세팅된 정갈한 식사 스페이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 생면 반죽 건조 랙", description: "노른자 빛깔이 곱게 살아있는 얇은 타야린 면발을 나무 랙에 걸어 습도를 정밀하게 건조 관리하는 조리실 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "테이블 사전 예약 의뢰",
        subtitle: "방문 날짜 및 시간, 예약 인원수, 와인 콜키지 지참 유무, 그리고 프라이빗 룸 대관 필요 여부를 기재해 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "이탈리안 테이블 예약"
        }
      }
    ]
  },

  french_bistro_luxury: {
    templateId: "french_bistro_luxury",
    name: "르비스트로 파리 클래식 프렌치",
    category: "Restaurant",
    description: "하이엔드 감성의 딥 와인 버건디와 기품 있는 크림 골드 포인트로 프랑스 정통 다이닝과 럭셔리 와인 마리아주를 정교하게 어필하는 프렌치 비스트로 테마입니다.",
    image: "/templates/french_bistro_luxury.png",
    theme: {
      fontFamily: "Cormorant Garamond, Noto Serif KR, serif",
      colors: {
        primary: "#4c0519",     // 매혹적인 런웨이 버건디
        secondary: "#fdf8f5",   // 맑고 깨끗한 린넨 아이보리
        accent: "#d4af37",      // 럭셔리 샴페인 브론즈 골드
        background: "#1c1416",  // 묵직하고 고풍스러운 다크 와인 블랙
        surface: "#2a1b20",     // 안락한 벨벳 가구 다크 초콜릿
        text: "#f5ebe0"         // 가독성이 탁월한 소프트 베이지 크림
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오감을 매료시키는 프랑스 정통 소스의 중후함과 우아한 은식기 플레이팅",
        subtitle: "송아지 뼈를 48시간 동안 뭉근히 끓여낸 맑은 비프 드미글라스 소스 아로마와, 셰프의 고밀도 수기 터치로 완성한 오리 가슴살 꽁피 요리로 미식의 낭만을 바치는 하이엔드 프랑스 요리 전문 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프렌치 시그니처 코스 예약",
          ctaLink: "#contact",
          features: [
            { text: "프랑스 요리 명문 리츠 에스코피에(Ritz Escoffier) 출신 수석 셰프들의 독점 정통 프렌치 코스" },
            { text: "프랑스 보르도 올드 빈티지 카베르네 소비뇽과 메인 디쉬 꽁피 소스의 탄닌 결합 정량 매칭" }
          ]
        }
      },
      {
        section_type: "services",
        title: "프렌치 코스 컬렉션",
        subtitle: "애피타이저부터 디저트까지 완벽한 불란서 미식 예술을 횡단하는 럭셔리 세션입니다.",
        content_data: {
          items: [
            {
              title: "허브 에스카르고 달팽이 구이",
              description: "버터, 파슬리, 마늘을 채운 달팽이를 특수 구이판에 익혀 바삭한 식빵 토스트를 동반 서빙합니다.",
              icon: "Compass"
            },
            {
              title: "오렌지 글레이즈 오리 가슴살 꽁피",
              description: "낮은 온도의 오리 지방 속에서 12시간 동안 수비드 조리하여 겉은 바삭하고 속은 깃털처럼 부드러운 스테이크 요리입니다.",
              icon: "Award"
            },
            {
              title: "수제 초콜릿 수플레 & 꼬냑",
              description: "오븐에서 갓 부풀어 올라 뜨거운 다크 카카오 수플레와 바닐라 아이스크림의 온냉 공명을 선사합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "프렌치 퀴진은 단순히 허기를 채우는 것을 넘어, 요리사의 소스 철학을 혀끝으로 해독하는 예술입니다",
        subtitle: "모든 프렌치 소스는 물이나 조미료를 타지 않고 오직 정통 버터와 와인 엑기스 농축으로 직조됩니다.",
        content_data: {
          description: "안녕하십니까. 르비스트로 파리의 총괄 셰프입니다. 우리는 자극적이고 단편적인 인스턴트 소스 문화를 단호히 거부합니다. 송아지 뼈와 양파, 셀러리를 참나무 장작 불 위에서 끊임없이 저어가며 우려낸 소스는 한 스푼만으로도 전신의 침샘을 기분 좋게 요동치게 만듭니다. 아늑한 샹들리에 조명 아래, 보르도 와인 향취 가득한 파리의 저녁 쉼터에서 당신만을 위한 극진한 여왕의 휴식을 맛보십시오.",
          stats: [
            { label: "미쉐린 협업 평론가 만족률", value: "99.4%" },
            { label: "보유 프랑스 와인 리스트", value: "85종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "호텔식 클래식 살롱 & 와인 셀러",
        subtitle: "눈을 지그시 감고 은식기 사각거림 속에 미식을 즐길 수 있는 품격 높은 친자연 목조 시설입니다.",
        content_data: {
          items: [
            { title: "샹들리에 아래 벨벳 테이블 석", description: "프랑스 부티크 감성의 은식기와 크리스탈 와인 잔이 세련되게 세팅된 고급 1인 전용 다이닝 부스", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80" },
            { title: "지하 지하 비밀 와인 터널 셀러실", description: "프랑스 론, 보르도 그랑크뤼 등급 와인이 14도 일정한 온도로 묵직하게 숙성되고 있는 목조 저장소", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오리 꽁피와 프랑크 소스 플레이팅", description: "윤기가 흐르는 오리 다리 구이 위에 신선한 석류 알갱이와 오렌지 가니쉬를 올린 장인의 수기 요리 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "극진한 프렌치 다이닝 예약 의뢰",
        subtitle: "방문 날짜, 런치/디너 코스 선택, 기념일 유무(케이크 촛불 서빙 서비스 제공)를 적어 보내주시면 담당 지배인이 예약을 확정해 드립니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "프렌치 다이닝 코스 예약"
        }
      }
    ]
  },

  steakhous_premium_charcoal: {
    templateId: "steakhous_premium_charcoal",
    name: "블랙아이언 에이징 스테이크하우스",
    category: "Restaurant",
    description: "묵직한 매트 블랙 메탈 철제 프레임과 뜨겁게 타오르는 숯불 오렌지 골드 액센트로 드라이에이징 토마호크와 티본 스테이크의 불맛을 강렬하게 전달하는 테마입니다.",
    image: "/templates/steakhous_premium_charcoal.png",
    theme: {
      fontFamily: "Montserrat, Space Grotesk, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 장작 숯불 오렌지
        secondary: "#27272a",   // 인더스트리얼 러프 스틸 그레이
        accent: "#dc2626",      // 아드레날린 육즙 레드
        background: "#09090b",  // 매트 서킷 블랙
        surface: "#18181b",     // 탄소 섬유 메탈 차콜 텍스처
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-sm",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "참나무 장작 불꽃 위에서 시어링하여 가둔 진한 육즙과 바삭한 시어링 크러스트",
        subtitle: "미국 농무부(USDA) 최고 프라임 등급 블랙 앵거스를 엄선해 자체 에이징 저온 저장고에서 40일간 건조 숙성(Dry-Aged)하고, 독보적인 참나무 장작 고열 그릴로 겉은 바삭하게 태우고 속은 꽃물 핑크빛으로 구워내는 명품 스테이크 전문관입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
          ctaText: "드라이에이징 메뉴판 열람",
          ctaLink: "#services",
          features: [
            { text: "버터 향을 품은 육향 극대화를 위해 공학적으로 정량 제어되는 자체 40일 건조 숙성실 상시 가동" },
            { text: "소금의 결정이 살아있어 씹는 맛을 더하는 영국 왕실 지정 말돈 소금(Maldon Salt) 기본 서빙" }
          ]
        }
      },
      {
        section_type: "services",
        title: "블랙아이언 시그니처 컷",
        subtitle: "참나무 장작과 숯불 향이 뼈속 깊숙이 깃든 압도적인 스테이크 라인업입니다.",
        content_data: {
          items: [
            {
              title: "드라이에이징 포터하우스 스테이크",
              description: "두툼한 안심과 채끝 등심을 한 뼈에서 동시에 즐기는 스테이크의 끝판왕 요리로 2인 공유 추천작입니다.",
              icon: "Award"
            },
            {
              title: "토마호크 액티브 숯불 그릴",
              description: "갈비뼈를 통째로 살려 묵직한 볼륨감과 꽃등심 고유의 고소한 떡심 기름 풍미를 입안 가득 선사합니다.",
              icon: "Flame"
            },
            {
              title: "수비드 양갈비 프렌치렉 랙",
              description: "로즈마리와 타임 허브에 마리네이드하여 양고기 특유의 노린내를 완벽 차단하고 깃털처럼 부드럽게 구워냈습니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스테이크는 단순히 고기를 굽는 조리가 아닌, 표면에 캐러멜 라이징 크러스트를 만들어 육즙을 봉인하는 물리학입니다",
        subtitle: "모든 스테이크는 테이블에 서빙되기 전 5분간 레스팅(Resting)을 거쳐 전신의 육즙을 가운데로 정렬합니다.",
        content_data: {
          description: "안녕하십니까. 블랙아이언 스테이크하우스의 마스터 헤드 그리더입니다. 패밀리 레스토랑의 얇고 육즙 다 빠져 뻑뻑한 고기에 실망하셨나요? 진짜 스테이크는 두께가 최소 4cm 이상이어야 구울 때 내장 온도가 타지 않고 겉은 튀겨지듯 크리스피 해집니다. 우리는 참나무 장작의 스모키 훈연 향을 뼈속 깊이 스며들게 하여, 첫 조각을 입에 썰어 넣는 순간 육즙의 화려한 폭죽을 경험하게 만듭니다.",
          stats: [
            { label: "연간 출고 도끼 토마호크 수", value: "3,500개+" },
            { label: "보유 건조 숙성 정밀 챔버", value: "4세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "에이징 챔버 & 숯불 그릴실 전경",
        subtitle: "강렬하고 트렌디한 붉은 숯불의 열기가 느껴지는 프로패셔널 주방 인프라입니다.",
        content_data: {
          items: [
            { title: "40일 드라이에이징 에어 온도 챔버", description: "선홍빛 고기가 짙은 자줏빛으로 마르며 버터와 블루치즈 향취의 아로마를 응축해가는 숙성 저장실", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
            { title: "참나무 장작 초고열 그릴 작업대", description: "시각적인 화염과 불꽃이 피어오르는 무쇠 그릴 위에서 셰프가 집게를 잡고 시어링을 진행하는 현장", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오븐 구이 매시포테이토와 아스파라거스", description: "버터 풍미 가득한 부드러운 감자 메쉬 위에 육즙을 얹어 한 입에 베어먹는 클래식한 명품 가니쉬 사이드", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "스페셜 테이블 및 단체 섭외 신청",
        subtitle: "방문 날짜 및 시간, 예약 인원수(단체 룸 보유), 희망 굽기 정도(미디엄 레어 권장), 기념일 여부를 기재해 문의해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "스테이크 테이블 예약"
        }
      }
    ]
  },

  vegan_garden_bistro: {
    templateId: "vegan_garden_bistro",
    name: "그린가든 오가닉 비건 레스토랑",
    category: "Restaurant",
    description: "싱그러운 비타민이 가득 느껴지는 알팔파 연그린과 맑고 따스한 레몬 베이지 조화로 유기농 농가와 100% 식물성 브런치의 가치를 전하는 비건 다이닝 테마입니다.",
    image: "/templates/vegan_garden_bistro.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#166534",     // 싱그러운 숲속 리프 그린
        secondary: "#f0fdf4",   // 청정 채소 연그린
        accent: "#d97706",      // 크래프트 호밀 베이지
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 깨끗하고 위생적인 세라믹 테이블
        text: "#14532d"         // 눈이 편안한 포레스트 틸 차콜
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "맛있게 먹는 즐거움은 그대로, 나와 지구를 수호하는 100% 식물성 미식",
        subtitle: "뻑뻑하고 영양 없는 다이어트 풀잎이 아닙니다. 풍부한 단백질을 지닌 병아리콩 템페와 구운 단호박, 그리고 엑스트라 버진 올리브유 홈메이드 소스로 칼로리는 낮추고 풍미는 최대로 끌어올린 오가닉 비건 레스토랑입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
          ctaText: "비건 라이프스타일 테이블 예약",
          ctaLink: "#services",
          features: [
            { text: "로컬 농가 협동조합에서 매일 아침 직송하는 당일 수확 무농약 유기농 식자재 100% 사용 보증" },
            { text: "화학 보존제, 정제 설탕, 동물성 조미료 전혀 없이 발효 효소만으로 맛을 내 소화가 편안한 웰빙" }
          ]
        }
      },
      {
        section_type: "services",
        title: "그린가든 시그니처 메뉴",
        subtitle: "식물성 단백질과 유기농 섬유질로 몸과 마음을 투명하게 정화하는 한 그릇 요리입니다.",
        content_data: {
          items: [
            {
              title: "바질 시드 아보카도 템페 보울",
              description: "잘 익은 부드러운 아보카도 반쪽과 구운 발효 콩 템페, 수제 바질 씨드 소스를 곁들인 고단백 파이토케미컬 보울입니다.",
              icon: "Leaf"
            },
            {
              title: "식물성 콩단백 구이와 퀴노아 라이스",
              description: "대두 단백 숯불구이와 현미 곤약밥, 구운 파프리카 허브 마리네이드를 한 데 엮어 칼륨과 단백질을 채운 덮밥입니다.",
              icon: "Zap"
            },
            {
              title: "무설탕 코코넛 요거트 & 제철 베리",
              description: "코코넛 밀크 유산균 발효 요거트에 블루베리, 라즈베리를 얹고 천연 메이플 시럽으로 단맛을 더한 오가닉 디저트입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "비건은 맛을 참아내는 금욕적인 식사가 아닌, 자연이 선사한 미생물의 풍부한 미식을 즐기는 축제입니다",
        subtitle: "육류 소비를 단 한 끼 줄이는 행동만으로도 수십 그루의 소나무를 심는 친환경 공존이 시작됩니다.",
        content_data: {
          description: "안녕하십니까. 그린가든 비건 레스토랑의 대표 셰프이자 건강 코치입니다. 채식 요리는 맛이 없고 금방 배가 꺼진다는 편견이 있습니다. 하지만 우리는 아몬드 밀크의 불포화 지방산, 구운 견과류 소스의 깊은 고소함, 대체육의 직화 참나무 향을 공학적으로 결합하여, 일반 육식 식사보다 속은 훨씬 편안하면서도 입안 가득 깊은 미식 풍미를 완성해 냅니다.",
          stats: [
            { label: "로컬 농가 직송 비중", value: "100%" },
            { label: "자체 보유 비건 소스 레시피", value: "35가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "유기농 키친 & 싱그러운 다이닝 룸",
        subtitle: "미세먼지 차단 식물들이 가득 차 쾌적한 산소와 피톤치드를 제공하는 친자연 시설입니다.",
        content_data: {
          items: [
            { title: "수경 재배 스마트 팜 쇼케이스", description: "원내 유기농 채소들이 물빛을 받으며 깨끗하게 수중 재배되고 있는 모습을 투명하게 공개하는 식기실", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80" },
            { title: "친환경 재생 목재 나무 테이블 석", description: "따스한 햇살이 드는 통창 가에 앉아 은은한 차를 마시며 샐러드 보울을 즐기는 프라이빗 다이닝 공간", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 견과 코코넛 요거트 메이킹", description: "합성 화학 유화제 없이 코코넛 크림에 유산균을 넣어 직접 24시간 동안 배양해 내는 정직한 조리실 전경", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오가닉 비건 테이블 예약",
        subtitle: "방문 날짜 및 시간, 예약 인원수, 기피하시는 견과류 알레르기 유무를 편안하게 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "비건 테이블 예약하기"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 2: Korean Palace, Dim Sum, Bakery, Taco, Gastropub
  // ==========================================
  traditional_korean_palace: {
    templateId: "traditional_korean_palace",
    name: "수라간 프리미엄 정통 한정식",
    category: "Restaurant",
    description: "전통 한지의 아늑한 웜 베이지와 놋쇠 황동 골드, 기품 있는 대추 레드가 조화를 이루며 궁중 한정식과 귀한 손님 접대의 기품을 높여주는 테마입니다.",
    image: "/templates/traditional_korean_palace.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4a3c31",     // 깊은 궁중 오동나무 브라운
        secondary: "#d4af37",   // 전통 유기 황동 골드
        accent: "#7c2d12",      // 고풍스러운 붉은 낙관 대추 레드
        background: "#f5ece1",  // 한지 물결 연베이지
        surface: "#ffffff",     // 맑고 깨끗한 한지 테이블보 화이트
        text: "#29211c"         // 묵직한 잉크 블랙 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "임금님의 수라상에 올리던 정성과 기품을, 놋그릇에 따뜻하게 담아냅니다",
        subtitle: "전국 각지의 지리적 표시제 특산물 명품 식재료만을 고집하여, 오장육부의 원기를 보양하고 막힌 혈맥을 부드럽게 복원하는 30년 전통 명가 프리미엄 궁중 한정식 다이닝입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "궁중 코스 요강 예매",
          ctaLink: "#services",
          features: [
            { text: "대한민국 공식 한식 조리 명장 시니어 원장단 직접 침도 전수 정통 조리" },
            { text: "음식이 닿는 식기 전원 무균 멸균 살균 소독 관리되는 무독성 전통 황동 유기 그릇 전면 사용" }
          ]
        }
      },
      {
        section_type: "services",
        title: "수라간 궁중 코스",
        subtitle: "막힌 어혈을 기분 좋게 풀어주며 전신의 원기를 북돋아 주는 귀한 식사 처방입니다.",
        content_data: {
          items: [
            {
              title: "시그니처: 신선로 한방 보양 탕",
              description: "황동 신선로 그릇 가운데 숯불을 피워 전복, 인삼, 밤을 넣고 맑게 다려 낸 궁중 대표 보양 요리입니다.",
              icon: "Flame"
            },
            {
              title: "한우 수제 떡갈비와 전복 조림",
              description: "한우 갈빗살을 칼끝으로 곱게 다져 대추 즙으로 단맛을 내고 석쇠에 직화로 구워내 풍미가 뛰어납니다.",
              icon: "Award"
            },
            {
              title: "보리굴비 정식 & 가마솥 가마솥 밥",
              description: "전남 영광 법성포에서 해풍으로 말린 보리굴비를 쌀뜨물에 쪄내고 갓 지은 가마솥 현미밥과 얼음 녹차물을 서빙합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "한식은 자극적인 매운맛의 양념 기교가 아닌, 대자연의 제철 식재료 본연의 약성을 수확하는 과정입니다",
        subtitle: "모든 음식은 당일 새벽 무작정 많이 끓이지 않고, 오직 예약된 수량만큼만 옹기 약탕기에서 다려집니다.",
        content_data: {
          description: "안녕하십니까. 수라간 한정식의 오너 대표입니다. 우리가 상에 올리는 한식은 단순히 입을 즐겁게 하는 외식이 아닌, 평생을 약물 없이 건강하게 생활하도록 이끄는 '약식동원(藥食同源: 음식과 약은 기원이 같다)'의 한방 철학을 따릅니다. 툇마루 너머로 중정 소나무가 바라보이는 정갈하고 안락한 독방에서 귀한 손님과의 지적인 비즈니스와 효도 모임을 완성해 보십시오.",
          stats: [
            { label: "연간 대접 VIP 고객 수", value: "24,000명+" },
            { label: "보유 전통 무독성 유기 세트", value: "65인분 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "정갈한 툇마루 한옥 방 & 장독대",
        subtitle: "은은한 계피와 쌍화차 향취가 풍기는 품격 높은 고풍스러운 힐링 전통 공간 전경입니다.",
        content_data: {
          items: [
            { title: "개인 프라이빗 온돌 한옥 룸", description: "창호지 한지 덧창 사이로 소나무 중정이 보이고 놋그릇 식기들이 정갈하게 세팅된 좌식 다이닝 스페이스", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "마당에 가지런히 늘어선 장독대들", description: "3년 된 유기농 매실 청, 5년 숙성 씨간장이 옹기 숨을 쉬며 은은한 깊이를 더해가는 원내 마당 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "한우 떡갈비 석쇠 직화 조리실", description: "참나무 숯불 연기 위에서 갈빗살 석쇠를 뒤집으며 불맛을 고기 속까지 정교하게 입히는 셰프의 조리 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "궁중 테이블 및 단체 룸 예약 신청",
        subtitle: "방문 날짜 및 시간, 코스 메뉴 선택, 예약 인원수, 그리고 휠체어 이용 어르신 동반 여부를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "한정식 테이블 예약"
        }
      }
    ]
  },

  chinese_dynasty_dimsum: {
    templateId: "chinese_dynasty_dimsum",
    name: "화양연화 모던 차이니즈 & 딤섬",
    category: "Restaurant",
    description: "매혹적인 딥 와인 버건디와 시선을 포착하는 오리엔탈 에메랄드 그린, 골드 액센트로 화려하고 트렌디한 모던 차이니즈와 수제 딤섬을 보여주는 테마입니다.",
    image: "/templates/chinese_dynasty_dimsum.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4c0519",     // 홍콩 영화관 딥 버건디
        secondary: "#d4af37",   // 클래식 브라스 황동 골드
        accent: "#0f766e",      // 오리엔탈 에메랄드 틸 그린
        background: "#0c0a09",  // 묵직한 영사 암막 차콜 블랙
        surface: "#1c1917",     // 낡은 목조 테이블 다크 브라운
        text: "#f5f5f4"         // 시인성 높은 은빛 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "대나무 찜기 속에서 터져 나오는 풍부한 육즙과 불맛 가득한 모던 차이니즈",
        subtitle: "홍콩 하버뷰 레스토랑 수석 딤섬 아티스트의 정교한 24주름 딤섬 성형 기술과, 웍 안의 초고열 화염 통제 기술로 완성한 격조 높은 차이니즈 퀴진 다이닝 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "딤섬 예약 캐치테이블",
          ctaLink: "#contact",
          features: [
            { text: "피의 두께 0.1mm 이하로 만두 속이 투명하게 비치는 초정밀 수제 하가우, 샤오롱바오 완비" },
            { text: "중국 베이징 덕 화덕에서 12시간 동안 기름기를 쏙 빼며 참나무 향을 스며들게 구워낸 북경오리 에디션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "화양연화 대표 메뉴",
        subtitle: "식욕을 요동치게 만드는 풍부한 미학적 중식 시그니처 목록입니다.",
        content_data: {
          items: [
            {
              title: "트러플 샤오롱바오 딤섬",
              description: "얇은 밀가루 피 속에 흑돼지 고기 육즙과 세계 3대 진미 송로버섯 향을 가득 가둔 럭셔리 딤섬입니다.",
              icon: "Sparkles"
            },
            {
              title: "화덕 베이징 덕 베이징 덕",
              description: "참나무 가마 안에서 오리를 매달아 겉은 크래커처럼 바삭하게 태우고 속은 육즙을 가둔 명장 요리입니다.",
              icon: "Flame"
            },
            {
              title: "마라 향 항정살 꿔바로우",
              description: "바삭한 찹쌀 튀김옷을 입힌 항정살 위에 알싸한 사천식 특제 초록 마라 소스를 가볍게 토핑했습니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "중식은 단순히 기름진 볶음이 아닌, 웍 내부의 공기 흐름과 불꽃의 온도를 다스리는 물리적 융합입니다",
        subtitle: "대나무 찜기의 스팀 스팀 압력 1.2기압은 만두 피의 촉촉함을 최고로 유지합니다.",
        content_data: {
          description: "안녕하십니까. 화양연화의 오너 셰프입니다. 우리는 뻔한 프랜차이즈 중식당의 공장제 냉동 만두를 단호히 거부합니다. 만두 피를 손으로 직접 밀어내어 쫄깃함을 극대화하고, 신선한 돼지 껍데기 콜라겐 육수 젤리를 만두 속에 같이 심어 스팀을 가할 때 육즙의 화려한 분수를 뿜어내게 만듭니다. 아늑한 붉은 등 조명 아래, 홍콩 영화 속으로 타임머신을 타고 들어간 듯한 미식 낭만을 만나보세요.",
          stats: [
            { label: "하루 손수 빚는 딤섬 개수", value: "1,200개" },
            { label: "중국 본토 보유 주방 경력", value: "평균 18년" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "오리엔탈 붉은 조명 룸 & 웍 주방",
        subtitle: "무비 스냅처럼 감각적인 컷이 연출되는 매혹적인 아날로그 중식 다이닝 공간 전경입니다.",
        content_data: {
          items: [
            { title: "홍콩 감성 에메랄드 둥근 테이블 룸", description: "붉은 실크 전등 아래서 회전 테이블을 돌리며 요리와 북경오리를 함께 쉐어하는 단독 비즈니스 룸", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80" },
            { title: "베이징 덕 대형 가마 화덕 코너", description: "갈고리에 꿴 북경오리가 참나무 연기 속에서 황금빛 갈색으로 마르며 구워지는 오리지널 주방 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "딤섬 아티스트의 24주름 성형 매칭", description: "대나무 밀대를 굴려 만두 피를 0.5mm 이하로 얇게 밀어내고 고기 속을 정교하게 담아 오므리는 셰프 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오리엔탈 룸 & 테이블 예약 의뢰",
        subtitle: "방문 날짜 및 세션(런치/디너), 동반 인원수, 북경오리 1마리 사전 주문 여부를 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "딤섬 테이블 예약"
        }
      }
    ]
  },

  cozy_bakery_patisserie: {
    templateId: "cozy_bakery_patisserie",
    name: "밀라포레 아티잔 유기농 베이커리",
    category: "Restaurant",
    description: "갓 구운 바게트와 크루아상에서 풍겨 나오는 고소한 크래프트 옐로우 베이지와 밀가루 반죽 크림 아이보리 조화로 오가닉 건강 빵의 가치를 높인 베이커리 테마입니다.",
    image: "/templates/cozy_bakery_patisserie.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#8b5a2b",     // 갓 구운 호밀 식빵 브라운
        secondary: "#f5ebe0",   // 밀가루 반죽 크림 베이지
        accent: "#166534",      // 신선한 허브 오일 그린
        background: "#faf6f0",  // 아늑하고 따뜻한 빵집 웜 베이지
        surface: "#ffffff",     // 깨끗한 나무 쇼케이스 유리가 있는 화이트
        text: "#3e2723"         // 에스프레소 초콜릿 다크 차콜
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "천연 르방 효모로 24시간 저온 숙성하여 소화가 편안한 건강한 아침 빵",
        subtitle: "유기농 통밀가루와 프랑스 버터를 아낌없이 결합하여, 화학 유화제나 마가린 전혀 없이 오직 천연 발효 공법만으로 식사 대용 깜빠뉴와 바삭한 크루아상을 오븐에서 직접 구워내는 아티잔 베이커리입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘 아침 빵 라인업 보기",
          ctaLink: "#services",
          features: [
            { text: "직접 배양한 천연 르방 효모균을 활용해 글루텐 분해를 유도하여 속 편한 소화력 보장" },
            { text: "프랑스 국가 승인 엘르앤비르(Elle & Vire) 프리미엄 고메 고메 버터 100% 사용 낙농 인증" }
          ]
        }
      },
      {
        section_type: "services",
        title: "밀라포레 시그니처 빵",
        subtitle: "빵순이들의 영혼을 따뜻하게 위로하는 매일 아침 구워내는 명품 식사 빵 목록입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 사워도우 깜빠뉴",
              description: "유기농 호밀가루와 소금, 물, 천연 르방만으로 24시간 숙성해 바삭한 누룽지 껍질과 촉촉한 속살의 겉바속촉 극치입니다.",
              icon: "Cookie"
            },
            {
              title: "72겹 벨벳 버터 크루아상 크루아상",
              description: "프랑스 고급 고메 버터를 겹겹이 밀어 넣어 오븐에서 구워내어 바삭하고 깊은 우유 풍미가 흘러넘칩니다.",
              icon: "Sparkles"
            },
            {
              title: "무설탕 유기농 무화과 통밀식빵",
              description: "정제 설탕 대신 말린 무화과 당분으로만 단맛을 내고 호두를 토핑해 매일 아침 식사 대용으로 든든합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "빵은 단순히 탄수화물을 채우는 소모품이 아닌, 유익균과 온도, 습도가 함께 빚는 발효 공학 예술입니다",
        subtitle: "오븐 온도 210도는 크루아상 내부의 수분이 증발하며 수십 개의 미세 공기층을 형성하게 돕습니다.",
        content_data: {
          description: "안녕하십니까. 밀라포레 베이커리의 헤드 블랑제리(Boulangerie)입니다. 우리는 화학 개량제와 팽창제를 넣어 공기만 부풀려 소화불량을 유발하는 양산형 빵을 단호히 거부합니다. 우리는 생두 로스팅을 하듯 원맥을 직접 맷돌에 갈아 가루를 내고, 아침 5시부터 온실 발효실 안의 유산균 배양 상태를 꼼꼼하게 노크 소리로 감별하여 빵을 구워냅니다.",
          stats: [
            { label: "자체 배양 천연 르방 나이", value: "8년차 효모균" },
            { label: "당일 완판 빵 종류 수", value: "24종 에센셜" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "따스한 오븐 주방 & 원목 쇼케이스",
        subtitle: "은은한 버터와 호밀 향기가 골목길 전체에 따스하게 풍기는 아늑한 빵집 전경입니다.",
        content_data: {
          items: [
            { title: "대형 독일제 돌 오븐 베이킹 코너", description: "오븐 문을 여는 순간 뜨거운 김과 함께 노릇노릇한 바게트가 쏟아져 나오는 화사한 조리 찰나", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 빈티지 원목 가구 빵 진열대", description: "화사한 유광 유리 돔 아래 오븐에서 갓 나온 크루아상과 페스츄리가 아기자기하게 진열된 모습", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "아침 맷돌 천연 호밀 원맥 제분기", description: "화학 정제 가루 대신 무농약 호밀 알곡을 맷돌 돌날로 분쇄하여 빵가루 원액을 생산하는 청결한 실무실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "당일 빵 예약 픽업 및 정기 구독 문의",
        subtitle: "원하시는 빵 종류와 수량, 픽업 방문 예정 시간, 그리고 카페 원두 납품 정기 유통 문의를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "당일 빵 픽업 예약"
        }
      }
    ]
  },

  mexican_cantina_spicy: {
    templateId: "mexican_cantina_spicy",
    name: "엘타코 바이브 정통 멕시칸",
    category: "Restaurant",
    description: "타오르는 멕시코 태양 선셋 주황과 산뜻한 식물성 코랄 레드, 그리고 라임 민트 그린 배합이 타코와 퀘사디아의 이국적인 파티 분위기를 선사하는 멕시칸 비스트로 테마입니다.",
    image: "/templates/mexican_cantina_spicy.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 아스팔트 주황
        secondary: "#fed7aa",   // 옥수수 또띠아 옐로우 베이지
        accent: "#16a34a",      // 청량한 라임 고수 그린
        background: "#fafaf6",  // 무자극 오프화이트 그레이
        surface: "#ffffff",     // 깨끗한 철제 테이블 화이트
        text: "#18181b"         // 시인성 높은 다크 슬레이트 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "옥수수를 맷돌에 직접 갈아 구운 고소한 또띠아와 매콤한 생 할라피뇨 살사",
        subtitle: "기계로 찍어낸 밀가루 또띠아가 아닙니다. 정통 멕시코 타코 캔티나 방식으로, 100% 옥수수 알곡을 반죽하여 구워내 풍미가 다른 수제 또띠아 위에 직화로 구워낸 소고기와 신선한 아보카도 과카몰리를 얹어내는 라틴 미식입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘의 나초 앤 타코 세트 보기",
          ctaLink: "#services",
          features: [
            { text: "생토마토, 적양파, 레몬즙만을 손으로 다져 매일 3회 직접 조제하는 신선한 수제 살사 소스" },
            { text: "시원하고 탄산 강한 데킬라 칵테일 마가리타와 라임 코로나 맥주 상시 구비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "엘타코 추천 타코",
        subtitle: "입안 가득 이국적인 라틴 살사 아로마를 뿜어내는 가성비 극상 메뉴 리스트입니다.",
        content_data: {
          items: [
            {
              title: "스파이시 포크 수제 카르니타스 타코",
              description: "오렌지와 콜라, 향신료를 넣어 5시간 삶아 부드럽게 찢어낸 돼지고기와 라임 고수를 얹은 정통 타코입니다.",
              icon: "Flame"
            },
            {
              title: "쉬림프 아보카도 과카몰리 퀘사디아",
              description: "고소한 밀 또띠아 사이에 그릴드 새우와 모짜렐라 치즈, 아보카도 과카몰리를 가득 채워 그릴에 구웠습니다.",
              icon: "Heart"
            },
            {
              title: "치폴레 비프 브리또 보울 보울",
              description: "강인한 치폴레 칠리 소스로 볶아낸 다진 소고기와 나초 칩, 퀴노아 샐러드를 밥 위에 얹어 비벼 먹는 디톡스 한 끼입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "타코는 격식을 차려 나이프로 썰어 먹는 가식이 아닌, 두 손으로 또띠아를 꼭 쥐고 한 입에 육즙을 베어 먹는 소통입니다",
        subtitle: "모든 또띠아는 주문 즉시 무쇠 그릴 위에서 따뜻하게 구워져 서빙됩니다.",
        content_data: {
          description: "안녕하십니까. 엘타코 캔티나의 멕시코 현지 조리 유학 출신 대표 셰프입니다. 우리는 수입 통조림 소스와 보존제가 들어간 가공품을 단호히 거부합니다. 당일 수확한 신선한 토마토와 고수의 엽록소 비타민 성분을 훼손 없이 컵에 담아내고, 라틴풍의 신나는 레게톤 음악이 흐르는 이국적인 라운지에서 당신의 스트레스를 유쾌하게 날려버리겠습니다.",
          stats: [
            { label: "당일 출고 또띠아 수량", value: "850장" },
            { label: "보유 수입 데킬라 라인업", value: "14종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "라틴 바이브 라운지 & 타코 그릴",
        subtitle: "보기만 해도 라틴 파티 음악 소리가 들리는 듯한 알록달록하고 에너제틱한 공간 전경입니다.",
        content_data: {
          items: [
            { title: "네온 조명 가득한 비스트로 라운지", description: "선인장 로고가 반짝이고 남미풍 직조 인테리어가 장식되어 데킬라를 함께 마시는 캐주얼 테이블", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80" },
            { title: "무쇠 무쇠 타코 그릴과 훈연 육즙", description: "소고기와 돼지고기 카르니타스가 철판 위에서 노릇노릇 구워지며 맛깔스러운 시각 연출을 자랑하는 주방", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "라임 과카몰리와 나초 칩 보울 보울", description: "돌절구 안에 잘 으깬 초록 아보카도 과카몰리와 레몬즙을 믹싱하여 바삭한 옥수수 나초와 서빙하는 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "타코 라운지 예약 및 제휴 문의",
        subtitle: "방문 희망 날짜, 인원수, 멕시코 마가리타 주류 패키지 사전 예약 여부를 기재해 신청을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "타코 테이블 예약"
        }
      }
    ]
  },

  craft_beer_brewery: {
    templateId: "craft_beer_brewery",
    name: "더탭 하이퍼 로컬 브루어리",
    category: "Restaurant",
    description: "인더스트리얼하고 현대적인 슬레이트 네이비와 에너제틱한 골든 비어 호프 황동 골드 포인트 배합으로 신선한 자가 양조 맥주를 보여주는 브루어리 테마입니다.",
    image: "/templates/craft_beer_brewery.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#b45309",     // 황금빛 필스너 맥주 골드
        secondary: "#e2e8f0",   // 스마트 클린 슬레이트 메탈
        accent: "#10b981",      // 싱그러운 아로마 홉 그린
        background: "#090d16",  // 미래적인 다크 나이트 펍
        surface: "#111827",     // 은빛 알루미늄 케그 차콜 슬레이트
        text: "#f3f4f6"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지하 지하 맥주 저장탱크에서 배관을 타고 갓 뽑아낸 수제 홉의 향연",
        subtitle: "대기업의 물 탄 듯 싱거운 공장제 합성 맥주를 단호히 거부합니다. 자체 매장 내 독일식 동 증류 저장탱크에서 맥아를 끓이고 신선한 시트라 홉(Citra Hop)을 정량 투하해 발효시킨 진짜 생수제 맥주와 수제 안주 다이닝 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금주의 자가양조 라인업 보기",
          ctaLink: "#services",
          features: [
            { text: "실시간 아로마 수제 맥주 홉의 향기를 최대로 유지하는 콜드체인 냉장 케그 유통 필터 시스템 탑재" },
            { text: "수제 맥주와 완벽 마리아주 공명을 자아내는 그릴드 피쉬앤칩스, 수제 소시지 플레이트 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "더탭 탭 리스트",
        subtitle: "로컬 맥주 감별사들이 극찬한 자가 양조 생맥주 목록입니다.",
        content_data: {
          items: [
            {
              title: "시트라 홉 가득한 인디아 페일 에일 (IPA)",
              description: "쌉싸름한 홉의 쓴맛과 함께 망고, 패션후르츠 열대 과일 아로마 향이 코끝을 기분 좋게 요동치게 만듭니다.",
              icon: "Zap"
            },
            {
              title: "벨기에 스타일 부드러운 밀맥주 (Witbier)",
              description: "오렌지 필과 고수 씨앗을 넣어 맑고 향긋하면서도 바나나 향의 부드러운 거품 벨벳 잔향을 선사합니다.",
              icon: "Heart"
            },
            {
              title: "로스팅 맥아 흑맥주 오트밀 스타우트 (Stout)",
              description: "다크 초콜릿과 잘 볶은 에스프레소 커피의 중후한 향취가 묵직하게 목을 타고 넘어가는 깊은 스타우트입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "맥주는 물을 타지 않고, 오직 맥아와 홉, 물, 효모 4가지 순수한 원료가 만드는 시간의 예술입니다",
        subtitle: "양조 탱크 온도 12도는 상면 발효 에일 맥주가 최고의 향을 머금게 돕는 과학적 공식입니다.",
        content_data: {
          description: "안녕하십니까. 더탭 브루어리의 대표 브루마스터(Brewmaster)입니다. 유통기한을 늘리기 위해 여과와 살균을 거쳐 효모를 다 죽여버린 죽은 캔맥주에 만족하셨나요? 진짜 맥주는 살아있는 효모가 뿜어내는 미세 이산화탄소 거품과 홉의 생생한 비타민 오일 성분이 살아있어야 목 넘김이 탄산 따가움 없이 부드럽게 녹아납니다. 매장에 오셔서 오감 자극을 느껴보세요.",
          stats: [
            { label: "보유 자가양조 탱크 용량", value: "4,000리터" },
            { label: "정기 탭룸 매니아 회원", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "동 증류 탱크실 & 인더스트리얼 탭룸",
        subtitle: "은빛 알루미늄 가구와 맥주 탱크가 세련되게 세팅된 아늑한 실내 펍 전경입니다.",
        content_data: {
          items: [
            { title: "원내 대형 수제 맥주 발효 탱크룸", description: "유리 통창을 통해 맥주가 보글보글 유산균 발효 숙성되는 탱크의 거대한 은빛 외관을 감상하는 코너", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80" },
            { title: "12구 오리지널 황동 브라스 맥주 탭", description: "주문 즉시 잔을 45도로 기울여 황금빛 맥주와 크리미한 벨벳 거품 비중을 맞추며 낙차 푸어링하는 바 테이블", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "자가 맥아 홉 끓임 냄비 제분기", description: "화학 정제 설탕 없이 보리 알곡을 맷돌 제분하여 단맛을 우려내고 홉을 끓여내는 위생적인 브루 주방 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "탭룸 테이블 예약 및 기업 대관 신청",
        subtitle: "방문 예정 일시, 단체 인원 수, 케이터링 맥주 무제한 패키지 사전 주문 여부를 기재해 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "수제 맥주 테이블 예약"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 3: Seafood, Ramen, Dessert, Brunch, Texas BBQ
  // ==========================================
  seafood_wharf_fresh: {
    templateId: "seafood_wharf_fresh",
    name: "블루크랩 시푸드 & 오이스터 바",
    category: "Restaurant",
    description: "청량하고 신선한 사파이어 오션 블루와 맑은 펄 오프화이트, 레몬 주황 액센트가 결합하여 지중해 시푸드와 하프쉘 오이스터의 청정함을 전달하는 테마입니다.",
    image: "/templates/seafood_wharf_fresh.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#0284c7",     // 청량한 사파이어 바다 블루
        secondary: "#e0f2fe",   // 시원하고 맑은 클라우드 스카이
        accent: "#ea580c",      // 비타민 선셋 오렌지 레몬
        background: "#fafcfd",  // 퓨어 아쿠아 오프화이트
        surface: "#ffffff",     // 깨끗한 위생 대리석 테이블
        text: "#1e293b"         // 스마트하고 가독성 높은 네이비 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "바다 향기를 고스란히 머금은 얼음 위 하프쉘 오이스터와 시원한 화이트 와인",
        subtitle: "당일 이른 아침 통영 해녀가 직송하여 껍질째 쪼갠 싱싱한 참굴(Oyster)과 캐나다산 대형랍스터 찜 요리를 비린 맛 전혀 없이 투명하고 안전하게 조리해 바치는 하이엔드 해산물 다이닝 파티룸입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘 아침 시푸드 수확 확인",
          ctaLink: "#services",
          features: [
            { text: "감염 우려를 완벽하게 차단하기 위해 0도 오차 없는 빙결 얼음 플레이트 위 서빙 위생 엄수" },
            { text: "해산물 고유의 단맛과 시트러스 아로마를 극대화하는 샤블리(Chablis) 화이트 와인 페어링 가이드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "시푸드 라인업",
        subtitle: "바다의 깨끗한 엽록소 비타민과 해산물 감칠맛을 최대로 돋보이게 담아낸 메뉴입니다.",
        content_data: {
          items: [
            {
              title: "참나무 훈연 버터 랍스터 테일",
              description: "통통한 랍스터 살점에 버터와 레몬즙을 발라 무쇠 그릴에 불맛을 입혀 구워낸 럭셔리 요리입니다.",
              icon: "Flame"
            },
            {
              title: "하프쉘 오이스터 & 레몬 진주 타르트",
              description: "싱싱한 활 참굴 위에 다진 양파 샬롯과 레드 와인 식초 소스, 레몬 조각을 얹어 한 입에 바다 향취를 맛봅니다.",
              icon: "Droplet"
            },
            {
              title: "지중해식 해산물 토마토 스튜 뽀뻬",
              description: "모짜렐라 오징어와 홍합, 꽃게를 이탈리아 토마토 소스와 올리브 오일에 자작하게 졸여낸 해장용 스튜입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "시푸드는 요리 기술보다, 수조 안의 물의 온도와 당일 직송 유통 속도가 요리의 90%를 결정합니다",
        subtitle: "굴 껍질을 쪼갤 때는 칼날이 굴 살점막을 훼손해 즙이 새지 않게 0.1mm 단위로 조각합니다.",
        content_data: {
          description: "안녕하십니까. 블루크랩 시푸드의 대표 셰프입니다. 우리는 수입 냉동 해산물의 질기고 비린 맛을 단호히 거부합니다. 우리는 동해 대게, 서해 꽃게, 남해 굴의 지리적 산지에 전용 탑차를 가동해 산소 수조 상태를 유지한 채 매장 주방으로 바로 조달합니다. 샹들리에가 바다 물결처럼 반짝이는 청정 비스트로 라운지에서 최상의 바다 풍미를 호흡해 보세요.",
          stats: [
            { label: "당일 완판 신선한 활 해산물 수량", value: "350kg" },
            { label: "협력 청정 어부 파트너", value: "14명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "시푸드 바스 얼음 진열대 & 수조",
        subtitle: "감상하는 것만으로도 바다 바람의 청량함을 안겨주는 맑은 인테리어 전경입니다.",
        content_data: {
          items: [
            { title: "얼음 위 오이스터 진열 테이블", description: "곱게 갈아 낸 눈꽃 얼음 위에 신선한 석화 굴과 레몬, 로즈마리가 이쁘게 수놓아진 원내 대표 쇼케이스", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80" },
            { title: "프리미엄 지중해 랍스터 아쿠아리움 수조", description: "기포 산소 펌프가 세차게 가동되며 살아있는 캐나다산 랍스터들이 위풍당당하게 머무는 유리 수조관", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "그릴 오징어와 새우 믹스 플레이팅 스냅", description: "무쇠 무쇠 팬 위에 노릇하게 구워진 킹프론 새우와 파프리카, 오렌지 가니쉬를 올린 장인의 수기 요리 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "시푸드 테이블 및 프라이빗 룸 예약 신청",
        subtitle: "방문 예정 일시, 예약 인원 수, 와인 콜키지 추가 신청 여부, 그리고 알레르기 기피 식재료가 있다면 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "시푸드 테이블 예약"
        }
      }
    ]
  },

  japanese_ramen_yokocho: {
    templateId: "japanese_ramen_yokocho",
    name: "라멘 요코초 정통 일본식 라멘 & 이자카야",
    category: "Restaurant",
    description: "일본 도쿄 신주쿠 요코초의 밤골목 정취를 담은 붉은 홍등 주황과 빈티지 마호가니 차콜 우드 배합이 사색적인 1인 라멘 및 정통 꼬치구이를 보여주는 테마입니다.",
    image: "/templates/japanese_ramen_yokocho.png",
    theme: {
      fontFamily: "Noto Serif KR, East Sea Dokdo, serif",
      colors: {
        primary: "#4a0404",     // 도쿄 홍등 타오르는 붉은 브라운
        secondary: "#e6ccb2",   // 빈티지 나무 툇마루 크림 베이지
        accent: "#d4af37",      // 라멘 노른자 반숙 반짝 골드
        background: "#0c0806",  // 요코초 밤골목 다크 차콜
        surface: "#1c120c",     // 낡은 목조 테이블 텍스처
        text: "#ede0d4"         // 가독성 높은 온화한 크림 오프화이트
      },
      borderRadius: "rounded-sm",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "돼지 사골 뼈를 24시간 우려낸 진하고 묵직한 돈코츠 육수와 자가제면",
        subtitle: "스마트폰 소음을 끄고 1인 단독 칸막이 커튼 좌석에 앉아, 셰프가 직접 제면한 쫄깃한 하소카타 면발과 두툼하게 불맛을 입힌 수제 삼겹 챠슈의 기품 있는 공명을 맛보는 라멘 & 이자카야 펍입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘 밤 야간 타임 테이블 예약",
          ctaLink: "#contact",
          features: [
            { text: "돼지 사골, 닭 뼈를 가마솥에서 24시간 동안 진액을 추출해 낸 묵직하고 고소한 돈코츠 베이스 육수" },
            { text: "1인 단독 칸막이 커튼 가벽 시공을 통해 타인의 눈치 볼 필요 없는 완벽한 혼밥 사색 사양" }
          ]
        }
      },
      {
        section_type: "services",
        title: "요코초 대표 메뉴",
        subtitle: "심장 박동과 침샘을 정교하게 흔드는 일본 정통 이자카야 퀴진 목록입니다.",
        content_data: {
          items: [
            {
              title: "돈코츠 챠슈 라멘",
              description: "24시간 사골 육수에 자가제면 얇은 면발, 그리고 직화로 그을린 삼겹살 차슈 두 장과 온천 달걀 아지타마고를 얹었습니다.",
              icon: "Flame"
            },
            {
              title: "수제 야키토리 5종 세트",
              description: "닭 안심, 파닭, 염통 꼬치를 일본 전통 데리야끼 소스 타레를 발라 숯불에 노릇하게 타격 구워낸 꼬치구이입니다.",
              icon: "Compass"
            },
            {
              title: "유기농 나가사키 카라 짬뽕",
              description: "신선한 오징어, 꽃게, 홍합을 불에 달군 웍에 숙주와 볶아내어 칼칼하고 시원하게 뿜어낸 백탕 요리입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "라멘은 단순히 한 그릇의 면 요리를 넘어, 뼈가 녹아내릴 때까지 끓여낸 정성의 주파수입니다",
        subtitle: "모든 차슈 고기는 오븐에서 속까지 익힌 뒤, 서빙 직전 가스 토치로 표면에 불맛을 0.1초 매칭합니다.",
        content_data: {
          description: "안녕하십니까. 라멘 요코초의 마스터 대표 셰프입니다. 우리는 시중 물 탄 라멘 스프 분말 가루를 단호히 거부합니다. 매주 오직 한정된 육수 가마솥 분량만을 당일 소진 완료하며, 면발의 식감을 극대화하기 위해 수입 밀가루 수분율을 날씨 기온에 맞춰 계산 제면합니다. 은은한 오리엔탈 붉은 조명 아래서 가볍게 하이볼 잔을 흔들며 고단한 하루를 포근하게 위로하십시오.",
          stats: [
            { label: "완판 완료 라멘 그릇 수", value: "24,000그릇" },
            { label: "원내 대형 육수 가마솥", value: "2세트 상시 가동" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "요코초 붉은 홍등 테이블 & 바",
        subtitle: "일본 현지 선술집 느낌을 그대로 이식하여 정서적 쉼터를 주는 원목 인프라 전경입니다.",
        content_data: {
          items: [
            { title: "개인 1인 칸막이 다찌 카운터", description: "앞쪽 주방 커튼 사이로 라멘 한 그릇이 정갈하게 서빙되는 오롯이 혼자만의 식사에 집중하는 좌석", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80" },
            { title: "빈티지 선술집 목조 바 라운지", description: "아늑한 붉은 초롱 홍등이 흔들리고 원목 가구 벽면에 일본 포스터가 세련되게 장식된 꼬치구이 카운터", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "숯불 야키토리 석쇠 수기 조리실", description: "닭고기 꼬치가 붉은 참나무 숯 위에 올려져 노릇노릇 구워지며 맛깔스러운 불꽃 향취를 뿜어내는 오리지널 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "선술집 야간 대관 및 테이블 예약",
        subtitle: "방문 예정 일시, 예약 테이블 인원수, 꼬치구이 사케 패키지 사전 주문 유무를 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "라멘 요코초 예약 신청"
        }
      }
    ]
  },

  dessert_salon_sweet: {
    templateId: "dessert_salon_sweet",
    name: "스위트 하모니 디저트 살롱",
    category: "Restaurant",
    description: "화사하고 달콤한 파스텔 피치 핑크와 깨끗한 린넨 아이보리, 골든 브론즈 조합이 마카롱과 수제 타르트의 미학적 플레이팅을 보여주는 럭셔리 디저트 카페 테마입니다.",
    image: "/templates/dessert_salon_sweet.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#be123c",     // 매혹적인 라즈베리 핑크
        secondary: "#ffe4e6",   // 소프트 피치 핑크
        accent: "#fbbf24",      // 반짝이는 마카롱 골드
        background: "#fafaf9",  // 정갈한 대리석 오프화이트
        surface: "#ffffff",     // 맑고 깨끗한 디저트 트레이 화이트
        text: "#1c1917"         // 시인성 높은 다크 초콜릿 카본
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오감을 매료시키는 화사한 수제 마카롱과 기품 있는 프랑스 허브티 살롱",
        subtitle: "화학 향료나 마가린을 단호히 배제하고, 프랑스산 명품 고메 버터와 천연 바닐라 빈, 제철 무농약 베리류를 아낌없이 토핑하여 0.1g의 당도 밸런스까지 정교하게 조율한 하이엔드 수제 디저트 카페입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 디저트 패키지 예약",
          ctaLink: "#services",
          features: [
            { text: "벨기에산 프리미엄 칼리바우트 다크 카카오 초콜릿 원액 100% 사용 보증서 제공" },
            { text: "아티스트가 직접 프랑스 프로방스 야생 라벤더와 홍차 잎을 블렌딩한 로열 웰컴티 서빙" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디저트 에센셜",
        subtitle: "수작업을 통해 빵 굽기 온도와 수분율을 최대로 살린 고급 디저트 목록입니다.",
        content_data: {
          items: [
            {
              title: "72겹 벨벳 버터 밀푀유",
              description: "파이 시트 사이에 프랑스 천연 바닐라빈 커스터드 크림을 겹겹이 샌드하여 바삭하고 부드러운 식감을 뿜어냅니다.",
              icon: "Sparkles"
            },
            {
              title: "생과일 무화과 타르트 에디션",
              description: "고소한 아몬드 크림 타르트지 위에 무농약 영암 무화과를 올리고 수제 살구 마멀레이드를 피드백 터치했습니다.",
              icon: "Heart"
            },
            {
              title: "유기농 무설탕 마카롱 세트",
              description: "꼬끄의 쫀득함을 최대로 유지하고 설탕 대신 알룰로스 천연 단맛을 입혀 속이 편안한 디저트입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "디저트는 단순히 단맛을 채우는 간식이 아닌, 지친 일상에 한 줄기 설렘을 비추는 달콤한 구원입니다",
        subtitle: "마카롱 꼬끄 건조 습도 45%는 표면의 균열 없이 쫀득한 속살을 빚어내는 과학적 습도입니다.",
        content_data: {
          description: "안녕하십니까. 스위트 하모니 디저트 살롱의 헤드 파티시에(Patissier)입니다. 우리는 유통기한을 늘리기 위해 보존제를 쏟아붓고 공장에서 대량 생산하는 냉동 빵을 단호히 거부합니다. 우리는 매일 아침 새벽 우유에서 크림을 분리해 내고, 신선한 제철 과일의 비타민 성분을 훼손 없이 플레이팅하여 화사한 프랑스풍 살롱에서 여왕의 달콤한 휴식을 제공합니다.",
          stats: [
            { label: "누적 당일 구운 타르트 수", value: "5,800개" },
            { label: "소속 수석 파티시에 경력", value: "평균 12년" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "화사한 유리 쇼케이스 & 애프터눈 티",
        subtitle: "바라보는 것만으로도 행복 호르몬이 솟아오르는 아기자기하고 고급스러운 뷰티 전경입니다.",
        content_data: {
          items: [
            { title: "3단 은식기 디저트 타워 플레이트", description: "마카롱, 다쿠아즈, 스콘이 샹들리에 조명 빛을 받아 보석처럼 반짝이는 에스테틱 테이블 세팅", image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&q=80" },
            { title: "프랑스 수제 르방 발효 오븐 코너", description: "타르트지가 황금빛 갈색으로 마르며 은은한 버터 우유 향취를 방출하는 위생적인 베이킹 오븐룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "장미 꽃잎 차와 티포트 웰컴 셋업", description: "천연 장미 오일 향취를 머금은 차가 유리 컵 안에서 붉게 번져나가는 클래식한 테이블 데코레이션 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "애프터눈 티 세트 및 단체 예약 의뢰",
        subtitle: "방문 희망 날짜, 3단 타워 패키지 주문 여부, 기념일 초 서비스 필요 여부를 기재해 신청을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "디저트 살롱 예약 신청"
        }
      }
    ]
  },

  brunch_cafe_terrace: {
    templateId: "brunch_cafe_terrace",
    name: "더테라스 오가닉 브런치 & 에스프레소",
    category: "Restaurant",
    description: "화사한 아침 햇살이 가득 비치는 레몬 옐로우와 싱그러운 라임 그린, 그리고 포근한 리넨 아이보리 배합으로 여유로운 브런치와 스페셜티 에스프레소를 전하는 카페 테마입니다.",
    image: "/templates/brunch_cafe_terrace.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#15803d",     // 싱그러운 포레스트 가든 그린
        secondary: "#fef08a",   // 상큼한 시트러스 레몬 옐로우
        accent: "#ea580c",      // 비타민 선셋 오렌지
        background: "#fafcfb",  // 맑고 깨끗한 아침 공기 오프화이트
        surface: "#ffffff",     // 정갈한 리넨 테이블 화이트
        text: "#1c2317"         // 눈이 편안한 올리브 차콜
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "화사한 야외 야외 테라스 가든 속에서 즐기는 느긋한 아침 브런치",
        subtitle: "로컬 농가에서 당일 수확한 무농약 유기농 잎채소와 방사 방란 달걀로 빚어낸 수제 수란 아보카도 토스트, 그리고 에티오피아 스페셜티 원두의 꽃향기가 흐르는 에스프레소 카페입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘 아침 샐러드 보울 보기",
          ctaLink: "#services",
          features: [
            { text: "달걀의 노른자가 굳지 않고 부드럽게 흘러내리도록 82도 정밀 저온 조리한 수제 수란 에그 베네딕트" },
            { text: "에티오피아 내추럴 예가체프 스페셜티 원두 100% 라이트 로스팅 꽃향기 에스프레소" }
          ]
        }
      },
      {
        section_type: "services",
        title: "더테라스 브런치",
        subtitle: "나른한 오전을 상큼한 시트러스 에너지로 가득 채워주는 수제 다이닝 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "에그 베네딕트 & 유기농 홀랜다이즈",
              description: "바삭하게 구운 잉글리시 머핀 위에 훈제 연어, 정교한 수란, 그리고 레몬즙을 발라 직접 다듬은 홀랜다이즈 소스를 올렸습니다.",
              icon: "Heart"
            },
            {
              title: "바질 페스토 리코타 오픈토스트 오픈토스트",
              description: "천연 효모 사워도우 빵 위에 생바질 페스토와 수제 리코타 치즈, 토마토 마리네이드를 수놓은 웰빙 토스트입니다.",
              icon: "Leaf"
            },
            {
              title: "에티오피아 게이샤 필터 드립 커피",
              description: "자스민의 새하얀 꽃향기와 잘 익은 복숭아의 단맛이 맑고 투명하게 목을 타고 순환하는 최고가 브루잉 커피입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "브런치는 단순히 배를 채우는 아침 겸 점심이 아닌, 지루한 주중 일상의 무게를 씻겨내는 사색 사색의 축제입니다",
        subtitle: "모든 에스프레소 추출 원두량 20g은 에스프레소 40g을 25초간 황금 비중으로 추출하는 공식입니다.",
        content_data: {
          description: "안녕하십니까. 더테라스 가든의 오너 바리스타이자 셰프입니다. 우리는 시중 싸구려 강배전 로스팅 원두의 탄 맛과 가공 유제품을 단호히 거부합니다. 우리는 생두 원두의 고유한 꽃향기와 과일 아로마 성분을 라이트 로스팅으로 안전하게 보호하고, 도심 속 하늘이 넓게 보이는 야외 정원 라운지에서 당신의 나른한 아침의 여유를 성심껏 보좌하겠습니다.",
          stats: [
            { label: "당일 로스팅 스페셜티 원두 수량", value: "24kg" },
            { label: "정기 테라스 브런치 고객 수", value: "1,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "야외 정원 테라스 & 로스터기",
        subtitle: "푸른 나무 잎사귀와 고소한 커피 향취가 정교하게 조화를 이룬 청정 인테리어 전경입니다.",
        content_data: {
          items: [
            { title: "하늘이 보이는 통유리 테라스석", description: "화창한 아침 햇살이 부드럽게 테이블을 비추고 오가닉 화분들이 가득 차 상쾌한 공기를 주는 창틀 좌석", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80" },
            { title: "은빛 알루미늄 대형 로스터기실", description: "생두의 수분율에 따라 연소 온도를 그래픽으로 조율하여 꽃향기 스페셜티 원두를 볶아내는 청결한 제분실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "아보카도 토스트와 꽃 에스프레소 스냅", description: "원목 테이블 위에 호밀 사워도우 오픈 토스트와 유리 에스프레소 컵, 그리고 화사한 노란 장미꽃 가니쉬 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "테라스 브런치 테이블 예약",
        subtitle: "방문 예정 일시, 야외 테라스석 희망 여부, 동반 아동 및 반려동물 유무를 적어 예약 신청을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "브런치 테이블 예약"
        }
      }
    ]
  },

  bbq_smokehouse_texas: {
    templateId: "bbq_smokehouse_texas",
    name: "아이언스모크 텍사스 바비큐",
    category: "Restaurant",
    description: "인더스트리얼하고 묵직한 카본 블랙과 타오르는 참나무 장작 브릭 브라운, 그리고 경고 옐로우 액센트로 텍사스 오리지널 스모크 비프 브리스킷의 불맛을 전하는 테마입니다.",
    image: "/templates/bbq_smokehouse_texas.png",
    theme: {
      fontFamily: "Impact, Archivo Black, sans-serif",
      colors: {
        primary: "#b45309",     // 참나무 장작 브릭 브라운
        secondary: "#3f3f46",   // 훈연 스모크 차콜
        accent: "#dc2626",      // 붉은 육즙 바비큐 소스 레드
        background: "#09090b",  // 매트 서킷 블랙
        surface: "#18181b",     // 탄소 섬유 그릴 텍스처
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "참나무 장작 연기 속에서 14시간 동안 로우앤슬로우로 훈연한 비프 브리스킷",
        subtitle: "미국 텍사스 정통 바비큐 방식으로, 대형 무쇠 스모커 안에서 온도를 110도로 완벽 통제하여 고기를 굽지 않고 참나무 연기의 열량과 연기로만 찌듯 구워내어, 포크만 대도 결대로 찢어지는 극상의 부드러움과 스모키 훈연 향을 선사하는 아웃도어 비스트로입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
          ctaText: "시그니처 바비큐 플래터 보기",
          ctaLink: "#services",
          features: [
            { text: "차돌양지(Brisket)의 겉면 탄소 크러스트 '바크(Bark)'와 붉은색 스모크 링의 완벽한 텍사스 정통 비주얼 구현" },
            { text: "수제 사과 식초 바비큐 소스 및 달콤하고 아삭한 코울슬로 양배추 무상 무제한 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아이언스모크 플래터",
        subtitle: "14시간 훈연의 집념과 무쇠 그릴의 묵직함이 고스란히 담긴 고중량 바비큐 목록입니다.",
        content_data: {
          items: [
            {
              title: "텍사스 비프 브리스킷 (Brisket)",
              description: "USDA 프라임 등급 차돌양지를 로우앤슬로우로 훈연하여 입안에 넣는 순간 아이스크림처럼 부드럽게 녹아납니다.",
              icon: "Flame"
            },
            {
              title: "스페셜 베이비 백 립 (Pork Ribs)",
              description: "두툼한 돼지 등갈비 뼈에 수제 시즈닝 럽(Rub)을 발라 구워내어 고소하고 알싸한 육즙 풍미가 뛰어납니다.",
              icon: "Award"
            },
            {
              title: "풀드포크 & 미니 버거 번 번",
              description: "돼지 목살을 부드럽게 찢어 바비큐 소스에 버무려 낸 고기로, 따뜻하게 구운 버터 번에 코울슬로와 싸 먹는 별미입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "바비큐는 고기를 불에 굽는 단순 조리가 아닌, 참나무 연기의 풍미를 고기 속까지 훈연 이식하는 시간의 숭고한 물리학입니다",
        subtitle: "스모커 내부의 습도를 60%로 칼같이 유지할 때 고기가 마르지 않고 촉촉한 질감을 머금습니다.",
        content_data: {
          description: "안녕하십니까. 아이언스모크의 대표 훈연마스터(Pitmaster)입니다. 팬에 대충 구워 기름 다 빠지고 질겨진 고기에 실망하셨나요? 진짜 텍사스 바비큐는 14시간의 인고의 밤을 참나무 장작불 옆에서 불꽃의 온도를 지키며 기다려야 완성됩니다. 우리는 기계적 테크닉을 걷어내고, 겉은 석탄처럼 보이지만 한 입 베어 물면 왈칵 터져 나오는 붉은 육즙 스모크 링의 기적을 선보입니다.",
          stats: [
            { label: "누적 훈연 브리스킷 개수", value: "3,500개 돌파" },
            { label: "원내 대형 수제 스모커", value: "2세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "대형 무쇠 스모커 & 훈연실 전경",
        subtitle: "참나무 장작과 훈연의 아우라가 고스란히 느껴지는 프로패셔널 아웃도어 인프라입니다.",
        content_data: {
          items: [
            { title: "2미터 무쇠 스모커 장작 투입구", description: "붉은 불꽃이 타오르고 참나무 장작의 스모키 훈연 연기가 챔버 내부로 뿜어져 들어가는 순간", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
            { title: "브리스킷 슬라이스 단면과 붉은 링", description: "도마 위에 올린 훈연 차돌양지를 썰어내어 겉면 바크 크러스트와 0.5cm 붉은 스모크 링을 증명하는 컷", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "미니 빵과 코울슬로 웰컴 셋업", description: "무쇠 식탁 위에 수제 바비큐 소스 병과 양배추 샐러드, 그리고 시원한 탄산 맥주가 세팅된 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "바비큐 플래터 예약 및 단체 제휴 문의",
        subtitle: "방문 예정 일시, 2인/4인 플래터 메뉴 사전 선택, 단체 룸 대관 예약 여부를 기재해 문의하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "바비큐 테이블 예약"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 4: Thai, Wine Bar, Healthy, Korean BBQ, Roastery
  // ==========================================
  thai_street_noodles: {
    templateId: "thai_street_noodles",
    name: "방콕키친 모던 타이 & 스트리트 누들",
    category: "Restaurant",
    description: "상큼한 시트러스 레몬 주황과 청량한 타이 실크 블루, 라임 그린 액센트로 동남아시아 태국 요리의 화려한 향취를 전하는 모던 타이 레스토랑 테마입니다.",
    image: "/templates/thai_street_noodles.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ea580c",     // 상큼한 레몬 글라스 오렌지
        secondary: "#e0f2fe",   // 시원하고 맑은 타이 코코넛 블루
        accent: "#16a34a",      // 청량한 라임 고수 그린
        background: "#fafcfd",  // 맑고 투명한 방콕 퓨어 화이트
        surface: "#ffffff",     // 깨끗한 대나무 테이블 화이트
        text: "#1e293b"         // 스마트하고 가독성 높은 네이비 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "새콤달콤한 레몬글라스 아로마와, 웍 안에서 볶아내는 쫄깃한 팟타이",
        subtitle: "태국 방콕 국립 왕실 요리 연구원 출신 셰프의 정교한 향신료 배합과, 고소한 땅콩가루, 생 할라피뇨 살사를 접목하여 신맛 단맛 짠맛의 입체적 3중주를 선사하는 모던 타이 비스트로입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "시그니처 타이 퀴진 보기",
          ctaLink: "#services",
          features: [
            { text: "태국 산지 직송 천연 똠양 페이스트와 무농약 레몬그라스, 라임 잎만을 100% 사용 보증" },
            { text: "시원하고 탄산 강한 태국 창, 싱하 맥주와 파인애플 칵테일 마가리타 상시 구비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "방콕키친 시그니처",
        subtitle: "입안 가득 태국의 이국적인 똠양 향취를 뿜어내는 가성비 극상 메뉴 리스트입니다.",
        content_data: {
          items: [
            {
              title: "정통 쉬림프 팟타이 (Pad Thai)",
              description: "그릴드 킹프론 새우와 쫄깃한 쌀면을 특제 타마린드 소스에 웍으로 볶아내고 고소한 땅콩가루와 라임을 얹었습니다.",
              icon: "Flame"
            },
            {
              title: "세계 3대 스튜 똠양꿍 (Tom Yum Goong)",
              description: "새콤달콤 매콤한 레몬그라스 육수에 통통한 타이거 새우와 버섯을 옹기 뚝배기에 뭉근히 끓여냈습니다.",
              icon: "Droplet"
            },
            {
              title: "부드러운 게살 푸팟퐁커리",
              description: "껍질째 씹어먹는 소프트크랩을 바삭하게 튀겨내어 카레 가루와 부드러운 달걀 코코넛 밀크 소스로 버무렸습니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "타이 요리는 기름진 볶음이 아닌, 향신료의 신선한 아로마와 코코넛의 단맛이 만드는 정교한 밸런스입니다",
        subtitle: "모든 똠양꿍 육수는 주문 즉시 무쇠 팬 위에서 레몬그라스와 라임 잎을 즉시 볶아내어 우려냅니다.",
        content_data: {
          description: "안녕하십니까. 방콕키친의 대표 셰프입니다. 우리는 수입 통조림 소스와 보존제가 가득한 저품질 가공품을 단호히 거부합니다. 우리는 천연 향신료 고유의 비타민 성분을 훼손 없이 컵에 담아내고, 태국풍의 신나는 비트 음악이 흐르는 이국적인 라운지에서 당신의 스트레스를 유쾌하게 날려버리겠습니다.",
          stats: [
            { label: "당일 출고 수제 팟타이 면량", value: "80kg" },
            { label: "수입 태국 전통 향신료 종류", value: "14종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "오리엔탈 타이 라운지 & 오픈 키친",
        subtitle: "보기만 해도 방콕 야시장 음악 소리가 들리는 듯한 알록달록하고 에너제틱한 공간 전경입니다.",
        content_data: {
          items: [
            { title: "네온 조명 가득한 비스트로 라운지", description: "태국 사원 목조 로고가 반짝이고 남미풍 직조 인테리어가 장식되어 창 맥주를 함께 마시는 테이블", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80" },
            { title: "무쇠 웍 화염과 똠양 훈연 육즙", description: "쌀면과 해산물이 불꽃 웍 안에서 노릇노릇 구워지며 맛깔스러운 시각 연출을 자랑하는 오픈 키친", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "코코넛 밀크 푸팟퐁커리 뚝배기 셋업", description: "황동 그릇 안에 잘 튀겨진 소프트크랩과 카레 소스를 믹싱하여 따스하게 서빙하는 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "타이 테이블 및 단체 예약 의뢰",
        subtitle: "방문 희망 날짜, 인원수, 똠양꿍 코스 사전 주문 여부, 그리고 고수 제외 여부를 편안하게 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "타이 테이블 예약"
        }
      }
    ]
  },

  wine_bar_tapas: {
    templateId: "wine_bar_tapas",
    name: "더케이브 어두운 조명 와인 & 타파스",
    category: "Restaurant",
    description: "은은하고 고풍스러운 다크 와인 버건디와 차분한 샴페인 브론즈 골드가 조화를 이루어 오붓한 밤의 대화와 스페셜 와인을 안내하는 와인 비스트로 테마입니다.",
    image: "/templates/wine_bar_tapas.png",
    theme: {
      fontFamily: "Cormorant Garamond, Noto Serif KR, serif",
      colors: {
        primary: "#4c0519",     // 매혹적인 런웨이 버건디
        secondary: "#f4ede2",   // 맑고 깨끗한 린넨 아이보리
        accent: "#c5a880",      // 품격 높은 샴페인 브론즈 골드
        background: "#0f0507",  // 어두운 동굴 속 와인 블랙
        surface: "#1e1114",     // 안락한 벨벳 가구 다크 초콜릿
        text: "#f5ebe0"         // 가독성이 탁월한 소프트 베이지 크림
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "촛불 하나만 켜둔 어두운 테이블 위, 프랑스 부티크 와인의 향기",
        subtitle: "전 세계 극소수 부티크 농가에서 직수입한 내추럴 와인과, 스페인 하몽 및 구운 샬롯 타파스 안주의 조화로운 마리아주로 오붓한 대화와 낭만적 안식을 선사하는 VIP 와인 바입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 와인 리스트 보기",
          ctaLink: "#services",
          features: [
            { text: "화학 무보존제 내추럴 와인과 바이오다이내믹 농법 유기농 원액 100% 수입 보증서 완비" },
            { text: "아티스트가 직접 디자인한 촛불 조명 테이블과 무선 헤드셋 명상 뇌파 청취 웰빙 라운지" }
          ]
        }
      },
      {
        section_type: "services",
        title: "더케이브 타파스 메뉴",
        subtitle: "와인의 산도와 바디감에 완벽히 동조되는 한 입 크기 타파스 목록입니다.",
        content_data: {
          items: [
            {
              title: "이베리코 하몽 & 멜론 타파스",
              description: "36개월 숙성된 이베리코 하몽 세라노 생햄과 잘 익은 달콤한 멜론 위에 올리브 오일을 얹었습니다.",
              icon: "Heart"
            },
            {
              title: "그릴드 무화과 & 브리 치즈 치즈",
              description: "오븐에 구워 달콤한 무화과에 브리 치즈를 얹어 메이플 시럽과 견과류를 토핑한 따뜻한 안주입니다.",
              icon: "Sparkles"
            },
            {
              title: "바질 오일 구은 관자 가니쉬",
              description: "싱싱한 키조개 관자를 팬에 노릇하게 구워 생바질 페스토와 석류 알갱이를 수놓았습니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "와인은 단순히 마시는 알코올 음료가 아닌, 그 해 프랑스 태양과 포도 나무가 쓴 일기를 해독하는 미학입니다",
        subtitle: "모든 내추럴 와인은 산화를 차단하기 위해 14도 일정한 셀러 온도에서 묵직하게 보존됩니다.",
        content_data: {
          description: "안녕하십니까. 더케이브 와인 비스트로의 수석 소믈리에입니다. 우리는 시중 마트의 싸구려 상업용 양산 와인이나 두통을 유발하는 화학 보존제 첨가 와인을 단호히 거부합니다. 포도가 자란 대지의 흙빛 아로마와 효모의 살아있는 신선함을 훼손 없이 잔에 담아내고, 촛불 하나만 켜둔 고요한 동굴 방에서 당신만의 은밀한 대화와 휴식을 보좌하겠습니다.",
          stats: [
            { label: "수입 희귀 와인 품종 수", value: "85가지" },
            { label: "정회원 와인 매니아 수", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "동굴 와인 셀러 & 촛불 테이블",
        subtitle: "사진 한 장만으로도 깊은 낭만과 차분함을 안겨주는 더케이브 내부 전경입니다.",
        content_data: {
          items: [
            { title: "아늑한 1인 벨벳 와인 부스석", description: "어두운 목조 벽면 코너에 촛불 하나와 와인 글라스 컵, 그리고 치즈 트레이가 이쁘게 세팅된 테이블", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80" },
            { title: "유광 아크릴 와인 디스플레이장", description: "보틀 라벨의 세련된 아트를 감상하며 당일 청음 테이스팅할 와인을 고르는 럭셔리 쇼케이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "하몽 슬라이스와 레드 와인 스냅", description: "원목 도마 위에 얇게 저민 생햄 하몽과 검붉은 와인이 채워지는 투명한 글라스 잔 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "와인 테이블 및 프라이빗 대관 예약",
        subtitle: "방문 예정 일시, 예약 인원 수, 선호하시는 와인 취향(레드/화이트/스파클링)을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "와인 테이블 예약"
        }
      }
    ]
  },

  healthy_salad_mealprep: {
    templateId: "healthy_salad_mealprep",
    name: "그린핏 샐러드 & 헬시 식단",
    category: "Restaurant",
    description: "싱그러운 비타민이 가득 느껴지는 알팔파 연그린과 맑고 깨끗한 아침 공기 스카이 블루 조화로 유기농 농가와 1:1 맞춤형 샐러드의 가치를 전하는 식단 테마입니다.",
    image: "/templates/healthy_salad_mealprep.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#166534",     // 싱그러운 숲속 리프 그린
        secondary: "#e0f2fe",   // 맑고 청량한 스카이
        accent: "#ea580c",      // 비타민 가득 선셋 오렌지
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 깨끗하고 청결한 세라믹 테이블
        text: "#14532d"         // 눈이 편안한 포레스트 그린 차콜
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "칼로리는 350kcal 이하로 덜어내고, 필수 필수 영양소와 단백질은 25g 가득 채우다",
        subtitle: "뻑뻑하고 영양 없는 다이어트 샐러드가 아닙니다. 임상 영양사가 설계하고 셰프가 저온 조리한 수제 닭가슴살 템페와 구운 단호박, 그리고 엑스트라 버진 올리브유 홈메이드 소스로 맛과 건강을 완벽 보증하는 오가닉 샐러드 전문점입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘 아침 샐러드 보울 보기",
          ctaLink: "#services",
          features: [
            { text: "로컬 농가 협동조합에서 매일 아침 직송하는 당일 수확 무농약 유기농 식자재 100% 사용 보증" },
            { text: "화학 보존제, 정제 설탕, 동물성 조미료 전혀 없이 발효 효소만으로 맛을 내 소화가 편안한 웰빙" }
          ]
        }
      },
      {
        section_type: "services",
        title: "그린핏 시그니처 보울",
        subtitle: "식물성 단백질과 유기농 섬유질로 몸과 마음을 투명하게 정화하는 한 그릇 요리입니다.",
        content_data: {
          items: [
            {
              title: "수비드 닭가슴살 아보카도 보울",
              description: "65도 저온 수비드로 익혀 닭가슴살 본래의 수분을 가두어 퍽퍽함 없이 깃털처럼 부드러운 스테이크와 아보카도를 올렸습니다.",
              icon: "Heart"
            },
            {
              title: "단호박 템페 구이와 퀴노아 샐러드",
              description: "식이섬유가 풍부한 케일, 로메인을 기본으로 고소한 발효 콩 템페 구이와 구운 단호박을 올렸습니다.",
              icon: "Leaf"
            },
            {
              title: "연어 곤약 아일랜드 누들 샐러드",
              description: "신선한 연어 사시미와 탱글탱글한 저칼로리 곤약면을 특제 오리엔탈 드레싱에 버무려 낸 미식 보울입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "샐러드는 단순한 체중 감량용 고행 식단이 아닌, 자연의 생명력을 그대로 수확하는 즐거운 웰빙 파티입니다",
        subtitle: "모든 채소는 영양소 파괴를 막기 위해 칼을 대지 않고 손끝으로 직접 뜯어내 플레이팅합니다.",
        content_data: {
          description: "안녕하십니까. 그린핏 샐러드의 대표 셰프이자 임상 영양 코치입니다. 샐러드를 먹을 때 풀밭 뜯는 느낌과 밋밋한 맛 때문에 며칠 만에 포기하고 요요를 겪으시는 분들이 많습니다. 우리는 참깨 에멀전 공법과 대체 버터 아보카도 지방 활용을 통해, 일반 육식 식사보다 속은 훨씬 편안하면서도 입안 가득 깊은 미식 풍미를 완성해 냅니다.",
          stats: [
            { label: "로컬 농가 직송 비중", value: "100%" },
            { label: "자체 보유 웰빙 레시피", value: "35가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "유기농 키친 & 싱그러운 다이닝 룸",
        subtitle: "미세먼지 차단 식물들이 가득 차 쾌적한 산소와 피톤치드를 제공하는 친자연 시설입니다.",
        content_data: {
          items: [
            { title: "수경 재배 스마트 팜 쇼케이스", description: "원내 유기농 채소들이 물빛을 받으며 깨끗하게 수중 재배되고 있는 모습을 투명하게 공개하는 식기실", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" },
            { title: "친환경 재생 목재 나무 테이블 석", description: "따스한 햇살이 드는 통창 가에 앉아 은은한 차를 마시며 샐러드 보울을 즐기는 프라이빗 다이닝 공간", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 연어 수비드 메이킹 조리실", description: "연어 살점의 콜라겐 수축을 막기 위해 정확한 온도로 진공팩 수비드를 진행하는 셰프의 조리 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오가닉 샐러드 테이블 예약",
        subtitle: "방문 날짜 및 시간, 예약 인원수, 기피하시는 견과류 알레르기 유무를 편안하게 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "샐러드 테이블 예약하기"
        }
      }
    ]
  },

  korean_bbq_grill: {
    templateId: "korean_bbq_grill",
    name: "한우정 직화 프리미엄 한우 구이",
    category: "Restaurant",
    description: "중후하고 고풍스러운 다크 오크 우드와 황동 구이 석쇠 골드, 그리고 신선한 선홍빛 레드 배합이 한우 꽃등심과 갈비 구이의 고급스러움을 높인 한식 구이 전문 테마입니다.",
    image: "/templates/korean_bbq_grill.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#3f2d20",     // 중후한 참숯 갈색 오크 우드
        secondary: "#d4af37",   // 황동 구이 석쇠 골드
        accent: "#b91c1c",      // 신선한 한우 마블링 선홍빛 레드
        background: "#faf6f0",  // 정갈한 한옥 미색 백그라운드
        surface: "#ffffff",     // 깨끗한 대리석 테이블 화이트
        text: "#29211c"         // 묵직한 참숯 카본 블랙 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "참숯 백탄 불꽃 위에서 직화로 구워내는 1++ 등급 최상급 한우 꽃등심",
        subtitle: "100% 횡성 명품 한우 투플러스 BMS No.9 등급만을 고집하여, 육즙의 손실 없이 겉은 노릇하게 굽고 속은 촉촉한 웰던의 경계를 선사하는 하이엔드 정통 한방 한식 구이 다이닝입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
          ctaText: "한우 스페셜 컷 예약",
          ctaLink: "#services",
          features: [
            { text: "최고의 육향 보존을 위해 무산소 진공 저온 숙성 웻에이징 챔버 상시 가동" },
            { text: "외부로 연기가 전혀 새어나가지 않는 하향식 덕트 설비 완비로 쾌적한 냄새 제로 식사 환경" }
          ]
        }
      },
      {
        section_type: "services",
        title: "한우정 시그니처 컷",
        subtitle: "한우 마블링의 고소함과 숯불 향이 조화된 입체적인 고기 코스입니다.",
        content_data: {
          items: [
            {
              title: "최상급 1++ 한우 살치살",
              description: "눈꽃처럼 섬세하게 내려앉은 마블링의 분포도가 입안에 넣는 순간 아이스크림처럼 사르르 녹는 미식입니다.",
              icon: "Award"
            },
            {
              title: "직화 한우 갈비살 구이",
              description: "특제 과일 간장 타레 소스에 버무린 도톰한 양념 갈비를 참숯 위에 노릇하게 숯불 터치해 구워냅니다.",
              icon: "Flame"
            },
            {
              title: "명품 된장찌개 & 가마솥 가마솥 밥",
              description: "수제 가마솥 밥에 보리새우와 달래를 듬뿍 넣어 끓여낸 묵직한 전통 옹기 뚝배기 된장찌개입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "한우 구이는 단순히 고기를 익히는 과정이 아닌, 참숯의 적외선 열기로 육즙 단백질을 응축하는 미학입니다",
        subtitle: "고기를 구울 때는 석쇠를 미리 뜨겁게 달궈 고기가 달라붙지 않게 위생적으로 시어링합니다.",
        content_data: {
          description: "안녕하십니까. 한우정의 대표 셰프이자 육류 전문가입니다. 우리는 출처 불명의 냉동 한우나 수입육을 단호히 거부합니다. 우리는 지리적 표시제 인증을 받은 청정 농가의 투플러스 한우만을 수거하며, 연주가 악기를 조율하듯 고기 두께와 지방층 분포를 매일 아침 칼끝으로 재단하여 최상의 식감을 제공합니다. 아늑한 개별 룸에서 소중한 비즈니스를 완성하세요.",
          stats: [
            { label: "연간 출고 한우 중량", value: "12,000kg" },
            { label: "보유 프라이빗 단독 룸", value: "12실 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "프라이빗 다이닝 룸 & 숯불 석쇠",
        subtitle: "환기가 탁월하고 고급스러운 황동 조명이 설치된 한식 전통 공간 전경입니다.",
        content_data: {
          items: [
            { title: "개인 프라이빗 온돌 한옥 룸", description: "대리석 무늬 테이블 중앙에 백탄 참숯 화로가 안착되어 있고 황동 환기통이 빌트인된 단독 다이닝 룸", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
            { title: "웻에이징 저온 한우 숙성고", description: "투명한 통유리를 통해 붉은 등급 한우 덩어리들이 진공팩 안에서 숙성되는 과정을 공개하는 저장실 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "한우 꽃등심 마블링 플레이팅 스냅", description: "원목 도마 위에 선홍빛 꽃등심과 로즈마리, 구운 송이버섯 가니쉬가 우아하게 올려진 아티스틱 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "한우 테이블 및 프라이빗 룸 예약",
        subtitle: "방문 예정 일자 및 시간, 예약 룸 선택, 인원수(가족 모임 등), 선호하시는 코스 유무를 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "한우정 예약 신청"
        }
      }
    ]
  },

  coffee_roastery_beans: {
    templateId: "coffee_roastery_beans",
    name: "원더빈즈 스페셜티 로스터리",
    category: "Restaurant",
    description: "고소하고 묵직한 로스팅 코코아 브라운과 우유처럼 스무스한 카페라떼 아이보리 배합으로 자가 로스팅 스페셜티 원두 원액의 가치를 전하는 로스터리 카페 테마입니다.",
    image: "/templates/coffee_roastery_beans.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#5c3a21",     // 깊은 에스프레소 로스트 브라운
        secondary: "#ddb892",   // 고소한 카페라떼 베이지
        accent: "#7f5539",      // 카카오 모카 브라운
        background: "#faf6f0",  // 아늑한 조명 크림 웜베이지
        surface: "#ffffff",     // 깨끗한 위생 세라믹 바 테이블
        text: "#463f3a"         // 탄소 로스팅 블랙 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "스페셜티 생두 로스팅의 과학적 온도 매칭부터, 한 잔의 브루잉 추출까지",
        subtitle: "에티오피아 게이샤, 콜롬비아 수프리모 등 전 세계 최정상 농가에서 직수입한 싱글 오리진 생두를 자체 매장 내 기센 로스터기로 볶아내고, 92도 온수 드립으로 산미와 꽃향기를 최대로 살려내는 에스프레소 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오늘 아침 볶은 원두 라인업",
          ctaLink: "#services",
          features: [
            { text: "원두 표면의 열 손상을 방지하기 위해 정교하게 연소 제어되는 기센(Giesen) 스마트 로스터기 가동" },
            { text: "주문 즉시 1인 단독 케맥스 브루어리 드립으로 화사한 자스민 꽃 아로마를 추출하는 커피 바" }
          ]
        }
      },
      {
        section_type: "services",
        title: "원더빈즈 커피",
        subtitle: "커피 애호가들의 혀끝과 후각을 지적으로 요동치게 만드는 명품 싱글 오리진 목록입니다.",
        content_data: {
          items: [
            {
              title: "에티오피아 게이샤 내추럴 (Geisha)",
              description: "화사한 자스민 꽃향기와 새콤달콤한 백포도주, 잘 익은 복숭아의 풍부한 산미가 흘러넘치는 최고가 스페셜티입니다.",
              icon: "Award"
            },
            {
              title: "콜롬비아 엘 파라이소 리치 (Double Anaerobic)",
              description: "이중 무산소 발효 공법을 거쳐 실제 생 리치 열매와 복숭아 요거트를 한 입 베어 문 듯한 충격적 과일 단맛을 자랑합니다.",
              icon: "Heart"
            },
            {
              title: "과테말라 안티구아 다크 블렌드",
              description: "다크 초콜릿의 묵직한 바디감과 볶은 호두의 고소함이 묵직하게 입안 가득 감도는 클래식 블렌딩입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "커피는 단순한 카페인 수혈을 위한 탄 음료가 아닌, 생두의 산지와 가공 방식이 쓰는 주파수의 사색입니다",
        subtitle: "원두 로스팅 시 1차 크랙 온도 196도는 생두 안의 세포벽이 터지며 향기를 방출하는 약속의 각도입니다.",
        content_data: {
          description: "안녕하십니까. 원더빈즈 로스터리의 수석 로스터이자 헤드 바리스타입니다. 우리는 커피 원두를 태워 쓰기만 한 저품질 양산형 다크 로스팅을 지양합니다. 생두는 살아있는 씨앗이기에 산지 고도와 수분율에 따라 로스팅 열량 전도가 매번 달라집니다. 우리는 생두 노크 소리와 온도 상승률 1도 단위 데이터를 기록하며, 첫 한 모금을 마시는 순간 눈이 번쩍 뜨이는 아로마를 빚어냅니다.",
          stats: [
            { label: "연간 볶는 스페셜티 원두 량", value: "12,000kg" },
            { label: "보유 싱글 오리진 원두 종류", value: "12가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "대형 로스터기실 & 브루잉 컵 바",
        subtitle: "원목 가구와 은빛 기어들이 세련되게 어우러진 향긋한 커피 아뜰리에 전경입니다.",
        content_data: {
          items: [
            { title: "독일제 기센 W15 대형 로스터기", description: "유리창 너머로 원두가 황금빛 갈색으로 마르며 은은한 커피 향취를 뿜어내는 정밀 로스팅 룸", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80" },
            { title: "하리오 V60 드리퍼 유리 카운터바", description: "주문 즉시 주전자로 원을 그리며 따스한 물을 부어 원두 가스 이산화탄소를 배출하고 추출하는 브루 바", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "갈색 차광 병 원두 패키지 스냅", description: "습도 차단 밸브가 빌트인된 갈색 크래프트 원두 봉투와 갓 볶아 번뜩이는 유광 원두 홀빈 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원두 정기 배송 및 창업 제휴 신청",
        subtitle: "원두 정기 배송 희망 주기, 카페 에스프레소용 원두 납품 상담, 그리고 바리스타 교육 문의를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "원두 납품 상담 신청"
        }
      }
    ]
  },

  artisan_sourdough_bakery: {
    templateId: "artisan_sourdough_bakery",
    name: "라방브 천연효모 사워도우 베이커리",
    category: "Restaurant",
    description: "프랑스 전통 돌오븐에서 구워낸 시골풍 천연 발효 사워도우와 바게트, 그리고 정성껏 키운 천연 액종 효모의 따뜻한 브라운 가치를 전하는 베이커리 테마입니다.",
    image: "/templates/artisan_sourdough_bakery.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#7c2d12",     // 따스한 황토 화덕 오렌지 브라운
        secondary: "#ffedd5",   // 고소한 밀가루 피치 베이지
        accent: "#ea580c",      // 바삭하게 구워진 크러스트 오렌지
        background: "#faf8f5",  // 오가닉 밀가루 크림 오프화이트
        surface: "#ffffff",     // 위생적인 나무 빵 도마 화이트
        text: "#2c1810"         // 깊은 카카오 오븐 크러스트 브라운
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "돌오븐 속에서 타닥타닥 구워지는 소리, 매일 아침 살아 숨 쉬는 천연 발효종의 향긋함",
        subtitle: "상업용 이스트와 화학 보존제를 전혀 쓰지 않습니다. 프랑스산 유기농 통밀 och 호밀, 그리고 72시간 장기 저온 발효 공법을 거쳐 400도 돌오븐의 복사열로 겉은 바삭하고 속은 촉촉하게 구워낸 유럽 정통 아날로그 사워도우 브레드 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1549931319-a545dcf3baa7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "갓 구워진 빵 나오는 시간",
          ctaLink: "#services",
          features: [
            { text: "12년 동안 매일 온도와 습도를 체크하며 키워온 자생 천연 효모 르뱅(Levain) 스타터 사용" },
            { text: "천연 무가당, 무버터, 무우유 공정으로 당뇨와 소화 불량 걱정 없는 무농약 건강 호밀빵" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오븐 프레시 베이커리",
        subtitle: "화학 첨가물 없이 오직 밀, 물, 소금, 그리고 시간만이 빚어낸 명품 식사 빵 라인업입니다.",
        content_data: {
          items: [
            {
              title: "시골풍 정통 사워도우 (Campagne)",
              description: "호밀의 고소함과 천연 효모 특유의 화사하고 시큼한 풍미가 어우러져 속을 편안하게 해주는 시그니처 시골 빵입니다.",
              icon: "Award"
            },
            {
              title: "돌오븐 바게트 & 사브레",
              description: "돌 화덕 바닥에 직접 닿아 구워져 바삭한 소리가 맑게 귀를 울리고, 속은 스폰지처럼 촉촉한 오리지널 프랑스식 바게트입니다.",
              icon: "Heart"
            },
            {
              title: "무농약 무화과 피칸 호밀빵",
              description: "설탕 없이 반건조 무화과 열매의 자연스러운 단맛과 고소한 피칸 견과류를 듬뿍 넣어 씹을수록 풍미가 번지는 건강 빵입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "사워도우는 빵을 부풀리는 기술이 아닌, 유익균과 밀가루가 쓰는 기나긴 인내의 화학적 대화입니다",
        subtitle: "매일 아침 6시, 오븐 문이 열릴 때 퍼지는 고소한 향은 인공 향료가 흉내 낼 수 없는 대자연의 선물입니다.",
        content_data: {
          description: "안녕하십니까. 라방브 사워도우 베이커리의 총괄 마스터 제빵사입니다. 우리는 공장식 대량 생산을 위해 이스트를 들이붓고 설탕과 버터로 눈속임하여 위장에 부담을 주는 양산형 밀가루 빵을 단호히 거부합니다. 우리는 온도 24도, 습도 65%의 발효실에서 천연 르뱅 균이 스스로 호흡하고 젖산을 뿜어낼 때까지 기다립니다. 속이 거북하지 않고 씹을수록 깊은 단맛이 도는 정직한 빵을 당신의 아침 식탁에 올리겠습니다.",
          stats: [
            { label: "유지해온 천연 효모 나이", value: "12년째 가동" },
            { label: "당일 한정 구워내는 사워도우", value: "80개 한정" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "밀가루 먼지와 아날로그 돌 화덕",
        subtitle: "장인의 거친 손끝과 오븐의 붉은 열기가 따뜻하게 어우러진 주방 전경입니다.",
        content_data: {
          items: [
            { title: "발효 가스가 꽉 찬 르뱅 반죽 성형", description: "나무 도마 위에서 제빵사가 캔버스 천에 반죽을 올리고 예리한 칼로 칼집 쿠프를 넣는 장인의 찰나", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
            { title: "돌오븐 속에서 부풀어 오르는 바게트", description: "붉은 열선 조명이 번지는 화덕 내부에서 스팀 세례를 받으며 빵 크러스트가 황금빛 오렌지 색상으로 찢어지는 컷", image: "https://images.unsplash.com/photo-1549931319-a545dcf3baa7?auto=format&fit=crop&w=600&q=80" },
            { title: "원목 바스켓에 담긴 컨트리 브레드", description: "짚 바구니 위로 김이 모락모락 피어오르는 커다란 원형 사워도우 빵들이 정갈하게 디스플레이된 스냅", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "빵 단체 주문 및 베이킹 클래스 예약",
        subtitle: "유치원/회사 간식용 사워도우 대량 주문, 비건 호밀빵 정기 배송 정기 구독, 혹은 천연 효모 르뱅 키우기 클래스 예약을 남겨주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "건강 빵 문의 신청"
        }
      }
    ]
  },

  teppanyaki_omakase_dining: {
    templateId: "teppanyaki_omakase_dining",
    name: "데판야끼 야생 철판 오마카세",
    category: "Restaurant",
    description: "묵직한 미드나잇 스틸 블루와 철판 불꽃 로즈 핑크 색상 배합으로 400도 고온 철판 화력 쇼와 최고급 해산물 다이닝의 아우라를 전하는 테마입니다.",
    image: "/templates/teppanyaki_omakase_dining.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#1e1b4b",     // 미드나잇 철판 딥블루
        secondary: "#fee2e2",   // 부드러운 사쿠라 로즈 핑크
        accent: "#f43f5e",      // 강렬한 철판 불꽃 크림슨 로즈
        background: "#0f0f15",  // 묵직한 카본 블랙 슬레이트
        surface: "#1a1a24",     // 철판 바 테이블 그레이
        text: "#f3f4f6"         // 시인성 극대화 실버 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "두께 30mm 황동 철판 위에서 피어오르는 400도 불꽃 쇼와 육즙의 시각 예술",
        subtitle: "평범한 그릴 구이에 싫증나셨나요? 데판야끼 오마카세 방식으로, 눈앞에서 화려하게 불타오르는 랍스터 버터구이와 1++ 최고 등급 한우 안심의 육즙을 가두는 고온 시어링 마술을 오감으로 즐기는 프리미엄 사교 다이닝 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오마카세 좌석 예약 및 코스",
          ctaLink: "#services",
          features: [
            { text: "열전도율 극대화를 위해 특수 제작된 일본제 3cm 두께 초고가 특수 철판 플레이트 가동" },
            { text: "프랑스산 코냑 플람베(Flambé) 불꽃 쇼로 해산물 비린내를 날리고 깊은 향을 가두는 테이블 쇼" }
          ]
        }
      },
      {
        section_type: "services",
        title: "철판 오마카세 라인업",
        subtitle: "최고의 식재료를 고온 철판 위에서 찰나의 온도로 요리해 접시에 올려드리는 시그니처 코스입니다.",
        content_data: {
          items: [
            {
              title: "라이브 캐나다산 활 바닷가재",
              description: "수조에서 갓 꺼낸 랍스터를 철판 위에서 꼬리부터 머리까지 버터를 끼얹으며 화려하게 찌듯이 구워내는 랍스터 테일 요리입니다.",
              icon: "Award"
            },
            {
              title: "최상급 1++ 한우 안심 시어링",
              description: "표면은 고온 철판으로 크리스피하게 굽고 속은 선홍빛 육즙을 가득 채워 마늘 칩과 생와사비를 얹어 혀끝에 녹여내는 극상의 비프입니다.",
              icon: "Flame"
            },
            {
              title: "스페셜 트러플 갈릭 라이스",
              description: "철판 위에서 주걱 두 개로 밥알 하나하나를 코팅하듯 볶아내고 이탈리아산 블랙 트러플 오일 향을 입혀 빚어낸 볶음밥입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "데판야끼는 식재료의 단순한 조리가 아닌, 철판의 두께와 셰프의 주겁 소리가 만들어내는 다이내믹한 미식 오페라입니다",
        subtitle: "카운터 바에 앉는 순간, 셰프와의 1:1 교감과 화려한 나이프 연출 쇼가 시작됩니다.",
        content_data: {
          description: "안녕하십니까. 데판야끼 야생 철판 오마카세의 오너 총괄 셰프입니다. 우리는 고기를 주방 구석에서 대충 구워 접시에 서빙하는 영혼 없는 스테이크 문화를 거부합니다. 우리는 손님의 시야 정중앙에 위치한 특수 황동 철판 위에서, 식재료가 익어가는 지글거리는 청각적 전율과 화려한 연기, 그리고 코냑 향기를 선사하며 입안 가득 감동을 선사합니다.",
          stats: [
            { label: "카운터 좌석 수량", value: "12석 한정 가동" },
            { label: "보유 최고급 싱글 몰트 위스키", value: "24종 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "붉은 플람베 불꽃 쇼 & 철판 카운터바",
        subtitle: "고급스러운 인디고 조명 아래 뜨거운 철판의 불길이 대담하게 춤추는 미식 전경입니다.",
        content_data: {
          items: [
            { title: "코냑을 뿌려 타오르는 거대한 플람베", description: "셰프가 철판 위에 술을 붓는 순간 1미터 높이의 붉은 장미 빛 불꽃이 아우라 가득하게 피어오르는 전율의 찰나", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
            { title: "철판 위 지글거리는 활 전복과 새우", description: "로즈 핑크 빛 새우 껍질이 익어가고 전복 옆에 아스파라거스 야채들이 정교하게 정렬된 시각 요리 컷", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "한우 안심 큐브 스테이 플레이팅", description: "철판 나이프로 얇게 썰어낸 고기와 황금빛 구운 마늘 편 슬라이스가 사기 그릇 위에 정갈하게 안착된 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오마카세 예약 및 단체 대관 신청",
        subtitle: "방문 예정 일시, 예약 룸 혹은 카운터 바 좌석 선택, 알레르기가 있는 식재료 정보, 기념일 레터링 요청을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "실시간 오마카세 예약"
        }
      }
    ]
  },

  cocktail_whiskey_speakeasy: {
    templateId: "cocktail_whiskey_speakeasy",
    name: "언더그라운드 스피크이지 바",
    category: "Restaurant",
    description: "벨벳 같은 미드나잇 슬레이트 블랙과 빈티지 오크통 옐로우 골드, 그리고 황동 브라스 조명 어둠 배합이 비밀스럽고 고풍스러운 싱글몰트 위스키 바를 연출하는 테마입니다.",
    image: "/templates/cocktail_whiskey_speakeasy.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#0f172a",     // 벨벳 미드나잇 다크네이비
        secondary: "#fef3c7",   // 숙성된 싱글몰트 앰버 골드
        accent: "#d97706",      // 아날로그 오크통 샌드 브라운
        background: "#070a13",  // 비밀 다크 쉐도우 블랙
        surface: "#111827",     // 가죽 소파 슬레이트 차콜
        text: "#e2e8f0"         // 투명 얼음빛 크리스탈 화이트
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "책장 뒤 숨겨진 문 너머, 시간의 소음이 완전히 멈추는 비밀 아날로그 기지",
        subtitle: "시끄러운 네온사인 클럽이나 흔한 대량 판매 펍을 단호히 거부합니다. 간판도 없이, 책장이나 오래된 공중전화 부스를 밀어야만 열리는 스피크이지 입구를 지나, 1920년대 미국 금주법 시대의 아늑한 재즈 멜로디 속에 핸드컷 카빙 구형 얼음과 수제 클래식 칵테일을 즐기는 사색가들의 은신처입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 스페셜 수제 칵테일",
          ctaLink: "#services",
          features: [
            { text: "스코틀랜드 아일라 섬 피트 향이 가득한 희귀 싱글몰트 위스키 독점 라인업 확보" },
            { text: "손님이 고른 베이스 스피릿과 기분에 따라 바텐더가 즉석 배합하는 무메뉴 비스포크 칵테일" }
          ]
        }
      },
      {
        section_type: "services",
        title: "비스포크 드링크 리스트",
        subtitle: "유리잔의 얼음 부딪히는 맑은 소리와 함께 깊은 영혼의 이완을 선사하는 한 잔의 위로입니다.",
        content_data: {
          items: [
            {
              title: "핸드컷 크리스탈 아이스 볼 위스키",
              description: "거대한 직사각형 얼음 덩어리를 바텐더가 송곳으로 깎아 완벽한 구형으로 만들어, 싱글몰트 원액의 맛을 해치지 않고 천천히 녹여내는 명품 온더락입니다.",
              icon: "Compass"
            },
            {
              title: "스모키 시그니처 네그로니 (Negroni)",
              description: "오크통 내부를 불로 태워 향을 극대화한 오크 칩 연기를 진(Gin)과 캄파리 칵테일 잔 속에 가두어 마시는 스모키 믹솔로지 세션입니다.",
              icon: "Flame"
            },
            {
              title: "무알콜 오가닉 허브 하이볼",
              description: "술을 드시지 못하는 분들을 위해 당일 수확한 로즈마리와 바질을 레몬 라임 원액과 탄산수 탄산수 탄산수 탄산수 탄산수에 믹싱한 웰빙 칵테일입니다.",
              icon: "Leaf"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "한 잔의 칵테일은 단순한 에탄올 알코올의 혼합이 아닌, 바텐더의 정교한 셰이킹 리듬이 쓰는 침묵의 문장입니다",
        subtitle: "모든 칵테일 가니쉬는 무농약 레몬 껍질 오렌지 제스트만을 엄격 오일 추출하여 사용합니다.",
        content_data: {
          description: "안녕하십니까. 언더그라운드 스피크이지 바의 수석 믹솔로지스트이자 헤드 바텐더입니다. 우리는 번쩍이는 클럽의 시끄러운 EDM 소리와 싸구려 리큐르 시럽을 잔뜩 섞어 머리를 아프게 하는 불량 칵테일 문화를 혐오합니다. 우리는 황동 지거로 0.1ml 단위 정밀 도주량을 계량하고, 얼음 표면의 물기를 깨끗하게 닦아 셰이킹 벨에 담습니다. 당신의 젖어드는 영혼을 위해 세계 최고 수준의 한 잔을 대접하겠습니다.",
          stats: [
            { label: "보유 희귀 싱글몰트 위스키", value: "85종" },
            { label: "카운터 황동 바 좌석", value: "8석 한정" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "황동 카운터바 & 크리스탈 얼음 카빙",
        subtitle: "은은한 촛불 조명 아래 오렌지 껍질 향과 에센셜 오일이 안개처럼 번지는 바 공간입니다.",
        content_data: {
          items: [
            { title: "바텐더의 실버 쉐이커 핸들링 쇼", description: "실버 코팅된 믹싱 틴 쉐이커 위로 차가운 서리가 얼어붙고 공중에서 바텐더가 리드미컬하게 흔드는 역동적 순간", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80" },
            { title: "크리스탈 아이스볼 위스키 온더락", description: "유리잔 속에 투명하고 단단한 원형 구체 얼음이 담겨있고 갈색 앰버 골드 빛 위스키 원액이 채워진 스케치", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오래된 가죽 책장 비밀 대문", description: "서재 책장 가운데 특정 고서적을 손으로 당기면 스르륵 소리를 내며 열리는 어둡고 고풍스러운 바 입구 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "바 카운터 좌석 실시간 예약 신청",
        subtitle: "방문 예정 시간, 동반 인원수, 선호하시는 술 베이스(위스키/진/럼/논알콜), 바텐더와 가벼운 스몰토크 희망 여부를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "비밀 바 좌석 예약"
        }
      }
    ]
  }
};
