const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function uploadTransparentLogo() {
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

  const fileBuffer = fs.readFileSync('public/images/futuremind-logo-transparent.png');
  // Copy to public/images/futuremind-logo.png too
  fs.writeFileSync('public/images/futuremind-logo.png', fileBuffer);

  const s3Key = 'client-sites/futuremind/logo-transparent.png';
  console.log(`Uploading to R2 ${s3Key}...`);

  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: 'image/png'
  }));

  console.log(`✅ Uploaded: ${cdnUrl}/${s3Key}`);
}

uploadTransparentLogo().catch(console.error);
