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
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";

type ModelOption = {
  value: string;
  label: string;
};

type ServiceItem = {
  id: string;
  storageKey: string;
  modelStorageKey?: string;
  name: string;
  provider: string;
  tip: string;
  link: string;
  modelOptions?: ModelOption[];
  defaultModel?: string;
};

const geminiModels: ModelOption[] = [
  {
    value: "gemini-3-flash-preview",
    label:
      "gemini-3-flash-preview ⚡ 최신 Preview · 최고 성능 · 이미지/텍스트/영상 멀티모달 · 차세대 AI 기능 우선 지원",
  },
  {
    value: "gemini-2.5-flash",
    label:
      "gemini-2.5-flash 🚀 안정적인 실전용 · 빠른 응답속도 · 블로그/자동화/대량생성 추천",
  },
  {
    value: "gemini-2.0-flash",
    label:
      "gemini-2.0-flash 📚 범용 작업 최적화 · 문서작성 · 요약 · SEO 콘텐츠 생성에 적합",
  },
  {
    value: "gemini-1.5-flash",
    label:
      "gemini-1.5-flash 💰 저사양·저비용 운영용 · 간단한 생성 작업 및 백업 모델",
  },
];

const openaiModels: ModelOption[] = [
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
  { value: "gpt-4.1", label: "gpt-4.1" },
];

const claudeModels: ModelOption[] = [
  { value: "claude-3-5-haiku-latest", label: "claude-3-5-haiku-latest" },
  { value: "claude-3-5-sonnet-latest", label: "claude-3-5-sonnet-latest" },
];

const leftHub: ServiceItem[] = [
  {
    id: "gemini_postpay",
    storageKey: "gemini_postpay_api_key",
    modelStorageKey: "gemini_postpay_model",
    provider: "gemini",
    name: "1. Google Gemini API - Tier 1 · Postpay(Billing Account)",
    defaultModel: "gemini-3-flash-preview",
    modelOptions: geminiModels,
    tip:
      "💡 유료 Billing Account가 연결된 Gemini API Key입니다. 안정적인 사용량, 높은 한도, 상용 서비스용 AI 생성에 적합합니다.",
    link: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "gemini_free",
    storageKey: "gemini_free_api_key",
    modelStorageKey: "gemini_free_model",
    provider: "gemini",
    name: "2. Google Gemini API - Free Tier",
    defaultModel: "gemini-3-flash-preview",
    modelOptions: geminiModels,
    tip:
      "💡 무료 체험용 Gemini API Key입니다. 테스트, 개인 사용, 초기 개발용으로 활용하고 사용량 제한이 있을 수 있습니다.",
    link: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "openai",
    storageKey: "openai_api_key",
    modelStorageKey: "openai_model",
    provider: "openai",
    name: "3. OpenAI / ChatGPT API",
    defaultModel: "gpt-4o-mini",
    modelOptions: openaiModels,
    tip:
      "💡 논리 추론, 코드 생성, 구조화된 글쓰기 작업에 적합합니다. API Key는 플랫폼 단위이고, 모델은 생성할 때 선택합니다.",
    link: "https://platform.openai.com/api-keys",
  },
  {
    id: "claude",
    storageKey: "claude_api_key",
    modelStorageKey: "claude_model",
    provider: "claude",
    name: "4. Anthropic Claude API",
    defaultModel: "claude-3-5-haiku-latest",
    modelOptions: claudeModels,
    tip:
      "💡 긴 문맥 유지와 자연스러운 문체에 강합니다. 장문 블로그, 원고 재작성, 분석형 콘텐츠에 적합합니다.",
    link: "https://console.anthropic.com/",
  },
];

const rightHub: ServiceItem[] = [
  {
    id: "google_search",
    storageKey: "google_search_api_key",
    provider: "google_search",
    name: "Google Search API",
    tip:
      "💡 글로벌 실시간 정보 탐색용입니다. 최신 자료 조사, 팩트체크, 트렌드 분석에 사용합니다.",
    link: "https://programmablesearchengine.google.com/",
  },
  {
    id: "naver_search",
    storageKey: "naver_search_api_key",
    provider: "naver_search",
    name: "Naver Search API",
    tip:
      "💡 국내 트렌드, 뉴스, 블로그, 카페 데이터를 활용하는 기능에 사용합니다.",
    link: "https://developers.naver.com/apps/#/register",
  },
  {
    id: "youtube",
    storageKey: "youtube_api_key",
    provider: "youtube",
    name: "YouTube Data API v3",
    tip:
      "💡 유튜브 채널 통계, 영상 데이터, 댓글 분석, 업로드 자동화에 활용할 수 있습니다.",
    link: "https://console.cloud.google.com/",
  },
  {
    id: "design",
    storageKey: "design_api_key",
    provider: "assets",
    name: "Unsplash / Pexels Assets",
    tip:
      "💡 고화질 이미지와 영상 리소스를 불러와 콘텐츠 제작 품질을 높이는 데 사용합니다.",
    link: "https://unsplash.com/developers",
  },
  {
    id: "voice",
    storageKey: "voice_api_key",
    provider: "voice",
    name: "ElevenLabs Voice API",
    tip:
      "💡 AI 보이스, 나레이션, 더빙, 음성 브랜딩 기능에 사용할 수 있습니다.",
    link: "https://elevenlabs.io/",
  },
];

