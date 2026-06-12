const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: campaigns, error } = await supabase
    .from('content_planner_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaigns:', error);
    return;
  }

  console.log(`Fetched ${campaigns.length} campaigns:`);
  for (const c of campaigns) {
    console.log(`- ID: ${c.id}, Title: "${c.title}", Status: "${c.status}", Keyword: "${c.main_keyword}"`);
    const { data: items } = await supabase
      .from('content_planner_items')
      .select('*')
      .eq('campaign_id', c.id)
      .order('item_order', { ascending: true });
    console.log(`  Items count: ${items?.length || 0}`);
    
    const { data: outputs } = await supabase
      .from('content_planner_outputs')
      .select('*')
      .eq('campaign_id', c.id);
    console.log(`  Outputs count: ${outputs?.length || 0}`);
    outputs?.forEach((out) => {
      console.log(`    - Output: itemId=${out.item_id}, Type=${out.output_type}, Route=${out.target_route}, PostId=${out.generated_post_id}`);
    });
  }
}

run();
