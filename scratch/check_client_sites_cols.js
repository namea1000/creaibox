const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCols() {
  const { data, error } = await supabase.from('client_sites').select('*').limit(1);
  if (data && data[0]) {
    console.log("Columns in client_sites:", Object.keys(data[0]));
    console.log("Sample record:", data[0]);
  } else {
    console.log("Error or empty:", error?.message);
  }
}

checkCols();
