import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

function getStartOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function getDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const today = getStartOfDay();
    const sevenDaysAgo = getDaysAgo(7);
    const thirtyDaysAgo = getDaysAgo(30);

    const [
      totalUsersResult,
      todayUsersResult,
      sevenDayUsersResult,
      thirtyDayUsersResult,
      publishedPostsResult,
      draftPostsResult,
      googleUsersResult,
      paidUsersResult,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),

      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today),

      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),

      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo),

      supabase
        .from("writing_creaibox_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),

      supabase
        .from("writing_creaibox_posts")
        .select("id", { count: "exact", head: true })
        .neq("status", "published"),

      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .ilike("email", "%gmail.com"),

      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "PAID"),
    ]);

    const totalUsers = totalUsersResult.count ?? 0;
    const todayUsers = todayUsersResult.count ?? 0;
    const sevenDayUsers = sevenDayUsersResult.count ?? 0;
    const thirtyDayUsers = thirtyDayUsersResult.count ?? 0;
    const paidUsers = paidUsersResult.count ?? 0;

    return NextResponse.json({
      totalUsers,
      todayUsers,
      sevenDayUsers,
      thirtyDayUsers,
      paidUsers,
      googleUsers: googleUsersResult.count ?? 0,
      publishedPosts: publishedPostsResult.count ?? 0,
      draftPosts: draftPostsResult.count ?? 0,
      conversionRate:
        totalUsers > 0 ? Number(((paidUsers / totalUsers) * 100).toFixed(1)) : 0,

      googleAnalyticsReady: Boolean(process.env.GOOGLE_CLIENT_ID),
      searchConsoleReady: Boolean(process.env.GOOGLE_CLIENT_ID),
      stripeReady: Boolean(process.env.STRIPE_SECRET_KEY),

      traffic: {
        todayVisitors: null,
        yesterdayVisitors: null,
        sevenDayVisitors: null,
        thirtyDayVisitors: null,
        realtimeUsers: null,
      },

      channels: [
        { name: "Google", value: 0 },
        { name: "Direct", value: 0 },
        { name: "Naver", value: 0 },
        { name: "YouTube", value: 0 },
        { name: "ChatGPT", value: 0 },
        { name: "Bing", value: 0 },
      ],

      dailyTrend: [
        { date: "D-6", visitors: 0, users: 0, posts: 0 },
        { date: "D-5", visitors: 0, users: 0, posts: 0 },
        { date: "D-4", visitors: 0, users: 0, posts: 0 },
        { date: "D-3", visitors: 0, users: 0, posts: 0 },
        { date: "D-2", visitors: 0, users: 0, posts: 0 },
        { date: "D-1", visitors: 0, users: 0, posts: 0 },
        { date: "Today", visitors: 0, users: todayUsers, posts: 0 },
      ],
    });
  } catch (error) {
    console.error("Analytics admin status error:", error);

    return NextResponse.json(
      {
        error: "Analytics 상태 조회 실패",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}