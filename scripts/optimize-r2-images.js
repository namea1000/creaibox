require("dotenv").config({ path: ".env.local" });
const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

// R2 Client Setup
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "creaibox-assets";
const PREFIX = "migrated-sites/";
const MAX_SIZE_BYTES = 1000000; // 1MB

// Helper to stream stream to buffer
const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

async function run() {
  console.log(`[R2 Optimizer] Starting optimization for bucket: ${BUCKET_NAME}, prefix: ${PREFIX}`);

  try {
    let isTruncated = true;
    let continuationToken = undefined;
    let totalProcessed = 0;
    let totalSavedBytes = 0;

    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: PREFIX,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);
      const objects = response.Contents || [];

      for (const obj of objects) {
        if (obj.Size > MAX_SIZE_BYTES) {
          console.log(`\n⏳ Found large file: ${obj.Key} (Size: ${(obj.Size / 1024 / 1024).toFixed(2)} MB)`);
          
          try {
            // 1. Download
            const getCommand = new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: obj.Key,
            });
            const getResponse = await s3Client.send(getCommand);
            const buffer = await streamToBuffer(getResponse.Body);

            // 2. Process with Sharp
            const optimizedBuffer = await sharp(buffer)
              .resize({ width: 1920, withoutEnlargement: true })
              .webp({ quality: 80 })
              .toBuffer();

            const savedBytes = obj.Size - optimizedBuffer.length;
            
            // 3. Upload (Overwrite)
            const putCommand = new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: obj.Key,
              Body: optimizedBuffer,
              ContentType: "image/webp",
            });
            await s3Client.send(putCommand);

            totalProcessed++;
            totalSavedBytes += savedBytes;

            console.log(`✅ Optimized ${obj.Key}: ${(optimizedBuffer.length / 1024).toFixed(2)} KB (Saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB)`);
          } catch (err) {
            console.error(`❌ Failed to process ${obj.Key}:`, err.message);
          }
        }
      }

      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    }

    console.log(`\n🎉 [Optimization Complete]`);
    console.log(`- Total Files Processed: ${totalProcessed}`);
    console.log(`- Total Space Saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error("Critical Error during optimization:", error);
  }
}

run();
