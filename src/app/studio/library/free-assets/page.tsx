"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  UploadCloud,
  Download,
  Eye,
  Music,
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  X,
  Loader2,
  Share2,
  Heart,
  Tag,
  ArrowLeft,
  Volume2,
  FileText,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface FreeAsset {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  title: string;
  tags: string[];
  mediaType: "photo" | "illustration" | "video" | "music" | "gif" | string;
  uploader: string;
  downloads: number;
  views: number;
  aspectRatio?: string;
  generationType?: "ai" | "real" | string;
  width?: number;
  height?: number;
  camera?: string;
}

export default function FreeAssetsLibraryPage() {
  const [assets, setAssets] = useState<FreeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("all");
  
  // Modal states
  const [selectedAsset, setSelectedAsset] = useState<FreeAsset | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // User session states
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Upload Form states
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [fileAspectRatios, setFileAspectRatios] = useState<Record<string, string>>({});
  const [fileResolutions, setFileResolutions] = useState<Record<string, { width: number; height: number }>>({});
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadMediaType, setUploadMediaType] = useState("photo");
  const [uploadGenerationType, setUploadGenerationType] = useState<"ai" | "real">("real");
  const [uploadCamera, setUploadCamera] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Edit Form states
  const [editAssetId, setEditAssetId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editMediaType, setEditMediaType] = useState("photo");
  const [editGenerationType, setEditGenerationType] = useState<"ai" | "real">("real");
  const [editAspectRatio, setEditAspectRatio] = useState("");
  const [editCamera, setEditCamera] = useState("");
  const [updatingAsset, setUpdatingAsset] = useState(false);
  const [deletingAsset, setDeletingAsset] = useState(false);

  // Advanced download and share dropdown states
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [downloadTargetFormat, setDownloadTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [downloadingFormatText, setDownloadingFormatText] = useState("");
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(3);
  const [isEditAccordionOpen, setIsEditAccordionOpen] = useState(false);

  // Audio Playback states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const downloadDropdownRef = useRef<HTMLDivElement | null>(null);
  const shareDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch Assets List
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/free-assets/list");
      const data = await response.json();
      if (response.ok) {
        setAssets(data.files || []);
      } else {
        console.error("Failed to load free assets:", data.error);
      }
    } catch (err) {
      console.error("Error fetching free assets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAssets();
  }, [fetchAssets]);

  // Load User Session
  useEffect(() => {
    const supabase = createClient();
    
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUserEmail(session.user.email || null);
          
          // Fetch admin role from profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (profile?.role === "ADMIN") {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
      }
    };
    
    void loadUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user) {
        setCurrentUserEmail(session.user.email || null);
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle();
          
          setIsAdmin(profile?.role === "ADMIN");
        } catch {
          setIsAdmin(false);
        }
      } else {
        setCurrentUserEmail(null);
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reset dropdown state when current selected asset changes or closes
  useEffect(() => {
    setIsDownloadDropdownOpen(false);
    setIsShareDropdownOpen(false);
    setIsEditAccordionOpen(false);
  }, [selectedAsset?.id]);

  // Handle outside click for both dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isDownloadDropdownOpen &&
        downloadDropdownRef.current &&
        !downloadDropdownRef.current.contains(target)
      ) {
        setIsDownloadDropdownOpen(false);
      }
      if (
        isShareDropdownOpen &&
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(target)
      ) {
        setIsShareDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDownloadDropdownOpen, isShareDropdownOpen]);

  const handleOpenUpload = () => {
    if (!currentUserEmail) {
      if (confirm("나눔 에셋 업로드는 로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?")) {
        window.location.href = "/login?redirect=/studio/library/free-assets";
      }
      return;
    }
    setIsUploadOpen(true);
  };

  const handleDeleteAsset = async (fileId: string) => {
    if (!confirm("이 에셋을 영구 삭제하시겠습니까? 구글 드라이브에서도 완전히 삭제되며 복구할 수 없습니다.")) return;
    
    setDeletingAsset(true);
    try {
      const response = await fetch("/api/free-assets/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      
      if (response.ok) {
        alert("에셋이 성공적으로 삭제되었습니다.");
        setSelectedAsset(null);
        void fetchAssets();
      } else {
        const data = await response.json();
        alert(`삭제 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (err: any) {
      alert(`오류 발생: ${err.message}`);
    } finally {
      setDeletingAsset(false);
    }
  };

  const openEditModal = (asset: FreeAsset) => {
    setEditAssetId(asset.id);
    setEditTitle(asset.title);
    setEditTags(asset.tags.join(", "));
    setEditMediaType(asset.mediaType);
    setEditGenerationType((asset.generationType as "ai" | "real") || "real");
    setEditAspectRatio(asset.aspectRatio || "");
    setEditCamera(asset.camera || "촬영 정보 없음");
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAssetId) return;
    
    setUpdatingAsset(true);
    
    const tagsArray = editTags
      ? editTags.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [];
      
    try {
      const response = await fetch("/api/free-assets/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: editAssetId,
          title: editTitle,
          tags: tagsArray,
          mediaType: editMediaType,
          generationType: editGenerationType,
          aspectRatio: editAspectRatio,
          camera: editCamera,
        }),
      });
      
      if (response.ok) {
        alert("에셋 정보가 수정되었습니다.");
        setIsEditOpen(false);
        
        if (selectedAsset && selectedAsset.id === editAssetId) {
          setSelectedAsset({
            ...selectedAsset,
            title: editTitle,
            tags: tagsArray,
            mediaType: editMediaType,
            generationType: editGenerationType,
            aspectRatio: editAspectRatio,
            camera: editCamera,
          });
        }
        
        void fetchAssets();
      } else {
        const data = await response.json();
        alert(`수정 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (err: any) {
      alert(`오류 발생: ${err.message}`);
    } finally {
      setUpdatingAsset(false);
    }
  };

  // Audio lifecycle handler
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setPlayingAudioId(null);
      };
    }

    const audio = audioRef.current;

    return () => {
      audio.pause();
      setPlayingAudioId(null);
    };
  }, []);

  const toggleAudio = (asset: FreeAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (playingAudioId === asset.id) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      audioRef.current.src = asset.url;
      void audioRef.current.play();
      setPlayingAudioId(asset.id);
      
      // Increment view count when previewing audio
      void registerAction(asset.id, "views");
    }
  };

  // Register View or Download Action
  const registerAction = async (fileId: string, action: "downloads" | "views") => {
    try {
      const response = await fetch("/api/free-assets/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, action }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update local stats
        setAssets((prev) =>
          prev.map((item) =>
            item.id === fileId
              ? {
                  ...item,
                  downloads: data.metadata.downloads,
                  views: data.metadata.views,
                }
              : item
          )
        );
        if (selectedAsset && selectedAsset.id === fileId) {
          setSelectedAsset((prev) =>
            prev
              ? {
                  ...prev,
                  downloads: data.metadata.downloads,
                  views: data.metadata.views,
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error("Failed to register asset action:", err);
    }
  };

  // Asset click handler (Detail Modal Open)
  const openDetailModal = (asset: FreeAsset) => {
    setSelectedAsset(asset);
    void registerAction(asset.id, "views");
  };

  // File Download trigger
  const triggerDownload = (asset: FreeAsset) => {
    void registerAction(asset.id, "downloads");
    
    // Create temporary link to trigger native browser download
    const link = document.createElement("a");
    link.href = asset.url;
    link.download = asset.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aspect Ratio Detectors
  const getClosestAspectRatio = (width: number, height: number): string => {
    const ratio = width / height;
    const targets = [
      { label: "16:9", val: 16 / 9 },
      { label: "9:16", val: 9 / 16 },
      { label: "4:3", val: 4 / 3 },
      { label: "3:4", val: 3 / 4 },
      { label: "1:1", val: 1 / 1 },
    ];
    
    let closest = targets[0];
    let minDiff = Math.abs(ratio - closest.val);
    
    for (let i = 1; i < targets.length; i++) {
      const diff = Math.abs(ratio - targets[i].val);
      if (diff < minDiff) {
        minDiff = diff;
        closest = targets[i];
      }
    }
    
    if (minDiff > 0.15) {
      return "기타";
    }
    
    return closest.label;
  };

  interface FileDimension {
    width: number;
    height: number;
    aspectRatio: string;
  }

  const detectFileDimension = (file: File): Promise<FileDimension> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          const ratio = getClosestAspectRatio(img.width, img.height);
          resolve({ width: img.width, height: img.height, aspectRatio: ratio });
        };
        img.onerror = () => {
          resolve({ width: 0, height: 0, aspectRatio: "기타" });
        };
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          const ratio = getClosestAspectRatio(video.videoWidth, video.videoHeight);
          resolve({ width: video.videoWidth, height: video.videoHeight, aspectRatio: ratio });
        };
        video.onerror = () => {
          resolve({ width: 0, height: 0, aspectRatio: "기타" });
        };
      } else {
        resolve({ width: 0, height: 0, aspectRatio: "" });
      }
    });
  };

  const compressImageFile = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        resolve(file);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        let width = img.width;
        let height = img.height;
        const maxLen = 2560;

        if (width > maxLen || height > maxLen) {
          if (width > height) {
            height = Math.round((height * maxLen) / width);
            width = maxLen;
          } else {
            width = Math.round((width * maxLen) / height);
            height = maxLen;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const newFileName = `${originalName}.jpg`;
            
            const compressedFile = new File([blob], newFileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => {
        resolve(file);
      };
    });
  };

  const downloadResizedImage = async (imageUrl: string, fileName: string, targetWidth: number, targetHeight: number, targetFormat: 'jpeg' | 'png' | 'webp') => {
    setDownloadingFormatText("이미지 변환 중...");
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      // Smart CORS Proxy: To fully bypass canvas tainting, load through proxy
      const proxiedUrl = `/api/free-assets/proxy?url=${encodeURIComponent(imageUrl)}`;
      
      const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error("이미지 로드에 실패했습니다."));
        img.src = proxiedUrl;
      });
      
      const loadedImg = await imageLoadPromise;
      
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context creation failed");
      
      ctx.drawImage(loadedImg, 0, 0, targetWidth, targetHeight);
      
      let mimeType = "image/jpeg";
      let fileExt = "jpg";
      if (targetFormat === "png") {
        mimeType = "image/png";
        fileExt = "png";
      } else if (targetFormat === "webp") {
        mimeType = "image/webp";
        fileExt = "webp";
      }
      
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("이미지 변환 중 오류가 발생했습니다.");
          setDownloadingFormatText("");
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const baseName = fileName.replace(/\.[^/.]+$/, "");
        link.download = `${baseName}_${targetWidth}x${targetHeight}.${fileExt}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setDownloadingFormatText("");
      }, mimeType, 0.9);
      
    } catch (err: any) {
      console.error("Canvas conversion failed:", err);
      alert("다운로드 중 변환 오류가 발생했습니다. 원본 파일을 직접 다운로드합니다.");
      setDownloadingFormatText("");
      // Fallback: download original
      triggerDownload(selectedAsset!);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processNewFiles = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const mergedFiles = [...uploadFiles, ...newFiles];
    setUploadFiles(mergedFiles);

    if (mergedFiles.length === 1 && !uploadTitle) {
      setUploadTitle(mergedFiles[0].name.replace(/\.[^/.]+$/, ""));
    }

    autoDetectMediaType(mergedFiles[0]);

    const dimensionPromises = newFiles.map(async (file) => {
      const dim = await detectFileDimension(file);
      return { name: file.name, ...dim };
    });

    const results = await Promise.all(dimensionPromises);
    
    setFileAspectRatios((prev) => {
      const updated = { ...prev };
      results.forEach(({ name, aspectRatio }) => {
        if (aspectRatio) {
          updated[name] = aspectRatio;
        }
      });
      return updated;
    });

    setFileResolutions((prev) => {
      const updated = { ...prev };
      results.forEach(({ name, width, height }) => {
        updated[name] = { width, height };
      });
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      void processNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void processNewFiles(Array.from(e.target.files));
    }
  };

  const removeUploadFile = (indexToRemove: number) => {
    setUploadFiles((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (updated.length === 1) {
        setUploadTitle(updated[0].name.replace(/\.[^/.]+$/, ""));
      } else if (updated.length === 0) {
        setUploadTitle("");
      }
      return updated;
    });
  };

  const autoDetectMediaType = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) {
      if (type.includes("gif")) {
        setUploadMediaType("gif");
      } else {
        setUploadMediaType("photo");
      }
    } else if (type.startsWith("video/")) {
      setUploadMediaType("video");
    } else if (type.startsWith("audio/")) {
      setUploadMediaType("music");
    }
  };

  const getMediaTypeForFile = (file: File, selectedGlobalType: string) => {
    const type = file.type;
    if (type.startsWith("image/")) {
      if (type.includes("gif")) return "gif";
      if (selectedGlobalType === "illustration") return "illustration";
      return "photo";
    } else if (type.startsWith("video/")) {
      return "video";
    } else if (type.startsWith("audio/")) {
      return "music";
    }
    return selectedGlobalType;
  };

  // Submit Asset Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return alert("파일을 선택해 주세요.");

    setUploading(true);
    let successCount = 0;
    const failedFiles: string[] = [];

    for (let i = 0; i < uploadFiles.length; i++) {
      let file = uploadFiles[i];
      let width = 0;
      let height = 0;
      let aspect = "";

      // 이미지이고 GIF가 아닌 경우 자동 압축 및 리사이즈 처리
      if (file.type.startsWith("image/") && file.type !== "image/gif") {
        setUploadProgressText(`${i + 1} / ${uploadFiles.length}개 이미지 최적화 가공 중...`);
        try {
          file = await compressImageFile(file);
        } catch (compressErr) {
          console.error("Image compression failed, fallback to original:", compressErr);
        }
      }

      // 가공된 (또는 원본) 파일 기준 해상도 분석
      try {
        const dim = await detectFileDimension(file);
        width = dim.width;
        height = dim.height;
        aspect = dim.aspectRatio;
      } catch (dimErr) {
        console.error("Dimension detection failed:", dimErr);
      }

      setUploadProgressText(`${i + 1} / ${uploadFiles.length}개 파일 업로드 중...`);

      const formData = new FormData();
      formData.append("file", file);
      
      const fileTitle = uploadFiles.length === 1 
        ? uploadTitle 
        : file.name.replace(/\.[^/.]+$/, "");
      
      formData.append("title", fileTitle);
      formData.append("tags", uploadTags);
      formData.append("mediaType", getMediaTypeForFile(file, uploadMediaType));
      formData.append("generationType", uploadGenerationType);

      if (aspect) {
        formData.append("aspectRatio", aspect);
      }
      if (width > 0 && height > 0) {
        formData.append("width", width.toString());
        formData.append("height", height.toString());
      }
      formData.append("camera", uploadCamera || "촬영 정보 없음");

      try {
        const response = await fetch("/api/free-assets/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          successCount++;
        } else {
          const result = await response.json();
          failedFiles.push(`${file.name} (${result.error || "실패"})`);
        }
      } catch (err: any) {
        failedFiles.push(`${file.name} (오류: ${err.message || "알 수 없음"})`);
      }
    }

    setUploading(false);
    setUploadProgressText("");

    if (failedFiles.length === 0) {
      alert("모든 파일의 업로드가 완료되었습니다!");
      setIsUploadOpen(false);
      setUploadFiles([]);
      setFileAspectRatios({});
      setFileResolutions({});
      setUploadTitle("");
      setUploadTags("");
      setUploadMediaType("photo");
      setUploadGenerationType("real");
      setUploadCamera("");
      void fetchAssets();
    } else {
      alert(
        `업로드 완료: 성공 ${successCount}개 / 실패 ${failedFiles.length}개\n\n[실패 목록]\n` +
        failedFiles.join("\n")
      );
      const remainingFiles = uploadFiles.filter(f => failedFiles.some(ff => ff.startsWith(f.name)));
      setUploadFiles(remainingFiles);
      void fetchAssets();
    }
  };

  // Filter Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesType =
      selectedMediaType === "all" || asset.mediaType === selectedMediaType;

    const matchesQuery =
      searchQuery.trim() === "" ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      asset.uploader.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAspectRatio =
      selectedAspectRatio === "all" || asset.aspectRatio === selectedAspectRatio;

    return matchesType && matchesQuery && matchesAspectRatio;
  });

  const popularTags = ["자연", "배경", "바다", "하늘", "여행", "힐링", "음악", "감성", "우주", "비즈니스"];

  return (
    <div className="min-h-screen w-full bg-[#06080d] text-zinc-100 pb-20">
      
      {/* 픽사베이 스타일 히어로 배너 */}
      <section className="relative flex h-auto min-h-[260px] w-full flex-col items-center justify-center overflow-hidden border-b border-zinc-800 bg-[#080b12] py-10 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900/80 to-[#06080d]" />
        
        {/* 장식용 그리드 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
        
        {/* 라이브러리 홈으로 이동 버튼 (왼쪽 제일 위 절대 배치) */}
        <Link
          href="/studio/library"
          className="absolute left-6 top-6 z-20 group inline-flex items-center gap-1.5 rounded-none border border-zinc-800 bg-zinc-950/80 px-4 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition shadow-lg"
        >
          <ArrowLeft size={13} className="transition group-hover:-translate-x-0.5" />
          라이브러리 홈으로
        </Link>

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center space-y-4">
          <h1 className="text-3xl font-black md:text-5xl leading-tight tracking-tight text-white drop-shadow-md">
            크리에이박스 <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">무료 미디어</span> 라이브러리
          </h1>

          {/* 중앙 통합 검색 바 */}
          <div className="relative w-full max-w-2xl mt-3">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="무료 이미지, 비디오, 음악 등 키워드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-zinc-800/80 bg-zinc-950/80 py-4 pl-12 pr-6 text-sm text-white shadow-2xl backdrop-blur-md outline-none focus:border-blue-500/50"
            />
          </div>

          {/* 인기 태그 해시 */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-none border border-zinc-900 bg-zinc-900/40 px-3 py-1 text-xs font-bold text-zinc-400 hover:border-zinc-700 hover:text-white transition cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* 사진 비율 필터 */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-3 pt-3 border-t border-zinc-800/45 w-full max-w-xl">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2 select-none">비율 필터</span>
            {[
              { id: "all", label: "전체 비율" },
              { id: "16:9", label: "16:9 가로" },
              { id: "9:16", label: "9:16 세로" },
              { id: "4:3", label: "4:3 표준" },
              { id: "3:4", label: "3:4 세로" },
              { id: "1:1", label: "1:1 정방향" },
              { id: "기타", label: "기타 비율" },
            ].map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedAspectRatio(ratio.id)}
                className={`rounded-none px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  selectedAspectRatio === ratio.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "border border-zinc-900 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 바디 */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8 mt-10 space-y-8">
        
        {/* 미디어 유형 카테고리 탭 & 업로드 버튼 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5">
          <div className="flex flex-wrap gap-1 bg-zinc-950/40 border border-zinc-900 rounded-none p-1 shrink-0">
            {[
              { id: "all", label: "통합 에셋", icon: ImageIcon },
              { id: "photo", label: "사진", icon: ImageIcon },
              { id: "illustration", label: "일러스트", icon: Sparkles },
              { id: "video", label: "비디오", icon: Video },
              { id: "music", label: "음악/사운드", icon: Music },
              { id: "gif", label: "GIF", icon: ImageIcon },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedMediaType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedMediaType(tab.id);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setPlayingAudioId(null);
                    }
                  }}
                  className={`flex items-center gap-1.5 rounded-none px-4 py-2 text-xs font-black transition cursor-pointer ${
                    isActive
                      ? "bg-zinc-800 text-white shadow-md shadow-black/20"
                      : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                  }`}
                >
                  <TabIcon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleOpenUpload}
            className="flex items-center justify-center gap-2 rounded-none bg-blue-600 hover:bg-blue-500 transition px-5 py-2.5 text-xs font-black text-white shadow-lg cursor-pointer"
          >
            <UploadCloud size={16} />
            무료 에셋 나눔하기
          </button>
        </div>

        {/* 미디어 카드 에셋 그리드 */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-xs font-bold text-zinc-500">구글 드라이브로부터 무료 에셋 로딩 중...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-none border border-dashed border-zinc-800 bg-zinc-900/10 text-zinc-500">
            <ImageIcon size={42} className="mb-3 text-zinc-700" />
            <p className="text-sm font-black">검색 조건에 맞는 무료 에셋이 없습니다.</p>
            <p className="mt-1 text-xs text-zinc-600">첫 번째 기여자로 무료 나눔 파일 업로드를 해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => {
              const isAudio = asset.mediaType === "music";
              const isVideo = asset.mediaType === "video";
              const isPlaying = playingAudioId === asset.id;

              return (
                <div
                  key={asset.id}
                  onClick={() => openDetailModal(asset)}
                  className="group relative flex flex-col overflow-hidden rounded-none border border-zinc-800/60 bg-zinc-950/80 transition hover:-translate-y-1 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
                >
                  
                  {/* 카드 미디어 프리뷰 영역 */}
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-900/40">
                    {isAudio ? (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-950/50 to-slate-900 px-4">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                          <Music size={26} />
                          {isPlaying && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/10" />
                          )}
                        </div>
                        <p className="mt-3 text-center text-xs font-bold text-zinc-400 truncate w-full px-2">
                          {asset.title}
                        </p>
                        <button
                          onClick={(e) => toggleAudio(asset, e)}
                          className="mt-3 flex items-center justify-center gap-1 rounded-none bg-indigo-600 hover:bg-indigo-500 transition px-3 py-1 text-[11px] font-black text-white cursor-pointer"
                        >
                          {isPlaying ? (
                            <>
                              <Pause size={10} /> 정지
                            </>
                          ) : (
                            <>
                              <Play size={10} /> 미리듣기
                            </>
                          )}
                        </button>
                      </div>
                    ) : isVideo ? (
                      <div className="relative h-full w-full">
                        {/* Video Element for autoplay on hover */}
                        <video
                          src={asset.url}
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                          onMouseEnter={(e) => {
                            void e.currentTarget.play();
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                        <div className="absolute right-3 top-3 rounded-none bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
                          Video
                        </div>
                      </div>
                    ) : (
                      <img
                        src={asset.url}
                        alt={asset.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* 카드 호버 오버레이 (Pixabay style) */}
                    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-end items-center gap-1.5">
                        {asset.aspectRatio && (
                          <span className="rounded-none bg-blue-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                            {asset.aspectRatio}
                          </span>
                        )}
                        {asset.generationType === "ai" ? (
                          <span className="rounded-none bg-purple-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                            AI 제작
                          </span>
                        ) : (
                          <span className="rounded-none bg-emerald-600/90 text-white px-2 py-0.5 text-[9px] font-black tracking-wider shadow select-none">
                            실제 사진
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDownload(asset);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-none bg-zinc-950/80 text-zinc-300 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <Download size={14} />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <p className="truncate text-xs font-bold text-white leading-normal">
                          {asset.title}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 카드 하단 메타 명세 */}
                  <div className="flex items-center justify-between border-t border-zinc-900 bg-zinc-950/20 px-4 py-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-black text-zinc-300">
                        {asset.title}
                      </span>
                      <span className="mt-0.5 truncate text-[10px] font-bold text-zinc-600">
                        By {asset.uploader.split("@")[0]}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5 text-[10px] font-bold text-zinc-600">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {asset.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download size={12} /> {asset.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 1. 상세보기 상세 모달 (Detail View Modal) */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-none border border-zinc-800 bg-[#0c0f17] text-zinc-100">
            
            {/* 상단 닫기 단추 */}
            <button
              onClick={() => {
                setSelectedAsset(null);
                if (audioRef.current) {
                  audioRef.current.pause();
                  setPlayingAudioId(null);
                }
              }}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-none bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white transition hover:scale-105 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
              
              {/* 왼쪽: 미디어 크게보기 영역 */}
              <div className="flex flex-1 items-center justify-center bg-zinc-950 p-6 min-h-[300px] lg:min-h-0">
                {selectedAsset.mediaType === "music" ? (
                  <div className="flex flex-col items-center gap-6 max-w-sm w-full">
                    <div className="flex h-28 w-28 items-center justify-center rounded-none bg-indigo-500/10 text-indigo-400">
                      <Music size={52} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-black text-white">{selectedAsset.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{selectedAsset.name}</p>
                    </div>
                    <button
                      onClick={(e) => toggleAudio(selectedAsset, e)}
                      className="flex items-center gap-2 rounded-none bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      {playingAudioId === selectedAsset.id ? (
                        <>
                          <Pause size={16} /> 정지
                        </>
                      ) : (
                        <>
                          <Play size={16} /> 사운드 재생
                        </>
                      )}
                    </button>
                  </div>
                ) : selectedAsset.mediaType === "video" ? (
                  <video
                    src={selectedAsset.url}
                    controls
                    autoPlay
                    loop
                    className="max-h-full max-w-full rounded-none"
                  />
                ) : (
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.title}
                    className="max-h-full max-w-full rounded-none object-contain shadow-2xl"
                  />
                )}
              </div>

              {/* 오른쪽: 상세 상세 스펙 정보 패널 */}
              <div className="flex w-full flex-col border-t border-zinc-900 bg-zinc-900/20 p-6 lg:w-80 lg:border-l lg:border-t-0">
                <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                  <div>
                    <h2 className="text-lg font-black text-white leading-tight">
                      {selectedAsset.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-zinc-500 font-bold truncate">
                      {selectedAsset.name}
                    </p>
                  </div>

                  {/* 기여 업로더 */}
                  <div className="rounded-none border border-zinc-800 bg-zinc-950/40 p-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">나눔 기여자</p>
                    <p className="mt-1 text-sm font-black text-zinc-200">
                      {selectedAsset.uploader}
                    </p>
                  </div>

                  {/* 픽사베이 스타일 상단 인터랙션 단추바 (좋아요, 북마크, 공유) */}
                  <div className="relative flex items-center justify-between border border-zinc-800 bg-zinc-950/30 p-2 select-none">
                    <button
                      onClick={() => alert("좋아요가 반영되었습니다!")}
                      className="flex-1 flex flex-col items-center justify-center py-2 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <Heart size={18} className="mb-1" />
                      <span className="text-[10px] font-bold">좋아요</span>
                    </button>
                    <span className="w-px h-6 bg-zinc-900" />
                    <button
                      onClick={() => alert("에셋이 북마크에 보관되었습니다.")}
                      className="flex-1 flex flex-col items-center justify-center py-2 text-zinc-400 hover:text-blue-400 transition cursor-pointer"
                    >
                      <Tag size={18} className="mb-1" />
                      <span className="text-[10px] font-bold">저장</span>
                    </button>
                    <span className="w-px h-6 bg-zinc-900" />
                    <button
                      onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                      className="flex-1 flex flex-col items-center justify-center py-2 text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <Share2 size={18} className="mb-1" />
                      <span className="text-[10px] font-bold">공유</span>
                    </button>

                    {/* 소셜 공유 드롭다운 */}
                    {isShareDropdownOpen && (
                      <div ref={shareDropdownRef} className="absolute right-2 top-14 z-30 w-44 rounded-none border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                        <div className="text-[9px] font-black text-zinc-500 uppercase px-2 py-1 select-none border-b border-zinc-900 mb-1">
                          소셜 공유하기
                        </div>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(selectedAsset.title)}`, "_blank");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-none px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-yellow-400 rounded-none shrink-0" />
                          카카오톡 공유
                        </button>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-none px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-none shrink-0" />
                          페이스북 공유
                        </button>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(selectedAsset.title)}`, "_blank");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-none px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-zinc-400 rounded-none shrink-0" />
                          트위터 (X) 공유
                        </button>
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/studio/library/free-assets?id=${selectedAsset.id}`;
                            navigator.clipboard.writeText(shareUrl);
                            alert("공유 링크가 클립보드에 복사되었습니다!");
                            setIsShareDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-none px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 bg-emerald-600 rounded-none shrink-0" />
                          공유 링크 복사
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 픽사베이 스타일의 사이즈/포맷 조절 무료 다운로드 드롭다운 버튼 */}
                  <div className="relative">
                    <div className="flex w-full">
                      <button
                        onClick={() => {
                          if (selectedAsset.mediaType === "music" || selectedAsset.mediaType === "video") {
                            triggerDownload(selectedAsset);
                          } else {
                            setIsDownloadDropdownOpen(!isDownloadDropdownOpen);
                          }
                        }}
                        disabled={!!downloadingFormatText}
                        className="flex-1 flex items-center justify-center gap-2 rounded-none bg-emerald-600 hover:bg-emerald-500 transition py-3 text-xs font-black text-white shadow-lg cursor-pointer disabled:opacity-50"
                      >
                        {downloadingFormatText ? (
                          <>
                            <Loader2 className="animate-spin" size={14} /> {downloadingFormatText}
                          </>
                        ) : (
                          <>
                            <Download size={14} /> 무료 다운로드
                          </>
                        )}
                      </button>
                      {selectedAsset.mediaType !== "music" && selectedAsset.mediaType !== "video" && (
                        <button
                          onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                          className="px-3 border-l border-emerald-500 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none transition cursor-pointer"
                        >
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isDownloadDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    {isDownloadDropdownOpen && selectedAsset.mediaType !== "music" && selectedAsset.mediaType !== "video" && (
                      <div ref={downloadDropdownRef} className="absolute left-0 right-0 mt-2.5 z-30 rounded-none border border-zinc-800 bg-[#0a0d14] p-3.5 shadow-2xl space-y-3.5">
                        
                        {/* 포맷 선택 */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest select-none">다운로드 확장자</span>
                          <div className="flex gap-4 pt-1.5">
                            {(["jpeg", "png", "webp"] as const).map((fmt) => (
                              <label key={fmt} className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  name="downloadFormat"
                                  value={fmt}
                                  checked={downloadTargetFormat === fmt}
                                  onChange={() => setDownloadTargetFormat(fmt)}
                                  className="accent-emerald-500 rounded-none cursor-pointer"
                                />
                                {fmt.toUpperCase()}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 크기 조절 해상도 리스트 */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest select-none">크기 조절 (해상도)</span>
                          <div className="space-y-1 rounded-none border border-zinc-900 bg-zinc-950/40 p-1.5 max-h-48 overflow-y-auto">
                            {(() => {
                              const origW = selectedAsset.width || 1920;
                              const origH = selectedAsset.height || 1080;
                              const ratio = origH / origW;

                              const sizes = [
                                { label: "작은", w: 640, h: Math.round(640 * ratio) },
                                { label: "중간", w: 1280, h: Math.round(1280 * ratio) },
                                { label: "큰 파일", w: 1920, h: Math.round(1920 * ratio) },
                                { label: "원래의", w: origW, h: origH },
                              ];

                              return sizes.map((sz, idx) => (
                                <label
                                  key={idx}
                                  className="flex items-center justify-between rounded-none hover:bg-zinc-900/60 px-2 py-1.5 text-xs font-bold text-zinc-300 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 select-none">
                                    <input
                                      type="radio"
                                      name="selectedSize"
                                      value={idx}
                                      checked={selectedSizeIndex === idx}
                                      onChange={() => setSelectedSizeIndex(idx)}
                                      className="accent-emerald-500 rounded-none cursor-pointer"
                                    />
                                    <span>{sz.label}</span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{downloadTargetFormat.toUpperCase()}</span>
                                  </div>
                                  <span className="text-[10px] text-zinc-500 font-bold select-none">{sz.w} x {sz.h}</span>
                                </label>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* 다운로드 실행 단추 */}
                        <button
                          type="button"
                          onClick={() => {
                            const origW = selectedAsset.width || 1920;
                            const origH = selectedAsset.height || 1080;
                            const ratio = origH / origW;
                            const sizes = [
                              { w: 640, h: Math.round(640 * ratio) },
                              { w: 1280, h: Math.round(1280 * ratio) },
                              { w: 1920, h: Math.round(1920 * ratio) },
                              { w: origW, h: origH },
                            ];
                            const selectedSize = sizes[selectedSizeIndex];
                            void downloadResizedImage(
                              selectedAsset.url,
                              selectedAsset.name,
                              selectedSize.w,
                              selectedSize.h,
                              downloadTargetFormat
                            );
                            setIsDownloadDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 rounded-none bg-emerald-600 hover:bg-emerald-500 transition py-2 text-xs font-black text-white shadow-md cursor-pointer"
                        >
                          <Download size={13} /> 다운로드
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 🎨 이미지 편집 아코디언 (Canva Edit 연동) */}
                  {selectedAsset.mediaType !== "music" && selectedAsset.mediaType !== "video" && (
                    <div className="relative mt-2">
                      <button
                        onClick={() => setIsEditAccordionOpen(!isEditAccordionOpen)}
                        className="w-full flex items-center justify-center gap-2 rounded-none border border-zinc-800 bg-[#090d16]/30 hover:bg-[#121824]/40 py-3 text-xs font-black text-zinc-300 hover:text-white transition cursor-pointer animate-pulse"
                      >
                        <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black font-mono">C</span>
                        이미지 편집 {isEditAccordionOpen ? "▲" : "▼"}
                      </button>

                      {isEditAccordionOpen && (
                        <div className="absolute left-0 right-0 mt-1 z-30 rounded-none border border-zinc-800 bg-[#0c0f17] p-2 shadow-2xl space-y-1">
                          {[
                            { mode: "bg-removal", label: "배경 제거하기", desc: "배경을 깔끔하게 지우기" },
                            { mode: "adjust", label: "보정하기", desc: "필터 및 특수 효과 적용" },
                            { mode: "crop", label: "이미지 자르기", desc: "원하는 크기/비율로 절단" },
                            { mode: "color", label: "색상 조정하기", desc: "밝기, 대비, 채도 세밀 조절" },
                            { mode: "social", label: "소셜 미디어 게시물 만들기", desc: "인스타, 페이스북 규격 변환" },
                          ].map((item) => (
                            <button
                              key={item.mode}
                              onClick={() => {
                                const importUrl = encodeURIComponent(selectedAsset.url);
                                const title = encodeURIComponent(selectedAsset.title);
                                window.location.href = `/studio/image/workspace?imageUrl=${importUrl}&title=${title}&mode=${item.mode}`;
                              }}
                              className="flex w-full flex-col text-left rounded-none px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900/80 hover:text-white transition cursor-pointer"
                            >
                              <span className="font-black text-zinc-200">{item.label}</span>
                              <span className="text-[9px] text-zinc-500 font-bold mt-0.5">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 픽사베이 스타일 메타 상세 스펙 테이블 */}
                  <div className="border-t border-zinc-900 pt-5 space-y-3.5">
                    <button
                      type="button"
                      onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                      className="flex items-center justify-between w-full text-xs font-black text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <span className="uppercase tracking-widest">에셋 세부 사항</span>
                      <span className="text-[10px] font-bold">{isSpecsExpanded ? "세부 사항 숨기기 ▲" : "세부 사항 더보기 ▼"}</span>
                    </button>
                    
                    {isSpecsExpanded && (
                      <div className="space-y-3 pt-1.5 text-xs border-b border-zinc-900/40 pb-4">
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">조회수 (뷰)</span>
                          <span className="font-bold text-zinc-300">{selectedAsset.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">다운로드</span>
                          <span className="font-bold text-zinc-300">{selectedAsset.downloads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">카메라</span>
                          <span className="font-bold text-zinc-300 truncate max-w-[160px] text-right" title={selectedAsset.camera || "촬영 정보 없음"}>
                            {selectedAsset.camera || "촬영 정보 없음"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">미디어 종류</span>
                          <span className="font-bold text-zinc-300 uppercase">
                            {selectedAsset.mimeType ? selectedAsset.mimeType.split("/")[1] : selectedAsset.mediaType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">해상도</span>
                          <span className="font-bold text-zinc-300">
                            {selectedAsset.width && selectedAsset.height ? `${selectedAsset.width} x ${selectedAsset.height}` : "정보 없음"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">제작 방식</span>
                          <span className="font-bold text-zinc-300">
                            {selectedAsset.generationType === "ai" ? "AI 제작 에셋" : "실제 사진/촬영물"}
                          </span>
                        </div>
                        {selectedAsset.aspectRatio && (
                          <div className="flex justify-between">
                            <span className="font-bold text-zinc-500">사진 비율</span>
                            <span className="font-bold text-zinc-300">{selectedAsset.aspectRatio}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">파일 용량</span>
                          <span className="font-bold text-zinc-300">
                            {(selectedAsset.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-zinc-500">등록일</span>
                          <span className="font-bold text-zinc-300">
                            {new Date(selectedAsset.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>



                  {/* 관련 태그 */}
                  <div className="border-t border-zinc-900 pt-5 space-y-2">
                    <p className="text-xs font-black text-zinc-400">태그</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAsset.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchQuery(tag);
                            setSelectedAsset(null);
                            if (audioRef.current) audioRef.current.pause();
                          }}
                          className="rounded-none border border-zinc-800 bg-zinc-950/40 px-2 py-1 text-[11px] font-bold text-zinc-400 hover:border-zinc-700 hover:text-white transition cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-zinc-900 pt-4 text-center">
                  <p className="text-[10px] font-bold text-zinc-600 leading-normal">
                    본 자료는 CCL0(공공누리형) 라이선스로 배포되어 상업적 목적이라도 저작권자의 허락 없이 자유롭게 사용 가능합니다.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. 에셋 무료 업로드 나눔 신청 모달 */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-none border border-zinc-800 bg-[#0c0f17] text-zinc-100 p-6 shadow-2xl">
            
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <UploadCloud className="text-blue-400" size={18} />
                무료 미디어 에셋 나눔하기
              </h2>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadFiles([]);
                  setFileAspectRatios({});
                }}
                className="flex h-8 w-8 items-center justify-center rounded-none bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* 업로드 양식 */}
            <form onSubmit={handleUploadSubmit} className="mt-6 space-y-4">
              
              {/* 드래그 앤 드롭 파일 존 */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => uploadInputRef.current?.click()}
                className={`flex h-28 flex-col items-center justify-center rounded-none border-2 border-dashed transition cursor-pointer p-4 text-center ${
                  dragActive
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : uploadFiles.length > 0
                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300"
                    : "border-zinc-800 bg-zinc-950/20 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                <input
                  ref={uploadInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
                
                <UploadCloud className={uploadFiles.length > 0 ? "text-emerald-400 mb-1" : "text-zinc-600 mb-1"} size={26} />
                <p className="text-xs font-black text-zinc-400">나눔할 파일들을 드래그하여 놓거나 클릭하여 추가</p>
                <p className="text-[9px] text-zinc-600 mt-0.5 font-bold">이미지(PNG/JPG/WebP/GIF), 비디오(MP4), 사운드(MP3/WAV)</p>
              </div>

              {/* 선택된 파일 목록 (Premium Queue UI) */}
              {uploadFiles.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase select-none">
                    <span>업로드 대기 큐 ({uploadFiles.length}개 파일)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadFiles([]);
                        setFileAspectRatios({});
                        setUploadTitle("");
                      }}
                      className="text-red-400 hover:text-red-300 transition cursor-pointer"
                    >
                      전체 비우기
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto rounded-none border border-zinc-900 bg-zinc-950/40 p-2 space-y-1.5 custom-scrollbar">
                    {uploadFiles.map((file, idx) => {
                      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                      const aspect = fileAspectRatios[file.name];
                      return (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between rounded-none bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="shrink-0 text-[10px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-none select-none">
                              {idx + 1}
                            </span>
                            <span className="truncate font-medium text-zinc-200" title={file.name}>
                              {file.name}
                            </span>
                            {aspect && (
                              <span className="shrink-0 text-[9px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-none select-none">
                                {aspect}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-bold text-zinc-600 select-none">{sizeMB} MB</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadFile(idx);
                              }}
                              className="text-zinc-500 hover:text-white transition p-0.5 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 제목 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center select-none">
                  <label className="text-[11px] font-black text-zinc-500 uppercase">에셋 제목</label>
                  {uploadFiles.length > 1 && (
                    <span className="text-[10px] font-bold text-blue-400">다중 업로드 시 파일명이 자동으로 제목이 됩니다.</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={uploadFiles.length > 1 ? "각 파일의 파일명이 에셋 제목으로 저장됩니다." : "예: 조용하고 예쁜 제주도 모래사장"}
                  required={uploadFiles.length <= 1}
                  disabled={uploadFiles.length > 1}
                  value={uploadFiles.length > 1 ? "" : uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* 미디어 분류 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">미디어 분류</label>
                <select
                  value={uploadMediaType}
                  onChange={(e) => setUploadMediaType(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="photo">사진 (Photos)</option>
                  <option value="illustration">일러스트 (Illustrations)</option>
                  <option value="video">비디오 (Videos)</option>
                  <option value="music">음악 / 효과음 (Music & Audio)</option>
                  <option value="gif">움짤 (GIF)</option>
                </select>
              </div>

              {/* 태그 해시 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">태그 해시 태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="예: 제주도, 바다, 풍경, 하늘, 여름"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 제작 방식 */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase select-none">제작 방식</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="generationType"
                      value="real"
                      checked={uploadGenerationType === "real"}
                      onChange={() => setUploadGenerationType("real")}
                      className="accent-blue-500 rounded-none cursor-pointer"
                    />
                    실제 사진 / 촬영물
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="generationType"
                      value="ai"
                      checked={uploadGenerationType === "ai"}
                      onChange={() => setUploadGenerationType("ai")}
                      className="accent-blue-500 rounded-none cursor-pointer"
                    />
                    AI 제작 에셋
                  </label>
                </div>
              </div>

              {/* 카메라 정보 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">카메라 / 촬영 기기 정보 (선택)</label>
                <input
                  type="text"
                  placeholder="예: Sony A7R V, iPhone 15 Pro, 또는 미입력 시 '촬영 정보 없음'"
                  value={uploadCamera}
                  onChange={(e) => setUploadCamera(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 제출 */}
              <div className="flex gap-3 pt-3 border-t border-zinc-900 mt-5">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setIsUploadOpen(false);
                    setUploadFiles([]);
                    setFileAspectRatios({});
                    setUploadGenerationType("real");
                  }}
                  className="flex-1 rounded-none border border-zinc-800 bg-zinc-900 py-3 text-xs font-black text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={uploading || uploadFiles.length === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-none bg-blue-600 hover:bg-blue-500 transition py-3 text-xs font-black text-white shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> {uploadProgressText || "업로드 중..."}
                    </>
                  ) : (
                    <>
                      <UploadCloud size={14} /> 미디어 라이브러리 나눔 업로드
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 3. 에셋 수정 모달 */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-none border border-zinc-800 bg-[#0c0f17] text-zinc-100 p-6 shadow-2xl">
            
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="text-blue-400" size={18} />
                나눔 에셋 정보 수정
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-none bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* 수정 양식 */}
            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              
              {/* 제목 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">에셋 제목</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 미디어 분류 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">미디어 분류</label>
                <select
                  value={editMediaType}
                  onChange={(e) => setEditMediaType(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="photo">사진 (Photos)</option>
                  <option value="illustration">일러스트 (Illustrations)</option>
                  <option value="video">비디오 (Videos)</option>
                  <option value="music">음악 / 효과음 (Music & Audio)</option>
                  <option value="gif">움짤 (GIF)</option>
                </select>
              </div>

              {/* 사진 비율 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">사진 비율</label>
                <select
                  value={editAspectRatio}
                  onChange={(e) => setEditAspectRatio(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="">비율 없음 (또는 사운드)</option>
                  <option value="16:9">16:9 가로</option>
                  <option value="9:16">9:16 세로</option>
                  <option value="4:3">4:3 표준</option>
                  <option value="3:4">3:4 세로</option>
                  <option value="1:1">1:1 정방향</option>
                  <option value="기타">기타 비율</option>
                </select>
              </div>

              {/* 태그 해시 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">태그 해시 태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="예: 제주도, 바다, 풍경, 여름"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 제작 방식 */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase select-none">제작 방식</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="editGenerationType"
                      value="real"
                      checked={editGenerationType === "real"}
                      onChange={() => setEditGenerationType("real")}
                      className="accent-blue-500 rounded-none cursor-pointer"
                    />
                    실제 사진 / 촬영물
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="editGenerationType"
                      value="ai"
                      checked={editGenerationType === "ai"}
                      onChange={() => setEditGenerationType("ai")}
                      className="accent-blue-500 rounded-none cursor-pointer"
                    />
                    AI 제작 에셋
                  </label>
                </div>
              </div>

              {/* 카메라 정보 */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-500 uppercase">카메라 / 촬영 기기 정보 (선택)</label>
                <input
                  type="text"
                  placeholder="예: Sony A7R V, iPhone 15 Pro, 또는 미입력 시 '촬영 정보 없음'"
                  value={editCamera}
                  onChange={(e) => setEditCamera(e.target.value)}
                  className="w-full rounded-none border border-zinc-800 bg-zinc-950/50 py-2.5 px-4 text-xs text-white outline-none focus:border-blue-500/50"
                />
              </div>

              {/* 제출 */}
              <div className="flex gap-3 pt-3 border-t border-zinc-900 mt-5">
                <button
                  type="button"
                  disabled={updatingAsset}
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-none border border-zinc-800 bg-zinc-900 py-3 text-xs font-black text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={updatingAsset}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-none bg-blue-600 hover:bg-blue-500 transition py-3 text-xs font-black text-white shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {updatingAsset ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> 수정 중...
                    </>
                  ) : (
                    <>
                      저장하기
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
