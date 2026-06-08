"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  ExternalLink,
  Key,
  Zap,
  Search,
  MessageSquare,
  Mic,
  Video,
  Image as ImageIcon,
  Settings2,
  Bot,
} from "lucide-react";
import {
  SiGoogle,
  SiYoutube,
} from "react-icons/si";

import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";
import {
  AI_API_VAULT_SERVICES,
  AI_PROVIDER_LABELS,
  AI_PROVIDER_ORDER,
  MULTIMEDIA_API_VAULT_SERVICES,
  getAiProviderModels,
  getDefaultModelForProvider,
  isAiProviderId,
  type ApiVaultServiceItem,
} from "@/lib/ai/provider-registry";

function ServiceCard({
  service,
  icon,
}: {
  service: ApiVaultServiceItem;
  icon: React.ReactNode;
}) {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    service.defaultModel || service.modelOptions?.[0]?.value || ""
  );

  useEffect(() => {
    const savedKey = localStorage.getItem(service.storageKey);
    if (savedKey) setApiKey(savedKey);

    if (service.modelStorageKey) {
      const savedModel = localStorage.getItem(service.modelStorageKey);
      if (savedModel) setSelectedModel(savedModel);
    }
  }, [service.storageKey, service.modelStorageKey]);

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem(service.storageKey, value);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    if (service.modelStorageKey) {
      localStorage.setItem(service.modelStorageKey, value);
    }
  };

  const handleTest = () => {
    if (!apiKey.trim()) {
      alert("키를 입력해주세요.");
      return;
    }

    alert(
      service.modelOptions
        ? `${service.name} 연결 설정이 저장되었습니다.\n선택 모델: ${selectedModel}`
        : `${service.name} 연결 설정이 저장되었습니다.`
    );
  };

  const handleClear = () => {
    if (!confirm(`${service.name} 설정을 삭제할까요?`)) return;

    setApiKey("");
    localStorage.removeItem(service.storageKey);

    if (service.modelStorageKey) {
      localStorage.removeItem(service.modelStorageKey);
      setSelectedModel(service.defaultModel || "");
    }
  };

  return (
    <div className="mb-3 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 shadow-lg transition-all duration-300 hover:border-blue-500/40">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 font-bold text-white">
          <div className="shrink-0 rounded-lg bg-slate-800 p-1.5">{icon}</div>
          <span className="truncate text-[15px] tracking-tight">
            {service.name}
          </span>
        </div>

        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tighter ${apiKey
            ? "border-green-900 bg-green-950/30 text-green-400"
            : "border-slate-600 bg-slate-700 text-white"
            }`}
        >
          {apiKey ? "Connected" : "Pending"}
        </span>
      </div>

      <div className="mb-3 rounded-lg border border-slate-700/30 bg-slate-800/50 p-2.5 font-medium">
        <p className="text-[11.5px] leading-snug text-white">{service.tip}</p>
      </div>

      <div className="space-y-3 text-white">
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-blue-500/10 to-slate-950 p-3 shadow-[0_0_22px_rgba(251,191,36,0.12)]">
          <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-amber-300">
            <Key size={13} />
            API Key 입력
          </label>

          <div className="group relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="여기에 나의 API Key를 입력하세요"
              className="w-full rounded-xl border-2 border-amber-400/50 bg-[#111827] px-4 py-3 pr-10 font-mono text-[13px] font-bold text-white placeholder:text-amber-100/70 outline-none transition-all focus:border-amber-300 focus:bg-black focus:ring-2 focus:ring-amber-400/30"
            />
            <Key
              className="absolute right-3 top-3.5 text-amber-300 group-focus-within:text-amber-200"
              size={15}
            />
          </div>

          <p className="mt-2 text-[10px] font-bold leading-4 text-amber-100/80">
            이 칸에 발급받은 API Key를 붙여넣으면 현재 브라우저 localStorage에 저장됩니다.
          </p>
        </div>

        {service.modelOptions && (
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-blue-400">
              기본 모델 선택
            </label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-black/60 px-3.5 py-2 text-[12px] font-bold text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {service.modelOptions.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2 text-[10px] font-black uppercase">
          <button
            type="button"
            onClick={handleTest}
            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-emerald-700 py-2 text-white shadow-lg transition-all hover:bg-emerald-600 active:scale-95"
          >
            저장 확인 🔄
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-md bg-slate-800 px-3 py-2 text-slate-300 transition-all hover:bg-red-950 hover:text-red-300"
          >
            삭제
          </button>

          <a
            href={service.link}
            target="_blank"
            rel="noreferrer"
            className="flex-[1.2] rounded-md bg-blue-600 px-1 py-2 text-center font-sans text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95"
          >
            API Key 발급 <ExternalLink className="ml-1 inline" size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function APIVaultPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [preferredProvider, setPreferredProvider] = useState("gemini_free");
  const [preferredModel, setPreferredModel] = useState(
    getDefaultModelForProvider("gemini_free")
  );

  const providerModelOptions = useMemo(
    () => getAiProviderModels(preferredProvider),
    [preferredProvider]
  );

  useEffect(() => {
    const savedProvider = localStorage.getItem("preferred_ai_provider");
    const savedModel = localStorage.getItem("preferred_ai_model");

    const nextProvider = isAiProviderId(savedProvider)
      ? savedProvider
      : "gemini_free";
    const normalizedSavedModel =
      savedModel === "gemini-3-flash-preview"
        ? getDefaultModelForProvider("gemini_free")
        : savedModel;
    const nextModel =
      normalizedSavedModel || getDefaultModelForProvider(nextProvider);

    setPreferredProvider(nextProvider);
    setPreferredModel(nextModel);

    localStorage.setItem("preferred_ai_provider", nextProvider);
    localStorage.setItem("preferred_ai_model", nextModel);
  }, []);

  const handlePreferredProviderChange = (provider: string) => {
    const nextProvider = isAiProviderId(provider) ? provider : "gemini_free";
    const nextModel = getDefaultModelForProvider(nextProvider);

    setPreferredProvider(nextProvider);
    setPreferredModel(nextModel);

    localStorage.setItem("preferred_ai_provider", nextProvider);
    localStorage.setItem("preferred_ai_model", nextModel);
  };

  const handlePreferredModelChange = (model: string) => {
    setPreferredModel(model);
    localStorage.setItem("preferred_ai_model", model);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#06080d] text-zinc-100">
      <Sidebar
        activeMenu="APIVault"
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <StudioTopbar setIsMobileOpen={setIsMobileOpen} />

        <div className="flex min-h-0 min-w-0 flex-1">
          <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
            <div className="mx-auto max-w-[1400px] p-6 pb-20 lg:px-12 lg:py-8">
              <header className="mb-8 border-b border-slate-800/80 pb-6">
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <h1 className="flex items-center gap-2 text-3xl font-black uppercase italic tracking-tighter text-white">
                      🔐 Creaibox{" "}
                      <span className="text-blue-500 not-italic">
                        API Vault
                      </span>
                    </h1>

                    <div className="mt-2 space-y-1">
                      <p className="text-base font-bold italic text-slate-200 underline decoration-blue-500/50 underline-offset-4">
                        Your Secure Key Treasury — 개인 AI 연결 설정
                      </p>
                      <p className="text-[12px] font-black uppercase tracking-wider text-blue-400">
                        개인 API Key와 기본 Provider / Model을 저장하는 공간입니다.
                      </p>

                      <div className="mt-2 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                        <p className="text-[13px] font-semibold leading-relaxed text-slate-100">
                          API Key는 모델별이 아니라 플랫폼/과금계정별로 발급받습니다.
                          Gemini, Groq, OpenAI, Claude 키를 각각 저장하고 기본 AI 생성 엔진을 선택할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex max-w-md items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-600/10 p-4 shadow-[0_0_25px_rgba(37,99,235,0.15)] backdrop-blur-xl">
                    <ShieldCheck className="mt-0.5 h-6 w-6 text-blue-500" />
                    <div className="text-[12px] leading-tight">
                      <p className="mb-0.5 text-xs font-black uppercase tracking-tight text-white">
                        사용자 프라이버시 보호
                      </p>
                      <p className="font-medium tracking-tight text-slate-200">
                        현재 개인 키는 사용자의 로컬 브라우저에 저장됩니다. 추후 서버 암호화 저장 방식으로 확장할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              <section className="mb-8 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
                <div className="mb-4 flex items-center gap-2 text-lg font-black uppercase italic text-white">
                  <Settings2 className="text-blue-400" size={20} />
                  기본 AI 생성 설정
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-blue-300">
                      기본 Provider
                    </label>
                    <select
                      value={preferredProvider}
                      onChange={(e) =>
                        handlePreferredProviderChange(e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-800 bg-black/60 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
                    >
                      {AI_PROVIDER_ORDER.map((provider) => (
                        <option key={provider} value={provider}>
                          {AI_PROVIDER_LABELS[provider]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-blue-300">
                      기본 Model
                    </label>
                    <select
                      value={preferredModel}
                      onChange={(e) => handlePreferredModelChange(e.target.value)}
                      className="w-full rounded-2xl border border-slate-800 bg-black/60 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
                    >
                      {providerModelOptions.map((model) => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="mt-3 text-xs font-bold leading-5 text-slate-400">
                  AI 생성 화면에서 Provider / Model을 직접 선택하지 않으면 이 값이 기본 선택값으로 사용됩니다.
                </p>
              </section>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <section>
                  <div className="mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3 text-base font-black uppercase tracking-widest text-white">
                    <Zap className="text-blue-500" size={18} /> AI API Key
                  </div>

                  {AI_API_VAULT_SERVICES.map((s) => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      icon={
                        s.id.includes("gemini") ? (
                          <SiGoogle size={18} className="text-blue-400" />
                        ) : s.id === "groq" ? (
                          <Zap size={18} className="text-orange-400" />
                        ) : s.id === "openai" ? (
                          <Bot size={18} className="text-emerald-400" />
                        ) : (
                          <MessageSquare size={18} className="text-amber-400" />
                        )
                      }
                    />
                  ))}
                </section>

                <section>
                  <div className="mb-4 flex items-center gap-2 border-l-4 border-purple-500 pl-3 text-base font-black uppercase tracking-widest text-white">
                    <Video className="text-purple-500" size={18} /> SEARCH & MULTIMEDIA API Key
                  </div>

                  {MULTIMEDIA_API_VAULT_SERVICES.map((s) => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      icon={
                        s.id === "google_search" ? (
                          <SiGoogle size={18} className="text-blue-400" />
                        ) : s.id.includes("search") ? (
                          <Search size={18} className="text-blue-400" />
                        ) : s.id === "youtube" ? (
                          <SiYoutube size={20} className="text-red-500" />
                        ) : s.id === "voice" ? (
                          <Mic size={18} className="text-indigo-400" />
                        ) : (
                          <ImageIcon size={18} className="text-purple-400" />
                        )
                      }
                    />
                  ))}
                </section>
              </div>
            </div>
          </main>

          <div className="hidden shrink-0 xl:flex">
            <Aside />
          </div>
        </div>
      </div>
    </div>
  );
}
