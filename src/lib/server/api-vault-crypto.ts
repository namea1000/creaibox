import crypto from "crypto";

const ENCRYPTION_KEY = Buffer.from(
  process.env.API_VAULT_ENCRYPTION_KEY || "",
  "base64"
);

function assertEncryptionKey() {
  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("API_VAULT_ENCRYPTION_KEY must be a 32-byte base64 key.");
  }
}

export function encryptApiKey(rawKey: string) {
  assertEncryptionKey();

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(rawKey, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function decryptApiKey(encryptedText: string) {
  assertEncryptionKey();

  const parts = encryptedText.split(".");

  if (parts.length !== 3) {
    try {
      return Buffer.from(encryptedText, "base64").toString("utf8");
    } catch {
      return encryptedText;
    }
  }

  const [ivBase64, authTagBase64, encryptedBase64] = parts;

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    ENCRYPTION_KEY,
    Buffer.from(ivBase64, "base64")
  );

  decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function maskApiKey() {
  return "••••••••••••••••";
}