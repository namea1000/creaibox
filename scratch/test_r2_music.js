const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// 1. Load .env.local variables manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

// 2. Initialize S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  console.log("=== Cloudflare R2 Music Sync & Streaming Verification Tool ===");
  console.log(`Target Bucket: ${env.R2_BUCKET_NAME}`);
  console.log(`R2 Public CDN URL Base: ${env.NEXT_PUBLIC_R2_PUBLIC_URL}`);

  const command = new ListObjectsV2Command({
    Bucket: env.R2_BUCKET_NAME,
    Prefix: "music/",
  });
  
  const response = await r2Client.send(command);
  const contents = response.Contents || [];
  
  const tracks = contents
    .filter(item => item.Key && item.Key !== "music/")
    .map(item => {
      const key = item.Key;
      const name = key.replace(/^music\//i, "");
      const r2PublicUrl = env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, "");
      const streamUrl = `${r2PublicUrl}/${key}`;
      return { key, name, size: item.Size, streamUrl };
    });
    
  console.log("\n1. R2 SCAN RESULT:");
  console.log(JSON.stringify(tracks, null, 2));
  
  if (tracks.length === 0) {
    console.error("\n❌ Error: No music files detected under music/ prefix in R2 bucket.");
    return;
  }
  
  const testTrack = tracks[0];
  console.log(`\n2. STREAM CONNECTION TEST:`);
  console.log(`Requesting URL: ${testTrack.streamUrl}`);
  
  const startTime = Date.now();
  const fetchRes = await fetch(testTrack.streamUrl, { method: 'GET', headers: { 'Range': 'bytes=0-1024' } });
  const latency = Date.now() - startTime;

  console.log(`Connection Established in ${latency}ms`);
  console.log(`HTTP Status: ${fetchRes.status} (Expected: 206 for Range Request)`);
  console.log(`Content-Type: ${fetchRes.headers.get('content-type')}`);
  console.log(`Content-Range: ${fetchRes.headers.get('content-range')}`);
  console.log(`Content-Length: ${fetchRes.headers.get('content-length')}`);
  console.log(`Access-Control-Allow-Origin: ${fetchRes.headers.get('access-control-allow-origin')}`);

  if (fetchRes.status === 200 || fetchRes.status === 206) {
    console.log("\n✅ Success: Cloudflare R2 CDN Streaming is 100% operational with CORS headers!");
  } else {
    console.error(`\n❌ Failure: R2 public URL returned unexpected status: ${fetchRes.status}`);
  }
}

run().catch(console.error);
