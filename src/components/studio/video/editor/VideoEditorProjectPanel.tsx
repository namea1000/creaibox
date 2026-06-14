"use client";

import { useMemo, useState } from "react";
import {
  FolderOpen,
  Save,
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Database,
  ChevronDown,
  ChevronRight,
  Film,
  Music,
  Image as ImageIcon,
  Type,
  Briefcase,
  Layers,
  Settings,
} from "lucide-react";
import { useVideoEditor, type CanvasRatio } from "./VideoEditorContext";

type ProjectItem = {
  id: string;
  title: string;
  ratio: CanvasRatio;
  duration: number;
  updatedAt: string;
  assetCount: number;
};

const sampleProjects: ProjectItem[] = [
  {
    id: "project-1",
    title: "YouTube Shorts 테스트",
    ratio: "9:16",
    duration: 15,
    updatedAt: "방금 전",
    assetCount: 2,
  },
  {
    id: "project-2",
    title: "제품 소개 영상",
    ratio: "16:9",
    duration: 25,
    updatedAt: "오늘",
    assetCount: 2,
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

  const [projects, setProjects] = useState<ProjectItem[]>(sampleProjects);
  const [search, setSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  // Collapsible tree node states
  const [openFolders, setOpenFolders] = useState({
    projects: true,
    smartLibrary: true,
    backup: true,
  });

  const toggleFolder = (folder: "projects" | "smartLibrary" | "backup") => {
    setOpenFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const handleDeleteProject = (id: string) => {
    if (window.confirm("이 프로젝트를 삭제하시겠습니까?")) {
      setProjects((prev) => prev.filter((item) => item.id !== id));
    }
  };

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

  const handleNewProject = () => {
    if (window.confirm("현재 프로젝트를 초기화하고 새 프로젝트를 시작하시겠습니까?")) {
      const emptyJson = JSON.stringify({
        version: "creaibox-video-editor-v3",
        projectTitle: "New Project",
        activeTab: "media",
        clips: [],
        canvasRatio: "16:9",
        canvasZoom: 100,
        exportResolution: "1080p",
        exportFps: 30,
        exportQuality: "standard"
      });
      importProjectJson(emptyJson);
    }
  };

  const handleLoadProject = (project: ProjectItem) => {
    const mockClips = project.id === "project-1"
      ? [
          {
            id: "clip-sample-1",
            trackId: "video-1",
            type: "video",
            name: "Shorts Video.mp4",
            startTime: 0,
            duration: 8,
            left: 0,
            width: 27,
            color: "bg-cyan-400/25",
          },
          {
            id: "clip-sample-2",
            trackId: "text-1",
            type: "text",
            name: "구독과 좋아요!",
            startTime: 3,
            duration: 7,
            left: 10,
            width: 23,
            color: "bg-fuchsia-400/25",
          }
        ]
      : [
          {
            id: "clip-sample-3",
            trackId: "video-1",
            type: "video",
            name: "Product Intro.mp4",
            startTime: 0,
            duration: 15,
            left: 0,
            width: 50,
            color: "bg-cyan-400/25",
          },
          {
            id: "clip-sample-4",
            trackId: "audio-1",
            type: "audio",
            name: "Calm Ambient Music.mp3",
            startTime: 0,
            duration: 25,
            left: 0,
            width: 83,
            color: "bg-emerald-400/25",
          }
        ];

    const sampleJson = JSON.stringify({
      version: "creaibox-video-editor-v3",
      projectTitle: project.title,
      activeTab: "media",
      clips: mockClips,
      canvasRatio: project.ratio,
      canvasZoom: 100,
      exportResolution: "1080p",
      exportFps: 30,
      exportQuality: "standard"
    });

    try {
      importProjectJson(sampleJson);
    } catch (e) {
      window.alert("프로젝트를 로드하지 못했습니다.");
    }
  };

  // Stats calculation
  const videoClips = clips.filter((c) => c.type === "video");
  const audioClips = clips.filter((c) => c.type === "audio");
  const imageClips = clips.filter((c) => c.type === "image");
  const textClips = clips.filter((c) => c.type === "text" || c.type === "subtitle");

  return (
    <div className="flex h-full flex-col bg-transparent text-zinc-300 select-none">
      {/* Title */}
      <div className="flex h-12 shrink-0 items-center border-b border-white/5 px-4 bg-[#202026]">
        <Briefcase size={15} className="mr-2 text-cyan-400" />
        <span className="text-xs font-black uppercase tracking-wider text-white">
          Project Browser
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Rename Editor */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            프로젝트 이름
          </span>
          <input
            value={projectTitle}
            onChange={(event) => setProjectTitle(event.target.value)}
            className="h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-xs font-black text-white outline-none focus:border-cyan-400 focus:bg-black/20"
            placeholder="Untitled Project"
          />
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1.5">
          <Search size={13} className="text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="프로젝트 검색..."
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        {/* Directory Tree */}
        <div className="space-y-2 text-xs">
          {/* Node 1: Projects list */}
          <div className="space-y-1">
            <button
              onClick={() => toggleFolder("projects")}
              className="flex w-full items-center gap-1.5 py-1 text-left font-bold text-white hover:text-cyan-300"
            >
              {openFolders.projects ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Database size={13} className="text-amber-400" />
              <span>프로젝트 목록 ({projects.length})</span>
            </button>

            {openFolders.projects && (
              <div className="pl-4 space-y-1 border-l border-white/5 ml-1.5">
                {filteredProjects.map((project) => {
                  const isActive = projectTitle === project.title;
                  return (
                    <div
                      key={project.id}
                      className={`group flex items-center justify-between px-2 py-1.5 hover:bg-white/5 hover:text-white cursor-pointer ${
                        isActive ? "bg-cyan-500/10 text-cyan-200 border-l border-cyan-400" : ""
                      }`}
                    >
                      <div
                        onClick={() => handleLoadProject(project)}
                        className="flex-1 truncate font-medium flex items-center gap-1.5"
                      >
                        <FolderOpen size={12} className="text-zinc-500 shrink-0" />
                        <span className="truncate">{project.title}</span>
                      </div>

                      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-0.5 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Node 2: Smart Library */}
          <div className="space-y-1">
            <button
              onClick={() => toggleFolder("smartLibrary")}
              className="flex w-full items-center gap-1.5 py-1 text-left font-bold text-white hover:text-cyan-300"
            >
              {openFolders.smartLibrary ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Layers size={13} className="text-cyan-400" />
              <span>에셋 라이브러리</span>
            </button>

            {openFolders.smartLibrary && (
              <div className="pl-4 space-y-1 border-l border-white/5 ml-1.5 text-zinc-400">
                <TreeLeaf icon={Film} label="비디오 클립" count={videoClips.length} />
                <TreeLeaf icon={Music} label="오디오 클립" count={audioClips.length} />
                <TreeLeaf icon={ImageIcon} label="이미지 클립" count={imageClips.length} />
                <TreeLeaf icon={Type} label="텍스트/자막" count={textClips.length} />
              </div>
            )}
          </div>

          {/* Node 3: Database & Backup Actions */}
          <div className="space-y-1">
            <button
              onClick={() => toggleFolder("backup")}
              className="flex w-full items-center gap-1.5 py-1 text-left font-bold text-white hover:text-cyan-300"
            >
              {openFolders.backup ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Settings size={13} className="text-purple-400" />
              <span>백업 및 도구</span>
            </button>

            {openFolders.backup && (
              <div className="pl-4 space-y-1 border-l border-white/5 ml-1.5 text-zinc-400">
                <div
                  onClick={handleMockSaveMetadata}
                  className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 hover:text-white cursor-pointer"
                >
                  <Save size={12} className="text-emerald-400 shrink-0" />
                  <span>{saveStatus === "saved" ? "저장 완료!" : "DB 메타 저장"}</span>
                </div>

                <div
                  onClick={handleDownloadProject}
                  className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 hover:text-white cursor-pointer"
                >
                  <Download size={12} className="text-cyan-400 shrink-0" />
                  <span>JSON 내보내기</span>
                </div>

                <label className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 hover:text-white cursor-pointer">
                  <Upload size={12} className="text-zinc-400 shrink-0" />
                  <span>JSON 불러오기</span>
                  <input
                    type="file"
                    accept="application/json,.json,.creaivideo"
                    className="hidden"
                    onChange={handleImportProject}
                  />
                </label>

                <div
                  onClick={handleNewProject}
                  className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 hover:text-white cursor-pointer text-red-400 hover:text-red-300"
                >
                  <Plus size={12} className="shrink-0" />
                  <span>새 프로젝트 초기화</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-8 shrink-0 items-center justify-between border-t border-white/5 bg-[#151519] px-3 text-[10px] font-bold text-zinc-500">
        <span>소스 {mediaItems.length}</span>
        <span>클립 {clips.length}</span>
        <span>{totalDuration}s</span>
        <span>{canvasRatio}</span>
      </div>
    </div>
  );
}

function TreeLeaf({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 hover:bg-white/5 hover:text-white">
      <div className="flex items-center gap-1.5 truncate">
        <Icon size={12} className="text-zinc-500 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <span className="text-[10px] font-bold text-zinc-600 bg-black/40 px-1.5 py-0.5 shrink-0 rounded-md border border-white/5">
        {count}
      </span>
    </div>
  );
}

function safeFileName(value: string) {
  return (value || "creaibox-video-project")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
