export type VideoEditorTab =
  | "project"
  | "media"
  | "image"
  | "video"
  | "audio"
  | "subtitle"
  | "visualizer"
  | "text"
  | "effects"
  | "settings";

export type ExportResolution = "720p" | "1080p" | "2k" | "4k";
export type ExportFps = 24 | 30 | 60;
export type ExportQuality = "high" | "standard" | "low";

export type TimelineTrackType =
  | "video"
  | "audio"
  | "text"
  | "subtitle"
  | "overlay"
  | "visualizer";

export type TimelineTrack = {
  id: string;
  name: string;
  type: TimelineTrackType;
  color: string;
};