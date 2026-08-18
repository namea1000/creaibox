"use client";

import React from "react";
import Link from "next/link";

export default function SylvenTemplatePage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md">
        <div className="text-xl font-black tracking-tighter uppercase">Sylven</div>
        
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest uppercase">
          <Link href="#" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
            <span className="text-gray-400">01</span> Home
          </Link>
          <Link href="#" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
            <span className="text-gray-400">02</span> Projects
          </Link>
          <Link href="#" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
            <span className="text-gray-400">03</span> Blog
          </Link>
          <Link href="#" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
            <span className="text-gray-400">04</span> Contact
          </Link>
        </nav>
        
        <button className="bg-black text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer">
          Book a Call
        </button>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 max-w-[1440px] mx-auto min-h-screen flex flex-col">
        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-20">
          <span>(©2018 - ©2026)</span>
          <span>Based in Australia</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-6xl font-black mb-8 leading-none">
            R
          </div>
          
          <div className="flex flex-col items-center gap-2 mb-12">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500" />
                </div>
              ))}
            </div>
            <div className="text-sm font-bold mt-2">4.9/5</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Based on 230 reviews</div>
          </div>

          <h1 className="text-[10vw] leading-[0.9] font-black tracking-tighter uppercase mb-20">
            For Growth<br/>Driven<br/>Brands
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end pb-12">
          <p className="text-2xl md:text-3xl font-medium leading-tight max-w-xl">
            We build, optimize, and scale marketing engines that generate pipeline and improve Marketing ROI
          </p>
          
          <ul className="space-y-4 text-sm font-bold">
            <li className="flex items-center gap-4 py-2 border-b border-gray-100">
              <span className="text-gray-400">01)</span> Digital Transformation
            </li>
            <li className="flex items-center gap-4 py-2 border-b border-gray-100">
              <span className="text-gray-400">02)</span> Digital Consultation
            </li>
            <li className="flex items-center gap-4 py-2 border-b border-gray-100">
              <span className="text-gray-400">03)</span> Operational Efficiency
            </li>
            <li className="flex items-center gap-4 py-2 border-b border-gray-100">
              <span className="text-gray-400">04)</span> SEO Optimization
            </li>
          </ul>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="w-full overflow-hidden bg-gray-50 py-12 border-y border-gray-100">
        <div className="flex gap-8 whitespace-nowrap opacity-50">
          <span className="text-2xl font-black uppercase tracking-tighter">BRAND STRATEGY</span>
          <span className="text-2xl font-black uppercase tracking-tighter text-gray-300">•</span>
          <span className="text-2xl font-black uppercase tracking-tighter">VISUAL IDENTITY</span>
          <span className="text-2xl font-black uppercase tracking-tighter text-gray-300">•</span>
          <span className="text-2xl font-black uppercase tracking-tighter">DIGITAL EXPERIENCE</span>
          <span className="text-2xl font-black uppercase tracking-tighter text-gray-300">•</span>
          <span className="text-2xl font-black uppercase tracking-tighter">WEB DESIGN</span>
          <span className="text-2xl font-black uppercase tracking-tighter text-gray-300">•</span>
          <span className="text-2xl font-black uppercase tracking-tighter">SEO & GROWTH</span>
        </div>
      </div>

    </div>
  );
}
