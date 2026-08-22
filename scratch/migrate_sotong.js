const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function migrateSotongToChaeum() {
  console.log("=== 1. Migrating profiles ===");
  
  // 1-1. Update profile with brand_id = 'sotongcheum'
  const { data: pData, error: pErr } = await supabase
    .from('profiles')
    .select('id, brand_id, custom_domain, extra_configs')
    .eq('brand_id', 'sotongcheum');

  console.log("Found profiles to update:", pData);

  if (pData && pData.length > 0) {
    for (const p of pData) {
      const extra = p.extra_configs || {};
      
      // Update keys in extra_configs
      const newExtra = { ...extra };
      newExtra.custom_domain = 'sotongchaeum.com';
      newExtra.custom_domain_sotongchaeum = 'sotongchaeum.com';
      newExtra.custom_domain_status_sotongchaeum = 'APPROVED';
      newExtra.target_slug = 'sotongchaeum';

      // Update brand_ids array if needed
      if (Array.isArray(newExtra.brand_ids)) {
        newExtra.brand_ids = newExtra.brand_ids.map(b => b === 'sotongcheum' ? 'sotongchaeum' : b);
        if (!newExtra.brand_ids.includes('sotongchaeum')) {
          newExtra.brand_ids.push('sotongchaeum');
        }
      }

      const { error: upErr } = await supabase
        .from('profiles')
        .update({
          brand_id: 'sotongchaeum',
          custom_domain: 'sotongchaeum.com',
          extra_configs: newExtra
        })
        .eq('id', p.id);

      console.log(`Updated profile ${p.id}:`, upErr || 'SUCCESS');
    }
  }

  // 1-2. Also check if CreaiBox developer profile has any sotongcheum references
  const { data: allProfiles } = await supabase.from('profiles').select('id, brand_id, extra_configs');
  for (const p of allProfiles || []) {
    let changed = false;
    const extra = { ...(p.extra_configs || {}) };

    if (Array.isArray(extra.brand_ids) && extra.brand_ids.includes('sotongcheum')) {
      extra.brand_ids = extra.brand_ids.map(b => b === 'sotongcheum' ? 'sotongchaeum' : b);
      changed = true;
    }

    if (extra.custom_domain === 'sotongcheum.com') {
      extra.custom_domain = 'sotongchaeum.com';
      changed = true;
    }

    if (changed) {
      await supabase.from('profiles').update({ extra_configs: extra }).eq('id', p.id);
      console.log(`Updated extra_configs for profile ${p.id}`);
    }
  }

  console.log("=== 2. Migrating client_sites ===");
  const { data: sites, error: sErr } = await supabase
    .from('client_sites')
    .select('id, brand_id, company_name, custom_domain, status, extra_configs')
    .or('brand_id.ilike.%sotongcheum%,custom_domain.ilike.%sotongcheum%');

  console.log("Found client_sites:", sites);

  if (sites && sites.length > 0) {
    for (const site of sites) {
      const extra = site.extra_configs || {};
      const newExtra = { ...extra };
      newExtra.custom_domain = 'sotongchaeum.com';
      newExtra.target_slug = 'sotongchaeum';

      let newBrandId = site.brand_id;
      if (site.brand_id === 'sotongcheum') {
        newBrandId = 'sotongchaeum';
      } else if (site.brand_id.startsWith('sotongcheum-')) {
        newBrandId = site.brand_id.replace('sotongcheum-', 'sotongchaeum-');
      }

      const { error: upSiteErr } = await supabase
        .from('client_sites')
        .update({
          brand_id: newBrandId,
          custom_domain: 'sotongchaeum.com',
          status: 'PUBLISHED',
          extra_configs: newExtra
        })
        .eq('id', site.id);

      console.log(`Updated client_site ${site.id} (${site.brand_id} -> ${newBrandId}):`, upSiteErr || 'SUCCESS');
    }
  }

  // 2-1. Also check site_sections if brand_id column exists
  try {
    const { data: sections, error: secErr } = await supabase
      .from('site_sections')
      .select('id, brand_id')
      .eq('brand_id', 'sotongcheum');
    
    if (sections && sections.length > 0) {
      await supabase.from('site_sections').update({ brand_id: 'sotongchaeum' }).eq('brand_id', 'sotongcheum');
      console.log(`Updated ${sections.length} site_sections to sotongchaeum`);
    }
  } catch (e) {
    console.log("site_sections check note:", e.message);
  }

  console.log("=== Migration completed ===");
}

migrateSotongToChaeum();
