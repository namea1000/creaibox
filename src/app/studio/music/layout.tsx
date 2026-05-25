"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Music,
  Mic,
  Palette,
  Languages,
  Tag,
  Settings,
  Clock,
  Save,
  Play,
  Sparkles,
  Disc3,
  Image,
  Video,
  FileText,
  ListMusic,
  FolderOpen,
  Wand2,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import Footer from "@/components/layout/Footer";

export default function CreaiboxMusicStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
  { id: "music-home", label: "뮤직 홈", icon: Music, href: "/studio/music" },

  { id: "song-planner", label: "곡 기획", icon: Sparkles, href: "/studio/music/planner" },
  { id: "lyrics-suno", label: "가사 & Suno", icon: Mic, href: "/studio/music/lyrics" },
  { id: "style-format", label: "스타일 포맷", icon: Palette, href: "/studio/music/style" },

  { id: "cover", label: "커버 이미지", icon: Image, href: "/studio/music/cover" },
  { id: "video-prompt", label: "영상 프롬프트", icon: Video, href: "/studio/music/video" },

  { id: "translate", label: "번역", icon: Languages, href: "/studio/music/translate" },
  { id: "youtube", label: "유튜브 최적화", icon: Play, href: "/studio/music/youtube" },
  { id: "tags", label: "태그 관리", icon: Tag, href: "/studio/music/tags" },

  { id: "playlist", label: "플레이리스트", icon: ListMusic, href: "/studio/music/playlist" },
  { id: "archive", label: "저장 관리", icon: Save, href: "/studio/music/archive" },
  { id: "projects", label: "프로젝트", icon: FolderOpen, href: "/studio/music/projects" },
  { id: "history", label: "작업 내역", icon: Clock, href: "/studio/music/history" },

  { id: "settings", label: "설정", icon: Settings, href: "/studio/music/settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#050505] text-zinc-100 font-sans">
      <div className="flex flex-1 pt-20 overflow-hidden">
        <Sidebar
          activeMenu="Music"
          isCollapsed={false}
          setIsCollapsed={() => {}}
          isMobileOpen={false}
          setIsMobileOpen={() => {}}
        />

        <main className="flex-1 flex flex-col min-w-0 border-l border-zinc-800 bg-[#0a0a0c] overflow-y-auto">
          <div className="sticky top-0 z-20 flex items-stretch px-4 border-b border-zinc-800 bg-[#121214]/90 backdrop-blur-xl">
            <div className="flex overflow-x-auto no-scrollbar w-full gap-1 items-stretch">
              {tabs.map((tab) => {
                const isActive =
                  pathname === tab.href ||
                  (tab.href !== "/studio/music" && pathname.startsWith(tab.href));

                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 shrink-0 ${
                      isActive
                        ? "text-white border-[#f59e0b] bg-white/5"
                        : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <tab.icon
                      size={16}
                      className={isActive ? "text-[#f59e0b]" : "text-zinc-600"}
                    />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex-1 w-full p-6">{children}</div>
        </main>

        <div className="hidden xl:flex shrink-0 border-l border-zinc-800 bg-[#050505]">
          <Aside />
        </div>
      </div>

      <Footer />
    </div>
  );
}