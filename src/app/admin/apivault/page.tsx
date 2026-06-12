"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShieldAlert,
  Key,
  Database,
  Trash2,
  Plus,
  RefreshCw,
  X,
  Loader2,
  Edit3,
  Activity,
  Zap,
  AlertTriangle,
  BarChart3,
  Image as ImageIcon,
  Video,
  Mic,
  Search,
  PieChart,
  DollarSign,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = ["creaiboxofficial@gmail.com", "jenam7720@gmail.com", "namjjang7720@gmail.com"];

const PROVIDER_TYPE_OPTIONS = [
  { value: "ai", label: "AI Provider Pool", icon: Zap },
  { value: "image", label: "Image Provider Pool", icon: ImageIcon },
  { value: "video", label: "Video Provider Pool", icon: Video },
  { value: "voice", label: "Voice / Audio Provider Pool", icon: Mic },
  { value: "search", label: "Search / Data API Pool", icon: Search },
];

const PROVIDER_OPTIONS: Record<string, { value: string; label: string }[]> = {
  ai: [
    { value: "gemini", label: "Gemini" },
    { value: "openai", label: "ChatGPT / OpenAI" },
    { value: "claude", label: "Claude" },
    { value: "groq", label: "Groq" },
    { value: "together", label: "Together AI" },
    { value: "fireworks", label: "Fireworks AI" },
  ],
  image: [
    { value: "stability", label: "Stability AI" },
    { value: "replicate", label: "Replicate" },
    { value: "leonardo", label: "Leonardo AI" },
    { value: "runware", label: "Runware" },
    { value: "clipdrop", label: "Clipdrop" },
    { value: "openai_images", label: "OpenAI Images" },
  ],
  video: [
    { value: "runway", label: "Runway" },
    { value: "pika", label: "Pika" },
    { value: "luma", label: "Luma AI" },
    { value: "fal", label: "Fal AI" },
  ],
  voice: [
    { value: "elevenlabs", label: "ElevenLabs" },
    { value: "playht", label: "PlayHT" },
    { value: "cartesia", label: "Cartesia" },
  ],
  search: [
    { value: "google_search", label: "Google Search API" },
    { value: "naver_search", label: "Naver Search API" },
    { value: "youtube", label: "YouTube Data API" },
    { value: "newsapi", label: "News API" },
    { value: "serpapi", label: "SerpAPI" },
  ],
};

const MODEL_OPTIONS: Record<string, string[]> = {
  gemini: ["gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-2.5-flash"],
  openai: ["gpt-4.1", "gpt-4.1-mini", "gpt-4o-mini"],
  claude: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"],
  groq: [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "groq/compound-mini",
    "groq/compound",
    "qwen/qwen3-32b",
    "meta-llama/llama-4-scout-17b-16e-instruct",
  ],
  together: ["meta-llama/Llama-3.3-70B-Instruct-Turbo", "Qwen/Qwen2.5-72B-Instruct-Turbo"],
  fireworks: ["accounts/fireworks/models/llama-v3p1-70b-instruct"],

  stability: ["stable-image-core", "stable-image-ultra", "sd3.5-large"],
  replicate: ["black-forest-labs/flux-schnell", "black-forest-labs/flux-dev", "stability-ai/sdxl"],
  leonardo: ["phoenix", "alchemy", "anime", "photoreal"],
  runware: ["flux", "sdxl", "sd3"],
  clipdrop: ["background-removal", "upscale", "text-to-image"],
  openai_images: ["gpt-image-1", "dall-e-3"],

  runway: ["gen-3-alpha", "gen-2"],
  pika: ["pika-video"],
  luma: ["dream-machine"],
  fal: ["fal-ai/flux-pro", "fal-ai/kling-video"],

  elevenlabs: ["eleven_multilingual_v2", "eleven_turbo_v2_5"],
  playht: ["playht-2.0", "playht-3.0"],
  cartesia: ["sonic-english", "sonic-multilingual"],

  google_search: ["programmable-search"],
  naver_search: ["naver-search"],
  youtube: ["youtube-data-v3"],
  newsapi: ["newsapi"],
  serpapi: ["serpapi"],
};

