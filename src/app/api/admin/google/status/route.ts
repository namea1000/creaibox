import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    const { count: googleUsers } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .ilike("email", "%gmail.com");

    const { count: publishedPosts } = await supabase
      .from("writing_creaibox_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published");

    return NextResponse.json({
      oauthClient: true,
      youtubeApiKey: Boolean(process.env.GOOGLE_YOUTUBE_API_KEY),
      enabledApis: 8,
      totalUsers: totalUsers ?? 0,
      googleUsers: googleUsers ?? 0,
      publishedPosts: publishedPosts ?? 0,
      apiStatus: "NORMAL",
      services: [
        { name: "Google Login", status: "ACTIVE", usage: 92 },
        { name: "YouTube Data API v3", status: "ACTIVE", usage: 38 },
        { name: "Search Console API", status: "READY", usage: 21 },
        { name: "Google Analytics API", status: "READY", usage: 17 },
        { name: "Google Drive API", status: "READY", usage: 8 },
        { name: "Google Docs API", status: "READY", usage: 5 },
        { name: "Google Sheets API", status: "READY", usage: 11 },
        { name: "Google Calendar API", status: "READY", usage: 4 },
      ],
    });
  } catch (error) {
    console.error("Google admin status error:", error);

    return NextResponse.json(
      {
        error: "Google 상태 조회 실패",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}