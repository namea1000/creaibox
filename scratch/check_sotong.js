const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing supabase env variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSotong() {
  console.log("=== 1. Checking profiles ===");
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, email, nickname, brand_id, custom_domain, extra_configs')
    .or('brand_id.ilike.%sotong%,custom_domain.ilike.%sotong%');
  console.log("Profiles:", profiles, pErr);

  console.log("=== 2. Checking client_sites ===");
  const { data: sites, error: sErr } = await supabase
    .from('client_sites')
    .select('id, brand_id, company_name, custom_domain, status, extra_configs')
    .or('brand_id.ilike.%sotong%,custom_domain.ilike.%sotong%');
  console.log("Client Sites:", sites, sErr);

  console.log("=== 3. Checking blog_subdomains ===");
  const { data: subdomains, error: subErr } = await supabase
    .from('blog_subdomains')
    .select('*')
    .or('subdomain.ilike.%sotong%,custom_domain.ilike.%sotong%');
  console.log("Blog Subdomains:", subdomains, subErr);

  console.log("=== 4. Checking blog_posts / writing_posts ===");
  const { data: posts, error: postErr } = await supabase
    .from('blog_posts')
    .select('id, title, slug, brand_id')
    .or('brand_id.ilike.%sotong%');
  console.log("Blog Posts count:", posts ? posts.length : 0);

  const { data: wPosts, error: wPostErr } = await supabase
    .from('writing_posts')
    .select('id, title, slug, brand_id')
    .or('brand_id.ilike.%sotong%');
  console.log("Writing Posts count:", wPosts ? wPosts.length : 0);
}

checkSotong();
