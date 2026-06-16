import { fetchFile } from "@ffmpeg/util";
import { runWithFFmpegLock } from "./convertWebmToMp4";

export async function reverseVideo({
  file,
  hasAudio,
  trimStart = 0,
  trimEnd,
  onProgress,
}: {
  file: File;
  hasAudio: boolean;
  trimStart?: number;
  trimEnd?: number;
  onProgress?: (progress: number) => void;
}): Promise<Blob> {
  return runWithFFmpegLock(async (ffmpeg) => {
    const progressListener = ({ progress }: { progress: number }) => {
      onProgress?.(Math.round(progress * 100));
    };
    if (onProgress) {
      ffmpeg.on("progress", progressListener);
    }

    const logListener = ({ message }: { message: string }) => {
      console.log(`[FFmpeg Reverse Log] ${message}`);
    };
    ffmpeg.on("log", logListener);

    const extension = file.name.split(".").pop() || "mp4";
    const inputName = `input_${Date.now()}.${extension}`;
    const outputName = `reversed_${Date.now()}.mp4`;

    try {
      let uint8Array: Uint8Array | null = null;
      try {
        uint8Array = new Uint8Array(await file.arrayBuffer());
      } catch {
        uint8Array = await fetchFile(file);
      }
      await ffmpeg.writeFile(inputName, uint8Array);
      uint8Array = null; // Free memory

      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const duration = trimEnd !== undefined ? trimEnd - trimStart : undefined;

      // Try with audio first if hasAudio is true
      let success = false;
      if (hasAudio) {
        try {
          const args = [];
          if (trimStart > 0) args.push("-ss", String(trimStart));
          if (duration !== undefined && duration > 0) args.push("-t", String(duration));
          args.push("-i", inputName);
          
          args.push(
            "-vf", "reverse",
            "-af", "areverse",
            "-c:v", "libx264",
            "-c:a", "aac",
            "-preset", "veryfast",
            "-pix_fmt", "yuv420p",
            outputName
          );
          
          console.log("[reverseVideo] Executing FFmpeg reverse with audio (input seek):", args.join(" "));
          const exitCode = await ffmpeg.exec(args);
          if (exitCode === 0) {
            success = true;
          } else {
            console.warn(`[reverseVideo] FFmpeg failed with exit code ${exitCode}`);
          }
        } catch (e) {
          console.warn("[reverseVideo] Reversing with audio failed, falling back to video-only reverse:", e);
          try {
            await ffmpeg.deleteFile(outputName);
          } catch {}
        }
      }

      if (!success) {
        const args = [];
        if (trimStart > 0) args.push("-ss", String(trimStart));
        if (duration !== undefined && duration > 0) args.push("-t", String(duration));
        args.push("-i", inputName);

        args.push(
          "-vf", "reverse",
          "-an",
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-pix_fmt", "yuv420p",
          outputName
        );

        console.log("[reverseVideo] Executing FFmpeg reverse (video-only, input seek):", args.join(" "));
        const exitCode = await ffmpeg.exec(args);
        if (exitCode !== 0) {
          throw new Error(`FFmpeg reverse failed with exit code ${exitCode}`);
        }
      }

      const data = await ffmpeg.readFile(outputName);

      // Clean up files immediately from FFmpeg memory FS
      await ffmpeg.deleteFile(inputName).catch(() => {});
      await ffmpeg.deleteFile(outputName).catch(() => {});

      return new Blob([new Uint8Array(data as Uint8Array)], { type: "video/mp4" });
    } finally {
      ffmpeg.off("log", logListener);
      if (onProgress) {
        ffmpeg.off("progress", progressListener);
      }
    }
  });
}

export async function detectSceneChanges({
  file,
  trimStart = 0,
  trimEnd,
  onProgress,
}: {
  file: File;
  trimStart?: number;
  trimEnd?: number;
  onProgress?: (progress: number) => void;
}): Promise<number[]> {
  return runWithFFmpegLock(async (ffmpeg) => {
    const progressListener = ({ progress }: { progress: number }) => {
      onProgress?.(Math.round(progress * 100));
    };
    if (onProgress) {
      ffmpeg.on("progress", progressListener);
    }

    const ptsTimes: number[] = [];

    // Parse logs for showinfo's pts_time
    const logListener = ({ message }: { message: string }) => {
      console.log(`[FFmpeg Scene Log] ${message}`);
      if (message.includes("Parsed_showinfo") && message.includes("pts_time:")) {
        const match = message.match(/pts_time:\s*([0-9.]+)/);
        if (match && match[1]) {
          const time = parseFloat(match[1]);
          if (!ptsTimes.includes(time)) {
            ptsTimes.push(time);
          }
        }
      }
    };

    ffmpeg.on("log", logListener);

    const extension = file.name.split(".").pop() || "mp4";
    const inputName = `input_${Date.now()}.${extension}`;

    try {
      let uint8Array: Uint8Array | null = null;
      try {
        uint8Array = new Uint8Array(await file.arrayBuffer());
      } catch {
        uint8Array = await fetchFile(file);
      }
      await ffmpeg.writeFile(inputName, uint8Array);
      uint8Array = null;

      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const duration = trimEnd !== undefined ? trimEnd - trimStart : undefined;
      const args = [];

      if (trimStart > 0) {
        args.push("-ss", String(trimStart));
      }
      if (duration !== undefined && duration > 0) {
        args.push("-t", String(duration));
      }
      args.push("-i", inputName);

      args.push(
        "-vf", "select='gt(scene,0.3)',showinfo",
        "-an",
        "-f", "null",
        "-"
      );

      console.log("[detectSceneChanges] Executing scene detection (input seek):", args.join(" "));
      const exitCode = await ffmpeg.exec(args);
      if (exitCode !== 0) {
        throw new Error(`FFmpeg scene detection failed with exit code ${exitCode}`);
      }

      // Clean up files
      await ffmpeg.deleteFile(inputName).catch(() => {});

      return ptsTimes.sort((a, b) => a - b);
    } finally {
      ffmpeg.off("log", logListener);
      if (onProgress) {
        ffmpeg.off("progress", progressListener);
      }
    }
  });
}
