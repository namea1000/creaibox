"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Music,
  Play,
  Pause,
  Disc3,
  Waves,
  Radio,
  CircleDot,
  BarChart3,
  Settings,
  Image as ImageIcon,
  Sparkles,
  Download,
  Film,
  Square,
  Orbit,
  Activity,
  Circle,
  Gauge,
  AudioLines,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { convertWebmToMp4 } from "@/components/studio/music/music-visualizer/ffmpeg/exportMp4";

type MusicSong = {
  id: string;
  title: string | null;
  genre: string | null;
  mood: string | null;
  vocal: string | null;
  tempo: string | null;
  instrument: string | null;
  album_id: string | null;
  album_name: string | null;
};

type VisualizerTemplate =
  | "bars"
  | "mirror-bars"
  | "skyline"
  | "circle"
  | "radial-dots"
  | "wave"
  | "twin-wave"
  | "dots"
  | "line"
  | "progress"
  | "ring"
  | "orbit"
  | "equalizer"
  | "mountain"
  | "tunnel"
  | "particles"
  | "pulse-square"
  | "vinyl"
  | "heartbeat"
  | "minimal"
type ExportQuality = "720p" | "1080p" | "4k";
type ExportFps = 24 | 30 | 60;

const templates: {
  id: VisualizerTemplate;
  title: string;
  desc: string;
  icon: React.ElementType;
}[] = [
    { id: "bars", title: "Spectrum Bars", desc: "기본 막대형", icon: BarChart3 },
    { id: "mirror-bars", title: "Mirror Bars", desc: "상하 대칭 막대", icon: AudioLines },
    { id: "skyline", title: "Neon Skyline", desc: "도시 스카이라인", icon: BarChart3 },
    { id: "circle", title: "Circle Pulse", desc: "원형 스펙트럼", icon: CircleDot },
    { id: "radial-dots", title: "Radial Dots", desc: "원형 도트", icon: Orbit },
    { id: "wave", title: "Wave Line", desc: "파형 라인", icon: Waves },
    { id: "twin-wave", title: "Twin Wave", desc: "쌍파형", icon: Waves },
    { id: "dots", title: "Beat Dots", desc: "비트 도트", icon: Radio },
    { id: "line", title: "Neon Flow", desc: "네온 라인", icon: Sparkles },
    { id: "progress", title: "Progress Glow", desc: "진행바", icon: Gauge },
    { id: "ring", title: "Glow Ring", desc: "빛나는 링", icon: Circle },
    { id: "orbit", title: "Orbit Pulse", desc: "궤도형", icon: Orbit },
    { id: "equalizer", title: "EQ Blocks", desc: "이퀄라이저", icon: BarChart3 },
    { id: "mountain", title: "Sound Mountain", desc: "산맥 파형", icon: Waves },
    { id: "tunnel", title: "Audio Tunnel", desc: "터널형", icon: CircleDot },
    { id: "particles", title: "Particles", desc: "입자 반응", icon: Sparkles },
    { id: "pulse-square", title: "Pulse Square", desc: "사각형 펄스", icon: Square },
    { id: "vinyl", title: "Vinyl Disc", desc: "LP 스타일", icon: Disc3 },
    { id: "heartbeat", title: "Heartbeat", desc: "심장 박동선", icon: Activity },
    { id: "minimal", title: "Minimal Line", desc: "미니멀", icon: Music },
  ];

