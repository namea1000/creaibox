const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixClientSites() {
  const { data: sites } = await supabase
    .from('client_sites')
    .select('id, brand_id, company_name, custom_domain, status, created_at')
    .or('brand_id.ilike.%sotong%,custom_domain.ilike.%sotong%')
    .order('created_at', { ascending: false });

  console.log("All sotong client_sites:", sites);

  // Set the primary official one as 'sotongchaeum' and custom_domain 'sotongchaeum.com'
  // and the draft test ones with brand_id 'sotongchaeum-xxxx' and custom_domain null
  for (const s of sites) {
    if (s.brand_id === 'sotongchaeum' || s.brand_id === 'sotongcheum') {
      await supabase.from('client_sites').update({
        brand_id: 'sotongchaeum',
        custom_domain: 'sotongchaeum.com',
        status: 'PUBLISHED'
      }).eq('id', s.id);
      console.log(`Set primary site ${s.id} to sotongchaeum / sotongchaeum.com (PUBLISHED)`);
    } else {
      let newBrand = s.brand_id.replace('sotongcheum', 'sotongchaeum');
      await supabase.from('client_sites').update({
        brand_id: newBrand,
        custom_domain: null,
      }).eq('id', s.id);
      console.log(`Updated draft site ${s.id} to ${newBrand} (custom_domain: null)`);
    }
  }

  // Check if primary 'sotongchaeum' site exists, if not create or assign the latest one
  const { data: mainSite } = await supabase.from('client_sites').select('*').eq('brand_id', 'sotongchaeum');
  console.log("Main sotongchaeum site:", mainSite);
}

fixClientSites();
