import { TemplateConfig } from "../registry";

export const COMMUNITY_NONPROFIT_TEMPLATES: Record<string, TemplateConfig> = {
  eco_green_campaign: {
    templateId: "eco_green_campaign",
    name: "에코 가디언즈 친환경 실천 연대",
    category: "Community & Non-Profit",
    description: "싱그러운 포레스트 그린과 포근한 모래 황토 웜베이지 조화로 지구 수호와 제로 웨이스트 캠페인을 전파하는 에코 시민단체 테마입니다.",
    image: "/templates/eco_green_campaign.png",
    theme: {
      fontFamily: "Outfit, Noto Sans KR, sans-serif",
      colors: {
        primary: "#15803d",     // 싱그러운 숲속 리프 그린
        secondary: "#f0fdf4",   // 청량한 아침 이슬 그린
        accent: "#ea580c",      // 타오르는 앰버 오렌지 썬
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 깨끗한 세라믹 다이닝 화이트
        text: "#14532d"         // 눈이 편안한 포레스트 그린 카본
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "일회용 플라스틱 없는 하루, 나와 지구가 함께 숨 쉬는 기적의 시작",
        subtitle: "말뿐인 거창한 에코 슬로건을 단호히 거부합니다. 에코 가디언즈 방식으로, 당장 내 가방 속에 텀블러와 다회용 장바구니를 챙기고, 동네 쓰레기를 줍는 플로깅 실천을 통해 이산화탄소 배출량을 제로화하는 지구 수호 시민 행동대입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
          ctaText: "제로웨이스트 참여 신청",
          ctaLink: "#contact",
          features: [
            { text: "일회용 컵 대신 개인 컵 사용 시 제휴 로컬 카페에서 10% 탄소 포인트 즉시 적립" },
            { text: "폐현수막을 업사이클링하여 튼튼한 다회용 장바구니로 직접 바느질해 나눠주는 워크숍" }
          ]
        }
      },
      {
        section_type: "services",
        title: "그린 캠페인 에센셜",
        subtitle: "지구의 탄소 발자국을 획기적으로 덜어내어 정화하는 참여 행동 목록입니다.",
        content_data: {
          items: [
            {
              title: "동네 비치 해변 플로깅",
              description: "매주 토요일 아침, 해변가와 등산로에 버려진 플라스틱 페트병과 낚시 낚싯줄을 수거하며 조깅하는 코스입니다.",
              icon: "Leaf"
            },
            {
              title: "자원 순환 업사이클링 살롱",
              description: "쓰레기통으로 가는 폐플라스틱 병뚜껑을 모아 압착 가공하여 예쁜 화분과 열쇠고리로 리벌스하는 강습입니다.",
              icon: "Sparkles"
            },
            {
              title: "에코 에코 텃밭 가드닝 교육",
              description: "음식물 쓰레기를 친환경 미생물 비료로 발효시켜 아파트 베란다 상추 텃밭을 일구는 웰빙 가이드입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "환경 운동은 나를 희생하는 고행이 아닌, 자연이 선사한 산소와 물을 내 영혼의 나이와 정직하게 동조시키는 행복한 라이프스타일의 개척입니다",
        subtitle: "우리가 발행하는 모든 캠페인 리포트는 정제 표백제를 쓰지 않는 천연 재생 종이 위에 인쇄됩니다.",
        content_data: {
          description: "안녕하십니까. 에코 가디언즈 연대의 헤드 디렉터입니다. 우리는 대기업들의 허울 좋은 친환경 홍보물인 '그린워싱'을 단호히 거부합니다. 우리는 동네 골목길 전신주 아래 방치된 쓰레기를 직접 분류하여 자원 수거율을 85% 개선해내고, 매주 주말 아이들과 흙 속 지렁이 관찰을 감상하는 살아 숨 쉬는 행동 연대를 수호하겠습니다.",
          stats: [
            { label: "누적 수거 플라스틱 중량", value: "12,000kg" },
            { label: "정기 참여 자원봉사 단원", value: "2,400명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "상쾌한 플로깅 현장 & 업사이클링 숍",
        subtitle: "초록 잎사귀들이 햇살을 머금고 무배출 청정 호흡하는 활기찬 공간 전경입니다.",
        content_data: {
          items: [
            { title: "해변 쓰레기를 줍는 청춘 단원들", description: "파란 하늘 아래 모래사장 위에서 마대자루를 들고 플라스틱을 주우며 환하게 웃고 있는 생동감 넘치는 찰나", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" },
            { title: "폐플라스틱 가마 압착 사출기 룸", description: "알록달록한 병뚜껑들을 맷돌 제분하여 녹여내고 단단한 초록 화분 몰드를 사출하는 깨끗한 원내 작업실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "미생물 액체 비료 제조 통 코너", description: "유기농 매실청 찌꺼기와 미생물 균주를 통안에 믹싱하여 냄새 없이 웰빙 상추 거름을 배양하는 위생실 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "서포터즈 가입 및 후원 신청",
        subtitle: "캠페인 소식지 메일 정기 구독, 주말 플로깅 참여 신청, 환경 스파 강습 세미나 문의는 아래 양식을 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "가디언즈 동참 신청"
        }
      }
    ]
  },

  animal_shelter_adopt: {
    templateId: "animal_shelter_adopt",
    name: "해피 테일즈 유기동물 보호소",
    category: "Community & Non-Profit",
    description: "사랑스럽고 포근한 커스터드 옐로우와 맑고 위생적인 민트 그린, 그리고 크래프트 오프화이트 조합이 상처받은 유기동물들의 치료와 입양을 돕는 따뜻한 테마입니다.",
    image: "/templates/animal_shelter_adopt.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#15803d",     // 잔디밭 맑은 숲속 그린
        secondary: "#fef08a",   // 안락한 바나나 옐로우
        accent: "#ea580c",      // 앰버 오렌지 발바닥
        background: "#fafcfb",  // 맑고 깨끗한 아침 공기 오프화이트
        surface: "#ffffff",     // 위생적인 견사 타일 화이트
        text: "#1c2317"         // 눈이 편안한 올리브 브라운 차콜
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "상처받은 눈빛 뒤에 숨겨진 단 하나의 간절한 약속, 사지 말고 입양하세요",
        subtitle: "유리 쇼케이스 안에서 공장처럼 찍어 팔려 와 유행이 지나면 버려지는 잔인한 펫숍 문화를 단호히 거부합니다. 해피 테일즈 방식으로, 버려진 유기견과 유기묘를 안전하게 구조하여 1:1 전담 수의사 검진과 영양식을 제공하고, 목줄 없이 뛰어노는 300평 잔디 구장에서 사랑으로 상처를 치료해 평생 가정을 매칭하는 비영리 단체입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "입양 대기 천사들 보기",
          ctaLink: "#portfolio",
          features: [
            { text: "파보, 코로나 바이러스 등 유기동물 치사율 1위 전염병 철저 차단 항체 검사 100% 완료" },
            { text: "입양 확정 시 반려동물 등록 칩 이식 시술 및 저자극 천연 위생 샴푸 어메니티 패키지 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "동물 수호 프로그램",
        subtitle: "댕댕이와 야옹이의 얼어붙은 영혼을 따스하게 정화하여 가정을 찾아주는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "오가닉 펫 웰커밍 메이킹",
              description: "유기동물들의 장 건강을 위해 수제 코코넛 밀크 락토프리 요거트와 무설탕 단호박 칩을 영양사가 매일 조제합니다.",
              icon: "Heart"
            },
            {
              title: "잔디밭 행동 사회화 훈련",
              description: "학대로 인해 인간에 대한 공포심을 가진 유기견을 전문 애견 훈련사가 쓰다듬기 스킨십으로 완화하는 코스입니다.",
              icon: "Leaf"
            },
            {
              title: "주말 견사 위생 청소 봉사",
              description: "매주 일요일 아침, 보호소 견사의 바닥 물청소와 편백나무 방역 소독을 자원봉사 단원들과 함께 완료합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "동물은 단순히 키우는 가축이 아닌, 평생을 아무런 조건 없이 나만을 믿고 심장 고유의 사랑을 바치는 존귀한 내 영혼의 짝꿍입니다",
        subtitle: "모든 보호 구역은 악취와 해충을 차단하기 위해 하루 3회 정밀 환기와 스팀 멸균 청소를 성실 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 해피 테일즈 보호소의 오너 캡틴 마스터입니다. 우리는 후원금을 가로채고 안락사를 밥 먹듯 단행하며 불투명한 회계로 비난받는 사설 보호소들을 단호히 거부합니다. 우리는 100% 투명한 후원금 사용 내역과 1:1 수의사 진료 차트를 매주 홈페이지에 게시하며, 상처받은 동물들이 다시 환하게 꼬리 치는 영롱한 기적의 현장을 수호하겠습니다.",
          stats: [
            { label: "누적 평생 가정 입양마리 수", value: "2,400마리" },
            { label: "보유 전문 동물 행동 교정사", value: "8명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "꼬리치는 천사들 & 위생 시설",
        subtitle: "사진 한 장만으로도 따스한 심장 박동과 사랑이 고스란히 흘러드는 갤러리입니다.",
        content_data: {
          items: [
            { title: "잔디밭을 질주하며 점프하는 강아지", description: "파란 하늘 아래 초록 천연 잔디 구장에서 구조견들이 꼬리를 흔들며 신나게 전력 질주하는 순간", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80" },
            { title: "위생적으로 정돈된 단독 견사 룸", description: "아늑한 황토 타일이 깔려 있고 폭신한 린넨 방석과 정수기 웰 셋업이 완비된 쾌적한 구조 동물 방", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "아기 고양이 우유 젖병 급식 스냅", description: "구조된 길고양이 아기에게 락토프리 영양 액체 수란을 한 방울씩 주사기로 짜서 먹이는 장인의 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "입양 사전 신청 및 정기 후원",
        subtitle: "입양 희망 동물 번호 기재, 주말 견사 봉사 활동 참가 신청, 1회/정기 후원 신청서는 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "입양/봉사 신청하기"
        }
      }
    ]
  },

  elderly_care_volunteer: {
    templateId: "elderly_care_volunteer",
    name: "실버 세대 실버동행 자원봉사회",
    category: "Community & Non-Profit",
    description: "차분하고 고풍스러운 다크 와인 버건디와 따스한 크림 아이보리, 그리고 맑고 고요한 샌드 브라운 조합이 홀몸 어르신들과의 다도 및 식사 동행을 안내하는 웰니스 테마입니다.",
    image: "/templates/elderly_care_volunteer.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, serif",
      colors: {
        primary: "#4c0519",     // 고풍스러운 대추 와인 버건디
        secondary: "#fdf8f5",   // 따스한 린넨 크림 아이보리
        accent: "#d4a373",      // 전통 다기 황토 브라운
        background: "#faf6f0",  // 한지 한방 웜 오프화이트
        surface: "#ffffff",     // 깨끗한 위생 세라믹 테이블
        text: "#2b221a"         // 묵직한 먹물 잉크 차콜 브라운
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "툇마루 너머 외로운 노을 아래, 쓸쓸한 어르신의 손목을 따스하게 쥐다",
        subtitle: "정부 보조금 수령용 요식 행위식 단체 사진 촬영 봉사를 단호히 거부합니다. 실버동행 방식으로, 일주일에 한 번 홀몸 어르신 댁을 직접 방문해 한방 한약재로 달인 영양 닭죽을 직접 쑤어 대접하고, 놋그릇 다기에 따스한 한방 차를 따라 마시며 어르신의 고단한 청춘 스토리를 귀담아듣고 세상과 연결하는 온정 가득한 비영리 봉사단입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
          ctaText: "주말 어르신 동행 봉사 신청",
          ctaLink: "#contact",
          features: [
            { text: "국가공인 사회복지사와 전문 간호 협조 아래 안전하고 신뢰성 높은 1:1 밀착 봉사 매칭 보증" },
            { text: "음식이 닿는 식기 전원 무독성 황동 유기 그릇 전면 배치 및 100도 고온 스팀 살균 엄수" }
          ]
        }
      },
      {
        section_type: "services",
        title: "실버동행 프로그램",
        subtitle: "어르신들의 막힌 기혈을 부드럽게 이완하고 외로운 영혼을 해독하는 봉사 라인업입니다.",
        content_data: {
          items: [
            {
              title: "한우 수제 영양죽 식사 대접",
              description: "치아가 약해 소화가 불편한 어르신들을 위해 고단백 횡성 한우와 부드러운 찹쌀로 옹기 가마솥 닭죽을 직접 쑤어 드립니다.",
              icon: "Heart"
            },
            {
              title: "다도 명상 & 1인 사색 대화",
              description: "대나무 찻상 위에 국산 감잎차와 계피차를 다려 올리며 어르신 인생의 지혜로운 텍스트를 경청하는 살롱입니다.",
              icon: "Leaf"
            },
            {
              title: "100세 장수 영정 화보 촬영",
              description: "신사 신녀처럼 곱게 한복을 입혀 드리고 프로 포토그래퍼가 맑고 우아한 노년의 영광을 박제해 액자로 선물합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "노년은 쓸쓸히 버려지는 종착지가 아닌, 삶의 수많은 태풍을 이겨내고 가장 가장 아름답게 영근 대하소설의 마스터피스 페이지입니다",
        subtitle: "모든 방문 봉사는 어르신들의 사생활 침해를 차단하기 위해 사전 동의서를 엄격히 확보하고 진행됩니다.",
        content_data: {
          description: "안녕하십니까. 실버동행 자원봉사회의 총괄 대표입니다. 우리는 명절날 생색내기식 쌀 한 포대 던져두고 생색만 낸 뒤 어르신들을 다시 어두운 골방에 방치하는 가식적 복지 단체들을 단호히 거부합니다. 우리는 한 분의 어르신과 단원 한 명을 1:1 평생 파트너로 매칭하여, 손을 맞잡고 따스한 다도 살롱에서 미소를 우려내는 정직한 온정을 사수하겠습니다.",
          stats: [
            { label: "정기 케어 중인 홀몸 어르신", value: "350분" },
            { label: "소속 정기 자원봉사 단원", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "따스한 다도실 & 장수 액자 살롱",
        subtitle: "사진 한 장만으로도 포근한 계피차 향취와 어르신들의 주름진 미소가 전해지는 갤러리입니다.",
        content_data: {
          items: [
            { title: "놋그릇 찻상이 차려진 온돌방 거실", description: "창호지 문 너머 대나무 정원이 보이고 따스한 주황 샹들리에 조명이 가득한 정갈한 다도 테이블", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80" },
            { title: "고운 한복을 입은 할머님 미소 액자", description: "아늑한 핀 조명 아래 백발 머리에 노란 비녀를 꽂고 인자하게 미소 지으시는 100세 장수 스틸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "가마솥 한우 영양죽 수기 국자 스냅", description: "옹기 냄비 안에서 뽀얀 찹쌀 가루와 대추 한방 엑기스 죽이 끓어올라 국자로 조심스레 담아 올리는 조리 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "봉사자 지원 및 기부 상담",
        subtitle: "방문 동행 봉사자 신청, 어르신 수제 도시락 배달 봉사 신청, 1회/정기 기부 영수증 발행 신청서를 아래에 기재해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "실버동행 참가 신청"
        }
      }
    ]
  },

  youth_education_mentoring: {
    templateId: "youth_education_mentoring",
    name: "퓨처 드림즈 청소년 진로 멘토링",
    category: "Community & Non-Profit",
    description: "스마트하고 이지적인 슬레이트 메탈 그레이와 세련된 미드나잇 오렌지 골드 액센트로 청소년들의 IT 진로 및 디자인 멘토링의 가치를 전하는 테마입니다.",
    image: "/templates/youth_education_mentoring.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#18181b",     // 시크한 제트 블랙 슬레이트
        secondary: "#e4e4e7",   // 알루미늄 메탈 그레이
        accent: "#ea580c",      // 앰버 오렌지 미래
        background: "#09090b",  // 미래적인 코딩 교육 다크
        surface: "#27272a",     // 에르고노믹스 데스크 메탈 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "교육 소외지 청소년들의 낡은 맥북 위, 실리콘밸리 엔지니어들이 수여하는 꿈의 기어",
        subtitle: "주입식 입시 암기 교육과 비싼 사교육 학원의 카르텔을 단호히 거부합니다. 퓨처 드림즈 방식으로, 전 세계 선도 IT 기업 현업 시니어 개발자와 디자이너들이 의기투합하여, 가정 형편이 어려운 청소년들에게 1:1 코딩 멘토링과 무선 기기를 지원하고, 장래 글로벌 디지털 노마드로 자립하게 돕는 하이엔드 교육 비영리 재단입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "주말 코딩 해커톤 참관 신청",
          ctaLink: "#services",
          features: [
            { text: "구글, 메타 소속 수석 엔지니어들과 주 1회 실시간 깃허브 코드 리뷰 및 코딩 멘토 매칭 완비" },
            { text: "체크인 시 컴퓨터 하드웨어 피로를 차단하는 친환경 모니터 암 및 무선 키보드 세트 전면 무상 무상 지원" }
          ]
        }
      },
      {
        section_type: "services",
        title: "멘토링 프로그램",
        subtitle: "청소년들의 잠재적 IT 날개를 안전하고 기품 있게 셋업하는 해커톤 라인업입니다.",
        content_data: {
          items: [
            {
              title: "1:1 리모트 코딩 해커톤",
              description: "멘티 청소년과 멘토 엔지니어가 짝을 이루어 오픈소스 API 웹사이트를 직접 빌드업하며 자립 코딩 기술을 이수합니다.",
              icon: "Zap"
            },
            {
              title: "디지털 일러스트 디자인 랩",
              description: "와콤 타블렛 기기 활용법과 포토샵 입체 그리기 공학을 수석 디렉터가 1:1 드로잉 수기 피드백합니다.",
              icon: "Sparkles"
            },
            {
              title: "글로벌 IT 영어 메일링 코칭",
              description: "해외 오픈소스 커뮤니티 기여 시 작성하는 영어 이슈 등록 레터와 기획서 텍스트 작성법을 교육합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "교육은 지식을 강제로 주입하는 억압이 아닌, 아이들의 마음속에 스스로 빛나는 코딩의 원자 폭탄을 안겨주는 무한한 자유의 개척입니다",
        subtitle: "모든 멘토링 강습은 100% 철저한 아동 청소년 보호법 배경 범죄 이력 조회를 통과한 검증 단원들만 투입됩니다.",
        content_data: {
          description: "안녕하십니까. 퓨처 드림즈 재단의 오너 개발 이사입니다. 우리는 줄 세우기식 등급 나누기로 아이들의 자존감을 짓밟고 영혼이 증발해버린 주입식 수능 입시 교육을 단호히 거부합니다. 우리는 소스코드 한 줄로 전 세계 수억 명의 삶을 혁신하는 개발의 희열을 안겨주고, 쾌적하고 세련된 블랙 인프라 속에서 청춘의 지적 카리스마를 온전히 보조하겠습니다.",
          stats: [
            { label: "배출된 청소년 엔지니어 수", value: "1,500명" },
            { label: "기부된 스마트 모니터 개수", value: "240세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "해커톤 랩실 & IT 스마트 교육관",
        subtitle: "사진 한 장만으로도 뜨거운 배움의 열기와 미래 시티 감성이 전해지는 원내 전경입니다.",
        content_data: {
          items: [
            { title: "야자수 정원 옆 코딩 해커톤 벤치", description: "통유리 창가 테이블에 멘토와 멘티 청소년이 나란히 앉아 맥북 모니터를 보며 버그를 수정하는 스냅", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" },
            { title: "링 라이트 조명 탑재 스마트 폰 부스", description: "실시간 해외 개발자 미팅을 위해 헤드셋을 장착하고 깃허브 코드 리뷰를 진행하는 쾌적한 1인 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "타블렛 드로잉 수기 붓 펜 스케치", description: "원목 책상 위에 일러스트 액티브 펜과 무선 마우스, 그리고 에스프레소 카푸치노 한 잔 데코레이션 찰나", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "멘토 가입 및 멘티 장학 신청",
        subtitle: "자원봉사 코딩 멘토단 신청, 기부 노트북 장학생 선발 지원서, 해커톤 기업 단체 후원 문의는 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "멘토링 신청하기"
        }
      }
    ]
  },

  disaster_relief_humanitarian: {
    templateId: "disaster_relief_humanitarian",
    name: "신속 구호 인류애 연대",
    category: "Community & Non-Profit",
    description: "타오르는 긴급 구조 오렌지 주황과 묵직한 카본 재난 슬레이트 그레이 배합이 지구촌 재해 현장 구호의 긴박함과 인류애를 대담하게 전하는 테마입니다.",
    image: "/templates/disaster_relief_humanitarian.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ea580c",     // 긴급 구조 앰버 오렌지
        secondary: "#e2e8f0",   // 청량한 라이트 스톤 실버
        accent: "#dc2626",      // 아드레날린 수혈 혈액 레드
        background: "#090d16",  // 재해 현장 다크 나이트 블루
        surface: "#111827",     // 군용 무쇠 알루미늄 케그 차콜
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지진과 폭풍의 한가운데, 생명의 마지막 숨결을 구하기 위해 무쇠 윈치를 굴리다",
        subtitle: "말뿐인 탁상공론 외교와 생색내기식 기부금 수수료 떼먹기 카르텔을 단호히 거부합니다. 인류애 연대 방식으로, 전 세계 분쟁 지역과 수해 지진 현장에 재난 구호 텐트, 멸균 산소 탱크, 그리고 100도 고온 살균 수제 전투식량을 48시간 이내 골든타임 오차 없이 직배 수송하는 진짜 서바이벌 구호 시민단입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "긴급 구호 현황 아카이브",
          ctaLink: "#services",
          features: [
            { text: "식수가 끊긴 재난 현장에 100% 무독성 필터 수경 정수 배터리 차량 즉각 투입 가동" },
            { text: "구조 윈치 로프 슬링 및 수제 양념 비타민 보급 팩 1만 세트 항공 드랍 수송 완료" }
          ]
        }
      },
      {
        section_type: "services",
        title: "인류애 구호 프로그램",
        subtitle: "지구촌 재해 절벽 틈새의 어린아이들을 안전하게 수호하는 구호 목록입니다.",
        content_data: {
          items: [
            {
              title: "골든타임 48시간 긴급 드랍",
              description: "홍수나 지진 발생 시 헬기를 가동하여 식수 캔 5,000리터와 통조림 영양식을 항공 드롭하여 생명을 구조합니다.",
              icon: "Zap"
            },
            {
              title: "임시 돔 쉘터 방수 텐트 시공",
              description: "체온 손실을 차단하는 군용 카키 스펀지 텐트 500동을 모래사장 위에 24시간 내 빌트인 시공 완료합니다.",
              icon: "Compass"
            },
            {
              title: "수중 식수 정수 필터 배양",
              description: "오염된 흙탕물을 99.9% 멸균하여 유기농 솔바람 향취를 머금은 맑은 식수로 분리 정화하는 기술입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "인도주의 구호는 남는 돈을 던져주는 가식적 적선이 아닌, 대지진의 흙먼지 연기 속에 내 형제의 슬픔을 내 갈비뼈 틈새로 고스란히 이식하는 동고동락의 숭고한 물리학입니다",
        subtitle: "모든 후원금 분배 내역은 정부 공식 감사 감사 회계 법인의 1원짜리 영수증까지 실시간 100% 공개됩니다.",
        content_data: {
          description: "안녕하십니까. 신속 구호 인류애 연대의 총지배인 피트마스터입니다. 우리는 고액의 임원 연봉을 책정하고 홍보비로 후원금을 탕진하여 정작 현장 난민들에게는 썩은 밀가루만 배급하는 불량 비영리 단체를 단호히 거부합니다. 우리는 참나무 장작의 스모키 훈연 향이 깃든 14시간 훈연 수제 통고기 보급 식단을 헬기로 직접 공수하며, 마지막 한 생명의 맥박이 뛸 때까지 현장을 사수하겠습니다.",
          stats: [
            { label: "누적 긴급 구조 인원", value: "35,000명 돌파" },
            { label: "보유 긴급 수경 정수 차량", value: "4세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "긴급 구호 캠프 & 항공 드랍실 전경",
        subtitle: "참나무 장작과 훈연의 아우라가 고스란히 느껴지는 프로패셔널 아웃도어 인프라입니다.",
        content_data: {
          items: [
            { title: "재난 구호 텐트촌의 아침 전경 스냅", description: "안개 속에서 하얀 대형 특수 방막 텐트들이 대나무 숲길 옆에 나란히 안착되어 안락함을 주는 코너", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80" },
            { title: "헬기 항공 수송 상자 적재 현장", description: "형광 네온 오렌지색 특수 보온 드랍 상자들이 그물망 쇠사슬에 묶여 적재되는 활력 가득한 스틸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "식수 캔 정수 필터 압착 조리 찰나", description: "대형 무쇠 가마 안에서 오염수를 가열하여 진공 튜브관을 통해 생수로 정밀 분리 성형하는 조리실 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "긴급 구호 대원 신청 및 긴급 후원",
        subtitle: "해외 재난 자원봉사 대원 지원서, 긴급 의약품 기부 상담, 1회/정기 긴급 구호 펀드 후원 신청서는 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "긴급 구호 후원하기"
        }
      }
    ]
  },

  local_cultural_center: {
    templateId: "local_cultural_center",
    name: "온동네 마을 역사 문화 아카이브",
    category: "Community & Non-Profit",
    description: "정숙함을 선사하는 마호가니 딥 브라운과 전통 한지의 아늑한 웜 베이지, 그리고 황동 골드가 조화를 이루어 지역 공동체 역사와 소통을 이끄는 테마입니다.",
    image: "/templates/local_cultural_center.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4a3c31",     // 깊은 전통 오동나무 브라운
        secondary: "#d4af37",   // 전통 유기 황동 골드
        accent: "#7c2d12",      // 고풍스러운 대추 레드
        background: "#f5ece1",  // 한지 물결 연베이지
        surface: "#ffffff",     // 정갈한 한지 테이블보 화이트
        text: "#29211c"         // 묵직한 잉크 블랙 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "빠르게 사라져가는 골목길 할머니의 구전 민요와 마을의 오래된 장독 숨소리",
        subtitle: "아파트 단지 건설로 멸실 위기에 처한 우리 동네 100년 역사를 단호히 박제해 내겠습니다. 온동네 아카이브 방식으로, 마을 어르신들의 구전 사투리 구연 오디오와 오래된 씨간장 장독대의 유산균 데이터를 정교하게 디지털 그래픽으로 기하학적 기록하는 비영리 마을 공동체 센터입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "마을 역사 아카이브 관람",
          ctaLink: "#services",
          features: [
            { text: "대한민국 전통 구전 아티스트들의 구전 민요 고밀도 테이프 마스터 디지털 복원 완료" },
            { text: "음식이 닿는 놋그릇 식기 전원 전통 황동 유기 그릇 전면 사용 위생 살균 소독 엄수" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마을 역사 프로그램",
        subtitle: "골목길 고유의 이국적인 아우라를 정교하게 흔드는 지역 공동체 퀴진 목록입니다.",
        content_data: {
          items: [
            {
              title: "마을 구전 이야기 채록",
              description: "80대 어르신들의 기억 속 일제 강점기 피난 일기와 아기 달래는 옛 노래를 마이크로 스튜디오에서 수기 녹음합니다.",
              icon: "Award"
            },
            {
              title: "5년 씨간장 장독 담그기",
              description: "전통 한지 창호지가 스치는 마당 장독대 마당에 모여 콩 메주를 항아리에 넣고 소금 소금 옹기를 빚는 강습입니다.",
              icon: "Leaf"
            },
            {
              title: "골목길 한옥 정비 세미나",
              description: "퇴락해가는 한옥 툇마루 나뭇결 틈새에 유기농 밀랍 천연 기름을 칠해 방수를 돕는 목공 웰빙 수업입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "지역 문화는 화려한 박물관 건물을 짓는 토목 기교가 아닌, 대대손손 골목길 흙바닥에 흐르던 평범한 이웃들의 따뜻한 밥 냄새와 숨결을 수호하는 숭고한 침묵입니다",
        subtitle: "모든 문화 강습은 어르신들과 동네 아동들이 1:1 세대 동행으로 파트너를 이루어 운영됩니다.",
        content_data: {
          description: "안녕하십니까. 온동네 문화 센터의 오너 디렉터입니다. 우리는 빌딩 숲 리조트 건설을 빌미로 동네 우물을 메우고 정자나무를 베어버리는 몰상식한 도시 개발을 단호히 거부합니다. 우리는 툇마루 너머로 중정 소나무가 보이고 은은한 쌍화차 향취가 풍기는 정갈하고 안락한 독방에서, 당신과 자녀들에게 지적인 고향의 냄새를 돌려드리겠습니다.",
          stats: [
            { label: "수집 완료 구전 아카이브", value: "240건" },
            { label: "기록용 유기 놋그릇 세트", value: "65인분 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "정갈한 툇마루 한옥 정원 & 장독대",
        subtitle: "사진 한 장만으로도 아늑한 한지 종이 냄새와 솔바람 향취가 풍기는 빈티지 전경입니다.",
        content_data: {
          items: [
            { title: "개인 온돌방 창가 다도 명상실", description: "창호지 문 사이로 장독 마당 소나무가 비치고 유기 다기들이 예쁘게 세팅되어 사색하기 좋은 한옥 룸", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "마당 마당 장독 옹기 독들이 늘어선 전경", description: "천연 황토 옹기 독 안에서 매실청이 익어가며 햇살 조명 아래 윤기를 내뿜는 아름다운 원내 마당 스냅", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "한옥 마루 밀랍 코팅 붓질 스냅", description: "소나무 툇마루 틈새에 솔을 들고 황금빛 천연 수성 왁스를 칠해 물결 무늬를 곧게 복원하는 셰프의 조리 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "역사 탐방 도슨트 및 클래스 예약",
        subtitle: "원데이 골목길 도슨트 투어 예약, 씨간장 옹기 빚기 강습 신청, 툇마루 세미나실 대관은 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "문화 센터 클래스 예약"
        }
      }
    ]
  },

  homeless_shelter_hope: {
    templateId: "homeless_shelter_hope",
    name: "희망 브릿지 노숙인 자활 쉘터",
    category: "Community & Non-Profit",
    description: "타오르는 따스한 모닥불 주황과 묵직한 카본 슬레이트 차콜, 그리고 깨끗한 위생 화이트 조화로 소외 이웃의 식사 지원과 자활을 돕는 비영리 쉘터 테마입니다.",
    image: "/templates/homeless_shelter_hope.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#ea580c",     // 따스한 모닥불 오렌지
        secondary: "#e2e8f0",   // 청량한 라이트 스틸 그레이
        accent: "#b45309",      // 참나무 브릭 브라운
        background: "#fafcfd",  // 맑고 투명한 수경 오프화이트
        surface: "#ffffff",     // 깨끗한 위생 세라믹 요리대
        text: "#1e293b"         // 스마트하고 가독성 높은 네이비 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "차가운 아스팔트 바닥 위 꽁꽁 얼어붙은 고독을, 한 그릇의 뜨거운 국물로 해독하다",
        subtitle: "단순히 라면만 끓여 던져주어 영양 결핍을 유발하는 형식적 노숙인 급식을 단호히 거부합니다. 희망 브릿지 방식으로, 당일 도축 한우 뼈를 24시간 우려낸 깊은 설렁탕 육수에 무농약 상추 보울, 그리고 자활 목공 기술 교육을 연계하여 노숙인이 세상의 지적 지적 시민으로 다시 자립하도록 이끄는 비영리 웰빙 쉘터입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 급식 자원봉사 신청",
          ctaLink: "#contact",
          features: [
            { text: "영양실조를 예방하기 위해 임상 영양사가 매일 탄단지 비중을 맞춤 설계하는 유기농 식단 제공" },
            { text: "쉘터 입주 시 편백나무 LNT 피톤치드 살균 샤워실 및 새 위생 의복 패키지 무료 지급" }
          ]
        }
      },
      {
        section_type: "services",
        title: "자활 지원 프로그램",
        subtitle: "소외된 이웃들의 얼어붙은 영혼을 따스하고 영롱하게 구원하는 자활 라인업입니다.",
        content_data: {
          items: [
            {
              title: "한우 사골 사골 설렁탕 배급",
              description: "24시간 동안 진액을 다려 낸 가마솥 사골 설렁탕과 유기농 현미밥, 당일 담근 아삭한 깍두기를 대접합니다.",
              icon: "Flame"
            },
            {
              title: "자작나무 목공 자활 기술",
              description: "손잡이 없는 히든 서랍장과 콘센트 수납함을 직접 톱질 피팅해 수제 가구로 리벌싱하는 직업 훈련입니다.",
              icon: "Compass"
            },
            {
              title: "1인 단독 심리 명상 카운셀링",
              description: "자율신경계 안정을 돕는 티베트 싱잉볼 소리와 라벤더 오일 아로마 속에서 자존감 회복 대화를 진행합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자활 쉘터는 단순히 먹여주고 재워주는 수용소가 아닌, 벼랑 끝에 선 인간에게 두 손을 뻗어 영혼 고유의 기품과 자립할 수 있는 무기를 쥐여주는 지고한 인류애입니다",
        subtitle: "모든 후원금 및 식자재 기부 내역은 실시간 블록체인 디지털 분산 원장으로 투명하게 공개됩니다.",
        content_data: {
          description: "안녕하십니까. 희망 브릿지 쉘터의 총괄 코치 원장입니다. 우리는 유통기한이 지나 썩은 빵을 던져주고 사진 촬영만 남기며 후원금을 횡령하는 불량 단체들을 단호히 거부합니다. 우리는 생두 원두를 볶아 커피 바를 가동하고, 쾌적하고 위생적인 샤워 인프라를 상시 가동하며, 소외 이웃들의 따뜻한 인간적 안식을 수호하겠습니다.",
          stats: [
            { label: "자활 성공 노숙인 수", value: "350명 돌파" },
            { label: "구비된 자활 목공 기어", value: "8세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "깨끗한 쉘터 키친 & 자활 세공소",
        subtitle: "사진 한 장만으로도 따스한 국물 김과 나무 톱질 냄새가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "2미터 무쇠 가마솥 육수 조리대", description: "뿌연 수증기가 모락모락 뿜어지고 셰프들이 위생 마스크를 쓴 채 사골을 젓는 쾌적한 쉘터 키친 코너", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
            { title: "자작나무 가구 목공 작업대 룸", description: "아늑한 핀 조명 아래 톱과 사포, 천연 스테인 오일 병들이 세련되게 정렬된 1인 목재 가공 벤치실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "설렁탕 뚝배기와 유기 숟가락 스냅", description: "원목 테이블 위에 정갈하게 담긴 한우 설렁탕과 무농약 상추 보울, 그리고 따뜻한 웰컴 보리차 한 잔 데코", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "무료 급식 봉사 및 기부 참여",
        subtitle: "급식소 밥 짓기 봉사 신청, 자활 목공소 원두 납품 정기 유통 문의, 기부금 소득공제 영수증 신청서는 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "쉘터 봉사/기부 예약"
        }
      }
    ]
  },

  blind_guide_dog_association: {
    templateId: "blind_guide_dog_association",
    name: "안내견 사랑의 파도 동행회",
    category: "Community & Non-Profit",
    description: "청량하고 신선한 사파이어 블루와 눈부시게 깨끗한 펄 오프화이트, 그리고 형광 구조 오렌지 액센트가 결합하여 시각장애인 안내견 육성과 안전을 전하는 테마입니다.",
    image: "/templates/blind_guide_dog_association.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#0284c7",     // 맑고 시원한 청정 바다 블루
        secondary: "#e0f2fe",   // 맑고 눈부신 라이트 블루 스카이
        accent: "#ea580c",      // 형광 구조 네온 오렌지
        background: "#fafcfd",  // 퓨어 아쿠아 오프화이트
        surface: "#ffffff",     // 깨끗한 대리석 안내실 화이트
        text: "#1e293b"         // 스마트 슬레이트 차콜 네이비
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "시각장애인의 눈이 되어 버스 문을 찾아내고, 소리 없이 위험 발걸음을 수호하다",
        subtitle: "단순히 동물 자랑만 하며 후원을 갈구하는 펫 단체를 단호히 거부합니다. 사랑의 파도 방식으로, 생후 8주 된 영리한 리트리버 리트리버 강아지를 일반 가정에서 사회화하는 '퍼피워킹' 클래스부터, 2년 동안 장애물 충돌 회피 도로 주행을 정교하게 이수하여 시각장애인과 완벽히 공명하는 명품 안내견 무상 배급 비영리 협회입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "퍼피워커 자원봉사 신청",
          ctaLink: "#contact",
          features: [
            { text: "안내견 시각 신호를 인지하고 버스 지하철 탑승 탑승 에티켓을 시민들에게 전파하는 강좌 탑재" },
            { text: "체크인 시 안내견 관절 보호용 친환경 가죽 끈 하네스 및 무독성 식기 세트 무상 무상 배포" }
          ]
        }
      },
      {
        section_type: "services",
        title: "안내견 수호 프로그램",
        subtitle: "안내견의 꼬리와 장애인의 발걸음을 안전하고 영롱하게 매칭하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "퍼피워킹 사회화 훈련 클래스",
              description: "일반 가정에서 생후 8주 된 영아 리트리버를 입양해 1년 동안 인간 신호와 동선에 친밀해지도록 훈련합니다.",
              icon: "Heart"
            },
            {
              title: "장애물 충돌 회피 도로 실습",
              description: "지하철 승강장 연단 틈새와 횡단보도 신호등 앞에서 시각장애인을 안전하게 정지시키고 유도하는 코스입니다.",
              icon: "Compass"
            },
            {
              title: "은퇴견 홈스테이 보살핌",
              description: "10년 동안 헌신적으로 시각장애인의 눈이 되어 봉사하고 은퇴한 늙은 리트리버를 가정에 입양해 돌봅니다.",
              icon: "Leaf"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "안내견은 장애인의 무거운 비즈니스 발걸음을 서포트하는 단순한 도구가 아닌, 아무런 조건 없이 내 영혼의 나침반이 되어 목숨을 걸고 나를 지켜주는 가장 고귀한 동반자입니다",
        subtitle: "모든 훈련은 동물 학대 우려를 완전히 0%로 차단하기 위해 긍정 강화 보상 기법으로만 운영됩니다.",
        content_data: {
          description: "안녕하십니까. 안내견 동행회의 총괄 훈련 마스터입니다. 우리는 버스나 식당에서 안내견이라는 이유로 소리를 지르고 입장을 거부하며 마음에 상처를 주는 무법 시민 의식을 단호히 거부합니다. 우리는 100% 투명한 후원금 집행 차트와 안내견 1:1 영양 수혜 기록을 공개하며, 장애인과 개가 함께 웃는 청정 마리나 라운지 같은 웰니스를 구현하겠습니다.",
          stats: [
            { label: "배출된 공인 안내견 수", value: "350마리" },
            { label: "구비된 수입 훈련 가죽 끈", value: "48세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "천사 안내견들의 잔디 훈련 & 쉼터",
        subtitle: "바라보는 것만으로도 가슴이 뭉클해지고 사랑이 샘솟는 크리스탈 갤러리입니다.",
        content_data: {
          items: [
            { title: "안내견 하네스를 착용한 리트리버", description: "파란 하늘 아래 초록 천연 잔디 위에서 횡단보도 정지선 앞에 서서 훈련사를 가만히 올려다보는 스냅 샷", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80" },
            { title: "위생적으로 설계된 대형 견사 룸 코너", description: "아늑한 핀 조명이 얼굴을 비추고 편백나무 바닥과 개별 침구 린넨이 세팅된 안내견 전용 침실 내부", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "은퇴견 빗질과 시원한 디톡스 보울", description: "원목 테이블 위에 은퇴 안내견 전용 영양 죽 보울과 락토프리 요거트, 그리고 부드러운 브러쉬 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "퍼피워커 지원 및 안내견 분양 신청",
        subtitle: "퍼피워커 자원봉사 지원서, 시각장애인 파트너 안내견 신청, 1회/정기 후원 신청서를 아래에 기재해 예약 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "동행회 참가 신청"
        }
      }
    ]
  },

  refugee_integration_aid: {
    templateId: "refugee_integration_aid",
    name: "보더리스 오픈 암스 이주민 센터",
    category: "Community & Non-Profit",
    description: "이국적인 터키쉬 에메랄드 블루와 차분한 스톤 그레이, 그리고 따스한 코코넛 오프화이트 배합으로 이주민과 난민의 자립을 돕는 이국적인 테마입니다.",
    image: "/templates/refugee_integration_aid.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
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
        title: "국경과 언어의 장벽을 완전히 허물고, 낯선 타향에서 이웃으로 하나 되다",
        subtitle: "이주민을 범죄자 취급하며 차별하는 냉혹한 폐쇄적 다문화 정책을 단호히 거부합니다. 오픈 암스 방식으로, 한국어 교육, 무료 법률 소송 상담, 그리고 각국 고유의 전통 음식을 직접 요리해 이웃과 나누는 푸드 코트 세션을 제공하여 난민이 떳떳한 자립 시민으로 정착하게 돕는 하이엔드 이주민 지원 센터입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "다문화 푸드 페스티벌 참가",
          ctaLink: "#contact",
          features: [
            { text: "출입국 관리법 법률 자문 자문 변호사들의 1:1 무료 법률 소송 및 인권 수호 매칭 완비" },
            { text: "한국어 토픽(TOPIK) 자격증 시험 합격을 돕는 시니어 튜터링 교재 전면 무상 지원" }
          ]
        }
      },
      {
        section_type: "services",
        title: "이주민 편의 큐레이션",
        subtitle: "방랑과 비즈니스를 완벽히 공명시키는 오픈 암스만의 전용 서비스 인프라입니다.",
        content_data: {
          items: [
            {
              title: "한국어 1:1 멘토링 아카데미",
              description: "동네 대학생들과 난민 청소년이 짝을 이루어 매주 한국어 회화와 교과 교과 학습을 지도받는 코스입니다.",
              icon: "Zap"
            },
            {
              title: "다문화 푸드 살롱 클래스",
              description: "베트남 쌀국수, 모로코 타진 등 각국 전통 음식을 동네 주민들과 함께 요리해 맛보는 웰빙 소셜 펍입니다.",
              icon: "Flame"
            },
            {
              title: "이주민 자활 직업 훈련 센터",
              description: "자가 제빵 제과 기술 및 웹 퍼블리싱 코딩 기초를 전문 강사가 1:1 드로잉 수기 지도합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "다문화 통합은 단순히 타인을 동화시키는 오만이 아닌, 다른 문화가 가진 독창적인 아로마와 가치를 우리 사회에 정직하게 포용하여 공동체를 풍요롭게 다지는 지평선입니다",
        subtitle: "모든 상담 데이터는 개인정보 보호법에 의거하여 철저히 암호화되어 비밀이 완벽 엄수됩니다.",
        content_data: {
          description: "안녕하십니까. 보더리스 오픈 암스 센터의 헤드 코치 디렉터입니다. 우리는 임금을 떼먹고 부당하게 노동력을 갈취하며 인권을 훼손하는 불량 사업주들을 단호히 거부합니다. 우리는 100% 투명한 법률 소송 자문 차트와 이주민 구호 어메니티 기록을 공개하며, 장소의 장벽을 넘어 인간 존엄의 맑은 숲속 가든 같은 웰니스를 구현하겠습니다.",
          stats: [
            { label: "자활 성공 이주민 수", value: "3,500명+" },
            { label: "소속 무료 변호사 단원", value: "24명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "다문화 푸드 살롱 & 한국어 교실",
        subtitle: "사진 한 장만으로도 즐거운 웃음소리와 이국적 요리 냄새가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "함께 요리하며 웃는 다국적 주부들", description: "대리석 주방에서 베트남 스프링롤을 빚으며 환하게 웃는 이주 여성들과 봉사 단원들의 스냅", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" },
            { title: "한국어 칠판 글씨와 학습 폰 부스", description: "아늑한 핀 조명이 비추고 태블릿 컴퓨터가 세팅되어 한국어 발음을 연습하는 쾌적한 1인 교실 내부", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "태국 모던 쌀국수 뚝배기 셋업 찰나", description: "황동 냄비 안에 갓 끓여 낸 팟타이 국수와 레몬그라스, 그리고 시원한 웰컴 보리차 한 잔 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "다문화 파트너 및 봉사단 신청",
        subtitle: "한국어 교실 자원봉사 지원서, 이주민 무료 법률 상담 신청, 후원금 기부 소득공제 영수증 요청은 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "오픈 암스 참여 신청"
        }
      }
    ]
  },

  ocean_cleanup_marine: {
    templateId: "ocean_cleanup_marine",
    name: "맑은 바다 구조 해양 쓰레기 연합",
    category: "Community & Non-Profit",
    description: "눈이 탁 트이는 터키 아쿠아 블루와 깨끗한 석고 화이트, 그리고 은은한 골드 액센트로 바다 쓰레기 청소와 해양 생태계 보존을 전하는 세련된 테마입니다.",
    image: "/templates/ocean_cleanup_marine.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#0891b2",     // 청량한 터키쉬 블루 아쿠아
        secondary: "#ecfeff",   // 맑고 눈부신 미색 스카이
        accent: "#d4af37",      // 샴페인 반짝 골드
        background: "#fafcfd",  // 대리석 요란 오프화이트
        surface: "#ffffff",     // 요트 데크 퓨어 화이트
        text: "#155e75"         // 심해 속 아쿠아 틸 네이비
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "바닷속 침몰된 어망과 폐플라스틱을 걷어내고, 맑고 깨끗한 해안선을 수호하다",
        subtitle: "말뿐인 탁상공론 환경 환경 토론을 단호히 거부합니다. 맑은 바다 연합 방식으로, 전용 다이빙 요트를 타고 무인도 해안 절경으로 출항하여, 바위 틈새의 폐어망과 낚시 낚싯줄을 수중 커터로 직접 잘라내고 해변의 미세 플라스틱을 분리 수거하여 해양 동물의 목숨을 구하는 비영리 단체입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1505080856163-3a90910606c4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "해양 쓰레기 청소 클래스",
          ctaLink: "#contact",
          features: [
            { text: "국가공인 해양 세일링 스쿠버 다이빙 면허 보유 베테랑 강사 100% 동승 운항 안전 보증" },
            { text: "수거한 폐플라스틱을 맷돌 압착하여 튼튼한 다이어리 다이어리 커버로 재생해 나눠주는 워크숍" }
          ]
        }
      },
      {
        section_type: "services",
        title: "바다 청정 프로그램",
        subtitle: "바다의 자유로운 에너지를 온전하게 내 심장 속에 이식하는 럭셔리 라인업입니다.",
        content_data: {
          items: [
            {
              title: "무인도 해변 플로깅 출항",
              description: "요트를 타고 인간의 발길이 닿지 않아 쓰레기가 산더미처럼 쌓인 무인도 해안에 상륙하여 플라스틱을 수거합니다.",
              icon: "Compass"
            },
            {
              title: "폐어망 수중 칼날 제거 다이빙",
              description: "안전 조끼를 입고 바닷속 산호초 절벽 틈새를 유영하며 해양 생물을 살해하는 그물망을 절단 제거합니다.",
              icon: "Droplet"
            },
            {
              title: "바다 오염 방지 캠페인 살롱",
              description: "체크인 마리나 라운지에서 대학생들과 해양 미세플라스틱의 독성 유입 분석 세미나를 개최합니다.",
              icon: "Flame"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "해양 정화는 바다를 인간 위주로 개척하는 교만이 아닌, 바다 생명체가 가진 태고의 기하학과 숨결을 온전히 보존하여 인간도 함께 웰니스를 만끽하는 공존의 물리학입니다",
        subtitle: "모든 정화 코스는 100% 실시간 위성 기상 관측을 거쳐 파도 높이 1미터 이하인 안전한 날만 가동됩니다.",
        content_data: {
          description: "안녕하십니까. 맑은 바다 구조 연합의 총지배인 스키퍼입니다. 우리는 바다에 폐유를 무단 방류하고 그물망을 버리며 양심을 상실한 불량 선박 사업주들을 단호히 거부합니다. 우리는 100% 프랑스식 카타마란 쌍동 요트를 타고 소리 없이 물살을 가르며 바다 고유의 거룩한 침묵을 수호하고 난개발을 고발하겠습니다.",
          stats: [
            { label: "누적 수거 폐어망 길이", value: "12,000미터" },
            { label: "보유 구조 전용 카타마란", value: "3척 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "눈부신 쌍동 요트 & 해변 플로깅",
        subtitle: "하얀 선체와 파란 바다의 대비가 압도적인 인생 샷 갤러리 전경입니다.",
        content_data: {
          items: [
            { title: "돛을 펴고 달리는 요트 위 단원들", description: "코발트 바다 위에서 하얀 돛을 조율하며 무인도 수중 절벽으로 출항하는 쾌적하고 럭셔리한 순간", image: "https://images.unsplash.com/photo-1505080856163-3a90910606c4?auto=format&fit=crop&w=600&q=80" },
            { title: "마리나 라운지 내부 회의 스페이스", description: "대리석 테이블 위에 해양 오염 지도가 펼쳐져 있고 빔프로젝터 스크린이 세련되게 세팅된 세미나 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수중 폐어망 절단 다이빙 스냅 스냅", description: "물속 사파이어 빛깔 속에서 칼을 들고 그물에 갇힌 바다거북을 조심스레 방생하는 극적인 해양 스틸 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "해양 다이빙 구조단 및 후원 문의",
        subtitle: "수중 어망 제거 다이버 신청, 해변 플로깅 요트 크루 탑승 신청, 1회/정기 기부 펀드 영수증 요청서를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "바다 구조 신청 완료"
        }
      }
    ]
  },

  single_parent_support: {
    templateId: "single_parent_support",
    name: "맘스 해븐 싱글맘 자립 센터",
    category: "Community & Non-Profit",
    description: "화사하고 달콤한 파스텔 피치 핑크와 깨끗한 린넨 아이보리, 그리고 샴페인 브론즈 골드가 조화를 이루어 미혼모와 싱글맘의 자립과 치유를 돕는 따뜻한 테마입니다.",
    image: "/templates/single_parent_support.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#be123c",     // 매혹적인 라즈베리 로즈 핑크
        secondary: "#ffe4e6",   // 소프트 피치 핑크
        accent: "#fbbf24",      // 반짝이는 마카롱 골드
        background: "#fafaf9",  // 정갈한 대리석 오프화이트
        surface: "#ffffff",     // 깨끗한 위생 세공 테이블
        text: "#1c1917"         // 시인성 높은 다크 초콜릿 카본
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "두 손으로 아기를 안고 외롭게 세상과 맞선 눈물, 이제 따뜻한 아뜰리에의 축제로 채우다",
        subtitle: "생색내기식 소액 보조금 쥐여주고 사회적으로 차별 낙인을 찍는 흔한 미혼모 복지 시설을 단호히 거부합니다. 맘스 해븐 방식으로, 저독성 친환경 비건 수제 비누 제작 기술과 타르트 제과 기술을 이수하여 100% 자립 가능한 평생 직업을 선물하고, 샹들리에 조명 조명 아래서 1인 육아 안식을 누리게 돕는 하이엔드 비영리 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "수제 비누 공방 작품 보기",
          ctaLink: "#services",
          features: [
            { text: "아기가 입으로 물어도 독성 화학 물질이 우려 전혀 없는 천연 에센셜 비건 원료 100% 사용 보증" },
            { text: "음식이 닿는 식기 멸균 및 아기 단독 3면 조명 침대 놀이방 24시간 무상 무상 교대 육아 지원" }
          ]
        }
      },
      {
        section_type: "services",
        title: "맘스 해븐 프로그램",
        subtitle: "여성의 섬세한 손끝 감각을 고밀도로 단련하여 자립을 이끄는 공방 목록입니다.",
        content_data: {
          items: [
            {
              title: "비건 수제비누 조향 공방",
              description: "천연 라벤더와 코코넛 오일을 배합하여 아기 피부 아토피 완화를 돕는 럭셔리 수제 비누를 성형 건조합니다.",
              icon: "Sparkles"
            },
            {
              title: "72겹 벨벳 버터 밀푀유 제과",
              description: "프랑스 고급 고메 버터와 밀가루 생면을 직접 반죽해 디저트 카페에 고가 납품할 제과 기술을 습득합니다.",
              icon: "Heart"
            },
            {
              title: "1인 모던 살롱 심리 힐링",
              description: "아이와 잠시 떨어져 온전히 자신만의 차 한 잔을 마시며 심리 상담사와 미래 비즈니스를 개척하는 코스입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "싱글맘 자립은 단순히 적은 생활비를 지원해 주는 적선이 아닌, 한 사람의 존엄한 여성으로서 사회에 지적 지적 가치를 당당히 증명하게 돕는 평생의 기품 있는 연대입니다",
        subtitle: "모든 클래스는 쾌적한 학습 몰입을 위해 아동 전담 보육 교사가 원내 탁아방에서 안전 보육을 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 맘스 해븐 아뜰리에의 총괄 원장 파티시에입니다. 우리는 생활비 몇 십만 원 쥐여주고 매스컴에 얼굴을 노출시켜 상처를 주는 동정심 마케팅을 단호히 거부합니다. 우리는 프랑스 황실 스파 아로마 향취가 번지는 위생적인 공방에서 천연 비누와 고품격 디저트를 직조하며, 당신의 당당하고 기품 있는 홀로서기를 성심껏 보좌하겠습니다.",
          stats: [
            { label: "자립 취업/창업 싱글맘", value: "350명 돌파" },
            { label: "보유 천연 비건 비누 형틀", value: "24세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수제 비누 건조실 & 디저트 오븐룸",
        subtitle: "바라보는 것만으로도 달콤한 거품 향기가 번져나는 기품 있는 공간 전경입니다.",
        content_data: {
          items: [
            { title: "3단 은식기 디저트 타워 쇼케이스", description: "마카롱과 타르트지가 샹들리에 전등 아래서 보석처럼 세팅된 아기자기하고 화사한 원내 디저트 바", image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&q=80" },
            { title: "천연 비누 숙성 편백나무 건조 랙", description: "오렌지, 라벤더 에센스 비누들이 정갈하게 놓여 건조되며 쾌적한 피톤치드 향취를 방출하는 위생실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "비누 몰드 실링 왁스 낙관 스냅 스냅", description: "투명한 물비누 원액을 실리콘 곽에 부어 건조시키고 이니셜 은빛 낙관을 꾹 눌러 징을 박는 세공사 스포이드 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "공방 입학 신청 및 정기 후원",
        subtitle: "수제 비누 공방 교육생 지원서, 싱글맘 자활 제품 B2B 도매 납품 제안, 기부 영수증 발행 신청서는 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "맘스 해븐 신청 완료"
        }
      }
    ]
  },

  disabled_sports_welfare: {
    templateId: "disabled_sports_welfare",
    name: "배리어프리 장애인 휠체어 체육회",
    category: "Community & Non-Profit",
    description: "스포티하고 에너제틱한 형광 네온 그린과 묵직한 카본 슬레이트 그레이, 강렬한 화이트 배합이 장애인 스포츠와 재활 훈련의 역동성을 선사하는 스포츠 복지 테마입니다.",
    image: "/templates/disabled_sports_welfare.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#10b981",     // 활기찬 네온 에메랄드 그린
        secondary: "#1f2937",   // 도로 아스팔트 카본 그레이
        accent: "#ea580c",      // 타오르는 앰버 오렌지
        background: "#090d16",  // 미래적인 테크 다크블루
        surface: "#111827",     // 은빛 알루미늄 프레임 차콜
        text: "#ffffff"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "신체의 제약을 완전히 찢어내고, 무쇠 휠체어 바퀴로 코트를 질주하다",
        subtitle: "장애를 동정하고 가두어 불쌍하게만 바라보는 나태한 눈총을 단호히 거부합니다. 배리어프리 체육회 방식으로, 초경량 티타늄 스포츠 휠체어와 인체공학적 무릎 지지대를 완비하여, 휠체어 농구부터 탁구까지 오롯이 전신 근육의 탄성과 심장 박동으로 스포츠의 희열을 움켜쥐는 비영리 체육회 포털입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
          ctaText: "휠체어 농구 훈련 참가 신청",
          ctaLink: "#contact",
          features: [
            { text: "패럴림픽 휠체어 메달리스트 출신 수석 감독단 직접 전수 정밀 1:1 수기 밀착 코칭 보증" },
            { text: "이동 장벽을 제로화하는 전용 특수 리프트 셔틀버스 노선 실시간 정보망 전면 무상 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스포츠 스포츠 라인업",
        subtitle: "모발과 휠체어의 기어 기어를 완벽 매칭하여 한계 너머를 개척하는 재활 코스입니다.",
        content_data: {
          items: [
            {
              title: "휠체어 농구 가속 턴",
              description: "초경량 티타늄 바퀴 림에 링 고무를 씌워 손쓸림 부상 없이 360도 급격 피봇 턴을 완수하는 상급 코스입니다.",
              icon: "Zap"
            },
            {
              title: "인체공학 무릎/척추 피팅",
              description: "척추 지지각과 골반 흔들림을 스캐너로 측정해 휠체어 안장 높이를 0.1mm 오차 없이 조율하는 피팅실입니다.",
              icon: "Compass"
            },
            {
              title: "수제 고단백 웰빙 급식",
              description: "근육 세포 회복을 돕는 유기농 참깨 오일 소고기 죽과 락토프리 요거트 비타민 팩을 제공하는 다이닝입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "장애인 스포츠는 동정심을 갈구하는 자선 행사가 아닌, 휠체어 프레임이라는 기계적 물성과 인간의 근육 의지를 하나로 융화하는 위대한 스포츠 과학입니다",
        subtitle: "모든 시술 기구와 휠체어 바퀴는 위생을 위해 당일 사용 즉시 멸균 세척 및 오일 주유를 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 배리어프리 체육회의 헤드 코치 미캐닉입니다. 우리는 낡은 장비를 대충 쥐여주고 바닥 문턱 조차 넘지 못하게 방치하는 전시용 행정 체육관을 단호히 거부합니다. 우리는 휠체어 타이어 압력과 베타 티타늄 프레임 세공을 1:1 맞춤 설정하고, 쾌적하고 세련된 블랙 인프라 속에서 당신의 액티브한 스포츠 낭만을 성심껏 보좌하겠습니다.",
          stats: [
            { label: "등록 장애인 라이더 수", value: "1,200명" },
            { label: "보유 스포츠 티타늄 휠체어", value: "24대 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "티타늄 휠체어 세공소 & 코트 전경",
        subtitle: "사진 한 장만으로도 쇳가루 냄새와 뜨거운 코트의 마찰 소리가 고스란히 전해지는 전경입니다.",
        content_data: {
          items: [
            { title: "코트 위 레이싱 휠체어를 타는 모델", description: "네온 그린 메쉬 져지를 입고 림을 힘차게 굴리며 상대 수비를 돌파해 질주하는 생동감 넘치는 찰나 스틸", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" },
            { title: "은빛 알루미늄 자전거 휠체어 랙 쇼룸", description: "특수 쇼크 옵쇼버 가위 프레임이 세련되게 정렬되어 테크니컬한 멋을 뿜는 미캐닉 정비소 전경", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "바퀴 축 베어링 수기 스포이드 주유 스냅", description: "휠체어 허브 틈새에 전용 정유 스프레이를 정교하게 뿜어내며 낙차 마찰 계수를 0%로 단련하는 바리스타 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "체육회 가입 및 장비 렌탈 상담",
        subtitle: "체육회 신규 단원 신청, 티타늄 스포츠 휠체어 렌탈 상담, 주말 리그 후원 제안서는 아래 양식에 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "체육회 가입 상담"
        }
      }
    ]
  },

  organic_farming_coop: {
    templateId: "organic_farming_coop",
    name: "풍요 오가닉 농가 협동조합",
    category: "Community & Non-Profit",
    description: "싱그러운 허브 세이지 그린과 포근한 꿀 베이지, 그리고 텃밭 브라운 색상이 농가 상생과 유기농 직거래의 가치를 전하는 친환경 테마입니다.",
    image: "/templates/organic_farming_coop.png",
    theme: {
      fontFamily: "Outfit, Noto Sans KR, sans-serif",
      colors: {
        primary: "#15803d",     // 싱그러운 포레스트 그린
        secondary: "#fef08a",   // 화사한 레몬 옐로우
        accent: "#d97706",      // 크래프트 텃밭 브라운
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 깨끗한 대리석 직거래대 화이트
        text: "#14532d"         // 눈이 편안한 올리브 그린 카본
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "중간 유통 카르텔을 단호히 걷어내고, 시골 농부의 땀방울을 정직한 직거래로 수확하다",
        subtitle: "가락시장 경매 수수료 떼먹기로 농가를 등치고 소비자에게는 썩은 채소를 고가에 파는 대형 마트 유통 카르텔을 단호히 거부합니다. 풍요 농가 협동조합 방식으로, 당일 새벽 밭에서 갓 캐낸 유기농 상추, 꽃게, 사과를 무농약 LNT 탑차로 당일 정직 배송하고 수익금의 90%를 농민에게 직접 돌려주는 비영리 상생 협동조합입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1500937386664-56d159f87b81?auto=format&fit=crop&w=1200&q=80",
          ctaText: "금주 제철 유기농 박스 신청",
          ctaLink: "#services",
          features: [
            { text: "중간 마진을 제로화하여 대형 마트 대비 20% 저렴하면서 농가 소득은 2배 이상 보장하는 가격 공식" },
            { text: "토양의 제초제 중금속 성분을 정밀 과학 측정 측정하여 농약 성분 0% 합격 농가만 조합원 가입" }
          ]
        }
      },
      {
        section_type: "services",
        title: "협동조합 에센셜",
        subtitle: "대지의 생명력을 고스란히 이웃 식탁 위로 당일 수확하는 상생 목록입니다.",
        content_data: {
          items: [
            {
              title: "제철 무농약 야채 박스",
              description: "강원도 평창 청정 농가에서 새벽 5시에 수확한 로메인, 방울토마토, 시금치를 흙 묻은 채 포장 배달합니다.",
              icon: "Leaf"
            },
            {
              title: "천연 매실 효소 수제 잼",
              description: "낙과 사과를 폐기하지 않고 매실청 원액으로 다려 단맛을 뿜어내는 농가 자활 수제 가공 소스입니다.",
              icon: "Heart"
            },
            {
              title: "주말 농가 수확 자원 봉사",
              description: "일손이 부족한 시골 과수원에 내려가 배추 모종 심기와 배 봉지 싸기 일손을 돕는 주말 여행 코스입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "상생 협동조합은 단순히 싼 먹거리를 거래하는 장터가 아닌, 도시의 소비자와 시골의 농민이 마주 앉아 대지의 거룩한 흙 냄새를 평생 동안 지켜가는 기품 있는 경제적 동행입니다",
        subtitle: "모든 농산물 패키지는 미세 플라스틱 방지를 위해 100% 생분해 옥수수 전분 봉투와 종이 완충재로 포장됩니다.",
        content_data: {
          description: "안녕하십니까. 풍요 오가닉 조합의 총괄 지배인 가드너입니다. 우리는 과일 표면을 예쁘게 보이기 위해 화학 왁스를 칠하고 방부제를 뿌려 모발과 장기 독성을 유발하는 유통 마피아를 단호히 거부합니다. 우리는 매일 대지의 수분율 데이터를 기록하고, 정갈한 위생 쇼케이스 인프라 속에서 아이들이 유기농 차를 마시며 대나무 숲길 스냅을 감상하는 안락한 아뜰리에 쉼터를 지켜가겠습니다.",
          stats: [
            { label: "참여 농가 소득 상승률", value: "185%" },
            { label: "가입 조합원 도시 회원 수", value: "3,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "파릇한 베란다 모종 텃밭 & 농가 쇼룸",
        subtitle: "초록 채소들이 햇살을 머금고 무배출 청정 호흡하는 상쾌한 친자연 공간 전경입니다.",
        content_data: {
          items: [
            { title: "밭고랑 사이에 갓 캐낸 감자 박스", description: "화창한 아침 햇살 아래 황토 밭 위에서 알이 굵은 감자들이 종이 상자 안에 가득 담겨 수확된 모습", image: "https://images.unsplash.com/photo-1500937386664-56d159f87b81?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 빈티지 로컬 직거래 매장", description: "아늑한 꼬마 전구 전등 아래 유기농 과일잼 병들과 로즈마리 화분들이 아기자기하게 진열된 카운터 바", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "딸기 수제 잼 동 냄비 끓임 스냅", description: "수확한 낙과 딸기를 뭉근히 끓여내며 국자로 거품을 맑게 걷어올려 위생 병에 담는 장인의 작업실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "조합원 가입 및 농산물 정기 구독",
        subtitle: "제철 야채 박스 격주 정기 배송 구독 신청, 귀농 자문 컨설팅 예약, 주말 농촌 봉사 참여 신청서는 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "직거래 구독 신청"
        }
      }
    ]
  },

  mental_health_helpline: {
    templateId: "mental_health_helpline",
    name: "마음의 숲 지각 명상 웰니스 카운셀링",
    category: "Community & Non-Profit",
    description: "유기농 라벤더 퍼플과 맑고 고요한 클레이 그레이, 그리고 따스한 샌드 로즈 포인트로 극진한 마음챙김과 자율신경 안정을 서포트하는 명상 테마입니다.",
    image: "/templates/mental_health_helpline.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#581c87",     // 맑은 로열 라벤더 퍼플
        secondary: "#fdf4ff",   // 소프트 피치 라벤더
        accent: "#b45309",      // 앰버 오렌지 등대
        background: "#faf8fb",  // 차분한 아로마 웜 화이트
        surface: "#ffffff",     // 위생적인 1인 대화 테이블
        text: "#3b0764"         // 가독성이 탁월한 다크 딥 퍼플
      },
      borderRadius: "rounded-full",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "전신의 무거운 긴장과 우울을 한 숨결로 비워내고, 맑은 빛으로 뇌파를 정화하다",
        subtitle: "독성 알약 처방과 기계적이고 차가운 흰 벽면 상담소의 상업용 카르텔을 단호히 거부합니다. 마음의 숲 방식으로, 티베트 싱잉볼의 은은한 물결 진동과 천연 아로마 향초 향취 속에서, 자율신경계를 안정시키고 1인 단독 고요 속에서 깊은 사색 대화를 통해 내면의 상처를 부드럽게 해독하는 비영리 상담 웰니스 랩입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "1인 침묵 명상 상담 신청",
          ctaLink: "#services",
          features: [
            { text: "천연 아로마 로즈마리 오일을 도포하여 지친 두뇌 신경 세포 이완 마사지 즉각 무료 제공" },
            { text: "한국 임상 심리학회 공인 1급 심리 상담 전문가들의 고밀도 1:1 비밀 수기 상담 동행 보증" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마음챙김 큐레이션",
        subtitle: "지친 두뇌와 불안한 영혼을 투명하고 안전하게 구원하는 스튜디오 프로그램입니다.",
        content_data: {
          items: [
            {
              title: "싱잉볼 음향 명상 힐링",
              description: "귀를 열고 대형 청동 싱잉볼의 맑은 마찰 진동을 뇌하수체 세포 속에 동조시켜 과각성 상태를 안정시킵니다.",
              icon: "Heart"
            },
            {
              title: "천연 아로마 림프 이완 스파",
              description: "라벤더 에센셜 오일 향취를 들이마시며 목덜미와 쇄골의 뭉친 어혈을 마사지로 맑게 순환시킵니다.",
              icon: "Droplet"
            },
            {
              title: "비건 명상 차도 살롱 살롱",
              description: "상담을 마친 뒤 유기농 국화꽃잎차를 우려 마시며 1인 사색의 침묵을 감상하는 안락한 라운지입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "상담은 약물로 슬픔을 가리는 억압이 아닌, 내 머릿속을 지나가는 불안한 잡념들을 흘러가는 흰 구름처럼 조용히 응시하며 내면의 뿌리를 굳건히 다지는 지적인 자아 수호입니다",
        subtitle: "모든 상담 기록은 개인정보 보호법에 의거 100% 무조건 영구 소각 처리되어 철저히 비밀 보장됩니다.",
        content_data: {
          description: "안녕하십니까. 마음의 숲 웰니스 랩의 오너 카운셀러 원장입니다. 우리는 몇 분 만에 대충 면담하고 환자를 기계적으로 취급하며 독성 약물을 쏟아부어 부작용을 유발하는 상업용 정신병원을 단호히 거부합니다. 우리는 편백나무 숲속 가옥 인프라를 구축하고, 촛불 하나와 아로마 향취가 흔들리는 쾌적한 다도 룸에서 당신만의 평화롭고 따뜻한 쉼터를 보좌하겠습니다.",
          stats: [
            { label: "상담 후 우울감 지수 완화율", value: "98.5%" },
            { label: "보유 천연 아로마 균주 수", value: "35가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "고요한 다도 다도 살롱 & 싱잉볼 스튜디오",
        subtitle: "보는 것만으로도 머릿속의 어지러운 데이터가 맑게 정돈되는 아키텍트 전경입니다.",
        content_data: {
          items: [
            { title: "아늑한 1인 촛불 명상실 베드", description: "라벤더 오일 앰플과 대형 청동 싱잉볼이 매트 옆에 이쁘게 세팅된 쾌적하고 조용한 명상 존", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" },
            { title: "유기농 녹차 우려나는 다도 다기 바", description: "대나무 찻상 위에 황토 찻잔 두 잔과 모래시계가 세련되게 세팅되어 차분함을 주는 상담 대기 라운지", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "향수 조향 스포이드 드롭 찰나 스냅", description: "라벤더 아로마 액체가 한 방울 뚝 떨어져 유리 비커 안에 윤기 물결 동심원을 코팅하는 청결한 스케치 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "명상 상담 및 폰 부스 예약",
        subtitle: "방문 예정 일시, 상담 프로그램 선택(싱잉볼/아로마/1인대화), 현재 복용 복용 중인 약물이 있다면 가볍게 적어 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "마음의 숲 예약 완료"
        }
      }
    ]
  },

  neighborhood_association_safety: {
    templateId: "neighborhood_association_safety",
    name: "안전 안심 우리동네 자율 방범단",
    category: "Community & Non-Profit",
    description: "인더스트리얼하고 묵직한 카본 블랙과 안전 형광 네온 옐로우, 그리고 시인성 높은 은빛 화이트 조화로 주민 안전과 자율 방범 활동을 고취하는 테마입니다.",
    image: "/templates/neighborhood_association_safety.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#eab308",     // 형광 네온 안전 옐로우
        secondary: "#3f3f46",   // 묵직한 아스팔트 차콜 그레이
        accent: "#dc2626",      // 경고 경고 레드
        background: "#09090b",  // 밤골목 다크 서킷 블랙
        surface: "#18181b",     // 탄소 섬유 그릴 차콜
        text: "#ffffff"         // 시인성 높은 완전 울트라 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "어두운 골목길 모퉁이, 밤길 귀가하는 여학생과 어린이 발걸음을 안전하게 엄호하다",
        subtitle: "생색내기식 경찰 순찰 공백과 차가운 CCTV 모니터 뒤의 방관 카르텔을 단호히 거부합니다. 우리동네 방범단 방식으로, 주민들이 직접 야간 서치라이트 기어와 무선 헬멧 커뮤니케이터를 완비하고 2인 1조로 골목길 험로를 순찰하여 범죄 우려를 0% 오차 없이 차단하는 자발적 비영리 안전 연합입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1508427987370-763aa473aee8?auto=format&fit=crop&w=1200&q=80",
          ctaText: "야간 방범 순찰 동참 신청",
          ctaLink: "#contact",
          features: [
            { text: "아동 성범죄 성폭력 발생률 0건 유지를 위해 초등학교 주변 유해 업소 골목 집중 감시 순찰" },
            { text: "체크인 시 경찰 무전기 연동 스마트 안심 귀가 어플 GPS 동기화 추적 시스템 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "자율 방범 프로그램",
        subtitle: "골목길 치안의 사각지대를 안전하게 개척하는 주민 순찰 목록입니다.",
        content_data: {
          items: [
            {
              title: "2인 1조 야간 안심 도보 순찰",
              description: "형광 네온 조끼를 입고 서치라이트 라이트를 비추며 밤 10시부터 새벽 1시까지 주택가 험로 구석구석을 감시 순찰합니다.",
              icon: "Compass"
            },
            {
              title: "여성 안심 귀가 동행 마샬",
              description: "늦은 밤 버스 정류장 정거장에서 하차하는 주민을 안심 귀가 시키는 1:1 보디가드 동행 서비스입니다.",
              icon: "Heart"
            },
            {
              title: "소형 비상벨 가드 시공 가이드",
              description: "골목길 벽면 벽돌 틈새에 위급 시 경찰서로 즉시 무선 신호를 송출하는 버튼벨을 빌트인 설치합니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "치안은 공권력의 순찰 주파수만 기다리는 방관이 아닌, 내 이웃과 내 가족의 안전한 퇴근길을 위해 주민 스스로 망치 망치 들고 밤길을 사수하는 뜨거운 자치 인류애입니다",
        subtitle: "모든 순찰 단원은 아동 학대와 성범죄 전과 이력 조회를 100% 투명하게 거친 신뢰 단원들로만 엄선 구성됩니다.",
        content_data: {
          description: "안녕하십니까. 우리동네 자율 방범단의 총괄 피트마스터 캡틴입니다. 우리는 전시성 플랜카드나 걸어두고 순찰비만 청구하는 불량 관변 자치 단체들을 단호히 거부합니다. 우리는 야간 순찰용 고조도 서치 라이트 배터리를 상시 완비하고, 쾌적하고 위생적인 초소 인프라를 가동하며, 주민들의 따뜻하고 안전한 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 순찰 완료 횟수", value: "3,500회 돌파" },
            { label: "보유 전술 무전기 세트", value: "24세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "야간 방범 초소 & 무전기 보관함",
        subtitle: "사진 한 장만으로도 안전한 쇳소리와 주민들의 든든한 땀 냄새가 고스란히 전해지는 전경입니다.",
        content_data: {
          items: [
            { title: "안전 조끼를 입은 야간 라이더 단원", description: "어두운 밤거리 골목 네온 스프레이 벽면 벽면 앞에 서서 무전기를 쥐고 브리핑하는 순찰 단원 스냅", image: "https://images.unsplash.com/photo-1508427987370-763aa473aee8?auto=format&fit=crop&w=600&q=80" },
            { title: "철제 수납함 속 정렬된 안전 기어들", description: "은빛 알루미늄 락커 안에 야간 서치라이트와 형광 봉, 경찰 호루라기들이 정갈하게 진열된 방범 초소", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "무선 무전기 안테나 안테나 셋업 찰나", description: "초소 책상 위에 전술 무전기 충전기 렉과 나침반, 그리고 따뜻한 보리차 주전자 스냅 스냅 데코", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "방범 대원 가입 및 위급벨 시공 상담",
        subtitle: "야간 순찰 방범대 신입 대원 신청, 내 집 골목길 비상벨 무상 시공 신청, 초소 간식 후원 문의는 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "방범대 신청 완료"
        }
      }
    ]
  },

  rare_disease_patient_aid: {
    templateId: "rare_disease_patient_aid",
    name: "희망의 꽃 희귀 난치성 소아마비 환우회",
    category: "Community & Non-Profit",
    description: "눈부시게 깨끗한 스노우 크리스탈 화이트와 사랑스러운 파스텔 로즈 베이지, 그리고 시야를 사수하는 네온 형광 주황 포인트로 난치 환우 지원과 휠링을 전하는 테마입니다.",
    image: "/templates/rare_disease_patient_aid.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 차분한 딥 네이비
        secondary: "#e0f2fe",   // 맑고 깨끗한 아일랜드 라이트블루
        accent: "#ea580c",      // 형광 네온 희망 오렌지
        background: "#fafcfd",  // 퓨어 웰빙 화이트 미색
        surface: "#ffffff",     // 위생적인 1인 소아 침실 화이트
        text: "#0f172a"         // 울트라 슬레이트 차콜 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "비싼 수입 약값과 전 세계 0.01% 희귀 질환의 침묵 속에 외롭게 우는 아이",
        subtitle: "환우의 아픔을 자선 마케팅으로 이용해 고액 방송 출연료만 챙기는 사설 모금 카르텔을 단호히 거부합니다. 희망의 꽃 방식으로, 국내 공식 의과대학 소아 신경과 시니어 의사진과 협조하여, 전 세계 단 6개 제약사에서만 독점 생산되는 유전자 치료 신약을 신속 배송 수입 매칭하고, 병실 밖 하늘이 보이는 통나무 살롱에서 1인 웰니스 정서 미술 놀이를 제공하는 비영리 환우회입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&w=1200&q=80",
          ctaText: "환우 치료 지원 현황 보기",
          ctaLink: "#services",
          features: [
            { text: "독성 화학 보존제 0% 오가닉 항체 치료제 앰플 수입 관세 면제 신속 통관 코스 구축" },
            { text: "아이의 정서적 피로를 차단하는 3000K 캘빈 온도의 따뜻한 간접 조명 전용 힐링 병실 무상 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "환우 지원 프로그램",
        subtitle: "여린 생명의 세포 세포 하나를 안전하고 따스하게 수호하는 의학 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "희귀 신약 긴급 수입 통관",
              description: "국내 미출시된 희귀 근육병 유전자 주사제 원액을 독일 제약사로부터 무관세 긴급 항공 공수합니다.",
              icon: "Zap"
            },
            {
              title: "1인 아동 미술 힐링 세션",
              description: "주사 바늘 통증 공포심을 지우기 위해 무독성 파스텔 물감으로 천연 캔버스 위에 꿈을 드로잉하는 코스입니다.",
              icon: "Sparkles"
            },
            {
              title: "환우 부모 쉼터 온천 테라피",
              description: "간병에 지친 부모님들의 근막 근막 피로를 풀기 위해 국산 민트 소금을 넣은 편백 노천 스파를 대여합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "난치 환우회는 단순히 병원비를 기부해 주는 적선이 아닌, 전 세계 0.01%의 쓸쓸한 병실 안에서 고독하게 질병과 싸우는 어린아이에게 내일 아침의 따스한 태양빛과 자립의 희망을 정직하게 선물하는 인류애의 최고 지평선입니다",
        subtitle: "모든 기부 후원금 분배 내역은 정부 공식 감사 감사 법인의 1원짜리 전자 영수증까지 실시간 100% 투명 공개됩니다.",
        content_data: {
          description: "안녕하십니까. 희망의 꽃 환우회의 총감독 대표 이사입니다. 우리는 기부금을 걷어 직원들의 홍보 인건비로 탕진하고 정작 아이들의 약값 지원은 중단해버리는 무책임한 관변 자선 단체들을 단호히 거부합니다. 우리는 100% 무독성 필터 공기 청정 돔 병실을 상시 가동하고, 쾌적하고 위생적인 샬레 라운지 인프라 속에서 아이들과 부모님의 따뜻한 안식을 수호하겠습니다.",
          stats: [
            { label: "치료 지원 완료 환아 수", value: "1,500명 돌파" },
            { label: "협력 소아 신경 전문의", value: "24명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아동 아크릴 미술실 & 편백 스파룸",
        subtitle: "사진 한 장만으로도 가슴이 뭉클해지고 머리가 맑게 씻기는 웰니스 공간 갤러리입니다.",
        content_data: {
          items: [
            { title: "하늘이 보이는 통유리 아동 병실", description: "아늑한 3면 간접 조명 아래 하얀 타월과 그림 이젤이 세팅되어 아이들이 놀기 좋은 프라이빗 1인 룸", image: "https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&w=600&q=80" },
            { title: "편백나무 가구 야외 온천 노천탕", description: "따스한 김이 모락모락 솟아오르고 대나무 화분들과 조화를 이루어 간병 부모 피로를 리셋하는 탕 코너", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "인삼 엑기스 앰플 스포이드 드롭 스냅", description: "유리 튜브 안에서 붉은 약초 영양 에센스가 뚝 떨어져 은색 계량 비커 안에 물결 동심원을 퍼뜨리는 청결실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "장학금 지원 및 기부 참여 문의",
        subtitle: "소아 난치 신약 비용 지원 신청, 아동 정서 미술 봉사 활동 참가 신청, 1회/정기 후원 신청서는 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "희망의 꽃 후원 신청"
        }
      }
    ]
  },

  blood_donation_campaign: {
    templateId: "blood_donation_campaign",
    name: "사랑의 헌혈 골든 생명나눔",
    category: "Community & Non-Profit",
    description: "생명을 구호하는 강렬한 크림슨 헌혈 레드와 맑은 크리스탈 화이트, 그리고 은빛 샴페인 브론즈 골드가 조화를 이루어 헌혈과 수혈 캠페인의 숭고함을 높이는 테마입니다.",
    image: "/templates/blood_donation_campaign.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#be123c",     // 생명의 헌혈 핏빛 레드
        secondary: "#fdf2f8",   // 맑고 깨끗한 아침 이슬 핑크
        accent: "#d4af37",      // 샴페인 브론즈 골드
        background: "#fafcfd",  // 퓨어 아쿠아 오프화이트
        surface: "#ffffff",     // 깨끗한 헌혈대 세라믹 화이트
        text: "#1e293b"         // 스마트하고 신사적인 네이비 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "내 혈관 속에 흐르는 따스한 생명력을, 절박한 수술실 위 형제에게 수여하다",
        subtitle: "헌혈증 거래 암시장과 수수료를 편취하여 생명을 흥정하는 상업용 병원 카르텔을 단호히 거부합니다. 생명나눔 방식으로, 당일 기부 기부된 혈액을 안전한 저온 콜드체인 탑차로 대학병원 수술실로 골든타임 10분 오차 없이 직배 수송하고, 헌혈자에게는 저자극 천연 비타민 웰컴 음료와 훈장 메달을 헌정하는 비영리 생명 나눔 연대입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1536856788985-e011cf80d66c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "우리동네 헌혈의 집 위치",
          ctaLink: "#services",
          features: [
            { text: "에이즈, 간염 등 유해 세균을 0.00% 차단하기 위해 1회용 멸균 주삿바늘 및 특수 튜브 사용 보증" },
            { text: "체크인 시 헌혈 후 급격한 빈혈을 방지하는 수제 락토프리 요거트 밀크와 철분 쿠키 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "생명나눔 프로그램",
        subtitle: "생명의 핏줄 핏줄을 안전하고 기품 있게 연결하여 이웃을 구원하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "헌혈의 집 1인 헌혈석",
              description: "전동 안락 의자에 편안히 누워 소음 방지 클래식 음악을 들으며 15분 만에 320cc 헌혈을 완수합니다.",
              icon: "Heart"
            },
            {
              title: "대학병원 긴급 수혈 매칭",
              description: "응급 교통사고나 산모 출혈 시, 혈액형 일치 헌혈 혈액을 특수 냉장 탑차로 긴급 앰뷸런스 배달합니다.",
              icon: "Zap"
            },
            {
              title: "헌혈 서포터즈 청년 연대",
              description: "대학 캠퍼스에 헌혈 버스를 투입하여 젊은 대학생들의 헌혈 서약과 헌혈증 기부 릴레이를 촉구합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "헌혈은 나를 해치는 희생이 아닌, 내 몸이 건강하게 순환하고 맑은 혈액을 신진대사하는 웰빙이며, 소리 없이 한 사람의 꺼져가는 심장 박동을 살려내는 최고의 영광입니다",
        subtitle: "모든 헌혈 공정은 철저한 아티스트 바늘 멸균 오븐을 거쳐 무독성 환경 속에서 안전 엄수됩니다.",
        content_data: {
          description: "안녕하십니까. 사랑의 헌혈 골든 연합의 총괄 원장 의사입니다. 우리는 혈액을 모아 불법 상업용 에센스 화장품 원료로 팔아넘겨 사적 이익을 편취하는 불량 자선 단체들을 단호히 거부합니다. 우리는 100% 투명한 혈액 보존 온도를 상시 모니터링하고, 쾌적하고 위생적인 수유실 인프라를 가동하며, 생명 나눔에 동참하는 영웅들의 따뜻한 안식을 수호하겠습니다.",
          stats: [
            { label: "누적 생명 구호 헌혈 횟수", value: "12,000회 돌파" },
            { label: "보유 긴급 수송 콜드차량", value: "3척 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "깨끗한 헌혈의 집 & 혈액 보관고",
        subtitle: "사진 한 장만으로도 맑은 이슬 핑크빛과 신뢰가 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "안락의자 전동 베드 헌혈석 뷰", description: "하얀 콘크리트 벽면에 은은한 주황 등 샹들리에가 켜져 있고 편안한 1인 의자가 안착된 헌혈의 집 전경", image: "https://images.unsplash.com/photo-1536856788985-e011cf80d66c?auto=format&fit=crop&w=600&q=80" },
            { title: "2도 일정한 온도로 붉게 도는 저장고", description: "투명한 강화유리 챔버 문을 통해 수혈용 팩들이 기품 있게 정렬되어 온도를 유지 보존하는 보관실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 철분 에스프레소 쿠키와 우유 스냅", description: "원목 테이블 위에 철분이 가득 든 다크 초콜릿 쿠키와 맑은 우유 한 잔, 헌혈 명예 훈장 핀 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "단체 헌혈 버스 및 봉사 신청",
        subtitle: "기업/학교 단체 헌혈 버스 파견 신청, 헌혈증서 기부 릴레이 참여, 서포터즈 대학생 기자단 신청서는 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "헌혈의 집 신청 완료"
        }
      }
    ]
  },

  // 18. eco_reverse_upcycling (에코 리버스 업사이클링 사회적 기업)
  // 19. human_rights_watch (보더리스 자유 인권 감시 연합)
  // 20. space_science_youth_club (갤럭시 키즈 청소년 우주 과학 캠프)
  // Let's implement these three premium themes to make exactly 20.

  eco_reverse_upcycling: {
    templateId: "eco_reverse_upcycling",
    name: "에코 리버스 업사이클링 사회적 기업",
    category: "Community & Non-Profit",
    description: "싱그러운 청정 숲속 올리브 리프 그린과 맑고 깨끗한 아침 스카이 블루, 그리고 앰버 오렌지 조화의 에코 업사이클링 사회적 기업 테마입니다.",
    image: "/templates/eco_reverse_upcycling.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#15803d",     // 에코 리프 그린
        secondary: "#e0f2fe",   // 라이트 스카이 블루
        accent: "#ea580c",      // 앰버 오렌지 불꽃
        background: "#fafbf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 위생적인 리브 테이블 화이트
        text: "#14532d"         // 눈이 편안한 포레스트 그린 차콜
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "버려진 폐현수막과 안전벨트가 은빛 알루미늄 링을 만나 프리미엄 백팩으로 되살아나다",
        subtitle: "한 번 쓰고 버리는 화학 플라스틱 소품 쇼핑을 단호히 거부합니다. 에코 리버스 방식으로, 폐 소방 호스와 군용 천막 등 극한의 생존 질감이 깃든 고중량 섬유를 꼼꼼하게 손세척하고 해체하여, 겉은 빈티지하지만 세상에 단 하나뿐인 지적이고 단단한 수제 방수 가방으로 리벌싱하는 사회적 기업입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
          ctaText: "업사이클링 제품 라인업",
          ctaLink: "#services",
          features: [
            { text: "소방관들이 목숨 걸고 화염을 진압하며 그을린 폐소방호스를 수기 해체 재단한 고밀도 원단 사용" },
            { text: "체크인 시 가방 뒷면에 박제된 소방관 매칭 홀로그램 시리얼 넘버 기부 가이드북 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "업사이클링 큐레이션",
        subtitle: "쓰레기통으로 가는 유휴 섬유 위에 새 생명의 숨결을 단단하게 수놓는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "소방호스 수제 메신저 백",
              description: "고압 수압을 견디는 소방호스 특유의 질긴 폴리에스테르 섬유를 해체 봉제하여 물속 방수율을 100% 수호합니다.",
              icon: "Zap"
            },
            {
              title: "군용 포대 자라 롱 스커트 스커트",
              description: "낡은 군용 텐트 천막의 빈티지 올리브 올리브 카키 색상을 살려 입체 드로잉 패턴으로 성형한 의류입니다.",
              icon: "Leaf"
            },
            {
              title: "폐 안전벨트 크로스 끈 하네스",
              description: "폐차에서 수거한 수톤 수톤 인장 하중을 견디는 단단한 가죽 끈 안전벨트를 어깨 끈으로 리사이클합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "업사이클링은 낡은 폐기물을 조잡하게 재활용하는 가난함이 아닌, 물건이 겪어낸 시간의 정직한 흉터와 훈장을 세련된 디자인으로 봉인하여 명품보다 더 럭셔리하게 재탄생시키는 지적인 순환입니다",
        subtitle: "모든 의류 및 가방은 위생 상태를 보증하기 위해 120도 열풍 살균 오븐을 거쳐 포장 배송됩니다.",
        content_data: {
          description: "안녕하십니까. 에코 리버스의 수석 업사이클 디렉터입니다. 우리는 석유 오염을 유발하며 수백 년이 흘러도 썩지 않는 기계식 양산 플라스틱 비닐을 단호히 거부합니다. 우리는 소방관 순직 지원 및 이주민 자활 일자리를 100% 매칭하여, 쾌적하고 위생적인 아뜰리에 인프라 속에서 당신만의 서스테이너블 자존심을 수호하겠습니다.",
          stats: [
            { label: "구조해 낸 소방 호스 길이", value: "3,500미터+" },
            { label: "장인 자활 성공 취약계층", value: "14명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "소방 호스 세척실 & 뀌르 가방 공방",
        subtitle: "사진 한 장만으로도 깨끗한 물청소와 굵은 스티치 바느질 소리가 흐르는 듯한 전경입니다.",
        content_data: {
          items: [
            { title: "세척실 랙에 걸려 건조되는 호스들", description: "아늑한 핀 조명 아래 붉고 노란 소방 호스 롤들이 정갈하게 수록되어 제작 대기 중인 모습", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" },
            { title: "나무 포니 가방 바느질 세공 바", description: "나무 기어 레버 거치대 사이에 베지터블 천 조각을 끼워두고 두 손으로 왁스 실 바느질을 가하는 현장", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "황동 아일렛 쇠고리 망치질 스냅 스냅", description: "가방 덮개 위에 통 황동 단추를 올리고 소형 나무 망치를 휘둘러 리벳 징을 튼튼히 안착시키는 조리 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "기업 단체 사은품 및 제휴 의뢰",
        subtitle: "회사 단체 ESG 비즈니스 백팩 주문 상담, 폐자원 무상 기부 상담, 오프라인 업사이클링 클래스 신청서는 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "업사이클링 상담 신청"
        }
      }
    ]
  },

  human_rights_watch: {
    templateId: "human_rights_watch",
    name: "보더리스 자유 인권 감시 연합",
    category: "Community & Non-Profit",
    description: "중후한 잉크 블랙과 선명한 경고 옐로우, 그리고 은빛 샴페인 브론즈 골드가 조화를 이루어 전 세계 자유와 인권 침해를 감시하는 비영리 단체 테마입니다.",
    image: "/templates/human_rights_watch.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#eab308",     // 형광 경고 옐로우
        secondary: "#18181b",   // 시크한 슬레이트 다크 블랙
        accent: "#c5a880",      // 샴페인 브론즈 골드
        background: "#09090b",  // 미제르 제트 블랙 암막
        surface: "#18181b",     // 쇠창살 그릴 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-sm",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "어두운 철창 속 외롭게 갇힌 양심수와 보도 통제 뒤 숨겨진 국가 폭력의 고발",
        subtitle: "외교적 뜬소문과 찌라시 정보, 그리고 강대국들의 눈치를 보며 인권 침해를 묵인하는 비겁한 국제 관료 주의를 단호히 거부합니다. 자유 인권 감시 연합 방식으로, 국제 분쟁 지역 현장에 정밀 조사관을 직접 투입하여, 소수 민족 학살과 언론 탄압의 현장을 실시간으로 100% 디지털 문서화하고 팩트 체크 리포트를 전 세계 언론에 배포하는 인권 시민 행동 연합입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          ctaText: "인권 침해 현장 리포트",
          ctaLink: "#services",
          features: [
            { text: "유엔 공식 가이드 및 국제 엠네스티 연합 공인 조사관들의 현장 직접 취재 조사 분석" },
            { text: "소셜 미디어 보도 통제 해제를 위해 스타링크 위성 네트워크를 통한 현장 팩스 영상 실시간 탈출" }
          ]
        }
      },
      {
        section_type: "services",
        title: "인권 수호 프로그램",
        subtitle: "전 세계 절벽 끝에 선 시민들의 목소리를 안전하고 기품 있게 구원하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "글로벌 팩트체크 현장 조사",
              description: "분쟁 지역 검문소와 난민 수용소를 직접 방문하여 구금자 학대 유무를 감시하고 인권 진술서를 녹음 채록합니다.",
              icon: "Compass"
            },
            {
              title: "언론 탄압 해제 위성 송출",
              description: "정부 군의 무선 인터넷 차단망을 우회하는 VPN 네트워크와 보안 통신 폰 부스를 난민 수용소에 무료 배포합니다.",
              icon: "Zap"
            },
            {
              title: "양심수 석방 법률 소송 자문",
              description: "부당 구금된 인권 운동가 석방을 위해 국제 사법 재판소 소송 비용을 무상 지원하고 변호인단을 섭외합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "인권은 법 조문에 박제된 화려한 글귀가 아닌, 침묵을 강요당하는 독재의 쇠창살 틈새로 내 형제의 비명 소리를 온전히 해독하고 전 세계에 포효하는 숭고한 용기의 증명입니다",
        subtitle: "모든 조사관의 신원 정보와 난민들의 1:1 진술 문서는 보안 유지를 위해 최고 등급 암호화 처리됩니다.",
        content_data: {
          description: "안녕하십니까. 보더리스 인권 감시 연합의 총괄 대표 변호사입니다. 우리는 기부금을 모아 사적 이익을 편취하고 정치 권력과 타협하여 정작 박해받는 양심수들은 모른 채 외면하는 위선적 인권 단체들을 단호히 거부합니다. 우리는 100% 무독성 팩트 기반 정보만을 전 세계에 유통하고, 쾌적하고 위생적인 안식실 인프라를 가동하며, 인권 수호를 위해 타협 없이 투쟁하겠습니다.",
          stats: [
            { label: "석방 완료 인권 운동가 수", value: "1,500명+" },
            { label: "보유 법률 전문 인권 조사관", value: "24명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "철제 락커 서재 & 보안 프라이빗 룸",
        subtitle: "사진 한 장만으로도 엄숙한 신뢰와 기품이 고스란히 풍기는 전경입니다.",
        content_data: {
          items: [
            { title: "노출 콘크리트 벽면 철제 락커룸", description: "아늑한 핀 조명 아래 보안 캐비넷과 인권 조사 기록 바인더가 정갈하게 수록되어 보관 중인 보존실", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
            { title: "비밀 화상 회의 폰 부스 내부", description: "아늑한 링 라이트 조명이 비추고 헤드셋을 착용한 채 해외 현지 제보자와 줌 미팅을 진행하는 쾌적한 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "보안 맥북 키보드와 암호화 키 스냅", description: "원목 테이블 위에 은빛 노트북과 만년필 시트, 그리고 따뜻한 보리차 찻잔 데코 스냅 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "인권 침해 제보 및 변호사 지원",
        subtitle: "긴급 인권 침해 제보서 작성, 자원봉사 변호사단 가입 신청, 기부 영수증 발행 신청서는 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "인권 연합 참여 신청"
        }
      }
    ]
  },

  space_science_youth_club: {
    templateId: "space_science_youth_club",
    name: "갤럭시 키즈 청소년 우주 과학 캠프",
    category: "Community & Non-Profit",
    description: "눈이 탁 트이는 터키 아쿠아 블루와 눈부시게 깨끗한 펄 오프화이트, 그리고 은빛 실버 포인트 배합으로 청소년들의 우주 과학의 꿈을 전하는 스포티한 테마입니다.",
    image: "/templates/space_science_youth_club.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#0284c7",     // 맑고 시원한 우주 블루
        secondary: "#e0f2fe",   // 은빛 은하수 아일랜드 블루
        accent: "#f43f5e",      // 네온 구조 자몽 자스민
        background: "#090d16",  // 미래적인 다크 스페이스
        surface: "#111827",     // 은빛 알루미늄 우주선 차콜
        text: "#ffffff"         // 시인성 극대화 스마트 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지상의 중력을 벗어나 저 광활한 은하수 너머, 나만의 수제 로켓을 발사하다",
        subtitle: "모든 지루한 주입식 물리 물리 암기 공식을 단호히 멈추십시오. 갤럭시 키즈 방식으로, 한국 항공 우주 전문가의 1:1 로켓 궤도 공학 코칭과 모형 화약 로켓 발사 훈련, 그리고 3D 프린터로 제작하는 천체 망원경 조립 세션을 무상 제공하여 교육 소외지 소외지 청소년들에게 미래 우주 과학자의 날개를 달아주는 비영리 과학 캠프 연합입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
          ctaText: "화약 로켓 발사 캠프 신청",
          ctaLink: "#contact",
          features: [
            { text: "안전 사고 발생률 0.00% 차단을 위해 특수 불연성 화약 연료와 원격 안전 안전 스위치 시공 완료" },
            { text: "아이가 직접 별자리를 스캔하고 추적하는 천체 드로잉 스마트 태블릿 기기 전용 무상 대여" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스페이스 프로그램",
        subtitle: "아이들의 여린 과학적 날개를 안전하고 기품 있게 단련하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "3D 프린팅 모형 로켓 조립",
              description: "3D 프린터 기기로 공기 저항 계수가 최소화된 물고기 모양 모형 몸체를 사출하고 낙하산 엔진을 장착합니다.",
              icon: "Zap"
            },
            {
              title: "천체 망원경 별자리 관측",
              description: "야외 잔디 구장에 천체 망원경을 셋업하고 전문 강사와 목성 토성의 고리 링 구조를 관측합니다.",
              icon: "Compass"
            },
            {
              title: "스페이스 푸드 만들기 살롱",
              description: "우주 비행사들의 우주 식단인 진공 팩 건조 동결 딸기와 미네랄 귀리 쿠키를 직접 조리해 맛보는 클래스입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "우주 과학은 수학 기호로 가득 찬 차가운 암기가 아닌, 저 무한한 밤하늘 은하수 불꽃 아래 내 손으로 쏘아 올린 로켓 물리학의 즐거움 속에 세상을 바꿀 지적 호기심의 씨앗을 품는 우아한 축제입니다",
        subtitle: "모든 실험 교구와 숙소 린넨은 아동 위생을 위해 매일 살균 오븐을 거쳐 정결하게 엄수됩니다.",
        content_data: {
          description: "안녕하십니까. 갤럭시 키즈 과학 캠프의 총괄 이사 교수입니다. 우리는 값비싼 과외 교재비나 사설 캠프 참가비를 요구하며 가난한 가정의 아이들에게 상처를 주는 상업용 사교육을 단호히 거부합니다. 우리는 100% 투명한 무상 교육을 제공하고, 쾌적하고 위생적인 샬레 식기실 인프라를 가동하며, 아이들의 빛나는 꿈을 수호하겠습니다.",
          stats: [
            { label: "배출된 미래 장학생 수", value: "1,500명+" },
            { label: "보유 전문 모형 로켓 엔진", value: "85종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "하얀 과학 실험실 & 3D 프린터실",
        subtitle: "사진 한 장만으로도 상쾌한 맑음과 은빛 기어들이 세련되게 어우러진 미래 전경입니다.",
        content_data: {
          items: [
            { title: "천문 망원경이 서 있는 야외 잔디밭", description: "파란 하늘 아래 초록 천연 잔디 구장에서 아이들이 망원경 렌즈를 통해 하늘을 바라보는 순간", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 프린터가 정렬된 스마트 교육실", description: "아늑한 핀 조명이 비추고 은빛 알루미늄 프린터들이 기하학적 로켓 몸체를 사출 중인 쾌적한 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "동결 건조 과일과 우주 쿠키 믹싱 스냅", description: "원목 테이블 위에 우주 식량 진공 지퍼백과 락토프리 요거트, 그리고 따뜻한 보리차 드로잉 데코 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "과학 캠프 신청 및 장비 후원",
        subtitle: "여름/겨울방학 우주 캠프 참가 지원서, 모형 로켓 3D 도면 요청, 기부금 소득공제 영수증 발행은 아래에 적으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "캠프 참가 신청"
        }
      }
    ]
  }
};
