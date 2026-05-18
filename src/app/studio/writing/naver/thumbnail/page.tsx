"use client";

import React, { useState } from 'react';
import { 
  ImageIcon, Sparkles, ImagePlus, Layers, Search, 
  Copy, RefreshCw, Wand2, Grid, HelpCircle,
  Eye, CheckCircle2, ArrowDownToLine, Sliders, Globe, Tag,
  FileText, ArrowRightLeft, LayoutGrid, Check, Trash2
} from 'lucide-react';

// 인터페이스 규격 완전 보존
interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  prompt: string;
  type: 'ai' | 'stock';
}

interface MockPost {
  id: string;
  title: string;
  keyword: string;
  content: string;
}

export default function NaverThumbnailPage() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("하이퍼 리얼리즘 실사");
  const [generateCount, setGenerateCount] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("tech");
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("1");

  // 🌟 1단 원고 리스트 데이터 (보존)
  const [posts, setPosts] = useState<MockPost[]>([
    { id: '1', title: 'AI 자동화 수익화의 비밀', keyword: 'AI 자동화', content: 'AI 자동화를 통한 수익 시스템은 노동의 한계를 뛰어넘습니다...' },
    { id: '2', title: '천안 맛집 TOP 5 추천', keyword: '천안 맛집', content: '제주도 바다 배경의 횟집 테이블 위...' },
    { id: '3', title: '2026 정부지원금 가이드', keyword: '정부지원금', content: '2026년 소상공인 대상 대규모 지원 정책...' },
    { id: '4', title: 'Next.js 15 성능 분석', keyword: 'Next.js', content: '양자 컴퓨터 코어 내부에서 빛의 입자들이...' }
  ]);
  
  // 🌟 갤러리 피드 데이터 (보존)
  const [gallery, setGallery] = useState<GeneratedImage[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', style: '하이퍼 리얼리즘 실사', prompt: '테크 기업 사무실에서 회의하는 프로 마케터들의 모습', type: 'ai' }
  ]);

  // 🌟 [보존] 10개 테마 100선 마스터 템플릿 데이터셋
  const promptTemplates: Record<string, { categoryLabel: string; items: string[] }> = {
    tech: { categoryLabel: "💻 IT / 테크", items: ["네온 블루 조명이 흐르는 미래형 인공지능 로봇", "어두운 방안에서 노트북 화면을 보며 열광하는 개발자", "3D 메타버스 그래픽이 팝업으로 뿜어져 나오는 비주얼", "데이터 센터 내부의 서버 랙과 에메랄드빛 LED 라인", "스마트워치 화면에서 실시간 주식 차트가 투사되는 모습", "VR 기기를 착용하고 데이터를 조작하는 인물", "양자 컴퓨터 코어 내부의 테크니컬 아트", "전 세계 지도를 연결하는 클라우드 네트워크망", "블랙 데스크 위의 맥북, 키보드 데스크테리어", "AI 음성 인식 인터페이스의 부드러운 파동"] },
    food: { categoryLabel: "🍕 맛집 / 요리", items: ["치즈가 폭포처럼 늘어나는 화덕 피자 실사", "육즙 가득한 미디엄 레어 스테이크 미식 탑뷰", "제주도 바다 배경의 정갈한 참돔 회 세팅", "루프탑 카페의 햇살 가득한 아이스 아메리카노", "무쇠 냄비에서 끓고 있는 매콤한 국물 떡볶이", "돈코츠 국물과 차슈가 어우러진 일본 라멘", "셰프의 칼날 옆 신선한 연어와 아보카도", "철판에서 노릇하게 익어가는 삼겹살과 김치", "말차 크림이 흘러내리는 3단 수플레 팬케이크", "웅장한 항공샷으로 담은 전통 한정식 상차림"] },
    finance: { categoryLabel: "💵 금융 / 재테크", items: ["비트코인 주화와 우상향 주식 차트 연출", "디지털 캔들 차트의 폭발적인 상승 곡선", "지갑 안의 새 5만원권 지폐 다발", "만년필과 함께 놓인 자산 포트폴리오 리포트", "글로벌 통화 기호들이 떠다니는 홀로그램", "금화가 나무 열매처럼 열린 복리 이자 형상화", "금융 앱을 보며 미소 짓는 자신감 넘치는 인물", "동전이 황금 모래로 변하는 저금통 마법 뷰", "실시간 환율 데이터가 구동되는 트레이더 룸", "대리석 위의 주택 청약 통장과 신축 키"] },
    travel: { categoryLabel: "✈️ 여행 / 레저", items: ["몰디브 바다 위 수상 방갈로 힐링 뷰", "에펠탑 배경의 여행 크리에이터 스냅", "스위스 알프스 설산을 지나는 붉은 기차 드론샷", "우붓 정글이 보이는 인피니티 풀의 아침", "은하수 아래 모닥불 타오르는 감성 캠핑", "교토 대나무 숲을 기모노 입고 걷는 뒷모습", "그랜드 캐니언 절벽 끝 모험가의 구도", "밤하늘 초록 오로라와 작은 텐트 한 동", "뉴욕 타임스퀘어를 활보하는 포토그래퍼", "방콕 야시장의 화려한 네온사인과 툭툭이"] },
    beauty: { categoryLabel: "💄 뷰티 / 패션", items: ["대리석 위 스포이드 파운데이션 클로즈업", "오버핏 가죽 자켓을 입은 패션 모델", "장미 꽃잎이 수놓아진 천연 오가닉 향수", "시크한 매트 블랙 립스틱과 골드 케이스", "섀도우를 바르는 모델의 보석 같은 눈동자", "화이트 파우더가 날리는 감성 스튜디오 뷰", "코트와 선글라스를 매칭한 시티 가이 스트릿", "홀로그램 네일과 크리스탈 보틀 손 스냅", "비건 수분 크림과 물방울 맺힌 나뭇잎", "런웨이 무대 위 화려한 모델 실루엣"] },
    biz: { categoryLabel: "📈 마케팅 / 비즈", items: ["포스트잇이 가득한 스타트업 회의실", "마케팅 깔대기 그래프와 전환율 지표 분석", "정장을 입은 두 대표의 신뢰감 넘치는 악수", "카페 창가 노트북과 1인 기업가의 손", "대형 LED 화면 앞 열정적인 프레젠테이션", "천안 테크노파크 인프라가 보이는 공유 오피스", "아이패드로 광고 시안을 그리는 디자이너", "SUCCESS 문구를 적는 만년필 클로즈업", "세련된 타이포와 CEO 인물 프로필 사진", "유기적으로 맞물려 돌아가는 체인 기어 협업"] },
    edu: { categoryLabel: "📚 교육 / 자기계발", items: ["은은한 조명 아래 책이 가득한 서재", "새벽 4시 독서실 스탠드 아래 전공 서적", "하늘 위로 던져지는 졸업 학사모 순간", "영어 단어와 수학 공식 홀로그램 입자", "온라인 명사 특강 강의를 듣는 학생 시선", "정교한 물리 방정식을 쓰는 교수님의 칠판", "다이어리 첫 페이지 2026년 버킷리스트", "산 정상에서 태양을 마주한 자기계발 러너", "도서관 창틀 사이 아침 햇살과 백과사전", "부모와 아이가 함께 조립하는 우주 교구"] },
    health: { categoryLabel: "🏋️ 건강 / 운동", items: ["필라테스 기구 위 유연한 스트레칭 실루엣", "땀방울 흘리며 바벨을 드는 피트니스 컷", "닭가슴살 샐러드와 단백질 쉐이크 식단", "강변을 따라 질주하는 러너의 다리 근육", "숲속 요가 매트 위 차분한 명상 힐링", "실내 수영장을 가르는 역동적인 접영 물보라", "스마트워치 1만보 달성 축하 메달 팝업", "요가 매트와 폼롤러 홈트레이닝 정물", "가파른 산악 도로를 코너링하는 사이클 선수", "믹서기 안에서 갈려나가는 초록 건강 주스"] },
    estate: { categoryLabel: "🏠 부동산 / 인테리어", items: ["통유리창 시티뷰 펜트하우스 화이트 거실", "분수대가 흐르는 신축 아파트 단지 조감도", "북유럽풍 미니멀 주방과 아일랜드 식탁", "도면 청사진 위 주택 입체 미니어처 모형", "벽난로 장작불 앞 두꺼운 러그와 안락의자", "세련된 철제 계단의 복층 오피스텔 내부", "호텔식 새하얀 구스 이불 마스터 침실", "석양을 받아 반짝이는 강남 빌딩 외관", "개인 정원과 수영장이 연결된 타운하우스", "입주 축하 꽃바구니와 골드 도어락 열쇠"] },
    culture: { categoryLabel: "🎬 문화 / 예술 / 취미", items: ["레이저 조명 속 일렉 기타를 멘 록 보컬", "영화관 어둠 속 팝콘과 몰입한 관객들", "캔버스 유화 질감을 그리는 작가의 붓", "LP 판이 회전하는 레트로 LP 바 인테리어", "건반 위 조명이 반사되는 피아노 연주자", "뮤지컬 무대 드레스를 입은 여배우 솔로", "신티크 위 웹툰 캐릭터 드로잉 과정", "가죽 지갑 구멍을 뚫는 공방 장인의 손길", "물레 위에서 빚어지는 도자기 호리병", "미술품 전시 액자와 사색하는 관람객"] }
  };

  // 🤖 [보존] 원고 연동 핸들러
  const handleSelectPostLink = (post: MockPost) => {
    setSelectedPostId(post.id);
    setIsSyncLoading(true);
    setTimeout(() => {
      const aiAnalyzedVisualPrompt = `[🔗 원고 연동 비주얼 템플릿] ${post.keyword} 주제에 매칭되는 세련된 배경 디자인, 화려한 그라데이션 조명 효과, 4K 고해상도 그래픽`;
      setImagePrompt(aiAnalyzedVisualPrompt);
      setStockSearchQuery(post.keyword);
      setIsSyncLoading(false);
    }, 400);
  };

  const handleAiGenerateImage = (count: number) => {
    if (!imagePrompt) return alert("프롬프트를 입력해 주세요!");
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
    if (!stockSearchQuery) return alert("키워드를 입력하세요!");
    setIsStockLoading(true);
    setTimeout(() => {
      const stockImages: GeneratedImage[] = [{ id: `stock-${Date.now()}-1`, url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', style: '무료 스톡 이미지', prompt: stockSearchQuery, type: 'stock' }];
      setGallery(prev => [...stockImages, ...prev]);
      setIsStockLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto h-[calc(100vh-100px)] grid grid-cols-1 xl:grid-cols-5 gap-4 text-zinc-100 overflow-hidden">
      
      {/* 👈 1단 면 (좌측): 내 저장 원고 인벤토리 (보존) */}
      <div className="xl:col-span-1 flex flex-col gap-3 h-full overflow-hidden border-r border-zinc-800/40 pr-3">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5 shrink-0 pl-1">
          <FileText size={13} /> Manuscript Inventory
        </h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => handleSelectPostLink(post)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative group ${
                selectedPostId === post.id ? 'bg-zinc-900 border-emerald-500/40 shadow-lg' : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className={`text-[11px] font-black leading-tight ${selectedPostId === post.id ? 'text-emerald-400' : 'text-zinc-200'}`}>{post.title}</span>
                {selectedPostId === post.id && <Check size={12} className="text-emerald-400 shrink-0" />}
              </div>
              <p className="text-[10px] text-zinc-500 font-medium mt-1">#{post.keyword}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 💻 2단 면 (중앙): ★사장님 지시 적용! [컨트롤러 + 스톡 검색 + 블루프린트 허브 통합] */}
      <div className="xl:col-span-2 flex flex-col gap-4 h-full overflow-y-auto pr-1.5 custom-scrollbar border-r border-zinc-800/30">
        
        {/* 블록 1: AI 엔진 세팅 */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-4 shrink-0 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-400 flex items-center gap-1.5">
            <Wand2 size={13} /> AI Thumbnail Engine
          </h3>
          <div className="space-y-4 text-xs">
            <textarea 
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="직접 입력하거나 하단의 템플릿을 선택하세요..."
              className="w-full h-24 p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none leading-relaxed"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 font-bold mb-1.5 pl-1">화풍 스타일</label>
                <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none">
                  <option>하이퍼 리얼리즘 실사 (Photo)</option>
                  <option>재패니즈 애니메이션 (Anime)</option>
                  <option>네이버 블로그용 일러스트 (Vector)</option>
                  <option>웅장한 3D 입체 팝아트 (3D)</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-500 font-bold mb-1.5 pl-1">생성 수량</label>
                <select value={generateCount} onChange={(e) => setGenerateCount(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none">
                  <option value="1">1장 생성</option>
                  <option value="3">3장 팩</option>
                  <option value="5">5장 메가팩</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={() => handleAiGenerateImage(parseInt(generateCount))} disabled={isGenerating || isSyncLoading} className="w-full py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-black rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />} AI 이미지 생성 시작
          </button>
        </div>

        {/* 블록 2: 스톡 파인더 (보존) */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-3 shrink-0 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
            <Globe size={13} /> Free Stock Finder
          </h3>
          <div className="relative text-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input type="text" value={stockSearchQuery} onChange={(e) => setStockSearchQuery(e.target.value)} placeholder="무료 실사 이미지 검색 (영어 권장)" className="w-full pl-10 pr-16 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200" />
            <button onClick={handleSearchStockImages} disabled={isStockLoading} className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-zinc-800 text-emerald-400 font-black rounded-lg text-[10px]">찾기</button>
          </div>
        </div>

        {/* 🌟 블록 3: [이동 완료] Prompt Blueprint Hub (10개 카테고리 바둑판 노출) */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4 shadow-xl flex-1 flex flex-col min-h-[500px]">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-400 flex items-center gap-1.5 shrink-0">
            <Tag size={13} /> Prompt Blueprint Hub
          </h3>
          
          {/* 카테고리 바둑판 전면 배치 (보존) */}
          <div className="grid grid-cols-2 gap-1.5 bg-zinc-950 p-2 rounded-2xl border border-zinc-850 shrink-0">
            {Object.entries(promptTemplates).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`py-2 rounded-xl text-[10px] font-black tracking-tighter text-center transition-all border ${
                  activeCategory === key ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-inner' : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {value.categoryLabel}
              </button>
            ))}
          </div>

          {/* 10개 예제 리스트 (보존) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-0.5">
            {promptTemplates[activeCategory]?.items.map((template, idx) => (
              <div
                key={idx}
                onClick={() => setImagePrompt(template)}
                className="p-3 rounded-xl border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900 hover:border-amber-500/20 text-[11px] text-zinc-400 hover:text-zinc-200 font-medium leading-relaxed transition-all cursor-pointer text-left flex items-start gap-2"
              >
                <span className="text-[10px] font-mono font-bold text-amber-500/50 mt-0.5 shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                <span className="flex-1 text-zinc-400 leading-tight">{template}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 💻 3단 면 (우측): 광활한 미디어 라이브러리 피드 (보존) */}
      <div className="xl:col-span-2 flex flex-col bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-md h-full shadow-2xl">
        <div className="h-14 border-b border-zinc-800 bg-zinc-950/60 px-6 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-black text-zinc-300 flex items-center gap-2">
            <Grid size={16} className="text-blue-400" /> Media Library ({gallery.length})
          </h2>
          {isSyncLoading && <span className="text-[10px] font-black text-emerald-400 animate-pulse bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">원고 분석 연동 중</span>}
        </div>

        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-zinc-950/25">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gallery.map((img) => (
              <div key={img.id} className="group relative rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-3 overflow-hidden shadow-xl flex flex-col">
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 shrink-0">
                  <img src={img.url} alt="Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-600/90 text-white shadow-lg">AI</span>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded-md text-zinc-300 backdrop-blur-sm">{img.style}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-3">
                  <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2"><span className="text-zinc-500 font-bold">Prompt:</span> {img.prompt}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(img.url); alert("링크 복사됨!"); }} className="py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 hover:bg-zinc-800"><Copy size={13} /> 링크 복사</button>
                    <a href={img.url} download className="py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400 text-[10px] font-black transition-all flex items-center justify-center gap-1.5 hover:bg-zinc-700"><ArrowDownToLine size={13} /> 다운로드</a>
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