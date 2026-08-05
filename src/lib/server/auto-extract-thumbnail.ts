import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Extract first valid image URL from post HTML content and automatically save/sync to generated_images as primary thumbnail
 */
export async function syncPrimaryThumbnailFromContent({
  postId,
  content,
  supabase,
}: {
  postId: string;
  content: string | null | undefined;
  supabase: SupabaseClient;
}): Promise<string | null> {
  if (!postId || !content) return null;

  // Extract all img src attributes
  const imgMatches = Array.from(content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
  let extractedUrl: string | null = null;

  for (const match of imgMatches) {
    const src = match[1];
    if (
      src &&
      !src.includes("stat.naver.com") &&
      !src.includes("blank.gif") &&
      !src.includes("post-phinf.pstatic.net/20") &&
      !src.includes("tracker")
    ) {
      extractedUrl = src;
      break;
    }
  }

  if (!extractedUrl) return null;

  try {
    // Check if primary image already exists for this post
    const { data: existingPrimary } = await supabase
      .from("generated_images")
      .select("id, image_url")
      .eq("source_type", "writing_creaibox_posts")
      .eq("source_id", postId)
      .eq("is_primary", true)
      .maybeSingle();

    if (existingPrimary) {
      if (existingPrimary.image_url !== extractedUrl) {
        await supabase
          .from("generated_images")
          .update({ image_url: extractedUrl })
          .eq("id", existingPrimary.id);
      }
    } else {
      await supabase.from("generated_images").insert({
        source_type: "writing_creaibox_posts",
        source_id: postId,
        image_url: extractedUrl,
        prompt: "First body image auto thumbnail",
        is_primary: true,
      });
    }

    return extractedUrl;
  } catch (err) {
    console.error(`Failed to sync primary thumbnail for post ${postId}:`, err);
    return extractedUrl;
  }
}
