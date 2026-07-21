"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Link as LinkIcon,
  Crop as CropIcon,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Trash2,
  Check,
  X,
  Type,
  Heading
} from "lucide-react";
import MediaLibrarySelectModal from "@/components/writing/shared/image-studio/MediaLibrarySelectModal";
import { createClient } from "@/utils/supabase/client";

export default function ImageNodeView(props: NodeViewProps) {
  const { node, updateAttributes, selected, editor, getPos, deleteNode } = props;
  const { src, alt, title, width, alignment, href, caption, description } = node.attrs;

  // Strict check to ensure this is a NodeSelection (directly clicked image) and not a drag TextSelection
  const isNodeSelected = selected && editor.state.selection instanceof NodeSelection;

  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState(href || "");
  const [isSettingFeatured, setIsSettingFeatured] = useState(false);
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const [altText, setAltText] = useState(alt || "");
  const [titleText, setTitleText] = useState(title || "");
  const [descriptionText, setDescriptionText] = useState(description || "");
  const [captionText, setCaptionText] = useState(caption || "");
  const [showAltInput, setShowAltInput] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [cropAspectRatio, setCropAspectRatio] = useState<"free" | "1:1" | "16:9" | "4:3">("free");
  const [isUploadingCrop, setIsUploadingCrop] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Resize states
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [resizeStartMouseX, setResizeStartMouseX] = useState(0);

  // Caption Debouncing Timer
  const captionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (captionDebounceRef.current) {
        clearTimeout(captionDebounceRef.current);
      }
    };
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update linkUrl if href changes externally
  useEffect(() => {
    setLinkUrl(href || "");
  }, [href]);

  // Update altText if alt changes
  useEffect(() => {
    setAltText(alt || "");
  }, [alt]);

  // Update titleText if title changes
  useEffect(() => {
    setTitleText(title || "");
  }, [title]);

  // Update descriptionText if description changes
  useEffect(() => {
    setDescriptionText(description || "");
  }, [description]);

  // Update captionText if caption changes
  useEffect(() => {
    setCaptionText(caption || "");
  }, [caption]);

  // Initial crop box setup when crop mode is entered
  useEffect(() => {
    if (isCropping && imgRef.current) {
      const w = imgRef.current.clientWidth;
      const h = imgRef.current.clientHeight;
      // Start crop box with 10% padding
      setCropBox({
        x: w * 0.1,
        y: h * 0.1,
        w: w * 0.8,
        h: h * 0.8
      });
    }
  }, [isCropping]);

  // Reorder up/down helper
  const moveNode = useCallback((direction: "up" | "down") => {
    try {
      const pos = getPos();
      if (typeof pos !== "number") return;
      const $pos = editor.state.doc.resolve(pos);
      const index = $pos.index();
      const parent = $pos.parent;

      if (direction === "up") {
        if (index === 0) return;
        const prevNode = parent.child(index - 1);
        const prevNodeSize = prevNode.nodeSize;
        const startPos = pos - prevNodeSize;

        editor.view.dispatch(
          editor.state.tr
            .delete(startPos, pos + node.nodeSize)
            .insert(startPos, node)
            .insert(startPos + node.nodeSize, prevNode)
        );
      } else {
        if (index >= parent.childCount - 1) return;
        const nextNode = parent.child(index + 1);
        const nextNodeSize = nextNode.nodeSize;

        editor.view.dispatch(
          editor.state.tr
            .delete(pos, pos + node.nodeSize + nextNodeSize)
            .insert(pos, nextNode)
            .insert(pos + nextNodeSize, node)
        );
      }
    } catch (err) {
      console.error("Failed to move image node:", err);
    }
  }, [editor, getPos, node]);

  // (Using props.deleteNode directly from Tiptap ReactNodeViewRenderer to avoid React-ProseMirror offset mismatch bugs)

  const handleSetAsFeatured = useCallback(async () => {
    const setAsFeatured = props.extension.options.setAsFeatured;
    if (!setAsFeatured) {
      alert("대표 이미지 지정 기능이 활성화되지 않았습니다.");
      return;
    }
    setIsSettingFeatured(true);
    try {
      await setAsFeatured(src);
      alert("대표 이미지로 지정되었습니다.");
    } catch (err: any) {
      console.error("대표 이미지 지정 처리 중 오류:", {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
        err
      });
      alert(`대표 이미지 지정 중 오류가 발생했습니다: ${err.message || String(err)}`);
    } finally {
      setIsSettingFeatured(false);
    }
  }, [props.extension.options.setAsFeatured, src]);

  // Image Resize Drag handler
  const handleResizeStart = (e: React.MouseEvent, direction: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();

    if (!imgRef.current || !containerRef.current) return;
    const parentWidth = containerRef.current.parentElement?.clientWidth || 800;

    setIsResizing(true);
    setResizeStartWidth(imgRef.current.clientWidth);
    setResizeStartMouseX(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - e.clientX;
      const newWidthPx = direction === "right" 
        ? imgRef.current!.clientWidth + deltaX 
        : imgRef.current!.clientWidth - deltaX;

      const newPercent = Math.max(15, Math.min(100, Math.round((newWidthPx / parentWidth) * 100)));
      updateAttributes({ width: `${newPercent}%` });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Crop Drag Handler (for corners and inner crop box)
  const handleCropDragStart = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startBox = { ...cropBox };
    const imgEl = imgRef.current;
    if (!imgEl) return;
    const imgWidth = imgEl.clientWidth;
    const imgHeight = imgEl.clientHeight;

    const handlePointerMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let newBox = { ...startBox };

      if (handle === "box") {
        newBox.x = Math.max(0, Math.min(imgWidth - startBox.w, startBox.x + dx));
        newBox.y = Math.max(0, Math.min(imgHeight - startBox.h, startBox.y + dy));
      } else {
        // Handle resizing from corner nodes
        if (handle.includes("w")) {
          const newX = Math.max(0, Math.min(startBox.x + startBox.w - 30, startBox.x + dx));
          newBox.w = startBox.x + startBox.w - newX;
          newBox.x = newX;
        }
        if (handle.includes("e")) {
          newBox.w = Math.max(30, Math.min(imgWidth - startBox.x, startBox.w + dx));
        }
        if (handle.includes("n")) {
          const newY = Math.max(0, Math.min(startBox.y + startBox.h - 30, startBox.y + dy));
          newBox.h = startBox.y + startBox.h - newY;
          newBox.y = newY;
        }
        if (handle.includes("s")) {
          newBox.h = Math.max(30, Math.min(imgHeight - startBox.y, startBox.h + dy));
        }

        // Apply aspect ratio constraint if locked
        if (cropAspectRatio !== "free") {
          const ratioVal = 
            cropAspectRatio === "1:1" ? 1 : 
            cropAspectRatio === "16:9" ? 16 / 9 : 4 / 3;

          if (handle === "se" || handle === "sw" || handle === "ne" || handle === "nw") {
            // Adjust height to match aspect ratio based on width
            newBox.h = newBox.w / ratioVal;
            // If it exceeds container height, clamp and recalculate width
            if (newBox.y + newBox.h > imgHeight) {
              newBox.h = imgHeight - newBox.y;
              newBox.w = newBox.h * ratioVal;
            }
          }
        }
      }
      setCropBox(newBox);
    };

    const handlePointerUp = () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  };

  // Perform Crop (Canvas generation and upload)
  const applyCrop = async () => {
    if (!imgRef.current) return;
    setIsUploadingCrop(true);

    try {
      const imgEl = imgRef.current;
      const naturalW = imgEl.naturalWidth;
      const naturalH = imgEl.naturalHeight;
      const clientW = imgEl.clientWidth;
      const clientH = imgEl.clientHeight;

      const scaleX = naturalW / clientW;
      const scaleY = naturalH / clientH;

      const cropX = cropBox.x * scaleX;
      const cropY = cropBox.y * scaleY;
      const cropW = cropBox.w * scaleX;
      const cropH = cropBox.h * scaleY;

      // Draw onto canvas
      const canvas = document.createElement("canvas");
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // Load original image to prevent cross-origin issues or draw from memory
      const imageObj = new Image();
      imageObj.crossOrigin = "anonymous";
      
      // Wait for image load
      await new Promise<void>((resolve, reject) => {
        imageObj.onload = () => resolve();
        imageObj.onerror = () => reject(new Error("Failed to load image for cropping"));
        imageObj.src = src;
      });

      ctx.drawImage(imageObj, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      // Convert canvas to Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.92);
      });

      if (!blob) throw new Error("Could not export cropped image");

      const file = new File([blob], `cropped_${Date.now()}.webp`, { type: "image/webp" });

      // Trigger upload option
      const uploadImage = props.extension.options.uploadImage;
      if (!uploadImage) {
        alert("이미지 업로드 콜백이 설정되지 않았습니다.");
        setIsUploadingCrop(false);
        return;
      }

      const uploadResult = await uploadImage(file);
      if (uploadResult && uploadResult.url) {
        updateAttributes({
          src: uploadResult.url,
          width: "100%", // reset width to full on crop
        });
        setIsCropping(false);
      } else {
        alert("이미지 업로드에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error cropping image:", err);
      alert(`자르기 처리 중 오류 발생: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsUploadingCrop(false);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAttributes({ href: linkUrl.trim() || null });
    setIsEditingLink(false);
  };

  const handleAltSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Tiptap 에디터 속성 업데이트 (alt, title, description)
    updateAttributes({
      alt: altText.trim() || null,
      title: titleText.trim() || null,
      description: descriptionText.trim() || null,
    });
    
    setIsEditingAlt(false);
    setShowAltInput(false);

    // 2. 데이터베이스(Supabase) 실시간 싱크 갱신 (src 주소 기반 매칭)
    if (src) {
      try {
        const supabaseClient = createClient();
        
        // 2-1. generated_images 테이블 업데이트 시도
        const { error: genErr } = await supabaseClient
          .from("generated_images")
          .update({
            alt_text: altText.trim() || null,
            title: titleText.trim() || null,
            description: descriptionText.trim() || null,
          })
          .eq("image_url", src);

        if (genErr) {
          // 2-2. 실패하거나 해당 URL이 free_assets일 경우 free_assets 테이블도 시도
          const { error: freeErr } = await supabaseClient
            .from("free_assets")
            .update({
              title: titleText.trim() || null,
            })
            .eq("url", src);
          
          if (freeErr) {
            console.error("Failed to sync updated metadata to free_assets:", freeErr);
          }
        }
      } catch (err) {
        console.error("Failed to sync metadata to DB:", err);
      }
    }
  };

  // Alignments handler
  const setAlignment = (align: string) => {
    updateAttributes({ alignment: align });
  };

  // Caption input change with debouncing to prevent save-loss before blur
  const handleCaptionChange = (val: string) => {
    setCaptionText(val);

    if (captionDebounceRef.current) {
      clearTimeout(captionDebounceRef.current);
    }

    captionDebounceRef.current = setTimeout(() => {
      updateAttributes({ caption: val.trim() });
    }, 250); // Fast sync in 250ms to ensure DB save catch
  };

  return (
    <NodeViewWrapper
      ref={containerRef}
      contentEditable={false}
      className={`image-node-wrapper group relative my-2 inline-block w-full text-center transition-all ${
        alignment === "left" ? "float-left mr-6 max-w-[50%]" : ""
      } ${alignment === "right" ? "float-right ml-6 max-w-[50%]" : ""} ${
        alignment === "wide" ? "max-w-4xl" : ""
      } ${alignment === "full" ? "w-screen max-w-none relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" : ""}`}
    >
      <div 
        className="relative inline-block overflow-visible group"
        style={{ width: alignment === "full" ? "100vw" : width && width !== "100%" ? width : "100%", maxWidth: "100%" }}
      >
        {/* Selection blue outline */}
        <div
          className={`relative overflow-hidden transition-all duration-200 ${
            isNodeSelected && !isCropping
              ? "ring-4 ring-blue-500 rounded-none shadow-lg shadow-blue-500/10"
              : "rounded-none"
          }`}
        >
          {/* Main Image */}
          <img
            ref={imgRef}
            src={(src && (src.includes("googleusercontent.com") || src.includes("drive.google.com")))
              ? `/api/free-assets/proxy?url=${encodeURIComponent(src)}`
              : src}
            alt={alt || ""}
            title={title || ""}
            onDragStart={(e) => e.preventDefault()}
            className="mx-auto block h-auto max-w-full select-none rounded-none border border-zinc-200 dark:border-zinc-800 shadow-sm"
            style={{ width: width && width !== "100%" ? width : "100%", maxWidth: "100%" }}
          />

          {/* Semi-transparent Overlay for crop mode */}
          {isCropping && (
            <div className="absolute inset-0 bg-black/60 z-10 overflow-hidden">
              {/* Highlight Crop Box Cutout using border shadow trick */}
              <div
                className="absolute border-2 border-blue-500 cursor-move"
                style={{
                  left: `${cropBox.x}px`,
                  top: `${cropBox.y}px`,
                  width: `${cropBox.w}px`,
                  height: `${cropBox.h}px`,
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
                }}
                onMouseDown={(e) => handleCropDragStart(e, "box")}
              >
                {/* Crop corner handles */}
                <div
                  className="absolute -top-2 -left-2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 cursor-nwse-resize"
                  onMouseDown={(e) => handleCropDragStart(e, "nw")}
                />
                <div
                  className="absolute -top-2 -right-2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 cursor-nesw-resize"
                  onMouseDown={(e) => handleCropDragStart(e, "ne")}
                />
                <div
                  className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 cursor-nesw-resize"
                  onMouseDown={(e) => handleCropDragStart(e, "sw")}
                />
                <div
                  className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 cursor-nwse-resize"
                  onMouseDown={(e) => handleCropDragStart(e, "se")}
                />
              </div>
            </div>
          )}
        </div>

        {/* Resize Handles (Only when selected and not cropping) */}
        {isNodeSelected && !isCropping && (
          <>
            <div
              className="absolute top-1/2 left-0 z-20 flex h-8 w-2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-r bg-blue-500 hover:bg-blue-400 active:bg-blue-600 transition"
              onMouseDown={(e) => handleResizeStart(e, "left")}
            />
            <div
              className="absolute top-1/2 right-0 z-20 flex h-8 w-2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-l bg-blue-500 hover:bg-blue-400 active:bg-blue-600 transition"
              onMouseDown={(e) => handleResizeStart(e, "right")}
            />
          </>
        )}

        {/* --- FLOATING TOOLBAR --- */}
        {isNodeSelected && (
          <div 
            className={`absolute left-1/2 top-0 z-40 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-zinc-800 bg-[#0e111a]/95 px-3 py-1.5 shadow-2xl backdrop-blur-md transition-all whitespace-nowrap ${
              showAltInput || isEditingLink
                ? "translate-y-[15px]" 
                : "-translate-y-[115%]"
            }`}
          >
            
            {/* Standard Options Mode */}
            {!isCropping && !isEditingLink && !showAltInput ? (
              <>
                {/* Alignment Group */}
                <button
                  onClick={() => setAlignment("left")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                    alignment === "left" ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                  }`}
                  title="왼쪽 정렬"
                >
                  <AlignLeft size={15} />
                </button>
                <button
                  onClick={() => setAlignment("center")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                    alignment === "center" || !alignment ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                  }`}
                  title="중앙 정렬"
                >
                  <AlignCenter size={15} />
                </button>
                <button
                  onClick={() => setAlignment("right")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                    alignment === "right" ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                  }`}
                  title="우측 정렬"
                >
                  <AlignRight size={15} />
                </button>
                <button
                  onClick={() => setAlignment("wide")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                    alignment === "wide" ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                  }`}
                  title="넓은 폭"
                >
                  <Maximize2 size={14} />
                </button>
                <button
                  onClick={() => setAlignment("full")}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                    alignment === "full" ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                  }`}
                  title="전체 폭"
                >
                  <Maximize2 size={16} className="rotate-45" />
                </button>

                <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                {/* Hyperlink Button */}
                <button
                  onClick={() => {
                    setLinkUrl(href || "");
                    setIsEditingLink(true);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                    href ? "bg-blue-900/50 text-blue-400 border border-blue-500/30" : ""
                  }`}
                  title="하이퍼링크 삽입/수정"
                >
                  <LinkIcon size={14} />
                </button>

                {/* Crop Button */}
                <button
                  onClick={() => setIsCropping(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition"
                  title="자르기"
                >
                  <CropIcon size={14} />
                </button>

                {/* Replace (교체) Button */}
                <button
                  onClick={() => setIsReplaceModalOpen(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition"
                  title="이미지 교체"
                >
                  <RefreshCw size={14} />
                </button>

                <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                {/* Move Up/Down */}
                <button
                  onClick={() => moveNode("up")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition"
                  title="위로 이동"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveNode("down")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition"
                  title="아래로 이동"
                >
                  <ArrowDown size={14} />
                </button>

                {props.extension.options.setAsFeatured && (
                  <>
                    <button
                      onClick={handleSetAsFeatured}
                      disabled={isSettingFeatured}
                      className="flex h-8 items-center justify-center rounded-lg px-2.5 text-xs font-bold text-blue-400 hover:bg-zinc-800/80 hover:text-blue-300 disabled:opacity-50 transition whitespace-nowrap flex-shrink-0"
                      title="이 이미지를 대표 이미지(썸네일)로 지정"
                    >
                      {isSettingFeatured ? "지정 중..." : "대표 이미지 지정"}
                    </button>
                    <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
                  </>
                )}

                {/* 대체 텍스트 수정 바로 가기 단추 꺼내기 */}
                <button
                  onClick={() => {
                    setIsEditingAlt(true);
                    setShowAltInput(true);
                  }}
                  className="flex h-8 items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition cursor-pointer whitespace-nowrap flex-shrink-0"
                  title="대체 텍스트 / 제목 / 설명 수정"
                >
                  <Type size={13} className="text-zinc-500" />
                  대체 텍스트 수정
                </button>
                <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                {/* Three Dots Menu trigger */}
                <div className="relative" ref={moreMenuRef}>
                  <button
                    onClick={() => setShowMoreMenu((prev) => !prev)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition ${
                      showMoreMenu ? "bg-zinc-800 text-white" : ""
                    }`}
                  >
                    <MoreVertical size={14} />
                  </button>

                  {/* Dropdown Options */}
                  {showMoreMenu && (
                    <div className="absolute right-0 top-[110%] z-50 flex w-40 flex-col rounded-xl border border-zinc-800 bg-[#0e111a] p-1 shadow-2xl">
                      <button
                        onClick={() => {
                          setShowMoreMenu(false);
                          deleteNode();
                        }}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-950/30 hover:text-red-300 transition"
                      >
                        <Trash2 size={13} className="text-red-500" />
                        이미지 삭제
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : isEditingLink ? (
              /* --- Hyperlink Edit Input Mode --- */
              <form onSubmit={handleLinkSubmit} className="flex items-center gap-1.5 p-0.5">
                <input
                  type="url"
                  placeholder="연결할 URL 입력..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-48 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-white outline-none focus:border-blue-500/50"
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-500"
                >
                  <Check size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingLink(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >
                  <X size={13} />
                </button>
              </form>
            ) : showAltInput ? (
              /* --- Alt text / Title / Description Edit Mode --- */
              <form onSubmit={handleAltSubmit} className="flex flex-col gap-3.5 p-4 w-[340px] max-w-[calc(100vw-32px)] bg-zinc-900 border-2 border-zinc-700 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-2 ring-blue-500/10 box-border text-left">
                <div className="flex items-center justify-between border-b border-zinc-700/60 pb-2.5 mb-1.5 box-border">
                  <span className="text-[11px] font-black text-zinc-300">이미지 메타 정보 수정</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="submit"
                      className="flex h-6.5 px-3 items-center justify-center rounded bg-blue-600 text-[10px] font-black text-white hover:bg-blue-500 transition cursor-pointer whitespace-nowrap"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingAlt(false);
                        setShowAltInput(false);
                      }}
                      className="flex h-6.5 px-3 items-center justify-center rounded bg-zinc-800 text-[10px] font-black text-zinc-400 hover:bg-zinc-700 hover:text-white transition cursor-pointer"
                    >
                      취소
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 w-full box-border">
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wide text-left">대체 텍스트 (Alt Text)</label>
                  <input
                    type="text"
                    placeholder="대체 텍스트(alt) 입력..."
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full box-border rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col items-start gap-1 w-full box-border">
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wide text-left">제목 (Title)</label>
                  <input
                    type="text"
                    placeholder="이미지 제목(title) 입력..."
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="w-full box-border rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>

                <div className="flex flex-col items-start gap-1 w-full box-border">
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-wide text-left">설명 (Description)</label>
                  <textarea
                    placeholder="설명(description) 입력..."
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    rows={2}
                    className="w-full box-border resize-none rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>
              </form>
            ) : isCropping ? (
              /* --- Crop Toolbar Mode --- */
              <div className="flex items-center gap-1.5 p-0.5">
                <span className="text-[11px] font-black text-zinc-500 px-1">비율:</span>
                {(["free", "1:1", "16:9", "4:3"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setCropAspectRatio(ratio)}
                    className={`rounded-md px-2 py-1 text-[10px] font-black uppercase transition ${
                      cropAspectRatio === ratio
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {ratio === "free" ? "자유" : ratio}
                  </button>
                ))}
                <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
                <button
                  onClick={applyCrop}
                  disabled={isUploadingCrop}
                  className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-black text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  <Check size={12} className="stroke-[3px]" />
                  {isUploadingCrop ? "자르는 중..." : "자르기 완료"}
                </button>
                <button
                  onClick={() => setIsCropping(false)}
                  disabled={isUploadingCrop}
                  className="flex items-center gap-1 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-black text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                >
                  <X size={12} />
                  취소
                </button>
              </div>
            ) : null}
            
          </div>
        )}
      </div>

      {/* --- figcaption CAPTION EDITOR --- */}
      <div className="mt-2 w-full text-center">
        {(isNodeSelected || caption) ? (
          <input
            type="text"
            value={captionText}
            placeholder="캡션 추가..."
            onChange={(e) => handleCaptionChange(e.target.value)}
            onBlur={() => {
              if (captionDebounceRef.current) clearTimeout(captionDebounceRef.current);
              updateAttributes({ caption: captionText.trim() });
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="mx-auto block w-full max-w-[80%] text-center text-xs text-zinc-950 font-bold bg-transparent border-none outline-none focus:text-black transition-colors placeholder:text-zinc-500 cursor-text"
          />
        ) : null}
      </div>

      {/* Replace modal popup */}
      {isReplaceModalOpen && (
        <MediaLibrarySelectModal
          onClose={() => setIsReplaceModalOpen(false)}
          onSelect={async (selectedImage) => {
            updateAttributes({
              src: selectedImage.image_url,
              alt: selectedImage.alt_text || selectedImage.title || "",
              title: selectedImage.title || "",
            });
            setIsReplaceModalOpen(false);
          }}
        />
      )}

    </NodeViewWrapper>
  );
}
