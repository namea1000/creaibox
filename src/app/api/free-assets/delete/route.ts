import { NextRequest, NextResponse } from "next/server";
import { deleteFreeAsset, getAssetMetadata } from "@/lib/google-drive";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { fileId } = await req.json();
    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
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

    // 3. Fetch file metadata from Google Drive to check the uploader
    const { metadata } = await getAssetMetadata(fileId);
    const uploader = metadata.uploader || "";

    // 4. Authorization check: must be uploader or ADMIN
    const isUploader = uploader.toLowerCase() === (user.email || "").toLowerCase();
    if (!isUploader && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete this asset." },
        { status: 403 }
      );
    }

    // 5. Delete file
    await deleteFreeAsset(fileId);

    // 6. Delete record from Supabase DB
    const { error: dbError } = await supabase
      .from("free_assets")
      .delete()
      .eq("gdrive_file_id", fileId);

    if (dbError) {
      console.error("Failed to delete free asset from Supabase free_assets:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete free asset:", error);
    return NextResponse.json(
      { error: "Delete failed", details: error.message },
      { status: 500 }
    );
  }
}
