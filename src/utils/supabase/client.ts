import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // .env.local에 저장된 환경 변수를 사용하여 클라이언트를 생성합니다.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}