"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import DynamicConsultationForm from "./DynamicConsultationForm";
import AdvancedMediaCarousel from "./AdvancedMediaCarousel";
import AdvancedContentCarousel from "./AdvancedContentCarousel";
import HeroImageSlider from "./HeroImageSlider";
import SmartphoneMockup from "./SmartphoneMockup";
import InteractiveAccordion from "./InteractiveAccordion";
import InfiniteLogoMarquee from "./InfiniteLogoMarquee";
import InteractiveTabs from "./InteractiveTabs";
import AnimatedCounter from "./AnimatedCounter";
import TestimonialCarousel from "./TestimonialCarousel";
import BeforeAfterSlider from "./BeforeAfterSlider";
import PricingTable from "./PricingTable";
import LocationMapCard from "./LocationMapCard";
import VideoCardGrid from "./VideoCardGrid";
import InteractiveLocationMagnifier from "./InteractiveLocationMagnifier";
import InteractiveVideoBanner from "./InteractiveVideoBanner";

interface SectionProps {
  siteId: string;
  sectionType: string;
  title: string;
  subtitle: string;
  contentData: any;
}

function SafeCustomHtmlSection({
  html,
  style
}: {
  html: string;
  style?: React.CSSProperties;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const containerEl = target.closest("section, div");
      if (containerEl) {
        const video = containerEl.querySelector("video");
        const btn = containerEl.querySelector("button, [aria-label*='Play'], [aria-label*='play']");
        if (video && (target.closest("video") || target.closest("button") || target.closest(".absolute") || target.closest("section"))) {
          if (video.paused) {
            video.play().then(() => {
              if (btn) (btn as HTMLElement).style.opacity = "0";
            }).catch(() => {});
          } else {
            video.pause();
            if (btn) (btn as HTMLElement).style.opacity = "1";
          }
        }
      }
    };

    container.addEventListener("click", handleClick);
    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={style}
      suppressHydrationWarning={true}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
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

  const actualSectionType = sectionType.startsWith("subpage_") ? "custom_html" : sectionType;
  const customBgStyle = contentData.bg_color ? { backgroundColor: contentData.bg_color } : {};

  switch (actualSectionType) {
    case "faq_accordion":
    case "accordion": {
      return (
        <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <InteractiveAccordion
            items={contentData.items || contentData.faqs || []}
            title={title}
            subtitle={subtitle}
            styleType={contentData.styleType || "card"}
            allowMultiple={contentData.allowMultiple}
          />
        </section>
      );
    }
    case "logo_marquee":
    case "partner_logos": {
      return (
        <section className="py-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <InfiniteLogoMarquee
            logos={contentData.logos || contentData.partners || []}
            title={title || subtitle}
            speedSeconds={contentData.speedSeconds}
            direction={contentData.direction}
          />
        </section>
      );
    }
    case "category_tabs":
    case "menu_tabs": {
      return (
        <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <InteractiveTabs
            tabs={contentData.tabs || []}
            defaultTabId={contentData.defaultTabId}
            title={title}
            subtitle={subtitle}
          />
        </section>
      );
    }
    case "animated_counter":
    case "stats_counter": {
      return (
        <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <AnimatedCounter
            stats={contentData.stats || contentData.items || []}
            title={title}
            subtitle={subtitle}
            durationMs={contentData.durationMs}
          />
        </section>
      );
    }
    case "testimonial_carousel":
    case "customer_reviews": {
      return (
        <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <TestimonialCarousel
            testimonials={contentData.testimonials || contentData.reviews || []}
            title={title}
            subtitle={subtitle}
            autoPlayInterval={contentData.autoPlayInterval}
          />
        </section>
      );
    }
    case "before_after_slider":
    case "comparison_slider": {
      return (
        <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <BeforeAfterSlider
            beforeImage={contentData.beforeImage}
            afterImage={contentData.afterImage}
            beforeLabel={contentData.beforeLabel}
            afterLabel={contentData.afterLabel}
            title={title}
            subtitle={subtitle}
            aspectRatio={contentData.aspectRatio}
          />
        </section>
      );
    }
    case "pricing_table":
    case "plans": {
      return (
        <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <PricingTable
            plans={contentData.plans || []}
            title={title}
            subtitle={subtitle}
            discountBadge={contentData.discountBadge}
          />
        </section>
      );
    }
    case "location_map":
    case "directions": {
      return (
        <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <LocationMapCard
            companyName={contentData.companyName || title || "오시는 길"}
            address={contentData.address || ""}
            detailAddress={contentData.detailAddress}
            phone={contentData.phone}
            workingHours={contentData.workingHours}
            naverMapUrl={contentData.naverMapUrl}
            kakaoMapUrl={contentData.kakaoMapUrl}
            embedMapHtml={contentData.embedMapHtml}
            title={title}
            subtitle={subtitle}
          />
        </section>
      );
    }
    case "location_magnifier":
    case "interactive_map_zoom": {
      return (
        <section className="w-full" style={customBgStyle}>
          <InteractiveLocationMagnifier
            mapImage={contentData.mapImage || contentData.image || "https://cheonan-dmapt.co.kr/images/location-bg.jpg"}
            zoomImage={contentData.zoomImage || contentData.highlightImage}
            badgeText={contentData.badgeText || "CENTRAL LOCATION PREMIUM • "}
            title={title || contentData.title}
            subtitle={subtitle || contentData.subtitle}
            description={contentData.description}
            linkUrl={contentData.linkUrl || contentData.link || "#"}
            linkText={contentData.linkText || "입지 프리미엄 자세히보기"}
            zoomFactor={contentData.zoomFactor || 2}
          />
        </section>
      );
    }
    case "video_grid":
    case "video_ads":
    case "video_modal": {
      const videos = contentData.videos || contentData.items || [];
      return (
        <section className="py-16 px-4 md:px-8 xl:px-12 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <VideoCardGrid
            videos={videos}
            title={title || "광고영상"}
            subtitle={subtitle}
            moreLink={contentData.moreLink || "/news/video"}
            moreText={contentData.moreText || "더보기"}
          />
        </section>
      );
    }
    case "app_download": {
      const appImages: string[] = contentData.images || (contentData.image ? [contentData.image] : (contentData.imageSrc ? [contentData.imageSrc] : []));
      const tags = contentData.tags || contentData.badges || ["#픽업오더", "#딜리버리오더", "#멤버십적립", "#할인쿠폰"];
      const qrCode = contentData.qrCode || contentData.qrImage;
      const appStoreLink = contentData.appStoreLink || "#";
      const googlePlayLink = contentData.googlePlayLink || "#";

      return (
        <section className="py-16 px-4 md:px-8 xl:px-12 max-w-screen-2xl mx-auto" style={customBgStyle}>
          <div className="bg-[#F5EADC] rounded-3xl p-8 md:p-12 xl:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-sm">
            {/* Left Smartphone Mockup with Auto-Rotating Multi-Image Carousel */}
            <div className="lg:col-span-5 flex justify-center">
              <SmartphoneMockup images={appImages} />
            </div>

            {/* Right App Details & Badges */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-[#D4200C] font-black text-sm md:text-base tracking-wide uppercase block">
                {subtitle || "오직 앱에서만 가능한 특별한 혜택"}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#502314] leading-tight">
                {title || "지금 앱 다운로드 받으시고 혜택을 누리세요!"}
              </h2>

              {/* Tag Badges */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start pt-2">
                  {tags.map((tag: string, tIdx: number) => (
                    <span 
                      key={tIdx}
                      className="px-4 py-2 bg-[#502314] text-white text-xs md:text-sm font-black rounded-2xl shadow-sm"
                    >
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}

              {/* QR Code & Luxury Store Download Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                {/* QR Code Container with Robust Fallback */}
                <div className="p-3 bg-white rounded-2xl shadow-md border border-black/5 flex items-center justify-center w-24 h-24 flex-shrink-0">
                  {qrCode && !qrCode.includes("QR Code for") ? (
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to vector QR on image error
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const svgFallback = document.createElement('div');
                          svgFallback.innerHTML = `<svg class="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor"><path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-4h2v2h-2v-2zm-2 2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z"/></svg>`;
                          parent.appendChild(svgFallback);
                        }
                      }}
                    />
                  ) : (
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-4h2v2h-2v-2zm-2 2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z"/>
                    </svg>
                  )}
                </div>

                {/* Luxury Black Store Download Buttons */}
                <div className="flex flex-col gap-2.5">
                  {/* Google Play Button */}
                  <a 
                    href={googlePlayLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102 border border-neutral-800 group cursor-pointer"
                  >
                    {/* Official Google Play Triangle Logo SVG */}
                    <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186A2.474 2.474 0 0 1 3 20.536V3.464c0-.649.236-1.24.609-1.65z" />
                      <path fill="#FBBC04" d="M17.556 8.236l-3.764 3.764 3.764 3.764 4.25-2.454c.732-.423.732-1.997 0-2.42l-4.25-2.654z" />
                      <path fill="#34A853" d="M3.609 22.186L14.792 11 17.556 13.764l-11.83 6.902c-.7.408-1.508.196-2.117-.48z" />
                      <path fill="#EA4335" d="M3.609 1.814l13.947 8.15-2.764 2.764L3.61 1.814c.609-.676 1.417-.888 2.117-.48z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] font-medium leading-none text-neutral-300">GET IT ON</p>
                      <p className="text-sm font-bold leading-tight text-white tracking-wide">Google Play</p>
                    </div>
                  </a>

                  {/* App Store Button */}
                  <a 
                    href={appStoreLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102 border border-neutral-800 group cursor-pointer"
                  >
                    {/* Official Apple Logo SVG */}
                    <svg className="w-6 h-6 fill-current flex-shrink-0 text-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.66-.9 2.69 1 .08 2.03-.5 2.59-1.18z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] font-medium leading-none text-neutral-300">Download on the</p>
                      <p className="text-sm font-bold leading-tight text-white tracking-wide">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    case "hero_slider":
    case "hero_split_slider":
    case "hero_image_slider":
    case "advanced_media_carousel": {
      const mediaUrls = contentData.media_urls || contentData.videos || contentData.images || contentData.slides || [];
      const sideCards = contentData.side_cards || contentData.right_cards || [];
      const sideHtml = contentData.side_html || contentData.right_html;

      if (mediaUrls.length > 0) {
        // Determine if media contains actual video files
        const hasVideo = mediaUrls.some((u: string) => typeof u === "string" && /\.(mp4|webm|ogg)$/i.test(u));
        if (hasVideo) {
          return <AdvancedMediaCarousel mediaUrls={mediaUrls} desktopAspectRatio={contentData.desktop_aspect_ratio} />;
        }

        // If side cards or side HTML are present, render the iconic 2-column split hero layout (e.g. Burger King)
        if (sideCards.length > 0 || sideHtml) {
          return (
            <section className="py-6 px-4 md:px-8 xl:px-12 max-w-screen-2xl mx-auto" style={customBgStyle}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left 70% Slider */}
                <div className="lg:col-span-8 flex flex-col justify-center">
                  <HeroImageSlider 
                    images={mediaUrls} 
                    desktopAspectRatio="16/9" 
                    autoPlayInterval={contentData.interval || 3500}
                    className="h-full shadow-md"
                  />
                </div>

                {/* Right 30% Stacked Cards */}
                <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
                  {sideHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: sideHtml }} className="flex flex-col gap-6 h-full justify-between" />
                  ) : (
                    sideCards.map((card: any, cIdx: number) => (
                      <div 
                        key={cIdx} 
                        className={`rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-md relative overflow-hidden flex-1 ${
                          card.bgColor || (cIdx === 0 ? "bg-[#FF8700] text-white" : "bg-[#502314] text-white")
                        }`}
                      >
                        <div className="space-y-3 z-10">
                          <span className="text-xs font-bold uppercase tracking-wider opacity-90 block">{card.tag || card.badge || "안내"}</span>
                          <h3 className="text-xl md:text-2xl font-black leading-tight">{card.title}</h3>
                          {card.buttonText && (
                            <a 
                              href={card.link || "#"} 
                              className="inline-block mt-2 px-4 py-2 bg-black/30 hover:bg-black/50 text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-all"
                            >
                              {card.buttonText}
                            </a>
                          )}
                        </div>
                        {card.image && typeof card.image === "string" && card.image.trim() !== "" && (
                          <img src={card.image} alt={card.title || "Card"} className="w-28 md:w-36 object-contain z-10" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          );
        }

        // Standard Full-Width Hero Slider
        return (
          <div className="w-full" style={customBgStyle}>
            <HeroImageSlider 
              images={mediaUrls} 
              desktopAspectRatio={contentData.desktop_aspect_ratio} 
              autoPlayInterval={contentData.interval || 3500}
            />
          </div>
        );
      }
      // Fallback to custom_html if AI provided no URLs
    }
    case "advanced_content_carousel": {
      const slides = contentData.slides || [];
      if (slides.length > 0) {
        return <AdvancedContentCarousel slides={slides} />;
      }
      // Fallback to custom_html if AI provided no slides
    }
    case "interactive_video_banner":
    case "video_banner":
    case "fullscreen_video": {
      return (
        <InteractiveVideoBanner
          videoUrl={contentData.videoUrl || contentData.video_url}
          videoSources={contentData.videoSources || contentData.sources || []}
          poster={contentData.poster || contentData.posterUrl}
          title={title}
          subtitle={subtitle}
          aspectRatio={contentData.aspectRatio || "16/9"}
        />
      );
    }
    // eslint-disable-next-line no-fallthrough
    case "custom_html": {
      let htmlToRender = contentData.html || "";
      // If user sets a custom background color, strip the AI's default background classes
      if (contentData.bg_color) {
        htmlToRender = htmlToRender.replace(/\bbg-(white|black|transparent|gray-\d+|slate-\d+|zinc-\d+|neutral-\d+|stone-\d+|red-\d+|orange-\d+|amber-\d+|yellow-\d+|lime-\d+|green-\d+|emerald-\d+|teal-\d+|cyan-\d+|sky-\d+|blue-\d+|indigo-\d+|violet-\d+|purple-\d+|fuchsia-\d+|pink-\d+|rose-\d+)\b/g, "");
      }

      return (
        <SafeCustomHtmlSection 
          html={htmlToRender}
          style={customBgStyle}
        />
      );
    }
    case "hero": {
      const bgImage = contentData.image || contentData.backgroundImage || contentData.imageUrl;
      const ctaText = contentData.ctaText || "시작하기";
      const ctaLink = contentData.ctaLink || "#contact";
      const features = contentData.features || [];

      return (
        <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-36 bg-[var(--surface)] border-b border-slate-100/50" style={customBgStyle} suppressHydrationWarning={true}>
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
                {bgImage && typeof bgImage === "string" && (bgImage.startsWith("http://") || bgImage.startsWith("https://") || bgImage.startsWith("/")) ? (
                  <img
                    src={(bgImage.includes("drive.google.com") || bgImage.includes("googleusercontent.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(bgImage)}` : bgImage}
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
                {/* Visual Glass Box (Fallback) */}
                {!bgImage && (
                  <div className="relative z-10 border border-white/50 backdrop-blur-xl bg-white/40 p-8 shadow-2xl border-b border-r border-white/20" style={{ borderRadius: "var(--border-radius)" }}>
                    <div className="flex h-12 w-12 items-center justify-center bg-[var(--primary)] text-white shadow-md mb-4" style={{ borderRadius: "var(--border-radius)" }}>
                      <LucideIcons.Sparkles size={22} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">AI 맞춤형 페이지 가동 중</h4>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      실시간 동적 렌더링을 활용해 비즈니스 정체성에 최적화된 테마와 구조를 출력하고 있습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "services": {
      const items = contentData.items || [];
      return (
        <section id="services" className="py-24 bg-white scroll-mt-20 border-b border-slate-100/50" style={customBgStyle} suppressHydrationWarning={true}>
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
        <section id="about" className="py-24 bg-[var(--surface)] scroll-mt-20 border-b border-slate-100/50" style={customBgStyle} suppressHydrationWarning={true}>
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
        <section id="portfolio" className="py-24 bg-white scroll-mt-20 border-b border-slate-100/50" style={customBgStyle} suppressHydrationWarning={true}>
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
                    {item.image && typeof item.image === "string" && (item.image.startsWith("http://") || item.image.startsWith("https://") || item.image.startsWith("/")) ? (
                      <img
                        src={(item.image.includes("drive.google.com") || item.image.includes("googleusercontent.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(item.image)}` : item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
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
        <section id="rental" className="py-24 bg-[var(--surface)] scroll-mt-20 border-b border-slate-100/50" style={customBgStyle} suppressHydrationWarning={true}>
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
        <section id="contact" className="py-24 bg-slate-50 scroll-mt-20" style={customBgStyle} suppressHydrationWarning={true}>
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
