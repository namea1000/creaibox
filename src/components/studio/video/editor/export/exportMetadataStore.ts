import { createClient } from "@/utils/supabase/client";
import type { VideoRenderQueueItem } from "./exportJobStore";
import type { VideoExportEngine } from "./exportTypes";

export type VideoProjectExportDbStatus =
  | "created"
  | "rendering"
  | "completed"
  | "failed"
  | "canceled";

export type VideoProjectExportRecord = {
  id: string;
  project_id: string | null;
  user_id: string;
  title: string;
  export_resolution: string;
  export_fps: number;
  export_quality: string;
  output_file_name: string | null;
  output_local_key: string | null;
  status: VideoProjectExportDbStatus | string;
  progress: number;
  created_at: string;
};

export type ExportMetadataResult =
  | { saved: true; record: VideoProjectExportRecord }
  | { saved: false; reason: string };

type ExportMetadataPayload = {
  status: VideoProjectExportDbStatus;
  progress: number;
  outputFileName?: string;
  outputLocalKey?: string;
};

export async function createVideoProjectExportRecord(
  job: VideoRenderQueueItem,
): Promise<ExportMetadataResult> {
  const user = await getCurrentUser();
  if (!user) return { saved: false, reason: "로그인 사용자가 없어 export 기록 저장을 건너뜁니다." };

  const outputFileName = buildOutputFileName(job);
  const outputLocalKey = buildOutputLocalKey(job.id, outputFileName);
  const supabase = createClient();

  const { data, error } = await supabase
    .from("video_project_exports")
    .insert({
      user_id: user.id,
      project_id: null,
      title: job.projectTitle,
      export_resolution: job.resolution,
      export_fps: job.fps,
      export_quality: job.quality,
      output_file_name: outputFileName,
      output_local_key: outputLocalKey,
      status: "created",
      progress: 0,
    })
    .select("*")
    .single();

  if (error) return { saved: false, reason: error.message };
  return { saved: true, record: data as VideoProjectExportRecord };
}

export async function updateVideoProjectExportRecord(
  id: string | undefined,
  payload: ExportMetadataPayload,
): Promise<ExportMetadataResult> {
  if (!id) return { saved: false, reason: "export record id가 없습니다." };

  const user = await getCurrentUser();
  if (!user) return { saved: false, reason: "로그인 사용자가 없어 export 기록 업데이트를 건너뜁니다." };

  const supabase = createClient();
  const updatePayload: Record<string, string | number> = {
    status: payload.status,
    progress: Math.max(0, Math.min(100, Math.round(payload.progress))),
  };

  if (payload.outputFileName) updatePayload.output_file_name = payload.outputFileName;
  if (payload.outputLocalKey) updatePayload.output_local_key = payload.outputLocalKey;

  const { data, error } = await supabase
    .from("video_project_exports")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { saved: false, reason: error.message };
  return { saved: true, record: data as VideoProjectExportRecord };
}

export async function fetchRecentVideoProjectExportRecords(limit = 6) {
  const user = await getCurrentUser();
  if (!user) return { records: [] as VideoProjectExportRecord[], skippedReason: "로그인 전" };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("video_project_exports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { records: [] as VideoProjectExportRecord[], skippedReason: error.message };
  return { records: (data || []) as VideoProjectExportRecord[] };
}

export function buildOutputFileName(job: {
  projectTitle: string;
  engine: VideoExportEngine;
  audioFormat?: "mp3" | "wav" | "aac";
}) {
  if (job.engine === "audio-only") {
    const ext = job.audioFormat || "mp3";
    return `${safeFileName(job.projectTitle)}.${ext}`;
  }
  const extension =
    job.engine === "compatible-mp4" || job.engine === "direct-mp4"
      ? "mp4"
      : "webm";
  const suffix =
    job.engine === "fast-webcodecs"
      ? "-fast-webcodecs"
      : job.engine === "direct-mp4"
        ? "-direct-mp4"
        : "";
  return `${safeFileName(job.projectTitle)}${suffix}.${extension}`;
}

function buildOutputLocalKey(jobId: string, outputFileName: string) {
  return `local-export://${jobId}/${outputFileName}`;
}

async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

function safeFileName(value: string) {
  return (value || "creaibox-video")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
