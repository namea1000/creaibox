import React from "react";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ brand_id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ brand_id: string }> }): Promise<Metadata> {
  const { brand_id } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from("client_sites")
    .select("company_name")
    .eq("brand_id", brand_id.toLowerCase())
    .maybeSingle();

  return {
    title: site ? `${site.company_name} - 공식 홈페이지` : "홈페이지 준비 중",
  };
}

export default async function DynamicRendererLayout({ children, params }: LayoutProps) {
  const { brand_id } = await params;
  const supabase = await createClient();

  // 1. Fetch site settings
  const { data: site } = await supabase
    .from("client_sites")
    .select("*")
    .eq("brand_id", brand_id.toLowerCase())
    .maybeSingle();

  if (!site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-blue-500">Site Under Construction</h1>
        <p className="text-slate-400 max-w-md">
          요청하신 홈페이지({brand_id})는 아직 활성화되지 않았습니다. 관리자 센터에서 기획안 승인을 완료해 주세요.
        </p>
      </div>
    );
  }

  // 2. Fetch sections to see if portfolio/rental sections exist (for GNB headers link visibility)
  const { data: sections = [] } = await supabase
    .from("site_sections")
    .select("section_type")
    .eq("site_id", site.id);

  const hasPortfolio = (sections || []).some(s => s.section_type === "portfolio");
  const hasRental = (sections || []).some(s => s.section_type === "rental");

  // 3. Resolve template details
  const templateConfig = TEMPLATE_REGISTRY[site.template_id] || TEMPLATE_REGISTRY.business_standard;
  
  // Merge colors/fonts from extra_configs
  const theme = {
    ...templateConfig.theme,
    colors: {
      ...templateConfig.theme.colors,
      ...(site.extra_configs?.colors || {})
    },
    fontFamily: site.extra_configs?.fontFamily || templateConfig.theme.fontFamily
  };

  // Google Font Loading URL
  const fontName = (theme.fontFamily || "Inter").split(",")[0].replace(/['"]/g, "").trim();
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap`;

  const borderRadiusValue = 
    theme.borderRadius === 'rounded-none' ? '0px' : 
    theme.borderRadius === 'rounded-md' ? '6px' : 
    theme.borderRadius === 'rounded-xl' ? '12px' : 
    theme.borderRadius === 'rounded-2xl' ? '16px' : 
    theme.borderRadius === 'rounded-3xl' ? '24px' : '12px';

  // Inject CSS Variables as inline style on the outer wrapper
  const containerStyle = {
    "--primary": theme.colors.primary,
    "--secondary": theme.colors.secondary,
    "--accent": theme.colors.accent,
    "--background": theme.colors.background,
    "--surface": theme.colors.surface,
    "--text": theme.colors.text,
    "--border-radius": borderRadiusValue,
    fontFamily: theme.fontFamily,
    backgroundColor: "var(--background)",
    color: "var(--text)",
  } as React.CSSProperties;

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-white" style={containerStyle}>
      {/* Dynamic Font Loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={fontUrl} />

      <Header
        companyName={site.company_name}
        phone={site.phone || ""}
        hasPortfolio={hasPortfolio}
        hasRental={hasRental}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer
        companyName={site.company_name}
        phone={site.phone || ""}
        address={site.address || ""}
        extraConfigs={site.extra_configs}
      />
    </div>
  );
}
