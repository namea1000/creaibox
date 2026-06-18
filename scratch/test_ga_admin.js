const { google } = require("googleapis");
require("dotenv").config({ path: "/Users/a1234/Local Sites/creaibox/.env.local" });

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

async function run() {
  try {
    const adminClient = getAnalyticsAdminClient();
    const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "540360142";
    const brandId = "test-stream-creation";

    console.log("Creating web data stream for property:", GA4_PROPERTY_ID);
    
    const response = await adminClient.properties.dataStreams.create({
      parent: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        type: "WEB_DATA_STREAM",
        displayName: `${brandId} 블로그`,
        webStreamData: {
          defaultUri: `https://${brandId}.creaibox.com`,
        },
      },
    });

    console.log("Creation successful!");
    console.log("Stream details:", JSON.stringify(response.data, null, 2));
    
    const measurementId = response.data.webStreamData?.measurementId;
    console.log("Measurement ID (G-xxxx):", measurementId);

    // Clean up: delete the test stream so we don't clutter the property
    const streamName = response.data.name; // e.g. properties/540360142/dataStreams/12345
    if (streamName) {
      console.log("Cleaning up... Deleting stream:", streamName);
      await adminClient.properties.dataStreams.delete({
        name: streamName,
      });
      console.log("Cleanup successful!");
    }
  } catch (err) {
    console.error("Failed to run test:", err.response?.data || err.message);
  }
}

run();
