import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 Client (S3 Compatible API)
 */
export function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are not fully configured in environment variables.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Returns the public CDN URL for any given R2 key.
 * @param pathKey e.g. "sites/custom-clients/sotongcheum/hero-bg.webp"
 */
export function getR2CdnUrl(pathKey: string): string {
  const cdnBase = (
    process.env.NEXT_PUBLIC_R2_CDN_URL ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    "https://assets.creaibox.com"
  ).replace(/\/$/, "");

  const cleanKey = pathKey.replace(/^\//, "");
  return `${cdnBase}/${cleanKey}`;
}

/**
 * Returns the full CDN URL for a custom client asset.
 * @param clientSlug e.g. "sotongcheum"
 * @param fileName e.g. "hero-bg.webp"
 */
export function getCustomClientAssetUrl(clientSlug: string, fileName: string): string {
  // Legacy asset compatibility: Map sotongchaeum to sotongcheum for existing R2 images
  const effectiveSlug = clientSlug === "sotongchaeum" ? "sotongcheum" : clientSlug;
  return getR2CdnUrl(`sites/custom-clients/${effectiveSlug}/${fileName}`);
}

/**
 * Uploads a WebP image buffer to Cloudflare R2 under sites/custom-clients/{clientSlug}/{fileName}
 * with 1-year immutable global edge caching.
 */
export async function uploadCustomClientAsset(
  clientSlug: string,
  fileName: string,
  buffer: Buffer,
  contentType: string = "image/webp"
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME || "creaibox-assets";
  const r2Client = getR2Client();
  const key = `sites/custom-clients/${clientSlug}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await r2Client.send(command);
  return getR2CdnUrl(key);
}
