"use client";

import { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  BarChart3,
  CircleDot,
  Disc3,
  Music,
  Orbit,
  Play,
  Pause,
  Sparkles,
  Upload,
  Waves,
  Plus,
} from "lucide-react";
import { useVideoEditor } from "./VideoEditorContext";

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
  | "minimal";

const templates: {
  id: VisualizerTemplate;
  title: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { id: "bars", title: "Spectrum Bars", desc: "기본 막대형", icon: BarChart3 },
  { id: "mirror-bars", title: "Mirror Bars", desc: "상하 대칭", icon: AudioLines },
  { id: "skyline", title: "Neon Skyline", desc: "스카이라인", icon: BarChart3 },
  { id: "circle", title: "Circle Pulse", desc: "원형", icon: CircleDot },
  { id: "radial-dots", title: "Radial Dots", desc: "원형 도트", icon: Orbit },
  { id: "wave", title: "Wave Line", desc: "파형 라인", icon: Waves },
  { id: "twin-wave", title: "Twin Wave", desc: "쌍파형", icon: Waves },
  { id: "dots", title: "Beat Dots", desc: "비트 도트", icon: Sparkles },
  { id: "line", title: "Neon Flow", desc: "네온 라인", icon: Sparkles },
  { id: "progress", title: "Progress Glow", desc: "진행바", icon: BarChart3 },
  { id: "ring", title: "Glow Ring", desc: "링", icon: CircleDot },
  { id: "orbit", title: "Orbit Pulse", desc: "궤도형", icon: Orbit },
  { id: "equalizer", title: "EQ Blocks", desc: "이퀄라이저", icon: BarChart3 },
  { id: "mountain", title: "Sound Mountain", desc: "산맥", icon: Waves },
  { id: "tunnel", title: "Audio Tunnel", desc: "터널", icon: CircleDot },
  { id: "particles", title: "Particles", desc: "입자", icon: Sparkles },
  { id: "pulse-square", title: "Pulse Square", desc: "사각 펄스", icon: BarChart3 },
  { id: "vinyl", title: "Vinyl Disc", desc: "LP", icon: Disc3 },
  { id: "heartbeat", title: "Heartbeat", desc: "박동선", icon: Waves },
  { id: "minimal", title: "Minimal Line", desc: "미니멀", icon: Music },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function VideoEditorVisualizerPanel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const smoothedFreqRef = useRef<{ count: number; values: number[] }>({
    count: 0,
    values: [],
  });

  const { addVisualizerClip } = useVideoEditor();

  const [audioUrl, setAudioUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [template, setTemplate] = useState<VisualizerTemplate>("circle");

  const [accentColor, setAccentColor] = useState("#ff4fd8");
  const [backgroundColor, setBackgroundColor] = useState("#050507");
  const [spectrumY, setSpectrumY] = useState(50);
  const [spectrumHeight, setSpectrumHeight] = useState(58);
  const [spectrumWidth, setSpectrumWidth] = useState(92);

  const displayTitle = fileName.replace(/\.[^/.]+$/, "") || "Audio Visualizer";

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    audioRef.current.load();
  }, [audioUrl]);



  const setupAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;

    if (!sourceRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.78;

      const source = audioContext.createMediaElementSource(audio);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      sourceRef.current = source;
      analyserRef.current = analyser;
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

  const handlePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      window.alert("먼저 오디오 파일을 업로드하세요.");
      return;
    }

    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
    }

    await setupAudio();

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await audio.play();
    setIsPlaying(true);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
        smoothedFreqRef.current = {
          count: safeCount,
          values: Array(safeCount).fill(targetValue),
        };
      }

      const previousValue = smoothedFreqRef.current.values[i] ?? targetValue;
      const smoothing = targetValue > previousValue ? 0.34 : 0.22;
      const visibleValue = previousValue + (targetValue - previousValue) * smoothing;
      smoothedFreqRef.current.values[i] = visibleValue;

      return visibleValue;
    };

    const frame = () => {
      analyser.getByteFrequencyData(freq);
      analyser.getByteTimeDomainData(wave);

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

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, accentColor);
      gradient.addColorStop(0.5, "#d946ef");
      gradient.addColorStop(1, "#22d3ee");

      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.shadowBlur = 18;
      ctx.shadowColor = accentColor;

      const avg = freq.reduce((a, b) => a + b, 0) / Math.max(freq.length, 1);
      const spectrumCenterY = height * (spectrumY / 100);
      const spectrumMaxHeight = height * (spectrumHeight / 100);
      const spectrumDrawWidth = width * (spectrumWidth / 100);
      const spectrumStartX = (width - spectrumDrawWidth) / 2;

      if (template === "bars" || template === "skyline") {
        const count = template === "skyline" ? 72 : 96;
        const barWidth = spectrumDrawWidth / count;
        const skylineBaseY = clamp(spectrumCenterY + spectrumMaxHeight / 2, 0, height);

        for (let i = 0; i < count; i += 1) {
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

        for (let i = 0; i < count; i += 1) {
          const value = getFreq(i, count);
          const barHeight = (value / 255) * (spectrumMaxHeight * 0.5);
          const x = spectrumStartX + i * barWidth;

          ctx.fillRect(x + 3, spectrumCenterY - barHeight, Math.max(barWidth - 6, 2), barHeight);
          ctx.fillRect(x + 3, spectrumCenterY, Math.max(barWidth - 6, 2), barHeight);
        }
      }

      if (
        template === "circle" ||
        template === "ring" ||
        template === "orbit" ||
        template === "radial-dots"
      ) {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.2 + avg * 0.12;
        const count = template === "radial-dots" ? 90 : 140;

        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius - 22, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < count; i += 1) {
          const value = getFreq(i, count);
          const angle = (i / count) * Math.PI * 2;
          const amp = (value / 255) * 150;

          if (template === "radial-dots") {
            const r = baseRadius + amp;
            ctx.beginPath();
            ctx.arc(
              cx + Math.cos(angle) * r,
              cy + Math.sin(angle) * r,
              3 + value / 45,
              0,
              Math.PI * 2
            );
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
          for (let i = 0; i < 3; i += 1) {
            ctx.beginPath();
            ctx.arc(
              cx,
              cy,
              baseRadius + 70 + i * 38 + Math.sin(Date.now() / 500 + i) * 8,
              0,
              Math.PI * 2
            );
            ctx.stroke();
          }
        }
      }

      if (
        template === "wave" ||
        template === "twin-wave" ||
        template === "line" ||
        template === "mountain" ||
        template === "heartbeat" ||
        template === "minimal"
      ) {
        const count = template === "minimal" ? 80 : bufferLength;
        ctx.beginPath();

        for (let i = 0; i < count; i += 1) {
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
          for (let i = 0; i < count; i += 1) {
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

        for (let i = 0; i < count; i += 1) {
          const value = getFreq(i, count);
          const x =
            template === "particles"
              ? (Math.sin(i * 12.989 + Date.now() / 900) * 0.5 + 0.5) * width
              : (i / count) * width;
          const y =
            template === "particles"
              ? (Math.cos(i * 7.12 + Date.now() / 1200) * 0.5 + 0.5) * height
              : height / 2 + Math.sin(i * 0.4) * 60;
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

        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.rect(x, y, progressWidth, progressHeight);
        ctx.fill();

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.rect(x, y, progressWidth * value, progressHeight);
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

        for (let i = 0; i < cols; i += 1) {
          const value = getFreq(i, cols);
          const activeRows = Math.ceil((value / 255) * rows);

          for (let j = 0; j < activeRows; j += 1) {
            ctx.fillRect(startX + i * (blockW + gap), baseY - j * (blockH + gap), blockW, blockH);
          }
        }
      }

      if (template === "tunnel") {
        const cx = width / 2;
        const cy = height / 2;

        for (let i = 0; i < 12; i += 1) {
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
        ctx.rect(width / 2 - size / 2, height / 2 - size / 2, size, size);
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

        for (let i = 0; i < 6; i += 1) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius - i * 24, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 42 + avg * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.font = "900 38px sans-serif";
      ctx.textAlign = "center";
      ctx.shadowBlur = 18;
      ctx.shadowColor = accentColor;
      ctx.fillText(displayTitle, width / 2, height - 58);
      ctx.restore();

      animationRef.current = requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    if (analyserRef.current) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, accentColor, backgroundColor, spectrumY, spectrumHeight, spectrumWidth]);

  const handleCanvasSpectrumDrag = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextY = ((event.clientY - rect.top) / rect.height) * 100;
    setSpectrumY(Math.round(clamp(nextY, 5, 95)));
  };

  return (
    <div className="space-y-4 rounded-none border border-white/10 bg-black/20 p-4">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-black text-white">
          <Waves className="text-pink-300" size={20} />
          Visualizer
        </h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          오디오 스펙트럼 엔진을 사용하여 비디오와 동기화되는 비주얼라이저 클립을 추가합니다.
        </p>
      </div>

      <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-none bg-pink-500 text-sm font-black text-white hover:bg-pink-400">
        <Upload size={17} />
        오디오 업로드
        <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
      </label>

      <div className="rounded-none border border-white/10 bg-black/30 p-3 text-xs leading-5 text-zinc-400">
        <div className="font-bold text-white">{fileName || "오디오 없음 (기본 데모 파동)"}</div>
        <div className="mt-1">선택 템플릿: {template}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
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
              className={`rounded-none border p-3 text-left transition ${active
                  ? "border-pink-400 bg-pink-400/10"
                  : "border-white/10 bg-black/30 hover:border-pink-400/50"
                }`}
            >
              <Icon className="mb-2 text-pink-300" size={18} />
              <div className="text-xs font-black text-white">{item.title}</div>
              <div className="mt-1 text-[10px] text-zinc-500">{item.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 rounded-none border border-white/10 bg-black/30 p-3">
        <ColorField label="Accent" value={accentColor} onChange={setAccentColor} />
        <ColorField label="Background" value={backgroundColor} onChange={setBackgroundColor} />

        <RangeField
          label="세로 위치"
          value={spectrumY}
          min={5}
          max={95}
          onChange={setSpectrumY}
        />
        <RangeField
          label="세로 크기"
          value={spectrumHeight}
          min={10}
          max={95}
          onChange={setSpectrumHeight}
        />
        <RangeField
          label="가로 폭"
          value={spectrumWidth}
          min={20}
          max={100}
          onChange={setSpectrumWidth}
        />
      </div>

      <div className="overflow-hidden rounded-none border border-white/10 bg-black">
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
          className="aspect-video w-full cursor-ns-resize touch-none"
        />
      </div>

      {audioUrl ? (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="w-full"
          controls
        />
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handlePlay}
          className="flex h-11 items-center justify-center gap-2 rounded-none bg-zinc-800 text-xs font-bold text-white hover:bg-zinc-700"
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          {isPlaying ? "일시정지" : "미리보기 재생"}
        </button>

        <button
          type="button"
          onClick={addVisualizerClip}
          className="flex h-11 items-center justify-center gap-2 rounded-none bg-cyan-400 text-xs font-black text-black hover:bg-cyan-300"
        >
          <Plus size={15} />
          타임라인에 추가
        </button>
      </div>

      <div className="rounded-none border border-amber-400/20 bg-amber-400/10 p-3 text-[11px] leading-5 text-amber-100">
        오디오를 업로드하거나 템플릿을 선택한 뒤 [타임라인에 추가]를 클릭하면 편집기에 실시간 동적 비주얼 스펙트럼 레이어가 적용됩니다.
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-xs font-bold text-zinc-400">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-zinc-400">
        <span>{label}</span>
        <span className="text-cyan-200">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-300"
      />
    </label>
  );
}