import React from "react";
import Link from "next/link";
import { Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";

export default function CommufillHomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Neon Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 text-center lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-black uppercase italic tracking-wider text-emerald-400">
            <Sparkles size={12} className="animate-pulse" />
            Next-Gen Community Filling AI
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase italic leading-none">
            Scale Engagement <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Filled by Intelligence
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg font-bold text-zinc-400 leading-relaxed">
            Commufill automatically populates, moderates, and scales your corporate communities with top-tier AI-generated content, keeping your user base constantly active and growing.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-4 text-sm font-black uppercase italic tracking-wider text-black transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
            >
              Start Free Trial
              <Zap size={16} />
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 px-8 py-4 text-sm font-black uppercase italic tracking-wider text-zinc-300 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 rounded-3xl border border-zinc-900 bg-zinc-950/40 p-8 backdrop-blur-md">
          <div className="text-center p-6 space-y-2 border-b sm:border-b-0 sm:border-r border-zinc-900">
            <p className="text-4xl font-black italic text-emerald-400">99.8%</p>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Auto-Response Accuracy</p>
          </div>
          <div className="text-center p-6 space-y-2 border-b sm:border-b-0 sm:border-r border-zinc-900">
            <p className="text-4xl font-black italic text-teal-400">1.2M+</p>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Daily Messages Generated</p>
          </div>
          <div className="text-center p-6 space-y-2">
            <p className="text-4xl font-black italic text-cyan-400">10x</p>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Community Growth Speed</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
            Engineered for High-Activity Communities
          </h2>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
            Advanced features to keep your ecosystem filled and functional
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative rounded-3xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-emerald-500/30 hover:bg-zinc-900/30 transition-all duration-300">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black italic text-white uppercase tracking-tight">AI Content Pipeline</h3>
            <p className="mt-3 text-sm font-bold text-zinc-400 leading-relaxed">
              Auto-generate technical tutorials, Q&A topics, and discussion points customized exactly to your corporate theme.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-3xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-teal-500/30 hover:bg-zinc-900/30 transition-all duration-300">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20 transition-all">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black italic text-white uppercase tracking-tight">Real-Time Interaction</h3>
            <p className="mt-3 text-sm font-bold text-zinc-400 leading-relaxed">
              Interact with users instantly, solve FAQs in real time, and route enterprise complaints to correct team members.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-3xl border border-zinc-900 bg-zinc-950/40 p-8 hover:border-cyan-500/30 hover:bg-zinc-900/30 transition-all duration-300">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black italic text-white uppercase tracking-tight">Security & Governance</h3>
            <p className="mt-3 text-sm font-bold text-zinc-400 leading-relaxed">
              Enterprise-grade safety layers that block spam, reserve key brand terminology, and enforce RLS policies seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[40px] border border-zinc-900 bg-gradient-to-br from-zinc-950 via-zinc-950 to-emerald-950/20 p-12 lg:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tight sm:text-4xl">
            Empower Your Community Today
          </h2>
          <p className="mx-auto max-w-xl text-sm font-bold text-zinc-400 leading-relaxed">
            Fill the gaps in your enterprise community workspace. Harness the potential of content-driven scaling with Commufill.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-4 text-xs font-black uppercase italic tracking-wider text-black transition-all active:scale-95 shadow-md"
            >
              Contact Sales
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
