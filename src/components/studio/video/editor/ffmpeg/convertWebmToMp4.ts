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

export async function getFFmpeg(onProgress?: (progress: number) => void) {
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

export function terminateFFmpeg() {
  if (ffmpegInstance) {
    try {
      ffmpegInstance.terminate();
    } catch (e) {
      console.warn("Failed to terminate FFmpeg:", e);
    }
    ffmpegInstance = null;
    isLoaded = false;
  }
}

function throwIfAborted(signal?: AbortSignal) {
  if (!signal?.aborted) return;
  throw new DOMException("Export cancelled", "AbortError");
}

let ffmpegLockPromise: Promise<any> = Promise.resolve();

export async function runWithFFmpegLock<T>(action: (ffmpeg: FFmpeg) => Promise<T>): Promise<T> {
  const nextLock = ffmpegLockPromise.then(async () => {
    if (!ffmpegInstance) {
      ffmpegInstance = new FFmpeg();
    }
    await getFFmpeg();
    return action(ffmpegInstance);
  });

  ffmpegLockPromise = nextLock.then(
    () => {},
    () => {}
  );

  return nextLock;
}

export async function convertWebmBlobToMp4({
  webmBlob,
  title,
  onProgress,
  signal,
  fileName,
  directoryHandle,
}: {
  webmBlob: Blob;
  title: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  fileName?: string;
  directoryHandle?: any;
}) {
  throwIfAborted(signal);

  return runWithFFmpegLock(async (ffmpeg) => {
    // Temporarily attach progress listener for the current export run
    const progressListener = ({ progress }: { progress: number }) => {
      onProgress?.(Math.round(progress * 100));
    };

    if (onProgress) {
      ffmpeg.on("progress", progressListener);
    }

    const inputName = "input.webm";
    const outputName = "output.mp4";

    const handleAbort = () => {
      ffmpeg.terminate();
      ffmpegInstance = null;
      isLoaded = false;
    };

    signal?.addEventListener("abort", handleAbort, { once: true });

    try {
      let uint8Array: Uint8Array;
      try {
        const arrayBuffer = await webmBlob.arrayBuffer();
        uint8Array = new Uint8Array(arrayBuffer);
      } catch (readErr) {
        console.warn("Direct webmBlob.arrayBuffer() read failed, falling back to fetchFile:", readErr);
        uint8Array = await fetchFile(webmBlob);
      }
      await ffmpeg.writeFile(inputName, uint8Array);
      throwIfAborted(signal);

      await ffmpeg.exec([
        "-i",
        inputName,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-c:a",
        "aac",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "faststart",
        outputName,
      ]);
      throwIfAborted(signal);

      const data = await ffmpeg.readFile(outputName);
      throwIfAborted(signal);

      const mp4Blob = new Blob(
        [new Uint8Array(data as Uint8Array)],
        {
          type: "video/mp4",
        }
      );

      const finalFileName = fileName
        ? (fileName.endsWith(".mp4") ? fileName : `${fileName}.mp4`)
        : `${safeFileName(title)}.mp4`;

      if (directoryHandle) {
        try {
          console.log(`[convertWebmBlobToMp4] Attempting to save converted MP4 to directory: ${directoryHandle.name}`);
          const fileHandle = await directoryHandle.getFileHandle(finalFileName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(mp4Blob);
          await writable.close();
          console.log(`[convertWebmBlobToMp4] Successfully saved to directory: ${directoryHandle.name}`);
          
          await ffmpeg.deleteFile(inputName).catch(() => { });
          await ffmpeg.deleteFile(outputName).catch(() => { });
          return;
        } catch (err) {
          console.warn("[convertWebmBlobToMp4] Directory write failed, falling back to download:", err);
        }
      }

      const url = URL.createObjectURL(mp4Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = finalFileName;
      a.click();
      URL.revokeObjectURL(url);

      await ffmpeg.deleteFile(inputName).catch(() => { });
      await ffmpeg.deleteFile(outputName).catch(() => { });
    } finally {
      signal?.removeEventListener("abort", handleAbort);
      if (onProgress) {
        ffmpeg.off("progress", progressListener);
      }
    }
  });
}
