const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function uploadCardsToR2() {
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

  const files = [
    { local: 'public/images/card-ai-dev.png', r2: 'client-sites/futuremind/card-ai-dev.png' },
    { local: 'public/images/card-ai-consulting.png', r2: 'client-sites/futuremind/card-ai-consulting.png' },
    { local: 'public/images/card-ai-edu.png', r2: 'client-sites/futuremind/card-ai-edu.png' }
  ];

  for (const f of files) {
    const fileBuffer = fs.readFileSync(f.local);
    console.log(`Uploading ${f.local} to ${f.r2}...`);
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: f.r2,
      Body: fileBuffer,
      ContentType: 'image/png'
    }));
    console.log(`✅ Uploaded: ${cdnUrl}/${f.r2}`);
  }
}

uploadCardsToR2().catch(console.error);
