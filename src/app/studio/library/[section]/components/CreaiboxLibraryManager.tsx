"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Grid, 
  Trash2, 
  RefreshCw, 
  Plus, 
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ImageDetailModal from "./ImageDetailModal";

const IMAGE_BUCKET = "generated-images";

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
}

function getStoragePathFromPublicUrl(url: string | null | undefined) {
  const value = url?.trim();
  if (!value) return null;

  const markers = [
    `/storage/v1/object/public/${IMAGE_BUCKET}/`,
    `/storage/v1/object/sign/${IMAGE_BUCKET}/`,
    `/object/public/${IMAGE_BUCKET}/`,
    `/object/sign/${IMAGE_BUCKET}/`,
  ];

  const marker = markers.find((item) => value.includes(item));
  if (!marker) return null;

  const rawPath = value.slice(value.indexOf(marker) + marker.length).split("?")[0];
  return decodeURIComponent(rawPath).replace(/^\/+/, "");
}

export default function CreaiboxLibraryManager() {
  const supabase = createClient();
  const [images, setImages] = useState<GeneratedImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<GeneratedImageRow | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState(24);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 이미지 데이터 가져오기
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id)
        .eq("source_type", "writing_creaibox_posts");

      if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      setImages(data || []);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, sortBy]);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  // 2. 드래그 앤 드롭 이벤트 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFiles(Array.from(e.target.files));
    }
  };

  // 3. 이미지 업로드 로직
  const uploadFiles = async (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setUploading(true);
    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sourceType", "writing_creaibox_posts");
        formData.append("imageRole", "gallery"); // 기본 본문 삽입용 gallery 역할 부여
        formData.append("title", file.name.replace(/\.[^/.]+$/, "")); // 확장자 제외 파일명

        const res = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "업로드 실패");

        // 업로드 성공한 파일 리스트에 추가
        setImages(prev => [result.image, ...prev]);
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(`업로드 중 오류 발생: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 4. 이미지 정보 실시간 갱신 핸들러 (모달 내 수정 시)
  const handleImageUpdate = (updatedImage: GeneratedImageRow) => {
    setImages(prev => prev.map(img => img.id === updatedImage.id ? updatedImage : img));
    if (selectedImage?.id === updatedImage.id) {
      setSelectedImage(updatedImage);
    }
  };

  // 5. 이미지 삭제 핸들러 (스토리지 + DB 동시 삭제)
  const handleImageDelete = async (imageId: string) => {
    const targetImage = images.find(img => img.id === imageId);
    if (!targetImage) return;

    try {
      // 1. Storage에서 삭제
      const storagePath = getStoragePathFromPublicUrl(targetImage.image_url);
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from(IMAGE_BUCKET)
          .remove([storagePath]);

        if (storageError) {
          console.warn("Storage removal failed, continuing with DB removal:", storageError);
        }
      }

      // 2. DB 레코드 삭제
      const { error: dbError } = await supabase
        .from("generated_images")
        .delete()
        .eq("id", imageId);

      if (dbError) throw dbError;

      // 3. 상태 리셋 및 모달 닫기
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImage(null);
    } catch (err: any) {
      console.error("Deletion failed:", err);
      throw err;
    }
  };

  // 6. 검색 및 역할 필터링 적용
  const filteredImages = images.filter(img => {
    // 역할군 필터링
    if (roleFilter !== "all" && img.image_role !== roleFilter) {
      return false;
    }

    // 키워드 검색 (제목, 대체 텍스트, 설명, 프롬프트 검색)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = img.title?.toLowerCase().includes(query) ?? false;
      const matchAlt = img.alt_text?.toLowerCase().includes(query) ?? false;
      const matchDesc = img.description?.toLowerCase().includes(query) ?? false;
      const matchPrompt = img.prompt?.toLowerCase().includes(query) ?? false;
      return matchTitle || matchAlt || matchDesc || matchPrompt;
    }

    return true;
  });

  const displayedImages = filteredImages.slice(0, pageSize);
  const showLoadMore = filteredImages.length > pageSize;

  return (
    <div className="min-h-full w-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* 상단 헤더 영역 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-violet-400">
              <ImageIcon size={14} />
              Creaibox Media Library
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              크리에이박스 미디어 라이브러리
            </h1>
            <p className="mt-1 text-xs font-medium text-zinc-500">
              글쓰기 에디터 및 첨부파일로 등록된 이미지 자산을 통합 관리하고 재사용합니다.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-black text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {uploading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              {uploading ? "업로드 중..." : "미디어 파일 추가"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* 파일 업로드 드롭존 */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
            dragActive
              ? "border-blue-500 bg-blue-500/5 text-blue-400"
              : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-400"
          }`}
        >
          <Upload size={24} className="mb-2 transition group-hover:scale-105" />
          <p className="text-xs font-black">이미지 파일을 여기에 끌어다 놓거나 클릭하여 선택하세요.</p>
          <p className="mt-1 text-[10px] text-zinc-600">지원 파일: PNG, JPG, WebP, GIF</p>
        </div>

        {/* 검색 & 필터 헤더 */}
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="이미지 제목, 대체 텍스트, 설명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-[#0c0e14] py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* 역할 필터 */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-500">역할군:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-[#0c0e14] px-2.5 py-1.5 outline-none focus:border-blue-500/50"
              >
                <option value="all">전체 역할군</option>
                <option value="gallery">gallery (본문)</option>
                <option value="thumbnail">thumbnail (썸네일)</option>
                <option value="hero">hero (대형 배너)</option>
                <option value="generated">generated (생성 원본)</option>
              </select>
            </div>

            {/* 정렬 방식 */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-500">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-zinc-800 bg-[#0c0e14] px-2.5 py-1.5 outline-none focus:border-blue-500/50"
              >
                <option value="newest">최신 업로드순</option>
                <option value="oldest">오래된 업로드순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 바둑판 이미지 그리드 목록 */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-blue-500" />
          </div>
        ) : displayedImages.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/10 text-zinc-500">
            <ImageIcon size={32} className="mb-2 text-zinc-600" />
            <p className="text-xs font-black">라이브러리에 이미지가 없습니다.</p>
            <p className="mt-1 text-[11px] text-zinc-600">위 드롭존에 첫 이미지를 첨부하여 업로드해 보세요.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {displayedImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition-all hover:scale-[1.02] hover:border-zinc-700 hover:shadow-xl"
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.title || "미디어"}
                    className="h-full w-full object-cover transition duration-300 group-hover:opacity-85"
                  />
                  {/* 호버 정보 레이어 */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                    <p className="truncate text-[11px] font-black text-white">
                      {img.title || "제목 없음"}
                    </p>
                    <p className="mt-0.5 truncate text-[9px] text-zinc-400 font-bold">
                      {img.image_role || "gallery"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 더 보기 버튼 */}
            {showLoadMore && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setPageSize(prev => prev + 24)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-5 text-xs font-black text-zinc-300 hover:border-zinc-700 hover:text-white transition"
                >
                  더 많은 미디어 보기
                  <ChevronDown size={14} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 이미지 상세 정보 모달 */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onUpdate={handleImageUpdate}
          onDelete={handleImageDelete}
        />
      )}
    </div>
  );
}
