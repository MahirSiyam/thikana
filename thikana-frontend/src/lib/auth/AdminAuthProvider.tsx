"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { getMe, type MeUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { adminAuth } from "@/lib/firebase/firebase";

type AdminAuthContextValue = {
  firebaseUser: FirebaseUser | null;
  profile: MeUser | null;
  loading: boolean;
  refreshProfile: () => Promise<MeUser | null>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!adminAuth.currentUser) {
      setProfile(null);
      return null;
    }

    try {
      const me = await getMe("admin");
      setProfile(me);
      return me;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setProfile(null);
        return null;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch (error) {
        console.error("Failed to load admin auth profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      loading,
      refreshProfile,
    }),
    [firebaseUser, profile, loading, refreshProfile]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
