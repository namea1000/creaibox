import { TemplateConfig } from "../registry";

export const FASHION_BEAUTY_TEMPLATES: Record<string, TemplateConfig> = {
  minimalist_fashion_boutique: {
    templateId: "minimalist_fashion_boutique",
    name: "아뜰리에 모노크롬 미니멀 부티크",
    category: "Fashion & Beauty",
    description: "시크한 모노톤 블랙과 맑은 석고 화이트 조화로 젠더리스 미니멀 실루엣 의류를 기품 있게 소개하는 패션 부티크 테마입니다.",
    image: "/templates/minimalist_fashion_boutique.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#18181b",     // 시크한 슬레이트 블랙
        secondary: "#f4f4f5",   // 라이트 매트 실버 그레이
        accent: "#71717a",      // 매트 차콜 그레이
        background: "#fafaf9",  // 정갈한 석고 화이트 미색
        surface: "#ffffff",     // 린넨 원단 오프화이트
        text: "#09090b"         // 시인성 높은 제트 블랙
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "장식을 걷어내고 실루엣과 원단 본연의 선명한 선만을 남기다",
        subtitle: "화려하게 반짝이는 유행성 장식 코디를 단호히 거부합니다. 모노크롬 아뜰리에 방식으로, 무채색의 린넨과 고탄성 울 소재 본연의 까슬까슬한 질감과 우아한 낙하 실루엣만으로 몸의 고유한 품격을 수호하는 파인 아웃도어 부티크입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
          ctaText: "뉴 시즌 실루엣 룩북",
          ctaLink: "#portfolio",
          features: [
            { text: "천연 자작나무와 무독성 규조토 흙벽 갤러리 인프라 속에서 의류의 촉감을 극대화해 감상" },
            { text: "패션 명문 에스모드 출신 수석 패턴 아티스트들의 입체 재단 선 드로잉 적용" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아뜰리에 컬렉션",
        subtitle: "미학적 여백 속에서 세련된 매력을 단단하게 수확하는 패션 에센셜 목록입니다.",
        content_data: {
          items: [
            {
              title: "모노크롬 단색 코트",
              description: "어깨 패드를 과감히 제거하여 부드럽게 어깨 선을 감싸며 떨어지는 오버사이즈 롱 울 코트입니다.",
              icon: "Award"
            },
            {
              title: "린넨 사워도우 셔츠",
              description: "물빛 광원을 품은 유기농 벨기에 린넨 원사를 100% 사용하여 땀 배출이 탁월하고 까슬한 드레스 셔츠입니다.",
              icon: "Leaf"
            },
            {
              title: "젠더리스 와이드 플리츠 팬츠",
              description: "허리 주름을 공학적으로 깊게 성형하여 활동 시 우아한 스윙 실루엣을 자아내는 와이드 팬츠입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "패션은 옷을 입는 기교가 아닌, 내 삶의 태도와 가치관을 무채색 실루엣으로 정직하게 증명하는 지적인 건축입니다",
        subtitle: "모든 의류는 대량 생산의 화학 접착제를 타지 않고 오직 정통 손바느질 마감과 천연 자개단추로 마감됩니다.",
        content_data: {
          description: "안녕하십니까. 모노크롬 부티크의 헤드 크리에이티브 디렉터입니다. 우리는 한두 번 세탁하면 실밥이 풀리고 형태가 비틀어지는 공장제 양산 스파(SPA) 브랜드를 단호히 거부합니다. 우리는 생두 로스팅을 하듯 원단을 정밀 선별하고, 패턴의 입체 각도를 0.1mm 단위로 재단하여 첫 착용만으로도 평생을 수호할 고유의 실루엣을 직조하겠습니다.",
          stats: [
            { label: "자체 제작 독점 패턴", value: "35건 완비" },
            { label: "부티크 정회원 수", value: "1,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "여백 가득한 화이트 큐브 룩북",
        subtitle: "의류의 실루엣과 오라가 고스란히 렌즈 너머로 번지는 모던 시크 전경입니다.",
        content_data: {
          items: [
            { title: "노출 콘크리트 전시장 단독 코트", description: "하얀 석고 조형물 옆에 디스플레이된 롱 코트가 사선 햇살을 받아 우아하게 선명함을 뽐내는 순간", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" },
            { title: "자작나무 행거 옷걸이 셔츠 라인업", description: "모노톤 셔츠와 와이드 팬츠가 일렬로 정갈하게 걸려 있어 위생적이고 기품 가득한 피팅 스페이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "검은 천연 자개단추 봉제 디테일 스냅", description: "울 원단 단추 구멍 옆에 전용 실로 단추를 장인의 손끝으로 튼튼하게 꿰매며 마감하는 스틸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "디렉터 피팅 컨설팅 예약 신청",
        subtitle: "방문 예정 일시, 키 및 평소 선호 체형 보완 고민, 소셜 프라이빗 비즈니스 룸 대관 여부를 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "부티크 피팅 예약"
        }
      }
    ]
  },

  luxury_cosmetics_brand: {
    templateId: "luxury_cosmetics_brand",
    name: "아우라 보태니컬 하이엔드 코스메틱",
    category: "Fashion & Beauty",
    description: "기품 있는 올리브 아로마 틸 그린과 눈부신 리넨 로즈 핑크, 그리고 무광 브론즈 골드가 어우러져 천연 유기농 에센스와 프리미엄 뷰티 솔루션을 전하는 테마입니다.",
    image: "/templates/luxury_cosmetics_brand.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#0f766e",     // 보태니컬 아로마 틸
        secondary: "#fdf2f8",   // 맑고 눈부신 로즈 크림
        accent: "#c5a880",      // 무광 브론즈 골드
        background: "#fafbfc",  // 깨끗한 위생 아쿠아 오프화이트
        surface: "#ffffff",     // 화장품 대리석 쇼케이스 화이트
        text: "#115e59"         // 시인성 높은 다크 그린 틸
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "화학 정제수를 단 1방울도 타지 않고 오직 100% 천연 로즈마리 수액으로 다진 안식",
        subtitle: "피부를 강박적으로 자극해 인위적으로 각질을 벗겨내는 일시적인 코스메틱이 아닙니다. 자연에서 생명력을 수확한 고기능성 올리브 오일과 천연 에센셜 성분의 결합으로 피부 자생력을 세포 깊숙한 곳에서 투명하게 정화하는 웰니스 코스메틱 브랜드입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "유기농 에센셜 오일 라인업",
          ctaLink: "#services",
          features: [
            { text: "유럽 유기농 공식 화장품 인증인 에코서트(ECOCERT) 기준 원료 100% 사용 보증" },
            { text: "천연 아로마 로즈마리 잎사귀 오일 함유로 사용 즉시 정서적 스트레스를 부드럽게 이완" }
          ]
        }
      },
      {
        section_type: "services",
        title: "코스메틱 프로그램",
        subtitle: "화학 보존제 전혀 없이 자연 생명력만으로 광채 피부를 완성하는 웰니스 세션입니다.",
        content_data: {
          items: [
            {
              title: "보태니컬 세럼 앰플 수액",
              description: "제주도 무농약 녹차 수액 85%에 히알루론산 단백질을 믹싱하여 건조하고 당기는 속건조를 즉각 해소합니다.",
              icon: "Droplet"
            },
            {
              title: "천연 올리브 아로마 크림",
              description: "스페인산 엑스트라 버진 올리브 오일 보습막을 씌워 밤사이 수분 유실률을 0% 오차 없이 수호하는 영양 크림입니다.",
              icon: "Heart"
            },
            {
              title: "허브 해독 아로마 스파 수액",
              description: "지친 발과 종아리 림프 순환을 돕는 유기농 국산 민트 소금 족욕 전용 어메니티 패키지 가이드입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "코스메틱은 단순히 주름을 가리는 화장이 아닌, 대자연이 선사한 미생물의 풍부한 보습 장벽을 내 피부 세포와 완벽히 융합하는 세포 과학입니다",
        subtitle: "모든 코스메틱 앰플은 합성 계면활성제, 인공 색소, 알코올 성분을 전면 배제해 안전합니다.",
        content_data: {
          description: "안녕하십니까. 아우라 보태니컬의 수석 연구소장입니다. 우리는 유통기한을 늘리기 위해 파라벤 등 독성 방부제를 쏟아붓고 피부 겉만 번들거리게 속여 트러블을 야기하는 저가 석유계 화장품을 단호히 거부합니다. 우리는 저온 진공 추출 공법을 가동해 열에 약한 식물성 비타민 성분을 고스란히 병에 봉인하였으며, 정갈한 위생 연구실 데이터 자체를 투명하게 공개해 신뢰를 다지겠습니다.",
          stats: [
            { label: "피부 트러블 알레르기 율", value: "0.00%" },
            { label: "보유 천연 특허 원료 수", value: "14가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "연구실 쇼케이스 & 아로마 스파",
        subtitle: "바라보는 것만으로도 자연 향기와 맑은 공기가 느껴지는 아늑한 뷰티 전경입니다.",
        content_data: {
          items: [
            { title: "아크릴 유리 선반 에센셜 화장품", description: "투명한 유리 보틀 병에 녹차 오일 수액이 채워져 핀 조명 빛 아래 보석처럼 진열된 모습", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80" },
            { title: "대리석 테이블 위 로즈마리 잎사귀", description: "맑은 유리 비커 안에 스파 솔트와 올리브 오일 앰플이 예쁘게 세팅된 사색적인 공간 코너", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "오일 세럼 방울 원심 분리 추출 스냅", description: "천연 장미 꽃잎을 압착하여 한 방울 한 방울 영양 엑기스 세럼을 스포이드 튜브에 담아내는 청결한 공정 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1:1 피부 타입 맞춤 상담 의뢰",
        subtitle: "현재 피부 트러블 상태 기재, 희망 화장품 샘플 신청 신청, 오프라인 아로마 스파 클래스 참여 여부를 작성해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "피부 맞춤 상담 신청"
        }
      }
    ]
  },

  editorial_model_portfolio: {
    templateId: "editorial_model_portfolio",
    name: "보그 에센셜 하이패션 에디토리얼",
    category: "Fashion & Beauty",
    description: "강렬한 카본 슬레이트 블랙과 우아한 크림 아이보리, 그리고 런웨이 선홍빛 레드 액센트가 결합하여 모델 포트폴리오와 패션 에디토리얼의 역동성을 전달하는 테마입니다.",
    image: "/templates/editorial_model_portfolio.png",
    theme: {
      fontFamily: "Outfit, Noto Serif KR, serif",
      colors: {
        primary: "#dc2626",     // 런웨이 크림슨 레드
        secondary: "#1c1917",   // 카본 슬레이트 다크블랙
        accent: "#c5a880",      // 브론즈 무광 골드
        background: "#09090b",  // 미제르 제트 블랙 암막
        surface: "#18181b",     // 런웨이 가죽 텍스처 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "카메라 셔터 소리 속 박제되는 전신의 육체적 선과 압도적인 눈빛의 카리스마",
        subtitle: "흔하디흔한 프로필 사진이 아닙니다. 파리 뉴욕 런웨이 패션 화보 방식을 차용하여, 짙은 흑백 명암 음영과 강렬한 레드 크림슨 포인트 샹들리에 아래서 당신이 지닌 고유의 입체적 윤곽선을 예술적 화보집으로 기록하는 하이패션 모델 포트폴리오 저널입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "하이패션 룩북 갤러리",
          ctaLink: "#portfolio",
          features: [
            { text: "보그(Vogue), 엘르(Elle) 협업 패션 전문 포토그래퍼들의 정밀 조명 3중주 테크닉 촬영" },
            { text: "체크인 시 샤넬, 디올 부티크 패션 디렉터들의 개인 체형 코디 코칭 라이브 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에디토리얼 에센셜",
        subtitle: "찰나의 표정과 바디 실루엣을 아티스틱하게 담아내는 모델 룩북 세션입니다.",
        content_data: {
          items: [
            {
              title: "모노톤 입체 포트레이트",
              description: "조명의 방향을 사선 45도로 완전히 눕혀 얼굴의 뼈 골격 윤곽선과 깊은 눈빛의 그늘을 예술적으로 포착합니다.",
              icon: "Award"
            },
            {
              title: "런웨이 액티브 모션 샷",
              description: "모델이 바람에 흩날리는 와이드 셔츠 휘날림 속에 거침없이 워킹하는 생동감 넘치는 패션 컷입니다.",
              icon: "Zap"
            },
            {
              title: "브론즈 메탈 뷰티 클로즈업",
              description: "매혹적인 무광 립스틱 질감과 귀걸이 황동 반사광을 초정밀 매크로 렌즈로 담아내는 뷰티 스냅입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "에디토리얼 화보는 예쁘장한 미소를 자랑하는 광고판이 아닌, 인물 고유의 우아한 그늘과 비대칭 턱선조차 개성적 예술로 선언하는 캔버스입니다",
        subtitle: "모든 촬영 데이터는 왜곡이 없는 전통 풀프레임 DSLR 85mm 렌즈로 정교하게 촬영됩니다.",
        content_data: {
          description: "안녕하십니까. 보그 에센셜 포트폴리오의 수석 포토 아티스트입니다. 우리는 어색한 과보정과 필터 필터 마모로 얼굴 이목구비를 다 날려버려 영혼이 증발해버린 미니홈피 프로필 사진을 단호히 거부합니다. 우리는 거친 피부 모공의 디테일과 한 조각 쓸쓸한 고독의 눈빛조차 그대로 보존하여, 당신이라는 한 사람의 깊은 기품을 럭셔리 예술로 격상해 드리겠습니다.",
          stats: [
            { label: "촬영 완료 패션 모델", value: "350명+" },
            { label: "보유 전문 대형 텅스텐 조명", value: "12세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "화려한 런웨이 백스테이지 & 룩북",
        subtitle: "사진 한 장만으로도 파리 패션위크 음악 소리가 들리는 듯한 매혹적 갤러리입니다.",
        content_data: {
          items: [
            { title: "레드 카펫 런웨이 위 워킹 모델", description: "흩날리는 은빛 스팽글 드레스와 강렬한 눈빛이 붉은 샹들리에 조명 빛을 만나 포효하는 활기 가득한 순간", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
            { title: "분장실 거울 앞 립스틱 메이크업 코너", description: "수십 개의 꼬마 백열전구 조명이 켜진 대형 거울 아래 화장품 브러쉬와 립스틱 병이 세련되게 장식된 백스테이지", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "황동 체인 목걸이 흑백 클로즈업", description: "쇄골 뼈 라인 위에 반짝이는 굵은 메탈 목걸이가 그늘 음영을 뿜으며 시크하게 걸린 장인의 수기 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "화보 촬영 및 콘셉트 조율 신청",
        subtitle: "촬영 목적(개인소장/모델 데뷔/오디션), 희망 패션 코디 콘셉트, 선호하는 흑백/칼라 비중을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "하이패션 화보 촬영 예약"
        }
      }
    ]
  },

  vintage_streetwear_shop: {
    templateId: "vintage_streetwear_shop",
    name: "서브컬쳐 아카이브 스트리트웨어",
    category: "Fashion & Beauty",
    description: "인더스트리얼하고 현대적인 카본 블랙과 타오르는 아스팔트 레몬 주황, 그리고 카키 올리브 배합이 그래피티 스트리트 힙합 패션을 대담하게 전달하는 테마입니다.",
    image: "/templates/vintage_streetwear_shop.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#ea580c",     // 네온 그래피티 오렌지
        secondary: "#3f3f46",   // 낡은 시멘트 슬레이트 그레이
        accent: "#16a34a",      // 서브컬쳐 카키 그린
        background: "#0c0a09",  // 밤골목 서브웨이 차콜 블랙
        surface: "#1c1917",     // 낡은 철제 캐비넷 브라운
        text: "#ffffff"         // 시인성 극대화 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "규격화된 화이트 칼라 정장을 단호히 거부하고, 언더그라운드 길거리 소음을 입다",
        subtitle: "대형 마트에서 찍어 파는 얌전하고 심심한 기성복에 만족하셨나요? 서브컬쳐 아카이브 방식으로, 1990년대 힙합 턴테이블 음악 영감과 오버사이즈 피그먼트 워싱 후드티, 그리고 타오르는 네온 주황 스프레이 그래피티가 결합하여 개성적인 거리의 에너지를 폭발시키는 스트리트웨어 전용관입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1508427987370-763aa473aee8?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 드랍 아카이브",
          ctaLink: "#services",
          features: [
            { text: "피그먼트 워싱 가공을 3회 거쳐 빈티지한 촉감을 자아내는 750g 고중량 오버핏 후드 완비" },
            { text: "유럽 스케이트보드 크루들과의 독점 그래피티 레터링 티셔츠 한정판 상시 구비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "스트리트 웨어 라인업",
        subtitle: "타인의 시선 따위 가볍게 넘겨버리며 청춘의 자유를 어필하는 힙스터 목록입니다.",
        content_data: {
          items: [
            {
              title: "피그먼트 750g 오버핏 후드",
              description: "고중량 코튼 원단 위에 빈티지 피그먼트 염색 처리를 하여 입을수록 자연스러운 워싱 결이 나타나는 후드입니다.",
              icon: "Flame"
            },
            {
              title: "와이드 카고 디스트로이드 팬츠",
              description: "포켓을 기하학적으로 배치하고 밑단을 거칠게 찢어내어 스케이트보드 라이딩 시 짜릿함을 주는 팬츠입니다.",
              icon: "Zap"
            },
            {
              title: "네온 오렌지 버킷 햇 & 체인",
              description: "스프레이 오렌지 네온 컬러에 자수 서브컬쳐 문양을 가미해 클럽 파티 조명 조명 아래 빛나는 모자입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스트리트웨어는 단순히 캐주얼한 옷을 입는 것이 아닌, 정장에 갇혀 영혼이 박제된 빌딩 숲에 소리 없는 자유의 낙서를 그리는 저항입니다",
        subtitle: "모든 한정판 드랍(Drop) 상품은 복제 복사 방지를 위해 의류 뒷면에 홀로그램 시리얼 넘버가 박제됩니다.",
        content_data: {
          description: "안녕하십니까. 서브컬쳐 아카이브의 총괄 스트리트 디렉터입니다. 우리는 누구나 다 똑같이 입는 유니클로식 몰개성 클론룩 문화를 단호히 거부합니다. 우리는 스케이트보드, 브레이크댄스, 길거리 드로잉 그래피티 크루들의 소란스럽고 자유로운 정서 자체를 섬유 속에 주입하며, 묵직하고 반항적인 거리의 예술을 당신의 옷장 속에 전송하겠습니다.",
          stats: [
            { label: "출고 완료 한정판 의류", value: "5,800개 돌파" },
            { label: "정기 협력 그래피티 작가", value: "8명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "거리의 그래피티 벽면 & 드랍 숍",
        subtitle: "사진 한 장만으로도 거친 힙합 음악 소리가 터져 나올 듯한 강렬한 전경입니다.",
        content_data: {
          items: [
            { title: "그래피티 벽 앞 보드를 쥔 힙스터", description: "네온 주황색 스프레이 글자가 낙서된 시멘트 벽면 앞에 서서 카고 바지를 입고 포즈를 취한 스냅", image: "https://images.unsplash.com/photo-1508427987370-763aa473aee8?auto=format&fit=crop&w=600&q=80" },
            { title: "철제 락커룸과 스케이트보드 거치대", description: "실내 매장 한편에 녹슨 철제 캐비넷이 세워져 있고 힙한 스웨트 셔츠들이 빈티지하게 진열된 모습", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "피그먼트 후드 워싱 원단 근접 샷", description: "수천 번 마찰되어 부드러운 회색 무늬가 곱게 드러난 750g 고중량 코튼 시보리 봉제 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "드랍 소식 알림 및 크루 가입",
        subtitle: "매달 진행되는 한정 수량 스트리트 드랍 캘린더 SMS 신청, 그래피티 협업 제안은 아래에 적어 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "드랍 뉴스레터 구독"
        }
      }
    ]
  },

  clean_skincare_clinic: {
    templateId: "clean_skincare_clinic",
    name: "스킨세라피 오가닉 에스테틱 클리닉",
    category: "Fashion & Beauty",
    description: "싱그러운 숲속 세이지 그린과 포근한 린넨 아이보리, 그리고 맑고 청량한 클린 블루 액센트로 고독한 1인 에스테틱 클리닉의 힐링을 안내하는 테마입니다.",
    image: "/templates/clean_skincare_clinic.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#16a34a",     // 싱그러운 포레스트 그린
        secondary: "#f0fdf4",   // 맑고 깨끗한 아침 채소 그린
        accent: "#0284c7",      // 퓨어 워터 블루
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 위생 세라믹 요리대 화이트
        text: "#14532d"         // 눈이 편안한 올리브 그린 차콜
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "복잡하고 자극적인 레이저를 덜어내고, 식물 식물 성분만으로 피부를 해독하다",
        subtitle: "따갑고 아픈 피부 레이저 시술에 상처받으셨나요? 스킨세라피 방식으로, 유기농 알로에와 생바질 수액을 활용하여 예민해진 홍조와 피부 장벽을 편안하게 이완하고, 따뜻한 핀 포인트 조명 아래서 1인 단독 힐링 마사지를 제공하는 프리미엄 에스테틱 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80",
          ctaText: "1인 웰니스 프로그램 예약",
          ctaLink: "#contact",
          features: [
            { text: "천연 아로마 카모마일 오일을 피부 모공 속 깊이 들이마시게 돕는 스팀 기화 살균 가동" },
            { text: "화학 정제 설탕 및 인공 감미료 전혀 없이 매실 효소 원액으로 빚어낸 오가닉 웰컴 에이드" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에스테틱 큐레이션",
        subtitle: "피부 근막의 뭉침을 해소하고 전신의 림프를 투명하게 순환시키는 케어 라인업입니다.",
        content_data: {
          items: [
            {
              title: "바질 수액 진정 스킨 케어",
              description: "차가운 생바질 엽록소 세럼을 도포하여 햇빛에 노출된 피부 온도를 즉시 3.5도 낮추고 피부 장벽을 수호합니다.",
              icon: "Leaf"
            },
            {
              title: "데콜테 근막 이완 마사지",
              description: "목덜미와 어깨 쇄골 라인의 뭉친 어혈을 천연 라벤더 오일 윤활로 부드럽게 재단하여 전신 피로를 리셋합니다.",
              icon: "Heart"
            },
            {
              title: "1인 단독 편백 스파 사우나 사우나",
              description: "피톤치드가 뿜어지는 개인 편백나무 방 안에서 아로마 증기를 호흡하여 몸속 노폐물 배출을 유도합니다.",
              icon: "Droplet"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "에스테틱은 인위적으로 주름을 팽팽하게 펴는 성형이 아닌, 지친 몸과 마음에 아늑한 쉼터를 선물하여 자연스러운 자생 윤기를 이끌어내는 치유입니다",
        subtitle: "모든 침구 린넨과 스파 가운은 고객 1인이 다녀갈 때마다 100도 열풍 살균 세탁을 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 스킨세라피 에스테틱의 오너 스킨 테라피스트입니다. 우리는 기계로 피부를 깎아내어 피부를 얇고 예민하게 만들고 비싼 패키지 결제를 유도하는 상업용 체인 살롱을 단호히 거부합니다. 우리는 인도 숲속 요가원에서 영감을 얻은 친자연 인테리어 속에서, 당신의 호흡 템포에 온전히 대응하는 극진한 황후의 1:1 피부 안식을 책임지겠습니다.",
          stats: [
            { label: "회원 피부 장벽 개선율", value: "98.2%" },
            { label: "보유 천연 천연 에센셜 오일", value: "24종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "싱그러운 편백 사우나실 & 살롱",
        subtitle: "사진만 보아도 상쾌한 피톤치드 향취가 코끝에 번지는 안락한 친자연 공간 전경입니다.",
        content_data: {
          items: [
            { title: "아늑한 1인 베드 마사지 스페이스", description: "따스한 노란 간접 조명 아래 하얀 타월과 아로마 향초가 정갈하게 세팅된 프라이빗 1인 룸", image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80" },
            { title: "편백나무 가구 야외 족욕 탕 코너", description: "푸른 식물들이 주변을 둘러싸고 모락모락 김이 솟아올라 발의 피로를 기분 좋게 리셋하는 탕", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "생바질 오일과 도자 앰플 보틀 병", description: "맑은 백토 도자기 안에 바질 잎과 천연 추출 앰플 스포이드가 세련되게 데코레이션된 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1인 프라이빗 룸 예약 신청",
        subtitle: "방문 희망 날짜, 예약 세션 선택(피부진정/근막마사지/스파코스), 평소 앓고 계신 향 알레르기가 있다면 적어 예약해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "에스테틱 1인 예약"
        }
      }
    ]
  },

  handmade_jewelry_atelier: {
    templateId: "handmade_jewelry_atelier",
    name: "메종 드 브론즈 수제 쥬얼리 공방",
    category: "Fashion & Beauty",
    description: "고풍스러운 다크 마호가니 브라운과 맑고 아늑한 샴페인 브론즈 골드, 그리고 오래된 석고 백색 배합이 클래식한 수제 주얼리와 금속 공예의 기품을 전하는 테마입니다.",
    image: "/templates/handmade_jewelry_atelier.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#4a3525",     // 깊은 황동 마호가니 브라운
        secondary: "#fdf8f5",   // 오래된 양장지 아이보리 크림
        accent: "#d4af37",      // 황금빛 샴페인 브론즈 골드
        background: "#faf6f0",  // 안락한 조명 크림 웜베이지
        surface: "#ffffff",     // 정갈한 세공 책상 화이트
        text: "#2b1e16"         // 묵직한 가죽 슬레이트 브라운
      },
      borderRadius: "rounded-sm",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "공장제 프레스기가 아닌, 세공사의 쇠망치 타격과 칼날 세공이 직조하는 은빛 영혼",
        subtitle: "몇 달 끼면 도금이 벗겨지고 알레르기를 유발하는 싸구려 양산 주얼리에 영혼을 잃으셨나요? 메종 드 브론즈 방식으로, 실버 925와 18K 순금을 직접 가마에 녹이고 세공 작업대 위에서 정교한 쇠망치질로 두드려, 겉은 빈티지하지만 평생 변치 않을 나만의 기하학적 수제 반지와 목걸이를 빚어내는 아뜰리에입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "수제 주얼리 아카이브",
          ctaLink: "#services",
          features: [
            { text: "아티스트가 직접 가죽 망치와 보석 조각도로 반지에 이니셜과 영혼의 낙관을 새기는 맞춤 가이드" },
            { text: "은빛 925 실버 고유의 산화 방지를 수호하는 특수 천연 왁스 광택제 코팅 마감 수여" }
          ]
        }
      },
      {
        section_type: "services",
        title: "주얼리 에센셜",
        subtitle: "금속의 차가운 물성 위에 따뜻한 숨결을 불어넣는 금속 공예 목록입니다.",
        content_data: {
          items: [
            {
              title: "망치 타격 은반지 제작",
              description: "925 실버 바를 토치로 열을 가해 둥글게 말고, 망치로 표면을 두드려 오목볼록한 물결 무늬 질감을 성형합니다.",
              icon: "Flame"
            },
            {
              title: "천연 원석 베젤 세팅",
              description: "가공되지 않은 러프한 에메랄드, 사파이어 원석 테두리를 은선으로 정교하게 매칭해 감싸 고정하는 공예입니다.",
              icon: "Sparkles"
            },
            {
              title: "황동 빈티지 펜던트 조각",
              description: "황동 판 위에 보석 조각도로 음각 기하학적 레터링을 파내어 묵직한 빈티지 아우라의 목걸이를 완성합니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "주얼리는 단순히 재력을 과시하는 사치품이 아닌, 주인의 손가락 체온과 세공사의 망치질 시간이 공명하여 나만의 은밀한 추억을 수호하는 징표입니다",
        subtitle: "모든 금속 공예 강습은 매끄러운 안전을 위해 가죽 앞치마와 보안경, 매립 연기 흡입 필터를 완비합니다.",
        content_data: {
          description: "안녕하십니까. 메종 드 브론즈의 마스터 금속 세공사입니다. 우리는 종이처럼 얇게 도금하여 금방 변색되고 피부에 독성을 풍기는 상업용 악세사리를 단호히 거부합니다. 우리는 1000도 가마에서 직접 은을 녹여 도톰하게 두께를 주고, 망치 타격으로 금속 내부 밀도를 높여 평생 형태가 찌그러지지 않고 주인의 흔적을 머금을 명품을 빚어내겠습니다.",
          stats: [
            { label: "완성한 금속 커플링 수", value: "2,400쌍+" },
            { label: "보유 수입 보석 조각도", value: "14세트" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "세공 작업대 & 은빛 반지 갤러리",
        subtitle: "포근한 나무 향과 무거운 쇳가루 냄새가 고스란히 섞여 흐르는 작업실 전경입니다.",
        content_data: {
          items: [
            { title: "가스 토치와 황동 세공 테이블", description: "황동 스탠드 불빛 아래 핀셋과 가죽 망치, 쇠망치가 정갈하게 정렬된 노련한 세공사의 책상 좌석", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
            { title: "오목볼록 은반지 보석 박스 코너", description: "원목 보석함 가죽 안감 위에 천연 루비 원석이 박힌 은빛 반지들이 기품 있게 진열된 갤러리 코너", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "은선을 토치로 불꽃 용접하는 스냅", description: "붉은 가스 불꽃이 불꽃을 뿜고 땜납이 녹아내려 반지 접합부에 스며드는 극적인 세공 장인의 조리 현장", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원데이 클래스 및 제작 의뢰",
        subtitle: "원데이 클래스(커플링/목걸이), 제작 희망 원석 종류, 방문 날짜 및 인원 수를 기재해 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "세공 클래스 예약 신청"
        }
      }
    ]
  },

  mens_barbershop_grooming: {
    templateId: "mens_barbershop_grooming",
    name: "클래식 바버숍 에센셜 그루밍",
    category: "Fashion & Beauty",
    description: "묵직하고 신사적인 다크 마호가니 브라운과 클래식 크림 아이보리, 골든 브론즈 액센트로 신사의 품격 높은 쉐이빙과 정교한 이발 서비스를 소개하는 바버숍 테마입니다.",
    image: "/templates/mens_barbershop_grooming.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#3f2b1d",     // 클래식 마호가니 가죽 브라운
        secondary: "#fdfbf7",   // 맑고 깨끗한 린넨 셰이빙 크림
        accent: "#c5a880",      // 황동 브라스 바버 골드
        background: "#0d0907",  // 신사적이고 묵직한 다크초콜릿 블랙
        surface: "#1a120b",     // 안락한 가죽 의자 다크 브라운
        text: "#f5ece1"         // 가독성 높은 온화한 베이지 크림
      },
      borderRadius: "rounded-sm",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "0.1mm 오차 없는 정교한 클리퍼 타격선과, 뜨거운 스팀 타월 쉐이빙의 극치",
        subtitle: "어수선하고 정신없는 동네 미용실을 단호히 거부합니다. 1920년대 런던 새빌 로우 신사 클럽 스타일을 재현하여, 안락한 천연 가죽 의자에 누워 뜨거운 스팀 스팀 타월로 모공을 열고, 날카로운 일자 면도칼로 잔털 하나 없이 얼굴 선을 깎아내는 정통 영국식 바버숍 그루밍 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
          ctaText: "신사 그루밍 코스 예약",
          ctaLink: "#contact",
          features: [
            { text: "헤어 라인과 이마 잔털 각도를 얼굴 비례에 맞게 공학적으로 디자인하는 헤어 커트" },
            { text: "천연 시어버터 함유 영국 수입 쉐이빙 소프와 저자극 오소리털 브러쉬 전면 사용 보증" }
          ]
        }
      },
      {
        section_type: "services",
        title: "그루밍 메뉴",
        subtitle: "신사의 머리끝부터 수염선까지 오차 없이 깔끔하게 조율하는 에센셜 서비스입니다.",
        content_data: {
          items: [
            {
              title: "클래식 사이드파트 커트",
              description: "바리깡과 정밀 빗질 가위질로 옆머리 페이드(Fade) 음영 강도를 조율해 깔끔한 가르마 머리 스타일을 연출합니다.",
              icon: "Award"
            },
            {
              title: "정통 일자면도 핫 스팀 쉐이빙",
              description: "뜨거운 타월 찜질로 수염을 부드럽게 이완하고 수제 거품을 도포하여 일자 칼날로 얼굴 윤곽 면도를 단행합니다.",
              icon: "Flame"
            },
            {
              title: "두피 해독 스칼프 스파 스파",
              description: "시원한 티트리 멘톨 에센셜 오일로 두피 각질을 청정 세척하고 림프 마사지로 머리를 해독합니다.",
              icon: "Droplet"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "바버숍은 단순히 머리를 짧게 깎는 미용실이 아닌, 고단한 하루를 보낸 신사가 가죽 의자에 파묻혀 진정한 침묵과 기품을 회복하는 아날로그 휴식처입니다",
        subtitle: "모든 쉐이빙 면도칼 날은 감염 우려를 완전히 0%로 차단하기 위해 고객마다 1회용 날로 즉시 교체합니다.",
        content_data: {
          description: "안녕하십니까. 클래식 바버숍의 헤드 바버 마스터 대표입니다. 우리는 유행하는 가벼운 스타일만 대충 따라 하여 머리가 붕 뜨고 지저분해지는 미용 기술을 단호히 거부합니다. 우리는 모발의 굵기와 두피 가마의 방향을 면밀히 해독하고, 신사적인 마호가니 원목 인프라 속에서 당신의 지적인 카리스마를 온전히 수호해 드리겠습니다.",
          stats: [
            { label: "누적 대접 완료 신사 수", value: "3,500명" },
            { label: "보유 수입 명품 클리퍼", value: "8세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "클래식 바버 의자 & 황동 가위",
        subtitle: "사진 한 장만으로도 은은한 스킨 냄새와 빗질 소리가 고스란히 귀에 흐르는 듯한 갤러리입니다.",
        content_data: {
          items: [
            { title: "오리지널 천연 가죽 바버 의자", description: "황동 기어 레버가 장착되어 있고 폭신한 가죽 쿠션이 윤기를 머금은 1인 전용 다이닝 라운지", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80" },
            { title: "은빛 일자 면도칼과 브러쉬 세트", description: "대리석 선반 위에 영국제 쉐이빙 소프 볼과 부드러운 오소리 브러쉬가 세련되게 세팅된 세면기 코너", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "구레나룻 가위질 페이드 정밀 조리 스냅", description: "두꺼운 머리카락 선을 가위 날 끝으로 0.1mm 단위로 섬세하게 터치하며 라인을 성형하는 바버의 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "바버 의자 및 코스 실시간 예약",
        subtitle: "방문 예정 일시, 담당 바버 선택, 희망 서비스(헤어커트/풀코스/헤드스파)를 기재해 예약을 진행해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "바버숍 서비스 예약"
        }
      }
    ]
  },

  bridal_couture_studio: {
    templateId: "bridal_couture_studio",
    name: "벨 에포크 프리미엄 웨딩 드레스",
    category: "Fashion & Beauty",
    description: "눈이 멀 듯 눈부신 화이트 펄 실크와 사랑스러운 파스텔 로즈 베이지, 그리고 은은한 샴페인 브론즈 골드가 결합하여 일생 단 한 번의 품격 높은 웨딩 룩을 완성하는 드레스 살롱 테마입니다.",
    image: "/templates/bridal_couture_studio.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#be123c",     // 매혹적인 라즈베리 로즈
        secondary: "#ffe4e6",   // 맑고 눈부신 로즈 크림
        accent: "#d4af37",      // 샴페인 브론즈 골드
        background: "#fafaf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 린넨 드레스 옷장 화이트
        text: "#1c1917"         // 시인성 높은 다크 초콜릿 카본
      },
      borderRadius: "rounded-3xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "일생에서 가장 찬란한 하루, 오직 신부만을 위해 빛나는 실크 드레스의 여왕",
        subtitle: "공장에서 나일론 실로 대량 찍어내어 부스스한 저가 대여 웨딩드레스를 단호히 거부합니다. 벨 에포크 아뜰리에 방식으로, 프랑스 수입 로열 미카도 실크 원단과 한 땀 한 땀 장인이 바느질한 벨기에 레이스 비즈만을 고집하여 신부의 체형 실루엣을 기하학적으로 완벽 수호하는 격조 높은 웨딩드레스 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80",
          ctaText: "드레스 피팅 살롱 예약",
          ctaLink: "#contact",
          features: [
            { text: "신부의 쇄골 뼈 각도와 골반 라인을 정밀 측정하여 가려주는 입체 드레싱 핏 큐레이팅" },
            { text: "피팅 시 시원하고 고급스러운 무알콜 웰컴 샴페인과 수제 거품 쿠키 서비스 무상 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "브라이달 코스",
        subtitle: "순백의 신부를 일생 일대 최고의 예술 예술 명작으로 격상시키는 살롱 프로그램입니다.",
        content_data: {
          items: [
            {
              title: "미카도 실크 라인 드레스",
              description: "은은한 우유 빛 무광택 미카도 실크 원단을 100% 사용하여 묵직하고 귀족적인 에스테틱 실루엣을 자아냅니다.",
              icon: "Award"
            },
            {
              title: "벨기에 수제 레이스 비즈 비즈",
              description: "프랑스 자수 장인이 한 땀 한 땀 엮어 낸 입체적인 꽃잎 레이스 위에 크리스탈 비즈를 수놓아 반짝임을 더했습니다.",
              icon: "Sparkles"
            },
            {
              title: "1:1 프라이빗 드레싱 피팅",
              description: "대형 3면 입체 거울과 따스한 무대 샹들리에 조명이 갖춰진 단독 룸에서 여유롭게 드레스를 입어보는 코스입니다.",
              icon: "Heart"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "웨딩드레스는 하루 입고 반납하는 단순한 옷이 아닌, 여왕처럼 당당하게 버진로드를 걷는 신부의 일생 가장 빛나는 기품을 수호하는 숭고한 약속입니다",
        subtitle: "모든 피팅 룸은 타인과의 동선이 마주치지 않도록 2시간 단위 단독 1팀 100% 프라이빗 예약제로 운영됩니다.",
        content_data: {
          description: "안녕하십니까. 벨 에포크 드레스 아뜰리에의 총괄 원장입니다. 우리는 원단이 낡고 형태가 비틀어져 싼 티가 흘러넘치는 흔한 패밀리형 드레스 대여점을 단호히 거부합니다. 우리는 매 시즌 파리 브라이달 위크에서 직접 공수해 온 최신 컬렉션을 위생적으로 밀폐 관리하며, 당신만의 감동적인 결혼식을 위해 단 하나의 흐트러짐 없는 실루엣을 바치겠습니다.",
          stats: [
            { label: "만족한 신부 커플 수", value: "1,500쌍+" },
            { label: "보유 수입 명품 드레스 수", value: "85종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "순백의 드레스 쇼룸 & 피팅 룸",
        subtitle: "보는 것만으로도 행복 호르몬과 기품이 가득 전해지는 우아한 공간 갤러리입니다.",
        content_data: {
          items: [
            { title: "3면 대형 거울 아래 실크 드레스", description: "샹들리에 노란 전등 빛을 받아 우아하게 퍼지는 드레스 자락과 하얀 장미꽃들이 세련되게 세팅된 피팅 존", image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80" },
            { title: "프랑스 수입 벨벳 쇼파 거실 살롱", description: "대나무 가벽 너머로 신랑이 편안히 앉아 에스프레소를 마시며 드레스 오픈을 기다리는 아늑한 대기실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "드레스 진주 비즈 봉제 디테일 스냅", description: "화사한 레이스 위에 스와로브스키 비즈 알갱이를 핀셋으로 집어 바느질로 꿰매어 올리는 장인의 수기 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "프라이빗 피팅 살롱 상담 예약",
        subtitle: "결혼식 예정 일시, 희망하는 드레스 스타일(벨라인/머메이드/엠파이어), 동반 피팅 참석 인원수를 기재해 예약 신청을 완료해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "드레스 피팅 예약"
        }
      }
    ]
  },

  nail_art_salon: {
    templateId: "nail_art_salon",
    name: "펄 네일 아티스틱 네일 디자인",
    category: "Fashion & Beauty",
    description: "화사하고 달콤한 파스텔 피치 핑크와 깨끗한 린넨 아이보리, 그리고 맑고 투명한 진주 펄 포인트 조화가 네일 아트의 미학적 플레이팅을 보여주는 럭셔리 네일 테마입니다.",
    image: "/templates/nail_art_salon.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#db2777",     // 매혹적인 로즈 핑크 펄
        secondary: "#fdf2f8",   // 소프트 피치 베이지
        accent: "#fbbf24",      // 반짝이는 마카롱 골드
        background: "#fafaf9",  // 정갈한 대리석 오프화이트
        surface: "#ffffff",     // 깨끗한 네일 작업대 화이트
        text: "#1c1917"         // 시인성 높은 다크 초콜릿 카본
      },
      borderRadius: "rounded-xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "손끝 1cm 위에 펼쳐지는 섬세한 진주 펄 입체 아트와 정직한 위생 케어",
        subtitle: "공장에서 기계로 대충 찍어내어 손톱 손상을 유발하는 가공 네일 스티커를 단호히 거부합니다. 펄 네일 아티스트 방식으로, 저독성 친환경 비건 젤 네일 오일과 세계 3대 스와로브스키 파츠만을 아낌없이 고집하여 손톱 건강을 지키며 기품을 돋보이게 빚는 프리미엄 네일 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1604654894610-df4906b1126a?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 네일 디자인 캘린더",
          ctaLink: "#services",
          features: [
            { text: "화학 독성 수지 프탈레이트를 전혀 타지 않아 소화불량 및 두통 우려 제로 젤 네일 원액 100% 사용" },
            { text: "음식이 닿는 식기처럼 1회용 파일을 전면 배치하고 강습 전 200도 초고온 가위 살균 건조 필터링" }
          ]
        }
      },
      {
        section_type: "services",
        title: "네일 에센셜",
        subtitle: "손가락의 윤곽과 피부 톤을 최대로 어필하는 아티스틱한 손톱 케어 목록입니다.",
        content_data: {
          items: [
            {
              title: "스와로브스키 진주 파츠 아트",
              description: "우유 빛깔 천연 진주와 은빛 큐빅 조각들을 손톱 끝에 올려 튼튼한 탑 젤 오일로 구워내 기품을 뿜어냅니다.",
              icon: "Sparkles"
            },
            {
              title: "비건 오가닉 손톱 영양 케어",
              description: "지치고 찢어진 손톱 장벽을 보호하기 위해 해조류 단백질 영양 수액과 아로마 오일을 도포해 정밀 마사지합니다.",
              icon: "Heart"
            },
            {
              title: "수제 유리네일 입체 드로잉",
              description: "빛의 각도에 따라 오묘하게 홀로그램 무늬를 반사하는 얇은 오로라 필름을 손톱 마디 위에 밀착 시공합니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "네일 아트는 손톱을 화려하게 칠해 겉만 가리는 기교가 아닌, 10개의 손끝 관절에 작고 찬란한 보석 살롱을 선물하여 매일 마주하는 내 손 앞에 행복을 안겨주는 미학입니다",
        subtitle: "모든 네일 아티스트들은 평균 8년차 이상의 경력을 보유한 국가 공인 면허 소지자들입니다.",
        content_data: {
          description: "안녕하십니까. 펄 네일 살롱의 헤드 아티스트입니다. 우리는 몇 분 만에 대충 기계로 다듬어 손톱 껍질 통증과 큐티클 염증을 유발하는 무책임한 가성비 샵을 단호히 거부합니다. 우리는 개인별 손톱 곡률과 각도를 0.1mm 단위로 섬세하게 줄질하여, 젤네일이 손톱에서 4주 동안 밀착되어도 형태 왜곡 없이 튼튼하게 영롱함을 사수해 드리겠습니다.",
          stats: [
            { label: "이달의 완판 수제 디자인 수", value: "35가지" },
            { label: "소속 수석 디자이너 수", value: "6명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "영롱한 진주 젤 네일 & 쥬얼리 쇼룸",
        subtitle: "보는 것만으로도 오감이 아기자기하게 설레는 뷰티 공간 전경입니다.",
        content_data: {
          items: [
            { title: "3면 조명 아래 반짝이는 젤네일 컷", description: "핑크빛 진주 큐빅이 박힌 우아한 손끝이 대리석 테이블 위에서 보석처럼 윤기를 뿜어내는 순간", image: "https://images.unsplash.com/photo-1604654894610-df4906b1126a?auto=format&fit=crop&w=600&q=80" },
            { title: "원목 진열장 속 다채로운 비건 매니큐어", description: "화학 방부제가 배제된 오가닉 네일 에센스 병들이 무지개처럼 세련되게 정렬된 카운터 쇼케이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "큐티클 니퍼 가공 손끝 조리 스냅", description: "은빛 전용 가위를 쥐고 손가락 거스러미 피부 각질을 단 0.1mm의 오차 없이 깔끔하게 커팅하는 디자이너의 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "네일 디자인 사전 상담 예약",
        subtitle: "방문 예정 일시, 선호하시는 아티스트 지정 여부, 젤 네일 오일 오프 유무를 적어 예약 신청을 완료하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "네일 아트 예약 신청"
        }
      }
    ]
  },

  organic_hair_salon: {
    templateId: "organic_hair_salon",
    name: "아뜰리에 에코 오가닉 헤어살롱",
    category: "Fashion & Beauty",
    description: "싱그러운 허브 아로마 세이지 그린과 포근한 크래프트 라이트 베이지, 그리고 맑고 깨끗한 아침 공기 화이트 조화가 헤어 케어와 두피 치유의 가치를 전하는 친자연 테마입니다.",
    image: "/templates/organic_hair_salon.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#15803d",     // 싱그러운 가든 숲속 그린
        secondary: "#f0fdf4",   // 청량한 아침 이슬 그린
        accent: "#d97706",      // 앰버 오렌지 시트러스
        background: "#fafcfb",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 정갈하고 깨끗한 위생 거울대
        text: "#14532d"         // 눈이 편안한 올리브 그린 차콜
      },
      borderRadius: "rounded-2xl",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "독한 암모니아 냄새와 눈 시림을 덜어내고, 천연 식물 추출 약초로 모발을 물들이다",
        subtitle: "독한 알칼리 약품에 손상되어 개털처럼 갈라진 모발에 고통받고 계시진 않나요? 아뜰리에 에코 방식으로, 무농약 녹차 수액 85%와 올리브 천연 단백질을 믹싱하여 두피 자극과 머리 빠짐 우려 없이 윤기를 수호하는 프리미엄 오가닉 헤어 케어 솔루션 센터입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오가닉 헤어 헤드스파 클래스",
          ctaLink: "#services",
          features: [
            { text: "유기농 허브 에센셜 오일 함유 샴푸 사용으로 샴푸 마사지 시 정서적 스트레스 이완 서비스 무상 제공" },
            { text: "화학 실리콘, 암모니아 성분을 전면 철거하여 소화와 눈이 편안한 청정 웰빙 미학 사양" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에코 헤어 메뉴",
        subtitle: "모발 본래의 탄력과 큐티클 단백질 장벽을 안전하게 수호하는 클리닉 목록입니다.",
        content_data: {
          items: [
            {
              title: "천연 아로마 헤드스파 스파",
              description: "티트리와 민트 오일 앰플을 두피 모공 속에 정밀 도포하고 스팀 가습기로 묵은 각질을 청정 해독합니다.",
              icon: "Droplet"
            },
            {
              title: "올리브 단백질 모발 영양 케어",
              description: "갈라지고 부서진 모발 표면 틈새에 유기농 아몬드 밀크 단백질 입자를 열처리 용해하여 뼈대를 복구합니다.",
              icon: "Heart"
            },
            {
              title: "약초 엑기스 오가닉 천연 염색",
              description: "암모니아 없는 약초 가루와 유기농 수액만을 믹싱하여 두피 가려움 없이 맑게 새치와 컬러를 연출합니다.",
              icon: "Leaf"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "헤어 디자인은 머리를 짧게 자르는 기술이 아닌, 모발 고유의 생명력과 두피 모공을 온전히 보존하여 자연스럽고 세련된 세련된 풍성함을 빚어내는 건강의 직조입니다",
        subtitle: "모든 시술 기구와 수건은 유해 미생물을 완전히 박멸하기 위해 당일 살균 건조 멸균을 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 아뜰리에 에코의 마스터 원장입니다. 우리는 독한 파마 약과 실리콘 범벅 코팅제로 모발의 호흡 통로를 다 막아버려 두피 염증을 유발하는 화학적 기교 헤어샵을 단호히 거부합니다. 우리는 숲속 바람 향취가 머무는 친자연 자작나무 테이블과 은은한 아날로그 조명 아래서 당신만을 위한 건강한 헤어 안식을 돌려드리겠습니다.",
          stats: [
            { label: "고객 두피 트러블 발생률", value: "0.00%" },
            { label: "보유 천연 염색 약초 종류", value: "12가지" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "초록 정원 헤어 살롱 & 에코 스파룸",
        subtitle: "사진만 보아도 상쾌한 잎사귀 냄새와 커피 커피 향취가 흐르는 청정 공간 전경입니다.",
        content_data: {
          items: [
            { title: "대형 원목 거울 앞 가죽 피팅석", description: "아늑한 노란 핀 조명이 얼굴을 비추고 오가닉 화분들이 가득 차 상쾌한 공기를 주는 단독 헤어 룸", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80" },
            { title: "헤드스파 전용 완전 누움 침대 코너", description: "따스한 안개 스팀이 모락모락 뿜어지고 두피 샴푸 마사지를 즐기며 눈을 감고 명상하기 좋은 스파실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "약초 염색 가루와 티포트 스냅 스냅", description: "유리 볼 안에 곱게 갈아진 초록 약초 파우더와 올리브 오일, 그리고 허브 차 한 잔이 데코레이션된 스틸", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1:1 헤어 클리닉 피팅 예약",
        subtitle: "방문 예정 일시, 희망 시술(헤드스파/오가닉염색/모발케어), 현재 앓고 계신 임산부 여부 등 건강 상태를 작성해 예약 신청해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "헤어 살롱 예약 완료"
        }
      }
    ]
  },

  perfume_house_atelier: {
    templateId: "perfume_house_atelier",
    name: "메종 드 센트 향수 조향 스튜디오",
    category: "Fashion & Beauty",
    description: "고풍스럽고 감각적인 딥 와인 버건디와 은은한 샴페인 브론즈 골드, 맑은 석고 베이지 배합으로 나만의 시그니처 향수 조향 가이드를 전하는 럭셔리 조향 아뜰리에 테마입니다.",
    image: "/templates/perfume_house_atelier.png",
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
        title: "내 기억 저편 깊숙이 숨겨진 한 조각 소중한 추억을 후각의 언어로 번역하다",
        subtitle: "지하철만 타면 누구나 다 풍기는 인공 화장품 냄새 일색의 흔한 대형 백화점 향수를 단호히 거부합니다. 메종 드 센트 방식으로, 프랑스 그라스 남부 농가에서 직수입한 천연 에센셜 오일과 향수 원액을 조향사 시트 데이터에 따라 0.1g 단위로 기하학적으로 배합하여 일생 단 하나의 시그니처 향을 직조하는 명품 조향 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "원데이 조향 살롱 신청",
          ctaLink: "#contact",
          features: [
            { text: "천연 유기농 라벤더, 로즈마리 오일 오일만을 정밀 선별하여 두통이 없는 식물성 향수 보증" },
            { text: "체크인 시 조향사의 아날로그 저울과 갈색 차광 스포이드 병, 시향 카드 팩 무상 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "조향 살롱 큐레이션",
        subtitle: "오감 중 가장 원초적이고 지고한 후각의 영감을 안전하게 수확하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "1:1 프라이빗 센트 디자인 디자인",
              description: "조향사와 마주 앉아 65가지 천연 에센셜 탑, 미들, 베이스 노트 오일을 시향하며 나만의 향기 악보 시트를 작성합니다.",
              icon: "Heart"
            },
            {
              title: "천연 아로마 향수 50ml 제작",
              description: "시트에 작성된 정량 레시피에 맞춰 스포이드로 향수 베이스 액체에 정밀 방울 드롭하여 원액을 믹싱합니다.",
              icon: "Droplet"
            },
            {
              title: "고풍스러운 아날로그 실링 왁스 팩",
              description: "완성된 유리 보틀 향수 병에 이니셜 라벨을 붙이고 코크 마개 위에 붉은 실링 왁스 낙관을 찍어 포장합니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "향수는 단순히 남에게 잘 보이기 위해 뿌리는 액체가 아닌, 보이지 않는 영혼의 옷을 입고 내 삶의 가장 아름다운 시간의 좌표를 수호하는 아날로그적 집념입니다",
        subtitle: "모든 조향 프로그램은 코의 감각 피로를 예방하기 위해 클래스당 최대 4인 이하의 침묵 침묵 속에 가동됩니다.",
        content_data: {
          description: "안녕하십니까. 메종 드 센트 향수 스튜디오의 수석 소믈리에 조향사입니다. 우리는 화학 석유 알코올에 인공 화학 향료를 섞어 첫 향만 강하게 코를 찌르고 뒷머리를 무겁게 만드는 양산 와인 같은 향수를 단호히 거부합니다. 우리는 지리적 산지 식물의 천연 잎사귀 오일 엽록소 비타민을 훼손 없이 유리병에 담아내고, 촛불 하나만 켜둔 고요한 동굴 살롱에서 당신만의 은밀한 후각을 보좌하겠습니다.",
          stats: [
            { label: "보유 프랑스 수입 에센셜 원액", value: "85종" },
            { label: "조향 정회원 매니아 수", value: "1,200명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "갈색 차광 병 조향 다이 & 촛불 테이블",
        subtitle: "사진 한 장만으로도 은은한 허브 향취와 따스함이 가득 전해지는 아날로그 갤러리입니다.",
        content_data: {
          items: [
            { title: "수십 개의 갈색 약병이 놓인 테이블", description: "아늑한 핀 조명 아래 정밀 디지털 저울과 시향지, 만년필 시트가 정갈하게 안착된 1인 조향석 좌석", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" },
            { title: "유리 보틀에 왁스 낙관이 찍힌 모습", description: "코르크 마개 가죽 끈에 매달린 은빛 로고 태그와 붉은 왁스가 굳어 예쁘게 번진 클래식 쇼케이스", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "로즈 에센스 오일 스포이드 드롭 스냅", description: "투명한 향료가 한 방울 뚝 떨어져 은색 계량 비커 안에 물결 동심원을 퍼뜨리는 극적인 조향 스냅", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원데이 조향 클래스 상담 예약",
        subtitle: "방문 예정 일시, 단체 클래스 인원 수, 선호하시는 향기 스타일(우디/플로럴/시트러스)을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "조향 살롱 클래스 예약"
        }
      }
    ]
  },

  activewear_fitness_brand: {
    templateId: "activewear_fitness_brand",
    name: "에어로핏 에너제틱 애슬레저",
    category: "Fashion & Beauty",
    description: "스포티하고 에너제틱한 형광 네온 그린과 묵직한 카본 슬레이트 그레이, 그리고 강렬한 화이트 배합이 헬스 스포츠웨어의 활동성을 선사하는 스포츠 패션 테마입니다.",
    image: "/templates/activewear_fitness_brand.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#10b981",     // 활기찬 네온 에메랄드 그린
        secondary: "#1f2937",   // 도로 아스팔트 카본 그레이
        accent: "#ea580c",      // 타오르는 불꽃 오렌지
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
        title: "몸의 땀방울이 가루가 되어 흩날리는 그 폭발의 찰나를 완벽히 밀착 서포트하다",
        subtitle: "한두 번 격하게 스쿼트하면 늘어나고 땀 배출이 안 되어 질퍽거리는 싸구려 운동복에 실망하셨나요? 에어로핏 테크놀로지를 도입하여, 고탄성 크레오라 스판 원단과 고밀도 흡한속건 메쉬 원단을 인체공학적으로 입체 봉제하고, 형광 네온 그린 포인트 그래픽으로 헬스장 밖 일상 크루 라이딩 라이딩에서도 시크한 에너지를 뿜어내는 스마트 액티브웨어입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
          ctaText: "액티브 땀방울 웨어 쇼핑",
          ctaLink: "#services",
          features: [
            { text: "움직임 시 살 쓸림 부상을 원천 차단하는 무봉제 오드람프 입체 평탄 봉제 기술 전면 채택" },
            { text: "체크인 시 운동화 발 각도 15도 최적 지지를 돕는 스포츠 인솔 기본 가이드 무료 무료 제공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "애슬레저 컬렉션",
        subtitle: "모발과 전신 근육 수축 상태를 고밀도로 서포트하는 프로 그래픽 라인업입니다.",
        content_data: {
          items: [
            {
              title: "고탄성 흡한속건 머슬 티",
              description: "고탄성 라이크라 스판덱스 원단을 15% 믹싱하여 근육의 떨림을 잡고 땀을 3초 만에 기화 흡수하는 머슬 핏 셔츠입니다.",
              icon: "Zap"
            },
            {
              title: "하드 하이웨이스트 헬스 레깅스",
              description: "허리 고무밴드 압력을 고르게 분산하여 복부 코어를 곧게 잡아주고 힙업 실루엣을 자아내는 무봉제 레깅스입니다.",
              icon: "Award"
            },
            {
              title: "네온 윈드 브레이커 경량 바람막이",
              description: "초경량 나일론 발수 코팅 원단으로 돌발적인 폭우와 가을 솔바람 체온 손실을 완벽 완벽 엄호하는 자켓입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "애슬레저는 단순히 운동할 때 입는 캐주얼복이 아닌, 내 육체를 한계 너머로 개척해 나가는 아름다운 땀방울 노동 앞에 바치는 스마트 테크놀로지 기어입니다",
        subtitle: "모든 스포츠 의류는 복제 복사 방지를 위해 지퍼 라인 뒷면에 시리얼 코드가 디지털 인쇄됩니다.",
        content_data: {
          description: "안녕하십니까. 에어로핏 애슬레저의 수석 테크니컬 패턴사입니다. 우리는 조금만 격하게 움직여도 지퍼가 벌어지고 원단이 튿어져 부상을 유발하는 가성비 의류를 단호히 거부합니다. 우리는 인체 관절 굴곡 각도 데이터를 컴퓨터 시뮬레이션하여, 안장이나 바벨을 쥘 때 옷이 몸과 완전히 하나로 동조되어 움직이도록 직조하겠습니다.",
          stats: [
            { label: "누적 출고 스포츠 의류", value: "12,000개" },
            { label: "공식 협력 프로 라이더 수", value: "14명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "테크니컬 스포츠 룸 & 액티브 컷",
        subtitle: "당장 운동화 끈을 동여매고 바벨을 움켜쥐고 싶게 만드는 스포티한 전경입니다.",
        content_data: {
          items: [
            { title: "헬스장 바벨 그릴 그립을 쥔 모델", description: "네온 그린 메쉬 셔츠를 입고 이마에 땀방울이 맺힌 채 묵직한 덤벨을 당기는 쾌적하고 생동감 넘치는 찰나", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" },
            { title: "은빛 알루미늄 자전거 사이클링 의류", description: "카본 자전거 프레임 옆에 져지와 바람막이 자켓이 세련되게 정렬되어 테크니컬한 멋을 뿜는 쇼룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "무봉제 오드람프 봉제 실 시보리 스냅", description: "바늘 두 개가 교차하여 원단 이음새가 가죽처럼 평평하게 이어지도록 정교하게 바느질하는 장인의 기계 조리 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "크루 제휴 및 원단 기술 문의",
        subtitle: "러닝 크루 단체 져지 단체 복 주문 상담, 스포츠 인솔 정량 맞춤 컨설팅 신청은 아래 양식에 적어 제출해 주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "애슬레저 제휴 상담"
        }
      }
    ]
  },

  kids_concept_store: {
    templateId: "kids_concept_store",
    name: "쁘띠 메종 아동 패션 편집숍",
    category: "Fashion & Beauty",
    description: "사랑스럽고 따스한 파스텔 피치 베이지와 레몬 옐로우, 그리고 맑고 깨끗한 아침 공기 민트 그린 조화로 아이들의 귀여움과 친환경 가치를 전하는 테마입니다.",
    image: "/templates/kids_concept_store.png",
    theme: {
      fontFamily: "Outfit, Poppins, sans-serif",
      colors: {
        primary: "#ea580c",     // 사랑스러운 귤빛 오렌지
        secondary: "#fef08a",   // 화사한 바나나 옐로우
        accent: "#16a34a",      // 청량한 아침 이슬 그린
        background: "#fafbf9",  // 맑고 투명한 무농약 오프화이트
        surface: "#ffffff",     // 위생 세라믹 놀이 테이블 화이트
        text: "#1c2317"         // 눈이 편안한 올리브 브라운 차콜
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "화학 형광 증백제를 단 1방울도 타지 않고 100% 무농약 오가닉 코튼의 포근함",
        subtitle: "피부가 예민한 우리 아이 손끝 피부에 알레르기를 유발하는 싸구려 나일론 유아복에 속상하셨나요? 쁘띠 메종 방식으로, 3년 동안 농약을 한 번도 뿌리지 않은 대지에서 수확한 천연 목화솜 원사 100%만을 고집하여 아이가 하루 종일 뒹굴며 땀을 흘려도 아토피 우려 없이 쾌적함을 수호하는 오가닉 아동 편집 매장입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80",
          ctaText: "오가닉 아동 의류 라인업",
          ctaLink: "#services",
          features: [
            { text: "아이가 단추를 입으로 물어도 유해 물질 우려가 전혀 없는 100% 옥수수 성분 친환경 천연 자개단추 채택" },
            { text: "체크인 시 아토피 피부 이완을 돕는 유기농 국산 카모마일 아동 바스 솔트 패키지 증정" }
          ]
        }
      },
      {
        section_type: "services",
        title: "쁘띠 메종 에센셜",
        subtitle: "아이들의 여린 피부를 안전하고 귀엽게 수호하는 친환경 웰빙 라인업입니다.",
        content_data: {
          items: [
            {
              title: "100% 오가닉 목화솜 우주복",
              description: "화학 표백 처리를 거치지 않아 목화씨 알갱이가 미세하게 보이며 깃털처럼 부드러운 유아 바디수트입니다.",
              icon: "Heart"
            },
            {
              title: "식물성 대나무 대나무 거즈 수건",
              description: "천연 대나무 섬유를 사용하여 흡수 속도가 면보다 3배 빠르고 살균력이 뛰어난 위생 거즈입니다.",
              icon: "Leaf"
            },
            {
              title: "천연 옥수수 잎 아동 실내화",
              description: "옥수수 대 전분을 고압 사출 가공하여 환경호르몬(BPA) 우려 제로인 가볍고 푹신한 실내화입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아동복은 단순히 귀여운 그림을 프린트하는 옷이 아닌, 여린 피부 세포를 유해 화학 물질의 위협으로부터 가장 가장 안전하게 엄호하는 투명한 보호 장벽입니다",
        subtitle: "모든 아동 의류는 포장 전 100도 열풍 살균 오븐을 거쳐 위생적으로 밀폐 배송됩니다.",
        content_data: {
          description: "안녕하십니까. 쁘띠 메종 아동 편집숍의 헤드 디자이너이자 영양 웰니스 코치입니다. 우리는 인쇄기 잉크가 굳어 갈라지고 땀 배출이 안 되는 가성비 스파 브랜드 유아복을 단호히 거부합니다. 우리는 매일 원단 알레르기 수치를 테스트하고, 파스텔 노란 인테리어 속에서 아이들이 유기농 차를 마시며 모래놀이를 즐기는 행복한 아뜰리에 쉼터를 지켜가겠습니다.",
          stats: [
            { label: "알레르기 트러블 발생 사례", value: "0건" },
            { label: "협력 정회원 엄마 고객", value: "1,500명" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "러블리 베란다 스마트 놀이 룸 & 키즈 숍",
        subtitle: "사진만 보아도 상쾌한 비타민 향기가 솟아나는 아기자기한 친자연 공간 전경입니다.",
        content_data: {
          items: [
            { title: "파스텔 옐로우 텐트와 원목 가구", description: "아기용 실크 러그 위에 장난감 블록과 목마가 이쁘게 세팅되어 아이들이 놀기 좋은 다이닝 공간", image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80" },
            { title: "벽면 가득한 무농약 오가닉 거즈 옷장", description: "아기용 우주복과 모자가 나무 가지 옷걸이에 정갈하게 걸려 있어 위생적이고 기품 가득한 쇼룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "옥수수 전분 실내화 사출 조리 스냅", description: "화학 유화제 없이 식물성 원료를 녹여 둥근 아동 신발 몰드를 사출 성형하는 깨끗한 공장 실무 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "오가닉 의류 선물 패키지 문의",
        subtitle: "출산 선물 백팩 박스 구성 상담, 자녀 피부 타입 맞춤 의류 견적, 오프라인 모래 살롱 참가 신청서를 적어 전송하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "쁘띠 메종 아동복 문의"
        }
      }
    ]
  },

  sustainable_slow_fashion: {
    templateId: "sustainable_slow_fashion",
    name: "어스 앤 코 친환경 에코 패션",
    category: "Fashion & Beauty",
    description: "차분하고 포근한 얼씨 오가닉 카키 그린과 내추럴 오크 베이지, 맑은 석고 화이트 배합으로 기품 있는 서스테이너블 라이프의 가치를 전하는 에코 테마입니다.",
    image: "/templates/sustainable_slow_fashion.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#166534",     // 내추럴 에코 포레스트 그린
        secondary: "#f0fdf4",   // 맑고 깨끗한 아침 채소 이슬
        accent: "#b45309",      // 앰버 오렌지 토양
        background: "#fafbf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 린넨 가구 테이블 화이트
        text: "#14532d"         // 눈이 편안한 포레스트 그린 카본
      },
      borderRadius: "rounded-3xl",
      glassmorphism: false
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "나와 지구의 미래를 수호하는 아름다운 저항, 100% 옥수수 전분 해독 섬유",
        subtitle: "석유계 나일론 화학 섬유로 피부 모공을 막아 가려움을 유발하고 환경을 파괴하는 흔한 양산복에 실망하셨나요? 어스 앤 코 방식으로, 생분해 스판덱스와 천연 한지 원단, 쐐기풀 식물 줄기 섬유만을 고집하여 흙 속으로 1년 만에 완전히 용해 분해되는 서스테이너블 패션 라이프스타일 도감입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
          ctaText: "에코 에센셜 룩북 보기",
          ctaLink: "#services",
          features: [
            { text: "의류가 흙 속에 들어가 365일 뒤 미생물 배양액에 의해 완전히 분해 생분해되는 생태학적 보증" },
            { text: "천연 과일 유기농 잼 농장에서 추출한 천연 석류, 유자 소스 원액 껍질로 가죽과 섬유를 염색" }
          ]
        }
      },
      {
        section_type: "services",
        title: "에코 패션 프로그램",
        subtitle: "모발과 지구의 탄소 발자국을 최대로 덜어내어 정화하는 의류 큐레이션입니다.",
        content_data: {
          items: [
            {
              title: "생분해 옥수수 데님 진",
              description: "대두 단백 섬유와 옥수수 전분 PLA 원사를 결합하여, 일반 스판 청바지보다 신축성은 같으면서 속은 훨씬 편안합니다.",
              icon: "Heart"
            },
            {
              title: "천연 한지 린넨 셔츠",
              description: "닥나무 한지 펄프 원맥을 맷돌 제분하여 셔츠를 제작하여, 통기성이 뛰어나고 여름철 땀 냄새를 완벽 방지합니다.",
              icon: "Leaf"
            },
            {
              title: "파인애플 가죽 에코 뮬 뮬",
              description: "버려지는 파인애플 껍질 섬유를 고압 압착 가공해 쇠가죽보다 부드럽고 가벼운 동물 보호 에코 샌들입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "서스테이너블 패션은 유행에 따라 옷을 버리는 낭비가 아닌, 한 장의 옷을 평생 아껴 입고 그 가치를 흙 속으로 정직하게 되돌려주는 지구와의 기품 있는 동행입니다",
        subtitle: "모든 의류는 탄소 배출량을 제로화하기 위해 로컬 농가 협동조합의 태양광 직조 방직기에서 생산됩니다.",
        content_data: {
          description: "안녕하십니까. 어스 앤 코의 수석 웰니스 에디터이자 크래프터입니다. 우리는 석유 오염과 동물 학대를 야기하며 수입산 플라스틱 장난감 단추를 쏟아붓는 흔한 대형 프랜차이즈 SPA 의류를 단호히 거부합니다. 우리는 100% 재생 목재 가구 인프라 속에서 아이들이 유기농 차를 마시며 에코 흙벽 드로잉을 감상하는 안락한 아뜰리에 쉼터를 지켜내겠습니다.",
          stats: [
            { label: "생분해 원단 비중", value: "100%" },
            { label: "협력 로컬 친환경 농가", value: "14곳" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "싱그러운 숲속 야외 런웨이 & 에코 숍",
        subtitle: "초록 채소들이 햇살을 머금고 무배출 청정 호흡하는 상쾌한 친자연 공간 전경입니다.",
        content_data: {
          items: [
            { title: "갈대밭 속 하얀 린넨 원피스 모델", description: "황혼 노을 사선 채광을 받으며 쐐기풀 원단 드레스 자락을 휘날리는 쾌적하고 럭셔리한 화보", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
            { title: "원목 진열장 위 파인애플 에코 가방", description: "천연 올리브 가죽 대안 백들이 화초 화분들과 어우러져 기품 있게 정렬된 쇼룸 카운터 바", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "석류 껍질 천연 염색 수기 조리 스냅", description: "구리 가마 안에서 따뜻한 온수와 석류 분말 믹싱액이 보글보글 끓으며 흰 실크 면사를 염색하는 장인의 작업실", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "에코 라이프 정기 구독 및 도매 문의",
        subtitle: "생분해 PLA 의류 정기 배달 구독 신청, 로컬 친환경 기업과의 B2B 기술 제휴 상담은 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "에코 서스테이너블 제안 신청"
        }
      }
    ]
  },

  eyewear_design_studio: {
    templateId: "eyewear_design_studio",
    name: "스펙트럼 디자이너 아이웨어",
    category: "Fashion & Beauty",
    description: "스마트하고 이지적인 슬레이트 메탈 그레이와 세련된 애메랄드 그린, 그리고 맑은 석고 화이트 배합이 디자이너 안경과 선글라스의 지적인 윤곽을 보여주는 테마입니다.",
    image: "/templates/eyewear_design_studio.png",
    theme: {
      fontFamily: "Space Grotesk, Inter, sans-serif",
      colors: {
        primary: "#1f2937",     // 맑은 노출 콘크리트 다크그레이
        secondary: "#f3f4f6",   // 라이트 실버 메탈 그레이
        accent: "#0f766e",      // 지적인 에메랄드 그린
        background: "#fafaf9",  // 정갈한 석고 화이트 미색
        surface: "#ffffff",     // 깨끗한 안경 조립대 화이트
        text: "#111827"         // 시인성 높은 스톤 슬레이트 차콜
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "얼굴의 뼈 골격과 동공 비례를 측정하여 재단하는 0.1mm 오차 없는 지적인 시선",
        subtitle: "귀 뒤가 아프고 코가 눌려 두통을 유발하는 무거운 양산 안경에 실망하셨나요? 스펙트럼 랩 방식으로, 수입 천연 면사 아세테이트와 티타늄 메탈 프레임을 세공 세공하여, 안경을 쓰는 순간 쓴 느낌 없이 얼굴과 하나로 융화되고 지적인 카리스마를 완성하는 디자이너 아이웨어 공방입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80",
          ctaText: "티타늄 안경 컬렉션 룩북",
          ctaLink: "#services",
          features: [
            { text: "귀 뼈 지지각과 콧등 경사도를 디지털 센서로 측정해 안경 다리를 정밀 구부리는 커스텀 피팅" },
            { text: "천연 아세테이트 수지 표면의 깊은 대리석 광택을 위해 72시간 맷돌 오크나무 통 연마 마감" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아이웨어 프로그램",
        subtitle: "시력을 안전하게 수호하며 지적인 개성을 최대로 돋보이게 담아낸 안경 목록입니다.",
        content_data: {
          items: [
            {
              title: "베타 티타늄 초경량 안경",
              description: "항공 우주 우주급 베타 티타늄 메탈 프레임을 사용하여 무게를 단 4g 오차 없이 초경량 수호하는 스마트 안경입니다.",
              icon: "Zap"
            },
            {
              title: "수제 아세테이트 혼합 뿔테",
              description: "목화솜 천연 원료로 만든 아세테이트 판을 깎아 대리석 같은 깊은 마블링 무늬와 광택을 뿜어내는 정통 뿔테입니다.",
              icon: "Sparkles"
            },
            {
              title: "자외선 차단 아웃도어 선글라스 선글라스",
              description: "동공 자극 피로를 차단하는 100% 자외선 여과 칼 차이스 렌즈와 에메랄드 코팅을 장착한 고글입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "안경은 단순히 시력을 돕는 도구가 아닌, 내 얼굴 위에 안착하여 타인과 마주하는 가장 첫 인상의 지적인 건축입니다",
        subtitle: "모든 안경 프레임은 위생적인 피부 접촉을 위해 니켈 성분 0% 알레르기 프리 도금만을 엄격 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 스펙트럼 디자이너 아이웨어의 헤드 미캐닉 디렉터입니다. 우리는 흘러내리고 귀 뒷살을 짓눌러 두통과 시력 저하를 조장하는 저가 플라스틱 중국산 안경을 단호히 거부합니다. 우리는 수입 천연 목화솜 판을 줄날로 갈아 가루를 내고, 동 증류 증류 가마에서 힌지 스프링을 단련하여 평생 변치 않을 지적인 아우라를 빚어내겠습니다.",
          stats: [
            { label: "평균 안경 프레임 무게", value: "4.5그램" },
            { label: "소속 국가 공인 안경사", value: "6명 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "지적인 안경 진열대 & 조립실",
        subtitle: "은빛 알루미늄 가구와 세련된 티타늄 프레임들이 정갈하게 세팅된 인더스트리얼 전경입니다.",
        content_data: {
          items: [
            { title: "아크릴 격자 디스플레이 선글라스", description: "에메랄드 코팅 렌즈가 반짝이고 티타늄 다리가 접혀 투명한 쇼케이스 아래 나란히 정렬된 코너", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80" },
            { title: "안경 코 받침 수기 줄질 피팅대", description: "바이스에 뿔테 전면 프레임을 고정해두고 줄날 도구로 아세테이트 턱을 부드럽게 깎아내는 장인의 책상", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "칼 차이스 렌즈 삽입 조립 스냅", description: "유리 렌즈 테두리를 안동안에 끼워 드라이버 나사못으로 정교하게 힌지를 조여 고정하는 미캐닉 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "디자이너 피팅 및 시력 측정 상담",
        subtitle: "방문 예정 일시, 안경 피팅/선글라스 구매 목적, 현재 앓고 계신 난시 근시 도수 고민을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "시력 측정 예약 신청"
        }
      }
    ]
  },

  luxury_spa_resort: {
    templateId: "luxury_spa_resort",
    name: "누아 웰니스 럭셔리 스파 & 메디컬",
    category: "Fashion & Beauty",
    description: "은은하고 고풍스러운 다크 와인 버건디와 차분한 샴페인 브론즈 골드, 그리고 맑고 아늑한 린넨 아이보리 배합으로 지중해 최고급 스파와 전신 해독을 안내하는 럭셔리 웰니스 테마입니다.",
    image: "/templates/luxury_spa_resort.png",
    theme: {
      fontFamily: "Outfit, Cormorant Garamond, serif",
      colors: {
        primary: "#4c0519",     // 매혹적인 런웨이 버건디
        secondary: "#fdf8f5",   // 맑고 깨끗한 린넨 아이보리
        accent: "#d4af37",      // 샴페인 브론즈 골드
        background: "#0f0507",  // 어두운 아날로그 살롱 다크와인
        surface: "#1e1114",     // 안락한 벨벳 가구 다크 브라운
        text: "#f5ebe0"         // 가독성 높은 온화한 크림 오프화이트
      },
      borderRadius: "rounded-md",
      glassmorphism: true,
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "촛불 하나만 켜둔 어두운 스파 룸 위, 프랑스 아로마 오일 오일 향기의 치유",
        subtitle: "차가운 주삿바늘과 인공 약물 성분의 강박적 메디컬을 단호히 거부하십시오. 유럽 황실의 아로마 에센셜 오일과 스파 핫스톤 찜질을 활용하여, 경직된 전신 림프를 뭉근하게 문질러 정화하고, 마음챙김 웰니스 사운드와 함께 오장육부 피로를 부드럽게 해독하는 럭셔리 웰니스 스파입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
          ctaText: "이달의 프라이빗 스파 예약",
          ctaLink: "#contact",
          features: [
            { text: "화학 독성 감미료 전혀 없이 매실 효소 원액으로 웰컴 허브티 매일 3회 무료 제공" },
            { text: "유기농 올리브 오일 앰플 보습막을 씌워 수분 유실률을 0%로 통제하는 힐링 케어" }
          ]
        }
      },
      {
        section_type: "services",
        title: "럭셔리 스파 컬렉션",
        subtitle: "바쁜 현대인의 지친 심장 박동과 혈관 세포를 부드럽게 이완하는 라인업입니다.",
        content_data: {
          items: [
            {
              title: "지중해 화산석 핫스톤 스파",
              description: "뜨겁게 달군 현무암 화산석을 척추 등 마디 라인 위에 올려 심부 온도를 1도 올리고 독소를 정량 배출합니다.",
              icon: "Flame"
            },
            {
              title: "유기농 라벤더 림프 에스테틱",
              description: "천연 라벤더 에센셜 오일을 호흡기로 흡수하고 쇄골 림프관을 세밀하게 타격 마사지하여 부기를 리셋합니다.",
              icon: "Heart"
            },
            {
              title: "1인 도자 노천탕 스파 사우나",
              description: "맑은 황토 옹기 탕 안에 카모마일 소금을 풀고 대나무 바람 소리를 들으며 입욕하는 명상 코스입니다.",
              icon: "Droplet"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "스파는 단순히 몸을 씻고 때를 미는 세척이 아닌, 물의 밀도와 천연 아로마 향취를 내 림프 혈관과 완벽히 동조시키는 생태학적 정화입니다",
        subtitle: "모든 침구 린넨과 가운은 고객 1인이 퇴실할 때마다 100도 고온 멸균 열풍 세탁을 칼같이 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 누아 웰니스 스파의 총지배인 소믈리에입니다. 우리는 소음이 심하고 위생 위생 상태가 불량하여 심장 박동을 산만하게 조장하는 대중 사우나나 저가 에스테틱을 단호히 거부합니다. 우리는 프랑스 황실 명가 프랑스 아로마 오일만을 독점 공수하며, 촛불 하나만 켜둔 안락한 동굴 살롱 속에서 당신의 깊은 지적인 안식을 책임지고 돌보겠습니다.",
          stats: [
            { label: "방문자 피로 회복 만족도", value: "99.8%" },
            { label: "보유 천연 에센셜 오일", value: "35종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "동굴 핫스톤 스파 룸 & 웰컴 티 바",
        subtitle: "사진 한 장만으로도 깊은 숲속 정서적 고독과 힐링이 번져나는 아우라 갤러리입니다.",
        content_data: {
          items: [
            { title: "아늑한 1인 온천 옹기 침대 베드", description: "따스한 김이 모락모락 솟아오르고 대나무 화분들과 조화를 이루어 오감이 안락해지는 프라이빗 사우나", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
            { title: "유광 브론즈 아로마 화장품 렉", description: "보틀 라벨의 세련된 라벤더 스티커와 갈색 유리병이 빛을 만나 보석처럼 빛나는 럭셔리 카운터", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "스톤 마사지 핫스톤 스냅 스냅", description: "둥근 회색 현무암 핫스톤 위에 물방울이 맺히고 은은한 향초 촛불 불꽃이 번지는 웰니스의 순간 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "1인 단독 스파 사전 상담 예약",
        subtitle: "방문 날짜 및 시간, 동반 인원 수, 선호하시는 스파 세션(핫스톤/림프/노천탕)을 기재해 예약서를 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "스파 객실 예약 신청"
        }
      }
    ]
  },

  makeup_makeup_academy: {
    templateId: "makeup_makeup_academy",
    name: "페이스 아트 프로 메이크업 아카데미",
    category: "Fashion & Beauty",
    description: "화사하고 매혹적인 라즈베리 로즈 핑크와 세련된 메탈 링 그레이, 맑은 석고 화이트 배합으로 프로 메이크업 아티스트의 메커니즘을 전수하는 아카데미 테마입니다.",
    image: "/templates/makeup_makeup_academy.png",
    theme: {
      fontFamily: "Outfit, Inter, sans-serif",
      colors: {
        primary: "#be123c",     // 화사한 라즈베리 로즈 핑크
        secondary: "#ffe4e6",   // 맑고 눈부신 로즈 웰컴 크림
        accent: "#d4af37",      // 샴페인 브론즈 골드
        background: "#fafaf9",  // 정갈한 석고 화이트 오프화이트
        surface: "#ffffff",     // 깨끗한 메이크업 조립대 화이트
        text: "#1c1917"         // 시인성 높은 다크 초콜릿 카본
      },
      borderRadius: "rounded-xl",
      glassmorphism: true,
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "얼굴의 입체 골격 윤곽을 아티스틱하게 재단하는 브러쉬 스트로크 테크닉",
        subtitle: "피부에 독성 성분이 가득한 화학 저가 화장품 브러쉬질에 실망하셨나요? 페이스 아트 방식으로, 쇄골 뼈 비례와 광대뼈 음영 굴곡을 공학적으로 해독하여, 단 3초 만에 첫인상의 지적인 무드를 결정하는 명품 메이크업 아티스트 양성 아뜰리에입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
          ctaText: "프로페셔널 조향 메이크업 룩북",
          ctaLink: "#services",
          features: [
            { text: "천연 산양모 100% 무독성 브러쉬 세트와 위생 멸균 오븐 세척 건조 인프라 상시 구비" },
            { text: "메이크업 아티스트 국가 자격증 필기 실기 시험 합격을 돕는 속성 하드 트레이닝" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아카데미 에센셜",
        subtitle: "얼굴의 오관 윤곽을 최대로 돋보이게 빚어내는 아티스틱 메이크업 목록입니다.",
        content_data: {
          items: [
            {
              title: "입체 컨투어링 음영 클래스",
              description: "이마 콧대 턱선의 경사도에 따라 하이라이터와 브론저 파우더 명암 비중을 0.1g 단위로 조율해 슬림한 입체를 만듭니다.",
              icon: "Award"
            },
            {
              title: "결 살림 정밀 아이브로우",
              description: "눈썹 한 올 한 올의 자생 가마 방향을 마스카라 브러쉬 날 끝으로 정교하게 빗어 올려 생기를 부여합니다.",
              icon: "Zap"
            },
            {
              title: "비치 선셋 립스틱 마리아주",
              description: "피부 톤(쿨톤/웜톤)을 퍼스널 진단하여 립스틱 립글로스 믹싱 황금 꿀 비율을 코칭하는 과정입니다.",
              icon: "Sparkles"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "메이크업은 얼굴을 가면처럼 두껍게 가리는 가식이 아닌, 인물 고유의 우아한 표정과 눈동자 빛깔을 최대로 끌어올리는 시각적 시너지입니다",
        subtitle: "모든 뷰티 클래스는 정확한 집중을 위해 실시간 거울 모니터링 가벽을 완비합니다.",
        content_data: {
          description: "안녕하십니까. 페이스 아트 아카데미의 총괄 원장입니다. 우리는 어색한 과보정과 백탁 백탁 선크림 범벅으로 이목구비를 뭉개버리는 유행성 유투버 화장법을 단호히 거부합니다. 우리는 골격 고유의 비대칭선조차 기품 있는 비즈니스 매력으로 보완 성형하고, 쾌적하고 위생적인 거울대 인프라 속에서 당신의 뷰티 아티스트 데뷔를 책임지겠습니다.",
          stats: [
            { label: "누적 국가자격증 합격자 수", value: "1,500명+" },
            { label: "보유 전문 명품 브러쉬 툴", value: "85종" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "화사한 백스테이지 거울대 & 섀도우 룸",
        subtitle: "사진만 보아도 브러쉬 분말 향기가 코에 번지는 듯한 프로페셔널 갤러리입니다.",
        content_data: {
          items: [
            { title: "꼬마 백열구 대형 거울 뷰티 데스크", description: "수십 개의 화장품 파우더 콤팩트와 섀도우 팔레트가 정갈하게 진열된 아기자기하고 화사한 1인 메이크업 존", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
            { title: "아티스트 유화용 비커 브러쉬 건조대", description: "천연 산양모 붓들이 세정액에 씻겨서 건조 랙 위에 정갈하게 걸려 있는 먼지 하나 없는 위생 조리 룸", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "립스틱 발색 붓 드로잉 턱선 스냅", description: "모델의 쇄골 뼈 각도에 따라 파우더 솔을 둥글게 롤링하며 섀딩 마감을 가하는 바리스타의 정교한 손끝", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "원데이 메이크업 강습 및 학과 상담",
        subtitle: "방문 예정 일시, 수강 목적(취미/자격증/취업), 동반 참석 인원수, 선호하시는 카운터 좌석을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아카데미 수강 상담 신청"
        }
      }
    ]
  },

  bags_leather_atelier: {
    templateId: "bags_leather_atelier",
    name: "아틀리에 뀌르 수제 가죽 가방 공방",
    category: "Fashion & Beauty",
    description: "고풍스러운 오크 브라운과 아늑한 샴페인 메탈 황동 골드, 오래된 석고 백색 배합이 가죽 바느질 공예의 기품을 전하는 수제 가방 테마입니다.",
    image: "/templates/bags_leather_atelier.png",
    theme: {
      fontFamily: "Noto Serif KR, Georgia, serif",
      colors: {
        primary: "#3f2b1d",     // 중후한 이탈리안 가죽 브라운
        secondary: "#f5ebe0",   // 오래된 마 직조 린넨 베이지
        accent: "#d4af37",      // 황동 브라스 바버 골드
        background: "#faf6f0",  // 따스한 황토 오프화이트
        surface: "#ffffff",     // 정갈한 가죽 작업대 화이트
        text: "#2b1e16"         // 묵직한 카본 블랙 슬레이트 브라운
      },
      borderRadius: "rounded-sm",
      glassmorphism: false,
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "기계 바느질이 아닌, 프랑스 정통 에르메스식 새들 스티치 수기 봉제의 견고함",
        subtitle: "한 철 메고 던지면 실밥이 터지고 모서리 칠이 갈라져 버려지는 합성 인조 피혁 유행 가방에 만족하셨나요? 아틀리에 뀌르 방식으로, 프랑스 수입 천연 베지터블 소가죽 원단과 벨기에 린넨 왁스 실만을 고집하여 굵은 바늘 두 개로 가죽 구멍을 교차 통과시키는 새들 스티치 바느질로 대를 물려 사용할 인생 백을 직접 제작하는 가공 아뜰리에입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=80",
          ctaText: "수제 가죽 가방 룩북",
          ctaLink: "#services",
          features: [
            { text: "가죽 표면 손상을 방지하기 위해 천연 유기농 에센스 꿀 오일 보습막을 씌우는 오일 마감" },
            { text: "가죽 절단 마감면인 엣지 라인을 천연 수성 왁스로 5회 이상 문질러 반짝임을 주는 가공" }
          ]
        }
      },
      {
        section_type: "services",
        title: "가죽 공예 프로그램",
        subtitle: "가죽의 무거운 물성을 내 손끝 호흡으로 정교하게 재단하는 공예 목록입니다.",
        content_data: {
          items: [
            {
              title: "새들 스티치 가죽 바느질 바느질",
              description: "포니 나무 틀에 가죽을 고정해두고 구멍 뚫린 가죽 틈새에 초 칠을 한 굵은 마 실을 바늘 두 개로 용접하듯 꿰맵니다.",
              icon: "Zap"
            },
            {
              title: "베지터블 가죽 패턴 재단",
              description: "이탈리아 뷰티 테라스 탄닌 가죽 위에 철제 구두 칼로 문양 형틀 패턴 칼 선 드로잉을 가하는 절단 가이드입니다.",
              icon: "Compass"
            },
            {
              title: "금속 황동 버클 조립 조립",
              description: "가방 잠금 장치 코너에 도금이 아닌 오리지널 통 황동 브라스 자물쇠를 소형 망치로 타격 조립하는 코스입니다.",
              icon: "Award"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "가죽 가방은 단순히 소지품을 담는 자루가 아닌, 주인의 손때와 기름이 묻어 시간이 흐를수록 자줏빛으로 기품 기품 있게 태닝되는 동반자의 증명입니다",
        subtitle: "모든 가공 공정은 정밀한 안전을 위해 가죽 보호 앞치마와 전용 환기 설비를 엄격히 구비합니다.",
        content_data: {
          description: "안녕하십니까. 아틀리에 뀌르의 마스터 가죽 크래프터입니다. 우리는 석유 오염을 유발하며 수백 년이 흘러도 썩지 않고 비닐 냄새를 풍기는 레조렉스 가성비 가방을 단호히 거부합니다. 우리는 이탈리아 토스카나 식물 탄닌 태닝 가죽 협동조합 인증 가죽만을 수거하며, 망치 타격으로 금속 내부 밀도를 높인 통 황동 버클과 자개단추로 평생 대를 이어 쓸 유산을 조각하겠습니다.",
          stats: [
            { label: "제작 완료 수제 가방 수", value: "1,500개 돌파" },
            { label: "보유 수입 가죽 세공 칼", value: "8세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "묵직한 가죽 롤 진열대 & 세공 책상",
        subtitle: "나무 향과 구수한 천연 가죽 냄새가 고스란히 믹싱된 아늑한 공간 전경입니다.",
        content_data: {
          items: [
            { title: "가죽 피가 둘둘 말려 걸린 벽면", description: "아늑한 핀 조명 아래 갈색 가죽과 검은 가죽 롤들이 선반에 정갈하게 세팅되어 제작 대기 중인 모습", image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80" },
            { title: "나무 포니 가방 바느질 세공 바", description: "나무 기어 레버 거치대 사이에 반 지갑 가죽을 끼워두고 두 손으로 왁스 실 바느질을 가하는 현장", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "황동 버클 망치질 쇠못 조립 스냅", description: "가방 덮개 위에 통 황동 단추를 올리고 소형 나무 망치를 휘둘러 리벳 징을 튼튼히 안착시키는 조리 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "가방 제작 주문 및 클래스 신청",
        subtitle: "원데이 가방/지갑 제작 코스 신청, 희망 가죽 컬러(탄/브라운/블랙), 버클 각인 알파벳 이니셜을 적어 보내주세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "가죽 공방 예약 신청"
        }
      }
    ]
  },

  avant_garde_design: {
    templateId: "avant_garde_design",
    name: "아방가르드 패션 이노베이션",
    category: "Fashion & Beauty",
    description: "미래적인 일렉트릭 네온 레몬과 묵직한 우주 차콜 블랙, 그리고 은빛 실버 알루미늄 포인트가 조화를 이루는 아방가르드 해체주의 패션 아트 디자인 스튜디오 테마입니다.",
    image: "/templates/avant_garde_design.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#eab308",     // 사이버 일렉트릭 네온 옐로우
        secondary: "#3f3f46",   // 낡은 콘크리트 슬레이트 그레이
        accent: "#94a3b8",      // 알루미늄 실버 그레이
        background: "#09090b",  // 매트 서킷 블랙
        surface: "#18181b",     // 탄소 섬유 그릴 차콜
        text: "#ffffff"         // 시인성 높은 울트라 화이트
      },
      borderRadius: "rounded-none",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "기성 대중 의류의 낡은 비례를 찢어내고 해체하여, 옷깃의 각도를 왜곡하다",
        subtitle: "백화점에 줄 서서 사 입는 얌전하고 규격화된 명품 클론 룩에 신물이 나셨나요? 아방가르드 패션 랩 방식으로, 소매 깃을 등 뒤에 달아 실루엣을 기하학적으로 왜곡하고, 한 장의 블랙 방수포와 반짝이는 실버 아일렛못 결합만으로 패션을 현대 설치 미술의 경지로 격상시키는 혁신 크리에이터들을 위한 실험실입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
          ctaText: "해체주의 룩북 피드",
          ctaLink: "#services",
          features: [
            { text: "대칭 비례를 무너뜨린 언밸런스 지퍼 레이아웃과 소매 뚫음 비대칭 드레스 셔츠 시공" },
            { text: "패션 비엔날레 출품 마스터피스 의류 대여 및 현대 미술 전시관 단독 피팅룸 완비" }
          ]
        }
      },
      {
        section_type: "services",
        title: "아방가르드 에센셜",
        subtitle: "타인의 시선을 지적으로 타격하며 개성의 한계를 도발하는 예술 목록입니다.",
        content_data: {
          items: [
            {
              title: "해체 비대칭 가디건",
              description: "단추 구멍 라인을 사선으로 구부러뜨려 입었을 때 몸통 옷자락이 비대칭 물결 모양으로 낙하하는 가디건입니다.",
              icon: "Zap"
            },
            {
              title: "아일렛 타격 해체 후드",
              description: "오버사이즈 후드 끈 통로에 지름 30mm 은빛 알루미늄 아일렛 쇠고리를 다발 장착한 미래지향적 의류입니다.",
              icon: "Award"
            },
            {
              title: "방수 타포린 코팅 롱 스커트",
              description: "군용 포대 재질 무광 타포린을 수기 왁스 코팅 처리하여 바삭바삭한 조각상 느낌을 자아내는 스커트입니다.",
              icon: "Compass"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "아방가르드는 신체 치수에 옷을 맞추는 복종이 아닌, 신체 뼈대 위에 옷이라는 입체 조각물을 빌딩하여 인간을 하나의 걸어 다니는 조소 전시품으로 선언하는 미학적 투쟁입니다",
        subtitle: "모든 아방가르드 디자인 의류는 복제 방지를 위해 옷 라벨 뒷면에 암호 키 코드가 그래픽 그래픽 인쇄됩니다.",
        content_data: {
          description: "안녕하십니까. 아방가르드 패션 이노베이션의 대표 아티스트 디자이너입니다. 우리는 단정함을 강요하며 매너라는 껍질 속에 영혼을 가둬두는 평범한 정장 비즈니스 룩을 단호히 거부합니다. 우리는 소매 깃을 하나 더 달거나 지퍼 라인을 꼬아 의류 고유의 유동성을 극대화하며, 전 세계 단 6개 비엔날레 한정 드랍 코드를 통해 당신의 예술적 자존심을 수호하겠습니다.",
          stats: [
            { label: "전시관 비엔날레 출품 횟수", value: "24회" },
            { label: "글로벌 한정 드랍 의류 개수", value: "35개" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "해체주의 백스테이지 & 아트 쇼룸",
        subtitle: "사진 한 장만으로도 가슴이 쿵쾅거리고 전신이 맑아지는 세련된 미래 인프라 전경입니다.",
        content_data: {
          items: [
            { title: "비대칭 셔츠를 입은 런웨이 모델", description: "사이버 옐로우 배경 아래 은빛 아일렛 코트를 휘날리며 워킹하는 시크하고 도발적인 찰나 화보 컷", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
            { title: "은빛 철제 프레임 행거 의류 숍", description: "해체주의 드레스와 자켓들이 알루미늄 랙에 매달려 있고 바닥은 거친 생 콘크리트로 마감된 인프라", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "아일렛 펀칭 쇠고리 타격 스냅", description: "원목 작업대 위에서 쇠망치를 휘둘러 아일렛 쇠링 단추를 후드 원단 위에 튼튼하게 물려 뚫어내는 스케치", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "아트 피스 대여 및 제작 의뢰",
        subtitle: "뮤직비디오 방송 무대 의류 대여 신청, 커스텀 해체 자켓 제작 비용 상담, 전시기 쇼룸 단체 대관은 아래에 작성하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "아방가르드 상담 예약"
        }
      }
    ]
  },

  k_beauty_skincare: {
    templateId: "k_beauty_skincare",
    name: "글로우 랩 스페셜 K-뷰티 스킨케어",
    category: "Fashion & Beauty",
    description: "맑고 깨끗한 아침 스카이 블루와 촉촉한 물방울 에메랄드 민트, 그리고 시인성 높은 은빛 실버 포인트 배합으로 정밀한 K-뷰티 스킨 리셋을 제공하는 스튜디오 테마입니다.",
    image: "/templates/k_beauty_skincare.png",
    theme: {
      fontFamily: "Space Grotesk, Outfit, sans-serif",
      colors: {
        primary: "#0284c7",     // 시원하고 맑은 스카이 블루
        secondary: "#ccfbf1",   // 촉촉한 수분 민트 잎
        accent: "#f43f5e",      // 비타민 핑크 자몽
        background: "#fafcfd",  // 퓨어 아쿠아 오프화이트
        surface: "#ffffff",     // 깨끗한 대리석 화장대 화이트
        text: "#1e293b"         // 스마트 슬레이트 차콜 네이비
      },
      borderRadius: "rounded-md",
      glassmorphism: true
    },
    defaultSections: [
      {
        section_type: "hero",
        title: "전 세계를 뒤흔든 투명한 물광 피부의 비밀, K-뷰티 세포 세포 리터칭 과학",
        subtitle: "모든 복잡하고 예민한 각질 제거 수술을 단호히 멈추십시오. 글로우 랩 스페셜 방식으로, 한국 무농약 인삼 줄기 수액과 저분자 콜라겐 에센스를 스킨 스캐너 데이터에 따라 1:1 맞춤 배합하여 사용 3일 만에 도자기 물광 피부 장벽을 완벽 수호하는 K-뷰티 연구 살롱입니다.",
        content_data: {
          backgroundImage: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=1200&q=80",
          ctaText: "도자기 물광 세럼 체험",
          ctaLink: "#services",
          features: [
            { text: "인삼 사포닌 성분을 정교하게 농축해 피부 노화 차단을 돕는 콜라겐 에센스 100% 사용 보증" },
            { text: "피부 수분 보유량을 48시간 동안 황금 비율 비중으로 홀딩하는 아쿠아 세럼 코팅" }
          ]
        }
      },
      {
        section_type: "services",
        title: "글로우 랩 큐레이션",
        subtitle: "피부 온도를 시원하게 유지하고 모공 크기를 타이트하게 잠그는 뷰티 목록입니다.",
        content_data: {
          items: [
            {
              title: "인삼 사포닌 장벽 세럼",
              description: "수령 6년근 홍삼 수액 75%를 함유하여 칙칙하고 쳐진 노화 피부에 생기와 영양 단백질을 공급합니다.",
              icon: "Droplet"
            },
            {
              title: "저분자 아쿠아 콜라겐 팩",
              description: "모공 크기의 1/1000로 쪼갠 콜라겐 파우더 젤을 믹싱하여 흘러내림 없이 피부 탄력을 리셋합니다.",
              icon: "Heart"
            },
            {
              title: "1:1 피부 모공 정밀 측정 스캔",
              description: "디지털 스킨 스캐너 컴퓨터를 통해 유수분 밸런스와 모공 분포도를 실시간 정밀 분석하는 진단 코스입니다.",
              icon: "Zap"
            }
          ]
        }
      },
      {
        section_type: "about",
        title: "K-뷰티는 얼굴을 인위적인 약물로 성형하는 기교가 아닌, 한국 정통 자연 유기농 원맥 원료의 자생력을 피부 세포에 이식하여 속에서 우러나는 투명한 맑음을 안겨주는 웰니스 과학입니다",
        subtitle: "모든 기초 앰플은 합성 계면활성제 0% 유해 방부제 제로 오가닉 기준을 칼같이 엄수합니다.",
        content_data: {
          description: "안녕하십니까. 글로우 랩 K-뷰티 스킨케어의 총괄 원장입니다. 우리는 독한 화학 필링제와 중금속 검출 화학 화장품으로 모발과 피부 장벽을 녹여내려 악성 건조를 유발하는 상업용 체인 살롱을 단호히 거부합니다. 우리는 지리적 인증을 받은 인삼 특산물 원료를 수거하여, 쾌적하고 위생적인 거울대 인프라 속에서 당신의 영원한 젊음을 보좌하겠습니다.",
          stats: [
            { label: "평균 모공 개선 체감률", value: "98.5%" },
            { label: "보유 디지털 스킨 분석기", value: "2세트 완비" }
          ]
        }
      },
      {
        section_type: "portfolio",
        title: "아침 물광 쇼케이스 & 메디컬 스킨 룸",
        subtitle: "사진만 보아도 상쾌한 맑음과 은은한 인삼 꽃 향취가 번져나는 뷰티 갤러리입니다.",
        content_data: {
          items: [
            { title: "아크릴 격자 진열장 위 에센스 병", description: "투명한 파란 보틀 안에 물광 세럼이 채워져 오로라 네온 조명 빛을 받아 보석처럼 빛나는 모습", image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80" },
            { title: "디지털 유수분 측정 스캔 룸 코너", description: "하얀 콘크리트 테이블 위에 스마트폰 스캐너와 콜라겐 팩 믹서기들이 세련되게 정렬된 정밀 실험실", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80" },
            { title: "인삼 꽃 추출 앰플 스포이드 드롭 스냅", description: "황금빛 영양 오일 세럼 한 방울 뚝 떨어져 파란 스포이드 튜브 유리 벽면에 윤기를 코팅하는 스케치 컷", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" }
          ]
        }
      },
      {
        section_type: "contact",
        title: "모공 측정 및 스킨케어 예약",
        subtitle: "방문 예정 일시, 예약 프로그램(물광스킨/콜라겐팩/모공측정), 평소 피부 홍조 아토피 고민을 기재해 예약하세요.",
        content_data: {
          fields: ["name", "email", "phone", "message"],
          buttonText: "스킨케어 예약 신청"
        }
      }
    ]
  }
};
