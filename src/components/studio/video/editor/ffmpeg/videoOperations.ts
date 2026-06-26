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

      // Define a tiered list of configurations to try sequentially.
      // High-resolution videos (1080p, 4K) easily cause OOM in 32-bit WASM during reversal
      // because the 'reverse' filter buffers all uncompressed frames in memory.
      // If full resolution fails, we fall back to downscaling to ensure successful completion.
      const configs = [
        // 1. Full Resolution + Audio (Original)
        { name: "원본 해상도 (오디오 포함)", vf: "reverse", af: hasAudio ? "areverse" : undefined },
        // 2. Full Resolution (Video Only)
        { name: "원본 해상도 (비디오 전용)", vf: "reverse", af: undefined },
        // 3. 720p Scale + Audio (optimized for memory)
        { name: "720p 최적화 해상도 (오디오 포함)", vf: "scale=-2:720,reverse", af: hasAudio ? "areverse" : undefined },
        // 4. 720p Scale (Video Only)
        { name: "720p 최적화 해상도 (비디오 전용)", vf: "scale=-2:720,reverse", af: undefined },
        // 5. 480p Scale + Audio (standard quality fallback)
        { name: "480p 최적화 해상도 (오디오 포함)", vf: "scale=-2:480,reverse", af: hasAudio ? "areverse" : undefined },
        // 6. 480p Scale (Video Only)
        { name: "480p 최적화 해상도 (비디오 전용)", vf: "scale=-2:480,reverse", af: undefined },
        // 7. 360p Scale (Video Only, maximum safety fallback)
        { name: "360p 최적화 해상도 (비디오 전용)", vf: "scale=-2:360,reverse", af: undefined },
      ];

      let success = false;
      let lastError: any = null;

      for (const config of configs) {
        // Skip if this config requires audio but the source doesn't have it
        if (config.af && !hasAudio) continue;

        try {
          console.log(`[reverseVideo] Attempting reverse: ${config.name}`);
          
          const args = [];
          if (trimStart > 0) args.push("-ss", String(trimStart));
          if (duration !== undefined && duration > 0) args.push("-t", String(duration));
          args.push("-i", inputName);

          args.push("-vf", config.vf);
          if (config.af) {
            args.push("-af", config.af);
            args.push("-c:a", "aac");
          } else {
            args.push("-an");
          }

          args.push(
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-pix_fmt", "yuv420p",
            outputName
          );

          console.log(`[reverseVideo] Executing FFmpeg: ${args.join(" ")}`);
          const exitCode = await ffmpeg.exec(args);
          
          if (exitCode === 0) {
            console.log(`[reverseVideo] Successfully reversed video using config: ${config.name}`);
            success = true;
            break;
          } else {
            console.warn(`[reverseVideo] FFmpeg exit code ${exitCode} for config: ${config.name}`);
            try {
              await ffmpeg.deleteFile(outputName);
            } catch {}
          }
        } catch (e) {
          console.warn(`[reverseVideo] Failed with error for config "${config.name}":`, e);
          lastError = e;
          try {
            await ffmpeg.deleteFile(outputName);
          } catch {}
        }
      }

      if (!success) {
        throw lastError || new Error("모든 역재생 변환 시도가 실패했습니다. 비디오 파일이 너무 크거나 포맷이 호환되지 않습니다.");
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
