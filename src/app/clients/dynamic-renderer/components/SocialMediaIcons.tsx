"use client";

import React from "react";

export type SocialPlatform = 
  | "instagram" 
  | "youtube" 
  | "facebook" 
  | "twitter" 
  | "x" 
  | "threads" 
  | "tiktok" 
  | "kakao" 
  | "naver_blog" 
  | "naver_cafe" 
  | "daangn" 
  | "brunch" 
  | "linkedin" 
  | "discord" 
  | "telegram" 
  | "github" 
  | "whatsapp" 
  | "generic";

interface PlatformMeta {
  name: string;
  bgColor: string; // Tailwind class or inline CSS
  textColor: string;
  icon: React.ReactNode;
}

export function detectPlatformFromUrl(url: string): SocialPlatform {
  if (!url) return "generic";
  const lower = url.toLowerCase();
  
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("facebook.com") || lower.includes("fb.com")) return "facebook";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "x";
  if (lower.includes("threads.net")) return "threads";
  if (lower.includes("tiktok.com")) return "tiktok";
  if (lower.includes("kakao.com") || lower.includes("pf.kakao.com") || lower.includes("kakaotalk")) return "kakao";
  if (lower.includes("blog.naver.com")) return "naver_blog";
  if (lower.includes("cafe.naver.com")) return "naver_cafe";
  if (lower.includes("daangn.com") || lower.includes("karrotmarket")) return "daangn";
  if (lower.includes("brunch.co.kr")) return "brunch";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("discord.gg") || lower.includes("discord.com")) return "discord";
  if (lower.includes("t.me") || lower.includes("telegram.me")) return "telegram";
  if (lower.includes("github.com")) return "github";
  if (lower.includes("whatsapp.com") || lower.includes("wa.me")) return "whatsapp";
  
  return "generic";
}

const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformMeta> = {
  instagram: {
    name: "Instagram",
    bgColor: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  youtube: {
    name: "YouTube",
    bgColor: "bg-[#FF0000]",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  facebook: {
    name: "Facebook",
    bgColor: "bg-[#1877F2]",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  x: {
    name: "X (Twitter)",
    bgColor: "bg-[#000000]",
    textColor: "text-white",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  twitter: {
    name: "X (Twitter)",
    bgColor: "bg-[#000000]",
    textColor: "text-white",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  threads: {
    name: "Threads",
    bgColor: "bg-[#101010]",
    textColor: "text-white",
    icon: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
        <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.096 5.467 0 12.186 0c6.643 0 11.884 5.176 11.884 11.758 0 .61-.044 1.218-.13 1.815h-4.32a7.618 7.618 0 0 0 .157-1.57c0-4.22-3.41-7.643-7.591-7.643-4.18 0-7.591 3.423-7.591 7.643 0 4.22 3.41 7.643 7.591 7.643 2.115 0 4.026-.874 5.394-2.278l3.07 3.036C18.665 22.457 15.603 24 12.186 24z"/>
      </svg>
    )
  },
  tiktok: {
    name: "TikTok",
    bgColor: "bg-[#010101]",
    textColor: "text-white",
    icon: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    )
  },
  kakao: {
    name: "KakaoTalk",
    bgColor: "bg-[#FEE500]",
    textColor: "text-[#191919]",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.88 1.91 5.39 4.8 6.74l-1.22 4.5c-.1.38.3.7.63.48l5.25-3.48c.18.02.36.03.54.03 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
      </svg>
    )
  },
  naver_blog: {
    name: "Naver Blog",
    bgColor: "bg-[#03C75A]",
    textColor: "text-white",
    icon: (
      <span className="font-black text-sm tracking-tighter leading-none select-none">N</span>
    )
  },
  naver_cafe: {
    name: "Naver Cafe",
    bgColor: "bg-[#2DB400]",
    textColor: "text-white",
    icon: (
      <span className="font-black text-sm tracking-tighter leading-none select-none">C</span>
    )
  },
  daangn: {
    name: "Karrot (당근)",
    bgColor: "bg-[#FF6F0F]",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2.07-7.75l-.9 3.5c-.1.38-.45.65-.85.65h-2.64c-.4 0-.75-.27-.85-.65l-.9-3.5c-.16-.62.31-1.25.96-1.25h4.22c.65 0 1.12.63.96 1.25z"/>
      </svg>
    )
  },
  brunch: {
    name: "Brunch",
    bgColor: "bg-[#00C4C4]",
    textColor: "text-white",
    icon: (
      <span className="font-black text-xs tracking-tighter leading-none select-none">B</span>
    )
  },
  linkedin: {
    name: "LinkedIn",
    bgColor: "bg-[#0A66C2]",
    textColor: "text-white",
    icon: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  discord: {
    name: "Discord",
    bgColor: "bg-[#5865F2]",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    )
  },
  telegram: {
    name: "Telegram",
    bgColor: "bg-[#229ED9]",
    textColor: "text-white",
    icon: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z"/>
      </svg>
    )
  },
  github: {
    name: "GitHub",
    bgColor: "bg-[#24292F]",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    )
  },
  whatsapp: {
    name: "WhatsApp",
    bgColor: "bg-[#25D366]",
    textColor: "text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
      </svg>
    )
  },
  generic: {
    name: "Website",
    bgColor: "bg-slate-700",
    textColor: "text-white",
    icon: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.884v-3.884h2.089l.311-2h-2.4v-1.28c0-.579.161-.974.992-.974h1.008v-1.787c-.174-.023-.772-.075-1.468-.075-1.453 0-2.45 1.008-2.45 2.518v1.598h-1.582v2h1.582v3.884c-3.959-.579-7-3.978-7-8.084 0-4.52 3.673-8.192 8.192-8.192 4.52 0 8.192 3.672 8.192 8.192 0 4.106-3.041 7.505-7 8.084z"/>
      </svg>
    )
  }
};

export interface SocialMediaIconProps {
  url: string;
  platform?: SocialPlatform;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SocialMediaIcon({
  url,
  platform,
  size = "md",
  className = ""
}: SocialMediaIconProps) {
  const resolvedPlatform = platform || detectPlatformFromUrl(url);
  const config = PLATFORM_CONFIGS[resolvedPlatform] || PLATFORM_CONFIGS.generic;

  const sizeClasses = 
    size === "sm" ? "w-8 h-8 text-xs" :
    size === "lg" ? "w-12 h-12 text-base" :
    "w-9 h-9 sm:w-10 sm:h-10 text-sm";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={config.name}
      className={`relative inline-flex items-center justify-center rounded-full ${config.bgColor} ${config.textColor} ${sizeClasses} shadow-md hover:scale-115 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      {config.icon}
    </a>
  );
}

export interface SocialMediaIconListProps {
  links: { platform?: SocialPlatform; url: string }[] | Record<string, string>;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function SocialMediaIconList({
  links,
  size = "md",
  className = "flex items-center gap-3"
}: SocialMediaIconListProps) {
  const normalizedLinks: { platform?: SocialPlatform; url: string }[] = Array.isArray(links)
    ? links
    : Object.entries(links || {})
        .filter(([_, url]) => Boolean(url) && url !== "#")
        .map(([platform, url]) => ({
          platform: platform as SocialPlatform,
          url
        }));

  if (!normalizedLinks || normalizedLinks.length === 0) return null;

  return (
    <div className={className}>
      {normalizedLinks.map((item, idx) => (
        <SocialMediaIcon
          key={idx}
          url={item.url}
          platform={item.platform}
          size={size}
        />
      ))}
    </div>
  );
}
