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
};

const SiteBuilderContext = createContext<SiteBuilderContextType | undefined>(undefined);

export function SiteBuilderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isCreatingNewSite, setIsCreatingNewSite] = useState(false);

  const supabase = createClient();

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
        .select("id, membership_level, role")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(profileData);

      if (profileData) {
        const { data: sitesData, error: sitesError } = await supabase
          .from("client_sites")
          .select("*")
          .eq("profile_id", profileData.id)
          .order("created_at", { ascending: false });

        if (sitesError) throw sitesError;

        setSites(sitesData || []);

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
