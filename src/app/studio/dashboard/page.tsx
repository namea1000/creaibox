"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Music,
  Image as ImageIcon,
  Video,
  Zap,
  Clock,
  Crown,
  RefreshCw,
  Database,
  Key,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type DashboardStats = {
  creaiboxPosts: number;
  naverPosts: number;
  wordpressPosts: number;
  musicProjects: number;
  imageProjects: number;
  videoProjects: number;
  todayUsage: number;
  totalUsage: number;
  apiKeys: number;
};

type RecentItem = {
  id: string;
  title: string;
  type: string;
  created_at?: string;
  updated_at?: string;
};

export default function UserDashboardPage() {
  const supabase = useMemo(() => createClient(), []);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    creaiboxPosts: 0,
    naverPosts: 0,
    wordpressPosts: 0,
    musicProjects: 0,
    imageProjects: 0,
    videoProjects: 0,
    todayUsage: 0,
    totalUsage: 0,
    apiKeys: 0,
  });

  const countRows = async (table: string, userId: string) => {
    const { count } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    return count || 0;
  };

  const getRecentRows = async (
    table: string,
    userId: string,
    type: string,
    titleColumn = "title"
  ): Promise<RecentItem[]> => {
    const { data, error } = await supabase
      .from(table)
      .select(`id, ${titleColumn}, created_at, updated_at`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: String(item.id),
      title: item[titleColumn] || "제목 없음",
      type,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  };

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      setProfile(prof);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        creaiboxPosts,
        naverPosts,
        wordpressPosts,
        musicProjects,
        recentCreaibox,
        recentNaver,
        recentMusic,
      ] = await Promise.all([
        countRows("writing_creaibox_posts", currentUser.id).catch(() => 0),
        countRows("writing_naver_posts", currentUser.id).catch(() => 0),
        countRows("writing_wordpress_posts", currentUser.id).catch(() => 0),
        countRows("music_lyrics_projects", currentUser.id).catch(() => 0),

        getRecentRows(
          "writing_creaibox_posts",
          currentUser.id,
          "Creaibox 블로그"
        ).catch(() => []),

        getRecentRows(
          "writing_naver_posts",
          currentUser.id,
          "네이버 글쓰기"
        ).catch(() => []),

        getRecentRows(
          "music_lyrics_projects",
          currentUser.id,
          "음악 / 가사"
        ).catch(() => []),
      ]);

      const usageResult = await supabase
        .from("ai_generation_usage_logs")
        .select("id, created_at")
        .eq("user_id", currentUser.id);

      const usageLogs = usageResult.data || [];

      const todayUsage = usageLogs.filter(
        (log: any) => new Date(log.created_at) >= today
      ).length;

      const localApiKeys = [
        "gemini_postpay_api_key",
        "gemini_free_api_key",
        "openai_api_key",
        "claude_api_key",
        "google_search_api_key",
        "naver_search_api_key",
        "youtube_api_key",
        "design_api_key",
        "voice_api_key",
      ].filter((key) => localStorage.getItem(key)).length;

      setStats({
        creaiboxPosts,
        naverPosts,
        wordpressPosts,
        musicProjects,
        imageProjects: 0,
        videoProjects: 0,
        todayUsage,
        totalUsage: usageLogs.length,
        apiKeys: localApiKeys,
      });

      setRecentItems(
        [...recentCreaibox, ...recentNaver, ...recentMusic]
          .sort(
            (a, b) =>
              new Date(b.created_at || b.updated_at || "").getTime() -
              new Date(a.created_at || a.updated_at || "").getTime()
          )
          .slice(0, 8)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const plan = profile?.membership_level || profile?.role || "free";
  const todayLimit = plan === "free" ? 3 : plan === "pro" ? 100 : "∞";

  return (
    <div className="mx-auto max-w-[1500px] p-6 pb-24 text-left font-sans text-slate-100">
      <header className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black uppercase italic tracking-tighter text-white">
            <LayoutDashboard className="h-7 w-7 text-blue-500" />
            My <span className="text-blue-500">Dashboard</span>
          </h1>
          <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-zinc-500">
            내 콘텐츠 · AI 사용량 · API 연결 상태 통합 현황
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-black uppercase text-zinc-300 hover:text-white"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          새로고침
        </button>
      </header>

      <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="전체 글쓰기 콘텐츠" value={stats.creaiboxPosts + stats.naverPosts + stats.wordpressPosts} color="text-blue-400" />
        <StatCard icon={Music} label="음악 / 가사 프로젝트" value={stats.musicProjects} color="text-rose-400" />
        <StatCard icon={Zap} label="오늘 AI 사용량" value={`${stats.todayUsage} / ${todayLimit}`} color="text-amber-400" />
        <StatCard icon={Key} label="개인 API 연결" value={stats.apiKeys} color="text-emerald-400" />
      </section>

      <section className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="mb-3.5 flex items-center gap-2 text-base font-black uppercase italic text-white">
            <Database className="text-blue-500" size={16} />
            콘텐츠 현황
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <MiniCard label="Creaibox 블로그" value={stats.creaiboxPosts} />
            <MiniCard label="네이버 글쓰기" value={stats.naverPosts} />
            <MiniCard label="워드프레스 글쓰기" value={stats.wordpressPosts} />
            <MiniCard label="이미지 프로젝트" value={stats.imageProjects} />
            <MiniCard label="비디오 프로젝트" value={stats.videoProjects} />
            <MiniCard label="전체 AI 사용" value={stats.totalUsage} />
          </div>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">
          <h2 className="mb-3.5 flex items-center gap-2 text-base font-black uppercase italic text-white">
            <ShieldCheck className="text-blue-400" size={16} />
            계정 상태
          </h2>

          <div className="space-y-2 text-xs">
            <InfoRow label="닉네임" value={profile?.nickname || user?.email?.split("@")[0] || "-"} />
            <InfoRow label="플랜" value={String(plan).toUpperCase()} />
            <InfoRow label="이메일" value={user?.email || "-"} />
            <InfoRow label="가입일" value={user?.created_at ? new Date(user.created_at).toLocaleDateString("ko-KR") : "-"} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="mb-3.5 flex items-center gap-2 text-base font-black uppercase italic text-white">
          <Clock className="text-purple-400" size={16} />
          최근 작업
        </h2>

        {loading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">불러오는 중...</div>
        ) : recentItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 py-12 text-center text-xs font-bold text-zinc-600">
            아직 생성한 콘텐츠가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {recentItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-xs font-black text-white">{item.title}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-zinc-500">{item.type}</p>
                </div>
                <p className="text-[10px] font-bold text-zinc-600">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString("ko-KR")
                    : "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      <footer className="mt-8 pb-4 text-center text-[9px] font-black uppercase italic tracking-[0.4em] text-zinc-800">
        Creaibox Personal AI Workspace Dashboard
      </footer>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-xl">
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 ${color}`}>
          <Icon size={16} />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      </div>
      <p className="mt-1 text-xl font-black italic tracking-tighter text-white">{value}</p>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/20 p-3.5">
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2 last:border-b-0">
      <span className="font-bold text-zinc-400">{label}</span>
      <span className="text-right font-black text-white">{value}</span>
    </div>
  );
}