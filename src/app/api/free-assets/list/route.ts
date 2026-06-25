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

    // Extract unique uploader emails to query nicknames from profiles table
    const uploaderEmails = Array.from(
      new Set(
        (files || [])
          .map((f) => f.uploader)
          .filter((u): u is string => !!u && u.includes("@"))
      )
    );

    // Map emails to nicknames dynamically
    const emailToNicknameMap: Record<string, string> = {};
    if (uploaderEmails.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("email, nickname")
        .in("email", uploaderEmails);

      if (!profilesError && profiles) {
        profiles.forEach((p) => {
          if (p.email && p.nickname) {
            emailToNicknameMap[p.email.toLowerCase()] = p.nickname;
          }
        });
      }
    }

    const formattedFiles = (files || []).map((file) => {
      const emailKey = file.uploader ? file.uploader.toLowerCase() : "";
      const displayUploader = emailToNicknameMap[emailKey] || file.uploader;

      return {
        id: file.gdrive_file_id,
        name: file.file_name,
        url: file.storage_url,
        mimeType: file.mime_type,
        size: file.width ? 0 : 0,
        createdAt: file.created_at,
        title: file.title,
        tags: file.tags || [],
        mediaType: file.media_type,
        uploader: displayUploader,
        uploaderEmail: file.uploader || "",
        downloads: file.downloads_count || 0,
        views: file.views_count || 0,
        aspectRatio: file.aspect_ratio || "",
        generationType: file.generation_type || "real",
        width: file.width || 0,
        height: file.height || 0,
        camera: file.camera || "촬영 정보 없음",
        prompt: file.prompt || "",
        aiTool: file.ai_tool || "",
        isOfficialThemeAsset: file.is_official_theme_asset || false,
        themeCategory: file.theme_category || "",
        isBusinessOnly: file.is_business_only || false,
      };
    });

    return NextResponse.json({ files: formattedFiles });
  } catch (error: any) {
    console.error("Failed to list free assets from database:", error);
    return NextResponse.json(
      { error: "Database query error", details: error.message },
      { status: 500 }
    );
  }
}
