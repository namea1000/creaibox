"use client";

import { useMemo, useRef, useState } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Music,
  Search,
  RefreshCw,
  Plus,
  FolderOpen,
} from "lucide-react";
import { useVideoEditor } from "./VideoEditorContext";

type AssetType =
  | "all"
  | "image"
  | "video"
  | "music";

type AssetSource =
  | "midjourney"
  | "flux"
  | "imagen"
  | "runway"
  | "kling"
  | "pika"
  | "luma"
  | "suno";

type AiAsset = {
  id: string;
  title: string;
  type: "image" | "video" | "music";
  source: AssetSource;
  createdAt: string;
};

const sampleAssets: AiAsset[] = [
  {
    id: "ai-1",
    title: "Cyber City Thumbnail",
    type: "image",
    source: "midjourney",
    createdAt: "5 min ago",
  },
  {
    id: "ai-2",
    title: "AI Fashion Runway",
    type: "video",
    source: "kling",
    createdAt: "12 min ago",
  },
  {
    id: "ai-3",
    title: "Epic Trailer Music",
    type: "music",
    source: "suno",
    createdAt: "1 hour ago",
  },
];

export default function VideoEditorAiAssetsPanel() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AssetType>("all");
  const assetInstanceIdRef = useRef(0);

  // 구글 Veo 연동 상태 변수
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { addClipFromMedia } = useVideoEditor();

  const handleAddAsset = (item: AiAsset) => {
    let mockUrl = "";
    if (item.type === "image") {
      mockUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop";
    } else if (item.type === "music") {
      mockUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
    } else {
      mockUrl = "https://assets.mixkit.co/videos/preview/mixkit-curved-road-on-a-mountain-slope-5136-large.mp4";
    }

    assetInstanceIdRef.current += 1;

    addClipFromMedia({
      id: `${item.id}-${assetInstanceIdRef.current}`,
      type: item.type === "music" ? "audio" : item.type,
      name: item.title,
      url: mockUrl,
      createdAt: `ai-asset-${assetInstanceIdRef.current}`,
    });
  };

  // 구글 Veo 동영상 생성 핸들러
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg("");
    setStatusText("구글 Veo 서버에 생성 요청 중...");

    try {
      const apiKey =
        localStorage.getItem("gemini_postpay_api_key") ||
        localStorage.getItem("gemini_free_api_key") ||
        localStorage.getItem("gemini_api_key") ||
        "";

      const startRes = await fetch("/api/video-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio,
          apiKey,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok) {
        throw new Error(startData.error || "비디오 생성 시작에 실패했습니다.");
      }

      const operationId = startData.operationId;
      setStatusText("비디오 렌더링 작업을 시작했습니다. (상태 대기 중)");

      // 5초 간격으로 폴링 시작
      let elapsedSeconds = 0;
      const interval = setInterval(async () => {
        elapsedSeconds += 5;
        setStatusText(`비디오 렌더링 중... (${elapsedSeconds}초 경과, 약 1~2분 소요)`);

        try {
          const pollRes = await fetch(
            `/api/video-studio/operations/${operationId}?apiKey=${apiKey}`
          );
          const pollData = await pollRes.json();

          if (!pollRes.ok) {
            clearInterval(interval);
            setIsGenerating(false);
            setErrorMsg(pollData.error || "작업 상태 확인 중 오류가 발생했습니다.");
            return;
          }

          if (pollData.done) {
            clearInterval(interval);
            setIsGenerating(false);
            setVideoPrompt("");

            // 생성 완료된 비디오를 타임라인/미디어 라이브러리에 추가
            assetInstanceIdRef.current += 1;
            addClipFromMedia({
              id: `veo-${Date.now()}-${assetInstanceIdRef.current}`,
              type: "video",
              name: `Veo: ${videoPrompt.slice(0, 25)}...`,
              url: pollData.videoUrl,
              createdAt: "Just now",
            });

            alert("구글 Veo AI 비디오 생성이 완료되었습니다!");
          }
        } catch (pollErr: any) {
          clearInterval(interval);
          setIsGenerating(false);
          setErrorMsg(pollErr.message || "작업 상태 조회 실패");
        }
      }, 5000);
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMsg(err.message || "비디오 생성 요청 오류");
    }
  };

  const assets = useMemo(() => {
    return sampleAssets.filter((item) => {
      const matchType =
        filter === "all" || item.type === filter;

      const matchSearch =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchType && matchSearch;
    });
  }, [filter, search]);

  return (
    <div className="space-y-4">
      <PanelHeader />

      {/* 구글 Veo 비디오 생성 폼 */}
      <div className="rounded-md border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 p-4 shadow-lg shadow-black/40">
        <div className="flex items-center gap-2 text-sm font-black text-cyan-200">
          <Sparkles size={16} className="animate-pulse" />
          <span>Google Veo AI 비디오 메이커</span>
        </div>

        <form onSubmit={handleGenerateVideo} className="mt-3 space-y-3">
          <div>
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="예: 눈밭에서 뛰노는 골든 리트리버 드론 샷, 시네마틱 스타일"
              disabled={isGenerating}
              rows={3}
              className="w-full rounded-md border border-white/10 bg-black/40 p-2 text-xs text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-zinc-500">화면 비율</span>
            <select
              value={videoAspectRatio}
              onChange={(e) => setVideoAspectRatio(e.target.value)}
              disabled={isGenerating}
              className="rounded-md border border-white/10 bg-black/60 px-2 py-1 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option value="16:9">16:9 와이드 (유튜브)</option>
              <option value="9:16">9:16 세로 (쇼츠)</option>
              <option value="1:1">1:1 정방형 (SNS)</option>
            </select>
          </div>

          {errorMsg && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 p-2 text-[11px] leading-4 text-red-200">
              {errorMsg}
            </div>
          )}

          {isGenerating ? (
            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2 text-xs text-cyan-200">
                <RefreshCw size={12} className="animate-spin" />
                <span className="font-bold">{statusText}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50">
                <div className="h-full w-2/3 animate-[pulse_1.5s_infinite] rounded-full bg-cyan-400"></div>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!videoPrompt.trim() || isGenerating}
              className="w-full cursor-pointer rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 py-2 text-xs font-black text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:from-zinc-700 disabled:to-zinc-800 disabled:opacity-50"
            >
              비디오 생성하기 (Veo API)
            </button>
          )}
        </form>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Images" value="128" />
        <StatCard label="Videos" value="46" />
        <StatCard label="Music" value="33" />
      </div>

      <div className="rounded-md border border-white/10 bg-black/30 p-3">
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="AI 결과 검색"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
          />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          <FilterButton
            label="All"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterButton
            label="Image"
            active={filter === "image"}
            onClick={() => setFilter("image")}
          />
          <FilterButton
            label="Video"
            active={filter === "video"}
            onClick={() => setFilter("video")}
          />
          <FilterButton
            label="Music"
            active={filter === "music"}
            onClick={() => setFilter("music")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ActionCard
          icon={RefreshCw}
          title="새로고침"
          desc="AI 결과 동기화"
        />
        <ActionCard
          icon={FolderOpen}
          title="라이브러리 열기"
          desc="전체 생성 결과"
        />
      </div>

      <div className="space-y-2">
        {assets.map((item) => (
          <AssetCard key={item.id} item={item} onAdd={() => handleAddAsset(item)} />
        ))}
      </div>

      <div className="rounded-md border border-cyan-400/20 bg-cyan-400/10 p-4 text-xs leading-5 text-cyan-100">
        연결됨:
        <br />
        • Image Studio
        <br />
        • Video Studio
        <br />
        • Music Studio
        <br />
        • Research Studio
        <br />
        • Supabase Storage
      </div>
    </div>
  );
}

function AssetCard({
  item,
  onAdd,
}: {
  item: AiAsset;
  onAdd: () => void;
}) {
  const Icon =
    item.type === "image"
      ? ImageIcon
      : item.type === "video"
        ? Video
        : Music;

  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3 hover:border-cyan-400/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-400/10">
          <Icon size={18} className="text-cyan-200" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-black text-white">
            {item.title}
          </div>

          <div className="mt-1 text-xs text-zinc-500">
            {item.source}
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-md border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          title="타임라인에 추가"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function PanelHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300">
        <Sparkles size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">
          AI Assets
        </h3>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          AI 생성 결과 통합 허브
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3 text-center">
      <div className="text-[10px] text-zinc-500">
        {label}
      </div>

      <div className="mt-1 font-black text-white">
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <button className="rounded-md border border-white/10 bg-black/30 p-3 text-left hover:border-cyan-400/50">
      <div className="flex items-center gap-2 text-sm font-black text-white">
        <Icon size={15} />
        {title}
      </div>

      <div className="mt-1 text-xs text-zinc-500">
        {desc}
      </div>
    </button>
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
