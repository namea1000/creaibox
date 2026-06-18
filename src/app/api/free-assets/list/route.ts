import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch records from free_assets table sorted by created_at desc
    const { data: files, error } = await supabase
      .from("free_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Database fetch failed: ${error.message}`);
    }

    const formattedFiles = (files || []).map((file) => ({
      id: file.gdrive_file_id,
      name: file.file_name,
      url: file.storage_url,
      mimeType: file.mime_type,
      size: file.width ? 0 : 0, // file size isn't critical for preview, can default to 0 or size column if added
      createdAt: file.created_at,
      title: file.title,
      tags: file.tags || [],
      mediaType: file.media_type,
      uploader: file.uploader,
      downloads: file.downloads_count || 0,
      views: file.views_count || 0,
      aspectRatio: file.aspect_ratio || "",
      generationType: file.generation_type || "real",
      width: file.width || 0,
      height: file.height || 0,
      camera: file.camera || "촬영 정보 없음",
    }));

    return NextResponse.json({ files: formattedFiles });
  } catch (error: any) {
    console.error("Failed to list free assets from database:", error);
    return NextResponse.json(
      { error: "Database query error", details: error.message },
      { status: 500 }
    );
  }
}
