const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://dkblalbnykgpksurdace.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYmxhbGJueWtncGtzdXJkYWNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg3Njc4MiwiZXhwIjoyMDkzNDUyNzgyfQ.4Z99MZh9xTu_9nT2-kjUH5OCxt2pJ_VaIfWYWdmiXts";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function approveSotong() {
  try {
    // 1. Update the official account's brand_id to 'sotongcheum' and brand_id_status to 'APPROVED'
    // Official Account ID: 454dfd4e-2b64-4309-afbe-e54f34666eb4 (creaiboxofficial@gmail.com)
    const { data, error } = await supabase
      .from("profiles")
      .update({
        brand_id: "sotongcheum",
        brand_id_status: "APPROVED"
      })
      .eq("id", "454dfd4e-2b64-4309-afbe-e54f34666eb4")
      .select();

    if (error) {
      console.error("Failed to update profile to sotongcheum:", error);
      return;
    }

    console.log("Successfully updated profile:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Exception:", err);
  }
}

approveSotong();
