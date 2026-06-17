import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 미들웨어에서 호출될 때를 대비한 예외 처리입니다.
          }
        },
      },
    }
  )
}

export async function createAdminClient() {
  let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.error("❌ [Supabase Admin Client] Warning: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables!");
  } else {
    // 🌟 방어 코드: 복사-붙여넣기 실수로 개행(\n)이나 다른 환경변수가 섞여 들어온 경우 첫 줄만 추출 후 공백 제거
    serviceKey = serviceKey.split("\n")[0].trim();
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}