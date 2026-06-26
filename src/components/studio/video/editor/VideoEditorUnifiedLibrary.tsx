"use client";

import { useState, useEffect } from "react";
import {
  FolderOpen,
  FolderPlus,
  Waves,
  Type,
  Settings,
  Briefcase,
  Upload,
  Sparkles,
  Film,
  Music,
  Library,
  Database,
  Captions,
  Maximize2,
  Palette,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit2,
  Save,
  Download,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

import { useVideoEditor, type CanvasRatio, type VideoEditorClip, type VideoEditorMediaItem } from "./VideoEditorContext";
import type { VideoEditorTab, TimelineTrack } from "./types";
import { DEFAULT_TIMELINE_TRACKS } from "./constants";
import VideoEditorMediaLibrary from "./VideoEditorMediaLibrary";
import VideoEditorStockPanel from "./VideoEditorStockPanel";
import VideoEditorVisualizerPanel from "./VideoEditorVisualizerPanel";
import VideoEditorAddTextPanel from "./VideoEditorAddTextPanel";

// Top tabs configuration (FCP Style: Project tab added first)
const TOP_TABS = [
  { id: "project", label: "프로젝트", icon: Briefcase },
  { id: "media", label: "미디어", icon: FolderOpen },
  { id: "visualizer", label: "비주얼라이저", icon: Waves },
  { id: "text", label: "텍스트/자막", icon: Type },
  { id: "settings", label: "설정", icon: Settings },
] as const;

// Sub-categories list under each top tab
const SUB_CATEGORIES = {
  project: [], // Managed by ProjectFolderTree in Column 1
  media: [
    { id: "uploads", label: "내 미디어 (Uploads)", icon: Upload },
    { id: "free-assets", label: "무료 공유 에셋", icon: Library },
    { id: "creaibox-content", label: "크리에이박스 콘텐츠", icon: FolderOpen },
    { id: "image-content", label: "이미지 콘텐츠", icon: Sparkles },
    { id: "music", label: "생성 음악 & 오디오", icon: Music },
  ],
  visualizer: [
    { id: "spectrum", label: "오디오 스펙트럼", icon: Waves },
    { id: "effects", label: "음악 반응형 효과", icon: Sparkles },
  ],
  text: [
    { id: "text-add", label: "텍스트 추가", icon: Type },
    { id: "subtitle-add", label: "자막 추가", icon: Captions },
  ],
  settings: [
    { id: "ratio", label: "화면 비율", icon: Maximize2 },
    { id: "bg-color", label: "배경 설정", icon: Palette },
  ],
} as const;

type EventItem = {
  id: string;
  name: string;
  libraryName: string;
};

type ProjectItem = {
  id: string;
  title: string;
  ratio: CanvasRatio;
  duration: number;
  updatedAt: string;
  assetCount: number;
  eventId: string; // References EventItem.id
  clips?: VideoEditorClip[];
  tracks?: TimelineTrack[];
};

const initialLibraries: string[] = ["YouTube Shorts", "제품 홍보", "기타 프로젝트"];

const initialEvents: EventItem[] = [
  { id: "event-1", name: "YouTube Shorts 테스트 이벤트", libraryName: "YouTube Shorts" },
  { id: "event-2", name: "제품 소개 영상 이벤트", libraryName: "제품 홍보" },
  { id: "event-3", name: "기타 테스트 이벤트", libraryName: "기타 프로젝트" },
];

const initialProjects: ProjectItem[] = [
  {
    id: "project-1",
    title: "YouTube Shorts 테스트",
    ratio: "9:16",
    duration: 15,
    updatedAt: "방금 전",
    assetCount: 2,
    eventId: "event-1",
  },
  {
    id: "project-2",
    title: "제품 소개 영상",
    ratio: "16:9",
    duration: 25,
    updatedAt: "오늘",
    assetCount: 2,
    eventId: "event-2",
  },
];

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return fallback;
  }
}

function getDefaultCategory(tab: VideoEditorTab) {
  if (tab === "project") return "details";
  if (tab === "media") return "uploads";
  if (tab === "visualizer") return "spectrum";
  if (tab === "text" || tab === "subtitle") return "text-add";
  if (tab === "settings") return "ratio";
  return "uploads";
}

interface VideoEditorUnifiedLibraryProps {
  projectPanelWidth: number;
  mediaPanelWidth: number;
  onProjectPanelResize: (width: number) => void;
}

