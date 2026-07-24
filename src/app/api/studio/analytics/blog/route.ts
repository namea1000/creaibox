import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { google } from "googleapis";

export const runtime = "nodejs";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache for real-time traffic view

// Helper: Get Google Analytics Data Client
function getAnalyticsDataClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in environment variables.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.analyticsdata({ version: "v1beta", auth: oauth2Client });
}

// Helpers to safely extract GA4 values
function getMetricValue(row: any, index = 0): number {
  return Number(row?.metricValues?.[index]?.value || 0);
}

function getDimensionValue(row: any, index = 0): string {
  return row?.dimensionValues?.[index]?.value || "-";
}

// Helper: Format duration from seconds to human readable (e.g., 2m 45s)
function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0초";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins > 0) {
    return `${mins}분 ${secs}초`;
  }
  return `${secs}초`;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // 1. Authenticate user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request query parameters
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json({ error: "Missing brandId query parameter" }, { status: 400 });
    }

    // 3. Fetch user profile and verify brand ownership
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("brand_id, role, extra_configs")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const primaryBrandId = profile.brand_id || "";
    const brandIds = profile.extra_configs?.brand_ids || [];
    const isOwner = brandId === "creaibox" || brandId === primaryBrandId || brandIds.includes(brandId) || profile.role === "ADMIN";

    if (!isOwner) {
      return NextResponse.json({ error: "Access denied for this brand domain." }, { status: 403 });
    }

    // 4. On-Demand Cache Verification
    const configs = profile.extra_configs || {};
    const cacheKey = `analytics_cache_${brandId}`;
    const cachedData = configs[cacheKey];

    if (cachedData && cachedData.lastFetched) {
      const timeDiff = Date.now() - new Date(cachedData.lastFetched).getTime();
      const isOldFakeCache = Array.isArray(cachedData.data?.channels) && cachedData.data.channels.some((c: any) => c.value === 45 || c.value === 42 || c.value === 35 || c.value === 58 || c.value === 50);
      if (timeDiff < CACHE_TTL_MS && !isOldFakeCache) {
        console.log(`[GA4 Analytics Cache Hit] Returning cached statistics for ${brandId}`);
        return NextResponse.json(cachedData.data);
      }
    }

    console.log(`[GA4 Analytics Cache Miss] Fetching live GA4 data from Google for ${brandId}`);

    // Determine target hostName for filtering
    const customDomainKey = `custom_domain_${brandId}`;
    const customDomain = brandId === primaryBrandId ? (configs.custom_domain || "") : (configs[customDomainKey] || "");
    const targetHostName = brandId === "creaibox"
      ? "creaibox.com"
      : customDomain ? customDomain.replace(/^(https?:\/\/)?(www\.)?/, "") : `${brandId}.creaibox.com`;

    const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "540360142";
    const analyticsdata = getAnalyticsDataClient();

    // Universal hostName filter block
    const hostNameFilter = {
      fieldName: "hostName",
      stringFilter: {
        matchType: "EXACT",
        value: targetHostName,
      },
    };

    // 5. Query GA4 API with safety wrappers (Promise.all)
    const [
      summaryReport,
      realtimeReport,
      popularPostsReport,
      channelsReport,
      devicesReport,
      regionsReport,
    ] = await Promise.all([
      // A. Today & 7 Days Summary (activeUsers, screenPageViews, averageSessionDuration, date trend)
      (async () => {
        try {
          const res = await (analyticsdata.properties.runReport as any)({
            property: `properties/${GA4_PROPERTY_ID}`,
            requestBody: {
              dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
              dimensions: [{ name: "date" }],
              metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "averageSessionDuration" },
              ],
              dimensionFilter: {
                filter: hostNameFilter,
              },
            },
          });
          return res.data;
        } catch (e) {
          console.error("Error fetching GA4 summary report:", e);
          return null;
        }
      })(),

      // B. Real-time Active Users (last 30 mins)
      (async () => {
        try {
          const res = await (analyticsdata.properties.runRealtimeReport as any)({
            property: `properties/${GA4_PROPERTY_ID}`,
            requestBody: {
              metrics: [{ name: "activeUsers" }],
              dimensionFilter: {
                filter: hostNameFilter,
              },
            },
          });
          return res.data;
        } catch (e) {
          console.error("Error fetching GA4 realtime report:", e);
          return null;
        }
      })(),

      // C. Popular Posts (bounceRate, screenPageViews, averageSessionDuration)
      (async () => {
        try {
          const res = await (analyticsdata.properties.runReport as any)({
            property: `properties/${GA4_PROPERTY_ID}`,
            requestBody: {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
              metrics: [
                { name: "screenPageViews" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
              ],
              dimensionFilter: {
                filter: hostNameFilter,
              },
              orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
              limit: "15",
            },
          });
          return res.data;
        } catch (e) {
          console.error("Error fetching GA4 popular posts report:", e);
          return null;
        }
      })(),

      // D. Traffic Source Channels (30 days)
      (async () => {
        try {
          const res = await (analyticsdata.properties.runReport as any)({
            property: `properties/${GA4_PROPERTY_ID}`,
            requestBody: {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "sessionDefaultChannelGroup" }],
              metrics: [{ name: "activeUsers" }],
              dimensionFilter: {
                filter: hostNameFilter,
              },
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            },
          });
          return res.data;
        } catch (e) {
          console.error("Error fetching GA4 channels report:", e);
          return null;
        }
      })(),

      // E. Device Category (30 days)
      (async () => {
        try {
          const res = await (analyticsdata.properties.runReport as any)({
            property: `properties/${GA4_PROPERTY_ID}`,
            requestBody: {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "deviceCategory" }],
              metrics: [{ name: "activeUsers" }],
              dimensionFilter: {
                filter: hostNameFilter,
              },
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            },
          });
          return res.data;
        } catch (e) {
          console.error("Error fetching GA4 devices report:", e);
          return null;
        }
      })(),

      // F. Regions/Cities (30 days)
      (async () => {
        try {
          const res = await (analyticsdata.properties.runReport as any)({
            property: `properties/${GA4_PROPERTY_ID}`,
            requestBody: {
              dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
              dimensions: [{ name: "city" }],
              metrics: [{ name: "activeUsers" }],
              dimensionFilter: {
                filter: hostNameFilter,
              },
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
              limit: "5",
            },
          });
          return res.data;
        } catch (e) {
          console.error("Error fetching GA4 regions report:", e);
          return null;
        }
      })(),
    ]);

    // 6. Data Processing & Formatting
    
    // Today's specific PV/UV/Duration (using "today" row in summary if present, otherwise average)
    let todayPv = 0;
    let todayUv = 0;
    let totalDurationSum = 0;
    let durationCount = 0;

    const formattedDailyTrend: { date: string; visitors: number; views: number }[] = [];
    
    if (summaryReport && summaryReport.rows) {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
      
      summaryReport.rows.forEach((row: any) => {
        const dateVal = getDimensionValue(row, 0); // e.g. "20260618"
        const uv = getMetricValue(row, 0);
        const pv = getMetricValue(row, 1);
        const duration = getMetricValue(row, 2);

        if (dateVal === todayStr) {
          todayPv = pv;
          todayUv = uv;
        }

        totalDurationSum += duration;
        durationCount++;

        // Add to daily trend array
        const formattedDate = `${dateVal.slice(4, 6)}.${dateVal.slice(6, 8)}`; // MM.DD
        formattedDailyTrend.push({
          date: formattedDate,
          visitors: uv,
          views: pv,
        });
      });
    }

    // Sort daily trend by date ascending
    formattedDailyTrend.sort((a, b) => a.date.localeCompare(b.date));

    // Calculate Average Duration
    const avgDurationSeconds = durationCount > 0 ? (totalDurationSum / durationCount) : 0;
    const avgDurationStr = formatDuration(avgDurationSeconds);

    // Popular Posts
    const popularPosts: any[] = [];
    if (popularPostsReport && popularPostsReport.rows) {
      popularPostsReport.rows.forEach((row: any) => {
        const title = getDimensionValue(row, 0);
        const path = getDimensionValue(row, 1);
        const pv = getMetricValue(row, 0);
        const duration = getMetricValue(row, 1);
        const bounceRate = getMetricValue(row, 2);

        if (path && path !== "/") {
          popularPosts.push({
            title: title || path,
            path,
            pv,
            avgDuration: formatDuration(duration),
            bounceRate: `${Number(bounceRate * 100).toFixed(0)}%`,
          });
        }
      });
    }

    // Traffic Channel Grouping
    const channels: { name: string; value: number }[] = [];
    if (channelsReport && channelsReport.rows) {
      channelsReport.rows.forEach((row: any) => {
        channels.push({
          name: getDimensionValue(row, 0),
          value: getMetricValue(row, 0),
        });
      });
    }

    // Devices Percentage
    const devices: { name: string; value: number }[] = [];
    if (devicesReport && devicesReport.rows) {
      devicesReport.rows.forEach((row: any) => {
        devices.push({
          name: getDimensionValue(row, 0),
          value: getMetricValue(row, 0),
        });
      });
    }

    // Regions/Cities
    const regions: { name: string; value: number }[] = [];
    if (regionsReport && regionsReport.rows) {
      regionsReport.rows.forEach((row: any) => {
        regions.push({
          name: getDimensionValue(row, 0),
          value: getMetricValue(row, 0),
        });
      });
    }

