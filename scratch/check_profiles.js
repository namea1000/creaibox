const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching profiles...");
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, nickname, brand_id, brand_id_status, requested_brand_id, extra_configs, updated_at');

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(`Fetched ${profiles.length} profiles:`);
  for (const p of profiles) {
    const hasBrandInfo = p.brand_id || p.requested_brand_id || p.extra_configs?.brand_ids;
    if (hasBrandInfo) {
      console.log(`\nUser ID: ${p.id} (${p.nickname})`);
      console.log(`- brand_id: ${p.brand_id}`);
      console.log(`- brand_id_status: ${p.brand_id_status}`);
      console.log(`- requested_brand_id: ${p.requested_brand_id}`);
      console.log(`- extra_configs:`, JSON.stringify(p.extra_configs, null, 2));
    }
  }
}

run();