export default function VideoEditorUnifiedLibrary({
  projectPanelWidth,
  mediaPanelWidth: _mediaPanelWidth,
  onProjectPanelResize,
}: VideoEditorUnifiedLibraryProps) {
  const {
    activeTab,
    setActiveTab,
    mediaItems,
    clips,
    tracks,
    selectedClipId,
    projectTitle,
    setProjectTitle,
    setTracks,
    setClips,
    removeMediaItem,
    addClipFromMedia,
    selectedMediaId,
    selectMedia,
    setIsClearCacheOpen,
  } = useVideoEditor();

  const [libraries, setLibraries] = useState<string[]>(initialLibraries);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    setLibraries(readStoredValue("creaibox-video-editor-libraries", initialLibraries));
    setEvents(readStoredValue("creaibox-video-editor-events", initialEvents));
    setProjects(readStoredValue("creaibox-video-editor-projects", initialProjects));
    setIsLoaded(true);
  }, []);

  // Save libraries to localStorage when they change, only after loading is complete
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("creaibox-video-editor-libraries", JSON.stringify(libraries));
  }, [libraries, isLoaded]);

  // Save events to localStorage when they change, only after loading is complete
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("creaibox-video-editor-events", JSON.stringify(events));
  }, [events, isLoaded]);

  // Save projects to localStorage when they change, only after loading is complete
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("creaibox-video-editor-projects", JSON.stringify(projects));
  }, [projects, isLoaded]);

  // Sync active project's timeline state (clips and tracks) from context to projects list
  useEffect(() => {
    if (!projectTitle) return;
    const timeout = window.setTimeout(() => {
      setProjects((prev) => {
        const activeProj = prev.find((p) => p.title === projectTitle);
        if (!activeProj) return prev;

        // Prevent redundant renders if clips and tracks match
        if (activeProj.clips === clips && activeProj.tracks === tracks) {
          return prev;
        }
        return prev.map((p) => {
          if (p.title === projectTitle) {
            return {
              ...p,
              clips,
              tracks,
            };
          }
          return p;
        });
      });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [projectTitle, clips, tracks]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>("event-1");
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    getDefaultCategory(activeTab)
  );
  const [sidebarFilter, setSidebarFilter] = useState<"all" | "image" | "audio" | "video">("all");

  const [openLibraries, setOpenLibraries] = useState<Record<string, boolean>>({
    "YouTube Shorts": true,
    "제품 홍보": true,
    "기타 프로젝트": true,
  });

  // Inline rename states for Libraries
  const [editingLibrary, setEditingLibrary] = useState<string | null>(null);
  const [editLibraryTitle, setEditLibraryTitle] = useState<string>("");

  // Inline rename states for Events
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editEventTitle, setEditEventTitle] = useState<string>("");

  // Inline rename states for Projects
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const toggleLibrary = (libName: string) => {
    setOpenLibraries((prev) => ({ ...prev, [libName]: !prev[libName] }));
  };

  const handleAddLibrary = () => {
    let newName = "새 보관함";
    let index = 1;
    while (libraries.includes(newName)) {
      newName = `새 보관함 ${index}`;
      index++;
    }
    setLibraries((prev) => [...prev, newName]);
    setOpenLibraries((prev) => ({ ...prev, [newName]: true }));
    setEditingLibrary(newName);
    setEditLibraryTitle(newName);
  };

  const handleStartRenameLibrary = (libName: string) => {
    setEditingLibrary(libName);
    setEditLibraryTitle(libName);
  };

  const handleSaveRenameLibrary = (oldName: string) => {
    const trimmed = editLibraryTitle.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingLibrary(null);
      return;
    }
    if (libraries.includes(trimmed)) {
      alert("이미 존재하는 보관함 이름입니다.");
      setEditingLibrary(null);
      return;
    }
    setLibraries((prev) => prev.map((l) => (l === oldName ? trimmed : l)));
    setEvents((prev) =>
      prev.map((e) => (e.libraryName === oldName ? { ...e, libraryName: trimmed } : e))
    );
    setOpenLibraries((prev) => {
      const next = { ...prev };
      if (oldName in next) {
        next[trimmed] = next[oldName];
        delete next[oldName];
      }
      return next;
    });
    setEditingLibrary(null);
  };

  const handleDeleteLibrary = (name: string) => {
    if (window.confirm(`"${name}" 보관함과 해당 보관함 내의 모든 이벤트 및 프로젝트를 삭제하시겠습니까?`)) {
      setLibraries((prev) => prev.filter((l) => l !== name));
      const eventsToDelete = events.filter((e) => e.libraryName === name).map((e) => e.id);
      setEvents((prev) => prev.filter((e) => e.libraryName !== name));
      setProjects((prev) => prev.filter((p) => !eventsToDelete.includes(p.eventId)));
      if (selectedEventId && eventsToDelete.includes(selectedEventId)) {
        setSelectedEventId(null);
      }
    }
  };

  const handleAddEvent = (libraryName: string) => {
    const id = `event-${Date.now()}`;
    let newName = "새 이벤트";
    let index = 1;
    while (events.some((e) => e.name === newName)) {
      newName = `새 이벤트 ${index}`;
      index++;
    }
    const newEvent: EventItem = { id, name: newName, libraryName };
    setEvents((prev) => [...prev, newEvent]);
    setOpenLibraries((prev) => ({ ...prev, [libraryName]: true }));
    setSelectedEventId(id);
    setEditingEventId(id);
    setEditEventTitle(newName);
  };

  const handleStartRenameEvent = (id: string, name: string) => {
    setEditingEventId(id);
    setEditEventTitle(name);
  };

  const handleSaveRenameEvent = (id: string) => {
    const trimmed = editEventTitle.trim();
    if (!trimmed) {
      setEditingEventId(null);
      return;
    }
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, name: trimmed } : e))
    );
    setEditingEventId(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    const eventName = events.find((e) => e.id === eventId)?.name || "이벤트";
    if (window.confirm(`"${eventName}" 이벤트와 해당 이벤트 내의 모든 프로젝트를 삭제하시겠습니까?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setProjects((prev) => prev.filter((p) => p.eventId !== eventId));
      if (selectedEventId === eventId) {
        setSelectedEventId(null);
      }
    }
  };

  const handleAddProject = (eventId: string) => {
    const id = `project-${Date.now()}`;
    let newTitle = "새 프로젝트";
    let index = 1;
    while (projects.some((p) => p.title === newTitle)) {
      newTitle = `새 프로젝트 ${index}`;
      index++;
    }

    const newProject: ProjectItem = {
      id,
      title: newTitle,
      ratio: "16:9",
      duration: 15,
      updatedAt: "방금 전",
      assetCount: 0,
      eventId,
      clips: [],
      tracks: DEFAULT_TIMELINE_TRACKS,
    };

    setProjects((prev) => {
      const savedPrev = prev.map((p) => {
        if (p.title === projectTitle) {
          return { ...p, clips: clips, tracks: tracks };
        }
        return p;
      });
      return [...savedPrev, newProject];
    });

    setProjectTitle(newTitle);
    setClips([]);
    setTracks(DEFAULT_TIMELINE_TRACKS);
    setEditingProjectId(id);
    setEditTitle(newTitle);
  };

  // Sync category when activeTab changes
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setActiveCategory(getDefaultCategory(activeTab));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [activeTab]);

  const currentTab = activeTab;

  const currentCategories =
    SUB_CATEGORIES[currentTab as keyof typeof SUB_CATEGORIES] || [];

  const handleTabClick = (tabId: typeof TOP_TABS[number]["id"]) => {
    setActiveTab(tabId as VideoEditorTab);
  };

  const handleStartRename = (id: string, title: string) => {
    setEditingProjectId(id);
    setEditTitle(title);
  };

  const handleSaveRename = (id: string) => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditingProjectId(null);
      return;
    }
    const projectBeingRenamed = projects.find((project) => project.id === id);
    const shouldSyncActiveProjectTitle = projectBeingRenamed?.title === projectTitle;

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: trimmedTitle } : p))
    );
    if (shouldSyncActiveProjectTitle) {
      setProjectTitle(trimmedTitle);
    }
    setEditingProjectId(null);
  };

  const handleSelectProject = (project: ProjectItem) => {
    if (project.title === projectTitle) {
      return;
    }

    // 1. Save current context edits into the active project title matching current state title
    setProjects((prev) =>
      prev.map((p) => {
        if (p.title === projectTitle) {
          return {
            ...p,
            clips: clips,
            tracks: tracks,
          };
        }
        return p;
      })
    );

    // 2. Set new active project title
    setProjectTitle(project.title);

    // 3. Load selected project's clips & tracks
    if (project.clips && project.tracks) {
      setClips(project.clips);
      setTracks(project.tracks);
    } else {
      setClips([]);
      setTracks(DEFAULT_TIMELINE_TRACKS);
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Resize logic for inner separator
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = projectPanelWidth;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      onProjectPanelResize(Math.max(160, Math.min(420, startWidth + deltaX)));
    };

    const handlePointerUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#1b1b1f]">
      {/* CapCut/FCP Unified Header Topbar */}
      <div className="flex h-12 shrink-0 items-center justify-start gap-1 border-b border-white/5 bg-[#202026] px-3">
        {TOP_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-black transition outline-none ${
                isActive
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Body Split Panel */}
      <div className="flex flex-1 min-h-0">
        {/* Column 1: Folder Tree / Categories */}
        <div
          className={`shrink-0 flex flex-col min-h-0 border-r border-white/5 bg-[#18181c] p-2 ${
            currentTab === "project" ? "overflow-y-auto" : ""
          }`}
          style={{ width: projectPanelWidth }}
        >
          {currentTab === "project" ? (
            <ProjectFolderTree
              libraries={libraries}
              openLibraries={openLibraries}
              onToggleLibrary={toggleLibrary}
              onAddLibrary={handleAddLibrary}
              editingLibrary={editingLibrary}
              editLibraryTitle={editLibraryTitle}
              onStartRenameLibrary={handleStartRenameLibrary}
              onChangeEditLibraryTitle={setEditLibraryTitle}
              onSaveRenameLibrary={handleSaveRenameLibrary}
              onCancelRenameLibrary={() => setEditingLibrary(null)}
              onDeleteLibrary={handleDeleteLibrary}
              events={events}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              onAddEvent={handleAddEvent}
              editingEventId={editingEventId}
              editEventTitle={editEventTitle}
              onStartRenameEvent={handleStartRenameEvent}
              onChangeEditEventTitle={setEditEventTitle}
              onSaveRenameEvent={handleSaveRenameEvent}
              onCancelRenameEvent={() => setEditingEventId(null)}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <>
              <div className="shrink-0 space-y-1">
                <span className="px-2 pb-2 block text-[9px] font-bold tracking-wider text-zinc-600 uppercase">
                  구분 항목
                </span>
                {currentCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-bold transition outline-none ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-200 border-l-2 border-cyan-400 font-black"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-cyan-400" : "text-zinc-500"} />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}

                {currentTab === "media" && (
                  <button
                    type="button"
                    onClick={() => setIsClearCacheOpen(true)}
                    className="flex w-full items-center gap-2.5 rounded-md border border-red-500/20 bg-red-950/10 px-3 py-2 text-left text-xs font-bold text-red-300 hover:border-red-500/45 hover:bg-red-950/20 hover:text-red-200 transition outline-none mt-2 shadow-[0_0_8px_rgba(239,68,68,0.05)]"
                    title="브라우저 캐시 용량 비우기"
                  >
                    <Database size={14} className="text-red-400 shrink-0" />
                    <span className="truncate font-black">IndexedDB 용량 정리</span>
                  </button>
                )}
              </div>

              {currentTab === "media" && (
                <>
                  <div className="my-3 border-t border-white/5 mx-1 shrink-0" />
                  <div className="flex-1 min-h-0 flex flex-col space-y-2">
                    <span className="px-2 pb-1 block text-[9px] font-bold tracking-wider text-zinc-600 uppercase shrink-0">
                      가져온 미디어 ({mediaItems.length})
                    </span>

                    {/* Sidebar Filter Tabs */}
                    <div className="grid grid-cols-4 gap-1 px-1 mt-1 mb-2 shrink-0">
                      {(["all", "image", "audio", "video"] as const).map((type) => {
                        const labels = {
                          all: "전체",
                          image: "이미지",
                          audio: "오디오",
                          video: "비디오",
                        };
                        const active = sidebarFilter === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSidebarFilter(type)}
                            className={`rounded py-1 text-center text-[9px] font-black transition-all outline-none ${
                              active
                                ? "bg-cyan-400/10 text-cyan-200 border border-cyan-400/30"
                                : "bg-white/[0.02] text-zinc-500 hover:text-zinc-300 border border-transparent"
                            }`}
                          >
                            {labels[type]}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                      {mediaItems.filter((item) => sidebarFilter === "all" || item.type === sidebarFilter).length === 0 ? (
                        <div className="py-6 text-center text-[10px] text-zinc-600 italic">
                          {sidebarFilter === "all" ? "가져온 미디어가 없습니다." : "해당 타입의 미디어가 없습니다."}
                        </div>
                      ) : (
                        mediaItems
                          .filter((item) => sidebarFilter === "all" || item.type === sidebarFilter)
                          .map((item) => (
                            <SidebarMediaItemRow key={item.id} item={item} />
                          ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Resizable separator between Column 1 and Column 2 */}
        <div
          role="separator"
          aria-label="폴더 영역 너비 조절"
          aria-orientation="vertical"
          onPointerDown={handlePointerDown}
          className="group relative w-1 shrink-0 cursor-col-resize bg-black"
        >
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/0 transition group-hover:bg-cyan-300/70" />
        </div>

        {/* Column 2: Content display */}
        <div className="flex-1 min-h-0 flex flex-col p-4 overflow-y-auto bg-transparent">
          <div className={currentTab === "project" ? "block flex-1 min-h-0 flex flex-col" : "hidden"}>
            <ProjectDetailContent
              selectedEvent={events.find((e) => e.id === selectedEventId) || null}
              projects={projects}
              activeProjectTitle={projectTitle}
              editingProjectId={editingProjectId}
              editTitle={editTitle}
              onStartRenameProject={handleStartRename}
              onChangeEditTitle={setEditTitle}
              onSaveRenameProject={handleSaveRename}
              onCancelRenameProject={() => setEditingProjectId(null)}
              onDeleteProject={handleDeleteProject}
              onAddProject={handleAddProject}
              onSelectProject={handleSelectProject}
            />
          </div>

          <div className={currentTab === "media" ? "block flex-1 min-h-0 flex flex-col" : "hidden"}>
            <div className={["uploads", "free-assets", "creaibox-content", "image-content", "music"].includes(activeCategory) ? "block flex-1 min-h-0 flex flex-col" : "hidden"}>
              <VideoEditorMediaLibrary forcedTab={activeCategory as any} />
            </div>
          </div>

          <div className={currentTab === "visualizer" ? "block flex-1 min-h-0 flex flex-col" : "hidden"}>
            <VideoEditorVisualizerPanel />
          </div>

          <div className={currentTab === "text" ? "block flex-1 min-h-0 flex flex-col" : "hidden"}>
            <VideoEditorAddTextPanel />
          </div>

          <div className={currentTab === "settings" ? "block flex-1 min-h-0 flex flex-col" : "hidden"}>
            <SettingsContent />
          </div>
        </div>
      </div>

      {/* Unified Status Footer */}
      <div className="flex h-8 shrink-0 items-center justify-between border-t border-white/5 bg-[#151519] px-3 text-[10px] font-bold text-zinc-500">
        <span className="capitalize text-[10px]">
          {TOP_TABS.find((t) => t.id === currentTab)?.label}
          {currentTab !== "project" && ` · ${currentCategories.find((c) => c.id === activeCategory)?.label || ""}`}
        </span>
        <div className="flex gap-3 text-[10px]">
          <span>소스 {mediaItems.length}</span>
          <span>클립 {clips.length}</span>
          <span>{selectedClipId ? "선택됨" : "대기"}</span>
        </div>
      </div>
    </div>
  );
}

// FCP-Style Collapsible Folder Tree for Projects (Column 1)
interface ProjectFolderTreeProps {
  libraries: string[];
  openLibraries: Record<string, boolean>;
  onToggleLibrary: (name: string) => void;
  onAddLibrary: () => void;
  editingLibrary: string | null;
  editLibraryTitle: string;
  onStartRenameLibrary: (name: string) => void;
  onChangeEditLibraryTitle: (title: string) => void;
  onSaveRenameLibrary: (oldName: string) => void;
  onCancelRenameLibrary: () => void;
  onDeleteLibrary: (name: string) => void;

  events: EventItem[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
  onAddEvent: (libraryName: string) => void;
  editingEventId: string | null;
  editEventTitle: string;
  onStartRenameEvent: (id: string, name: string) => void;
  onChangeEditEventTitle: (title: string) => void;
  onSaveRenameEvent: (id: string) => void;
  onCancelRenameEvent: () => void;
  onDeleteEvent: (id: string) => void;
}

function ProjectFolderTree({
  libraries,
  openLibraries,
  onToggleLibrary,
  onAddLibrary,
  editingLibrary,
  editLibraryTitle,
  onStartRenameLibrary,
  onChangeEditLibraryTitle,
  onSaveRenameLibrary,
  onCancelRenameLibrary,
  onDeleteLibrary,
  events,
  selectedEventId,
  onSelectEvent,
  onAddEvent,
  editingEventId,
  editEventTitle,
  onStartRenameEvent,
  onChangeEditEventTitle,
  onSaveRenameEvent,
  onCancelRenameEvent,
  onDeleteEvent,
}: ProjectFolderTreeProps) {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between px-2 pb-1">
        <span className="text-[9px] font-bold tracking-wider text-zinc-600 uppercase">
          라이브러리 보관함
        </span>
        <button
          type="button"
          onClick={onAddLibrary}
          className="rounded p-1 text-zinc-500 hover:bg-white/5 hover:text-white transition"
          title="새 보관함 추가"
        >
          <FolderPlus size={13} />
        </button>
      </div>

      {libraries.map((lib) => {
        const libEvents = events.filter((e) => e.libraryName === lib);
        const isOpen = openLibraries[lib];
        const isEditingLib = editingLibrary === lib;

        return (
          <div key={lib} className="space-y-1">
            {/* Library Header */}
            <div className="group flex items-center justify-between py-1 hover:bg-white/5 rounded-md px-1 min-h-[28px]">
              {isEditingLib ? (
                <input
                  type="text"
                  autoFocus
                  value={editLibraryTitle}
                  onChange={(e) => onChangeEditLibraryTitle(e.target.value)}
                  onBlur={() => onSaveRenameLibrary(lib)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSaveRenameLibrary(lib);
                    } else if (e.key === "Escape") {
                      onCancelRenameLibrary();
                    }
                  }}
                  className="bg-black/50 border border-cyan-400 text-white text-xs px-1 py-0.5 rounded outline-none w-full ml-5"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <div
                    onClick={() => onToggleLibrary(lib)}
                    onDoubleClick={() => onStartRenameLibrary(lib)}
                    className="flex flex-1 items-center gap-1.5 text-left font-black text-white hover:text-cyan-300 cursor-pointer select-none truncate"
                    title="더블클릭하여 이름 수정"
                  >
                    {isOpen ? <ChevronDown size={14} className="text-zinc-500 shrink-0" /> : <ChevronRight size={14} className="text-zinc-500 shrink-0" />}
                    <Database size={13} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{lib} ({libEvents.length})</span>
                  </div>

                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddEvent(lib);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition"
                      title="이벤트 추가"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLibrary(lib);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-white/5 transition"
                      title="보관함 삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Events list */}
            {isOpen && (
              <div className="pl-4 space-y-1 border-l border-white/5 ml-1.5">
                {libEvents.length === 0 ? (
                  <div className="py-1.5 pl-2 text-zinc-600 italic">이벤트 없음</div>
                ) : (
                  libEvents.map((evt) => {
                    const isActive = selectedEventId === evt.id;
                    const isEditingEvt = editingEventId === evt.id;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => onSelectEvent(evt.id)}
                        className={`group/evt flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-white/5 hover:text-white cursor-pointer ${
                          isActive ? "bg-cyan-500/10 text-cyan-200 border-l border-cyan-400" : ""
                        }`}
                      >
                        {isEditingEvt ? (
                          <input
                            type="text"
                            autoFocus
                            value={editEventTitle}
                            onChange={(e) => onChangeEditEventTitle(e.target.value)}
                            onBlur={() => onSaveRenameEvent(evt.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                onSaveRenameEvent(evt.id);
                              } else if (e.key === "Escape") {
                                onCancelRenameEvent();
                              }
                            }}
                            className="bg-black/50 border border-cyan-400 text-white text-xs px-1 py-0.5 rounded outline-none w-full"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <div
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onStartRenameEvent(evt.id, evt.name);
                              }}
                              className="flex-1 truncate font-medium flex items-center gap-1.5 select-none"
                              title="더블클릭하여 이름 수정"
                            >
                              <FolderOpen size={12} className="text-amber-400 shrink-0" />
                              <span className="truncate">{evt.name}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteEvent(evt.id);
                              }}
                              className="hidden group-hover/evt:flex p-0.5 text-zinc-500 hover:text-red-400"
                              title="삭제"
                            >
                              <Trash2 size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Inner content component for Project Details (Column 2)
interface ProjectDetailContentProps {
  selectedEvent: EventItem | null;
  projects: ProjectItem[];
  activeProjectTitle: string;
  editingProjectId: string | null;
  editTitle: string;
  onStartRenameProject: (id: string, title: string) => void;
  onChangeEditTitle: (title: string) => void;
  onSaveRenameProject: (id: string) => void;
  onCancelRenameProject: () => void;
  onDeleteProject: (id: string) => void;
  onAddProject: (eventId: string) => void;
  onSelectProject: (project: ProjectItem) => void;
}

function ProjectDetailContent({
  selectedEvent,
  projects,
  activeProjectTitle,
  editingProjectId,
  editTitle,
  onStartRenameProject,
  onChangeEditTitle,
  onSaveRenameProject,
  onCancelRenameProject,
  onDeleteProject,
  onAddProject,
  onSelectProject,
}: ProjectDetailContentProps) {
  const {
    projectTitle,
    clips,
    mediaItems,
    canvasRatio,
    totalDuration,
    exportProjectJson,
    importProjectJson,
    clickedPreviewMediaItem,
    clickedPreviewMediaTime,
    previewMediaItem,
    previewMediaTime,
    setClickedPreviewMedia,
    setPreviewMedia,
  } = useVideoEditor();

  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [showTools, setShowTools] = useState<boolean>(false);
  const [hoveredMediaId, setHoveredMediaId] = useState<string | null>(null);
  const [hoveredMediaX, setHoveredMediaX] = useState<number>(0);

  const videoClips = clips.filter((c) => c.type === "video");
  const audioClips = clips.filter((c) => c.type === "audio");
  const imageClips = clips.filter((c) => c.type === "image");
  const textClips = clips.filter((c) => c.type === "text" || c.type === "subtitle");

  const handleMockSaveMetadata = () => {
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleDownloadProject = () => {
    const jsonStr = exportProjectJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFileName(projectTitle)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          importProjectJson(text);
        } catch (err) {
          alert("유효하지 않은 프로젝트 백업 파일입니다.");
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    }
  };

  const handleNewProject = () => {
    if (window.confirm("현재 편집중인 프로젝트가 유실됩니다. 새로 초기화하시겠습니까?")) {
      window.location.reload();
    }
  };

  if (!selectedEvent) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center text-center p-6 border border-white/5 bg-black/10 rounded-md">
        <FolderOpen size={40} className="text-zinc-600 mb-2" />
        <p className="text-sm font-bold text-zinc-400">보관함에서 이벤트를 선택해 주세요.</p>
        <p className="text-xs text-zinc-500 mt-1">프로젝트와 미디어 파일을 보려면 좌측의 이벤트를 눌러주세요.</p>
      </div>
    );
  }

  const eventProjects = projects.filter((p) => p.eventId === selectedEvent.id);

  return (
    <div className="space-y-6">
      {/* Event Header Detail */}
      <div className="flex items-center justify-start border-b border-white/5 pb-3">
        <button
          type="button"
          onClick={() => onAddProject(selectedEvent.id)}
          className="flex items-center gap-1.5 rounded-md bg-cyan-500 px-3 py-1.5 text-xs font-black text-black hover:bg-cyan-400 transition"
        >
          <Plus size={14} />
          프로젝트 추가
        </button>
      </div>

      {/* Projects List Grid */}
      <div className="space-y-3">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          프로젝트 리스트 ({eventProjects.length})
        </div>

        {eventProjects.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/10 bg-black/10 p-6 text-center text-zinc-500 text-xs">
            등록된 프로젝트가 없습니다. 우측 상단의 &apos;프로젝트 추가&apos; 버튼을 눌러 새 프로젝트를 생성하세요.
          </div>
        ) : (
          <div className="space-y-2">
            {eventProjects.map((project) => {
              const isEditing = editingProjectId === project.id;
              const isActive = activeProjectTitle === project.title;

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className={`group relative flex items-center justify-between rounded-md border p-3 cursor-pointer transition min-h-[44px] ${
                    isActive
                      ? "border-cyan-400 bg-cyan-400/5 hover:border-cyan-300"
                      : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Film size={16} className={`shrink-0 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
                    {isEditing ? (
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => onChangeEditTitle(e.target.value)}
                        onBlur={() => onSaveRenameProject(project.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onSaveRenameProject(project.id);
                          } else if (e.key === "Escape") {
                            onCancelRenameProject();
                          }
                        }}
                        className="bg-black/80 border border-cyan-400 text-white text-xs px-1.5 py-0.5 rounded outline-none w-[200px]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onStartRenameProject(project.id, project.title);
                        }}
                        className="font-bold text-xs text-white truncate max-w-[280px]"
                        title="더블클릭하여 이름 수정"
                      >
                        {project.title}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isEditing && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartRenameProject(project.id, project.title);
                          }}
                          className="p-1 text-zinc-500 hover:text-cyan-400 transition rounded hover:bg-white/5"
                          title="이름 수정"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 transition rounded hover:bg-white/5"
                          title="삭제"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Media Clips in Event */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          이벤트 미디어 소스 ({mediaItems.length})
        </div>

        {mediaItems.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/10 bg-black/10 p-6 text-center text-zinc-500 text-xs">
            가져온 미디어 파일이 없습니다. 상단 &apos;미디어&apos; 탭에서 파일을 추가해 주세요.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 items-start">
            {mediaItems.map((item) => {
              const isSelected = clickedPreviewMediaItem?.id === item.id;
              const isHovered = hoveredMediaId === item.id;
              const isAudio = item.type === "audio";
              const isOffline = !item.url;

              return (
                <div
                  key={item.id}
                  draggable={!isOffline}
                  onDragStart={(event) => {
                    if (isOffline) {
                      event.preventDefault();
                      return;
                    }
                    event.dataTransfer.setData("media-id", item.id);
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                  onPointerMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, x / rect.width));
                    setHoveredMediaId(item.id);
                    setHoveredMediaX(pct * 100);

                    const duration = item.duration || 5;
                    const scrubTime = pct * duration;
                    setPreviewMedia(item, scrubTime);
                  }}
                  onPointerLeave={() => {
                    setHoveredMediaId(null);
                    setHoveredMediaX(0);
                    setPreviewMedia(clickedPreviewMediaItem, clickedPreviewMediaTime);
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, x / rect.width));
                    const duration = item.duration || 5;
                    const scrubTime = pct * duration;
                    setClickedPreviewMedia(item, scrubTime);
                  }}
                  className={`group/item relative flex flex-col ${
                    item.width && item.height && item.height > item.width ? "aspect-[9/16]" : "aspect-video"
                  } rounded-md border overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${
                    isSelected
                      ? "border-yellow-500 ring-2 ring-yellow-500/50 shadow-[0_0_12px_rgba(234,179,8,0.3)] bg-yellow-950/20"
                      : "border-white/10 hover:border-white/30 bg-black/30"
                  }`}
                >
                  {isAudio ? (
                    // Audio Card
                    <div className="absolute inset-0 flex flex-col justify-between p-2 bg-gradient-to-br from-emerald-950/80 via-emerald-900/60 to-black/80 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <Music size={14} className="text-emerald-400" />
                        <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded uppercase tracking-wider">
                          Audio
                        </span>
                      </div>
                      
                      <div className="flex items-end gap-0.5 h-6 px-1 my-1">
                        {(item.waveform?.length
                          ? item.waveform.slice(0, 32)
                          : Array.from({ length: 16 }, () => 0.08)
                        ).map((value, idx) => {
                          const height = Math.max(10, value * 100);
                          return (
                            <div
                              key={idx}
                              className="flex-1 rounded-t bg-emerald-500/60"
                              style={{ height: `${height}%` }}
                            />
                          );
                        })}
                      </div>

                      <div className="text-[10px] font-bold text-emerald-200 truncate" title={item.name}>
                        {item.name}
                      </div>
                    </div>
                  ) : (
                    // Image or Video Card
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center overflow-hidden pointer-events-none">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.name}
                          className="h-full w-full object-cover pointer-events-none select-none"
                        />
                      ) : item.type === "video" ? (
                        <div className="flex flex-col items-center gap-1.5 text-zinc-500">
                          <Film size={24} />
                          <span className="text-[9px] font-medium text-zinc-600 uppercase">Video</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-zinc-500">
                          <ImageIcon size={24} />
                          <span className="text-[9px] font-medium text-zinc-600 uppercase">Image</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Red vertical playhead/skimmer line (FCP style) */}
                  {isHovered && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-20 shadow-[0_0_4px_rgba(239,68,68,0.8)]"
                      style={{ left: `${hoveredMediaX}%` }}
                    />
                  )}

                  {/* Small duration display only when hovering */}
                  {isHovered && (
                    <div className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 text-[8px] font-medium text-red-400 z-20 pointer-events-none border border-red-500/20">
                      {item.duration ? `${(hoveredMediaX / 100 * item.duration).toFixed(1)}s` : "0.0s"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Project Backup & Tools */}
      <div className="rounded-md border border-white/5 bg-[#151519]/50 p-4 space-y-4 pt-4 border-t">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            선택된 프로젝트 설정 및 백업
          </span>
          <span className="text-xs font-black text-cyan-400 mt-1 uppercase truncate">
            ({projectTitle})
          </span>
        </div>

        <div className="space-y-4 pt-2 border-t border-white/5">
          <div className="rounded-md border border-white/10 bg-black/30 p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">프로젝트 이름</div>
                <div className="text-xs font-black text-white mt-1 select-all">{projectTitle}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">화면 비율</div>
                <div className="text-xs font-bold text-zinc-300 mt-1">{canvasRatio}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">총 길이</div>
                <div className="text-xs font-bold text-zinc-300 mt-1">{totalDuration}s</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">타임라인 요약</div>
                <div className="text-xs font-bold text-zinc-300 mt-1">
                  비디오 {videoClips.length} · 오디오 {audioClips.length} · 텍스트 {textClips.length}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleMockSaveMetadata}
              className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-xs font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
            >
              <Save size={13} className="text-emerald-400" />
              {saveStatus === "saved" ? "저장 완료" : "DB 메타 저장"}
            </button>

            <button
              type="button"
              onClick={handleDownloadProject}
              className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-xs font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
            >
              <Download size={13} className="text-cyan-400" />
              JSON 백업 내보내기
            </button>

            <label className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-xs font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200 cursor-pointer text-center">
              <Upload size={13} className="text-zinc-400" />
              JSON 백업 불러오기
              <input
                type="file"
                accept="application/json,.json,.creaivideo"
                className="hidden"
                onChange={handleImportProject}
              />
            </label>

            <button
              type="button"
              onClick={handleNewProject}
              className="flex items-center justify-center gap-2 rounded-md border border-red-500/20 bg-red-950/10 px-3 py-2.5 text-xs font-bold text-red-300 hover:border-red-400 hover:text-red-200"
            >
              <Plus size={13} />
              프로젝트 초기화 (Reset)
            </button>
          </div>
        </div>
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
    <div className="flex items-center justify-between px-2 py-1 hover:bg-white/5 hover:text-white rounded-md">
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

// Inner content component for Settings
function SettingsContent() {
  const { setCanvasRatio } = useVideoEditor();

  return (
    <div className="space-y-4">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300">
          <Settings size={20} />
        </div>

        <div>
          <h3 className="font-black text-white">설정</h3>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            프로젝트 기본 비디오 비율 및 캠버스 설정을 관리합니다.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pb-1">
          화면 비디오 비율
        </div>
        <button
          type="button"
          onClick={() => setCanvasRatio("16:9")}
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        >
          화면 비율 16:9 (가로형 영상)
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={() => setCanvasRatio("9:16")}
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        >
          화면 비율 9:16 (숏폼 영상)
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={() => setCanvasRatio("1:1")}
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        >
          화면 비율 1:1 (정사각형 영상)
          <Plus size={15} />
        </button>
      </div>

      <div className="space-y-2 pt-2">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pb-1">
          캔버스 배경색
        </div>
        <button
          type="button"
          onClick={() => alert("현재 검은색 배경색이 적용되어 있습니다.")}
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        >
          배경 색상 (기본 검정)
          <Plus size={15} />
        </button>
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

function SidebarMediaItemRow({ item }: { item: VideoEditorMediaItem }) {
  const { selectedMediaId, selectMedia, addClipFromMedia, removeMediaItem } = useVideoEditor();
  const [isVertical, setIsVertical] = useState(false);

  const isActive = selectedMediaId === item.id;
  const isOffline = !item.url;

  useEffect(() => {
    if (item.width && item.height) {
      setIsVertical(item.height > item.width);
    }
  }, [item.width, item.height]);

  const thumbSizeClass = isVertical ? "w-7 h-10 mx-1.5" : "w-10 h-7";

  return (
    <div
      draggable={!isOffline}
      onDragStart={(event) => {
        if (isOffline) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData("media-id", item.id);
        event.dataTransfer.effectAllowed = "copy";
      }}
      onClick={() => selectMedia(item.id)}
      className={`group flex items-center gap-2 rounded-md border p-1.5 transition cursor-pointer select-none ${
        isActive
          ? "border-cyan-500 bg-cyan-500/10"
          : isOffline
            ? "border-red-500/30 bg-red-950/10 hover:border-red-500/50"
            : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      {/* Thumbnail */}
      {(() => {
        if (isOffline) {
          return (
            <div className="w-10 h-7 rounded bg-red-950/20 flex items-center justify-center text-red-400 shrink-0 border border-red-500/20">
              <Upload size={12} />
            </div>
          );
        }

        if (item.type === "image") {
          return (
            <img
              src={item.url}
              alt={item.name}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalHeight > img.naturalWidth) {
                  setIsVertical(true);
                }
              }}
              className={`${thumbSizeClass} rounded object-cover shrink-0 bg-black/40 border border-white/5`}
            />
          );
        }

        if (item.type === "video") {
          if (item.thumbnailUrl) {
            return (
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalHeight > img.naturalWidth) {
                    setIsVertical(true);
                  }
                }}
                className={`${thumbSizeClass} rounded object-cover shrink-0 bg-black/40 border border-white/5`}
              />
            );
          }
          return (
            <div className={`${thumbSizeClass} rounded bg-cyan-950/20 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/10`}>
              <Film size={12} />
            </div>
          );
        }

        // Audio
        return (
          <div className="w-10 h-7 rounded bg-emerald-950/20 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/10">
            <Music size={12} />
          </div>
        );
      })()}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] font-bold text-zinc-200 group-hover:text-white" title={item.name}>
          {item.name}
        </div>
        <div className="text-[9px] text-zinc-500 uppercase mt-0.5">
          {item.type}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addClipFromMedia(item);
          }}
          className="p-1 rounded text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition"
          title="타임라인에 추가"
        >
          <Plus size={13} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeMediaItem(item.id);
          }}
          className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-white/5 transition"
          title="삭제"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
