import { createClient } from "@supabase/supabase-js";
import { decryptApiKey } from "./api-vault-crypto";

export type ApiProvider = "gemini" | "openai" | "claude";

export type ApiVaultKey = {
  id: number;
  key: string;
  label: string;
  display_name: string;
  provider: ApiProvider;
  model: string;
  status: string;
  use_count: number;
  today_count: number;
  daily_limit: number;
  priority: number;
  allowed_plan?: string;
  cost_weight?: number;
};

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getActiveVaultKeys(provider: ApiProvider = "gemini") {
  const { data, error } = await supabaseAdmin
    .from("admin_api_vault")
    .select(
      "id,key,label,display_name,provider,model,status,use_count,today_count,daily_limit,priority,allowed_plan,cost_weight"
    )
    .eq("status", "active")
    .eq("provider", provider)
    .order("priority", { ascending: true })
    .order("today_count", { ascending: true })
    .order("use_count", { ascending: true })
    .limit(10);

  if (error) throw new Error(error.message);

  return (data || []) as ApiVaultKey[];
}

export function decryptVaultKey(vaultKey: ApiVaultKey) {
  return decryptApiKey(vaultKey.key);
}

export async function recordVaultSuccess(vaultId: number) {
  await supabaseAdmin.rpc("increment_api_vault_usage", {
    target_id: vaultId,
  });
}

export async function recordVaultFailure(vaultId: number, errorMessage: string) {
  await supabaseAdmin
    .from("admin_api_vault")
    .update({
      last_error: errorMessage.slice(0, 500),
      failure_count: 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", vaultId);
}

export async function checkAndResetDailyCounts() {
  try {
    // 1. Get current date string in KST (Asia/Seoul)
    const d = new Date();
    const kstTime = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const todayKst = kstTime.toISOString().split("T")[0]; // YYYY-MM-DD

    // 2. Fetch the plan limits configuration row from admin_api_vault
    const { data: limitsRow } = await supabaseAdmin
      .from("admin_api_vault")
      .select("id, note")
      .eq("provider", "system")
      .eq("model", "plan_limits")
      .maybeSingle();

    let config: any = {};
    if (limitsRow?.note) {
      try {
        config = JSON.parse(limitsRow.note);
      } catch {}
    }

    const lastResetDate = config.last_reset_date || "";

    // 3. If today is different from last reset date, reset today_count to 0 for all keys!
    if (lastResetDate !== todayKst) {
      // Update all keys (except the system configuration row) to set today_count = 0
      const { error: resetErr } = await supabaseAdmin
        .from("admin_api_vault")
        .update({ today_count: 0 })
        .neq("provider", "system");

      if (resetErr) {
        console.error("Daily count reset failed:", resetErr.message);
        return;
      }

      // Update the system configuration row with the new reset date
      const newConfig = {
        ...config,
        last_reset_date: todayKst,
      };

      if (limitsRow?.id) {
        await supabaseAdmin
          .from("admin_api_vault")
          .update({
            note: JSON.stringify(newConfig),
            updated_at: new Date().toISOString(),
          })
          .eq("id", limitsRow.id);
      } else {
        await supabaseAdmin.from("admin_api_vault").insert([
          {
            key: "system_placeholder",
            label: "System Plan Limits Config",
            display_name: "Plan Limits Config",
            provider_type: "system",
            provider: "system",
            model: "plan_limits",
            status: "active",
            note: JSON.stringify(newConfig),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
      console.log(`[Daily Reset] Successfully reset today_count for all vault keys to 0 for date: ${todayKst}`);
    }
  } catch (err) {
    console.error("checkAndResetDailyCounts failed:", err);
  }
}