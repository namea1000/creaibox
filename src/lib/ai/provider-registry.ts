export type AiProviderId = "gemini_postpay" | "gemini_free" | "groq" | "openai" | "claude";

export type AiProviderPlatform = "gemini" | "groq" | "openai" | "claude";

export type ModelOption = {
  value: string;
  label: string;
};

export type ApiVaultServiceItem = {
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

export const GEMINI_MODELS: ModelOption[] = [
  {
    value: "gemini-3.1-flash-lite",
    label: "gemini-3.1-flash-lite 🟢 최신 Lite · 저비용 · 빠른 생성 · 대량 작업 추천",
  },
  {
    value: "gemini-3-flash-preview",
    label: "gemini-3-flash-preview ⚡ 최신 Preview · 고속 생성 · 검색 및 그라운딩 최적화",
  },
  {
    value: "gemini-2.5-flash",
    label: "gemini-2.5-flash 🚀 안정적인 실전용 · 블로그/자동화/대량생성 추천",
  },
];

export const GROQ_MODELS: ModelOption[] = [
  {
    value: "llama-3.1-8b-instant",
    label: "llama-3.1-8b-instant ⚡ Production · 가장 빠름 · 짧은 글/요약/제목 추천",
  },
  {
    value: "llama-3.3-70b-versatile",
    label: "llama-3.3-70b-versatile 🧠 Production · 고품질 텍스트 · 글쓰기/가사 추천",
  },
  {
    value: "openai/gpt-oss-20b",
    label: "openai/gpt-oss-20b ⚡ Production · 빠른 오픈 모델 · 일반 생성 추천",
  },
  {
    value: "openai/gpt-oss-120b",
    label: "openai/gpt-oss-120b 🧠 Production · 고성능 오픈 모델 · 고품질 생성 추천",
  },
  {
    value: "groq/compound-mini",
    label: "groq/compound-mini 🔎 Production System · 빠른 에이전트/검색형 작업",
  },
  {
    value: "groq/compound",
    label: "groq/compound 🔎 Production System · 도구 기반 고품질 응답",
  },
  {
    value: "qwen/qwen3-32b",
    label: "qwen/qwen3-32b 🧩 Preview · 구조화/분석/다국어 작업",
  },
  {
    value: "meta-llama/llama-4-scout-17b-16e-instruct",
    label: "llama-4-scout-17b ⚠️ Preview · 실험/일반 생성",
  },
];

export const OPENAI_MODELS: ModelOption[] = [
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
  { value: "gpt-4.1", label: "gpt-4.1" },
];

export const CLAUDE_MODELS: ModelOption[] = [
  { value: "claude-3-5-haiku-latest", label: "claude-3-5-haiku-latest" },
  { value: "claude-3-5-sonnet-latest", label: "claude-3-5-sonnet-latest" },
];

export const AI_PROVIDER_MODEL_OPTIONS: Record<AiProviderId, ModelOption[]> = {
  gemini_postpay: GEMINI_MODELS,
  gemini_free: GEMINI_MODELS,
  groq: GROQ_MODELS,
  openai: OPENAI_MODELS,
  claude: CLAUDE_MODELS,
};

export const AI_PROVIDER_DEFAULT_MODEL: Record<AiProviderId, string> = {
  gemini_postpay: "gemini-3.1-flash-lite",
  gemini_free: "gemini-3.1-flash-lite",
  groq: "llama-3.1-8b-instant",
  openai: "gpt-4o-mini",
  claude: "claude-3-5-haiku-latest",
};

export const AI_PROVIDER_STORAGE: Record<
  AiProviderId,
  {
    apiKey: string;
    model: string;
    platform: AiProviderPlatform;
  }
> = {
  gemini_postpay: {
    apiKey: "gemini_postpay_api_key",
    model: "gemini_postpay_model",
    platform: "gemini",
  },
  gemini_free: {
    apiKey: "gemini_free_api_key",
    model: "gemini_free_model",
    platform: "gemini",
  },
  groq: {
    apiKey: "groq_api_key",
    model: "groq_model",
    platform: "groq",
  },
  openai: {
    apiKey: "openai_api_key",
    model: "openai_model",
    platform: "openai",
  },
  claude: {
    apiKey: "claude_api_key",
    model: "claude_model",
    platform: "claude",
  },
};

export const AI_PROVIDER_LABELS: Record<AiProviderId, string> = {
  gemini_postpay: "1. Gemini Tier 1 · Postpay(Billing Account)",
  gemini_free: "2. Gemini Free Tier",
  openai: "3. OpenAI / ChatGPT",
  claude: "4. Claude",
  groq: "5. Groq Fast AI",
};

export const AI_PROVIDER_ORDER: AiProviderId[] = [
  "gemini_postpay",
  "gemini_free",
  "openai",
  "claude",
  "groq",
];

export const AI_API_VAULT_SERVICES: ApiVaultServiceItem[] = [
  {
    id: "gemini_postpay",
    storageKey: AI_PROVIDER_STORAGE.gemini_postpay.apiKey,
    modelStorageKey: AI_PROVIDER_STORAGE.gemini_postpay.model,
    provider: "gemini",
    name: "1. Google Gemini API - Tier 1 · Postpay(Billing Account)",
    defaultModel: AI_PROVIDER_DEFAULT_MODEL.gemini_postpay,
    modelOptions: GEMINI_MODELS,
    tip: "💡 선불충전 유료 Billing Account가 연결된 Gemini API Key입니다. 안정적인 사용량, 높은 한도, 상용 서비스용 AI 생성에 적합합니다. Google Search 기반 최신 정보 반영은 이 Tier 1 키에서만 자동 사용됩니다.",
    link: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "gemini_free",
    storageKey: AI_PROVIDER_STORAGE.gemini_free.apiKey,
    modelStorageKey: AI_PROVIDER_STORAGE.gemini_free.model,
    provider: "gemini",
    name: "2. Google Gemini API - Free Tier",
    defaultModel: AI_PROVIDER_DEFAULT_MODEL.gemini_free,
    modelOptions: GEMINI_MODELS,
    tip: "💡 무료 체험용 Gemini API Key입니다. 테스트, 개인 사용, 초기 개발용으로 활용하고 사용량 제한이 있을 수 있습니다. Google Search 기반 최신 정보 반영은 지원되지 않습니다.",
    link: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "openai",
    storageKey: AI_PROVIDER_STORAGE.openai.apiKey,
    modelStorageKey: AI_PROVIDER_STORAGE.openai.model,
    provider: "openai",
    name: "3. OpenAI / ChatGPT API",
    defaultModel: AI_PROVIDER_DEFAULT_MODEL.openai,
    modelOptions: OPENAI_MODELS,
    tip: "💡 논리 추론, 코드 생성, 구조화된 글쓰기 작업에 적합합니다. API Key는 플랫폼 단위이고, 모델은 생성할 때 선택합니다.",
    link: "https://platform.openai.com/api-keys",
  },
  {
    id: "claude",
    storageKey: AI_PROVIDER_STORAGE.claude.apiKey,
    modelStorageKey: AI_PROVIDER_STORAGE.claude.model,
    provider: "claude",
    name: "4. Anthropic Claude API",
    defaultModel: AI_PROVIDER_DEFAULT_MODEL.claude,
    modelOptions: CLAUDE_MODELS,
    tip: "💡 긴 문맥 유지와 자연스러운 문체에 강합니다. 장문 블로그, 원고 재작성, 분석형 콘텐츠에 적합합니다.",
    link: "https://console.anthropic.com/",
  },
  {
    id: "groq",
    storageKey: AI_PROVIDER_STORAGE.groq.apiKey,
    modelStorageKey: AI_PROVIDER_STORAGE.groq.model,
    provider: "groq",
    name: "5. Groq API - Fast AI Generation",
    defaultModel: AI_PROVIDER_DEFAULT_MODEL.groq,
    modelOptions: GROQ_MODELS,
    tip: "💡 매우 빠른 텍스트 생성용 API입니다. AI Assistant, 제목 생성, 요약, 가사, Suno 프롬프트, 짧은 글 생성에 적합합니다. 사용자가 본인 Groq Key를 입력해서 사용할 수 있습니다.",
    link: "https://console.groq.com/keys",
  },
];

export const MULTIMEDIA_API_VAULT_SERVICES: ApiVaultServiceItem[] = [
  {
    id: "google_search",
    storageKey: "google_search_api_key",
    provider: "google_search",
    name: "Google Search API",
    tip: "💡 글로벌 실시간 정보 탐색용입니다. 최신 자료 조사, 팩트체크, 트렌드 분석에 사용합니다.",
    link: "https://programmablesearchengine.google.com/",
  },
  {
    id: "naver_search",
    storageKey: "naver_search_api_key",
    provider: "naver_search",
    name: "Naver Search API",
    tip: "💡 국내 트렌드, 뉴스, 블로그, 카페 데이터를 활용하는 기능에 사용합니다.",
    link: "https://developers.naver.com/apps/#/register",
  },
  {
    id: "youtube",
    storageKey: "youtube_api_key",
    provider: "youtube",
    name: "YouTube Data API v3",
    tip: "💡 유튜브 채널 통계, 영상 데이터, 댓글 분석, 업로드 자동화에 활용할 수 있습니다.",
    link: "https://console.cloud.google.com/",
  },
  {
    id: "design",
    storageKey: "design_api_key",
    provider: "assets",
    name: "Unsplash / Pexels Assets",
    tip: "💡 고화질 이미지와 영상 리소스를 불러와 콘텐츠 제작 품질을 높이는 데 사용합니다.",
    link: "https://unsplash.com/developers",
  },
  {
    id: "voice",
    storageKey: "voice_api_key",
    provider: "voice",
    name: "ElevenLabs Voice API",
    tip: "💡 AI 보이스, 나레이션, 더빙, 음성 브랜딩 기능에 사용할 수 있습니다.",
    link: "https://elevenlabs.io/",
  },
];

export function isAiProviderId(value: string | null | undefined): value is AiProviderId {
  return Boolean(value && value in AI_PROVIDER_STORAGE);
}

export function getAiProviderModels(provider: string | null | undefined) {
  return isAiProviderId(provider)
    ? AI_PROVIDER_MODEL_OPTIONS[provider]
    : AI_PROVIDER_MODEL_OPTIONS.gemini_free;
}

export function getDefaultModelForProvider(provider: string | null | undefined) {
  return isAiProviderId(provider)
    ? AI_PROVIDER_DEFAULT_MODEL[provider]
    : AI_PROVIDER_DEFAULT_MODEL.gemini_free;
}

export function getProviderStorage(provider: AiProviderId) {
  return AI_PROVIDER_STORAGE[provider];
}