const PLAN_OPTIONS = [
  { value: "free", label: "Free Trial" },
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "business", label: "Business" },
  { value: "admin", label: "Admin Only" },
];

type ApiVaultItem = {
  id: number;
  key: string;
  label: string;
  display_name: string;
  provider_type: string;
  provider: string;
  model: string;
  status: string;
  use_count?: number | null;
  today_count?: number | null;
  daily_limit?: number | null;
  monthly_limit?: number | null;
  priority?: number | null;
  failure_count?: number | null;
  last_error?: string | null;
  allowed_plan?: string | null;
  cost_weight?: number | null;
  quality_score?: number | null;
  avg_latency_ms?: number | null;
  supports_search?: boolean | null;
  supports_streaming?: boolean | null;
  is_fallback?: boolean | null;
  api_base_url?: string | null;
  usage_unit?: string | null;
  note?: string | null;
};

const emptyKey = {
  key: "",
  label: "",
  display_name: "",
  provider_type: "ai",
  provider: "gemini",
  model: "gemini-3-flash-preview",
  status: "active",
  daily_limit: 1000,
  monthly_limit: 30000,
  priority: 100,
  allowed_plan: "free",
  cost_weight: 1,
  quality_score: 80,
  supports_search: true,
  supports_streaming: false,
  is_fallback: true,
  api_base_url: "",
  usage_unit: "request",
  note: "",
};

