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

type LibraryTab = "uploads" | "ai-images" | "ai-videos" | "music" | "stock" | "recent";

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
    { id: "recent", label: "Recent", icon: FolderOpen },
  ];

export default function VideoEditorMediaLibrary() {
  const {
    mediaItems,
    addMediaFiles,
    removeMediaItem,
    addClipFromMedia,
    selectedMediaId,
    selectMedia,
  } = useVideoEditor();

  const [libraryTab, setLibraryTab] = useState<LibraryTab>("uploads");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | VideoEditorMediaType>("all");

  const filteredMediaItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || item.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [mediaItems, search, typeFilter]);

  return (
    <div className="space-y-4">
      <PanelHeader
        icon={Upload}
        title="미디어 라이브러리"
        desc="업로드 파일, AI 생성 결과, 음악, 스톡 리소스를 관리합니다."
      />

      <div className="grid grid-cols-3 gap-2">
        {libraryTabs.map((tab) => {
          const Icon = tab.icon;
          const active = libraryTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLibraryTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-[10px] font-black transition ${active
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

      {libraryTab === "uploads" ? (
        <>
          <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-cyan-400/40 bg-cyan-400/5 text-sm font-bold text-cyan-200 hover:bg-cyan-400/10">
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

          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
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
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center text-sm text-zinc-500">
                업로드된 미디어가 표시됩니다.
              </div>
            ) : (
              filteredMediaItems.map((item) => {
                const active = selectedMediaId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => selectMedia(item.id)}
                    className={`group cursor-pointer rounded-xl border p-3 transition ${active
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-black/30 hover:border-cyan-400/40"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <MediaIcon type={item.type} />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-white">
                          {item.name}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {item.type.toUpperCase()} ·{" "}
                          {item.size ? `${(item.size / 1024 / 1024).toFixed(1)}MB` : "-"}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeMediaItem(item.id);
                        }}
                        className="rounded-lg p-2 text-zinc-600 opacity-0 hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        addClipFromMedia(item);
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 hover:border-cyan-400 hover:text-cyan-200"
                    >
                      <Plus size={14} />
                      타임라인에 추가
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </>
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
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/30 p-5 text-center">
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
      className={`rounded-lg border px-2 py-2 text-[11px] font-black ${active
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}