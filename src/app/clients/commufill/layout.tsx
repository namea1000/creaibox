import React from "react";
import Link from "next/link";
import { MessageSquare, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Commufill | AI-Powered Community Engagement Platform",
  description: "Automate and scale your community content, engagement, and management with Commufill's advanced AI services.",
};

export default function CommufillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#06080f] text-zinc-150 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Premium Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#06080f]/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-xl font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">
              Commu<span className="text-emerald-400">fill</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all active:scale-95 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
            >
              Get Started
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative">{children}</main>

      {/* Premium Dark Footer */}
      <footer className="border-t border-zinc-900 bg-[#04050a] py-12 lg:py-16 mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span className="text-md font-black uppercase tracking-wider text-white">
                  Commu<span className="text-emerald-400">fill</span>
                </span>
              </div>
              <p className="text-xs font-bold text-zinc-500 max-w-xs leading-relaxed">
                AI-powered community automation and high-fidelity content filling solutions for modern enterprises.
              </p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-10 text-xs font-bold text-zinc-400">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Company</p>
                <ul className="space-y-2">
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Contact</p>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Sales Inquiry</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <p>&copy; {new Date().getFullYear()} Commufill. All rights reserved.</p>
            <p>Powered by CreAibox System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
