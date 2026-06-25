import { TemplateConfig } from "../registry";

export const TRAVEL_LIFESTYLE_TEMPLATES: Record<string, TemplateConfig> = {
  wanderlust_explorer_blog: {
    templateId: "wanderlust_explorer_blog",
    name: "노마드 에센셜 트래블 저널",
    category: "Travel & Lifestyle",
    description: "자연스러운 샌드 베이지와 싱그러운 포레스트 그린의 조화로 방랑과 모험의 기록을 차분하게 연출하는 트래블 저널 테마입니다.",
    image: "/templates/wanderlust_explorer_blog.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#14532d",     // 포레스트 그린
        secondary: "#f5f5f4",   // 스톤 라이트 그레이
        accent: "#d97706",      // 샌드 옐로우 오렌지
        background: "#fafaf9",  // 차분한 도자 오프화이트
        surface: "#ffffff",     // 정갈한 라이팅 카드 화이트
        text: "#1c1917"         // 묵직한 카본 슬레이트 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "길을 잃어야만 만날 수 있는 세계의 찰나와 마음의 지도",
        subtitle: "관광지 도장 깨기식 여행을 넘어, 낯선 골목에서 마주한 사람들의 눈빛과 오래된 문방구의 냄새를 펜끝으로 기록하는 방랑가의 사색 일지입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
          ctaText: "탐험 아카이브 열람",
          ctaLink: "#portfolio",
          features: [
            { text: "현지인의 일상에 완벽히 동화되어 한 달 동안 살아보며 수집한 생활 밀착형 웰빙 정보" },
            { text: "여행지 고유의 영감을 담은 필름 카메라 스냅샷과 에세이 아카이빙" }
          ]
        }
      },
      {
        section_type: "services",
        title: "탐험 테마 에센셜",
        subtitle: "여행을 깊고 풍요롭게 빚어내는 방랑 저널의 핵심 카테고리입니다.",
        content_data: {
          items: [
            {
              title: "오프그리드 캠핑 아카이브",
              description: "도시의 전기 신호를 끄고 강원도 오지 계곡과 숲속에서 아날로그 장비로 생존하며 기록한 리포트입니다.",
              icon: "Compass"
            },
            {
              title: "로컬 시장과 식문화 탐구",
              description: "태국 방콕의 뒷골목 국수집부터 프랑스 시골의 홈메이드 치즈 농가까지 직접 취재한 미식 레시피입니다.",
              icon: "Heart"
            },
            {
              title: "디지털 노마드 장비 셋업",
              description: "전 세계 어디서든 무선 네트워크를 동기화하여 고밀도 텍스트를 창작하게 돕는 워크 툴 킷입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "여행은 나를 낯선 좌표에 던져두고, 내가 가진 본연의 모습을 거울처럼 대면하는 성찰입니다",
        subtitle: "여권의 도장 개수보다, 한 도시에서 마주친 현지인의 따뜻한 차 한 잔이 삶의 궤적을 바꿉니다.",
        content_data: {
          description: "안녕하십니까. 노마드 트래블 저널의 발행인입니다. 우리는 겉핥기식 맛집 투어나 랜드마크 인증샷 문화를 지양합니다. 한 장소에 오래 머물며 골목길 고양이의 동선과 매일 아침 뜨는 커피집 아저씨의 표정을 지켜보고 기록합니다. 그 조용하고 투명한 성찰의 텍스트가 당신의 메마른 일상에 작은 파도를 일으키기를 희망합니다.",
          stats: [
            { label: "답사한 글로벌 도시", value: "35개국 120개" },
            { label: "누적 에세이 독자 수", value: "18,000명+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "필름 카메라 탐험 조각들",
        subtitle: "순간의 먼지와 햇살을 필터 없이 고스란히 담아낸 아날로그 이미지 컬렉션입니다.",
        content_data: {
          items: [
            { title: "아이슬란드 서부 피오르드 로드트립", description: "눈보라가 걷히는 피오르드 도로 위에서 오래된 볼보 차량을 멈추고 촬영한 침묵의 순간", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" },
            { title: "치앙마이 예술가 마을 한 달 살기", description: "편백나무와 우기철 대나무 잎사귀가 가득한 목조 아뜰리에 테라스에서 보낸 사색의 주말 아침", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "포르투 해안가 오래된 대문과 타일", description: "아줄레주 푸른 타일 사이로 바다 바람에 낡아버린 노란 나무 대문의 기하학적 색상 대비", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "협업 제안 및 뉴스레터 구독",
        subtitle: "여행 사진 사용 라이선스 제휴, 오프라인 북토크 초대권 신청, 주간 여행 뉴스레터 구독 신청은 아래 양식을 작성하세요.",
        content_data: {
          fields: ["name", "email", "message"],
          buttonText: "뉴스레터 정기 구독"
        }
      }
    ]
  },

  luxury_glamping_retreat: {
    templateId: "luxury_glamping_retreat",
    name: "힐사이드 와일드 글램핑 리조트",
    category: "Travel & Lifestyle",
    description: "기품 있는 올리브 카키 그린과 밤하늘의 다크 미드나잇 블루, 그리고 전등 불꽃 옐로우 색상 조합으로 자연 속 최상의 럭셔리 휴식을 제공하는 프리미엄 글램핑 테마입니다.",
    image: "/templates/luxury_glamping_retreat.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 다크 미드나잇 블루
        secondary: "#f1f5f9",   // 시원하고 깨끗한 스톤 라이트 블루
        accent: "#b45309",      // 참나무 모닥불 앰버 골드
        background: "#fafaf6",  // 숲속 안개 크림 아이보리
        surface: "#ffffff",     // 린넨 침구 화이트
        text: "#1f2937"         // 시인성 높은 다크 슬레이트 그레이
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "대자연이 주는 거친 숲속 호흡과, 5성급 호텔 침구가 선사하는 기적 같은 포근함",
        subtitle: "허리를 숙이고 불편하게 지내야 하는 캠핑이 아닙니다. 해발 600미터 울창한 편백나무 숲속에서 프라이빗 야외 노천탕과 빔프로젝터 스크린, 개별 파이어피트를 갖춰 완벽한 휴식을 선사하는 럭셔리 아웃도어 스테이입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "실시간 객실 현황 및 예약",
          ctaLink: "#contact",
          features: [
            { text: "최고급 구스다운 침구와 정밀 정수 필터 샤워실을 완비한 완전 방음 돔 구조 텐트" },
            { text: "체크인 시 참나무 캠핑 장작 및 친환경 어메니티 패키지 무상 무상 기본 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "럭셔리 휴식 코스",
        subtitle: "숲의 피톤치드 속에서 오감을 온전하게 힐링하는 힐사이드만의 시그니처 세션입니다.",
        content_data: {
          items: [
            {
              title: "프라이빗 편백나무 노천 온천",
              description: "대나무 가벽 너머로 밤하늘의 쏟아지는 별을 보며 유기농 국산 국화 솔트를 넣은 온천수로 족욕과 노천탕을 즐깁니다.",
              icon: "Droplet"
            },
            {
              title: "우드스모크 프라이빗 바비큐 돔",
              description: "참나무 숯불 화로 위에 국내산 무농약 한돈 목살과 소시지, 신선한 모둠 구이 야채를 직접 요리해 먹는 다이닝 가이드입니다.",
              icon: "Flame"
            },
            {
              title: "아침 포레스트 마인드풀 요가",
              description: "물안개가 피어오르는 야외 우드 데크 위에서 전문 명상 지도사와 함께 신선한 산소를 폐 속 깊이 들이마시는 웰빙 수업입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "도심의 소음에서 단 1시간, 바람의 숨소리와 새소리만이 당신의 귓가에 조용히 닿습니다",
        subtitle: "모든 스테이 돔은 이웃 돔과 20미터 이상의 프라이빗 거리를 유지하여 독점적 침묵을 보장합니다.",
        content_data: {
          description: "반갑습니다. 힐사이드 리조트의 총괄 빌리지 마스터입니다. 우리는 난민 수용소처럼 다닥다닥 붙어 새벽 소음으로 휴식을 망치는 흔한 캠핑장을 단호히 거부합니다. 우리는 수령 50년 편백나무 군락지 사이에 단 6개 동의 돔 텐트만을 엄선 배치하여, 사랑하는 사람과 불멍을 즐기며 진정한 삶의 속도를 되찾도록 설계했습니다.",
          stats: [
            { label: "돔 텐트 보유 수량", value: "6개 동 한정" },
            { label: "방문자 힐링 만족도", value: "99.8%" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "숲속 아웃도어 전경 아카이브",
        subtitle: "그린 카키 빛깔 자연의 상쾌함과 앰버 조명이 세련되게 어우러진 힐사이드 공간입니다.",
        content_data: {
          items: [
            { title: "밤하늘 별이 투명하게 보이는 돔 텐트", description: "돔 상단의 강화 유리 통창을 통해 누운 채로 북두칠성과 은하수를 온전히 호흡하는 럭셔리 베드룸", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80" },
            { title: "개별 파이어피트 모닥불 불멍 코너", description: "참나무 장작이 타닥타닥 소리를 내며 붉게 피어오르는 밤의 아늑한 아날로그 휴식 존 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "편백나무 노천 온천 야외탕", description: "따스한 김이 피어오르고 대나무 화분들과 조화를 이루어 오감이 안락해지는 프라이빗 탕 갤러리", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "객실 예약 및 제휴 신청",
        subtitle: "방문 희망 날짜 및 인원 수, 바비큐 세트 신청 여부, 그리고 프로포즈 등 스페셜 이벤트 요청을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "phone", "message"],
          buttonText: "글램핑 실시간 예약"
        }
      }
    ]
  },

  surf_beach_lifestyle: {
    templateId: "surf_beach_lifestyle",
    name: "오션 웨이브 서프 클럽",
    category: "Travel & Lifestyle",
    description: "활기찬 해변의 태양빛 옐로우 주황과 파도 거품 코발트 블루, 그리고 맑은 샌드 오프화이트 톤 배합이 아웃도어 스포츠와 힙한 비치 라이프스타일을 대담하게 전하는 테마입니다.",
    image: "/templates/surf_beach_lifestyle.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#0284c7",     // 태평양 코발트 블루
        secondary: "#fed7aa",   // 따스한 황금빛 모래 베이지
        accent: "#ea580c",      // 네온 오렌지 태양
        background: "#fafbfc",  // 시원한 아쿠아 오프화이트
        surface: "#ffffff",     // 정갈한 서핑 보드 덱 화이트
        text: "#0f172a"         // 울트라 슬레이트 네이비 블랙
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "매끈한 서프 보드 위에 두 발을 딛고, 밀려오는 태평양 파도의 맥박을 움켜쥐다",
        subtitle: "도시의 꽉 막힌 모니터 앞을 벗어나, 파도가 부서지는 서핑의 메카 강원도 양양 해변에서 정통 서핑 클래스를 이수하고 밤이 되면 해변 모닥불 펍에서 하와이안 칵테일과 버거를 즐기는 청춘의 낙원입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "원데이 서핑 강습 예약",
          ctaLink: "#contact",
          features: [
            { text: "국제 서핑 협회(ISA) 공인 자격증을 보유한 국가대표 출신 코치진의 정밀 1:1 수기 교정 강습" },
            { text: "서핑 입문용 고부력 스펀지 보드부터 상급자용 숏보드, 체형 맞춤 친환경 웻슈트 완비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "서프 프로그램",
        subtitle: "초보자부터 프로 서퍼까지 파도의 리듬을 완벽 정복하는 수준별 액티브 코스입니다.",
        content_data: {
          items: [
            {
              title: "원데이 스타터 클래스",
              description: "해변 모래사장 위에서 패들링과 테이크오프 지상 훈련을 거쳐, 안전한 발목 파도에서 첫 라이딩을 완수합니다.",
              icon: "Zap"
            },
            {
              title: "레벨업 라인업 클래스",
              description: "거품 파도를 벗어나 파도의 경사면을 따라 횡이동 라이딩과 턴 기술을 익히는 본격 중급자 코스입니다.",
              icon: "Award"
            },
            {
              title: "비치 바비큐 & 네온 파티",
              description: "서핑을 마친 뒤 붉은 노을이 지는 해변 칵테일 라운지에서 비치 디제잉 음악을 들으며 소통하는 소셜 쉼터입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "파도는 두려워하고 맞서 싸우는 장벽이 아닌, 파도의 파동과 내 몸의 무게중심을 완벽하게 공명시키는 놀이입니다",
        subtitle: "모든 강습은 해양 구조 대원 자격증을 보유한 세이프티 가드가 100% 동반 밀착 감시합니다.",
        content_data: {
          description: "안녕하십니까. 오션 웨이브 서프 클럽의 헤드 마스터 코치입니다. 우리는 기계적으로 일어나기만 반복하며 몸에 멍을 만들고 부상을 유발하는 가혹한 스파르타식 강습을 단호히 거부합니다. 우리는 파도의 생성 원리와 조류 흐름을 먼저 과학적으로 해독하고, 물 안에서의 공포심을 부드럽게 이완시키는 멘탈 케어를 병행하여 누구나 즐겁게 바다와 하나가 되도록 돕습니다.",
          stats: [
            { label: "클래스 누적 수강생", value: "8,500명+" },
            { label: "보유 렌탈 보드 수량", value: "85장" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "청량한 해변 서핑 아카이브",
        subtitle: "보기만 해도 가슴이 시원해지고 아드레날린이 요동치는 액티브 비주얼 컬렉션입니다.",
        content_data: {
          items: [
            { title: "파도 터널을 통과하는 튜브 라이딩", description: "코발트 파도 장벽 사이로 태양빛을 받으며 서퍼가 균형을 잡고 활주하는 쾌적하고 생동감 넘치는 찰나", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80" },
            { title: "해변 칵테일 라운지 오두막 펍", description: "서핑 보드들이 모래사장에 꽂혀있고 라임 맥주와 선셋 앰버 조명이 세련되게 장식된 힙스터 코너", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "웻슈트 착용 패들링 훈련 현장 스냅", description: "시원한 파도가 발목을 적시는 모래사장 위에서 수십 명의 수강생들이 서핑 테이크오프 팝업을 연습하는 실무 스틸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "강습 및 서프 캠프 숙박 신청",
        subtitle: "방문 예정 일시, 예약 인원 수, 강습 패키지 종류(강습+보드+슈트+게스트하우스 숙박 포함)를 기재해 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "서핑 캠프 강습 신청"
        }
      }
    ]
  },

  wellness_yoga_retreat: {
    templateId: "wellness_yoga_retreat",
    name: "마인드풀 힐링 요가 아뜰리에",
    category: "Travel & Lifestyle",
    description: "안락함을 선사하는 유기농 라벤더 바이올렛과 맑고 고요한 클레이 그레이, 그리고 따스한 샌드 로즈 포인트로 내면의 정화와 마음챙김을 정밀하게 어필하는 요가 테마입니다.",
    image: "/templates/wellness_yoga_retreat.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#581c87",     // 기품 있는 로열 라벤더 퍼플
        secondary: "#fdf4ff",   // 소프트 라벤더 베이지
        accent: "#b45309",      // 앰버 토치 마인드
        background: "#faf8fb",  // 차분한 아로마 안개 웜 화이트
        surface: "#ffffff",     // 깨끗한 위생 매트 오프화이트
        text: "#3b0764"         // 가독성이 탁월한 다크 딥 퍼플
      },
      borderRadius: "rounded-full",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "폐 속에 가득 찬 어두운 소음을 숨결로 비워내고, 맑은 빛으로 척추를 채우다",
        subtitle: "뻣뻣하게 몸을 꺾어 기교를 자랑하는 스포츠가 아닙니다. 싱잉볼의 맑은 소리와 천연 아로마 향초 향취 속에서, 근육 고유의 수축과 이완을 느끼며 삶의 스트레스를 내면 깊숙이서 부드럽게 해독하는 웰니스 라이프스타일 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "마인드풀 주간 명상 요가 신청",
          ctaLink: "#services",
          features: [
            { text: "천연 아로마 로즈마리 오일을 활용한 목과 어깨 뭉친 근육 이완 솔루션 매일 3회 무료 제공" },
            { text: "인도 숲속 아쉬람 전통 하타 요가 이수자들의 깊이 있는 정적 코칭 시스템 구축" }
          ]
        }
      },
      {
        section_type: "services",
        title: "웰니스 큐레이션",
        subtitle: "지친 일상에 온전한 쉼표를 선사하는 고밀도 힐링 프로그램 목록입니다.",
        content_data: {
          items: [
            {
              title: "하타 요가 & 싱잉볼 명상",
              description: "전통 인도식 정적 호흡과 오랜 유지 동작을 통해 척추 관절을 곧게 펴고, 티베트 싱잉볼의 진동으로 뇌파를 이완합니다.",
              icon: "Heart"
            },
            {
              title: "아로마 아로마 테라피 힐링 마사지",
              description: "천연 에센셜 오일을 호흡기로 들이마셔 자율신경계를 안정시키고, 폼롤러로 근막을 부드럽게 재단합니다.",
              icon: "Droplet"
            },
            {
              title: "비건 라이프스타일 티 살롱",
              description: "요가가 끝난 뒤 유기농 카모마일 꽃잎 차와 무설탕 귀리 브레드를 마시며 담소를 나누는 소통 쉼터입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "명상은 생각을 없애는 억압이 아닌, 내 머릿속을 지나가는 잡념들을 구름처럼 조용히 흘려보내는 환영입니다",
        subtitle: "모든 클래스는 최대 6인 이하 소수 정예로 운영되어 개개인의 호흡 템포에 완벽 대응합니다.",
        content_data: {
          description: "안녕하십니까. 마인드풀 요가 아뜰리에의 총괄 원장입니다. 우리는 시끄러운 에어로빅풍 음악을 틀어놓고 정신을 산만하게 만드는 헬스장식 단체 요가를 단호히 거부합니다. 우리는 숲속 바람 향취가 깃든 편백나무 마룻바닥과 아늑한 조명 아래서 향을 사르고, 몸의 정렬과 고독한 호흡의 감각만을 온전히 추적하여 일상의 피로를 기분 좋게 리셋해 드립니다.",
          stats: [
            { label: "연간 정화 수강생", value: "3,500명+" },
            { label: "보유 스페셜 티베트 싱잉볼", value: "8세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "차분한 요가원 & 힐링 풍경",
        subtitle: "눈을 감고 호흡하는 순간 전신이 맑아지는 안락한 친자연 공간 갤러리입니다.",
        content_data: {
          items: [
            { title: "편백나무 가구 요가 명상실", description: "아늑한 간접 등 아래 개인 요가 매트와 싱잉볼이 이쁘게 세팅되어 사색하기 좋은 조용한 스튜디오 좌석", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" },
            { title: "천연 아로마 향초 오일 추출실", description: "유기농 로즈마리와 라벤더 꽃잎에서 순수 오일 엑기스를 원심분리기로 안전하게 추출하는 위생 시설", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "싱잉볼 연주와 비건 웰컴 드링크", description: "황동 그릇을 마찰해 은은한 소리를 울리며 레몬 디톡스 주스를 대접하는 웰니스 조리 주방 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "웰니스 클래스 상담 및 예약",
        subtitle: "방문 희망 날짜, 희망 프로그램(하타/아로마/개인PT), 그리고 현재 목디스크 임신 등 건강 컨디션을 작성해 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "마인드풀 요가 신청하기"
        }
      }
    ]
  },

  urban_espresso_lifestyle: {
    templateId: "urban_espresso_lifestyle",
    name: "메트로폴리탄 카페 & 시티즌",
    category: "Travel & Lifestyle",
    description: "스마트하고 이지적인 슬레이트 메탈 그레이와 세련된 미드나잇 오렌지 골드 액센트로 도심 속 지적이고 트렌디한 에스프레소 커피 문화를 전달하는 라이프스타일 테마입니다.",
    image: "/templates/urban_espresso_lifestyle.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#18181b",     // 시크한 제트 블랙 슬레이트
        secondary: "#e4e4e7",   // 알루미늄 메탈 그레이
        accent: "#ea580c",      // 핫 스포트 오렌지 골드
        background: "#09090b",  // 미니멀 시티 다크 나이트
        surface: "#27272a",     // 에스프레소 머신 메탈 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "차가운 유리 빌딩 숲 아래 뜨겁게 응축해 내는 에스프레소 한 잔의 위로",
        subtitle: "단순히 카페인을 주입하는 소모품 커피가 아닙니다. 메트로폴리탄의 영감을 자극하기 위해 콜롬비아 카투라 무산소 원두를 기하학적으로 연소하고, 9바 고압으로 빠르게 짜낸 뒤 바닐라 오일을 살짝 떨어트린 지적인 크리에이터들을 위한 음료 연구소입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80",
          ctaText: "크리에이터 에스프레소 보기",
          ctaLink: "#services",
          features: [
            { text: "시각적 영감을 돕는 스마트 인더스트리얼 텍스처 인테리어와 개별 초고속 와이파이 콘센트 완비" },
            { text: "주간 메트로폴리탄 크리에이티브 시티 라이프스타일 에세이 레터 발행 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에스프레소 랩 라인업",
        subtitle: "정서적 환기를 이끌어 내며 아이디어를 고밀도로 응축하는 칵테일 커피 메뉴입니다.",
        content_data: {
          items: [
            {
              title: "네온 오렌지 콘파냐 에스프레소",
              description: "씁쓸하고 진한 에스프레소 위에 수제 오렌지 휘핑크림과 레몬 껍질 슬라이스를 얹어 새콤달콤 씁쓸함을 선사합니다.",
              icon: "Zap"
            },
            {
              title: "콜드 콜드 브루 크림 브륄레",
              description: "12시간 동안 천천히 방울 추출해 낸 깔끔한 콜드브루 위에 캐러멜 토핑 커스터드 크림을 올린 칵테일 음료입니다.",
              icon: "Sparkles"
            },
            {
              title: "크리에이터 싱글 오리진 브루잉",
              description: "에티오피아 게이샤 원두 본래의 꽃향기가 맑고 투명하게 퍼지도록 칼리타 드립으로 추출해 냅니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "카페는 단순히 커피를 파는 매장이 아닌, 도시의 지적인 노마드들이 만나 새로운 시너지를 직조하는 허브입니다",
        subtitle: "모든 커피 추출 데이터는 스마트 모니터에 압력과 유량이 실시간 디지털 그래프로 표기됩니다.",
        content_data: {
          description: "안녕하십니까. 메트로폴리탄 에스프레소 랩의 대표 크리에이티브 디렉터입니다. 우리는 태워 질 질 흐르는 쓴맛 일색의 저품질 대형 프랜차이즈 원두를 단호히 거부합니다. 우리는 원두 고유의 생동감 넘치는 시트러스 비타민 오일을 라이트 로스팅으로 정량 수확하며, 시크한 제트 블랙 조명 인프라 속에서 당신의 영감을 성심껏 보조하겠습니다.",
          stats: [
            { label: "방문 크리에이터 회원 수", value: "3,500명" },
            { label: "정기 로스팅 생두 종류", value: "12가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "인더스트리얼 커피 바 & 워크 스페이스",
        subtitle: "사진 한 장만으로도 지적인 에너지와 도시 감성이 전해지는 원내 전경입니다.",
        content_data: {
          items: [
            { title: "무채색 알루미늄 가구 에스프레소 바", description: "이탈리아 시네소 에스프레소 머신이 반짝이고 바리스타가 스냅 샷을 추출하는 세련된 카운터", image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80" },
            { title: "시티 뷰 가로 창가 워크 벤치", description: "통유리 창 너머로 바쁜 출퇴근 인파를 구경하며 맥북을 펼쳐 타이핑 작업에 몰입하기 좋은 라운지 벤치", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "에스프레소 마티니 커피 칵테일 스냅", description: "검은 대리석 테이블 위에 셰이커로 흔들어 낸 거품 가득한 마티니 글라스 잔과 원두 홀빈 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "코워킹 시드 예약 및 뉴스레터 신청",
        subtitle: "워크 벤치 단체 예약, 에스프레소 바 케이터링 대관 상담, 그리고 주간 시티 라이프스타일 뉴스레터 신청을 완료해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "시티 레터 정기 구독"
        }
      }
    ]
  },

  vanlife_camping_adventure: {
    templateId: "vanlife_camping_adventure",
    name: "로드트립 반라이프 어드벤처",
    category: "Travel & Lifestyle",
    description: "따스한 태양빛 황토 베이지와 러프한 지프 카키, 그리고 밤하늘 파란 오션 색상 배합이 자동차 여행과 오버랜딩의 러프한 낭만을 선사하는 캠핑 테마입니다.",
    image: "/templates/vanlife_camping_adventure.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 야간 오버랜딩 오션 블루
        secondary: "#ffedd5",   // 모닥불 모래 황토 웜베이지
        accent: "#16a34a",      // 지프 아웃도어 카키 그린
        background: "#fafbfc",  // 청량한 계곡물 오프화이트
        surface: "#ffffff",     // 나무 캠핑 롤 테이블 화이트
        text: "#1c1917"         // 슬레이트 석탄 다크 슬레이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시동을 끄는 그곳이 나의 침실이 되고, 차창 너머 노을이 액자가 되는 삶",
        subtitle: "정해진 호텔 패키지 여행에 지치셨나요? 4륜 구동 지프 오버랜드 차량과 직접 나무로 DIY 인테리어를 마친 아날로그 캠핑 밴을 타고, 지도가 끝나고 길이 시작되는 태고의 자연 속으로 바퀴를 굴려 하룻밤을 누비는 진짜 방랑가들을 위한 매뉴얼 가이드입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
          ctaText: "반라이프 튜닝 가이드 북",
          ctaLink: "#services",
          features: [
            { text: "소형 상용 트럭 및 SUV 뒷좌석 평탄화 공사 공학 매뉴얼 및 무시동 히터 설치 자가 가이드 제공" },
            { text: "태양광 패널 패널 배터리 시스템 구축을 통해 전기 공급 없이 72시간 생존하는 오프그리드 비법" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오버랜드 에센셜",
        subtitle: "모험을 안전하고 와일드하게 서포트하는 반라이프 클래스 아카이브입니다.",
        content_data: {
          items: [
            {
              title: "자가 캠핑 카 평탄화 튜닝",
              description: "자작나무 합판을 직접 톱질해 접이식 수납 침대를 장착하고 친환경 스테인으로 마감하는 목공 강좌입니다.",
              icon: "Compass"
            },
            {
              title: "오프그리드 배터리 자가 솔루션",
              description: "인산철 배터리와 주행 충전기, 태양광 컨트롤러를 셀프 시공하여 쾌적하게 선풍기와 커피포트를 구동합니다.",
              icon: "Zap"
            },
            {
              title: "로컬 오버랜드 로드 투어링",
              description: "강원도 태기산 능선 노지 캠핑장부터 남해안 숨겨진 몽돌 해변 차박지까지 위성 지도로 엄선한 루트북입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "반라이프는 돈이 없어 차에서 먹고 자는 홈리스가 아닌, 내 평생의 짐을 최소한으로 비워내고 자유를 극대화하는 미니멀 라이프의 숭고한 저항입니다",
        subtitle: "모든 로드트립 루트는 현지 국립공원 환경 보존 가이드 라인과 취사 가능 규정을 칼같이 엄수해 기록합니다.",
        content_data: {
          description: "안녕하십니까. 반라이프 어드벤처의 대표 에디터입니다. 우리는 쓰레기를 산속에 무단 투기하며 매너 없이 눈총을 받는 불량 차박 문화를 단호히 거부합니다. 우리는 쓰레기를 되가져가는 '흔적 남기지 않기(LNT: Leave No Trace)' 아웃도어 캠페인을 1순위로 지향하며, 친자연 자재 밴 튜닝 데이터를 통해 건전하고 멋스러운 모험가들의 쉼터를 지켜내겠습니다.",
          stats: [
            { label: "보유 자가튜닝 데이터", value: "35건" },
            { label: "커뮤니티 소속 모험가", value: "2,400명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "와일드 오버랜딩 모험의 순간들",
        subtitle: "사진 한 장만으로도 가슴이 쿵쾅거리고 당장 시동을 걸고 싶게 만드는 아날로그 컬렉션입니다.",
        content_data: {
          items: [
            { title: "숲속에 정박한 클래식 폭스바겐 밴", description: "나무들 사이로 노란 꼬마 전구를 매달아 두고 밴 트렁크 문을 열어 밤 노을을 감상하는 평화로운 찰나", image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=600&q=80" },
            { title: "SUV 루프탑 텐트 아침 전경 스냅", description: "지프 차량 지붕 위에 설치된 루프탑 텐트 안에서 모닝 커피를 들고 일어나는 상쾌한 모험 스틸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "참나무 모닥불 위에 끓는 무쇠 주전자", description: "화로 불꽃 위 삼각대에 철제 주전자를 걸어 무드 가득하게 드립 워터를 데우는 거친 야외 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "밴 튜닝 세미나 및 가이드 신청",
        subtitle: "오프라인 밴 빌드업 원데이 워크숍 신청, 루트북 책자 우편 구매 문의, 크루 정기 정박 정모 참여는 아래 양식을 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "밴라이프 세미나 예약"
        }
      }
    ]
  },

  boutique_villa_stay: {
    templateId: "boutique_villa_stay",
    name: "까사 벨라 지중해 풀빌라",
    category: "Travel & Lifestyle",
    description: "눈이 탁 트이는 터키 아쿠아 블루와 맑고 깨끗한 석고 화이트, 그리고 은은한 골드 액센트로 이탈리아 남부 포지타노와 지중해 부티크 리조트의 낭만을 연출하는 스테이 테마입니다.",
    image: "/templates/boutique_villa_stay.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#0891b2",     // 청량한 터키쉬 블루 아쿠아
        secondary: "#ecfeff",   // 맑고 눈부신 미색 스카이
        accent: "#d4af37",      // 샴페인 반짝 골드
        background: "#fafcfd",  // 대리석 요란 오프화이트
        surface: "#ffffff",     // 린넨 소파 퓨어 화이트
        text: "#155e75"         // 심해 속 아쿠아 틸 네이비
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지평선과 인피니티 풀이 하나로 연결된, 맑고 투명한 지중해 해안의 아침",
        subtitle: "모든 복잡한 스케줄러를 끄고 투명한 유리 테라스 소파에 기대어, 눈앞에 파노라마로 펼쳐지는 에메랄드 바다 해안선과 스페인식 백색 아치 건축 아래서 인생의 가장 빛나는 순간을 박제하는 하이엔드 독채 풀빌라입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공식 오프닝 코너 예약",
          ctaLink: "#contact",
          features: [
            { text: "이탈리아산 천연 대리석으로 시공한 대형 프라이빗 인피니티 온수 풀장 24시간 가동 보증" },
            { text: "체크인 시 프랑스 샴페인 한 병과 치즈 웰컴 보드 플레이트 무상 무상 기본 세팅 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스페셜 스테이 코스",
        subtitle: "지중해의 여유로운 속도를 온전히 내 영혼에 이식하는 기품 있는 힐링 인프라입니다.",
        content_data: {
          items: [
            {
              title: "올데이 프라이빗 요트 투어링",
              description: "빌라 앞 선착장에서 전용 요트를 타고 출발하여 한적한 무인도 해안가에서 스노클링과 와인 파티를 만끽합니다.",
              icon: "Compass"
            },
            {
              title: "지중해식 올리브 에센셜 스파",
              description: "이탈리아 토스카나 유기농 올리브 오일과 바다 미네랄 진흙을 믹싱하여 전신 피부 보습과 림프 정화를 돕습니다.",
              icon: "Droplet"
            },
            {
              title: "셰프 메이킹 바비큐 마리아주",
              description: "당일 새벽 수확한 타이거 새우, 랍스터, 최상급 소고기를 야외 테라스 그릴에서 전담 셰프가 구워 서빙합니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스테이는 단순히 잠을 자는 숙소가 아닌, 내 인생의 가장 소중한 사람들과 아무것도 하지 않을 자유를 만끽하는 럭셔리한 침묵입니다",
        subtitle: "독채 빌라 3동은 서로의 프라이버시 동선이 마주치지 않도록 거대한 야자수 조경으로 완벽 엄폐됩니다.",
        content_data: {
          description: "안녕하십니까. 까사 벨라 지중해 풀빌라의 총지배인입니다. 우리는 주차장이 협소하고 방음이 안 되어 이웃 방의 소음으로 단란한 연인과의 밤을 망치는 흔한 리조트를 단호히 거부합니다. 우리는 오직 단 3동의 독채 빌라만을 프라이빗하게 운영하여, 지평선을 배경으로 붉은 노을이 떨어지는 지중해의 낭만을 오롯이 당신의 영혼 속에 각인해 드립니다.",
          stats: [
            { label: "동시 수용 빌라 동수", value: "3동 프라이빗 독채" },
            { label: "방문 예약 대기 기간", value: "평균 35일 전" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "까사 벨라 럭셔리 아카이브",
        subtitle: "하얀 아치 벽면과 맑은 파란 바다의 색상 배합이 압도적인 인생 샷 갤러리입니다.",
        content_data: {
          items: [
            { title: "바다 바다 지평선과 이어진 수영장", description: "하늘빛과 수영장 물빛이 투명하게 하나로 융합되어 물 위에 떠 있는 듯한 착각을 주는 온수 풀", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "백색 실크 린넨 소파 야외 라운지", description: "그늘막 아치 아래에 기대어 샴페인 글라스 잔을 흔들며 은은한 라임 향 솔바람을 호흡하는 벤치", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "프렌치 랍스터 요리와 바다 스냅", description: "원목 야외 테이블 위에 올리브 오일 가니쉬 랍스터 구이와 투명한 화이트 와인 두 잔 스케치 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "독채 빌라 객실 사전 예약 의뢰",
        subtitle: "방문 예정 일시, 동반 인원 수, 요트 크루즈 투어링 신청 여부, 기념일 케이크 서비스 필요 여부를 편안히 기재해 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "풀빌라 객실 예약 신청"
        }
      }
    ]
  },

  camping_outdoor_gear: {
    templateId: "camping_outdoor_gear",
    name: "와일드 트레일 아웃도어 캠프",
    category: "Travel & Lifestyle",
    description: "러프하고 묵직한 카본 블랙과 타오르는 참나무 캠핑 황토 주황, 그리고 지프 아웃도어 카키 그린 색상으로 험난한 오지 캠핑과 서바이벌 매뉴얼을 전수하는 와일드 테마입니다.",
    image: "/templates/camping_outdoor_gear.png",
    theme: {
      fontFamily: "Impact, Space Grotesk, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 캠핑 모닥불 주황
        secondary: "#4b5563",   // 인더스트리얼 슬레이트 그레이
        accent: "#15803d",      // 산속 수풀 카키 그린
        background: "#09090b",  // 매트 서킷 블랙
        surface: "#18181b",     // 단단한 카본 섬유 그릴 차콜
        text: "#ffffff"         // 시인성 높은 완전 울트라 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "길이 끝나고 모험이 시작되는 곳, 나의 생존과 낭만을 수호하는 아날로그 장비 셋업",
        subtitle: "인스타 감성용 예쁘고 약한 소품 캠핑이 아닙니다. 혹한과 야생의 폭우 속에서도 체온을 사수하는 정통 오지 캠핑 서바이벌 기어 활용법과 참나무 장작 하나로 산속 어둠 속에서 불꽃을 피워내 조리하는 극한의 오버랜딩 어드벤처 가이드입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
          ctaText: "와일드 서바이벌 기어 몰",
          ctaLink: "#services",
          features: [
            { text: "영하 20도 혹한에서도 거뜬히 단열 성능을 입증한 전술 군용 스펙 텐트 및 고중량 버너 셋업 제공" },
            { text: "부싯돌 하나와 칼날 단독으로 산속에서 쉘터를 짓고 수분을 확보하는 부시크래프트 비법 수록" }
          ]
        }
      },
      {
        section_type: "services",
        title: "서바이벌 테마 요강",
        subtitle: "야생의 숲속을 거침없이 개척하는 거친 아웃도어 스포츠의 실전 목록입니다.",
        content_data: {
          items: [
            {
              title: "부시크래프트 불 피우기",
              description: "화학 라이터 없이 파이어스틸 긁기 칼끝 마찰 공법과 마른 나뭇잎만으로 안전하게 모닥불 씨앗을 터뜨립니다.",
              icon: "Flame"
            },
            {
              title: "오지 오지 험로 오버랜딩 기어",
              description: "진흙과 급경사 험로를 통과하기 위한 4WD 차량 타이어 압력 세팅과 견인 윈치 공학 매뉴얼입니다.",
              icon: "Compass"
            },
            {
              title: "서바이벌 서바이벌 전술 도끼 나이프",
              description: "장작을 쪼개고 음식을 썰어내는 카본 고탄소 스틸 나이프 날 연마와 안전한 도끼질 타격 가이드입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아웃도어는 자연을 정복하는 교만이 아닌, 자연이 제시하는 혹독한 물리적 규칙 앞에 내 몸의 겸손함을 맞추는 연대입니다",
        subtitle: "모든 험로 코스는 산림청 공식 허가 노지 구역과 사유지 캠핑 인프라만을 합법적으로 선별합니다.",
        content_data: {
          description: "안녕하십니까. 와일드 트레일의 헤드 크래프터입니다. 우리는 쓰레기를 산에 두고 오는 몰상식한 글램핑 문화를 단호히 거부합니다. 우리는 차량 윈치 구조 세미나를 통해 자립 생존을 지향하고, 겉은 석탄처럼 그을려도 한 컵의 거친 커피 물을 끓이며 참나무 숲의 연기 냄새를 평생의 훈장으로 삼는 진정한 야생 개척자들의 길을 서포트하겠습니다.",
          stats: [
            { label: "누적 험로 투어링 횟수", value: "350회+" },
            { label: "보유 구조용 윈치 수량", value: "8세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "와일드 서바이벌 액티브 컷",
        subtitle: "참나무 숯불과 지프 쇳소리가 고스란히 귀에 들리는 듯한 거칠고 묵직한 공간 전경입니다.",
        content_data: {
          items: [
            { title: "오지 오지 숲속 짚라인 캠핑 캠프", description: "강물 옆 암벽 그늘에 지프 차량을 주차해두고 군용 카키 스펀지 텐트를 피팅해 불을 지피는 현장", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80" },
            { title: "4륜 지프 도강 험로 주행 찰나", description: "흙먼지와 물보라를 뿜어내며 바위를 타고 넘어가는 지프 차량의 묵직하고 활기 넘치는 액티브 샷", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "장작 불꽃 위에 구워지는 수제 통고기", description: "삼각 지지대 쇠사슬에 걸린 돼지 갈비 살점에 소금을 뭉텅 뿌리며 숯불 직화 그릴링을 가하는 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "서바이벌 원데이 스쿨 신청",
        subtitle: "오지 노지 개척 캠프 동참 문의, 부시크래프트 불 피우기 실전 워크숍 신청, 전술 도끼 구매 문의는 아래에 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "서바이벌 강습 예약"
        }
      }
    ]
  },

  minimalist_architect_living: {
    templateId: "minimalist_architect_living",
    name: "모노 아키텍트 홈 & 스튜디오",
    category: "Travel & Lifestyle",
    description: "정갈하고 맑은 편백나무 베이지와 묵직한 모노그라피 그레이 배합으로 여백의 미학을 전하는 미니멀리스트 아키텍트 테마입니다.",
    image: "/templates/minimalist_architect_living.png",
    theme: {
      fontFamily: "Outfit, Noto Sans KR, sans-serif",
      colors: {
        primary: "#1f2937",     // 맑은 노출 콘크리트 다크그레이
        secondary: "#f3f4f6",   // 라이트 매트 실버 그레이
        accent: "#78716c",      // 차분한 돌이끼 카키그레이
        background: "#fafaf9",  // 정갈한 석고 화이트 미색
        surface: "#ffffff",     // 깨끗한 위생 세라믹 요리대
        text: "#374151"         // 시인성 높은 스톤 슬레이트 카본
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "물건을 비워내고 공간의 여백을 확보하며, 생각의 밀도를 극대화하다",
        subtitle: "반복적인 인테리어 소품 쇼핑에 중독되셨나요? 모노그라피 건축 스튜디오 방식을 도입하여, 화려한 색상을 걷어내고 노출 콘크리트 벽면과 질감 좋은 자작나무 합판 가구 단 두 가지 요소만으로 전신의 시각 노이즈를 완벽 차단하는 미니멀 리빙 가이드입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "미니멀 아키텍트 리빙 북",
          ctaLink: "#services",
          features: [
            { text: "시각적 소음을 원천 차단하는 완전 히든 매립 도어 및 천장 간접 조명 시공 설계 도면 탑재" },
            { text: "쓸데없는 물건 100개를 버리고 평생 쓸 가구 1개만을 엄선 배치하는 비움의 인프라 공식" }
          ]
        }
      },
      {
        section_type: "services",
        title: "비움의 요약 코스",
        subtitle: "내 삶의 좌표에서 불필요한 무게를 걷어내는 지적인 라이프스타일 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "미니멀 가구 배치 설계",
              description: "동선을 방해하는 돌출 서랍장 대신 벽면과 완전히 수평을 이루는 자작나무 무몰딩 빌트인 수납장 도면입니다.",
              icon: "Compass"
            },
            {
              title: "스마트 간접 조명 레시피",
              description: "눈에 자극을 주는 돌출 전등을 철거하고, 3000K 캘빈 온도의 따뜻한 라인 간접 등만으로 실내 아늑함을 채웁니다.",
              icon: "Zap"
            },
            {
              title: "모노톤 리사이클 홈 가이딩",
              description: "재생 알루미늄 자재 가구와 무독성 천연 규조토 흙벽칠 마감재로 알레르기 제로 청정 가옥을 짓는 가이드입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "인테리어는 예쁜 소품을 쏟아붓는 채우기가 아닌, 더 버릴 물건이 없을 때까지 면적을 확보하는 뺄셈입니다",
        subtitle: "모든 인프라 설계는 자연 채광 창문의 각도를 시뮬레이션하여 하루 조명 전력 소비를 60% 절약합니다.",
        content_data: {
          description: "안녕하십니까. 모노 아키텍트 리빙의 마스터 건축 평론가입니다. 우리는 집안 가득 유행하는 싸구려 가구와 수입산 플라스틱 장난감을 채워두고 먼지를 방치하는 게으른 인테리어를 단호히 거부합니다. 우리는 공간의 통창 너머로 하늘이 보이고, 그늘이 벽면에 드리우는 그 자연의 흑백 영화 자체를 인테리어 삼아 당신의 깊은 뇌파 침묵과 독서 몰입을 돕겠습니다.",
          stats: [
            { label: "설계 개조 완료 가옥 수", value: "45가구" },
            { label: "협력 재생 가구 장인", value: "8명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "여백 가득한 콘크리트 가옥 갤러리",
        subtitle: "감상하는 것만으로도 머릿속의 어지러운 데이터가 맑게 정돈되는 아키텍트 전경입니다.",
        content_data: {
          items: [
            { title: "노출 콘크리트 통창 거실 뷰", description: "가구라고는 얇은 무채색 가죽 소파 하나와 둥근 바닥 매트뿐이며 마당 대나무가 보이는 정갈한 스페이스", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" },
            { title: "자작나무 매립 책상 서재실 코너", description: "손잡이 없는 히든 서랍장과 콘센트가 깔끔하게 숨겨진 스마트하고 지적인 1인 작업 벤치 존", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "회색 도자 화병과 무독성 규조토 벽면", description: "오전 채광 빛이 사선으로 규조토 벽을 훑으며 흐르고 소나무 가지 하나만 꽂힌 단독 도자기 병 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공간 리모델링 및 자문 신청",
        subtitle: "아파트 평수 및 현재 가옥 사진 첨부, 희망 가구 비움 견적 가격 상담, 스페셜 간접 조명 시공 상담 신청서를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "건축 리빙 상담 예약"
        }
      }
    ]
  },

  slow_food_homestead: {
    templateId: "slow_food_homestead",
    name: "어반 그레이스 팜하우스 & 가든",
    category: "Travel & Lifestyle",
    description: "싱그러운 허브 세이지 그린과 포근한 꿀 베이지 톤 조합이 도심 속 유기농 농장과 홈메이드 홈 가드닝 브런치를 풍요롭게 어필하는 테마입니다.",
    image: "/templates/slow_food_homestead.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, sans-serif",
      colors: {
        primary: "#15803d",     // 싱그러운 허브 가든 그린
        secondary: "#fef08a",   // 달콤한 꿀 레몬 베이지
        accent: "#d97706",      // 크래프트 텃밭 브라운 토양
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 깨끗하고 위생적인 나무 식탁 화이트
        text: "#14532d"         // 눈이 편안한 포레스트 틸 카키
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "내가 직접 흙을 만져 키운 제철 상추와 무설탕 천연 유자 수제 잼의 풍요",
        subtitle: "공장에서 대량 생산하여 보존제가 범벅된 마트 가공 식품에 영혼을 잃으셨나요? 어반 팜하우스 방식으로, 옥상이나 미세 테라스 한편에 아기자기한 스마트 수경 텃밭을 일구고, 그 유기농 수확물로 아침 식사 브런치를 뭉근히 요리하는 진정한 슬로우 라이프스타일 처방전입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1500937386664-56d159f87b81?auto=format&fit=crop&w=1200&q=80",
          ctaText: "수제 가드닝 패키지 확인",
          ctaLink: "#services",
          features: [
            { text: "무농약 유기농 상추, 방울토마토 모종 심기와 배양액 정량 제조 수기 매뉴얼 기본 수록" },
            { text: "제철 과일의 비타민 성분을 100% 보존하며 방부제 없이 잼을 다리는 홈 캔닝 비법 강의" }
          ]
        }
      },
      {
        section_type: "services",
        title: "팜하우스 시그니처",
        subtitle: "흙의 온기와 태양의 에너지를 고스란히 식탁 위로 수확하는 슬로우 웰빙 가이드입니다.",
        content_data: {
          items: [
            {
              title: "홈 가드닝 텃밭 셋업",
              description: "아파트 베란다 일조량에 맞춰 LED 스마트 생장 조명을 설계하고 물빛 수경 재배 판을 조립하는 강습입니다.",
              icon: "Leaf"
            },
            {
              title: "천연 무설탕 잼 & 발효 수제 소스",
              description: "정제 설탕 대신 알룰로스, 프락토 올리고당을 넣어 단맛을 입히고 사과 식초로 발효시킨 가든 소스 레시피입니다.",
              icon: "Heart"
            },
            {
              title: "로컬 농가 직송 정기 구독",
              description: "우리가 직접 재배하지 못하는 뿌리 채소들은 강원도 청정 농가 연합에서 갓 캐내 당일 직송 배달받는 구독망입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "슬로우 푸드는 단순히 음식을 천천히 씹어 먹는 것이 아닌, 식재료가 씨앗에서 식탁에 오르기까지의 생태학적 여정을 존중하는 태도입니다",
        subtitle: "모든 홈메이드 소스는 화학 감미료 전혀 없이 발효 매실청과 생마늘 오일 베이스로 뭉근히 끓여집니다.",
        content_data: {
          description: "안녕하십니까. 어반 그레이스 팜하우스의 헤드 가드너이자 영양사입니다. 혀끝만 자극하는 인스턴트 양념과 미세플라스틱 우려 가득한 배달 용기 외식에 몸과 마음을 망치고 계시진 않나요? 우리는 매일 흙을 한 줌 만지며 손끝 감각을 해독하고, 내 손으로 정직하게 수확한 초록 엽록소 한 그릇을 통해 진정한 몸의 평화와 가족의 미소 가득한 아침을 돌려드리겠습니다.",
          stats: [
            { label: "자가텃밭 셋업 교육생", value: "1,500명 돌파" },
            { label: "보유 협력 유기농 농가", value: "14곳" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "싱그러운 베란다 스마트 텃밭 & 키친",
        subtitle: "초록 채소들이 햇살을 머금고 무배출 청정 호흡하는 상쾌한 친자연 공간 전경입니다.",
        content_data: {
          items: [
            { title: "베란다 수경 재배 LED 텃밭 랙", description: "물빛 광원을 뿜는 스마트 화분 틀 위에서 청상추와 이탈리안 바질 잎사귀가 파릇하게 자란 조리실 한구석", image: "https://images.unsplash.com/photo-1500937386664-56d159f87b81?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 오크 원목 주방 식탁 존", description: "유리 병 가득한 홈메이드 유자청과 라벤더 꽃 병이 따스한 햇살 가에 세팅된 소박하고 예쁜 브런치 다이닝", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 무설탕 잼 끓임 스냅", description: "동 냄비 안에서 선홍빛 딸기와 메이플 시럽 원액이 뭉근히 끓어오르며 맛깔스러운 거품을 내는 장인의 작업실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "텃밭 셋업 컨설팅 및 수제 소스 상담",
        subtitle: "우리 집 베란다 크기에 맞는 텃밭 자재 견적 의뢰, 제철 유기농 소스 패키지 정기 배달 구독 신청은 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "가드닝 컨설팅 예약"
        }
      }
    ]
  },

  digital_nomad_workspace: {
    templateId: "digital_nomad_workspace",
    name: "리모트 해븐 코워킹 스테이",
    category: "Travel & Lifestyle",
    description: "이국적인 터키쉬 에메랄드 블루와 차분한 스톤 그레이, 그리고 따스한 코코넛 오프화이트 배합으로 일과 방랑의 완벽한 밸런스를 돕는 노마드 스테이 테마입니다.",
    image: "/templates/digital_nomad_workspace.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#0f766e",     // 이국적인 틸 에메랄드 그린
        secondary: "#f0fdfa",   // 맑고 깨끗한 아쿠아 오프화이트
        accent: "#ea580c",      // 앰버 오렌지 썬
        background: "#fafbfc",  // 시원한 아일랜드 퓨어 화이트
        surface: "#ffffff",     // 깨끗한 위생 데스크 화이트
        text: "#111827"         // 시인성 극대화 슬레이트 차콜
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오전에는 에메랄드 바다에서 수영을, 오후에는 초고속 와이파이 속에서 글로벌 업무를",
        subtitle: "차가운 유리 빌딩 콘크리트 사무실을 단호히 탈출하십시오. 인도네시아 발리의 숲속 테라스와 태국 치앙마이의 정갈한 풀빌라를 무대로, 쾌적한 에르고노믹스 스마트 의자, 전용 모니터, 그리고 무제한 스페셜티 에스프레소를 제공하여 완벽한 크리에이션을 보장하는 하이엔드 코워킹 노마드 스테이입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "노마드 한 달 살기 팩 신청",
          ctaLink: "#contact",
          features: [
            { text: "스타링크 위성 인터넷 망을 구축하여 정글 속이나 섬 해변에서도 300Mbps 초고속 와이파이 가동" },
            { text: "자세 피로를 차단하는 오클랜드 프리미엄 모션 데스크와 모니터 암 개별 책상 기본 구비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "노마드 편의 큐레이션",
        subtitle: "방랑과 비즈니스를 완벽히 공명시키는 노마드 해븐만의 전용 서비스 인프라입니다.",
        content_data: {
          items: [
            {
              title: "초고속 핫스팟 워크 라운지",
              description: "통유리 너머로 열대 우림 야자수를 보며 스페셜티 아이스 아메리카노를 마시고 듀얼 모니터로 일하는 무제한 카페 존입니다.",
              icon: "Zap"
            },
            {
              title: "프라이빗 화상 회의 폰 부스",
              description: "완벽한 방음과 에어컨, 링 조명이 매립되어 글로벌 클라이언트와의 줌 미팅 및 화상 프레젠테이션을 지원합니다.",
              icon: "Compass"
            },
            {
              title: "네트워킹 노마드 모임 파티",
              description: "매주 금요일 밤 풀 사이드 바비큐 그릴을 가동하여 전 세계 IT, 디자인 분야 노마드들과 사업 지식을 공유합니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "노마드 라이프스타일은 단순히 랩탑을 들고 놀러 다니는 한량이 아닌, 장소의 제약을 넘어 나만의 비즈니스 가치를 전 세계에 증명하는 프로페셔널의 집념입니다",
        subtitle: "모든 객실은 정밀 암막 커튼과 시몬스 침대 시공으로 완벽한 야간 숙면 온도를 보장합니다.",
        content_data: {
          description: "안녕하십니까. 리모트 해븐 스테이의 오너 노마드입니다. 우리는 인터넷이 끊기고 의자가 불편해 맥북을 켜지도 못하고 허리 통증을 유발하는 싸구려 동남아 숙소를 단호히 거부합니다. 우리는 글로벌 빅테크 출신 개발자와 디자이너들이 실제 상주하며 일을 완수하도록 설계된 정밀한 IT 인프라를 구축하였으며, 일을 마친 뒤 요가와 수영으로 몸을 리셋하는 완벽한 워크앤라이프의 기적을 매 순간 선사하겠습니다.",
          stats: [
            { label: "누적 거쳐간 글로벌 노마드 수", value: "3,500명+" },
            { label: "구비된 프라이빗 모션데스크", value: "24석 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "정글 속 코워킹 라운지 & 풀 스테이",
        subtitle: "바라보는 것만으로도 내 맥북을 들고 떠나고 싶게 만드는 에너제틱한 공간 전경입니다.",
        content_data: {
          items: [
            { title: "야자수 숲 속 인피니티 풀 워크벤치", description: "시원한 수영장 옆에 놓인 파라솔 아래서 무선 네트워크를 켜고 코딩 작업을 진행하는 노마드의 스냅", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" },
            { title: "방음 방지 화상 미팅 폰 부스 코너", description: "아늑한 핀 조명이 얼굴을 비추고 헤드셋을 착용한 채 슬랙 화상 대화를 진행하는 쾌적한 1인 부스 내부", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "로컬 에스프레소 마끼아또와 기어 셋업", description: "원목 책상 위에 맥북, 무선 키보드, 수제 커피 한 잔과 싱그러운 바실 이파리 가니쉬 조화 찰나 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "한 달 살기 레지던스 입주 신청",
        subtitle: "희망 입주 기간, 코워킹 고정석 신청 유무, 동반 인원 수, 그리고 현재 하시는 비즈니스 분야를 가볍게 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "노마드 스테이 예약"
        }
      }
    ]
  },

  backpacker_hostel_social: {
    templateId: "backpacker_hostel_social",
    name: "칠하우스 로컬 오아시스 호스텔",
    category: "Travel & Lifestyle",
    description: "에너제틱하고 화사한 해변 태양 선셋 옐로우와 청량한 파도 민트 블루, 그리고 깨끗한 오프화이트 조합이 배낭여행객들의 활기차고 사교적인 소통을 이끄는 테마입니다.",
    image: "/templates/backpacker_hostel_social.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 청춘 선셋 오렌지
        secondary: "#ccfbf1",   // 시원하고 맑은 해변 민트
        accent: "#0d9488",      // 아쿠아 마린 틸 그린
        background: "#fafcfb",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 정갈한 조리대 화이트
        text: "#111827"         // 시인성 높은 다크 슬레이트 차콜
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "낯선 배낭 하나를 메고 들어와, 전 세계에서 온 청춘들과 친구가 되어 나가는 곳",
        subtitle: "외롭고 비싼 단독 호텔 방에 갇혀 계시진 않나요? 칠하우스 오아시스 방식으로, 매일 저녁 해변 루프탑 야외 테라스에서 벌어지는 무료 맥주 소셜 살롱 파티와, 전 세계 보헤미안 배낭여행객들이 한 데 모여 자신들의 방랑 스토리를 노래하는 유쾌하고 활기 가득한 소셜 호스텔입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 소셜 파티 스케줄",
          ctaLink: "#services",
          features: [
            { text: "프라이빗 프라이빗 개인 암막 커튼과 개별 콘센트, 수납함을 완비한 쾌적하고 조용한 도미토리 룸" },
            { text: "체크인 시 칠하우스 웰컴 맥주 1잔 무료 쿠폰 및 수제 로컬 아틀라스 맵 무상 증정 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "칠하우스 소셜 큐레이션",
        subtitle: "모르는 이들과 기분 좋게 믹싱되며 청춘의 낭만을 폭발시키는 소셜 라인업입니다.",
        content_data: {
          items: [
            {
              title: "해변 루프탑 비어 살롱",
              description: "매일 저녁 7시, 노을이 내려앉는 루프탑 바에서 버스킹 어쿠스틱 통기타 음악을 들으며 시원한 맥주를 들이켜는 소통 파티입니다.",
              icon: "Flame"
            },
            {
              title: "원데이 로컬 푸트 트립",
              description: "관광 안내소 리플렛에는 절대 없는, 호스텔 마스터가 매주 화요일 직접 데려가는 골목길 수제 국수 시장 비밀 투어입니다.",
              icon: "Compass"
            },
            {
              title: "해변 바다 아침 플로깅 캠페인",
              description: "아침 8시, 파도에 밀려온 모래사장 쓰레기를 호스텔 크루들과 가볍게 주우며 조깅하는 친환경 건강 모닝 코스입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "배낭여행은 단순히 싼 숙소를 찾아 방황하는 고행이 아닌, 내 영혼의 나이를 20살 청춘으로 유지하는 평생의 신나는 탐구입니다",
        subtitle: "도미토리 침실 전원은 100% 무진동 저온 냉방과 백색 소음 방음 부스 시공으로 숙면을 보장합니다.",
        content_data: {
          description: "안녕하십니까. 칠하우스 오아시스 호스텔의 오너 캡틴입니다. 우리는 위생 상태가 불량하고 칙칙하여 불쾌감을 유발하는 싸구려 민박을 단호히 거부합니다. 우리는 매일 아침 전 침구류를 100도 고온 스팀 멸균 소독하고 세탁하며, 시원한 민트 블루 네온 사인이 흐르는 감각적인 라운지 안에서 전 세계 모험가들의 따뜻한 영혼의 고향을 지켜내겠습니다.",
          stats: [
            { label: "누적 거쳐간 다국적 백패커", value: "12,000명+" },
            { label: "제휴 로컬 액티비티 개수", value: "15가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "칠하우스 활기찬 소셜 스냅",
        subtitle: "사진만 보아도 웃음소리와 즐거운 음악 소리가 들리는 듯한 보헤미안 갤러리 전경입니다.",
        content_data: {
          items: [
            { title: "루프탑 맥주 펍의 밤 노을 파티", description: "서로 국적이 다른 청춘들이 잔을 맞부딪치며 환하게 웃고 있는 감각적이고 다이내믹한 파티 찰나", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" },
            { title: "개인 침구마다 커튼이 쳐진 침실", description: "원목 이층 침대 구조물에 정갈한 하얀 암막 시트가 장착되어 개인 프라이버시를 사수하는 쾌적한 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "해변 비치 발리볼 게임 현장", description: "뜨거운 선셋 태양 아래 모래사장 네트 너머로 수십 명의 모험가들이 배구를 즐기며 점프하는 활력 가득한 스틸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "도미토리 객실 및 소셜 파티 참여 문의",
        subtitle: "방문 예정 일시, 예약 박수, 도미토리(남성/여성/혼성) 선택, 웰컴 파티 참여 여부를 기재해 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "호스텔 객실 예약"
        }
      }
    ]
  },

  cycling_route_expedition: {
    templateId: "cycling_route_expedition",
    name: "바이시클 투어리스트 로드",
    category: "Travel & Lifestyle",
    description: "에너제틱하고 스포티한 형광 네온 그린과 묵직한 도로 아스팔트 카본 그레이 배합이 사이클링 투어와 자전거 라이딩 어드벤처의 속도감을 전하는 테마입니다.",
    image: "/templates/cycling_route_expedition.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#10b981",     // 활기찬 네온 그린 아우라
        secondary: "#1f2937",   // 도로 아스팔트 카본 그레이
        accent: "#ea580c",      // 네온 오렌지 스피드
        background: "#090d16",  // 미래적인 테크 다크블루
        surface: "#111827",     // 은빛 알루미늄 프레임 차콜
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "페달을 힘차게 밟아 나아가는 나의 바퀴 끝, 시원한 바다 바람을 가르는 스피드",
        subtitle: "단순히 한강 둔치만 달리는 취미에 지치셨나요? 바이시클 투어리스트 방식으로, 국토 종주 자전거 도로 전 구간 정밀 고도 분석 GPS 데이터와 수제 카본 프레임 정비 툴킷을 완비하여, 제주도 환상 자전거길부터 동해안 해변길까지 오롯이 내 두 다리의 엔진으로 개척하는 자전거 여행가들의 나침반 가이드북입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=1200&q=80",
          ctaText: "국토종주 사이클 루트 지도",
          ctaLink: "#services",
          features: [
            { text: "업힐 경사도 15% 이상 구간 우회로 및 자전거 전용 펑크 자가 정비 쉼터 실시간 정보망 가동" },
            { text: "로드 사이클 휠셋 및 장거리 투어링용 패니어 백 랙 시공 자가 튜닝 영상 강좌 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "벨로 익스페디션 에센셜",
        subtitle: "자전거와 내 몸의 기어를 완벽히 정렬하여 장거리 국토 횡단을 완수하는 핵심 프로그램입니다.",
        content_data: {
          items: [
            {
              title: "자전거 자가 피팅 & 프레임 케어",
              description: "내 인심(Inseam) 길이에 맞게 안장 높이와 스템 각도를 0.1mm 단위로 조절하여 허리 무릎 통증을 원천 차단하는 강좌입니다.",
              icon: "Zap"
            },
            {
              title: "장거리 투어링 백 팩킹 셋업",
              description: "자전거 리어 랙에 수납 패니어 백을 장착하고 방수 텐트, 경량 코펠을 정밀 분산 적재하는 무게 균형 법칙입니다.",
              icon: "Compass"
            },
            {
              title: "국토종주 GPS 루트북 발송",
              description: "산악 구간 고도 상승률과 보급 주유소, 라이더 전용 숙소를 선별한 GPX 파일을 맥북 스마트폰에 다운받는 구독망입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "사이클링은 기름 한 방울 쓰지 않고 오직 내 심장의 박동과 땀방울만으로 국경을 넘는 가장 가장 친환경적이고 지고한 자유의 투쟁입니다",
        subtitle: "모든 라이딩 루트는 자전거 전용 도로 비중 95% 이상으로만 정밀 설계되어 자동차 사고 우려를 완벽 차단합니다.",
        content_data: {
          description: "안녕하십니까. 바이시클 투어리스트 로드의 헤드 브루마스터이자 미캐닉 코치입니다. 우리는 보호 장구도 없이 차도를 역주행하여 시민들의 찌푸린 눈총을 유발하는 무법 자전거 문화를 단호히 거부합니다. 우리는 헬멧 착용 에티켓과 수제 카본 프레임 정비 세미나를 정기 수여하며, 페달을 밟을 때 심폐 속 깊이 유기농 솔바람 향취를 채우는 건전한 라이더들의 낙원을 사수하겠습니다.",
          stats: [
            { label: "누적 GPX 다운로드 수", value: "8,500회" },
            { label: "보유 자전거 자가 정비 강좌", value: "24세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "은빛 휠셋과 대자연의 속도감",
        subtitle: "당장 져지를 입고 안장 위에 올라 은빛 체인을 돌리고 싶게 만드는 스포티한 전경입니다.",
        content_data: {
          items: [
            { title: "동해 해안도로 사이클 라이딩", description: "바다 파도가 몰아치는 해안 방벽 옆 전용 도로를 따라 여러 명의 라이더들이 일렬로 질주하는 시원한 스포츠 스틸", image: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=600&q=80" },
            { title: "카본 로드 바이크 정비대 셋업", description: "실내 미캐닉 룸 거치대에 자전거를 올려두고 은빛 체인에 정유 스프레이를 정교하게 주유하는 클린 실무실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "패니어 백이 장착된 투어링 그래블 바이크", description: "황혼 노을 속 갈대밭 도로 한편에 짐이 가득 찬 튼튼한 철제 프레임 자전거를 세워두고 촬영한 사색적인 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "라이딩 크루 가입 및 GPX 다운로드",
        subtitle: "주말 그래블 투어링 정모 참가 신청, 자전거 자가 피팅 오프라인 강습 예약, 로드 바이크 전용 맵 다운로드는 아래 양식을 사용하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "라이딩 강습 신청"
        }
      }
    ]
  },

  scuba_diving_marine: {
    templateId: "scuba_diving_marine",
    name: "딥블루 아쿠아 다이빙 아카데미",
    category: "Travel & Lifestyle",
    description: "신비롭고 맑은 사파이어 오션 네이비와 빛나는 네온 형광 주황 포인트 조합이 바닷속 해양 생태계와 액티브 다이빙의 짜릿함을 선사하는 테마입니다.",
    image: "/templates/scuba_diving_marine.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#0284c7",     // 사파이어 청정 바다 블루
        secondary: "#ccfbf1",   // 맑고 깨끗한 산호초 민트
        accent: "#f97316",      // 형광 구조 네온 오렌지
        background: "#090d16",  // 심해 속 고요한 다크 네이비
        surface: "#111827",     // 알루미늄 산소통 차콜 슬레이트
        text: "#f3f4f6"         // 시인성 높은 은빛 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "중력의 족쇄를 완전히 벗어나, 투명한 사파이어 바닷속을 날아다니다",
        subtitle: "모든 지상의 일상 스트레스를 끄고 산소호흡기 마찰 소리만을 귓가에 들으며, 오색빛 찬란한 열대 해양 수중 절벽과 침몰선을 탐험하는 오픈워터 스쿠버 다이닝 라이프스타일 스쿨입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오픈워터 자격증 코스 상담",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 공인 스쿠버 다이빙 협회 PADI 공식 인증 최고 수준의 다이빙 마스터 다이렉트 지도 보증" },
            { text: "감압병 등 해양 수중 사고 안전 가이드를 엄수하는 정밀 감압 탱크 인프라 확보" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마린 익스페디션",
        subtitle: "바다 깊숙한 신비로운 감동과 해양 아드레날린을 안전하게 수확하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "오픈워터 초급 자격증 코스",
              description: "실내 풀장 수중 장비 탈착 훈련과 중성 부력 제어를 마친 뒤, 맑은 동해 바다 해변 실전 다이빙 4회를 완수합니다.",
              icon: "Zap"
            },
            {
              title: "어드밴스드 야간 & 네비게이션 다이빙",
              description: "수심 30미터 딥 다이빙과 야간 서치라이트 야생 야간 다이빙, 그리고 나침반 수중 내비게이션을 익힙니다.",
              icon: "Compass"
            },
            {
              title: "해양 생태계 보존 환경 캠페인",
              description: "바다 절벽 틈새의 폐어망과 낚시 낚싯줄을 가위로 잘라내고 쓰레기를 수거하는 플로깅 수중 프로그램입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스쿠버 다이빙은 폐 속의 공기량 조절을 통해 내 몸을 물의 밀도와 완벽하게 수평 융합시키는 물리학입니다",
        subtitle: "모든 장비는 미세 감염 방지를 위해 당일 강습 전 살균 액체 세척과 필터 필터 청결을 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 딥블루 아쿠아 다이빙의 헤드 디렉터 마스터입니다. 우리는 자격증만 종이로 발급하고 안전 가이드를 생략하여 수중 공황 상태를 조장하는 상업용 아카데미를 단호히 거부합니다. 우리는 개인별 물 공포증 해소를 위해 맞춤형 수중 이완 세션을 마친 뒤, 평생 잊지 못할 투명한 사파이어 은빛 침묵의 세계로 당신을 안내하겠습니다.",
          stats: [
            { label: "배출한 공인 다이버 수", value: "3,500명" },
            { label: "구비된 수입 공기 탱크", value: "48세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "신비로운 심해 수중 사진들",
        subtitle: "보기만 해도 바다 물빛의 시원함이 머리를 맑게 씻어주는 블루 크리스탈 갤러리입니다.",
        content_data: {
          items: [
            { title: "산호초 사이를 노니는 바다거북", description: "사파이어 물빛 속에서 다이버가 바다거북과 눈을 맞추며 부드럽게 유영하는 해양 수중 스틸 샷", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" },
            { title: "해양 침몰선 수중 통과 찰나", description: "오래된 난파선 녹슨 철골 구조물 사이로 서치라이트 불빛이 쏟아지는 신비롭고 아우라 가득한 다이빙 순간", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "다이빙 슈트 공기압 밸브 점검", description: "보트 데크 위에서 다이빙 마스터가 수강생의 레귤레이터 호스와 공기압 게이지 수치를 안전 체크하는 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "다이빙 코스 참가 신청 및 문의",
        subtitle: "원하시는 코스 레벨(오픈워터/어드밴스드/레스큐), 방문 가능 일정, 평소 귀 질환 유무를 적어 예약 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "스쿠버 다이빙 강습 신청"
        }
      }
    ]
  },

  vintage_retro_collector: {
    templateId: "vintage_retro_collector",
    name: "아날로그 프레임 빈티지 리빙",
    category: "Travel & Lifestyle",
    description: "고풍스럽고 묵직한 마호가니 에스프레소 브라운과 낡은 양장 종이 옐로우 크림, 그리고 황동 브라스 포인트 배합이 클래식 수집 라이프스타일을 연출하는 빈티지 테마입니다.",
    image: "/templates/vintage_retro_collector.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4a3b32",     // 깊은 마호가니 우드 브라운
        secondary: "#f5ebe0",   // 오래된 양장지 아이보리 크림
        accent: "#b45309",      // 황동 브라스 골드
        background: "#faf7f2",  // 안락한 조명 크림 웜베이지
        surface: "#ffffff",     // 정갈한 라이팅 책상 화이트
        text: "#2b221a"         // 잉크 먹물 다크 슬레이트 브라운
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시간이 빚어낸 묵직한 마호가니 나무 향과 아날로그 타자기 낙자 소리",
        subtitle: "모든 번쩍이는 최신형 디지털 기기를 서재 서랍 속에 꺼버리십시오. 1950년대 독일산 빈티지 올림피아 타자기의 철제 타이핑 타격음과 프랑스 벼룩시장에서 발견한 기하학적 황동 조명의 온기가 채워주는 지적인 골동품 수집가들의 라이프스타일 도감입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
          ctaText: "아날로그 아카이브 열람",
          ctaLink: "#services",
          features: [
            { text: "빈티지 시계, 아날로그 오디오 정밀 진공관 납땜 자가 수기 복원 가이드 도면 제공" },
            { text: "오래된 서적 양장 바인딩 가죽 코팅 케어 및 곰팡이 방지 보존 정밀 습도 조절 매뉴얼" }
          ]
        }
      },
      {
        section_type: "services",
        title: "빈티지 에센셜",
        subtitle: "느림의 기품 속에서 내면의 아늑함을 단단하게 가꾸는 골동품 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "독일제 빈티지 타자기 복원",
              description: "1960년대 수동 올림피아, 스미스 코로나 타자기의 붉은 잉크 리본을 교체하고 내부 활자 스프링을 정비합니다.",
              icon: "Zap"
            },
            {
              title: "진공관 아날로그 오디오 셋업",
              description: "차가운 스마트폰 블루투스 대신, 진공관 앰프에 열을 올려 따뜻한 진폭으로 LP판 바늘 긁는 소리를 청취합니다.",
              icon: "Compass"
            },
            {
              title: "유럽 빈티지 바자 루트 가이드",
              description: "프랑스 파리 방브 벼룩시장부터 독일 베를린 마우어파크 골동품 시장까지 숨겨진 보물 상점 지도입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아날로그는 기술의 낙후가 아닌, 고속 질주하는 정보 과잉 시대 앞에 한 조각 영혼의 흔적을 남기려는 우아한 속도 조절의 저항입니다",
        subtitle: "모든 빈티지 장비 복원 데이터는 오직 전통적 매뉴얼 복제본과 설계 복원 가이드를 기반으로 작성됩니다.",
        content_data: {
          description: "안녕하십니까. 아날로그 프레임 빈티지 리빙의 마스터 아키비스트입니다. 우리는 몇 달 만에 고장 나 버려지는 플라스틱 디지털 가공품을 단호히 거부합니다. 우리는 100년 전에 만들어져 여전히 톱니바퀴가 맞물려 돌아가는 태엽 시계처럼, 인간의 정직한 물리적 노동과 오랜 세월의 지혜가 깃든 유산을 보존하고 당신의 아날로그 서재를 기품 있게 채워내겠습니다.",
          stats: [
            { label: "복원 완료 아날로그 기기", value: "240대" },
            { label: "골동품 수집 정기 살롱 회원", value: "1,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "마호가니 서재 & 아날로그 타자기",
        subtitle: "바라보기만 해도 편안한 종이 냄새와 커피 향기가 풍기는 아늑한 공간 전경입니다.",
        content_data: {
          items: [
            { title: "클래식 타자기와 만년필 서재 책상", description: "황동 스탠드 불빛이 켜진 짙은 마호가니 책상 위에 편지지와 수동 타자기가 안착된 지적인 서재 공간", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80" },
            { title: "진공관 라디오와 턴테이블 코너", description: "따스한 주황색 램프 열량이 번지는 오디오 스피커 옆에 LP 레코드 판들이 정갈하게 수록된 감각적인 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오래된 가죽 일기장과 낙인 도장", description: "바람에 해진 갈색 가죽 표지 노트 위에 붉은 인장 도장을 꾹 눌러 날짜 낙관을 찍어내는 장인의 손끝 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "복원 자문 및 골동품 감정 의뢰",
        subtitle: "보유하신 빈티지 기기 모델명 및 고장 증상, 1900년대 초기 소형 가구 복원 자문 신청서를 아래 양식에 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아날로그 상담 신청"
        }
      }
    ]
  },

  pet_friendly_staycation: {
    templateId: "pet_friendly_staycation",
    name: "해피 퍼 테일 펫 웰커밍 빌리지",
    category: "Travel & Lifestyle",
    description: "포근하고 사랑스러운 커스터드 옐로우와 맑고 위생적인 알팔파 민트 그린, 그리고 크래프트 오프화이트 조화가 소중한 반려견과의 동행 여행을 돕는 테마입니다.",
    image: "/templates/pet_friendly_staycation.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#15803d",     // 깨끗한 천연 잔디 그린
        secondary: "#fef08a",   // 화사한 커스터드 옐로우
        accent: "#ea580c",      // 네온 오렌지 발바닥
        background: "#fafcfb",  // 맑고 깨끗한 아침 잔디 오프화이트
        surface: "#ffffff",     // 정갈하고 위생적인 타일 화이트
        text: "#1c2317"         // 눈이 편안한 다크 올리브 브라운
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "눈치 보며 구석에 가두지 마세요, 나의 영혼 같은 단짝 반려견과의 완벽한 동행",
        subtitle: "일반 펜션의 '애견 동반 불가' 거부 칼날에 상처받으셨나요? 해피 퍼 테일 리조트 방식으로, 반려견이 목줄 없이 마음껏 질주하는 300평 규모의 프라이빗 천연 잔디 천연 잔디 운동장과, 전문 펫 영양사가 빚어낸 수제 멍푸치노 웰컴 패키지를 무상 완비한 대한민국 최고 등급 펫 프렌들리 풀빌라 스테이입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "반려동물 독채 스테이 예약",
          ctaLink: "#contact",
          features: [
            { text: "반려견 관절 보호를 위한 특수 무독성 논슬립 슬라이드 계단 바닥 시공 전 객실 전면 배치" },
            { text: "천연 유기농 샴푸와 드라이룸 에어 샤워기, 저자극 브러쉬 세트 무상 무상 대여 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "퍼 테일 프로그램",
        subtitle: "댕댕이의 꼬리가 멈추지 않고 흔들리게 돕는 신나는 펫 프렌들리 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "300평 프라이빗 천연 잔디 구장",
              description: "펜스가 2미터 높이로 안전하게 둘러쳐져 목줄 없이 흙과 풀 내음을 맡으며 마음껏 전력 질주하는 운동장입니다.",
              icon: "Leaf"
            },
            {
              title: "반려견 천연 멍푸치노 수제 쿠키",
              description: "락토프리 우유에 캐롭 파우더 단백질을 얹어 빚어낸 영양 멍푸치노와 수제 단호박 뼈다귀 쿠키 플레이팅입니다.",
              icon: "Heart"
            },
            {
              title: "댕댕이 전용 아쿠아 온수 풀장",
              description: "슬관절 충격을 예방하는 정확한 온도 온수 풀에서 구명조끼를 입고 셰프와 함께 안전 패들링 수영을 즐깁니다.",
              icon: "Droplet"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "반려동물은 단순히 키우는 가축이 아닌, 평생을 약속 없이도 나만을 바라보며 사랑을 증명해 주는 고귀한 나의 가족입니다",
        subtitle: "모든 룸은 일주일에 한 번 반려견 전용 천연 편백 피톤치드 방역 소독을 엄격하게 진행합니다.",
        content_data: {
          description: "안녕하십니까. 해피 퍼 테일 빌리지의 캡틴 마스터 대표입니다. 우리는 말만 애견 동반이라고 하고 짖는 소리로 눈치를 주며 투숙객을 불편하게 만드는 무늬만 펫 펜션을 단호히 거부합니다. 우리는 100% 반려견 동반 전용으로만 객실을 가동하여, 이웃 개들과 친구가 되어 뛰놀고 견주들도 걱정 없이 해변 선셋 힐링 맥주 파티를 만끽하도록 설계했습니다.",
          stats: [
            { label: "방문한 해피 댕댕이 수", value: "3,500마리+" },
            { label: "정기 펫 클럽 마니아 독자", value: "2,400명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "댕댕이 천국 잔디 구장 & 풀 스테이",
        subtitle: "보기만 해도 꼬리치는 활력과 해피 호르몬이 가득 전해지는 펫 다이내믹 갤러리입니다.",
        content_data: {
          items: [
            { title: "잔디밭 위를 점프하는 골든 리트리버", description: "파란 하늘 아래 초록 천연 잔디 위에서 강아지가 원반을 잡고 뛰어오르는 쾌적하고 생동감 넘치는 찰나", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80" },
            { title: "객실 빌트인 펫 드라이룸 에어샤워 코너", description: "수영을 마치고 털을 보송보송하게 건조 관리하는 최고가 펫 케어 기기들이 구비된 위생실 스케치", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "견주 아메리카노와 멍푸치노의 공명 스냅", description: "원목 야외 테이블 위에 견주용 크루아상 플레이트와 강아지 전용 전설의 멍 수제 간식 보울 데코", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "독채 빌라 객실 실시간 예약 신청",
        subtitle: "방문 날짜 및 시간, 동반 반려견 견종 및 마리 수, 멍푸치노 영양식 패키지 사전 주문 여부를 기재해 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "펫 빌리지 객실 예약"
        }
      }
    ]
  },

  fine_art_gallery_lifestyle: {
    templateId: "fine_art_gallery_lifestyle",
    name: "크리에이티브 아틀리에 & 파인아트",
    category: "Travel & Lifestyle",
    description: "정갈하고 지적인 미니멀리스트 퓨어 화이트와 차분한 다크 초콜릿 차콜, 그리고 강렬한 캔버스 선홍빛 크림슨 레드 포인트로 현대 파인아트와 전시 감상을 소개하는 갤러리 테마입니다.",
    image: "/templates/fine_art_gallery_lifestyle.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#111827",     // 맑고 차가운 노출 콘크리트 다크그레이
        secondary: "#f3f4f6",   // 라이트 실버 메탈 그레이
        accent: "#b91c1c",      // 오리지널 크림슨 레드 포인트
        background: "#fafaf9",  // 정갈한 석고 화이트 미색
        surface: "#ffffff",     // 캔버스 아크릴 프레임 화이트
        text: "#1f2937"         // 시인성 높은 스톤 슬레이트 차콜
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "복잡한 캔버스의 구속을 벗어나, 순수한 질감과 획의 침묵 속에 머물다",
        subtitle: "상업용 장식 포스터 쇼핑을 단호히 거부하십시오. 모노크롬 아크릴 회화 작가들의 독창적인 수기 붓 터치 데이터와, 미술관 큐레이션 방식을 리빙 룸에 이식하여 집안 전체를 깊이 있는 현대 파인아트 미술관으로 연출하는 라이프스타일 평론입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 컬렉터 리포트 열람",
          ctaLink: "#services",
          features: [
            { text: "시각 소음을 정밀 차단하는 미술관 미술관 전용 매립 레일 조명 각도 시뮬레이션 매뉴얼 탑재" },
            { text: "신진 작가의 아크릴 캔버스 원화 소장 시 가치 상승 추적과 작품 보존 정밀 습도 조절 매뉴얼" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아뜰리에 컬렉션",
        subtitle: "내 삶의 공간에 영혼의 울림을 단단하게 수확하는 미술 평론 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "모노크롬 단색화 큐레이팅",
              description: "화려한 형상 대신 캔버스 위에 젯소를 덧칠하고 굵은 질감의 나이프 긁기 공법으로 빚어낸 단색화 해독입니다.",
              icon: "Award"
            },
            {
              title: "현대 입체 조소 가구 배치",
              description: "테이블 위에 공장제 소품 대신, 석고나 청동 소재의 독창적인 미니 수제 조각상을 안착시키는 무게 배치 법칙입니다.",
              icon: "Compass"
            },
            {
              title: "글로벌 아트 비엔날레 가이드",
              description: "이탈리아 베네치아 비엔날레부터 스위스 아트 바젤까지 숨겨진 보물 갤러리 상점 루트북입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "파인아트는 눈을 즐겁게 하는 가벼운 장식이 아닌, 작가가 캔버스를 붓으로 타격해 나간 시간의 정직한 물리적 흉터입니다",
        subtitle: "모든 컬렉터 데이터는 오직 전통적 학술 미술 논문과 작가 친필 인터뷰 데이터만을 기반으로 작성됩니다.",
        content_data: {
          description: "안녕하십니까. 크리에이티브 아틀리에의 수석 큐레이터입니다. 우리는 백화점에서 인쇄기로 대량 출력하여 싼 티가 흐르는 인테리어 복제 그림 액자를 단호히 거부합니다. 우리는 작가의 손끝 지문과 물감 아크릴 두께가 그대로 살아 숨 쉬는 원화 소장의 가치를 조명하고, 여백 가득한 화이트 큐브 살롱 속에서 당신의 깊은 뇌파 침묵과 예술적 독서를 보좌하겠습니다.",
          stats: [
            { label: "소장 중인 오리지널 원화", value: "35점" },
            { label: "정기 갤러리 정회원", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "여백 가득한 아트 갤러리 & 아뜰리에",
        subtitle: "감상하는 것만으로도 머릿속의 어지러운 데이터가 맑게 정돈되는 아키텍트 전경입니다.",
        content_data: {
          items: [
            { title: "아크릴 단색화 액자가 걸린 거실", description: "하얀 콘크리트 벽면에 굵은 거친 물감 결이 돋보이는 모노톤 대형 액자가 정갈하게 안착된 모습", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80" },
            { title: "아티스트 유화 아뜰리에 작업 코너", description: "원목 이젤 위에 물감이 튄 캔버스가 놓여있고 수십 개의 붓과 튜브 물감들이 러프하게 셋업된 작업실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "황동 입체 조각상과 미술 조명 스냅", description: "대리석 전시대 위에 오목한 금속 조각이 놓여있고 핀 포인트 샹들리에 빛이 세련되게 음영을 뿜는 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "작품 구매 대행 및 큐레이팅 자문",
        subtitle: "가옥 인테리어에 맞는 원화 작품 추천 견적, 신진 작가 후원 클럽 동참 신청, 갤러리 룸 단체 대관은 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아트 컨설팅 신청"
        }
      }
    ]
  },

  tea_ceremony_meditation: {
    templateId: "tea_ceremony_meditation",
    name: "다도 살롱 조용한 다실",
    category: "Travel & Lifestyle",
    description: "정숙함을 선사하는 말차 그린과 차분하고 온화한 대나무 샌드 베이지, 그리고 은은한 황토 브라운 조합이 명상과 전통 다도의 미학을 전하는 젠 스타일 테마입니다.",
    image: "/templates/tea_ceremony_meditation.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#166534",     // 맑고 기품 있는 말차 그린
        secondary: "#e9edc9",   // 대나무 껍질 연베이지
        accent: "#d4a373",      // 전통 다기 황토 브라운
        background: "#faf6f0",  // 한지 한방 웜베이지 오프화이트
        surface: "#ffffff",     // 정갈한 다도 찻상 화이트
        text: "#283618"         // 눈이 편안한 포레스트 그린 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "찻주전자에 따뜻한 물을 부어 말차를 개어내는 고요함과, 내면의 잔물결 이완",
        subtitle: "탄산음료나 합성 카페인 드링크로 뇌를 강박적으로 깨우는 소모적 일상을 멈추십시오. 뜨거운 온수로 보일(Boil)한 다기에 녹차 잎을 천천히 우려내며 찻잔에서 피어오르는 김의 유동성을 응시하고, 티베트 싱잉볼 진동과 하나 되는 젠 마인드 명상 다실 매뉴얼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
          ctaText: "조용한 다실 정기 세션 신청",
          ctaLink: "#contact",
          features: [
            { text: "천연 대나무 솔 차선(Chasen)으로 맑게 저어내는 정통 말차 제조 수기 레시피 기본 제공" },
            { text: "음식이 닿는 다기 전원 황토 옹기 숨구멍 보존 소독 관리되는 유기농 다실 플레이트 완비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "다도 큐레이션",
        subtitle: "막힌 어혈을 부드럽게 풀어주며 마음을 맑게 세척하는 다실 프로그램 목록입니다.",
        content_data: {
          items: [
            {
              title: "정통 다도 에티켓 & 팽주 클래스",
              description: "찻주전자를 쥐는 손끝의 각도부터 손님에게 찻잔을 건네는 법까지 기품 있는 전통 예절을 익히는 강좌입니다.",
              icon: "Heart"
            },
            {
              title: "말차 개기 & 죽로차 테이스팅",
              description: "대나무 차선으로 찻가루를 휘저어 미세 거품을 내는 말차 격불 기술과 이슬 먹고 자란 죽로차를 시음합니다.",
              icon: "Leaf"
            },
            {
              title: "젠 마인드 호흡 사색 캠프",
              description: "툇마루 너머 대나무 숲길 바람 소리를 들으며 머릿속의 잡념을 비워내고 1인 침묵을 호흡하는 명상실입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "다도는 차를 들이키는 목 넘김이 아닌, 차가 우려나는 기다림의 시간 속에 내 영혼의 불필요한 무게를 덜어내는 뺄셈입니다",
        subtitle: "모든 차 세션은 소수 정예 하루 오직 6명의 고객만을 예약제로 맞이하여 기품 있는 침묵을 보장합니다.",
        content_data: {
          description: "안녕하십니까. 다도 살롱의 오너 대표입니다. 우리는 물 가득 탄 티백 녹차나 시끄럽고 어수선한 프랜차이즈 테이크아웃 카페 문화를 단호히 거부합니다. 우리는 지리적 표시제 인증을 받은 청정 지리산 차나무 잎만을 엄선 조달하며, 툇마루 너머로 대나무 숲이 바람에 스치는 고요한 방에서 당신만을 위한 극진한 여왕의 다도 테이블을 준비해 두겠습니다.",
          stats: [
            { label: "연간 대접 VIP 다인 수", value: "1,500명" },
            { label: "보유 전통 무독성 토다기 세트", value: "24인분" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "고요한 툇마루 다실 & 대나무 정원",
        subtitle: "은은한 계피와 다도 찻잎 향취가 풍기는 품격 높은 고풍스러운 힐링 갤러리 전경입니다.",
        content_data: {
          items: [
            { title: "개인 프라이빗 다도 테이블 룸", description: "창호지 덧창 사이로 대나무 마당이 보이고 옹기 다기들이 정갈하게 세팅된 좌식 사색 스페이스", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 대나무 차선과 말차 찻잔", description: "옥빛 말차 가루가 거품을 내며 맑게 개어진 일본식 황토 잔과 차선 대나무 솔의 정교한 매칭 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "침묵 명상 티포트와 모래시계 스냅", description: "3분 모래가 떨어지는 소리 없는 찰나에 뜨거운 드립 워터가 붉은 차 잎을 우려내가는 위생 조리 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "다실 예약 및 단체 세미나 의뢰",
        subtitle: "방문 예정 일시, 예약 룸 선택, 동반 인원수, 그리고 휠체어 이용 어르신 동반 여부를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "다도 테이블 예약"
        }
      }
    ]
  },

  ski_alpine_resort: {
    templateId: "ski_alpine_resort",
    name: "알프스 파우더 스노우 스키 리조트",
    category: "Travel & Lifestyle",
    description: "눈부시게 깨끗한 스노우 크리스탈 화이트와 시원한 아쿠아 블루 네이비, 그리고 시야를 사수하는 네온 형광 주황 포인트로 아웃도어 스포츠 스키의 스릴을 전하는 테마입니다.",
    image: "/templates/ski_alpine_resort.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 차가운 알프스 블루 네이비
        secondary: "#e0f2fe",   // 눈부신 크리스탈 라이트 블루
        accent: "#ea580c",      // 형광 네온 스키 오렌지
        background: "#fafcfd",  // 퓨어 스노우 화이트 미색
        surface: "#ffffff",     // 위생 고글 글래스 덱 화이트
        text: "#0f172a"         // 울트라 슬레이트 네이비 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "눈 덮인 하얀 알프스 슬로프 위를 활주하는 짜릿한 스피드와 상쾌한 아침 공기",
        subtitle: "복잡하고 대기 줄만 길어 짜증을 유발하는 국산 스키장에 실망하셨나요? 오스트리아 알프스급 파우더 스노우 설질 관리 시스템을 도입하고, 정밀 정비된 헤드(Head) 카본 스키 플레이트와 무선 헬멧 커뮤니케이터를 완비하여 안전하고 짜릿한 설원 탈출을 보증하는 스키 & 알파인 샬레 리조트입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프리미엄 스키 강습 예약",
          ctaLink: "#contact",
          features: [
            { text: "국가대표 상비군 출신 프로 강사진의 정밀 1:1 비디오 촬영 교정 강습 라이브 피드백 제공" },
            { text: "강습 후 모닥불이 활활 타오르는 아날로그 벽난로가 구비된 통나무 살롱 휴식처 완비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "알파인 프로그램",
        subtitle: "설원 위에서 무릎과 엣지의 각도를 완벽 컨트롤하는 프로 사이클링 강습 요강입니다.",
        content_data: {
          items: [
            {
              title: "원데이 카빙 턴 마스터",
              description: "스키 플레이트 스키 날 엣지를 설면에 박아 스키의 반동력으로 미끄러지듯 스피드 턴을 완수하는 상급 클래스입니다.",
              icon: "Zap"
            },
            {
              title: "안전 패트롤 수칙 & 낙법 훈련",
              description: "경사도 25도 이상 슬로프 낙하 시 머리와 척추를 보호하며 안전하게 정지하고 일어나는 서바이벌 훈련입니다.",
              icon: "Compass"
            },
            {
              title: "알프스 통나무 샬레 바비큐",
              description: "스키를 마친 뒤 따스한 모닥불 난로 옆에 모여 스위스 정통 라클렛 치즈와 글루와인 따뜻한 와인을 들이켜는 소셜 살롱입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스키는 단순히 중력의 낙하 스피드를 견디는 모험이 아닌, 설면의 미세한 굴곡과 스키 날의 엣지 진동을 온몸으로 호흡하는 속도의 예술입니다",
        subtitle: "모든 렌탈 스키 플레이트와 부츠는 발 건강을 위해 당일 사용 후 건조 멸균 세척을 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 알프스 스키 리조트의 총감독이자 헤드 미캐닉입니다. 우리는 낡은 장비를 대충 빌려주고 부츠 발 통증을 유발하여 소중한 주말 여행을 망치는 불량 대여소를 단호히 거부합니다. 우리는 체형과 다리 인심 길이에 맞는 프리미엄 바인딩 수치 정밀 압력 설정을 가하고, 도심 속 하늘이 넓게 열린 알프스풍 샬레 라운지에서 당신의 스포티한 낭만을 완벽 지원하겠습니다.",
          stats: [
            { label: "누적 강습 마니아 학생 수", value: "3,500명" },
            { label: "구비된 프리미엄 카본 플레이트", value: "48세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "설원 위 질주 & 아날로그 벽난로",
        subtitle: "당장 스키 고글을 쓰고 알프스 산 아래로 미끄러져 가고 싶게 만드는 짜릿한 갤러리입니다.",
        content_data: {
          items: [
            { title: "하얀 설산을 미끄러지는 스키어 스틸", description: "흩날리는 파우더 눈보라를 뿜어내며 사선 카빙 턴 궤적을 그리는 활기차고 속도감 넘치는 다이내믹 샷", image: "https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&w=600&q=80" },
            { title: "통나무 벽난로가 타오르는 샬레 거실", description: "아늑한 앰버 조명 아래 장작불이 타닥타닥 소리를 내고 폭신한 린넨 소파가 세팅된 유럽풍 다이닝 라운지", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "스키 부츠 피팅 및 바인딩 게이지 셋업", description: "미캐닉 룸에서 컴퓨터 소프트웨어를 통해 라이더의 체중에 따라 릴리즈 밸브를 정밀 압력 설정하는 조리 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "스키 샬레 객실 및 강습 신청",
        subtitle: "방문 희망 날짜, 스키 강습 패키지 종류(강습+리프트권+장비 풀 렌탈+샬레 숙박 포함), 인원수를 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "스키 스쿨 신청 완료"
        }
      }
    ]
  },

  sailing_yacht_charter: {
    templateId: "sailing_yacht_charter",
    name: "오션 브리즈 마리나 요트 크루즈",
    category: "Travel & Lifestyle",
    description: "청량한 코발트 요트 머드 블루와 눈부시게 깨끗한 선창 크리스탈 화이트, 그리고 안전 네온 형광 주황 포인트로 해양 요트 크루즈의 클래식을 전하는 테마입니다.",
    image: "/templates/sailing_yacht_charter.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 선창 딥 오션 네이비
        secondary: "#ecfeff",   // 맑고 깨끗한 해안선 아쿠아
        accent: "#ea580c",      // 앰버 오렌지 썬셋
        background: "#fafcfd",  // 대리석 요란 오프화이트
        surface: "#ffffff",     // 선박 데크 퓨어 화이트
        text: "#155e75"         // 심해 속 아쿠아 틸 네이비
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "돛을 높이 올려 지평선을 향해 바람을 가르고, 오직 물소리와 파도 소리만을 호흡하다",
        subtitle: "복잡하고 매연 가득한 도심의 엔진 소리를 단호히 음소거하십시오. 프랑스제 45피트 고급 카타마란(쌍동선) 요트를 타고 무인도 해안 절경을 항해하며, 선상 해질녘 선셋 바비큐와 샴페인 마리아주를 만끽하는 하이엔드 마리나 세일링 클럽 라이프스타일 포털입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1505080856163-3a90910606c4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "럭셔리 요트 크루즈 코스 예약",
          ctaLink: "#contact",
          features: [
            { text: "국가공인 세일링 면허 보유 베테랑 스키퍼(선장) 및 안전 가드가 100% 동승 운항 보증" },
            { text: "선상 요트 덱 위에서 당일 새벽 수확한 수제 시푸드 플레이팅 및 스페셜 프랑스 와인 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "요트 클래스 큐레이션",
        subtitle: "바다의 자유로운 에너지를 온전하게 내 심장 속에 이식하는 럭셔리 라인업입니다.",
        content_data: {
          items: [
            {
              title: "세일 세일링 입문 & 키 핸들링",
              description: "풍향 지시계 윈드 와이드 데이터를 보며 메인 세일 돛의 각도를 밀고 당겨 바람의 추진력을 수확하는 실전 항해술입니다.",
              icon: "Compass"
            },
            {
              title: "선상 노을 디너 & 샴페인 마리아주",
              description: "붉은 노을이 바다 위로 용해되는 황혼 시각, 선상 갑판 테이블에서 재즈 음악을 들으며 조개 랍스터 구이를 맛봅니다.",
              icon: "Flame"
            },
            {
              title: "마린 블루 스노클링 수중 헬스",
              description: "바다 한가운데 안전 요트를 정박해두고 투명한 바닷속 산호초 무인도 해안가를 헤엄치는 심해 정화 코스입니다.",
              icon: "Droplet"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "요트는 바람의 각도와 물의 저항이라는 자연의 절대적인 기하학 앞에 내 몸의 겸손함을 조율하는 클래식한 뺄셈입니다",
        subtitle: "모든 크루즈 코스는 100% 실시간 날씨 위성 모니터링을 거쳐 파도 높이 1미터 이하인 맑은 날만 가동됩니다.",
        content_data: {
          description: "안녕하십니까. 오션 브리즈 마리나의 총괄 스키퍼 대표입니다. 우리는 불법 개조된 불쾌하고 흔들려 멀미를 야기하는 저가 모터보트 단체 관광을 단호히 거부합니다. 우리는 프랑스 정통 베네토 카타마란 쌍동 요트만을 독점 가동하여, 돛에 바람이 가득 차올라 소리 없이 물살을 가르는 그 기품 있는 항해의 침묵을 당신의 영혼 속에 선사하겠습니다.",
          stats: [
            { label: "연간 안전 세일링 마일 수", value: "12,000마일" },
            { label: "보유 프랑스 수입 카타마란", value: "3척 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "눈부신 쌍동선 요트 & 지평선",
        subtitle: "하얀 선체와 파란 바다의 색상 대비가 압도적인 인생 샷 갤러리 전경입니다.",
        content_data: {
          items: [
            { title: "돛을 활짝 펴고 달리는 요트 전경", description: "코발트 바다 위를 가르며 하얀 돛이 팽팽하게 부풀어 오른 쾌적하고 럭셔리한 크루즈 순간", image: "https://images.unsplash.com/photo-1505080856163-3a90910606c4?auto=format&fit=crop&w=600&q=80" },
            { title: "요트 내부 화이트 벨벳 가죽 거실", description: "대리석 와인 렉이 설치되어 있고 린넨 침구가 세팅되어 지평선을 볼 수 있는 선상 프라이빗 룸 스케치", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "선상 랍스터 버터 구이와 샴페인 스냅", description: "하얀 목조 선상 테이블 위에 석류 가니쉬 랍스터 구이와 거품 가득한 화이트 샴페인 잔 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "요트 전세기 및 크루즈 예약",
        subtitle: "방문 예정 일자 및 시간, 예약 룸(독채 크루즈/개인 티켓), 인원 수, 선상 바비큐 디너 신청 여부를 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "요트 크루즈 예약 신청"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 2: 11~20 (Hostel, Cycling, Scuba, Vintage, Pet-Friendly, Art Gallery, Tea Ceremony, Ski Alpine, Sailing Yacht)
  // Wait, in BATCH 1 we already wrote:
  // 1. wanderlust_explorer_blog
  // 2. luxury_glamping_retreat
  // 3. surf_beach_lifestyle
  // 4. wellness_yoga_retreat
  // 5. urban_espresso_lifestyle
  // 6. vanlife_camping_adventure
  // 7. boutique_villa_stay
  // 8. camping_outdoor_gear
  // 9. minimalist_architect_living
  // 10. slow_food_homestead
  // 11. digital_nomad_workspace
  // 12. backpacker_hostel_social
  // 13. cycling_route_expedition
  // 14. scuba_diving_marine
  // 15. vintage_retro_collector
  // 16. pet_friendly_staycation
  // 17. fine_art_gallery_lifestyle
  // 18. tea_ceremony_meditation
  // 19. ski_alpine_resort
  // 20. sailing_yacht_charter
  // Oh, that's exactly 20 templates in one single file! Let's double check.
  // Yes! 1 to 20 are all defined and written fully above.
};
