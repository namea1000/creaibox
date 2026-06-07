import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;

function safeFileName(value: string) {
  return (value || "audio-visualizer")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function getFfmpeg(onProgress?: (value: number) => void) {
  if (ffmpegInstance?.loaded) return ffmpegInstance;

  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.(Math.round(progress * 100));
  });

  await ffmpeg.load();

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export async function convertWebmToMp4({
  webmBlob,
  title,
  onProgress,
}: {
  webmBlob: Blob;
  title: string;
  onProgress?: (value: number) => void;
}) {
  const ffmpeg = await getFfmpeg(onProgress);

  const inputName = "input.webm";
  const outputName = "output.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(webmBlob));

  await ffmpeg.exec([
    "-i",
    inputName,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);

  if (typeof data === "string") {
    throw new Error("MP4 파일을 바이너리로 읽지 못했습니다.");
  }

  const bytes = data as Uint8Array;
  const blob = new Blob([bytes.slice()], { type: "video/mp4" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFileName(title)}.mp4`;
  a.click();
  URL.revokeObjectURL(url);

  await ffmpeg.deleteFile(inputName).catch(() => { });
  await ffmpeg.deleteFile(outputName).catch(() => { });
}