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
};

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getActiveVaultKeys(provider: ApiProvider = "gemini") {
  const { data, error } = await supabaseAdmin
    .from("admin_api_vault")
    .select(
      "id,key,label,display_name,provider,model,status,use_count,today_count,daily_limit,priority"
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