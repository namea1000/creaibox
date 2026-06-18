"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BlogImageMediaLibrarySection from "./BlogImageMediaLibrarySection";
import MediaLibrarySelectModal from "./MediaLibrarySelectModal";
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Globe,
  Grid,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  UploadCloud,
  Wand2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import BlogImagePromptBlueprintHub from "./BlogImagePromptBlueprintHub";
import type {
  BlogImagePost,
  BlogImagePreset,
  BlogImageStudioPanelProps,
  GeneratedImage,
  GeneratedImageRecord,
} from "./blogImageTypes";
import {
  aspectRatioOptions,
  colorToneOptions,
  DEFAULT_IMAGE_MODEL,
  IMAGE_BUCKET,
  layoutOptions,
  modelOptions,
  styleOptions,
  textIntensityOptions,
  textLanguageOptions,
  thumbnailTypeOptions,
} from "./blogImageConstants";
import {
  convertImageFileToWebp,
  downloadImageFile,
  normalizeImageModel,
  getStoragePathFromPublicUrl,
} from "./blogImageUtils";
import { getUserGeminiVaultConfig } from "@/lib/client/api-vault";

interface SourcePostRecord {
  id: string | number;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  target_keyword?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

export default function BlogImageStudioPanel({
  sourceType,
  sourceId,
  imageRole,
  title = "",
  content = "",
  targetKeyword = "",
  mode = "thumbnail",
  layout = "full",
  usePostInventory = false,
  postTableName = "writing_naver_posts",
  presetStorageKey = "blog:image:preset:v1",
}: BlogImageStudioPanelProps) {
  const supabase = useMemo(() => createClient(), []);

  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(DEFAULT_IMAGE_MODEL);
  const [selectedStyle, setSelectedStyle] = useState("naver-blog-vector");
  const [selectedStyleDetail, setSelectedStyleDetail] = useState("⭐ 정보성 비주얼");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(mode === "thumbnail" ? "3:2" : "4:3");
  const [selectedThumbnailType, setSelectedThumbnailType] = useState("general-informational");
  const [selectedTextIntensity, setSelectedTextIntensity] = useState("title-points-data");
  const [selectedLayout, setSelectedLayout] = useState("card-infographic");
  const [selectedColorTone, setSelectedColorTone] = useState("blue-yellow-news");
  const [selectedTextLanguage, setSelectedTextLanguage] = useState("ko");

  const [posts, setPosts] = useState<BlogImagePost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState(sourceId || "");
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);

