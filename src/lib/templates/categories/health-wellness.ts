import { TemplateConfig } from "../registry";

export const HEALTH_WELLNESS_TEMPLATES: Record<string, TemplateConfig> = {
  // ==========================================
  // BATCH 1: Yoga, Pilates, Gym, Counseling, Spa
  // ==========================================
  yoga_meditation: {
    templateId: "yoga_meditation",
    name: "프라나 마인드풀 요가 & 명상",
    category: "Health & Wellness",
    description: "차분하고 정갈한 세이지 그린과 대지의 모래 빛깔 샌드 베이지가 어우러져 깊은 내면의 평화와 호흡에 집중하게 돕는 요가 & 명상 스튜디오 테마입니다.",
    image: "/templates/yoga_meditation.png",
    theme: {
      fontFamily: "Noto Serif KR, Playfair Display, serif",
      colors: {
        primary: "#2d6a4f",     // 차분한 딥 세이지 그린
        secondary: "#d8f3dc",   // 맑고 정갈한 연그린
        accent: "#b7094c",      // 명상의 에너지를 나타내는 딥 로즈
        background: "#fcfaf6",  // 부드럽고 따뜻한 샌드 오프화이트
        surface: "#ffffff",     // 깨끗한 린넨 표면 화이트
        text: "#1b4332"         // 깊고 차분한 포레스트 블랙
      },
      borderRadius: "rounded-full", // 유기적인 둥근 버튼
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "몸과 마음이 조화롭게 머무는 순간, 정적인 호흡의 여정",
        subtitle: "일상의 복잡한 소음에서 벗어나 깊은 침묵 속에서 호흡을 가다듬고, 흐트러진 내면의 밸런스를 온전히 되찾는 고요한 마인드풀니스 요가 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "클래스 예약하기",
          ctaLink: "#contact",
          features: [
            { text: "초보자부터 숙련자까지 개별 체형 맞춤형 정렬 아사나 프로그램" },
            { text: "싱잉볼 테라피와 마음챙김 명상을 결합한 스트레스 릴리프 세션" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마인드풀니스 클래스",
        subtitle: "내면의 에너지를 다스리고 척추 정렬과 호흡을 회복하는 핵심 코스입니다.",
        content_data: {
          items: [
            {
              title: "정통 하타 & 빈야사 요가",
              description: "흐르는 호흡과 동작의 연속을 통해 근력을 강화하고 신체 정렬을 정교하게 맞추는 정적 코스입니다.",
              icon: "Sun"
            },
            {
              title: "싱잉볼 소리 명상",
              description: "진동과 주파수를 활용한 오디오 테라피로 지친 뇌파를 안정시키고 깊은 이완과 치유를 경험합니다.",
              icon: "Compass"
            },
            {
              title: "아로마 이완 요가",
              description: "천연 에센셜 오일의 향기와 가벼운 스트레칭을 병행해 신체의 긴장과 독소를 해독합니다.",
              icon: "Wind"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스스로를 마주하는 평온한 쉼터",
        subtitle: "가장 정직한 호흡이 가장 건강한 일상을 빚어낸다고 확신합니다.",
        content_data: {
          description: "안녕하세요. 프라나 명상 요가 디렉터입니다. 바쁜 도심 속에서 하루 단 1시간이라도 온전히 나 자신의 숨소리에 귀를 기울여 본 적이 있으신가요? 우리는 기교적인 동작을 성공시키는 것보다, 내 몸의 한계를 너그럽게 인정하고 그 안에서 진정한 평안을 발견하는 지혜를 나눕니다. 편안하게 몸을 누이고 마음의 소리에 응답해 보세요.",
          stats: [
            { label: "누적 수강생", value: "3,500명+" },
            { label: "강사진 평점", value: "4.9 / 5.0" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "스튜디오 갤러리",
        subtitle: "자연 광원과 원목 마루가 조화를 이룬 편안하고 쾌적한 힐링 아틀리에 전경입니다.",
        content_data: {
          items: [
            { title: "포레스트 명상 스페이스", description: "대형 통창 너머로 숲의 사계를 바라보며 완전한 몰입의 수련을 경험하는 명상 홀", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80" },
            { title: "개인 프라이빗 1:1 수련룸", description: "체형 분석 기기와 아로마 테라피 디퓨저가 완비된 단독 이완실 공간 구성", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" },
            { title: "릴렉싱 티 라운지", description: "수련이 끝난 뒤 따뜻한 오가닉 차를 마시며 사색을 이어가는 감성 휴식 라운지", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "호흡의 시작, 첫 방문 문의",
        subtitle: "체험 수업 등록, 단체 기업 출강 제안, 혹은 1:1 상담 예약은 아래 양식을 작성해 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "수업 문의하기"
        }
      }
    ]
  },

  pilates_reform: {
    templateId: "pilates_reform",
    name: "코어얼라인 프리시전 필라테스",
    category: "Health & Wellness",
    description: "우아하고 깨끗한 분위기를 풍기는 파스텔 피치 핑크와 클레이 베이지 톤을 사용하여 속근육 강화와 유연성 향상을 보여주는 필라테스 테마입니다.",
    image: "/templates/pilates_reform.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#e07a5f",     // 우아한 피치 테라코타
        secondary: "#f4f1de",   // 부드러운 오트밀 아이보리
        accent: "#3d405b",      // 단단한 코어를 나타내는 스틸 네이비
        background: "#fbfaf8",  // 정갈한 라이트 웜그레이
        surface: "#ffffff",     // 맑고 깨끗한 가죽 안장 화이트
        text: "#2d3142"         // 신뢰를 주는 카본 차콜
      },
      borderRadius: "rounded-lg",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "코어부터 바르게 정렬하는 우아하고 건강한 바디 라인",
        subtitle: "겉으로 보이는 큰 근육이 아닌, 신체의 기둥이 되는 척추와 골반 주변의 미세한 속근육을 1mm 오차도 없이 정교하게 컨트롤하는 프라이빗 필라테스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
          ctaText: "체형 진단 신청",
          ctaLink: "#contact",
          features: [
            { text: "3D 모아레 카메라 체형 측정 및 척추 불균형 정밀 정량 리포트 제공" },
            { text: "기구 필라테스(리포머, 캐딜락, 바렐, 체어) 풀 세트 개인 단독 수업" }
          ]
        }
      },
      {
        section_type: "services",
        title: "프리미엄 필라테스 스펙트럼",
        subtitle: "개인의 근골격계 상태와 유연성, 코어 강도에 맞추어 세밀하게 설계된 운동 영역입니다.",
        content_data: {
          items: [
            {
              title: "1:1 재활 및 교정 테라피",
              description: "거북목, 일자척추, 골반 틀어짐 등의 불균형 신체를 해부학적 관점에서 안전하게 재정렬합니다.",
              icon: "Activity"
            },
            {
              title: "4:1 소그룹 슬림핏 서킷",
              description: "합리적인 수강료로 정교한 밀착 피드백과 동기부여를 동시에 잡는 고효율 전신 탄력 리셋 클래스입니다.",
              icon: "Users"
            },
            {
              title: "임산부 산전/산후 스페셜",
              description: "출산 전후 골반 주변 근육의 긴장을 풀고, 안정적인 산통 완화 및 산후 빠른 신체 복귀를 지원합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "당신의 몸을 더 아름답고 바르게 이해하는 공간",
        subtitle: "모든 동작은 반복의 횟수보다 한 번의 정확한 자극이 훨씬 중요합니다.",
        content_data: {
          description: "안녕하십니까. 코어얼라인 필라테스 대표원장입니다. 필라테스는 단순한 다이어트 목적을 넘어, 평생을 내 몸의 통증 없이 조화롭게 생활하도록 이끄는 '평생의 움직임 교육'입니다. 우리는 무리한 하중을 얹지 않으며, 해부학 자격증을 보유한 물리치료사 출신 강사진들이 안전하고 과학적인 가이드를 제공합니다. 지금 바른 정렬을 시작해 보세요.",
          stats: [
            { label: "소속 물리치료 강사", value: "8명" },
            { label: "재등록 비율", value: "92.4%" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "수업 현장 & 기구 룸",
        subtitle: "매 세션마다 철저하게 알코올 소독 관리되는 하이엔드 수입 필라테스 대기구 전경입니다.",
        content_data: {
          items: [
            { title: "캐딜락 & 리포머 존", description: "최고급 메이플 우드로 제작되어 신체 밀착도와 지지력을 높여주는 명품 대기구 기어", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80" },
            { title: "바렐 & 체어 스트레칭 라운지", description: "유연성을 극대화하고 옆구리 및 이상근을 늘려 림프 순환을 자극하는 보조 소기구 존", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 모션 체형 분석 기기실", description: "근육의 비대칭성과 굽은 등 각도를 숫자로 즉시 환산해 보여주는 모니터링 센서 룸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "체형 무료 자문 & 상담 신청",
        subtitle: "척추 통증의 부위와 대략적인 희망 요일 및 시간대를 작성해주시면 정밀 상담 일정을 조율해 드립니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "상담 스케줄링 신청"
        }
      }
    ]
  },

  fitness_gym_premium: {
    templateId: "fitness_gym_premium",
    name: "피나클 프리미엄 에슬레틱 짐",
    category: "Health & Wellness",
    description: "파워풀한 다크 차콜 블랙과 강렬하고 트렌디한 네온 오렌지가 격렬하고 건강한 에너지를 발산하는 하이엔드 피트니스 & 헬스클럽 테마입니다.",
    image: "/templates/fitness_gym_premium.png",
    theme: {
      fontFamily: "Montserrat, Space Grotesk, sans-serif",
      colors: {
        primary: "#ff4d00",     // 액티브 네온 오렌지
        secondary: "#1f2937",   // 다크 카본 스틸
        accent: "#ef4444",      // 아드레날린 레드
        background: "#0b0f19",  // 묵직한 하이퍼 블랙
        surface: "#161d2f",     // 사이버 텍스처 메탈 차콜
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "한계를 뛰어넘어 나만의 강인한 신체를 구축하라",
        subtitle: "타협하지 않는 최고 수준의 웨이트 머신 기구 라인업과 현역 보디빌더 출신 트레이너진의 밀착 트레이닝으로, 당신이 꿈꿔왔던 최고의 피지컬을 완성해 드립니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
          ctaText: "PT 무료 체험권 신청",
          ctaLink: "#contact",
          features: [
            { text: "해머 스트렝스, 라이프 피트니스 등 글로벌 프리미엄 최고가 외산 머신 완비" },
            { text: "식단 모니터링 앱 연동 1:1 맞춤 영양 섭취 피드백 프로그램" }
          ]
        }
      },
      {
        section_type: "services",
        title: "익스트림 퍼포먼스 프로그램",
        subtitle: "체지방 감량부터 벌크업, 보디프로필 촬영까지 완벽 도달을 보장하는 집중 트레이닝 라인입니다.",
        content_data: {
          items: [
            {
              title: "1:1 집중 퍼스널 트레이닝",
              description: "완벽한 스쿼트, 데드리프트 자세 정밀 교정 및 수행 능력 단계별 훈련 루틴 세팅을 돕습니다.",
              icon: "Zap"
            },
            {
              title: "익스트림 바디 리셋 다이어트",
              description: "지루하지 않은 서킷 고강도 인터벌 트레이닝(HIIT) 공식을 대입해 단기간 체지방을 급속 연소합니다.",
              icon: "Flame"
            },
            {
              title: "선수 트레이닝 & 보디 프로필 코칭",
              description: "대회 출전, 근비대 벌크업, 수분 조절 및 촬영 디데이 펌핑 컨설팅을 완벽 보좌합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "평범함을 거부하는 진짜 운동 마니아들의 메카",
        subtitle: "고통은 순간이고, 완성된 근육과 피지컬의 프라이드는 평생 영원히 유지됩니다.",
        content_data: {
          description: "반갑습니다. 피나클 에슬레틱 짐 마스터 헤드 트레이너입니다. 헬스장에 등록만 하고 며칠 만에 포기하는 고질적인 굴레를 이제는 끊으셔야 합니다. 우리는 회원이 혼자서도 평생 주도적으로 웨이트를 할 수 있게 독립시키는 것을 궁극의 목표로 삼습니다. 지저분하고 답답한 지하 공간이 아닌, 호텔식 쾌적 지상 통창 뷰에서 당신의 신체 혁명을 직접 시작하십시오.",
          stats: [
            { label: "수입 최고가 웨이트 머신", value: "65종" },
            { label: "바디 프로필 촬영 누적", value: "480건+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "최강의 머신 존 & 락커 룸",
        subtitle: "최고의 펌핑감과 관절 무리 없는 스무스한 저항 궤적을 보장하는 하이테크 피트니스 인프라입니다.",
        content_data: {
          items: [
            { title: "헤비 덤벨 프리웨이트 존", description: "덤벨 60kg 라인업 및 파워렉 6대 보유로 눈치 볼 필요 없는 쾌적한 중량 리프팅 가능 스페이스", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80" },
            { title: "호텔식 단독 샤워 룸 & 파우더 룸", description: "운동 후 개별 샤워 부스 부착 및 바디 드라이어가 빌트인된 럭셔리한 리커버리 위생 시설", image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80" },
            { title: "유산소 천국: 천국의 계단 & 마이마운틴", description: "경사도 조절 트레드밀과 스텝밀 12대를 완벽 배치해 대기 시간 없는 강력 칼로리 연소 벨트", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "피지컬 각성, 멤버십 신청",
        subtitle: "인바디 1회 무료 분석 예약권 및 PT 단가 할인 패키지 혜택을 원하시면 하단 문을 두드려 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "가입 및 PT 상담 예약"
        }
      }
    ]
  },

  mental_health_clinic: {
    templateId: "mental_health_clinic",
    name: "마음숲 심리상담 & 치유 클리닉",
    category: "Health & Wellness",
    description: "고요하고 아늑한 딥 틸 블루와 라벤더 퍼플이 결합하여 지친 마음과 우울감을 포근하게 안아주는 전문 심리 치료 & 치유 센터 전용 테마입니다.",
    image: "/templates/mental_health_clinic.png",
    theme: {
      fontFamily: "Noto Serif KR, Lora, serif",
      colors: {
        primary: "#14453d",     // 마음을 차분히 가라앉히는 깊은 포레스트 딥 그린
        secondary: "#e8f1f2",   // 정돈된 은빛 스틸 블루
        accent: "#8338ec",      // 내면의 잠재력을 깨우는 소프트 보라
        background: "#f7f9f6",  // 무자극 오가닉 아이보리
        surface: "#ffffff",     // 안락한 패브릭 소파 베이지 화이트
        text: "#2b3d39"         // 시각적 스트레스가 없는 다크 머드 그린
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "아무에게도 말하지 못했던 마음의 상처, 따스하게 안아드립니다",
        subtitle: "깊은 마음의 감기처럼 찾아오는 불안, 우울, 무기력을 외면하지 마세요. 전문 임상심리 전문가가 철저한 비밀 유지 원칙 아래 당신의 마음의 소리를 경청합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "첫 심리상담 예약",
          ctaLink: "#contact",
          features: [
            { text: "국가공인 보건복지부 1급 임상심리사 및 전문 상담사 자격 보유 강사진" },
            { text: "성격, 불안장애, 부부 갈등, 청소년 학업 스트레스 전문 솔루션 맵" }
          ]
        }
      },
      {
        section_type: "services",
        title: "마음 치유 커리큘럼",
        subtitle: "내면의 고통을 덜어내고 자아의 건강한 힘을 다시 재건하는 단계별 심리 서비스입니다.",
        content_data: {
          items: [
            {
              title: "개인 심리상담 & 힐링 대화",
              description: "판단 없이 나를 있는 그대로 수용해 주는 안전한 방에서 50분간 속마음을 털어놓고 스트레스를 완화합니다.",
              icon: "Smile"
            },
            {
              title: "종합 심리 검사 (Full Battery)",
              description: "지능, 정서, 투사 검사를 입체적으로 진행하여 나 자신의 성격적 기질과 마음의 병인을 심층 분석합니다.",
              icon: "Clipboard"
            },
            {
              title: "부부/가족 관계 리커버리",
              description: "오랫동안 쌓여 비틀어진 대화 패턴을 수정하고, 서로를 깊이 오해 없이 이해하는 정서적 안전핀을 제공합니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "당신의 아픔을 가치 있게 경청하는 치유 동반자",
        subtitle: "상담실 문을 열고 들어오는 대단한 용기만으로도 이미 치유는 반 이상 시작되었습니다.",
        content_data: {
          description: "안녕하세요. 마음숲 상담 센터 대표원장입니다. 뼈가 부러지면 즉시 정형외과를 가듯, 우리 마음의 인대와 정서적 근육에 염증이 생겼을 때도 전문적인 처방과 보살핌이 당연히 필요합니다. 우리는 내원하시는 모든 분들의 철저한 익명성과 기록 누출 방지를 약속드립니다. 잠시 가 무거운 짐을 이 아늑한 테이블 위에 내려놓고 편히 쉬어가시길 바랍니다.",
          stats: [
            { label: "누적 상담 세션", value: "14,200시간+" },
            { label: "소속 공인상담원", value: "12명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "안락한 테라피 룸 시설",
        subtitle: "조도의 미세 조정과 편안한 패브릭 소파를 배치하여 심리적 안정감을 극대화한 치료 공간입니다.",
        content_data: {
          items: [
            { title: "프라이빗 1인 상담실", description: "외부 방음 도어 및 따스한 간접 무드등이 연출되어 온전히 자아에 몰입할 수 있는 밀폐 힐링 룸", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" },
            { title: "미술 & 모래놀이 치료실", description: "언어로 표현하기 힘든 유아동 및 청소년들의 억압된 상처를 비언어적 매체로 자유롭게 표현하는 예술 치료 센터", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
            { title: "집단 상담 및 세미나 홀", description: "마음챙김 명상 워크숍과 심리 독서 모임을 주기적으로 주최하는 유연한 멀티 커뮤니티 홀", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "마음숲의 문을 두드리며",
        subtitle: "첫 방문 예약금 안내 및 원하시는 고민 분야(우울, 대인관계, 자녀상담 등)를 편안하게 기재해 주십시오.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "비공개 상담 신청하기"
        }
      }
    ]
  },

  spa_aesthetics: {
    templateId: "spa_aesthetics",
    name: "더 리트릿 럭셔리 스파 & 에스테틱",
    category: "Health & Wellness",
    description: "은은하고 고급스러운 샴페인 골드와 패브릭 타우페 베이지가 극상의 럭셔리 휴식을 제공하는 스파 & 안티에이징 뷰티 에스테틱 테마입니다.",
    image: "/templates/spa_aesthetics.png",
    theme: {
      fontFamily: "Cormorant Garamond, Inter, sans-serif",
      colors: {
        primary: "#c5a880",     // 하이엔드 샴페인 브론즈 골드
        secondary: "#f4ede2",   // 럭셔리 실크 아이보리
        accent: "#d4a373",      // 웜 브라운 앰버
        background: "#faf6f0",  // 로열 펄 골드 백그라운드
        surface: "#ffffff",     // 호텔 대리석 화이트
        text: "#332c25"         // 딥 우드 초콜릿 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지친 오감에 깊은 안식과 최상의 광채 피부를 바치다",
        subtitle: "엄선된 하이엔드 유럽 정통 아로마 오일과 고도로 숙련된 테라피스트의 프라이빗 독점 에스테틱 터치로, 당신의 지친 영혼과 무너진 바디 실루엣을 부드럽게 재건합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "스파 시그니처 바우처 예약",
          ctaLink: "#contact",
          features: [
            { text: "전 객실 개인 샤워실 및 전용 월풀 스파가 완비된 1인 1실 호텔식 독립 룸" },
            { text: "프랑스 프리미엄 마린 해양 성분 에스테틱 코스메틱 라인 정품 케어" }
          ]
        }
      },
      {
        section_type: "services",
        title: "럭셔리 스파 컬렉션",
        subtitle: "머리끝부터 발끝까지 완벽한 에너지 순환과 피부 세포재생을 돕는 정교한 럭셔리 세션입니다.",
        content_data: {
          items: [
            {
              title: "안티에이징 리프팅 페이셜",
              description: "고주파 장비와 딥 테라피 수기 리프팅을 융합하여 피부 처짐을 개선하고 수분을 급속 충전합니다.",
              icon: "Sparkles"
            },
            {
              title: "시그니처 아로마 스톤 리추얼",
              description: "따뜻하게 데운 현무암 스톤과 천연 라벤더 아로마를 활용하여 전신의 깊은 피로와 독소를 배출합니다.",
              icon: "Compass"
            },
            {
              title: "임산부 오가닉 D-라인 케어",
              description: "임신 중 발생하는 부종과 튼살을 방지하고 골반 통증을 순하게 예방하는 무자극 맞춤 테라피입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "도심 속에서 즐기는 완벽히 보호받는 프라이빗 웰니스 리조트",
        subtitle: "진정한 웰빙은 자극적인 소음을 멈추고 고요한 향기를 호흡하는 대접에서 찾아옵니다.",
        content_data: {
          description: "안녕하십니까. 더 리트릿 시그니처 스파 대표 디렉터입니다. 우리 스파는 하루에 오직 소수의 엄선된 VIP 고객님만을 예약제로 맞이하여, 타인과의 접촉을 원천 차단한 완벽한 1인 쉼터를 보장합니다. 일상의 모든 의무를 잠시 멈추고, 잔잔히 흐르는 앰비언트 음악과 아로마 천연 향취 속에서 극진한 여왕의 휴식을 맛보시길 권해 드립니다.",
          stats: [
            { label: "보유 호텔식 단독 룸", value: "6개 세트" },
            { label: "전문 테라피스트 경력", value: "평균 12년" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "호텔식 월풀 & 릴렉싱 룸",
        subtitle: "눈을 지그시 감고 온전한 안식을 누릴 수 있는 품격 높은 친자연 인테리어와 시설입니다.",
        content_data: {
          items: [
            { title: "개인 제트 폼 히노끼 스파", description: "천연 편백나무와 월풀 스파가 융합되어 온천욕의 힐링과 혈액순환을 최고로 유도하는 수중 힐링 테라피 존", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "1인 시그니처 트리트먼트 베드룸", description: "이탈리아 전동 인체공학 무중력 베드와 순면 린넨 침구를 사용하여 극상의 수면과 편안함을 선사하는 케어 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "웰컴 티 & 리프레시 라운지", description: "스파 테라피 개시 전 전문 문진표 작성 및 케어 완료 후 허브티와 생과일 카나페를 서빙하는 고급 휴게 라운지", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "극진한 치유의 예약 의뢰",
        subtitle: "바우처 소지 여부, 희망 코스, 동반 인원 여부를 작성해 주시면 럭셔리 코디네이터가 15분 이내에 예약 확인 해피콜을 드립니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "럭셔리 스파 예약 신청"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 2: Juice Bar, Chiropractic, Nutritionist, Sleep Tech, Dental
  // ==========================================
  organic_juice_bar: {
    templateId: "organic_juice_bar",
    name: "그린하베스트 오가닉 주스 & 샐러드",
    category: "Health & Wellness",
    description: "싱그러운 비타민이 느껴지는 라임 그린과 산뜻한 오렌지 옐로우 컬러로 일상에 디톡스 활력을 선사하는 주스 & 비건 샐러드 카페 테마입니다.",
    image: "/templates/organic_juice_bar.png",
    theme: {
      fontFamily: "Poppins, Outfit, sans-serif",
      colors: {
        primary: "#4caf50",     // 싱그러운 엽록소 라임 그린
        secondary: "#ffb703",   // 상큼한 시트러스 오렌지 옐로우
        accent: "#283618",      // 깊이 있는 유기농 포레스트 머드 그린
        background: "#f7fcf8",  // 맑고 깨끗한 내추럴 오프화이트
        surface: "#ffffff",     // 산뜻한 우드 테이블 화이트
        text: "#1c2317"         // 눈이 편안한 유기농 카본 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "매일 아침 신선한 유기농 채소를 물 한 방울 없이 착즙하다",
        subtitle: "100% 로컬 푸드 농가에서 직송된 무농약 콜드프레스 주스와 싱싱한 로메인이 가득한 수제 오가닉 보울로, 몸속 깊은 곳부터 투명하게 정화되는 가벼운 일상을 경험해 보세요.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1610970881699-44a55b4cfd87?auto=format&fit=crop&w=1200&q=80",
          ctaText: "디톡스 정기배송 신청",
          ctaLink: "#contact",
          features: [
            { text: "영양소 파괴를 완벽하게 차단하는 7기압 저속 콜드프레스 착즙 특허 공법" },
            { text: "설탕, 감미료, 합성 보존료, 정제수 0%의 순수한 과채 영양 농축액" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오가닉 클렌즈 메뉴판",
        subtitle: "매일 누적되는 만성 피로와 활기 저하를 해결하는 자연에서 온 시그니처 부스터 레시피입니다.",
        content_data: {
          items: [
            {
              title: "ABC 딥 디톡스 콜드프레스",
              description: "유기농 사과(Apple), 비트(Beet), 당근(Carrot)의 황금 비율 착즙액으로 혈액순환과 피부 미용을 극대화합니다.",
              icon: "Droplet"
            },
            {
              title: "아보카도 비건 단백질 보울",
              description: "잘 익은 부드러운 아보카도와 무농약 퀴노아, 병아리콩, 신선한 수제 오렌지 드레싱을 결합한 고단백 한 끼 식사입니다.",
              icon: "Award"
            },
            {
              title: "그린에너지 밀싹 주스",
              description: "어린 밀싹과 케일을 주원료로 하여 간의 독소를 배출하고 세포 활력을 강력하게 이끌어내는 고농축 주스입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "자연의 영양을 훼손 없이 컵 속에 정직하게 담아내는 사람들",
        subtitle: "과일과 채소가 가진 본래의 생명력이 바로 가장 훌륭한 해독 명약입니다.",
        content_data: {
          description: "안녕하세요. 그린하베스트 주스바의 오너 세프 겸 건강 관리사입니다. 우리는 매일 아침 가락시장에서 공수한 유기농 잎채소를 3단계 초음파 세척기로 미세먼지 한 톨 없이 소독한 뒤, 마찰열을 발생시키지 않는 최고급 착즙기를 사용해 주스를 추출합니다. 하루에 한 번 자연의 초록색을 마시는 작은 습관으로, 만성 변비와 칙칙했던 안색을 단숨에 몰아내세요.",
          stats: [
            { label: "당일 직송 파트너 농가", value: "14개소" },
            { label: "구독 회원 재등록률", value: "87.6%" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "신선한 파밍 테이블 & 메뉴 갤러리",
        subtitle: "보기만 해도 눈이 밝아지고 침샘을 자극하는 알록달록한 오가닉 플레이팅 포트폴리오입니다.",
        content_data: {
          items: [
            { title: "비비드 5색 클렌즈 패키지", description: "요일별로 다른 색상의 영양을 섭취해 내장 지방을 태워내는 5일 단기 디톡스 프로그램 세트", image: "https://images.unsplash.com/photo-1610970881699-44a55b4cfd87?auto=format&fit=crop&w=600&q=80" },
            { title: "내추럴 그린 인테리어 바", description: "실제 공기정화 식물이 벽면을 채우고 있어 싱그러운 산소와 향취를 풍기는 힐링 식사 스페이스", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
            { title: "바질 시드 & 견과류 요거트 보울", description: "수제 무설탕 코코넛 요거트에 바질 시드와 베리류를 풍성하게 토핑한 저칼로리 포만감 디저트", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오가닉 구독 및 새벽 단체 배달 문의",
        subtitle: "정기 클렌즈 주스 새벽 배송 의뢰, 오피스 임직원 웰빙 단체 조식 주문 견적 단가 문의는 아래로 연락주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "정기 구독 상담하기"
        }
      }
    ]
  },

  chiropractic_clinic: {
    templateId: "chiropractic_clinic",
    name: "SpineAlign 카이로프랙틱 & 체형교정",
    category: "Health & Wellness",
    description: "신뢰감 넘치는 딥 메디컬 블루와 깨끗한 메탈 그레이 배합으로 비수술적 척추 치료 및 1:1 도수 정렬의 신뢰감을 높인 도수 치료원 테마입니다.",
    image: "/templates/chiropractic_clinic.png",
    theme: {
      fontFamily: "Inter, Roboto, sans-serif",
      colors: {
        primary: "#1e3a8a",     // 신뢰도 높은 딥 코발트 블루
        secondary: "#93c5fd",   // 청결한 클라우드 블루
        accent: "#0ea5e9",      // 테크니컬 시안 블루
        background: "#f8fafc",  // 위생적인 퓨어 라이트 슬레이트
        surface: "#ffffff",     // 새하얀 진료 베드 화이트
        text: "#0f172a"         // 전문적이고 시인성 높은 네이비 블랙
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "약물과 수술 없이, 틀어진 뼈를 찾아 스스로 치유되게 정렬합니다",
        subtitle: "만성 목디스크, 허리 통증, 골반 비대칭으로 일상생활이 고통스러우셨나요? 손끝의 정교한 미세 압력을 통해 근골격계와 신경계의 압박을 즉각 해소하는 과학적인 정밀 카이로프랙틱 의원입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "첫 정밀 진료 예약",
          ctaLink: "#contact",
          features: [
            { text: "미국 카이로프랙틱 전문의(D.C.) 학위 자격증을 보유한 원장단 직접 시술" },
            { text: "최고급 무소음 정위 드롭 베드 도입으로 관절 충격 최소화 안전 치료" }
          ]
        }
      },
      {
        section_type: "services",
        title: "근골격 메디컬 아키텍처",
        subtitle: "단순 통증 완화가 아닌, 뼈와 근육의 구조적 기원을 원천 교정하는 핵심 진료 분야입니다.",
        content_data: {
          items: [
            {
              title: "척추 관절 카이로프랙틱",
              description: "경추, 흉추, 요추를 부드럽게 고속 압박하여 신경 압박을 제거하고 뇌와 신체의 소통을 되살립니다.",
              icon: "Activity"
            },
            {
              title: "거북목 & 굽은 등 골반 정렬",
              description: "현대인들의 스마트폰 사용으로 누적된 일자목과 척추 측만증을 정량적 엑스레이 계측 기반으로 복원합니다.",
              icon: "Layers"
            },
            {
              title: "스포츠 재활 및 통증 매니지먼트",
              description: "야구, 골프, 헬스 등으로 인한 회전근개 손상, 무릎 통증의 가동 범위를 빠르게 리셋합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "인체의 척추 중심을 바로잡아 본연의 치유 메커니즘을 깨웁니다",
        subtitle: "신경이 눌린 척추는 통증을 넘어, 내부 내장 기관의 면역력 저하까지 야기합니다.",
        content_data: {
          description: "안녕하십니까. 스파인얼라인 카이로프랙틱 대표원장입니다. 우리 센터는 단순히 뼈에서 소리만 내는 자극적인 마사지가 아닌, 환자의 정형외과적 엑스레이 사진을 철저하게 해부학적으로 분석하여 각 척추 마디의 변위 각도를 파악한 후 치밀하게 조작하는 전문 의료 센터입니다. 진통제 주사로 통증을 억누르지 마시고, 통증의 진짜 기원인 틀어진 정렬을 찾아 영구 치료하십시오.",
          stats: [
            { label: "원장 시술 임상 케이스", value: "35,000건+" },
            { label: "정량 엑스레이 분석 장비", value: "4세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "첨단 진단 장비 및 치료 베드",
        subtitle: "안전하고 오차 없는 시술을 위해 전면 구비된 하이엔드 카이로프랙틱 테크니컬 공간입니다.",
        content_data: {
          items: [
            { title: "미국 하이로(Hill) 드롭 진료 베드", description: "환자의 체중에 맞춰 섹션별로 가볍게 낙하하며 뼈를 무리 없이 맞추는 무소음 특수 치료대", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 전신 척추 스캐너 장비실", description: "서 있을 때의 골반 기울기와 다리 길이 비대칭을 디지털 3D 그래픽으로 즉각 계측하는 스캔 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "도수 소도구 재활 트레이닝 룸", description: "교정 치료 후 상태 유지를 위해 짐볼과 세라밴드를 활용한 자가 척추 기립근 코어 단련실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "척추 정밀 검진 & 초진 상담 예약",
        subtitle: "겪고 계신 주요 통증 부위(목, 어깨, 허리, 골반 등) 및 기존 정형외과 촬영 이력 유무를 체크하여 발송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "정밀 체형 교정 신청하기"
        }
      }
    ]
  },

  nutrition_consulting: {
    templateId: "nutrition_consulting",
    name: "헬시플레이트 1:1 맞춤 영양 컨설팅",
    category: "Health & Wellness",
    description: "내추럴하고 따뜻한 올리브 그린과 싱그러운 래디시 오렌지 조화로 건강한 미생물 생태계와 1:1 맞춤형 식단 솔루션을 보여주는 영양사 테마입니다.",
    image: "/templates/nutrition_consulting.png",
    theme: {
      fontFamily: "Quicksand, Inter, sans-serif",
      colors: {
        primary: "#556b2f",     // 오가닉 올리브 그린
        secondary: "#e9c46a",   // 비타민 가득한 레몬 옐로우
        accent: "#f4a261",      // 건강한 캐럿 오렌지
        background: "#fdfbf7",  // 따뜻하고 포근한 오트밀 크림
        surface: "#ffffff",     // 깔끔한 식탁 세라믹 화이트
        text: "#264653"         // 지적인 다크 오션 차콜
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "무작정 굶는 다이어트는 끝내고, 내 몸에 완벽한 분자 영양을 디자인하다",
        subtitle: "임상 영양사가 유전자 데이터, 인바디 결과, 혈당 센서 추이를 심층 결합 분석하여 오직 당신만을 위한 맞춤형 호르몬 조절 라이프스타일 식단을 조율해 드립니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
          ctaText: "식단 DNA 분석 예약",
          ctaLink: "#contact",
          features: [
            { text: "국가 면허 임상 영양사 및 생화학 석사 연구원 출신들의 꼼꼼한 메디컬 푸드 코칭" },
            { text: "연속 혈당 측정기(CGM) 데이터 기반 인슐린 저항성 완화 전문 특화반 운영" }
          ]
        }
      },
      {
        section_type: "services",
        title: "과학적 영양 디자인 프로세스",
        subtitle: "단순 칼로리 계산을 넘어 신진대사의 근원을 정상화하는 영양 맞춤 솔루션입니다.",
        content_data: {
          items: [
            {
              title: "1:1 만성 질환 관리 영양 식단",
              description: "당뇨, 고혈압, 갑상선 질환 등 내과 질환자를 위해 나트륨과 탄수화물 섭취량을 체계적으로 조절하는 프리미엄 식단 가이드입니다.",
              icon: "Activity"
            },
            {
              title: "생애 주기 맞춤 비건/임산부 코칭",
              description: "성장기 어린이 영양 불균형 진단부터 완경 대사증후군 예방까지 칼슘, 철분, 아연의 결핍 없는 비건 밀링 가이드를 세팅합니다.",
              icon: "Heart"
            },
            {
              title: "혈당 다이어트 & 장 건강 케어",
              description: "장내 미생물 총 분석을 바탕으로 프로바이오틱스 및 프리바이오틱스 복용 꿀팁과 혈당 스파이크 방지 조리법을 공유합니다.",
              icon: "Book"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "우리가 매일 먹는 3번의 음식이 바로 우리의 내일의 유전자를 결정합니다",
        subtitle: "모든 약은 음식의 훌륭한 대안이 될 수 없지만, 음식은 약보다 위대한 치유의 원천이 됩니다.",
        content_data: {
          description: "안녕하십니까. 헬시플레이트의 수석 임상 영양사입니다. 다이어트를 할 때 샐러드만 먹으며 극단적으로 탄수화물을 단절하다가 결국 요요와 대사 저하를 겪으시는 분들이 대다수입니다. 우리는 고객의 혈액 검사 수치와 생활 패턴을 근거로 영양 결핍 요소를 역추적합니다. 탄수화물, 단백질, 지방을 맛있고 배부르게 먹으면서도 에너지를 최대로 활성화하는 진정한 영양 미학을 만나세요.",
          stats: [
            { label: "성공 식단 코칭 데이터", value: "8,800회" },
            { label: "소속 공인 영양 코치", value: "7명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "건강 식단 아카이브 & 가이드 북",
        subtitle: "누구나 집에서 쉽고 맛있게 요리할 수 있도록 연구 및 설계된 영양 밀 키트 플레이트 리스트입니다.",
        content_data: {
          items: [
            { title: "저탄고지 케토 지중해식 샐러드", description: "불포화 지방산이 풍부한 올리브유와 아보카도, 구운 연어를 올려 포만감을 유지하는 호르몬 리셋 플레이팅", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80" },
            { title: "혈당 안심 호밀 현미 브런치", description: "현미 통밀빵 위에 무설탕 리코타 치즈와 새싹 채소를 얹어 인슐린 자극 없이 편안하게 소화되는 아침 정식", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
            { title: "식물성 대체육 비건 런치 스페셜", description: "대두 단백 숯불구이와 구운 가지, 파프리카 허브 마리네이드를 곁들여 단백질과 칼륨을 극대화한 식사 에디션", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "임상 영양사와 첫 미팅 예약",
        subtitle: "최근에 받으신 종합 건강 검진 혈액 검사 결과지 유무 및 현재 가장 개선하고 싶은 건강 고민을 작성해 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "맞춤 영양 코칭 의뢰하기"
        }
      }
    ]
  },

  sleep_tech_wellness: {
    templateId: "sleep_tech_wellness",
    name: "슬립핏 바이오 수면테크 & 웰니스 랩",
    category: "Health & Wellness",
    description: "신비롭고 차분한 코스믹 딥 인디고와 은은한 스타 바이올렛 네온 빛을 사용해 수면 무호흡증 예방 및 프리미엄 숙면 솔루션을 제공하는 미래형 수면 클리닉 테마입니다.",
    image: "/templates/sleep_tech_wellness.png",
    theme: {
      fontFamily: "Plus Jakarta Sans, Inter, sans-serif",
      colors: {
        primary: "#1e1b4b",     // 우주적 깊은 미드나잇 블루
        secondary: "#4338ca",   // 신비로운 네온 인디고
        accent: "#a855f7",      // 릴렉싱 라벤더 네온 보라
        background: "#03001e",  // 밤하늘 블랙 인디고
        surface: "#0f172a",     // 차분하고 무소음 다크 그레이
        text: "#f8fafc"         // 몽환적으로 편안한 슬립 화이트
      },
      borderRadius: "rounded-lg",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "지독한 불면증을 넘어, 신체 활력을 깨우는 8시간의 무소음 딥 슬립",
        subtitle: "웨어러블 바이오 센서 분석과 뇌파 이완 앰비언트 기술을 결합하여, 자꾸 깨고 뒤척이던 불안한 수면 사이클을 즉각 정상의 깊은 델타파 수면으로 인도하는 고밀도 수면 테크 연구소입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "수면 뇌파 정밀 진단 신청",
          ctaLink: "#contact",
          features: [
            { text: "실시간 심박변이도(HRV) 분석 기반 자율신경계 과긴장 이완 특허 솔루션" },
            { text: "빛, 조도, 소음, 습도를 인공지능으로 완전 제어하는 미래형 숙면 캡슐" }
          ]
        }
      },
      {
        section_type: "services",
        title: "딥 슬립 사이언스 서비스",
        subtitle: "뇌와 근육이 완전히 쉴 수 있도록 수면 호르몬의 분비를 최대로 돕는 바이오 테크 솔루션입니다.",
        content_data: {
          items: [
            {
              title: "AI 다원 수면 패턴 모니터링",
              description: "잠자는 동안의 수면 무호흡 지수(AHI)와 호흡 곤란 수치를 정교하게 포착하여 코골이와 불면 증상을 개선합니다.",
              icon: "Activity"
            },
            {
              title: "맞춤형 ASMR 및 뇌파 동기화",
              description: "안락한 핑크 노이즈와 마이크로 바이노럴 비트를 사용하여 흥분된 교감신경을 가라앉히고 10분 이내 급속 입면을 돕습니다.",
              icon: "Music"
            },
            {
              title: "수면 위생 및 에어 디렉팅 교정",
              description: "최적의 멜라토닌 분비를 유도하는 암막 실내 조도 매핑과 천연 피톤치드 산소 에어 가습 공조 시스템을 가동합니다.",
              icon: "Wind"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "하루의 시작을 결정하는 인생의 가장 중요한 절반의 시간, '수면'",
        subtitle: "제대로 자지 못한 뇌는 독소를 배출하지 못해 만성 브레인 포그를 초래합니다.",
        content_data: {
          description: "반갑습니다. 슬립핏 수면 웰니스 랩의 대표 공학 박사입니다. 우리는 현대인들이 고질적으로 겪는 수면 유도제 약물 의존을 끊고, 신체가 스스로 숙면에 돌입할 수 있도록 인공지능 조명, 맞춤 배개 베딩 높이, 호흡 밸런스를 종합적으로 재구축하는 유일무이한 바이오 해킹 팀입니다. 침실의 완벽한 온도와 공기 질을 리셋하여 상쾌하고 깃털처럼 가벼운 아침을 선물해 드리겠습니다.",
          stats: [
            { label: "숙면 성공 개선율", value: "94.8%" },
            { label: "자체 보유 숙면 특허 기술", value: "11개 부문" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "미래형 숙면 진단실 & 용품",
        subtitle: "자체 연구 개발하여 중력 분산을 유도하는 최고급 오가닉 슬립 인프라 자재입니다.",
        content_data: {
          items: [
            { title: "인공지능 모션 슬립 베드룸", description: "코를 골면 베드의 각도를 자동으로 들어 올려 기도를 즉각 열어주는 하이테크 스마트 매트리스 룸", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "자율신경계 이완 스파 캡슐", description: "아늑한 고밀도 돔 캡슐 속에서 미세 체온 조절을 통해 신경 피로를 씻어내는 리조나토 이완 캡슐", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "무자극 텐셀 숙면 의류 & 배개 셋업", description: "정전기를 전면 방지하고 목뼈 C자 커브의 C-라인 압력을 완전 분산하는 특수 폼 및 의류 컬렉션", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "숙면 진단 1박 체험 의뢰",
        subtitle: "평균 수면 시간 및 현재 불면을 겪고 계신 기간을 대략 기재하여 무료 수면 습관 분석 진단권을 신청해 보세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "숙면 랩 예약 신청"
        }
      }
    ]
  },

  dental_clinic_premium: {
    templateId: "dental_clinic_premium",
    name: "에버스마일 프리미엄 치과의원",
    category: "Health & Wellness",
    description: "신뢰도 높은 터쿼이즈 민트 블루와 깨끗한 화이트가 돋보이며, 무통 마취 치료 시스템과 미학적 치아 라미네이트를 정교하게 어필하는 치과 전용 테마입니다.",
    image: "/templates/dental_clinic_premium.png",
    theme: {
      fontFamily: "DM Sans, Inter, sans-serif",
      colors: {
        primary: "#0d9488",     // 청결한 터쿼이즈 민트 그린
        secondary: "#ccfbf1",   // 산뜻한 라이트 민트
        accent: "#0369a1",      // 전문적인 오션 스카이 블루
        background: "#f0fdfa",  // 위생감을 극대화한 아쿠아 오프화이트
        surface: "#ffffff",     // 반짝이는 스마일 퓨어 화이트
        text: "#115e59"         // 시인성 높은 포레스트 민트 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "치과 통증 공포 없이, 가장 자연스럽고 눈부신 미소를 디자인합니다",
        subtitle: "컴퓨터 제어 미세 바늘 무통 마취기 시스템과 3차원 CT 정밀 모의 수술 진단 인프라를 바탕으로, 임플란트부터 심미 치료까지 과잉 진료 전혀 없이 정직하고 편안하게 진료합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "실시간 진료 예약",
          ctaLink: "#contact",
          features: [
            { text: "대한치과의사협회 공인 보존과/보철과 분야별 베테랑 전문의 분과 협진" },
            { text: "하루 만에 완성되는 오차 없는 초정밀 3D 프린팅 임시 치아 원데이 보철" }
          ]
        }
      },
      {
        section_type: "services",
        title: "전문 치과 치료 스펙트럼",
        subtitle: "최신의 정밀 장비 도입으로 치아의 보존과 임플란트 수명을 극대화하는 안전 영역입니다.",
        content_data: {
          items: [
            {
              title: "최소절개 네비게이션 임플란트",
              description: "모의 디지털 수술을 통해 잇몸 절개를 최소화하여 고령의 당뇨, 고혈압 환자분도 안전하고 붓기 없이 식립합니다.",
              icon: "Activity"
            },
            {
              title: "미학적 라미네이트 & 미백 케어",
              description: "원래 내 치아처럼 투명감이 뛰어난 세라믹 자재를 활용하여 앞니의 균열과 변색을 아름답게 조율합니다.",
              icon: "Sparkles"
            },
            {
              title: "자연 치아 평생 보존 신경치료",
              description: "미세 현미경 장비로 미세 근관을 관찰하여 발치 없이 원래 내 자연 치아를 한 번 더 살려 수명을 연장합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "과잉 진료 없는 양심, 아프지 않은 꼼꼼함으로 평생 구강 건강을 책임집니다",
        subtitle: "모든 보철물은 정품 인증서를 투명하게 동반 발행하여 사후 보증 관리를 성실히 수행합니다.",
        content_data: {
          description: "안녕하십니까. 에버스마일 프리미엄 치과 대표원장입니다. 치과 의자에 눕기만 해도 윙 하는 날카로운 기계 소리와 마취 주사 바늘의 극심한 통증으로 내원을 기피하셨던 분들을 위해, 저희는 체온과 동일한 온도의 무통 마취액 자동 주입 시스템을 항시 가동합니다. 자연 치아를 함부로 뽑지 않고, 꼭 필요한 양만큼만 미세하게 절삭하는 100% 양심 의료 철학을 보여드리겠습니다.",
          stats: [
            { label: "연간 임플란트 식립 건수", value: "2,400개+" },
            { label: "사후 보증 기간 보장", value: "최대 10년" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "진료실 & 무균 수술 센터",
        subtitle: "감염 차단을 위해 철저히 멸균 소독된 프라이빗 진료 체어와 친절한 의료 시스템입니다.",
        content_data: {
          items: [
            { title: "독립 진료 개인 체어 룸", description: "주변 환자의 시선이 완전 차단되어 편안하고 정숙한 상태로 스케일링 및 충치 치료를 받는 스페이스", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
            { title: "무균 양압 임플란트 수술실", description: "외부 공기 중 미세먼지와 바이러스를 양압 장치로 완벽 차단해 2차 감염률을 0%에 가깝게 조율한 특수 수술실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "3D 구강 스캐너 & CAD/CAM 디자인실", description: "지저분한 고무 인상재 대신 디지털 스캐너로 10초 만에 구강 전체를 입체적으로 읽어내는 그래픽 디자인실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "진료 예약 및 불편 부위 문의",
        subtitle: "원하시는 요일, 기존 임플란트 상담 필요 여부, 혹은 현재 치통 상태를 적어주시면 친절하게 진료 스케줄을 확정해 드립니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "치과 진료 스케줄 예약"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 3: CrossFit, Senior Care, Pediatrics, Oriental, Physio
  // ==========================================
  crossfit_box: {
    templateId: "crossfit_box",
    name: "아이언박스 고강도 크로스핏 & 컨디셔닝",
    category: "Health & Wellness",
    description: "강렬한 러프 메탈 블랙과 경고 노란색 패널, 그리고 열정을 불태우는 블러드 레드 액센트가 시선을 사로잡는 강력 고강도 하드코어 체육관 전용 테마입니다.",
    image: "/templates/crossfit_box.png",
    theme: {
      fontFamily: "Impact, Archivo Black, Inter, sans-serif",
      colors: {
        primary: "#eab308",     // 강렬한 경고 옐로우
        secondary: "#3f3f46",   // 인더스트리얼 러프 스틸 그레이
        accent: "#dc2626",      // 심장박동을 요동치게 하는 붉은색
        background: "#09090b",  // 매트 차콜 블랙
        surface: "#18181b",     // 컨테이너 러프 텍스처
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-none", // 각진 날것의 인더스트리얼 감성
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "오늘의 와드(WOD)를 돌파하고 어제보다 강인한 심장을 쟁취하라",
        subtitle: "남의 시선을 신경 쓰는 연출된 피트니스가 아닌, 바벨을 메고 한계를 넘기며 함께 함성을 지르고 땀 흘리는 거칠고 뜨거운 오리지널 정통 크로스핏 박스입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
          ctaText: "무료 WOD 체험 신청",
          ctaLink: "#contact",
          features: [
            { text: "미국 공식 크로스핏 본사 정식 제휴 지부 및 전문 Level 2 코치진 포진" },
            { text: "역도, 기계체조, 로잉 머신을 결합한 지루할 틈 없는 데일리 운동 매뉴얼" }
          ]
        }
      },
      {
        section_type: "services",
        title: "트레이닝 시스템",
        subtitle: "체력의 한계를 뚫고 숨겨진 유산소 및 무산소 지구력을 끝까지 폭발시키는 고효율 클래스입니다.",
        content_data: {
          items: [
            {
              title: "정규 크로스핏 WOD",
              description: "매일 새롭게 설계되는 '오늘의 운동'을 수행하며 전신의 근육과 심폐 지구력을 입체적으로 단련합니다.",
              icon: "Zap"
            },
            {
              title: "왕초보를 위한 온램프 (On-Ramp)",
              description: "바벨 스내치, 클린앤저크, 풀업의 안전하고 정확한 역학적 기본 자세를 4주간 체계적으로 교육합니다.",
              icon: "Award"
            },
            {
              title: "바벨 클래스 & 파워리프팅",
              description: "3대 중량 스쿼트, 벤치 프레스, 데드리프트의 최대 근력을 안전하고 강력하게 끌어올려 줍니다.",
              icon: "Activity"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "낙오자 없이 모두가 함께 끝까지 바벨을 내려놓지 않는 공동체",
        subtitle: "혼자 하면 10번 만에 쓰러지지만, 동료의 함성이 있다면 30번도 거뜬히 성공합니다.",
        content_data: {
          description: "안녕하십니까. 아이언박스 크로스핏 헤드 코치입니다. 기계 위에서 텔레비전을 보며 느리게 걷는 무의미한 시간에 지치셨나요? 우리 박스에서는 매 세션마다 칠판에 각자의 기록을 적고 동료의 이름을 외치며 열정적인 시너지를 이끌어냅니다. 두려워 마십시오. 중량은 코치가 완벽하게 개별 맞춤 조절(Scaling)해 드리므로 누구나 안전하게 부상 없이 한계의 희열을 맛볼 수 있습니다.",
          stats: [
            { label: "정식 등록 액티브 크루", value: "350명+" },
            { label: "보유 고중량 로그 원반", value: "3.5톤 분량" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "지상 200평 초대형 박스 시설",
        subtitle: "답답한 먼지 없이 강력 환기 및 층간 소음 매트가 전면 매립된 최고급 리프팅 플레이그라운드입니다.",
        content_data: {
          items: [
            { title: "로잉 머신 & 에코 바이크 라인", description: "심폐 지구력을 지옥 끝까지 밀어붙여 지방을 증발시키는 콘셉트2 로잉 15대 라인업", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80" },
            { title: "몬스터 철봉 리그 & 머슬업 존", description: "단체 20명이 동시에 매달려 턱걸이와 토스투바를 수행할 수 있는 견고한 강철 락 타워", image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80" },
            { title: "역도 드롭 플레이트 존", description: "머리 위로 번쩍 든 바벨을 바닥에 큰 소리 내며 투하해도 무리 없는 미국 특허 충격 흡수 바닥재", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "아이언 크루 합류 의뢰",
        subtitle: "크로스핏 경험 유무, 겪고 계신 관절 이상 여부, 선호하는 타임(오전/오후)을 적어 비공개 무료 트라이얼을 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "무료 와드 체험단 가입"
        }
      }
    ]
  },

  senior_care_nursing: {
    templateId: "senior_care_nursing",
    name: "HappyAging 프리미엄 실버 케어센터",
    category: "Health & Wellness",
    description: "따뜻하고 포근한 골든 옐로우와 부드러운 살구색 피치 브라운이 결합하여 노년의 존엄성과 내 집 같은 안락함을 제공하는 요양원 및 실버 케어 전문 테마입니다.",
    image: "/templates/senior_care_nursing.png",
    theme: {
      fontFamily: "Noto Serif KR, Nanum Gothic, sans-serif",
      colors: {
        primary: "#b45309",     // 노을빛 골든 허니 브라운
        secondary: "#fef3c7",   // 부드러운 살구빛 크림 아이보리
        accent: "#c2410c",      // 따뜻한 에너지를 주는 황토 오렌지
        background: "#fdfbf7",  // 무자극 오가닉 베이지
        surface: "#ffffff",     // 깨끗하고 청결한 원목 베딩 화이트
        text: "#451a03"         // 시인성이 뚜렷하고 온화한 딥 머드 브라운
      },
      borderRadius: "rounded-xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "어르신의 두 번째 청춘을 위해, 가족의 마음으로 품격 높게 모십니다",
        subtitle: "24시간 전담 간호사 및 사회복지사 상주 시스템과 안심 인공지능 낙상 예방 인프라를 통해, 요양과 재활 그리고 문화적 치유가 하나로 융합된 품격 높은 하이엔드 실버 케어 요양원입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "입소 자격 및 시설 상담 신청",
          ctaLink: "#contact",
          features: [
            { text: "국민건강보험공단 장기요양기관 평가 최우수 A등급 연속 획득 검증" },
            { text: "치매 예방 뇌파 훈련 프로그램 및 인지 활성화 미술 테라피 정규 운영" }
          ]
        }
      },
      {
        section_type: "services",
        title: "가족 안심 케어 매트릭스",
        subtitle: "어르신의 신체적 재활과 정서적 교감을 완벽하게 책임지는 체계적인 실버 복지입니다.",
        content_data: {
          items: [
            {
              title: "24시간 메디컬 전담 간호 서비스",
              description: "혈당 및 혈압 상시 모니터링, 만성 복용 약물 정시 복용 체크, 협력 대형병원 비상 핫라인 공조 인프라를 가동합니다.",
              icon: "Shield"
            },
            {
              title: "슬로우 액티브 신체 재활",
              description: "전문 물리치료사의 주도 하에 경직된 관절을 순하게 풀어주고 다리 기립근을 단련해 보행 보조 훈련을 돕습니다.",
              icon: "Activity"
            },
            {
              title: "품격 높은 인지 실버 레크레이션",
              description: "기억력을 되살려 치매 진행을 예방하고 우울감을 씻어주는 꽃꽂이, 오감 자극 웃음 치료 등 다채로운 일과 프로그램을 서빙합니다.",
              icon: "Smile"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "눈가에 지어지는 편안한 미소가 자녀분들의 가장 큰 효도가 되도록",
        subtitle: "우리는 어르신을 환자로 대하지 않고, 평생 존경받아 마땅한 인생의 선배님으로 예우합니다.",
        content_data: {
          description: "반갑습니다. 해피에이징 실버 케어센터 원장입니다. 부모님이 갑작스런 거동 불편이나 노인성 질환을 겪으실 때, 직장 생활과 요양을 병행하며 홀로 마음 졸이던 자녀분들의 고통을 잘 알고 있습니다. 우리는 병원 같은 삭막한 요양 시설을 걷어내고, 햇볕이 가득 드는 마당과 따스한 온돌 황토 마감을 구현해 어르신들이 본인의 집처럼 가장 존엄하고 아늑하게 여생의 즐거움을 누리도록 보살피겠습니다.",
          stats: [
            { label: "요양 복지사 1인당 케어 어르신", value: "2.5명 이하" },
            { label: "협력 메디컬 연계 병원", value: "4대 대학병원" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "내 집처럼 포근한 프리미엄 인프라",
        subtitle: "휠체어 이동을 위해 문턱을 완전히 제거하고 친자연 황토 마루를 설계한 어르신 중심 안심 설계입니다.",
        content_data: {
          items: [
            { title: "황토 벽면 1인/2인 안심실", description: "원적외선이 방출되는 황토벽과 낙상 감지 침대 센서가 부착되어 낙상 사고를 완전 원천 차단하는 룸", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "물리치료 및 보행 재활실", description: "체중 부하를 분산해 안전하게 서서 걸을 수 있는 보행 레일과 저주파 마사지기가 완비된 재활 치료실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "유기농 무농약 키친 텃밭 라운지", description: "마당에 마련된 야외 미니 텃밭에서 직접 상추와 방울토마토를 가꾸며 오감을 활성화하는 원예 라운지", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "입소 자문 및 시설 방문 견학 의뢰",
        subtitle: "어르신의 현재 장기요양등급(1~5등급 등) 보유 상태 및 거동 유무(보행 유무)를 기재해 주시면 친절하게 정부 보조금 수령 팁과 입소 안내를 보좌합니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "정밀 입소 상담 예약"
        }
      }
    ]
  },

  child_pediatrics: {
    templateId: "child_pediatrics",
    name: "LittleSprout 새싹 소아청소년과 의원",
    category: "Health & Wellness",
    description: "아이들의 긴장감을 덜어주는 파스텔 스카이 블루와 친근한 레몬 옐로우의 조화로 치유적 공간 심리를 디자인한 따뜻한 친환경 소아과 테마입니다.",
    image: "/templates/child_pediatrics.png",
    theme: {
      fontFamily: "Fredoka, Inter, sans-serif",
      colors: {
        primary: "#0284c7",     // 맑고 친근한 스카이 블루
        secondary: "#fef08a",   // 병아리 레몬 옐로우
        accent: "#f43f5e",      // 사랑스러운 베리 핑크
        background: "#f0f9ff",  // 푸른 하늘 오프화이트
        surface: "#ffffff",     // 둥글고 모서리 없는 새하얀 표면
        text: "#0369a1"         // 시각적으로 안정된 깊은 하늘 블루
      },
      borderRadius: "rounded-3xl", // 아이들을 위해 아주 부드러운 라운딩
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "아이가 아픈 날에도 무섭지 않도록, 친근하고 따뜻한 치유 놀이터",
        subtitle: "치과나 소아과만 오면 울고 떼쓰는 아이의 심리를 섬세하게 배려해, 주사 바늘의 공포는 낮추고 오감을 안심시키는 미니 도서실 놀이시설과 숙련된 소아 전문의들이 상생하는 소아과입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "실시간 모바일 예방접종 대기",
          ctaLink: "#contact",
          features: [
            { text: "국가 보건 복지 지정 소아 필수 국가 무료 영유아 예방접종 공식 대행 의료기관" },
            { text: "성장 발달 지연, 소아 아토피 알레르기 및 소아 비만 영양 전문 특화 클리닉" }
          ]
        }
      },
      {
        section_type: "services",
        title: "새싹 안심 클리닉 진료",
        subtitle: "신생아 영유아 시기부터 청소년기까지 아이의 뼈와 마음 성장을 꼼꼼하게 들여다보는 진료실입니다.",
        content_data: {
          items: [
            {
              title: "영유아 검진 & 성장 모니터링",
              description: "월령별 신체 발달 지표와 대근육, 소근육 발달 상태를 정교하게 추적하여 또래보다 느린 요소를 선제 진단합니다.",
              icon: "Activity"
            },
            {
              title: "아토피 & 알레르기 케어 룸",
              description: "면역계 미성숙으로 인한 만성 비염, 소아 천식, 알레르기 항원 정밀 혈액 검사(MAST) 및 무자극 완화 치료를 수행합니다.",
              icon: "Shield"
            },
            {
              title: "소아 이비인후 안심 진료",
              description: "중이염, 편도선염을 코에 넣는 미세 카메라를 활용하여 아프지 않고 빠르게 흡입 세척 치료합니다.",
              icon: "Volume"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아이의 몸뿐만 아니라 치과와 소아과에 대한 따뜻한 기억까지 지키는 마음",
        subtitle: "모든 약은 최소한으로 처방하여, 아이 스스로의 자체적인 면역력이 가장 강해지도록 도울 것을 약속합니다.",
        content_data: {
          description: "반갑습니다. 새싹 소아과 대표원장이자 두 아이의 아빠입니다. 차갑고 무서운 금속 기구와 흰 가운만 봐도 숨이 넘어가게 우는 아이를 둔 어머니들의 지친 심정을 저 또한 누구보다 격하게 공감합니다. 그래서 우리는 대기 공간에 아이들이 좋아하는 동화책 가득한 북 카페를 마련했고, 뽀로로 영상이 부착된 특수 진료 장비를 가동합니다. 내 아이를 진료한다는 한결같은 약속 아래 과잉 약물 남용 없이 정직하게 치료하겠습니다.",
          stats: [
            { label: "영유아 종합 예방접종 종류", value: "28종 완비" },
            { label: "안심 소아 전담 간호사", value: "5명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "어린이 안심 놀이 룸 & 호흡기 치료실",
        subtitle: "병원 특유의 알코올 냄새를 완전히 정화하여 정서적 공포감을 제어한 귀여운 파스텔 톤 시설입니다.",
        content_data: {
          items: [
            { title: "새싹 도서 쉼터 & 키즈 라이브러리", description: "대기 시간 동안 아이들이 보드게임을 하거나 어린이 영어 동화책을 읽을 수 있는 매트 바닥 안심 놀이터", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
            { title: "귀여운 호흡기 네뷸라이저 치료실", description: "귀여운 곰돌이 가면 모양의 마스크를 통해 기침 천식을 완화하는 식염수 스팀 호흡기 치료 테이블", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "친환경 신생아 수유 및 기저귀실", description: "갓난 아기들을 위해 온수 싱크대와 푹신한 아기 침대, 유기농 젖병 전용 소독기가 세팅된 단독 수유실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "실시간 접종 스케줄 & 대기 의뢰",
        subtitle: "아이의 생년월일과 맞아야 할 예방접종 회차(예: 독감 예방주사 등)를 적어 모바일 우선 순위 대기 티켓을 발권받으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "모바일 예약권 발행"
        }
      }
    ]
  },

  traditional_oriental: {
    templateId: "traditional_oriental",
    name: "Ongi 온기 한의원 & 한방 클리닉",
    category: "Health & Wellness",
    description: "전통적인 한지의 깊은 묵직함이 느껴지는 먹색 차콜과 기품 있는 유기 놋쇠 황동 골드가 마음의 침체된 독소를 씻겨내며 원기를 북돋아 주는 프리미엄 전통 한의원 테마입니다.",
    image: "/templates/traditional_oriental.png",
    theme: {
      fontFamily: "Noto Serif KR, East Sea Dokdo, serif",
      colors: {
        primary: "#4a3c31",     // 은은한 쌍화차 향이 날 것 같은 깊은 전통 다크 브라운
        secondary: "#d4af37",   // 기품 있고 따스한 황동 골드
        accent: "#7c2d12",      // 따뜻한 온기가 느껴지는 대추 오렌지 브라운
        background: "#f5ece1",  // 한지 무늬 웜 베이지
        surface: "#ffffff",     // 정갈하게 다듬어진 툇마루 크림 화이트
        text: "#29211c"         // 먹묵빛 잉크 브라운 차콜
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "몸속의 찬 기운을 몰아내고, 따스한 온기로 원기를 보양합니다",
        subtitle: "맥을 짚어 오장육부의 정서적, 육체적 허실을 날카롭게 감별하고, 자연에서 얻은 100% 옹기 무독성 무농약 청정 한약재만을 고수하여 혈맥의 순환을 부드럽게 복원하는 명품 한의원입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
          ctaText: "체질 맥진 진료 예약",
          ctaLink: "#contact",
          features: [
            { text: "보건복지부 공인 한방내과 및 침구과 전문의 시니어 원장단 직접 침도 진료" },
            { text: "식품의약품안전처 안전성 GAP 공식 승인 완료된 프리미엄 명품 한약 조제 보증" }
          ]
        }
      },
      {
        section_type: "services",
        title: "온기 한방 치료 요강",
        subtitle: "막힌 기혈을 소통시키고 뒤틀린 관절을 바로잡아 전신의 활력을 재건하는 맞춤 처방입니다.",
        content_data: {
          items: [
            {
              title: "기혈 소통 침 & 약침 요법",
              description: "초미세 침 자극을 통해 염증 물질을 즉각 배출하고, 봉독과 녹용 약침을 결합해 만성 관절염 통증을 급속 경감합니다.",
              icon: "Activity"
            },
            {
              title: "한방 추나 체형 복원술",
              description: "한의사가 직접 환자의 뼈와 관절 부위를 밀고 당기며 좁아진 척추 간격을 열어 디스크 신경통을 완화합니다.",
              icon: "Layers"
            },
            {
              title: "체질 맞춤 보양 한약 조제",
              description: "사상 체질(태양, 태음, 소양, 소음)을 정밀 감별하여 기력을 돋우고 면역계 독소를 몰아내는 항염 옹기 한약입니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "따스한 햇살 같은 미소와 꼼꼼한 문진으로 마음의 병증까지 품습니다",
        subtitle: "모든 약재는 흐르는 정수물로 4차 세척하고 고가 옹기 약탕기에서 옹기 숨을 쉬며 다려집니다.",
        content_data: {
          description: "반갑습니다. 온기 한의원 대표원장입니다. 우리는 단순히 통증 부위에 임시 진통성 침만 놓는 것이 아닌, 환자의 평소 소화 상태, 소변과 대변의 빛깔, 수면 중 땀이 흘러내리는 유무를 종합 관찰하여 오장육부 중 어느 곳이 차갑게 막혀 있는지를 입체적으로 역추적합니다. 원인을 모르게 시리고 손발이 차며 아팠던 만성 한증 질환을, 온기 한의원만의 30년 전통 비법 침 치료법과 한약으로 온화하게 녹여내십시오.",
          stats: [
            { label: "처방 한약 옹기 달임 건수", value: "24,000재+" },
            { label: "원장 한방 경력", value: "32년 전통" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "정갈한 한방 진료 룸 & 약재실",
        subtitle: "은은한 약초 향기와 정갈한 원목 가구들이 가득 차 심리적 편안함을 선사하는 전통 힐링 공간입니다.",
        content_data: {
          items: [
            { title: "아늑한 황토 침도 치료실", description: "따뜻한 적외선 램프 조사기와 무선 온열 온돌 베드가 장착된 전통 방음 침구 치료실", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" },
            { title: "오픈형 청정 한약재 약국실", description: "환자들이 직접 말린 인삼과 당귀의 깨끗한 원산지 라벨을 상시 검수할 수 있는 위생 약제 조제실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
            { title: "한방 아로마 족욕 라운지", description: "진료 대기 중 따뜻한 쑥 물에 발을 담그고 한방 차를 마시며 하체의 어혈을 미리 풀어주는 족욕 전용 대기실", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원기 보충, 초진 예약 신청",
        subtitle: "소화불량 여부, 손발 시림 유무, 만성 피로 및 불면 상태를 선택해 기재해 주시면 친절하게 전화를 드립니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "전통 체질 맥진 신청"
        }
      }
    ]
  },

  physiotherapy_rehab: {
    templateId: "physiotherapy_rehab",
    name: "Recovery 물리치료 & 체형재활 센터",
    category: "Health & Wellness",
    description: "활동적이고 에너제틱한 애슬레틱 스카이 블루와 산뜻한 세이프티 오렌지가 만나, 수술 후 통증 관리와 1:1 관절 기능 운동 복원을 입체적으로 보여주는 물리치료 센터 테마입니다.",
    image: "/templates/physiotherapy_rehab.png",
    theme: {
      fontFamily: "Inter, system-ui, sans-serif",
      colors: {
        primary: "#1d4ed8",     // 에너제틱 애슬레틱 블루
        secondary: "#dbeafe",   // 시원하고 맑은 스카이 라이트 블루
        accent: "#ea580c",      // 근육의 활성화를 상징하는 오렌지 레피드
        background: "#f8fafc",  // 과학적 인테리어 라이트 그레이
        surface: "#ffffff",     // 깨끗한 치료 룸 진료대 화이트
        text: "#1e293b"         // 스마트하고 가독성 높은 네이비 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "디스크와 관절 통증의 근원, 뼈의 각도와 근육의 불균형을 재교육합니다",
        subtitle: "정형외과 수술 후 빠른 복귀를 원하시거나 오십견, 회전근개 파열로 어깨 팔 가동 범위가 좁아지신 분들을 위해 물리치료사와 함께 1:1 스포츠 의학 재활 프로그램을 가동합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          ctaText: "통증 원인 진단 예약",
          ctaLink: "#contact",
          features: [
            { text: "대한도수치료협회 정회원 및 시니어 스포츠 의학 치료사 1:1 전담 마크" },
            { text: "체외충격파(ESWT), 무통증 고주파 레이저 등 하이테크 물리 기기 가동" }
          ]
        }
      },
      {
        section_type: "services",
        title: "물리치료 & 재활 트랙",
        subtitle: "손상된 신경의 신호를 빠르게 깨우고 관절의 가동 범위를 복원하는 검증된 치료입니다.",
        content_data: {
          items: [
            {
              title: "1:1 집중 정형 도수치료",
              description: "의사의 정밀 처방전 아래 치료사가 관절의 유동성을 손끝 미세 지레 힘으로 강제로 유도해 눌린 신경을 해방합니다.",
              icon: "Activity"
            },
            {
              title: "체외충격파 관절 염증 치료",
              description: "강한 음파 파동 에너지를 건과 인대 부위에 침투시켜 혈관의 자가 재생을 촉진하고 통증을 제거합니다.",
              icon: "Zap"
            },
            {
              title: "스포츠 재활 및 관절 운동 치료",
              description: "수술 부위 주변 근육의 약화를 방지하기 위해 맞춤 슬링(Sling) 장치와 등속성 장비로 기능 회복을 유도합니다.",
              icon: "Shield"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "다시 한 번 통증 없이 걷고, 자유롭게 던지는 삶의 기쁨을 찾도록",
        subtitle: "단순 열 치료와 전기 마사지만으로는 망가진 근육 패턴을 영구 복구할 수 없습니다.",
        content_data: {
          description: "반갑습니다. 리커버리 물리치료 센터 수석 원장입니다. 많은 디스크 환자분들이 아프면 누워서 쉬기만 해야 한다고 오해합니다. 하지만 통증이 유발되지 않는 정교한 범위 내에서의 능동적 움직임과 보조 근육의 기립 근력 강화만이, 요추와 어깨 관절을 영구적으로 보호하는 가장 스마트한 방패막이가 됩니다. 대학병원 스포츠 재활실에서 축적한 다년간의 프로 선수 치료 노하우로 당신의 발걸음을 가볍게 복원해 드리겠습니다.",
          stats: [
            { label: "물리치료사 보유 면허", value: "8명 전원" },
            { label: "프로 운동선수 재활 이력", value: "85명+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "첨단 물리치료 및 도수실 전경",
        subtitle: "정교하고 안전한 치료 가이드 라인을 위해 최신 수입 정형 장비를 세팅해 두었습니다.",
        content_data: {
          items: [
            { title: "슬링(Sling) 로프 치료대", description: "체중을 로프 줄에 매달아 중력을 배제한 상태에서 관절의 가동 각도를 고통 없이 극대화하는 치료 스페이스", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
            { title: "집중형 스위스 체외충격파 기기실", description: "석회성 건염 및 족저근막염 부위의 미세 석회를 충격파 에너지로 분해해 내는 오차 없는 치료실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "프라이빗 정밀 1인 도수룸", description: "독립된 아늑한 방에서 전담 치료사에게 프라이빗하게 근막 릴렉스 및 스트레칭 피드백을 받는 전용 룸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "도수 및 관절 정밀 진단 의뢰",
        subtitle: "기존 척추 디스크 정밀 MRI/CT 촬영 유무, 수술 여부, 그리고 통증이 지속된 기간을 기재해 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "정밀 물리치료 상담 신청"
        }
      }
    ]
  },

  // ==========================================
  // BATCH 4: Aromatherapy, Hiking, Women's, Corporate, Vegan
  // ==========================================
  aromatherapy_wellness: {
    templateId: "aromatherapy_wellness",
    name: "ScentWell 아로마테라피 & 천연 에센셜 오일",
    category: "Health & Wellness",
    description: "우아하고 향긋한 파스텔 딥 라벤더 퍼플과 싱그러운 유칼립투스 리프 그린이 조화를 이루어, 지친 일상의 심신을 고귀하게 위로하는 아로마 전문 테마입니다.",
    image: "/templates/aromatherapy_wellness.png",
    theme: {
      fontFamily: "Playfair Display, Noto Serif KR, serif",
      colors: {
        primary: "#6d597a",     // 향기로운 앤티크 라벤더 퍼플
        secondary: "#e0b1cb",   // 화사한 오가닉 베리 핑크
        accent: "#355070",      // 차분한 밤하늘 네이비
        background: "#fbf8f9",  // 은은한 오프 펄 핑크 백그라운드
        surface: "#ffffff",     // 깨끗한 향초 세라믹 화이트
        text: "#3d314a"         // 깊고 우아한 카본 플럼 블랙
      },
      borderRadius: "rounded-full",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "코끝으로 전해지는 순수한 식물의 생명력, 내 영혼의 감성 향수",
        subtitle: "100% 천연 유기농 꽃잎과 나무뿌리에서 얻은 에센셜 테라피 등급 오일의 기품 있는 향기로, 불면증과 극심한 두통에 무겁게 찌들어 있던 뇌파를 1초 만에 평온한 안식으로 정화해 드립니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "아로마 홈 키트 보러가기",
          ctaLink: "#contact",
          features: [
            { text: "프랑스 프로방스 및 전 세계 유명 야생 농가에서 직수입한 테라피 등급 천연 원유" },
            { text: "국제 아로마테라피 연맹(IFA) 소속 수석 조향 조향사 1:1 시그니처 커스텀 향수 클래스" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아로마테라피 향기 요법",
        subtitle: "식물의 고유한 면역 성분과 향기를 흡입하여 자율신경계 균형을 리셋하는 향기 매뉴얼입니다.",
        content_data: {
          items: [
            {
              title: "1:1 시그니처 감정 오일 매칭",
              description: "현재 마음 상태에 따라 가장 끌리는 향 4가지를 선별하여, 나의 억눌린 심리 무기력 상태를 역추적 치료합니다.",
              icon: "Heart"
            },
            {
              title: "아로마 DIY 천연 캔들 제작 클래스",
              description: "파라핀과 화학 인공 향료 전혀 없이 소이왁스와 에센셜 오일로만 호흡기에 안전한 캔들을 제작합니다.",
              icon: "Sparkles"
            },
            {
              title: "만성 비염 예방 유칼립투스 인헤일",
              description: "환절기 코막힘과 콧물을 다스리기 위해 프랑크인센스와 페퍼민트를 조화롭게 배합하여 호흡기 면역을 보호합니다.",
              icon: "Wind"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "화학 향료의 인공 소음을 끄고, 진짜 꽃과 숲이 말하는 비밀을 경청해 보세요",
        subtitle: "진짜 아로마 에센셜 오일은 단 한 방울만으로도 전신의 모세혈관을 순환하는 자연의 메신저입니다.",
        content_data: {
          description: "안녕하세요. 센트웰 아로마의 대표 국제 아로마테라피스트입니다. 우리는 매장에서 판매되는 싸구려 합성 디퓨저나 두통을 유발하는 향수들의 대안으로, 자연이 오랫동안 축적해 온 안전한 천연 과일과 잎사귀 오일의 유효 성분을 전수합니다. 우리의 모든 캔들과 스프레이 제품은 아기나 반려동물이 함께 생활하는 공간에서도 무독성으로 건강하게 즐길 수 있습니다. 영혼을 어루만지는 힐링 아로마를 호흡해 보세요.",
          stats: [
            { label: "자체 조향 에센셜 원유 품종", value: "48가지" },
            { label: "클래스 수강생 평점 찬사", value: "4.95 / 5.0" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "에센셜 오일 보틀 & 클래스 아틀리에",
        subtitle: "갈색 보틀 속에 빛을 차단해 완벽 보존된 고품질 유기농 아로마 오일 에디션입니다.",
        content_data: {
          items: [
            { title: "프로방스 천연 라벤더 원유", description: "정서적 흥분을 즉각 가라앉혀 숙면을 강력 유도하는 프랑스 직수입 최고급 라벤더 앙상블", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "아늑한 우드 족욕 클래스 룸", description: "천연 암염과 로즈마리 오일을 물에 풀어 발의 만성 피로와 수족냉증을 풀어주는 족욕 체험실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "에센셜 오일 홈 디퓨징 패키지", description: "물 없이 오직 미세 파동만으로 아로마를 집안에 공기 확산시켜 주는 프리미엄 네뷸라이저 디퓨저 세트", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원데이 향수 스쿨 & 단체 기업 특강 의뢰",
        subtitle: "참여 인원수, 원하시는 방향(힐링 디퓨징, 감정 오일 분석 등)을 기재하여 예약 스케줄을 확정 받으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아로마 힐링 클래스 예약"
        }
      }
    ]
  },

  hiking_outdoor_club: {
    templateId: "hiking_outdoor_club",
    name: "PeakFinder 아웃도어 하이킹 & 트레킹 클럽",
    category: "Health & Wellness",
    description: "자연을 탐험하는 짙은 마운틴 핀 그린과 비바람을 견디는 브라운, 그리고 조난 예방용 블레이즈 오렌지가 활동적인 자연 친화 하이킹 아웃도어 커뮤니티를 표현하는 테마입니다.",
    image: "/templates/hiking_outdoor_club.png",
    theme: {
      fontFamily: "Cabinet Grotesk, Inter, sans-serif",
      colors: {
        primary: "#14532d",     // 우거진 마운틴 포레스트 그린
        secondary: "#fed7aa",   // 아늑한 모닥불 오렌지 베이지
        accent: "#ea580c",      // 강인한 조난 가이드 오렌지
        background: "#f4f4f5",  // 깔끔한 스틸 돌그레이
        surface: "#ffffff",     // 맑고 깨끗한 아웃도어 화이트
        text: "#18181b"         // 단단한 화산재 카본 블랙
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "답답한 실내 트레드밀을 벗어나, 거대한 대자연을 호흡하며 걸어라",
        subtitle: "해외 유명 트레킹 코스부터 숨겨진 국내 비경 산맥까지 전문 트레킹 가이드와 동행하여, 심폐 기능의 극단적 강화와 자연으로부터의 완벽한 멘탈 디톡스를 획득하는 고품격 프리미엄 아웃도어 클럽입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "다가오는 하이킹 크루 가입",
          ctaLink: "#contact",
          features: [
            { text: "전문 산악 안전 구조사 및 인명구조 자격 가이드 100% 동행 안전 보장" },
            { text: "난이도별(비기너 초급, 백패킹 중급, 릿지 등반 상급) 맞춤 주말 일정 매칭" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아웃도어 어드벤처 라인",
        subtitle: "자연 속에서 신체의 기초 대사 능력과 심폐력을 올리는 매력적인 하이킹 코스입니다.",
        content_data: {
          items: [
            {
              title: "초급 숲길 마인드 트레킹",
              description: "경사도 5도 내외의 완만하고 피톤치드 가득한 숲길을 걸으며 호흡법을 가다듬고 야외 명상을 진행합니다.",
              icon: "Compass"
            },
            {
              title: "1박 2일 산정 백패킹 크루",
              description: "등에 배낭을 메고 별빛 가득한 산 정상 헬기장에서 자연과 동화되어 캠핑을 즐기는 낭만적인 야생 프로그램입니다.",
              icon: "Zap"
            },
            {
              title: "릿지 암릉 정밀 정복반",
              description: "단단한 바위 암벽의 홀더를 잡고 릿지화를 신어 온몸의 소근육과 악력을 최대로 활용하는 고강도 상급 코스입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "오직 두 발만으로 산을 정복하는 순간, 도심 속의 모든 잡념이 무너집니다",
        subtitle: "우리는 단순히 빨리 올라가는 속도 경쟁을 멈추고, 바람 소리와 야생 꽃의 결을 느끼며 걷습니다.",
        content_data: {
          description: "안녕하십니까. 피크파인더 하이킹 클럽의 수석 대장입니다. 쳇바퀴 같은 빌딩 숲 일상에 무겁게 눌려 정서적 호흡 곤란을 겪고 계시진 않나요? 산은 정직합니다. 땀을 흘린 만큼만 풍경을 선사하며, 정상에 도달했을 때 불어오는 차가운 바람은 삶의 모든 찌든 우울을 단숨에 증발시켜 줍니다. 완벽한 등산 장비 체크리스트부터 안전 무릎 보호 걸음걸이 비법까지 산행 전문가가 세심하게 전수합니다.",
          stats: [
            { label: "안전 무사고 누적 산행", value: "420회 연속" },
            { label: "정회원 활동 하이커 수", value: "850명+" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "우리가 함께 정복한 영광의 산맥 정상들",
        subtitle: "자연 앞에서 나약함을 극복하고 굳건히 서서 촬영한 하이커들의 자랑스러운 포토 리포트입니다.",
        content_data: {
          items: [
            { title: "설악산 공룡능선 종주 챌린지", description: "칼날 같은 바위 암릉을 넘나들며 기백을 기르고 하체 허벅지 근지력을 한계까지 시험한 14시간 종주 크루", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
            { title: "제주 한라산 눈꽃 백록담 사색 트래킹", description: "새하얀 눈으로 뒤덮인 한라산 눈꽃 터널을 걸으며 새해 건강 다짐을 새긴 로맨틱 윈터 아웃도어 패키지", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80" },
            { title: "히말라야 ABC 베이스캠프 트래킹 원정", description: "평생의 버킷리스트인 안나푸르나 베이스캠프 4,130m 고지를 고산병 예방 가이드 아래 안전하게 터치한 원정 스냅", image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "가입 신청 및 다가오는 하이킹 접수",
        subtitle: "등산 초보 여부, 희망하는 장비 보유 상태(등산화, 배낭 등)를 적어주시면 입단 안내 매뉴얼 PDF를 메일로 무상 전송해 드립니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "하이킹 크루 지원하기"
        }
      }
    ]
  },

  womens_wellness_clinic: {
    templateId: "womens_wellness_clinic",
    name: "Bella 여성전문 웰니스 & 산부인과 클리닉",
    category: "Health & Wellness",
    description: "품격 있고 프라이빗한 더스티 로즈 핑크와 부드러운 펄 모브 퍼플이 만나, 여성을 위한 섬세하고 편안한 비공개 웰니스 케어를 보장하는 전문 의원 테마입니다.",
    image: "/templates/womens_wellness_clinic.png",
    theme: {
      fontFamily: "Cormorant Garamond, Montserrat, sans-serif",
      colors: {
        primary: "#b07d62",     // 우아한 무드의 테라코타 더스티 로즈
        secondary: "#ebd4cb",   // 따뜻하고 안락한 로즈 크림
        accent: "#8c5383",      // 지적이고 포근한 모브 퍼플
        background: "#faf5f3",  // 눈부시지 않고 포근한 백그라운드
        surface: "#ffffff",     // 맑고 위생적인 화이트 베드
        text: "#402a23"         // 따뜻한 딥 초콜릿 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "여성의 생애 주기 전반의 건강과 호르몬 안정을 우아하게 보살핍니다",
        subtitle: "산부인과 내원이 부끄럽거나 두려우셨나요? 여성의 프라이버시를 철저히 존중하는 비공개 동선 시스템과 여성 전문의의 따스한 공감 가이드 아래, 자궁 건강부터 완경 대사케어까지 따뜻하게 수호합니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프라이빗 진료 예약",
          ctaLink: "#contact",
          features: [
            { text: "여성의 마음을 100% 공감하는 명문 의과대학 출신 여성 전문의 원장단 1:1 비밀 진료" },
            { text: "대기실 분리 및 접수 즉시 고유 가명 닉네임 호출을 적용해 철저한 신원 보안 보장" }
          ]
        }
      },
      {
        section_type: "services",
        title: "여성 맞춤 웰니스 스케줄",
        subtitle: "호르몬 불균형과 자궁 면역력을 체계적으로 보완하여 활력 넘치는 매일을 보장하는 안심 진료입니다.",
        content_data: {
          items: [
            {
              title: "미세 초음파 자궁 정밀 검진",
              description: "자궁근종, 다낭성 난소 증후군 등 자각 증상이 없는 미세 병변을 최고해상도 초음파로 명확하고 부드럽게 관찰합니다.",
              icon: "Activity"
            },
            {
              title: "임산부 태아 입체 초음파 클리닉",
              description: "예비 엄마의 편안한 정서 안정을 배려하며, 태아의 주수별 성장 지표와 입체 얼굴형을 선명하게 추적 촬영합니다.",
              icon: "Heart"
            },
            {
              title: "중년 여성을 위한 완경 호르몬 테라피",
              description: "에스트로겐 급감으로 우울, 홍조, 불면을 겪는 완경 전후 여성들을 위해 부작용 없는 천연 식물성 에스트로겐 솔루션을 설계합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "같은 여성이기에 그 누구보다 당신의 깊은 통증과 남모를 고민을 잘 이해합니다",
        subtitle: "우리는 단지 질환을 수술하는 공간이 아닌, 여성이 몸과 마음의 평온을 되찾아가는 웰니스 센터입니다.",
        content_data: {
          description: "안녕하십니까. 벨라 여성 클리닉 대표원장입니다. 여성의 호르몬은 매우 민감하여 사소한 스트레스만으로도 생리불순이나 만성 질염, 자궁 경부 염증을 쉽게 초래합니다. 하지만 왠지 모를 삭막한 느낌과 사회적 시선 때문에 병원 치료를 미루다 병을 키우시는 안타까운 상황이 많습니다. 우리는 럭셔리한 에스테틱 스파에 오시듯 마음 편히 아늑한 차를 마시며 여의사 원장과 자매처럼 수다 떨듯 편안히 상담받을 수 있습니다.",
          stats: [
            { label: "보유 첨단 입체 진단기기", value: "5대 라인업" },
            { label: "내원 환자 비밀 보장 만족률", value: "99.2%" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "여성 배려, 프라이빗 쉼터 & 진료실",
        subtitle: "공포의 치과/산부인과 의자를 배제하고 푹신한 아로마 배드로 구성한 안락한 시설입니다.",
        content_data: {
          items: [
            { title: "호텔식 1인 정밀 초음파실", description: "따뜻하게 데운 특수 초음파 겔과 부드러운 순면 시트를 활용해 쾌적함과 존엄성을 약속하는 진단 룸", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "비공개 1:1 밀착 상담 테라스실", description: "진료 전후 원장과 둥근 테이블에 앉아 따뜻한 허브 허브티를 마시며 편안하게 차트를 피드백 받는 힐링 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "여성 전용 릴렉싱 수액 테라피 라운지", description: "만성 생리통 및 만성 피로 수액 영양 공급을 받는 동안 프라이빗 스마트 헤드폰으로 명상 뇌파를 청취하는 안식 공간", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "비공개 안심 진료 예약 신청",
        subtitle: "가명 예약 신청 여부, 현재 겪고 계신 대략적인 불편(호르몬 검진, 웨딩 검진, 피임 등)을 작성해 전송해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "여의사 비밀 상담 예약"
        }
      }
    ]
  },

  corporate_wellness: {
    templateId: "corporate_wellness",
    name: "WellWork 기업형 복지 & 임직원 웰니스",
    category: "Health & Wellness",
    description: "지적이고 현대적인 슬레이트 그레이와 신뢰도 높은 트러스트 틸 그린을 조화시켜, 기업 임직원들의 번아웃 예방 및 멘탈 헬스 복지를 설계하는 B2B 솔루션 테마입니다.",
    image: "/templates/corporate_wellness.png",
    theme: {
      fontFamily: "Inter, Plus Jakarta Sans, sans-serif",
      colors: {
        primary: "#0f766e",     // 트러스트 포레스트 틸 그린
        secondary: "#e2e8f0",   // 스마트 클린 슬레이트
        accent: "#10b981",      // 활력을 상징하는 신선한 그린
        background: "#f8fafc",  // 과학적 데이터 오프화이트
        surface: "#ffffff",     // 명확한 레포트 화이트
        text: "#0f172a"         // 가독성 극대화 슬레이트 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "임직원의 번아웃을 방지하고, 기업의 업무 생산성을 극대화합니다",
        subtitle: "만성 피로와 스트레스로 가득 찬 현대 직장인들을 위해 스트레스 지수 AI 데이터 모니터링, 찾아가는 스트레칭 요가 교실, 1:1 심리 전문 상담 패키지를 통합 공급하는 선도적인 B2B 코퍼레이트 웰니스 플랫폼입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
          ctaText: "기업 제안서 다운로드",
          ctaLink: "#contact",
          features: [
            { text: "대기업 및 스타트업 120개사 임직원 웰니스 복지 프로그램 정기 납품 레퍼런스 보유" },
            { text: "비용 전액 복리후생비 세액 공제 증빙 서류 발급 및 성과 KPI 종합 리포트 발행" }
          ]
        }
      },
      {
        section_type: "services",
        title: "코퍼레이트 웰니스 솔루션",
        subtitle: "임직원들의 신체 피로와 정서적 불안을 사전에 방지하여 업무 이탈율을 억제하는 핵심 모듈입니다.",
        content_data: {
          items: [
            {
              title: "오피스 요가 & 자세 교정 오피스택",
              description: "전문 강사가 직접 기업의 대회의실로 출강하여 거북목과 골반 비대칭을 교정하는 점심시간 힐링 스트레칭입니다.",
              icon: "Zap"
            },
            {
              title: "EAP 임직원 비공개 심리 상담",
              description: "업무 압박과 직장 내 갈등으로 우울증, 번아웃을 겪는 임직원들을 위해 100% 철저히 보장되는 외부 상담 창구를 구축합니다.",
              icon: "Smile"
            },
            {
              title: "자연 치유 기업 워크숍 기획",
              description: "삭막한 세미나를 벗어나 강원도 숲속 리조트에서 명상과 디톡스 샐러드 식단을 체험하며 단합하는 프리미엄 힐링 워크숍을 설계합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "가장 건강하게 케어받는 인재가 회사의 미래 매출을 바꿉니다",
        subtitle: "임직원의 웰니스는 소모적 비용이 아닌, 퇴사율을 낮추는 가장 고효율의 미래 자산 투자입니다.",
        content_data: {
          description: "안녕하십니까. 웰워크 기업 웰니스 연구소 대표입니다. 과중한 업무량과 마감 압박으로 매일 아침 좀비처럼 커피 수혈로 출근하는 직원들의 모습에 익숙해지셨나요? 직원이 아프고 지치면 결국 업무의 집중도 저하와 잦은 실수가 유발되고 이는 고스란히 회사의 보이지 않는 손실로 적립됩니다. 우리는 구성원들의 자율신경계 과긴장도를 데이터로 실시간 진단하고 최적의 처방 운동과 상담을 대행하는 스마트 헬스케어 인프라를 공급합니다.",
          stats: [
            { label: "임직원 평균 스트레스 감소율", value: "34.2%" },
            { label: "정기 제휴 파트너 기업 수", value: "128개사" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "실제 임직원 워크숍 & 오피스 힐링 현장",
        subtitle: "업무 스트레스에서 완전히 해방되어 밝은 표정으로 힐링을 체험하는 파트너사 임직원들의 리포트입니다.",
        content_data: {
          items: [
            { title: "네이버 신사옥 점심 힐링 오피스 요가", description: "사내 휴게 라운지에 요가 매트를 깔고 지친 목 어깨 근막을 시원하게 풀어낸 오피스 요가 런치 크루", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80" },
            { title: "배달의민족 임직원 숲 힐링 캠프", description: "1박 2일간 청평 잣나무 숲속에서 디지털 장비를 반납한 뒤 명상과 싱잉볼 테라피에 몰입한 디톡스 원정", image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80" },
            { title: "스타트업 번아웃 예방 정신건강 특강", description: "성장 압박에 시달리는 창업가와 개발자들을 위해 마음챙김 일기 쓰기 및 자아 방어기제를 교육한 사내 세미나", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "제휴 문의 및 커스텀 견적 요청",
        subtitle: "임직원 총 규모수, 희망 프로그램 종류, 대략적인 복리후생 예산 한도를 적어 기재해 주시면 전문 웰니스 플래너가 당일 맞춤 제안서를 지참해 내방합니다.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "B2B 맞춤 제안서 의뢰"
        }
      }
    ]
  },

  vegan_diet_planner: {
    templateId: "vegan_diet_planner",
    name: "VeganLife 식물성 다이어트 & 밀키트 배송",
    category: "Health & Wellness",
    description: "싱그럽고 자연 친화적인 알팔파 연그린과 우유처럼 부드러운 오트밀 아이보리, 신선한 비트 레드의 결합으로 트렌디한 비건 다이어트 식단 배달을 보여주는 테마입니다.",
    image: "/templates/vegan_diet_planner.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#2e7d32",     // 내추럴 리프 비건 그린
        secondary: "#f1f8e9",   // 산뜻한 새싹 샐러드 연그린
        accent: "#c62828",      // 상큼한 크랜베리 비트 레드
        background: "#fafbf9",  // 순수한 무농약 청정 오프화이트
        surface: "#ffffff",     // 깨끗하고 청결한 오가닉 종이 박스 화이트
        text: "#1b5e20"         // 깊고 깨끗한 오가닉 포레스트 블랙
      },
      borderRadius: "rounded-2xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "맛있게 먹는 즐거움은 그대로, 지구와 내 몸을 지키는 100% 식물성 식단",
        subtitle: "뻑뻑한 닭가슴살에 지치셨나요? 풍부한 콩단백 대체육과 신선한 수제 견과류 드레싱, 그리고 유기농 잎채소를 정교하게 배합해, 다이어트 칼로리는 낮추고 풍미는 최대로 끌어올린 맞춤 비건 밀박스 새벽 배송입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
          ctaText: "첫 비건 밀박스 50% 체험 신청",
          ctaLink: "#contact",
          features: [
            { text: "HACCP 위생 인증 및 식품안전관리 기준을 통과한 자체 청정 비건 전용 공유 키친" },
            { text: "탄소 발자국을 최소화하는 100% 물로 얼린 종이 아이스팩 및 친환경 펄프 용기 배송" }
          ]
        }
      },
      {
        section_type: "services",
        title: "오가닉 비건 밀 라인업",
        subtitle: "식물성 단백질과 풍부한 섬유질로 장내 미생물을 춤추게 만드는 시그니처 배달 식단입니다.",
        content_data: {
          items: [
            {
              title: "체지방 타파 밀싹 샐러드 박스",
              description: "식이섬유가 풍부한 케일, 로메인을 기본으로 고소한 템페 구이와 구운 단호박을 얹어 하루 칼로리를 슬림하게 제한합니다.",
              icon: "Droplet"
            },
            {
              title: "원데이 고단백 대체육 비건 덮밥",
              description: "완두콩 단백질로 만든 특제 비건 숯불 갈비와 현미 퀴노아 곤약밥을 결합해 포만감과 단백질을 25g 가득 채운 영양 도시락입니다.",
              icon: "Zap"
            },
            {
              title: "디톡스 오트 바질 샌드위치 패키지",
              description: "호밀 식빵 사이에 바질 페스토와 구운 버섯, 유기농 토마토를 아낌없이 샌드해 든든하면서도 속 편한 아침 브런치입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "맛없는 비건은 가라, 셰프의 고밀도 미학적 레시피로 매일 즐기는 미식 비건",
        subtitle: "육류 소비를 단 한 끼 줄이는 것만으로도 수십 그루의 나무를 심는 친환경 기적이 시작됩니다.",
        content_data: {
          description: "반갑습니다. 비건라이프의 푸드 디렉터이자 비건 요리 연구가입니다. 비건 식단이라고 하면 단순히 싱거운 풀잎만 뜯어 먹는 맛없는 고행이라고 생각하는 분들이 많습니다. 우리는 참깨 에멀전 공법과 대체 버터 아보카도 지방 활용을 통해, 일반 육식 식사보다 훨씬 고소하고 풍부한 미감적 맛을 연출해 냅니다. 고지혈증, 콜레스테롤 걱정 없이 속 편하게 즐기는 고품격 비건 라이프를 경험해 보세요.",
          stats: [
            { label: "당일 즉시 수확 채소 비중", value: "100%" },
            { label: "자체 비건 소스 레시피 개수", value: "35가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "신선한 비건 주방 & 침샘 자극 식단 포토",
        subtitle: "합성 화학 보존제 없이 자연의 신선함을 투명하게 배송하는 웰빙 밀 박스 디테일입니다.",
        content_data: {
          items: [
            { title: "비건 떡갈비 곤약 현미 도시락", description: "대두 단백 숯불 직화 떡갈비와 아삭한 아스파라거스 구이를 가득 담아 영양 균형을 맞춘 데일리 웰빙 밀", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80" },
            { title: "청정 스마트 수경 재배 키친", description: "외부 병원균과 미세먼지가 차단된 실내 스마트 팜에서 깨끗하게 기른 샐러드용 채소 생산 라운지", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
            { title: "수제 견과 오트 우유 밀크 패키지", description: "물 한 방울 섞지 않고 통 아몬드와 귀리를 곱게 갈아 내어 섬유질과 불포화지방산을 농축한 비건 밀크 병", image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "비건 새벽 정기 구독 상담 의뢰",
        subtitle: "원치 않는 기피 식자재(예: 땅콩 알레르기 등), 배송 희망 주소 지역군을 적어 첫 체험 팩 50% 할인권을 발급받으세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "비건 밀박스 구독 예약"
        }
      }
    ]
  }
};
