import React from "react";
import HeroSection from "./components/HeroSection";
import BusinessSection from "./components/BusinessSection";
import RentalSection from "./components/RentalSection";
import PortfolioSection, { DynamicPortfolioItem } from "./components/PortfolioSection";
import ContactForm from "./components/ContactForm";
import { createAdminClient } from "@/utils/supabase/server";

export const revalidate = 60;
export const dynamicParams = true;


export default async function SotongcheumLandingPage() {
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, brand_id, extra_configs")
    .eq("brand_id", "sotongcheum")
    .maybeSingle();

  const customCategories: string[] = (profile as any)?.extra_configs?.blog_categories || [
    "전체",
    "행사대행",
    "교육서비스",
    "가족캠프",
    "소통소식",
  ];

  let dynamicPortfolioItems: DynamicPortfolioItem[] = [];

  if (profile?.id) {
    const { data: posts } = await supabase
      .from("writing_creaibox_posts")
      .select("id, title, slug, content, meta_description, focus_keyword, seo_tags, created_at")
      .eq("user_id", profile.id)
      .eq("status", "published")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    if (posts && posts.length > 0) {
      // Sort posts by date (newest first)
      posts.sort((a: any, b: any) => {
        const getPostTime = (p: any) => {
          const text = (p.title || "") + " " + (p.meta_description || "");
          const yearMatch = text.match(/(20\d{2})/);
          const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
          const dateObj = p.created_at ? new Date(p.created_at) : null;
          const dbTime = dateObj && !isNaN(dateObj.getTime()) ? dateObj.getTime() : 0;
          return year ? new Date(Date.UTC(year, 5, 15)).getTime() : dbTime;
        };
        return getPostTime(b) - getPostTime(a);
      });

      const postIds = posts.map((p: any) => p.id);
      const postSlugs = posts.map((p: any) => p.slug).filter(Boolean);
      const { data: images } = await supabase
        .from("generated_images")
        .select("source_id, image_url, is_primary")
        .eq("source_type", "writing_creaibox_posts")
        .in("source_id", [...postIds, ...postSlugs]);

      const primaryMap: Record<string, string> = {};
      (images || []).forEach((img: any) => {
        if (img.source_id && img.image_url) {
          if (img.is_primary || !primaryMap[img.source_id]) {
            primaryMap[img.source_id] = img.image_url;
          }
        }
      });

      dynamicPortfolioItems = posts.map((p: any) => {
        let thumb = primaryMap[p.id] || primaryMap[p.slug];
        if (!thumb && p.content) {
          const imgMatches = Array.from(p.content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
          for (const match of imgMatches as RegExpMatchArray[]) {
            const src = match[1];
            if (src && !src.includes("stat.naver.com")) {
              thumb = src;
              break;
            }
          }
        }

        const text = ((p.title || "") + " " + (p.meta_description || "") + " " + (p.focus_keyword || "") + " " + (p.seo_tags?.join(" ") || "")).toLowerCase();
        let cat = "소통소식";
        if (text.includes("행사") || text.includes("축제") || text.includes("개소식") || text.includes("준공식") || text.includes("대행")) {
          cat = "행사대행";
        } else if (text.includes("교육") || text.includes("테라피") || text.includes("역량") || text.includes("체험") || text.includes("원예")) {
          cat = "교육서비스";
        } else if (text.includes("캠프") || text.includes("가족") || text.includes("힐링")) {
          cat = "가족캠프";
        }

        const dateObj = p.created_at ? new Date(p.created_at) : new Date();
        const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;

        return {
          id: p.id,
          title: p.title || "소통과 채움 현장 실적",
          date: dateStr,
          imageUrl: thumb || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
          category: cat,
          slug: p.slug || p.id,
        };
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Business Section */}
      <BusinessSection />

      {/* 3. System Rental Section */}
      <RentalSection />

      {/* 4. Portfolio Section (Dynamic Synced with Blog) */}
      <PortfolioSection
        initialItems={dynamicPortfolioItems}
        tabs={customCategories}
      />

      {/* 5. Contact Section */}
      <section id="contact" className="py-24 bg-slate-50/50 scroll-mt-20 border-t border-slate-100/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
