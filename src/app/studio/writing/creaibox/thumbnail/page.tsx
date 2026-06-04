"use client";

import BlogImageStudioPanel from "@/components/writing/shared/image-studio/BlogImageStudioPanel";

export default function CreaiboxThumbnailPage() {
  return (
    <BlogImageStudioPanel
      sourceType="writing_creaibox_posts"
      imageRole="thumbnail"
      mode="thumbnail"
      layout="full"
      usePostInventory
      postTableName="writing_creaibox_posts"
      presetStorageKey="creaibox:thumbnail:preset:v1"
    />
  );
}