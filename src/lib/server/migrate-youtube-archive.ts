import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function sanitizeVideo(v: any) {
  if (!v || !v.id) return null;
  const title = v.snippet?.title || v.title || "";
  const channelTitle = v.snippet?.channelTitle || v.channelTitle || "";
  const channelId = v.snippet?.channelId || v.channelId || "";
  const publishedAt = v.snippet?.publishedAt || v.publishedAt || "";
  const rawThumb = v.snippet?.thumbnails || v.thumbnails || {};
  const thumbnails = {
    medium: rawThumb.medium ? { url: rawThumb.medium.url } : (rawThumb.default ? { url: rawThumb.default.url } : undefined),
    default: rawThumb.default ? { url: rawThumb.default.url } : undefined,
  };
  const viewCount = v.statistics?.viewCount || v.viewCount || "0";
  const likeCount = v.statistics?.likeCount || v.likeCount || "0";
  const commentCount = v.statistics?.commentCount || v.commentCount || "0";
  const duration = v.contentDetails?.duration || v.duration || "";
  const categoryId = v.snippet?.categoryId || v.categoryId || "";

  return {
    id: v.id,
    snippet: {
      title,
      channelTitle,
      channelId,
      publishedAt,
      thumbnails,
      categoryId,
    },
    statistics: {
      viewCount,
      likeCount,
      commentCount,
    },
    contentDetails: {
      duration,
    },
    isRealShorts: !!v.isRealShorts,
  };
}

async function runMigration() {
  console.log("🚀 Re-bundling remaining dates in youtube_trending_archive with lightweight thumbnails...");

  const targetDates = ["2026-07-26", "2026-07-27", "2026-07-28"];

  for (const targetDate of targetDates) {
    console.log(`Processing date ${targetDate}...`);

    const { data: rowsForDate, error: rowsErr } = await supabaseAdmin
      .from("youtube_trending_archive")
      .select("id, category_id, videos_data")
      .eq("target_date", targetDate);

    if (rowsErr || !rowsForDate) {
      console.error(`Error fetching rows for date ${targetDate}:`, rowsErr);
      continue;
    }

    const bundleObj: Record<string, any[]> = {};

    for (const row of rowsForDate) {
      if (row.videos_data && typeof row.videos_data === "object" && !Array.isArray(row.videos_data)) {
        Object.keys(row.videos_data).forEach((key) => {
          const list = row.videos_data[key];
          if (Array.isArray(list)) {
            bundleObj[key] = list.map(sanitizeVideo).filter(Boolean);
          }
        });
      } else if (Array.isArray(row.videos_data)) {
        bundleObj[row.category_id] = row.videos_data.map(sanitizeVideo).filter(Boolean);
      }
    }

    const categoryKeyCount = Object.keys(bundleObj).length;
    console.log(`Bundling ${categoryKeyCount} category feeds into 1 row for ${targetDate}...`);

    const { error: upsertErr } = await supabaseAdmin
      .from("youtube_trending_archive")
      .upsert(
        {
          category_id: "bundle",
          target_date: targetDate,
          videos_data: bundleObj,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "target_date, category_id" }
      );

    if (upsertErr) {
      console.error(`Failed to upsert bundle row for ${targetDate}:`, upsertErr);
    } else {
      console.log(`Successfully updated ${targetDate}!`);
    }

    await sleep(500);
  }

  console.log("🎉 Re-bundle complete!");
}

runMigration().catch(console.error);
