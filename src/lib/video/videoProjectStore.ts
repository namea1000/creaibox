import { createClient } from "@/utils/supabase/client";
import type { CanvasRatio } from "@/components/studio/video/editor/VideoEditorContext";
import type { TimelineTrack } from "@/components/studio/video/editor/types";
import type { VideoEditorClip, VideoEditorMediaItem } from "@/components/studio/video/editor/VideoEditorContext";

// -------------------------------------------------------
// Types
// -------------------------------------------------------

export type VideoProjectMediaMeta = {
  id: string;
  type: string;
  name: string;
  duration: number;
  size: number;
  createdAt: string;
};

export type VideoProjectJson = {
  version: "creaibox-video-editor-v3";
  tracks: TimelineTrack[];
  clips: VideoEditorClip[];
  canvasRatio: CanvasRatio;
  mediaItems: VideoProjectMediaMeta[];
};

/** Lightweight row returned from list query (project_json excluded for Egress minimization) */
export type VideoProjectListRow = {
  id: string;
  user_id: string;
  title: string;
  canvas_ratio: string;
  duration: number;
  library_name: string;
  event_name: string;
  status: string;
  updated_at: string;
  created_at: string;
};

/** Full row returned when opening a single project */
export type VideoProjectFullRow = VideoProjectListRow & {
  project_json: VideoProjectJson | null;
};

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

// -------------------------------------------------------
// Queries
// -------------------------------------------------------

/**
 * List all active projects for the current user.
 * NEVER selects project_json to avoid Egress waste.
 */
export async function listUserProjects(): Promise<VideoProjectListRow[]> {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("video_projects")
    .select(
      "id, user_id, title, canvas_ratio, duration, library_name, event_name, status, updated_at, created_at"
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[videoProjectStore] listUserProjects:", error.message);
    return [];
  }
  return (data ?? []) as VideoProjectListRow[];
}

/**
 * Load a single project including project_json.
 * Only called when user actually opens a project.
 */
export async function loadProject(projectId: string): Promise<VideoProjectFullRow | null> {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("video_projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("[videoProjectStore] loadProject:", error.message);
    return null;
  }
  return data as VideoProjectFullRow;
}

// -------------------------------------------------------
// Mutations
// -------------------------------------------------------

/**
 * Create a new project row.
 * Returns the lightweight row (without project_json) for immediate UI update.
 */
export async function createProject(params: {
  title: string;
  canvasRatio: string;
  libraryName: string;
  eventName: string;
}): Promise<VideoProjectListRow | null> {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const emptyJson: VideoProjectJson = {
    version: "creaibox-video-editor-v3",
    tracks: [],
    clips: [],
    canvasRatio: params.canvasRatio as CanvasRatio,
    mediaItems: [],
  };

  const { data, error } = await supabase
    .from("video_projects")
    .insert({
      user_id: user.id,
      title: params.title,
      canvas_ratio: params.canvasRatio,
      library_name: params.libraryName,
      event_name: params.eventName,
      project_json: emptyJson,
      status: "active",
    })
    .select(
      "id, user_id, title, canvas_ratio, duration, library_name, event_name, status, updated_at, created_at"
    )
    .single();

  if (error) {
    console.error("[videoProjectStore] createProject:", error.message);
    return null;
  }
  return data as VideoProjectListRow;
}

/**
 * Save timeline state (project_json) for the current project.
 * Called by auto-save debounce and manual "DB 저장" button.
 */
export async function updateProjectJson(
  projectId: string,
  clips: VideoEditorClip[],
  tracks: TimelineTrack[],
  canvasRatio: CanvasRatio,
  mediaItems: VideoEditorMediaItem[]
): Promise<boolean> {
  const supabase = createClient();

  const json: VideoProjectJson = {
    version: "creaibox-video-editor-v3",
    tracks,
    clips,
    canvasRatio,
    mediaItems: mediaItems.map((m) => ({
      id: m.id,
      type: m.type,
      name: m.name,
      duration: m.duration ?? 0,
      size: m.size ?? 0,
      createdAt: m.createdAt,
    })),
  };

  const totalDuration = clips.reduce((max, c) => Math.max(max, c.startTime + c.duration), 0);

  const { error } = await supabase
    .from("video_projects")
    .update({
      project_json: json,
      canvas_ratio: canvasRatio,
      duration: Math.round(totalDuration),
    })
    .eq("id", projectId);

  if (error) {
    console.error("[videoProjectStore] updateProjectJson:", error.message);
    return false;
  }
  return true;
}

