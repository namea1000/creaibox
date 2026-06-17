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

    // 2. Parse request JSON
    const body = await req.json();
    const { imageUrl, sourceType, sourceId, title, targetKeyword } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "다운로드할 외부 이미지 URL이 없습니다." },
        { status: 400 }
      );
    }

    // 3. Fetch the external image
    let response;
    try {
      response = await fetch(imageUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
    } catch (fetchErr: any) {
      throw new Error(`외부 이미지를 가져오는 데 실패했습니다: ${fetchErr.message}`);
    }

    if (!response.ok) {
      throw new Error(`외부 이미지 다운로드 응답 실패: HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`다운로드한 파일이 이미지가 아닙니다 (ContentType: ${contentType})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 4. Compress/Convert to WebP using Sharp
    let compressedBuffer: Buffer;
    try {
      compressedBuffer = await sharp(inputBuffer)
        .rotate()
        .webp({ quality: 72, effort: 5 })
        .toBuffer();
    } catch (sharpError: any) {
      console.error("External Sharp compression failed, uploading original buffer:", sharpError);
      compressedBuffer = inputBuffer;
    }

    const fileName = `ext-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
    let uploadedUrl = "";

    // 5. Upload to Google Drive if configured, otherwise fallback to Supabase
    if (isGoogleDriveConfigured()) {
      try {
        uploadedUrl = await uploadToGoogleDrive(compressedBuffer, fileName, "image/webp");
        console.log("External image uploaded successfully to Google Drive:", uploadedUrl);
      } catch (gdriveError: any) {
        console.error("Google Drive upload failed for external image, falling back to Supabase storage:", gdriveError);
      }
    }

    // Fallback: If Google Drive is not configured or failed, upload to Supabase storage
    if (!uploadedUrl) {
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

      uploadedUrl = publicUrlData.publicUrl;
    }

    // 6. Insert record into generated_images database table
    const promptText = [
      `외부 복사 이미지 - ${title || "제목 없음"}`,
      `원본 URL: ${imageUrl}`,
      targetKeyword ? `키워드: ${targetKeyword}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const { data: inserted, error: insertError } = await supabase
      .from("generated_images")
      .insert({
        user_id: user.id,
        prompt: promptText,
        image_url: uploadedUrl,
        style: "external-import",
        aspect_ratio: "content",
        provider: "upload",
        source_type: sourceType || null,
        source_id: sourceId || null,
        image_role: "content_image",
        is_primary: false,
      })
      .select("id, image_url, prompt, style, aspect_ratio, provider, source_type, source_id, image_role, is_primary, created_at")
      .single();

    if (insertError) {
      throw new Error(`generated_images database insert failed: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      image: inserted,
    });
  } catch (error: any) {
    console.error("External Image Upload API route error:", error);
    return NextResponse.json(
      { error: error.message || "외부 이미지 업로드 실패" },
      { status: 500 }
    );
  }
}
