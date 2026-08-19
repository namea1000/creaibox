import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";
import { uploadToGoogleDrive, isGoogleDriveConfigured } from "@/lib/google-drive";
import sharp from "sharp";

interface ProcessResult {
  fullUrl: string;
  thumbUrl: string;
}

async function downloadAndProcessImage(imageUrl: string, blogId: string = "sotongcheum", userId?: string): Promise<ProcessResult | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": `https://blog.naver.com/${blogId}`,
      },
    });

    if (!res.ok) {
      console.warn(`[FAIL] HTTP ${res.status} for ${imageUrl}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 1. Full Content Image (Max width 1200px, WebP Q82)
    let fullCompressedBuffer: Buffer;
    try {
      fullCompressedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
    } catch (err) {
      fullCompressedBuffer = inputBuffer;
    }

    // 2. Dedicated 16:9 Lightweight Thumbnail (640x360, WebP Q78, ~20KB) for 0.01s instant card loading
    let thumbCompressedBuffer: Buffer;
    try {
      thumbCompressedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize(640, 360, { fit: "cover", position: "center" })
        .webp({ quality: 78, effort: 4 })
        .toBuffer();
    } catch (err) {
      thumbCompressedBuffer = fullCompressedBuffer;
    }

    const fileSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullFileName = `migrated-${blogId}-full-${fileSuffix}.webp`;
    const thumbFileName = `migrated-${blogId}-thumb-${fileSuffix}.webp`;

    const targetUserId = userId || "454dfd4e-2b64-4309-afbe-e54f34666eb4";
    const sourceType = "writing_creaibox_posts";

    const [fullUrl, thumbUrl] = await Promise.all([
      uploadToGoogleDrive(fullCompressedBuffer, fullFileName, "image/webp", targetUserId, sourceType),
      uploadToGoogleDrive(thumbCompressedBuffer, thumbFileName, "image/webp", targetUserId, sourceType),
    ]);

    if (!fullUrl) return null;

    return {
      fullUrl,
      thumbUrl: thumbUrl || fullUrl,
    };
  } catch (err: any) {
    console.error(`Error processing image ${imageUrl}:`, err.message);
    return null;
  }
}

async function runMigration() {
  console.log("=== STARTING DUAL-TIER (FULL + DEDICATED 16:9 THUMBNAIL) BATCH IMAGE MIGRATION ===");

  if (!isGoogleDriveConfigured()) {
    throw new Error("Google Drive / Cloud DB is not configured in .env.local!");
  }

  // 1. Fetch posts with external Naver image links
  const { data: posts, error } = await supabaseAdmin
    .from("writing_creaibox_posts")
    .select("id, user_id, title, slug, content, published_snapshot")
    .or("content.ilike.%pstatic.net%,content.ilike.%blogfiles.naver.com%,content.ilike.%postfiles.naver.com%");

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  console.log(`Found ${posts?.length || 0} posts to process with dual WebP compression.`);

  const urlMap: Record<string, ProcessResult> = {};

  let totalProcessed = 0;
  let totalSucceeded = 0;

  for (let i = 0; i < (posts || []).length; i++) {
    const post = posts![i];
    console.log(`\n[${i + 1}/${posts!.length}] Processing post: "${post.title}" (ID: ${post.id})`);

    const imgMatches = Array.from((post.content || "").matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
    const uniqueImgUrls = Array.from(new Set((imgMatches as RegExpMatchArray[]).map(m => m[1]).filter(url => url && (url.includes("pstatic.net") || url.includes("naver.com")))));

    if (uniqueImgUrls.length === 0) continue;

    let updatedContent = post.content;
    let postPrimaryThumb: string | null = null;

    for (let j = 0; j < uniqueImgUrls.length; j++) {
      const rawUrl = uniqueImgUrls[j];
      totalProcessed++;
      let res = urlMap[rawUrl];

      if (!res) {
        console.log(`  -> Downloading & dual WebP converting: ${rawUrl.slice(0, 65)}...`);
        const processed = await downloadAndProcessImage(rawUrl, "sotongcheum", post.user_id);
        if (processed) {
          urlMap[rawUrl] = processed;
          res = processed;
          totalSucceeded++;
          console.log(`  ✅ Full: ${res.fullUrl}`);
          console.log(`  🚀 16:9 Thumb: ${res.thumbUrl}`);
        } else {
          console.log(`  ❌ Failed to upload: ${rawUrl}`);
        }
      } else {
        console.log(`  ⚡ Reusing cached URLs: ${res.fullUrl}`);
      }

      if (res) {
        if (!postPrimaryThumb && j === 0) {
          postPrimaryThumb = res.thumbUrl;
        }
        // Replace full content image in body
        updatedContent = updatedContent.replaceAll(rawUrl, res.fullUrl);
      }
    }

    // Update writing_creaibox_posts
    const updatePayload: any = { content: updatedContent };

    if (post.published_snapshot && typeof post.published_snapshot === "object") {
      let snapshotContent = post.published_snapshot.content || "";
      for (const [rawUrl, res] of Object.entries(urlMap)) {
        snapshotContent = snapshotContent.replaceAll(rawUrl, res.fullUrl);
      }
      updatePayload.published_snapshot = {
        ...post.published_snapshot,
        content: snapshotContent,
      };
    }

    const { error: updateErr } = await supabaseAdmin
      .from("writing_creaibox_posts")
      .update(updatePayload)
      .eq("id", post.id);

    if (updateErr) {
      console.error(`  ❌ DB update failed for post ${post.id}:`, updateErr);
    } else {
      console.log(`  💾 Post content successfully updated in Supabase!`);
    }

    // Register dedicated 16:9 lightweight thumbnail into generated_images
    if (postPrimaryThumb && post.slug) {
      const gImagesPayload = [
        {
          user_id: post.user_id,
          source_type: "writing_creaibox_posts",
          source_id: post.slug,
          image_url: postPrimaryThumb,
          image_role: "thumbnail",
          is_primary: true,
          aspect_ratio: "16:9",
        },
        {
          user_id: post.user_id,
          source_type: "writing_creaibox_posts",
          source_id: post.id,
          image_url: postPrimaryThumb,
          image_role: "thumbnail",
          is_primary: true,
          aspect_ratio: "16:9",
        }
      ];

      for (const item of gImagesPayload) {
        try {
          await supabaseAdmin.from("generated_images").upsert(item, { onConflict: "source_type,source_id" });
        } catch {
          await supabaseAdmin.from("generated_images").insert(item);
        }
      }
      console.log(`  🖼️ Dedicated 16:9 thumbnail registered in generated_images!`);
    }
  }

  console.log(`\n🎉 DUAL-TIER BATCH MIGRATION COMPLETE! Processed: ${totalProcessed}, Succeeded: ${totalSucceeded}`);
}

runMigration().catch(console.error);
