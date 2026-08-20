"use client";

import { useState, useEffect } from "react";
import { COMPANY_INFO } from "./constants";
import { createClient } from "@/utils/supabase/client";

export function useCompanyInfo() {
  const [info, setInfo] = useState(COMPANY_INFO);

  useEffect(() => {
    const supabase = createClient();

    async function fetchSiteInfo() {
      try {
        const { data: site } = await supabase
          .from("client_sites")
          .select("company_name, phone, address, extra_configs")
          .eq("brand_id", "sotongcheum")
          .maybeSingle();

        if (site) {
          setInfo((prev) => ({
            ...prev,
            name: site.company_name || prev.name,
            brandName: site.company_name || prev.brandName,
            ceo: site.extra_configs?.representative_name || prev.ceo,
            phone: site.phone || prev.phone,
            address: site.address || prev.address,
            fax: site.extra_configs?.fax || prev.fax,
            email: site.extra_configs?.email || prev.email,
            licenseNumber: site.extra_configs?.business_number || prev.licenseNumber,
            greetings: site.extra_configs?.greetings || prev.greetings,
          }));
        }
      } catch (err) {
        console.error("Failed to load dynamic company info:", err);
      }
    }

    fetchSiteInfo();
  }, []);

  return info;
}
