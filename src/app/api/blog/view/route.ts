import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ success: false, error: "Missing post ID" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    
    // Fetch current views
    const { data: post } = await supabase
      .from("writing_creaibox_posts")
      .select("views")
      .eq("id", postId)
      .maybeSingle();

    if (post) {
      const currentViews = Number(post.views || 0);
      await supabase
        .from("writing_creaibox_posts")
        .update({ views: currentViews + 1 })
        .eq("id", postId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