export default function APIVaultAdminPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [apiKeys, setApiKeys] = useState<ApiVaultItem[]>([]);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeType, setActiveType] = useState("ai");
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newKey, setNewKey] = useState(emptyKey);
  const [usageStats, setUsageStats] = useState({
    totalCalls: 0,
    monthlyCalls: 0,
    failCount: 0,
    estimatedCost: 0,
  });

  const [providerUsage, setProviderUsage] = useState<any[]>([]);
  const [studioUsage, setStudioUsage] = useState<any[]>([]);

  const fetchKeys = useCallback(
    async (email?: string) => {
      try {
        setLoading(true);
        const targetEmail = email || adminEmail;
        if (!targetEmail) throw new Error("관리자 이메일을 확인하지 못했습니다.");

        const response = await fetch("/api/admin/vault", {
          method: "GET",
          headers: { "x-admin-email": targetEmail },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "API 키 목록을 불러오지 못했습니다.");

        setApiKeys(result || []);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setApiKeys([]);
      } finally {
        setLoading(false);
      }
    },
    [adminEmail]
  );

  const fetchUsageAnalytics = useCallback(async () => {
    const { data } = await supabase
      .from("ai_generation_usage_logs")
      .select("*");

    const logs = data || [];

    const totalCalls = logs.length;

    const monthlyCalls = logs.filter((log) => {
      const d = new Date(log.created_at);
      const now = new Date();

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length;

    const failCount = logs.filter(
      (log) => log.status !== "success"
    ).length;

    const estimatedCost = logs.reduce(
      (sum, log) => sum + Number(log.estimated_cost || 0),
      0
    );

    setUsageStats({
      totalCalls,
      monthlyCalls,
      failCount,
      estimatedCost,
    });

    const providerMap: Record<string, number> = {};

    logs.forEach((log) => {
      providerMap[log.provider || "unknown"] =
        (providerMap[log.provider || "unknown"] || 0) + 1;
    });

    setProviderUsage(
      Object.entries(providerMap).map(([provider, count]) => ({
        provider,
        count,
      }))
    );

    const studioMap: Record<string, number> = {};

    logs.forEach((log) => {
      studioMap[log.studio_type || "unknown"] =
        (studioMap[log.studio_type || "unknown"] || 0) + 1;
    });

    setStudioUsage(
      Object.entries(studioMap).map(([studio, count]) => ({
        studio,
        count,
      }))
    );
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
        alert("⚠️ 슈퍼 어드민 전용 구역입니다.");
        router.push("/");
        return;
      }

      const email = user.email || "";
      setIsAdmin(true);
      setAdminEmail(email);
      await fetchKeys(email);
      await fetchUsageAnalytics();
    };

    void checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [supabase, router, fetchKeys]);

  const filteredKeys = useMemo(
    () => apiKeys.filter((key) => (key.provider_type || "ai") === activeType),
    [apiKeys, activeType]
  );

  const getFirstProvider = (providerType: string) => {
    return PROVIDER_OPTIONS[providerType]?.[0]?.value || "gemini";
  };

  const getFirstModel = (provider: string) => {
    return MODEL_OPTIONS[provider]?.[0] || "";
  };

  const handleProviderTypeChange = (providerType: string) => {
    const provider = getFirstProvider(providerType);
    const model = getFirstModel(provider);

    setNewKey((prev) => ({
      ...prev,
      provider_type: providerType,
      provider,
      model,
    }));
  };

  const handleProviderChange = (provider: string) => {
    setNewKey((prev) => ({
      ...prev,
      provider,
      model: getFirstModel(provider),
    }));
  };

  const openCreateModal = () => {
    const provider = getFirstProvider(activeType);
    setEditingId(null);
    setNewKey({
      ...emptyKey,
      provider_type: activeType,
      provider,
      model: getFirstModel(provider),
    });
    setIsAdding(true);
  };

  const handleEditClick = (item: ApiVaultItem) => {
    setNewKey({
      key: "",
      label: item.label || "",
      display_name: item.display_name || "",
      provider_type: item.provider_type || "ai",
      provider: item.provider || "gemini",
      model: item.model || getFirstModel(item.provider || "gemini"),
      status: item.status || "active",
      daily_limit: item.daily_limit || 1000,
      monthly_limit: item.monthly_limit || 30000,
      priority: item.priority || 100,
      allowed_plan: item.allowed_plan || "free",
      cost_weight: item.cost_weight || 1,
      quality_score: item.quality_score || 80,
      supports_search: item.supports_search ?? true,
      supports_streaming: item.supports_streaming ?? false,
      is_fallback: item.is_fallback ?? true,
      api_base_url: item.api_base_url || "",
      usage_unit: item.usage_unit || "request",
      note: item.note || "",
    });

    setEditingId(item.id);
    setIsAdding(true);
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewKey(emptyKey);
  };

  const handleSaveKey = async () => {
    if (!newKey.label.trim() || !newKey.display_name.trim()) {
      alert("관리자 메모와 표시 이름을 입력해주세요.");
      return;
    }

    if (!editingId && !newKey.key.trim()) {
      alert("신규 등록 시 API KEY를 입력해주세요.");
      return;
    }

    setSaveLoading(true);

    try {
      const response = await fetch("/api/admin/vault", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          id: editingId,
          ...newKey,
          key: newKey.key.trim(),
          label: newKey.label.trim(),
          display_name: newKey.display_name.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "저장 실패");

      alert(editingId ? "✅ API Vault 정보가 수정되었습니다." : "✅ 새 API 키가 암호화되어 저장되었습니다.");
      closeModal();
      await fetchKeys();
    } catch (err: any) {
      alert(`저장 실패: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/vault?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-email": adminEmail },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "삭제 실패");

      await fetchKeys();
    } catch (err: any) {
      alert(`삭제 실패: ${err.message}`);
    }
  };

  if (!isAdmin && loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020406]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const totalUsage = apiKeys.reduce((sum, key) => sum + Number(key.use_count || 0), 0);
  const todayUsage = apiKeys.reduce((sum, key) => sum + Number(key.today_count || 0), 0);
  const activeKeys = apiKeys.filter((key) => key.status === "active").length;
  const issueKeys = apiKeys.filter((key) => key.status !== "active" || key.last_error).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020406] font-sans text-slate-100">
      <div className="flex flex-1 overflow-hidden pt-20 text-left">
        <main className="custom-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1800px] p-8 pb-32 lg:p-12">
            <header className="mb-10">
              <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
                <ShieldAlert className="h-10 w-10 text-red-500" />
                Admin <span className="text-red-500">API Gateway Vault</span>
              </h1>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                AI · Image · Video · Voice · Search API 통합 관리 / DB는 하나, 화면은 카테고리별 분리
              </p>
            </header>

            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                ["API Keys", apiKeys.length, Database, "text-white"],

                ["AI Calls", usageStats.totalCalls, Activity, "text-blue-400"],

                ["Monthly Calls", usageStats.monthlyCalls, Zap, "text-emerald-400"],

                [
                  "Estimated Cost",
                  `$${usageStats.estimatedCost.toFixed(2)}`,
                  DollarSign,
                  "text-yellow-400",
                ],
              ].map(([label, value, Icon, color]: any) => (
                <div key={label} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <Icon size={14} />
                    {label}
                  </p>
                  <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </section>

            <section className="mb-8 grid gap-6 lg:grid-cols-2">

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-blue-400">
                  <BarChart3 size={16} />
                  Provider Analytics
                </h3>

                <div className="space-y-2">
                  {providerUsage.map((item) => (
                    <div
                      key={item.provider}
                      className="flex justify-between text-sm"
                    >
                      <span>{item.provider}</span>
                      <span className="font-black text-blue-400">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-emerald-400">
                  <PieChart size={16} />
                  Studio Analytics
                </h3>

                <div className="space-y-2">
                  {studioUsage.map((item) => (
                    <div
                      key={item.studio}
                      className="flex justify-between text-sm"
                    >
                      <span>{item.studio}</span>
                      <span className="font-black text-emerald-400">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mb-6 flex flex-wrap gap-3">
              {PROVIDER_TYPE_OPTIONS.map((type) => {
                const Icon = type.icon;
                const count = apiKeys.filter((key) => (key.provider_type || "ai") === type.value).length;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setActiveType(type.value)}
                    className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-xs font-black uppercase transition-all ${activeType === type.value
                      ? "border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-blue-500/40 hover:text-white"
                      }`}
                  >
                    <Icon size={16} />
                    {type.label}
                    <span className="rounded-full bg-black/30 px-2 py-0.5">{count}</span>
                  </button>
                );
              })}
            </section>

            <div className="overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/30 p-8">
                <h3 className="flex items-center gap-2 text-xl font-black uppercase italic text-white">
                  <Database className="text-blue-500" size={20} />
                  {PROVIDER_TYPE_OPTIONS.find((type) => type.value === activeType)?.label}
                </h3>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => fetchKeys()}
                    className="rounded-xl bg-zinc-800 p-3 text-zinc-400 hover:text-white"
                  >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                  </button>

                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black uppercase text-white transition-all hover:bg-blue-500"
                  >
                    <Plus size={16} />
                    Add New Key
                  </button>
                </div>
              </div>

              <div className="relative min-h-[300px] overflow-x-auto">
                {loading ? (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                  </div>
                ) : (
                  <table className="w-full min-w-[1500px] text-left">
                    <thead>
                      <tr className="border-b border-zinc-800/50 bg-zinc-900/20 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <th className="px-5 py-5">No.</th>
                        <th className="px-5 py-5">Key Info</th>
                        <th className="px-5 py-5">Type</th>
                        <th className="px-5 py-5">Provider</th>
                        <th className="px-5 py-5">Model / API</th>
                        <th className="px-5 py-5">Plan</th>
                        <th className="px-5 py-5 text-center">Usage</th>
                        <th className="px-5 py-5 text-center">Daily</th>
                        <th className="px-5 py-5 text-center">Monthly</th>
                        <th className="px-5 py-5 text-center">Priority</th>
                        <th className="px-5 py-5">Status</th>
                        <th className="px-5 py-5 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800/30">
                      {filteredKeys.length === 0 ? (
                        <tr>
                          <td colSpan={12} className="px-8 py-20 text-center text-xs font-bold uppercase tracking-widest text-zinc-600">
                            No keys found in this provider pool.
                          </td>
                        </tr>
                      ) : (
                        filteredKeys.map((item, index) => (
                          <tr key={item.id} className="group transition-colors hover:bg-white/[0.02]">
                            <td className="px-5 py-6 font-mono text-xs text-zinc-600">{index + 1}</td>

                            <td className="px-5 py-6">
                              <span className="mb-1 block text-[10px] font-black uppercase tracking-tighter text-blue-500">
                                {item.display_name}
                              </span>
                              <p className="text-sm font-black text-zinc-200">{item.label}</p>
                              <p className="mt-1 font-mono text-[10px] text-zinc-600">{item.key || "••••••••••••••••"}</p>
                            </td>

                            <td className="px-5 py-6">
                              <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-[10px] font-black uppercase text-zinc-300">
                                {item.provider_type || "ai"}
                              </span>
                            </td>

                            <td className="px-5 py-6 text-xs font-bold text-zinc-300">{item.provider}</td>
                            <td className="px-5 py-6 text-xs font-bold text-zinc-400">{item.model}</td>

                            <td className="px-5 py-6">
                              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase text-blue-300">
                                {item.allowed_plan || "free"}
                              </span>
                            </td>

                            <td className="px-5 py-6 text-center">
                              <span className="font-black text-emerald-500">{item.today_count ?? 0}</span>
                              <span className="mx-1 text-zinc-700">/</span>
                              <span className="text-xs font-black italic text-zinc-600">{item.use_count ?? 0}</span>
                            </td>

                            <td className="px-5 py-6 text-center text-xs font-black text-zinc-500">{item.daily_limit ?? 0}</td>
                            <td className="px-5 py-6 text-center text-xs font-black text-zinc-500">{item.monthly_limit ?? 0}</td>
                            <td className="px-5 py-6 text-center text-xs font-black text-zinc-500">{item.priority ?? 100}</td>

                            <td className="px-5 py-6">
                              <span className={`text-[9px] font-black uppercase ${item.status === "active" ? "text-emerald-500" : "text-red-500"}`}>
                                {item.status}
                              </span>
                              {item.last_error && (
                                <p className="mt-1 max-w-[220px] truncate text-[9px] text-red-400">{item.last_error}</p>
                              )}
                            </td>

                            <td className="px-5 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(item)}
                                  className="p-2 text-zinc-500 opacity-0 transition-all hover:text-blue-500 group-hover:opacity-100"
                                >
                                  <Edit3 size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 text-zinc-500 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 text-zinc-100 backdrop-blur-md">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-5">
              <h3 className="flex items-center gap-2 text-lg font-black uppercase italic text-white">
                <Key className="text-blue-500" size={18} />
                {editingId ? "Update API Gateway Key" : "Add New API Gateway Key"}
              </h3>
              <button type="button" onClick={closeModal} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-5 overflow-y-auto p-8 text-left">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Provider Type">
                  <select value={newKey.provider_type} onChange={(event) => handleProviderTypeChange(event.target.value)} className="input-vault">
                    {PROVIDER_TYPE_OPTIONS.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Provider">
                  <select value={newKey.provider} onChange={(event) => handleProviderChange(event.target.value)} className="input-vault">
                    {(PROVIDER_OPTIONS[newKey.provider_type] || []).map((provider) => (
                      <option key={provider.value} value={provider.value}>
                        {provider.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Model / API">
                  <select value={newKey.model} onChange={(event) => setNewKey({ ...newKey, model: event.target.value })} className="input-vault">
                    {(MODEL_OPTIONS[newKey.provider] || []).map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Admin Memo">
                <input value={newKey.label} onChange={(event) => setNewKey({ ...newKey, label: event.target.value })} placeholder="관리자 메모" className="input-vault" />
              </Field>

              <Field label="Display Name">
                <input value={newKey.display_name} onChange={(event) => setNewKey({ ...newKey, display_name: event.target.value })} placeholder="무료체험 Gemini API Key 1" className="input-vault" />
              </Field>

              <Field label="API KEY">
                <input
                  type="password"
                  autoComplete="off"
                  value={newKey.key}
                  onChange={(event) => setNewKey({ ...newKey, key: event.target.value })}
                  placeholder={editingId ? "변경하지 않으려면 비워두세요" : "API Key 입력"}
                  className="input-vault"
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Status">
                  <select value={newKey.status} onChange={(event) => setNewKey({ ...newKey, status: event.target.value })} className="input-vault">
                    <option value="active">active</option>
                    <option value="error">error</option>
                    <option value="limit">limit</option>
                    <option value="disabled">disabled</option>
                  </select>
                </Field>

                <Field label="Allowed Plan">
                  <select value={newKey.allowed_plan} onChange={(event) => setNewKey({ ...newKey, allowed_plan: event.target.value })} className="input-vault">
                    {PLAN_OPTIONS.map((plan) => (
                      <option key={plan.value} value={plan.value}>
                        {plan.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Usage Unit">
                  <input value={newKey.usage_unit} onChange={(event) => setNewKey({ ...newKey, usage_unit: event.target.value })} placeholder="request / token / image / second" className="input-vault" />
                </Field>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Field label="Daily Limit">
                  <input type="number" value={newKey.daily_limit} onChange={(event) => setNewKey({ ...newKey, daily_limit: Number(event.target.value) })} className="input-vault" />
                </Field>

                <Field label="Monthly Limit">
                  <input type="number" value={newKey.monthly_limit} onChange={(event) => setNewKey({ ...newKey, monthly_limit: Number(event.target.value) })} className="input-vault" />
                </Field>

                <Field label="Priority">
                  <input type="number" value={newKey.priority} onChange={(event) => setNewKey({ ...newKey, priority: Number(event.target.value) })} className="input-vault" />
                </Field>

                <Field label="Cost Weight">
                  <input type="number" value={newKey.cost_weight} onChange={(event) => setNewKey({ ...newKey, cost_weight: Number(event.target.value) })} className="input-vault" />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <ToggleBox label="Search" checked={newKey.supports_search} onClick={() => setNewKey({ ...newKey, supports_search: !newKey.supports_search })} />
                <ToggleBox label="Streaming" checked={newKey.supports_streaming} onClick={() => setNewKey({ ...newKey, supports_streaming: !newKey.supports_streaming })} />
                <ToggleBox label="Fallback" checked={newKey.is_fallback} onClick={() => setNewKey({ ...newKey, is_fallback: !newKey.is_fallback })} />
              </div>

              <Field label="API Base URL">
                <input value={newKey.api_base_url} onChange={(event) => setNewKey({ ...newKey, api_base_url: event.target.value })} placeholder="선택 사항" className="input-vault" />
              </Field>

              <Field label="Note">
                <textarea value={newKey.note} onChange={(event) => setNewKey({ ...newKey, note: event.target.value })} placeholder="운영 메모" className="input-vault min-h-[90px]" />
              </Field>
            </div>

            <div className="flex gap-3 border-t border-zinc-800 bg-zinc-950 px-8 py-6">
              <button onClick={closeModal} className="flex-1 rounded-xl bg-zinc-800 py-3 text-[10px] font-black uppercase text-zinc-400">
                Cancel
              </button>

              <button onClick={handleSaveKey} disabled={saveLoading} className="flex-[2] rounded-xl bg-blue-600 py-3 text-[10px] font-black uppercase text-white disabled:opacity-60">
                {saveLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </span>
                ) : editingId ? (
                  "Update Gateway Key"
                ) : (
                  "Store In Gateway"
                )}
              </button>
            </div>
          </div>

          <style jsx global>{`
            .input-vault {
              width: 100%;
              border-radius: 0.75rem;
              border: 1px solid rgb(39 39 42);
              background: rgb(9 9 11);
              padding: 0.75rem 1rem;
              font-size: 0.875rem;
              font-weight: 700;
              color: white;
              outline: none;
            }
            .input-vault:focus {
              border-color: rgb(59 130 246);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="ml-1 text-[9px] font-black uppercase tracking-widest text-blue-500">{label}</label>
      {children}
    </div>
  );
}

function ToggleBox({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase transition-all ${checked
        ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
        : "border-zinc-800 bg-zinc-950 text-zinc-600"
        }`}
    >
      {checked ? "ON" : "OFF"} · {label}
    </button>
  );
}
