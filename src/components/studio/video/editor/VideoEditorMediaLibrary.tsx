"use client";

import {
  Upload,
  Image as ImageIcon,
  Film,
  Music,
  Plus,
  Trash2,
  Search,
  Library,
  Sparkles,
  Video,
  FolderOpen,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useVideoEditor } from "./VideoEditorContext";
import type { VideoEditorMediaType } from "./VideoEditorContext";
import VideoEditorStockPanel from "./VideoEditorStockPanel";
import VideoEditorStoragePanel from "./VideoEditorStoragePanel";

type LibraryTab = "uploads" | "ai-images" | "ai-videos" | "music" | "stock" | "recent" | "storage";

const libraryTabs: {
  id: LibraryTab;
  label: string;
  icon: React.ElementType;
}[] = [
    { id: "uploads", label: "Uploads", icon: Upload },
    { id: "ai-images", label: "AI Images", icon: Sparkles },
    { id: "ai-videos", label: "AI Videos", icon: Video },
    { id: "music", label: "Music", icon: Music },
    { id: "stock", label: "Stock", icon: Library },
    { id: "storage", label: "Storage", icon: Library },
  ];

export default function VideoEditorMediaLibrary({ forcedTab }: { forcedTab?: LibraryTab }) {
  const {
    mediaItems,
    addMediaFiles,
    removeMediaItem,
    addClipFromMedia,
    selectedMediaId,
    selectMedia,
    relinkMediaFile,
  } = useVideoEditor();

  const [libraryTabState, setLibraryTabState] = useState<LibraryTab>("uploads");
  const libraryTab = forcedTab || libraryTabState;
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState<"all" | VideoEditorMediaType>("all");

  const filteredMediaItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || item.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [mediaItems, search, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: mediaItems.length,
      videos: mediaItems.filter((m) => m.type === "video").length,
      images: mediaItems.filter((m) => m.type === "image").length,
      audios: mediaItems.filter((m) => m.type === "audio").length,
      size:
        mediaItems.reduce(
          (sum, item) => sum + (item.size || 0),
          0
        ) /
        1024 /
        1024,
    };
  }, [mediaItems]);

  return (
    <div className="space-y-4">
      <PanelHeader
        icon={Upload}
        title="미디어 라이브러리"
        desc="업로드 파일, AI 생성 결과, 음악, 스톡 리소스를 관리합니다."
      />

      {!forcedTab && (
        <div className="grid grid-cols-3 gap-2">
          {libraryTabs.map((tab) => {
            const Icon = tab.icon;
            const active = libraryTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLibraryTabState(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-md border px-2 py-3 text-[10px] font-black transition ${active
                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
                  : "border-white/10 bg-black/30 text-zinc-500 hover:border-cyan-400/50"
                  }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        <StatCard label="전체" value={stats.total} />
        <StatCard label="영상" value={stats.videos} />
        <StatCard label="이미지" value={stats.images} />
        <StatCard label="오디오" value={stats.audios} />
        <StatCard
          label="용량"
          value={`${stats.size.toFixed(1)}MB`}
        />
      </div>

      {libraryTab === "uploads" ? (
        <>
          <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-cyan-400/40 bg-cyan-400/5 text-sm font-bold text-cyan-200 hover:bg-cyan-400/10">
            <Upload size={24} />
            파일 업로드
            <span className="text-xs text-cyan-100/60">video / image / audio</span>
            <input
              type="file"
              multiple
              accept="video/*,image/*,audio/*"
              className="hidden"
              onChange={(event) => {
                const files = event.target.files;
                if (!files) return;
                addMediaFiles(files);
                event.currentTarget.value = "";
              }}
            />
          </label>

          <div className="rounded-md border border-white/10 bg-black/30 p-3">
            <div className="mb-3 flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2">
              <Search size={15} className="text-zinc-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="파일 검색"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <FilterButton label="All" active={typeFilter === "all"} onClick={() => setTypeFilter("all")} />
              <FilterButton label="Video" active={typeFilter === "video"} onClick={() => setTypeFilter("video")} />
              <FilterButton label="Image" active={typeFilter === "image"} onClick={() => setTypeFilter("image")} />
              <FilterButton label="Audio" active={typeFilter === "audio"} onClick={() => setTypeFilter("audio")} />
            </div>
          </div>

          <div className="space-y-2">
            {filteredMediaItems.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-black/30 p-4 text-center text-sm text-zinc-500">
                업로드된 미디어가 표시됩니다.
              </div>
            ) : (
              filteredMediaItems.map((item) => {
                const active = selectedMediaId === item.id;
                const isOffline = !item.url;

                return (
                  <div
                    key={item.id}
                    onClick={() => selectMedia(item.id)}
                    className={`group cursor-pointer rounded-md border p-3 transition ${active
                      ? "border-cyan-400 bg-cyan-400/10"
                      : isOffline
                        ? "border-red-500/30 bg-red-950/10 hover:border-red-500/50"
                        : "border-white/10 bg-black/30 hover:border-cyan-400/40"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <MediaIcon type={item.type} />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-white flex items-center gap-2">
                          <span>{item.name}</span>
                          {isOffline && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500 flex items-center gap-2">
                          <span className="uppercase">{item.type}</span>
                          <span>·</span>
                          <span>{item.size ? `${(item.size / 1024 / 1024).toFixed(1)}MB` : "-"}</span>
                          {isOffline && (
                            <>
                              <span>·</span>
                              <span className="text-red-400 font-black">연결 끊김</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeMediaItem(item.id);
                        }}
                        className="rounded-md p-2 text-zinc-600 opacity-0 hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isOffline ? (
                      <label
                        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/20 hover:text-red-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Upload size={14} />
                        미디어 파일 재연결
                        <input
                          type="file"
                          accept={item.type === "video" ? "video/*" : item.type === "audio" ? "audio/*" : "image/*"}
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              relinkMediaFile(item.id, file);
                            }
                          }}
                        />
                      </label>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          addClipFromMedia(item);
                        }}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 hover:border-cyan-400 hover:text-cyan-200"
                      >
                        <Plus size={14} />
                        타임라인에 추가
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : libraryTab === "stock" ? (
        <VideoEditorStockPanel />
      ) : libraryTab === "storage" ? (
        <VideoEditorStoragePanel />
      ) : libraryTab === "ai-images" ? (
        <div className="space-y-4">
          <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center">
            <Sparkles size={28} className="mx-auto mb-3 text-cyan-300" />
            <div className="font-black text-white">AI 이미지 생성 결과</div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              AI 이미지 스튜디오에서 생성한 최신 이미지를 불러옵니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              addClipFromMedia({
                id: `media-ai-${Date.now()}`,
                type: "image",
                name: "AI Generated Landscape.png",
                url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop",
                createdAt: new Date().toISOString(),
              });
            }}
            className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
          >
            AI 이미지 생성 결과 불러오기
            <Plus size={15} />
          </button>
        </div>
      ) : libraryTab === "music" ? (
        <div className="space-y-4">
          <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center">
            <Music size={28} className="mx-auto mb-3 text-emerald-300" />
            <div className="font-black text-white">뮤직 스튜디오 곡</div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              뮤직 스튜디오에서 완성한 생성 음악 트랙을 불러옵니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              addClipFromMedia({
                id: `media-music-${Date.now()}`,
                type: "audio",
                name: "Chill Focus Lounge (Generated).mp3",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                createdAt: new Date().toISOString(),
              });
            }}
            className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
          >
            생성곡 라이브러리 불러오기
            <Plus size={15} />
          </button>
        </div>
      ) : (
        <ComingSoonPanel tab={libraryTab} />
      )}
    </div>
  );
}

function ComingSoonPanel({ tab }: { tab: LibraryTab }) {
  const label =
    tab === "ai-images"
      ? "AI 이미지 생성 결과"
      : tab === "ai-videos"
        ? "AI 비디오 생성 결과"
        : tab === "music"
          ? "뮤직 스튜디오 곡"
          : tab === "stock"
            ? "스톡 미디어"
            : "최근 사용한 파일";

  return (
    <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center">
      <Sparkles size={28} className="mx-auto mb-3 text-cyan-300" />
      <div className="font-black text-white">{label}</div>
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        이 영역은 Supabase Storage, AI 생성 결과, 외부 리소스와 연결할 자리입니다.
      </p>
    </div>
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

function MediaIcon({ type }: { type: string }) {
  if (type === "video") return <Film className="text-cyan-300" size={20} />;
  if (type === "audio") return <Music className="text-emerald-300" size={20} />;
  return <ImageIcon className="text-violet-300" size={20} />;
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
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-2 text-center">
      <div className="text-[10px] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-xs font-black text-white">
        {value}
      </div>
    </div>
  );
}