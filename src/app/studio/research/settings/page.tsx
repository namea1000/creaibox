"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Database,
  Image as ImageIcon,
  KeyRound,
  Bot,
  FileText,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const apiItems = [
  {
    name: "Gemini Postpay",
    key: "gemini_postpay_api_key",
    modelKey: "gemini_postpay_model",
  },
  {
    name: "Gemini Free Tier",
    key: "gemini_free_api_key",
    modelKey: "gemini_free_model",
  },
  {
    name: "OpenAI",
    key: "openai_api_key",
    modelKey: "openai_model",
  },
  {
    name: "Claude",
    key: "claude_api_key",
    modelKey: "claude_model",
  },
  {
    name: "YouTube Data API",
    key: "youtube_api_key",
  },
  {
    name: "Google Search API",
    key: "google_search_api_key",
  },
  {
    name: "Naver Search API",
    key: "naver_search_api_key",
  },
];

const extractSettings = [
  "PDF 텍스트 추출",
  "DOCX 텍스트 추출",
  "PPTX 텍스트 추출",
  "Excel / CSV 분석",
  "이미지 OCR",
  "YouTube 자막 추출",
  "웹페이지 본문 추출",
];

export default function ResearchSettingsPage() {
  const [apiStatus, setApiStatus] = useState<
    Record<string, { connected: boolean; model?: string }>
  >({});

  const [preferredProvider, setPreferredProvider] = useState("");
  const [preferredModel, setPreferredModel] = useState("");

  useEffect(() => {
    const status: Record<string, { connected: boolean; model?: string }> = {};

    apiItems.forEach((item) => {
      const savedKey = localStorage.getItem(item.key);
      const savedModel = item.modelKey
        ? localStorage.getItem(item.modelKey)
        : "";

      status[item.key] = {
        connected: !!savedKey,
        model: savedModel || "",
      };
    });

    setApiStatus(status);
    setPreferredProvider(localStorage.getItem("preferred_ai_provider") || "");
    setPreferredModel(localStorage.getItem("preferred_ai_model") || "");
  }, []);

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#12091f] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
              <Settings size={15} />
              Research Settings
            </div>

            <h1 className="text-3xl font-black md:text-5xl">설정</h1>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
              자료 분석 스튜디오의 AI 모델, OCR, 이미지 저장, WebP 변환,
              Supabase Storage 설정을 관리합니다. API Key는 API Vault에 저장된 값을 사용합니다.
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center gap-3">
              <Bot className="text-violet-400" size={20} />
              <h2 className="text-lg font-black">API Vault 연결 상태</h2>
            </div>

            <div className="mt-5 space-y-3">
              {apiItems.map((item) => {
                const status = apiStatus[item.key];

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-300">
                        {item.name}
                      </p>

                      {status?.model && (
                        <p className="mt-1 text-xs text-zinc-500">
                          모델: {status.model}
                        </p>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black ${status?.connected
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-700 bg-zinc-900 text-zinc-500"
                        }`}
                    >
                      {status?.connected ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <AlertCircle size={13} />
                      )}
                      {status?.connected ? "Connected" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center gap-3">
              <KeyRound className="text-blue-400" size={20} />
              <h2 className="text-lg font-black">기본 AI 생성 설정</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-xs font-bold text-zinc-500">
                  기본 Provider
                </p>
                <p className="mt-2 text-sm font-black text-zinc-200">
                  {preferredProvider || "API Vault에서 설정 필요"}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-xs font-bold text-zinc-500">
                  기본 Model
                </p>
                <p className="mt-2 text-sm font-black text-zinc-200">
                  {preferredModel || "API Vault에서 설정 필요"}
                </p>
              </div>

              <p className="text-xs leading-5 text-zinc-500">
                API Key와 기본 모델은 API Vault 페이지에서 관리하고,
                자료 분석 스튜디오는 해당 값을 불러와 사용합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black">추출 기능 설정</h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {extractSettings.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                >
                  <span className="text-sm font-bold text-zinc-300">
                    {item}
                  </span>

                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-pink-400" size={20} />
              <h2 className="text-lg font-black">이미지 저장 설정</h2>
            </div>

            <div className="mt-5 space-y-4">
              <SettingInput label="Storage Bucket" value="research-assets" />
              <SettingInput label="저장 확장자" value="webp" />
              <SettingInput label="WebP 품질" value="80" />
              <SettingInput label="최대 가로폭(px)" value="1600" />
              <SettingInput label="목표 용량" value="1MB 이하" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="flex items-center gap-3">
            <Database className="text-violet-400" size={20} />
            <h2 className="text-lg font-black">DB / Storage 구조</h2>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <h3 className="font-black">현재 MVP 테이블</h3>

              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <p>research_projects</p>
                <p>research_sources</p>
                <p>research_extractions</p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <h3 className="font-black">Storage Path</h3>

              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <p>research-assets/</p>
                <p>└ user_id/</p>
                <p>　└ project_id/</p>
                <p>　　└ source_id/</p>
                <p>　　　└ images/</p>
                <p>　　　　001-og-image-hash.webp</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              보안 안내
            </h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            현재 API Key는 API Vault에서 localStorage로 관리합니다. 클라이언트에서 직접 AI API를 호출하면 키가 노출될 수 있으므로,
            실제 AI 생성 기능은 서버 API 라우트를 통해 호출하는 구조로 확장하는 것이 좋습니다.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-400" size={20} />
            <h2 className="text-lg font-black">다음 개발 단계</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            다음에는 create/page.tsx에서 저장된 자료를 실제로 추출하고,
            API Vault의 기본 Provider / Model 설정을 AI 요약·분석 기능에 연결하면 됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}

function SettingInput({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="mt-2 h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-zinc-300 outline-none"
      />
    </div>
  );
}