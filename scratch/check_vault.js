const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function main() {
  const { data, error } = await supabase.from('admin_api_vault').select('*').eq('provider', 'youtube');
  console.log("YouTube Keys in Vault:", data, error);
}
main();
