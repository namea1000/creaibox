const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: images, error } = await supabase
    .from('free_assets')
    .select('id, storage_url, title, media_type')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching images:', error);
    return;
  }

  console.log(`Fetched ${images.length} images:`);
  for (const img of images) {
    console.log(`- ID: ${img.id}, Title: "${img.title}", MediaType: "${img.media_type}", URL: "${img.storage_url}"`);
  }
}

run();
