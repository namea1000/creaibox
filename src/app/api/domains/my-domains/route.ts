import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export interface UserDomainInfo {
  domain: string;
  type: "custom" | "subdomain";
  source: "purchased" | "connected" | "subdomain";
  isPrimary?: boolean;
  status?: string;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ success: true, domains: [] });
    }

    const domainSet = new Map<string, UserDomainInfo>();

    // 1. Fetch Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("brand_id, custom_domain, extra_configs")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      // Primary custom domain
      if (profile.custom_domain && typeof profile.custom_domain === "string") {
        const d = profile.custom_domain.toLowerCase().trim();
        domainSet.set(d, { domain: d, type: "custom", source: "connected", isPrimary: true });
      }

      // Primary brand subdomain
      if (profile.brand_id && typeof profile.brand_id === "string") {
        const sub = `${profile.brand_id.toLowerCase().trim()}.creaibox.com`;
        domainSet.set(sub, { domain: sub, type: "subdomain", source: "subdomain", isPrimary: true });
      }

      const extra = profile.extra_configs || {};

      // Purchased domains
      if (Array.isArray(extra.purchased_domains)) {
        extra.purchased_domains.forEach((item: any) => {
          const dName = typeof item === "string" ? item : item?.domain;
          if (dName && typeof dName === "string") {
            const cleanD = dName.toLowerCase().trim();
            domainSet.set(cleanD, { domain: cleanD, type: "custom", source: "purchased" });
          }
        });
      }

      // Extra custom domains (e.g. custom_domain_golfgosu)
      Object.keys(extra).forEach((key) => {
        if (key.startsWith("custom_domain_") && typeof extra[key] === "string" && extra[key].includes(".")) {
          const d = extra[key].toLowerCase().trim();
          if (!domainSet.has(d)) {
            domainSet.set(d, { domain: d, type: "custom", source: "connected" });
          }
        }
        if (key === "domain_payment_" && typeof extra[key] === "object") {
          // domain payment info
        }
      });
    }

    // 2. Fetch Client Sites
    const { data: clientSites } = await supabase
      .from("client_sites")
      .select("brand_id, custom_domain, status, extra_configs")
      .eq("profile_id", user.id);

    if (clientSites && clientSites.length > 0) {
      clientSites.forEach((site) => {
        if (site.custom_domain && typeof site.custom_domain === "string") {
          const d = site.custom_domain.toLowerCase().trim();
          domainSet.set(d, {
            domain: d,
            type: "custom",
            source: "connected",
            status: site.status,
          });
        }
        if (site.brand_id && typeof site.brand_id === "string") {
          const sub = `${site.brand_id.toLowerCase().trim()}.creaibox.com`;
          if (!domainSet.has(sub)) {
            domainSet.set(sub, {
              domain: sub,
              type: "subdomain",
              source: "subdomain",
              status: site.status,
            });
          }
        }
      });
    }

    const domainList = Array.from(domainSet.values());

    return NextResponse.json({
      success: true,
      domains: domainList,
    });
  } catch (err: any) {
    console.error("GET /api/domains/my-domains error:", err);
    return NextResponse.json({ success: false, error: err.message, domains: [] }, { status: 500 });
  }
}
