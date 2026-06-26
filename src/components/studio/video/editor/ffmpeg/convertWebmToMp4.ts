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

async function writeBlobToHandleInChunks(fileHandle: any, blob: Blob) {
  const writable = await fileHandle.createWritable();
  try {
    const chunkSize = 16 * 1024 * 1024; // 16MB chunks
    for (let offset = 0; offset < blob.size; offset += chunkSize) {
      const chunk = blob.slice(offset, offset + chunkSize);
      await writable.write(chunk);
    }
    await writable.close();
  } catch (err) {
    await writable.close().catch(() => {});
    throw err;
  }
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
  duration,
}: {
  webmBlob: Blob;
  title: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  fileName?: string;
  directoryHandle?: any;
  videoFormat?: "mp4" | "mov";
  duration?: number;
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
    const inputName = `input_${Date.now()}.webm`;
    const outputName = `output_${Date.now()}.${format}`;

    const handleAbort = () => {
      ffmpeg.terminate();
      ffmpegInstance = null;
      isLoaded = false;
    };

    signal?.addEventListener("abort", handleAbort, { once: true });

    try {
      let uint8Array: Uint8Array | null = null;
      try {
        const arrayBuffer = await webmBlob.arrayBuffer();
        uint8Array = new Uint8Array(arrayBuffer);
      } catch (readErr) {
        console.warn("Direct webmBlob.arrayBuffer() read failed, falling back to fetchFile:", readErr);
        uint8Array = await fetchFile(webmBlob);
      }
      await ffmpeg.writeFile(inputName, uint8Array);
      uint8Array = null; // Free JS memory reference IMMEDIATELY!
      throwIfAborted(signal);

      // Yield execution to allow GC
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const args = ["-i", inputName];
      
      // Limit output duration to prevent trailing black frames from MediaRecorder timing variance & AAC delay
      if (duration !== undefined && duration > 0) {
        args.push("-t", duration.toFixed(3));
      }

      args.push(
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
        outputName
      );

      await ffmpeg.exec(args);
      throwIfAborted(signal);

      const data = await ffmpeg.readFile(outputName);
      throwIfAborted(signal);

      // Delete immediately to free WASM FS memory!
      await ffmpeg.deleteFile(inputName).catch(() => { });
      await ffmpeg.deleteFile(outputName).catch(() => { });

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
          await writeBlobToHandleInChunks(fileHandle, videoBlob);
          console.log(`[convertWebmBlobToMp4] Successfully saved to directory: ${directoryHandle.name}`);
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
    } finally {
      signal?.removeEventListener("abort", handleAbort);
      if (onProgress) {
        ffmpeg.off("progress", progressListener);
      }
      // Explicitly terminate FFmpeg to release the entire WASM memory heap!
      try {
        ffmpeg.terminate();
        ffmpegInstance = null;
        isLoaded = false;
      } catch (e) {
        console.warn("Failed to terminate FFmpeg in convertWebmBlobToMp4 finally block:", e);
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

    const inputName = `input_${Date.now()}.mp4`;
    const outputName = `output_${Date.now()}.mov`;

    const handleAbort = () => {
      ffmpeg.terminate();
      ffmpegInstance = null;
      isLoaded = false;
    };

    signal?.addEventListener("abort", handleAbort, { once: true });

    try {
      let uint8Array: Uint8Array | null = null;
      try {
        uint8Array = new Uint8Array(await mp4Blob.arrayBuffer());
      } catch {
        uint8Array = await fetchFile(mp4Blob);
      }
      await ffmpeg.writeFile(inputName, uint8Array);
      uint8Array = null; // Free JS memory reference IMMEDIATELY!
      throwIfAborted(signal);

      // Yield execution to allow GC
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      // Stream copy (fast remuxing without transcoding)
      await ffmpeg.exec(["-i", inputName, "-c", "copy", outputName]);
      throwIfAborted(signal);

      const data = await ffmpeg.readFile(outputName);
      throwIfAborted(signal);

      // Delete immediately to free WASM FS memory!
      await ffmpeg.deleteFile(inputName).catch(() => { });
      await ffmpeg.deleteFile(outputName).catch(() => { });

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
          await writeBlobToHandleInChunks(fileHandle, movBlob);
          console.log(`[convertMp4BlobToMov] Successfully saved to directory: ${directoryHandle.name}`);
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
    } finally {
      signal?.removeEventListener("abort", handleAbort);
      if (onProgress) {
        ffmpeg.off("progress", progressListener);
      }
      // Explicitly terminate FFmpeg to release the entire WASM memory heap!
      try {
        ffmpeg.terminate();
        ffmpegInstance = null;
        isLoaded = false;
      } catch (e) {
        console.warn("Failed to terminate FFmpeg in convertMp4BlobToMov finally block:", e);
      }
    }
  });
}
