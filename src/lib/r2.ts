import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// 1. Initialize Cloudflare R2 Client (S3 Compatible API)
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export interface R2MusicFile {
  key: string;
  name: string;
  size: number;
  lastModified: Date;
}

/**
 * Lists all audio files inside the 'music/' directory within the Cloudflare R2 Bucket.
 * Filters out folder indicators and returns metadata objects.
 */
export async function listR2Music(): Promise<R2MusicFile[]> {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME environment variable is not configured.");
  }

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: "music/",
  });

  const response = await r2Client.send(command);
  const contents = response.Contents || [];

  return contents
    .filter(
      (item) =>
        item.Key &&
        item.Key !== "music/" &&
        (item.Key.toLowerCase().endsWith(".mp3") ||
          item.Key.toLowerCase().endsWith(".wav") ||
          item.Key.toLowerCase().endsWith(".m4a"))
    )
    .map((item) => {
      const key = item.Key!;
      // Extract the bare filename from the 'music/' path prefix
      const name = key.replace(/^music\//i, "");
      return {
        key,
        name,
        size: item.Size || 0,
        lastModified: item.LastModified || new Date(),
      };
    });
}
