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

import { addDnsRecordToVercel } from "@/lib/server/vercel-domains";

async function main() {
  const domain = "creaibox.com";

  // Inbound Receiving MX Record
  const rec = {
    name: "@",
    type: "MX",
    value: "inbound-smtp.ap-northeast-1.amazonaws.com",
    priority: 10,
  };

  console.log(`Injecting Receiving MX record into Vercel DNS for ${domain}...`);

  try {
    const result = await addDnsRecordToVercel(domain, rec);
    console.log(`✅ Success: ${rec.type} ${rec.name} -> Record ID: ${result.id || JSON.stringify(result)}`);
  } catch (err: any) {
    console.error(`❌ Result:`, err.message || err);
  }
}

main().catch(console.error);
