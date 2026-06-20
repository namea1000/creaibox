import { NextRequest, NextResponse } from "next/server";
import { updateAssetMetadata, getAssetMetadata } from "@/lib/google-drive";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { fileId, title, tags, mediaType, generationType, aspectRatio, width, height, camera, prompt, aiTool } = await req.json();
    
    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // 1. Check authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if user is ADMIN in profiles table or admin_whitelist
    let isAdmin = false;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    
    if (profile?.role === "ADMIN" || profile?.role === "STAFF") {
      isAdmin = true;
    } else if (user.email) {
      const { data: whitelist } = await supabase
        .from("admin_whitelist")
        .select("email")
        .eq("email", user.email)
        .maybeSingle();
      if (whitelist) {
        isAdmin = true;
      }
    }

    // 3. Fetch file metadata to check the uploader
    const { metadata } = await getAssetMetadata(fileId);
    const uploader = metadata.uploader || "";

    // 4. Authorization check: must be uploader or ADMIN
    const isUploader = uploader.toLowerCase() === (user.email || "").toLowerCase();
    if (!isUploader && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to update this asset." },
        { status: 403 }
      );
    }

    // 5. Update asset metadata
    await updateAssetMetadata(fileId, {
      title,
      tags: Array.isArray(tags) ? tags : [],
      mediaType: mediaType || "photo",
      generationType: generationType || "real",
      aspectRatio: aspectRatio || "",
      width: width !== undefined ? parseInt(width, 10) : undefined,
      height: height !== undefined ? parseInt(height, 10) : undefined,
      camera: camera !== undefined ? camera : undefined,
      prompt: prompt !== undefined ? prompt : undefined,
      aiTool: aiTool !== undefined ? aiTool : undefined,
    });

    // 6. Update record in Supabase DB
    let normMediaType = "image";
    if (mediaType) {
      if (["photo", "illustration", "vector", "gif"].includes(mediaType)) {
        normMediaType = "image";
      } else if (mediaType === "music") {
        normMediaType = "music";
      } else if (mediaType === "video") {
        normMediaType = "video";
      } else {
        normMediaType = mediaType.replace(/[^a-z0-9_-]/gi, "-");
      }
    }

    const { error: dbError } = await supabase
      .from("free_assets")
      .update({
        title,
        tags: Array.isArray(tags) ? tags : [],
        media_type: mediaType || normMediaType,
        generation_type: generationType || "real",
        aspect_ratio: aspectRatio || "",
        width: width !== undefined ? parseInt(width, 10) : undefined,
        height: height !== undefined ? parseInt(height, 10) : undefined,
        camera: camera !== undefined ? camera : undefined,
        prompt: prompt !== undefined ? prompt : undefined,
        ai_tool: aiTool !== undefined ? aiTool : undefined,
      })
      .eq("gdrive_file_id", fileId);

    if (dbError) {
      console.error("Failed to update free asset in Supabase free_assets:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      metadata: {
        ...metadata,
        title,
        tags,
        mediaType,
        generationType,
        aspectRatio,
        width: width !== undefined ? parseInt(width, 10) : metadata.width || 0,
        height: height !== undefined ? parseInt(height, 10) : metadata.height || 0,
        camera: camera !== undefined ? camera : metadata.camera || "촬영 정보 없음",
        prompt: prompt !== undefined ? prompt : metadata.prompt || "",
        aiTool: aiTool !== undefined ? aiTool : metadata.aiTool || "",
      }
    });
  } catch (error: any) {
    console.error("Failed to update free asset:", error);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}
