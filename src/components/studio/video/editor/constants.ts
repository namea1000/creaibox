import {
  Upload,
  Image as ImageIcon,
  Film,
  Music,
  Captions,
  Type,
  Sparkles,
  Waves,
  Move,
} from "lucide-react";

import type { TimelineTrack } from "./types";

export const VIDEO_EDITOR_SIDEBAR_MENUS = [
  { key: "media", label: "미디어 업로드", icon: Upload },
  { key: "image", label: "이미지", icon: ImageIcon },
  { key: "video", label: "비디오", icon: Film },
  { key: "audio", label: "오디오", icon: Music },
  { key: "visualizer", label: "비주얼라이저", icon: Waves },
  { key: "subtitle", label: "자막", icon: Captions },
  { key: "text", label: "텍스트", icon: Type },
  { key: "effects", label: "효과", icon: Sparkles },
  { key: "settings", label: "모션", icon: Move },
] as const;

export const EXPORT_RESOLUTION_OPTIONS = [
  { label: "720p", value: "720p", desc: "1280×720" },
  { label: "1080p", value: "1080p", desc: "1920×1080" },
  { label: "2K", value: "2k", desc: "2560×1440" },
  { label: "4K", value: "4k", desc: "3840×2160" },
] as const;

export const EXPORT_FPS_OPTIONS = [
  { label: "24fps", value: 24 },
  { label: "30fps", value: 30 },
  { label: "60fps", value: 60 },
] as const;

export const EXPORT_QUALITY_OPTIONS = [
  { label: "고화질", value: "high", desc: "약 14Mbps" },
  { label: "표준", value: "standard", desc: "약 8Mbps" },
  { label: "저용량", value: "low", desc: "약 5Mbps" },
] as const;

export const DEFAULT_TIMELINE_TRACKS: TimelineTrack[] = [
  { id: "video-1", name: "Video Track 1", type: "video", color: "bg-cyan-400/25" },
  { id: "audio-1", name: "Audio Track 1", type: "audio", color: "bg-emerald-400/25" },
  { id: "text-1", name: "Text Track", type: "text", color: "bg-violet-400/25" },
  { id: "subtitle-1", name: "Subtitle Track", type: "subtitle", color: "bg-amber-400/25" },
  { id: "visualizer-1", name: "Visualizer Track", type: "visualizer", color: "bg-pink-400/25" },
];