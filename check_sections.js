const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: site } = await supabase.from('client_sites').select('id').eq('brand_id', 'repaint').single();
  console.log('site id:', site?.id);
  if (site) {
    const { data: sections } = await supabase.from('site_sections').select('*').eq('site_id', site.id);
    console.log('sections:', JSON.stringify(sections, null, 2));
  }
}

check();
