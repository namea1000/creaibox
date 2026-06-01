"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Search,
  Copy,
  RefreshCw,
  Wand2,
  Grid,
  ArrowDownToLine,
  Globe,
  Tag,
  FileText,
  Check,
  Download,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  styleDetail?: string;
  prompt: string;
  type: "ai" | "stock";
  aspectRatio?: string;
  provider?: string;
}

interface MockPost {
  id: string;
  title: string;
  keyword: string;
  content: string;
  type: "create" | "recreate";
}

interface WritingNaverPostRecord {
  id: string | number;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  target_keyword?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

const SESSION_TIMEOUT_MS = 4000;
const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;

const styleOptions = [
  {
    label: "하이퍼 리얼리즘 실사",
    value: "hyper-realistic-photo",
    details: ["인물 실사", "제품 사진", "블로그 썸네일", "시네마틱 실사"],
  },
  {
    label: "애니메이션",
    value: "anime",
    details: ["재패니즈 애니", "웹툰 스타일", "픽사풍 3D", "사이버펑크 애니"],
  },
  {
    label: "네이버 블로그용 일러스트",
    value: "naver-blog-vector",
    details: ["미니멀 벡터", "파스텔톤", "정보성 썸네일", "아이콘 중심"],
  },
  {
    label: "웅장한 3D 입체 팝아트",
    value: "cinematic-3d-pop",
    details: ["3D 팝아트", "제품 광고 3D", "시네마틱 3D", "고급 렌더링"],
  },
];

const aspectRatioOptions = [
  { label: "3:2 네이버 블로그 썸네일", value: "3:2" },
  { label: "16:9 와이드", value: "16:9" },
  { label: "1:1 정사각형", value: "1:1" },
  { label: "4:5 인스타 피드", value: "4:5" },
  { label: "9:16 쇼츠/릴스", value: "9:16" },
];

const modelOptions = [
  { label: "OpenAI", value: "openai" },
  { label: "Gemini", value: "gemini" },
];

export default function NaverThumbnailPage() {
  const supabase = useMemo(() => createClient(), []);

  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("hyper-realistic-photo");
  const [selectedStyleDetail, setSelectedStyleDetail] = useState("인물 실사");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("3:2");
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const [generateCount, setGenerateCount] = useState("1");
  const [downloadFormat, setDownloadFormat] = useState<"png" | "webp">("png");

  const [isGenerating, setIsGenerating] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>("tech");
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [isPostListLoading, setIsPostListLoading] = useState(true);

  const selectedStyleData = styleOptions.find((style) => style.value === selectedStyle);

  const [posts, setPosts] = useState<MockPost[]>([
    {
      id: "1",
      title: "AI 자동화 수익화의 비밀",
      keyword: "AI 자동화",
      content: "AI 자동화를 통한 수익 시스템은 노동의 한계를 뛰어넘습니다...",
      type: "create",
    },
    {
      id: "2",
      title: "천안 맛집 TOP 5 추천",
      keyword: "천안 맛집",
      content: "제주도 바다 배경의 횟집 테이블 위...",
      type: "recreate",
    },
  ]);

  const [gallery, setGallery] = useState<GeneratedImage[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      style: "하이퍼 리얼리즘 실사",
      styleDetail: "샘플",
      prompt: "테크 기업 사무실에서 회의하는 프로 마케터들의 모습",
      type: "ai",
      aspectRatio: "3:2",
      provider: "sample",
    },
  ]);

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  const promptTemplates: Record<string, { categoryLabel: string; items: string[] }> = {
    tech: {
      categoryLabel: "💻 IT / 테크",
      items: [
        "네온 블루 조명이 흐르는 미래형 인공지능 로봇",
        "어두운 방안에서 노트북 화면을 보며 열광하는 개발자",
        "3D 메타버스 그래픽이 팝업으로 뿜어져 나오는 비주얼",
        "데이터 센터 내부의 서버 랙과 에메랄드빛 LED 라인",
        "스마트워치 화면에서 실시간 주식 차트가 투사되는 모습",
        "VR 기기를 착용하고 데이터를 조작하는 인물",
        "양자 컴퓨터 코어 내부의 테크니컬 아트",
        "전 세계 지도를 연결하는 클라우드 네트워크망",
        "블랙 데스크 위의 맥북, 키보드 데스크테리어",
        "AI 음성 인식 인터페이스의 부드러운 파동",
      ],
    },
    food: {
      categoryLabel: "🍕 맛집 / 요리",
      items: [
        "치즈가 폭포처럼 늘어나는 화덕 피자 실사",
        "육즙 가득한 미디엄 레어 스테이크 미식 탑뷰",
        "제주도 바다 배경의 정갈한 참돔 회 세팅",
        "루프탑 카페의 햇살 가득한 아이스 아메리카노",
        "무쇠 냄비에서 끓고 있는 매콤한 국물 떡볶이",
        "돈코츠 국물과 차슈가 어우러진 일본 라멘",
        "셰프의 칼날 옆 신선한 연어와 아보카도",
        "철판에서 노릇하게 익어가는 삼겹살과 김치",
        "말차 크림이 흘러내리는 3단 수플레 팬케이크",
        "웅장한 항공샷으로 담은 전통 한정식 상차림",
      ],
    },
    finance: {
      categoryLabel: "💵 금융 / 재테크",
      items: [
        "비트코인 주화와 우상향 주식 차트 연출",
        "디지털 캔들 차트의 폭발적인 상승 곡선",
        "지갑 안의 새 5만원권 지폐 다발",
        "만년필과 함께 놓인 자산 포트폴리오 리포트",
        "글로벌 통화 기호들이 떠다니는 홀로그램",
        "금화가 나무 열매처럼 열린 복리 이자 형상화",
        "금융 앱을 보며 미소 짓는 자신감 넘치는 인물",
        "동전이 황금 모래로 변하는 저금통 마법 뷰",
        "실시간 환율 데이터가 구동되는 트레이더 룸",
        "대리석 위의 주택 청약 통장과 신축 키",
      ],
    },
    travel: {
      categoryLabel: "✈️ 여행 / 레저",
      items: [
        "몰디브 바다 위 수상 방갈로 힐링 뷰",
        "에펠탑 배경의 여행 크리에이터 스냅",
        "스위스 알프스 설산을 지나는 붉은 기차 드론샷",
        "우붓 정글이 보이는 인피니티 풀의 아침",
        "은하수 아래 모닥불 타오르는 감성 캠핑",
        "교토 대나무 숲을 기모노 입고 걷는 뒷모습",
        "그랜드 캐니언 절벽 끝 모험가의 구도",
        "밤하늘 초록 오로라와 작은 텐트 한 동",
        "뉴욕 타임스퀘어를 활보하는 포토그래퍼",
        "방콕 야시장의 화려한 네온사인과 툭툭이",
      ],
    },
    beauty: {
      categoryLabel: "💄 뷰티 / 패션",
      items: [
        "대리석 위 스포이드 파운데이션 클로즈업",
        "오버핏 가죽 자켓을 입은 패션 모델",
        "장미 꽃잎이 수놓아진 천연 오가닉 향수",
        "시크한 매트 블랙 립스틱과 골드 케이스",
        "섀도우를 바르는 모델의 보석 같은 눈동자",
        "화이트 파우더가 날리는 감성 스튜디오 뷰",
        "코트와 선글라스를 매칭한 시티 가이 스트릿",
        "홀로그램 네일과 크리스탈 보틀 손 스냅",
        "비건 수분 크림과 물방울 맺힌 나뭇잎",
        "런웨이 무대 위 화려한 모델 실루엣",
      ],
    },
    biz: {
      categoryLabel: "📈 마케팅 / 비즈",
      items: [
        "포스트잇이 가득한 스타트업 회의실",
        "마케팅 깔대기 그래프와 전환율 지표 분석",
        "정장을 입은 두 대표의 신뢰감 넘치는 악수",
        "카페 창가 노트북과 1인 기업가의 손",
        "대형 LED 화면 앞 열정적인 프레젠테이션",
        "천안 테크노파크 인프라가 보이는 공유 오피스",
        "아이패드로 광고 시안을 그리는 디자이너",
        "SUCCESS 문구를 적는 만년필 클로즈업",
        "세련된 타이포와 CEO 인물 프로필 사진",
        "유기적으로 맞물려 돌아가는 체인 기어 협업",
      ],
    },
    edu: {
      categoryLabel: "📚 교육 / 자기계발",
      items: [
        "은은한 조명 아래 책이 가득한 서재",
        "새벽 4시 독서실 스탠드 아래 전공 서적",
        "하늘 위로 던져지는 졸업 학사모 순간",
        "영어 단어와 수학 공식 홀로그램 입자",
        "온라인 명사 특강 강의를 듣는 학생 시선",
        "정교한 물리 방정식을 쓰는 교수님의 칠판",
        "다이어리 첫 페이지 2026년 버킷리스트",
        "산 정상에서 태양을 마주한 자기계발 러너",
        "도서관 창틀 사이 아침 햇살과 백과사전",
        "부모와 아이가 함께 조립하는 우주 교구",
      ],
    },
    health: {
      categoryLabel: "🏋️ 건강 / 운동",
      items: [
        "필라테스 기구 위 유연한 스트레칭 실루엣",
        "땀방울 흘리며 바벨을 드는 피트니스 컷",
        "닭가슴살 샐러드와 단백질 쉐이크 식단",
        "강변을 따라 질주하는 러너의 다리 근육",
        "숲속 요가 매트 위 차분한 명상 힐링",
        "실내 수영장을 가르는 역동적인 접영 물보라",
        "스마트워치 1만보 달성 축하 메달 팝업",
        "요가 매트와 폼롤러 홈트레이닝 정물",
        "가파른 산악 도로를 코너링하는 사이클 선수",
        "믹서기 안에서 갈려나가는 초록 건강 주스",
      ],
    },
    estate: {
      categoryLabel: "🏠 부동산 / 인테리어",
      items: [
        "통유리창 시티뷰 펜트하우스 화이트 거실",
        "분수대가 흐르는 신축 아파트 단지 조감도",
        "북유럽풍 미니멀 주방과 아일랜드 식탁",
        "도면 청사진 위 주택 입체 미니어처 모형",
        "벽난로 장작불 앞 두꺼운 러그와 안락의자",
        "세련된 철제 계단의 복층 오피스텔 내부",
        "호텔식 새하얀 구스 이불 마스터 침실",
        "석양을 받아 반짝이는 강남 빌딩 외관",
        "개인 정원과 수영장이 연결된 타운하우스",
        "입주 축하 꽃바구니와 골드 도어락 열쇠",
      ],
    },
    culture: {
      categoryLabel: "🎬 문화 / 예술 / 취미",
      items: [
        "레이저 조명 속 일렉 기타를 멘 록 보컬",
        "영화관 어둠 속 팝콘과 몰입한 관객들",
        "캔버스 유화 질감을 그리는 작가의 붓",
        "LP 판이 회전하는 레트로 LP 바 인테리어",
        "건반 위 조명이 반사되는 피아노 연주자",
        "뮤지컬 무대 드레스를 입은 여배우 솔로",
        "신티크 위 웹툰 캐릭터 드로잉 과정",
        "가죽 지갑 구멍을 뚫는 공방 장인의 손길",
        "물레 위에서 빚어지는 도자기 호리병",
        "미술품 전시 액자와 사색하는 관람객",
      ],
    },
  };

  const resolveUserId = useCallback(async () => {
    for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
      const timeout = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), SESSION_TIMEOUT_MS);
      });

      const sessionUserIdPromise = supabase.auth
        .getSession()
        .then(({ data: { session } }) => session?.user?.id || null)
        .catch(() => null);

      const sessionUserId = await Promise.race([sessionUserIdPromise, timeout]);
      if (sessionUserId) return sessionUserId;

      const userPromise = supabase.auth
        .getUser()
        .then(({ data: { user } }) => user?.id || null)
        .catch(() => null);

      const userId = await Promise.race([userPromise, timeout]);
      if (userId) return userId;

      if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
      }
    }

    return null;
  }, [supabase]);

  useEffect(() => {
    const loadPosts = async () => {
      setIsPostListLoading(true);

      try {
        const userId = await resolveUserId();
        if (!userId) return;

        const { data, error } = await supabase
          .from("writing_naver_posts")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        const formattedPosts = ((data || []) as WritingNaverPostRecord[]).map((item) => {
          const fallbackKeyword =
            (item.categories && item.categories[0]) ||
            (item.tags && item.tags[0]) ||
            "일반 원고";

          const normalizedType: "create" | "recreate" =
            item.post_type === "recreate" ? "recreate" : "create";

          return {
            id: String(item.id),
            title: item.title || "제목 없음",
            keyword: item.target_keyword || fallbackKeyword,
            content: item.content || "",
            type: normalizedType,
          };
        });

        if (formattedPosts.length > 0) {
          setPosts(formattedPosts);

          const preferredPost = formattedPosts[0];
          setSelectedPostId(preferredPost.id);
          setImagePrompt(
            `[🔗 원고 연동 비주얼 템플릿] ${preferredPost.keyword} 주제에 매칭되는 세련된 배경 디자인, 화려한 그라데이션 조명 효과, 4K 고해상도 그래픽`
          );
          setStockSearchQuery(preferredPost.keyword);
        } else {
          setPosts([]);
          setSelectedPostId("");
        }
      } catch (error) {
        console.error("썸네일 원고 목록 로드 실패:", error);
      } finally {
        setIsPostListLoading(false);
      }
    };

    void loadPosts();
  }, [resolveUserId, supabase]);

  const handleSelectPostLink = (post: MockPost) => {
    setSelectedPostId(post.id);
    setIsSyncLoading(true);

    setTimeout(() => {
      const contentSnippet = post.content.replace(/\s+/g, " ").trim().slice(0, 140);
      const aiAnalyzedVisualPrompt = [
        `[원고 제목] ${post.title}`,
        `[핵심 키워드] ${post.keyword}`,
        `[본문 요약] ${contentSnippet}`,
        `[시각 목표] 네이버 블로그 썸네일에 적합한 강한 주제 전달력, 선명한 피사체, 클릭을 유도하는 구도, 텍스트 오버레이 없이 이미지 자체만 생성`,
      ].join("\n");

      setImagePrompt(aiAnalyzedVisualPrompt);
      setStockSearchQuery(post.keyword);
      setIsSyncLoading(false);
    }, 400);
  };

  const buildImagePrompt = (
    basePrompt: string,
    style: string,
    styleDetail: string,
    aspectRatio: string,
    post: MockPost | null
  ) => {
    const styleLabel = styleOptions.find((item) => item.value === style)?.label || style;

    const postContext = post
      ? `주제는 "${post.title}" 이고 핵심 키워드는 "${post.keyword}" 이다. 본문 맥락과 일치하는 대표 장면을 썸네일용으로 구성하라.`
      : "네이버 블로그 썸네일에 적합한 대표 장면을 구성하라.";

    return [
      postContext,
      `이미지 스타일은 "${styleLabel}" 이고 세부 스타일은 "${styleDetail}" 이다.`,
      `이미지 비율은 "${aspectRatio}" 기준으로 구성하라.`,
      "고해상도, 선명한 메인 피사체, 강한 대비, 블로그 썸네일 친화적 구도, 텍스트 없는 이미지, 워터마크 없음.",
      basePrompt,
    ].join(" ");
  };

  const getUserApiConfig = () => {
    if (selectedProvider === "openai") {
      return {
        apiKey: localStorage.getItem("openai_api_key") || "",
        model:
          localStorage.getItem("openai_model") ||
          "gpt-image-1",
      };
    }

    if (selectedProvider === "gemini") {
      return {
        apiKey:
          localStorage.getItem("gemini_postpay_api_key") || "",
        model:
          localStorage.getItem("gemini_postpay_model") ||
          "gemini-2.5-flash-image",
      };
    }

    return {
      apiKey: "",
      model: "",
    };
  };

  const handleAiGenerateImage = async (count: number) => {
    if (!imagePrompt.trim()) return alert("프롬프트를 입력해 주세요!");

    const userApiConfig = getUserApiConfig();

    if (!userApiConfig.apiKey) {
      alert(
        "APIVault에서 API Key를 먼저 입력해주세요."
      );
      return;
    }

    setIsGenerating(true);

    try {
      const styleLabel = styleOptions.find((item) => item.value === selectedStyle)?.label || selectedStyle;

      const finalPrompt = buildImagePrompt(
        imagePrompt,
        selectedStyle,
        selectedStyleDetail,
        selectedAspectRatio,
        selectedPost
      );

      const response = await fetch("/api/image-studio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          count,
          aspectRatio: selectedAspectRatio,
          provider: selectedProvider,
          model: userApiConfig.model,
          apiKey: userApiConfig.apiKey,
          style: selectedStyle,
          styleDetail: selectedStyleDetail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const rawMessage = data?.rawError ? `\n\n상세: ${data.rawError}` : "";
        throw new Error(`${data?.error || "이미지 생성에 실패했습니다."}${rawMessage}`);
      }

      const newImages: GeneratedImage[] = (data.images || []).map((img: any, i: number) => ({
        id: String(img.id || `${selectedProvider}-${Date.now()}-${i}`),
        url: img.image_url || img.url,
        style: img.style || styleLabel,
        styleDetail: img.style_detail || selectedStyleDetail,
        prompt: img.prompt || finalPrompt,
        type: "ai",
        aspectRatio: img.aspect_ratio || selectedAspectRatio,
        provider: img.provider || selectedProvider,
      }));

      if (newImages.length === 0) {
        throw new Error("생성된 썸네일이 없습니다.");
      }

      setGallery((prev) => [...newImages, ...prev]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "이미지 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchStockImages = () => {
    if (!stockSearchQuery) return alert("키워드를 입력하세요!");

    setIsStockLoading(true);

    setTimeout(() => {
      const stockImages: GeneratedImage[] = [
        {
          id: `stock-${Date.now()}-1`,
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
          style: "무료 스톡 이미지",
          styleDetail: "Unsplash",
          prompt: stockSearchQuery,
          type: "stock",
          aspectRatio: selectedAspectRatio,
          provider: "stock",
        },
      ];

      setGallery((prev) => [...stockImages, ...prev]);
      setIsStockLoading(false);
    }, 1000);
  };

  const downloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(
        `/api/image-studio/download?url=${encodeURIComponent(image.url)}&format=${downloadFormat}`
      );

      if (!response.ok) {
        throw new Error("이미지 다운로드 변환에 실패했습니다.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `creaibox-thumbnail-${image.id}.${downloadFormat}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      alert("이미지 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="grid h-[calc(100vh-100px)] w-full grid-cols-1 gap-0 overflow-hidden px-4 pl-6 text-[13px] text-zinc-100 xl:[grid-template-columns:320px_430px_minmax(0,1fr)]">
      <div className="flex h-full flex-col gap-3 overflow-hidden border-r border-zinc-800/60 py-4 pr-4">
        <h3 className="flex h-10 shrink-0 items-center gap-1.5 border-b border-zinc-800/60 pl-1 text-[13px] font-black uppercase tracking-[0.15em] text-emerald-400">
          <FileText size={13} /> Manuscript Inventory
        </h3>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
          {isPostListLoading ? (
            <div className="h-full flex items-center justify-center text-[13px] text-zinc-500 font-bold">
              원고 목록 불러오는 중...
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handleSelectPostLink(post)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative group ${selectedPostId === post.id
                  ? "bg-emerald-950/10 border-emerald-700/50"
                  : "bg-zinc-950/30 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40"
                  }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span
                    className={`text-[13px] font-black leading-tight ${selectedPostId === post.id ? "text-emerald-400" : "text-zinc-200"
                      }`}
                  >
                    {post.title}
                  </span>
                  {selectedPostId === post.id && <Check size={12} className="text-emerald-400 shrink-0" />}
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`text-[13px] font-black px-1.5 py-0.5 rounded-md border ${post.type === "recreate"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                  >
                    {post.type === "recreate" ? "RECREATE" : "CREATE"}
                  </span>
                  <p className="text-[13px] text-zinc-500 font-medium">#{post.keyword}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-[13px] text-zinc-500 font-bold text-center px-3">
              썸네일에 연결할 저장 원고가 아직 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="flex h-full flex-col gap-4 overflow-y-auto border-r border-zinc-800/60 px-4 py-4 custom-scrollbar">
        <div className="space-y-4 shrink-0 pb-4">
          <h3 className="flex h-10 items-center gap-1.5 border-b border-zinc-800/60 text-[13px] font-black uppercase tracking-[0.15em] text-blue-400">
            <Wand2 size={13} /> AI Thumbnail Engine
          </h3>

          <div className="space-y-4 text-[13px]">
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="직접 입력하거나 하단의 템플릿을 선택하세요..."
              className="w-full h-24 p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none leading-relaxed"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 font-bold mb-1.5 pl-1">이미지 생성 모델</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
                >
                  {modelOptions.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 font-bold mb-1.5 pl-1">생성 수량</label>
                <select
                  value={generateCount}
                  onChange={(e) => setGenerateCount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
                >
                  <option value="1">1장 생성</option>
                  <option value="3">3장 팩</option>
                  <option value="5">5장 메가팩</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 font-bold mb-1.5 pl-1">스타일 선택</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => {
                    const nextStyle = e.target.value;
                    const nextStyleData = styleOptions.find((style) => style.value === nextStyle);

                    setSelectedStyle(nextStyle);
                    setSelectedStyleDetail(nextStyleData?.details[0] || "");
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
                >
                  {styleOptions.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 font-bold mb-1.5 pl-1">스타일 세부 선택</label>
                <select
                  value={selectedStyleDetail}
                  onChange={(e) => setSelectedStyleDetail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
                >
                  {selectedStyleData?.details.map((detail) => (
                    <option key={detail} value={detail}>
                      {detail}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-zinc-500 font-bold mb-1.5 pl-1">비율 / 사이즈 선택</label>
                <select
                  value={selectedAspectRatio}
                  onChange={(e) => setSelectedAspectRatio(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
                >
                  {aspectRatioOptions.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAiGenerateImage(parseInt(generateCount, 10))}
            disabled={isGenerating || isSyncLoading}
            className="w-full py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[13px] font-black rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isGenerating ? "이미지 생성 및 저장 중..." : "AI 썸네일 디자인 시작"}
          </button>
        </div>

        <div className="space-y-3 shrink-0 border-t border-zinc-800/50 pt-4">
          <h3 className="flex h-10 items-center gap-1.5 border-b border-zinc-800/60 text-[13px] font-black uppercase tracking-[0.15em] text-emerald-400">
            <Globe size={13} /> Free Stock Finder
          </h3>

          <div className="relative text-[13px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input
              type="text"
              value={stockSearchQuery}
              onChange={(e) => setStockSearchQuery(e.target.value)}
              placeholder="무료 실사 이미지 검색"
              className="w-full pl-10 pr-16 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200"
            />
            <button
              onClick={handleSearchStockImages}
              disabled={isStockLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-zinc-800 text-emerald-400 font-black rounded-lg text-[13px]"
            >
              {isStockLoading ? "조회중" : "찾기"}
            </button>
          </div>
        </div>

        <div className="flex min-h-[520px] flex-1 flex-col space-y-3 border-t border-zinc-800/50 pt-4">
          <h3 className="flex h-10 shrink-0 items-center gap-1.5 border-b border-zinc-800/60 text-[13px] font-black uppercase tracking-[0.15em] text-amber-400">
            <Tag size={13} /> Prompt Blueprint Hub
          </h3>

          <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
            {Object.entries(promptTemplates).map(([key, value]) => {
              const isActive = activeCategory === key;

              return (
                <div key={key} className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/30">
                  <button
                    onClick={() => setActiveCategory((current) => (current === key ? null : key))}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-black transition-all ${isActive
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-zinc-500 hover:bg-zinc-900/70 hover:text-zinc-300"
                      }`}
                  >
                    <span>{value.categoryLabel}</span>
                    <span className="text-[13px]">{isActive ? "접기" : "펼치기"}</span>
                  </button>

                  {isActive && (
                    <div className="space-y-1.5 border-t border-zinc-800/70 p-2">
                      {value.items.map((template, idx) => (
                        <div
                          key={idx}
                          onClick={() => setImagePrompt(template)}
                          className="grid cursor-pointer grid-cols-[48px_minmax(0,1fr)] items-start rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3 text-left text-[13px] font-medium leading-relaxed text-zinc-400 transition-all hover:border-amber-500/20 hover:bg-zinc-900/50 hover:text-zinc-200"
                        >
                          <span className="mt-0.5 block font-mono text-[13px] font-bold text-amber-500/50">
                            {String(idx + 1).padStart(2, "0")}.
                          </span>
                          <span className="flex-1 text-zinc-400 leading-tight">{template}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex h-full min-w-0 flex-col overflow-hidden py-4 pl-4">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-zinc-800/60 px-1">
          <h2 className="text-[13px] font-black text-zinc-300 flex items-center gap-2">
            <Grid size={16} className="text-blue-400" /> MEDIA LIBRARY
          </h2>

          <div className="flex items-center gap-2">
            {isSyncLoading && (
              <span className="text-[13px] font-black text-emerald-400 animate-pulse bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                원고 분석 연동 중
              </span>
            )}

            <Download size={14} className="text-emerald-400" />
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as "png" | "webp")}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] font-bold"
            >
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,320px))] gap-5">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="group relative flex flex-col space-y-3 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 p-3"
              >
                <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt="Asset"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[13px] font-black px-2 py-0.5 rounded-md bg-blue-600/90 text-white">
                      {img.type === "ai" ? "AI" : "STOCK"}
                    </span>
                    <span className="text-[13px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded-md text-zinc-300 backdrop-blur-sm">
                      {img.provider || "-"}
                    </span>
                    <span className="text-[13px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded-md text-zinc-300 backdrop-blur-sm">
                      {img.aspectRatio || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-[13px] text-zinc-500 font-bold leading-normal">
                      {img.style}
                      {img.styleDetail ? ` / ${img.styleDetail}` : ""}
                    </p>
                    <p className="text-[13px] text-zinc-400 leading-normal line-clamp-2">
                      <span className="text-zinc-500 font-bold">Prompt:</span> {img.prompt}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(img.url);
                        alert("링크 복사됨!");
                      }}
                      className="py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 hover:bg-zinc-800"
                    >
                      <Copy size={13} /> 링크 복사
                    </button>

                    <button
                      onClick={() => void downloadImage(img)}
                      className="py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400 text-[13px] font-black transition-all flex items-center justify-center gap-1.5 hover:bg-zinc-700"
                    >
                      <ArrowDownToLine size={13} /> {downloadFormat.toUpperCase()} 다운로드
                    </button>
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