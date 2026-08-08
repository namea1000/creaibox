const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function main() {
  const { data, error } = await supabase.from('system_settings').select('*').eq('key', 'cron_trending_status');
  console.log("Settings:", data, error);
  
  const { data: logs } = await supabase.from('youtube_trending_archive').select('target_date').order('target_date', {ascending: false}).limit(5);
  console.log("Latest trending dates in DB:", logs);
}
main();
