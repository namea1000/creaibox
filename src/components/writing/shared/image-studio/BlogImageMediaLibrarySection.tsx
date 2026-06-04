"use client";

import React, { useRef, useState } from "react";
import {
  ArrowDownToLine,
  Copy,
  Grid,
  RefreshCw,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { GeneratedImage } from "./blogImageTypes";
import { IMAGE_BUCKET } from "./blogImageConstants";
import { downloadImageFile, getStoragePathFromPublicUrl } from "./blogImageUtils";

interface BlogImageMediaLibrarySectionProps {
  gallery: GeneratedImage[];
  setGallery: React.Dispatch<React.SetStateAction<GeneratedImage[]>>;
  isGalleryLoading: boolean;
  isUploading: boolean;
  isDraggingUpload: boolean;
  setIsDraggingUpload: React.Dispatch<React.SetStateAction<boolean>>;
  handleUploadFiles: (fileList: FileList | File[]) => Promise<void>;
  resolveUserId: () => Promise<string | null>;
  sourceType: string;
  sourceId: string;
  imageRole: string;
  mode?: "thumbnail" | "content";
  className?: string;
  onInsertImage?: (image: GeneratedImage) => void;
}

export default function BlogImageMediaLibrarySection({
  gallery,
  setGallery,
  isGalleryLoading,
  isUploading,
  isDraggingUpload,
  setIsDraggingUpload,
  handleUploadFiles,
  resolveUserId,
  sourceType,
  sourceId,
  imageRole,
  mode = "thumbnail",
  className = "",
  onInsertImage,
}: BlogImageMediaLibrarySectionProps) {
  const supabase = createClient();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [openSaveMenuId, setOpenSaveMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSetPrimary = async (image: GeneratedImage) => {
    if (!sourceId) return;

    try {
      const userId = await resolveUserId();
      if (!userId) {
        alert("로그인 세션을 확인할 수 없습니다.");
        return;
      }

      const { error: clearError } = await supabase
        .from("generated_images")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .eq("source_type", sourceType)
        .eq("source_id", sourceId)
        .eq("image_role", imageRole);

      if (clearError) throw clearError;

      const { error: setError } = await supabase
        .from("generated_images")
        .update({ is_primary: true })
        .eq("user_id", userId)
        .eq("id", image.id);

      if (setError) throw setError;

      setGallery((prev) =>
        prev
          .map((item) => ({ ...item, isPrimary: item.id === image.id }))
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      );
    } catch (error) {
      console.error("대표 이미지 지정 실패:", error);
      alert("대표 이미지 지정에 실패했습니다.");
    }
  };

  const handleDeleteImage = async (image: GeneratedImage) => {
    const confirmed = window.confirm("이 이미지를 DB와 Storage에서 모두 삭제할까요?");
    if (!confirmed) return;

    setDeletingId(image.id);

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
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={`flex min-h-[520px] flex-col overflow-hidden ${className}`}>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/60 bg-slate-950/40 px-4">
        <h2 className="flex items-center gap-2 text-[13px] font-black text-zinc-300">
          <Grid size={16} className="text-blue-400" /> MEDIA LIBRARY
        </h2>

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void handleUploadFiles(event.target.files);
          }}
        />

        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[13px] font-black text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-60"
        >
          {isUploading ? <RefreshCw size={13} className="animate-spin" /> : <UploadCloud size={13} />}
          파일 첨부
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-5 custom-scrollbar"
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDraggingUpload(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingUpload(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDraggingUpload(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingUpload(false);
          void handleUploadFiles(event.dataTransfer.files);
        }}
      >
        {isGalleryLoading ? (
          <div className="flex h-full items-center justify-center text-[13px] font-bold text-zinc-500">
            저장 이미지 불러오는 중...
          </div>
        ) : gallery.length === 0 ? (
          <div
            className={`flex h-full min-h-[360px] flex-col items-center justify-center gap-3 border border-dashed text-center text-[13px] font-bold transition ${isDraggingUpload
                ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                : "border-zinc-800/80 text-zinc-500"
              }`}
          >
            <UploadCloud size={28} className={isDraggingUpload ? "text-emerald-300" : "text-zinc-600"} />
            <div>
              <p>저장된 이미지가 없습니다.</p>
              <p className="mt-1 text-zinc-600">PC 이미지 파일을 드래그하거나 파일 첨부로 업로드하세요.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,320px))] gap-5">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="group relative flex flex-col space-y-3 overflow-visible border border-zinc-800/80 bg-zinc-950 p-3 text-[13px]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden border border-zinc-900 bg-zinc-900">
                  <img
                    src={img.url}
                    alt="Asset"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {img.isPrimary && (
                      <span className="bg-amber-500/95 px-2 py-0.5 text-[13px] font-black text-zinc-950">
                        대표
                      </span>
                    )}
                    <span className="bg-blue-600/90 px-2 py-0.5 text-[13px] font-black text-white">
                      {img.type === "ai" ? "AI" : "STOCK"}
                    </span>
                    <span className="border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-[13px] font-black text-zinc-300">
                      {img.provider || "-"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[13px] font-bold leading-normal text-zinc-500">
                    {img.style}
                    {img.styleDetail ? ` / ${img.styleDetail}` : ""}
                  </p>
                  <p className="line-clamp-2 text-[13px] leading-normal text-zinc-400">
                    <span className="font-bold text-zinc-500">Prompt:</span> {img.prompt}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {mode === "content" ? (
                    <button
                      type="button"
                      onClick={() => onInsertImage?.(img)}
                      className="flex items-center justify-center gap-1.5 border border-blue-500/30 bg-blue-500/10 py-2 text-[13px] font-bold text-blue-300 transition hover:bg-blue-500/20"
                    >
                      삽입
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleSetPrimary(img)}
                      disabled={img.isPrimary}
                      className={`flex items-center justify-center gap-1.5 border py-2 text-[13px] font-bold transition ${img.isPrimary
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                        }`}
                    >
                      <Star size={13} />
                      대표
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(img.url);
                      alert("링크 복사됨!");
                    }}
                    className="flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-900 py-2 text-[13px] font-bold text-zinc-300 transition hover:bg-zinc-800"
                  >
                    <Copy size={13} />
                    링크
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenSaveMenuId((current) => (current === img.id ? null : img.id))}
                      className="flex w-full items-center justify-center gap-1.5 border border-zinc-700 bg-zinc-800 py-2 text-[13px] font-black text-emerald-400 transition hover:bg-zinc-700"
                    >
                      <ArrowDownToLine size={13} />
                      저장
                    </button>

                    {openSaveMenuId === img.id && (
                      <div className="absolute bottom-full right-0 z-30 mb-2 w-32 border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/40">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenSaveMenuId(null);
                            void downloadImageFile(img.url, img.id, "png");
                          }}
                          className="block w-full px-3 py-2 text-left text-[13px] font-bold text-zinc-200 transition hover:bg-zinc-800"
                        >
                          PNG
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenSaveMenuId(null);
                            void downloadImageFile(img.url, img.id, "webp");
                          }}
                          className="block w-full border-t border-zinc-800 px-3 py-2 text-left text-[13px] font-bold text-zinc-200 transition hover:bg-zinc-800"
                        >
                          WebP
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleDeleteImage(img)}
                    disabled={deletingId === img.id}
                    className="flex items-center justify-center gap-1.5 border border-rose-500/30 bg-rose-500/10 py-2 text-[13px] font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                  >
                    {deletingId === img.id ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}