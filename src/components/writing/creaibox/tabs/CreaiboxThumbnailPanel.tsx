"use client";

import BlogImageStudioPanel from "@/components/writing/shared/image-studio/BlogImageStudioPanel";
import type { StudioManuscriptRecord } from "@/lib/queries/manuscripts";

interface CreaiboxThumbnailPanelProps {
  data: StudioManuscriptRecord;
}

export default function CreaiboxThumbnailPanel({ data }: CreaiboxThumbnailPanelProps) {
  return (
    <BlogImageStudioPanel
      sourceType="writing_creaibox_posts"
      sourceId={String(data.id)}
      imageRole="thumbnail"
      mode="thumbnail"
      layout="side"
      title={data.title ?? ""}
      content={data.content ?? ""}
      targetKeyword={data.targetKeyword ?? data.focusKeyword ?? ""}
      presetStorageKey="creaibox:thumbnail:preset:v1"
    />
  );
}