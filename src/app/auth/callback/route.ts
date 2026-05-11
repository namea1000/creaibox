import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 로그인 성공 후 보낼 페이지 (온보딩)
  // origin을 사용하면 localhost면 localhost로, 배포사이트면 배포사이트로 자동 대응합니다.
  const next = `${origin}/onboarding`

  if (code) {
    const supabase = await createClient()
    
    // 이 단계에서 'code'를 실제 사용자 '세션'으로 교환합니다.
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 세션 교환 성공! 유연하게 리다이렉트
      return NextResponse.redirect(next)
    }
    
    // 에러 발생 시 로그인 페이지로 에러 메시지와 함께 전송
    console.error('Auth error:', error.message)
    return NextResponse.redirect(`${origin}/login?error_msg=${encodeURIComponent(error.message)}`)
  }

  // 코드가 없는 경우 실패 처리
  return NextResponse.redirect(`${origin}/login?error_details=auth_failed`)
}