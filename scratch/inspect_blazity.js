const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkBlazity() {
  const { data: site } = await supabase
    .from('client_sites')
    .select('*')
    .eq('brand_id', 'blazity-mett')
    .maybeSingle();

  if (site) {
    console.log("Found blazity-mett site:", site.company_name);
    console.log("extra_configs keys:", Object.keys(site.extra_configs || {}));
    if (site.extra_configs?.header_html) {
      console.log("Header HTML snippet:", site.extra_configs.header_html.slice(0, 300));
    }
  }

  const { data: sections } = await supabase
    .from('site_sections')
    .select('*')
    .eq('site_id', site?.id)
    .order('section_order', { ascending: true });

  console.log("Sections count:", sections?.length);
  sections?.forEach((s, idx) => {
    console.log(`[Section ${idx}] title: ${s.title}, subtitle: ${s.subtitle}`);
    if (s.raw_html) console.log(`  raw_html length: ${s.raw_html.length}`);
  });
}

checkBlazity();
