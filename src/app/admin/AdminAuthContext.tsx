"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "namjang7720@gmail.com",
];

interface AdminAuthContextType {
  isAdmin: boolean;
  adminEmail: string;
  userId: string;
  isCheckingAuth: boolean;
  refreshAdminAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  adminEmail: "",
  userId: "",
  isCheckingAuth: true,
  refreshAdminAuth: async () => {},
});

// Fast in-memory RAM cache across admin route transitions (0ms Instant Load)
let cachedAdminState: {
  isAdmin: boolean;
  adminEmail: string;
  userId: string;
  timestamp: number;
} | null = null;

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (cachedAdminState && Date.now() - cachedAdminState.timestamp < 1000 * 60 * 30) {
      return cachedAdminState.isAdmin;
    }
    return false;
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    if (cachedAdminState && Date.now() - cachedAdminState.timestamp < 1000 * 60 * 30) {
      return cachedAdminState.adminEmail;
    }
    return "";
  });

  const [userId, setUserId] = useState<string>(() => {
    if (cachedAdminState && Date.now() - cachedAdminState.timestamp < 1000 * 60 * 30) {
      return cachedAdminState.userId;
    }
    return "";
  });

  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(() => {
    return !cachedAdminState || Date.now() - cachedAdminState.timestamp >= 1000 * 60 * 30;
  });

  const checkAdminAuth = async () => {
    try {
      // 1. Fast local session check first (0ms)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      let currentUser = session?.user;

      if (!currentUser) {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        currentUser = authUser;
      }

      if (!currentUser) {
        setIsCheckingAuth(false);
        router.replace("/");
        return;
      }

      const email = currentUser.email || "";
      let hasAdminAccess = ADMIN_EMAILS.includes(email.toLowerCase().trim());

      if (!hasAdminAccess) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profile && (profile.role === "ADMIN" || profile.role === "SUPER_ADMIN")) {
          hasAdminAccess = true;
        }
      }

      if (!hasAdminAccess) {
        setIsCheckingAuth(false);
        alert("⚠️ 슈퍼 어드민 전용 구역입니다.");
        router.replace("/");
        return;
      }

      cachedAdminState = {
        isAdmin: true,
        adminEmail: email,
        userId: currentUser.id,
        timestamp: Date.now(),
      };

      setIsAdmin(true);
      setAdminEmail(email);
      setUserId(currentUser.id);
    } catch (err) {
      console.error("Admin auth check error:", err);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (!cachedAdminState || Date.now() - cachedAdminState.timestamp >= 1000 * 60 * 30) {
      checkAdminAuth();
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        adminEmail,
        userId,
        isCheckingAuth,
        refreshAdminAuth: checkAdminAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
