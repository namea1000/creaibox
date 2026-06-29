"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Sparkles,
  LayoutGrid,
  Settings,
  Folder,
  Archive,
  Video,
  Play,
  Square,
  Loader2,
  Download,
  Upload,
  User,
  Heart,
  Eye,
  Check,
  ChevronRight,
  ExternalLink,
  Info,
  Layers,
  Edit3,
  X,
  RefreshCw,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { exportDirectMp4VideoOnly } from "@/components/studio/video/editor/export/directMp4Exporter";

type TemplateItem = {
  id: string;
  title: string;
  creator: string;
  avatar: string;
  uses: string;
  likes: string;
  category: "vlog" | "shorts" | "collage" | "business";
  videoUrl: string;
  posterUrl: string;
  musicUrl: string;
  duration: number; // in seconds
  layers: {
    videoPlaceholder: string;
    imagePlaceholder: string;
    defaultText1: string;
    defaultText2: string;
  };
};

const SAMPLE_TEMPLATES: TemplateItem[] = [
  {
    id: "tpl-1",
    title: "오늘의 감성 미니 브이로그 (Today's vlog)",
    creator: "VlogMaster",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    uses: "421.5K",
    likes: "24.8K",
    category: "vlog",
    videoUrl: "/sample.mp4",
    posterUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 6,
    layers: {
      videoPlaceholder: "배경 브이로그 클립들 (Videos)",
      imagePlaceholder: "추가 삽입 사진들 (Images)",
      defaultText1: "TODAY'S VLOG",
      defaultText2: "소소하지만 행복한 일상 기록",
    },
  },
  {
    id: "tpl-2",
    title: "사이버펑크 게이머 & 테크 릴스 (Cyberpunk Tech)",
    creator: "NeoGamer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    uses: "1.2M",
    likes: "94.5K",
    category: "shorts",
    videoUrl: "/sample2.mp4",
    posterUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 6,
    layers: {
      videoPlaceholder: "코딩 / 게임 플레이 클립들 (Videos)",
      imagePlaceholder: "추가 삽입 사진들 (Images)",
      defaultText1: "CODE REVOLUTION",
      defaultText2: "인공지능 코딩의 비밀을 밝히다",
    },
  },
  {
    id: "tpl-3",
    title: "동기부여 & 성공 명언 템플릿 (Daily Motivation)",
    creator: "LifeCoach",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    uses: "895.4K",
    likes: "61.2K",
    category: "shorts",
    videoUrl: "/sample.mp4",
    posterUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 6,
    layers: {
      videoPlaceholder: "동기부여 영상 클립들 (Videos)",
      imagePlaceholder: "추가 삽입 사진들 (Images)",
      defaultText1: "포기하지 마라",
      defaultText2: "성공은 매일의 작은 습관에서 온다",
    },
  },
  {
    id: "tpl-4",
    title: "신비로운 우주 & 에스테틱 콜라주 (Cosmic Aesthetic)",
    creator: "SpaceTraveler",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
    uses: "235.1K",
    likes: "18.3K",
    category: "collage",
    videoUrl: "/sample2.mp4",
    posterUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 6,
    layers: {
      videoPlaceholder: "우주 입자 비디오들 (Videos)",
      imagePlaceholder: "추가 삽입 사진들 (Images)",
      defaultText1: "COSMIC DREAM",
      defaultText2: "우주의 경이로움을 찾아서",
    },
  },
  {
    id: "tpl-5",
    title: "비즈니스 차트 및 금융 투자 정보 (Stock Analytics)",
    creator: "FinancePro",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
    uses: "712.9K",
    likes: "45.1K",
    category: "business",
    videoUrl: "/sample.mp4",
    posterUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 6,
    layers: {
      videoPlaceholder: "주식 차트 / 지표 클립들 (Videos)",
      imagePlaceholder: "추가 삽입 사진들 (Images)",
      defaultText1: "INVESTMENT REPORT",
      defaultText2: "오늘의 주식 동향과 투자 시그널",
    },
  },
  {
    id: "tpl-6",
    title: "빈티지 감성 북 오프닝 스토리 (Vintage Story)",
    creator: "RetroVibe",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
    uses: "310.2K",
    likes: "19.5K",
    category: "vlog",
    videoUrl: "/sample2.mp4",
    posterUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 6,
    layers: {
      videoPlaceholder: "고서적 책장 넘기는 클립들 (Videos)",
      imagePlaceholder: "추가 삽입 사진들 (Images)",
      defaultText1: "RETRO LIBRARY",
      defaultText2: "시간이 멈춘 도서관에서",
    },
  },
];

