const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function dumpBlazityHtml() {
  const { data: site } = await supabase
    .from('client_sites')
    .select('*')
    .eq('brand_id', 'blazity-mett')
    .maybeSingle();

  const { data: sections } = await supabase
    .from('site_sections')
    .select('*')
    .eq('site_id', site.id)
    .order('section_order', { ascending: true });

  const fullData = {
    site,
    sections
  };
  fs.writeFileSync('scratch/blazity_full_dump.json', JSON.stringify(fullData, null, 2), 'utf-8');
  console.log("Saved blazity dump to scratch/blazity_full_dump.json");
}

dumpBlazityHtml();
