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
  videoFormat = "mp4",
}: {
  webmBlob: Blob;
  title: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  fileName?: string;
  directoryHandle?: any;
  videoFormat?: "mp4" | "mov";
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

    const format = videoFormat || "mp4";
    const inputName = "input.webm";
    const outputName = `output.${format}`;

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

      const videoBlob = new Blob(
        [new Uint8Array(data as Uint8Array)],
        {
          type: format === "mp4" ? "video/mp4" : "video/quicktime",
        }
      );

      const finalFileName = fileName
        ? (fileName.endsWith(`.${format}`) ? fileName : `${fileName}.${format}`)
        : `${safeFileName(title)}.${format}`;

      if (directoryHandle) {
        try {
          console.log(`[convertWebmBlobToMp4] Attempting to save converted ${format.toUpperCase()} to directory: ${directoryHandle.name}`);
          const fileHandle = await directoryHandle.getFileHandle(finalFileName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(videoBlob);
          await writable.close();
          console.log(`[convertWebmBlobToMp4] Successfully saved to directory: ${directoryHandle.name}`);
          
          await ffmpeg.deleteFile(inputName).catch(() => { });
          await ffmpeg.deleteFile(outputName).catch(() => { });
          return;
        } catch (err) {
          console.warn("[convertWebmBlobToMp4] Directory write failed, falling back to download:", err);
        }
      }

      const url = URL.createObjectURL(videoBlob);
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

export async function convertMp4BlobToMov({
  mp4Blob,
  title,
  onProgress,
  signal,
  fileName,
  directoryHandle,
}: {
  mp4Blob: Blob;
  title: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  fileName?: string;
  directoryHandle?: any;
}) {
  throwIfAborted(signal);

  return runWithFFmpegLock(async (ffmpeg) => {
    const progressListener = ({ progress }: { progress: number }) => {
      onProgress?.(Math.round(progress * 100));
    };

    if (onProgress) {
      ffmpeg.on("progress", progressListener);
    }

    const inputName = "input.mp4";
    const outputName = "output.mov";

    const handleAbort = () => {
      ffmpeg.terminate();
      ffmpegInstance = null;
      isLoaded = false;
    };

    signal?.addEventListener("abort", handleAbort, { once: true });

    try {
      let uint8Array: Uint8Array;
      try {
        uint8Array = new Uint8Array(await mp4Blob.arrayBuffer());
      } catch {
        uint8Array = await fetchFile(mp4Blob);
      }
      await ffmpeg.writeFile(inputName, uint8Array);
      throwIfAborted(signal);

      // Stream copy (fast remuxing without transcoding)
      await ffmpeg.exec(["-i", inputName, "-c", "copy", outputName]);
      throwIfAborted(signal);

      const data = await ffmpeg.readFile(outputName);
      throwIfAborted(signal);

      const movBlob = new Blob(
        [new Uint8Array(data as Uint8Array)],
        {
          type: "video/quicktime",
        }
      );

      const finalFileName = fileName
        ? (fileName.endsWith(".mov") ? fileName : `${fileName}.mov`)
        : `${safeFileName(title)}.mov`;

      if (directoryHandle) {
        try {
          console.log(`[convertMp4BlobToMov] Saving to directory handle: ${directoryHandle.name}`);
          const fileHandle = await directoryHandle.getFileHandle(finalFileName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(movBlob);
          await writable.close();
          console.log(`[convertMp4BlobToMov] Successfully saved to directory: ${directoryHandle.name}`);
          
          await ffmpeg.deleteFile(inputName).catch(() => { });
          await ffmpeg.deleteFile(outputName).catch(() => { });
          return;
        } catch (err) {
          console.warn("[convertMp4BlobToMov] Directory write failed, falling back to download:", err);
        }
      }

      const url = URL.createObjectURL(movBlob);
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
