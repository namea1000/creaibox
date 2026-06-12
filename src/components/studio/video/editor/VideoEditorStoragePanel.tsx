"use client";

import { useMemo, useState } from "react";
import {
  Database,
  Search,
  UploadCloud,
  FolderOpen,
  HardDrive,
  Cloud,
  FileImage,
  FileVideo,
  FileAudio,
  Plus,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Grid2X2,
  List,
  Lock,
} from "lucide-react";
import { useVideoEditor } from "./VideoEditorContext";

type StorageProvider = "supabase" | "google-drive" | "dropbox" | "local";
type StorageType = "all" | "image" | "video" | "audio";

type StorageItem = {
  id: string;
  name: string;
  type: "image" | "video" | "audio";
  provider: StorageProvider;
  path: string;
  sizeMb: number;
  createdAt: string;
  status: "ready" | "syncing" | "locked";
};

const storageProviders: {
  id: StorageProvider;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: "supabase",
    label: "Supabase",
    desc: "서비스 기본 저장소",
    icon: Database,
  },
  {
    id: "google-drive",
    label: "Google Drive",
    desc: "외부 드라이브 연동",
    icon: Cloud,
  },
  {
    id: "dropbox",
    label: "Dropbox",
    desc: "파일 보관함 연동",
    icon: FolderOpen,
  },
  {
    id: "local",
    label: "Local",
    desc: "브라우저 임시 파일",
    icon: HardDrive,
  },
];

const sampleStorageItems: StorageItem[] = [
  {
    id: "storage-1",
    name: "ai-thumbnail-cover.webp",
    type: "image",
    provider: "supabase",
    path: "video-assets/images/ai-thumbnail-cover.webp",
    sizeMb: 1.8,
    createdAt: "Recent",
    status: "ready",
  },
  {
    id: "storage-2",
    name: "intro-light-leak.webm",
    type: "video",
    provider: "supabase",
    path: "video-assets/overlays/intro-light-leak.webm",
    sizeMb: 18.4,
    createdAt: "Recent",
    status: "ready",
  },
  {
    id: "storage-3",
    name: "soft-background-bgm.mp3",
    type: "audio",
    provider: "local",
    path: "browser-cache/audio/soft-background-bgm.mp3",
    sizeMb: 5.2,
    createdAt: "Today",
    status: "ready",
  },
  {
    id: "storage-4",
    name: "drive-project-footage.mp4",
    type: "video",
    provider: "google-drive",
    path: "Google Drive / CreAIbox / footage.mp4",
    sizeMb: 64.5,
    createdAt: "Soon",
    status: "locked",
  },
];

