"use client";

import { useState } from "react";

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

  return (
    <aside className="w-[320px] shrink-0 border-r border-white/10 bg-[#0d0d12]">
      <div className="border-b border-white/10 p-4">
        <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-400">
          Resources
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {VIDEO_EDITOR_SIDEBAR_MENUS.map((menu) => {
            const Icon = menu.icon;
            const active = activeTab === menu.key;

            return (
              <button
                key={menu.key}
                type="button"
                onClick={() => setActiveTab(menu.key as VideoEditorTab)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${active
                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
                  : "border-white/10 bg-black/20 text-zinc-400 hover:border-cyan-400/50"
                  }`}
              >
                <Icon size={16} />
                {menu.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[calc(100%-190px)] overflow-y-auto p-4">
        {activeTab === "media" ? (
          <VideoEditorMediaLibrary />
        ) : activeTab === "project" ? (
          <VideoEditorProjectPanel />
        ) : (
          <StaticPanel activeTab={activeTab} />
        )}
      </div>
    </aside>
  );
}

function StaticPanel({ activeTab }: { activeTab: VideoEditorTab }) {
  const { addTextClip, addSubtitleClip } = useVideoEditor();

  if (activeTab === "project") {
    return <VideoEditorProjectPanel />;
  }

  if (activeTab === "image") {
    return (
      <PanelSection
        icon={ImageIcon}
        title="이미지"
        desc="썸네일, 커버, 배경 이미지를 추가합니다."
      >
        <PanelButton label="이미지 업로드" />
        <PanelButton label="AI 이미지 생성 결과 불러오기" />
        <PanelButton label="배경 이미지 추가" />
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
        <PanelButton label="비디오 업로드" />
        <PanelButton label="클립 분할" />
        <PanelButton label="속도 조절" />
        <PanelButton label="반전 / 회전" />
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
      <PanelButton label="화면 비율 16:9" />
      <PanelButton label="화면 비율 9:16" />
      <PanelButton label="화면 비율 1:1" />
      <PanelButton label="배경 색상" />
    </PanelSection>
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
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-[10px] font-black transition ${active
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
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
    >
      {label}
      <Plus size={15} />
    </button>
  );
}