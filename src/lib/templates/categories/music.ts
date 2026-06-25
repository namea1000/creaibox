import { TemplateConfig } from "../registry";

export const MUSIC_TEMPLATES: Record<string, TemplateConfig> = {
  // ==========================================
  // BATCH 1: Rock, Classical, Electronic, Recording, Hip-hop
  // ==========================================
  indie_band_rebel: {
    templateId: "indie_band_rebel",
    name: "얼터너티브 인디 록 밴드",
    category: "Music",
    description: "거칠고 반항적인 묵직한 가죽 블랙과 강렬한 빈티지 머스터드 옐로우, 아드레날린 레드가 어우러져 라이브 콘서트와 신곡 발표를 파워풀하게 홍보하는 록 밴드 테마입니다.",
    image: "/templates/indie_band_rebel.png",
    theme: {
      fontFamily: "Impact, Space Grotesk, sans-serif",
      colors: {
        primary: "#eab308",     // 강렬한 레코드 옐로우
        secondary: "#1c1917",   // 가죽 자켓 매트 차콜 블랙
        accent: "#dc2626",      // 심장 박동 아드레날린 레드
        background: "#09090b",  // 러프 콘서트 다크 블랙
        surface: "#18181b",     // 앰프 스피커 철망 그릴
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-none", // 에지 넘치는 직선 레이아웃
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "세상을 향해 거칠게 포효하는 일렉트릭 기타와 묵직한 베이스 비트",
        subtitle: "메이저 음원 차트의 규격화된 기계식 오토튠 음악에 맞서, 지하실의 묵직한 먼지 냄새와 날것의 드럼 타격 사운드로 대중의 영혼을 흔들어 깨우는 4인조 얼터너티브 록 밴드의 공식 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
          ctaText: "신곡 뮤직비디오 감상",
          ctaLink: "#contact",
          features: [
            { text: "1970년대 빈티지 마샬 진공관 앰프와 아날로그 이펙터 페달이 자아내는 몽환적 사이키델릭 기타 리프" },
            { text: "올여름 펜타포트 락 페스티벌 메인 스테이지 타임테이블 정보 및 한정판 LP 선예매 티켓 오픈" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이번 주 추천 라이브 트랙",
        subtitle: "날것의 아날로그 감성을 100% 간직한 밴드의 시그니처 연주 리스트입니다.",
        content_data: {
          items: [
            {
              title: "붉은 먼지: 디스토션의 미학",
              description: "기타 사운드를 일그러뜨려 거친 폭풍우 속을 질주하는 듯한 카타르시스를 선물하는 얼터너티브 명작입니다.",
              icon: "Zap"
            },
            {
              title: "칠흑 속의 헤드라이트",
              description: "드럼의 120BPM 묵직한 리듬 베이스와 애절한 보컬의 쉰 목소리가 자아내는 몽환적인 밤길 질주송입니다.",
              icon: "Compass"
            },
            {
              title: "콘크리트 정글 속의 고독",
              description: "어쿠스틱 통기타 한 대와 쓸쓸한 베이스 기타 멜로디만으로 매연 가득한 도심 속 고독을 차분히 읊어냅니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "음악은 대중에게 박수 받기 위한 상품이 아닌, 내면의 고뇌를 뿜어내는 탈출구입니다",
        subtitle: "모든 라이프 공연 세션은 단 한 음의 립싱크도 허용하지 않고 100% 리얼 핸드 플레이로 수행됩니다.",
        content_data: {
          description: "반갑습니다. 얼터너티브 록 밴드의 리더 겸 베이시스트입니다. 우리는 기획사의 틀에 맞춰 댄스 동작을 외우는 인형 같은 음악을 단호히 거부합니다. 손가락에 피가 나도록 펜더 재즈 베이스 줄을 튕기고, 목이 찢어져라 함성을 지르며 관객과 땀방울을 나누는 라이브 클럽의 날것의 에너지가 바로 우리의 진짜 존재 이유입니다. 우리의 시끄러운 해방구에 합류하십시오.",
          stats: [
            { label: "전국 투어 라이브 공연 횟수", value: "340회 돌파" },
            { label: "등록 액티브 록 크루 수", value: "4,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "라이브 투어 & 빈티지 기어",
        subtitle: "뮤지션과 관객이 무대 아래서 온전히 땀으로 하나가 되어 호흡하는 라이브 현장입니다.",
        content_data: {
          items: [
            { title: "홍대 클럽 헤비 스윗 드롭 라이브", description: "강력한 드럼 타격과 일렉트릭 기타 피드백 노이즈가 관객의 심장을 요동치게 만드는 찰나", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" },
            { title: "1974년산 오리지널 깁슨 기타와 앰프", description: "세월의 흔적으로 도장이 벚겨져 중후한 아날로그 따스함을 풍기는 밴드의 메인 악기 기어 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "전국 서머 락 페스티벌 대공연 무대", description: "수만 명의 관객들이 슬램을 하며 뜨겁게 호응하고 무대 위로 쏟아지는 스포트라이트 스펙타클", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공연 대관 및 비즈니스 섭외 문의",
        subtitle: "전국 축제 헤드라이너 초청 의뢰, 락 펍 행사 섭외, 한정판 바이닐 LP 구매 문의는 아래로 연락주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "락 밴드 섭외 신청"
        }
      }
    ]
  },

  classical_soloist_pearl: {
    templateId: "classical_soloist_pearl",
    name: "클래식 피아노 솔리스트",
    category: "Music",
    description: "우아하고 고귀한 펄 아이보리와 깊은 광택의 콘서트 블랙, 세련된 샴페인 브론즈 골드가 선율의 기품과 음악적 권위를 전하는 클래식 피아니스트 테마입니다.",
    image: "/templates/classical_soloist_pearl.png",
    theme: {
      fontFamily: "Cormorant Garamond, Noto Serif KR, serif",
      colors: {
        primary: "#111827",     // 중후한 그랜드 피아노 블랙
        secondary: "#faf6f0",   // 실크 건반 오프화이트
        accent: "#c5a880",      // 품격 높은 샴페인 브론즈 골드
        background: "#fafaf6",  // 고풍스러운 클래식 대도서관 크림 베이지
        surface: "#ffffff",     // 맑고 깨끗한 아날로그 악보 화이트
        text: "#291e1b"         // 깊고 선명한 다크 우드 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "건반 위의 섬세한 손끝 터치가 그리는 불멸의 정서적 교향곡",
        subtitle: "모스크바 차이코프스키 국립음악원을 거쳐 전 세계 유수 콩쿠르를 휩쓴 피아니스트의 음악적 기원과, 베토벤 쇼팽 프란츠 리스트의 독창적인 해석을 투명한 아날로그 배음으로 전하는 개인 홈 허브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80",
          ctaText: "독주회 리사이틀 예매 정보",
          ctaLink: "#contact",
          features: [
            { text: "예술의전당 콘서트홀 그랜드 스타인웨이 피아노 실시간 녹음 하이 레졸루션 음원 공개" },
            { text: "작곡가별 연주 기하학과 손목 관절 릴렉스 피드백 수록 마스터 클래스 교재 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 클래식 리포터",
        subtitle: "작곡가들의 숨은 역사적 고뇌와 멜로디의 화성학적 뼈대를 심층 분석합니다.",
        content_data: {
          items: [
            {
              title: "쇼팽 발라드 1번의 비극적 루바토",
              description: "템포를 자유롭게 조절하는 루바토 기법을 통해 폴란드 망명 작가 쇼팽의 애국적 슬픔을 표현하는 터치를 다룹니다.",
              icon: "Sparkles"
            },
            {
              title: "리스트 파가니니 에튜드 손가락 도약",
              description: "초인적인 테크닉을 요구하는 옥타브 연타 시, 손가락 뼈마디 아치 압력을 제어하는 훈련법을 제시합니다.",
              icon: "Award"
            },
            {
              title: "바흐 평균율 클라비어의 대위법",
              description: "독립된 선율들이 유기적으로 모자이크처럼 얽히며 완전한 수학적 아름다움을 축조해내는 대위법 구조를 분석합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "클래식 피아노는 기계적인 타건 진도가 아닌, 내 영혼의 고막을 울리는 침묵의 사색입니다",
        subtitle: "건반을 가볍게 누르는 것이 아닌, 피아노 내부 향판의 잔향을 부드럽게 끌어내야 합니다.",
        content_data: {
          description: "안녕하십니까. 피아니스트 겸 클래식 디렉터입니다. 많은 이들이 클래식을 박물관에 갇힌 따분한 지식으로 오해합니다. 하지만 베토벤의 귓병 고뇌, 슈만의 지독한 우울은 오늘날 우리가 스마트폰 화면을 보며 느끼는 현대인의 고독과 정확하게 연결되어 있습니다. 우리는 건반이라는 매개체를 빌려 300년 전 거장들의 따스한 영혼의 숨결을 당신의 안방에 고해상도로 중계합니다.",
          stats: [
            { label: "누적 독주 리사이틀", value: "180회 연속" },
            { label: "석사 학위 보유 제자 수", value: "85명+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "리사이틀 홀 & 마스터클래스 전경",
        subtitle: "완벽한 타건 공명과 따뜻한 음향 음향이 수록되도록 철저히 관리되는 예술 스페이스입니다.",
        content_data: {
          items: [
            { title: "스타인웨이 앤드 선스 풀그랜드 피아노 홀", description: "천장의 돔 아키텍처 공명이 탁월하여 풍부한 배음의 잔향을 풍부하게 울려주는 메인 연주 무대", image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80" },
            { title: "1:1 집중 피아노 마스터클래스 실무실", description: "정밀 2채널 마이크로 수강생의 페달 깊이와 어깨 각도를 실시간 모니터링하여 피드백하는 개인 교육실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "실버 리넨 클래식 살롱 라운지", description: "연주회가 끝난 뒤 따스한 허브 차를 마시며 청중들과 밀착 소통하고 음악 담론을 나누는 예술적 대기실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "독주회 초청 및 전임 레슨 의뢰",
        subtitle: "클래식 독주회 콘서트 오퍼, 음대 입시 마스터클래스 1:1 레슨 신청, 브랜드 광고 제휴는 아래로 편지를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "피아노 레슨 및 연주 문의"
        }
      }
    ]
  },

  electronic_dj_neon: {
    templateId: "electronic_dj_neon",
    name: "EDM 프로듀서 & 테크노 DJ",
    category: "Music",
    description: "사이버 테크 네온 시안 블루와 루미너스 마젠타 핑크, 글래스모피즘 효과가 결합하여 클럽 테크노와 사이키델릭 EDM의 강력한 아우라를 뿜어내는 뮤지션 테마입니다.",
    image: "/templates/electronic_dj_neon.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#a855f7",     // 몽환적인 일렉트릭 바이올렛
        secondary: "#06b6d4",   // 차가운 네온 시안 블루
        accent: "#f43f5e",      // 심장 박동 포스 핑크
        background: "#03001e",  // 깊은 우주 미드나잇 인디고
        surface: "#0f172a",     // 세련된 아키텍처 슬레이트 차콜
        text: "#f9fafb"         // 레이저 별빛 퓨어 화이트
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "베를린 지하 벙커 테크노부터 대형 페스티벌을 뒤흔드는 일렉트로닉 앙상블",
        subtitle: "아날로그 모듈러 신디사이저의 고유 주파수 합성 기술과 실시간 DJ 믹싱 기어 컨트롤을 결합하여, 단순한 백그라운드 댄스 뮤직을 넘어선 공감각적 소리 치유와 육체의 해방을 선사하는 글로벌 DJ 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
          ctaText: "최신 테크노 라이브 셋 듣기",
          ctaLink: "#contact",
          features: [
            { text: "아날로그 신스 Moog 사운드 디자인 노브 조작법 및 미세 노이즈 억제 기법 특강" },
            { text: "글로벌 e스포츠 챔피언십 오프닝 디제잉 오리지널 트랙 및 리믹스 음원 무상 공개" }
          ]
        }
      },
      {
        section_type: "services",
        title: "일렉트로닉 스펙트럼",
        subtitle: "뇌파를 흔들고 온몸의 근육을 심장박동과 동기화시키는 일렉트로닉 코스입니다.",
        content_data: {
          items: [
            {
              title: "1:1 프로페셔널 디제잉 훈련",
              description: "턴테이블 비트 매칭, 곡 전환 스무스 크로스페이더 믹싱, 주파수 EQ 통제 기술을 완전 습득합니다.",
              icon: "Zap"
            },
            {
              title: "모듈러 신디사이저 사운드 디자인",
              description: "빵판 회로에 패치 케이블을 직접 연결하여 세상에 유일무이한 공상과학(SF) 사운드 웨이브를 조향합니다.",
              icon: "Cpu"
            },
            {
              title: "에이블톤 라이브 실전 작곡",
              description: "컴퓨터 시퀀서 내 가상악기 믹싱, 미디 노트 미세 퀀타이즈 조율을 통해 트렌디한 EDM을 작곡합니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "일렉트로닉은 기계의 힘을 빌려, 인간 심장 고유의 140BPM 리듬을 우주로 확장하는 예술입니다",
        subtitle: "모든 아날로그 노이즈 주파수에는 인간 뇌파를 맑게 정화해주는 소리 입자가 들어 있습니다.",
        content_data: {
          description: "반갑습니다. 일렉트로닉 프로듀서 겸 사운드 아티스트입니다. 우리는 컴퓨터가 알아서 쿵쾅거리는 식상한 클럽 믹싱을 단호히 거부합니다. 식물이 자랄 때 방출하는 미세 미세 전기 신호를 신디사이저로 수혈받아 음향으로 번역하고, 암실 속에서 레이저 빔과 주파수 파형을 기하학적으로 연동시키는 선도적인 공감각 미학을 추구합니다. 당신의 지적 청각 자산을 튜닝하십시오.",
          stats: [
            { label: "글로벌 클럽 헤드라이너 공연", value: "240회" },
            { label: "자체 소장 신디사이저 기어", value: "18대 보유" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "네온 테크노 콘서트 & 신스 랩",
        subtitle: "레이저 빔과 아날로그 신스의 몽환적인 앙상블이 펼쳐지는 공연 현장 리포트입니다.",
        content_data: {
          items: [
            { title: "베를린 벙커 테크노 아우라 레이징", description: "안개와 블루 레이저가 먼지를 뚫고 쏟아지는 지하 클럽에서 140비트 사운드로 군중을 몰입시키는 순간", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80" },
            { title: "아날로그 모듈러 신스 패칭 회로실", description: "수십 개의 케이블이 연결되어 은하수 흐르는 소리를 구현해 내는 복잡하고 신비로운 사운드 디자인 장비", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "글로벌 아웃도어 페스티벌 메인 콘솔", description: "수만 명의 관객 앞에서 파이오니어 DJ 컨트롤러 조작 부를 잡고 시그니처 드롭 비트를 폭발시키는 디렉터", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "DJ 섭외 및 음원 리믹스 의뢰",
        subtitle: "글로벌 축제 라이브 세션 의뢰, 브랜드 론칭 파티 디제잉 섭외, 광고 음악 제작 문의는 아래 양식을 활용해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "일렉트로닉 콜라보 제안"
        }
      }
    ]
  },

  recording_studio_analog: {
    templateId: "recording_studio_analog",
    name: "아날로그 프리미엄 녹음 & 믹싱 스튜디오",
    category: "Music",
    description: "중후한 앤티크 월넛 브라운과 따뜻한 빈티지 놋쇠 황동 골드 배합으로 고음질 어쿠스틱 수록과 전문 마스터링의 신뢰도를 높인 레코딩 스튜디오 테마입니다.",
    image: "/templates/recording_studio_analog.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#5c4033",     // 깊은 아날로그 콘솔 다크 브라운
        secondary: "#eae2d5",   // 마이크 방음 리넨 아이보리
        accent: "#d4af37",      // 빈티지 브라스 황동 골드
        background: "#1c1412",  // 안락하고 방음이 잘되는 웜베이지
        surface: "#2c1e1b",     // 원목 어쿠스틱 디퓨저 텍스처
        text: "#f5ebe0"         // 가독성 높은 소프트 크림 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오리지널 노이만 U87 콘덴서 마이크와 전설적인 SSL 아날로그 콘솔의 공명",
        subtitle: "디지털 무감각 오버 믹싱 대신, 진공관의 따스한 아날로그 倍音(Harmonics)을 투명하게 포착하고 0.01dB의 볼륨 밸런스 오차도 없이 목소리의 진짜 영혼과 숨소리마저 완벽 수록하는 레코딩 스튜디오입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
          ctaText: "녹음실 예약 현황 조회",
          ctaLink: "#contact",
          features: [
            { text: "보컬 수록, 성우 더빙, 스트링 콰르텟 어쿠스틱을 위한 완벽 방음 및 실내 잔향 조절 디퓨저 완비" },
            { text: "세계 최고 믹싱 콘솔 SSL 4000 시리즈 및 외산 하드웨어 컴프레서 아웃보드 장비 정품 구비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "레코딩 & 엔지니어링",
        subtitle: "소리의 정체성을 예리하게 조향하고 가수의 음색을 최대로 돋보이게 다듬는 수기 마스터피스입니다.",
        content_data: {
          items: [
            {
              title: "1:1 프라이빗 보컬 레코딩",
              description: "노이만 마이크의 주파수 감도 지표에 맞춰 성대 음색의 거친 치찰음을 잡고 촉촉하고 풍성하게 수록합니다.",
              icon: "Mic"
            },
            {
              title: "아날로그 하드웨어 아웃보드 믹싱",
              description: "컴퓨터 마우스 클릭 대신 실제 진공관 컴프레서 LA-2A 노브를 직접 돌리며 묵직하고 밀도 있는 보컬 톤을 축조합니다.",
              icon: "Layers"
            },
            {
              title: "돌비 애트모스(Dolby Atmos) 입체 음향",
              description: "소리가 전후좌우 상하 전 방향에서 3D 공간으로 회전하며 흘러나오도록 계측 믹싱하는 차세대 음향입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "소리는 공기를 진동시키는 물리적 주파수이며, 공간의 반사 각도에 따라 영혼을 울리는 음색이 결정됩니다",
        subtitle: "디지털 컴퓨터 믹서로는 흉내 낼 수 없는 100% 진공관 하드웨어의 따뜻한 공명이 있습니다.",
        content_data: {
          description: "안녕하십니까. 아날로그 레코딩 랩의 대표 믹싱 마스터 엔지니어입니다. 우리는 단순히 보정 프로그램 멜로다인으로 음정을 끼워 맞추는 기계적 튠 작업을 지양합니다. 가수가 내뱉는 첫 소절의 공기 압력, 숨을 마실 때의 미세한 목구멍 릴렉스 떨림까지 왜곡 없이 그대로 녹음지에 담아내는 정직한 마이크로폰 매칭을 고집합니다. 당신의 고귀한 음성을 영원히 명작으로 보존하십시오.",
          stats: [
            { label: "녹음 완료 누적 앨범 수", value: "2,400개 돌파" },
            { label: "소속 시니어 엔지니어", value: "5명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "스튜디오 라이브 룸 & 빈티지 아웃보드",
        subtitle: "최상의 흡음과 공학적인 음향 공명을 자아내도록 설계된 전문 음악 공간 전경입니다.",
        content_data: {
          items: [
            { title: "아날로그 SSL 믹싱 메인 컨트롤러룸", description: "수백 개의 볼륨 슬라이더가 컴퓨터와 실시간 연동되어 입체 3D 공간 음향을 제어하는 심장부", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80" },
            { title: "보컬 전용 단독 흡음 부스룸", description: "외부 무소음 양압 공조 시스템이 적용되고 노이만 시그니처 마이크와 금색 팝 필터가 완비된 단독 수록 부스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "어쿠스틱 드럼 및 기타 라이브 녹음홀", description: "천연 자작나무 디퓨저 패널이 벽면을 채워 드럼 소리가 먹먹하지 않고 화사하게 잔향을 퍼뜨리는 녹음 홀", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "녹음실 대관 및 음향 믹싱 견적 신청",
        subtitle: "이용 희망 일시, 시간(프로/아마추어), 녹음 분야(보컬/성우/합주), 믹싱/마스터링 추가 여부를 적어 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "레코딩 세션 예약 신청"
        }
      }
    ]
  },

  hiphop_beat_vault: {
    templateId: "hiphop_beat_vault",
    name: "힙합 비트메이커 & 비트 볼트",
    category: "Music",
    description: "트렌디하고 날카로운 네온 오렌지와 러프한 스트리트 차콜 블랙이 스트리트 힙합과 고강도 베이스 랩 음악 감성을 선사하는 비트 스토어 테마입니다.",
    image: "/templates/hiphop_beat_vault.png",
    theme: {
      fontFamily: "Outfit, Space Grotesk, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 선셋 주황
        secondary: "#fca5a5",   // 소프트 피치 핑크
        accent: "#10b981",      // 힙합 비타민 그린
        background: "#09090b",  // 매트 스트리트 블랙
        surface: "#18181b",     // 텍스처 메탈 컨테이너
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "가슴을 울리는 808 딥 서브 베이스와 트렌디한 붐뱁/트랩 비트 스토어",
        subtitle: "빌보드 차트 힙합 앨범의 댐핑 강한 스네어 사운드와 복고풍 재즈 원곡을 샘플링(Sampling)하여 얹어낸 독창적인 힙합 비트들을 미리 듣고, 즉시 온라인 라이선스를 안전하게 구매할 수 있는 비트 뱅크 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 신작 비트 청음하기",
          ctaLink: "#contact",
          features: [
            { text: "아날로그 드럼 머신 MPC 3000 특유의 따뜻하고 묵직한 로파이 질감 100% 재현 비트 배포" },
            { text: "독점 라이선스(Exclusive) 구매 시 상업용 음원 발매 및 수익 창출 법적 보장 인증서 발송" }
          ]
        }
      },
      {
        section_type: "services",
        title: "비트 볼트 카테고리",
        subtitle: "다채로운 랩 플로우와 라임에 딱 맞춰 녹아드는 힙합 장르별 핵심 비트 리스트입니다.",
        content_data: {
          items: [
            {
              title: "고밀도 808 딥 트랩 (Trap)",
              description: "귀를 때리는 빠른 하이햇 연타와 심장을 뒤흔드는 깊은 서브 베이스 808 글라이드가 결합한 타이트한 트랩 비트입니다.",
              icon: "Zap"
            },
            {
              title: "아날로그 재즈 샘플링 붐뱁 (Boom-Bap)",
              description: "50년대 올드 바이닐 재즈 피아노 코드 음을 따뜻하게 따내어 투박하고 고소한 드럼 질감 위에 얹어낸 정통 붐뱁입니다.",
              icon: "Disc"
            },
            {
              title: "스무스 R&B 힙합 & 싱잉 랩",
              description: "감성적인 신디사이저 패드 잔향과 그루비한 리듬감으로 보컬의 감미로운 싱잉 랩 멜로디를 돋보이게 이끄는 비트입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "비트는 단순히 랩 뒤에서 깔리는 반주가 아닌, 곡의 정체성과 심장 박동을 결정하는 뼈대입니다",
        subtitle: "우리는 공장에서 찍어내는 식상한 루프 샘플 대신, 신디사이저 소리를 직접 빚어내어 조제합니다.",
        content_data: {
          description: "반갑습니다. 비트 볼트 스토어의 헤드 프로듀서이자 힙합 아티스트입니다. 유튜브의 수많은 무료 비트를 사용했다가 저작권 경고를 먹고 음원 발매에 실패해 절망하셨나요? 우리는 모든 드럼 노트를 한 땀 한 땀 수작업으로 벨로시티 압력을 조절해 찍어내며, 독점권을 구매하시는 즉시 스템(Stem) 개별 멀티 트랙 파일을 무상 제공하여 완벽한 믹싱 커스텀을 보장합니다.",
          stats: [
            { label: "보유 고음질 힙합 비트 수", value: "350곡" },
            { label: "비트 구매 래퍼 회원 수", value: "1,800명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "비트메이커 작업실 & MPC 기어",
        subtitle: "강렬하고 트렌디한 힙합 음악의 소리 입자가 조제되는 오리지널 스트리트 인프라입니다.",
        content_data: {
          items: [
            { title: "아날로그 MPC 턴테이블 샘플러 존", description: "빈티지 바이닐 판을 올려 바늘의 미세 먼지 잡음을 샘플링 소스로 수집하는 로파이 레코드 믹서", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80" },
            { title: "네온 808 신디사이저 & 미디 키보드", description: "손가락 패드 드럼 타격 세기(Velocity)를 기민하게 인지해 스네어 댐핑감을 살려주는 미디 콘트롤러", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "믹싱용 대형 모니터 & 레퍼런스 스피커", description: "서브 우퍼 베이스 30Hz 저음역대의 미세한 떨림까지 모니터링하여 클럽 스피커 댐핑감을 잡는 음향 룸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "비트 독점 제안 및 맞춤 커스텀 의뢰",
        subtitle: "원하시는 비트 레퍼런스 스타일 링크, 랩 보컬 믹싱 의뢰 여부, 독점권 구매 희망 여부를 기재해 문의하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "비트 구매 및 협업 신청"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 2: Jazz, Vocal Coach, Pop Idol, Guitar Luthier, Sound Therapy
  // ==========================================
  jazz_quartet_velvet: {
    templateId: "jazz_quartet_velvet",
    name: "재즈 콰르텟 & 클럽",
    category: "Music",
    description: "은은하고 고풍스러운 다크 마호가니 에스프레소 브라운과 놋쇠 황동 골드가 만나 깊어가는 재즈 선율과 선셋 낭만을 어필하는 재즈 클럽 전용 테마입니다.",
    image: "/templates/jazz_quartet_velvet.png",
    theme: {
      fontFamily: "Cormorant Garamond, Noto Serif KR, serif",
      colors: {
        primary: "#4a3b32",     // 깊은 위스키 크림 브라운
        secondary: "#e6ccb2",   // 따뜻한 촛불 아이보리
        accent: "#d4af37",      // 클래식 색소폰 브라스 골드
        background: "#120c0a",  // 어두운 위스키 바 블랙 브라운
        surface: "#221815",     // 아늑한 벨벳 소파 다크 초콜릿
        text: "#ede0d4"         // 따뜻한 조명빛 소프트 크림 베이지
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "위스키 향기 가득한 어두운 스포트라이트 아래, 즉흥 재즈 스윙의 낭만",
        subtitle: "정해진 악보를 걷어내고, 연주자들의 눈빛과 호흡만으로 매 순간 신선한 멜로디의 모자이크를 자아내는 4인조 클래식 재즈 콰르텟의 시그니처 앨범 및 라이브 클럽 공연 스케줄을 공유합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
          ctaText: "라이브 클럽 테이블 예약",
          ctaLink: "#contact",
          features: [
            { text: "매주 금요일 밤 펼쳐지는 콘트라베이스, 색소폰, 피아노, 드럼의 정통 스윙 리뉴얼 잼 콘서트" },
            { text: "싱글 몰트 위스키 및 럭셔리 와인과 가장 완벽하게 공명하는 오리지널 재즈 콰르텟 사운드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 재즈 세션",
        subtitle: "깊어가는 재즈의 즉흥 연주법과 몽환적인 화성학적 뼈대를 전하는 리사이틀 코스입니다.",
        content_data: {
          items: [
            {
              title: "콘트라베이스 4비트 워킹 (Walking)",
              description: "심장박동과 정확히 엇갈리는 고소하고 우직한 콘트라베이스 피치카토 튕김이 곡의 든든한 뼈대를 셋업합니다.",
              icon: "Music"
            },
            {
              title: "색소폰 블루노트 즉흥 스윙",
              description: "반음 내린 블루노트 스케일을 사용해 찰나의 슬픔과 퇴폐적인 화려함을 즉흥 멜로디로 토해내는 기법입니다.",
              icon: "Compass"
            },
            {
              title: "재즈 피아노 컴핑 & 텐션 코드",
              description: "일반 메이저 마이너 코드를 넘어 9, 11, 13도 텐션 음을 가볍게 토핑하여 몽환적이고 풍성한 화성을 직조합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "재즈는 적힌 악보를 연주하는 단순 모작이 아닌, 찰나의 침묵 속에서 동료와 나누는 즉흥 대화입니다",
        subtitle: "위스키 잔에 비치는 촛불 조명 아래 흐르는 선율 속에서 진짜 나의 감각이 해방됩니다.",
        content_data: {
          description: "안녕하십니까. 벨벳 재즈 클럽의 리더이자 색소포니스트입니다. 우리는 기계음 가득한 클럽 소음을 걷어내고, 손가락 지문으로 직접 튕겨내는 아날로그 현의 마찰음, 색소폰 리드의 젖은 떨림, 드럼 솔로의 스윙 비트만을 추구합니다. 매주 오직 한정된 관객만을 모셔, 타임머신을 타고 1950년대 뉴욕 재즈 바로 돌아간 듯한 기품 있는 휴식을 대접해 드리겠습니다.",
          stats: [
            { label: "누적 즉시 잼 라이브 콘서트", value: "480회 연속" },
            { label: "소장 스윙 스페셜 와인 품종", value: "35가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "벨벳 재즈 라운지 & 라이브 무대",
        subtitle: "아늑한 콘서트 촛불 빛과 악기가 자연스럽게 공명하도록 목조 마감된 내부 전경입니다.",
        content_data: {
          items: [
            { title: "아날로그 스윙 그랜드 피아노 무대", description: "콘트라베이스와 드럼 세트가 조화롭게 배치되어 즉흥 잼 퍼포먼스를 선보이는 원내 메인 라이브 스퀘어", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80" },
            { title: "앤티크 위스키 바 & 소파 라운지", description: "싱글 몰트 위스키 잔을 흔들며 재즈 색소폰의 중저음 배음을 코앞에서 감상하는 럭셔리 소파 테이블", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "빈티지 셀머 색소폰과 악보 패키지", description: "수십 년간의 세월을 거쳐 손 때가 묻은 브라스 황동의 우아한 깊이를 보여주는 리드의 아티팩트 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "재즈 클럽 테이블 예약 및 섭외 의뢰",
        subtitle: "방문 희망 일시, 동반 인원 수, 와인/위스키 패키지 사전 주문 여부, 프라이빗 이벤트 대관 문의를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "재즈 테이블 예약하기"
        }
      }
    ]
  },

  vocal_coach_harmony: {
    templateId: "vocal_coach_harmony",
    name: "하모니 보컬 트레이닝 랩",
    category: "Music",
    description: "신뢰감을 주는 이지적인 로열 네이비 블루와 맑은 파스텔 피치 핑크 조화로 올바른 발성과 1:1 노래 교정의 완성도를 높인 보컬 아카데미 테마입니다.",
    image: "/templates/vocal_coach_harmony.png",
    theme: {
      fontFamily: "Inter, Noto Sans KR, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 지적인 신뢰도 로열 네이비
        secondary: "#ffedd5",   // 순하고 아늑한 살구 오프화이트
        accent: "#f43f5e",      // 심장 박동 로즈 핑크
        background: "#fafcfd",  // 맑고 깨끗한 아쿠아 오프화이트
        surface: "#ffffff",     // 맑고 정갈한 위생 마이크 테이블
        text: "#1e293b"         // 가독성 극대화 슬레이트 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "목을 조르는 소리 대신, 복부의 압력으로 내뿜는 깊고 풍성한 발성 과학",
        subtitle: "성대 접촉률 AI 정밀 분석기와 이비인후과적 호흡 통제 메커니즘을 바탕으로, 노래 부를 때 쉰 소리가 나거나 고음에서 목이 좁아지던 고질적 나쁜 습관을 1:1로 밀착 치료하는 전문 보컬 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 성대 진동 검사 신청",
          ctaLink: "#contact",
          features: [
            { text: "명문 음대 성악과 및 버클리 실용음악과 시니어 보컬 코치진 분과 교정 시스템" },
            { text: "실시간 나의 목구멍 후두 하강 및 연구개 거상 각도를 확인하는 캠 모니터실 완비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "보컬 교정 솔루션",
        subtitle: "목소리의 정체성을 과학적으로 교정하고 타고난 음색의 매력을 극대화하는 치료입니다.",
        content_data: {
          items: [
            {
              title: "1:1 정교한 발성 치료",
              description: "횡격막을 내리는 올바른 복식 호흡 압력 훈련과 성대 앞쪽 접촉면을 강화해 쉰 소리를 원천 치료합니다.",
              icon: "Activity"
            },
            {
              title: "실용음악 입시 & 오디션반",
              description: "대형 기획사 비공개 오디션의 첫 3초 눈빛 장악법, 고음 고사장에서 감점 없는 고음 발성을 연마합니다.",
              icon: "Award"
            },
            {
              title: "스마트 믹스보이스 & 고음 돌파",
              description: "가성과 진성이 부드럽게 융합되어 성대 무리 없이 두성 고음역대를 시원하게 뿜어내게 돕는 믹스보이스 훈련입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "목소리는 타고나는 운명이 아닌, 성대 근육의 미세한 정렬과 호흡 조절이 만드는 악기입니다",
        subtitle: "모든 발성 치료는 강제로 고음을 유도하지 않고, 저음의 성대 균형 정렬부터 시작합니다.",
        content_data: {
          description: "안녕하십니까. 하모니 보컬 트레이닝 랩 대표 코치입니다. 노래방만 가면 목이 쉬고 고음이 막혀 속상하셨나요? 노래는 목을 짜내어 부르는 고행이 아니라, 몸 안의 뼈와 강각 기관을 조화롭게 공명시켜 가장 편안한 본연의 진동을 퍼뜨리는 즐거운 신체 운동입니다. 우리는 100% 해부학적 횡격막 유동 데이터를 기반으로 당신의 소리를 가장 우아하게 복원해 드립니다.",
          stats: [
            { label: "1:1 피드백 교정 횟수", value: "8,500회" },
            { label: "소속 전임 보컬 석사", value: "8명 상주" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "정밀 보컬 녹음실 & 훈련실 전경",
        subtitle: "어린이부터 성인까지 편안한 분위기 속에서 노래에 몰입하도록 안전 차음 설계된 공간 시설입니다.",
        content_data: {
          items: [
            { title: "성대 파형 3D 스캔 진단실", description: "마이크에 소리를 낼 때 성대 접촉 면적과 쉰 소리 노이즈 수치를 실시간 차트로 짚어내는 그래픽 모니터", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=600&q=80" },
            { title: "프라이빗 1인 단독 보컬 레슨룸", description: "외부 차음 방음 패널과 야마하 건반, 그리고 대형 거울이 부착되어 후두 위치를 관찰하는 레슨 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수강생 시그니처 음원 수록 스튜디오", description: "수업을 마친 후 완성된 나의 곡을 콘덴서 마이크와 프리미엄 진공관 콘솔로 녹음해 주는 스페셜 믹싱 룸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 성대 진동 정밀 분석 예약",
        subtitle: "현재 목 상태 고민(성대결절 이력, 음치, 고음불가 등), 희망 수강 트랙(취미/입시/오디션)을 적어 예약을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "성대 정밀 진단 신청"
        }
      }
    ]
  },

  pop_idol_fandom: {
    templateId: "pop_idol_fandom",
    name: "팝 아티스트 & 글로벌 팬덤",
    category: "Music",
    description: "트렌디한 버블검 마젠타 핑크와 은은한 라일락 보라, 루미너스 화이트 배합이 글로벌 케이팝 아이돌 솔로 아티스트의 아우라와 팬덤 응원 열기를 가득 전하는 테마입니다.",
    image: "/templates/pop_idol_fandom.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#ec4899",     // 화사한 버블검 핫핑크
        secondary: "#c084fc",   // 몽환적인 라일락 바이올렛
        accent: "#ffffff",      // 눈부신 은빛 스포트라이트 화이트
        background: "#090514",  // 몽환적인 미드나잇 퍼플 블랙
        surface: "#1a122c",     // 세련된 아키텍처 다크 퍼플
        text: "#fdf8ff"         // 시인성 높은 네온 퍼플 오프화이트
      },
      borderRadius: "rounded-full",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "글로벌 빌보드 차트를 수놓는 눈부신 팝 아티스트의 공식 글로벌 홈",
        subtitle: "전 세계 팬들이 하나가 되어 함성을 지르고 소통하는 단독 공식 웹사이트입니다. 신규 싱글 앨범 타이틀곡 뮤직비디오 비하인드 독점 스틸 컷부터, 올가을 월드 투어 콘서트 정규 티켓 선예매 코드 혜택까지 완벽 제공합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
          ctaText: "한정판 피지컬 앨범 예약",
          ctaLink: "#contact",
          features: [
            { text: "아티스트가 직접 음성 메시지로 팬들에게 보내는 매주 비밀 보이스 다이어리 독점 업로드" },
            { text: "전 세계 48개 도시 월드 투어 리사이틀 무대 비하인드 메이킹 다큐멘터리 영상 선공개" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아티스트 시그니처 릴리즈",
        subtitle: "글로벌 리스너들의 귓가를 매료시킨 화제의 앨범과 시각 퍼포먼스 리뷰입니다.",
        content_data: {
          items: [
            {
              title: "신작 싱글: 크리스탈 네온의 궤적",
              description: "신디사이저 리듬 루프와 청량한 보이스 음색이 조화를 이루어 청량감을 안겨주는 댄스 팝 앙상블 타이틀곡입니다.",
              icon: "Zap"
            },
            {
              title: "월드 투어 공식 스페셜 굿즈",
              description: "아티스트가 직접 크리에이티브 디자인에 참여한 응원봉, 유기농 린넨 후드티, 에코 백 머천다이즈 패키지입니다.",
              icon: "Award"
            },
            {
              title: "독점 1:1 온라인 글로벌 팬미팅",
              description: "아티스트와 1인 단독 영상 통화로 영어, 일본어, 중국어 번역 자막과 함께 2분간 프라이빗하게 대화합니다.",
              icon: "Users"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "팬들과 함께 빚어내는 한 걸음 한 걸음이 모여, 내일의 가장 큰 영광의 찬사를 완성합니다",
        subtitle: "지구 반대편에서 들려오는 당신의 따뜻한 함성은 내가 춤추고 노래하는 유일한 생명력입니다.",
        content_data: {
          description: "반갑습니다. 팝 아티스트입니다. 언제나 삭막하고 지친 무대 뒤의 고독 속에서 나를 다시 일으켜 세우는 것은 오직 전 세계 팬 여러분들의 편지와 따뜻한 응원 글귀뿐입니다. 우리는 언어와 국경 장벽을 넘어, 오직 음악이라는 기적 같은 매개체를 통해 서로의 마음 주파수를 맞추고 위로를 나눕니다. 이 아늑한 공간에서 나와 함께 매일의 꿈을 공유해 주세요.",
          stats: [
            { label: "글로벌 팬클럽 회원 수", value: "35만명 돌파" },
            { label: "뮤직비디오 누적 뷰", value: "1억 2천만회" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "월드 투어 무대 & 비하인드 화보",
        subtitle: "화려한 춤과 오케스트라 앙상블 속에서 아티스트가 빛나는 영광의 찰나들입니다.",
        content_data: {
          items: [
            { title: "도쿄돔 5만명 응원 은하수 스냅", description: "수만 명의 팬들이 손에 쥔 핑크 응원봉 빛이 은하수 무리를 형성해 돔 구장을 가득 채운 기적의 풍경", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" },
            { title: "기내 월드 투어 전용 비행기 비하인드", description: "월드 투어 다음 도시로 이동하는 중 스태프들과 함께 모여 장난치고 장비 스케줄을 점검하는 아티스트 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "뮤직비디오 촬영장 네온 사이버 세트", description: "화려한 시안 블루와 마젠타 네온 레이저 아래서 파워풀한 시그니처 크루 안무를 조율하고 모니터링하는 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "글로벌 공식 팬클럽 가입 및 응원 메세지",
        subtitle: "정식 멤버십 카드 수령 주소지, 팬레터 기고, 아티스트에게 보내는 따뜻한 응원의 편지는 아래에 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "팬레터 및 멤버십 신청"
        }
      }
    ]
  },

  guitar_craft_luthier: {
    templateId: "guitar_craft_luthier",
    name: "아티잔 수제 통기타 & 이펙터 공방",
    category: "Music",
    description: "갓 자른 단단한 스프루스 원목 베이지와 고풍스러운 다크 마호가니 브라운 결이 만나 현악기 수제 제작의 숭고한 크래프트맨십을 전하는 루시어 공방 테마입니다.",
    image: "/templates/guitar_craft_luthier.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#5c3d2e",     // 클래식 마호가니 원목 브라운
        secondary: "#ede0d4",   // 맑고 깨끗한 스프루스 메이플 베이지
        accent: "#8b5a2b",      // 로스팅 로즈우드 앰버
        background: "#faf6f0",  // 톱가루 가득한 웜 크림 베이지
        surface: "#ffffff",     // 정갈한 위생 도면 대리석
        text: "#3e2723"         // 에스프레소 초콜릿 다크 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "나무의 나이테가 간직한 100년의 세월을, 맑고 투명한 현의 선율로 깨우다",
        subtitle: "북미산 시트카 스프루스, 인디언 로즈우드 원목을 5년간 자가 자연 건조하고, 0.1mm 오차도 없이 울림판 브레이싱(Bracing)을 수작업으로 깎아내어 평생 대를 물려 사용할 명품 커스텀 수제 통기타를 제작하는 루시어(Luthier) 아뜰리에입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "커스텀 오더 및 목재 투어",
          ctaLink: "#contact",
          features: [
            { text: "기타 넥 뒤쪽 그립 두께와 지판 곡률 반경을 연주자 손 크기에 맞춰 100% 비공개 제작" },
            { text: "아날로그 다이렉트 이펙터 회로 납땜 및 빈티지 픽업 성향 매칭 가이드 특강" }
          ]
        }
      },
      {
        section_type: "services",
        title: "루시어 크래프트 매뉴얼",
        subtitle: "목재의 고유한 물성을 극대화하여 평생의 음악적 동반자를 만드는 단계별 제작 영역입니다.",
        content_data: {
          items: [
            {
              title: "1:1 명품 커스텀 기타 빌드",
              description: "목재 선별(스프루스, 월넛, 메이플)부터 상판 깎기, 울림구 자개 인레이 장식을 장인이 홀로 책임 조각합니다.",
              icon: "PenTool"
            },
            {
              title: "정밀 리페어 & 셋업 서비스",
              description: "부러진 넥 부위 수지 접합 치료, 굽어버린 지판 트러스트로드 교정, 프렛 광택 드레싱으로 오리지널 음색을 부활시킵니다.",
              icon: "Compass"
            },
            {
              title: "수제 이펙터 납땜 & 회로 튜닝",
              description: "독일제 빈티지 캐패시터와 구리 배선을 사용해 잡음이 전혀 없고 고소한 드라이브 톤을 자아내는 페달을 제작합니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "수제 기타는 단순히 조립된 나무상자가 아닌, 셰프가 맛을 조율하듯 주파수를 가두는 숭고한 울림통입니다",
        subtitle: "상판의 두께가 0.1mm 얇아질 때마다, 소리는 화사해지지만 나무의 버팀 내구성은 무너집니다.",
        content_data: {
          description: "안녕하십니까. 크래프트 기타 공방의 마스터 루시어입니다. 우리는 공장에서 기계 프레스로 찍어내어 겉만 번지르르한 저품질 합판 기타를 지양합니다. 나무는 살아있는 유기체이기에 산지의 기온과 수분율에 따라 수축과 팽창을 반복합니다. 우리는 5년간 벼려낸 끌과 톱날 끝으로 나무 상판 노크 소리의 주파수를 귀로 감별하며, 연주자가 첫 스트로크를 치는 순간 눈물을 흘릴 만큼의 맑은 배음을 빚어냅니다.",
          stats: [
            { label: "출고 완료 명품 수제 기타", value: "320대" },
            { label: "원목 건조 보존 기간", value: "평균 5년 이상" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수제 공방 & 명품 목재 창고",
        subtitle: "나무 냄새 가득하고 은은한 햇볕이 드는 기품 있는 장인의 작업 공간 전경입니다.",
        content_data: {
          items: [
            { title: "상판 울림판 자작나무 깎기 작업대", description: "대패와 끌을 잡고 상판 뒷면에 X-브레이싱 나무 뼈대를 정교하게 다듬어 음역 밸런스를 조율하는 손길", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80" },
            { title: "5년 건조 스프루스 원목 보관실", description: "갈라짐 방지를 위해 온도 22도, 습도 45%로 365일 정밀 통제되는 글로벌 희귀 명품 목재 건조고", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "전통 방식 수제 셀락 도장 도색실", description: "기타 표면에 얇고 투명한 천연 셀락 도막을 100회 이상 붓으로 칠하여 나무 숨구멍을 살려주는 도색 룸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "커스텀 오더 메이드 & 리페어 접수",
        subtitle: "제작 희망 장르(클래식기타/어쿠스틱), 선호하는 원목 큐레이션, 리페어 부위를 적어 방문 일정을 조율해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "커스텀 기타 상담 신청"
        }
      }
    ]
  },

  music_therapy_soothe: {
    templateId: "music_therapy_soothe",
    name: "마인드 사운드 이완 & 소리치유 센터",
    category: "Music",
    description: "맑고 깨끗한 아쿠아 민트 블루와 부드러운 오트밀 아이보리 배합으로 지친 자율신경계를 순하게 가라앉히는 소리 치유 & 음악 치료 테마입니다.",
    image: "/templates/music_therapy_soothe.png",
    theme: {
      fontFamily: "Noto Serif KR, Lora, serif",
      colors: {
        primary: "#0f766e",     // 차분하고 평온한 딥 에메랄드 틸
        secondary: "#ccfbf1",   // 맑고 시원한 민트 라이트
        accent: "#8338ec",      // 내면 자아를 각성시키는 릴렉싱 라벤더
        background: "#fafcfb",  // 위생 무자극 오프화이트
        surface: "#ffffff",     // 패브릭 안심 매트 화이트
        text: "#115e59"         // 시각적 피로를 제어하는 다크 틸 차콜
      },
      borderRadius: "rounded-full",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "두뇌의 과긴장 소음을 끄고, 천연 싱잉볼 소리 진동으로 자아를 정화하다",
        subtitle: "바쁜 현대인들의 극심한 스트레스, 불면증, 공황장애 예방을 위해, 특정 힐링 뇌파(델타파, 세타파)와 동일한 주파수의 소리 진동 테라피를 처방하여 지친 자율신경계 균형을 안전하게 조율하는 사운드 웰니스 센터입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "시그니처 사운드 테라피 예약",
          ctaLink: "#contact",
          features: [
            { text: "국제 공인 사운드 힐러 및 음악치료사 자격을 보유한 연구진의 1:1 맞춤 주파수 처방" },
            { text: "7가지 차크라 천연 크리스탈 싱잉볼 및 고대 티베트 림스 벨 특수 청음 치유실 완비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "사운드 릴랙스 프로그램",
        subtitle: "지친 뇌와 관절의 기혈을 소리 진동의 동조 현상으로 정화하는 안전 코스입니다.",
        content_data: {
          items: [
            {
              title: "7 차크라 크리스탈 싱잉볼 힐링",
              description: "고순도 석영 크리스탈 싱잉볼을 연주해 방출되는 고유 진동을 몸속 수분 세포와 공명시켜 독소를 배출합니다.",
              icon: "Compass"
            },
            {
              title: "뇌파 동기화 핑크 노이즈 명상",
              description: "안락한 자연 백색 소음과 마이크로 바이노럴 비트 이펙트를 헤드폰으로 공급해 10분 이내 깊은 수면을 돕습니다.",
              icon: "Music"
            },
            {
              title: "만성 질환 예방 음악 치료 음악치료",
              description: "불안감을 극복하고 심박수를 차분히 내리기 위해 하프 선율과 천연 숲소리 음향을 결합해 정서적 안전핀을 제공합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "소리는 귀로만 듣는 아리아가 아닌, 온몸의 수분 세포를 미세하게 흔드는 물리적 터치입니다",
        subtitle: "뇌파가 안정되면 심장 박동 변이도(HRV)가 정상화되어 만성 두통이 사라집니다.",
        content_data: {
          description: "안녕하십니까. 소리치유 센터의 대표 원장입니다. 현대인들은 매일 스마트폰과 지하철의 시끄러운 시각적, 청각적 자극에 시달리며 자율신경계 과긴장 상태로 살아갑니다. 이것이 오래되면 소화불량, 불면, 이유 모를 만성 불안이 유발됩니다. 우리는 삭막한 주사 주입 대신, 천연 청동 싱잉볼의 맑고 긴 공명 주파수를 몸 위에 직접 얹어 전신의 림프와 근막을 순하게 이완하는 진정한 안식을 선사합니다.",
          stats: [
            { label: "사운드 치유 성공 임상 수", value: "3,500케이스+" },
            { label: "원내 보유 명품 싱잉볼 수", value: "28종 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "안도감 넘치는 사운드 바스 룸 시설",
        subtitle: "조도의 미세 세팅과 편안한 오가닉 매트를 매립하여 정서적 평온함을 극대화한 치료실입니다.",
        content_data: {
          items: [
            { title: "프라이빗 1인 크리스탈 싱잉볼룸", description: "외부 차음 방음 도어가 세팅되고 몸 주변에 크리스탈 보틀을 원형 배치해 치유하는 단독 힐링 룸", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" },
            { title: "단체 사운드 바스 누워서 쉬는 홀", description: "대형 숲속 앰비언트 영상과 싱잉볼 합주가 흘러나오는 가운데 눈을 지그시 감고 전신 이완을 누리는 매트 홀", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" },
            { title: "허브 테라피 & 리프레쉬 티 라운지", description: "치유 세션 시작 전 감정 상태 자가 진단표를 적고 완료 후 오가닉 쑥차를 대접받는 정숙 휴식 쉼터", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "자율신경계 1:1 진단 & 사운드 바스 예약",
        subtitle: "평소 겪고 계신 불편함(불면, 편두통, 공황장애 예방 등), 희망 일정을 기재하여 제출하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "소리 치유 예약하기"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 3: Metal, Symphony, Lo-Fi, Musical, Traditional
  // ==========================================
  metal_hardcore_chaos: {
    templateId: "metal_hardcore_chaos",
    name: "카오스 메탈 & 하드코어 록 크루",
    category: "Music",
    description: "압도적인 하드코어 에너지를 어필하는 매트 블랙과 블러드 크림슨 레드, 하이퍼 네온 라임 액센트 배합의 중금속 메탈 밴드 공식 테마입니다.",
    image: "/templates/metal_hardcore_chaos.png",
    theme: {
      fontFamily: "Impact, Archivo Black, sans-serif",
      colors: {
        primary: "#dc2626",     // 피 끓는 크림슨 블러드 레드
        secondary: "#27272a",   // 거친 인더스트리얼 차콜 스틸
        accent: "#84cc16",      // 케이오틱 네온 라임
        background: "#09090b",  // 암흑 매트 블랙
        surface: "#18181b",     // 디스토션 스피커 캐비닛
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "심장을 박살 내는 트윈 페달의 고속 난사와 분노의 메탈 기타 디스토션",
        subtitle: "이 땅의 위선적인 팝 음악 소음을 박살 내고, 시속 200BPM으로 휘몰아치는 메탈 기타 솔로 속도와 지옥 끝에서 뿜어 나오는 그로울링 보컬의 압도적인 아우라로 메탈 마니아들의 분노를 해방하는 헤비메탈 크루입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
          ctaText: "신규 메탈 앨범 릴리즈",
          ctaLink: "#contact",
          features: [
            { text: "7현 드롭 튜닝 기타 기법과 고속 드러밍 트윈 데스 킥 자세 테크니컬 아카이브 공개" },
            { text: "다가오는 하드코어 메탈 페스티벌 메인 라이브 콘서트 현장 조기 예매 티켓 코드 오픈" }
          ]
        }
      },
      {
        section_type: "services",
        title: "카오스 스펙트럼",
        subtitle: "인간의 한계 혈압을 폭발시키는 헤비메탈 핵심 장르 라인업입니다.",
        content_data: {
          items: [
            {
              title: "고속 스피드 데스 메탈",
              description: "트윈 베이스 드럼 페달의 기관총 난사 리듬과 분노의 헤비메탈 기타 속주 리프의 정점을 선사합니다.",
              icon: "Zap"
            },
            {
              title: "묵직한 인더스트리얼 슬러지",
              description: "철판을 때리는 듯한 헤비한 기계 기계 잡음과 극단적 드롭 튜닝으로 무장한 묵직한 카타르시스입니다.",
              icon: "Cpu"
            },
            {
              title: "하드코어 슬램 & 모싱 잼",
              description: "관객이 무대 아래서 서클핏을 그리며 다치지 않고 안전하고 신나게 슬램 모싱을 즐기는 규칙을 전수합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "헤비메탈은 시끄러운 소음이 아닌, 사회적 가면을 쓴 나 자신의 억눌린 본능을 해방하는 가장 정직한 함성입니다",
        subtitle: "무대 위에서 기타를 때려 부수는 찰나는 세상에 대한 아름다운 파괴 예술적 선언입니다.",
        content_data: {
          description: "안녕하십니까. 카오스 메탈 밴드의 리더 겸 수석 기타리스트입니다. 가식적인 위로의 말로 범벅된 미지근한 음악에 지치셨나요? 우리 박스에서는 찢어지는 마샬 진공관 앰프의 크런치 이펙터 왜곡 소리 속에서 뼈마디가 흔들리는 쾌감을 맛봅니다. 두려워 마십시오. 우리의 사운드는 고막을 터뜨리기 위함이 아닌, 가슴 속 응어리를 음악적으로 폭발시키기 위해 정밀 튜닝되어 있습니다.",
          stats: [
            { label: "누적 단독 메탈 공연", value: "240회" },
            { label: "등록 정회원 메탈 헤드", value: "3,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "하드코어 라이브 & 앰프 캐비닛",
        subtitle: "뜨거운 땀방울과 거친 금속의 비명 소리가 조화를 이룬 오리지널 콘서트 스냅입니다.",
        content_data: {
          items: [
            { title: "헤비메탈 서클핏 모싱 현장", description: "강렬한 드럼 비트에 맞춰 수천 명의 관객이 소용돌이치며 슬램을 치고 포효하는 라이브 찰나", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" },
            { title: "7현 커스텀 기타 & 마샬 진공관 헤드", description: "저음역을 지옥 끝까지 내리기 위해 메탈 전용 특수 디스토션 페달을 탑재한 강인한 악기 스택", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "지하 라이브 펍 연기 가득한 무대 전경", description: "드라이아이스 안개 사이로 보컬이 해골 모양 마이크를 잡고 그로울링 스피릿을 뿜어내는 모습", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "메탈 크루 섭외 및 공연 예매",
        subtitle: "해외 페스티벌 섭외, 인디 밴드 조인 신청, 메탈 라이브 공연 티켓 예매 문의는 아래로 연락주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "공연 및 섭외 신청"
        }
      }
    ]
  },

  choir_orchestra_grand: {
    templateId: "choir_orchestra_grand",
    name: "그랜드 필하모닉 오케스트라 & 합창단",
    category: "Music",
    description: "웅장한 대성당의 석조 벽면을 연상시키는 딥 프러시안 네이비와 고풍스러운 대리석 오프화이트, 황동 골드 배합으로 심포니 오케스트라의 웅장한 감동을 전달하는 템플릿입니다.",
    image: "/templates/choir_orchestra_grand.png",
    theme: {
      fontFamily: "Cormorant Garamond, Noto Serif KR, serif",
      colors: {
        primary: "#172554",     // 장엄한 대성당 프러시안 네이비
        secondary: "#f1f5f9",   // 청결한 대리석 화이트
        accent: "#d4af37",      // 영광스러운 지휘봉 황동 골드
        background: "#fafaf6",  // 고풍스러운 클래식 대도서관 베이지
        surface: "#ffffff",     // 맑고 깨끗한 아날로그 악보 화이트
        text: "#1e293b"         // 가독성 높은 네이비 슬레이트 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "80인조 풀 편성 오케스트라와 100인조 대합창단이 빚어내는 천상의 앙상블",
        subtitle: "모든 인위적인 전자 확성 확성 마이크를 배제하고, 콘서트홀 고유의 공명 설계와 어쿠스틱 반사각만으로 대성당의 웅장함과 영혼의 전율을 선사하는 정통 클래식 심포니의 공식 허브입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
          ctaText: "정기 연주회 티켓 예매",
          ctaLink: "#contact",
          features: [
            { text: "세계적인 마에스트로 초청 협연 및 베토벤 9번 교향곡 '합창' 정기 연주회 예매 오픈" },
            { text: "원내 단원들의 목조 현악기(과르네리, 스트라디바리 명작 등)의 역사적 해설 리포트 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오케스트라 예술 라인업",
        subtitle: "지휘자의 날카로운 손끝 터치 아래 모든 소리의 주파수가 완벽히 정렬되는 예술 영역입니다.",
        content_data: {
          items: [
            {
              title: "정기 심포니 콘서트",
              description: "브람스, 말러의 웅장한 대작 교향곡들을 80인조 풀 오케스트라 사운드로 해부학적 감동을 선사합니다.",
              icon: "Compass"
            },
            {
              title: "대성당 천사 대합창 세션",
              description: "소프라노, 알토, 테너, 베이스 4부 합창의 완벽한 화성 배음을 대성당의 깊은 잔향 속에 수록합니다.",
              icon: "Heart"
            },
            {
              title: "청소년 클래식 유망주 아카데미",
              description: "음대 진학을 앞둔 바이올린, 첼로, 플루트 영재들을 위해 오케스트라 합주 실무와 오디션 대비를 코칭합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "오케스트라는 단순히 여러 악기가 모여 소리를 내는 것이 아닌, 100명의 연주자가 지휘자의 눈빛 아래 하나의 영혼으로 숨 쉬는 기적입니다",
        subtitle: "어쿠스틱 전용 홀 고유의 잔향 2.1초 설계 속에 최고의 배음 조화가 깃들어 있습니다.",
        content_data: {
          description: "안녕하십니까. 그랜드 필하모닉 오케스트라의 상임 지휘자입니다. 우리는 관람객의 귀를 즐겁게 하기 위한 대중적 팝 콜라보를 일관되게 배제하고, 작곡가의 원천 악보(Urtext)를 집요하게 역사적으로 역추적하여 오리지널 고유의 하모니를 복원하는 데 온 삶을 바칩니다. 콘서트홀의 묵직한 마루 울림을 통해 당신의 영혼을 정화해 보십시오.",
          stats: [
            { label: "정식 등록 소속 단원 수", value: "120명" },
            { label: "연간 정기 공연 횟수", value: "35회" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "장엄한 리허설 홀 & 명품 악기실",
        subtitle: "단원들이 완벽한 하모니를 튜닝하기 위해 훈련하는 품격 높은 예술 인프라 전경입니다.",
        content_data: {
          items: [
            { title: "오케스트라 메인 리허설 대공연장", description: "부채꼴 모양의 천장 목조 반사판이 설치되어 마이크 없이도 소리가 고루 퍼지는 웅장한 콘서트 홀", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80" },
            { title: "명품 현악기 보관 및 조율실", description: "목재의 변형 방지를 위해 365일 실시간 온도와 습도가 칼같이 통제되는 악기 보존실 전경 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "대합창단 4부 파트별 발성 연습실", description: "더블 차음 방음벽과 그랜드 피아노가 배치되어 파트별 화성을 다듬는 단독 아늑한 보컬 룸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공연 티켓 예매 및 단원 지원 신청",
        subtitle: "원하시는 공연 회차, 좌석 등급(VIP/R/S석 등), 오케스트라 입단 지원 파트(악기명)를 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "티켓 예매 및 지원 신청"
        }
      }
    ]
  },

  lofi_chill_beats: {
    templateId: "lofi_chill_beats",
    name: "로파이 칠홉 비트 & 사운드스케이프",
    category: "Music",
    description: "은은하고 몽환적인 밤하늘 라벤더 퍼플과 앰버 골드, 다크 네이비 조화가 자장가 같은 안락함과 집중력을 선사하는 로파이 사운드 채널 테마입니다.",
    image: "/templates/lofi_chill_beats.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#818cf8",     // 몽환적인 힐링 라벤더
        secondary: "#fed7aa",   // 아늑한 촛불 앰버 골드
        accent: "#f43f5e",      // 따뜻한 라즈베리 핑크
        background: "#0b0f19",  // 밤하늘의 고요한 네이비 블랙
        surface: "#1e293b",     // 아늑한 방구석 차콜 슬레이트
        text: "#e2e8f0"         // 눈 피로 없는 실버 오프화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "새벽 2시, 빗방울 소리와 낡은 바이닐 LP의 모닥불 소리 타닥타닥",
        subtitle: "공부할 때, 코딩할 때, 혹은 잠 못 이루는 밤 뒤척일 때 자극 없는 편안함을 안겨주기 위해 카세트테이프 특유의 따뜻한 아날로그 화이트 노이즈와 스무스한 재즈 피아노 코드 음을 믹싱하여 전달하는 24시간 칠홉 사운드스케이프 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=1200&q=80",
          ctaText: "24시간 라이브 스트림 듣기",
          ctaLink: "#contact",
          features: [
            { text: "아날로그 카세트 플레이어의 미세한 워블(Wobble) 테이프 피치 불균형 이완 음향 기술 적용" },
            { text: "집중력을 2배로 올리는 가사 없는 로파이 재즈 피아노 & 빗소리 믹스 음원 패키지 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "칠홉 비트 카테고리",
        subtitle: "뇌의 자율신경계 긴장을 풀어주고 일상의 고독을 달래주는 백그라운드 사운드입니다.",
        content_data: {
          items: [
            {
              title: "새벽 두 시의 커피숍 라떼",
              description: "카페의 은은한 웅성거림 소리와 따뜻한 찻잔 부딪히는 소리를 입체적으로 수집하여 믹싱한 로파이 비트입니다.",
              icon: "Smile"
            },
            {
              title: "창밖의 봄비와 재즈 피아노",
              description: "실제 처마 밑에 떨어지는 봄비 소리를 녹음하여 은은한 재즈 피아노 포르테 선율 위에 얹어내 마음을 안심시킵니다.",
              icon: "Droplet"
            },
            {
              title: "카세트테이프 리와인드 칠",
              description: "낡은 자석 테이프가 돌아가며 내는 지직거리는 테이프 히스(Hiss) 노이즈를 살려 정겨운 복고풍 향수를 자극합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "배경음악은 나를 주도하지 않고, 내 일상 뒤에 잔잔히 흐르며 나의 사색을 돋보이게 이끄는 그림자 친구입니다",
        subtitle: "모든 음악 소리는 고음의 자극을 걷어내어 귀의 피로도가 0%에 가깝도록 로파이 로우패스 필터링됩니다.",
        content_data: {
          description: "안녕하십니까. 로파이 칠홉 사운드스케이프의 크리에이티브 디렉터입니다. 우리는 자극적이고 시끄러운 멜로디의 침범을 단호히 거부합니다. 마치 모닥불이 타닥타닥 탈 때의 편안함처럼, 내 방 안의 공기 온도를 은은하게 이완시키는 정직하고 친절한 소리 벽지를 조제해 냅니다. 오늘 밤 당신의 책상 한구석에 칠홉의 따스한 주황색 촛불을 켜두십시오.",
          stats: [
            { label: "24시간 스트리밍 접속 수", value: "14,000회" },
            { label: "보유 수제 앰비언트 음원", value: "350곡" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아늑한 방구석 칠 스튜디오 & LP 기어",
        subtitle: "보기만 해도 마음이 포근해지는 수증기 가득한 아날로그 쉼터의 전경 포토 리포트입니다.",
        content_data: {
          items: [
            { title: "헤드폰과 따스한 귤색 전등 스페이스", description: "밤하늘 은하수가 비치는 창문 옆에 아늑한 턴테이블이 돌아가며 LP 판의 먼지 노이즈를 내는 순간", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=600&q=80" },
            { title: "빈티지 마란츠 카세트 덱 플레이어", description: "자석 테이프가 스무스하게 회전하며 고소한 테이프 히스(Hiss) 노이즈를 방출하는 아날로그 기어", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "비 내리는 창가 초록 화분 플레이트", description: "유리창에 흐르는 빗방울 뒤로 실내 초록 잎사귀가 가득 차 있어 시각적 안락함을 주는 창틀 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "정기 음원 구독 및 독립 작곡가 기고",
        subtitle: "매거진 칠홉 굿즈 패키지 신청, 자작 로파이 믹스 음원 기고(음원 링크 포함), 광고 문의를 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "음원 구독 및 기고하기"
        }
      }
    ]
  },

  musical_theater_stage: {
    templateId: "musical_theater_stage",
    name: "스포트라이트 오리지널 뮤지컬 극단",
    category: "Music",
    description: "공연막의 기품을 대변하는 중후한 벨벳 버건디와 시선을 포착하는 스포트라이트 골드 포인트 배합이 가창력과 예술 무대를 정교하게 보여주는 뮤지컬 극단 전용 테마입니다.",
    image: "/templates/musical_theater_stage.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#500724",     // 무대 암막 벨벳 버건디
        secondary: "#fdf8f5",   // 대리석 티켓 오프화이트
        accent: "#d4af37",      // 스포트라이트 황동 골드
        background: "#0f050d",  // 묵직한 극장 다크 플럼 블랙
        surface: "#1e1122",     // 무대 대기실 러프 우드 스퀘어
        text: "#f5e6eb"         // 대사 대본 시인성 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오케스트라의 웅장한 선율과, 무대 위 배우들의 파워풀한 보컬 카타르시스",
        subtitle: "전통적인 판타지 신작 뮤지컬부터 역사적 사실을 고해상도로 재건하는 대작 가창극까지, 무대 위 배우들의 목소리와 30인조 라이브 오케스트라 앙상블의 압도적인 아우라로 관객의 심장을 폭발시키는 전문 극단의 공식 포털입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
          ctaText: "상영작 티켓 실시간 예매",
          ctaLink: "#contact",
          features: [
            { text: "올여름 세종문화회관 대극장 론칭 오리지널 뮤지컬 '스포트라이트' 조기 예매 할인 30% 적용" },
            { text: "주연 배우들의 스페셜 백스테이지 보컬 리허설 라이브 영상 독점 선공개" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이달의 뮤지컬 라인업",
        subtitle: "웅장한 스토리와 가슴을 뭉클하게 울리는 넘버들이 조화된 연출작 리스트입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 넘버: 사색의 새벽",
              description: "고독한 주인공이 홀로 스포트라이트를 받으며 미래를 향해 절규하는 파워풀한 고음 발성 앙상블 넘버입니다.",
              icon: "Mic"
            },
            {
              title: "30인조 라이브 콰이어 협연",
              description: "풍부한 스트링 섹션과 웅장한 관악기 사운드가 극장에 입체적으로 공명하여 감동을 극대화합니다.",
              icon: "Compass"
            },
            {
              title: "신진 배우 보컬 오디션반",
              description: "무대 위에서의 긴장감 극복, 캐릭터 대사 해석, 감점 없는 고음 발성을 전담 코칭합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "뮤지컬은 대사를 노래로 뱉는 단순 연출이 아닌, 멜로디 속에 내면의 가장 진실한 눈물을 이식하는 거룩한 무대입니다",
        subtitle: "배우의 목소리 끝에 맺힌 작은 떨림 속에 관객의 마음을 훔치는 진짜 힘이 들어 있습니다.",
        content_data: {
          description: "안녕하십니까. 스포트라이트 오리지널 극단의 예술 감독입니다. 우리는 마이크 효과로 떡칠 된 상업 뮤지컬 소음을 단호히 거부합니다. 배우 본연의 후두 하강 성대 접촉과 횡격막 호흡 압력을 극한으로 단련하여, 극장 맨 뒤의 관객에게도 배우의 숨소리와 감정의 결이 고스란히 전달되는 정직한 어쿠스틱 서비스 연출을 지향합니다. 감동의 무대 뒤로 여러분을 초대합니다.",
          stats: [
            { label: "누적 오리지널 공연 횟수", value: "680회 돌파" },
            { label: "전임 상주 뮤지컬 배우", value: "35명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "백스테이지 & 무대 인프라",
        subtitle: "배우들이 오직 최고의 영광의 찬사를 획득하기 위해 땀을 흘리는 무대 뒷면의 생생한 풍경입니다.",
        content_data: {
          items: [
            { title: "세종홀 대극장 무대 딤머 조명 스태프", description: "수백 개의 스포트라이트 전등 조도를 콘솔로 제어해 배우의 존재감을 극적으로 뿜어내 주는 스퀘어", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" },
            { title: "주연 배우들 대기실 거울과 제복", description: "조명 거울 앞에 서서 화려한 무대 화장을 점검하고 번쩍이는 정식 의상을 착용해보는 배우들의 방 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오케스트라 피트 합주 리허설실", description: "무대 아래 구덩이에서 지휘자의 지휘봉에 맞춰 튜닝 바이올린 활을 긋고 소리를 맞추는 악단 전경 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "단체 티켓 예매 및 배우 오디션 신청",
        subtitle: "희망 관람 일시, 티켓 인원수(단체 할인 적용 여부), 아티스트 오디션 지원 파트를 작성해 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "티켓 예매 및 오디션 접수"
        }
      }
    ]
  },

  traditional_folk_spirit: {
    templateId: "traditional_folk_spirit",
    name: "온새미로 국악 & 퓨전 국악 예술단",
    category: "Music",
    description: "전통 한지의 아늑한 미색 한지 베이지와 깊고 묵직한 대나무 잎 세이지 그린, 고풍스러운 대추 레드가 조화를 이루어 우리 소리의 웅장함과 아름다움을 전하는 국악 테마입니다.",
    image: "/templates/traditional_folk_spirit.png",
    theme: {
      fontFamily: "Noto Serif KR, East Sea Dokdo, serif",
      colors: {
        primary: "#3c2f2f",     // 깊은 가얏고 오동나무 브라운
        secondary: "#d4af37",   // 전통 놋쇠 황동 골드
        accent: "#7c2d12",      // 고풍스러운 붉은 낙관 인장 레드
        background: "#f5ece1",  // 한지 무늬 오가닉 웜베이지
        surface: "#ffffff",     // 맑고 깨끗한 화선지 화이트
        text: "#29211c"         // 먹묵빛 잉크 브라운 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오동나무 가얏고 현을 타는 깊은 떨림부터, 막힌 가슴을 뚫는 태평소의 포효까지",
        subtitle: "우리 땅의 바람 소리와 대나무 숲의 사색을 가야금, 거문고, 해금의 선율 속에 투명하게 담아내고, 사물놀이의 신명 나는 태평소 사운드로 만성 체증을 단숨에 씻겨내는 온새미로 국악단의 공식 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "국악 정기 연주회 예매",
          ctaLink: "#contact",
          features: [
            { text: "국가무형문화재 제정 보유 시니어 명창들의 정통 판소리 흥보가/춘향가 완창 독창회 예약" },
            { text: "대나무 대금 황골 취구 호흡법 및 가야금 농현(弄絃) 손떨림 기법 1:1 마스터 클래스 개설" }
          ]
        }
      },
      {
        section_type: "services",
        title: "우리 소리 아카이브",
        subtitle: "막힌 어혈을 기혈 소통 침처럼 맑게 뚫어주는 전통 국악 감동 프로그램입니다.",
        content_data: {
          items: [
            {
              title: "정통 대금 & 해금 선율반",
              description: "대나무 대금의 애절한 김 불기 호흡법과 두 줄 해금의 뼈마디를 울리는 맑은 찰현 소리를 연마합니다.",
              icon: "Compass"
            },
            {
              title: "퓨전 국악 밴드 잼 콘서트",
              description: "가야금 뜯는 멜로디에 일렉트릭 베이스 기타와 드럼 비트를 접목해 젊고 신명 나는 크로스오버를 직조합니다.",
              icon: "Zap"
            },
            {
              title: "전통 가야금 농현 마스터",
              description: "오동나무 통 위 명주실 현을 손가락 끝 지문으로 누르고 튕기며 깊은 비브라토 농현을 완성합니다.",
              icon: "Palette"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "우리 국악은 서양 악보를 기계적으로 읊는 단순 연주가 아닌, 아랫배 단전의 숨을 실어 한을 풀어내는 소리 공부입니다",
        subtitle: "가야금 상판 오동나무는 3년간 눈비를 맞으며 야외 건조되어야 비로소 명기가 태어납니다.",
        content_data: {
          description: "안녕하십니까. 온새미로 국악 예술단의 상임 지휘자 겸 명창입니다. 서양식 주입식 음악 교육에 무뎌져 내 몸 안의 고유한 한의 정서와 신명 나는 리듬을 잊은 채 지내오셨나요? 국악은 억지 기교를 부리지 않고, 숨을 들이마시고 내쉬는 자연의 호흡(정간보)에 맞춰 몸 안의 뼈와 장기를 공명시켜 치유를 유도하는 웅장한 마음 예술입니다. 우리의 따스한 묵향 가득한 서실로 당신을 초대합니다.",
          stats: [
            { label: "국악 단원 보유 수", value: "35명" },
            { label: "소장 전통 수제 가야금", value: "18대 보유" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "국악 전실 & 수제 악기 창고",
        subtitle: "은은한 계피와 대나무 향취가 풍기며 가얏고 오동나무 결이 반짝이는 전통 힐링 공간입니다.",
        content_data: {
          items: [
            { title: "아늑한 전통 온돌 침도 가야금실", description: "따뜻하게 데워진 온돌 마루 위에서 가야금 발가락 안착 자세와 현 뜯기를 연습하는 훈련실", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" },
            { title: "오픈형 무농약 전통 차 족욕 라운지", description: "대기 시간 동안 따뜻한 국산 쑥 물에 발을 담그고 쌍화차를 마시며 마음을 이완하는 대기 쉼터", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" },
            { title: "오동나무 가야금 뒷면 울림 구멍 스냅", description: "오동나무 속을 파내어 해와 달 모양의 음양 뒤판 구멍을 조각한 장인의 전통 현악기 목조 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "국악 공연 예매 및 가야금 체험 신청",
        subtitle: "희망 수업 장르(가야금/해금/대금/판소리), 국악 악기 보유 유무, 기존 국악 공부 이력을 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "우리 소리 강좌 예약"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 4: Busking, DJ Academy, Modular Synth, Wedding, Podcast
  // ==========================================
  acoustic_busking_soul: {
    templateId: "acoustic_busking_soul",
    name: "솔로 싱어송라이터 & 버스커",
    category: "Music",
    description: "은은하고 고즈넉한 샌드 머스타드 베이지와 차분한 어쿠스틱 브라운 배합이 기타 한 대와 나만의 목소리로 거리 공연을 이끄는 버스커 전용 테마입니다.",
    image: "/templates/acoustic_busking_soul.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#7f5539",     // 고소한 나무 로즈우드 브라운
        secondary: "#f5ebe0",   // 아늑한 모래사장 샌드 베이지
        accent: "#d4a373",      // 따뜻한 조명 웜 앰버 골드
        background: "#faf6f0",  // 무자극 오가닉 크림 오프화이트
        surface: "#ffffff",     // 맑고 깨끗한 아날로그 엽서 화이트
        text: "#463f3a"         // 에스프레소 초콜릿 다크 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오직 통기타 한 대와 내 목소리만으로 거리의 고독을 채우다",
        subtitle: "화려한 반주 기계음 없이, 선선한 노을이 지는 공원 잔디밭 길거리에서 행인들의 발걸음을 멈추고 영혼을 촉촉하게 어루만지는 솔로 싱어송라이터의 공식 아카이브이자 길거리 공연(Busking) 일정 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "최신 자작곡 포크 송 듣기",
          ctaLink: "#contact",
          features: [
            { text: "아날로그 통기타 스트로크 타격음과 보컬의 숨소리를 날것 그대로 수록한 미니 앨범 음원 공개" },
            { text: "매주 토요일 노을 지는 여의도 한강 공원 선셋 라이브 버스킹 타임 테이블 스케줄 중계" }
          ]
        }
      },
      {
        section_type: "services",
        title: "버스커 어쿠스틱 스케줄",
        subtitle: "기타 한 대와 나만의 감성 톤으로 도심 속 고독을 차분하게 달래주는 힐링 트랙입니다.",
        content_data: {
          items: [
            {
              title: "정통 포크 어쿠스틱 버스킹",
              description: "마이크 없이도 거리에 울려 펴지는 맑은 하이코드 아르페지오 기타 기법과 진정성 있는 가사로 소통합니다.",
              icon: "Music"
            },
            {
              title: "1:1 수제 작사 & 작곡 워크숍",
              description: "내 방 침대에 누워 사색한 일기장을 3분짜리 우아한 포크 송 멜로디로 빌드업하는 요령을 전수합니다.",
              icon: "PenTool"
            },
            {
              title: "마이크 기어 및 야외 버스킹 팁",
              description: "배터리식 롤랜드 스트리트 큐브 앰프 조작 요령과 야외 관객 소음 속에서도 중심을 잃지 않는 발성을 가이드합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "음악은 대단한 콘서트 홀이 아니어도, 단 한 명의 행인과 노을빛 바람만 있다면 어디서든 완성되는 기적입니다",
        subtitle: "기교가 가득 찬 고음 지르기보다, 말하듯 차분하게 속삭이는 한 문장의 진심이 훨씬 깊게 닿습니다.",
        content_data: {
          description: "안녕하십니까. 어쿠스틱 싱어송라이터입니다. 우리는 백화점 마트의 시끄러운 인공 소음을 끄고, 낡은 나무 기타 한 대를 손에 쥐고 노을빛 골목길 구석에서 사색을 노래합니다. 우리의 가사와 멜로디는 내면의 슬픔을 억지로 꾸며내지 않고, 매일 버스를 타고 퇴근하는 평범한 사람들의 땀 흘린 하루를 따뜻하게 경청하고 어루만집니다. 우리의 따스한 아날로그 엽서를 신청해 보세요.",
          stats: [
            { label: "누적 길거리 버스킹 횟수", value: "350회" },
            { label: "보유 아날로그 기타 수", value: "4대 소장" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "길거리 공연 & 감성 캠핑 스냅",
        subtitle: "자연을 탐험하고 거리에서 노래하며 자유를 만끽하는 버스커의 리얼 일상 사진들입니다.",
        content_data: {
          items: [
            { title: "여의도 선셋 한강 버스킹 전경", description: "붉은 노을이 등 뒤로 지는 한강 둑에 앉아 기타 한 대를 튕기며 행인들에게 노래를 선사하는 찰나", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80" },
            { title: "로즈우드 빈티지 테일러 기타 바디", description: "나무 결의 따스함과 손톱 마찰 열량으로 자연스럽게 닳아 은은한 중후함을 풍기는 루시어 기타 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "아날로그 모닥불 캠핑 라이브 퍼포먼스", description: "타닥타닥 타오르는 장작불 소리와 함께 지인들과 둘러앉아 기타 잼을 치며 노래하는 낭만적 야영 무대", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "축제 버스킹 섭외 및 정기 구독 신청",
        subtitle: "지자체 소공원 축제 공연 초청 문의, 신작 자작곡 음원 메일 정기 구독 신청은 아래 양식을 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "버스킹 공연 섭외하기"
        }
      }
    ]
  },

  dj_academy_mix: {
    templateId: "dj_academy_mix",
    name: "스마트 믹스 DJ & 디제잉 아카데미",
    category: "Music",
    description: "트렌디한 테크노 바이올렛과 시안 네온 블루, 글래스모피즘 효과가 어우러져 프로 바리스타처럼 소리를 믹싱하는 디제잉 아카데미 테마입니다.",
    image: "/templates/dj_academy_mix.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#8b5cf6",     // 테크노 앰프 일렉트릭 퍼플
        secondary: "#06b6d4",   // 맑고 차가운 레이저 시안 블루
        accent: "#f43f5e",      // 심장 박동 포스 핑크
        background: "#0b0f19",  // 암실 클럽 다크 블루 블랙
        surface: "#1e293b",     // 세련된 아키텍처 슬레이트 차콜
        text: "#f8fafc"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "비트 매칭부터, 대형 락페스티벌 헤드라이너 클럽 디제잉까지",
        subtitle: "글로벌 클럽 현역으로 활동 중인 프로 DJ 강사진의 1:1 밀착 장비 피드백 시스템과 파이오니어 DJ 컨트롤러 기기 1인 1실 배치를 바탕으로, 디제잉의 모든 믹싱 공식을 단기에 완전 체화합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
          ctaText: "바리스타 디제잉 1일 무료 레슨",
          ctaLink: "#contact",
          features: [
            { text: "국내 유일의 실제 클럽 음향 조도 사양과 동일한 특수 거울 네온 연습룸 상시 개방" },
            { text: "졸업 수강생 강남/홍대 메이저 클럽 데뷔 데뷔 무대 연계 지원 핫라인 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "디제잉 아카데미 코스",
        subtitle: "음악 초보의 취미 디제잉부터 클럽 취업을 위한 스페셜 믹스셋 빌드업 코스입니다.",
        content_data: {
          items: [
            {
              title: "클래식 턴테이블 바이닐 믹싱",
              description: "실제 LP 레코드판을 손끝 지문으로 만지며 속도(Pitch)를 귀로 매칭하고 스크래치를 연마하는 오리지널 코스입니다.",
              icon: "Disc"
            },
            {
              title: "디지털 CDJ & DJ 컨트롤러",
              description: "가장 대중적인 파이오니어 CDJ 기기의 핫큐 세팅, 이펙터 노브 활용 요령을 완전 습득합니다.",
              icon: "Zap"
            },
            {
              title: "나만의 시그니처 믹스셋 조제",
              description: "서로 다른 장르(하우스, 테크노, EDM)의 20곡을 하나의 유기적인 스토리텔링 흐름으로 매칭 믹싱합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "디제잉은 단순히 다음 곡 재생 버튼을 누르는 것이 아닌, 관객의 뇌파를 내 손끝 EQ 노브로 조작하는 주파수 힙합입니다",
        subtitle: "모든 믹싱 타이밍은 앞뒤 곡의 마디(Bar) 수학적 정렬에 맞춰 완벽히 계산되어야 합니다.",
        content_data: {
          description: "안녕하십니까. 스마트 믹스 DJ 아카데미 원장입니다. 음악을 전혀 모르고 악기를 다뤄본 적이 없어도 괜찮습니다. 디제잉은 박자 감각과 볼륨 밸런스의 정교한 조화를 배우는 가장 직관적이고 유쾌한 음악 놀이입니다. 우리는 1:1 과외식 레슨을 고집하여, 수강생이 단 4주 만에 30분 분량의 세련된 믹스셋을 직접 빌드업하고 지인들 앞에서 당당히 플레이하도록 지도합니다.",
          stats: [
            { label: "누적 아카데미 졸업생", value: "1,800명+" },
            { label: "원내 실물 CDJ 머신", value: "15대 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수강생 믹싱 연습룸 & 클럽 무대",
        subtitle: "현직 클럽의 레이저 조명과 심장 박동을 울리는 스피커가 세팅된 전문 디제잉 인프라입니다.",
        content_data: {
          items: [
            { title: "파이어니어 CDJ 메인 믹싱 연습룸", description: "대형 LCD 화면을 보며 비트 그리드를 맞추고 볼륨 페이더를 정교하게 올리는 실습실 전경", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80" },
            { title: "네온 레이저 빔 특수 파우더룸", description: "화려한 시안 블루와 퍼플 조명 거울 앞에서 나만의 시그니처 디제잉 의상과 헤어를 세팅하는 뷰티 존", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "실제 홍대 클럽 졸업 무대 데뷔", description: "아카데미 수료 후 실제 클럽 대관 공연 무대에서 수백 명의 관객 앞에 서서 믹스셋을 터트리는 수강생", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1일 무료 디제잉 체험 클래스 신청",
        subtitle: "수강 목적(취미/클럽데뷔/파티기획), 평일/주말반 희망 여부, 선호하는 댄스 장르(EDM/테크노/힙합)를 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "디제잉 레슨 신청하기"
        }
      }
    ]
  },

  synth_diy_hardware: {
    templateId: "synth_diy_hardware",
    name: "신스 크래프트 모듈러 & 신디사이저 공방",
    category: "Music",
    description: "테크니컬한 회로판 틸 그린과 세련된 메탈릭 그레이, 형광 네온 오렌지 액센트 배합으로 모듈러 신스 하드웨어 수제 제작의 지적 카타르시스를 주는 공방 테마입니다.",
    image: "/templates/synth_diy_hardware.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#0f766e",     // 테크니컬 회로판 틸 그린
        secondary: "#e2e8f0",   // 스마트 클린 슬레이트
        accent: "#ea580c",      // 인두기 핫 오렌지 네온
        background: "#090d16",  // 미래적인 다크 나이트 네이비
        surface: "#111827",     // 은빛 알루미늄 랙 차콜 슬레이트
        text: "#f3f4f6"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "나만의 아날로그 주파수 발진기(VCO) 회로를 직접 설계하고 인두기로 조립하라",
        subtitle: "기성 컴퓨터 가상악기의 삭막한 평면 클릭을 탈출하여, 오리지널 알루미늄 유로랙(Euro-Rack) 규격의 회로 기판에 저항과 칩을 납땜하고, 세상에 단 하나뿐인 전압 제어 필터(VCF) 모듈 하드웨어를 수제 론칭하는 아키텍처 공방입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          ctaText: "신스 조립 원데이 워크숍",
          ctaLink: "#contact",
          features: [
            { text: "아날로그 파동 사인파, 톱니파 발진기 회로 기판 및 알루미늄 전면 패널 수제 레이저 조각 장비 완비" },
            { text: "회로 설계 공학 자격증을 보유한 시니어 엔지니어링 마스터의 안전 납땜 1:1 밀착 코칭" }
          ]
        }
      },
      {
        section_type: "services",
        title: "신스 빌더 크리큘럼",
        subtitle: "전기 신호를 귀에 들리는 몽환적인 음향으로 번역해내는 과학적 공방 코스입니다.",
        content_data: {
          items: [
            {
              title: "유로랙(Euro-Rack) 모듈 제작반",
              description: "전 세계 규격인 3U 높이 알루미늄 패널에 저항, 콘덴서, 노브를 기판에 직접 땜질해 모듈을 빌드합니다.",
              icon: "Cpu"
            },
            {
              title: "아날로그 파형 제어(VCO/VCF)",
              description: "주파수를 깎아 부드럽고 고소한 배음을 만드는 아날로그 로우패스 필터 모듈의 회로 작동 원리를 교육합니다.",
              icon: "Zap"
            },
            {
              title: "3D 프린팅 커스텀 노브 & 케이스",
              description: "신디사이저 노브의 그립감을 살리기 위해 3D 캐드로 둥글게 디자인하고 실물 출력해 조립하는 과정입니다.",
              icon: "Layers"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "신디사이저는 악기 연주를 넘어, 전압의 흐름과 파동의 대칭성을 손끝으로 요리하는 공학 예술입니다",
        subtitle: "모든 소리의 탄생 기원은 납땜 인두기 끝의 은실이 회로판에 안착하는 순간 결정됩니다.",
        content_data: {
          description: "안녕하십니까. 신스 크래프트 공방의 하드웨어 마스터 엔지니어입니다. 화면 속 마우스로 시퀀서 그래프를 그리는 가상악기의 지루한 소리에 실망하셨나요? 진짜 아날로그 전압 발진 회로가 자아내는 날것의 전기 진동 소리는, 가상악기가 흉내 낼 수 없는 거칠고 차오르는 따스한 질감을 선사합니다. 우리는 회로 설계 기초부터 안전한 인두기 땜질까지 성실히 가이드하여 당신의 테크니컬 소리 기기를 탄생시킵니다.",
          stats: [
            { label: "빌드 완료 수제 모듈 개수", value: "380개 돌파" },
            { label: "1인 단독 땜질 워크테이블", value: "8석 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "신스 납땜 작업대 & 모듈러 랙",
        subtitle: "알루미늄 패널과 패치 케이블이 꽂혀 미래 테크 아우라를 뿜어내는 공방 내부 전경입니다.",
        content_data: {
          items: [
            { title: "인두기와 돋보기 기판 납땜 작업대", description: "회로 기판(PCB) 구멍에 소형 저항을 꽂고 정밀 납땜을 진행해 아날로그 칩을 안착시키는 장인의 손길", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" },
            { title: "유로랙 대형 모듈러 신디사이저 랙", description: "수십 개의 수제 조립 모듈들이 케이블로 연결되어 은하수 흐르는 테크노 비트를 연출하는 기어", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80" },
            { title: "레이저 조각 패널 레이아웃 설계", description: "알루미늄 아노다이징 패널 표면에 캐드 도면대로 볼륨 눈금과 로고를 칼같이 음각 조각해내는 레이저 머신", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "모듈 조립 워크숍 및 회로 자문 신청",
        subtitle: "제작 희망 모듈(VCO/LFO/VCF/ADSR), 납땜 인두기 사용 경험 유무 및 워크숍 희망 요일을 선택해 문의하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "신스 워크숍 참가 신청"
        }
      }
    ]
  },

  wedding_live_ensemble: {
    templateId: "wedding_live_ensemble",
    name: "루체 프리미엄 웨딩 & 행사 라이브 연주단",
    category: "Music",
    description: "순백의 웨딩드레스를 상징하는 펄 아이보리와 기품 있는 클래식 로즈 골드, 네이비 배합으로 평생의 가장 영광스러운 예식을 연출하는 프리미엄 라이브 연주 테마입니다.",
    image: "/templates/wedding_live_ensemble.png",
    theme: {
      fontFamily: "Cormorant Garamond, Noto Serif KR, serif",
      colors: {
        primary: "#1e293b",     // 단정한 예복 차콜 네이비
        secondary: "#fef3c7",   // 클래식 샴페인 로즈 골드
        accent: "#b07d62",      // 우아한 웨딩 더스티 로즈
        background: "#fafaf6",  // 순백의 웨딩드레스 펄 오프화이트
        surface: "#ffffff",     // 맑고 깨끗한 백색 카펫 화이트
        text: "#402a23"         // 따뜻한 딥 초콜릿 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "평생의 단 하루뿐인 거룩한 예식, 웅장하고 클래식한 선율로 수놓다",
        subtitle: "명문 음대(서울대, 한예종 등) 출신 시니어 연주자들로만 엄격히 구성된 트리오/콰르텟 현악 사운드와, 기내 방송처럼 아늑하고 우아한 사회자 목소리 융합으로 단 한 순간의 음향 오차도 없이 신랑 신부의 입장을 가장 영광스럽게 보좌하는 최고급 예식 연주단입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
          ctaText: "예식 연주 샘플 영상 보기",
          ctaLink: "#contact",
          features: [
            { text: "호텔 예식 맞춤형 하이엔드 3중주/4중주/5중주(바이올린, 첼로, 비올라, 피아노, 플루트) 라인업 보유" },
            { text: "예식 디데이 전용 커스텀 식순 음향 매칭 및 성스러운 축가 보컬 무료 큐레이션 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "루체 웨딩 포트폴리오",
        subtitle: "인생의 가장 찬란한 예식을 우아하고 풍성하게 채워주는 연주 코스입니다.",
        content_data: {
          items: [
            {
              title: "호텔식 클래식 4중주 (Quartet)",
              description: "신랑 신부 동시 입장 및 퇴장 식순에 맞춰 엘가의 위풍당당 행진곡을 기품 넘치는 현악 활 긋기로 수놓습니다.",
              icon: "Music"
            },
            {
              title: "성스러운 성악 축가 보컬",
              description: "명문 성악과 출신 테너, 소프라노가 대성당의 잔향을 방출하듯 아름다운 세레나데 러브송을 바칩니다.",
              icon: "Heart"
            },
            {
              title: "고품격 기업 연회 & 행사 음악",
              description: "기업 포럼, 시상식 무대의 묵직하고 신뢰감 넘치는 팡파레와 리셉션 리서치 음악을 정교하게 서빙합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "라이브 연주는 기성 MR 기계음이 자아낼 수 없는, 예식장의 긴장된 공기마저 우아하게 녹여내는 생생한 감동입니다",
        subtitle: "모든 연주 단원은 현역 오케스트라 상임 단원 자격을 보유한 베테랑으로만 엄선됩니다.",
        content_data: {
          description: "안녕하십니까. 루체 라이브 엔상블의 상임 음악 감독입니다. 일생의 가장 소중한 결혼식날, 싸구려 틱하고 먹먹한 녹음 반주(MR)로 버진로드를 걷고 계시진 않나요? 라이브 현악기의 마찰 울림과 피아노 건반의 배음은 신랑 신부의 발걸음 템포에 맞춰 실시간으로 흐름을 맞춰주어, 예식의 격조를 극적으로 상승시키는 가장 탁월한 선택이 됩니다. 인생의 명작을 만나십시오.",
          stats: [
            { label: "누적 예식 연주 진행", value: "1,200회 돌파" },
            { label: "소속 프로 전문 연주자", value: "35명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "영광의 결혼식 & 호텔 연회 전경",
        subtitle: "수많은 축복 속에서 단원들이 품격 높은 악기 선율을 들려주는 실제 예식 현장 리포트입니다.",
        content_data: {
          items: [
            { title: "하얏트 호텔 샹들리에 4중주 스테이지", description: "화려한 크리스탈 샹들리에 조명 빛 아래서 클래식 제복을 착용하고 첼로 비올라 활을 긋는 단원들", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80" },
            { title: "버진로드 앞 성악가 축가 라이브", description: "수백 명의 하객 앞에서 마이크를 잡고 오리지널 감동 축가를 웅장한 호흡으로 내뿜는 성악 명창의 찰나", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "화사한 신부대기실 바이올린 웰컴 음악", description: "신부를 맞이하는 대기공간 입구에서 은은한 디즈니 러브송 메들리를 켜주며 하객을 에스코트하는 모습", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "예식 연주 예약 및 견적 문의",
        subtitle: "결혼식 날짜 및 시간, 예식장 장소(호텔/일반홀/성당), 희망 연주 사양(3중주/4중주/축가)을 적어 예약을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "연주단 예약 신청하기"
        }
      }
    ]
  },

  podcast_voice_studio: {
    templateId: "podcast_voice_studio",
    name: "보이스 웨이브 팟캐스트 & 오디오 저널",
    category: "Music",
    description: "지적이고 현대적인 슬레이트 차콜과 신뢰도 높은 스마트 아쿠아 테일 그린의 조화가 차분한 오디오 팟캐스트 및 목소리 더빙 스튜디오의 감성을 전하는 테마입니다.",
    image: "/templates/podcast_voice_studio.png",
    theme: {
      fontFamily: "Inter, Noto Sans KR, sans-serif",
      colors: {
        primary: "#0f766e",     // 스마트 아쿠아 테일 그린
        secondary: "#e2e8f0",   // 클린 그레이 슬레이트
        accent: "#10b981",      // 보이스 활성 에메랄드
        background: "#0f172a",  // 깊은 라운지 차콜 네이비 슬레이트
        surface: "#1e293b",     // 세련된 아키텍처 슬레이트 차콜
        text: "#f8fafc"         // 가독성 높은 네온 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "귀끝으로 전해지는 지적인 사색의 목소리, 내 방에서 만드는 라디오 저널",
        subtitle: "고해상도 전문 콘덴서 마이크와 노이즈 프리 방음 부스 시스템을 가동하여, 책 낭독·비즈니스 인터뷰·사색의 오디오 팟캐스트(Podcast)를 0.1초의 에코 왜곡 없이 깨끗하게 녹음하고 배포하는 1인 오디오 스튜디오입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
          ctaText: "팟캐스트 녹음실 패키지 신청",
          ctaLink: "#contact",
          features: [
            { text: "전문 팟캐스트 호스트 및 성우 공채 출신 강사의 1:1 보이스 목소리 톤 매칭 가이드" },
            { text: "녹음 즉시 배경 잡음을 알아서 차단하고 고해상도로 포맷 변환해주는 자동 오디오 프로그램 탑재" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오디오 솔루션 스펙트럼",
        subtitle: "귀에 쏙쏙 박히는 지적이고 신뢰감 넘치는 오디오 결과물을 직조하는 커리큘럼입니다.",
        content_data: {
          items: [
            {
              title: "1인 팟캐스트 올패스 배포",
              description: "기획안 작성, 앵커 마이크 대화 기법, 녹음 후 스포티파이 및 애플 팟캐스트 글로벌 론칭을 돕습니다.",
              icon: "Mic"
            },
            {
              title: "목소리 낭독 & 1:1 발음 교정",
              description: "아나운서 공채 표준 발성법을 대입하여 웅얼거리는 입 모양 근육을 교정하고 설득력 있는 목소리를 빌드업합니다.",
              icon: "Smile"
            },
            {
              title: "스마트 더빙 & 나레이션 녹음",
              description: "기업 유튜브 광고 나레이션, 오디오북 낭독을 위한 노이즈 프리 초정밀 수록 환경을 대관합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "목소리는 보이지 않는 또 다른 강력한 비주얼이며, 청각의 이완을 이끄는 지적 무기입니다",
        subtitle: "귀를 피로하게 만드는 인공 고음 믹싱 대신, 편안한 중저음 음성 주파수를 설계해 드립니다.",
        content_data: {
          description: "안녕하십니까. 보이스 웨이브 오디오 랩의 대표 사운드 엔지니어입니다. 1인 방송이나 팟캐스트를 하고 싶지만 내 목소리가 기계음처럼 날카롭게 들리거나 방 안의 울림 잡음 때문에 절망하셨나요? 팟캐스트의 핵심은 바로 귀에 착 감기는 '친절한 음질'입니다. 우리는 고품질 노이만 마이크와 진공관 프리앰프 매칭을 통해 당신의 목소리를 라디오 방송의 지적인 시니어 앵커처럼 연출해 냅니다.",
          stats: [
            { label: "제작 완료 오디오 에피소드", value: "1,500회 돌파" },
            { label: "보유 전문 콘덴서 마이크", value: "8세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "스마트 팟캐스트 룸 & 장비",
        subtitle: "오디오 녹음 및 더빙에 완벽하게 몰입할 수 있도록 쾌적하게 셋업된 라운지 공간 시설입니다.",
        content_data: {
          items: [
            { title: "2인/4인 대담 팟캐스트 녹음실", description: "탁상용 쇼크 마운트 마이크 스탠드와 전문 모니터링 헤드폰이 빌트인된 아늑한 대담 룸", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80" },
            { title: "오디오북 전문 나레이션 흡음 부스", description: "외부 무전원 패시브 흡음 패널이 설계되어 에코와 반사음을 0%로 낮춘 초청정 낭독 전용 부스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "디지털 오디오 에디팅 믹싱 콘솔", description: "로직 프로 및 프로툴 시퀀서를 보며 음성의 크기를 0.1dB 오차 없이 이퀄라이징하고 리미팅하는 믹서", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "대관 예약 및 1:1 보이스 트레이닝 의뢰",
        subtitle: "이용 희망 일시, 녹음 시간, 1:1 발성 스피치 코칭 포함 여부, 오디오북 더빙 여부를 기재해 문의하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "팟캐스트 스튜디오 예약"
        }
      }
    ]
  }
};
