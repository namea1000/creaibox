"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Shield,
  Trash2,
  Globe,
  Save,
  Sparkles,
  CheckCircle,
  Mail,
  LogIn,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";

type WpSite = {
  siteName: string;
  url: string;
  userId: string;
  appPassword: string;
};

type ProfileState = {
  nickname: string;
  brand_id: string;
  membership_level: string;
  extra_configs?: {
    wp_sites?: WpSite[];
    [key: string]: any;
  };
};

export default function MyPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wpSites, setWpSites] = useState<WpSite[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState<ProfileState>({
    nickname: "",
    brand_id: "",
    membership_level: "free",
    extra_configs: {},
  });

  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,12}$/;

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setIsDataLoading(true);

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        setUser(currentUser);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (error) {
          console.error("프로필 로드 실패:", error);
        }

        if (data) {
          setProfile({
            nickname: data.nickname || "",
            brand_id: data.brand_id || "",
            membership_level: data.membership_level || "free",
            extra_configs: data.extra_configs || {},
          });

          setWpSites(data.extra_configs?.wp_sites || []);
        }
      } finally {
        if (mounted) setIsDataLoading(false);
      }
    };

    void fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  const checkDuplicate = async (field: "nickname", value: string) => {
    const trimmedValue = value ? value.trim() : "";

    if (!nicknameRegex.test(trimmedValue)) {
      alert("❌ 닉네임은 띄어쓰기, 특수문자 없이 한글, 영문, 숫자 조합으로 2~12자만 가능합니다.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(field)
      .eq(field, trimmedValue)
      .not("id", "eq", user?.id)
      .maybeSingle();

    if (error) {
      alert("체크 중 오류가 발생했습니다.");
      return;
    }

    alert(data ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다!");
  };

  const addWpSite = () => {
    setWpSites((prev) => [...prev, { siteName: "", url: "", userId: "", appPassword: "" }]);
  };

  const removeWpSite = (index: number) => {
    setWpSites((prev) => prev.filter((_, i) => i !== index));
  };

  const updateWpSite = (index: number, field: keyof WpSite, value: string) => {
    setWpSites((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.replace("/login");
      return;
    }

    const trimmedNickname = profile.nickname ? profile.nickname.trim() : "";

    if (!nicknameRegex.test(trimmedNickname)) {
      alert("❌ 닉네임 형식이 올바르지 않습니다.\n띄어쓰기, 특수문자 없는 한글/영문/숫자 2~12자");
      return;
    }

    setIsSaving(true);

    try {
      const nextProfile = {
        id: user.id,
        nickname: trimmedNickname,
        brand_id: profile.brand_id || "",
        membership_level: profile.membership_level || "free",
        extra_configs: {
          ...(profile.extra_configs || {}),
          wp_sites: wpSites,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(nextProfile, { onConflict: "id" });

      if (error) {
        console.error("Supabase Profile Sync Error:", error);
        alert(`저장 실패: ${error.message}`);
        return;
      }

      setProfile((prev) => ({
        ...prev,
        nickname: trimmedNickname,
        extra_configs: nextProfile.extra_configs,
      }));

      alert("🎉 프로필 설정이 성공적으로 동기화되었습니다!");

      router.refresh();

      setTimeout(() => {
        window.location.reload();
      }, 150);
    } catch (err: any) {
      console.error("Unexpected Save Error:", err);
      alert(`시스템 통신 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05070a] text-white">
        <RefreshCw className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#05070a] font-sans text-zinc-100">
      <Sidebar
        activeMenu="MyPage"
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <StudioTopbar setIsMobileOpen={setIsMobileOpen} />

        <div className="flex min-h-0 min-w-0 flex-1">
          <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
          <div className="mx-auto max-w-[1400px] p-6 pt-4 pb-48 lg:p-12 lg:pt-10">
            <header className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-zinc-800 pb-10 text-left md:flex-row md:items-end">
              <div className="space-y-2">
                <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter text-white">
                  My <span className="text-blue-500">Profile</span> Settings
                </h1>
                <p className="mt-3 pl-1 text-[10px] font-black uppercase italic tracking-[0.3em] text-zinc-500">
                  Strategic Personal Environment & Identity Management
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group flex items-center gap-3 rounded-2xl border border-blue-400/30 bg-blue-600 px-10 py-5 text-sm font-black uppercase italic tracking-widest text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw size={18} className="animate-spin text-white" />
                ) : (
                  <Save size={18} className="transition-transform group-hover:scale-110" />
                )}
                Sync & Save All Settings
              </button>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section className="space-y-8 rounded-[40px] border border-zinc-800 bg-zinc-900/40 p-10 text-left shadow-2xl transition-all hover:border-zinc-700">
                <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
                  <User className="text-blue-500" size={24} />
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Identity</h2>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-widest text-blue-500">
                      <Sparkles size={14} /> 활동 닉네임 브랜딩
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={profile.nickname || ""}
                        onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                        className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-sm font-bold text-white shadow-inner outline-none transition-all placeholder:text-zinc-800 focus:border-blue-500"
                        placeholder="나만의 닉네임을 입력하세요"
                      />

                      <button
                        onClick={() => checkDuplicate("nickname", profile.nickname)}
                        className="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 text-[11px] font-black uppercase italic tracking-tighter text-zinc-300 transition-all hover:bg-zinc-700"
                      >
                        Check
                      </button>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-blue-500/10 bg-blue-600/5 p-5">
                      <p className="flex items-center gap-2 text-xs font-black leading-relaxed text-blue-400">
                        <CheckCircle size={14} /> 닉네임 설정 가이드
                      </p>
                      <p className="text-[11px] font-bold leading-relaxed text-zinc-500">
                        현재 할당된 닉네임은 계정 생성을 위한 임시 아이디일 수 있습니다.
                        커뮤니티 활동을 위해 나만의 고유한 닉네임으로 변경해 주세요.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 opacity-40 grayscale">
                    <label className="pl-1 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      Brand ID
                    </label>
                    <div className="flex items-center rounded-2xl border border-zinc-800 bg-black/40 px-6 py-4">
                      <span className="text-sm font-black uppercase italic text-zinc-600">Coming Soon</span>
                      <span className="ml-auto text-xs font-black text-zinc-800">.creaibox.com</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="h-fit space-y-8 rounded-[40px] border border-zinc-800 bg-zinc-900/40 p-10 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
                  <Shield className="text-emerald-500" size={24} />
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Security</h2>
                </div>

                <div className="space-y-7">
                  <div className="flex items-center justify-between border-b border-zinc-800/30 py-2">
                    <span className="flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      <Mail size={14} className="text-zinc-700" /> Account ID
                    </span>
                    <span className="font-mono text-sm font-black italic tracking-tighter text-zinc-300">
                      {user?.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800/30 py-2">
                    <span className="flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      <LogIn size={14} className="text-zinc-700" /> Auth Provider
                    </span>
                    <span className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-2 text-[10px] font-black uppercase italic tracking-widest text-emerald-500">
                      {user?.app_metadata?.provider || "email"} AUTHENTICATED
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800/30 py-2">
                    <span className="pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      Creation Date
                    </span>
                    <span className="text-sm font-black italic text-zinc-400">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      Plan Level
                    </span>
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-6 py-2 text-sm font-black uppercase italic tracking-widest text-blue-500">
                      {profile.membership_level || "free"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="space-y-10 rounded-[40px] border border-zinc-800 bg-zinc-900/40 p-10 shadow-2xl lg:col-span-2">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-8">
                  <div className="flex items-center gap-4 text-left">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-inner">
                      <Globe className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                        WP Distribution Center
                      </h2>
                      <p className="mt-1 text-[10px] font-bold uppercase italic tracking-widest text-zinc-600">
                        Multi-Site Connectivity Hub
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={addWpSite}
                    className="rounded-xl border border-blue-500/20 bg-blue-600/10 px-8 py-3 text-[11px] font-black uppercase italic tracking-widest text-blue-500 shadow-lg shadow-blue-900/10 transition-all hover:bg-blue-600 hover:text-white"
                  >
                    + Register Site
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 px-2 text-xs font-black uppercase italic tracking-widest text-emerald-500">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Active Multi-Sites
                    </h3>

                    {wpSites.length === 0 && (
                      <p className="rounded-[32px] border border-dashed border-zinc-800 px-6 py-10 text-center text-xs italic text-zinc-700">
                        No active channels found.
                      </p>
                    )}

                    <div className="space-y-4">
                      {wpSites.map((site, index) => (
                        <div
                          key={index}
                          className="group relative space-y-6 rounded-[32px] border border-zinc-800 bg-black/40 p-10 shadow-inner transition-all hover:border-blue-900/50"
                        >
                          <button
                            onClick={() => removeWpSite(index)}
                            className="absolute top-8 right-8 rounded-xl p-2 text-zinc-800 transition-colors hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 size={20} />
                          </button>

                          <div className="space-y-4 pt-4 text-left">
                            <input
                              type="text"
                              placeholder="Site Name"
                              value={site.siteName}
                              onChange={(e) => updateWpSite(index, "siteName", e.target.value)}
                              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="URL (https://...)"
                              value={site.url}
                              onChange={(e) => updateWpSite(index, "url", e.target.value)}
                              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="User ID"
                                value={site.userId}
                                onChange={(e) => updateWpSite(index, "userId", e.target.value)}
                                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                              />
                              <input
                                type="password"
                                placeholder="Pass"
                                value={site.appPassword}
                                onChange={(e) => updateWpSite(index, "appPassword", e.target.value)}
                                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="group relative h-fit space-y-8 overflow-hidden rounded-[40px] border border-dashed border-zinc-800 bg-zinc-900/20 p-12 text-left opacity-60">
                    <Globe className="absolute top-8 right-8 opacity-5 transition-opacity group-hover:opacity-10" size={120} />
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase italic tracking-widest text-zinc-500">
                      <Sparkles size={14} /> Personal Blog Status
                    </h3>
                    <div className="relative z-10 flex items-center gap-3 rounded-3xl border border-zinc-800/50 bg-black/60 p-6 font-black uppercase italic tracking-tighter text-zinc-600 shadow-inner">
                      <CheckCircle size={20} className="text-zinc-800" />
                      <span>Ready to Launch</span>
                      <span className="ml-auto font-mono text-[10px] opacity-20">.creaibox.com</span>
                    </div>
                    <p className="relative z-10 pl-1 text-[11px] font-bold uppercase italic leading-relaxed tracking-widest text-zinc-600">
                      전용 서브도메인이 할당될 준비가 되었습니다. 고유 브랜드 ID 정책 수립 후 공식 오픈 예정입니다.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

        </main>

          <div className="hidden shrink-0 border-l border-zinc-800/50 bg-[#05070a] xl:flex">
            <Aside />
          </div>
        </div>
      </div>
    </div>
  );
}
