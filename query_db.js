const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('client_sites').select('*').eq('brand_id', 'repaint');
  console.log('client_sites:', data, error);
  
  const { data: prof, error: e2 } = await supabase.from('profiles').select('*').eq('brand_id', 'repaint');
  console.log('profiles:', prof, e2);
}

check();
