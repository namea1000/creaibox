import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/lib/server/get-free-gemini-key";

export const runtime = "nodejs";

async function checkIsAdminEmail(email?: string | null) {
  if (!email) return false;
  const { data, error } = await supabaseAdmin
    .from("admin_whitelist")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return !error && !!data;
}

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "540360142";

async function gaRequest(
  accessToken: string,
  endpoint: "runReport" | "runRealtimeReport",
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

    if (userError || !user || !(await checkIsAdminEmail(user.email))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const accessToken = session?.provider_token;
    console.log("GA4_PROPERTY_ID =", GA4_PROPERTY_ID);
    console.log("LOGIN_USER =", user.email);
    console.log("HAS_PROVIDER_TOKEN =", Boolean(accessToken));
    console.log("PROVIDER_TOKEN_HEAD =", accessToken?.slice(0, 12));

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

    let analyticsReady = Boolean(accessToken);
    let analyticsError: string | null = null;

    let traffic = {
      realtimeUsers: null as number | null,
      todayVisitors: null as number | null,
      yesterdayVisitors: null as number | null,
      sevenDayVisitors: null as number | null,
      thirtyDayVisitors: null as number | null,
    };

    let countries: { name: string; value: number }[] = [];
    let channels: { name: string; value: number }[] = [];
    let topPages: { page: string; path: string; views: number; users: number }[] = [];
    let devices: { name: string; value: number }[] = [];
    let browsers: { name: string; value: number }[] = [];
    let hourlyTrend: { hour: string; visitors: number; views: number }[] = [];
    let dailyTrend: { date: string; visitors: number; views: number }[] = [];

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
          realtimeUsers: metricValue(realtimeRes.rows?.[0]),
          todayVisitors: today,
          yesterdayVisitors: yesterday,
          sevenDayVisitors: sevenDays,
          thirtyDayVisitors: thirtyDays,
        };

        const [countryRes, channelRes, topPagesRes, deviceRes, browserRes, hourlyRes, dailyRes] =
          await Promise.all([
            gaRequest(accessToken, "runReport", {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "country" }],
              metrics: [{ name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
              limit: 10,
            }),

            gaRequest(accessToken, "runReport", {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "sessionDefaultChannelGroup" }],
              metrics: [{ name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
              limit: 10,
            }),

            gaRequest(accessToken, "runReport", {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
              metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
              limit: 20,
            }),

            gaRequest(accessToken, "runReport", {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "deviceCategory" }],
              metrics: [{ name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            }),

            gaRequest(accessToken, "runReport", {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "browser" }],
              metrics: [{ name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
              limit: 10,
            }),

            gaRequest(accessToken, "runReport", {
              dateRanges: [{ startDate: "today", endDate: "today" }],
              dimensions: [{ name: "hour" }],
              metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
              orderBys: [{ dimension: { dimensionName: "hour" } }],
              limit: 24,
            }),

            gaRequest(accessToken, "runReport", {
              dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
              dimensions: [{ name: "date" }],
              metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
              orderBys: [{ dimension: { dimensionName: "date" } }],
            }),
          ]);

        countries =
          countryRes.rows?.map((row: any) => ({
            name: dimensionValue(row, 0),
            value: metricValue(row, 0),
          })) || [];

        channels =
          channelRes.rows?.map((row: any) => ({
            name: dimensionValue(row, 0),
            value: metricValue(row, 0),
          })) || [];

        topPages =
          topPagesRes.rows?.map((row: any) => ({
            page: dimensionValue(row, 0),
            path: dimensionValue(row, 1),
            views: metricValue(row, 0),
            users: metricValue(row, 1),
          })) || [];

        devices =
          deviceRes.rows?.map((row: any) => ({
            name: dimensionValue(row, 0),
            value: metricValue(row, 0),
          })) || [];

        browsers =
          browserRes.rows?.map((row: any) => ({
            name: dimensionValue(row, 0),
            value: metricValue(row, 0),
          })) || [];

        hourlyTrend =
          hourlyRes.rows?.map((row: any) => ({
            hour: `${dimensionValue(row, 0)}시`,
            visitors: metricValue(row, 0),
            views: metricValue(row, 1),
          })) || [];

        dailyTrend =
          dailyRes.rows?.map((row: any) => ({
            date: dimensionValue(row, 0),
            visitors: metricValue(row, 0),
            views: metricValue(row, 1),
          })) || [];
      } catch (error) {
        analyticsReady = false;
        analyticsError = error instanceof Error ? error.message : "GA4 API Error";

        console.error("GA4 API error detail:", {
          message: analyticsError,
          hasAccessToken: Boolean(accessToken),
          propertyId: GA4_PROPERTY_ID,
        });
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
      analyticsError,
      searchConsoleReady: Boolean(process.env.GOOGLE_CLIENT_ID),
      stripeReady: Boolean(process.env.STRIPE_SECRET_KEY),

      traffic,
      countries,
      channels,
      topPages,
      devices,
      browsers,
      hourlyTrend,
      dailyTrend,
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