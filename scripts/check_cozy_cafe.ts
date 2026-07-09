import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const dotenvPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(dotenvPath)) {
  const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
  dotenvContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase config");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('free_assets')
    .select('id, file_name, title, thumbnail_url, media_type')
    .or("title.ilike.%날것%,title.ilike.%원초적%,title.ilike.%스타일%,title.ilike.%raw%,file_name.ilike.%raw%");

  if (error) {
    console.error("Supabase query error:", error);
    return;
  }

  console.log(`Found ${data.length} records in DB matching filters:`);
  console.log(JSON.stringify(data.slice(0, 30), null, 2));

  const { count } = await supabase
    .from('free_assets')
    .select('id', { count: 'exact', head: true });
  
  console.log(`\nTotal assets in free_assets table: ${count}`);
}

check();
