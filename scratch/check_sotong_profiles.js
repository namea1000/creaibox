const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProfiles() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  for (const p of profiles) {
    const jsonStr = JSON.stringify(p);
    if (jsonStr.includes('sotong')) {
      console.log("Found profile with sotong:", p.id, p.nickname, p.email, p.brand_id, p.custom_domain);
      console.log("extra_configs keys:", Object.keys(p.extra_configs || {}));
      console.log("brand_ids in extra_configs:", p.extra_configs?.brand_ids);
    }
  }
}
checkProfiles();
