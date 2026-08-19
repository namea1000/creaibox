"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export type SiteBuilderContextType = {
  profile: any;
  sites: any[];
  selectedSite: any;
  setSelectedSite: (site: any) => void;
  isCreatingNewSite: boolean;
  setIsCreatingNewSite: (val: boolean) => void;
  loading: boolean;
  refreshData: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: (val: boolean) => void;
  requireAuth: (action?: () => void) => boolean;
};

const SiteBuilderContext = createContext<SiteBuilderContextType | undefined>(undefined);

export function SiteBuilderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isCreatingNewSite, setIsCreatingNewSite] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const supabase = createClient();

  const requireAuth = (action?: () => void): boolean => {
    if (!profile) {
      setShowLoginModal(true);
      return false;
    }
    if (action) action();
    return true;
  };

  const refreshData = async () => {
    setLoading(true);

    // 3-second safety guard timeout to prevent infinite pending loading state
    const safetyTimeout = setTimeout(() => {
      console.warn("refreshData took too long. Disabling loading spinner via safety timeout.");
      setLoading(false);
    }, 3000);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        setLoading(false);
        clearTimeout(safetyTimeout);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, membership_level, role, brand_id, extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(profileData);

      if (profileData) {
        let { data: sitesData, error: sitesError } = await supabase
          .from("client_sites")
          .select("*")
          .eq("profile_id", profileData.id)
          .order("created_at", { ascending: false });

        if (sitesError) throw sitesError;
        sitesData = sitesData ? [...sitesData] : [];

        // Auto-bridge & sync: If profile has a brand_id (e.g. 'sotongcheum') that is not yet in client_sites
        if (profileData.brand_id) {
          const cleanBrandId = profileData.brand_id.toLowerCase().trim();
          const existingSite = sitesData.find((s: any) => s.brand_id?.toLowerCase() === cleanBrandId);

          if (!existingSite) {
            // 1) Check if a client_sites record exists for this brand_id under any profile_id
            const { data: brandSite } = await supabase
              .from("client_sites")
              .select("*")
              .eq("brand_id", cleanBrandId)
              .maybeSingle();

            if (brandSite) {
              if (brandSite.profile_id !== profileData.id) {
                await supabase
                  .from("client_sites")
                  .update({ profile_id: profileData.id })
                  .eq("id", brandSite.id);
                brandSite.profile_id = profileData.id;
              }
              sitesData.unshift(brandSite);
            } else {
              // 2) Auto-register client_sites record for this brand_id
              const defaultCompany = cleanBrandId === "sotongcheum" ? "소통과 채움" : (profileData.extra_configs?.company_name || cleanBrandId);
              const defaultPhone = cleanBrandId === "sotongcheum" ? "031-292-3806" : (profileData.extra_configs?.phone || "");
              const defaultAddress = cleanBrandId === "sotongcheum" ? "경기도 화성시 봉담읍 동화길 51, 401호" : (profileData.extra_configs?.address || "");

              const { data: newSite, error: insertErr } = await supabase
                .from("client_sites")
                .insert({
                  profile_id: profileData.id,
                  brand_id: cleanBrandId,
                  company_name: defaultCompany,
                  phone: defaultPhone,
                  address: defaultAddress,
                  status: "ACTIVE",
                  template_id: "custom",
                  theme_vibe: "MODERN",
                  extra_configs: profileData.extra_configs || {}
                })
                .select()
                .maybeSingle();

              if (!insertErr && newSite) {
                sitesData.unshift(newSite);
              }
            }
          }
        }

        setSites(sitesData);

        if (sitesData && sitesData.length > 0) {
          setSelectedSite((prev: any) => {
            if (prev) {
              const exists = sitesData.find((s: any) => s.id === prev.id);
              if (exists) return exists;
            }
            return sitesData[0];
          });
        } else {
          setSelectedSite(null);
        }
      }
    } catch (err) {
      console.error("Error loading user and site details:", err);
    } finally {
      clearTimeout(safetyTimeout);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <SiteBuilderContext.Provider
      value={{
        profile,
        sites,
        selectedSite,
        setSelectedSite,
        isCreatingNewSite,
        setIsCreatingNewSite,
        loading,
        refreshData,
        showLoginModal,
        setShowLoginModal,
        requireAuth,
      }}
    >
      {children}
    </SiteBuilderContext.Provider>
  );
}

export function useSiteBuilder() {
  const context = useContext(SiteBuilderContext);
  if (context === undefined) {
    throw new Error("useSiteBuilder must be used within a SiteBuilderProvider");
  }
  return context;
}