export default function VideoEditorStoragePanel() {
  const [provider, setProvider] = useState<StorageProvider>("supabase");
  const [typeFilter, setTypeFilter] = useState<StorageType>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { addClipFromMedia } = useVideoEditor();

  const handleAddStorageItem = (item: StorageItem) => {
    if (item.status === "locked") {
      alert("이 항목은 잠겨 있어 불러올 수 없습니다. Google Drive 계정 연결이 완료되어야 합니다.");
      return;
    }
    let mockUrl = "";
    if (item.type === "image") {
      mockUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop";
    } else if (item.type === "audio") {
      mockUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    } else {
      mockUrl = "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4";
    }

    addClipFromMedia({
      id: generateStorageItemId(item.id),
      type: item.type,
      name: item.name,
      url: mockUrl,
      createdAt: new Date().toISOString(),
    });
  };

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return sampleStorageItems.filter((item) => {
      const matchProvider = item.provider === provider;
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.path.toLowerCase().includes(keyword);

      return matchProvider && matchType && matchSearch;
    });
  }, [provider, typeFilter, search]);

  const stats = useMemo(() => {
    const providerItems = sampleStorageItems.filter(
      (item) => item.provider === provider
    );

    return {
      total: providerItems.length,
      images: providerItems.filter((item) => item.type === "image").length,
      videos: providerItems.filter((item) => item.type === "video").length,
      audios: providerItems.filter((item) => item.type === "audio").length,
      size: providerItems.reduce((sum, item) => sum + item.sizeMb, 0),
    };
  }, [provider]);

  return (
    <div className="space-y-4">
      <PanelHeader
        icon={Database}
        title="Storage"
        desc="Supabase Storage, Google Drive, Dropbox, Local 파일을 통합 관리하는 저장소 허브입니다."
      />

      <div className="rounded-none border border-emerald-400/20 bg-emerald-400/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 shrink-0 text-emerald-200" size={20} />
          <div>
            <div className="text-sm font-black text-emerald-100">
              저장소 연결 구조 준비
            </div>
            <p className="mt-1 text-xs leading-5 text-emerald-100/70">
              Supabase Storage 버킷 및 외부 클라우드 연동 구조입니다. 항목의 &quot;+&quot; 버튼을 누르면 타임라인에 즉시 추가됩니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {storageProviders.map((item) => {
          const Icon = item.icon;
          const active = provider === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setProvider(item.id)}
              className={`rounded-none border p-3 text-left transition ${active
                  ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
                  : "border-white/10 bg-black/30 text-zinc-400 hover:border-emerald-400/40"
                }`}
            >
              <Icon size={17} className="mb-2" />
              <div className="text-xs font-black">{item.label}</div>
              <div className="mt-1 text-[10px] leading-4 text-zinc-500">
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-5 gap-2">
        <StatCard label="전체" value={stats.total} />
        <StatCard label="영상" value={stats.videos} />
        <StatCard label="이미지" value={stats.images} />
        <StatCard label="오디오" value={stats.audios} />
        <StatCard label="용량" value={`${stats.size.toFixed(1)}MB`} />
      </div>

      <div className="rounded-none border border-white/10 bg-black/30 p-3">
        <div className="mb-3 flex items-center gap-2 rounded-none border border-white/10 bg-black/40 px-3 py-2">
          <Search size={15} className="text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="저장 파일 검색"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <FilterButton
            label="All"
            active={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
          />
          <FilterButton
            label="Video"
            active={typeFilter === "video"}
            onClick={() => setTypeFilter("video")}
          />
          <FilterButton
            label="Image"
            active={typeFilter === "image"}
            onClick={() => setTypeFilter("image")}
          />
          <FilterButton
            label="Audio"
            active={typeFilter === "audio"}
            onClick={() => setTypeFilter("audio")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ActionButton
          icon={UploadCloud}
          label="Storage 업로드"
          desc="Supabase 연결 후 업로드"
        />
        <ActionButton
          icon={RefreshCw}
          label="파일 새로고침"
          desc="저장소 동기화"
        />
      </div>

      <div className="flex items-center justify-between rounded-none border border-white/10 bg-black/30 p-2">
        <div className="px-2 text-xs font-bold text-zinc-500">
          {filteredItems.length} files
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-none p-2 ${viewMode === "grid"
                ? "bg-emerald-400/20 text-emerald-200"
                : "text-zinc-500 hover:text-emerald-200"
              }`}
          >
            <Grid2X2 size={15} />
          </button>

          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-none p-2 ${viewMode === "list"
                ? "bg-emerald-400/20 text-emerald-200"
                : "text-zinc-500 hover:text-emerald-200"
              }`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <StorageGridCard key={item.id} item={item} onAdd={() => handleAddStorageItem(item)} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <StorageListCard key={item.id} item={item} onAdd={() => handleAddStorageItem(item)} />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="rounded-none border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
          표시할 저장 파일이 없습니다.
        </div>
      )}

      <div className="rounded-none border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
        다음 연결 단계: Supabase bucket 생성 → user_id 경로 저장 →
        storage_files 테이블 생성 → 이 패널에서 실제 파일 목록 조회.
      </div>
    </div>
  );
}

function StorageGridCard({ item, onAdd }: { item: StorageItem; onAdd: () => void }) {
  return (
    <div className="group overflow-hidden rounded-none border border-white/10 bg-black/30 transition hover:border-emerald-400/50">
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-emerald-950">
        <StorageTypeIcon type={item.type} size={28} className="text-emerald-200" />

        <div className="absolute left-2 top-2 rounded-none bg-black/70 px-2 py-1 text-[10px] font-black uppercase text-white/70">
          {item.provider}
        </div>

        {item.status === "locked" && (
          <div className="absolute right-2 top-2 rounded-none bg-zinc-800 px-2 py-1 text-[10px] font-black text-zinc-300">
            <Lock size={10} className="inline-block" /> Locked
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="truncate text-xs font-black text-white">{item.name}</div>
        <div className="mt-1 truncate text-[10px] text-zinc-500">
          {item.path}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-600">
            {item.sizeMb.toFixed(1)}MB
          </span>

          <button
            type="button"
            onClick={onAdd}
            className="rounded-none border border-white/10 p-2 text-zinc-400 hover:border-emerald-400 hover:text-emerald-200"
            title="타임라인에 추가"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StorageListCard({ item, onAdd }: { item: StorageItem; onAdd: () => void }) {
  return (
    <div className="rounded-none border border-white/10 bg-black/30 p-3 hover:border-emerald-400/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-emerald-400/10 text-emerald-200">
          <StorageTypeIcon type={item.type} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-black text-white">
            {item.name}
          </div>
          <div className="mt-1 truncate text-xs text-zinc-500">
            {item.provider} · {item.sizeMb.toFixed(1)}MB
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-none border border-white/10 p-2 text-zinc-400 hover:border-emerald-400 hover:text-emerald-200"
          title="타임라인에 추가"
        >
          <Plus size={14} />
        </button>

        <button
          type="button"
          className="rounded-none border border-white/10 p-2 text-zinc-400 hover:border-red-400 hover:text-red-300"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function StorageTypeIcon({
  type,
  size = 20,
  className,
}: {
  type: StorageItem["type"];
  size?: number;
  className?: string;
}) {
  if (type === "video") return <FileVideo size={size} className={className} />;
  if (type === "audio") return <FileAudio size={size} className={className} />;
  return <FileImage size={size} className={className} />;
}

function generateStorageItemId(itemId: string) {
  return itemId + "-" + Date.now();
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-none border border-white/10 bg-black/30 p-2 text-center">
      <div className="text-[10px] text-zinc-500">{label}</div>
      <div className="mt-1 text-xs font-black text-white">{value}</div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  desc,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      className="rounded-none border border-white/10 bg-black/30 p-3 text-left hover:border-emerald-400/50"
    >
      <div className="flex items-center gap-2 text-xs font-black text-white">
        <Icon size={14} />
        {label}
      </div>
      <div className="mt-1 text-[10px] leading-4 text-zinc-500">{desc}</div>
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
          ? "border-emerald-400 bg-emerald-400/15 text-emerald-200"
          : "border-white/10 bg-black/20 text-zinc-500 hover:border-emerald-400/40"
        }`}
    >
      {label}
    </button>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-emerald-400/10 text-emerald-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}