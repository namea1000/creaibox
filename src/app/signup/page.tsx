'use client'

import { createClient } from '../../utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Apple, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // 1. 일반 이메일 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert('로그인 실패: ' + error.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  // 2. 소셜 로그인 통합 핸들러
  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'naver' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) alert(`${provider} 로그인 중 오류가 발생했습니다.`)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 font-sans selection:bg-blue-500/30">
      {/* 맥스 스타일 배경 그라데이션 */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[460px] w-full space-y-8 bg-black/60 border border-zinc-800/50 p-10 lg:p-14 rounded-[32px] backdrop-blur-2xl shadow-2xl relative z-10">
        
        {/* 로고 섹션 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            <span className="text-blue-600">Creaibox</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-tight">
            가장 스마트한 AI Contents Studio 입장
          </p>
        </div>

        {/* 4대 소셜 로그인 버튼 그리드 (스포티파이+애플 스타일) */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {/* 구글 */}
          <button 
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black py-3 rounded-full font-bold text-sm transition-all shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
            Google로 계속하기
          </button>
          
          {/* 카카오 */}
          <button 
            onClick={() => handleSocialLogin('kakao')}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FADA00] text-black py-3 rounded-full font-bold text-sm transition-all"
          >
            <MessageCircle size={18} fill="black" />
            카카오톡으로 시작하기
          </button>

          {/* 네이버 */}
          <button 
            onClick={() => handleSocialLogin('naver')}
            className="w-full flex items-center justify-center gap-3 bg-[#03C75A] hover:bg-[#02b351] text-white py-3 rounded-full font-bold text-sm transition-all"
          >
            <span className="font-black text-lg">N</span>
            네이버로 시작하기
          </button>

          {/* 애플 */}
          <button 
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-full font-bold text-sm transition-all border border-zinc-700"
          >
            <Apple size={18} fill="white" />
            Apple로 계속하기
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-zinc-800/50" />
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">OR EMAIL</span>
          <div className="h-[1px] flex-1 bg-zinc-800/50" />
        </div>

        {/* 이메일 로그인 폼 */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              className="block w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 pl-12 pr-4 py-4 text-white placeholder-zinc-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm font-bold"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="block w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 pl-12 pr-4 py-4 text-white placeholder-zinc-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center rounded-full bg-blue-600 py-4 mt-2 text-sm font-black text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.15)] disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "인증 중..." : "로그인하기"}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="text-center space-y-6 pt-2">
          <Link href="#" className="text-xs text-zinc-600 hover:text-white transition-all block font-medium">
            비밀번호를 잊으셨나요?
          </Link>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-zinc-500">
              아직 계정이 없으신가요?
            </p>
            <Link href="/signup" className="text-white font-black text-sm hover:text-blue-500 underline underline-offset-8 transition-all">
              지금 바로 무료 가입하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}