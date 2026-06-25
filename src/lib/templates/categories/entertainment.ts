import { TemplateConfig } from "../registry";

export const ENTERTAINMENT_TEMPLATES: Record<string, TemplateConfig> = {
  indie_cinema_theater: {
    templateId: "indie_cinema_theater",
    name: "시네필 클래식 독립 영화관",
    category: "Entertainment",
    description: "아날로그적인 딥 와인 버건디와 맑은 린넨 아이보리, 시크한 영사 암막 차콜 배합으로 시네필들을 위한 독립 영화 상영 정보와 예매를 연출하는 테마입니다.",
    image: "/templates/indie_cinema_theater.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4c0519",     // 영사기 빛 딥 버건디
        secondary: "#fdf8f5",   // 맑고 깨끗한 린넨 아이보리
        accent: "#d4af37",      // 샴페인 골드 스포트라이트
        background: "#0c0a09",  // 묵직한 영사 영화관 차콜 블랙
        surface: "#1c1917",     // 낡은 목조 관객 의자 다크 브라운
        text: "#f5ebe0"         // 가독성이 탁월한 소프트 크림
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "상업적인 팝콘 소음을 단호히 끄고, 영사기 빛줄기가 쓰는 빛의 시를 응시하다",
        subtitle: "수억 원 짜리 컴퓨터 그래픽 폭발로 가득 찬 뻔한 멀티플렉스 흥행작을 단호히 거부합니다. 시네필 아뜰리에 방식으로, 35mm 필름 오리지널 그레인 질감과 감독의 타협 없는 해체주의 철학이 깃든 독립 영화, 그리고 촛불 하나만 켜둔 안락한 80석 프라이빗 관람실에서 미식과 영화의 공명을 바치는 독립 영화 예술관입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금주 상영 상영 캘린더",
          ctaLink: "#services",
          features: [
            { text: "프랑스 누벨바그 명작부터 국내 신진 작가의 자비 출판 단편 독립 영화까지 정교한 큐레이션" },
            { text: "영화 감상 후 감독, 평론가와 1:1 관객과의 대화(GV) 마이크로 살롱 무제한 입장권 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "시네필 큐레이션",
        subtitle: "지루한 일상에 영혼의 물방울을 떨어뜨려 정화하는 영화 감상 라인업입니다.",
        content_data: {
          items: [
            {
              title: "35mm 필름 클래식 상영회",
              description: "컴퓨터 파일이 아닌, 오래된 영사 기어가 찰찰거리며 필름 필름지를 회전하는 원형 그대로의 아날로그 질감 감상회입니다.",
              icon: "Sparkles"
            },
            {
              title: "감독 동반 관객과의 대화 (GV)",
              description: "영화 상영 종료 즉시 감독과 주연 배우가 촛불 테이블에 착석하여 제작 비화와 인권 철학을 털어놓는 소통 소통 펍입니다.",
              icon: "Heart"
            },
            {
              title: "시네마틱 푸드 & 와인 마리아주",
              description: "상영작 콘셉트에 맞춰 소믈리에가 엄선한 보르도 레드 와인과 수제 카프레제 타파스를 페어링 서빙합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "독립 영화는 단순히 시간을 떼우는 오락이 아닌, 작가가 렌즈라는 창문을 통해 기득권 세상의 왜곡된 진실을 고발하는 숭고한 침묵의 예술입니다",
        subtitle: "모든 상영관 의류는 고객 1인이 다녀갈 때마다 편백나무 방역 소독과 가죽 시트 클리닝을 성실히 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 시네필 독립 영화관의 오너 큐레이터입니다. 우리는 앞사람 머리에 가려 자막이 안 보이고 옆 사람 팝콘 소리로 대사를 망치는 대형 극장 체인을 단호히 거부합니다. 우리는 오직 80석 한정 무단 단차 시공을 거쳐 누구나 완벽한 시각 왜곡 없이 스크린을 감상하도록 설계했으며, 은은한 버건디 빛 조명 속에서 파리의 예술가처럼 깊은 사색을 맛보시기를 보좌하겠습니다.",
          stats: [
            { label: "누적 상영 독립 단편 작", value: "350편 돌파" },
            { label: "정기 구독 아트 멤버십 회원", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "동굴 살롱 영사실 & 아날로그 관객석",
        subtitle: "사진 한 장만으로도 아늑한 필름 냄새와 에스프레소 아로마가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "샹들리에 아래 레드 가죽 관람석", description: "어두운 목조 벽면 코너에 촛불 하나와 와인 잔, 그리고 상영 스케줄 시트가 이쁘게 세팅된 테이블 좌석", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80" },
            { title: "독일제 35mm 필름 필름 영사 기계실", description: "은빛 릴 바퀴가 회전하며 영사 렌즈 빛줄기를 무대 스크린 속으로 시크하게 쏘아 올리는 정교한 조리 현장", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 초콜릿 퐁듀와 화이트 와인 스냅", description: "원목 바 테이블 위에 얇게 썬 레몬 조각 가니쉬 디저트와 투명한 유리 컵 두 잔 스케치 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "영화 티켓 예매 및 살롱 대관 의뢰",
        subtitle: "관람 예정 일시, 상영작 선택, 단체 대관 필요 여부, 와인 웰컴 패키지 추가 여부를 기재해 신청하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "영화 예매 신청"
        }
      }
    ]
  },

  music_concert_festival: {
    templateId: "music_concert_festival",
    name: "얼라이브 록 페스티벌",
    category: "Entertainment",
    description: "뜨겁게 분출하는 네온 일렉트릭 레드와 묵직한 카본 재난 차콜, 경고 옐로우 액센트로 록 콘서트의 아드레날린과 활력을 전하는 액티브 테마입니다.",
    image: "/templates/music_concert_festival.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#dc2626",     // 타오르는 화염 일렉트릭 레드
        secondary: "#3f3f46",   // 묵직한 무대 철골 차콜 그레이
        accent: "#eab308",      // 네온 안전 안전 옐로우
        background: "#09090b",  // 밤의 서킷 블랙
        surface: "#18181b",     // 탄소 섬유 그릴 차콜
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "고출력 스피커가 심장을 때리는 압도적인 무대 진동과 청춘의 함성",
        subtitle: "방구석에 누워 스마트폰 미세 이어폰으로 음원만 듣는 무기력한 가상 현실에 중독되셨나요? 얼라이브 록 페스티벌 방식으로, 해발 600미터 야외 대지 위에서 10만 와트 초고출력 무대 음향 기어를 탑재하고, 헤드뱅잉과 깃발 릴레이로 타인의 시선 따위 가볍게 날려버리는 아웃도어 락 페스티벌 기획 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
          ctaText: "얼리버드 티켓 즉시 예매",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 헤비메탈 록 밴드 크루 24개 팀 독점 라인업 계약 체결 완료 보증" },
            { text: "체크인 시 스태프 전용 친환경 무릎 고정 하드 밴드 및 먼지 방지 전술 마스크 무료 무료 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "페스티벌 에센셜",
        subtitle: "온몸의 세포를 록 비트로 타격하여 아드레날린을 수확하는 락 캠프 목록입니다.",
        content_data: {
          items: [
            {
              title: "10만 와트 앰프 직화 사운드",
              description: "대형 마샬 마샬 앰프를 무대 좌우에 적재하여 일렉 기타의 일그러지는 드라이브 디스토션 음압을 심장에 이식합니다.",
              icon: "Zap"
            },
            {
              title: "야외 캠핑 & 깃발 그래피티",
              description: "락 공연장 주변 천연 잔디 구장에 텐트를 빌드인 피팅하고 동료들과 밤새 꼬마 전구 아래 맥주를 쉐어하는 파티입니다.",
              icon: "Flame"
            },
            {
              title: "수제 소시지 직화 펍 펍",
              description: "참나무 백탄 위에 돼지 목살 소시지를 그릴 그릴 시어링하여 차가운 라임 락 코로나 맥주와 들이킵니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "록 페스티벌은 단순히 소음을 뿜어내는 유흥이 아닌, 문명이라는 감옥 속에 억압된 인간 고유의 거친 생명력을 땀방울과 굉음으로 분출하는 청춘의 성스러운 의식입니다",
        subtitle: "모든 스페이스 안전은 전문 세이프티 마샬 안전 가드가 100% 수기 통제하여 단 한 건의 사고도 차단합니다.",
        content_data: {
          description: "안녕하십니까. 얼라이브 록 페스티벌의 총괄 프로듀서 그리더입니다. 우리는 얌전하게 의자에 박제되어 가식을 떨며 클래식만 박수치는 나태한 주류 극장 문화를 단호히 거부합니다. 우리는 야외에 거대한 무쇠 비계 골조를 단단히 시공하고, 붉은 화염 스모그가 피어오르는 무대 아래서 당신의 심장을 정직하게 두드려 깨우겠습니다.",
          stats: [
            { label: "누적 티켓 완판 관객 수", value: "35,000명+" },
            { label: "보유 고출력 무대 스피커", value: "48세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "화염 스모그 무대 & 관객 해드뱅잉",
        subtitle: "사진 한 장만으로도 가슴이 쿵쾅거리고 굉음 소리가 터져 나올 듯한 액티브 갤러리입니다.",
        content_data: {
          items: [
            { title: "일렉기타를 연주하는 록커 샷", description: "붉은 불꽃 사이로 긴 머리를 휘날리며 기타 목 지판을 손가락 탭으로 타격하는 생동감 넘치는 연주 찰나", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80" },
            { title: "야외 잔디밭 텐트촌과 꼬마전구들", description: "어두운 밤 노을 아래 수백 동의 텐트들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 락 캠프 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "소시지 직화 숯불 무쇠 그릴 스냅", description: "지프 차량 옆 그릴 위에서 삼겹살 갈비 꼬치가 연기를 뿜으며 노릇하게 익어가는 거친 야외 현장 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "티티켓 예매 및 스태프 지원 신청",
        subtitle: "1차 얼리버드 예매 신청, F&B 푸드트럭 입점 제안, 대학생 자원봉사 서포터즈 신청서는 아래 양식에 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "페스티벌 티켓 예약"
        }
      }
    ]
  },

  boardgame_cafe_lounge: {
    templateId: "boardgame_cafe_lounge",
    name: "미플즈 보드게임 카페 & 라운지",
    category: "Entertainment",
    description: "상큼한 머스타드 옐로우와 포근한 카카오 다크 브라운, 맑은 오프화이트 조화가 아기자기한 보드게임 수집과 지적인 친목을 이끄는 테마입니다.",
    image: "/templates/boardgame_cafe_lounge.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#ea580c",     // 귤빛 앰버 오렌지
        secondary: "#fef08a",   // 화사한 바나나 옐로우
        accent: "#16a34a",      // 맑고 싱그러운 민트
        background: "#fafbf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 깨끗한 나무 테이블 화이트
        text: "#1c2317"         // 눈이 편안한 올리브 브라운 차콜
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "주사위 한 알을 굴려 운명을 시험하고, 목재 미플 인형으로 세계 영토를 정복하다",
        subtitle: "중독성 심하고 가상 스크린 노이즈만 가득한 모바일 게임을 단호히 꺼버리십시오. 미플즈 라운지 방식으로, 전 세계 1,200종의 희귀 독일식 정통 보드게임과 자체 3D 프린터로 사출한 미플 피규어를 완비하여, 사랑하는 친구들과 머리를 맞대고 지적인 목재 주사위 배틀을 즐기며 소통하는 고품격 오프라인 친목 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80",
          ctaText: "희귀 보드게임 리스트 보기",
          ctaLink: "#services",
          features: [
            { text: "입문자용 파티 보드게임부터 헤비 유저용 4시간 코스 전략 브레인 게임까지 친절한 룰 가이드 무료 코칭" },
            { text: "음식이 닿는 식기 멸균 및 게임 칩 카드 전원 무균 멸균 살균 소독 관리 위생 엄수 보증" }
          ]
        }
      },
      {
        section_type: "services",
        title: "미플즈 프로그램",
        subtitle: "두뇌 세포를 지적으로 자극하며 유쾌하게 미소 짓는 보드게임 라인업입니다.",
        content_data: {
          items: [
            {
              title: "1인 단독 보드게임 추천",
              description: "방문하신 고객님의 두뇌 퍼즐 취향을 디지털 스캔 진단하여 100% 최적 매칭 게임을 큐레이팅 서빙합니다.",
              icon: "Zap"
            },
            {
              title: "3D 프린팅 개인 미플 제작",
              description: "원내 3D 프린터를 가동하여 나만의 얼굴 윤곽선이 새겨진 목재 미플 인형을 징으로 새겨 가공 선물합니다.",
              icon: "Sparkles"
            },
            {
              title: "달콤한 마카롱 멍푸치노 웰컴 셋",
              description: "게임 몰입 시 두뇌 포도당을 공급하기 위해 초콜릿 퐁듀와 에스프레소 아메리카노를 테이블로 배달합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "보드게임은 단순히 주사위를 던져 말을 움직이는 놀이가 아닌, 종이 카드와 나무 피규어라는 거룩한 아날로그 촉감 위에 내 영혼의 전략적 직관을 심어 동료와 소통하는 기품 있는 지적 스포츠입니다",
        subtitle: "모든 테이블은 프라이버시를 위해 2미터 높이 자작나무 칸막이 가벽 시공이 완비되어 방음됩니다.",
        content_data: {
          description: "안녕하십니까. 미플즈 보드게임 라운지의 헤드 마스터 원장입니다. 우리는 시끄러운 소음 속에서 게임 규칙도 모른 채 대충 주사위만 던져 피로만 조장하는 가성비 룸카페를 단호히 거부합니다. 우리는 쾌적한 에어 에어 드라이룸 필터 샤워 시설과 아늑한 간접 조명 인프라를 가동하며, 당신만의 은밀하고 세련된 보드게임 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 보유 희귀 보드게임", value: "1,200종+" },
            { label: "소속 전문 룰 설명 에디터", value: "8명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아늑한 자작나무 책상 & 주사위 룸",
        subtitle: "사진 한 장만으로도 포근한 종이 카드 냄새와 커피 커피 향취가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "원목 테이블 위 세팅된 보드게임", description: "하얀 가이드북 조명 아래 나무 피규어 미플들과 종이 칩들이 이쁘게 수놓아진 단독 1인 좌석 뷰", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80" },
            { title: "천장까지 가득 찬 보드게임 진열장", description: "독일 수입 보드게임 봉투 팩들이 무지개처럼 세련되게 정렬된 마호가니 가구 갤러리 코너", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린팅 미플 피규어 조각 스냅", description: "노즐 끝에서 에메랄드 수지 원액이 흘러나와 꼬마 목마 모양 미플 인형을 층층이 적재해 사출하는 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "테이블 사전 예약 및 대관 의뢰",
        subtitle: "방문 예정 일시, 예약 룸 선택, 인원수(단체 모임 등), 희망 게임 수준(초급/중급/상급)을 기재해 예약서를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "라운지 테이블 예약"
        }
      }
    ]
  },

  standup_comedy_club: {
    templateId: "standup_comedy_club",
    name: "조커스 스탠드업 코미디 펍",
    category: "Entertainment",
    description: "스포티하고 자극적인 애시드 형광 라임 그린과 묵직한 밤골목 서브웨이 차콜, 그리고 타오르는 네온 주황 포인트 배합이 스탠드업 코미디의 블랙유머와 소통을 전하는 펍 테마입니다.",
    image: "/templates/standup_comedy_club.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#10b981",     // 네온 애시드 라임 그린
        secondary: "#1f2937",   // 묵직한 시멘트 슬레이트 그레이
        accent: "#ea580c",      // 앰버 네온 오렌지
        background: "#09090b",  // 어두운 벽돌 지하실 블랙
        surface: "#18181b",     // 철제 드럼통 테이블 차콜
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "마이크 하나만 쥔 코미디언의 날카로운 촌철살인 블랙유머와 쏟아지는 웃음 폭탄",
        subtitle: "대본대로만 읽는 얌전하고 뻔한 공중파 코미디에 지루하셨나요? 조커스 스탠드업 방식으로, 날카로운 사회 풍자와 관객들과 즉석에서 소통하는 마이크로 스포트라이트 무대 아래서, 차가운 수제 맥주 잔을 흔들며 고단한 하루의 삶의 무게를 유쾌한 웃음으로 타격해 날려버리는 정통 언더그라운드 코미디 펍입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금주 코미디 라인업 예약",
          ctaLink: "#contact",
          features: [
            { text: "유투브 피드 누적 1000만 조회수를 돌파한 국내 최정상 스탠드업 코미디언 크루 독점 출연 보증" },
            { text: "맥주와 완벽 마리아주 공명을 일으키는 수제 핫 나초 칩 및 하이볼 음료 무제한 패키지 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "조커스 프로그램",
        subtitle: "심장 박동과 안면 근육을 유쾌하게 흔드는 코미디 펍 라인업입니다.",
        content_data: {
          items: [
            {
              title: "정통 스탠드업 코미디 쇼 쇼",
              description: "아무런 소품 없이 오직 코미디언의 날카로운 단독 텍스트와 표정만으로 관객을 들었다 놨다 하는 80분 메인 무대입니다.",
              icon: "Zap"
            },
            {
              title: "오픈 마이크 마이크 코너",
              description: "일반 관객 중 입담 좋은 도전자가 무대 위로 올라가 5분 동안 자신만의 썰을 털어놓는 관객 참여 세션입니다.",
              icon: "Compass"
            },
            {
              title: "수제 수제 버거 & 네온 칵테일",
              description: "무쇠 무쇠 불판 위에 그릴드한 소고기 패티와 치즈를 듬뿍 얹은 버거와 시원한 코로나 맥주 플레이팅입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스탠드업 코미디는 단순히 남을 웃기는 바보짓이 아닌, 사회의 모순과 가식적인 도그마를 단 한 줄의 유머로 해체하여 인간 영혼에 맑은 카타르시스를 선물하는 거룩한 무대 언어입니다",
        subtitle: "모든 공연석은 관객 몰입을 위해 스피커 오차 없는 하향식 음향 배치를 고수하여 귀 자극을 방지합니다.",
        content_data: {
          description: "안녕하십니까. 조커스 코미디 클럽의 마스터 디렉터입니다. 우리는 앞자리에 앉아 관객의 멱살을 잡고 모욕을 주어 불쾌감을 자아내는 저급한 억지 웃음 샵을 단호히 거부합니다. 우리는 세련된 형광 라임 네온 인프라를 가동하고, 쾌적하고 위생적인 맥주 탭룸을 상시 관리하며, 당신만의 짜릿하고 신나는 주말 탈출을 보좌하겠습니다.",
          stats: [
            { label: "연간 웃음 유발 폭풍 관객", value: "12,000명+" },
            { label: "소속 정예 코미디 크루", value: "14명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "붉은 벽돌 지하실 무대 & 드럼통 테이블",
        subtitle: "사진 한 장만으로도 신나는 웃음소리와 드럼 킥 소리가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "스포트라이트 마이크 한 대 무대", description: "어두운 붉은 벽돌 벽면에 은색 스탠드 마이크가 노란 조명을 받아 외롭게 빛나는 아우라 가득한 무대 뷰", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=600&q=80" },
            { title: "철제 락커 가구 네온사인 바 코너", description: "애시드 그린 선인장 로고가 반짝이고 은빛 맥주 탭룸 호스들이 정갈하게 진열된 카운터 쇼케이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "그릴드 칩스와 하이볼 칵테일 스냅", description: "무쇠 테이블 위에 노란 나초 칩 볼과 라임 레몬 가니쉬 유리 드링크 잔, 그리고 붉은 입장 티켓 스냅 데코", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공연 티켓 예매 및 단체 대관",
        subtitle: "공연 희망 날짜, 예약 세션 선택, 동반 참석 인원수, 선호하시는 드럼통 바 테이블 지정을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "코미디 펍 예약 완료"
        }
      }
    ]
  },

  magic_illusion_theater: {
    templateId: "magic_illusion_theater",
    name: "미스테리아 매직 & 일루션 쇼",
    category: "Entertainment",
    description: "신비롭고 기품 있는 로열 라벤더 퍼플과 은은한 샴페인 브론즈 골드, 맑은 석고 베이지 배합으로 미스테리한 마술 공연과 일루션을 연출하는 극장 테마입니다.",
    image: "/templates/magic_illusion_theater.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#581c87",     // 신비로운 로열 퍼플
        secondary: "#fdf4ff",   // 맑고 눈부신 아이보리 크림
        accent: "#d4af37",      // 샴페인 브론즈 골드 스파크
        background: "#0f0507",  // 어두운 마술 극장 다크와인
        surface: "#1e1114",     // 클래식 벨벳 가구 다크 브라운
        text: "#f5ebe0"         // 가독성 높은 소프트 크림 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "눈을 껌벅이는 찰나 물건이 허공으로 소리 없이 사라지는 신비로운 기적",
        subtitle: "허술하고 장난스러운 아이들 장난감용 동네 마술쇼를 단호히 거부합니다. 미스테리아 극장 방식으로, 세계 세계 3대 마술 협회 공인 일루셔니스트들의 입체 시각 왜곡 마술 공학과, 10만 와트 스포트라이트 불꽃 조명 아래서 카드 52장이 공중으로 날아오르는 거대한 초정밀 마술쇼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "일루션 티켓 실시간 예매",
          ctaLink: "#contact",
          features: [
            { text: "천연 자작나무와 벨벳 암막 커튼 방음 부스 인프라 속에서 오차 없는 마술 소리 감상" },
            { text: "체크인 시 관객 전원에게 마술 조종 카드 팩 및 웰컴 디톡스 자스민 허브티 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마술 큐레이션",
        subtitle: "뇌파와 시각 세포를 신비롭게 요동치게 만드는 일루션 목록입니다.",
        content_data: {
          items: [
            {
              title: "초정밀 카드 매니퓰레이션",
              description: "마술사의 손끝 0.1mm 수기 터치 움직임만으로 허공에서 수십 장의 카드가 뿜어져 나오는 정통 기술입니다.",
              icon: "Sparkles"
            },
            {
              title: "인체 부양 공중 일루션",
              description: "중력의 법칙을 가볍게 조롱하며 사람이 물 위에 떠 있는 듯한 완벽한 시각 왜곡 기하학 마스터피스입니다.",
              icon: "Compass"
            },
            {
              title: "수제 초콜릿 & 프랑스 샴페인",
              description: "관람을 마친 뒤 벨벳 바 라운지에서 프랑스 와인과 수제 디저트 마리아주를 대접받는 웰빙 코스입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "마술은 속임수로 사람을 바보 만드는 가식이 아닌, 규격화된 물리적 상식이라는 상자 속에 가둬둔 인간의 상상력을 단 1초 만에 해방시켜주는 지적인 영혼의 구원입니다",
        subtitle: "모든 공연 프로그램은 기습적인 소음 충격을 예방하기 위해 정확한 무대 조명 조율을 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 미스테리아 일루션 극장의 총괄 지배인 마스터입니다. 우리는 비밀 보장도 안 되고 엉성하여 실소를 유발하는 불량 마술쇼를 단호히 거부합니다. 우리는 생두 원두를 볶아 커피 바를 가동하고, 쾌적하고 위생적인 벨벳 살롱 인프라를 가동하며, 당신만을 위한 신비롭고 영롱한 주말의 힐링을 보좌하겠습니다.",
          stats: [
            { label: "연간 감동 선사 관객 수", value: "12,000명" },
            { label: "보유 전문 마술 소품 장비", value: "85종 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "화사한 벨벳 무대 & 3면 입체 거울대",
        subtitle: "사진 한 장만으로도 은은한 허브 향취와 신비로움이 가득 번져나는 아날로그 전경입니다.",
        content_data: {
          items: [
            { title: "은색 링 마술사가 서 있는 무대 뷰", description: "로열 퍼플 조명 아래 두 개의 은빛 금속 링이 공중 마찰하며 체결되는 신비롭고 다이내믹한 순간", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
            { title: "분장실 거울 앞 카드 수납 쇼케이스", description: "수십 개의 꼬마 백열전구가 켜진 맑은 거울 아래 클래식 왁스 카드들이 세련되게 장렬된 카운터 존", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "샴페인 글라스와 은색 열쇠 스냅 스냅", description: "원목 테이블 위에 보석 장식 은 열쇠와 투명한 화이트 샴페인 기포가 솟아오르는 드링크 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공연 예약 및 살롱 대관 문의",
        subtitle: "관람 예정 일시, 예약 룸 선택, 인원 수, 프라이빗 이벤트 마술 설계가 필요하다면 적어 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "마술 공연 예약 신청"
        }
      }
    ]
  },

  indie_game_studio: {
    templateId: "indie_game_studio",
    name: "픽셀바이브 독립 게임 개발 스튜디오",
    category: "Entertainment",
    description: "스마트하고 이지적인 슬레이트 메탈 그레이와 세련된 미드나잇 사이버 오렌지 골드 액센트로 2D 도트 독립 게임의 영감을 주는 라이프스타일 테마입니다.",
    image: "/templates/indie_game_studio.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#18181b",     // 시크한 제트 블랙 슬레이트
        secondary: "#e4e4e7",   // 알루미늄 메탈 그레이
        accent: "#ea580c",      // 핫 스포트 오렌지 골드
        background: "#09090b",  // 미니멀 시티 다크 나이트
        surface: "#27272a",     // 모니터 랙 메탈 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "수억 달러 메이저 게임의 양산형 양산형 그래픽을 단호히 걷어내고, 8비트 오라를 장착하다",
        subtitle: "자동 사냥과 과금 결제 유도 유도로 찌든 대기업의 양산형 MMORPG 게임을 단호히 거부합니다. 픽셀바이브 독립 스튜디오 방식으로, 1인 개발자의 집념 어린 2D 스프라이트 도트 디자인 예술과, 가슴을 저미는 수제 칩튠 사운드트랙 결합만으로 게임 고유의 지적 모험을 보장하는 하이엔드 인디 게임 연구소입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스팀 한정 데모 다운로드",
          ctaLink: "#services",
          features: [
            { text: "시각 영감을 돕는 스마트 코딩 인프라 셋업 및 오클랜드 프리미엄 모션 데스크 자가 피팅 제공" },
            { text: "주간 인디 게임 개발 일지 및 무료 모션 픽셀 아트 소스 배포 레터 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "게임 랩 라인업",
        subtitle: "두뇌 세포를 짜릿하게 응축하고 지적 모험을 자아내는 스튜디오 목록입니다.",
        content_data: {
          items: [
            {
              title: "2D 픽셀 아트 드로잉 훈련",
              description: "타블렛 위에 16x16 도트 바둑판 격자를 그리고 연필 도구로 기하학적인 칼 캐릭터 실루엣을 성형합니다.",
              icon: "Zap"
            },
            {
              title: "8비트 칩튠 사운드 메이킹",
              description: "고전 게임 팩 패미콤 기판 음원을 주파수로 코딩하여 뇌파 힐링 복고풍 효과음을 창작합니다.",
              icon: "Award"
            },
            {
              title: "로컬 인디 게임 해커톤 캠프",
              description: "매주 주말 1인 단독 폰 부스에 앉아 전 세계 개발자들과 밤새며 베타 빌드를 빌드업하는 축제입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "게임 개발은 단순히 코드를 작성하는 노동이 아닌, 내 머릿속 가상 우주의 기하학적 규칙을 컴퓨터 픽셀 화면 위에 정직하게 잉크로 수놓아 게이머와 소통하는 우아한 지적 예술입니다",
        subtitle: "모든 코딩 데이터는 유실 방지를 위해 실시간 깃허브 디지털 디지털 분산 원장으로 클라우드 동기화됩니다.",
        content_data: {
          description: "안녕하십니까. 픽셀바이브 독립 게임 스튜디오의 오너 개발 마스터입니다. 우리는 영혼 없이 겉만 번쩍거리고 무한 과금 결제만 유도하여 게이머의 뇌를 무기력하게 만드는 불량 게임 마피아를 단호히 거부합니다. 우리는 100% 무독성 필터 공기 가습 초소를 가동하고, 쾌적하고 위생적인 모션데스크 인프라를 가동하며, 지적인 게이머들의 놀이터를 수호하겠습니다.",
          stats: [
            { label: "등록 스팀 데모 다운로드 수", value: "3,500회" },
            { label: "구비된 전문 3D 스캐너", value: "2세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "은빛 모니터 랙 & 인디 코딩 벤치",
        subtitle: "사진 한 장만으로도 스마트한 코딩 에너지와 시크함이 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "듀얼 모니터가 켜진 1인 코딩 책상", description: "아늑한 핀 조명 아래 기계식 키보드와 픽셀 캐릭터가 켜진 맥북 모니터가 세련되게 세팅된 카운터", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린터가 꽂혀 있는 피규어 보관장", description: "도트 모양 플라스틱 캐릭터 장난감들이 선반에 정갈하게 진열된 아기자기하고 화사한 쇼케이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "기계식 키보드 청축 스위치 조립 스냅", description: "핀셋을 들고 스위치 알갱이 접합부에 윤활 에센스 오일을 칠해 타이핑 소리를 묵직하게 다듬는 장인의 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "베타 테스터 신청 및 제휴 문의",
        subtitle: "신작 인디 게임 베타 테스터 지원서, 고전 칩튠 음악 음원 유통 문의, 해커톤 룸 단체 예약은 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "게임 스튜디오 상담 예약"
        }
      }
    ]
  },

  escaperoom_adventure_quest: {
    templateId: "escaperoom_adventure_quest",
    name: "피어 브레이크 방탈출 에스케이프",
    category: "Entertainment",
    description: "인더스트리얼하고 묵직한 카본 블랙과 타오르는 긴급 구조 오렌지 주황, 그리고 기습적인 피 경고 레드 액센트로 방탈출 카페의 짜릿함과 퀴즈의 스릴을 전하는 테마입니다.",
    image: "/templates/escaperoom_adventure_quest.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ea580c",     // 긴급 구조 앰버 오렌지
        secondary: "#3f3f46",   // 낡은 시멘트 슬레이트 그레이
        accent: "#b91c1c",      // 기습 경고 혈액 레드
        background: "#09090b",  // 매트 서킷 블랙 지하실
        surface: "#18181b",     // 쇠창살 그릴 차콜 텍스처
        text: "#ffffff"         // 시인성 높은 완전 울트라 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "60분 카운트다운의 족쇄, 감옥 문을 쇠망치로 타격해 자물쇠 비밀번호를 해독하다",
        subtitle: "뻔하고 허술하여 실소만 유발하는 깡통 자물쇠 방탈출을 단호히 거부합니다. 피어 브레이크 방식으로, 고중량 카본 무쇠 비계 쇠창살과 가스 불꽃 연기가 피어오르는 무대 아래서, 단 1초의 오차 없이 센서 장치가 철컥 작동하며 문이 열리는 짜릿하고 신나는 오프라인 어드벤처 룸입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
          ctaText: "방탈출 테마 실시간 예약",
          ctaLink: "#contact",
          features: [
            { text: "아티스트가 직접 디자인한 미스테리 미스테리 소설 스토리 시나리오 시트 연동 몰입 보증" },
            { text: "비상시 0.1초 만에 수기 오픈 개방되는 안전 탈출 비상 스위치 및 피난 피난 유도선 상시 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에스케이프 프로그램",
        subtitle: "두뇌의 한계 경사도를 돌파하며 미소와 땀방울을 수확하는 스릴 목록입니다.",
        content_data: {
          items: [
            {
              title: "미스테리 밀실 탈출 60분",
              description: "어두운 지하실 방 안에 갇혀 손전등 하나로 벽면의 단서를 찾아 암호를 해독하는 메인 퀘스트입니다.",
              icon: "Zap"
            },
            {
              title: "자작나무 퍼즐 기어 셋업",
              description: "톱니바퀴 축 회전 비중을 조율해 문이 열리는 아날로그 공학 기하학 장치를 조립하는 클래스입니다.",
              icon: "Compass"
            },
            {
              title: "탈출 후 웰컴 비어 비어 파티",
              description: "탈출을 성공하거나 아쉽게 실패한 뒤 탭룸 라운지에 앉아 차가운 코로나 맥주를 흔드는 힐링입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "방탈출은 단순히 자물쇠 숫자를 맞추는 억지가 아닌, 60분이라는 제한된 시간 족쇄 속에서 동료들과 머리를 맞대고 지적인 논리로 위협을 돌파하는 지고한 우정의 직조입니다",
        subtitle: "모든 룸은 무단 감염을 완전히 0%로 차단하기 위해 고객 1팀 퇴실 즉시 스팀 소독을 성실 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 피어 브레이크 방탈출의 헤드 미캐닉 캡틴입니다. 우리는 자물쇠 하나가 열리지 않아 게임 몰입을 깨고 불쾌한 사후 서비스로 눈총을 유발하는 부실 매장들을 단호히 거부합니다. 우리는 야간 순찰용 고조도 무전기 무전기 세트를 상시 가동하고, 쾌적하고 위생적인 샤워 쉘터 인프라를 가동하며, 주민들의 따뜻하고 안전한 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 탈출 성공률", value: "24.5%" },
            { label: "보유 전문 테마 룸 수", value: "8개 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "감옥 쇠창살 & 지하실 암막 룸",
        subtitle: "사진 한 장만으로도 거친 쇳가루 냄새와 긴박감이 고스란히 전해지는 전경입니다.",
        content_data: {
          items: [
            { title: "철창 너머 스탠드 램프 조명", description: "어두운 회색 벽돌 틈새에 녹슨 무쇠 쇠사슬이 묶여 있고 주황색 램프 빛이 음영을 뿜는 방탈출 룸 거실 뷰", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80" },
            { title: "은빛 알루미늄 배선 전기 제어함", description: "회로 기판 스위치들이 정갈하게 진열되어 있고 타이머 시계가 노란 불꽃 빛을 발하는 테크니컬 초소", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "목재 톱니바퀴 기어 조립 스냅", description: "자작나무 판에 구멍을 파서 은 나사못으로 기어를 접합하고 손끝으로 기어 축 회전을 테스트하는 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "밀실 예약 및 제휴 문의",
        subtitle: "방문 예정 일시, 예약 룸 선택, 인원수(단체 룸 보유), 힌트 제한 사용 사전 동의 여부를 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "방탈출 테마 예약"
        }
      }
    ]
  },

  performing_arts_dance: {
    templateId: "performing_arts_dance",
    name: "리듬 앤 무브 현대 무용 극단",
    category: "Entertainment",
    description: "눈눈부시게 깨끗한 퓨어 화이트와 차분한 스톤 실버 그레이, 그리고 강렬한 캔버스 선홍빛 크림슨 레드 포인트로 현대 무용과 연극의 실루엣을 전하는 극단 테마입니다.",
    image: "/templates/performing_arts_dance.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#be123c",     // 런웨이 크림슨 로즈
        secondary: "#f3f4f6",   // 라이트 실버 메탈 그레이
        accent: "#18181b",     // 시크한 제트 블랙 슬레이트
        background: "#fafaf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 순백의 무대 바닥 화이트
        text: "#1f2937"         // 시인성 높은 스톤 슬레이트 차콜
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "몸짓 하나로 중력의 족쇄를 완전히 허물고, 순백의 무대 위를 비상하다",
        subtitle: "인위적으로 대본과 대사 대사만 외워 읊는 뻔한 연극을 단호히 거부합니다. 리듬 앤 무브 방식으로, 현대 무용가들의 고밀도 근육 수축과 이완의 입체 실루엣 드로잉, 그리고 3000K 스포트라이트 조명 아래서 뿜어내는 정직한 땀방울만으로 예술적 예술적 감동을 선사하는 비영리 현대 무용 극단입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 무용 공연 예매",
          ctaLink: "#contact",
          features: [
            { text: "한국 무용 협회 공인 수석 무용 아티스트들의 정밀 1:1 바디 무브먼트 연출" },
            { text: "시각적 소음을 원천 차단하는 완전 블랙 아치 가벽 시공의 하이엔드 전용 전시장 보유" }
          ]
        }
      },
      {
        section_type: "services",
        title: "무용 큐레이션",
        subtitle: "신체의 여백 위에 영혼의 숨결을 단단하게 수놓는 공연 예술 목록입니다.",
        content_data: {
          items: [
            {
              title: "현대무용 컨템포러리 아크",
              description: "관절의 제약을 덜어내고 몸통의 무게중심 이동을 통해 감정의 탄성을 무대 바닥 위에 붓처럼 드로잉합니다.",
              icon: "Zap"
            },
            {
              title: "인체 실루엣 포토 아카이브",
              description: "무대 조명의 방향을 사선 45도로 완전히 눕혀 무용수의 근육 윤곽선과 그림자를 흑백 카메라로 박제합니다.",
              icon: "Compass"
            },
            {
              title: "무용수 전용 웰빙 샐러드 팩",
              description: "공연 전후의 근육 회복을 돕는 유기농 참깨 오일 소고기 죽과 저분자 콜라겐 에센스 드링크 다이닝입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "무용은 예쁜 동작을 자랑하는 서커스가 아닌, 영혼의 기류를 내 몸이라는 물리적 흉터로 정직하게 번역하여 관객과 소통하는 숭고한 침묵의 예술입니다",
        subtitle: "모든 무대 바닥은 무용수 무릎 관절 보호를 위해 8층 탄성 우드 서스펜션 시공이 완비되어 안전합니다.",
        content_data: {
          description: "안녕하십니까. 리듬 앤 무브 극단의 수석 예술 감독입니다. 우리는 원단이 낡고 형태가 비틀어져 싼 티가 흘러넘치는 흔한 상업용 이벤트 댄스 스포츠 샵을 단호히 거부합니다. 우리는 매 시즌 창작 무용을 기획하고, 쾌적하고 위생적인 거울대 인프라를 가동하며, 당신의 예술적 지적 카리스마를 온전히 보좌하겠습니다.",
          stats: [
            { label: "누적 공연 관객 수", value: "8,500명 돌파" },
            { label: "보유 전문 무용 에디터", value: "6명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "순백의 무대 바닥 & 이젤 분장실",
        subtitle: "사진 한 장만으로도 상쾌한 맑음과 묵직한 땀방울이 고스란히 전해지는 전경입니다.",
        content_data: {
          items: [
            { title: "도약하는 무용수의 흑백 크래프팅", description: "하얀 무대 위에서 붉은 실크 천을 휘날리며 몸을 뒤트는 쾌적하고 생동감 넘치는 찰나 화보 컷", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80" },
            { title: "원목 거울대 가구 메이크업 코너", description: "아늑한 핀 조명이 얼굴을 비추고 섀도우 팔레트와 브러쉬 붓들이 정갈하게 정렬된 1인 단독 분장실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "장미 에센스 향수 스포이드 드롭 스냅", description: "투명한 윤기 앰플 한 방울 뚝 떨어져 은색 계량 비커 안에 물결 동심원을 퍼뜨리는 청결한 조리 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공연 티켓 예매 및 튜터링 상담",
        subtitle: "무용 공연 티켓 예매, 신입 단원 오디션 지원서, 주말 창작 무용 워크숍 신청서는 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "무용 극단 예약 신청"
        }
      }
    ]
  },

  // Now, let's write 11 to 20 to make exactly 20.
  // 9. anime_manga_lounge
  // 10. vr_cyber_arcade
  // 11. jazz_bar_live
  // 12. party_event_agency
  // 13. amusement_park_adventure
  // 14. esports_gaming_lounge
  // 15. film_production_agency
  // 16. musical_theater_broadway
  // 17. classic_orchestra_symphony
  // 18. retro_arcade_museum
  // 19. street_busking_union
  // 20. dj_electronic_club

  anime_manga_lounge: {
    templateId: "anime_manga_lounge",
    name: "오타쿠 하우스 애니메이션 아카이브",
    category: "Entertainment",
    description: "화사하고 매혹적인 네온 라즈베리 핑크와 맑고 깨끗한 아침 스카이 블루, 그리고 앰버 주황 액센트가 결합하여 2D 애니메이션과 희귀 만화 수집의 가치를 전하는 테마입니다.",
    image: "/templates/anime_manga_lounge.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#db2777",     // 네온 애니 핑크
        secondary: "#e0f2fe",   // 맑고 시원한 코코넛 블루
        accent: "#ea580c",      // 앰버 주황 불꽃
        background: "#090d16",  // 다크 스페이스 아카이브
        surface: "#111827",     // 은빛 알루미늄 책장 차콜
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오리지널 2D 셀화의 감동과, 내 손바닥 위에 안착하는 수제 피규어의 영혼",
        subtitle: "공장에서 나일론 실로 대량 찍어내어 겉만 번들거리는 싸구려 불량 인형을 단호히 거부합니다. 오타쿠 하우스 방식으로, 1990년대 일본 오리지널 애니메이션 아날로그 아날로그 셀화 액자 350점을 쇼룸 쇼룸 벽면에 정갈하게 안착하고, 3D 프린터로 피규어의 머리카락 각도를 0.1mm 단위로 재단하는 고품격 서브컬쳐 아카이브 라운지입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "희귀 셀화 갤러리 예약",
          ctaLink: "#portfolio",
          features: [
            { text: "일본 도쿄 아키하바라에서 아티스트가 직접 수거한 오리지널 보존판 단독 수입 보증서 완비" },
            { text: "아기가 깨물어도 유해 물질 물질 우려가 전혀 없는 무독성 아크릴 전시대 및 위생 필터링 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아카이브 프로그램",
        subtitle: "2D 만화와 내 손바닥 피규어를 안전하고 영롱하게 구원하는 소통 라인업입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 셀화 복원 클래스",
              description: "세월이 흘러 갈라진 아세테이트 쉘 원화 위에 수제 붓질 천연 아크릴 염료를 가해 보존 코팅을 입힙니다.",
              icon: "Sparkles"
            },
            {
              title: "3D 프린팅 수제 피규어 조소",
              description: "태블릿 화면에 3D 피규어 모델 형틀을 그리고 3D 프린터 기기로 얼굴 윤곽과 턱선을 사출 성형합니다.",
              icon: "Zap"
            },
            {
              title: "비건 명상 차도 수제 살롱",
              description: "피팅을 마친 뒤 유기농 국산 카모마일 꽃잎 드링크와 달콤한 초콜릿 퐁듀를 마시는 아늑한 대기실입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "애니메이션은 단순히 어린이용 만화가 아닌, 2차원 평면 위에 물감 잉크와 사운드를 입혀 인간 영혼의 가장 무한한 상상력을 비행시키는 숭고한 생동감의 과학입니다",
        subtitle: "모든 룸은 일주일에 한 번 천연 편백 피톤치드 방역 소독과 카드 팩 위생 먼지 세척을 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 오타쿠 하우스 아카이브의 캡틴 원장 대표입니다. 우리는 불법 짝퉁 저질 인형을 섞어 팔고 어수선하여 머리가 아픈 저가 만화카페를 단호히 거부합니다. 우리는 100% 공인 정품 인증 차트와 피규어 수기 가공 기록을 공개하며, 쾌적하고 위생적인 거울대 인프라를 가동해 당신의 지적 지적 매니아 쉼터를 지켜내겠습니다.",
          stats: [
            { label: "수집 완료 오리지널 셀화", value: "350점 완비" },
            { label: "정기 갤러리 아카이브 회원", value: "1,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "오리지널 2D 셀화 쇼룸 & 3D 프린터실",
        subtitle: "보는 것만으로도 오감이 아기자기하게 꼬리치는 뷰티 공간 전경입니다.",
        content_data: {
          items: [
            { title: "아크릴 액자 가득한 화이트 쇼케이스", description: "아늑한 핀 조명 아래 오리지널 애니메이션 그림들이 보석처럼 빛나는 세련되게 세팅된 갤러리 코너", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린팅 피규어 조각 기계 렉", description: "은빛 알루미늄 프린터 노즐 끝에서 핑크빛 수지가 적재되어 기하학적인 로봇 다리가 성형되는 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 마카롱과 웰컴 드링크 스냅", description: "원목 테이블 위에 알록달록한 꼬끄 비즈 쿠키들과 파란 자스민 차 한 잔 데코레이션 스냅 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원화 갤러리 예약 및 3D 피규어 상담",
        subtitle: "원화 룸 방문 예정 일시, 피규어 3D 프린팅 주문 상담, 후원금 기부 영수증 발행 신청서를 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아카이브 룸 예약"
        }
      }
    ]
  },

  vr_cyber_arcade: {
    templateId: "vr_cyber_arcade",
    name: "네오 매트릭스 VR 사이버 아케이드",
    category: "Entertainment",
    description: "미래적인 일렉트릭 일렉트릭 네온 레몬과 묵직한 카본 서킷 블랙, 은빛 알루미늄 실버 액센트로 가상 현실 아케이드 게임의 테크놀로지를 전하는 테마입니다.",
    image: "/templates/vr_cyber_arcade.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#eab308",     // 사이버 형광 네온 옐로우
        secondary: "#1f2937",   // 묵직한 도로 카본 그레이
        accent: "#10b981",      // 테크 에메랄드 그린
        background: "#090d16",  // 미래적인 다크 매트릭스
        surface: "#111827",     // 은빛 알루미늄 프레임 차콜
        text: "#ffffff"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "망막에 주사되는 4K 가상 우주의 광원과, 중력을 거부하는 햅틱 윈치의 도약",
        subtitle: "어지럼증을 유발하고 해상도가 낮아 싼 티가 흐르는 흔한 저가 VR 체험방을 단호히 거부합니다. 네오 매트릭스 방식으로, 오클러스 프로 VR 헤드셋 장비와 모션 시뮬레이터, 그리고 손끝 마찰 각도를 0.1mm 오차 없이 진동으로 전수하는 햅틱 가죽 가죽 슈트를 완비하여 시야각 120도로 우주 비행사가 되는 미래 아케이드 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
          ctaText: "VR 어트랙션 자유이용권 예매",
          ctaLink: "#contact",
          features: [
            { text: "지연 속도(Latency) 0.01밀리초 이하 고성능 서킷 보드 그래픽 가동으로 어지럼증 원천 차단" },
            { text: "체크인 시 가상 비행사 맞춤 안면 보호용 천연 린넨 패드 및 웰컴 디톡스 오렌지 에이드 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "사이버 프로그램",
        subtitle: "중력과 중성 부력의 법칙을 가볍게 조롱하며 가상 우주를 개척하는 기술 목록입니다.",
        content_data: {
          items: [
            {
              title: "4K 우주 비행 시뮬레이터",
              description: "모션 체어에 앉아 무중력 상태 속에서 적군 전투기 포탑을 겨냥해 미사일 화염을 뿜어내는 가상 전쟁 퀘스트입니다.",
              icon: "Zap"
            },
            {
              title: "햅틱 가죽 슈트 피팅 클래스",
              description: "전신 근육 수축 상태에 맞춰 전기 신호 충격을 미세 배정하여 실제 총알 충격을 피부 피부 체감하는 슈트입니다.",
              icon: "Compass"
            },
            {
              title: "사이버 가상 칵테일 바 라운지",
              description: "체험을 마친 뒤 네온 램프가 반짝이는 철제 바 테이블에 앉아 하이볼 코로나 맥주를 들이켜는 소통 펍입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "가상 현실은 단순히 눈을 속이는 유흥이 아닌, 인간의 시각과 청각, 후각 세포 전원을 디지털 코드로 재단하여 물리적 신체의 경계를 무한으로 해킹하는 미래 과학의 개척입니다",
        subtitle: "모든 기기와 VR 헤드셋 안면 접촉부는 피부 위생을 위해 당일 사용 즉시 알코올 멸균을 성실 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 네오 매트릭스 아케이드의 총지배인 미캐닉입니다. 우리는 낡은 장비를 대충 씌워주고 안경 코 통증과 두통을 조장하는 저가 상업용 오락실을 단호히 거부합니다. 우리는 생두 원두를 볶아 커피 바를 가동하고, 쾌적하고 위생적인 샤워 쉘터 인프라를 가동하며, 미래지향적 크루들의 안전과 영롱한 주말 힐링을 보좌하겠습니다.",
          stats: [
            { label: "누적 우주 가상 비행 수", value: "12,000회" },
            { label: "보유 전문 모션 시뮬레이터", value: "8세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "사이버 네온 폰 부스 & VR 체험 존",
        subtitle: "사진 한 장만으로도 짜릿한 에너지와 시크함이 고스란히 전해지는 미래 전경입니다.",
        content_data: {
          items: [
            { title: "VR 헤드셋을 쓴 모델의 스냅", description: "사이버 그린 배경 아래 링 라이트 빛을 받으며 우주 조종 간을 움켜쥐고 전력 질주하는 무대 뷰", image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80" },
            { title: "은빛 알루미늄 기어 모션 체어실", description: "특수 유압 쇼크 옵쇼버 실린더가 세련되게 정렬되어 테크니컬한 멋을 뿜는 아케이드 조립 룸 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "네온 칵테일 유리 컵 믹싱 스냅 스냅", description: "원목 테이블 위에 에메랄드 리큐어 하이볼 드링크 잔과 레몬 슬라이스 가니쉬 데코 스냅 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "체험권 예매 및 대관 예약 신청",
        subtitle: "방문 예정 일시, 예약 룸 선택, 인원수, 햅틱 슈트 사이즈(S/M/L)를 기재해 예약 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "가상현실 예약 완료"
        }
      }
    ]
  },

  jazz_bar_live: {
    templateId: "jazz_bar_live",
    name: "블루 노트 라이브 재즈 바",
    category: "Entertainment",
    description: "은은하고 고풍스러운 다크 와인 버건디와 차분한 샴페인 브론즈 골드, 맑은 석고 베이지 배합으로 아늑한 재즈 공연과 스페셜 와인을 안내하는 럭셔리 재즈 라운지 테마입니다.",
    image: "/templates/jazz_bar_live.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#4c0519",     // 매혹적인 프랑스 딥 버건디
        secondary: "#fdf8f5",   // 맑고 깨끗한 린넨 아이보리
        accent: "#c5a880",      // 무광 브론즈 골드
        background: "#0f0507",  // 어두운 아날로그 서재 다크와인
        surface: "#1e1114",     // 클래식 가죽 의자 다크 브라운
        text: "#f5ebe0"         // 가독성 높은 소프트 크림 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "색소폰 숨결 속 피어나는 깊은 고독과, 붉은 와인 한 잔이 빚는 밤의 앙상블",
        subtitle: "시끄러운 테크노 기어 굉음 일색의 흔한 상업용 클럽을 단호히 거부합니다. 블루 노트 방식으로, 뉴욕 브로드웨이 정통 재즈 피아니스트들의 즉흥 세일링 콘서트와, 프랑스 그랑크뤼 등급 부티크 와인, 그리고 촛불 하나만 켜둔 안락한 가죽 가죽 가구 라운지에서 깊은 침묵과 소통을 선사하는 하이엔드 라이브 재즈 바입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1486591978090-58e619d37fe7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금주 콘서트 티켓 예매",
          ctaLink: "#contact",
          features: [
            { text: "화학 무보존제 내추럴 와인과 보르도 카베르네 소비뇽 등 최고급 보틀 리스트 85종 상시 구비" },
            { text: "아티스트가 직접 디자인한 촛불 조명 테이블과 10만 와트 하향식 음향 입체 덕트 필터 시공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "재즈 라운지 큐레이션",
        subtitle: "와인의 산도와 색소폰 멜로디에 완벽히 동조되는 타파스 플레이트 목록입니다.",
        content_data: {
          items: [
            {
              title: "이베리코 하몽 & 멜론 플레이팅",
              description: "36개월 숙성된 이베리코 하몽 생햄과 잘 익은 달콤한 멜론 위에 천연 올리브 오일을 살짝 토핑했습니다.",
              icon: "Heart"
            },
            {
              title: "그릴드 무화과 & 브리 치즈 치즈",
              description: "오븐에 구워 따스한 브리 치즈 위에 야생 무화과와 메이플 시럽, 아몬드 슬라이스를 얹은 안주 요리입니다.",
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
        title: "재즈는 악보대로 치는 기교가 아닌, 무대 위 뮤지션들이 서로의 눈빛과 호흡 템포에 맞춰 즉흥적으로 음표를 쪼개어 가며 내면의 자유를 포효하는 시간의 위대한 예술입니다",
        subtitle: "모든 와인은 산화 방지를 위해 14도 일정한 셀러 온도의 동굴 와인 저장고에서 보존됩니다.",
        content_data: {
          description: "안녕하십니까. 블루 노트 라이브 재즈 바의 수석 소믈리에입니다. 우리는 시중 마트의 싸구려 화학 보존제 첨가 와인이나 두통을 유발하는 화학 드링크 샵을 단호히 거부합니다. 포도가 자란 프랑스 대지의 흙빛 아로마와 살아있는 효모의 신선함을 잔에 담아내고, 촛불 하나만 켜둔 고요한 룸에서 당신만의 은밀한 대화와 힐링을 보좌하겠습니다.",
          stats: [
            { label: "보유 프랑스 수입 와인 수", value: "85가지" },
            { label: "정회원 재즈 매니아 수", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "동굴 와인 셀러 & 촛불 재즈 무대",
        subtitle: "사진 한 장만으로도 깊은 낭만과 차분함을 안겨주는 블루 노트 내부 전경입니다.",
        content_data: {
          items: [
            { title: "아늑한 1인 벨벳 소파 피팅석", description: "어두운 목조 벽면 코너에 촛불 하나와 와인 글라스 컵, 그리고 치즈 플레이트가 세련되게 세팅된 테이블", image: "https://images.unsplash.com/photo-1486591978090-58e619d37fe7?auto=format&fit=crop&w=600&q=80" },
            { title: "유광 아크릴 와인 쇼케이스 선반", description: "보틀 라벨의 세련된 라벤더 아트를 감상하며 당일 시음할 와인을 고르는 럭셔리 저장실 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "색소폰 구금 접합 금속 조리 스냅", description: "원목 테이블 위에 황동 밸브 가죽 패드를 오일로 주유하여 색소폰 음압 진동을 정교하게 튜닝하는 스틸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "재즈 테이블 및 단체 룸 예약",
        subtitle: "방문 예정 일시, 예약 룸 선택, 인원수, 와인 콜키지 추가 신청 여부, 그리고 선호하시는 뷰티 와인 취향을 적어 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "재즈 테이블 예약"
        }
      }
    ]
  },

  party_event_agency: {
    templateId: "party_event_agency",
    name: "파티 메카 페스티벌 기획사",
    category: "Entertainment",
    description: "활기차고 에너제틱한 네온 선셋 오렌지와 청량한 파도 민트 블루, 맑은 오프화이트 조합이 대형 축제와 프라이빗 파티 기획을 유쾌하게 안내하는 테마입니다.",
    image: "/templates/party_event_agency.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ea580c",     // 타오르는 축제 선셋 오렌지
        secondary: "#ccfbf1",   // 시원하고 맑은 민트 블루
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
        title: "상상 속 꿈꾸던 축제의 환상을 현실의 무대 위로 유쾌하게 소환하다",
        subtitle: "현수막 하나 걸어놓고 마이크로 떠드는 어설프고 지루한 동네 기업 행사를 단호히 거부합니다. 파티 메카 방식으로, 프랑스제 대형 돔 텐트와 비치 선셋 샹들리에 조명, 그리고 일생 단 한 번뿐인 감동적인 기업 야외 페스티벌과 프라이빗 생일 파티를 기획 오프닝하는 축제 전문 대행사입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 축제 포트폴리오",
          ctaLink: "#portfolio",
          features: [
            { text: "10만 와트 초고출력 사운드 앰프 및 하향식 방음 덕트 공사 특허 기술 보유 기획단 직접 참여" },
            { text: "체크인 시 웰컴 드링크 맥주 한 병 무상 렌탈 및 파티 마스크 선물 패키지 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "파티 메카 큐레이션",
        subtitle: "모르는 이들과 기분 좋게 믹싱되며 인생 최고의 낭만을 폭발시키는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "야외 비치 페스티벌 기획",
              description: "모래사장 위에 2미터 높이 안전 펜스를 치고 대형 목조 무대와 모닥불 파이어피트를 셋업하는 풀코스 대행입니다.",
              icon: "Flame"
            },
            {
              title: "프라이빗 럭셔리 살롱 파티",
              description: "고급 호텔 대관 살롱 룸 안에 실크 암막 린넨 소파와 디저트 타워 식기를 세팅하는 기획입니다.",
              icon: "Heart"
            },
            {
              title: "로컬 버스킹 밴드 섭외",
              description: "재즈 피아노, 일렉 기타, 보컬 아티스트들을 행사 성격에 맞게 0.1% 오차 없이 맞춤 섭외 조율합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "축제 기획은 단순히 무대를 짓는 토목 노이즈가 아닌, 참가자들의 심장 박동과 앰버 조명의 각도를 하나로 융화하여 평생의 가장 아름다운 영혼의 축제를 빚어내는 공간의 예술입니다",
        subtitle: "모든 시술 기구와 텐트는 위생을 위해 당일 사용 즉시 스팀 소독 및 멸균을 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 파티 메카의 총괄 캡틴 마스터 대표입니다. 우리는 말만 대행사라 하고 유행하는 스타일만 대충 카피해 어수선한 동네 체육대회를 조장하는 저가 업체들을 단호히 거부합니다. 우리는 프랑스 수입 특수 돔 텐트를 독점 가동하며, 소리 없이 물살을 가르는 요트 마리나 라운지 같은 웰니스를 구현하겠습니다.",
          stats: [
            { label: "기획 완료 대형 축제 수", value: "350회 돌파" },
            { label: "보유 수입 특수 돔 텐트", value: "8세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "눈부신 야외 축제 & 선셋 파티",
        subtitle: "하얀 선체와 파란 바다의 색상 대비가 압도적인 인생 샷 갤러리 전경입니다.",
        content_data: {
          items: [
            { title: "노을을 배경으로 건배하는 단원들", description: "코발트 바다 해안가 위에 설치된 꼬마 전구 전등 아래서 환하게 웃고 있는 쾌적하고 럭셔리한 파티 찰나", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" },
            { title: "3단 은식기 디저트 타워 플레이트", description: "마카롱과 타르트지가 샹들리에 조명 아래서 보석처럼 세팅된 아기자기하고 화사한 원내 디저트 바", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 시푸드 구이와 샴페인 스냅", description: "원목 테이블 위에 올리브 오일 가니쉬 랍스터 구이와 거품 가득한 화이트 와인 잔 데코 스냅 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "축제 기획 문의 및 견적 상담",
        subtitle: "행사 예정 일시, 예약 룸(독채 크루즈/개인 티켓), 인원 수, 선상 바비큐 디너 신청 여부를 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "축제 기획 상담 신청"
        }
      }
    ]
  },

  amusement_park_adventure: {
    templateId: "amusement_park_adventure",
    name: "판타지아 아일랜드 테마파크",
    category: "Entertainment",
    description: "사랑스럽고 따스한 파스텔 피치 베이지와 맑고 위생적인 민트 그린, 그리고 크래프트 오프화이트 조화가 가족들과의 놀이동산 여행을 돕는 테마파크 테마입니다.",
    image: "/templates/amusement_park_adventure.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#15803d",     // 깨끗한 천연 잔디 그린
        secondary: "#fef08a",   // 안락한 바나나 옐로우
        accent: "#ea580c",      // 네온 오렌지 매직 캐슬
        background: "#fafcfb",  // 맑고 깨끗한 아침 공기 오프화이트
        surface: "#ffffff",     // 위생적인 매표소 타일 화이트
        text: "#1c2317"         // 눈이 편안한 올리브 브라운 차콜
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "눈앞에 파노라마로 펼쳐지는 마법의 회전목마와, 지평선 너머 솟구치는 기구의 모험",
        subtitle: "복잡하고 대기 줄만 2시간에 주차조차 안 되어 짜증을 유발하는 흔한 놀이동산을 단호히 거부합니다. 판타지아 아일랜드 방식으로, 전동 논슬립 무균 휠체어 전용 이동 레인과 전문 안전 가드를 상시 배치하고, 수제 멍푸치노 웰컴 패키지를 완비한 대한민국 최고 등급의 웰니스로 가족의 미소를 수호하는 친환경 테마파크입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1513885049090-a08e4a7a634e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "테마파크 자유이용권 예매",
          ctaLink: "#contact",
          features: [
            { text: "아동 성범죄 성폭력 발생률 0건 유지를 위해 2미터 보안 펜스 및 전 구역 위생 위생 CCTV 탑재" },
            { text: "체크인 시 미세먼지 차단 마스크 및 유기농 국산 카모마일 아동 바스 솔트 패키지 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "어드벤처 프로그램",
        subtitle: "아이들의 여린 모험심을 안전하고 기품 있게 단련하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "회전목마 오르골 클래스",
              description: "아날로그 기어 톱니바퀴 축 회전 비중을 직접 조율하여 예쁜 나무 오르골 음악 상자를 조립 완성합니다.",
              icon: "Zap"
            },
            {
              title: "300평 프라이빗 잔디 구장",
              description: "펜스가 안전하게 둘러쳐져 목줄 없이 흙과 풀 내음을 맡으며 온 가족이 보물찾기 소풍을 즐깁니다.",
              icon: "Leaf"
            },
            {
              title: "수제 수제 단호박 와플 플레이팅",
              description: "전문 파티시에가 아침에 갓 굽는 와플 위에 메이플 시럽과 제철 베리를 얹어 아동 간식을 배달합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "테마파크는 단순히 기구를 타는 오락이 아닌, 대지 위에서 아이들의 자율적인 지적 호기심과 가족의 땀방울을 하나로 융화하여 평생 대를 이어 기억할 낭만적 유산을 빚어내는 온정의 물리학입니다",
        subtitle: "모든 룸은 일주일에 한 번 천연 편백 피톤치드 방역 소독과 린넨 멸균 청소를 성실 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 판타지아 아일랜드의 오너 디렉터 마스터입니다. 우리는 말만 테마파크라 하고 바닥 문턱 조차 넘지 못하게 방치하는 전시용 행정 오락실을 단호히 거부합니다. 우리는 100% 무독성 필터 공기 가습 초소를 가동하고, 쾌적하고 위생적인 샤워 쉘터 인프라를 가동하며, 주민들의 따뜻하고 안전한 안식을 수호하겠습니다.",
          stats: [
            { label: "방문한 해피 어린이 수", value: "3,500명+" },
            { label: "보유 전문 모션 시뮬레이터", value: "8세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "화사한 마법 성 & 야외 잔디 구장",
        subtitle: "보는 것만으로도 행복 호르몬이 가득 전해지는 우아한 공간 갤러리입니다.",
        content_data: {
          items: [
            { title: "석조 아치 너머 회전목마 뷰", description: "아늑한 3면 간접 조명 아래 하얀 회전목마들이 예쁘게 세팅되어 아이들이 놀기 좋은 프라이빗 거실", image: "https://images.unsplash.com/photo-1513885049090-a08e4a7a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "편백나무 가구 야외 족욕 탕 코너", description: "따스한 김이 모락모락 솟아오르고 대나무 화분들과 조화를 이루어 간병 부모 피로를 리셋하는 탕", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "와플과 웰컴 멍푸치노 드링크 스냅", description: "원목 테이블 위에 갓 굽는 단호박 와플 플레이트와 아동 주스 한 잔 데코레이션 스냅 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "가족 패키지 예매 및 단체 상담",
        subtitle: "방문 예정 일시, 예약 룸 선택, 인원수(가족 모임 등), 선호하시는 코스 유무를 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "테마파크 예약 신청"
        }
      }
    ]
  },

  esports_gaming_lounge: {
    templateId: "esports_gaming_lounge",
    name: "하이퍼 아레나 e스포츠 게이밍 라운지",
    category: "Entertainment",
    description: "스마트하고 이지적인 슬레이트 메탈 그레이와 세련된 미드나잇 사이버 오렌지 골드 액센트로 프로 e스포츠 게이밍과 스트리밍의 가치를 전하는 테마입니다.",
    image: "/templates/esports_gaming_lounge.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#18181b",     // 시크한 제트 블랙 슬레이트
        secondary: "#e4e4e7",   // 알루미늄 메탈 그레이
        accent: "#ea580c",      // 핫 스포트 오렌지 골드
        background: "#09090b",  // 미니멀 시티 다크 나이트
        surface: "#27272a",     // 모니터 랙 메탈 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "초당 240프레임 은빛 휠셋 레이싱의 그래픽과, 동공 자극 없는 커브드 모니터",
        subtitle: "인터넷이 끊기고 의자가 불편해 허리 통증을 유발하는 싸구려 PC방을 단호히 거부합니다. 하이퍼 아레나 방식으로, 지연 시간 0.01ms 이하 RTX 4090 그래픽 탑재 수입 튜닝 컴퓨터 컴퓨터 24대와 에르고노믹스 스마트 의자, 그리고 무제한 스페셜티 드링크 바를 가동해 프로 프로 게이머들의 승리를 보장하는 하이엔드 게이밍 라운지입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프로 게이밍 고정석 예약",
          ctaLink: "#services",
          features: [
            { text: "시력 피로를 원천 차단하는 플리커 프리 기술과 3000K 눈부심 방지 간접 조명 전용 설계 설계" },
            { text: "체크인 시 가죽 폰 부스 1인 방음실 줌 미팅 및 스트리밍 방송 송출 인프라 무료 무료 이용" }
          ]
        }
      },
      {
        section_type: "services",
        title: "게이밍 랩 프로그램",
        subtitle: "두뇌 세포와 안면 근육 수축 상태를 고밀도로 서포트하는 웰빙 라인업입니다.",
        content_data: {
          items: [
            {
              title: "e스포츠 리그 해커톤 세션",
              description: "멘토 코치와 멘티 청소년이 짝을 이루어 리그오브레전드 등 전략 게임 마우스 탭핑을 연습하는 코스입니다.",
              icon: "Zap"
            },
            {
              title: "3D 그래픽 피규어 코딩",
              description: "원내 3D 프린터를 가동하여 나만의 얼굴 윤곽선이 새겨진 픽셀 캐릭터 인형을 사출하는 조소 공방입니다.",
              icon: "Sparkles"
            },
            {
              title: "수제 에스프레소 에너지 드링크",
              description: "뇌하수체 활성화를 돕기 위해 에티오피아 원두로 볶아 낸 아이스 아메리카노와 무설탕 귀리 브레드입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "e스포츠는 단순히 게임을 즐기는 오락이 아닌, 키보드라는 기계적 물성과 인간의 순발력 뇌파를 0.01초 단위로 융화하여 승리를 개척해 나가는 지적인 디지털 스포츠입니다",
        subtitle: "모든 컴퓨터 본체와 기어는 위생을 위해 당일 사용 즉시 알코올 멸균을 성실 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 하이퍼 아레나의 총지배인 미캐닉입니다. 우리는 낡은 장비를 대충 빌려주고 게임 끊김으로 눈총을 유발하는 불량 PC방들을 단호히 거부합니다. 우리는 100% 무독성 필터 공기 가습 초소를 가동하고, 쾌적하고 위생적인 모션데스크 인프라를 가동하며, 지적인 라이더들의 안전과 영롱한 주말 힐링을 보좌하겠습니다.",
          stats: [
            { label: "방문자 승률 상승 평균치", value: "85%" },
            { label: "보유 스마트 모션데스크", value: "24석 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "사이버 네온 폰 부스 & 레이싱 벤치",
        subtitle: "사진 한 장만으로도 짜릿한 에너지와 시크함이 고스란히 전해지는 미래 전경입니다.",
        content_data: {
          items: [
            { title: "240Hz 모니터가 켜진 게이밍 책상", description: "아늑한 핀 조명 아래 은빛 기계식 키보드가 세련되게 세팅된 크루 전용 바 카운터 뷰", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린팅 피규어 조각 기계 렉", description: "은빛 알루미늄 프린터 노즐 끝에서 수지가 적재되어 기하학적인 로봇 다리가 성형되는 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "에스프레소 드링크 유리 컵 데코", description: "원목 테이블 위에 에스프레소 카푸치노 한 잔과 섀도우 콤팩트, 그리고 붉은 입장 티켓 스냅 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "게이밍 고정석 예약 및 대관",
        subtitle: "방문 예정 일시, 예약 룸 선택, 인원수, 햅틱 슈트 사이즈(S/M/L)를 기재해 예약 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "게이밍 라운지 예약"
        }
      }
    ]
  },

  film_production_agency: {
    templateId: "film_production_agency",
    name: "시네마틱 프레임 영상 제작사",
    category: "Entertainment",
    description: "시크한 모노톤 블랙과 맑은 석고 화이트, 무광 브론즈 골드가 어우러져 광고 및 다큐멘터리 영상 제작의 지적인 룩을 전하는 테마입니다.",
    image: "/templates/film_production_agency.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#18181b",     // 시크한 슬레이트 블랙
        secondary: "#f4f4f5",   // 라이트 매트 실버 그레이
        accent: "#c5a880",      // 무광 브론즈 골드 스포트
        background: "#fafaf9",  // 정갈한 석고 화이트 미색
        surface: "#ffffff",     // 캔버스 아크릴 프레임 화이트
        text: "#09090b"         // 시인성 높은 제트 블랙
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "1초에 24프레임, 그 찰나의 빛과 어둠의 3중주로 기업의 본질을 조각하다",
        subtitle: "핸드폰으로 대충 흔들리게 찍어 편집하는 가볍고 싼 티 나는 공장제 유튜브 영상을 단호히 거부합니다. 시네마틱 프레임 방식으로, 할리우드 수입 레드(RED) 시네마 카메라와 아날로그 수기 편집 툴킷, 그리고 3000K 간접 조명 스포트라이트 아래서 영상의 명암 대비를 0.1g 단위로 다스려 하나의 걸작 예술로 승화시키는 프리미엄 영상 프로덕션입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "기업 광고 포트폴리오 룩북",
          ctaLink: "#services",
          features: [
            { text: "시각 소음을 정밀 차단하는 미술관 전용 매립 레일 조명 각도 시뮬레이션 매뉴얼 탑재" },
            { text: "촬영 전 수석 시나리오 작가단의 1:1 브랜드 스토리 기획 시트 작성 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "프로덕션 에센셜",
        subtitle: "브랜드의 가치를 지적으로 수확하고 대중을 설득하는 영상 기획 목록입니다.",
        content_data: {
          items: [
            {
              title: "시네마틱 4K 브랜드 필름",
              description: "할리우드 영화 촬영용 아나모픽 렌즈로 시네마스코프 비율 2.39:1의 압도적인 화면 압축과 색감을 빚어냅니다.",
              icon: "Award"
            },
            {
              title: "아날로그 다큐멘터리 촬영",
              description: "인공 조명을 배제하고 오직 맑은 아침 채광과 촛불 불꽃만으로 인물의 정직한 표정을 기록하는 필름입니다.",
              icon: "Compass"
            },
            {
              title: "수제 영상 편집 살롱",
              description: "음악 비트 템포에 맞춰 프레임 컷 전환 시각을 0.01초 단위로 조율하여 심장 박동과 공명시키는 편집입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "영상 제작은 단순히 촬영 버튼을 누르는 노동이 아닌, 렌즈라는 창문을 통해 세상을 보는 작가의 지적인 철학과 시선을 필름 속에 정직하게 박제하는 빛의 물리학입니다",
        subtitle: "모든 촬영 카메라는 먼지 유입 방지를 위해 클린룸 살균 챔버 안에서 엄격하게 위생 보존됩니다.",
        content_data: {
          description: "안녕하십니까. 시네마틱 프레임 프로덕션의 수석 감독 디렉터입니다. 우리는 앞사람 머리에 가려 자막이 안 보이고 대충 짜집기하여 기업 이미지를 훼손하는 저질 바이럴 마케팅을 단호히 거부합니다. 우리는 100% 무독성 필터 공기 가습 초소를 가동하고, 쾌적하고 위생적인 거울대 인프라 속에서 당신의 브랜드 자존심을 예술로 증명하겠습니다.",
          stats: [
            { label: "기획 완료 기업 필름 수", value: "240편 돌파" },
            { label: "보유 독일 수입 시네 렌즈", value: "14종 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "은빛 카메라 랙 & 아날로그 영사 편집실",
        subtitle: "사진 한 장만으로도 깊은 숲속 정서적 고독과 힐링이 번져나는 아우라 갤러리입니다.",
        content_data: {
          items: [
            { title: "레드 시네마 카메라가 놓인 쇼룸", description: "하얀 석고 조형물 옆에 디스플레이된 카메라 바디가 사선 햇살을 받아 우아하게 선명함을 뽐내는 순간", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80" },
            { title: "원목 가구 매립형 컴퓨터 편집대", description: "손잡이 없는 히든 서랍장과 콘센트가 깔끔하게 숨겨진 스마트하고 지적인 1인 작업 벤치 존", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "슬라이딩 무대 조명 샹들리에 스냅", description: "무대 위 스포트라이트 조명이 은빛 레일을 타고 사선으로 빛줄기를 뿜어내며 실루엣을 만드는 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "영상 제작 상담 및 기획 견적 문의",
        subtitle: "제작 목적(기업광고/다큐/숏폼), 희망 촬영 일정, 예산 범위, 시나리오 작가단 섭외 여부를 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "영상 제작 상담 신청"
        }
      }
    ]
  },

  musical_theater_broadway: {
    templateId: "musical_theater_broadway",
    name: "쇼타임 브로드웨이 뮤지컬 극단",
    category: "Entertainment",
    description: "화사하고 매혹적인 네온 라즈베리 핑크와 기품 있는 크림 골드, 맑은 석고 베이지 배합으로 대형 뮤지컬 정보와 티켓 예매를 연출하는 극장 테마입니다.",
    image: "/templates/musical_theater_broadway.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#be123c",     // 런웨이 라즈베리 핑크
        secondary: "#ffe4e6",   // 맑고 눈부신 로즈 크림
        accent: "#d4af37",      // 샹페인 브론즈 골드
        background: "#0f0507",  // 어두운 아날로그 살롱 다크와인
        surface: "#1e1114",     // 클래식 가죽 의자 다크 브라운
        text: "#f5ebe0"         // 가독성 높은 소프트 크림 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "웅장한 오케스트라 선율 속 솟구치는 가창력과, 무대 위 춤추는 순백의 요정",
        subtitle: "녹음된 반주 기어 MR을 틀어놓고 립싱크나 하는 뻔한 대학로 가성비 연극을 단호히 거부합니다. 쇼타임 방식으로, 뉴욕 브로드웨이 라이센스 정통 대형 뮤지컬 극단 100% 라이브 오케스트라 연주와, 천연 비단 린넨 한 땀 한 땀 장인이 바느질한 무대 의상 비즈, 그리고 80인조 배우들의 경이로운 가창력으로 전율의 감동을 선사하는 뮤지컬 극장입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
          ctaText: "뮤지컬 VIP 티켓 예매",
          ctaLink: "#contact",
          features: [
            { text: "한국 뮤지컬 협회 공인 최고 최고 메이저 배우들의 무대 직접 출연 및 라이브 가창 보증" },
            { text: "시각적 소음을 원천 차단하는 완전 3면 거대 거울대 및 샹들리에 조명 전용 설계 살롱 쇼룸" }
          ]
        }
      },
      {
        section_type: "services",
        title: "뮤지컬 프로그램",
        subtitle: "생명의 핏줄 핏줄을 안전하고 기품 있게 연결하여 이웃을 구원하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "순백의 오리지널 뮤지컬 쇼",
              description: "은은한 우유 빛 무광택 드레스 레이스를 100% 휘날리며 오케스트라 사운드와 하나 되는 전율의 무대입니다.",
              icon: "Award"
            },
            {
              title: "백스테이지 분장실 투어 투어",
              description: "공연 시작 전 주연 배우들의 메이크업 전용 대리석 거울대 테이블과 의상 보관실을 구경하는 웰니스 투어입니다.",
              icon: "Compass"
            },
            {
              title: "배우 친필 사인 포스터 증정",
              description: "관람을 마친 뒤 로비에서 배우들과 기념사진을 촬영하고 이니셜 은빛 실링 왁스가 박제된 책자를 받습니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "뮤지컬은 단순히 주말에 웃고 즐기는 오락이 아닌, 대형 오케스트라의 웅장한 진동 속에 인간 영혼의 슬픔과 기쁨을 80명의 목소리로 합창하여 전율의 눈물을 선물하는 생명의 거룩한 축제입니다",
        subtitle: "모든 공연석은 관람 몰입을 위해 스피커 오차 없는 하향식 음향 배치를 고수하여 귀 자극을 방지합니다.",
        content_data: {
          description: "안녕하십니까. 쇼타임 브로드웨이 극단의 총지배인 소믈리에입니다. 우리는 낡은 장비를 대충 빌려주고 부츠 발 통증을 유발하여 소중한 주말 여행을 망치는 불량 대여소를 단호히 거부합니다. 우리는 프랑스 황실 명가 프랑스 아로마 오일만을 독점 공수하며, 촛불 하나만 켜둔 안락한 동굴 살롱 속에서 당신의 깊은 지적인 안식을 책임지고 돌보겠습니다.",
          stats: [
            { label: "만족한 VIP 관객 커플 수", value: "3,500쌍+" },
            { label: "보유 수입 명품 무대 의상", value: "85종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "순백의 무대 비즈 & 3면 입체 거울대",
        subtitle: "보는 것만으로도 행복 호르몬과 기품이 가득 전해지는 우아한 공간 갤러리입니다.",
        content_data: {
          items: [
            { title: "3면 대형 거울 아래 레이스 의상", description: "샹들리에 노란 전등 빛을 받아 우아하게 퍼지는 드레스 자락과 하얀 장미꽃들이 세련되게 세팅된 피팅 존", image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80" },
            { title: "프랑스 수입 벨벳 쇼파 거실 살롱", description: "대나무 가벽 너머로 신랑이 편안히 앉아 에스프레소를 마시며 드레스 오픈을 기다리는 아늑한 대기실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "드레스 진주 비즈 봉제 디테일 스냅", description: "화사한 레이스 위에 스와로브스키 비즈 알갱이를 핀셋으로 집어 바느질로 꿰매어 올리는 장인의 수기 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "뮤지컬 VIP 객실 실시간 예약",
        subtitle: "공연 관람 희망 날짜, 좌석 등급(VIP/R/S), 동반 피팅 참석 인원수를 기재해 예약 신청을 완료해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "뮤지컬 티켓 예약"
        }
      }
    ]
  },

  classic_orchestra_symphony: {
    templateId: "classic_orchestra_symphony",
    name: "아모르 심포니 오케스트라",
    category: "Entertainment",
    description: "정숙함을 선사하는 마호가니 딥 브라운과 전통 악기의 황금빛 프렌치 골드, 그리고 오래된 석고 백색 배합이 오케스트라 클래식의 기품을 전하는 테마입니다.",
    image: "/templates/classic_orchestra_symphony.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#3f2b1d",     // 중후한 악기 마호가니 우드
        secondary: "#f5ebe0",   // 오래된 악보 마 린넨 베이지
        accent: "#d4af37",      // 바이올린 무광 골드 스핀
        background: "#faf6f0",  // 따스한 황토 오프화이트
        surface: "#ffffff",     // 정갈한 연주대 화이트
        text: "#2b1e16"         // 묵직한 카본 블랙 슬레이트 브라운
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "마이크와 앰프의 인공 전자음을 단호히 끄고, 나무 악기 몸통이 뿜어내는 100% 어쿠스틱의 진동",
        subtitle: "스피커 소음과 고주파 노이즈로 귀를 피로하게 만드는 대중가요 콘서트를 단호히 거부합니다. 아모르 심포니 방식으로, 수령 100년 된 이탈리아 크레모나산 명품 바이올린 목재 고유의 공명과, 마에스트로의 타협 없는 지휘 주파수 아래서 일제히 활을 켜며 내면의 기품을 소리 없이 정화하는 명품 클래식 오케스트라 연주회입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
          ctaText: "시즌 정기 연주회 예매",
          ctaLink: "#services",
          features: [
            { text: "베토벤, 바흐 등 정통 클래식 악보의 오리지널 템포를 100% 고증한 마에스트로 지휘 지휘 방식 채택" },
            { text: "음향 왜곡률 0% 오차 범위를 위해 세계 최고 수준의 목조 음향 반사판 설비가 가동되는 전용 극장" }
          ]
        }
      },
      {
        section_type: "services",
        title: "클래식 큐레이션",
        subtitle: "차가운 일상에 온전한 지적 위로를 선물하는 고밀도 클래식 음악 목록입니다.",
        content_data: {
          items: [
            {
              title: "베토벤 운명 교향곡 라이브",
              description: "웅장한 콘트라베이스 쇳소리와 바이올린의 미세한 떨림이 어쿠스틱 음압으로 온몸을 감싸며 전율을 선사합니다.",
              icon: "Zap"
            },
            {
              title: "바이올린 활 털 천연 왁스 케어",
              description: "말총 활 털의 마찰력을 극대화하기 위해 독일 수입 천연 송진 가루를 1:1 수기 도포하여 음질을 단련합니다.",
              icon: "Leaf"
            },
            {
              title: "마에스트로 다도 살롱 조찬",
              description: "연주를 마친 뒤 마당 중정 소나무를 바라보며 쌍화차를 다려 마시고 베토벤 음악 철학을 논하는 조찬 모임입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "오케스트라는 단순히 소리를 크게 합치는 합창이 아닌, 80명의 다른 연주자들이 각자가 지닌 악기 고유의 나이와 나무 결을 마에스트로의 지휘봉 끝에 완벽히 동조시켜 하나의 우주적 기하학을 빚어내는 소통의 정수입니다",
        subtitle: "모든 공연은 관객의 사색 사색을 위해 휴대폰 신호 차단 무선 폰 부스가 상시 가동됩니다.",
        content_data: {
          description: "안녕하십니까. 아모르 심포니의 상임 마에스트로 지휘자입니다. 우리는 마이크 스피커 음압으로 소리만 시끄럽게 질러대어 관객의 귀를 피로하게 만드는 무책임한 대중 퓨전 음악을 단호히 거부합니다. 우리는 소나무 툇마루 나뭇결 틈새로 소리가 자연스럽게 스며드는 100% 목조 홀 인프라를 가동하며, 당신만을 위한 거룩하고 기품 있는 영혼의 안식을 연주하겠습니다.",
          stats: [
            { label: "누적 정기 연주회 횟수", value: "350회 돌파" },
            { label: "보유 이탈리아 명품 악기", value: "24세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "마호가니 오케스트라 홀 & 바이올린 룸",
        subtitle: "사진 한 장만으로도 아늑한 마 린넨 종이 냄새와 첼로의 묵직한 쇳소리가 고스란히 흐르는 전경입니다.",
        content_data: {
          items: [
            { title: "바이올린을 켜는 연주자들의 숲", description: "하얀 연주복을 입은 단원들이 일제히 활을 뉘이며 바이올린을 켜는 쾌적하고 기품 가득한 순간 스틸", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80" },
            { title: "마호가니 목조 반사판 콘서트 바", description: "천장 가득 기하학적인 나무 음향 반사판이 설치되어 있고 그늘 샹들리에 조명이 세련되게 음영을 뿜는 무대", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "바이올린 송진 칠하기 정밀 스냅 스냅", description: "원목 테이블 위에 은빛 만년필 음악 악보 시트와 첼로 스탠드, 그리고 따뜻한 보리차 한 잔 데코 스냅 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "연주회 예약 및 클래스 신청",
        subtitle: "시즌 정기 연주회 예매 신청, 청소년 바이올린 수기 피팅 클래스 신청, 기업 대관 정모 문의는 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "오케스트라 예매 신청"
        }
      }
    ]
  },

  retro_arcade_museum: {
    templateId: "retro_arcade_museum",
    name: "8비트 아케이드 레트로 박물관",
    category: "Entertainment",
    description: "스포티하고 에너제틱한 형광 네온 그린과 묵직한 밤골목 서브웨이 차콜, 그리고 따오르는 네온 주황 포인트 배합이 레트로 오락기와 클래식 팩 게임의 낭만을 선사하는 박물관 테마입니다.",
    image: "/templates/retro_arcade_museum.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#10b981",     // 네온 형광 라임 그린
        secondary: "#3f3f46",   // 묵직한 아스팔트 차콜 그레이
        accent: "#ea580c",      // 앰버 네온 오렌지
        background: "#09090b",  // 어두운 벽돌 지하실 블랙
        surface: "#18181b",     // 철제 오락기 캐비넷 차콜
        text: "#ffffff"         // 시인성 높은 완전 울트라 화이트
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오리지널 브라운관 CRT 모니터의 오성 감각과, 몽글몽글한 기계식 조이스틱의 타격",
        subtitle: "스마트폰 스크린 노이즈만 가득하고 가상 과금 결제 유도로 피로한 양산형 모바일 게임을 단호히 거부합니다. 8비트 아케이드 방식으로, 1980년대 팩토리 오리지널 오락실 캐비넷 120대와 팩 게임을 완비하여, 사랑하는 친구들과 머리를 맞대고 지적인 목재 레트로 게임 배틀을 즐기며 소통하는 고품격 오프라인 친목 박물관입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "클래식 게임 팩 리스트",
          ctaLink: "#services",
          features: [
            { text: "브라운관 화면에 자극을 주는 돌출 전등을 철거하고, 3000K 캘빈 온도의 따뜻한 라인 간접 등 전용 설계" },
            { text: "체크인 시 관객 전원에게 수제 레트로 오리지널 오락기 칩 및 음료 무제한 패키지 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "레트로 큐레이션",
        subtitle: "두뇌의 한계 경사도를 돌파하며 미소와 땀방울을 수확하는 스릴 목록입니다.",
        content_data: {
          items: [
            {
              title: "오리지널 8비트 팩 게임 체험",
              description: "어두운 지하실 방 안에 갇혀 손전등 하나로 벽면의 단서를 찾아 암호를 해독하는 메인 퀘스트입니다.",
              icon: "Zap"
            },
            {
              title: "조이스틱 레버 수기 정밀 윤활",
              description: "오락기 조이스틱 구금 접합부에 윤활 에센스 오일을 칠해 마찰 계수를 0%로 단련하는 엔지니어 클래스입니다.",
              icon: "Compass"
            },
            {
              title: "수제 초콜릿 퐁듀와 하이볼 맥주",
              description: "게임을 마친 뒤 벨벳 바 라운지에 앉아 차가운 코로나 맥주를 흔들며 소통하는 힐링입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "레트로 오락은 단순히 옛날 게임을 그리워하는 촌스러움이 아닌, 브라운관 모니터라는 기계적 물성과 인간의 근육 손맛을 0.1초 단위로 융화하여 승리를 개척해 나가는 지적인 디지털 클래식입니다",
        subtitle: "모든 오락기는 위생을 위해 고객 1팀 사용 즉시 알코올 멸균과 키보드 건조 소독을 성실 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 8비트 아케이드 박물관의 헤드 미캐닉 캡틴입니다. 우리는 낡은 장비를 대충 빌려주고 조이스틱 뻑뻑함으로 두통과 시력 저하를 조장하는 저가 상업용 오락실을 단호히 거부합니다. 우리는 100% 무독성 필터 공기 가습 초소를 가동하고, 쾌적하고 위생적인 샤워 쉘터 인프라를 가동하며, 주민들의 따뜻하고 안전한 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 수집 오리지널 오락기", value: "120대 완비" },
            { label: "정기 방문 단골 라이더 수", value: "3,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "오리지널 아케이드 캐비넷 & 브라운관 룸",
        subtitle: "사진 한 장만으로도 신나는 웃음소리와 아날로그 쇳소리가 고스란히 전해지는 전경입니다.",
        content_data: {
          items: [
            { title: "브라운관 모니터가 켜진 게이밍 책상", description: "아늑한 핀 조명 아래 은빛 기계식 키보드가 세련되게 세팅된 크루 전용 바 카운터 뷰", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린팅 피규어 조각 기계 렉", description: "은빛 알루미늄 프린터 노즐 끝에서 수지가 적재되어 기하학적인 로봇 다리가 성형되는 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "조이스틱 스프링 오일 주유 스냅 스냅", description: "원목 테이블 위에 에스프레소 카푸치노 한 잔과 섀도우 콤팩트, 그리고 붉은 입장 티켓 스냅 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오락실 예약 및 단체 제휴 문의",
        subtitle: "단체 방문 예정 일시, 예약 룸 선택, 인원수, 선호하시는 8비트 게임 팩 종류를 기재해 예약해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "박물관 티켓 예약"
        }
      }
    ]
  },

  street_busking_union: {
    templateId: "street_busking_union",
    name: "버스킹 윈드 스트리트 음악가 연대",
    category: "Entertainment",
    description: "싱그러운 청청 올리브 리프 그린과 맑고 깨끗한 아침 스카이 블루, 그리고 앰버 오렌지 조화의 독립 인디 아티스트 버스킹 연대 테마입니다.",
    image: "/templates/street_busking_union.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#15803d",     // 에코 리프 그린
        secondary: "#e0f2fe",   // 라이트 스카이 블루
        accent: "#ea580c",      // 앰버 오렌지 불꽃
        background: "#fafbf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 린넨 가구 테이블 화이트
        text: "#14532d"         // 눈이 편안한 포레스트 그린 카본
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "화려한 무대 샹들리에 조명 장벽을 걷어내고, 길거리 바람 냄새 속에 통기타를 켜다",
        subtitle: "기성 대기업 연예 기획사의 무한 과금 결제 착취와 아이들의 꿈을 팔아넘기는 노예 계약 카르텔을 단호히 거부합니다. 버스킹 연대 방식으로, 당일 해변 노을을 마주하며 통기타 쇳소리와 마이크 한 대만으로 100% 어쿠스틱 라이브 음악을 빚어내어 길 가던 시민들의 무거운 발걸음을 위로하고, 1회/정기 후원금을 100% 아티스트에게 직접 돌려주는 비영리 상생 협동조합입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1505080856163-3a90910606c4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금주 버스킹 공연 장소 지도",
          ctaLink: "#services",
          features: [
            { text: "버스킹 합법 구역 및 지리 정보망을 구축하여 소음 민원 없이 버스킹 버스킹 엠프 설치 가능 지도 가이드" },
            { text: "체크인 시 길거리 통기타 휠셋 및 장거리 투어링용 배낭 보관 랙 무상 무상 대여 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "버스킹 큐레이션",
        subtitle: "거리의 어쿠스틱 사운드를 내 심장 속에 이식하는 럭셔리 라인업입니다.",
        content_data: {
          items: [
            {
              title: "해변 어쿠스틱 기타 라이브",
              description: "파도 소리를 배경으로 낡은 크래프터 통기타를 치며 서정적인 가사 데코 시트로 관객과 공명하는 무대입니다.",
              icon: "Heart"
            },
            {
              title: "이주민 자활 음악 멘토링",
              description: "가정 형편이 어려운 다문화 청소년에게 시니어 통기타 음악가가 1:1 수기 코드를 코칭하는 클래스입니다.",
              icon: "Compass"
            },
            {
              title: "비건 웰컴 티 칵테일 바",
              description: "공연을 마친 뒤 길바닥 마당 돗자리에 앉아 무설탕 꽃잎차를 나누며 담소를 나누는 힐링입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "버스킹은 단순히 구걸을 위한 연주가 아닌, 차갑게 얼어붙은 골목길 빌딩 숲 아래 내 영혼의 서정적인 시 한 구절을 음표로 그려 이웃에게 정직하게 선물하는 길거리 나눔의 지평선입니다",
        subtitle: "모든 길거리 공연은 관객 안전을 위해 LNT LNT LNT 쓰레기 되가져가기 캠페인을 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 버스킹 윈드 연합의 총괄 스키퍼 마스터 대표입니다. 우리는 불법 짝퉁 저질 앰프를 사용해 고주파 소음을 내지르고 자존심을 상실한 구걸단들을 단호히 거부합니다. 우리는 프랑스 수입 특수 돔 텐트를 독점 가동하며, 소리 없이 물살을 가르는 요트 마리나 라운지 같은 웰니스를 구현하겠습니다.",
          stats: [
            { label: "기획 완료 소셜 버스킹", value: "350회 돌파" },
            { label: "가입 아티스트 크루 단원", value: "1,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "눈부신 해변 버스킹 & 선셋 돗자리",
        subtitle: "하얀 선체와 파란 바다의 색상 대비가 압도적인 인생 샷 갤러리 전경입니다.",
        content_data: {
          items: [
            { title: "노을을 배경으로 노래하는 아티스트", description: "코발트 바다 해안가 위에 설치된 마이크 한 대 앞에 서서 환하게 웃으며 노래하는 어쿠스틱 순간", image: "https://images.unsplash.com/photo-1505080856163-3a90910606c4?auto=format&fit=crop&w=600&q=80" },
            { title: "3단 은식기 디저트 타워 플레이트", description: "마카롱과 타르트지가 샹들리에 조명 아래서 보석처럼 세팅된 아기자기하고 화사한 원내 디저트 바", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 시푸드 구이와 샴페인 스냅", description: "원목 테이블 위에 올리브 오일 가니쉬 랍스터 구이와 거품 가득한 화이트 와인 잔 데코 스냅 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공연 협업 및 아티스트 후원",
        subtitle: "길거리 버스킹 아티스트 크루 가입 신청, 오프라인 공연 섭외 문의, 기부 후원금 소득공제 발행은 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아티스트 후원 신청"
        }
      }
    ]
  },

  dj_electronic_club: {
    templateId: "dj_electronic_club",
    name: "베이스 웨이브 테크노 일렉트로닉 클럽",
    category: "Entertainment",
    description: "미래적인 사이버 형광 옐로우와 묵직한 카본 블랙, 은빛 알루미늄 포인트가 조화를 이루어 테크노 일렉트로닉 클럽 공연의 역동성을 전하는 테마입니다.",
    image: "/templates/dj_electronic_club.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#eab308",     // 사이버 일렉트릭 네온 옐로우
        secondary: "#1f2937",   // 묵직한 도로 카본 그레이
        accent: "#10b981",      // 테크 에메랄드 그린
        background: "#090d16",  // 미래적인 다크 매트릭스
        surface: "#111827",     // 은빛 알루미늄 프레임 차콜
        text: "#ffffff"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "심장 박동 속 침투하는 묵직한 130BPM 테크노 서브 베이스와 네온 레이저의 향연",
        subtitle: "상업적인 팝 디스코 믹싱으로 귀를 피로하게 만드는 흔한 저가 클럽 체인들을 단호히 거부합니다. 베이스 웨이브 방식으로, 영국 수입 기능성 펑션원(Function-One) 초고출력 스피커 기어와, 미세 감염 방지 방음 부스, 그리고 100% 무독성 필터 공기 청소 청정 돔 라운지에서 일생 단 하나의 기품 있는 테크노 음악 음악 콘서트를 선사하는 하이엔드 일렉트로닉 클럽입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
          ctaText: "일렉트로닉 티켓 예매",
          ctaLink: "#contact",
          features: [
            { text: "유럽 베를린 크루이츠베르크 유명 클럽 수석 DJ들과 주 1회 독점 테크노 믹싱 콘서트 상시 가동" },
            { text: "체크인 시 사이버 선글라스 및 웰컴 디톡스 시트러스 레몬 에이드 음료 무상 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "일렉트로닉 프로그램",
        subtitle: "뇌파와 전신 근육 수축 상태를 고밀도로 서포트하는 웰빙 라인업입니다.",
        content_data: {
          items: [
            {
              title: "130BPM 오리지널 테크노 쇼",
              description: "서브 우퍼 스피커의 묵직한 저음 진동을 심장 세포 속에 동조시켜 일상의 피로를 리셋하는 80분 메인 무대입니다.",
              icon: "Zap"
            },
            {
              title: "모듈러 신디사이저 믹싱 클래스",
              description: "은빛 알루미늄 기어 노즐 패치 코드를 연결하여 나만의 기하학적 아날로그 전자 음파를 조각하는 공방입니다.",
              icon: "Compass"
            },
            {
              title: "사이버 가상 칵테일 바 라운지",
              description: "체험을 마친 뒤 네온 램프가 반짝이는 철제 바 테이블에 앉아 하이볼 코로나 맥주를 들이켜는 소통 펍입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "테크노 음악은 단순히 소음을 뿜어내는 오락이 아닌, 신디사이저의 아날로그 전자 주파수와 인간의 심장 고동을 하나로 융화하여 승리를 개척해 나가는 지적인 디지털 스포츠입니다",
        subtitle: "모든 헤드폰과 디제이 덱 안면 접촉부는 위생을 위해 당일 사용 즉시 멸균 세척을 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 베이스 웨이브 클럽의 총지배인 미캐닉입니다. 우리는 낡은 장비를 대충 빌려주고 스피커 지연으로 눈총을 유발하는 불량 PC방들을 단호히 거부합니다. 우리는 100% 무독성 필터 공기 가습 초소를 가동하고, 쾌적하고 위생적인 모션데스크 인프라를 가동하며, 지적인 라이더들의 안전과 영롱한 주말 힐링을 보좌하겠습니다.",
          stats: [
            { label: "누적 티켓 완판 관객 수", value: "35,000명+" },
            { label: "보유 고출력 무대 스피커", value: "48세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "사이버 네온 폰 부스 & 레이싱 벤치",
        subtitle: "사진 한 장만으로도 짜릿한 에너지와 시크함이 고스란히 전해지는 미래 전경입니다.",
        content_data: {
          items: [
            { title: "240Hz 모니터가 켜진 게이밍 책상", description: "아늑한 핀 조명 아래 은빛 기계식 키보드가 세련되게 세팅된 크루 전용 바 카운터 뷰", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린팅 피규어 조각 기계 렉", description: "은빛 알루미늄 프린터 노즐 끝에서 수지가 적재되어 기하학적인 로봇 다리가 성형되는 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "에스프레소 드링크 유리 컵 데코", description: "원목 테이블 위에 에스프레소 카푸치노 한 잔과 섀도우 콤팩트, 그리고 붉은 입장 티켓 스냅 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "클럽 입장권 예매 및 VIP 룸 예약",
        subtitle: "방문 예정 일시, 예약 룸 선택, 인원수, 햅틱 슈트 사이즈(S/M/L)를 기재해 예약 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "클럽 입장권 예약"
        }
      }
    ]
  }
};
