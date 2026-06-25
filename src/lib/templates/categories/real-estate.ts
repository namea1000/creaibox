import { TemplateConfig } from "../registry";

export const REAL_ESTATE_TEMPLATES: Record<string, TemplateConfig> = {
  luxury_villa_residence: {
    templateId: "luxury_villa_residence",
    name: "벨그라비아 하이엔드 프라이빗 레지던스",
    category: "Real Estate",
    description: "엄격하게 큐레이션된 깊고 묵직한 마호가니 브라운과 자연 석조의 석고 베이지, 그리고 은은한 샴페인 골드 스포트라이트 배합으로 상위 0.1%를 위한 독채 럭셔리 빌라 쇼케이스 테마입니다.",
    image: "/templates/luxury_villa_residence.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#854d0e",     // 클래식 브론즈 골드
        secondary: "#1c1917",   // 묵직한 마호가니 차콜
        accent: "#b45309",      // 앰버 브라운 포인트
        background: "#fafaf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 순백색 카드 표면
        text: "#292524"         // 눈이 편안한 다크 브라운 먹색
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시선이 머무는 모든 각도에 침묵의 권위와 예술적 비율을 수놓다",
        subtitle: "수백 세대가 밀집된 양산형 성냥갑 아파트의 불쾌한 소음과 가식적인 인위성을 단호히 거부합니다. 벨그라비아 레지던스 방식으로, 3미터 이상의 압도적인 천장 단차 시공과 자연 친화적 대리석 통유리 뷰, 그리고 나만의 개인 비서가 항시 정박하는 프라이빗 빌리지 단지입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프라이빗 투어 예약",
          ctaLink: "#contact",
          features: [
            { text: "글로벌 하이엔드 건축가 마스터 크루 독점 설계 감리 완료 보증" },
            { text: "체크인 시 가죽 소재 전용 키 홀더 및 디톡스 자스민 웰컴 허브티 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "레지던스 스페이스",
        subtitle: "인간의 품격과 안식을 최고조로 이끌어내는 정교한 공간 기획 리스트입니다.",
        content_data: {
          items: [
            {
              title: "하이엔드 3면 파노라마 파티오",
              description: "몰딩을 완벽 제거한 통유리 프레임을 3면에 수직 빌드인하여, 정원의 사계절 변화를 내 거실로 고스란히 이식합니다.",
              icon: "Eye"
            },
            {
              title: "프라이빗 웰빙 노천 온천 쉘터",
              description: "천연 편백나무와 화강암 석조를 가공 시공하여, 겨울철 차가운 겨울 바람 아래서 프라이빗 스파를 누리는 치유 공간입니다.",
              icon: "Compass"
            },
            {
              title: "인텔리전트 AI 프라이빗 패스",
              description: "원터치 월패드 제어 및 안면 인식 보안 도어 인프라를 가동하여, 외부인의 무단 침입을 0%로 완벽 차단합니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "부동산은 단순히 머무는 껍데기가 아닌, 거주자의 인격적 권위와 평온한 정신 세계를 물리적 형태로 투영해 내는 숭고한 건축 예술입니다",
        subtitle: "모든 공간은 고객 1인이 퇴실할 때마다 스팀 카펫 살균 및 마호가니 오일 왁싱 관리를 성실히 집행합니다.",
        content_data: {
          description: "안녕하십니까. 벨그라비아 하이엔드 레지던스의 마스터 디렉터입니다. 우리는 평당 단가만 내세우며 시멘트 독기를 가득 품은 천편일률적 분양 마케팅을 단호히 거부합니다. 우리는 자연에서 수확한 천연 원목과 석조 자재만을 엄선하여 100년이 흘러도 변치 않을 주거 문화의 유산을 수호하고 있습니다. 세련된 간접 조명 인프라 속에서 삶의 진짜 고요함을 소유해 보시기 바랍니다.",
          stats: [
            { label: "시공 완료 최고급 빌라", value: "35세대 돌파" },
            { label: "보유 전문 감리 아키텍트", value: "14명 상시 대기" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "완공된 파노라마 정원 & 마호가니 거실",
        subtitle: "사진 한 장만으로도 웅장한 공간감과 편안함이 고스란히 흘러나오는 대표 뷰입니다.",
        content_data: {
          items: [
            { title: "샹들리에 아래 대리석 바 거실", description: "천연 이탈리아 대리석 상판 테이블 위에 크리스탈 글라스 와인 잔이 예쁘게 세팅된 다이닝 룸 전경", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
            { title: "자작나무 정원 속 노천 수영장", description: "푸른 물빛 뒤로 편백나무 기둥과 간접 라인 핀 조명이 평화롭게 정박되어 아늑함을 더한 스파 공간", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
            { title: "마호가니 서재와 타자기 데코 스냅", description: "원목 책상 위에 가죽 커버 저널 노트와 금색 안경 조각, 그리고 은은한 가습 초소가 수놓인 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프라이빗 쇼룸 예약 및 분양 상담 의뢰",
        subtitle: "방문 예정 일시, 분양 희망 세션 선택, 동반 VIP 인원수, 선호하시는 마감재 타입(원목/대리석)을 적어 비공개 신청서를 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "투어 서비스 신청"
        }
      }
    ]
  },

  modern_apartment_complex: {
    templateId: "modern_apartment_complex",
    name: "메트로폴리스 스마트 아파트 단지",
    category: "Real Estate",
    description: "스마트하고 이지적인 로열 블루와 세련된 슬레이트 그레이, 그리고 위생적인 화이트 배합으로 현대 도시 직장인과 신혼부부를 위한 미래형 스마트 아파트 단지 테마입니다.",
    image: "/templates/modern_apartment_complex.png",
    theme: {
      fontFamily: "Inter, Pretendard, sans-serif",
      colors: {
        primary: "#1d4ed8",     // 로열 스마트 블루
        secondary: "#3b82f6",   // 맑고 이지적인 블루
        accent: "#10b981",      // 친환경 에코 에메랄드
        background: "#f8fafc",  // 깨끗하고 시원한 석고 블루 화이트
        surface: "#ffffff",     // 순백의 카드 단면 화이트
        text: "#0f172a"         // 시인성이 확보된 차콜 블랙
      },
      borderRadius: "rounded-none", // 세련된 직선미를 극대화
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "초고속 기가 라이프와 울창한 에코 가든이 완벽한 스마트 공명을 이루다",
        subtitle: "주차 자리가 없어 밤마다 배회하고 층간 소음 필터가 없는 부실한 노후 주택을 단호히 거부합니다. 메트로폴리스 방식으로, 단지 내 40% 이상을 차지하는 천연 인공 호수 숲세권과, 지하 스마트 전기차 충전 초소, 그리고 무인 안심 택배 인프라를 완비한 차세대 랜드마크 아파트입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
          ctaText: "입주민 분양 공고 보기",
          ctaLink: "#services",
          features: [
            { text: "주택도시보증공사(HUG) 최고 등급 무결점 신용 분양 보증 체결 완료" },
            { text: "전 세대 친환경 하향식 차음 단열 필름 및 고성능 미세먼지 차단 환기 시스템 탑재" }
          ]
        }
      },
      {
        section_type: "services",
        title: "메트로 에센셜",
        subtitle: "도심 속 삶의 편리함과 힐링 권리를 최고조로 이끄는 고품격 라이프 인프라입니다.",
        content_data: {
          items: [
            {
              title: "기가 와이파이 AI 주차 스캔",
              description: "내 스마트폰 스마트폰 앱과 연동하여 내 차량의 주차 잔여 위치를 0.1초 만에 자동 수기 진단해 주는 첨단 주차장입니다.",
              icon: "Zap"
            },
            {
              title: "입주민 단독 피트니스 & 골프 존",
              description: "호텔급 피트니스 러닝 트랙 시설과 수영 핫 플레이스 라운지를 입주민 회원 전용 무제한 무료 입장권 혜택으로 제공합니다.",
              icon: "Activity"
            },
            {
              title: "키즈 숲속 모험 놀이터",
              description: "무독성 자작나무 목재를 활용해 창의력을 자극하며 아이들의 안전 사고를 0%로 통제 관리하는 청정 키즈 파크입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아파트는 단순히 재테크 투기의 수단이 아닌, 소중한 내 아이와 가족이 문명이라는 혜택을 쾌적하고 건강하게 누릴 수 있는 성스러운 영혼의 피난처입니다",
        subtitle: "모든 커뮤니티 시설은 쾌적함을 위해 정기 드라이 필터 환기 및 무균 공기 샤워를 성실히 집행합니다.",
        content_data: {
          description: "안녕하십니까. 메트로폴리스 조합 건설 사업본부장입니다. 우리는 입주민의 안전을 위협하는 엉성한 철골 누락 시공과 가성비 자재 대체 행위를 단호히 거부합니다. 우리는 오직 고장력 국산 철근과 특허 차음 재료만을 시공 기저에 두어 100년을 버티는 안전하고 스마트한 보금자리를 약속합니다. 시원하고 쾌적한 석고 블루 인프라 위에서 입주민의 행복한 자산을 가꾸어 보십시오.",
          stats: [
            { label: "분양 완판 총 세대 수", value: "1,200세대" },
            { label: "단지 단지 조경 면적 비율", value: "42.5% 돌파" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "쾌적한 조경 숲길 & 입주민 북카페",
        subtitle: "사진 한 장만으로도 상쾌한 솔바람과 커피 아로마가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "소나무 가득한 단지 중앙 분수 광장", description: "하얀 물줄기가 솟구치고 원목 벤치 조명 조도들이 예쁘게 수놓아진 단지 휴게 거실 전경", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" },
            { title: "통유리 너머 호수 뷰 주민 커뮤니티", description: "화사한 간접 핀 조명 아래 주민들이 평화롭게 정박되어 커피를 쉐어하는 마스터 바 공간", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "스마트 월패드 스위치 장치 스냅", description: "하얀 콘크리트 벽면에 LCD 패널 터치 노즐 끝으로 실내 조명 조율 탭을 가동하는 테크니컬 스틸 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "잔여 세대 분양 및 상담 예약 문의",
        subtitle: "분양 상담 희망 일시, 관심 평형대 선택(24평/34평/45평), 청약 자격 보유 여부를 작성해 문의 메일을 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "분양 상담 예약 완료"
        }
      }
    ]
  },

  cozy_suburban_house: {
    templateId: "cozy_suburban_house",
    name: "포근한 교외 자작나무 단독 주택",
    category: "Real Estate",
    description: "따스하고 부드러운 귤빛 앰버 오렌지와 골드 옐로우, 그리고 싱그러운 포레스트 포레스트 그린 배합으로 은퇴 은퇴 후 전원 생활을 꿈꾸는 시니어와 아이들을 위한 정원 주택 테마입니다.",
    image: "/templates/cozy_suburban_house.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#b45309",     // 따뜻한 꿀빛 앰버 오렌지
        secondary: "#d97706",   // 화사한 골드 옐로우
        accent: "#15803d",      // 정원 솔바람 포레스트 그린
        background: "#fffbeb",  // 포근한 오렌지 틴트 웜 샌드 오프화이트
        surface: "#ffffff",     // 깨끗한 자작나무 자작나무 화이트
        text: "#451a03"         // 눈이 편안한 리치 초콜릿 브라운
      },
      borderRadius: "rounded-3xl", // 둥글고 귀여운 가족 친화적 마감
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "흙냄새 가득한 천연 정원에서 내 아이와 댕댕이가 눈치 없이 마음껏 뛰어놀다",
        subtitle: "하루가 멀다 하고 고함 소리가 오가는 삭막한 시멘트 복도와 층간 소음 보복 장치가 난무하는 끔찍한 도시 생활을 단호히 탈출하십시오. 자작나무 하우스 방식으로, 100평 천연 잔디 구장 정원과, 내 손으로 직접 일구는 친환경 유기농 텃밭, 그리고 바비큐 그릴을 탑재한 나만의 단독 주택입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          ctaText: "정원 주택 매물 매물 보기",
          ctaLink: "#services",
          features: [
            { text: "친환경 천연 단열 목조 공조 시스템 적용으로 아토피 및 기관지 질환 천연 예방 보증" },
            { text: "주차 시 이웃 눈치 볼 필요 없는 1인 단독 전용 차고지 및 소형 캠핑카 정박지 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "하우스 프로그램",
        subtitle: "대지의 따뜻함과 가족들의 웃음소리를 최고조로 이끄는 오가닉 라이프 라인업입니다.",
        content_data: {
          items: [
            {
              title: "친환경 자작나무 황토 텃밭",
              description: "참나무 백탄 위에 기른 상추, 방울토마토 등을 내 텃밭에서 유기적으로 자동 재배하여 웰빙 식탁을 수확합니다.",
              icon: "Heart"
            },
            {
              title: "태양광 벽난로 난방 공학",
              description: "단독 지붕에 장착된 태양광 패널을 가동하여 겨울철 겨울 바람 속에서도 방바닥을 뜨끈하게 수기 온돌 난방 조율합니다.",
              icon: "Flame"
            },
            {
              title: "이웃 무소음 파티 하우스",
              description: "잔디 밭에 대형 원목 바베큐 벤치를 빌드업 피팅하고 동료들과 밤새 꼬마 조명 아래 수다를 즐기는 공간입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "집은 단순히 등기부등본상의 투기적 숫자가 아닌, 대지 고유의 흙냄새와 계절의 공기를 마시며 내 영혼과 가족의 행복한 역사를 기록해 나가는 성스러운 보금자리입니다",
        subtitle: "모든 실내는 친환경 청정을 위해 편백나무 드라이 필터 피톤치드 살균 소독을 매주 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 자작나무 단독 주택 에이전시 대표 카터입니다. 우리는 앞집 창문과 마주 보며 프라이버시가 침해당하고 콘크리트 미세 가루가 날리는 닭장 같은 주거 환경을 단호히 거부합니다. 우리는 마당에 오직 울창한 소나무를 심어 쾌적한 안식처를 빌드하며, 당신만의 은밀하고 세련된 교외 라이프 스타일을 수호하겠습니다.",
          stats: [
            { label: "누적 입주 만족 만족 가구", value: "85가구 돌파" },
            { label: "보유 정원 디자인 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "따뜻한 자작나무 벽난로 & 정원 바",
        subtitle: "사진 한 장만으로도 평화로운 햇살과 허브 허브 향취가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "벽돌 벽난로 아래 자작나무 바닥", description: "주황색 핀 조명 아래 흔들의자와 모카 카푸치노 웰컴 웰컴 잔이 예쁘게 수놓아진 단독 1인 좌석 뷰", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
            { title: "울타리 너머 해질녘 정원 수영장", description: "어두운 밤 노을 아래 소나무들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 락 캠프 전경", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
            { title: "숯불 그릴 위 바베큐 꼬치 스냅", description: "그릴 위에서 소시지와 파프리카 꼬치가 연기를 뿜으며 노릇하게 익어가는 평화로운 현장 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "쇼룸 방문 예약 및 개별 시공 의뢰",
        subtitle: "방문 예정 일시, 분양 희망 필지 선택, 희망 평형(30평/40평/50평), 바비큐 패키지 추가 여부를 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "정원 주택 투어 예약"
        }
      }
    ]
  },

  urban_loft_studio: {
    templateId: "urban_loft_studio",
    name: "빈티지 어반 로프트 스튜디오",
    category: "Real Estate",
    description: "인더스트리얼하고 묵직한 붉은 뱍돌 크림슨 레드와 슬레이트 카본 차콜, 경고 옐로우 액센트로 예술가들의 창작 욕구와 어반 시크 감성을 전하는 로프트 스페이스 테마입니다.",
    image: "/templates/urban_loft_studio.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#be123c",     // 타오르는 벽돌 크림슨 레드
        secondary: "#3f3f46",   // 묵직한 콘크리트 차콜 그레이
        accent: "#eab308",      // 네온 스포트라이트 옐로우
        background: "#09090b",  // 시크한 뉴욕 밤거리 블랙
        surface: "#18181b",     // 탄소 무쇠 무쇠 프레임 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-sm", // 인더스트리얼 각진 각진 마감
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "배관이 노출된 4미터 높은 천장 층고 아래서 뉴요커의 영감을 디자인하다",
        subtitle: "벽지가 찢어지고 환기가 안 되는 좁고 답답한 양산형 양산형 오피스텔을 단호히 거부합니다. 로프트 스페이스 방식으로, 거친 노출 콘크리트 벽면 레이아웃과, 수동 무쇠 레일 조명, 그리고 대형 캔버스 작화실을 완비하여, 진정한 아티스트들의 주거와 창작 공명을 바치는 독창적 로프트 룸입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
          ctaText: "로프트 룸 실시간 예약",
          ctaLink: "#contact",
          features: [
            { text: "아티스트가 직접 디자인한 미스테리 미스테리 소설 스토리 시나리오 시트 연동 몰입 보증" },
            { text: "비상시 0.1초 만에 수기 오픈 개방되는 안전 탈출 비상 스위치 및 피난 피난 유도선 상시 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "로프트 에센셜",
        subtitle: "예술적 직관을 요동치게 하고 지적인 안식을 자아내는 스릴 목록입니다.",
        content_data: {
          items: [
            {
              title: "인더스트리얼 무쇠 랙 랙",
              description: "강철 배관과 파이프를 프레임으로 가공하여 고전 도서와 대형 아크릴 캔버스를 단단하게 수납합니다.",
              icon: "Layers"
            },
            {
              title: "24시간 1인 폰부스 작업 룸",
              description: "방음 처리된 1인 목재 부스 안에서 헤드셋을 끼고 음향 코딩이나 믹싱에 몰입하는 테크니컬 초소입니다.",
              icon: "Volume2"
            },
            {
              title: "네온 네온 칵테일 웰컴 세션",
              description: "일과를 마친 뒤 철제 바 테이블 위에 누리는 차가운 하이볼 유리 드링크 잔 플레이팅 힐링입니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "로프트는 단순히 거처를 마련하는 임시 계약이 아닌, 문명이라는 도시 벽돌 속에서 스스로 고유한 예술가적 예술가적 고독을 지키기 위해 빌드업하는 영혼의 독립 영토입니다",
        subtitle: "모든 공간은 가독성 극대화를 위해 3000K 간접 조도 스포트라이트 배치를 성실히 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 빈티지 로프트 스페이스의 헤드 크루 조커입니다. 우리는 매끄러운 화이트 페인트로 가식적 위장을 한 부실 매장들을 단호히 거부합니다. 우리는 100% 무독성 필터 환기 시설을 가동하고, 쾌적하고 위생적인 벨벳 살롱 인프라를 가동하며, 주민들의 따뜻하고 안전한 예술적 안식을 수호하겠습니다.",
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
            { title: "스포트라이트 마이크 한 대 무대", description: "어두운 붉은 벽돌 벽면에 은색 스탠드 마이크가 노란 조명을 받아 외롭게 빛나는 아우라 가득한 무대 뷰", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80" },
            { title: "철제 락커 가구 네온사인 바 코너", description: "애시드 그린 선인장 로고가 반짝이고 은빛 맥주 탭룸 호스들이 정갈하게 진열된 카운터 쇼케이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "그릴드 칩스와 하이볼 칵테일 스냅", description: "무쇠 테이블 위에 노란 나초 칩 볼과 라임 레몬 가니쉬 유리 드링크 잔, 그리고 붉은 입장 티켓 스냅 데코", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "스튜디오 입주 및 쇼룸 투어 신청",
        subtitle: "방문 예정 일시, 예약 테마 룸 선택, 인원수, 디자인 시스템 자문 필요 여부를 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "로프트 스튜디오 신청"
        }
      }
    ]
  },

  share_house_coliving: {
    templateId: "share_house_coliving",
    name: "청년 연대 쉐어하우스 & 코리빙",
    category: "Real Estate",
    description: "싱그럽고 활기찬 민트 테일 오션과 맑은 에메랄드, 그리고 러블리한 로즈 로즈 코랄 액센트 배합으로 청년 청춘들의 소통과 지적 연대를 이끄는 친근한 테마입니다.",
    image: "/templates/share_house_coliving.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#0d9488",     // 청량한 민트 틸
        secondary: "#2dd4bf",   // 화사한 에메랄드
        accent: "#f43f5e",      // 러블리한 로즈 코랄
        background: "#f0fdfa",  // 눈이 편안한 민트 오프화이트
        surface: "#ffffff",     // 깨끗한 자작나무 자작나무 화이트
        text: "#115e59"         // 시인성 높은 올리브 딥 딥 그린
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "각자의 1인 방에서 프라이빗을 완벽 사수하고, 넓은 공유 키친에서 청춘을 믹싱하다",
        subtitle: "매달 뿜어지는 삭막한 월세 부담과 방구석 고독사를 유발하는 단절된 단절된 원룸 생활을 단호히 탈출하십시오. 믹스 라운지 방식으로, 2미터 자작나무 방음 벽이 설계된 단독 침실실과, 커피 캡슐 머신이 완비된 공유 거실, 그리고 청년들의 따뜻한 우정을 수호하는 코리빙 공간입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "입주 모집 현황 보기",
          ctaLink: "#services",
          features: [
            { text: "보증금 가정보호 RLS 안전 연동 연동 및 매달 전문 방역 청소 스태프 무료 서포트" },
            { text: "체크인 시 청년 전용 오가닉 실내 슬리퍼 및 친환경 대나무 섬유 타월 패키지 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "코리빙 큐레이션",
        subtitle: "내 프라이버시를 지키며 유쾌하게 미소 짓고 지적으로 소통하는 쉐어 라이프 프로그램입니다.",
        content_data: {
          items: [
            {
              title: "1인 방음 단독 침실",
              description: "고밀도 친환경 매트리스와 차음재 시공이 엄수되어, 방 안에서 책을 읽거나 수면할 때 완벽한 침묵을 보장합니다.",
              icon: "Home"
            },
            {
              title: "공유 바리스타 커피 키친",
              description: "매일 볶은 신선한 생두 원두가 채워지는 하향식 커피 메이커 바를 가동해 입주민끼리 차를 쉐어합니다.",
              icon: "Coffee"
            },
            {
              title: "주말 시네마 & 요리 살롱",
              description: "프라이버시가 확보된 스크린 빔 룸에 모여 팝콘을 요리하고 프랑스 프랑스 와인을 들이키는 네트워킹 파티입니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "쉐어하우스는 단순히 비용을 아끼는 가성비 룸이 아닌, 고독한 문명 사회 속에서 청년들이 고유한 독립의 불꽃을 꺼뜨리지 않도록 서로의 어깨를 보듬어주는 지적인 지적인 연대입니다",
        subtitle: "모든 시설은 쾌적함을 위해 조합원 관리 규약을 상시 엄수하며 상호 존중을 실현합니다.",
        content_data: {
          description: "안녕하십니까. 믹스 청년 코리빙의 헤드 마스터입니다. 우리는 입주민의 프라이버시를 지켜주지 못하고 벌레가 가득한 불법 개조 쪼개기 방들을 단호히 거부합니다. 우리는 100% 미세먼지 차단 헤파 필터 환기 환기 시설을 가동하고, 쾌적하고 위생적인 욕실 가벽 인프라를 상시 관리하며, 주민들의 따뜻하고 안전한 주거 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 연대 연대 입주민", value: "350명 돌파" },
            { label: "운영 중인 프라이빗 룸 수", value: "48개 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "포근한 자작나무 거실 & 바리스타 바",
        subtitle: "사진 한 장만으로도 포근한 종이 책 냄새와 신선한 빵 아로마가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "원목 바 테이블 위 커피 커피 스틸", description: "아늑한 핀 조명 아래 주황색 레몬 슬라이스 가니쉬 음료 드링크 잔이 예쁘게 세팅된 카운터", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" },
            { title: "책장이 수놓인 공유 북 살롱 전경", description: "천장까지 닿은 원목 책꽂이 책장들이 평화롭게 정렬된 마호가니 가구 코너 북 살롱 룸 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "마카롱과 수제 샌드위치 플레이팅", description: "하얀 자기 식기 위에 치즈 베이컨 버거와 신선한 루꼴라 야채가 이쁘게 장식된 브런치 테이블", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "입주 신청 및 공실 알림 등록",
        subtitle: "방문 예정 일시, 예약 룸 선택, 입주 입주 희망 월, 나만의 라이프 스타일 키워드를 적어 신청서를 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "코리빙 입주 신청"
        }
      }
    ]
  },

  office_commercial_space: {
    templateId: "office_commercial_space",
    name: "스마트 코워킹 스페이스 & 상업 오피스",
    category: "Real Estate",
    description: "신뢰와 전문성을 상징하는 다크 네이비와 차분한 슬레이트 그레이, 이지적인 스카이 블루 배합으로 기업 전용 사옥 설계 및 스마트 코워킹 스페이스 전용 임대 테마입니다.",
    image: "/templates/office_commercial_space.png",
    theme: {
      fontFamily: "Inter, Pretendard, sans-serif",
      colors: {
        primary: "#0f172a",     // 딥 슬레이트 네이비
        secondary: "#475569",   // 이지적인 슬레이트 그레이
        accent: "#0284c7",      // 신뢰를 더하는 스카이 블루
        background: "#f1f5f9",  // 쾌적하고 차가운 석고 오프화이트
        surface: "#ffffff",     // 깨끗한 스틸 책상 화이트
        text: "#0f172a"         // 가독성이 탁월한 네이비 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "출근하고 싶은 지능형 업무 비서 인프라와 압도적 가독성의 오피스",
        subtitle: "냉난방이 고장 나고 전기 콘센트 배선이 엉망으로 꼬인 낡고 음침한 구식 사무실을 단호히 거부합니다. 스마트 오피스 방식으로, 전 좌석 모클랜드 모션 데스크 자가 피팅 및 4K 핀 핀 조명 조도 조율, 그리고 글로벌 해킹 차단 RLS 보안망을 완비한 하이엔드 테크 코워킹 쉘터입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "공실 현황 및 임대 상담",
          ctaLink: "#contact",
          features: [
            { text: "초고속 파이버 옵틱 기가 인터넷 네트워크 무제한 무료 대역폭 보증" },
            { text: "전용 에어 필터 드라이룸 공기 정화 공조 스태프가 매시간 위생 청결 상태 수기 통제" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오피스 에센셜",
        subtitle: "업무 생산성과 기업의 자산 가치를 최고조로 이끄는 스마트 오피스 라인업입니다.",
        content_data: {
          items: [
            {
              title: "인라인 전력 모션 데스크",
              description: "원터치 월패드 조절로 내 키에 맞춰 책상 높낮이를 제어하여 목 디스크 자극을 예방하는 인체공학 가구입니다.",
              icon: "Sliders"
            },
            {
              title: "4K 스위치 빔 회의 룸",
              description: "전면 유리 도어 프라이버시 필터링 필름 시공이 완료된 공간에서 기가 빔 스캔으로 화상 회의를 진행합니다.",
              icon: "Monitor"
            },
            {
              title: "기가 기가 커피 바 무제한",
              description: "매일 아침 바리스타 원장 스태프가 정박 가동하는 커피 머신에서 원두 에스프레소를 무한 제공합니다.",
              icon: "Coffee"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "사무실은 단순히 책상과 의자를 나열한 노동의 지하실이 아닌, 내 영혼의 비즈니스 영감이 코딩을 거쳐 세상에 혁신의 파도를 쏘아 올리는 성스러운 기획 초소입니다",
        subtitle: "모든 공간은 정보 보호를 위해 3중 디지털 방화벽 보안 보안 시스템을 상시 가동합니다.",
        content_data: {
          description: "안녕하십니까. 스마트 코워킹 오피스의 마스터 파트너입니다. 우리는 어두운 조명과 곰팡이 냄새로 직원들의 노동 의욕을 꺾고 피로만 누적시키는 가성비 소호 사무실을 단호히 거부합니다. 우리는 100% 무독성 자재 가구 피팅을 준수하고, 쾌적하고 위생적인 에어 샤워실 인프라를 가동하며, 귀사의 비즈니스 안식을 견인하겠습니다.",
          stats: [
            { label: "누적 입주 IT 강소기업", value: "85개사 돌파" },
            { label: "보유 전문 회의실 개수", value: "14개 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "은빛 철골 모니터 랙 & 인라인 오피스",
        subtitle: "사진 한 장만으로도 스마트한 비즈니스 파워가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "듀얼 모니터가 켜진 1인 코딩 책상", description: "아늑한 핀 조명 아래 기계식 키보드와 주황색 시안 블루 폰트가 켜진 맥북 모니터 가구 뷰", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" },
            { title: "유리 도어가 웅장한 대회의실 전경", description: "하얀 마블 벽면과 실버 메탈 빔 장치가 세련되게 정렬된 카운터 대회의실 룸 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "커피 메이커 머신 에센셜 샷 스냅", description: "원목 테이블 위에 에스프레소 아로마 오일 웰컴 컵 두 잔과 골드 금 키홀더 액세서리 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오피스 투어 투어 신청 및 임대 문의",
        subtitle: "방문 예정 일시, 예약 테마 룸 선택, 입주 입주 인원(단체 사옥 가능), 보안 보안 등급 요구 사항을 기재해 임대 문의를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "사무실 임대 상담 예약"
        }
      }
    ]
  },

  traditional_hanok_stay: {
    templateId: "traditional_hanok_stay",
    name: "아날로그 전통 한옥 독채 스테이",
    category: "Real Estate",
    description: "고풍스럽고 다정한 깊은 나무색 머드 브라운과 한지 아날로그 웜 크림, 그리고 기품 있는 전통 낙관 버건디 스칼렛 포인트 배합으로 단독 한옥 스테이와 차 치유 공간을 위한 한글 맞춤형 서사 테마입니다.",
    image: "/templates/traditional_hanok_stay.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#78350f",     // 기품 있는 기와 먹색 나무 브라운
        secondary: "#f5ebe0",   // 아날로그 한지 웜 크림
        accent: "#b91c1c",      // 낙관 스칼렛 레드
        background: "#faf6f0",  // 은은한 자작나무 황토 한옥 크림
        surface: "#ffffff",     // 원고지 백색 화이트
        text: "#292524"         // 눈이 편안한 나무 껍질 다크 브라운
      },
      borderRadius: "rounded-lg",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "서까래 아래 툇마루에 얌전히 누워, 한지 창문 너머로 계절의 한 조각을 감상하다",
        subtitle: "콘크리트 미세 가루가 폴폴 풍기고 얌체 주차가 들끓는 불쾌한 소음 투성이 도시를 단호히 탈출하십시오. 전통 한옥 방식으로, 천연 황토 구들장과 소나무 서까래, 그리고 내 손으로 벼루에 먹을 갈며 사색을 즐기는 1인 단독 전통 힐링 텃밭 스테이입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1547886596-430155577c8e?auto=format&fit=crop&w=1200&q=80",
          ctaText: "한옥 예약 캘린더",
          ctaLink: "#contact",
          features: [
            { text: "역사 보존 전통 대목장 장인 마스터가 직접 감리 시공 완료 보증" },
            { text: "체크인 시 가죽 소재 전용 방 열쇠 및 다정한 자스민 웰컴 허브티 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "한옥 큐레이션",
        subtitle: "인간 본연의 고요함과 예절의 안식을 최고조로 이끌어내는 정교한 힐링 코스입니다.",
        content_data: {
          items: [
            {
              title: "35mm 수묵 문학 캘리그래피",
              description: "은은한 핀 조명 아래서 연필 대신 붓을 잡고 벼루에 먹을 직접 가득 가득 갈아내며 내면의 생각을 원고지에 적는 클래스입니다.",
              icon: "PenTool"
            },
            {
              title: "전통 황토 구들장 온돌 쉘터",
              description: "참나무 백탄 위에 장작을 피워 겨울철 매서운 겨울 바람 속에서도 바닥을 절절 끓게 온도를 수기 조율해 주는 한옥 룸입니다.",
              icon: "Flame"
            },
            {
              title: "시네마틱 보르도 차 마리아주",
              description: "원목 바 테이블 위에 얇게 썬 레몬 가니쉬 웰컴 전통차와 수제 약과 디저트 플레이팅을 대접하는 호사입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "주거란 단순히 등기부등본에 박제되는 자산 가치가 아닌, 한 장의 원고지 위에 내 영혼의 전략적 평온과 안식을 수놓는 성스러운 성스러운 기록물입니다",
        subtitle: "모든 한옥 객실은 고객 1인이 다녀갈 때마다 편백나무 방역 소독과 침구 세탁을 성실히 집행합니다.",
        content_data: {
          description: "안녕하십니까. 아날로그 전통 한옥 스테이의 총괄 에디터입니다. 우리는 앞사람과 문이 마주쳐 불쾌한 사후 서비스로 눈총을 유발하는 부실 한옥 민박들을 단호히 거부합니다. 우리는 야간 순찰용 고조도 무전기 세트를 상시 가동하고, 쾌적하고 위생적인 샤워 쉘터 인프라를 가동하며, 주민들의 따뜻하고 안전한 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 예약 완판 만족도", value: "98.7%" },
            { label: "보유 전문 독채 한옥 룸", value: "8개 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수묵 문학 서재 & 아날로그 툇마루",
        subtitle: "사진 한 장만으로도 은은한 편백 향과 아날로그 감성이 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "샹들리에 아래 대리석 바 거실", description: "어두운 목조 벽면 코너에 촛불 하나와 와인 잔, 그리고 상영 스케줄 시트가 이쁘게 세팅된 테이블 좌석", image: "https://images.unsplash.com/photo-1547886596-430155577c8e?auto=format&fit=crop&w=600&q=80" },
            { title: "독일제 35mm 필름 필름 영사 기계실", description: "은빛 릴 바퀴가 회전하며 영사 렌즈 빛줄기를 무대 스크린 속으로 시크하게 쏘아 올리는 정교한 조리 현장", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 초콜릿 퐁듀와 화이트 와인 스냅", description: "원목 바 테이블 위에 얇게 썬 레몬 조각 가니쉬 디저트와 투명한 유리 컵 두 잔 스케치 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "한옥 스테이 예약 및 살롱 대관 의뢰",
        subtitle: "방문 예정 일시, 예약 룸 선택, 동반 참석 인원 수, 프라이빗 온돌 구들장 예약이 필요하다면 아래 원고지를 채워 노크해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "한옥 스테이 예약 신청"
        }
      }
    ]
  },

  tiny_house_eco_cabin: {
    templateId: "tiny_house_eco_cabin",
    name: "에코 미니멀 타이니 하우스",
    category: "Real Estate",
    description: "싱그럽고 조용한 포레스트 포레스트 숲그린과 따스한 시더 자작나무 우드 브라운, 밝은 해님 옐로우 배합으로 오프그리드 탄소 제로 에코 타이니 하우스 전용 테마입니다.",
    image: "/templates/tiny_house_eco_cabin.png",
    theme: {
      fontFamily: "Pretendard, Outfit, sans-serif",
      colors: {
        primary: "#165b33",     // 에코 파인 숲그린
        secondary: "#854d0e",   // 따뜻한 꿀빛 시더 원목 브라운
        accent: "#f59e0b",      // 노을빛 핀 조명 옐로우
        background: "#f3f7f4",  // 눈이 편안한 숲속 잎새 화이트 오프화이트
        surface: "#ffffff",     // 순백의 가구 화이트
        text: "#1b3a24"         // 가독성이 탁월한 딥 포레스트 그린
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "8평의 콤팩트 우주 속에서 불필요한 문명의 소음을 버리고, 단순함의 풍요를 소유하다",
        subtitle: "평생 빚쟁이 족쇄로 작용하는 거대한 융자 아파트를 단호히 거부합니다. 에코 캐빈 방식으로, 천연 삼나무 목재 가구 마감과, 오프그리드 빗물 정화 장치, 그리고 바퀴가 달려 어디든 내 영토가 되는 타이니 하우스 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
          ctaText: "에코 캐빈 모델 라인업",
          ctaLink: "#services",
          features: [
            { text: "친환경 탄소 발자국 제로 1등급 1등급 단열 성능 통과 친환경 기재 보증" },
            { text: "체크인 시 세종 자작나무 원목 원목으로 가공한 개인 미플 인형 장식 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에코 캐빈 시스템",
        subtitle: "최소한의 자원으로 최대한의 안식을 선사하는 친환경 스마트 라이프 스펙트럼입니다.",
        content_data: {
          items: [
            {
              title: "오프그리드 태양광 인버터",
              description: "지붕에 탑재된 태양광 셀을 가동하여 겨울철 매서운 겨울 바람 속에서도 스마트 핀 조명을 은은하게 조율하는 공학입니다.",
              icon: "Zap"
            },
            {
              title: "빗물 유기농 순환 정화기",
              description: "강수 빗물을 정밀 카본 필터 샤워로 멸균 처리하여 정원 텃밭과 주방 식기 식기에 친환경 공급합니다.",
              icon: "Droplet"
            },
            {
              title: "단풍나무 단독 캠핑 그릴",
              description: "화로 코너 위에 참나무 백탄 숯불을 피워 바비큐 맥주 파티를 쉐어하는 유쾌하고 평화로운 안식입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "소형 주택은 가난의 상징이 아닌, 문명이라는 물욕의 감옥에서 벗어나 자연과 내가 수평으로 동기화되어 소통하는 가장 우아한 지적 라이프스타일입니다",
        subtitle: "모든 캐빈 시설은 청결을 위해 스팀 시트 살균 살균 및 공기 에어 안심 샤워를 상시 집행합니다.",
        content_data: {
          description: "안녕하십니까. 에코 캐빈 스페이스의 크레이티브 디자이너 모나입니다. 우리는 평당 분양가만 부풀려 사기 시공을 남발하는 대기업의 양산형 양산형 아파트 마피아를 단호히 거부합니다. 우리는 자작나무 원목 판재만을 시공 기저에 두어 자연의 아로마를 선물하고, 당신만의 안전하고 고요한 소형 안식처를 빌드하겠습니다.",
          stats: [
            { label: "시공 완료 타이니 캐빈 수", value: "120개동 돌파" },
            { label: "소속 친환경 빌더 마스터", value: "8명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "포근한 자작나무 벽난로 & 정원 바",
        subtitle: "사진 한 장만으로도 평화로운 햇살과 허브 허브 향취가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "다락방 사다리 아래 주방 뷰", description: "아늑한 핀 조명 아래 원목 조리 도구들과 식기들이 정갈하게 장식된 단독 1인 미니 주방 뷰", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80" },
            { title: "숲속에 정박된 타이니 에코 캐빈", description: "어두운 밤 노을 아래 소나무 숲에 둘러싸인 아날로그 램프 핀 조명이 평화롭게 빛나는 야외 뷰", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "화로 위 마시멜로 참나무 숯불 스냅", description: "황동 화로대 위에서 꼬치 샌드위치가 연기를 뿜으며 노릇하게 익어가는 로맨틱한 캠핑 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "커스텀 캐빈 제작 예약 및 견적 의뢰",
        subtitle: "방문 예정 일시, 관심 모델 선택, 배치 예정지 주소(대지 상태), 오프그리드 팩 추가 여부를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "캐빈 상담 예약 완료"
        }
      }
    ]
  },

  premium_penthouse_suite: {
    templateId: "premium_penthouse_suite",
    name: "스카이 마블 하이퍼 럭셔리 펜트하우스",
    category: "Real Estate",
    description: "엄격하게 통제된 블랙 옵시디언 다크 테마에 찬란한 골드 옐로우 스포트라이트 광원 배합으로 지상 300미터 하늘 위에서 밤하늘 도시 노을을 감상하는 최고급 펜트하우스 포트폴리오 테마입니다.",
    image: "/templates/premium_penthouse_suite.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#ffffff",     // 플래티넘 화이트 텍스트
        secondary: "#d4af37",   // 샴페인 브론즈 골드 광원
        accent: "#171717",      // 제트 블랙 슬레이트 카본
        background: "#0a0a0a",  // 묵직한 마스터 펜트하우스 다크니스
        surface: "#121212",     // 대리석 마블 코너 매트 블랙 카드
        text: "#f5f5f5"         // 시인성이 확보된 백색 텍스트
      },
      borderRadius: "rounded-none", // 극한의 모던함을 위해 곡률 제로
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "도심의 소음이 닿지 않는 하늘의 성지에서 세상을 단숨에 굽어보다",
        subtitle: "양산형 건설사들이 지은 저급한 석고보드 내장재 아파트를 단호히 거부합니다. 스카이 마블 방식으로, 6미터 복층 오픈 천장 층고와, 360도 전면 유리 슬라이딩 도어 파노라마, 그리고 내 소유의 개인 헬기 헬리포트 착륙 초소를 완비하여 상위 0.01%의 사색과 안식을 수호하는 성소입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "비공개 특별 분양 예약",
          ctaLink: "#contact",
          features: [
            { text: "이탈리아 마스터 장인 크루가 수작업 작화한 오리지널 마블 통 벽면 아트웍 시공 보증" },
            { text: "체크인 시 가방 전용 금 도어 키 홀더 및 소믈리에 엄선 샴페인 웰컴 플레이팅 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "펜트하우스 에센셜",
        subtitle: "하늘 위의 주거 품격과 사적인 휴식을 최고조로 직조하는 인프라 라인업입니다.",
        content_data: {
          items: [
            {
              title: "360도 스카이 파노라마 수영장",
              description: "유리 가벽 가이드가 완벽히 숨겨진 인피니티 풀을 빌드하여, 서울 강남 도심 노을을 내 침실 안으로 이식합니다.",
              icon: "Eye"
            },
            {
              title: "천연 무소음 황토 온돌 암실",
              description: "전통 대목장 명인이 감리한 편백나무 핀 조명 아래서 조용히 명상하며 하루의 뇌파 피로를 치유하는 룸입니다.",
              icon: "Compass"
            },
            {
              title: "엔터프라이즈 제로 트러스트 보안",
              description: "입구부터 거실 터치 도어까지 안면 인식과 RLS 해킹 방지 보안망을 가동하여 프라이버시를 수호합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "펜트하우스는 단순히 높은 고층 빌딩이 아닌, 거주자가 이룬 자산의 역사적 성취와 침묵의 존엄을 물리적 형태로 박제해 내는 지고한 우아함의 앙상블입니다",
        subtitle: "모든 프라이빗 룸은 품격을 위해 스팀 카펫 살균 및 마호가니 왁싱 관리를 주간 집행합니다.",
        content_data: {
          description: "안녕하십니까. 스카이 마블 펜트하우스 총괄 파트너 디렉터입니다. 우리는 평당 단가 마케팅에만 급급해 싸구려 콘크리트 가벽을 세워 층간 소음 노이즈를 방조하는 주택을 단호히 거부합니다. 우리는 100% 무독성 자연 대리석 자재만을 시공 기저에 두어 눈이 편안한 휴식을 제공하고, 오직 소수만을 위한 안전하고 위엄 있는 영토를 약속합니다.",
          stats: [
            { label: "준공 완료 마스터 피스 수", value: "12세대 한정" },
            { label: "소속 전담 컨시어지 스태프", value: "24명 상시 대기" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "하늘 정원 수영장 & 대리석 거실",
        subtitle: "사진 한 장만으로도 압도적인 럭셔리 아우라가 고스란히 솟구치는 전경입니다.",
        content_data: {
          items: [
            { title: "샹들리에 아래 대리석 바 거실", description: "어두운 마블 벽면 테이블 위에 투명한 크리스탈 와인 글라스와 은 식기들이 예쁘게 세팅된 다이닝 룸", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80" },
            { title: "인피니티 풀 수영장 하늘 뷰", description: "하얀 콘크리트 기둥과 은빛 물결이 주황빛 노을 조명을 받아 세련되게 정박된 야외 테라스 공간", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
            { title: "마호가니 서재와 타자기 데코 스냅", description: "원목 테이블 위에 가죽 노트와 보석 장식 은색 열쇠, 그리고 따뜻한 웰컴 드링크 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "비공개 특별 분양 예약 및 쇼룸 투어 의뢰",
        subtitle: "방문 예정 일시, 분양 예약 평형, 동반 참석자 신원 정보, 희망하시는 보안 요구 사항을 기재해 예약해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "쇼룸 방문 예약 완료"
        }
      }
    ]
  },

  recreation_island_resort: {
    templateId: "recreation_island_resort",
    name: "오션 플렉스 휴양지 섬 리조트 빌라",
    category: "Real Estate",
    description: "눈부신 에메랄드 오션 블루와 하늘빛 터콰이즈, 그리고 따스한 선셋 골드 배합으로 해외 고급 휴양지 섬 독채 풀빌라 리조트 전용 에너제틱 럭셔리 테마입니다.",
    image: "/templates/recreation_island_resort.png",
    theme: {
      fontFamily: "Poppins, Outfit, sans-serif",
      colors: {
        primary: "#0369a1",     // 눈부신 오션 에메랄드 블루
        secondary: "#0ea5e9",   // 맑고 청량한 터콰이즈 스카이
        accent: "#f59e0b",      // 타오르는 선셋 골드 포인트
        background: "#f0f9ff",  // 투명한 라군 에메랄드 오프화이트
        surface: "#ffffff",     // 순백의 모래사장 화이트 카드
        text: "#0c4a6e"         // 시인성 높은 깊은 바다 네이비
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "파도가 발끝에서 속삭이는 나만의 프라이빗 프라이빗 백사장에서 안식을 낚다",
        subtitle: "수백 명의 관광객 소음과 부실한 서비스 위생으로 피로를 유발하는 일반 대형 리조트 체인을 단호히 거부합니다. 오션 플렉스 방식으로, 지상 지상 파티오 바로 아래 바다 물결과 수평으로 닿은 독채 인피니티 풀빌라, 그리고 소믈리에 엄선 웰컴 프랑스 프랑스 와인을 대접하는 웰빙 안식처입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "독채 풀빌라 객실 예약",
          ctaLink: "#contact",
          features: [
            { text: "보증금 가정보호 RLS 안전 연동 연동 및 매달 전문 방역 청소 스태프 무료 서포트" },
            { text: "체크인 시 청년 전용 오가닉 실내 슬리퍼 및 친환경 대나무 섬유 타월 패키지 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "리조트 프로그램",
        subtitle: "도심 속 삶의 피로를 비워내고 자연의 생명력을 가득 채우는 힐링 코스입니다.",
        content_data: {
          items: [
            {
              title: "프라이빗 파도 툇마루 온수 풀",
              description: "겨울철 매서운 겨울 바람 아래서도 수온을 따뜻하게 온수 구들장 탭으로 조율하는 개인 인피니티 수영장입니다.",
              icon: "Droplet"
            },
            {
              title: "수묵 보태니컬 숲속 요가 캠프",
              description: "바쁜 소음 속에서 스스로 벼루에 먹을 갈며 내면의 필력을 수기 다듬는 자작나무 숲속 힐링 명상 공간입니다.",
              icon: "Sun"
            },
            {
              title: "바비큐 웰컴 플레이트 서빙",
              description: "참나무 백탄 위에 돼지 목살 소시지를 그릴 시어링하여 차가운 라임 코로나 맥주와 테이블로 서빙합니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "풀빌라는 단순히 하루 숙박하는 객실이 아닌, 문명이라는 감옥에서 벗어나 자연과 내가 수평으로 동기화되어 내면의 상처를 치유하는 성스러운 안식처입니다",
        subtitle: "모든 독채 빌라는 쾌적한 안식을 위해 입실 전 3중 공기 케어 소독을 엄수 집행합니다.",
        content_data: {
          description: "안녕하십니까. 오션 플렉스 섬 리조트의 지배인 카터입니다. 우리는 앞집 창문과 마주 보며 프라이버시가 침해당하고 콘크리트 미세 가루가 날리는 닭장 같은 분양 숙소들을 단호히 거부합니다. 우리는 마당에 오직 울창한 소나무를 심어 쾌적한 안식처를 빌드하며, 당신만의 은밀하고 세련된 오션 라이프 스타일을 수호하겠습니다.",
          stats: [
            { label: "누적 입주 만족 만족 가구", value: "85가구 돌파" },
            { label: "보유 정원 디자인 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "에메랄드 라군 수영장 & 모래사장 테라스",
        subtitle: "사진 한 장만으로도 평화로운 파도 소리와 야자수 바람이 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "야자수 아래 세팅된 썬베드 뷰", description: "아늑한 핀 조명 아래 투명한 크리스탈 와인 웰컴 컵이 예쁘게 수놓아진 해안가 휴게실 전경", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "통유리 너머 호수 뷰 주민 커뮤니티", description: "어두운 밤 노을 아래 소나무들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 락 캠프 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "숯불 그릴 위 바베큐 꼬치 스냅", description: "그릴 위에서 소시지와 파프리카 꼬치가 연기를 뿜으며 노릇하게 익어가는 평화로운 현장 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "객실 예약 신청 및 독점 대관 의뢰",
        subtitle: "방문 예정 일시, 독채 빌라 타입 선택, 예약 예약 인원수, 선호하시는 웰컴 와인 카테고리를 적어주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "풀빌라 객실 예약 신청"
        }
      }
    ]
  },

  real_estate_brokerage: {
    templateId: "real_estate_brokerage",
    name: "정직한 탑 공인중개사 컨설팅 에이전시",
    category: "Real Estate",
    description: "신뢰와 정직함을 상징하는 딥 트러스트 네이비와 클래식 블루, 그리고 안전 신호 오렌지 주황 포인트 배합으로 부동산 매물 탐색 및 임대 대행 공인중개 컨설팅 전용 테마입니다.",
    image: "/templates/real_estate_brokerage.png",
    theme: {
      fontFamily: "Inter, Pretendard, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 신뢰의 딥 트러스트 네이비
        secondary: "#3b82f6",   // 맑고 투명한 블루
        accent: "#f97316",      // 안전 임대 알림 오렌지
        background: "#f8fafc",  // 쾌적하고 위생적인 슬레이트 오프화이트
        surface: "#ffffff",     // 순백의 마스터 계약서 화이트
        text: "#1e293b"         // 가독성이 뛰어난 차콜 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "부실한 허위 매물과 미끼성 권리금 함정을 단호히 차단하고, 100% 안심 자산을 계약하다",
        subtitle: "사진 보정 왜곡이 심하고 등기부등본 권리 분석을 숨겨서 중개 사고를 유발하는 불량 중개업소들을 단호히 거부합니다. 탑 공인중개 방식으로, 24시간 실시간 법률 분석 비서 모듈과, RLS 정보 보안 암호화, 그리고 1억 원 배상 책임 보증 보험을 가동하여 안전하고 확실한 상가, 아파트, 주택 계약을 보좌합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
          ctaText: "안심 추천 매물 리스트",
          ctaLink: "#services",
          features: [
            { text: "한국공인중개사협회 최고 공제 책임 보증서 발급 발급 및 매물 현장 검증 필증 필증 첨부 보증" },
            { text: "체크인 시 가죽 소재 전용 계약서 서류 지갑 및 웰컴 커피 음료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "중개 서비스",
        subtitle: "고객님의 안전한 주거 이전과 상업 자산 확장을 최고조로 보좌하는 핵심 라인업입니다.",
        content_data: {
          items: [
            {
              title: "1:1 정밀 등기 분석 스캔",
              description: "매물 계약 전 3중 등기부등본 저당권 분석을 통해 근저당 융자 비율을 과학적으로 진단하는 안심 프로세스입니다.",
              icon: "Search"
            },
            {
              title: "상업 상가 상권 분수 분석",
              description: "주변 상가 유동 인구와 동선 데이터를 수기 수기 추적 분석하여 최적의 매출 수확 필지를 점검합니다.",
              icon: "TrendingUp"
            },
            {
              title: "이웃 분쟁 방지 사후 중개",
              description: "계약 완료 후 세입자 입주 청소 조율 및 누수 분쟁에 대해 변호사 협업을 통해 조속히 무상 중재 관리합니다.",
              icon: "Briefcase"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "중개는 단순히 종이 계약서에 도장을 찍어 수수료를 챙기는 거래가 아닌, 고객이 평생 모은 피땀 어린 소중한 자산의 운명을 안전하게 수호하는 기품 있는 파트너십입니다",
        subtitle: "모든 계약 체결은 공정함을 위해 3중 법률 자문 확인을 성실히 집행합니다.",
        content_data: {
          description: "안녕하십니까. 탑 공인중개 에이전시 대표 중개사입니다. 우리는 눈앞의 중개 보수 이익에만 눈이 멀어 집값 거품을 유도하거나 결로 곰팡이 하자를 의도적으로 숨기는 비양심적 행위를 단호히 거부합니다. 우리는 오직 국토교통부 등록 실거래 데이터만을 기저에 두어 투명하게 매물을 안내하며, 당신만의 소중하고 따뜻한 보금자리 개설을 보좌하겠습니다.",
          stats: [
            { label: "누적 거래 체결 총액", value: "3,500억 돌파" },
            { label: "소속 정예 전문 공인중개사", value: "14명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "정갈한 안심 계약실 & 상가 쇼룸",
        subtitle: "사진 한 장만으로도 차분한 계약 집중력과 신뢰감이 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "원목 테이블 위 세팅된 도장 패드", description: "하얀 가이드 조명 아래 무독성 잉크패드와 가죽 만년필 펜이 예쁘게 세팅된 회의실 테이블", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80" },
            { title: "통유리 너머 상가 로비 라운지", description: "어두운 밤 노을 아래 소나무 조형물들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 안내 데스크", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "계약서 서류철과 금 열쇠 조각 스냅", description: "마호가니 탁자 위에 하얀 정식 계약서 파일과 금색 도어 키홀더가 세련되게 데코된 정물 스틸 샷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "매물 접수 및 매수 신청 의뢰 문의",
        subtitle: "상담 희망 일시, 매물 매물 구분 선택(아파트/상가/토지), 거래 유형(매매/전세/월세)을 기재해 예약해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "중개 컨설팅 신청 완료"
        }
      }
    ]
  },

  senior_silver_town: {
    templateId: "senior_silver_town",
    name: "아모르 파티 프리미엄 실버 레지던스",
    category: "Real Estate",
    description: "마음의 평온을 주는 차분한 웰빙 시안 그린과 맑은 하늘빛 시안 블루, 그리고 활력을 주는 헬시 에메랄드 그린 배합으로 은퇴 은퇴 부모님들의 건강과 안식을 보좌하는 고격조 실버타운 테마입니다.",
    image: "/templates/senior_silver_town.png",
    theme: {
      fontFamily: "Noto Serif KR, Inter, sans-serif",
      colors: {
        primary: "#155e75",     // 안정을 주는 딥 시안 그린
        secondary: "#06b6d4",   // 맑고 편안한 스카이 블루
        accent: "#10b981",      // 활기찬 헬시 에메랄드
        background: "#ecfeff",  // 눈이 편안한 소프트 민트 오프화이트
        surface: "#ffffff",     // 순백의 가구 화이트
        text: "#083344"         // 가독성이 탁월한 딥 딥 블루 먹색
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "24시간 하이케어 하이케어 건강 관리 비서와 정겨운 정원 속 노후의 파라다이스",
        subtitle: "찬바람이 불면 관절을 저미게 하고 병원 응급실 한 번 가기 힘든 삭막한 시티 지하실 거처를 단호히 꺼버리십시오. 아모르 레지던스 방식으로, 원내 대학병원급 전문 정밀 간호 의료 초소와, 365일 삼시세끼 저염 웰빙 식단 서빙, 그리고 1,200평 천연 소나무 숲길 산책로를 완비한 최고급 실버 주택입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "레지던스 입주 설명회 예약",
          ctaLink: "#contact",
          features: [
            { text: "보증금 금융 안전 가이드 에스크로 연동 RLS RLS 관리 보안 보증" },
            { text: "체크인 시 부모님 부모님 전용 웰빙 온열 안마 하드 매트리스 무상 대여 및 천연 허브 허브 아로마 오일 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "실버 케어 케어 서비스",
        subtitle: "어르신들의 두뇌 두뇌 인지 활력과 물리적 신체 건강을 최고조로 이끄는 고품격 케어 라인업입니다.",
        content_data: {
          items: [
            {
              title: "24H 무선 바이탈 케어 스캔",
              description: "손목의 밴드를 통해 맥박과 혈압을 실시간 수기 자동 감지하고 비상시 의료팀에 0.1초 만에 핑을 쏘는 안전망입니다.",
              icon: "Heart"
            },
            {
              title: "365 영양사 저염 웰빙 식단 식단",
              description: "참나무 백탄 위에 기른 친환경 유기농 야채와 신선한 시푸드를 매끼 3면 뷔페 형식으로 서빙하는 웰빙입니다.",
              icon: "Award"
            },
            {
              title: "수묵 문학 캘리그래피 클래스",
              description: "지적 지적 인지 훈련을 위해 벼루에 직접 먹을 갈며 내면의 생각을 원고지에 적는 힐링 예술 워크숍입니다.",
              icon: "PenTool"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "실버타운은 단순히 노년을 의탁하는 요양 시설이 아닌, 그동안 쌓아올린 지성의 완숙함을 동료들과 함께 유쾌하게 소통하며 삶의 진짜 아름다운 마침표를 장식하는 성스러운 낙원입니다",
        subtitle: "모든 레지던스 객실은 입주자 편의를 위해 무단 단차 시공을 거쳐 휠체어 이동을 보장합니다.",
        content_data: {
          description: "안녕하십니까. 아모르 파티 실버 레지던스의 원장 카터입니다. 우리는 부모님들의 고독을 방조하고 영양가 없는 공산품 식단으로 건강을 훼손하는 불법 요양 요양 샵들을 단호히 거부합니다. 우리는 100% 친환경 공기 살균 드라이 필터를 가동하고, 쾌적하고 위생적인 노천 스파 온수 온수 샤워장을 상시 관리하며, 부모님들의 안전하고 평화로운 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 예약 입주 가구", value: "350세대 돌파" },
            { label: "소속 전담 간호 의료진", value: "14명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아늑한 자작나무 벽난로 & 온수 스파",
        subtitle: "사진 한 장만으로도 평화로운 햇살과 허브 향취가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "벽돌 벽난로 아래 안락의자 뷰", description: "아늑한 핀 조명 아래서 부모님이 책을 읽으시는 따스한 웰빙 웰컴 라운지 거실 뷰", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "소나무 가득한 야외 산책로 전경", description: "어두운 밤 노을 아래 정원 분수가 아날로그 조명 조명 빛을 받아 평화롭게 정박된 야외 뷰", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "허브 디톡스 아로마 티 스냅 스냅", description: "원목 테이블 위에 에메랄드 유리 컵 드링크 잔과 레몬 슬라이스 가니쉬, 그리고 따뜻한 웰컴 드링크 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "입주 설명회 신청 및 잔여 실 예약",
        subtitle: "방문 예정 일시, 설명회 참석 인원수, 입주 입주 예정 대상자의 건강 건강 등급 상태를 기재해 신청하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "설명회 참석 예약"
        }
      }
    ]
  },

  smart_building_proptech: {
    templateId: "smart_building_proptech",
    name: "프롭테크 테크 빌딩 스마트 인프라",
    category: "Real Estate",
    description: "미래지향적인 스마트 테크 블루와 일렉트릭 인디고, 그리고 형광 라임 그린 포인트 배합으로 Proptech 분양 예측 및 스마트 인텔리전트 빌딩 관리 전용 테마입니다.",
    image: "/templates/smart_building_proptech.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#2563eb",     // 테크 스마트 블루
        secondary: "#4f46e5",   // 가상현실 일렉트릭 인디고
        accent: "#10b981",      // 형광 네온 에메랄드 그린
        background: "#0f172a",  // 미래형 카본 빌딩 다크
        surface: "#1e293b",     // 데이터 서버 랙 차콜 메탈 카드
        text: "#f8fafc"         // 시인성 극대화 화이트 그레이
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "초고성능 빅데이터 예측 엔진으로 빌딩 자산 가치를 과학적으로 해킹하다",
        subtitle: "주먹구구식 오프라인 등기 거래 정보와 부동산 브로커의 거짓 감언이설에 중독되셨나요? 프롭테크 테크 빌딩 방식으로, 초당 100만 회 연산 AI 시세 판정 판정과, 분산 원장 데이터 가이드 RLS 보안망, 그리고 스마트 에너지 조율 장치를 탑재한 인텔리전트 빌딩 관리 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스마트 스마트 빌딩 솔루션 실행",
          ctaLink: "#services",
          features: [
            { text: "글로벌 부동산 엔지니어 크루들의 엄격한 데이터 가독성 가독성 테스트 통과 보증" },
            { text: "주간 부동산 자산 가치 변동 및 무료 분산 원장 레포트 레터 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "Proptech 스택 스택",
        subtitle: "귀사의 빌딩 자산 가치를 딜레이 제로로 무결점 수확하는 첨단 솔루션 라인업입니다.",
        content_data: {
          items: [
            {
              title: "AI 부동산 매입 가치 가치 스캔",
              description: "매물 등기부동본 상의 저당 비율과 주변 상가 실시간 유동 인구를 스캔 분석하여 예상 매출을 진단하는 공학입니다.",
              icon: "Cpu"
            },
            {
              title: "분산 분산 원장 블록 보안 팩",
              description: "거래 데이터를 해킹이 불가한 분산 원장에 핑을 새겨 RLS로 상시 안전하게 보호하는 보안 인프라입니다.",
              icon: "Shield"
            },
            {
              title: "기가 기가 스마트 에너지 컨트롤",
              description: "실내 조도를 낮과 밤의 자연광에 동기화해 자동 조율 제어하여 전기 요금을 45% 세이브해 주는 장치입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "프롭테크는 단순히 부동산에 IT 껍데기를 씌운 속임수가 아닌, 데이터와 알고리즘의 정직함을 통해 복잡한 부동산 시장을 사용자 중심으로 민주화하는 위대한 도구입니다",
        subtitle: "모든 코딩 데이터는 신뢰를 위해 오픈소스 깃허브 원장으로 실시간 공유됩니다.",
        content_data: {
          description: "안녕하십니까. 프롭테크 테크 빌딩 솔루션의 오너 엔지니어 그리더입니다. 우리는 허위 매물 정보로 시장의 신뢰를 깨고 복잡한 수수료로 사용자에게 불쾌한 눈총을 유발하는 불량 플랫폼들을 단호히 거부합니다. 우리는 100% 무독성 필터 장치를 가동하며, 쾌적하고 투명한 아날로그 자산 안식을 수호하기 위해 밤새 코딩을 이어가겠습니다.",
          stats: [
            { label: "누적 거래 연산 횟수", value: "3,500만 돌파" },
            { label: "구비된 데이터 백업 서버", value: "2세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "은빛 모니터 랙 & 프롭테크 빌딩 룸",
        subtitle: "사진 한 장만으로도 스마트한 비즈니스 에너지가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "듀얼 모니터가 켜진 1인 코딩 책상", description: "아늑한 핀 조명 아래 기계식 키보드와 시안 블루 폰트가 켜진 맥북 모니터 가구 뷰", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80" },
            { title: "기가 데이터 센터 서버 랙 전경", description: "어두운 밤 노을 아래 소나무 조형물들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 안내 데스크", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "금색 도어 키홀더 액세서리 스냅", description: "원목 테이블 위에 에스프레소 아로마 오일 웰컴 컵 두 잔과 골드 금 키홀더 액세서리 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "엔터프라이즈 솔루션 제안 및 상담 예약",
        subtitle: "상담 희망 일시, 관심 비즈니스 서비스 선택, 빌딩 사옥 사옥 규모, RLS 보안망 구축 문의를 기재해 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "솔루션 도입 상담 예약"
        }
      }
    ]
  },

  overseas_real_estate: {
    templateId: "overseas_real_estate",
    name: "글로벌 리치 해외 부동산 투자 컨설팅",
    category: "Real Estate",
    description: "글로벌하고 기품 있는 로열 인디고 블루와 은은한 샴페인 브론즈 골드, 맑은 석고 베이지 배합으로 해외 주택 분양과 럭셔리 부동산 자산 포트폴리오를 설계하는 컨설팅 테마입니다.",
    image: "/templates/overseas_real_estate.png",
    theme: {
      fontFamily: "Playfair Display, Inter, sans-serif",
      colors: {
        primary: "#1e1b4b",     // 글로벌 로열 인디고 블루
        secondary: "#d97706",   // 샴페인 브론즈 골드 광원
        accent: "#0369a1",      // 오션 에메랄드 블루 포인트
        background: "#f8fafc",  // 쾌적하고 럭셔리한 대리석 오프화이트
        surface: "#ffffff",     // 순백의 마스터 계약서 화이트
        text: "#1e1b4b"         // 기품 있는 로열 인디고 블랙
      },
      borderRadius: "rounded-lg",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지평선 너머 글로벌 기적의 필지에 투자하고, 대를 이어갈 자산 유산을 상속하다",
        subtitle: "좁고 규제가 가득해 성장이 멈춘 국내 가성비 닭장 아파트 시장을 단호히 탈출하십시오. 글로벌 리치 방식으로, 연 8% 이상 배당 배당 안정 수익을 보장하는 뉴욕 펜트하우스와, 발리 독채 풀빌라, 그리고 글로벌 세무 세무 변호사 법률 가이드를 완비한 VIP 자산 관리 시스템입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1548200870-244a2df4d8a1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "해외 매물 VIP 설명회 신청",
          ctaLink: "#contact",
          features: [
            { text: "미국 뉴욕 주정부 주정부 및 글로벌 부동산 협회 공식 등록 정식 계약 보증 체결 완료" },
            { text: "체크인 시 가방 전용 금 도어 키 홀더 및 소믈리에 엄선 웰컴 샴페인 음료 패키지 무상 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "투자 서비스",
        subtitle: "글로벌 부동산 투자 성공의 첫 프레임을 신뢰성 높게 빌드업하는 마스터 라인업입니다.",
        content_data: {
          items: [
            {
              title: "글로벌 법률 및 세무 에스크로",
              description: "해외 부동산 취득 시 복잡한 외국계 은행 저당 세무 분석과 취득 취득 세금을 1:1 수기 자동 진단 조율하는 서비스입니다.",
              icon: "Briefcase"
            },
            {
              title: "오션 뷰 리조트 위탁 매니지",
              description: "매입하신 해외 리조트의 임대 수익 관리를 위해 현지 전문 매니저 크루를 매칭하고 매달 수익을 분산 송금합니다.",
              icon: "TrendingUp"
            },
            {
              title: "VIP 프라이빗 쇼룸 투어",
              description: "현지 VIP 차량 픽업부터 비공개 쇼룸 입장권 제공까지 원스톱으로 리드해 주는 하이엔드 투자 비서 서비스입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "해외 투자는 단순히 낯선 대지에 돈을 묻는 투기가 아닌, 글로벌 문명의 중심에 내 영토를 구축하고 시대를 초월하는 영속적 자산의 방패를 직조해 나가는 거룩한 설계입니다",
        subtitle: "모든 투자 상담은 철저한 프라이버시 보장을 위해 100% 비밀 계약 유지를 준수합니다.",
        content_data: {
          description: "안녕하십니까. 글로벌 리치 투자 에이전시 대표 파트너 디렉터입니다. 우리는 확실한 실물 현장 실사나 안전 장치도 없이 터무니없는 고수익만을 과장하여 고객에게 불쾌한 손실을 유발하는 부실 분양 마피아들을 단호히 거부합니다. 우리는 100% 안전 등급 은행 에스크로만을 기저에 두어 자산을 수호하겠습니다.",
          stats: [
            { label: "연간 거래 체결 펀드 규모", value: "3,500만 달러" },
            { label: "소속 글로벌 변호사 감리단", value: "8명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "뉴욕 센트럴 펜트하우스 & 발리 리조트",
        subtitle: "사진 한 장만으로도 눈부신 해외 자산의 품격과 노을빛 앰버 무드가 번져나는 전경입니다.",
        content_data: {
          items: [
            { title: "센트럴파크가 조망되는 유리 거실", description: "아늑한 핀 조명 아래 크리스탈 와인 글라스 웰컴 컵이 예쁘게 수놓아진 럭셔리 라운지 룸 전경", image: "https://images.unsplash.com/photo-1548200870-244a2df4d8a1?auto=format&fit=crop&w=600&q=80" },
            { title: "인피니티 풀 수영장 하늘 뷰", description: "하얀 콘크리트 기둥과 은빛 물결이 주황빛 노을 조명을 받아 세련되게 정박된 야외 테라스 공간", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "금색 도어 키홀더 액세서리 스냅", description: "원목 테이블 위에 에스프레소 아로마 오일 웰컴 컵 두 잔과 골드 금 키홀더 액세서리 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "비공개 1:1 투자 투자 상담 신청",
        subtitle: "상담 희망 일시, 관심 국가 선택(미국/일본/발리/유럽), 투자 가용 예산 규모를 기재해 VIP 상담을 신청하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "VIP 투자 상담 예약"
        }
      }
    ]
  },

  monthly_rental_studio: {
    templateId: "monthly_rental_studio",
    name: "대학가 쾌적한 에코 원룸 & 오피스텔",
    category: "Real Estate",
    description: "싱그럽고 활기찬 생귤 렌지 오렌지와 상큼한 피치 코랄, 그리고 눈의 피로를 덜어주는 에코 민트 그린 배합으로 대학생과 싱글족을 위한 1인 원룸 오피스텔 테마입니다.",
    image: "/templates/monthly_rental_studio.png",
    theme: {
      fontFamily: "Outfit, Pretendard, sans-serif",
      colors: {
        primary: "#f97316",     // 생귤 오렌지
        secondary: "#fdba74",   // 부드러운 피치 오렌지
        accent: "#22c55e",      // 싱그러운 에코 그린
        background: "#fff7ed",  // 포근한 오렌지 오프화이트
        surface: "#ffffff",     // 정갈한 책상 책상 화이트
        text: "#431407"         // 가독성이 탁월한 오렌지 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "보증금 날릴 걱정 없는 안전 에스크로 RLS 보안망과 아기자기한 오렌지 쉼터",
        subtitle: "등기부등본 권리 분석도 안 해주고 불법 쪼개기 시공으로 벌레와 방음 소음에 시달리게 만드는 비양심 매물들을 단호히 거부합니다. 에코 원룸 방식으로, 보증금 안전 RLS 에스크로 에스크로 연동과, 매달 무료 세탁 스태프 서포터즈, 그리고 캡슐 커피 무제한 제공 제공 바가 구비된 내 청춘의 안식처입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
          ctaText: "현재 예약 가능한 빈방 보기",
          ctaLink: "#services",
          features: [
            { text: "한국주택공사 보증 보험 및 주택 임대 안심 공제 증서 100% 100% 발급 완료 보증" },
            { text: "체크인 시 실내 오가닉 슬리퍼 및 친환경 대나무 섬유 타월 세트 무료 무료 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "원룸 서비스",
        subtitle: "1인 거주자의 독립 생활 편의와 아늑한 안식을 최고조로 이끄는 고품격 라인업입니다.",
        content_data: {
          items: [
            {
              title: "1인 단독 풀옵션 가구 세팅",
              description: "고밀도 친환경 매트리스 침대와 빌트인 옷장 책상 랙이 세련되게 피팅되어 있어 캐리어 하나만 들고 입주하면 끝납니다.",
              icon: "Briefcase"
            },
            {
              title: "기가 파이버 무선 무선 와이파이",
              description: "과제나 인디 게임 작업 시 버퍼링이 없는 초고속 기가 회선을 딜레이 제로로 무제한 제공합니다.",
              icon: "Zap"
            },
            {
              title: "주말 브런치 커피 커피 살롱",
              description: "공유 키친 카운터에 모여 갓 구운 토스트와 아로마 오일 에스프레소를 즐기는 다정한 소모임 펍입니다.",
              icon: "Coffee"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "원룸은 단순히 밤에 잠만 자는 자취방이 아닌, 사회로 첫발을 내디딘 청춘들이 꿈을 향해 몰입하고 내일을 위해 온전히 힐링하는 신성한 독립 영토입니다",
        subtitle: "모든 룸은 위생 관리를 위해 해충 방제 소독 및 수기 안심 방역을 주간 집행합니다.",
        content_data: {
          description: "안녕하십니까. 에코 원룸 스튜디오의 오너 매니저입니다. 우리는 세입자의 안전을 뒷전으로 미루고 소화기 하나 구비하지 않는 부실 원룸들을 단호히 거부합니다. 우리는 100% 미세먼지 차단 청정 필터 환기 시설을 가동하고, 쾌적하고 위생적인 개별 온수 보일러 장치를 상시 관리하며, 청춘들의 따뜻하고 안전한 주거 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 연대 거주 학생 수", value: "350명 돌파" },
            { label: "운영 중인 오피스텔 룸", value: "48개 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "포근한 자작나무 책상 & 주말 커피 바",
        subtitle: "사진 한 장만으로도 평화로운 아날로그 감성과 커피 커피 향취가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "원목 책상 위 세팅된 노트북 스냅", description: "아늑한 핀 조명 아래 기계식 키보드와 주황색 시안 블루 폰트가 켜진 맥북 모니터 가구 뷰", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" },
            { title: "공유 북 살롱 아늑한 서재 코너", description: "어두운 밤 노을 아래 소나무 조형물들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 안내 데스크", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "에스프레소 아메리카노 드링크 샷", description: "원목 테이블 위에 에스프레소 아로마 오일 웰컴 컵 두 잔과 골드 금 키홀더 액세서리 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공실 문의 및 방문 상담 예약",
        subtitle: "방문 예정 일시, 희망하는 보증금/월세 예산대, 입주 희망일, 선호하는 층수를 작성해 예약 신청을 해주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "방문 상담 신청 완료"
        }
      }
    ]
  },

  country_farm_farmstead: {
    templateId: "country_farm_farmstead",
    name: "힐링 팜스테드 전원 농가 주택",
    category: "Real Estate",
    description: "따스하고 부드러운 흙빛 클레이 브라운과 머스타드 옐로우, 그리고 싱그러운 클로버 그린 배합으로 은퇴 은퇴 부부와 자연 속 주말 힐링을 바라는 텃밭 전원 주택 테마입니다.",
    image: "/templates/country_farm_farmstead.png",
    theme: {
      fontFamily: "Georgia, Noto Serif KR, serif",
      colors: {
        primary: "#854d0e",     // 흙빛 꿀 클레이 브라운
        secondary: "#ca8a04",   // 들판 머스타드 옐로우
        accent: "#15803d",      // 싱그러운 클로버 그린
        background: "#fefcbf",  // 햇살 가득한 노랑 틴트 웜 오프화이트
        surface: "#ffffff",     // 깨끗한 원목 테이블 화이트
        text: "#422006"         // 가독성이 탁월한 딥 브라운
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "참나무 백탄 위에 마시멜로를 굽고, 내 마당 텃밭에서 싱싱한 배추를 수확하다",
        subtitle: "매연 연기와 콘크리트 미세 가루가 폴폴 풍기고 얌체 주차 소음이 들끓는 불쾌한 도시 생활을 단호히 탈출하십시오. 힐링 팜스테드 방식으로, 100평 잔디 잔디 구장과, 내 손으로 직접 직접 일구는 친환경 유기농 텃밭, 그리고 화로 바비큐 그릴을 완비한 나만의 단독 텃밭 농가주택 분양 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
          ctaText: "텃밭 주택 필지 보기",
          ctaLink: "#services",
          features: [
            { text: "친환경 천연 단열재 1등급 통과 목조 공조 시스템 적용으로 아토피 예방 예방 보증" },
            { text: "체크인 시 자작나무 원목으로 가공한 개인 미플 인형 장식 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "팜스테드 혜택",
        subtitle: "대지의 따뜻함과 흙의 생명력을 최고조로 수확하여 삶에 평온을 주는 고품격 힐링 리스트입니다.",
        content_data: {
          items: [
            {
              title: "자작나무 황토 텃밭 케어",
              description: "참나무 백탄 위에 기른 유기농 상추, 토마토 등을 내 텃밭에서 물성 본연의 생명력으로 키워내는 농가 웰빙 루틴입니다.",
              icon: "Heart"
            },
            {
              title: "태양광 온돌 난방 공학",
              description: "지붕에 탑재된 태양광 패널을 가동하여 겨울철 매서운 겨울 바람 속에서도 방바닥 온도를 수기 조율하는 난방입니다.",
              icon: "Zap"
            },
            {
              title: "야외 잔디 바베큐 파티",
              description: "소나무 울타리 너머 화로 숯불 위에 바베큐 꼬치 구이를 굽고 동료들과 맥주를 쉐어하는 유쾌한 네트워킹입니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "농가 주택은 단순히 가성비 시골방이 아닌, 도시라는 물욕의 감옥에서 벗어나 자연과 내가 수평으로 동기화되어 내면의 상처를 치유하는 성스러운 힐링 텃밭 영토입니다",
        subtitle: "모든 시설은 쾌적함을 위해 정기 피톤치드 살균 살균 및 공기 드라이 환기를 매주 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 힐링 팜스테드의 크레이티브 파트너 카터입니다. 우리는 앞집 벽돌 벽과 마주 보며 프라이버시가 차단당하고 시멘트 가루가 머리를 아프게 하는 아파트 닭장들을 단호히 거부합니다. 우리는 마당에 오직 울창한 소나무를 심어 쾌적한 안식처를 빌드하며, 당신만의 은밀하고 세련된 힐링 농가 라이프를 수호하겠습니다.",
          stats: [
            { label: "누적 분양 전원 주택 수", value: "120개동 돌파" },
            { label: "소속 프로 조경 마스터", value: "8명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "포근한 자작나무 벽난로 & 가을 텃밭",
        subtitle: "사진 한 장만으로도 평화로운 솔바람과 흙냄새가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "황토 벽돌 가옥과 가을 밭 뷰", description: "아늑한 핀 조명 아래 원목 책상과 카푸치노 웰컴 웰컴 잔이 예쁘게 수놓아진 아담한 거실 뷰", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80" },
            { title: "소나무 숲속의 전원 농가 주택", description: "어두운 밤 노을 아래 소나무 숲에 둘러싸인 아날로그 램프 핀 조명이 평화롭게 빛나는 야외 뷰", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "마시멜로와 삼겹살 화로 숯불 스냅", description: "황동 화로대 위에서 꼬치 샌드위치가 연기를 뿜으며 노릇하게 익어가는 로맨틱한 캠핑 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "필지 분양 문의 및 쇼룸 투어 신청",
        subtitle: "방문 예정 일시, 분양 예약 필지 면적대, 희망 주택 평수, 오프그리드 빗물 팩 추가 여부를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "농가 주택 상담 신청"
        }
      }
    ]
  },

  golf_luxury_estate: {
    templateId: "golf_luxury_estate",
    name: "페어웨이 뷰 럭셔리 골프 빌리지",
    category: "Real Estate",
    description: "싱그럽고 깊은 페어웨이 숲그린과 따스한 샌드 브론즈 브라운, 그리고 찬란한 선 골드 액센트 배합으로 골드 클래스 챔피언십 골프장 조망권을 소유한 명품 빌리지 에스테이트 테마입니다.",
    image: "/templates/golf_luxury_estate.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#14532d",     // 페어웨이 딥 숲그린
        secondary: "#854d0e",   // 샌드 시더 브론즈 브라운
        accent: "#eab308",      // 챔피언십 트로피 선 골드
        background: "#f4f8f4",  // 눈이 편안한 그린 틴트 오프화이트
        surface: "#ffffff",     // 순백의 마블 가구 화이트
        text: "#052e16"         // 시인성 높은 포레스트 네이비 그린
      },
      borderRadius: "rounded-lg",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "내 집 거실 문을 열면 끝없이 펼쳐진 초록빛 페어웨이가 나만의 정원이 되다",
        subtitle: "매연 연기가 가득하고 매일 아침 등교 소음과 이웃 불법 주차 시비로 피로를 유발하는 일반 주택 지구를 단호히 탈출하십시오. 페어웨이 에스테이트 방식으로, 거실 발코니 바로 아래 1번 홀 홀컵 조망 파노라마 뷰와, 개인 전용 카트 전용 차고지, 그리고 골프장 영구 이용권을 완비한 명품 레지던스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
          ctaText: "빌리지 특별 분양 안내",
          ctaLink: "#contact",
          features: [
            { text: "골프 레전드 챔피언이 직접 조경 디렉션에 참여한 마스터 피스 필지 보증" },
            { text: "체크인 시 가방 전용 금 도어 키 홀더 및 소믈리에 엄선 샴페인 웰컴 플레이팅 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에스테이트 혜택",
        subtitle: "골드 클래스 입주민의 프라이빗한 비즈니스 소통과 안식을 최고조로 보좌하는 명품 서비스입니다.",
        content_data: {
          items: [
            {
              title: "개인 전용 스마트 골프 카트",
              description: "내 차고지에서 충전하여 즉시 페어웨이 라운드로 다이렉트 진입할 수 있는 친환경 카트가 기본 빌트인 지급됩니다.",
              icon: "Navigation"
            },
            {
              title: "클럽하우스 쉐프 다이닝 바",
              description: "참나무 백탄 위에 그릴드한 랍스터 테일과 와인 마리아주를 매일 저녁 입주민 특혜 회원가로 즐기는 힐링 코스입니다.",
              icon: "Award"
            },
            {
              title: "기가 웰니스 프라이빗 헬스",
              description: "24시간 전담 헬스 스태프가 정박 가동하는 입주자 전용 온수 테라피 스파와 헬스룸을 무제한 무료 제공합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "골프 빌리지는 단순히 집을 짓는 시공 계약이 아닌, 평생을 일궈온 자산의 명예와 지적인 품격을 대자연의 초록빛 페어웨이 위에 새겨내는 위대한 상속 예술입니다",
        subtitle: "모든 프라이빗 룸은 조화를 위해 스팀 카펫 살균 및 마호가니 왁싱 관리를 매주 집행합니다.",
        content_data: {
          description: "안녕하십니까. 페어웨이 럭셔리 에스테이트의 총괄 매니저 카터입니다. 우리는 앞집 창문과 가벽이 맞부딪쳐 프라이버시가 훼손되는 가성비 전원주택 필지들을 단호히 거부합니다. 우리는 마당에 오직 천연 소나무를 심어 쾌적한 안식처를 빌드하며, 당신만을 위한 세련된 골프 라이프를 약속하겠습니다.",
          stats: [
            { label: "분양 완료 마스터 펜트하우스", value: "24세대 한정" },
            { label: "소속 프로 레슨 코치 스태프", value: "8명 상시 대기" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "초록빛 페어웨이 정원 & 대리석 로비",
        subtitle: "사진 한 장만으로도 가슴이 웅장해지는 솔바람 비주얼이 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "탁 트인 1번 홀 잔디밭 거실 뷰", description: "아늑한 핀 조명 아래 크리스탈 와인 글라스 웰컴 컵이 예쁘게 수놓아진 럭셔리 라운지 룸 전경", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
            { title: "개인 카트 정박용 원목 차고지", description: "어두운 밤 노을 아래 소나무들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 안내 데스크", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "금색 도어 키홀더 액세서리 스냅", description: "원목 테이블 위에 에스프레소 아로마 오일 웰컴 컵 두 잔과 골드 금 키홀더 액세서리 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "빌리지 쇼룸 예약 및 개별 분양 상담",
        subtitle: "방문 예정 일시, 분양 예약 필지 면적대, 동반 VIP 인원수, 선호하시는 웰컴 와인 스타일을 적어 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "빌리지 투어 상담 예약"
        }
      }
    ]
  },

  industrial_warehouse_logistics: {
    templateId: "industrial_warehouse_logistics",
    name: "기가 허브 테크 물류창고 & 산업 단지",
    category: "Real Estate",
    description: "묵직하고 기계적인 슬레이트 스틸 그레이와 탄소 블랙, 그리고 안전 주의 경고 네온 옐로우 액센트로 대규모 물류 및 제조 제조 지능형 공장 임대 전용 테마입니다.",
    image: "/templates/industrial_warehouse_logistics.png",
    theme: {
      fontFamily: "Inter, Space Grotesk, sans-serif",
      colors: {
        primary: "#4b5563",     // 기계적인 슬레이트 스틸 그레이
        secondary: "#1f2937",   // 묵직한 탄소 카본 차콜
        accent: "#eab308",      // 안전 경고 네온 옐로우
        background: "#f3f4f6",  // 거친 콘크리트 슬라브 라이트 그레이
        surface: "#ffffff",     // 정갈한 오피스 가구 화이트
        text: "#111827"         // 시인성 높은 제트 블랙
      },
      borderRadius: "rounded-none", // 산업 현장의 신속한 효율을 위해 곡률 제로
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "40피트 컨테이너가 딜레이 제로로 자동 분류 분류 접안되는 스마트 지능형 물류 기지",
        subtitle: "층고가 낮아 지입차가 진입하기 힘든 노후 낙후된 창고와 스프링클러 소화 배선이 고장 나 화재 무방비 노이즈에 시달리는 비위생 창고들을 단호히 거부합니다. 기가 허브 물류 방식으로, 층고 10미터 보증과, 진입 차선 무관 폭 12미터 도크, 그리고 초고속 기가 파이버 RLS 스마트 보안 보안 인프라를 완비한 대형 산업용 부동산입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "보유 창고 필지 현황",
          ctaLink: "#services",
          features: [
            { text: "소방청 화재 안전 정밀 진단 1등급 인증 및 수출입 화물 보관 필증 100% 보증 발급 완료" },
            { text: "체크인 시 스태프 전용 친환경 무릎 보호대 세트 및 황사 먼지 차단 전술 마스크 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "허브 프로그램",
        subtitle: "유통 물류 효율성과 신속한 입출고 회전율을 최고조로 이끄는 테크니컬 스펙트럼입니다.",
        content_data: {
          items: [
            {
              title: "10미터 초고층 렉 랙 설치",
              description: "스포티하고 단단한 무쇠 앵글 랙을 빌드업 피팅하여 무거운 기계 부품과 종이 박스를 수직으로 안전하게 적재합니다.",
              icon: "Sliders"
            },
            {
              title: "자동 온습도 수기 조율 센서",
              description: "원내 탑재된 스마트 센서를 가동하여 겨울철 매서운 겨울 바람 속에서도 실내 습도를 적정히 제어해 의류 변색을 방지합니다.",
              icon: "Thermometer"
            },
            {
              title: "3M 차단 방역 청결 가이드",
              description: "화물 입고 즉시 외부 미세 가루와 유해 해충을 완전 에어 샤워실로 차단하여 청정 유통 상태를 엄수 수호합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "물류 창고는 단순히 화물을 쌓아두는 어두운 지하실이 아닌, 글로벌 비즈니스의 모든 공급 사슬 매커니즘이 원활하게 순환되도록 돕는 가장 위대하고 정직한 기계 장치입니다",
        subtitle: "모든 산업용 필지는 유실 우려를 제로로 제어하기 위해 24H CCTV 관제 보안 보안 시스템을 가동합니다.",
        content_data: {
          description: "안녕하십니까. 기가 허브 산업용 부동산 총괄 이사 카터입니다. 우리는 계약금만 가로채고 시멘트 벽에 균열 하자가 가득해 누수 결로 문제를 일으키는 부실 시공 공장들을 단호히 거부합니다. 우리는 오직 무강도 특수 콘크리트 슬라브 자재만을 시공 기저에 두어 높은 하중 지지력을 약속하며, 귀사 비즈니스의 원활한 유통 안식을 수호하겠습니다.",
          stats: [
            { label: "연간 입출고 화물 총량", value: "3,500만 톤" },
            { label: "소속 지입차 유도 아키텍트", value: "8명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "웅장한 컨테이너 도크 & 자동 랙 룸",
        subtitle: "사진 한 장만으로도 신속한 유통 유통 에너지가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "컨테이너 지입차가 정박된 도크 뷰", description: "아늑한 핀 조명 아래 대형 화물 탑차가 세련되게 정렬된 카운터 물류 터미널 단독 뷰", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80" },
            { title: "자동화 로봇 정박용 서버 랙 전경", description: "어두운 밤 노을 아래 소나무 조형물들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 안내 데스크", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "금색 도어 키홀더 액세서리 스냅", description: "원목 테이블 위에 에스프레소 아로마 오일 웰컴 컵 두 잔과 골드 금 키홀더 액세서리 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "창고 임대 문의 및 부지 방문 예약",
        subtitle: "방문 예정 일시, 임대 임대 목적(단순 보관/제조/냉동), 필요 면적대, RLS 보안망 구축 문의를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "물류 창고 투어 예약"
        }
      }
    ]
  },

  renovated_old_house: {
    templateId: "renovated_old_house",
    name: "빈티지 리노베이션 구옥 아틀리에 주택",
    category: "Real Estate",
    description: "고풍스럽고 다정한 흙벽 벽돌 브라운과 은은한 황토 웜 크림, 그리고 감각적인 에메랄드 그린 패티나 포인트 배합으로 구옥 리노베이션 및 빈티지 아틀리에 전용 주거 테마입니다.",
    image: "/templates/renovated_old_house.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#78350f",     // 고전 붉은 기와 벽돌 브라운
        secondary: "#b45309",   // 따스한 가로등 앰버 오렌지
        accent: "#0d9488",      // 감각적인 청동 틸 그린
        background: "#fafaf9",  // 정갈한 석고 웜 크림 오프화이트
        surface: "#ffffff",     // 하얀 원고지 화이트
        text: "#292524"         // 눈이 편안한 리치 브라운 먹색
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오래된 구옥 기와의 빗물 자국을 예술로 보존하고, 내부엔 스마트를 심다",
        subtitle: "시멘트 화학 독기와 미세 유해 먼지가 가득한 신축 성냥갑 아파트 분양 사기 시공을 단호히 거부합니다. 리노베이션 스튜디오 방식으로, 수십 년 된 소나무 들보 서까래 골조는 그대로 노출 연출하고, 주방엔 안면 인식 가스 밸브 차단 장치와 스마트 월패드 셋업을 완비한 뉴트로 아틀리에입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "리노베이션 매물 투어",
          ctaLink: "#contact",
          features: [
            { text: "건축 구조 기술사의 정밀 구조 안전 진단 무결점 1등급 통과 통과 필증 보증" },
            { text: "체크인 시 가죽 소재 전용 아날로그 열쇠 고리 및 웰컴 자스민 차 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아틀리에 프로그램",
        subtitle: "고전 미학과 현대적 문명의 편리함이 조화롭게 소통하는 프리미엄 뉴트로 라인업입니다.",
        content_data: {
          items: [
            {
              title: "오래된 가구 & 한지 복원 클래스",
              description: "공방 카운터 조명 아래서 직접 사포질을 하고 천연 호두 기름을 칠해 아날로그 텍스처 가구를 복원합니다.",
              icon: "PenTool"
            },
            {
              title: "기가 기가 빗물 순환 온돌 쉘터",
              description: "황토 구들장 위에 참나무 백탄 숯불 장작을 피워 겨울철 바람 속에서도 실내를 훈훈하게 조율하는 난방입니다.",
              icon: "Flame"
            },
            {
              title: "와인 & 디저트 수제 마리아주",
              description: "원목 바 테이블 위에 얇게 썬 레몬 가니쉬와 프랑스 화이트 와인 두 잔 플레이팅 웰컴 셋을 대접받는 코스입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "구옥 리노베이션은 단순히 낡은 집을 헐어 파괴하는 난개발이 아닌, 세월의 빗물이 새긴 흔적 속에 깃든 이야기를 존중하며 현대 청년의 감성으로 리디자인하는 거룩한 역사적 직조입니다",
        subtitle: "모든 리뉴얼 가옥은 거주 편의를 위해 층간 방음재 시공을 성실 집행합니다.",
        content_data: {
          description: "안녕하십니까. 빈티지 구옥 아틀리에의 디렉터 카터입니다. 우리는 눈앞의 중개 이익에 눈이 멀어 뼈대조차 엉성한 노후 가옥을 속여 팔아 세입자에게 사후 골칫거리를 조장하는 행위를 단호히 거부합니다. 우리는 100% 친환경 천연 오일 자재만을 마스터 시공 기저에 두어 아늑한 향취를 제공하고, 당신만의 고요하고 신나는 안식처를 수호하겠습니다.",
          stats: [
            { label: "누적 입주 아틀리에 주택", value: "35세대 완판" },
            { label: "소속 전문 감리 아키텍트", value: "8명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "붉은 벽돌 지하실 무대 & 아날로그 서재",
        subtitle: "사진 한 장만으로도 바랜 종이 냄새와 커피 커피 아로마가 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "샹들리에 아래 대리석 바 거실", description: "어두운 목조 벽면 코너에 촛불 하나와 와인 잔, 그리고 상영 스케줄 시트가 이쁘게 세팅된 테이블 좌석", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
            { title: "독일제 35mm 필름 필름 영사 기계실", description: "은빛 릴 바퀴가 회전하며 영사 렌즈 빛줄기를 무대 스크린 속으로 시크하게 쏘아 올리는 정교한 조리 현장", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 초콜릿 퐁듀와 화이트 와인 스냅", description: "원목 바 테이블 위에 얇게 썬 레몬 조각 가니쉬 디저트와 투명한 유리 컵 두 잔 스케치 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "구옥 투어 투어 신청 및 개조 상담",
        subtitle: "방문 예정 일시, 예약 룸 선택, 희망 시공 예산대, 인프라 RLS 보안망 구축 문의를 기재해 예약해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아틀리에 상담 예약 완료"
        }
      }
    ]
  },

  beachfront_condo_suite: {
    templateId: "beachfront_condo_suite",
    name: "선셋 오션 오션 프런트 콘도 수트",
    category: "Real Estate",
    description: "청량하고 시원한 시안 오션 블루와 은은하게 타오르는 주황빛 선셋 코랄 오렌지 배합으로 바다 파도 소리와 저녁 노을 감상을 극대화한 프런트 콘도 수트 테마입니다.",
    image: "/templates/beachfront_condo_suite.png",
    theme: {
      fontFamily: "Poppins, Outfit, sans-serif",
      colors: {
        primary: "#0891b2",     // 청량한 시안 오션 블루
        secondary: "#fdba74",   // 저녁 노을빛 코랄 오렌지
        accent: "#e0f2fe",      // 맑은 하늘빛 하늘
        background: "#f0fdfa",  // 고운 모래사장 샌드 화이트
        surface: "#ffffff",     // 맑고 투명한 마블 화이트
        text: "#164e63"         // 시인성 높은 깊은 바다 오션 네이비
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "창문을 열면 수평선 노을이 파도 소리와 함께 거실 카펫 안으로 밀려오다",
        subtitle: "사방이 꽉 막힌 회색 시티 지하실 오피스텔 방구석에서 모바일 게임 노이즈에 중독되셨나요? 선셋 오션 방식으로, 지상 지상 파티오 바로 아래 바다 파도가 닿는 독채 콘도, 그리고 바리스타 원장 스태프가 직접 내려주는 커피 커피를 쉐어하는 마스터 힐링 룸입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "콘도 예약 현황 보기",
          ctaLink: "#services",
          features: [
            { text: "보증금 가정보호 RLS 안전 연동 연동 및 매달 전문 방역 청소 스태프 무료 서포트" },
            { text: "체크인 시 청년 전용 오가닉 실내 슬리퍼 및 친환경 대나무 섬유 타월 패키지 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "콘도 혜택",
        subtitle: "도심 속 삶의 피로를 비워내고 바다의 상쾌한 활력을 채워주는 웰빙 코스입니다.",
        content_data: {
          items: [
            {
              title: "오션 뷰 개인 테라스 수영장",
              description: "겨울철 매서운 겨울 바람 속에서도 수온을 따뜻하게 온수 구들장 탭으로 조율하는 개인 인피니티 풀입니다.",
              icon: "Droplet"
            },
            {
              title: "선셋 파도 명상 살롱",
              description: "바쁜 소음 속에서 스스로 벼루에 먹을 갈며 내면의 생각을 수기 다듬는 자작나무 숲속 힐링 명상 공간입니다.",
              icon: "Sun"
            },
            {
              title: "시푸드 직화 바베큐 펍",
              description: "참나무 백탄 위에 돼지 목살 소시지를 그릴 시어링하여 차가운 라임 코로나 맥주와 들이킵니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "콘도는 단순히 하루 숙박하는 객실이 아닌, 문명이라는 감옥에서 벗어나 자연과 내가 수평으로 동기화되어 내면의 상처를 치유하는 성스러운 안식처입니다",
        subtitle: "모든 룸은 쾌적한 안식을 위해 입실 전 3중 위생 소독 관리를 성실 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 선셋 오션 콘도의 마스터 파트너 카터입니다. 우리는 앞집 창문과 마주 보며 프라이버시가 침해당하고 콘크리트 미세 가루가 날리는 닭장 같은 분양 숙소들을 단호히 거부합니다. 우리는 마당에 오직 울창한 소나무를 심어 쾌적한 안식처를 빌드하며, 당신만의 은밀하고 세련된 오션 라이프 스타일을 수호하겠습니다.",
          stats: [
            { label: "누적 입주 만족 만족 가구", value: "85가구 돌파" },
            { label: "보유 정원 디자인 라이선스", value: "18건" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "에메랄드 파도 분수 & 모래사장 테라스",
        subtitle: "사진 한 장만으로도 평화로운 파도 소리와 야자수 바람이 흐르는 청정 전경입니다.",
        content_data: {
          items: [
            { title: "야자수 아래 세팅된 썬베드 뷰", description: "아늑한 핀 조명 아래 투명한 크리스탈 와인 웰컴 컵이 예쁘게 수놓아진 해안가 휴게실 전경", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "통유리 너머 호수 뷰 주민 커뮤니티", description: "어두운 밤 노을 아래 소나무들이 아날로그 조명 조명 빛을 받아 평화롭게 정박된 락 캠프 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "숯불 그릴 위 바베큐 꼬치 스냅", description: "그릴 위에서 소시지와 파프리카 꼬치가 연기를 뿜으며 노릇하게 익어가는 평화로운 현장 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "콘도 예약 신청 및 투어 문의",
        subtitle: "방문 예정 일시, 콘도 타입 선택, 예약 예약 인원수, 선호하시는 웰컴 서비스 스타일을 적어주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "콘도 객실 예약 신청"
        }
      }
    ]
  }
};
