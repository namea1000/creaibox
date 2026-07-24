"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Mail,
  TrendingUp,
  Globe,
  Bell,
  Menu,
  X,
  Zap,
  Bookmark,
  Radio,
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribeSuccess(true);
      setTimeout(() => {
        setSubscribeSuccess(false);
        setNewsletterModalOpen(false);
        setSubscribedEmail("");
      }, 2000);
    }
  };

  return (
    <>
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-950 px-4 py-2 text-xs font-bold text-cyan-200 border-b border-cyan-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 text-[10px] font-black text-cyan-300">
              <Radio size={10} className="animate-pulse text-cyan-400" />속보
            </span>
            <span className="truncate text-slate-200 text-[11px] sm:text-xs">
              🔥 2026년 하반기 자율 AI 에이전트 & 디지털 미디어 트렌드 리포트 무료 발간!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-[11px] text-cyan-300/80">
            <span className="flex items-center gap-1"><Zap size={11} className="text-amber-400" /> DoFollow SEO Ready</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Globe size={11} className="text-emerald-400" /> 누적 180,000+ 독자</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/clients/creative-media-blog" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
                  <Sparkles size={20} className="fill-slate-950" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    CreativeMedia <span className="text-cyan-400">BLOG</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    IT · Tech · Trend Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-extrabold text-slate-300">
              <Link href="/clients/creative-media-blog" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                홈
              </Link>
              <a href="#articles" className="hover:text-cyan-300 transition-colors">
                AI & 테크
              </a>
              <a href="#articles" className="hover:text-cyan-300 transition-colors">
                디자인 & UI/UX
              </a>
              <a href="#articles" className="hover:text-cyan-300 transition-colors">
                마케팅 & 인사이트
              </a>
              <a href="#ranking" className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-amber-400">
                <TrendingUp size={13} /> 인기 랭킹
              </a>
            </nav>

            {/* Right-Side CTA Header Area: Blog & Contact Buttons */}
            <div className="flex items-center gap-3">
              {/* Blog Link (Right Aligned) */}
              <a
                href="#articles"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                <Sparkles size={12} className="text-amber-400" />
                <span>Blog (블로그)</span>
              </a>

              {/* Contact / Newsletter Subscribe Button (Right Aligned) */}
              <button
                onClick={() => setNewsletterModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Mail size={14} />
                <span className="hidden sm:inline">Contact & 구독하기</span>
                <span className="sm:hidden">Contact</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
            <Link
              href="/clients/creative-media-blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-cyan-400"
            >
              홈
            </Link>
            <a
              href="#articles"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-300 hover:text-white"
            >
              AI & 테크
            </a>
            <a
              href="#articles"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-300 hover:text-white"
            >
              디자인 & UI/UX
            </a>
            <a
              href="#articles"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-300 hover:text-white"
            >
              마케팅 & 인사이트
            </a>
            <a
              href="#ranking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-amber-400"
            >
              🔥 실시간 인기 랭킹
            </a>
          </div>
        )}
      </header>

      {/* Newsletter Modal */}
      {newsletterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="text-cyan-400" size={18} />
                <h3 className="text-base font-black text-white">무료 트렌드 뉴스레터 구독</h3>
              </div>
              <button
                onClick={() => setNewsletterModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {subscribeSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Sparkles size={24} />
                </div>
                <h4 className="text-lg font-black text-white">구독 신청이 완료되었습니다! 🎉</h4>
                <p className="text-xs text-slate-300 font-medium">
                  매주 월요일 아침 프리미엄 AI & 테크 트렌드 리포트를 받아보실 수 있습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <p className="text-xs font-medium text-slate-300 leading-relaxed">
                  IT, AI 에이전트, UI/UX 디자인 트렌드 인사이트를 매주 월요일 가장 먼저 메일함으로 받아보세요.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400">이메일 주소</label>
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-md"
                >
                  무료 구독 신청하기
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
