"use client";

import {
  Upload,
  Image as ImageIcon,
  Film,
  Music,
  Plus,
  Trash2,
  Search,
  Library,
  Sparkles,
  Video,
  FolderOpen,
  Database,
  HelpCircle,
} from "lucide-react";

import { useMemo, useState, useEffect } from "react";
import { useVideoEditor } from "./VideoEditorContext";
import type { VideoEditorMediaType, VideoEditorMediaItem } from "./VideoEditorContext";
import VideoEditorStockPanel from "./VideoEditorStockPanel";
import VideoEditorStoragePanel from "./VideoEditorStoragePanel";
import VideoEditorAiAssetsPanel from "./VideoEditorAiAssetsPanel";
import { createClient } from "@/utils/supabase/client";

type LibraryTab = "uploads" | "ai-images" | "ai-videos" | "music" | "stock" | "recent" | "storage" | "free-assets" | "creaibox-content" | "image-content";

const libraryTabs: {
  id: LibraryTab;
  label: string;
  icon: React.ElementType;
}[] = [
    { id: "uploads", label: "내 미디어", icon: Upload },
    { id: "free-assets", label: "무료 에셋", icon: Library },
    { id: "creaibox-content", label: "크리에이박스", icon: FolderOpen },
    { id: "image-content", label: "이미지 콘텐츠", icon: Sparkles },
    { id: "music", label: "오디오 & 음악", icon: Music },
    { id: "storage", label: "저장소", icon: Database },
  ];

type FreeAssetItem = {
  id: string;
  name: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnailUrl?: string;
  category: string;
};

const freeSharedAssets: FreeAssetItem[] = [
  {
    id: "free-1",
    name: "웅장한 알프스 설산.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop",
    category: "자연/풍경"
  },
  {
    id: "free-2",
    name: "네온 불빛 테크 시티 B-roll.mp4",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-city-lights-at-night-reflected-in-water-4331-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&auto=format&fit=crop",
    category: "비디오/도시"
  },
  {
    id: "free-3",
    name: "잔잔한 어쿠스틱 오프닝.mp3",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    category: "음악/BGM"
  },
  {
    id: "free-4",
    name: "사이버펑크 가상 미래도시.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=1200&auto=format&fit=crop",
    category: "테크/가상"
  },
  {
    id: "free-5",
    name: "비 오는 날의 로파이 멜로디.mp3",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    category: "음악/로파이"
  },
  {
    id: "free-6",
    name: "햇살 비치는 평화로운 숲속 시냇가.mp4",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&auto=format&fit=crop",
    category: "비디오/자연"
  },
  {
    id: "free-7",
    name: "모던 미니멀리스트 사무실.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop",
    category: "공간/오피스"
  },
  {
    id: "free-8",
    name: "새벽녘 감성 어쿠스틱 기타.mp3",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    category: "음악/어쿠스틱"
  }
];

const fallbackCreaiboxAssets = [
  {
    id: "fallback-cre-1",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    title: "남태평양 에메랄드 해변 휴양지.jpg",
    prompt: "emerald tropical beach high quality dynamic scenery",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-cre-2",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    title: "비즈니스 기획 협업 회의.jpg",
    prompt: "modern office co-working space corporate meeting",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-cre-3",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    title: "세련된 공유 오피스 라운지.jpg",
    prompt: "minimalist sleek corporate lounge space design",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-cre-4",
    image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    title: "석양빛 가득한 크루즈 선상 여행.jpg",
    prompt: "luxury cruise travel ocean golden hour sunset scenic",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-cre-5",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    title: "스타트업 창의적 기획 브레인스토밍.jpg",
    prompt: "creative team brainstorming session startup office dynamic collaboration",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-cre-6",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    title: "카페에서의 여유로운 맥북 코딩 작업.jpg",
    prompt: "cozy workspace laptop coffee tech coding setup cafe",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-cre-7",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    title: "도심 속 랜드마크 빌딩 스카이라인.jpg",
    prompt: "modern skyscraper architecture building facade city center glass window reflective",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-cre-8",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    title: "디지털 빅데이터 추상 인공지능 네트워크.jpg",
    prompt: "futuristic global network connections big data visual abstract graphic science technology",
    created_at: new Date().toISOString(),
    is_fallback: true
  }
];

