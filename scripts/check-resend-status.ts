import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

import { getResendClient } from "@/lib/server/resend-email";

async function main() {
  const resend = getResendClient();

  console.log("=== Checking Resend API Logs ===");
  try {
    const emailsList = await resend.emails.list();
    console.log("Recent Emails:", JSON.stringify(emailsList, null, 2));
  } catch (err: any) {
    console.error("Emails list error:", err.message);
  }

  try {
    const domainsList = await resend.domains.list();
    console.log("Domains List:", JSON.stringify(domainsList, null, 2));
  } catch (err: any) {
    console.error("Domains list error:", err.message);
  }
}

main().catch(console.error);
