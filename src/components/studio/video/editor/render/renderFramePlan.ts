import type {
  CanvasRatio,
  VideoEditorClip,
  VideoEditorMediaItem,
} from "../VideoEditorContext";
import type { TimelineTrack } from "../types";
import {
  getAudioMixValue,
  getRenderEffects,
  getRenderMotionAtTime,
  getRenderTransition,
} from "./videoRenderMath";

export type RenderFrameLayerKind =
  | "video"
  | "image"
  | "audio"
  | "text"
  | "subtitle"
  | "visualizer"
  | "missing-media";

export type RenderFrameLayer = {
  id: string;
  kind: RenderFrameLayerKind;
  clip: VideoEditorClip;
  media: VideoEditorMediaItem | null;
  localTime: number;
  trackIndex: number;
  zIndex: number;
  isPictureLayer: boolean;
  motion: ReturnType<typeof getRenderMotionAtTime>;
  transition: ReturnType<typeof getRenderTransition>;
  effects: ReturnType<typeof getRenderEffects>;
  audioMix: ReturnType<typeof getAudioMixValue>;
};

export type RenderFramePlan = {
  currentTime: number;
  canvasRatio: CanvasRatio;
  layers: RenderFrameLayer[];
  mediaLayers: RenderFrameLayer[];
  textLayers: RenderFrameLayer[];
  subtitleLayers: RenderFrameLayer[];
  visualizerLayers: RenderFrameLayer[];
  hasPictureLayer: boolean;
};

export type BuildRenderFramePlanInput = {
  clips: VideoEditorClip[];
  mediaItems: VideoEditorMediaItem[];
  tracks: TimelineTrack[];
  currentTime: number;
  canvasRatio: CanvasRatio;
};

export function buildRenderFramePlan({
  clips,
  mediaItems,
  tracks,
  currentTime,
  canvasRatio,
}: BuildRenderFramePlanInput): RenderFramePlan {
  const trackOrder = new Map(tracks.map((track, index) => [track.id, index]));
  const mediaById = new Map(mediaItems.map((item) => [item.id, item]));

  const layers = clips
    .filter(
      (clip) =>
        currentTime >= clip.startTime &&
        currentTime <= clip.startTime + clip.duration
    )
    .map((clip) => {
      const media = clip.mediaId ? mediaById.get(clip.mediaId) ?? null : null;
      const kind = resolveLayerKind(clip, media);
      const trackIndex = trackOrder.get(clip.trackId) ?? Number.MAX_SAFE_INTEGER;

      return {
        id: clip.id,
        kind,
        clip,
        media,
        localTime: Math.max(0, currentTime - clip.startTime + (clip.trimStart ?? 0)),
        trackIndex,
        zIndex: 0,
        isPictureLayer:
          kind === "video" || kind === "image" || kind === "visualizer",
        motion: getRenderMotionAtTime(clip, currentTime),
        transition: getRenderTransition(clip, currentTime),
        effects: getRenderEffects(clip),
        audioMix: getAudioMixValue(clip, currentTime),
      };
    })
    .sort((a, b) => {
      if (a.trackIndex !== b.trackIndex) return b.trackIndex - a.trackIndex;
      if (a.clip.startTime !== b.clip.startTime) {
        return a.clip.startTime - b.clip.startTime;
      }
      return a.clip.id.localeCompare(b.clip.id);
    })
    .map((layer, index) => ({
      ...layer,
      zIndex: 10 + index,
    }));

  return {
    currentTime,
    canvasRatio,
    layers,
    mediaLayers: layers.filter(
      (layer) =>
        layer.kind === "video" ||
        layer.kind === "image" ||
        layer.kind === "audio" ||
        layer.kind === "visualizer"
    ),
    textLayers: layers.filter((layer) => layer.kind === "text"),
    subtitleLayers: layers.filter((layer) => layer.kind === "subtitle"),
    visualizerLayers: layers.filter((layer) => layer.kind === "visualizer"),
    hasPictureLayer: layers.some((layer) => layer.isPictureLayer),
  };
}

function resolveLayerKind(
  clip: VideoEditorClip,
  media: VideoEditorMediaItem | null
): RenderFrameLayerKind {
  if (clip.type === "text") return "text";
  if (clip.type === "subtitle") return "subtitle";
  if (clip.type === "visualizer") return "visualizer";
  if (clip.type === "audio") return "audio";
  if (!media) return "missing-media";
  if (media.type === "video") return "video";
  if (media.type === "image") return "image";
  if (media.type === "audio") return "audio";
  return "missing-media";
}
