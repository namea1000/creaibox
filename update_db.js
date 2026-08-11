const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function update() {
  const { data, error } = await supabase.from('client_sites').update({ status: 'ACTIVE' }).eq('brand_id', 'repaint');
  console.log('Updated client_sites repaint to ACTIVE', error);
  
  const { data: prof, error: e2 } = await supabase.from('profiles').update({ brand_id_status: 'APPROVED' }).eq('brand_id', 'repaint');
  console.log('Updated profiles repaint to APPROVED', e2);
}

update();
