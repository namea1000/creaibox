import { NextRequest, NextResponse } from "next/server";
import { uploadFreeAsset } from "@/lib/google-drive";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const folderId = process.env.GDRIVE_FREE_ASSETS_FOLDER_ID;

  if (!folderId) {
    return NextResponse.json(
      { error: "GDRIVE_FREE_ASSETS_FOLDER_ID is not configured in .env.local." },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const tagsString = formData.get("tags") as string | null;
    const mediaType = formData.get("mediaType") as string | null;
    const aspectRatio = formData.get("aspectRatio") as string | null;
    const generationType = formData.get("generationType") as string | null;
    const width = formData.get("width") as string | null;
    const height = formData.get("height") as string | null;
    const camera = formData.get("camera") as string | null;
    const prompt = formData.get("prompt") as string | null;
    const aiTool = formData.get("aiTool") as string | null;
 
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
 
    // Determine uploader from session if possible
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const uploader = user?.email || "익명 기여자";
 
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
 
    // Format tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];
 
    const metadata = {
      title: title || file.name,
      tags,
      mediaType: mediaType || "photo",
      uploader,
      downloads: 0,
      views: 0,
      aspectRatio: aspectRatio || "",
      generationType: generationType || "real",
      width: width ? parseInt(width, 10) : 0,
      height: height ? parseInt(height, 10) : 0,
      camera: camera || "촬영 정보 없음",
      prompt: prompt || "",
      aiTool: aiTool || "",
    };

    const description = JSON.stringify(metadata);
    
    // Create unique filename to prevent folder name clutter
    const fileExt = file.name.split(".").pop() || "png";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const uniqueFileName = `${baseName}_${Date.now()}.${fileExt}`;

    const fileUrl = await uploadFreeAsset(buffer, uniqueFileName, file.type, description);

    // Parse fileId from Direct download URL
    const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = fileIdMatch ? fileIdMatch[1] : "";

    // Determine YYYYMM and mediaType
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}${month}`;

    let normMediaType = "image";
    const mType = metadata.mediaType;
    if (mType) {
      if (["photo", "illustration", "vector", "gif"].includes(mType) || file.type.startsWith("image/")) {
        normMediaType = "image";
      } else if (mType === "music" || file.type.startsWith("audio/")) {
        normMediaType = "music";
      } else if (mType === "video" || file.type.startsWith("video/")) {
        normMediaType = "video";
      } else {
        normMediaType = mType.replace(/[^a-z0-9_-]/gi, "-");
      }
    } else {
      if (file.type.startsWith("audio/")) normMediaType = "music";
      else if (file.type.startsWith("video/")) normMediaType = "video";
    }

    // Insert record into Supabase free_assets table
    if (fileId) {
      const { error: dbError } = await supabase
        .from("free_assets")
        .insert({
          gdrive_file_id: fileId,
          storage_url: fileUrl,
          file_name: file.name,
          mime_type: file.type,
          media_type: metadata.mediaType || normMediaType,
          year_month: yearMonth,
          title: metadata.title || file.name,
          tags: metadata.tags || [],
          uploader: metadata.uploader || "익명",
          downloads_count: 0,
          views_count: 0,
          width: metadata.width || 0,
          height: metadata.height || 0,
          aspect_ratio: metadata.aspectRatio || "",
          generation_type: metadata.generationType || "real",
          camera: metadata.camera || "촬영 정보 없음",
          prompt: metadata.prompt || "",
          ai_tool: metadata.aiTool || "",
        });

      if (dbError) {
        console.error("Failed to insert free asset to Supabase free_assets:", dbError.message);
      }
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      metadata,
    });
  } catch (error: any) {
    console.error("Failed to upload free asset to Google Drive:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
