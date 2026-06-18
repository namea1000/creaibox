import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { google } from "googleapis";

export const runtime = "nodejs";

// Helper: Check if user is an admin by querying whitelist
async function checkIsAdminEmail(adminSupabase: any, email?: string | null) {
  if (!email) return false;
  const { data, error } = await adminSupabase
    .from("admin_whitelist")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return !error && !!data;
}

// Helper: Get Google Analytics Admin Client
function getAnalyticsAdminClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in environment variables.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.analyticsadmin({ version: "v1beta", auth: oauth2Client });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // 1. Authenticate user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !(await checkIsAdminEmail(adminSupabase, user.email))) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { userId, requestedId } = body;

    if (!userId || !requestedId) {
      return NextResponse.json({ error: "Missing required parameters: userId and requestedId" }, { status: 400 });
    }

    // 3. Fetch current user profile to be approved
    const { data: targetProfile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("brand_id, extra_configs")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || !targetProfile) {
      return NextResponse.json({ error: "Target profile not found" }, { status: 404 });
    }

    // 4. Create GA4 Web Data Stream
    let measurementId = "";
    try {
      const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "540360142";
      const adminClient = getAnalyticsAdminClient();

      console.log(`Creating GA4 Web Data Stream for ${requestedId}.creaibox.com under property ${GA4_PROPERTY_ID}`);
      
      const response = await adminClient.properties.dataStreams.create({
        parent: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          type: "WEB_DATA_STREAM",
          displayName: `${requestedId} 블로그`,
          webStreamData: {
            defaultUri: `https://${requestedId}.creaibox.com`,
          },
        },
      });

      measurementId = response.data.webStreamData?.measurementId || "";
      if (!measurementId) {
        throw new Error("GA4 API response did not contain a measurementId.");
      }
      console.log(`GA4 Web Data Stream created successfully. Measurement ID: ${measurementId}`);
    } catch (gaError: any) {
      console.error("Failed to create GA4 Web Data Stream:", gaError);
      
      // Return details of GA API failure to inform admin about OAuth Scope issues or API errors
      return NextResponse.json({
        error: "Google Analytics Admin API failure. Please verify GCP OAuth Scope permissions.",
        details: gaError.response?.data || gaError.message
      }, { status: 500 });
    }

    // 5. Update user profile brand fields atomically in DB
    let primary_brand_id = targetProfile.brand_id || "";
    let brand_ids = targetProfile.extra_configs?.brand_ids || [];

    if (!primary_brand_id) {
      primary_brand_id = requestedId;
    } else {
      if (!brand_ids.includes(requestedId)) {
        brand_ids.push(requestedId);
      }
    }

    const nextExtraConfigs = {
      ...(targetProfile.extra_configs || {}),
      brand_ids: brand_ids,
      [`ga_id_${requestedId}`]: measurementId,
    };

    // For backward compatibility and single brand users, set primary ga_id
    if (requestedId === primary_brand_id) {
      nextExtraConfigs.ga_id = measurementId;
    }

    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({
        brand_id: primary_brand_id,
        brand_id_status: "APPROVED",
        requested_brand_id: null,
        brand_id_rejection_reason: null,
        extra_configs: nextExtraConfigs,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      measurementId,
      brandId: requestedId
    });

  } catch (error: any) {
    console.error("Brand approval endpoint exception:", error);
    return NextResponse.json({
      error: "Failed to approve brand",
      details: error.message
    }, { status: 500 });
  }
}
