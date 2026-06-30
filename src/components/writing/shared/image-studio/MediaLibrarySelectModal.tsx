"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Search, Check, RefreshCw, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface GeneratedImageRow {
  id: string;
  image_url: string;
  prompt: string;
  style: string | null;
  aspect_ratio: string | null;
  provider: string | null;
  source_type: string | null;
  source_id: string | null;
  image_role: string | null;
  is_primary: boolean;
  created_at: string;
  title: string | null;
  caption: string | null;
  description: string | null;
  alt_text: string | null;
  tags?: string[];
}

// 한국어 검색어 입력 시 영어/동의어 매핑 목록
const searchSynonyms: Record<string, string[]> = {
  강아지: ["dog", "puppy", "retriever", "레트리버"],
  댕댕이: ["dog", "puppy", "retriever", "레트리버"],
  개: ["dog", "puppy", "retriever"],
  고양이: ["cat", "kitten"],
  바다: ["sea", "beach", "ocean", "wave", "해변"],
  해변: ["beach", "sea", "ocean", "sand"],
  파도: ["wave", "sea", "ocean"],
  산: ["mountain", "mount", "hill"],
  하늘: ["sky", "blue sky"],
  구름: ["cloud", "sky"],
  골프: ["golf", "player", "green"],
  선수: ["player", "athlete"],
  사람: ["people", "person", "man", "woman"],
  남자: ["man", "boy", "male"],
  여자: ["woman", "girl", "female"],
  꽃: ["flower", "blossom", "flora"],
  나무: ["tree", "forest", "wood"],
  숲: ["forest", "wood", "tree"],
  자동차: ["car", "vehicle", "auto"],
  바탕화면: ["wallpaper", "background"],
  배경화면: ["wallpaper", "background"],
  배경: ["background", "wallpaper"],
  일러스트: ["illustration", "art", "drawing"],
  수채화: ["watercolor", "painting"],
  실사: ["photorealistic", "photo", "realistic"],
  음식: ["food", "dish", "cooking"],
  커피: ["coffee", "cafe", "cup"],
  아이콘: ["icon", "vector"],
  로고: ["logo", "brand"],
};

