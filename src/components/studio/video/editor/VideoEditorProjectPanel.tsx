"use client";

import { useMemo, useState } from "react";
import {
  FolderOpen,
  Save,
  Plus,
  Search,
  Clock3,
  FileJson,
  Download,
  Upload,
  Trash2,
  Monitor,
  Smartphone,
  Square,
  Database,
  HardDrive,
  AlertTriangle,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

type ProjectItem = {
  id: string;
  title: string;
  ratio: "16:9" | "9:16" | "1:1";
  duration: number;
  updatedAt: string;
  assetCount: number;
  storageMode: "local-only" | "metadata-db";
};

const sampleProjects: ProjectItem[] = [
  {
    id: "project-1",
    title: "YouTube Shorts 테스트",
    ratio: "9:16",
    duration: 32,
    updatedAt: "방금 전",
    assetCount: 5,
    storageMode: "metadata-db",
  },
  {
    id: "project-2",
    title: "제품 소개 영상",
    ratio: "16:9",
    duration: 78,
    updatedAt: "오늘",
    assetCount: 8,
    storageMode: "metadata-db",
  },
];

export default function VideoEditorProjectPanel() {
  const {
    projectTitle,
    setProjectTitle,
    clips,
    mediaItems,
    canvasRatio,
    totalDuration,
    exportProjectJson,
    importProjectJson,
  } = useVideoEditor();

  const [search, setSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  const filteredProjects = useMemo(() => {
    return sampleProjects.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleDownloadProject = () => {
    const json = exportProjectJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFileName(projectTitle)}.creaivideo.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        importProjectJson(String(reader.result || ""));
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : "프로젝트 파일을 불러오지 못했습니다."
        );
      }
    };

    reader.readAsText(file);
    event.currentTarget.value = "";
  };

  const handleMockSaveMetadata = () => {
    setSaveStatus("saved");
    window.setTimeout(() => setSaveStatus("idle"), 1800);
  };

  return (
    <div className="space-y-4">
      <PanelHeader
        icon={FolderOpen}
        title="프로젝트 관리"
        desc="원본 파일은 사용자 PC에 두고, Supabase에는 프로젝트 메타데이터와 히스토리만 저장합니다."
      />

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div className="flex items-start gap-3">
          <HardDrive className="mt-1 shrink-0 text-cyan-200" size={20} />
          <div>
            <div className="text-sm font-black text-cyan-100">
              Local Source + DB Metadata 구조
            </div>
            <p className="mt-1 text-xs leading-5 text-cyan-100/70">
              영상/음악/이미지 원본은 업로드하지 않습니다. DB에는 파일명, 로컬 키,
              프로젝트 JSON, 편집 히스토리만 저장합니다.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-500">
          현재 프로젝트
        </div>

        <label className="block">
          <div className="mb-2 text-xs font-bold text-zinc-500">프로젝트명</div>
          <input
            value={projectTitle}
            onChange={(event) => setProjectTitle(event.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-cyan-400"
          />
        </label>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <StatCard label="클립" value={clips.length} />
          <StatCard label="소스" value={mediaItems.length} />
          <StatCard label="길이" value={`${totalDuration}s`} />
          <StatCard label="비율" value={canvasRatio} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <ActionButton
            icon={Save}
            label={saveStatus === "saved" ? "메타 저장 완료" : "DB 메타 저장"}
            desc="Supabase 저장 예정"
            onClick={handleMockSaveMetadata}
          />

          <ActionButton
            icon={Download}
            label="JSON 내보내기"
            desc="로컬 프로젝트 백업"
            onClick={handleDownloadProject}
          />

          <label className="cursor-pointer rounded-xl border border-white/10 bg-black/30 p-3 text-left hover:border-cyan-400/50">
            <div className="flex items-center gap-2 text-xs font-black text-white">
              <Upload size={14} />
              JSON 불러오기
            </div>
            <div className="mt-1 text-[10px] leading-4 text-zinc-500">
              로컬 백업 복원
            </div>
            <input
              type="file"
              accept="application/json,.json,.creaivideo"
              className="hidden"
              onChange={handleImportProject}
            />
          </label>

          <ActionButton
            icon={Plus}
            label="새 프로젝트"
            desc="초기화는 추후 연결"
            onClick={() =>
              window.alert("새 프로젝트 초기화 기능은 다음 단계에서 연결합니다.")
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-widest text-zinc-500">
            프로젝트 목록
          </div>
          <Database size={15} className="text-zinc-500" />
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
          <Search size={15} className="text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="프로젝트 검색"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="space-y-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
            프로젝트가 없습니다.
          </div>
        )}
      </section>

      <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
        <div className="mb-1 flex items-center gap-2 font-black">
          <AlertTriangle size={14} />
          중요
        </div>
        브라우저 보안상 사용자 PC 파일 경로 전체를 DB에 저장할 수 없습니다. 대신
        File System Access API의 파일 핸들은 IndexedDB에 저장하고, Supabase에는
        local_file_key만 저장하는 구조가 맞습니다.
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const RatioIcon =
    project.ratio === "16:9"
      ? Monitor
      : project.ratio === "9:16"
        ? Smartphone
        : Square;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3 hover:border-cyan-400/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
          <RatioIcon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-black text-white">
            {project.title}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <Clock3 size={12} />
            {project.updatedAt} · {project.duration}s · {project.assetCount} assets
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          title="프로젝트 열기"
        >
          <FolderOpen size={14} />
        </button>

        <button
          type="button"
          className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-red-400 hover:text-red-300"
          title="삭제"
        >
          <Trash2 size={14} />
        </button>
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
    <div className="rounded-xl border border-white/10 bg-black/30 p-2 text-center">
      <div className="text-[10px] text-zinc-500">{label}</div>
      <div className="mt-1 text-xs font-black text-white">{value}</div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-black/30 p-3 text-left hover:border-cyan-400/50"
    >
      <div className="flex items-center gap-2 text-xs font-black text-white">
        <Icon size={14} />
        {label}
      </div>
      <div className="mt-1 text-[10px] leading-4 text-zinc-500">{desc}</div>
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

function safeFileName(value: string) {
  return (value || "creaibox-video-project")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}