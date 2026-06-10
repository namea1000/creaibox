"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Library,
  Image as ImageIcon,
  Film,
  Music,
  Download,
  ExternalLink,
  Sparkles,
  Plus,
  Filter,
  Grid2X2,
  List,
  Crown,
  Globe2,
  Video,
} from "lucide-react";

type StockCategory = "all" | "image" | "video" | "audio";
type StockProvider = "all" | "unsplash" | "pexels" | "pixabay" | "mixkit" | "videvo";

type StockItem = {
  id: string;
  title: string;
  type: "image" | "video" | "audio";
  provider: Exclude<StockProvider, "all">;
  license: string;
  keyword: string;
  premium?: boolean;
  desc: string;
};

const stockProviders: {
  id: StockProvider;
  label: string;
  desc: string;
  url?: string;
}[] = [
    { id: "all", label: "All", desc: "전체" },
    { id: "unsplash", label: "Unsplash", desc: "이미지 중심", url: "https://unsplash.com" },
    { id: "pexels", label: "Pexels", desc: "이미지/영상", url: "https://www.pexels.com" },
    { id: "pixabay", label: "Pixabay", desc: "이미지/영상/음원", url: "https://pixabay.com" },
    { id: "mixkit", label: "Mixkit", desc: "영상/BGM/SFX", url: "https://mixkit.co" },
    { id: "videvo", label: "Videvo", desc: "영상 소스", url: "https://www.videvo.net" },
  ];

const stockItems: StockItem[] = [
  {
    id: "stock-1",
    title: "Cinematic City B-roll",
    type: "video",
    provider: "pexels",
    license: "Free Stock Video",
    keyword: "city night cinematic",
    desc: "도시 야경, 브이로그, 인트로용 B-roll",
  },
  {
    id: "stock-2",
    title: "Nature Background Image",
    type: "image",
    provider: "unsplash",
    license: "Free Image",
    keyword: "nature background landscape",
    desc: "썸네일, 배경 이미지, 블로그 커버용",
  },
  {
    id: "stock-3",
    title: "Soft Ambient Music",
    type: "audio",
    provider: "pixabay",
    license: "Royalty Free Audio",
    keyword: "ambient calm background music",
    desc: "잔잔한 배경음악, 소개 영상용",
  },
  {
    id: "stock-4",
    title: "Light Leak Overlay",
    type: "video",
    provider: "mixkit",
    license: "Free Video Asset",
    keyword: "light leak overlay cinematic",
    desc: "글로우, 빛 번짐, 전환효과 오버레이",
  },
  {
    id: "stock-5",
    title: "Tech Workspace",
    type: "image",
    provider: "pexels",
    license: "Free Image",
    keyword: "tech workspace laptop ai",
    desc: "AI, SaaS, 개발 콘텐츠 썸네일",
  },
  {
    id: "stock-6",
    title: "Drone Landscape Shot",
    type: "video",
    provider: "videvo",
    license: "Check Provider License",
    keyword: "drone landscape aerial",
    desc: "여행, 다큐, 풍경 영상용",
    premium: true,
  },
  {
    id: "stock-7",
    title: "Click UI Sound",
    type: "audio",
    provider: "mixkit",
    license: "Free Sound Effect",
    keyword: "ui click sound effect",
    desc: "버튼 클릭, 앱 소개 영상 효과음",
  },
  {
    id: "stock-8",
    title: "Business Meeting",
    type: "video",
    provider: "pixabay",
    license: "Royalty Free Video",
    keyword: "business meeting office",
    desc: "기업 소개, 강의, 프레젠테이션 B-roll",
  },
];

