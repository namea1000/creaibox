import React from "react";
import { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/server";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CustomHeaderWrapper from "../../components/CustomHeaderWrapper";
import UniversalVideoModal from "../../components/UniversalVideoModal";
import { injectMenusIntoHtml } from "@/utils/htmlInjector";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ brand_id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ brand_id: string }> }): Promise<Metadata> {
  const { brand_id } = await params;
  const supabase = await createAdminClient();

  const { data: site } = await supabase
    .from("client_sites")
    .select("company_name, extra_configs")
    .eq("brand_id", brand_id.toLowerCase())
    .maybeSingle();

  const title = site?.extra_configs?.site_title || site?.company_name || `${brand_id} 공식 홈페이지`;
  const description = site?.extra_configs?.site_description || `${title} 공식 홈페이지에 오신 것을 환영합니다.`;
  const ogImageUrl = site?.extra_configs?.og_image || site?.extra_configs?.hero_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";

  return {
    title: `${title} - 공식 홈페이지`,
    description,
    openGraph: {
      title,
      description,
      url: `https://${brand_id}.creaibox.com`,
      siteName: title,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function DynamicRendererLayout({ children, params }: LayoutProps) {
  const { brand_id } = await params;
  const supabase = await createAdminClient();

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

  // 2. Fetch sections to derive header menus and feature flags
  const { data: sections = [] } = await supabase
    .from("site_sections")
    .select("section_type, title, sort_order")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true });

  const hasPortfolio = (sections || []).some(s => s.section_type === "portfolio");
  const hasRental = (sections || []).some(s => s.section_type === "rental");

  // Derive dynamic menus from subpage sections
  const dynamicMenus = (sections || [])
    .filter(s => s.section_type.startsWith("subpage_"))
    .map(s => ({
      label: s.title || "새 메뉴",
      path: s.section_type.replace("subpage_", "")
    }));

  // Do not inject subpages into header for migrated sites to perfectly preserve original Mega Menus.
  const menusToInject = site.creation_source === "migration" ? [] : dynamicMenus;

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
    <div className="flex flex-col min-h-screen text-slate-900 bg-white" style={containerStyle} suppressHydrationWarning={true}>
      {/* Dynamic Font Loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={fontUrl} />

      {/* Tailwind CDN for dynamically generated custom layouts (AI Migration) */}
      {(site.extra_configs?.is_custom_layout || site.creation_source === "migration") && (
        <script src="https://cdn.tailwindcss.com"></script>
      )}

      {/* Header Rendering Strategy:
          1. If site has a custom 'header_html', we use it to preserve the beautiful AI design.
             We dynamically parse the HTML and inject the derived 'dynamicMenus' into it.
          2. Otherwise, we fallback to the standard <Header> component. */}
      {site.extra_configs?.is_custom_layout && site.extra_configs?.header_html ? (
        <CustomHeaderWrapper 
          html={injectMenusIntoHtml(site.extra_configs.header_html, menusToInject)}
          menus={menusToInject}
        />
      ) : (
        <Header
          companyName={site.company_name}
          phone={site.phone || ""}
          hasPortfolio={hasPortfolio}
          hasRental={hasRental}
          menus={menusToInject.length > 0 ? menusToInject : undefined}
        />
      )}
      <main className="flex-grow">
        {children}
      </main>
      {site.extra_configs?.is_custom_layout && site.extra_configs?.footer_html ? (
        <div dangerouslySetInnerHTML={{ __html: site.extra_configs.footer_html }} suppressHydrationWarning={true} />
      ) : (
        <Footer
          companyName={site.company_name}
          phone={site.phone || ""}
          address={site.address || ""}
          extraConfigs={site.extra_configs}
        />
      )}

      {/* Global Interactive Video Modal for YouTube Ads & Promos */}
      <UniversalVideoModal />
    </div>
  );
}
