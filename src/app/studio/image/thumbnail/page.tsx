"use client";

import React, { useState, useRef } from 'react';
import { 
  ImageIcon, Sparkles, ImagePlus, Layers, Search, 
  Download, Copy, RefreshCw, Wand2, Grid, HelpCircle,
  Eye, CheckCircle2, ArrowDownToLine, Sliders, Globe, Camera, Tag
} from 'lucide-react';

// 이미지 피드 객체 인터페이스 규격 완전 보존
interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  prompt: string;
  type: 'ai' | 'stock';
}

export default function NaverThumbnailPage() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("하이퍼 리얼리즘 실사");
  const [generateCount, setGenerateCount] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("tech");

  // 🌟 [빨간줄 완전 해결!] 상단 선언부에 변수 gallery와 setGallery가 정확하게 한 쌍으로 명시되었습니다.
  const [gallery, setGallery] = useState<GeneratedImage[]>([
    { 
      id: '1', 
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 
      style: '하이퍼 리얼리즘 실사', 
      prompt: '테크 기업 사무실에서 창밖 천안 시내 야경을 바라보며 회의하는 프로 마케터들의 모습', 
      type: 'ai' 
    },
    { 
      id: '2', 
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', 
      style: '무료 스톡 이미지', 
      prompt: 'Office teamwork working together', 
      type: 'stock' 
    }
  ]);

  // 🌟 10개 카테고리 × 10개 예제 총 100개 마스터 템플릿 데이터셋 완전 보존
  const promptTemplates: Record<string, { categoryLabel: string; items: string[] }> = {
    tech: {
      categoryLabel: "💻 IT / 테크",
      items: [
        "네온 블루 조명이 흐르는 미래형 홀로그램 인공지능 로봇의 두뇌 분석 장면",
        "어두운 방안에서 사이버펑크 스타일 노트북 화면을 보며 열광하는 20대 개발자",
        "스마트폰 액정에서 입체적인 3D 메타버스 그래픽이 우상향 팝업으로 뿜어져 나오는 비주얼",
        "최첨단 데이터 센터 내부의 무수히 많은 서버 랙과 은은하게 흐르는 에메랄드빛 LED 라인",
        "스마트워치 화면에서 실시간 심박수와 주식 차트가 초고해상도 실사 그래픽으로 투사되는 모습",
        "가상현실 VR 기기를 착용하고 허공의 디지털 데이터를 손으로 조작하는 미래지향적 인물",
        "양자 컴퓨터 코어 내부에서 빛의 입자들이 원형으로 빠르게 가속하며 충돌하는 테크니컬 아트",
        "클라우드 네트워크망이 전 세계 지구본 위로 유기적으로 연결되어 반짝이는 인프라 조감도",
        "고급스러운 블랙 데스크 위에 정갈하게 배치된 맥북, 키보드, 아이패드 마케터 셋업 데스크테리어",
        "AI 음성 인식 인터페이스가 공기 중에 파동 형태로 부드러운 그라데이션 라인을 그리는 비주얼"
      ]
    },
    food: {
      categoryLabel: "🍕 맛집 / 요리",
      items: [
        "갓 구워낸 시그니처 화덕 피자 위에서 치즈가 폭포처럼 길게 늘어나며 연기가 피어오르는 실사",
        "고급 레스토랑의 미디엄 레어 스테이크가 육즙을 머금은 채 단면이 깔끔하게 잘려 있는 미식 탑뷰",
        "제주도 바다 배경의 횟집 테이블 위, 얼음이 깔린 접시에 정갈하게 세팅된 투명한 참돔 회",
        "루프탑 카페에서 햇살을 받으며 시원한 아이스 아메리카노 유리잔 겉면에 물방울이 맺힌 감성 스냅",
        "치즈가 듬뿍 올라간 매콤한 국물 떡볶이가 무쇠 냄비 안에서 보글보글 끓고 있는 클로즈업",
        "일본식 정통 차슈 라멘 그릇 위로 반숙 계란과 진한 돈코츠 국물이 조화를 이루는 고화질 푸드",
        "원목 도마 위에서 싱싱한 연어와 아보카도가 정밀한 셰프의 칼날 옆에 배치된 신선한 요리 포스터",
        "철판 위에서 두툼한 삼겹살과 김치, 마늘이 지글지글 소리를 내며 노릇하게 익어가는 먹음직스러운 장면",
        "말차 크림이 흘러내리는 3단 수플레 팬케이크가 화이트 세라믹 접시 위에 안착한 디저트 뷰",
        "전통 한정식 상차림, 놋그릇에 담긴 정갈한 비빔밥과 12첩 반상이 나란히 정렬된 웅장한 항공샷"
      ]
    },
    finance: {
      categoryLabel: "💵 금융 / 재테크",
      items: [
        "황금색 비트코인 실물 주화들이 유리 병안에 가득 차 있고 뒤로 우상향 주식 차트가 빛나는 연출",
        "태블릿 화면 위에 디지털 캔들 차트가 연이어 양봉을 그리며 폭발적인 상승 곡선을 그리는 모습",
        "고급 가죽 지갑 안에서 새 5만 원권 지폐 다발이 정갈하게 머리를 내밀고 있는 부의 상징",
        "모던한 서재 테이블 위, 만년필과 함께 놓인 자산 포트폴리오 리포트와 금빛 가득한 스펙트럼",
        "디지털 세계 지도 위로 달러, 유로, 엔화, 원화 기호들이 홀로그램 입자로 둥둥 떠다니는 금융 테크",
        "모내기를 하듯 작은 새싹 주변으로 금화들이 나무 열반처럼 열려 있는 복리 이자의 시각적 형상화",
        "빌딩 숲을 배경으로 정장을 입은 비즈니스맨이 금융 피드 앱을 보며 자신감 넘치는 미소를 짓는 컷",
        "유리 저금통 안에 100원, 500원 동전들이 차곡차곡 쌓여 마침내 황금 모래로 변하는 마법 같은 뷰",
        "모니터 3대에 실시간 글로벌 환율 데이터와 마진 거래 그래프가 빼곡하게 구동되는 트레이더 룸",
        "주택 청약 통장과 신축 아파트 단지의 열쇠가 황금빛 리본에 묶여 대리석 위에 놓인 홈 테크 비주얼"
      ]
    },
    travel: {
      categoryLabel: "✈️ 여행 / 레저",
      items: [
        "에메랄드빛 몰디브 바다 위 수상 방갈로에서 썬베드에 누워 에메랄드 탄산수를 마시는 1인 힐링 뷰",
        "유럽 파리 에펠탑을 배경으로 캐리어를 끌고 뒤를 돌아보며 환하게 웃는 여행 크리에이터 스냅",
        "스위스 알프스 만년설 산맥 한가운데를 가로지르는 붉은색 기차와 침엽수림의 웅장한 대비 드론샷",
        "발리 우붓의 정글이 내다보이는 인피니티 풀 수영장 끝에 걸터앉아 아침 햇살을 맞이하는 여유",
        "캠핑카 문을 열자마자 눈앞에 은하수가 쏟아지는 밤하늘과 모닥불이 타오르는 야간 감성 캠핑",
        "일본 교토의 고즈넉한 대나무 숲길(아라시야마)을 기모노를 입고 조용히 걸어가는 뒷모습",
        "미국 그랜드 캐니언 절벽 끝에서 거대한 대자연을 내려다보며 양팔을 벌리고 있는 모험가의 구도",
        "아이슬란드 오로라가 밤하늘을 초록빛 그라데이션으로 물들인 가운데 불이 켜진 작은 텐트 한 동",
        "뉴욕 타임스퀘어의 화려한 전광판 불빛 사이를 카메라를 목에 걸고 활보하는 스트리트 포토그래퍼",
        "태국 방콕 카오산로드 야시장의 화려한 네온사인과 툭툭이 기차가 궤적을 그리며 지나가는 야경"
      ]
    },
    beauty: {
      categoryLabel: "💄 뷰티 / 패션",
      items: [
        "고급스러운 대리석 매트 위에 스포이드 파운데이션 화장품 액체 한 방울이 투명하게 떨어지는 클로즈업",
        "미니멀한 핑크빛 스튜디오에서 트렌디한 오버핏 가죽 자켓을 입고 포즈를 취하는 패션 모델",
        "유리병에 담긴 천연 오가닉 향수 주변으로 핑크빛 장미 꽃잎들이 수놓아진 산뜻한 인플루언서 무드",
        "시크한 매트 블랙 립스틱이 부드럽게 깎여 나간 단면과 화려한 골드 에코 케이스 디자인",
        "조명 거울 앞에서 메이크업 브러시로 섀도우를 바르는 모델의 눈동자가 보석처럼 빛나는 찰나",
        "클린 스튜디오 뷰, 화이트 파우더가 공기 중에 미세하게 날리며 향수 무리가 은은하게 연출된 컷",
        "유럽풍 스트리트 패션, 롱코트와 선글라스를 매칭하고 횡단보도를 시크하게 건너는 시티 가이",
        "네일 아트를 마친 화려한 홀로그램 그라데이션 손톱들이 크리스탈 보틀을 쥐고 있는 손 스냅",
        "친환경 리유저블 패키지에 담긴 비건 수분 크림 보틀과 물방울이 맺힌 초록색 나뭇잎의 조화",
        "화려한 런웨이 무대 위, 플래시 세례를 받으며 워킹하는 모델의 실루엣과 백스테이 조명 피드"
      ]
    },
    biz: {
      categoryLabel: "📈 마케팅 / 비즈",
      items: [
        "화이트보드 가득 형형색색의 포스트잇과 아이디어 마인드맵이 그려진 세련된 스타트업 회의실",
        "대형 스크린에 마케팅 유입 깔대기(Funnel) 그래프와 전환율 지표가 파란색으로 분석되는 장면",
        "비즈니스 미팅 룸, 정장을 입은 두 대표가 신뢰감 넘치는 표정으로 힘차게 악수를 나누는 순간",
        "카페 창가 자리에 놓인 노트북 화면 속 가득 차 있는 노션 워크스페이스와 1인 기업가의 손",
        "성공적인 프레젠테이션 무대, 연사가 대형 LED 화면 앞에서 청중들을 향해 열정적으로 제스처하는 구도",
        "탁 트인 공유 오피스 전경, 통유리 너머로 천안 테크노파크 인프라가 보이고 협업하는 팀원들",
        "아이패드 펜슬로 디지털 매거진 광고 시안과 레이아웃 와이어프레임을 드로잉하는 디자이너의 손",
        "체크리스트 노트 위에 만년필로 'SUCCESS' 문구를 정갈하게 적고 체크박스에 체크하는 클로즈업",
        "글로벌 경제 매거진 표지 스타일, 세련된 타이포그래피와 당당한 CEO의 인물 프로필 사진",
        "체인 기어가 유기적으로 맞물려 돌아가며 그 틈새로 황금빛 빛줄기가 뿜어져 나오는 협업의 은유"
      ]
    },
    edu: {
      categoryLabel: "📚 교육 / 자기계발",
      items: [
        "두꺼운 인문학 책들이 빈티지 원목 책장에 가득 차 있고 은은한 스탠드 조명이 비추는 서재",
        "새벽 4시, 켜져 있는 독서실 스탠드 아래 형광펜으로 빽빽하게 밑줄이 쳐진 전공 서적과 커피잔",
        "졸업 학사모가 파란 하늘 위로 수십 개가 동시에 던져져 날아가는 청춘들의 영광스러운 순간",
        "영어 단어와 수학 공식 홀로그램 입자들이 머리 주변으로 은하수처럼 회전하며 흡수되는 교육 테크",
        "이어폰을 끼고 태블릿으로 온라인 명사 특강 강의를 들으며 노트 필기에 집중하는 학생의 시선",
        "안경을 쓴 교수가 대형 대학교 강의실 칠판에 정교한 물리 방정식을 수필로 작성하는 지성미 넘치는 뷰",
        "새하얀 다이어리 첫 페이지에 2026년 버킷리스트와 목표 지표를 캘리그라피로 정성껏 적은 모습",
        "어두운 산 정상에 마침내 도달하여 떠오르는 붉은 태양을 마주하고 숨을 고르는 자기계발 러너",
        "도서관 통유리 창틀 사이로 아침 햇살이 스며들며 책상 위 펼쳐진 백과사전에 먼지 입자가 빛나는 무드",
        "아이와 부모가 머리를 맞대고 다채로운 색상의 우주 행성 입체 교구를 조립하는 교육 홈 스냅"
      ]
    },
    health: {
      categoryLabel: "🏋️ 건강 / 운동",
      items: [
        "필라테스 기구 위에서 유연하고 완벽한 아치형 자세로 스트레칭하는 강사의 실루엣과 햇살",
        "어두운 피트니스 클럽, 근육질의 남성이 땀방울을 흘리며 두꺼운 쇠 바벨을 들어 올리는 헤비 무드",
        "우드 테이블 위 정갈하게 세팅된 닭가슴살 샐러드, 방울토마토, 고구마, 단백질 쉐이크 보틀 웰빙 식단",
        "이른 아침 강변 강둑길을 따라 러닝화를 신고 힘차게 질주하는 러너의 역동적인 다리 근육 클로즈업",
        "숲속 요가 매트 위에서 가부좌를 틀고 두 눈을 감은 채 차분하게 명상에 잠겨 있는 힐링 라이프",
        "시원한 실내 수영장의 푸른 물결을 가르며 역동적으로 접영 접전 레이스를 펼치는 수영 선수의 물보라",
        "스마트워치 피트니스 앱에 오늘 걸음수 10,000보 달성 축하 메달 팝업이 화려하게 켜지는 순간",
        "홈트레이닝 가이드 뷰, 요가 매트 위에 놓인 파스텔톤 아령 두 개와 폼롤러, 스포츠 타월의 정물",
        "사이클 선수가 산악 도로의 가파른 곡선 구간을 헬멧을 쓰고 무서운 속도로 코너링하는 아드레날린 뷰",
        "신선한 아보카도와 바나나, 케일이 믹서기 안에서 초록색 건강 주스로 시원하게 갈려 나가는 역동 샷"
      ]
    },
    estate: {
      categoryLabel: "🏠 부동산 / 인테리어",
      items: [
        "통유리창 너머로 시티뷰가 한눈에 펼쳐지는 최고급 펜트하우스 거실의 화이트 모던 가죽 소파 세팅",
        "신축 아파트 단지 중앙 광장에 분수대가 흐르고 주변 조경 나무들이 완벽하게 어우러진 고급 조감도",
        "우드와 화이트가 조화를 이루는 북유럽풍 미니멀 주방, 아일랜드 식탁 위에 놓인 작은 화분",
        "건축 설계사 책상 위, 정밀하게 드로잉된 도면 청사진 위에 주택 입체 미니어처 모형이 올려진 뷰",
        "앤틱한 벽난로 안에서 장작불이 타오르고 그 앞에 두꺼운 러그와 1인용 안락의자가 배치된 겨울 거실",
        "복층형 오피스텔 내부, 세련된 철제 계단과 높은 층고를 통해 들어오는 오후 3시의 긴 채광 그림자",
        "원목 침대 프레임과 호텔식 새하얀 구스 이불이 포근하게 정돈된 아늑한 마스터 침실 인테리어",
        "황금빛 석양을 받아 외벽 유리창 전체가 보석처럼 반짝이는 강남 도심의 초고층 빌딩 오피스 외관",
        "테라스 문을 열면 개인 정원과 미니 수영장이 연결되는 도심형 단독 타운하우스의 이국적인 전경",
        "새 집 마루 바닥 위에 놓인 입주 축하 웰컴 플라워 바구니와 반짝이는 골드 도어락 열쇠"
      ]
    },
    culture: {
      categoryLabel: "🎬 문화 / 예술 / 취미",
      items: [
        "콘서트 무대 위, 화려한 레이저 조명 세례 속에서 일렉 기타를 메고 열창하는 록 밴드 보컬의 열기",
        "영화관 어둠 속에서 팝콘 통을 들고 입체 안경을 쓴 채 대형 스크린에 몰입해 있는 관객들의 눈빛",
        "아틀리에 화실 작업실, 물감이 캔버스 전체에 거칠게 유화 질감으로 페인팅 되어 가고 있는 작가의 붓",
        "턴테이블 블루투스 오디오 위에서 LP 판이 회전하고 있고 뒤로 은은한 레트로 LP 바 인테리어",
        "그랜드 피아노 건반 위로 연주자의 손가락이 미끄러지듯 움직이며 건반 표면에 조명이 반사되는 순간",
        "화려한 조명이 빛나는 뮤지컬 무대, 드레스를 입은 여배우가 독창 솔로 넘버를 부르는 극적인 클라이맥스",
        "만화가 데스크, 신티크 액정 타블렛 위로 정교한 웹툰 캐릭터 선화 드로잉이 디지털 펜으로 그려지는 과정",
        "가죽 공방 데스크, 구리 망치와 송곳으로 수제 가죽 지갑의 스티치 라인 구멍을 뚫는 장인의 손길",
        "도예 물레 위에서 찰흙이 부드럽게 돌아가며 도예가의 젖은 두 손에 의해 아름다운 도자기 호리병이 되는 찰나",
        "수많은 미술품 전시 액자가 화이트 월 벽면에 정갈하게 걸려 있고 관람객이 뒷짐 지고 사색하는 갤러리 복도"
      ]
    }
  };

  const handleSelectTemplate = (promptText: string) => {
    setImagePrompt(promptText);
  };

  const handleAiGenerateImage = (count: number) => {
    if (!imagePrompt) return alert("만들고 싶은 이미지의 묘사나 키워드를 입력해 주세요!");
    setIsGenerating(true);

    setTimeout(() => {
      const newImages: GeneratedImage[] = Array.from({ length: count }).map((_, i) => ({
        id: `ai-${Date.now()}-${i}`,
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 
        style: selectedStyle,
        prompt: imagePrompt,
        type: 'ai'
      }));

      setGallery(prev => [...newImages, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSearchStockImages = () => {
    if (!stockSearchQuery) return alert("검색할 무료 이미지 키워드를 입력하세요!");
    setIsStockLoading(true);

    setTimeout(() => {
      const stockImages: GeneratedImage[] = [
        { 
          id: `stock-${Date.now()}-1`, 
          url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', 
          style: '무료 스톡 이미지', 
          prompt: stockSearchQuery, 
          type: 'stock' 
        }
      ];
      setGallery(prev => [...stockImages, ...prev]);
      setIsStockLoading(false);
    }, 1000);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("이미지 주소가 클립보드에 복사되었습니다. 에디터 본문에 바로 삽입 가능합니다!");
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-4 gap-4 text-zinc-100 overflow-hidden">
      
      {/* 👈 1번째 면: 제일 왼쪽 인프라 조작 영역 */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-y-auto pr-1.5 custom-scrollbar">
        
        {/* AI 엔진 세팅 블록 */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-4 shadow-xl shrink-0">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
            <Wand2 size={14} /> AI Thumbnail Engine
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">1. 이미지 생성 프롬프트 묘사</label>
              <textarea 
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="내용을 직접 쓰거나 아래 템플릿 저장소에서 칩을 클릭하면 자동 주입됩니다..."
                className="w-full h-24 p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 resize-none font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">2. 이미지 화풍 스타일 선택</label>
              <select 
                value={selectedStyle} 
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
              >
                <option>하이퍼 리얼리즘 실사 (Photo)</option>
                <option>재패니즈 사이버펑크 애니메이션 (Anime)</option>
                <option>네이버 블로그용 미니멀 일러스트 (Vector)</option>
                <option>웅장한 3D 입체 팝아트 (Cinematic 3D)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">3. 동시 생성 이미지 팩 개수</label>
              <select 
                value={generateCount} 
                onChange={(e) => setGenerateCount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
              >
                <option value="1">대표 썸네일용 1장 생성</option>
                <option value="3">본문 패키지용 3장 일괄 생성</option>
                <option value="5">체류시간 극대화용 5장 메가 팩 생성</option>
              </select>
            </div>
          </div>

          <button 
            onClick={() => handleAiGenerateImage(parseInt(generateCount))}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-zinc-800 text-white text-xs font-black rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={14} className="animate-spin text-blue-400" /> AI 그래픽 압축 렌더링 중...
              </>
            ) : (
              <>
                <Sparkles size={14} /> AI 이미지 생성 개시
              </>
            )}
          </button>
        </div>

        {/* 무료 이미지 탐색 블록 */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-3 shadow-xl shrink-0">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <Globe size={14} /> Free Stock Finder
          </h3>
          <div className="relative text-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              type="text"
              value={stockSearchQuery}
              onChange={(e) => setStockSearchQuery(e.target.value)}
              placeholder="무료 스톡 사진 검색 (영문 권장)"
              className="w-full pl-9 pr-14 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700"
            />
            <button 
              onClick={handleSearchStockImages}
              disabled={isStockLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-zinc-800 text-emerald-400 font-black rounded-lg text-[10px]"
            >
              {isStockLoading ? "조회중" : "검색"}
            </button>
          </div>
        </div>

        {/* 10개 카테고리별 100선 프롬프트 가이드 패널 */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4 shadow-xl flex-1 flex flex-col min-h-[400px]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400 flex items-center gap-1.5">
            <Tag size={14} /> Prompt Blueprint Hub
          </h3>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
            원하는 블로그 분야를 선택하고 마음에 드는 문장 예시를 터치하세요. 프롬프트 창에 자동으로 안착됩니다.
          </p>

          <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar shrink-0 border-b border-zinc-800/60">
            {Object.entries(promptTemplates).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight transition-all whitespace-nowrap shrink-0 border ${
                  activeCategory === key 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-md' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {value.categoryLabel}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
            {promptTemplates[activeCategory]?.items.map((template, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectTemplate(template)}
                className="p-2.5 rounded-xl border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900 hover:border-amber-500/20 text-[11px] text-zinc-400 hover:text-zinc-200 font-medium leading-relaxed transition-all cursor-pointer text-left relative group select-none flex items-start gap-1.5"
              >
                <span className="text-[10px] font-mono font-bold text-amber-500/60 mt-0.5 shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                <span className="flex-1 text-zinc-400 group-hover:text-zinc-200 transition-colors">{template}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 💻 2, 3번째 면: 웅장한 대형 라이브러리 피드 갤러리 */}
      <div className="lg:col-span-3 flex flex-col bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-md h-full shadow-2xl">
        <div className="h-14 border-b border-zinc-800 bg-zinc-950/60 px-6 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-black text-zinc-200 flex items-center gap-2">
            <Grid size={16} className="text-blue-400" /> 생성 및 수집된 미디어 에셋 라이브러리 ({gallery.length})
          </h2>
          <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-md font-mono">
            ENGINE STATUS: <strong className="text-blue-400">OPTIMIZED</strong>
          </span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-zinc-950/25">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div 
                key={img.id}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-3 overflow-hidden shadow-xl transition-all duration-300 hover:border-zinc-700/80 flex flex-col"
              >
                <div className="relative w-full h-54 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="Generated Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow-md border ${
                      img.type === 'ai' ? 'bg-blue-600/90 border-blue-500 text-white' : 'bg-emerald-600/90 border-emerald-500 text-white'
                    }`}>
                      {img.type === 'ai' ? '🤖 AI GENERATED' : '🌐 STOCK FREE'}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded-md text-zinc-300 backdrop-blur-sm">
                      {img.style}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-3 pt-1">
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-2">
                    <span className="text-zinc-500 font-bold">Prompt:</span> {img.prompt}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button 
                      onClick={() => handleCopyUrl(img.url)}
                      className="py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Copy size={13} /> 링크 주소 복사
                    </button>
                    <a 
                      href={img.url} 
                      download={`creaibox-${img.id}.jpg`}
                      className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 hover:text-emerald-300 border border-zinc-700/60 text-xs font-black transition-all flex items-center justify-center gap-1"
                    >
                      <ArrowDownToLine size={13} /> 고해상도 다운
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}