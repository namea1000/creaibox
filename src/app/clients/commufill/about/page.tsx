import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CommufillAboutPage() {
  return (
    <div className="relative overflow-hidden py-16 lg:py-24">
      {/* Background gradients */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase italic tracking-wider text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-black uppercase italic tracking-tight text-white sm:text-5xl">
            About <span className="text-emerald-400">Commufill</span>
          </h1>
          <p className="text-base font-bold text-zinc-400 leading-relaxed">
            Commufill was founded with a single mission: to solve the "empty community" problem faced by modern businesses. Launching a new community space is hard, but filling it with meaningful engagement and high-quality, topic-relevant posts is even harder.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pt-8 border-t border-zinc-900">
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase italic text-white">Our Vision</h2>
            <p className="text-sm font-bold text-zinc-500 leading-relaxed">
              We envision a world where community spaces are lively, educational, and safe from day one. By pairing state-of-the-art AI content models with moderation pipelines, we give organizations the tools to seed and nurture organic communities at speed.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase italic text-white">Why Commufill?</h2>
            <ul className="space-y-3 text-sm font-bold text-zinc-450">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                Tailored AI templates for 22+ custom categories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                Zero-cold-start filling routines
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                Seamless custom domain and subdomain routing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
