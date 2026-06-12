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

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Images" value="128" />
        <StatCard label="Videos" value="46" />
        <StatCard label="Music" value="33" />
      </div>

      <div className="rounded-none border border-white/10 bg-black/30 p-3">
        <div className="flex items-center gap-2 rounded-none border border-white/10 bg-black/40 px-3 py-2">
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

      <div className="rounded-none border border-cyan-400/20 bg-cyan-400/10 p-4 text-xs leading-5 text-cyan-100">
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
    <div className="rounded-none border border-white/10 bg-black/30 p-3 hover:border-cyan-400/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-none bg-cyan-400/10">
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
          className="rounded-none border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
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
      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-cyan-400/10 text-cyan-300">
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
    <div className="rounded-none border border-white/10 bg-black/30 p-3 text-center">
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
    <button className="rounded-none border border-white/10 bg-black/30 p-3 text-left hover:border-cyan-400/50">
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
      className={`rounded-none border px-2 py-2 text-[11px] font-black ${active
          ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
          : "border-white/10 bg-black/20 text-zinc-500 hover:border-cyan-400/40"
        }`}
    >
      {label}
    </button>
  );
}
