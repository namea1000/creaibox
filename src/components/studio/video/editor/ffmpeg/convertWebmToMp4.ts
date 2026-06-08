import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;

function safeFileName(value: string) {
  return (value || "creaibox-video")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function getFFmpeg(onProgress?: (progress: number) => void) {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }

  if (!isLoaded) {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";

    ffmpegInstance.on("progress", ({ progress }) => {
      onProgress?.(Math.round(progress * 100));
    });

    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    isLoaded = true;
  }

  return ffmpegInstance;
}

export async function convertWebmBlobToMp4({
  webmBlob,
  title,
  onProgress,
}: {
  webmBlob: Blob;
  title: string;
  onProgress?: (progress: number) => void;
}) {
  const ffmpeg = await getFFmpeg(onProgress);

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
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "faststart",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);

  const mp4Blob = new Blob(
    [new Uint8Array(data as Uint8Array)],
    {
      type: "video/mp4",
    }
  );

  const url = URL.createObjectURL(mp4Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFileName(title)}.mp4`;
  a.click();
  URL.revokeObjectURL(url);

  await ffmpeg.deleteFile(inputName).catch(() => { });
  await ffmpeg.deleteFile(outputName).catch(() => { });
}