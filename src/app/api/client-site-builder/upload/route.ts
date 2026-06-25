import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";
import { uploadToGoogleDrive, isGoogleDriveConfigured } from "@/lib/google-drive";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 2. Validate Business Membership Level
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_level, role")
      .eq("id", user.id)
      .maybeSingle();

    const mLevel = (profile?.membership_level || "").toLowerCase();
    const role = (profile?.role || "").toUpperCase();
    const isBusiness =
      mLevel === "business" ||
      mLevel === "enterprise" ||
      mLevel === "admin" ||
      role === "ADMIN" ||
      role === "SUPER_ADMIN";

    if (!isBusiness) {
      return NextResponse.json(
        { error: "이미지 업로드 권한이 없습니다. Business 요금제로 업그레이드해 주세요." },
        { status: 403 }
      );
    }

    // 3. Parse file from request
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sourceId = formData.get("sourceId") as string | null; // e.g. site_id

    if (!file) {
      return NextResponse.json(
        { error: "업로드할 파일이 없습니다." },
        { status: 400 }
      );
    }

    // 4. Compress & Convert to WebP using Sharp
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let compressedBuffer: Buffer;
    try {
      compressedBuffer = await sharp(inputBuffer)
        .rotate()
        .webp({ quality: 92, effort: 5 })
        .toBuffer();
    } catch (sharpError: any) {
      console.error("Sharp compression failed, using original buffer:", sharpError);
      compressedBuffer = inputBuffer;
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
    let imageUrl = "";

    // 5. Upload to Google Drive under client-isolated folder
    if (isGoogleDriveConfigured()) {
      try {
        imageUrl = await uploadToGoogleDrive(
          compressedBuffer,
          fileName,
          "image/webp",
          user.id,
          "client-site-builder"
        );
        console.log("Uploaded successfully to isolated Google Drive folder:", imageUrl);
      } catch (gdriveError: any) {
        console.error("Google Drive isolated upload failed, falling back to Supabase storage:", gdriveError);
      }
    }

    // Fallback: If Google Drive is not configured or failed, upload to Supabase storage bucket
    if (!imageUrl) {
      const safeSourceId = sourceId ? String(sourceId) : "builder-assets";
      const filePath = `${user.id}/client-site-builder/${safeSourceId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("generated-images")
        .upload(filePath, compressedBuffer, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Supabase storage upload fallback failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("generated-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // 6. Optional: Insert a log in generated_images to make it visible in platform media studio
    try {
      await supabase.from("generated_images").insert({
        user_id: user.id,
        prompt: `홈페이지 빌더 업로드 이미지\n\n파일명: ${file.name}`,
        image_url: imageUrl,
        style: "manual-upload",
        aspect_ratio: "content",
        provider: "upload",
        source_type: "client-site-builder",
        source_id: sourceId || null,
        title: file.name
      });
    } catch (dbLogErr) {
      console.error("Optional generated_images insert logged error:", dbLogErr);
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "이미지 업로드 실패" },
      { status: 500 }
    );
  }
}
