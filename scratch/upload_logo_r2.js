const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function uploadLogoToR2() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'creaibox-assets';
  const cdnUrl = (process.env.NEXT_PUBLIC_R2_CDN_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  const filePath = 'public/images/futuremind-logo.png';
  const fileBuffer = fs.readFileSync(filePath);
  const s3Key = 'client-sites/futuremind/logo.png';

  console.log(`Uploading ${filePath} to ${s3Key}...`);

  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: 'image/png'
  }));

  const publicUrl = `${cdnUrl}/${s3Key}`;
  console.log("✅ Successfully uploaded logo to R2!");
  console.log("Public Logo URL:", publicUrl);

  fs.writeFileSync('scratch/r2_logo_url.txt', publicUrl, 'utf-8');
}

uploadLogoToR2().catch(err => {
  console.error("❌ R2 Upload failed:", err);
});
