"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Globe,
  MessageSquare,
  Video,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "기능", href: "/#features" },
        { label: "사용방법", href: "/#how-it-works" },
        { label: "가격", href: "/pricing" },
        { label: "스튜디오", href: "/studio" },
      ],
    },
    {
      title: "Studio",
      links: [
        { label: "AI 글쓰기", href: "/studio/writing/creaibox/create" },
        { label: "워드프레스 글쓰기", href: "/studio/writing/wp/create" },
        { label: "이미지 제작", href: "/studio/visuals/image" },
        { label: "음악 / 가사", href: "/studio/music/lyrics" },
        { label: "트렌드 분석", href: "/studio/tools/trend" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "블로그", href: "/blog" },
        { label: "가이드", href: "/guide" },
        { label: "고객지원", href: "/support" },
        { label: "인포센터", href: "/infocenter" },
        { label: "문의하기", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-40">
                <Image
                  src="/logobg.webp"
                  alt="CreAIbox Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="max-w-sm break-keep text-sm font-medium leading-relaxed text-slate-600">
              글쓰기, 이미지, 음악, 영상, 뉴스, 트렌드 분석까지 한 번에.
              CreAIbox는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.
            </p>

            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
            >
              <Sparkles size={16} />
              스튜디오 시작하기
            </Link>

            <div className="flex gap-3">
              {[Globe, MessageSquare, Video, Mail].map((Icon, idx) => (
                <button
                  key={idx}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                  type="button"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-[0.22em] text-slate-900">
                {section.title}
              </h4>

              <ul className="space-y-3.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm font-bold text-slate-500 transition hover:text-violet-600"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="translate-x-1 -translate-y-1 opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-8 md:flex-row">
          <div className="text-xs font-bold text-slate-500">
            © {currentYear} <span className="text-slate-800">CreAI Labs</span>.
            All rights reserved.
          </div>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs font-bold text-slate-500 transition hover:text-violet-600"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs font-bold text-slate-500 transition hover:text-violet-600"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}