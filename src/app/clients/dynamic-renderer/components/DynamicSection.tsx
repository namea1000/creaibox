"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import DynamicConsultationForm from "./DynamicConsultationForm";

interface SectionProps {
  siteId: string;
  sectionType: string;
  title: string;
  subtitle: string;
  contentData: any;
}

export default function DynamicSection({
  siteId,
  sectionType,
  title,
  subtitle,
  contentData
}: SectionProps) {
  // Helper to render Lucide Icons dynamically
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.BookOpen;
    return <IconComponent className="h-6 w-6 text-white" />;
  };

  switch (sectionType) {
    case "hero": {
      const bgImage = contentData.backgroundImage;
      const ctaText = contentData.ctaText || "시작하기";
      const ctaLink = contentData.ctaLink || "#contact";
      const features = contentData.features || [];

      return (
        <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-36 bg-[var(--surface)] border-b border-slate-100/50">
          {/* Subtle light background gradients */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),theme(colors.white))]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 text-left max-w-3xl animate-fade-in-up">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 rounded-full mb-6">
                  Premium AI Builder
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-6 text-base md:text-lg text-slate-500 font-semibold leading-relaxed">
                    {subtitle}
                  </p>
                )}

                {/* Features Bullets */}
                {features.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feat: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <LucideIcons.Check className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-700">{feat.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={ctaLink}
                    className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 transition-all shadow-md active:scale-95 cursor-pointer"
                    style={{ borderRadius: "var(--border-radius)" }}
                  >
                    {ctaText}
                  </a>
                </div>
              </div>

              {/* Visual Graphic Panel */}
              <div className="lg:col-span-5 relative w-full aspect-square flex items-center justify-center animate-fade-in">
                {bgImage ? (
                  <img
                    src={bgImage}
                    alt={title}
                    className="w-full h-full object-cover shadow-2xl"
                    style={{ borderRadius: "var(--border-radius)" }}
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-10 blur-2xl absolute inset-0"
                    style={{ borderRadius: "var(--border-radius)" }}
                  />
                )}
                {/* Visual Glass Box */}
                <div className="relative z-10 border border-white/50 backdrop-blur-xl bg-white/40 p-8 shadow-2xl border-b border-r border-white/20" style={{ borderRadius: "var(--border-radius)" }}>
                  <div className="flex h-12 w-12 items-center justify-center bg-[var(--primary)] text-white shadow-md mb-4" style={{ borderRadius: "var(--border-radius)" }}>
                    <LucideIcons.Sparkles size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">AI 맞춤형 페이지 가동 중</h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    실시간 동적 렌더링을 활용해 비즈니스 정체성에 최적화된 테마와 구조를 출력하고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "services": {
      const items = contentData.items || [];
      return (
        <section id="services" className="py-24 bg-white scroll-mt-20 border-b border-slate-100/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-4 text-sm text-slate-500 font-semibold leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[var(--surface)] border border-slate-100 hover:border-[var(--primary)]/30 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  style={{ borderRadius: "var(--border-radius)" }}
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center bg-[var(--primary)] text-white shadow-md mb-6" style={{ borderRadius: "var(--border-radius)" }}>
                      {renderIcon(item.icon)}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-semibold">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "about": {
      const stats = contentData.stats || [];
      return (
        <section id="about" className="py-24 bg-[var(--surface)] scroll-mt-20 border-b border-slate-100/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">ABOUT US</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mt-3">
                  {title}
                </h2>
                <p className="mt-6 text-sm text-slate-600 leading-relaxed font-semibold whitespace-pre-line">
                  {contentData.description || subtitle}
                </p>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-6 bg-white p-8 border border-slate-200/50" style={{ borderRadius: "var(--border-radius)" }}>
                {stats.map((stat: any, idx: number) => (
                  <div key={idx} className="p-4 text-center border-b border-slate-100 last:border-b-0 even:border-l even:border-slate-100">
                    <span className="block text-3xl font-black text-[var(--primary)] mb-1">{stat.value}</span>
                    <span className="text-xs text-slate-500 font-bold">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "portfolio": {
      const items = contentData.items || [];
      return (
        <section id="portfolio" className="py-24 bg-white scroll-mt-20 border-b border-slate-100/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-4 text-sm text-slate-500 font-semibold leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[var(--surface)] border border-slate-100 hover:border-[var(--primary)]/30 shadow-sm overflow-hidden flex flex-col justify-between"
                  style={{ borderRadius: "var(--border-radius)" }}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <LucideIcons.Image className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-extrabold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "rental": {
      const stats = contentData.stats || [];
      return (
        <section id="rental" className="py-24 bg-[var(--surface)] scroll-mt-20 border-b border-slate-100/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-4 text-sm text-slate-500 font-semibold leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed font-semibold whitespace-pre-line">
                  {contentData.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 text-center border border-slate-100" style={{ borderRadius: "var(--border-radius)" }}>
                    <span className="block text-2xl font-black text-[var(--primary)] mb-1">{stat.value}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "contact": {
      const fields = contentData.fields || ["name", "phone", "message"];
      const buttonText = contentData.buttonText || "상담 접수하기";

      return (
        <section id="contact" className="py-24 bg-slate-50 scroll-mt-20">
          <div className="mx-auto max-w-4xl px-6">
            <DynamicConsultationForm
              siteId={siteId}
              title={title}
              subtitle={subtitle}
              fields={fields}
              buttonText={buttonText}
            />
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
