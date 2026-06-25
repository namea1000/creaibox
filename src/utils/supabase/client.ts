import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  const url = typeof window !== 'undefined'
    ? window.location.origin + '/supabase'
    : process.env.NEXT_PUBLIC_SUPABASE_URL!;

  client = createBrowserClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}