"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Trash2, Calendar, HardDrive, FileText, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
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

interface ImageDetailModalProps {
  image: GeneratedImageRow;
  onClose: () => void;
  onUpdate: (updatedImage: GeneratedImageRow) => void;
  onDelete: (imageId: string) => Promise<void>;
  imagesList?: GeneratedImageRow[];
  onSelectImage?: (image: GeneratedImageRow) => void;
}

export default function ImageDetailModal({
  image,
  onClose,
  onUpdate,
  onDelete,
  imagesList = [],
  onSelectImage,
}: ImageDetailModalProps) {
  const supabase = createClient();
  const [title, setTitle] = useState(image.title || "");
  const [altText, setAltText] = useState(image.alt_text || "");
  const [caption, setCaption] = useState(image.caption || "");
  const [description, setDescription] = useState(image.description || "");
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentIndex = imagesList.findIndex((img) => img.id === image.id);

  const handlePrev = () => {
    if (onSelectImage && currentIndex > 0) {
      onSelectImage(imagesList[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (onSelectImage && currentIndex < imagesList.length - 1) {
      onSelectImage(imagesList[currentIndex + 1]);
    }
  };

  // image가 변경될 때 로컬 상태 동기화
  useEffect(() => {
    setTitle(image.title || "");
    setAltText(image.alt_text || "");
    setCaption(image.caption || "");
    setDescription(image.description || "");
  }, [image]);

  // 키보드 탐색 및 닫기 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // 입력 영역에서 타이핑 중인 경우 방향키를 통한 이미지 전환 방지
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      if (isTyping) return;

      if (e.key === "ArrowLeft" || e.key === "Left") {
        handlePrev();
      } else if (e.key === "ArrowRight" || e.key === "Right") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, imagesList, onSelectImage, onClose]);

  const updateMetadata = async (fields: Partial<GeneratedImageRow>) => {
    setSaveStatus("saving");
    try {
      const { error } = await supabase
        .from("generated_images")
        .update(fields)
        .eq("id", image.id);

      if (error) throw error;

      setSaveStatus("saved");
      onUpdate({ ...image, ...fields });

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
    if (image[field] !== value) {
      updateMetadata({ [field]: value });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.image_url);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDeleteClick = async () => {
    if (!window.confirm("이 이미지를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 본문에서 이 이미지를 사용 중일 경우 엑박이 뜰 수 있습니다.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(image.id);
    } catch (err) {
      console.error(err);
      alert("이미지 삭제 실패");
      setIsDeleting(false);
    }
  };

  // 날짜 포맷
  const formattedDate = new Date(image.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0c0f17] text-zinc-100 md:flex-row">
        
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          title="닫기 (ESC)"
        >
          <X size={18} />
        </button>

        {/* 좌측: 이미지 뷰어 및 상단 네비게이션 */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-zinc-950 p-6 md:h-full">
          {/* 이미지 영역 상단 네비게이션 바 */}
          {imagesList.length > 1 && currentIndex !== -1 && (
            <div className="absolute top-4 left-4 right-16 flex items-center justify-between z-20">
              {/* 현재 인덱스 표시 */}
              <span className="text-[11px] font-black text-zinc-400 bg-zinc-900/85 px-3 py-1.5 rounded-xl border border-zinc-800/80 backdrop-blur-sm shadow-md">
                {currentIndex + 1} / {imagesList.length}
              </span>
              
              {/* 좌우 이동 버튼 */}
              <div className="flex items-center gap-1.5 bg-zinc-900/85 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-sm shadow-md">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition cursor-pointer disabled:cursor-not-allowed"
                  title="이전 이미지 (Left Arrow)"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="w-[1px] h-3 bg-zinc-800" />
                <button
                  onClick={handleNext}
                  disabled={currentIndex === imagesList.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition cursor-pointer disabled:cursor-not-allowed"
                  title="다음 이미지 (Right Arrow)"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* 이미지 뷰어 */}
          <div className="relative flex max-h-full items-center justify-center">
            <img
              src={(image.image_url.includes("drive.google.com") || image.image_url.includes("googleusercontent.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(image.image_url)}` : image.image_url}
              alt={altText || "미디어 미리보기"}
              className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>

        {/* 우측: 세부 정보 및 편집 폼 */}
        <div className="flex w-full flex-col border-t border-zinc-800 bg-[#0c0f17] p-6 md:w-[400px] md:border-l md:border-t-0 md:h-full overflow-y-auto">
          <div className="mb-6 mt-2">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">첨부 파일 세부 사항</h2>
            <div className="mt-4 space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-zinc-500" />
                <span>업로드 일자: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive size={14} className="text-zinc-500" />
                <span>저장 엔진: {image.provider || "upload"} ({image.style || "manual"})</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-zinc-500" />
                <span>연결 콘텐츠: {image.source_type ? `${image.source_type} (${image.source_id})` : "연결 없음"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ImageIcon size={14} className="text-zinc-500" />
                <span>역할군: {image.image_role || "gallery"}</span>
              </div>
            </div>
          </div>

          <hr className="border-zinc-800" />

          {/* 입력 필드 양식 */}
          <div className="mt-6 flex-1 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-400">대체 텍스트 (Alt Text)</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                onBlur={() => handleBlur("alt_text", altText)}
                placeholder="이미지를 설명하는 대체 텍스트를 입력하세요."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-400">제목 (Title)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleBlur("title", title)}
                placeholder="이미지 제목을 지정하세요."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-400">캡션 (Caption)</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onBlur={() => handleBlur("caption", caption)}
                placeholder="이미지 캡션을 적어주세요."
                rows={2}
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-400">설명 (Description)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur("description", description)}
                placeholder="상세한 설명을 작성하세요."
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* 하단 기능 제어 영역 */}
          <div className="mt-6 space-y-3">
            {/* 실시간 저장 피드백 */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">정보 수정 시 자동 저장됩니다.</span>
              {saveStatus === "saving" && <span className="text-amber-400">저장 중...</span>}
              {saveStatus === "saved" && <span className="text-emerald-400 font-bold">✓ 저장 완료</span>}
              {saveStatus === "error" && <span className="text-red-400 font-bold">⚠ 저장 실패</span>}
            </div>

            {/* URL 복사 버튼 */}
            <button
              onClick={handleCopyUrl}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-black transition-all ${
                isCopying
                  ? "border-emerald-800 bg-emerald-950/20 text-emerald-400"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {isCopying ? (
                <>
                  <Check size={14} /> 복사 완료!
                </>
              ) : (
                <>
                  <Copy size={14} /> 파일 URL 복사
                </>
              )}
            </button>

            {/* 영구 삭제 버튼 */}
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-950/30 bg-red-950/10 py-2.5 text-xs font-black text-red-400 transition hover:bg-red-950/30 hover:text-red-300 disabled:opacity-40"
            >
              <Trash2 size={14} />
              {isDeleting ? "삭제 중..." : "이미지 영구 삭제"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