const fallbackImageStudioAssets = [
  {
    id: "fallback-img-1",
    image_url: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=800",
    title: "AI 미래 공상과학 메트로폴리스.jpg",
    prompt: "sci-fi futuristic neo Tokyo cyberpunk city skyscraper",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-img-2",
    image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    title: "초현실주의 추상 아트 갤러리 페인팅.jpg",
    prompt: "surrealist colorful fine art oil painting masterpiece",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-img-3",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    title: "요세미티 국립공원 계곡과 폭포.jpg",
    prompt: "majestic yosemite valley landscape waterfall river sunset",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-img-4",
    image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
    title: "밤하늘을 물들인 판타지 그린 오로라.jpg",
    prompt: "dreamy magical green northern lights aurora borealis starry night",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-img-5",
    image_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
    title: "네온 라이트로 물든 미니멀 거실 룸 데코.jpg",
    prompt: "neon illuminated living room synthwave vaporwave warm glow",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-img-6",
    image_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800",
    title: "아침 안개로 덮인 숲속 비밀 호수 정원.jpg",
    prompt: "misty forest secret lake tranquil fantasy woodland morning light",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-img-7",
    image_url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    title: "드넓게 펼쳐진 푸른 산맥의 지평선.jpg",
    prompt: "wide mountain landscape range scenic green valley aerial view sky",
    created_at: new Date().toISOString(),
    is_fallback: true
  },
  {
    id: "fallback-img-8",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    title: "신비롭고 몽환적인 벚꽃길 터널.jpg",
    prompt: "dreamy cherry blossom path pink sakura tree tunnel fantasy anime aesthetics",
    created_at: new Date().toISOString(),
    is_fallback: true
  }
];

const getProxiedUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.includes("drive.google.com") || trimmed.includes("googleusercontent.com")) {
    return `/api/free-assets/proxy?url=${encodeURIComponent(trimmed)}`;
  }
  return trimmed;
};

// Module-level cache to persist images, free assets, and session across mounts
let cachedUserId: string | null = null;
let cachedCreaiboxImages: any[] | null = null;
let cachedImageContentImages: any[] | null = null;
let cachedFreeAssets: any[] | null = null;
let isCacheLoaded = false;
let isFreeAssetsCacheLoaded = false;

