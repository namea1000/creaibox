const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://dkblalbnykgpksurdace.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYmxhbGJueWtncGtzdXJkYWNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg3Njc4MiwiZXhwIjoyMDkzNDUyNzgyfQ.4Z99MZh9xTu_9nT2-kjUH5OCxt2pJ_VaIfWYWdmiXts";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfiles() {
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, brand_id, brand_id_status, email")
      .limit(10);

    if (error) {
      console.error("DB Query Error:", error);
      return;
    }

    console.log("Profiles list:", JSON.stringify(profiles, null, 2));

    const { data: sotongProfile, error: err2 } = await supabase
      .from("profiles")
      .select("*")
      .eq("brand_id", "sotongcheum")
      .maybeSingle();

    if (err2) {
      console.error("Sotong lookup error:", err2);
    }
    console.log("Sotongcheum profile details:", sotongProfile);
  } catch (err) {
    console.error("Exception:", err);
  }
}

checkProfiles();
