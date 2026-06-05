import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "540360142";

async function gaRequest(
  accessToken: string,
  endpoint: string,
  body: Record<string, unknown>
) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:${endpoint}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "GA4 API 요청 실패");
  }

  return data;
}

function metricValue(row: any, index = 0) {
  return Number(row?.metricValues?.[index]?.value || 0);
}

function dimensionValue(row: any, index = 0) {
  return row?.dimensionValues?.[index]?.value || "-";
}

async function getActiveUsers(
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const data = await gaRequest(accessToken, "runReport", {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: "activeUsers" }],
  });

  return metricValue(data.rows?.[0]);
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (userError || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const accessToken = session?.provider_token;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
        .gte("created_at", todayStart.toISOString()),

      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString()),

      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString()),

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

    let traffic = {
      todayVisitors: null as number | null,
      yesterdayVisitors: null as number | null,
      sevenDayVisitors: null as number | null,
      thirtyDayVisitors: null as number | null,
      realtimeUsers: null as number | null,
    };

    let topPages: { page: string; views: number; users: number }[] = [];
    let channels: { name: string; value: number }[] = [];
    let countries: { name: string; value: number }[] = [];
    let devices: { name: string; value: number }[] = [];
    let dailyTrend: { date: string; visitors: number; views: number }[] = [];

    let analyticsReady = Boolean(accessToken);

    if (accessToken) {
      try {
        const [today, yesterday, sevenDays, thirtyDays] = await Promise.all([
          getActiveUsers(accessToken, "today", "today"),
          getActiveUsers(accessToken, "yesterday", "yesterday"),
          getActiveUsers(accessToken, "7daysAgo", "today"),
          getActiveUsers(accessToken, "30daysAgo", "today"),
        ]);

        const realtimeRes = await gaRequest(accessToken, "runRealtimeReport", {
          metrics: [{ name: "activeUsers" }],
        });

        traffic = {
          todayVisitors: today,
          yesterdayVisitors: yesterday,
          sevenDayVisitors: sevenDays,
          thirtyDayVisitors: thirtyDays,
          realtimeUsers: metricValue(realtimeRes.rows?.[0]),
        };

        const topPagesRes = await gaRequest(accessToken, "runReport", {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          limit: 10,
        });

        topPages =
          topPagesRes.rows?.map((row: any) => ({
            page: dimensionValue(row, 0) || dimensionValue(row, 1),
            views: metricValue(row, 0),
            users: metricValue(row, 1),
          })) || [];

        const channelRes = await gaRequest(accessToken, "runReport", {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "activeUsers" }],
          limit: 8,
        });

        channels =
          channelRes.rows?.map((row: any) => ({
            name: dimensionValue(row, 0),
            value: metricValue(row, 0),
          })) || [];

        const countryRes = await gaRequest(accessToken, "runReport", {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
          limit: 8,
        });

        countries =
          countryRes.rows?.map((row: any) => ({
            name: dimensionValue(row, 0),
            value: metricValue(row, 0),
          })) || [];

        const deviceRes = await gaRequest(accessToken, "runReport", {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "activeUsers" }],
        });

        devices =
          deviceRes.rows?.map((row: any) => ({
            name: dimensionValue(row, 0),
            value: metricValue(row, 0),
          })) || [];

        const trendRes = await gaRequest(accessToken, "runReport", {
          dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        });

        dailyTrend =
          trendRes.rows?.map((row: any) => ({
            date: dimensionValue(row, 0),
            visitors: metricValue(row, 0),
            views: metricValue(row, 1),
          })) || [];
      } catch (gaError) {
        analyticsReady = false;
        console.error("GA4 OAuth API error:", gaError);
      }
    }

    const totalUsers = totalUsersResult.count ?? 0;
    const paidUsers = paidUsersResult.count ?? 0;

    return NextResponse.json({
      totalUsers,
      todayUsers: todayUsersResult.count ?? 0,
      sevenDayUsers: sevenDayUsersResult.count ?? 0,
      thirtyDayUsers: thirtyDayUsersResult.count ?? 0,
      paidUsers,
      googleUsers: googleUsersResult.count ?? 0,
      publishedPosts: publishedPostsResult.count ?? 0,
      draftPosts: draftPostsResult.count ?? 0,
      conversionRate:
        totalUsers > 0 ? Number(((paidUsers / totalUsers) * 100).toFixed(1)) : 0,
      googleAnalyticsReady: analyticsReady,
      searchConsoleReady: Boolean(process.env.GOOGLE_CLIENT_ID),
      stripeReady: Boolean(process.env.STRIPE_SECRET_KEY),
      traffic,
      channels,
      countries,
      devices,
      dailyTrend,
      topPages,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Analytics 상태 조회 실패",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}