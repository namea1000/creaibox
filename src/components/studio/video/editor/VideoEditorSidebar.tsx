"use client";

import { useState, useRef } from "react";

import {
  Upload,
  Image as ImageIcon,
  Film,
  Music,
  Captions,
  Type,
  Sparkles,
  Settings,
  Plus,
  Trash2,
  Waves,
  Library,
  SlidersHorizontal,
} from "lucide-react";

import { VIDEO_EDITOR_SIDEBAR_MENUS } from "./constants";
import { useVideoEditor } from "./VideoEditorContext";
import type { VideoEditorTab } from "./types";
import VideoEditorVisualizerPanel from "./VideoEditorVisualizerPanel";
import VideoEditorMediaLibrary from "./VideoEditorMediaLibrary";
import VideoEditorTransitionPanel from "./VideoEditorTransitionPanel";
import VideoEditorEffectsPanel from "./VideoEditorEffectsPanel";
import VideoEditorTextStylePanel from "./VideoEditorTextStylePanel";
import VideoEditorAudioMixer from "./VideoEditorAudioMixer";
import VideoEditorMotionPanel from "./VideoEditorMotionPanel";
import VideoEditorProjectPanel from "./VideoEditorProjectPanel";

type AudioPanelTab = "library" | "visualizer" | "settings";

export default function VideoEditorSidebar() {
  const {
    activeTab,
    setActiveTab,
  } = useVideoEditor();

  // Redirect project tab to media since Column 1 is now the dedicated Project Browser
  const currentTab = activeTab === "project" ? "media" : activeTab;

  return (
    <aside className="h-full w-full flex flex-col bg-transparent">
      {/* CapCut Style Horizontal Tabs Header */}
      <div className="h-12 border-b border-white/5 bg-[#202026] px-2 flex gap-1 items-center overflow-x-auto shrink-0 scrollbar-none">
        {VIDEO_EDITOR_SIDEBAR_MENUS.map((menu) => {
          const Icon = menu.icon;
          const active = currentTab === menu.key;

          return (
            <button
              key={menu.key}
              type="button"
              onClick={() => setActiveTab(menu.key as VideoEditorTab)}
              className={`flex items-center gap-1.5 rounded-none border-b-2 px-3 h-full text-xs font-black transition shrink-0 outline-none ${
                active
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon size={13} />
              {menu.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {currentTab === "media" ? (
          <VideoEditorMediaLibrary />
        ) : (
          <StaticPanel activeTab={currentTab} />
        )}
      </div>
    </aside>
  );
}

function StaticPanel({ activeTab }: { activeTab: VideoEditorTab }) {
  const {
    clips,
    selectedClipId,
    splitClip,
    currentTime,
    updateClip,
    addClipFromMedia,
    addMediaFiles,
    setCanvasRatio,
  } = useVideoEditor();

  const handleAddAiImage = () => {
    addClipFromMedia({
      id: `media-ai-${Date.now()}`,
      type: "image",
      name: "AI Generated Landscape.png",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop",
      createdAt: new Date().toISOString(),
    });
  };

  const handleAddBgImage = () => {
    addClipFromMedia({
      id: `media-bg-${Date.now()}`,
      type: "image",
      name: "Gradient Background.png",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop",
      createdAt: new Date().toISOString(),
    });
  };

  const handleRotate = () => {
    if (!selectedClipId) {
      alert("회전할 클립을 타임라인에서 먼저 선택해 주세요.");
      return;
    }
    const target = clips.find((c) => c.id === selectedClipId);
    if (target) {
      const nextRotation = ((target.rotation || 0) + 90) % 360;
      updateClip(selectedClipId, { rotation: nextRotation });
    }
  };

  const handleSpeedChange = () => {
    if (!selectedClipId) {
      alert("속도를 조절할 클립을 타임라인에서 먼저 선택해 주세요.");
      return;
    }
    const target = clips.find((c) => c.id === selectedClipId);
    if (target) {
      const nextDuration = Math.max(0.5, target.duration / 2);
      updateClip(selectedClipId, {
        duration: nextDuration,
        name: `${target.name.replace(" (2.0x)", "")} (2.0x)`,
      });
    }
  };

  const handleSplit = () => {
    if (!selectedClipId) {
      alert("분할할 클립을 타임라인에서 먼저 선택해 주세요.");
      return;
    }
    splitClip(selectedClipId, currentTime);
  };

  if (activeTab === "image") {
    return (
      <PanelSection
        icon={ImageIcon}
        title="이미지"
        desc="썸네일, 커버, 배경 이미지를 추가합니다."
      >
        <PanelUploadButton
          label="이미지 업로드"
          accept="image/*"
          onUpload={(files) => addMediaFiles(files)}
        />
        <PanelButton label="AI 이미지 생성 결과 불러오기" onClick={handleAddAiImage} />
        <PanelButton label="배경 이미지 추가" onClick={handleAddBgImage} />
      </PanelSection>
    );
  }

  if (activeTab === "video") {
    return (
      <PanelSection
        icon={Film}
        title="비디오"
        desc="비디오 클립을 타임라인에 추가합니다."
      >
        <PanelUploadButton
          label="비디오 업로드"
          accept="video/*"
          onUpload={(files) => addMediaFiles(files)}
        />
        <PanelButton label="클립 분할" onClick={handleSplit} />
        <PanelButton label="속도 조절 (2배속)" onClick={handleSpeedChange} />
        <PanelButton label="반전 / 회전 (90°)" onClick={handleRotate} />
      </PanelSection>
    );
  }

  if (activeTab === "audio") {
    return <VideoEditorAudioMixer />;
  }

  if (activeTab === "visualizer") {
    return (
      <div>
        <PanelHeader
          icon={Waves}
          title="비주얼라이저"
          desc="오디오 스펙트럼과 음악 반응형 효과를 생성합니다."
        />

        <VideoEditorVisualizerPanel />
      </div>
    );
  }

  if (activeTab === "subtitle") {
    return <VideoEditorTextStylePanel />;
  }

  if (activeTab === "text") {
    return <VideoEditorTextStylePanel />;
  }

  if (activeTab === "effects") {
    return <VideoEditorEffectsPanel />;
  }

  if (activeTab === "settings") {
    return <VideoEditorMotionPanel />;
  }

  return (
    <PanelSection
      icon={Settings}
      title="설정"
      desc="프로젝트 기본 설정을 관리합니다."
    >
      <PanelButton label="화면 비율 16:9" onClick={() => setCanvasRatio("16:9")} />
      <PanelButton label="화면 비율 9:16" onClick={() => setCanvasRatio("9:16")} />
      <PanelButton label="화면 비율 1:1" onClick={() => setCanvasRatio("1:1")} />
      <PanelButton
        label="배경 색상 (기본 검정)"
        onClick={() => alert("현재 검은색 배경색이 적용되어 있습니다.")}
      />
    </PanelSection>
  );
}

function PanelUploadButton({
  label,
  accept,
  onUpload,
}: {
  label: string;
  accept: string;
  onUpload: (files: FileList) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-between rounded-none border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
      >
        {label}
        <Upload size={15} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.value && e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

function SubTabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-none border px-2 py-3 text-[10px] font-black transition ${active
        ? "border-pink-400 bg-pink-400/15 text-pink-200"
        : "border-white/10 bg-black/30 text-zinc-500 hover:border-pink-400/50"
        }`}
    >
      <Icon size={15} />
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
      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function PanelSection({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PanelHeader icon={icon} title={title} desc={desc} />
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PanelButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-none border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
    >
      {label}
      <Plus size={15} />
    </button>
  );
}