function safeFileName(value: string) {
  return (value || "audio-visualizer")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getExportSize(quality: ExportQuality, canvasSize: string) {
  if (canvasSize === "9:16") {
    if (quality === "4k") return { width: 2160, height: 3840 };
    if (quality === "1080p") return { width: 1080, height: 1920 };
    return { width: 720, height: 1280 };
  }

  if (canvasSize === "1:1") {
    if (quality === "4k") return { width: 2160, height: 2160 };
    if (quality === "1080p") return { width: 1080, height: 1080 };
    return { width: 720, height: 720 };
  }

  if (quality === "4k") return { width: 3840, height: 2160 };
  if (quality === "1080p") return { width: 1920, height: 1080 };
  return { width: 1280, height: 720 };
}

function isPlayInterruptedError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function isAudioSourceError(error: unknown) {
  return error instanceof DOMException && error.name === "NotSupportedError";
}

function waitForAudioReady(audio: HTMLAudioElement) {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new DOMException("Timed out while loading audio.", "NotSupportedError"));
    }, 3000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      audio.removeEventListener("canplay", handleReady);
      audio.removeEventListener("loadeddata", handleReady);
      audio.removeEventListener("error", handleError);
    };

    const handleReady = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new DOMException("The element has no supported sources.", "NotSupportedError"));
    };

    audio.addEventListener("canplay", handleReady, { once: true });
    audio.addEventListener("loadeddata", handleReady, { once: true });
    audio.addEventListener("error", handleError, { once: true });
    audio.load();
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "알 수 없는 오류";
}

