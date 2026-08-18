import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, recordVaultSuccess, recordVaultFailure } from "@/lib/server/get-free-gemini-key";
import { decryptApiKey } from "@/lib/server/api-vault-crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  
  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  // 1. Get API Key
  let vaultId: number | null = null;
  let apiKey = process.env.YOUTUBE_API_KEY || "";

  try {
    const { data: vaultKeys, error: vaultError } = await supabaseAdmin
      .from("admin_api_vault")
      .select("id, key, today_count, daily_limit")
      .eq("provider", "youtube")
      .eq("status", "active")
      .order("priority", { ascending: true })
      .order("today_count", { ascending: true });

    if (!vaultError && vaultKeys && vaultKeys.length > 0) {
      for (const vault of vaultKeys) {
        if ((vault.today_count || 0) < (vault.daily_limit || 1000)) {
          apiKey = decryptApiKey(vault.key);
          vaultId = vault.id;
          break;
        }
      }
    }
  } catch (err) {
    console.error("[YouTube Search] Failed to fetch API key from vault", err);
  }

  if (!apiKey) {
    return NextResponse.json({ error: "No available API key" }, { status: 500 });
  }

  try {
    // 2. Call YouTube Search API
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=24&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    
    if (!searchRes.ok) {
      const errTxt = await searchRes.text();
      throw new Error(`YouTube Search API Error: ${errTxt}`);
    }

    const searchData = await searchRes.json();
    const items = searchData.items || [];
    
    if (items.length === 0) {
      if (vaultId) await recordVaultSuccess(vaultId);
      return NextResponse.json({ items: [] });
    }

    // 3. Extract Video IDs and call Videos API for stats
    const videoIds = items.map((item: any) => item.id.videoId).join(",");
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    
    if (!detailsRes.ok) {
      const errTxt = await detailsRes.text();
      throw new Error(`YouTube Video API Error: ${errTxt}`);
    }

    const detailsData = await detailsRes.json();
    const detailedItems = detailsData.items || [];

    // 4. Format for frontend
    const formattedVideos = detailedItems.map((vid: any) => {
      // parse duration from ISO 8601 PT#M#S
      let durationStr = vid.contentDetails?.duration || "";
      const match = durationStr.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      let formattedDuration = "0:00";
      if (match) {
        const h = parseInt(match[1]) || 0;
        const m = parseInt(match[2]) || 0;
        const s = parseInt(match[3]) || 0;
        if (h > 0) {
          formattedDuration = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        } else {
          formattedDuration = `${m}:${s.toString().padStart(2, '0')}`;
        }
      }

      return {
        id: vid.id,
        title: vid.snippet?.title || "",
        channelName: vid.snippet?.channelTitle || "",
        thumbnail: vid.snippet?.thumbnails?.medium?.url || vid.snippet?.thumbnails?.default?.url || "",
        duration: formattedDuration,
        views: parseInt(vid.statistics?.viewCount || "0"),
        likes: parseInt(vid.statistics?.likeCount || "0"),
        uploadDate: vid.snippet?.publishedAt ? vid.snippet.publishedAt.split("T")[0] : "",
        tags: vid.snippet?.tags || []
      };
    });

    if (vaultId) {
      // Record vault success
      await recordVaultSuccess(vaultId);
    }

    return NextResponse.json({ items: formattedVideos });

  } catch (error: any) {
    console.error("[YouTube Search] Error", error);
    if (vaultId) {
      await recordVaultFailure(vaultId, error.message);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
