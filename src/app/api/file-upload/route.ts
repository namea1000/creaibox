import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
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
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "업로드할 파일이 없습니다." },
        { status: 400 }
      );
    }

    // 5MB 용량 제한 검증 (5 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `파일 용량이 5MB를 초과하여 업로드할 수 없습니다. (선택한 용량: ${(file.size / (1024 * 1024)).toFixed(2)}MB)` },
        { status: 400 }
      );
    }

    // 파일 타입 검증 (영상 및 대용량 파일 차단, 이미지 및 문서 파일만 허용)
    const mimeType = (file.type || "").toLowerCase();
    const originalName = file.name;
    const ext = (originalName.split(".").pop() || "").toLowerCase();

    const blockedExtensions = [
      "mp4", "mov", "avi", "mkv", "wmv", "flv", "webm", "m4v", "3gp",
      "mp3", "wav", "flac", "aac", "ogg", "wma",
      "exe", "dmg", "pkg", "deb", "rpm", "iso", "bin"
    ];

    if (mimeType.startsWith("video/") || mimeType.startsWith("audio/") || blockedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "영상 및 대용량 미디어 파일은 첨부할 수 없습니다. 이미지 및 문서 파일만 업로드해 주세요." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const sizeInBytes = file.size;

    let fileUrl = "";

    // 3. Upload to Google Drive (CreaiBox Cloud DB) under exact same sourceType folder as images
    if (isGoogleDriveConfigured()) {
      try {
        fileUrl = await uploadToGoogleDrive(
          inputBuffer,
          originalName,
          mimeType,
          user.id,
          sourceType || "writing_creaibox_posts"
        );
        console.log("Attached file uploaded successfully to CreaiBox Cloud DB (Google Drive):", fileUrl);
      } catch (gdriveError: any) {
        console.error("CreaiBox Cloud DB file upload failed, falling back to Supabase storage:", gdriveError);
      }
    }

    // Fallback: If Google Drive is not configured or failed, upload to Supabase storage
    if (!fileUrl) {
      const sourceFolder = (sourceType || "creaibox").replace(/[^a-z0-9_-]/gi, "-");
      const safeSourceId = sourceId ? String(sourceId) : "unknown";
      const timeStamp = Date.now();
      const filePath = `${user.id}/${sourceFolder}-attachments/${safeSourceId}/${timeStamp}-${originalName}`;

      const { error: uploadError } = await supabase.storage
        .from("generated-images")
        .upload(filePath, inputBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("generated-images")
        .getPublicUrl(filePath);

      fileUrl = publicUrlData.publicUrl;
    }

    return NextResponse.json({
      success: true,
      file: {
        url: fileUrl,
        fileName: originalName,
        size: sizeInBytes,
        mimeType,
      },
    });
  } catch (error: any) {
    console.error("파일 첨부 실패:", error);
    return NextResponse.json(
      { error: error?.message || "파일 첨부에 실패했습니다." },
      { status: 500 }
    );
  }
}
