const path = require('path');
const fs = require('fs');

// 1. .env.local 로딩
const envPath = path.join('/Users/a1234/Local Sites/creaibox', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    let value = parts.slice(1).join('=').trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
}

const { createClient } = require('/Users/a1234/Local Sites/creaibox/node_modules/@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 2. JSON 데이터 로드
const jsonPath = path.join('/Users/a1234/Local Sites/creaibox/src/lib/constants', 'reservedBrandsData.json');
if (!fs.existsSync(jsonPath)) {
  console.error("Error: reservedBrandsData.json file not found at " + jsonPath);
  process.exit(1);
}

const reservedBrands = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded ${reservedBrands.length} reserved brand records from JSON.`);

// 3. Chunk 단위 Upsert 실행 함수
async function seedData() {
  const CHUNK_SIZE = 200;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < reservedBrands.length; i += CHUNK_SIZE) {
    const chunk = reservedBrands.slice(i, i + CHUNK_SIZE);
    
    // brand_id 포맷 재검증 (영문 소문자/숫자 2~15자)
    const validChunk = chunk.filter(item => {
      const brand = (item.brand_id || '').trim().toLowerCase();
      const isValid = /^[a-z0-9]{2,15}$/.test(brand);
      if (!isValid) {
        console.warn(`[Skip] Invalid brand_id format skipped: "${item.brand_id}"`);
      }
      return isValid;
    }).map(item => ({
      brand_id: item.brand_id.trim().toLowerCase(),
      category: item.category || 'SYSTEM',
      reason: item.reason || ''
    }));

    if (validChunk.length === 0) continue;

    console.log(`Upserting chunk ${Math.floor(i / CHUNK_SIZE) + 1} (${validChunk.length} records)...`);
    
    const { error } = await supabase
      .from('reserved_brand_ids')
      .upsert(validChunk, { onConflict: 'brand_id' });

    if (error) {
      console.error(`❌ Fail in chunk ${Math.floor(i / CHUNK_SIZE) + 1}:`, error.message);
      failCount += validChunk.length;
    } else {
      console.log(`✅ Success chunk ${Math.floor(i / CHUNK_SIZE) + 1}`);
      successCount += validChunk.length;
    }
  }

  console.log("==========================================");
  console.log(`Seeding complete.`);
  console.log(`Total Success: ${successCount} records.`);
  console.log(`Total Fails: ${failCount} records.`);
  console.log("==========================================");
}

seedData();
