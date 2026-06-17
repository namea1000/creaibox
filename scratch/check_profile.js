const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, brand_id, brand_id_status, nickname, extra_configs');

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(JSON.stringify(profiles, null, 2));
}

run();