export default function VideoEditorMediaLibrary({ forcedTab }: { forcedTab?: LibraryTab }) {
  const {
    mediaItems,
    addMediaFiles,
    removeMediaItem,
    addClipFromMedia,
    selectedMediaId,
    selectMedia,
    relinkMediaFile,
  } = useVideoEditor();

  const [libraryTabState, setLibraryTabState] = useState<LibraryTab>("uploads");
  const libraryTab = forcedTab || libraryTabState;
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState<"all" | VideoEditorMediaType>("all");
  const [isDraggingOverBox, setIsDraggingOverBox] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const [creaiboxImages, setCreaiboxImages] = useState<any[]>(() => cachedCreaiboxImages || []);
  const [imageContentImages, setImageContentImages] = useState<any[]>(() => cachedImageContentImages || []);
  const [loadingDb, setLoadingDb] = useState(() => !isCacheLoaded);
  const [freeAssets, setFreeAssets] = useState<any[]>(() => cachedFreeAssets || []);
  const [loadingFreeAssets, setLoadingFreeAssets] = useState(() => !isFreeAssetsCacheLoaded);
  const [freeMediaType, setFreeMediaType] = useState<"all" | "premium-theme" | "photo" | "illust" | "vector" | "video" | "music">("all");
  const [freeAspectRatio, setFreeAspectRatio] = useState<"all" | "16:9" | "9:16" | "4:3" | "1:1">("all");
  const [freeGenType, setFreeGenType] = useState<"all" | "ai" | "real">("all");
  const [freeCategoryTab, setFreeCategoryTab] = useState<"all" | "image" | "video" | "audio">("all");
  const [freeImageStyle, setFreeImageStyle] = useState<string>("all");

  useEffect(() => {
    let active = true;

    const fetchFreeAssets = async () => {
      if (isFreeAssetsCacheLoaded && active) {
        setLoadingFreeAssets(false);
      } else {
        if (active) {
          setLoadingFreeAssets(true);
        }
      }

      try {
        const response = await fetch("/api/free-assets/list");
        const data = await response.json();
        if (response.ok && data.files && active) {
          setFreeAssets(data.files);
          cachedFreeAssets = data.files;
          isFreeAssetsCacheLoaded = true;
        }
      } catch (error) {
        console.error("Failed to fetch free assets in video editor:", error);
      } finally {
        if (active) {
          setLoadingFreeAssets(false);
        }
      }
    };

    fetchFreeAssets();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      let userId = cachedUserId;
      if (!userId) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          userId = session?.user?.id || null;
          cachedUserId = userId;
        } catch (error) {
          console.error("Error checking session:", error);
        }
      }

      if (!userId) {
        if (active) {
          setLoadingDb(false);
        }
        return;
      }

      if (isCacheLoaded && active) {
        setLoadingDb(false);
      } else {
        if (active) {
          setLoadingDb(true);
        }
      }

      try {
        const [creaiboxRes, studioRes] = await Promise.all([
          supabase
            .from("generated_images")
            .select("*")
            .eq("user_id", userId)
            .eq("source_type", "writing_creaibox_posts")
            .order("created_at", { ascending: false }),
          supabase
            .from("generated_images")
            .select("*")
            .eq("user_id", userId)
            .eq("source_type", "image-studio")
            .order("created_at", { ascending: false })
        ]);

        if (active) {
          if (!creaiboxRes.error && creaiboxRes.data) {
            setCreaiboxImages(creaiboxRes.data);
            cachedCreaiboxImages = creaiboxRes.data;
          }
          if (!studioRes.error && studioRes.data) {
            setImageContentImages(studioRes.data);
            cachedImageContentImages = studioRes.data;
          }
          isCacheLoaded = true;
        }
      } catch (error) {
        console.error("Failed to load user images:", error);
      } finally {
        if (active) {
          setLoadingDb(false);
        }
      }
    };

    loadImages();

    return () => {
      active = false;
    };
  }, [supabase]);

  const handleDragOverBox = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOverBox(true);
  };

  const handleDragLeaveBox = () => {
    setIsDraggingOverBox(false);
  };

  const handleDropBox = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOverBox(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      await addMediaFiles(files);
    }
  };

  return (
    <div className="space-y-4">
      {libraryTab === "uploads" ? (
        <div className="space-y-4">
          <label
            onDragOver={handleDragOverBox}
            onDragLeave={handleDragLeaveBox}
            onDrop={handleDropBox}
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-md border border-dashed text-sm font-bold transition-all duration-200 ${
              isDraggingOverBox
                ? "border-cyan-400 bg-cyan-400/20 text-cyan-100 scale-[1.02]"
                : "border-cyan-400/40 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/10"
            }`}
          >
            <Upload size={28} className={`transition-transform duration-200 ${isDraggingOverBox ? "scale-110 -translate-y-0.5" : ""}`} />
            파일 업로드
            <span className="text-xs text-cyan-100/60">video / image / audio</span>
            <input
              type="file"
              multiple
              accept="video/*,image/*,audio/*"
              className="hidden"
              onChange={(event) => {
                const files = event.target.files;
                if (!files) return;
                addMediaFiles(files);
                event.currentTarget.value = "";
              }}
            />
          </label>

          <div className="rounded-md border border-dashed border-white/5 bg-black/20 p-5 text-center text-xs text-zinc-500 leading-6">
            로컬 컴퓨터에 있는 미디어 파일을 드래그하여 업로드하거나 클릭해서 선택하세요.<br />
            업로드된 미디어 파일들은 왼쪽 사이드바의 <strong>'가져온 미디어'</strong> 영역에 추가되어 타임라인에 삽입할 수 있습니다.
          </div>
        </div>
      ) : libraryTab === "free-assets" ? (
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex border-b border-white/10 -mx-4 px-4">
            {[
              { id: "all", label: "전체" },
              { id: "image", label: "이미지" },
              { id: "video", label: "비디오" },
              { id: "audio", label: "음악" },
            ].map((tab) => {
              const isActive = freeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFreeCategoryTab(tab.id as any);
                    if (tab.id !== "image") {
                      setFreeImageStyle("all");
                    }
                  }}
                  className={`flex-1 pb-2.5 text-xs font-black text-center border-b-2 transition-all duration-150 ${
                    isActive
                      ? "border-cyan-400 text-cyan-200 font-extrabold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2">
            <Search size={15} className="text-zinc-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="무료 이미지, 비디오, 음악 등 키워드 검색..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {["자연", "배경", "바다", "하늘", "여행", "힐링", "음악", "감성", "우주", "비즈니스"].map((tag) => {
              const isActive = search.trim().toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearch(isActive ? "" : tag)}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-black border transition ${
                    isActive
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                      : "border-white/5 bg-white/[0.02] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {/* Advanced Filters */}
          <div className="border-t border-white/10 -mx-4"></div>
          <div className={`grid gap-2 ${
            (freeCategoryTab === "all" || freeCategoryTab === "image") ? "grid-cols-3" : "grid-cols-2"
          }`}>
            {/* Style Filter (Only for All or Image tabs) */}
            {(freeCategoryTab === "all" || freeCategoryTab === "image") && (
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">스타일 필터</label>
                <select
                  value={freeImageStyle}
                  onChange={(e) => setFreeImageStyle(e.target.value)}
                  className="w-full rounded border border-white/10 bg-black/50 px-1.5 py-1 text-[10px] font-bold text-white outline-none"
                >
                  <option value="all">스타일 필터</option>
                  <option value="photorealistic">실사 (Photo)</option>
                  <option value="illustration">일러스트</option>
                  <option value="vector">벡터 (Vector)</option>
                  <option value="3d_render">3D 렌더</option>
                  <option value="anime">애니메이션</option>
                  <option value="pixel_art">픽셀 아트</option>
                  <option value="watercolor">수채화</option>
                  <option value="line_art">라인 아트</option>
                  <option value="seamless_pattern">패턴</option>
                  <option value="retro_pop_art">레트로 팝</option>
                </select>
              </div>
            )}

            {/* Aspect Ratio */}
            <div className="space-y-1">
              <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">비율 필터</label>
              <select
                value={freeAspectRatio}
                onChange={(e) => setFreeAspectRatio(e.target.value as any)}
                className="w-full rounded border border-white/10 bg-black/50 px-1.5 py-1 text-[10px] font-bold text-white outline-none"
              >
                <option value="all">비율 필터</option>
                <option value="16:9">16:9 가로</option>
                <option value="9:16">9:16 세로</option>
                <option value="4:3">4:3 표준</option>
                <option value="1:1">1:1 정방향</option>
              </select>
            </div>

            {/* Generation Type */}
            <div className="space-y-1">
              <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">제작 방식</label>
              <select
                value={freeGenType}
                onChange={(e) => setFreeGenType(e.target.value as any)}
                className="w-full rounded border border-white/10 bg-black/50 px-1.5 py-1 text-[10px] font-bold text-white outline-none"
              >
                <option value="all">제작 방식</option>
                <option value="ai">AI 생성 이미지</option>
                <option value="real">실제 사진/미디어</option>
              </select>
            </div>
          </div>

          {/* 💡 YouTube Reused Content Guide Tooltip */}
          <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-2.5 text-[10px] text-cyan-200/90 leading-relaxed flex gap-2">
            <HelpCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong>유튜브 업로드 팁:</strong> 무료 에셋을 편집 없이 그대로 올리면 유튜브 AI에 의해 <strong>'재사용된 콘텐츠'</strong>로 오인되어 수익 창출이 거절될 수 있습니다. <strong>텍스트 자막, AI 나레이션</strong>을 더해 독창적인 2차 가공물로 만들어 올리세요!
            </div>
          </div>

          {loadingFreeAssets && freeAssets.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            </div>
          ) : freeAssets.length === 0 ? (
            <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-6 text-center text-xs text-zinc-500">
              보관된 무료 공유 에셋이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[660px] overflow-y-auto pr-1 scrollbar-thin">
              {freeAssets
                .filter((item) => {
                  // 0. High-level category tab filter
                  let calculatedType: "image" | "video" | "audio" = "image";
                  if (item.mediaType === "video") {
                    calculatedType = "video";
                  } else if (item.mediaType === "music" || item.mediaType === "audio") {
                    calculatedType = "audio";
                  }
                  
                  if (freeCategoryTab !== "all" && calculatedType !== freeCategoryTab) {
                    return false;
                  }

                  // 0.5. Image Style Filter (only applicable for all or image category)
                  if ((freeCategoryTab === "all" || freeCategoryTab === "image") && freeImageStyle !== "all") {
                    const styleKeywordsMap: Record<string, string[]> = {
                      photorealistic: ["photorealistic", "실사", "촬영", "photo", "cinematic", "photography", "photograph", "camera", "시네마틱"],
                      illustration: ["illustration", "일러스트", "watercolor illustration"],
                      vector: ["vector", "벡터", "icon"],
                      "3d_render": ["3d", "render", "isometric", "blender", "렌더"],
                      anime: ["anime", "애니메이션", "scenery", "shinkai"],
                      pixel_art: ["pixel", "픽셀"],
                      watercolor: ["watercolor", "수채화"],
                      line_art: ["line", "라인"],
                      seamless_pattern: ["seamless", "pattern", "패턴"],
                      retro_pop_art: ["retro", "pop", "vintage", "팝아트"]
                    };
                    const keywords = styleKeywordsMap[freeImageStyle] || [];
                    const matchesStyle = keywords.some(kw => 
                      (item.title || "").toLowerCase().includes(kw) ||
                      (item.name || "").toLowerCase().includes(kw) ||
                      (Array.isArray(item.tags) && item.tags.some((t: string) => t.toLowerCase().includes(kw))) ||
                      (item.prompt || "").toLowerCase().includes(kw)
                    );
                    if (!matchesStyle) return false;
                  }

                  // 1. Media Type / Theme Filter
                  if (freeMediaType === "premium-theme") {
                    if (!item.isOfficialThemeAsset) return false;
                  } else {
                    if (item.isOfficialThemeAsset) return false;
                    const matchesType =
                      freeMediaType === "all" || item.mediaType === freeMediaType;
                    if (!matchesType) return false;
                  }

                  // 2. Aspect Ratio Filter
                  if (freeAspectRatio !== "all") {
                    if (item.aspectRatio !== freeAspectRatio) return false;
                  }

                  // 3. Generation Type Filter
                  if (freeGenType !== "all") {
                    if (item.generationType !== freeGenType) return false;
                  }

                  // 4. Search Query / Tag Translator
                  const query = search.trim().toLowerCase();
                  if (query === "") return true;

                  const relatedKeywords: string[] = [query];
                  const tagTranslationMap: Record<string, string[]> = {
                    "바다": ["beach", "sea", "ocean"],
                    "beach": ["바다", "해변"],
                    "sea": ["바다"],
                    "ocean": ["바다", "대양"],
                    "자연": ["nature"],
                    "nature": ["자연"],
                    "배경": ["background", "wallpaper"],
                    "background": ["배경"],
                    "하늘": ["sky"],
                    "sky": ["하늘"],
                    "여행": ["travel", "trip"],
                    "travel": ["여행"],
                    "힐링": ["healing", "relax"],
                    "healing": ["힐링"],
                    "음악": ["music", "sound", "audio"],
                    "music": ["음악"],
                    "감성": ["emotional", "mood"],
                    "emotional": ["감성"],
                    "우주": ["space", "universe", "cosmos"],
                    "space": ["우주"],
                    "비즈니스": ["business", "office"],
                    "business": ["비즈니스"]
                  };

                  Object.keys(tagTranslationMap).forEach((key) => {
                    if (key.toLowerCase() === query) {
                      tagTranslationMap[key].forEach((val) => {
                        if (!relatedKeywords.includes(val.toLowerCase())) {
                          relatedKeywords.push(val.toLowerCase());
                        }
                      });
                    }
                  });

                  const title = (item.title || item.name || "").toLowerCase();
                  const uploader = (item.uploader || "").toLowerCase();
                  const tags = Array.isArray(item.tags) ? item.tags : [];

                  return relatedKeywords.some((keyword) =>
                    title.includes(keyword) ||
                    uploader.includes(keyword) ||
                    tags.some((t: string) => t.toLowerCase().includes(keyword)) ||
                    (item.themeCategory && item.themeCategory.toLowerCase().includes(keyword))
                  );
                })
                .map((item) => {
                  let type: "image" | "video" | "audio" = "image";
                  if (item.mediaType === "video") {
                    type = "video";
                  } else if (item.mediaType === "music" || item.mediaType === "audio") {
                    type = "audio";
                  }

                  const proxiedUrl = getProxiedUrl(item.url);
                  const title = item.title || item.name || "Free Asset";

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("media-id", item.id);
                        event.dataTransfer.effectAllowed = "copy";
                      }}
                      onPointerMove={(e) => {
                        if (type !== "video") return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const pct = Math.max(0, Math.min(1, x / rect.width));
                        const videoEl = e.currentTarget.querySelector("video");
                        if (videoEl) {
                          const duration = videoEl.duration || 5;
                          const targetTime = pct * duration;
                          if (!isNaN(targetTime)) {
                            videoEl.currentTime = targetTime;
                          }
                        }
                      }}
                      onPointerLeave={(e) => {
                        if (type !== "video") return;
                        const videoEl = e.currentTarget.querySelector("video");
                        if (videoEl) {
                          videoEl.currentTime = 0;
                        }
                      }}
                      className="group overflow-hidden rounded-md border border-white/10 bg-black/30 transition hover:border-cyan-400/50"
                    >
                      <div className="relative flex aspect-video items-center justify-center bg-zinc-950">
                        {type === "image" ? (
                          <img
                            src={proxiedUrl}
                            alt={title}
                            className="h-full w-full object-cover pointer-events-none select-none"
                          />
                        ) : type === "video" && proxiedUrl ? (
                          <video
                            src={proxiedUrl}
                            className="h-full w-full object-cover pointer-events-none select-none"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : type === "video" ? (
                          <div className="flex flex-col items-center gap-0.5 text-cyan-400 bg-cyan-950/20 w-full h-full justify-center">
                            <Film size={24} />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-0.5 text-emerald-400 bg-emerald-950/20 w-full h-full justify-center">
                            <Music size={24} />
                          </div>
                        )}
                        {item.themeCategory && (
                          <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[9px] font-black uppercase text-white/70">
                            {item.themeCategory}
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <div className="truncate text-xs font-black text-white" title={title}>{title}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[9px] uppercase text-zinc-500">{type}</span>
                          <button
                            type="button"
                            onClick={() => addClipFromMedia({
                              id: item.id + "-" + Date.now(),
                              type: type,
                              name: title,
                              url: proxiedUrl,
                              thumbnailUrl: type === "image" ? proxiedUrl : undefined,
                              createdAt: item.createdAt || new Date().toISOString(),
                            })}
                            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
                            title="타임라인에 추가"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : libraryTab === "creaibox-content" ? (
        <div className="space-y-4">
          <div className="rounded-md border border-white/10 bg-black/30 p-3">
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2">
              <Search size={15} className="text-zinc-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="크리에이박스 이미지 검색..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          {loadingDb && creaiboxImages.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[660px] overflow-y-auto pr-1 scrollbar-thin">
              {(creaiboxImages.length > 0 ? creaiboxImages : fallbackCreaiboxAssets)
                .filter(img => !search || (img.title && img.title.toLowerCase().includes(search.toLowerCase())) || (img.prompt && img.prompt.toLowerCase().includes(search.toLowerCase())))
                .map((img) => {
                  const proxiedUrl = getProxiedUrl(img.image_url);
                  const title = img.title || img.prompt || "Creaibox Content";
                  return (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("media-id", img.id);
                        event.dataTransfer.effectAllowed = "copy";
                      }}
                      className="group overflow-hidden rounded-md border border-white/10 bg-black/30 transition hover:border-cyan-400/50"
                    >
                      <div className="relative aspect-video bg-zinc-950 flex items-center justify-center">
                        <img
                          src={proxiedUrl}
                          alt={title}
                          className="h-full w-full object-cover pointer-events-none select-none"
                        />
                        <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[9px] font-black text-cyan-300">
                          {img.is_fallback ? "샘플" : "라이브러리"}
                        </div>
                      </div>
                      <div className="p-2.5">
                        <div className="truncate text-xs font-black text-white" title={title}>{title}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[9px] uppercase text-zinc-500">IMAGE</span>
                          <button
                            type="button"
                            onClick={() => addClipFromMedia({
                              id: img.id + "-" + Date.now(),
                              type: "image",
                              name: title,
                              url: proxiedUrl,
                              thumbnailUrl: proxiedUrl,
                              createdAt: img.created_at || new Date().toISOString(),
                            })}
                            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
                            title="타임라인에 추가"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : libraryTab === "image-content" ? (
        <div className="space-y-4">
          <div className="rounded-md border border-white/10 bg-black/30 p-3">
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2">
              <Search size={15} className="text-zinc-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="이미지 콘텐츠 검색..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          {loadingDb && imageContentImages.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[660px] overflow-y-auto pr-1 scrollbar-thin">
              {(imageContentImages.length > 0 ? imageContentImages : fallbackImageStudioAssets)
                .filter(img => !search || (img.title && img.title.toLowerCase().includes(search.toLowerCase())) || (img.prompt && img.prompt.toLowerCase().includes(search.toLowerCase())))
                .map((img) => {
                  const proxiedUrl = getProxiedUrl(img.image_url);
                  const title = img.title || img.prompt || "Generated Image";
                  return (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("media-id", img.id);
                        event.dataTransfer.effectAllowed = "copy";
                      }}
                      className="group overflow-hidden rounded-md border border-white/10 bg-black/30 transition hover:border-cyan-400/50"
                    >
                      <div className="relative aspect-video bg-zinc-950 flex items-center justify-center">
                        <img
                          src={proxiedUrl}
                          alt={title}
                          className="h-full w-full object-cover pointer-events-none select-none"
                        />
                        <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[9px] font-black text-cyan-300">
                          {img.is_fallback ? "샘플" : "라이브러리"}
                        </div>
                      </div>
                      <div className="p-2.5">
                        <div className="truncate text-xs font-black text-white" title={title}>{title}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[9px] uppercase text-zinc-500">IMAGE</span>
                          <button
                            type="button"
                            onClick={() => addClipFromMedia({
                              id: img.id + "-" + Date.now(),
                              type: "image",
                              name: title,
                              url: proxiedUrl,
                              thumbnailUrl: proxiedUrl,
                              createdAt: img.created_at || new Date().toISOString(),
                            })}
                            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
                            title="타임라인에 추가"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : libraryTab === "music" ? (
        <div className="space-y-4">
          <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center">
            <Music size={28} className="mx-auto mb-3 text-emerald-300" />
            <div className="font-black text-white">뮤직 스튜디오 곡 및 기본 오디오</div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              뮤직 스튜디오 생성곡 및 고품질 사운드 이펙트를 로드합니다.
            </p>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                addClipFromMedia({
                  id: `media-music-1-${Date.now()}`,
                  type: "audio",
                  name: "Chill Focus Lounge (Lo-Fi).mp3",
                  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                  createdAt: new Date().toISOString(),
                });
              }}
              className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
            >
              <span>Chill Focus Lounge (Lo-Fi).mp3</span>
              <Plus size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                addClipFromMedia({
                  id: `media-music-2-${Date.now()}`,
                  type: "audio",
                  name: "Morning Acoustic Guitar.mp3",
                  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                  createdAt: new Date().toISOString(),
                });
              }}
              className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
            >
              <span>Morning Acoustic Guitar.mp3</span>
              <Plus size={15} />
            </button>
          </div>
        </div>
      ) : libraryTab === "storage" ? (
        <VideoEditorStoragePanel />
      ) : (
        <ComingSoonPanel tab={libraryTab} />
      )}
    </div>
  );
}

function ComingSoonPanel({ tab }: { tab: LibraryTab }) {
  const label =
    tab === "ai-images"
      ? "AI 이미지 생성 결과"
      : tab === "ai-videos"
        ? "AI 비디오 생성 결과"
        : tab === "music"
          ? "뮤직 스튜디오 곡"
          : tab === "stock"
            ? "스톡 미디어"
            : "최근 사용한 파일";

  return (
    <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center">
      <Sparkles size={28} className="mx-auto mb-3 text-cyan-300" />
      <div className="font-black text-white">{label}</div>
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        이 영역은 Supabase Storage, AI 생성 결과, 외부 리소스와 연결할 자리입니다.
      </p>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-2 text-[11px] font-black ${active
        ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
        : "border-white/10 bg-black/20 text-zinc-500 hover:border-cyan-400/40"
        }`}
    >
      {label}
    </button>
  );
}

function MediaThumbnail({ item }: { item: VideoEditorMediaItem }) {
  const isAudio = item.type === "audio";
  const thumbnailUrl = item.type === "image" ? item.url : (item.thumbnailUrl || "");

  if (isAudio) {
    return (
      <div className="relative w-24 aspect-video rounded overflow-hidden bg-gradient-to-br from-emerald-950/80 to-black/80 flex flex-col justify-between p-1.5 shrink-0 border border-emerald-500/20">
        <Music size={14} className="text-emerald-400" />
        <div className="flex items-end gap-[1px] h-3">
          {(item.waveform?.length
            ? item.waveform.slice(0, 16)
            : Array.from({ length: 10 }, () => 0.08)
          ).map((value, idx) => {
            const height = Math.max(15, value * 100);
            return (
              <div
                key={idx}
                className="flex-1 rounded-t-[1px] bg-emerald-500/50"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-24 aspect-video rounded overflow-hidden bg-black/40 flex items-center justify-center shrink-0 border border-white/5">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={item.name}
          className="h-full w-full object-cover pointer-events-none select-none"
        />
      ) : item.type === "video" ? (
        <div className="flex flex-col items-center gap-0.5 text-cyan-400 bg-cyan-950/20 w-full h-full justify-center">
          <Film size={18} />
          <span className="text-[7px] font-bold uppercase tracking-wider text-cyan-400/80">Video</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-0.5 text-violet-400 bg-violet-950/20 w-full h-full justify-center">
          <ImageIcon size={18} />
          <span className="text-[7px] font-bold uppercase tracking-wider text-violet-400/80">Image</span>
        </div>
      )}
    </div>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-2 text-center">
      <div className="text-[10px] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-xs font-black text-white">
        {value}
      </div>
    </div>
  );
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0.0MB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i < 2) {
    return `${(bytes / 1024 / 1024).toFixed(dm)}MB`;
  }
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}
