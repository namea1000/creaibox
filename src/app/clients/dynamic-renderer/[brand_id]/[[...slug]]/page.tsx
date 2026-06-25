import React from "react";
import { createClient } from "@/utils/supabase/server";
import DynamicSection from "../../components/DynamicSection";

interface PageProps {
  params: Promise<{
    brand_id: string;
    slug?: string[];
  }>;
}

export default async function DynamicRendererPage({ params }: PageProps) {
  const { brand_id, slug = [] } = await params;
  const supabase = await createClient();

  // 1. Fetch site settings
  const { data: site } = await supabase
    .from("client_sites")
    .select("id, company_name")
    .eq("brand_id", brand_id.toLowerCase())
    .maybeSingle();

  if (!site) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">홈페이지가 준비 중입니다.</h2>
      </div>
    );
  }

  // 2. Fetch site sections ordered by sort_order
  const { data: sections = [] } = await supabase
    .from("site_sections")
    .select("*")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true });

  if (!sections || sections.length === 0) {
    return (
      <div className="py-40 text-center max-w-xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">새로운 홈페이지가 준비되었습니다</h2>
        <p className="text-sm text-slate-500 font-semibold leading-relaxed">
          아직 설정된 섹션이 없습니다. 관리자 대시보드에서 AI 기획안을 승인하여 홈페이지를 채워보세요.
        </p>
      </div>
    );
  }

  const subPagePath = slug[0]?.toLowerCase();

  // 3. Render Focused Subpage
  if (subPagePath) {
    // Map URL slug paths to database section types
    const slugToSectionType: Record<string, string> = {
      about: "about",
      services: "services",
      portfolio: "portfolio",
      rental: "rental",
      contact: "contact"
    };

    const targetType = slugToSectionType[subPagePath];
    const targetSection = sections.find(s => s.section_type === targetType);

    if (!targetSection) {
      return (
        <div className="py-40 text-center max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            요청하신 경로(/{subPagePath})에 해당하는 섹션이 정의되어 있지 않습니다.
          </p>
        </div>
      );
    }

    return (
      <div className="pt-20">
        {/* Premium Subpage Banner */}
        <div className="bg-[var(--surface)] border-b border-slate-200/50 py-16 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--primary)] mb-2 block">
            {site.company_name}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {targetSection.title || targetSection.section_type.toUpperCase()}
          </h1>
        </div>

        {/* Dynamic focused section */}
        <DynamicSection
          siteId={site.id}
          sectionType={targetSection.section_type}
          title={targetSection.title || ""}
          subtitle={targetSection.subtitle || ""}
          contentData={targetSection.content_data}
        />
      </div>
    );
  }

  // 4. Render All Sections (Landing Page)
  return (
    <div className="flex flex-col">
      {sections.map((sect) => (
        <DynamicSection
          key={sect.id}
          siteId={site.id}
          sectionType={sect.section_type}
          title={sect.title || ""}
          subtitle={sect.subtitle || ""}
          contentData={sect.content_data}
        />
      ))}
    </div>
  );
}