function ServiceCard({
  service,
  icon,
}: {
  service: ServiceItem;
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
            이 칸에 발급받은 API Key를 붙여넣으면 브라우저에 저장됩니다.
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
    "gemini-3-flash-preview"
  );

  const providerModelOptions = useMemo(() => {
    if (preferredProvider === "openai") return openaiModels;
    if (preferredProvider === "claude") return claudeModels;
    return geminiModels;
  }, [preferredProvider]);

  useEffect(() => {
    const savedProvider = localStorage.getItem("preferred_ai_provider");
    const savedModel = localStorage.getItem("preferred_ai_model");

    if (savedProvider) setPreferredProvider(savedProvider);
    if (savedModel) setPreferredModel(savedModel);
  }, []);

  const handlePreferredProviderChange = (provider: string) => {
    const models =
      provider === "openai"
        ? openaiModels
        : provider === "claude"
          ? claudeModels
          : geminiModels;

    const nextModel = models[0]?.value || "";

    setPreferredProvider(provider);
    setPreferredModel(nextModel);

    localStorage.setItem("preferred_ai_provider", provider);
    localStorage.setItem("preferred_ai_model", nextModel);
  };

  const handlePreferredModelChange = (model: string) => {
    setPreferredModel(model);
    localStorage.setItem("preferred_ai_model", model);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-zinc-100">
      <StudioTopbar setIsMobileOpen={setIsMobileOpen} />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar
          activeMenu="APIVault"
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <main className="custom-scrollbar flex-1 overflow-y-auto transition-all duration-300">
          <div className="mx-auto max-w-[1400px] p-6 pb-32 lg:p-12">
            <header className="mb-8 border-b border-slate-800/80 pb-6">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <h1 className="flex items-center gap-2 text-3xl font-black uppercase italic tracking-tighter text-white">
                    🔐 Creaibox{" "}
                    <span className="text-blue-500 not-italic">API Vault</span>
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
                        API Key는 모델별로 발급받는 것이 아니라 플랫폼/과금계정별로 발급받습니다.
                        Gemini는 Free Tier와 Postpay Billing Key를 분리해 저장할 수 있습니다.
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
                    <option value="gemini_postpay">
                      1. Gemini Tier 1 · Postpay(Billing Account)
                    </option>
                    <option value="gemini_free">2. Gemini Free Tier</option>
                    <option value="openai">3. OpenAI / ChatGPT</option>
                    <option value="claude">4. Claude</option>
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
                나중에 AI 생성 화면에서 사용자가 Provider / Model을 직접 선택할 수 있게 만들 때,
                이 값이 기본 선택값으로 사용됩니다.
              </p>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section>
                <div className="mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3 text-base font-black uppercase tracking-widest text-white">
                  <Zap className="text-blue-500" size={18} /> AI API Key
                </div>
                {leftHub.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    icon={
                      <MessageSquare size={18} className="text-amber-400" />
                    }
                  />
                ))}
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2 border-l-4 border-purple-500 pl-3 text-base font-black uppercase tracking-widest text-white">
                  <Video className="text-purple-500" size={18} /> SEARCH & MULTIMEDIA API Key
                </div>
                {rightHub.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    icon={
                      s.id.includes("search") ? (
                        <Search size={18} className="text-blue-400" />
                      ) : s.id === "youtube" ? (
                        <div className="font-sans text-xs font-black tracking-tighter text-red-600">
                          YT
                        </div>
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

            <footer className="mt-12 pb-8 text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">
              Creaibox.com — AI Contents Studio
            </footer>
          </div>
        </main>

        <div className="hidden shrink-0 xl:flex">
          <Aside />
        </div>
      </div>
    </div>
  );
}