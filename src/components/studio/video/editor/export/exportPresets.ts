import type { VideoExportEngine } from "./exportTypes";

export const VIDEO_EXPORT_ENGINES: Array<{
  value: VideoExportEngine;
  label: string;
  desc: string;
}> = [
  {
    value: "fast-webcodecs",
    label: "Fast WebCodecs",
    desc: "지원 브라우저에서 video-only WebM을 빠르게 인코딩합니다. 오디오가 필요한 경우 Quick WebM 또는 MP4를 사용하세요. 실패 시 Quick WebM으로 fallback합니다.",
  },
  {
    value: "quick-webm",
    label: "Quick WebM",
    desc: "브라우저 기본 녹화 엔진으로 빠르게 WebM 파일을 저장합니다.",
  },
  {
    value: "compatible-mp4",
    label: "Compatible MP4",
    desc: "WebM 렌더 후 FFmpeg WASM으로 MP4 변환을 수행합니다.",
  },
  {
    value: "direct-mp4",
    label: "Direct MP4",
    desc: "WebCodecs H.264/AAC와 Mediabunny MP4 muxer로 MP4를 직접 생성합니다. 현재 1단계에서는 Compatible MP4로 안전 fallback합니다.",
  },
];