function isPostMatchBrand(cUrl: string, targetBrandId: string, targetCustomDomain?: string): boolean {
  if (!cUrl) return targetBrandId === "creaibox";
  try {
    const urlObj = new URL(cUrl.toLowerCase());
    let host = urlObj.hostname;
    if (host.startsWith("www.")) host = host.slice(4);

    if (targetBrandId === "creaibox") {
      if (host.endsWith(".creaibox.com")) {
        const sub = host.replace(".creaibox.com", "");
        if (sub !== "www" && sub !== "") return false;
      }
      if (host.endsWith(".localhost")) {
        const sub = host.replace(".localhost", "");
        if (sub !== "www" && sub !== "") return false;
      }
      if (host === "creaibox.com" || host === "localhost") return true;
      return false;
    } else {
      const cleanCustom = targetCustomDomain ? targetCustomDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] : "";
      return host === `${targetBrandId.toLowerCase()}.creaibox.com` || 
             host === `${targetBrandId.toLowerCase()}.localhost` ||
             (cleanCustom ? host === cleanCustom : false);
    }
  } catch (e) {
    return targetBrandId === "creaibox";
  }
}

    // Fallback for popularPosts if GA4 popularPosts is empty:
    // List real published posts from DB for this brand with actual DB views count
    if (popularPosts.length === 0) {
      try {
        const { data: dbPosts } = await adminSupabase
          .from("writing_creaibox_posts")
          .select("title, slug, created_at, canonical_url, views")
          .eq("user_id", user.id)
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (dbPosts && dbPosts.length > 0) {
          const brandFiltered = dbPosts.filter((p: any) => isPostMatchBrand(p.canonical_url || "", brandId, customDomain));

          brandFiltered.slice(0, 5).forEach((post: any) => {
            const realViews = Number(post.views || 0);
            popularPosts.push({
              title: post.title,
              path: `/blog/${post.slug}`,
              pv: realViews,
              avgDuration: "-",
              bounceRate: "-",
            });
          });
        }
      } catch (dbErr) {
        console.error("Failed to fetch published posts for analytics:", dbErr);
      }
    }

    const realtimeUsers = getMetricValue(realtimeReport?.rows?.[0], 0);

    // Assemble final 100% genuine data object (no fake data, 0 if no real traffic)
    const finalData = {
      todayPv,
      todayUv,
      avgDuration: avgDurationStr || "0초",
      realtimeUsers,
      dailyTrend: formattedDailyTrend,
      popularPosts: popularPosts.slice(0, 5),
      channels,
      devices,
      regions,
    };

    // 7. Store cache back to user profile (extra_configs) in DB
    const updatedExtraConfigs = {
      ...(profile.extra_configs || {}),
      [cacheKey]: {
        lastFetched: new Date().toISOString(),
        data: finalData,
      },
    };

    const { error: cacheUpdateError } = await adminSupabase
      .from("profiles")
      .update({
        extra_configs: updatedExtraConfigs,
      })
      .eq("id", user.id);

    if (cacheUpdateError) {
      console.error("Failed to update analytics cache in DB:", cacheUpdateError);
    }

    return NextResponse.json(finalData);

  } catch (error: any) {
    console.error("Analytics fetch endpoint exception:", error);
    return NextResponse.json({
      error: "Failed to fetch blog analytics",
      details: error.message,
    }, { status: 500 });
  }
}
