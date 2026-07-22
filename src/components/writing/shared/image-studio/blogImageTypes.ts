export interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  styleDetail?: string;
  prompt: string;
  type: "ai" | "stock";
  aspectRatio?: string;
  provider?: string;
  sourceType?: string;
  sourceId?: string;
  imageRole?: string;
  isPrimary?: boolean;
  alt_text?: string | null;
  title?: string | null;
  description?: string | null;
  caption?: string | null;
  created_at?: string | null;
}

export interface BlogImagePost {
  id: string;
  displayId?: number | string;
  title: string;
  keyword: string;
  content: string;
  type: "create" | "recreate";
}

export interface GeneratedImageRecord {
  id: string;
  image_url: string;
  prompt: string;
  style?: string | null;
  aspect_ratio?: string | null;
  provider?: string | null;
  source_type?: string | null;
  source_id?: string | null;
  image_role?: string | null;
  is_primary?: boolean | null;
  created_at?: string | null;
}

export interface BlogImagePreset {
  selectedProvider: string;
  selectedStyle: string;
  selectedStyleDetail: string;
  selectedAspectRatio: string;
  selectedThumbnailType: string;
  selectedTextIntensity: string;
  selectedLayout: string;
  selectedColorTone: string;
  selectedTextLanguage: string;
}

export interface BlogImageStudioPanelProps {
  sourceType: string;
  sourceId?: string;
  imageRole: "thumbnail" | "content_image" | string;
  title?: string;
  content?: string;
  targetKeyword?: string;
  mode?: "thumbnail" | "content";
  layout?: "full" | "side";
  usePostInventory?: boolean;
  postTableName?: string;
  presetStorageKey?: string;
}