import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { deleteFileFromGoogleDrive, isGoogleDriveConfigured } from "@/lib/google-drive";

export const runtime = "nodejs";

function getStoragePathFromPublicUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/generated-images\/(.+)$/);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인 세션을 확인할 수 없습니다." },
        { status: 401 }
      );
    }

    const { fileUrls } = await req.json();
    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
      return NextResponse.json({ success: true, deletedCount: 0 });
    }

    let deletedGoogleDriveCount = 0;
    let deletedSupabaseCount = 0;

    for (const url of fileUrls) {
      if (typeof url !== "string" || !url) continue;

      // 1. CreAibox 클라우드 DB (Google Drive) 삭제 시도
      if (isGoogleDriveConfigured()) {
        try {
          const isDriveDeleted = await deleteFileFromGoogleDrive(url);
          if (isDriveDeleted) {
            deletedGoogleDriveCount++;
            console.log("CreAibox Cloud DB (Google Drive) file deleted successfully:", url);
          }
        } catch (gdriveErr) {
          console.error("CreAibox Cloud DB file deletion failed:", gdriveErr);
        }
      }

      // 2. Supabase Storage 삭제 시도
      const storagePath = getStoragePathFromPublicUrl(url);
      if (storagePath) {
        const { error } = await supabase.storage
          .from("generated-images")
          .remove([storagePath]);

        if (!error) {
          deletedSupabaseCount++;
        }
      }

      // 3. DB generated_images 테이블 레코드 삭제
      await supabase
        .from("generated_images")
        .delete()
        .eq("user_id", user.id)
        .eq("image_url", url);
    }

    return NextResponse.json({
      success: true,
      deletedGoogleDriveCount,
      deletedSupabaseCount,
    });
  } catch (error: any) {
    console.error("파일 삭제 API 처리 실패:", error);
    return NextResponse.json(
      { error: error?.message || "파일 삭제 처리에 실패했습니다." },
      { status: 500 }
    );
  }
}