// Helper to probe video duration in client-side js
const getProbedVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration || 5);
    };
    video.onerror = () => {
      resolve(5);
    };
  });
};

export default function VideoTemplateMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

  // Advanced Multi-Asset swapper workspace states
  const [replacedVideos, setReplacedVideos] = useState<File[]>([]);
  const [replacedVideoUrls, setReplacedVideoUrls] = useState<string[]>([]);
  const [replacedVideoDurations, setReplacedVideoDurations] = useState<number[]>([]);

  const [replacedImages, setReplacedImages] = useState<File[]>([]);
  const [replacedImageUrls, setReplacedImageUrls] = useState<string[]>([]);
  const [replacedImageUrlList, setReplacedImageUrlList] = useState<string[]>([]);

  const [transitionEffect, setTransitionEffect] = useState<"fade" | "slide" | "zoom" | "none">("fade");
  const [imageDuration, setImageDuration] = useState<number>(3); // 3 seconds per image by default

  const [customText1, setCustomText1] = useState("");
  const [customText2, setCustomText2] = useState("");

  // Video Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live preview controls
  const [currentPlayingVideoIndex, setCurrentPlayingVideoIndex] = useState<number>(0);
  const [showPhotoPreview, setShowPhotoPreview] = useState<boolean>(false);
  const [previewSlideIndex, setPreviewSlideIndex] = useState<number>(0);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  // Photo preview slides loop
  useEffect(() => {
    if (!showPhotoPreview || replacedImageUrlList.length === 0) return;

    const timer = setInterval(() => {
      setPreviewSlideIndex((prev) => {
        const next = prev + 1;
        if (next < replacedImageUrlList.length) {
          return next;
        } else {
          // Loop back to videos
          setShowPhotoPreview(false);
          setCurrentPlayingVideoIndex(0);
          return 0;
        }
      });
    }, imageDuration * 1000);

    return () => clearInterval(timer);
  }, [showPhotoPreview, replacedImageUrlList, imageDuration]);

  // Video preview auto-trigger
  useEffect(() => {
    if (modalVideoRef.current && !showPhotoPreview) {
      modalVideoRef.current.load();
      modalVideoRef.current.play().catch((e) => console.log("Autoplay check:", e));
    }
  }, [currentPlayingVideoIndex, replacedVideoUrls, showPhotoPreview]);

  const handleVideoEnded = () => {
    if (replacedVideoUrls.length > 0) {
      const nextIndex = currentPlayingVideoIndex + 1;
      if (nextIndex < replacedVideoUrls.length) {
        setCurrentPlayingVideoIndex(nextIndex);
      } else {
        // If there are photos, we transition to photo preview
        if (replacedImageUrlList.length > 0) {
          setShowPhotoPreview(true);
          setPreviewSlideIndex(0);
        } else {
          // Loop back to start
          setCurrentPlayingVideoIndex(0);
        }
      }
    } else {
      // Loop default template
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = 0;
        modalVideoRef.current.play().catch(() => {});
      }
    }
  };

  // Initialize workspace when template opens
  const handleOpenTemplate = (tpl: TemplateItem) => {
    setSelectedTemplate(tpl);
    
    // Revoke old object URLs
    replacedVideoUrls.forEach((url) => URL.revokeObjectURL(url));
    replacedImageUrlList.forEach((url) => URL.revokeObjectURL(url));

    setReplacedVideos([]);
    setReplacedVideoUrls([]);
    setReplacedVideoDurations([]);
    setReplacedImages([]);
    setReplacedImageUrlList([]);
    setCustomText1(tpl.layers.defaultText1);
    setCustomText2(tpl.layers.defaultText2);
    setTransitionEffect("fade");
    setImageDuration(3);
    setCurrentPlayingVideoIndex(0);
    setShowPhotoPreview(false);
    setPreviewSlideIndex(0);
  };



  // Video selection handler (support multiple)
  const handleVideosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newDurations = await Promise.all(files.map(getProbedVideoDuration));
    const newUrls = files.map((file) => URL.createObjectURL(file));

    setReplacedVideos((prev) => [...prev, ...files]);
    setReplacedVideoUrls((prev) => [...prev, ...newUrls]);
    setReplacedVideoDurations((prev) => [...prev, ...newDurations]);
  };

  // Image selection handler (support multiple)
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUrls = files.map((file) => URL.createObjectURL(file));
    setReplacedImages((prev) => [...prev, ...files]);
    setReplacedImageUrlList((prev) => [...prev, ...newUrls]);
  };

  // Remove individual video
  const handleRemoveVideo = (index: number) => {
    URL.revokeObjectURL(replacedVideoUrls[index]);
    setReplacedVideos((prev) => prev.filter((_, i) => i !== index));
    setReplacedVideoUrls((prev) => prev.filter((_, i) => i !== index));
    setReplacedVideoDurations((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove individual image
  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(replacedImageUrlList[index]);
    setReplacedImages((prev) => prev.filter((_, i) => i !== index));
    setReplacedImageUrlList((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate dynamic total duration
  const totalDurationCalculated = useMemo(() => {
    let videoTime = 0;
    if (replacedVideoDurations.length > 0) {
      videoTime = replacedVideoDurations.reduce((acc, cur) => acc + cur, 0);
    } else if (selectedTemplate) {
      videoTime = selectedTemplate.duration; // use default template duration if no videos uploaded
    }
    const photoTime = replacedImageUrlList.length * imageDuration;
    return Math.ceil(videoTime + photoTime);
  }, [replacedVideoDurations, replacedImageUrlList, imageDuration, selectedTemplate]);

  // Export Canvas Compiler Engine (Direct MP4 using mediabunny)
  const handleExportTemplateVideo = async () => {
    if (!selectedTemplate) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas 엘리먼트를 찾을 수 없습니다.");

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D Context를 얻지 못했습니다.");

      const width = 540;
      const height = 960;
      canvas.width = width;
      canvas.height = height;

      // 1. Preload Video Elements
      const videosToLoad = replacedVideoUrls.length > 0 ? replacedVideoUrls : [selectedTemplate.videoUrl];
      const videoElements = await Promise.all(
        videosToLoad.map(async (url) => {
          return new Promise<HTMLVideoElement>((resolve, reject) => {
            const v = document.createElement("video");
            v.src = url;
            v.crossOrigin = "anonymous";
            v.muted = true;
            v.playsInline = true;
            v.loop = false;
            v.onloadeddata = () => resolve(v);
            v.onerror = () => reject(new Error("동영상 에셋 로딩에 실패했습니다."));
            v.load();
          });
        })
      );

      // 2. Preload Image Elements
      const imageElements = await Promise.all(
        replacedImageUrlList.map(async (url) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("사진 에셋 로딩에 실패했습니다."));
          });
        })
      );

      // 3. Decode Background Music to AudioBuffer for Muxing
      let audioBuffer: AudioBuffer | undefined = undefined;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const decodeCtx = new AudioContextClass();
        const musicRes = await fetch(selectedTemplate.musicUrl);
        const musicArrBuf = await musicRes.arrayBuffer();
        audioBuffer = await decodeCtx.decodeAudioData(musicArrBuf);
        await decodeCtx.close();
      } catch (ae) {
        console.warn("Failed to decode audio data for MP4, exporting video-only:", ae);
      }

      // Video timelines calculation
      const videoClipsDurations = replacedVideoDurations.length > 0 
        ? replacedVideoDurations 
        : [selectedTemplate.duration];

      const totalVideoDuration = videoClipsDurations.reduce((acc, d) => acc + d, 0);

      const renderFrame = async (sec: number) => {
        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, width, height);

        // Rendering phase: Videos VS Photos
        if (sec < totalVideoDuration) {
          // Video Clip drawing phase
          let accumulated = 0;
          let activeIdx = 0;
          for (let i = 0; i < videoClipsDurations.length; i++) {
            if (sec >= accumulated && sec < accumulated + videoClipsDurations[i]) {
              activeIdx = i;
              break;
            }
            accumulated += videoClipsDurations[i];
          }

          const activeVideo = videoElements[activeIdx];
          
          // Seek the active video to the exact frame time!
          const clipRelativeTime = sec - accumulated;
          activeVideo.currentTime = clipRelativeTime;
          
          // Wait for seeking to finish so that the canvas captures the exact correct frame!
          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              activeVideo.removeEventListener("seeked", onSeeked);
              resolve();
            };
            activeVideo.addEventListener("seeked", onSeeked);
            // Fallback timeout
            setTimeout(resolve, 80);
          });

          if (activeVideo && activeVideo.readyState >= 2) {
            const vWidth = activeVideo.videoWidth;
            const vHeight = activeVideo.videoHeight;
            const vRatio = vWidth / vHeight;
            const targetRatio = width / height;

            let sx = 0, sy = 0, sWidth = vWidth, sHeight = vHeight;
            if (vRatio > targetRatio) {
              sWidth = vHeight * targetRatio;
              sx = (vWidth - sWidth) / 2;
            } else {
              sHeight = vWidth / targetRatio;
              sy = (vHeight - sHeight) / 2;
            }
            ctx.drawImage(activeVideo, sx, sy, sWidth, sHeight, 0, 0, width, height);
          }
        } else {
          // Photo Slideshow drawing phase
          const photoSec = sec - totalVideoDuration;
          const activePhotoIdx = Math.floor(photoSec / imageDuration);
          
          if (imageElements.length > 0) {
            const currentImg = imageElements[activePhotoIdx % imageElements.length];
            const nextImg = imageElements[(activePhotoIdx + 1) % imageElements.length];
            
            const frameProgress = (photoSec % imageDuration) / imageDuration;
            const transitionOverlap = 0.5; // 0.5 seconds overlap for slide/fade transitions
            
            ctx.save();

            const drawImageCover = (img: HTMLImageElement, dx: number = 0, dy: number = 0, scale: number = 1.0) => {
              const iWidth = img.width;
              const iHeight = img.height;
              const iRatio = iWidth / iHeight;
              const targetRatio = width / height;

              let sx = 0, sy = 0, sWidth = iWidth, sHeight = iHeight;
              if (iRatio > targetRatio) {
                sWidth = iHeight * targetRatio;
                sx = (iWidth - sWidth) / 2;
              } else {
                sHeight = iWidth / targetRatio;
                sy = (iHeight - sHeight) / 2;
              }

              ctx.save();
              ctx.translate(width / 2 + dx, height / 2 + dy);
              ctx.scale(scale, scale);
              ctx.drawImage(img, sx, sy, sWidth, sHeight, -width / 2, -height / 2, width, height);
              ctx.restore();
            };

            // Transition Calculations
            if (photoSec % imageDuration > imageDuration - transitionOverlap && imageElements.length > 1) {
              const alpha = ((photoSec % imageDuration) - (imageDuration - transitionOverlap)) / transitionOverlap;
              
              if (transitionEffect === "fade") {
                ctx.globalAlpha = 1 - alpha;
                drawImageCover(currentImg);
                ctx.globalAlpha = alpha;
                drawImageCover(nextImg);
              } else if (transitionEffect === "slide") {
                const shiftX = alpha * width;
                drawImageCover(currentImg, -shiftX, 0);
                drawImageCover(nextImg, width - shiftX, 0);
              } else if (transitionEffect === "zoom") {
                const zScale = 1.0 + (frameProgress * 0.15);
                ctx.globalAlpha = 1 - alpha;
                drawImageCover(currentImg, 0, 0, zScale);
                ctx.globalAlpha = alpha;
                drawImageCover(nextImg, 0, 0, 1.0);
              } else {
                // none
                drawImageCover(currentImg);
              }
            } else {
              // Standard slide draw
              if (transitionEffect === "zoom") {
                const zScale = 1.0 + (frameProgress * 0.15);
                drawImageCover(currentImg, 0, 0, zScale);
              } else {
                drawImageCover(currentImg);
              }
            }

            ctx.shadowBlur = 0;
            ctx.restore();
          }
        }

        // Draw custom text overlay
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "black 32px Inter, sans-serif, Apple SD Gothic Neo";
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#000000";
        ctx.strokeText(customText1, width / 2, height / 2 - 30);
        ctx.fillStyle = "#facc15";
        ctx.fillText(customText1, width / 2, height / 2 - 30);

        ctx.font = "bold 20px Inter, sans-serif, Apple SD Gothic Neo";
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#000000";
        ctx.strokeText(customText2, width / 2, height / 2 + 30);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(customText2, width / 2, height / 2 + 30);

        ctx.shadowBlur = 0;
        ctx.font = "black 12px Inter";
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText("creaibox compilation", width / 2, 50);
      };

      // Trigger WebCodecs Direct MP4 Render
      const blob = await exportDirectMp4VideoOnly({
        canvas,
        fps: 30,
        totalDuration: totalDurationCalculated,
        bitrate: 2_500_000,
        audioBuffer,
        renderFrame,
        options: {
          onProgress: (p) => {
            setExportProgress(p.progress);
          },
        },
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedTemplate.title.replace(/\s+/g, "_")}_합성완료.mp4`;
        a.click();
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
        setExportProgress(0);
        alert("🎉 Direct MP4 H.264 인코딩 방식을 통해 템플릿 비디오 최종 저장이 성공적으로 완료되었습니다!");
      }

    } catch (err: any) {
      console.error(err);
      alert(`합성 렌더링 도중 오류가 발생했습니다: ${err.message}`);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const filteredTemplates = SAMPLE_TEMPLATES.filter((tpl) => {
    const matchesCategory = activeCategory === "all" || tpl.category === activeCategory;
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Header Section */}
      <section className="rounded-2xl border border-zinc-800 bg-[#0c0d12] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2 text-white">
            <Sparkles className="text-teal-400" size={20} />
            크리에이박스 영상 템플릿 마켓
          </h2>
          <p className="text-xs text-zinc-500 font-bold mt-1">
            여러 동영상들을 연달아 붙이고 사진들을 부드러운 전환 효과(디졸브, 슬라이드 등)와 함께 원클릭으로 합쳐보세요.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="마음에 드는 컨셉이나 크리에이터 검색"
            className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-850 pl-10 pr-3 text-xs text-zinc-200 focus:outline-none focus:border-teal-500/50"
          />
        </div>
      </section>

      {/* Categories filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "🔥 추천 템플릿" },
          { id: "vlog", label: "일상 브이로그" },
          { id: "shorts", label: "쇼츠 & 릴스" },
          { id: "collage", label: "콜라주 / 에스테틱" },
          { id: "business", label: "비즈니스 / 광고" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition border ${
              activeCategory === cat.id
                ? "bg-teal-500/10 border-teal-500/40 text-teal-300"
                : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Marketplace */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleOpenTemplate(tpl)}
              className="group rounded-2xl border border-zinc-850 bg-zinc-900/20 overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg"
            >
              {/* Media Preview Box */}
              <div className="aspect-[9/16] relative bg-zinc-950 overflow-hidden flex items-center justify-center">
                <video
                  src={tpl.videoUrl}
                  poster={tpl.posterUrl}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                  onMouseOut={(e) => {
                    const vid = e.target as HTMLVideoElement;
                    vid.pause();
                    vid.currentTime = 0;
                  }}
                />
                
                <div className="absolute top-2.5 left-2.5 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black text-zinc-300 flex items-center gap-1">
                  <Play size={8} /> {tpl.uses} 사용됨
                </div>

                <span className="absolute bottom-2.5 right-2.5 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-bold text-zinc-300 font-mono">
                  00:0{tpl.duration}
                </span>
              </div>

              {/* Text Card detail */}
              <div className="p-3.5 space-y-2 border-t border-zinc-850 bg-zinc-950/30">
                <h4 className="text-xs font-black text-zinc-200 line-clamp-2 leading-snug group-hover:text-teal-400 transition">
                  {tpl.title}
                </h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img src={tpl.avatar} alt={tpl.creator} className="h-4.5 w-4.5 rounded-full object-cover" />
                    <span className="text-[10px] text-zinc-400 font-bold truncate max-w-20">{tpl.creator}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-zinc-550 font-bold">
                    <Heart size={9} /> {tpl.likes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <Info size={28} className="mx-auto text-zinc-750 mb-2" />
          <p className="text-xs font-bold">해당 필터에 일치하는 영상 템플릿이 없습니다.</p>
        </div>
      )}

      {/* Canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Interactive Media Swapper Workspace Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 md:p-6 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-[#0f1015] text-white shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 shrink-0">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-teal-400" />
                <h3 className="text-sm font-black">템플릿 간편 대량 합성 편집실</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Player preview */}
              <div className="space-y-4">
                <div className="aspect-[9/16] max-h-[50vh] mx-auto relative rounded-xl bg-black overflow-hidden border border-zinc-800 shadow-inner flex items-center justify-center">
                  {showPhotoPreview && replacedImageUrlList.length > 0 ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-zinc-950">
                      <img
                        src={replacedImageUrlList[previewSlideIndex]}
                        alt="Preview Slide"
                        className="w-full h-full object-cover transition-opacity duration-500 animate-pulse"
                      />
                      <span className="absolute top-4 left-4 bg-teal-500/90 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                        사진 슬라이드쇼 프리뷰: {previewSlideIndex + 1} / {replacedImageUrlList.length}
                      </span>
                    </div>
                  ) : (
                    <video
                      ref={modalVideoRef}
                      src={replacedVideoUrls.length > 0 ? replacedVideoUrls[currentPlayingVideoIndex] : selectedTemplate.videoUrl}
                      poster={replacedVideoUrls.length > 0 ? "" : selectedTemplate.posterUrl}
                      preload="metadata"
                      controls
                      onEnded={handleVideoEnded}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Floating caption simulator on preview */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full text-center px-4 pointer-events-none select-none z-10">
                    <p className="text-lg font-black text-yellow-400 drop-shadow-md leading-normal tracking-wide">
                      {customText1 || "메인 자막 입력"}
                    </p>
                    <p className="text-xs font-bold text-white drop-shadow-md leading-normal mt-1.5">
                      {customText2 || "하단 설명 입력"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-850 space-y-2">
                  <h5 className="text-xs font-black text-zinc-300 flex items-center gap-1">
                    <Info size={13} className="text-teal-400" />
                    템플릿 비디오 정보
                  </h5>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-bold">
                    합산 예상 총 분량: <span className="text-teal-400 font-black">{totalDurationCalculated}초</span>
                    {replacedVideoUrls.length > 0 && ` (비디오 클립 ${replacedVideoUrls.length}개)`}
                    {replacedImageUrlList.length > 0 && ` (사진 ${replacedImageUrlList.length}장 x ${imageDuration}초)`}
                  </p>
                </div>
              </div>

              {/* Right Column: Layer editing panel */}
              <div className="space-y-5">
                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-850 space-y-4">
                  <h4 className="text-xs font-black text-zinc-300 flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Video size={14} className="text-teal-400" />
                      1. 비디오 다중 선택 및 붙이기
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold">다중 선택 가능</span>
                  </h4>

                  {/* Slot 1: Multiple Video swap */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="video/*"
                        id="tpl-video-picker-multi"
                        multiple
                        className="hidden"
                        onChange={handleVideosChange}
                      />
                      <label
                        htmlFor="tpl-video-picker-multi"
                        className="flex-1 flex items-center justify-center gap-2 px-3 h-10 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-teal-500/40 text-xs font-black text-teal-400 cursor-pointer transition active:scale-95"
                      >
                        <Plus size={14} />
                        내 컴퓨터에서 동영상 파일들 선택하기
                      </label>
                    </div>

                    {replacedVideos.length > 0 ? (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {replacedVideos.map((video, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-850 text-[10px] font-bold">
                            <span className="truncate max-w-44 text-zinc-350">{video.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-zinc-550 font-mono">약 {replacedVideoDurations[idx]?.toFixed(1) || 5}초</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveVideo(idx)}
                                className="text-zinc-500 hover:text-red-400 p-0.5"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[9px] text-zinc-600 text-center font-bold">
                        * 선택된 개별 비디오가 없습니다. (미선택 시 기본 템플릿 비디오 사용)
                      </p>
                    )}
                  </div>
                </div>

                {/* Images Slot */}
                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-850 space-y-4">
                  <h4 className="text-xs font-black text-zinc-300 flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-teal-400" />
                      2. 슬라이드쇼 사진 추가 (선택)
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold">다중 선택 가능</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="tpl-image-picker-multi"
                        multiple
                        className="hidden"
                        onChange={handleImagesChange}
                      />
                      <label
                        htmlFor="tpl-image-picker-multi"
                        className="flex-1 flex items-center justify-center gap-2 px-3 h-10 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-teal-500/40 text-xs font-black text-teal-400 cursor-pointer transition active:scale-95"
                      >
                        <Plus size={14} />
                        내 컴퓨터에서 사진 파일들 선택하기
                      </label>
                    </div>

                    {replacedImageUrlList.length > 0 && (
                      <div className="space-y-3">
                        {/* Transitions settings */}
                        <div className="grid grid-cols-2 gap-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-850">
                          <div>
                            <label className="text-[9px] text-zinc-400 font-bold block mb-1">사진 전환 효과</label>
                            <select
                              value={transitionEffect}
                              onChange={(e) => setTransitionEffect(e.target.value as any)}
                              className="w-full h-8 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 focus:outline-none px-2"
                            >
                              <option value="fade">디졸브 (Fade)</option>
                              <option value="slide">슬라이드 (Slide)</option>
                              <option value="zoom">서서히 확대 (Zoom)</option>
                              <option value="none">효과 없음</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] text-zinc-400 font-bold block mb-1">장당 재생 시간 (초)</label>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={imageDuration}
                              onChange={(e) => setImageDuration(Math.max(1, parseInt(e.target.value) || 3))}
                              className="w-full h-8 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 focus:outline-none px-2"
                            />
                          </div>
                        </div>

                        {/* Thumbnails list */}
                        <div className="grid grid-cols-6 gap-2 max-h-24 overflow-y-auto pr-1">
                          {replacedImageUrlList.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded bg-zinc-900 overflow-hidden border border-zinc-800 group">
                              <img src={url} alt="slide" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black p-0.5 rounded text-zinc-400 hover:text-red-400 transition"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtitles Input */}
                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-850 space-y-4">
                  <h4 className="text-xs font-black text-zinc-300 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                    <Edit3 size={14} className="text-teal-400" />
                    3. 자막 문구 변경 (Texts)
                  </h4>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold block">메인 타이틀 문구</label>
                      <input
                        type="text"
                        value={customText1}
                        onChange={(e) => setCustomText1(e.target.value)}
                        placeholder="중앙에 표시될 메인 문장"
                        className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 px-3 text-xs text-zinc-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-bold block">서브 요약 문구</label>
                      <input
                        type="text"
                        value={customText2}
                        onChange={(e) => setCustomText2(e.target.value)}
                        placeholder="메인 문구 하단에 깔릴 서브 내용"
                        className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 px-3 text-xs text-zinc-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  {isExporting ? (
                    <div className="space-y-2 rounded-xl bg-zinc-950 p-4 border border-zinc-850">
                      <div className="flex justify-between text-xs font-black">
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={13} className="animate-spin text-teal-400" />
                          멀티 클립 영상 및 사진 슬라이드쇼 합성 진행 중...
                        </span>
                        <span className="text-teal-400">{exportProgress}%</span>
                      </div>
                      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-400 transition-all duration-300"
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleExportTemplateVideo}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 py-3.5 text-xs font-black text-white active:scale-95 transition shadow-lg"
                    >
                      <Download size={14} />
                      새 템플릿 비디오 내보내기 (Export)
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
