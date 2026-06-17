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
        { error: "로그인 세션을 확인할 수 없습니다." },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sourceType = formData.get("sourceType") as string | null;
    const sourceId = formData.get("sourceId") as string | null;
    const imageRole = formData.get("imageRole") as string | null;
    const title = formData.get("title") as string | null;
    const targetKeyword = formData.get("targetKeyword") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "업로드할 파일이 없습니다." },
        { status: 400 }
      );
    }

    // 3. Compress/Convert to WebP using Sharp
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let compressedBuffer: Buffer;
    try {
      compressedBuffer = await sharp(inputBuffer)
        .rotate()
        .webp({ quality: 92, effort: 5 })
        .toBuffer();
    } catch (sharpError: any) {
      console.error("Sharp compression failed, uploading original buffer:", sharpError);
      compressedBuffer = inputBuffer;
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
    let imageUrl = "";

    // 4. Upload to Google Drive if configured, otherwise fallback to Supabase
    if (isGoogleDriveConfigured()) {
      try {
        imageUrl = await uploadToGoogleDrive(compressedBuffer, fileName, "image/webp");
        console.log("Uploaded successfully to Google Drive:", imageUrl);
      } catch (gdriveError: any) {
        console.error("Google Drive upload failed, falling back to Supabase storage:", gdriveError);
      }
    }

    // Fallback: If Google Drive is not configured or failed, upload to Supabase storage
    if (!imageUrl) {
      const sourceFolder = (sourceType || "creaibox").replace(/[^a-z0-9_-]/gi, "-");
      const safeSourceId = sourceId ? String(sourceId) : "unknown";
      const filePath = `${user.id}/${sourceFolder}-content/${safeSourceId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("generated-images")
        .upload(filePath, compressedBuffer, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Supabase storage upload failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("generated-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // 5. Insert record into generated_images database table
    const promptText = [
      `PC 업로드 이미지 - ${title || "제목 없음"}`,
      `원본 파일명: ${file.name}`,
      targetKeyword ? `키워드: ${targetKeyword}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const { data: inserted, error: insertError } = await supabase
      .from("generated_images")
      .insert({
        user_id: user.id,
        prompt: promptText,
        image_url: imageUrl,
        style: "manual-upload",
        aspect_ratio: "content",
        provider: "upload",
        source_type: sourceType || null,
        source_id: sourceId || null,
        image_role: imageRole || "gallery",
        is_primary: false,
        title: title || file.name,
        caption: formData.get("caption") as string | null,
        description: formData.get("description") as string | null,
        alt_text: (formData.get("altText") as string | null) || file.name,
      })
      .select("id, image_url, prompt, style, aspect_ratio, provider, source_type, source_id, image_role, is_primary, created_at, title, caption, description, alt_text")
      .single();

    if (insertError) {
      throw new Error(`generated_images database insert failed: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      image: inserted,
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { error: error.message || "이미지 업로드 실패" },
      { status: 500 }
    );
  }
}