  const [isPostListLoading, setIsPostListLoading] = useState(usePostInventory);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingUpload, setIsDraggingUpload] = useState(false);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [isPresetPanelOpen, setIsPresetPanelOpen] = useState(true);
  const [activePresetSlot, setActivePresetSlot] = useState<string | null>(null);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const [imagePresets, setImagePresets] = useState<Record<string, BlogImagePreset | null>>({
    recent: null,
    option1: null,
    option2: null,
    option3: null,
  });
  const [isBlueprintHubOpen, setIsBlueprintHubOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>("tech");
  const [openSaveMenuId, setOpenSaveMenuId] = useState<string | null>(null);
  const [isThumbnailTypeDropdownOpen, setIsThumbnailTypeDropdownOpen] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailTypeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (thumbnailTypeDropdownRef.current && !thumbnailTypeDropdownRef.current.contains(event.target as Node)) {
        setIsThumbnailTypeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const postListRef = useRef<HTMLDivElement | null>(null);

  const selectedStyleData = styleOptions.find((style) => style.value === selectedStyle);
  const activeSourceId = usePostInventory ? selectedPostId : String(sourceId || "");
  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  const selectPostByOffset = useCallback(
    (offset: number) => {
      if (!usePostInventory || posts.length === 0) return;

      const currentIndex = Math.max(
        0,
        posts.findIndex((post) => post.id === selectedPostId)
      );
      const nextIndex = Math.min(Math.max(currentIndex + offset, 0), posts.length - 1);
      const nextPost = posts[nextIndex];

      if (nextPost && nextPost.id !== selectedPostId) {
        setSelectedPostId(nextPost.id);
      }
    },
    [posts, selectedPostId, usePostInventory]
  );

  useEffect(() => {
    if (!usePostInventory) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();

      if (
        target?.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
      ) {
        return;
      }

      event.preventDefault();
      selectPostByOffset(event.key === "ArrowDown" ? 1 : -1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectPostByOffset, usePostInventory]);

  useEffect(() => {
    if (!selectedPostId) return;

    const selectedButton = postListRef.current?.querySelector<HTMLElement>(
      `[data-post-id="${CSS.escape(selectedPostId)}"]`
    );

    selectedButton?.scrollIntoView({ block: "nearest" });
  }, [selectedPostId]);

  const resolveUserId = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.id || null;
  }, [supabase]);

  const getCurrentPreset = useCallback(
    (): BlogImagePreset => ({
      selectedProvider,
      selectedStyle,
      selectedStyleDetail,
      selectedAspectRatio,
      selectedThumbnailType,
      selectedTextIntensity,
      selectedLayout,
      selectedColorTone,
      selectedTextLanguage,
    }),
    [
      selectedProvider,
      selectedStyle,
      selectedStyleDetail,
      selectedAspectRatio,
      selectedThumbnailType,
      selectedTextIntensity,
      selectedLayout,
      selectedColorTone,
      selectedTextLanguage,
    ]
  );

  const savePresetMap = useCallback(
    (nextPresets: Record<string, BlogImagePreset | null>) => {
      setImagePresets(nextPresets);

      if (typeof window !== "undefined") {
        localStorage.setItem(presetStorageKey, JSON.stringify(nextPresets));
      }
    },
    [presetStorageKey]
  );

  const applyPreset = useCallback((preset: BlogImagePreset) => {
    setSelectedProvider(normalizeImageModel(preset.selectedProvider));
    setSelectedStyle(preset.selectedStyle);
    setSelectedStyleDetail(preset.selectedStyleDetail);
    setSelectedAspectRatio(preset.selectedAspectRatio);
    setSelectedThumbnailType(preset.selectedThumbnailType);
    setSelectedTextIntensity(preset.selectedTextIntensity);
    setSelectedLayout(preset.selectedLayout);
    setSelectedColorTone(preset.selectedColorTone);
    setSelectedTextLanguage(preset.selectedTextLanguage);
  }, []);

  const getAutoPreset = useCallback((): BlogImagePreset => {
    const text = `${title} ${targetKeyword} ${content}`.toLowerCase();
    const base = getCurrentPreset();

    if (/주가|주식|증권|금리|투자|재테크|반도체|삼성전자|하이닉스|시장|전망/.test(text)) {
      return {
        ...base,
        selectedStyle: "naver-blog-vector",
        selectedStyleDetail: "⭐ 주식 차트형",
        selectedThumbnailType: "stock-finance-analysis",
        selectedTextIntensity: "title-points-data",
        selectedLayout: "chart-focused",
        selectedColorTone: "blue-yellow-news",
        selectedAspectRatio: "3:2",
      };
    }

    if (/뉴스|이슈|트렌드|전망|분석|리포트/.test(text)) {
      return {
        ...base,
        selectedStyle: "naver-blog-vector",
        selectedStyleDetail: "⭐ 뉴스 분석형",
        selectedThumbnailType: "latest-news-issue",
        selectedTextIntensity: "title-points-data",
        selectedLayout: "card-infographic",
        selectedColorTone: "blue-yellow-news",
        selectedAspectRatio: "3:2",
      };
    }

    return {
      ...base,
      selectedStyle: "naver-blog-vector",
      selectedStyleDetail: "⭐ 정보성 비주얼",
      selectedThumbnailType: "general-informational",
      selectedTextIntensity: "title-points-data",
      selectedLayout: "card-infographic",
      selectedColorTone: "blue-yellow-news",
      selectedAspectRatio: "3:2",
    };
  }, [content, getCurrentPreset, targetKeyword, title]);

  const handlePresetClick = useCallback(
    (slot: "recent" | "auto" | "option1" | "option2" | "option3") => {
      if (slot === "auto") {
        applyPreset(getAutoPreset());
        setActivePresetSlot("auto");
        return;
      }

      const savedPreset = imagePresets[slot];

      if (savedPreset) {
        applyPreset(savedPreset);
        setActivePresetSlot(slot);
        return;
      }

      if (slot === "recent") {
        alert("아직 최근 생성 프리셋이 없습니다.");
        return;
      }

      const nextPresets = {
        ...imagePresets,
        [slot]: getCurrentPreset(),
      };

      savePresetMap(nextPresets);
      setActivePresetSlot(slot);
    },
    [applyPreset, getAutoPreset, getCurrentPreset, imagePresets, savePresetMap]
  );

  const presetButtons = [
    {
      id: "recent" as const,
      label: "최근생성",
      description: imagePresets.recent ? "마지막 생성 조합" : "생성 후 저장",
    },
    {
      id: "auto" as const,
      label: "자동선택",
      description: "원고 기반 추천",
    },
    {
      id: "option1" as const,
      label: "옵션1",
      description: imagePresets.option1 ? "저장됨" : "현재값 저장",
    },
    {
      id: "option2" as const,
      label: "옵션2",
      description: imagePresets.option2 ? "저장됨" : "현재값 저장",
    },
    {
      id: "option3" as const,
      label: "옵션3",
      description: imagePresets.option3 ? "저장됨" : "현재값 저장",
    },
  ];

  const buildCurrentPost = useCallback((): BlogImagePost | null => {
    if (usePostInventory) return selectedPost;

    if (!sourceId) return null;

    return {
      id: String(sourceId),
      title: title || "제목 없음",
      keyword: targetKeyword || "블로그 이미지",
      content: content || "",
      type: "create",
    };
  }, [content, selectedPost, sourceId, targetKeyword, title, usePostInventory]);

  const buildPostPromptBase = useCallback((post: BlogImagePost | null) => {
    if (!post) {
      return [
        "[원고 제목] 블로그용 정보형 이미지",
        "[핵심 키워드] 블로그 이미지",
        "[본문 요약] 선택된 원고가 없으므로, 검색자가 한눈에 주제를 이해할 수 있는 정보형 이미지로 구성한다.",
      ].join("\n");
    }

    const contentSnippet = post.content.replace(/\s+/g, " ").trim().slice(0, 260);

    return [
      `[원고 제목] ${post.title}`,
      `[핵심 키워드] ${post.keyword}`,
      `[본문 요약] ${contentSnippet || "본문 내용을 바탕으로 핵심 메시지를 3~4개 포인트로 요약한다."}`,
    ].join("\n");
  }, []);

  const buildImagePrompt = useCallback(() => {
    const post = buildCurrentPost();

    const styleLabel = styleOptions.find((item) => item.value === selectedStyle)?.label || selectedStyle;
    const aspectRatioLabel = aspectRatioOptions.find((item) => item.value === selectedAspectRatio)?.label || selectedAspectRatio;
    const thumbnailTypeLabel = thumbnailTypeOptions.find((item) => item.value === selectedThumbnailType)?.label || selectedThumbnailType;
    const textIntensityLabel = textIntensityOptions.find((item) => item.value === selectedTextIntensity)?.label || selectedTextIntensity;
    const layoutLabel = layoutOptions.find((item) => item.value === selectedLayout)?.label || selectedLayout;
    const colorToneLabel = colorToneOptions.find((item) => item.value === selectedColorTone)?.label || selectedColorTone;
    const textLanguageLabel = textLanguageOptions.find((item) => item.value === selectedTextLanguage)?.label || selectedTextLanguage;

    const imageKind = mode === "thumbnail" ? "블로그 대표 썸네일" : "블로그 본문 삽입 이미지";

    return [
      `아래 조건을 정확히 반영해서 ${imageKind}를 만들어줘.`,
      "",
      "## 원고 정보",
      buildPostPromptBase(post),
      "",
      "## 선택 옵션",
      `- 이미지 스타일: ${styleLabel}`,
      `- 비주얼 표현 방식: ${selectedStyleDetail}`,
      `- 이미지 유형: ${thumbnailTypeLabel}`,
      `- 텍스트 강도: ${textIntensityLabel}`,
      `- 레이아웃: ${layoutLabel}`,
      `- 컬러 톤: ${colorToneLabel}`,
      `- 텍스트 언어: ${textLanguageLabel}`,
      `- 비율 / 사이즈: ${aspectRatioLabel} (${selectedAspectRatio})`,
      "",
      "## 디자인 지시",
      mode === "thumbnail"
        ? "큰 제목은 화면 왼쪽 또는 중앙에 배치하고, 핵심 포인트 3~4개를 작은 박스와 아이콘으로 정리하라. 바로 블로그 대표 썸네일로 사용할 수 있는 단일 이미지여야 한다."
        : "본문 중간에 자연스럽게 삽입할 수 있는 설명형 이미지로 구성하라. 과도한 타이포그래피보다 주제 이해를 돕는 시각 자료 중심으로 제작하라.",
    ].join("\n");
  }, [
    buildCurrentPost,
    buildPostPromptBase,
    mode,
    selectedAspectRatio,
    selectedColorTone,
    selectedLayout,
    selectedStyle,
    selectedStyleDetail,
    selectedTextIntensity,
    selectedTextLanguage,
    selectedThumbnailType,
  ]);

  useEffect(() => {
    setImagePrompt(buildImagePrompt());
  }, [buildImagePrompt]);

  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem(presetStorageKey);
      if (!savedPresets) return;

      const parsed = JSON.parse(savedPresets) as Record<string, BlogImagePreset | null>;

      setImagePresets({
        recent: parsed.recent || null,
        option1: parsed.option1 || null,
        option2: parsed.option2 || null,
        option3: parsed.option3 || null,
      });
    } catch (error) {
      console.error("이미지 프리셋 로드 실패:", error);
    }
  }, [presetStorageKey]);

  useEffect(() => {
    if (!usePostInventory) return;

    const loadPosts = async () => {
      setIsPostListLoading(true);

      try {
        const userId = await resolveUserId();
        if (!userId) return;

        const { data, error } = await supabase
          .from(postTableName)
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        const formatted = ((data || []) as SourcePostRecord[]).map((item) => {
          const fallbackKeyword = item.categories?.[0] || item.tags?.[0] || "일반 원고";

          return {
            id: String(item.id),
            title: item.title || "제목 없음",
            keyword: item.target_keyword || fallbackKeyword,
            content: item.content || "",
            type: item.post_type === "recreate" ? "recreate" : "create",
          } as BlogImagePost;
        });

        setPosts(formatted);

        if (formatted.length > 0) {
          setSelectedPostId(formatted[0].id);
        }
      } catch (error) {
        console.error("원고 목록 로드 실패:", error);
      } finally {
        setIsPostListLoading(false);
      }
    };

    void loadPosts();
  }, [postTableName, resolveUserId, supabase, usePostInventory]);

  useEffect(() => {
    const loadImages = async () => {
      setIsGalleryLoading(true);

      try {
        if (!activeSourceId) {
          setGallery([]);
          return;
        }

        const userId = await resolveUserId();
        if (!userId) {
          setGallery([]);
          return;
        }

        const { data, error } = await supabase
          .from("generated_images")
          .select("id, image_url, prompt, style, aspect_ratio, provider, source_type, source_id, image_role, is_primary, created_at")
          .eq("user_id", userId)
          .eq("source_type", sourceType)
          .eq("source_id", activeSourceId)
          .eq("image_role", imageRole)
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(60);

        if (error) throw error;

        const images: GeneratedImage[] = ((data || []) as GeneratedImageRecord[]).map((img) => ({
          id: String(img.id),
          url: img.image_url,
          style: img.style || "AI 이미지",
          prompt: img.prompt || "",
          type: "ai",
          aspectRatio: img.aspect_ratio || selectedAspectRatio,
          provider: img.provider || "gemini",
          sourceType: img.source_type || sourceType,
          sourceId: img.source_id || activeSourceId,
          imageRole: img.image_role || imageRole,
          isPrimary: Boolean(img.is_primary),
        }));

        setGallery(images);
      } catch (error) {
        console.error("이미지 목록 로드 실패:", error);
      } finally {
        setIsGalleryLoading(false);
      }
    };

    void loadImages();

    // Listen to representative image update events from the editor body
    const handleImagesUpdated = () => {
      void loadImages();
    };
    window.addEventListener("generated-images-updated", handleImagesUpdated);

    return () => {
      window.removeEventListener("generated-images-updated", handleImagesUpdated);
    };
  }, [activeSourceId, imageRole, resolveUserId, selectedAspectRatio, sourceType, supabase]);

  const handleCopyPrompt = async () => {
    if (!imagePrompt.trim()) {
      alert("복사할 프롬프트가 없습니다.");
      return;
    }

    await navigator.clipboard.writeText(imagePrompt);
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 1500);
  };

  const getUserApiConfig = () => {
    if (selectedProvider === "openai") {
      return {
        provider: "openai",
        apiKey: localStorage.getItem("openai_api_key") || "",
        model: localStorage.getItem("openai_model") || "gpt-image-1",
      };
    }

    const geminiConfig = getUserGeminiVaultConfig();

    return {
      provider: "gemini",
      apiKey: geminiConfig?.apiKey || "",
      model: normalizeImageModel(selectedProvider),
    };
  };

  const handleAiGenerateImage = async () => {
    if (!activeSourceId) return alert("이미지를 연결할 원고가 없습니다.");
    if (!imagePrompt.trim()) return alert("프롬프트를 입력해 주세요.");

    const userApiConfig = getUserApiConfig();

    if (!userApiConfig.apiKey) {
      alert("APIVault에서 API Key를 먼저 입력해주세요.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/image-studio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          count: 1,
          aspectRatio: selectedAspectRatio,
          provider: userApiConfig.provider,
          model: userApiConfig.model,
          apiKey: userApiConfig.apiKey,
          style: selectedStyle,
          styleDetail: selectedStyleDetail,
          sourceType,
          sourceId: activeSourceId,
          imageRole,
          markAsPrimary: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "이미지 생성에 실패했습니다.");
      }

      const newImages: GeneratedImage[] = (result.images || []).map((img: any, index: number) => ({
        id: String(img.id || `${Date.now()}-${index}`),
        url: img.image_url || img.url,
        style: img.style || selectedStyle,
        styleDetail: img.style_detail || selectedStyleDetail,
        prompt: img.prompt || imagePrompt,
        type: "ai",
        aspectRatio: img.aspect_ratio || selectedAspectRatio,
        provider: img.provider || selectedProvider,
        sourceType: img.source_type || sourceType,
        sourceId: img.source_id || activeSourceId,
        imageRole: img.image_role || imageRole,
        isPrimary: Boolean(img.is_primary),
      }));

      savePresetMap({
        ...imagePresets,
        recent: getCurrentPreset(),
      });
      setActivePresetSlot("recent");

      setGallery((prev) => [
        ...newImages,
        ...prev.map((item) => ({
          ...item,
          isPrimary: mode === "thumbnail" ? false : item.isPrimary,
        })),
      ]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "이미지 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchStockImages = () => {
    if (!stockSearchQuery.trim()) {
      alert("키워드를 입력하세요.");
      return;
    }

    setIsStockLoading(true);

    setTimeout(() => {
      const stockImages: GeneratedImage[] = [
        {
          id: `stock-${Date.now()}-1`,
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
          style: "무료 스톡 이미지",
          styleDetail: "Unsplash",
          prompt: stockSearchQuery,
          type: "stock",
          aspectRatio: selectedAspectRatio,
          provider: "stock",
          sourceType,
          sourceId: activeSourceId,
          imageRole,
          isPrimary: false,
        },
      ];

      setGallery((prev) => [...stockImages, ...prev]);
      setIsStockLoading(false);
    }, 700);
  };

  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (files.length === 0) return alert("이미지 파일만 업로드할 수 있습니다.");
    if (!activeSourceId) return alert("이미지를 연결할 원고가 없습니다.");

    setIsUploading(true);

    try {
      const userId = await resolveUserId();
      if (!userId) return alert("로그인 세션을 확인할 수 없습니다.");

      const uploadedImages: GeneratedImage[] = [];

      for (const [index, file] of files.entries()) {
        const currentPost = buildCurrentPost();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("sourceType", sourceType);
        formData.append("sourceId", activeSourceId);
        formData.append("imageRole", imageRole);
        formData.append("title", currentPost?.title || title || "선택 원고");
        formData.append("targetKeyword", imagePrompt.trim());

        const response = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "이미지 업로드에 실패했습니다.");
        }

        const data = result.image;

        uploadedImages.push({
          id: String(data.id),
          url: data.image_url,
          style: data.style || selectedStyle,
          prompt: data.prompt || "",
          type: "ai",
          aspectRatio: data.aspect_ratio || selectedAspectRatio,
          provider: data.provider || selectedProvider,
          sourceType: data.source_type || sourceType,
          sourceId: data.source_id || activeSourceId,
          imageRole: data.image_role || imageRole,
          isPrimary: Boolean(data.is_primary),
        });
      }

      setGallery((prev) => [...uploadedImages, ...prev]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      setIsDraggingUpload(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };

  const handleSetFeaturedImage = async (selectedImage: any) => {
    if (!activeSourceId) return;

    try {
      const userId = await resolveUserId();
      if (!userId) {
        alert("로그인 세션을 확인할 수 없습니다.");
        return;
      }

      // 지원되는 모든 속성명에 대해 안전하게 체크하여 URL 및 기타 필드 추출
      const imageUrl = selectedImage.image_url || selectedImage.url;
      if (!imageUrl) {
        throw new Error("이미지 URL을 확인할 수 없습니다.");
      }

      const promptVal = selectedImage.prompt || "복제된 대표 이미지";
      const styleVal = selectedImage.style || "manual";
      const aspectRatioVal = selectedImage.aspect_ratio || selectedImage.aspectRatio || "content";
      const providerVal = selectedImage.provider || "upload";
      const titleVal = selectedImage.title || "대표 이미지";
      const captionVal = selectedImage.caption || "";
      const descriptionVal = selectedImage.description || "";
      const altTextVal = selectedImage.alt_text || selectedImage.altText || "";

      // 1. 기존 대표 썸네일 해제
      const { error: clearError } = await supabase
        .from("generated_images")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .eq("source_type", sourceType)
        .eq("source_id", activeSourceId)
        .eq("image_role", imageRole);

      if (clearError) throw clearError;

      // 2. 선택된 이미지 안전 복제하여 대표 설정
      const { data: inserted, error: insertError } = await supabase
        .from("generated_images")
        .insert({
          user_id: userId,
          prompt: promptVal,
          image_url: imageUrl,
          style: styleVal,
          aspect_ratio: aspectRatioVal,
          provider: providerVal,
          source_type: sourceType,
          source_id: activeSourceId,
          image_role: imageRole,
          is_primary: true,
          title: titleVal,
          caption: captionVal,
          description: descriptionVal,
          alt_text: altTextVal,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. gallery 상태 최신화
      const formattedImg: GeneratedImage = {
        id: String(inserted.id),
        url: inserted.image_url,
        style: inserted.style || "AI 이미지",
        prompt: inserted.prompt || "",
        type: "ai",
        aspectRatio: inserted.aspect_ratio || selectedAspectRatio,
        provider: inserted.provider || "gemini",
        sourceType: inserted.source_type || sourceType,
        sourceId: inserted.source_id || activeSourceId,
        imageRole: inserted.image_role || imageRole,
        isPrimary: Boolean(inserted.is_primary),
      };

      setGallery((prev) => [
        formattedImg,
        ...prev.map((item) => ({
          ...item,
          isPrimary: false,
        })),
      ]);
    } catch (err: any) {
      console.error("Failed to set featured image in panel handler:", {
        message: err?.message || String(err),
        code: err?.code,
        details: err?.details,
        hint: err?.hint,
        err
      });
      throw err;
    }
  };

  const handleDeleteImage = async (image: GeneratedImage) => {
    const confirmed = window.confirm("이 이미지를 DB와 Storage에서 모두 삭제할까요?");
    if (!confirmed) return;

    try {
      const userId = await resolveUserId();

      if (!userId) {
        alert("로그인 세션을 확인할 수 없습니다.");
        return;
      }

      const storagePath = getStoragePathFromPublicUrl(image.url);

      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from(IMAGE_BUCKET)
          .remove([storagePath]);

        if (storageError) {
          throw new Error(`Storage 삭제 실패: ${storageError.message}`);
        }
      }

      const { error: deleteError } = await supabase
        .from("generated_images")
        .delete()
        .eq("user_id", userId)
        .eq("id", image.id);

      if (deleteError) {
        throw new Error(`DB 삭제 실패: ${deleteError.message}`);
      }

      setGallery((prev) => prev.filter((item) => item.id !== image.id));
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      alert(error instanceof Error ? error.message : "이미지 삭제에 실패했습니다.");
    }
  };

  const handleSetPrimary = async (image: GeneratedImage) => {
    if (!activeSourceId) return;

    try {
      const userId = await resolveUserId();
      if (!userId) return alert("로그인 세션을 확인할 수 없습니다.");

      await supabase
        .from("generated_images")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .eq("source_type", sourceType)
        .eq("source_id", activeSourceId)
        .eq("image_role", imageRole);

      const { error } = await supabase
        .from("generated_images")
        .update({ is_primary: true })
        .eq("user_id", userId)
        .eq("id", image.id);

      if (error) throw error;

      setGallery((prev) =>
        prev
          .map((item) => ({ ...item, isPrimary: item.id === image.id }))
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      );
    } catch (error) {
      alert("대표 이미지 지정에 실패했습니다.");
    }
  };

  return (
    <div
      className={
        layout === "side"
          ? "flex h-full w-full flex-col overflow-y-auto text-[13px] text-zinc-100 custom-scrollbar"
          : "grid h-[calc(100vh-100px)] w-full grid-cols-1 gap-0 overflow-hidden text-[13px] text-zinc-100 xl:[grid-template-columns:320px_430px_minmax(0,1fr)]"
      }
    >
      {usePostInventory && (
        <div className="flex h-full flex-col overflow-hidden border-r border-zinc-800/60">
          <h3 className="flex h-14 shrink-0 items-center gap-1.5 border-b border-zinc-800/60 bg-slate-950/40 px-4 text-[13px] font-black uppercase tracking-[0.15em] text-emerald-400">
            <FileText size={13} /> Manuscript Inventory
          </h3>

          <div ref={postListRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-4 custom-scrollbar">
            {isPostListLoading ? (
              <div className="flex h-full items-center justify-center text-zinc-500">원고 목록 불러오는 중...</div>
            ) : (
              posts.map((post) => (
                <button
                  key={post.id}
                  data-post-id={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition ${selectedPostId === post.id
                    ? "border-emerald-700/50 bg-emerald-950/10"
                    : "border-zinc-800/80 bg-zinc-950/30 hover:bg-zinc-900/40"
                    }`}
                >
                  <div className="flex justify-between gap-2">
                    <span className="line-clamp-2 font-black text-zinc-200">{post.title}</span>
                    {selectedPostId === post.id && <Check size={12} className="text-emerald-400" />}
                  </div>
                  <p className="mt-2 text-zinc-500">#{post.keyword}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex h-full flex-col overflow-y-auto border-r border-zinc-800/60 custom-scrollbar">
        <div className="flex h-14 items-center justify-between border-b border-zinc-800/60 bg-slate-950/40 px-4">
          <h3 className="flex items-center gap-1.5 font-black uppercase tracking-[0.15em] text-blue-400">
            <Wand2 size={13} /> {mode === "thumbnail" ? "AI Thumbnail Engine" : "AI Content Image Engine"}
          </h3>

          <button
            type="button"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 font-black text-blue-300 hover:bg-blue-500/20"
          >
            <Copy size={13} />
            {isPromptCopied ? "복사 완료" : "프롬프트 복사"}
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            className="h-44 w-full resize-none bg-zinc-950 p-3 leading-relaxed text-zinc-300 outline-none"
          />

          <div className="-mx-4 border-y border-zinc-800/80 bg-zinc-950/30">
            <button
              type="button"
              onClick={() => setIsPresetPanelOpen((current) => !current)}
              className="flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-slate-950/70 px-4 text-left text-[13px] font-black text-zinc-100 transition hover:bg-blue-950/20"
            >
              <span className="flex items-center gap-2">
                <Grid size={14} className="text-blue-400" />
                썸네일 스타일 세부 옵션
              </span>
              {isPresetPanelOpen ? (
                <ChevronUp size={17} className="text-zinc-300" />
              ) : (
                <ChevronDown size={17} className="text-zinc-300" />
              )}
            </button>

            {isPresetPanelOpen && (
              <div>
                <div className="grid grid-cols-5">
                  {presetButtons.map((preset) => {
                    const isActive = activePresetSlot === preset.id;
                    const isSaved =
                      preset.id === "auto" ||
                      Boolean(imagePresets[preset.id as keyof typeof imagePresets]);

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetClick(preset.id)}
                        className={`min-w-0 border-r border-zinc-800/70 px-2 py-2.5 text-center transition last:border-r-0 ${isActive
                          ? "bg-blue-500/15 text-blue-200"
                          : "bg-zinc-950 text-zinc-400 hover:bg-blue-950/20 hover:text-blue-200"
                          }`}
                      >
                        <span className="block truncate text-[13px] font-black">{preset.label}</span>
                        <span
                          className={`mt-0.5 block truncate text-[11px] font-bold ${isSaved ? "text-emerald-400/80" : "text-zinc-600"
                            }`}
                        >
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-800/80">
                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">1. 이미지 생성 모델</label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {modelOptions.map((model) => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">2. 스타일 선택</label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => {
                        const nextStyle = e.target.value;
                        const nextStyleData = styleOptions.find((style) => style.value === nextStyle);
                        setSelectedStyle(nextStyle);
                        setSelectedStyleDetail(nextStyleData?.details[0] || "");
                      }}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {styleOptions.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">3. 비주얼 표현 방식</label>
                    <select
                      value={selectedStyleDetail}
                      onChange={(e) => setSelectedStyleDetail(e.target.value)}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {selectedStyleData?.details.map((detail) => (
                        <option key={detail} value={detail}>
                          {detail}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">4. 비율 사이즈 선택</label>
                    <select
                      value={selectedAspectRatio}
                      onChange={(e) => setSelectedAspectRatio(e.target.value)}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {aspectRatioOptions.map((ratio) => (
                        <option key={ratio.value} value={ratio.value}>
                          {ratio.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">5. 썸네일 유형</label>
                    <div className="relative w-full border-l border-zinc-800 bg-blue-950/10 font-bold text-zinc-100 outline-none" ref={thumbnailTypeDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsThumbnailTypeDropdownOpen(!isThumbnailTypeDropdownOpen)}
                        className="flex h-10 w-full items-center justify-between px-3 text-left outline-none text-[13px] font-bold"
                      >
                        <span className="truncate">
                          {thumbnailTypeOptions.find((opt) => opt.value === selectedThumbnailType)?.label || "선택해 주세요"}
                        </span>
                        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 shrink-0 ml-1 ${isThumbnailTypeDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isThumbnailTypeDropdownOpen && (
                        <div className="absolute left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-[#0e1322] p-2 shadow-2xl backdrop-blur-md custom-scrollbar">
                          {thumbnailTypeOptions.map((option) => {
                            if (option.disabled) {
                              return (
                                <div
                                  key={option.value}
                                  className="px-3 py-2 text-xs font-black text-cyan-300 border-b border-white/5 mt-3 first:mt-0 bg-white/[0.03] rounded-md"
                                >
                                  {option.label}
                                </div>
                              );
                            }

                            const isSelected = selectedThumbnailType === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setSelectedThumbnailType(option.value);
                                  setIsThumbnailTypeDropdownOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-2.5 text-left text-xs transition duration-150 rounded-lg mt-0.5 first:mt-0 ${
                                  isSelected
                                    ? "bg-cyan-500/20 text-cyan-200 font-bold"
                                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">6. 텍스트 강도</label>
                    <select
                      value={selectedTextIntensity}
                      onChange={(e) => setSelectedTextIntensity(e.target.value)}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {textIntensityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">7. 레이아웃</label>
                    <select
                      value={selectedLayout}
                      onChange={(e) => setSelectedLayout(e.target.value)}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {layoutOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center border-b border-zinc-800/70 transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">8. 컬러 톤</label>
                    <select
                      value={selectedColorTone}
                      onChange={(e) => setSelectedColorTone(e.target.value)}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {colorToneOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center transition hover:bg-blue-950/10">
                    <label className="px-4 py-2.5 font-bold text-zinc-100">9. 텍스트 언어</label>
                    <select
                      value={selectedTextLanguage}
                      onChange={(e) => setSelectedTextLanguage(e.target.value)}
                      className="h-10 w-full border-l border-zinc-800 bg-blue-950/10 px-3 font-bold text-zinc-100 outline-none"
                    >
                      {textLanguageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAiGenerateImage}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 py-3.5 font-black text-white disabled:opacity-60"
          >
            {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isGenerating ? "이미지 생성 및 저장 중..." : "AI 이미지 생성 시작"}
          </button>
          {mode === "thumbnail" && (
            <button
              type="button"
              onClick={() => setIsMediaModalOpen(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 py-3.5 font-black text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-500 hover:to-pink-500 active:scale-[0.98]"
            >
              <ImageIcon size={14} className="text-pink-100" />
              대표 이미지(썸네일) 설정
            </button>
          )}
          {layout === "side" && (
            <BlogImageMediaLibrarySection
              gallery={gallery}
              setGallery={setGallery}
              isGalleryLoading={isGalleryLoading}
              isUploading={isUploading}
              isDraggingUpload={isDraggingUpload}
              setIsDraggingUpload={setIsDraggingUpload}
              handleUploadFiles={handleUploadFiles}
              resolveUserId={resolveUserId}
              sourceType={sourceType}
              sourceId={activeSourceId}
              imageRole={imageRole}
              mode={mode}
              onOpenMediaModal={() => setIsMediaModalOpen(true)}
              className="mt-4 border-t border-zinc-800/60"
            />
          )}
        </div>

        <div className="space-y-3 shrink-0 border-t border-zinc-800/50 px-4 pt-4">
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
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-16 text-zinc-200"
            />
            <button
              onClick={handleSearchStockImages}
              disabled={isStockLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 px-4 py-1.5 text-[13px] font-black text-emerald-400"
            >
              {isStockLoading ? "조회중" : "찾기"}
            </button>
          </div>
        </div>

        <BlogImagePromptBlueprintHub
          isOpen={isBlueprintHubOpen}
          setIsOpen={setIsBlueprintHubOpen}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setImagePrompt={setImagePrompt}
        />
      </div>
      {layout === "full" && activeSourceId && (
        <BlogImageMediaLibrarySection
          gallery={gallery}
          setGallery={setGallery}
          isGalleryLoading={isGalleryLoading}
          isUploading={isUploading}
          isDraggingUpload={isDraggingUpload}
          setIsDraggingUpload={setIsDraggingUpload}
          handleUploadFiles={handleUploadFiles}
          resolveUserId={resolveUserId}
          sourceType={sourceType}
          sourceId={activeSourceId}
          imageRole={imageRole}
          mode={mode}
          className="h-full min-w-0 border-l border-zinc-800/60"
        />
      )}
      {isMediaModalOpen && (
        <MediaLibrarySelectModal
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleSetFeaturedImage}
        />
      )}
    </div>
  );
}