// 외부 스톡 라이브러리 데모 이미지 생성기
const getMockStockImages = (tabName: string, query: string): GeneratedImageRow[] => {
  const lowercaseQuery = query.toLowerCase();
  
  const dogPhotos = [
    "photo-1543466835-00a7907e9de1", // golden retriever
    "photo-1587300003388-59208cc962cb", // white dog
    "photo-1534361960057-19889db9621e", // happy dog
    "photo-1544568100-847a948585b9", // pug
    "photo-1517849845537-4d257902454a", // puppy
    "photo-1583511655857-d19b40a7a54e", // french bulldog
    "photo-1552053831-71594a27632d", // golden retriever puppy
    "photo-1477884213984-7a4df6093e6f", // dogs running
  ];
  
  const seaPhotos = [
    "photo-1507525428034-b723cf961d3e", // tropical beach
    "photo-1473116763269-b552f587665a", // beach waves
    "photo-1505118380757-91f5f5632de0", // crystal ocean
    "photo-1519046904884-53103b34b206", // sunset beach
    "photo-1520116468419-a531b09aa442", // deep ocean
    "photo-1439066615861-d1af74d74000", // blue sea
  ];
  
  const naturePhotos = [
    "photo-1470071459604-3b5ec3a7fe05", // foggy forest
    "photo-1441974231531-c6227db76b6e", // forest sunlight
    "photo-1447752875215-b2761acb3c5d", // scenic bridge
    "photo-1472214222541-d510753a4907", // green field
    "photo-1469474968028-56623f02e42e", // mountain trail
    "photo-1501854140801-50d01698950b", // nature overview
  ];
  
  const generalPhotos = [
    "photo-1451187580459-43490279c0fa", // technology
    "photo-1504674900247-0877df9cc836", // food
    "photo-1498050108023-c5249f4df085", // developer workspace
    "photo-1486406146926-c627a92ad1ab", // modern building
    "photo-1511556532299-8f662fc26c06", // creative design
    "photo-1497366216548-37526070297c", // office space
  ];

  let selectedIds = generalPhotos;
  
  if (
    lowercaseQuery.includes("dog") ||
    lowercaseQuery.includes("puppy") ||
    lowercaseQuery.includes("강아지") ||
    lowercaseQuery.includes("개") ||
    lowercaseQuery.includes("레트리버")
  ) {
    selectedIds = dogPhotos;
  } else if (
    lowercaseQuery.includes("sea") ||
    lowercaseQuery.includes("beach") ||
    lowercaseQuery.includes("wave") ||
    lowercaseQuery.includes("바다") ||
    lowercaseQuery.includes("해변") ||
    lowercaseQuery.includes("파도")
  ) {
    selectedIds = seaPhotos;
  } else if (
    lowercaseQuery.includes("nature") ||
    lowercaseQuery.includes("mountain") ||
    lowercaseQuery.includes("자연") ||
    lowercaseQuery.includes("산") ||
    lowercaseQuery.includes("숲")
  ) {
    selectedIds = naturePhotos;
  }
  
  return selectedIds.map((id, index) => {
    const providerName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    return {
      id: `${tabName}-mock-${id}`,
      image_url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`,
      prompt: `검색어 [${query || "기본"}]에 부합하는 ${providerName} 스톡 이미지`,
      style: "photography",
      aspect_ratio: "16:9",
      provider: tabName,
      source_type: "external_api",
      source_id: id,
      image_role: "thumbnail",
      is_primary: false,
      created_at: new Date(Date.now() - index * 60000).toISOString(),
      title: `${providerName} Stock Image - ${index + 1}`,
      caption: `${providerName} 스톡 라이브러리 데모 이미지`,
      description: `마이페이지 API 키 연동을 통해 실시간 ${providerName} 라이브러리를 사용할 수 있습니다.`,
      alt_text: `${providerName} Stock photo`,
    };
  });
};

interface MediaLibrarySelectModalProps {
  onClose: () => void;
  onSelect: (image: GeneratedImageRow) => Promise<void>;
}

export default function MediaLibrarySelectModal({
  onClose,
  onSelect,
}: MediaLibrarySelectModalProps) {
  const supabase = createClient();
  const [images, setImages] = useState<GeneratedImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<GeneratedImageRow | null>(null);
  const [pageSize, setPageSize] = useState(56);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "creaibox" | "naver" | "image" | "creaset" | "pixabay" | "pexels" | "adobe" | "shutterstock"
  >("creaibox");
  const [selectedRatio, setSelectedRatio] = useState<string>("all");

  // 무한 스크롤(센티널) 감지용 Ref
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 로컬 DB 탭 데이터 캐시용 Ref (중복 DB 요청 차단 및 0ms 즉시 스위칭용)
  const dbCacheRef = useRef<Record<string, GeneratedImageRow[]>>({});

  // 수정 필드 입력 상태값들
  const [altText, setAltText] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 이미지 선택 시 입력값 동기화
  useEffect(() => {
    if (selectedImage) {
      setAltText(selectedImage.alt_text || "");
      setTitle(selectedImage.title || "");
      setCaption(selectedImage.caption || "");
      setDescription(selectedImage.description || "");
    } else {
      setAltText("");
      setTitle("");
      setCaption("");
      setDescription("");
    }
  }, [selectedImage]);

  // 로드된 이미지의 실측 종횡비 카테고리 저장 (키: img.id, 값: "16:9" | "9:16" | "1:1" | "4:3" | "etc")
  const [resolvedRatios, setResolvedRatios] = useState<Record<string, string>>({});
  const analyzedRef = useRef<Set<string>>(new Set());

  // 이미지 실측 종횡비 분석용 Effect
  useEffect(() => {
    if (images.length === 0) return;

    images.forEach((img) => {
      if (analyzedRef.current.has(img.id)) return;
      analyzedRef.current.add(img.id);

      const image = new Image();
      image.src = (img.image_url.includes("googleusercontent.com") || img.image_url.includes("drive.google.com"))
        ? `/api/free-assets/proxy?url=${encodeURIComponent(img.image_url)}`
        : img.image_url;

      image.onload = () => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height) return;

        const ratio = width / height;
        let category = "etc";

        // 종횡비 매핑 (오차 범위 보정)
        if (ratio >= 1.6 && ratio <= 1.9) {
          category = "16:9";
        } else if (ratio >= 0.5 && ratio <= 0.62) {
          category = "9:16";
        } else if (ratio >= 0.9 && ratio <= 1.1) {
          category = "1:1";
        } else if (ratio >= 1.25 && ratio <= 1.4) {
          category = "4:3";
        }

        setResolvedRatios((prev) => ({
          ...prev,
          [img.id]: category,
        }));
      };

      image.onerror = () => {
        setResolvedRatios((prev) => ({
          ...prev,
          [img.id]: "etc",
        }));
      };
    });
  }, [images]);

  // 이미지 목록 가져오기
  const fetchImages = useCallback(async () => {
    const isExternal = ["pixabay", "pexels", "adobe", "shutterstock"].includes(activeTab);

    // 1. 이미 캐싱된 로컬 DB 데이터가 있다면 데이터베이스 쿼리를 생략하고 캐시에서 꺼내 즉시 노출
    if (!isExternal && dbCacheRef.current[activeTab]) {
      setImages(dbCacheRef.current[activeTab]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let fetchedData: GeneratedImageRow[] = [];

      if (activeTab === "creaibox") {
        const { data, error } = await supabase
          .from("generated_images")
          .select("*")
          .eq("user_id", user.id)
          .eq("source_type", "writing_creaibox_posts")
          .order("created_at", { ascending: false });

        if (error) throw error;
        fetchedData = data || [];
      } else if (activeTab === "naver") {
        const { data, error } = await supabase
          .from("generated_images")
          .select("*")
          .eq("user_id", user.id)
          .eq("source_type", "writing_naver_posts")
          .order("created_at", { ascending: false });

        if (error) throw error;
        fetchedData = data || [];
      } else if (activeTab === "image") {
        // 모든 생성 이미지 중 크리에이박스/네이버 글에 매핑되지 않은 단독 이미지들
        const { data, error } = await supabase
          .from("generated_images")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        fetchedData = (data || []).filter(
          (img: any) =>
            img.source_type !== "writing_creaibox_posts" &&
            img.source_type !== "writing_naver_posts"
        );
      } else if (activeTab === "creaset") {
        const { data, error } = await supabase
          .from("free_assets")
          .select("*")
          .eq("media_type", "image")
          .order("created_at", { ascending: false });

        if (error) throw error;

        fetchedData = (data || []).map((file: any) => ({
          id: file.id || file.gdrive_file_id,
          image_url: file.storage_url,
          prompt: file.prompt || "",
          style: file.generation_type || "manual",
          aspect_ratio: file.aspect_ratio || "content",
          provider: file.ai_tool || "upload",
          source_type: "free_assets",
          source_id: file.gdrive_file_id || file.id,
          image_role: "thumbnail",
          is_primary: false,
          created_at: file.created_at,
          title: file.title || file.file_name || "크리에셋 이미지",
          caption: "",
          description: "",
          alt_text: file.title || "",
          tags: file.tags || [],
        }));
      } else {
        // 외부 스톡 라이브러리 모의 로드
        fetchedData = getMockStockImages(activeTab, searchQuery);
      }

      setImages(fetchedData);

      // 2. 로컬 DB 탭인 경우 가져온 데이터를 메모리 캐시 Ref에 기재
      if (!isExternal) {
        dbCacheRef.current[activeTab] = fetchedData;
      }
    } catch (err) {
      console.error("Failed to fetch library images for selection:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, activeTab, searchQuery]);

  // 로컬 탭과 외부 API 탭 로딩 분기 및 디바운스
  useEffect(() => {
    const isExternal = ["pixabay", "pexels", "adobe", "shutterstock"].includes(activeTab);
    if (!isExternal) {
      void fetchImages();
    }
  }, [activeTab]);

  useEffect(() => {
    const isExternal = ["pixabay", "pexels", "adobe", "shutterstock"].includes(activeTab);
    if (isExternal) {
      const timer = setTimeout(() => {
        void fetchImages();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, searchQuery]);

  // 종횡비 필터링 헬퍼 함수 (실측 종횡비 우선 적용, DB 종횡비는 폴백으로 사용)
  const matchRatio = (img: GeneratedImageRow, target: string): boolean => {
    if (target === "all") return true;

    // 1. 실측 기반 분석된 종횡비 정보가 우선적으로 있다면 매칭 판단
    const resolved = resolvedRatios[img.id];
    if (resolved) {
      return resolved === target;
    }

    // 2. DB 기록에 종횡비 필드가 있는 경우 (16:9, horizontal 등) 매칭 폴백
    const normalized = (img.aspect_ratio || "").toLowerCase().trim();
    if (target === "16:9") {
      return normalized === "16:9" || normalized === "horizontal" || normalized === "landscape";
    }
    if (target === "9:16") {
      return normalized === "9:16" || normalized === "vertical" || normalized === "portrait";
    }
    if (target === "1:1") {
      return normalized === "1:1" || normalized === "square";
    }
    if (target === "4:3") {
      return normalized === "4:3";
    }
    if (target === "etc") {
      const definedRatios = ["16:9", "9:16", "1:1", "4:3", "horizontal", "vertical", "square", "landscape", "portrait"];
      return !definedRatios.includes(normalized) && normalized !== "content";
    }
    return true;
  };

  // 검색 및 비율 필터링 (동의어 매핑 및 태그 필드 검색 기능 추가 - 외부 API는 mock 단에서 쿼리를 필터하여 들어오므로 로컬 탭에만 국한 적용)
  const filteredImages = images.filter((img) => {
    if (!matchRatio(img, selectedRatio)) {
      return false;
    }

    const isExternal = ["pixabay", "pexels", "adobe", "shutterstock"].includes(activeTab);
    if (isExternal) return true; // 외부 API는 이미 getMockStockImages 단에서 검색어 맞춤으로 내려옵니다.

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const synonyms = searchSynonyms[query] || [];

      const matchQuery = (text: string) => {
        if (!text) return false;
        const lowText = text.toLowerCase();
        if (lowText.includes(query)) return true;
        return synonyms.some((syn) => lowText.includes(syn));
      };

      const matchTitle = matchQuery(img.title || "");
      const matchAlt = matchQuery(img.alt_text || "");
      const matchDesc = matchQuery(img.description || "");
      const matchPrompt = matchQuery(img.prompt || "");

      const matchTags = img.tags?.some((tag) => {
        const lowTag = tag.toLowerCase();
        if (lowTag.includes(query)) return true;
        return synonyms.some((syn) => lowTag.includes(syn));
      }) ?? false;

      return matchTitle || matchAlt || matchDesc || matchPrompt || matchTags;
    }
    return true;
  });

  const displayedImages = filteredImages.slice(0, pageSize);
  const showLoadMore = filteredImages.length > pageSize;

  // IntersectionObserver 를 이용한 자동 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && showLoadMore && !loading && !submitting) {
          setPageSize((prev) => prev + 56);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [showLoadMore, loading, submitting]);

  const currentIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrevImage = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  }, [currentIndex, filteredImages]);

  const handleNextImage = useCallback(() => {
    if (currentIndex !== -1 && currentIndex < filteredImages.length - 1) {
      const nextIndex = currentIndex + 1;
      setSelectedImage(filteredImages[nextIndex]);
      if (nextIndex >= pageSize && showLoadMore) {
        setPageSize((prev) => prev + 56);
      }
    }
  }, [currentIndex, filteredImages, pageSize, showLoadMore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      
      // 텍스트 인풋 포커스 중에는 좌우 방향키 탐색 차단
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, handlePrevImage, handleNextImage]);

  const updateMetadata = async (fields: Partial<GeneratedImageRow>) => {
    if (!selectedImage) return;
    
    setSaveStatus("saving");
    try {
      const isFreeAsset = selectedImage.source_type === "free_assets";
      
      if (isFreeAsset) {
        if (fields.title !== undefined) {
          const { error } = await supabase
            .from("free_assets")
            .update({ title: fields.title })
            .eq("id", selectedImage.id);

          if (error) throw error;
        }
      } else {
        const { error } = await supabase
          .from("generated_images")
          .update(fields)
          .eq("id", selectedImage.id);

        if (error) throw error;
      }

      setSaveStatus("saved");

      // 로컬 선택 상태 동적 동기화
      const updatedImg = { ...selectedImage, ...fields };
      setSelectedImage(updatedImg);

      // 전체 이미지 리스트 내 관련 개체 라이브 갱신
      setImages((prev) =>
        prev.map((img) => (img.id === selectedImage.id ? updatedImg : img))
      );

      // 메모리 캐시 동기화
      if (dbCacheRef.current[activeTab]) {
        dbCacheRef.current[activeTab] = dbCacheRef.current[activeTab].map((img) =>
          img.id === selectedImage.id ? updatedImg : img
        );
      }

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 1500);
    } catch (error) {
      console.error("Failed to update metadata:", error);
      setSaveStatus("error");
    }
  };

  const handleBlur = (field: keyof GeneratedImageRow, value: string) => {
    if (!selectedImage) return;
    if (selectedImage[field] !== value) {
      updateMetadata({ [field]: value });
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setSubmitting(true);
    try {
      await onSelect(selectedImage);
      onClose();
    } catch (err: any) {
      console.error("Failed to set featured image:", err);
      const errMsg = err?.message || err?.details || String(err);
      alert(`대표 이미지 설정 도중 오류가 발생했습니다: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getProviderTitle = (tab: string) => {
    switch (tab) {
      case "pixabay": return "Pixabay";
      case "pexels": return "Pexels";
      case "adobe": return "Adobe Stock";
      case "shutterstock": return "Shutterstock";
      default: return tab.toUpperCase();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-[1440px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0c0f17] text-zinc-100">
        
        {/* 모달 헤더 */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-6">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-400" />
            대표 이미지(썸네일) 설정
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevImage}
              disabled={!selectedImage || currentIndex <= 0}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-900/80 disabled:hover:text-zinc-400 transition"
              title="이전 이미지 (좌측 방향키)"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextImage}
              disabled={!selectedImage || currentIndex >= filteredImages.length - 1}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-900/80 disabled:hover:text-zinc-400 transition"
              title="다음 이미지 (우측 방향키)"
            >
              <ChevronRight size={18} />
            </button>
            <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              title="닫기 (ESC)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 라이브러리 탭 선택 (가로 스크롤 대응) */}
        <div className="flex shrink-0 border-b border-zinc-900 bg-zinc-950/40 px-6 overflow-x-auto whitespace-nowrap scrollbar-none custom-scrollbar">
          {[
            { id: "creaibox", label: "크리에이박스 콘텐츠" },
            { id: "naver", label: "네이버 콘텐츠" },
            { id: "image", label: "이미지 콘텐츠" },
            { id: "creaset", label: "크리에셋박스" },
            { id: "pixabay", label: "Pixabay (외부 API)" },
            { id: "pexels", label: "Pexels (외부 API)" },
            { id: "adobe", label: "Adobe Stock (외부 API)" },
            { id: "shutterstock", label: "Shutterstock (외부 API)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedImage(null);
                setPageSize(56);
              }}
              className={`border-b-2 px-4 py-3 text-xs font-black transition-colors inline-block ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 외부 API 안내 배너 */}
        {["pixabay", "pexels", "adobe", "shutterstock"].includes(activeTab) && (
          <div className="shrink-0 bg-blue-500/10 border-b border-zinc-900/80 px-6 py-2.5 text-[11px] text-blue-400 font-bold flex items-center justify-between">
            <span>
              💡 마이페이지에서 {getProviderTitle(activeTab)} API 키를 등록하면 실시간 이미지 라이브러리 조회가 가능합니다. (현재는 데모 라이센스 모드로 동작 중)
            </span>
          </div>
        )}

        {/* 필터 및 검색 바 */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-zinc-900 bg-zinc-950/20 px-6 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder={
                  ["pixabay", "pexels", "adobe", "shutterstock"].includes(activeTab)
                    ? "키워드 검색..."
                    : "이미지 검색..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#07090e] py-1.5 pl-9 pr-4 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>

            {/* 비율 필터 버튼군 */}
            <div className="flex items-center gap-1.5">
              {[
                { id: "all", label: "전체" },
                { id: "16:9", label: "16:9" },
                { id: "4:3", label: "4:3" },
                { id: "9:16", label: "9:16" },
                { id: "1:1", label: "1:1" },
                { id: "etc", label: "기타" },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => {
                    setSelectedRatio(ratio.id);
                    setPageSize(56);
                  }}
                  className={`h-7 px-3 text-[11px] font-black rounded-lg transition-colors border ${
                    selectedRatio === ratio.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-[#07090e] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-zinc-500">
            총 {filteredImages.length}개의 이미지 검색됨
          </span>
        </div>

        {/* 본문 레이아웃: 좌측 바둑판 리스트 + 우측 상세 정보 패널 */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* 좌측: 바둑판 리스트 */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <RefreshCw size={24} className="animate-spin text-blue-500" />
              </div>
            ) : displayedImages.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-zinc-500">
                <ImageIcon size={32} className="mb-2 text-zinc-600" />
                <p className="text-xs font-black">표시할 이미지가 없습니다.</p>
                <p className="mt-1 text-[11px] text-zinc-600">
                  {activeTab === "creaset"
                    ? "크리에셋박스에 업로드된 이미지가 없습니다."
                    : ["pixabay", "pexels", "adobe", "shutterstock"].includes(activeTab)
                    ? "해당 검색어에 매칭되는 스톡 이미지가 없습니다."
                    : "원고 작성 시 저장된 이미지가 라이브러리에 노출됩니다."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 items-start">
                  {displayedImages.map((img) => {
                    const isSelected = selectedImage?.id === img.id;
                    return (
                      <div
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className={`group relative cursor-pointer overflow-hidden rounded-none border transition-all ${
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-500/50"
                            : "border-zinc-800/80 hover:border-zinc-700"
                        }`}
                      >
                        <img
                          src={
                            (img.image_url.includes("googleusercontent.com") || img.image_url.includes("drive.google.com"))
                              ? `/api/free-assets/proxy?url=${encodeURIComponent(img.image_url)}`
                              : img.image_url
                          }
                          alt={img.alt_text || img.title || "선택 이미지"}
                          className="w-full h-auto object-contain transition duration-150 group-hover:opacity-90"
                        />

                        {/* 선택 완료 배지 */}
                        {isSelected && (
                          <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                            <Check size={12} className="stroke-[3px]" />
                          </div>
                        )}

                        {/* 호버 툴팁 */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1.5 opacity-0 transition group-hover:opacity-100">
                          <p className="truncate text-[10px] font-bold text-white">
                            {img.title || "제목 없음"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 무한 스크롤 Sentinel 감지용 Loader */}
                {showLoadMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-6">
                    <RefreshCw size={20} className="animate-spin text-zinc-500" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-[440px] shrink-0 border-l border-zinc-800 bg-[#090b11]/60 flex flex-col overflow-y-auto custom-scrollbar">
            {selectedImage ? (
              <div className="p-5 space-y-5">
                {/* 1. 큰 이미지 프리뷰 */}
                <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/80 flex items-center justify-center p-2 min-h-[240px] max-h-[320px]">
                  <img
                    src={
                      (selectedImage.image_url.includes("googleusercontent.com") || selectedImage.image_url.includes("drive.google.com"))
                        ? `/api/free-assets/proxy?url=${encodeURIComponent(selectedImage.image_url)}`
                        : selectedImage.image_url
                    }
                    alt={selectedImage.title || "선택 이미지"}
                    className="max-h-[300px] w-full object-contain"
                  />
                </div>

                {/* 2. 첨부 파일 세부 정보 및 데이터 수정 영역 */}
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wide">첨부 파일 세부 사항</span>
                    {saveStatus === "saving" && <span className="text-[10px] text-amber-400 font-bold">저장 중...</span>}
                    {saveStatus === "saved" && <span className="text-[10px] text-emerald-400 font-bold">✓ 자동 저장됨</span>}
                    {saveStatus === "error" && <span className="text-[10px] text-red-400 font-bold">⚠ 저장 실패</span>}
                  </div>

                  {/* 읽기 전용 속성들 */}
                  <div className="grid grid-cols-2 gap-4 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900">
                    <div>
                      <h4 className="text-zinc-500 font-bold mb-0.5 text-[10px]">종횡비</h4>
                      <p className="text-zinc-200 font-semibold">
                        {resolvedRatios[selectedImage.id] || selectedImage.aspect_ratio || "content"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-zinc-500 font-bold mb-0.5 text-[10px]">스타일</h4>
                      <p className="text-zinc-200 font-semibold capitalize">
                        {selectedImage.style || "기본"}
                      </p>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-zinc-500 font-bold mb-0.5 text-[10px]">출처 / AI 툴</h4>
                      <p className="text-zinc-200 font-semibold capitalize">
                        {selectedImage.provider || "업로드"}
                      </p>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-zinc-500 font-bold mb-0.5 text-[10px]">등록 유형</h4>
                      <p className="text-zinc-200 font-semibold capitalize">
                        {selectedImage.source_type === "free_assets" ? "무료 에셋" : "개인 라이브러리"}
                      </p>
                    </div>
                  </div>

                  {/* 편집 가능 메타데이터 입력창 */}
                  <div className="space-y-3.5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wide">대체 텍스트 (Alt Text)</label>
                      <input
                        type="text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        onBlur={() => handleBlur("alt_text", altText)}
                        disabled={selectedImage.source_type === "free_assets"}
                        placeholder={selectedImage.source_type === "free_assets" ? "무료 에셋은 대체 텍스트 편집이 불가능합니다." : "대체 텍스트를 입력하세요..."}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 disabled:opacity-40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wide">제목 (Title)</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => handleBlur("title", title)}
                        placeholder="이미지 제목을 입력하세요..."
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wide">캡션 (Caption)</label>
                      <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        onBlur={() => handleBlur("caption", caption)}
                        disabled={selectedImage.source_type === "free_assets"}
                        placeholder={selectedImage.source_type === "free_assets" ? "무료 에셋은 캡션 편집이 불가능합니다." : "캡션을 입력하세요..."}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 disabled:opacity-40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wide">설명 (Description)</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => handleBlur("description", description)}
                        disabled={selectedImage.source_type === "free_assets"}
                        placeholder={selectedImage.source_type === "free_assets" ? "무료 에셋은 설명 편집이 불가능합니다." : "설명을 작성하세요..."}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 disabled:opacity-40"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-zinc-500 font-bold mb-1 text-[10px]">등록 일시</h4>
                    <p className="text-zinc-300">
                      {selectedImage.created_at
                        ? new Date(selectedImage.created_at).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </p>
                  </div>

                  {selectedImage.prompt && (
                    <div>
                      <h4 className="text-zinc-500 font-bold mb-1 text-[10px]">생성 프롬프트</h4>
                      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900/60 text-zinc-400 select-all max-h-36 overflow-y-auto custom-scrollbar italic break-words whitespace-pre-wrap leading-relaxed text-[11px]">
                        {selectedImage.prompt}
                      </div>
                    </div>
                  )}

                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div>
                      <h4 className="text-zinc-500 font-bold mb-1.5 text-[10px]">태그</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedImage.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[10px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                <ImageIcon size={36} className="mb-2.5 text-zinc-700 animate-pulse" />
                <p className="text-xs font-black">선택된 이미지 없음</p>
                <p className="mt-1 text-[10px] text-zinc-600 leading-normal">
                  바둑판에서 이미지를 클릭하면<br />상세 정보가 여기에 표시됩니다.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* 모달 푸터 */}
        <div className="flex h-20 shrink-0 items-center justify-between border-t border-zinc-800 bg-[#080a10] px-6">
          <div className="text-xs text-zinc-400">
            {selectedImage ? (
              <span className="font-bold text-blue-400">
                선택됨: {selectedImage.title || "제목 없음"}
              </span>
            ) : (
              <span>대표로 지정할 이미지를 바둑판에서 클릭해 주세요.</span>
            )}
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="inline-flex h-11 items-center rounded-xl border border-zinc-800 bg-zinc-900 px-5 text-xs font-black text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || submitting}
              className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-xs font-black text-white transition hover:bg-blue-500 disabled:opacity-40"
            >
              {submitting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                "대표 이미지(썸네일) 설정"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
