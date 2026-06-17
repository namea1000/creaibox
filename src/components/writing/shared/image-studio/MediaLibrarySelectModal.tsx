"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Check, RefreshCw, Image as ImageIcon, ChevronDown } from "lucide-react";
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
}

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
  const [pageSize, setPageSize] = useState(24);
  const [submitting, setSubmitting] = useState(false);

  // 이미지 목록 가져오기
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id)
        .eq("source_type", "writing_creaibox_posts")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Failed to fetch library images for selection:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  // 검색 필터링
  const filteredImages = images.filter((img) => {
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

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setSubmitting(true);
    try {
      await onSelect(selectedImage);
      onClose();
    } catch (err) {
      console.error("Failed to set featured image:", err);
      alert("대표 이미지 설정 도중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0c0f17] text-zinc-100">
        
        {/* 모달 헤더 */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-6">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-400" />
            대표 이미지(썸네일) 설정
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* 필터 및 검색 바 */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-900 bg-zinc-950/20 px-6 py-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="이미지 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-[#07090e] py-1.5 pl-9 pr-4 text-xs text-white outline-none focus:border-blue-500/50"
            />
          </div>
          <span className="text-xs text-zinc-500">
            총 {filteredImages.length}개의 이미지 검색됨
          </span>
        </div>

        {/* 본문: 바둑판 리스트 */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-blue-500" />
            </div>
          ) : displayedImages.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-zinc-500">
              <ImageIcon size={32} className="mb-2 text-zinc-600" />
              <p className="text-xs font-black">표시할 이미지가 없습니다.</p>
              <p className="mt-1 text-[11px] text-zinc-600">원고 작성 시 저장된 이미지가 라이브러리에 노출됩니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {displayedImages.map((img) => {
                  const isSelected = selectedImage?.id === img.id;
                  return (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border transition-all ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-500/50"
                          : "border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={img.alt_text || img.title || "선택 이미지"}
                        className="h-full w-full object-cover transition duration-150 group-hover:opacity-90"
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

              {showLoadMore && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setPageSize((prev) => prev + 24)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-xs font-black text-zinc-300 hover:border-zinc-700 hover:text-white transition"
                  >
                    미디어 더 불러오기
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
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
