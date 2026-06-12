const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: campaign, error } = await supabase
    .from('content_planner_campaigns')
    .select('*')
    .eq('id', 'b61a46f3-fb26-4793-84f7-ac35d45773cc')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Campaign details:');
  console.log(JSON.stringify(campaign, null, 2));
}

run();
