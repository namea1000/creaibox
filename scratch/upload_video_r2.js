const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function uploadVideoToR2() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'creaibox-assets';
  const cdnUrl = (process.env.NEXT_PUBLIC_R2_CDN_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

  console.log("Connecting to R2 endpoint:", `https://${accountId}.r2.cloudflarestorage.com`);
  console.log("Bucket:", bucketName);

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  const filePath = 'public/videos/futuremind-hero.mp4';
  const fileBuffer = fs.readFileSync(filePath);
  const s3Key = 'client-sites/futuremind/hero-video.mp4';

  console.log(`Uploading ${filePath} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) to ${s3Key}...`);

  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: 'video/mp4'
  }));

  const publicUrl = `${cdnUrl}/${s3Key}`;
  console.log("✅ Successfully uploaded to R2!");
  console.log("Public URL:", publicUrl);

  fs.writeFileSync('scratch/r2_video_url.txt', publicUrl, 'utf-8');
}

uploadVideoToR2().catch(err => {
  console.error("❌ R2 Upload failed:", err);
});
