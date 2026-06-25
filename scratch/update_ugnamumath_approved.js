const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://dkblalbnykgpksurdace.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYmxhbGJueWtncGtzdXJkYWNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg3Njc4MiwiZXhwIjoyMDkzNDUyNzgyfQ.4Z99MZh9xTu_9nT2-kjUH5OCxt2pJ_VaIfWYWdmiXts";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function approveUgnamu() {
  try {
    // Update jenam7720@gmail.com (id: 6604537f-3680-4a50-b995-ae3ddb44604d) to 'ugnamumath'
    const { data, error } = await supabase
      .from("profiles")
      .update({
        brand_id: "ugnamumath",
        brand_id_status: "APPROVED"
      })
      .eq("id", "6604537f-3680-4a50-b995-ae3ddb44604d")
      .select();

    if (error) {
      console.error("Failed to update profile to ugnamumath:", error);
      return;
    }

    console.log("Successfully updated profile:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Exception:", err);
  }
}

approveUgnamu();
