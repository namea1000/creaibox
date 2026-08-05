const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env.local manually
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase environment variables not found.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function extractFirstImage(content) {
  if (!content) return null;
  const imgMatches = Array.from(content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
  for (const match of imgMatches) {
    const src = match[1];
    if (
      src &&
      !src.includes("stat.naver.com") &&
      !src.includes("blank.gif") &&
      !src.includes("post-phinf.pstatic.net/20") &&
      !src.includes("tracker")
    ) {
      return src;
    }
  }
  return null;
}

async function runThumbnailBatch() {
  console.log("🚀 Starting Thumbnail Backfill Batch for writing_creaibox_posts...");

  const { data: posts, error } = await supabase
    .from("writing_creaibox_posts")
    .select("id, user_id, slug, title, content")
    .eq("status", "published");

  if (error) {
    console.error("Failed to fetch posts:", error);
    process.exit(1);
  }

  console.log(`Found ${posts.length} published posts to inspect.`);

  let insertedCount = 0;
  let skippedCount = 0;
  let noImageCount = 0;

  for (const post of posts) {
    // Check if primary image already exists for post.id or post.slug
    const { data: existingImages } = await supabase
      .from("generated_images")
      .select("id, source_id, is_primary")
      .eq("source_type", "writing_creaibox_posts")
      .in("source_id", [post.id, post.slug].filter(Boolean));

    const hasPrimary = existingImages && existingImages.some((img) => img.is_primary);

    if (hasPrimary) {
      skippedCount++;
      continue;
    }

    const firstImg = extractFirstImage(post.content);

    if (!firstImg) {
      noImageCount++;
      continue;
    }

    // Insert thumbnail for both post.id and post.slug if available
    const recordsToInsert = [
      {
        user_id: post.user_id,
        source_type: "writing_creaibox_posts",
        source_id: post.id,
        image_url: firstImg,
        prompt: "First body image auto thumbnail",
        is_primary: true,
        image_role: "thumbnail",
      },
    ];

    if (post.slug && post.slug !== post.id) {
      recordsToInsert.push({
        user_id: post.user_id,
        source_type: "writing_creaibox_posts",
        source_id: post.slug,
        image_url: firstImg,
        prompt: "First body image auto thumbnail",
        is_primary: true,
        image_role: "thumbnail",
      });
    }

    const { error: insertErr } = await supabase
      .from("generated_images")
      .insert(recordsToInsert);

    if (insertErr) {
      console.warn(`Failed to insert thumbnail for post ${post.title} (${post.id}):`, insertErr.message);
    } else {
      insertedCount++;
      console.log(`✅ Synced thumbnail for: "${post.title}" -> ${firstImg.slice(0, 60)}...`);
    }
  }

  console.log("\n========================================");
  console.log(`🎉 Batch Finished!`);
  console.log(`- Newly inserted primary thumbnails: ${insertedCount}`);
  console.log(`- Already had primary thumbnail: ${skippedCount}`);
  console.log(`- Posts without body images: ${noImageCount}`);
  console.log("========================================\n");
}

runThumbnailBatch();