export default function MusicVisualizerPage() {
  const supabase = useMemo(() => createClient(), []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recorderDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const coverImageRef = useRef<HTMLImageElement | null>(null);
  const playRequestRef = useRef(0);
  const smoothedFreqRef = useRef<{ count: number; values: number[] }>({ count: 0, values: [] });

  const [songs, setSongs] = useState<MusicSong[]>([]);
  const [selectedSongId, setSelectedSongId] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isMp4Rendering, setIsMp4Rendering] = useState(false);
  const [mp4Progress, setMp4Progress] = useState(0);
  const [exportQuality, setExportQuality] = useState<ExportQuality>("1080p");
  const [exportFps, setExportFps] = useState<ExportFps>(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [template, setTemplate] = useState<VisualizerTemplate>("circle");

  const [accentColor, setAccentColor] = useState("#ff4fd8");
  const [backgroundColor, setBackgroundColor] = useState("#050507");
  const [canvasSize, setCanvasSize] = useState("16:9");
  const [showCover, setShowCover] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [useCoverAsBackground, setUseCoverAsBackground] = useState(true);
  const [coverBackgroundDim, setCoverBackgroundDim] = useState(0);
  const [spectrumY, setSpectrumY] = useState(50);
  const [spectrumHeight, setSpectrumHeight] = useState(58);
  const [spectrumWidth, setSpectrumWidth] = useState(92);

  const selectedSong = songs.find((song) => song.id === selectedSongId);
  const displayTitle = selectedSong?.title || fileName.replace(/\.[^/.]+$/, "") || "Audio Visualizer";

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase
        .from("music_lyrics_projects")
        .select("id,title,genre,mood,vocal,tempo,instrument,album_id,album_name")
        .order("created_at", { ascending: false });

      setSongs((data ?? []) as MusicSong[]);
    };

    void fetchSongs();
  }, [supabase]);

  useEffect(() => {
    if (!coverImageUrl) {
      coverImageRef.current = null;
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      coverImageRef.current = img;
    };
    img.src = coverImageUrl;
  }, [coverImageUrl]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
    };
  }, [audioUrl, coverImageUrl]);

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyser.frequencyBinCount;
    const freq = new Uint8Array(bufferLength);
    const wave = new Uint8Array(bufferLength);

    const getFreq = (i: number, count: number) => {
      const safeCount = Math.max(count, 1);
      const position = i / Math.max(safeCount - 1, 1);
      const minBin = 4;
      const maxBin = Math.max(Math.floor(bufferLength * 0.78), minBin + 1);
      const toLogBin = (ratio: number) => {
        const safeRatio = clamp(ratio, 0, 1);
        return Math.floor(minBin * Math.pow(maxBin / minBin, safeRatio));
      };
      const start = toLogBin(i / safeCount);
      const end = Math.max(start + 1, toLogBin((i + 1) / safeCount));
      let total = 0;

      for (let index = start; index < end; index += 1) {
        total += freq[index] || 0;
      }

      const average = total / Math.max(end - start, 1);
      const highFrequencyLift = 1 + position * 0.45;
      const lowFrequencyTame = 0.7 + position * 0.3;
      const targetValue = Math.min(
        205,
        Math.pow(average / 255, 0.84) * 198 * highFrequencyLift * lowFrequencyTame
      );

      if (smoothedFreqRef.current.count !== safeCount) {
        smoothedFreqRef.current = { count: safeCount, values: Array(safeCount).fill(targetValue) };
      }

      const previousValue = smoothedFreqRef.current.values[i] ?? targetValue;
      const smoothing = targetValue > previousValue ? 0.34 : 0.22;
      const visibleValue = previousValue + (targetValue - previousValue) * smoothing;
      smoothedFreqRef.current.values[i] = visibleValue;

      return visibleValue;
    };

    const drawCover = () => {
      const img = coverImageRef.current;
      if (!showCover || !img) return;

      const size = Math.min(width, height) * 0.32;
      const x = width / 2 - size / 2;
      const y = height / 2 - size / 2;

      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.shadowBlur = 35;
      ctx.shadowColor = accentColor;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 28);
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    };

    const drawTitle = () => {
      if (!showTitle) return;

      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.font = "900 42px sans-serif";
      ctx.textAlign = "center";
      ctx.shadowBlur = 18;
      ctx.shadowColor = accentColor;
      ctx.fillText(displayTitle, width / 2, height - 58);
      ctx.restore();
    };

    const frame = () => {
      analyser.getByteFrequencyData(freq);
      analyser.getByteTimeDomainData(wave);

      const bgImage = coverImageRef.current;
      const isCoverBackgroundActive = Boolean(useCoverAsBackground && bgImage);

      if (isCoverBackgroundActive && bgImage) {
        const scale = Math.max(width / bgImage.width, height / bgImage.height);
        const imgW = bgImage.width * scale;
        const imgH = bgImage.height * scale;
        const imgX = (width - imgW) / 2;
        const imgY = (height - imgH) / 2;

        ctx.drawImage(bgImage, imgX, imgY, imgW, imgH);

        const dimAlpha = coverBackgroundDim / 100;

        if (dimAlpha > 0) {
          ctx.fillStyle = `rgba(0,0,0,${dimAlpha * 0.45})`;
          ctx.fillRect(0, 0, width, height);

          const bg = ctx.createRadialGradient(
            width / 2,
            height / 2,
            40,
            width / 2,
            height / 2,
            width
          );
          bg.addColorStop(0, `rgba(0,0,0,${dimAlpha * 0.04})`);
          bg.addColorStop(0.62, `rgba(0,0,0,${dimAlpha * 0.28})`);
          bg.addColorStop(1, `rgba(0,0,0,${dimAlpha * 0.68})`);
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, width, height);
        }
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        const bg = ctx.createRadialGradient(
          width / 2,
          height / 2,
          40,
          width / 2,
          height / 2,
          width
        );
        bg.addColorStop(0, "rgba(0,0,0,0.02)");
        bg.addColorStop(0.55, "rgba(0,0,0,0.20)");
        bg.addColorStop(1, "rgba(0,0,0,0.62)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
      }

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (isCoverBackgroundActive) {
        gradient.addColorStop(0, "rgba(255,255,255,0.94)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0.78)");
        gradient.addColorStop(1, "rgba(255,255,255,0.62)");
      } else {
        gradient.addColorStop(0, accentColor);
        gradient.addColorStop(0.5, "#d946ef");
        gradient.addColorStop(1, "#22d3ee");
      }

      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.shadowBlur = isCoverBackgroundActive ? 10 : 18;
      ctx.shadowColor = isCoverBackgroundActive ? "rgba(255,255,255,0.36)" : accentColor;
      analyser.getByteFrequencyData(freq);
      analyser.getByteTimeDomainData(wave);
      const avg = freq.reduce((a, b) => a + b, 0) / Math.max(freq.length, 1);
      const spectrumCenterY = height * (spectrumY / 100);
      const spectrumMaxHeight = height * (spectrumHeight / 100);
      const spectrumDrawWidth = width * (spectrumWidth / 100);
      const spectrumStartX = (width - spectrumDrawWidth) / 2;

      if (template === "bars" || template === "skyline") {
        const count = template === "skyline" ? 72 : 96;
        const barWidth = spectrumDrawWidth / count;
        const skylineBaseY = clamp(spectrumCenterY + spectrumMaxHeight / 2, 0, height);

        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const barHeight = (value / 255) * spectrumMaxHeight;
          const x = spectrumStartX + i * barWidth;
          const y =
            template === "skyline"
              ? skylineBaseY - barHeight
              : spectrumCenterY - barHeight / 2;
          ctx.fillRect(x + 3, y, Math.max(barWidth - 6, 2), barHeight);
        }
      }

      if (template === "mirror-bars") {
        const count = 88;
        const barWidth = spectrumDrawWidth / count;
        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const barHeight = (value / 255) * (spectrumMaxHeight * 0.5);
          const x = spectrumStartX + i * barWidth;
          ctx.fillRect(x + 3, spectrumCenterY - barHeight, Math.max(barWidth - 6, 2), barHeight);
          ctx.fillRect(x + 3, spectrumCenterY, Math.max(barWidth - 6, 2), barHeight);
        }
      }

      if (template === "circle" || template === "ring" || template === "orbit" || template === "radial-dots") {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.2 + avg * 0.12;
        const count = template === "radial-dots" ? 90 : 140;

        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius - 22, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const angle = (i / count) * Math.PI * 2;
          const amp = (value / 255) * 150;

          if (template === "radial-dots") {
            const r = baseRadius + amp;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 3 + value / 45, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const x1 = cx + Math.cos(angle) * baseRadius;
            const y1 = cy + Math.sin(angle) * baseRadius;
            const x2 = cx + Math.cos(angle) * (baseRadius + amp);
            const y2 = cy + Math.sin(angle) * (baseRadius + amp);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        if (template === "orbit") {
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, baseRadius + 70 + i * 38 + Math.sin(Date.now() / 500 + i) * 8, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      if (template === "wave" || template === "twin-wave" || template === "line" || template === "mountain" || template === "heartbeat" || template === "minimal") {
        const count = template === "minimal" ? 80 : bufferLength;
        ctx.beginPath();

        for (let i = 0; i < count; i++) {
          const value = template === "minimal" ? getFreq(i, count) : wave[i] || 128;
          const x = spectrumStartX + (i / Math.max(count - 1, 1)) * spectrumDrawWidth;
          let y = spectrumCenterY;

          if (template === "wave") y = spectrumCenterY + ((value - 128) / 128) * (spectrumMaxHeight * 0.5);
          if (template === "twin-wave") y = spectrumCenterY + ((value - 128) / 128) * (spectrumMaxHeight * 0.5);
          if (template === "line") y = spectrumCenterY - (getFreq(i, count) / 255) * (spectrumMaxHeight * 0.5) + Math.sin(i * 0.22) * (spectrumMaxHeight * 0.12);
          if (template === "mountain") y = clamp(spectrumCenterY + spectrumMaxHeight / 2, 0, height) - (getFreq(i, count) / 255) * spectrumMaxHeight;
          if (template === "heartbeat") y = spectrumCenterY + Math.sin(i * 0.12) * (spectrumMaxHeight * 0.08) - (getFreq(i, count) / 255) * (spectrumMaxHeight * 0.35);
          if (template === "minimal") y = spectrumCenterY - (value / 255) * (spectrumMaxHeight * 0.24);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (template === "mountain") {
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.globalAlpha = 0.8;
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.stroke();
        }

        if (template === "twin-wave") {
          ctx.beginPath();
          for (let i = 0; i < count; i++) {
            const value = wave[i] || 128;
            const x = spectrumStartX + (i / Math.max(count - 1, 1)) * spectrumDrawWidth;
            const y = spectrumCenterY - ((value - 128) / 128) * (spectrumMaxHeight * 0.5);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      if (template === "dots" || template === "particles") {
        const count = template === "particles" ? 120 : 64;
        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const x = template === "particles" ? (Math.sin(i * 12.989 + Date.now() / 900) * 0.5 + 0.5) * width : (i / count) * width;
          const y = template === "particles" ? (Math.cos(i * 7.12 + Date.now() / 1200) * 0.5 + 0.5) * height : height / 2 + Math.sin(i * 0.4) * 60;
          const size = 3 + (value / 255) * 24;
          ctx.beginPath();
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (template === "progress") {
        const progressWidth = width * 0.68;
        const progressHeight = 28;
        const x = (width - progressWidth) / 2;
        const y = height / 2 - progressHeight / 2;
        const value = Math.min(1, 0.18 + avg / 220);

        ctx.shadowBlur = 22;
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.roundRect(x, y, progressWidth, progressHeight, 999);
        ctx.fill();

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, progressWidth * value, progressHeight, 999);
        ctx.fill();
      }

      if (template === "equalizer") {
        const cols = 28;
        const rows = 12;
        const gap = 7;
        const blockW = (width * 0.72) / cols - gap;
        const blockH = 18;
        const startX = width * 0.14;
        const baseY = height / 2 + rows * blockH * 0.5;

        for (let i = 0; i < cols; i++) {
          const value = getFreq(i, cols);
          const activeRows = Math.ceil((value / 255) * rows);
          for (let j = 0; j < activeRows; j++) {
            ctx.fillRect(startX + i * (blockW + gap), baseY - j * (blockH + gap), blockW, blockH);
          }
        }
      }

      if (template === "tunnel") {
        const cx = width / 2;
        const cy = height / 2;
        for (let i = 0; i < 12; i++) {
          const value = getFreq(i * 4, 48);
          const radius = 40 + i * 36 + value * 0.45;
          ctx.globalAlpha = 1 - i * 0.055;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      if (template === "pulse-square") {
        const size = Math.min(width, height) * 0.42 + avg * 1.4;
        ctx.beginPath();
        ctx.roundRect(width / 2 - size / 2, height / 2 - size / 2, size, size, 36);
        ctx.stroke();
      }

      if (template === "vinyl") {
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.25 + avg * 0.3;

        ctx.fillStyle = "rgba(0,0,0,0.72)";
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = gradient;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius - i * 24, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 42 + avg * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      drawCover();
      drawTitle();

      animationRef.current = requestAnimationFrame(frame);
    };

    frame();
  };

  const setupAudio = async () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;

    if (!sourceRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.78;

      const recorderDestination = audioContext.createMediaStreamDestination();
      const source = audioContext.createMediaElementSource(audioRef.current);

      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.connect(recorderDestination);

      sourceRef.current = source;
      analyserRef.current = analyser;
      recorderDestinationRef.current = recorderDestination;
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    draw();
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (audioUrl) URL.revokeObjectURL(audioUrl);

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setFileName(file.name);
    setIsPlaying(false);
    smoothedFreqRef.current = { count: 0, values: [] };
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);

    const url = URL.createObjectURL(file);
    setCoverImageUrl(url);
  };

  const handlePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      window.alert("먼저 오디오 파일을 업로드하세요.");
      return;
    }

    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
    }

    try {
      await waitForAudioReady(audio);
      await setupAudio();
    } catch (error) {
      setIsPlaying(false);
      if (isAudioSourceError(error)) {
        window.alert("오디오 파일을 읽지 못했습니다. 파일을 다시 선택해 주세요.");
        return;
      }

      window.alert("오디오 재생 준비 중 문제가 발생했습니다. 다시 시도해 주세요.");
      return;
    }

    if (!audio.paused) {
      playRequestRef.current += 1;
      audio.pause();
      setIsPlaying(false);
      return;
    }

    const requestId = playRequestRef.current + 1;
    playRequestRef.current = requestId;

    try {
      await audio.play();
      if (playRequestRef.current === requestId) {
        setIsPlaying(true);
      }
    } catch (error) {
      if (!isPlayInterruptedError(error)) {
        setIsPlaying(false);
        window.alert(
          isAudioSourceError(error)
            ? "오디오 파일을 읽지 못했습니다. 파일을 다시 선택해 주세요."
            : "오디오 재생을 시작하지 못했습니다. 다시 시도해 주세요."
        );
      }
    }
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${safeFileName(displayTitle)}.png`;
    a.click();
  };

  const handleStartRecording = async (exportMode: "webm" | "mp4" = "webm") => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    const exportSize = getExportSize(exportQuality, canvasSize);
    const originalCanvasWidth = canvas?.width;
    const originalCanvasHeight = canvas?.height;

    if (!canvas || !audio || !audioUrl) {
      window.alert("먼저 오디오를 업로드하고 재생 준비를 해주세요.");
      return;
    }

    try {
      await waitForAudioReady(audio);
      await setupAudio();
    } catch (error) {
      setIsRecording(false);
      if (isAudioSourceError(error)) {
        window.alert("오디오 파일을 읽지 못했습니다. 파일을 다시 선택해 주세요.");
        return;
      }

      window.alert("오디오 녹화 준비 중 문제가 발생했습니다. 다시 시도해 주세요.");
      return;
    }

    if (!recorderDestinationRef.current) {
      window.alert("오디오 녹화 스트림을 준비하지 못했습니다.");
      return;
    }
    canvas.width = exportSize.width;
    canvas.height = exportSize.height;
    draw();
    const canvasStream = canvas.captureStream(exportFps);
    const mixedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...recorderDestinationRef.current.stream.getAudioTracks(),
    ]);

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(mixedStream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      mediaRecorderRef.current = null;

      if (originalCanvasWidth && originalCanvasHeight) {
        canvas.width = originalCanvasWidth;
        canvas.height = originalCanvasHeight;
        draw();
      }

      if (exportMode === "mp4") {
        try {
          setIsMp4Rendering(true);
          setMp4Progress(0);

          await convertWebmToMp4({
            webmBlob: blob,
            title: displayTitle,
            onProgress: setMp4Progress,
          });

          window.alert("✅ MP4 저장이 완료되었습니다.");
        } catch (error: unknown) {
          console.error(error);
          window.alert(`❌ MP4 변환 실패: ${getErrorMessage(error)}`);
        } finally {
          setIsMp4Rendering(false);
          setMp4Progress(0);
          setIsRecording(false);
        }

        return;
      }

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeFileName(displayTitle)}.webm`;
      a.click();

      URL.revokeObjectURL(url);
      setIsRecording(false);
    };

    setRecordingProgress(0);
    recorder.start();
    setIsRecording(true);

    audio.currentTime = 0;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      if (!isPlayInterruptedError(error)) {
        setIsPlaying(false);
        window.alert(
          isAudioSourceError(error)
            ? "오디오 파일을 읽지 못했습니다. 파일을 다시 선택해 주세요."
            : "오디오 재생을 시작하지 못했습니다. 다시 시도해 주세요."
        );
      }
    }
  };

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;
    const audio = audioRef.current;

    if (!recorder || recorder.state === "inactive") {
      setIsRecording(false);
      setRecordingProgress(0);
      return;
    }

    playRequestRef.current += 1;
    setIsRecording(false);
    setRecordingProgress(0);
    recorder.stop();

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
  };

  const handleCanvasSpectrumDrag = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextY = ((event.clientY - rect.top) / rect.height) * 100;
    setSpectrumY(Math.round(clamp(nextY, 5, 95)));
  };

  useEffect(() => {
    if (analyserRef.current) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, accentColor, backgroundColor, coverImageUrl, showCover, showTitle, useCoverAsBackground, coverBackgroundDim, canvasSize, displayTitle, spectrumY, spectrumHeight, spectrumWidth]);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    audioRef.current.load();
  }, [audioUrl]);

  return (
    <div className="min-h-full bg-[#050507] px-6 py-8 text-white">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-[#111827] to-black p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-pink-300">
                <Waves size={15} />
                Audio Visualizer Studio
              </div>

              <h1 className="text-4xl font-black md:text-6xl">
                오디오 스펙트럼 만들기
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
                곡 선택, 오디오 업로드, 앨범 커버 업로드, 20종 비주얼라이저 템플릿, PNG/WebM 저장까지 지원합니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 text-sm font-black text-white hover:bg-pink-400">
                <Upload size={18} />
                오디오 업로드
                <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
              </label>

              <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-5 text-sm font-black text-white hover:border-pink-400">
                <ImageIcon size={18} />
                커버 업로드
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={handleDownloadPng}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-5 text-sm font-black text-white hover:border-cyan-400"
              >
                <Download size={18} />
                PNG 저장
              </button>

              <button
                type="button"
                onClick={isRecording ? handleStopRecording : () => void handleStartRecording("webm")}
                className={`inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-black ${isRecording ? "bg-red-500 text-white hover:bg-red-400" : "bg-cyan-400 text-black hover:bg-cyan-300"
                  }`}
              >
                <Film size={18} />
                {isRecording ? "녹화 중지" : "WebM 저장"}
              </button>
              <button
                type="button"
                onClick={() => void handleStartRecording("mp4")}
                disabled={isRecording || isMp4Rendering}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-black text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Film size={18} />
                {isRecording
                  ? `녹화 중 ${recordingProgress}%`
                  : isMp4Rendering
                    ? `MP4 변환 ${mp4Progress}%`
                    : `MP4 저장 ${exportQuality} ${exportFps}fps`}
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-2xl border border-white/10 bg-[#0d0d12] p-5">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <Music className="text-pink-300" />
              Media
            </h2>

            <select
              value={selectedSongId}
              onChange={(event) => setSelectedSongId(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-pink-400"
            >
              <option value="">곡 선택 없음</option>
              {songs.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.album_name ? `[${song.album_name}] ` : ""}
                  {song.title || "제목 없음"}
                </option>
              ))}
            </select>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-400">
              <div className="font-black text-white">{selectedSong?.title || "선택된 곡 없음"}</div>
              <div className="mt-2">
                {selectedSong?.genre || "-"} · {selectedSong?.mood || "-"} · {selectedSong?.tempo || "-"}
              </div>
              <div className="mt-1">앨범: {selectedSong?.album_name || "연결 없음"}</div>
              <div className="mt-1">오디오: {fileName || "업로드 전"}</div>
            </div>

            <h2 className="flex items-center gap-2 pt-4 text-xl font-black">
              <ImageIcon className="text-cyan-300" />
              Audio Visualizers 20
            </h2>

            <div className="grid max-h-[560px] grid-cols-2 gap-3 overflow-y-auto pr-1">
              {templates.map((item) => {
                const Icon = item.icon;
                const active = template === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={async () => {
                      setTemplate(item.id);
                      if (audioUrl) await setupAudio();
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${active ? "border-pink-400 bg-pink-400/10" : "border-white/10 bg-black/30 hover:border-pink-400/50"
                      }`}
                  >
                    <Icon className="mb-4 text-pink-300" size={24} />
                    <div className="font-black">{item.title}</div>
                    <div className="mt-1 text-xs leading-5 text-zinc-500">{item.desc}</div>
                  </button>
                );
              })}
            </div>

            <h2 className="flex items-center gap-2 pt-4 text-xl font-black">
              <Settings className="text-amber-300" />
              Settings
            </h2>

            <div className="space-y-4">
              <select
                value={canvasSize}
                onChange={(event) => setCanvasSize(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none"
              >
                <option value="16:9">Widescreen — 16:9</option>
                <option value="1:1">Square — 1:1</option>
                <option value="9:16">Shorts — 9:16</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-zinc-500">
                    MP4 화질
                  </span>
                  <select
                    value={exportQuality}
                    onChange={(event) => setExportQuality(event.target.value as ExportQuality)}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none"
                  >
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4k">4K</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-zinc-500">
                    MP4 프레임
                  </span>
                  <select
                    value={exportFps}
                    onChange={(event) => setExportFps(Number(event.target.value) as ExportFps)}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none"
                  >
                    <option value={24}>24fps</option>
                    <option value={30}>30fps</option>
                    <option value={60}>60fps</option>
                  </select>
                </label>
              </div>

              {!useCoverAsBackground && (
                <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4">
                  <span className="text-sm font-bold text-zinc-300">Accent Color</span>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                </label>
              )}

              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4">
                <span className="text-sm font-bold text-zinc-300">Canvas Color</span>
                <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4">
                <span className="text-sm font-bold text-zinc-300">앨범 커버 표시</span>
                <input type="checkbox" checked={showCover} onChange={(e) => setShowCover(e.target.checked)} />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4">
                <span className="text-sm font-bold text-zinc-300">커버를 배경으로 사용</span>
                <input
                  type="checkbox"
                  checked={useCoverAsBackground}
                  onChange={(e) => setUseCoverAsBackground(e.target.checked)}
                />
              </label>

              {useCoverAsBackground && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-zinc-300">
                    <span>커버 배경 어둡게</span>
                    <span className="text-cyan-200">{coverBackgroundDim}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={coverBackgroundDim}
                    onChange={(event) => setCoverBackgroundDim(Number(event.target.value))}
                    className="w-full accent-cyan-300"
                  />
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    0%는 원본 커버를 가장 선명하게 표시합니다.
                  </p>
                </div>
              )}

              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4">
                <span className="text-sm font-bold text-zinc-300">제목 표시</span>
                <input type="checkbox" checked={showTitle} onChange={(e) => setShowTitle(e.target.checked)} />
              </label>

              <div className="space-y-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-zinc-300">
                    <span>스펙트럼 세로 위치</span>
                    <span className="text-cyan-200">{spectrumY}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={spectrumY}
                    onChange={(event) => setSpectrumY(Number(event.target.value))}
                    className="w-full accent-cyan-300"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-zinc-300">
                    <span>스펙트럼 세로 크기</span>
                    <span className="text-cyan-200">{spectrumHeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={spectrumHeight}
                    onChange={(event) => setSpectrumHeight(Number(event.target.value))}
                    className="w-full accent-cyan-300"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-zinc-300">
                    <span>스펙트럼 가로 폭</span>
                    <span className="text-cyan-200">{spectrumWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={spectrumWidth}
                    onChange={(event) => setSpectrumWidth(Number(event.target.value))}
                    className="w-full accent-cyan-300"
                  />
                </div>

                <p className="text-xs leading-5 text-zinc-500">
                  캔버스 위 스펙트럼을 클릭하거나 드래그하면 세로 위치가 바로 이동합니다.
                </p>
              </div>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{displayTitle}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {fileName || "오디오 파일을 업로드하면 스펙트럼이 재생됩니다."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePlay}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-pink-500 px-5 text-sm font-black text-white hover:bg-pink-400"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </div>

              <div
                className={`mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black ${canvasSize === "1:1"
                  ? "aspect-square max-w-[720px]"
                  : canvasSize === "9:16"
                    ? "aspect-[9/16] max-h-[760px] max-w-[430px]"
                    : "aspect-video w-full"
                  }`}
              >
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    handleCanvasSpectrumDrag(event);
                  }}
                  onPointerMove={(event) => {
                    if (event.buttons === 1) handleCanvasSpectrumDrag(event);
                  }}
                  className="h-full w-full cursor-ns-resize touch-none"
                  title="드래그해서 스펙트럼 세로 위치 이동"
                />
              </div>

              {audioUrl ? (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => {
                    setIsPlaying(true);
                  }}
                  onPause={() => {
                    playRequestRef.current += 1;
                    setIsPlaying(false);
                  }}
                  onTimeUpdate={(event) => {
                    const audio = event.currentTarget;
                    if (!isRecording || !audio.duration) return;

                    const progress = Math.round((audio.currentTime / audio.duration) * 100);
                    setRecordingProgress(progress);
                  }}
                  onEnded={() => {
                    setIsPlaying(false);
                    if (isRecording) handleStopRecording();
                  }}
                  className="mt-5 w-full"
                  controls
                />
              ) : null}
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