/**
 * Update lightweight metadata (title, library_name, event_name).
 */
export async function updateProjectMeta(
  projectId: string,
  meta: Partial<{ title: string; library_name: string; event_name: string; canvas_ratio: string }>
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("video_projects")
    .update(meta)
    .eq("id", projectId);

  if (error) {
    console.error("[videoProjectStore] updateProjectMeta:", error.message);
    return false;
  }
  return true;
}

/**
 * Soft-delete a project (status = 'deleted').
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("video_projects")
    .update({ status: "deleted" })
    .eq("id", projectId);

  if (error) {
    console.error("[videoProjectStore] deleteProject:", error.message);
    return false;
  }
  return true;
}

/**
 * Rename all projects belonging to a library.
 */
export async function renameLibrary(oldName: string, newName: string): Promise<boolean> {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase
    .from("video_projects")
    .update({ library_name: newName })
    .eq("user_id", user.id)
    .eq("library_name", oldName)
    .eq("status", "active");

  if (error) {
    console.error("[videoProjectStore] renameLibrary:", error.message);
    return false;
  }
  return true;
}

/**
 * Rename all projects belonging to an event within a library.
 */
export async function renameEvent(
  libraryName: string,
  oldEventName: string,
  newEventName: string
): Promise<boolean> {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase
    .from("video_projects")
    .update({ event_name: newEventName })
    .eq("user_id", user.id)
    .eq("library_name", libraryName)
    .eq("event_name", oldEventName)
    .eq("status", "active");

  if (error) {
    console.error("[videoProjectStore] renameEvent:", error.message);
    return false;
  }
  return true;
}

/**
 * Soft-delete all projects in a library.
 */
export async function deleteLibrary(libraryName: string): Promise<boolean> {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase
    .from("video_projects")
    .update({ status: "deleted" })
    .eq("user_id", user.id)
    .eq("library_name", libraryName);

  if (error) {
    console.error("[videoProjectStore] deleteLibrary:", error.message);
    return false;
  }
  return true;
}

/**
 * Soft-delete all projects in an event.
 */
export async function deleteEvent(libraryName: string, eventName: string): Promise<boolean> {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase
    .from("video_projects")
    .update({ status: "deleted" })
    .eq("user_id", user.id)
    .eq("library_name", libraryName)
    .eq("event_name", eventName);

  if (error) {
    console.error("[videoProjectStore] deleteEvent:", error.message);
    return false;
  }
  return true;
}

// -------------------------------------------------------
// State reconstruction helpers
// -------------------------------------------------------

/**
 * From a list of VideoProjectListRow, rebuild:
 * - unique library names (string[])
 * - unique event items ({ id, name, libraryName }[])
 * - project items matching the ProjectItem shape used in VideoEditorUnifiedLibrary
 *
 * Event ID format: "libraryName:::eventName" (composite key, no UUID needed)
 */
export function buildEditorStateFromRows(rows: VideoProjectListRow[]) {
  const librarySet = new Set<string>();
  const eventMap = new Map<string, { id: string; name: string; libraryName: string }>();

  for (const row of rows) {
    librarySet.add(row.library_name);
    const eventKey = `${row.library_name}:::${row.event_name}`;
    if (!eventMap.has(eventKey)) {
      eventMap.set(eventKey, {
        id: eventKey,
        name: row.event_name,
        libraryName: row.library_name,
      });
    }
  }

  const libraries = Array.from(librarySet);
  const events = Array.from(eventMap.values());
  const projects = rows.map((row) => ({
    id: row.id,                                               // UUID from DB
    title: row.title,
    ratio: (row.canvas_ratio ?? "16:9") as CanvasRatio,
    duration: row.duration ?? 0,
    updatedAt: row.updated_at ?? "",
    assetCount: 0,
    eventId: `${row.library_name}:::${row.event_name}`,       // composite event key
    // clips/tracks intentionally omitted: loaded only when project is opened
  }));

  return { libraries, events, projects };
}
