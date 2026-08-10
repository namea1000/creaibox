"use client";

import { createClient } from "../../utils/supabase/client";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { Provider } from "@supabase/supabase-js";

export default function LoginPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState("jenam7720@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic Brand Customization State
  const [brandConfig, setBrandConfig] = useState<{
    name?: string;
    logoUrl?: string;
    slogan?: string;
  } | null>(null);

  useEffect(() => {
    async function fetchBrandConfig() {
      if (typeof window === "undefined") return;
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let brandId = "";

      if (parts.length === 3 && parts[1] === "creaibox") {
        brandId = parts[0];
      } else if (parts.length === 2 && parts[1] === "localhost") {
        brandId = parts[0];
      }

      if (brandId && !["www", "studio", "admin", "api", "assets"].includes(brandId.toLowerCase())) {
        const normalizedId = brandId.toLowerCase() === "auramerino" ? "aura-merino" : brandId.toLowerCase();
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("extra_configs, brand_id")
          .eq("brand_id", normalizedId)
          .maybeSingle();

        if (profile?.extra_configs) {
          const cfg = profile.extra_configs as Record<string, any>;
          setBrandConfig({
            name: cfg.companyName || profile.brand_id,
            logoUrl: cfg.logoUrl,
            slogan: cfg.heroSlogan || cfg.description || `${cfg.companyName || brandId} 커스텀 멤버십 로그인`,
          });
        } else {
          // Hardcoded brand fallbacks for primary demo custom sites
          if (normalizedId === "aura-merino" || normalizedId === "auramerino") {
            setBrandConfig({
              name: "아우라 메리노 (Aura Merino)",
              slogan: "100% 천연 메리노 울 스니커즈 회원 혜택 & 전용 로그인",
            });
          } else if (normalizedId === "sotongcheum") {
            setBrandConfig({
              name: "소통과 채움",
              slogan: "공공행사 & 지역 축제 렌탈 전용 브랜드 회원 로그인",
            });
          }
        }
      }
    }
    void fetchBrandConfig();
  }, [supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인 실패: " + error.message);
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();

    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const handleSocialLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) alert(`${provider} 로그인 중 오류가 발생했습니다.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-[460px] w-full space-y-8 bg-black/60 border border-zinc-800/50 p-10 lg:p-14 rounded-[32px] backdrop-blur-2xl shadow-2xl relative z-10">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block transition hover:scale-[1.02] active:scale-[0.98]">
            {brandConfig?.logoUrl ? (
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig.name || "Brand Logo"}
                className="object-contain mx-auto h-10 w-auto"
              />
            ) : brandConfig?.name ? (
              <h2 className="text-2xl font-black text-white tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
                {brandConfig.name}
              </h2>
            ) : (
              <Image
                src="/logo_dark.png"
                alt="CreAibox Logo"
                width={210}
                height={40}
                className="object-contain mx-auto h-10 w-auto"
                priority
              />
            )}
          </Link>
          <p className="text-zinc-400 text-sm font-semibold tracking-tight">
            {brandConfig?.slogan || "가장 스마트한 AI Contents Studio 입장"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black py-3 rounded-full font-bold text-sm transition-all shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
            Google로 계속하기
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("kakao")}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FADA00] text-black py-3 rounded-full font-bold text-sm transition-all"
          >
            <MessageCircle size={18} fill="black" />
            카카오톡으로 시작하기
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/auth/naver/login?prompt=select_account";
            }}
            className="w-full flex items-center justify-center gap-3 bg-[#03C75A] hover:bg-[#02b350] text-white py-3 rounded-full font-bold text-sm transition-all shadow-sm cursor-pointer"
          >
            <span className="font-black text-base leading-none">N</span>
            네이버 아이디로 로그인
          </button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-zinc-800/50" />
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            OR EMAIL
          </span>
          <div className="h-[1px] flex-1 bg-zinc-800/50" />
        </div>

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

        <div className="text-center space-y-6 pt-2">
          <Link href="#" className="text-xs text-zinc-600 hover:text-white transition-all block font-medium">
            비밀번호를 잊으셨나요?
          </Link>

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-zinc-500">아직 계정이 없으신가요?</p>
            <Link
              href="/signup"
              className="text-white font-black text-sm hover:text-blue-500 underline underline-offset-8 transition-all"
            >
              지금 바로 무료 가입하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}