export default function VideoEditorStockPanel() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<StockCategory>("all");
  const [provider, setProvider] = useState<StockProvider>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return stockItems.filter((item) => {
      const matchSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.keyword.toLowerCase().includes(keyword) ||
        item.desc.toLowerCase().includes(keyword);

      const matchCategory = category === "all" || item.type === category;
      const matchProvider = provider === "all" || item.provider === provider;

      return matchSearch && matchCategory && matchProvider;
    });
  }, [search, category, provider]);

  const selectedProvider = stockProviders.find((item) => item.id === provider);

  return (
    <div className="space-y-4">
      <PanelHeader
        icon={Library}
        title="Stock Media"
        desc="Unsplash, Pexels, Pixabay, Mixkit, Videvo 연결을 위한 스톡 미디어 허브입니다."
      />

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div className="flex items-start gap-3">
          <Globe2 className="mt-1 shrink-0 text-cyan-200" size={20} />
          <div>
            <div className="text-sm font-black text-cyan-100">
              Stock API 연결 준비 완료 구조
            </div>
            <p className="mt-1 text-xs leading-5 text-cyan-100/70">
              현재는 샘플 소스와 외부 검색 허브입니다. 나중에 API Vault의
              Pexels/Unsplash/Pixabay 키와 연결하면 검색 결과를 바로 불러올 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
          <Search size={15} className="text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="예: cinematic city, nature, bgm, light leak"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <FilterButton label="All" active={category === "all"} onClick={() => setCategory("all")} />
          <FilterButton label="Image" active={category === "image"} onClick={() => setCategory("image")} />
          <FilterButton label="Video" active={category === "video"} onClick={() => setCategory("video")} />
          <FilterButton label="Audio" active={category === "audio"} onClick={() => setCategory("audio")} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stockProviders.map((item) => {
          const active = provider === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setProvider(item.id)}
              className={`rounded-xl border p-3 text-left transition ${active
                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                  : "border-white/10 bg-black/30 text-zinc-400 hover:border-cyan-400/40"
                }`}
            >
              <div className="text-xs font-black">{item.label}</div>
              <div className="mt-1 text-[10px] leading-4 text-zinc-500">
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-2">
        <div className="flex items-center gap-2 px-2 text-xs font-bold text-zinc-500">
          <Filter size={14} />
          {filteredItems.length} resources
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-2 ${viewMode === "grid"
                ? "bg-cyan-400/20 text-cyan-200"
                : "text-zinc-500 hover:text-cyan-200"
              }`}
          >
            <Grid2X2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-lg p-2 ${viewMode === "list"
                ? "bg-cyan-400/20 text-cyan-200"
                : "text-zinc-500 hover:text-cyan-200"
              }`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {selectedProvider?.url && (
        <a
          href={buildProviderSearchUrl(selectedProvider.id, search)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        >
          <span>{selectedProvider.label}에서 검색 열기</span>
          <ExternalLink size={15} />
        </a>
      )}

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <StockGridCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <StockListCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
        다음 연결 단계: API Vault에 Unsplash/Pexels/Pixabay 키 저장 → 검색 API 호출 →
        결과 URL을 MediaItem으로 변환 → 타임라인에 추가.
      </div>
    </div>
  );
}

function StockGridCard({ item }: { item: StockItem }) {
  const Icon = getStockIcon(item.type);

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-black/30 transition hover:border-cyan-400/50">
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-cyan-950">
        <Icon size={28} className="text-cyan-200" />

        {item.premium && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-black text-black">
            <Crown size={11} />
            PRO
          </div>
        )}

        <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-black uppercase text-white/70">
          {item.provider}
        </div>
      </div>

      <div className="p-3">
        <div className="truncate text-xs font-black text-white">
          {item.title}
        </div>
        <div className="mt-1 line-clamp-2 text-[10px] leading-4 text-zinc-500">
          {item.desc}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] text-zinc-600">
            {item.license}
          </span>

          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
            title="나중에 Media Library로 가져오기"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StockListCard({ item }: { item: StockItem }) {
  const Icon = getStockIcon(item.type);

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3 hover:border-cyan-400/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-black text-white">
              {item.title}
            </div>
            {item.premium && <Crown size={13} className="shrink-0 text-amber-300" />}
          </div>

          <div className="mt-1 text-xs text-zinc-500">
            {item.provider} · {item.license}
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );
}

function getStockIcon(type: StockItem["type"]) {
  if (type === "video") return Film;
  if (type === "audio") return Music;
  return ImageIcon;
}

function buildProviderSearchUrl(provider: StockProvider, search: string) {
  const q = encodeURIComponent(search || "cinematic background");

  if (provider === "unsplash") return `https://unsplash.com/s/photos/${q}`;
  if (provider === "pexels") return `https://www.pexels.com/search/${q}/`;
  if (provider === "pixabay") return `https://pixabay.com/images/search/${q}/`;
  if (provider === "mixkit") return `https://mixkit.co/free-stock-video/${q}/`;
  if (provider === "videvo") return `https://www.videvo.net/search/${q}/`;

  return "https://www.pexels.com";
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2 py-2 text-[11px] font-black ${active
          ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
          : "border-white/10 bg-black/20 text-zinc-500 hover:border-cyan-400/40"
        }`}
    >
      {label}
    </button>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}